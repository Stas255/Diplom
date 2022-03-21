import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BugReportUsersComponent } from './bug-report-users/bug-report-users.component';
import { ReportComponent } from './report/report.component';
import { BlockedComponent } from './blocked/blocked.component';
import { BugReportSystemComponent } from './bug-report-system/bug-report-system.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'bug-report-users', component: BugReportUsersComponent },
  { path: 'report', component: ReportComponent },
  { path: 'blocked', component: BlockedComponent },
  { path: 'bug-report-system', component: BugReportSystemComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }