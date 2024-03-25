import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from '../globals';
import { Operator } from 'rxjs';
import { DynamicACLPDF, DynamicAquaticPDF, DynamicCargoPlanPDF, DynamicCROPDF, DynamicHawkPDF, DynamicImlPDF,DynamicLMTPDF, DynamicMerchantPDF, DynamicMJPDF, DynamicNavioPDF, DynamicSBEPDF, DynamicSeahorsePDF, DynamicSealloydPDF, DynamicShipnerPDF, DynamicSRSPDF, DynamicTarusPDF, DynamicTetraPDF, DynamicUSLPDF } from '../model/Pdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

    constructor(private http: HttpClient, private globals: Globals) { }

    public authToken = "";

    loadToken() {
        const token = localStorage.getItem('Token');
        this.authToken = token;
    }
    createAuthHeader() {
        this.loadToken();
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.authToken}`
        );
        return { headers };
    }

    getACLPDF(OL: DynamicACLPDF): Observable<DynamicACLPDF[]> {
        return this.http.post<DynamicACLPDF[]>(this.globals.APIURL + '/PDF/ACLPDF/ACLPrintPDF', OL);
    }
    //getACLPDF(OL: DynamicACLPDF): Observable<DynamicACLPDF[]> {
    //    return this.http.post<DynamicACLPDF[]>(this.globals.APIURL + '/PDF/ACLPDF/ACLPrintPDF', OL);
    //}
    //getBSSPDF(OL: DynamicBSSPDF): Observable<DynamicBSSPDF[]> {
    //    return this.http.post<DynamicBSSPDF[]>(this.globals.APIURL + '/PDF/BSSPDF/BSSPrintPDF', OL);
    //}
    async getBSSPDF(id): Promise<Blob> {
        const url = `${this.globals.APIURL}/PDF/BSSPDF/BSSPrintPDF/${id}`;
        //const key: string = await this.getKey();
        //console.log('key:', key);

        //let headers = new HttpHeaders();
        //headers = headers.append('Authorization', [key]);

        return this.http.get(url, { responseType: 'blob' }).toPromise();
    }
    getCargoPlanPDF(OL: DynamicCargoPlanPDF): Observable<DynamicCargoPlanPDF[]> {
        return this.http.post<DynamicCargoPlanPDF[]>(this.globals.APIURL + '/PDF/CargoPlanPDF/CargoPlanPrintPDF', OL);
    }
    getHawkPDF(OL: DynamicHawkPDF): Observable<DynamicHawkPDF[]> {
        return this.http.post<DynamicHawkPDF[]>(this.globals.APIURL + '/PDF/HawkPDF/HawkPrintPDF', OL);
    }
    getmjPDF(OL: DynamicMJPDF): Observable<DynamicMJPDF[]> {
        return this.http.post<DynamicMJPDF[]>(this.globals.APIURL + '/PDF/MJPDF/MJPrintPDF', OL);
    }
    getmerchantPDF(OL: DynamicMerchantPDF): Observable<DynamicMerchantPDF[]> {
        return this.http.post<DynamicMerchantPDF[]>(this.globals.APIURL + '/PDF/MerchantPDF/MerchantPrintPDF', OL);
    }
    getnavioPDF(OL: DynamicNavioPDF): Observable<DynamicNavioPDF[]> {
        return this.http.post<DynamicNavioPDF[]>(this.globals.APIURL + '/PDF/NavioPDF/NavioPrintPDF', OL);
    }
    //getnavioPDF(OL: DynamicNavioPDF): Observable<DynamicNavioPDF[]> {
        
    //    return this.http.post<DynamicNavioPDF[]>(this.globals.APIURL + '/PDF/NavioPDF/NavioPrintPDF', OL);

    //}
    getseahorsePDF(OL: DynamicSeahorsePDF): Observable<DynamicSeahorsePDF[]> {
        return this.http.post<DynamicSeahorsePDF[]>(this.globals.APIURL + '/PDF/SeahorsePDF/SeahorsePrintPDF', OL);
    }
    getshipnerPDF(OL: DynamicShipnerPDF): Observable<DynamicShipnerPDF[]> {
        return this.http.post<DynamicShipnerPDF[]>(this.globals.APIURL + '/PDF/ShipnerPDF/ShipnerPrintPDF', OL);
    }
    
    getaquaticPDF(OL: DynamicAquaticPDF): Observable<DynamicAquaticPDF[]> {
        return this.http.post<DynamicAquaticPDF[]>(this.globals.APIURL + '/PDF/AquaticPDF/AquaticPrintPDF', OL);
    }
    getuslPDF(OL: DynamicUSLPDF): Observable<DynamicUSLPDF[]> {
        return this.http.post<DynamicUSLPDF[]>(this.globals.APIURL + '/PDF/USLPDF/USLPrintPDF', OL);
    }
    getsbePDF(OL: DynamicSBEPDF): Observable<DynamicSBEPDF[]> {
        return this.http.post<DynamicSBEPDF[]>(this.globals.APIURL + '/PDF/SBEPDF/SBEPrintPDF', OL);
    }
    getsrsPDF(OL: DynamicSRSPDF): Observable<DynamicSRSPDF[]> {
        return this.http.post<DynamicSRSPDF[]>(this.globals.APIURL + '/PDF/SRSPDF/SRSPrintPDF', OL);
    }
    getlmtPDF(OL: DynamicLMTPDF): Observable<DynamicLMTPDF[]> {
        return this.http.post<DynamicLMTPDF[]>(this.globals.APIURL + '/PDF/LMTPDF/LMTPrintPDF', OL);
    }
    gettetraPDF(OL: DynamicTetraPDF): Observable<DynamicTetraPDF[]> {
        return this.http.post<DynamicTetraPDF[]>(this.globals.APIURL + '/PDF/TetraPDF/TetraPrintPDF', OL);
    }
    getsealloydPDF(OL: DynamicSealloydPDF): Observable<DynamicSealloydPDF[]> {
        return this.http.post<DynamicSealloydPDF[]>(this.globals.APIURL + '/PDF/SealloydPDF/SealloydPrintPDF', OL);
    }
    getimlPDF(OL: DynamicImlPDF): Observable<DynamicImlPDF[]> {
        return this.http.post<DynamicImlPDF[]>(this.globals.APIURL + '/PDF/IMLPDF/IMLPrintPDF', OL);
    }
    gettarusPDF(OL: DynamicTarusPDF): Observable<DynamicTarusPDF[]> {
        return this.http.post<DynamicTarusPDF[]>(this.globals.APIURL + '/PDF/TarusPDF/TarusPrintPDF', OL);
    }
    getCROPDF(OL: DynamicCROPDF): Observable<DynamicCROPDF[]> {

        return this.http.post<DynamicCROPDF[]>(this.globals.APIURL + '/PDF/CROPDF/CROPrintPDF', OL);
    }
    getNavionew(OL: DynamicNavioPDF): Observable<DynamicNavioPDF[]> {

        return this.http.post<DynamicNavioPDF[]>('/NavioPDF2/BLPrintPDF', OL);

    }

}
