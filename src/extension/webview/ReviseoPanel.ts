import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { VsCodeStoragePersonaStore } from '../VsCodeStoragePersonaStore';
import { buildPrompt } from '../../core/promptBuilder';
import type { WebviewMessage } from '../../core/types';
import { getWebviewHtml } from './htmlTemplate';

export class ReviseoPanel {
    public static currentPanel: ReviseoPanel | undefined;
    private static readonly viewType = 'reviseo';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _store: VsCodeStoragePersonaStore;
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
                const text = buildPrompt(message.prUrl, selected);
                this._panel.webview.postMessage({ type: 'promptGenerated', text });
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
        return getWebviewHtml(nonce, cspSource);
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
