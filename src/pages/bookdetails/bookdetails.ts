import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserInfoService } from '../../shared/shared';
import { HomePageService } from '../home/home.service';
import { PostbookPage } from "../postbook/postbook";
import { PostBookDataService } from "../postbook/postbookdata.service";
import { LoginPage } from "../login/login";

@Component({
    selector: 'page-bookdetails',
    templateUrl: 'bookdetails.html',
})
export class BookdetailsPage {
    bookObj: any
    showImgSlide: boolean = false;
    tabInfo = 'bookInfo';
    allowEdit: boolean = false;
    userInfo = this.userInfoService.getUserInfo();
    deregisterFunction: any;
    showBuyOptionsFlag: boolean = false;

    constructor(public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public userInfoService: UserInfoService,
        public homePageService: HomePageService,
        public postBookDataService: PostBookDataService,
        public viewCtrl: ViewController,
        private callSvc: CallNumber,
        private socialSharing: SocialSharing) {

        // this.platform.registerBackButtonAction(() => {
        //     if (this.showImgSlide) {
        //         this.showImgSlide = false;
        //     } else {
        //         this.viewCtrl.dismiss();
        //     }
        // });
        this.deregisterFunction = this.platform.registerBackButtonAction(() => {
            if (this.showImgSlide) {
                this.showImgSlide = false;
            }
            else {
                this.viewCtrl.dismiss();
            }
        });


        console.log(navParams.get('bookObj'));
        this.allowEdit = false;
        this.bookObj = navParams.get('bookObj');
        if (this.userInfo && this.bookObj.uid == this.userInfo.uid) {
            this.allowEdit = true;
        }

    }

    ionViewWillLeave() {
        this.deregisterFunction();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BookdetailsPage');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
    showBuyOptions(){
     this.showBuyOptionsFlag = true;
    }
   closeBuyOptions(){
     this.showBuyOptionsFlag = false;
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
            obj.subcourse = this.bookObj.bookAcademic[0].subcourse;
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
            let phone = this.bookObj.bookContact[0].phoneNo;
            this.callSvc.callNumber(phone, true).then(() => {
                console.log('call working')
            }).catch((err) => {
                // alert(JSON.stringify(err))
                console.log('error making call');
            });
        }
    }

    share() {
        this.socialSharing.share(this.getMessageBody(), 'Interested to buy ' + this.bookObj.name, '', 'BMB').then(() => {
            console.log('Share')
        }).catch((err) => {
            console.log('error sharing book');
        });
    }

    sendEmail() {
        // Check if sharing via email is supported
        let emailTo = this.bookObj.bookContact[0].email;
        this.socialSharing.canShareViaEmail().then(() => {
            this.socialSharing.shareViaEmail(this.getMessageBody(), 'Interested to buy ' + this.bookObj.name, [emailTo]).then(() => {
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
            let phone = this.bookObj.bookContact[0].phoneNo;
            let img = this.bookObj.bookImages ? this.bookObj.bookImages.image : null;
            console.log(this.bookObj.bookImages)
            this.socialSharing.shareViaWhatsAppToReceiver('+91' + phone, this.getMessageBody(), img, "BMB").then(() => {
                console.log('success!')
            }).catch((err) => {
                // alert(JSON.stringify(err))
                console.log('error sending whatsapp message');
            });
        }
    }

    onSegmentChange(ev: any) {
        if (ev.value == "sellerInfo" && (!this.userInfo || !this.userInfo.uid)) {
            this.viewCtrl.dismiss();
            this.homePageService.setPage(LoginPage);
        }
    }

    getMessageBody() {
        var msg = "Hi, I am interested in buying this Book. ";
        msg = msg + "Book Name: " + this.bookObj.name + ' ';
        msg = msg + "Book Price: " + this.bookObj.price + '. ';
        msg = msg + "Please let me know where and how can I collect it.";
        msg = msg + "-Thanks";
        return msg;
    }
}
