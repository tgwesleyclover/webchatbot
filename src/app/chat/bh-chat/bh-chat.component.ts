import {Component, OnInit} from '@angular/core';
import {ChatService, Message} from '../chat.service';

@Component({
  selector: 'bh-chat',
  templateUrl: './bh-chat.component.html',
  styleUrls: ['./bh-chat.component.scss'],
  providers: [ChatService]
})
export class BhChatComponent implements OnInit {

  messages: Message[] = [];
  formValue: string;

  constructor(public chatService: ChatService) {
  }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    /** Observable for getting the messages directed to the customer from either bot or operator */
    this.chatService.getCustomerMessages().subscribe((message: Message) => {
      this.messages.push(message); // add the message to the UI array
    });
  }

  sendMessage() {
    // call the sendMessage method to send messages to the bot/operator
    this.chatService.sendMessage(this.formValue, 'customer-message');

    // add the sent message to the messages array to show in the UI
    this.messages.push({content: this.formValue, sentBy: 'customer'});

    this.formValue = ''; // clear the UI field
  }
}
