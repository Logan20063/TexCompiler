"use strict";
// type ASTNode = 
//     {type: Token} |
//     {type: Token, children}
// {
//     token: BracketToken,
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
// function parser(input: BracketToken[]): ASTNode[] {
//     let output: ASTNode[] = []
//     for(let i=0; i < input.length; i++) {
//         let token: BracketToken = input.at(i)!
//         if(token.bracket == false && token.token.type == "digit") {
//             output.push({token: token, children: []});
//         }
//     }
//     return output;
// }
function TokenToHTML(input) {
    let output = "";
    for (let i = 0; i < input.length; i++) {
        let token = input.at(i);
        if (token.bracket == false && token.token.type == "digit") {
            let digit = token.token.value;
            if (digit == ">") {
                digit = "&gt;";
            }
            else if (digit == "<") {
                digit = "&lt;";
            }
            else if (digit == "&") {
                digit = "&amp;";
            }
            output += "<span>" + digit + "</span>";
        }
        else if (token.bracket == false && token.token.type == "command") {
            let command = token.token.value;
            if (command == "^") {
                i++;
                token = input.at(i);
                if (token.bracket == true) {
                    output += "<sup>" + TokenToHTML(token.token) + "</sup>";
                }
                else {
                    console.error("Parser error");
                }
            }
            else if (command == "_") {
                i++;
                token = input.at(i);
                if (token.bracket == true) {
                    output += "<sub>" + TokenToHTML(token.token) + "</sub>";
                }
                else {
                    console.error("Parser error");
                }
            }
            else if (command == "frac") {
                let num = input.at(i + 1);
                let denom = input.at(i + 2);
                if (num.bracket == true && denom.bracket == true) {
                    output += "<math><mfrac><mi>" + TokenToHTML(num.token) + "</mi><mn>" + TokenToHTML(denom.token) + "</mn></mfrac></math>";
                    console.log(TokenToHTML(denom.token));
                    console.log(JSON.stringify(denom));
                }
                i += 2;
            }
        }
    }
    return output;
}
const codeinput = document.getElementById("codeinput");
const codebutton = document.getElementById("codebutton");
const output = document.getElementById("output");
codebutton.onclick = () => {
    const div = document.createElement("div");
    //console.log(JSON.stringify(bracketParser(tokenizer(codeinput.value))));
    //console.log(JSON.stringify(tokenizer(codeinput.value)));
    div.innerHTML = TokenToHTML(bracketParser(tokenizer(codeinput.value)));
    div.classList.add("code");
    output.append(div);
    codeinput.value = "";
};
codeinput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        codebutton.click();
    }
});
