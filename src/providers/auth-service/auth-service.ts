import { HttpClient, HttpParams } from '@angular/common/http';
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
  // baseUrl: string = "http://192.241.134.129:8000";
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

  // Credit UPI services will be written below

  public getUser(url) {
    return this.http.get(url).map(response => response).catch((err) => { 
      return Observable.throw(err)
    });
  }

  public getUpiList(username) {
    return this.http.get(this.baseUrl + '/upi/' + username).map(response => response).catch((err) => { 
      return Observable.throw(err)
    });
  }

  public validateUpi(vpa) {
    let params = new HttpParams().set("type", "va")
    return this.http.get(this.baseUrl + '/upi/' + vpa, {params: params}).map(response => response).catch((err) => { 
      return Observable.throw(err)
    });
  }

  public createUpi(object) {
    return this.http.post(this.baseUrl + '/upi/', object).map(response => response).catch((err) => { 
      return Observable.throw(err)
    });
  }

  public getCreditUpi(username) {
    return this.http.get( this.baseUrl + '/credit/' + username).catch((err) => { 
      return Observable.throw(err)
    });
  }

  public requestCredit(object) {
    return this.http.post(this.baseUrl + '/credit/', object).map(response => response).catch((err) => { 
      return Observable.throw(err)
    });
  }

  public updateCreditUpi(id, object) {
    return this.http.put(this.baseUrl + '/credit/' + id + '/', object).map(response => response).catch((err) => { 
      return Observable.throw(err)
    });
  }
}
