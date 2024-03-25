import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { Vessel} from '../../../../model/common';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

declare let $: any;

@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.css']
})
export class VesselComponent implements OnInit {
    title = 'Vessel Master';

    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    myControl = new FormControl('');
    vesselForm: FormGroup;
    dataSource: Vessel[];
    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder, private titleService: Title) {

        this.route.queryParams.subscribe(params => {

            this.vesselForm = this.fb.group({
                ID: params['id'],

            });
        });
    }

    ngOnInit() {
        this.titleService.setTitle(this.title);
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
    }
    createForm() {
        if (this.vesselForm.value.ID != null) {

            this.service.getVesseledit(this.vesselForm.value).pipe(
            ).subscribe(data => {

                this.vesselForm.patchValue(data[0]);
                $('#ddlStatusv').select2().val(data[0].Status);
            });

            this.vesselForm = this.fb.group({
                ID: 0,
                VesselCode: '',
                VesselCallSign: '',
                VesselName: '',
                IMONumber: '',
                MMSI: '',
                Flag: '',
                VesselID: '',
                VesselOwner:'',
                Status: 0
            });
        }
        else {
            this.vesselForm = this.fb.group({
                ID: 0,
                VesselCode: '',
                VesselCallSign: '',
                VesselName: '',
                IMONumber: '',
                MMSI: '',
                Flag: '',
                VesselID: '',
                VesselOwner: '',
                Status: 1
            });
        }
    }
    onSubmit() {
        
        var validation = "";

        if (this.vesselForm.value.VesselName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Vessel Name</span></br>"
        }
        if (this.vesselForm.value.VesselCallSign == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Vessel Call Sign</span></br>"
        }
        if (this.vesselForm.value.Flag == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Flag</span></br>"
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        else {
            this.vesselForm.value.Status = $('#ddlStatusv').val();

            this.service.saveVessel(this.vesselForm.value).subscribe(data => {
                this.vesselForm.value.ID = data[0].ID;
                Swal.fire(data[0].AlertMessage)
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
        }
    }

    onBack() {
        if (this.vesselForm.value.ID == 0) {
            var validation = "";
            if (this.vesselForm.value.VesselName != "" || this.vesselForm.value.VesselCallSign != "" || this.vesselForm.value.Flag != "") {
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
                        this.router.navigate(['/views/masters/LAmaster/vessel/vesselview']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/masters/LAmaster/vessel/vesselview']);
            }
        }
        else {
            this.router.navigate(['/views/masters/LAmaster/vessel/vesselview']);
        }
    }

}
interface Status {
    value: string;
    viewValue: string;

}
