import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Port, Terminal } from '../../../../model/common';
import { MastersService } from '../../../../services/masters.service';
declare let $: any;

@Component({
    selector: 'app-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    id = "0";
    myControl = new FormControl('');
    terminalForm: FormGroup;
    dataSource: Terminal[];
    dsportItem: Port[];

    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            this.terminalForm = this.fb.group({
                ID: params['id'],
                //TerminalCode: '',
                //TerminalName: '',
                //PortID: 0,
                //Status: 0
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
        this.OnBindDropdownPort();
    }

 

    OnBindDropdownPort() {
        this.service.getPortBind().subscribe(data => {
            this.dsportItem = data;
        });
    }

    createForm() {
        if (this.terminalForm.value.ID != null) {

            this.service.getTerminaledit(this.terminalForm.value).pipe(
            ).subscribe(data => {
                this.terminalForm.patchValue(data[0]);
                $('#ddlPort').select2().val(data[0].PortID);
                $('#ddlStatus').select2().val(data[0].Status);
            });


          
            this.terminalForm = this.fb.group({
                ID: 0,
                TerminalCode: '',
                TerminalName: '',
                PortID: 0,
                Status: 0
            });
        }
        else {
            this.terminalForm = this.fb.group({
                ID: 0,
                TerminalCode: '',
                TerminalName: '',
                PortID: 0,
                Status: 1
            });
        }
    }

    onSubmit() {
        var validation = "";

        if (this.terminalForm.value.TerminalCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Terminal Code</span></br>"
        }
        if (this.terminalForm.value.TerminalName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Terminal Name</span></br>"
        }
        if ($('#ddlPort').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Port</span></br>"
        }
      
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        this.terminalForm.value.PortID = $('#ddlPort').val();
        this.terminalForm.value.Status = $('#ddlStatus').val();
        this.service.saveTerminal(this.terminalForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });

       

    }

    onBack() {
        if (this.terminalForm.value.ID == 0) {
            var validation = "";
            if (this.terminalForm.value.TerminalCode != "" || this.terminalForm.value.TerminalName != "" || $('#ddlPort').val() != null) {
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
                        this.router.navigate(['/views/masters/commonmaster/terminal/terminalview']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/masters/commonmaster/terminal/terminalview']);
            }
        }
        else {
            this.router.navigate(['/views/masters/commonmaster/terminal/terminalview']);
        }
    }

}

interface Status {
    value: string;
    viewValue: string;
}
