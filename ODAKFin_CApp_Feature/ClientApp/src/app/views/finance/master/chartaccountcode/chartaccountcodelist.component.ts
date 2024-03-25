import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnChanges, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COAConfigurationModel, Maninaccountlabel, ManinaccountlabelListItem, SaveCOAConfiguration } from 'src/app/model/Createchartaccountcode';
import {  ChartaccountcodeService } from 'src/app/services/chartaccountcode.service';
import Swal from 'sweetalert2';

@Pipe({ name: 'values',  pure: false })
export class ValuesPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return Object.keys(value).map(key => value[key]);
  }
} 
@Component({
  selector: 'app-chartaccountcodelist',
  templateUrl: './chartaccountcodelist.component.html',
  styleUrls: ['./chartaccountcodelist.component.css']
})
export class ChartaccountcodelistComponent implements OnInit,OnChanges {

  SubaccountName : Maninaccountlabel[]=[];
  editchequeId: any;
  FinancialForm: FormGroup;
  ms: any;
  allItems: any;
  groubedByMainAccountGroupName: Maninaccountlabel[]= [];
  maninaccountlabelListItemList : ManinaccountlabelListItem[]=[];
  cOAConfigurationModel : COAConfigurationModel[]=[];
  saveCOAConfiguration : SaveCOAConfiguration= new SaveCOAConfiguration();
  constructor(private router: Router, private route: ActivatedRoute, private coaService:  ChartaccountcodeService, private fb: FormBuilder,private cd: ChangeDetectorRef) { 
    this.route.queryParams.subscribe(params => {
      this.FinancialForm = this.fb.group({
        ID: params['id']
      });
    });
  }

  ngOnInit(): void {
    
    this.getSubAccountGroup();
    this.cd.markForCheck()

  }
  ngOnChanges()
  {
    // console.log("Updates");
  }
  getSubAccountGroup() {
    
    let  maninaccountlabel= new Maninaccountlabel();
    this.coaService.getSubAccountGroup(maninaccountlabel).subscribe(response => {
      
      // this.groubedByMainAccountGroupName = groupBy(response['data'], 'MainAccountGroupName')
       this.groubedByMainAccountGroupName = response['data'];
       this.getCOAConfigurationList(this.groubedByMainAccountGroupName);
    });
  }
  getCOAConfigurationList(groubedByMainAccountGroupName: Maninaccountlabel[]) 
  {
    // console.log(groubedByMainAccountGroupName);
    let  coaConfigurationModel= new COAConfigurationModel();
    this.coaService.getGetCOAConfigurationList(coaConfigurationModel).subscribe(response => {
      // console.log(response['data'])
      
      if(response['data'] && response['data'].length>0){
        response['data'].forEach((element,index) => {
          if(groubedByMainAccountGroupName[index].SubAccountGroupId == element.SubAccountGroupID ){
          var temData = element;
          
          temData.SubAccountGroupName   = groubedByMainAccountGroupName[index].SubAccountGroupName;
          temData.MainAccountGroupName  = groubedByMainAccountGroupName[index].MainAccountGroupName;
          temData.MainAccountGroupId    = groubedByMainAccountGroupName[index].MainAccountGroupId;
          temData.isExpand = index==0?true:false;
          this.maninaccountlabelListItemList.push(temData)
          }  
      });
      this.maninaccountlabelListItemList =  groupBy(this.maninaccountlabelListItemList, 'MainAccountGroupName');
      // console.log( this.maninaccountlabelListItemList)
    
  }
});
}
onSubmit()
{
  let tempListdata = JSON.parse(JSON.stringify(this.maninaccountlabelListItemList));
   let digitIssue = false;
   let lable = null;
  for (const key in tempListdata) {
  
    tempListdata[key].forEach((val)=>{ console.log(val.StartingNumber.toString().length,val.NumberOfDigits)
      
    if(val.StartingNumber.toString().length!=val.NumberOfDigits && digitIssue==false){
      digitIssue = true;
      lable = val.SubAccountGroupName;
    }
    
    })
   // this.cOAConfigurationModel.push(val);
    
  }
  if(digitIssue){
    Swal.fire("<span style='color:red;'>*</span> <span> Account Type  "+lable+" Starting Number Length Is Greater Then Number Of Digit Given </span></br>");
    return false;
  }
  for (const key in tempListdata) {
  
    tempListdata[key].forEach((val)=>{ console.log(val)
      delete val.SubAccountGroupName;
    delete val.MainAccountGroupId;
    delete val.MainAccountGroupName;
    delete val.isExpand;
    this.cOAConfigurationModel.push(val);
    })
   // this.cOAConfigurationModel.push(val);
    
  }
  
  // console.log( this.cOAConfigurationModel);
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
  })
  .then((result) => {
    if (result.value) {
      this.saveCOAConfiguration.COAConfiguration = this.cOAConfigurationModel;
      this.coaService.saveCOAConfiguration(this.saveCOAConfiguration).subscribe((response)=>{
         // Swal.fire(response['message'])
         Swal.fire({
        //  position: 'top-end',
          icon: 'success',
          title: response['data'],
          showConfirmButton: false,
          timer: 2500
        })
      })
    }
    //console.log('cancel');
  });
}
reset()
{
  // console.log(this.cd)
  Swal.fire({
    showCloseButton: true,
    title: '',
    icon: 'question',
    text: 'Do you want to cancel this operation?',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: false,
    allowOutsideClick: false
  })
  .then((result) => {
    if (result.value) {this.router.navigate(['/views/finance/financemaster']);}
    //console.log('cancel');
  });
}
onBack()
{
  this.router.navigate(['/views/finance/financemaster'])
}

 
}
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
var groupByAggregate = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x.SubAccountGroupId);
    return rv;
  }, {});
};
