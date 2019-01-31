import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MyPostsPageService {
    private booksList: any;
    private tempBooksList: any;

    myBooksListChange: Subject<any> = new Subject<any>();

    constructor() {
        this.myBooksListChange.subscribe((value) => {
            this.booksList = value;
        });
    }

    setMyBooksList(data) {
        this.tempBooksList = [...data];
        this.myBooksListChange.next(data);
    }

    getMyBooksList() {
        return this.booksList;
    }

    filterItems(ev: any) {
        this.booksList = [...this.tempBooksList];
        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.booksList = this.booksList.filter((item) => {
                return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
        this.myBooksListChange.next(this.booksList);
    }
}
