import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class BooksInfoApi {

    constructor(private http: Http) { }
    private booksinfoUrl = 'https://floating-cliffs-67240.herokuapp.com/booksinfo';
    private updateBookUrl = 'https://floating-cliffs-67240.herokuapp.com/updateBookStatus';


    getData(configObj) {
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        // var obj= {offset: offset, limit: limit};
        return this.http.post(this.booksinfoUrl, JSON.stringify(configObj), options)
            .map(response => {
                return response.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getPostsById(uid) {
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.booksinfoUrl + "/" + uid, options)
            .map(response => {
                return response.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    updateBookStatus(obj) {
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.updateBookUrl, JSON.stringify(obj), options)
            .map(response => {
                return response.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}
