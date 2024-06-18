import { Injectable } from '@angular/core';

@Injectable()

export class Globals {

    appName: string = 'FI';

    // UAT
    APIURL: string = 'https://odakfnuat.odaksolutions.in/api';
    MASTER_API_URL: string = 'https://odakfnuat.odaksolutions.in/api';
    SaApi: string = "https://odaksauat.odaksolutions.in/api";
    APIURLFF: string = 'https://odaksauat.odaksolutions.in/ffddev/api';
    FFAPI: string = 'https://odakffuat.odaksolutions.in/ffddev/api';
    APIURLLA: string = 'https://odaklauat.odaksolutions.in/api';
    TemplateUploadURL: string = 'https://odakfnuat.odaksolutions.in';
    LANDINGURL: string = 'https://odakfnuat.odaksolutions.in/api'

    // PROD
    // APIURL: string = 'https://fn-navioindia.freighteiz.com/api';
    // MASTER_API_URL: string = 'https://fn-navioindia.freighteiz.com/api';
    // SaApi: string = "https://sa-navioindia.freighteiz.com/api";
    // APIURLFF: string = 'https://sa-navioindia.freighteiz.com/ffddev/api';
    // FFAPI: string = 'https://ff-navioindia.freighteiz.com/ffddev/api';
    // APIURLLA: string = 'https://la-navioindia.freighteiz.com/api';
    // TemplateUploadURL: string = 'https://fn-navioindia.freighteiz.com';
    // LANDINGURL: string = 'https://navioindia.freighteiz.com/'

}
