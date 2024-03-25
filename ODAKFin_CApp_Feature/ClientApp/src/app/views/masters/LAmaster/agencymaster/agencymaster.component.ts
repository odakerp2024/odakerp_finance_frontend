import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Region, Office, State, Org, DynamicGrid, SalesOffice, SalesOfficeDD } from '../../../../model/org';
import { City} from '../../../../model/common';
import { map, take, tap, startWith } from 'rxjs/operators';
import { MastersService } from '../../../../services/masters.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { PartyService } from '../../../../services/party.service';
import { AgencyService } from '../../../../services/agency.service';
import { Agency, DynamicGridAgency, DynamicGridPorts } from '../../../../model/Agency';
import { Country } from 'src/app/model/Organzation';
declare let $: any;
@Component({
    selector: 'app-agencymaster',
    templateUrl: './agencymaster.component.html',
    styleUrls: ['./agencymaster.component.css']
})
export class AgencymasterComponent implements OnInit {
    DynamicGrid: Array<DynamicGridAgency> = [];
    DynamicGridPorts: Array<DynamicGridPorts> = [];
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    val: any = {};
    HDArrayIndex = '';
    dataSource: Agency[];
    agencyForm: FormGroup;
    dscountryItem: Country[];
    dsCityItem: City[];
    dsStateItem: State[];
    dsPortList: Agency[];
    dsPrList: Agency[];
    CID = null;
    PID = null;
    constructor(private router: Router, private route: ActivatedRoute, private as: AgencyService, private service: OrgService, private ms: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.agencyForm = this.fb.group({
                ID: params['id'],

            });
        });
    }
    onPageTab = function (val) {

        if (val == "2" || val == "3") {
            if (this.agencyForm.value.ID == "0") {
                Swal.fire("Please Save Agency Details First")
                $('#pricipaltab').addClass('active');
                $('#portdtls').addClass('active');

            }
        }
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
        $('#ddlCountryv').on('select2:select', (e, args) => {
            this.CountryChanged($("#ddlCountryv").val());
        });
    }
    onInitalBinding() {

        this.OnBindDropdownCountry();
        this.OnBindDropdownPorts();
        this.OnBindDropdownPrincipalList();
    }
    OnBindDropdownCountry() {
        this.ms.getCountryBind().subscribe(data => {
            this.dscountryItem = data;
        });
    }
    OnBindDropdownPorts() {
        this.as.PortMasterBind(this.agencyForm.value).subscribe(data => {
            this.dsPortList = data;
        });
    }
    OnBindDropdownPrincipalList() {
        this.as.PrincipalMasterBind(this.agencyForm.value).subscribe(data => {
            this.dsPrList = data;
        });
    }
    CountryChanged(countryval) {
        this.agencyForm.value.CountryID = countryval;
        this.service.getCitiesBindByCountry(this.agencyForm.value).subscribe(data => {
            this.dsCityItem = data;
        });
        this.service.getStatesBindByCtry(this.agencyForm.value).subscribe(data => {
            this.dsStateItem = data;

        });
    }

    createForm() {

        if (this.agencyForm.value.ID != null) {

            this.as.getAgencyEdit(this.agencyForm.value).pipe(
            ).subscribe(data => {
                this.agencyForm.patchValue(data[0]);
                this.CountryChanged(data[0].CountryID);
                $('#ddlCountryv').select2().val(data[0].CountryID);
                $('#ddlState').select2().val(data[0].StateID);
                $('#ddlCity').select2().val(data[0].CityID);
                $('#ddlStatus').select2().val(data[0].Status);

            });
            this.as.getAgencyPortEdit(this.agencyForm.value).pipe(tap(data1 => {
                this.DynamicGridPorts.splice(0, 1);

                for (let item of data1) {

                    this.DynamicGridPorts.push({

                        'CID': item.CID,
                        'PortID': item.PortID,
                        'PortName': item.PortName,
                    });

                }
            }
            )).subscribe();

            this.as.getAgencyPrincipalBindEdit(this.agencyForm.value).pipe(tap(data1 => {
                this.DynamicGrid.splice(0, 1);

                for (let item of data1) {

                    this.DynamicGrid.push({

                        'PID': item.PID,
                        'PrincipalID': item.PrincipalID,
                        'PrincipalName': item.PrincipalName,
                    });

                }
            }
            )).subscribe();
            this.agencyForm = this.fb.group({
                ID: 0,
                AgencyName: '',
                AgencyCode: '',
                CountryID: 0,
                CityID: 0,
                StateID: 0,
                PinCode: '',
                TaxGSTNo: '',
                TelNo: '',
                EmailDetail: '',
                Address: '',
                Notes: '',
                Status: 0,
                CID: 0,
                PID: 0
            });
        }
        else {
            this.agencyForm = this.fb.group({
                ID: 0,
                AgencyName: '',
                AgencyCode: '',
                CountryID: 0,
                CityID: 0,
                StateID: 0,
                PinCode: '',
                TaxGSTNo: '',
                TelNo: '',
                EmailDetail: '',
                Address: '',
                Notes: '',
                Status: 1,
                CID: 0,
                PID: 0
            });
            $('#ddlStatus').select2().val(0);
        }


    }
    AddPrLink() {
        var validation = "";

        var ddlPrincipal = $('#ddlPrincipal').val();
        if (ddlPrincipal == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Principal Name</span></br>"
        }
        for (var i = 0; i < this.DynamicGrid.length; i++) {
           
                if (this.DynamicGrid[i].PrincipalID == $('#ddlPrincipal').val()) {

                    validation += "<span style='color:red;'>*</span> <span>Principal Name Already Exists </span></br>"
                }

        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }


        var PIDValue;
        PIDValue = (this.PID == null) ? 0 : this.PID;
        this.val = {
            PID: PIDValue,
            PrincipalID: $("#ddlPrincipal").val(),
            PrincipalName: $("#ddlPrincipal option:selected").text(),
        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGrid[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGrid.push(this.val);
        }

        $("#ddlPrincipal").select2().val(0, "").trigger("change");
        this.HDArrayIndex = "";

    }

    AddPort() {
        var validation = "";

        var ddlPort = $('#ddlPort').val();
        if (ddlPort == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Port</span></br>"
        }
        for (var i = 0; i < this.DynamicGridPorts.length; i++) {
           
                if (this.DynamicGridPorts[i].PortID == $('#ddlPort').val()) {

                    validation += "<span style='color:red;'>*</span> <span>Port Already Exists </span></br>"
                }
            
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        var CIDValue;
        CIDValue = (this.CID == null) ? 0 : this.CID;

        this.val = {

            CID: CIDValue,
            PortID: $("#ddlPort").val(),
            PortName: $("#ddlPort option:selected").text(),
        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGridPorts[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGridPorts.push(this.val);
        }

        $("#ddlPort").select2().val(0, "").trigger("change");
        this.HDArrayIndex = "";

    }


    RemovePrValues(DynamicGrid, index, PID) {
  
        this.agencyForm.value.PID = PID;
        this.DynamicGrid.splice(index, 1);
        this.as.RemoveprDtls(this.agencyForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }
    RemovePortValues(DynamicGridPorts, index, CID) {
        this.agencyForm.value.CID = CID;
        this.DynamicGridPorts.splice(index, 1);
        this.as.RemoveAgencyPortDtls(this.agencyForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }
    onSubmit() {

        var validation = "";

        if (this.agencyForm.value.OrgName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Organization Name</span></br>"
        }
        if ($('#ddlCountryv').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Country</span></br>"
        }
        if ($('#ddlCity').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select City</span></br>"
        }
        if (this.agencyForm.value.PinCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Pincode</span></br>"
        }
        if (this.agencyForm.value.Address == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Address</span></br>"
        }
        if (this.agencyForm.value.EmailDetail == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Email ID</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        }


        this.agencyForm.value.Status = $('#ddlStatus').val();
        this.agencyForm.value.CityID = $('#ddlCity').val();
        this.agencyForm.value.CountryID = $('#ddlCountryv').val();
        this.agencyForm.value.StateID = $('#ddlState').val();

        this.as.saveAgency(this.agencyForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
            setTimeout(() => {
                this.router.navigate(['/views/masters/LAmaster/agencymaster/agencymasterview']);
            }, 2000);  //5s
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });


    }

    OnSubmitPr() {
        var validation = "";

        if (this.DynamicGrid.length == 0) {

            validation += "<span style='color:red;'>*</span> <span>Please Add Principal Name </span></br>"
        }


        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        var ItemsPr = [];
        for (let item of this.DynamicGrid) {

            ItemsPr.push('Insert:' + item.PID, item.PrincipalID, item.PrincipalName);

        };
        this.agencyForm.value.Itemsv1 = ItemsPr.toString();

        this.as.PrincipalDetailsSave(this.agencyForm.value).subscribe(cty => { Swal.fire("Record Saved Successfully") });
    }



    OnSubmitPort() {
        var validation = "";

        if (this.DynamicGridPorts.length == 0) {

            validation += "<span style='color:red;'>*</span> <span>Please Add Port Details </span></br>"
        }


        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        var ItemsPorts = [];
        for (let item of this.DynamicGridPorts) {

            ItemsPorts.push('Insert:' + item.CID, item.PortID, item.PortName);

        };
        this.agencyForm.value.Itemsv1 = ItemsPorts.toString();

        this.as.PortDetailsSave(this.agencyForm.value).subscribe(cty => { Swal.fire("Record Saved Successfully") });
    }

}
interface Status {
    value: string;
    viewValue: string;
}