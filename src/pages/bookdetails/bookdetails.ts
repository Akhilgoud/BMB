import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserInfoService } from '../../shared/shared';
import { HomePageService } from '../home/home.service';
import { PostbookPage } from "../postbook/postbook";
import { PostBookDataService } from "../postbook/postbookdata.service";

@Component({
    selector: 'page-bookdetails',
    templateUrl: 'bookdetails.html',
})
export class BookdetailsPage {
    bookObj: any
    showImgSlide: boolean = false;
    tabInfo = 'bookInfo';
    allowEdit: boolean = true;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public userInfoService: UserInfoService,
        public homePageService: HomePageService,
        public postBookDataService: PostBookDataService,
        public viewCtrl: ViewController,
        private callSvc: CallNumber,
        private socialSharing: SocialSharing) {
        console.log(navParams.get('bookObj'));
        this.allowEdit = false;
        this.bookObj = navParams.get('bookObj');
        var userInfo = this.userInfoService.getUserInfo();
        if (userInfo && this.bookObj.uid == userInfo._id) {
            this.allowEdit = true;
        }

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BookdetailsPage');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    gotoEditPage() {
        var obj = this.bookObj;
        if (this.bookObj.bookContact.length) {
            obj.address = this.bookObj.bookContact[0].address;
            obj.college = this.bookObj.bookContact[0].college;
            obj.landmark = this.bookObj.bookContact[0].landmark;
            obj.phoneNo = this.bookObj.bookContact[0].phoneNo;
            obj.pincode = this.bookObj.bookContact[0].pincode;
        }
        if (this.bookObj.bookAcademic.length) {
            obj.branch = this.bookObj.bookAcademic[0].branch;
            obj.course = this.bookObj.bookAcademic[0].course;
            obj.sem = this.bookObj.bookAcademic[0].sem;
            obj.year = this.bookObj.bookAcademic[0].year;
        }
        var imgarr = []
        this.bookObj.bookImages.forEach(element => {
            imgarr.push(element.image.data);
        });
        var bookinfo = {
            bookObj: obj,
            imageArr: imgarr
        }
        this.postBookDataService.setBookInfo(bookinfo);
        this.postBookDataService.setIsUpdatePage(true);
        this.viewCtrl.dismiss();
        this.homePageService.setPage(PostbookPage);
    }

    call() {
        if (this.bookObj && this.bookObj.bookContact[0] && this.bookObj.bookContact[0].phoneNo) {
            var phone = this.bookObj.bookContact[0].phoneNo;
            this.callSvc.callNumber(phone, true).then(() => {
                console.log('call working')
            }).catch((err) => {
                // alert(JSON.stringify(err))
                console.log('error making call');
            });
        }
    }

    share() {
        this.socialSharing.share('Body', 'Subject', '', 'www.bmb.com').then(() => {
            console.log('Share')
        }).catch((err) => {
            // alert(JSON.stringify(err))
            console.log('error sharing book');
        });
    }

    sendEmail() {
        // Check if sharing via email is supported
        var emailTo = "test@gmail.com";
        this.socialSharing.canShareViaEmail().then(() => {
            this.socialSharing.shareViaEmail('Body', 'Subject', [emailTo]).then(() => {
                console.log('email working')
            }).catch((err) => {
                // alert(JSON.stringify(err))
                console.log('error sending email');
            });
        }).catch((err) => {
            // alert(JSON.stringify(err))
            console.log('error sending email');
        });
    }

    sendWhatsAppMsg() {
        if (this.bookObj && this.bookObj.bookContact[0] && this.bookObj.bookContact[0].phoneNo) {
            var phone = this.bookObj.bookContact[0].phoneNo;
            var msg = "Hi, I am interested in buying this Book.";
            msg = msg + "Book Name:" + this.bookObj.name + '';
            msg = msg + "Book Price:" + this.bookObj.price + '';
            msg = msg + "Please let me know where and how can I collect it.";
            msg = msg + "-Thanks";
            this.socialSharing.shareViaWhatsAppToReceiver('+91' + phone, msg, '../src/assets/imgs/BMB.PNG', "www.bmb.com").then(() => {
                console.log('success!')
            }).catch((err) => {
                // alert(JSON.stringify(err))
                console.log('error sending whatsapp message');
            });
        }
    }

}
