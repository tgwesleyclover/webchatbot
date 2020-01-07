import { Injectable } from "@angular/core";

import { ApiAiClient } from "api-ai-javascript/es6/ApiAiClient";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import * as io from "socket.io-client";
export class Message {
  constructor(public content: string, public sentBy: string) {}
}

// export enum AppConstants {
//   EVENT_CUSTOMER_CONNECTED = "customer connected",
//   EVENT_CUSTOMER_DISCONNECTED = "customer disconnected",
//   EVENT_CUSTOMER_MESSAGE = "customer message",
//   EVENT_OPERATOR_MESSAGE = "operator message",
//   EVENT_OPERATOR_REQUESTED = "operator requested",
//   EVENT_SYSTEM_ERROR = "system error",
//   EVENT_DISCONNECT = "disconnect",
//   CONTEXT_OPERATOR_REQUEST = "operator_request",
//   OPERATOR_GREETING = `Hello, I'm a human. How can I help you?`
// }

@Injectable()
export class CMRChatService {
  readonly token = environment.dialogflow.CMRBot; //make call to Loop API
  readonly client = new ApiAiClient({ accessToken: this.token });
  constructor() {}
  conversation = new BehaviorSubject<Message[]>([]);

  // Sends and receives messages via DialogFlow
  async converse(msg: string) {
    const userMessage = new Message(msg, "user");
    this.update(userMessage);

    const res = await this.client.textRequest(msg);
    const speech = res.result.fulfillment.speech;
    const botMessage = new Message(speech, "bot");
    this.update(botMessage);
  }

  // Adds message to source
  update(msg: Message) {
    console.log("message: ", msg);
    this.conversation.next([msg]);
  }
}

@Injectable()
export class BHChatService {
  readonly token = environment.dialogflow.BHBot; //make call to Loop API
  readonly client = new ApiAiClient({ accessToken: this.token });
  constructor() {}
  conversation = new BehaviorSubject<Message[]>([]);

  // Sends and receives messages via DialogFlow
  async converse(msg: string) {
    const userMessage = new Message(msg, "user");
    this.update(userMessage);

    const res = await this.client.textRequest(msg);
    const speech = res.result.fulfillment.speech;
    const botMessage = new Message(speech, "bot");
    this.update(botMessage);
  }

  // Adds message to source
  update(msg: Message) {
    console.log("message: ", msg);
    this.conversation.next([msg]);
  }
}

export class ChatService {
  private url = "http://localhost:3000";
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  public sendMessage(message) {
    this.socket.emit('customer-message', message);
  }

  public getMessages() {
    return Observable.create(observer => {
      this.socket.on('customer-message', message => {
        observer.next(message);
      });
    });
  }
}

// Routes messages between connected customers, operators and Dialogflow agent
// class MessageRouter {
//   // Load third party dependencies
//   app = require("express")();
//   http = require("http").Server(this.app);
//   io = require("socket.io")(this.http);

//   token = environment.dialogflow.CMRBot; //make call to Loop API
//   client = new ApiAiClient({ accessToken: this.token });
//   projectId = "";
//   customerRoom = this.io.of('/customer')
//   operatorRoom = this.io.of('/operator')
//   customerConnections = {};
//   operatorConnections = {};
// customerStore = new CustomerStore
//   constructor(
//     // dialogflowClient,
//     // projectId,
//     // customerRoom,:
//     // operatorRoom
//   ) {
//     // Dialogflow project id
//     // this.projectId = projectId;
//     // An object that handles customer data persistence
//     // this.customerStore = customerStore;
//     // Socket.io rooms for customers and operators
//     // this.customerRoom
//     // this.operatorRoom = operatorRoom;
//     // All active connections to customers or operators

//   }

//   // Attach event handlers and begin handling connections
//   handleConnections() {
//     this.customerRoom.on(
//       "connection",
//       this._handleCustomerConnection.bind(this)
//     );
//     this.operatorRoom.on(
//       "connection",
//       this._handleOperatorConnection.bind(this)
//     );
//   }

//   // Creates an object that stores a customer connection and has
//   // the ability to delete itself when the customer disconnects
//   _handleCustomerConnection(socket) {
//     const onDisconnect = () => {
//       delete this.customerConnections[socket.id];
//     };
//     this.customerConnections[socket.id] = new CustomerConnectionHandler(
//       socket,
//       this,
//       onDisconnect
//     );
//   }

//   // Same as above, but for operator connections
//   _handleOperatorConnection(socket) {
//     const onDisconnect = () => {
//       delete this.customerConnections[socket.id];
//     };
//     this.operatorConnections[socket.id] = new OperatorConnectionHandler(
//       socket,
//       this,
//       onDisconnect
//     );
//   }

