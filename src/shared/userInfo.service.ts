import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IUserObj } from '../pages/login/login.model';

@Injectable()
export class UserInfoService {
   private userObj: any;

   userInfoChange: Subject<any> = new Subject<any>();

   constructor(){
       this.userInfoChange.subscribe((obj)=> {
              this.userObj = obj;
       });
   }

   setUserInfo(obj){
       this.userInfoChange.next(obj);
   }

   clearUserInfo(){
       var obj={
           uid: null,
           name: null,
           email: null,
           created_date: null,
           update_date: null
       }
    this.userInfoChange.next(obj);
   }

   getUserInfo(){
       return this.userObj;
   }
}
