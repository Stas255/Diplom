import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Password } from '../model/Password';
import { TokenStorageService } from '../_services/token-storage.service';
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
  myAngularxQrCode: string = this.getRandomString(50);
  isLogined = false;
  id: any;

  constructor(private tokenStorage: TokenStorageService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.createQR(this.getRandomString(50));
      this.id = setInterval(() => {
        this.createQR(this.getRandomString(50));
      }, 5 * 60 * 1000);
    } else {
      this.isLogined = true;
    }
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

  createQR(id: string) {
    this.myAngularxQrCode = id;
    this.userService.setResponse(this.myAngularxQrCode).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      err => {
        this.errorMessage = "Виникла помилка під час підключення до клієнтського сервера";
      }
    );
  }

  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
}