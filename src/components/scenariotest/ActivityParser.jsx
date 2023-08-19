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

    return buildWordArray(allElements);
}