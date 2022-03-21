import { Component, OnInit } from '@angular/core';
import { Profile } from '../model/Profile';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Profile;
  isRequest = false;
  content = '';

  constructor(private userService: UserService, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.user = JSON.parse(this.token.getUser());
  }

  onSubmit(){
    this.content = "";
    this.userService.updateUser(this.user).subscribe(
      result => {
        this.content = result;
      }, err => {
        this.content = err.error;
      }
    );
  }
  
}