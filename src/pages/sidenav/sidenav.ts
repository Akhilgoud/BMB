import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, LoginPage, MypostsPage, PostbookPage, BooksinfoPage, UserProfilePage, FeedbackPage } from '../pages';
import { HomePageService } from '../home/home.service';
import { UserInfoService } from '../../shared/shared';
import { IUserObj } from '../login/login.model';
import { UserDbProvider } from '../../providers/userdatabase';
import { SocialSharing } from '@ionic-native/social-sharing';

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
  pages: any = [];
  err: any;
  playStoreURL = ""
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public homePageService: HomePageService,
    public userInfoService: UserInfoService,
    private database: UserDbProvider,
    private socialSharing: SocialSharing
  ) {
    this.rootPage = HomePage;
    this.userInfoService.userInfoChange.subscribe(
      userinfo => {
        this.userObj = userinfo;
      });
    this.GetAllUser();

    this.pages = [
      // { title: 'Rate App',  icon: 'star', func: this.rateApp},
      // { title: 'Share this App', icon: 'share',  func: this.shareApp },
      { title: 'Feedback & help', icon: 'paper', func: this.changePage.bind(this, FeedbackPage) },
      // { title: 'Policy Privacy', icon: 'lock', func: this.changePage.bind(this, FeedbackPage) }
    ];
  }

  rateApp() {

  }

  shareApp() {
    this.socialSharing.share('Download BMB From: ', '', '', this.playStoreURL).then(() => {
      console.log("app shared")
    }).catch((err) => {
      console.log('error sharing book');
    });
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
