import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class UserProfileApi {

    constructor(private http: Http) { }
    private updateProfileUrl = 'https://floating-cliffs-67240.herokuapp.com/updateProfile';

    updateProfile(obj) {
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.updateProfileUrl, JSON.stringify(obj), options)
            .map(response => {
                return response.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}
