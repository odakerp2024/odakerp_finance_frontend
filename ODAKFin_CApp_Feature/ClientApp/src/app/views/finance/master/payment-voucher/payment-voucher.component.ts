import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alerttype, AlerttypesSearch, Country, CountrySearch, countryYearSearch, FinancialYear, FinancialYearSearch, GetRegion, GetRegionSearch, States,StatesSearch } from '../../../../model/organzation';
import {OrganizationModel, OrgDetails} from '../../../../model/OrgModel';
import {DivisionMaster, OrganizationOffice, OrganizationOfficeApi} from '../../../../model/common';
import {Attachments, BasicOrgDetails, Division, DivisionLable, EmailAlerts, OfficeDetails} from '../../../../model/financeModule/paymentVoucher';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { valHooks } from 'jquery';
declare let $: any;

@Component({
  selector: 'app-payment-voucher',
  templateUrl: './payment-voucher.component.html',
  styleUrls: ['./payment-voucher.component.css']
})
export class PaymentVoucherComponent implements OnInit {
branchCode='BRV';
code='BRV10001FY';

  statusvalues: any[] = [
    { value: '1', viewValue: 'ACTIVE' },
    { value: '2', viewValue: 'IN-ACTIVE' },
];

  //[x: string]: any;
  myControl = new FormControl('');
  Organizationform: FormGroup;
  AccTypevalues: States[];
  AccTypevaluesd:Alerttype[];
  AccTypeyear:FinancialYear[];
  AccTypecountry:Country[];
  stateLook : StatesSearch;
  AccTyperegional:GetRegion[];
  regionLook : GetRegionSearch;

  AlerttypeLook :AlerttypesSearch;
  CountryLook :CountrySearch;
  organizationModel : OrganizationModel = new OrganizationModel();
  orgDetailsSave :OrgDetails=new OrgDetails();
  basicOrgDetails : BasicOrgDetails = new BasicOrgDetails();
  officedetails :OfficeDetails =new OfficeDetails();
  emailAlerts : EmailAlerts[]=[];
  Attachments:Attachments =new Attachments();
  divisionMaster :DivisionMaster = new DivisionMaster();
  divisionMasterList :DivisionLable[]=[] ;
  division :Division[]=[];
  
  isRegistrationAddress :boolean=false;
  FinancialLook:FinancialYearSearch;
  countryYearSearchData : countryYearSearch;
  isSaleOffice :boolean=false;
  organizationOffice : OrganizationOfficeApi= new OrganizationOfficeApi();
  organizationOfficeList : OrganizationOffice[];
  alertType:Number=null;
  emailId:String=null;
  editOrgId:Number = 0;
  OrganizationOffice_Id:number =0;
  todaydate:string;
  StateVisiable: boolean=true;
  StateVisiables: boolean=true;
  isSaleOffices: boolean=false;
  parentOffice:boolean=false;
  time: string;
  name = 'NAVIO SHIPPING PVT LTD';
  finacialYearDisable :boolean=true;
  isReadonly = false;
  selectedCompany:String='';
  result: any=[];
  constructor(private router: Router, private route: ActivatedRoute,private fb: FormBuilder, private service: MastersService,) { 
    

   

    this.route.queryParams.subscribe(params => {

      this.Organizationform  = this.fb.group({
          ID: params['id'],

      });
  });
  }

