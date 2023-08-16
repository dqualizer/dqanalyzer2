export function toSnakeCase(str) {
    return str.replace(/\s+/g, '_').toLowerCase();
}