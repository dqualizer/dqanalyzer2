import WhatIfDescriptionFiller from "./WhatIfDescriptionFiller.jsx";
import scenarioSpecs from "../../data/scenariotest-specs.json";

export default function ScenarioDescriptionFormatter(scenario) {
    let presentence;
    if(scenario.description_audience === null) {
        let descriptionList = [];
        if(scenario.description_speakers !== "") {
            descriptionList.push(scenario.description_speakers);
        }
        if(scenario.description_message !== "") {
            descriptionList.push(scenario.description_message);
        }
        let attachment = scenario.attachment === "" ? "": " " + scenario.attachment;
        presentence = descriptionList.join(" ") + attachment;
    }
    else {
        let descriptionList = [];
        if (scenario.description_speakers !== "") {
            descriptionList.push(scenario.description_speakers);
        }
        if (scenario.description_message !== "") {
            descriptionList.push(scenario.description_message);
        }
        if (scenario.description_audience !== "") {
            descriptionList.push(scenario.description_audience);
        }
        let attachment = scenario.attachment === "" ? "" : " " + scenario.attachment;
        presentence = descriptionList.join(" ") + attachment;
    }

    if(scenario.selected_mode === "What if") {
        let loadVariantWithPlaceholder = scenarioSpecs.load_design.find(loadVariant => loadVariant.name === scenario.load_design?.name);
        let resilientVariantWithPlaceholder = scenarioSpecs.resilience_design.find(resilientVariant => resilientVariant.name === scenario.resilience_design?.name);

        let load_description = scenario.description_load?.replace(" [load]", "");
        let resilience_description = scenario.description_resilience?.replace(" [resilience]", "");
        if(scenario.what_if_mode === "load") {
            return (
                <p className="description">{presentence} {load_description} <span className="bold-text">{WhatIfDescriptionFiller(loadVariantWithPlaceholder, scenario.load_design, false)}</span>{scenario.resilience_design !== null ? " " +  resilience_description : null}{scenario.resilience_design !== null ? <span className="bold-text"> {WhatIfDescriptionFiller(resilientVariantWithPlaceholder, scenario.resilience_design, false)}</span>: null}?</p>
            )
        }
        else if(scenario.what_if_mode === "resilience") {
            return (
                <p className="description">{presentence} {resilience_description} <span className="bold-text">{WhatIfDescriptionFiller(loadVariantWithPlaceholder, scenario.load_design, false)}</span>{scenario.load_design !== null ? " " +  load_description : null} {scenario.load_design !== null ?<span className="bold-text"> {WhatIfDescriptionFiller(loadVariantWithPlaceholder, scenario.load_design, false)}</span>: null}?</p>
            )
        }
    }
    else if(scenario.selected_mode === "Monitoring") {
        return (
            <p className="description">{scenario.description}</p>
        )
    }
}