//   // Notifies all operators of a customer's connection changing
//   _sendConnectionStatusToOperator(customerId, disconnected) {
//     console.log("Sending customer id to any operators");
//     const status = disconnected
//       ? AppConstants.EVENT_CUSTOMER_DISCONNECTED
//       : AppConstants.EVENT_CUSTOMER_CONNECTED;
//     this.operatorRoom.emit(status, customerId);
//     // We're using Socket.io for our chat, which provides a synchronous API. However, in case
//     // you want to swich it out for an async call, this method returns a promise.
//     return Promise.resolve();
//   }

//   // Given details of a customer and their utterance, decide what to do.
//   _routeCustomer(utterance, customer, customerId) {
//     // If this is the first time we've seen this customer,
//     // we should trigger the default welcome intent.
//     if (customer.isNew) {
//       return this._sendEventToAgent(customer);
//     }

//     // Since all customer messages should show up in the operator chat,
//     // we now send this utterance to all operators
//     return this._sendUtteranceToOperator(utterance, customer, false)
//       .then(() => {
//         // So all of our logs end up in Dialogflow (for use in training and history),
//         // we'll always send the utterance to the agent - even if the customer is in operator mode.
//         return this._sendUtteranceToAgent(utterance, customer);
//       })
//       .then(responses => {
//         const response = responses[0];
//         // If the customer is in agent mode, we'll forward the agent's response to the customer.
//         // If not, just discard the agent's response.
//         if (customer.mode === CustomerStore.MODE_AGENT) {
//           // If the agent indicated that the customer should be switched to operator
//           // mode, do so
//           if (this._checkOperatorMode(response)) {
//             return this._switchToOperator(customerId, customer, response);
//           }
//           // If not in operator mode, just grab the agent's response
//           const speech = response.queryResult.fulfillmentText;
//           // Send the agent's response to the operator so they see both sides
//           // of the conversation.
//           this._sendUtteranceToOperator(speech, customer, true);
//           // Return the agent's response so it can be sent to the customer down the chain
//           return speech;
//         }
//       });
//   }

//   // Uses the Dialogflow client to send a 'WELCOME' event to the agent, starting the conversation.
//   _sendEventToAgent(customer) {
//     console.log("Sending WELCOME event to agent");
//     return this.client.detectIntent({
//       // Use the customer ID as Dialogflow's session ID
//       session: this.client.sessionPath(this.projectId, customer.id),
//       queryInput: {
//         event: {
//           name: "WELCOME",
//           languageCode: "en"
//         }
//       }
//     });
//   }

//   // Sends an utterance to Dialogflow and returns a promise with API response.
//   _sendUtteranceToAgent(utterance, customer) {
//     console.log("Sending utterance to agent");
//     return this.client.detectIntent({
//       // Use the customer ID as Dialogflow's session ID
//       session: this.client.sessionPath(this.projectId, customer.id),
//       queryInput: {
//         text: {
//           text: utterance,
//           languageCode: "en"
//         }
//       }
//     });
//   }

//   // Send an utterance, or an array of utterances, to the operator channel so that
//   // every operator receives it.
//   _sendUtteranceToOperator(utterance, customer, isAgentResponse) {
//     console.log("Sending utterance to any operators");
//     if (Array.isArray(utterance)) {
//       utterance.forEach(message => {
//         this.operatorRoom.emit(
//           AppConstants.EVENT_CUSTOMER_MESSAGE,
//           this._operatorMessageObject(customer.id, message, isAgentResponse)
//         );
//       });
//     } else {
//       this.operatorRoom.emit(
//         AppConstants.EVENT_CUSTOMER_MESSAGE,
//         this._operatorMessageObject(customer.id, utterance, isAgentResponse)
//       );
//     }
//     // We're using Socket.io for our chat, which provides a synchronous API. However, in case
//     // you want to swich it out for an async call, this method returns a promise.
//     return Promise.resolve();
//   }

//   // If one operator sends a message to a customer, share it with all connected operators
//   _relayOperatorMessage(message) {
//     this.operatorRoom.emit(AppConstants.EVENT_OPERATOR_MESSAGE, message);
//     // We're using Socket.io for our chat, which provides a synchronous API. However, in case
//     // you want to swich it out for an async call, this method returns a promise.
//     return Promise.resolve();
//   }

//   // Factory method to create message objects in the format expected by the operator client
//   _operatorMessageObject(customerId, utterance, isAgentResponse) {
//     return {
//       customerId: customerId,
//       utterance: utterance,
//       isAgentResponse: isAgentResponse || false
//     };
//   }

