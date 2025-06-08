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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs_1 = require("fs");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const disposable = vscode.commands.registerCommand('code-reviewer.review', () => __awaiter(this, void 0, void 0, function* () {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return vscode.window.showInformationMessage('No active editor');
            }
            const selectedText = editor.document
                .getText(editor.selection)
                .trim();
            if (!selectedText) {
                return vscode.window.showInformationMessage('Please select some code to review');
            }
            // 1) Read user setting
            const config = vscode.workspace.getConfiguration('codeReviewer');
            let guidelinesPath = config.get('guidelinesPath') || '';
            let guidelines = '';
            // 2) If user provided a path, try to load it first
            if (guidelinesPath) {
                // allow workspace-relative
                if (!path.isAbsolute(guidelinesPath) && vscode.workspace.workspaceFolders) {
                    guidelinesPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, guidelinesPath);
                }
                try {
                    guidelines = yield fs_1.promises.readFile(guidelinesPath, 'utf8');
                }
                catch (err) {
                    vscode.window.showWarningMessage(`Could not load custom guidelines from ${guidelinesPath}, using default.`);
                }
            }
            // 3) Fall back to built-in default if custom failed or blank
            if (!guidelines) {
                const defaultMd = context.asAbsolutePath(path.join('media', 'CODE_REVIEW_GUIDELINES.md'));
                try {
                    guidelines = yield fs_1.promises.readFile(defaultMd, 'utf8');
                }
                catch (_a) {
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
                yield vscode.commands.executeCommand('workbench.action.chat.open', prompt);
            }
            catch (_b) {
                vscode.window.showErrorMessage('Unable to invoke GitHub Copilot Chat.');
            }
        }));
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map