namespace ja2 {
  // the squad list font
  const SQUAD_FONT = () => COMPFONT();

  const SQUAD_REGION_HEIGHT = 2 * RADAR_WINDOW_HEIGHT;
  const SQUAD_WINDOW_TM_Y = () =>
    RADAR_WINDOW_TM_Y + GetFontHeight(SQUAD_FONT());

  // subtractor for squad list from size of radar view region height
  const SUBTRACTOR_FOR_SQUAD_LIST = 0;

  let gsRadarX: INT16;
  let gsRadarY: INT16;
  let gusRadarImage: UINT32;
  let fImageLoaded: boolean = false;
  export let fRenderRadarScreen: boolean = true;
  let sSelectedSquadLine: INT16 = -1;

  export let gfRadarCurrentGuyFlash: boolean = false;

  let gRadarRegionSquadList: MOUSE_REGION[] /* [NUMBER_OF_SQUADS] */ =
    createArrayFrom(Enum275.NUMBER_OF_SQUADS, createMouseRegion);

  export function InitRadarScreen(): boolean {
    // Add region for radar
    MSYS_DefineRegion(
      gRadarRegion,
      RADAR_WINDOW_X,
      RADAR_WINDOW_TM_Y,
      RADAR_WINDOW_X + RADAR_WINDOW_WIDTH,
      RADAR_WINDOW_TM_Y + RADAR_WINDOW_HEIGHT,
      MSYS_PRIORITY_HIGHEST,
      0,
      RadarRegionMoveCallback,
      RadarRegionButtonCallback,
    );

    // Add region
    MSYS_AddRegion(gRadarRegion);

    // disable the radar map
    MSYS_DisableRegion(gRadarRegion);

    gsRadarX = RADAR_WINDOW_X;
    gsRadarY = RADAR_WINDOW_TM_Y;

    return true;
  }

  export function LoadRadarScreenBitmap(
    aFilename: string /* Pointer<CHAR8> */,
  ): boolean {
    let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
    let zFilename: string /* CHAR8[260] */;
    let cnt: INT32;
    let hVObject: SGPVObject;

    zFilename = aFilename;

    // If we have loaded, remove old one
    if (fImageLoaded) {
      DeleteVideoObjectFromIndex(gusRadarImage);

      fImageLoaded = false;
    }

    /* ARM - Restriction removed Nov.29/98.  Must be able to view different radar maps from map screen while underground!
           // If we are in a cave or basement..... dont get a new one...
           if( !gfBasement && !gfCaves )
  */
    {
      // Remove extension
      for (cnt = zFilename.length - 1; cnt >= 0; cnt--) {
        if (zFilename[cnt] == ".") {
          zFilename = zFilename.substring(0, cnt);
        }
      }

      // Grab the Map image
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      VObjectDesc.ImageFile = sprintf("RADARMAPS\\%s.STI", zFilename);

      if (!(gusRadarImage = AddVideoObject(VObjectDesc))) {
        return false;
      }

      fImageLoaded = true;

      if ((hVObject = GetVideoObject(gusRadarImage))) {
        // ATE: Add a shade table!
        hVObject.pShades[0] = Create16BPPPaletteShaded(
          hVObject.pPaletteEntry,
          255,
          255,
          255,
          false,
        );
        hVObject.pShades[1] = Create16BPPPaletteShaded(
          hVObject.pPaletteEntry,
          100,
          100,
          100,
          false,
        );
      }
    }

    // Dirty interface
    fInterfacePanelDirty = 1;

    return true;
  }

  export function ClearOutRadarMapImage(): void {
    // If we have loaded, remove old one
    if (fImageLoaded) {
      DeleteVideoObjectFromIndex(gusRadarImage);
      fImageLoaded = false;
    }
  }

