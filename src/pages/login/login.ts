import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    userObj: IUserObj = new IUserObj();
    bookObj: any;
    isRegister = false;
    authRes: any;
    err: any;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public loginApi: LoginApi,
        public userInfoService: UserInfoService,
        public postBookDataService: PostBookDataService,
        public homePageService: HomePageService,
        private database: UserDbProvider,
        private loadingController: LoadingController) {

        this.bindForm();

    }

  

    bindForm() {
        this.loginForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }


    authorize() {
        let loader = this.loadingController.create({
            content: 'Authorizing...',
            dismissOnPageChange: true
        });
        loader.present();
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
                    this.authRes ="501"; 
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
                    this.authRes ="501"; 
                    loader.dismiss();
                }
            )
        }
    }

    validUser(response) {
        // this.CreateUser(response);
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

}
