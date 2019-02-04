import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostbookApi } from './postbook.service';
import { IBookObj } from './postbook.model';
import { BooksinfoPage } from "../pages";
import { HomePageService } from '../home/home.service';
import { MypostsPage } from "../myposts/myposts";
import { LoginApi } from "../login/login.service";
import { UserInfoService } from "../../shared/shared";
import { LoginPage } from "../login/login";
import { PostBookDataService } from "./postbookdata.service";

@Component({
    selector: 'page-postbook',
    templateUrl: 'postbook.html'
})
export class PostbookPage {
    public photos: any;
    public images: any;
    public base64Image: string;
    public error: any;
    public bookObj: IBookObj;
    public isUpdatePage: boolean;
    postbookForm: FormGroup;
    shownav: boolean = true;
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
        public homePageService: HomePageService) {

        this.photos = [];
        this.bookObj = new IBookObj();
        var postbookobj = this.postBookDataService.getPostBookObj();
        if (postbookobj) {
            this.bookObj = postbookobj.bookObj;
            this.photos = postbookobj.imageArr;
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
        this.homePageService.setPageTitle('Post My Book');
        // this.homePageService.setPageTitle('My Books');
    }

    ionViewWillLeave() {
        this.homePageService.setPageTitle('');
    }

    ngOnInit() {
        this.images = [];
        this.bindForm();
    }

    bindForm() {
        this.postbookForm = this.formBuilder.group({
            bookname: ['', Validators.required],
            author: [''],
            publisher: [''],
            edition: [''],
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
            pincode: ['', Validators.required],
            college: ['']
        });
    }

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

    takePhoto() {
        console.log("coming here");

        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 450,
            targetHeight: 450,
            saveToPhotoAlbum: false
        };

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
        var obj = {
            bookObj: this.bookObj,
            imageArr: this.photos
        }
        var userobj = this.userInfoService.getUserInfo();
        if (userobj && userobj._id) {
            obj.bookObj.uid = userobj._id;
            obj.bookObj.email = userobj.email;
            this.postbookApi.postNewBook(obj).subscribe(
                response => {
                    console.log(response);
                    this.homePageService.setPage(MypostsPage)
                },
                error => {
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
            var oldobj = obj;
            this.postBookDataService.setBookInfo(oldobj);
            this.homePageService.setPage(LoginPage);
        }
    }

    update() {
        var obj = {
            bookObj: this.bookObj,
            imageArr: this.photos
        }
        var userobj = this.userInfoService.getUserInfo();
        if (userobj && userobj._id) {
            obj.bookObj.uid = userobj._id;
            obj.bookObj.email = userobj.email;

            this.postbookApi.updateBookInfo(obj).subscribe(
                response => {
                    console.log(response);
                    this.homePageService.setPage(MypostsPage)
                },
                error => {
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
            var oldobj = obj;
            this.postBookDataService.setBookInfo(oldobj);
            this.homePageService.setPage(LoginPage);
        }
    }

    cancel() {
        this.homePageService.setPage(MypostsPage);
    }

    // scrollingFun(e) {
    //     if(e.directionY=='down'){
    //        this.shownav = false;
    //     } else {
    //         this.shownav = true;
    //     }
    // }

}
