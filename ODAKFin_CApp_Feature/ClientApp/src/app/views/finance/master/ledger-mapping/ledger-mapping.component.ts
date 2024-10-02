import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ledger-mapping',
  templateUrl: './ledger-mapping.component.html',
  styleUrls: ['./ledger-mapping.component.css'],
  providers: [DatePipe]
})
export class LedgerMappingComponent implements OnInit {

  ledgerFilter: FormGroup;
  ledgerApplicationList: any = [];
  ledgerModuleList: any = [];
  ledgerSubModuleList: any = [];
  ledgerClassificationList: any = [];
  ledgerAccountList: any = [];
  ledgerForm: FormGroup;
  ledgerList: any = [];
  pager: any = {};
  pagedItems: any[];// paged items
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  currentPageNumber: number = 1;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private globals: Globals,
    private datePipe: DatePipe,
    public ps: PaginationService,
    private router: Router,
    private commonDataService: CommonService
  ) { }

  ngOnInit(): void {
    this.createFilterForm();
    this.getLedgerList();
    this.createLedgerForm();
    this.getLedgerMappingDropDown();
  }

  createFilterForm() {
    this.ledgerFilter = this.fb.group({
      ApplicationId: [0],
      ModuleId: [0],
      SubModuleId: [0],
      ClassificationId: [0],
      AccountMappingIds: ['']
    });
  }

  createLedgerForm() {
    this.ledgerForm = this.fb.group({
      Id: [0],
      ModuleId: [0],
      SubModuleId: [0],
      ClassificationId: [0],
      AccountMappingIds: [0],
      CreatedDate: [new Date()],
      UpdatedDate: [""],
      CreatedBy: localStorage.getItem('UserID'),
      UpdatedBy: localStorage.getItem('UserID'),
      ApplicationId: [0]
    })
  }

  getLedgerMappingDropDown() {
    let service = `${this.globals.APIURL}/LedgerMapping/GetLedgerDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.message = "Success") {
        this.ledgerApplicationList = [];
        this.ledgerModuleList = [];
        // this.ledgerSubModuleList = [];
        this.ledgerClassificationList = [];
        this.ledgerAccountList = [];
        if (result.data.Application.length > 0) { this.ledgerApplicationList = result.data.Application; }
        if (result.data.Module.length > 0) { this.ledgerModuleList = result.data.Module; }
        // if (result.data.SubModule.length > 0) { this.ledgerSubModuleList = result.data.SubModule; }
        if (result.data.Classification.length > 0) { this.ledgerClassificationList = result.data.Classification; }
        if (result.data.Account.length > 0) { this.ledgerAccountList = result.data.Account; }
      }
    }, error => {
      console.error(error);
    });
  }

  getSubmodule(id) {
    const payload = {
      SubModuleId: id
    }
    this.ledgerSubModuleList = [];
    let service = `${this.globals.APIURL}/LedgerMapping/GetLedgerSubModuleDropdownList`;
    this.dataService.post(service, payload).subscribe((result: any) => {
      if (result.message = "Success") {
        this.ledgerSubModuleList = result.data.Table;
      }
    })
  }

  getLedgerList(type?: string) {
    if (type == 'search') { var service = `${this.globals.APIURL}/LedgerMapping/GetLedgerMappingListFilter`; var payload = this.ledgerFilter.value; }
    else { var service = `${this.globals.APIURL}/LedgerMapping/GetLedgerMappingList`; var payload: any = {}; }
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.ledgerList = [];
      this.pagedItems = [];
      if (result.data.Table.length > 0) {
        this.ledgerList = result.data.Table;
        this.setPage(1);
      }
    }, error => {
      console.error(error);
    });
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.ledgerList.length, page);

    // get current page of items
    this.pagedItems = this.ledgerList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  saveLedger() {
    var validation = "";
    if (this.ledgerForm.value.ApplicationId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Application</span></br>"
    }
    if (this.ledgerForm.value.ModuleId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Module</span></br>"
    }
    if (this.ledgerForm.value.SubModuleId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Sub-Module</span></br>"
    }
    // if (this.ledgerForm.value.ClassificationId == 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Classification</span></br>"
    // }
    if (this.ledgerForm.value.AccountMappingIds == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Mapping</span></br>"
    }
    if (this.ledgerForm.value.UpdatedDate == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Updated Date</span></br>"
    }

    // let application = this.ledgerList.filter(x => x.ApplicationId == this.ledgerForm.value.ApplicationId);
    // let module = this.ledgerList.filter(x => x.ModuleId == this.ledgerForm.value.ModuleId);
    // let subModule = this.ledgerList.filter(x => x.SubModuleId == this.ledgerForm.value.SubModuleId);
    // let ClassificationId = this.ledgerList.filter(x => x.ClassificationId == this.ledgerForm.value.ClassificationId);
    // let AccountMappingIds = this.ledgerList.filter(x => x.AccountMappingIds == this.ledgerForm.value.AccountMappingIds);

    // if (application.length > 0 && module.length > 0 && subModule.length > 0 && ClassificationId.length > 0 && AccountMappingIds.length > 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Already, a record has been created.</span></br>"
    // }

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to save this Details?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        let payload = { LedgerMapping: { Table: [this.ledgerForm.value] } }
        let service = `${this.globals.APIURL}/LedgerMapping/SaveLedgerMapping`;
        this.dataService.post(service, payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.message, '', 'success');
            this.getLedgerList();
            this.createLedgerForm();
          }
          else {
            Swal.fire(result.message, '', 'error');
          }
        }, error => {
          console.error(error);
        });
      } else { }
    });
  }

  pageChangeEvent(page: number) {
    this.currentPageNumber = ((page * 10) - 10) + 1;
  }

  goBack() {
    this.router.navigate(['/views/finance/financemaster']);
  }

}
