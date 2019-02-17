import { Component } from '@angular/core';
import { Platform, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BooksinfoPage } from '../pages';
import { UserProfileApi } from './userprofile.service';
import { UserInfoService } from '../../shared/shared';
import { HomePageService } from '../home/home.service';
import { UserDbProvider } from '../../providers/userdatabase';


@Component({
    selector: 'page-userprofile',
    templateUrl: 'userprofile.html',
})
export class UserProfilePage {
    userProfileForm: FormGroup;
    userObj: any = {};
    constructor(public platform: Platform,
        public formBuilder: FormBuilder,
        public toastCtrl: ToastController,
        public userProfileApi: UserProfileApi,
        public userInfoService: UserInfoService,
        public homePageService: HomePageService,
        private loadingController: LoadingController,
        private database: UserDbProvider) {

        this.platform.registerBackButtonAction(() => {
            this.homePageService.setPage(BooksinfoPage);
        });

        this.userObj = this.userInfoService.getUserInfo() ? this.userInfoService.getUserInfo() : {};
        // this.userObj.email = 'tag@gmail.com';
        this.bindForm();
    }

    ionViewWillEnter() {
        this.homePageService.setPageTitle('Change My Profile');
        // this.homePageService.setPageTitle('My Books');
    }
    ionViewWillLeave() {
        this.homePageService.setPageTitle('');
    }

    bindForm() {
        this.userProfileForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: [{ value: '', disabled: true }, Validators.required],
            password: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            resetPassword: [false]
        });
    }

    udpateProfile() {
        if (this.userObj.newPassword == this.userObj.confirmPassword) {
            let loader = this.loadingController.create({
                content: 'Updating Profile...',
                dismissOnPageChange: true
            });
            loader.present().then(() => {
                this.userProfileApi.updateProfile(this.userObj).subscribe(
                    response => {
                        if (response) {
                            this.validUser(response);
                            var message = 'Profile updated successfully'
                        } else {
                            var message = 'Something went wrong. Please try again later'
                        }
                        let toast = this.toastCtrl.create({
                            message: message,
                            position: 'bottom',
                            duration: 2000,
                            dismissOnPageChange: false
                        });
                        toast.onDidDismiss(() => {
                            this.homePageService.setPage(BooksinfoPage);
                        });
                        toast.present();
                        loader.dismiss();
                    },
                    error => {
                        console.log("error authentication" + error);
                        let toast = this.toastCtrl.create({
                            message: 'Something went wrong. Please try again later',
                            position: 'bottom',
                            duration: 2000,
                            dismissOnPageChange: false
                        });
                        toast.present();
                        this.homePageService.setPage(BooksinfoPage);

                        // toast.onDidDismiss(() => {
                        // });
                        loader.dismiss();
                    }
                )
            });
        } else {
            alert("Password does not match");
        }
    }

    validUser(response) {
        this.CreateUser(response);
        response.uid = response._id;
        this.userInfoService.setUserInfo(response);
    }

    CreateUser(obj) {
        this.database.CreateUser(obj).then((data) => {
            console.log(data);
        }, (error) => {
            console.log(error);
        })
    }
}
