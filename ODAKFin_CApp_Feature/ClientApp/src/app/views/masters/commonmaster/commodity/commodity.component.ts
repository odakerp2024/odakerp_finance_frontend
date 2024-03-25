import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Commodity } from '../../../../model/common';
import { MastersService } from '../../../../services/masters.service';
declare let $: any;
@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.css']
})
export class CommodityComponent implements OnInit {
    dgflag: DGFlag[] = [
        { value: '1', viewValue: 'YES' },
        { value: '0', viewValue: 'NO' },
    ];

    commtype: CommType[] = [
        { CommodityType: '3', GeneralName: 'GENERAL' },
        { CommodityType: '4', GeneralName: 'HAZARDOUS' },
        { CommodityType: '153', GeneralName: 'FLEXI' },
        { CommodityType: '196', GeneralName: 'EMPTY' },
    ];

    id = "0";
    myControl = new FormControl('');
    commodityForm: FormGroup;
    dataSource: Commodity[];
    dsCommodityType: Commodity[];



    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            this.commodityForm = this.fb.group({
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
        this.DropdownCommodityTypes();
  }
    DropdownCommodityTypes() {
        this.service.getCommodityTypes(this.commodityForm.value).subscribe(data => {
            this.dsCommodityType = data;
        });
    }

    createForm() {

        this.service.getCommodityedit(this.commodityForm.value).pipe(
        ).subscribe(data => {
            this.commodityForm.patchValue(data[0]);
            $('#ddlFlag').select2().val(data[0].DangerousFlag);
            $('#ddlCommodityType').select2().val(data[0].CommodityType);
        });

        this.commodityForm = this.fb.group({
            ID: 0,
            CommodityUnCode: '',
            CommodityName: '',
            HSCode: '',
            DangerousFlag: '',
            CommodityType: '',
            Remarks: '',
        });
    }

    onSubmit() {
        var validation = "";

        if ($('#ddlFlag').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select DangerousFlag</span></br>"
        }
        if ($('#ddlCommodityType').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Commodity Type</span></br>"
        }
        if (this.commodityForm.value.CommodityUnCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Commodity Un Code</span></br>"
        }
        if (this.commodityForm.value.CommodityName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Commodity Name</span></br>"
        }
        if (this.commodityForm.value.HSCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter HS Code</span></br>"
        }
        //if (this.commodityForm.value.DangerousFlag == "") {
        //    validation += "<span style='color:red;'>*</span> <span>Please Enter DangerousFlag</span></br>"
        //}
        //if (this.commodityForm.value.CommodityType == "") {
        //    validation += "<span style='color:red;'>*</span> <span>Please Enter Commodity Type</span></br>"
        //}



        if (validation != "") {

            Swal.fire(validation)
            return false;
        }

        else {
            this.commodityForm.value.DangerousFlag = $('#ddlFlag').val();
            this.commodityForm.value.CommodityType = $('#ddlCommodityType').val();
            this.service.saveCommodity(this.commodityForm.value).subscribe(Data => {
                Swal.fire(Data[0].AlertMessage)
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
        }

    }

    onBack() {
        if (this.commodityForm.value.ID == 0) {
            var validation = "";
            if (this.commodityForm.value.CommodityUnCode != "" || this.commodityForm.value.CommodityName != "" || this.commodityForm.value.HSCode != "" || this.commodityForm.value.DangerousFlag != "" || this.commodityForm.value.CommodityType != "") {
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
                        this.router.navigate(['/views/masters/commonmaster/commodity/commodityview']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/masters/commonmaster/commodity/commodityview']);
            }
        }
        else {
            this.router.navigate(['/views/masters/commonmaster/commodity/commodityview']);
        }
    }
}

interface DGFlag {
    value: string;
    viewValue: string;
}

interface CommType {
    CommodityType: string;
    GeneralName: string;
}
