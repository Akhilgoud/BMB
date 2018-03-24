import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IUserObj} from './login.model';
import {BooksinfoPage} from '../pages';
import {LoginApi} from './login.service';
import {UserInfoService} from '../../shared/shared';
import {HomePageService} from '../home/home.service';
import {PostBookDataService} from "../postbook/postbookdatakeeper.service";
import {PostbookPage} from "../postbook/postbook"

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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public formBuilder: FormBuilder,
                public loginApi: LoginApi,
                public userInfoService: UserInfoService,
                public postBookDataService: PostBookDataService,
                public homePageService: HomePageService) {

        this.bindForm();
    }

    bindForm() {
        this.loginForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    authorize() {
        if (this.isRegister) {
            this.loginApi.RegisterUser(this.userObj).subscribe(
                response => {
                    console.log(response);
                    this.authRes = response.data;
                    if (!response.data) {
                        this.userInfoService.setUserInfo(response);
                        if (this.postBookDataService.getPostBookObj()) {
                            this.homePageService.setPage(PostbookPage);
                        }
                        else {
                            this.homePageService.setPage(BooksinfoPage);
                        }
                    }
                },
                error => {
                    console.log("error authentication" + error);
                }
            )
        } else {
            this.loginApi.authorizeUser(this.userObj).subscribe(
                response => {
                    console.log(response);
                    if (response) {
                        this.userInfoService.setUserInfo(response);
                        if (this.postBookDataService.getPostBookObj()) {
                            this.homePageService.setPage(PostbookPage);
                        } else {
                            this.homePageService.setPage(BooksinfoPage);
                        }

                    } else {
                        this.authRes = "NODATA";
                    }
                },
                error => {
                    console.log("error authentication" + error);
                }
            )
        }
    }

}
