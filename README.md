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

## Example DAM

The Example used while Testing is "Werkstattauftrag". This is the Json, which was postet to the dqapi-Endpoint "/api/v1/dam/" for testing

```
 {
  "version": 1,
  "context": "werkstattauftrag",
  "server_info": [
   {
    "host": "http://127.0.0.1:9000",
    "environment": "TEST"
   }
  ],
  "actors": [
   {
    "_id": "1",
    "actor_name": "Kunde"

   },
   {
    "_id": "2",
    "actor_name": "Händler"

   }
  ],
  "systems": [
   {

    "name": "AuftragsPortal",
    "operation_id": "ddd.autohaus.tacticald.design.app.werkstattauftrag.api.WerkstattauftragController",
    "type": "service",
    "implements": [],
    "objects": [
     "id2"
    ],
    "activities": [
     {
      "name": "Auftrag lesen",
      "operation_id": "readAuftrag",
      "initiator": "Kunde",
      "workObject": "Auftrag",
      "action": "ließt",
      "type": "method",
      "parameter": [],
      "endpoint": {
       "field": "/auftrag/{auftragsnummer}",
       "operation": "GET",
       "path_variables": [
        {
         "name": "auftragsnummer",
         "szenarios": [
          {
           "path": "auftrag/auftragsnummern/nicht_angelegt.json"
          }
         ]
        },
        {
         "name": "customer",
         "szenarios": [
          {
           "name": "Valide Customer",
           "path": "auftrag/auftragsnummern/angelegt.json"
          }
         ]
        }
       ],
       "url_parameter": [],
       "request_parameter": [],
       "payload": [],
       "responses": [
        {
         "expected_code": 200,
         "type": "id8"
        }
       ]
      }
     },
     {

      "name": "Auftrag erstellen",
      "operation_id": "createAuftrag",
      "action": "erstellt",
      "workObject": "Auftrag",
      "initiator": "Kunde",
      "type": "method",
      "parameter": [
       "id6"
      ],
      "endpoint": {
       "field": "/auftrag/new",
       "operation": "POST",
       "path_variables": [],
       "url_parameter": [],
       "request_parameter": [
        {
         "name": "headers",
         "szenarios": [
          {
           "name": "valid headers",
           "path": "auftrag/allgemein/headers.json"
          }
         ]
        },
        {
         "name": "authorization",
         "szenarios": [
          {
           "name": "valid authorization",
           "path": "auftrag/allgemein/authorization.json"
          }
         ]
        }
       ],
       "payload": [
        {
         "name": "auftraggeber",
         "szenarios": [
          {
           "name": "auftraggeber_2022",
           "path": "auftrag/auftraggeber/2022/auftraggeber.json"
          }
         ]
        },
        {
         "name": "auftraggeber",
         "szenarios": [
          {
           "name": "auftraggeber_2023",
           "path": "auftrag/auftraggeber/2023/auftraggeber.json"
          }
         ]
        }
       ],
       "responses": [
        {
         "expected_code": 201,
         "type": "id8"
        }
       ]
      }
     },
     {
      "name": "Status verändern",
      "operation_id": "updateStatus",
      "workObject": "Auftragsstatus",
      "type": "method",
      "action": "verändert",
      "initiator": "Händler",
      "parameter": [
       "id7"
      ],
      "endpoint": {
       "field": "/auftrag/{auftragsnummer}",
       "operation": "PUT",
       "path_variables": [
        {
         "name": "auftragsnummer",
         "szenarios": [
          {
           "name": "Valide Auftragsnummern",
           "path": "auftrag/auftragsnummern/angelegt.json"
          }
         ]
        }
       ],
       "url_parameter": [],
       "request_parameter": [
        {
         "name": "headers",
         "szenarios": [
          {
           "name": "valid headers",
           "path": "auftrag/allgemein/headers.json"
          }
         ]
        }
       ],
       "payload": [
        {
         "name": "auftragsstatus",
         "szenarios": [
          {
           "name": "Mixed Status",
           "path": "auftrag/auftragsstatus/auftragsstatus.json"
          }
         ]
        }
       ],
       "responses": [
        {
         "expected_code": 200,
         "type": "string"
        }
       ]
      }
     }
    ]
   }
  ]
 }
```

## Executing a RQA step by step in the current state

1. Run dqApi-docker-compose
2. Run dqanalyzer with npm run dev
3. Post the DAM to dqApi with postman to POST-Endpoint `http://localhost:8099/api/v1/dam/`
4. The DAM should now appear on the dqanalyzer-Homepage
5. Get all DAMs with Postman to extract the object and activity id´s GET Endpoint `http://localhost:8099/api/v1/dam/`
6. Make a Branch of dqTranslator and change the object and activity id´s in `dqtranslator/src/main/resources/mappings/mapping-werkstatt.json` accordingly
7. Execute the dqualizer-compose with the image of your translator branch.
8. Go to dqAnalyzer, open the Domain, create a rqa definition and add a loadtest
9. Execute the loadtest
