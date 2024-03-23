import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Assembly, ComponentMaster, GeneralMaster } from '../../../../model/common';
import { MastersService } from '../../../../services/masters.service';

@Component({
  selector: 'app-componentmaster',
  templateUrl: './componentmaster.component.html',
  styleUrls: ['./componentmaster.component.css']
})
export class ComponentmasterComponent implements OnInit {

    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    id = "0";
    myControl = new FormControl('');
    componentForm: FormGroup;
    dataSource: ComponentMaster[];
    dsassemblyItem: GeneralMaster[];

    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            this.componentForm = this.fb.group({
                ID: params['id'],
            });

        });
    }

    ngOnInit() {
        this.createForm();
        this.OnBindDropdownAssembly();
    }

    createForm() {
        this.service.getComponentedit(this.componentForm.value).pipe(tap(data => this.componentForm.patchValue(data[0]))
        ).subscribe();
        this.componentForm = this.fb.group({
            ID: 0,
            ComponentCode: '',
            ComponentDescription: '',
            AssemblyID: 0,
            Status: 0,
            Assembly: '',
        })
    }

    OnBindDropdownAssembly() {
        this.service.getAssemblyBind(this.componentForm.value).subscribe(data => {
            this.dsassemblyItem = data;
        });
    }

    onSubmit() {
        var validation = "";

        if (this.componentForm.value.ComponentCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Component Code</span></br>"
        }
        if (this.componentForm.value.ComponentDescription == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Component Description</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        } else {
            this.service.saveComponent(this.componentForm.value).subscribe(data => { Swal.fire("Record Saved Successfully") });
        }

        //alert('test');
        //if (this.damageForm.valid) {

        //    this.service.saveDamage(this.damageForm.value).subscribe(data => { Swal.fire("Record Saved Successfully") });
        //} else {
        //    /* alert('Please check validation failed.');*/
        //}

    }

}

interface Status {
    value: string;
    viewValue: string;
}
