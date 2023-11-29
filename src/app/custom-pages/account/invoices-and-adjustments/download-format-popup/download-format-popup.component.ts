import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { downloadFormatService } from './../../../../core/service/download-format.service';

@Component({
  selector: 'app-download-format-popup',
  templateUrl: './download-format-popup.component.html',
  styleUrls: ['./download-format-popup.component.scss']
})
export class DownloadFormatPopupComponent implements OnInit {

  @Input() fieldName: any;
  @Input() dateTimeFormat: any;
  @Input() changeHeading: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  selectedFormat : any = '';
  selectedInvoiceNo : any = [];
  showFieldName = '' ;
  downloadFormats: any;
  newFormatForm: FormGroup = new FormGroup({
    formatType: new FormControl('')
  });
  fileName:any;
  showMessage = false;
  getInvoiceField: any;
  fileId: any;
  downloadMethod:any = 'Individual';
  invoiceNos: any = [];
  selectedDoc: any = [];
  getInvoiceNos: any = [];
  
  constructor(   
      private modalService: NgbModal,
      public ref: ChangeDetectorRef,
      private downloadFormatService: downloadFormatService,
      public commonService: CommonService,
      private router: Router){     }
      
      ngOnInit(): void {    
        this.commonService.show();

        this.getInvoiceField = localStorage.getItem('selectedFormat');
        const getSelectedFormVal = JSON.parse(this.getInvoiceField);

       // console.log("this.getInvoiceField",this.getInvoiceField);
      //  console.log("getSelectedFormVal",getSelectedFormVal);
        this.selectedInvoiceNo = this.fieldName;
        this.invoiceNos = [];
        this.selectedInvoiceNo.map((el) => {
          this.invoiceNos.push(el.docNumber);
        });
        console.log("this.selectedInvoiceNo", this.selectedInvoiceNo);
        this.downloadFormatService.getDownloadFormatForInvoice().subscribe((res:any) => {
        //  res.results.unshift({title: "SIMPRO Invoice Download Format", id: "tlSimproFormatCSV", fileFormat: "CSV", fileName: "invoices.csv", fileType: "INVOICE"})
        //  res.results.unshift({title: "SmartTrade Invoice Download Format", id: "tlSmartTradeFormatCSV", fileFormat: "CSV", fileName: "invoices.csv", fileType: "INVOICE"})
       //   res.results.unshift({title: "Default Invoice Download Format", id: "tldefaultinvoicecsv", fileFormat: "CSV", fileName: "invoices.csv", fileType: "INVOICE"})
        
       
       if(res.results.length > 0) {
          const getSelectedIUID = localStorage.getItem('selectedIUID');

            this.showMessage = false;
            this.downloadFormats =  
            res.results.filter((item:any) =>{
            //  console.log(item);
              if((item.associatedStore == 'tradeLink-spa' && item.associateTradeAccount == 'DEFAULT') ||  (item.associateTradeAccount.includes(getSelectedIUID))){
                return true;
             }
            return false;
          });
         
            if(getSelectedFormVal)
            {
            this.selectedFormat = getSelectedFormVal[0].id;
            this.newFormatForm.controls['formatType'].setValue(getSelectedFormVal[0].id);
          }
          else
          {
            this.selectedFormat = this.downloadFormats[0].id;
            this.newFormatForm.get('formatType').setValue(this.selectedFormat);
          }
            // console.log(" this.selectedFormat", this.selectedFormat);
            this.fileName = res.results[0].fileName;
           
          
            this.commonService.hide();
          } else {
            this.showMessage = true;
            this.commonService.hide();
          }
       
        },
        (error) => {
          //Error callback
          this.commonService.hide();
          this.showMessage = true;
         
        },
        () => {
          this.commonService.hide();
        });
  }
 
  valueChange(val:string){
    
   this.selectedFormat= val;
   const selectedFile:any = this.downloadFormats.filter(x => x.id == val);
   this.fileName = selectedFile[0].fileName;
   this.fileId = selectedFile[0].id;
    // console.log("this.fileName",this.fileName);
  // localStorage.setItem('selectedFormat',JSON.stringify(selectedFile));
  }
 
  closePopup(){
      this.modalService.dismissAll(); 
  }

  selectStatement(val){
    if(val == 'Individual'){
      this.downloadMethod = 'Individual';
    }
    else if(val == 'Consolidated'){
      this.downloadMethod = 'Consolidated';
    }
    else{

    }
  }

  downloadMultiFormat(){
   
    // alert(this.downloadMethod);
    if(this.downloadMethod == 'Individual'){
      // alert(this.downloadMethod);
      this.downloadFormat();
    }
    else if(this.downloadMethod == 'Consolidated'){
      // alert(this.downloadMethod);
      this.downloadBothFormat();
    }
    else{
      
    }
  }




  downloadFormat(){
   // console.log(args);
   this.commonService.show();
   const selectFormatType:any = this.newFormatForm.get('formatType');
   this.selectedInvoiceNo.forEach(itemm => {
    for(var i=0;i<itemm.length;i++){
    
      this.downloadFormatService.postDownloadInvoiceFormat(itemm[i].docNumber,this.selectedFormat).subscribe((resp: HttpResponse<Blob>) => {
        this.downloadFile(resp.body, this.fileName);
            this.commonService.hide();
          },
          (error) => {
            //Error callback
            this.downloadFile(error.body, this.fileName);
            this.commonService.hide();
            this.modalService.dismissAll(); 
           
          });
    }
})
 
   
  }

  downloadBothFormat(){
   // console.log(args);
    this.commonService.show();
    const selectFormatType:any = this.newFormatForm.get('formatType');
    // console.log("this.invoiceNos",this.invoiceNos);
    this.selectedInvoiceNo.forEach(itemm => {
      console.log(itemm);
      // console.log(this.selectedInvoiceNo[itemm]);
      for(var i=0;i<itemm.length;i++){
        console.log(itemm[i].docNumber);
      this.getInvoiceNos.push(itemm[i].docNumber);
      }
    });
    console.log(this.getInvoiceNos);
    this.downloadFormatService.postDownloadInvoiceFormat(this.getInvoiceNos,this.selectedFormat).subscribe((resp: HttpResponse<Blob>) => {
      this.downloadFile(resp.body, this.fileName);
          this.commonService.hide();
        },
        (error) => {
          //Error callback
          this.downloadFile(error.body, this.fileName);
          this.commonService.hide();
          this.modalService.dismissAll(); 
         
        });
  }

  downloadFile(data: any, fileName: string) {
  try{
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    this.modalService.dismissAll(); 
  } catch(ex) {
    this.commonService.hide();
  }
 
  }

  redirect(){
    this.modalService.dismissAll();
    this.router.navigate(['/downloadFilesPage']);
  }

}
