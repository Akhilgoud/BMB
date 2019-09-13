import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { HomePage, LoginPage, MypostsPage, PostbookPage, BooksinfoPage, UserProfilePage, FeedbackPage } from '../pages';
import { HomePageService } from '../home/home.service';
import { UserInfoService } from '../../shared/shared';
import { IUserObj } from '../login/login.model';
import { UserDbProvider } from '../../providers/userdatabase';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PostBookDataService } from '../postbook/postbookdata.service';

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
  playStoreURL = "https://play.google.com/apps/internaltest/4700268196536219940";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public homePageService: HomePageService,
    public userInfoService: UserInfoService,
    private database: UserDbProvider,
    private socialSharing: SocialSharing,
    private postBookDataService: PostBookDataService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {
    this.rootPage = HomePage;
    this.userInfoService.userInfoChange.subscribe(
      userinfo => {
        this.userObj = userinfo;
      });
    this.GetAllUser();

    this.pages = [
      // { title: 'Rate App',  icon: 'star', func: this.rateApp},
      // { title: 'Share this App', icon: 'share', func: this.shareApp },
      { title: 'Feedback & help', icon: 'paper', func: this.changePage.bind(this, FeedbackPage) },
      { title: 'Policy Privacy', icon: 'lock', func: this.privacyPolicy }
    ];
  }

  rateApp() {

  }

  privacyPolicy() {
    document.location.href = "https://buymybook.flycricket.io/privacy.html";
  }

  shareApp() {
    this.socialSharing.share(this.getShareMessageBody(), 'Buy My Book App ', '', null).then(() => {
      console.log('Share');
    }).catch((err) => {
      console.log('error sharing book');
    });

    // this.socialSharing.share('Download BMB From: ', '', '', this.playStoreURL).then(() => {
    //   console.log("app shared")
    // }).catch((err) => {
    //   console.log('error sharing book');
    // });
  }

  getShareMessageBody() {
    var msg = "Found this great APP.\nYou can buy or sell your old books in 'Buy My Book' app.\n";
    msg = msg + "Do check it out.\n";
    return msg;
  }

  changePage(page) {
    if (page == this.postBookPage) {
      this.postBookDataService.setIsUpdatePage(false);
      this.postBookDataService.setBookInfo(null);
    }
    this.homePageService.setPage(page);
  }

  logout() {
    let alert = this.alertCtrl.create({
      message: 'Do you really want to signout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.changePage(this.booksinfoPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.database.DeleteUserData().then((data) => {
              var message = 'Logged out successfully';
              let toast = this.toastCtrl.create({
                message: message,
                position: 'bottom',
                duration: 3000,
                dismissOnPageChange: false
              });
              toast.present();
            }, (error) => {
              console.log(error);
              var message = 'Log out failed';
              let toast = this.toastCtrl.create({
                message: message,
                position: 'bottom',
                duration: 3000,
                dismissOnPageChange: false
              });
              toast.present();
            });
            this.userInfoService.clearUserInfo();
            this.changePage(this.booksinfoPage);
          }
        }
      ]
    });
    if (alert)
      alert.present();
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
