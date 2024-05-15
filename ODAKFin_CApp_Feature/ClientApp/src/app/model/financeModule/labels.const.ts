
interface wfListObj{
    EVENT_NO:string,
    PARAMS:any,
    CALLBACK_METHOD:string,
    apiEndPoint:string
  }

export const WF_EVENTS:{ [key: string]: wfListObj }= {

    customerApproval: {
        EVENT_NO: "EFI038",
        PARAMS: {
            Division:"Division",
            Category:"Category",
            Country:"Country",
            Created_by:"Created By",
          },
        CALLBACK_METHOD: "CustomerApproval",
        apiEndPoint: "/user/CustomerBranchConfirmUpdate"
    },

    creditApp: {
      EVENT_NO: "EFI039",
      PARAMS: {
          Division:"Division",
          Office:"Office",
          CreditAmount:"Credit Amount",
          CreditDays:"Credit Days",
          SalesPerson:"Sales Person",
        },
      CALLBACK_METHOD: "CreditApproval",
      apiEndPoint: "/user/CreditAppConfirmUpdate"
  },
}

export interface workflowEventObj{
    "eventnumber":String
    "eventvalue":String,
    "app":String,
    "office": String,
    "division": String,
    "customername": String,
    "eventdata":{"param1":String,"param2":String,"param3":String,"param4":String,"param5":String}
    "Initiator":{"usertype":String,"userid":String}
    "callbackURL":String
    "callbackURLcontent":String
    "redirectURL": String
}