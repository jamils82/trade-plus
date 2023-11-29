import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class GtmService {
    constructor(private http: HttpClient) { }
    location: any;

    getDeviceType() {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
      {
        return "Mobile";
      }
      else
      {
        return "Desktop";
      }
    }

    trackCreateQuote(quoteId,step) {
      window["dataLayer"] = window["dataLayer"] || [];
      if (step == 1) {
        window["dataLayer"].push({
          'event':'quote_create',
          'step':step,
          'step_label':'Quote Create Start',
          'location': this.location +', New Zealand',
          'device_type': this.getDeviceType,
          'userId':localStorage.getItem('userDigitId'),
          'accountId':localStorage.getItem('selectedTradeAccount'),
          'quoteId':quoteId
        });
      } else if (step == 2) {
        window["dataLayer"].push({
          'event':'quote_create',
          'step':step,
          'step_label':'Quote Create Complete',
          'location': this.location +', New Zealand',
          'device_type': this.getDeviceType,
          'userId':localStorage.getItem('userDigitId'),
          'accountId':localStorage.getItem('selectedTradeAccount'),
          'quoteId':quoteId
        });
      }
      this.clearDatalayerEvent('quote_create');
    }

  trackSendToCustomer(quoteData, step) {
    window["dataLayer"] = window["dataLayer"] || [];
    if(step == 1) {
      window["dataLayer"].push({
        'event': 'quote_send',
        'step': step,
        'step_label': 'Quote Send Start',
        'location': this.location +', New Zealand',
        'device_type': this.getDeviceType,
        'userId': localStorage.getItem('userDigitId'),
        'accountId': localStorage.getItem('selectedTradeAccount'),
        'quoteId': quoteData.code
      });
     } else if(step == 2) {
      window["dataLayer"].push({
        'event': 'quote_send',
        'step': step,
        'step_label': 'Quote Send Complete',
        'location': this.location +', New Zealand',
        'device_type': this.getDeviceType,
        'userId': localStorage.getItem('userDigitId'),
        'accountId': localStorage.getItem('selectedTradeAccount'),
        'quoteId': quoteData.code,
        'quote_total': quoteData.totalPrice.value,
        'quote_markup': quoteData.markupPrice.value,
        'quote_materials': quoteData.materialPrice.value,
        'quote_costs': quoteData.otherCostPrice.value,
        'quote_gst': quoteData.totalTax.value,
        'file_count': quoteData.docsCount,
        'image_count': quoteData.imageCount  
      });
      }
      this.clearDatalayerEvent('quote_send');
    }

    trackWonStatus(quoteData) {
      window["dataLayer"] = window["dataLayer"] || [];
      window["dataLayer"].push({
        'event': 'quote_won',
        'location': this.location +', New Zealand',        
        'device_type':  this.getDeviceType,    
        'userId': localStorage.getItem('userDigitId'),        
        'accountId': localStorage.getItem('selectedTradeAccount'),        
        'quoteId': quoteData.code,        
        'quote_total': quoteData.totalPrice.value,        
        'quote_markup': quoteData.markupPrice.value,        
        'quote_materials': quoteData.materialPrice.value,        
        'quote_labour': quoteData.otherCostPrice.value,        
        'quote_gst': quoteData.totalTax.value
      });
      this.clearDatalayerEvent('quote_won');
    }

    trackLostQuoteStatus(quoteData) {
      window["dataLayer"] = window["dataLayer"] || [];
      window["dataLayer"].push({
        'event': 'quote_lost',
        'location': this.location +', New Zealand',        
        'device_type':  this.getDeviceType,    
        'userId': localStorage.getItem('userDigitId'),        
        'accountId': localStorage.getItem('selectedTradeAccount'),        
        'quoteId': quoteData.code,        
        'quote_total': quoteData.totalPrice.value,        
        'quote_markup': quoteData.markupPrice.value,        
        'quote_materials': quoteData.materialPrice.value,        
        'quote_labour': quoteData.otherCostPrice.value,        
        'quote_gst': quoteData.totalTax.value
      });
      this.clearDatalayerEvent('quote_lost');
    }

    trackUploadPhotoCount(quoteId, imageCount, fileCount) {
      window["dataLayer"] = window["dataLayer"] || [];
      window["dataLayer"].push({
        'event': 'quote_file_upload',
        'location': this.location +', New Zealand',        
        'device_type':  this.getDeviceType,    
        'userId': localStorage.getItem('userDigitId'),        
        'accountId': localStorage.getItem('selectedTradeAccount'),        
        'quoteId': quoteId, 
        'file_count': fileCount,
        'image_count': imageCount
      });
      this.clearDatalayerEvent('quote_file_upload');
    }

    clearDatalayerEvent(ev) {
      window["dataLayer"].splice(window["dataLayer"].findIndex(item => item.event == ev) , 1);
    }
  
}
