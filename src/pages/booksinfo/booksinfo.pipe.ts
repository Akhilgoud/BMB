import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'daysago' })
export class DaysagoPipe implements PipeTransform {
  transform(value: Date): any {
    var curDate = new Date();
    var bookDate = new Date(value);
    var diff = Math.abs(bookDate.getTime() - curDate.getTime());
    var diffDays = Math.ceil(diff / (86400000));
    if (diffDays > 1)
      return diffDays + " days ago";
    else
      return "Today";
  }
}