  ngOnInit(): void {
    const component = this;
    $('.my-select').select2();
    $('#BusinessLocation').on('select2:selecting', function(e) {
      console.log('Selecting: ' , e.params.args.data);
      //this.Organizationform.value.BusinessLocation
    component.Organizationform.controls['BusinessLocation'].setValue(e.params.args.data.id)
    component.OnBindDropdownStates();
    });
   $('#state').on('select2:selecting', function(e) {
    console.log('Selecting: ' , e.params.args.data);
    //this.Organizationform.value.BusinessLocation
    component.Organizationform.controls['State'].setValue(e.params.args.data.id)
    //component.OnBindDropdownStates();
  });
   // this.OnBindDropdownStates();
    console.log( this.route.snapshot.params['id'])
	
    this.OnBindDropdownAlerttype()
    this.OnBindDropdownFinancialYear()
    this.OnBindDropdownCountry()
    this.getBusinessDivision();
    this.createForm();
    this.getParentsOffice();  
    this.OnBindDropdownRegion()

    
    if(this.route.snapshot.params['id']>0)
    { 
		this.editOrgId = Number(this.route.snapshot.params['id']);
        this.getOrganizationDetails(this.editOrgId);
    }
	else{
		var saveObj = {"OrganizationEmailAlertId":0,"OrganizationId":0,"AlertTypeId":null,"EmailId":this.emailId}
		this.emailAlerts.push(saveObj);
	  }

    /*this.orgDetailsSave.Table.push( this.basicOrgDetails)
    console.log(this.orgDetailsSave)*/
  }
  OnBindDropdownStates() {
    ///this.Organizationform.controls.OfficeCode.setValue(null);
    this.Organizationform.controls['PANNumber'].setValue(null)
    this.Organizationform.controls['GSTNumber'].setValue(null)
    //this.Organizationform.controls['stateID'].setValue(null)
   this.stateLook={"stateID":this.Organizationform.value.BusinessLocation};
    console.log(this.stateLook);

    this.service.getStateLists(this.stateLook).subscribe(data => {
      this.AccTypevalues = data['data'];
      //this.AccTypecountry.forEach(element => {
       // if(element.ID == this.Organizationform.value.BusinessLocation)
       // {
        //this.Organizationform.controls.OfficeCode.setValue(element.CountryName.slice(0,3));
        //}
      //})

      
    
      //if(this.Organizationform.value.isSaleOffice)
      
      if(this.Organizationform.value.BusinessLocation!=53){
        this.StateVisiable = false;
        this.isSaleOffices =false;
       // this.isSate=false;
        
      }
      else{
         this.StateVisiable = true;
         this.isSaleOffices =true;
        // this.isSate=true;
        }
    });
    this.getCountryFinancialYear();
}
setOnBindDropdownStates(stateId) {
    this.stateLook={"stateID":stateId};
    console.log(this.stateLook);

    this.service.getStateLists(this.stateLook).subscribe(data => {
      this.AccTypevalues = data['data'];
		this.Organizationform.controls.State.setValue(stateId);
    });
    this.getCountryFinancialYear();
}
setOnBindDropdownStatesByedit(stateId,coutryId) {
  this.stateLook={"stateID":coutryId};
  console.log(this.stateLook);

  this.service.getStateLists(this.stateLook).subscribe(data => {
    this.AccTypevalues = data['data'];
  this.Organizationform.controls.State.setValue(stateId);
  });
  this.getCountryFinancialYear();
}
updateBasicOrgDetails(){
 this. basicOrgDetails.OrganizationId= this.editOrgId;
 this. basicOrgDetails.OrganizationName= this.Organizationform.value.Entityvalue;
 this. basicOrgDetails.CountryID=  Number($('#BusinessLocation').val());
 this. basicOrgDetails.FinancialYearID= Number($('#FinancialYear').val());
 this. basicOrgDetails.CompanyIncorporationNo= this.Organizationform.value.CompanyIncorporation ;
 this. basicOrgDetails.PANNo= this.Organizationform.value.PANNumber ;
 this. basicOrgDetails.IsRegistrationAddress= this.Organizationform.value.IsRegistrationAddress;
 this. basicOrgDetails.RegistrationAddress= this.Organizationform.value.RegistrationAddress ;

}
updateOfficeDetails(){
  this.officedetails.OrganizationOfficeId= this.OrganizationOffice_Id ; 
  this.officedetails.OrganizationId= this.editOrgId ; 
  this.officedetails.OfficeName= this.Organizationform.value.OfficeName ;
  this.officedetails.OfficeCode= this.Organizationform.value.OfficeName.substring(0,3) ;
  this.officedetails.GSTNo= this.Organizationform.value.GSTNumber ;
  this.officedetails.OfficePinCode= this.Organizationform.value.PinCode ;
  this.officedetails.OfficeTelephone= this.Organizationform.value.TelphoneNumber ;
  if(this.StateVisiable==false){
    this.officedetails.StateId= null;
  }
  else{
    //var newOption = new Option(data.text, data.id, true, true);
    // Append it to the select
    //$('#mySelect2').append(newOption).trigger('change');
    console.log($('#state').val())
    this.officedetails.StateId = Number($('#state').val());
    console.log( this.officedetails.StateId);
    

  }
 // this.officedetails.StateId= this.Organizationform.value.State?Number(this.Organizationform.value.State ):null;
  this.officedetails.OfficeAddress= this.Organizationform.value.Address ;
  this.officedetails.IsRegionalOffice= Number($('#RegionalOffice').val()) ;
  console.log(Number(this.Organizationform.value.RegionalOffice));
 
  this.officedetails.EffectiveFrom= this.Organizationform.value.EffectiveFrom ;
  this.officedetails.ParentOfficeID= Number($('#ParentOffice').val())  ;
  this.officedetails.IsSalesOffice= this.Organizationform.value.IsPrincipalAcct ;
  //if(!this.Organizationform.value.IsPrincipalAcct ){this.officedetails.StateId=null}
  console.log(this.officedetails);
 this.officedetails.IsActive= this.Organizationform.value.IsBlock ;
}

updateEmailAlerts(){
 // this.EmailAlerts.AlertTypeId= this.Organizationform.value.AlertType ;
  //this.EmailAlerts.EmailId= this.Organizationform.value.EmailID ;
}

updateAttachments(){
  //this.Attachments.DocumentName= this.Organizationform.value.DocumentName ;
 // this.EmailAlerts.EmailId= this.Organizationform.value.EmailID ;
}


