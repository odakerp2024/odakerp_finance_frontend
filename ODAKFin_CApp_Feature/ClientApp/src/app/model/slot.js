"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridAttach = exports.SvSlot = exports.fileattach = exports.VOA = exports.Slot = void 0;
var Slot = /** @class */ (function () {
    function Slot() {
        this.VesselName = '';
        this.Voyage = 0;
        this.POD = '';
        this.ETA = '';
        this.ETD = '';
        this.Sailing = '';
        this.Tues = 0.0;
        this.MT = 0.0;
        this.Booking = 0;
        this.Pickup = 0;
        this.GateIn = 0;
        this.LoadOut = '';
    }
    return Slot;
}());
exports.Slot = Slot;
var VOA = /** @class */ (function () {
    function VOA() {
        this.VOA = '';
    }
    return VOA;
}());
exports.VOA = VOA;
var fileattach = /** @class */ (function () {
    function fileattach() {
        this.ID = 0;
        this.filenam = "";
    }
    return fileattach;
}());
exports.fileattach = fileattach;
var SvSlot = /** @class */ (function () {
    function SvSlot() {
        this.ID = 0;
        this.VesselName = "";
        this.Voyage = "";
        this.VOA = "";
        this.Tues = "";
        this.MT = "";
        this.Notes = "";
        this.Filenam = "";
        this.AlertMessage = "";
    }
    return SvSlot;
}());
exports.SvSlot = SvSlot;
var GridAttach = /** @class */ (function () {
    function GridAttach() {
        this.AttachName = '';
        this.AttachID = 0;
        this.AttachFile = '';
    }
    return GridAttach;
}());
exports.GridAttach = GridAttach;
//# sourceMappingURL=slot.js.map