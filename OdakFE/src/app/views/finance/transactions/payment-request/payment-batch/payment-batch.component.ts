import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-batch',
  templateUrl: './payment-batch.component.html',
  styleUrls: ['./payment-batch.component.css']
})
export class PaymentBatchComponent implements OnInit {

  currentTabName = 'Open Request';
  bankSummaryFilterData: any;
  

  constructor() { }

  ngOnInit(): void {
  }

  CurrentTAB(tabName: any){
    this.currentTabName = tabName;
  }

  navigateToBook(formData){
    this.currentTabName = 'Bank Book';
    this.bankSummaryFilterData = formData
    // this.bankBookTab.nativeElement.click();
    
  }

  // onSelectedTab(data: any){

  //   console.log(data,'wgwgwegwg');
  //   this.currentTabName = data
  //   debugger
    

  // } 

}
