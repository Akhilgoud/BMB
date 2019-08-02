import { Component } from '@angular/core';
import { App, Platform, PopoverController, ToastController, IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { BooksInfoApi } from '../../shared/shared';
import { HomePageService } from '../home/home.service';
import { BookdetailsPage, FilterBooks } from '../pages';
import { BooksinfoPageService } from './booksinfo.service';
@Component({
  selector: 'page-booksinfo',
  templateUrl: 'booksinfo.html',
})
export class BooksinfoPage {

  booksInfo: any;
  tempBooksInfo: any;
  currentDate = new Date();
  showImgSlide = false;
  clickedBookImg: any = {};
  filterObj: any = {};


  lastBack = Date.now();
  allowClose = false;
  // pageLimit = 4;
  // pageOffset = 0;
  constructor(public app: App,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public booksInfoApi: BooksInfoApi,
    public homePageService: HomePageService,
    public booksinfoPageService: BooksinfoPageService,
    private loadingController: LoadingController) {

    // this.platform.registerBackButtonAction(() => {
    //   console.log('in');
    //   if (this.showImgSlide) {
    //     this.showImgSlide = false
    //     console.log('in if');
    //   } else {
    //     console.log('in ell');
    //     this.platform.exitApp();
    //     console.log('af el');
    //   }
    // });

    this.platform.registerBackButtonAction(() => {
      console.log('in');
      const closeDelay = 2000;
      const spamDelay = 500;
      if (this.showImgSlide) {
        this.showImgSlide = false
        console.log('in if');
      } else if (Date.now() - this.lastBack > spamDelay && !this.allowClose) {
        this.allowClose = true;
        let toast = this.toastCtrl.create({
          message: 'Press back again to Close',
          position: 'bottom',
          duration: closeDelay,
          dismissOnPageChange: true
        });
        toast.onDidDismiss(() => {
          this.allowClose = false;
        });
        toast.present();
      } else if (Date.now() - this.lastBack < closeDelay && this.allowClose) {
        this.platform.exitApp();
      }
      this.lastBack = Date.now();
    });


    // platform.registerBackButtonAction(() => {
    //   const overlay = this.app._appRoot._overlayPortal.getActive();
    //   const nav = this.app.getActiveNav();
    //   const closeDelay = 2000;
    //   const spamDelay = 500;
    //   console.log(overlay);
    //   if (this.showImgSlide) {
    //     this.showImgSlide = false
    //     console.log('in if');
    //   }
    //   else if (overlay && overlay.dismiss) {
    //     overlay.dismiss();
    //   } else if (nav.canGoBack()) {
    //     nav.pop();
    //   } else if (Date.now() - this.lastBack > spamDelay && !this.allowClose) {
    //     this.allowClose = true;
    //     let toast = this.toastCtrl.create({
    //       message: 'Press back again to Close',
    //       position: 'bottom',
    //       duration: closeDelay,
    //       dismissOnPageChange: true
    //     });
    //     toast.onDidDismiss(() => {
    //       this.allowClose = false;
    //     });
    //     toast.present();
    //   } else if (Date.now() - this.lastBack < closeDelay && this.allowClose) {
    //     this.platform.exitApp();
    //   }
    //   this.lastBack = Date.now();
    // });


    /////////////////////////////////////
    this.booksinfoPageService.booksListChange.subscribe(
      data => {
        this.booksInfo = data;
        this.tempBooksInfo = data;
      });
    var availableData = this.booksinfoPageService.getBooksList();
    if (availableData) {
      this.booksInfo = availableData;
      this.tempBooksInfo = availableData;
    } else {
      this.getBooks();
    }
  }

  getFreeBooks(event){
     event.target.checked
     ? this.booksInfoApi.setFilterConditions({"isFree":true})
     : this.booksInfoApi.setFilterConditions({})
     this.getBooks();
  }

  getBooks() {
    let loader = this.loadingController.create({
      // spinner: 'hide',
      // content: `
      // <div class="custom-spinner-container">
      //   <div class="custom-spinner-box">
      //      <img src="assets/imgs/loadingbooks.gif" id="loadingIcon"  />
      //   </div>
      // </div>`,
      content: 'Fetching books...',
      dismissOnPageChange: true
    });
    loader.present().then(() => {
      this.booksInfoApi.getData().subscribe(response => {
        console.log(response);
        this.booksinfoPageService.setBooksList(response);
        loader.dismiss();
      },
        error => {
          console.log("error authentication" + error);
          loader.dismiss();
        }
      )
    });
  }

  ionViewWillEnter() {
    this.homePageService.setPageTitle('BUY MY BOOK');
  }

  ionViewWillLeave() {
    this.homePageService.setPageTitle('');
  }
  openFilterModal(ev) {
    let popover = this.popoverCtrl.create(FilterBooks, {}, {showBackdrop: true, cssClass: 'contact-popover' });
    popover.present({
      ev: ev
    });
  }

  goToDetailsPage(book) {
    let modal = this.modalCtrl.create(BookdetailsPage, { bookObj: book });
    modal.present();
    // modal.present().then(() => {
    //   var deregisterFunction = this.platform.registerBackButtonAction(() => {
    //     // if (this.showImgSlide) {
    //     //   this.showImgSlide = false;
    //     // }
    //     // else {
    //     modal.dismiss();
    //     // }
    //     modal.onWillDismiss(() => { deregisterFunction(); });
    //   });
    // });
    // this.homePageService.setPage(BookdetailsPage);
  }

  filterItems(ev: any) {
    this.booksInfo = this.tempBooksInfo;
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.booksInfo = this.booksInfo.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    // this.pageOffset = 0;
    //  this.pageLimit = 4;
    this.booksInfoApi.resetOffLimit();
    this.booksInfoApi.getData().subscribe(response => {
      console.log(response);
      this.booksinfoPageService.setBooksList(response);
      refresher.complete();
    },
      error => {
        console.log("error authentication" + error);
        refresher.complete();
      }
    );
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    // this.pageOffset = this.pageOffset + this.pageLimit;
    this.booksInfoApi.incrementOffset();
    this.booksInfoApi.getData().subscribe(response => {
      console.log(response);
      this.booksinfoPageService.addBooksList(response);
      infiniteScroll.complete();
    },
      error => {
        console.log("error authentication" + error);
        infiniteScroll.complete();
      }
    );

  }

  bookImageClicked(book) {
    this.clickedBookImg = {};
    if (book.bookImages[0]) {
      this.showImgSlide = true;
      this.clickedBookImg = book.bookImages;
    }
  }

}


// return (checkfilter(this.filterObj.isacademic,item.isacademic) &&
// checkfilter(this.filterObj.update,item.updatefee) &&
// checkfilter(this.filterObj.update,item.updatefee)
// )

// checkfilter(item, filter){
//  if(filter) return item == filter;
//  else return true;
// }

