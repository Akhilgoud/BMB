import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BooksInfoApi} from '../../shared/shared';

@Component({
  selector: 'page-myposts',
  templateUrl: 'myposts.html',
})
export class MypostsPage {

  uid = "5aa93239734d1d6b7120f9de";
  booksInfo:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
  public booksInfoApi:BooksInfoApi) {
    this.getPosts(this.uid);
  }

  getPosts(uid){
  this.booksInfoApi.getPostsById(uid).subscribe(response => {
    console.log(response);
    this.booksInfo = response;
  },
    error => {
      console.log("error authentication" + error);
    }
  );
  }

 

}
