import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController, LoadingController, Item } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PostbookApi } from './postbook.service';
import { IBookObj } from './postbook.model';
import { BooksinfoPage } from "../pages";
import { HomePageService } from '../home/home.service';
import { MypostsPage } from "../myposts/myposts";
import { LoginApi } from "../login/login.service";
import { UserInfoService } from "../../shared/shared";
import { LoginPage } from "../login/login";
import { PostBookDataService } from "./postbookdata.service";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AutoCompleteListService } from '../filterbooks/AutoCompleteListService';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { MyPostsPageService } from '../myposts/myposts.service';
import { BooksinfoPageService } from '../booksinfo/booksinfo.service';


@Component({
    selector: 'page-postbook',
    templateUrl: 'postbook.html'
})
export class PostbookPage {
    // @ViewChild('description') description: ElementRef;
    public photos: any;
    public images: any;
    public base64Image: string;
    public error: any;
    public bookObj: IBookObj;
    public isUpdatePage: boolean;
    postbookForm: FormGroup;
    shownav: boolean = true;
    form: FormGroup;
    autocompleteItems = [];
    collegeAutoCompleteData = [];
    selectedAddress = "";
    selectedCollege = "";

    timer: any;
    public lookupData: any;
    constructor(public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        private camera: Camera,
        private sanitizer: DomSanitizer,
        public formBuilder: FormBuilder,
        private alertCtrl: AlertController,
        public postbookApi: PostbookApi,
        public userInfoService: UserInfoService,
        public postBookDataService: PostBookDataService,
        public homePageService: HomePageService,
        private loadingController: LoadingController,
        private barcodeScanner: BarcodeScanner,
        private autoCompleteListService: AutoCompleteListService,
        public myPostsPageService: MyPostsPageService,
        public booksinfoPageService: BooksinfoPageService) {
        this.photos = [];
        this.bookObj = new IBookObj();
        var postbookobj = this.postBookDataService.getPostBookObj();
        this.lookupData = this.postBookDataService.getLookupData();
        if (!this.lookupData) {
            this.postbookApi.getLookupData().subscribe(
                response => {
                    console.log(response[0]);
                    this.postBookDataService.setLookupData(response[0])
                    this.lookupData = response[0];
                },
                error => {
                    console.log("error authentication" + error);
                }
            );
        }

        if (postbookobj) {
            this.bookObj = postbookobj.bookObj;
            this.photos = postbookobj.imageArr;
            this.selectedAddress = this.bookObj.address;
            this.selectedCollege = this.bookObj.college;

        }
        this.isUpdatePage = this.postBookDataService.getIsUpdatePage();
        this.platform.registerBackButtonAction(() => {
            if (this.isUpdatePage)
                this.homePageService.setPage(MypostsPage);
            else
                this.homePageService.setPage(BooksinfoPage);
        });

    }

    ionViewWillEnter() {
        if (this.isUpdatePage)
            this.homePageService.setPageTitle('Update Book Details');
        else
            this.homePageService.setPageTitle('Sell My Book');

        // this.homePageService.setPageTitle('My Books');
    }

    ionViewWillLeave() {
        this.homePageService.setPageTitle('');
    }

    ngOnInit() {
        this.images = [];
        // this.bindForm();
        this.postbookForm = new FormGroup({
            bookname: new FormControl({ value: '' },
                [Validators.required]),
            author: new FormControl(false),
            publisher: new FormControl(false),
            edition: new FormControl(false),
            isFree: new FormControl(false),
            price: new FormControl({ value: '' },
                [Validators.required]),
            description: new FormControl(false),
            isAcademic: new FormControl({ value: '' },
                [Validators.required]),
            bookType: new FormControl({ value: '' },
                [Validators.required]),
            course: new FormControl(false),
            subcourse: new FormControl(false),
            branch: new FormControl(false),
            year: new FormControl(false),
            sem: new FormControl(false),
            phoneNo: new FormControl(false),
            address: new FormControl(false),
            landmark: new FormControl(false),
            pincode: new FormControl({ value: '' },
                [Validators.minLength(5)]),
            college: new FormControl(false),

        });
        this.isFree.valueChanges.subscribe(checked => {
            if (checked) {
                this.price.setValidators(null);
            } else {
                this.price.setValidators([Validators.required]);
            }
            this.price.updateValueAndValidity();
            this.price.reset(this.price.value);
        });
    }

    get isFree() {
        return this.postbookForm.get('isFree') as FormControl;
    }
    get price() {
        return this.postbookForm.get('price') as FormControl;
    }

    bindForm() {
        this.postbookForm = this.formBuilder.group({
            bookname: ['', Validators.required],
            author: [''],
            publisher: [''],
            edition: [''],
            isFree: [false],
            price: ['', Validators.required],
            description: [''],
            isAcademic: ['', Validators.required],
            bookType: ['', Validators.required],
            course: [''],
            branch: [''],
            year: [''],
            sem: [''],
            phoneNo: [''],
            address: [''],
            landmark: [''],
            pincode: [''],
            college: ['']
        });
    }

