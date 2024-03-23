import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Region, Office, State, Org, DynamicGrid, SalesOffice, SalesOfficeDD, DivisionTypes } from '../../../../../model/org';
import { City} from '../../../../../model/common';
import { map, take, tap, startWith } from 'rxjs/operators';
import { MastersService } from '../../../../../services/masters.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Country } from 'src/app/model/Organzation';
declare let $: any;

@Component({
    selector: 'app-orgmaster',
    templateUrl: './orgmaster.component.html',
    styleUrls: ['./orgmaster.component.css']
})
export class OrgmasterComponent implements OnInit {
    dynamicArray: Array<DynamicGrid> = [];
    newDynamic: any = {};
    private fieldArray: Array<any> = [{ code: "", name: "", price: "" }];
    private mydata: any = {};
    private newAttribute: any = {};
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    filteredDataToSearch: any[] = [];
    myControl = new FormControl('');
    orgForm: FormGroup;
    dataSource: Org[];
    dscountryItem: Country[];
    dsCityItem: City[];
    dsStateItem: State[];
    dsRegionItem: Region[];
    dsOffLocItem: Office[];
    dsSalesOffItem: SalesOffice[];
    ddSalesOffItem: SalesOfficeDD[]
    dsDivision: DivisionTypes[];
    filteredOptions: Observable<string[]>;
    constructor(private router: Router, private route: ActivatedRoute, private service: OrgService, private ms: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.orgForm = this.fb.group({
                ID: params['id'],

            });
        });
    }
    //  public orgForm: FormGroup = new FormGroup({
    //  slct_cntrl: new FormControl("")
    //});

    ngOnInit() {
        $('.my-select').select2();
        this.newDynamic = { ID: 0, RegionID: 0, SalesOffLocID: 0, OfficeLoc: '' };
        this.dynamicArray.push(this.newDynamic);
        this.createForm();
        this.onInitalBinding();
        $('#ddlCountry').on('select2:select', (e, args) => {
            this.CountryChanged($("#ddlCountry").val());
        });
    }
    onInitalBinding() {

        this.OnBindDropdownCountry();
        this.OnBindDropdownRegion();
        this.OnBindDropdownSalesOfficLoc();

    }
    OnBindDivisionTypes() {
        this.service.getDivisionTypes(this.orgForm.value).subscribe(data => {
            this.dsDivision = data;
        });
    }
    OnBindDropdowCity() {
        this.service.getCityBind(this.orgForm.value).subscribe(data => {
            this.dsCityItem = data;
        });
    }
    
    OnBindDropdownSalesOfficLoc() {
        this.service.getSalesLocBind(this.orgForm.value).subscribe(data => {
            this.dsSalesOffItem = data;
        });
    }
    OnBindDropdownCountry() {
        this.ms.getCountryBind().subscribe(data => {
            this.dscountryItem = data;
        });
    }
    SalesLocChanged(val, index) {

        this.orgForm.value.OfficeLocID = val;
        this.service.getOfficeLocBySalesOffice(this.orgForm.value).subscribe(data => {

            this.dynamicArray[index].OfficeLoc = data[0].OfficeLoc;


        });
    }


    CountryChanged(countryval) {
        this.orgForm.value.CountryID = countryval;
        this.service.getCitiesBindByCountry(this.orgForm.value).subscribe(data => {
            this.dsCityItem = data;
        });
        this.service.getStatesBindByCtry(this.orgForm.value).subscribe(data => {
            this.dsStateItem = data;

        });
    }


    OnBindDropdownRegion() {
        this.service.getRegionBindList(this.orgForm.value).subscribe(data => {
            this.dsRegionItem = data;
        });
    }

    createForm() {

        if (this.orgForm.value.ID != null) {

            this.service.getOrgEdit(this.orgForm.value).pipe(
            ).subscribe(data => {
                this.orgForm.patchValue(data[0]);
                this.CountryChanged(data[0].CountryID);
                $('#ddlCountry').select2().val(data[0].CountryID);
                $('#ddlState').select2().val(data[0].StateID);
                $('#ddlCity').select2().val(data[0].CityID);
                $('#ddlStatus').select2().val(data[0].StatusID);

            });
            this.service.OrgExistingDivisonTypes(this.orgForm.value).subscribe(data => { this.dsDivision = data; });
            this.service.getOrgDtlsEdit(this.orgForm.value).pipe(tap(data1 => {

                this.dynamicArray.splice(0, 1);
                for (let i = 0; i < data1.length; i++) {

                    this.SalesLocChanged(data1[i].SalesOffLocID, i);
                    this.dynamicArray.push({
                        'ID': data1[i].ID,
                        'RegionID': data1[i].RegionID,
                        'SalesOffLocID': data1[i].SalesOffLocID,
                        'OfficeLoc': data1[i].OfficeLoc,

                    });
                }
            }
            )).subscribe();
            this.orgForm = this.fb.group({
                ID: 0,
                OrgName: '',
                CountryID: 0,
                CityID: 0,
                StateID: 0,
                Pincode: '',
                TaxGSTNo: '',
                IsLiner: 0,
                IsFF: 0,
                Address: '',
                StatusID: 0,
                IsTransport: 0,
                DivisionDetails: '',
            });
        }
        else {
            this.orgForm = this.fb.group({
                ID: 0,
                OrgName: '',
                CountryID: 0,
                CityID: 0,
                StateID: 0,
                Pincode: '',
                TaxGSTNo: '',
                IsLiner: 0,
                IsFF: 0,
                Address: '',
                StatusID: 0,
                IsTransport: 0,
                DivisionDetails: '',
            });
            $('#ddlStatus').select2().val(0);
            this.OnBindDivisionTypes();
        }


    }


    OnSubmit() {

        var validation = "";

        if (this.orgForm.value.OrgName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Organization Name</span></br>"
        }
        if ($('#ddlCountry').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Country</span></br>"
        }
        if ($('#ddlState').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select State</span></br>"
        }
        if ($('#ddlCity').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select City</span></br>"
        }
        if (this.orgForm.value.Pincode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Pincode</span></br>"
        }
        if (this.orgForm.value.Address == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Address</span></br>"
        }

        //if (this.orgForm.value.IsLiner == false || this.orgForm.value.IsFF == false || this.orgForm.value.IsTransport == false) {
        //    validation += "<span style='color:red;'>*</span> <span>Please Check any one Divison</span></br>"
        //}
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        var Itemsc = [];
        for (var i = 0; i < this.dsDivision.length; i++) {

            if (this.dsDivision[i].IsTrue) {
                var Id = this.dsDivision[i].ID;
                Itemsc.push(Id);

            }

        }

        this.orgForm.value.DivisionDetails = Itemsc.toString();
        // console.log("test", Itemsc.toString())
        var ItemsSchedule = [];

        for (let item of this.dynamicArray) {

            var intDID = item.ID;
            if (typeof item.ID == "undefined") {
                intDID = 0;
            }
            ItemsSchedule.push('Insert:' + intDID, item.RegionID, item.SalesOffLocID, item.OfficeLoc
            );
        }
        this.orgForm.value.Itemsv = ItemsSchedule.toString();
        if (this.orgForm.value.IsLiner == true) {
            this.orgForm.value.IsLiner = 1;
        }
        else {

            this.orgForm.value.IsLiner = 0;
        }
        if (this.orgForm.value.IsFF == true) {
            this.orgForm.value.IsFF = 1;
        }
        else {
            this.orgForm.value.IsFF = 0;
        }
        if (this.orgForm.value.IsTransport == true) {
            this.orgForm.value.IsTransport = 1;
        }
        else {
            this.orgForm.value.IsTransport = 0;
        }


        this.orgForm.value.StatusID = $('#ddlStatus').val();
        this.orgForm.value.CityID = $('#ddlCity').val();
        this.orgForm.value.CountryID = $('#ddlCountry').val();
        this.orgForm.value.StateID = $('#ddlState').val();

        this.service.saveOrg(this.orgForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });


    }


    addRow(index) {
        this.newDynamic = { RegionID: 0, OfficeLocID: 0, SalesOffLocID: 0 };
        this.dynamicArray.push(this.newDynamic);
        // console.log(this.dynamicArray);
        return true;
    }

    deleteRow(dynamicArray, index, CID) {

        if (this.dynamicArray.length == 1) {
            Swal.fire("Can't delete the row when there is only one row", 'Warning')
            return false;
        } else {
            this.dynamicArray.splice(index, 1);
            this.orgForm.value.ID = CID;
            this.service.OrgOfficeDtlsDelete(this.orgForm.value).subscribe(Data => {
                Swal.fire(Data[0].AlertMessage)
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
            return true;
        }
    }



}
interface Status {
    value: string;
    viewValue: string;
}



