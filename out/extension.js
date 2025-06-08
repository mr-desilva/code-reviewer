"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const path = require("path");
const fs_1 = require("fs");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const disposable = vscode.commands.registerCommand('code-reviewer.review', () => __awaiter(this, void 0, void 0, function* () {
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
                    guidelines = yield fs_1.promises.readFile(file, 'utf8');
                }
                catch (_a) {
                    // ignore missing guidelines file
                }
            }
            const prompt = `Please review the following code:\n\n${selectedText}\n\nUse these guidelines:\n${guidelines}`;
            try {
                yield vscode.commands.executeCommand('github.copilotChat.ask', prompt);
            }
            catch (_b) {
                vscode.window.showErrorMessage('Unable to invoke GitHub Copilot Chat.');
            }
        }));
        context.subscriptions.push(disposable);
    });
}
function deactivate() { }
//# sourceMappingURL=extension.js.map
