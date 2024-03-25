import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Status, StatusView } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { AgingConfigurationService } from 'src/app/services/financeModule/aging-configuration.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-aging-configuration',
  templateUrl: './aging-configuration.component.html',
  styleUrls: ['./aging-configuration.component.css']
})
export class AgingConfigurationComponent implements OnInit {
  ModifiedOn: any;
  CreatedOn: any;
  CreatedBy: any;
  reportTypeList: any;

  agingList = [];
  statusValue: Status[] = new StatusView().statusvalues;
  agingConfigurationForm: any;

  // * pagination start
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  // * pagination end

  // * aging table start
  editSelectedIndexTable: any = '';
  editRadioTable = false;
  isEditModeTable = false;
  // * aging table end

  // * dropdown value
  reportDropdown = [];
  agingGroupDropdown = [];
  currentDate = new Date()
  agingId: any = 0;
  isUpdate = false;
  agingDetails: { ReportId: number; AgingId: number; Id: number, IsActive: number; };
  agingGroupName = '';
  isEdit = false;
  constructor(
    public fb: FormBuilder,
    public agingService: AgingConfigurationService,
    private route: ActivatedRoute,
    private ps: PaginationService,
    private router: Router
  ) {
    // this.getAlignList();
  }

  async ngOnInit() {
    this.createAgingConfigurationForm();
    await this.getReportDropdown();
    this.route.params.subscribe(params => {
      debugger
      this.agingDetails = {
        ReportId: +params['ReportId'] ? +params['ReportId'] : 0,
        AgingId: +params['AgingId'] ? +params['AgingId'] : 0,
        Id: +params['Id'] ? +params['Id'] : 0,
        IsActive: 0,
      };
      this.agingId = +params['Id'] ? +params['Id'] : 0;
      if (this.agingId) {
        this.isUpdate = true;
        this.isEdit = true;
      }
    });
    if (this.agingId) {
      await this.getAgingById();
      this.getAgingNameByReportType();
    } else {

    }
  }

  createAgingConfigurationForm() {
    this.agingConfigurationForm = this.fb.group({
      Id: 0,
      SequenceNo: [''],
      From: ['', [Validators.required]],
      To: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      IsDeleted: [false],
      CreatedDate: [this.currentDate],
      createdBy: [localStorage.getItem('UserID')],
      updatedDate: [this.currentDate],
      updatedBy: [localStorage.getItem('UserID')],
      IsActive: [1],
      RAMappingId: [this.agingId],
    });
  }

  resettingConfigurationForm() {
    this.agingConfigurationForm.reset();
  }

  //  dropdown function start
  async addAgingDropdown() {
    if (this.agingGroupName == '') {
      Swal.fire("", "Please enter new Aging group name to add", "warning")
      return;
    }

    const isAgingPresent = this.agingGroupDropdown.find((group) => group.AgingGroupName.toLowerCase() === this.agingGroupName.toLowerCase());

    if (isAgingPresent) {
      Swal.fire("", "Aging Group name already present", "warning");
      this.agingGroupName = '';
      return
    }
    const payload = {
      "Aging": {
        "Table": [
          {
            "Id": 0,
            "ReportId": this.agingDetails.ReportId,
            "AgingId": 0,
            "AgingName": this.agingGroupName.toLowerCase(),
            "CreatedBy": localStorage.getItem('UserID')
          }
        ],
        "Table1": []
      }
    }
    const newAgingGroupId = await this.saveAgingDetails(payload);
    await this.getAgingNameByReportType();
    this.agingDetails.Id = +newAgingGroupId
    this.agingGroupName = '';
    Swal.fire("", "New Aging Group name created", "success");
    document.getElementById("closeModalButton").click(); // close the pop model
    const agingGroup = this.agingGroupDropdown.find((aging) => aging.Id == +newAgingGroupId);
    this.agingDetails.AgingId = agingGroup.AgingId
    this.getAgingById();
  }

  clearAgingGroupName() {
    this.agingGroupName = '';
  }

