class CaseService {
    toTitleCase(str) {
        return str.toLowerCase().replace(/(?:^|\s|-)\w/g, (match) => match.toUpperCase());
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export default new CaseService();
