import compromise from "compromise";

export default function ActivityValidator(wordArray) {
  const validFirstAndLastElement = (
    elementArray,
    index,
    startArray,
    endArray,
  ) => {
    // checks first element of the set
    if (index === 0) {
      if (!startArray.includes(elementArray[index].type)) {
        return false;
      }
    }

    // checks last element of the set
    if (index === elementArray.length - 1) {
      if (!endArray.includes(elementArray[index].type)) {
        return false;
      }
    }
    return true;
  };

  const providesALabel = (elementArray, index) => {
    // Provide a Label for Every Building Block
    return !(
      elementArray[index].name === null ||
      elementArray[index].name === undefined ||
      elementArray[index].name === ""
    );
  };

  const containsNoArticle = (elementArray, index) => {
    const regexForA = /\ba\b/i;
    const containsA = regexForA.test(elementArray[index].name.toLowerCase());

    const regexForAn = /\ban\b/i;
    const containsAn = regexForAn.test(elementArray[index].name.toLowerCase());

    const regexForThe = /\bthe\b/i;
    const containsThe = regexForThe.test(
      elementArray[index].name.toLowerCase(),
    );

    // Does not contain articles like "a", "an" or "the" (see LeasingNinja)
    if (containsA || containsAn || containsThe) {
      return false;
    }

    return true;
  };

  const isNoDuplicate = (elementArray, index) => {
    // Each person, system and work object only exists once in a sentence --> Avoid "Loopbacks"
    if (
      elementArray[index].type === "person" ||
      elementArray[index].type === "system" ||
      elementArray[index].type === "work object"
    ) {
      for (const observedElement of observedElements) {
        if (
          observedElement.name === elementArray[index].name &&
          observedElement.type === elementArray[index].type
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const hasRightOrder = (elementArray, index, shouldHaveEvenIndex) => {
    // Prepositions should be at the right place. In speakers and message prepositions are only allowed at odd indexes, in audience at even indexes only
    if (
      elementArray[index].type === "verb" ||
      elementArray[index].type === "preposition" ||
      elementArray[index].type === "conjunction"
    ) {
      if (index % 2 === 0) {
        if (shouldHaveEvenIndex) {
          return true;
        }
        return false;
      }
      if (shouldHaveEvenIndex) {
        return false;
      }
      return true;
    }
    if (index % 2 === 0) {
      if (shouldHaveEvenIndex) {
        return false;
      }
      return true;
    }
    if (shouldHaveEvenIndex) {
      return true;
    }
    return false;
  };

  let personNumber = 0;
  let systemNumber = 0;
  let workObjectNumber = 0;
  let verbNumber = 0;

  const speakers = wordArray.speakers;
  const message = wordArray.message;
  const audience = wordArray.audience;

  const observedElements = [];

  for (let index = 0; index < speakers.length; index++) {
    if (
      !validFirstAndLastElement(
        speakers,
        index,
        ["person", "system"],
        ["person", "system"],
      ) ||
      !providesALabel(speakers, index) ||
      !containsNoArticle(speakers, index) ||
      !isNoDuplicate(speakers, index) ||
      !hasRightOrder(speakers, index, false)
    ) {
      return false;
    }

    switch (speakers[index].type) {
      case "person":
        personNumber++;
        break;
      case "system":
        systemNumber++;
        break;
      case "conjunction":
        break;
      // case "annotation": break;   // Annotations doesn't matter now
      default:
        return false;
    }
    observedElements.push(speakers[index]);
  }

  for (let index = 0; index < message.length; index++) {
    if (
      !validFirstAndLastElement(message, index, ["verb"], ["work object"]) ||
      !providesALabel(message, index) ||
      !containsNoArticle(message, index) ||
      !isNoDuplicate(message, index) ||
      !hasRightOrder(message, index, true)
    ) {
      return false;
    }

    if (index === 0) {
      const firstActivityArrow = message[index];
      const firstActivityString = firstActivityArrow.name;
      const activityWords = firstActivityString.split(" ");
      const firstWord = activityWords[0];
      const isNotAVerb =
        compromise(firstWord).verbs().toInfinitive().out("text") === "";
      if (isNotAVerb) {
        return false;
      }
    }

    switch (message[index].type) {
      case "verb":
        verbNumber++;
        break;
      case "work object":
        workObjectNumber++;
        break;
      case "preposition":
        break;
      case "conjunction":
        break;
      // case "annotation": break;   // Annotations doesn't matter now
      default:
        return false;
    }
    observedElements.push(message[index]);
  }

  for (let index = 0; index < audience.length; index++) {
    if (
      !validFirstAndLastElement(
        audience,
        index,
        ["preposition"],
        ["person", "system"],
      ) ||
      !providesALabel(audience, index) ||
      !containsNoArticle(audience, index) ||
      !isNoDuplicate(audience, index) ||
      !hasRightOrder(audience, index, true)
    ) {
      return false;
    }

    switch (audience[index].type) {
      case "person":
        personNumber++;
        break;
      case "system":
        systemNumber++;
        break;
      case "preposition":
        if (index !== 0) {
          return false;
        }
        break;
      case "conjunction":
        break;
      // case "annotation": break;   // Annotations doesn't matter now
      default:
        return false;
    }
    observedElements.push(audience[index]);
  }

  // Every sentence contains at least one actor and one work object and one verb only
  if (personNumber === 0 || workObjectNumber === 0 || verbNumber !== 1) {
    return false;
  }

  return true;
}
