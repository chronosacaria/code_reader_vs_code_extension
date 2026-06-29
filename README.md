# Code Reader VS Code Extension (VERY WIP)

The Code Reader VS Code extension connects VS Code to the Code Reader Core so that blind and low vision
developers can request code-aware spoken feedback at various levels of their code from symbol, line, scope, etc.

## Goals

- Provide a VS Code interface for the (eventually) language-agnostic Code Reader Core.
- Send editor text, cursor position, and diagnostics to the Code Reader Core as structured JSON which
can then be read to the user.
- Return readable, speech-friendly descriptions of code instead of raw punctuation-heavy text.
- Support multiple request types, such as current line, current symbol, current scope, diagnostics, etc.
- Provide optional speech output while still showing results in a VS Code output channel.

## Commands

The following commands are added to VS Code by this extension:

| Command Palette Name                                    | Command ID                                          | Description                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Programming Screen Reader: Read Current Line            | `programmingScreenReader.readCurrentLine`           | Reads out a description of the current line.                                                   |
| Programming Screen Reader: Read Current Symbol          | `programmingScreenReader.readCurrentSymbol`         | Reads out the symbol or token that is under the cursor.                                        |
| Programming Screen Reader: Read Current Scope           | `programmingScreenReader.readCurrentScope`          | Reads out the current local scope, such as a function, class, loop or conditional block.       |
| Programming Screen Reader: Read Diagnostics Near Cursor | `programmingScreenReader.readDiagnosticsNearCursor` | Reads out any diagnostic information related to code that is near the current cursor position. |

## Default Keybind Shortcuts

The following keybind shortcuts[^1] are added to VS Code by this extension:

| Keybind                        | Command                                                 |
| ------------------------------ | ------------------------------------------------------- |
| `CTRL` + `SHIFT` + `ALT` + `1` | Programming Screen Reader: Read Current Line            |
| `CTRL` + `SHIFT` + `ALT` + `2` | Programming Screen Reader: Read Current Symbol          |
| `CTRL` + `SHIFT` + `ALT` + `3` | Programming Screen Reader: Read Current Scope           |
| `CTRL` + `SHIFT` + `ALT` + `4` | Programming Screen Reader: Read Diagnostics Near Cursor |

[^1]: These keybind shortcuts are temporary. These are their current states until more ergonomic combinations are determined.

## Settings

The following settings are added to VS Code by this extension:

