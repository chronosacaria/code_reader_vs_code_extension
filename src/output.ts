import * as vscode from "vscode";
import { ReaderDiagnostic } from "./model";

export class OutputWriter {
    constructor(private readonly outputChannel: vscode.OutputChannel) {}

    clear(): void {
        this.outputChannel.clear();
    }

    show(preserveFocus = true): void {
        this.outputChannel.show(preserveFocus);
    }

    appendLineWithMessage(message: string): void {
        this.outputChannel.appendLine(message);
    }

    appendBlankLine(): void {
        this.outputChannel.appendLine("");
    }

    appendHorizontalRule(): void {
        this.appendLineWithMessage("----------------------------------------");
    }

    appendDiagnosticsDebug(diagnostics: ReaderDiagnostic[]): void {
        if (diagnostics.length === 0) {
            return;
        }

        this.appendLineWithMessage("Diagnostics detail:");

        diagnostics.forEach((diagnostic, index) => {
            const editorLine = diagnostic.start_line + 1;
            const endLine = diagnostic.end_line === undefined
                ? diagnostic.start_line
                : diagnostic.end_line;

            const editorEndLine = endLine + 1;

            this.appendLineWithMessage(
                `  ${index + 1}. ${diagnostic.severity} on line ${editorLine}` +
                    (editorEndLine !== editorLine ? ` through ${editorEndLine}` : "")
            );

            if (diagnostic.source) { this.appendLineWithMessage(`     Source: ${diagnostic.source}`); }

            if (diagnostic.code) { this.appendLineWithMessage(`     Code: ${diagnostic.code}`); }

            this.appendLineWithMessage(`     Message: ${diagnostic.message}`);
        });

        this.appendBlankLine();
    }
}

export function createOutputWriter(context: vscode.ExtensionContext): OutputWriter {
    const outputChannel = vscode.window.createOutputChannel("Programming Screen Reader");

    context.subscriptions.push(outputChannel);

    return new OutputWriter(outputChannel);
}