namespace ja2 {
  const MSGBOX_DEFAULT_WIDTH = 300;

  const MSGBOX_BUTTON_WIDTH = 61;
  const MSGBOX_BUTTON_HEIGHT = 20;
  const MSGBOX_BUTTON_X_SEP = 15;

  const MSGBOX_SMALL_BUTTON_WIDTH = 31;
  const MSGBOX_SMALL_BUTTON_X_SEP = 8;

  type MSGBOX_CALLBACK = (bExitValue: UINT8) => void;

  // old mouse x and y positions
  let pOldMousePosition: SGPPoint = createSGPPoint();
  let MessageBoxRestrictedCursorRegion: SGPRect = createSGPRect();

  // if the cursor was locked to a region
  let fCursorLockedToArea: boolean = false;
  export let gfInMsgBox: boolean = false;

  let gOldCursorLimitRectangle: SGPRect = createSGPRect();

  export let gMsgBox: MESSAGE_BOX_STRUCT = createMessageBoxStruct();
  let gfNewMessageBox: boolean = false;
  let gfStartedFromGameScreen: boolean = false;
  export let gfStartedFromMapScreen: boolean = false;
  export let fRestoreBackgroundForMessageBox: boolean = false;
  export let gfDontOverRideSaveBuffer: boolean = true; // this variable can be unset if ur in a non gamescreen and DONT want the msg box to use the save buffer

  export let gzUserDefinedButton1: string /* CHAR16[128] */;
  export let gzUserDefinedButton2: string /* CHAR16[128] */;

