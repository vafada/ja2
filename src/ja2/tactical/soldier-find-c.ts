namespace ja2 {
  // This value is used to keep a small static array of uBID's which are stacked
  const MAX_STACKED_MERCS = 10;

  let gScrollSlideInertiaDirection: UINT32[] /* [NUM_WORLD_DIRECTIONS] */ = [
    3, 0, 0, 0, 0, 0, 3, 3,
  ];

  // Struct used for cycling through multiple mercs per mouse position
  interface SOLDIER_STACK_TYPE {
    bNum: INT8;
    ubIDs: UINT8[] /* [MAX_STACKED_MERCS] */;
    bCur: INT8;
    fUseGridNo: boolean;
    sUseGridNoGridNo: UINT16;
  }

  function createSoldierStackType(): SOLDIER_STACK_TYPE {
    return {
      bNum: 0,
      ubIDs: createArray(MAX_STACKED_MERCS, 0),
      bCur: 0,
      fUseGridNo: false,
      sUseGridNoGridNo: 0,
    };
  }

  let gSoldierStack: SOLDIER_STACK_TYPE = createSoldierStackType();
  let gfHandleStack: boolean = false;

  export function FindSoldierFromMouse(
    pusSoldierIndex: Pointer<UINT16>,
    pMercFlags: Pointer<UINT32>,
  ): boolean {
    let sMapPos: INT16 = 0;

    pMercFlags.value = 0;

    if (
      GetMouseMapPos(
        createPointer(
          () => sMapPos,
          (v) => (sMapPos = v),
        ),
      )
    ) {
      if (
        FindSoldier(
          sMapPos,
          pusSoldierIndex,
          pMercFlags,
          FINDSOLDIERSAMELEVEL(gsInterfaceLevel),
        )
      ) {
        return true;
      }
    }

    return false;
  }

  function SelectiveFindSoldierFromMouse(
    pusSoldierIndex: Pointer<UINT16>,
    pMercFlags: Pointer<UINT32>,
  ): boolean {
    let sMapPos: INT16 = 0;

    pMercFlags.value = 0;

    if (
      GetMouseMapPos(
        createPointer(
          () => sMapPos,
          (v) => (sMapPos = v),
        ),
      )
    ) {
      if (
        FindSoldier(
          sMapPos,
          pusSoldierIndex,
          pMercFlags,
          FINDSOLDIERSAMELEVEL(gsInterfaceLevel),
        )
      ) {
        return true;
      }
    }

    return false;
  }

  function GetSoldierFindFlags(ubID: UINT16): UINT32 {
    let MercFlags: UINT32 = 0;
    let pSoldier: SOLDIERTYPE;

    // Get pSoldier!
    pSoldier = MercPtrs[ubID];

    // FInd out and set flags
    if (ubID == gusSelectedSoldier) {
      MercFlags |= SELECTED_MERC;
    }
    if (
      ubID >= gTacticalStatus.Team[gbPlayerNum].bFirstID &&
      ubID <= gTacticalStatus.Team[gbPlayerNum].bLastID
    ) {
      if (
        pSoldier.uiStatusFlags & SOLDIER_VEHICLE &&
        !GetNumberInVehicle(pSoldier.bVehicleID)
      ) {
        // Don't do anything!
      } else {
        // It's our own merc
        MercFlags |= OWNED_MERC;

        if (pSoldier.bAssignment < Enum117.ON_DUTY) {
          MercFlags |= ONDUTY_MERC;
        }
      }
    } else {
      // Check the side, etc
      if (!pSoldier.bNeutral && pSoldier.bSide != gbPlayerNum) {
        // It's an enemy merc
        MercFlags |= ENEMY_MERC;
      } else {
        // It's not an enemy merc
        MercFlags |= NEUTRAL_MERC;
      }
    }

    // Check for a guy who does not have an iterrupt ( when applicable! )
    if (!OK_INTERRUPT_MERC(pSoldier)) {
      MercFlags |= NOINTERRUPT_MERC;
    }

    if (pSoldier.bLife < OKLIFE) {
      MercFlags |= UNCONSCIOUS_MERC;
    }

    if (pSoldier.bLife == 0) {
      MercFlags |= DEAD_MERC;
    }

    if (pSoldier.bVisible != -1 || gTacticalStatus.uiFlags & SHOW_ALL_MERCS) {
      MercFlags |= VISIBLE_MERC;
    }

    return MercFlags;
  }

  // THIS FUNCTION IS CALLED FAIRLY REGULARLY
  export function FindSoldier(
    sGridNo: INT16,
    pusSoldierIndex: Pointer<UINT16>,
    pMercFlags: Pointer<UINT32>,
    uiFlags: UINT32,
  ): boolean {
    let cnt: UINT32;
    let pSoldier: SOLDIERTYPE;
    let aRect: SGPRect = createSGPRect();
    let fSoldierFound: boolean = false;
    let sXMapPos: INT16;
    let sYMapPos: INT16;
    let sScreenX: INT16;
    let sScreenY: INT16;
    let sMaxScreenMercY: INT16;
    let sHeighestMercScreenY: INT16 = -32000;
    let fDoFull: boolean;
    let ubBestMerc: UINT8 = NOBODY;
    let usAnimSurface: UINT16;
    let iMercScreenX: INT32;
    let iMercScreenY: INT32;
    let fInScreenRect: boolean = false;
    let fInGridNo: boolean = false;

    pusSoldierIndex.value = NOBODY;
    pMercFlags.value = 0;

    if (_KeyDown(SHIFT)) {
      uiFlags = FIND_SOLDIER_GRIDNO;
    }

    // Set some values
    if (uiFlags & FIND_SOLDIER_BEGINSTACK) {
      gSoldierStack.bNum = 0;
      gSoldierStack.fUseGridNo = false;
    }

    // Loop through all mercs and make go
    for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
      pSoldier = MercSlots[cnt];
      fInScreenRect = false;
      fInGridNo = false;

      if (pSoldier != null) {
        if (
          pSoldier.bActive &&
          !(pSoldier.uiStatusFlags & SOLDIER_DEAD) &&
          (pSoldier.bVisible != -1 || gTacticalStatus.uiFlags & SHOW_ALL_MERCS)
        ) {
          // OK, ignore if we are a passenger...
          if (pSoldier.uiStatusFlags & (SOLDIER_PASSENGER | SOLDIER_DRIVER)) {
            continue;
          }

          // If we want same level, skip if buggy's not on the same level!
          if (uiFlags & FIND_SOLDIER_SAMELEVEL) {
            if (pSoldier.bLevel != uiFlags >> 16) {
              continue;
            }
          }

          // If we are selective.... do our own guys FULL and other with gridno!
          // First look for owned soldiers, by way of the full method
          if (uiFlags & FIND_SOLDIER_GRIDNO) {
            fDoFull = false;
          } else if (uiFlags & FIND_SOLDIER_SELECTIVE) {
            if (
              pSoldier.ubID >= gTacticalStatus.Team[gbPlayerNum].bFirstID &&
              pSoldier.ubID <= gTacticalStatus.Team[gbPlayerNum].bLastID
            ) {
              fDoFull = true;
            } else {
              fDoFull = false;
            }
          } else {
            fDoFull = true;
          }

          if (fDoFull) {
            // Get Rect contained in the soldier
            GetSoldierScreenRect(pSoldier, aRect);

            // Get XY From gridno
            ({ sX: sXMapPos, sY: sYMapPos } = ConvertGridNoToXY(sGridNo));

            // Get screen XY pos from map XY
            // Be carefull to convert to cell cords
            // CellXYToScreenXY( (INT16)((sXMapPos*CELL_X_SIZE)), (INT16)((sYMapPos*CELL_Y_SIZE)), &sScreenX, &sScreenY);

            // Set mouse stuff
            sScreenX = gusMouseXPos;
            sScreenY = gusMouseYPos;

            if (IsPointInScreenRect(sScreenX, sScreenY, aRect)) {
              fInScreenRect = true;
            }

            if (pSoldier.sGridNo == sGridNo) {
              fInGridNo = true;
            }

            // ATE: If we are an enemy....
            if (!gGameSettings.fOptions[Enum8.TOPTION_SMART_CURSOR]) {
              if (
                pSoldier.ubID >= gTacticalStatus.Team[gbPlayerNum].bFirstID &&
                pSoldier.ubID <= gTacticalStatus.Team[gbPlayerNum].bLastID
              ) {
                // ATE: NOT if we are in action or comfirm action mode
                if (
                  (gCurrentUIMode != Enum206.ACTION_MODE &&
                    gCurrentUIMode != Enum206.CONFIRM_ACTION_MODE) ||
                  gUIActionModeChangeDueToMouseOver
                ) {
                  fInScreenRect = false;
                }
              }
            }

            // ATE: Refine this further....
            // Check if this is the selected guy....
            if (pSoldier.ubID == gusSelectedSoldier) {
              // Are we in action mode...
              if (
                gCurrentUIMode == Enum206.ACTION_MODE ||
                gCurrentUIMode == Enum206.CONFIRM_ACTION_MODE
              ) {
                // Are we in medic mode?
                if (GetActionModeCursor(pSoldier) != AIDCURS) {
                  fInScreenRect = false;
                  fInGridNo = false;
                }
              }
            }

            // Make sure we are always on guy if we are on same gridno
            if (fInScreenRect || fInGridNo) {
              // Check if we are a vehicle and refine if so....
              if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
                usAnimSurface = GetSoldierAnimationSurface(
                  pSoldier,
                  pSoldier.usAnimState,
                );

                if (usAnimSurface != INVALID_ANIMATION_SURFACE) {
                  iMercScreenX = sScreenX - aRect.iLeft;
                  iMercScreenY = -1 * (sScreenY - aRect.iBottom);

                  if (
                    !CheckVideoObjectScreenCoordinateInData(
                      gAnimSurfaceDatabase[usAnimSurface].hVideoObject,
                      pSoldier.usAniFrame,
                      iMercScreenX,
                      iMercScreenY,
                    )
                  ) {
                    continue;
                  }
                }
              }

              // If thgis is from a gridno, use mouse pos!
              if (pSoldier.sGridNo == sGridNo) {
              }

              // Only break here if we're not creating a stack of these fellas
              if (uiFlags & FIND_SOLDIER_BEGINSTACK) {
                gfHandleStack = true;

                // Add this one!
                gSoldierStack.ubIDs[gSoldierStack.bNum] = pSoldier.ubID;
                gSoldierStack.bNum++;

                // Determine if it's the current
                if (aRect.iBottom > sHeighestMercScreenY) {
                  sMaxScreenMercY = aRect.iBottom;
                  sHeighestMercScreenY = sMaxScreenMercY;

                  gSoldierStack.bCur = gSoldierStack.bNum - 1;
                }
              }
              // Are we handling a stack right now?
              else if (gfHandleStack) {
                // Are we the selected stack?
                if (gSoldierStack.fUseGridNo) {
                  fSoldierFound = false;
                  break;
                } else if (
                  gSoldierStack.ubIDs[gSoldierStack.bCur] == pSoldier.ubID
                ) {
                  // Set it!
                  ubBestMerc = pSoldier.ubID;

                  fSoldierFound = true;
                  break;
                }
              } else {
                // Determine if it's the best one
                if (aRect.iBottom > sHeighestMercScreenY) {
                  sMaxScreenMercY = aRect.iBottom;
                  sHeighestMercScreenY = sMaxScreenMercY;

                  // Set it!
                  ubBestMerc = pSoldier.ubID;
                }

                fSoldierFound = true;
                // Don't break here, find the rest!
              }
            }
          } else {
            // Otherwise, look for a bad guy by way of gridno]
            // Selective means don't give out enemy mercs if they are not visible

            ///&& !NewOKDestination( pSoldier, sGridNo, TRUE, (INT8)gsInterfaceLevel )
            if (
              pSoldier.sGridNo == sGridNo &&
              !NewOKDestination(pSoldier, sGridNo, true, gsInterfaceLevel)
            ) {
              // Set it!
              ubBestMerc = pSoldier.ubID;

              fSoldierFound = true;
              break;
            }
          }
        }
      }
    }

    if (fSoldierFound && ubBestMerc != NOBODY) {
      pusSoldierIndex.value = ubBestMerc;

      pMercFlags.value = GetSoldierFindFlags(ubBestMerc);

      return true;
    } else {
      // If we were handling a stack, and we have not found anybody, end
      if (
        gfHandleStack &&
        !(uiFlags & (FIND_SOLDIER_BEGINSTACK | FIND_SOLDIER_SELECTIVE))
      ) {
        if (gSoldierStack.fUseGridNo) {
          if (gSoldierStack.sUseGridNoGridNo != sGridNo) {
            gfHandleStack = false;
          }
        } else {
          gfHandleStack = false;
        }
      }
    }
    return false;
  }

  export function CycleSoldierFindStack(usMapPos: UINT16): boolean {
    let usSoldierIndex: UINT16 = 0;
    let uiMercFlags: UINT32 = 0;

    // Have we initalized for this yet?
    if (!gfHandleStack) {
      if (
        FindSoldier(
          usMapPos,
          createPointer(
            () => usSoldierIndex,
            (v) => (usSoldierIndex = v),
          ),
          createPointer(
            () => uiMercFlags,
            (v) => (uiMercFlags = v),
          ),
          FINDSOLDIERSAMELEVEL(gsInterfaceLevel) | FIND_SOLDIER_BEGINSTACK,
        )
      ) {
        gfHandleStack = true;
      }
    }

    if (gfHandleStack) {
      // we are cycling now?
      if (!gSoldierStack.fUseGridNo) {
        gSoldierStack.bCur++;
      }

      gfUIForceReExamineCursorData = true;

      if (gSoldierStack.bCur == gSoldierStack.bNum) {
        if (!gSoldierStack.fUseGridNo) {
          gSoldierStack.fUseGridNo = true;
          gUIActionModeChangeDueToMouseOver = false;
          gSoldierStack.sUseGridNoGridNo = usMapPos;
        } else {
          gSoldierStack.bCur = 0;
          gSoldierStack.fUseGridNo = false;
        }
      }

      if (!gSoldierStack.fUseGridNo) {
        gusUIFullTargetID = gSoldierStack.ubIDs[gSoldierStack.bCur];
        guiUIFullTargetFlags = GetSoldierFindFlags(gusUIFullTargetID);
        guiUITargetSoldierId = gusUIFullTargetID;
        gfUIFullTargetFound = true;
      } else {
        gfUIFullTargetFound = false;
      }
    }

    // Return if we are in the cycle mode now...
    return gfHandleStack;
  }

  export function SimpleFindSoldier(
    sGridNo: INT16,
    bLevel: INT8,
  ): SOLDIERTYPE | null {
    let ubID: UINT8;

    ubID = WhoIsThere2(sGridNo, bLevel);
    if (ubID == NOBODY) {
      return null;
    } else {
      return MercPtrs[ubID];
    }
  }

  export function IsValidTargetMerc(ubSoldierID: UINT8): boolean {
    let pSoldier: SOLDIERTYPE = MercPtrs[ubSoldierID];

    // CHECK IF ACTIVE!
    if (!pSoldier.bActive) {
      return false;
    }

    // CHECK IF DEAD
    if (pSoldier.bLife == 0) {
      // return( FALSE );
    }

    // IF BAD GUY - CHECK VISIVILITY
    if (pSoldier.bTeam != gbPlayerNum) {
      if (
        pSoldier.bVisible == -1 &&
        !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)
      ) {
        return false;
      }
    }

    return true;
  }

  function IsGridNoInScreenRect(sGridNo: INT16, pRect: SGPRect): boolean {
    let iXTrav: INT32;
    let iYTrav: INT32;
    let sMapPos: INT16;

    // Start with top left corner
    iXTrav = pRect.iLeft;
    iYTrav = pRect.iTop;

    do {
      do {
        sMapPos = GetScreenXYGridNo(iXTrav, iYTrav);

        if (sMapPos == sGridNo) {
          return true;
        }

        iXTrav += WORLD_TILE_X;
      } while (iXTrav < pRect.iRight);

      iYTrav += WORLD_TILE_Y;
      iXTrav = pRect.iLeft;
    } while (iYTrav < pRect.iBottom);

    return false;
  }

  function GetSoldierScreenRect(pSoldier: SOLDIERTYPE, pRect: SGPRect): void {
    let sMercScreenX: INT16;
    let sMercScreenY: INT16;
    let usAnimSurface: UINT16;
    //		ETRLEObject *pTrav;
    //		UINT32 usHeight, usWidth;

    ({ sScreenX: sMercScreenX, sScreenY: sMercScreenY } =
      GetSoldierScreenPos(pSoldier));

    usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);
    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
      pRect.iLeft = sMercScreenX;
      pRect.iTop = sMercScreenY;
      pRect.iBottom = sMercScreenY + 5;
      pRect.iRight = sMercScreenX + 5;

      return;
    }

    // pTrav = &(gAnimSurfaceDatabase[ usAnimSurface ].hVideoObject->pETRLEObject[ pSoldier->usAniFrame ] );
    // usHeight				= (UINT32)pTrav->usHeight;
    // usWidth					= (UINT32)pTrav->usWidth;

    pRect.iLeft = sMercScreenX;
    pRect.iTop = sMercScreenY;
    pRect.iBottom = sMercScreenY + pSoldier.sBoundingBoxHeight;
    pRect.iRight = sMercScreenX + pSoldier.sBoundingBoxWidth;
  }

  export function GetSoldierAnimDims(pSoldier: SOLDIERTYPE): {
    sHeight: INT16;
    sWidth: INT16;
  } {
    let sHeight: INT16;
    let sWidth: INT16;

    let usAnimSurface: UINT16;

    usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
      sHeight = 5;
      sWidth = 5;

      return { sHeight, sWidth };
    }

    // OK, noodle here on what we should do... If we take each frame, it will be different slightly
    // depending on the frame and the value returned here will vary thusly. However, for the
    // uses of this function, we should be able to use just the first frame...

    if (
      pSoldier.usAniFrame >=
      gAnimSurfaceDatabase[usAnimSurface].hVideoObject.usNumberOfObjects
    ) {
      let i: number = 0;
    }

    sHeight = pSoldier.sBoundingBoxHeight;
    sWidth = pSoldier.sBoundingBoxWidth;
    return { sHeight, sWidth };
  }

  export function GetSoldierAnimOffsets(pSoldier: SOLDIERTYPE): {
    sOffsetX: INT16;
    sOffsetY: INT16;
  } {
    let sOffsetX: INT16;
    let sOffsetY: INT16;

    let usAnimSurface: UINT16;

    usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
      sOffsetX = 0;
      sOffsetY = 0;

      return { sOffsetX, sOffsetY };
    }

    sOffsetX = pSoldier.sBoundingBoxOffsetX;
    sOffsetY = pSoldier.sBoundingBoxOffsetY;

    return { sOffsetX, sOffsetY };
  }

  export function GetSoldierScreenPos(pSoldier: SOLDIERTYPE): {
    sScreenX: INT16;
    sScreenY: INT16;
  } {
    let sScreenX: INT16;
    let sScreenY: INT16;

    let sMercScreenX: INT16;
    let sMercScreenY: INT16;
    let dOffsetX: FLOAT;
    let dOffsetY: FLOAT;
    let dTempX_S: FLOAT;
    let dTempY_S: FLOAT;
    let usAnimSurface: UINT16;
    //		ETRLEObject *pTrav;

    usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
      sScreenX = 0;
      sScreenY = 0;
      return { sScreenX, sScreenY };
    }

    // Get 'TRUE' merc position
    dOffsetX = pSoldier.dXPos - gsRenderCenterX;
    dOffsetY = pSoldier.dYPos - gsRenderCenterY;

    ({ dScreenX: dTempX_S, dScreenY: dTempY_S } =
      FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

    // pTrav = &(gAnimSurfaceDatabase[ usAnimSurface ].hVideoObject->pETRLEObject[ pSoldier->usAniFrame ] );

    sMercScreenX =
      Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) +
      Math.trunc(dTempX_S);
    sMercScreenY =
      Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) +
      Math.trunc(dTempY_S);

    // Adjust starting screen coordinates
    sMercScreenX -= gsRenderWorldOffsetX;
    sMercScreenY -= gsRenderWorldOffsetY;
    sMercScreenY -= gpWorldLevelData[pSoldier.sGridNo].sHeight;

    // Adjust for render height
    sMercScreenY += gsRenderHeight;

    // Add to start position of dest buffer
    // sMercScreenX += pTrav->sOffsetX;
    // sMercScreenY += pTrav->sOffsetY;
    sMercScreenX += pSoldier.sBoundingBoxOffsetX;
    sMercScreenY += pSoldier.sBoundingBoxOffsetY;

    sMercScreenY -= pSoldier.sHeightAdjustment;

    sScreenX = sMercScreenX;
    sScreenY = sMercScreenY;

    return { sScreenX, sScreenY };
  }

  // THE TRUE SCREN RECT DOES NOT TAKE THE OFFSETS OF BUDDY INTO ACCOUNT!
  export function GetSoldierTRUEScreenPos(pSoldier: SOLDIERTYPE): {
    sMercScreenX: INT16;
    sMercScreenY: INT16;
  } {
    let sMercScreenX: INT16;
    let sMercScreenY: INT16;
    let dOffsetX: FLOAT;
    let dOffsetY: FLOAT;
    let dTempX_S: FLOAT;
    let dTempY_S: FLOAT;
    let usAnimSurface: UINT16;

    usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
      sMercScreenX = 0;
      sMercScreenY = 0;
      return { sMercScreenX, sMercScreenY };
    }

    // Get 'TRUE' merc position
    dOffsetX = pSoldier.dXPos - gsRenderCenterX;
    dOffsetY = pSoldier.dYPos - gsRenderCenterY;

    ({ dScreenX: dTempX_S, dScreenY: dTempY_S } =
      FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

    sMercScreenX =
      Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) +
      Math.trunc(dTempX_S);
    sMercScreenY =
      Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) +
      Math.trunc(dTempY_S);

    // Adjust starting screen coordinates
    sMercScreenX -= gsRenderWorldOffsetX;
    sMercScreenY -= gsRenderWorldOffsetY;

    // Adjust for render height
    sMercScreenY += gsRenderHeight;
    sMercScreenY -= gpWorldLevelData[pSoldier.sGridNo].sHeight;

    sMercScreenY -= pSoldier.sHeightAdjustment;

    return { sMercScreenX, sMercScreenY };
  }

  export function GridNoOnScreen(sGridNo: INT16): boolean {
    let sNewCenterWorldX: INT16;
    let sNewCenterWorldY: INT16;
    let sWorldX: INT16;
    let sWorldY: INT16;
    let sAllowance: INT16 = 20;

    if (gsVIEWPORT_WINDOW_START_Y == 20) {
      sAllowance = 40;
    }

    ({ sX: sNewCenterWorldX, sY: sNewCenterWorldY } =
      ConvertGridNoToXY(sGridNo));

    // Get screen coordinates for current position of soldier
    ({ sScreenX: sWorldX, sScreenY: sWorldY } = GetWorldXYAbsoluteScreenXY(
      sNewCenterWorldX,
      sNewCenterWorldY,
    ));

    // ATE: OK, here, adjust the top value so that it's a tile and a bit over, because of our mercs!
    if (
      sWorldX >= gsTopLeftWorldX &&
      sWorldX <= gsBottomRightWorldX &&
      sWorldY >= gsTopLeftWorldY + sAllowance &&
      sWorldY <= gsBottomRightWorldY + 20
    ) {
      return true;
    }
    return false;
  }

  export function SoldierOnScreen(usID: UINT16): boolean {
    let pSoldier: SOLDIERTYPE;

    // Get pointer of soldier
    pSoldier = MercPtrs[usID];

    return GridNoOnScreen(pSoldier.sGridNo);
  }

  export function SoldierOnVisibleWorldTile(pSoldier: SOLDIERTYPE): boolean {
    return GridNoOnVisibleWorldTile(pSoldier.sGridNo);
  }

  /* static */ let SoldierLocationRelativeToScreen__fCountdown: UINT8 /* boolean */ = 0;
  export function SoldierLocationRelativeToScreen(
    sGridNo: INT16,
    usReasonID: UINT16,
    pbDirection: Pointer<INT8>,
    puiScrollFlags: Pointer<UINT32>,
  ): boolean {
    let sWorldX: INT16;
    let sWorldY: INT16;
    let sY: INT16;
    let sX: INT16;
    let sScreenCenterX: INT16;
    let sScreenCenterY: INT16;
    let sDistToCenterY: INT16;
    let sDistToCenterX: INT16;

    puiScrollFlags.value = 0;

    sX = CenterX(sGridNo);
    sY = CenterY(sGridNo);

    // Get screen coordinates for current position of soldier
    ({ sScreenX: sWorldX, sScreenY: sWorldY } = GetWorldXYAbsoluteScreenXY(
      Math.trunc(sX / CELL_X_SIZE),
      Math.trunc(sY / CELL_Y_SIZE),
    ));

    // Find the diustance from render center to true world center
    sDistToCenterX = gsRenderCenterX - gCenterWorldX;
    sDistToCenterY = gsRenderCenterY - gCenterWorldY;

    // From render center in world coords, convert to render center in "screen" coords
    ({ sScreenX: sScreenCenterX, sScreenY: sScreenCenterY } =
      FromCellToScreenCoordinates(sDistToCenterX, sDistToCenterY));

    // Subtract screen center
    sScreenCenterX += gsCX;
    sScreenCenterY += gsCY;

    // Adjust for offset origin!
    sScreenCenterX += 0;
    sScreenCenterY += 10;

    // Get direction
    //*pbDirection = atan8( sScreenCenterX, sScreenCenterY, sWorldX, sWorldY );
    pbDirection.value = atan8(gsRenderCenterX, gsRenderCenterY, sX, sY);

    // Check values!
    if (sWorldX > sScreenCenterX + 20) {
      puiScrollFlags.value |= SCROLL_RIGHT;
    }
    if (sWorldX < sScreenCenterX - 20) {
      puiScrollFlags.value |= SCROLL_LEFT;
    }
    if (sWorldY > sScreenCenterY + 20) {
      puiScrollFlags.value |= SCROLL_DOWN;
    }
    if (sWorldY < sScreenCenterY - 20) {
      puiScrollFlags.value |= SCROLL_UP;
    }

    // If we are on screen, stop
    if (
      sWorldX >= gsTopLeftWorldX &&
      sWorldX <= gsBottomRightWorldX &&
      sWorldY >= gsTopLeftWorldY &&
      sWorldY <= gsBottomRightWorldY + 20
    ) {
      // CHECK IF WE ARE DONE...
      if (
        SoldierLocationRelativeToScreen__fCountdown >
        gScrollSlideInertiaDirection[pbDirection.value]
      ) {
        SoldierLocationRelativeToScreen__fCountdown = 0;
        return false;
      } else {
        SoldierLocationRelativeToScreen__fCountdown++;
      }
    }

    return true;
  }

  export function IsPointInSoldierBoundingBox(
    pSoldier: SOLDIERTYPE,
    sX: INT16,
    sY: INT16,
  ): boolean {
    let aRect: SGPRect = createSGPRect();

    // Get Rect contained in the soldier
    GetSoldierScreenRect(pSoldier, aRect);

    if (IsPointInScreenRect(sX, sY, aRect)) {
      return true;
    }

    return false;
  }

  export function FindRelativeSoldierPosition(
    pSoldier: SOLDIERTYPE,
    usFlags: Pointer<UINT16>,
    sX: INT16,
    sY: INT16,
  ): boolean {
    let aRect: SGPRect = createSGPRect();
    let sRelX: INT16 = 0;
    let sRelY: INT16 = 0;
    let dRelPer: FLOAT;

    // Get Rect contained in the soldier
    GetSoldierScreenRect(pSoldier, aRect);

    if (
      IsPointInScreenRectWithRelative(
        sX,
        sY,
        aRect,
        createPointer(
          () => sRelX,
          (v) => (sRelX = v),
        ),
        createPointer(
          () => sRelY,
          (v) => (sRelY = v),
        ),
      )
    ) {
      dRelPer = sRelY / (aRect.iBottom - aRect.iTop);

      // Determine relative positions
      switch (gAnimControl[pSoldier.usAnimState].ubHeight) {
        case ANIM_STAND:
          if (dRelPer < 0.2) {
            usFlags.value = TILE_FLAG_HEAD;
            return true;
          } else if (dRelPer < 0.6) {
            usFlags.value = TILE_FLAG_MID;
            return true;
          } else {
            usFlags.value = TILE_FLAG_FEET;
            return true;
          }
          break;

        case ANIM_CROUCH:
          if (dRelPer < 0.2) {
            usFlags.value = TILE_FLAG_HEAD;
            return true;
          } else if (dRelPer < 0.7) {
            usFlags.value = TILE_FLAG_MID;
            return true;
          } else {
            usFlags.value = TILE_FLAG_FEET;
            return true;
          }
          break;
      }
    }

    return false;
  }

  // VERY quickly finds a soldier at gridno , ( that is visible )
  export function QuickFindSoldier(sGridNo: INT16): UINT8 {
    let cnt: UINT32;
    let pSoldier: SOLDIERTYPE;

    // Loop through all mercs and make go
    for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
      pSoldier = MercSlots[cnt];

      if (pSoldier != null) {
        if (pSoldier.sGridNo == sGridNo && pSoldier.bVisible != -1) {
          return cnt;
        }
      }
    }

    return NOBODY;
  }

  export function GetGridNoScreenPos(
    sGridNo: INT16,
    ubLevel: UINT8,
  ): { sScreenX: INT16; sScreenY: INT16 } {
    let sScreenX: INT16;
    let sScreenY: INT16;
    let dOffsetX: FLOAT;
    let dOffsetY: FLOAT;
    let dTempX_S: FLOAT;
    let dTempY_S: FLOAT;

    // Get 'TRUE' merc position
    dOffsetX = CenterX(sGridNo) - gsRenderCenterX;
    dOffsetY = CenterY(sGridNo) - gsRenderCenterY;

    // OK, DONT'T ASK... CONVERSION TO PROPER Y NEEDS THIS...
    dOffsetX -= CELL_Y_SIZE;

    ({ dScreenX: dTempX_S, dScreenY: dTempY_S } =
      FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

    sScreenX =
      Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) +
      Math.trunc(dTempX_S);
    sScreenY =
      Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) +
      Math.trunc(dTempY_S);

    // Adjust starting screen coordinates
    sScreenX -= gsRenderWorldOffsetX;
    sScreenY -= gsRenderWorldOffsetY;

    sScreenY += gsRenderHeight;

    // Adjust for world height
    sScreenY -= gpWorldLevelData[sGridNo].sHeight;

    // Adjust for level height
    if (ubLevel) {
      sScreenY -= ROOF_LEVEL_HEIGHT;
    }

    return { sScreenX, sScreenY };
  }
}
