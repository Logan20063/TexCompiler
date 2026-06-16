type Token = 
    {type: "digit", value: string} |
    {type: "command", value: string} | 
    {type: "brace", value: string}


export function tokenizer(input: string): Token[] {
    let output: Token[] = []
    for(let i: number = 0; i < input.length; i++) {
        if(input.at(i) == "\\") {
            let temp: string = "";
            while(input.at(i) != " " && input.at(i) != "{") {
                temp += input.at(i);
                i++
            }
            output.push({type: "command", value: temp});
        } else if(input.at(i) == "{") {
            output.push({type: "brace", value: "{"});
        } else if(input.at(i) == "}") {
            output.push({type: "brace", value: "}"});
        } else {
            output.push({type: "digit", value: input.at(i)!});
        }
    }
    return output;
}

console.log(tokenizer("\\frac{1}{2}"));