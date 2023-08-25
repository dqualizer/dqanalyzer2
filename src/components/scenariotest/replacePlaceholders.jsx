import pluralize from "pluralize";
import indefinite from "indefinite";
import compromise from "compromise";
import scenarioSpecs from "../../data/scenariotest-specs.json";

export default function replacePlaceholders(sentencePart, words, part) {

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
                if (!(condition === examiningElement.number || examiningElement.change_allowed)) {
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

    let result = sentencePart.description.replace(placeholderRegex, (match, placeholder) => {
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
                        } else if (examiningElement.type === "person" && examiningElement.is_proper_noun === false && examiningElement.number === "singular") {
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
        } else if (part === "load" || part === "resilience") {
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