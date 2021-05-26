import { Component, OnInit } from '@angular/core';
import { Message } from '../model/Message';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {

  content: string ='Select message';
  messages: Message[] = [];
  message: Message = new Message('','','','');

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAdminMessage().subscribe(
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

}