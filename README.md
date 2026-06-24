# Code Reader VS Code Extension

The Code Reader VS Code extension connects VS Code to the Code Reader Core so that blind and low vision
developers can request code-aware spoken feedback at various levels of their code from symbol, line, scope, etc.

## Goals

- Provide a VS Code interface for the (eventually) language-agnostic Code Reader Core.
- Send editor text, cursor position, and diagnostics to the Code Reader Core as structured JSON which
can then be read to the user.
- Return readable, speech-friendly descriptions of code instead of raw punctuation-heavy text.
- Support multiple request types, such as current line, current symbol, current scope, diagnostics, etc.
- Provide optional speech output while still showing results in a VS Code output channel.

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

- EXAMPLE_DEPENDENCY
  - Author: AUTHOR_NAME
  - Licenses: [LICENSE_NAME](https://randompicturegenerator.com/dog) (Link currently goes to a
  random picture generator of dogs)
  - Repo Link: [REPO_NAME](https://randompicturegenerator.com/cat) (Link currently goes to a
  random picture generator of cats)

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
