class VerbConjugationService {
  isMatchConjugableVerb(verb) {
    return (
      verb === "are" ||
      verb === "do" ||
      verb === "have" ||
      verb === "fail" ||
      verb === "recover"
    );
  }

  getConjugatedVersionOfVerb(examiningElements, verb) {
    let isPlural = false;
    let numberOfAudience = 0;

    for (const element of examiningElements) {
      if (element.type === "person" || element.type === "system") {
        numberOfAudience++;
        if (element.number === "plural") {
          isPlural = true;
          break;
        }
      }
    }

    if (isPlural || numberOfAudience >= 2) {
      return verb;
    }
    // if there is a better implementation e.g. a library, you can insert it here
    if (verb === "are") {
      return "is";
    }
    if (verb === "do") {
      return "does";
    }
    if (verb === "have") {
      return "has";
    }
    if (verb === "fail") {
      return "fails";
    }
    if (verb === "recover") {
      return "recovers";
    }
  }
}

export default new VerbConjugationService();