//   // Examines the context from the Dialogflow response and returns a boolean
//   // indicating whether the agent placed the customer in operator mode
//   _checkOperatorMode(apiResponse) {
//     let contexts = apiResponse.queryResult.outputContexts;
//     let operatorMode = false;
//     for (const context of contexts) {
//       // The context name is returned as a long string, including the project ID, separated
//       // by / characters. To get the context name defined in Dialogflow, we should take the
//       // final portion.
//       const parts = context.name.split("/");
//       const name = parts[parts.length - 1];
//       if (name === AppConstants.CONTEXT_OPERATOR_REQUEST) {
//         operatorMode = true;
//         break;
//       }
//     }
//     return operatorMode;
//   }

//   // Place the customer in operator mode by updating the stored customer data,
//   // and generate an introductory "human" response to send to the user.
//   _switchToOperator(customerId, customer, response) {
//     console.log("Switching customer to operator mode");
//     customer.mode = CustomerStore.MODE_OPERATOR;
//     return this.customerStore
//       .setCustomer(customerId, customer)
//       .then(this._notifyOperatorOfSwitch(customerId)
//       .then(() => {
//         // We return an array of two responses: the last utterance from the Dialogflow agent,
//         // and a mock "human" response introducing the operator.
//         const output = [
//           response.queryResult.fulfillmentText,
//           AppConstants.OPERATOR_GREETING
//         ];
//         // Also send everything to the operator so they can see how the agent responded
//         this._sendUtteranceToOperator(output, customer, true);
//         return output;
//       }));
//   }

//   // Inform the operator channel that a customer has been switched to operator mode
//   _notifyOperatorOfSwitch(customerId) {
//    return this.operatorRoom.emit(AppConstants.EVENT_OPERATOR_REQUESTED, customerId);
//     // We're using Socket.io for our chat, which provides a synchronous API. However, in case
//     // you want to swich it out for an async call, this method returns a promise.
//     // return Promise.resolve();
//   }
// }

// class CustomerStore {
//   customers = {};
//   constructor() {}

//   static get MODE_AGENT() {
//     return "AGENT";
//   }

//   static get MODE_OPERATOR() {
//     return "OPERATOR";
//   }

//   getOrCreateCustomer(customerId) {
//     if (!customerId || customerId.length === 0) {
//       return Promise.reject(new Error("You must specify a customer id"));
//     }

//     const customerData = this.retrieve(customerId);

//     // If there was no customer with this id, create one
//     if (!customerData) {
//       console.log("Storing new customer with id: ", customerId);
//       return this.setCustomer(customerId, {
//         id: customerId,
//         mode: CustomerStore.MODE_AGENT
//       }).then(newCustomer => {
//         // Attach this temporary flag to indicate that the customer is
//         // freshly created.
//         newCustomer.isNew = true;
//         return newCustomer;
//       });
//     }

//     return Promise.resolve(customerData);
//   }

//   setCustomer(customerId, customerData) {
//     console.log("CustomerStore.setCustomer called with ", customerData);
//     if (!customerId || customerId.length === 0 || !customerData) {
//       return Promise.reject(
//         new Error("You must specify a customer id and provide data to store")
//       );
//     }

//     console.log("Updating customer with id: ", customerId);
//     this.store(customerId, customerData);

//     return Promise.resolve(customerData);
//   }

//   // This function could be modified to support persistent database storage
//   store(customerId, data) {
//     // In this case we just simulate serialization to an actual datastore
//     this.customers[customerId] = JSON.stringify(data);
//   }

//   // This function could be modified to support persistent database storage
//   retrieve(customerId) {
//     // In this case we just simulate deserialization from an actual datastore
//     const customerData = this.customers[customerId];
//     return customerData ? JSON.parse(customerData) : null;
//   }
// }

// // Handles the connection to an individual customer
// class CustomerConnectionHandler extends ChatConnectionHandler {
//   constructor (socket, messageRouter, onDisconnect) {
//     super(socket, messageRouter, onDisconnect);
//     // In this sample, we use the socket's unique id as a customer id.
//     this.initt(socket.id);
//     this.attachHandlers();
//   }

//   initt (customerId) {
//     console.log('A customer joined: ', this.socket.id);
//     this.router._sendConnectionStatusToOperator(customerId)
//     // Determine if this is a new or known customer
//       .then(() => this.router.customerStore.getOrCreateCustomer(customerId))
//       .then(customer => {
//         console.log('A customer connected: ', customer);
//         // If new, begin the Dialogflow conversation
//         if (customer.isNew) {
//           return this.router._sendEventToAgent(customer)
//             .then(responses => {
//               const response = responses[0];
//               this._respondToCustomer(response.queryResult.fulfillmentText);
//             });
//         }
//         // If known, do nothing - they just reconnected after a network interruption
//       })
//       .catch(error => {
//         // Log this unspecified error to the console and
//         // inform the customer there has been a problem
//         console.log('Error after customer connection: ', error);
//         this._sendErrorToCustomer(error);
//       });
//   }