    // resize() {
    //     this.description.nativeElement.style.height = 'auto'
    //     this.description.nativeElement.style.height = this.description.nativeElement.scrollHeight + 'px';
    // }

    deletePhoto(index) {
        let confirm = this.alertCtrl.create({
            title: 'Sure you want to delete this photo? There is NO undo!',
            message: '',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log('Agree clicked');
                        this.photos.splice(index, 1);
                    }
                }
            ]
        });
        confirm.present();
    }

    takePhoto(btnType) {

        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 450,
            targetHeight: 450
        };

        if (btnType == 'btnGallery') {
            options.sourceType = this.camera.PictureSourceType.SAVEDPHOTOALBUM;
        } else {
            options.saveToPhotoAlbum = false;
        }
        this.camera.getPicture(options).then(
            imageData => {
                this.base64Image = imageData;
                this.photos.push(this.base64Image);
                this.photos.reverse();
            },
            err => {
                console.log(err);
                this.error = err;
            }
        );
    }

    submit() {
        let loader = this.loadingController.create({
            content: 'Posting Your Book...',
            dismissOnPageChange: true
        });
        loader.present().then(() => {
            if (!this.bookObj.latLong.coordinates.length) {
                this.bookObj.latLong = {
                    type: 'Point',
                    coordinates: [0, 0]
                };
            }

            if (this.bookObj.isFree) this.bookObj.price = 0;
            else if (!this.bookObj.price) this.bookObj.isFree = true;

            var obj = {
                bookObj: this.bookObj,
                imageArr: this.photos
            }
            var userobj = this.userInfoService.getUserInfo();
            if (userobj && userobj.uid) {
                obj.bookObj.uid = userobj.uid;
                obj.bookObj.email = userobj.email;
                obj.bookObj.userName = userobj.name;

                this.postbookApi.postNewBook(obj).subscribe(
                    response => {
                        loader.dismiss();
                        console.log(response);
                        this.myPostsPageService.setMyBooksList(null);
                        this.booksinfoPageService.setBooksList(null);
                        this.homePageService.setPage(MypostsPage);
                        this.postBookDataService.setBookInfo(null);
                        this.postBookDataService.setIsUpdatePage(false);
                    },
                    error => {
                        loader.dismiss();
                        let alert = this.alertCtrl.create({
                            title: 'Failed to post!',
                            subTitle: 'Please try again later',
                            buttons: ['Dismiss']
                        });
                        alert.present();
                        console.log("error authentication" + error);
                    }
                )
            } else {
                loader.dismiss();
                var oldobj = obj;
                this.postBookDataService.setBookInfo(oldobj);
                this.homePageService.setPage(LoginPage);
            }
        });
    }

    update() {
        let loader = this.loadingController.create({
            content: 'Updating Your Book...',
            dismissOnPageChange: true
        });
        loader.present().then(() => {
            if (!this.bookObj.latLong.coordinates.length) {
                this.bookObj.latLong = {
                    type: 'Point',
                    coordinates: [0, 0]
                };
            }
            if (this.bookObj.isFree) this.bookObj.price = 0;
            else if (!this.bookObj.price) this.bookObj.isFree = true;

            var obj = {
                bookObj: this.bookObj,
                imageArr: this.photos
            }
            var userobj = this.userInfoService.getUserInfo();
            if (userobj && userobj.uid) {
                obj.bookObj.uid = userobj.uid;
                obj.bookObj.email = userobj.email;
                obj.bookObj.userName = userobj.name;


                this.postbookApi.updateBookInfo(obj).subscribe(
                    response => {
                        loader.dismiss();
                        console.log(response);
                        this.myPostsPageService.setMyBooksList(null);
                        this.booksinfoPageService.setBooksList(null);
                        this.homePageService.setPage(MypostsPage);
                        this.postBookDataService.setBookInfo(null);
                        this.postBookDataService.setIsUpdatePage(false);
                    },
                    error => {
                        loader.dismiss();
                        let alert = this.alertCtrl.create({
                            title: 'Failed to update!',
                            subTitle: 'Please try again later',
                            buttons: ['Dismiss']
                        });
                        alert.present();
                        console.log("error authentication" + error);
                    }
                )
            } else {
                loader.dismiss();
                var oldobj = obj;
                this.postBookDataService.setBookInfo(oldobj);
                this.homePageService.setPage(LoginPage);
            }
        });
    }

    cancel() {
        this.postBookDataService.setBookInfo(null);
        this.postBookDataService.setIsUpdatePage(false);
        this.homePageService.setPage(MypostsPage);
    }


    scanBarCode() {
        var obj = {
            bookObj: this.bookObj,
        };
        this.barcodeScanner.scan().then(barcodeData => {
            if (barcodeData.text) {
                this.postbookApi.getBookdataFromBarCode(barcodeData.text).subscribe(
                    response => {
                        if (response && response.totalItems > 0 && response.items[0] && response.items[0]["volumeInfo"] && response.items[0]["volumeInfo"]["title"] != 'ISBN Review') {
                            obj.bookObj.name = response.items[0]["volumeInfo"]["title"];
                            obj.bookObj.author = response.items[0]["volumeInfo"]["authors"];
                            obj.bookObj.publisher = response.items[0]["volumeInfo"]["publisher"];
                            obj.bookObj.description = response.items[0]["volumeInfo"]["description"];
                        } else {
                            // obj.bookObj = null;
                            let alert = this.alertCtrl.create({
                                title: 'Sorry!',
                                subTitle: 'Cannot fetch this book!',
                                buttons: ['Dismiss']
                            });
                            alert.present();
                        }
                    },
                    error => {
                        // obj.bookObj = null;
                        console.log(error)
                    }
                )
            }
        });
    }


    updateSearchResults() {
        if (this.bookObj.address.length < 4 || this.bookObj.address == this.selectedAddress) {
            this.autocompleteItems = [];
            return;
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.autoCompleteListService.getAddress(this.bookObj.address).subscribe(response => {
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
        this.bookObj.address = item.address;
        this.selectedAddress = item.address;
        if (item.location) {
            this.bookObj.latLong = {
                type: 'Point',
                coordinates: [item.location.x, item.location.y]
            };
        }
        this.autocompleteItems = [];
        console.log(JSON.stringify(item))
    };

    courseSelected() {
        this.bookObj.subcourse = "";
        this.bookObj.branch = "";
        this.bookObj.year = null;
        this.bookObj.sem = null;

        this.lookupData.branch = [];
        this.lookupData.subcourse = [];
        this.lookupData.year = [];
        this.lookupData.sem = [];

        if (this.bookObj.course && this.lookupData && this.lookupData.BOOKTYPES && this.lookupData.BOOKTYPES.COURSE) {
            var selArr = this.lookupData.BOOKTYPES.COURSE.filter(item => item.key == this.bookObj.course);
            if (selArr && selArr[0] && selArr[0].subCategory) {
                this.lookupData.subcourse = selArr[0].subCategory;
            }
            if (selArr && selArr[0] && selArr[0].Branch) {
                this.lookupData.branch = selArr[0].Branch;
            }
            if (selArr && selArr[0] && selArr[0].Year) {
                this.lookupData.year = selArr[0].Year;
            }
            if (selArr && selArr[0] && selArr[0].Sem) {
                this.lookupData.sem = selArr[0].Sem;
            }
        }
    }

    degreeSelected() {
        this.bookObj.branch = "";
        this.bookObj.year = null;
        this.bookObj.sem = null;

        this.lookupData.branch = [];
        this.lookupData.year = [];
        this.lookupData.sem = [];
        if (this.bookObj.course && this.lookupData && this.lookupData.BOOKTYPES && this.lookupData.BOOKTYPES.COURSE) {
            var selArr = this.lookupData.subcourse.filter(item => item.key == this.bookObj.subcourse);
            if (selArr && selArr[0] && selArr[0].Branch) {
                this.lookupData.branch = selArr[0].Branch;
            }
            if (selArr && selArr[0] && selArr[0].Year) {
                this.lookupData.year = selArr[0].Year;
            }
            if (selArr && selArr[0] && selArr[0].Sem) {
                this.lookupData.sem = selArr[0].Sem;
            }
        }
    }

    collegeAutoComplete() {
        this.collegeAutoCompleteData = [];
        if (!this.bookObj.college || this.selectedCollege == this.bookObj.college) return;
        this.autoCompleteListService.collegeAutoComplete(this.bookObj.college).subscribe(response => {
            console.log(response);
            if (response && this.bookObj.college) {
                this.collegeAutoCompleteData = response;
            } else {
                this.collegeAutoCompleteData = [];
            }
        }, error => {
            console.log(error);
        }
        )
    }

    collegeAutoCompleteSelected(item) {
        this.collegeAutoCompleteData = [];
        this.bookObj.college = item;
        this.selectedCollege = item;
    }

    // showDegreeOption() {
    //     this.bookObj.subcourse = "";
    //     if (this.bookObj.course && this.lookupData && this.lookupData.BOOKTYPES && this.lookupData.BOOKTYPES.COURSE) {
    //         var selArr = this.lookupData.BOOKTYPES.COURSE.filter(item => item.key == this.bookObj.course);
    //         if (selArr && selArr[0] && selArr[0].subCategory) {
    //             this.lookupData.subcourse = selArr[0].subCategory;
    //             return true;
    //         }
    //     } else {
    //         return false;
    //     }
    // }

    // showBranchOption() {
    //     this.bookObj.branch = "";
    //     if (this.bookObj.course && this.lookupData && this.lookupData.BOOKTYPES && this.lookupData.BOOKTYPES.COURSE) {
    //         var selArr = this.lookupData.BOOKTYPES.COURSE.filter(item => item.key == this.bookObj.course);
    //         if (selArr && selArr[0] && selArr[0].subCategory) {
    //             this.lookupData.branch = selArr[0].Branch;
    //             return true;
    //         }
    //     } else {
    //         return false;
    //     }
    // }
    // scrollingFun(e) {
    //     if(e.directionY=='down'){
    //        this.shownav = false;
    //     } else {
    //         this.shownav = true;
    //     }
    // }

}
