namespace ja2 {
  let gfStartLookingForRubberBanding: boolean = false;
  let gusRubberBandX: UINT16 = 0;
  let gusRubberBandY: UINT16 = 0;

  export let gfBeginBurstSpreadTracking: boolean = false;

  export let gfRTClickLeftHoldIntercepted: boolean = false;
  let gfRTHaveClickedRightWhileLeftDown: boolean = false;

  export function GetRTMouseButtonInput(puiNewEvent: Pointer<UINT32>): void {
    QueryRTLeftButton(puiNewEvent);
    QueryRTRightButton(puiNewEvent);
  }

  /* static */ let QueryRTLeftButton__uiSingleClickTime: UINT32;
  /* static */ let QueryRTLeftButton__fDoubleClickIntercepted: boolean = false;
  /* static */ let QueryRTLeftButton__fValidDoubleClickPossible: boolean =
    false;
  /* static */ let QueryRTLeftButton__fCanCheckForSpeechAdvance: boolean =
    false;
  /* static */ let QueryRTLeftButton__sMoveClickGridNo: INT16 = 0;
  function QueryRTLeftButton(puiNewEvent: Pointer<UINT32>): void {
    let usSoldierIndex: UINT16 = 0;
    let usSoldierIndex__Pointer = createPointer(
      () => usSoldierIndex,
      (v) => (usSoldierIndex = v),
    );
    let pSoldier: SOLDIERTYPE | null;
    let uiMercFlags: UINT32 = 0;
    let uiMercFlags__Pointer = createPointer(
      () => uiMercFlags,
      (v) => (uiMercFlags = v),
    );
    let usMapPos: UINT16 = 0;
    let fDone: boolean = false;

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

      if (gusSelectedSoldier != NOBODY) {
        if (MercPtrs[gusSelectedSoldier].pTempObject != null) {
          return;
        }
      }

      if (gViewportRegion.ButtonState & MSYS_LEFT_BUTTON) {
        if (!fLeftButtonDown) {
          fLeftButtonDown = true;
          gfRTHaveClickedRightWhileLeftDown = false;
          RESETCOUNTER(Enum386.LMOUSECLICK_DELAY_COUNTER);
          RESETCOUNTER(Enum386.RUBBER_BAND_START_DELAY);

          if (giUIMessageOverlay == -1) {
            if (gpItemPointer == null) {
              switch (gCurrentUIMode) {
                case Enum206.ACTION_MODE:
                  if (gusSelectedSoldier != NOBODY) {
                    if (
                      (pSoldier = GetSoldier(gusSelectedSoldier)) !== null &&
                      gpItemPointer == null
                    ) {
                      // OK, check for needing ammo
                      if (HandleUIReloading(pSoldier)) {
                        gfRTClickLeftHoldIntercepted = true;
                        // fLeftButtonDown				= FALSE;
                      } else {
                        if (pSoldier.bDoBurst) {
                          pSoldier.sStartGridNo = usMapPos;
                          ResetBurstLocations();
                          puiNewEvent.value = Enum207.A_CHANGE_TO_CONFIM_ACTION;
                        } else {
                          gfRTClickLeftHoldIntercepted = true;

                          if (UIMouseOnValidAttackLocation(pSoldier)) {
                            // OK< going into confirm will call a function that will automatically move
                            // us to shoot in most vases ( grenades need a confirm mode regardless )
                            puiNewEvent.value =
                              Enum207.A_CHANGE_TO_CONFIM_ACTION;
                            //*puiNewEvent = CA_MERC_SHOOT;
                            PauseRT(false);
                          }
                        }
                      }
                    }
                  }
                  break;

                case Enum206.MOVE_MODE:
                  gfUICanBeginAllMoveCycle = true;

                  if (
                    !HandleCheckForExitArrowsInput(false) &&
                    gpItemPointer == null
                  ) {
                    if (
                      gfUIFullTargetFound &&
                      guiUIFullTargetFlags & OWNED_MERC
                    ) {
                      // Reset , if this guy is selected merc, reset any multi selections...
                      if (gusUIFullTargetID == gusSelectedSoldier) {
                        ResetMultiSelection();
                      }
                    } else {
                      let bReturnCode: INT8;

                      bReturnCode = HandleMoveModeInteractiveClick(
                        usMapPos,
                        puiNewEvent,
                      );

                      if (bReturnCode == -1) {
                        // gfRTClickLeftHoldIntercepted = TRUE;
                      } else if (bReturnCode == -2) {
                        // if ( gGameSettings.fOptions[ TOPTION_RTCONFIRM ] )
                        //{
                        //	*puiNewEvent = C_WAIT_FOR_CONFIRM;
                        //	gfPlotNewMovement = TRUE;
                        //}/
                        // else
                      } else if (bReturnCode == -3) {
                        gfRTClickLeftHoldIntercepted = true;
                      } else if (bReturnCode == 0) {
                        {
                          {
                            let fResult: UINT8 /* boolean */;

                            if (gusSelectedSoldier != NOBODY) {
                              if (
                                (fResult = UIOKMoveDestination(
                                  MercPtrs[gusSelectedSoldier],
                                  usMapPos,
                                )) == 1
                              ) {
                                if (gsCurrentActionPoints != 0) {
                                  // We're on terrain in which we can walk, walk
                                  // If we're on terrain,
                                  if (
                                    !gGameSettings.fOptions[
                                      Enum8.TOPTION_RTCONFIRM
                                    ]
                                  ) {
                                    puiNewEvent.value =
                                      Enum207.C_WAIT_FOR_CONFIRM;
                                    gfPlotNewMovement = true;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    // gfRTClickLeftHoldIntercepted = TRUE;
                  } else {
                    gfRTClickLeftHoldIntercepted = true;
                    fIgnoreLeftUp = true;
                  }

                  break;
              }
            }
          }
          if (gfUIWaitingForUserSpeechAdvance) {
            QueryRTLeftButton__fCanCheckForSpeechAdvance = true;
          }
        }

        if (gpItemPointer == null) {
          if (giUIMessageOverlay == -1 && !gfRTHaveClickedRightWhileLeftDown) {
            // HERE FOR CLICK-DRAG CLICK
            switch (gCurrentUIMode) {
              case Enum206.MOVE_MODE:
              case Enum206.CONFIRM_MOVE_MODE:
                // First check if we clicked on a guy, if so, make selected if it's ours
                if (
                  FindSoldierFromMouse(
                    usSoldierIndex__Pointer,
                    uiMercFlags__Pointer,
                  )
                ) {
                  // Select guy
                  if (
                    uiMercFlags & SELECTED_MERC &&
                    !(uiMercFlags & UNCONSCIOUS_MERC) &&
                    !(MercPtrs[usSoldierIndex].uiStatusFlags & SOLDIER_VEHICLE)
                  ) {
                    puiNewEvent.value = Enum207.M_CHANGE_TO_ADJPOS_MODE;
                  }
                } else {
                  // if ( COUNTERDONE( RUBBER_BAND_START_DELAY )  )
                  {
                    // OK, change to rubber banding mode..
                    // Have we started this yet?
                    if (!gfStartLookingForRubberBanding && !gRubberBandActive) {
                      gfStartLookingForRubberBanding = true;
                      gusRubberBandX = gusMouseXPos;
                      gusRubberBandY = gusMouseYPos;
                    } else {
                      // Have we moved....?
                      if (
                        Math.abs(gusMouseXPos - gusRubberBandX) > 10 ||
                        Math.abs(gusMouseYPos - gusRubberBandY) > 10
                      ) {
                        gfStartLookingForRubberBanding = false;

                        // Stop scrolling:
                        gfIgnoreScrolling = true;

                        // Anchor cursor....
                        RestrictMouseToXYXY(
                          0,
                          0,
                          gsVIEWPORT_END_X,
                          gsVIEWPORT_WINDOW_END_Y,
                        );

                        // OK, settup anchor....
                        gRubberBandRect.iLeft = gusRubberBandX;
                        gRubberBandRect.iTop = gusRubberBandY;

                        gRubberBandActive = true;

                        // ATE: If we have stopped scrolling.....
                        if (gfScrollInertia != 0) {
                          SetRenderFlags(RENDER_FLAG_FULL | RENDER_FLAG_CHECKZ);

                          // Restore Interface!
                          RestoreInterface();

                          // Delete Topmost blitters saved areas
                          DeleteVideoOverlaysArea();

                          gfScrollInertia = 0;
                        }

                        puiNewEvent.value = Enum207.RB_ON_TERRAIN;
                        return;
                      }
                    }
                  }
                }
                break;
            }
          }
        }
      } else {
        if (fLeftButtonDown) {
          if (!fIgnoreLeftUp) {
            // set flag for handling single clicks
            // OK , FOR DOUBLE CLICKS - TAKE TIME STAMP & RECORD EVENT
            if (GetJA2Clock() - QueryRTLeftButton__uiSingleClickTime < 300) {
              // CHECK HERE FOR DOUBLE CLICK EVENTS
              if (QueryRTLeftButton__fValidDoubleClickPossible) {
                if (gpItemPointer == null) {
                  QueryRTLeftButton__fDoubleClickIntercepted = true;

                  // First check if we clicked on a guy, if so, make selected if it's ours
                  if (gusSelectedSoldier != NO_SOLDIER) {
                    // Set movement mode
                    // OK, only change this if we are stationary!
                    // if ( gAnimControl[ MercPtrs[ gusSelectedSoldier ]->usAnimState ].uiFlags & ANIM_STATIONARY )
                    // if ( MercPtrs[ gusSelectedSoldier ]->usAnimState == WALKING )
                    {
                      MercPtrs[gusSelectedSoldier].fUIMovementFast = true;
                      puiNewEvent.value = Enum207.C_MOVE_MERC;
                    }
                  }
                }
              }
            }

            // Capture time!
            QueryRTLeftButton__uiSingleClickTime = GetJA2Clock();

            QueryRTLeftButton__fValidDoubleClickPossible = false;

            if (!QueryRTLeftButton__fDoubleClickIntercepted) {
              // FIRST CHECK FOR ANYTIME ( NON-INTERVAL ) CLICKS
              switch (gCurrentUIMode) {
                case Enum206.ADJUST_STANCE_MODE:
                  // If button has come up, change to mocve mode
                  puiNewEvent.value = Enum207.PADJ_ADJUST_STANCE;
                  break;
              }

              // CHECK IF WE CLICKED-HELD
              if (
                COUNTERDONE(Enum386.LMOUSECLICK_DELAY_COUNTER) &&
                gpItemPointer != null
              ) {
                // LEFT CLICK-HOLD EVENT
                // Switch on UI mode
                switch (gCurrentUIMode) {
                  case Enum206.CONFIRM_ACTION_MODE:
                  case Enum206.ACTION_MODE:
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
                        gfRTClickLeftHoldIntercepted = true;
                      }
                    }
                    break;
                }
              }
              // else
              {
                // LEFT CLICK NORMAL EVENT
                // Switch on UI mode
                if (!gfRTClickLeftHoldIntercepted) {
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
                          QueryRTLeftButton__fCanCheckForSpeechAdvance
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
                              if (
                                FindSoldierFromMouse(
                                  usSoldierIndex__Pointer,
                                  uiMercFlags__Pointer,
                                )
                              ) {
                                // Select guy
                                if (uiMercFlags & OWNED_MERC) {
                                  puiNewEvent.value = Enum207.I_SELECT_MERC;
                                }
                              }
                              break;

                            case Enum206.HANDCURSOR_MODE:
                              HandleHandCursorClick(usMapPos, puiNewEvent);
                              break;

                            case Enum206.ACTION_MODE:
                              //*puiNewEvent = A_CHANGE_TO_CONFIM_ACTION;
                              // if(	GetSoldier( &pSoldier, gusSelectedSoldier ) )
                              //{
                              //	pSoldier->sStartGridNo = usMapPos;
                              //	ResetBurstLocations( );
                              //}
                              puiNewEvent.value = Enum207.CA_MERC_SHOOT;
                              break;

                            case Enum206.CONFIRM_MOVE_MODE:
                              if (gusSelectedSoldier != NO_SOLDIER) {
                                if (
                                  MercPtrs[gusSelectedSoldier].usAnimState !=
                                  Enum193.RUNNING
                                ) {
                                  puiNewEvent.value = Enum207.C_MOVE_MERC;
                                } else {
                                  MercPtrs[gusSelectedSoldier].fUIMovementFast =
                                    <boolean>(<unknown>2);
                                  puiNewEvent.value = Enum207.C_MOVE_MERC;
                                }
                              }

                              //*puiNewEvent = C_MOVE_MERC;

                              // if ( gGameSettings.fOptions[ TOPTION_RTCONFIRM ] )
                              {
                                QueryRTLeftButton__fValidDoubleClickPossible =
                                  true;
                              }
                              break;

                            case Enum206.CONFIRM_ACTION_MODE:
                              // Check if we are stationary
                              // if ( AimCubeUIClick( ) )
                              //{
                              //	if ( gusSelectedSoldier != NO_SOLDIER )
                              //	{
                              //		if ( !( gAnimControl[ MercPtrs[ gusSelectedSoldier ]->usAnimState ].uiFlags & ANIM_STATIONARY ) )
                              //		{

                              // gUITargetShotWaiting  = TRUE;
                              // gsUITargetShotGridNo	= usMapPos;
                              //		}
                              //		else
                              //		{
                              //	*puiNewEvent = CA_MERC_SHOOT;
                              //		}
                              puiNewEvent.value = Enum207.CA_MERC_SHOOT;
                              //	}
                              //}
                              break;

                            case Enum206.MOVE_MODE:
                              if (
                                !HandleCheckForExitArrowsInput(false) &&
                                gpItemPointer == null
                              ) {
                                // First check if we clicked on a guy, if so, make selected if it's ours
                                if (
                                  gfUIFullTargetFound &&
                                  guiUIFullTargetFlags & OWNED_MERC
                                ) {
                                  if (
                                    !(guiUIFullTargetFlags & UNCONSCIOUS_MERC)
                                  ) {
                                    // Select guy
                                    if (
                                      (pSoldier =
                                        GetSoldier(gusUIFullTargetID)) !==
                                        null &&
                                      gpItemPointer == null
                                    ) {
                                      if (
                                        pSoldier.bAssignment >=
                                          Enum117.ON_DUTY &&
                                        !(
                                          pSoldier.uiStatusFlags &
                                          SOLDIER_VEHICLE
                                        )
                                      ) {
                                        PopupAssignmentMenuInTactical(pSoldier);
                                      } else {
                                        if (!_KeyDown(ALT)) {
                                          ResetMultiSelection();
                                          puiNewEvent.value =
                                            Enum207.I_SELECT_MERC;
                                        } else {
                                          if (
                                            pSoldier.uiStatusFlags &
                                            SOLDIER_MULTI_SELECTED
                                          ) {
                                            pSoldier.uiStatusFlags &=
                                              ~SOLDIER_MULTI_SELECTED;
                                          } else {
                                            pSoldier.uiStatusFlags |=
                                              SOLDIER_MULTI_SELECTED;
                                            // Say Confimation...
                                            if (
                                              !gGameSettings.fOptions[
                                                Enum8.TOPTION_MUTE_CONFIRMATIONS
                                              ]
                                            )
                                              DoMercBattleSound(
                                                pSoldier,
                                                Enum259.BATTLE_SOUND_ATTN1,
                                              );

                                            // OK, if we have a selected guy.. make him part too....
                                            if (gusSelectedSoldier != NOBODY) {
                                              MercPtrs[
                                                gusSelectedSoldier
                                              ].uiStatusFlags |=
                                                SOLDIER_MULTI_SELECTED;
                                            }
                                          }

                                          gfIgnoreOnSelectedGuy = true;

                                          EndMultiSoldierSelection(false);
                                        }
                                      }
                                    } else {
                                      if (!_KeyDown(ALT)) {
                                        ResetMultiSelection();
                                        puiNewEvent.value =
                                          Enum207.I_SELECT_MERC;
                                      } else {
                                        Assert(pSoldier);
                                        if (
                                          pSoldier.uiStatusFlags &
                                          SOLDIER_MULTI_SELECTED
                                        ) {
                                          pSoldier.uiStatusFlags &=
                                            ~SOLDIER_MULTI_SELECTED;
                                        } else {
                                          pSoldier.uiStatusFlags |=
                                            SOLDIER_MULTI_SELECTED;
                                          // Say Confimation...
                                          if (
                                            !gGameSettings.fOptions[
                                              Enum8.TOPTION_MUTE_CONFIRMATIONS
                                            ]
                                          )
                                            DoMercBattleSound(
                                              pSoldier,
                                              Enum259.BATTLE_SOUND_ATTN1,
                                            );
                                        }

                                        // OK, if we have a selected guy.. make him part too....
                                        if (gusSelectedSoldier != NOBODY) {
                                          MercPtrs[
                                            gusSelectedSoldier
                                          ].uiStatusFlags |=
                                            SOLDIER_MULTI_SELECTED;
                                        }

                                        gfIgnoreOnSelectedGuy = true;

                                        EndMultiSoldierSelection(false);
                                      }
                                    }
                                  }
                                  gfRTClickLeftHoldIntercepted = true;
                                } else {
                                  let bReturnCode: INT8;

                                  bReturnCode = HandleMoveModeInteractiveClick(
                                    usMapPos,
                                    puiNewEvent,
                                  );

                                  if (bReturnCode == -1) {
                                    gfRTClickLeftHoldIntercepted = true;
                                  } else if (bReturnCode == -2) {
                                    // if ( gGameSettings.fOptions[ TOPTION_RTCONFIRM ] )
                                    //{
                                    //	*puiNewEvent = C_WAIT_FOR_CONFIRM;
                                    //	gfPlotNewMovement = TRUE;
                                    //}/
                                    // else
                                    {
                                      let sIntTileGridNo: INT16 = 0;

                                      if (
                                        (pSoldier =
                                          GetSoldier(gusSelectedSoldier)) !==
                                        null
                                      ) {
                                        BeginDisplayTimedCursor(
                                          GetInteractiveTileCursor(
                                            guiCurrentUICursor,
                                            true,
                                          ),
                                          300,
                                        );

                                        if (
                                          pSoldier.usAnimState !=
                                          Enum193.RUNNING
                                        ) {
                                          puiNewEvent.value =
                                            Enum207.C_MOVE_MERC;
                                        } else {
                                          if (
                                            GetCurInteractiveTileGridNo(
                                              createPointer(
                                                () => sIntTileGridNo,
                                                (v) => (sIntTileGridNo = v),
                                              ),
                                            ) != null
                                          ) {
                                            pSoldier.fUIMovementFast = true;
                                            puiNewEvent.value =
                                              Enum207.C_MOVE_MERC;
                                          }
                                        }
                                        QueryRTLeftButton__fValidDoubleClickPossible =
                                          true;
                                      }
                                    }
                                  } else if (bReturnCode == 0) {
                                    if (
                                      (pSoldier =
                                        GetSoldier(gusSelectedSoldier)) !== null
                                    ) {
                                      // First check if we clicked on a guy, if so, make selected if it's ours
                                      if (
                                        FindSoldierFromMouse(
                                          usSoldierIndex__Pointer,
                                          uiMercFlags__Pointer,
                                        ) &&
                                        uiMercFlags & OWNED_MERC
                                      ) {
                                        // Select guy
                                        puiNewEvent.value =
                                          Enum207.I_SELECT_MERC;
                                        gfRTClickLeftHoldIntercepted = true;
                                      } else {
                                        // if ( FindBestPath( pSoldier, usMapPos, pSoldier->bLevel, pSoldier->usUIMovementMode, NO_COPYROUTE, 0 ) == 0 )
                                        if (
                                          gsCurrentActionPoints == 0 &&
                                          !gfUIAllMoveOn &&
                                          !gTacticalStatus.fAtLeastOneGuyOnMultiSelect
                                        ) {
                                          ScreenMsg(
                                            FONT_MCOLOR_LTYELLOW,
                                            MSG_UI_FEEDBACK,
                                            TacticalStr[Enum335.NO_PATH],
                                          );
                                          gfRTClickLeftHoldIntercepted = true;
                                        } else {
                                          let fResult: UINT8 /* boolean */;

                                          if (gusSelectedSoldier != NOBODY) {
                                            if (
                                              (fResult = UIOKMoveDestination(
                                                MercPtrs[gusSelectedSoldier],
                                                usMapPos,
                                              )) == 1
                                            ) {
                                              if (gfUIAllMoveOn) {
                                                // ATE: Select everybody in squad and make move!
                                                {
                                                  // Make move!
                                                  puiNewEvent.value =
                                                    Enum207.C_MOVE_MERC;

                                                  QueryRTLeftButton__fValidDoubleClickPossible =
                                                    true;
                                                }
                                              } else {
                                                // We're on terrain in which we can walk, walk
                                                // If we're on terrain,
                                                if (
                                                  gGameSettings.fOptions[
                                                    Enum8.TOPTION_RTCONFIRM
                                                  ]
                                                ) {
                                                  puiNewEvent.value =
                                                    Enum207.C_WAIT_FOR_CONFIRM;
                                                  gfPlotNewMovement = true;
                                                } else {
                                                  puiNewEvent.value =
                                                    Enum207.C_MOVE_MERC;
                                                  QueryRTLeftButton__fValidDoubleClickPossible =
                                                    true;
                                                }
                                              }
                                            } else {
                                              if (fResult == 2) {
                                                ScreenMsg(
                                                  FONT_MCOLOR_LTYELLOW,
                                                  MSG_UI_FEEDBACK,
                                                  TacticalStr[
                                                    Enum335
                                                      .NOBODY_USING_REMOTE_STR
                                                  ],
                                                );
                                              } else {
                                                // if ( usMapPos != sMoveClickGridNo || pSoldier->uiStatusFlags & SOLDIER_ROBOT )
                                                //{
                                                //		sMoveClickGridNo					= usMapPos;
                                                // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ CANT_MOVE_THERE_STR ] );
                                                //		*puiNewEvent					  = M_CHANGE_TO_HANDMODE;
                                                //		gsOverItemsGridNo				= usMapPos;
                                                //		gsOverItemsLevel				= gsInterfaceLevel;
                                                //	}
                                                //	else
                                                //	{
                                                //		sMoveClickGridNo = 0;
                                                //		*puiNewEvent = M_CHANGE_TO_HANDMODE;
                                                //	}
                                              }
                                              // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, L"Invalid move destination." );

                                              // Goto hand cursor mode...
                                              //*puiNewEvent = M_CHANGE_TO_HANDMODE;

                                              gfRTClickLeftHoldIntercepted =
                                                true;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                                // gfRTClickLeftHoldIntercepted = TRUE;
                              } else {
                                gfRTClickLeftHoldIntercepted = true;
                              }

                              break;

                            case Enum206.LOOKCURSOR_MODE:
                              // If we cannot actually do anything, return to movement mode
                              puiNewEvent.value = Enum207.LC_LOOK;
                              break;

                            case Enum206.JUMPOVER_MODE:
                              puiNewEvent.value = Enum207.JP_JUMP;
                              break;

                            case Enum206.TALKCURSOR_MODE:
                              PauseRT(false);

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

                            case Enum206.RUBBERBAND_MODE:
                              EndRubberBanding();
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
          }

          // Reset flag
          fLeftButtonDown = false;
          fIgnoreLeftUp = false;
          gfRTClickLeftHoldIntercepted = false;
          QueryRTLeftButton__fDoubleClickIntercepted = false;
          QueryRTLeftButton__fCanCheckForSpeechAdvance = false;
          gfStartLookingForRubberBanding = false;

          // Reset counter
          RESETCOUNTER(Enum386.LMOUSECLICK_DELAY_COUNTER);
        }
      }
    } else {
      // Set mouse down to false
      // fLeftButtonDown = FALSE;

      // fCanCheckForSpeechAdvance = FALSE;

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

  /* static */ let QueryRTRightButton__fClickHoldIntercepted: boolean = false;
  /* static */ let QueryRTRightButton__fClickIntercepted: boolean = false;
  /* static */ let QueryRTRightButton__uiSingleClickTime: UINT32;
  /* static */ let QueryRTRightButton__fDoubleClickIntercepted: boolean = false;
  /* static */ let QueryRTRightButton__fValidDoubleClickPossible: boolean =
    false;
  function QueryRTRightButton(puiNewEvent: Pointer<UINT32>): void {
    let pSoldier: SOLDIERTYPE | null;
    let usMapPos: UINT16 = 0;

    if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
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

      // RIGHT MOUSE BUTTON
      if (gViewportRegion.ButtonState & MSYS_RIGHT_BUTTON) {
        if (!fRightButtonDown) {
          fRightButtonDown = true;
          RESETCOUNTER(Enum386.RMOUSECLICK_DELAY_COUNTER);
        }

        // CHECK COMBINATIONS
        if (fLeftButtonDown) {
          // fIgnoreLeftUp = TRUE;
          gfRTHaveClickedRightWhileLeftDown = true;

          if (gpItemPointer == null) {
            // ATE:
            if (gusSelectedSoldier != NOBODY) {
              switch (gCurrentUIMode) {
                case Enum206.CONFIRM_MOVE_MODE:
                case Enum206.MOVE_MODE:
                  if (!gfUIAllMoveOn) {
                    QueryRTRightButton__fValidDoubleClickPossible = true;

                    // OK, our first right-click is an all-cycle
                    if (gfUICanBeginAllMoveCycle) {
                      // ATE: Here, check if we can do this....
                      if (
                        !UIOKMoveDestination(
                          MercPtrs[gusSelectedSoldier],
                          usMapPos,
                        )
                      ) {
                        ScreenMsg(
                          FONT_MCOLOR_LTYELLOW,
                          MSG_UI_FEEDBACK,
                          TacticalStr[Enum335.CANT_MOVE_THERE_STR],
                        );
                        gfRTClickLeftHoldIntercepted = true;
                      }
                      // else if ( gsCurrentActionPoints == 0 )
                      //{
                      //	ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ NO_PATH ] );
                      //	gfRTClickLeftHoldIntercepted = TRUE;
                      //}
                      else {
                        puiNewEvent.value = Enum207.M_CYCLE_MOVE_ALL;
                      }
                    }
                    QueryRTRightButton__fClickHoldIntercepted = true;
                  }
              }

              // ATE: Added cancel of burst mode....
              if (gfBeginBurstSpreadTracking) {
                gfBeginBurstSpreadTracking = false;
                gfRTClickLeftHoldIntercepted = true;
                MercPtrs[gusSelectedSoldier].fDoSpread = 0;
                QueryRTRightButton__fClickHoldIntercepted = true;
                puiNewEvent.value = Enum207.A_END_ACTION;
                gCurrentUIMode = Enum206.MOVE_MODE;
              }
            }
          }
        } else {
          // IF HERE, DO A CLICK-HOLD IF IN INTERVAL
          if (
            COUNTERDONE(Enum386.RMOUSECLICK_DELAY_COUNTER) &&
            !QueryRTRightButton__fClickHoldIntercepted
          ) {
            if (gpItemPointer == null) {
              // Switch on UI mode
              switch (gCurrentUIMode) {
                case Enum206.IDLE_MODE:
                case Enum206.ACTION_MODE:
                case Enum206.HANDCURSOR_MODE:
                case Enum206.LOOKCURSOR_MODE:
                case Enum206.TALKCURSOR_MODE:
                case Enum206.MOVE_MODE:
                  if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
                    if (
                      guiUIFullTargetFlags & OWNED_MERC &&
                      guiUIFullTargetFlags & VISIBLE_MERC &&
                      !(guiUIFullTargetFlags & DEAD_MERC) &&
                      !(pSoldier ? pSoldier.uiStatusFlags & SOLDIER_VEHICLE : 0)
                    ) {
                      // if( pSoldier->bAssignment >= ON_DUTY )
                      {
                        PopupAssignmentMenuInTactical(pSoldier);
                        QueryRTRightButton__fClickHoldIntercepted = true;
                      }
                      break;
                    } else {
                      fShowAssignmentMenu = false;
                      CreateDestroyAssignmentPopUpBoxes();
                      DetermineWhichAssignmentMenusCanBeShown();
                    }

                    // ATE:
                    if (!QueryRTRightButton__fClickHoldIntercepted) {
                      puiNewEvent.value = Enum207.U_MOVEMENT_MENU;
                      QueryRTRightButton__fClickHoldIntercepted = true;
                    }
                    break;
                  }
              }

              if (
                gCurrentUIMode == Enum206.ACTION_MODE ||
                gCurrentUIMode == Enum206.TALKCURSOR_MODE
              ) {
                PauseRT(false);
              }
            }
          }
        }
      } else {
        if (fRightButtonDown) {
          // OK , FOR DOUBLE CLICKS - TAKE TIME STAMP & RECORD EVENT
          if (GetJA2Clock() - QueryRTRightButton__uiSingleClickTime < 300) {
            // CHECK HERE FOR DOUBLE CLICK EVENTS
            if (QueryRTRightButton__fValidDoubleClickPossible) {
              QueryRTRightButton__fDoubleClickIntercepted = true;

              // Do stuff....
              // OK, check if left button down...
              if (fLeftButtonDown) {
                if (gpItemPointer == null) {
                  if (
                    !QueryRTRightButton__fClickIntercepted &&
                    !QueryRTRightButton__fClickHoldIntercepted
                  ) {
                    // ATE:
                    if (gusSelectedSoldier != NOBODY) {
                      // fIgnoreLeftUp = TRUE;
                      switch (gCurrentUIMode) {
                        case Enum206.CONFIRM_MOVE_MODE:
                        case Enum206.MOVE_MODE:
                          if (gfUIAllMoveOn) {
                            // OK, now we wish to run!
                            gfUIAllMoveOn = 2;
                          }
                      }
                    }
                  }
                }
              }
            }
          }

          // Capture time!
          QueryRTRightButton__uiSingleClickTime = GetJA2Clock();

          QueryRTRightButton__fValidDoubleClickPossible = true;

          if (!QueryRTRightButton__fDoubleClickIntercepted) {
            // CHECK COMBINATIONS
            if (fLeftButtonDown) {
              if (gpItemPointer == null) {
                if (
                  !QueryRTRightButton__fClickHoldIntercepted &&
                  !QueryRTRightButton__fClickIntercepted
                ) {
                  // ATE:
                  if (gusSelectedSoldier != NOBODY) {
                    // fIgnoreLeftUp = TRUE;
                    switch (gCurrentUIMode) {
                      case Enum206.CONFIRM_MOVE_MODE:
                      case Enum206.MOVE_MODE:
                        if (gfUIAllMoveOn) {
                          gfUIAllMoveOn = 0;
                          gfUICanBeginAllMoveCycle = true;
                        }
                    }
                  }
                }
              }
            } else {
              if (
                !QueryRTRightButton__fClickHoldIntercepted &&
                !QueryRTRightButton__fClickIntercepted
              ) {
                if (gpItemPointer == null) {
                  // ATE:
                  if (gusSelectedSoldier != NOBODY) {
                    // Switch on UI mode
                    switch (gCurrentUIMode) {
                      case Enum206.IDLE_MODE:
                        break;

                      case Enum206.CONFIRM_MOVE_MODE:
                      case Enum206.MOVE_MODE:
                      case Enum206.TALKCURSOR_MODE:
                        {
                          // We have here a change to action mode
                          puiNewEvent.value = Enum207.M_CHANGE_TO_ACTION;
                        }
                        QueryRTRightButton__fClickIntercepted = true;
                        break;

                      case Enum206.ACTION_MODE:
                        // We have here a change to move mode
                        puiNewEvent.value = Enum207.A_END_ACTION;
                        QueryRTRightButton__fClickIntercepted = true;
                        break;

                      case Enum206.CONFIRM_ACTION_MODE:
                        if (
                          (pSoldier = GetSoldier(gusSelectedSoldier)) !== null
                        ) {
                          HandleRightClickAdjustCursor(pSoldier, usMapPos);
                        }
                        QueryRTRightButton__fClickIntercepted = true;
                        break;

                      case Enum206.MENU_MODE:
                        // If we get a hit here and we're in menu mode, quit the menu mode
                        EndMenuEvent(guiCurrentEvent);
                        QueryRTRightButton__fClickIntercepted = true;
                        break;

                      case Enum206.HANDCURSOR_MODE:
                        // If we cannot actually do anything, return to movement mode
                        puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                        break;

                      case Enum206.LOOKCURSOR_MODE:
                        // If we cannot actually do anything, return to movement mode
                        puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
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
          QueryRTRightButton__fClickHoldIntercepted = false;
          QueryRTRightButton__fClickIntercepted = false;
          QueryRTRightButton__fDoubleClickIntercepted = false;

          // Reset counter
          RESETCOUNTER(Enum386.RMOUSECLICK_DELAY_COUNTER);
        }
      }
    }
  }

  /* static */ let GetRTMousePositionInput__usOldMapPos: UINT16 = 0;
  /* static */ let GetRTMousePositionInput__uiMoveTargetSoldierId: UINT32 =
    NO_SOLDIER;
  /* static */ let GetRTMousePositionInput__fOnValidGuy: boolean = false;
  export function GetRTMousePositionInput(puiNewEvent: Pointer<UINT32>): void {
    let usMapPos: UINT16 = 0;
    let pSoldier: SOLDIERTYPE | null;

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
        case Enum206.RUBBERBAND_MODE:
          // ATE: Make sure!
          if (gRubberBandActive == false) {
            puiNewEvent.value = Enum207.M_ON_TERRAIN;
          } else {
            puiNewEvent.value = Enum207.RB_ON_TERRAIN;
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

        case Enum206.LOCKUI_MODE:
          puiNewEvent.value = Enum207.LU_ON_TERRAIN;
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
          if (GetRTMousePositionInput__uiMoveTargetSoldierId != NOBODY) {
            if (gfUIFullTargetFound) {
              if (
                gusUIFullTargetID !=
                GetRTMousePositionInput__uiMoveTargetSoldierId
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
          if (HandleOpenDoorMenu()) {
            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
          }
          break;

        case Enum206.HANDCURSOR_MODE:
          puiNewEvent.value = Enum207.HC_ON_TERRAIN;
          break;

        case Enum206.MOVE_MODE:
          if (usMapPos != GetRTMousePositionInput__usOldMapPos) {
            // Set off ALL move....
            gfUIAllMoveOn = 0;
          }

          GetRTMousePositionInput__uiMoveTargetSoldierId = NO_SOLDIER;

          // Check for being on terrain
          if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
            let usItem: UINT16;
            let ubItemCursor: UINT8;

            // Alrighty, check what's in our hands = if a 'friendly thing', like med kit, look for our own guys
            usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

            // get cursor for item
            ubItemCursor = GetActionModeCursor(pSoldier);

            //
            if (IsValidJumpLocation(pSoldier, usMapPos, true)) {
              puiNewEvent.value = Enum207.JP_ON_TERRAIN;
              gsJumpOverGridNo = usMapPos;
              return;
            } else {
              if (gfUIFullTargetFound) {
                if (
                  IsValidTalkableNPC(gusUIFullTargetID, false, false, false) &&
                  !_KeyDown(SHIFT) &&
                  !AM_AN_EPC(pSoldier) &&
                  MercPtrs[gusUIFullTargetID].bTeam != ENEMY_TEAM &&
                  !ValidQuickExchangePosition()
                ) {
                  GetRTMousePositionInput__uiMoveTargetSoldierId =
                    gusUIFullTargetID;
                  puiNewEvent.value = Enum207.T_CHANGE_TO_TALKING;
                  return;
                } else if (ubItemCursor == AIDCURS) {
                  // IF it's an ememy, goto confirm action mode
                  if (
                    guiUIFullTargetFlags & OWNED_MERC &&
                    guiUIFullTargetFlags & VISIBLE_MERC &&
                    !(guiUIFullTargetFlags & DEAD_MERC)
                  ) {
                    // uiMoveTargetSoldierId = gusUIFullTargetID;
                    //*puiNewEvent = A_ON_TERRAIN;
                    // return;
                  }
                } else {
                  // IF it's an ememy, goto confirm action mode
                  if (
                    guiUIFullTargetFlags & ENEMY_MERC &&
                    guiUIFullTargetFlags & VISIBLE_MERC &&
                    !(guiUIFullTargetFlags & DEAD_MERC)
                  ) {
                    GetRTMousePositionInput__uiMoveTargetSoldierId =
                      gusUIFullTargetID;
                    puiNewEvent.value = Enum207.A_ON_TERRAIN;
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

          GetRTMousePositionInput__fOnValidGuy = false;

          if (gfUIFullTargetFound) {
            // if ( gfUIFullTargetFound )
            if (IsValidTargetMerc(gusUIFullTargetID)) {
              guiUITargetSoldierId = gusUIFullTargetID;

              if (MercPtrs[gusUIFullTargetID].bTeam != gbPlayerNum) {
                GetRTMousePositionInput__fOnValidGuy = true;
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

        case Enum206.CONFIRM_MOVE_MODE:
          if (usMapPos != GetRTMousePositionInput__usOldMapPos) {
            // Switch event out of confirm mode
            // Set off ALL move....
            gfUIAllMoveOn = 0;

            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
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
            if (
              ConfirmActionCancel(
                usMapPos,
                GetRTMousePositionInput__usOldMapPos,
              )
            ) {
              // Switch event out of confirm mode
              puiNewEvent.value = Enum207.CA_END_CONFIRM_ACTION;
            } else {
              puiNewEvent.value = Enum207.CA_ON_TERRAIN;
            }
          }
          break;
      }

      // if ( gCurrentUIMode != CONFIRM_ACTION_MODE )
      //{
      //	if(	GetSoldier( &pSoldier, gusSelectedSoldier ) )
      //	{
      // Change refine value back to 1
      ///		pSoldier->bShownAimTime = REFINE_AIM_1;
      //	}
      //}

      GetRTMousePositionInput__usOldMapPos = usMapPos;
    }
  }
}
