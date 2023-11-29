import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { downloadFormatService } from './../../../../core/service/download-format.service';
import {
  CdkDragDrop,
  CdkDragEnter,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditFormatDatePopup } from './edit-format-popups/edit-format-date-popup';

@Component({
  selector: 'app-edit-new-format',
  templateUrl: './edit-new-format.component.html',
  styleUrls: ['./edit-new-format.component.scss'],
})
export class EditNewFormatComponent implements OnInit {
  localFormData: any;
  getDateFormat: any;
  downloadFileFormat: [];
  downloadFileType: [];
  includeRowHeader: [];
  fieldSeperator: [];
  fieldEnclosure: [];
  headerRowArray: any;
  submitted: boolean;
  b2bUnit: string;
  invoiceHeading: string;
  invoiceHeaderArray: any[];
  invoiceHeading2: string;
  invoiceHeaderArray2: any[];
  invoiceHeading3: string;
  invoiceHeaderArray3: any[];
  fileFormat: string;
  fileType: string;

  invoiceArray: any;
  invoiceCustomHeading: string;
  invoiceCustomHeading2: string;
  invoiceCustomHeading3: string;
  invoiceCustomHeaderArray: any = [];
  invoiceCustomHeaderArray2: any = [];
  invoiceCustomHeaderArray3: any = [];
  activeCustomers = ['John', 'Watson'];

  inactiveCustomers = ['Adam', 'Jack', 'Katherin'];

  newFormatForm: FormGroup = new FormGroup({
    formatType: new FormControl({ value: '', disabled: true }),
    outputType: new FormControl({ value: '', disabled: true }),
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    fileName: new FormControl(''),
    headerRow: new FormControl(''),
    fieldSeperator: new FormControl(''),
    fieldEnclosure: new FormControl(''),
    ext: new FormControl(''),
  });

  // fileExtension: [];
  fileExtension = [
    {
      key: 'TXT',
      value: 'txt'
    },
    {
      key: 'DTA',
      value: 'dta'
    },
    {
      key: 'XML',
      value: 'xml'
    },
    {
      key: 'DAT',
      value: 'dat'
    }
  ]

  modalRef: any;
  infoMessage: string = '';
  successInd$ = new BehaviorSubject<boolean>(false);
  currentItem: any = {};

  usedAttr: any = [];
  profile_copy: any = [];


