# dqanalyzer2

# This README is work in progress...

## Description

This is the React Version of the dqAnalyzer.
Here we focus on providing functionalities to declare runtime quality analysis based on the domain model.

It uses an extended version of the original Domain-Architecture-Mapping by Eduard Schander to display the whole domain and all the activities which can be executed in it.

Also it provides a "Loadtest Specifier", which can be used to specify loadtests for different activities in the domain. This is the same functionallity like Dominiks "Extended Domain Story Modeler" had.
Furthermore the new dqAnalyzer has an "RQA Explorer". The Rqa Explorer is used to manage and execute saved Runtime Quality Analysis.

## Workflow from a User Perspective

1. The user selects one of the given Test-Domains. CUrrently only "Werkstatt" is provided.
2. The user opens the Rqa Explorer to create a new Rqa Definition.
3. The user gives a name to the Rqa, like "Loadtesting one Endpoint with very high load"
4. The User clicks on the Loadtest Symbol in the left sidebar to open the Loadtest Specificator.
5. The User selects a system and the activity which should be loadtested.
6. The user specifies the design parameters, response measures and result metrics
7. The users adds the loadtest to the rqa definition he created before.
8. The User opens the rqa definition in the rqa explorer and presses "execute"
9. The rqa makes it´s way trough dqualizer

## Dependencies

### dqApi

This App uses the dqApi (https://github.com/levinkerschberger/dqapi) to store and retrieve Domain-Architecture-Mappings and RQA-Definitions.
It´s a Spring Boot App which interacts with a MongoDB.
The URL for the Backend can be configured in .env

### dqTranslator

The biggest issue is the dqTranslator. It does not interact with dqApi, yet so the dam is a ressource file of it. Creating a DAM in dqApi, for example, creates ID´s, which are reused in RQA-Definitions. Those have to align with the id´s of the dam in dqTranslator. So be aware to check the Mapping in the Translator, when running into issues while developing.

## How to build and run
### Locally
* `npm i``
* `npm run dev`

### Docker
* `docker buildx build --tag ghcr.io/dqualizer/dqAnalyzer .`
* `docker run ghcr.io/dqualizer/dqAnalyzer`

### Docker compose
* `docker compose pull`
* `docker compose up -d`

### Deploy to Packages
* There is a GitHub action set up, that automatically pushes the dqanalyzer2 image to [Github Container Registry](https://github.com/dqualizer/dqanalyzer2/pkgs/container/dqanalyzer2)
