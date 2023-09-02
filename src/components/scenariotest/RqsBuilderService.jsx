import PlaceholderWordMapperService from "./PlaceholderWordMapperService.jsx";
import deepCopy from "./deepCopy.jsx";
import CaseService from "./CaseService.jsx";

export default function RqsBuilderService(sentence, mode) {

    const placeholderRegex = /\[(.*?)\]/g;

    const getDescription = (description, part) => {
        let words = PlaceholderWordMapperService(sentence, part);
        let descriptionCopy = deepCopy(description);
        if(words === null) {
            descriptionCopy = null;
        }
        else {
            const keys = Object.keys(words);
            for (const key of keys) {
                if (words[key] === null) {
                    return null;
                }
                else {
                    descriptionCopy = descriptionCopy.replace(key, words[key]);
                }
            }
        }
        return descriptionCopy;
    }

    const combineDescriptionsToSentence = (mandatory, optional, attachment, load, resilience, isQuestion) => {
        if (mandatory === null) {
            return null;
        }

        let description = CaseService.capitalizeFirstLetter(mandatory);

        if (optional !== null) {
            description += " " + optional;
        }

        if (attachment !== null) {
            description += " " + attachment;
        }

        if (load !== null) {
            description += " " + load;
        }

        if (resilience !== null) {
            description += " " + resilience;
        }

        if (isQuestion) {
            description += "?";
        }
        else {
            description += ".";
        }

        return description;
    }

    let mandatoryDescription = getDescription(sentence.mandatory.description, "Mandatory");
    let optionalDescription = getDescription(sentence.optional.description, "Optional");
    let attachmentDescription = getDescription(sentence.attachment, "Attachment");

    let loadDescription = null;
    let resilienceDescription = null;

    if(mode === "What if") {
        loadDescription = getDescription(sentence.metric_load.description, "Load");
        resilienceDescription = getDescription(sentence.metric_resilience.description, "Resilience");
    }

    let isQuestion = sentence.all_expected === null;

    return combineDescriptionsToSentence(mandatoryDescription, optionalDescription, attachmentDescription, loadDescription, resilienceDescription, isQuestion);
}