export class creditModel {
    CreditManagement: Credit = new Credit();
}

export class Credit {
    Table: Table[] = [];
    Table1: Table1[] = [];
    Table2: Table2[] = [];
    Table3: Table3[] = [];
    Table4: Table4[] = [];

}

export class Table {
    DivisionId: Number = 0;
    CASDivisionId: Number = 0;
}

export class Table1 {
    CreditApprovalSetupId: Number = 0;
    MaxCreditDays: Number = 0;
    MaxCreditAmount: Number = 0;
    EffectiveDate: Date = new Date();
    CreatedBy: Number = 0;
    CreatedDate: Date = new Date();
    UpdatedBy: Number = 0;
    UpdatedDate: Date = new Date();
    CASDivisionId: Number = 0;
}

export class Table2 {
    Id: Number = 0;
    CreditApprovalSetupId: Number = 0;
    ApprovalMethodId: Number = 0;
    WorkflowEventId: Number = 0;
    EffectiveDate: Date = new Date();
    CASDivisionId: Number = 0;
}

export class Table3 {
    Id: Number = 0;
    CreditApprovalSetupId: Number = 0;
    DocumentType: String = '';
    CASDivisionId: Number = 0;
}

export class Table4 {
    Id: Number = 0;
    CreditApprovalSetupId: Number = 0;
    Description: String = '';
    CASDivisionId: Number = 0;
}