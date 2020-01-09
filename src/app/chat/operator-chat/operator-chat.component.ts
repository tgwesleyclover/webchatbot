import {Component, OnInit} from '@angular/core';
import {ChatService} from '../chat.service';

@Component({
  selector: 'operator-chat',
  templateUrl: './operator-chat.component.html',
  styleUrls: ['./operator-chat.component.scss'],
  providers: [ChatService]
})
export class OperatorChatComponent implements OnInit {
  messages: string[] = [];
  formValue: string;

  // UI elements for all the customers we currently aware of
  connectedCustomers = {};
  // Pointer to the currently open tab
  currentTab;


  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService
      .getOperatorMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });

    /*    this.socket.on('customer connected', createNewCustomerTab);
        socket.on('customer message', receivedCustomerMessage);
        socket.on('operator requested', notifyOperatorRequest);
        socket.on('operator message', receivedOperatorMessage);
        socket.on('customer disconnected', notifyCustomerDisconnected);
        socket.on('system error', notifySystemError);*/

    this.chatService.getSocket().on('customer connected', info => {
      console.log('info', info);
    });
  }

  sendMessage() {
    // this.chat.converse(this.formValue);
    // console.log(this.formValue);
    this.chatService.sendMessage(this.formValue, 'operator-message');
    this.messages.push(this.formValue);
    this.formValue = '';
  }

}
