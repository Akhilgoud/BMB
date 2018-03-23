import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController  } from 'ionic-angular';
import { BooksInfoApi } from '../../shared/shared';
import {HomePageService} from '../home/home.service';
import {BookdetailsPage} from '../pages';
@Component({
  selector: 'page-booksinfo',
  templateUrl: 'booksinfo.html',
})
export class BooksinfoPage {

  booksInfo: any;
  tempBooksInfo :any;
  currentDate = new Date();
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public booksInfoApi: BooksInfoApi,
    public homePageService:HomePageService) {
    this.getBooks();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BooksinfoPage');
  }

  getBooks() {
    this.booksInfoApi.getData().subscribe(response => {
      console.log(response);
      this.booksInfo = response;
      this.tempBooksInfo = response;
    },
      error => {
        console.log("error authentication" + error);
      }
    );
  }
  
  goToDetailsPage(book){
    let modal = this.modalCtrl.create(BookdetailsPage,{bookObj: book});
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
}

