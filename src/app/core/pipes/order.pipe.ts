import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'order'})
export class OrderPipe implements PipeTransform {

  transform(items: any[], input: string): any {
    if(items !== undefined && input !== undefined) {
      try {
        return this.sortByKey(items, input);
      } catch(e) {
        return [];
      }
    }
    return items;
  }

  sortByKey(array, key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      if(key === "timestamp") {
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
      } else {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      }
    });
  }
}
