"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myDynamicIHCBrackupCharges = exports.myDynamicGridTHCCharges = exports.MyDynamicGridDOCharges = exports.MyDynamicGridIHC = exports.MyDynamicGridSlab = exports.MyDynamicGrid = exports.MYPortTariff = void 0;
var MYPortTariff = /** @class */ (function () {
    function MYPortTariff() {
        this.TID = 0;
        this.ID = 0;
        this.Name = "";
        this.PortTariffTypeID = 0;
        this.PrincibleID = 0;
        this.EffectiveDate = "";
        this.PortID = 0;
        this.TerminalID = 0;
        this.EquipmentTypeID = 0;
        this.ChargeID = 0;
        this.StartMoveID = 0;
        this.EndMove = 0;
        this.StatusID = 0;
        this.Remarks = "";
        this.Itemsv = "";
        this.ItemsSlab = "";
        this.AlertMegId = 0;
        this.AlertMessage = "";
        this.ShipmentType = "";
        this.ShipmentTypeID = 0;
        this.TariffTypeID = 0;
        this.TariffType = '';
        this.ChargeCode = '';
        this.ChargeCodeID = 0;
        this.Commodity = '';
        this.CommodityID = 0;
        this.BasisID = 0;
        this.Basis = '';
        this.CurrencyID = 0;
        this.Currency = '';
        this.ServiceType = '';
        this.ServiceTypeID = 0;
        this.Amount = 0;
        this.ISSlab = 0;
        this.ImpChargeID = 0;
        this.ExpChargeID = 0;
    }
    return MYPortTariff;
}());
exports.MYPortTariff = MYPortTariff;
var MyDynamicGrid = /** @class */ (function () {
    function MyDynamicGrid() {
        this.TID = 0;
        this.ShipmentType = '';
        this.ShipmentTypeID = 0;
        this.TariffType = '';
        this.TariffTypeID = 0;
        this.ChargeCode = '';
        this.ChargeCodeID = 0;
        this.Commodity = '';
        this.CommodityID = 0;
        this.BasisID = 0;
        this.Basis = '';
        this.CurrencyID = 0;
        this.Currency = '';
        this.ServiceType = '';
        this.ServiceTypeID = 0;
        this.Amount = 0;
        this.ISSlab = 0;
    }
    return MyDynamicGrid;
}());
exports.MyDynamicGrid = MyDynamicGrid;
var MyDynamicGridSlab = /** @class */ (function () {
    function MyDynamicGridSlab() {
        this.SLID = 0;
        this.SlabFrom = "";
        this.SlabTo = "";
        // Currency = "";
        this.CurrencyID = 0;
        this.Amount = 0.00;
    }
    return MyDynamicGridSlab;
}());
exports.MyDynamicGridSlab = MyDynamicGridSlab;
var MyDynamicGridIHC = /** @class */ (function () {
    function MyDynamicGridIHC() {
        this.SLID = 0;
        this.SlabFrom = "";
        this.SlabTo = "";
        this.CurrencyID = 0;
        this.RevenueAmount = "";
        this.CostAmount = "";
        this.LineAmount = "";
    }
    return MyDynamicGridIHC;
}());
exports.MyDynamicGridIHC = MyDynamicGridIHC;
var MyDynamicGridDOCharges = /** @class */ (function () {
    function MyDynamicGridDOCharges() {
        this.SLID = 0;
        this.SlabUpto = "";
        this.CurrencyID = 0;
        this.Amount = 0.00;
    }
    return MyDynamicGridDOCharges;
}());
exports.MyDynamicGridDOCharges = MyDynamicGridDOCharges;
var myDynamicGridTHCCharges = /** @class */ (function () {
    function myDynamicGridTHCCharges() {
        this.SLID = 0;
        this.ChargeCodeID = 0;
        this.CommodityID = 0;
        this.CurrencyID = 0;
        this.ShipmentID = 0;
        this.CntrType = 0;
        this.Amount = 0.00;
        this.ExRate = 0.00;
        this.LocalAmount = 0.00;
    }
    return myDynamicGridTHCCharges;
}());
exports.myDynamicGridTHCCharges = myDynamicGridTHCCharges;
var myDynamicIHCBrackupCharges = /** @class */ (function () {
    function myDynamicIHCBrackupCharges() {
        this.SLID = 0;
        this.ChargeCodeID = 0;
        this.PaymentTo = 0;
        this.Amount = "";
    }
    return myDynamicIHCBrackupCharges;
}());
exports.myDynamicIHCBrackupCharges = myDynamicIHCBrackupCharges;
//# sourceMappingURL=PortTariff.js.map