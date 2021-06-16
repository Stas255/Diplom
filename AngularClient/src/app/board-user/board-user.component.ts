import { Component, OnInit } from '@angular/core';
import { Password } from '../model/Password';
import { UserService } from '../_services/user.service';
import { FormBuilder } from '@angular/forms';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

declare function zxcvbn(password: string): any;
declare function toWords(password: string): any;

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
  password: Password = new Password('', '', '', '', '');
  uniqPassword: string = '';
  isCopied = false;
  isRequest = false;
  isNewName = true;
  newPassword: Password = new Password('', '', '', '', '');
  aboutPassword = '';

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
        this.content = "Виникла помилка під час підключення до клієнтського сервера";
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
    this.isRequest = false;
    this.IsGetPassword = false;
    this.IsResetPassword = false;
    this.password = new Password('', '', '', '', '');
    this.newPassword = new Password('', '', '', '', '');
    this.uniqPassword = '';
    this.content = '';
    this.aboutPassword ='';
  }

  onSubmit() {
    this.isRequest = true;
    this.content = '';
    if (this.IsCreate) {
      if(this.checkName()){
        this.isRequest = false;
        return;
      }
      this.userService.setNewPassword(this.newPassword).subscribe(
        result => {
          this.GetAllPasswords();
          this.uniqPassword = result;
          this.AboutPassword();
          this.isRequest = false;
        }, err => {
          this.checkError(err);
        }
      );
    } else if (this.IsGetPassword) {
      this.userService.getPassword(this.newPassword).subscribe(
        result => {
          this.uniqPassword = result;
          this.isRequest = false;
        }, err => {
          this.checkError(err);
        }
      );
    } else if (this.IsUpdate) {
      this.userService.resetPassword(this.newPassword, this.IsResetPassword).subscribe(
        result => {
          if (result == "changed") {
            this.content = 'Змінено';
            this.isRequest = false;
          } else {
            this.uniqPassword = result;
            this.AboutPassword();
            this.isRequest = false;
          }
          this.GetAllPasswords();
        }, err => {
          this.checkError(err);
        }
      );
    }
  }

  checkName(){
    for(var i =0; i < this.passwords.length;i++){
      if(this.passwords[i].namePassword == this.newPassword.namePassword){
        alert('Для зручності вкажіть інше ім\'я пароля');
        this.newPassword.namePassword = '';
        return true;
      }
    }
    return false;
  }

  AboutPassword(){
    var test = zxcvbn(this.uniqPassword);
    this.aboutPassword = toWords(test.crack_time);
  }

  checkError(err){
    this.isRequest = false;
    if(err.message == "Timeout has occurred"){
      this.content = "Час дії запиту вичерпаний. Оновіть сторінку. та спробуйте";
    }else{
      this.content = JSON.parse(err.error).message;
    }

  }
}
