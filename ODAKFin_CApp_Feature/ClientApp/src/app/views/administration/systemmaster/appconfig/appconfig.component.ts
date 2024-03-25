import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from 'src/app/services/system.service';
import { AppConfig } from '../../../../model/system';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-appconfig',
  templateUrl: './appconfig.component.html',
  styleUrls: ['./appconfig.component.css']
})
export class AppconfigComponent implements OnInit {
    
    statusvalues: Status[] = [       
        { value: '1', viewValue: 'ACTIVE' },
        { value: '0', viewValue: 'IN-ACTIVE' },
    ];
    
    myControl = new FormControl('');
    appconfigForm: FormGroup;
    constructor(private router: Router, private route: ActivatedRoute, private service: SystemService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.appconfigForm = this.fb.group({
                ID: params['id'],

            });
        });
    }

    ngOnInit() {
        
        $('.my-select').select2();
        this.createForm();
  }
    createForm() {
        this.service.getAppConfigEdit(this.appconfigForm.value).pipe(tap(data => this.appconfigForm.patchValue(data[0]))
        ).subscribe();
        this.appconfigForm = this.fb.group({
            ID: 0,
            RefCode: '',
            GeneralName: '',
            SeqNo: '',
            StatusN: 0
           
        });
    }
    onSubmit() {
        alert(this.appconfigForm.value.StatusN);
        if (this.appconfigForm.valid) {

            this.service.saveAppConfig(this.appconfigForm.value).subscribe(appconfig => { Swal.fire("Record Saved Successfully") });
        } else {
            /* alert('Please check validation failed.');*/
        }

    }
}
interface Status {
    value: string;
    viewValue: string;
}
