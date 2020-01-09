import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CmrChatComponent} from './cmr-chat/cmr-chat.component';
import {BhChatComponent} from './bh-chat/bh-chat.component';
import {OperatorChatComponent} from './operator-chat/operator-chat.component';
import {MatFormFieldModule, MatInputModule} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    CmrChatComponent,
    BhChatComponent,
    OperatorChatComponent
  ],
  exports: [ CmrChatComponent, BhChatComponent ]
})
export class ChatModule { }
