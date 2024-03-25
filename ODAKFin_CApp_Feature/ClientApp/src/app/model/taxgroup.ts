import { DecimalPipe } from "@angular/common";

export class Taxgrouplist {
    TaxGroupId = 0;
    TaxGroupName = '';
    TaxRate:Number=null;
    Active=null;
    
}

export class TaxgroupFillter {
    
    TaxGroupName = '';
    TaxRate:Number=null;
    IsActive=true;
    
}
export class GetAssociatedType {
    TaxTypeId:Number;
    TaxTypeName = '';
    AssociatedType ='';
    
}
export class GetAssociatedTypeSearch {
    TaxTypeId = 0;
}


export class GetTaxgroup {
    TaxTypeId:Number;
    TaxTypeName = '';
    //EffectiveDate ='';
   // CountryName=";" 
}
export class GettaxTypeSearch {
    TaxTypeId = 0;
}
export class GetSales {
    ChartOfAccountsId:0;
    OrganizationID="";
    OrganizationName="";
    AccountTypeID:Number;
    AccountCode="";
    AccountName="";
    IsSubAccount="";
    ParentAccountID:Number;
    ParentAccount="";
    IsJobAccount="";
    DivisionId=null;
    DivisionName=null;
    IsPrincipal="";
    PrincipalID:Number;
    Principal1="";
    Remarks="";
    IsActive="";
    Status="";
    SubAccountGroupName:"";
    MainAccountGroupName:"";
    
}

 export class GetSalesSearch {
    ChartOfAccountsId=0;
    OrganizationName:String="";
    AccountTypeID=0;
    AccountCode="";
    AccountName="";
    IsSubAccount=0;
    ParentAccount="";
    IsJobAccount=0;
    DivisionName="";
    IsPrincipal:String="";
    Principal="";
    Remarks="";
    IsActive:Number=1;
    MainGroupID:Number=2;
    
}
export class TaxBifurcationClass{
    TaxBifurcationId:Number=0;
    TaxGroupId:Number=0;
    AssociatedTaxTypeId:Number=0;
    TaxBifurcation:String="0.00";
}
export class Image_List {
    Not_Found_for_List: any = "assets/images/No_data_found.png";
}