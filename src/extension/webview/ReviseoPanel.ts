import * as vscode from 'vscode';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { VsCodeStoragePersonaStore } from '../VsCodeStoragePersonaStore';
import { ReviewGenerationFacade, PersonaReviewExecutionMode, generateLocalReviewTimestamp } from '../../core/review-generation';
import type { ReviewConfiguration } from '../../core/review-generation';
import { PersonaManagementFacade } from '../../core/persona-management';
import type { WebviewMessage, ReviewMode } from './types';
import { getWebviewHtml } from './htmlTemplate';
import type { WebviewTab } from './WebviewTab';
import { PersonasTab } from './tabs/personasTab';
import { ReviewTab } from './tabs/reviewTab';

const REVIEW_SETTINGS_KEY = 'reviseo.reviewSettings';
const LOCAL_REVIEW_SETTINGS_KEY = 'reviseo.localReviewSettings';
const ACTIVE_REVIEW_TAB_KEY = 'reviseo.activeReviewTab';
const DEFAULT_BASE_BRANCH = 'origin/main';

export class ReviseoPanel {
    public static currentPanel: ReviseoPanel | undefined;
    private static readonly viewType = 'reviseo';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _context: vscode.ExtensionContext;
    private readonly _store: VsCodeStoragePersonaStore;
    private readonly _reviewGen = new ReviewGenerationFacade();
    private readonly _personaMgmt = new PersonaManagementFacade();
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(context: vscode.ExtensionContext): void {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (ReviseoPanel.currentPanel) {
            ReviseoPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            ReviseoPanel.viewType,
            'Reviseo',
            column ?? vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            }
        );

