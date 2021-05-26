import { Component, OnInit } from '@angular/core';
import { BlockedUser } from '../model/BlockedUser';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.css']
})
export class BlockedComponent implements OnInit {

  content: string = '';
  blokedUsers: BlockedUser[] =[];
  blokedUser: BlockedUser = new BlockedUser('','','','')
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.GetBlokedUsers();
  }

  GetBlokedUsers(): void{
    this.userService.getAllBlokedUsers().subscribe(
      data => {
        if (data.length == 0) {
          this.content = "You dont have bloked Users";
        } else {
          this.blokedUsers = data;
        }
      },
      err => {
        JSON.parse(err.error).message;
      });
  }

  CancelBlock(idUser: string): void{
    this.userService.cancelBlock(idUser).subscribe(
      data => {
        window.alert(data);
        this.GetBlokedUsers();
      },
      err => {
        JSON.parse(err.error).message;
      });
  }

  GetDescription(id: string): void{
    let user = this.blokedUsers.find(x => x.id == id)!;
    this.content = user.description;
  }
}
