"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridVoyageNoteMaster = exports.VoyageNoteTypeMaster = exports.TerminalGrid = exports.TerminalMaster = exports.VesselMaster = exports.Voyage = void 0;
var Voyage = /** @class */ (function () {
    function Voyage() {
        this.ID = 0;
        this.VesselID = 0;
        this.PortID = 0;
        this.VoyageID = 0;
        this.ETA = '';
        this.ETD = '';
        this.ATA = '';
        this.ATD = '';
        this.VoyageNo = '';
        this.CutOffDate = '';
        this.RotationNo = '';
        this.EGMDate = '';
        this.EGMNo = '';
        this.IGMDate = '';
        this.IGMNo = '';
        this.AlertMessage = '';
    }
    return Voyage;
}());
exports.Voyage = Voyage;
var VesselMaster = /** @class */ (function () {
    function VesselMaster() {
        this.ID = 0;
        this.VesselName = '';
    }
    return VesselMaster;
}());
exports.VesselMaster = VesselMaster;
var TerminalMaster = /** @class */ (function () {
    function TerminalMaster() {
        this.ID = 0;
        this.TerminalName = '';
        this.TID = 0;
    }
    return TerminalMaster;
}());
exports.TerminalMaster = TerminalMaster;
var TerminalGrid = /** @class */ (function () {
    function TerminalGrid() {
        this.TID = 0;
        this.TerminalID = 0;
    }
    return TerminalGrid;
}());
exports.TerminalGrid = TerminalGrid;
var VoyageNoteTypeMaster = /** @class */ (function () {
    function VoyageNoteTypeMaster() {
        this.VoyageNoteTypes = '';
        this.ID = 0;
    }
    return VoyageNoteTypeMaster;
}());
exports.VoyageNoteTypeMaster = VoyageNoteTypeMaster;
var GridVoyageNoteMaster = /** @class */ (function () {
    function GridVoyageNoteMaster() {
        this.NotesType = 0;
        this.NID = 0;
        this.Notes = '';
    }
    return GridVoyageNoteMaster;
}());
exports.GridVoyageNoteMaster = GridVoyageNoteMaster;
//# sourceMappingURL=Voyage.js.map