| Setting                                  | Type      | Default Value | Description                                                                                                                                                                                                                                  |
| ---------------------------------------- | --------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `programmingScreenReader.coreBinaryPath` | `string`  | `""`          | The path to the compiled `code_reader_core` binary, which is built from the [Code Reader Core](https://github.com/chronosacaria/code_reader_core) repository. If it is empty, the extension will fall back to the local `cargo run` command. |
| `programmingScreenReader.speechEnabled`  | `boolean` | `false`       | This enables or disables speech output that is returned from the reader's output.                                                                                                                                                            |
| `programmingScreenReader.speechCommand`  | `string`  | `spd-say`     | This is the command that is used to call the command that performs the speech that is returned by the reader's output.                                                                                                                       |

Here is an example of what one's local user settings might look like:

```json
{ 
  "programmingScreenReader.coreBinaryPath": "/path/to/code_reader_core",
  "programmingScreenReader.speechEnabled": true,
  "programmingScreenReader.speechCommand": "spd-say"
}
```

For safety reasons, it is essential that the `coreBinaryPath` setting points to a **trusted local binary**.
The reason for this is that the extension sends the active information that is being provided by VS Code to
the configured core binary. This allows for the code-aware speech output, but it also means that there are
data being sent back and forth.

## Example of Intention

The primary intention of this extention is that it would give the user meaningful code-aware feedback
without requiring them to listen to every punctuation character, indentation level, raw syntax token,
etc. unless a more detailed verbosity mode is requested later.

Python Example:

```python
def calculate_total(price: float, tax_rate: float = 0.19) -> float:
    return price * tax_rate
```

If the cursor is anywhere on the `return` line and the user runs: `Programming Screen Reader: Read Current Line`

The extension should send the active editor text, cursor line, cursor column, language ID,
diagnostics, and request type to the Code Reader Core. (This will probably be expanded and sectioned
off later on.)

The intended speech output, in this case, would be:

```text
Current line: return price multiplied by tax rate.
```

If the cursor is on `tax_rate` and the user runs: `Programming Screen Reader: Read Current Symbol`

The intended speech output, in this case, would be:

```text
Symbol tax rate.
```

If the user runs: `Programming Screen Reader: Read Current Scope`

The intended speech output, in this case, would be:

```text
Current scope: function calculate total.
```

If the code that is being output happens to contain some kind of diagnostic information from an
error, for example, such as:

```python
def calculate_total(price: float, tax_rate: float = 0.19) -> float:
    return price * taxrate
```

VS Code reports (through whatever linting methods are being used by the user) that `taxrate` is
undefined since there is a typo in the symbol.

Furthermore running: `Programming Screen Reader: Read Diagnostics Near Cursor` produces something
along the lines of:

```text
Warning on current line: taxrate is not defined.
```

This needs to be better fleshed out so that it is easy for the user to be able to know *what*
specifically is wrong. But that is something that will come as the extension and core are developed.

## Artificial Intelligence (AI) Usage Disclosure

As I am blind, I have found that using AI to check behind me with my code to be extremely useful.
Whilst I do not intend to vibe-code this application, I believe that it is important to disclose
when AI is used in one's production pipeline. As such, this disclosure should serve as an indication
that this project is being created with the *assistance* of Artificial Intelligence, but that the
code is not being solely "created" and "provided" by the Artificial Intelligence that is being used.

An attempt has not been made to verify the usage of AI in the development of Dependencies or Visual
Studio Code Extensions.

## Dependencies Used

This list should not be considered exhaustive until the completion of this project. This list will
be updated as the project evolves. The names of the extensions, their license and any links to
repositiories shall be provided.

- `@types/node`
  - Authors: [Mirosoft and Node Contributors](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/3f4142e7fe92e9d74a9a4d5545d48c10418edd01/types/node/package.json#L26-#L122)
  - License: [MIT License](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/LICENSE)
  - Repo Link: [https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node)
  - Package [https://www.npmjs.com/package/@types/node](https://www.npmjs.com/package/@types/node)
- `@types/vscode`
  - Authors: [Visual Studio Code Team, Microsoft](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/3f4142e7fe92e9d74a9a4d5545d48c10418edd01/types/vscode/package.json#L15)
  - License: [MIT License](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/LICENSE)
  - Repo Link: [https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/vscode](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/vscode)
  - Package [https://www.npmjs.com/package/@types/node](https://www.npmjs.com/package/@types/node)
- `typescript`
  - Author: [Microsoft Corp.](https://github.com/microsoft/TypeScript/blob/main/package.json#L3)
  - License: [Apache 2.0](https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt)
  - Repo Link: [https://github.com/microsoft/TypeScript](https://github.com/microsoft/TypeScript)
- `undici-types`
  - Author: [Matteo Collina and Undici Contributors](https://github.com/nodejs/undici/blob/667d8a3a7496302ce6ede3e29f7fb1f3cc017082/package.json#L14-#L49)
  - License: [MIT License](https://github.com/nodejs/undici/blob/main/LICENSE)
  - Repo Link: [https://github.com/nodejs/undici](https://github.com/nodejs/undici)

## Visual Studio Code Extensions Used

This list should not be considered exhaustive until the completion of this project. This list will
be updated as the project evolves. The names of the extensions, their license and any links to
repositiories shall be provided.

- CodeLLDB
  - Author: Vadim Chugunov
  - License: [MIT License](https://github.com/vadimcn/codelldb/blob/master/LICENSE)
  - Repo Link: [https://github.com/vadimcn/codelldb/](https://github.com/vadimcn/codelldb/)
- Codex - OpenAI's coding agent
  - Author: OpenAI
  - License: [Apache 2.0](https://github.com/openai/codex/blob/master/LICENSE)
  - Repo Link: [https://github.com/openai/codex](https://github.com/openai/codex)
- Dependi
  - Author: Fill Labs
  - License: [Custom License](https://openvsx.eclipsecontent.org/fill-labs/dependi/0.7.22/LICENSE.txt)
  - Repo Link: [https://github.com/filllabs/dependi](https://github.com/filllabs/dependi)
- Error Lense
  - Author: Alexander
  - License: [MIT License](https://github.com/usernamehw/vscode-error-lens/blob/master/LICENSE)
  - Repo Link: [https://github.com/usernamehw/vscode-error-lens](https://github.com/usernamehw/vscode-error-lens)
- ESLint
  - Author: Microsoft
  - License: [MIT License](https://github.com/microsoft/vscode-eslint/blob/master/License.txt)
  - Repo Link: [https://github.com/Microsoft/vscode-eslint](https://github.com/Microsoft/vscode-eslint)
- GitHub Markdown Preview
  - Author: Matt Bierner
  - License: [MIT License](https://github.com/mjbvz/vscode-github-markdown-preview/blob/master/LICENSE)
  - Repo Link: [https://github.com/mjbvz/vscode-github-markdown-preview](https://github.com/mjbvz/vscode-github-markdown-preview)
- markdownlint
  - Author: David Anson
  - License: [MIT License](https://github.com/DavidAnson/vscode-markdownlint/blob/master/LICENSE)
  - Repo Link: [https://github.com/DavidAnson/vscode-markdownlint](https://github.com/DavidAnson/vscode-markdownlint)
- Prettier - Code formatter
  - Author: Prettier
  - License: [MIT License](https://github.com/prettier/prettier-vscode/blob/master/LICENSE)
  - Repo Link: [https://github.com/prettier/prettier-vscode](https://github.com/prettier/prettier-vscode)
