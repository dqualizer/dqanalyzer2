import React from 'react'
import ExpandableRqaNode from './ExpandableRqaNode';
import { useState } from 'react';
export default function RQANode(params) {
    const rqas = params.data;

    const [menuState, setMenuState] = useState({});

    const onExpandClick = (menu) => {
        setMenuState((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu]
        }));

        console.log(menuState)
    }
    return (
        <>
            {rqas.map((rqa) => {
                return <>
                    <ExpandableRqaNode key={rqa.name} data={rqa.name} rqa={rqa} expandFunction={() => onExpandClick(rqa.name)} expanded={menuState.rqa} level={1} />
                    {menuState[rqa.name] && Object.keys(rqa.runtime_quality_analysis).map((keyName, i) => {
                        if (keyName == "loadtests") {
                            return (
                                <>
                                    <ExpandableRqaNode data={"Loadtests"} level={2} expandFunction={() => onExpandClick(keyName)} expanded={menuState[keyName]} />
                                    {menuState[keyName] && rqa.runtime_quality_analysis[keyName].map((loadtest) => {
                                        return (
                                            <>
                                                <ExpandableRqaNode data={loadtest.name} level={3} expandFunction={() => onExpandClick(loadtest.name)} expanded={menuState[loadtest.name]} />
                                                {menuState[loadtest.name] && <ExpandableRqaNode paramName="Acitivity" data={loadtest.description} expandable={false} level={5} expanded={menuState[loadtest.name]} />}
                                                {menuState[loadtest.name] && Object.keys(loadtest).map((keyName, i) => {
                                                    if (typeof loadtest[keyName] === "string" && keyName != "name")
                                                        return <ExpandableRqaNode paramName={keyName} data={loadtest[keyName]} level={5} expandable={false} expanded={menuState[keyName]} />
                                                    return null;

                                                })}
                                                {menuState[loadtest.name] && Object.keys(loadtest).map((keyName, i) => {
                                                    if (typeof loadtest[keyName] == "object")
                                                        return <>

                                                            {keyName != "artifact" && <>
                                                                <ExpandableRqaNode data={keyName} level={5} expandFunction={() => onExpandClick(keyName)} expanded={menuState[keyName]} />
                                                                {keyName != "result_metrics" ? Object.keys(loadtest[keyName]).map((paramName, i) => {
                                                                    return (<>
                                                                        {paramName == "path_variables" ? (
                                                                            menuState[keyName] && Object.keys(loadtest[keyName][paramName]).map(
                                                                                (value) => {
                                                                                    return <ExpandableRqaNode paramName={value} data={loadtest[keyName][paramName][value]} level={6} expandable={false} />
                                                                                }
                                                                            )
                                                                        )
                                                                            :
                                                                            menuState[keyName] && paramName == "result_metrics" ? <ExpandableRqaNode paramName={paramName} data={loadtest[keyName][paramName]} level={6} expandable={false} />
                                                                                : menuState[keyName] ? <ExpandableRqaNode paramName={paramName} data={loadtest[keyName][paramName]} level={6} expandable={false} />
                                                                                    : null
                                                                        }
                                                                    </>)
                                                                }) :

                                                                    menuState[keyName] && loadtest[keyName].map((keyName) => {
                                                                        return <ExpandableRqaNode data={keyName} level={6} expandable={false} />
                                                                    })}


                                                            </>
                                                            }
                                                        </>


                                                    return null;

                                                })}

                                            </>)

                                    })}
                                </>
                            )
                        }

                        if (keyName == "resilience") {
                            return (
                                <>
                                    <ExpandableRqaNode data={"Resilience"} level={2} expandFunction={() => onExpandClick(keyName)} expanded={menuState[keyName]} />
                                </>
                            )
                        }

                        if (keyName == "monitoring") {
                            return (
                                <>
                                    <ExpandableRqaNode data={"Monitoring"} level={2} expandFunction={() => onExpandClick(keyName)} expanded={menuState[keyName]} />
                                </>
                            )
                        }

                    }
                    )}

                </>
            })}
            {

            }




        </>
    )
}
