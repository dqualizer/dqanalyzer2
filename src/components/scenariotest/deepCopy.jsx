/*
    Produces a copy of the input object to detach the operations from its original
*/
export default function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    let copiedObject;
    if (obj instanceof Array) {
        copiedObject = [];
        for (let i = 0; i < obj.length; i++) {
            copiedObject.push(deepCopy(obj[i]));
        }
    } else {
        copiedObject = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copiedObject[key] = deepCopy(obj[key]);
            }
        }
    }

    return copiedObject;
}