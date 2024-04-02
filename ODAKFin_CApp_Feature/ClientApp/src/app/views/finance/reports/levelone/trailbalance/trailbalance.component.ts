import { Component, OnInit } from '@angular/core';
import { Vendorlist } from 'src/app/model/financeModule/Vendor';
import { PaginationService } from 'src/app/pagination.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Globals } from 'src/app/globals';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { ContraVoucherService } from 'src/app/services/contra-voucher.service';
// import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-trailbalance',
  templateUrl: './trailbalance.component.html',
  styleUrls: ['./trailbalance.component.css']
})
export class TrailbalanceComponent implements OnInit {

  pager: any = {};
  pagedItems: any[];
  nav: boolean = true;
  selectedDate: any;
  PaymentLiabilityList = [];
  divisionList: any = [];
  officeList: any = [];
  balanceList: any = [];
  adjustmentList: any = [];
  adjustmentFilter: FormGroup;
  currentDate: Date = new Date();
  filterForm: any;
  selectedDivisionId: number;
  bankListDetails: any = [];


  constructor(public ps: PaginationService,
    private fb: FormBuilder,
    private router: Router, private datePipe: DatePipe,   private globals: Globals,
    private dataService: DataService,
    private commonDataService: CommonService, 
    private contraVoucherService: ContraVoucherService,) { 
      this.createFilterForm();
    }

  ngOnInit(): void {
    this.getDivisionList();
    this.getOfficeList();
    this.trailbalanceList();
    // this.createAdjustment();
    this.createFilterForm();
  }

  // createAdjustment() {
  //   this.adjustmentFilter = this.fb.group({
  //     Id: [0],
  //     DivisionId: [0],
  //     OfficeId: [0],
      
  //     Date:['']
  //   });
  // }


  navigate(){
    this.nav=false;
  }

  
  onDateChange(event: any): void {
    this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.BasedOnDate(this.selectedDate);
  }


  setPage(page: number) {
    this.pager = this.ps.getPager(this.adjustmentList.length, page);
    this.pagedItems = this.adjustmentList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
        console.log("Division List:", divisionList);
      }
    }, error => { });
  }

  getOfficeList() {
    var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.officeList = [];
      if (result.message == 'Success' && result.data.Office.length > 0) {
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
      // let data of pagedItems
    }, error => { });
  }

  // trailbalanceList() {
  //   var service = `${this.globals.APIURL}/Reports/GetTrailBalanceList`;
  //   this.dataService.post(service, this.adjustmentFilter.value).subscribe((result: any) => {
  //     this.adjustmentList = [];
  //     this.pagedItems = [];
  //     if (result.data.Table.length > 0) {
  //       this.adjustmentList = result.data.Table;
  //       this.setPage(1);
  //     }
  //   }, error => { });
  // }

  
  trailbalanceList() {
    debugger;
    var service = `
    https://odakfnqa.odaksolutions.in/api/Reports/GetTrailBalanceList
    `;
    
    // Define the payload object
    var payload = {
        "DivisionId": 1,
        "OfficeId": 0,
        "Date": ""
    };

    this.dataService.post(service, payload).subscribe((result: any) => {
        this.balanceList = [];
        if (result.message == 'Success' && result.data.Table.length > 0) {
            this.balanceList = result.data.Table;
            this.setPage(1);
        }
    }, error => {
        console.error("Error occurred:", error); // Log the error for debugging
    });
}

createFilterForm(){
  this.filterForm = this.fb.group({
    Date: [''],
    OfficeId: [''],
    DivisionId: ['']
  })
}


editBalance(id: number) {
  debugger
  // const userID = localStorage.getItem("TokenID");

  var service = `
  https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById
  `;
  
  const payload = {
    "AccountId": id,
    "Date": "",
    "DivisionId": "",
	"OfficeId" : ""
  };

 
  this.dataService.post(service, payload).subscribe(data => {
    // this.router.navigate(['/views/finance/reports/leveltwo'], { state: { data: data } });
    this.router.navigate(['/views/finance/reports/leveltwo', { id: id }])
   
  }, err => {
    console.log('error:', err.message);
  });
}

// onDivisionChange(divisionId: number){
//   debugger
//   var service = `
//   https://odakfnqa.odaksolutions.in/api/Reports/GetTrailBalanceList
//   `;
  
//   // Define the payload object
//   var payload = {
//       "DivisionId": divisionId,
//       "OfficeId": 0,
//       "Date": ""
//   };

//   this.dataService.post(service, payload).subscribe((result: any) => {
//     this.balanceList = [];
//     if (result.message == 'Success' && result.data.Table.length > 0) {
//         this.balanceList = result.data.Table;
//         this.setPage(1);
//     }
// }, error => {
//     console.error("Error occurred:", error); // Log the error for debugging
// });

// }

onDivisionChange(value: any) {
  debugger
  var selectedDivisionId = value;
  var service = `https://odakfnqa.odaksolutions.in/api/Reports/GetTrailBalanceList`;

  var payload = {
    "DivisionId": value,
    "OfficeId": 0,
    "Date": ""
  };

  this.dataService.post(service, payload).subscribe((result: any) => {
    this.balanceList = [];
    if (result.message == 'Success' && result.data.Table.length > 0) {
      this.balanceList = result.data.Table;
      this.setPage(1);
    }
  }, error => {
    console.error("Error occurred:", error); // Log the error for debugging
  });
}

onOfficeChange(values: any) {

  var service = `https://odakfnqa.odaksolutions.in/api/Reports/GetTrailBalanceList`;

  var payload = {
    "DivisionId": "",
    "OfficeId": values,
    "Date": ""
  };

  this.dataService.post(service, payload).subscribe((result: any) => {
    this.balanceList = [];
    if (result.message == 'Success' && result.data.Table.length > 0) {
      this.balanceList = result.data.Table;
      this.setPage(1);
    }
  }, error => {
    console.error("Error occurred:", error); // Log the error for debugging
  });

}

BasedOnDate(selectedDate: any) {
  debugger

  var service = `https://odakfnqa.odaksolutions.in/api/Reports/GetTrailBalanceList`;

  var payload = {
    "DivisionId": "",
    "OfficeId": "",
    "Date": selectedDate
  };

  this.dataService.post(service, payload).subscribe((result: any) => {
    this.balanceList = [];
    if (result.message == 'Success' && result.data.Table.length > 0) {
      this.balanceList = result.data.Table;
      this.setPage(1);
    }
  }, error => {
    console.error("Error occurred:", error); // Log the error for debugging
  });
    
}


getOfficeLists(id: number) {
  this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
    this.officeList = [];
    if (result['data'].Table.length > 0) {
      this.officeList = result['data'].Table;
    }
  })
}


getDivisionBasedOffice(officeId, divisoinId: any) {
debugger
  if (officeId && divisoinId) {
    let service = `${this.globals.APIURL}/Common/GetBankByOfficeId`;
    let payload = {
      "OfficeId": officeId,
      "DivisionId": divisoinId
    }
    this.dataService.post(service, payload).subscribe((result: any) => {
      if (result.message = "Success") {
        this.bankListDetails = result.data.Table;
        // this.getSameCurrencyBank()
      }
    }, error => {
      console.error(error);
    });
  }
}



}
