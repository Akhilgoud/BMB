import { Component,  ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { NavController, PopoverController, NavParams  } from 'ionic-angular';
import { PostbookPage, BooksinfoPage, LoginPage , MypostsPage, FilterBooks } from '../pages';
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

  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;

  constructor(public navCtrl: NavController, 
    public homePageService: HomePageService,
    public popoverCtrl: PopoverController) {
    this.homePageService.rootpageChange.subscribe(
      page => {
        this.rootPage = page;
      });
    this.homePageService.setPage(BooksinfoPage);
  }

  changePage(pagename) {
    this.homePageService.setPage(pagename);
  }

  openFilterModal(ev){
    // const popover = this.popoverCtrl.create(FilterBooks);
    // popover.present();
    let popover = this.popoverCtrl.create(FilterBooks, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    }, {cssClass: 'contact-popover'});

    popover.present({
      ev: ev
    });
  }
  ionViewDidLeave() {
    this.alive = false;
  }
}
