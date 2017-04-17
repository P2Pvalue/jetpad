import { Pipe, PipeTransform } from '@angular/core';
import * as Moment from "moment";

@Pipe({name: 'moment'})
export class MomentPipe implements PipeTransform {

  transform(timestamp: string): any {
    return Moment(timestamp).fromNow();
  }
}
