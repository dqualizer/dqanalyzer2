import PlaceholderWordMapperService from "./PlaceholderWordMapperService.jsx";
import WhatIfVariantFormatterService from "./WhatIfVariantFormatterService.jsx";

export default function ScenarioDescriptionFormatter(scenario) {

    const formatRqsDescription = () => {
        let resultString = scenario.description;
        const optionsToFormat = formatPart("Options");
        const expectedToFormat = formatPart("Expected");
        const loadToFormat = formatPart("Load");
        const resilienceToFormat = formatPart("Resilience");

        if(optionsToFormat !== null) {
            resultString = resultString.replace(optionsToFormat, `<span class="bold-text">${optionsToFormat}</span>`);
        }
        if(expectedToFormat !== null) {
            resultString = resultString.replace(expectedToFormat, `<span class="bold-text">${expectedToFormat}</span>`);
        }
        if(loadToFormat !== null) {
            resultString = resultString.replace(loadToFormat, `<span class="bold-text">${loadToFormat}</span>`);
        }
        if(resilienceToFormat !== null) {
            resultString = resultString.replace(resilienceToFormat, `<span class="bold-text">${resilienceToFormat}</span>`);
        }

        return resultString;
    }

    const formatPart = (part) => {
        if(part === "Options") {
            if(scenario.attachment !== null && scenario.attachment.includes("[options]")) {
                return scenario.options;
            }
        }
        else if(part === "Expected") {
            if(scenario.attachment !== null && scenario.attachment.includes("[expected]")) {
                return scenario.expected.value + " " + scenario.expected.unit;
            }
        }
        else if(part === "Load") {
            return WhatIfVariantFormatterService(scenario, "Load");
        }
        else if(part === "Resilience") {
            return WhatIfVariantFormatterService(scenario, "Resilience");
        }
        return null;
    }

    const formattedRqsDescription = formatRqsDescription();

    return (
        <p className="description" id="description-format" dangerouslySetInnerHTML={{ __html: formattedRqsDescription }}></p>
    )
}