import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-custom-orderconfirmation',
  templateUrl: './custom-orderconfirmation.component.html',
  styleUrls: ['./custom-orderconfirmation.component.scss'],
})
export class CustomOrderConfirmationComponent implements OnInit {
  userActivity: any;
  mode: string;
  constructor(public router: Router, public route: ActivatedRoute) {
    this.setTimeout();
    this.mode = (this.route.queryParams as any).value.isDelivery;
  }

  ngOnInit(): void {
    let chartData = localStorage.getItem('cart-data');
    chartData = chartData ? JSON.parse(chartData) : null;
    if (chartData) {
      this.updateDataLayer(chartData);
      // let totalGAdeliveryData = JSON.parse(localStorage.getItem('cart-data'));
      this.updateGAFourDataLayer(chartData);
    }
  }

  updateDataLayer(data: any) {
    let tempdata = [];
    console.log("confirmation data tt", data)
    let totaldeliveryData = JSON.parse(localStorage.getItem('cart-data'));
    console.log("totaldeliveryData tt", totaldeliveryData)
    totaldeliveryData.entries.forEach((val) => {
      tempdata.push({
        // List of productFieldObjects.
        item_name: val?.product?.name, // Name
        item_id: val?.product?.code, //SKU ID
        price: val?.product?.price?.value,
        item_brand: val?.product?.brand, //brand of product
       // category: val?.product?.categories[0]?.name, //category of product
        variant: '', //variant if any else undefined without quotes
        'item_category': val?.product?.tlCategories[0]?.name,
        'item_category_2': val?.product?.tlCategories[1]?.name,
        'item_category_3': val?.product?.categories[0]?.name,
        'item_variant': '', // If Variant Exists else left blank
        quantity: val.quantity.toString(),
        'item_totalQuantity': val.quantity.toString(),
        'item_stock': val.product.stock.stockLevelStatus,
       // 'added_from': 'PDP',
       // 'item_list_name': 'PDP'
      });
    });
    let tempBLData = [];
    data.entries.forEach((val) => {
      tempBLData.push({
        // List of productFieldObjects.
        name: val.product.name, // Name
        product_id: val.product.code, //SKU ID
        price: val.product.price.value.toString(),
        sku: '', //sku of product
        quantity: val.quantity.toString(),
      });
    });
    let productDL = {
      event: 'eec.purchase',
      'step': 5,
      'jobReference': this.mode == 'true'
      ? localStorage.getItem('orderRefDel')
      : localStorage.getItem('orderRefCC'),
      'receiveDate': localStorage.getItem('requestedDate'),
      'receiveTime': localStorage.getItem('requestedTime'),
      'deliveryRegion': '', // this.mode == 'true' ? totaldeliveryData.deliveryAddress.town : '', // For Deliveries only else leave blank
      'deliveryPostcode': this.mode == 'true' ? totaldeliveryData.deliveryAddress.postalCode : '', // For Deliveries only else leave blank
      'userId': 'auth0 | guid',
      'accountId': localStorage.getItem('selectedIUID'),
      ecommerce: {
        purchase: {
          actionField: {
            id: localStorage.getItem('orderId'), // Transaction ID. Required for purchases and refunds.
            revenue: data.totalPriceWithTax.value.toString(), // Total transaction value (incl. tax and shipping)
            tax: data.totalTax.value.toString(), //only tax amount
           // shipping: '', //only shipping charges
            coupon: '', //If not available send undefined without quotes
          },
          products: tempdata,
          bldata: {Items: tempBLData }
        },
      },
    };
    // For Google analytics
    (<any>window).dataLayer = (<any>window).dataLayer || [];
   // (<any>window).dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    (<any>window).dataLayer.push(productDL);
    (<any>window).dataLayer.push({
      event: 'Order Fulfillment',
      eventCategory: 'Fulfillment',
      isConversion: '1',
      eventAction: this.mode == 'false' ? 'Click & Collect' : 'Delivery', //Pass the respective Delivery Method
    });
  }

  // DataLayer method for GA4
  updateGAFourDataLayer(confirmationData) {
    let GAtempdata = [];
    console.log("GA4 confirmation data tt", confirmationData);
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    var userEmail = userInfo.email.split("@");
    console.log("userInfo tt", userInfo.email)
    confirmationData.entries.forEach((val) => {
      GAtempdata.push({
        // List of productFieldObjects.
        item_name: val?.product?.name, // Name
        item_id: val?.product?.code, //SKU ID
        price: val?.product?.price?.value,
        item_brand: val?.product?.brand, //brand of product
        'item_category': val?.product?.tlCategories[0]?.name,
        'item_category_2': val?.product?.tlCategories[1]?.name,
        'item_category_3': val?.product?.categories[0]?.name,
        quantity: val.quantity.toString(),
        'item_variant': '', // If Variant Exists else left blank
        'item_totalQuantity': val.quantity.toString(),
        'item_stock': val.product.stock.stockLevelStatus,
      });
    });

    let productDL = {
      event: 'purchase',
      'step': 5,
     'step_label': 'orderConfirmationPage',
      'feature_type': 'checkout flow',
      'fulfillment': this.mode == 'false' ? 'Click & Collect' : 'Delivery', //Delivery, Pickup, Courier,
      'jobReference': this.mode == 'true'
      ? localStorage.getItem('orderRefDel')
      : localStorage.getItem('orderRefCC'),
      'receiveDate': localStorage.getItem('requestedDate'),
      'receiveTime': localStorage.getItem('requestedTime'),
      'deliveryRegion': '', // this.mode == 'true' ? confirmationData.deliveryAddress.town : '', // For Deliveries only else leave blank
      'deliveryPostcode': this.mode == 'true' ? confirmationData.deliveryAddress.postalCode : '', // For Deliveries only else leave blank
      'u1': userEmail[0],
      'u2': '@'+userEmail[1],
      'u3': confirmationData?.micoU3GTM,
      'loginStatus': 'login',
      'userId': 'auth0 | guid',
      'accountId': localStorage.getItem('selectedIUID'),
      ecommerce: {
        purchase: {
          'transaction_id': localStorage.getItem('orderId'), //Transaction ID
          'value': confirmationData.totalPriceWithTax.value, // Revenue after discount
          'tax': confirmationData.totalTax.value,
        //  'shipping': '',
          'currency':'AUD',
          items: GAtempdata,
        },
      },
    };
    // For GA4 analytics
    (<any>window).dataLayer.push(productDL);
    (<any>window).dataLayer = (<any>window).dataLayer || [];
   // (<any>window).dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    
    // (<any>window).dataLayer.push({
    //   event: 'Order Fulfillment',
    //   eventCategory: 'Fulfillment',
    //   isConversion: '1',
    //   eventAction: this.mode == 'false' ? 'Click & Collect' : 'Delivery', //Pass the respective Delivery Method
    // });
  }

  setTimeout() {
    this.userActivity = setTimeout(() => {
      clearTimeout(this.userActivity);
      this.router.navigateByUrl('/');
    }, 5000);
  }

  ngOnDestroy() {
    localStorage.removeItem('requestedDate');
    localStorage.removeItem('requestedTime');
    localStorage.removeItem('cart-data');
    localStorage.removeItem('isManual');
  }
}
