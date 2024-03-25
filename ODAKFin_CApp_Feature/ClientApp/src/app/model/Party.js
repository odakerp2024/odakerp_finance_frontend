"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = exports.GSTList = exports.BranchList = exports.PartyAttachType = exports.DynamicGridAttach = exports.DynamicGridAlert = exports.DynamicGridCr = exports.DynamicGridAcc = exports.DynamicGridVendorAcc = exports.DynamicGridParty = exports.Party = exports.BusinessTypes = void 0;
var BusinessTypes = /** @class */ (function () {
    function BusinessTypes() {
        this.ID = 0;
        this.BusinessType = '';
        this.IsTrue = 0;
    }
    return BusinessTypes;
}());
exports.BusinessTypes = BusinessTypes;
var Party = /** @class */ (function () {
    function Party() {
        this.ID = 0;
        this.BID = 0;
        this.CustomerName = '';
        this.CountryID = 0;
        this.Itemsv1 = '';
        this.BusinessType = '';
        this.Country = '';
        this.IsNVOCC = 0;
        this.IsFF = 0;
        this.cusID = 0;
        this.DivisionDetails = '';
    }
    return Party;
}());
exports.Party = Party;
var DynamicGridParty = /** @class */ (function () {
    function DynamicGridParty() {
        this.CID = 0;
        this.LocBranch = '';
        this.CityID = 0;
        this.City = '';
        this.StateID = 0;
        this.State = '';
        this.TelNo = '';
        this.PinCode = '';
        this.EmailID = '';
        this.PIC = '';
        this.Address = '';
        this.StatusID = 0;
        this.StatusResult = '';
        //PanNo = '';
        //TanNo = '';
    }
    return DynamicGridParty;
}());
exports.DynamicGridParty = DynamicGridParty;
var DynamicGridVendorAcc = /** @class */ (function () {
    function DynamicGridVendorAcc() {
        this.ID = 0;
        this.BranchID = 0;
        this.Branch = '';
        this.GSTListID = 0;
        this.GSTNo = '';
        this.Legalname = '';
        this.PAN = '';
        this.TAN = '';
        this.POSID = 0;
        this.POS = '';
        this.CurrID = 0;
        this.CurrencyCode = '';
        this.TDS = 0;
        this.TDSType = '';
    }
    return DynamicGridVendorAcc;
}());
exports.DynamicGridVendorAcc = DynamicGridVendorAcc;
var DynamicGridAcc = /** @class */ (function () {
    function DynamicGridAcc() {
        this.ID = 0;
        this.BranchID = 0;
        this.Branch = '';
        this.GSTListID = 0;
        this.GSTNo = '';
        this.Legalname = '';
        this.PAN = '';
        this.TAN = '';
        this.POSID = 0;
        this.POS = '';
        this.CurrID = 0;
        this.CurrencyCode = '';
    }
    return DynamicGridAcc;
}());
exports.DynamicGridAcc = DynamicGridAcc;
var DynamicGridCr = /** @class */ (function () {
    function DynamicGridCr() {
        this.ID = 0;
        this.BranchID = 0;
        this.Branch = '';
        this.CreditDays = '';
        this.ApprovedBy = 0;
        this.ApprovedName = '';
        this.EffectiveDate = '';
        this.StatusCrID = 0;
        this.StatusV = '';
    }
    return DynamicGridCr;
}());
exports.DynamicGridCr = DynamicGridCr;
var DynamicGridAlert = /** @class */ (function () {
    function DynamicGridAlert() {
        this.ID = 0;
        this.BranchID = 0;
        this.Branch = '';
        this.AlertTypeID = 0;
        this.AlertType = '';
        this.EmailAlertID = '';
    }
    return DynamicGridAlert;
}());
exports.DynamicGridAlert = DynamicGridAlert;
var DynamicGridAttach = /** @class */ (function () {
    function DynamicGridAttach() {
        this.AttachName = '';
        this.AttachID = 0;
        this.AttachFile = '';
    }
    return DynamicGridAttach;
}());
exports.DynamicGridAttach = DynamicGridAttach;
var PartyAttachType = /** @class */ (function () {
    function PartyAttachType() {
        this.ID = 0;
        this.GeneralName = '';
    }
    return PartyAttachType;
}());
exports.PartyAttachType = PartyAttachType;
var BranchList = /** @class */ (function () {
    function BranchList() {
        this.CID = 0;
        this.Branch = '';
    }
    return BranchList;
}());
exports.BranchList = BranchList;
var GSTList = /** @class */ (function () {
    function GSTList() {
        this.ID = 0;
        this.GSTINTax = '';
    }
    return GSTList;
}());
exports.GSTList = GSTList;
var Currency = /** @class */ (function () {
    function Currency() {
        this.ID = 0;
        this.CurrencyCode = '';
    }
    return Currency;
}());
exports.Currency = Currency;
//# sourceMappingURL=Party.js.map