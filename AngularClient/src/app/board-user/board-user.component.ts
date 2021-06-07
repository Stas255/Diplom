import { Component, OnInit } from '@angular/core';
import { Password } from '../model/Password';
import { UserService } from '../_services/user.service';
import { FormBuilder } from '@angular/forms';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {

  faCopyIcon = faCopy;
  content: string = '';
  passwords: Password[] = [];
  IsCreate: boolean = false;
  IsGetPassword: boolean = false;
  IsUpdate: boolean = false;
  IsResetPassword: boolean = false;
  password: Password = new Password('', '','','','');
  uniqPassword: string = '';
  isCopied = false; 
  newPassword: Password = new Password('', '','','',''); 

  constructor(private formBuilder: FormBuilder, private userService: UserService) {

  }

  ngOnInit(): void {
    this.GetAllPasswords();
  }

  GetAllPasswords(): void {
    this.userService.getAllPaswords().subscribe(
      data => {
        if (data.length == 0) {
          this.content = "У вас немає паролів";
        } else {
          this.passwords = data;
        }
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  GetPassword(id: string): void {
    this.CanselForm();
    this.IsGetPassword = !this.IsGetPassword;
    this.newPassword = Object.assign({}, this.passwords.find(x => x.id == id)!);
  }

  copied(event) {
    this.isCopied = event.isSuccess;
  }

  Update(id: string): void {
    this.CanselForm();
    this.IsUpdate = !this.IsUpdate;
    this.password = this.passwords.find(x => x.id == id)!;
    this.newPassword = Object.assign({}, this.password);

  }

  AddPassword(): void {
    this.CanselForm();
    this.IsCreate = !this.IsCreate;
  }

  CanselForm(): void {
    this.IsUpdate = false;
    this.IsCreate = false;
    this.isCopied = false;
    this.IsGetPassword = false;
    this.IsResetPassword = false;
    this.password = new Password('', '','','','');
    this.newPassword = new Password('', '','','','');
    this.uniqPassword = '';
    this.content = '';
  }

  onSubmit() {
    if (this.IsCreate) {
      this.userService.setNewPassword(this.newPassword).subscribe(
        result => {
          this.GetAllPasswords();
          this.uniqPassword = result;

        }, err => {
          this.content = JSON.parse(err.error).message;
        }
      );
    }else if(this.IsGetPassword){
      this.userService.getPassword(this.newPassword).subscribe(
        result => {
          this.uniqPassword = result;
        }, err => {
          this.content = JSON.parse(err.error).message;
        }
      );
    }else if(this.IsUpdate){
      this.userService.resetPassword(this.newPassword, this.IsResetPassword).subscribe(
        result => {
          if(result == "changed"){
            this.content  = 'Changed';
          }else{
            this.uniqPassword = result;
          }
          this.GetAllPasswords();
        }, err => {
          this.content = JSON.parse(err.error).message;
        }
      );
    }
  }
}
