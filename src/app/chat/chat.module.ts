import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmrChatComponent } from './cmr-chat/cmr-chat.component';
import { BhChatComponent } from './bh-chat/bh-chat.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    CmrChatComponent,
    BhChatComponent
  ],
  exports: [ CmrChatComponent, BhChatComponent ]
})
export class ChatModule { }