  createForm() {
       
    this.Organizationform = this.fb.group({
      ID: 0,
        Entityvalue: '',
        BusinessLocation:null,
        FinancialYear:null,
        CompanyIncorporation:'',
        PANNumber:'',
        BusinessDivisions:this.fb.array( []),
        RegistrationAddress:'',
        IsRegistrationAddress:'',
        IsSubAccount:'',
        OfficeName:'',
        OfficeCode:'',
        GSTNumber:'',
        State:null,
        PinCode:'',
        TelphoneNumber:'',
        Address:'',
        RegionalOffice:null,
        EffectiveFrom:'',
        ParentOffice:null,
        IsBlock:'',
        IsPrincipalAcct:false,
        AccountType:'',
        Status: 0,
        StatusV: '',
        AlertType:null,
        EmailID:'',
        DocumentName:''

    });

    //var str =moment(this.chequeForm.get('currentDate').value).subtract(1, 'month').format('DD-MM-YYYY');
    var dt = new Date().toISOString(); 
   console.log(dt);
   this.Organizationform.controls.EffectiveFrom.setValue(dt.split('T')[0])
    
}
  onSubmit() 
  {
    var validation = "";

console.log(this.AccTypecountry[51].CountryName);
    //if (this.Organizationform.value.Entityvalue == "") {
        //validation += "<span style='color:red;'>*</span> <span>Please Enter Region Name</span></br>"
    //}
    if (this.Organizationform .value.Entityvalue == 0) {
        validation += "<span style='color:red;'>*</span> <span>Please enter Entityvalue</span></br>"
    }

      
  if (!this.Organizationform.value.CompanyIncorporation || this.Organizationform.value.CompanyIncorporation=="" || this.Organizationform.value.CompanyIncorporation<0) {
    validation += "<span style='color:red;'>*</span> <span>Please enter Company Incorporation</span></br>"
}
    if(this.Organizationform.value.BusinessLocation==53) {
      
      if (!this.Organizationform.value.PANNumber || this.Organizationform.value.PANNumber.trim()=="") {
        validation += "<span style='color:red;'>*</span> <span> Please enter PAN Number </span></br>"
      }
      else if (this.Organizationform.value.PANNumber.length < "10") {
        validation += "<span style='color:red;'>*</span> <span> Pan Number Must be in 10 Characters </span></br>"
      }
     
    }
    var reg = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
    
    //let gstPattern =/^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/";
  if(this.Organizationform.value.BusinessLocation==53) {
      
    if (!this.Organizationform.value.GSTNumber || this.Organizationform.value.GSTNumber.trim()=="") {
      validation += "<span style='color:red;'>*</span> <span> Please enter GST Number </span></br>"
    }
    else if (this.Organizationform.value.GSTNumber.length!=15)
   {
   validation += "<span style='color:red;'>*</span> <span>Please  enter Valid GST Number</span></br>"
  }
  else if (!reg.test(this.Organizationform.value.GSTNumber))
   {
    
   validation += "<span style='color:red;'>*</span> <span>Please  enter Valid GST Number</span></br>"
  }
  }
    if (!this.Organizationform .value.OfficeName||this.Organizationform.value.OfficeName.trim()=="") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Office Name</span></br>"
    }

