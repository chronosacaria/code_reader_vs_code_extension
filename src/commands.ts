import * as vscode from "vscode";
import { CoreClient } from "./coreClient";
import { collectDiagnosticsForDocument } from "./diagnostics";
import { ReaderInput, ReadRequest } from "./model";
import { OutputWriter } from "./output";
import { SpeechService } from "./speech";

export function registerReaderCommands(
    context: vscode.ExtensionContext,
    coreClient: CoreClient,
    speechService: SpeechService,
    output: OutputWriter
): void {
    // Read Current Line
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "programmingScreenReader.readCurrentLine",
            async () => {
                await readFromRustCore(
                    coreClient,
                    speechService,
                    output,
                    "current_line"
                );
            }
        )
    );

    // Read Current Symbol
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "programmingScreenReader.readCurrentSymbol",
            async () => {
                await readFromRustCore(
                    coreClient,
                    speechService,
                    output,
                    "current_symbol"
                );
            }
        )
    );

    // Read Current Scope
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "programmingScreenReader.readCurrentScope",
            async () => {
                await readFromRustCore(
                    coreClient,
                    speechService,
                    output,
                    "current_scope"
                );
            }
        )
    );

    // Read Diagnostics Near Cursor
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "programmingScreenReader.readDiagnosticsNearCursor",
            async () => {
                await readFromRustCore(
                    coreClient,
                    speechService,
                    output,
                    "diagnostics_near_cursor"
                );
            }
        )
    );
}

async function readFromRustCore(
    coreClient: CoreClient,
    speechService: SpeechService,
    output: OutputWriter, 
    request: ReadRequest
): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showWarningMessage(
            "Programming Screen Reader: No active text editor."
        );
        return;
    }

    const document = editor.document;
    const cursor = editor.selection.active;
    const diagnostics = collectDiagnosticsForDocument(document);

    const input: ReaderInput = {
        language: document.languageId,
        source: document.getText(),
        cursor_line: cursor.line,
        cursor_column: cursor.character,
        request,
        diagnostics
    };

    output.clear();
    output.show(true);

    output.appendLineWithMessage("Programming Screen Reader");
    output.appendHorizontalRule();
    output.appendLineWithMessage(`Language: ${input.language}`);
    output.appendLineWithMessage(`Editor position: Ln ${cursor.line + 1}, Col ${cursor.character + 1}`);
    output.appendLineWithMessage(`Core position: line ${input.cursor_line}, column ${input.cursor_column} zero-based`);
    output.appendLineWithMessage(`Request: ${input.request}`);
    output.appendLineWithMessage(`Diagnostics collected: ${input.diagnostics.length}`);
    output.appendDiagnosticsDebug(input.diagnostics);
    output.appendBlankLine();

    try {
        const result = await coreClient.run(input);

        output.appendLineWithMessage("Speech:");
        output.appendLineWithMessage(result.speech);
        output.appendBlankLine();

        await speechService.speakIfEnabled(result.speech);

        vscode.window.showInformationMessage(result.speech);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        output.appendLineWithMessage("Error:");
        output.appendLineWithMessage(message);

        vscode.window.showErrorMessage(
            "Programming Screen Reader failed. See output channel for details."
        );
    }
}