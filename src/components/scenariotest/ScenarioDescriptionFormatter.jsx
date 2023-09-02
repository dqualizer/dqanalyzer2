import PlaceholderWordMapperService from "./PlaceholderWordMapperService.jsx";
import WhatIfVariantFormatterService from "./WhatIfVariantFormatterService.jsx";

export default function ScenarioDescriptionFormatter(scenario) {

    const formatRqsDescription = () => {
        let resultString = scenario.description;
        let attachmentToFormat = formatPart("Attachment");
        let loadToFormat = formatPart("Load");
        let resilienceToFormat = formatPart("Resilience");

        if(attachmentToFormat !== null) {
            resultString = resultString.replace(attachmentToFormat, `<span class="bold-text">${attachmentToFormat}</span>`);
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
        if(part === "Attachment") {
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

    let formattedRqsDescription = formatRqsDescription();

    return (
        <p className="description" id="description-format" dangerouslySetInnerHTML={{ __html: formattedRqsDescription }}></p>
    )
}