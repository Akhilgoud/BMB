import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IUserObj } from '../pages/login/login.model';

@Injectable()
export class UserInfoService {
   private userObj: IUserObj = new IUserObj();

   userInfoChange: Subject<any> = new Subject<any>();

   constructor(){
       this.userInfoChange.subscribe((obj)=> {
              this.userObj = obj;
       });
   }

   setUserInfo(obj){
       this.userInfoChange.next(obj);
   }
}
