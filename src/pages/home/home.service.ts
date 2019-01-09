import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HomePageService {
   private rootpage : any;
   private previousPage: any;
   private pageTitle : any;
   rootpageChange: Subject<any> = new Subject<any>();
   pageTitleChange: Subject<any> = new Subject<any>();
   

   constructor(){
       this.rootpageChange.subscribe((value)=> {
              this.rootpage = value;
       });

       this.pageTitleChange.subscribe((title) =>{
           this.pageTitle = title;
       })

   }

   setPage(page){
       this.previousPage = this.rootpage ? this.rootpage : null;
       this.rootpageChange.next(page);
   }
   
   setPageTitle(title){
    this.pageTitleChange.next(title);
   }

   getPreviousPage(){
       return this.previousPage;
   }
}
