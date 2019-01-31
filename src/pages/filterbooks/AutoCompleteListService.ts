import { AutoCompleteService } from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map'

@Injectable()
export class AutoCompleteListService implements AutoCompleteService {
  labelAttribute = "collegeList";

  constructor(private http: Http) {

  }
  getResults(keyword: string) {
    return this.http.get("../../assets/json/engineeringColleges.json")
      .map(
        result => {
          var obj = result.json();
          return obj[0].collegeList
            .filter(item => item.toLowerCase().startsWith(keyword.toLowerCase()))
        });
  }
}