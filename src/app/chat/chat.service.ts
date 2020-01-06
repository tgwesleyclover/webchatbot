import { Injectable } from "@angular/core";

import { ApiAiClient } from "api-ai-javascript/es6/ApiAiClient";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";

export class Message {
  constructor(public content: string, public sentBy: string) {}
}

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