    if (!this.Organizationform .value.PinCode||this.Organizationform.value.PinCode.trim()=="") {
      validation += "<span style='color:red;'>*</span> <span>Please enter PinCode</span></br>"
    }
    if(this.Organizationform.value.BusinessLocation==53 && this.Organizationform.value.PinCode.trim()!="" && this.Organizationform.value.PinCode.trim().length!=6)
    {
      var z1 = /^[0-9]*$/;
      if (!z1.test(this.Organizationform.value.PinCode)) {
        validation += "<span style='color:red;'>*</span> <span>Please enter Correct PinCode</span></br>"
       }
    }
    if(this.Organizationform.value.BusinessLocation==53 && this.Organizationform.value.PinCode.trim()!="")
    {
      var z1 = /^[0-9]*$/;
      if (!z1.test(this.Organizationform.value.PinCode)) {
        validation += "<span style='color:red;'>*</span> <span>Please enter Correct PinCode</span></br>"
       }
    }
   if(this.AccTypeyear.length==0){
      validation += "<span style='color:red;'>*</span> <span> No Financial Year avaliable for selected country</span></br>"
   
    }
    else if ($('#FinancialYear').val() == "null") {
      validation += "<span style='color:red;'>*</span> <span>Please select Financial Year</span></br>"
    }


    if (this.AccTyperegional.length==0) {
      validation += "<span style='color:red;'>*</span> No Regional Office Options available <span></span></br>"
  } 
   else if ($('#RegionalOffice').val() == "null") {
      validation += "<span style='color:red;'>*</span> <span>Please select Regional Office</span></br>"
  }
  if(this.Organizationform.value.BusinessLocation==53 && this.Organizationform.get('State').value==null) {
    validation += "<span style='color:red;'>*</span> <span>Please select State</span></br>"
      
  }
  
    //var PANNumber = this.Organizationform.value.PANNumber

    //if (this.Organizationform.value.IsPrincipalAcct && !($('#ParentOffice').val() ==null)) {
      //validation += "<span style='color:red;'>*</span> <span>Please Select Parent Office</span></br>"
    //}
    if (this.Organizationform.value.IsPrincipalAcct == true) {
      var ParentOffice = $('#ParentOffice').val();
      if (ParentOffice == "null"||!ParentOffice ==true) {
        validation += "<span style='color:red;'>*</span> <span>Please select Parent Office</span></br>"
      }
      
    }

    
  if (this.Organizationform.value.IsRegistrationAddress == true) {
    var registration = $('#registration').val();
    if (registration == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Registration Address</span></br>"
    }
    
  }
  if(this.emailAlerts.length>1)
      {
        
        let resultduplicate = 0;//
        //let result =[];
         this.result = Object.values(this.emailAlerts.reduce((c, v) => {
          let k = v.EmailId.toLowerCase() + '-' + v.AlertTypeId;
          c[k] = c[k] || [];
          c[k].push(v);
          return c;
        }, {})).reduce((c:any, v:any) => v.length > 1 ? c.concat(v) : c, []);
       //console.log(result); return false;
        if(this.result.length>0)
        {
          Swal.fire('', "Selected alert type and email already added!", 'warning');
          return false;
        }
      }


  

  
 

