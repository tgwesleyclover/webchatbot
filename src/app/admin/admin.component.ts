import {Component, OnInit} from '@angular/core';
import {DialogflowAdmin} from '../chat/chat.service';
import {google} from 'dialogflow/protos/protos';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [DialogflowAdmin]
})
export class AdminComponent implements OnInit {
  bots: string[] = ['BH', 'CMR'];
  intentForm: FormGroup;
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
    const projectId = 'btth-ysrpam';

    // this.trainingPhrases.getRawValue()
    console.log(this.trainingPhrases.getRawValue());
    // const trainingPhrases: ITrainingPhrase[] = [
    //   {
    //     parts: [
    //       {
    //         text: 'i am testing'
    //       }
    //     ]
    //   }, {
    //     parts: [
    //       {
    //         text: 'This is a test'
    //       }
    //     ]
    //   }
    // ];
    // const messages: IMessage[] = [
    //   {
    //     text: {
    //       text: [
    //         'Created Test training Phase',
    //         'We have created test training phase',
    //         'training phase test created'
    //       ]
    //     }
    //   }
    // ];
    // const intentInformation: IIntent = {
    //   displayName: 'testing',
    //   trainingPhrases: trainingPhrases,
    //   messages: messages
    //
    // };
    // const agent: Intent = Intent.create(intentInformation);

    // console.log(agent);

    // this.admin.createNewAgentIntent(projectId, agent);
  }

}
