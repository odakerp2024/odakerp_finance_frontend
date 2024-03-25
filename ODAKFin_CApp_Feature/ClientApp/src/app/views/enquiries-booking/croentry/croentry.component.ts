import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EnquiryService } from '../../../services/enquiry.service';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown, MyAgencyDropdown } from 'src/app/model/Admin';
import { EncrDecrServiceService } from '../../../services/encr-decr-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { myCntrTypesDynamicGrid } from '../../../model/enquiry';
import { CroService } from '../../../services/cro.service';
import { CRODynamicGrid, MyCro } from '../../../model/cro';
import { LogdetailsService } from '../../../services/logdetails.service';
declare let $: any;
@Component({
    selector: 'app-croentry',
    templateUrl: './croentry.component.html',
    styleUrls: ['./croentry.component.css']
})
export class CROEntryComponent implements OnInit {

    CreatedOn: string = '';
    CreatedBy: string = '';
    ModifiedOn: string = '';
    ModifiedBy: string = '';

    CustomerMasterAllvalues: MyCustomerDropdown[];
    depoMasterAllvalues: MyCro[];
    StuffLMasterAllvalues: MyCro[];
    croForm: FormGroup;
    fillCntrType: MyCntrTypeDropdown[];
    newDynamicCntrNoGrid: any = {};
    DynamicCntrNoGrid: Array<CRODynamicGrid> = [];
    CROID = 0;
    BkgvID = 0;
    constructor(private router: Router, private route: ActivatedRoute, private service: EnquiryService, private fb: FormBuilder, private ES: EncrDecrServiceService, private cs: CroService, private LS: LogdetailsService) { }

