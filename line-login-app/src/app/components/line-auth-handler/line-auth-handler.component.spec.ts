import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineAuthHandlerComponent } from './line-auth-handler.component';

describe('LineAuthHandlerComponent', () => {
  let component: LineAuthHandlerComponent;
  let fixture: ComponentFixture<LineAuthHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineAuthHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineAuthHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
