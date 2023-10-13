import pluralize from "pluralize";
import indefinite from "indefinite";
import compromise from "compromise";

export default function replacePlaceholders(sentencePart, words, part, expected) {

    const fitsIn = (type, placeHolder) => {
        if (placeHolder === "actor") {
            return type === "person" || type === "system";
        } else {
            return type === placeHolder;
        }
    }

    const areValidElementsForDescription = (examiningElements, condition) => {
        for (const examiningElement of examiningElements) {
            if (examiningElement.type === "person" || examiningElement.type === "system" || examiningElement.type === "work object") {
                if (condition !== examiningElement.number && examiningElement.is_proper_noun) {
                    return false;
                }
            }
        }

        return true;
    }

    const toTitleCase = (str) => {
        return str.toLowerCase().replace(/(?:^|\s|-)\w/g, function (match) {
            return match.toUpperCase();
        });
    }

    const placeholderRegex = /\[(.*?)\]/g;


    // optional: change the form of the verbs in the sentence description
    let result = sentencePart.description.replace(placeholderRegex, (match, placeholder) => {
        if(placeholder === 'are' || placeholder === 'do' || placeholder === 'have' || placeholder === 'fail' || placeholder === 'recover') {
            let allPlaceholders = sentencePart.description.match(placeholderRegex).map(match => match.replace(/^\[|\]$/g, ''));
            let noun = allPlaceholders.find(element => element !== placeholder);
            let allFittingElement;
            if(noun === "actor") {
                allFittingElement = words.filter(word => word.type === "person" || word.type === "system");
            }
            else if(part === "load" || part === "resilience") {
                allFittingElement = words.filter(word => word.type === "system");
            }
            else {
                allFittingElement = words.filter(word => word.type === noun);
            }
            let isElementPlural = false;
            for (let element of allFittingElement) {
                if(element.number === "plural") {
                    isElementPlural = true;
                }
            }
            if(allFittingElement.length >= 2 || isElementPlural) {
                return placeholder;
            }
            else {
                // if there is a better implementation e.g. a library, you can insert it here
                if(placeholder === "are") {
                    return "is";
                }
                else if(placeholder === "do") {
                    return "does";
                }
                else if(placeholder === "have") {
                    return "has";
                }
                else if(placeholder === "fail") {
                    return "fails";
                }
                else if(placeholder === "recover") {
                    return "recovers";
                }
            }
        }
        else {
            return match;
        }
    });

    // insert the words
    result = result.replace(placeholderRegex, (match, placeholder) => {
        if (words.some(item => fitsIn(item.type, placeholder))) {
            if (part === "speakers") {
                const examiningElements = words;
                if (areValidElementsForDescription(examiningElements, sentencePart.number_actor)) {
                    let replacingStringList = [];
                    for (let examiningElement of examiningElements) {
                        let elementName = examiningElement.name;
                        if (examiningElement.is_proper_noun === true) {
                            elementName = toTitleCase(elementName);
                        } else if (sentencePart.number_actor === "plural" && examiningElement.number === "singular" && examiningElement.is_proper_noun === false) {
                            elementName = pluralize(elementName);
                        } else if ((examiningElement.type === "person" || examiningElement.type === "system") && examiningElement.is_proper_noun === false && examiningElement.number === "singular") {
                            elementName = indefinite(elementName);
                        }
                        replacingStringList.push(elementName);
                    }
                    return replacingStringList.join(" ");
                }
            } else if (part === "message") {
                if (placeholder === "verb") {
                    let verb = words[0];
                    if (sentencePart.form_verb === "infinitive") {
                        return compromise(verb.name).verbs().toInfinitive().out("text");
                    } else if (sentencePart.form_verb === "gerund") {
                        return compromise(verb.name).verbs().toGerund().out("text").replace(/^(is |am |are |was |were )?/, '');
                    }
                } else if (placeholder === "work object") {
                    let examiningElements = words.slice(1);
                    if (areValidElementsForDescription(examiningElements, sentencePart.number_work_object)) {
                        let replacingStringList = [];
                        for (let examiningElement of examiningElements) {
                            let elementName = examiningElement.name;
                            if (examiningElement.is_proper_noun === true) {
                                elementName = toTitleCase(elementName);
                            }
                            else if (examiningElement.is_proper_noun === false && examiningElement.number === "singular" && sentencePart.number_work_object === "singular") {
                                elementName = indefinite(elementName);
                            }
                            if (sentencePart.number_work_object === "plural" && examiningElement.number === "singular") {
                                replacingStringList.push(pluralize(elementName));
                            } else {
                                replacingStringList.push(elementName);
                            }
                        }
                        return replacingStringList.join(" ");
                    }
                }
            } else if (part === "audience") {
                if (placeholder === "preposition") {
                    return words[0].name;
                } else if (placeholder === "actor" || placeholder === "system") {
                    let examiningElements = words.slice(1);
                    if (areValidElementsForDescription(examiningElements, sentencePart.number_actor)) {
                        let replacingStringList = [];
                        for (let examiningElement of examiningElements) {
                            let elementName = examiningElement.name;
                            if (examiningElement.is_proper_noun === true) {
                                elementName = toTitleCase(elementName);
                            } else if (examiningElement.type === "person" || examiningElement.type === "system" && examiningElement.is_proper_noun === false) {
                                elementName = "the " + elementName;
                            }
                            if (sentencePart.number_actor === "plural" && examiningElement.number === "singular" && examiningElement.is_proper_noun === false) {
                                replacingStringList.push(pluralize(elementName));
                            } else {
                                replacingStringList.push(elementName);
                            }
                        }
                        return replacingStringList.join(" ");
                    }
                }
            } else if (part === "load" || part === "resilience") {
                if (placeholder === "system") {
                    let examiningElements = words.slice(1);
                    if (areValidElementsForDescription(examiningElements, sentencePart.number_actor)) {
                        let replacingStringList = [];
                        for (let examiningElement of examiningElements) {
                            let elementName = examiningElement.name;
                            if (examiningElement.is_proper_noun === true) {
                                elementName = toTitleCase(elementName);
                            } else if (examiningElement.type === "person" || examiningElement.type === "system" && examiningElement.is_proper_noun === false) {
                                elementName = "the " + elementName;
                            }
                            if (sentencePart.number_actor === "plural" && examiningElement.number === "singular" && examiningElement.is_proper_noun === false) {
                                replacingStringList.push(pluralize(elementName));
                            } else {
                                replacingStringList.push(elementName);
                            }
                        }
                        return replacingStringList.join(" ");
                    }
                }
            }
        }
        else if(placeholder === "expected") {
            return expected.value + " " + expected.unit;
        }
        else if (part === "load" || part === "resilience") {
            if (placeholder === "load") {
                return "[load]";
            } else if (placeholder === "resilience") {
                return "[resilience]";
            }
        }

    return null;
    });

    if (result.includes("null")) {
        return null;
    }
    return result;
}