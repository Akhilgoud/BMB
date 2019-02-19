import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IUserObj } from './login.model';
import { BooksinfoPage } from '../pages';
import { LoginApi } from './login.service';
import { UserInfoService } from '../../shared/shared';
import { HomePageService } from '../home/home.service';
import { PostBookDataService } from "../postbook/postbookdata.service";
import { PostbookPage } from "../postbook/postbook";
import { UserDbProvider } from '../../providers/userdatabase';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    loginForm: FormGroup;
    loginFgtPwdForm: FormGroup;
    userObj: IUserObj = new IUserObj();
    bookObj: any;
    isRegister = false;
    authRes: any;
    err: any;
    forgotPwd = false;
    forgotPwdEmail = "";
    forgotPwdSuccess = null;
    constructor(public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public loginApi: LoginApi,
        public userInfoService: UserInfoService,
        public postBookDataService: PostBookDataService,
        public homePageService: HomePageService,
        private database: UserDbProvider,
        private loadingController: LoadingController) {

        this.platform.registerBackButtonAction(() => {
            this.homePageService.setPage(BooksinfoPage);
        });

        this.bindForm();

    }



    bindForm() {
        // this.loginForm = new FormGroup({
        //     'name': new FormControl(this.userObj.name, [
        //         Validators.required
        //     ]),
        //     'email': new FormControl(this.userObj.email, Validators.required),
        //     'password': new FormControl(this.userObj.password, Validators.required)
        // });

        this.loginForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.loginFgtPwdForm = this.formBuilder.group({
            email: ['', Validators.required]
        });
    }


    authorize() {
        let loader = this.loadingController.create({
            content: 'Authorizing...',
            dismissOnPageChange: true
        });
        loader.present().then(() => {
            if (this.isRegister) {
                this.loginApi.RegisterUser(this.userObj).subscribe(
                    response => {
                        this.authRes = response.erroMsg;
                        if (!response.erroMsg) {
                            this.validUser(response);
                        }
                        loader.dismiss();
                    },
                    error => {
                        console.log("error authentication" + error);
                        this.authRes = "501";
                        loader.dismiss();
                    }
                )
            } else {
                this.loginApi.authorizeUser(this.userObj).subscribe(
                    response => {
                        if (response && !response.erroMsg) {
                            this.validUser(response);
                        } else if (!response) {
                            this.authRes = "WC";
                        } else if (response && response.erroMsg) {
                            this.authRes = "NOTFOUND";
                        }
                        loader.dismiss();
                    },
                    error => {
                        console.log("error authentication" + error);
                        this.authRes = "501";
                        loader.dismiss();
                    }
                )
            }
        });
    }

    validUser(response) {
        this.CreateUser(response);
        response.uid = response._id;
        this.userInfoService.setUserInfo(response);
        var pageToRedirect = this.homePageService.getPreviousPage();
        if (pageToRedirect) {
            this.homePageService.setPage(pageToRedirect);
        }
        else {
            this.homePageService.setPage(BooksinfoPage);
        }
    }

    CreateUser(obj) {
        this.database.CreateUser(obj).then((data) => {
            console.log(data);
        }, (error) => {
            console.log(error);
        })
    }

    forgotPwdSubmit() {
        let loader = this.loadingController.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        loader.present().then(() => {
            this.loginApi.forgotPwd(this.forgotPwdEmail).subscribe(
                response => {
                    // this.authRes = response.erroMsg;
                    // if (!response.erroMsg) {
                    //     this.validUser(response);
                    // }
                    this.forgotPwdSuccess = response.accepted && response.accepted.length > 1;
                    loader.dismiss();
                },
                error => {
                    console.log("error authentication" + error);
                    // this.authRes = "501";
                    loader.dismiss();
                }
            )
        });
    }
}
