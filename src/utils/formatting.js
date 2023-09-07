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

export function toHumanCasing(str) {
    const words = str.split('_');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedWords.join(' ');
}

export function changeCasing(obj, changeKeys, changeValues) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return as is if obj is not an object or null
    }

    const result = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            let newKey;
            if (changeKeys)
                newKey = toHumanCasing(key);
            else
                newKey = key

            let newValue;

            if (typeof value === 'object') {
                newValue = changeCasing(value); // Recursively change casing for nested objects
            } else {
                newValue = toHumanCasing(String(value));
            }

            result[newKey] = newValue;
        }
    }

    return result;
}