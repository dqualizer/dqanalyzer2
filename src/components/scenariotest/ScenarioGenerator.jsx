import * as monitoringMetrics from "../../data/monitoring-metrics.json";
import pluralize from "pluralize";
import compromise from "compromise";

export default function ScenarioGenerator(mode, wordArray) {

    const generateWhatIfScenarios = (wordArray) => {
        let scenarioArray = [];
        return scenarioArray;
    }

    const generateMonitoringScenarios = (words) => {
        words = {
            "speakers": [
                {
                    name: "order portal",
                    type: "system",
                    number: "singular",
                    change_allowed: true,
                    is_proper_noun: false
                },
                {
                    name: "and",
                    type: "preposition",
                },
                {
                    name: "petra",
                    type: "person",
                    number: "singular",
                    change_allowed: true,
                    is_proper_noun: true
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
                    number: "singular",
                    change_allowed: true,
                    is_proper_noun: false
                },
                {
                    name: "for",
                    type: "preposition",
                },
                {
                    name: "car",
                    type: "work object",
                    number: "singular",
                    change_allowed: true,
                    is_proper_noun: false
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
                    number: "singular",
                    change_allowed: true,
                    is_proper_noun: false
                },
                {
                    name: "and",
                    type: "preposition",
                },
                {
                    name: "mark",
                    type: "person",
                    number: "singular",
                    change_allowed: true,
                    is_proper_noun: true
                }
            ]
        }

        let scenarioArray = [];
        for (const metric of allMonitoringMetrics) {
            let sentence = {
                description: "",
                metric: metric.metric,
                expected: null,
                load_design: null,
                resilience_design: null
            };
            let descriptionSpeakers = replacePlaceholders(metric.speakers, words.speakers, "speakers");
            let descriptionMessage = replacePlaceholders(metric.message, words.message, "message")
            let descriptionAudience = replacePlaceholders(metric.audience, words.audience, "audience");

            if(descriptionSpeakers === null
                || descriptionMessage === null) {
                continue;
            }
            else if(descriptionAudience === null) {
                sentence.description = descriptionSpeakers + " " + descriptionMessage + "?";
            }
            else {
                sentence.description = descriptionSpeakers + " " + descriptionMessage + " " + descriptionAudience + "?";
            }

            scenarioArray.push(sentence);
        }
        return scenarioArray;
    }

    const replacePlaceholders = (sentencePart, words, part) => {

        const placeholderRegex = /\[(.*?)\]/g;

        let result = sentencePart.description.replace(placeholderRegex, (match, placeholder) => {
            if (words.some(item => fitsIn(item.type, placeholder))) {
                if(part === "speakers") {
                    const examiningElements = words;
                    if(areValidElementsForDescription(examiningElements, sentencePart.number_actor)) {
                        let replacingStringList = [];
                        for (let examiningElement of examiningElements) {
                            let elementName = examiningElement.name;
                            if (examiningElement.is_proper_noun === true) {
                                elementName = toTitleCase(elementName);
                            }
                            if(sentencePart.number_actor === "plural" && examiningElement.number === "singular") {
                                replacingStringList.push(pluralize(elementName));
                            }
                            else {
                                replacingStringList.push(elementName);
                            }
                        }
                        return replacingStringList.join(" ");
                    }
                }
                else if(part === "message") {
                    if(placeholder === "verb") {
                        let verb = words[0];
                        if(sentencePart.form_verb === "infinitive") {
                            return compromise(verb.name).verbs().toInfinitive().out("text");
                        }
                    }
                    else if(placeholder === "work object") {
                        let examiningElements = words.slice(1);
                        if(areValidElementsForDescription(examiningElements, sentencePart.number_work_object)) {
                            let replacingStringList = [];
                            for (let examiningElement of examiningElements) {
                                let elementName = examiningElement.name;
                                if (examiningElement.is_proper_noun === true) {
                                    elementName = toTitleCase(elementName);
                                }
                                if(sentencePart.number_work_object === "plural" && examiningElement.number === "singular") {
                                    replacingStringList.push(pluralize(elementName));
                                }
                                else {
                                    replacingStringList.push(elementName);
                                }
                            }
                            return replacingStringList.join(" ");
                        }
                    }
                }
                else if(part === "audience") {
                    if(placeholder === "preposition") {
                        return words[0].name;
                    }
                    else if(placeholder === "actor") {
                        let examiningElements = words.slice(1);
                        if(areValidElementsForDescription(examiningElements, sentencePart.number_actor)) {
                            let replacingStringList = [];
                            for (let examiningElement of examiningElements) {
                                let elementName = examiningElement.name;
                                if (examiningElement.is_proper_noun === true) {
                                    elementName = toTitleCase(elementName);
                                }
                                else if (examiningElement.is_proper_noun === false) {
                                    elementName = "the " + elementName;
                                }
                                if(sentencePart.number_actor === "plural" && examiningElement.number === "singular" && examiningElement.is_proper_noun === false) {
                                    replacingStringList.push(pluralize(elementName));
                                }
                                else {
                                    replacingStringList.push(elementName);
                                }
                            }
                            return replacingStringList.join(" ");
                        }
                    }
                }
            }

            return null;
        });
        if(result.includes("null")) {
            return null;
        }
        return result;
    }

    const fitsIn = (type, placeHolder) => {
        if(placeHolder === "actor") {
            return type === "person" || type === "system";
        }
        else {
            return type === placeHolder;
        }
    }

    const areValidElementsForDescription = (examiningElements, condition) => {
        for (const examiningElement of examiningElements) {
            if(examiningElement.type === "person" || examiningElement.type === "system" || examiningElement.type === "work object") {
                if(!(condition === examiningElement.number || examiningElement.change_allowed)) {
                    return false;
                }
            }
        }

        return true;
    }

    const toTitleCase = (str) => {
        return str.toLowerCase().replace(/(?:^|\s|-)\w/g, function(match) {
            return match.toUpperCase();
        });
    }

    const allMonitoringMetrics = monitoringMetrics.metrics;

    if(mode === "What if") {
        return generateWhatIfScenarios(wordArray);
    }
    else {
        return generateMonitoringScenarios(wordArray);
    }

}