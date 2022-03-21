import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '../model/UserMessage';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  message:Message = new Message('','','','');

  constructor(private tokenStorageService: TokenStorageService, private router: Router,  private userService: UserService) { }

  ngOnInit(): void {
    const user = JSON.parse(this.tokenStorageService.getUser());
    let roles = user.roles;
    if(!roles.includes('ROLE_USER')){
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }
  }
  onSubmit() {
    this.userService.sendMessage(this.message).subscribe(
      data => {
        window.alert(data);
        this.CanselForm();
      });
  }
  CanselForm(){
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}
