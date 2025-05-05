namespace ja2 {

    const ARROWS_X_OFFSET = 10;
    const ARROWS_HEIGHT = 20;
    const ARROWS_WIDTH = 20;
    const UPARROW_Y_OFFSET = -30;
    const DOWNARROW_Y_OFFSET = -10;

    const BUTTON_PANEL_WIDTH = 78;
    const BUTTON_PANEL_HEIGHT = 76;

    export let gfInMovementMenu: boolean = false;
    let giMenuAnchorX: INT32;
    let giMenuAnchorY: INT32;

    const PROG_BAR_START_X = 5;
    const PROG_BAR_START_Y = 2;
    const PROG_BAR_LENGTH = 627;

    let gfProgBarActive: boolean = false;
    let gubProgNumEnemies: UINT8 = 0;
    let gubProgCurEnemy: UINT8 = 0;

    interface TOP_MESSAGE {
        uiSurface: UINT32;
        bCurrentMessage: INT8;
        uiTimeOfLastUpdate: UINT32;
        uiTimeSinceLastBeep: UINT32;
        bAnimate: INT8;
        bYPos: INT8;
        fCreated: boolean;
        sWorldRenderX: INT16;
        sWorldRenderY: INT16;
    }

    function createTopMessage(): TOP_MESSAGE {
        return {
            uiSurface: 0,
            bCurrentMessage: 0,
            uiTimeOfLastUpdate: 0,
            uiTimeSinceLastBeep: 0,
            bAnimate: 0,
            bYPos: 0,
            fCreated: false,
            sWorldRenderX: 0,
            sWorldRenderY: 0,
        };
    }

    let gTopMessage: TOP_MESSAGE = createTopMessage();
    export let gfTopMessageDirty: boolean = false;

    let gMenuOverlayRegion: MOUSE_REGION = createMouseRegion();

    export let gusOldSelectedSoldier: UINT16 = NO_SOLDIER;

// OVerlay ID
    let giPopupSlideMessageOverlay: INT32 = -1;
    let gusOverlayPopupBoxWidth: UINT16;
    let gusOverlayPopupBoxWidth__Pointer = createPointer(() => gusOverlayPopupBoxWidth, (v) => gusOverlayPopupBoxWidth = v);
    let gusOverlayPopupBoxHeight: UINT16;
    let gusOverlayPopupBoxHeight__Pointer = createPointer(() => gusOverlayPopupBoxHeight, (v) => gusOverlayPopupBoxHeight = v);
    let gpOverrideMercBox: MercPopUpBox = createMercPopUpBox();

    export let giUIMessageOverlay: INT32 = -1;
    let gusUIMessageWidth: UINT16;
    let gusUIMessageWidth__Pointer = createPointer(() => gusUIMessageWidth, (v) => gusUIMessageWidth = v);
    let gusUIMessageHeight: UINT16;
    let gusUIMessageHeight__Pointer = createPointer(() => gusUIMessageHeight, (v) => gusUIMessageHeight = v);
    let gpUIMessageOverrideMercBox: MercPopUpBox = createMercPopUpBox();
    export let guiUIMessageTime: UINT32 = 0;
    let iOverlayMessageBox: INT32 = -1;
    let iUIMessageBox: INT32 = -1;
    export let guiUIMessageTimeDelay: UINT32 = 0;
    let gfUseSkullIconMessage: boolean = false;

    let gfPanelAllocated: boolean = false;

    const enum Enum208 {
        WALK_IMAGES = 0,
        SNEAK_IMAGES,
        RUN_IMAGES,
        CRAWL_IMAGES,
        LOOK_IMAGES,
        TALK_IMAGES,
        HAND_IMAGES,
        CANCEL_IMAGES,

        TARGETACTIONC_IMAGES,
        KNIFEACTIONC_IMAGES,
        AIDACTIONC_IMAGES,
        PUNCHACTIONC_IMAGES,
        BOMBACTIONC_IMAGES,

        OPEN_DOOR_IMAGES,
        EXAMINE_DOOR_IMAGES,
        LOCKPICK_DOOR_IMAGES,
        BOOT_DOOR_IMAGES,
        CROWBAR_DOOR_IMAGES,
        USE_KEY_IMAGES,
        USE_KEYRING_IMAGES,
        EXPLOSIVE_DOOR_IMAGES,

        TOOLKITACTIONC_IMAGES,
        WIRECUTACTIONC_IMAGES,

        NUM_ICON_IMAGES,
    }

    let iIconImages: INT32[] /* [NUM_ICON_IMAGES] */ = createArray(Enum208.NUM_ICON_IMAGES, 0);

    const enum Enum209 {
        WALK_ICON,
        SNEAK_ICON,
        RUN_ICON,
        CRAWL_ICON,
        LOOK_ICON,
        ACTIONC_ICON,
        TALK_ICON,
        HAND_ICON,

        OPEN_DOOR_ICON,
        EXAMINE_DOOR_ICON,
        LOCKPICK_DOOR_ICON,
        BOOT_DOOR_ICON,
        UNTRAP_DOOR_ICON,
        USE_KEY_ICON,
        USE_KEYRING_ICON,
        EXPLOSIVE_DOOR_ICON,
        USE_CROWBAR_ICON,

        CANCEL_ICON,
        NUM_ICONS,
    }

    let iActionIcons: INT32[] /* [NUM_ICONS] */ = createArray(Enum209.NUM_ICONS, 0);

// GLOBAL INTERFACE SURFACES
    export let guiRENDERBUFFER: UINT32;
    export let guiINTEXT: UINT32;
    export let guiCLOSE: UINT32;
    export let guiDEAD: UINT32;
    export let guiHATCH: UINT32;
    export let guiGUNSM: UINT32;
    export let guiP1ITEMS: UINT32;
    export let guiP2ITEMS: UINT32;
    export let guiP3ITEMS: UINT32;
    let guiBUTTONBORDER: UINT32;
    export let guiRADIO: UINT32;
    let guiRADIO2: UINT32;
    export let guiCOMPANEL: UINT32;
    export let guiCOMPANELB: UINT32;
    let guiAIMCUBES: UINT32;
    let guiAIMBARS: UINT32;
    export let guiVEHINV: UINT32;
    export let guiBURSTACCUM: UINT32;
    let guiITEMPOINTERHATCHES: UINT32;

// UI Globals
    export let gViewportRegion: MOUSE_REGION = createMouseRegion();
    export let gRadarRegion: MOUSE_REGION = createMouseRegion();
    export let gBottomPanalRegion: MOUSE_REGION = createMouseRegion();

    let gsUpArrowX: UINT16;
    let gsUpArrowY: UINT16;
    let gsDownArrowX: UINT16;
    let gsDownArrowY: UINT16;

    let giUpArrowRect: UINT32 = 0;
    let giDownArrowRect: UINT32 = 0;

    export let fFirstTimeInGameScreen: boolean = true;
    export let fInterfacePanelDirty: UINT8 = DIRTYLEVEL2;
    export let fInterfacePanelDirty__Pointer = createPointer(() => fInterfacePanelDirty, (v) => fInterfacePanelDirty = v);
    export let gsInterfaceLevel: INT16 = Enum214.I_GROUND_LEVEL;
    let gsCurrentSoldierGridNo: INT16 = 0;
    export let gsCurInterfacePanel: INT16 = Enum215.TEAM_PANEL;

    export function InitializeTacticalInterface(): boolean {
        let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
        let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

        // Load button Interfaces
        iIconImages[Enum208.WALK_IMAGES] = LoadButtonImage("INTERFACE\\newicons3.sti", -1, 3, 4, 5, -1);
        iIconImages[Enum208.SNEAK_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 6, 7, 8, -1);
        iIconImages[Enum208.RUN_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 0, 1, 2, -1);
        iIconImages[Enum208.CRAWL_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 9, 10, 11, -1);
        iIconImages[Enum208.LOOK_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 12, 13, 14, -1);
        iIconImages[Enum208.TALK_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 21, 22, 23, -1);
        iIconImages[Enum208.HAND_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 18, 19, 20, -1);
        iIconImages[Enum208.CANCEL_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 15, 16, 17, -1);

        iIconImages[Enum208.TARGETACTIONC_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 24, 25, 26, -1);
        iIconImages[Enum208.KNIFEACTIONC_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 27, 28, 29, -1);
        iIconImages[Enum208.AIDACTIONC_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 30, 31, 32, -1);
        iIconImages[Enum208.PUNCHACTIONC_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 33, 34, 35, -1);
        iIconImages[Enum208.BOMBACTIONC_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 36, 37, 38, -1);
        iIconImages[Enum208.TOOLKITACTIONC_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 39, 40, 41, -1);
        iIconImages[Enum208.WIRECUTACTIONC_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.WALK_IMAGES], -1, 42, 43, 44, -1);

        iIconImages[Enum208.OPEN_DOOR_IMAGES] = LoadButtonImage("INTERFACE\\door_op2.sti", -1, 9, 10, 11, -1);
        iIconImages[Enum208.EXAMINE_DOOR_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.OPEN_DOOR_IMAGES], -1, 12, 13, 14, -1);
        iIconImages[Enum208.LOCKPICK_DOOR_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.OPEN_DOOR_IMAGES], -1, 21, 22, 23, -1);
        iIconImages[Enum208.BOOT_DOOR_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.OPEN_DOOR_IMAGES], -1, 25, 26, 27, -1);
        iIconImages[Enum208.CROWBAR_DOOR_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.OPEN_DOOR_IMAGES], -1, 0, 1, 2, -1);
        iIconImages[Enum208.USE_KEY_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.OPEN_DOOR_IMAGES], -1, 3, 4, 5, -1);
        iIconImages[Enum208.USE_KEYRING_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.OPEN_DOOR_IMAGES], -1, 6, 7, 8, -1);
        iIconImages[Enum208.EXPLOSIVE_DOOR_IMAGES] = UseLoadedButtonImage(iIconImages[Enum208.OPEN_DOOR_IMAGES], -1, 15, 16, 17, -1);

        // Load interface panels
        vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;

        // failing the CHECKF after this will cause you to lose your mouse

        if (GETPIXELDEPTH() == 8) {
            vs_desc.ImageFile = "INTERFACE\\IN_TEXT_8.pcx";
        } else if (GETPIXELDEPTH() == 16) {
            vs_desc.ImageFile = "INTERFACE\\IN_TEXT.STI";
        }

        if ((guiINTEXT = AddVideoSurface(vs_desc)) === -1)
            AssertMsg(false, "Missing INTERFACE\\In_text.sti");
        SetVideoSurfaceTransparency(guiINTEXT, FROMRGB(255, 0, 0));

        // LOAD CLOSE ANIM
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\p_close.sti");
        if (!(guiCLOSE = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\p_close.sti");

        // LOAD DEAD ANIM
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\p_dead.sti");
        if (!(guiDEAD = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\p_dead.sti");

        // LOAD HATCH
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\hatch.sti");
        if (!(guiHATCH = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\hatch.sti");

        // LOAD INTERFACE GUN PICTURES
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\mdguns.sti");
        if (!(guiGUNSM = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\mdguns.sti");

        // LOAD INTERFACE ITEM PICTURES
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\mdp1items.sti");
        if (!(guiP1ITEMS = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\mdplitems.sti");

        // LOAD INTERFACE ITEM PICTURES
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\mdp2items.sti");
        if (!(guiP2ITEMS = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\mdp2items.sti");

        // LOAD INTERFACE ITEM PICTURES
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\mdp3items.sti");
        if (!(guiP3ITEMS = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\mdp3items.sti");

        // LOAD INTERFACE BUTTON BORDER
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\button_frame.sti");
        if (!(guiBUTTONBORDER = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\button_frame.sti");

        // LOAD AIM CUBES
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\aimcubes.sti");
        if (!(guiAIMCUBES = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\aimcubes.sti");

        // LOAD AIM BARS
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\aimbars.sti");
        if (!(guiAIMBARS = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\aimbars.sti");

        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\inventor.sti");
        if (!(guiVEHINV = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\inventor.sti");

        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\burst1.sti");
        if (!(guiBURSTACCUM = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\burst1.sti");

        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\portraiticons.sti");
        if (!(guiPORTRAITICONS = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\portraiticons.sti");

        // LOAD RADIO
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\radio.sti");

        if (!(guiRADIO = AddVideoObject(VObjectDesc)))
            //	AssertMsg(0, "Missing INTERFACE\\bracket.sti" );
            AssertMsg(0, "Missing INTERFACE\\radio.sti");

        // LOAD RADIO2
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\radio2.sti");
        if (!(guiRADIO2 = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\radio2.sti");

        // LOAD com panel 2
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\communicationpopup.sti");
        if (!(guiCOMPANEL = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\communicationpopup.sti");

        // LOAD ITEM GRIDS....
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\itemgrid.sti");
        if (!(guiITEMPOINTERHATCHES = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\itemgrid.sti");

        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\communicationpopup_2.sti");
        if (!(guiCOMPANELB = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\communicationpopup_2.sti");

        // Alocate message surfaces
        vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
        vs_desc.usWidth = 640;
        vs_desc.usHeight = 20;
        vs_desc.ubBitDepth = 16;
        if ((gTopMessage.uiSurface = AddVideoSurface(vs_desc)) === -1) {
            return false;
        }

        InitItemInterface();

        InitRadarScreen();

        InitTEAMSlots();

        // Init popup box images
        //	CHECKF( LoadTextMercPopupImages( BASIC_MERC_POPUP_BACKGROUND, BASIC_MERC_POPUP_BORDER ) );

        return true;
    }

    function ShutdownTacticalInterface(): boolean {
        ShutdownCurrentPanel();

        return true;
    }

    export function InitializeCurrentPanel(): boolean {
        let fOK: boolean = false;

        MoveRadarScreen();

        switch (gsCurInterfacePanel) {
            case Enum215.SM_PANEL:
                // Set new viewport
                gsVIEWPORT_WINDOW_END_Y = 340;

                // Render full
                SetRenderFlags(RENDER_FLAG_FULL);
                fOK = InitializeSMPanel();
                break;

            case Enum215.TEAM_PANEL:
                gsVIEWPORT_WINDOW_END_Y = 360;
                // Render full
                SetRenderFlags(RENDER_FLAG_FULL);
                fOK = InitializeTEAMPanel();
                break;
        }

        //	RefreshMouseRegions( );
        gfPanelAllocated = true;

        return fOK;
    }

    export function ShutdownCurrentPanel(): void {
        if (gfPanelAllocated) {
            switch (gsCurInterfacePanel) {
                case Enum215.SM_PANEL:
                    ShutdownSMPanel();
                    break;

                case Enum215.TEAM_PANEL:
                    ShutdownTEAMPanel();
                    break;
            }

            gfPanelAllocated = false;
        }
    }

    export function SetCurrentTacticalPanelCurrentMerc(ubID: UINT8): void {
        let pSoldier: SOLDIERTYPE;

        // Disable faces
        SetAllAutoFacesInactive();

        if (gsCurInterfacePanel == Enum215.SM_PANEL) {
            // If we are not of merc bodytype, or am an epc, and going into inv, goto another....
            pSoldier = MercPtrs[ubID];

            if (!IS_MERC_BODY_TYPE(pSoldier) || AM_AN_EPC(pSoldier)) {
                SetCurrentInterfacePanel(Enum215.TEAM_PANEL);
            }
        }

        switch (gsCurInterfacePanel) {
            case Enum215.SM_PANEL:
                // SetSMPanelCurrentMerc( ubID );
                gubSelectSMPanelToMerc = ubID;
                break;

            case Enum215.TEAM_PANEL:
                SetTEAMPanelCurrentMerc(gusSelectedSoldier);
                break;
        }
    }

    export function CreateCurrentTacticalPanelButtons(): void {
        switch (gsCurInterfacePanel) {
            case Enum215.SM_PANEL:
                CreateSMPanelButtons();
                break;

            case Enum215.TEAM_PANEL:
                CreateTEAMPanelButtons();
                break;
        }
    }

    export function SetCurrentInterfacePanel(ubNewPanel: UINT8): void {
        ShutdownCurrentPanel();

        // INit new panel
        gsCurInterfacePanel = ubNewPanel;

        InitializeCurrentPanel();
    }

    export function ToggleTacticalPanels(): void {
        gfSwitchPanel = true;
        gubNewPanelParam = gusSelectedSoldier;

        if (gsCurInterfacePanel == Enum215.SM_PANEL) {
            gbNewPanel = Enum215.TEAM_PANEL;
        } else {
            gbNewPanel = Enum215.SM_PANEL;
        }
    }

    export function RemoveCurrentTacticalPanelButtons(): void {
        switch (gsCurInterfacePanel) {
            case Enum215.SM_PANEL:
                RemoveSMPanelButtons();
                break;

            case Enum215.TEAM_PANEL:
                RemoveTEAMPanelButtons();
                break;
        }
    }

    export function IsMercPortraitVisible(ubSoldierID: UINT8): boolean {
        if (gsCurInterfacePanel == Enum215.TEAM_PANEL) {
            return true;
        }

        if (gsCurInterfacePanel == Enum215.SM_PANEL) {
            if (GetSMPanelCurrentMerc() == ubSoldierID) {
                return true;
            }
        }

        return false;
    }

    export function HandleInterfaceBackgrounds(): void {
        HandleUpDownArrowBackgrounds();
    }

    function PopupPositionMenu(pUIEvent: Pointer<UI_EVENT>): void {
    }

    function PopDownPositionMenu(): void {
    }

    function BtnPositionCallback(btn: GUI_BUTTON, reason: INT32): void {
    }

    export function PopupMovementMenu(pUIEvent: UI_EVENT): void {
        let pSoldier: SOLDIERTYPE = <SOLDIERTYPE><unknown>null;
        let iMenuAnchorX: INT32;
        let iMenuAnchorY: INT32;
        let uiActionImages: UINT32;
        let zActionString: string /* INT16[50] */;
        let fDisableAction: boolean = false;

        // Erase other menus....
        EraseInterfaceMenus(true);

        giMenuAnchorX = gusMouseXPos - 18;
        giMenuAnchorY = gusMouseYPos - 18;

        // ATE: OK loser, let's check if we're going off the screen!
        if (giMenuAnchorX < 0) {
            giMenuAnchorX = 0;
        }

        if (giMenuAnchorY < 0) {
            giMenuAnchorY = 0;
        }

        // Create mouse region over all area to facilitate clicking to end
        MSYS_DefineRegion(gMenuOverlayRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST - 1, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, MovementMenuBackregionCallback);
        // Add region
        MSYS_AddRegion(gMenuOverlayRegion);

        // OK, CHECK FOR BOUNDARIES!
        if ((giMenuAnchorX + BUTTON_PANEL_WIDTH) > 640) {
            giMenuAnchorX = (640 - BUTTON_PANEL_WIDTH);
        }
        if ((giMenuAnchorY + BUTTON_PANEL_HEIGHT) > gsVIEWPORT_WINDOW_END_Y) {
            giMenuAnchorY = (gsVIEWPORT_WINDOW_END_Y - BUTTON_PANEL_HEIGHT);
        }

        if (gusSelectedSoldier != NOBODY) {
            pSoldier = MercPtrs[gusSelectedSoldier];
        }

        // Blit background!
        // BltVideoObjectFromIndex( FRAME_BUFFER, guiBUTTONBORDER, 0, iMenuAnchorX, iMenuAnchorY, VO_BLT_SRCTRANSPARENCY, NULL );

        iMenuAnchorX = giMenuAnchorX + 9;
        iMenuAnchorY = giMenuAnchorY + 8;

        iActionIcons[Enum209.RUN_ICON] = QuickCreateButton(iIconImages[Enum208.RUN_IMAGES], (iMenuAnchorX + 20), (iMenuAnchorY), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnMovementCallback);
        if (iActionIcons[Enum209.RUN_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }
        SetButtonFastHelpText(iActionIcons[Enum209.RUN_ICON], pTacticalPopupButtonStrings[Enum209.RUN_ICON]);
        // SetButtonSavedRect( iActionIcons[ RUN_ICON ] );
        ButtonList[iActionIcons[Enum209.RUN_ICON]].UserData[0] = pUIEvent;

        if (MercInWater(pSoldier) || (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.uiStatusFlags & SOLDIER_ROBOT)) {
            DisableButton(iActionIcons[Enum209.RUN_ICON]);
        }

        iActionIcons[Enum209.WALK_ICON] = QuickCreateButton(iIconImages[Enum208.WALK_IMAGES], (iMenuAnchorX + 40), (iMenuAnchorY), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnMovementCallback);
        if (iActionIcons[Enum209.WALK_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }
        // SetButtonSavedRect( iActionIcons[ WALK_ICON ] );

        if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
            SetButtonFastHelpText(iActionIcons[Enum209.WALK_ICON], TacticalStr[Enum335.DRIVE_POPUPTEXT]);
        } else {
            SetButtonFastHelpText(iActionIcons[Enum209.WALK_ICON], pTacticalPopupButtonStrings[Enum209.WALK_ICON]);
        }

        ButtonList[iActionIcons[Enum209.WALK_ICON]].UserData[0] = pUIEvent;

        if (pSoldier.uiStatusFlags & SOLDIER_ROBOT) {
            if (!CanRobotBeControlled(pSoldier)) {
                DisableButton(iActionIcons[Enum209.WALK_ICON]);
            }
        }

        iActionIcons[Enum209.SNEAK_ICON] = QuickCreateButton(iIconImages[Enum208.SNEAK_IMAGES], (iMenuAnchorX + 40), (iMenuAnchorY + 20), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnMovementCallback);
        if (iActionIcons[Enum209.SNEAK_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }
        SetButtonFastHelpText(iActionIcons[Enum209.SNEAK_ICON], pTacticalPopupButtonStrings[Enum209.SNEAK_ICON]);
        // SetButtonSavedRect( iActionIcons[ SNEAK_ICON ] );
        ButtonList[iActionIcons[Enum209.SNEAK_ICON]].UserData[0] = pUIEvent;

        // Check if this is a valid stance, diable if not!
        if (!IsValidStance(pSoldier, ANIM_CROUCH)) {
            DisableButton(iActionIcons[Enum209.SNEAK_ICON]);
        }

        iActionIcons[Enum209.CRAWL_ICON] = QuickCreateButton(iIconImages[Enum208.CRAWL_IMAGES], (iMenuAnchorX + 40), (iMenuAnchorY + 40), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnMovementCallback);
        if (iActionIcons[Enum209.CRAWL_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }
        SetButtonFastHelpText(iActionIcons[Enum209.CRAWL_ICON], pTacticalPopupButtonStrings[Enum209.CRAWL_ICON]);
        // SetButtonSavedRect( iActionIcons[ CRAWL_ICON ] );
        ButtonList[iActionIcons[Enum209.CRAWL_ICON]].UserData[0] = pUIEvent;

        // Check if this is a valid stance, diable if not!
        if (!IsValidStance(pSoldier, ANIM_PRONE)) {
            DisableButton(iActionIcons[Enum209.CRAWL_ICON]);
        }

        iActionIcons[Enum209.LOOK_ICON] = QuickCreateButton(iIconImages[Enum208.LOOK_IMAGES], (iMenuAnchorX), (iMenuAnchorY), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnMovementCallback);
        if (iActionIcons[Enum209.LOOK_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }
        SetButtonFastHelpText(iActionIcons[Enum209.LOOK_ICON], TacticalStr[Enum335.LOOK_CURSOR_POPUPTEXT]);
        // SetButtonSavedRect( iActionIcons[ LOOK_ICON ] );
        ButtonList[iActionIcons[Enum209.LOOK_ICON]].UserData[0] = pUIEvent;

        if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
            DisableButton(iActionIcons[Enum209.LOOK_ICON]);
        }

        if (pSoldier.uiStatusFlags & SOLDIER_ROBOT) {
            if (!CanRobotBeControlled(pSoldier)) {
                DisableButton(iActionIcons[Enum209.LOOK_ICON]);
            }
        }

        if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
            // Until we get mounted weapons...
            uiActionImages = Enum208.CANCEL_IMAGES;
            zActionString = TacticalStr[Enum335.NOT_APPLICABLE_POPUPTEXT];
            fDisableAction = true;
        } else {
            if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.TOOLKIT) {
                uiActionImages = Enum208.TOOLKITACTIONC_IMAGES;
                zActionString = TacticalStr[Enum335.NOT_APPLICABLE_POPUPTEXT];
            } else if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.WIRECUTTERS) {
                uiActionImages = Enum208.WIRECUTACTIONC_IMAGES;
                zActionString = TacticalStr[Enum335.NOT_APPLICABLE_POPUPTEXT];
            } else {
                // Create button based on what is in our hands at the moment!
                switch (Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass) {
                    case IC_PUNCH:

                        uiActionImages = Enum208.PUNCHACTIONC_IMAGES;
                        zActionString = TacticalStr[Enum335.USE_HANDTOHAND_POPUPTEXT];
                        break;

                    case IC_GUN:

                        uiActionImages = Enum208.TARGETACTIONC_IMAGES;
                        zActionString = TacticalStr[Enum335.USE_FIREARM_POPUPTEXT];
                        break;

                    case IC_BLADE:

                        uiActionImages = Enum208.KNIFEACTIONC_IMAGES;
                        zActionString = TacticalStr[Enum335.USE_BLADE_POPUPTEXT];
                        break;

                    case IC_GRENADE:
                    case IC_BOMB:

                        uiActionImages = Enum208.BOMBACTIONC_IMAGES;
                        zActionString = TacticalStr[Enum335.USE_EXPLOSIVE_POPUPTEXT];
                        break;

                    case IC_MEDKIT:

                        uiActionImages = Enum208.AIDACTIONC_IMAGES;
                        zActionString = TacticalStr[Enum335.USE_MEDKIT_POPUPTEXT];
                        break;

                    default:

                        uiActionImages = Enum208.CANCEL_IMAGES;
                        zActionString = TacticalStr[Enum335.NOT_APPLICABLE_POPUPTEXT];
                        fDisableAction = true;
                        break;
                }
            }
        }

        if (AM_AN_EPC(pSoldier)) {
            fDisableAction = true;
        }

        iActionIcons[Enum209.ACTIONC_ICON] = QuickCreateButton(iIconImages[uiActionImages], (iMenuAnchorX), (iMenuAnchorY + 20), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnMovementCallback);
        if (iActionIcons[Enum209.ACTIONC_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }
        // SetButtonSavedRect( iActionIcons[ ACTIONC_ICON ] );
        SetButtonFastHelpText(iActionIcons[Enum209.ACTIONC_ICON], zActionString);
        ButtonList[iActionIcons[Enum209.ACTIONC_ICON]].UserData[0] = pUIEvent;

        if (fDisableAction) {
            DisableButton(iActionIcons[Enum209.ACTIONC_ICON]);
        }

        iActionIcons[Enum209.TALK_ICON] = QuickCreateButton(iIconImages[Enum208.TALK_IMAGES], (iMenuAnchorX), (iMenuAnchorY + 40), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnMovementCallback);
        if (iActionIcons[Enum209.TALK_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }
        // SetButtonSavedRect( iActionIcons[ TALK_ICON ] );
        SetButtonFastHelpText(iActionIcons[Enum209.TALK_ICON], pTacticalPopupButtonStrings[Enum209.TALK_ICON]);
        ButtonList[iActionIcons[Enum209.TALK_ICON]].UserData[0] = pUIEvent;

        if (AM_AN_EPC(pSoldier) || (pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
            DisableButton(iActionIcons[Enum209.TALK_ICON]);
        }

        iActionIcons[Enum209.HAND_ICON] = QuickCreateButton(iIconImages[Enum208.HAND_IMAGES], (iMenuAnchorX + 20), (iMenuAnchorY + 40), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnMovementCallback);
        if (iActionIcons[Enum209.HAND_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }
        // SetButtonSavedRect( iActionIcons[ HAND_ICON ] );
        SetButtonFastHelpText(iActionIcons[Enum209.HAND_ICON], pTacticalPopupButtonStrings[Enum209.HAND_ICON]);
        ButtonList[iActionIcons[Enum209.HAND_ICON]].UserData[0] = pUIEvent;

        if (AM_AN_EPC(pSoldier) || (pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
            DisableButton(iActionIcons[Enum209.HAND_ICON]);
        }

        iActionIcons[CANCEL_ICON] = QuickCreateButton(iIconImages[Enum208.CANCEL_IMAGES], (iMenuAnchorX + 20), (iMenuAnchorY + 20), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnMovementCallback);
        if (iActionIcons[CANCEL_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }
        // SetButtonSavedRect( iActionIcons[ CANCEL_ICON ] );
        SetButtonFastHelpText(iActionIcons[CANCEL_ICON], pTacticalPopupButtonStrings[CANCEL_ICON]);
        ButtonList[iActionIcons[CANCEL_ICON]].UserData[0] = pUIEvent;

        // LockTacticalInterface( );

        gfInMovementMenu = true;

        // Ignore scrolling
        gfIgnoreScrolling = true;
    }

    export function PopDownMovementMenu(): void {
        if (gfInMovementMenu) {
            RemoveButton(iActionIcons[Enum209.WALK_ICON]);
            RemoveButton(iActionIcons[Enum209.SNEAK_ICON]);
            RemoveButton(iActionIcons[Enum209.RUN_ICON]);
            RemoveButton(iActionIcons[Enum209.CRAWL_ICON]);
            RemoveButton(iActionIcons[Enum209.LOOK_ICON]);
            RemoveButton(iActionIcons[Enum209.ACTIONC_ICON]);
            RemoveButton(iActionIcons[Enum209.TALK_ICON]);
            RemoveButton(iActionIcons[Enum209.HAND_ICON]);
            RemoveButton(iActionIcons[CANCEL_ICON]);

            // Turn off Ignore scrolling
            gfIgnoreScrolling = false;

            // Rerender world
            SetRenderFlags(RENDER_FLAG_FULL);

            fInterfacePanelDirty = DIRTYLEVEL2;

            // UnLockTacticalInterface( );
            MSYS_RemoveRegion(gMenuOverlayRegion);
        }

        gfInMovementMenu = false;
    }

    export function RenderMovementMenu(): void {
        if (gfInMovementMenu) {
            BltVideoObjectFromIndex(FRAME_BUFFER, guiBUTTONBORDER, 0, giMenuAnchorX, giMenuAnchorY, VO_BLT_SRCTRANSPARENCY, null);

            // Mark buttons dirty!
            MarkAButtonDirty(iActionIcons[Enum209.WALK_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.SNEAK_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.RUN_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.CRAWL_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.LOOK_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.ACTIONC_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.TALK_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.HAND_ICON]);
            MarkAButtonDirty(iActionIcons[CANCEL_ICON]);

            InvalidateRegion(giMenuAnchorX, giMenuAnchorY, giMenuAnchorX + BUTTON_PANEL_WIDTH, giMenuAnchorY + BUTTON_PANEL_HEIGHT);
        }
    }

    export function CancelMovementMenu(): void {
        // Signal end of event
        PopDownMovementMenu();
        guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
    }

    function BtnMovementCallback(btn: GUI_BUTTON, reason: INT32): void {
        let uiBtnID: INT32;
        let pUIEvent: UI_EVENT;

        if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
            btn.uiFlags |= BUTTON_CLICKED_ON;

            uiBtnID = btn.IDNum;

            pUIEvent = (btn.UserData[0]);

            if (uiBtnID == iActionIcons[Enum209.WALK_ICON]) {
                pUIEvent.uiParams[0] = MOVEMENT_MENU_WALK;
            } else if (uiBtnID == iActionIcons[Enum209.RUN_ICON]) {
                pUIEvent.uiParams[0] = MOVEMENT_MENU_RUN;
            } else if (uiBtnID == iActionIcons[Enum209.SNEAK_ICON]) {
                pUIEvent.uiParams[0] = MOVEMENT_MENU_SWAT;
            } else if (uiBtnID == iActionIcons[Enum209.CRAWL_ICON]) {
                pUIEvent.uiParams[0] = MOVEMENT_MENU_PRONE;
            } else if (uiBtnID == iActionIcons[Enum209.LOOK_ICON]) {
                pUIEvent.uiParams[2] = MOVEMENT_MENU_LOOK;
            } else if (uiBtnID == iActionIcons[Enum209.ACTIONC_ICON]) {
                pUIEvent.uiParams[2] = MOVEMENT_MENU_ACTIONC;
            } else if (uiBtnID == iActionIcons[Enum209.TALK_ICON]) {
                pUIEvent.uiParams[2] = MOVEMENT_MENU_TALK;
            } else if (uiBtnID == iActionIcons[Enum209.HAND_ICON]) {
                pUIEvent.uiParams[2] = MOVEMENT_MENU_HAND;
            } else if (uiBtnID == iActionIcons[CANCEL_ICON]) {
                // Signal end of event
                EndMenuEvent(Enum207.U_MOVEMENT_MENU);
                pUIEvent.uiParams[1] = false;
                return;
            } else {
                return;
            }

            // Signal end of event
            EndMenuEvent(Enum207.U_MOVEMENT_MENU);
            pUIEvent.uiParams[1] = true;
        }
    }

    /* static */
    let HandleUpDownArrowBackgrounds__uiOldShowUpDownArrows: UINT32 = ARROWS_HIDE_UP | ARROWS_HIDE_DOWN;

    function HandleUpDownArrowBackgrounds(): void {
        // Check for change in mode
        if (guiShowUPDownArrows != HandleUpDownArrowBackgrounds__uiOldShowUpDownArrows || gfUIRefreshArrows) {
            gfUIRefreshArrows = false;

            // Hide position of new ones
            GetArrowsBackground();

            HandleUpDownArrowBackgrounds__uiOldShowUpDownArrows = guiShowUPDownArrows;
        }
    }

    export function RenderArrows(): void {
        let TileElem: TILE_ELEMENT = createTileElement();

        if (guiShowUPDownArrows & ARROWS_HIDE_UP && guiShowUPDownArrows & ARROWS_HIDE_DOWN) {
            return;
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_UP_BESIDE) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS3];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_G) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS1];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_Y) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS3];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_YG) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS3];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY, VO_BLT_SRCTRANSPARENCY, null);
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS1];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY + 20, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_GG) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS1];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY, VO_BLT_SRCTRANSPARENCY, null);
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY + 20, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_YY) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS3];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY, VO_BLT_SRCTRANSPARENCY, null);
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY + 20, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_CLIMB) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS8];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_CLIMB2) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS3];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY + 20, VO_BLT_SRCTRANSPARENCY, null);
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS8];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_CLIMB3) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS3];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY, VO_BLT_SRCTRANSPARENCY, null);
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS8];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY + 20, VO_BLT_SRCTRANSPARENCY, null);
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsUpArrowX, gsUpArrowY + 40, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_BESIDE) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS4];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsDownArrowX, gsDownArrowY, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_BELOW_G) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS2];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsDownArrowX, gsDownArrowY, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_BELOW_Y) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS4];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsDownArrowX, gsDownArrowY, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_CLIMB) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS7];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsDownArrowX, gsDownArrowY, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_BELOW_YG) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS2];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsDownArrowX, gsDownArrowY, VO_BLT_SRCTRANSPARENCY, null);
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS4];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsDownArrowX, gsDownArrowY + 20, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_BELOW_GG) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS2];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsDownArrowX, gsDownArrowY, VO_BLT_SRCTRANSPARENCY, null);
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsDownArrowX, gsDownArrowY + 20, VO_BLT_SRCTRANSPARENCY, null);
        }

        if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_BELOW_YY) {
            TileElem = gTileDatabase[Enum312.SECONDPOINTERS4];
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsDownArrowX, gsDownArrowY, VO_BLT_SRCTRANSPARENCY, null);
            BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, gsDownArrowX, gsDownArrowY + 20, VO_BLT_SRCTRANSPARENCY, null);
        }
    }

    export function EraseRenderArrows(): void {
        if (giUpArrowRect != 0) {
            if (giUpArrowRect != -1) {
                FreeBackgroundRect(giUpArrowRect);
            }
        }
        giUpArrowRect = 0;

        if (giDownArrowRect != 0) {
            if (giDownArrowRect != -1) {
                FreeBackgroundRect(giDownArrowRect);
            }
        }
        giDownArrowRect = 0;
    }

    function GetArrowsBackground(): void {
        let pSoldier: SOLDIERTYPE;
        let sMercScreenX: INT16 = 0;
        let sMercScreenY: INT16 = 0;
        let sArrowHeight: UINT16 = ARROWS_HEIGHT;
        let sArrowWidth: UINT16 = ARROWS_WIDTH;

        if (guiShowUPDownArrows & ARROWS_HIDE_UP && guiShowUPDownArrows & ARROWS_HIDE_DOWN) {
            return;
        }

        if (gusSelectedSoldier != NO_SOLDIER) {
            // Get selected soldier
            pSoldier = <SOLDIERTYPE>GetSoldier(gusSelectedSoldier);

            // Get screen position of our guy
            ({sMercScreenX, sMercScreenY} = GetSoldierTRUEScreenPos(pSoldier));

            if (guiShowUPDownArrows & ARROWS_SHOW_UP_BESIDE) {
                // Setup blt rect
                gsUpArrowX = sMercScreenX + ARROWS_X_OFFSET;
                gsUpArrowY = sMercScreenY + UPARROW_Y_OFFSET;
            }

            if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_G || guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_Y) {
                // Setup blt rect
                gsUpArrowX = sMercScreenX - 10;
                gsUpArrowY = sMercScreenY - 50;
            }

            if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_YG || guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_GG || guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_YY) {
                // Setup blt rect
                gsUpArrowX = sMercScreenX - 10;
                gsUpArrowY = sMercScreenY - 70;
                sArrowHeight = 3 * ARROWS_HEIGHT;
            }

            if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_CLIMB) {
                // Setup blt rect
                gsUpArrowX = sMercScreenX - 10;
                gsUpArrowY = sMercScreenY - 70;
                sArrowHeight = 2 * ARROWS_HEIGHT;
            }

            if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_CLIMB2) {
                // Setup blt rect
                gsUpArrowX = sMercScreenX - 10;
                gsUpArrowY = sMercScreenY - 80;
                sArrowHeight = 3 * ARROWS_HEIGHT;
            }

            if (guiShowUPDownArrows & ARROWS_SHOW_UP_ABOVE_CLIMB3) {
                // Setup blt rect
                gsUpArrowX = sMercScreenX - 10;
                gsUpArrowY = sMercScreenY - 900;
                sArrowHeight = 5 * ARROWS_HEIGHT;
            }

            if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_BESIDE) {
                gsDownArrowX = sMercScreenX + ARROWS_X_OFFSET;
                gsDownArrowY = sMercScreenY + DOWNARROW_Y_OFFSET;
            }

            if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_BELOW_Y || guiShowUPDownArrows & ARROWS_SHOW_DOWN_BELOW_G) {
                gsDownArrowX = sMercScreenX - 10;
                gsDownArrowY = sMercScreenY + 10;
            }

            if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_CLIMB) {
                gsDownArrowX = sMercScreenX - 10;
                gsDownArrowY = sMercScreenY + 10;
                sArrowHeight = 3 * ARROWS_HEIGHT;
            }

            if (guiShowUPDownArrows & ARROWS_SHOW_DOWN_BELOW_YG || guiShowUPDownArrows & ARROWS_SHOW_DOWN_BELOW_GG || guiShowUPDownArrows & ARROWS_SHOW_DOWN_BELOW_YY) {
                gsDownArrowX = sMercScreenX - 10;
                gsDownArrowY = sMercScreenY + 10;
                sArrowHeight = 3 * ARROWS_HEIGHT;
            }

            // Adjust arrows based on level
            if (gsInterfaceLevel == Enum214.I_ROOF_LEVEL) {
                //	gsDownArrowY -= ROOF_LEVEL_HEIGHT;
                //	gsUpArrowY	 -= ROOF_LEVEL_HEIGHT;
            }

            // Erase prevois ones...
            EraseRenderArrows();

            // Register dirty rects
            giDownArrowRect = RegisterBackgroundRect(BGND_FLAG_PERMANENT, null, gsDownArrowX, gsDownArrowY, (gsDownArrowX + sArrowWidth), (gsDownArrowY + sArrowHeight));
            giUpArrowRect = RegisterBackgroundRect(BGND_FLAG_PERMANENT, null, gsUpArrowX, gsUpArrowY, (gsUpArrowX + sArrowWidth), (gsUpArrowY + sArrowHeight));
        }
    }

    export function GetSoldierAboveGuyPositions(pSoldier: SOLDIERTYPE, psX: Pointer<INT16>, psY: Pointer<INT16>, fRadio: boolean): void {
        let sMercScreenX: INT16;
        let sMercScreenY: INT16;
        let sOffsetX: INT16;
        let sOffsetY: INT16;
        let sAddXOffset: INT16 = 0;
        let ubAnimUseHeight: UINT8;
        let sStanceOffset: INT16 = 0;
        let sBarBodyTypeYOffset: INT16 = 55;
        let sTextBodyTypeYOffset: INT16 = 62;

        // Find XY, dims, offsets
        ({sScreenX: sMercScreenX, sScreenY: sMercScreenY} = GetSoldierScreenPos(pSoldier));
        ({sOffsetX, sOffsetY} = GetSoldierAnimOffsets(pSoldier));

        // OK, first thing to do is subtract offsets ( because GetSoldierScreenPos adds them... )
        sMercScreenX -= sOffsetX;
        sMercScreenY -= sOffsetY;

        // Adjust based on stance
        if ((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_NOMOVE_MARKER)) {
            ubAnimUseHeight = gAnimControl[pSoldier.usAnimState].ubHeight;
        } else {
            ubAnimUseHeight = gAnimControl[pSoldier.usAnimState].ubEndHeight;
        }
        switch (ubAnimUseHeight) {
            case ANIM_STAND:
                break;

            case ANIM_PRONE:
                sStanceOffset = 25;
                break;

            case ANIM_CROUCH:
                sStanceOffset = 10;
                break;
        }

        // Adjust based on body type...
        switch (pSoldier.ubBodyType) {
            case Enum194.CROW:

                sStanceOffset = 30;
                break;

            case Enum194.ROBOTNOWEAPON:

                sStanceOffset = 30;
                break;
        }

        // sStanceOffset -= gpWorldLevelData[ pSoldier->sGridNo ].sHeight;

        // Adjust based on level
        if (pSoldier.bLevel == 1 && gsInterfaceLevel == 0) {
            // sStanceOffset -= ROOF_LEVEL_HEIGHT;
        }
        if (pSoldier.bLevel == 0 && gsInterfaceLevel == 1) {
            // sStanceOffset += ROOF_LEVEL_HEIGHT;
        }

        if (pSoldier.ubProfile != NO_PROFILE) {
            if (fRadio) {
                psX.value = sMercScreenX - Math.trunc(80 / 2) - pSoldier.sLocatorOffX;
                psY.value = sMercScreenY - sTextBodyTypeYOffset + sStanceOffset;
            } else {
                psX.value = sMercScreenX - Math.trunc(80 / 2) - pSoldier.sLocatorOffX;
                psY.value = sMercScreenY - sTextBodyTypeYOffset + sStanceOffset;

                // OK, Check if we need to go below....
                // Can do this 1) if displaying damge or 2 ) above screen

                // If not a radio position, adjust if we are getting hit, to be lower!
                // If we are getting hit, lower them!
                if (pSoldier.fDisplayDamage || psY.value < gsVIEWPORT_WINDOW_START_Y) {
                    psX.value = sMercScreenX - Math.trunc(80 / 2) - pSoldier.sLocatorOffX;
                    psY.value = sMercScreenY;
                }
            }
        } else {
            // Display Text!
            psX.value = sMercScreenX - Math.trunc(80 / 2) - pSoldier.sLocatorOffX;
            psY.value = sMercScreenY - sTextBodyTypeYOffset + sStanceOffset;
        }
    }

    export function DrawSelectedUIAboveGuy(usSoldierID: UINT16): void {
        let pSoldier: SOLDIERTYPE;
        let sXPos: INT16 = 0;
        let sXPos__Pointer = createPointer(() => sXPos, (v) => sXPos = v);
        let sYPos: INT16 = 0;
        let sYPos__Pointer = createPointer(() => sYPos, (v) => sYPos = v);
        let sX: INT16;
        let sY: INT16;
        let iBack: INT32;
        let TileElem: TILE_ELEMENT = createTileElement();
        let pStr: string /* Pointer<UINT16> */;
        let NameStr: string /* UINT16[50] */;
        let usGraphicToUse: UINT16 = Enum312.THIRDPOINTERS1;
        let fRaiseName: boolean = false;
        let fDoName: boolean = true;

        pSoldier = <SOLDIERTYPE>GetSoldier(usSoldierID);

        if (pSoldier.bVisible == -1 && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
            return;
        }

        if (pSoldier.sGridNo == NOWHERE) {
            return;
        }

        if (pSoldier.fFlashLocator) {
            if (pSoldier.bVisible == -1) {
                pSoldier.fFlashLocator = 0;
            } else {
                if (TIMECOUNTERDONE(pSoldier.BlinkSelCounter, 80)) {
                    pSoldier.BlinkSelCounter = RESETTIMECOUNTER(80);

                    //	pSoldier->fShowLocator = !pSoldier->fShowLocator;

                    pSoldier.fShowLocator = true;

                    // Update frame
                    pSoldier.sLocatorFrame++;

                    if (pSoldier.sLocatorFrame == 5) {
                        // Update time we do this
                        pSoldier.fFlashLocator++;
                        pSoldier.sLocatorFrame = 0;
                    }
                }

                // if ( TIMECOUNTERDONE( pSoldier->FlashSelCounter, 5000 ) )
                //{
                //	RESETTIMECOUNTER( pSoldier->FlashSelCounter, 5000 );

                //	pSoldier->fFlashLocator = FALSE;
                //	pSoldier->fShowLocator = FALSE;

                //}
                if (pSoldier.fFlashLocator == pSoldier.ubNumLocateCycles) {
                    pSoldier.fFlashLocator = 0;
                    pSoldier.fShowLocator = false;
                }

                // if ( pSoldier->fShowLocator )
                {
                    // Render the beastie
                    GetSoldierAboveGuyPositions(pSoldier, sXPos__Pointer, sYPos__Pointer, true);

                    // Adjust for bars!
                    sXPos += 25;
                    sYPos += 25;

                    // sXPos += 15;
                    // sYPos += 21;

                    // Add bars
                    // iBack = RegisterBackgroundRect( BGND_FLAG_SINGLE, NULL, sXPos, sYPos, (INT16)(sXPos + 55 ), (INT16)(sYPos + 80 ) );
                    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, sXPos, sYPos, (sXPos + 40), (sYPos + 40));

                    if (iBack != -1) {
                        SetBackgroundRectFilled(iBack);
                    }

                    if ((!pSoldier.bNeutral && (pSoldier.bSide != gbPlayerNum))) {
                        BltVideoObjectFromIndex(FRAME_BUFFER, guiRADIO2, pSoldier.sLocatorFrame, sXPos, sYPos, VO_BLT_SRCTRANSPARENCY, null);
                    } else {
                        BltVideoObjectFromIndex(FRAME_BUFFER, guiRADIO, pSoldier.sLocatorFrame, sXPos, sYPos, VO_BLT_SRCTRANSPARENCY, null);

                        // BltVideoObjectFromIndex(  FRAME_BUFFER, guiRADIO, 0, sXPos, sYPos, VO_BLT_SRCTRANSPARENCY, NULL );
                    }
                }
            }
            // return;
        }

        if (!pSoldier.fShowLocator) {
            // RETURN IF MERC IS NOT SELECTED
            if (gfUIHandleSelectionAboveGuy && pSoldier.ubID == gsSelectedGuy && pSoldier.ubID != gusSelectedSoldier && !gfIgnoreOnSelectedGuy) {
            } else if (pSoldier.ubID == gusSelectedSoldier && !gRubberBandActive) {
                usGraphicToUse = Enum312.THIRDPOINTERS2;
            }
                // show all people's names if !
                // else if ( pSoldier->ubID >= 20 && pSoldier->bVisible != -1 )
                //{

            //}
            else if (pSoldier.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
            } else {
                return;
            }
        } else {
            if (pSoldier.ubID == gusSelectedSoldier && !gRubberBandActive) {
                usGraphicToUse = Enum312.THIRDPOINTERS2;
            }
        }

        // If he is in the middle of a certain animation, ignore!
        if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_NOSHOW_MARKER) {
            return;
        }

        // Donot show if we are dead
        if ((pSoldier.uiStatusFlags & SOLDIER_DEAD)) {
            return;
        }

        GetSoldierAboveGuyPositions(pSoldier, sXPos__Pointer, sYPos__Pointer, false);

        // Display name
        SetFont(TINYFONT1());
        SetFontBackground(FONT_MCOLOR_BLACK);
        SetFontForeground(FONT_MCOLOR_WHITE);

        if (pSoldier.ubProfile != NO_PROFILE || (pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
            if (gfUIMouseOnValidCatcher == 1 && pSoldier.ubID == gubUIValidCatcherID) {
                NameStr = TacticalStr[Enum335.CATCH_STR];
                ({sX, sY} = FindFontCenterCoordinates(sXPos, (sYPos), (80), 1, NameStr, TINYFONT1()));
                gprintfdirty(sX, sY, NameStr);
                mprintf(sX, sY, NameStr);
                fRaiseName = true;
            } else if (gfUIMouseOnValidCatcher == 3 && pSoldier.ubID == gubUIValidCatcherID) {
                NameStr = TacticalStr[Enum335.RELOAD_STR];
                ({sX, sY} = FindFontCenterCoordinates(sXPos, (sYPos), (80), 1, NameStr, TINYFONT1()));
                gprintfdirty(sX, sY, NameStr);
                mprintf(sX, sY, NameStr);
                fRaiseName = true;
            } else if (gfUIMouseOnValidCatcher == 4 && pSoldier.ubID == gubUIValidCatcherID) {
                NameStr = pMessageStrings[Enum333.MSG_PASS];
                ({sX, sY} = FindFontCenterCoordinates(sXPos, (sYPos), (80), 1, NameStr, TINYFONT1()));
                gprintfdirty(sX, sY, NameStr);
                mprintf(sX, sY, NameStr);
                fRaiseName = true;
            } else if (pSoldier.bAssignment >= Enum117.ON_DUTY) {
                SetFontForeground(FONT_YELLOW);
                NameStr = swprintf("(%s)", pAssignmentStrings[pSoldier.bAssignment]);
                ({sX, sY} = FindFontCenterCoordinates(sXPos, (sYPos), (80), 1, NameStr, TINYFONT1()));
                gprintfdirty(sX, sY, NameStr);
                mprintf(sX, sY, NameStr);
                fRaiseName = true;
            } else if (pSoldier.bTeam == gbPlayerNum && pSoldier.bAssignment < Enum117.ON_DUTY && pSoldier.bAssignment != CurrentSquad() && !(pSoldier.uiStatusFlags & SOLDIER_MULTI_SELECTED)) {
                NameStr = swprintf(gzLateLocalizedString[34], (pSoldier.bAssignment + 1));
                ({sX, sY} = FindFontCenterCoordinates(sXPos, (sYPos), (80), 1, NameStr, TINYFONT1()));
                gprintfdirty(sX, sY, NameStr);
                mprintf(sX, sY, NameStr);
                fRaiseName = true;
            }

            // If not in a squad....
            if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
                if (GetNumberInVehicle(pSoldier.bVehicleID) == 0) {
                    SetFontForeground(FONT_GRAY4);
                }
            } else {
                if (pSoldier.bAssignment >= Enum117.ON_DUTY) {
                    SetFontForeground(FONT_YELLOW);
                }
            }

            if (fDoName) {
                if (fRaiseName) {
                    NameStr = swprintf("%s", pSoldier.name);
                    ({sX, sY} = FindFontCenterCoordinates(sXPos, (sYPos - 10), (80), 1, NameStr, TINYFONT1()));
                    gprintfdirty(sX, sY, NameStr);
                    mprintf(sX, sY, NameStr);
                } else {
                    NameStr = swprintf("%s", pSoldier.name);
                    ({sX, sY} = FindFontCenterCoordinates(sXPos, sYPos, (80), 1, NameStr, TINYFONT1()));
                    gprintfdirty(sX, sY, NameStr);
                    mprintf(sX, sY, NameStr);
                }
            }

            if (pSoldier.ubProfile < FIRST_RPC || RPC_RECRUITED(pSoldier) || AM_AN_EPC(pSoldier) || (pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
                // Adjust for bars!

                if (pSoldier.ubID == gusSelectedSoldier) {
                    sXPos += 28;
                    sYPos += 5;
                } else {
                    sXPos += 30;
                    sYPos += 7;
                }

                // Add bars
                iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, sXPos, sYPos, (sXPos + 34), (sYPos + 11));

                if (iBack != -1) {
                    SetBackgroundRectFilled(iBack);
                }
                TileElem = gTileDatabase[usGraphicToUse];
                BltVideoObject(FRAME_BUFFER, TileElem.hTileSurface, TileElem.usRegionIndex, sXPos, sYPos, VO_BLT_SRCTRANSPARENCY, null);

                // Draw life, breath
                // Only do this when we are a vehicle but on our team
                if (pSoldier.ubID == gusSelectedSoldier) {
                    DrawBarsInUIBox(pSoldier, (sXPos + 1), (sYPos + 2), 16, 1);
                } else {
                    DrawBarsInUIBox(pSoldier, (sXPos), (sYPos), 16, 1);
                }
            } else {
                if (gfUIMouseOnValidCatcher == 2 && pSoldier.ubID == gubUIValidCatcherID) {
                    SetFont(TINYFONT1());
                    SetFontBackground(FONT_MCOLOR_BLACK);
                    SetFontForeground(FONT_MCOLOR_WHITE);

                    NameStr = TacticalStr[Enum335.GIVE_STR];
                    ({sX, sY} = FindFontCenterCoordinates(sXPos, (sYPos + 10), (80), 1, NameStr, TINYFONT1()));
                    gprintfdirty(sX, sY, NameStr);
                    mprintf(sX, sY, NameStr);
                } else {
                    SetFont(TINYFONT1());
                    SetFontBackground(FONT_MCOLOR_BLACK);
                    SetFontForeground(FONT_MCOLOR_DKRED);

                    pStr = GetSoldierHealthString(pSoldier);

                    ({sX, sY} = FindFontCenterCoordinates(sXPos, (sYPos + 10), (80), 1, pStr, TINYFONT1()));
                    gprintfdirty(sX, sY, pStr);
                    mprintf(sX, sY, pStr);
                }
            }
        } else {
            if (pSoldier.bLevel != 0) {
                // Display name
                SetFont(TINYFONT1());
                SetFontBackground(FONT_MCOLOR_BLACK);
                SetFontForeground(FONT_YELLOW);

                NameStr = gzLateLocalizedString[15];
                ({sX, sY} = FindFontCenterCoordinates(sXPos, (sYPos + 10), (80), 1, NameStr, TINYFONT1()));
                gprintfdirty(sX, sY, NameStr);
                mprintf(sX, sY, NameStr);
            }

            pStr = GetSoldierHealthString(pSoldier);

            SetFont(TINYFONT1());
            SetFontBackground(FONT_MCOLOR_BLACK);
            SetFontForeground(FONT_MCOLOR_DKRED);

            ({sX, sY} = FindFontCenterCoordinates(sXPos, sYPos, (80), 1, pStr, TINYFONT1()));
            gprintfdirty(sX, sY, pStr);
            mprintf(sX, sY, pStr);
        }
    }

    function RenderOverlayMessage(pBlitter: VIDEO_OVERLAY): void {
        // Override it!
        OverrideMercPopupBox(gpOverrideMercBox);

        RenderMercPopupBox(pBlitter.sX, pBlitter.sY, pBlitter.uiDestBuff);

        // Set it back!
        ResetOverrideMercPopupBox();

        InvalidateRegion(pBlitter.sX, pBlitter.sY, pBlitter.sX + gusOverlayPopupBoxWidth, pBlitter.sY + gusOverlayPopupBoxHeight);
    }

    function BeginOverlayMessage(uiFont: UINT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): void {
        let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();
        let SlideString: string /* wchar_t[512] */;

        SlideString = swprintf(pFontString, ...args); // process gprintf string (get output str)

        // Override it!
        OverrideMercPopupBox(gpOverrideMercBox);

        SetPrepareMercPopupFlags(MERC_POPUP_PREPARE_FLAGS_TRANS_BACK | MERC_POPUP_PREPARE_FLAGS_MARGINS);

        // Prepare text box
        iOverlayMessageBox = PrepareMercPopupBox(iOverlayMessageBox, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.RED_MERC_POPUP_BORDER, SlideString, 200, 50, 0, 0, gusOverlayPopupBoxWidth__Pointer, gusOverlayPopupBoxHeight__Pointer);

        // Set it back!
        ResetOverrideMercPopupBox();

        if (giPopupSlideMessageOverlay == -1) {
            // Set Overlay
            VideoOverlayDesc.sLeft = Math.trunc((640 - gusOverlayPopupBoxWidth) / 2);
            VideoOverlayDesc.sTop = 100;
            VideoOverlayDesc.sRight = VideoOverlayDesc.sLeft + gusOverlayPopupBoxWidth;
            VideoOverlayDesc.sBottom = VideoOverlayDesc.sTop + gusOverlayPopupBoxHeight;
            VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
            VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
            VideoOverlayDesc.BltCallback = RenderOverlayMessage;

            giPopupSlideMessageOverlay = RegisterVideoOverlay(0, VideoOverlayDesc);
        }
    }

    function EndOverlayMessage(): void {
        if (giPopupSlideMessageOverlay != -1) {
            //		DebugMsg( TOPIC_JA2, DBG_LEVEL_0, String( "Removing Overlay message") );

            RemoveVideoOverlay(giPopupSlideMessageOverlay);

            giPopupSlideMessageOverlay = -1;
        }
    }

    function DrawBarsInUIBox(pSoldier: SOLDIERTYPE, sXPos: INT16, sYPos: INT16, sWidth: INT16, sHeight: INT16): void {
        let dWidth: FLOAT;
        let dPercentage: FLOAT;
        // UINT16										 usLineColor;

        let uiDestPitchBYTES: UINT32 = 0;
        let pDestBuf: Uint8ClampedArray;
        let usLineColor: UINT16;
        let bBandage: INT8;

        // Draw breath points

        // Draw new size
        pDestBuf = LockVideoSurface(FRAME_BUFFER, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));
        SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, gsVIEWPORT_WINDOW_START_Y, 640, (gsVIEWPORT_WINDOW_END_Y - gsVIEWPORT_WINDOW_START_Y));

        // get amt bandaged
        bBandage = pSoldier.bLifeMax - pSoldier.bLife - pSoldier.bBleeding;

        // NOW DO BLEEDING
        if (pSoldier.bBleeding) {
            dPercentage = (pSoldier.bBleeding + pSoldier.bLife + bBandage) / 100;
            dWidth = dPercentage * sWidth;

            usLineColor = Get16BPPColor(FROMRGB(240, 240, 20));
            RectangleDraw(true, sXPos + 3, sYPos + 1, Math.trunc(sXPos + dWidth + 3), sYPos + 1, usLineColor, pDestBuf);

        }

        if (bBandage) {
            dPercentage = (pSoldier.bLife + bBandage) / 100;
            dWidth = dPercentage * sWidth;

            usLineColor = Get16BPPColor(FROMRGB(222, 132, 132));
            RectangleDraw(true, sXPos + 3, sYPos + 1, Math.trunc(sXPos + dWidth + 3), sYPos + 1, usLineColor, pDestBuf);

        }

        dPercentage = pSoldier.bLife / 100;
        dWidth = dPercentage * sWidth;

        usLineColor = Get16BPPColor(FROMRGB(200, 0, 0));
        RectangleDraw(true, sXPos + 3, sYPos + 1, Math.trunc(sXPos + dWidth + 3), sYPos + 1, usLineColor, pDestBuf);


        dPercentage = (pSoldier.bBreathMax) / 100;
        dWidth = dPercentage * sWidth;

        usLineColor = Get16BPPColor(FROMRGB(20, 20, 150));
        RectangleDraw(true, sXPos + 3, sYPos + 4, Math.trunc(sXPos + dWidth + 3), sYPos + 4, usLineColor, pDestBuf);


        dPercentage = (pSoldier.bBreath) / 100;
        dWidth = dPercentage * sWidth;

        usLineColor = Get16BPPColor(FROMRGB(100, 100, 220));
        RectangleDraw(true, sXPos + 3, sYPos + 4, Math.trunc(sXPos + dWidth + 3), sYPos + 4, usLineColor, pDestBuf);

        UnLockVideoSurface(FRAME_BUFFER);
    }

    export function EndDeadlockMsg(): void {
        // Reset gridlock
        gfUIInDeadlock = false;
    }

    export function ClearInterface(): void {
        if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
            return;
        }

        // Stop any UI menus!
        if (gCurrentUIMode == Enum206.MENU_MODE) {
            EndMenuEvent(guiCurrentEvent);
        }

        if (gfUIHandleShowMoveGrid) {
            RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS4);
            RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS2);
            RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS13);
            RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS15);
        }

        // Remove any popup menus
        if (gCurrentUIMode == Enum206.GETTINGITEM_MODE) {
            RemoveItemPickupMenu();
        }

        // Remove any popup menus
        if (gCurrentUIMode == Enum206.OPENDOOR_MENU_MODE) {
            PopDownOpenDoorMenu();
        }

        // Remove UP/DOWN arrows...
        // EraseRenderArrows( );
        // Don't render arrows this frame!
        guiShowUPDownArrows = ARROWS_HIDE_UP | ARROWS_HIDE_DOWN;

        ResetPhysicsTrajectoryUI();

        // Remove any paths, cursors
        ErasePath(false);

        // gfPlotNewMovement = TRUE;

        // Erase Interface cursors
        HideUICursor();

        MSYS_ChangeRegionCursor(gViewportRegion, VIDEO_NO_CURSOR);

        // Hide lock UI cursors...
        MSYS_ChangeRegionCursor(gDisableRegion, VIDEO_NO_CURSOR);
        MSYS_ChangeRegionCursor(gUserTurnRegion, VIDEO_NO_CURSOR);

        // Remove special thing for south arrow...
        if (gsGlobalCursorYOffset == (480 - gsVIEWPORT_WINDOW_END_Y)) {
            SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
        }
    }

    export function RestoreInterface(): void {
        // Once we are done, plot path again!
        gfPlotNewMovement = true;

        // OK, reset arrows too...
        gfUIRefreshArrows = true;

        // SHow lock UI cursors...
        MSYS_ChangeRegionCursor(gDisableRegion, Enum317.CURSOR_WAIT);
        MSYS_ChangeRegionCursor(gUserTurnRegion, Enum317.CURSOR_WAIT);
    }

    export function DirtyMercPanelInterface(pSoldier: SOLDIERTYPE, ubDirtyLevel: UINT8): void {
        if (pSoldier.bTeam == gbPlayerNum) {
            // ONly set to a higher level!
            if (fInterfacePanelDirty < ubDirtyLevel) {
                fInterfacePanelDirty = ubDirtyLevel;
            }
        }
    }

    interface OPENDOOR_MENU {
        pSoldier: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */
        ;
        pStructure: STRUCTURE /* Pointer<STRUCTURE> */
        ;
        ubDirection: UINT8;
        sX: INT16;
        sY: INT16;
        fMenuHandled: UINT8 /* boolean */
        ;
        fClosingDoor: boolean;
    }

    function createOpenDoorMenu(): OPENDOOR_MENU {
        return {
            pSoldier: <SOLDIERTYPE><unknown>null,
            pStructure: <STRUCTURE><unknown>null,
            ubDirection: 0,
            sX: 0,
            sY: 0,
            fMenuHandled: 0,
            fClosingDoor: false,
        };
    }

    let gOpenDoorMenu: OPENDOOR_MENU = createOpenDoorMenu();
    export let gfInOpenDoorMenu: boolean = false;

    export function InitDoorOpenMenu(pSoldier: SOLDIERTYPE, pStructure: STRUCTURE, ubDirection: UINT8, fClosingDoor: boolean): boolean {
        let sHeight: INT16;
        let sWidth: INT16;
        let sScreenX: INT16;
        let sScreenY: INT16;

        // Erase other menus....
        EraseInterfaceMenus(true);

        InterruptTime();
        PauseGame();
        LockPauseState(19);
        // Pause timers as well....
        PauseTime(true);

        gOpenDoorMenu.pSoldier = pSoldier;
        gOpenDoorMenu.pStructure = pStructure;
        gOpenDoorMenu.ubDirection = ubDirection;
        gOpenDoorMenu.fClosingDoor = fClosingDoor;

        // OK, Determine position...
        // Center on guy
        // Locate to guy first.....
        LocateSoldier(pSoldier.ubID, 0);
        ({sHeight, sWidth} = GetSoldierAnimDims(pSoldier));
        ({sScreenX, sScreenY} = GetSoldierScreenPos(pSoldier));
        gOpenDoorMenu.sX = sScreenX - Math.trunc((BUTTON_PANEL_WIDTH - sWidth) / 2);
        gOpenDoorMenu.sY = sScreenY - Math.trunc((BUTTON_PANEL_HEIGHT - sHeight) / 2);

        // Alrighty, cancel lock UI if we havn't done so already
        UnSetUIBusy(pSoldier.ubID);

        // OK, CHECK FOR BOUNDARIES!
        if ((gOpenDoorMenu.sX + BUTTON_PANEL_WIDTH) > 640) {
            gOpenDoorMenu.sX = (640 - BUTTON_PANEL_WIDTH);
        }
        if ((gOpenDoorMenu.sY + BUTTON_PANEL_HEIGHT) > gsVIEWPORT_WINDOW_END_Y) {
            gOpenDoorMenu.sY = (gsVIEWPORT_WINDOW_END_Y - BUTTON_PANEL_HEIGHT);
        }
        if (gOpenDoorMenu.sX < 0) {
            gOpenDoorMenu.sX = 0;
        }
        if (gOpenDoorMenu.sY < 0) {
            gOpenDoorMenu.sY = 0;
        }

        gOpenDoorMenu.fMenuHandled = 0;

        guiPendingOverrideEvent = Enum207.OP_OPENDOORMENU;
        HandleTacticalUI();

        PopupDoorOpenMenu(fClosingDoor);

        return true;
    }

    function PopupDoorOpenMenu(fClosingDoor: boolean): void {
        let iMenuAnchorX: INT32;
        let iMenuAnchorY: INT32;
        let zDisp: string /* INT16[100] */;

        iMenuAnchorX = gOpenDoorMenu.sX;
        iMenuAnchorY = gOpenDoorMenu.sY;

        // Blit background!
        // BltVideoObjectFromIndex( FRAME_BUFFER, guiBUTTONBORDER, 0, iMenuAnchorX, iMenuAnchorY, VO_BLT_SRCTRANSPARENCY, NULL );
        iMenuAnchorX = gOpenDoorMenu.sX + 9;
        iMenuAnchorY = gOpenDoorMenu.sY + 8;

        // Create mouse region over all area to facilitate clicking to end
        MSYS_DefineRegion(gMenuOverlayRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST - 1, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, DoorMenuBackregionCallback);
        // Add region
        MSYS_AddRegion(gMenuOverlayRegion);

        iActionIcons[Enum209.USE_KEYRING_ICON] = QuickCreateButton(iIconImages[Enum208.USE_KEYRING_IMAGES], (iMenuAnchorX + 20), (iMenuAnchorY), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnDoorMenuCallback);
        if (iActionIcons[Enum209.USE_KEYRING_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }

        if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
            zDisp = pTacticalPopupButtonStrings[Enum209.USE_KEYRING_ICON];
        } else {
            zDisp = swprintf("%s ( %d )", pTacticalPopupButtonStrings[Enum209.USE_KEYRING_ICON], AP_UNLOCK_DOOR);
        }
        SetButtonFastHelpText(iActionIcons[Enum209.USE_KEYRING_ICON], zDisp);

        if (!EnoughPoints(gOpenDoorMenu.pSoldier, AP_UNLOCK_DOOR, BP_UNLOCK_DOOR, false) || fClosingDoor || AM_AN_EPC(gOpenDoorMenu.pSoldier)) {
            DisableButton(iActionIcons[Enum209.USE_KEYRING_ICON]);
        }

        // Greyout if no keys found...
        if (!SoldierHasKey(gOpenDoorMenu.pSoldier, ANYKEY)) {
            DisableButton(iActionIcons[Enum209.USE_KEYRING_ICON]);
        }

        iActionIcons[Enum209.USE_CROWBAR_ICON] = QuickCreateButton(iIconImages[Enum208.CROWBAR_DOOR_IMAGES], (iMenuAnchorX + 40), (iMenuAnchorY), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnDoorMenuCallback);
        if (iActionIcons[Enum209.USE_CROWBAR_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }

        if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
            zDisp = pTacticalPopupButtonStrings[Enum209.USE_CROWBAR_ICON];
        } else {
            zDisp = swprintf("%s ( %d )", pTacticalPopupButtonStrings[Enum209.USE_CROWBAR_ICON], AP_USE_CROWBAR);
        }
        SetButtonFastHelpText(iActionIcons[Enum209.USE_CROWBAR_ICON], zDisp);

        // Greyout if no crowbar found...
        if (FindUsableObj(gOpenDoorMenu.pSoldier, Enum225.CROWBAR) == NO_SLOT || fClosingDoor) {
            DisableButton(iActionIcons[Enum209.USE_CROWBAR_ICON]);
        }

        if (!EnoughPoints(gOpenDoorMenu.pSoldier, AP_USE_CROWBAR, BP_USE_CROWBAR, false)) {
            DisableButton(iActionIcons[Enum209.USE_CROWBAR_ICON]);
        }

        iActionIcons[Enum209.LOCKPICK_DOOR_ICON] = QuickCreateButton(iIconImages[Enum208.LOCKPICK_DOOR_IMAGES], (iMenuAnchorX + 40), (iMenuAnchorY + 20), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnDoorMenuCallback);
        if (iActionIcons[Enum209.LOCKPICK_DOOR_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }

        if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
            zDisp = pTacticalPopupButtonStrings[Enum209.LOCKPICK_DOOR_ICON];
        } else {
            zDisp = swprintf("%s ( %d )", pTacticalPopupButtonStrings[Enum209.LOCKPICK_DOOR_ICON], AP_PICKLOCK);
        }
        SetButtonFastHelpText(iActionIcons[Enum209.LOCKPICK_DOOR_ICON], zDisp);

        if (!EnoughPoints(gOpenDoorMenu.pSoldier, AP_PICKLOCK, BP_PICKLOCK, false) || fClosingDoor || AM_AN_EPC(gOpenDoorMenu.pSoldier)) {
            DisableButton(iActionIcons[Enum209.LOCKPICK_DOOR_ICON]);
        }

        // Grayout if no lockpick found....
        if (FindObj(gOpenDoorMenu.pSoldier, Enum225.LOCKSMITHKIT) == NO_SLOT) {
            DisableButton(iActionIcons[Enum209.LOCKPICK_DOOR_ICON]);
        }

        iActionIcons[Enum209.EXPLOSIVE_DOOR_ICON] = QuickCreateButton(iIconImages[Enum208.EXPLOSIVE_DOOR_IMAGES], (iMenuAnchorX + 40), (iMenuAnchorY + 40), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnDoorMenuCallback);
        if (iActionIcons[Enum209.EXPLOSIVE_DOOR_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }

        if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
            zDisp = pTacticalPopupButtonStrings[Enum209.EXPLOSIVE_DOOR_ICON];
        } else {
            zDisp = swprintf("%s ( %d )", pTacticalPopupButtonStrings[Enum209.EXPLOSIVE_DOOR_ICON], AP_EXPLODE_DOOR);
        }
        SetButtonFastHelpText(iActionIcons[Enum209.EXPLOSIVE_DOOR_ICON], zDisp);

        if (!EnoughPoints(gOpenDoorMenu.pSoldier, AP_EXPLODE_DOOR, BP_EXPLODE_DOOR, false) || fClosingDoor || AM_AN_EPC(gOpenDoorMenu.pSoldier)) {
            DisableButton(iActionIcons[Enum209.EXPLOSIVE_DOOR_ICON]);
        }

        // Grayout if no lock explosive found....
        // For no use bomb1 until we get a special item for this
        if (FindObj(gOpenDoorMenu.pSoldier, Enum225.SHAPED_CHARGE) == NO_SLOT) {
            DisableButton(iActionIcons[Enum209.EXPLOSIVE_DOOR_ICON]);
        }

        iActionIcons[Enum209.OPEN_DOOR_ICON] = QuickCreateButton(iIconImages[Enum208.OPEN_DOOR_IMAGES], (iMenuAnchorX), (iMenuAnchorY), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnDoorMenuCallback);
        if (iActionIcons[Enum209.OPEN_DOOR_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }

        if (fClosingDoor) {
            if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
                zDisp = pTacticalPopupButtonStrings[CANCEL_ICON + 1];
            } else {
                zDisp = swprintf("%s ( %d )", pTacticalPopupButtonStrings[CANCEL_ICON + 1], AP_OPEN_DOOR);
            }
        } else {
            if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
                zDisp = pTacticalPopupButtonStrings[Enum209.OPEN_DOOR_ICON];
            } else {
                zDisp = swprintf("%s ( %d )", pTacticalPopupButtonStrings[Enum209.OPEN_DOOR_ICON], AP_OPEN_DOOR);
            }
        }
        SetButtonFastHelpText(iActionIcons[Enum209.OPEN_DOOR_ICON], zDisp);

        if (!EnoughPoints(gOpenDoorMenu.pSoldier, AP_OPEN_DOOR, BP_OPEN_DOOR, false)) {
            DisableButton(iActionIcons[Enum209.OPEN_DOOR_ICON]);
        }

        // Create button based on what is in our hands at the moment!
        iActionIcons[Enum209.EXAMINE_DOOR_ICON] = QuickCreateButton(iIconImages[Enum208.EXAMINE_DOOR_IMAGES], (iMenuAnchorX), (iMenuAnchorY + 20), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnDoorMenuCallback);
        if (iActionIcons[Enum209.EXAMINE_DOOR_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }

        if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
            zDisp = pTacticalPopupButtonStrings[Enum209.EXAMINE_DOOR_ICON];
        } else {
            zDisp = swprintf("%s ( %d )", pTacticalPopupButtonStrings[Enum209.EXAMINE_DOOR_ICON], AP_EXAMINE_DOOR);
        }
        SetButtonFastHelpText(iActionIcons[Enum209.EXAMINE_DOOR_ICON], zDisp);

        if (!EnoughPoints(gOpenDoorMenu.pSoldier, AP_EXAMINE_DOOR, BP_EXAMINE_DOOR, false) || fClosingDoor || AM_AN_EPC(gOpenDoorMenu.pSoldier)) {
            DisableButton(iActionIcons[Enum209.EXAMINE_DOOR_ICON]);
        }

        iActionIcons[Enum209.BOOT_DOOR_ICON] = QuickCreateButton(iIconImages[Enum208.BOOT_DOOR_IMAGES], (iMenuAnchorX), (iMenuAnchorY + 40), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnDoorMenuCallback);
        if (iActionIcons[Enum209.BOOT_DOOR_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }

        if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
            zDisp = pTacticalPopupButtonStrings[Enum209.BOOT_DOOR_ICON];
        } else {
            zDisp = swprintf("%s ( %d )", pTacticalPopupButtonStrings[Enum209.BOOT_DOOR_ICON], AP_BOOT_DOOR);
        }
        SetButtonFastHelpText(iActionIcons[Enum209.BOOT_DOOR_ICON], zDisp);

        if (!EnoughPoints(gOpenDoorMenu.pSoldier, AP_BOOT_DOOR, BP_BOOT_DOOR, false) || fClosingDoor || AM_AN_EPC(gOpenDoorMenu.pSoldier)) {
            DisableButton(iActionIcons[Enum209.BOOT_DOOR_ICON]);
        }

        iActionIcons[Enum209.UNTRAP_DOOR_ICON] = QuickCreateButton(iIconImages[Enum209.UNTRAP_DOOR_ICON], (iMenuAnchorX + 20), (iMenuAnchorY + 40), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnDoorMenuCallback);
        if (iActionIcons[Enum209.UNTRAP_DOOR_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }

        if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
            zDisp = pTacticalPopupButtonStrings[Enum209.UNTRAP_DOOR_ICON];
        } else {
            zDisp = swprintf("%s ( %d )", pTacticalPopupButtonStrings[Enum209.UNTRAP_DOOR_ICON], AP_UNTRAP_DOOR);
        }
        SetButtonFastHelpText(iActionIcons[Enum209.UNTRAP_DOOR_ICON], zDisp);

        if (!EnoughPoints(gOpenDoorMenu.pSoldier, AP_UNTRAP_DOOR, BP_UNTRAP_DOOR, false) || fClosingDoor || AM_AN_EPC(gOpenDoorMenu.pSoldier)) {
            DisableButton(iActionIcons[Enum209.UNTRAP_DOOR_ICON]);
        }

        iActionIcons[CANCEL_ICON] = QuickCreateButton(iIconImages[Enum208.CANCEL_IMAGES], (iMenuAnchorX + 20), (iMenuAnchorY + 20), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), BtnDoorMenuCallback);
        if (iActionIcons[CANCEL_ICON] == -1) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot create Interface button");
            return;
        }
        SetButtonFastHelpText(iActionIcons[CANCEL_ICON], pTacticalPopupButtonStrings[CANCEL_ICON]);

        // LockTacticalInterface( );

        gfInOpenDoorMenu = true;

        // Ignore scrolling
        gfIgnoreScrolling = true;
    }

    export function PopDownOpenDoorMenu(): void {
        if (gfInOpenDoorMenu) {
            UnLockPauseState();
            UnPauseGame();
            // UnPause timers as well....
            PauseTime(false);

            RemoveButton(iActionIcons[Enum209.USE_KEYRING_ICON]);
            RemoveButton(iActionIcons[Enum209.USE_CROWBAR_ICON]);
            RemoveButton(iActionIcons[Enum209.LOCKPICK_DOOR_ICON]);
            RemoveButton(iActionIcons[Enum209.EXPLOSIVE_DOOR_ICON]);
            RemoveButton(iActionIcons[Enum209.OPEN_DOOR_ICON]);
            RemoveButton(iActionIcons[Enum209.EXAMINE_DOOR_ICON]);
            RemoveButton(iActionIcons[Enum209.BOOT_DOOR_ICON]);
            RemoveButton(iActionIcons[Enum209.UNTRAP_DOOR_ICON]);
            RemoveButton(iActionIcons[CANCEL_ICON]);

            // Turn off Ignore scrolling
            gfIgnoreScrolling = false;

            // Rerender world
            SetRenderFlags(RENDER_FLAG_FULL);

            fInterfacePanelDirty = DIRTYLEVEL2;

            // UnLockTacticalInterface( );
            MSYS_RemoveRegion(gMenuOverlayRegion);
        }

        gfInOpenDoorMenu = false;
    }

    export function RenderOpenDoorMenu(): void {
        if (gfInOpenDoorMenu) {
            BltVideoObjectFromIndex(FRAME_BUFFER, guiBUTTONBORDER, 0, gOpenDoorMenu.sX, gOpenDoorMenu.sY, VO_BLT_SRCTRANSPARENCY, null);

            // Mark buttons dirty!
            MarkAButtonDirty(iActionIcons[Enum209.USE_KEYRING_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.USE_CROWBAR_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.LOCKPICK_DOOR_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.EXPLOSIVE_DOOR_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.OPEN_DOOR_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.EXAMINE_DOOR_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.BOOT_DOOR_ICON]);
            MarkAButtonDirty(iActionIcons[Enum209.UNTRAP_DOOR_ICON]);
            MarkAButtonDirty(iActionIcons[CANCEL_ICON]);

            RenderButtons();

            // if game is paused, then render paused game text
            RenderPausedGameBox();

            InvalidateRegion(gOpenDoorMenu.sX, gOpenDoorMenu.sY, gOpenDoorMenu.sX + BUTTON_PANEL_WIDTH, gOpenDoorMenu.sY + BUTTON_PANEL_HEIGHT);
        }
    }

    export function CancelOpenDoorMenu(): void {
        // Signal end of event
        gOpenDoorMenu.fMenuHandled = 2;
    }

    function BtnDoorMenuCallback(btn: GUI_BUTTON, reason: INT32): void {
        let uiBtnID: INT32;

        if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
            btn.uiFlags |= BUTTON_CLICKED_ON;

            uiBtnID = btn.IDNum;

            // Popdown menu
            gOpenDoorMenu.fMenuHandled = 1;

            if (uiBtnID == iActionIcons[CANCEL_ICON]) {
                // OK, set cancle code!
                gOpenDoorMenu.fMenuHandled = 2;
            }

            // Switch on command....
            if (uiBtnID == iActionIcons[Enum209.OPEN_DOOR_ICON]) {
                // Open door normally...
                // Check APs
                if (EnoughPoints(gOpenDoorMenu.pSoldier, AP_OPEN_DOOR, BP_OPEN_DOOR, false)) {
                    // Set UI
                    SetUIBusy(gOpenDoorMenu.pSoldier.ubID);

                    if (gOpenDoorMenu.fClosingDoor) {
                        ChangeSoldierState(gOpenDoorMenu.pSoldier, GetAnimStateForInteraction(gOpenDoorMenu.pSoldier, true, Enum193.CLOSE_DOOR), 0, false);
                    } else {
                        InteractWithClosedDoor(gOpenDoorMenu.pSoldier, HANDLE_DOOR_OPEN);
                    }
                } else {
                    // OK, set cancle code!
                    gOpenDoorMenu.fMenuHandled = 2;
                }
            }

            if (uiBtnID == iActionIcons[Enum209.BOOT_DOOR_ICON]) {
                // Boot door
                if (EnoughPoints(gOpenDoorMenu.pSoldier, AP_BOOT_DOOR, BP_BOOT_DOOR, false)) {
                    // Set UI
                    SetUIBusy(gOpenDoorMenu.pSoldier.ubID);

                    InteractWithClosedDoor(gOpenDoorMenu.pSoldier, HANDLE_DOOR_FORCE);
                } else {
                    // OK, set cancle code!
                    gOpenDoorMenu.fMenuHandled = 2;
                }
            }

            if (uiBtnID == iActionIcons[Enum209.USE_KEYRING_ICON]) {
                // Unlock door
                if (EnoughPoints(gOpenDoorMenu.pSoldier, AP_UNLOCK_DOOR, BP_UNLOCK_DOOR, false)) {
                    // Set UI
                    SetUIBusy(gOpenDoorMenu.pSoldier.ubID);

                    InteractWithClosedDoor(gOpenDoorMenu.pSoldier, HANDLE_DOOR_UNLOCK);
                } else {
                    // OK, set cancle code!
                    gOpenDoorMenu.fMenuHandled = 2;
                }
            }

            if (uiBtnID == iActionIcons[Enum209.LOCKPICK_DOOR_ICON]) {
                // Lockpick
                if (EnoughPoints(gOpenDoorMenu.pSoldier, AP_PICKLOCK, BP_PICKLOCK, false)) {
                    // Set UI
                    SetUIBusy(gOpenDoorMenu.pSoldier.ubID);

                    InteractWithClosedDoor(gOpenDoorMenu.pSoldier, HANDLE_DOOR_LOCKPICK);
                } else {
                    // OK, set cancle code!
                    gOpenDoorMenu.fMenuHandled = 2;
                }
            }

            if (uiBtnID == iActionIcons[Enum209.EXAMINE_DOOR_ICON]) {
                // Lockpick
                if (EnoughPoints(gOpenDoorMenu.pSoldier, AP_EXAMINE_DOOR, BP_EXAMINE_DOOR, false)) {
                    // Set UI
                    SetUIBusy(gOpenDoorMenu.pSoldier.ubID);

                    InteractWithClosedDoor(gOpenDoorMenu.pSoldier, HANDLE_DOOR_EXAMINE);
                } else {
                    // OK, set cancle code!
                    gOpenDoorMenu.fMenuHandled = 2;
                }
            }

            if (uiBtnID == iActionIcons[Enum209.EXPLOSIVE_DOOR_ICON]) {
                // Explode
                if (EnoughPoints(gOpenDoorMenu.pSoldier, AP_EXPLODE_DOOR, BP_EXPLODE_DOOR, false)) {
                    // Set UI
                    SetUIBusy(gOpenDoorMenu.pSoldier.ubID);

                    InteractWithClosedDoor(gOpenDoorMenu.pSoldier, HANDLE_DOOR_EXPLODE);
                } else {
                    // OK, set cancle code!
                    gOpenDoorMenu.fMenuHandled = 2;
                }
            }

            if (uiBtnID == iActionIcons[Enum209.UNTRAP_DOOR_ICON]) {
                // Explode
                if (EnoughPoints(gOpenDoorMenu.pSoldier, AP_UNTRAP_DOOR, BP_UNTRAP_DOOR, false)) {
                    // Set UI
                    SetUIBusy(gOpenDoorMenu.pSoldier.ubID);

                    InteractWithClosedDoor(gOpenDoorMenu.pSoldier, HANDLE_DOOR_UNTRAP);
                } else {
                    // OK, set cancle code!
                    gOpenDoorMenu.fMenuHandled = 2;
                }
            }

            if (uiBtnID == iActionIcons[Enum209.USE_CROWBAR_ICON]) {
                // Explode
                if (EnoughPoints(gOpenDoorMenu.pSoldier, AP_USE_CROWBAR, BP_USE_CROWBAR, false)) {
                    // Set UI
                    SetUIBusy(gOpenDoorMenu.pSoldier.ubID);

                    InteractWithClosedDoor(gOpenDoorMenu.pSoldier, HANDLE_DOOR_CROWBAR);
                } else {
                    // OK, set cancle code!
                    gOpenDoorMenu.fMenuHandled = 2;
                }
            }

            HandleOpenDoorMenu();
        }
    }

    export function HandleOpenDoorMenu(): UINT8 {
        if (gOpenDoorMenu.fMenuHandled) {
            PopDownOpenDoorMenu();
            return gOpenDoorMenu.fMenuHandled;
        }

        return 0;
    }

    function RenderUIMessage(pBlitter: VIDEO_OVERLAY): void {
        // Shade area first...
        ShadowVideoSurfaceRect(pBlitter.uiDestBuff, pBlitter.sX, pBlitter.sY, pBlitter.sX + gusUIMessageWidth - 2, pBlitter.sY + gusUIMessageHeight - 2);

        RenderMercPopUpBoxFromIndex(iUIMessageBox, pBlitter.sX, pBlitter.sY, pBlitter.uiDestBuff);

        InvalidateRegion(pBlitter.sX, pBlitter.sY, pBlitter.sX + gusUIMessageWidth, pBlitter.sY + gusUIMessageHeight);
    }

    export function InternalBeginUIMessage(fUseSkullIcon: boolean, pFontString: string /* Pointer<UINT16> */, ...args: any[]): void {
        let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();
        let MsgString: string /* wchar_t[512] */;

        MsgString = swprintf(pFontString, ...args); // process gprintf string (get output str)

        guiUIMessageTime = GetJA2Clock();
        guiUIMessageTimeDelay = CalcUIMessageDuration(MsgString);

        // Override it!
        OverrideMercPopupBox(gpUIMessageOverrideMercBox);

        // SetPrepareMercPopupFlags( MERC_POPUP_PREPARE_FLAGS_TRANS_BACK | MERC_POPUP_PREPARE_FLAGS_MARGINS );

        if (fUseSkullIcon) {
            SetPrepareMercPopupFlags(MERC_POPUP_PREPARE_FLAGS_MARGINS | MERC_POPUP_PREPARE_FLAGS_SKULLICON);
        } else {
            SetPrepareMercPopupFlags(MERC_POPUP_PREPARE_FLAGS_MARGINS | MERC_POPUP_PREPARE_FLAGS_STOPICON);
        }

        // Prepare text box
        iUIMessageBox = PrepareMercPopupBox(iUIMessageBox, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, MsgString, 200, 10, 0, 0, gusUIMessageWidth__Pointer, gusUIMessageHeight__Pointer);

        // Set it back!
        ResetOverrideMercPopupBox();

        if (giUIMessageOverlay != -1) {
            RemoveVideoOverlay(giUIMessageOverlay);

            giUIMessageOverlay = -1;
        }

        if (giUIMessageOverlay == -1) {
            // Set Overlay
            VideoOverlayDesc.sLeft = Math.trunc((640 - gusUIMessageWidth) / 2);
            VideoOverlayDesc.sTop = 150;
            VideoOverlayDesc.sRight = VideoOverlayDesc.sLeft + gusUIMessageWidth;
            VideoOverlayDesc.sBottom = VideoOverlayDesc.sTop + gusUIMessageHeight;
            VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
            VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
            VideoOverlayDesc.BltCallback = RenderUIMessage;

            giUIMessageOverlay = RegisterVideoOverlay(0, VideoOverlayDesc);
        }

        gfUseSkullIconMessage = fUseSkullIcon;
    }

    export function BeginUIMessage(pFontString: string /* Pointer<UINT16> */, ...args: any[]): void {
        let MsgString: string /* wchar_t[512] */;

        MsgString = swprintf(pFontString, ...args); // process gprintf string (get output str)

        InternalBeginUIMessage(false, MsgString);
    }

    export function BeginMapUIMessage(ubPosition: UINT8, pFontString: string /* Pointer<UINT16> */, ...args: any[]): void {
        let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();
        let MsgString: string /* wchar_t[512] */;

        MsgString = swprintf(pFontString, ...args); // process gprintf string (get output str)

        guiUIMessageTime = GetJA2Clock();
        guiUIMessageTimeDelay = CalcUIMessageDuration(MsgString);

        // Override it!
        OverrideMercPopupBox(gpUIMessageOverrideMercBox);

        SetPrepareMercPopupFlags(MERC_POPUP_PREPARE_FLAGS_TRANS_BACK | MERC_POPUP_PREPARE_FLAGS_MARGINS);

        // Prepare text box
        iUIMessageBox = PrepareMercPopupBox(iUIMessageBox, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, MsgString, 200, 10, 0, 0, gusUIMessageWidth__Pointer, gusUIMessageHeight__Pointer);

        // Set it back!
        ResetOverrideMercPopupBox();

        if (giUIMessageOverlay == -1) {
            // Set Overlay
            VideoOverlayDesc.sLeft = 20 + MAP_VIEW_START_X + Math.trunc((MAP_VIEW_WIDTH - gusUIMessageWidth) / 2);

            VideoOverlayDesc.sTop = MAP_VIEW_START_Y + Math.trunc((MAP_VIEW_HEIGHT - gusUIMessageHeight) / 2);

            if (ubPosition == MSG_MAP_UI_POSITION_UPPER) {
                VideoOverlayDesc.sTop -= 100;
            } else if (ubPosition == MSG_MAP_UI_POSITION_LOWER) {
                VideoOverlayDesc.sTop += 100;
            }

            VideoOverlayDesc.sRight = VideoOverlayDesc.sLeft + gusUIMessageWidth;
            VideoOverlayDesc.sBottom = VideoOverlayDesc.sTop + gusUIMessageHeight;
            VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
            VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
            VideoOverlayDesc.BltCallback = RenderUIMessage;

            giUIMessageOverlay = RegisterVideoOverlay(0, VideoOverlayDesc);
        }
    }

    export function EndUIMessage(): void {
        let uiClock: UINT32 = GetJA2Clock();

        if (giUIMessageOverlay != -1) {
            if (gfUseSkullIconMessage) {
                if ((uiClock - guiUIMessageTime) < 300) {
                    return;
                }
            }

            //		DebugMsg( TOPIC_JA2, DBG_LEVEL_0, String( "Removing Overlay message") );

            RemoveVideoOverlay(giUIMessageOverlay);

            // Remove popup as well....
            if (iUIMessageBox != -1) {
                RemoveMercPopupBoxFromIndex(iUIMessageBox);
                iUIMessageBox = -1;
            }

            giUIMessageOverlay = -1;
        }
        // iUIMessageBox = -1;
    }

    const PLAYER_TEAM_TIMER_SEC_PER_TICKS = 100;
    const PLAYER_TEAM_TIMER_INTTERUPT_GRACE = Math.trunc(15000 / PLAYER_TEAM_TIMER_SEC_PER_TICKS);
    const PLAYER_TEAM_TIMER_GRACE_PERIOD = 1000;
    const PLAYER_TEAM_TIMER_TICKS_PER_OK_MERC = Math.trunc(15000 / PLAYER_TEAM_TIMER_SEC_PER_TICKS);
    const PLAYER_TEAM_TIMER_TICKS_PER_NOTOK_MERC = Math.trunc(5000 / PLAYER_TEAM_TIMER_SEC_PER_TICKS);
    const PLAYER_TEAM_TIMER_TICKS_FROM_END_TO_START_BEEP = Math.trunc(5000 / PLAYER_TEAM_TIMER_SEC_PER_TICKS);
    const PLAYER_TEAM_TIMER_TIME_BETWEEN_BEEPS = (500);
    const PLAYER_TEAM_TIMER_TICKS_PER_ENEMY = Math.trunc(2000 / PLAYER_TEAM_TIMER_SEC_PER_TICKS);

    export function AddTopMessage(ubType: UINT8, pzString: string /* Pointer<UINT16> */): boolean {
        let cnt: UINT32;
        let fFound: boolean = false;

        // Set time of last update
        gTopMessage.uiTimeOfLastUpdate = GetJA2Clock();

        // Set flag to animate down...
        // gTopMessage.bAnimate = -1;
        // gTopMessage.bYPos		 = 2;

        gTopMessage.bAnimate = 0;
        gTopMessage.bYPos = 20;
        gTopMessage.fCreated = true;

        fFound = true;
        cnt = 0;

        if (fFound) {
            gTopMessage.bCurrentMessage = cnt;

            gTacticalStatus.ubTopMessageType = ubType;
            gTacticalStatus.fInTopMessage = true;

            // Copy string
            gTacticalStatus.zTopMessageString = pzString;

            CreateTopMessage(gTopMessage.uiSurface, ubType, pzString);

            return true;
        }

        return false;
    }

    function CreateTopMessage(uiSurface: UINT32, ubType: UINT8, psString: string /* Pointer<UINT16> */): void {
        let uiBAR: UINT32;
        let uiPLAYERBAR: UINT32;
        let uiINTBAR: UINT32;
        let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
        let sX: INT16;
        let sY: INT16;
        let cnt2: INT32;
        let sBarX: INT16 = 0;
        let uiBarToUseInUpDate: UINT32 = 0;
        let fDoLimitBar: boolean = false;

        let dNumStepsPerEnemy: FLOAT;
        let dLength: FLOAT;
        let dCurSize: FLOAT;

        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;

        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\rect.sti");

        if (!(uiBAR = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\rect.sti");

        // if ( gGameOptions.fTurnTimeLimit )
        {
            VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\timebargreen.sti");
            if (!(uiPLAYERBAR = AddVideoObject(VObjectDesc)))
                AssertMsg(0, "Missing INTERFACE\\timebargreen.sti");
        }

        VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\timebaryellow.sti");
        if (!(uiINTBAR = AddVideoObject(VObjectDesc)))
            AssertMsg(0, "Missing INTERFACE\\timebaryellow.sti");

        // Change dest buffer
        SetFontDestBuffer(uiSurface, 0, 0, 640, 20, false);
        SetFont(TINYFONT1());

        switch (ubType) {
            case Enum216.COMPUTER_TURN_MESSAGE:
            case Enum216.COMPUTER_INTERRUPT_MESSAGE:
            case Enum216.MILITIA_INTERRUPT_MESSAGE:
            case Enum216.AIR_RAID_TURN_MESSAGE:

                // Render rect into surface
                BltVideoObjectFromIndex(uiSurface, uiBAR, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);
                SetFontBackground(FONT_MCOLOR_BLACK);
                SetFontForeground(FONT_MCOLOR_WHITE);
                uiBarToUseInUpDate = uiBAR;
                fDoLimitBar = true;
                break;

            case Enum216.PLAYER_INTERRUPT_MESSAGE:

                // Render rect into surface
                BltVideoObjectFromIndex(uiSurface, uiINTBAR, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);
                SetFontBackground(FONT_MCOLOR_BLACK);
                SetFontForeground(FONT_MCOLOR_BLACK);
                SetFontShadow(NO_SHADOW);
                uiBarToUseInUpDate = uiINTBAR;
                break;

            case Enum216.PLAYER_TURN_MESSAGE:

                // Render rect into surface
                // if ( gGameOptions.fTurnTimeLimit )
            {
                BltVideoObjectFromIndex(uiSurface, uiPLAYERBAR, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);
            }
                // else
                //{
                //	BltVideoObjectFromIndex( uiSurface, uiPLAYERBAR, 13, 0, 0, VO_BLT_SRCTRANSPARENCY, NULL );
                //}
                SetFontBackground(FONT_MCOLOR_BLACK);
                SetFontForeground(FONT_MCOLOR_BLACK);
                SetFontShadow(NO_SHADOW);
                uiBarToUseInUpDate = uiPLAYERBAR;
                break;
        }

        if (gGameOptions.fTurnTimeLimit) {
            if (ubType == Enum216.PLAYER_TURN_MESSAGE || ubType == Enum216.PLAYER_INTERRUPT_MESSAGE) {
                fDoLimitBar = true;
            }
        }

        if (fDoLimitBar) {
            dNumStepsPerEnemy = (PROG_BAR_LENGTH / gTacticalStatus.usTactialTurnLimitMax);

            // Alrighty, do some fun stuff!

            // Render end peice
            sBarX = PROG_BAR_START_X;
            BltVideoObjectFromIndex(uiSurface, uiBarToUseInUpDate, 1, sBarX, PROG_BAR_START_Y, VO_BLT_SRCTRANSPARENCY, null);

            // Determine Length
            dLength = (gTacticalStatus.usTactialTurnLimitCounter) * dNumStepsPerEnemy;

            dCurSize = 0;
            cnt2 = 0;

            while (dCurSize < dLength) {
                sBarX++;

                // Check sBarX, ( just as a precaution )
                if (sBarX > 639) {
                    break;
                }

                BltVideoObjectFromIndex(uiSurface, uiBarToUseInUpDate, (2 + cnt2), sBarX, PROG_BAR_START_Y, VO_BLT_SRCTRANSPARENCY, null);

                dCurSize++;
                cnt2++;

                if (cnt2 == 10) {
                    cnt2 = 0;
                }
            }

            // Do end...
            if (gTacticalStatus.usTactialTurnLimitCounter == gTacticalStatus.usTactialTurnLimitMax) {
                sBarX++;
                BltVideoObjectFromIndex(uiSurface, uiBarToUseInUpDate, (2 + cnt2), sBarX, PROG_BAR_START_Y, VO_BLT_SRCTRANSPARENCY, null);
                sBarX++;
                BltVideoObjectFromIndex(uiSurface, uiBarToUseInUpDate, (12), sBarX, PROG_BAR_START_Y, VO_BLT_SRCTRANSPARENCY, null);
            }
        }

        // Delete rect
        DeleteVideoObjectFromIndex(uiBAR);
        DeleteVideoObjectFromIndex(uiINTBAR);

        // if ( gGameOptions.fTurnTimeLimit )
        {
            DeleteVideoObjectFromIndex(uiPLAYERBAR);
        }

        // Draw text....
        ({sX, sY} = FindFontCenterCoordinates(320, 7, 1, 1, psString, TINYFONT1()));
        mprintf(sX, sY, psString);

        // Change back...
        SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

        // Done!
        SetFontShadow(DEFAULT_SHADOW);

        gfTopMessageDirty = true;
    }

    function TurnExpiredCallBack(bExitValue: UINT8): void {
        // End turn...
        UIHandleEndTurn(null);
    }

    function CheckForAndHandleEndPlayerTimeLimit(): void {
        if (gTacticalStatus.fInTopMessage) {
            if (gGameOptions.fTurnTimeLimit) {
                if (gTacticalStatus.ubTopMessageType == Enum216.PLAYER_TURN_MESSAGE || gTacticalStatus.ubTopMessageType == Enum216.PLAYER_INTERRUPT_MESSAGE) {
                    if (gTacticalStatus.usTactialTurnLimitCounter == (gTacticalStatus.usTactialTurnLimitMax - 1)) {
                        // ATE: increase this so that we don't go into here again...
                        gTacticalStatus.usTactialTurnLimitCounter++;

                        // OK, set message that time limit has expired....
                        // DoMessageBox( MSG_BOX_BASIC_STYLE, L"Turn has Expired!", GAME_SCREEN, ( UINT8 )MSG_BOX_FLAG_OK, TurnExpiredCallBack, NULL );

                        // End turn...
                        UIHandleEndTurn(null);
                    }
                }
            }
        }
    }

    export function HandleTopMessages(): void {
        // UINT32		uiTime;
        let BltFx: blt_vs_fx = createBltVsFx();

        // OK, is out current count > 0 ?
        if (gTacticalStatus.fInTopMessage) {
            // gfTopMessageDirty = TRUE;

            // ATE: If we are told to go into top message, but we have not
            // initialized it yet...
            // This is mostly for loading saved games.....
            if (!gTopMessage.fCreated) {
                gfTopMessageDirty = true;
                AddTopMessage(gTacticalStatus.ubTopMessageType, gTacticalStatus.zTopMessageString);
            }

            if (gTacticalStatus.ubTopMessageType == Enum216.COMPUTER_TURN_MESSAGE || gTacticalStatus.ubTopMessageType == Enum216.COMPUTER_INTERRUPT_MESSAGE || gTacticalStatus.ubTopMessageType == Enum216.MILITIA_INTERRUPT_MESSAGE || gTacticalStatus.ubTopMessageType == Enum216.AIR_RAID_TURN_MESSAGE) {
                // OK, update timer.....
                if (TIMECOUNTERDONE(giTimerTeamTurnUpdate, PLAYER_TEAM_TIMER_SEC_PER_TICKS)) {
                    giTimerTeamTurnUpdate = RESETTIMECOUNTER(PLAYER_TEAM_TIMER_SEC_PER_TICKS);

                    // Update counter....
                    if (gTacticalStatus.usTactialTurnLimitCounter < gTacticalStatus.usTactialTurnLimitMax) {
                        gTacticalStatus.usTactialTurnLimitCounter++;
                    }

                    // Check if we have reach limit...
                    if (gTacticalStatus.usTactialTurnLimitCounter >= ((gubProgCurEnemy) * PLAYER_TEAM_TIMER_TICKS_PER_ENEMY)) {
                        gTacticalStatus.usTactialTurnLimitCounter = ((gubProgCurEnemy) * PLAYER_TEAM_TIMER_TICKS_PER_ENEMY);
                    }

                    CreateTopMessage(gTopMessage.uiSurface, gTacticalStatus.ubTopMessageType, gTacticalStatus.zTopMessageString);
                }
            } else if (gGameOptions.fTurnTimeLimit) {
                if (gTacticalStatus.ubTopMessageType == Enum216.PLAYER_TURN_MESSAGE || gTacticalStatus.ubTopMessageType == Enum216.PLAYER_INTERRUPT_MESSAGE) {
                    if (!gfUserTurnRegionActive && !AreWeInAUIMenu()) {
                        // Check Grace period...
                        if ((GetJA2Clock() - gTacticalStatus.uiTactialTurnLimitClock) > PLAYER_TEAM_TIMER_GRACE_PERIOD) {
                            gTacticalStatus.uiTactialTurnLimitClock = 0;

                            if (TIMECOUNTERDONE(giTimerTeamTurnUpdate, PLAYER_TEAM_TIMER_SEC_PER_TICKS)) {
                                giTimerTeamTurnUpdate = RESETTIMECOUNTER(PLAYER_TEAM_TIMER_SEC_PER_TICKS);

                                if (gTacticalStatus.fTactialTurnLimitStartedBeep) {
                                    if ((GetJA2Clock() - gTopMessage.uiTimeSinceLastBeep) > PLAYER_TEAM_TIMER_TIME_BETWEEN_BEEPS) {
                                        gTopMessage.uiTimeSinceLastBeep = GetJA2Clock();

                                        // Start sample....
                                        PlayJA2SampleFromFile("SOUNDS\\TURN_NEAR_END.WAV", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
                                    }
                                }

                                // OK, have we gone past the time to
                                if (!gTacticalStatus.fTactialTurnLimitStartedBeep && (gTacticalStatus.usTactialTurnLimitMax - gTacticalStatus.usTactialTurnLimitCounter) < PLAYER_TEAM_TIMER_TICKS_FROM_END_TO_START_BEEP) {
                                    gTacticalStatus.fTactialTurnLimitStartedBeep = true;

                                    gTopMessage.uiTimeSinceLastBeep = GetJA2Clock();
                                }

                                // Update counter....
                                if (gTacticalStatus.usTactialTurnLimitCounter < gTacticalStatus.usTactialTurnLimitMax) {
                                    gTacticalStatus.usTactialTurnLimitCounter++;
                                }

                                CreateTopMessage(gTopMessage.uiSurface, gTacticalStatus.ubTopMessageType, gTacticalStatus.zTopMessageString);

                                // Have we reached max?
                                if (gTacticalStatus.usTactialTurnLimitCounter == (gTacticalStatus.usTactialTurnLimitMax - 1)) {
                                    // IF we are not in lock ui mode....
                                    CheckForAndHandleEndPlayerTimeLimit();
                                }
                            }
                        }
                    }
                }
            }

            // Set redner viewport value
            gsVIEWPORT_WINDOW_START_Y = 20;

            // Check if we have scrolled...
            if (gTopMessage.sWorldRenderX != gsRenderCenterX || gTopMessage.sWorldRenderY != gsRenderCenterY) {
                gfTopMessageDirty = true;
            }

            if (gfTopMessageDirty) {
                gTopMessage.sWorldRenderX = gsRenderCenterX;
                gTopMessage.sWorldRenderY = gsRenderCenterY;

                // Redner!
                BltFx.SrcRect.iLeft = 0;
                BltFx.SrcRect.iTop = 20 - gTopMessage.bYPos;
                BltFx.SrcRect.iRight = 640;
                BltFx.SrcRect.iBottom = 20;

                BltVideoSurface(FRAME_BUFFER, gTopMessage.uiSurface, 0, 0, 0, VS_BLT_SRCSUBRECT, BltFx);

                // Save to save buffer....
                BltFx.SrcRect.iLeft = 0;
                BltFx.SrcRect.iTop = 0;
                BltFx.SrcRect.iRight = 640;
                BltFx.SrcRect.iBottom = 20;

                BltVideoSurface(guiSAVEBUFFER, FRAME_BUFFER, 0, 0, 0, VS_BLT_SRCSUBRECT, BltFx);

                InvalidateRegion(0, 0, 640, 20);

                gfTopMessageDirty = false;
            }
        } else {
            // Set redner viewport value
            gsVIEWPORT_WINDOW_START_Y = 0;
        }
    }

    export function EndTopMessage(): void {
        //	blt_vs_fx BltFx;

        // OK, end the topmost message!
        if (gTacticalStatus.fInTopMessage) {
            // Are we the last?
            // if ( gTopMessage.bCurrentMessage == 1 )
            {
                // We are....
                // Re-render our strip and then copy to the save buffer...
                gsVIEWPORT_WINDOW_START_Y = 0;
                gTacticalStatus.fInTopMessage = false;

                SetRenderFlags(RENDER_FLAG_FULL);
                // RenderStaticWorldRect( 0, 0, 640, 20, TRUE );
                // gsVIEWPORT_WINDOW_START_Y = 20;

                // Copy into save buffer...
                // BltFx.SrcRect.iLeft = 0;
                // BltFx.SrcRect.iTop  = 0;
                // BltFx.SrcRect.iRight = 640;
                // BltFx.SrcRect.iBottom = 20;

                // BltVideoSurface( guiSAVEBUFFER, FRAME_BUFFER, 0,
                //															 0, 0,
                //															 VS_BLT_SRCSUBRECT, &BltFx );
            }
            // else
            //{
            // Render to save buffer
            //	CreateTopMessage( guiSAVEBUFFER, gTopMessageTypes[ 0 ], gzTopMessageStrings[ 0 ] );
            //}

            // Animate up...
            // gTopMessage.bAnimate = 1;
            // Set time of last update
            // gTopMessage.uiTimeOfLastUpdate = GetJA2Clock( ) + 150;

            // Handle first frame now...
            // HandleTopMessages( );
        }
    }

    export function InTopMessageBarAnimation(): boolean {
        if (gTacticalStatus.fInTopMessage) {
            if (gTopMessage.bAnimate != 0) {
                HandleTopMessages();

                return true;
            }
        }

        return false;
    }

    export function PauseRT(fPause: boolean): void {
        // StopMercAnimation( fPause );

        if (fPause) {
            //	PauseGame( );
        } else {
            //	UnPauseGame( );
        }
    }

    export function InitEnemyUIBar(ubNumEnemies: UINT8, ubDoneEnemies: UINT8): void {
        // OK, set value
        gubProgNumEnemies = ubNumEnemies + ubDoneEnemies;
        gubProgCurEnemy = ubDoneEnemies;
        gfProgBarActive = true;

        gTacticalStatus.usTactialTurnLimitCounter = ubDoneEnemies * PLAYER_TEAM_TIMER_TICKS_PER_ENEMY;
        gTacticalStatus.usTactialTurnLimitMax = ((ubNumEnemies + ubDoneEnemies) * PLAYER_TEAM_TIMER_TICKS_PER_ENEMY);
    }

    export function UpdateEnemyUIBar(): void {
        // Are we active?
        if (gfProgBarActive) {
            // OK, update team limit counter....
            gTacticalStatus.usTactialTurnLimitCounter = (gubProgCurEnemy * PLAYER_TEAM_TIMER_TICKS_PER_ENEMY);

            gubProgCurEnemy++;
        }

        // Do we have an active enemy bar?
        if (gTacticalStatus.fInTopMessage) {
            if (gTacticalStatus.ubTopMessageType == Enum216.COMPUTER_TURN_MESSAGE) {
                // Update message!
                CreateTopMessage(gTopMessage.uiSurface, Enum216.COMPUTER_TURN_MESSAGE, gTacticalStatus.zTopMessageString);
            }
        }
    }

    export function InitPlayerUIBar(fInterrupt: UINT8 /* boolean */): void {
        let pTeamSoldier: SOLDIERTYPE;
        let cnt: INT32 = 0;
        let bNumOK: INT8 = 0;
        let bNumNotOK: INT8 = 0;

        if (!gGameOptions.fTurnTimeLimit) {
            if (fInterrupt == 1) {
                AddTopMessage(Enum216.PLAYER_INTERRUPT_MESSAGE, Message[Enum334.STR_INTERRUPT]);
            } else {
                // EndTopMessage();
                AddTopMessage(Enum216.PLAYER_TURN_MESSAGE, TeamTurnString[0]);
            }
            return;
        }

        // OK, calculate time....
        if (!fInterrupt || gTacticalStatus.usTactialTurnLimitMax == 0) {
            gTacticalStatus.usTactialTurnLimitCounter = 0;

            // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
            cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

            // look for all mercs on the same team,
            for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
                // Are we active and in sector.....
                if (pTeamSoldier.bActive && pTeamSoldier.bInSector) {
                    if (pTeamSoldier.bLife < OKLIFE) {
                        bNumNotOK++;
                    } else {
                        bNumOK++;
                    }
                }
            }

            gTacticalStatus.usTactialTurnLimitMax = (bNumOK * PLAYER_TEAM_TIMER_TICKS_PER_OK_MERC) + (bNumNotOK * PLAYER_TEAM_TIMER_TICKS_PER_NOTOK_MERC);
        } else {
            if (gTacticalStatus.usTactialTurnLimitCounter > PLAYER_TEAM_TIMER_INTTERUPT_GRACE) {
                gTacticalStatus.usTactialTurnLimitCounter -= PLAYER_TEAM_TIMER_INTTERUPT_GRACE;
            }
        }

        gTacticalStatus.uiTactialTurnLimitClock = 0;
        gTacticalStatus.fTactialTurnLimitStartedBeep = false;

        // RESET COIUNTER...
        giTimerTeamTurnUpdate = RESETTIMECOUNTER(PLAYER_TEAM_TIMER_SEC_PER_TICKS);

        // OK, set value
        if (fInterrupt != 1) {
            AddTopMessage(Enum216.PLAYER_TURN_MESSAGE, TeamTurnString[0]);
        } else {
            AddTopMessage(Enum216.PLAYER_INTERRUPT_MESSAGE, Message[Enum334.STR_INTERRUPT]);
        }
    }

    function MovementMenuBackregionCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
        if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
            CancelMovementMenu();
        }
    }

    function DoorMenuBackregionCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
        if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
            CancelOpenDoorMenu();
        }
    }

    export function GetSoldierHealthString(pSoldier: SOLDIERTYPE): string /* Pointer<UINT16> */ {
        let cnt: INT32;
        let cntStart: INT32;
        if (pSoldier.bLife == pSoldier.bLifeMax) {
            cntStart = 4;
        } else {
            cntStart = 0;
        }
        // Show health on others.........
        for (cnt = cntStart; cnt < 6; cnt++) {
            if (pSoldier.bLife < bHealthStrRanges[cnt]) {
                break;
            }
        }
        return zHealthStr[cnt];
    }

    interface AIMCUBE_UI_DATA {
        bHeight: INT8;
        bPower: INT8;
        sGridNo: INT16;
        ubLevel: UINT8;
        pSoldier: SOLDIERTYPE;
        fShowHeight: boolean;
        fShowPower: boolean;
        fActiveHeightBar: boolean;
        fActivePowerBar: boolean;
        fAtEndHeight: boolean;
        sTargetGridNo: INT16;
        dInitialForce: FLOAT;
        dForce: FLOAT;
        dDegrees: FLOAT;
        dMaxForce: FLOAT;
        ubPowerIndex: UINT8;
    }

    function createAimCubeUIData(): AIMCUBE_UI_DATA {
        return {
            bHeight: 0,
            bPower: 0,
            sGridNo: 0,
            ubLevel: 0,
            pSoldier: <SOLDIERTYPE><unknown>null,
            fShowHeight: false,
            fShowPower: false,
            fActiveHeightBar: false,
            fActivePowerBar: false,
            fAtEndHeight: false,
            sTargetGridNo: 0,
            dInitialForce: 0,
            dForce: 0,
            dDegrees: 0,
            dMaxForce: 0,
            ubPowerIndex: 0,
        };
    }

    /* static */
    let gfInAimCubeUI: boolean = false;
    /* static */
    let gCubeUIData: AIMCUBE_UI_DATA = createAimCubeUIData();

    const GET_CUBES_HEIGHT_FROM_UIHEIGHT = (h: number) => (32 + (h * 64));

    function CalculateAimCubeUIPhysics(): void {
        let ubHeight: UINT8;

        ubHeight = GET_CUBES_HEIGHT_FROM_UIHEIGHT(gCubeUIData.bHeight);

        if (gCubeUIData.fActiveHeightBar) {
            // OK, determine which power to use.....
            // TODO this: take force / max force * 10....
            gCubeUIData.ubPowerIndex = Math.trunc(gCubeUIData.dForce / gCubeUIData.dMaxForce * 10);
        }

        if (gCubeUIData.fActivePowerBar) {
            gCubeUIData.dForce = (gCubeUIData.dMaxForce * (gCubeUIData.ubPowerIndex / 10));

            // Limit to the max force...
            if (gCubeUIData.dForce > gCubeUIData.dMaxForce) {
                gCubeUIData.dForce = gCubeUIData.dMaxForce;
            }

            gCubeUIData.dDegrees = CalculateLaunchItemAngle(gCubeUIData.pSoldier, gCubeUIData.sGridNo, ubHeight, gCubeUIData.dForce, gCubeUIData.pSoldier.inv[Enum261.HANDPOS], createPropertyPointer(gCubeUIData, 'sTargetGridNo'));
        }
    }

    function GetInAimCubeUIGridNo(): INT16 {
        return gCubeUIData.sGridNo;
    }

    function InAimCubeUI(): boolean {
        return gfInAimCubeUI;
    }

    function AimCubeUIClick(): boolean {
        if (!gfInAimCubeUI) {
            return false;
        }

        // If we have clicked, and we are only on height, continue with power
        if (gCubeUIData.fActiveHeightBar && gCubeUIData.bHeight != 0) {
            gCubeUIData.fShowPower = true;
            gCubeUIData.fActiveHeightBar = false;
            gCubeUIData.fActivePowerBar = true;

            return false;
        } else {
            return true;
        }
    }

    function BeginAimCubeUI(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubLevel: INT8, bStartPower: UINT8, bStartHeight: INT8): void {
        gfInAimCubeUI = true;

        gCubeUIData.sGridNo = sGridNo;
        gCubeUIData.ubLevel = ubLevel;
        gCubeUIData.pSoldier = pSoldier;
        gCubeUIData.bPower = bStartPower;
        gCubeUIData.bHeight = bStartHeight;
        gCubeUIData.fShowHeight = true;
        gCubeUIData.fShowPower = false;
        gCubeUIData.fActivePowerBar = false;
        gCubeUIData.fActiveHeightBar = true;
        gCubeUIData.fAtEndHeight = false;
        gCubeUIData.dDegrees = Math.PI / 4;

        // Calculate Iniital force....
        CalculateAimCubeUIPhysics();
    }

    function EndAimCubeUI(): void {
        gfInAimCubeUI = false;
    }

    function IncrementAimCubeUI(): void {
        if (gCubeUIData.fActiveHeightBar) {
            // Cycle the last height yellow once
            if (gCubeUIData.bHeight == 3) {
                if (gCubeUIData.fAtEndHeight) {
                    gCubeUIData.bHeight = 0;
                    gCubeUIData.fAtEndHeight = false;
                } else {
                    gCubeUIData.fAtEndHeight = true;
                }
            } else {
                gCubeUIData.bHeight++;
            }

            CalculateAimCubeUIPhysics();
        }

        if (gCubeUIData.fActivePowerBar) {
            if (gCubeUIData.ubPowerIndex == 10) {
                let ubHeight: UINT8;

                ubHeight = GET_CUBES_HEIGHT_FROM_UIHEIGHT(gCubeUIData.bHeight);

                // Start back to basic7
                gCubeUIData.dDegrees = (Math.PI / 4);
                gCubeUIData.dInitialForce = gCubeUIData.dForce;

                // OK, determine which power to use.....
                // TODO this: take force / max force * 10....
                gCubeUIData.ubPowerIndex = Math.trunc(gCubeUIData.dForce / gCubeUIData.dMaxForce * 10);
            }

            // Cycle the last height yellow once
            gCubeUIData.ubPowerIndex++;

            CalculateAimCubeUIPhysics();
        }
    }

    function SetupAimCubeAI(): void {
        if (gfInAimCubeUI) {
            AddTopmostToHead(gCubeUIData.sTargetGridNo, Enum312.FIRSTPOINTERS2);
            (<LEVELNODE>gpWorldLevelData[gCubeUIData.sTargetGridNo].pTopmostHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
            (<LEVELNODE>gpWorldLevelData[gCubeUIData.sTargetGridNo].pTopmostHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;

            // AddTopmostToHead( gCubeUIData.sGridNo, FIRSTPOINTERS2 );
            // gpWorldLevelData[ gCubeUIData.sGridNo ].pTopmostHead->ubShadeLevel=DEFAULT_SHADE_LEVEL;
            // gpWorldLevelData[ gCubeUIData.sGridNo ].pTopmostHead->ubNaturalShadeLevel=DEFAULT_SHADE_LEVEL;
        }
    }

    function ResetAimCubeAI(): void {
        if (gfInAimCubeUI) {
            RemoveTopmost(gCubeUIData.sTargetGridNo, Enum312.FIRSTPOINTERS2);
            // RemoveTopmost( gCubeUIData.sGridNo, FIRSTPOINTERS2 );
        }
    }

    export function RenderAimCubeUI(): void {
        let sScreenX: INT16 = 0;
        let sScreenY: INT16 = 0;
        let cnt: INT32;
        let sBarHeight: INT16;
        let iBack: INT32;
        let bGraphicNum: INT8;

        if (gfInAimCubeUI) {
            // OK, given height
            if (gCubeUIData.fShowHeight) {
                // Determine screen location....
                ({sScreenX, sScreenY} = GetGridNoScreenPos(gCubeUIData.sGridNo, gCubeUIData.ubLevel));

                // Save background
                iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, sScreenX, (sScreenY - 70), (sScreenX + 40), (sScreenY + 50));
                if (iBack != -1) {
                    SetBackgroundRectFilled(iBack);
                }

                sBarHeight = 0;
                bGraphicNum = 0;

                if (gCubeUIData.bHeight == 3 && gCubeUIData.fAtEndHeight) {
                    bGraphicNum = 1;
                }

                // Do first level....
                BltVideoObjectFromIndex(FRAME_BUFFER, guiAIMCUBES, bGraphicNum, sScreenX, (sScreenY + sBarHeight), VO_BLT_SRCTRANSPARENCY, null);
                sBarHeight -= 3;
                BltVideoObjectFromIndex(FRAME_BUFFER, guiAIMCUBES, bGraphicNum, sScreenX, (sScreenY + sBarHeight), VO_BLT_SRCTRANSPARENCY, null);

                // Loop through height.....
                for (cnt = 1; cnt <= gCubeUIData.bHeight; cnt++) {
                    sBarHeight -= 3;
                    BltVideoObjectFromIndex(FRAME_BUFFER, guiAIMCUBES, bGraphicNum, sScreenX, (sScreenY + sBarHeight), VO_BLT_SRCTRANSPARENCY, null);
                    sBarHeight -= 3;
                    BltVideoObjectFromIndex(FRAME_BUFFER, guiAIMCUBES, bGraphicNum, sScreenX, (sScreenY + sBarHeight), VO_BLT_SRCTRANSPARENCY, null);
                    sBarHeight -= 3;
                    BltVideoObjectFromIndex(FRAME_BUFFER, guiAIMCUBES, bGraphicNum, sScreenX, (sScreenY + sBarHeight), VO_BLT_SRCTRANSPARENCY, null);
                    sBarHeight -= 3;
                    BltVideoObjectFromIndex(FRAME_BUFFER, guiAIMCUBES, bGraphicNum, sScreenX, (sScreenY + sBarHeight), VO_BLT_SRCTRANSPARENCY, null);
                }
            }

            if (gCubeUIData.fShowPower) {
                sBarHeight = -50;

                BltVideoObjectFromIndex(FRAME_BUFFER, guiAIMBARS, gCubeUIData.ubPowerIndex, sScreenX, (sScreenY + sBarHeight), VO_BLT_SRCTRANSPARENCY, null);
            }
        }
    }

    function GetLaunchItemParamsFromUI(): void {
    }

    /* static */
    let gfDisplayPhysicsUI: boolean = false;
    /* static */
    let gsPhysicsImpactPointGridNo: INT16;
    /* static */
    let gbPhysicsImpactPointLevel: INT8;
    /* static */
    let gfBadPhysicsCTGT: boolean = false;

    export function BeginPhysicsTrajectoryUI(sGridNo: INT16, bLevel: INT8, fBadCTGT: boolean): void {
        gfDisplayPhysicsUI = true;
        gsPhysicsImpactPointGridNo = sGridNo;
        gbPhysicsImpactPointLevel = bLevel;
        gfBadPhysicsCTGT = fBadCTGT;
    }

    export function EndPhysicsTrajectoryUI(): void {
        gfDisplayPhysicsUI = false;
    }

    export function SetupPhysicsTrajectoryUI(): void {
        if (gfDisplayPhysicsUI && gfUIHandlePhysicsTrajectory) {
            if (gbPhysicsImpactPointLevel == 0) {
                if (gfBadPhysicsCTGT) {
                    AddTopmostToHead(gsPhysicsImpactPointGridNo, Enum312.FIRSTPOINTERS12);
                } else {
                    AddTopmostToHead(gsPhysicsImpactPointGridNo, Enum312.FIRSTPOINTERS8);
                }
                (<LEVELNODE>gpWorldLevelData[gsPhysicsImpactPointGridNo].pTopmostHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
                (<LEVELNODE>gpWorldLevelData[gsPhysicsImpactPointGridNo].pTopmostHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
            } else {
                if (gfBadPhysicsCTGT) {
                    AddOnRoofToHead(gsPhysicsImpactPointGridNo, Enum312.FIRSTPOINTERS12);
                } else {
                    AddOnRoofToHead(gsPhysicsImpactPointGridNo, Enum312.FIRSTPOINTERS8);
                }
                (<LEVELNODE>gpWorldLevelData[gsPhysicsImpactPointGridNo].pOnRoofHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
                (<LEVELNODE>gpWorldLevelData[gsPhysicsImpactPointGridNo].pOnRoofHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
            }
        }
    }

    export function ResetPhysicsTrajectoryUI(): void {
        if (gfDisplayPhysicsUI) {
            RemoveTopmost(gsPhysicsImpactPointGridNo, Enum312.FIRSTPOINTERS8);
            RemoveTopmost(gsPhysicsImpactPointGridNo, Enum312.FIRSTPOINTERS12);
            RemoveOnRoof(gsPhysicsImpactPointGridNo, Enum312.FIRSTPOINTERS8);
            RemoveOnRoof(gsPhysicsImpactPointGridNo, Enum312.FIRSTPOINTERS12);
        }
    }

    export function DirtyTopMessage(): void {
        gTopMessage.fCreated = false;
    }

    function CalcUIMessageDuration(wString: string /* STR16 */): UINT32 {
        // base + X per letter
        return 1000 + 50 * wString.length;
    }

    let gfMultipurposeLocatorOn: boolean = false;
    let guiMultiPurposeLocatorLastUpdate: UINT32;
    let gbMultiPurposeLocatorFrame: INT8;
    let gsMultiPurposeLocatorGridNo: INT16;
    let gbMultiPurposeLocatorLevel: INT8;
    let gbMultiPurposeLocatorCycles: INT8;

    export function BeginMultiPurposeLocator(sGridNo: INT16, bLevel: INT8, fSlideTo: boolean): void {
        guiMultiPurposeLocatorLastUpdate = 0;
        gbMultiPurposeLocatorCycles = 0;
        gbMultiPurposeLocatorFrame = 0;
        gfMultipurposeLocatorOn = true;

        gsMultiPurposeLocatorGridNo = sGridNo;
        gbMultiPurposeLocatorLevel = bLevel;

        if (fSlideTo) {
            // FIRST CHECK IF WE ARE ON SCREEN
            if (GridNoOnScreen(sGridNo)) {
                return;
            }

            // sGridNo here for DG compatibility
            gTacticalStatus.sSlideTarget = sGridNo;
            gTacticalStatus.sSlideReason = NOBODY;

            // Plot new path!
            gfPlotNewMovement = true;
        }
    }

    export function HandleMultiPurposeLocator(): void {
        let uiClock: UINT32;

        if (!gfMultipurposeLocatorOn) {
            return;
        }

        // Update radio locator
        uiClock = GetJA2Clock();

        // Update frame values!
        if ((uiClock - guiMultiPurposeLocatorLastUpdate) > 80) {
            guiMultiPurposeLocatorLastUpdate = uiClock;

            // Update frame
            gbMultiPurposeLocatorFrame++;

            if (gbMultiPurposeLocatorFrame == 5) {
                gbMultiPurposeLocatorFrame = 0;
                gbMultiPurposeLocatorCycles++;
            }

            if (gbMultiPurposeLocatorCycles == 8) {
                gfMultipurposeLocatorOn = false;
            }
        }
    }

    export function RenderTopmostMultiPurposeLocator(): void {
        let dOffsetX: FLOAT;
        let dOffsetY: FLOAT;
        let dTempX_S: FLOAT;
        let dTempY_S: FLOAT;
        let sX: INT16;
        let sY: INT16;
        let sXPos: INT16;
        let sYPos: INT16;
        let iBack: INT32;

        if (!gfMultipurposeLocatorOn) {
            return;
        }

        ({sX, sY} = ConvertGridNoToCenterCellXY(gsMultiPurposeLocatorGridNo));

        dOffsetX = (sX - gsRenderCenterX);
        dOffsetY = (sY - gsRenderCenterY);

        // Calculate guy's position
        ({dScreenX: dTempX_S, dScreenY: dTempY_S} = FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

        sXPos = Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + Math.trunc(dTempX_S);
        sYPos = Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + Math.trunc(dTempY_S) - gpWorldLevelData[gsMultiPurposeLocatorGridNo].sHeight;

        // Adjust for offset position on screen
        sXPos -= gsRenderWorldOffsetX;
        sYPos -= gsRenderWorldOffsetY;

        // Adjust for render height
        sYPos += gsRenderHeight;

        // Adjust for level height
        if (gbMultiPurposeLocatorLevel) {
            sYPos -= ROOF_LEVEL_HEIGHT;
        }

        // Center circle!
        sXPos -= 20;
        sYPos -= 20;

        iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, sXPos, sYPos, (sXPos + 40), (sYPos + 40));
        if (iBack != -1) {
            SetBackgroundRectFilled(iBack);
        }

        BltVideoObjectFromIndex(FRAME_BUFFER, guiRADIO, gbMultiPurposeLocatorFrame, sXPos, sYPos, VO_BLT_SRCTRANSPARENCY, null);
    }

}
