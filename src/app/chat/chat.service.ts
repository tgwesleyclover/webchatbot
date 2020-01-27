import {Injectable} from '@angular/core';
import {ApiAiClient} from 'api-ai-javascript/es6/ApiAiClient';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import * as io from 'socket.io-client';
import {HttpClient} from '@angular/common/http';
import {google} from 'dialogflow/protos/protos';
import Intent = google.cloud.dialogflow.v2.Intent;

export class Message {
  constructor(public content: string, public sentBy: string) {
  }
}

@Injectable()
export class CMRChatService {
  readonly token = environment.dialogflow.CMRBot; // make call to Loop API
  readonly client = new ApiAiClient({accessToken: this.token});
  conversation = new BehaviorSubject<Message[]>([]);

  constructor() {
  }

  // Sends and receives messages via DialogFlow
  async converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    const res = await this.client.textRequest(msg);
    const speech = res.result.fulfillment.speech;
    const botMessage = new Message(speech, 'bot');
    this.update(botMessage);
  }

  // Adds message to source
  update(msg: Message) {
    console.log('message: ', msg);
    this.conversation.next([msg]);
  }
}

@Injectable()
export class BHChatService {
  readonly token = environment.dialogflow.BHBot; // make call to Loop API
  readonly client = new ApiAiClient({accessToken: this.token});
  conversation = new BehaviorSubject<Message[]>([]);

  constructor() {
  }

  // Sends and receives messages via DialogFlow
  async converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    const res = await this.client.textRequest(msg);
    const speech = res.result.fulfillment.speech;
    const botMessage = new Message(speech, 'bot');
    this.update(botMessage);
  }

  // Adds message to source
  update(msg: Message) {
    console.log('message: ', msg);
    this.conversation.next([msg]);
  }
}

/** Handles the communication between server and clients*/
@Injectable()
export class ChatService {
  public readonly socket;
  private url = 'http://localhost:3000'; // connect to the socket server which is handling the requests

  constructor() {
    this.socket = io(this.url);
  }

  /** Send a message
   * @param message the text to send
   * @param sender who is sending the message */
  public sendMessage(message: string, sender: string) {
    this.socket.emit(sender, message);
  }

  /** get's all the customer messages stored on the server and returns an observable array of message objects*/
  public getCustomerMessages(): any {
    return of(observer => {
      this.socket.on('customer-message', message => {
        const messageObject: Message = {content: message, sentBy: 'operator'};
        observer.next(messageObject);
      });
    });
  }

  /** get's all the customer messages stored on the server and returns an observable array of message objects*/
  public getOperatorMessages() {
    return of(observer => {
      this.socket.on('operator-message', message => {
        const messageObject: Message = {content: message, sentBy: 'customer'};
        observer.next(messageObject);
      });
    });
  }
}

/** Class for interacting with dialogflow on admin level. */
@Injectable()
export class DialogflowAdmin {
  baseUrl = 'https://dialogflow.googleapis.com/v2'; // the url used to interact with dialogflow

  constructor(private http: HttpClient) {
  }

  /** Method to create a new agent intent programmatically
   * @param projectId String - the agent on which the intent will be assigned
   * @param intent Intent - the intent to be created
   * @return observable of newly created intent */
  createNewAgentIntent(projectId: string, intent: Intent): Observable<Intent> {

    const url = `${this.baseUrl}/projects/${projectId}/agent/intents`; // the url for creating new intents

    // request headers configuration for setting bearer toke ToDo: replace with full authentication
    const config = {
      headers: {
        'Authorization': 'Bearer ' + environment.dialogflow.apiKey,
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    return this.http.post<Intent>(url, intent, config);
  }

  /** Get an agents intent
   * @param projectId String - the bot that is in question
   * @return observable of an intent
   * */
  getAgentIntent(projectId: string): Observable<Intent> {
    const url = `${this.baseUrl}/projects/${projectId}/agent/intents`;

    const config = {
      headers: {
        'Authorization': 'Bearer ' + environment.dialogflow.apiKey,
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    return this.http.get<Intent>(url, config);
  }
}

