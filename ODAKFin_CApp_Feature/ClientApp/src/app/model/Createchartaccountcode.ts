export class Maninaccountlabel {
    
    SubAccountGroupId= 0;
	SubAccountGroupName:String ="";
	MainAccountGroupName:String="";
	MainAccountGroupId :Number= null;
	data:COAConfigurationModel[]=[];
}
export class ManinaccountlabelListItem {
    
    SubAccountGroupId= 0;
	SubAccountGroupName:String ="";
	MainAccountGroupName:String="";
	MainAccountGroupId :Number= null;
	SequenceNo:Number=0;
	NumberOfDigits:Number=0;
	StartingNumber:Number=0;
}
export class SaveCOAConfiguration{
	COAConfiguration :COAConfigurationModel[]=[];
}
export class COAConfigurationModel{
	SubAccountGroupID:Number=0;
	SequenceNo:Number=0;
	NumberOfDigits:Number=0;
	StartingNumber:Number=0;

}
