import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import {UserDbProvider} from '../providers/userdatabase';
import { HomePage, SidenavPage, PostbookPage, BooksinfoPage, LoginPage, BookdetailsPage, MypostsPage } from '../pages/pages';
import { HomePageService } from '../pages/home/home.service';
import {BooksinfoPageService} from '../pages/booksinfo/booksinfo.service';
import { PostbookApi } from '../pages/postbook/postbook.service';
import { LoginApi } from '../pages/login/login.service';
import { UserInfoService, BooksInfoApi } from '../shared/shared';
import { DaysagoPipe } from '../pages/booksinfo/booksinfo.pipe';
import { PostBookDataService } from '../pages/postbook/postbookdata.service';
import { SQLite } from '@ionic-native/sqlite';
import {CallNumber} from '@ionic-native/call-number';
import {SocialSharing} from '@ionic-native/social-sharing';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SidenavPage,
    PostbookPage,
    BooksinfoPage,
    LoginPage,
    BookdetailsPage,
    DaysagoPipe,
    MypostsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SidenavPage,
    PostbookPage,
    BooksinfoPage,
    LoginPage,
    BookdetailsPage,
    MypostsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    UserDbProvider,
    PostbookApi,
    LoginApi,
    HomePageService,
    BooksinfoPageService,
    UserInfoService,
    BooksInfoApi,
    PostBookDataService,
    SQLite,
    CallNumber,
    SocialSharing,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule { }
