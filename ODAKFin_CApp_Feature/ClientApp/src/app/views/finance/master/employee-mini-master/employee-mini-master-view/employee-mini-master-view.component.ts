import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { EmployeeMiniMasterService } from 'src/app/services/financeModule/employee-mini-master.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-mini-master-view',
  templateUrl: './employee-mini-master-view.component.html',
  styleUrls: ['./employee-mini-master-view.component.css']
})
export class EmployeeMiniMasterViewComponent implements OnInit {

  // * pagination start
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  // * pagination end

  // * Dropdown
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  CreatedBy = localStorage.getItem('UserID');
  customerList = [];

  templateList = [];
  templateFile: any;
  filterForm: any;

  divisionList = [];
  officeList = [];
  employeeMiniMasterList = [];
  file: any;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  templateDownloadPath: any = 'https://odakfn.odaksolutions.in/assets/Uploads/2e0c2d45-691f-4f35-812d-71e590d53456.xlsx';
  resultValues: any[];
  formattedErrorMessages: any;

  constructor(
    private ps: PaginationService,
    private fb: FormBuilder,
    private commonDataService: CommonService,
    private datePipe: DatePipe,
    private employeeMiniMasterService: EmployeeMiniMasterService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.createFilterForm();
    this.getDivisionList();
    this.getEmployeeList();
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      Id: [''],
      EmployeeCode: [''],
      EmployeeName: [''],
      ShortName: [''],
      DivisionCode: [''],
      OfficeCode: [''],
      Status: [''],
      Department: ['']
    })
  }

  filterInvoice() {
    this.getEmployeeList();
  }

  clearFilter() {
    this.createFilterForm()
    this.getEmployeeList();
  }

  fileSelected(event) {
    this.file = event.target.files;
    if (this.file) {
      this.templateFile = this.file[0].name
    }
  }

  uploadEmployee() {
    if (!this.file) {
      Swal.fire('', 'Please Choose The File To upload', 'warning');
      return
    }

    let employeeMaster = new FormData();
    employeeMaster.append('file', this.file[0]);
    employeeMaster.append('createdBy', this.CreatedBy)

    this.employeeMiniMasterService.uploadEmployeeMiniMaster(employeeMaster).subscribe((result: any) => {
      if (result.message == "Success") {
        this.file = '';
        Swal.fire(result.result[0]);
        this.closeModal();
        this.getEmployeeList();
      }
      else {
        this.resultValues = []
        this.resultValues = result.result

        if (this.resultValues.length == 1) {
          Swal.fire(this.resultValues[0]);

        }
        else {
          this.updateFormattedErrorMessages()
          console.log(this.formattedErrorMessages, 'formattedErrorMessagesformattedErrorMessages');
          Swal.fire(this.formattedErrorMessages);
        }
      }
    })

  }

  updateFormattedErrorMessages(): void {
    const groupedErrors: { [key: string]: string[] } = {};

    // Group errors by RowNumber
    this.resultValues.forEach(errorMessage => {
      const rowNumber = errorMessage.match(/RowNumber: (\d+)/);
      if (rowNumber) {
        const key = rowNumber[1];
        groupedErrors[key] = groupedErrors[key] || [];
        groupedErrors[key].push(errorMessage.replace(`RowNumber: ${key}, `, ''));
      }
    });

    // Join grouped errors with line breaks
    this.formattedErrorMessages = Object.keys(groupedErrors).map(key => {
      return `RowNumber: ${key}, ${groupedErrors[key].join('<br>')}`;
    }).join('<br>');
  }

  getEmployeeList() {
    let payload = this.filterForm.value;
    this.employeeMiniMasterService.getEmployeeMiniMasterList(payload).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.employeeMiniMasterList = result.data.Table;
        this.setPage(1)
      }
    })
  }

  getDivisionList() {
    this.commonDataService.getDivision({}).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.divisionList = [];
        if (result.data.Table.length > 0) {
          this.divisionList = result.data.Table;
        }
      }
    })
  }

  getOffice(DivisionId) {
    const payload = { DivisionId: DivisionId }
    this.commonDataService.getOfficeByDivisionId(payload)
      // .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        this.officeList = [];
        if (result.message == 'Success') {
          if (result.data && result.data.Table.length > 0) {
            this.officeList.push(...result.data.Table);
          }
        }
      }, error => {
      });
  }



  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.employeeMiniMasterList.length, page);

    if (this.employeeMiniMasterList.length == 0) {
      this.pagedItems = [];
    }

    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get current page of items
    this.pagedItems = this.employeeMiniMasterList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  closeModal(): void {
    this.file = '';
    this.templateFile = '';
    this.closeBtn.nativeElement.click();
  }

  // * make template link as downloadable 
  downloadTemplateFile() {
    if (!this.templateDownloadPath) {
      return;
    }
    const link = document.createElement('a');
    link.href = this.templateDownloadPath;
    link.target = '_blank';
    link.download = 'EMM.xlsx'; // Specify the desired filename with extension
    link.click();
  }

  checkAddPermission() {
    this.getPermissionListForCreate(617);
  }

  getPermissionListForCreate(value) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2) {
            // this.router.navigate(['views/finance/master/chargecode', { isCreate: true }]);
          } else {
            this.closeModal()
            Swal.fire('Please Contact Administrator');
          }
        }
      } else {
        Swal.fire('Please Contact Administrator');
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }



}
