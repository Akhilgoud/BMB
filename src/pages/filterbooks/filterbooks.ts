import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { FilterBooksService } from './filterbooks.service';
import { BooksInfoApi } from '../../shared/shared';
import { BooksinfoPageService } from '../booksinfo/booksinfo.service';
import { AutoCompleteListService } from './AutoCompleteListService';

@Component({
  selector: 'filter-books',
  templateUrl: 'filterbooks.html',
})
export class FilterBooks {
  filterObj: any = {};
  collegesNames: any = {};
  constructor(private navParams: NavParams,
    private filterBooksService: FilterBooksService,
    private viewController: ViewController,
    public booksInfoApi: BooksInfoApi,
    private loadingController: LoadingController,
    public booksinfoPageService: BooksinfoPageService,
    public autoCompleteListService: AutoCompleteListService
  ) {
    this.filterObj = this.filterBooksService.getFilterObj();
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.filterObj.bookType = {};
    this.filterObj.course = "";
    this.filterObj.branch = "";
    this.filterObj.year = "";
  }

  bookTypeClicked(ev, booktype) {
    if (!this.filterObj.bookType) this.filterObj.bookType = {};
    if (!this.filterObj.bookType[booktype]) this.filterObj.bookType[booktype] = true;
    else
      this.filterObj.bookType[booktype] = !this.filterObj.bookType[booktype];
  }

  applyFilters() {
    this.filterBooksService.setFilterObj(this.filterObj);
    var filterConditions: any = {}
    var booktypeArr = [];
    var tempBookType = this.filterObj.bookType;
    Object.keys(tempBookType).forEach(function (key) {
      if (tempBookType[key]) booktypeArr.push(key)
    });
    if (booktypeArr.length)
      filterConditions["bookType"] = { "$in": booktypeArr };

    if (this.filterObj.isAcademic) filterConditions["isAcademic"] = this.filterObj.isAcademic;
    if (this.filterObj.course) filterConditions["bookAcademic.course"] = this.filterObj.course;
    if (this.filterObj.branch) filterConditions["bookAcademic.branch"] = this.filterObj.branch;
    if (this.filterObj.year) filterConditions["bookAcademic.year"] = this.filterObj.year;
    if (this.filterObj.college) filterConditions["college"] = this.filterObj.college;
    if (this.filterObj.address) filterConditions["bookContact.address"] = this.filterObj.address;
    if (this.filterObj.price.lower) filterConditions["price"] = { "$gte": this.filterObj.price.lower };
    if (this.filterObj.price.upper) filterConditions["price"] = { ...filterConditions["price"], "$lte": this.filterObj.price.upper };


    // filterConditions["price"] = {"$gte": 100, "$lte": 1000};

    // { "price": { $gte: 100 } };
    // isAcademic: "Y",
    // bookType: [],
    // course: "",
    // branch: "",
    // year: "",
    // price: {
    //     lower: 0
    // },
    // college: "",
    // address: ""


    this.booksInfoApi.setFilterConditions(filterConditions);
    this.booksInfoApi.resetOffLimit();
    this.viewController.dismiss();
    let loader = this.loadingController.create({
      content: 'Applying Filters...',
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

  resetFilters() {
    this.filterBooksService.resetFilterObj();
    this.booksInfoApi.resetOffLimit();
    this.booksInfoApi.resetFilters();
    this.viewController.dismiss();
    let loader = this.loadingController.create({
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

}
