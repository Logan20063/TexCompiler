export function tokenizer(input) {
    let output = [];
    for (let i = 0; i < input.length; i++) {
        if (input.at(i) == "\\") {
            let temp = "";
            while (input.at(i) != " " && input.at(i) != "{") {
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
        else {
            output.push({ type: "digit", value: input.at(i) });
        }
    }
    return output;
}
const s = tokenizer("\\frac{1}{2}");
console.log(s[0].value.length);
//console.log(tokenizer("\\frac{1}{2}"));
