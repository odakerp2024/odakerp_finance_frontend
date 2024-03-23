import { Component, OnInit } from '@angular/core';
import { PdfService } from 'src/app/services/pdf.service';

import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare let $: any;
import { Globals } from '../../../../globals';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DynamicACLPDF, DynamicBSSPDF, DynamicCargoPlanPDF, DynamicHawkPDF, DynamicMerchantPDF, DynamicMJPDF, DynamicNavioPDF, DynamicSeahorsePDF, DynamicShipnerPDF, DynamicTarusPDF } from 'src/app/model/Pdf';

@Component({
  selector: 'app-bol',
  templateUrl: './bol.component.html',
  styleUrls: ['./bol.component.css']
})
export class BOLComponent implements OnInit {

    aclFilename: DynamicACLPDF[];
    bssFilename: DynamicBSSPDF[];
    cargoplanFilename: DynamicCargoPlanPDF[];
    hawkFilename: DynamicHawkPDF[];
    mjFilename: DynamicMJPDF[];
    merchantFilename: DynamicMerchantPDF[];
    navioFilename: DynamicNavioPDF[];
    seahorseFilename: DynamicSeahorsePDF[];
    shipnerFilename: DynamicShipnerPDF[];
    tarusFilename: DynamicTarusPDF[];
    constructor(private http: HttpClient, private globals: Globals, private ps: PdfService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) { }

    pdfForm: FormGroup;
    isLoading?: boolean;

    ngOnInit(): void {
        this.createForm();
        this.isLoading = false;
  }
    createForm() {
        this.pdfForm = this.fb.group({           
            aclFilename: '',
            bssFilename: '',
            cargoplanFilename: '',
            hawkFilename: '',
            mjFilename: '',
            merchantFilename: '',
            navioFilename: '',
            seahorseFilename: '',
            shipnerFilename: '',
            tarusFilename: ''
           
        });
    }
    //aclpdf() {      
    //    this.ps.getACLPDF(this.pdfForm.value).subscribe(data => {
    //        window.open("assets/pdfFiles/acl/" + data[0].aclFilename + ".pdf");
    //    });
    //}

    aclpdf() {
        
        this.ps.getACLPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/acl/" + data[0].aclFilename + ".pdf");
        });
        
    }

    //aclpdf() {
    //    this.ps.getACLPDF(this.pdfForm.value).subscribe(x => {
    //        console.log(x);
    //        const data = `data:application/pdf;base64,${x}`;

    //        var link = document.createElement('a');
    //        link.href = data;
    //        link.download = ("assets/pdfFiles/acl/177_test.pdf");
    //        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    //    });
       /* window.open("assets/pdfFiles/acl/177_test.pdf");*/
    
    //bsspdf() {
    //    this.ps.getBSSPDF(this.pdfForm.value).subscribe(data => {
    //        window.open("assets/pdfFiles/bss/" + data[0].bssFilename + ".pdf");
    //    });
    //}
    bsspdf(div_id: string) {
        this.ps.getBSSPDF(2).then(x => {
            var newBlob = new Blob([x], { type: "application/pdf" });
            console.log(newBlob);
            const data = window.URL.createObjectURL(newBlob);
            //window.open(data, '_blank');
            var link = document.createElement('a');
            link.href = data;
            link.download = "Test.pdf";
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        });
    }
    cargoplanpdf() {
        this.ps.getCargoPlanPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/cargoplan/" + data[0].cargoplanFilename + ".pdf");
        });
    }
    hawkpdf() {
        this.ps.getHawkPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/hawk/" + data[0].hawkFilename + ".pdf");
        });
    }
    mjpdf() {
        this.ps.getmjPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/mj/" + data[0].mjFilename + ".pdf");
        });
    }
    merchantpdf() {
        this.ps.getmerchantPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/merchant/" + data[0].merchantFilename + ".pdf");
        });
    }
    naviopdf() {       
        this.ps.getnavioPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/navio/" + data[0].navioFilename + ".pdf");
        });
    }
    seahorsepdf() {
        this.ps.getseahorsePDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/seahorse/" + data[0].seahorseFilename + ".pdf");
        });
    }
    shipnerpdf() {
        this.ps.getshipnerPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/shipner/" + data[0].shipnerFilename + ".pdf");
        });
    }
    aquaticpdf() {
        this.ps.getaquaticPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/aquatic/" + data[0].aquaticFilename + ".pdf");
        });
    }
    uslpdf() {
        this.ps.getuslPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/usl/" + data[0].uslFilename + ".pdf");
        });
    }
    sbepdf() {
        this.ps.getsbePDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/sbe/" + data[0].sbeFilename + ".pdf");
        });
    }
    lmtpdf() {
        this.ps.getlmtPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/lmt/" + data[0].lmtFilename + ".pdf");
        });
    }
    srspdf() {
        this.ps.getsrsPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/srs/" + data[0].srsFilename + ".pdf");
        });
    }
    tetrapdf() {
        this.ps.gettetraPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/tetra/" + data[0].tetraFilename + ".pdf");
        });
    }
    sealloydpdf() {
        this.ps.getsealloydPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/sealloyd/" + data[0].sealloydFilename + ".pdf");
        });
    }
    imlpdf() {
        this.ps.getimlPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/iml/" + data[0].imlFilename + ".pdf");
        });
    }

    taruspdf() {
        this.ps.gettarusPDF(this.pdfForm.value).subscribe(data => {
            window.open("assets/pdfFiles/tarus/" + data[0].tarusFilename + ".pdf");
        });
    }

    naviopdfnew() {

        this.ps.getNavionew(this.pdfForm.value).subscribe(data => {
            alert(data[0].navioFilename);
            window.open("Uploader/" + data[0].navioFilename + ".pdf");
            //alert(data[0].aquaticFilename);
            /* window.open("UploadFolder/94_test.pdf");*/
            /* window.open('@Url.Action("BLPrintPDF","NavioPDF2")');*/
            
        });
       
       /* window.open('@Url.Action("BLPrintPDF", "NavioPDF2")');*/
       /* window.location.href = '@Url.Action("BLPrintPDF", "NavioPDF2")';*/
        //var Url = '@Url.Action("BLPrintPDF", "NavioPDFController2", new RouteValueDictionary)';
        //window.location.href = Url;

       
    }
}
