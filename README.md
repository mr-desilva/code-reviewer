# Code Reviewer VS Code Extension

This repository contains a minimal VS Code extension that lets you highlight code and send it to GitHub Copilot Chat for review. The extension loads instructions from `CODE_REVIEW_GUIDELINES.md` in your workspace and prefaces the chat request with those guidelines.

## Usage
1. Place your custom review guidelines in `CODE_REVIEW_GUIDELINES.md` at the root of your project.
2. Run the command **Run Smart Code Reviewer** from the command palette or the editor context menu after selecting some code.
3. GitHub Copilot Chat will open with the selected code and your guidelines included in the prompt.

## Development
Run `npm install` followed by `npm run compile` to build the extension.
