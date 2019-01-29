import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FilterBooksService {
    private filterObj: any = {
        isAcademic: "",
        bookType: [],
        course: "",
        branch: "",
        year: "",
        price: {
            lower: 0,
            upper: 2000
        },
        college: "",
        address: ""
    };


    filterObjChange: Subject<any> = new Subject<any>();

    constructor() {
        this.filterObjChange.subscribe((value) => {
            this.filterObj = value;
        });
    }

    setFilterObj(data) {
        this.filterObjChange.next(data);
    }

    getFilterObj() {
        return this.filterObj;
    }

    resetFilterObj() {
        this.filterObj = {
            isAcademic: "",
            bookType: [],
            course: "",
            branch: "",
            year: "",
            price: {
                lower: 0,
                upper: 2000
            },
            college: "",
            address: ""
        };
    }

}
