import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { ProductHelpService } from './../core/service/helpwithproduct.service';
import { Injectable } from '@angular/core';
import { ActiveCartService, MultiCartService } from '@spartacus/core';

@Injectable({
  providedIn: 'root'
})
export class SharedMethodsService {

  constructor(
    public activeCartService: ActiveCartService,
    public multiCartService: MultiCartService,
    private productHelpService: ProductHelpService,
    private commonService: CommonService) { }

  addAllProductsToCArt(productlist: any) {
    this.commonService.show();
    let selectedProducts: any = [];
    // console.log("Product List:", JSON.stringify(productlist));
    productlist.forEach(element => {
        const productObj = {
          productCode: element.product.code,
          quantity: element.quantity != undefined ? element.quantity : 1
        }
        // this.activeCartService.addEntry(element.product.code, element.quantity);
        selectedProducts.push(productObj);
        if(!window.location.href.includes('/mylist')) {
          (<any>window).dataLayer.push({
            'event':'ALTC ClicK',
            'eventCategory':'Add List To Cart',
            'eventAction':'Add List To Cart'
          });
        }
      });
      this.activeCartService.getActiveCartId().subscribe(data => {
      let obj = {
        "cardId": data,
        "carts": selectedProducts
      }
      this.productHelpService.addAllToCart(obj).subscribe(data => {
        if(data)  {
          this.multiCartService.reloadCart(data);
          this.activeCartService.isStable().subscribe((data) => {
            if (data) {
              this.commonService.hide();
            }
          })
        }
      })
    });

      // this.activeCartService.getActiveCartId().subscribe((data) => {
      //   this.multiCartService.addEntries("current", data, selectedProducts);
      // });
  }

  addAllProductsToRequestQuote(productlist: any) {
    this.commonService.show();
    let selectedProducts: any = [];
    // console.log("Product List:", JSON.stringify(productlist));
    productlist.forEach(element => {
      
        const productObj = {
          productCode: element.product.code,
          quantity: element.quantity != undefined ? element.quantity : 1
        }
        // this.activeCartService.addEntry(element.product.code, element.quantity);
        selectedProducts.push(productObj);

        (<any>window).dataLayer.push({
          'event':'Quick Order ATC ClicK',
          'eventCategory':'Quick Order ATC',
          'eventAction':'Quick Order ATC'
        });
      
      });

      
      // this.activeCartService.getActiveCartId().subscribe(data => {
      // let obj = {
      //   "jobRefNum": 'w31',
      //   "comments": 'new comment',
      //   "products": selectedProducts
      // }
      // this.productHelpService.addProductsToQuote(obj).subscribe(data => {
      //   if(data)  {
      //     this.multiCartService.reloadCart(data);
      //     this.activeCartService.isStable().subscribe((data) => {
      //       if (data) {
      //         this.commonService.hide();
      //       }
      //     })
      //   }
      // })
    // });

      // this.activeCartService.getActiveCartId().subscribe((data) => {
      //   this.multiCartService.addEntries("current", data, selectedProducts);
      // });
  }
}
