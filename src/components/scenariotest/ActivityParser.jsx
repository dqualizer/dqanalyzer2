export default function ActivityParser(nodes, edges, selectedActivity) {

    //TODO: Add annotations
    const findAllElements = () => {
        const allElements = [];
        let currentSource = null;

        //finding the first element
        for (const edge of edges) {
            const source = edge.source;
            let isFirstElement = true;

            for (const otherEdge of edges) {
                const otherSource = otherEdge.source;
                const otherTarget = otherEdge.target;

                if (source !== otherSource && source === otherTarget) {
                    isFirstElement = false;
                    break;
                }
            }

            if (isFirstElement) {
                currentSource = source;
                break;
            }
        }

        while (currentSource !== null) {
            let found = false;

            for (const edge of edges) {
                const source = edge.source;
                const target = edge.target;

                if (currentSource === source) {
                    found = true;
                    const node = nodes.find((n) => n.id === currentSource);
                    allElements.push(node);
                    allElements.push(edge);
                    currentSource = target;
                    break;
                }
            }

            if (!found) {
                break;
            }
        }

        //finding the last element
        for (const edge of edges) {
            const target = edge.target;

            if (currentSource === target) {
                const node = nodes.find((n) => n.id === target);
                allElements.push(node);
            }
        }

        return allElements.reverse();
    }

    const buildWordArray = (allElements) => {
        let sentenceArray = [];
        for (const element of allElements) {
            // if element is not an edge
            if (element.data !== undefined) {
                let typeString = null;
                if (element.data.icon === "Document") {
                    typeString = "work object";
                }
                else if (element.data.icon === "Person") {
                    typeString = "person";
                }
                //TODO: Edit Annotation. Maybe it is not necessary
                else if (element.data.icon === "Annotation") {
                    typeString = "annotation";
                }
                else if (element.data.icon === "System") {
                    typeString = "system";
                }
                let wordObject = {name: element.data.label.toLowerCase(), type: typeString};
                sentenceArray.push(wordObject);
            }
            // else element is an edge
            else {
                let name = element.label.endsWith("s") ? element.label.slice(0, -1) : element.label;
                let typeString = "verb";
                if (name === "in") {
                    typeString = "preposition"
                }
                let wordObject = {name: name.toLowerCase(), type: typeString};
                sentenceArray.push(wordObject);
            }
        }
        return sentenceArray;
    }

    let allActiveEdges = edges.filter((edge) => edge.name === selectedActivity.description);
    let allElements = findAllElements(allActiveEdges);

    if(selectedActivity.description === "Reading Order") {
        return {
            "speakers": [
                {
                    name: "customer",
                    type: "person",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "message": [
                {
                    name: "read",
                    type: "verb",
                },
                {
                    name: "order",
                    type: "work object",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "audience": [
                {
                    name: "in",
                    type: "preposition",
                },
                {
                    name: "order portal",
                    type: "system",
                    number: "singular",
                    is_proper_noun: false
                },
            ]
        }
    }
    else if(selectedActivity.description === "Creating Order") {
        return {
            "speakers": [
                {
                    name: "customer",
                    type: "person",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "message": [
                {
                    name: "create",
                    type: "verb",
                },
                {
                    name: "order",
                    type: "work object",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "audience": [
                {
                    name: "in",
                    type: "preposition",
                },
                {
                    name: "order portal",
                    type: "system",
                    number: "singular",
                    is_proper_noun: false
                },
            ]
        }
    }
    else if(selectedActivity.description === "Changing Status") {
        return {
            "speakers": [
                {
                    name: "merchant",
                    type: "person",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "message": [
                {
                    name: "change",
                    type: "verb",
                },
                {
                    name: "order status",
                    type: "work object",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "audience": [
                {
                    name: "in",
                    type: "preposition",
                },
                {
                    name: "order portal",
                    type: "system",
                    number: "singular",
                    is_proper_noun: false
                },
            ]
        }
    }

    else if(selectedActivity.description === "Creating Contract") {
        return {
            "speakers": [
                {
                    name: "petra",
                    type: "person",
                    number: "singular",
                    is_proper_noun: true
                },
            ],
            "message": [
                {
                    name: "creates",
                    type: "verb",
                },
                {
                    name: "car contract",
                    type: "work object",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "audience": [
                {
                    name: "in",
                    type: "preposition",
                },
                {
                    name: "sales portal",
                    type: "system",
                    number: "singular",
                    is_proper_noun: false
                },
            ]
        }
    }
    else if(selectedActivity.description === "Checking Rating") {
        return {
            "speakers": [
                {
                    name: "risk manager",
                    type: "person",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "message": [
                {
                    name: "checks",
                    type: "verb",
                },
                {
                    name: "client's credit rating",
                    type: "work object",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "audience": [
                {
                    name: "in",
                    type: "preposition",
                },
                {
                    name: "risk management portal",
                    type: "system",
                    number: "singular",
                    is_proper_noun: false
                },
            ]
        }
    }
    else if(selectedActivity.description === "Calculating Resale Value") {
        return {
            "speakers": [
                {
                    name: "risk manager",
                    type: "person",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "message": [
                {
                    name: "calculates",
                    type: "verb",
                },
                {
                    name: "resale value",
                    type: "work object",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "audience": [
                {
                    name: "in",
                    type: "preposition",
                },
                {
                    name: "risk management portal",
                    type: "system",
                    number: "singular",
                    is_proper_noun: false
                },
            ]
        }
    }
    else if(selectedActivity.description === "Voting Contract") {
        return {
            "speakers": [
                {
                    name: "risk manager",
                    type: "person",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "message": [
                {
                    name: "votes",
                    type: "verb",
                },
                {
                    name: "car contract",
                    type: "work object",
                    number: "singular",
                    is_proper_noun: false
                },
            ],
            "audience": [
                {
                    name: "in",
                    type: "preposition",
                },
                {
                    name: "risk management portal",
                    type: "system",
                    number: "singular",
                    is_proper_noun: false
                },
            ]
        }
    }

    return buildWordArray(allElements);
}