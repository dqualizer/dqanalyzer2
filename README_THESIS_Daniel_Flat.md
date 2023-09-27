## Bachelor Thesis "Generating and Elicitation of Runtime Quality Scenarios for Domain Stories"

<p style="text-align: center;">Daniel Flat </p>

This is a guide for using our approach in order to generate and elicit runtime quality scenarios for domain stories. In
the context of the dqualizer research project, the dqAnalyzer component was extended to include additional use cases.

### Installation

1. Clone the [dqApi](https://github.com/dqualizer/dqApi) component and execute the command `docker compose up` in the
   terminal.
2. Open the [.env](.env) file and add `VITE_BACKEND_URL=http://localhost:8099` to the file.
3. Enter `npm run dev` in the command line. Then open http://localhost:5173 in your browser.

### Manual

1. If there is no domain provided, press the button "Create Domain".
2. Choose the desired domain.

Now you should have a view like this:
![README_Img_1.png](rsc%2FREADME_Img_1.png)

The cloud icon in the upper-left corner can be used to switch between the normal view of dqAnalyzer and the scenario
view developed during this thesis. The scenario view has two icons in the sidebar. The bar chart icon shows the scenario
explorer part, and the icon with a form and magnifying glass is to create a scenario test.

#### Steps for Creating a Scenario Test

1. First of all, click on the scenario test icon.
2. Now you can choose the activity you would like to examine. If you do not possess a specific activity yet, you can
   press “All Activities” to promptly generate a multitude of scenarios for each valid activity in your domain story.
   When you press “All Activities”, you do not need to do step 3.

When you press on „All Activities“, the page should look like this:

![README_Img_3.png](rsc%2FREADME_Img_3.png)

3. You can choose the mode for your scenario. You can pick between pure monitoring and what-if scenarios. Monitoring
   means that you receive scenarios that do not manipulate your system components and are for examining the current
   behavior of your systems under normal circumstances. On the other side, “what-if” creates scenarios that inspect your
   system under specific load or resilience conditions.
4. Afterward, scenarios are suggested for you. You can filter for suitable scenarios using the search bar. Select the
   test scenario you would like to use to evaluate your system.
5. Some scenarios can be modified with response measures. Response measures mean that you can change options of the
   metric in your scenario. For example, if you declare in a test that the response time of your system should not take
   longer than..., you can change the expected behavior. Here you could, for example, choose between 200, 500, or 700
   milliseconds.

The next step is only important for the "What if" mode.

5. dqualizer asks you if you want to modify the load and resilience design. If you click “no”, dqualizer will keep the
   preselected parameter values. By pressing “yes”, you will be able to change the load and resilience of the scenario.
   It is important that the load variant, i.e., “load peak,”, “load increase,” or “constant load,” is always fixed due
   to the metric that the scenario wants to measure. Thus, only the parameters of the load variant can be changed. On
   the other hand, it is possible to adjust the resilience variant and its parameters for resilience tests.

6. If you want to examine multiple scenarios in one test, you can add more forms using ”Add Scenario”. In addition,
   there is an X-button at the top right of each form that can be used to delete the respective scenario.

A filled form could look like this:
![README_Img_2.png](rsc%2FREADME_Img_2.png)

8. After specifying all the required scenarios, you can click "Next" to get to the Settings View, where you can specify
   the duration of the entire test under "Accuracy". Furthermore, the user can decide whether the test should take place
   in the productive or in a test system.
   If you chose a test environment, you can finally define a time slot for the environment that describes the load
   profile of the test environment.

![README_Img_4.png](rsc%2FREADME_Img_4.png)

9. Pressing “Add Scenario Test” creates a configuration for the scenario test. This may look like this, for example:

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
        "description": "How does the total number of customers in the order portal change if the order portal has a high and slow load peak and many shutdowns?",
        "metric": "how_many_change",
        "options": null,
        "expected": null,
        "load_design": {
          "name": "Load Peak",
          "design_parameters": [
            {
              "name": "Highest Load",
              "value": {
                "name": "High",
                "value": 10
              }
            },
            {
              "name": "Time to Highest load",
              "value": {
                "name": "Slow",
                "value": "20s"
              }
            }
          ]
        },
        "resilience_design": {
          "name": "Unavailable",
          "design_parameters": [
            {
              "name": "How often does the stimulus occur?",
              "value": {
                "name": "More than once",
                "value": 20
              }
            }
          ]
        }
      }
    ],
    "settings": {
      "accuracy": 66,
      "environment": "Test",
      "time_slot": {
        "representation": "After work from 16:00 PM to 12:00 AM",
        "start_time": "16:00",
        "end_time": "00:00"
      }
    }
  }
```

Last but not least, a prototype for the scenario explorer was developed as part of the bachelor thesis, which can be
accessed via the bar chart icon on the left. The Scenario Explorer contains all defined scenario tests. In the future,
it should be possible to edit, delete, enable, disable and execute scenario tests.

![README_Img_5.png](rsc%2FREADME_Img_5.png)

