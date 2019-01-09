import { Component, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { NavController, PopoverController, NavParams } from 'ionic-angular';
import { PostbookPage, BooksinfoPage, LoginPage, MypostsPage, FilterBooks } from '../pages';
import { HomePageService } from './home.service';
import { BooksinfoPageService } from '../booksinfo/booksinfo.service';

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
  private mypostsPage = MypostsPage;
  private showSearchBox: boolean = false;
  private showSearchIcon: boolean = true;
  private pageTitle:string = "";

  constructor(public navCtrl: NavController,
    public homePageService: HomePageService,
    public popoverCtrl: PopoverController,
    public booksinfoPageService: BooksinfoPageService) {
    this.homePageService.rootpageChange.subscribe(
      page => {
          if(page != this.booksinfoPage && page != this.mypostsPage){
          this.showSearchIcon = false;
          this.showSearchBox = false;
        } else {
          this.showSearchIcon = true;
        }
        this.rootPage = page;
      });
    this.homePageService.setPage(BooksinfoPage);

    this.homePageService.pageTitleChange.subscribe(
      title => {
         this.pageTitle = title;
      });
  }

 
  changePage(pagename) {
    // if(pagename == this.homePageService )
    this.homePageService.setPage(pagename);
  }

  openFilterModal(ev) {
    // const popover = this.popoverCtrl.create(FilterBooks);
    // popover.present();
    let popover = this.popoverCtrl.create(FilterBooks, {}, { cssClass: 'contact-popover' });
    popover.present({
      ev: ev
    });
  }

  searchClicked() {
    this.showSearchBox = !this.showSearchBox;
    if (this.showSearchBox) {
      document.getElementsByClassName('searchSelected')[0]["style"].marginTop = "17%";

    } else {
      document.getElementsByClassName('searchSelected')[0]["style"].marginTop = "0%";
    }
  }

  filterItems(ev: any) {
    this.booksinfoPageService.filterItems(ev);
  }

  ionViewDidLeave() {
    this.alive = false;
  }
}
