const splitRegex = /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/;
const escapedAtRegex = /^\\@/;

export function parseMetadata(fileContent: string, strict = true): Record<string,string>|undefined {
    if((strict && !fileContent.startsWith("/**")) || !fileContent.includes("/**")) return;

    // Taken directly from BD
    const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
    const out: Record<string,string> = {};
    let field = "";
    let accum = "";
    for (const line of block.split(splitRegex)) {
        if (line.length === 0) continue;
        if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
            out[field] = accum;
            const l = line.indexOf(" ");
            field = line.substr(1, l - 1);
            accum = line.substr(l + 1);
        }
        else {
            accum += " " + line.replace("\\n", "\n").replace(escapedAtRegex, "@");
        }
    }
    out[field] = accum.trim();
    delete out[""];
    out["format"] = "jsdoc";
    return out;
}