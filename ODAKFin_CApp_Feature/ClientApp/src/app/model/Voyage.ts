export class Voyage {
    ID = 0;
    VesselID = 0;
    PortID = 0;
    VoyageID = 0;
    ETA = '';
    ETD = '';
    ATA = '';
    ATD = '';
    VoyageNo = '';
    CutOffDate = '';
    RotationNo = '';
    EGMDate = '';
    EGMNo = '';
    IGMDate = '';
    IGMNo = '';
    AlertMessage = '';
}
export class VesselMaster {
    ID = 0;
    VesselName = '';
}
export class TerminalMaster {
    ID = 0;
    TerminalName = '';
    TID = 0;
    RotationNo = '';


}
export class PortMaster {
    ID = 0;

    PortName = '';

}
export class TerminalGrid {
    TID = 0;
    TerminalID = 0;
    RotationNo = '';
    TerminalName = '';
}
export class VoyageNoteTypeMaster {
    VoyageNoteTypes = '';
    ID = 0;
}
export class GridVoyageNoteMaster {
    NotesType = 0;
    NID = 0;
    Notes = '';
}
