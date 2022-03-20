const COMMENT = /\/\*\*\s*\n([^*]|(\*(?!\/)))*\*\//g;
const STAR_MATCHER = /^ \* /;
const FIELD_MATCHER = /^@(\w+)\s+(.*)/m;

export function parseMetadata(
    fileContent: string,
    strict = true
): Record<string, string> | undefined {
    const match = fileContent.match(COMMENT);
    if (!match || (fileContent.indexOf(match[0]) != 0 && strict)) return;

    const comment = match[0]
        // remove /**
        .replace(/^\/\*\*?/, "")
        // remove */
        .replace(/\*\/$/, "")
        // split lines
        .split(/\n\r?/)
        // remove ' * ' at the beginning of a line
        .map((l) => l.replace(STAR_MATCHER, ""));

    const ret: Record<string, string> = { "": "" };
    let currentKey = "";
    for (const line of comment) {
        const field = line.match(FIELD_MATCHER);
        if (field) {
            currentKey = field[1];
            ret[currentKey] = field[2];
        } else {
            ret[currentKey] += "\n" + line;
        }
    }
    ret[currentKey] = ret[currentKey].trimEnd();
    delete ret[""];

    return ret;
}
