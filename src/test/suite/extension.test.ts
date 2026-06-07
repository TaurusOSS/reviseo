import * as assert from 'assert';
import * as vscode from 'vscode';
import { ReviseoPanel } from '../../extension/webview/ReviseoPanel';

const REVISEO_COMMANDS = [
    'reviseo.openPanel',
    'reviseo.managePersonas',
    'reviseo.generatePrompt',
] as const;

suite('Extension Test Suite', () => {
    suiteSetup(async () => {
        const ext = vscode.extensions.all.find(e => e.packageJSON?.name === 'reviseo-ai-code-review');
        if (ext && !ext.isActive) {
            await ext.activate();
        }
    });

    teardown(() => {
        ReviseoPanel.currentPanel?.dispose();
    });

    suiteTeardown(() => {
        vscode.window.showInformationMessage('All tests done!');
    });

    test('all reviseo commands are registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        for (const cmd of REVISEO_COMMANDS) {
            assert.ok(commands.includes(cmd), `Expected command '${cmd}' to be registered`);
        }
    });

    test('reviseo.openPanel creates the webview panel', async () => {
        await vscode.commands.executeCommand('reviseo.openPanel');
        assert.ok(ReviseoPanel.currentPanel !== undefined, 'Panel should exist after openPanel');
    });

    test('reviseo.managePersonas creates the webview panel', async () => {
        await vscode.commands.executeCommand('reviseo.managePersonas');
        assert.ok(ReviseoPanel.currentPanel !== undefined, 'Panel should exist after managePersonas');
    });

    test('reviseo.generatePrompt creates the webview panel', async () => {
        await vscode.commands.executeCommand('reviseo.generatePrompt');
        assert.ok(ReviseoPanel.currentPanel !== undefined, 'Panel should exist after generatePrompt');
    });

    test('opening panel multiple times reuses the same instance', async () => {
        await vscode.commands.executeCommand('reviseo.openPanel');
        const first = ReviseoPanel.currentPanel;
        await vscode.commands.executeCommand('reviseo.openPanel');
        assert.strictEqual(ReviseoPanel.currentPanel, first, 'Second call should reuse existing panel');
    });
});
