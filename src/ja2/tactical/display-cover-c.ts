namespace ja2 {
  //*******  Local Defines **************************************************

  const DC_MAX_COVER_RANGE = 31;

  const DC__SOLDIER_VISIBLE_RANGE = 31;

  const DC__MIN_SIZE = 4;
  const DC__MAX_SIZE = 11;

  interface BEST_COVER_STRUCT {
    sGridNo: INT16;
    bCover: INT8; //% chance that the gridno is fully covered.  ie 100 if safe, 0  is has no cover
  }

  function createBestCoverStruct(): BEST_COVER_STRUCT {
    return {
      sGridNo: 0,
      bCover: 0,
    };
  }

  function resetBestCoverStruct(o: BEST_COVER_STRUCT) {
    o.sGridNo = 0;
    o.bCover = 0;
  }

  interface VISIBLE_TO_SOLDIER_STRUCT {
    sGridNo: INT16;
    bVisibleToSoldier: INT8;
    fRoof: boolean;
  }

  function createVisibleToSoldierStruct(): VISIBLE_TO_SOLDIER_STRUCT {
    return {
      sGridNo: 0,
      bVisibleToSoldier: 0,
      fRoof: false,
    };
  }

  function resetVisibleToSoldierStruct(o: VISIBLE_TO_SOLDIER_STRUCT) {
    o.sGridNo = 0;
    o.bVisibleToSoldier = 0;
    o.fRoof = false;
  }

  /*
#define	DC__PRONE				(INT8)( 0x01 )
#define DC__CROUCH			(INT8)( 0x02 )
#define DC__STAND				(INT8)( 0x04 )
*/
  const enum Enum205 {
    DC__SEE_NO_STANCES,
    DC__SEE_1_STANCE,
    DC__SEE_2_STANCE,
    DC__SEE_3_STANCE,
  }

  //******  Global Variables  *****************************************

  let gCoverRadius: BEST_COVER_STRUCT[][] /* [DC_MAX_COVER_RANGE][DC_MAX_COVER_RANGE] */ =
    createArrayFrom(DC_MAX_COVER_RANGE, () =>
      createArrayFrom(DC_MAX_COVER_RANGE, createBestCoverStruct),
    );
  let gsLastCoverGridNo: INT16 = NOWHERE;
  let gsLastSoldierGridNo: INT16 = NOWHERE;
  let gbLastStance: INT8 = -1;

  let gVisibleToSoldierStruct: VISIBLE_TO_SOLDIER_STRUCT[][] /* [DC__SOLDIER_VISIBLE_RANGE][DC__SOLDIER_VISIBLE_RANGE] */ =
    createArrayFrom(DC__SOLDIER_VISIBLE_RANGE, () =>
      createArrayFrom(DC__SOLDIER_VISIBLE_RANGE, createVisibleToSoldierStruct),
    );
  let gsLastVisibleToSoldierGridNo: INT16 = NOWHERE;

  //*******  Function Prototypes ***************************************

  // ppp

  //*******  Functions **************************************************

  export function DisplayCoverOfSelectedGridNo(): void {
    let sGridNo: INT16 = 0;
    let bStance: INT8;

    GetMouseMapPos(
      createPointer(
        () => sGridNo,
        (v) => (sGridNo = v),
      ),
    );

    // Only allowed in if there is someone selected
    if (gusSelectedSoldier == NOBODY) {
      return;
    }

    // if the cursor is in a the tactical map
    if (sGridNo != NOWHERE && sGridNo != 0) {
      bStance = GetCurrentMercForDisplayCoverStance();

      // if the gridno is different then the last one that was displayed
      if (
        sGridNo != gsLastCoverGridNo ||
        gbLastStance != bStance ||
        MercPtrs[gusSelectedSoldier].sGridNo != gsLastSoldierGridNo
      ) {
        // if the cover is currently being displayed
        if (
          gsLastCoverGridNo != NOWHERE ||
          gbLastStance != -1 ||
          gsLastSoldierGridNo != NOWHERE
        ) {
          // remove the gridnos
          RemoveCoverOfSelectedGridNo();
        } else {
          // if it is the first time in here

          // pop up a message to say we are in the display cover routine
          ScreenMsg(
            FONT_MCOLOR_LTYELLOW,
            MSG_INTERFACE,
            zNewTacticalMessages[Enum320.TCTL_MSG__DISPLAY_COVER],
          );

          // increment the display cover counter ( just seeing how many times people use it )
          // gJa25SaveStruct.uiDisplayCoverCounter++;
        }

        gbLastStance = bStance;
        gsLastCoverGridNo = sGridNo;
        gsLastSoldierGridNo = MercPtrs[gusSelectedSoldier].sGridNo;

        // Fill the array of gridno and cover values
        CalculateCoverInRadiusAroundGridno(
          sGridNo,
          gGameSettings.ubSizeOfDisplayCover,
        );

        // Add the graphics to each gridno
        AddCoverTileToEachGridNo();

        // Re-render the scene!
        SetRenderFlags(RENDER_FLAG_FULL);
      }
    }
  }

  function AddCoverTileToEachGridNo(): void {
    let uiCntX: UINT32;
    let uiCntY: UINT32;
    let fRoof: boolean = gsInterfaceLevel != Enum214.I_GROUND_LEVEL;

    // loop through all the gridnos
    for (uiCntY = 0; uiCntY < DC_MAX_COVER_RANGE; uiCntY++) {
      for (uiCntX = 0; uiCntX < DC_MAX_COVER_RANGE; uiCntX++) {
        // if there is a valid cover at this gridno
        if (gCoverRadius[uiCntX][uiCntY].bCover != -1) {
          // if the tile provides 80-100% cover
          if (
            gCoverRadius[uiCntX][uiCntY].bCover <= 100 &&
            gCoverRadius[uiCntX][uiCntY].bCover > 80
          ) {
            AddCoverObjectToWorld(
              gCoverRadius[uiCntX][uiCntY].sGridNo,
              Enum312.SPECIALTILE_COVER_5,
              fRoof,
            );
          }

          // else if the tile provides 60-80% cover
          else if (
            gCoverRadius[uiCntX][uiCntY].bCover <= 80 &&
            gCoverRadius[uiCntX][uiCntY].bCover > 60
          ) {
            AddCoverObjectToWorld(
              gCoverRadius[uiCntX][uiCntY].sGridNo,
              Enum312.SPECIALTILE_COVER_4,
              fRoof,
            );
          }

          // else if the tile provides 40-60% cover
          else if (
            gCoverRadius[uiCntX][uiCntY].bCover <= 60 &&
            gCoverRadius[uiCntX][uiCntY].bCover > 40
          ) {
            AddCoverObjectToWorld(
              gCoverRadius[uiCntX][uiCntY].sGridNo,
              Enum312.SPECIALTILE_COVER_3,
              fRoof,
            );
          }

          // else if the tile provides 20-40% cover
          else if (
            gCoverRadius[uiCntX][uiCntY].bCover <= 40 &&
            gCoverRadius[uiCntX][uiCntY].bCover > 20
          ) {
            AddCoverObjectToWorld(
              gCoverRadius[uiCntX][uiCntY].sGridNo,
              Enum312.SPECIALTILE_COVER_2,
              fRoof,
            );
          }

          // else if the tile provides 0-20% cover
          else if (
            gCoverRadius[uiCntX][uiCntY].bCover <= 20 &&
            gCoverRadius[uiCntX][uiCntY].bCover >= 0
          ) {
            AddCoverObjectToWorld(
              gCoverRadius[uiCntX][uiCntY].sGridNo,
              Enum312.SPECIALTILE_COVER_1,
              fRoof,
            );
          }

          // should never get in here
          else {
            Assert(0);
          }
        }
      }
    }
  }

  export function RemoveCoverOfSelectedGridNo(): void {
    let uiCntX: UINT32;
    let uiCntY: UINT32;
    let fRoof: boolean = gsInterfaceLevel != Enum214.I_GROUND_LEVEL;

    if (gsLastCoverGridNo == NOWHERE) {
      return;
    }

    // loop through all the gridnos
    for (uiCntY = 0; uiCntY < DC_MAX_COVER_RANGE; uiCntY++) {
      for (uiCntX = 0; uiCntX < DC_MAX_COVER_RANGE; uiCntX++) {
        // if there is a valid cover at this gridno
        if (gCoverRadius[uiCntX][uiCntY].bCover != -1) {
          //				fRoof = gCoverRadius[ uiCntX ][ uiCntY ].fRoof;

          // if the tile provides 80-100% cover
          if (
            gCoverRadius[uiCntX][uiCntY].bCover <= 100 &&
            gCoverRadius[uiCntX][uiCntY].bCover > 80
          ) {
            RemoveCoverObjectFromWorld(
              gCoverRadius[uiCntX][uiCntY].sGridNo,
              Enum312.SPECIALTILE_COVER_5,
              fRoof,
            );
          }

          // else if the tile provides 60-80% cover
          else if (
            gCoverRadius[uiCntX][uiCntY].bCover <= 80 &&
            gCoverRadius[uiCntX][uiCntY].bCover > 60
          ) {
            RemoveCoverObjectFromWorld(
              gCoverRadius[uiCntX][uiCntY].sGridNo,
              Enum312.SPECIALTILE_COVER_4,
              fRoof,
            );
          }

          // else if the tile provides 40-60% cover
          else if (
            gCoverRadius[uiCntX][uiCntY].bCover <= 60 &&
            gCoverRadius[uiCntX][uiCntY].bCover > 40
          ) {
            RemoveCoverObjectFromWorld(
              gCoverRadius[uiCntX][uiCntY].sGridNo,
              Enum312.SPECIALTILE_COVER_3,
              fRoof,
            );
          }

          // else if the tile provides 20-40% cover
          else if (
            gCoverRadius[uiCntX][uiCntY].bCover <= 40 &&
            gCoverRadius[uiCntX][uiCntY].bCover > 20
          ) {
            RemoveCoverObjectFromWorld(
              gCoverRadius[uiCntX][uiCntY].sGridNo,
              Enum312.SPECIALTILE_COVER_2,
              fRoof,
            );
          }

          // else if the tile provides 0-20% cover
          else if (
            gCoverRadius[uiCntX][uiCntY].bCover <= 20 &&
            gCoverRadius[uiCntX][uiCntY].bCover >= 0
          ) {
            RemoveCoverObjectFromWorld(
              gCoverRadius[uiCntX][uiCntY].sGridNo,
              Enum312.SPECIALTILE_COVER_1,
              fRoof,
            );
          }

          // should never get in here
          else {
            Assert(0);
          }
        }
      }
    }

    // Re-render the scene!
    SetRenderFlags(RENDER_FLAG_FULL);

    gsLastCoverGridNo = NOWHERE;
    gbLastStance = -1;
    gsLastSoldierGridNo = NOWHERE;
  }

  function CalculateCoverInRadiusAroundGridno(
    sTargetGridNo: INT16,
    bSearchRange: INT8,
  ): void {
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;
    let pSoldier: SOLDIERTYPE;
    let sGridNo: INT16;
    let sCounterX: INT16;
    let sCounterY: INT16;
    let ubID: UINT8;
    let bStance: INT8;
    //	BOOLEAN fRoof;

    // clear out the array first
    //	memset( gCoverRadius, -1, DC_MAX_COVER_RANGE * DC_MAX_COVER_RANGE );
    // loop through all the gridnos that we are interested in
    for (sCounterY = 0; sCounterY < DC_MAX_COVER_RANGE; sCounterY++) {
      for (sCounterX = 0; sCounterX < DC_MAX_COVER_RANGE; sCounterX++) {
        gCoverRadius[sCounterX][sCounterY].sGridNo = -1;
        gCoverRadius[sCounterX][sCounterY].bCover = -1;
      }
    }

    if (bSearchRange > Math.trunc(DC_MAX_COVER_RANGE / 2))
      bSearchRange = Math.trunc(DC_MAX_COVER_RANGE / 2);

    // determine maximum horizontal limits
    sMaxLeft = Math.min(bSearchRange, sTargetGridNo % MAXCOL);
    sMaxRight = Math.min(bSearchRange, MAXCOL - ((sTargetGridNo % MAXCOL) + 1));

    // determine maximum vertical limits
    sMaxUp = Math.min(bSearchRange, Math.trunc(sTargetGridNo / MAXROW));
    sMaxDown = Math.min(
      bSearchRange,
      MAXROW - (Math.trunc(sTargetGridNo / MAXROW) + 1),
    );

    // Find out which tiles around the location are reachable
    LocalReachableTest(sTargetGridNo, bSearchRange);

    pSoldier = GetCurrentMercForDisplayCover();

    sCounterX = sCounterY = 0;

    // Determine the stance to use
    bStance = GetCurrentMercForDisplayCoverStance();

    // loop through all the gridnos that we are interested in
    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        sGridNo = sTargetGridNo + sXOffset + MAXCOL * sYOffset;

        // record the gridno
        gCoverRadius[sCounterX][sCounterY].sGridNo = sGridNo;

        /*
                              fRoof = FALSE;

                              //is there a roof above this gridno
                              if( FlatRoofAboveGridNo( sGridNo ) )
                              {
                                      if( IsTheRoofVisible( sGridNo ) )
                                      {
                                              fRoof = TRUE;
                                      }
                              }
      */
        // if the gridno is NOT on screen
        if (!GridNoOnScreen(sGridNo)) {
          continue;
        }

        // if we are to display cover for the roofs, and there is a roof above us
        if (
          gsInterfaceLevel == Enum214.I_ROOF_LEVEL &&
          !FlatRoofAboveGridNo(sGridNo)
        ) {
          continue;
        }

        // if the gridno cant be reached
        if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
          // skip to the next gridno
          sCounterX++;
          continue;
        }

        // if someone (visible) is there, skip
        // Check both bottom level, and top level
        ubID = WhoIsThere2(sGridNo, 0);
        if (ubID == NOBODY) {
          ubID = WhoIsThere2(sGridNo, 1);
        }
        // if someone is here, and they are an enemy, skip over them
        if (
          ubID != NOBODY &&
          Menptr[ubID].bVisible == 1 &&
          Menptr[ubID].bTeam != pSoldier.bTeam
        ) {
          continue;
        }

        // Calculate the cover for this gridno
        gCoverRadius[sCounterX][sCounterY].bCover =
          CalcCoverForGridNoBasedOnTeamKnownEnemies(pSoldier, sGridNo, bStance);
        //			gCoverRadius[ sCounterX ][ sCounterY ].fRoof = fRoof;

        sCounterX++;
      }
      sCounterY++;
      sCounterX = 0;
    }
  }

  function CalcCoverForGridNoBasedOnTeamKnownEnemies(
    pSoldier: SOLDIERTYPE,
    sTargetGridNo: INT16,
    bStance: INT8,
  ): INT8 {
    let iTotalCoverPoints: INT32 = 0;
    let bNumEnemies: INT8 = 0;
    let bPercentCoverForGridno: INT8 = 0;
    let uiLoop: UINT32;
    let pOpponent: SOLDIERTYPE;
    let pbPersOL: INT8;
    let pbPublOL: INT8;
    let iGetThrough: INT32 = 0;
    let iBulletGetThrough: INT32 = 0;
    let iHighestValue: INT32 = 0;
    let iCover: INT32 = 0;
    let usMaxRange: UINT16;
    let usRange: UINT16;
    let usSightLimit: UINT16;

    // loop through all the enemies and determine the cover
    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      pOpponent = MercSlots[uiLoop];

      // if this merc is inactive, at base, on assignment, dead, unconscious
      if (!pOpponent || pOpponent.bLife < OKLIFE) {
        continue; // next merc
      }

      // if this man is neutral / on the same side, he's not an opponent
      if (
        CONSIDERED_NEUTRAL(pSoldier, pOpponent) ||
        pSoldier.bSide == pOpponent.bSide
      ) {
        continue; // next merc
      }

      pbPersOL = pSoldier.bOppList[pOpponent.ubID];
      pbPublOL = gbPublicOpplist[OUR_TEAM][pOpponent.ubID];

      // if this opponent is unknown personally and publicly
      if (
        pbPersOL != SEEN_CURRENTLY &&
        pbPersOL != SEEN_THIS_TURN &&
        pbPublOL != SEEN_CURRENTLY &&
        pbPublOL != SEEN_THIS_TURN
      ) {
        continue; // next merc
      }

      usRange = GetRangeInCellCoordsFromGridNoDiff(
        pOpponent.sGridNo,
        sTargetGridNo,
      );
      usSightLimit = DistanceVisible(
        pOpponent,
        Enum245.DIRECTION_IRRELEVANT,
        Enum245.DIRECTION_IRRELEVANT,
        sTargetGridNo,
        pSoldier.bLevel,
      );

      if (usRange > usSightLimit * CELL_X_SIZE) {
        continue;
      }

      // if actual LOS check fails, then chance to hit is 0, ignore this guy
      if (
        SoldierToVirtualSoldierLineOfSightTest(
          pOpponent,
          sTargetGridNo,
          pSoldier.bLevel,
          bStance,
          usSightLimit,
          true,
        ) == 0
      ) {
        continue;
      }

      iGetThrough = SoldierToLocationChanceToGetThrough(
        pOpponent,
        sTargetGridNo,
        pSoldier.bLevel,
        bStance,
        NOBODY,
      );
      //	iBulletGetThrough = CalcChanceToHitGun( pOpponent, sTargetGridNo, AP_MAX_AIM_ATTACK, AIM_SHOT_TORSO );

      if (WeaponInHand(pOpponent)) {
        usMaxRange = GunRange(pOpponent.inv[Enum261.HANDPOS]);
      } else {
        usMaxRange = Weapon[Enum225.GLOCK_18].usRange;
      }

      iBulletGetThrough = Math.min(
        Math.max(
          Math.trunc(((usMaxRange - usRange) / usMaxRange + 0.3) * 100),
          0,
        ),
        100,
      );

      if (iBulletGetThrough > 5 && iGetThrough > 0) {
        iCover = Math.trunc((iGetThrough * iBulletGetThrough) / 100);

        if (iCover > iHighestValue) iHighestValue = iCover;

        iTotalCoverPoints += iCover;
        bNumEnemies++;
      }
    }

    if (bNumEnemies == 0) {
      bPercentCoverForGridno = 100;
    } else {
      let iTemp: INT32;

      bPercentCoverForGridno = Math.trunc(iTotalCoverPoints / bNumEnemies);

      iTemp = bPercentCoverForGridno - Math.trunc(iHighestValue / bNumEnemies);

      iTemp = iTemp + iHighestValue;

      bPercentCoverForGridno = 100 - Math.min(iTemp, 100);
    }

    return bPercentCoverForGridno;
  }

  function AddCoverObjectToWorld(
    sGridNo: INT16,
    usGraphic: UINT16,
    fRoof: boolean,
  ): void {
    let pNode: LEVELNODE;

    if (fRoof) {
      AddOnRoofToHead(sGridNo, usGraphic);
      pNode = <LEVELNODE>gpWorldLevelData[sGridNo].pOnRoofHead;
    } else {
      AddObjectToHead(sGridNo, usGraphic);
      pNode = <LEVELNODE>gpWorldLevelData[sGridNo].pObjectHead;
    }

    pNode.uiFlags |= LEVELNODE_REVEAL;

    if (NightTime()) {
      pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    }
  }

  function RemoveCoverObjectFromWorld(
    sGridNo: INT16,
    usGraphic: UINT16,
    fRoof: boolean,
  ): void {
    if (fRoof) {
      RemoveOnRoof(sGridNo, usGraphic);
    } else {
      RemoveObject(sGridNo, usGraphic);
    }
  }

  function GetCurrentMercForDisplayCover(): SOLDIERTYPE {
    let pSoldier: SOLDIERTYPE;
    // Get a soldier that is on the player team
    if (gusSelectedSoldier != NOBODY) {
      pSoldier = <SOLDIERTYPE>GetSoldier(gusSelectedSoldier);
    } else {
      Assert(false);
    }
    return pSoldier;
  }

  function GetCurrentMercForDisplayCoverStance(): INT8 {
    let bStance: INT8;
    let pSoldier: SOLDIERTYPE;

    pSoldier = GetCurrentMercForDisplayCover();

    switch (pSoldier.usUIMovementMode) {
      case Enum193.PRONE:
      case Enum193.CRAWLING:
        bStance = ANIM_PRONE;
        break;

      case Enum193.KNEEL_DOWN:
      case Enum193.SWATTING:
      case Enum193.CROUCHING:
        bStance = ANIM_CROUCH;
        break;

      case Enum193.WALKING:
      case Enum193.RUNNING:
      case Enum193.STANDING:
        bStance = ANIM_STAND;
        break;

      default:
        bStance = ANIM_CROUCH;
        break;
    }

    return bStance;
  }

  export function DisplayRangeToTarget(
    pSoldier: SOLDIERTYPE,
    sTargetGridNo: INT16,
  ): void {
    let usRange: UINT16 = 0;
    let zOutputString: string /* CHAR16[512] */;

    if (sTargetGridNo == NOWHERE || sTargetGridNo == 0) {
      return;
    }

    // Get the range to the target location
    usRange = GetRangeInCellCoordsFromGridNoDiff(
      pSoldier.sGridNo,
      sTargetGridNo,
    );

    usRange = Math.trunc(usRange / 10);

    // if the soldier has a weapon in hand,
    if (WeaponInHand(pSoldier)) {
      // display a string with the weapons range, then range to target
      zOutputString = swprintf(
        zNewTacticalMessages[Enum320.TCTL_MSG__RANGE_TO_TARGET_AND_GUN_RANGE],
        Math.trunc(Weapon[pSoldier.inv[Enum261.HANDPOS].usItem].usRange / 10),
        usRange,
      );
    } else {
      // display a string with the range to target
      zOutputString = swprintf(
        zNewTacticalMessages[Enum320.TCTL_MSG__RANGE_TO_TARGET],
        usRange,
      );
    }

    // Display the msg
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, zOutputString);

    // if the target is out of the mercs gun range or knife
    if (
      !InRange(pSoldier, sTargetGridNo) &&
      (Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass == IC_GUN ||
        Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass ==
          IC_THROWING_KNIFE)
    ) {
      // Display a warning saying so
      ScreenMsg(
        FONT_MCOLOR_LTYELLOW,
        MSG_INTERFACE,
        TacticalStr[Enum335.OUT_OF_RANGE_STRING],
      );
    }

    // increment the display gun range counter ( just seeing how many times people use it )
    // gJa25SaveStruct.uiDisplayGunRangeCounter++;
  }

  export function DisplayGridNoVisibleToSoldierGrid(): void {
    let sGridNo: INT16 = 0;
    //	INT8	bStance;

    GetMouseMapPos(
      createPointer(
        () => sGridNo,
        (v) => (sGridNo = v),
      ),
    );

    // Only allowed in if there is someone selected
    if (gusSelectedSoldier == NOBODY) {
      return;
    }

    // if the cursor is in a the tactical map
    if (sGridNo != NOWHERE && sGridNo != 0) {
      // if the gridno is different then the last one that was displayed
      if (
        sGridNo != gsLastVisibleToSoldierGridNo ||
        MercPtrs[gusSelectedSoldier].sGridNo != gsLastSoldierGridNo
      ) {
        // if the cover is currently being displayed
        if (
          gsLastVisibleToSoldierGridNo != NOWHERE ||
          gsLastSoldierGridNo != NOWHERE
        ) {
          // remove the gridnos
          RemoveVisibleGridNoAtSelectedGridNo();
        } else {
          // pop up a message to say we are in the display cover routine
          ScreenMsg(
            FONT_MCOLOR_LTYELLOW,
            MSG_INTERFACE,
            zNewTacticalMessages[Enum320.TCTL_MSG__LOS],
          );
          // increment the display LOS counter ( just seeing how many times people use it )
          // gJa25SaveStruct.uiDisplayLosCounter++;
        }

        gsLastVisibleToSoldierGridNo = sGridNo;
        gsLastSoldierGridNo = MercPtrs[gusSelectedSoldier].sGridNo;

        // Fill the array of gridno and cover values
        CalculateVisibleToSoldierAroundGridno(
          sGridNo,
          gGameSettings.ubSizeOfLOS,
        );

        // Add the graphics to each gridno
        AddVisibleToSoldierToEachGridNo();

        // Re-render the scene!
        SetRenderFlags(RENDER_FLAG_FULL);
      }
    }
  }

  function CalculateVisibleToSoldierAroundGridno(
    sTargetGridNo: INT16,
    bSearchRange: INT8,
  ): void {
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;
    let pSoldier: SOLDIERTYPE;
    let sGridNo: INT16;
    let sCounterX: INT16;
    let sCounterY: INT16;
    let fRoof: boolean = false;

    // clear out the struct
    for (let i = 0; i < gVisibleToSoldierStruct.length; i++) {
      gVisibleToSoldierStruct[i].forEach(resetVisibleToSoldierStruct);
    }

    if (bSearchRange > Math.trunc(DC_MAX_COVER_RANGE / 2))
      bSearchRange = Math.trunc(DC_MAX_COVER_RANGE / 2);

    // determine maximum horizontal limits
    sMaxLeft = Math.min(bSearchRange, sTargetGridNo % MAXCOL);
    sMaxRight = Math.min(bSearchRange, MAXCOL - ((sTargetGridNo % MAXCOL) + 1));

    // determine maximum vertical limits
    sMaxUp = Math.min(bSearchRange, Math.trunc(sTargetGridNo / MAXROW));
    sMaxDown = Math.min(
      bSearchRange,
      MAXROW - (Math.trunc(sTargetGridNo / MAXROW) + 1),
    );

    pSoldier = GetCurrentMercForDisplayCover();

    sCounterX = 0;
    sCounterY = 0;

    // loop through all the gridnos that we are interested in
    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      sCounterX = 0;
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        sGridNo = sTargetGridNo + sXOffset + MAXCOL * sYOffset;
        fRoof = false;

        // record the gridno
        gVisibleToSoldierStruct[sCounterX][sCounterY].sGridNo = sGridNo;

        // if the gridno is NOT on screen
        if (!GridNoOnScreen(sGridNo)) {
          continue;
        }

        // is there a roof above this gridno
        if (FlatRoofAboveGridNo(sGridNo)) {
          if (IsTheRoofVisible(sGridNo) && gbWorldSectorZ == 0) {
            fRoof = true;
          }

          // if wer havent explored the area yet and we are underground, dont show cover
          else if (
            !(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) &&
            gbWorldSectorZ != 0
          ) {
            continue;
          }
        }

        /*
                              //if we are to display cover for the roofs, and there is a roof above us
                              if( gsInterfaceLevel == I_ROOF_LEVEL && !FlatRoofAboveGridNo( sGridNo ) )
                              {
                                      continue;
                              }
      */
        /*
                              // if someone (visible) is there, skip
                              //Check both bottom level, and top level
                              ubID = WhoIsThere2( sGridNo, 0 );
                              if( ubID == NOBODY )
                              {
                                      ubID = WhoIsThere2( sGridNo, 1 );
                              }
                              //if someone is here, and they are an enemy, skip over them
                              if ( ubID != NOBODY && Menptr[ ubID ].bVisible == TRUE && Menptr[ ubID ].bTeam != pSoldier->bTeam )
                              {
                                      continue;
                              }

                              //Calculate the cover for this gridno
                              gCoverRadius[ sCounterX ][ sCounterY ].bCover = CalcCoverForGridNoBasedOnTeamKnownEnemies( pSoldier, sGridNo, bStance );
      */

        gVisibleToSoldierStruct[sCounterX][sCounterY].bVisibleToSoldier =
          CalcIfSoldierCanSeeGridNo(pSoldier, sGridNo, fRoof);
        gVisibleToSoldierStruct[sCounterX][sCounterY].fRoof = fRoof;
        sCounterX++;
      }

      sCounterY++;
    }
  }

  function AddVisibleToSoldierToEachGridNo(): void {
    let uiCntX: UINT32;
    let uiCntY: UINT32;
    let bVisibleToSoldier: INT8 = 0;
    let fRoof: boolean;
    let sGridNo: INT16;

    // loop through all the gridnos
    for (uiCntY = 0; uiCntY < DC_MAX_COVER_RANGE; uiCntY++) {
      for (uiCntX = 0; uiCntX < DC_MAX_COVER_RANGE; uiCntX++) {
        bVisibleToSoldier =
          gVisibleToSoldierStruct[uiCntX][uiCntY].bVisibleToSoldier;
        if (bVisibleToSoldier == -1) {
          continue;
        }

        fRoof = gVisibleToSoldierStruct[uiCntX][uiCntY].fRoof;
        sGridNo = gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo;

        // if the soldier can easily see this gridno.  Can see all 3 positions
        if (bVisibleToSoldier == Enum205.DC__SEE_3_STANCE) {
          AddCoverObjectToWorld(sGridNo, Enum312.SPECIALTILE_COVER_5, fRoof);
        }

        // cant see a thing
        else if (bVisibleToSoldier == Enum205.DC__SEE_NO_STANCES) {
          AddCoverObjectToWorld(
            gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo,
            Enum312.SPECIALTILE_COVER_1,
            fRoof,
          );
        }

        // can only see prone
        else if (bVisibleToSoldier == Enum205.DC__SEE_1_STANCE) {
          AddCoverObjectToWorld(
            gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo,
            Enum312.SPECIALTILE_COVER_2,
            fRoof,
          );
        }

        // can see crouch or prone
        else if (bVisibleToSoldier == Enum205.DC__SEE_2_STANCE) {
          AddCoverObjectToWorld(
            gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo,
            Enum312.SPECIALTILE_COVER_3,
            fRoof,
          );
        } else {
          Assert(0);
        }
      }
    }
  }

  export function RemoveVisibleGridNoAtSelectedGridNo(): void {
    let uiCntX: UINT32;
    let uiCntY: UINT32;
    let bVisibleToSoldier: INT8;
    let sGridNo: INT16;
    let fRoof: boolean;

    // make sure to only remove it when its right
    if (gsLastVisibleToSoldierGridNo == NOWHERE) {
      return;
    }

    // loop through all the gridnos
    for (uiCntY = 0; uiCntY < DC_MAX_COVER_RANGE; uiCntY++) {
      for (uiCntX = 0; uiCntX < DC_MAX_COVER_RANGE; uiCntX++) {
        bVisibleToSoldier =
          gVisibleToSoldierStruct[uiCntX][uiCntY].bVisibleToSoldier;
        fRoof = gVisibleToSoldierStruct[uiCntX][uiCntY].fRoof;
        sGridNo = gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo;

        // if there is a valid cover at this gridno
        if (bVisibleToSoldier == Enum205.DC__SEE_3_STANCE) {
          RemoveCoverObjectFromWorld(
            gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo,
            Enum312.SPECIALTILE_COVER_5,
            fRoof,
          );
        }

        // cant see a thing
        else if (bVisibleToSoldier == Enum205.DC__SEE_NO_STANCES) {
          RemoveCoverObjectFromWorld(
            gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo,
            Enum312.SPECIALTILE_COVER_1,
            fRoof,
          );
        }

        // can only see prone
        else if (bVisibleToSoldier == Enum205.DC__SEE_1_STANCE) {
          RemoveCoverObjectFromWorld(
            gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo,
            Enum312.SPECIALTILE_COVER_2,
            fRoof,
          );
        }

        // can see crouch or prone
        else if (bVisibleToSoldier == Enum205.DC__SEE_2_STANCE) {
          RemoveCoverObjectFromWorld(
            gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo,
            Enum312.SPECIALTILE_COVER_3,
            fRoof,
          );
        } else {
          Assert(0);
        }
      }
    }

    // Re-render the scene!
    SetRenderFlags(RENDER_FLAG_FULL);

    gsLastVisibleToSoldierGridNo = NOWHERE;
    gsLastSoldierGridNo = NOWHERE;
  }

  function CalcIfSoldierCanSeeGridNo(
    pSoldier: SOLDIERTYPE,
    sTargetGridNo: INT16,
    fRoof: boolean,
  ): INT8 {
    let bRetVal: INT8 = 0;
    let iLosForGridNo: INT32 = 0;
    let usSightLimit: UINT16 = 0;
    let pPersOL: INT8;
    let pbPublOL: INT8;
    let ubID: UINT8;
    let bAware: boolean = false;

    if (fRoof) {
      ubID = WhoIsThere2(sTargetGridNo, 1);
    } else {
      ubID = WhoIsThere2(sTargetGridNo, 0);
    }

    if (ubID != NOBODY) {
      pPersOL = pSoldier.bOppList[ubID];
      pbPublOL = gbPublicOpplist[pSoldier.bTeam][ubID];

      // if soldier is known about (SEEN or HEARD within last few turns)
      if (pPersOL || pbPublOL) {
        bAware = true;
      }
    }

    usSightLimit = DistanceVisible(
      pSoldier,
      Enum245.DIRECTION_IRRELEVANT,
      Enum245.DIRECTION_IRRELEVANT,
      sTargetGridNo,
      Number(fRoof),
    );

    //
    // Prone
    //
    iLosForGridNo = SoldierToVirtualSoldierLineOfSightTest(
      pSoldier,
      sTargetGridNo,
      Number(fRoof),
      ANIM_PRONE,
      usSightLimit,
      bAware,
    );
    if (iLosForGridNo != 0) {
      bRetVal++;
    }

    //
    // Crouch
    //
    iLosForGridNo = SoldierToVirtualSoldierLineOfSightTest(
      pSoldier,
      sTargetGridNo,
      Number(fRoof),
      ANIM_CROUCH,
      usSightLimit,
      bAware,
    );
    if (iLosForGridNo != 0) {
      bRetVal++;
    }

    //
    // Standing
    //
    iLosForGridNo = SoldierToVirtualSoldierLineOfSightTest(
      pSoldier,
      sTargetGridNo,
      Number(fRoof),
      ANIM_STAND,
      usSightLimit,
      bAware,
    );
    if (iLosForGridNo != 0) {
      bRetVal++;
    }

    return bRetVal;
  }

  function IsTheRoofVisible(sGridNo: INT16): boolean {
    let ubRoom: UINT8;

    if ((ubRoom = InARoom(sGridNo)) !== -1) {
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) {
        if (gTacticalStatus.uiFlags & SHOW_ALL_ROOFS) return true;
        else return false;
      } else {
        return true;
      }
    }

    return false;
  }

  export function ChangeSizeOfDisplayCover(iNewSize: INT32): void {
    // if the new size is smaller or greater, scale it
    if (iNewSize < DC__MIN_SIZE) {
      iNewSize = DC__MIN_SIZE;
    } else if (iNewSize > DC__MAX_SIZE) {
      iNewSize = DC__MAX_SIZE;
    }

    // Set new size
    gGameSettings.ubSizeOfDisplayCover = iNewSize;

    // redisplay the cover
    RemoveCoverOfSelectedGridNo();
    DisplayCoverOfSelectedGridNo();
  }

  export function ChangeSizeOfLOS(iNewSize: INT32): void {
    // if the new size is smaller or greater, scale it
    if (iNewSize < DC__MIN_SIZE) {
      iNewSize = DC__MIN_SIZE;
    } else if (iNewSize > DC__MAX_SIZE) {
      iNewSize = DC__MAX_SIZE;
    }

    // Set new size
    gGameSettings.ubSizeOfLOS = iNewSize;

    // ReDisplay the los
    RemoveVisibleGridNoAtSelectedGridNo();
    DisplayGridNoVisibleToSoldierGrid();
  }
}
