import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Region, Office, State, Org, DynamicGrid, SalesOffice, SalesOfficeDD } from '../../../../model/org';
import { City, Country } from '../../../../model/common';
import { map, take, tap, startWith } from 'rxjs/operators';
import { MastersService } from '../../../../services/masters.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { PartyService } from '../../../../services/party.service';
import { AgencyService } from '../../../../services/agency.service';
import { Agency, DynamicGridAgency, DynamicGridPorts } from '../../../../model/Agency';
import { Inventory } from '../../../../model/Inventory';
import { InventoryService } from '../../../../services/inventory.service';
declare let $: any;
@Component({
    selector: 'app-containermaster',
    templateUrl: './containermaster.component.html',
    styleUrls: ['./containermaster.component.css']
})
export class ContainermasterComponent implements OnInit {

    DynamicGrid: Array<DynamicGridAgency> = [];
    DynamicGridPorts: Array<DynamicGridPorts> = [];
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    val: any = {};
    HDArrayIndex = '';
    dataSource: Agency[];
    cntrForm: FormGroup;
    dsCntrType: Inventory[];
    dsPortList: Agency[];
    dsModule: Inventory[];
    dsPrincipal: Inventory[];
    CID = null;
    PID = null;
    marked = false;
    IsCheckBox = false;
    IsCheckBoxDr = false;
    public showpickup: boolean = false;
    public showdropoff: boolean = false;
    constructor(private router: Router, private route: ActivatedRoute, private IS: InventoryService, private as: AgencyService, private service: OrgService, private ms: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.cntrForm = this.fb.group({
                ID: params['id'],

            });
        });
    }

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
        this.createForm();
        this.onInitalBinding();
        $('#ddlSize').on('select2:select', (e, args) => {
            this.SizeChanged($("#ddlSize").val());
        });
        if ($("#Checkbx").is(':checked')) {
            alert('test');
            $('.my-select').select2();
        }
    }
    SizeChanged(typeval) {

        this.cntrForm.value.TypeID = typeval;
        this.cntrForm.value.IsPickUp = 0;
        this.cntrForm.value.IsDropOff = 0;
        this.IS.getISOCODE(this.cntrForm.value).subscribe(data => {
            $('#txtISCCode').val(data[0].ISOCode);
        });

    }
    onInitalBinding() {

        this.OnBindDropdownCntrType();
        this.OnBindDropdownModule();
        this.OnBindPrincipalBind();
        this.OnBindDropdownPorts();
    }
    OnBindDropdownCntrType() {
        this.IS.CntrTypeDropdown(this.cntrForm.value).subscribe(data => {
            this.dsCntrType = data;
        });
    }
    OnBindDropdownModule() {
        this.IS.ModuleDropdown(this.cntrForm.value).subscribe(data => {
            this.dsModule = data;
        });
    }
    OnBindDropdownPorts() {
        this.as.PortMasterBind(this.cntrForm.value).subscribe(data => {
            this.dsPortList = data;
        });
    }
    OnBindPrincipalBind() {
        this.IS.PrincipalMasterBind(this.cntrForm.value).subscribe(data => {
            this.dsPrincipal = data;
        });
    }

    PickUpChange(e) {

        this.marked = e.target.checked;

        if (this.marked == true) {

            this.showpickup = !this.showpickup;
        }
        else {
            this.showpickup = false;
        }
    }

    existPickUpChange(ispickup) {

        if (ispickup == 1) {

            this.showpickup = !this.showpickup;
        }
        else {
            this.showpickup = false;
        }
    }

    DropOffChange(e) {

        this.marked = e.target.checked;

        if (this.marked == true) {

            this.showdropoff = !this.showdropoff;
        }
        else {
            this.showdropoff = false;
        }
    }

    existDropOffChange(isdropoff) {


        if (isdropoff == 1) {

            this.showdropoff = !this.showdropoff;
        }
        else {
            this.showdropoff = false;
        }
    }

    createForm() {

        if (this.cntrForm.value.ID != null) {

            this.IS.getContainerEdit(this.cntrForm.value).pipe(
            ).subscribe(data => {
                this.cntrForm.patchValue(data[0]);
                $('#ddlSize').select2().val(data[0].TypeID);
                $('#ddlModule').select2().val(data[0].ModuleID);
                $('#ddlLine').select2().val(data[0].LineID);
                $('#ddlStatus').select2().val(data[0].StatusID);
                this.existPickUpChange(data[0].IsPickUp);
                this.DropOffChange(data[0].IsDropOff);
                //$('#ddlPkUpLoc').val(data[0].PickUpLocID);
                // $('#ddlDropOffLoc').select2().val(data[0].DropOffLocID);

            });

            this.cntrForm = this.fb.group({
                ID: 0,
                CntrNo: '',
                TypeID: 0,
                ISOCode: '',
                ModuleID: 0,
                LineID: 0,
                StatusID: 0,
                Remarks: '',
                IsPickUp: 0,
                PickUpLocID: 0,
                PickUpDate: '',
                PickUpRef: '',
                IsDropOff: 0,
                DropOffLoc: 0,
                DropOffDate: '',
                DropoffRef: '',
            });
        }
        else {
            this.cntrForm = this.fb.group({
                ID: 0,
                CntrNo: '',
                TypeID: 0,
                ISOCode: '',
                ModuleID: 0,
                LineID: 0,
                StatusID: 1,
                Remarks: '',
                IsPickUp: 0,
                PickUpLocID: 0,
                PickUpDate: '',
                PickUpRef: '',
                IsDropOff: 0,
                DropOffLocID: 0,
                DropOffDate: '',
                DropoffRef: '',

            });
            $('#ddlStatus').select2().val(0);
        }


    }


    OnSubmit() {

        var validation = "";

        if (this.cntrForm.value.CntrNo == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Container No</span></br>"
        }
        var CntrNo = "0";
        CntrNo = this.cntrForm.value.CntrNo.length;

        if (CntrNo != "11") {
            validation += "<span style='color:red;'>*</span> <span> Container No Must be in 11 Characters</span></br>"
        }
        if (this.cntrForm.value.CntrNo == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Container No</span></br>"
        }
        if ($("#ddlSize").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Container Type</span></br>"
        }
        if ($("#ddlModule").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please  Select Module Type</span></br>"
        }
        if ($("#ddlLine").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Owning Line</span></br>"
        }
        if (this.cntrForm.value.IsPickUp == false) {
            validation += "<span style='color:red;'>*</span> <span>Please Flag Pick Up</span></br>"
        }


        if (this.cntrForm.value.IsPickUp == true) {
            if ($("#ddlPkUpLoc").val == null) {
                validation += "<span style='color:red;'>*</span> <span>Please Select Pick Up Location</span></br>"
            }
            if (this.cntrForm.value.PickUpDate == "") {
                validation += "<span style='color:red;'>*</span> <span>Please Enter Pick Up Date</span></br>"
            }
            if (this.cntrForm.value.PickUpRef == "") {
                validation += "<span style='color:red;'>*</span> <span>Please Enter Pick Up Ref#</span></br>"
            }
        }

        if (this.cntrForm.value.IsDropOff == true) {
            if ($("#ddlDropOffLoc").val == null) {
                validation += "<span style='color:red;'>*</span> <span>Please Select Drop Off Location</span></br>"
            }
            if (this.cntrForm.value.DropOffDate == "") {
                validation += "<span style='color:red;'>*</span> <span>Please Enter Drop Off Date</span></br>"
            }
            if (this.cntrForm.value.DropoffRef == "") {
                validation += "<span style='color:red;'>*</span> <span>Please Enter Drop Off Ref#</span></br>"
            }
        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }



        this.cntrForm.value.TypeID = $('#ddlSize').val();
        this.cntrForm.value.ModuleID = $('#ddlModule').val();
        this.cntrForm.value.LineID = $('#ddlLine').val();
        this.cntrForm.value.StatusID = $('#ddlStatus').val();
        this.cntrForm.value.DropOffLocID = $('#ddlDropOffLoc').val();
        this.cntrForm.value.PickUpLocID = $('#ddlPkUpLoc').val();
        this.cntrForm.value.ISOCode = $('#txtISCCode').val();

        if ($('#ddlDropOffLoc').val() == null) {
            this.cntrForm.value.ddlDropOffLoc = 0
        }
        else {
            this.cntrForm.value.ddlDropOffLoc = $('#ddlDropOffLoc').val();
        }

        if (this.cntrForm.value.IsPickUp == true) {
            this.cntrForm.value.IsPickUp = 1;
        }
        else {

            this.cntrForm.value.IsPickUp = 0;
        }
        if (this.cntrForm.value.IsDropOff == true) {
            this.cntrForm.value.IsDropOff = 1;
        }
        else {
            this.cntrForm.value.IsDropOff = 0;
        }

        this.IS.CntrSave(this.cntrForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
            setTimeout(() => {
                this.router.navigate(['/views/masters/LAmaster/containermaster/containermasterview']);
            }, 2000);  //5s
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }




}
interface Status {
    value: string;
    viewValue: string;
}