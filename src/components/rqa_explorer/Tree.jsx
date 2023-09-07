import React, { useEffect } from "react";
import ExpandableRqaNode from "./Node";
import { useState } from "react";
import axios from "axios";
import RqaInputField from "./RqaInputField";

export default function RQATree({ inputOpen, setInputOpen, data }) {
  const [rqas, setRqas] = useState([]);

  const [menuState, setMenuState] = useState({});

  const onExpandClick = (menu) => {
    setMenuState((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const handleOnExecute = async (rqa) => {
    let rqaToSend = rqa;
    delete rqaToSend["name"];
    delete rqaToSend["id"];
    rqaToSend.runtime_quality_analysis.loadtests.forEach((loadtest) => {
      delete loadtest["name"];
    });

    await axios
      .post(`http://localhost:8070/api/rqa`, rqaToSend)
      .then((response) => {
        console.log(response);
      });
  };
  return (
    <>
      {data.map((rqa) => {
        return (
          <div key={rqa.id}>
            <ExpandableRqaNode
              key={rqa.name}
              data={rqa.name}
              rqa={rqa}
              expandFunction={() => onExpandClick(rqa.name)}
              expanded={menuState[rqa.name]}
              level={1}
            />
            {menuState[rqa.name] &&
              Object.keys(rqa.runtime_quality_analysis).map((keyName, i) => {
                if (keyName == "loadtests") {
                  return (
                    <div key={i}>
                      <ExpandableRqaNode
                        data={"Loadtests"}
                        level={2}
                        expandFunction={() => onExpandClick(keyName)}
                        expanded={menuState[keyName]}
                      />
                      {menuState[keyName] &&
                        rqa.runtime_quality_analysis.loadtests.map(
                          (loadtest) => {
                            return (
                              <>
                                <ExpandableRqaNode
                                  data={loadtest.name}
                                  level={3}
                                  expandFunction={() =>
                                    onExpandClick(loadtest.name)
                                  }
                                  expanded={menuState[loadtest.name]}
                                />
                                {menuState[loadtest.name] && (
                                  <div>
                                    <ExpandableRqaNode
                                      data={"Stimulus"}
                                      expandable={true}
                                      level={5}
                                      expandFunction={() => {
                                        onExpandClick("Stimulus");
                                      }}
                                      expanded={menuState.Stimulus}
                                    />
                                    <ExpandableRqaNode />
                                  </div>
                                )}
                                {menuState["Stimulus"] && loadtest.stimulus}
                              </>
                            );
                          }
                        )}
                    </div>
                  );
                }

                if (keyName == "resilience") {
                  return (
                    <>
                      <ExpandableRqaNode
                        data={"Resilience"}
                        level={2}
                        expandFunction={() => onExpandClick(keyName)}
                        expanded={menuState[keyName]}
                      />
                    </>
                  );
                }

                if (keyName == "monitoring") {
                  return (
                    <>
                      <ExpandableRqaNode
                        data={"Monitoring"}
                        level={2}
                        expandFunction={() => onExpandClick(keyName)}
                        expanded={menuState[keyName]}
                      />
                    </>
                  );
                }
              })}

            {menuState[rqa.name] && (
              <button
                className="btn btn-sm btn-wide btn-primary"
                onClick={() => handleOnExecute(rqa)}
              >
                Execute
              </button>
            )}
          </div>
        );
      })}
      {}

      {inputOpen && (
        <RqaInputField
          level={1}
          setRqas={setRqas}
          setMenuState={setMenuState}
          setInputOpen={setInputOpen}
        />
      )}
    </>
  );
}
