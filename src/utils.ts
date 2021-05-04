
function object_string(obj: any): string {
    return Object.entries(obj)
        .map(e => `${e[0]}: ${e[1]}`)
        .join(';');
}

export {object_string}