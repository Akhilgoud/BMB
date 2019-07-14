import { Component, ViewChild } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, ViewController, LoadingController, Searchbar } from 'ionic-angular';
import { FilterBooksService } from './filterbooks.service';
import { BooksInfoApi } from '../../shared/shared';
import { BooksinfoPageService } from '../booksinfo/booksinfo.service';
import { AutoCompleteListService } from './AutoCompleteListService';
// import { googlemaps } from 'googlemaps';
// import { loadModules } from 'esri-loader';

@Component({
  selector: 'filter-books',
  templateUrl: 'filterbooks.html',
})
export class FilterBooks {
  filterObj: any = {};
  collegesNames: any = {};
  googleAutocomplete: any = {}
  autocompleteItems = [];
  selectedAddress = "";
  timer: any;
  //@ViewChild('searchbar') searchBar: Searchbar;
  // @ViewChild('searchbar', { read: IonSearchbar }) searchbar: IonSearchbar;
  constructor(
    public platform: Platform, private navParams: NavParams,
    private filterBooksService: FilterBooksService,
    private viewController: ViewController,
    public booksInfoApi: BooksInfoApi,
    private loadingController: LoadingController,
    public booksinfoPageService: BooksinfoPageService,
    public autoCompleteListService: AutoCompleteListService
  ) {
    this.filterObj = this.filterBooksService.getFilterObj();

    this.platform.registerBackButtonAction(() => {
      this.viewController.dismiss();
    });
  }

  // async ngOnInit() {
  //   this.googleAutocomplete = new google.maps.places.Autocomplete(await this.searchbar.getInputElement());

  //   this.googleAutocomplete.addListener('place_changed', () => {
  //     // do whatever here
  //   });
  // }

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
    if (this.filterObj.price && this.filterObj.price.lower) filterConditions["price"] = { "$gte": this.filterObj.price.lower };
    if (this.filterObj.price && this.filterObj.price.upper) filterConditions["price"] = { ...filterConditions["price"], "$lte": this.filterObj.price.upper };
    if (this.filterObj.isFree) filterConditions["isFree"] = this.filterObj.isFree;
    // if (this.filterObj.address) filterConditions["bookContact.address"] = this.filterObj.address;
    if (this.filterObj.latLong) filterConditions["latLong"] = this.filterObj.latLong;


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

  updateSearchResults() {
    if (this.filterObj.address.length < 4 || this.filterObj.address == this.selectedAddress) {
      this.autocompleteItems = [];
      return;
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.autoCompleteListService.getAddress(this.filterObj.address).subscribe(response => {
        console.log(response);
        this.autocompleteItems = [];
        if (response && response.candidates) {
          response.candidates.forEach((val) => {
            this.autocompleteItems.push(val);
          });
        }
      }, error => {
        console.log(error);
      }
      )
    }, 500)


  };

  selectSearchResult(item) {
    this.filterObj.address = item.address;
    this.selectedAddress = item.address;
    this.filterObj.latLong = item.location;
    this.autocompleteItems = [];
    console.log(JSON.stringify(item))
  }

}
    // const legend = new esri.Legend()

    // calculateDistance(lat1: number, lat2: number, long1: number, long2: number){
    //   let p = 0.017453292519943295;    // Math.PI / 180
    //   let c = Math.cos;
    //   let a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    //   let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    //   return dis;
    // }

    // "x": 77.550000000000068,
    //   "y": 17.900000000000034
    // 17.629170000000045, 78.772500000000036  //mad
    // 17.466600000000028, 78.53568000000007 //saf
    // 17.396420000000035, 78.488430000000051 //naraya
    // return loadModules([
    //   "esri/Map",
    //   "esri/views/MapView",
    //   "esri/views/SceneView",
    //   "esri/core/watchUtils",
    // ]).then(([Map, Point, SpatialReference, webMercatorUtils, esri]) => {

    //   var pt1 = new Point(78.53568000000007, 17.466600000000028, new SpatialReference({ wkid: 4326 }));
    //   var pt2 = new Point(78.488430000000051, 17.396420000000035, new SpatialReference({ wkid: 4326 }));
    //   var pt1_web = webMercatorUtils.geographicToWebMercator(pt1);
    //   var pt2_web = webMercatorUtils.geographicToWebMercator(pt2);
    //   var meter_value = esri.geometry.getLength(pt1_web, pt2_web);
    //   var km_value = meter_value / 1000;

    // })

    // if (this.filterObj.address.length < 5) {
    //   this.autocompleteItems = [];
    //   return;
    // }

    // this.GoogleAutocomplete.getPlacePredictions({ input: this.bookObj.address },
    //   (predictions, status) => {
    //     this.autocompleteItems = [];
    //     this.zone.run(() => {
    //       predictions.forEach((prediction) => {
    //         this.autocompleteItems.push(prediction);
    //       });
    //     });
    //   });


