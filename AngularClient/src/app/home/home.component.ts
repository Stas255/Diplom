import { Component, OnInit } from '@angular/core';
import { Password } from '../model/Password';
import { UserService } from '../_services/user.service';

declare function Encrypt(params: string): any;
declare function zxcvbn(password: string): any;
declare function toWords(password: string): any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  content: string = '';
  password: Password = new Password('', '', '', '', '');
  uniqPassword: string = '';
  aboutPassword: string = '';
  errorMessage = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.userService.getUnicPassword(this.password.newPassword).subscribe(
      data => {
        data = JSON.parse(data);
        this.uniqPassword = data.uniqPassword;
        this.aboutPassword = data.aboutPassword;
      },
      err => {
        this.errorMessage = "Виникла помилка під час підключення до клієнтського сервера";
      }
    );

    /*this.uniqPassword = Encrypt(this.password.newPassword);
    var test = zxcvbn(this.uniqPassword);
    this.aboutPassword = toWords(test.crack_time);*/
  }
}