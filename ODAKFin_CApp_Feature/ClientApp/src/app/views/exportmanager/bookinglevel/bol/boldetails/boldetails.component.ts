import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { format } from 'util';
import { CommonValues, MyAgencyDropdown, MyCntrTypeDropdown, MyCustomerDropdown, MyPortdrodown, MyTerminaldrodown } from '../../../../../model/Admin';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Commodity, ContainerType, CTTypes, drodownVeslVoyage, GeneralMaster, Vessel, VoyageDetails, CurrencyMaster, ChargeTBMaster, MyAgency } from '../../../../../model/common';
import { BOL,BLNo, BLTypes, BLContainer, PortVessel } from '../../../../../model/boldata';
import { ExpbolService } from '../../../../../services/expbol.service';
import { EnquiryService } from '../../../../../services/enquiry.service';
import { Title } from '@angular/platform-browser';
import { ExportbookingService } from '../../../../../services/exportbooking.service';
declare let $: any;


@Component({
  selector: 'app-boldetails',
  templateUrl: './boldetails.component.html',
  styleUrls: ['./boldetails.component.css']
})
export class BoldetailsComponent implements OnInit {
    title = 'Booking Level Tasksr';
    bkgNo: string = '';
    bkgparty: string = '';
    destination: string = '';
    vesselname: string = '';
    voyageno: string = '';
    loadPort: string = '';
    Formvalues: FormGroup;
    public ShowUpload: boolean = true;
    BookingID = 0;
    BLID = 0;
    MainID = 0;

