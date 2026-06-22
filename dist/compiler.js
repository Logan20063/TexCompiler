"use strict";
// type ASTNode = {
//     token: Token[],
//     children: ASTNode[]
// }
function tokenizer(input) {
    let output = [];
    for (let i = 0; i < input.length; i++) {
        if (input.at(i) == "\\") {
            let temp = "";
            i++;
            while (input.at(i) != " " && input.at(i) != "{" && i < input.length) {
                temp += input.at(i);
                i++;
            }
            i--;
            output.push({ type: "command", value: temp });
        }
        else if (input.at(i) == "{") {
            output.push({ type: "brace", value: "{" });
        }
        else if (input.at(i) == "}") {
            output.push({ type: "brace", value: "}" });
        }
        else if (input.at(i) == "^" || input.at(i) == "_") {
            output.push({ type: "command", value: input.at(i) });
        }
        else {
            output.push({ type: "digit", value: input.at(i) });
        }
    }
    return output;
}
function bracketParser(input) {
    let output = [];
    for (let i = 0; i < input.length; i++) {
        if (input.at(i).type != "brace") {
            output.push({ bracket: false, token: input.at(i) });
        }
        else {
            let temp = [];
            let brace = 1;
            i++;
            while (brace != 0) {
                let token = input.at(i);
                if (token.type == "brace") {
                    if (token.value == "{") {
                        brace++;
                    }
                    else if (token.value == "}") {
                        brace--;
                    }
                }
                if (brace != 0) {
                    temp.push(token);
                }
                i++;
            }
            i--;
            output.push({ bracket: true, token: bracketParser(temp) });
        }
    }
    return output;
}
// function parser(input: Token[]): ASTNode[] {
//     let output: ASTNode[] = []
//     for(const token of input) {
//         if()
//     }
//     return output;
// }
const codeinput = document.getElementById("codeinput");
const codebutton = document.getElementById("codebutton");
const output = document.getElementById("output");
codebutton.onclick = () => {
    const div = document.createElement("div");
    //div.innerHTML = JSON.stringify(tokenizer(codeinput.value));
    // div.textContent = tokenizer(codeinput.value)
    // .map(t => `${t.type}: ${t.value}`)
    // .join("\n");
    console.log(JSON.stringify(bracketParser(tokenizer(codeinput.value))));
    //console.log(JSON.stringify(tokenizer(codeinput.value)));
    div.classList.add("code");
    output.append(div);
    codeinput.value = "";
};
codeinput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        codebutton.click();
    }
});
