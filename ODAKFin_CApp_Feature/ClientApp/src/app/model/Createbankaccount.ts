export class Bank {

	BankID: Number = 0;
	BankName = '';
	CountryID: Number = 0;
	CurrencyID: Number = 0;
	AccountNo: '';
	IFSCCode = '';
	BranchName = '';
	BranchAddress = '';
	SwiftCode: Number = null;
	GLCodeID: Number = null;
	StatusID = 0;
	EffectiveDate: String = "";
	BankAccountCode?: string = '';
	ShortName?: string = '';
	DivisionIds =  [];
	OfficeIds =  [];
	LedgerMappingId = 0;
	IsBank: false;
	IsCash: false;
}

export class Cheque {

	BankChequeID = 0;
	BankID: Number = 0;
	IsChequePrinting: boolean = false;
	DateOfStart: String = '';
	BookName: String = '';
	FromNumber: Number = null;
	ToNumber: Number = null;
	TotalCheques: Number = null;
}

export class Attachment {

  BankAttachmentsID: Number = 0;
	BankID: Number = 0;
  SlNo: Number = 0;
  DocumentName: String = "";
  DateOfStart = '';
	FilePath: String = "";
	UniqueFilePath: String = "";
}

export class Statement {

	BankStatementID: Number = 0;
	BankID: Number = 0;
	ID: Number = 0;
	FieldsName: String = "";
	OrderNo: Number = 0;
	DisplayName: String = "";
  TemplateId: Number = 0;
  EffectiveDate: String = "";

}
