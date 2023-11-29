import { ChangeDetectorRef, Component, ElementRef, Input, isDevMode, OnInit, TemplateRef } from '@angular/core';
import { CarouselService, ICON_TYPE } from '@spartacus/storefront';
import { interval, Observable, Subscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-carousel-detail',
  templateUrl: './carousel-detail.component.html',
  styleUrls: ['./carousel-detail.component.scss']
})
export class CarouselDetailComponent implements OnInit {

  
  /**
   * The title is rendered as the carousel heading.
   */
   @Input() title: string;

   /**
    * The items$ represent the carousel items. The items$ are
    * observables so that the items can be loaded on demand.
    */
   items: Observable<any>[];
   @Input('items')
   set setItems(inputItems: Observable<any>[]) {
     this.items = inputItems;
     //Reset slider when changing products
     this.activeSlide = 0;
   }
 
   /**
    * The template is rendered for each item, so that the actual
    * view can be given by the compoent that uses the `CarouselComponent`.
    */
   @Input() template: TemplateRef<any>;
 
   /**
    * Specifies the minimum size of the carousel item, either in px or %.
    * This value is used for the calculation of numbers per carousel, so that
    * the number of carousel items is dynamic. The calculation uses the `itemWidth`
    * and the host element `clientWidth`, so that the carousel is reusable in
    * different layouts (for example in a 50% grid).
    */
   @Input() itemWidth = '300px';
 
   /**
    * Indicates whether the visual indicators are used.
    */
   @Input() hideIndicators = false;
 
   @Input() indicatorIcon = ICON_TYPE.CIRCLE;
   @Input() previousIcon = ICON_TYPE.CARET_LEFT;
   @Input() nextIcon = ICON_TYPE.CARET_RIGHT;
 
   activeSlide: number;
   size$: Observable<number>;
   subscription = new Subscription;
   constructor(protected el: ElementRef, protected service: CarouselService, protected ref: ChangeDetectorRef) {}
 
   ngOnInit() {
     if (!this.template && isDevMode()) {
       console.error(
         'No template reference provided to render the carousel items for the `cx-carousel`'
       );
       return;
     }
     this.size$ = this.service
       .getItemsPerSlide(this.el.nativeElement, this.itemWidth)
       .pipe(tap(() => (this.activeSlide = 0)));
    this.subscription = this.size$
      .pipe(
        take(1),
        switchMap((size) =>
          interval(5000).pipe(
            tap(() => {
              this.activeSlide =
                this.activeSlide > this.items.length - size - 1
                  ? 0
                  : this.activeSlide + size;
              this.ref.markForCheck();
            })
          )
        )
      )
      .subscribe();
   }
 
   
   getSlideNumber(size: number, currentIndex: number): number {
     let normalizedCurrentIndex = currentIndex + 1;
     return Math.ceil(normalizedCurrentIndex / size);
   }
   ngOnDestroy() { this.subscription.unsubscribe(); }
}
