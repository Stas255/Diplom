import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private token: TokenStorageService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            if ((error.status == 400 && error.error.message == "User not exist") || (error.status == 403 && error.error.message == "No token provided!") || error.status == 401) {
              this.token.signOut();
              this.router.navigate(['/login']).then(() => {
                window.location.reload();
              });
              errorMessage = `Message: ${error.error}`;
            } else if(error.status == 403) {
              this.router.navigate(['/']).then(() => {
                window.location.reload();
              });
              errorMessage = `Message: ${error.error}`;
            }else{
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
            }
          }
          window.alert(errorMessage);
          return throwError(error);
        })
      )
  }
}