  export function MoveRadarScreen(): void {
    // check if we are allowed to do anything?
    if (fRenderRadarScreen == false) {
      return;
    }

    // Remove old region
    MSYS_RemoveRegion(gRadarRegion);

    // Add new one

    // Move based on inventory panel
    if (gsCurInterfacePanel == Enum215.SM_PANEL) {
      gsRadarY = RADAR_WINDOW_TM_Y;
    } else {
      gsRadarY = RADAR_WINDOW_TM_Y;
    }

    // Add region for radar
    MSYS_DefineRegion(
      gRadarRegion,
      RADAR_WINDOW_X,
      gsRadarY,
      RADAR_WINDOW_X + RADAR_WINDOW_WIDTH,
      gsRadarY + RADAR_WINDOW_HEIGHT,
      MSYS_PRIORITY_HIGHEST,
      0,
      RadarRegionMoveCallback,
      RadarRegionButtonCallback,
    );

    // Add region
    MSYS_AddRegion(gRadarRegion);
  }

  function RadarRegionMoveCallback(
    pRegion: MOUSE_REGION,
    iReason: INT32,
  ): void {
    let sRadarX: INT16;
    let sRadarY: INT16;

    // check if we are allowed to do anything?
    if (fRenderRadarScreen == false) {
      return;
    }

    if (iReason == MSYS_CALLBACK_REASON_MOVE) {
      if (pRegion.ButtonState & MSYS_LEFT_BUTTON) {
        // Use relative coordinates to set center of viewport
        sRadarX = pRegion.RelativeXPos - Math.trunc(RADAR_WINDOW_WIDTH / 2);
        sRadarY = pRegion.RelativeYPos - Math.trunc(RADAR_WINDOW_HEIGHT / 2);

        AdjustWorldCenterFromRadarCoords(sRadarX, sRadarY);

        SetRenderFlags(RENDER_FLAG_FULL);
      }
    }
  }

