import { Pipe, PipeTransform } from '@angular/core';
import * as Moment from 'moment';

@Pipe({name: 'myMoment'})
export class MomentPipe implements PipeTransform {

  public transform(timestamp: string): any {
    return Moment(timestamp).fromNow();
  }
}