    if (validation != "") {

        Swal.fire(validation)
        return false;
    }
    this.updateBasicOrgDetails();
   this.updateOfficeDetails();
    //this.orgDetailsSave.Table = this. basicOrgDetails;
    console.log(this.orgDetailsSave);
    //console.log(this.officedetails);
    let tempEmailAlert = [];
    this.emailAlerts.forEach(element => { //JSON.parse(JSON.stringify(obj));
      var saveObj = {"OrganizationEmailAlertId":0,"OrganizationId":this.editOrgId,"AlertTypeId":Number(element.AlertTypeId),"EmailId":element.EmailId,}
      tempEmailAlert.push(saveObj);
   });
    this.division =[];
    this.divisionMasterList.forEach((element)=>{
      
      if(element.isChecked){
        let tempDivisionData = new Division();
        tempDivisionData.DivisionId=element.DivisionId
        tempDivisionData.OrganizationDivisionId=element.OrganizationDivisionId
        tempDivisionData.OrganizationId=element.OrganizationId
        this.division.push(tempDivisionData)
      }
    })
    if(this.division.length==0){
      Swal.fire("<span style='color:red;'>*</span> <span>Please select Business Divisions</span></br>")
        return false;
    }
    this.orgDetailsSave.Table=[];
    this.orgDetailsSave.Table1=[];
    this.orgDetailsSave.Table2=[];
    this.orgDetailsSave.Table4=[];
    this.orgDetailsSave.Table.push( this.basicOrgDetails)
    this.orgDetailsSave.Table1.push( this.officedetails)
    this.orgDetailsSave.Table2=tempEmailAlert;
    this.orgDetailsSave.Table4= this.division;
    this.organizationModel.Organization=this.orgDetailsSave;
    //this.organizationModel.Organization.Table3.push( )
   // console.log(this.organizationModel); 
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
      this.service.saveOrangsation(this.organizationModel).subscribe(response => {
       // Swal.fire(response['data'])
        //this.Organizationform.reset();
        if (response["message"] == "Failed") { 
          let dataMs = response['data'].toString();
          if(dataMs.search("Organization Name already exists")!=-1)
          {
            Swal.fire("Organization Name already exists", '', 'error')
          }
          else{
            Swal.fire(response['data'], '', 'error')
          }
           }
        else {
          Swal.fire(response["data"], '', 'success').then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.onBack();
            }
          })
        }
       // this.router.navigate(['/views/finance/master/organization/organizationview']);
        //Swal.fire(Data)
    },
        (error: HttpErrorResponse) => {
            Swal.fire(error.message)
        });
    }
    //console.log('cancel');
  });
    
}
onBack()
{
  this.router.navigate(['/views/finance/master/organization/organizationview']);
}



OnBindDropdownAlerttype() {
  this.AlerttypeLook={"alertID":0};
  console.log(this.AlerttypeLook);

  this.service.getAlertLists(this.AlerttypeLook).subscribe(data => {
      this.AccTypevaluesd = data['data'];

  });
}
OnBindDropdownFinancialYear() {
  this.FinancialLook={"financialYearID":0,"AssessmentYear":''};
  console.log(this.AlerttypeLook);

  this.service.getFinancialList(this.FinancialLook).subscribe(data => {
    
    let temp = data
    this.AccTypeyear = temp['data'];
   // console.log();

  });
}
getCountryFinancialYear() {
  this.countryYearSearchData={"financialYearID":0,"countryID":this.Organizationform.value.BusinessLocation};
  console.log(this.AlerttypeLook);

  this.service.getFinancialCountryList(this.countryYearSearchData).subscribe(data => {
    
    let temp = data
    //let temp1 = data
    this.AccTypeyear = temp['data'];
    //this.AccTypecountry = temp1['data'];
	if(this.AccTypeyear.length==0)
	{
    this.finacialYearDisable = true;
		Swal.fire("No Financial Year Available for Selected Country ");
    return false;
	}
  else{
    this.finacialYearDisable = false;
  }
  

  });
}
setCountryFinancialYear(id,fid) { console.log('<>',fid)
  this.countryYearSearchData={"financialYearID":0,"countryID":id};
  console.log(this.AlerttypeLook);

  this.service.getFinancialCountryList(this.countryYearSearchData).subscribe(data => {
    
    let temp = data
    this.AccTypeyear = temp['data'];
	 //
    setTimeout(function(){ $('#FinancialYear').val(fid).trigger('change')},2000)
    this.Organizationform.controls.FinancialYear.setValue(fid);
    
   
	
  
  

  });
}

