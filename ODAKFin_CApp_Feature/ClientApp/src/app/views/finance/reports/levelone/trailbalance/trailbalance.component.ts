import { Component, OnInit } from '@angular/core';
import { Vendorlist } from 'src/app/model/financeModule/Vendor';
import { PaginationService } from 'src/app/pagination.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
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
  PaymentLiabilityList = []


  constructor(public ps: PaginationService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
  }

  navigate(){
    this.nav=false;
  }

  
  onDateChange(event: any): void {
    this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
  }

  setPage(page: number) {
    if (this.PaymentLiabilityList.length) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }
     
      this.pager = this.ps.getPager(this.PaymentLiabilityList.length, page);
      this.pagedItems = this.PaymentLiabilityList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else {
      this.pagedItems = [];
    }
  }

}
