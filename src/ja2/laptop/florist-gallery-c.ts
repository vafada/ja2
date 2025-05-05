namespace ja2 {
  const FLOR_GALLERY_TITLE_FONT = () => FONT10ARIAL();
  const FLOR_GALLERY_TITLE_COLOR = FONT_MCOLOR_WHITE;

  const FLOR_GALLERY_FLOWER_TITLE_FONT = () => FONT14ARIAL();
  const FLOR_GALLERY_FLOWER_TITLE_COLOR = FONT_MCOLOR_WHITE;

  const FLOR_GALLERY_FLOWER_PRICE_FONT = () => FONT12ARIAL();
  const FLOR_GALLERY_FLOWER_PRICE_COLOR = FONT_MCOLOR_WHITE;

  const FLOR_GALLERY_FLOWER_DESC_FONT = () => FONT12ARIAL();
  const FLOR_GALLERY_FLOWER_DESC_COLOR = FONT_MCOLOR_WHITE;

  const FLOR_GALLERY_NUMBER_FLORAL_BUTTONS = 3;
  const FLOR_GALLERY_NUMBER_FLORAL_IMAGES = 10;

  const FLOR_GALLERY_FLOWER_DESC_TEXT_FONT = () => FONT12ARIAL();
  const FLOR_GALLERY_FLOWER_DESC_TEXT_COLOR = FONT_MCOLOR_WHITE;

  const FLOR_GALLERY_BACK_BUTTON_X = LAPTOP_SCREEN_UL_X + 8;
  const FLOR_GALLERY_BACK_BUTTON_Y = LAPTOP_SCREEN_WEB_UL_Y + 12;

  const FLOR_GALLERY_NEXT_BUTTON_X = LAPTOP_SCREEN_UL_X + 420;
  const FLOR_GALLERY_NEXT_BUTTON_Y = FLOR_GALLERY_BACK_BUTTON_Y;

  const FLOR_GALLERY_FLOWER_BUTTON_X = LAPTOP_SCREEN_UL_X + 7;
  const FLOR_GALLERY_FLOWER_BUTTON_Y = LAPTOP_SCREEN_WEB_UL_Y + 74;

  //#define FLOR_GALLERY_FLOWER_BUTTON_OFFSET_X		250

  const FLOR_GALLERY_FLOWER_BUTTON_OFFSET_Y = 112;

  const FLOR_GALLERY_TITLE_TEXT_X = LAPTOP_SCREEN_UL_X + 0;
  const FLOR_GALLERY_TITLE_TEXT_Y = LAPTOP_SCREEN_WEB_UL_Y + 48;
  const FLOR_GALLERY_TITLE_TEXT_WIDTH = LAPTOP_SCREEN_LR_X - LAPTOP_SCREEN_UL_X;

  const FLOR_GALLERY_FLOWER_TITLE_X = FLOR_GALLERY_FLOWER_BUTTON_X + 88;

  const FLOR_GALLERY_DESC_WIDTH = 390;

  const FLOR_GALLERY_FLOWER_TITLE_OFFSET_Y = 9;
  const FLOR_GALLERY_FLOWER_PRICE_OFFSET_Y =
    FLOR_GALLERY_FLOWER_TITLE_OFFSET_Y + 17;
  const FLOR_GALLERY_FLOWER_DESC_OFFSET_Y =
    FLOR_GALLERY_FLOWER_PRICE_OFFSET_Y + 15;

  let guiFlowerImages: UINT32[] /* [3] */ = createArray(3, 0);

  export let guiCurrentlySelectedFlower: UINT32 = 0;

  export let gubCurFlowerIndex: UINT8 = 0;
  let gubCurNumberOfFlowers: UINT8 = 0;
  let gubPrevNumberOfFlowers: UINT8 = 0;
  let gfRedrawFloristGallery: boolean = false;

  let FloristGallerySubPagesVisitedFlag: boolean[] /* [4] */ = createArray(
    4,
    false,
  );

  // Floral buttons
  let guiGalleryButtonImage: INT32;
  let guiGalleryButton: UINT32[] /* [FLOR_GALLERY_NUMBER_FLORAL_BUTTONS] */ =
    createArray(FLOR_GALLERY_NUMBER_FLORAL_BUTTONS, 0);

  // Next Previous buttons
  let guiFloralGalleryButtonImage: INT32;
  let guiFloralGalleryButton: UINT32[] /* [2] */ = createArray(2, 0);

  function GameInitFloristGallery(): void {}

  export function EnterInitFloristGallery(): void {
    FloristGallerySubPagesVisitedFlag.fill(false);
  }

  export function EnterFloristGallery(): boolean {
    InitFloristDefaults();

    // the next previous buttons
    guiFloralGalleryButtonImage = LoadButtonImage(
      "LAPTOP\\FloristButtons.sti",
      -1,
      0,
      -1,
      1,
      -1,
    );

    guiFloralGalleryButton[0] = CreateIconAndTextButton(
      guiFloralGalleryButtonImage,
      sFloristGalleryText[Enum347.FLORIST_GALLERY_PREV],
      FLORIST_BUTTON_TEXT_FONT(),
      FLORIST_BUTTON_TEXT_UP_COLOR,
      FLORIST_BUTTON_TEXT_SHADOW_COLOR,
      FLORIST_BUTTON_TEXT_DOWN_COLOR,
      FLORIST_BUTTON_TEXT_SHADOW_COLOR,
      TEXT_CJUSTIFIED,
      FLOR_GALLERY_BACK_BUTTON_X,
      FLOR_GALLERY_BACK_BUTTON_Y,
      BUTTON_TOGGLE,
      MSYS_PRIORITY_HIGH,
      DEFAULT_MOVE_CALLBACK(),
      BtnFloralGalleryBackButtonCallback,
    );
    SetButtonCursor(guiFloralGalleryButton[0], Enum317.CURSOR_WWW);

    guiFloralGalleryButton[1] = CreateIconAndTextButton(
      guiFloralGalleryButtonImage,
      sFloristGalleryText[Enum347.FLORIST_GALLERY_NEXT],
      FLORIST_BUTTON_TEXT_FONT(),
      FLORIST_BUTTON_TEXT_UP_COLOR,
      FLORIST_BUTTON_TEXT_SHADOW_COLOR,
      FLORIST_BUTTON_TEXT_DOWN_COLOR,
      FLORIST_BUTTON_TEXT_SHADOW_COLOR,
      TEXT_CJUSTIFIED,
      FLOR_GALLERY_NEXT_BUTTON_X,
      FLOR_GALLERY_NEXT_BUTTON_Y,
      BUTTON_TOGGLE,
      MSYS_PRIORITY_HIGH,
      DEFAULT_MOVE_CALLBACK(),
      BtnFloralGalleryNextButtonCallback,
    );
    SetButtonCursor(guiFloralGalleryButton[1], Enum317.CURSOR_WWW);

    RenderFloristGallery();

    InitFlowerButtons();

    return true;
  }

  export function ExitFloristGallery(): void {
    let i: UINT16;

    RemoveFloristDefaults();

    for (i = 0; i < 2; i++) RemoveButton(guiFloralGalleryButton[i]);

    UnloadButtonImage(guiFloralGalleryButtonImage);

    DeleteFlowerButtons();
  }

  export function HandleFloristGallery(): void {
    if (gfRedrawFloristGallery) {
      gfRedrawFloristGallery = false;

      //
      DeleteFlowerButtons();
      InitFlowerButtons();

      fPausedReDrawScreenFlag = true;
    }
  }

  export function RenderFloristGallery(): void {
    DisplayFloristDefaults();

    DrawTextToScreen(
      sFloristGalleryText[Enum347.FLORIST_GALLERY_CLICK_TO_ORDER],
      FLOR_GALLERY_TITLE_TEXT_X,
      FLOR_GALLERY_TITLE_TEXT_Y,
      FLOR_GALLERY_TITLE_TEXT_WIDTH,
      FLOR_GALLERY_TITLE_FONT(),
      FLOR_GALLERY_TITLE_COLOR,
      FONT_MCOLOR_BLACK,
      false,
      CENTER_JUSTIFIED,
    );
    DrawTextToScreen(
      sFloristGalleryText[Enum347.FLORIST_GALLERY_ADDIFTIONAL_FEE],
      FLOR_GALLERY_TITLE_TEXT_X,
      FLOR_GALLERY_TITLE_TEXT_Y + 11,
      FLOR_GALLERY_TITLE_TEXT_WIDTH,
      FLOR_GALLERY_TITLE_FONT(),
      FLOR_GALLERY_TITLE_COLOR,
      FONT_MCOLOR_BLACK,
      false,
      CENTER_JUSTIFIED,
    );

    DisplayFloralDescriptions();

    MarkButtonsDirty();
    RenderWWWProgramTitleBar();
    InvalidateRegion(
      LAPTOP_SCREEN_UL_X,
      LAPTOP_SCREEN_WEB_UL_Y,
      LAPTOP_SCREEN_LR_X,
      LAPTOP_SCREEN_WEB_LR_Y,
    );
  }

  function BtnFloralGalleryNextButtonCallback(
    btn: GUI_BUTTON,
    reason: INT32,
  ): void {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.uiFlags |= BUTTON_CLICKED_ON;
      InvalidateRegion(
        btn.Area.RegionTopLeftX,
        btn.Area.RegionTopLeftY,
        btn.Area.RegionBottomRightX,
        btn.Area.RegionBottomRightY,
      );
    }
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      if (btn.uiFlags & BUTTON_CLICKED_ON) {
        btn.uiFlags &= ~BUTTON_CLICKED_ON;

        if (gubCurFlowerIndex + 3 <= FLOR_GALLERY_NUMBER_FLORAL_IMAGES)
          gubCurFlowerIndex += 3;

        ChangingFloristGallerySubPage(gubCurFlowerIndex);

        InvalidateRegion(
          btn.Area.RegionTopLeftX,
          btn.Area.RegionTopLeftY,
          btn.Area.RegionBottomRightX,
          btn.Area.RegionBottomRightY,
        );

        gfRedrawFloristGallery = true;
      }
    }
    if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;
      InvalidateRegion(
        btn.Area.RegionTopLeftX,
        btn.Area.RegionTopLeftY,
        btn.Area.RegionBottomRightX,
        btn.Area.RegionBottomRightY,
      );
    }
  }

  function BtnFloralGalleryBackButtonCallback(
    btn: GUI_BUTTON,
    reason: INT32,
  ): void {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.uiFlags |= BUTTON_CLICKED_ON;
      InvalidateRegion(
        btn.Area.RegionTopLeftX,
        btn.Area.RegionTopLeftY,
        btn.Area.RegionBottomRightX,
        btn.Area.RegionBottomRightY,
      );
    }
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      if (btn.uiFlags & BUTTON_CLICKED_ON) {
        btn.uiFlags &= ~BUTTON_CLICKED_ON;

        if (gubCurFlowerIndex != 0) {
          if (gubCurFlowerIndex >= 3) gubCurFlowerIndex -= 3;
          else gubCurFlowerIndex = 0;

          ChangingFloristGallerySubPage(gubCurFlowerIndex);
        } else {
          guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST;
        }

        gfRedrawFloristGallery = true;

        InvalidateRegion(
          btn.Area.RegionTopLeftX,
          btn.Area.RegionTopLeftY,
          btn.Area.RegionBottomRightX,
          btn.Area.RegionBottomRightY,
        );
      }
    }
    if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;
      InvalidateRegion(
        btn.Area.RegionTopLeftX,
        btn.Area.RegionTopLeftY,
        btn.Area.RegionBottomRightX,
        btn.Area.RegionBottomRightY,
      );
    }
  }

  function BtnGalleryFlowerButtonCallback(
    btn: GUI_BUTTON,
    reason: INT32,
  ): void {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.uiFlags |= BUTTON_CLICKED_ON;
      InvalidateRegion(
        btn.Area.RegionTopLeftX,
        btn.Area.RegionTopLeftY,
        btn.Area.RegionBottomRightX,
        btn.Area.RegionBottomRightY,
      );
    }
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      if (btn.uiFlags & BUTTON_CLICKED_ON) {
        btn.uiFlags &= ~BUTTON_CLICKED_ON;

        guiCurrentlySelectedFlower = MSYS_GetBtnUserData(btn, 0);
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST_ORDERFORM;

        gfShowBookmarks = false;

        InvalidateRegion(
          btn.Area.RegionTopLeftX,
          btn.Area.RegionTopLeftY,
          btn.Area.RegionBottomRightX,
          btn.Area.RegionBottomRightY,
        );
      }
    }
    if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;
      InvalidateRegion(
        btn.Area.RegionTopLeftX,
        btn.Area.RegionTopLeftY,
        btn.Area.RegionBottomRightX,
        btn.Area.RegionBottomRightY,
      );
    }
  }

  function InitFlowerButtons(): boolean {
    let i: UINT16;
    let j: UINT16;
    let count: UINT16;
    let usPosY: UINT16;
    let sTemp: string /* char[40] */;
    let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

    if (FLOR_GALLERY_NUMBER_FLORAL_IMAGES - gubCurFlowerIndex >= 3)
      gubCurNumberOfFlowers = 3;
    else
      gubCurNumberOfFlowers =
        FLOR_GALLERY_NUMBER_FLORAL_IMAGES - gubCurFlowerIndex;

    gubPrevNumberOfFlowers = gubCurNumberOfFlowers;

    // the 10 pictures of the flowers
    count = gubCurFlowerIndex;
    for (i = 0; i < gubCurNumberOfFlowers; i++) {
      // load the handbullet graphic and add it
      sTemp = sprintf("LAPTOP\\Flower_%d.sti", count);
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      VObjectDesc.ImageFile = FilenameForBPP(sTemp);
      if (!(guiFlowerImages[i] = AddVideoObject(VObjectDesc))) {
        return false;
      }
      count++;
    }

    // the buttons with the flower pictures on them
    usPosY = FLOR_GALLERY_FLOWER_BUTTON_Y;
    //	usPosX = FLOR_GALLERY_FLOWER_BUTTON_X;
    count = gubCurFlowerIndex;
    guiGalleryButtonImage = LoadButtonImage(
      "LAPTOP\\GalleryButtons.sti",
      -1,
      0,
      -1,
      1,
      -1,
    );
    for (j = 0; j < gubCurNumberOfFlowers; j++) {
      guiGalleryButton[j] = QuickCreateButton(
        guiGalleryButtonImage,
        FLOR_GALLERY_FLOWER_BUTTON_X,
        usPosY,
        BUTTON_TOGGLE,
        MSYS_PRIORITY_HIGH,
        DEFAULT_MOVE_CALLBACK(),
        BtnGalleryFlowerButtonCallback,
      );
      SetButtonCursor(guiGalleryButton[j], Enum317.CURSOR_WWW);
      MSYS_SetBtnUserData(guiGalleryButton[j], 0, count);

      SpecifyButtonIcon(
        guiGalleryButton[j],
        guiFlowerImages[j],
        0,
        5,
        5,
        false,
      );
      usPosY += FLOR_GALLERY_FLOWER_BUTTON_OFFSET_Y;
      count++;
    }

    // if its the first page, display the 'back' text  in place of the 'prev' text on the top left button
    if (gubCurFlowerIndex == 0)
      SpecifyButtonText(
        guiFloralGalleryButton[0],
        sFloristGalleryText[Enum347.FLORIST_GALLERY_HOME],
      );
    else
      SpecifyButtonText(
        guiFloralGalleryButton[0],
        sFloristGalleryText[Enum347.FLORIST_GALLERY_PREV],
      );

    // if it is the last page disable the next button
    if (gubCurFlowerIndex == FLOR_GALLERY_NUMBER_FLORAL_IMAGES - 1)
      DisableButton(guiFloralGalleryButton[1]);
    else EnableButton(guiFloralGalleryButton[1]);

    return true;
  }

  function DeleteFlowerButtons(): void {
    let i: UINT16;

    for (i = 0; i < gubPrevNumberOfFlowers; i++) {
      DeleteVideoObjectFromIndex(guiFlowerImages[i]);
    }

    UnloadButtonImage(guiGalleryButtonImage);

    for (i = 0; i < gubPrevNumberOfFlowers; i++) {
      RemoveButton(guiGalleryButton[i]);
    }
  }

  function DisplayFloralDescriptions(): boolean {
    let sTemp: string /* wchar_t[640] */;
    let uiStartLoc: UINT32 = 0;
    let i: UINT32;
    let usPosY: UINT16;
    let usPrice: UINT16;

    if (FLOR_GALLERY_NUMBER_FLORAL_IMAGES - gubCurFlowerIndex >= 3)
      gubCurNumberOfFlowers = 3;
    else
      gubCurNumberOfFlowers =
        FLOR_GALLERY_NUMBER_FLORAL_IMAGES - gubCurFlowerIndex;

    usPosY = FLOR_GALLERY_FLOWER_BUTTON_Y;
    for (i = 0; i < gubCurNumberOfFlowers; i++) {
      // Display Flower title
      uiStartLoc = FLOR_GALLERY_TEXT_TOTAL_SIZE * (i + gubCurFlowerIndex);
      sTemp = LoadEncryptedDataFromFile(
        FLOR_GALLERY_TEXT_FILE,
        uiStartLoc,
        FLOR_GALLERY_TEXT_TITLE_SIZE,
      );
      DrawTextToScreen(
        sTemp,
        FLOR_GALLERY_FLOWER_TITLE_X,
        usPosY + FLOR_GALLERY_FLOWER_TITLE_OFFSET_Y,
        0,
        FLOR_GALLERY_FLOWER_TITLE_FONT(),
        FLOR_GALLERY_FLOWER_TITLE_COLOR,
        FONT_MCOLOR_BLACK,
        false,
        LEFT_JUSTIFIED,
      );

      // Display Flower Price
      uiStartLoc =
        FLOR_GALLERY_TEXT_TOTAL_SIZE * (i + gubCurFlowerIndex) +
        FLOR_GALLERY_TEXT_TITLE_SIZE;
      sTemp = LoadEncryptedDataFromFile(
        FLOR_GALLERY_TEXT_FILE,
        uiStartLoc,
        FLOR_GALLERY_TEXT_PRICE_SIZE,
      );
      usPrice = parseInt(sTemp, 10);
      sTemp = swprintf(
        "$%d.00 %s",
        usPrice,
        pMessageStrings[Enum333.MSG_USDOLLAR_ABBREVIATION],
      );
      DrawTextToScreen(
        sTemp,
        FLOR_GALLERY_FLOWER_TITLE_X,
        usPosY + FLOR_GALLERY_FLOWER_PRICE_OFFSET_Y,
        0,
        FLOR_GALLERY_FLOWER_PRICE_FONT(),
        FLOR_GALLERY_FLOWER_PRICE_COLOR,
        FONT_MCOLOR_BLACK,
        false,
        LEFT_JUSTIFIED,
      );

      // Display Flower Desc
      uiStartLoc =
        FLOR_GALLERY_TEXT_TOTAL_SIZE * (i + gubCurFlowerIndex) +
        FLOR_GALLERY_TEXT_TITLE_SIZE +
        FLOR_GALLERY_TEXT_PRICE_SIZE;
      sTemp = LoadEncryptedDataFromFile(
        FLOR_GALLERY_TEXT_FILE,
        uiStartLoc,
        FLOR_GALLERY_TEXT_DESC_SIZE,
      );
      DisplayWrappedString(
        FLOR_GALLERY_FLOWER_TITLE_X,
        usPosY + FLOR_GALLERY_FLOWER_DESC_OFFSET_Y,
        FLOR_GALLERY_DESC_WIDTH,
        2,
        FLOR_GALLERY_FLOWER_DESC_FONT(),
        FLOR_GALLERY_FLOWER_DESC_COLOR,
        sTemp,
        FONT_MCOLOR_BLACK,
        false,
        LEFT_JUSTIFIED,
      );

      usPosY += FLOR_GALLERY_FLOWER_BUTTON_OFFSET_Y;
    }

    return true;
  }

  function ChangingFloristGallerySubPage(ubSubPageNumber: UINT8): void {
    fLoadPendingFlag = true;

    // there are 3 flowers per page
    if (ubSubPageNumber == FLOR_GALLERY_NUMBER_FLORAL_IMAGES)
      ubSubPageNumber = 4;
    else ubSubPageNumber = Math.trunc(ubSubPageNumber / 3);

    if (FloristGallerySubPagesVisitedFlag[ubSubPageNumber] == false) {
      fConnectingToSubPage = true;
      fFastLoadFlag = false;

      FloristGallerySubPagesVisitedFlag[ubSubPageNumber] = true;
    } else {
      fConnectingToSubPage = true;
      fFastLoadFlag = true;
    }
  }
}
