import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { error } from 'console';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import Swal from 'sweetalert2';
import { Key } from 'protractor';
import { catchError } from 'rxjs/operators';
import { concat, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
    MycontainerDynamicGrid, myBL, MyMutiplecontainerDynamicGrid, MyMutipleBlNoDynamicGrid, MyMutipleBlCntrDynamicGrid,
    ExcelCntrDetails, MyErrorList
} from 'src/app/model/Container';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { ContainerService } from 'src/app/services/container.service';
import { myCntrTypesDynamicGrid, MyCargoMaster } from '../../../../model/enquiry';
import { Title } from '@angular/platform-browser';
import { ExportbookingService } from '../../../../services/exportbooking.service';
import * as XLSX from 'xlsx';
import { LogdetailsService } from '../../../../services/logdetails.service';



declare let $: any;


@Component({
    selector: 'app-containers',
    templateUrl: './containers.component.html',
    styleUrls: ['./containers.component.css']
})
export class ContainersComponent implements OnInit {

    CreatedOn: string = '';
    CreatedBy: string = '';
    ModifiedOn: string = '';
    ModifiedBy: string = '';

    statusPending: boolean[] = [];
    statusUpdated: boolean[] = [];
    title = 'Booking Level Tasks - Containers';
    Viewform: FormGroup;
    newfillCntrDynamicGrid: any = [];
    fillCntrDynamicGrid: Array<MycontainerDynamicGrid> = [];
    fillCargoErrorList: Array<MyErrorList> = [];
    newfillMutipleCntrDynamicGrid: any = [];
    fillMutipleCntrDynamicGrid: Array<MyMutiplecontainerDynamicGrid> = [];
    fillBLNoDynamicGrid: Array<MyMutipleBlNoDynamicGrid> = [];
    fillBLCntrDynamicGrid: Array<MyMutipleBlCntrDynamicGrid> = [];
    //newFinalArray: any = [];
    //FinalArray: Array<MyMutiplecontainerDynamicGrid> = [];
    fillBLNumber: Array<myBL> = [];
    fillCargo: MyCargoMaster[];
    public disHAZlClass: boolean = true;
    public Adddisabled: boolean = true;
    public Removedisabled: boolean = true;
    public Includedisabled: boolean = true;
    dsExcel: Array<ExcelCntrDetails> = [];
    newExcel: any = {};

    HazarOpt: number = 1;
    OOGOpt: number = 1;
    RefferOpt: number = 1;
    DoorOpenOPT: number = 1;
    BookingID = 0;
    DatetimeDisplay = '';

    bkgNo: string = '';
    bkgparty: string = '';
    destination: string = '';
    vesselname: string = '';
    voyageno: string = '';
    loadPort: string = '';
    constructor(private router: Router, private route: ActivatedRoute, private titleService: Title, private fb: FormBuilder, private ES: EncrDecrServiceService, private service: ContainerService, private bs: ExportbookingService, private LS: LogdetailsService) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
        this.createform();
        this.InitalBind();


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
                this.Viewform.value.ID = queryString["ID"].toString();
                this.BookingID = queryString["ID"].toString();

