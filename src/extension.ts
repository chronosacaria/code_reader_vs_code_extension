import * as vscode from "vscode";
import { CoreClient } from "./coreClient";
import { registerReaderCommands } from "./commands";
import { createOutputWriter } from "./output";
import { SpeechService } from "./speech";

export function activate(context: vscode.ExtensionContext): void {
    const output = createOutputWriter(context);
    const coreClient = new CoreClient(context, output);
    const speechService = new SpeechService(output);

    registerReaderCommands(
        context,
        coreClient,
        speechService,
        output
    );
}

export function deactivate(): void { /*Nothing to clean up yet.*/ }