        ReviseoPanel.currentPanel = new ReviseoPanel(panel, context);
    }

    private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
        this._panel = panel;
        this._context = context;
        this._store = new VsCodeStoragePersonaStore(context);
        this._store.seed();

        this._panel.webview.html = this._getHtml();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            (message: WebviewMessage) => this._handleMessage(message),
            null,
            this._disposables
        );
    }

    private _handleMessage(message: WebviewMessage): void {
        switch (message.type) {
            case 'getPersonas': {
                this._panel.webview.postMessage({ type: 'personasLoaded', personas: this._store.getAll() });
                break;
            }
            case 'savePersona': {
                this._store.save(message.persona);
                this._panel.webview.postMessage({ type: 'personasSaved', personas: this._store.getAll() });
                break;
            }
            case 'deletePersona': {
                this._store.delete(message.id);
                this._panel.webview.postMessage({ type: 'personasSaved', personas: this._store.getAll() });
                break;
            }
            case 'generatePrompt': {
                void (async () => {
                    const selected = this._store.getAll().filter(p => message.personaIds.includes(p.id));
                    const prNumber = message.prUrl.match(/\/pull\/(\d+)/)?.[1] ?? '0';
                    let skipPrDataFetchPhase = false;
                    const baseDir = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                    if (baseDir) {
                        const reviewDataPath = path.join(baseDir, '.ai', 'reviseo', prNumber, 'review_data.json');
                        const diffPath = path.join(baseDir, '.ai', 'reviseo', prNumber, 'diff.patch');
                        try {
                            await fs.access(reviewDataPath);
                            await fs.access(diffPath);
                            skipPrDataFetchPhase = true;
                        } catch {
                            skipPrDataFetchPhase = false;
                        }
                    }
                    const config: ReviewConfiguration = {
                        kind: 'github',
                        url: message.prUrl,
                        personas: selected,
                        personaReviewExecutionMode: message.promptOptions.multiAgent ? PersonaReviewExecutionMode.MULTI_AGENT : PersonaReviewExecutionMode.SINGLE_AGENT,
                        context: message.personaContext ?? {},
                        pendingReview: message.promptOptions.pendingReview,
                        skipCommentedIssues: message.promptOptions.skipCommentedIssues,
                        skipCleanup: message.promptOptions.skipCleanup,
                        skipPrDataFetchPhase,
                    };
                    this._panel.webview.postMessage({ type: 'promptGenerated', text: this._reviewGen.build(config) });
                })();
                break;
            }
            case 'generateLocalPrompt': {
                const selected = this._store.getAll().filter(p => message.personaIds.includes(p.id));
                const config: ReviewConfiguration = {
                    kind: 'local',
                    baseBranch: message.baseBranch,
                    timestamp: generateLocalReviewTimestamp(),
                    personas: selected,
                    personaReviewExecutionMode: message.multiAgent ? PersonaReviewExecutionMode.MULTI_AGENT : PersonaReviewExecutionMode.SINGLE_AGENT,
                    context: message.personaContext ?? {},
                    skipCleanup: message.skipCleanup,
                };
                this._panel.webview.postMessage({ type: 'promptGenerated', text: this._reviewGen.build(config) });
                break;
            }
            case 'getInitialState': {
                const github = this._context.globalState.get<{ multiAgent: boolean; pendingReview: boolean; skipCommentedIssues: boolean; skipCleanup: boolean }>(REVIEW_SETTINGS_KEY, { multiAgent: false, pendingReview: false, skipCommentedIssues: false, skipCleanup: false });
                const local = this._context.workspaceState.get<{ multiAgent: boolean; baseBranch: string; skipCleanup: boolean }>(LOCAL_REVIEW_SETTINGS_KEY, { multiAgent: false, baseBranch: DEFAULT_BASE_BRANCH, skipCleanup: false });
                const activeTab = this._context.workspaceState.get<ReviewMode>(ACTIVE_REVIEW_TAB_KEY, 'github');
                this._panel.webview.postMessage({ type: 'initialStateLoaded', github, local, activeTab });
                break;
            }
            case 'saveReviewSettings': {
                this._context.globalState.update(REVIEW_SETTINGS_KEY, { multiAgent: message.multiAgent, pendingReview: message.pendingReview, skipCommentedIssues: message.skipCommentedIssues, skipCleanup: message.skipCleanup });
                break;
            }
            case 'saveLocalReviewSettings': {
                this._context.workspaceState.update(LOCAL_REVIEW_SETTINGS_KEY, { multiAgent: message.multiAgent, baseBranch: message.baseBranch, skipCleanup: message.skipCleanup });
                break;
            }
            case 'saveActiveReviewTab': {
                void this._context.workspaceState
                    .update(ACTIVE_REVIEW_TAB_KEY, message.tab)
                    .then(undefined, err => console.error('reviseo: failed to save active tab', err));
                break;
            }
            case 'buildGenerationPrompt': {
                const prompt = this._personaMgmt.buildGenerationPrompt(message.name, message.description);
                this._panel.webview.postMessage({ type: 'generationPromptBuilt', prompt });
                break;
            }
            case 'copyToClipboard': {
                vscode.env.clipboard.writeText(message.text);
                break;
            }
            case 'fetchReviewData': {
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders || workspaceFolders.length === 0) {
                    void vscode.window.showErrorMessage('Reviseo: No workspace folder is open. Please open a folder before fetching PR data.');
                    break;
                }
                const prNumber = message.prUrl.match(/\/pull\/(\d+)/)?.[1] ?? '0';
                const jsonFields = message.skipCommentedIssues ? 'title,body,reviewThreads' : 'title,body';
                const commands = [
                    `mkdir -p .ai/reviseo/${prNumber}`,
                    `gh pr diff ${message.prUrl} > .ai/reviseo/${prNumber}/diff.patch`,
                    `gh pr view ${message.prUrl} --json ${jsonFields} > .ai/reviseo/${prNumber}/review_data.json`,
                ].join(' && ');
                let terminal = vscode.window.terminals.find(t => t.name === 'Reviseo');
                if (!terminal) {
                    terminal = vscode.window.createTerminal({ name: 'Reviseo', cwd: workspaceFolders[0].uri.fsPath });
                }
                terminal.show();
                terminal.sendText(commands);
                break;
            }
        }
    }

    private _getHtml(): string {
        const nonce = crypto.randomBytes(16).toString('hex');
        const cspSource = this._panel.webview.cspSource;
        const tabs: WebviewTab[] = [new PersonasTab(), new ReviewTab()];
        return getWebviewHtml(nonce, cspSource, tabs);
    }

    public dispose(): void {
        ReviseoPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const d = this._disposables.pop();
            if (d) { d.dispose(); }
        }
    }
}
