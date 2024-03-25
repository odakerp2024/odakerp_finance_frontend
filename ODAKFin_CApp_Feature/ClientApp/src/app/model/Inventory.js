"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodes = exports.DynamicGridStatus = exports.Inventory = void 0;
var Inventory = /** @class */ (function () {
    function Inventory() {
        this.ID = 0;
        this.CntrType = '';
        this.Size = '';
        this.GeneralName = '';
        this.LineName = '';
        this.PortName = '';
        this.CntrNo = '';
        this.TypeID = 0;
        this.ISOCode = '';
        this.ModuleID = 0;
        this.LineID = 0;
        this.StatusID = 0;
        this.Remarks = 0;
        this.IsPickUp = 0;
        this.PickUpLocID = 0;
        this.PickUpDate = '';
        this.PickUpRef = '';
        this.IsDropOff = 0;
        this.DropOffLocID = 0;
        this.DropOffDate = '';
        this.DropOffRef = '';
        this.StatusDescription = '';
    }
    return Inventory;
}());
exports.Inventory = Inventory;
var DynamicGridStatus = /** @class */ (function () {
    function DynamicGridStatus() {
        this.SID = 0;
        this.ToStatus = '';
        this.ToStatusID = 0;
        //ToStatusDescription = ''
    }
    return DynamicGridStatus;
}());
exports.DynamicGridStatus = DynamicGridStatus;
var StatusCodes = /** @class */ (function () {
    function StatusCodes() {
        this.ID = 0;
        this.Status = '';
        this.StatusDescription = '';
        this.StatusID = 0;
        this.ValidVslVoy = 0;
        this.ValidNextLoc = 0;
        this.ValidTransMode = 0;
        this.ValidDepot = 0;
        this.ValidBL = 0;
        this.ValidCustomer = 0;
        this.ValidTerminal = 0;
    }
    return StatusCodes;
}());
exports.StatusCodes = StatusCodes;
//# sourceMappingURL=Inventory.js.map