  export function DoMessageBox(
    ubStyle: UINT8,
    zString: string /* Pointer<INT16> */,
    uiExitScreen: UINT32,
    usFlags: UINT16,
    ReturnCallback: MSGBOX_CALLBACK | null,
    pCenteringRect: SGPRect | null,
  ): INT32 {
    let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
    let usTextBoxWidth: UINT16 = 0;
    let usTextBoxHeight: UINT16 = 0;
    let aRect: SGPRect = createSGPRect();
    let uiDestPitchBYTES: UINT32 = 0;
    let uiSrcPitchBYTES: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray;
    let pSrcBuf: Uint8ClampedArray;
    let sButtonX: INT16;
    let sButtonY: INT16;
    let sBlankSpace: INT16;
    let ubMercBoxBackground: UINT8 = Enum324.BASIC_MERC_POPUP_BACKGROUND;
    let ubMercBoxBorder: UINT8 = Enum325.BASIC_MERC_POPUP_BORDER;
    let ubFontColor: UINT8;
    let ubFontShadowColor: UINT8;
    let usCursor: UINT16;
    let iId: INT32 = -1;

    GetMousePos(pOldMousePosition);

    // this variable can be unset if ur in a non gamescreen and DONT want the msg box to use the save buffer
    gfDontOverRideSaveBuffer = true;

    SetCurrentCursorFromDatabase(Enum317.CURSOR_NORMAL);

    if (gMsgBox.BackRegion.uiFlags & MSYS_REGION_EXISTS) {
      return 0;
    }

    // Based on style....
    switch (ubStyle) {
      // default
      case Enum24.MSG_BOX_BASIC_STYLE:
        ubMercBoxBackground = Enum324.DIALOG_MERC_POPUP_BACKGROUND;
        ubMercBoxBorder = Enum325.DIALOG_MERC_POPUP_BORDER;

        // Add button images
        gMsgBox.iButtonImages = LoadButtonImage(
          "INTERFACE\\popupbuttons.sti",
          -1,
          0,
          -1,
          1,
          -1,
        );
        ubFontColor = FONT_MCOLOR_WHITE;
        ubFontShadowColor = DEFAULT_SHADOW;
        usCursor = Enum317.CURSOR_NORMAL;

        break;

      case Enum24.MSG_BOX_RED_ON_WHITE:
        ubMercBoxBackground = Enum324.WHITE_MERC_POPUP_BACKGROUND;
        ubMercBoxBorder = Enum325.RED_MERC_POPUP_BORDER;

        // Add button images
        gMsgBox.iButtonImages = LoadButtonImage(
          "INTERFACE\\msgboxRedButtons.sti",
          -1,
          0,
          -1,
          1,
          -1,
        );

        ubFontColor = 2;
        ubFontShadowColor = NO_SHADOW;
        usCursor = Enum317.CURSOR_LAPTOP_SCREEN;
        break;

      case Enum24.MSG_BOX_BLUE_ON_GREY:
        ubMercBoxBackground = Enum324.GREY_MERC_POPUP_BACKGROUND;
        ubMercBoxBorder = Enum325.BLUE_MERC_POPUP_BORDER;

        // Add button images
        gMsgBox.iButtonImages = LoadButtonImage(
          "INTERFACE\\msgboxGreyButtons.sti",
          -1,
          0,
          -1,
          1,
          -1,
        );

        ubFontColor = 2;
        ubFontShadowColor = FONT_MCOLOR_WHITE;
        usCursor = Enum317.CURSOR_LAPTOP_SCREEN;
        break;
      case Enum24.MSG_BOX_IMP_STYLE:
        ubMercBoxBackground = Enum324.IMP_POPUP_BACKGROUND;
        ubMercBoxBorder = Enum325.DIALOG_MERC_POPUP_BORDER;

        // Add button images
        gMsgBox.iButtonImages = LoadButtonImage(
          "INTERFACE\\msgboxGreyButtons.sti",
          -1,
          0,
          -1,
          1,
          -1,
        );

        ubFontColor = 2;
        ubFontShadowColor = FONT_MCOLOR_WHITE;
        usCursor = Enum317.CURSOR_LAPTOP_SCREEN;
        break;
      case Enum24.MSG_BOX_BASIC_SMALL_BUTTONS:
        ubMercBoxBackground = Enum324.DIALOG_MERC_POPUP_BACKGROUND;
        ubMercBoxBorder = Enum325.DIALOG_MERC_POPUP_BORDER;

        // Add button images
        gMsgBox.iButtonImages = LoadButtonImage(
          "INTERFACE\\popupbuttons.sti",
          -1,
          2,
          -1,
          3,
          -1,
        );
        ubFontColor = FONT_MCOLOR_WHITE;
        ubFontShadowColor = DEFAULT_SHADOW;
        usCursor = Enum317.CURSOR_NORMAL;

        break;

      case Enum24.MSG_BOX_LAPTOP_DEFAULT:
        ubMercBoxBackground = Enum324.LAPTOP_POPUP_BACKGROUND;
        ubMercBoxBorder = Enum325.LAPTOP_POP_BORDER;

        // Add button images
        gMsgBox.iButtonImages = LoadButtonImage(
          "INTERFACE\\popupbuttons.sti",
          -1,
          0,
          -1,
          1,
          -1,
        );
        ubFontColor = FONT_MCOLOR_WHITE;
        ubFontShadowColor = DEFAULT_SHADOW;
        usCursor = Enum317.CURSOR_LAPTOP_SCREEN;
        break;

      default:
        ubMercBoxBackground = Enum324.BASIC_MERC_POPUP_BACKGROUND;
        ubMercBoxBorder = Enum325.BASIC_MERC_POPUP_BORDER;

        // Add button images
        gMsgBox.iButtonImages = LoadButtonImage(
          "INTERFACE\\msgboxbuttons.sti",
          -1,
          0,
          -1,
          1,
          -1,
        );
        ubFontColor = FONT_MCOLOR_WHITE;
        ubFontShadowColor = DEFAULT_SHADOW;
        usCursor = Enum317.CURSOR_NORMAL;
        break;
    }

    if (usFlags & MSG_BOX_FLAG_USE_CENTERING_RECT && pCenteringRect != null) {
      aRect.iTop = pCenteringRect.iTop;
      aRect.iLeft = pCenteringRect.iLeft;
      aRect.iBottom = pCenteringRect.iBottom;
      aRect.iRight = pCenteringRect.iRight;
    } else {
      // Use default!
      aRect.iTop = 0;
      aRect.iLeft = 0;
      aRect.iBottom = 480;
      aRect.iRight = 640;
    }

    // Set some values!
    gMsgBox.usFlags = usFlags;
    gMsgBox.uiExitScreen = uiExitScreen;
    gMsgBox.ExitCallback = ReturnCallback;
    gMsgBox.fRenderBox = true;
    gMsgBox.bHandled = 0;

    // Init message box
    gMsgBox.iBoxId = PrepareMercPopupBox(
      iId,
      ubMercBoxBackground,
      ubMercBoxBorder,
      zString,
      MSGBOX_DEFAULT_WIDTH,
      40,
      10,
      30,
      createPointer(
        () => usTextBoxWidth,
        (v) => (usTextBoxWidth = v),
      ),
      createPointer(
        () => usTextBoxHeight,
        (v) => (usTextBoxHeight = v),
      ),
    );

    if (gMsgBox.iBoxId == -1) {
      return 0;
    }

    // Save height,width
    gMsgBox.usWidth = usTextBoxWidth;
    gMsgBox.usHeight = usTextBoxHeight;

    // Determine position ( centered in rect )
    gMsgBox.sX =
      Math.trunc((aRect.iRight - aRect.iLeft - usTextBoxWidth) / 2) +
      aRect.iLeft;
    gMsgBox.sY =
      Math.trunc((aRect.iBottom - aRect.iTop - usTextBoxHeight) / 2) +
      aRect.iTop;

    if (guiCurrentScreen == Enum26.GAME_SCREEN) {
      gfStartedFromGameScreen = true;
    }

    if (fInMapMode == true) {
      //		fMapExitDueToMessageBox = TRUE;
      gfStartedFromMapScreen = true;
      fMapPanelDirty = true;
    }

    // Set pending screen
    SetPendingNewScreen(Enum26.MSG_BOX_SCREEN);

    // Init save buffer
    vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
    vs_desc.usWidth = usTextBoxWidth;
    vs_desc.usHeight = usTextBoxHeight;
    vs_desc.ubBitDepth = 16;

    if ((gMsgBox.uiSaveBuffer = AddVideoSurface(vs_desc)) === -1) {
      return -1;
    }

    // Save what we have under here...
    pDestBuf = LockVideoSurface(
      gMsgBox.uiSaveBuffer,
      createPointer(
        () => uiDestPitchBYTES,
        (v) => (uiDestPitchBYTES = v),
      ),
    );
    pSrcBuf = LockVideoSurface(
      FRAME_BUFFER,
      createPointer(
        () => uiSrcPitchBYTES,
        (v) => (uiSrcPitchBYTES = v),
      ),
    );

    Blt16BPPTo16BPP(
      pDestBuf,
      uiDestPitchBYTES,
      pSrcBuf,
      uiSrcPitchBYTES,
      0,
      0,
      gMsgBox.sX,
      gMsgBox.sY,
      usTextBoxWidth,
      usTextBoxHeight,
    );

    UnLockVideoSurface(gMsgBox.uiSaveBuffer);
    UnLockVideoSurface(FRAME_BUFFER);

    // Create top-level mouse region
    MSYS_DefineRegion(
      gMsgBox.BackRegion,
      0,
      0,
      640,
      480,
      MSYS_PRIORITY_HIGHEST,
      usCursor,
      MSYS_NO_CALLBACK,
      MsgBoxClickCallback,
    );

    if (gGameSettings.fOptions[Enum8.TOPTION_DONT_MOVE_MOUSE] == false) {
      if (usFlags & MSG_BOX_FLAG_OK) {
        SimulateMouseMovement(
          gMsgBox.sX + usTextBoxWidth / 2 + 27,
          gMsgBox.sY + (usTextBoxHeight - 10),
        );
      } else {
        SimulateMouseMovement(
          gMsgBox.sX + usTextBoxWidth / 2,
          gMsgBox.sY + usTextBoxHeight - 4,
        );
      }
    }

    // Add region
    MSYS_AddRegion(gMsgBox.BackRegion);

    // findout if cursor locked, if so, store old params and store, restore when done
    if (IsCursorRestricted()) {
      fCursorLockedToArea = true;
      GetRestrictedClipCursor(MessageBoxRestrictedCursorRegion);
      FreeMouseCursor();
    }

    // Create four numbered buttons
    if (usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
      // This is exclusive of any other buttons... no ok, no cancel, no nothing

      sBlankSpace =
        usTextBoxWidth -
        MSGBOX_SMALL_BUTTON_WIDTH * 4 -
        MSGBOX_SMALL_BUTTON_X_SEP * 3;
      sButtonX = Math.trunc(sBlankSpace / 2);
      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiButton[0] = CreateIconAndTextButton(
        gMsgBox.iButtonImages,
        "1",
        FONT12ARIAL(),
        ubFontColor,
        ubFontShadowColor,
        ubFontColor,
        ubFontShadowColor,
        TEXT_CJUSTIFIED,
        gMsgBox.sX + sButtonX,
        gMsgBox.sY + sButtonY,
        BUTTON_TOGGLE,
        MSYS_PRIORITY_HIGHEST,
        DEFAULT_MOVE_CALLBACK(),
        NumberedMsgBoxCallback,
      );
      MSYS_SetBtnUserData(gMsgBox.uiButton[0], 0, 1);
      SetButtonCursor(gMsgBox.uiButton[0], usCursor);

      sButtonX += MSGBOX_SMALL_BUTTON_WIDTH + MSGBOX_SMALL_BUTTON_X_SEP;
      gMsgBox.uiButton[1] = CreateIconAndTextButton(
        gMsgBox.iButtonImages,
        "2",
        FONT12ARIAL(),
        ubFontColor,
        ubFontShadowColor,
        ubFontColor,
        ubFontShadowColor,
        TEXT_CJUSTIFIED,
        gMsgBox.sX + sButtonX,
        gMsgBox.sY + sButtonY,
        BUTTON_TOGGLE,
        MSYS_PRIORITY_HIGHEST,
        DEFAULT_MOVE_CALLBACK(),
        NumberedMsgBoxCallback,
      );
      MSYS_SetBtnUserData(gMsgBox.uiButton[1], 0, 2);
      SetButtonCursor(gMsgBox.uiButton[1], usCursor);

      sButtonX += MSGBOX_SMALL_BUTTON_WIDTH + MSGBOX_SMALL_BUTTON_X_SEP;
      gMsgBox.uiButton[2] = CreateIconAndTextButton(
        gMsgBox.iButtonImages,
        "3",
        FONT12ARIAL(),
        ubFontColor,
        ubFontShadowColor,
        ubFontColor,
        ubFontShadowColor,
        TEXT_CJUSTIFIED,
        gMsgBox.sX + sButtonX,
        gMsgBox.sY + sButtonY,
        BUTTON_TOGGLE,
        MSYS_PRIORITY_HIGHEST,
        DEFAULT_MOVE_CALLBACK(),
        NumberedMsgBoxCallback,
      );
      MSYS_SetBtnUserData(gMsgBox.uiButton[2], 0, 3);
      SetButtonCursor(gMsgBox.uiButton[2], usCursor);

      sButtonX += MSGBOX_SMALL_BUTTON_WIDTH + MSGBOX_SMALL_BUTTON_X_SEP;
      gMsgBox.uiButton[3] = CreateIconAndTextButton(
        gMsgBox.iButtonImages,
        "4",
        FONT12ARIAL(),
        ubFontColor,
        ubFontShadowColor,
        ubFontColor,
        ubFontShadowColor,
        TEXT_CJUSTIFIED,
        gMsgBox.sX + sButtonX,
        gMsgBox.sY + sButtonY,
        BUTTON_TOGGLE,
        MSYS_PRIORITY_HIGHEST,
        DEFAULT_MOVE_CALLBACK(),
        NumberedMsgBoxCallback,
      );
      MSYS_SetBtnUserData(gMsgBox.uiButton[3], 0, 4);
      SetButtonCursor(gMsgBox.uiButton[3], usCursor);
      ForceButtonUnDirty(gMsgBox.uiButton[3]);
      ForceButtonUnDirty(gMsgBox.uiButton[2]);
      ForceButtonUnDirty(gMsgBox.uiButton[1]);
      ForceButtonUnDirty(gMsgBox.uiButton[0]);
    } else {
      // Create text button
      if (usFlags & MSG_BOX_FLAG_OK) {
        //			sButtonX = ( usTextBoxWidth - MSGBOX_BUTTON_WIDTH ) / 2;
        sButtonX = Math.trunc(
          (usTextBoxWidth - GetMSgBoxButtonWidth(gMsgBox.iButtonImages)) / 2,
        );

        sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

        gMsgBox.uiOKButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_OK],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX,
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          OKMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiOKButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiOKButton);
      }

