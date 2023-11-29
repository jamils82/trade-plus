import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {

  transform(value: any ): any {
    let val: any = parseFloat(value).toFixed(2);
    if (/\-/g.test(val)) {
      let isMinus = val.split('-')[1];
      let valReturn = '-$' + parseFloat(isMinus).toLocaleString(undefined, { minimumFractionDigits: 2 });
      return valReturn;
    } else {
      let valReturn = '$' + parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 });
      return valReturn;
    }
  }

}