  async deleteAgingDropdown() {
    const agingId = this.agingDetails.AgingId;
    if (!agingId) {
      Swal.fire("", "Please select Aging group to delete", "warning")
      return
    }

    const payload = {
      "Id": agingId
    }

    const text = '<div>Currently in use</div> <div>Do you want to delete this record</div>'
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      html: text,
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.editSelectedIndexTable = '';
        const payload = {
          "Id": this.agingDetails.Id
        }
        this.agingService.deleteAgingGroupDropdown(payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire('', 'Deleted Successfully', 'success')
            this.router.navigate(['/views/aging/aging-list']);
            //  this.getAgingById()
          }
        })
      }
    });
  }

  // dropdown function end

  // * table function start

  addAging() {
    if (this.checkAgingFormValid() != '') {
      return;
    }

    // Validate From number and To number number
    if (this.agingList.length > 0) {

      let agingList = [];

      if (this.isEditModeTable) {
        agingList = this.agingList.filter(x => x.Id != this.agingList[this.editSelectedIndexTable].Id);
      } else {
        agingList = this.agingList;
      }

      let validations = this.fromAndToNumberValidate(agingList, this.agingConfigurationForm.value.From, this.agingConfigurationForm.value.To);

      if (validations != '') {
        return Swal.fire(validations);
      }
    }
    // * edit mode 

    // debugger
    //   // * edit mode
    //   if (this.isEditModeTable) {
    //     this.agingList[this.editSelectedIndexTable] = this.agingConfigurationForm.value;
    //     this.pagedItems = this.agingList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    //     this.isEditModeTable = !this.isEditModeTable;
    //      this.clearTableForm();
    //     return;
    //   } else {
    //   // * create mode
    //   let payload = this.agingConfigurationForm.value;
    //   payload.RAMappingId = this.agingId ? this.agingId : 0;
    //   debugger
    //   this.agingList.push(payload);
    //   this.pagedItems = this.agingList;
    //   this.clearTableForm();
    //   return;
    //   }
    // }


    let info = this.agingConfigurationForm.value;

    if (this.isEditModeTable) {
      let editValue = {
        Id: info.Id,
        SequenceNo: info.SequenceNo,
        From: info.From,
        To: info.To,
        Description: info.Description,
        IsDeleted: info.IsDeleted,
        CreatedDate: info.CreatedDate,
        createdBy: info.createdBy,
        updatedDate: info.updatedDate,
        updatedBy: info.updatedBy,
        IsActive: info.IsActive,
        RAMappingId: info.RAMappingId
      }
      this.agingList[this.editSelectedIndexTable] = editValue;
      this.pagedItems = this.agingList.slice(this.pager.startIndex, this.pager.endIndex + 1);
      this.isEditModeTable = !this.isEditModeTable;
      this.editSelectedIndexTable = null;
      this.clearTableForm();
      this.setPage(1);

      return;
    }
    this.agingList.unshift({
      Id: info.Id,
      SequenceNo: info.SequenceNo,
      From: info.From,
      To: info.To,
      Description: info.Description,
      IsDeleted: info.IsDeleted,
      CreatedDate: info.CreatedDate,
      createdBy: info.createdBy,
      updatedDate: info.updatedDate,
      updatedBy: info.updatedBy,
      IsActive: info.IsActive,
      RAMappingId: info.RAMappingId
    });
    this.clearTableForm();
    this.setPage(1);
  }

  OnClickRadio(index) {
    debugger
    this.editSelectedIndexTable = index;
  }

  //  * edit aging
  editAging() {
    let editRow = this.agingList[this.editSelectedIndexTable];
    this.patchAgingForm(editRow);
    this.isEditModeTable = !this.isEditModeTable;
  }

  //  * delete aging
  deleteAging() {
    if (this.editSelectedIndexTable === '') {
      return;
    }
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to delete this record?',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        const deleteList = this.agingList.splice(this.editSelectedIndexTable, 1);
        this.editSelectedIndexTable = null;
        const payload = {
          "Id": deleteList[0].Id
        }
        this.setPage(1);
        this.agingService.tableDelete(payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire('', 'Deleted Successfully', 'success')
            // this.getAgingById()
          }
        })
      }
    });
  }

  clearTableForm() {
    this.agingConfigurationForm.controls.From.setValue('');
    this.agingConfigurationForm.controls.To.setValue('');
    this.agingConfigurationForm.controls.Description.setValue('');
  }

  patchAgingForm(patchData) {
    this.agingConfigurationForm.patchValue({
      Id: patchData.Id,
      SequenceNo: patchData.SequenceNo,
      From: patchData.From,
      To: patchData.To,
      Description: patchData.Description,
      IsDeleted: patchData.IsDeleted,
      CreatedDate: patchData.CreatedDate,
      createdBy: patchData.createdBy,
      updatedDate: patchData.updatedDate,
      updatedBy: patchData.updatedBy,
      IsActive: patchData.IsActive,
      RAMappingId: patchData.RAMappingId
    });
  }


  checkAgingFormValid() {
    let validation = '';
    if (!this.agingDetails.ReportId) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please select Report Type</span></br>';
    }

    if (!this.agingDetails.AgingId) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please select Aging Group</span></br>';
    }

    if (this.agingConfigurationForm.value.From === '' || this.agingConfigurationForm.value.From < 0) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please enter From days</span></br>';
    }

    if (!this.agingConfigurationForm.value.To) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please enter To days</span></br>';
    }

    if (!this.agingConfigurationForm.value.Description) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please enter description</span></br>';
    }

    if (this.agingConfigurationForm.value.From > this.agingConfigurationForm.value.To) {
      validation += '<span style=\'color:red;\'>*</span> <span>From (days) should be lower than To (days)</span></br>';
    }
    if (this.agingConfigurationForm.value.From == this.agingConfigurationForm.value.To) {
      validation += '<span style=\'color:red;\'>*</span> <span>From (days) should be lower than To (days)</span></br>';
    }


    if (validation != '') {
      Swal.fire(validation);
    }

    return validation;
  }

  updateReport(event) {
    this.agingDetails.ReportId = +event
    this.getAgingNameByReportType();
    this.agingList = []
    this.pagedItems = [];
    this.agingDetails.AgingId = 0;
  }

  updateAging(event) {
    this.agingDetails.AgingId = +event
    // this.getAgingNameByReportType();
    this.getAgingList();
  }

  // * table fuction end

  getReportDropdown() {
    return new Promise((resolves, rejects) => {
      this.agingService.getDropdownList({})
        .subscribe((result: any) => {
          if (result.message == "Success") {

            if (result.data.Table.length) {
              this.reportDropdown = result.data.Table;
            }
            resolves(true);
          }
        });
    });
  }


  getAgingById() {
    return new Promise((resolve, rejects) => {
      const payload = {
        ReportAgingId: this.agingDetails.Id,
        IsActive: 1
      };
      this.agingService.getAgingById(payload).subscribe((result: any) => {
        if (result.message == "Success") {
          this.agingList = [];
          this.agingList = result.data.Table;
          this.setPage(1);
          resolve(true)
        }
      });

    })
  }

  async submit() {
    if (!this.agingDetails.ReportId || !this.agingDetails.AgingId) {
      Swal.fire("", "Please select Report Type and Aging group ", "warning")
      return;
    }

    const payload = {
      "Aging": {
        "Table": [
          {
            "Id": this.agingDetails.Id,
            "ReportId": this.agingDetails.ReportId,
            "AgingId": this.agingDetails.AgingId,
            "AgingName": '',
            "CreatedBy": localStorage.getItem('UserID')
          }
        ],
        "Table1": [...this.agingList]
      }
    }

    await this.saveAgingDetails(payload);
    this.router.navigate(['/views/aging/aging-list']);

  }

  saveAgingDetails(payload) {
    return new Promise((resolve, reject) => {
      this.agingService.saveAging(payload).subscribe((result: any) => {
        if (result.message == "Success") {
          // Swal.fire('',result.data[0],'success')
          Swal.fire('', 'Saved Successfully', 'success')
          // console.log('saved aging details', result)
          resolve(result.data[1]);
        }
      })
    })
  }

  getAgingNameByReportType() {
    return new Promise((resolve, reject) => {
      const reportType = this.reportDropdown.find((Report) => Report.ReportId == this.agingDetails.ReportId);
      const payload = {
        "ReportName": reportType.ReportName,
        "AgingName": '',
        "IsActive": 0
      };

      this.agingService.getAllAgingList(payload).subscribe((result: any) => {
        if (result.message == "Success") {
          this.agingGroupDropdown = result.data.Table;
          resolve(true);
        }
      });
    });
  }

  getAgingList() {
    const reportType = this.reportDropdown.find((Report) => Report.ReportId == this.agingDetails.ReportId);
    const agingGroup = this.agingGroupDropdown.find((aging) => aging.AgingId == this.agingDetails.AgingId);

    const payload = {
      "ReportName": reportType.ReportName,
      "AgingName": agingGroup ? agingGroup.AgingGroupName : '',
      "IsActive": 1
    };

    this.agingService.getAllAgingList(payload).subscribe((result: any) => {
      if (result.message == "Success") {
        this.agingDetails.Id = result.data.Table[0].Id;
        this.agingId = result.data.Table[0].Id;
        this.getAgingById();
      }
    });

  }

  setPage(page: number) {
    if (this.agingList.length) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }

      // get pager object from service
      this.pager = this.ps.getPager(this.agingList.length, page);

      // get current page of items
      this.pagedItems = this.agingList.slice(this.pager.startIndex, this.pager.endIndex + 1);

    } else {
      this.pagedItems = [];
    }
  }

  //  fromAndToNumberValidate(rangeList: any, fromNumberValue: any, toNumberValue: any) {
  // debugger
  //   let validation = '';

  //   let bookedSlot = [];
  //   for (let res of rangeList) {
  //     for (let i = Number(res.From); i <= Number(res.To); i++) {
  //       bookedSlot.push(i)
  //     }
  //   }
  //   console.log('bookedSlot', bookedSlot);
  //   var availableSlot = [];
  //   for (let i = fromNumberValue; i <= toNumberValue; i++) {
  //     let checkValue = bookedSlot.indexOf(i);

  //     if (checkValue == -1) {
  //       availableSlot.push(i)
  //     }
  //     else {
  //       validation += '<span style=\'color:red;\'>*</span> <span>Already, a number is allocated.</span></br>';
  //       if (availableSlot.length > 0) validation += `Available number is ${availableSlot[0]}--${availableSlot[availableSlot.length - 1]}`;
  //       else validation += `Slot is not available!!`
  //       break
  //     }
  //   }
  //   return validation;
  // }

  fromAndToNumberValidate(rangeList: any[], fromNumber: any, toNumber: any) {

    const bookedSlot = rangeList.reduce((acc, res) => acc.concat(this.range(Number(res.From), Number(res.To))), []);
    const availableSlot = [];

    for (let i = fromNumber; i <= toNumber; i++) {
      if (!bookedSlot.includes(i)) {
        availableSlot.push(i);
      } else {
        return `<span style="color:red;">*</span> <span>Already, a number is allocated.</span><br>` +
          (availableSlot.length > 0 ? `Available number is ${availableSlot[0]}-${availableSlot[availableSlot.length - 1]}` : `Slot is not available!!`);
      }
    }
    return '';
  }

  // Generate Array of number between the two number
  range(start, end) {
    // return Array(end - start + 1).fill(0).map((_, idx) => start + idx)
    const list = [];
    for (var i = start; i <= end; i++) {
      list.push(i);
    }
    return list;
  }

  enableEdit() {
    this.isEdit = !this.isEdit;
  }
}
