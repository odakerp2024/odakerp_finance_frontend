import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BookingMaster } from '../../../../../model/booking';
import { City, Country, Port } from '../../../../../model/common';
import { MyBkgLevel, CommonValues, MyBkgDocs } from '../../../../../model/MyBkgLevel';
import { PaginationService } from '../../../../../pagination.service';
import { BkglevelService } from '../../../../../services/bkglevel.service';
import { BookingService } from '../../../../../services/booking.service';
import { EncrDecrServiceService } from '../../../../../services/encr-decr-service.service';
import { RateapprovalService } from '../../../../../services/rateapproval.service';
import { Title } from '@angular/platform-browser';
import { ExportbookingService } from '../../../../../services/exportbooking.service';
import { HttpEventType } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
@Component({
    selector: 'app-haz',
    templateUrl: './haz.component.html',
    styleUrls: ['./haz.component.css']
})
export class HazComponent implements OnInit {
    title = 'Booking Level Tasks';
    docForm: FormGroup;
    bkgNo: string = '';
    bkgparty: string = '';
    destination: string = '';
    vesselname: string = '';
    voyageno: string = '';
    loadPort: string = '';

    BookingID = 0;
    showdelete: boolean[] = [];
    showdeletedisbale: boolean[] = [];
    dsPorts: Port[];
    dsDocs: MyBkgDocs[];
    dsHazAttachments: MyBkgDocs[];
    fileUrl: string;
    message: string;
    progress1: number;
    constructor(private fb: FormBuilder, private bookingservice: BookingService, private titleService: Title, private router: Router, private bks: BkglevelService, public ps: PaginationService, private rs: RateapprovalService, private route: ActivatedRoute, private ES: EncrDecrServiceService, private bs: ExportbookingService,) { }

