import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserInfoService } from '../../shared/shared';
import { HomePageService } from '../home/home.service';
import { PostbookPage } from "../postbook/postbook";
import { PostBookDataService } from "../postbook/postbookdata.service";
import { LoginPage } from "../login/login";
import { BooksinfoPageService } from '../booksinfo/booksinfo.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


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
    showSellerInfo: boolean = false;
    bookURL = "https://play.google.com/store/apps/details?id=com.TAGIdeas.BMB";

    constructor(public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public userInfoService: UserInfoService,
        public homePageService: HomePageService,
        public postBookDataService: PostBookDataService,
        public booksinfoPageService: BooksinfoPageService,
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
            else if (this.showSellerInfo) {
                this.showSellerInfo = false;
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

    sellerDetails() {
        if (!this.userInfo || !this.userInfo.uid) {
            this.showSellerInfo = false;
            this.viewCtrl.dismiss();
            this.booksinfoPageService.setLastOpenedBook(this.bookObj);
            this.homePageService.setPage(LoginPage);
        } else {
            this.showSellerInfo = true
        }
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
        this.socialSharing.share(this.getShareMessageBody(), 'Buy my book ' + this.bookObj.name, '', this.bookURL).then(() => {
            console.log('Share')
        }).catch((err) => {
            console.log('error sharing book');
        });
    }

    sendEmail() {
        // Check if sharing via email is supported
        let emailTo = this.bookObj.bookContact[0].email;
        this.socialSharing.canShareViaEmail().then(() => {
            this.socialSharing.shareViaEmail(this.getMessageBody(), 'Interested in buying ' + this.bookObj.name, [emailTo]).then(() => {
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
            let img = this.bookObj.bookImages[0] ? ('data:image/png;base64,' + this.bookObj.bookImages[0].image.data) : null;
            console.log(this.bookObj.bookImages)
            this.socialSharing.shareViaWhatsAppToReceiver('+91' + phone, this.getMessageBody(), img, null).then(() => {
                console.log('success!')
            }).catch((err) => {
                // alert(JSON.stringify(err))
                console.log('error sending whatsapp message');
            });
        }
    }

    // onSegmentChange(ev: any) {
    //     if (ev.value == "sellerInfo" && (!this.userInfo || !this.userInfo.uid)) {
    //         this.viewCtrl.dismiss();
    //         this.homePageService.setPage(LoginPage);
    //     }
    // }

    getMessageBody() {
        var msg = "Hi, " + this.bookObj.bookContact[0].userName + "\n";
        msg = msg + "I am interested in buying this Book. \n";
        msg = msg + "Book Name: " + this.bookObj.name + ' \n';
        msg = msg + "Book Price: " + (this.bookObj.price == 0 ? 'FREE' : this.bookObj.price) + '\n';
        this.bookObj.price = 0
            ? msg = msg + "Thank you for giving it for free." + '\n'
            : ""
        msg = msg + "Please let me know where and how can I collect it." + '\n';
        msg = msg + "Thanks\n";
        msg = msg + "- " + this.userInfo.name + "\n";
        return msg;
    }

    getShareMessageBody() {
        var msg = "Hi, Found a great book in Buy My Book app. \n";
        msg = msg + "Book Name: " + this.bookObj.name + ' \n';
        msg = msg + "Book Price: " + (this.bookObj.price == 0 ? 'FREE' : this.bookObj.price) + '\n';
        msg = msg + "Do check it out.\n";
        msg = msg + "\n";
        msg = msg + "Get it from: ";
        return msg;
    }
}
