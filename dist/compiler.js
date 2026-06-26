"use strict";
const commands = {
    "in": "&isin;",
    "notin": "&notin;",
    "forall": "&forall;",
    "partial": "&part;",
    "exists": "&exist;",
    "leq": "&le;",
    "le": "&le;",
    "geq": "&ge;",
    "ge": "&ge;",
    "implies": "&#x21D2;",
    "impliedby": "&#x21D0;",
    "epsilon": "&#x3B5;",
    "delta": "&#x3B4;"
};
const mathbb = {
    "R": "&#x211D;",
    "N": "&#x2115;",
    "C": "&#x2102;",
    "Q": "&#x211A;",
    "Z": "&#x2124;",
};
function tokenizer(input) {
    if (!braceValidation(input)) {
        return [{ type: "digit", value: "Braces Are Not Aligned" }];
    }
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
    if (!Array.isArray(input)) {
        if ("type" in input) {
            if (input.value == " ") {
                return "";
            }
            return input.value;
        }
        if (input.bracket == false) {
            return input.token.value;
        }
        return TokenToHTML(input.token);
    }
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
            if (command in commands) {
                output += "<span>" + commands[command] + "</span>";
            }
            else if (command == "^") {
                i++;
                token = input.at(i);
                // if(token.bracket == true) {
                output += "<sup>" + TokenToHTML(token.token) + "</sup>";
                // } else {
                //     console.error("Parser error");
                // }
            }
            else if (command == "_") {
                i++;
                token = input.at(i);
                // if(token.bracket == true) {
                output += "<sub>" + TokenToHTML(token.token) + "</sub>";
                // } else {
                //     console.error("Parser error");
                // }
            }
            else if (command == "frac") {
                let num = input.at(i + 1);
                let denom = input.at(i + 2);
                //if(num.bracket == true && denom.bracket == true) {
                //output += "<math><mfrac><mi>" + TokenToHTML(num.token) + "</mi><mn>" + TokenToHTML(denom.token) + "</mn></mfrac></math>"
                output += `<div class="fraction"><div class="numerator"> ${TokenToHTML(num.token)}</div><div class="denominator"> ${TokenToHTML(denom.token)}</div></div>`;
                //console.log(TokenToHTML(denom.token));
                //console.log(JSON.stringify(denom));
                //}
                i += 2;
            }
            else if (command == "mathbb") {
                let next = input.at(i + 1);
                if (next.bracket == true && next.token.length == 1) {
                    next = next.token.at(0);
                    if (next.bracket == false) {
                        let value = next.token.value;
                        if (value in mathbb) {
                            output += `<span>${mathbb[value]}</span>`;
                        }
                    }
                }
            }
            else if (command == "sqrt") {
                output += "&radic;";
                output += `<span class="sqrt">${TokenToHTML(input.at(i + 1))}</span>`;
                i += 1;
            }
        }
    }
    return output;
}
function braceValidation(input) {
    let stack = [];
    for (const char of input) {
        if (char == "{" || char == "[") {
            stack.push(char);
        }
        else if (char == "}") {
            if (stack.length == 0 || stack.pop() != "{") {
                return false;
            }
        }
        else if (char == "]") {
            if (stack.length == 0 || stack.pop() != "[") {
                return false;
            }
        }
    }
    return stack.length == 0;
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
