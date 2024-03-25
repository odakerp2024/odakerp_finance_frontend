export class Charges {
    ChargesId = 0;
    ChargeName = "";
    SACCode = 0;
    GSTGroup = 0;
    Division = 0;
    IsActive = false;
    Status = '';
}

export class DynamicGridColumn {
    MappingFFDivisionId = 0;
    ID = 0;
    ActivityId = 0;
    TransactionType = 0;
    WIP = 0;
    ProvisionAccountId = 0;
    ActualAccountId = 0;
    EffectiveDate = 0;
    Status= 'true';
    IsSelected = 0;
    Activity: '';
    TransactionTypeName: '';
    WIPName: '';
    ProvisionAccount: '';
    ActualAccount: '';
    StatusName: '';
}

export class DynamicOtherDivisionColumn {
    MappingFFDivisionId = 0;
    ID = 0;
    DivisionId = 0;
    TransactionType = 0;
    WIP = 0;
    ProvisionAccountId = 0;
    ActualAccountId = 0;
    EffectiveDate = 0;
    Status= 'true';
    IsSelected = 0;
    Division: '';
    TransactionTypeName: '';
    WIPName: '';
    ProvisionAccount: '';
    ActualAccount: '';
    StatusName: '';
}


export class ChargesList {
    Table: BasicchargesDetails[] = [];
    Table1: chargesDetails[] = [];
    Table2: linkOtherDivisionDetails[] = [];
}

export class chargesModel {
    charges: ChargesList = new ChargesList()
}

export class BasicchargesDetails {
    ChargesId = 0;
    ChargeName = '';
    SACID = '';
    // GSTGroupID: '';
    DivisionID = '';
    IsActive = false;
    TaxGroupID = '';
    ShortName = '';
    ChargeCode = '';
}

export class chargesDetails {

    MappingFFDivisionId = 0;
    ID = 0;
    ActivityId = 0;
    TransactionType = 0;
    WIP = 0;
    ProvisionAccountId = 0;
    ActualAccountId = 0;
    EffectiveDate = 0;
    Status= false;
    IsSelected = 0
}
export class linkOtherDivisionDetails {

    MappingFFDivisionId = 0;
    ID = 0;
    DivisionId = 0;
    TransactionType = 0;
    WIP = 0;
    ProvisionAccountId = 0;
    ActualAccountId = 0;
    EffectiveDate = 0;
    Status= false;
    IsSelected = 0
}
