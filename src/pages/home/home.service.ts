import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HomePageService {
   private rootpage : any;

   rootpageChange: Subject<any> = new Subject<any>();

   constructor(){
       this.rootpageChange.subscribe((value)=> {
              this.rootpage = value;
       });
   }

   setPage(page){
       this.rootpageChange.next(page);
   }
}