  constructor(
    public ref: ChangeDetectorRef,
    private router: Router,
    private downloadFormatService: downloadFormatService,
    public commonService: CommonService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.commonService.show();
    this.localFormData = JSON.parse(localStorage.getItem('editNewFormat'));

    this.downloadFormatService.getDownloadFileFormat().subscribe(
      (d) => {
        this.getDateFormat = d.dateFormat;
        this.downloadFileFormat = d.dwnFileFormat;
        this.downloadFileType = d.dwnFileType;
        // this.fileExtension = d.fileExtensions;
        this.fieldEnclosure = d.fieldEnclosure;
        this.fieldSeperator = d.fileSeparator;
        this.headerRowArray = d.includeHeadersEnum;
        //  [
        //   { key: 'false', value: 'No' },
        //   { key: 'true', value: 'Yes' },
        // ];
        this.fileFormat = this.localFormData?.fileFormat;
        this.fileType = this.localFormData?.fileType;

        let isEdit = localStorage.getItem('isEdit');
        if (isEdit == 'Yes') {
          const defaultFieldSeperator = this.localFormData?.fileSeparator;

          const defaultHeader = this.localFormData?.includeHeader;
          const defaultFieldEnclosure = this.localFormData?.fieldEnclosure;
          this.newFormatForm
            .get('fieldEnclosure')
            .setValue(defaultFieldEnclosure);
          this.newFormatForm.get('headerRow').setValue(defaultHeader);
          this.newFormatForm
            .get('fieldSeperator')
            .setValue(defaultFieldSeperator);
        } else {
          const defaultFieldSeperator = d.fileSeparator
            ? d.fileSeparator[0].key
            : '';

          const defaultHeader = this.headerRowArray
            ? this.headerRowArray[0].key
            : '';
          const defaultFieldEnclosure = d.fieldEnclosure
            ? d.fieldEnclosure[0].key
            : '';
          this.newFormatForm
            .get('fieldEnclosure')
            .setValue(defaultFieldEnclosure);
          this.newFormatForm.get('headerRow').setValue(defaultHeader);
          this.newFormatForm
            .get('fieldSeperator')
            .setValue(defaultFieldSeperator);
        }
        this.newFormatForm
          .get('formatType')
          .setValue(this.localFormData?.fileType);
        this.newFormatForm
          .get('outputType')
          .setValue(this.localFormData?.fileFormat);

        const defaultFileFormatType = this.localFormData?.fileExtension;
        this.newFormatForm.get('ext').setValue(defaultFileFormatType);
        this.newFormatForm.get('title').setValue(this.localFormData?.title);
        this.b2bUnit = localStorage.getItem('selectedIUID') || '';
        if (this.localFormData?.fileName.includes('.')) {
          const aa = this.localFormData?.fileName;
          var mySubString = aa.substring(
            aa.indexOf('_') + 1,
            aa.lastIndexOf('.')
          );
          this.newFormatForm.get('fileName').setValue(mySubString);
        } else {
          const aa = this.localFormData?.fileName;
          var mySubString = aa.substring(aa.indexOf('_')+1)
          this.newFormatForm.get('fileName').setValue(mySubString);
        }

        if (this.fileFormat && this.fileType) {
          let getDownloadAttribute =
            this.downloadFormatService.getDefaultAttribtues(
              this.fileFormat,
              this.fileType
            );
          let getNewAttribute = this.downloadFormatService.getNewAttribtues(
            this.fileFormat,
            this.fileType,
            this.localFormData.id
          );

          forkJoin([getDownloadAttribute, getNewAttribute]).subscribe(
            (results: any) => {
              const defaultarray: any = results[0];
              const filterArray = defaultarray.sections.filter(
                (x) => x.direction != 'L'
              );
              const sortArray = filterArray.sort(function (a, b) {
                return a.position - b.position;
              });
              this.usedAttr = sortArray;

              this.invoiceHeading = sortArray[0]?.fileSectionName;
              this.invoiceHeaderArray = sortArray[0]?.attributes;
              this.invoiceHeading2 = sortArray[1]?.fileSectionName;
              this.invoiceHeaderArray2 = sortArray[1]?.attributes;
              this.invoiceHeading3 = sortArray[2]?.fileSectionName;
              this.invoiceHeaderArray3 = sortArray[2]?.attributes;

              const defaultarray1: any = results[1].sections;
              const takeDefault = results[1].sections.sort(function (a, b) {
                return a.position - b.position;
              });
              this.profile_copy = Array.from(results[1].sections);
              let sortArray1: any;
              if (defaultarray1.length > 0) {
                sortArray1 = defaultarray1.sort(function (a, b) {
                  return a.position - b.position;
                });
                this.invoiceCustomHeaderArray = sortArray1[0]?.attributes.sort(
                  function (a, b) {
                    return a.position - b.position;
                  }
                );
                this.invoiceCustomHeading = sortArray1[0]?.defaultSectionName;
                this.invoiceCustomHeaderArray2 = sortArray1[1]?.attributes.sort(
                  function (a, b) {
                    return a.position - b.position;
                  }
                );
                this.invoiceCustomHeading2 = sortArray1[1]?.defaultSectionName;
                this.invoiceCustomHeaderArray3 = sortArray1[2]?.attributes.sort(
                  function (a, b) {
                    return a.position - b.position;
                  }
                );
                this.invoiceCustomHeading3 = sortArray1[2]?.defaultSectionName;
              } else {
                this.invoiceCustomHeaderArray = [];
                this.invoiceCustomHeading = sortArray1[0]?.defaultSectionName;
                this.invoiceCustomHeaderArray2 = [];
                this.invoiceCustomHeading2 = sortArray1[1]?.defaultSectionName;
                this.invoiceCustomHeaderArray3 = [];
                this.invoiceCustomHeading3 = sortArray1[2]?.defaultSectionName;
              }

              if (this.invoiceCustomHeaderArray) {
                this.invoiceCustomHeaderArray.forEach((element1) => {
                  this.invoiceHeaderArray.forEach((element) => {
                    if (element1.fieldId == element.fieldId) {
                      Object.assign(element, { selected: true });
                    }
                  });
                });
              }

              if (this.invoiceCustomHeaderArray2) {
                this.invoiceCustomHeaderArray2.forEach((element1) => {
                  this.invoiceHeaderArray2.forEach((element) => {
                    if (element1.fieldId == element.fieldId) {
                      Object.assign(element, { selected: true });
                    }
                  });
                });
              }


              if (this.invoiceCustomHeaderArray3) {
                this.invoiceCustomHeaderArray3.forEach((element1) => {
                  this.invoiceHeaderArray3.forEach((element) => {
                    if (element1.fieldId == element.fieldId) {
                      Object.assign(element, { selected: true });
                    }
                  });
                });
              }
            }
          );
          
        }
       
        this.commonService.hide();
      },
      (_error) => {
        this.commonService.hide();
      }
    );
  }

