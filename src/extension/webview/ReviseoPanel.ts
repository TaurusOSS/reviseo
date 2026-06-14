import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { VsCodeStoragePersonaStore } from '../VsCodeStoragePersonaStore';
import { ReviewGenerationFacade, PersonaReviewExecutionMode } from '../../core/review-generation';
import { PersonaManagementFacade } from '../../core/persona-management';
import type { WebviewMessage } from './types';
import { getWebviewHtml } from './htmlTemplate';
import type { WebviewTab } from './WebviewTab';
import { PersonasTab } from './tabs/personasTab';
import { ReviewTab } from './tabs/reviewTab';

const REVIEW_SETTINGS_KEY = 'reviseo.reviewSettings';
const LOCAL_REVIEW_SETTINGS_KEY = 'reviseo.localReviewSettings';
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
                const selected = this._store.getAll().filter(p => message.personaIds.includes(p.id));
                const personaExecutionMode = message.promptOptions.multiAgent ? PersonaReviewExecutionMode.MULTI_AGENT : PersonaReviewExecutionMode.SINGLE_AGENT;
                const text = this._reviewGen.buildPrompt(message.prUrl, selected, personaExecutionMode, message.personaContext ?? {}, message.promptOptions.pendingReview);
                this._panel.webview.postMessage({ type: 'promptGenerated', text });
                break;
            }
            case 'generateLocalPrompt': {
                const selected = this._store.getAll().filter(p => message.personaIds.includes(p.id));
                const personaExecutionMode = message.multiAgent ? PersonaReviewExecutionMode.MULTI_AGENT : PersonaReviewExecutionMode.SINGLE_AGENT;
                const timestamp = this._generateTimestamp();
                const text = this._reviewGen.buildLocalPrompt(message.baseBranch, timestamp, selected, personaExecutionMode, message.personaContext ?? {});
                this._panel.webview.postMessage({ type: 'promptGenerated', text });
                break;
            }
            case 'getReviewSettings': {
                const settings = this._context.globalState.get<{ multiAgent: boolean; pendingReview: boolean }>(REVIEW_SETTINGS_KEY, { multiAgent: false, pendingReview: false });
                this._panel.webview.postMessage({ type: 'reviewSettingsLoaded', ...settings });
                break;
            }
            case 'saveReviewSettings': {
                this._context.globalState.update(REVIEW_SETTINGS_KEY, { multiAgent: message.multiAgent, pendingReview: message.pendingReview });
                break;
            }
            case 'getLocalReviewSettings': {
                const settings = this._context.workspaceState.get<{ multiAgent: boolean; baseBranch: string }>(LOCAL_REVIEW_SETTINGS_KEY, { multiAgent: false, baseBranch: DEFAULT_BASE_BRANCH });
                this._panel.webview.postMessage({ type: 'localReviewSettingsLoaded', ...settings });
                break;
            }
            case 'saveLocalReviewSettings': {
                this._context.workspaceState.update(LOCAL_REVIEW_SETTINGS_KEY, { multiAgent: message.multiAgent, baseBranch: message.baseBranch });
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
        }
    }

    private _getHtml(): string {
        const nonce = crypto.randomBytes(16).toString('hex');
        const cspSource = this._panel.webview.cspSource;
        const tabs: WebviewTab[] = [new PersonasTab(), new ReviewTab()];
        return getWebviewHtml(nonce, cspSource, tabs);
    }

    private _generateTimestamp(): string {
        return new Date().toISOString().replace(/\.\d{3}Z$/, '').replace(/:/g, '-');
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
