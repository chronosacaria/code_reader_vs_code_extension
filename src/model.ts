export type ReadRequest = 
    | "current_line"
    | "current_symbol"
    | "current_scope"
    | "diagnostics_near_cursor";

export type ReaderDiagnosticSeverity =
    | "error"
    | "warning"
    | "information"
    | "hint";

export interface ReaderDiagnostic {
    severity: ReaderDiagnosticSeverity;
    message: string;
    start_line: number;
    end_line?: number;
    source?: string;
    code?: string;
}

export interface ReaderInput {
    language: string;
    source: string;
    cursor_line: number;
    cursor_column: number;
    request: ReadRequest;
    diagnostics: ReaderDiagnostic[];
}

export interface ReaderOutput {
    speech: string;
}