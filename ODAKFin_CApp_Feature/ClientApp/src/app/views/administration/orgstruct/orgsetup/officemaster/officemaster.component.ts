import { Component, Inject, OnInit, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Region, Office, State } from '../../../../../model/org';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { City } from '../../../../../model/common';
import { map, take, tap, startWith } from 'rxjs/operators';
import { MastersService } from '../../../../../services/masters.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Country } from 'src/app/model/Organzation';
declare let $: any;

@Component({
    selector: 'app-officemaster',
    templateUrl: './officemaster.component.html',
    styleUrls: ['./officemaster.component.css']
})
export class OfficemasterComponent implements OnInit {

    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    myControl = new FormControl('');
    officeForm: FormGroup;
    dataSource: Office[];
    dscountryItem: Country[];
    dsCityItem: City[];
    dsStateItem: State[];
    filteredOptions: Observable<string[]>;
    constructor(private router: Router, private route: ActivatedRoute, private service: OrgService, private ms: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.officeForm = this.fb.group({
                ID: params['id'],

            });
        });
    }

    ngOnInit() {
        $('.my-select').select2();
        this.createForm();
        this.onInitalBinding();
        $('#ddlCountry').on('select2:select', (e, args) => {
            this.CountryChanged($("#ddlCountry").val());
        });
    }
    onInitalBinding() {
        this.OnBindDropdownCountry();
    }


    CountryChanged(countryval) {
        this.officeForm.value.CountryID = countryval;
        this.service.getCitiesBindByCountry(this.officeForm.value).subscribe(data => {
            this.dsCityItem = data;
        });
        this.service.getStatesBindByCtry(this.officeForm.value).subscribe(data => {
            this.dsStateItem = data;

        });
    }
    OnBindDropdownCountry() {
        this.ms.getCountryBind().subscribe(data => {
            this.dscountryItem = data;
        });
    }


    createForm() {


        if (this.officeForm.value.ID != null) {
            this.service.getOfficeEdit(this.officeForm.value).pipe(
            ).subscribe(data => {
                this.officeForm.patchValue(data[0]);
                this.CountryChanged(data[0].CountryID);
                $('#ddlCountry').select2().val(data[0].CountryID);
                $('#ddlState').select2().val(data[0].StateID);
                $('#ddlCityv').select2().val(data[0].CityID);
                $('#ddlstatus').select2().val(data[0].StatusID);

            });


            this.officeForm = this.fb.group({
                ID: 0,
                OfficeLoc: '',
                CompanyName: '',
                CountryID: 0,
                CityID: 0,
                StateID: 0,
                Pincode: '',
                TaxGSTNo: '',
                TelNo: '',
                FaxNo: '',
                Address: '',
                StatusID: 0,
            });
        }
        else {
            this.officeForm = this.fb.group({
                ID: 0,
                OfficeLoc: '',
                CompanyName: '',
                CountryID: 0,
                CityID: 0,
                StateID: 0,
                Pincode: '',
                TaxGSTNo: '',
                TelNo: '',
                FaxNo: '',
                Address: '',
                StatusID: 1,
            });
            $('#ddlstatus').select2().val(0);
        }

    }


    onSubmit() {

        var validation = "";

        if (this.officeForm.value.OfficeLoc == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Office Location</span></br>"
        }
        if (this.officeForm.value.CompanyName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Company Name</span></br>"
        }
        if ($('#ddlCountry').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Country</span></br>"
        }
        if ($('#ddlState').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select State</span></br>"
        }
        if ($('#ddlCityv').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select City</span></br>"
        }
        if (this.officeForm.value.Pincode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Pincode</span></br>"
        }
        if (this.officeForm.value.TelNo == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Tel No</span></br>"
        }
        if (this.officeForm.value.Address == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Address</span></br>"
        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        this.officeForm.value.StatusID = $('#ddlstatus').val();
        this.officeForm.value.CityID = $('#ddlCityv').val();
        this.officeForm.value.CountryID = $('#ddlCountry').val();
        this.officeForm.value.StateID = $('#ddlState').val();
        this.service.saveOffice(this.officeForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    onBack() {
        if (this.officeForm.value.ID == 0) {
            var validation = "";
            if (this.officeForm.value.OfficeLoc != "" || this.officeForm.value.CompanyName != "" || $('#ddlCountry').val() != null || $('#ddlState').val() != null || $('#ddlCityv').val() != null || this.officeForm.value.Pincode != "" || this.officeForm.value.TelNo != "" || this.officeForm.value.Address != "") {
                validation += "<span style='color:red;'>*</span> <span>Do you want save changes?</span></br>"
            }
            if (validation != "") {
                Swal.fire({
                    title: 'Do you want to save the changes?',
                    showDenyButton: true,
                    confirmButtonText: 'YES',
                    denyButtonText: `NO`,
                }).then((result) => {
                    if (result.isConfirmed) {
                    } else {
                        this.router.navigate(['/views/administration/orgstruct/orgsetup/officemaster/officemasterview']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/administration/orgstruct/orgsetup/officemaster/officemasterview']);
            }
        }
        else {
            this.router.navigate(['/views/administration/orgstruct/orgsetup/officemaster/officemasterview']);
        }
    }
}
interface Status {
    value: string;
    viewValue: string;
}