import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appOutsideClick]'
})
export class OutsideClickDirective {

  @Output() clickOutside = new EventEmitter<void>();
  
  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const dropdown = this.element.nativeElement;
    const clickedInside = dropdown.contains(target) || dropdown.previousSibling.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }

  constructor(private element: ElementRef) { }



}
