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
        this.tempBooksList = [...data];
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
        this.booksList = [...this.tempBooksList];
        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.booksList = this.booksList.filter((item) => {
                return (
                    (item.name ? item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.price ? item.price.toString().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.author ? item.author.toLowerCase().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.bookType ? item.bookType.toLowerCase().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.description ? item.description.toLowerCase().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.edition ? item.edition.toString().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.publisher ? item.publisher.toLowerCase().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.bookAcademic[0] && item.bookAcademic[0].branch ? item.bookAcademic[0].branch.toLowerCase().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.bookAcademic[0] && item.bookAcademic[0].course ? item.bookAcademic[0].course.toLowerCase().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.bookContact[0] && item.bookContact[0].address ? item.bookContact[0].address.toLowerCase().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.bookContact[0] && item.bookContact[0].landmark ? item.bookContact[0].landmark.toLowerCase().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.bookContact[0] && item.bookContact[0].college ? item.bookContact[0].college.toLowerCase().indexOf(val.toLowerCase()) > -1 : false) ||
                    (item.bookContact[0] && item.bookContact[0].pincode ? item.bookContact[0].pincode.toString().indexOf(val.toLowerCase()) > -1 : false)
                );
            });
        }
        this.booksListChange.next(this.booksList);

    }
}
