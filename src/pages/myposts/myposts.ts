import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { BooksInfoApi } from '../../shared/shared';
import { UserInfoService } from '../../shared/shared';
import { BookdetailsPage, BooksinfoPage } from '../pages';
import { HomePageService } from '../home/home.service';
import { MyPostsPageService } from './myposts.service';
@Component({
  selector: 'page-myposts',
  templateUrl: 'myposts.html',
})
export class MypostsPage {

  // uid = "5aafd21ea8c1e60004301f26";
  userInfo: any;
  booksInfo: any;
  tempBooksInfo: any;
  searchFilter: boolean = false;
  showImgSlide = false;
  noBooks = false;
  clickedBookImg: any = {};

  constructor(public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public booksInfoApi: BooksInfoApi,
    public userInfoService: UserInfoService,
    private loadingController: LoadingController,
    public homePageService: HomePageService,
    public myPostsPageService: MyPostsPageService) {

    this.platform.registerBackButtonAction(() => {
      if (this.showImgSlide) {
        this.showImgSlide = false
      } else {
        this.homePageService.setPage(BooksinfoPage);
      }
    });

    this.userInfo = this.userInfoService.getUserInfo();

    this.myPostsPageService.myBooksListChange.subscribe(
      data => {
        this.booksInfo = data;
        this.tempBooksInfo = data;
      });
    var availableData = this.myPostsPageService.getMyBooksList();

    if (availableData) {
      this.booksInfo = availableData;
      this.tempBooksInfo = availableData;
    } else {
      this.getPosts(this.userInfo.uid);
    }
    // this.getPosts(this.uid);
  }

  ionViewWillEnter() {
    this.homePageService.setPageTitle('My Posted Books');
  }

  ionViewWillLeave() {
    this.homePageService.setPageTitle('');
  }

  getPosts(uid) {
    let loader = this.loadingController.create({
      content: 'Fetching books...',
      dismissOnPageChange: true
    });
    loader.present().then(() => {
      this.booksInfoApi.getPostsById(uid).subscribe(response => {
        this.booksInfo = response;
        this.tempBooksInfo = response;
        this.noBooks = response? false : true;
        this.myPostsPageService.setMyBooksList(response);
        loader.dismiss();
      },
        error => {
          console.log("error authentication" + error);
          loader.dismiss();
        }
      )
    });
  }

  goToDetailsPage(book) {
    let modal = this.modalCtrl.create(BookdetailsPage, { bookObj: book });
    modal.present();
    // this.homePageService.setPage(BookdetailsPage);
  }

  // filterItems(ev: any) {
  //   this.booksInfo = this.tempBooksInfo;
  //   let val = ev.target.value;
  //   if (val && val.trim() != '') {
  //     this.booksInfo = this.booksInfo.filter((item) => {
  //       return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }

  changeStatus(id, status) {
    var obj = {
      bookId: id,
      status: status,
      userId: this.userInfo.uid
    }
    let loader = this.loadingController.create({
      content: 'Updating Status...',
      dismissOnPageChange: true
    });
    loader.present().then(() => {
      this.booksInfoApi.updateBookStatus(obj).subscribe(response => {
        console.log(response);
        if (response.erroMsg) {
          loader.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Failed to update!',
            subTitle: 'Please try again later',
            buttons: ['Dismiss']
          });
          alert.present();
        } else {
          this.myPostsPageService.setMyBooksList(response);
          loader.dismiss();
        }
      },
        error => {
          console.log("error authentication" + error);
          loader.dismiss();
        }
      )
    });
  }

  doRefresh(refresher) {
    this.booksInfoApi.getPostsById(this.userInfo.uid).subscribe(response => {
      this.myPostsPageService.setMyBooksList(response);
      refresher.complete();
    },
      error => {
        refresher.complete();
      }
    )
  }

  bookImageClicked(book) {
    this.clickedBookImg = {};
    if (book.bookImages[0]) {
      this.showImgSlide = true;
      this.clickedBookImg = book.bookImages;
    }
  }

}
