import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import { BooksInfoApi } from '../../shared/shared';
import { HomePageService } from '../home/home.service';
import { BookdetailsPage } from '../pages';
import { BooksinfoPageService } from './booksinfo.service';
@Component({
  selector: 'page-booksinfo',
  templateUrl: 'booksinfo.html',
})
export class BooksinfoPage {

  booksInfo: any;
  tempBooksInfo: any;
  currentDate = new Date();
  pageLimit = 4;
  pageOffset = 0;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public booksInfoApi: BooksInfoApi,
    public homePageService: HomePageService,
    public booksinfoPageService: BooksinfoPageService,
    private loadingController: LoadingController) {

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad BooksinfoPage');
  }
   

  getBooks() {
    let loader = this.loadingController.create({
      content: 'Fetching books...',
      dismissOnPageChange: true
    });
    loader.present();
    this.booksInfoApi.getData(this.pageOffset, this.pageLimit).subscribe(response => {
      console.log(response);
      this.booksinfoPageService.setBooksList(response);
      loader.dismiss();
    },
      error => {
        console.log("error authentication" + error);
        loader.dismiss();
      }
    );
  }

  goToDetailsPage(book) {
    let modal = this.modalCtrl.create(BookdetailsPage, { bookObj: book });
    modal.present();
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
    this.pageOffset = 0;
     this.pageLimit = 4;
    this.booksInfoApi.getData(this.pageOffset, this.pageLimit).subscribe(response => {
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
    this.pageOffset = this.pageOffset + this.pageLimit;
    this.booksInfoApi.getData(this.pageOffset, this.pageLimit).subscribe(response => {
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

}


// return (checkfilter(this.filterObj.isacademic,item.isacademic) && 
// checkfilter(this.filterObj.update,item.updatefee) &&
// checkfilter(this.filterObj.update,item.updatefee)
// )

// checkfilter(item, filter){
//  if(filter) return item == filter;
//  else return true;
// }

