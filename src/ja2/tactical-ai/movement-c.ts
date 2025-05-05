namespace ja2 {
  //
  // CJC's DG->JA2 conversion notes
  //
  // LegalNPCDestination - mode hardcoded to walking; C.O. tear gas related stuff commented out
  // TryToResumeMovement - C.O. EscortedMoveCanceled call
  // GoAsFarAsPossibleTowards - C.O. stuff related to current animation esp first aid
  // SetCivilianDestination - C.O. stuff for if we don't control the civ

  export function LegalNPCDestination(
    pSoldier: SOLDIERTYPE,
    sGridno: INT16,
    ubPathMode: UINT8,
    ubWaterOK: UINT8,
    fFlags: UINT8,
  ): number {
    let fSkipTilesWithMercs: boolean;

    if (sGridno < 0 || sGridno >= GRIDSIZE) {
      return 0;
    }

    // return false if gridno on different level from merc
    if (
      GridNoOnVisibleWorldTile(pSoldier.sGridNo) &&
      gpWorldLevelData[pSoldier.sGridNo].sHeight !=
        gpWorldLevelData[sGridno].sHeight
    ) {
      return 0;
    }

    // skip mercs if turnbased and adjacent AND not doing an IGNORE_PATH check (which is used almost exclusively by GoAsFarAsPossibleTowards)
    fSkipTilesWithMercs =
      gfTurnBasedAI &&
      ubPathMode != IGNORE_PATH &&
      SpacesAway(pSoldier.sGridNo, sGridno) == 1;

    // if this gridno is an OK destination
    // AND the gridno is NOT in a tear-gassed tile when we have no gas mask
    // AND someone is NOT already standing there
    // AND we're NOT already standing at that gridno
    // AND the gridno hasn't been black-listed for us

    // Nov 28 98: skip people in destination tile if in turnbased
    if (
      NewOKDestination(
        pSoldier,
        sGridno,
        fSkipTilesWithMercs,
        pSoldier.bLevel,
      ) &&
      !InGas(pSoldier, sGridno) &&
      sGridno != pSoldier.sGridNo &&
      sGridno != pSoldier.sBlackList
    ) {
      /*
  if ( ( NewOKDestination(pSoldier, sGridno, FALSE, pSoldier->bLevel ) ) &&
                                 ( !(gpWorldLevelData[ sGridno ].ubExtFlags[0] & (MAPELEMENT_EXT_SMOKE | MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) || ( pSoldier->inv[ HEAD1POS ].usItem == GASMASK || pSoldier->inv[ HEAD2POS ].usItem == GASMASK ) ) &&
                                 ( sGridno != pSoldier->sGridNo ) &&
                                 ( sGridno != pSoldier->sBlackList ) )*/
      /*
  if ( ( NewOKDestination(pSoldier,sGridno,ALLPEOPLE, pSoldier->bLevel ) ) &&
                                 ( !(gpWorldLevelData[ sGridno ].ubExtFlags[0] & (MAPELEMENT_EXT_SMOKE | MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) || ( pSoldier->inv[ HEAD1POS ].usItem == GASMASK || pSoldier->inv[ HEAD2POS ].usItem == GASMASK ) ) &&
                                 ( sGridno != pSoldier->sGridNo ) &&
                                 ( sGridno != pSoldier->sBlackList ) )
                                 */
      // if water's a problem, and gridno is in a water tile (bridges are OK)
      if (!ubWaterOK && Water(sGridno)) return 0;

      // passed all checks, now try to make sure we can get there!
      switch (ubPathMode) {
        // if finding a path wasn't asked for (could have already been done,
        // for example), don't bother
        case IGNORE_PATH:
          return 1;

        case ENSURE_PATH:
          if (
            FindBestPath(
              pSoldier,
              sGridno,
              pSoldier.bLevel,
              Enum193.WALKING,
              COPYROUTE,
              fFlags,
            )
          ) {
            return 1; // legal destination
          } // got this far, but found no clear path,
          else {
            // so test fails
            return 0;
          }
        // *** NOTE: movement mode hardcoded to WALKING !!!!!
        case ENSURE_PATH_COST:
          return PlotPath(
            pSoldier,
            sGridno,
            NO_COPYROUTE,
            NO_PLOT,
            TEMPORARY,
            Enum193.WALKING,
            NOT_STEALTH,
            FORWARD,
            0,
          );

        default:
          return 0;
      }
    } // something failed - didn't even have to test path
    else return 0; // illegal destination
  }

  export function TryToResumeMovement(
    pSoldier: SOLDIERTYPE,
    sGridno: INT16,
  ): boolean {
    let ubGottaCancel: boolean /* UINT8 */ = false;
    let ubSuccess: boolean /* UINT8 */ = false;

    // have to make sure the old destination is still legal (somebody may
    // have occupied the destination gridno in the meantime!)
    if (LegalNPCDestination(pSoldier, sGridno, ENSURE_PATH, WATEROK, 0)) {
      pSoldier.bPathStored = true; // optimization - Ian

      // make him go to it (needed to continue movement across multiple turns)
      NewDest(pSoldier, sGridno);

      ubSuccess = true;

      // make sure that it worked (check that pSoldier->sDestination == pSoldier->sGridNo)
      if (pSoldier.sDestination == sGridno) {
        ubSuccess = true;
      } else {
        // must work even for escorted civs, can't just set the flag
        CancelAIAction(pSoldier, FORCE);
      }
    } else {
      // don't black-list anything here, this situation can come up quite
      // legally if another soldier gets in the way between turns

      if (!pSoldier.bUnderEscort) {
        CancelAIAction(pSoldier, DONTFORCE); // no need to force this
      } else {
        // this is an escorted NPC, don't want to just completely stop
        // moving, try to find a nearby "next best" destination if possible
        pSoldier.usActionData = GoAsFarAsPossibleTowards(
          pSoldier,
          sGridno,
          pSoldier.bAction,
        );

        // if it's not possible to get any closer
        if (pSoldier.usActionData == NOWHERE) {
          ubGottaCancel = true;
        } else {
          // change his desired destination to this new one
          sGridno = pSoldier.usActionData;

          // GoAsFar... sets pathStored TRUE only if he could go all the way

          // make him go to it (needed to continue movement across multiple turns)
          NewDest(pSoldier, sGridno);

          // make sure that it worked (check that pSoldier->sDestination == pSoldier->sGridNo)
          if (pSoldier.sDestination == sGridno) ubSuccess = true;
          else ubGottaCancel = true;
        }

        if (ubGottaCancel) {
          // can't get close, gotta abort the movement!
          CancelAIAction(pSoldier, FORCE);

          // tell the player doing the escorting that civilian has stopped
          // EscortedMoveCanceled(pSoldier,COMMUNICATE);
        }
      }
    }

    return ubSuccess;
  }

  function NextPatrolPoint(pSoldier: SOLDIERTYPE): INT16 {
    // patrol slot 0 is UNUSED, so max patrolCnt is actually only 9
    if (pSoldier.bPatrolCnt < 1 || pSoldier.bPatrolCnt >= MAXPATROLGRIDS) {
      return NOWHERE;
    }

    pSoldier.bNextPatrolPnt++;

    // if there are no more patrol points, return back to the first one
    if (pSoldier.bNextPatrolPnt > pSoldier.bPatrolCnt)
      pSoldier.bNextPatrolPnt = 1; // ZERO is not used!

    return pSoldier.usPatrolGrid[pSoldier.bNextPatrolPnt];
  }

  export function PointPatrolAI(pSoldier: SOLDIERTYPE): boolean {
    let sPatrolPoint: INT16;
    let bOldOrders: INT8;

    sPatrolPoint = pSoldier.usPatrolGrid[pSoldier.bNextPatrolPnt];

    // if we're already there, advance next patrol point
    if (pSoldier.sGridNo == sPatrolPoint || pSoldier.bNextPatrolPnt == 0) {
      // find next valid patrol point
      do {
        sPatrolPoint = NextPatrolPoint(pSoldier);
      } while (
        sPatrolPoint != NOWHERE &&
        !NewOKDestination(pSoldier, sPatrolPoint, IGNOREPEOPLE, pSoldier.bLevel)
      );

      // if we're back where we started, then ALL other patrol points are junk!
      if (pSoldier.sGridNo == sPatrolPoint) {
        // force change of orders & an abort
        sPatrolPoint = NOWHERE;
      }
    }

    // if we don't have a legal patrol point
    if (sPatrolPoint == NOWHERE) {
      // over-ride orders to something safer
      pSoldier.bOrders = Enum241.FARPATROL;
      return false;
    }

    // make sure we can get there from here at this time, if we can't get all
    // the way there, at least do our best to get close
    if (LegalNPCDestination(pSoldier, sPatrolPoint, ENSURE_PATH, WATEROK, 0)) {
      pSoldier.bPathStored = true; // optimization - Ian
      pSoldier.usActionData = sPatrolPoint;
    } else {
      // temporarily extend roaming range to infinity by changing orders, else
      // this won't work if the next patrol point is > 10 tiles away!
      bOldOrders = pSoldier.bOrders;
      pSoldier.bOrders = Enum241.ONCALL;

      pSoldier.usActionData = GoAsFarAsPossibleTowards(
        pSoldier,
        sPatrolPoint,
        pSoldier.bAction,
      );

      pSoldier.bOrders = bOldOrders;

      // if it's not possible to get any closer, that's OK, but fail this call
      if (pSoldier.usActionData == NOWHERE) return false;
    }

    // passed all tests - start moving towards next patrol point

    return true;
  }

  export function RandomPointPatrolAI(pSoldier: SOLDIERTYPE): boolean {
    let sPatrolPoint: INT16;
    let bOldOrders: INT8;
    let bPatrolIndex: INT8;
    let bCnt: INT8;

    sPatrolPoint = pSoldier.usPatrolGrid[pSoldier.bNextPatrolPnt];

    // if we're already there, advance next patrol point
    if (pSoldier.sGridNo == sPatrolPoint || pSoldier.bNextPatrolPnt == 0) {
      // find next valid patrol point
      // we keep a count of the # of times we are in here to make sure we don't get into an endless
      // loop
      bCnt = 0;
      do {
        // usPatrolGrid[0] gets used for centre of close etc patrols, so we have to add 1 to the Random #
        bPatrolIndex = PreRandom(pSoldier.bPatrolCnt) + 1;
        sPatrolPoint = pSoldier.usPatrolGrid[bPatrolIndex];
        bCnt++;
      } while (
        sPatrolPoint == pSoldier.sGridNo ||
        (sPatrolPoint != NOWHERE &&
          bCnt < pSoldier.bPatrolCnt &&
          !NewOKDestination(
            pSoldier,
            sPatrolPoint,
            IGNOREPEOPLE,
            pSoldier.bLevel,
          ))
      );

      if (bCnt == pSoldier.bPatrolCnt) {
        // ok, we tried doing this randomly, didn't work well, so now do a linear search
        pSoldier.bNextPatrolPnt = 0;
        do {
          sPatrolPoint = NextPatrolPoint(pSoldier);
        } while (
          sPatrolPoint != NOWHERE &&
          !NewOKDestination(
            pSoldier,
            sPatrolPoint,
            IGNOREPEOPLE,
            pSoldier.bLevel,
          )
        );
      }

      // do nothing this time around
      if (pSoldier.sGridNo == sPatrolPoint) {
        return false;
      }
    }

    // if we don't have a legal patrol point
    if (sPatrolPoint == NOWHERE) {
      // over-ride orders to something safer
      pSoldier.bOrders = Enum241.FARPATROL;
      return false;
    }

    // make sure we can get there from here at this time, if we can't get all
    // the way there, at least do our best to get close
    if (LegalNPCDestination(pSoldier, sPatrolPoint, ENSURE_PATH, WATEROK, 0)) {
      pSoldier.bPathStored = true; // optimization - Ian
      pSoldier.usActionData = sPatrolPoint;
    } else {
      // temporarily extend roaming range to infinity by changing orders, else
      // this won't work if the next patrol point is > 10 tiles away!
      bOldOrders = pSoldier.bOrders;
      pSoldier.bOrders = Enum241.SEEKENEMY;

      pSoldier.usActionData = GoAsFarAsPossibleTowards(
        pSoldier,
        sPatrolPoint,
        pSoldier.bAction,
      );

      pSoldier.bOrders = bOldOrders;

      // if it's not possible to get any closer, that's OK, but fail this call
      if (pSoldier.usActionData == NOWHERE) return false;
    }

    // passed all tests - start moving towards next patrol point

    return true;
  }

  export function InternalGoAsFarAsPossibleTowards(
    pSoldier: SOLDIERTYPE,
    sDesGrid: INT16,
    bReserveAPs: INT8,
    bAction: INT8,
    fFlags: INT8,
  ): INT16 {
    let sLoop: INT16;
    let sAPCost: INT16;
    let sTempDest: INT16;
    let sGoToGrid: INT16;
    let sOrigin: INT16 = 0;
    let usMaxDist: UINT16;
    let ubDirection: UINT8;
    let ubDirsLeft: UINT8;
    let ubDirChecked: boolean[] /* UINT8[8] */ = createArray(8, false);
    let fFound: boolean /* UINT8 */ = false;
    let bAPsLeft: INT8 = <INT8>(<unknown>undefined);
    let fPathFlags: INT8;
    let ubRoomRequired: UINT8 = 0;
    let ubTempRoom: UINT8;

    if (bReserveAPs == -1) {
      // default reserve points
      if (CREATURE_OR_BLOODCAT(pSoldier)) {
        bReserveAPs = 0;
      } else {
        bReserveAPs = MAX_AP_CARRIED;
      }
    }

    sTempDest = -1;

    // obtain maximum roaming distance from soldier's sOrigin
    usMaxDist = RoamingRange(
      pSoldier,
      createPointer(
        () => sOrigin,
        (v) => (sOrigin = v),
      ),
    );

    if (
      pSoldier.bOrders <= Enum241.CLOSEPATROL &&
      (pSoldier.bTeam == CIV_TEAM || pSoldier.ubProfile != NO_PROFILE)
    ) {
      if ((ubRoomRequired = InARoom(pSoldier.usPatrolGrid[0])) !== -1) {
        // make sure this doesn't interfere with pathing for scripts
        if (pSoldier.sAbsoluteFinalDestination != NOWHERE) {
          ubRoomRequired = 0;
        }
      }
    }

    pSoldier.usUIMovementMode = DetermineMovementMode(pSoldier, bAction);
    if (
      pSoldier.usUIMovementMode == Enum193.RUNNING &&
      fFlags & FLAG_CAUTIOUS
    ) {
      pSoldier.usUIMovementMode = Enum193.WALKING;
    }

    // if soldier is ALREADY at the desired destination, quit right away
    if (sDesGrid == pSoldier.sGridNo) {
      return NOWHERE;
    }

    // don't try to approach go after noises or enemies actually in water
    // would be too easy to throw rocks in water, etc. & distract the AI
    if (Water(sDesGrid)) {
      return NOWHERE;
    }

    fPathFlags = 0;
    if (CREATURE_OR_BLOODCAT(pSoldier)) {
      /*
                                        if ( PythSpacesAway( pSoldier->sGridNo, sDesGrid ) <= PATH_CLOSE_RADIUS )
                                        {
                                                // then do a limited range path search and see if we can get there
                                                gubNPCDistLimit = 10;
                                                if ( !LegalNPCDestination( pSoldier, sDesGrid, ENSURE_PATH, NOWATER, fPathFlags) )
                                                {
                                                        gubNPCDistLimit = 0;
                                                        return( NOWHERE );
                                                }
                                                else
                                                {
                                                        // allow attempt to path without 'good enough' flag on
                                                        gubNPCDistLimit = 0;
                                                }
                                        }
                                        else
                                        {
                                        */
      fPathFlags = PATH_CLOSE_GOOD_ENOUGH;
      //}
    }

    // first step: try to find an OK destination at or near the desired gridno
    if (
      !LegalNPCDestination(pSoldier, sDesGrid, ENSURE_PATH, NOWATER, fPathFlags)
    ) {
      if (CREATURE_OR_BLOODCAT(pSoldier)) {
        // we tried to get close, failed; abort!
        return NOWHERE;
      } else {
        // else look at the 8 nearest gridnos to sDesGrid for a valid destination

        // clear ubDirChecked flag for all 8 directions
        for (ubDirection = 0; ubDirection < 8; ubDirection++)
          ubDirChecked[ubDirection] = false;

        ubDirsLeft = 8;

        // examine all 8 spots around 'sDesGrid'
        // keep looking while directions remain and a satisfactory one not found
        for (ubDirsLeft = 8; ubDirsLeft != 0; ubDirsLeft--) {
          if (fFound) {
            break;
          }
          // randomly select a direction which hasn't been 'checked' yet
          do {
            ubDirection = Random(8);
          } while (ubDirChecked[ubDirection]);

          ubDirChecked[ubDirection] = true;

          // determine the gridno 1 tile away from current friend in this direction
          sTempDest = NewGridNo(sDesGrid, DirectionInc(ubDirection + 1));

          // if that's out of bounds, ignore it & check next direction
          if (sTempDest == sDesGrid) continue;

          if (
            LegalNPCDestination(pSoldier, sTempDest, ENSURE_PATH, NOWATER, 0)
          ) {
            fFound = true; // found a spot

            break; // stop checking in other directions
          }
        }

        if (!fFound) {
          return NOWHERE;
        }

        // found a good grid #, this becomes our actual desired grid #
        sDesGrid = sTempDest;
      }
    }

    // HAVE FOUND AN OK destination AND PLOTTED A VALID BEST PATH TO IT

    sGoToGrid = pSoldier.sGridNo; // start back where soldier is standing now
    sAPCost = 0; // initialize path cost counter

    // we'll only go as far along the plotted route as is within our
    // permitted roaming range, and we'll stop as soon as we're down to <= 5 APs

    for (
      sLoop = 0;
      sLoop < pSoldier.usPathDataSize - pSoldier.usPathIndex;
      sLoop++
    ) {
      // what is the next gridno in the path?

      // sTempDest = NewGridNo( sGoToGrid,DirectionInc( (INT16) (pSoldier->usPathingData[sLoop] + 1) ) );
      sTempDest = NewGridNo(
        sGoToGrid,
        DirectionInc(pSoldier.usPathingData[sLoop]),
      );
      // NumMessage("sTempDest = ",sTempDest);

      // this should NEVER be out of bounds
      if (sTempDest == sGoToGrid) {
        break; // quit here, sGoToGrid is where we are going
      }

      // if this takes us beyond our permitted "roaming range"
      if (SpacesAway(sOrigin, sTempDest) > usMaxDist) break; // quit here, sGoToGrid is where we are going

      if (ubRoomRequired) {
        if (
          !(
            (ubTempRoom = InARoom(sTempDest)) !== -1 &&
            ubTempRoom == ubRoomRequired
          )
        ) {
          // quit here, limited by room!
          break;
        }
      }

      if (
        fFlags & FLAG_STOPSHORT &&
        SpacesAway(sDesGrid, sTempDest) <= STOPSHORTDIST
      ) {
        break; // quit here, sGoToGrid is where we are going
      }

      // if this gridno is NOT a legal NPC destination
      // DONT'T test path again - that would replace the traced path! - Ian
      // NOTE: It's OK to go *THROUGH* water to try and get to the destination!
      if (!LegalNPCDestination(pSoldier, sTempDest, IGNORE_PATH, WATEROK, 0))
        break; // quit here, sGoToGrid is where we are going

      // CAN'T CALL PathCost() HERE! IT CALLS findBestPath() and overwrites
      //       pathRouteToGo !!!  Gotta calculate the cost ourselves - Ian
      //
      // ubAPsLeft = pSoldier->bActionPoints - PathCost(pSoldier,sTempDest,FALSE,FALSE,FALSE,FALSE,FALSE);

      if (gfTurnBasedAI) {
        // if we're just starting the "costing" process (first gridno)
        if (sLoop == 0) {
          /*
         // first, add any additional costs - such as intermediate animations, etc.
         switch(pSoldier->anitype[pSoldier->anim])
                {
                 // in theory, no NPC should ever be in one of these animations as
                 // things stand (they don't medic anyone), but leave it for robustness
                 case START_AID   :
                 case GIVING_AID  : sAnimCost = AP_STOP_FIRST_AID;
                        break;

                 case TWISTOMACH  :
                 case COLLAPSED   : sAnimCost = AP_GET_UP;
                        break;

                 case TWISTBACK   :
                 case UNCONSCIOUS : sAnimCost = (AP_ROLL_OVER + AP_GET_UP);
                        break;

                 default          : sAnimCost = 0;
                }

         // this is our first cost
         sAPCost += sAnimCost;
         */

          if (pSoldier.usUIMovementMode == Enum193.RUNNING) {
            sAPCost += AP_START_RUN_COST;
          }
        }

        // ATE: Direction here?
        sAPCost += EstimateActionPointCost(
          pSoldier,
          sTempDest,
          pSoldier.usPathingData[sLoop],
          pSoldier.usUIMovementMode,
          sLoop,
          pSoldier.usPathDataSize,
        );

        bAPsLeft = pSoldier.bActionPoints - sAPCost;
      }

      // if after this, we have <= 5 APs remaining, that's far enough, break out
      // (the idea is to preserve APs so we can crouch or react if
      // necessary, and benefit from the carry-over next turn if not needed)
      // This routine is NOT used by any GREEN AI, so such caution is warranted!

      if (gfTurnBasedAI && bAPsLeft < bReserveAPs) break;
      else {
        sGoToGrid = sTempDest; // we're OK up to here

        // if exactly 5 APs left, don't bother checking any further
        if (gfTurnBasedAI && bAPsLeft == bReserveAPs) break;
      }
    }

    // if it turned out we couldn't go even 1 tile towards the desired gridno
    if (sGoToGrid == pSoldier.sGridNo) {
      return NOWHERE; // then go nowhere
    } else {
      // possible optimization - stored path IS good if we're going all the way
      if (sGoToGrid == sDesGrid) {
        pSoldier.bPathStored = true;
        pSoldier.sFinalDestination = sGoToGrid;
      } else if (pSoldier.usPathIndex == 0) {
        // we can hack this surely! -- CJC
        pSoldier.bPathStored = true;
        pSoldier.sFinalDestination = sGoToGrid;
        pSoldier.usPathDataSize = sLoop + 1;
      }

      return sGoToGrid;
    }
  }

  export function GoAsFarAsPossibleTowards(
    pSoldier: SOLDIERTYPE,
    sDesGrid: INT16,
    bAction: INT8,
  ): INT16 {
    return InternalGoAsFarAsPossibleTowards(pSoldier, sDesGrid, -1, bAction, 0);
  }

  export function SoldierTriesToContinueAlongPath(pSoldier: SOLDIERTYPE): void {
    let usNewGridNo: INT16;
    let bAPCost: INT16;

    // turn off the flag now that we're going to do something about it...
    // ATE: USed to be redundent, now if called befroe NewDest can cause some side efects...
    // AdjustNoAPToFinishMove( pSoldier, FALSE );

    if (pSoldier.bNewSituation == IS_NEW_SITUATION) {
      CancelAIAction(pSoldier, DONTFORCE);
      return;
    }

    if (pSoldier.usActionData >= NOWHERE) {
      CancelAIAction(pSoldier, DONTFORCE);
      return;
    }

    if (
      !NewOKDestination(pSoldier, pSoldier.usActionData, true, pSoldier.bLevel)
    ) {
      CancelAIAction(pSoldier, DONTFORCE);
      return;
    }

    if (IsActionAffordable(pSoldier)) {
      if (pSoldier.bActionInProgress == false) {
        // start a move that didn't even get started before...
        // hope this works...
        NPCDoesAct(pSoldier);

        // perform the chosen action
        pSoldier.bActionInProgress = ExecuteAction(pSoldier); // if started, mark us as busy
      } else {
        // otherwise we shouldn't have to do anything(?)
      }
    } else {
      CancelAIAction(pSoldier, DONTFORCE);
    }

    usNewGridNo = NewGridNo(
      pSoldier.sGridNo,
      DirectionInc(pSoldier.usPathingData[pSoldier.usPathIndex]),
    );

    // Find out how much it takes to move here!
    bAPCost = EstimateActionPointCost(
      pSoldier,
      usNewGridNo,
      pSoldier.usPathingData[pSoldier.usPathIndex],
      pSoldier.usUIMovementMode,
      pSoldier.usPathIndex,
      pSoldier.usPathDataSize,
    );

    if (pSoldier.bActionPoints >= bAPCost) {
      // seems to have enough points...
      NewDest(pSoldier, usNewGridNo);
      // maybe we didn't actually start the action last turn...
      pSoldier.bActionInProgress = true;
    } else {
      CancelAIAction(pSoldier, DONTFORCE);
    }
  }

  export function HaltMoveForSoldierOutOfPoints(pSoldier: SOLDIERTYPE): void {
    // If a special move, ignore this!
    if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_SPECIALMOVE) {
      return;
    }

    // record that this merc can no longer animate and why...
    AdjustNoAPToFinishMove(pSoldier, true);

    // We'll keep his action intact though...
    DebugAI(
      FormatString(
        "NO AP TO FINISH MOVE for %d (%d APs left)",
        pSoldier.ubID,
        pSoldier.bActionPoints,
      ),
    );

    // if this dude is under AI right now, then pass the baton to someone else
    if (pSoldier.uiStatusFlags & SOLDIER_UNDERAICONTROL) {
      EndAIGuysTurn(pSoldier);
    }
  }

  function SetCivilianDestination(ubWho: UINT8, sGridno: INT16): void {
    let pSoldier: SOLDIERTYPE;

    pSoldier = MercPtrs[ubWho];

    /*
   // if we control the civilian
   if (PTR_OURCONTROL)
    {
  */
    // if the destination is different from what he has now
    if (pSoldier.usActionData != sGridno) {
      // store his new destination
      pSoldier.usActionData = sGridno;

      // and cancel any movement in progress that he was still engaged in
      pSoldier.bAction = Enum289.AI_ACTION_NONE;
      pSoldier.bActionInProgress = false;
    }

    // only set the underEscort flag once you give him a destination
    // (that way AI can keep him appearing to act on his own until you
    // give him orders).
    //
    // Either way, once set, it should stay that way, preventing AI from
    // doing anything other than advance him towards destination.
    pSoldier.bUnderEscort = true;

    // change orders to maximize roaming range so he can Go As Far As Possible
    pSoldier.bOrders = Enum241.ONCALL;
    /*
    }

   else
    {
     NetSend.msgType = NET_CIV_DEST;
     NetSend.ubID  = pSoldier->ubID;
     NetSend.gridno  = gridno;

     // only the civilian's controller needs to know this
     SendNetData(pSoldier->controller);
    }
  */
  }

  const RADIUS = 3;

  export function TrackScent(pSoldier: SOLDIERTYPE): INT16 {
    // This function returns the best gridno to go to based on the scent being followed,
    // and the soldier (creature/animal)'s current direction (which is used to resolve
    // ties.
    let iXDiff: INT32;
    let iYDiff: INT32;
    let iXIncr: INT32;
    let iStart: INT32;
    let iXStart: INT32;
    let iYStart: INT32;
    let iGridNo: INT32;
    let bDir: INT8;
    let iBestGridNo: INT32 = NOWHERE;
    let ubBestDirDiff: UINT8 = 5;
    let ubBestStrength: UINT8 = 0;
    let ubDirDiff: UINT8;
    let ubStrength: UINT8;
    let ubSoughtSmell: UINT8;
    let pMapElement: MAP_ELEMENT;

    iStart = pSoldier.sGridNo;
    iXStart = iStart % WORLD_COLS;
    iYStart = Math.trunc(iStart / WORLD_COLS);

    if (CREATURE_OR_BLOODCAT(pSoldier)) {
      // or bloodcats
      // tracking humans; search the edges of a 7x7 square for the
      // most promising tile
      ubSoughtSmell = HUMAN;
      for (iYDiff = -RADIUS; iYDiff < RADIUS + 1; iYDiff++) {
        if (iYStart + iYDiff < 0) {
          // outside of map! might be on map further down...
          continue;
        } else if (iYStart + iYDiff > WORLD_ROWS) {
          // outside of bottom of map! abort!
          break;
        }
        if (iYDiff == -RADIUS || iYDiff == RADIUS) {
          iXIncr = 1;
        } else {
          // skip over the spots in the centre of the square
          iXIncr = RADIUS * 2;
        }
        for (iXDiff = -RADIUS; iXDiff < RADIUS + 1; iXDiff += iXIncr) {
          iGridNo = iStart + iXDiff + iYDiff * WORLD_ROWS;
          if (Math.abs((iGridNo % WORLD_ROWS) - iXStart) > RADIUS) {
            // wrapped across map!
            continue;
          }
          if (
            LegalNPCDestination(
              pSoldier,
              pSoldier.usActionData,
              ENSURE_PATH,
              WATEROK,
              0,
            )
          ) {
            // check this location out
            pMapElement = gpWorldLevelData[iGridNo];
            if (
              pMapElement.ubSmellInfo &&
              SMELL_TYPE(pMapElement.ubSmellInfo) == ubSoughtSmell
            ) {
              ubStrength = SMELL_STRENGTH(pMapElement.ubSmellInfo);
              if (ubStrength > ubBestStrength) {
                iBestGridNo = iGridNo;
                ubBestStrength = ubStrength;
                bDir = atan8(
                  iXStart,
                  iYStart,
                  iXStart + iXDiff,
                  iYStart + iYDiff,
                );
                // now convert it into a difference in degree between it and our current dir
                ubBestDirDiff = Math.abs(pSoldier.bDirection - bDir);
                if (ubBestDirDiff > 4) {
                  // dir 0 compared with dir 6, for instance
                  ubBestDirDiff = 8 - ubBestDirDiff;
                }
              } else if (ubStrength == ubBestStrength) {
                if (iBestGridNo == NOWHERE) {
                  // first place we've found with the same strength
                  iBestGridNo = iGridNo;
                  ubBestStrength = ubStrength;
                } else {
                  // use directions to decide between the two
                  // start by calculating direction to the new gridno
                  bDir = atan8(
                    iXStart,
                    iYStart,
                    iXStart + iXDiff,
                    iYStart + iYDiff,
                  );
                  // now convert it into a difference in degree between it and our current dir
                  ubDirDiff = Math.abs(pSoldier.bDirection - bDir);
                  if (ubDirDiff > 4) {
                    // dir 0 compared with dir 6, for instance
                    ubDirDiff = 8 - ubDirDiff;
                  }
                  if (
                    ubDirDiff < ubBestDirDiff ||
                    (ubDirDiff == ubBestDirDiff && Random(2))
                  ) {
                    // follow this trail as its closer to the one we're following!
                    // (in the case of a tie, we tossed a coin)
                    ubBestDirDiff = ubDirDiff;
                  }
                }
              }
            }
          }
        }
        // go on to next tile
      }
      // go on to next row
    } else {
      // who else can track?
    }
    if (iBestGridNo != NOWHERE) {
      pSoldier.usActionData = iBestGridNo;
      return iBestGridNo;
    }
    return 0;
  }

  /*
UINT16 RunAway( SOLDIERTYPE * pSoldier )
{
        // "Run away! Run away!!!"
        // This code should figure out which directions are safe for the enemy
        // to run in.  They shouldn't try to run off in directions which will
        // take them into enemy territory.  We must presume that they inform each
        // other by radio when sectors are taken by the player! :-)
        // The second wrinkle would be to look at the directions to known player
        // mercs and use that to influence the direction in which we run.

        // we can only flee in the cardinal directions (NESW) so start with an
        // alternating pattern of true/false
        INT8 bOkayDir[8] = {TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE};
        UINT8 ubLoop, ubBestDir, ubDistToEdge, ubBestDistToEdge = WORLD_COLS;
        INT32	iSector, iSectorX, iSectorY;
        INT32 iNewSectorX, iNewSectorY, iNewSector;
        INT32	iRunX, iRunY, iRunGridNo;
        SOLDIERTYPE * pOpponent;

        iSector = pSoldier->sSectorX + pSoldier->sSectorY * MAP_WORLD_X;

        // first start by scanning through opposing mercs and find out what directions are blocked.
        for (ubLoop = 0,pOpponent = Menptr; ubLoop < MAXMERCS; ubLoop++,pOpponent++)
        {
                // if this merc is inactive, at base, on assignment, or dead
                if (!pOpponent->bActive || !pOpponent->bInSector || !pOpponent->bLife)
                {
                        continue;          // next merc
                }

                // if this man is neutral / on the same side, he's not an opponent
                if (pOpponent->bNeutral || (pSoldier->bSide == pOpponent->bSide))
                {
                        continue;          // next merc
                }

                // we don't want to run in that direction!
                bOkayDir[ atan8( pSoldier->sX, pSoldier->sY, pOpponent->sX, pOpponent->sY ) ] = FALSE;
        }

        for (ubLoop = 0; ubLoop < 8; ubLoop += 2)
        {
                if (bOkayDir[ubLoop])
                {
                        // figure out sector # in that direction
                        iNewSectorX = pSoldier->sSectorX + DirXIncrementer[ubLoop];
                        iNewSectorY = pSoldier->sSectorY + DirYIncrementer[ubLoop];
                        iNewSector = iSectorX + iSectorY * MAP_WORLD_X;
                        // check movement
                        if (TravelBetweenSectorsIsBlockedFromFoot( (UINT16) iSector, (UINT16) iNewSector ) || StrategicMap[iSector].fEnemyControlled)
                        {
                                // sector inaccessible or controlled by the player; skip it!
                                continue;
                        }
                        switch( ubLoop )
                        {
                                case 0:
                                        ubDistToEdge = pSoldier->sGridNo / WORLD_COLS;
                                        break;
                                case 2:
                                        ubDistToEdge = WORLD_COLS - pSoldier->sGridNo % WORLD_COLS;
                                        break;
                                case 4:
                                        ubDistToEdge = WORLD_ROWS - pSoldier->sGridNo / WORLD_COLS;
                                        break;
                                case 6:
                                        ubDistToEdge = pSoldier->sGridNo % WORLD_COLS;
                                        break;
                        }
                        if (ubDistToEdge < ubBestDistToEdge)
                        {
                                ubBestDir = ubLoop;
                                ubBestDistToEdge = ubDistToEdge;
                        }
                }
        }
        if (ubBestDistToEdge < WORLD_COLS)
        {
                switch( ubBestDir )
                {
                        case 0:
                                iRunX = pSoldier->sX + Random( 9 ) - 4;
                                iRunY = 0;
                                if (iRunX < 0)
                                {
                                        iRunX = 0;
                                }
                                else if (iRunX >= WORLD_COLS)
                                {
                                        iRunX = WORLD_COLS - 1;
                                }
                                break;
                        case 2:
                                iRunX = WORLD_COLS;
                                iRunY = pSoldier->sY + Random( 9 ) - 4;
                                if (iRunY < 0)
                                {
                                        iRunY = 0;
                                }
                                else if (iRunY >= WORLD_COLS)
                                {
                                        iRunY = WORLD_ROWS - 1;
                                }
                                break;
                        case 4:
                                iRunX = pSoldier->sX + Random( 9 ) - 4;
                                iRunY = WORLD_ROWS;
                                if (iRunX < 0)
                                {
                                        iRunX = 0;
                                }
                                else if (iRunX >= WORLD_COLS)
                                {
                                        iRunX = WORLD_COLS - 1;
                                }
                                break;
                        case 6:
                                iRunX = 0;
                                iRunY = pSoldier->sY + Random( 9 ) - 4;
                                if (iRunY < 0)
                                {
                                        iRunY = 0;
                                }
                                else if (iRunY >= WORLD_COLS)
                                {
                                        iRunY = WORLD_ROWS - 1;
                                }
                                break;
                }
                iRunGridNo = iRunX + iRunY * WORLD_COLS;
                if (LegalNPCDestination( pSoldier, (UINT16) iRunGridNo, ENSURE_PATH, TRUE,0))
                {
                        return( (UINT16) iRunGridNo );
                }
                // otherwise we'll try again another time
        }
        return( NOWHERE );
}
*/
}
