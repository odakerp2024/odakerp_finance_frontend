export class TaxType {
	TaxTypeId: Number = 0;
	TaxTypeName = '';

	CountryId: Number = null;
	EffectiveDate = "";
	IsActive: boolean ;
	CreatedBy: Number = 1;
	UpdatedBy: Number;
	TaxCode: string = '';
	ShortName: String = '';
}
export class Associated {

	AssociatedTaxTypeId: Number = 0;
	TaxTypeId: Number = 0;
	AssociatedTaxTypeName: String = "";
	AssociatedTaxType: Number = 0;

}

export class AssociatedGLMappingDetails {

	ID = 0;
    TaxTypeId = 0;
    AssociatedtaxId = 0;
    TransactionType = 0;
    OfficeId = 0;
    AccountId = 0;
    SubLedgerId = 0;
    Status= false;
}