                this.ExistingContainerBind();
                this.ViewBkgBasicList();
            }

        });

    }

    ViewBkgBasicList() {
        this.Viewform.value.BkgID = this.BookingID;
        this.bs.getExBookingValues(this.Viewform.value).subscribe(data => {
            this.Viewform.patchValue(data[0]);
            this.bkgNo = data[0].BookingNo;
            this.bkgparty = data[0].BookingParty;
            this.vesselname = data[0].VesselName;
            this.voyageno = data[0].VoyageNo;
            this.loadPort = data[0].LoadPort;
            this.destination = data[0].Destination;
        });
    }

    InitalBind() {
        this.newfillCntrDynamicGrid = { ID: 0, Principal: '', Yard: '', CntrNo: '', Size: '', Type: '', PickupDate: '', GateInDate: '', OnBordDate: '', BLNo: '', PartBL: 0, OPT: 0, BLID: 0 };
        this.fillCntrDynamicGrid.push(this.newfillCntrDynamicGrid);

        this.newfillMutipleCntrDynamicGrid = { CntrNo: '', Result: '' };
        this.fillMutipleCntrDynamicGrid.push(this.newfillMutipleCntrDynamicGrid);


        this.service.getCurrentDatetime(this.Viewform.value).subscribe((data) => {
            this.DatetimeDisplay = data[0].DateTime;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    CargoUpload() {
        this.fillCargoErrorList.length = 0;
        $('#CargoDetails').modal('show');
    }

    createform() {
        this.Viewform = this.fb.group({
            ID: 0,
            CntrNo: '',
            CntrType: '',
            SealNo: '',
            CustomerSeal: '',
            AlertMessage: "",
            CBMVolume: '',
            NoofPkgs: '',
            NetWeight: '',
            KGSWeight: '',
            HAZlClass: '',
            BOLID: 0,
            HazarOpt: 1,
            OOGOpt: 1,
            RefferOpt: 1,
            HAZClass: '',
            IMCOCode: '',
            Lenght: '',
            Width: '',
            Height: '',
            Temperature: '',
            Humidity: '',
            Ventilation: '',
            DoorOpenOPT: 1,
            CntrID: 0,
            MultipleCntrNo: '',
            PakageType: 0,
            OdoRad:0
        });
    }

    btntabclick(tab) {

        //var values = "ID: " + this.Viewform.value.ID;
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

    ExistingContainerBind() {


        this.Viewform.value.LogInID = this.BookingID;
        this.Viewform.value.SeqNo = 1;
        this.Viewform.value.PageName = "Container";
        this.LS.getLogDetails(this.Viewform.value).subscribe(data => {

            if (data.length > 0) {
                this.CreatedOn = data[0].Date;
                this.CreatedBy = data[0].UserName;
            }
            else {
                this.CreatedOn = "NA";
                this.CreatedBy = "NA";
            }

        });

        this.Viewform.value.LogInID = this.BookingID;
        this.Viewform.value.SeqNo = 2;
        this.Viewform.value.PageName = "Container";
        this.LS.getLogDetails(this.Viewform.value).subscribe(data => {

            this.ModifiedOn = data[0].Date;
            this.ModifiedBy = data[0].UserName;
        });

        this.Viewform.value.BkgID = this.BookingID;
        this.service.getBLContainerALLList(this.Viewform.value).subscribe((data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].Status == "Updated") {
                    this.statusUpdated[i] = true;
                    this.statusPending[i] = false;

                }
                if (data[i].Status == "Pending") {
                    this.statusUpdated[i] = false;
                    this.statusPending[i] = true;

                }
                this.fillCntrDynamicGrid.length = 0;
                if (data.length > 0) {
                    for (let item of data) {

                        this.fillCntrDynamicGrid.push({
                            'ID': item.ID,
                            'Status': item.Status,
                            'CntrNo': item.CntrNo,
                            'Size': item.Size,
                            'Type': item.Type,
                            'PickupDate': item.PickupDate,
                            'GateInDate': item.GateInDate,
                            'OnBordDate': item.OnBordDate,
                            'BLNo': item.BLNo,
                            'PartBL': item.PartBL,
                            'OPT': item.OPT,
                            'BLID': item.BLID,
                            'Commodity': item.Commodity

                        });

                    }

                }
                else {
                    this.newfillCntrDynamicGrid = { ID: 0, Principal: '', Yard: '', CntrNo: '', Size: '', Type: '', PickupDate: '', GateInDate: '', OnBordDate: '', BLNo: '', PartBL: 0, OPT: 0, BLID: 0 };
                    this.fillCntrDynamicGrid.push(this.newfillCntrDynamicGrid);


                }
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }




    BLContainerDetails(CntrIDv) {
        $('.my-select').select2();

        this.service.getCargoMasterList().subscribe(data => {
            this.fillCargo = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.Viewform.value.CntrID = CntrIDv;
        this.service.getBLNumberList(this.Viewform.value).subscribe((data) => {
            this.fillBLNumber = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.Viewform.value.CntrID = CntrIDv;
        this.Viewform.value.BkgID = this.BookingID;
        this.service.getBLContainerLalueList(this.Viewform.value).subscribe((data) => {


            this.Viewform.patchValue(data[0]);

            this.Viewform.get('CntrNo').patchValue(data[0].CntrNo);
            this.Viewform.get('CntrType').patchValue(data[0].Size);
            this.Viewform.get('CntrID').patchValue(data[0].ID);
            this.Viewform.get('SealNo').patchValue(data[0].SealNo);
            this.Viewform.get('CustomerSeal').patchValue(data[0].CustomerSeal);

            this.Viewform.get('KGSWeight').patchValue(data[0].KGSWeight);
            this.Viewform.get('NetWeight').patchValue(data[0].NetWeight);
            this.Viewform.get('Temperature').patchValue(data[0].Temperature);
            this.Viewform.get('Humidity').patchValue(data[0].Humidity);
            this.Viewform.get('Ventilation').patchValue(data[0].Ventilation);

            this.Viewform.get('CBMVolume').patchValue(data[0].CBMVolume);
            this.Viewform.get('NoofPkgs').patchValue(data[0].NoofPkgs);
            //this.Viewform.get('PakageType').patchValue(data[0].PakageType);
            this.Viewform.get('HAZClass').patchValue(data[0].HAZClass);
            this.Viewform.get('IMCOCode').patchValue(data[0].IMCOCode);
            this.Viewform.get('Lenght').patchValue(data[0].Lenght);
            this.Viewform.get('Width').patchValue(data[0].Width);
            this.Viewform.get('Height').patchValue(data[0].Height);

            this.Viewform.get('HazarOpt').patchValue(data[0].HazarOpt);
            this.Viewform.get('OdoRad').patchValue(data[0].OdoRad);
            this.Viewform.get('OOGOpt').patchValue(data[0].OOGOpt);
            this.Viewform.get('RefferOpt').patchValue(data[0].RefferOpt);

            this.OnclickHazaropt(data[0].HazarOpt);
            this.OnclickReeferOpt(data[0].RefferOpt);
            this.OnclickOOGOpt(data[0].OOGOpt);
            $('#BLID').select2().val(data[0].BLID);
            $('#ddlPackageType').select2().val(data[0].PakageType).trigger("change");
           // $('#ddlPackageType').select2().val(data[0].PakageType);
            this.ExistingContainerBind();



        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        $('#ContainerDetails').modal('show');
    }

    OnclickHazaropt(value) {

        if (value == 2) {

            this.Viewform.controls["HAZClass"].enable();
            this.Viewform.controls["IMCOCode"].enable();

        }
        else {
            this.Viewform.controls["HAZClass"].disable();
            this.Viewform.controls["IMCOCode"].disable();

        }
    }

    OnclickReeferOpt(value) {

        if (value == 2) {
            this.Viewform.controls["Temperature"].enable();
            this.Viewform.controls["Humidity"].enable();
            this.Viewform.controls["Ventilation"].enable();

        }
        else {
            this.Viewform.controls["Temperature"].disable();
            this.Viewform.controls["Humidity"].disable();
            this.Viewform.controls["Ventilation"].disable();

        }
    }
    OnclickOOGOpt(value) {

        if (value == 2) {
            this.Viewform.controls["Lenght"].enable();
            this.Viewform.controls["Width"].enable();
            this.Viewform.controls["Height"].enable();
        }
        else {
            this.Viewform.controls["Lenght"].disable();
            this.Viewform.controls["Width"].disable();
            this.Viewform.controls["Height"].disable();
        }
    }

    onBLCargoSubmit() {
        var Validation = "";

        //var BLID = $('#BLID').val();
        //if (BLID == null || BLID == "") {
        //    Validation += "<span style='color:red;'>*</span> <span>Please Select BLNumber</span></br>"
        //}

        var KGSWeight = $('#KGSWeight').val();
        if (KGSWeight == null || KGSWeight == "") {
            Validation += "<span style='color:red;'>*</span> <span>Please Enter Gross Weight(KGS)</span></br>"
        }
        var NoofPkgs = $('#NoofPkgs').val();
        if (NoofPkgs == null || NoofPkgs == "") {
            Validation += "<span style='color:red;'>*</span> <span>Please Enter No of Pkgs</span></br>"
        }


        if (Validation != "") {
            Swal.fire(Validation);
            return false;
        }
        if ($('#BLID').val() != "?" && $('#BLID').val() != null)
            this.Viewform.value.BLID = $('#BLID').val();
        else
            this.Viewform.value.BLID = 0;

        this.Viewform.value.BkgID = this.BookingID;
      
        this.Viewform.value.PakageType = $('#ddlPackageType').val();
        this.service.BLCargoSaveList(this.Viewform.value).subscribe((data) => {

            if (data.length > 0) {
                this.ExistingContainerBind();


                this.Viewform.value.LogInID = this.BookingID
                this.Viewform.value.SeqNo = 2;
                this.Viewform.value.PageName = "Container";
                this.Viewform.value.UserID = localStorage.getItem("UserID");
                this.LS.LogDataInsert(this.Viewform.value).subscribe(data => {

                });



                Swal.fire(data[0].AlertMessage);
                $('#ContainerDetails').modal('hide');
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    importcontainer() {

        $('#CopyContModal').modal('show');
    }

    //onCntrCheckSubmit() {
    //    this.fillMutipleCntrDynamicGrid.length = 0;
    //    var CntrNos1 = this.Viewform.value.MultipleCntrNo.replace(/\n/g, '').split(',');
    //    var CntrNos = "";
    //    for (let item of this.fillCntrDynamicGrid) {
    //        CntrNos += item.CntrNo + ",";
    //    }
    //    var CntrNos2 = CntrNos.split(',');
    //    // var FinalArray = { CntrNo: '' };

    //    for (var i = 0; i < CntrNos1.length; i++) {

    //        var matchFound = false;
    //        for (var j = 0; j < CntrNos2.length; j++) {

    //            var temp = CntrNos1[i].split(".");

    //            if (CntrNos2[j] == temp[0]) {
    //                matchFound = true;
    //                break;
    //            }
    //        }
    //        if (matchFound) {
    //            this.fillMutipleCntrDynamicGrid.push({ 'CntrNo': CntrNos1[i], 'Result': 'Yes' });

    //        }
    //        if (!matchFound) {
    //            this.fillMutipleCntrDynamicGrid.push({ 'CntrNo': CntrNos1[i], 'Result': 'No' });

    //        }

    //    }


    //}

    //SubmitConfirm() {
    //    var CntrNosSplit1 = "";
    //    var CntrNosSplit2 = "";
    //    for (let item of this.fillCntrDynamicGrid) {
    //        CntrNosSplit1 += item.CntrNo + ",";
    //    }
    //    for (let item of this.fillMutipleCntrDynamicGrid) {
    //        CntrNosSplit2 += item.CntrNo + ",";
    //    }

    //    var CntrResult1 = CntrNosSplit1.split(',');
    //    var CntrResult2 = CntrNosSplit2.split(',');

    //    for (var i = 0; i < CntrResult1.length; i++) {

    //        var matchFound = false;
    //        for (var j = 0; j < CntrResult2.length; j++) {

    //            var temp = CntrResult1[i].split(".");

    //            if (CntrResult2[j] == temp[0]) {
    //                for (let item of this.fillCntrDynamicGrid) {
    //                    if (item.CntrNo == CntrResult2[j]) {
    //                        item.OPT = 1;
    //                    }
    //                }
    //                matchFound = true;
    //                break;
    //            }
    //        }
    //        //if (matchFound)
    //        //{
    //        //    for (let item of this.fillCntrDynamicGrid) {
    //        //        item.OPT = 1
    //        //    }

    //        //}
    //    }

    //}

    //onBLCntrAssingSubmit() {

    //    this.Viewform.value.BkgID = 1;
    //    this.Viewform.value.SessionFinYear = "2022";
    //    var ItemsCntr = [];
    //    var BLIDv = 0;
    //    var vtrue = 0;
    //    var vCntrtrue = 0;
    //    for (let item of this.fillBLNoDynamicGrid) {
    //        if (item.OPT == 1) {
    //            BLIDv = item.ID;
    //            vtrue = 1;
    //        }
    //    }
    //    for (let item of this.fillBLCntrDynamicGrid) {

    //        if (item.OPT == 1) {
    //            vCntrtrue = 1;
    //            ItemsCntr.push('Insert:' + item.ID
    //            );
    //        }
    //    }
    //    if (vtrue == 0) {
    //        Swal.fire("Please check BLNumber");
    //        return false;
    //    }
    //    if (vCntrtrue == 0) {
    //        Swal.fire("Please check Container");
    //        return false;
    //    }
    //    this.Viewform.value.BLID = BLIDv;
    //    this.Viewform.value.ItemsCntr = ItemsCntr.toString();

    //    this.service.BLContainerAddList(this.Viewform.value).subscribe((data) => {

    //        if (data.length > 0) {
    //            this.ExistingContainerBind();
    //            Swal.fire(data[0].AlertMessage);
    //        }
    //    }, (error: HttpErrorResponse) => {
    //        Swal.fire(error.message);
    //    });
    //}

    //ContainerCheckEvent(gRow) {
    //    this.Adddisabled = true;
    //    this.Removedisabled = true;
    //    this.Includedisabled = true;
    //    if (gRow.OPT == 1 && gRow.BLNo == "") {

    //        this.Adddisabled = false;
    //        this.Includedisabled = false;
    //    }

    //    else if (gRow.OPT == 1 && gRow.BLNo != "" && gRow.PartBL == "") {
    //        this.Removedisabled = false;
    //    }
    //    else if (gRow.OPT == false && gRow.BLNo != "") {
    //        this.Adddisabled = true;
    //        this.Includedisabled = true;
    //    }
    //    else if (gRow.OPT == 1 && gRow.PartBL == 1) {
    //        this.Adddisabled = false;
    //    }

    //}



    onFileChange(evt: any) {


        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();

        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            const wsname: string = wb.SheetNames[0];

            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            // console.log('Header', ws);

            this.dsExcel = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
            let dataarray = this.dsExcel.slice(1);
            // console.log(dataarray);
            var ItemsPr1 = [];

            for (let item of dataarray) {
                if (typeof item[0] != "undefined") {
                    ItemsPr1.push('Insert:' + item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10], item[11], item[12], item[13], item[14], item[15], item[16], item[17], item[18]);
                }
            };
            this.Viewform.value.ItemsCntr = ItemsPr1.toString();
            this.Viewform.value.BkgID = this.BookingID;
            this.service.ExcelBLCargoSaveList(this.Viewform.value).subscribe((data) => {
                if (data.length > 0) {
                    this.fillCargoErrorList = data;
                    this.ExistingContainerBind();
                    Swal.fire({
                        title: data[0].UploadStatusID,
                        showDenyButton: false,
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('#CargoDetails').modal('hide');
                            var values = "ID: " + this.BookingID;
                            var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
                            this.router.navigate(['/views/exportmanager/bookinglevel/containers/containers'], { queryParams: { encrypted } });
                        }
                    });
                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });
        };

        reader.readAsBinaryString(target.files[0]);


    }
}
