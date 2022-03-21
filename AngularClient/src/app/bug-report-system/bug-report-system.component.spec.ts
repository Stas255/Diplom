import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugReportSystemComponent } from './bug-report-system.component';

describe('BugReportSystemComponent', () => {
  let component: BugReportSystemComponent;
  let fixture: ComponentFixture<BugReportSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BugReportSystemComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BugReportSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
