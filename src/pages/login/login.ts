import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IUserObj } from './login.model';
import { BooksinfoPage, UserProfilePage } from '../pages';
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
    userObj: IUserObj = new IUserObj();
    bookObj: any;
    isRegister = false;
    isLogin = false;
    authRes: any;
    err: any;
    forgotPwd = false;
    forgotPwdEmail = "";
    forgotPwdSuccess = null;
    forgotPwdFailed = null;
    login_form: FormGroup;
    signup_form: FormGroup;
    forgot_password_form: FormGroup;
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
    }

    ionViewWillEnter() {
        this.homePageService.setPageTitle('Authorize');
    }

    ionViewWillLeave() {
        this.homePageService.setPageTitle('');
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
        this.forgotPwdSuccess = null;
        this.forgotPwdFailed = null;
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
                    this.forgotPwdSuccess = response.accepted && response.accepted.length > 0;
                    if (this.forgotPwdSuccess) {
                      setTimeout(() => {
                        this.homePageService.setPage(UserProfilePage);
                      }, 3000);
                    }
                    if (!this.forgotPwdSuccess) this.forgotPwdFailed = true;
                    loader.dismiss();
                },
                error => {
                    this.forgotPwdFailed = true;
                    console.log("error authentication" + error);
                    // this.authRes = "501";
                    loader.dismiss();
                }
            )
        });
    }

    forgotPwdClicked() {
        if (this.userObj && this.userObj.email)
            this.forgotPwdEmail = this.userObj.email;
            this.forgotPwd = true;
            this.isLogin = this.isRegister = false;
    }

    ngOnInit() {
        this.signup_form = this.formBuilder.group({
          name: new FormControl('', Validators.compose([
            Validators.maxLength(20),
            Validators.minLength(4),
            Validators.required
          ])),
          email: new FormControl('', Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          ])),
          password: new FormControl('', Validators.compose([
            Validators.minLength(5),
            Validators.required,
            // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
          ])),
        });


       this.login_form = this.formBuilder.group({
          email: new FormControl('', Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          ])),
          password: new FormControl('', Validators.compose([
            Validators.required,
          ])),
        });


        this.forgot_password_form = this.formBuilder.group({
          email: new FormControl('', Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          ])),
        });

    }


  validation_messages = {
    'name': [
      { type: 'required', message: 'name is required.' },
      { type: 'minlength', message: 'name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'name cannot be more than 20 characters long.' },
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      // { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
  }
}
