namespace ja2 {
  let guiArmourBackground: UINT32;
  let guiArmourGrid: UINT32;

  export function GameInitBobbyRArmour(): void {}

  export function EnterBobbyRArmour(): boolean {
    let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

    // load the background graphic and add it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\Armourbackground.sti");
    if (!(guiArmourBackground = AddVideoObject(VObjectDesc))) {
      return false;
    }

    // load the gunsgrid graphic and add it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\Armourgrid.sti");
    if (!(guiArmourGrid = AddVideoObject(VObjectDesc))) {
      return false;
    }

    InitBobbyBrTitle();
    // Draw menu bar
    InitBobbyMenuBar();

    SetFirstLastPagesForNew(IC_ARMOUR);
    //	CalculateFirstAndLastIndexs();

    RenderBobbyRArmour();

    return true;
  }

  export function ExitBobbyRArmour(): void {
    DeleteVideoObjectFromIndex(guiArmourBackground);
    DeleteVideoObjectFromIndex(guiArmourGrid);
    DeleteBobbyMenuBar();

    DeleteBobbyBrTitle();
    DeleteMouseRegionForBigImage();

    giCurrentSubPage = gusCurWeaponIndex;
    guiLastBobbyRayPage = Enum95.LAPTOP_MODE_BOBBY_R_ARMOR;
  }

  export function HandleBobbyRArmour(): void {}

  export function RenderBobbyRArmour(): void {
    let hPixHandle: SGPVObject;

    WebPageTileBackground(
      BOBBYR_NUM_HORIZONTAL_TILES,
      BOBBYR_NUM_VERTICAL_TILES,
      BOBBYR_BACKGROUND_WIDTH,
      BOBBYR_BACKGROUND_HEIGHT,
      guiArmourBackground,
    );

    // Display title at top of page
    DisplayBobbyRBrTitle();

    // GunForm
    hPixHandle = GetVideoObject(guiArmourGrid);
    BltVideoObject(
      FRAME_BUFFER,
      hPixHandle,
      0,
      BOBBYR_GRIDLOC_X,
      BOBBYR_GRIDLOC_Y,
      VO_BLT_SRCTRANSPARENCY,
      null,
    );

    DisplayItemInfo(IC_ARMOUR);

    UpdateButtonText(guiCurrentLaptopMode);
    MarkButtonsDirty();
    RenderWWWProgramTitleBar();
    InvalidateRegion(
      LAPTOP_SCREEN_UL_X,
      LAPTOP_SCREEN_WEB_UL_Y,
      LAPTOP_SCREEN_LR_X,
      LAPTOP_SCREEN_WEB_LR_Y,
    );
  }
}
