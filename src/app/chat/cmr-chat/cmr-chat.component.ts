import {Component, OnInit} from '@angular/core';
import {ChatService, CMRChatService, Message} from '../chat.service';

@Component({
  selector: 'cmr-chat',
  templateUrl: './cmr-chat.component.html',
  styleUrls: ['./cmr-chat.component.scss'],
  providers: [CMRChatService, ChatService]
})
export class CmrChatComponent implements OnInit {
  // messages: Observable<Message[]>;
  formValue: string;
  messages: Message[] = [];


  constructor(public chat: CMRChatService, private chatService: ChatService) {
  }

  ngOnInit() {
    /*    // appends to array after each new message is added to feedSource
        this.messages = this.chatService.getCustomerMessages()
          .pipe(scan((acc, val) => {
            console.log(acc, val);
            return acc.concat(val);
          })
        );*/

    this.chatService
      .getCustomerMessages()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });
  }

  sendMessage() {
    // this.chat.converse(this.formValue);
    this.chatService.sendMessage(this.formValue, 'customer-message');
    const message: Message = {content: this.formValue, sentBy: 'customer'};
    this.messages.push(message);
    this.formValue = '';
  }

}
