import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'daysago' })
export class DaysagoPipe implements PipeTransform {
  transform(value: Date): any {
    var curDate = new Date();
    curDate.setHours(0, 0, 0, 0)
    var bookDate = new Date(value);
    bookDate.setHours(0, 0, 0, 0)
    var diff = Math.abs(bookDate.getTime() - curDate.getTime());
    var diffDays = Math.ceil(diff / (86400000));
    if (diffDays > 0)
      return diffDays + " days ago";
    else
      return "Today";
  }
}