OnBindDropdownCountry() {
  this.CountryLook={"countryId":0};
  console.log(this.CountryLook);

  this.service.getCountryLists(this.CountryLook).subscribe(data => {
      this.AccTypecountry = data['data'];
//      console.log(this.AccTypecountry )

       
    let temp = data
    this.AccTypecountry = temp['data'];
	if(this.AccTypecountry.length==53)
	{
		Swal.fire("test");
	return false;
	}
      
  });
}
getBusinessDivision()
{
  this.service.getBusinessDivision(this.divisionMaster).subscribe(data => {
    console.log(data['data'])
    //this.divisionMasterList = data['data'];
    if(data['data'].length>0){
      data['data'].forEach(element => {

        this.divisionMasterList.push({"OrganizationDivisionId":0,
        "OrganizationId":(this.editOrgId>0?1:0),"DivisionId":element.Id,"DivisionLable":element.DivisionName,"isChecked":false})
      });

    }


    //this.division.push()

});
}
getParentsOffice()
{ this.organizationOffice.organizationOfficeID=0;
  this.service.getParentsOffice(this.organizationOffice).subscribe(data => {
    console.log(data['data'])
    this.organizationOfficeList = data['data'];

});
}
BlockChange(event)
{
  console.log(this.Organizationform.value.RegistrationAddress);
  this.isRegistrationAddress = false;
  if(this.Organizationform.value.IsRegistrationAddress)
  {
    this.isRegistrationAddress = true;
  }
}
SaleOffChange(event)
{
  console.log(this.Organizationform.value.IsPrincipalAcct);
  this.parentOffice = false;
  if(this.Organizationform.value.IsPrincipalAcct)
  {
    this.parentOffice = true;
  }
  else{
   // this.Organizationform.value.ParentOffice=null;
    this.Organizationform.controls['ParentOffice'].setValue(null);
  }
}
divisionChange(event)
{
 console.log(event.target.value)

 this.divisionMasterList.forEach((element)=>{
  if(element.DivisionId==event.target.value)
  { console.log(element)
    element.isChecked=element.isChecked==true?false:true;
  }
 })
 /*
  if(this.division.length==0)
  {
    this.division.push({"OrganizationDivisionId":(this.editOrgId>0?1:0),
    "OrganizationId":(this.editOrgId>0?1:0),"DivisionId":event.target.value})
  }
  else{
    let duplicate =0;
    this.division.forEach((element,index)=>{
      if(element.DivisionId==event.target.value){
        delete this.division[index];
        duplicate = 1;
      }
    });
    if(duplicate==0)
    {
      this.division.push({"OrganizationDivisionId":(this.editOrgId>0?1:0),
      "OrganizationId":(this.editOrgId>this.editOrgId?1:0),"DivisionId":event.target.value})
    }
  }
 
  console.log(this.Organizationform);*/
  
}


OnBindDropdownRegion() {
  this.regionLook={"regionId":0,};
  console.log(this.regionLook);

  this.service.getRegionalLists(this.regionLook).subscribe(data => {
      this.AccTyperegional = data['data'];
      console.log(this.AccTyperegional )

  });
}

