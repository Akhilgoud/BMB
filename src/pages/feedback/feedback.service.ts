import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { SERVER_URL } from '../../shared/Constants';

@Injectable()
export class FeedbackApi {

    constructor(private http: Http) { }
    private feedbackUrl = SERVER_URL + '/feedback';

    postFeedback(obj) {
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.feedbackUrl, JSON.stringify(obj), options)
            .map(response => {
                return response.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}
