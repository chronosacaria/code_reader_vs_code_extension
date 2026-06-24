import * as vscode from 'vscode';
import { ReaderDiagnostic, ReaderDiagnosticSeverity } from "./model";

export function collectDiagnosticsForDocument(document: vscode.TextDocument): ReaderDiagnostic[]{
    const vscodeDiagnostics = vscode.languages.getDiagnostics(document.uri);

    return vscodeDiagnostics.map((diagnostic) => {
        const startLine = diagnostic.range.start.line;
        const endLine = getInclusiveEndLine(diagnostic.range);

        const readerDiagnostic: ReaderDiagnostic = {
            severity: mapDiagnosticSeverity(diagnostic.severity),
            message: diagnostic.message,
            start_line: startLine,
            end_line: endLine
        };

        if (diagnostic.source && diagnostic.source.trim().length > 0) {
            readerDiagnostic.source = diagnostic.source;
        }

        const code = diagnosticCodeToString(diagnostic.code);

        if (code !== undefined && code.trim().length > 0) {
            readerDiagnostic.code = code;
        }

        return readerDiagnostic;
    });
};

function getInclusiveEndLine(range: vscode.Range): number {
    if (range.end.line > range.start.line && range.end.character === 0) {
        return range.end.line - 1;
    }
    return range.end.line;
}

function mapDiagnosticSeverity(severity: vscode.DiagnosticSeverity): ReaderDiagnosticSeverity {
    switch (severity) {
        case vscode.DiagnosticSeverity.Error: return "error";
        case vscode.DiagnosticSeverity.Warning: return "warning";
        case vscode.DiagnosticSeverity.Information: return "information";
        case vscode.DiagnosticSeverity.Hint: return "hint";
        default: return "information";
    }
}

export function diagnosticCodeToString(
    code: vscode.Diagnostic["code"]
): string | undefined {
    if (code === undefined) {
        return undefined;
    }

    if (typeof code === "string" || typeof code === "number") {
        return String(code);
    }

    return String(code.value);
}