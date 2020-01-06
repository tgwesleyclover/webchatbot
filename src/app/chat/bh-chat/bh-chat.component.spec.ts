import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BhChatComponent } from './bh-chat.component';

describe('BhChatComponent', () => {
  let component: BhChatComponent;
  let fixture: ComponentFixture<BhChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BhChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BhChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
