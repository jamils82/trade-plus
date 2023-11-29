import { FormControl, FormGroup, Validators } from '@angular/forms';
import { downloadFormatService } from './../../../../core/service/download-format.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/CommonService/common.service';

@Component({
  selector: 'app-create-new-format',
  templateUrl: './create-new-format.component.html',
  styleUrls: ['./create-new-format.component.scss'],
})
export class CreateNewFormatComponent implements OnInit {
  downloadFileFormat: any;
  fileExtension: any;
  downloadFileType: [];
  submitted: boolean;
  b2bUnit: string;

  newFormatForm: FormGroup = new FormGroup({
    formatType: new FormControl({ value: 'Invoice', disabled: true }),
    outputType: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    fileName: new FormControl(''),
    ext: new FormControl(''),
  });

  constructor(
    private router: Router,
    private downloadFormatService: downloadFormatService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.show();
    this.downloadFormatService.getDownloadFileFormat().subscribe((d) => {
      this.downloadFileFormat = d.dwnFileFormat;
      // console.log("Download format:", this.downloadFileFormat)
      this.downloadFileType = d.dwnFileType;
      this.fileExtension = d.fileExtensions;
      const defaultOutputType = d.dwnFileFormat ? d.dwnFileFormat[0].key : '';
      this.newFormatForm.get('outputType').setValue(defaultOutputType);
      const defaultFileFormatType = d.fileExtensions ? d.fileExtensions[0].key : '';
      this.newFormatForm.get('ext').setValue(defaultFileFormatType);
      this.b2bUnit = localStorage.getItem('selectedIUID') || '';
      this.commonService.hide();
    });
  }

  get f() {
    return this.newFormatForm.controls;
  }

  backBtn() {
    this.router.navigate(['/downloadFilesPage']);
  }

  createBtn() {
    // console.log("H")
    this.submitted = true;
    if (this.newFormatForm.invalid) {
      return;
    }

    const formatObj = {
      active: true,
      associatedStore: 'mico-spa',
      baseTemplate: false,
      fieldEnclosure: '',
      fileExtension: this.newFormatForm.get('ext').value,
      fileFormat: this.newFormatForm.get('outputType').value,
      fileName: this.b2bUnit + '_' + this.newFormatForm.get('fileName').value,
      fileSeparator: '',
      fileType: this.newFormatForm.get('formatType').value,
      id: '',
      title: this.newFormatForm.get('title').value,
    };

    
    this.commonService.show();
    this.downloadFormatService.createNewFormat(formatObj).subscribe((data) => {
      const a: any = data;
     
      if (a) {
        const b = a.id;
        formatObj.id = b;
        this.downloadFormatService.formData = formatObj;
        localStorage.setItem('isEdit', 'No');
        localStorage.setItem('editNewFormat',JSON.stringify(this.downloadFormatService.formData));
        this.router.navigate(['downloadFilesPage/edit', b]);
        this.commonService.hide();
      }
    });
  }
}
