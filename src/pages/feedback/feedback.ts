import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BooksinfoPage } from "../pages";
import { HomePageService } from '../home/home.service';
import { UserInfoService } from "../../shared/shared";
import { FeedbackApi } from './feedback.service';

@Component({
    selector: 'page-feedback',
    templateUrl: 'feedback.html'
})
export class FeedbackPage {
    public photos: any;
    public images: any;
    public base64Image: string;
    public error: any;
    public isUpdatePage: boolean;
    feedbackForm: FormGroup;
    shownav: boolean = true;
    feedbackObj: any = {};
    constructor(public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        private camera: Camera,
        public formBuilder: FormBuilder,
        private alertCtrl: AlertController,
        public userInfoService: UserInfoService,
        public homePageService: HomePageService,
        public toastCtrl: ToastController,
        private loadingController: LoadingController,
        public feedbackApi: FeedbackApi
    ) {
        this.photos = [];
        this.platform.registerBackButtonAction(() => {
            this.homePageService.setPage(BooksinfoPage);
        });

    }

    ionViewWillEnter() {
        this.homePageService.setPageTitle('Send My Feedback');
    }

    ionViewWillLeave() {
        this.homePageService.setPageTitle('');
    }

    ngOnInit() {
        this.images = [];
        this.bindForm();
    }

    bindForm() {
        this.feedbackForm = this.formBuilder.group({
            issueType: ['', Validators.required],
            phoneModel: [''],
            severity: [''],
            description: ['', Validators.required]
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
            content: 'Sending Feedback...',
            dismissOnPageChange: true
        });
        loader.present().then(() => {
            var obj = {
                feedbackObj: this.feedbackObj,
                imageArr: this.photos
            }
            var userobj = this.userInfoService.getUserInfo();
            if (userobj && userobj.uid) {
                obj.feedbackObj.userId = userobj.uid;
            }
            this.feedbackApi.postFeedback(obj).subscribe(
                response => {
                    loader.dismiss();
                    if (response.errors) {
                        var message = 'Something went wrong. Please try again later';
                    } else {
                        var message = 'Feedback sent successfully';
                    }
                    let toast = this.toastCtrl.create({
                        message: message,
                        position: 'bottom',
                        duration: 2000,
                        dismissOnPageChange: false
                    });
                    toast.present();
                    this.homePageService.setPage(BooksinfoPage);
                },
                error => {
                    loader.dismiss();
                    console.log("error authentication" + error);
                    let toast = this.toastCtrl.create({
                        message: 'Something went wrong. Please try again later',
                        position: 'bottom',
                        duration: 2000,
                        dismissOnPageChange: false
                    });
                    toast.present();
                    this.homePageService.setPage(BooksinfoPage);
                }
            )
        });
    }
}
