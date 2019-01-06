import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BooksinfoPageService {
    private booksList: any;

    booksListChange: Subject<any> = new Subject<any>();

    constructor() {
        this.booksListChange.subscribe((value) => {
            this.booksList = value;
        });
    }

    setBooksList(data) {
        this.booksListChange.next(data);
    }

    addBooksList(data) {
        if (this.booksList) {
            data.forEach(element => {
               this.booksList.push(element);
            });
        } 
        this.booksListChange.next(this.booksList);
    }

    getBooksList() {
        return this.booksList;
    }
}
