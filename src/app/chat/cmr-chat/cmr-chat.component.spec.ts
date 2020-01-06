import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmrChatComponent } from './cmr-chat.component';

describe('CmrChatComponent', () => {
  let component: CmrChatComponent;
  let fixture: ComponentFixture<CmrChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmrChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmrChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
