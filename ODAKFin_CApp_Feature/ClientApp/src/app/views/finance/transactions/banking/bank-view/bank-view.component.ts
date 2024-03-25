import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bank-view',
  templateUrl: './bank-view.component.html',
  styleUrls: ['./bank-view.component.css']
})
export class BankViewComponent implements OnInit {
  currentTabName = 'Bank Summary'
  @ViewChild('bankBookTab', { static: false }) bankBookTab: ElementRef;
  bankSummaryFilterData: any;
  constructor() { }

  ngOnInit(): void {
  }

  CurrentTAB(tabName){
    this.currentTabName = tabName;
  }

  navigateToBook(formData){
    this.currentTabName = 'Bank Book';
    this.bankSummaryFilterData = formData
    this.bankBookTab.nativeElement.click();
  }
  

}
