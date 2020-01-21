import {Component, OnInit} from '@angular/core';
import {DialogflowAdmin} from '../chat/chat.service';
import {google} from 'dialogflow/protos/protos';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import Intent = google.cloud.dialogflow.v2.Intent;
import ITrainingPhrase = google.cloud.dialogflow.v2.Intent.ITrainingPhrase;
import IMessage = google.cloud.dialogflow.v2.Intent.IMessage;
import IIntent = google.cloud.dialogflow.v2.IIntent;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [DialogflowAdmin]
})
export class AdminComponent implements OnInit {
  bots: string[] = ['BH', 'CMR'];
  orderForm: FormGroup;
  items: FormArray;

  constructor(
    private admin: DialogflowAdmin,
    private formBuilder: FormBuilder
  ) {
    this.orderForm = this.formBuilder.group({
      customerName: '',
      email: '',
      items: this.formBuilder.array([this.createTrainingPhase()])
    });
  }

  ngOnInit() {

  }

  createTrainingPhase(): FormGroup {
    return this.formBuilder.group({
      name: '',
      description: '',
      price: ''
    });
  }

  addItem(): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createTrainingPhase());
  }

  createNewIntent() {
    const projectId = 'btth-ysrpam';
    const trainingPhrases: ITrainingPhrase[] = [
      {
        parts: [
          {
            text: 'i am testing'
          }
        ]
      }, {
        parts: [
          {
            text: 'This is a test'
          }
        ]
      }
    ];
    const messages: IMessage[] = [
      {
        text: {
          text: [
            'Created Test training Phase',
            'We have created test training phase',
            'training phase test created'
          ]
        }
      }
    ];
    const intentInformation: IIntent = {
      displayName: 'testing',
      trainingPhrases: trainingPhrases,
      messages: messages

    };
    const agent: Intent = Intent.create(intentInformation);

    console.log(agent);
    this.admin.createNewAgentIntent(projectId, agent);
  }

}
