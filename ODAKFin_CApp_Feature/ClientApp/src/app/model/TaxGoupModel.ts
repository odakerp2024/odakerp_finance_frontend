
export class TaxGroup{
   TaxGroup :TaxGroupModel = new TaxGroupModel();
}
export class TaxGroupModel {
   
    Table : TaxGroupBasic[]=[];
    Table1:TaxGroupBifurication[] =[];
    Table2:SalesTaxGroupBifurication[] =[];
    Table3:PurchasesTaxGroupBifurication[] =[];
    // Table4:Division[] =[];
    
   
 }
 export class TaxGroupBasic{
    TaxGroupId:Number=0;
    TaxGroupName:String="";
    TaxTypeId:Number=0;
    TaxRate:Number=0;
    IsActive:boolean=true;
    CreatedBy:Number=1;
    UpdatedBy:Number=0;
 }

 export class TaxGroupBifurication{
    TaxBifurcationId:Number=0;
    TaxGroupId:Number=0;
    AssociatedTaxTypeId:Number=0;
    TaxBifurcation:Number=0.0;
 }
 export class TaxGroupBifuricationLable{
   TaxBifurcationId:Number=0;
   TaxGroupId:Number=0;
   AssociatedTaxTypeId:Number=0;
   AssociatedTaxTypeLable:String='';
   TaxBifurcation:Number=0.0;
}
 export class SalesTaxGroupBifurication{
    TaxGroupAccountId:Number=0;
    TaxGroupAccountType:String="";
    TaxGroupId:Number=0;
    ChartOfAccountsId:Number=0.0;
 }
 export class PurchasesTaxGroupBifurication{
    TaxGroupAccountDetailId:Number=0;
    TaxGroupAccountType:String="";
    TaxGroupId:Number=0;
    AssociatedTaxTypeId:Number=0;
    TaxGroupAccountDetail:Number=0.0;
 }
 export class TaxGroupIdModel{
   TaxGroupId:Number=0;
}