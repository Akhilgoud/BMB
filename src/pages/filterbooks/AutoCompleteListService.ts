import { AutoCompleteService } from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Rx';

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
  getAddress(keyword: string) {
    return this.http.get("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&outFields=Match_addr,Addr_type&sourceCountry='IND'&maxLocations=10&singleLine=" + keyword)
      .map(
        result => {
          return result.json();
        }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  collegeAutoComplete(keyword: string) {
    return this.http.get("https://floating-cliffs-67240.herokuapp.com/collegeAutoComplete/" + keyword)
      .map(
        result => {
          return result.json();
        }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}