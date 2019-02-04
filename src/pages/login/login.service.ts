import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class LoginApi {

    constructor(private http: Http) { }
    private authorizeUrl = 'https://floating-cliffs-67240.herokuapp.com/login';
    private registerUrl = 'https://floating-cliffs-67240.herokuapp.com/register';

    RegisterUser(obj) {
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.registerUrl, JSON.stringify(obj), options)
            .map(response => {
               return response.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    authorizeUser(obj){
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        let options = new RequestOptions({ headers: headers});

        return this.http.post(this.authorizeUrl,JSON.stringify(obj), options)
            .map(response => {
                return response.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}
