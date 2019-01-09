import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BooksinfoPageService {
    private booksList: any;
    private tempBooksList: any;
    
    booksListChange: Subject<any> = new Subject<any>();

    constructor() {
        this.booksListChange.subscribe((value) => {
            this.booksList = value;
        });
    }

    setBooksList(data) {
        this.tempBooksList = data;
        this.booksListChange.next(data);
    }

    addBooksList(data) {
        if (this.tempBooksList) {
            data.forEach(element => {
               this.booksList.push(element);
               this.tempBooksList.push(element);
            });
        } 
        this.booksListChange.next(this.booksList);
    }

    getBooksList() {
        return this.booksList;
    }

    filterItems(ev: any) {
        this.booksList = this.tempBooksList;
        let val = ev.target.value;
        if (val && val.trim() != '') {
          this.booksList = this.booksList.filter((item) => {
            return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
        }
        this.booksListChange.next(this.booksList);
        
      }
}
