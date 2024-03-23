import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { format } from 'util';
import { BOL, BLNo, BLTypes, BLContainer, PortVessel } from '../../../../model/boldata';
import { PaginationService } from '../../../../pagination.service';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { ExpbolService } from '../../../../services/expbol.service';
import { Title } from '@angular/platform-browser';
import { ExportbookingService } from '../../../../services/exportbooking.service';
import { CommonValues, MyAgencyDropdown, MyCntrTypeDropdown, MyCustomerDropdown, MyPortdrodown, MyTerminaldrodown } from '../../../../model/Admin';
import { Commodity, ContainerType, CTTypes, drodownVeslVoyage, GeneralMaster, Vessel, VoyageDetails, CurrencyMaster, ChargeTBMaster, MyAgency } from '../../../../model/common';
import { EnquiryService } from '../../../../services/enquiry.service';
import { on } from 'cluster';
declare let $: any;
import { HttpEventType } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { count } from 'console';

@Component({
  selector: 'app-bol',
  templateUrl: './bol.component.html',
  styleUrls: ['./bol.component.css']
})
export class BolComponent implements OnInit {
    title = 'Booking Level Tasksr';
    fileUrl: string;
    fileUrl2: string;
    BookingID = 0;
    bkgNo: string = '';
    bkgparty: string = '';
    destination: string = '';
    vesselname: string = '';
    voyageno: string = '';
    loadPort: string = '';
   
    MainID = 0;
    BLID = 0;
    public BLNumber: string = "";
    BLNumberDropDown: BLNo[];
    CustomerMasterAllvalues: MyCustomerDropdown[];
    AgencyDropDown: MyAgencyDropdown[];
    AllListPaymentTerms: CommonValues[];
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
    excntr: Array<BLContainer> = [];
    shippingbill: string = '';
    approvalattach: string = '';
    message: string;
    progress1: number;
    message2: string;
    progress2: number;
    Count = 0;
    HDArrayIndex = '';
    CID = null;
    val: any = {};
    newDynamicContainer: any = {};
    dynamicContainerArray: Array<BLContainer> = [];
    public ControlDisplay: boolean = false;
    //getShipper($event) {
    //    let shipper = (<HTMLInputElement>document.getElementById('ddlShipper')).value;

    //    this.bolservice.getShipperList().subscribe(data => {
    //        this.ShipperDropDown = data;
    //    });

    //    this.shipper = shipper;

    //}
    //getConsignee($event) {
    //    let consignee = (<HTMLInputElement>document.getElementById('ddlConsignee')).value;
    //    this.bolservice.getConsigneeList().subscribe(data => {
    //        this.ConsigneeDropDown = data;
    //    });
    //    this.consignee = consignee;

    //}
    //getNotify($event) {
    //    let notify = (<HTMLInputElement>document.getElementById('ddlNotify')).value;
    //    this.bolservice.getNotifyList().subscribe(data => {
    //        this.NotifyDropDown = data;
    //    });
    //    this.notify = notify;
    //}
    //getNotifyAlso($event) {
    //    let notifyalso = (<HTMLInputElement>document.getElementById('ddlNotifyAlso')).value;
    //    this.bolservice.getNotifyAlsoList().subscribe(data => {
    //        this.NotifyAlsoDropDown = data;
    //    });
    //    this.notifyalso = notifyalso;
    //}
    //searchFromArray(arr, regex) {
    //    let matches = [], i;
    //    for (i = 0; i < arr.length; i++) {
    //        if (arr[i].match(regex)) {
    //            matches.push(arr[i]);
    //        }
    //    }
    //    return matches;
    //};
    constructor(private router: Router, private route: ActivatedRoute, private service: EnquiryService, private titleService: Title, private bolservice: ExpbolService, private ES: EncrDecrServiceService, private fb: FormBuilder, public ps: PaginationService, private bss: ExportbookingService) {
       
       
    }

    bolForm: FormGroup;
    blNoview: BLNo[];
    exblno: BLNo[];

