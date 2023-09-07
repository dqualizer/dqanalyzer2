import pluralize from "pluralize";
import indefinite from "indefinite";
import compromise from "compromise";
import CaseService from "./CaseService.jsx";
import WhatIfVariantFormatterService from "./WhatIfVariantFormatterService.jsx";
import VerbConjugationService from "./VerbConjugationService.jsx";

export default function PlaceholderWordMapperService(sentence, part) {
    const fitsIn = (wordType, placeholder) => {
        if (placeholder === "actor") {
            return wordType === "person" || wordType === "system";
        } else {
            return wordType === placeholder;
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

    if (part === "Mandatory") {
        if (sentence.mandatory === null) {
            return null;
        }
        let mandatoryDetails = sentence.mandatory;
        let mandatoryDescription = mandatoryDetails.description;
        let mandatoryWordMap = {};

        const placeholderRegex = /\[(.*?)\]/g;

        let match;
        let matches = [];

        while ((match = placeholderRegex.exec(mandatoryDescription))) {
            // Extract the word without the brackets and push it to the array
            matches.push(match);
        }

        for (let match of matches) {
            if (sentence.words.speakers.some(speaker => fitsIn(speaker.type, match[1]))) {
                let isPossibleDescription = areValidElementsForDescription(sentence.words.speakers, mandatoryDetails.number_actor);
                if(!isPossibleDescription) {
                    return null;
                }
                let replacingStringList = [];
                for (let speaker of sentence.words.speakers) {
                    let elementName = speaker.name;
                    if (speaker.is_proper_noun === true) {
                        elementName = CaseService.toTitleCase(elementName);
                    } else if (mandatoryDetails.number_actor === "plural" && speaker.number === "singular" && speaker.is_proper_noun === false) {
                        elementName = pluralize(elementName);
                    } else if ((speaker.type === "person" || speaker.type === "system") && speaker.is_proper_noun === false && speaker.number === "singular") {
                        elementName = indefinite(elementName);
                    }
                    replacingStringList.push(elementName);
                }
                mandatoryWordMap[match[0]] = replacingStringList.join(" ");
            } else if (sentence.words.message.some(message => fitsIn(message.type, match[1]))) {
                if (match[1] === "verb") {
                    let verb = sentence.words.message[0].name;
                    if (mandatoryDetails.form_verb === "infinitive") {
                        verb = compromise(verb).verbs().toInfinitive().out("text");
                    } else if (mandatoryDetails.form_verb === "gerund") {
                        verb = compromise(verb).verbs().toGerund().out("text").replace(/^(is |am |are |was |were )?/, '');
                    }
                    mandatoryWordMap[match[0]] = verb;
                } else if (match[1] === "work object") {
                    let examiningElements = sentence.words.message.slice(1);
                    let replacingStringList = [];
                    for (let examiningElement of examiningElements) {
                        let elementName = examiningElement.name;
                        if (examiningElement.is_proper_noun === true) {
                            elementName = CaseService.toTitleCase(elementName);
                        } else if (examiningElement.is_proper_noun === false && examiningElement.number === "singular" && mandatoryDetails.number_work_object === "singular") {
                            elementName = indefinite(elementName);
                        }
                        if (mandatoryDetails.number_work_object === "plural" && examiningElement.number === "singular") {
                            replacingStringList.push(pluralize(elementName));
                        } else {
                            replacingStringList.push(elementName);
                        }
                    }
                    mandatoryWordMap[match[0]] = replacingStringList.join(" ");
                }
            } else if (VerbConjugationService.isMatchConjugableVerb(match[1])) {
                mandatoryWordMap[match[0]] = VerbConjugationService.getConjugatedVersionOfVerb(sentence.words.speakers, match[1]);
            }
        }
        return mandatoryWordMap;
    } else if (part === "Optional") {
        if (sentence.optional === null) {
            return null;
        }
        let optionalDetails = sentence.optional;
        let optionalDescription = optionalDetails.description;
        let optionalWordMap = {};

        const placeholderRegex = /\[(.*?)\]/g;

        let match;
        let matches = [];

        while ((match = placeholderRegex.exec(optionalDescription))) {
            // Extract the word without the brackets and push it to the array
            matches.push(match);
        }

        for (let match of matches) {
            if (sentence.words.audience.some(speaker => fitsIn(speaker.type, match[1]))) {
                if (match[1] === "preposition") {
                    optionalWordMap[match[0]] = sentence.words.audience[0].name;
                } else if (match[1] === "actor" || match[1] === "system") {
                    let examiningElements = sentence.words.audience.slice(1);
                    let isPossibleDescription = areValidElementsForDescription(examiningElements, optionalDetails.number_actor);
                    if(!isPossibleDescription) {
                        return null;
                    }
                    let replacingStringList = [];
                    for (let examiningElement of examiningElements) {
                        let elementName = examiningElement.name;
                        if (examiningElement.is_proper_noun === true) {
                            elementName = CaseService.toTitleCase(elementName);
                        } else if (examiningElement.type === "person" || examiningElement.type === "system" && examiningElement.is_proper_noun === false) {
                            elementName = "the " + elementName;
                        }
                        if (optionalDetails.number_actor === "plural" && examiningElement.number === "singular" && examiningElement.is_proper_noun === false) {
                            replacingStringList.push(pluralize(elementName));
                        } else {
                            replacingStringList.push(elementName);
                        }
                    }
                    optionalWordMap[match[0]] = replacingStringList.join(" ");
                }
            }
            else if (VerbConjugationService.isMatchConjugableVerb(match[1])) {
                optionalWordMap[match[0]] = VerbConjugationService.getConjugatedVersionOfVerb(sentence.words.audience, match[1]);
            }
        }
        return optionalWordMap;
    } else if (part === "Attachment") {
        if (sentence.attachment === null) {
            return null;
        }
        let attachmentDescription = sentence.attachment;
        let attachmentWordMap = {};

        const placeholderRegex = /\[(.*?)\]/g;

        let match;
        let matches = [];

        while ((match = placeholderRegex.exec(attachmentDescription))) {
            // Extract the word without the brackets and push it to the array
            matches.push(match);
        }

        for (let match of matches) {
            if(match[1] === "options") {
                attachmentWordMap[match[0]] = sentence.options;
            }
            else if(match[1] === "expected") {
                let examiningElement = sentence.expected;
                attachmentWordMap[match[0]] = examiningElement.value + " " + examiningElement.unit;
            }
        }
        return attachmentWordMap;
    } else if (part === "Load") {
        if(sentence.load_design === null) {
            return null;
        }
        let loadDescription = sentence.metric_load.description;
        let loadWordMap = {};

        const placeholderRegex = /\[(.*?)\]/g;

        let match;
        let matches = [];

        while ((match = placeholderRegex.exec(loadDescription))) {
            // Extract the word without the brackets and push it to the array
            matches.push(match);
        }

        for (let match of matches) {
            if (match[1] === "system") {
                let examiningElements = sentence.words.audience.slice(1);
                let allSystems = [];
                // look for all systems
                for (let index = 0; index < examiningElements.length; index++) {
                    if(examiningElements[index].type === "system") {
                        allSystems.push(examiningElements[index]);
                    }
                }
                // insert "and" between the systems
                for(let indexToInsert = 1; indexToInsert < allSystems.length; indexToInsert = indexToInsert + 3) {
                    allSystems = [...allSystems.slice(0, indexToInsert),
                        {
                            name: "and",
                            type: "preposition",
                        }
                        , ...allSystems.slice(indexToInsert)];
                }

                let replacingStringList = [];
                for (let system of allSystems) {
                    let elementName = system.name;
                    if (system.is_proper_noun === true) {
                        elementName = CaseService.toTitleCase(elementName);
                    } else if (system.type === "system" && system.is_proper_noun === false) {
                        elementName = "the " + elementName;
                    }
                    if (loadDescription.number_actor === "plural" && system.number === "singular" && system.is_proper_noun === false) {
                        replacingStringList.push(pluralize(elementName));
                    } else {
                        replacingStringList.push(elementName);
                    }
                }
                if(replacingStringList.length === 0) {
                    loadWordMap[match[0]] = null;
                }
                else {
                    loadWordMap[match[0]] = replacingStringList.join(" ");
                }
            } else if (VerbConjugationService.isMatchConjugableVerb(match[1])) {
                loadWordMap[match[0]] = VerbConjugationService.getConjugatedVersionOfVerb(sentence.words.audience, match[1]);
            }
            if (match[1] === "load") {
                loadWordMap[match[0]] = WhatIfVariantFormatterService(sentence, part);
            }
        }
        return loadWordMap;
    } else if (part === "Resilience") {
        if(sentence.resilience_design === null) {
            return null;
        }
        let resilienceDescription = sentence.metric_resilience.description;
        let resilienceWordMap = {};

        const placeholderRegex = /\[(.*?)\]/g;

        let match;
        let matches = [];

        while ((match = placeholderRegex.exec(resilienceDescription))) {
            // Extract the word without the brackets and push it to the array
            matches.push(match);
        }

        for (let match of matches) {
            if (match[1] === "system") {
                let examiningElements = sentence.words.audience.slice(1);
                let allSystems = [];
                // look for all systems
                for (let index = 0; index < examiningElements.length; index++) {
                    if(examiningElements[index].type === "system") {
                        allSystems.push(examiningElements[index]);
                    }
                }
                // insert "and" between the systems
                for(let indexToInsert = 1; indexToInsert < allSystems.length; indexToInsert = indexToInsert + 3) {
                    allSystems = [...allSystems.slice(0, indexToInsert),
                        {
                            name: "and",
                            type: "preposition",
                        }
                        , ...allSystems.slice(indexToInsert)];
                }

                let replacingStringList = [];
                for (let system of allSystems) {
                    let elementName = system.name;
                    if (system.is_proper_noun === true) {
                        elementName = CaseService.toTitleCase(elementName);
                    } else if (system.type === "system" && system.is_proper_noun === false) {
                        elementName = "the " + elementName;
                    }
                    if (resilienceDescription.number_actor === "plural" && system.number === "singular" && system.is_proper_noun === false) {
                        replacingStringList.push(pluralize(elementName));
                    } else {
                        replacingStringList.push(elementName);
                    }
                }
                if(replacingStringList.length === 0) {
                    resilienceWordMap[match[0]] = null;
                }
                else {
                    resilienceWordMap[match[0]] = replacingStringList.join(" ");
                }
            } else if (VerbConjugationService.isMatchConjugableVerb(match[1])) {
                resilienceWordMap[match[0]] = VerbConjugationService.getConjugatedVersionOfVerb(sentence.words.audience, match[1]);
            }
            if (match[1] === "resilience") {
                resilienceWordMap[match[0]] = WhatIfVariantFormatterService(sentence, part);
            }
        }
        return resilienceWordMap;
    }

    return null;
}