//   attachHandlers () {
//     this.socket.on(AppConstants.EVENT_CUSTOMER_MESSAGE, (message) => {
//       console.log('Received customer message: ', message);
//       this._gotCustomerInput(message);
//     });
//     this.socket.on(AppConstants.EVENT_DISCONNECT, () => {
//       console.log('Customer disconnected');
//       this.router._sendConnectionStatusToOperator(this.socket.id, true);
//       this.onDisconnect();
//     });
//   }

//   // Called on receipt of input from the customer
//   _gotCustomerInput (utterance) {
//     // Look up this customer
//     this.router.customerStore
//       .getOrCreateCustomer(this.socket.id)
//       .then(customer => {
//         // Tell the router to perform any next steps
//         return this.router._routeCustomer(utterance, customer, this.socket.id);
//       })
//       .then(response => {
//         // Send any response back to the customer
//         if (response) {
//           return this._respondToCustomer(response);
//         }
//       })
//       .catch(error => {
//         // Log this unspecified error to the console and
//         // inform the customer there has been a problem
//         console.log('Error after customer input: ', error);
//         this._sendErrorToCustomer(error);
//       });
//   }

//   // Send a message or an array of messages to the customer
//   _respondToCustomer (response) {
//     console.log('Sending response to customer:', response);
//     if (Array.isArray(response)) {
//       response.forEach(message => {
//         this.socket.emit(AppConstants.EVENT_CUSTOMER_MESSAGE, message);
//       });
//       return;
//     }
//     this.socket.emit(AppConstants.EVENT_CUSTOMER_MESSAGE, response);
//     // We're using Socket.io for our chat, which provides a synchronous API. However, in case
//     // you want to swich it out for an async call, this method returns a promise.
//     return Promise.resolve();
//   }

//   _sendErrorToCustomer (error) {
//     // Immediately notifies customer of error
//     console.log('Sending error to customer');
//     this.socket.emit(AppConstants.EVENT_SYSTEM_ERROR, {
//       type: 'Error',
//       message: 'There was a problem.'
//     });
//   }
// }

// // Copyright 2017, Google, Inc.
// // Licensed under the Apache License, Version 2.0 (the 'License');
// // you may not use this file except in compliance with the License.
// // You may obtain a copy of the License at
// //
// //    http://www.apache.org/licenses/LICENSE-2.0
// //
// // Unless required by applicable law or agreed to in writing, software
// // distributed under the License is distributed on an 'AS IS' BASIS,
// // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// // See the License for the specific language governing permissions and
// // limitations under the License.

// // Custom error type for a problem relating to the customer's mode
// class CustomerModeError extends Error {
//   constructor (message) {
//     super(message);
//     this.name = this.constructor.name;
//   }
// }

// // Handles the connection to an individual operator
// class OperatorConnectionHandler extends ChatConnectionHandler {
//   constructor (socket, messageRouter, onDisconnect) {
//     super(socket, messageRouter, onDisconnect);
//     this.initt(socket.id);
//     this.attachHandlers();
//   }

//   initt (operatorId) {
//     console.log('An operator joined: ', this.socket.id);
//   }

//   attachHandlers () {
//     this.socket.on(AppConstants.EVENT_OPERATOR_MESSAGE, (message) => {
//       console.log('Received operator message:', message);
//       this._gotOperatorInput(message);
//     });
//     this.socket.on(AppConstants.EVENT_DISCONNECT, () => {
//       console.log('operator disconnected');
//       this.onDisconnect();
//     });
//   }

//   // Called on receipt of input from the operator
//   _gotOperatorInput (message) {
//     // Operator messages take the form of an object with customerId and utterance properties
//     const { customerId, utterance } = message;
//     console.log('Got operator input: ', message);
//     // Look up the customer referenced in the operator's message
//     this.router.customerStore
//       .getOrCreateCustomer(customerId)
//       .then(customer => {
//         // Check if we're in agent or human mode
//         // If in agent mode, ignore the input
//         console.log('Got customer: ', JSON.stringify(customer));
//         if (customer.mode === CustomerStore.MODE_AGENT) {
//           return Promise.reject(
//             new CustomerModeError('Cannot respond to customer until they have been escalated.')
//           );
//         }
//         // Otherwise, relay it to all operators
//         return this.router._relayOperatorMessage(message)
//           // And send it to the appropriate customer
//           .then(() => {
//             const customerConnection = this.router.customerConnections[customerId];
//             return customerConnection._respondToCustomer(utterance);
//           });
//       })
//       .catch(error => {
//         console.log('Error handling operator input: ', error);
//         return this._sendErrorToOperator(error);
//       });
//   }

//   _sendErrorToOperator (error) {
//     console.log('Sending error to operator');
//     this.socket.emit(AppConstants.EVENT_SYSTEM_ERROR, {
//       type: error.name,
//       message: error.message
//     });
//   }
// }
