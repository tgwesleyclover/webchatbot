import {Component, OnInit} from '@angular/core';
import {ChatService, Message} from '../chat.service';

@Component({
  selector: 'cmr-chat',
  templateUrl: './cmr-chat.component.html',
  styleUrls: ['./cmr-chat.component.scss'],
  providers: [ChatService]
})
export class CmrChatComponent implements OnInit {
  messageToSend: string; // message from customer/guest to bot or operator
  messages: Message[] = []; // messages shown in the UI

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    /** Observable for getting the messages directed to the customer from either bot or operator */
    this.chatService.getCustomerMessages().subscribe((message: Message) => {
      this.messages.push(message); // add the message to the UI array
    });
  }

  /** Method to handle sending messages*/
  sendMessage() {
    // call the sendMessage method to send messages to the bot/operator
    this.chatService.sendMessage(this.messageToSend, 'customer-message');

    // add the sent message to the messages array to show in the UI
    this.messages.push({content: this.messageToSend, sentBy: 'customer'});

    this.messageToSend = ''; // clear the UI field
  }
}
