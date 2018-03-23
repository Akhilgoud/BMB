import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
@Component({
  selector: 'page-bookdetails',
  templateUrl: 'bookdetails.html',
})
export class BookdetailsPage {
  bookObj :any
  showImgSlide: boolean = false;
  tabInfo = 'bookInfo';
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController) {
      console.log(navParams.get('bookObj'));
      this.bookObj = navParams.get('bookObj');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookdetailsPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
 
}
