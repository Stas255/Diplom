import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import * as fileSaver from 'file-saver';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bug-report',
  templateUrl: './bug-report-system.component.html',
  styleUrls: ['./bug-report-system.component.css']
})
export class BugReportSystemComponent implements OnInit {

  content: any = 'Select message';
  messages: string[] = [];

  constructor(private userService: UserService , private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    const user = JSON.parse(this.tokenStorageService.getUser());
    let roles = user?.roles;
    if(!roles || !roles.includes('ROLE_ADMIN')){
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }else{
      this.getAllSystemMessages();
    }
  }

  getAllSystemMessages(){
    this.userService.getAllSystemMessages().subscribe(
      data => {
        this.messages = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  selectMessage(fileName: string): void {
    this.userService.getDetailsSystemMessages(fileName, 'json').subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  DownloadFile(fileName: string): void {
    this.userService.getDetailsSystemMessages(fileName, 'blob').subscribe(
      data => {
        fileSaver.saveAs(data, fileName);
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  DeleteFile(fileName: string): void {
    this.userService.deleteFile(fileName).subscribe(
      data => {
        this.content = data;
        this.getAllSystemMessages();
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
}
