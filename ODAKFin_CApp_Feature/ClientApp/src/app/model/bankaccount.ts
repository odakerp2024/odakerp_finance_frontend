export class Bankaccountlist {
    BankID = 0;
    BankName = '';
    AccountNo = '';
    CurrencyName= '';
    IFSCCode = '';
    SwiftCode = null;
    StatusID = null;
    
}

export class BankFilter {
    BankName:String = null;
    AccountNo:String = '';
    Currency:String= '';
    IFSCCode:String = '';
    SwiftCode:String = '';
    IsActive:Number = 1;
    
}
export class Currency {
    CurrencyID = 0;
    CurrencyName = '';
    CountryID: "";
    CurrencyCode: "";
   
}
export class CurrencySearch {
    currencyId = 0;
    countryId=1;
}
export class Ledger {
    ChartOfAccountsId = 0;
    AccountName = '';
}
export class LedgerSearch {
    isJobAccount = 0;
}
export class Image_List {
    Not_Found_for_List: any = "assets/images/No_data_found.png";
}



   