    ngOnInit() {

        this.titleService.setTitle(this.title);
        var queryString = new Array();
        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyPara = Parameter.split(',');
            for (var i = 0; i < KeyPara.length; i++) {
                var key = KeyPara[i].split(':')[0];
                var value = KeyPara[i].split(':')[1];
                queryString[key] = value;
            }

            if (queryString["ID"] != null) {
                // this.docForm.value.ID = queryString["ID"].toString();
                this.BookingID = queryString["ID"].toString();

            }

        });

        this.createForm();
        this.ViewDocList();
        this.ViewAttachList();
        this.ViewBkgBasicList();
    }
    ViewBkgBasicList() {
        this.docForm.value.ID = this.BookingID;
        this.bs.getExBookingValues(this.docForm.value).subscribe(data => {
            this.docForm.patchValue(data[0]);
            this.bkgNo = data[0].BookingNo;
            this.bkgparty = data[0].BookingParty;
            this.vesselname = data[0].VesselName;
            this.voyageno = data[0].VoyageNo;
            this.loadPort = data[0].LoadPort;
            this.destination = data[0].Destination;
        });
    }
    ViewDocList() {
        this.docForm.value.ID = this.BookingID;
        this.bks.getDocsHazlist(this.docForm.value).subscribe(data => {
            this.dsDocs = data[0].BkgItemList;
            for (let i = 0; i < data.length; i++) {

                if (data[i].AttachFile == "") {
                    this.showdeletedisbale[i] = true;
                    this.showdelete[i] = false;
                }
                else {
                    this.showdeletedisbale[i] = false;
                    this.showdelete[i] = true;
                }
            }
        });
    }
    ViewAttachList() {
        this.docForm.value.ID = this.BookingID;
        this.bks.getDocsHazAttachlist(this.docForm.value).subscribe(data => {
            this.dsHazAttachments = data;

        });
    }
    createForm() {
        this.docForm = this.fb.group({
            ID: 0,
            FileName: '',
            AttachFile: '',

        });
    }
    selectedFile: File = null;
    uploadedfile: string = null;
    progress: string = '';

    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
        const filedata = new FormData();
        filedata.append('file', this.selectedFile, this.selectedFile.name)
        this.bks.AttachUpload(this.selectedFile).subscribe(
            (event) => {

                var fullpath = event;
                var res = JSON.stringify(fullpath).split('\\').pop().split('"}')[0]
                this.uploadedfile = res;
                // console.log(this.uploadedfile);

            }
        );

    }
    onSubmit() {
        var validation = "";
        var DocsTypev = '';
        for (let item of this.dsDocs) {

            if (item.ChkFlag == 1) {
                DocsTypev = item.DocsType;
                if (DocsTypev != item.DocsType) {
                    Swal.fire("DocsType Differ");
                    return false;
                }
            }

        }
        //if (this.docForm.value.FileName == "") {
        //    validation += "<span style='color:red;'>*</span> <span>Please Enter File Name</span></br>"
        //}

        if (this.uploadedfile == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Upload File</span></br>"
        }
        var vtrue = 0;
        for (let item of this.dsDocs) {

            if (item.ChkFlag == 1) {
                vtrue = 1;
            }

        }
        if (vtrue == 0) {
            Swal.fire("Please Check Atleast one");
            return false;
        }



        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        this.docForm.value.AttachFile = this.uploadedfile;
        var doctypev = 0;

        var Items = [];
        for (let item of this.dsDocs) {

            if (item.ChkFlag == 1) {
                if (item.DocsType == "HAZ") {
                    doctypev = 1;
                }
                if (item.DocsType == "OOG") {
                    doctypev = 2;
                }
                if (item.DocsType == "REEFER") {
                    doctypev = 3;
                }
                if (item.DocsType == "ODO") {
                    doctypev = 4;
                }
                Items.push('Insert:' + item.CntrID, item.BLID, item.BkgID, doctypev
                );
            }

        }

        this.docForm.value.Items = Items.toString();
        this.bks.BkgDocHAZSave(this.docForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
            this.ViewDocList();

            setTimeout(() => {
                //this.docForm.reset();

                /*  this.docForm.value.ID = this.BookingID;*/
            }, 1000);  //5s
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
        $('#txtAttachFile').val('');
    }

    DeleteAttach(CntrID, BkgID, DocsType) {
        var title = "Are you sure want to delete";
        Swal.fire({
            title: title,
            showDenyButton: true,
            confirmButtonText: 'YES',
            denyButtonText: `NO`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.docForm.value.CntrID = CntrID;
                this.docForm.value.BkgID = BkgID;
                this.docForm.value.DocsType = DocsType;
                this.bks.AttachDelete(this.docForm.value).subscribe((data) => {

                    this.ViewDocList();
                    Swal.fire(data[0].AlertMessage);

                }, (error: HttpErrorResponse) => {
                    Swal.fire(error.message);
                });
            }
            else {

            }
        })
        //this.docForm.value.AttachFile = attach;
        //this.bks.AttachDelete(this.docForm.value).subscribe(Data => {
        //    Swal.fire(Data[0].AlertMessage)
        //    this.ViewDocList();
        //},
        //    (error: HttpErrorResponse) => {
        //        Swal.fire(error.message)
        //    });
    }

    download = (fileUrl) => {
        this.fileUrl = fileUrl

        this.bks.download(this.fileUrl).subscribe((event) => {

            if (event.type === HttpEventType.UploadProgress)
                this.progress1 = Math.round((100 * event.loaded) / event.total);

            else if (event.type === HttpEventType.Response) {
                this.message = 'Download success.';
                this.downloadFile(event);
            }
        });
    }

    private downloadFile = (data: HttpResponse<Blob>) => {
        const downloadedFile = new Blob([data.body], { type: data.body.type });
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        a.download = this.fileUrl;
        a.href = URL.createObjectURL(downloadedFile);
        a.target = '_blank';
        a.click();
        document.body.removeChild(a);
    }

    btntabclick(tab) {



        var values = "ID: " + this.BookingID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1)
            this.router.navigate(['/views/exportmanager/bookinglevel/bookings/bookings'], { queryParams: { encrypted } });
        else if (tab == 2) {
            this.router.navigate(['/views/exportmanager/bookinglevel/containers/containers'], { queryParams: { encrypted } });
        }
        else if (tab == 3) {
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/haz/haz'], { queryParams: { encrypted } });
        }
        else if (tab == 4) {
            this.router.navigate(['/views/exportmanager/bookinglevel/bol/bol'], { queryParams: { encrypted } });
        }
        else if (tab == 5) {
            this.router.navigate(['/views/exportmanager/bookinglevel/blrelease/blrelease'], { queryParams: { encrypted } });
        }
        else if (tab == 6) {
            this.router.navigate(['/views/exportmanager/bookinglevel/exphandling/exphandling'], { queryParams: { encrypted } });
        }
        else if (tab == 7) {
            this.router.navigate(['/views/exportmanager/bookinglevel/invoices/invoices'], { queryParams: { encrypted } });
        }
        else if (tab == 8) {
            this.router.navigate(['/views/exportmanager/bookinglevel/attach/attach'], { queryParams: { encrypted } });
        }
        else if (tab == 9) {
            this.router.navigate(['/views/exportmanager/bookinglevel/blallotment/blallotment'], { queryParams: { encrypted } });
        }


    }

    doctab(tab) {


        var values = "ID: " + this.BookingID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1)
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/haz/haz'], { queryParams: { encrypted } });
        else if (tab == 2) {
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/oog/oog'], { queryParams: { encrypted } });
        }
        else if (tab == 3) {
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/reefer/reefer'], { queryParams: { encrypted } });
        }
        else if (tab == 4) {
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/odo/odo'], { queryParams: { encrypted } });
        }

    }
}
