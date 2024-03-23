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
import { Inventory, DynamicGridStatus } from '../../../../model/Inventory';
import { InventoryService } from '../../../../services/inventory.service';
declare let $: any;
@Component({
    selector: 'app-inventorymove',
    templateUrl: './inventorymove.component.html',
    styleUrls: ['./inventorymove.component.css']
})
export class InventorymoveComponent implements OnInit {

    DynamicGrid: Array<DynamicGridStatus> = [];

    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    val: any = {};
    HDArrayIndex = '';
    dataSource: Agency[];
    codeForm: FormGroup;

    dsPortList: Agency[];
    dsValid: Inventory[];
    dsStatuscode: Inventory[];
    CID = null;
    SID = null;
    marked = false;
    IsCheckBox = false;
    IsCheckBoxDr = false;
    public showpickup: boolean = false;
    public showdropoff: boolean = false;
    constructor(private router: Router, private route: ActivatedRoute, private IS: InventoryService, private as: AgencyService, private service: OrgService, private ms: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.codeForm = this.fb.group({
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

        $('#ddlToStatus').on('select2:select', (e, args) => {
            this.ChangeDescription($("#ddlToStatus").val())
        });
    }
    SizeChanged(typeval) {

        this.codeForm.value.TypeID = typeval;
        this.codeForm.value.IsPickUp = 0;
        this.codeForm.value.IsDropOff = 0;
        this.IS.getISOCODE(this.codeForm.value).subscribe(data => {
            $('#txtISCCode').val(data[0].ISOCode);
        });

    }
    ChangeDescription(statusval) {

        this.codeForm.value.StatusCodeID = statusval;
        this.codeForm.value.IsPickUp = 0;
        this.codeForm.value.IsDropOff = 0;
        this.IS.InvStatuscodesDesc(this.codeForm.value).subscribe(data => {
            $('#txtStatusDescV').val(data[0].StatusDescription);
        });

    }

    onInitalBinding() {

        this.OnBindDropdownValidtion();
        this.OnBindDropdownStatusCodes();
    }
    OnBindDropdownValidtion() {
        this.IS.InvValidationDropdown(this.codeForm.value).subscribe(data => {
            this.dsValid = data;
        });
    }
    OnBindDropdownStatusCodes() {
        this.IS.InvStatuscodesDropdown(this.codeForm.value).subscribe(data => {
            this.dsStatuscode = data;
        });
    }

    createForm() {

        if (this.codeForm.value.ID != null) {

            this.IS.getInvMoveEdit(this.codeForm.value).pipe(
            ).subscribe(data => {
                this.codeForm.patchValue(data[0]);
                $('#ddlVesVoy').select2().val(data[0].ValidVslVoy);
                $('#ddlTM').select2().val(data[0].ValidTransMode);
                $('#ddlLoc').select2().val(data[0].ValidNextLoc);
                $('#ddlDepot').select2().val(data[0].ValidDepot);
                $('#ddlStatus').select2().val(data[0].StatusID)
                $('#ddlBL').select2().val(data[0].ValidBL);
                $('#ddlCustomer').select2().val(data[0].ValidCustomer);
                $('#ddlTerminal').select2().val(data[0].ValidTerminal);
            });
            this.IS.getInvMovePossibleEdit(this.codeForm.value).pipe(tap(data1 => {
                this.DynamicGrid.splice(0, 1);

                for (let item of data1) {

                    this.DynamicGrid.push({

                        'SID': item.SID,
                        'ToStatusID': item.ToStatusID,
                        'ToStatus': item.ToStatus,
                       // 'ToStatusDescription': item.ToStatusDescription,
                    });

                }
            }
            )).subscribe();
            this.codeForm = this.fb.group({
                ID: 0,
                Status: '',
                StatusDescription: '',
                ValidVslVoy: 0,
                ValidNextLoc: 0,
                ValidTransMode: 0,
                ValidBL: 0,
                ValidDepot: 0,
                ValidCustomer: 0,
                ValidTerminal: 0,
                StatusID: 0,
                StatusCodeID: 0,
            });
        }
        else {
            this.codeForm = this.fb.group({
                ID: 0,
                Status: '',
                StatusDescription: '',
                ValidVslVoy: 0,
                ValidNextLoc: 0,
                ValidTransMode: 0,
                ValidBL: 0,
                ValidDepot: 0,
                ValidCustomer: 0,
                ValidTerminal: 0,
                StatusID: 1,
                StatusCodeID: 0,
            });
            $('#ddlStatus').select2().val(0);
        }


    }


    Add() {
        var validation = "";

        var ddlToStatus = $('#ddlToStatus').val();
        if (ddlToStatus == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Statuscode</span></br>"
        }
        for (var i = 0; i < this.DynamicGrid.length; i++) {

            if (this.DynamicGrid[i].ToStatusID == $('#ddlToStatus').val()) {

                validation += "<span style='color:red;'>*</span> <span>StatusCode Already Exists </span></br>"
            }

        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }


        var SIDValue;
        SIDValue = (this.SID == null) ? 0 : this.SID;
        this.val = {
            SID: SIDValue,
            ToStatusID: $("#ddlToStatus").val(),
            ToStatus: $("#ddlToStatus option:selected").text(),
            //ToStatusDescription: $("#txtStatusDescV").val(),
        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGrid[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGrid.push(this.val);
        }

        $("#ddlToStatus").select2().val(0, "").trigger("change");
       // $("#txtStatusDescV").val("");
        this.HDArrayIndex = "";

    }

    Selectvalues(DynamicGrid, index) {

        this.HDArrayIndex = index;
        $("#ddlToStatus").val(this.DynamicGrid[index].ToStatusID).trigger("change");
       // $("#txtStatusDescV").val(this.DynamicGrid[index].ToStatusDescription);

    }

    RemoveValues(DynamicGrid, index, SID) {

        this.codeForm.value.SID = SID;
        this.DynamicGrid.splice(index, 1);
        this.IS.possiblemovesDelete(this.codeForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }
    Recordsave() {

        var validation = "";

        if (this.codeForm.value.Status == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Short Code</span></br>"
        }

        if (this.codeForm.value.StatusDescription == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter StatusCode Description</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        }

        this.codeForm.value.ValidVslVoy = 0
        this.codeForm.value.ValidNextLoc = 0
        this.codeForm.value.ValidTerminal = 0
        this.codeForm.value.ValidTransMode = 0
        this.codeForm.value.ValidDepot = 0
        
        if ($('#ddlBL').val() == null) {
            this.codeForm.value.ValidBL = 0
        }
        else {
            this.codeForm.value.ValidBL = $('#ddlBL').val();
        }

        if ($('#ddlCustomer').val() == null) {
            this.codeForm.value.ValidCustomer = 0
        }
        else {
            this.codeForm.value.ValidCustomer = $('#ddlCustomer').val();
        }
        this.codeForm.value.StatusID = $('#ddlStatus').val();
        var ItemsST = [];
        for (let item of this.DynamicGrid) {

            ItemsST.push('Insert:' + item.SID, item.ToStatusID, item.ToStatus);

        };
        this.codeForm.value.Itemsv = ItemsST.toString();
        this.IS.StatusCodeSave(this.codeForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
            setTimeout(() => {
                this.router.navigate(['/views/masters/LAmaster/inventorymove/inventorymoveview']);
            }, 1500);  //5s
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