import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  aboutProjectOnPC = {
    nameProject: "Safe Password Storage",
    report: "Bug reports",
    blocked: "Blocked users"
  };
  aboutProjectOnMob = {
    nameProject: "SPS",
    report: "B_reports",
    blocked: "B_users"
  };
  isCollapsed = true;  
  aboutProject = this.aboutProjectOnPC;
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  username: string = '';

  constructor(private tokenStorageService: TokenStorageService, private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = JSON.parse(this.tokenStorageService.getUser());
      this.roles = user.roles;

      this.showAdminBoard = this.roles?.includes('ROLE_ADMIN');
      this.showUserBoard = this.roles?.includes('ROLE_USER');

      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}