    constructor(private router: Router, private route: ActivatedRoute, private service: EnquiryService, private ES: EncrDecrServiceService, private fb: FormBuilder, private titleService: Title, private bolservice: ExpbolService, private bs: ExportbookingService) {

        //this.route.queryParams.subscribe(params => {

          
        //    this.BLID = params['BLId'];
        //    this.BkgId = params['BkgID'];
        //    alert(params['BkgID']);
        //    this.Formvalues = this.fb.group({
               
        //        BLID: params['BLId'],
        //        BkgId: params['BkgID'],
        //    });

        //});
    }
    CustomerMasterAllvalues: MyCustomerDropdown[];
    BLNumberDropDown: BLNo[];
    AgencyDropDown: MyAgencyDropdown[];
    BLTypesDropDown: BLTypes[];
    ShipperDropDown: BOL[];
    ConsigneeDropDown: BOL[];
    NotifyDropDown: BOL[];
    NotifyAlsoDropDown: BOL[];
    PortAllvalues: MyPortdrodown[];
    public shipper: string = "";
    public consignee: string = "";
    public notify: string = "";
    public notifyalso: string = "";
    getShipper($event) {
        let shipper = (<HTMLInputElement>document.getElementById('ddlShipper')).value;
       
        this.bolservice.getShipperList().subscribe(data => {
            this.ShipperDropDown = data;
        });

        this.shipper = shipper;
        
    }
    getConsignee($event) {
        let consignee = (<HTMLInputElement>document.getElementById('ddlConsignee')).value;
        this.bolservice.getConsigneeList().subscribe(data => {
            this.ConsigneeDropDown = data;
        });
        this.consignee = consignee;
        
    }
    getNotify($event) {
        let notify = (<HTMLInputElement>document.getElementById('ddlNotify')).value;
        this.bolservice.getNotifyList().subscribe(data => {
            this.NotifyDropDown = data;
        });
        this.notify = notify;
    }
    getNotifyAlso($event) {
        let notifyalso = (<HTMLInputElement>document.getElementById('ddlNotifyAlso')).value;
        this.bolservice.getNotifyAlsoList().subscribe(data => {
            this.NotifyAlsoDropDown = data;
        });
        this.notifyalso = notifyalso;
    }
    searchFromArray(arr, regex) {
        let matches = [], i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i].match(regex)) {
                matches.push(arr[i]);
            }
        }
        return matches;
    };
    excntr: Array<BLContainer> = [];
    ngOnInit() {
        $('.my-select').select2();
        var queryString = new Array();
        var queryStringMain = new Array();
        var queryStringBkg = new Array();


        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyParavalue = Parameter.split('&');
            var KeyPara1 = "";
            var KeyPara = "";
            var KeyPara2 = "";
            for (var i = 0; i < KeyParavalue.length; i++) {
                if (i == 0)
                    var KeyPara = KeyParavalue[0].split(',');
                if (i == 1)
                    var KeyPara1 = KeyParavalue[1].split(',');
                if (i == 2)
                    var KeyPara2 = KeyParavalue[2].split(',');
            }


            for (var i = 0; i < KeyPara.length; i++) {
                var key = KeyPara[i].split(':')[0];
                var value = KeyPara[i].split(':')[1];
                queryString[key] = value;

            }

            for (var i = 0; i < KeyPara1.length; i++) {
                var key = KeyPara1[i].split(':')[0];
                var value = KeyPara1[i].split(':')[1];
                queryStringMain[key] = value;

            }

            for (var i = 0; i < KeyPara2.length; i++) {
                var key = KeyPara2[i].split(':')[0];
                var value = KeyPara2[i].split(':')[1];
                queryStringBkg[key] = value;
              
            }
          
            if (queryString["BLID"] != null) {
                this.Formvalues = this.fb.group({
                    BLID: queryString["BLID"].toString(),

                });
                
                this.BookingID = queryStringBkg["BkgID"];
                this.MainID = queryStringMain["MainID"];
               

                this.createform();
            }
        });

        this.titleService.setTitle(this.title);
        
        this.ShowUpload = false;
        this.OnBindDropDown();
        /* this.createform();*/
        this.ViewBkgBasicList();
    }
    ViewBkgBasicList() {
        this.Formvalues.value.ID = this.BookingID;
        this.bs.getExBookingValues(this.Formvalues.value).subscribe(data => {
            this.Formvalues.patchValue(data[0]);
            this.bkgNo = data[0].BookingNo;
            this.bkgparty = data[0].BookingParty;
            this.vesselname = data[0].VesselName;
            this.voyageno = data[0].VoyageNo;
            this.loadPort = data[0].LoadPort;
            this.destination = data[0].Destination;
        });
    }
    SourceChange(value) {
        if (value == "2") {
            this.ShowUpload = true;

        } else {

            this.ShowUpload = false;
        }
    }

    OnBindDropDown() {
        this.Formvalues.value.BkgID = this.BookingID;
        //this.bolservice.getCustomerList().subscribe(data => {
        //    this.CustomerMasterAllvalues = data;
        //}, (error: HttpErrorResponse) => {
        //    Swal.fire(error.message);
        //});

        this.bolservice.getShipperList().subscribe(data => {
            this.ShipperDropDown = data;
        });

        this.bolservice.getConsigneeList().subscribe(data => {
            this.ConsigneeDropDown = data;
        });

        this.bolservice.getNotifyList().subscribe(data => {
            this.NotifyDropDown = data;
        });


        this.bolservice.getNotifyAlsoList().subscribe(data => {
            this.NotifyAlsoDropDown = data;
        });

        this.bolservice.getBLNumberDropDown(this.Formvalues.value).subscribe(data => {
            this.BLNumberDropDown = data;
        });

        this.bolservice.getAgencyMaster(this.Formvalues.value).subscribe(data => {
            this.AgencyDropDown = data;
        });
        this.bolservice.getBLtypes(this.Formvalues.value).subscribe(data => {
            this.BLTypesDropDown = data;
        });
        this.service.getPortList().subscribe(data => {
            this.PortAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        
    }
    createform() {
      
        this.Formvalues.value.BkgId = this.BookingID;
       
        if (this.MainID == 0) {
            this.bolservice.getBkgPortDtls(this.Formvalues.value).subscribe(data => {
               
                
                this.Formvalues.patchValue(data[0]);
                $('#ddlBLNumber').select2().val(data[0].BLNumberID);
                this.Formvalues.value.Origin = data[0].Origin;
                this.Formvalues.value.LoadPort = data[0].LoadPort;
                this.Formvalues.value.Discharge = data[0].Discharge;
                this.Formvalues.value.Destination = data[0].Destination;
                this.Formvalues.value.PaymentTerms = data[0].PaymentTermsID;
                this.Formvalues.value.OriginID = data[0].OriginID;
                this.Formvalues.value.LoadPortID = data[0].LoadPortID;
                this.Formvalues.value.DishcargeID = data[0].DischargeID;
                this.Formvalues.value.DestinationID = data[0].DestinationID;
            });

            this.bolservice.getBLContainer(this.Formvalues.value).subscribe(data => {
                this.excntr = data;
            });
            this.Formvalues = this.fb.group({
                MainID: 0,
                ID: 0,
                ShipperName: '',
                ShipperAddress: '',
                Consignee: '',
                ConsigneeAddress: '',
                Notify: '',
                NotifyAddress: '',
                NotifyAlso: '',
                NotifyAlsoAddress: '',
                SeqNo: '',
                BLNumberID: 0,
                Origin: '',
                LoadPort: '',
                Discharge: '',
                Destination: '',
                PaymentTerms: '',
                BLTypeID: 0,
                DeliveryAgentID: '',
                OriginID: '',
                LoadPortID: '',
                DischargeID: '',
                DestinationID: '',
                DeliveryAgent: 0,
                DeliveryAgentAddress: '',
                MarksNos: '',
                Packages: '',
                Description: '',
                Weight: '',
                FreightPayableAt: '',
                NoOfOriginal: '',
                RFLBol: 0,
                BLIssueDate: '',
                PlaceOfIssue: '',
                ShipOnBoardDate: '',
                PrintWt: '',
                PrintNetWt: '',
                NotPrint: '',
              
                ShipOnboardDate: '',
                BkgId: 0,
                BLID: 0,
                AttachShippingBill: '',
                AttachCustomerApproval: '',
                BLStatus : 0


            });
        }
        else {
            
            this.Formvalues.value.BkgId = this.BookingID;
            this.bolservice.getExBolDtls(this.Formvalues.value).subscribe(data => {
                
                this.Formvalues.patchValue(data[0]);      
                $('#ddlBLNumber').select2().val(data[0].BLNumberID);
                $('#ddlDeliveryAgent').select2().val(data[0].DeliveryAgent);
                $('#ddlOrigin').select2().val(data[0].OriginID);
                $('#ddlLoadPort').select2().val(data[0].LoadPortID);
                $('#ddlDischarge').select2().val(data[0].DischargeID);
                $('#ddlDestination').select2().val(data[0].DestinationID);               
                $('#ddlBLType').select2().val(data[0].BLTypeID);
                this.Formvalues.value.Origin = data[0].Origin;
                this.Formvalues.value.LoadPort = data[0].LoadPort;
                this.Formvalues.value.Discharge = data[0].Discharge;
                this.Formvalues.value.Destination = data[0].Destination;
                
               
            });

            //this.bolservice.getExBolPartyDtls(this.Formvalues.value).subscribe(data => {
            //    alert(data[0].ShipperAddress);

            //    this.Formvalues.get('ShipperName').patchValue(data[0].ShipperName);
            //    this.Formvalues.get('Consignee').patchValue(data[0].Consignee);
            //    this.Formvalues.get('Notify').patchValue(data[0].Notify);
            //    this.Formvalues.get('NotifyAlso').patchValue(data[0].NotifyAlso);


            //    this.Formvalues.get('ShipperAddress').patchValue(data[0].ShipperAddress);
            //    this.Formvalues.get('ConsigneeAddress').patchValue(data[0].ConsigneeAddress);
            //    this.Formvalues.get('NotifyAddress').patchValue(data[0].NotifyAddress);
            //    this.Formvalues.get('NotifyAlsoAddress').patchValue(data[0].NotifyAlsoAddress);

            //    //this.Formvalues.value.ShipperAddress = data[0].ShipperAddress;
            //    //this.Formvalues.value.ConsigneeAddress = data[0].ConsigneeAddress;
            //    //this.Formvalues.value.NotifyAddress = data[0].NotifyAddress;
            //    //this.Formvalues.value.NotifyAlsoAddress = data[0].NotifyAlsoAddress;

            //});

            //this.bolservice.getBkgPortDtls(this.Formvalues.value).subscribe(data => {

            //    this.Formvalues.patchValue(data[0]);
            //    this.Formvalues.value.Origin = data[0].Origin;
            //    this.Formvalues.value.LoadPort = data[0].LoadPort;
            //    this.Formvalues.value.Discharge = data[0].Discharge;
            //    this.Formvalues.value.Destination = data[0].Destination;
            //    this.Formvalues.value.PaymentTerms = data[0].PaymentTerms;
            //    this.Formvalues.value.OriginID = data[0].OriginID;
            //    this.Formvalues.value.LoadPortID = data[0].LoadPortID;
            //    this.Formvalues.value.DishcargeID = data[0].DischargeID;
            //    this.Formvalues.value.DestinationID = data[0].DestinationID;
            //});

            this.bolservice.getBLContainer(this.Formvalues.value).subscribe(data => {
                this.excntr = data;
            });

            this.Formvalues = this.fb.group({
                MainID: 0,
                ID: 0,
                ShipperName: '',
                ShipperAddress: '',
                Consignee: '',
                ConsigneeAddress: '',
                Notify: '',
                NotifyAddress: '',
                NotifyAlso: '',
                NotifyAlsoAddress: '',
                SeqNo: '',
                BLNumberID: 0,
                Origin: '',
                LoadPort: '',
                Discharge: '',
                Destination: '',
                PaymentTerms: '',
                BLTypeID: 0,
                DeliveryAgentID: '',
                OriginID: '',
                LoadPortID: '',
                DischargeID: '',
                DestinationID: '',
                DeliveryAgent: 0,
                DeliveryAgentAddress: '',
                MarksNos: '',
                Packages: '',
                Description: '',
                Weight: '',
                FreightPayableAt: '',
                NoOfOriginal: '',
                RFLBol: 0,
                BLIssueDate: '',
                PlaceOfIssue: '',
                ShipOnBoardDate: '',
                PrintWt: '',
                PrintNetWt: '',
                NotPrint: '',
                ShipOnboardDate: '',
                BkgId: 0,
                BLID: 0,
                AttachShippingBill: '',
                AttachCustomerApproval: ''


            });
        }
            

        
        
       
    }

    

    btntabclick(tab) {


       
        var values = "ID: " + this.BookingID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1)
            this.router.navigate(['/views/exportmanager/bookinglevel/bookings/bookings'], { queryParams: { encrypted } });
        else if (tab == 2) {
            this.router.navigate(['/views/exportmanager/bookinglevel/containers/containers'], { queryParams: { encrypted } });
        }
        else if (tab == 3) {
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/haz/haz'], { queryParams: { encrypted } });
        }
        else if (tab == 4) {
            this.router.navigate(['/views/exportmanager/bookinglevel/bol/bol'], { queryParams: { encrypted } });
        }
        else if (tab == 5) {
            this.router.navigate(['/views/exportmanager/bookinglevel/blrelease/blrelease'], { queryParams: { encrypted } });
        }
        else if (tab == 6) {
            this.router.navigate(['/views/exportmanager/bookinglevel/exphandling/exphandling'], { queryParams: { encrypted } });
        }
        else if (tab == 7) {
            this.router.navigate(['/views/exportmanager/bookinglevel/invoices/invoices'], { queryParams: { encrypted } });
        }
        else if (tab == 8) {
            this.router.navigate(['/views/exportmanager/bookinglevel/attach/attach'], { queryParams: { encrypted } });
        }
        else if (tab == 9) {
            this.router.navigate(['/views/exportmanager/bookinglevel/blallotment/blallotment'], { queryParams: { encrypted } });
        }

    }
    onSubmit() {
        this.Formvalues.value.BkgId = this.BookingID;
        this.Formvalues.value.BLID = this.BLID;
        /*this.Formvalues.value.MainID = 0;*/
        this.Formvalues.value.ShipperName = this.shipper;
        this.Formvalues.value.Consignee = this.consignee;
        this.Formvalues.value.Notify = this.notify;
        this.Formvalues.value.NotifyAlso = this.notifyalso;
        this.Formvalues.value.ShipperType = "1";
        this.Formvalues.value.ConsigneeType = "2";
        this.Formvalues.value.NotifyType = "3";
        this.Formvalues.value.NotifyAlsoType = "4";
        this.Formvalues.value.BLNumberID = $('#ddlBLNumber').val();
        this.Formvalues.value.DeliveryAgent = $('#ddlDeliveryAgent').val();
        this.Formvalues.value.OriginID = $('#ddlOrigin').val();
        this.Formvalues.value.LoadPortID = $('#ddlLoadPort').val();
        this.Formvalues.value.DischargeID = $('#ddlDischarge').val();
        this.Formvalues.value.DestinationID = $('#ddlDestination').val();
        this.Formvalues.value.BLTypeID = $('#ddlBLTypes').val();
 
        this.Formvalues.value.AttachShippingBill = $('#txtAttachFile').val();
        this.Formvalues.value.AttachCustomerApproval = $('#txtApproval').val();
      
        if (this.Formvalues.value.RFLBol == true) {
            this.Formvalues.value.RFLBol = 1;
        }
        else {
            
            this.Formvalues.value.RFLBol = 0;
        }
        if (this.Formvalues.value.PrintWt == true) {
            this.Formvalues.value.PrintWt = 1;
        }
        else {
            
            this.Formvalues.value.PrintWt = 0;
        }
        if (this.Formvalues.value.PrintNetWt == true) {
            this.Formvalues.value.PrintNetWt = 1;
        }
        else {
            
            this.Formvalues.value.PrintNetWt = 0;
        }
        if (this.Formvalues.value.NotPrint == true) {
            this.Formvalues.value.NotPrint = 1;
        }
        else {

            this.Formvalues.value.NotPrint = 0;
        }
        var ItemsPr = [];
        var AgentSealNoV = " ";
        var CustomerSealNoV = " ";
        var GrsWtV = " ";
        var NetWtV = " ";
        var NoOfPkgsV = " ";
        var VolumeV = "0";
        for (let item of this.excntr) {
           
            if (item.AgentSealNo != "") {
                AgentSealNoV = item.AgentSealNo;
            }
            else {
              
                AgentSealNoV = AgentSealNoV;
            }
            if (item.CustomerSealNo != "") {
                CustomerSealNoV = item.CustomerSealNo
            }
            else {
                CustomerSealNoV = CustomerSealNoV;
            }
            if (item.GrsWt != "") {
                GrsWtV = item.GrsWt;
            }
            else {
                GrsWtV = GrsWtV;
            }
            if (item.NetWt != "") {
                NetWtV = item.NetWt;
            }
            else {
                NetWtV = NetWtV;
            }
            if (item.NoOfPkgs != "") {
                NoOfPkgsV = item.NoOfPkgs;
            }
            else {
                NoOfPkgsV = NoOfPkgsV;
            }
            if (item.Volume != "") {
                VolumeV = item.Volume;
            }
            else {
                VolumeV = VolumeV;
            }

            this.Formvalues.value.BLStatus = 1;
            ItemsPr.push('Insert:' + item.ContainerNo, item.ContrType, AgentSealNoV, CustomerSealNoV, GrsWtV, NetWtV, NoOfPkgsV, VolumeV);


        };
        this.Formvalues.value.Itemsv1 = ItemsPr.toString();
        // console.log(ItemsPr.toString());
        this.bolservice.saveBOL(this.Formvalues.value).subscribe(data => {
            Swal.fire("Record Saved Successfully");
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    onApproval() {
        this.Formvalues.value.BLStatus = 2;

        this.bolservice.updateApprovalStatus(this.Formvalues.value).subscribe(data => {
            Swal.fire("Approved Successfully");
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    selectedFile: File = null;
    uploadedfile: string = null;
    progress: string = '';

    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
        const filedata = new FormData();
        filedata.append('file', this.selectedFile, this.selectedFile.name)
        this.bolservice.AttachUpload(this.selectedFile).subscribe(
            (event) => {

                var fullpath = event;
                var res = JSON.stringify(fullpath).split('\\').pop().split('"}')[0]
                this.uploadedfile = res;
                // console.log(this.uploadedfile);

            }
        );

    }
}
