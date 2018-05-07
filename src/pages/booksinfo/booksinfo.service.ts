import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BooksinfoPageService {
   private booksList : any;

   booksListChange: Subject<any> = new Subject<any>();

   constructor(){
       this.booksListChange.subscribe((value)=> {
              this.booksList = value;
       });
   }

   setBooksList(page){
       this.booksListChange.next(page);
   }

   getBooksList(){
       return this.booksList;
   }
}
