const explorer = [{
    id: "1",
    name: "Loadtest Rqa",
    version: "1",
    environment: "DEV",
    runtime_quality_analysis: {
        loadtests: [
            {
                name: "Auftrag erstellen",
                artifact: {
                    "object": "id1",
                    "activity": "id4"
                },
                description: "No description",
                stimulus: {
                    "load_profile": "LOAD_PEAK",
                    "highest_load": "VERY_HIGH",
                    "time_to_highest_load": "FAST"
                },
                parametrization: {
                    path_variables: [
                        {
                            key: "headers",
                            value: "AUFTRAG/ALLGEMEIN/HEADERS.JSON"
                        },
                        {
                            key: "headers",
                            value: "AUFTRAG/ALLGEMEIN/HEADERS.JSON"
                        },

                    ]
                },
                response_measures: {
                    response_time: "SATISFIED"
                },
                result_metrics: [
                    "RESPONSE_TIME"
                ]

            }
        ]
    }
}];

export default explorer;