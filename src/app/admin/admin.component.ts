import {Component, OnInit} from '@angular/core';
import {DialogflowAdmin} from '../chat/chat.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {google} from 'dialogflow/protos/protos';
import ITrainingPhrase = google.cloud.dialogflow.v2beta1.Intent.ITrainingPhrase;
import IMessage = google.cloud.dialogflow.v2.Intent.IMessage;
import IIntent = google.cloud.dialogflow.v2.IIntent;
import Intent = google.cloud.dialogflow.v2.Intent;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [DialogflowAdmin]
})
export class AdminComponent implements OnInit {
  bots: string[] = ['BH', 'CMR'];
  intentForm: FormGroup;
  projectId = 'btth-ysrpam';

  trainingPhrases: FormArray;
  messageResponses: FormArray;

  constructor(
    private admin: DialogflowAdmin,
    private formBuilder: FormBuilder
  ) {

    this.intentForm = this.formBuilder.group({
      intentName: '',
      trainingPhrases: this.formBuilder.array([this.createTrainingPhase()]),
      messageResponses: this.formBuilder.array([this.createMessageResponse()])
    });

  }

  ngOnInit() {
    this.admin.getAgentIntent(this.projectId).subscribe((value: Intent) => {
      console.log(value);
    }, error => console.log(error));
  }

  createTrainingPhase(): FormGroup {
    return this.formBuilder.group({
      trainingPhrase: ''
    });
  }

  createMessageResponse(): FormGroup {
    return this.formBuilder.group({
      messageResponse: ''
    });
  }

  addTrainingPhrase(): void {
    this.trainingPhrases = this.intentForm.get('trainingPhrases') as FormArray;
    this.trainingPhrases.push(this.createTrainingPhase());
  }

  addMessageResponse(): void {
    this.messageResponses = this.intentForm.get('messageResponses') as FormArray;
    this.messageResponses.push(this.createMessageResponse());
  }

  createNewIntent() {
    const intentDisplayName: string = this.intentForm.controls['intentName'].value;

    const trainingPhrases: ITrainingPhrase[] =
      this.trainingPhrases.getRawValue().map((value) => {
        return {parts: [{text: value.trainingPhrase}]};
      });

    const messageResponses: IMessage[] = [
      {
        text: {
          text: this.messageResponses.getRawValue().map((value) => {
            return value.messageResponse;
          })
        }
      }
    ];

    const intentInformation: IIntent = {
      displayName: intentDisplayName,
      trainingPhrases: trainingPhrases,
      messages: messageResponses
    };

    const intent: Intent = Intent.create(intentInformation);

    this.admin.createNewAgentIntent(this.projectId, intent);
  }

}
