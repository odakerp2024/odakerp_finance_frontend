import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { City, State } from '../../../../model/common';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Country } from 'src/app/model/Organzation';
declare let $: any;

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];

    myControl = new FormControl('');
    cityForm: FormGroup;
    dscountryItem: Country[];
    dataSource: City[];
    dsStateItem: State[];
   
    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
          
            this.cityForm = this.fb.group({
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
        $('#ddlCountryv').on('select2:select', (e, args) => {
            this.CountryChanged($("#ddlCountryv").val());
        });
    }
    onInitalBinding() {

        this.OnBindDropdownCountry();
    }
    CountryChanged(countryval) {

        this.cityForm.value.CountryID = countryval;

        this.service.getStatesBindByCtry(this.cityForm.value).subscribe(data => {
            this.dsStateItem = data;

        });

    }
    OnBindDropdownCountry() {
        
        this.service.getCountryBind().subscribe(data => {
            this.dscountryItem = data;

        });
    }
    createForm() {
        if (this.cityForm.value.ID != null) {

            this.service.getCityEdit(this.cityForm.value).pipe(
            ).subscribe(data => {
                
                this.cityForm.patchValue(data[0]);
                $('#ddlStatus').select2().val(data[0].Status);
                $('#ddlCountryv').select2().val(data[0].CountryID);
                $('#ddlStatev').select2().val(data[0].StateID);
                this.CountryChanged(data[0].CountryID);
            });

            this.cityForm = this.fb.group({
                ID: 0,
                CityCode: '',
                CityName: '',
                StateName: '',
                CountryName: '',
                CountryCode: '',
                CountryID: 0,
                Status: 0,
                StateID:0
            });
        }
        else {
            this.cityForm = this.fb.group({
                ID: 0,
                CityCode: '',
                CityName: '',
                StateName: '',
                CountryName: '',
                CountryCode: '',
                CountryID: 0,
                Status: 1,
                StateID: 0
            });
        }
    }
    onSubmit() {
        var validation = "";

        if (this.cityForm.value.CityCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter City Code</span></br>"
        }
        if (this.cityForm.value.CityName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter City Name</span></br>"
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        else {
            this.cityForm.value.Status = $('#ddlStatus').val();
            this.cityForm.value.CountryID = $('#ddlCountryv').val();
            if (this.cityForm.value.StateID != "") {
                this.cityForm.value.StateID = $('#ddlStatev').val();
            }
            else {
                this.cityForm.value.StateID = 0;
            }
                
           
            this.service.saveCty(this.cityForm.value).subscribe(Data => {
                Swal.fire(Data[0].AlertMessage)
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
        }
    }

    onBack() {
        if (this.cityForm.value.ID == 0) {
            var validation = "";
            if (this.cityForm.value.CityCode != "" || this.cityForm.value.CityName != "") {
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
                        this.router.navigate(['/views/masters/commonmaster/city/cityview']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/masters/commonmaster/city/cityview']);
            }
        }
        else {
            this.router.navigate(['/views/masters/commonmaster/city/cityview']);
        }
    }
}
interface Status {
    value: string;
    viewValue: string;
}
