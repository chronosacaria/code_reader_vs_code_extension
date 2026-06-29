import * as vscode from "vscode";
import { spawn } from "child_process";
import { OutputWriter } from "./output";

export class SpeechService {
    constructor(private readonly output: OutputWriter) {}

    speakIfEnabled(speech: string): Promise<void> {
        const configuration = vscode.workspace.getConfiguration(
            "programmingScreenReader"
        );
    
        const speechEnabled = configuration.get<boolean>(
            "speechEnabled",
            false
        );
    
        if (!speechEnabled) {
            this.output.appendLineWithMessage("Speech output: disabled");
            return Promise.resolve();
        }
    
        const speechCommand = configuration
            .get<string>("speechCommand", "spd-say")
            .trim();
        
        if (speechCommand.length === 0) {
            this.output.appendLineWithMessage(
                "Speech output: enabled, but no speech command is configured."
            );
            return Promise.resolve();
        }
    
        this.output.appendLineWithMessage("Speech output:");
        this.output.appendLineWithMessage(`Command: ${speechCommand}`);
        this.output.appendBlankLine();
    
        return new Promise((resolve) => {
            const child = spawn(speechCommand, [speech]);
    
            let stderr = "";
    
            child.stderr.setEncoding("utf-8");
    
            child.stderr.on("data", (chunk: string) => {
                stderr += chunk;
            });
    
            child.on("error", (error: Error) => {
                this.output.appendLineWithMessage("speech command failed to start:");
                this.output.appendLineWithMessage(error.message);
                this.output.appendBlankLine();
                resolve();
            });
    
            child.on("close", (code: number | null) => {
                if (code !== 0) {
                    this.output.appendLineWithMessage(`Speech command exited with code ${code}.`);
    
                    if (stderr.trim().length > 0) {
                        this.output.appendLineWithMessage("stderr:");
                        this.output.appendLineWithMessage(stderr.trim());
                    }
    
                    this.output.appendBlankLine();
                }
                resolve();
            });
    
            child.stdin.end();
        });
    }
}