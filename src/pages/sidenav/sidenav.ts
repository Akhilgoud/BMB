import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, LoginPage, MypostsPage, PostbookPage, BooksinfoPage } from '../pages';
import { HomePageService } from '../home/home.service';
import { UserInfoService } from '../../shared/shared';
import { IUserObj } from '../login/login.model';
import { UserDbProvider } from '../../providers/userdatabase';

@Component({
  selector: 'page-sidenav',
  templateUrl: 'sidenav.html',
})
export class SidenavPage {

  private rootPage;
  private loginPage = LoginPage;
  private mypostsPage = MypostsPage;
  private postBookPage = PostbookPage;
  private booksinfoPage= BooksinfoPage;
  userObj: any = {};
  err: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public homePageService: HomePageService,
    public userInfoService: UserInfoService,
    private database: UserDbProvider
  ) {
    this.rootPage = HomePage;
    this.userInfoService.userInfoChange.subscribe(
      userinfo => {
        this.userObj = userinfo;
      });
      this.GetAllUser();
  }

  changePage(page) {
    this.homePageService.setPage(page);
  }

  logout() {
    this.database.DeleteUserData().then((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
    this.userInfoService.clearUserInfo();
    this.changePage(this.booksinfoPage);
  }

  GetAllUser() {
    this.database.GetUserInfo().then((data) => {
      this.err = data;
      this.userInfoService.setUserInfo(data);
    }, (error) => {
      this.err = error;
      console.log(error);
    });
  }

}
