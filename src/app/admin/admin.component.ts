import {Component, OnInit} from '@angular/core';
import {DialogflowAdmin} from '../chat/chat.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {google} from 'dialogflow/protos/protos';
import ITrainingPhrase = google.cloud.dialogflow.v2beta1.Intent.ITrainingPhrase;
import IMessage = google.cloud.dialogflow.v2.Intent.IMessage;
import Intent = google.cloud.dialogflow.v2.Intent;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [DialogflowAdmin]
})
export class AdminComponent implements OnInit {
  bots: string[] = ['BH', 'CMR']; // available bots for editing
  intentForm: FormGroup;
  projectId = 'btth-ysrpam';

  trainingPhrases: FormArray; // array of the training phases that are entered by the user
  messageResponses: FormArray; // array of the bot's responses entered by user

  constructor(
    private admin: DialogflowAdmin,
    private formBuilder: FormBuilder
  ) {
    // initialise the form group which we use to create the intent
    this.intentForm = this.formBuilder.group({
      intentName: '',
      trainingPhrases: this.formBuilder.array([this.createTrainingPhase()]),
      messageResponses: this.formBuilder.array([this.createMessageResponse()])
    });

  }

  ngOnInit() {
    // get the agent intents for a selected agent
    this.admin.getAgentIntent(this.projectId).subscribe((value: Intent) => {
      // Todo: show the intents that are available to the user to edit
      console.log(value);
    }, error => console.log(error));
  }

  /** create a new training phase form to the group
   * @return new form group
   */
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

  /** Add a training phase form group to the array */
  addTrainingPhrase(): void {
    this.trainingPhrases = this.intentForm.get('trainingPhrases') as FormArray;
    this.trainingPhrases.push(this.createTrainingPhase()); // add the newly created training phase to the form array
  }

  addMessageResponse(): void {
    this.messageResponses = this.intentForm.get('messageResponses') as FormArray;
    this.messageResponses.push(this.createMessageResponse());
  }

  /** Create a new intent*/
  createNewIntent() {
    // the intent display name as shown in dialogflow
    const intentDisplayName: string = this.intentForm.controls['intentName'].value;

    // get the training phases from the form array and construct the training phase object for each control in the array
    const trainingPhrases: ITrainingPhrase[] =
      this.trainingPhrases.getRawValue().map((value) => {
        return {parts: [{text: value.trainingPhrase}]};
      });

    // construct the response array from the array of message responses
    const messageResponses: IMessage[] = [{
      text: {
        text: this.messageResponses.getRawValue().map((value) => {
          return value.messageResponse;
        })
      }
    }];

    /*     const intentInformation: IIntent = {
          displayName: intentDisplayName,
          trainingPhrases: trainingPhrases,
          messages: messageResponses
        };
    */

    // the intent object to be
    const intent: Intent = Intent.create({
      displayName: intentDisplayName,
      trainingPhrases: trainingPhrases,
      messages: messageResponses
    });

    this.admin.createNewAgentIntent(this.projectId, intent);
  }

}
