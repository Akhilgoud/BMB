import { Component } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { NavController } from 'ionic-angular';
import { PostbookPage, BooksinfoPage, LoginPage } from '../pages';
import { HomePageService } from './home.service';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private alive: boolean = true;
  private rootPage;
  private postbookPage = PostbookPage;
  private booksinfoPage = BooksinfoPage;
  private loginPage = LoginPage;
  constructor(public navCtrl: NavController, public homePageService: HomePageService) {
    this.homePageService.rootpageChange.subscribe(
      page => {
        this.rootPage = page;
      });
    this.homePageService.setPage(this.booksinfoPage);
  }

  changePage(pagename) {
    this.homePageService.setPage(pagename);
  }

  ionViewDidLeave() {
    this.alive = false;
  }
}
