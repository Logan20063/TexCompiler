type Token = 
    {type: "digit", value: string} |
    {type: "command", value: string} | 
    {type: "brace", value: string}


function tokenizer(input: string): Token[] {
    let output: Token[] = []
    for(let i: number = 0; i < input.length; i++) {
        if(input.at(i) == "\\") {
            let temp: string = "";
            i++
            while(input.at(i) != " " && input.at(i) != "{" && i < input.length) {
                temp += input.at(i);
                i++
            }
            output.push({type: "command", value: temp});
        } else if(input.at(i) == "{") {
            output.push({type: "brace", value: "{"});
        } else if(input.at(i) == "}") {
            output.push({type: "brace", value: "}"});
        } else if(input.at(i) == "^" || input.at(i) == "_") {
            output.push({type: "command", value: input.at(i)!});
        } else {
            output.push({type: "digit", value: input.at(i)!});
        }
    }
    return output;
}

const codeinput = document.getElementById("codeinput") as HTMLInputElement;
const codebutton = document.getElementById("codebutton") as HTMLButtonElement;
const output = document.getElementById("output") as HTMLDivElement;

codebutton.onclick = () => {
    const div: HTMLDivElement = document.createElement("div");
    //div.innerHTML = JSON.stringify(tokenizer(codeinput.value));
    div.textContent = tokenizer(codeinput.value)
    .map(t => `${t.type}: ${t.value}`)
    .join("\n");
    
    div.classList.add("code");
    output.append(div);

    codeinput.value = "";
}

codeinput.addEventListener("keydown", (e) => {
    if(e.key == "Enter") {
        codebutton.click();
    }
})