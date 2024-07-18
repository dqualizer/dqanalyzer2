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
                if (condition !== null && condition !== examiningElement.number && examiningElement.is_proper_noun) {
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
        const mandatoryDetails = sentence.mandatory;
        const mandatoryDescription = mandatoryDetails.description;
        const mandatoryWordMap = {};

        const placeholderRegex = /\[(.*?)\]/g;

        let match;
        const matches = [];

        while ((match = placeholderRegex.exec(mandatoryDescription))) {
            // Extract the word without the brackets and push it to the array
            matches.push(match);
        }

        for (const match of matches) {
            if (sentence.words.speakers.some(speaker => fitsIn(speaker.type, match[1]))) {
                const isPossibleDescription = areValidElementsForDescription(sentence.words.speakers, mandatoryDetails.number_actor);
                if(!isPossibleDescription) {
                    return null;
                }
                const replacingStringList = [];
                for (const speaker of sentence.words.speakers) {
                    let elementName = speaker.name;
                    if (speaker.is_proper_noun === true) {
                        elementName = CaseService.toTitleCase(elementName);
                    } else if (mandatoryDetails.number_actor === "plural" && speaker.number === "singular" && speaker.is_proper_noun === false) {
                        elementName = pluralize(elementName);
                        // if((speaker.type === "person" || speaker.type === "system") && speaker.is_proper_noun === false && speaker.number === "singular") {
                        //     elementName = indefinite(elementName);
                        // }
                    } else if ((speaker.type === "person" || speaker.type === "system") && speaker.is_proper_noun === false && speaker.number === "singular") {
                        elementName = indefinite(elementName);
                    }
                    replacingStringList.push(elementName);
                }
                mandatoryWordMap[match[0]] = replacingStringList.join(" ");
            } else if (sentence.words.message.some(message => fitsIn(message.type, match[1]))) {
                if (match[1] === "verb") {
                    let description = sentence.words.message[0].name;
                    const activityWords = description.split(" ");
                    const verb = activityWords[0];
                    let verbForm;
                    if (mandatoryDetails.form_verb === "infinitive") {
                        verbForm = compromise(verb).verbs().toInfinitive().out("text");
                    } else if (mandatoryDetails.form_verb === "gerund") {
                        verbForm = compromise(verb).verbs().toGerund().out("text").replace(/^(is |am |are |was |were )?/, '');
                    }
                    description = description.replace(verb, verbForm);
                    mandatoryWordMap[match[0]] = description;
                } else if (match[1] === "work object") {
                    const examiningElements = sentence.words.message.slice(1);
                    const replacingStringList = [];
                    for (const examiningElement of examiningElements) {
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
        const optionalDetails = sentence.optional;
        const optionalDescription = optionalDetails.description;
        const optionalWordMap = {};

        const placeholderRegex = /\[(.*?)\]/g;

        let match;
        const matches = [];

        while ((match = placeholderRegex.exec(optionalDescription))) {
            // Extract the word without the brackets and push it to the array
            matches.push(match);
        }

        for (const match of matches) {
            if (sentence.words.audience.some(speaker => fitsIn(speaker.type, match[1]))) {
                if (match[1] === "preposition") {
                    optionalWordMap[match[0]] = sentence.words.audience[0].name;
                } else if (match[1] === "actor" || match[1] === "system") {
                    const examiningElements = sentence.words.audience.slice(1);
                    const isPossibleDescription = areValidElementsForDescription(examiningElements, optionalDetails.number_actor);
                    if(!isPossibleDescription) {
                        return null;
                    }
                    const replacingStringList = [];
                    for (const examiningElement of examiningElements) {
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
        const attachmentDescription = sentence.attachment;
        const attachmentWordMap = {};

        const placeholderRegex = /\[(.*?)\]/g;

        let match;
        const matches = [];

        while ((match = placeholderRegex.exec(attachmentDescription))) {
            // Extract the word without the brackets and push it to the array
            matches.push(match);
        }

        for (const match of matches) {
            if(match[1] === "options") {
                attachmentWordMap[match[0]] = sentence.options;
            }
            else if(match[1] === "expected") {
                const examiningElement = sentence.expected;
                attachmentWordMap[match[0]] = examiningElement.value + " " + examiningElement.unit;
            }
        }
        return attachmentWordMap;
    } else if (part === "Load") {
        if(sentence.load_design === null) {
            return null;
        }
        const loadDescription = sentence.metric_load.description;
        const loadWordMap = {};

        const placeholderRegex = /\[(.*?)\]/g;

        let match;
        const matches = [];

        while ((match = placeholderRegex.exec(loadDescription))) {
            // Extract the word without the brackets and push it to the array
            matches.push(match);
        }

        for (const match of matches) {
            if (match[1] === "system") {
                const examiningElements = sentence.words.audience.slice(1);
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

                const replacingStringList = [];
                for (const system of allSystems) {
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
        const resilienceDescription = sentence.metric_resilience.description;
        const resilienceWordMap = {};

        const placeholderRegex = /\[(.*?)\]/g;

        let match;
        const matches = [];

        while ((match = placeholderRegex.exec(resilienceDescription))) {
            // Extract the word without the brackets and push it to the array
            matches.push(match);
        }

        for (const match of matches) {
            if (match[1] === "system") {
                const examiningElements = sentence.words.audience.slice(1);
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

                const replacingStringList = [];
                for (const system of allSystems) {
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