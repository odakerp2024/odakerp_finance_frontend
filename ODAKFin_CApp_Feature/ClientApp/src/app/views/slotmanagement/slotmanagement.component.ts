import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MastersService } from 'src/app/services/masters.service';
import { PaginationService } from 'src/app/pagination.service';
import { ServiceSetup, Port, VoyageDetails, Vessel, Terminal } from '../../../app/model/common';
import Swal from 'sweetalert2';
import { SlotmgmtService } from '../../services/slotmgmt.service';
import { VOA, SvSlot, Slot, fileattach, GridAttach, SvSlotDtls } from '../../model/slot';
import { LinerName, GeneralMaster, ChargeTBMaster, BasicMaster, CurrencyMaster } from 'src/app/model/common';
import { PrincipaltariffService, } from '../../services/principaltariff.service';
import { Observable } from 'rxjs';
import { BusinessTypes, DynamicGridParty, Party, DynamicGridAttach } from 'src/app/model/Party';
import { RateapprovalService } from '../../services/rateapproval.service';
declare let $: any;
/*import * as XLSX from 'xlsx';*/
import { tap } from 'rxjs/operators';
@Component({
    selector: 'app-slotmanagement',
    templateUrl: './slotmanagement.component.html',
    styleUrls: ['./slotmanagement.component.css']
})

export class SlotmanagementComponent implements OnInit {
    slotForm: FormGroup;
    SID = 0;
    SIDV = 0;
    errorMsg: string;
    length: number = 0;
    RegId = 0;
    AttachName = '';
    AttachID = 0;
    newDynamicGrid: any = {};
    myControl = new FormControl('');
    fillAttachedAgreementType: GeneralMaster[];

    SvSlotGrid: Array<SvSlotDtls> = [];
    newSvSlotGrid: any = {};

