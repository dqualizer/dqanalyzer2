class CaseService {
    toTitleCase(str) {
        return str.toLowerCase().replace(/(?:^|\s|-)\w/g, function (match) {
            return match.toUpperCase();
        });
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export default new CaseService();
