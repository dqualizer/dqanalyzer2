## Bachelor Thesis "Generating and Elicitation of Runtime Quality Scenarios for Domain Stories"
<p style="text-align: center;">Daniel Flat </p>

This is a guide for using our approach to generate and elicit runtime quality scenarios for domain stories. In the context of the dqualizer research project, the dqanalyzer was extended with additional use cases.

### Installation
1. Clone the [dqApi](https://github.com/dqualizer/dqApi) component and execute the command `docker compose up` in the terminal.
2. Open the [.env](.env) file and add `VITE_BACKEND_URL=http://localhost:8099` to the file.
3. Enter `npm run dev` in the command line. Then point your browser to http://localhost:5173.

### Manual
1. If there is no domain provided, press the button "Create Domain".
2. Choose the desired domain.

Now you should have a view like this:
![README_Img_1.png](rsc%2FREADME_Img_1.png)

By pressing the cloud icon in the upper left corner, you can switch between the normal view of dqAnalyzer and the scenario view from the bachelor thesis.

To create a scenario test, click on the form icon on the left.

#### Test Steps

1. First of all, choose the activity you want to examine.
2. You can decide if you want to do pure monitoring or if you want to under test your system in terms of load or resilience.
3. Afterward, scenarios are suggested. You can filter for suitable questions using the search bar.

If you have selected ”What if” as the mode:
4. You can adjust the parameters for the load and resilience design respectively or use the pre-selected ones from dqualizer.

5. If you want to examine multiple scenarios in one test, you can add more forms using ”Add Scenario”. In addition, there is an X-button at the top right of each form that can be used to delete the respective form.

A filled form could look like this:
![README_Img_3.png](rsc%2FREADME_Img_3.png)

6. Alternatively, you can skip steps 1, 2 and 3 by clicking "All Activities" and selecting a question from a collection of all activities that can be examined.

![README_Img_4.png](rsc%2FREADME_Img_4.png)

7. After filling in the forms, you can click "Next" to get to the Settings View, where you can specify the duration of the entire test under "Accuracy". Furthermore, the user can decide whether the test should take place in the real or in a test environment. Finally, a time slot can be specified for the test environment.

![README_Img_5.png](rsc%2FREADME_Img_5.png)

8. Pressing “Add Test” creates a configuration for the scenario test. This may look like this, for example:

```
{
  "id": "1",
  "context": "Werkstattauftrag",
  "scenarios": [
    {
      "activity": {
        "artifact": {
          "activity": "64e464c64e17797a9c2e8bfe"
        },
        "description": "Reading Order"
      },
      "mode": "What if",
      "description": "How does the number of customers in the order portal change if the order portal has a very high and very fast load peak?",
      "metric": "how_many_change",
      "expected": null,
      "load_design": {
        "name": "Load Peak",
        "design_parameters": [
          {
            "name": "Highest Load",
            "value": {
              "name": "Very High",
              "value": 15
            }
          },
          {
            "name": "Time to Highest load",
            "value": {
              "name": "Very Fast",
              "value": "10s"
            }
          }
        ]
      },
      "resilience_design": null
    }
  ],
  "settings": {
    "accuracy": "46",
    "environment": "Productive",
    "time_slot": null
  }
}
```

Last but not least, a prototype for the Scenario Explorer was developed as part of the bachelor thesis, which can be accessed via the bar chart icon on the left. In the future, it should be possible to edit, delete, enable, disable and execute scenario tests.

![README_Img_6.png](rsc%2FREADME_Img_6.png)