      // Create text button
      if (usFlags & MSG_BOX_FLAG_CANCEL) {
        sButtonX = Math.trunc(
          (usTextBoxWidth - GetMSgBoxButtonWidth(gMsgBox.iButtonImages)) / 2,
        );
        sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

        gMsgBox.uiOKButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_CANCEL],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX,
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          OKMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiOKButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiOKButton);
      }

      if (usFlags & MSG_BOX_FLAG_YESNO) {
        sButtonX = Math.trunc(
          (usTextBoxWidth -
            (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) /
            2,
        );
        sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

        gMsgBox.uiYESButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_YES],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX,
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          YESMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiYESButton, usCursor);

        ForceButtonUnDirty(gMsgBox.uiYESButton);

        gMsgBox.uiNOButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_NO],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          NOMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiNOButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiNOButton);
      }

      if (usFlags & MSG_BOX_FLAG_CONTINUESTOP) {
        sButtonX = Math.trunc(
          (usTextBoxWidth -
            (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) /
            2,
        );
        sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

        gMsgBox.uiYESButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pUpdatePanelButtons[0],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX,
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          YESMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiYESButton, usCursor);

        ForceButtonUnDirty(gMsgBox.uiYESButton);

        gMsgBox.uiNOButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pUpdatePanelButtons[1],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          NOMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiNOButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiNOButton);
      }

      if (usFlags & MSG_BOX_FLAG_OKCONTRACT) {
        sButtonX = Math.trunc(
          (usTextBoxWidth -
            (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) /
            2,
        );
        sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

        gMsgBox.uiYESButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_OK],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX,
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          OKMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiYESButton, usCursor);

        ForceButtonUnDirty(gMsgBox.uiYESButton);

        gMsgBox.uiNOButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_REHIRE],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          ContractMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiNOButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiNOButton);
      }

      if (usFlags & MSG_BOX_FLAG_YESNOCONTRACT) {
        sButtonX = Math.trunc(
          (usTextBoxWidth -
            (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) /
            3,
        );
        sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

        gMsgBox.uiYESButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_YES],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX,
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          YESMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiYESButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiYESButton);

        gMsgBox.uiNOButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_NO],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          NOMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiNOButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiNOButton);

        gMsgBox.uiOKButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_REHIRE],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX +
            sButtonX +
            2 * (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          ContractMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiOKButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiOKButton);
      }

      if (usFlags & MSG_BOX_FLAG_GENERICCONTRACT) {
        sButtonX = Math.trunc(
          (usTextBoxWidth -
            (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) /
            3,
        );
        sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

        gMsgBox.uiYESButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          gzUserDefinedButton1,
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX,
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          YESMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiYESButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiYESButton);

        gMsgBox.uiNOButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          gzUserDefinedButton2,
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          NOMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiNOButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiNOButton);

        gMsgBox.uiOKButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_REHIRE],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX +
            sButtonX +
            2 * (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          ContractMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiOKButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiOKButton);
      }

      if (usFlags & MSG_BOX_FLAG_GENERIC) {
        sButtonX = Math.trunc(
          (usTextBoxWidth -
            (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) /
            2,
        );
        sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

        gMsgBox.uiYESButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          gzUserDefinedButton1,
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX,
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          YESMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiYESButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiYESButton);

        gMsgBox.uiNOButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          gzUserDefinedButton2,
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          NOMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiNOButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiNOButton);
      }

      if (usFlags & MSG_BOX_FLAG_YESNOLIE) {
        sButtonX = Math.trunc(
          (usTextBoxWidth -
            (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) /
            3,
        );
        sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

        gMsgBox.uiYESButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_YES],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX,
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          YESMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiYESButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiYESButton);

        gMsgBox.uiNOButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_NO],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          NOMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiNOButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiNOButton);

        gMsgBox.uiOKButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_LIE],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX +
            sButtonX +
            2 * (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          LieMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiOKButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiOKButton);
      }

      if (usFlags & MSG_BOX_FLAG_OKSKIP) {
        sButtonX = Math.trunc(
          (usTextBoxWidth -
            (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) /
            2,
        );
        sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

        gMsgBox.uiYESButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_OK],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX,
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          YESMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiYESButton, usCursor);

        ForceButtonUnDirty(gMsgBox.uiYESButton);

        gMsgBox.uiNOButton = CreateIconAndTextButton(
          gMsgBox.iButtonImages,
          pMessageStrings[Enum333.MSG_SKIP],
          FONT12ARIAL(),
          ubFontColor,
          ubFontShadowColor,
          ubFontColor,
          ubFontShadowColor,
          TEXT_CJUSTIFIED,
          gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP),
          gMsgBox.sY + sButtonY,
          BUTTON_TOGGLE,
          MSYS_PRIORITY_HIGHEST,
          DEFAULT_MOVE_CALLBACK(),
          NOMsgBoxCallback,
        );
        SetButtonCursor(gMsgBox.uiNOButton, usCursor);
        ForceButtonUnDirty(gMsgBox.uiNOButton);
      }
    }

    InterruptTime();
    PauseGame();
    LockPauseState(1);
    // Pause timers as well....
    PauseTime(true);

    // Save mouse restriction region...
    GetRestrictedClipCursor(gOldCursorLimitRectangle);
    FreeMouseCursor();

    gfNewMessageBox = true;

    gfInMsgBox = true;

    return iId;
  }

  function MsgBoxClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
    /// if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP)
    //{
    //	gMsgBox.bHandled = MSG_BOX_RETURN_NO;
    //}
    //
  }

  /* static */ let OKMsgBoxCallback__fLButtonDown: boolean = false;
  function OKMsgBoxCallback(btn: GUI_BUTTON, reason: INT32): void {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.uiFlags |= BUTTON_CLICKED_ON;
      OKMsgBoxCallback__fLButtonDown = true;
    } else if (
      reason & MSYS_CALLBACK_REASON_LBUTTON_UP &&
      OKMsgBoxCallback__fLButtonDown
    ) {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;

      // OK, exit
      gMsgBox.bHandled = MSG_BOX_RETURN_OK;
    } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      OKMsgBoxCallback__fLButtonDown = false;
    }
  }

  /* static */ let YESMsgBoxCallback__fLButtonDown: boolean = false;
  function YESMsgBoxCallback(btn: GUI_BUTTON, reason: INT32): void {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.uiFlags |= BUTTON_CLICKED_ON;
      YESMsgBoxCallback__fLButtonDown = true;
    } else if (
      reason & MSYS_CALLBACK_REASON_LBUTTON_UP &&
      YESMsgBoxCallback__fLButtonDown
    ) {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;

      // OK, exit
      gMsgBox.bHandled = MSG_BOX_RETURN_YES;
    } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      YESMsgBoxCallback__fLButtonDown = false;
    }
  }

  /* static */ let NOMsgBoxCallback__fLButtonDown: boolean = false;
  function NOMsgBoxCallback(btn: GUI_BUTTON, reason: INT32): void {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.uiFlags |= BUTTON_CLICKED_ON;
      NOMsgBoxCallback__fLButtonDown = true;
    } else if (
      reason & MSYS_CALLBACK_REASON_LBUTTON_UP &&
      NOMsgBoxCallback__fLButtonDown
    ) {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;

      // OK, exit
      gMsgBox.bHandled = MSG_BOX_RETURN_NO;
    } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      NOMsgBoxCallback__fLButtonDown = false;
    }
  }

  /* static */ let ContractMsgBoxCallback__fLButtonDown: boolean = false;
  function ContractMsgBoxCallback(btn: GUI_BUTTON, reason: INT32): void {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.uiFlags |= BUTTON_CLICKED_ON;
      ContractMsgBoxCallback__fLButtonDown = true;
    } else if (
      reason & MSYS_CALLBACK_REASON_LBUTTON_UP &&
      ContractMsgBoxCallback__fLButtonDown
    ) {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;

      // OK, exit
      gMsgBox.bHandled = MSG_BOX_RETURN_CONTRACT;
    } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      ContractMsgBoxCallback__fLButtonDown = false;
    }
  }

  /* static */ let LieMsgBoxCallback__fLButtonDown: boolean = false;
  function LieMsgBoxCallback(btn: GUI_BUTTON, reason: INT32): void {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.uiFlags |= BUTTON_CLICKED_ON;
      LieMsgBoxCallback__fLButtonDown = true;
    } else if (
      reason & MSYS_CALLBACK_REASON_LBUTTON_UP &&
      LieMsgBoxCallback__fLButtonDown
    ) {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;

      // OK, exit
      gMsgBox.bHandled = MSG_BOX_RETURN_LIE;
    } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      LieMsgBoxCallback__fLButtonDown = false;
    }
  }

  function NumberedMsgBoxCallback(btn: GUI_BUTTON, reason: INT32): void {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.uiFlags |= BUTTON_CLICKED_ON;
    } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;

      // OK, exit
      gMsgBox.bHandled = MSYS_GetBtnUserData(btn, 0);
    }
  }

  function ExitMsgBox(ubExitCode: INT8): UINT32 {
    let uiDestPitchBYTES: UINT32 = 0;
    let uiSrcPitchBYTES: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray;
    let pSrcBuf: Uint8ClampedArray;
    let pPosition: SGPPoint = createSGPPoint();

    // Delete popup!
    RemoveMercPopupBoxFromIndex(gMsgBox.iBoxId);
    gMsgBox.iBoxId = -1;

    // Delete buttons!
    if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
      RemoveButton(gMsgBox.uiButton[0]);
      RemoveButton(gMsgBox.uiButton[1]);
      RemoveButton(gMsgBox.uiButton[2]);
      RemoveButton(gMsgBox.uiButton[3]);
    } else {
      if (gMsgBox.usFlags & MSG_BOX_FLAG_OK) {
        RemoveButton(gMsgBox.uiOKButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNO) {
        RemoveButton(gMsgBox.uiYESButton);
        RemoveButton(gMsgBox.uiNOButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_OKCONTRACT) {
        RemoveButton(gMsgBox.uiYESButton);
        RemoveButton(gMsgBox.uiNOButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNOCONTRACT) {
        RemoveButton(gMsgBox.uiYESButton);
        RemoveButton(gMsgBox.uiNOButton);
        RemoveButton(gMsgBox.uiOKButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_GENERICCONTRACT) {
        RemoveButton(gMsgBox.uiYESButton);
        RemoveButton(gMsgBox.uiNOButton);
        RemoveButton(gMsgBox.uiOKButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_GENERIC) {
        RemoveButton(gMsgBox.uiYESButton);
        RemoveButton(gMsgBox.uiNOButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNOLIE) {
        RemoveButton(gMsgBox.uiYESButton);
        RemoveButton(gMsgBox.uiNOButton);
        RemoveButton(gMsgBox.uiOKButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_CONTINUESTOP) {
        RemoveButton(gMsgBox.uiYESButton);
        RemoveButton(gMsgBox.uiNOButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_OKSKIP) {
        RemoveButton(gMsgBox.uiYESButton);
        RemoveButton(gMsgBox.uiNOButton);
      }
    }

    // Delete button images
    UnloadButtonImage(gMsgBox.iButtonImages);

    // Unpause game....
    UnLockPauseState();
    UnPauseGame();
    // UnPause timers as well....
    PauseTime(false);

    // Restore mouse restriction region...
    RestrictMouseCursor(gOldCursorLimitRectangle);

    gfInMsgBox = false;

    // Call done callback!
    if (gMsgBox.ExitCallback != null) {
      gMsgBox.ExitCallback(ubExitCode);
    }

    // if ur in a non gamescreen and DONT want the msg box to use the save buffer, unset gfDontOverRideSaveBuffer in ur callback
    if (
      (gMsgBox.uiExitScreen != Enum26.GAME_SCREEN ||
        fRestoreBackgroundForMessageBox == true) &&
      gfDontOverRideSaveBuffer
    ) {
      // restore what we have under here...
      pSrcBuf = LockVideoSurface(
        gMsgBox.uiSaveBuffer,
        createPointer(
          () => uiSrcPitchBYTES,
          (v) => (uiSrcPitchBYTES = v),
        ),
      );
      pDestBuf = LockVideoSurface(
        FRAME_BUFFER,
        createPointer(
          () => uiDestPitchBYTES,
          (v) => (uiDestPitchBYTES = v),
        ),
      );

      Blt16BPPTo16BPP(
        pDestBuf,
        uiDestPitchBYTES,
        pSrcBuf,
        uiSrcPitchBYTES,
        gMsgBox.sX,
        gMsgBox.sY,
        0,
        0,
        gMsgBox.usWidth,
        gMsgBox.usHeight,
      );

      UnLockVideoSurface(gMsgBox.uiSaveBuffer);
      UnLockVideoSurface(FRAME_BUFFER);

      InvalidateRegion(
        gMsgBox.sX,
        gMsgBox.sY,
        gMsgBox.sX + gMsgBox.usWidth,
        gMsgBox.sY + gMsgBox.usHeight,
      );
    }

    fRestoreBackgroundForMessageBox = false;
    gfDontOverRideSaveBuffer = true;

    if (fCursorLockedToArea == true) {
      GetMousePos(pPosition);

      if (
        pPosition.iX > MessageBoxRestrictedCursorRegion.iRight ||
        (pPosition.iX > MessageBoxRestrictedCursorRegion.iLeft &&
          pPosition.iY < MessageBoxRestrictedCursorRegion.iTop &&
          pPosition.iY > MessageBoxRestrictedCursorRegion.iBottom)
      ) {
        SimulateMouseMovement(pOldMousePosition.iX, pOldMousePosition.iY);
      }

      fCursorLockedToArea = false;
      RestrictMouseCursor(MessageBoxRestrictedCursorRegion);
    }

    // Remove region
    MSYS_RemoveRegion(gMsgBox.BackRegion);

    // Remove save buffer!
    DeleteVideoSurfaceFromIndex(gMsgBox.uiSaveBuffer);

    switch (gMsgBox.uiExitScreen) {
      case Enum26.GAME_SCREEN:
        if (InOverheadMap()) {
          gfOverheadMapDirty = true;
        } else {
          SetRenderFlags(RENDER_FLAG_FULL);
        }
        break;
      case Enum26.MAP_SCREEN:
        fMapPanelDirty = true;
        break;
    }

    if (gfFadeInitialized) {
      SetPendingNewScreen(Enum26.FADE_SCREEN);
      return Enum26.FADE_SCREEN;
    }

    return gMsgBox.uiExitScreen;
  }

  export function MessageBoxScreenInit(): boolean {
    return true;
  }

  export function MessageBoxScreenHandle(): UINT32 {
    let InputEvent: InputAtom = createInputAtom();

    if (gfNewMessageBox) {
      // If in game screen....
      if (gfStartedFromGameScreen || gfStartedFromMapScreen) {
        // UINT32 uiDestPitchBYTES, uiSrcPitchBYTES;
        // UINT8	 *pDestBuf, *pSrcBuf;

        if (gfStartedFromGameScreen) {
          HandleTacticalUILoseCursorFromOtherScreen();
        } else {
          HandleMAPUILoseCursorFromOtherScreen();
        }

        gfStartedFromGameScreen = false;
        gfStartedFromMapScreen = false;
        /*
                              // Save what we have under here...
                              pDestBuf = LockVideoSurface( gMsgBox.uiSaveBuffer, &uiDestPitchBYTES);
                              pSrcBuf = LockVideoSurface( FRAME_BUFFER, &uiSrcPitchBYTES);

                              Blt16BPPTo16BPP((UINT16 *)pDestBuf, uiDestPitchBYTES,
                                                      (UINT16 *)pSrcBuf, uiSrcPitchBYTES,
                                                      0 , 0,
                                                      gMsgBox.sX , gMsgBox.sY,
                                                      gMsgBox.usWidth, gMsgBox.usHeight );

                              UnLockVideoSurface( gMsgBox.uiSaveBuffer );
                              UnLockVideoSurface( FRAME_BUFFER );
      */
      }

      gfNewMessageBox = false;

      return Enum26.MSG_BOX_SCREEN;
    }

    UnmarkButtonsDirty();

    // Render the box!
    if (gMsgBox.fRenderBox) {
      if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
        MarkAButtonDirty(gMsgBox.uiButton[0]);
        MarkAButtonDirty(gMsgBox.uiButton[1]);
        MarkAButtonDirty(gMsgBox.uiButton[2]);
        MarkAButtonDirty(gMsgBox.uiButton[3]);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_OK) {
        MarkAButtonDirty(gMsgBox.uiOKButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_CANCEL) {
        MarkAButtonDirty(gMsgBox.uiOKButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNO) {
        MarkAButtonDirty(gMsgBox.uiYESButton);
        MarkAButtonDirty(gMsgBox.uiNOButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_OKCONTRACT) {
        MarkAButtonDirty(gMsgBox.uiYESButton);
        MarkAButtonDirty(gMsgBox.uiNOButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNOCONTRACT) {
        MarkAButtonDirty(gMsgBox.uiYESButton);
        MarkAButtonDirty(gMsgBox.uiNOButton);
        MarkAButtonDirty(gMsgBox.uiOKButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_GENERICCONTRACT) {
        MarkAButtonDirty(gMsgBox.uiYESButton);
        MarkAButtonDirty(gMsgBox.uiNOButton);
        MarkAButtonDirty(gMsgBox.uiOKButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_GENERIC) {
        MarkAButtonDirty(gMsgBox.uiYESButton);
        MarkAButtonDirty(gMsgBox.uiNOButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_CONTINUESTOP) {
        // Exit messagebox
        MarkAButtonDirty(gMsgBox.uiYESButton);
        MarkAButtonDirty(gMsgBox.uiNOButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNOLIE) {
        MarkAButtonDirty(gMsgBox.uiYESButton);
        MarkAButtonDirty(gMsgBox.uiNOButton);
        MarkAButtonDirty(gMsgBox.uiOKButton);
      }

      if (gMsgBox.usFlags & MSG_BOX_FLAG_OKSKIP) {
        MarkAButtonDirty(gMsgBox.uiYESButton);
        MarkAButtonDirty(gMsgBox.uiNOButton);
      }

      RenderMercPopUpBoxFromIndex(
        gMsgBox.iBoxId,
        gMsgBox.sX,
        gMsgBox.sY,
        FRAME_BUFFER,
      );
      // gMsgBox.fRenderBox = FALSE;
      // ATE: Render each frame...
    }

    // Render buttons
    RenderButtons();

    EndFrameBufferRender();

    // carter, need key shortcuts for clearing up message boxes
    // Check for esc
    while (DequeueEvent(InputEvent) == true) {
      if (InputEvent.usEvent == KEY_UP) {
        if (
          InputEvent.usParam == ESC ||
          InputEvent.usParam == "n".charCodeAt(0)
        ) {
          if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNO) {
            // Exit messagebox
            gMsgBox.bHandled = MSG_BOX_RETURN_NO;
          }
        }

        if (InputEvent.usParam == ENTER) {
          if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNO) {
            // Exit messagebox
            gMsgBox.bHandled = MSG_BOX_RETURN_YES;
          } else if (gMsgBox.usFlags & MSG_BOX_FLAG_OK) {
            // Exit messagebox
            gMsgBox.bHandled = MSG_BOX_RETURN_OK;
          } else if (gMsgBox.usFlags & MSG_BOX_FLAG_CONTINUESTOP) {
            // Exit messagebox
            gMsgBox.bHandled = MSG_BOX_RETURN_OK;
          }
        }
        if (InputEvent.usParam == "o".charCodeAt(0)) {
          if (gMsgBox.usFlags & MSG_BOX_FLAG_OK) {
            // Exit messagebox
            gMsgBox.bHandled = MSG_BOX_RETURN_OK;
          }
        }
        if (InputEvent.usParam == "y".charCodeAt(0)) {
          if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNO) {
            // Exit messagebox
            gMsgBox.bHandled = MSG_BOX_RETURN_YES;
          }
        }
        if (InputEvent.usParam == "1".charCodeAt(0)) {
          if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
            // Exit messagebox
            gMsgBox.bHandled = 1;
          }
        }
        if (InputEvent.usParam == "2".charCodeAt(0)) {
          if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
            // Exit messagebox
            gMsgBox.bHandled = 1;
          }
        }
        if (InputEvent.usParam == "3".charCodeAt(0)) {
          if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
            // Exit messagebox
            gMsgBox.bHandled = 1;
          }
        }
        if (InputEvent.usParam == "4".charCodeAt(0)) {
          if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
            // Exit messagebox
            gMsgBox.bHandled = 1;
          }
        }
      }
    }

    if (gMsgBox.bHandled) {
      SetRenderFlags(RENDER_FLAG_FULL);
      return ExitMsgBox(gMsgBox.bHandled);
    }

    return Enum26.MSG_BOX_SCREEN;
  }

  export function MessageBoxScreenShutdown(): boolean {
    return false;
  }

  // a basic box that don't care what screen we came from
  export function DoScreenIndependantMessageBox(
    zString: string /* Pointer<INT16> */,
    usFlags: UINT16,
    ReturnCallback: MSGBOX_CALLBACK | null,
  ): void {
    let CenteringRect: SGPRect = createSGPRectFrom(
      0,
      0,
      640,
      INV_INTERFACE_START_Y,
    );
    DoScreenIndependantMessageBoxWithRect(
      zString,
      usFlags,
      ReturnCallback,
      CenteringRect,
    );
  }

  // a basic box that don't care what screen we came from
  function DoUpperScreenIndependantMessageBox(
    zString: string /* Pointer<INT16> */,
    usFlags: UINT16,
    ReturnCallback: MSGBOX_CALLBACK | null,
  ): void {
    let CenteringRect: SGPRect = createSGPRectFrom(
      0,
      0,
      640,
      Math.trunc(INV_INTERFACE_START_Y / 2),
    );
    DoScreenIndependantMessageBoxWithRect(
      zString,
      usFlags,
      ReturnCallback,
      CenteringRect,
    );
  }

  // a basic box that don't care what screen we came from
  export function DoLowerScreenIndependantMessageBox(
    zString: string /* Pointer<INT16> */,
    usFlags: UINT16,
    ReturnCallback: MSGBOX_CALLBACK | null,
  ): void {
    let CenteringRect: SGPRect = createSGPRectFrom(
      0,
      Math.trunc(INV_INTERFACE_START_Y / 2),
      640,
      INV_INTERFACE_START_Y,
    );
    DoScreenIndependantMessageBoxWithRect(
      zString,
      usFlags,
      ReturnCallback,
      CenteringRect,
    );
  }

  function DoScreenIndependantMessageBoxWithRect(
    zString: string /* Pointer<INT16> */,
    usFlags: UINT16,
    ReturnCallback: MSGBOX_CALLBACK | null,
    pCenteringRect: SGPRect,
  ): void {
    /// which screen are we in?

    // Map Screen (excluding AI Viewer)
    if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
      // auto resolve is a special case
      if (guiCurrentScreen == Enum26.AUTORESOLVE_SCREEN) {
        DoMessageBox(
          Enum24.MSG_BOX_BASIC_STYLE,
          zString,
          Enum26.AUTORESOLVE_SCREEN,
          usFlags,
          ReturnCallback,
          pCenteringRect,
        );
      } else {
        // set up for mapscreen
        DoMapMessageBoxWithRect(
          Enum24.MSG_BOX_BASIC_STYLE,
          zString,
          Enum26.MAP_SCREEN,
          usFlags,
          ReturnCallback,
          pCenteringRect,
        );
      }
    }

    // Laptop
    else if (guiCurrentScreen == Enum26.LAPTOP_SCREEN) {
      // set up for laptop
      DoLapTopSystemMessageBoxWithRect(
        Enum24.MSG_BOX_LAPTOP_DEFAULT,
        zString,
        Enum26.LAPTOP_SCREEN,
        usFlags,
        ReturnCallback,
        pCenteringRect,
      );
    }

    // Save Load Screen
    else if (guiCurrentScreen == Enum26.SAVE_LOAD_SCREEN) {
      DoSaveLoadMessageBoxWithRect(
        Enum24.MSG_BOX_BASIC_STYLE,
        zString,
        Enum26.SAVE_LOAD_SCREEN,
        usFlags,
        ReturnCallback,
        pCenteringRect,
      );
    }

    // Options Screen
    else if (guiCurrentScreen == Enum26.OPTIONS_SCREEN) {
      DoOptionsMessageBoxWithRect(
        Enum24.MSG_BOX_BASIC_STYLE,
        zString,
        Enum26.OPTIONS_SCREEN,
        usFlags,
        ReturnCallback,
        pCenteringRect,
      );
    }

    // Tactical
    else if (guiCurrentScreen == Enum26.GAME_SCREEN) {
      DoMessageBox(
        Enum24.MSG_BOX_BASIC_STYLE,
        zString,
        guiCurrentScreen,
        usFlags,
        ReturnCallback,
        pCenteringRect,
      );
    }
  }

  function GetMSgBoxButtonWidth(iButtonImage: INT32): UINT16 {
    return GetWidthOfButtonPic(
      iButtonImage,
      ButtonPictures[iButtonImage].OnNormal,
    );
  }
}
