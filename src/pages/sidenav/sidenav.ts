import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, LoginPage, MypostsPage, PostbookPage, BooksinfoPage, UserProfilePage, FeedbackPage } from '../pages';
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
  private booksinfoPage = BooksinfoPage;
  private userProfilePage = UserProfilePage;
  public feedbackPage = FeedbackPage;
  userObj: any = {};
  pages: any =[];
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

    this.pages = [
      { title: 'Rate App',  icon: 'star', func: this.changePage},
      { title: 'Share this App', icon: 'share',  func: this.changePage },
      { title: 'Feedback & help', icon: 'paper', func:  this.changePage },
      { title: 'Policy Privacy', icon: 'lock', func: this.changePage}
    ];
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
