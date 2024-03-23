import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrDecrServiceService } from '../../../../services/encr-decr-service.service';
import { ExportbookingService } from '../../../../services/exportbooking.service';
import {
    MycontainerDynamicGrid, myBL, MyMutiplecontainerDynamicGrid, MyMutipleBlNoDynamicGrid, MyMutipleBlCntrDynamicGrid,
    ExcelCntrDetails, BLNumberDynamicGrid
} from 'src/app/model/Container';
import { myCntrTypesDynamicGrid, MyCargoMaster } from '../../../../model/enquiry';
import { ContainerService } from 'src/app/services/container.service';
import { Key } from 'protractor';
import { catchError } from 'rxjs/operators';
import { concat, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
    selector: 'app-blallotment',
    templateUrl: './blallotment.component.html',
    styleUrls: ['./blallotment.component.css']
})
export class BlallotmentComponent implements OnInit {

    constructor(private router: Router, private route: ActivatedRoute, private titleService: Title, private ES: EncrDecrServiceService, private bs: ExportbookingService, private fb: FormBuilder, private service: ContainerService,) { }

    ViewformBL: FormGroup;
    BookingID = 0;
    newfillCntrDynamicGrid: any = [];
    fillCntrDynamicGrid: Array<MycontainerDynamicGrid> = [];
    newfillCntrBLDynamicGrid: any = [];
    fillCntrBLDynamicGrid: Array<MycontainerDynamicGrid> = [];
    fillBLNumberDynamicGrid: Array<BLNumberDynamicGrid> = [];
    BLIDv = 0;
    CntrNumber: string = '';
    bkgNo: string = '';
    bkgparty: string = '';
    destination: string = '';
    vesselname: string = '';
    voyageno: string = '';
    loadPort: string = '';
    statusActive: boolean[] = [];
    statusInactive: boolean[] = [];

    divRecords: boolean = true;
    divNoRecords: boolean = false;

