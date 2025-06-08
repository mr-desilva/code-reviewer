import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';

export async function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('code-reviewer.review', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('No active editor');
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (selectedText.trim().length === 0) {
      vscode.window.showInformationMessage('Please select some code to review');
      return;
    }

    let guidelines = '';
    if (vscode.workspace.workspaceFolders) {
      const folder = vscode.workspace.workspaceFolders[0].uri.fsPath;
      const file = path.join(folder, 'CODE_REVIEW_GUIDELINES.md');
      try {
        guidelines = await fs.readFile(file, 'utf8');
      } catch {
        // ignore missing guidelines file
      }
    }

    const prompt = `Please review the following code:\n\n${selectedText}\n\nUse these guidelines:\n${guidelines}`;

    try {
      await vscode.commands.executeCommand('github.copilotChat.ask', prompt);
    } catch {
      vscode.window.showErrorMessage('Unable to invoke GitHub Copilot Chat.');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
