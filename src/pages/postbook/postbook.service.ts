import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { SERVER_URL } from '../../shared/Constants';


@Injectable()
export class PostbookApi {

  constructor(private http: Http) { }
  private postbookUrl = SERVER_URL + '/postbook';
  private updateBookUrl = SERVER_URL + '/updateBookInfo';
  private baseUrl = SERVER_URL;



  postNewBook(obj) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.postbookUrl, JSON.stringify(obj), options)
      .map(response => {
        return response.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateBookInfo(obj) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.updateBookUrl, JSON.stringify(obj), options)
      .map(response => {
        return response.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getData() {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.postbookUrl, options)
      .map(response => {
        return response.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getLookupData() {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.baseUrl + '/lookupData', options)
      .map(response => {
        return response.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getBookdataFromBarCode(isbn) {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn)
      .map(response => {
        return response.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Api Error'));
  }
}
