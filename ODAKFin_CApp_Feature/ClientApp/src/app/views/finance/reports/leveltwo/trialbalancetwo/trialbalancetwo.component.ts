import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
import { Vendorlist } from 'src/app/model/financeModule/Vendor';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-trialbalancetwo',
  templateUrl: './trialbalancetwo.component.html',
  styleUrls: ['./trialbalancetwo.component.css']
})
export class TrialbalancetwoComponent implements OnInit {

  id: number;
  dataList: any[] = [];

  filterForm: any;
  selectedDate: any;
  pager: any = {};
  pagedItems: any[];
  allItems: Vendorlist[] = [];
  officeList: any = [];
  divisionList: any = [];
  balanceList: any = [];
  currentDate: Date = new Date();
  data: any[];

  constructor(public ps: PaginationService,  private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe, private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router ) { }

  ngOnInit(): void {
    this.getDivisionList();
    this.getOfficeList();
    this. getbyidBalancelist();
    this.createReceiptFilterForm();

    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.fetchData(this.id);
    });
  }

  fetchData(id: number): void {
    debugger;
    const service = 'https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById';
  
    const payload = {
      "AccountId": id,
      "Date": "",
      "DivisionId": "",
      "OfficeId": ""
    };

    this.dataService.post(service, payload).subscribe((response: any) => {
      console.log('Response Data:', response); // Log the entire response data

      if (response.data.Table.length > 0) {
        this.dataList = response.data.Table; // Assign the array to this.dataList
        console.log('Data List:', this.dataList); // Log the extracted data list

        // If further processing/rendering is needed, do it here
      } else {
        console.error('Error: Invalid response format');
      }
    }, err => {
      console.error('Error:', err);
    });
}



//   fetchData(id: number): void {
//     debugger;
//     var service = 'https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById';
  
//     const payload = {
//       "AccountId": id,
//       "Date": "",
//       "DivisionId": "",
//       "OfficeId": ""
//     };

//     this.dataService.post(service, payload).subscribe((response: any) => {
//       // Assuming 'Table' is the property that contains the array data
//       if (response && response.Table) {
//         this.dataList = response.Table; // Extract the array from the object
//         console.log(this.dataList);
//       } else {
//         console.error('Error: Invalid response format');
//       }
//     }, err => {
//       console.error('Error:', err);
//     });
// }



  onDateChange(event: any): void {
    this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
  }

  async setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.ps.getPager(this.allItems.length, page);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
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
    }, error => { });
  }


  getbyidBalancelist() {
    var service = `
    https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById
    `;
    
    // Define the payload object
    var payload = {
      "AccountId": 784,
      "Date": "2024-04-30",
      "DivisionId": 1,
    "OfficeId" : 2
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


createReceiptFilterForm() {
  this.filterForm = this.fb.group({
    //  "AccountId": null,
    // AccountId: 784,
    Date: [''],
    OfficeId: [''],
    DivisionId : ['']
  })
}


//   getbyidBalancelist() {
//     debugger
//     var service = `
//     https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById
//     `;
    
//     // Define the payload object
//     var payload = {
//       // "AccountId": 784,
//       "Date": "2024-04-30",
//       "DivisionId": 1,
//     "OfficeId" : 2
//     };

//     this.dataService.post(service, this.filterForm.value).subscribe((result: any) => {
//         this.balanceList = [];
//         if (result.message == 'Success' && result.data.Table.length > 0) {
//             this.balanceList = result.data.Table;
//             this.setPage(1);
//         }
//     }, error => {
//         console.error("Error occurred:", error); // Log the error for debugging
//     });
// }


onDivisionChange() {
  // Call both functions when division is changed
  this.createReceiptFilterForm();
  this.getbyidBalancelist();
}
}




