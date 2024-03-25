import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ContLocationMaster } from '../../../../model/common';
import { MastersService } from '../../../../services/masters.service';

@Component({
  selector: 'app-containerloc',
  templateUrl: './containerloc.component.html',
  styleUrls: ['./containerloc.component.css']
})
export class ContainerlocComponent implements OnInit {

    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    id = "0";
    myControl = new FormControl('');
    contlocForm: FormGroup;
    dataSource: ContLocationMaster[];

    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            this.contlocForm = this.fb.group({
                ID: params['id'],
            });

        });
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.service.getContLocationedit(this.contlocForm.value).pipe(tap(data => this.contlocForm.patchValue(data[0]))
        ).subscribe();
        this.contlocForm = this.fb.group({
            ID: 0,
            LocationCode: '',
            Description: '',
            Status: 0
        });
    }

    onSubmit() {
        var validation = "";

        if (this.contlocForm.value.LocationCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Location Code</span></br>"
        }
        if (this.contlocForm.value.Description == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Description</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        } else {
            this.service.saveContLocation(this.contlocForm.value).subscribe(data => { Swal.fire("Record Saved Successfully") });
        }

    }

}

interface Status {
    value: string;
    viewValue: string;
}