    statusActive: boolean[] = [];
    statusInactive: boolean[] = [];
    ngOnInit() {
        $('.my-select').select2();
        var queryString = new Array();
        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyPara = Parameter.split(',');
            for (var i = 0; i < KeyPara.length; i++) {
                var key = KeyPara[i].split(':')[0];
                var value = KeyPara[i].split(':')[1];
                queryString[key] = value;
            }

            if (queryString["ID"] != null) {
             
                // this.docForm.value.ID = queryString["ID"].toString();
               
               
            }
            
            this.BookingID = queryString["ID"].toString();
           /* this.bolForm.value.BLID = this.BLID;*/
          
        });
        this.titleService.setTitle(this.title);
        
        this.createForm();
        this.BLNumberList();
        this.OnBindDropDown();
        this.BLDetailsView(this.BLID, this.MainID,this.BLNumber);
        this.ViewBkgBasicList();
        this.ForsControlEnable();
        //this.newDynamicContainer = { CID: 0, ContainerNo: '', ContrType: '', AgentSealNo: '', CustomerSealNo: '', GrsWt: '', NetWt: '', NoOfPkgs: '', Volume: ''};
        //this.dynamicContainerArray.push(this.newDynamicContainer);
    }
  
    ViewBkgBasicList() {
        this.bolForm.value.ID = this.BookingID;
        this.bss.getExBookingValues(this.bolForm.value).subscribe(data => {
            this.bolForm.patchValue(data[0]);
            this.bkgNo = data[0].BookingNo;
            this.bkgparty = data[0].BookingParty;
            this.vesselname = data[0].VesselName;
            this.voyageno = data[0].VoyageNo;
            this.loadPort = data[0].LoadPort;
            this.destination = data[0].Destination;
        });
    }
    selectedFile: File = null;
    uploadedfile: string = null;
    progress: string = '';
    selectedFile1: File = null;
    customerapprovalfile: string = null;

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
    onFileSelected1(event) {
        this.selectedFile1 = event.target.files[0];
        const filedata1 = new FormData();
        filedata1.append('file1', this.selectedFile1, this.selectedFile1.name)
        this.bolservice.AttachUploadCustomerApproval(this.selectedFile1).subscribe(
            (event) => {

                var fullpath = event;
                var res = JSON.stringify(fullpath).split('\\').pop().split('"}')[0]
                this.customerapprovalfile = res;
                // console.log(this.customerapprovalfile);

            }
        );
    }
    BLDetailsView(BLID, MainID, BLNumber) {

      
        $('.my-select').select2();
       /* $('#ddlDeliveryAgent').val(0).trigger("change");*/
        this.bolForm.value.BkgId = this.BookingID;
        this.BLID = BLID;
        this.MainID = MainID;
        this.bolForm.value.BLID = BLID;
        this.bolForm.value.MainID = MainID;
       
       
        $('#txtBLNumber').val(BLNumber);
        
           
        
        this.bolservice.getBLContainer(this.bolForm.value).subscribe(data1 => {
         
            this.dynamicContainerArray.length = 0;
            if (data1.length > 0) {
                for (let item of data1) {
                    this.dynamicContainerArray.push({
                        'ID': item.ID,
                        /*'CargoID': item.CargoID,*/
                        'ContainerNo': item.ContainerNo,
                        'ContrType': item.ContrType,
                        'AgentSealNo': item.AgentSealNo,
                        'CustomerSealNo': item.CustomerSealNo,
                        'GrsWt': item.GrsWt,
                        'NetWt': item.NetWt,
                        'NoOfPkgs': item.NoOfPkgs,
                        'Volume': item.Volume,
                    });
                }

            }
            else {
                this.newDynamicContainer = { ID: 0,ContainerNo: '', ContrType: '', AgentSealNo: '', CustomerSealNo: '', GrsWt: '', NetWt: '', NoOfPkgs: '', Volume: '' };
                this.dynamicContainerArray.push(this.newDynamicContainer);
            }
        });
       
        if (BLID == 0 || MainID == 0) {
            this.shippingbill = "";
            this.approvalattach = "";
           

            this.bolservice.getBkgPortDtls(this.bolForm.value).subscribe(data => {
               
                this.bolForm.patchValue(data[0]);
                $('#txtBLNumber').val(BLNumber);
                this.bolForm.value.Origin = data[0].Origin;
                this.bolForm.value.LoadPort = data[0].LoadPort;
                this.bolForm.value.Discharge = data[0].Discharge;
                this.bolForm.value.Destination = data[0].Destination;
                $('#ddlPaymentTerms').select2().val(data[0].PaymentTermsID);
                this.bolForm.value.OriginID = data[0].OriginID;
                this.bolForm.value.LoadPortID = data[0].LoadPortID;
                this.bolForm.value.DischargeID = data[0].DischargeID;
                this.bolForm.value.DestinationID = data[0].DestinationID;
                $('#ddlDeliveryAgent').select2().val(data[0].DeliveryAgent);
                $('#ddlBLTypesV').val(0).trigger("change");
            });

            //this.bolservice.getBLContainer(this.bolForm.value).subscribe(data1 => {
            //    alert('blidno');
            //    this.dynamicContainerArray.length = 0;
            //    if (data1.length > 0) {
            //        for (let item of data1) {
            //            this.dynamicContainerArray.push({
            //                'ID': item.ID,
            //                'ContainerNo': item.ContainerNo,
            //                'ContrType': item.ContrType,
            //                'AgentSealNo': item.AgentSealNo,
            //                'CustomerSealNo': item.CustomerSealNo,
            //                'GrsWt': item.GrsWt,
            //                'NetWt': item.NetWt,
            //                'NoOfPkgs': item.NoOfPkgs,
            //                'Volume': item.Volume,
            //            });
            //        }

            //    }
            //    else {
            //        this.newDynamicContainer = { CargoID: 0, ContainerNo: '', ContrType: '', AgentSealNo: '', CustomerSealNo: '', GrsWt: '', NetWt: '', NoOfPkgs: '', Volume: '' };
            //        this.dynamicContainerArray.push(this.newDynamicContainer);
            //    }
            //});
                //this.bolservice.getExBkgDtls(this.bolForm.value).subscribe((data1 => {
               

                //    this.dynamicContainerArray.length = 0;
                //        if (data1.length > 0) {
                //            for (let item of data1) {
                //                this.dynamicContainerArray.push({
                //                    'ID': item.ID,
                //                    'ContainerNo': item.ContainerNo,
                //                    'ContrType': item.ContrType,
                //                    'AgentSealNo': item.AgentSealNo,
                //                    'CustomerSealNo': item.CustomerSealNo,
                //                    'GrsWt': item.GrsWt,
                //                    'NetWt': item.NetWt,
                //                    'NoOfPkgs': item.NoOfPkgs,
                //                    'Volume': item.Volume,
                //                });
                //            }

                //        }
                //        else {
                //            this.newDynamicContainer = { ID: 0, ContainerNo: '', ContrType: '', AgentSealNo: '', CustomerSealNo: '', GrsWt: '', NetWt: '', NoOfPkgs: '', Volume: '' };
                //            this.dynamicContainerArray.push(this.newDynamicContainer);
                //        }
                    
                //}));
            

            //this.bolservice.getBLContainer(this.bolForm.value).subscribe(data => {
                
            //    this.excntr = data;
            //});


        }
        else {
         
            this.bolservice.getExBolDtls(this.bolForm.value).subscribe(data => {
               
                this.bolForm.patchValue(data[0]);
                this.shippingbill = data[0].AttachShippingBill;
                this.approvalattach = data[0].AttachCustomerApproval;
                //alert(data[0].AttachShippingBill);
                //alert(data[0].AttachCustomerApproval);

                //if (data[0].AttachShippingBill == "" && MainID == 0) {
                //    alert('bill');
                    
                //    this.shippingbill = "";
                //}
                //else {
                //    alert('elsebill');
                //    this.shippingbill = data[0].AttachShippingBill;
                //}
                //if (data[0].AttachCustomerApproval == "" && MainID == 0) {
                //    alert('approve');
                    
                //    this.approvalattach = "";
                //}
                //else {
                //    alert('elseapprove');
                //    this.approvalattach = data[0].AttachCustomerApproval;
                //}
                
                $('#txtBLNumber').val(BLNumber);
                this.MainID = data[0].MainID;
               /* $('#ddlBLNumber').select2().val(data[0].BLNumberID);*/
               
                $('#ddlDeliveryAgent').select2().val(data[0].DeliveryAgent);
                /*$('#ddlDeliveryAgent').val(data[0].DeliveryAgent);*/
              
                $('#ddlOrigin').select2().val(data[0].OriginID);
                $('#ddlLoadPort').select2().val(data[0].LoadPortID);
                $('#ddlDischarge').select2().val(data[0].DischargeID);
                $('#ddlDestination').select2().val(data[0].DestinationID);
                $('#ddlBLTypesV').select2().val(data[0].BLTypeID);
                $('#ddlPaymentTerms').select2().val(data[0].PaymentTermsID);
               /* $('#ddlBLType').val(data[0].BLTypeID);*/
                this.bolForm.value.Origin = data[0].Origin;
                this.bolForm.value.LoadPort = data[0].LoadPort;
                this.bolForm.value.Discharge = data[0].Discharge;
                this.bolForm.value.Destination = data[0].Destination;
                
                this.bolForm.value.ShipperName = data[0].ShipperName;
                this.bolForm.value.ShipperName = data[0].ShipperAddress;
                this.bolForm.value.Consignee = data[0].Consignee;
                this.bolForm.value.Consignee = data[0].ConsigneeAddress;
                this.bolForm.value.Notify = data[0].Notify;
                this.bolForm.value.Notify = data[0].NotifyAddress;
                this.bolForm.value.NotifyAlso = data[0].NotifyAlso;
                this.bolForm.value.NotifyAlso = data[0].NotifyAlsoAddress;
               
                
               /* $('#txtAttachFile').val(data[0].AttachShippingBill);*/

              

            });

          
           
            //this.bolservice.getExBolPartyDtls(this.bolForm.value).subscribe(data => {
            //    this.bolForm.patchValue(data[0]);
            //    this.bolForm.value.ShipperName = data[0].ShipperName;
            //    this.bolForm.value.ShipperAddress = data[0].ShipperAddress;
            //    this.bolForm.value.Consignee = data[0].Consignee;
            //    this.bolForm.value.ConsigneeAddress = data[0].ConsigneeAddress;
            //    this.bolForm.value.Notify = data[0].Notify;
            //    this.bolForm.value.NotifyAddress = data[0].NotifyAddress;
            //    this.bolForm.value.NotifyAlso = data[0].NotifyAlso;
            //    this.bolForm.value.NotifyAlsoAddress = data[0].NotifyAlsoAddress;

            //});
        }
       
    }

    ForsControlEnable() {
        
        $("#txtAgentNo").attr("disabled", "disabled");
        $("#txtCustomNo").attr("disabled", "disabled");
        $("#txtGrsWt").attr("disabled", "disabled");
        $("#txtNetWt").attr("disabled", "disabled");
        $("#txtNoOfPkgs").attr("disabled", "disabled");
        $("#txtVolume").attr("disabled", "disabled");
        this.ControlDisplay = true;
    }
    ForsControlDisable() {
        
        $('#txtAgentNo').removeAttr('disabled');
        $('#txtCustomNo').removeAttr('disabled');
        $('#txtGrsWt').removeAttr('disabled');
        $('#txtNetWt').removeAttr('disabled');
        $('#txtNoOfPkgs').removeAttr('disabled');
        $('#txtVolume').removeAttr('disabled');
        this.ControlDisplay = false;
    }
    CntrEdit() {
        
            this.ForsControlDisable();
    
    }
    CntrSave() {
        this.ControlDisplay = true;
        var ItemsCntrs = [];
        for (let item of this.dynamicContainerArray) {

            var intCID = item.ID;
            if (typeof item.ID == "undefined") {
                intCID = 0;
            }
            
            ItemsCntrs.push('Insert:' + intCID, item.AgentSealNo, item.CustomerSealNo, item.GrsWt, item.NetWt, item.NoOfPkgs, item.Volume);
        }
        this.bolForm.value.BLID = this.BLID;
      
        this.bolForm.value.BkgId = this.BookingID;
      
        this.bolForm.value.Itemsv1 = ItemsCntrs.toString();

        this.bolservice.updateBLCntrDtls(this.bolForm.value).subscribe(data => {

            Swal.fire("Conatiners Updated Successfully");
          
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }
    download(attachbill) {
        this.fileUrl = attachbill
        this.bolservice.download(this.fileUrl).subscribe((event) => {

            if (event.type === HttpEventType.UploadProgress)
                this.progress1 = Math.round((100 * event.loaded) / event.total);

            else if (event.type === HttpEventType.Response) {
                this.message = 'Download success.';
                this.downloadFile(event);
            }
        });
    }
    
    private downloadFile = (data: HttpResponse<Blob>) => {
        const downloadedFile = new Blob([data.body], { type: data.body.type });
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        a.download = this.fileUrl;
        a.href = URL.createObjectURL(downloadedFile);
        a.target = '_blank';
        a.click();
        document.body.removeChild(a);
    }
    downloadapproval(approvalattach) {
        this.fileUrl2 = approvalattach
        this.bolservice.downloadapproval(this.fileUrl2).subscribe((event) => {

            if (event.type === HttpEventType.UploadProgress)
                this.progress2 = Math.round((100 * event.loaded) / event.total);

            else if (event.type === HttpEventType.Response) {
                this.message2 = 'Download success.';
                this.downloadFile2(event);
            }
        });
    }
    private downloadFile2 = (data: HttpResponse<Blob>) => {
        const downloadedFile2 = new Blob([data.body], { type: data.body.type });
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        a.download = this.fileUrl2;
        a.href = URL.createObjectURL(downloadedFile2);
        a.target = '_blank';
        a.click();
        document.body.removeChild(a);
    }
    BLNumberList() {
       
        this.bolForm.value.BkgId = this.BookingID;
        
        this.bolservice.getBLNumberList(this.bolForm.value).subscribe(data => {
            this.exblno = data;
            this.BLDetailsView(data[0].ID, data[0].MainID, data[0].BLNumber);
           
               
            for (let i = 0; i < data.length; i++) {
                //if (data[0].MainID == 0) {
                //    if (i == 0) {
                //        alert('test');
                //        this.statusActive[i] = true;
                //        this.statusInactive[i] = false;

                //    }
                //    else {
                //        this.statusInactive[i] = true;
                //        this.statusActive[i] = false;

                //    }
                //}
              

             
                    if (i == 0) {
                        
                        this.statusActive[i] = true;
                        this.statusInactive[i] = false;

                    }
                    else {
                        this.statusInactive[i] = true;
                        this.statusActive[i] = false;

                    }
                
               
               
            }
        });
       
    }
    createForm() {
      
        //this.bolForm.value.BkgId = this.BookingID;
        //alert(this.BookingID);
        //this.bolservice.getBkgPortDtls(this.bolForm.value).subscribe(data => {


        //    this.bolForm.patchValue(data[0]);
          
        //    this.bolForm.value.Origin = data[0].Origin;
        //    this.bolForm.value.LoadPort = data[0].LoadPort;
        //    this.bolForm.value.Discharge = data[0].Discharge;
        //    this.bolForm.value.Destination = data[0].Destination;
        //    this.bolForm.value.PaymentTerms = data[0].PaymentTerms;
        //    this.bolForm.value.OriginID = data[0].OriginID;
        //    this.bolForm.value.LoadPortID = data[0].LoadPortID;
        //    this.bolForm.value.DishcargeID = data[0].DischargeID;
        //    this.bolForm.value.DestinationID = data[0].DestinationID;
        //});

        //this.bolservice.getBLContainer(this.bolForm.value).subscribe(data => {
        //    this.bolForm.value.BkgId = this.BookingID;
        //    this.excntr = data;
        //});
        this.bolForm = this.fb.group({
            
            MainID: 0,
            PartyID:0,
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
            OriginID: 0,
            LoadPortID: 0,
            DischargeID:0,
            DestinationID: 0,
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
            PrintWt: 0,
            PrintNetWt: 0,
            NotPrint: 0,
            ShipOnboardDate: '',
            BkgId: 0,
            BLID: 0,
            /*AttachShippingBill: '',*/
           /* AttachCustomerApproval: '',*/
            BLStatus: 0,
            BLNumber: '',
            PayTermsID:0
         
           
        })

    }
    OnBindDropDown() {
        this.bolForm.value.BkgId = this.BookingID;
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

        this.bolservice.getBLNumberDropDown(this.bolForm.value).subscribe(data => {
            this.BLNumberDropDown = data;
        });

        this.bolservice.getAgencyMaster(this.bolForm.value).subscribe(data => {
            this.AgencyDropDown = data;
        });
        this.bolservice.getBLtypes(this.bolForm.value).subscribe(data => {
            this.BLTypesDropDown = data;
        });
        this.service.getPortList().subscribe(data => {
            this.PortAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

       

        this.bolservice.getBLNumberDropDown(this.bolForm.value).subscribe(data => {
            this.BLNumberDropDown = data;
        });

        this.AllListPaymentTerms = [
            { ID: "0", Desc: '--select--' },
            { ID: "1", Desc: 'Prepaid' },
            { ID: "2", Desc: 'Collect' },
        ];

    }
    //OnClickEdit(IDv, MainID) {
        

    //    var values = "BLID: " + IDv + "&MainID:" + MainID + "&BkgID:" + this.BookingID;
    //    var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
    //    this.router.navigate(['/views/exportmanager/bookinglevel/bol/boldetails/boldetails/'], { queryParams: { encrypted } });
    //}
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
       /* alert($('#ddlDeliveryAgent').val());*/
        var validation = "";
        var txtBLNumber = $('#txtBLNumber').val();
        if (txtBLNumber == null || txtBLNumber == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter BOL Number</span></br>"
        }
        var ddlShipper = $('#ddlShipper').val();
        if (ddlShipper == null || ddlShipper == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Shipper</span></br>"
        }
        var ddlConsignee = $('#ddlConsignee').val();
        if (ddlConsignee == null || ddlConsignee == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Consignee</span></br>"
        }
        var ddlNotify = $('#ddlNotify').val();
        if (ddlNotify == null || ddlNotify == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Notify</span></br>"
        }
        //var ddlNotifyAlso = $('#ddlNotifyAlso').val();
        //if (ddlNotifyAlso == null || ddlNotifyAlso == "") {
        //    validation += "<span style='color:red;'>*</span> <span>Please Enter Notify Also</span></br>"
        //}
       
        if ($('#ddlDeliveryAgent').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Delivery Agent</span></br>"
        }
        var txtDeliveryAgentAddress = $('#txtDeliveryAgentAddress').val();
        if (txtDeliveryAgentAddress == null || txtDeliveryAgentAddress == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Delivery Agent Address</span></br>"
        }
        var txtOrigin = $('#txtOrigin').val();
        if (txtOrigin == null || txtOrigin == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Origin</span></br>"
        }
        var txtLoadPort = $('#txtLoadPort').val();
        if (txtLoadPort == null || txtLoadPort == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter LoadPort</span></br>"
        }
        var txtDischarge = $('#txtDischarge').val();
        if (txtDischarge == null || txtDischarge == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Discharge</span></br>"
        }
        var txtDestination = $('#txtDestination').val();
        if (txtDestination == null || txtDestination == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Destination</span></br>"
        }
        var txtFreightPayableAt = $('#txtFreightPayableAt').val();
        if (txtFreightPayableAt == null || txtFreightPayableAt == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Freight Payable At</span></br>"
        }
        //if ($('#ddlDischargePort').val() == null) {
        //    validation += "<span style='color:red;'>*</span> <span>Please Select Discharge Port</span></br>"
        //}
        if ($('#ddlBLTypesV').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select BL Type</span></br>"
        }
        if ($('#ddlPaymentTerms').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select PaymentTerms</span></br>"
        }
        var txtNoOfOriginal = $('#txtNoOfOriginal').val();
        if (txtNoOfOriginal == null || txtNoOfOriginal == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter No of Original</span></br>"
        }
        var txtBLIssueDate = $('#txtBLIssueDate').val();
        if (txtBLIssueDate == null || txtBLIssueDate == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter BL Issue Date</span></br>"
        }
        var txtPlaceOfIssue = $('#txtPlaceOfIssue').val();
        if (txtPlaceOfIssue == null || txtPlaceOfIssue == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Place of Issue</span></br>"
        }
        var txtShipOnboardDate = $('#txtShipOnboardDate').val();
        if (txtShipOnboardDate == null || txtShipOnboardDate == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Ship Onboard Date</span></br>"
        }
      
        var txtMarksNos = $('#txtMarksNos').val();
        if (txtMarksNos == null || txtMarksNos == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter MarksNos</span></br>"
        }
        var txtPackages = $('#txtPackages').val();
        if (txtPackages == null || txtPackages == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Packages</span></br>"
        }
        var txtDescription = $('#txtDescription').val();
        if (txtDescription == null || txtDescription == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Description</span></br>"
        }
        var txtWeight = $('#txtWeight').val();
        if (txtWeight == null || txtWeight == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Weight</span></br>"
        }
    

       

        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        this.bolForm.value.BkgId = this.BookingID;
        this.bolForm.value.BLID = this.BLID;
        this.bolForm.value.MainID = this.MainID;
      
        /*this.Formvalues.value.MainID = 0;*/
       /* this.shipper = $('#ddlShipper').val();*/
        //alert($('#ddlShipper').val());
        //alert($('#ddlConsignee').val());
        //alert($('#ddlNotify').val());
        //alert($('#ddlNotifyAlso').val());
        /*this.bolForm.value.ShipperName = this.shipper;*/
        this.bolForm.value.MarksNos = $('#txtMarksNos').val();
        this.bolForm.value.Packages = $('#txtPackages').val();
        this.bolForm.value.Description = $('#txtDescription').val();
        this.bolForm.value.Weight = $('#txtWeight').val();
        this.bolForm.value.FreightPayableAt = $('#txtFreightPayableAt').val();
        this.bolForm.value.NoOfOriginal = $('#txtNoOfOriginal').val();
        this.bolForm.value.BLIssueDate = $('#txtBLIssueDate').val();
        this.bolForm.value.PlaceOfIssue = $('#txtPlaceOfIssue').val();
        this.bolForm.value.ShipOnboardDate = $('#txtShipOnboardDate').val();
        this.bolForm.value.DeliveryAgentAddress = $('#txtDeliveryAgentAddress').val();
        this.bolForm.value.ShipperName = $('#ddlShipper').val();
        this.bolForm.value.Consignee = $('#ddlConsignee').val();
        this.bolForm.value.Notify = $('#ddlNotify').val();
        this.bolForm.value.NotifyAlso = $('#ddlNotifyAlso').val();

        this.bolForm.value.ShipperAddress = $('#txtShipperAddress').val();
        this.bolForm.value.ConsigneeAddress = $('#txtConsigneeAddress').val();
        this.bolForm.value.ConsigneeAddress = $('#txtNotifyAddress').val();
        this.bolForm.value.NotifyAlsoAddress = $('#txtNotifyAlsoAddress').val();
        //this.bolForm.value.Consignee = this.consignee;
        //this.bolForm.value.Notify = this.notify;
        //this.bolForm.value.NotifyAlso = this.notifyalso;
        //if ($('#ddlShipper').val() != "") {
        //    this.bolForm.value.ShipperType = "1";
        //    alert(this.bolForm.value.ShipperType);
        //}
        //if ($('#ddlConsignee').val() != "") {
        //    this.bolForm.value.ConsigneeType = "2";
        //    alert(this.bolForm.value.ConsigneeType);
        //}
        //if ($('#ddlNotify').val() != "") {
        //    this.bolForm.value.NotifyType = "3";
        //    alert(this.bolForm.value.NotifyType);
        //}
        //if ($('#ddlNotifyAlso').val() != "") {
        //    this.bolForm.value.NotifyAlsoType = "4";
        //    alert(this.bolForm.value.NotifyAlsoType);
        //}
        
        
        
       
       
        this.bolForm.value.BLNumberID = 0;
        if ($('#ddlDeliveryAgent').val() != null) {
            this.bolForm.value.DeliveryAgent = $('#ddlDeliveryAgent').val();
        }
        else {
            this.bolForm.value.DeliveryAgent = 0;
        }
        if ($('#ddlOrigin').val() != "") {
            this.bolForm.value.OriginID = $('#ddlOrigin').val();
        }
        else {
            this.bolForm.value.OriginID = 0;
        }
        if ($('#ddlLoadPort').val() != "") {
            this.bolForm.value.LoadPortID = $('#ddlLoadPort').val();
        }
        else {
            this.bolForm.value.LoadPortID = 0;
        }
        if ($('#ddlDischarge').val() != "") {
            this.bolForm.value.DischargeID = $('#ddlDischarge').val();
        }
        else {
            this.bolForm.value.DischargeID = 0;
        }
        if ($('#ddlDestination').val() != "") {
            this.bolForm.value.DestinationID = $('#ddlDestination').val();
        }
        else {
            this.bolForm.value.DestinationID = 0;
        }
        if ($('#ddlBLTypesV').val() != null) {
            this.bolForm.value.BLTypeID = $('#ddlBLTypesV').val();
        }
        else {
            this.bolForm.value.BLTypeID = 0;
        }
        alert($('#ddlPaymentTerms').val());
        if ($('#ddlPaymentTerms').val() != null) {
            this.bolForm.value.PaymentTermsID = $('#ddlPaymentTerms').val();
        }
        else {
            this.bolForm.value.PaymentTermsID = 0;
        }

        //this.uploadedfile = $('#txtAttachFile').val();
        //this.customerapprovalfile = $('#txtApproval').val();
        //alert(this.uploadedfile);
        //alert(this.customerapprovalfile);
      
        if (this.uploadedfile != null) {
                this.bolForm.value.AttachShippingBill = this.uploadedfile;
            }
            else {
            this.bolForm.value.AttachShippingBill = this.shippingbill;
            }

     
        if (this.customerapprovalfile != null) {
            this.bolForm.value.AttachCustomerApproval = this.customerapprovalfile;
        }
        else {
            this.bolForm.value.AttachCustomerApproval = this.approvalattach;
        }
        
       
        if ($('#ChkRFLBOL').val() == "on") {
            
            this.bolForm.value.RFLBol = 1;
        
        }
        else {

            this.bolForm.value.RFLBol = 0;
        }
        if ($('#ChkPrintWt').val() == "on") {
            this.bolForm.value.PrintWt = 1;
        }
        else {

            this.bolForm.value.PrintWt = 0;
        }
        if ($('#ChkPrintNetWt').val() == "on") {
            this.bolForm.value.PrintNetWt = 1;
        }
        else {

            this.bolForm.value.PrintNetWt = 0;
        }
        if ($('#ChkNotPrint').val() == "on") {
            this.bolForm.value.NotPrint = 1;
        }
        else {

            this.bolForm.value.NotPrint = 0;
        }
        this.bolForm.value.UserID = localStorage.getItem("UserID");
        this.bolservice.saveBOL(this.bolForm.value).subscribe(data => {
           
            Swal.fire("Record Saved Successfully");
            /*this.router.navigate(['/views/exportmanager/bookinglevel/bol/bol']);*/
            this.BLNumberList();
            
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
        $('#txtAttachFile').val('');
        $('#txtApproval').val('');
    }

    //btnEmailSend() {
    //    alert('test');
    //    this.bolservice.getEmailSend(this.bolForm.value).subscribe(data => {
            
    //    },
    //        (error: HttpErrorResponse) => {
    //            Swal.fire(error.message)
    //        });
    //}


}
