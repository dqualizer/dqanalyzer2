import PlaceholderWordMapperService from "./PlaceholderWordMapperService.jsx";
import deepCopy from "./deepCopy.jsx";
import CaseService from "./CaseService.jsx";

export default function RqsBuilderService(sentence, mode) {
  const placeholderRegex = /\[(.*?)\]/g;

  const getDescription = (description, part) => {
    const words = PlaceholderWordMapperService(sentence, part);
    let descriptionOfSentencePart = deepCopy(description);
    if (words === null) {
      descriptionOfSentencePart = null;
    } else {
      const keys = Object.keys(words);
      for (const key of keys) {
        if (words[key] === null) {
          return null;
        } else {
          descriptionOfSentencePart = descriptionOfSentencePart.replace(
            key,
            words[key],
          );
        }
      }
    }
    if (
      part === "Optional" &&
      placeholderRegex.test(descriptionOfSentencePart)
    ) {
      descriptionOfSentencePart = null;
    }
    return descriptionOfSentencePart;
  };

  const combineDescriptionsToSentence = (
    mandatory,
    optional,
    attachment,
    load,
    resilience,
    isMandatoryDescriptionNotEmpty,
    isQuestion,
  ) => {
    let description = "";

    if (mandatory !== null) {
      description += mandatory;
    } else if (isMandatoryDescriptionNotEmpty) {
      return null;
    }

    if (optional !== null) {
      if (description === "") {
        description += optional;
      } else {
        description += " " + optional;
      }
    }

    if (description === "") {
      return null;
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
    } else {
      description += ".";
    }

    return CaseService.capitalizeFirstLetter(description);
  };

  const mandatoryDescription = getDescription(
    sentence.mandatory.description,
    "Mandatory",
  );
  const optionalDescription = getDescription(
    sentence.optional.description,
    "Optional",
  );
  const attachmentDescription = getDescription(
    sentence.attachment,
    "Attachment",
  );

  let loadDescription = null;
  let resilienceDescription = null;

  if (mode === "What if") {
    loadDescription = getDescription(sentence.metric_load.description, "Load");
    resilienceDescription = getDescription(
      sentence.metric_resilience.description,
      "Resilience",
    );

    if (loadDescription === null) {
      // If the load description in a what if rqs is null, it is not a valid rqs anymore
      return null;
    }
  }

  const isMandatoryDescriptionNotEmpty =
    sentence.mandatory.description !== null;
  const isQuestion = sentence.all_expected === null;

  return combineDescriptionsToSentence(
    mandatoryDescription,
    optionalDescription,
    attachmentDescription,
    loadDescription,
    resilienceDescription,
    isMandatoryDescriptionNotEmpty,
    isQuestion,
  );
}
