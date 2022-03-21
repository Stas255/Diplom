import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '../model/UserMessage';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'bug-report-users',
  templateUrl: './bug-report-users.component.html',
  styleUrls: ['./bug-report-users.component.css']
})
export class BugReportUsersComponent implements OnInit {

  content: string ='Виберіть повідомлення';
  messages: Message[] = [];
  message: Message = new Message('','','','');

  constructor(private userService: UserService, private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    const user = JSON.parse(this.tokenStorageService.getUser());
    let roles = user?.roles;
    if(!roles || !roles.includes('ROLE_ADMIN')){
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }else{
      this.getUsersMessage();
    }
  }

  getUsersMessage(){
    this.userService.getUsersMessage().subscribe(
      data => {
        this.messages = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  selectMessage(id:string): void{
    this.message = this.messages.find(x => x.id == id)!;
    this.content = this.message.description;
  }

  deleteMessage(id:string): void{
    this.userService.deleteUsersMessage(id).subscribe(
      data => {
        this.content = data;
        this.getUsersMessage();
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

}