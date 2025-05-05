namespace ja2 {
  const NEXT_TILE_CHECK_DELAY = 700;

  export function SetDelayedTileWaiting(
    pSoldier: SOLDIERTYPE,
    sCauseGridNo: INT16,
    bValue: INT8,
  ): void {
    let ubPerson: UINT8;

    // Cancel AI Action
    // CancelAIAction( pSoldier, TRUE );

    pSoldier.fDelayedMovement = bValue;
    pSoldier.sDelayedMovementCauseGridNo = sCauseGridNo;

    pSoldier.NextTileCounter = RESETTIMECOUNTER(NEXT_TILE_CHECK_DELAY);

    // ATE: Now update realtime movement speed....
    // check if guy exists here...
    ubPerson = WhoIsThere2(sCauseGridNo, pSoldier.bLevel);

    // There may not be anybody there, but it's reserved by them!
    if (gpWorldLevelData[sCauseGridNo].uiFlags & MAPELEMENT_MOVEMENT_RESERVED) {
      ubPerson = gpWorldLevelData[sCauseGridNo].ubReservedSoldierID;
    }

    if (ubPerson != NOBODY) {
      // if they are our own team members ( both )
      if (
        MercPtrs[ubPerson].bTeam == gbPlayerNum &&
        pSoldier.bTeam == gbPlayerNum
      ) {
        // Here we have another guy.... save his stats so we can use them for
        // speed determinations....
        pSoldier.bOverrideMoveSpeed = ubPerson;
        pSoldier.fUseMoverrideMoveSpeed = true;
      }
    }
  }

  function SetFinalTile(
    pSoldier: SOLDIERTYPE,
    sGridNo: INT16,
    fGivenUp: boolean,
  ): void {
    // OK, If we were waiting for stuff, do it here...

    // ATE: Disabled stuff below, made obsolete by timeout...
    // if ( pSoldier->ubWaitActionToDo  )
    //{
    //	pSoldier->ubWaitActionToDo = 0;
    //	gbNumMercsUntilWaitingOver--;
    //}
    pSoldier.sFinalDestination = pSoldier.sGridNo;

    if (pSoldier.bTeam == gbPlayerNum && fGivenUp) {
      ScreenMsg(
        FONT_MCOLOR_LTYELLOW,
        MSG_INTERFACE,
        TacticalStr[Enum335.NO_PATH_FOR_MERC],
        pSoldier.name,
      );
    }

    EVENT_StopMerc(pSoldier, pSoldier.sGridNo, pSoldier.bDirection);
  }

  function MarkMovementReserved(pSoldier: SOLDIERTYPE, sGridNo: INT16): void {
    // Check if we have one reserrved already, and free it first!
    if (pSoldier.sReservedMovementGridNo != NOWHERE) {
      UnMarkMovementReserved(pSoldier);
    }

    // For single-tiled mercs, set this gridno
    gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_MOVEMENT_RESERVED;

    // Save soldier's reserved ID #
    gpWorldLevelData[sGridNo].ubReservedSoldierID = pSoldier.ubID;

    pSoldier.sReservedMovementGridNo = sGridNo;
  }

  export function UnMarkMovementReserved(pSoldier: SOLDIERTYPE): void {
    let sNewGridNo: INT16;

    sNewGridNo = GETWORLDINDEXFROMWORLDCOORDS(pSoldier.dYPos, pSoldier.dXPos);

    // OK, if NOT in fence anim....
    if (
      pSoldier.usAnimState == Enum193.HOPFENCE &&
      pSoldier.sReservedMovementGridNo != sNewGridNo
    ) {
      return;
    }

    // For single-tiled mercs, unset this gridno
    // See if we have one reserved!
    if (pSoldier.sReservedMovementGridNo != NOWHERE) {
      gpWorldLevelData[pSoldier.sReservedMovementGridNo].uiFlags &=
        ~MAPELEMENT_MOVEMENT_RESERVED;

      pSoldier.sReservedMovementGridNo = NOWHERE;
    }
  }

  function TileIsClear(
    pSoldier: SOLDIERTYPE,
    bDirection: INT8,
    sGridNo: INT16,
    bLevel: INT8,
  ): INT8 {
    let ubPerson: UINT8;
    let sTempDestGridNo: INT16;
    let sNewGridNo: INT16;
    let fSwapInDoor: boolean = false;

    if (sGridNo == NOWHERE) {
      return MOVE_TILE_CLEAR;
    }

    ubPerson = WhoIsThere2(sGridNo, bLevel);

    if (ubPerson != NO_SOLDIER) {
      // If this us?
      if (ubPerson != pSoldier.ubID) {
        // OK, set flag indicating we are blocked by a merc....
        if (pSoldier.bTeam != gbPlayerNum) {
          // CJC: shouldn't this be in all cases???
          // if ( 0 )
          pSoldier.fBlockedByAnotherMerc = true;
          // Set direction we were trying to goto
          pSoldier.bBlockedByAnotherMercDirection = bDirection;

          // Are we only temporarily blocked?
          // Check if our final destination is = our gridno
          if (
            MercPtrs[ubPerson].sFinalDestination == MercPtrs[ubPerson].sGridNo
          ) {
            return MOVE_TILE_STATIONARY_BLOCKED;
          } else {
            // OK, if buddy who is blocking us is trying to move too...
            // And we are in opposite directions...
            if (
              MercPtrs[ubPerson].fBlockedByAnotherMerc &&
              MercPtrs[ubPerson].bBlockedByAnotherMercDirection ==
                gOppositeDirection[bDirection]
            ) {
              // OK, try and get a path around buddy....
              // We have to temporarily make buddy stopped...
              sTempDestGridNo = MercPtrs[ubPerson].sFinalDestination;
              MercPtrs[ubPerson].sFinalDestination = MercPtrs[ubPerson].sGridNo;

              if (
                PlotPath(
                  pSoldier,
                  pSoldier.sFinalDestination,
                  NO_COPYROUTE,
                  NO_PLOT,
                  TEMPORARY,
                  pSoldier.usUIMovementMode,
                  NOT_STEALTH,
                  FORWARD,
                  pSoldier.bActionPoints,
                )
              ) {
                pSoldier.bPathStored = false;
                // OK, make guy go here...
                EVENT_GetNewSoldierPath(
                  pSoldier,
                  pSoldier.sFinalDestination,
                  pSoldier.usUIMovementMode,
                );
                // Restore final dest....
                MercPtrs[ubPerson].sFinalDestination = sTempDestGridNo;
                pSoldier.fBlockedByAnotherMerc = false;

                // Is the next tile blocked too?
                sNewGridNo = NewGridNo(
                  pSoldier.sGridNo,
                  DirectionInc(guiPathingData[0]),
                );

                return TileIsClear(
                  pSoldier,
                  guiPathingData[0],
                  sNewGridNo,
                  pSoldier.bLevel,
                );
              } else {
                // Not for multi-tiled things...
                if (!(pSoldier.uiStatusFlags & SOLDIER_MULTITILE)) {
                  // Is the next movement cost for a door?
                  if (
                    DoorTravelCost(
                      pSoldier,
                      sGridNo,
                      gubWorldMovementCosts[sGridNo][bDirection][
                        pSoldier.bLevel
                      ],
                      pSoldier.bTeam == gbPlayerNum,
                      null,
                    ) == TRAVELCOST_DOOR
                  ) {
                    fSwapInDoor = true;
                  }

                  // If we are to swap and we're near a door, open door first and then close it...?

                  // Swap now!
                  MercPtrs[ubPerson].fBlockedByAnotherMerc = false;

                  // Restore final dest....
                  MercPtrs[ubPerson].sFinalDestination = sTempDestGridNo;

                  // Swap merc positions.....
                  SwapMercPositions(pSoldier, MercPtrs[ubPerson]);

                  // With these two guys swapped, they should try and continue on their way....
                  // Start them both again along their way...
                  EVENT_GetNewSoldierPath(
                    pSoldier,
                    pSoldier.sFinalDestination,
                    pSoldier.usUIMovementMode,
                  );
                  EVENT_GetNewSoldierPath(
                    MercPtrs[ubPerson],
                    MercPtrs[ubPerson].sFinalDestination,
                    MercPtrs[ubPerson].usUIMovementMode,
                  );
                }
              }
            }
            return MOVE_TILE_TEMP_BLOCKED;
          }
        } else {
          // return( MOVE_TILE_STATIONARY_BLOCKED );
          // ATE: OK, put some smartshere...
          // If we are waiting for more than a few times, change to stationary...
          if (MercPtrs[ubPerson].fDelayedMovement >= 105) {
            // Set to special 'I want to walk through people' value
            pSoldier.fDelayedMovement = 150;

            return MOVE_TILE_STATIONARY_BLOCKED;
          }
          if (
            MercPtrs[ubPerson].sGridNo == MercPtrs[ubPerson].sFinalDestination
          ) {
            return MOVE_TILE_STATIONARY_BLOCKED;
          }
          return MOVE_TILE_TEMP_BLOCKED;
        }
      }
    }

    if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_MOVEMENT_RESERVED) {
      if (gpWorldLevelData[sGridNo].ubReservedSoldierID != pSoldier.ubID) {
        return MOVE_TILE_TEMP_BLOCKED;
      }
    }

    // Are we clear of structs?
    if (!NewOKDestination(pSoldier, sGridNo, false, pSoldier.bLevel)) {
      // ATE: Fence cost is an exclusiuon here....
      if (
        gubWorldMovementCosts[sGridNo][bDirection][pSoldier.bLevel] !=
        TRAVELCOST_FENCE
      ) {
        // ATE: HIdden structs - we do something here... reveal it!
        if (
          gubWorldMovementCosts[sGridNo][bDirection][pSoldier.bLevel] ==
          TRAVELCOST_HIDDENOBSTACLE
        ) {
          gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_REVEALED;
          gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_REDRAW;
          SetRenderFlags(RENDER_FLAG_MARKED);
          RecompileLocalMovementCosts(sGridNo);
        }

        // Unset flag for blocked by soldier...
        pSoldier.fBlockedByAnotherMerc = false;
        return MOVE_TILE_STATIONARY_BLOCKED;
      } else {
      }
    }

    // Unset flag for blocked by soldier...
    pSoldier.fBlockedByAnotherMerc = false;

    return MOVE_TILE_CLEAR;
  }

  export function HandleNextTile(
    pSoldier: SOLDIERTYPE,
    bDirection: INT8,
    sGridNo: INT16,
    sFinalDestTile: INT16,
  ): boolean {
    let bBlocked: INT8;
    let bOverTerrainType: INT16;

    // Check for blocking if in realtime
    /// if ( ( gTacticalStatus.uiFlags & REALTIME ) || !( gTacticalStatus.uiFlags & INCOMBAT ) )

    // ATE: If not on visible tile, return clear ( for path out of map )
    if (!GridNoOnVisibleWorldTile(sGridNo)) {
      return true;
    }

    // If animation state is crow, iall is clear
    if (pSoldier.usAnimState == Enum193.CROW_FLY) {
      return true;
    }

    {
      bBlocked = TileIsClear(pSoldier, bDirection, sGridNo, pSoldier.bLevel);

      // Check if we are blocked...
      if (bBlocked != MOVE_TILE_CLEAR) {
        // Is the next gridno our destination?
        // OK: Let's check if we are NOT walking off screen
        if (
          sGridNo == sFinalDestTile &&
          pSoldier.ubWaitActionToDo == 0 &&
          (pSoldier.bTeam == gbPlayerNum ||
            pSoldier.sAbsoluteFinalDestination == NOWHERE)
        ) {
          // Yah, well too bad, stop here.
          SetFinalTile(pSoldier, pSoldier.sGridNo, false);

          return false;
        }
        // CHECK IF they are stationary
        else if (bBlocked == MOVE_TILE_STATIONARY_BLOCKED) {
          // Stationary,
          {
            let sOldFinalDest: INT16;

            // Maintain sFinalDest....
            sOldFinalDest = pSoldier.sFinalDestination;
            EVENT_StopMerc(pSoldier, pSoldier.sGridNo, pSoldier.bDirection);
            // Restore...
            pSoldier.sFinalDestination = sOldFinalDest;

            SetDelayedTileWaiting(pSoldier, sGridNo, 1);

            return false;
          }
        } else {
          {
            let sOldFinalDest: INT16;

            // Maintain sFinalDest....
            sOldFinalDest = pSoldier.sFinalDestination;
            EVENT_StopMerc(pSoldier, pSoldier.sGridNo, pSoldier.bDirection);
            // Restore...
            pSoldier.sFinalDestination = sOldFinalDest;

            // Setting to two means: try and wait until this tile becomes free....
            SetDelayedTileWaiting(pSoldier, sGridNo, 100);
          }

          return false;
        }
      } else {
        // Mark this tile as reserverd ( until we get there! )
        if (
          !(
            gTacticalStatus.uiFlags & TURNBASED &&
            gTacticalStatus.uiFlags & INCOMBAT
          )
        ) {
          MarkMovementReserved(pSoldier, sGridNo);
        }

        bOverTerrainType = GetTerrainType(sGridNo);

        // Check if we are going into water!
        if (
          bOverTerrainType == Enum315.LOW_WATER ||
          bOverTerrainType == Enum315.MED_WATER ||
          bOverTerrainType == Enum315.DEEP_WATER
        ) {
          // Check if we are of prone or crawl height and change stance accordingly....
          switch (gAnimControl[pSoldier.usAnimState].ubHeight) {
            case ANIM_PRONE:
            case ANIM_CROUCH:
              // Change height to stand
              pSoldier.fContinueMoveAfterStanceChange = 1;
              SendChangeSoldierStanceEvent(pSoldier, ANIM_STAND);
              break;
          }

          // Check animation
          // Change to walking
          if (pSoldier.usAnimState == Enum193.RUNNING) {
            ChangeSoldierState(pSoldier, Enum193.WALKING, 0, false);
          }
        }
      }
    }
    return true;
  }

  export function HandleNextTileWaiting(pSoldier: SOLDIERTYPE): boolean {
    // Buddy is waiting to continue his path
    let bBlocked: INT8;
    let bPathBlocked: INT8;
    let sCost: INT16;
    let sNewGridNo: INT16;
    let sCheckGridNo: INT16;
    let ubDirection: UINT8 = 0;
    let ubDirection__Pointer = createPointer(
      () => ubDirection,
      (v) => (ubDirection = v),
    );
    let bCauseDirection: UINT8;
    let ubPerson: UINT8;
    let fFlags: UINT8 = 0;

    if (pSoldier.fDelayedMovement) {
      if (TIMECOUNTERDONE(pSoldier.NextTileCounter, NEXT_TILE_CHECK_DELAY)) {
        pSoldier.NextTileCounter = RESETTIMECOUNTER(NEXT_TILE_CHECK_DELAY);

        // Get direction from gridno...
        bCauseDirection = GetDirectionToGridNoFromGridNo(
          pSoldier.sGridNo,
          pSoldier.sDelayedMovementCauseGridNo,
        );

        bBlocked = TileIsClear(
          pSoldier,
          bCauseDirection,
          pSoldier.sDelayedMovementCauseGridNo,
          pSoldier.bLevel,
        );

        // If we are waiting for a temp blockage.... continue to wait
        if (
          pSoldier.fDelayedMovement >= 100 &&
          bBlocked == MOVE_TILE_TEMP_BLOCKED
        ) {
          // ATE: Increment 1
          pSoldier.fDelayedMovement++;

          // Are we close enough to give up? ( and are a pc )
          if (pSoldier.fDelayedMovement > 120) {
            // Quit...
            SetFinalTile(pSoldier, pSoldier.sGridNo, true);
            pSoldier.fDelayedMovement = 0;
          }
          return true;
        }

        // Try new path if anything but temp blockage!
        if (bBlocked != MOVE_TILE_TEMP_BLOCKED) {
          // Set to normal delay
          if (
            pSoldier.fDelayedMovement >= 100 &&
            pSoldier.fDelayedMovement != 150
          ) {
            pSoldier.fDelayedMovement = 1;
          }

          // Default to pathing through people
          fFlags = PATH_THROUGH_PEOPLE;

          // Now, if we are in the state where we are desparently trying to get out...
          // Use other flag
          // CJC: path-through-people includes ignoring person at dest
          /*
        if ( pSoldier->fDelayedMovement >= 150 )
        {
                fFlags = PATH_IGNORE_PERSON_AT_DEST;
        }
        */

          // Check destination first!
          if (
            pSoldier.sAbsoluteFinalDestination == pSoldier.sFinalDestination
          ) {
            // on last lap of scripted move, make sure we get to final dest
            sCheckGridNo = pSoldier.sAbsoluteFinalDestination;
          } else if (
            !NewOKDestination(
              pSoldier,
              pSoldier.sFinalDestination,
              true,
              pSoldier.bLevel,
            )
          ) {
            if (pSoldier.fDelayedMovement >= 150) {
              // OK, look around dest for the first one!
              sCheckGridNo = FindGridNoFromSweetSpot(
                pSoldier,
                pSoldier.sFinalDestination,
                6,
                ubDirection__Pointer,
              );

              if (sCheckGridNo == NOWHERE) {
                // If this is nowhere, try harder!
                sCheckGridNo = FindGridNoFromSweetSpot(
                  pSoldier,
                  pSoldier.sFinalDestination,
                  16,
                  ubDirection__Pointer,
                );
              }
            } else {
              // OK, look around dest for the first one!
              sCheckGridNo = FindGridNoFromSweetSpotThroughPeople(
                pSoldier,
                pSoldier.sFinalDestination,
                6,
                ubDirection__Pointer,
              );

              if (sCheckGridNo == NOWHERE) {
                // If this is nowhere, try harder!
                sCheckGridNo = FindGridNoFromSweetSpotThroughPeople(
                  pSoldier,
                  pSoldier.sFinalDestination,
                  16,
                  ubDirection__Pointer,
                );
              }
            }
          } else {
            sCheckGridNo = pSoldier.sFinalDestination;
          }

          // Try another path to destination
          // ATE: Allow path to exit grid!
          if (
            pSoldier.ubWaitActionToDo == 1 &&
            gubWaitingForAllMercsToExitCode ==
              Enum238.WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO
          ) {
            gfPlotPathToExitGrid = true;
          }

          sCost = FindBestPath(
            pSoldier,
            sCheckGridNo,
            pSoldier.bLevel,
            pSoldier.usUIMovementMode,
            NO_COPYROUTE,
            fFlags,
          );
          gfPlotPathToExitGrid = false;

          // Can we get there
          if (sCost > 0) {
            // Is the next tile blocked too?
            sNewGridNo = NewGridNo(
              pSoldier.sGridNo,
              DirectionInc(guiPathingData[0]),
            );

            bPathBlocked = TileIsClear(
              pSoldier,
              guiPathingData[0],
              sNewGridNo,
              pSoldier.bLevel,
            );

            if (bPathBlocked == MOVE_TILE_STATIONARY_BLOCKED) {
              // Try to path around everyone except dest person

              if (
                pSoldier.ubWaitActionToDo == 1 &&
                gubWaitingForAllMercsToExitCode ==
                  Enum238.WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO
              ) {
                gfPlotPathToExitGrid = true;
              }

              sCost = FindBestPath(
                pSoldier,
                sCheckGridNo,
                pSoldier.bLevel,
                pSoldier.usUIMovementMode,
                NO_COPYROUTE,
                PATH_IGNORE_PERSON_AT_DEST,
              );

              gfPlotPathToExitGrid = false;

              // Is the next tile in this new path blocked too?
              sNewGridNo = NewGridNo(
                pSoldier.sGridNo,
                DirectionInc(guiPathingData[0]),
              );

              bPathBlocked = TileIsClear(
                pSoldier,
                guiPathingData[0],
                sNewGridNo,
                pSoldier.bLevel,
              );

              // now working with a path which does not go through people
              pSoldier.ubDelayedMovementFlags &=
                ~DELAYED_MOVEMENT_FLAG_PATH_THROUGH_PEOPLE;
            } else {
              // path through people worked fine
              if (pSoldier.fDelayedMovement < 150) {
                pSoldier.ubDelayedMovementFlags |=
                  DELAYED_MOVEMENT_FLAG_PATH_THROUGH_PEOPLE;
              }
            }

            // Are we clear?
            if (bPathBlocked == MOVE_TILE_CLEAR) {
              // Go for it path!
              if (
                pSoldier.ubWaitActionToDo == 1 &&
                gubWaitingForAllMercsToExitCode ==
                  Enum238.WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO
              ) {
                gfPlotPathToExitGrid = true;
              }

              // pSoldier->fDelayedMovement = FALSE;
              // ATE: THis will get set in EENT_GetNewSoldierPath....
              pSoldier.usActionData = sCheckGridNo;

              pSoldier.bPathStored = false;

              EVENT_GetNewSoldierPath(
                pSoldier,
                sCheckGridNo,
                pSoldier.usUIMovementMode,
              );
              gfPlotPathToExitGrid = false;

              return true;
            }
          }

          pSoldier.fDelayedMovement++;

          if (pSoldier.fDelayedMovement == 99) {
            // Cap at 99
            pSoldier.fDelayedMovement = 99;
          }

          // Do we want to force a swap?
          if (
            pSoldier.fDelayedMovement == 3 &&
            (pSoldier.sAbsoluteFinalDestination != NOWHERE ||
              gTacticalStatus.fAutoBandageMode)
          ) {
            // with person who is in the way?
            ubPerson = WhoIsThere2(
              pSoldier.sDelayedMovementCauseGridNo,
              pSoldier.bLevel,
            );

            // if either on a mission from god, or two AI guys not on stationary...
            if (
              ubPerson != NOBODY &&
              (pSoldier.ubQuoteRecord != 0 ||
                (pSoldier.bTeam != gbPlayerNum &&
                  pSoldier.bOrders != Enum241.STATIONARY &&
                  MercPtrs[ubPerson].bTeam != gbPlayerNum &&
                  MercPtrs[ubPerson].bOrders != Enum241.STATIONARY) ||
                (pSoldier.bTeam == gbPlayerNum &&
                  gTacticalStatus.fAutoBandageMode &&
                  !(
                    MercPtrs[ubPerson].bTeam == CIV_TEAM &&
                    MercPtrs[ubPerson].bOrders == Enum241.STATIONARY
                  )))
            ) {
              // Swap now!
              // MercPtrs[ ubPerson ]->fBlockedByAnotherMerc = FALSE;

              // Restore final dest....
              // MercPtrs[ ubPerson ]->sFinalDestination = sTempDestGridNo;

              // Swap merc positions.....
              SwapMercPositions(pSoldier, MercPtrs[ubPerson]);

              // With these two guys swapped, we should try to continue on our way....
              pSoldier.fDelayedMovement = 0;

              // We must calculate the path here so that we can give it the "through people" parameter
              if (
                gTacticalStatus.fAutoBandageMode &&
                pSoldier.sAbsoluteFinalDestination == NOWHERE
              ) {
                FindBestPath(
                  pSoldier,
                  pSoldier.sFinalDestination,
                  pSoldier.bLevel,
                  pSoldier.usUIMovementMode,
                  COPYROUTE,
                  PATH_THROUGH_PEOPLE,
                );
              } else if (
                pSoldier.sAbsoluteFinalDestination != NOWHERE &&
                !FindBestPath(
                  pSoldier,
                  pSoldier.sAbsoluteFinalDestination,
                  pSoldier.bLevel,
                  pSoldier.usUIMovementMode,
                  COPYROUTE,
                  PATH_THROUGH_PEOPLE,
                )
              ) {
                // check to see if we're there now!
                if (pSoldier.sGridNo == pSoldier.sAbsoluteFinalDestination) {
                  NPCReachedDestination(pSoldier, false);
                  pSoldier.bNextAction = Enum289.AI_ACTION_WAIT;
                  pSoldier.usNextActionData = 500;
                  return true;
                }
              }
              pSoldier.bPathStored = true;

              EVENT_GetNewSoldierPath(
                pSoldier,
                pSoldier.sAbsoluteFinalDestination,
                pSoldier.usUIMovementMode,
              );
              // EVENT_GetNewSoldierPath( MercPtrs[ ubPerson ], MercPtrs[ ubPerson ]->sFinalDestination, MercPtrs[ ubPerson ]->usUIMovementMode );
            }
          }

          // Are we close enough to give up? ( and are a pc )
          if (
            pSoldier.fDelayedMovement > 20 &&
            pSoldier.fDelayedMovement != 150
          ) {
            if (
              PythSpacesAway(pSoldier.sGridNo, pSoldier.sFinalDestination) <
                5 &&
              pSoldier.bTeam == gbPlayerNum
            ) {
              // Quit...
              SetFinalTile(pSoldier, pSoldier.sGridNo, false);
              pSoldier.fDelayedMovement = 0;
            }
          }

          // Are we close enough to give up? ( and are a pc )
          if (pSoldier.fDelayedMovement > 170) {
            if (
              PythSpacesAway(pSoldier.sGridNo, pSoldier.sFinalDestination) <
                5 &&
              pSoldier.bTeam == gbPlayerNum
            ) {
              // Quit...
              SetFinalTile(pSoldier, pSoldier.sGridNo, false);
              pSoldier.fDelayedMovement = 0;
            }
          }
        }
      }
    }
    return true;
  }

  export function TeleportSoldier(
    pSoldier: SOLDIERTYPE,
    sGridNo: INT16,
    fForce: boolean,
  ): boolean {
    let sX: INT16;
    let sY: INT16;

    // Check dest...
    if (NewOKDestination(pSoldier, sGridNo, true, 0) || fForce) {
      // TELEPORT TO THIS LOCATION!
      sX = CenterX(sGridNo);
      sY = CenterY(sGridNo);
      EVENT_SetSoldierPosition(pSoldier, sX, sY);

      pSoldier.sFinalDestination = sGridNo;

      // Make call to FOV to update items...
      RevealRoofsAndItems(pSoldier, true, true, pSoldier.bLevel, true);

      // Handle sight!
      HandleSight(pSoldier, SIGHT_LOOK | SIGHT_RADIO);

      // Cancel services...
      GivingSoldierCancelServices(pSoldier);

      // Change light....
      if (pSoldier.bLevel == 0) {
        if (pSoldier.iLight != -1)
          LightSpriteRoofStatus(pSoldier.iLight, false);
      } else {
        if (pSoldier.iLight != -1) LightSpriteRoofStatus(pSoldier.iLight, true);
      }
      return true;
    }

    return false;
  }

  // Swaps 2 soldier positions...
  export function SwapMercPositions(
    pSoldier1: SOLDIERTYPE,
    pSoldier2: SOLDIERTYPE,
  ): void {
    let sGridNo1: INT16;
    let sGridNo2: INT16;

    // OK, save positions...
    sGridNo1 = pSoldier1.sGridNo;
    sGridNo2 = pSoldier2.sGridNo;

    // OK, remove each.....
    RemoveSoldierFromGridNo(pSoldier1);
    RemoveSoldierFromGridNo(pSoldier2);

    // OK, test OK destination for each.......
    if (
      NewOKDestination(pSoldier1, sGridNo2, true, 0) &&
      NewOKDestination(pSoldier2, sGridNo1, true, 0)
    ) {
      // OK, call teleport function for each.......
      TeleportSoldier(pSoldier1, sGridNo2, false);
      TeleportSoldier(pSoldier2, sGridNo1, false);
    } else {
      // Place back...
      TeleportSoldier(pSoldier1, sGridNo1, true);
      TeleportSoldier(pSoldier2, sGridNo2, true);
    }
  }

  export function CanExchangePlaces(
    pSoldier1: SOLDIERTYPE,
    pSoldier2: SOLDIERTYPE,
    fShow: boolean,
  ): boolean {
    // NB checks outside of this function
    if (EnoughPoints(pSoldier1, AP_EXCHANGE_PLACES, 0, fShow)) {
      if (EnoughPoints(pSoldier2, AP_EXCHANGE_PLACES, 0, fShow)) {
        if (gAnimControl[pSoldier2.usAnimState].uiFlags & ANIM_MOVING) {
          return false;
        }

        if (
          gAnimControl[pSoldier1.usAnimState].uiFlags & ANIM_MOVING &&
          !(gTacticalStatus.uiFlags & INCOMBAT)
        ) {
          return false;
        }

        if (pSoldier2.bSide == 0) {
          return true;
        }

        // hehe - don't allow animals to exchange places
        if (pSoldier2.uiStatusFlags & SOLDIER_ANIMAL) {
          return false;
        }

        // must NOT be hostile, must NOT have stationary orders OR militia team, must be >= OKLIFE
        if (
          pSoldier2.bNeutral &&
          pSoldier2.bLife >= OKLIFE &&
          pSoldier2.ubCivilianGroup != Enum246.HICKS_CIV_GROUP &&
          (pSoldier2.bOrders != Enum241.STATIONARY ||
            pSoldier2.bTeam == MILITIA_TEAM ||
            (pSoldier2.sAbsoluteFinalDestination != NOWHERE &&
              pSoldier2.sAbsoluteFinalDestination != pSoldier2.sGridNo))
        ) {
          return true;
        }

        if (fShow) {
          if (pSoldier2.ubProfile == NO_PROFILE) {
            ScreenMsg(
              FONT_MCOLOR_LTYELLOW,
              MSG_UI_FEEDBACK,
              TacticalStr[Enum335.REFUSE_EXCHANGE_PLACES],
            );
          } else {
            ScreenMsg(
              FONT_MCOLOR_LTYELLOW,
              MSG_UI_FEEDBACK,
              gzLateLocalizedString[3],
              pSoldier2.name,
            );
          }
        }

        // ATE: OK, reduce this guy's next ai counter....
        pSoldier2.uiAIDelay = 100;

        return false;
      } else {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }
}
