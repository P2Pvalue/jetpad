import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'myOrder'})
export class OrderPipe implements PipeTransform {

  public transform(items: any[], input: string): any {
    if (items !== undefined && input !== undefined) {
      try {
        return this.sortByKey(items, input);
      } catch (e) {
        return [];
      }
    }
    return items;
  }

  public sortByKey(array, key) {
    return array.sort((a, b) => {
      let x = a[key]; let y = b[key];
      if (key === 'timestamp') {
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
      } else {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      }
    });
  }
}
