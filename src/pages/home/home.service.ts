import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HomePageService {
   private rootpage : any;
   private previousPage: any;
   rootpageChange: Subject<any> = new Subject<any>();

   constructor(){
       this.rootpageChange.subscribe((value)=> {
              this.rootpage = value;
       });
   }

   setPage(page){
       this.previousPage = this.rootpage ? this.rootpage : null;
       this.rootpageChange.next(page);
   }

   getPreviousPage(){
       return this.previousPage;
   }
}