AddTerminal(i,id)
{
  /*console.log(id);
  console.log(this.emailAlerts[id])
return false;
  console.log(this.alertType,this.emailId);*/
  let emailPattern = 
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if(!this.emailAlerts[i].AlertTypeId)
  {
    Swal.fire("Please Select Alert Type");
    return false;
  }
  if(!this.emailAlerts[i].EmailId || this.emailAlerts[i].EmailId.trim()=='')
  {
    Swal.fire("Please Enter Alert Email");
    return false;
  }

  
  if(this.emailAlerts[i].EmailId.trim()!="")
  {
    if(!this.emailAlerts[i].EmailId.trim().match(emailPattern))
    {
      Swal.fire("Please Enter Valid Alert Email");
      return false;
    }
    else{
      let alertTypeValue = null;
      if(this.emailAlerts.length>1)
      {
        let duplicate = 0;//
        this.emailAlerts.forEach((element,index) => {
          if(index!=i && (element.AlertTypeId==this.emailAlerts[i].AlertTypeId && element.EmailId.toLowerCase() ==this.emailAlerts[i].EmailId.toLowerCase())){  
            //(index!=i && (element.AlertTypeId==this.emailAlerts[i].AlertTypeId && ))
           duplicate = 1;
          }
       });
        if(duplicate>0)
        {
          Swal.fire('', "Selected alert type and email already added!", 'warning');
          return false;
        }
      }
      
      var saveObj = {"OrganizationEmailAlertId":0,"OrganizationId":0,"AlertTypeId":0,"EmailId":""}
      this.emailAlerts.push(saveObj);
      console.log(this.emailAlerts);
      this.emailId=null;
      this.alertType=null;
    }
  }
   
  
}
alertEmailRemove(id)

  {
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to Delete this Details?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    })
    
 .then((result) => {
  
  if (result.value) 
  {
    this.emailAlerts.forEach((element,index) => {
      if(element.AlertTypeId==id){  
        //delete this.emailAlerts[index];
        this.emailAlerts.splice(index, 1);
        //Swal.fire("Selected Alert type Already Added!");
      }

      
    })
    if(this.emailAlerts.length==0){
    var saveObj = {"OrganizationEmailAlertId":0,"OrganizationId":0,"AlertTypeId":null,"EmailId":this.emailId}
		this.emailAlerts.push(saveObj);
    }
  }
  
   });

   
   console.log(this.emailAlerts)
  }
  getOrganizationDetails(id)
  {
    
    let temp = {"OrganizationId":id};
    this.service.getOrangzationDetails(temp).subscribe(response => {
      console.log(response['data'].Table2);
     this.Organizationform.controls.Entityvalue.setValue(response['data'].Table[0]['OrganizationName']);
     this.Organizationform.controls.CompanyIncorporation.setValue(response['data'].Table[0]['CompanyIncorporationNo']);
     this.Organizationform.controls.BusinessLocation.setValue(response['data'].Table[0]['CountryID']);
     $('#BusinessLocation').val(response['data'].Table[0]['CountryID']).trigger('change')
      this.Organizationform.controls.PANNumber.setValue(response['data'].Table[0]['PANNo']);
     this.Organizationform.controls.IsRegistrationAddress.setValue(response['data'].Table[0]['IsRegistrationAddress']);
     this.isRegistrationAddress = response['data'].Table[0]['IsRegistrationAddress'];
     this.Organizationform.controls.RegistrationAddress.setValue(response['data'].Table[0]['RegistrationAddress']);
    
	if(response['data'].Table1.length>0){
    this.isSaleOffices = false;
    if(response['data'].Table1[0]['IsSalesOffice']){ this.isSaleOffices = true;}
    this.OrganizationOffice_Id =response['data'].Table1[0]['OrganizationOfficeId'];
   this.Organizationform.controls.IsPrincipalAcct.setValue(response['data'].Table1[0]['IsSalesOffice']);
   this.setCountryFinancialYear(response['data'].Table[0]['CountryID'],response['data'].Table[0]['FinancialYearID']);
   
   this.isSaleOffice = response['data'].Table1[0]['IsSalesOffice'];
	 this.Organizationform.controls.OfficeName.setValue(response['data'].Table1[0]['OfficeName']);
	 this.Organizationform.controls.OfficeCode.setValue(response['data'].Table1[0]['OfficeCode']);
	 
	 this.setOnBindDropdownStatesByedit(response['data'].Table1[0]['StateId'],response['data'].Table[0]['CountryID']);
	 
	 this.Organizationform.controls.GSTNumber.setValue(response['data'].Table1[0]['GSTNo']);
	 this.Organizationform.controls.PinCode.setValue(response['data'].Table1[0]['OfficePinCode']);
	 this.Organizationform.controls.TelphoneNumber.setValue(response['data'].Table1[0]['OfficeTelephone']);
	 this.Organizationform.controls.Address.setValue(response['data'].Table1[0]['OfficeAddress']);
   
	 //this.Organizationform.controls.RegionalOffice.setValue(response['data'].Table1[0]['IsRegionalOffice']==true?1:2);
   //$('#RegionalOffice').val(response['data'].Table1[0]['IsRegionalOffice']).trigger('change');
   //setTimeout(function(){ $('#RegionalOffice').val().trigger('change')},2000)

   setTimeout(function(){$('#RegionalOffice').val(response['data'].Table1[0]['IsRegionalOffice']).trigger('change');},2000)
	 this.Organizationform.controls.EffectiveFrom.setValue(response['data'].Table1[0]['EffectiveFrom'].split('T')[0]);
   $('#ParentOffice').val(response['data'].Table1[0]['ParentOfficeID']).trigger('change')
	 this.Organizationform.controls.ParentOffice.setValue(response['data'].Table1[0]['ParentOfficeID']);
	 this.Organizationform.controls.IsBlock.setValue(response['data'].Table1[0]['IsActive']);
    }
     if(response['data'].Table2.length>0)
	 {
		this.emailAlerts =[];
		this.emailAlerts =response['data'].Table2;
		
	 }
   else
   {
    var saveObj = {"OrganizationEmailAlertId":0,"OrganizationId":this.editOrgId,"AlertTypeId":0,"EmailId":this.emailId}
		this.emailAlerts.push(saveObj);
   }
   if(response['data'].Table4.length>0)
	 {
		
		//this.division = response['data'].Table4;
    //let tempDivision =[]
    response['data'].Table4.forEach(element => {
     // tempDivision.push(e)
     this.divisionMasterList.forEach((divsionValue)=>{
      if(element.DivisionId==divsionValue.DivisionId){
        
        divsionValue.isChecked=true;
        divsionValue.OrganizationDivisionId=element.OrganizationDivisionId;
        divsionValue.DivisionId=element.DivisionId
      }
    })
    });
    
		
	 }
   //IsRegistrationAddress
    });
	
  }
  reset()
  {
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
      if (result.value) {this.router.navigate(['/views/finance/master/organization/organizationview']);}
      //console.log('cancel');
    });
  }
  getChecked(id)
  { //console.log(this.division)
     this.division.forEach((element)=>{ 
        if(element.DivisionId==id){ return true;}
     })
     return true;
  }

  searchInvoices(){
    Swal.fire("No due invoices Found", 'Warning')

  }

  clearSelect(){

  }

  selectAll(e:any){
    
  }

  select(e:any){
    
  }


  changeDate() {
    /*console.log()
    this.todaydate = this.Organizationform.get("EffectiveFrom").value;

    var today = new Date();
    this.time = today.getHours() + ":" + today.getMinutes() + ':00';
    console.log(this.time)
    //this.getflagValue();*/
  }
  numericOnly(event): boolean {    
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
}
numericOnlys(event): boolean {    
  let patt = /^([a-zA-Z0-9])$/;
  let result = patt.test(event.key);
  return result;
}

numeric(event): boolean {    
  let patt = /^([a-zA-Z0-9])$/;
  let result = patt.test(event.key);
  return result;
}
incorportion(event): boolean {    
  let patt = /^([a-zA-Z0-9])$/;
  let result = patt.test(event.key);
  return result;
}

officename(event): boolean {    
  let patt = /^([a-zA-Z0-9])$/;
  let result = patt.test(event.key);
  return result;
}



// changed()
// {
//   console.log("Erode",this.Organizationform.value.BusinessLocation);
// }


}

interface Status {
  value: string;
  viewValue: string;
}
