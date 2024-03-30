import { Component, OnInit } from '@angular/core';
import { Vendorlist } from 'src/app/model/financeModule/Vendor';
import { PaginationService } from 'src/app/pagination.service';


@Component({
  selector: 'app-trialbalancetwo',
  templateUrl: './trialbalancetwo.component.html',
  styleUrls: ['./trialbalancetwo.component.css']
})
export class TrialbalancetwoComponent implements OnInit {

  selectedDate: Date;
  pager: any = {};
  pagedItems: any[];
  allItems: Vendorlist[] = [];

  constructor(public ps: PaginationService) { }

  ngOnInit(): void {
  }
  onDateChange(event: any): void {
    this.selectedDate = event.value;
  }

  async setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.ps.getPager(this.allItems.length, page);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }



}
