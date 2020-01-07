import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CMRChatService, Message, ChatService } from "../chat.service";
import { scan } from "rxjs/operators";

@Component({
  selector: "cmr-chat",
  templateUrl: "./cmr-chat.component.html",
  styleUrls: ["./cmr-chat.component.scss"],
  providers: [CMRChatService, ChatService]
})
export class CmrChatComponent implements OnInit {
  messages: Observable<Message[]>;
  formValue: string;
  messagess: string[] = [];


  constructor(public chat: CMRChatService, private chatService: ChatService) {}

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.pipe(
      scan((acc, val) => {
        console.log(acc, val);
        return acc.concat(val);
      })
    );

    this.chatService
    .getMessages()
    .subscribe((message: string) => {
      this.messagess.push(message);
    });
  }

  sendMessage() {
    // this.chat.converse(this.formValue);
    this.chatService.sendMessage(this.formValue);
    this.formValue = "";
  }

  
}
