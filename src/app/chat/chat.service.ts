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

@Injectable()
export class ChatService {
  public readonly socket;
  // private url = 'http://localhost:5000/test-uvmimj/us-central1/app';
  private url = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.url);

    this.socket.on('customer connected', info => {
      console.log(info);
    });
  }

  public sendMessage(message, sender) {
    this.socket.emit(sender, message);
  }

  public getCustomerMessages(): any {
    return Observable.create(observer => {
      this.socket.on('customer-message', message => {
        const messageObject: Message = {content: message, sentBy: 'operator'};
        observer.next(messageObject);
      });
    });
  }

  public getOperatorMessages() {
    return of(observer => {
      this.socket.on('operator-message', message => {
        const messageObject: Message = {content: message, sentBy: 'customer'};
        observer.next(messageObject);
      });
    });
  }
}

@Injectable()
export class DialogflowAdmin {
  baseUrl = 'https://dialogflow.googleapis.com/v2';

  constructor(private http: HttpClient) {
  }

  createNewAgentIntent(projectId: string, intent: Intent) {
    const url = `${this.baseUrl}/projects/${projectId}/agent/intents`;

    const config = {
      headers: {
        'Authorization': 'Bearer ' + environment.dialogflow.apiKey,
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    this.http.post(url, intent, config).subscribe((test) => {
      console.log(test);
    }, error => {
      console.log(error);
    });

  }

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

