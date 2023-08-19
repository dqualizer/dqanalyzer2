export default function ActivityValidator(wordArray) {

    const validFirstAndLastElement = (elementArray, index, startArray, endArray) => {
        // checks first element of the set
        if(index === 0) {
            if(!startArray.includes(elementArray[index].type)) {
                return false;
            }
        }

        // checks last element of the set
        if(index === elementArray.length - 1) {
            if(!endArray.includes(elementArray[index].type)) {
                return false;
            }
        }
        return true;
    }

    const providesALabel = (elementArray, index) => {
        // Provide a Label for Every Building Block
        return !(elementArray[index].name === null || elementArray[index].name === undefined || elementArray[index].name === "");
    }

    const containsNoArticle = (elementArray, index) => {
        const regexForA = new RegExp(`\\ba\\b`, 'i');
        const containsA = regexForA.test(elementArray[index].name.toLowerCase());

        const regexForAn = new RegExp(`\\ban\\b`, 'i');
        const containsAn = regexForAn.test(elementArray[index].name.toLowerCase());

        const regexForThe = new RegExp(`\\bthe\\b`, 'i');
        const containsThe = regexForThe.test(elementArray[index].name.toLowerCase());

        // Does not contain articles like "a", "an" or "the" (see LeasingNinja)
        if(containsA || containsAn || containsThe) {
            return false;
        }

        return true;
    }

    const isNoDuplicate = (elementArray, index) => {
        // Each person, system and work object only exists once in a sentence --> Avoid "Loopbacks"
        if(elementArray[index].type === "person" || elementArray[index].type === "system" || elementArray[index].type === "work object") {
            for (const observedElement of observedElements) {
                if(observedElement.name === elementArray[index].name && observedElement.type === elementArray[index].type) {
                    return false;
                }
            }
        }
        return true;
    }

    const hasRightOrder = (elementArray, index, prepositionsAreEven) => {
        // Prepositions should be at the right place. In speakers and message prepositions are only allowed at odd indexes, in audience at even indexes only
        if (elementArray[index].type === "verb" || elementArray[index].type === "preposition") {
           if (index % 2 === 0) {
               if(prepositionsAreEven) {
                   return true;
               }
               else {
                   return false;
               }
           }
           else {
               if(prepositionsAreEven) {
                   return false;
               }
               else {
                   return true;
               }
           }
        }
        else {
            if (index % 2 === 0) {
                if(prepositionsAreEven) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                if(prepositionsAreEven) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }

    // TODO: only for test purposes
    wordArray = {
        "speakers": [
            {
                name: "customer",
                type: "person"
            },
        ],
        "message": [
            {
                name: "tell",
                type: "verb",
            },
            {
                name: "wish",
                type: "work object",
            },
            {
                name: "for",
                type: "preposition",
            },
            {
                name: "car",
                type: "work object",
            },
        ],
        "audience": [
            {
                name: "to",
                type: "preposition",
            },
            {
                name: "sales person",
                type: "person",
            },
            // {
            //     name: "and",
            //     type: "preposition",
            // },
            // {
            //     name: "sales person",
            //     type: "system",
            // }
        ]
    }
    //
    // // TODO: only for test purposes
    // wordArray = {
    //     "speakers": [
    //         {
    //             name: "usher",
    //             type: "person"
    //         },
    //     ],
    //     "message": [
    //         {
    //             name: "checks",
    //             type: "verb",
    //         },
    //         {
    //             name: "ticket",
    //             type: "work object",
    //         },
    //     ],
    //     "audience": [
    //         {
    //             name: "and grants entrance to",
    //             type: "preposition",
    //         },
    //         {
    //             name: "movie goer",
    //             type: "person",
    //         },
    //     ]
    // }

    let personNumber = 0;
    let systemNumber = 0;
    let workObjectNumber = 0;
    let verbNumber = 0;

    let speakers= wordArray.speakers;
    let message = wordArray.message;
    let audience= wordArray.audience;

    let observedElements = [];

    for (let index = 0; index < speakers.length; index++) {
        if(!validFirstAndLastElement(speakers, index, ["person", "system"], ["person", "system"])
            || !providesALabel(speakers, index)
            || !containsNoArticle(speakers, index)
            || !isNoDuplicate(speakers, index)
            || !hasRightOrder(speakers, index, false)) {
            return false;
        }

        switch (speakers[index].type) {
            case "person": personNumber++; break;
            case "system": systemNumber++; break;
            case "preposition": break;
            case "annotation": break;   // Annotations doesn't matter now
            default: return false;
        }
        observedElements.push(speakers[index]);
    }

    for (let index = 0; index < message.length; index++) {
        if(!validFirstAndLastElement(message, index, ["verb"], ["work object"])
            || !providesALabel(message, index)
            || !containsNoArticle(message, index)
            || !isNoDuplicate(message, index)
            || !hasRightOrder(message, index, true)) {
            return false;
        }

        switch (message[index].type) {
            case "verb": verbNumber++; break;
            case "work object": workObjectNumber++; break;
            case "preposition": break;
            case "annotation": break;   // Annotations doesn't matter now
            default: return false;
        }
        observedElements.push(message[index]);
    }

    for (let index = 0; index < audience.length; index++) {
        if(!validFirstAndLastElement(audience, index, ["preposition"], ["person", "system"])
            || !providesALabel(audience, index)
            || !containsNoArticle(audience, index)
            || !isNoDuplicate(audience, index)
            || !hasRightOrder(audience, index, true)) {
            return false;
        }

        switch (audience[index].type) {
            case "person": personNumber++; break;
            case "system": systemNumber++; break;
            case "preposition": systemNumber++; break;
            case "annotation": break;   // Annotations doesn't matter now
            default: return false;
        }
        observedElements.push(audience[index]);
    }

    // Every sentence contains at least one actor and one work object
    if (personNumber === 0 || workObjectNumber === 0) {
        return false;
    }

    return true;
}