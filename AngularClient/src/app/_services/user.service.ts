import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Password } from '../model/Password';
import { Message } from '../model/UserMessage';
import { BlockedUser } from '../model/BlockedUser';
import { Observable } from 'rxjs';
import { timeout} from 'rxjs/operators';
import { Profile } from '../model/Profile';

/*const API_URL = 'http://zheka.tolstonozhenko.com.ua/api/';
const API_URL_USER = 'http://zheka.tolstonozhenko.com.ua/api/user/';*/
const API_URL = 'http://localhost:8000/api/';
const API_URL_USER = 'http://localhost:8000/api/user/';
const C_URL = 'http://localhost:8000/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

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
    }, { responseType: 'text' }).pipe(
      timeout(20000)
    );
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

  getUsersMessage(): Observable<Message[]> {
    return this.http.post<Message[]>(API_URL + 'admin/getUsersMessages', { responseType: 'json' });
  }

  deleteUsersMessage(messageId: string): Observable<string> {
    return this.http.post(API_URL + 'admin/deleteUsersMessages', {
      messageId: messageId
    }, { responseType: 'text' });
  }

  sendMessage(message: Message): Observable<string> {
    return this.http.post(API_URL_USER + 'sendmessage', {
      name: message.name,
      description: message.description
    }, { responseType: 'text' });
  }

  getAllBlokedUsers(): Observable<BlockedUser[]> {
    return this.http.post<BlockedUser[]>(API_URL + 'admin/getAllBlockedUsers', { responseType: 'json' });
  }

  getUserNameById(userid: string): Observable<string> {
    return this.http.post(API_URL + 'admin/getUserNameById', {
      userId: userid
    }, { responseType: 'text' });
  }

  cancelBlock(userid: string): Observable<string> {
    return this.http.post(API_URL + 'admin/cancelBlock', {
      userId: userid
    }, { responseType: 'text' });
  }

  getAllSystemMessages(): Observable<any> {
    return this.http.post(API_URL + 'admin/getAllNamesSystemMessages', {
    }, { responseType: 'json' });
  }

  getDetailsSystemMessages(fileName: string, type): Observable<any> {
    return this.http.post(API_URL + 'admin/getDetailsSystemMessages', {
      fileName: fileName
    }, { responseType: type });
  }

  deleteFile(fileName: string): Observable<string> {
    return this.http.post(API_URL + 'admin/deleteSystemFileMessage', {
      fileName: fileName
    }, { responseType: 'text' }).pipe(
      timeout(2000)
    );
  }

  getInforAboutServers(): Observable<any> {
    return this.http.post(C_URL + 'getInfor', { responseType: 'json' })
    .pipe(
      timeout(2000)
    );
  }

  updateUser(user: Profile) : Observable<string> {
    return this.http.post(API_URL_USER + 'updateUser',{
      email: user.email,
      oldPassword: user.oldPassword,
      newPassword: user.newPassword
    }, { responseType: 'text' })
    .pipe(
      timeout(20000)
    );
  }
}