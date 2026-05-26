import * as vscode from 'vscode';
import { translate } from '@vitalets/google-translate-api';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('quicktranslator.translateText', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; 
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);

        if (!text || text.trim() === '') {
            vscode.window.showWarningMessage('נא לסמן טקסט לתרגום');
            return;
        }

        try {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "מתרגם...",
                cancellable: false
            }, async () => {
                const res = await translate(text, { to: 'he' });
                
                const outputChannel = vscode.window.createOutputChannel("תרגום קופילוט");
                outputChannel.clear();
                outputChannel.append(res.text); 
                outputChannel.show(true);       
            });

        } catch (error) {
            vscode.window.showErrorMessage('שגיאה בחיבור למנוע התרגום');
            console.error(error);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}