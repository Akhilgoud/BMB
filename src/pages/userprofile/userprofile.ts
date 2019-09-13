import { Component } from '@angular/core';
import { Platform, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
        this.userInfoService.userInfoChange.subscribe(
            response => {
                this.userObj = response;
            },
            error => {
                console.log("no user obj" + error);
            }
        );
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
            otp: [''],
            newPassword: new FormControl('', Validators.compose([
                Validators.minLength(5),
                Validators.required,
                // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
            ])),
            confirmPassword: new FormControl('', Validators.compose([
                Validators.minLength(5),
                Validators.required,
                // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
            ])),
            resetPassword: [false]
        });
    }

    validation_messages = {
        'name': [
            { type: 'required', message: 'name is required.' },
            { type: 'minlength', message: 'name must be at least 4 characters long.' },
            { type: 'maxlength', message: 'name cannot be more than 20 characters long.' },
        ],
        'password': [
            { type: 'required', message: 'Password is required.' },
            { type: 'minlength', message: 'Password must be at least 5 characters long.' },
            // { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
        ],
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
                            var message = this.userObj.otp ? 'Invalid OTP' : 'Invalid current password';
                        }
                        let toast = this.toastCtrl.create({
                            message: message,
                            position: 'bottom',
                            duration: 2000,
                            dismissOnPageChange: false
                        });
                        toast.present();
                        if (response)
                            this.homePageService.setPage(BooksinfoPage);
                        // toast.onDidDismiss(() => {
                        // });
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
            // alert("Password does not match");
            var message = 'Confirm password does not match';
            let toast = this.toastCtrl.create({
                message: message,
                position: 'bottom',
                duration: 3000,
                dismissOnPageChange: false
            });
            toast.present();
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