    ngOnInit() {

        if (this.fillCntrDynamicGrid.length > 0) {
            alert('divrords');
            this.divNoRecords = true;
            this.divRecords = false;
        }
        //  this.titleService.setTitle(this.title);
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

                this.BookingID = queryString["ID"].toString();
                this.ExistingContainerBind();
                this.ViewBkgBasicList();
            }

        });
    }
    ViewBkgBasicList() {
        this.ViewformBL.value.BkgID = this.BookingID;
        this.service.getExBookingValues(this.ViewformBL.value).subscribe(data => {
            this.ViewformBL.patchValue(data[0]);
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

    }


    createform() {
        this.ViewformBL = this.fb.group({
            ID: 0,
            NoofBL: 0,
        });
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

    ExistingContainerBind() {

        this.ViewformBL.value.BkgID = this.BookingID;
        this.service.getBLContainerViewList(this.ViewformBL.value).subscribe((data) => {
            this.fillCntrDynamicGrid.length = 0;
            // console.log(data);
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
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.ViewformBL.value.BkgID = this.BookingID;
        this.service.getBLContainerList(this.ViewformBL.value).subscribe((data) => {
            this.fillCntrBLDynamicGrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillCntrBLDynamicGrid.push({
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
                this.newfillCntrBLDynamicGrid = { ID: 0, Principal: '', Yard: '', CntrNo: '', Size: '', Type: '', PickupDate: '', GateInDate: '', OnBordDate: '', BLNo: '', PartBL: 0, OPT: 0, BLID: 0 };
                this.fillCntrBLDynamicGrid.push(this.newfillCntrBLDynamicGrid);


            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.ViewformBL.value.BkgID = this.BookingID;
        this.service.getBLNumberDisplayList(this.ViewformBL.value).subscribe((data) => {
            this.OnClickBLNumberdisplay(data[0].ID);
            for (let i = 0; i < data.length; i++) {

                if (i == 0) {
                    this.statusActive[i] = true;
                    this.statusInactive[i] = false;
                }
                else {
                    this.statusInactive[i] = true;
                    this.statusActive[i] = false;
                }

            }
            this.fillBLNumberDynamicGrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillBLNumberDynamicGrid.push({
                        'ID': item.ID,
                        'BLNumber': item.BLNumber
                    });
                }

            }

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    onCheck(CntrNo) {
        this.CntrNumber = CntrNo;
    }

    onSubmit() {
        var checked = $("#datatable input[type=checkbox]:checked").length;

        if (checked == 1 && this.CntrNumber == '') {
            Swal.fire("Container is Empty");
            document.querySelectorAll('.checkbox').forEach(_checkbox => {
                (<HTMLInputElement>_checkbox).checked = false;
            });
        } else {

            this.ViewformBL.value.BkgID = this.BookingID;
            this.ViewformBL.value.SessionFinYear = "2022";
            var ItemsCntr = [];
            for (let item of this.fillCntrDynamicGrid) {
                if (item.OPT == 1) {
                    ItemsCntr.push('Insert:' + item.ID
                    );
                }
            }
            if (ItemsCntr.length == 0) {
                Swal.fire("Please check Container No");
                return false;
            }
            var TotalCntrNo = 0;
            for (let item of this.fillCntrDynamicGrid) {
                if (item.OPT == 1) {
                    TotalCntrNo++;
                }
                //if (item.ID > 0) {
                //    alert('divrords');
                //    this.divRecords = true;
                //    this.divNoRecords = false;
                //}
                //else {
                //    alert('divnorords');
                //    this.divNoRecords = true;
                //    this.divRecords = false;
                //}
            }


            var Tilte = "Total " + TotalCntrNo + " container selected for New BL # Allotment , Do you want to proceed?";
            Swal.fire({
                title: Tilte,
                showDenyButton: true,
                confirmButtonText: 'YES',
                denyButtonText: `NO`,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.ViewformBL.value.ItemsCntr = ItemsCntr.toString();
                    this.ViewformBL.value.BkgID = this.BookingID;
                    this.service.BLContainerSaveList(this.ViewformBL.value).subscribe((data) => {

                        if (data.length > 0) {
                            this.ExistingContainerBind();
                            Swal.fire(data[0].AlertMessage);
                        }
                    }, (error: HttpErrorResponse) => {
                        Swal.fire(error.message);
                    });
                }
                else {

                }
            })
        }
    }

    OnClickBLNumberdisplay(BLIDv) {
        this.BLIDv = BLIDv;
        this.ViewformBL.value.BkgID = this.BookingID;
        this.ViewformBL.value.BLID = BLIDv;
        this.service.getBLContainerList(this.ViewformBL.value).subscribe((data) => {
            this.fillCntrBLDynamicGrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillCntrBLDynamicGrid.push({
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
                this.newfillCntrBLDynamicGrid = { ID: 0, Principal: '', Yard: '', CntrNo: '', Size: '', Type: '', PickupDate: '', GateInDate: '', OnBordDate: '', BLNo: '', PartBL: 0, OPT: 0, BLID: 0 };
                this.fillCntrBLDynamicGrid.push(this.newfillCntrBLDynamicGrid);


            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }


    onRemoved() {

        var vtrue = 0;
        this.ViewformBL.value.BkgID = this.BookingID;
        this.ViewformBL.value.BLID = this.BLIDv;
        this.ViewformBL.value.SessionFinYear = "2022";

        var HeaderTitle = "Do you want to remove this BL";
        Swal.fire({
            title: HeaderTitle,
            showDenyButton: true,
            confirmButtonText: 'YES',
            denyButtonText: `NO`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.service.BLContainerRemoveList(this.ViewformBL.value).subscribe((data) => {

                    if (data.length > 0) {
                        this.ExistingContainerBind();
                        Swal.fire(data[0].AlertMessage);
                    }
                }, (error: HttpErrorResponse) => {
                    Swal.fire(error.message);
                });

            }
            else {

            }
        });
    }

    PartBLOpenWindows(event) {
        for (let item of this.fillCntrDynamicGrid) {
            if (item.OPT == 0) {
                Swal.fire("Please Select a Container");
                document.querySelectorAll('.checkbox').forEach(_checkbox => {
                    (<HTMLInputElement>_checkbox).checked = false;
                });
            }
            else if (item.OPT == 1 && this.CntrNumber == '') {
                Swal.fire("Container is Empty");
                document.querySelectorAll('.checkbox').forEach(_checkbox => {
                    (<HTMLInputElement>_checkbox).checked = false;
                });
            }
            else {
                var CheckItem = event.target.checked;
                if (CheckItem == true) {
                    $('#PartBLModal').modal('show');
                }
            }
        }


    }

    PartBlCreate() {



        var NoofBLv = this.ViewformBL.value.NoofBL;

        this.ViewformBL.value.BkgID = this.BookingID;
        this.ViewformBL.value.SessionFinYear = "2022";
        var ItemsCntr = [];
        for (let item of this.fillCntrDynamicGrid) {
            if (item.OPT == 1) {
                ItemsCntr.push('Insert:' + item.ID
                );
            }
        }
        if (ItemsCntr.length == 0) {
            Swal.fire("Please check  Container No");
            return false;
        }
        var TotalCntrNo = 0;
        for (let item of this.fillCntrDynamicGrid) {
            if (item.OPT == 1) {
                TotalCntrNo++;
            }
        }
        var Tilte = "Total " + TotalCntrNo + " container selected for New Part BL # Allotment, Do you want to proceed?";
        Swal.fire({
            title: Tilte,
            showDenyButton: true,
            confirmButtonText: 'YES',
            denyButtonText: `NO`,
        }).then((result) => {
            if (result.isConfirmed) {
                $('#PartBLModal').modal('hide');
                document.querySelectorAll('.checkbox').forEach(_checkbox => {
                    (<HTMLInputElement>_checkbox).checked = false;
                });
                this.ViewformBL.value.ItemsCntr = ItemsCntr.toString();
                this.ViewformBL.value.BkgID = this.BookingID;
                this.service.BLContainerSaveList(this.ViewformBL.value).subscribe((data) => {

                    if (data.length > 0) {
                        this.ExistingContainerBind();
                        Swal.fire(data[0].AlertMessage);
                    }
                }, (error: HttpErrorResponse) => {
                    Swal.fire(error.message);
                });
            }
            else {

            }
        })
    }
}
