import * as vscode from 'vscode';
import { ReviseoPanel } from './extension/webview/ReviseoPanel';

export function activate(context: vscode.ExtensionContext): void {
    const openPanel = vscode.commands.registerCommand('reviseo.openPanel', () => {
        ReviseoPanel.createOrShow(context);
    });

    const managePersonas = vscode.commands.registerCommand('reviseo.managePersonas', () => {
        ReviseoPanel.createOrShow(context);
    });

    const generatePrompt = vscode.commands.registerCommand('reviseo.generatePrompt', () => {
        ReviseoPanel.createOrShow(context);
    });

    context.subscriptions.push(openPanel, managePersonas, generatePrompt);
}

export function deactivate(): void {}
