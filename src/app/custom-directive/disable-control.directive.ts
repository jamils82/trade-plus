import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '([formControlName], [formControl])[disabledControl]'
})
export class DisableControlDirective {


@Input() disableControl;
ngOnChanges(changes) {
   if (changes['disableControl']) {
     const action = this.disableControl ? 'disable' : 'enable';
     this.ngControl.control[action]();
   }
 }
  constructor(private ngControl : NgControl) { }

}
