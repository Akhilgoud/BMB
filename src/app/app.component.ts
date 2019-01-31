import { Component } from '@angular/core';
import { Platform, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage, SidenavPage } from '../pages/pages';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = SidenavPage;

  constructor(private platform: Platform, app: App, private alertCtrl: AlertController, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      //   var notificationOpenedCallback = function(jsonData) {
      //     console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      //   };

      //   window["plugins"].OneSignal
      //     .startInit("8a936468-7b45-4af4-a20c-c466c04b17a4", "420714648564")
      //     .handleNotificationOpened(notificationOpenedCallback)
      //     .endInit();
      // });
    });

    //     platform.registerBackButtonAction(() => {

    //       let nav = app.getActiveNavs()[0];
    //       let activeView = nav.getActive();                

    //       if(activeView.name === "FirstPage") {

    //           if (nav.canGoBack()){ //Can we go back?
    //               nav.pop();
    //           } else {
    //               const alert = this.alertCtrl.create({
    //                   title: 'App termination',
    //                   message: 'Do you want to close the app?',
    //                   buttons: [{
    //                       text: 'Cancel',
    //                       role: 'cancel',
    //                       handler: () => {
    //                           console.log('Application exit prevented!');
    //                       }
    //                   },{
    //                       text: 'Close App',
    //                       handler: () => {
    //                           this.platform.exitApp(); // Close this application
    //                       }
    //                   }]
    //               });
    //               alert.present();
    //           }
    //       }
    //   });
  }


}

