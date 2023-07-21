// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const axios = require('axios');
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  //function to get parameters from agent and start orchestrator API (Start Job)
  function firstHandler(agent){
    let paramsName = agent.getContext("awaiting_name").parameters;
	let name = paramsName.name;
    
    let paramsEmail = agent.getContext("awaiting_email").parameters;
	let email = paramsEmail.email;
    
    let paramsPhone = agent.getContext("awaiting_phonenumber").parameters;
	let phone = paramsPhone.phone;
    
    let paramsID = agent.getContext("awaiting_id").parameters;
	let id = paramsID.id;
    
    let paramsBornDate = agent.getContext("awaiting_borndate").parameters;
	let borndate = paramsBornDate.borndate;
    
    let paramsFile = agent.getContext("awaiting_file").parameters;
	let file = paramsFile.url;
    
    let paramsIsRefugee = agent.getContext("awaiting_isrefugee").parameters;
	let isRefugee = paramsIsRefugee.isRefugee;
    
    let paramsAddress = agent.getContext("awaiting_address").parameters;
	let address = paramsAddress.address;
    
      
    var data = JSON.stringify({
      "startInfo": {
            "ReleaseKey": "72ff1bbd-1396-4ea9-b986-e29e8aea49bc",
            "Strategy": "ModernJobsCount",
            "JobsCount": 1,
            "InputArguments": "{'in_Name':'"+name+"','in_Email':'"+email+"','in_PhoneNumber':'"+phone+"','in_ID':'"+id+"','in_BornDate':'"+borndate+"','in_LinkImage':'"+file+"','in_Refugee':'"+isRefugee+"','in_Adress':'"+address+"'}"
        }
    });

    var config = {
      method: 'post',
      url: 'https://cloud.uipath.com/hyperhack2023/HyperHack2023/orchestrator_/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs',
      headers: { 
        'X-UIPATH-OrganizationUnitId': '4494992', 
        'Accept': 'application/json, text/plain, */*', 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ...'
      },
      data : data
    };

    return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Get Refugee', firstHandler);
  agent.handleRequest(intentMap);
  
});
