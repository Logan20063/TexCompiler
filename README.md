# TeX Renderer

A TeX to HTML Compiler and Renderer

## Features:
- Superscript(\^)
- Subscript(\_)
- Fractions(\frac)
- Square Roots(\sqrt)
- Set Notation(\in, \notin)
- Greek letters(\epsilon, \delta)
- Arrows(\implied, \impliedby)
- Blackboard Bold(\mathbb{R}, N, C, Q, Z)

## Examples:
<img width="523" height="108" alt="Screenshot 2026-06-22 at 11 56 26 PM" src="https://github.com/user-attachments/assets/0205269f-fab7-4b6b-9ca0-a1749594e3f6" />

Code:

```tex
\forall \epsilon > 0 \exists \delta > 0 |x - x_0| < \delta \implies |f(x) - f(x_0)| < \epsilon
```
```tex
\forall x \in \mathbb{R}, x^2 \geq 0
```
```tex
\frac{dy}{dx} x^2 = 2x
```


## How To Run:
1. `git clone https://github.com/Logan20063/TexCompiler.git`
2. `cd TexCompiler`
3. run index.html

## Architecture
- **Tokenizer** Converts the input into an array of tokens (string -> Token[])
- **Bracket Parser** Groups the token array by braces recursively (Token[] -> BracketToken[])
- **Renderer** Turns the Bracket Token array into HTML (BracketToken[] -> HTML)