    ngOnInit() {
        $('.my-select').select2();
        $(document).on('select2:open', (e) => {
            const selectId = e.target.id

            $(".select2-search__field[aria-controls='select2-" + selectId + "-results']").each(function (
                key,
                value,
            ) {
                value.focus();
            })
        })
        this.newDynamicCntrNoGrid = { BID: 0, CntrTypeID: 0, BookingQty: '', RequiredQty: '' };
        this.DynamicCntrNoGrid.push(this.newDynamicCntrNoGrid);
        this.createForm();
        this.onInitalBinding();
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
                this.BkgvID = queryString["ID"];
                this.ExistingBkgCntrTypevaluesBind(queryString["ID"].toString());
            }
            else {

                this.CROID = queryString["CROID"].toString();
                this.ExistingCROBind(queryString["CROID"].toString());
                this.ExistingCROCntrType(queryString["CROID"].toString());
            }
        });
    }

    ExistingBkgCntrTypevaluesBind(Idv) {

        this.croForm.value.BkgID = Idv;
        this.cs.getExistingBkgCntrTypeNos(this.croForm.value).subscribe((data) => {
            if (data.length > 0) {
                this.DynamicCntrNoGrid.length = 0;
                for (let item of data) {
                    this.DynamicCntrNoGrid.push({
                        'BID': item.BID,
                        'CntrTypeID': item.CntrTypeID,
                        'BookingQty': item.BookingQty,
                        'RequiredQty': '',
                    })
                }
            }
            else {
                this.DynamicCntrNoGrid.length = 0;
                this.newDynamicCntrNoGrid = { BID: 0, CntrTypeID: 0, BookingQty: '', RequiredQty: '' };

                this.DynamicCntrNoGrid.push(this.newDynamicCntrNoGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }
    ExistingCROBind(Idv) {
        this.croForm.value.ID = Idv;

        this.croForm.value.LogInID = this.CROID;
        this.croForm.value.SeqNo = 1;
        this.croForm.value.PageName = "CRO";
        this.LS.getLogDetails(this.croForm.value).subscribe(data => {

            if (data.length > 0) {
                this.CreatedOn = data[0].Date;
                this.CreatedBy = data[0].UserName;
            }
            else {
                this.CreatedOn = "NA";
                this.CreatedBy = "NA";
            }

        });

        this.croForm.value.LogInID = this.CROID;
        this.croForm.value.SeqNo = 2;
        this.croForm.value.PageName = "CRO";
        this.LS.getLogDetails(this.croForm.value).subscribe(data => {

            this.ModifiedOn = data[0].Date;
            this.ModifiedBy = data[0].UserName;
        });

        this.cs.ExistingCROBind(this.croForm.value).subscribe(data => {
            this.croForm.patchValue(data[0]);
            $('#ddlReleaseTo').select2().val(data[0].ReleaseToID);
            $('#ddlDepo').select2().val(data[0].PickUpDepotID);
            $('#ddlSurveyor').select2().val(data[0].SurveyorID);
            $('#ddlStuff').select2().val(data[0].StuffID);
            this.BkgvID = data[0].BkgID;
        });

    }
    ExistingCROCntrType(Idv) {
        this.croForm.value.ID = Idv;

        this.cs.getExistingCROCntrTypeNos(this.croForm.value).subscribe((data) => {
            if (data.length > 0) {
                this.DynamicCntrNoGrid.length = 0;
                for (let item of data) {
                    this.DynamicCntrNoGrid.push({
                        'BID': item.BID,
                        'CntrTypeID': item.CntrTypeID,
                        'BookingQty': item.BookingQty,
                        'RequiredQty': item.RequiredQty,
                    })
                }
            }
            else {
                this.DynamicCntrNoGrid.length = 0;
                this.newDynamicCntrNoGrid = { BID: 0, CntrTypeID: 0, BookingQty: '', RequiredQty: '' };

                this.DynamicCntrNoGrid.push(this.newDynamicCntrNoGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }
    onInitalBinding() {


        this.OnBindCustomers();
        this.OnBindStuffList();
        this.OnBindDepotList();
        this.OnBindCntrTypeList();
    }
    OnBindCustomers() {
        this.service.getCustomerList().subscribe(data => {
            this.CustomerMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    OnBindStuffList() {
        this.cs.getStuffList(this.croForm.value).subscribe(data => {
            this.StuffLMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    OnBindDepotList() {
        this.cs.getDepoList(this.croForm.value).subscribe(data => {
            this.depoMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    OnBindCntrTypeList() {
        this.service.getCntrTypesList().subscribe(data => {
            this.fillCntrType = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    createForm() {
        //if (this.croForm.value.ID != null) {

        //    this.croForm = this.fb.group({
        //        ID: 0,
        //        CRONo:'',
        //        ValidTill: '',
        //        ReleaseToID: 0,
        //        SurveyorID: 0,
        //        PickUpDepotID: 0,
        //        StuffID: 0,
        //        YardRemarks: '',
        //        CusRemarks: '',
        //    });
        //}
        //else {
        this.croForm = this.fb.group({
            ID: 0,
            CRONo: '',
            ValidTill: '',
            ReleaseToID: 0,
            SurveyorID: 0,
            PickUpDepotID: 0,
            StuffID: 0,
            YardRemarks: '',
            CusRemarks: '',
            LogInID: 0,
        });

        //}
    }
    OnSubmitCRO() {

        var validation = "";


        if (this.croForm.value.ValidTill == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select ValidTill Date</span></br>"
        }

        if ($("#ddlReleaseTo").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Release To</span></br>"
        }
        if ($("#ddlDepo").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Pick Up Depot</span></br>"
        }
        if ($("#ddlSurveyor").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Surveyor</span></br>"
        }
        if ($("#ddlStuff").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Stuffing Point</span></br>"
        }
        for (let item of this.DynamicCntrNoGrid) {
            if (item.RequiredQty == "0") {
                validation += "ZERO is not allowed for Release Quantity</br>";
            }

            if (item.RequiredQty > item.BookingQty) {
                validation += "Required Quantity is higher than Booking Quantity</br>";
            }

        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }

        if ($("#ddlReleaseTo").val() == null) {
            this.croForm.value.ReleaseToID = 0;
        }
        else {
            this.croForm.value.ReleaseToID = $('#ddlReleaseTo').val();
        }

        if ($("#ddlDepo").val() == null) {
            this.croForm.value.PickUpDepotID = 0;
        }
        else {
            this.croForm.value.PickUpDepotID = $('#ddlDepo').val();
        }
        if ($("#ddlSurveyor").val() == null) {
            this.croForm.value.SurveyorID = 0;
        }
        else {
            this.croForm.value.SurveyorID = $('#ddlSurveyor').val();
        }
        if ($("#ddlStuff").val() == null) {
            this.croForm.value.StuffID = 0;
        }
        else {
            this.croForm.value.StuffID = $('#ddlStuff').val();
        }


        var Items = [];

        for (let item of this.DynamicCntrNoGrid) {
            var BIDv = 0;
            if (item.BID != 0) {
                if (typeof item.BID == "undefined")
                    BIDv = 0;
                else
                    BIDv = item.BID;

                Items.push('Insert:' + BIDv, item.CntrTypeID, item.BookingQty, item.RequiredQty
                );
            }
        }
        this.croForm.value.Items = Items.toString();
        this.croForm.value.BkgID = this.BkgvID;
        this.croForm.value.SessionFinYear = "2022";
        this.cs.SaveCro(this.croForm.value).subscribe(Data => {

            // console.log(Data);
            alert(Data[0].ID);
            this.croForm.value.LogInID = Data[0].ID;
            if (this.CROID == 0)
                this.croForm.value.SeqNo = 1;
            else
                this.croForm.value.SeqNo = 2;
            this.croForm.value.PageName = "CRO";
            this.croForm.value.UserID = localStorage.getItem("UserID");
            this.LS.LogDataInsert(this.croForm.value).subscribe(data => {

            });

            Swal.fire(Data[0].AlertMessage)

        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });

    }
    BackCroView() {

        var values = "ID: " + this.BkgvID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/enquiries-booking/croentry/croview/croview/'], { queryParams: { encrypted } });
    }
    updateTotal = function (val) {
        if (val.RequiredQty != 0) {
            if (val.RequiredQty > val.BookingQty) {

                Swal.fire('Required Quantity is higher than Booking Quantity');
            }
        }
        else {

            Swal.fire('ZERO is not allowed for Release Quantity');
        }

    }
}