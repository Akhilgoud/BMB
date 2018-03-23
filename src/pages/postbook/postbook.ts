import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PostbookApi} from './postbook.service';
import {IBookObj} from './postbook.model';

@Component({
  selector: 'page-postbook',
  templateUrl: 'postbook.html'
})
export class PostbookPage {
  public photos: any;
  public images: any;
  public base64Image: string;
  public error : any;
  public bookObj: IBookObj;
  postbookForm: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private sanitizer: DomSanitizer,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    public postbookApi: PostbookApi) {
  }

  ngOnInit() {
    this.photos = [];
    this.images = [];
    this.bookObj = new IBookObj();
    // this.getdata();
    this.bindForm();
  }
  
  bindForm() {
    this.postbookForm = this.formBuilder.group({
      bookname: ['', Validators.required],
      author: [''],
      publisher: [''],
      edition: [''],
      price: ['', Validators.required],
      description: [''],
      isAcademic: ['', Validators.required],
      course: [''],
      branch: [''],
      year: [''],
      sem: [''],
      phoneNo: [''],
      address: [''],
      landmark: [''],
      pincode: ['', Validators.required],
      college: ['']
    });
  }

  getdata(){
    this.postbookApi.getData().subscribe(
      response => {
        console.log(response);
        this.images = response;
      },
      error => {
        console.log("error authentication");
      }
    )
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this photo? There is NO undo!',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  takePhoto() {
    console.log("coming here");

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 450,
      targetHeight: 450,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);
        this.photos.reverse();
      },
      err => {
        console.log(err);
        this.error = err;
      }
    );
  }

  submit() {
    var obj = {
      bookObj:this.bookObj,
      imageArr:this.photos
    }
    this.postbookApi.postNewBook(obj).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log("error authentication" + error);
      }
    )
  }
}
