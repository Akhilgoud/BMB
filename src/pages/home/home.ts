import { Component, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { NavController, PopoverController, NavParams, Searchbar } from 'ionic-angular';
// import { Keyboard } from 'ionic-native';
import { PostbookPage, BooksinfoPage, LoginPage, MypostsPage, FilterBooks } from '../pages';
import { HomePageService } from './home.service';
import { BooksinfoPageService } from '../booksinfo/booksinfo.service';
import { MyPostsPageService } from '../myposts/myposts.service';

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
  private showFilterIcon: boolean = true;
  private pageTitle: string = "";

  constructor(public navCtrl: NavController,
    public homePageService: HomePageService,
    public popoverCtrl: PopoverController,
    public booksinfoPageService: BooksinfoPageService,
    public myPostsPageService: MyPostsPageService) {
    this.homePageService.rootpageChange.subscribe(
      page => {
        this.showSearchIcon = false;
        this.showSearchBox = false;
        this.showFilterIcon = false;
        if (page == this.booksinfoPage) {
          this.showSearchIcon = true;
          this.showFilterIcon = true;
        } else if (page == this.mypostsPage) {
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
    this.homePageService.setPage(pagename);
  }

  openFilterModal(ev) {
    let popover = this.popoverCtrl.create(FilterBooks, {}, { cssClass: 'contact-popover' });
    popover.present({
      ev: ev
    });
  }

  filterItems(ev: any) {
    if (this.rootPage == this.booksinfoPage)
      this.booksinfoPageService.filterItems(ev);
    else if (this.rootPage == this.mypostsPage)
      this.myPostsPageService.filterItems(ev);

  }

  ionViewDidLeave() {
    this.alive = false;
  }
}
