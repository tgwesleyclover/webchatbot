import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BHChatService, Message } from '../chat.service';
import { scan } from 'rxjs/operators';

@Component({
  selector: 'bh-chat',
  templateUrl: './bh-chat.component.html',
  styleUrls: ['./bh-chat.component.scss'],
  providers: [BHChatService]
})
export class BhChatComponent implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;

  constructor(public chat: BHChatService) {}

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    // this.chat.token = environment.dialogflow.BHBot;
    this.messages = this.chat.conversation
      .pipe(scan((acc, val) => {
        console.log(acc,val);
       return acc.concat(val)
      }));
  }

  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = "";
  }
}
