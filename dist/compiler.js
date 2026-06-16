"use strict";
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
const codeinput = document.getElementById("codeinput");
const codebutton = document.getElementById("codebutton");
const output = document.getElementById("output");
codebutton.onclick = () => {
    const div = document.createElement("div");
    //div.innerHTML = JSON.stringify(tokenizer(codeinput.value));
    div.textContent = tokenizer(codeinput.value)
        .map(t => `${t.type}: ${t.value}`)
        .join("\n");
    div.classList.add("code");
    output.append(div);
    codeinput.value = "";
};
codeinput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        codebutton.click();
    }
});
