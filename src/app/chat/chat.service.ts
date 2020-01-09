import {Injectable} from '@angular/core';
import {ApiAiClient} from 'api-ai-javascript/es6/ApiAiClient';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import * as io from 'socket.io-client';

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
  private url = 'http://localhost:3000';
  private readonly socket;

  constructor() {
    this.socket = io(this.url);

    this.socket.on('customer connected', info => {
      console.log(info);
    });
  }

  public sendMessage(message, sender) {
    this.socket.emit(sender, message);
  }

  public getSocket() {
    return this.socket;
  }

  public getCustomerMessages() {
    return Observable.create(observer => {
      this.socket.on('customer-message', message => {
        observer.next(message);
      });
    });
  }

  public getOperatorMessages() {
    return Observable.create(observer => {
      this.socket.on('operator-message', message => {
        observer.next(message);
      });
    });
  }

}