  get f() {
    return this.newFormatForm.controls;
  }

  backBtn() {
    this.router.navigate(['/downloadFilesPage/create']);
  }

  EditBtn() {
    if (this.profile_copy.length == 1) {
      this.profile_copy[0].attributes = this.invoiceCustomHeaderArray;
    }
    if (this.profile_copy.length == 2) {
      this.profile_copy[0].attributes = this.invoiceCustomHeaderArray;
      this.profile_copy[1].attributes = this.invoiceCustomHeaderArray2;
    }

    if (this.profile_copy.length == 3) {
      this.profile_copy[0].attributes = this.invoiceCustomHeaderArray;
      this.profile_copy[1].attributes = this.invoiceCustomHeaderArray2;
      this.profile_copy[2].attributes = this.invoiceCustomHeaderArray3;
    }

    const saveObj = {
      active: true,
      associatedStore: 'mico-spa',
      attributeType: 'String',
      baseTemplate: false,
      fieldEnclosure: this.newFormatForm.get('fieldEnclosure').value,
      fileExtension: this.newFormatForm.get('ext').value,
      fileFormat: this.newFormatForm.get('outputType').value,
      fileName: this.b2bUnit + '_' + this.newFormatForm.get('fileName').value,
      fileSeparator: this.newFormatForm.get('fieldSeperator').value,
      fileType: this.newFormatForm.get('formatType').value,
      id: this.localFormData.id,
      includeHeader: this.newFormatForm.get('headerRow').value,
      sections: this.profile_copy,
      title: this.newFormatForm.get('title').value,
    };

    this.downloadFormatService.editFormatAPI(saveObj).subscribe((res) => {
      this.router.navigate(['downloadFilesPage']);
    });
    console.log(this.profile_copy)
  }

  selectInvoiceHeading(event, obj) {
    if (event.target.checked == true) {
      Object.assign(obj, { selected: true });
      obj.active = true;
      this.invoiceCustomHeaderArray.push(JSON.parse(JSON.stringify(obj)));
    }

    if (event.target.checked == false) {
      Object.assign(obj, { selected: false });
      this.invoiceCustomHeaderArray = this.invoiceCustomHeaderArray.filter(
        (x) => x.fieldId != obj.fieldId
      );
    }
    this.invoiceCustomHeaderArray.forEach((element, index) => {
      element.position = index + 1;
    });
    console.log(this.invoiceCustomHeaderArray, 'this.invoiceCustomHeaderArray')
  }

  selectInvoiceHeading1(event, obj) {

    if (event.target.checked == true) {
      Object.assign(obj, { selected: true });
      //  obj.id = '';
      obj.active = true;
      console.log(obj,"new element");
      this.invoiceCustomHeaderArray2.push(JSON.parse(JSON.stringify(obj)));
    }

    if (event.target.checked == false) {
      Object.assign(obj, { selected: false });
      this.invoiceCustomHeaderArray2 = this.invoiceCustomHeaderArray2.filter(
        (x) => x.fieldId != obj.fieldId
      );
    }
    this.invoiceCustomHeaderArray2.forEach((element, index) => {
      element.position = index + 1;
    });
    console.log(this.invoiceCustomHeaderArray2, 'this.invoiceCustomHeaderArray')
  }

