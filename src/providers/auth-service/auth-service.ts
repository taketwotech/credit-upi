import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/map';

export class User {
  name: string;
  email: string;
 
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  baseUrl: string = "http://localhost:8000";
  currentUser: User;

  constructor(public http: HttpClient) {
    console.log('Hello AuthServiceProvider Provider');
  }

 
  public login(credentials): Observable<any> {
    return this.http.post( this.baseUrl + '/rest-auth/login/', credentials).catch((err) => { 
      return Observable.throw(err)
    });
  }
 
  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
