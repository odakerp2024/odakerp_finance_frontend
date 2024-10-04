import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { event } from 'jquery';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit, OnChanges, AfterContentChecked {
  fileUrl: string;
  editSelectedData: any;
  date = new Date();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private globals: Globals,
    private commonDataService: CommonService
  ) {
    this.createDocumentForm();
  }
  documentNameList: any = [{ name: 'Company Registration copy', id: 1 }, { name: 'Tax Registrations copy', id: 2 }, { name: 'Others', id: 3 }];
  documentForm: FormGroup;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  @Input() documentList;
  @Input() dropDownOptions;
  @Output() saveDocumentEvent = new EventEmitter;
  @Output() deleteDocumentEvent = new EventEmitter;
  NoRecords = '';
  ngOnInit(): void {
    if(this.dropDownOptions && this.dropDownOptions.length){
      this.documentNameList = this.dropDownOptions;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes.documentList && JSON.stringify(changes.documentList.currentValue) != JSON.stringify(changes.documentList.previousValue)) {
      this.documentList = this.documentList ? this.documentList : [];
      this.documentList.length ? '' : this.NoRecords = 'No Records Found';
    }

    if ( changes.dropDownOptions && JSON.stringify(changes.dropDownOptions.currentValue) != JSON.stringify(changes.dropDownOptions.previousValue)) {
      if(this.dropDownOptions.length){
        this.documentNameList = this.dropDownOptions
      }
    }
  }
  ngAfterContentChecked(): void {
    // $("#delete0").attr('checked', 'checked');
  }


  createDocumentForm() {
    this.documentForm = this.fb.group({
      DocumentName: [''],
      others: [''],
      FilePath: [''],
      UploadedOn: [new Date()],
      file: []
    });
  }

  clearDocumentForm() {
    this.documentForm.reset();
  }

  getDocumentNameList() {
  }

  deleteDocument() {
    // this.documentList = this.documentList.filter(item => item.CustomerDocumentsID !== this.editSelectedData.CustomerDocumentsID)
    if (this.editSelectedData == undefined) {
      Swal.fire('<span style=\'color:red;\'>*</span> <span>Please Select The Document To Select </span>');
      return;
    } else {
      this.deleteDocumentEvent.emit(this.editSelectedData);
    }
  }

  ViewDocList() {

  }

  onFileSelected(index: any) {
    this.editSelectedData = index;
  }

  fileSelected(event) { 
    if (event.target.files.length > 0) {
      this.documentForm.controls.FilePath.setValue(event.target.files[0].name);
      this.documentForm.controls.file.setValue(event);
    }
  }

  uploadDocument() {
    let validation = '';
    if (!this.documentForm.value.DocumentName) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please select Document Name </span></br>';
    }
    if (!this.documentForm.value.FilePath) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please upload Browser File</span></br>';
    }
    // * check other input text is entered if others options is selected
    if (this.documentForm.value.DocumentName === 'Others' && !this.documentForm.value.others) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please enter the document name</span></br>';
    }
    //* assign the others text to document name if others text is entered
    if (this.documentForm.value.others) {
      this.documentForm.controls.DocumentName.setValue(this.documentForm.value.others);
    }

    if (validation !== '') {
      Swal.fire(validation);
      return false;
    } else {
      this.saveDocumentEvent.emit(this.documentForm.value);

      this.clearDocumentForm();
    }
  }

  /*File Download*/
download = (fileUrl) => {
  this.fileUrl = "UploadFolder\\Attachments\\" + fileUrl;
  this.commonDataService.download(fileUrl).subscribe((event) => {

      if (event.type === HttpEventType.UploadProgress){
        
      }
          // this.progress1 = Math.round((100 * event.loaded) / event.total);

      else if (event.type === HttpEventType.Response) {
          // this.message = 'Download success.';
          this.downloadFile(event);
      }
  });
}

private downloadFile = (data: HttpResponse<Blob>) => {
  const downloadedFile = new Blob([data.body], { type: data.body.type });
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  a.download = this.fileUrl;
  a.href = URL.createObjectURL(downloadedFile);
  a.target = '_blank';
  a.click();
  document.body.removeChild(a);
}
/*File Download*/

  

  // download(fileUrl: string) {
  //   debugger
  //    this.fileUrl = this.globals.APIURL + '/"UploadFolder/Attachments/'+ fileUrl;

  //   // this.http.get(`${this.globals.APIURL}/LACommon/download?fileUrl=${fileUrl}`, {
  //   //     reportProgress: true,
  //   //     observe: 'events',
  //   //     responseType: 'blob'
  //   // }).subscribe((events) => {
  //   //   console.log('LACommon file download', events);
  //   //   this.downloadFile(events);
  //   // });
  //   this.downloadFile(this.fileUrl);
  // }

  // downloadFile = (data) => {
  //   const downloadedFile = new Blob([data.body], { type: data.body.type });
  //   const a = document.createElement('a');
  //   a.setAttribute('style', 'display:none;');
  //   document.body.appendChild(a);
  //   a.download = this.fileUrl;
  //   a.href = '';
  //   a.target = '_blank';
  //   a.click();
  //   document.body.removeChild(a);
  // }
  /*File Download*/

  // setDocumentName(fileName: any) {
  // console.log('event', fileName.target.value);
  // this.documentForm.controls.DocumentName.setValue(fileName.target.value);
  // }
}
