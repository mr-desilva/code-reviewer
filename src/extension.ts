import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';

export async function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'code-reviewer.review',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return vscode.window.showInformationMessage('No active editor');
      }

      const selectedText = editor.document
        .getText(editor.selection)
        .trim();
      if (!selectedText) {
        return vscode.window.showInformationMessage(
          'Please select some code to review'
        );
      }

      // 1) Read user setting
      const config = vscode.workspace.getConfiguration('codeReviewer');
      let guidelinesPath = config.get<string>('guidelinesPath') || '';

      let guidelines = '';
      // 2) If user provided a path, try to load it first
      if (guidelinesPath) {
        // allow workspace-relative
        if (!path.isAbsolute(guidelinesPath) && vscode.workspace.workspaceFolders) {
          guidelinesPath = path.join(
            vscode.workspace.workspaceFolders[0].uri.fsPath,
            guidelinesPath
          );
        }
        try {
          guidelines = await fs.readFile(guidelinesPath, 'utf8');
        } catch (err) {
          vscode.window.showWarningMessage(
            `Could not load custom guidelines from ${guidelinesPath}, using default.`
          );
        }
      }

      // 3) Fall back to built-in default if custom failed or blank
      if (!guidelines) {
        const defaultMd = context.asAbsolutePath(
          path.join('default-prompts', 'CODE_REVIEW_GUIDELINES.md')
        );
        try {
          guidelines = await fs.readFile(defaultMd, 'utf8');
        } catch {
          // just leave it empty if something really went wrong
          guidelines = '';
        }
      }

      // 4) Build the prompt
      const prompt = [
        `Please review the following code:`,
        '',
        selectedText,
        '',
        `Use these guidelines:`,
        guidelines
      ].join('\n');

      // 5) Open Copilot Chat pre-filled
      try {
        await vscode.commands.executeCommand(
          'workbench.action.chat.open',
          prompt
        );
      } catch {
        vscode.window.showErrorMessage(
          'Unable to invoke GitHub Copilot Chat.'
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