  function RadarRegionButtonCallback(
    pRegion: MOUSE_REGION,
    iReason: INT32,
  ): void {
    let sRadarX: INT16;
    let sRadarY: INT16;

    // check if we are allowed to do anything?
    if (fRenderRadarScreen == false) {
      return;
    }

    if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      if (!InOverheadMap()) {
        // Use relative coordinates to set center of viewport
        sRadarX = pRegion.RelativeXPos - Math.trunc(RADAR_WINDOW_WIDTH / 2);
        sRadarY = pRegion.RelativeYPos - Math.trunc(RADAR_WINDOW_HEIGHT / 2);

        AdjustWorldCenterFromRadarCoords(sRadarX, sRadarY);
      } else {
        KillOverheadMap();
      }
    } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
      if (!InOverheadMap()) {
        GoIntoOverheadMap();
      } else {
        KillOverheadMap();
      }
    }
  }

  export function RenderRadarScreen(): void {
    let sRadarTLX: INT16;
    let sRadarTLY: INT16;
    let sRadarBRX: INT16;
    let sRadarBRY: INT16;
    let sRadarCX: INT16;
    let sRadarCY: INT16;
    let iItemNumber: INT32 = 0;

    let sX_S: INT16;
    let sY_S: INT16;
    let sScreenCenterX: INT16;
    let sScreenCenterY: INT16;
    let sDistToCenterY: INT16;
    let sDistToCenterX: INT16;
    let sTopLeftWorldX: INT16;
    let sTopLeftWorldY: INT16;
    let sTopRightWorldX: INT16;
    let sTopRightWorldY: INT16;
    let sBottomLeftWorldX: INT16;
    let sBottomLeftWorldY: INT16;
    let sBottomRightWorldX: INT16;
    let sBottomRightWorldY: INT16;

    let pSoldier: SOLDIERTYPE;

    let sXSoldPos: INT16;
    let sYSoldPos: INT16;
    let sXSoldScreen: INT16;
    let sYSoldScreen: INT16;
    let sXSoldRadar: INT16;
    let sYSoldRadar: INT16;

    let uiDestPitchBYTES: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray;
    let usLineColor: UINT16;
    let cnt: UINT32;
    let sHeight: INT16;
    let sWidth: INT16;
    let sX: INT16;
    let sY: INT16;
    let iCounter: INT32 = 0;

    // create / destroy squad list regions as nessacary
    CreateDestroyMouseRegionsForSquadList();

    // check if we are allowed to do anything?
    if (fRenderRadarScreen == false) {
      RenderSquadList();
      return;
    }

    if (AreInMeanwhile() == true) {
      // in a meanwhile, don't render any map
      fImageLoaded = false;
    }

    if (fInterfacePanelDirty == DIRTYLEVEL2 && fImageLoaded) {
      // Set to default
      SetObjectHandleShade(gusRadarImage, 0);

      // If night time and on surface, darken the radarmap.
      if (NightTime()) {
        if (
          (guiCurrentScreen == ScreenIds.MAP_SCREEN && !iCurrentMapSectorZ) ||
          (guiCurrentScreen == ScreenIds.GAME_SCREEN && !gbWorldSectorZ)
        ) {
          SetObjectHandleShade(gusRadarImage, 1);
        }
      }

      BltVideoObjectFromIndex(
        guiSAVEBUFFER,
        gusRadarImage,
        0,
        RADAR_WINDOW_X,
        gsRadarY,
        VO_BLT_SRCTRANSPARENCY,
        null,
      );
    }

    // FIRST DELETE WHAT'S THERE
    RestoreExternBackgroundRect(
      RADAR_WINDOW_X,
      gsRadarY,
      RADAR_WINDOW_WIDTH + 1,
      RADAR_WINDOW_HEIGHT + 1,
    );

    // Determine scale factors

    // Find the diustance from render center to true world center
    sDistToCenterX = gsRenderCenterX - gCenterWorldX;
    sDistToCenterY = gsRenderCenterY - gCenterWorldY;

    // From render center in world coords, convert to render center in "screen" coords
    ({ sScreenX: sScreenCenterX, sScreenY: sScreenCenterY } =
      FromCellToScreenCoordinates(sDistToCenterX, sDistToCenterY));

    // Subtract screen center
    sScreenCenterX += gsCX;
    sScreenCenterY += gsCY;

    // Get corners in screen coords
    // TOP LEFT
    sX_S = Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
    sY_S = Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

    sTopLeftWorldX = sScreenCenterX - sX_S;
    sTopLeftWorldY = sScreenCenterY - sY_S;

    sTopRightWorldX = sScreenCenterX + sX_S;
    sTopRightWorldY = sScreenCenterY - sY_S;

    sBottomLeftWorldX = sScreenCenterX - sX_S;
    sBottomLeftWorldY = sScreenCenterY + sY_S;

    sBottomRightWorldX = sScreenCenterX + sX_S;
    sBottomRightWorldY = sScreenCenterY + sY_S;

    // Determine radar coordinates
    sRadarCX = Math.trunc(gsCX * gdScaleX);
    sRadarCY = Math.trunc(gsCY * gdScaleY);

    sWidth = RADAR_WINDOW_WIDTH;
    sHeight = RADAR_WINDOW_HEIGHT;
    sX = RADAR_WINDOW_X;
    sY = gsRadarY;

    sRadarTLX = Math.trunc(
      sTopLeftWorldX * gdScaleX - sRadarCX + sX + sWidth / 2,
    );
    sRadarTLY = Math.trunc(
      sTopLeftWorldY * gdScaleY - sRadarCY + gsRadarY + sHeight / 2,
    );
    sRadarBRX = Math.trunc(
      sBottomRightWorldX * gdScaleX - sRadarCX + sX + sWidth / 2,
    );
    sRadarBRY = Math.trunc(
      sBottomRightWorldY * gdScaleY - sRadarCY + gsRadarY + sHeight / 2,
    );

    pDestBuf = LockVideoSurface(
      FRAME_BUFFER,
      createPointer(
        () => uiDestPitchBYTES,
        (v) => (uiDestPitchBYTES = v),
      ),
    );

    SetClippingRegionAndImageWidth(
      uiDestPitchBYTES,
      RADAR_WINDOW_X,
      gsRadarY,
      RADAR_WINDOW_X + RADAR_WINDOW_WIDTH - 1,
      gsRadarY + RADAR_WINDOW_HEIGHT - 1,
    );

    if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
      usLineColor = Get16BPPColor(FROMRGB(0, 255, 0));
      RectangleDraw(
        true,
        sRadarTLX,
        sRadarTLY,
        sRadarBRX,
        sRadarBRY - 1,
        usLineColor,
        pDestBuf,
      );
    }

    // Cycle fFlash variable
    if (COUNTERDONE(Enum386.RADAR_MAP_BLINK)) {
      RESETCOUNTER(Enum386.RADAR_MAP_BLINK);

      gfRadarCurrentGuyFlash = !gfRadarCurrentGuyFlash;
    }

    if (
      guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN &&
      fShowMapInventoryPool == true
    ) {
      let iNumberOfItems: INT32 = 0;

      iNumberOfItems = GetTotalNumberOfItems();

      for (iCounter = 0; iCounter < MAP_INVENTORY_POOL_SLOT_COUNT; iCounter++) {
        iItemNumber =
          iCounter + iCurrentInventoryPoolPage * MAP_INVENTORY_POOL_SLOT_COUNT;
        // stolen item
        if (
          pInventoryPoolList[iItemNumber].o.ubNumberOfObjects == 0 ||
          pInventoryPoolList[iItemNumber].sGridNo == 0
        ) {
          // yep, continue on
          continue;
        }

        ({ sX: sXSoldPos, sY: sYSoldPos } = ConvertGridNoToXY(
          pInventoryPoolList[iItemNumber].sGridNo,
        ));
        ({ sScreenX: sXSoldScreen, sScreenY: sYSoldScreen } =
          GetWorldXYAbsoluteScreenXY(sXSoldPos, sYSoldPos));

        // get radar x and y postion
        sXSoldRadar = sXSoldScreen * gdScaleX;
        sYSoldRadar = sYSoldScreen * gdScaleY;

        // Add starting relative to interface
        sXSoldRadar += RADAR_WINDOW_X;
        sYSoldRadar += gsRadarY;

        // if we are in 16 bit mode....kind of redundant

        if (fFlashHighLightInventoryItemOnradarMap) {
          usLineColor = Get16BPPColor(FROMRGB(0, 255, 0));
        } else {
          // DB Need to add a radar color for 8-bit
          usLineColor = Get16BPPColor(FROMRGB(255, 255, 255));
        }

        if (iCurrentlyHighLightedItem == iCounter) {
          RectangleDraw(
            true,
            sXSoldRadar,
            sYSoldRadar,
            sXSoldRadar + 1,
            sYSoldRadar + 1,
            usLineColor,
            pDestBuf,
          );
        }
      }
    }

    if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
      // RE-RENDER RADAR
      for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
        pSoldier = MercSlots[cnt];

        if (pSoldier != null) {
          // Don't place guys in radar until visible!
          if (
            pSoldier.bVisible == -1 &&
            !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS) &&
            !(pSoldier.ubMiscSoldierFlags & SOLDIER_MISC_XRAYED)
          ) {
            continue;
          }

          // Don't render guys if they are dead!
          if (pSoldier.uiStatusFlags & SOLDIER_DEAD) {
            continue;
          }

          // Don't render crows
          if (pSoldier.ubBodyType == Enum194.CROW) {
            continue;
          }

          // Get FULL screen coordinate for guy's position
          // Getxy from gridno
          ({ sX: sXSoldPos, sY: sYSoldPos } = ConvertGridNoToXY(
            pSoldier.sGridNo,
          ));
          ({ sScreenX: sXSoldScreen, sScreenY: sYSoldScreen } =
            GetWorldXYAbsoluteScreenXY(sXSoldPos, sYSoldPos));

          sXSoldRadar = sXSoldScreen * gdScaleX;
          sYSoldRadar = sYSoldScreen * gdScaleY;

          if (!SoldierOnVisibleWorldTile(pSoldier)) {
            continue;
          }

          // Add starting relative to interface
          sXSoldRadar += RADAR_WINDOW_X;
          sYSoldRadar += gsRadarY;

          // DB Need to add a radar color for 8-bit

          // Are we a selected guy?
          if (pSoldier.ubID == gusSelectedSoldier) {
            if (gfRadarCurrentGuyFlash) {
              usLineColor = 0;
            } else {
              // If on roof, make darker....
              if (pSoldier.bLevel > 0) {
                usLineColor = Get16BPPColor(FROMRGB(150, 150, 0));
              } else {
                usLineColor = Get16BPPColor(
                  gTacticalStatus.Team[pSoldier.bTeam].RadarColor,
                );
              }
            }
          } else {
            usLineColor = Get16BPPColor(
              gTacticalStatus.Team[pSoldier.bTeam].RadarColor,
            );

            // Override civ team with red if hostile...
            if (
              pSoldier.bTeam == CIV_TEAM &&
              !pSoldier.bNeutral &&
              pSoldier.bSide != gbPlayerNum
            ) {
              usLineColor = Get16BPPColor(FROMRGB(255, 0, 0));
            }

            // Render different color if an enemy and he's unconscious
            if (pSoldier.bTeam != gbPlayerNum && pSoldier.bLife < OKLIFE) {
              usLineColor = Get16BPPColor(FROMRGB(128, 128, 128));
            }

            // If on roof, make darker....
            if (pSoldier.bTeam == gbPlayerNum && pSoldier.bLevel > 0) {
              usLineColor = Get16BPPColor(FROMRGB(150, 150, 0));
            }
          }

          RectangleDraw(
            true,
            sXSoldRadar,
            sYSoldRadar,
            sXSoldRadar + 1,
            sYSoldRadar + 1,
            usLineColor,
            pDestBuf,
          );
        }
      }
    }
    UnLockVideoSurface(FRAME_BUFFER);

    if (
      guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN &&
      fShowMapInventoryPool == true
    ) {
      InvalidateRegion(
        RADAR_WINDOW_X,
        gsRadarY,
        RADAR_WINDOW_X + RADAR_WINDOW_WIDTH,
        gsRadarY + RADAR_WINDOW_HEIGHT,
      );
    }

    return;
  }

  function AdjustWorldCenterFromRadarCoords(
    sRadarX: INT16,
    sRadarY: INT16,
  ): void {
    let sScreenX: INT16;
    let sScreenY: INT16;
    let sTempX_W: INT16;
    let sTempY_W: INT16;
    let sNewCenterWorldX: INT16;
    let sNewCenterWorldY: INT16;
    let sNumXSteps: INT16;
    let sNumYSteps: INT16;

    // Use radar scale values to get screen values, then convert ot map values, rounding to nearest middle tile
    sScreenX = Math.trunc(sRadarX / gdScaleX);
    sScreenY = Math.trunc(sRadarY / gdScaleY);

    // Adjust to viewport start!
    sScreenX -= Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
    sScreenY -= Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

    // Make sure these coordinates are multiples of scroll steps
    sNumXSteps = Math.trunc(sScreenX / SCROLL_X_STEP);
    sNumYSteps = Math.trunc(sScreenY / SCROLL_Y_STEP);

    sScreenX = sNumXSteps * SCROLL_X_STEP;
    sScreenY = sNumYSteps * SCROLL_Y_STEP;

    // Adjust back
    sScreenX += Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
    sScreenY += Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

    // Subtract world center
    // sScreenX += gsCX;
    // sScreenY += gsCY;

    // Convert these into world coordinates
    ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
      sScreenX,
      sScreenY,
    ));

    // Adjust these to world center
    sNewCenterWorldX = gCenterWorldX + sTempX_W;
    sNewCenterWorldY = gCenterWorldY + sTempY_W;

    SetRenderCenter(sNewCenterWorldX, sNewCenterWorldY);
  }

  function DisableRadarScreenRender(): void {
    fRenderRadarScreen = false;
    return;
  }

  function EnableRadarScreenRender(): void {
    fRenderRadarScreen = true;
    return;
  }

  export function ToggleRadarScreenRender(): void {
    fRenderRadarScreen = !fRenderRadarScreen;
    return;
  }

  /* static */ let CreateDestroyMouseRegionsForSquadList__fCreated: boolean =
    false;
  function CreateDestroyMouseRegionsForSquadList(): boolean {
    // will check the state of renderradarscreen flag and decide if we need to create mouse regions for
    let sCounter: INT16 = 0;
    let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
    let hHandle: SGPVObject;
    let uiHandle: UINT32;

    if (
      fRenderRadarScreen == false &&
      CreateDestroyMouseRegionsForSquadList__fCreated == false
    ) {
      // create regions
      // load graphics
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\squadpanel.sti");
      if (!(uiHandle = AddVideoObject(VObjectDesc))) {
        return false;
      }

      hHandle = GetVideoObject(uiHandle);
      BltVideoObject(
        guiSAVEBUFFER,
        hHandle,
        0,
        538,
        0 + gsVIEWPORT_END_Y,
        VO_BLT_SRCTRANSPARENCY,
        null,
      );

      RestoreExternBackgroundRect(
        538,
        gsVIEWPORT_END_Y,
        640 - 538,
        480 - gsVIEWPORT_END_Y,
      );

      for (sCounter = 0; sCounter < Enum275.NUMBER_OF_SQUADS; sCounter++) {
        // run through list of squads and place appropriatly
        if (sCounter < Math.trunc(Enum275.NUMBER_OF_SQUADS / 2)) {
          // left half of list
          MSYS_DefineRegion(
            gRadarRegionSquadList[sCounter],
            RADAR_WINDOW_X,
            SQUAD_WINDOW_TM_Y() +
              Math.trunc(
                sCounter *
                  Math.trunc(
                    (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST) /
                      Math.trunc(Enum275.NUMBER_OF_SQUADS / 2),
                  ),
              ),
            RADAR_WINDOW_X + Math.trunc(RADAR_WINDOW_WIDTH / 2) - 1,
            SQUAD_WINDOW_TM_Y() +
              (sCounter + 1) *
                Math.trunc(
                  (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST) /
                    Math.trunc(Enum275.NUMBER_OF_SQUADS / 2),
                ),
            MSYS_PRIORITY_HIGHEST,
            0,
            TacticalSquadListMvtCallback,
            TacticalSquadListBtnCallBack,
          );
        } else {
          // right half of list
          MSYS_DefineRegion(
            gRadarRegionSquadList[sCounter],
            RADAR_WINDOW_X + Math.trunc(RADAR_WINDOW_WIDTH / 2),
            SQUAD_WINDOW_TM_Y() +
              (sCounter - Math.trunc(Enum275.NUMBER_OF_SQUADS / 2)) *
                Math.trunc(
                  (2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST)) /
                    Enum275.NUMBER_OF_SQUADS,
                ),
            RADAR_WINDOW_X + RADAR_WINDOW_WIDTH - 1,
            SQUAD_WINDOW_TM_Y() +
              (sCounter + 1 - Math.trunc(Enum275.NUMBER_OF_SQUADS / 2)) *
                Math.trunc(
                  (2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST)) /
                    Enum275.NUMBER_OF_SQUADS,
                ),
            MSYS_PRIORITY_HIGHEST,
            0,
            TacticalSquadListMvtCallback,
            TacticalSquadListBtnCallBack,
          );
        }

        // set user data
        MSYS_SetRegionUserData(gRadarRegionSquadList[sCounter], 0, sCounter);
      }

      DeleteVideoObjectFromIndex(uiHandle);

      // reset the highlighted line
      sSelectedSquadLine = -1;

      // set fact regions are created
      CreateDestroyMouseRegionsForSquadList__fCreated = true;
    } else if (
      fRenderRadarScreen == true &&
      CreateDestroyMouseRegionsForSquadList__fCreated == true
    ) {
      // destroy regions

      for (sCounter = 0; sCounter < Enum275.NUMBER_OF_SQUADS; sCounter++) {
        MSYS_RemoveRegion(gRadarRegionSquadList[sCounter]);
      }

      // set fact regions are destroyed
      CreateDestroyMouseRegionsForSquadList__fCreated = false;

      if (guiCurrentScreen == ScreenIds.GAME_SCREEN) {
        // dirty region
        fInterfacePanelDirty = DIRTYLEVEL2;

        MarkButtonsDirty();

        // re render region
        RenderTacticalInterface();

        RenderButtons();

        // if game is paused, then render paused game text
        RenderPausedGameBox();
      }
    }

    return true;
  }

  function RenderSquadList(): void {
    // show list of squads
    let sCounter: INT16 = 0;
    let sX: INT16;
    let sY: INT16;

    // clear region
    RestoreExternBackgroundRect(
      RADAR_WINDOW_X,
      gsRadarY,
      RADAR_WINDOW_WIDTH,
      SQUAD_REGION_HEIGHT,
    );

    // fill area
    ColorFillVideoSurfaceArea(
      FRAME_BUFFER,
      RADAR_WINDOW_X,
      RADAR_WINDOW_TM_Y,
      RADAR_WINDOW_X + RADAR_WINDOW_WIDTH,
      RADAR_WINDOW_TM_Y + SQUAD_REGION_HEIGHT,
      Get16BPPColor(FROMRGB(0, 0, 0)),
    );

    // set font
    SetFont(SQUAD_FONT());

    for (sCounter = 0; sCounter < Enum275.NUMBER_OF_SQUADS; sCounter++) {
      // run through list of squads and place appropriatly
      if (sCounter < Math.trunc(Enum275.NUMBER_OF_SQUADS / 2)) {
        ({ sX, sY } = FindFontCenterCoordinates(
          RADAR_WINDOW_X,
          SQUAD_WINDOW_TM_Y() +
            sCounter *
              Math.trunc(
                (2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST)) /
                  Enum275.NUMBER_OF_SQUADS,
              ),
          Math.trunc(RADAR_WINDOW_WIDTH / 2) - 1,
          Math.trunc(
            (2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST)) /
              Enum275.NUMBER_OF_SQUADS,
          ),
          pSquadMenuStrings[sCounter],
          SQUAD_FONT(),
        ));
      } else {
        ({ sX, sY } = FindFontCenterCoordinates(
          RADAR_WINDOW_X + Math.trunc(RADAR_WINDOW_WIDTH / 2),
          SQUAD_WINDOW_TM_Y() +
            (sCounter - Math.trunc(Enum275.NUMBER_OF_SQUADS / 2)) *
              Math.trunc(
                (2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST)) /
                  Enum275.NUMBER_OF_SQUADS,
              ),
          Math.trunc(RADAR_WINDOW_WIDTH / 2) - 1,
          Math.trunc(
            (2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST)) /
              Enum275.NUMBER_OF_SQUADS,
          ),
          pSquadMenuStrings[sCounter],
          SQUAD_FONT(),
        ));
      }

      // highlight line?
      if (sSelectedSquadLine == sCounter) {
        SetFontForeground(FONT_WHITE);
      } else {
        if (IsSquadOnCurrentTacticalMap(sCounter) == true) {
          if (CurrentSquad() == sCounter) {
            SetFontForeground(FONT_LTGREEN);
          } else {
            SetFontForeground(FONT_DKGREEN);
          }
        } else {
          SetFontForeground(FONT_BLACK);
        }
      }

      SetFontBackground(FONT_BLACK);

      if (sCounter < Math.trunc(Enum275.NUMBER_OF_SQUADS / 2)) {
        sX = RADAR_WINDOW_X + 2;
      } else {
        sX = RADAR_WINDOW_X + Math.trunc(RADAR_WINDOW_WIDTH / 2) - 2;
      }
      mprintf(sX, sY, pSquadMenuStrings[sCounter]);
    }
  }

  function TacticalSquadListMvtCallback(
    pRegion: MOUSE_REGION,
    iReason: INT32,
  ): void {
    let iValue: INT32 = -1;

    iValue = MSYS_GetRegionUserData(pRegion, 0);

    if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
      if (IsSquadOnCurrentTacticalMap(iValue) == true) {
        sSelectedSquadLine = iValue;
      }
    }
    if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      sSelectedSquadLine = -1;
    }

    return;
  }

  function TacticalSquadListBtnCallBack(
    pRegion: MOUSE_REGION,
    iReason: INT32,
  ): void {
    // btn callback handler for team list info region
    let iValue: INT32 = 0;

    iValue = MSYS_GetRegionUserData(pRegion, 0);

    if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      // find out if this squad is valid and on this map..if so, set as selected
      if (IsSquadOnCurrentTacticalMap(iValue) == true) {
        // ok, squad is here, set as selected
        SetCurrentSquad(iValue, false);

        // stop showing
        fRenderRadarScreen = true;
      }
    }

    return;
  }
}
