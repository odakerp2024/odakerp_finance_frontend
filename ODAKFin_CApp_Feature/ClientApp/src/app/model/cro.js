"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRODynamicGrid = exports.MyCro = void 0;
var MyCro = /** @class */ (function () {
    function MyCro() {
        this.ID = 0;
        this.SurveyorID = 0;
        this.ReleaseToID = 0;
        this.CRONo = '';
        this.ValidTill = '';
        this.CusRemarks = '';
        this.YardRemarks = '';
        this.PickUpDepotID = 0;
        this.StuffID = 0;
        this.Depot = '';
        this.StuffName = '';
        this.CheckCRO = 0;
        this.BkgID = 0;
    }
    return MyCro;
}());
exports.MyCro = MyCro;
var CRODynamicGrid = /** @class */ (function () {
    function CRODynamicGrid() {
        this.BID = 0;
        this.CntrTypeID = 0;
        this.BookingQty = '';
        this.RequiredQty = '';
    }
    return CRODynamicGrid;
}());
exports.CRODynamicGrid = CRODynamicGrid;
//# sourceMappingURL=cro.js.map