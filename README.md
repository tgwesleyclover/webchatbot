This project has been Sourced from https://angularfirebase.com/lessons/chatbot-in-angular-with-dialogflow-api-ai/
and has bot-to-human-handoff sourced from https://github.com/dialogflow/agent-human-handoff-nodejs

## Info

- Angular v8 is currently used (look at angular JSON)
- Firebase is used for hosting (demo purposes)
- Express and socket io (for the operator/hotelier side)
- Dialogflow 


This project aims to:

- Emulate CMR and BH bots to show how the system can answer multiple/different requests~~
- Create an interface to add more agents easily (representative of adding new customer)
- Create an interface to add new intent to agent easily (customer being able to customise their bot)
- Create Bot-to-human-handoff functionality (guest side + hotelier side)
- Integrate Twilio to allow functionality to used via Channels


## Usage

- git clone
- npm install
- npm start (will run the express server and also open angular app in new browser window)



## Project structure

- Dashboard component has tabs which show the chat and admin settings components of the demo
- Chat module stores the 


## Known Issues

- Having trouble converting the JS to Angular based project (not a major since the Loop platform is not angular based anyway)
- Cannot run express server as part of firebase so cannot access URL for operator