    ETA: string = '';
    ETD: string = '';
    BindTeusTotal: number = 0;
    BindMTTotal: number = 0;
    SvSlotatch: Array<fileattach> = [];
    DynamicGridAttachLink: Array<DynamicGridAttach> = [];
    ddlServiceItem: ServiceSetup[];
    ddlVesselItem: Vessel[];
    ddlVoyageItem: VoyageDetails[];
    ddlVOAItem: VOA[];
    ddlsvSlotItem: SvSlot[];
    ddlvattachItem: fileattach[];
    dataSource: VoyageDetails[];
    dataSource1: ServiceSetup[];
    HDArrayIndex = '';
    newDynamicOperator: any = {};
    dsPorts: Port[];
    val: any = {};
    data: [][];
    Teus: number;
    txtAttachFile: any = {};
    filteredOptions: Observable<string[]>;
    showAttach: boolean[] = [];
    constructor(private router: Router, private service: MastersService, public ps: PaginationService, private ES: EncrDecrServiceService, private route: ActivatedRoute, private manage: PrincipaltariffService, private sm:
        SlotmgmtService, private fb: FormBuilder, private rs: RateapprovalService,) {
        this.route.queryParams.subscribe(params => {
            this.slotForm = this.fb.group({
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

        this.newSvSlotGrid = { SID: 0, PODID: 0, POD: '', VOAID: 0, VOA: '', Teus: 0, MT: 0, Notes: '' };
        this.createForm();
        this.InitDropdown();

        $('#ddlVessel').on('select2:select', (e, args) => {
            this.VesselChanged($("#ddlVessel").val());
        });
        $('#ddlVoyagev').on('select2:select', (e, args) => {
            this.VoyageChanged($("#ddlVoyagev").val());
        });
    }

    VesselChanged(vesselval) {

        this.slotForm.value.VesID = vesselval;
        this.sm.getVoyageBind(this.slotForm.value).subscribe(data => {
            this.ddlVoyageItem = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


    }

    VoyageChanged(voyageval) {

        this.slotForm.value.VoyageID = voyageval;
        this.sm.getVoyageETAETD(this.slotForm.value).subscribe(data => {
            //this.slotForm.patchValue(data[0]);
            //this.ETA = data[0].ETA
            //this.ETA = data[0].ETD
            this.slotForm.get('ETA').patchValue(data[0].ETA);
            this.slotForm.get('ETD').patchValue(data[0].ETD);

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


    }

    createForm() {
        if (this.slotForm.value.ID != null) {

            this.sm.GetSlotMgtEdit(this.slotForm.value).pipe(
            ).subscribe(data => {
                this.slotForm.patchValue(data[0]);
                $('#ddlVessel').select2().val(data[0].VesID);
                this.VesselChanged(data[0].VesID);
                $('#ddlVoyagev').select2().val(data[0].VoyageID);
                //$("#ddlVoyage").select2().val(data[0].VoyageID).trigger("change");
                this.VoyageChanged(data[0].VoyageID);

            });
            this.sm.GetSlotMgtDtlsEdit(this.slotForm.value).pipe(tap(data1 => {
                this.SvSlotGrid.splice(0, 1);

                for (let i = 0; i < data1.length; i++) {
                    this.BindTeusTotal += parseInt(data1[i].Teus.toString());
                    this.BindMTTotal += parseInt(data1[i].MT.toString());
                    this.SvSlotGrid.push({

                        'SID': data1[i].SID,
                        'PODID': data1[i].SID,
                        'POD': data1[i].POD,
                        'VOAID': data1[i].VOAID,
                        'VOA': data1[i].VOA,
                        'Teus': data1[i].Teus,
                        'MT': data1[i].MT,
                        'Notes': data1[i].Notes,
                        'FileName': data1[i].FileName,
                    });

                    for (let i = 0; i < this.SvSlotGrid.length; i++) {
                        if (this.SvSlotGrid[i].SID == 0) {

                            this.showAttach[i] = false;

                        }
                        else {
                            this.showAttach[i] = true;
                        }
                    }
                }

            }

            )).subscribe();

            this.slotForm = this.fb.group({
                ID: 0,
                VesID: 0,
                VoyageID: 0,
                ETA: '',
                ETD: '',
                AttachFile: '',
            });
        }
        else {
            this.slotForm = this.fb.group({
                ID: 0,
                VesID: 0,
                VoyageID: 0,
                ETA: '',
                ETD: '',
                AttachFile: '',
            });

        }

    }

    InitDropdown() {
        this.OnBindVessels();
        this.OnBindPorts();
        this.sm.getVOABind(this.slotForm.value).subscribe(data => {
            this.ddlVOAItem = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }
    OnBindPorts() {
        this.rs.getPortMasterBind(this.slotForm.value).subscribe(data => {
            this.dsPorts = data;
        });
    }
    OnBindVessels() {

        this.service.getVesselBind(this.slotForm.value).subscribe(data => {
            this.ddlVesselItem = data;
        });
    }



    btnAddSlot() {
        var validation = "";

        var ddlPOD = $('#ddlPOD').val();
        if (ddlPOD == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select POD</span></br>"
        }
        var ddlVOA = $('#ddlVOA').val();
        if (ddlVOA == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select VOA</span></br>"
        }
        var txtTeus = $('#txtTeus').val();
        if (txtTeus.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Teus</span></br>"
        }
        var txtMt = $('#txtMt').val();
        if (txtMt.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter MT</span></br>"
        }
        var txtNotes = $('#txtNotes').val();
        if (txtNotes.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Notes</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        for (var i = 0; i < this.SvSlotGrid.length; i++) {

            if (this.SvSlotGrid[i].VOA == $('#ddlVOA').val()) {

                validation += "<span style='color:red;'>*</span> <span>VOA Already Exists </span></br>"
            }

        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        var SIDValue;
        SIDValue = (this.SID == null) ? 0 : this.SID;

        this.val = {

            SID: SIDValue,
            PODID: $("#ddlPOD").val(),
            POD: $("#ddlPOD option:selected").text(),
            VOAID: $("#ddlVOA").val(),
            VOA: $("#ddlVOA option:selected").text(),
            Teus: $("#txtTeus").val(),
            MT: $("#txtMt").val(),
            Notes: $("#txtNotes").val(),

        };

        //for (let i = 0; i < this.SvSlotGrid.length; i++) {
        //    if (SIDValue == 0) {

        //        this.showAttach[i] = false;

        //    }
        //    else {
        //        this.showAttach[i] = true;
        //    }
        //}

        for (var i = 0; i < this.SvSlotGrid.length; i++) {
            //this.BindTeusTotal += this.SvSlotGrid.map(t => t.Teus).reduce((acc, value) => acc + value, 0);
            //this.BindTeusTotal += parseInt(this.SvSlotGrid[i].Teus.toString());
            //this.BindMTTotal += parseInt(this.SvSlotGrid[i].MT.toString());
        }
        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.SvSlotGrid[this.HDArrayIndex] = this.val;
        } else {
            this.SvSlotGrid.push(this.val);
        }

        $("#ddlPOD").select2().val(0, "").trigger("change");
        $("#ddlVOA").select2().val(0, "").trigger("change");
        $("#txtMt").val("");
        $("#txtTeus").val("");
        $("#txtNotes").val("");


        this.HDArrayIndex = "";
        this.SID = 0;
    }

    Selectvalues(DynamicGrid, index) {

        this.HDArrayIndex = index;
        this.SID = this.SvSlotGrid[index].SID;

        $("#ddlPOD").select2().val(this.SvSlotGrid[index].PODID).trigger("change");
        $("#ddlVOA").select2().val(this.SvSlotGrid[index].VOAID).trigger("change");
        $("#txtMt").val(this.SvSlotGrid[index].MT);
        $("#txtTeus").val(this.SvSlotGrid[index].Teus);
        $("#txtNotes").val(this.SvSlotGrid[index].Notes);

    }

    RemoveValues(SvSlotGrid, index, SID) {

        this.slotForm.value.SID = SID;
        this.SvSlotGrid.splice(index, 1);
        this.sm.RemoveValues(this.slotForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    OnSubmit() {

        var validation = "";

        if ($('#ddlVessel').val() == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Vessel</span></br>"
        }
        if ($('#ddlVoyagev').val() == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Voyage</span></br>"
        }

        if (this.SvSlotGrid.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Add Space Planning Details </span></br>"
        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        var Items = [];
        for (let item of this.SvSlotGrid) {

            var intSID = 0;
            if (item.Teus != 0) {
                if (item.SID == 0)
                    intSID = 0;
                else
                    intSID = item.SID;
                Items.push('Insert:' + intSID, item.VOAID, item.VOA, item.PODID, item.POD, item.Teus, item.MT, item.Notes);
            }

        };
        this.slotForm.value.VesID = $('#ddlVessel').val();
        this.slotForm.value.VoyageID = $('#ddlVoyagev').val();
        this.slotForm.value.Items = Items.toString();

        this.sm.InsertSlotDetails(this.slotForm.value).subscribe(data => {
            Swal.fire(data[0].AlertMessage)
            //this.createForm();
            setTimeout(() => {

                this.router.navigate(['/views/slotmanagement/slotmanagementview/slotmanagementview']);
            }, 2000);  //5s
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }


    selectedFile: File = null;
    uploadedfile: string = null;
    progress: string = '';

    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
        const filedata = new FormData();
        filedata.append('file', this.selectedFile, this.selectedFile.name)
        this.rs.AttachUpload(this.selectedFile).subscribe(
            (event) => {

                var fullpath = event;
                var res = JSON.stringify(fullpath).split('\\').pop().split('"}')[0]
                this.uploadedfile = res;
                console.log(this.uploadedfile);

            }
        );

    }

    DynamicDeleteGrid(dynamicGrid, index, id) {
        dynamicGrid.splice(index, 1);
        this.slotForm.value.ID = id;
    }

    onAttachModel(SID) {
        this.SIDV = SID;
        $('#AttachModel').modal('show');
    }
    onAttachSave() {
        this.slotForm.value.SID = this.SIDV;
        this.slotForm.value.AttachFile = this.uploadedfile;
        this.sm.InsertAttachment(this.slotForm.value).subscribe(data => {
            Swal.fire(data[0].AlertMessage)

        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }
}