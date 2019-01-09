import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController  } from 'ionic-angular';


@Component({
  selector: 'filter-books',
  templateUrl: 'filterbooks.html',
})
export class FilterBooks {
 
structure: any = { lower: 0, upper: 10000 };

priceRange = 0;
constructor(private navParams: NavParams) {

}

ngOnInit() {
}


}