  selectInvoiceHeading3(event, obj) {
    if (event.target.checked == true) {
      Object.assign(obj, { selected: true });
      obj.active = true;
      this.invoiceCustomHeaderArray3.push(JSON.parse(JSON.stringify(obj)));
    }

    if (event.target.checked == false) {
      Object.assign(obj, { selected: false });
      this.invoiceCustomHeaderArray3 = this.invoiceCustomHeaderArray3.filter(
        (x) => x.fieldId != obj.fieldId
      );
    }
    this.invoiceCustomHeaderArray3.forEach((element, index) => {
      element.position = index + 1;
    });
    console.log(this.invoiceCustomHeaderArray3, 'this.invoiceCustomHeaderArray')
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.invoiceCustomHeaderArray,
      event.previousIndex,
      event.currentIndex
    );
    this.invoiceCustomHeaderArray.forEach((element, index) => {
      element.position = index + 1;
    });

  }

  drop2(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.invoiceCustomHeaderArray2,
      event.previousIndex,
      event.currentIndex
    );
    this.invoiceCustomHeaderArray2.forEach((element, index) => {
      element.position = index + 1;
    });
    console.log(this.invoiceCustomHeaderArray2, 'this.invoiceCustomHeaderArray2')
  }

  drop3(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.invoiceCustomHeaderArray3,
      event.previousIndex,
      event.currentIndex
    );
    this.invoiceCustomHeaderArray3.forEach((element, index) => {
      element.position = index + 1;
    });
    console.log(this.invoiceCustomHeaderArray3, 'this.invoiceCustomHeaderArray3')
  }

  deleteElement(content) {
    this.currentItem = {};
    this.currentItem = this.localFormData;
    this.currentItem.page = 'downloadFormat';
    this.modalRef = this.modalService.open(content, {
      windowClass: 'deleteList',
      centered: true,
      size: 'md',
    });
    this.modalRef.result.then(
      (result) => {
        if (result === 'success') {
        }
      },
      (name: any) => {
        if (name != '') {
          this.infoMessage = this.localFormData.title + ' has been deleted.';
          this.successInd$.next(true);
          this.router.navigate(['downloadFilesPage']);
          setTimeout(() => {
            this.successInd$.next(false);
          }, 10000);
        }
      }
    );
  }



  editDateTimePopup(content:any, isHeading:any) {  
    var modalRef = this.modalService.open(EditFormatDatePopup, {
      windowClass: 'downloadFormat',
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.changeHeading = isHeading;
    modalRef.componentInstance.fieldName = content == false ? isHeading : content;
    modalRef.componentInstance.dateTimeFormat = content.attributeType == "DATE" ? this.getDateFormat : [];
    modalRef.componentInstance.passEntry.subscribe((rs) => {
      console.log(rs);
      if(rs.process == 'save' && isHeading != false){
        isHeading == this.invoiceCustomHeading ? (this.invoiceCustomHeading = rs.setFieldName, this.profile_copy[0].defaultSectionName = rs.setFieldName) : null;
        isHeading == this.invoiceCustomHeading2 ? (this.invoiceCustomHeading2 = rs.setFieldName, this.profile_copy[1].defaultSectionName = rs.setFieldName) : null
        isHeading == this.invoiceCustomHeading3 ? (this.invoiceCustomHeading3 = rs.setFieldName, this.profile_copy[2].defaultSectionName = rs.setFieldName) :  null
      }
      if(rs.process == 'save' && isHeading == false){
        if(this.invoiceCustomHeaderArray != undefined){
          this.invoiceCustomHeaderArray.forEach( el => {
          if(el.fieldId == content.fieldId && el.id == content.id) { el.fieldName = rs.setFieldName; el.validations = rs.setDateFormat }
        });
        }
        if(this.invoiceCustomHeaderArray2 != undefined){
          this.invoiceCustomHeaderArray2.forEach( el => {
            if(el.fieldId == content.fieldId && el.id == content.id) { el.fieldName = rs.setFieldName; el.validations = rs.setDateFormat }
          });
        }
        if(this.invoiceCustomHeaderArray3 != undefined){
          this.invoiceCustomHeaderArray3.forEach( el => {
            if(el.fieldId == content.fieldId && el.id == content.id) { el.fieldName = rs.setFieldName; el.validations = rs.setDateFormat }
          });
        }
      }
      this.modalService.dismissAll(); 
     });
  
  }
}
