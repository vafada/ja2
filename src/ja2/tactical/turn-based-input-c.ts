namespace ja2 {
  let gfFirstCycleMovementStarted: boolean = false;

  let guiSoldierFlags: UINT32;
  export let guiUITargetSoldierId: UINT32 = NOBODY;

  let gpExchangeSoldier1: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */;
  let gpExchangeSoldier2: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */;

  export let gfNextFireJam: boolean = false;

  export let gubCheatLevel: UINT8 = STARTING_CHEAT_LEVEL;

  export function GetTBMouseButtonInput(puiNewEvent: Pointer<UINT32>): void {
    QueryTBLeftButton(puiNewEvent);
    QueryTBRightButton(puiNewEvent);
  }

  /* static */ let QueryTBLeftButton__fClickHoldIntercepted: boolean = false;
  /* static */ let QueryTBLeftButton__fCanCheckForSpeechAdvance: boolean =
    false;
  /* static */ let QueryTBLeftButton__sMoveClickGridNo: INT16 = 0;
  function QueryTBLeftButton(puiNewEvent: Pointer<UINT32>): void {
    let pSoldier: SOLDIERTYPE | null;
    let usMapPos: UINT16 = 0;
    let fOnInterTile: boolean = false;

    // LEFT MOUSE BUTTON
    if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
      if (
        !GetMouseMapPos(
          createPointer(
            () => usMapPos,
            (v) => (usMapPos = v),
          ),
        ) &&
        !gfUIShowExitSouth
      ) {
        return;
      }

      if (gViewportRegion.ButtonState & MSYS_LEFT_BUTTON) {
        if (!fLeftButtonDown) {
          fLeftButtonDown = true;
          RESETCOUNTER(Enum386.LMOUSECLICK_DELAY_COUNTER);

          {
            switch (gCurrentUIMode) {
              case Enum206.CONFIRM_ACTION_MODE:
                if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
                  pSoldier.sStartGridNo = usMapPos;
                }
                break;

              case Enum206.MOVE_MODE:
                if (giUIMessageOverlay != -1) {
                  EndUIMessage();
                } else {
                  if (
                    !HandleCheckForExitArrowsInput(false) &&
                    gpItemPointer == null
                  ) {
                    // First check if we clicked on a guy, if so, make selected if it's ours
                    if (
                      gfUIFullTargetFound &&
                      guiUIFullTargetFlags & OWNED_MERC
                    ) {
                      if (!(guiUIFullTargetFlags & UNCONSCIOUS_MERC)) {
                        QueryTBLeftButton__fClickHoldIntercepted = true;

                        // Select guy
                        if (
                          (pSoldier = GetSoldier(gusUIFullTargetID)) !== null &&
                          gpItemPointer == null
                        ) {
                          if (pSoldier.bAssignment >= Enum117.ON_DUTY) {
                            // do nothing
                            QueryTBLeftButton__fClickHoldIntercepted = false;
                          } else {
                            puiNewEvent.value = Enum207.I_SELECT_MERC;
                          }
                        } else {
                          puiNewEvent.value = Enum207.I_SELECT_MERC;
                        }
                      }
                    } else {
                      if (InUIPlanMode()) {
                        AddUIPlan(usMapPos, UIPLAN_ACTION_MOVETO);
                      } else {
                        // We're on terrain in which we can walk, walk
                        // If we're on terrain,
                        if (gusSelectedSoldier != NO_SOLDIER) {
                          let bReturnVal: INT8 = 0;

                          pSoldier = GetSoldier(gusSelectedSoldier);

                          bReturnVal = HandleMoveModeInteractiveClick(
                            usMapPos,
                            puiNewEvent,
                          );

                          // All's OK for interactive tile?
                          if (bReturnVal == -2) {
                            // Confirm!
                            if (SelectedMercCanAffordMove()) {
                              puiNewEvent.value = Enum207.C_WAIT_FOR_CONFIRM;
                            }
                          } else if (bReturnVal == 0) {
                            if (gfUIAllMoveOn) {
                              puiNewEvent.value = Enum207.C_WAIT_FOR_CONFIRM;
                            } else {
                              if (gsCurrentActionPoints == 0) {
                                ScreenMsg(
                                  FONT_MCOLOR_LTYELLOW,
                                  MSG_UI_FEEDBACK,
                                  TacticalStr[Enum335.NO_PATH],
                                );
                              } else if (SelectedMercCanAffordMove()) {
                                let fResult: UINT8 /* boolean */;

                                if (
                                  (fResult = UIOKMoveDestination(
                                    MercPtrs[gusSelectedSoldier],
                                    usMapPos,
                                  )) == 1
                                ) {
                                  // ATE: CHECK IF WE CAN GET TO POSITION
                                  // Check if we are not in combat
                                  pSoldier = GetSoldier(gusSelectedSoldier);

                                  if (gsCurrentActionPoints == 0) {
                                    ScreenMsg(
                                      FONT_MCOLOR_LTYELLOW,
                                      MSG_UI_FEEDBACK,
                                      TacticalStr[Enum335.NO_PATH],
                                    );
                                  } else {
                                    puiNewEvent.value =
                                      Enum207.C_WAIT_FOR_CONFIRM;
                                  }
                                } else {
                                  if (fResult == 2) {
                                    ScreenMsg(
                                      FONT_MCOLOR_LTYELLOW,
                                      MSG_UI_FEEDBACK,
                                      TacticalStr[
                                        Enum335.NOBODY_USING_REMOTE_STR
                                      ],
                                    );
                                  } else {
                                    // if ( usMapPos != sMoveClickGridNo || pSoldier->uiStatusFlags & SOLDIER_ROBOT )
                                    //{
                                    //	sMoveClickGridNo					= usMapPos;
                                    // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ CANT_MOVE_THERE_STR ] );
                                    // Goto hand cursor mode....
                                    //	*puiNewEvent					  = M_CHANGE_TO_HANDMODE;
                                    //	gsOverItemsGridNo				= usMapPos;
                                    //	gsOverItemsLevel				= gsInterfaceLevel;
                                    //}
                                    // else
                                    //{
                                    //	sMoveClickGridNo = 0;
                                    //	*puiNewEvent = M_CHANGE_TO_HANDMODE;
                                    //}
                                  }
                                  // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, L"Invalid move destination." );
                                }
                              }
                            }
                          }
                          // OK, our first right-click is an all-cycle
                          gfUICanBeginAllMoveCycle = false;
                        }
                        QueryTBLeftButton__fClickHoldIntercepted = true;
                      }
                    }
                  } else {
                    QueryTBLeftButton__fClickHoldIntercepted = true;
                    fIgnoreLeftUp = true;
                  }
                }
                break;
            }
          }
          if (gfUIWaitingForUserSpeechAdvance) {
            QueryTBLeftButton__fCanCheckForSpeechAdvance = true;
          }
        }

        // HERE FOR CLICK-DRAG CLICK
        switch (gCurrentUIMode) {
          case Enum206.MOVE_MODE:
            // First check if we clicked on a guy, if so, make selected if it's ours
            if (gfUIFullTargetFound) {
              // Select guy
              if (
                guiUIFullTargetFlags & SELECTED_MERC &&
                !(guiUIFullTargetFlags & UNCONSCIOUS_MERC) &&
                !(MercPtrs[gusUIFullTargetID].uiStatusFlags & SOLDIER_VEHICLE)
              ) {
                puiNewEvent.value = Enum207.M_CHANGE_TO_ADJPOS_MODE;
                fIgnoreLeftUp = false;
              }
            }
            break;
        }

        // IF HERE, DO A CLICK-HOLD IF IN INTERVAL
        if (
          COUNTERDONE(Enum386.LMOUSECLICK_DELAY_COUNTER) &&
          !QueryTBLeftButton__fClickHoldIntercepted
        ) {
          // Switch on UI mode
          switch (gCurrentUIMode) {
          }
        }
      } else {
        if (fLeftButtonDown) {
          if (!fIgnoreLeftUp) {
            // FIRST CHECK FOR ANYTIME ( NON-INTERVAL ) CLICKS
            switch (gCurrentUIMode) {
              case Enum206.ADJUST_STANCE_MODE:
                // If button has come up, change to mocve mode
                puiNewEvent.value = Enum207.PADJ_ADJUST_STANCE;
                break;
            }

            // CHECK IF WE CLICKED-HELD
            if (COUNTERDONE(Enum386.LMOUSECLICK_DELAY_COUNTER)) {
              // LEFT CLICK-HOLD EVENT
              // Switch on UI mode
              switch (gCurrentUIMode) {
                case Enum206.CONFIRM_ACTION_MODE:
                  if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
                    if (pSoldier.bDoBurst) {
                      pSoldier.sEndGridNo = usMapPos;

                      gfBeginBurstSpreadTracking = false;

                      if (pSoldier.sEndGridNo != pSoldier.sStartGridNo) {
                        pSoldier.fDoSpread = 1;

                        PickBurstLocations(pSoldier);

                        puiNewEvent.value = Enum207.CA_MERC_SHOOT;
                      } else {
                        pSoldier.fDoSpread = 0;
                      }

                      QueryTBLeftButton__fClickHoldIntercepted = true;
                    }
                  }
                  break;
              }
            }

            {
              // LEFT CLICK NORMAL EVENT
              // Switch on UI mode
              if (!QueryTBLeftButton__fClickHoldIntercepted) {
                if (giUIMessageOverlay != -1) {
                  EndUIMessage();
                } else {
                  if (!HandleCheckForExitArrowsInput(true)) {
                    if (gpItemPointer != null) {
                      if (HandleItemPointerClick(usMapPos)) {
                        // getout of mode
                        EndItemPointer();

                        puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                      }
                    } else {
                      // Check for wiating for keyboard advance
                      if (
                        gfUIWaitingForUserSpeechAdvance &&
                        QueryTBLeftButton__fCanCheckForSpeechAdvance
                      ) {
                        // We have a key, advance!
                        DialogueAdvanceSpeech();
                      } else {
                        switch (gCurrentUIMode) {
                          case Enum206.MENU_MODE:
                            // If we get a hit here and we're in menu mode, quit the menu mode
                            EndMenuEvent(guiCurrentEvent);
                            break;

                          case Enum206.IDLE_MODE:
                            // First check if we clicked on a guy, if so, make selected if it's ours
                            if (gfUIFullTargetFound) {
                              // Select guy
                              if (
                                guiUIFullTargetFlags & OWNED_MERC &&
                                !(guiUIFullTargetFlags & UNCONSCIOUS_MERC)
                              ) {
                                puiNewEvent.value = Enum207.I_SELECT_MERC;
                              }
                            }
                            break;

                          case Enum206.MOVE_MODE:
                            // Check if we should activate an interactive tile!
                            // Select guy
                            if (
                              guiUIFullTargetFlags & OWNED_MERC &&
                              !(guiUIFullTargetFlags & UNCONSCIOUS_MERC)
                            ) {
                              // Select guy
                              if (
                                (pSoldier = GetSoldier(gusUIFullTargetID)) !==
                                  null &&
                                gpItemPointer == null &&
                                !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)
                              ) {
                                if (pSoldier.bAssignment >= Enum117.ON_DUTY) {
                                  PopupAssignmentMenuInTactical(pSoldier);
                                }
                              }
                            }
                            break;

                          case Enum206.CONFIRM_MOVE_MODE:
                            puiNewEvent.value = Enum207.C_MOVE_MERC;
                            break;

                          case Enum206.HANDCURSOR_MODE:
                            HandleHandCursorClick(usMapPos, puiNewEvent);
                            break;

                          case Enum206.JUMPOVER_MODE:
                            if (
                              (pSoldier = GetSoldier(gusSelectedSoldier)) !==
                              null
                            ) {
                              if (
                                EnoughPoints(
                                  pSoldier,
                                  gsCurrentActionPoints,
                                  0,
                                  true,
                                )
                              ) {
                                puiNewEvent.value = Enum207.JP_JUMP;
                              }
                            }
                            break;

                          case Enum206.ACTION_MODE:
                            if (InUIPlanMode()) {
                              AddUIPlan(usMapPos, UIPLAN_ACTION_FIRE);
                            } else {
                              if (
                                (pSoldier = GetSoldier(gusSelectedSoldier)) !==
                                null
                              ) {
                                if (!HandleUIReloading(pSoldier)) {
                                  // ATE: Reset refine aim..
                                  pSoldier.bShownAimTime = 0;

                                  if (gsCurrentActionPoints == 0) {
                                    ScreenMsg(
                                      FONT_MCOLOR_LTYELLOW,
                                      MSG_UI_FEEDBACK,
                                      TacticalStr[Enum335.NO_PATH],
                                    );
                                  }
                                  // Determine if we have enough action points!
                                  else if (
                                    UIMouseOnValidAttackLocation(pSoldier) &&
                                    SelectedMercCanAffordAttack()
                                  ) {
                                    puiNewEvent.value =
                                      Enum207.A_CHANGE_TO_CONFIM_ACTION;
                                    pSoldier.sStartGridNo = usMapPos;
                                  }
                                }
                              }
                            }
                            break;

                          case Enum206.CONFIRM_ACTION_MODE:
                            puiNewEvent.value = Enum207.CA_MERC_SHOOT;
                            break;

                          case Enum206.LOOKCURSOR_MODE:
                            // If we cannot actually do anything, return to movement mode
                            puiNewEvent.value = Enum207.LC_LOOK;
                            break;

                          case Enum206.TALKCURSOR_MODE:
                            if (HandleTalkInit()) {
                              puiNewEvent.value = Enum207.TA_TALKINGMENU;
                            }
                            break;

                          case Enum206.GETTINGITEM_MODE:
                            // Remove menu!
                            // RemoveItemPickupMenu( );
                            break;

                          case Enum206.TALKINGMENU_MODE:
                            // HandleTalkingMenuEscape( TRUE );
                            break;

                          case Enum206.EXITSECTORMENU_MODE:
                            RemoveSectorExitMenu(false);
                            break;

                          case Enum206.OPENDOOR_MENU_MODE:
                            CancelOpenDoorMenu();
                            HandleOpenDoorMenu();
                            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                            break;
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          // Reset flag
          fLeftButtonDown = false;
          fIgnoreLeftUp = false;
          QueryTBLeftButton__fClickHoldIntercepted = false;
          QueryTBLeftButton__fCanCheckForSpeechAdvance = false;
          gfFirstCycleMovementStarted = false;

          // Reset counter
          RESETCOUNTER(Enum386.LMOUSECLICK_DELAY_COUNTER);
        }
      }
    } else {
      // Set mouse down to false
      // fLeftButtonDown = FALSE;

      // OK, handle special cases like if we are dragging and holding for a burst spread and
      // release mouse over another mouse region
      if (gfBeginBurstSpreadTracking) {
        if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
          pSoldier.fDoSpread = 0;
        }
        gfBeginBurstSpreadTracking = false;
      }
    }
  }

  /* static */ let QueryTBRightButton__fClickHoldIntercepted: boolean = false;
  /* static */ let QueryTBRightButton__fClickIntercepted: boolean = false;
  function QueryTBRightButton(puiNewEvent: Pointer<UINT32>): void {
    let pSoldier: SOLDIERTYPE | null;
    let usMapPos: UINT16 = 0;
    let fDone: boolean = false;
    if (
      !GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      return;
    }

    if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
      // RIGHT MOUSE BUTTON
      if (gViewportRegion.ButtonState & MSYS_RIGHT_BUTTON) {
        if (!fRightButtonDown) {
          fRightButtonDown = true;
          RESETCOUNTER(Enum386.RMOUSECLICK_DELAY_COUNTER);
        }

        // CHECK COMBINATIONS
        if (fLeftButtonDown) {
        } else {
          if (gpItemPointer == null) {
            // IF HERE, DO A CLICK-HOLD IF IN INTERVAL
            if (
              COUNTERDONE(Enum386.RMOUSECLICK_DELAY_COUNTER) &&
              !QueryTBRightButton__fClickHoldIntercepted
            ) {
              // Switch on UI mode
              switch (gCurrentUIMode) {
                case Enum206.IDLE_MODE:
                case Enum206.ACTION_MODE:
                case Enum206.HANDCURSOR_MODE:
                case Enum206.LOOKCURSOR_MODE:
                case Enum206.TALKCURSOR_MODE:
                case Enum206.MOVE_MODE:
                  // Check if we're on terrain
                  // if ( !gfUIFullTargetFound )
                  //{
                  // ATE:
                  fDone = false;

                  if (
                    guiUIFullTargetFlags & OWNED_MERC &&
                    !(guiUIFullTargetFlags & UNCONSCIOUS_MERC)
                  ) {
                    // Select guy
                    if (
                      (pSoldier = GetSoldier(gusUIFullTargetID)) !== null &&
                      gpItemPointer == null &&
                      !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)
                    ) {
                      // if( pSoldier->bAssignment >= ON_DUTY )
                      {
                        PopupAssignmentMenuInTactical(pSoldier);
                        QueryTBRightButton__fClickHoldIntercepted = true;
                      }
                    }
                  }

                  if (fDone) {
                    break;
                  }

                  if (
                    gusSelectedSoldier != NOBODY &&
                    !QueryTBRightButton__fClickHoldIntercepted
                  ) {
                    puiNewEvent.value = Enum207.U_MOVEMENT_MENU;
                    QueryTBRightButton__fClickHoldIntercepted = true;
                  }
                  //}
                  // else
                  //{
                  // If we are on a selected guy
                  //	if ( guiUIFullTargetFlags & SELECTED_MERC && !( guiUIFullTargetFlags & UNCONSCIOUS_MERC ) )
                  //	{
                  //*puiNewEvent = U_POSITION_MENU;
                  // fClickHoldIntercepted = TRUE;
                  //	}
                  //		else if ( guiUIFullTargetFlags & OWNED_MERC )
                  //		{
                  // If we are on a non-selected guy selected guy
                  //		}

                  //}
                  break;
              }
            }
          }
        }
      } else {
        if (fRightButtonDown) {
          if (fLeftButtonDown) {
            fIgnoreLeftUp = true;

            if (gpItemPointer == null) {
              // ATE:
              if (gusSelectedSoldier != NOBODY) {
                switch (gCurrentUIMode) {
                  case Enum206.CONFIRM_MOVE_MODE:
                  case Enum206.MOVE_MODE:
                    if (gfUICanBeginAllMoveCycle) {
                      puiNewEvent.value = Enum207.M_CYCLE_MOVE_ALL;
                    } else {
                      if (!gfFirstCycleMovementStarted) {
                        gfFirstCycleMovementStarted = true;

                        // OK, set this guy's movement mode to crawling fo rthat we will start cycling in run.....
                        if (
                          MercPtrs[gusSelectedSoldier].usUIMovementMode !=
                          Enum193.RUNNING
                        ) {
                          // ATE: UNLESS WE ARE IN RUNNING MODE ALREADY
                          MercPtrs[gusSelectedSoldier].usUIMovementMode =
                            Enum193.CRAWLING;
                        }
                      }

                      // Give event to cycle movement
                      puiNewEvent.value = Enum207.M_CYCLE_MOVEMENT;
                      break;
                    }
                }

                // ATE: Added cancel of burst mode....
                if (gfBeginBurstSpreadTracking) {
                  gfBeginBurstSpreadTracking = false;
                  gfRTClickLeftHoldIntercepted = true;
                  MercPtrs[gusSelectedSoldier].fDoSpread = 0;
                  QueryTBRightButton__fClickHoldIntercepted = true;
                  puiNewEvent.value = Enum207.A_END_ACTION;
                  gCurrentUIMode = Enum206.MOVE_MODE;
                }
              }
            }
          } else {
            if (
              !QueryTBRightButton__fClickHoldIntercepted &&
              !QueryTBRightButton__fClickIntercepted
            ) {
              if (gpItemPointer == null) {
                // ATE:
                if (gusSelectedSoldier != NOBODY) {
                  // Switch on UI mode
                  switch (gCurrentUIMode) {
                    case Enum206.IDLE_MODE:
                      break;

                    case Enum206.MOVE_MODE:
                      // We have here a change to action mode
                      puiNewEvent.value = Enum207.M_CHANGE_TO_ACTION;
                      QueryTBRightButton__fClickIntercepted = true;
                      break;

                    case Enum206.ACTION_MODE:
                      // We have here a change to action mode
                      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                      QueryTBRightButton__fClickIntercepted = true;
                      break;

                    case Enum206.CONFIRM_MOVE_MODE:
                      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                      QueryTBRightButton__fClickIntercepted = true;
                      break;

                    case Enum206.HANDCURSOR_MODE:
                      // If we cannot actually do anything, return to movement mode
                      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                      break;

                    case Enum206.LOOKCURSOR_MODE:
                    case Enum206.TALKCURSOR_MODE:
                      // If we cannot actually do anything, return to movement mode
                      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                      break;

                    case Enum206.CONFIRM_ACTION_MODE:
                      if (
                        (pSoldier = GetSoldier(gusSelectedSoldier)) !== null
                      ) {
                        HandleRightClickAdjustCursor(pSoldier, usMapPos);
                      }
                      QueryTBRightButton__fClickIntercepted = true;
                      break;

                    case Enum206.MENU_MODE:
                      // If we get a hit here and we're in menu mode, quit the menu mode
                      EndMenuEvent(guiCurrentEvent);
                      QueryTBRightButton__fClickIntercepted = true;
                      break;
                  }
                }
              } else {
                if (gfUIFullTargetFound) {
                  gfItemPointerDifferentThanDefault =
                    !gfItemPointerDifferentThanDefault;
                }
              }
            }
          }
        }
        // Reset flag
        fRightButtonDown = false;
        QueryTBRightButton__fClickHoldIntercepted = false;
        QueryTBRightButton__fClickIntercepted = false;

        // Reset counter
        RESETCOUNTER(Enum386.RMOUSECLICK_DELAY_COUNTER);
      }
    }
  }

  /* static */ let GetTBMousePositionInput__usOldMapPos: UINT16 = 0;
  /* static */ let GetTBMousePositionInput__fOnValidGuy: boolean = false;
  /* static */ let GetTBMousePositionInput__uiMoveTargetSoldierId: UINT32 =
    NO_SOLDIER;
  export function GetTBMousePositionInput(puiNewEvent: Pointer<UINT32>): void {
    let usMapPos: UINT16 = 0;
    let pSoldier: SOLDIERTYPE | null;
    let bHandleCode: UINT8 /* boolean */;

    if (
      !GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      return;
    }

    if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
      // Handle highlighting stuff
      HandleObjectHighlighting();

      // Check if we have an item in our hands...
      if (gpItemPointer != null) {
        puiNewEvent.value = Enum207.A_ON_TERRAIN;
        return;
      }

      // Switch on modes
      switch (gCurrentUIMode) {
        case Enum206.LOCKUI_MODE:
          puiNewEvent.value = Enum207.LU_ON_TERRAIN;
          break;

        case Enum206.LOCKOURTURN_UI_MODE:
          puiNewEvent.value = Enum207.LA_ON_TERRAIN;
          break;

        case Enum206.IDLE_MODE:
          puiNewEvent.value = Enum207.I_ON_TERRAIN;
          break;

        case Enum206.ENEMYS_TURN_MODE:
          puiNewEvent.value = Enum207.ET_ON_TERRAIN;
          break;

        case Enum206.LOOKCURSOR_MODE:
          puiNewEvent.value = Enum207.LC_ON_TERRAIN;
          break;

        case Enum206.TALKCURSOR_MODE:
          if (GetTBMousePositionInput__uiMoveTargetSoldierId != NOBODY) {
            if (gfUIFullTargetFound) {
              if (
                gusUIFullTargetID !=
                GetTBMousePositionInput__uiMoveTargetSoldierId
              ) {
                puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                return;
              }
            } else {
              puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
              return;
            }
          }
          puiNewEvent.value = Enum207.T_ON_TERRAIN;
          break;

        case Enum206.MOVE_MODE:
          GetTBMousePositionInput__uiMoveTargetSoldierId = NO_SOLDIER;

          // Check for being on terrain
          if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
            if (IsValidJumpLocation(pSoldier, usMapPos, true)) {
              gsJumpOverGridNo = usMapPos;
              puiNewEvent.value = Enum207.JP_ON_TERRAIN;
              return;
            } else {
              if (gfUIFullTargetFound) {
                // ATE: Don't do this automatically for enemies......
                if (MercPtrs[gusUIFullTargetID].bTeam != ENEMY_TEAM) {
                  GetTBMousePositionInput__uiMoveTargetSoldierId =
                    gusUIFullTargetID;
                  if (
                    IsValidTalkableNPC(
                      gusUIFullTargetID,
                      false,
                      false,
                      false,
                    ) &&
                    !_KeyDown(SHIFT) &&
                    !AM_AN_EPC(pSoldier) &&
                    !ValidQuickExchangePosition()
                  ) {
                    puiNewEvent.value = Enum207.T_CHANGE_TO_TALKING;
                    return;
                  }
                }
              }
            }
          }
          puiNewEvent.value = Enum207.M_ON_TERRAIN;
          break;

        case Enum206.ACTION_MODE:
          // First check if we are on a guy, if so, make selected if it's ours
          // Check if the guy is visible
          guiUITargetSoldierId = NOBODY;

          GetTBMousePositionInput__fOnValidGuy = false;

          if (gfUIFullTargetFound) {
            // if ( gfUIFullTargetFound )
            if (IsValidTargetMerc(gusUIFullTargetID)) {
              guiUITargetSoldierId = gusUIFullTargetID;

              if (MercPtrs[gusUIFullTargetID].bTeam != gbPlayerNum) {
                GetTBMousePositionInput__fOnValidGuy = true;
              } else {
                if (gUIActionModeChangeDueToMouseOver) {
                  puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                  return;
                }
              }
            }
          } else {
            if (gUIActionModeChangeDueToMouseOver) {
              puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
              return;
            }
          }
          puiNewEvent.value = Enum207.A_ON_TERRAIN;
          break;

        case Enum206.GETTINGITEM_MODE:
          break;

        case Enum206.TALKINGMENU_MODE:
          if (HandleTalkingMenu()) {
            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
          }
          break;

        case Enum206.EXITSECTORMENU_MODE:
          if (HandleSectorExitMenu()) {
            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
          }
          break;

        case Enum206.OPENDOOR_MENU_MODE:
          if ((bHandleCode = HandleOpenDoorMenu())) {
            // OK, IF we are not canceling, set ui back!
            if (bHandleCode == 2) {
              puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
            } else {
            }
          }
          break;

        case Enum206.JUMPOVER_MODE:
          // ATE: Make sure!
          if (gsJumpOverGridNo != usMapPos) {
            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
          } else {
            puiNewEvent.value = Enum207.JP_ON_TERRAIN;
          }
          break;

        case Enum206.CONFIRM_MOVE_MODE:
          if (usMapPos != GetTBMousePositionInput__usOldMapPos) {
            // Switch event out of confirm mode
            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;

            // Set off ALL move....
            gfUIAllMoveOn = 0;

            // ERASE PATH
            ErasePath(true);
          }
          break;

        case Enum206.CONFIRM_ACTION_MODE:
          // DONOT CANCEL IF BURST
          if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
            if (pSoldier.bDoBurst) {
              pSoldier.sEndGridNo = usMapPos;

              if (
                pSoldier.sEndGridNo != pSoldier.sStartGridNo &&
                fLeftButtonDown
              ) {
                pSoldier.fDoSpread = 1;
                gfBeginBurstSpreadTracking = true;
              }

              if (pSoldier.fDoSpread) {
                // Accumulate gridno
                AccumulateBurstLocation(usMapPos);

                puiNewEvent.value = Enum207.CA_ON_TERRAIN;
                break;
              }
            }
          }

          // First check if we are on a guy, if so, make selected if it's ours
          if (gfUIFullTargetFound) {
            if (guiUITargetSoldierId != gusUIFullTargetID) {
              // Switch event out of confirm mode
              puiNewEvent.value = Enum207.CA_END_CONFIRM_ACTION;
            } else {
              puiNewEvent.value = Enum207.CA_ON_TERRAIN;
            }
          } else {
            // OK, if we were on a guy, and now we are off, go back!
            if (GetTBMousePositionInput__fOnValidGuy) {
              // Switch event out of confirm mode
              puiNewEvent.value = Enum207.CA_END_CONFIRM_ACTION;
            } else {
              if (
                ConfirmActionCancel(
                  usMapPos,
                  GetTBMousePositionInput__usOldMapPos,
                )
              ) {
                // Switch event out of confirm mode
                puiNewEvent.value = Enum207.CA_END_CONFIRM_ACTION;
              } else {
                puiNewEvent.value = Enum207.CA_ON_TERRAIN;
              }
            }
          }
          break;

        case Enum206.HANDCURSOR_MODE:
          puiNewEvent.value = Enum207.HC_ON_TERRAIN;
          break;
      }

      GetTBMousePositionInput__usOldMapPos = usMapPos;
    }
  }

  /* static */ let GetPolledKeyboardInput__fShifted: boolean = false;
  /* static */ let GetPolledKeyboardInput__fShifted2: boolean = false;
  /* static */ let GetPolledKeyboardInput__fCtrlDown: boolean = false;
  /* static */ let GetPolledKeyboardInput__fAltDown: boolean = false;
  /* static */ let GetPolledKeyboardInput__fDeleteDown: boolean = false;
  /* static */ let GetPolledKeyboardInput__fEndDown: boolean = false;
  export function GetPolledKeyboardInput(puiNewEvent: Pointer<UINT32>): void {
    // CHECK FOR POLLED KEYS!!
    // CHECK FOR CTRL
    switch (gCurrentUIMode) {
      case Enum206.DONT_CHANGEMODE:
      case Enum206.CONFIRM_MOVE_MODE:
      case Enum206.CONFIRM_ACTION_MODE:
      case Enum206.LOOKCURSOR_MODE:
      case Enum206.TALKCURSOR_MODE:
      case Enum206.IDLE_MODE:
      case Enum206.MOVE_MODE:
      case Enum206.ACTION_MODE:
      case Enum206.HANDCURSOR_MODE:
        if (_KeyDown(CTRL)) {
          if (GetPolledKeyboardInput__fCtrlDown == false) {
            ErasePath(true);
            gfPlotNewMovement = true;
          }
          GetPolledKeyboardInput__fCtrlDown = true;
          puiNewEvent.value = Enum207.HC_ON_TERRAIN;
        }
        if (!_KeyDown(CTRL) && GetPolledKeyboardInput__fCtrlDown) {
          GetPolledKeyboardInput__fCtrlDown = false;
          puiNewEvent.value = Enum207.M_ON_TERRAIN;
          gfPlotNewMovement = true;
        }
        break;
    }

    // CHECK FOR ALT
    switch (gCurrentUIMode) {
      case Enum206.MOVE_MODE:
        if (_KeyDown(ALT)) {
          if (GetPolledKeyboardInput__fAltDown == false) {
            // Get currently selected guy and change reverse....
            if (gusSelectedSoldier != NOBODY) {
              gUIUseReverse = true;
              ErasePath(true);
              gfPlotNewMovement = true;
            }
          }
          GetPolledKeyboardInput__fAltDown = true;
        }
        if (!_KeyDown(ALT) && GetPolledKeyboardInput__fAltDown) {
          if (gusSelectedSoldier != NOBODY) {
            gUIUseReverse = false;
            ErasePath(true);
            gfPlotNewMovement = true;
          }

          GetPolledKeyboardInput__fAltDown = false;
        }
        break;
    }

    // Check realtime input!
    if (
      gTacticalStatus.uiFlags & REALTIME ||
      !(gTacticalStatus.uiFlags & INCOMBAT)
    ) {
      // if ( _KeyDown( CAPS )  ) //&& !fShifted )
      //{
      //	fShifted = TRUE;
      //	if ( gCurrentUIMode != ACTION_MODE && gCurrentUIMode != CONFIRM_ACTION_MODE )
      //	{
      //		*puiNewEvent = CA_ON_TERRAIN;
      //	}
      //}
      // if ( !(_KeyDown( CAPS ) ) && fShifted )
      //{
      //	fShifted = FALSE;
      //	{
      //		*puiNewEvent = M_ON_TERRAIN;
      //	}
      //}

      if (_KeyDown(SHIFT)) {
        //&& !fShifted )
        GetPolledKeyboardInput__fShifted2 = true;
        if (
          gCurrentUIMode != Enum206.MOVE_MODE &&
          gCurrentUIMode != Enum206.CONFIRM_MOVE_MODE
        ) {
          // puiNewEvent = M_ON_TERRAIN;
        }
      }
      if (!_KeyDown(SHIFT) && GetPolledKeyboardInput__fShifted2) {
        GetPolledKeyboardInput__fShifted2 = false;
        if (
          gCurrentUIMode != Enum206.ACTION_MODE &&
          gCurrentUIMode != Enum206.CONFIRM_ACTION_MODE
        ) {
          //	*puiNewEvent = A_ON_TERRAIN;
        }
      }
    }

    if (_KeyDown(DEL)) {
      DisplayCoverOfSelectedGridNo();

      GetPolledKeyboardInput__fDeleteDown = true;
    }

    if (!_KeyDown(DEL) && GetPolledKeyboardInput__fDeleteDown) {
      RemoveCoverOfSelectedGridNo();

      GetPolledKeyboardInput__fDeleteDown = false;
    }

    if (_KeyDown(END)) {
      DisplayGridNoVisibleToSoldierGrid();

      GetPolledKeyboardInput__fEndDown = true;
    }

    if (!_KeyDown(END) && GetPolledKeyboardInput__fEndDown) {
      RemoveVisibleGridNoAtSelectedGridNo();

      GetPolledKeyboardInput__fEndDown = false;
    }
  }

  /* static */ let GetKeyboardInput__fShifted: boolean = false;
  /* static */ let GetKeyboardInput__fShifted2: boolean = false;
  /* static */ let GetKeyboardInput__fAltDown: boolean = false;
  /* static */ let GetKeyboardInput__fShowRoofs: boolean = true;
  /* static */ let GetKeyboardInput__gQuoteNum: UINT16 = 0;
  export function GetKeyboardInput(puiNewEvent: Pointer<UINT32>): void {
    let InputEvent: InputAtom = createInputAtom();
    let fKeyTaken: boolean = false;
    let MousePos: POINT = createPoint();
    // SOLDIERTYPE				*pSoldier;
    let usMapPos: UINT16 = 0;
    let fGoodCheatLevelKey: boolean = false;

    GetCursorPos(MousePos);

    GetMouseMapPos(
      createPointer(
        () => usMapPos,
        (v) => (usMapPos = v),
      ),
    );

    while (DequeueEvent(InputEvent) == true) {
      // HOOK INTO MOUSE HOOKS
      switch (InputEvent.usEvent) {
        case LEFT_BUTTON_DOWN:
          MouseSystemHook(
            LEFT_BUTTON_DOWN,
            MousePos.x,
            MousePos.y,
            _LeftButtonDown(),
            _RightButtonDown(),
          );
          break;
        case LEFT_BUTTON_UP:
          MouseSystemHook(
            LEFT_BUTTON_UP,
            MousePos.x,
            MousePos.y,
            _LeftButtonDown(),
            _RightButtonDown(),
          );
          break;
        case RIGHT_BUTTON_DOWN:
          MouseSystemHook(
            RIGHT_BUTTON_DOWN,
            MousePos.x,
            MousePos.y,
            _LeftButtonDown(),
            _RightButtonDown(),
          );
          break;
        case RIGHT_BUTTON_UP:
          MouseSystemHook(
            RIGHT_BUTTON_UP,
            MousePos.x,
            MousePos.y,
            _LeftButtonDown(),
            _RightButtonDown(),
          );
          break;
      }

      // handle for fast help text for interface stuff
      if (IsTheInterfaceFastHelpTextActive()) {
        if (InputEvent.usEvent == KEY_UP) {
          ShutDownUserDefineHelpTextRegions();
        }

        continue;
      }

      // Check for waiting for keyboard advance
      if (gfUIWaitingForUserSpeechAdvance && InputEvent.usEvent == KEY_UP) {
        // We have a key, advance!
        DialogueAdvanceSpeech();

        // Ignore anything else
        continue;
      }

      // ATE: if game paused because fo player, unpasue with any key
      if (gfPauseDueToPlayerGamePause && InputEvent.usEvent == KEY_UP) {
        HandlePlayerPauseUnPauseOfGame();

        continue;
      }

      if (InputEvent.usEvent == KEY_DOWN) {
        if (giUIMessageOverlay != -1) {
          EndUIMessage();
          continue;
        }

        // End auto bandage if we want....
        if (gTacticalStatus.fAutoBandageMode) {
          AutoBandage(false);
          puiNewEvent.value = Enum207.LU_ENDUILOCK;
        }
      }

      if (gUIKeyboardHook != null) {
        fKeyTaken = gUIKeyboardHook(InputEvent);
      }
      if (fKeyTaken) {
        continue;
      }

      /*
    if( (InputEvent.usEvent == KEY_DOWN )&& ( InputEvent.usParam == ) )
    {
            HandlePlayerPauseUnPauseOfGame( );
    }
    */

      if (
        InputEvent.usEvent == KEY_UP &&
        InputEvent.usParam == PAUSE &&
        !(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)
      ) {
        // Pause game!
        HandlePlayerPauseUnPauseOfGame();
      }

      // FIRST DO KEYS THAT ARE USED EVERYWHERE!
      if (
        InputEvent.usEvent == KEY_DOWN &&
        InputEvent.usParam == "x".charCodeAt(0) &&
        InputEvent.usKeyState & ALT_DOWN
      ) {
        HandleShortCutExitState();
        //*puiNewEvent = I_EXIT;
      }

      if (InputEvent.usEvent == KEY_UP && InputEvent.usParam == ESC) {
        if (
          AreInMeanwhile() &&
          gCurrentMeanwhileDef.ubMeanwhileID != Enum160.INTERROGATION
        ) {
          DeleteTalkingMenu();
          EndMeanwhile();
        }
      }

      // Break of out IN CONV...
      if (CHEATER_CHEAT_LEVEL()) {
        if (
          InputEvent.usEvent == KEY_DOWN &&
          InputEvent.usParam == ENTER &&
          InputEvent.usKeyState & ALT_DOWN
        ) {
          if (gTacticalStatus.uiFlags & ENGAGED_IN_CONV) {
            gTacticalStatus.uiFlags &= ~ENGAGED_IN_CONV;
            giNPCReferenceCount = 0;
          }
        }
      }

      if (
        gTacticalStatus.uiFlags & TURNBASED &&
        gTacticalStatus.uiFlags & INCOMBAT
      ) {
        {
          if (gTacticalStatus.ubCurrentTeam != gbPlayerNum) {
            if (CHEATER_CHEAT_LEVEL()) {
              if (
                InputEvent.usEvent == KEY_DOWN &&
                InputEvent.usParam == ENTER &&
                InputEvent.usKeyState & ALT_DOWN
              ) {
                // ESCAPE ENEMY'S TURN
                EndAIDeadlock();

                // Decrease global busy  counter...
                gTacticalStatus.ubAttackBusyCount = 0;

                guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
                UIHandleLUIEndLock(null);
              }
              if (
                InputEvent.usEvent == KEY_DOWN &&
                InputEvent.usParam == ENTER &&
                InputEvent.usKeyState & CTRL_DOWN
              ) {
                EscapeUILock();
              }
            }
          } else {
            if (
              CHEATER_CHEAT_LEVEL() &&
              InputEvent.usEvent == KEY_DOWN &&
              InputEvent.usParam == ENTER &&
              InputEvent.usKeyState & CTRL_DOWN
            ) {
              // UNLOCK UI
              EscapeUILock();
            } else if (
              InputEvent.usEvent == KEY_DOWN &&
              InputEvent.usParam == ENTER
            ) {
              // Cycle through enemys
              CycleThroughKnownEnemies();
            }
          }
        }
      }

      if (gfInTalkPanel) {
        HandleTalkingMenuKeys(InputEvent, puiNewEvent);
      }

      // Do some checks based on what mode we are in
      switch (gCurrentUIMode) {
        case Enum206.EXITSECTORMENU_MODE:
          HandleSectorExitMenuKeys(InputEvent, puiNewEvent);
          continue;

        case Enum206.GETTINGITEM_MODE:
          HandleItemMenuKeys(InputEvent, puiNewEvent);
          continue;

        case Enum206.MENU_MODE:
          HandleMenuKeys(InputEvent, puiNewEvent);
          continue;

        case Enum206.OPENDOOR_MENU_MODE:
          HandleOpenDoorMenuKeys(InputEvent, puiNewEvent);
          continue;
      }

      // CHECK ESC KEYS HERE....
      if (InputEvent.usEvent == KEY_DOWN && InputEvent.usParam == ESC) {
        // EscapeUILock( );

        // Cancel out of spread burst...
        gfBeginBurstSpreadTracking = false;
        gfRTClickLeftHoldIntercepted = true;
        if (gusSelectedSoldier != NO_SOLDIER) {
          MercPtrs[gusSelectedSoldier].fDoSpread = 0;
        }

        // Befone anything, delete popup box!
        EndUIMessage();

        // CANCEL FROM PLANNING MODE!
        if (InUIPlanMode()) {
          EndUIPlan();
        }

        if (InItemDescriptionBox()) {
          DeleteItemDescriptionBox();
        } else if (InKeyRingPopup()) {
          DeleteKeyRingPopup();
        }

        if (<UI_MODE>gCurrentUIMode == Enum206.MENU_MODE) {
          // If we get a hit here and we're in menu mode, quit the menu mode
          EndMenuEvent(guiCurrentEvent);
        }

        if (gCurrentUIMode == Enum206.HANDCURSOR_MODE) {
          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
        }

        if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
          if (gusSelectedSoldier != NO_SOLDIER) {
            // If soldier is not stationary, stop
            StopSoldier(MercPtrs[gusSelectedSoldier]);
            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
          }
          // ATE: OK, stop any mercs who are moving by selection method....
          StopRubberBandedMercFromMoving();
        }
      }

      // CHECK ESC KEYS HERE....
      if (InputEvent.usEvent == KEY_DOWN && InputEvent.usParam == BACKSPACE) {
        StopAnyCurrentlyTalkingSpeech();
      }

      // IF UI HAS LOCKED, ONLY ALLOW EXIT!
      if (gfDisableRegionActive || gfUserTurnRegionActive) {
        continue;
      }

      // Check all those we want if enemy's turn
      if (
        InputEvent.usEvent == KEY_UP &&
        InputEvent.usParam == "q".charCodeAt(0)
      ) {
        if (InputEvent.usKeyState & ALT_DOWN) {
          if (CHEATER_CHEAT_LEVEL()) {
            let x: INT32;
            let usType: UINT16;

            // Toggle removal of roofs...
            GetKeyboardInput__fShowRoofs = !GetKeyboardInput__fShowRoofs;

            for (x = 0; x < WORLD_MAX; x++) {
              for (
                usType = Enum313.FIRSTROOF;
                usType <= LASTSLANTROOF;
                usType++
              ) {
                HideStructOfGivenType(x, usType, !GetKeyboardInput__fShowRoofs);
              }
            }
            InvalidateWorldRedundency();
            SetRenderFlags(RENDER_FLAG_FULL);
          }
        } else if (InputEvent.usKeyState & CTRL_DOWN) {
        } else {
          if (INFORMATION_CHEAT_LEVEL()) {
            puiNewEvent.value = Enum207.I_SOLDIERDEBUG;
          }
        }
      }

      if (InputEvent.usEvent == KEY_DOWN) {
        let fAlt: boolean;
        let fCtrl: boolean;
        let fShift: boolean;
        fAlt = InputEvent.usKeyState & ALT_DOWN ? true : false;
        fCtrl = InputEvent.usKeyState & CTRL_DOWN ? true : false;
        fShift = InputEvent.usKeyState & SHIFT_DOWN ? true : false;
        switch (InputEvent.usParam) {
          case SPACE:
            // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
            if (
              !(gTacticalStatus.uiFlags & ENGAGED_IN_CONV) &&
              (gsCurInterfacePanel != Enum215.SM_PANEL ||
                ButtonList[iSMPanelButtons[Enum220.NEXTMERC_BUTTON]].uiFlags &
                  BUTTON_ENABLED)
            ) {
              if (!InKeyRingPopup()) {
                if (_KeyDown(SHIFT)) {
                  let pNewSoldier: SOLDIERTYPE;
                  let iCurrentSquad: INT32;

                  if (gusSelectedSoldier != NO_SOLDIER) {
                    // only allow if nothing in hand and if in SM panel, the Change Squad button must be enabled
                    if (
                      gsCurInterfacePanel != Enum215.TEAM_PANEL ||
                      ButtonList[iTEAMPanelButtons[Enum221.CHANGE_SQUAD_BUTTON]]
                        .uiFlags & BUTTON_ENABLED
                    ) {
                      // Select next squad
                      iCurrentSquad = CurrentSquad();

                      pNewSoldier = FindNextActiveSquad(
                        MercPtrs[gusSelectedSoldier],
                      );

                      if (pNewSoldier.bAssignment != iCurrentSquad) {
                        HandleLocateSelectMerc(
                          pNewSoldier.ubID,
                          LOCATEANDSELECT_MERC,
                        );

                        ScreenMsg(
                          FONT_MCOLOR_LTYELLOW,
                          MSG_INTERFACE,
                          pMessageStrings[Enum333.MSG_SQUAD_ACTIVE],
                          CurrentSquad() + 1,
                        );

                        // Center to guy....
                        LocateSoldier(gusSelectedSoldier, SETLOCATOR);
                      }
                    }
                  }
                } else {
                  if (gusSelectedSoldier != NO_SOLDIER) {
                    // Select next merc
                    let bID: UINT8;

                    bID = FindNextMercInTeamPanel(
                      MercPtrs[gusSelectedSoldier],
                      false,
                      false,
                    );
                    HandleLocateSelectMerc(bID, LOCATEANDSELECT_MERC);

                    // Center to guy....
                    LocateSoldier(gusSelectedSoldier, SETLOCATOR);
                  }
                }

                puiNewEvent.value = Enum207.M_ON_TERRAIN;
              }
            }
            break;
          case TAB:
            // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
            if (
              gpItemPointer == null &&
              (gsCurInterfacePanel != Enum215.SM_PANEL ||
                ButtonList[iSMPanelButtons[Enum220.UPDOWN_BUTTON]].uiFlags &
                  BUTTON_ENABLED)
            ) {
              UIHandleChangeLevel(null);

              if (gsCurInterfacePanel == Enum215.SM_PANEL) {
                // Remember soldier's new value
                gpSMCurrentMerc.bUIInterfaceLevel = gsInterfaceLevel;
              }
            }
            break;

          case F1:
            if (fShift) {
              HandleSelectMercSlot(0, LOCATE_MERC_ONCE);
            } else HandleSelectMercSlot(0, LOCATEANDSELECT_MERC);
            break;
          case F2:
            if (fShift) HandleSelectMercSlot(1, LOCATE_MERC_ONCE);
            else HandleSelectMercSlot(1, LOCATEANDSELECT_MERC);
            break;
          case F3:
            if (fShift) HandleSelectMercSlot(2, LOCATE_MERC_ONCE);
            else HandleSelectMercSlot(2, LOCATEANDSELECT_MERC);
            break;
          case F4:
            if (fShift) HandleSelectMercSlot(3, LOCATE_MERC_ONCE);
            else HandleSelectMercSlot(3, LOCATEANDSELECT_MERC);
            break;
          case F5:
            if (fShift) HandleSelectMercSlot(4, LOCATE_MERC_ONCE);
            else HandleSelectMercSlot(4, LOCATEANDSELECT_MERC);
            break;
          case F6:
            if (fShift) HandleSelectMercSlot(5, LOCATE_MERC_ONCE);
            else HandleSelectMercSlot(5, LOCATEANDSELECT_MERC);
            break;

          case F11:
            if (fAlt) {
            } else {
              if (DEBUG_CHEAT_LEVEL()) {
                GetMouseMapPos(gsQdsEnteringGridNo__Pointer);
                LeaveTacticalScreen(Enum26.QUEST_DEBUG_SCREEN);
              }
            }
            break;

          case F12:
            // clear tactical of messages
            if (fCtrl) {
              ClearTacticalMessageQueue();
            } else if (!fAlt) {
              ClearDisplayedListOfTacticalStrings();
            }
            break;

          case "1".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                // ChangeSoldiersBodyType( TANK_NW, TRUE );
                // MercPtrs[ gusSelectedSoldier ]->uiStatusFlags |= SOLDIER_CREATURE;
                // EVENT_InitNewSoldierAnim( MercPtrs[ gusSelectedSoldier ], CRIPPLE_BEG, 0 , TRUE );
              }
            } else ChangeCurrentSquad(0);
            break;

          case "2".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                ChangeSoldiersBodyType(Enum194.INFANT_MONSTER, true);
              }
            } else if (fCtrl) {
              // toggle between the different npc debug modes
              if (CHEATER_CHEAT_LEVEL()) {
                ToggleQuestDebugModes(Enum299.QD_NPC_MSG);
              }
            } else ChangeCurrentSquad(1);
            break;

          case "3".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                EVENT_InitNewSoldierAnim(
                  MercPtrs[gusSelectedSoldier],
                  Enum193.KID_SKIPPING,
                  0,
                  true,
                );

                // ChangeSoldiersBodyType( LARVAE_MONSTER, TRUE );
                // MercPtrs[ gusSelectedSoldier ]->usAttackingWeapon = TANK_CANNON;
                // LocateSoldier( gusSelectedSoldier, FALSE );
                // EVENT_FireSoldierWeapon( MercPtrs[ gusSelectedSoldier ], usMapPos );
              }
            } else ChangeCurrentSquad(2);

            break;

          case "4".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                ChangeSoldiersBodyType(Enum194.CRIPPLECIV, true);
              }
            } else ChangeCurrentSquad(3);

            // ChangeSoldiersBodyType( BLOODCAT, FALSE );
            break;

          case "5".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                ChangeSoldiersBodyType(Enum194.YAM_MONSTER, true);
              }
            } else ChangeCurrentSquad(4);
            break;

          case "6".charCodeAt(0):
            ChangeCurrentSquad(5);
            break;

          case "7".charCodeAt(0):
            ChangeCurrentSquad(6);
            break;

          case "8".charCodeAt(0):
            ChangeCurrentSquad(7);
            break;

          case "9".charCodeAt(0):
            ChangeCurrentSquad(8);
            break;

          case "0".charCodeAt(0):
            ChangeCurrentSquad(9);
            break;

          case "x".charCodeAt(0):
            if (!fCtrl && !fAlt) {
              // Exchange places...
              let pSoldier1: SOLDIERTYPE;
              let pSoldier2: SOLDIERTYPE;

              // Check if we have a good selected guy
              if (gusSelectedSoldier != NOBODY) {
                pSoldier1 = MercPtrs[gusSelectedSoldier];

                if (gfUIFullTargetFound) {
                  // Get soldier...
                  pSoldier2 = MercPtrs[gusUIFullTargetID];

                  // Check if both OK....
                  if (
                    pSoldier1.bLife >= OKLIFE &&
                    pSoldier2.ubID != gusSelectedSoldier
                  ) {
                    if (pSoldier2.bLife >= OKLIFE) {
                      if (
                        CanSoldierReachGridNoInGivenTileLimit(
                          pSoldier1,
                          pSoldier2.sGridNo,
                          1,
                          gsInterfaceLevel,
                        )
                      ) {
                        // Exclude enemies....
                        if (
                          !pSoldier2.bNeutral &&
                          pSoldier2.bSide != gbPlayerNum
                        ) {
                        } else {
                          if (CanExchangePlaces(pSoldier1, pSoldier2, true)) {
                            // All's good!
                            SwapMercPositions(pSoldier1, pSoldier2);

                            DeductPoints(pSoldier1, AP_EXCHANGE_PLACES, 0);
                            DeductPoints(pSoldier2, AP_EXCHANGE_PLACES, 0);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            break;

          case "/".charCodeAt(0):
            // Center to guy....
            if (gusSelectedSoldier != NOBODY) {
              LocateSoldier(gusSelectedSoldier, 10);
            }
            break;

          case "a".charCodeAt(0):
            if (fCtrl) {
              // FIXME: Language-specific code
              // #ifdef GERMAN
              //             if (gubCheatLevel == 3) {
              //               gubCheatLevel++;
              //               fGoodCheatLevelKey = TRUE;
              //             } else if (gubCheatLevel == 5) {
              //               gubCheatLevel++;
              //               // ATE; We're done.... start cheat mode....
              //               ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[MSG_CHEAT_LEVEL_TWO]);
              //               SetHistoryFact(HISTORY_CHEAT_ENABLED, 0, GetWorldTotalMin(), -1, -1);
              //             } else {
              //               RESET_CHEAT_LEVEL();
              //             }
              // #else
              if (gubCheatLevel == 1) {
                gubCheatLevel++;
                fGoodCheatLevelKey = true;
              } else {
                RESET_CHEAT_LEVEL();
              }
              // #endif
            } else if (fAlt) {
            } else {
              BeginAutoBandage();
            }
            break;

          case "j".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                gfNextFireJam = true;
              }
            } else if (fCtrl) {
            }
            break;

          case "b".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                puiNewEvent.value = Enum207.I_NEW_BADMERC;
              }
            } else if (fCtrl) {
              // FIXME: Language-specific code
              // #ifndef GERMAN
              if (gubCheatLevel == 2) {
                gubCheatLevel++;
                fGoodCheatLevelKey = true;
              } else if (gubCheatLevel == 3) {
                gubCheatLevel++;
                fGoodCheatLevelKey = true;
              } else if (gubCheatLevel == 5) {
                gubCheatLevel++;
                fGoodCheatLevelKey = true;
              } else {
                RESET_CHEAT_LEVEL();
              }
              // #else
              //             if (gubCheatLevel == 6) {
              //               gubCheatLevel++;
              //               fGoodCheatLevelKey = TRUE;
              //             } else {
              //               RESET_CHEAT_LEVEL();
              //             }
              // #endif
              // gGameSettings.fOptions[ TOPTION_HIDE_BULLETS ] ^= TRUE;
            } else {
              // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
              if (
                gpItemPointer == null &&
                (gsCurInterfacePanel != Enum215.SM_PANEL ||
                  ButtonList[iSMPanelButtons[Enum220.BURSTMODE_BUTTON]]
                    .uiFlags & BUTTON_ENABLED)
              ) {
                SetBurstMode();
              }
            }
            break;
          case "c".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                CreateNextCivType();
              }
            } else if (fCtrl) {
              if (CHEATER_CHEAT_LEVEL()) {
                ToggleCliffDebug();
              }
            } else {
              HandleStanceChangeFromUIKeys(ANIM_CROUCH);
            }
            break;

          case "d".charCodeAt(0):
            if (
              gTacticalStatus.uiFlags & TURNBASED &&
              gTacticalStatus.uiFlags & INCOMBAT
            ) {
              if (gTacticalStatus.ubCurrentTeam == gbPlayerNum) {
                // nothing in hand and the Done button for whichever panel we're in must be enabled
                if (
                  gpItemPointer == null &&
                  !gfDisableTacticalPanelButtons &&
                  ((gsCurInterfacePanel == Enum215.SM_PANEL &&
                    ButtonList[iSMPanelButtons[Enum220.SM_DONE_BUTTON]]
                      .uiFlags & BUTTON_ENABLED) ||
                    (gsCurInterfacePanel == Enum215.TEAM_PANEL &&
                      ButtonList[iTEAMPanelButtons[Enum221.TEAM_DONE_BUTTON]]
                        .uiFlags & BUTTON_ENABLED))
                ) {
                  if (fAlt) {
                    let cnt: INT32;
                    let pSoldier: SOLDIERTYPE;

                    if (CHEATER_CHEAT_LEVEL()) {
                      for (
                        pSoldier = MercPtrs[gbPlayerNum], cnt = 0;
                        cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
                        cnt++, pSoldier = MercPtrs[gbPlayerNum]
                      ) {
                        if (pSoldier.bActive && pSoldier.bLife > 0) {
                          // Get APs back...
                          CalcNewActionPoints(pSoldier);

                          fInterfacePanelDirty = DIRTYLEVEL2;
                        }
                      }
                    }
                  } // End turn only if in combat and it is the player's turn
                  else puiNewEvent.value = Enum207.I_ENDTURN;
                }
              }
            }
            break;

          case "e".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                ToggleViewAllMercs();
                ToggleViewAllItems();
              }
            } else {
              let pSoldier: SOLDIERTYPE;

              if (gusSelectedSoldier != NOBODY) {
                pSoldier = MercPtrs[gusSelectedSoldier];

                if (pSoldier.bOppCnt > 0) {
                  // Cycle....
                  CycleVisibleEnemies(pSoldier);
                } else {
                  ScreenMsg(
                    FONT_MCOLOR_LTYELLOW,
                    MSG_UI_FEEDBACK,
                    TacticalStr[Enum335.NO_ENEMIES_IN_SIGHT_STR],
                  );
                }
              }
            }
            break;

          case "f".charCodeAt(0):
            if (fCtrl) {
              if (INFORMATION_CHEAT_LEVEL()) {
                // Toggle Frame Rate Display
                gbFPSDisplay = Number(!gbFPSDisplay);
                DisableFPSOverlay(!gbFPSDisplay);
                if (!gbFPSDisplay) SetRenderFlags(RENDER_FLAG_FULL);
              }
            } else if (fAlt) {
              if (gGameSettings.fOptions[Enum8.TOPTION_TRACKING_MODE]) {
                gGameSettings.fOptions[Enum8.TOPTION_TRACKING_MODE] = false;

                ScreenMsg(
                  FONT_MCOLOR_LTYELLOW,
                  MSG_INTERFACE,
                  pMessageStrings[Enum333.MSG_TACKING_MODE_OFF],
                );
              } else {
                gGameSettings.fOptions[Enum8.TOPTION_TRACKING_MODE] = true;

                ScreenMsg(
                  FONT_MCOLOR_LTYELLOW,
                  MSG_INTERFACE,
                  pMessageStrings[Enum333.MSG_TACKING_MODE_ON],
                );
              }
            } else {
              let sGridNo: INT16 = 0;

              // Get the gridno the cursor is at
              GetMouseMapPos(
                createPointer(
                  () => sGridNo,
                  (v) => (sGridNo = v),
                ),
              );

              // if there is a selected soldier, and the cursor location is valid
              if (gusSelectedSoldier != NOBODY && sGridNo != NOWHERE) {
                // if the cursor is over someone
                if (gfUIFullTargetFound) {
                  // Display the range to the target
                  DisplayRangeToTarget(
                    MercPtrs[gusSelectedSoldier],
                    MercPtrs[gusUIFullTargetID].sGridNo,
                  );
                } else {
                  // Display the range to the target
                  DisplayRangeToTarget(MercPtrs[gusSelectedSoldier], sGridNo);
                }
              }
            }
            break;

          case "g".charCodeAt(0):
            if (fCtrl) {
              // FIXME: Language-specific code
              // #ifdef GERMAN
              //             if (gubCheatLevel == 1) {
              //               gubCheatLevel++;
              //               fGoodCheatLevelKey = TRUE;
              //             } else {
              //               RESET_CHEAT_LEVEL();
              //             }
              // #else
              if (gubCheatLevel == 0) {
                gubCheatLevel++;
                fGoodCheatLevelKey = true;
              } else {
                RESET_CHEAT_LEVEL();
              }
              // #endif
            } else if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                puiNewEvent.value = Enum207.I_NEW_MERC;
              }
            } else {
              HandlePlayerTogglingLightEffects(true);
            }
            break;
          case "H".charCodeAt(0):
          case "h".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                if (gfReportHitChances) {
                  gfReportHitChances = false;
                } else {
                  gfReportHitChances = true;
                }
              }
            } else if (fCtrl) {
              if (CHEATER_CHEAT_LEVEL()) {
                puiNewEvent.value = Enum207.I_TESTHIT;
              }
            } else {
              ShouldTheHelpScreenComeUp(Enum17.HELP_SCREEN_TACTICAL, true);
            }
            break;

          case "i".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                CreateRandomItem();
              }
            } else if (fCtrl) {
              // FIXME: Language-specific code
              // #ifdef GERMAN
              //             if (gubCheatLevel == 0) {
              //               fGoodCheatLevelKey = TRUE;
              //               gubCheatLevel++;
              //             }
              // #else
              if (gubCheatLevel == 4) {
                gubCheatLevel++;
                fGoodCheatLevelKey = true;
                // ATE; We're done.... start cheat mode....
                ScreenMsg(
                  FONT_MCOLOR_LTYELLOW,
                  MSG_INTERFACE,
                  pMessageStrings[Enum333.MSG_CHEAT_LEVEL_TWO],
                );
                SetHistoryFact(
                  Enum83.HISTORY_CHEAT_ENABLED,
                  0,
                  GetWorldTotalMin(),
                  -1,
                  -1,
                );
              } else {
                RESET_CHEAT_LEVEL();
              }
              // #endif
            } else {
              if (gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS]) {
                gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS] = false;
                ToggleItemGlow(false);
              } else {
                gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS] = true;
                ToggleItemGlow(true);
              }
            }
            break;

          case "$".charCodeAt(0):
            break;

          case "k".charCodeAt(0):
            if (fAlt) {
              if (fCtrl) {
                if (CHEATER_CHEAT_LEVEL()) {
                  // next shot by anybody is auto kill
                  if (gfNextShotKills) {
                    gfNextShotKills = false;
                  } else {
                    gfNextShotKills = true;
                  }
                }
              } else {
                if (CHEATER_CHEAT_LEVEL()) {
                  GrenadeTest1();
                }
              }
            } else if (fCtrl) {
              if (CHEATER_CHEAT_LEVEL()) {
                GrenadeTest2();
              }
            } else {
              BeginKeyPanelFromKeyShortcut();
            }
            break;

          case INSERT:
            GoIntoOverheadMap();
            break;

          case END:
            if (gusSelectedSoldier != NOBODY) {
              if (CheckForMercContMove(MercPtrs[gusSelectedSoldier])) {
                // Continue
                ContinueMercMovement(MercPtrs[gusSelectedSoldier]);
                ErasePath(true);
              }
            }
            break;

          case HOME:
            if (gGameSettings.fOptions[Enum8.TOPTION_3D_CURSOR]) {
              gGameSettings.fOptions[Enum8.TOPTION_3D_CURSOR] = false;

              ScreenMsg(
                FONT_MCOLOR_LTYELLOW,
                MSG_INTERFACE,
                pMessageStrings[Enum333.MSG_3DCURSOR_OFF],
              );
            } else {
              gGameSettings.fOptions[Enum8.TOPTION_3D_CURSOR] = true;

              ScreenMsg(
                FONT_MCOLOR_LTYELLOW,
                MSG_INTERFACE,
                pMessageStrings[Enum333.MSG_3DCURSOR_ON],
              );
            }
            break;

          case "l".charCodeAt(0):
            if (fAlt) {
              if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
                LeaveTacticalScreen(Enum26.GAME_SCREEN);

                DoQuickLoad();
              }
            } else if (fCtrl) {
              if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
                gfSaveGame = false;
                gfCameDirectlyFromGame = true;

                guiPreviousOptionScreen = Enum26.GAME_SCREEN;
                LeaveTacticalScreen(Enum26.SAVE_LOAD_SCREEN);
              }
              /*
                                                            if ( INFORMATION_CHEAT_LEVEL( ) )
                                                            {
                                                                    *puiNewEvent = I_LEVELNODEDEBUG;
                                                                    CountLevelNodes();
                                                            }
            */
            } else {
              // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
              if (
                gpItemPointer == null &&
                (gsCurInterfacePanel != Enum215.SM_PANEL ||
                  ButtonList[iSMPanelButtons[Enum220.LOOK_BUTTON]].uiFlags &
                    BUTTON_ENABLED)
              ) {
                puiNewEvent.value = Enum207.LC_CHANGE_TO_LOOK;
              }
            }
            break;
          case "m".charCodeAt(0):
            if (fAlt) {
              if (INFORMATION_CHEAT_LEVEL()) {
                puiNewEvent.value = Enum207.I_LEVELNODEDEBUG;
                CountLevelNodes();
              }
            } else if (fCtrl) {
              if (INFORMATION_CHEAT_LEVEL()) {
                // display memory usage
              }
            } else {
              // nothing in hand and the Map Screen button for whichever panel we're in must be enabled
              if (
                gpItemPointer == null &&
                !gfDisableTacticalPanelButtons &&
                ((gsCurInterfacePanel == Enum215.SM_PANEL &&
                  ButtonList[iSMPanelButtons[Enum220.SM_MAP_SCREEN_BUTTON]]
                    .uiFlags & BUTTON_ENABLED) ||
                  (gsCurInterfacePanel == Enum215.TEAM_PANEL &&
                    ButtonList[
                      iTEAMPanelButtons[Enum221.TEAM_MAP_SCREEN_BUTTON]
                    ].uiFlags & BUTTON_ENABLED))
              ) {
                // go to Map screen
                if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
                  GoToMapScreenFromTactical();
                }
              }
            }
            break;

          case PGDN:
            if (CHEATER_CHEAT_LEVEL()) {
              if (fCtrl) AttemptToChangeFloorLevel(+1); // try to enter a lower underground level
            }

            if (guiCurrentScreen != Enum26.DEBUG_SCREEN) {
              if (gusSelectedSoldier != NOBODY) {
                // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
                if (gpItemPointer == null) {
                  GotoLowerStance(MercPtrs[gusSelectedSoldier]);
                }
              }
            }
            break;

          case PGUP:
            if (CHEATER_CHEAT_LEVEL()) {
              if (fCtrl) AttemptToChangeFloorLevel(-1); // try to go up towards ground level
            }

            if (guiCurrentScreen != Enum26.DEBUG_SCREEN) {
              if (gusSelectedSoldier != NOBODY) {
                // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
                if (gpItemPointer == null) {
                  GotoHeigherStance(MercPtrs[gusSelectedSoldier]);
                }
              }
            }
            break;

          case "*".charCodeAt(0):
            if (gTacticalStatus.uiFlags & RED_ITEM_GLOW_ON) {
              gTacticalStatus.uiFlags &= ~RED_ITEM_GLOW_ON;
            } else {
              gTacticalStatus.uiFlags |= RED_ITEM_GLOW_ON;
            }
            break;

          case "n".charCodeAt(0):
            if (fAlt) {
              if (INFORMATION_CHEAT_LEVEL()) {
                if (gfUIFullTargetFound) {
                  TacticalCharacterDialogue(
                    MercPtrs[gusUIFullTargetID],
                    GetKeyboardInput__gQuoteNum,
                  );
                  GetKeyboardInput__gQuoteNum++;
                }
              }
            } else if (fCtrl) {
              // FIXME: Language-specific code
              // #ifdef GERMAN
              //             if (gubCheatLevel == 4) {
              //               fGoodCheatLevelKey = TRUE;
              //               gubCheatLevel++;
              //             } else {
              //               RESET_CHEAT_LEVEL();
              //             }
              // #endif
            } else if (!CycleSoldierFindStack(usMapPos))
              // Are we over a merc stack?
              CycleIntTileFindStack(usMapPos); // If not, now check if we are over a struct stack
            break;

          case "o".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                gStrategicStatus.usPlayerKills += NumEnemiesInAnySector(
                  gWorldSectorX,
                  gWorldSectorY,
                  gbWorldSectorZ,
                );
                ObliterateSector();
              }
            } else if (fCtrl) {
              if (CHEATER_CHEAT_LEVEL()) {
                CreatePlayerControlledMonster();
              }
            } else {
              // nothing in hand and the Options Screen button for whichever panel we're in must be enabled
              if (
                gpItemPointer == null &&
                !gfDisableTacticalPanelButtons &&
                (gsCurInterfacePanel != Enum215.SM_PANEL ||
                  ButtonList[iSMPanelButtons[Enum220.OPTIONS_BUTTON]].uiFlags &
                    BUTTON_ENABLED)
              ) {
                if (!fDisableMapInterfaceDueToBattle) {
                  // go to Options screen
                  guiPreviousOptionScreen = Enum26.GAME_SCREEN;
                  LeaveTacticalScreen(Enum26.OPTIONS_SCREEN);
                }
              }
            }
            break;

          case "p".charCodeAt(0):
            HandleStanceChangeFromUIKeys(ANIM_PRONE);
            break;

          case "r".charCodeAt(0):
            if (gusSelectedSoldier != NO_SOLDIER) {
              if (fAlt) {
                // reload selected merc's weapon
                if (CHEATER_CHEAT_LEVEL()) {
                  ReloadWeapon(
                    MercPtrs[gusSelectedSoldier],
                    MercPtrs[gusSelectedSoldier].ubAttackingHand,
                  );
                }
              } else if (fCtrl) {
                if (INFORMATION_CHEAT_LEVEL()) {
                  DoChrisTest(MercPtrs[gusSelectedSoldier]);
                }
              } else {
                if (
                  !MercInWater(MercPtrs[gusSelectedSoldier]) &&
                  !(MercPtrs[gusSelectedSoldier].uiStatusFlags & SOLDIER_ROBOT)
                ) {
                  // change selected merc to run
                  if (
                    MercPtrs[gusSelectedSoldier].usUIMovementMode !=
                      Enum193.WALKING &&
                    MercPtrs[gusSelectedSoldier].usUIMovementMode !=
                      Enum193.RUNNING
                  ) {
                    UIHandleSoldierStanceChange(gusSelectedSoldier, ANIM_STAND);
                    MercPtrs[gusSelectedSoldier].fUIMovementFast = true;
                  } else {
                    MercPtrs[gusSelectedSoldier].fUIMovementFast = true;
                    MercPtrs[gusSelectedSoldier].usUIMovementMode =
                      Enum193.RUNNING;
                    gfPlotNewMovement = true;
                  }
                }
              }
            }
            break;
          case "s".charCodeAt(0):
            if (fCtrl) {
              if (
                !fDisableMapInterfaceDueToBattle &&
                !(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)
              ) {
                // if the game CAN be saved
                if (CanGameBeSaved()) {
                  gfSaveGame = true;
                  gfCameDirectlyFromGame = true;

                  guiPreviousOptionScreen = Enum26.GAME_SCREEN;
                  LeaveTacticalScreen(Enum26.SAVE_LOAD_SCREEN);
                } else {
                  // Display a message saying the player cant save now
                  DoMessageBox(
                    Enum24.MSG_BOX_BASIC_STYLE,
                    zNewTacticalMessages[
                      Enum320.TCTL_MSG__IRON_MAN_CANT_SAVE_NOW
                    ],
                    Enum26.GAME_SCREEN,
                    MSG_BOX_FLAG_OK,
                    null,
                    null,
                  );
                }
              }
            } else if (fAlt) {
              if (
                !fDisableMapInterfaceDueToBattle &&
                !(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)
              ) {
                // if the game CAN be saved
                if (CanGameBeSaved()) {
                  guiPreviousOptionScreen = Enum26.GAME_SCREEN;
                  // guiPreviousOptionScreen = guiCurrentScreen;
                  DoQuickSave();
                } else {
                  // Display a message saying the player cant save now
                  DoMessageBox(
                    Enum24.MSG_BOX_BASIC_STYLE,
                    zNewTacticalMessages[
                      Enum320.TCTL_MSG__IRON_MAN_CANT_SAVE_NOW
                    ],
                    Enum26.GAME_SCREEN,
                    MSG_BOX_FLAG_OK,
                    null,
                    null,
                  );
                }
              }
            } else if (gusSelectedSoldier != NOBODY) {
              gfPlotNewMovement = true;
              HandleStanceChangeFromUIKeys(ANIM_STAND);
            }
            break;

          case "t".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                TeleportSelectedSoldier();
              }
            } else if (fCtrl) {
              if (CHEATER_CHEAT_LEVEL()) {
                TestCapture();

                // EnterCombatMode( gbPlayerNum );
              }
            } else ToggleTreeTops();
            break;

          case "=".charCodeAt(0):
            // if the display cover or line of sight is being displayed
            if (_KeyDown(END) || _KeyDown(DEL)) {
              if (_KeyDown(DEL))
                ChangeSizeOfDisplayCover(
                  gGameSettings.ubSizeOfDisplayCover + 1,
                );

              if (_KeyDown(END)) ChangeSizeOfLOS(gGameSettings.ubSizeOfLOS + 1);
            } else {
              // ATE: This key will select everybody in the sector
              if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
                let pSoldier: SOLDIERTYPE;
                let cnt: INT32;

                cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
                for (
                  pSoldier = MercPtrs[cnt];
                  cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
                  cnt++, pSoldier = MercPtrs[cnt]
                ) {
                  // Check if this guy is OK to control....
                  if (
                    OK_CONTROLLABLE_MERC(pSoldier) &&
                    !(
                      pSoldier.uiStatusFlags &
                      (SOLDIER_VEHICLE | SOLDIER_PASSENGER | SOLDIER_DRIVER)
                    )
                  ) {
                    pSoldier.uiStatusFlags |= SOLDIER_MULTI_SELECTED;
                  }
                }
                EndMultiSoldierSelection(true);
              }
            }
            break;

          case "u".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                RefreshSoldier();
              }
            } else if (fCtrl) {
              let cnt: INT32;
              let pSoldier: SOLDIERTYPE;

              // FIXME: Language-specific code
              // #ifdef GERMAN
              //             if (gubCheatLevel == 2) {
              //               fGoodCheatLevelKey = TRUE;
              //               gubCheatLevel++;
              //             } else {
              //               RESET_CHEAT_LEVEL();
              //             }
              // #endif

              if (CHEATER_CHEAT_LEVEL() && gusSelectedSoldier != NOBODY) {
                for (
                  pSoldier = MercPtrs[gbPlayerNum], cnt = 0;
                  cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
                  cnt++, pSoldier = MercPtrs[gbPlayerNum]
                ) {
                  if (pSoldier.bActive && pSoldier.bLife > 0) {
                    // Get breath back
                    pSoldier.bBreath = pSoldier.bBreathMax;

                    // Get life back
                    pSoldier.bLife = pSoldier.bLifeMax;
                    pSoldier.bBleeding = 0;

                    fInterfacePanelDirty = DIRTYLEVEL2;
                  }
                }
              }
            } else if (gusSelectedSoldier != NO_SOLDIER)
              puiNewEvent.value = Enum207.M_CHANGE_TO_ACTION;
            break;

          case "v".charCodeAt(0):
            if (fAlt) {
            } else if (fCtrl) {
            } else DisplayGameSettings();

            break;
          case "w".charCodeAt(0):
          case "W".charCodeAt(0):
            if (fAlt) {
              if (CHEATER_CHEAT_LEVEL()) {
                if (InItemDescriptionBox()) {
                  // Swap item in description panel...
                  CycleItemDescriptionItem();
                } else {
                  CycleSelectedMercsItem();
                }
              }
            } else if (fCtrl) {
              if (CHEATER_CHEAT_LEVEL()) {
                if (gusSelectedSoldier != NOBODY) {
                  CreateItem(
                    Enum225.FLAMETHROWER,
                    100,
                    MercPtrs[gusSelectedSoldier].inv[Enum261.HANDPOS],
                  );
                }
              }
            } else ToggleWireFrame();
            break;

          case "y".charCodeAt(0):
            if (fAlt) {
              let Object: OBJECTTYPE = createObjectType();
              let pSoldier: SOLDIERTYPE | null;

              if (CHEATER_CHEAT_LEVEL()) {
                QuickCreateProfileMerc(CIV_TEAM, Enum268.MARIA); // Ira

                // Recruit!
                RecruitEPC(Enum268.MARIA);
              }

              // Create object and set
              CreateItem(Enum225.G41, 100, Object);

              pSoldier = <SOLDIERTYPE>(
                FindSoldierByProfileID(Enum268.ROBOT, false)
              );

              AutoPlaceObject(pSoldier, Object, false);
            } else {
              if (INFORMATION_CHEAT_LEVEL()) {
                puiNewEvent.value = Enum207.I_LOSDEBUG;
              }
            }
            // else if( gusSelectedSoldier != NO_SOLDIER )
            break;
          case "z".charCodeAt(0):
            if (fCtrl) {
              if (INFORMATION_CHEAT_LEVEL()) {
                ToggleZBuffer();
              }
            } else if (fAlt) {
              // Toggle squad's stealth mode.....
              // For each guy on squad...
              {
                let pTeamSoldier: SOLDIERTYPE;
                let bLoop: INT8;
                let fStealthOn: boolean = false;

                // Check if at least one guy is on stealth....
                for (
                  bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID,
                    pTeamSoldier = MercPtrs[bLoop];
                  bLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID;
                  bLoop++, pTeamSoldier = MercPtrs[bLoop]
                ) {
                  if (
                    OK_CONTROLLABLE_MERC(pTeamSoldier) &&
                    pTeamSoldier.bAssignment == CurrentSquad()
                  ) {
                    if (pTeamSoldier.bStealthMode) {
                      fStealthOn = true;
                    }
                  }
                }

                fStealthOn = !fStealthOn;

                for (
                  bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID,
                    pTeamSoldier = MercPtrs[bLoop];
                  bLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID;
                  bLoop++, pTeamSoldier = MercPtrs[bLoop]
                ) {
                  if (
                    OK_CONTROLLABLE_MERC(pTeamSoldier) &&
                    pTeamSoldier.bAssignment == CurrentSquad() &&
                    !AM_A_ROBOT(pTeamSoldier)
                  ) {
                    if (
                      gpSMCurrentMerc != null &&
                      bLoop == gpSMCurrentMerc.ubID
                    ) {
                      gfUIStanceDifferent = true;
                    }

                    pTeamSoldier.bStealthMode = fStealthOn;
                  }
                }

                fInterfacePanelDirty = DIRTYLEVEL2;

                // OK, display message
                if (fStealthOn) {
                  ScreenMsg(
                    FONT_MCOLOR_LTYELLOW,
                    MSG_INTERFACE,
                    pMessageStrings[Enum333.MSG_SQUAD_ON_STEALTHMODE],
                  );
                } else {
                  ScreenMsg(
                    FONT_MCOLOR_LTYELLOW,
                    MSG_INTERFACE,
                    pMessageStrings[Enum333.MSG_SQUAD_OFF_STEALTHMODE],
                  );
                }
              }
            } else {
              // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
              if (gpItemPointer == null) {
                HandleStealthChangeFromUIKeys();
              }
            }
            break;

          case "-".charCodeAt(0):
          case "_".charCodeAt(0):
            // if the display cover or line of sight is being displayed
            if (_KeyDown(END) || _KeyDown(DEL)) {
              if (_KeyDown(DEL))
                ChangeSizeOfDisplayCover(
                  gGameSettings.ubSizeOfDisplayCover - 1,
                );

              if (_KeyDown(END)) ChangeSizeOfLOS(gGameSettings.ubSizeOfLOS - 1);
            } else {
              if (fAlt) {
                if (MusicGetVolume() >= 20)
                  MusicSetVolume(MusicGetVolume() - 20);
                else MusicSetVolume(0);
              } else if (fCtrl) {
              } else {
              }
            }
            break;
          case "+".charCodeAt(0):
            break;
          case "`".charCodeAt(0):
            // Switch panels...
            {
              ToggleTacticalPanels();

              if (CHEATER_CHEAT_LEVEL()) {
                // EnvBeginRainStorm( 1 );
              }
            }
            break;
        }

        // FIXME: Language-specific code
        // #ifdef GERMAN
        //       if (!fGoodCheatLevelKey && gubCheatLevel < 5) {
        //         RESET_CHEAT_LEVEL();
        //       }
        // #else
        if (!fGoodCheatLevelKey && gubCheatLevel < 4) {
          RESET_CHEAT_LEVEL();
        }
        // #endif
      }
    }
  }

  function HandleTalkingMenuKeys(
    pInputEvent: InputAtom,
    puiNewEvent: Pointer<UINT32>,
  ): void {
    // CHECK ESC KEYS HERE....
    if (pInputEvent.usEvent == KEY_UP) {
      if (pInputEvent.usParam == ESC) {
        // Handle esc in talking menu
        if (HandleTalkingMenuEscape(true, true)) {
          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
        }
      } else if (pInputEvent.usParam == BACKSPACE) {
        HandleTalkingMenuBackspace();
      }
    }
  }

  function HandleSectorExitMenuKeys(
    pInputEvent: InputAtom,
    puiNewEvent: Pointer<UINT32>,
  ): void {
    // CHECK ESC KEYS HERE....
    if (pInputEvent.usEvent == KEY_UP && pInputEvent.usParam == ESC) {
      // Handle esc in talking menu
      RemoveSectorExitMenu(false);

      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
    }
  }

  function HandleOpenDoorMenuKeys(
    pInputEvent: InputAtom,
    puiNewEvent: Pointer<UINT32>,
  ): void {
    // CHECK ESC KEYS HERE....
    if (pInputEvent.usEvent == KEY_UP && pInputEvent.usParam == ESC) {
      // Handle esc in talking menu
      CancelOpenDoorMenu();
      HandleOpenDoorMenu();
      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
    }
  }

  function HandleMenuKeys(
    pInputEvent: InputAtom,
    puiNewEvent: Pointer<UINT32>,
  ): void {
    // CHECK ESC KEYS HERE....
    if (pInputEvent.usEvent == KEY_UP && pInputEvent.usParam == ESC) {
      // Handle esc in talking menu
      CancelMovementMenu();

      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
    }
  }

  function HandleItemMenuKeys(
    pInputEvent: InputAtom,
    puiNewEvent: Pointer<UINT32>,
  ): void {
    // CHECK ESC KEYS HERE....
    if (pInputEvent.usEvent == KEY_UP && pInputEvent.usParam == ESC) {
      // Handle esc in talking menu
      RemoveItemPickupMenu();
      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
    }
  }

  export function HandleCheckForExitArrowsInput(
    fAdjustConfirm: boolean,
  ): boolean {
    let sMapPos: INT16 = 0;

    // If not in move mode, return!
    if (gCurrentUIMode != Enum206.MOVE_MODE) {
      return false;
    }

    if (gusSelectedSoldier == NOBODY) {
      return false;
    }

    // ATE: Remove confirm for exit arrows...
    fAdjustConfirm = true;
    gfUIConfirmExitArrows = true;

    // Return right away, saying that we are in this mode, don't do any normal stuff!
    if (
      guiCurrentUICursor == Enum210.NOEXIT_EAST_UICURSOR ||
      guiCurrentUICursor == Enum210.NOEXIT_WEST_UICURSOR ||
      guiCurrentUICursor == Enum210.NOEXIT_NORTH_UICURSOR ||
      guiCurrentUICursor == Enum210.NOEXIT_SOUTH_UICURSOR ||
      guiCurrentUICursor == Enum210.NOEXIT_GRID_UICURSOR
    ) {
      // Yeah, but add a message....
      if (gfInvalidTraversal) {
        ScreenMsg(
          FONT_MCOLOR_LTYELLOW,
          MSG_UI_FEEDBACK,
          TacticalStr[Enum335.CANNOT_LEAVE_SECTOR_FROM_SIDE_STR],
        );
        gfInvalidTraversal = false;
      } else if (gfRobotWithoutControllerAttemptingTraversal) {
        ScreenMsg(
          FONT_MCOLOR_LTYELLOW,
          MSG_UI_FEEDBACK,
          gzLateLocalizedString[1],
        );
        gfRobotWithoutControllerAttemptingTraversal = false;
      } else if (gfLoneEPCAttemptingTraversal) {
        ScreenMsg(
          FONT_MCOLOR_LTYELLOW,
          MSG_UI_FEEDBACK,
          pExitingSectorHelpText[
            Enum336.EXIT_GUI_ESCORTED_CHARACTERS_CANT_LEAVE_SECTOR_ALONE_STR
          ],
          MercPtrs[gusSelectedSoldier].name,
        );
        gfLoneEPCAttemptingTraversal = false;
      } else if (gubLoneMercAttemptingToAbandonEPCs) {
        let str: string /* UINT16[256] */;
        if (gubLoneMercAttemptingToAbandonEPCs == 1) {
          // Use the singular version of the string
          if (
            gMercProfiles[MercPtrs[gusSelectedSoldier].ubProfile].bSex ==
            Enum272.MALE
          ) {
            // male singular
            str = swprintf(
              pExitingSectorHelpText[
                Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_MALE_SINGULAR
              ],
              MercPtrs[gusSelectedSoldier].name,
              MercPtrs[gbPotentiallyAbandonedEPCSlotID].name,
            );
          } else {
            // female singular
            str = swprintf(
              pExitingSectorHelpText[
                Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_FEMALE_SINGULAR
              ],
              MercPtrs[gusSelectedSoldier].name,
              MercPtrs[gbPotentiallyAbandonedEPCSlotID].name,
            );
          }
        } else {
          // Use the plural version of the string
          if (
            gMercProfiles[MercPtrs[gusSelectedSoldier].ubProfile].bSex ==
            Enum272.MALE
          ) {
            // male plural
            str = swprintf(
              pExitingSectorHelpText[
                Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_MALE_PLURAL
              ],
              MercPtrs[gusSelectedSoldier].name,
            );
          } else {
            // female plural
            str = swprintf(
              pExitingSectorHelpText[
                Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_FEMALE_PLURAL
              ],
              MercPtrs[gusSelectedSoldier].name,
            );
          }
        }
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, str);
        gubLoneMercAttemptingToAbandonEPCs = 0;
      } else {
        ScreenMsg(
          FONT_MCOLOR_LTYELLOW,
          MSG_UI_FEEDBACK,
          TacticalStr[Enum335.MERC_IS_TOO_FAR_AWAY_STR],
          MercPtrs[gusSelectedSoldier].name,
        );
      }

      return true;
    }

    // Check if we want to exit!
    if (
      guiCurrentUICursor == Enum210.EXIT_GRID_UICURSOR ||
      guiCurrentUICursor == Enum210.CONFIRM_EXIT_GRID_UICURSOR
    ) {
      if (fAdjustConfirm) {
        if (!gfUIConfirmExitArrows) {
          gfUIConfirmExitArrows = true;
        } else {
          if (
            !GetMouseMapPos(
              createPointer(
                () => sMapPos,
                (v) => (sMapPos = v),
              ),
            )
          ) {
            return false;
          }

          // Goto next sector
          // SimulateMouseMovement( gusMouseXPos - 5, gusMouseYPos );
          InitSectorExitMenu(Enum245.DIRECTION_EXITGRID, sMapPos);
        }
      }
      return true;
    }

    // Check if we want to exit!
    if (
      guiCurrentUICursor == Enum210.EXIT_EAST_UICURSOR ||
      guiCurrentUICursor == Enum210.CONFIRM_EXIT_EAST_UICURSOR
    ) {
      if (fAdjustConfirm) {
        if (!gfUIConfirmExitArrows) {
          gfUIConfirmExitArrows = true;
        } else {
          // Goto next sector
          // SimulateMouseMovement( gusMouseXPos - 5, gusMouseYPos );
          InitSectorExitMenu(Enum245.EAST, 0);
        }
      }
      return true;
    }
    if (
      guiCurrentUICursor == Enum210.EXIT_WEST_UICURSOR ||
      guiCurrentUICursor == Enum210.CONFIRM_EXIT_WEST_UICURSOR
    ) {
      if (fAdjustConfirm) {
        if (!gfUIConfirmExitArrows) {
          gfUIConfirmExitArrows = true;
        } else {
          // Goto next sector
          // SimulateMouseMovement( gusMouseXPos + 5, gusMouseYPos );
          InitSectorExitMenu(Enum245.WEST, 0);
        }
      }
      return true;
    }
    if (
      guiCurrentUICursor == Enum210.EXIT_NORTH_UICURSOR ||
      guiCurrentUICursor == Enum210.CONFIRM_EXIT_NORTH_UICURSOR
    ) {
      if (fAdjustConfirm) {
        if (!gfUIConfirmExitArrows) {
          gfUIConfirmExitArrows = true;
        } else {
          // Goto next sector
          // SimulateMouseMovement( gusMouseXPos, gusMouseYPos + 5 );
          InitSectorExitMenu(Enum245.NORTH, 0);
        }
      }
      return true;
    }
    if (
      guiCurrentUICursor == Enum210.EXIT_SOUTH_UICURSOR ||
      guiCurrentUICursor == Enum210.CONFIRM_EXIT_SOUTH_UICURSOR
    ) {
      if (fAdjustConfirm) {
        if (!gfUIConfirmExitArrows) {
          gfUIConfirmExitArrows = true;
        } else {
          // Goto next sector
          // SimulateMouseMovement( gusMouseXPos, gusMouseYPos - 5);
          InitSectorExitMenu(Enum245.SOUTH, 0);
        }
      }
      return true;
    }
    return false;
  }

  // Simple function implementations called by keyboard input

  function CreateRandomItem(): void {
    let Object: OBJECTTYPE = createObjectType();
    let usMapPos: UINT16 = 0;
    if (
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      CreateItem(Random(35) + 1, 100, Object);
      AddItemToPool(usMapPos, Object, -1, 0, 0, 0);
    }
  }

  function MakeSelectedSoldierTired(): void {
    // Key to make guy get tired!
    let pSoldier: SOLDIERTYPE | null;
    let Object: OBJECTTYPE = createObjectType();
    let usMapPos: UINT16 = 0;
    if (
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      CreateItem(Enum225.TNT, 100, Object);
      AddItemToPool(usMapPos, Object, -1, 0, 0, 0);
    }

    // CHECK IF WE'RE ON A GUY ( EITHER SELECTED, OURS, OR THEIRS
    if (gfUIFullTargetFound) {
      // Get Soldier
      pSoldier = GetSoldier(gusUIFullTargetID);

      // FatigueCharacter( pSoldier );

      fInterfacePanelDirty = DIRTYLEVEL2;
    }
  }

  function ToggleRealTime(puiNewEvent: Pointer<UINT32>): void {
    if (gTacticalStatus.uiFlags & TURNBASED) {
      // Change to real-time
      gTacticalStatus.uiFlags &= ~TURNBASED;
      gTacticalStatus.uiFlags |= REALTIME;

      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Switching to Realtime.");
    } else if (gTacticalStatus.uiFlags & REALTIME) {
      // Change to turn-based
      gTacticalStatus.uiFlags |= TURNBASED;
      gTacticalStatus.uiFlags &= ~REALTIME;

      puiNewEvent.value = Enum207.M_ON_TERRAIN;

      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Switching to Turnbased.");
    }

    // Plot new path!
    gfPlotNewMovement = true;
  }

  function ToggleViewAllMercs(): void {
    // Set option to show all mercs
    if (gTacticalStatus.uiFlags & SHOW_ALL_MERCS) {
      gTacticalStatus.uiFlags &= ~SHOW_ALL_MERCS;
    } else {
      gTacticalStatus.uiFlags |= SHOW_ALL_MERCS;
    }

    // RE-RENDER
    SetRenderFlags(RENDER_FLAG_FULL);
  }

  function ToggleViewAllItems(): void {
    // Set option to show all mercs
    if (gTacticalStatus.uiFlags & SHOW_ALL_ITEMS) {
      gTacticalStatus.uiFlags &= ~SHOW_ALL_ITEMS;
    } else {
      gTacticalStatus.uiFlags |= SHOW_ALL_ITEMS;
    }

    if (gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS]) {
      ToggleItemGlow(true);
    } else {
      ToggleItemGlow(false);
    }

    // RE-RENDER
    SetRenderFlags(RENDER_FLAG_FULL);
  }

  function TestExplosion(): void {
    let usMapPos: UINT16 = 0;
    if (
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      let ExpParams: EXPLOSION_PARAMS = createExplosionParams();
      ExpParams.uiFlags = 0;
      ExpParams.ubOwner = NOBODY;
      ExpParams.ubTypeID = Enum304.STUN_BLAST;
      ExpParams.sGridNo = usMapPos;

      GenerateExplosion(ExpParams);

      PlayJA2Sample(Enum330.EXPLOSION_1, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
    }
  }

  function CycleSelectedMercsItem(): void {
    let usOldItem: UINT16;
    let pSoldier: SOLDIERTYPE;
    // Cycle selected guy's item...
    if (gfUIFullTargetFound) {
      // Get soldier...
      pSoldier = MercPtrs[gusUIFullTargetID];

      usOldItem = pSoldier.inv[Enum261.HANDPOS].usItem;

      usOldItem++;

      if (usOldItem > Enum225.MAX_WEAPONS) {
        usOldItem = 0;
      }

      CreateItem(usOldItem, 100, pSoldier.inv[Enum261.HANDPOS]);

      DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
    }
  }

  function ToggleWireFrame(): void {
    if (gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_WIREFRAME]) {
      gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_WIREFRAME] = false;

      ScreenMsg(
        FONT_MCOLOR_LTYELLOW,
        MSG_INTERFACE,
        pMessageStrings[Enum333.MSG_WIREFRAMES_REMOVED],
      );
    } else {
      gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_WIREFRAME] = true;

      ScreenMsg(
        FONT_MCOLOR_LTYELLOW,
        MSG_INTERFACE,
        pMessageStrings[Enum333.MSG_WIREFRAMES_ADDED],
      );
    }

    SetRenderFlags(RENDER_FLAG_FULL);
  }

  function RefreshSoldier(): void {
    let pSoldier: SOLDIERTYPE;
    let usMapPos: UINT16 = 0;
    // CHECK IF WE'RE ON A GUY ( EITHER SELECTED, OURS, OR THEIRS
    if (gfUIFullTargetFound) {
      // Get Soldier
      pSoldier = <SOLDIERTYPE>GetSoldier(gusUIFullTargetID);

      ReviveSoldier(pSoldier);
    }

    if (
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    )
      gDebugStr = sprintf(
        "%d %d %d %d %d %d %d %d",
        gubWorldMovementCosts[usMapPos][0][0],
        gubWorldMovementCosts[usMapPos][1][gsInterfaceLevel],
        gubWorldMovementCosts[usMapPos][2][gsInterfaceLevel],
        gubWorldMovementCosts[usMapPos][3][gsInterfaceLevel],
        gubWorldMovementCosts[usMapPos][4][gsInterfaceLevel],
        gubWorldMovementCosts[usMapPos][5][gsInterfaceLevel],
        gubWorldMovementCosts[usMapPos][6][gsInterfaceLevel],
        gubWorldMovementCosts[usMapPos][7][gsInterfaceLevel],
      );
  }

  function ChangeSoldiersBodyType(
    ubBodyType: UINT8,
    fCreateNewPalette: boolean,
  ): void {
    let pSoldier: SOLDIERTYPE | null;
    if (gusSelectedSoldier != NO_SOLDIER) {
      if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
        pSoldier.ubBodyType = ubBodyType;
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 0, true);
        // SetSoldierAnimationSurface( pSoldier, pSoldier->usAnimState );
        if (fCreateNewPalette) {
          CreateSoldierPalettes(pSoldier);

          switch (ubBodyType) {
            case Enum194.ADULTFEMALEMONSTER:
            case Enum194.AM_MONSTER:
            case Enum194.YAF_MONSTER:
            case Enum194.YAM_MONSTER:
            case Enum194.LARVAE_MONSTER:
            case Enum194.INFANT_MONSTER:
            case Enum194.QUEENMONSTER:
              pSoldier.uiStatusFlags |= SOLDIER_MONSTER;
              pSoldier.inv.forEach(resetObjectType);
              AssignCreatureInventory(pSoldier);

              CreateItem(
                Enum225.CREATURE_YOUNG_MALE_SPIT,
                100,
                pSoldier.inv[Enum261.HANDPOS],
              );

              break;

            case Enum194.TANK_NW:
            case Enum194.TANK_NE:
              pSoldier.uiStatusFlags |= SOLDIER_VEHICLE;
              // pSoldier->inv[ HANDPOS ].usItem = TANK_CANNON;

              pSoldier.inv[Enum261.HANDPOS].usItem = Enum225.MINIMI;
              pSoldier.bVehicleID = AddVehicleToList(
                pSoldier.sSectorX,
                pSoldier.sSectorY,
                pSoldier.bSectorZ,
                Enum279.HUMMER,
              );

              break;
          }
        }
      }
    }
  }

  function TeleportSelectedSoldier(): void {
    let pSoldier: SOLDIERTYPE | null;
    let usMapPos: UINT16 = 0;
    // CHECK IF WE'RE ON A GUY ( EITHER SELECTED, OURS, OR THEIRS
    if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
      if (
        GetMouseMapPos(
          createPointer(
            () => usMapPos,
            (v) => (usMapPos = v),
          ),
        )
      ) {
        // Check level first....
        if (gsInterfaceLevel == 0) {
          SetSoldierHeight(pSoldier, 0);
          TeleportSoldier(pSoldier, usMapPos, false);
          EVENT_StopMerc(pSoldier, pSoldier.sGridNo, pSoldier.bDirection);
        } else {
          // Is there a roof?
          if (FindStructure(usMapPos, STRUCTURE_ROOF) != null) {
            SetSoldierHeight(pSoldier, 50.0);

            TeleportSoldier(pSoldier, usMapPos, true);
            EVENT_StopMerc(pSoldier, pSoldier.sGridNo, pSoldier.bDirection);
          }
        }
      }
    }
  }

  function ToggleTreeTops(): void {
    if (gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_TREE_TOPS]) {
      ScreenMsg(
        FONT_MCOLOR_LTYELLOW,
        MSG_INTERFACE,
        TacticalStr[Enum335.REMOVING_TREETOPS_STR],
      );
      WorldHideTrees();
      gTacticalStatus.uiFlags |= NOHIDE_REDUNDENCY;
    } else {
      ScreenMsg(
        FONT_MCOLOR_LTYELLOW,
        MSG_INTERFACE,
        TacticalStr[Enum335.SHOWING_TREETOPS_STR],
      );
      WorldShowTrees();
      gTacticalStatus.uiFlags &= ~NOHIDE_REDUNDENCY;
    }
    gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_TREE_TOPS] =
      !gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_TREE_TOPS];

    // FOR THE NEXT RENDER LOOP, RE-EVALUATE REDUNDENT TILES
    InvalidateWorldRedundency();
  }

  function ToggleZBuffer(): void {
    // Set option to show all mercs
    if (gTacticalStatus.uiFlags & SHOW_Z_BUFFER) {
      gTacticalStatus.uiFlags &= ~SHOW_Z_BUFFER;
      SetRenderFlags(SHOW_Z_BUFFER);
    } else {
      gTacticalStatus.uiFlags |= SHOW_Z_BUFFER;
    }
  }

  function TogglePlanningMode(): void {
    let pSoldier: SOLDIERTYPE;
    let usMapPos: UINT16 = 0;
    // DO ONLY IN TURNED BASED!
    if (
      gTacticalStatus.uiFlags & TURNBASED &&
      gTacticalStatus.uiFlags & INCOMBAT
    ) {
      // CANCEL FROM PLANNING MODE!
      if (InUIPlanMode()) {
        EndUIPlan();
      } else if (
        GetMouseMapPos(
          createPointer(
            () => usMapPos,
            (v) => (usMapPos = v),
          ),
        )
      ) {
        switch (gCurrentUIMode) {
          case Enum206.MOVE_MODE:
            if (gusSelectedSoldier != NO_SOLDIER) {
              pSoldier = <SOLDIERTYPE>GetSoldier(gusSelectedSoldier);
              BeginUIPlan(pSoldier);
              AddUIPlan(usMapPos, UIPLAN_ACTION_MOVETO);
            }
            break;
          case Enum206.ACTION_MODE:
            if (gusSelectedSoldier != NO_SOLDIER) {
              pSoldier = <SOLDIERTYPE>GetSoldier(gusSelectedSoldier);
              BeginUIPlan(pSoldier);
              AddUIPlan(usMapPos, UIPLAN_ACTION_FIRE);
            }
            break;
        }
      }
    }
  }

  function SetBurstMode(): void {
    if (gusSelectedSoldier != NO_SOLDIER) {
      ChangeWeaponMode(MercPtrs[gusSelectedSoldier]);
    }
  }

  function ObliterateSector(): void {
    let cnt: INT32;
    let pTSoldier: SOLDIERTYPE;

    // Kill everybody!
    cnt = gTacticalStatus.Team[gbPlayerNum].bLastID + 1;

    for (
      pTSoldier = MercPtrs[cnt];
      cnt < MAX_NUM_SOLDIERS;
      cnt++, pTSoldier = MercPtrs[cnt]
    ) {
      if (
        pTSoldier.bActive &&
        !pTSoldier.bNeutral &&
        pTSoldier.bSide != gbPlayerNum
      ) {
        //	ANITILE_PARAMS	AniParams;
        //		memset( &AniParams, 0, sizeof( ANITILE_PARAMS ) );
        //		AniParams.sGridNo							= pTSoldier->sGridNo;
        //		AniParams.ubLevelID						= ANI_STRUCT_LEVEL;
        //	AniParams.usTileType				  = FIRSTEXPLOSION;
        //	AniParams.usTileIndex					= FIRSTEXPLOSION1;
        //	AniParams.sDelay							= 80;
        //	AniParams.sStartFrame					= 0;
        //	AniParams.uiFlags							= ANITILE_FORWARD;

        //	CreateAnimationTile( &AniParams );
        // PlayJA2Sample( EXPLOSION_1, RATE_11025, MIDVOLUME, 1, MIDDLEPAN );

        EVENT_SoldierGotHit(
          pTSoldier,
          0,
          400,
          0,
          pTSoldier.bDirection,
          320,
          NOBODY,
          FIRE_WEAPON_NO_SPECIAL,
          pTSoldier.bAimShotLocation,
          0,
          NOWHERE,
        );
      }
    }
  }

  function RandomizeMercProfile(): void {
    let pSoldier: SOLDIERTYPE | null;
    // Get selected soldier
    if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
      // Change guy!
      ForceSoldierProfileID(pSoldier, Random(30));

      // Dirty interface
      DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
    }
  }

  function JumpFence(): void {
    let pSoldier: SOLDIERTYPE | null;
    let bDirection: INT8;
    if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
      if (
        FindFenceJumpDirection(
          pSoldier,
          pSoldier.sGridNo,
          pSoldier.bDirection,
          createPointer(
            () => bDirection,
            (v) => (bDirection = v),
          ),
        )
      ) {
        BeginSoldierClimbFence(pSoldier);
      }
    }
  }

  /* static */ let CreateNextCivType__bBodyType: INT8 = Enum194.FATCIV;
  function CreateNextCivType(): void {
    let sWorldX: INT16 = 0;
    let sWorldY: INT16 = 0;
    let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    let usMapPos: UINT16 = 0;

    // Get Grid Corrdinates of mouse
    if (
      GetMouseWorldCoordsInCenter(
        createPointer(
          () => sWorldX,
          (v) => (sWorldX = v),
        ),
        createPointer(
          () => sWorldY,
          (v) => (sWorldY = v),
        ),
      ) &&
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      let iNewIndex: INT8 = 0;

      MercCreateStruct.ubProfile = NO_PROFILE;
      MercCreateStruct.sSectorX = gWorldSectorX;
      MercCreateStruct.sSectorY = gWorldSectorY;
      MercCreateStruct.bSectorZ = gbWorldSectorZ;
      MercCreateStruct.bBodyType = CreateNextCivType__bBodyType;
      MercCreateStruct.bDirection = Enum245.SOUTH;

      CreateNextCivType__bBodyType++;

      if (CreateNextCivType__bBodyType > Enum194.KIDCIV) {
        CreateNextCivType__bBodyType = Enum194.FATCIV;
      }

      MercCreateStruct.bTeam = CIV_TEAM;
      MercCreateStruct.sInsertionGridNo = usMapPos;
      RandomizeNewSoldierStats(MercCreateStruct);

      if (
        TacticalCreateSoldier(
          MercCreateStruct,
          createPointer(
            () => iNewIndex,
            (v) => (iNewIndex = v),
          ),
        )
      ) {
        AddSoldierToSector(iNewIndex);

        // So we can see them!
        AllTeamsLookForAll(NO_INTERRUPTS);
      }
    }
  }

  function ToggleCliffDebug(): void {
    // Set option to show all mercs
    if (gTacticalStatus.uiFlags & DEBUGCLIFFS) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_TESTVERSION, "Cliff debug OFF.");

      gTacticalStatus.uiFlags &= ~DEBUGCLIFFS;
      SetRenderFlags(RENDER_FLAG_FULL);
    } else {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_TESTVERSION, "Cliff debug ON.");

      gTacticalStatus.uiFlags |= DEBUGCLIFFS;
    }
  }

  function CreateCow(): void {
    let sWorldX: INT16 = 0;
    let sWorldY: INT16 = 0;
    let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    let usMapPos: UINT16 = 0;
    // Get Grid Corrdinates of mouse
    if (
      GetMouseWorldCoordsInCenter(
        createPointer(
          () => sWorldX,
          (v) => (sWorldX = v),
        ),
        createPointer(
          () => sWorldY,
          (v) => (sWorldY = v),
        ),
      ) &&
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      let iNewIndex: INT8 = 0;

      MercCreateStruct.ubProfile = NO_PROFILE;
      MercCreateStruct.sSectorX = gWorldSectorX;
      MercCreateStruct.sSectorY = gWorldSectorY;
      MercCreateStruct.bSectorZ = gbWorldSectorZ;
      MercCreateStruct.bBodyType = Enum194.COW;
      // MercCreateStruct.bTeam				= SOLDIER_CREATE_AUTO_TEAM;
      MercCreateStruct.bTeam = CIV_TEAM;
      MercCreateStruct.sInsertionGridNo = usMapPos;
      RandomizeNewSoldierStats(MercCreateStruct);

      if (
        TacticalCreateSoldier(
          MercCreateStruct,
          createPointer(
            () => iNewIndex,
            (v) => (iNewIndex = v),
          ),
        )
      ) {
        AddSoldierToSector(iNewIndex);

        // So we can see them!
        AllTeamsLookForAll(NO_INTERRUPTS);
      }
    }
  }

  function CreatePlayerControlledCow(): void {
    let sWorldX: INT16 = 0;
    let sWorldY: INT16 = 0;
    let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    let usMapPos: UINT16 = 0;
    // Get Grid Corrdinates of mouse
    if (
      GetMouseWorldCoordsInCenter(
        createPointer(
          () => sWorldX,
          (v) => (sWorldX = v),
        ),
        createPointer(
          () => sWorldY,
          (v) => (sWorldY = v),
        ),
      ) &&
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      let iNewIndex: INT8 = 0;

      MercCreateStruct.ubProfile = 12;
      MercCreateStruct.sSectorX = gWorldSectorX;
      MercCreateStruct.sSectorY = gWorldSectorY;
      MercCreateStruct.bSectorZ = gbWorldSectorZ;
      MercCreateStruct.bBodyType = Enum194.COW;
      MercCreateStruct.sInsertionGridNo = usMapPos;
      MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
      MercCreateStruct.fPlayerMerc = true;

      RandomizeNewSoldierStats(MercCreateStruct);

      if (
        TacticalCreateSoldier(
          MercCreateStruct,
          createPointer(
            () => iNewIndex,
            (v) => (iNewIndex = v),
          ),
        )
      ) {
        AddSoldierToSector(iNewIndex);

        // So we can see them!
        AllTeamsLookForAll(NO_INTERRUPTS);
      }
    }
  }

  function ToggleRealTimeConfirm(): void {}

  function GrenadeTest1(): void {
    // Get mousexy
    let sX: INT16 = 0;
    let sY: INT16 = 0;
    if (
      GetMouseXY(
        createPointer(
          () => sX,
          (v) => (sX = v),
        ),
        createPointer(
          () => sY,
          (v) => (sY = v),
        ),
      )
    ) {
      let Object: OBJECTTYPE = createObjectType();
      Object.usItem = Enum225.MUSTARD_GRENADE;
      Object.bStatus[0] = 100;
      Object.ubNumberOfObjects = 1;
      CreatePhysicalObject(
        Object,
        60,
        sX * CELL_X_SIZE,
        sY * CELL_Y_SIZE,
        256,
        -20,
        20,
        158,
        NOBODY,
        Enum258.THROW_ARM_ITEM,
        0,
      );
    }
  }

  function GrenadeTest2(): void {
    // Get mousexy
    let sX: INT16 = 0;
    let sY: INT16 = 0;
    if (
      GetMouseXY(
        createPointer(
          () => sX,
          (v) => (sX = v),
        ),
        createPointer(
          () => sY,
          (v) => (sY = v),
        ),
      )
    ) {
      let Object: OBJECTTYPE = createObjectType();
      Object.usItem = Enum225.HAND_GRENADE;
      Object.bStatus[0] = 100;
      Object.ubNumberOfObjects = 1;
      CreatePhysicalObject(
        Object,
        60,
        sX * CELL_X_SIZE,
        sY * CELL_Y_SIZE,
        256,
        0,
        -30,
        158,
        NOBODY,
        Enum258.THROW_ARM_ITEM,
        0,
      );
    }
  }

  function GrenadeTest3(): void {
    // Get mousexy
    let sX: INT16 = 0;
    let sY: INT16 = 0;
    if (
      GetMouseXY(
        createPointer(
          () => sX,
          (v) => (sX = v),
        ),
        createPointer(
          () => sY,
          (v) => (sY = v),
        ),
      )
    ) {
      let Object: OBJECTTYPE = createObjectType();
      Object.usItem = Enum225.HAND_GRENADE;
      Object.bStatus[0] = 100;
      Object.ubNumberOfObjects = 1;
      CreatePhysicalObject(
        Object,
        60,
        sX * CELL_X_SIZE,
        sY * CELL_Y_SIZE,
        256,
        -10,
        10,
        158,
        NOBODY,
        Enum258.THROW_ARM_ITEM,
        0,
      );
    }
  }

  function CreatePlayerControlledMonster(): void {
    let sWorldX: INT16 = 0;
    let sWorldY: INT16 = 0;
    let usMapPos: UINT16 = 0;
    if (
      GetMouseWorldCoordsInCenter(
        createPointer(
          () => sWorldX,
          (v) => (sWorldX = v),
        ),
        createPointer(
          () => sWorldY,
          (v) => (sWorldY = v),
        ),
      ) &&
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
      let iNewIndex: INT8 = 0;

      MercCreateStruct.ubProfile = NO_PROFILE;
      MercCreateStruct.sSectorX = gWorldSectorX;
      MercCreateStruct.sSectorY = gWorldSectorY;
      MercCreateStruct.bSectorZ = gbWorldSectorZ;

      // Note:  only gets called if Alt and/or Ctrl isn't pressed!
      if (_KeyDown(INSERT)) MercCreateStruct.bBodyType = Enum194.QUEENMONSTER;
      // MercCreateStruct.bBodyType		= LARVAE_MONSTER;
      else MercCreateStruct.bBodyType = Enum194.ADULTFEMALEMONSTER;
      MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
      MercCreateStruct.sInsertionGridNo = usMapPos;
      RandomizeNewSoldierStats(MercCreateStruct);

      if (
        TacticalCreateSoldier(
          MercCreateStruct,
          createPointer(
            () => iNewIndex,
            (v) => (iNewIndex = v),
          ),
        )
      ) {
        AddSoldierToSector(iNewIndex);
      }
    }
  }

  function CheckForAndHandleHandleVehicleInteractiveClick(
    pSoldier: SOLDIERTYPE,
    usMapPos: UINT16,
    fMovementMode: boolean,
  ): INT8 {
    // Look for an item pool
    let sActionGridNo: INT16;
    let ubDirection: UINT8 = 0;
    let pTSoldier: SOLDIERTYPE;
    let sAPCost: INT16 = 0;

    if (gfUIFullTargetFound) {
      pTSoldier = MercPtrs[gusUIFullTargetID];

      if (
        OK_ENTERABLE_VEHICLE(pTSoldier) &&
        pTSoldier.bVisible != -1 &&
        OKUseVehicle(pTSoldier.ubProfile)
      ) {
        if (GetNumberInVehicle(pTSoldier.bVehicleID) == 0 || !fMovementMode) {
          // Find a gridno closest to sweetspot...
          sActionGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(
            pSoldier,
            pSoldier.usUIMovementMode,
            5,
            createPointer(
              () => ubDirection,
              (v) => (ubDirection = v),
            ),
            0,
            pTSoldier,
          );

          if (sActionGridNo != NOWHERE) {
            // Calculate AP costs...
            // sAPCost = GetAPsToBeginFirstAid( pSoldier );
            sAPCost += PlotPath(
              pSoldier,
              sActionGridNo,
              NO_COPYROUTE,
              NO_PLOT,
              TEMPORARY,
              pSoldier.usUIMovementMode,
              NOT_STEALTH,
              FORWARD,
              pSoldier.bActionPoints,
            );

            if (EnoughPoints(pSoldier, sAPCost, 0, true)) {
              DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1);

              // CHECK IF WE ARE AT THIS GRIDNO NOW
              if (pSoldier.sGridNo != sActionGridNo) {
                // SEND PENDING ACTION
                pSoldier.ubPendingAction = Enum257.MERC_ENTER_VEHICLE;
                pSoldier.sPendingActionData2 = pTSoldier.sGridNo;
                pSoldier.bPendingActionData3 = ubDirection;
                pSoldier.ubPendingActionAnimCount = 0;

                // WALK UP TO DEST FIRST
                EVENT_InternalGetNewSoldierPath(
                  pSoldier,
                  sActionGridNo,
                  pSoldier.usUIMovementMode,
                  3,
                  pSoldier.fNoAPToFinishMove,
                );
              } else {
                EVENT_SoldierEnterVehicle(
                  pSoldier,
                  pTSoldier.sGridNo,
                  ubDirection,
                );
              }

              // OK, set UI
              SetUIBusy(pSoldier.ubID);
              // guiPendingOverrideEvent = A_CHANGE_TO_MOVE;

              return -1;
            }
          }
        }
      }
    }

    return 0;
  }

  export function HandleHandCursorClick(
    usMapPos: UINT16,
    puiNewEvent: Pointer<UINT32>,
  ): void {
    let pSoldier: SOLDIERTYPE | null;
    let pIntTile: LEVELNODE | null;
    let sIntTileGridNo: INT16 = 0;
    let sActionGridNo: INT16;
    let ubDirection: UINT8 = 0;
    let sAPCost: INT16;
    let sAdjustedGridNo: INT16 = 0;
    let pStructure: STRUCTURE | null = <STRUCTURE>(<unknown>null);
    let pItemPool: ITEM_POOL | null;
    let fIgnoreItems: boolean = false;

    if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
      // If we are out of breath, no cursor...
      if (pSoldier.bBreath < OKBREATH && pSoldier.bCollapsed) {
        return;
      }

      if (
        CheckForAndHandleHandleVehicleInteractiveClick(
          pSoldier,
          usMapPos,
          false,
        ) == -1
      ) {
        return;
      }

      // Check if we are on a merc... if so.. steal!
      if (gfUIFullTargetFound) {
        if (
          guiUIFullTargetFlags & ENEMY_MERC &&
          !(guiUIFullTargetFlags & UNCONSCIOUS_MERC)
        ) {
          sActionGridNo = FindAdjacentGridEx(
            pSoldier,
            MercPtrs[gusUIFullTargetID].sGridNo,
            createPointer(
              () => ubDirection,
              (v) => (ubDirection = v),
            ),
            createPointer(
              () => sAdjustedGridNo,
              (v) => (sAdjustedGridNo = v),
            ),
            true,
            false,
          );
          if (sActionGridNo == -1) {
            sActionGridNo = sAdjustedGridNo;
          }

          // Steal!
          sAPCost = GetAPsToStealItem(pSoldier, sActionGridNo);

          if (EnoughPoints(pSoldier, sAPCost, 0, true)) {
            MercStealFromMerc(pSoldier, MercPtrs[gusUIFullTargetID]);

            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;

            return;
          } else {
            return;
          }
        }
      }

      // Default action gridno to mouse....
      sActionGridNo = usMapPos;

      // If we are over an interactive struct, adjust gridno to this....
      pIntTile = ConditionalGetCurInteractiveTileGridNoAndStructure(
        createPointer(
          () => sIntTileGridNo,
          (v) => (sIntTileGridNo = v),
        ),
        createPointer(
          () => pStructure,
          (v) => (pStructure = v),
        ),
        false,
      );
      if (pIntTile != null) {
        sActionGridNo = sIntTileGridNo;

        // if ( pStructure->fFlags & ( STRUCTURE_SWITCH | STRUCTURE_ANYDOOR ) )
        if (pStructure.fFlags & STRUCTURE_SWITCH) {
          fIgnoreItems = true;
        }

        if (
          pStructure.fFlags & STRUCTURE_ANYDOOR &&
          sActionGridNo != usMapPos
        ) {
          fIgnoreItems = true;
        }
      }

      // Check if we are over an item pool
      // ATE: Ignore items will be set if over a switch interactive tile...
      if (
        (pItemPool = GetItemPool(sActionGridNo, pSoldier.bLevel)) &&
        ITEMPOOL_VISIBLE(pItemPool) &&
        !fIgnoreItems
      ) {
        if (AM_AN_EPC(pSoldier)) {
          // Display message
          // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ NO_PATH ] );
          ScreenMsg(
            FONT_MCOLOR_LTYELLOW,
            MSG_UI_FEEDBACK,
            TacticalStr[Enum335.EPC_CANNOT_DO_THAT],
          );
        } else if (UIOkForItemPickup(pSoldier, sActionGridNo)) {
          let bZLevel: INT8;

          bZLevel = GetZLevelOfItemPoolGivenStructure(
            sActionGridNo,
            pSoldier.bLevel,
            pStructure,
          );

          SoldierPickupItem(
            pSoldier,
            pItemPool.iItemIndex,
            sActionGridNo,
            bZLevel,
          );

          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
        }
      } else {
        if (pIntTile != null && !(pStructure.fFlags & STRUCTURE_HASITEMONTOP)) {
          sActionGridNo = FindAdjacentGridEx(
            pSoldier,
            sIntTileGridNo,
            createPointer(
              () => ubDirection,
              (v) => (ubDirection = v),
            ),
            null,
            false,
            true,
          );
          if (sActionGridNo == -1) {
            sActionGridNo = sIntTileGridNo;
          }

          // If this is not the same tile as ours, check if we can get to dest!
          if (sActionGridNo != pSoldier.sGridNo && gsCurrentActionPoints == 0) {
            ScreenMsg(
              FONT_MCOLOR_LTYELLOW,
              MSG_UI_FEEDBACK,
              TacticalStr[Enum335.NO_PATH],
            );
          } else {
            if (SelectedMercCanAffordMove()) {
              puiNewEvent.value = Enum207.C_MOVE_MERC;
            }
          }
        } else {
          // ATE: Here, the poor player wants to search something that does not exist...
          // Why should we not let them make fools of themselves....?
          if (AM_AN_EPC(pSoldier)) {
            // Display message
            // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ NO_PATH ] );
            ScreenMsg(
              FONT_MCOLOR_LTYELLOW,
              MSG_UI_FEEDBACK,
              TacticalStr[Enum335.EPC_CANNOT_DO_THAT],
            );
          } else {
            // Check morale, if < threashold, refuse...
            if (pSoldier.bMorale < 30) {
              TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_REFUSING_ORDER);
            } else {
              if (gsCurrentActionPoints == 0) {
                ScreenMsg(
                  FONT_MCOLOR_LTYELLOW,
                  MSG_UI_FEEDBACK,
                  TacticalStr[Enum335.NO_PATH],
                );
              } else {
                SoldierPickupItem(pSoldier, NOTHING, sActionGridNo, 0);
                puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
              }
            }
          }
        }
      }
    }
  }

  function ExchangeMessageBoxCallBack(bExitValue: UINT8): void {
    if (bExitValue == MSG_BOX_RETURN_YES) {
      SwapMercPositions(gpExchangeSoldier1, gpExchangeSoldier2);
    }
  }

  export function HandleMoveModeInteractiveClick(
    usMapPos: UINT16,
    puiNewEvent: Pointer<UINT32>,
  ): INT8 {
    // Look for an item pool
    let pItemPool: ITEM_POOL | null;
    let fContinue: boolean = true;
    let pSoldier: SOLDIERTYPE | null;
    let pIntTile: LEVELNODE | null;
    let sIntTileGridNo: INT16 = 0;
    let sActionGridNo: INT16;
    let ubDirection: UINT8;
    let bReturnCode: INT8 = 0;
    let bZLevel: INT8;
    let pStructure: STRUCTURE | null = <STRUCTURE>(<unknown>null);

    if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
      // If we are out of breath, no cursor...
      // if ( pSoldier->bBreath < OKBREATH )
      //{
      //	  return( -1 );
      //}

      // ATE: If we are a vehicle, no moving!
      if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
        ScreenMsg(
          FONT_MCOLOR_LTYELLOW,
          MSG_UI_FEEDBACK,
          TacticalStr[Enum335.VEHICLE_CANT_MOVE_IN_TACTICAL],
        );
        return -3;
      }

      // OK, check for height differences.....
      if (
        gpWorldLevelData[usMapPos].sHeight !=
        gpWorldLevelData[pSoldier.sGridNo].sHeight
      ) {
        ScreenMsg(
          FONT_MCOLOR_LTYELLOW,
          MSG_UI_FEEDBACK,
          TacticalStr[Enum335.CANT_GET_THERE],
        );
        return -1;
      }

      // See if we are over a vehicle, and walk up to it and enter....
      if (
        CheckForAndHandleHandleVehicleInteractiveClick(
          pSoldier,
          usMapPos,
          true,
        ) == -1
      ) {
        return -1;
      }

      // Check if we are over a civillian....
      if (gfUIFullTargetFound) {
        if (ValidQuickExchangePosition()) {
          // Check if we can...
          if (CanExchangePlaces(pSoldier, MercPtrs[gusUIFullTargetID], true)) {
            gpExchangeSoldier1 = pSoldier;
            gpExchangeSoldier2 = MercPtrs[gusUIFullTargetID];

            // Do message box...
            // DoMessageBox( MSG_BOX_BASIC_STYLE, TacticalStr[ EXCHANGE_PLACES_REQUESTER ], GAME_SCREEN, ( UINT8 )MSG_BOX_FLAG_YESNO, ExchangeMessageBoxCallBack, NULL );
            SwapMercPositions(gpExchangeSoldier1, gpExchangeSoldier2);
          }
        }
        return -3;
      }

      pIntTile = GetCurInteractiveTileGridNoAndStructure(
        createPointer(
          () => sIntTileGridNo,
          (v) => (sIntTileGridNo = v),
        ),
        createPointer(
          () => pStructure,
          (v) => (pStructure = v),
        ),
      );

      if (pIntTile != null) {
        bReturnCode = -3;

        // Check if we are over an item pool, take precedence over that.....
        // EXCEPT FOR SWITCHES!
        if (
          (pItemPool = GetItemPool(sIntTileGridNo, pSoldier.bLevel)) &&
          !(pStructure.fFlags & (STRUCTURE_SWITCH | STRUCTURE_ANYDOOR))
        ) {
          if (AM_AN_EPC(pSoldier)) {
            // Display message
            // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ NO_PATH ] );
            ScreenMsg(
              FONT_MCOLOR_LTYELLOW,
              MSG_UI_FEEDBACK,
              TacticalStr[Enum335.EPC_CANNOT_DO_THAT],
            );
            bReturnCode = -1;
          } else if (UIOkForItemPickup(pSoldier, sIntTileGridNo)) {
            bZLevel = GetLargestZLevelOfItemPool(pItemPool);

            if (AnyItemsVisibleOnLevel(pItemPool, bZLevel)) {
              fContinue = false;

              SetUIBusy(pSoldier.ubID);

              if (
                gTacticalStatus.uiFlags & INCOMBAT &&
                gTacticalStatus.uiFlags & TURNBASED
              ) {
                // puiNewEvent = C_WAIT_FOR_CONFIRM;
                SoldierPickupItem(
                  pSoldier,
                  pItemPool.iItemIndex,
                  sIntTileGridNo,
                  bZLevel,
                );
              } else {
                BeginDisplayTimedCursor(Enum210.OKHANDCURSOR_UICURSOR, 300);

                SoldierPickupItem(
                  pSoldier,
                  pItemPool.iItemIndex,
                  sIntTileGridNo,
                  bZLevel,
                );
              }
            }
          }
        }

        if (fContinue) {
          sActionGridNo = FindAdjacentGridEx(
            MercPtrs[gusSelectedSoldier],
            sIntTileGridNo,
            createPointer(
              () => ubDirection,
              (v) => (ubDirection = v),
            ),
            null,
            false,
            true,
          );
          if (sActionGridNo == -1) {
            sActionGridNo = sIntTileGridNo;
          }

          // If this is not the same tile as ours, check if we can get to dest!
          if (
            sActionGridNo != MercPtrs[gusSelectedSoldier].sGridNo &&
            gsCurrentActionPoints == 0
          ) {
            ScreenMsg(
              FONT_MCOLOR_LTYELLOW,
              MSG_UI_FEEDBACK,
              TacticalStr[Enum335.NO_PATH],
            );
            bReturnCode = -1;
          } else {
            bReturnCode = -2;
          }
        }
      }
    }

    return bReturnCode;
  }

  export function HandleUIReloading(pSoldier: SOLDIERTYPE): boolean {
    let bAPs: INT8 = 0;

    // CHECK OUR CURRENT CURSOR...

    // Do we have the ammo to reload?
    if (guiCurrentUICursor == Enum210.GOOD_RELOAD_UICURSOR) {
      // Check APs to reload...
      bAPs = GetAPsToAutoReload(pSoldier);

      if (EnoughPoints(pSoldier, bAPs, 0, true)) {
        // OK, we have some ammo we can reload.... reload now!
        if (!AutoReload(pSoldier)) {
          // Do we say we could not reload gun...?
        }

        // ATE: Re-examine cursor info!
        gfUIForceReExamineCursorData = true;
      }
      return true;
    }

    if (guiCurrentUICursor == Enum210.BAD_RELOAD_UICURSOR) {
      // OK, we have been told to reload but have no ammo...
      // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, L"No ammo to reload." );
      if (Random(3) == 0) {
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_OUT_OF_AMMO);
      }
      return true;
    }

    return false;
  }

  export function ConfirmActionCancel(
    usMapPos: UINT16,
    usOldMapPos: UINT16,
  ): boolean {
    // OK, most times we want to leave confirm mode if our
    // gridno is different... but if we are in the grenade throw
    // confirm UI, we want a bigger radius...
    // if ( InAimCubeUI( ) )
    //{
    // Calculate distence between both gridnos.....
    //	if ( GetRangeFromGridNoDiff( GetInAimCubeUIGridNo( ), usOldMapPos ) > 1 )
    // if ( usMapPos != usOldMapPos )
    //	{
    //		return( TRUE );
    //	}
    //
    // else
    {
      if (usMapPos != usOldMapPos) {
        return true;
      }
    }

    return false;
  }

  function ChangeCurrentSquad(iSquad: INT32): void {
    // only allow if nothing in hand and the Change Squad button for whichever panel we're in must be enabled
    if (
      gpItemPointer == null &&
      !gfDisableTacticalPanelButtons &&
      (gsCurInterfacePanel != Enum215.TEAM_PANEL ||
        ButtonList[iTEAMPanelButtons[Enum221.CHANGE_SQUAD_BUTTON]].uiFlags &
          BUTTON_ENABLED)
    ) {
      if (IsSquadOnCurrentTacticalMap(iSquad)) {
        SetCurrentSquad(iSquad, false);
      }
    }
  }

  function HandleSelectMercSlot(ubPanelSlot: UINT8, bCode: INT8): void {
    let ubID: UINT8 = 0;

    if (
      GetPlayerIDFromInterfaceTeamSlot(
        ubPanelSlot,
        createPointer(
          () => ubID,
          (v) => (ubID = v),
        ),
      )
    ) {
      HandleLocateSelectMerc(ubID, bCode);

      ErasePath(true);
      gfPlotNewMovement = true;
    }
  }

  function TestMeanWhile(iID: INT32): void {
    let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
    let cnt: INT32;
    let pSoldier: SOLDIERTYPE;

    MeanwhileDef.sSectorX = 3;
    MeanwhileDef.sSectorY = 16;
    MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
    MeanwhileDef.usTriggerEvent = 0;
    MeanwhileDef.ubMeanwhileID = iID;

    if (iID == Enum160.INTERROGATION) {
      MeanwhileDef.sSectorX = 7;
      MeanwhileDef.sSectorY = 14;

      // Loop through our mercs and set gridnos once some found.....
      // look for all mercs on the same team,
      cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

      for (
        pSoldier = MercPtrs[cnt];
        cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
        cnt++, pSoldier = MercPtrs[cnt]
      ) {
        // Are we a POW in this sector?
        if (pSoldier.bActive && pSoldier.bInSector) {
          ChangeSoldiersAssignment(pSoldier, Enum117.ASSIGNMENT_POW);

          pSoldier.sSectorX = 7;
          pSoldier.sSectorY = 14;
        }
      }
    }

    ScheduleMeanwhileEvent(MeanwhileDef, 10);
  }

  function EscapeUILock(): void {
    // UNLOCK UI
    UnSetUIBusy(gusSelectedSoldier);

    // Decrease global busy  counter...
    gTacticalStatus.ubAttackBusyCount = 0;

    guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
    UIHandleLUIEndLock(null);
  }

  export function HandleStanceChangeFromUIKeys(ubAnimHeight: UINT8): void {
    // If we have multiple guys selected, make all change stance!
    let pSoldier: SOLDIERTYPE;
    let cnt: INT32;

    if (gTacticalStatus.fAtLeastOneGuyOnMultiSelect) {
      // OK, loop through all guys who are 'multi-selected' and
      // check if our currently selected guy is amoung the
      // lucky few.. if not, change to a guy who is...
      cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (
        pSoldier = MercPtrs[cnt];
        cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
        cnt++, pSoldier = MercPtrs[cnt]
      ) {
        if (pSoldier.bActive && pSoldier.bInSector) {
          if (pSoldier.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
            UIHandleSoldierStanceChange(pSoldier.ubID, ubAnimHeight);
          }
        }
      }
    } else {
      if (gusSelectedSoldier != NO_SOLDIER)
        UIHandleSoldierStanceChange(gusSelectedSoldier, ubAnimHeight);
    }
  }

  function ToggleStealthMode(pSoldier: SOLDIERTYPE): void {
    // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
    if (
      gsCurInterfacePanel != Enum215.SM_PANEL ||
      ButtonList[giSMStealthButton].uiFlags & BUTTON_ENABLED
    ) {
      // ATE: Toggle stealth
      if (gpSMCurrentMerc != null && pSoldier.ubID == gpSMCurrentMerc.ubID) {
        gfUIStanceDifferent = true;
      }

      pSoldier.bStealthMode = !pSoldier.bStealthMode;
      gfPlotNewMovement = true;
      fInterfacePanelDirty = DIRTYLEVEL2;

      if (pSoldier.bStealthMode) {
        ScreenMsg(
          FONT_MCOLOR_LTYELLOW,
          MSG_INTERFACE,
          pMessageStrings[Enum333.MSG_MERC_ON_STEALTHMODE],
          pSoldier.name,
        );
      } else {
        ScreenMsg(
          FONT_MCOLOR_LTYELLOW,
          MSG_INTERFACE,
          pMessageStrings[Enum333.MSG_MERC_OFF_STEALTHMODE],
          pSoldier.name,
        );
      }
    }
  }

  function HandleStealthChangeFromUIKeys(): void {
    // If we have multiple guys selected, make all change stance!
    let pSoldier: SOLDIERTYPE;
    let cnt: INT32;

    if (gTacticalStatus.fAtLeastOneGuyOnMultiSelect) {
      // OK, loop through all guys who are 'multi-selected' and
      // check if our currently selected guy is amoung the
      // lucky few.. if not, change to a guy who is...
      cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (
        pSoldier = MercPtrs[cnt];
        cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
        cnt++, pSoldier = MercPtrs[cnt]
      ) {
        if (pSoldier.bActive && !AM_A_ROBOT(pSoldier) && pSoldier.bInSector) {
          if (pSoldier.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
            ToggleStealthMode(pSoldier);
          }
        }
      }
    } else {
      if (gusSelectedSoldier != NO_SOLDIER) {
        if (!AM_A_ROBOT(MercPtrs[gusSelectedSoldier])) {
          ToggleStealthMode(MercPtrs[gusSelectedSoldier]);
        }
      }
    }
  }

  function TestCapture(): void {
    let cnt: INT32;
    let pSoldier: SOLDIERTYPE;
    let uiNumChosen: UINT32 = 0;

    // StartQuest( QUEST_HELD_IN_ALMA, gWorldSectorX, gWorldSectorY );
    // EndQuest( QUEST_HELD_IN_ALMA, gWorldSectorX, gWorldSectorY );

    BeginCaptureSquence();

    gStrategicStatus.uiFlags &= ~STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE;

    // loop through sodliers and pick 3 lucky ones....
    for (
      cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID,
        pSoldier = MercPtrs[cnt];
      cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
      cnt++, pSoldier = MercPtrs[cnt]
    ) {
      if (pSoldier.bLife >= OKLIFE && pSoldier.bActive && pSoldier.bInSector) {
        if (uiNumChosen < 3) {
          EnemyCapturesPlayerSoldier(pSoldier);

          // Remove them from tectical....
          RemoveSoldierFromGridNo(pSoldier);

          uiNumChosen++;
        }
      }
    }

    EndCaptureSequence();
  }

  export function PopupAssignmentMenuInTactical(pSoldier: SOLDIERTYPE): void {
    // do something
    fShowAssignmentMenu = true;
    CreateDestroyAssignmentPopUpBoxes();
    SetTacticalPopUpAssignmentBoxXY();
    DetermineBoxPositions();
    DetermineWhichAssignmentMenusCanBeShown();
    fFirstClickInAssignmentScreenMask = true;
    gfIgnoreScrolling = true;
  }
}
