"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myLandsideChargesDynamicGrid = exports.myTerminalHandlingDynamicGrid = exports.myFreightDynamicGrid = exports.mypricipalPort = exports.MYPrincipalTariff = void 0;
var MYPrincipalTariff = /** @class */ (function () {
    function MYPrincipalTariff() {
        this.ID = 0;
        this.SID = 0;
        this.RegID = 0;
        this.LineCode = "";
        this.LineName = "";
        this.CountryID = 0;
        this.CityID = 0;
        this.StateID = 0;
        this.PortID = 0;
        this.TaxGST = "";
        this.PinCode = "";
        this.Email = "";
        this.TelNo = "";
        this.Status = 0;
        this.Address = "";
        this.Note = "";
        this.AlertMessage = "";
        this.AlertMegId = "";
        this.TariffType = "";
        this.AgreementTypeID = "";
        this.CommissionTypeID = "";
        this.ShipmentTypeID = "";
        this.ChargeTypeID = "";
        this.TerminalID = "";
        this.CntrTypeID = "";
        this.Amount = "";
        this.CollectionAmt = "";
        this.CostAmt = "";
        this.DifferentAmt = "";
        this.DiffRemittanceAmt = "";
        this.CurrencyID = "";
    }
    return MYPrincipalTariff;
}());
exports.MYPrincipalTariff = MYPrincipalTariff;
var mypricipalPort = /** @class */ (function () {
    function mypricipalPort() {
        this.PortName = "";
        this.AgencyName = "";
    }
    return mypricipalPort;
}());
exports.mypricipalPort = mypricipalPort;
var myFreightDynamicGrid = /** @class */ (function () {
    function myFreightDynamicGrid() {
        this.SID = 0;
        this.AgreementTypeID = "";
        this.CommissionTypeID = "";
        this.ShipmentTypeID = "";
        this.ChargeTypeID = "";
        this.CurrencyID = "";
        this.CntrTypeID = "";
        this.Amount = "";
    }
    return myFreightDynamicGrid;
}());
exports.myFreightDynamicGrid = myFreightDynamicGrid;
var myTerminalHandlingDynamicGrid = /** @class */ (function () {
    function myTerminalHandlingDynamicGrid() {
        this.SID = 0;
        this.AgreementTypeID = "";
        this.CommissionTypeID = "";
        this.ShipmentTypeID = "";
        this.PortID = 0;
        this.TerminalID = "";
        this.ChargeTypeID = "";
        this.CurrencyID = "";
        this.CntrTypeID = "";
        this.CollectAmt = "";
        this.CostAmt = "";
        this.DifferenceAmt = "";
        this.DiffRemittanceAmt = "";
    }
    return myTerminalHandlingDynamicGrid;
}());
exports.myTerminalHandlingDynamicGrid = myTerminalHandlingDynamicGrid;
var myLandsideChargesDynamicGrid = /** @class */ (function () {
    function myLandsideChargesDynamicGrid() {
        this.SID = 0;
        this.AgreementTypeID = "";
        this.CommissionTypeID = "";
        this.ShipmentTypeID = "";
        this.PortID = 0;
        this.TerminalID = "";
        this.ChargeTypeID = "";
        this.CurrencyID = "";
        this.CntrTypeID = "";
        this.Amount = "";
    }
    return myLandsideChargesDynamicGrid;
}());
exports.myLandsideChargesDynamicGrid = myLandsideChargesDynamicGrid;
//# sourceMappingURL=PrincipalTraiff.js.map