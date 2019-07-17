import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IBookObj } from "./postbook.model";

@Injectable()
export class PostBookDataService {
    private postBookObj: any = null;
    private isUpdatePage: boolean = false;
    private lookupData: any = null;

    setBookInfo(obj) {
        this.postBookObj = obj;
    }

    getPostBookObj() {
        return this.postBookObj;
    }

    setIsUpdatePage(val) {
        this.isUpdatePage = val;
    }

    getIsUpdatePage() {
        return this.isUpdatePage;
    }

    setLookupData(val) {
        this.lookupData = val;
    }

    getLookupData() {
        return this.lookupData;
    }
}