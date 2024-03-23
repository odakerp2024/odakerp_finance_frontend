import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { ServiceSetup, Port, DynamicGridService, SlotOperator, DynamicGridOperator } from '../../../../model/common';
import { SalesOffice } from '../../../../model/org';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-servicesetup',
  templateUrl: './servicesetup.component.html',
  styleUrls: ['./servicesetup.component.css']
})
export class ServicesetupComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    val: any = {};
    myControl = new FormControl('');
    ServiceForm: FormGroup;
    dataSource: ServiceSetup[];
    ddGeoLocationItem: SalesOffice[];
    ddPortItem: Port[];
    ddlOperatorItem: SlotOperator[];
    ddlSlotItem: SlotOperator[];
    dynamicArray: Array<DynamicGridService> = [];
    dynamicOperatorArray: Array<DynamicGridOperator> = [];
    newDynamic: any = {};
    newDynamicOperator: any = {};
    OID = null;
    HDArrayIndex = '';
    TIDValue = '';
    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.ServiceForm = this.fb.group({
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
        this.newDynamic = { ID: 0, PortID: 0, HH: '', MM: '0' };
        
        this.dynamicArray.push(this.newDynamic);
        
        this.createForm();
        this.onInitalBinding();
    }
    onInitalBinding() {
        this.OnBindDropdownGeoLocation();
        this.OnBindDropdownPort();
        this.OnBindDropdownOperator();
    }
    OnBindDropdownGeoLocation() {
        this.service.getGeoLocBind(this.ServiceForm.value).subscribe(data => {
            this.ddGeoLocationItem = data;
        });
    }
    OnBindDropdownPort() {
        this.service.getPortBind().subscribe(data => {
            this.ddPortItem = data;
        });
    }
    OnBindDropdownOperator() {
        this.service.getOperatorBind(this.ServiceForm.value).subscribe(data => {
            this.ddlOperatorItem = data;
        });
    }
    OnClickAddValue() {
        var validation = "";
        var ddlOperator = $('#ddlOperator').val();
        if (ddlOperator == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Operator</span></br>"
        }

        var ddlSlotRef = $('#ddlSlotRef').val();
        if (ddlSlotRef == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Slot Reference</span></br>"
        }

        for (var i = 0; i < this.dynamicOperatorArray.length; i++) {

            if (this.dynamicOperatorArray[i].OperatorID == $('#ddlOperator').val() && this.dynamicOperatorArray[i].SlotRefID == $('#ddlSlotRef').val()) {

                validation += "<span style='color:red;'>*</span> <span>Operator/Slot Ref Already Exists </span></br>"
            }

        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }


        var TIDValue;
        TIDValue = (this.OID == null) ? 0 : this.OID;
        this.val = {
            OID: TIDValue,
            OperatorID: $("#ddlOperator").val(),
            Operator: $("#ddlOperator option:selected").text(),
            SlotRefID: $("#ddlSlotRef").val(),
            SlotRef: $("#ddlSlotRef option:selected").text(),
        };

        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.dynamicOperatorArray[this.HDArrayIndex] = this.val;
        } else {
            this.dynamicOperatorArray.push(this.val);
        }
        $("#ddlOperator").val(0, "").trigger("change");
        $("#ddlSlotRef").select2().val(0, "").trigger("change");    
        this.OID = 0;
        this.HDArrayIndex = '';
    }

    OnclickOpeartorSelectvalues(dynamicOperatorArray, index) {
        //alert(TID);
        //this.ServiceForm.value.OID = TID;
        alert(index);
        this.HDArrayIndex = index;
        this.OID = this.dynamicOperatorArray[index].OID;
        $("#ddlOperator").select2().val(this.dynamicOperatorArray[index].OperatorID).trigger("change");
        $("#ddlSlotRef").select2().val(this.dynamicOperatorArray[index].SlotRefID).trigger("change");
    }
    OnclickOperatorRemove(dynamicOperatorArray, index, OPID) {
        alert(OPID);
        this.dynamicOperatorArray.splice(index, 1);
        this.ServiceForm.value.OID = OPID;
        this.service.getServiceOperatorDelete(this.ServiceForm.value).subscribe((data) => {

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    createForm() {
        if (this.ServiceForm.value.ID != null) {

            this.service.getServiceSetupedit(this.ServiceForm.value).pipe(
            ).subscribe(data => {

                this.ServiceForm.patchValue(data[0]);
                $('#ddlStatusv').select2().val(data[0].StatusID);
                $('#ddlGeoLocationv').select2().val(data[0].GeoLocID);
                $('#ddlDtEffective').val(data[0].DtEffective);
            });
            this.service.getServiceSetupRoutedit(this.ServiceForm.value).pipe(tap(data1 => {
                this.dynamicArray.splice(0, 1);
                for (let i = 0; i < data1.length; i++) {
                    this.dynamicArray.push({
                        'ID': data1[i].RID,
                        'PortID': data1[i].PortID,
                        'HH': data1[i].TTHH,
                        'MM': data1[i].TTMM,
                    });
                }
            }
            )).subscribe();
                 this.service.getServiceOperatoredit(this.ServiceForm.value).pipe(tap(data2 => {
                     this.dynamicOperatorArray.splice(0, 1);
                     for (let i = 0; i < data2.length; i++) {
                         this.dynamicOperatorArray.push({
                             'OID': data2[i].OID,
                             'OperatorID': data2[i].OperatorID,
                             'Operator': data2[i].Operator,
                             'SlotRefID': data2[i].SlotRefID,
                             'SlotRef': data2[i].SlotRef,
                         });
                     }
                 }

                 )).subscribe();                     
            this.ServiceForm = this.fb.group({
                ID: 0,
                ServiceName: '',
                DtEffective: '',
                UserID: 0,
                OffLocID: 0,
                StatusID: 0,
                PortID: 0,
                RID:0
            });
        }
        else {
            this.ServiceForm = this.fb.group({
                ID: 0,
                ServiceName: '',
                DtEffective: '',
                UserID: 0,
                OffLocID: 0,
                StatusID: 1,
                PortID: 0,
                RID: 0
            });
        }
    }
    addRow(index) {
        this.newDynamic = {
            PortID: $("#ddlPortv").val(),
            HH: '',
            MM: ''
        };
        /*this.ServiceForm.value.PortID = $('#ddlPortv').val();*/
        this.ServiceForm.value.PortID = $('#ddlPortv').val(this.dynamicArray);
        this.dynamicArray.push(this.newDynamic);
        console.log(this.dynamicArray);
        return true;
    }

    deleteRow(dynamicArray, index, CID) {
        alert(CID);
        if (this.dynamicArray.length == 1) {
            Swal.fire("Can't delete the row when there is only one row", 'Warning')
            return false;
        } else {
            this.dynamicArray.splice(index, 1);
            this.ServiceForm.value.RID = CID;
            this.service.getServiceRouteDelete(this.ServiceForm.value).subscribe(Data => {
                Swal.fire("Deleted Successfully", 'Warning')
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
            return true;
        }
    }
    onSubmit() {
        var validation = "";

        if (this.ServiceForm.value.ServiceName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Service Name</span></br>"
        }
        if ($('#ddlGeoLocationv').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Office Location</span></br>"
        }
        if (this.ServiceForm.value.DtEffective == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Date Effective From</span></br>"
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        var ItemsSchedule = [];

        for (let item of this.dynamicArray) {

            var intDID = item.ID;
            if (typeof item.ID == "undefined") {
                intDID = 0;
            }
            ItemsSchedule.push('Insert:' + intDID, item.PortID, item.HH, 0
            );
        }
        this.ServiceForm.value.ItemsRoute = ItemsSchedule.toString();

        var ItemsOperator = [];

        for (let item of this.dynamicOperatorArray) {

            var intOID = item.OID;
            if (typeof item.OID == "undefined") {
                intOID = 0;
            }
            ItemsOperator.push('Insert:' + intOID, item.OperatorID, item.Operator, item.SlotRefID, item.SlotRef
            );
        }
        this.ServiceForm.value.ItemsOpr = ItemsOperator.toString();


            this.ServiceForm.value.StatusID = $('#ddlStatusv').val();
            this.ServiceForm.value.OffLocID = $('#ddlGeoLocationv').val();
            this.ServiceForm.value.DtEffective = $('#ddlDtEffective').val();
            this.ServiceForm.value.OperatorID = $('#ddlOperatorID').val();
            this.ServiceForm.value.SlotRefID = $('#ddlSlotRefID').val();
            

            this.service.saveServiceSetup(this.ServiceForm.value).subscribe(data => {
                this.ServiceForm.value.ID = data[0].ID;
                Swal.fire(data[0].AlertMessage)
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