import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'search'})
export class SearchPipe implements PipeTransform {

  transform(items: any[], input: string): any {
    if(items !== undefined && input !== undefined) {
      try {
        return items.filter(item => new RegExp(input, "i").test(item.title));
      } catch(e) {
        return [];
      }
    }
    return items;
  }

}
