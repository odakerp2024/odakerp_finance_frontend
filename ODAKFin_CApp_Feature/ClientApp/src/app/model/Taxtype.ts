
export class Country {
    ID = 0;
    CountryName = '';

}
export class CountrySearch {
    countryId = 0;
}
export class GetAssociatedType {
    AssociatedTypeID:Number;
    RefCode = '';
    AssociatedType ='';

}
export class GetAssociatedTypeSearch {
    associatedtypeId = 0;
}
export class Associatedlist {
    TaxTypeId=0;
    TaxTypeName="";
    EffectiveDate="";
    CountryName="";
    CountryId:Number;
    Active=1;
}

export class GetTaxTypeFilter {
    taxTypeName:String = '';
    ShortName:String = '';


    // CountryId:String ="";
    IsActive:Number=1;

}
export class Image_List {
    Not_Found_for_List: any = "assets/images/No_data_found.png";
}

export class DynamicGridColumn {
    MappingGLTaxTypeId = 0;
    TaxTypeId = 0;
    AssociatedtaxId = 0;
    TransactionType = 0;
    OfficeId = 0;
    AccountId = 0;
    SubLedgerId = 0;
    Status= 'true';
    IsSelected = 0;
    AssociatedTaxName: '';
    TransactionTypeName: '';
    OfficeName: '';
    AccountName: '';
    SubLedgerName: '';
    StatusName: '';
}
