import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService, Message } from '../chat.service';
import { scan } from 'rxjs/operators';

@Component({
  selector: 'cmr-chat',
  templateUrl: './cmr-chat.component.html',
  styleUrls: ['./cmr-chat.component.scss']
})
export class CmrChatComponent implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;

  constructor(public chat: ChatService) {}

  ngOnInit() {
    // appends to array after each new message is added to feedSource
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
