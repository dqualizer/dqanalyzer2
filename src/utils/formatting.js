export function toSnakeCase(str) {
    return str.replace(/\s+/g, '_').toLowerCase();
}

export function changePropValueCasing(obj, casing) {
    const newObj = {};
    console.log(obj)

    // Iterate over each property in the original object

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // Get the current property value
            const value = obj[key];


            // Convert the value to the desired casing
            let modifiedValue;
            if (casing === 'lower') {
                modifiedValue = value.toLowerCase();
            } else if (casing === 'upper') {
                modifiedValue = value.toUpperCase();
            }
            else if (casing == 'snake_lower') {
                modifiedValue = value.replace(/\s+/g, '_').toLowerCase();
            }
            else if (casing == 'snake_upper') {
                modifiedValue = value.replace(/\s+/g, '_').toUpperCase();
                console.log(modifiedValue);
            }
            else {
                // Unsupported casing, use the original value
                modifiedValue = value;
            }
            // Add the modified property to the new object
            newObj[key] = modifiedValue;
        }

    }

    return newObj;
}

function convertKeysToSnakeCase(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(convertKeysToSnakeCase);
    }

    const snakeCaseObj = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            snakeCaseObj[snakeCaseKey] = convertKeysToSnakeCase(obj[key]);
        }
    }

    return snakeCaseObj;
}





