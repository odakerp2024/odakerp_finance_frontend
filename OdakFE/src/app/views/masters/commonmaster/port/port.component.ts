import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { PartyService } from 'src/app/services/party.service';
import { MyAgency, Port } from '../../../../model/common';
import { SalesOffice } from '../../../../model/org';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Country } from 'src/app/model/Organzation';
declare let $: any;

@Component({
    selector: 'app-port',
    templateUrl: './port.component.html',
    styleUrls: ['./port.component.css']
})
export class PortComponent implements OnInit {
    id = "0";
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    constructor(private router: Router, private route: ActivatedRoute, private ms: MastersService, private ps: PartyService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            //this.id = params['id'];
            this.portForm = this.fb.group({
                ID: params['id'],
            });

        });
    }

    portForm: FormGroup;
    dataSource: Port[];

    private ddlCountryItems: any[];
    dscountryItem: Country[];
    /*ddGeoLocationItem: MyAgency[];*/
    ddGeoLocationItem: SalesOffice[];

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
        $('#ddlCountry').on('select2:select', (e, args) => {
            this.CountryChange($("#ddlCountry").val());
        });
       
    }

    onInitalBinding() {

        this.OnBindDropdownCountry();

    }

   
    OnBindDropdownCountry() {
        this.ms.getCountryBind().subscribe(data => {
            this.dscountryItem = data;

        });
    }
    CountryChange(countryval) {

        this.portForm.value.CountryID = countryval;
        this.ms.getGeoLocByCountryBind(this.portForm.value).subscribe(data => {
            this.ddGeoLocationItem = data;
        });
    }
    createForm() {
        
       
        if (this.portForm.value.ID != null) {
            this.ms.getPortEdit(this.portForm.value).pipe(
            ).subscribe(data => {
               
                this.portForm.patchValue(data[0]);
                this.CountryChange(data[0].CountryID);
                $('#ddlCountry').select2().val(data[0].CountryID);
                $('#ddlGeoLocation').select2().val(data[0].OffLocID);
                $('#ddlStatus').select2().val(data[0].Status);
            });


            this.portForm = this.fb.group({
                ID: 0,
                PortName: '',
                PortCode: '',
                CountryCode: '',
                MainPort: 0,
                IsSeaPort: 0,
                CountryID: 0,
                Status: 0,
                IsICDPort: 0,
                OffLocID: 0,
                SeaPort: '',
                ICDPort: '',
            });
        }
        else {
            this.portForm = this.fb.group({
                ID: 0,
                PortName: '',
                PortCode: '',
                CountryCode: '',
                MainPort: 0,
                IsSeaPort: 1,
                CountryID: 0,
                Status: 1,
                IsICDPort: 0,
                GeoLocID: 0,
                SeaPort: '',
                ICDPort: '',
            });
            $('#ddlStatus').select2().val(0);
        }
    }


    onSubmit() {
        var validation = "";

        if ($('#ddlCountry').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Country</span></br>"
        }
        if (this.portForm.value.PortName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Port Name</span></br>"
        }
        if (this.portForm.value.PortCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Port Code</span></br>"
        }
        if (this.portForm.value.IsSeaPort == true && this.portForm.value.IsICDPort == true) {
            validation += "<span style='color:red;'>*</span> <span>Please Check One Either ICDPort or SeaPort</span></br>"

        }
        var seaportlen = "";
        if (this.portForm.value.IsSeaPort == 1) {
            seaportlen = this.portForm.value.PortCode.length;
            if (seaportlen != "5" ) {
                validation += "<span style='color:red;'>*</span> <span>Port Code Must be 5 Characters</span></br>"
            }
        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }

        if (this.portForm.value.IsSeaPort == true) {
            this.portForm.value.IsSeaPort = 1;
        }
        else {
            ;
            this.portForm.value.IsSeaPort = 0;
        }
        if (this.portForm.value.IsICDPort == true) {
            this.portForm.value.IsICDPort = 1;
        }
        else {
            this.portForm.value.IsICDPort = 0;
        }
        this.portForm.value.Status = $('#ddlStatus').val();
        this.portForm.value.CountryID = $('#ddlCountry').val();
        if ($('#ddlGeoLocation').val() == null) {
            this.portForm.value.GeoLocID = 0;
        }
        else {
            this.portForm.value.GeoLocID = $('#ddlGeoLocation').val();
        }
        
        this.ms.savePort(this.portForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });


    }

    onBack() {
        if (this.portForm.value.ID == 0) {
            var validation = "";
            if ($('#ddlCountry').val() != null || this.portForm.value.PortName != "" || this.portForm.value.PortCode != "") {
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
                        this.router.navigate(['/views/masters/commonmaster/port/portview']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/masters/commonmaster/port/portview']);
            }
        }
        else {
            this.router.navigate(['/views/masters/commonmaster/port/portview']);
        }
    }

}
interface Status {
    value: string;
    viewValue: string;
}