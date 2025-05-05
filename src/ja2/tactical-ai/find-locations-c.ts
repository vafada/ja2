namespace ja2 {
  export let gubAIPathCosts: INT8[][] /* [19][19] */ = createArrayFrom(19, () =>
    createArray(19, 0),
  );

  function CalcPercentBetter(
    iOldValue: INT32,
    iNewValue: INT32,
    iOldScale: INT32,
    iNewScale: INT32,
  ): INT32 {
    let iValueChange: INT32;
    let iScaleSum: INT32;
    let iPercentBetter: INT32; //,loopCnt,tempInt;

    // calcalate how much better the new cover would be than the current cover
    iValueChange = iNewValue - iOldValue;

    // here, the change in cover HAS to be an improvement over current cover
    if (iValueChange <= 0) {
      return NOWHERE;
    }

    iScaleSum = iOldScale + iNewScale;

    // here, the change in cover HAS to be an improvement over current cover
    if (iScaleSum <= 0) {
      return NOWHERE;
    }

    iPercentBetter = Math.trunc((iValueChange * 100) / iScaleSum);

    return iPercentBetter;
  }

  function AICenterXY(sGridNo: INT16): { dX: FLOAT; dY: FLOAT } {
    let dX: FLOAT;
    let dY: FLOAT;

    let sXPos: INT16;
    let sYPos: INT16;

    sXPos = sGridNo % WORLD_COLS;
    sYPos = Math.trunc(sGridNo / WORLD_COLS);

    dX = sXPos * CELL_X_SIZE + CELL_X_SIZE / 2;
    dY = sYPos * CELL_Y_SIZE + CELL_Y_SIZE / 2;

    return { dX, dY };
  }

  function CalcWorstCTGTForPosition(
    pSoldier: SOLDIERTYPE,
    ubOppID: UINT8,
    sOppGridNo: INT16,
    bLevel: INT8,
    iMyAPsLeft: INT32,
  ): INT8 {
    // When considering a gridno for cover, we want to take into account cover if we
    // lie down, so we return the LOWEST chance to get through for that location.
    let bCubeLevel: INT8;
    let bThisCTGT: INT8;
    let bWorstCTGT: INT8 = 100;

    for (bCubeLevel = 1; bCubeLevel <= 3; bCubeLevel++) {
      switch (bCubeLevel) {
        case 1:
          if (iMyAPsLeft < AP_CROUCH + AP_PRONE) {
            continue;
          }
          break;
        case 2:
          if (iMyAPsLeft < AP_CROUCH) {
            continue;
          }
          break;
        default:
          break;
      }

      bThisCTGT = SoldierToLocationChanceToGetThrough(
        pSoldier,
        sOppGridNo,
        bLevel,
        bCubeLevel,
        ubOppID,
      );
      if (bThisCTGT < bWorstCTGT) {
        bWorstCTGT = bThisCTGT;
        // if there is perfect cover
        if (bWorstCTGT == 0)
          // then bail from the for loop, it can't possible get any better
          break;
      }
    }
    return bWorstCTGT;
  }

  function CalcAverageCTGTForPosition(
    pSoldier: SOLDIERTYPE,
    ubOppID: UINT8,
    sOppGridNo: INT16,
    bLevel: INT8,
    iMyAPsLeft: INT32,
  ): INT8 {
    // When considering a gridno for cover, we want to take into account cover if we
    // lie down, so we return the LOWEST chance to get through for that location.
    let bCubeLevel: INT8;
    let iTotalCTGT: INT32 = 0;
    let bValidCubeLevels: INT32 = 0;
    for (bCubeLevel = 1; bCubeLevel <= 3; bCubeLevel++) {
      switch (bCubeLevel) {
        case 1:
          if (iMyAPsLeft < AP_CROUCH + AP_PRONE) {
            continue;
          }
          break;
        case 2:
          if (iMyAPsLeft < AP_CROUCH) {
            continue;
          }
          break;
        default:
          break;
      }
      iTotalCTGT += SoldierToLocationChanceToGetThrough(
        pSoldier,
        sOppGridNo,
        bLevel,
        bCubeLevel,
        ubOppID,
      );
      bValidCubeLevels++;
    }
    iTotalCTGT = Math.trunc(iTotalCTGT / bValidCubeLevels);
    return iTotalCTGT;
  }

  function CalcBestCTGT(
    pSoldier: SOLDIERTYPE,
    ubOppID: UINT8,
    sOppGridNo: INT16,
    bLevel: INT8,
    iMyAPsLeft: INT32,
  ): INT8 {
    // NOTE: CTGT stands for "ChanceToGetThrough..."

    // using only ints for maximum execution speed here
    // CJC: Well, so much for THAT idea!
    let sCentralGridNo: INT16;
    let sAdjSpot: INT16;
    let sNorthGridNo: INT16;
    let sSouthGridNo: INT16;
    let sDir: INT16;
    let sCheckSpot: INT16;
    let sOKTest: boolean /* INT16 */;

    let bThisCTGT: INT8;
    let bBestCTGT: INT8 = 0;

    sCheckSpot = -1;

    sCentralGridNo = pSoldier.sGridNo;

    // precalculate these for speed
    // what was struct for?
    sOKTest = NewOKDestination(pSoldier, sCentralGridNo, IGNOREPEOPLE, bLevel);
    sNorthGridNo = NewGridNo(sCentralGridNo, DirectionInc(Enum245.NORTH));
    sSouthGridNo = NewGridNo(sCentralGridNo, DirectionInc(Enum245.SOUTH));

    // look into all 8 adjacent tiles & determine where the cover is the worst
    for (sDir = 1; sDir <= 8; sDir++) {
      // get the gridno of the adjacent spot lying in that direction
      sAdjSpot = NewGridNo(sCentralGridNo, DirectionInc(sDir));

      // if it wasn't out of bounds
      if (sAdjSpot != sCentralGridNo) {
        // if the adjacent spot can we walked on and isn't in water or gas
        if (
          NewOKDestination(pSoldier, sAdjSpot, IGNOREPEOPLE, bLevel) &&
          !InWaterOrGas(pSoldier, sAdjSpot)
        ) {
          switch (sDir) {
            case Enum245.NORTH:
            case Enum245.EAST:
            case Enum245.SOUTH:
            case Enum245.WEST:
              sCheckSpot = sAdjSpot;
              break;
            case Enum245.NORTHEAST:
            case Enum245.NORTHWEST:
              // spot to the NORTH is guaranteed to be in bounds since NE/NW was
              sCheckSpot = sNorthGridNo;
              break;
            case Enum245.SOUTHEAST:
            case Enum245.SOUTHWEST:
              // spot to the SOUTH is guaranteed to be in bounds since SE/SW was
              sCheckSpot = sSouthGridNo;
              break;
          }

          // ATE: OLD STUFF
          // if the adjacent gridno is reachable from the starting spot
          if (NewOKDestination(pSoldier, sCheckSpot, false, bLevel)) {
            // the dude could move to this adjacent gridno, so put him there
            // "virtually" so we can calculate what our cover is from there

            // NOTE: GOTTA SET THESE 3 FIELDS *BACK* AFTER USING THIS FUNCTION!!!
            pSoldier.sGridNo = sAdjSpot; // pretend he's standing at 'sAdjSpot'
            ({ dX: pSoldier.dXPos, dY: pSoldier.dYPos } = AICenterXY(sAdjSpot));
            bThisCTGT = CalcWorstCTGTForPosition(
              pSoldier,
              ubOppID,
              sOppGridNo,
              bLevel,
              iMyAPsLeft,
            );
            if (bThisCTGT > bBestCTGT) {
              bBestCTGT = bThisCTGT;
              // if there is no cover
              if (bBestCTGT == 100)
                // then bail from the for loop, it can't possible get any better
                break;
            }
          }
        }
      }
    }

    return bBestCTGT;
  }

  function CalcCoverValue(
    pMe: SOLDIERTYPE,
    sMyGridNo: INT16,
    iMyThreat: INT32,
    iMyAPsLeft: INT32,
    uiThreatIndex: UINT32,
    iRange: INT32,
    morale: INT32,
    iTotalScale: Pointer<INT32>,
  ): INT32 {
    // all 32-bit integers for max. speed
    let iMyPosValue: INT32;
    let iHisPosValue: INT32;
    let iCoverValue: INT32;
    let iReductionFactor: INT32;
    let iThisScale: INT32;
    let sHisGridNo: INT16;
    let sMyRealGridNo: INT16 = NOWHERE;
    let sHisRealGridNo: INT16 = NOWHERE;
    let sTempX: INT16;
    let sTempY: INT16;
    let dMyX: FLOAT;
    let dMyY: FLOAT;
    let dHisX: FLOAT;
    let dHisY: FLOAT;
    let bHisBestCTGT: INT8;
    let bHisActualCTGT: INT8;
    let bHisCTGT: INT8;
    let bMyCTGT: INT8;
    let iRangeChange: INT32;
    let iRangeFactor: INT32;
    let iRangeFactorMultiplier: INT32;
    let pHim: SOLDIERTYPE;

    dMyX = dMyY = dHisX = dHisY = -1.0;

    pHim = Threat[uiThreatIndex].pOpponent;
    sHisGridNo = Threat[uiThreatIndex].sGridNo;

    // THE FOLLOWING STUFF IS *VEERRRY SCAARRRY*, BUT SHOULD WORK.  IF YOU REALLY
    // HATE IT, THEN CHANGE ChanceToGetThrough() TO WORK FROM A GRIDNO TO GRIDNO

    // if this is theoretical, and I'm not actually at sMyGridNo right now
    if (pMe.sGridNo != sMyGridNo) {
      sMyRealGridNo = pMe.sGridNo; // remember where I REALLY am
      dMyX = pMe.dXPos;
      dMyY = pMe.dYPos;

      pMe.sGridNo = sMyGridNo; // but pretend I'm standing at sMyGridNo
      ({ sX: sTempX, sY: sTempY } = ConvertGridNoToCenterCellXY(sMyGridNo));
      pMe.dXPos = sTempX;
      pMe.dYPos = sTempY;
    }

    // if this is theoretical, and he's not actually at hisGrid right now
    if (pHim.sGridNo != sHisGridNo) {
      sHisRealGridNo = pHim.sGridNo; // remember where he REALLY is
      dHisX = pHim.dXPos;
      dHisY = pHim.dYPos;

      pHim.sGridNo = sHisGridNo; // but pretend he's standing at sHisGridNo
      ({ sX: sTempX, sY: sTempY } = ConvertGridNoToCenterCellXY(sHisGridNo));
      pHim.dXPos = sTempX;
      pHim.dYPos = sTempY;
    }

    if (InWaterOrGas(pHim, sHisGridNo)) {
      bHisActualCTGT = 0;
    } else {
      // optimistically assume we'll be behind the best cover available at this spot

      // bHisActualCTGT = ChanceToGetThrough(pHim,sMyGridNo,FAKE,ACTUAL,TESTWALLS,9999,M9PISTOL,NOT_FOR_LOS); // assume a gunshot
      bHisActualCTGT = CalcWorstCTGTForPosition(
        pHim,
        pMe.ubID,
        sMyGridNo,
        pMe.bLevel,
        iMyAPsLeft,
      );
    }

    // normally, that will be the cover I'll use, unless worst case over-rides it
    bHisCTGT = bHisActualCTGT;

    // only calculate his best case CTGT if there is room for improvement!
    if (bHisActualCTGT < 100) {
      // if we didn't remember his real gridno earlier up above, we got to now,
      // because calculating worst case is about to play with it in a big way!
      if (sHisRealGridNo == NOWHERE) {
        sHisRealGridNo = pHim.sGridNo; // remember where he REALLY is
        dHisX = pHim.dXPos;
        dHisY = pHim.dYPos;
      }

      // calculate where my cover is worst if opponent moves just 1 tile over
      bHisBestCTGT = CalcBestCTGT(
        pHim,
        pMe.ubID,
        sMyGridNo,
        pMe.bLevel,
        iMyAPsLeft,
      );

      // if he can actually improve his CTGT by moving to a nearby gridno
      if (bHisBestCTGT > bHisActualCTGT) {
        // he may not take advantage of his best case, so take only 2/3 of best
        bHisCTGT = Math.trunc((2 * bHisBestCTGT + bHisActualCTGT) / 3);
      }
    }

    // if my intended gridno is in water or gas, I can't attack at all from there
    // here, for smoke, consider bad
    if (InWaterGasOrSmoke(pMe, sMyGridNo)) {
      bMyCTGT = 0;
    } else {
      // put him at sHisGridNo if necessary!
      if (pHim.sGridNo != sHisGridNo) {
        pHim.sGridNo = sHisGridNo;
        ({ sX: sTempX, sY: sTempY } = ConvertGridNoToCenterCellXY(sHisGridNo));
        pHim.dXPos = sTempX;
        pHim.dYPos = sTempY;
      }
      // bMyCTGT = ChanceToGetThrough(pMe,sHisGridNo,FAKE,ACTUAL,TESTWALLS,9999,M9PISTOL,NOT_FOR_LOS); // assume a gunshot
      // bMyCTGT = SoldierToLocationChanceToGetThrough( pMe, sHisGridNo, pMe->bTargetLevel, pMe->bTargetCubeLevel );

      // let's not assume anything about the stance the enemy might take, so take an average
      // value... no cover give a higher value than partial cover
      bMyCTGT = CalcAverageCTGTForPosition(
        pMe,
        pHim.ubID,
        sHisGridNo,
        pHim.bLevel,
        iMyAPsLeft,
      );

      // since NPCs are too dumb to shoot "blind", ie. at opponents that they
      // themselves can't see (mercs can, using another as a spotter!), if the
      // cover is below the "see_thru" threshold, it's equivalent to perfect cover!
      if (bMyCTGT < SEE_THRU_COVER_THRESHOLD) {
        bMyCTGT = 0;
      }
    }

    // UNDO ANY TEMPORARY "DAMAGE" DONE ABOVE
    if (sMyRealGridNo != NOWHERE) {
      pMe.sGridNo = sMyRealGridNo; // put me back where I belong!
      pMe.dXPos = dMyX; // also change the 'x'
      pMe.dYPos = dMyY; // and the 'y'
    }

    if (sHisRealGridNo != NOWHERE) {
      pHim.sGridNo = sHisRealGridNo; // put HIM back where HE belongs!
      pHim.dXPos = dHisX; // also change the 'x'
      pHim.dYPos = dHisY; // and the 'y'
    }

    // these value should be < 1 million each
    iHisPosValue =
      bHisCTGT * Threat[uiThreatIndex].iValue * Threat[uiThreatIndex].iAPs;
    iMyPosValue = bMyCTGT * iMyThreat * iMyAPsLeft;

    // try to account for who outnumbers who: the side with the advantage thus
    // (hopefully) values offense more, while those in trouble will play defense
    if (pHim.bOppCnt > 1) {
      iHisPosValue = Math.trunc(iHisPosValue / pHim.bOppCnt);
    }

    if (pMe.bOppCnt > 1) {
      iMyPosValue = Math.trunc(iMyPosValue / pMe.bOppCnt);
    }

    // if my positional value is worth something at all here
    if (iMyPosValue > 0) {
      // if I CAN'T crouch when I get there, that makes it significantly less
      // appealing a spot (how much depends on range), so that's a penalty to me
      if (iMyAPsLeft < AP_CROUCH)
        // subtract another 1 % penalty for NOT being able to crouch per tile
        // the farther away we are, the bigger a difference crouching will make!
        iMyPosValue -= Math.trunc(
          (iMyPosValue *
            (AIM_PENALTY_TARGET_CROUCHED + Math.trunc(iRange / CELL_X_SIZE))) /
            100,
        );
    }

    // high morale prefers decreasing the range (positive factor), while very
    // low morale (HOPELESS) prefers increasing it

    //	if (bHisCTGT < 100 || (morale - 1 < 0))
    {
      iRangeFactorMultiplier = RangeChangeDesire(pMe);

      if (iRangeFactorMultiplier) {
        iRangeChange = Threat[uiThreatIndex].iOrigRange - iRange;

        if (iRangeChange) {
          // iRangeFactor = (iRangeChange * (morale - 1)) / 4;
          iRangeFactor = Math.trunc(
            (iRangeChange * iRangeFactorMultiplier) / 2,
          );

          // aggression booster for stupider enemies
          iMyPosValue += Math.trunc(
            (100 * iRangeFactor * (5 - SoldierDifficultyLevel(pMe))) / 5,
          );

          // if factor is positive increase positional value, else decrease it
          // change both values, since one or the other could be 0
          if (iRangeFactor > 0) {
            iMyPosValue = Math.trunc(
              (iMyPosValue * (100 + iRangeFactor)) / 100,
            );
            iHisPosValue = Math.trunc(
              (100 * iHisPosValue) / (100 + iRangeFactor),
            );
          } else if (iRangeFactor < 0) {
            iMyPosValue = Math.trunc(
              (100 * iMyPosValue) / (100 - iRangeFactor),
            );
            iHisPosValue = Math.trunc(
              (iHisPosValue * (100 - iRangeFactor)) / 100,
            );
          }
        }
      }
    }

    // the farther apart we are, the less important the cover differences are
    // the less certain his position, the less important cover differences are
    iReductionFactor = Math.trunc(
      ((MAX_THREAT_RANGE - iRange) * Threat[uiThreatIndex].iCertainty) /
        MAX_THREAT_RANGE,
    );

    // divide by a 100 to make the numbers more managable and avoid 32-bit limit
    iThisScale = Math.trunc(Math.max(iMyPosValue, iHisPosValue) / 100);
    iThisScale = Math.trunc((iThisScale * iReductionFactor) / 100);
    iTotalScale.value += iThisScale;
    // this helps to decide the percent improvement later

    // POSITIVE COVER VALUE INDICATES THE COVER BENEFITS ME, NEGATIVE RESULT
    // MEANS IT BENEFITS THE OTHER GUY.
    // divide by a 100 to make the numbers more managable and avoid 32-bit limit
    iCoverValue = Math.trunc((iMyPosValue - iHisPosValue) / 100);
    iCoverValue = Math.trunc((iCoverValue * iReductionFactor) / 100);

    return iCoverValue;
  }

  function NumberOfTeamMatesAdjacent(
    pSoldier: SOLDIERTYPE,
    sGridNo: INT16,
  ): UINT8 {
    let ubLoop: UINT8;
    let ubCount: UINT8;
    let ubWhoIsThere: UINT8;
    let sTempGridNo: INT16;

    ubCount = 0;

    for (ubLoop = 0; ubLoop < Enum245.NUM_WORLD_DIRECTIONS; ubLoop++) {
      sTempGridNo = NewGridNo(sGridNo, DirectionInc(ubLoop));

      ubWhoIsThere = WhoIsThere2(sGridNo, pSoldier.bLevel);
      if (
        ubWhoIsThere != NOBODY &&
        ubWhoIsThere != pSoldier.ubID &&
        MercPtrs[ubWhoIsThere].bTeam == pSoldier.bTeam
      ) {
        ubCount++;
      }
    }

    return ubCount;
  }

  export function FindBestNearbyCover(
    pSoldier: SOLDIERTYPE,
    morale: INT32,
    piPercentBetter: Pointer<INT32>,
  ): INT16 {
    // all 32-bit integers for max. speed
    let uiLoop: UINT32;
    let iCurrentCoverValue: INT32;
    let iCoverValue: INT32;
    let iBestCoverValue: INT32;
    let iCurrentScale: INT32;
    let iCurrentScale__Pointer = createPointer(
      () => iCurrentScale,
      (v) => (iCurrentScale = v),
    );
    let iCoverScale: INT32 = 0;
    let iCoverScale__Pointer = createPointer(
      () => iCoverScale,
      (v) => (iCoverScale = v),
    );
    let iBestCoverScale: INT32 = 0;
    let iDistFromOrigin: INT32;
    let iDistCoverFromOrigin: INT32;
    let iThreatCertainty: INT32;
    let sGridNo: INT16;
    let sBestCover: INT16 = NOWHERE;
    let iPathCost: INT32;
    let iThreatRange: INT32;
    let iClosestThreatRange: INT32 = 1500;
    //	INT16 sClosestThreatGridno = NOWHERE;
    let iMyThreatValue: INT32;
    let sThreatLoc: INT16;
    let iMaxThreatRange: INT32;
    let uiThreatCnt: UINT32 = 0;
    let iMaxMoveTilesLeft: INT32;
    let iSearchRange: INT32;
    let iRoamRange: INT32;
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;
    let sOrigin: INT16 = 0; // has to be a short, need a pointer
    let pusLastLoc: INT16;
    let pbPersOL: INT8;
    let pbPublOL: INT8;
    let pOpponent: SOLDIERTYPE;
    let usMovementMode: UINT16;
    let fHasGasMask: boolean /* INT8 */;

    let ubBackgroundLightLevel: UINT8;
    let ubBackgroundLightPercent: UINT8 = 0;
    let ubLightPercentDifference: UINT8;
    let fNight: boolean;

    switch (FindObj(pSoldier, Enum225.GASMASK)) {
      case Enum261.HEAD1POS:
      case Enum261.HEAD2POS:
        fHasGasMask = true;
        break;
      default:
        fHasGasMask = false;
        break;
    }

    if (gbWorldSectorZ > 0) {
      fNight = false;
    } else {
      ubBackgroundLightLevel = GetTimeOfDayAmbientLightLevel();

      if (ubBackgroundLightLevel < NORMAL_LIGHTLEVEL_DAY + 2) {
        fNight = false;
      } else {
        fNight = true;
        ubBackgroundLightPercent = gbLightSighting[0][ubBackgroundLightLevel];
      }
    }

    iBestCoverValue = -1;

    // NameMessage(pSoldier,"looking for some cover...");

    // BUILD A LIST OF THREATENING GRID #s FROM PERSONAL & PUBLIC opplists

    pusLastLoc = gsLastKnownOppLoc[pSoldier.ubID][0];

    // hang a pointer into personal opplist
    pbPersOL = pSoldier.bOppList[0];
    // hang a pointer into public opplist
    pbPublOL = gbPublicOpplist[pSoldier.bTeam][0];

    // decide how far we're gonna be looking
    iSearchRange =
      gbDiff[DIFF_MAX_COVER_RANGE][SoldierDifficultyLevel(pSoldier)];

    /*
          switch (pSoldier->bAttitude)
          {
                  case DEFENSIVE:		iSearchRange += 2; break;
                  case BRAVESOLO:		iSearchRange -= 4; break;
                  case BRAVEAID:		iSearchRange -= 4; break;
                  case CUNNINGSOLO:	iSearchRange += 4; break;
                  case CUNNINGAID:	iSearchRange += 4; break;
                  case AGGRESSIVE:	iSearchRange -= 2; break;
          }*/

    // maximum search range is 1 tile / 8 pts of wisdom
    if (iSearchRange > Math.trunc(pSoldier.bWisdom / 8)) {
      iSearchRange = Math.trunc(pSoldier.bWisdom / 8);
    }

    if (!gfTurnBasedAI) {
      // don't search so far in realtime
      iSearchRange = Math.trunc(iSearchRange / 2);
    }

    usMovementMode = DetermineMovementMode(
      pSoldier,
      Enum289.AI_ACTION_TAKE_COVER,
    );

    if (pSoldier.bAlertStatus >= Enum243.STATUS_RED) {
      // if already in battle
      // must be able to reach the cover, so it can't possibly be more than
      // action points left (rounded down) tiles away, since minimum
      // cost to move per tile is 1 points.
      iMaxMoveTilesLeft = Math.max(
        0,
        pSoldier.bActionPoints -
          MinAPsToStartMovement(pSoldier, usMovementMode),
      );
      // NumMessage("In BLACK, maximum tiles to move left = ",maxMoveTilesLeft);

      // if we can't go as far as the usual full search range
      if (iMaxMoveTilesLeft < iSearchRange) {
        // then limit the search range to only as far as we CAN go
        iSearchRange = iMaxMoveTilesLeft;
      }
    }

    if (iSearchRange <= 0) {
      return NOWHERE;
    }

    // those within 20 tiles of any tile we'll CONSIDER as cover are important
    iMaxThreatRange = MAX_THREAT_RANGE + CELL_X_SIZE * iSearchRange;

    // calculate OUR OWN general threat value (not from any specific location)
    iMyThreatValue = CalcManThreatValue(pSoldier, NOWHERE, false, pSoldier);

    // look through all opponents for those we know of
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
      pbPublOL = gbPublicOpplist[pSoldier.bTeam][pOpponent.ubID];
      pusLastLoc = gsLastKnownOppLoc[pSoldier.ubID][pOpponent.ubID];

      // if this opponent is unknown personally and publicly
      if (pbPersOL == NOT_HEARD_OR_SEEN && pbPublOL == NOT_HEARD_OR_SEEN) {
        continue; // next merc
      }

      // Special stuff for Carmen the bounty hunter
      if (
        pSoldier.bAttitude == Enum242.ATTACKSLAYONLY &&
        pOpponent.ubProfile != 64
      ) {
        continue; // next opponent
      }

      // if personal knowledge is more up to date or at least equal
      if (
        gubKnowledgeValue[pbPublOL - OLDEST_HEARD_VALUE][
          pbPersOL - OLDEST_HEARD_VALUE
        ] > 0 ||
        pbPersOL == pbPublOL
      ) {
        // using personal knowledge, obtain opponent's "best guess" gridno
        sThreatLoc = pusLastLoc;
        iThreatCertainty = ThreatPercent[pbPersOL - OLDEST_HEARD_VALUE];
      } else {
        // using public knowledge, obtain opponent's "best guess" gridno
        sThreatLoc = gsPublicLastKnownOppLoc[pSoldier.bTeam][pOpponent.ubID];
        iThreatCertainty = ThreatPercent[pbPublOL - OLDEST_HEARD_VALUE];
      }

      // calculate how far away this threat is (in adjusted pixels)
      // iThreatRange = AdjPixelsAway(CenterX(pSoldier->sGridNo),CenterY(pSoldier->sGridNo),CenterX(sThreatLoc),CenterY(sThreatLoc));
      iThreatRange = GetRangeInCellCoordsFromGridNoDiff(
        pSoldier.sGridNo,
        sThreatLoc,
      );

      // NumMessage("Threat Range = ",iThreatRange);

      // if this opponent is believed to be too far away to really be a threat
      if (iThreatRange > iMaxThreatRange) {
        continue; // check next opponent
      }

      // remember this opponent as a current threat, but DON'T REDUCE FOR COVER!
      Threat[uiThreatCnt].iValue = CalcManThreatValue(
        pOpponent,
        pSoldier.sGridNo,
        false,
        pSoldier,
      );

      // if the opponent is no threat at all for some reason
      if (Threat[uiThreatCnt].iValue == -999) {
        // NameMessage(pOpponent,"is thought to be no threat");
        continue; // check next opponent
      }

      // NameMessage(pOpponent,"added to the list of threats");
      // NumMessage("His/Her threat value = ",threatValue[uiThreatCnt]);

      Threat[uiThreatCnt].pOpponent = pOpponent;
      Threat[uiThreatCnt].sGridNo = sThreatLoc;
      Threat[uiThreatCnt].iCertainty = iThreatCertainty;
      Threat[uiThreatCnt].iOrigRange = iThreatRange;

      // calculate how many APs he will have at the start of the next turn
      Threat[uiThreatCnt].iAPs = CalcActionPoints(pOpponent);

      if (iThreatRange < iClosestThreatRange) {
        iClosestThreatRange = iThreatRange;
        // NumMessage("New Closest Threat Range = ",iClosestThreatRange);
        //			sClosestThreatGridNo = sThreatLoc;
        // NumMessage("Closest Threat Gridno = ",sClosestThreatGridNo);
      }

      uiThreatCnt++;
    }

    // if no known opponents were found to threaten us, can't worry about cover
    if (!uiThreatCnt) {
      // NameMessage(pSoldier,"has no threats - WON'T take cover");
      return sBestCover;
    }

    // calculate our current cover value in the place we are now, since the
    // cover we are searching for must be better than what we have now!
    iCurrentCoverValue = 0;
    iCurrentScale = 0;

    // for every opponent that threatens, consider this spot's cover vs. him
    for (uiLoop = 0; uiLoop < uiThreatCnt; uiLoop++) {
      // if this threat is CURRENTLY within 20 tiles
      if (Threat[uiLoop].iOrigRange <= MAX_THREAT_RANGE) {
        // add this opponent's cover value to our current total cover value
        iCurrentCoverValue += CalcCoverValue(
          pSoldier,
          pSoldier.sGridNo,
          iMyThreatValue,
          pSoldier.bActionPoints,
          uiLoop,
          Threat[uiLoop].iOrigRange,
          morale,
          iCurrentScale__Pointer,
        );
      }
      // sprintf(tempstr,"iCurrentCoverValue after opponent %d is now %d",iLoop,iCurrentCoverValue);
      // PopMessage(tempstr);
    }

    iCurrentCoverValue -=
      Math.trunc(iCurrentCoverValue / 10) *
      NumberOfTeamMatesAdjacent(pSoldier, pSoldier.sGridNo);

    // determine maximum horizontal limits
    sMaxLeft = Math.min(iSearchRange, pSoldier.sGridNo % MAXCOL);
    // NumMessage("sMaxLeft = ",sMaxLeft);
    sMaxRight = Math.min(
      iSearchRange,
      MAXCOL - ((pSoldier.sGridNo % MAXCOL) + 1),
    );
    // NumMessage("sMaxRight = ",sMaxRight);

    // determine maximum vertical limits
    sMaxUp = Math.min(iSearchRange, Math.trunc(pSoldier.sGridNo / MAXROW));
    // NumMessage("sMaxUp = ",sMaxUp);
    sMaxDown = Math.min(
      iSearchRange,
      MAXROW - (Math.trunc(pSoldier.sGridNo / MAXROW) + 1),
    );
    // NumMessage("sMaxDown = ",sMaxDown);

    iRoamRange = RoamingRange(
      pSoldier,
      createPointer(
        () => sOrigin,
        (v) => (sOrigin = v),
      ),
    );

    // if status isn't black (life & death combat), and roaming range is limited
    if (
      pSoldier.bAlertStatus != Enum243.STATUS_BLACK &&
      iRoamRange < MAX_ROAMING_RANGE &&
      sOrigin != NOWHERE
    ) {
      // must try to stay within or return to the point of origin
      iDistFromOrigin = SpacesAway(sOrigin, pSoldier.sGridNo);
    } else {
      // don't care how far from origin we go
      iDistFromOrigin = -1;
    }

    // the initial cover value to beat is our current cover value
    iBestCoverValue = iCurrentCoverValue;

    if (pSoldier.bAlertStatus >= Enum243.STATUS_RED) {
      // if already in battle
      // to speed this up, tell PathAI to cancel any paths beyond our AP reach!
      gubNPCAPBudget = pSoldier.bActionPoints;
    } else {
      // even if not under pressure, limit to 1 turn's travelling distance
      // hope this isn't too expensive...
      gubNPCAPBudget = CalcActionPoints(pSoldier);
      // gubNPCAPBudget = pSoldier->bInitialAPs;
    }

    // Call FindBestPath to set flags in all locations that we can
    // walk into within range.  We have to set some things up first...

    // set the distance limit of the square region
    gubNPCDistLimit = iSearchRange;
    gusNPCMovementMode = usMovementMode;

    // reset the "reachable" flags in the region we're looking at
    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
        if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
          continue;
        }
        gpWorldLevelData[sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;
      }
    }

    FindBestPath(
      pSoldier,
      NOWHERE,
      pSoldier.bLevel,
      DetermineMovementMode(pSoldier, Enum289.AI_ACTION_TAKE_COVER),
      COPYREACHABLE_AND_APS,
      0,
    );

    // Turn off the "reachable" flag for his current location
    // so we don't consider it
    gpWorldLevelData[pSoldier.sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;

    // SET UP DOUBLE-LOOP TO STEP THROUGH POTENTIAL GRID #s
    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        // HandleMyMouseCursor(KEYBOARDALSO);

        // calculate the next potential gridno
        sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
        if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
          continue;
        }

        // NumMessage("Testing gridno #",sGridNo);

        // if we are limited to staying/returning near our place of origin
        if (iDistFromOrigin != -1) {
          iDistCoverFromOrigin = SpacesAway(sOrigin, sGridNo);

          // if this is outside roaming range, and doesn't get us closer to it
          if (
            iDistCoverFromOrigin > iRoamRange &&
            iDistFromOrigin <= iDistCoverFromOrigin
          ) {
            continue; // then we can't go there
          }
        }

        /*
                              if (Net.pnum != Net.turnActive)
                              {
                                      KeepInterfaceGoing(1);
                              }
      */
        if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
          continue;
        }

        if (!fHasGasMask) {
          if (InGas(pSoldier, sGridNo)) {
            continue;
          }
        }

        // ignore blacklisted spot
        if (sGridNo == pSoldier.sBlackList) {
          continue;
        }

        iPathCost =
          gubAIPathCosts[AI_PATHCOST_RADIUS + sXOffset][
            AI_PATHCOST_RADIUS + sYOffset
          ];
        /*
      // water is OK, if the only good hiding place requires us to get wet, OK
      iPathCost = LegalNPCDestination(pSoldier,sGridNo,ENSURE_PATH_COST,WATEROK);

      if (!iPathCost)
      {
              continue;        // skip on to the next potential grid
      }

      // CJC: This should be a redundent check because the path code is given an
      // AP limit to begin with!
      if (pSoldier->bAlertStatus == STATUS_BLACK)      // in battle
      {
              // must be able to afford the APs to get to this cover this turn
              if (iPathCost > pSoldier->bActionPoints)
              {
                      //NumMessage("In BLACK, and can't afford to get there, cost = ",iPathCost);
                      continue;      // skip on to the next potential grid
              }
      }
      */

        // OK, this place shows potential.  How useful is it as cover?
        // EVALUATE EACH GRID #, remembering the BEST PROTECTED ONE
        iCoverValue = 0;
        iCoverScale = 0;

        // for every opponent that threatens, consider this spot's cover vs. him
        for (uiLoop = 0; uiLoop < uiThreatCnt; uiLoop++) {
          // calculate the range we would be at from this opponent
          iThreatRange = GetRangeInCellCoordsFromGridNoDiff(
            sGridNo,
            Threat[uiLoop].sGridNo,
          );
          // if this threat would be within 20 tiles, count it
          if (iThreatRange <= MAX_THREAT_RANGE) {
            iCoverValue += CalcCoverValue(
              pSoldier,
              sGridNo,
              iMyThreatValue,
              pSoldier.bActionPoints - iPathCost,
              uiLoop,
              iThreatRange,
              morale,
              iCoverScale__Pointer,
            );
          }

          // sprintf(tempstr,"iCoverValue after opponent %d is now %d",iLoop,iCoverValue);
          // PopMessage(tempstr);
        }

        // reduce cover for each person adjacent to this gridno who is on our team,
        // by 10% (so locations next to several people will be very much frowned upon
        if (iCoverValue >= 0) {
          iCoverValue -=
            Math.trunc(iCoverValue / 10) *
            NumberOfTeamMatesAdjacent(pSoldier, sGridNo);
        } else {
          // when negative, must add a negative to decrease the total
          iCoverValue +=
            Math.trunc(iCoverValue / 10) *
            NumberOfTeamMatesAdjacent(pSoldier, sGridNo);
        }

        if (fNight && InARoom(sGridNo) === -1) {
          // ignore in buildings in case placed there
          // reduce cover at nighttime based on how bright the light is at that location
          // using the difference in sighting distance between the background and the
          // light for this tile
          ubLightPercentDifference =
            gbLightSighting[0][LightTrueLevel(sGridNo, pSoldier.bLevel)] -
            ubBackgroundLightPercent;
          if (iCoverValue >= 0) {
            iCoverValue -=
              Math.trunc(iCoverValue / 100) * ubLightPercentDifference;
          } else {
            iCoverValue +=
              Math.trunc(iCoverValue / 100) * ubLightPercentDifference;
          }
        }

        // if this is better than the best place found so far

        if (iCoverValue > iBestCoverValue) {
          // ONLY DO THIS CHECK HERE IF WE'RE WAITING FOR OPPCHANCETODECIDE,
          // OTHERWISE IT WOULD USUALLY BE A WASTE OF TIME
          // ok to comment out for now?
          /*
        if (Status.team[Net.turnActive].allowOppChanceToDecide)
        {
                // if this cover value qualifies as "better" enough to get used
                if (CalcPercentBetter( iCurrentCoverValue,iCoverValue,iCurrentScale,iCoverScale) >= MIN_PERCENT_BETTER)
                {
                        // then we WILL do something (take this cover, at least)
                        NPCDoesAct(pSoldier);
                }
        }
        */

          // remember it instead
          sBestCover = sGridNo;
          iBestCoverValue = iCoverValue;
          iBestCoverScale = iCoverScale;
        }
      }
    }

    gubNPCAPBudget = 0;
    gubNPCDistLimit = 0;

    // if a better cover location was found
    if (sBestCover != NOWHERE) {
      // cover values already take the AP cost of getting there into account in
      // a BIG way, so no need to worry about that here, even small improvements
      // are actually very significant once we get our APs back (if we live!)
      piPercentBetter.value = CalcPercentBetter(
        iCurrentCoverValue,
        iBestCoverValue,
        iCurrentScale,
        iBestCoverScale,
      );

      // if best cover value found was at least 5% better than our current cover
      if (piPercentBetter.value >= MIN_PERCENT_BETTER) {
        return sBestCover; // return the gridno of that cover
      }
    }
    return NOWHERE; // return that no suitable cover was found
  }

  export function FindSpotMaxDistFromOpponents(pSoldier: SOLDIERTYPE): INT16 {
    let sGridNo: INT16;
    let sBestSpot: INT16 = NOWHERE;
    let uiLoop: UINT32;
    let iThreatRange: INT32;
    let iClosestThreatRange: INT32 = 1500;
    let iSpotClosestThreatRange: INT32;
    let sThreatLoc: INT16;
    let sThreatGridNo: INT16[] /* [MAXMERCS] */ = createArray(MAXMERCS, 0);
    let uiThreatCnt: UINT32 = 0;
    let iSearchRange: INT32;
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;
    let pbPersOL: INT8;
    let pbPublOL: INT8;
    let bEscapeDirection: INT8 = 0;
    let bEscapeDirection__Pointer = createPointer(
      () => bEscapeDirection,
      (v) => (bEscapeDirection = v),
    );
    let bBestEscapeDirection: INT8 = -1;
    let pOpponent: SOLDIERTYPE;
    let sOrigin: INT16 = 0;
    let sOrigin__Pointer = createPointer(
      () => sOrigin,
      (v) => (sOrigin = v),
    );
    let iRoamRange: INT32;

    let fHasGasMask: boolean /* INT8 */;

    switch (FindObj(pSoldier, Enum225.GASMASK)) {
      case Enum261.HEAD1POS:
      case Enum261.HEAD2POS:
        fHasGasMask = true;
        break;
      default:
        fHasGasMask = false;
        break;
    }

    // BUILD A LIST OF THREATENING GRID #s FROM PERSONAL & PUBLIC opplistS

    // look through all opponents for those we know of
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
      pbPublOL = gbPublicOpplist[pSoldier.bTeam][pOpponent.ubID];

      // if this opponent is unknown personally and publicly
      if (pbPersOL == NOT_HEARD_OR_SEEN && pbPublOL == NOT_HEARD_OR_SEEN) {
        continue; // check next opponent
      }

      // Special stuff for Carmen the bounty hunter
      if (
        pSoldier.bAttitude == Enum242.ATTACKSLAYONLY &&
        pOpponent.ubProfile != 64
      ) {
        continue; // next opponent
      }

      // if the opponent is no threat at all for some reason
      if (
        CalcManThreatValue(pOpponent, pSoldier.sGridNo, false, pSoldier) == -999
      ) {
        continue; // check next opponent
      }

      // if personal knowledge is more up to date or at least equal
      if (
        gubKnowledgeValue[pbPublOL - OLDEST_HEARD_VALUE][
          pbPersOL - OLDEST_HEARD_VALUE
        ] > 0 ||
        pbPersOL == pbPublOL
      ) {
        // using personal knowledge, obtain opponent's "best guess" gridno
        sThreatLoc = gsLastKnownOppLoc[pSoldier.ubID][pOpponent.ubID];
      } else {
        // using public knowledge, obtain opponent's "best guess" gridno
        sThreatLoc = gsPublicLastKnownOppLoc[pSoldier.bTeam][pOpponent.ubID];
      }

      // calculate how far away this threat is (in adjusted pixels)
      iThreatRange = GetRangeInCellCoordsFromGridNoDiff(
        pSoldier.sGridNo,
        sThreatLoc,
      );

      if (iThreatRange < iClosestThreatRange) {
        iClosestThreatRange = iThreatRange;
        // NumMessage("New Closest Threat Range = ",iClosestThreatRange);
      }

      // remember this threat's gridno
      sThreatGridNo[uiThreatCnt] = sThreatLoc;
      uiThreatCnt++;
    }

    // if no known opponents were found to threaten us, can't worry about them
    if (!uiThreatCnt) {
      // NameMessage(pSoldier,"has no known threats - WON'T run away");
      return sBestSpot;
    }

    // get roaming range here; for civilians, running away is limited by roam range
    if (pSoldier.bTeam == CIV_TEAM) {
      iRoamRange = RoamingRange(pSoldier, sOrigin__Pointer);
      if (iRoamRange == 0) {
        return sBestSpot;
      }
    } else {
      // dummy values
      iRoamRange = 100;
      sOrigin = pSoldier.sGridNo;
    }

    // DETERMINE CO-ORDINATE LIMITS OF SQUARE AREA TO BE CHECKED
    // THIS IS A LOT QUICKER THAN COVER, SO DO A LARGER AREA, NOT AFFECTED BY
    // DIFFICULTY SETTINGS...

    if (pSoldier.bAlertStatus == Enum243.STATUS_BLACK) {
      // if already in battle
      iSearchRange = Math.trunc(pSoldier.bActionPoints / 2);

      // to speed this up, tell PathAI to cancel any paths beyond our AP reach!
      gubNPCAPBudget = pSoldier.bActionPoints;
    } else {
      // even if not under pressure, limit to 1 turn's travelling distance
      gubNPCAPBudget = Math.min(
        Math.trunc(pSoldier.bActionPoints / 2),
        CalcActionPoints(pSoldier),
      );

      iSearchRange = Math.trunc(gubNPCAPBudget / 2);
    }

    if (!gfTurnBasedAI) {
      // search only half as far in realtime
      // but always allow a certain minimum!

      if (iSearchRange > 4) {
        iSearchRange = Math.trunc(iSearchRange / 2);
        gubNPCAPBudget = Math.trunc(gubNPCAPBudget / 2);
      }
    }

    // assume we have to stand up!
    // use the min macro here to make sure we don't wrap the UINT8 to 255...

    gubNPCAPBudget = gubNPCAPBudget = Math.min(
      gubNPCAPBudget,
      gubNPCAPBudget - GetAPsToChangeStance(pSoldier, ANIM_STAND),
    );
    // NumMessage("Search Range = ",iSearchRange);
    // NumMessage("gubNPCAPBudget = ",gubNPCAPBudget);

    // determine maximum horizontal limits
    sMaxLeft = Math.min(iSearchRange, pSoldier.sGridNo % MAXCOL);
    // NumMessage("sMaxLeft = ",sMaxLeft);
    sMaxRight = Math.min(
      iSearchRange,
      MAXCOL - ((pSoldier.sGridNo % MAXCOL) + 1),
    );
    // NumMessage("sMaxRight = ",sMaxRight);

    // determine maximum vertical limits
    sMaxUp = Math.min(iSearchRange, Math.trunc(pSoldier.sGridNo / MAXROW));
    // NumMessage("sMaxUp = ",sMaxUp);
    sMaxDown = Math.min(
      iSearchRange,
      MAXROW - (Math.trunc(pSoldier.sGridNo / MAXROW) + 1),
    );
    // NumMessage("sMaxDown = ",sMaxDown);

    // Call FindBestPath to set flags in all locations that we can
    // walk into within range.  We have to set some things up first...

    // set the distance limit of the square region
    gubNPCDistLimit = iSearchRange;

    // reset the "reachable" flags in the region we're looking at
    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
        if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
          continue;
        }

        gpWorldLevelData[sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;
      }
    }

    FindBestPath(
      pSoldier,
      NOWHERE,
      pSoldier.bLevel,
      DetermineMovementMode(pSoldier, Enum289.AI_ACTION_RUN_AWAY),
      COPYREACHABLE,
      0,
    );

    // Turn off the "reachable" flag for his current location
    // so we don't consider it
    gpWorldLevelData[pSoldier.sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;

    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        // calculate the next potential gridno
        sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
        // NumMessage("Testing gridno #",gridno);
        if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
          continue;
        }

        if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
          continue;
        }

        if (sGridNo == pSoldier.sBlackList) {
          continue;
        }

        if (!fHasGasMask) {
          if (InGas(pSoldier, sGridNo)) {
            continue;
          }
        }

        if (pSoldier.bTeam == CIV_TEAM) {
          iRoamRange = RoamingRange(pSoldier, sOrigin__Pointer);
          if (PythSpacesAway(sOrigin, sGridNo) > iRoamRange) {
            continue;
          }
        }

        // exclude locations with tear/mustard gas (at this point, smoke is cool!)
        if (InGas(pSoldier, sGridNo)) {
          continue;
        }

        // OK, this place shows potential.  How useful is it as cover?
        // NumMessage("Promising seems gridno #",gridno);

        iSpotClosestThreatRange = 1500;

        if (
          pSoldier.bTeam == ENEMY_TEAM &&
          GridNoOnEdgeOfMap(sGridNo, bEscapeDirection__Pointer)
        ) {
          // We can escape!  This is better than anything else except a closer spot which we can
          // cross over from.

          // Subtract the straight-line distance from our location to this one as an estimate of
          // path cost and for looks...

          // The edge spot closest to us which is on the edge will have the highest value, so
          // it will be picked over locations further away.
          // Only reachable gridnos will be picked so this should hopefully look okay
          iSpotClosestThreatRange -= PythSpacesAway(pSoldier.sGridNo, sGridNo);
        } else {
          bEscapeDirection = -1;
          // for every opponent that threatens, consider this spot's cover vs. him
          for (uiLoop = 0; uiLoop < uiThreatCnt; uiLoop++) {
            // iThreatRange = AdjPixelsAway(CenterX(sGridNo),CenterY(sGridNo), CenterX(sThreatGridNo[iLoop]),CenterY(sThreatGridNo[iLoop]));
            iThreatRange = GetRangeInCellCoordsFromGridNoDiff(
              sGridNo,
              sThreatGridNo[uiLoop],
            );
            if (iThreatRange < iSpotClosestThreatRange) {
              iSpotClosestThreatRange = iThreatRange;
            }
          }
        }

        // if this is better than the best place found so far
        // (i.e. the closest guy would be farther away than previously)
        if (iSpotClosestThreatRange > iClosestThreatRange) {
          // remember it instead
          iClosestThreatRange = iSpotClosestThreatRange;
          // NumMessage("New best range = ",iClosestThreatRange);
          sBestSpot = sGridNo;
          bBestEscapeDirection = bEscapeDirection;
          // NumMessage("New best grid = ",bestSpot);
        }
      }
    }

    gubNPCAPBudget = 0;
    gubNPCDistLimit = 0;

    if (bBestEscapeDirection != -1) {
      // Woohoo!  We can escape!  Fake some stuff with the quote-related actions
      pSoldier.ubQuoteActionID =
        GetTraversalQuoteActionID(bBestEscapeDirection);
    }

    return sBestSpot;
  }

  export function FindNearestUngassedLand(pSoldier: SOLDIERTYPE): INT16 {
    let sGridNo: INT16;
    let sClosestLand: INT16 = NOWHERE;
    let sPathCost: INT16;
    let sShortestPath: INT16 = 1000;
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;
    let iSearchRange: INT32;

    // NameMessage(pSoldier,"looking for nearest reachable land");

    // start with a small search area, and expand it if we're unsuccessful
    // this should almost never need to search farther than 5 or 10 squares...
    for (iSearchRange = 5; iSearchRange <= 25; iSearchRange += 5) {
      // NumMessage("Trying iSearchRange = ", iSearchRange);

      // determine maximum horizontal limits
      sMaxLeft = Math.min(iSearchRange, pSoldier.sGridNo % MAXCOL);
      // NumMessage("sMaxLeft = ",sMaxLeft);
      sMaxRight = Math.min(
        iSearchRange,
        MAXCOL - ((pSoldier.sGridNo % MAXCOL) + 1),
      );
      // NumMessage("sMaxRight = ",sMaxRight);

      // determine maximum vertical limits
      sMaxUp = Math.min(iSearchRange, Math.trunc(pSoldier.sGridNo / MAXROW));
      // NumMessage("sMaxUp = ",sMaxUp);
      sMaxDown = Math.min(
        iSearchRange,
        MAXROW - (Math.trunc(pSoldier.sGridNo / MAXROW) + 1),
      );
      // NumMessage("sMaxDown = ",sMaxDown);

      // Call FindBestPath to set flags in all locations that we can
      // walk into within range.  We have to set some things up first...

      // set the distance limit of the square region
      gubNPCDistLimit = iSearchRange;

      // reset the "reachable" flags in the region we're looking at
      for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
        for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
          sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
          if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
            continue;
          }

          gpWorldLevelData[sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;
        }
      }

      FindBestPath(
        pSoldier,
        NOWHERE,
        pSoldier.bLevel,
        DetermineMovementMode(pSoldier, Enum289.AI_ACTION_LEAVE_WATER_GAS),
        COPYREACHABLE,
        0,
      );

      // Turn off the "reachable" flag for his current location
      // so we don't consider it
      gpWorldLevelData[pSoldier.sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;

      // SET UP DOUBLE-LOOP TO STEP THROUGH POTENTIAL GRID #s
      for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
        for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
          // calculate the next potential gridno
          sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
          // NumMessage("Testing gridno #",gridno);
          if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
            continue;
          }

          if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
            continue;
          }

          // ignore blacklisted spot
          if (sGridNo == pSoldier.sBlackList) {
            continue;
          }

          // CJC: here, unfortunately, we must calculate a path so we have an AP cost

          // obviously, we're looking for LAND, so water is out!
          sPathCost = LegalNPCDestination(
            pSoldier,
            sGridNo,
            ENSURE_PATH_COST,
            NOWATER,
            0,
          );

          if (!sPathCost) {
            continue; // skip on to the next potential grid
          }

          // if this path is shorter than the one to the closest land found so far
          if (sPathCost < sShortestPath) {
            // remember it instead
            sShortestPath = sPathCost;
            // NumMessage("New shortest route = ",shortestPath);

            sClosestLand = sGridNo;
            // NumMessage("New closest land at grid = ",closestLand);
          }
        }
      }

      // if we found a piece of land in this search area
      if (sClosestLand != NOWHERE)
        // quit now, no need to look any farther
        break;
    }

    // NumMessage("closestLand = ",closestLand);
    return sClosestLand;
  }

  export function FindNearbyDarkerSpot(pSoldier: SOLDIERTYPE): INT16 {
    let sGridNo: INT16;
    let sClosestSpot: INT16 = NOWHERE;
    let sPathCost: INT16;
    let iSpotValue: INT32;
    let iBestSpotValue: INT32 = 1000;
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;
    let iSearchRange: INT32;
    let bLightLevel: INT8;
    let bCurrLightLevel: INT8;
    let bLightDiff: INT8;
    let iRoamRange: INT32;
    let sOrigin: INT16 = 0;

    bCurrLightLevel = LightTrueLevel(pSoldier.sGridNo, pSoldier.bLevel);

    iRoamRange = RoamingRange(
      pSoldier,
      createPointer(
        () => sOrigin,
        (v) => (sOrigin = v),
      ),
    );

    // start with a small search area, and expand it if we're unsuccessful
    // this should almost never need to search farther than 5 or 10 squares...
    for (iSearchRange = 5; iSearchRange <= 15; iSearchRange += 5) {
      // determine maximum horizontal limits
      sMaxLeft = Math.min(iSearchRange, pSoldier.sGridNo % MAXCOL);
      // NumMessage("sMaxLeft = ",sMaxLeft);
      sMaxRight = Math.min(
        iSearchRange,
        MAXCOL - ((pSoldier.sGridNo % MAXCOL) + 1),
      );
      // NumMessage("sMaxRight = ",sMaxRight);

      // determine maximum vertical limits
      sMaxUp = Math.min(iSearchRange, Math.trunc(pSoldier.sGridNo / MAXROW));
      // NumMessage("sMaxUp = ",sMaxUp);
      sMaxDown = Math.min(
        iSearchRange,
        MAXROW - (Math.trunc(pSoldier.sGridNo / MAXROW) + 1),
      );
      // NumMessage("sMaxDown = ",sMaxDown);

      // Call FindBestPath to set flags in all locations that we can
      // walk into within range.  We have to set some things up first...

      // set the distance limit of the square region
      gubNPCDistLimit = iSearchRange;

      // reset the "reachable" flags in the region we're looking at
      for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
        for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
          sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
          if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
            continue;
          }

          gpWorldLevelData[sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;
        }
      }

      FindBestPath(
        pSoldier,
        NOWHERE,
        pSoldier.bLevel,
        DetermineMovementMode(pSoldier, Enum289.AI_ACTION_LEAVE_WATER_GAS),
        COPYREACHABLE,
        0,
      );

      // Turn off the "reachable" flag for his current location
      // so we don't consider it
      gpWorldLevelData[pSoldier.sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;

      // SET UP DOUBLE-LOOP TO STEP THROUGH POTENTIAL GRID #s
      for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
        for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
          // calculate the next potential gridno
          sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
          // NumMessage("Testing gridno #",gridno);
          if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
            continue;
          }

          if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
            continue;
          }

          // ignore blacklisted spot
          if (sGridNo == pSoldier.sBlackList) {
            continue;
          }

          // require this character to stay within their roam range
          if (PythSpacesAway(sOrigin, sGridNo) > iRoamRange) {
            continue;
          }

          // screen out anything brighter than our current best spot
          bLightLevel = LightTrueLevel(sGridNo, pSoldier.bLevel);

          bLightDiff =
            gbLightSighting[0][bCurrLightLevel] -
            gbLightSighting[0][bLightLevel];

          // if the spot is darker than our current location, then bLightDiff > 0
          // plus ignore differences of just 1 light level
          if (bLightDiff <= 1) {
            continue;
          }

          // CJC: here, unfortunately, we must calculate a path so we have an AP cost

          sPathCost = LegalNPCDestination(
            pSoldier,
            sGridNo,
            ENSURE_PATH_COST,
            NOWATER,
            0,
          );

          if (!sPathCost) {
            continue; // skip on to the next potential grid
          }

          // decrease the "cost" of the spot by the amount of light/darkness
          iSpotValue = sPathCost * 2 - bLightDiff;

          if (iSpotValue < iBestSpotValue) {
            // remember it instead
            iBestSpotValue = iSpotValue;
            // NumMessage("New shortest route = ",shortestPath);

            sClosestSpot = sGridNo;
            // NumMessage("New closest land at grid = ",closestLand);
          }
        }
      }

      // if we found a piece of land in this search area
      if (sClosestSpot != NOWHERE) {
        // quit now, no need to look any farther
        break;
      }
    }

    return sClosestSpot;
  }

  const MINIMUM_REQUIRED_STATUS = 70;

  export function SearchForItems(
    pSoldier: SOLDIERTYPE,
    bReason: INT8,
    usItem: UINT16,
  ): INT8 {
    let iSearchRange: INT32;
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;
    let sGridNo: INT16;
    let sBestSpot: INT16 = NOWHERE;
    let iTempValue: INT32;
    let iValue: INT32;
    let iBestValue: INT32 = 0;
    let pItemPool: ITEM_POOL | null;
    let pObj: OBJECTTYPE;
    let pItem: INVTYPE;
    let iItemIndex: INT32;
    let iBestItemIndex: INT32;

    iTempValue = -1;
    iItemIndex = iBestItemIndex = -1;

    if (pSoldier.bActionPoints < AP_PICKUP_ITEM) {
      return Enum289.AI_ACTION_NONE;
    }

    if (!IS_MERC_BODY_TYPE(pSoldier)) {
      return Enum289.AI_ACTION_NONE;
    }

    iSearchRange =
      gbDiff[DIFF_MAX_COVER_RANGE][SoldierDifficultyLevel(pSoldier)];

    switch (pSoldier.bAttitude) {
      case Enum242.DEFENSIVE:
        iSearchRange--;
        break;
      case Enum242.BRAVESOLO:
        iSearchRange += 2;
        break;
      case Enum242.BRAVEAID:
        iSearchRange += 2;
        break;
      case Enum242.CUNNINGSOLO:
        iSearchRange -= 2;
        break;
      case Enum242.CUNNINGAID:
        iSearchRange -= 2;
        break;
      case Enum242.AGGRESSIVE:
        iSearchRange++;
        break;
    }

    // maximum search range is 1 tile / 10 pts of wisdom
    if (iSearchRange > Math.trunc(pSoldier.bWisdom / 10)) {
      iSearchRange = Math.trunc(pSoldier.bWisdom / 10);
    }

    if (!gfTurnBasedAI) {
      // don't search so far in realtime
      iSearchRange = Math.trunc(iSearchRange / 2);
    }

    // don't search so far for items
    iSearchRange = Math.trunc(iSearchRange / 2);

    // determine maximum horizontal limits
    sMaxLeft = Math.min(iSearchRange, pSoldier.sGridNo % MAXCOL);
    // NumMessage("sMaxLeft = ",sMaxLeft);
    sMaxRight = Math.min(
      iSearchRange,
      MAXCOL - ((pSoldier.sGridNo % MAXCOL) + 1),
    );
    // NumMessage("sMaxRight = ",sMaxRight);

    // determine maximum vertical limits
    sMaxUp = Math.min(iSearchRange, Math.trunc(pSoldier.sGridNo / MAXROW));
    // NumMessage("sMaxUp = ",sMaxUp);
    sMaxDown = Math.min(
      iSearchRange,
      MAXROW - (Math.trunc(pSoldier.sGridNo / MAXROW) + 1),
    );
    // NumMessage("sMaxDown = ",sMaxDown);

    // Call FindBestPath to set flags in all locations that we can
    // walk into within range.  We have to set some things up first...

    // set the distance limit of the square region
    gubNPCDistLimit = iSearchRange;

    // set an AP limit too, to our APs less the cost of picking up an item
    // and less the cost of dropping an item since we might need to do that
    gubNPCAPBudget = pSoldier.bActionPoints - AP_PICKUP_ITEM;

    // reset the "reachable" flags in the region we're looking at
    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
        if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
          continue;
        }

        gpWorldLevelData[sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;
      }
    }

    FindBestPath(
      pSoldier,
      NOWHERE,
      pSoldier.bLevel,
      DetermineMovementMode(pSoldier, Enum289.AI_ACTION_PICKUP_ITEM),
      COPYREACHABLE,
      0,
    );

    // SET UP DOUBLE-LOOP TO STEP THROUGH POTENTIAL GRID #s
    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        // calculate the next potential gridno
        sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
        if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
          continue;
        }

        // exclude locations with tear/mustard gas (at this point, smoke is cool!)
        if (InGasOrSmoke(pSoldier, sGridNo)) {
          continue;
        }

        if (
          gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_ITEMPOOL_PRESENT &&
          gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE
        ) {
          // ignore blacklisted spot
          if (sGridNo == pSoldier.sBlackList) {
            continue;
          }

          iValue = 0;
          pItemPool = GetItemPool(sGridNo, pSoldier.bLevel);
          switch (bReason) {
            case Enum293.SEARCH_AMMO:
              // we are looking for ammo to match the gun in usItem
              while (pItemPool) {
                pObj = gWorldItems[pItemPool.iItemIndex].o;
                pItem = Item[pObj.usItem];
                if (
                  pItem.usItemClass == IC_GUN &&
                  pObj.bStatus[0] >= MINIMUM_REQUIRED_STATUS
                ) {
                  // maybe this gun has ammo (adjust for whether it is better than ours!)
                  if (
                    pObj.bGunAmmoStatus < 0 ||
                    pObj.ubGunShotsLeft == 0 ||
                    (pObj.usItem == Enum225.ROCKET_RIFLE &&
                      pObj.ubImprintID != NOBODY &&
                      pObj.ubImprintID != pSoldier.ubID)
                  ) {
                    iTempValue = 0;
                  } else {
                    iTempValue = Math.trunc(
                      (pObj.ubGunShotsLeft * Weapon[pObj.usItem].ubDeadliness) /
                        Weapon[usItem].ubDeadliness,
                    );
                  }
                } else if (ValidAmmoType(usItem, pObj.usItem)) {
                  iTempValue = TotalPoints(pObj);
                } else {
                  iTempValue = 0;
                }
                if (iTempValue > iValue) {
                  iValue = iTempValue;
                  iItemIndex = pItemPool.iItemIndex;
                }
                pItemPool = pItemPool.pNext;
              }
              break;
            case Enum293.SEARCH_WEAPONS:
              while (pItemPool) {
                pObj = gWorldItems[pItemPool.iItemIndex].o;
                pItem = Item[pObj.usItem];
                if (
                  pItem.usItemClass & IC_WEAPON &&
                  pObj.bStatus[0] >= MINIMUM_REQUIRED_STATUS
                ) {
                  if (
                    pItem.usItemClass & IC_GUN &&
                    (pObj.bGunAmmoStatus < 0 ||
                      pObj.ubGunShotsLeft == 0 ||
                      ((pObj.usItem == Enum225.ROCKET_RIFLE ||
                        pObj.usItem == Enum225.AUTO_ROCKET_RIFLE) &&
                        pObj.ubImprintID != NOBODY &&
                        pObj.ubImprintID != pSoldier.ubID))
                  ) {
                    // jammed or out of ammo, skip it!
                    iTempValue = 0;
                  } else if (
                    Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass &
                    IC_WEAPON
                  ) {
                    if (
                      Weapon[pObj.usItem].ubDeadliness >
                      Weapon[pSoldier.inv[Enum261.HANDPOS].usItem].ubDeadliness
                    ) {
                      iTempValue = Math.trunc(
                        (100 * Weapon[pObj.usItem].ubDeadliness) /
                          Weapon[pSoldier.inv[Enum261.HANDPOS].usItem]
                            .ubDeadliness,
                      );
                    } else {
                      iTempValue = 0;
                    }
                  } else {
                    iTempValue = 200 + Weapon[pObj.usItem].ubDeadliness;
                  }
                } else {
                  iTempValue = 0;
                }
                if (iTempValue > iValue) {
                  iValue = iTempValue;
                  iItemIndex = pItemPool.iItemIndex;
                }
                pItemPool = pItemPool.pNext;
              }
              break;
            default:
              while (pItemPool) {
                pObj = gWorldItems[pItemPool.iItemIndex].o;
                pItem = Item[pObj.usItem];
                if (
                  pItem.usItemClass & IC_WEAPON &&
                  pObj.bStatus[0] >= MINIMUM_REQUIRED_STATUS
                ) {
                  if (
                    pItem.usItemClass & IC_GUN &&
                    (pObj.bGunAmmoStatus < 0 ||
                      pObj.ubGunShotsLeft == 0 ||
                      ((pObj.usItem == Enum225.ROCKET_RIFLE ||
                        pObj.usItem == Enum225.AUTO_ROCKET_RIFLE) &&
                        pObj.ubImprintID != NOBODY &&
                        pObj.ubImprintID != pSoldier.ubID))
                  ) {
                    // jammed or out of ammo, skip it!
                    iTempValue = 0;
                  } else if (
                    Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass &
                    IC_WEAPON
                  ) {
                    if (
                      Weapon[pObj.usItem].ubDeadliness >
                      Weapon[pSoldier.inv[Enum261.HANDPOS].usItem].ubDeadliness
                    ) {
                      iTempValue = Math.trunc(
                        (100 * Weapon[pObj.usItem].ubDeadliness) /
                          Weapon[pSoldier.inv[Enum261.HANDPOS].usItem]
                            .ubDeadliness,
                      );
                    } else {
                      iTempValue = 0;
                    }
                  } else {
                    iTempValue = 200 + Weapon[pObj.usItem].ubDeadliness;
                  }
                } else if (
                  pItem.usItemClass == IC_ARMOUR &&
                  pObj.bStatus[0] >= MINIMUM_REQUIRED_STATUS
                ) {
                  switch (Armour[pItem.ubClassIndex].ubArmourClass) {
                    case Enum284.ARMOURCLASS_HELMET:
                      if (pSoldier.inv[Enum261.HELMETPOS].usItem == NOTHING) {
                        iTempValue = 200 + EffectiveArmour(pObj);
                      } else if (
                        EffectiveArmour(pSoldier.inv[Enum261.HELMETPOS]) >
                        EffectiveArmour(pObj)
                      ) {
                        iTempValue = Math.trunc(
                          (100 * EffectiveArmour(pObj)) /
                            EffectiveArmour(pSoldier.inv[Enum261.HELMETPOS]),
                        );
                      } else {
                        iTempValue = 0;
                      }
                      break;
                    case Enum284.ARMOURCLASS_VEST:
                      if (pSoldier.inv[Enum261.VESTPOS].usItem == NOTHING) {
                        iTempValue = 200 + EffectiveArmour(pObj);
                      } else if (
                        EffectiveArmour(pSoldier.inv[Enum261.HELMETPOS]) >
                        EffectiveArmour(pObj)
                      ) {
                        iTempValue = Math.trunc(
                          (100 * EffectiveArmour(pObj)) /
                            EffectiveArmour(pSoldier.inv[Enum261.VESTPOS]),
                        );
                      } else {
                        iTempValue = 0;
                      }
                      break;
                    case Enum284.ARMOURCLASS_LEGGINGS:
                      if (pSoldier.inv[Enum261.LEGPOS].usItem == NOTHING) {
                        iTempValue = 200 + EffectiveArmour(pObj);
                      } else if (
                        EffectiveArmour(pSoldier.inv[Enum261.HELMETPOS]) >
                        EffectiveArmour(pObj)
                      ) {
                        iTempValue = Math.trunc(
                          (100 * EffectiveArmour(pObj)) /
                            EffectiveArmour(pSoldier.inv[Enum261.LEGPOS]),
                        );
                      } else {
                        iTempValue = 0;
                      }
                      break;
                    default:
                      break;
                  }
                } else {
                  iTempValue = 0;
                }

                if (iTempValue > iValue) {
                  iValue = iTempValue;
                  iItemIndex = pItemPool.iItemIndex;
                }
                pItemPool = pItemPool.pNext;
              }
              break;
          }
          iValue = Math.trunc(
            (3 * iValue) / (3 + PythSpacesAway(sGridNo, pSoldier.sGridNo)),
          );
          if (iValue > iBestValue) {
            sBestSpot = sGridNo;
            iBestValue = iValue;
            iBestItemIndex = iItemIndex;
          }
        }
      }
    }

    if (sBestSpot != NOWHERE) {
      DebugAI(
        FormatString(
          "%d decides to pick up %s",
          pSoldier.ubID,
          ItemNames[gWorldItems[iBestItemIndex].o.usItem],
        ),
      );
      if (Item[gWorldItems[iBestItemIndex].o.usItem].usItemClass == IC_GUN) {
        if (FindBetterSpotForItem(pSoldier, Enum261.HANDPOS) == false) {
          if (pSoldier.bActionPoints < AP_PICKUP_ITEM + AP_PICKUP_ITEM) {
            return Enum289.AI_ACTION_NONE;
          }
          if (pSoldier.inv[Enum261.HANDPOS].fFlags & OBJECT_UNDROPPABLE) {
            // destroy this item!
            DebugAI(
              FormatString(
                "%d decides he must drop %s first so destroys it",
                pSoldier.ubID,
                ItemNames[pSoldier.inv[Enum261.HANDPOS].usItem],
              ),
            );
            DeleteObj(pSoldier.inv[Enum261.HANDPOS]);
            DeductPoints(pSoldier, AP_PICKUP_ITEM, 0);
          } else {
            // we want to drop this item!
            DebugAI(
              FormatString(
                "%d decides he must drop %s first",
                pSoldier.ubID,
                ItemNames[pSoldier.inv[Enum261.HANDPOS].usItem],
              ),
            );

            pSoldier.bNextAction = Enum289.AI_ACTION_PICKUP_ITEM;
            pSoldier.usNextActionData = sBestSpot;
            pSoldier.iNextActionSpecialData = iBestItemIndex;
            return Enum289.AI_ACTION_DROP_ITEM;
          }
        }
      }
      pSoldier.uiPendingActionData1 = iBestItemIndex;
      pSoldier.usActionData = sBestSpot;
      return Enum289.AI_ACTION_PICKUP_ITEM;
    }

    return Enum289.AI_ACTION_NONE;
  }

  export function FindClosestDoor(pSoldier: SOLDIERTYPE): INT16 {
    let sClosestDoor: INT16 = NOWHERE;
    let iSearchRange: INT32;
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;
    let sGridNo: INT16;
    let iDist: INT32;
    let iClosestDist: INT32 = 10;

    iSearchRange = 5;

    // determine maximum horizontal limits
    sMaxLeft = Math.min(iSearchRange, pSoldier.sGridNo % MAXCOL);
    // NumMessage("sMaxLeft = ",sMaxLeft);
    sMaxRight = Math.min(
      iSearchRange,
      MAXCOL - ((pSoldier.sGridNo % MAXCOL) + 1),
    );
    // NumMessage("sMaxRight = ",sMaxRight);

    // determine maximum vertical limits
    sMaxUp = Math.min(iSearchRange, Math.trunc(pSoldier.sGridNo / MAXROW));
    // NumMessage("sMaxUp = ",sMaxUp);
    sMaxDown = Math.min(
      iSearchRange,
      MAXROW - (Math.trunc(pSoldier.sGridNo / MAXROW) + 1),
    );
    // NumMessage("sMaxDown = ",sMaxDown);
    // SET UP DOUBLE-LOOP TO STEP THROUGH POTENTIAL GRID #s
    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        // calculate the next potential gridno
        sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
        if (FindStructure(sGridNo, STRUCTURE_ANYDOOR) != null) {
          iDist = PythSpacesAway(pSoldier.sGridNo, sGridNo);
          if (iDist < iClosestDist) {
            iClosestDist = iDist;
            sClosestDoor = sGridNo;
          }
        }
      }
    }

    return sClosestDoor;
  }

  export function FindNearestEdgepointOnSpecifiedEdge(
    sGridNo: INT16,
    bEdgeCode: INT8,
  ): INT16 {
    let iLoop: INT32;
    let psEdgepointArray: INT16[] /* Pointer<INT16> */;
    let iEdgepointArraySize: INT32;
    let sClosestSpot: INT16 = NOWHERE;
    let sClosestDist: INT16 = 0x7fff;
    let sTempDist: INT16;

    switch (bEdgeCode) {
      case Enum291.NORTH_EDGEPOINT_SEARCH:
        psEdgepointArray = gps1stNorthEdgepointArray;
        iEdgepointArraySize = gus1stNorthEdgepointArraySize;
        break;
      case Enum291.EAST_EDGEPOINT_SEARCH:
        psEdgepointArray = gps1stEastEdgepointArray;
        iEdgepointArraySize = gus1stEastEdgepointArraySize;
        break;
      case Enum291.SOUTH_EDGEPOINT_SEARCH:
        psEdgepointArray = gps1stSouthEdgepointArray;
        iEdgepointArraySize = gus1stSouthEdgepointArraySize;
        break;
      case Enum291.WEST_EDGEPOINT_SEARCH:
        psEdgepointArray = gps1stWestEdgepointArray;
        iEdgepointArraySize = gus1stWestEdgepointArraySize;
        break;
      default:
        // WTF???
        return NOWHERE;
    }

    // Do a 2D search to find the closest map edgepoint and
    // try to create a path there

    for (iLoop = 0; iLoop < iEdgepointArraySize; iLoop++) {
      sTempDist = PythSpacesAway(sGridNo, psEdgepointArray[iLoop]);
      if (sTempDist < sClosestDist) {
        sClosestDist = sTempDist;
        sClosestSpot = psEdgepointArray[iLoop];
      }
    }

    return sClosestSpot;
  }

  export function FindNearestEdgePoint(sGridNo: INT16): INT16 {
    let sGridX: INT16;
    let sGridY: INT16;
    let sScreenX: INT16;
    let sScreenY: INT16;
    let sMaxScreenX: INT16;
    let sMaxScreenY: INT16;
    let sDist: INT16[] /* [5] */ = createArray(5, 0);
    let sMinDist: INT16;
    let iLoop: INT32;
    let bMinIndex: INT8;
    let psEdgepointArray: INT16[] /* Pointer<INT16> */;
    let iEdgepointArraySize: INT32;
    let sClosestSpot: INT16 = NOWHERE;
    let sClosestDist: INT16 = 0x7fff;
    let sTempDist: INT16;

    ({ sX: sGridX, sY: sGridY } = ConvertGridNoToXY(sGridNo));
    ({ sScreenX, sScreenY } = GetWorldXYAbsoluteScreenXY(sGridX, sGridY));

    sMaxScreenX = gsBRX - gsTLX;
    sMaxScreenY = gsBRY - gsTLY;

    sDist[0] = 0x7fff;
    sDist[1] = sScreenX; // west
    sDist[2] = sMaxScreenX - sScreenX; // east
    sDist[3] = sScreenY; // north
    sDist[4] = sMaxScreenY - sScreenY; // south

    sMinDist = sDist[0];
    bMinIndex = 0;
    for (iLoop = 1; iLoop < 5; iLoop++) {
      if (sDist[iLoop] < sMinDist) {
        sMinDist = sDist[iLoop];
        bMinIndex = iLoop;
      }
    }

    switch (bMinIndex) {
      case 1:
        psEdgepointArray = gps1stWestEdgepointArray;
        iEdgepointArraySize = gus1stWestEdgepointArraySize;
        break;
      case 2:
        psEdgepointArray = gps1stEastEdgepointArray;
        iEdgepointArraySize = gus1stEastEdgepointArraySize;
        break;
      case 3:
        psEdgepointArray = gps1stNorthEdgepointArray;
        iEdgepointArraySize = gus1stNorthEdgepointArraySize;
        break;
      case 4:
        psEdgepointArray = gps1stSouthEdgepointArray;
        iEdgepointArraySize = gus1stSouthEdgepointArraySize;
        break;
      default:
        // WTF???
        return NOWHERE;
    }

    // Do a 2D search to find the closest map edgepoint and
    // try to create a path there

    for (iLoop = 0; iLoop < iEdgepointArraySize; iLoop++) {
      sTempDist = PythSpacesAway(sGridNo, psEdgepointArray[iLoop]);
      if (sTempDist < sClosestDist) {
        sClosestDist = sTempDist;
        sClosestSpot = psEdgepointArray[iLoop];
      }
    }

    return sClosestSpot;
  }

  const EDGE_OF_MAP_SEARCH = 5;

  export function FindNearbyPointOnEdgeOfMap(
    pSoldier: SOLDIERTYPE,
    pbDirection: Pointer<INT8>,
  ): INT16 {
    let iSearchRange: INT32;
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;

    let sGridNo: INT16;
    let sClosestSpot: INT16 = NOWHERE;
    let bDirection: INT8 = 0;
    let bDirection__Pointer = createPointer(
      () => bDirection,
      (v) => (bDirection = v),
    );
    let bClosestDirection: INT8;
    let iPathCost: INT32;
    let iClosestPathCost: INT32 = 1000;

    bClosestDirection = -1;

    // Call FindBestPath to set flags in all locations that we can
    // walk into within range.  We have to set some things up first...

    // set the distance limit of the square region
    gubNPCDistLimit = EDGE_OF_MAP_SEARCH;

    iSearchRange = EDGE_OF_MAP_SEARCH;

    // determine maximum horizontal limits
    sMaxLeft = Math.min(iSearchRange, pSoldier.sGridNo % MAXCOL);
    // NumMessage("sMaxLeft = ",sMaxLeft);
    sMaxRight = Math.min(
      iSearchRange,
      MAXCOL - ((pSoldier.sGridNo % MAXCOL) + 1),
    );
    // NumMessage("sMaxRight = ",sMaxRight);

    // determine maximum vertical limits
    sMaxUp = Math.min(iSearchRange, Math.trunc(pSoldier.sGridNo / MAXROW));
    // NumMessage("sMaxUp = ",sMaxUp);
    sMaxDown = Math.min(
      iSearchRange,
      MAXROW - (Math.trunc(pSoldier.sGridNo / MAXROW) + 1),
    );

    // reset the "reachable" flags in the region we're looking at
    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
        if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
          continue;
        }

        gpWorldLevelData[sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;
      }
    }

    FindBestPath(
      pSoldier,
      NOWHERE,
      pSoldier.bLevel,
      Enum193.WALKING,
      COPYREACHABLE,
      0,
    );

    // Turn off the "reachable" flag for his current location
    // so we don't consider it
    gpWorldLevelData[pSoldier.sGridNo].uiFlags &= ~MAPELEMENT_REACHABLE;

    // SET UP DOUBLE-LOOP TO STEP THROUGH POTENTIAL GRID #s
    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        // calculate the next potential gridno
        sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
        if (!(sGridNo >= 0 && sGridNo < WORLD_MAX)) {
          continue;
        }

        if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
          continue;
        }

        if (GridNoOnEdgeOfMap(sGridNo, bDirection__Pointer)) {
          iPathCost = PythSpacesAway(pSoldier.sGridNo, sGridNo);

          if (iPathCost < iClosestPathCost) {
            // this place is closer
            sClosestSpot = sGridNo;
            iClosestPathCost = iPathCost;
            bClosestDirection = bDirection;
          }
        }
      }
    }

    pbDirection.value = bClosestDirection;
    return sClosestSpot;
  }

  function FindRouteBackOntoMap(
    pSoldier: SOLDIERTYPE,
    sDestGridNo: INT16,
  ): INT16 {
    // the first thing to do is restore the soldier's gridno from the X and Y
    // values

    // well, let's TRY just taking a path to the place we're supposed to go...
    if (
      FindBestPath(
        pSoldier,
        sDestGridNo,
        pSoldier.bLevel,
        Enum193.WALKING,
        COPYROUTE,
        0,
      )
    ) {
      pSoldier.bPathStored = true;
      return sDestGridNo;
    } else {
      return NOWHERE;
    }
  }

  export function FindClosestBoxingRingSpot(
    pSoldier: SOLDIERTYPE,
    fInRing: boolean,
  ): INT16 {
    let iSearchRange: INT32;
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;

    let sGridNo: INT16;
    let sClosestSpot: INT16 = NOWHERE;
    let iDistance: INT32;
    let iClosestDistance: INT32 = 9999;
    let ubRoom: UINT8;

    // set the distance limit of the square region
    iSearchRange = 7;

    // determine maximum horizontal limits
    sMaxLeft = Math.min(iSearchRange, pSoldier.sGridNo % MAXCOL);
    // NumMessage("sMaxLeft = ",sMaxLeft);
    sMaxRight = Math.min(
      iSearchRange,
      MAXCOL - ((pSoldier.sGridNo % MAXCOL) + 1),
    );
    // NumMessage("sMaxRight = ",sMaxRight);

    if (pSoldier.bTeam == gbPlayerNum && fInRing == false) {
      // have player not go to the left of the ring
      sMaxLeft = 0;
    }

    // determine maximum vertical limits
    sMaxUp = Math.min(iSearchRange, Math.trunc(pSoldier.sGridNo / MAXROW));
    // NumMessage("sMaxUp = ",sMaxUp);
    sMaxDown = Math.min(
      iSearchRange,
      MAXROW - (Math.trunc(pSoldier.sGridNo / MAXROW) + 1),
    );

    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        // calculate the next potential gridno
        sGridNo = pSoldier.sGridNo + sXOffset + MAXCOL * sYOffset;
        if ((ubRoom = InARoom(sGridNo)) !== -1) {
          if (
            (fInRing && ubRoom == BOXING_RING) ||
            (!fInRing &&
              ubRoom != BOXING_RING &&
              LegalNPCDestination(pSoldier, sGridNo, IGNORE_PATH, NOWATER, 0))
          ) {
            iDistance = Math.abs(sXOffset) + Math.abs(sYOffset);
            if (
              iDistance < iClosestDistance &&
              WhoIsThere2(sGridNo, 0) == NOBODY
            ) {
              sClosestSpot = sGridNo;
              iClosestDistance = iDistance;
            }
          }
        }
      }
    }

    return sClosestSpot;
  }

  export function FindNearestOpenableNonDoor(sStartGridNo: INT16): INT16 {
    let iSearchRange: INT32;
    let sMaxLeft: INT16;
    let sMaxRight: INT16;
    let sMaxUp: INT16;
    let sMaxDown: INT16;
    let sXOffset: INT16;
    let sYOffset: INT16;

    let sGridNo: INT16;
    let sClosestSpot: INT16 = NOWHERE;
    let iDistance: INT32;
    let iClosestDistance: INT32 = 9999;
    let pStructure: STRUCTURE | null;

    // set the distance limit of the square region
    iSearchRange = 7;

    // determine maximum horizontal limits
    sMaxLeft = Math.min(iSearchRange, sStartGridNo % MAXCOL);
    // NumMessage("sMaxLeft = ",sMaxLeft);
    sMaxRight = Math.min(iSearchRange, MAXCOL - ((sStartGridNo % MAXCOL) + 1));
    // NumMessage("sMaxRight = ",sMaxRight);

    // determine maximum vertical limits
    sMaxUp = Math.min(iSearchRange, Math.trunc(sStartGridNo / MAXROW));
    // NumMessage("sMaxUp = ",sMaxUp);
    sMaxDown = Math.min(
      iSearchRange,
      MAXROW - (Math.trunc(sStartGridNo / MAXROW) + 1),
    );

    for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
      for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
        // calculate the next potential gridno
        sGridNo = sStartGridNo + sXOffset + MAXCOL * sYOffset;
        pStructure = FindStructure(sGridNo, STRUCTURE_OPENABLE);
        if (pStructure) {
          // skip any doors
          while (pStructure && pStructure.fFlags & STRUCTURE_ANYDOOR) {
            pStructure = FindNextStructure(pStructure, STRUCTURE_OPENABLE);
          }
          // if we still have a pointer, then we have found a valid non-door openable structure
          if (pStructure) {
            iDistance = CardinalSpacesAway(sGridNo, sStartGridNo);
            if (iDistance < iClosestDistance) {
              sClosestSpot = sGridNo;
              iClosestDistance = iDistance;
            }
          }
        }
      }
    }

    return sClosestSpot;
  }
}
