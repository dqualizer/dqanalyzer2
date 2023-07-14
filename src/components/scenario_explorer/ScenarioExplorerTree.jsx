import React, { useEffect } from 'react'
import ExpandableScenarioNode from './ScenarioExplorerNode.jsx';
import { useState } from 'react';
import axios from 'axios';
export default function ScenarioTree({ inputOpen, setInputOpen }) {

    const [rqas, setRqas] = useState([])

    const [menuState, setMenuState] = useState({});

    useEffect(() => {
        axios.get(`https://64917f002f2c7ee6c2c85311.mockapi.io/api/v1/rqas`).then((response) => {
            setRqas(response.data);
        })
    }, []);


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
                    <ExpandableScenarioNode key={rqa.name} data={rqa.name} rqa={rqa} expandFunction={() => onExpandClick(rqa.name)} expanded={menuState[rqa.name]} level={1} />
                    {menuState[rqa.name] && Object.keys(rqa.runtime_quality_analysis).map((keyName, i) => {
                        if (keyName == "loadtests") {
                            return (
                                <>
                                    <ExpandableScenarioNode data={"Loadtests"} level={2} expandFunction={() => onExpandClick(keyName)} expanded={menuState[keyName]} />
                                    {menuState[keyName] && rqa.runtime_quality_analysis[keyName].map((loadtest) => {
                                        return (
                                            <>
                                                <ExpandableScenarioNode data={loadtest.name} level={3} expandFunction={() => onExpandClick(loadtest.name)} expanded={menuState[loadtest.name]} />
                                                {menuState[loadtest.name] && <ExpandableScenarioNode paramName="Acitivity" data={loadtest.description} expandable={false} level={5} expanded={menuState[loadtest.name]} />}
                                                {menuState[loadtest.name] && Object.keys(loadtest).map((keyName, i) => {
                                                    if (typeof loadtest[keyName] === "string" && keyName != "name")
                                                        return <ExpandableScenarioNode paramName={keyName} data={loadtest[keyName]} level={5} expandable={false} expanded={menuState[keyName]} />
                                                    return null;

                                                })}
                                                {menuState[loadtest.name] && Object.keys(loadtest).map((keyName, i) => {
                                                    if (typeof loadtest[keyName] == "object")
                                                        return <>

                                                            {keyName != "artifact" && <>
                                                                <ExpandableScenarioNode data={keyName} level={5} expandFunction={() => onExpandClick(keyName)} expanded={menuState[keyName]} />
                                                                {keyName != "result_metrics" ? Object.keys(loadtest[keyName]).map((paramName, i) => {
                                                                    return (<>
                                                                        {paramName == "path_variables" ? (
                                                                            menuState[keyName] && Object.keys(loadtest[keyName][paramName]).map(
                                                                                (value) => {
                                                                                    return <ExpandableScenarioNode paramName={value} data={loadtest[keyName][paramName][value]} level={6} expandable={false} />
                                                                                }
                                                                            )
                                                                        )
                                                                            :
                                                                            menuState[keyName] && paramName == "result_metrics" ? <ExpandableScenarioNode paramName={paramName} data={loadtest[keyName][paramName]} level={6} expandable={false} />
                                                                                : menuState[keyName] ? <ExpandableScenarioNode paramName={paramName} data={loadtest[keyName][paramName]} level={6} expandable={false} />
                                                                                    : null
                                                                        }
                                                                    </>)
                                                                }) :

                                                                    menuState[keyName] && loadtest[keyName].map((keyName) => {
                                                                        return <ExpandableScenarioNode data={keyName} level={6} expandable={false} />
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
                                    <ExpandableScenarioNode data={"Resilience"} level={2} expandFunction={() => onExpandClick(keyName)} expanded={menuState[keyName]} />
                                </>
                            )
                        }

                        if (keyName == "monitoring") {
                            return (
                                <>
                                    <ExpandableScenarioNode data={"Monitoring"} level={2} expandFunction={() => onExpandClick(keyName)} expanded={menuState[keyName]} />
                                </>
                            )
                        }

                    }
                    )}



                </>
            })}
            {

            }


            {inputOpen && <ExpandableScenarioNode level={1} setRqas={setRqas} setMenuState={setMenuState} setInputOpen={setInputOpen} />}

        </>
    )
}
