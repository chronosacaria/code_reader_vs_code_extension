import * as vscode from "vscode";
import { spawn } from "child_process";
import * as path from "path";
import { ReaderInput, ReaderOutput } from "./model";
import { OutputWriter } from "./output";

interface CoreProcessConfig {
    command: string;
    args: string[];
    cwd: string;
}

export class CoreClient {
    constructor(
        private readonly context: vscode.ExtensionContext,
        private readonly output: OutputWriter
    ) {}

    run(input: ReaderInput): Promise<ReaderOutput> {
        const extensionDirectory = this.context.extensionPath;
        const repoRoot = path.resolve(extensionDirectory, "..", "..");
        
        const configuration = vscode.workspace.getConfiguration(
            "programmingScreenReader"
        );
        
        const configuredBinaryPath = configuration
            .get<String>("coreBinaryPath", "")
            .trim();
    
        const processConfig = this.buildCoreProcessConfig(
            repoRoot,
            configuredBinaryPath
        );
    
        const inputJson = JSON.stringify(input);
    
        this.output.appendLineWithMessage("Core process:");
        this.output.appendLineWithMessage(`Command: ${processConfig.command}`);
        this.output.appendLineWithMessage(
            `Arguments: ${
                processConfig.args.length > 0
                    ? processConfig.args.join(" ")
                    : "(none)"
            }`
        );
        this.output.appendLineWithMessage(`Working directory: ${processConfig.cwd}`);
        this.output.appendBlankLine();
    
        return new Promise((resolve, reject) => {
            const child = spawn(
                processConfig.command,
                processConfig.args,
                {
                    cwd: processConfig.cwd
                }
            );
    
            let stdout = "";
            let stderr = "";
    
            child.stdout.setEncoding("utf8");
            child.stderr.setEncoding("utf8");
    
            child.stdout.on("data", (chunk: string) => {
                stdout += chunk;
            });
    
            child.stderr.on("data", (chunk: string) => {
                stderr += chunk;
            });
    
            child.on("error", (error: Error) => {
                reject(
                    new Error(
                    `Failed to start Rust core process: ${error.message}`
                    )
                );
            });
    
            child.on("close", (code: number | null) => {
                if (code !== 0) {
                    reject(
                    new Error(
                        [
                            `Rust core exited with code ${code}.`,
                            "",
                            "stderr:",
                            stderr.trim() || "(empty)",
                            "",
                            "stdout:",
                            stdout.trim() || "(empty)"
                        ].join("\n")
                    )
                );
                return;
            }
    
            try {
                const parsed = JSON.parse(stdout) as ReaderOutput;
    
                if (typeof parsed.speech !== "string") {
                    reject(
                        new Error(
                            `Rust core returned JSON, but it did not contain a speech string: ${stdout}`
                        )
                    );
                    return;
                }
    
                resolve(parsed);
            } catch (error: unknown) {
                const parseMessage = error instanceof Error 
                    ? error.message 
                    : String(error);
    
                reject(
                    new Error(
                        [
                        "Rust core returned invalid JSON.",
                        "",
                        `Parse error: ${parseMessage}`,
                        "",
                        "stderr:",
                        stderr.trim() || "(empty)",
                        "",
                        "stdout:",
                        stdout.trim() || "(empty)"
                        ].join("\n")
                    )
                );
            }});
            child.stdin.write(inputJson);
            child.stdin.end();
        });
    }
    
    private buildCoreProcessConfig(
        repoRoot: string,
        configuredBinaryPath: string
    ): CoreProcessConfig {
        if (configuredBinaryPath.length > 0) {
            return {
                command: configuredBinaryPath,
                args: [],
                cwd: repoRoot
            };
        }
    
        const cargoManifestPath = path.join(
            repoRoot,
            "crates",
            "code_reader_core",
            "Cargo.toml"
        );
    
        return {
            command: "cargo",
            args: [
                "run",
                "--quiet",
                "--manifest-path",
                cargoManifestPath
            ],
            cwd: repoRoot
        };
    }
}