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

