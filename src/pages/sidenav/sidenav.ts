import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, LoginPage } from '../pages';
import {HomePageService} from '../home/home.service';
import {UserInfoService} from '../../shared/shared';
import { IUserObj } from '../login/login.model';

@Component({
  selector: 'page-sidenav',
  templateUrl: 'sidenav.html',
})
export class SidenavPage {

  private rootPage;
  private loginPage = LoginPage;
  userObj: IUserObj = new IUserObj();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public homePageService:HomePageService,
    public userInfoService: UserInfoService
  ) {
    this.rootPage = HomePage;
    this.userInfoService.userInfoChange.subscribe(
      userinfo => {
        this.userObj = userinfo;
      });
  }

  openPage(p) {
    this.rootPage = p;
  }

  changePage(page) {
    this.homePageService.setPage(page);
  }
  
  logout(){
    this.userObj = {
      name: "",
      email : "",
      password : ""
    };
    this.userInfoService.setUserInfo(this.userObj);
  }
}
