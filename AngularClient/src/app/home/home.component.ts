import { Component, OnInit } from '@angular/core';
import { Password } from '../model/Password';
import { UserService } from '../_services/user.service';

declare function Encrypt(params:string):any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  content: string = '';
  password: Password = new Password('', '','','','');
  unicPassword: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.unicPassword = Encrypt(this.password.newPassword);
  }
}