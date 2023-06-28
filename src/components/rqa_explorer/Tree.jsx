import React, { useEffect } from 'react'
import ExpandableRqaNode from './Node';
import { useState } from 'react';
import axios from 'axios';
export default function RQATree({ inputOpen, setInputOpen }) {

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

    }

    const handleOnExecute = async (rqa) => {
        let rqaToSend = rqa;
        delete rqaToSend["name"];
        delete rqaToSend["id"];
        rqaToSend.runtime_quality_analysis.loadtests.forEach((loadtest) => {
            delete loadtest["name"];

        });

        await axios.post(`http://localhost:8070/api/rqa`, rqaToSend).then((response) => {
            console.log(response);
        })
    }
    return (
        <>
            {rqas.map((rqa) => {
                return <>
                    <ExpandableRqaNode key={rqa.name} data={rqa.name} rqa={rqa} expandFunction={() => onExpandClick(rqa.name)} expanded={menuState[rqa.name]} level={1} />
                    {menuState[rqa.name] && Object.keys(rqa.runtime_quality_analysis).map((keyName, i) => {
                        if (keyName == "loadtests") {
                            return (
                                <>
                                    <ExpandableRqaNode data={"Loadtests"} level={2} expandFunction={() => onExpandClick(keyName)} expanded={menuState[keyName]} />
                                    {menuState[keyName] && rqa.runtime_quality_analysis[keyName].map((loadtest) => {
                                        return (
                                            <>
                                                <ExpandableRqaNode data={loadtest.name} level={3} expandFunction={() => onExpandClick(loadtest.name)} expanded={menuState[loadtest.name]} />
                                                {menuState[loadtest.name] && <ExpandableRqaNode paramName="Activity" data={loadtest.name} expandable={false} level={5} expanded={menuState[loadtest.name]} />}
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

                    {menuState[rqa.name] && <button className="btn btn-sm btn-wide btn-primary" onClick={() => handleOnExecute(rqa)}>Execute</button>}


                </>
            })}
            {

            }


            {inputOpen && <ExpandableRqaNode level={1} setRqas={setRqas} setMenuState={setMenuState} setInputOpen={setInputOpen} />}
        </>
    )
}
