import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugReportUsersComponent } from './bug-report-users.component';

describe('BugReportUsersComponent', () => {
  let component: BugReportUsersComponent;
  let fixture: ComponentFixture<BugReportUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugReportUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BugReportUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
