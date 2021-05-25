import { Component, OnInit } from '@angular/core';
import { Password } from '../model/Password';
import { UserService } from '../_services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {

  content: string = '';
  passwords: Password[] = [];
  IsCreate: boolean = false;
  IsUpdate: boolean = false;
  password: Password = new Password('','','','');

  constructor(private formBuilder: FormBuilder, private userService: UserService) {

   }

  ngOnInit(): void {
    this.userService.getAllPaswords().subscribe(
      data => {
        if(data.length == 0){
          this.content = "You dont have passwords";
        }else{
          this.passwords = data;
        }
        
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  Update(id: string): void {
    this.IsCreate = false;
    this.IsUpdate = true;
    this.password = this.passwords.find(x => x.id == id)!;

  }

  AddPassword(): void {
    this.IsUpdate = false;
    this.IsCreate = true;
    this.password = new Password('','','','');
  }

  onSubmit(){
    console.log(this.password);
  }
}
