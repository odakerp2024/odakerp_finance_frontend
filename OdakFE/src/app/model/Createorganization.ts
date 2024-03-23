export class BasicOrgDetails {
    
    OrganizationId:Number= 0;
	OrganizationName = '';
	CountryID : Number= 0;
	FinancialYearID :Number = 0;
	CompanyIncorporationNo:'';
	PANNo = '';
	IsRegistrationAddress = '';
	RegistrationAddress = '';
    
}
export class OfficeDetails {
   
    OrganizationOfficeId :Number = 0;
	OrganizationId :Number = 0;
	IsSalesOffice :boolean=false;
	OfficeName = '';
	OfficeCode = '';
	StateId:Number =0;
	GSTNo = '';
	OfficePinCode:String ='0';
	OfficeTelephone = '';
	OfficeAddress = '';
	IsRegionalOffice :Number=0;
	EffectiveFrom = '';
	ParentOfficeID :Number =0;
	IsActive :Number= 1;
	
	
    
}

export class EmailAlerts {
   
   OrganizationEmailAlertId:Number=0;
	OrganizationId:Number=0;
	AlertTypeId :Number=0;
	EmailId :String='';
}

export class Attachments {
    ID = 0;
   OrganizationAttachmentsId = '';
	OrganizationId= '';
	DocumentName = '';
	FilePath = '';
	UploadedOn = '';
}
export class Division {
   
   OrganizationDivisionId:Number= 0;
	OrganizationId:Number= 0;
	DivisionId:Number= 0;
	
}
export class DivisionLable {
   
	OrganizationDivisionId:Number= 0;
	 OrganizationId:Number= 0;
	 DivisionId:Number= 0;
	 DivisionLable:String= "";
	 isChecked:boolean=false
	 
 }

