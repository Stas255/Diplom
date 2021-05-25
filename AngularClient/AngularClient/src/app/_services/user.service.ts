import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Password } from '../model/Password';

const API_URL = 'http://localhost:8000/api/';
const API_URL_USER = 'http://localhost:8000/api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }

  getAllPaswords(): Observable<Password[]> {
    return this.http.post<Password[]>(API_URL_USER + 'getpasswords', { responseType: 'json' });
  }

  setNewPassword(password: Password): Observable<string> {
    return this.http.post(API_URL_USER + 'savepassword', {
      name: password.namePassword,
      password: password.newPassword
    }, { responseType: 'text' });
  }

  getPassword(password: Password): Observable<string> {
    return this.http.post(API_URL_USER + 'getpassword', {
      passwordId: password.id,
      password: password.oldPassword
    }, { responseType: 'text' });
  }

  resetPassword(password: Password, isResetPassword: boolean): Observable<string> {
    var body = {}
    if (isResetPassword) {
      body = {
        passwordId: password.id,
        passwordName: password.namePassword,
        password: password.oldPassword,
        passwordNew: password.newPassword
      };
    } else {
      body = {
        passwordId: password.id,
        passwordName: password.namePassword,
      };
    }
    return this.http.post(API_URL_USER + 'resetpassword',
      body,
      { responseType: 'text' });
  }
}