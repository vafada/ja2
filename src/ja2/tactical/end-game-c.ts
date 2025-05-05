namespace ja2 {
  let sStatueGridNos: INT16[] /* [] */ = [13829, 13830, 13669, 13670];

  let gpKillerSoldier: SOLDIERTYPE | null = null;
  let gsGridNo: INT16;
  let gbLevel: INT8;

  // This function checks if our statue exists in the current sector at given gridno
  export function DoesO3SectorStatueExistHere(sGridNo: INT16): boolean {
    let cnt: INT32;
    let ExitGrid: EXITGRID = createExitGrid();

    // First check current sector......
    if (
      gWorldSectorX == 3 &&
      gWorldSectorY == MAP_ROW_O &&
      gbWorldSectorZ == 0
    ) {
      // Check for exitence of and exit grid here...
      // ( if it doesn't then the change has already taken place )
      if (!GetExitGrid(13669, ExitGrid)) {
        for (cnt = 0; cnt < 4; cnt++) {
          if (sStatueGridNos[cnt] == sGridNo) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // This function changes the graphic of the statue and adds the exit grid...
  export function ChangeO3SectorStatue(fFromExplosion: boolean): void {
    let ExitGrid: EXITGRID = createExitGrid();
    let usTileIndex: UINT16;
    let sX: INT16;
    let sY: INT16;

    // Remove old graphic
    ApplyMapChangesToMapTempFile(true);
    // Remove it!
    // Get index for it...
    usTileIndex = GetTileIndexFromTypeSubIndex(Enum313.EIGHTOSTRUCT, 5);
    RemoveStruct(13830, usTileIndex);

    // Add new one...
    if (fFromExplosion) {
      // Use damaged peice
      usTileIndex = GetTileIndexFromTypeSubIndex(Enum313.EIGHTOSTRUCT, 7);
    } else {
      usTileIndex = GetTileIndexFromTypeSubIndex(Enum313.EIGHTOSTRUCT, 8);
      // Play sound...

      PlayJA2Sample(Enum330.OPEN_STATUE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
    }
    AddStructToHead(13830, usTileIndex);

    // Add exit grid
    ExitGrid.ubGotoSectorX = 3;
    ExitGrid.ubGotoSectorY = MAP_ROW_O;
    ExitGrid.ubGotoSectorZ = 1;
    ExitGrid.usGridNo = 13037;

    AddExitGridToWorld(13669, ExitGrid);
    gpWorldLevelData[13669].uiFlags |= MAPELEMENT_REVEALED;

    // Turn off permenant changes....
    ApplyMapChangesToMapTempFile(false);

    // Re-render the world!
    gTacticalStatus.uiFlags |= NOHIDE_REDUNDENCY;
    // FOR THE NEXT RENDER LOOP, RE-EVALUATE REDUNDENT TILES
    InvalidateWorldRedundency();
    SetRenderFlags(RENDER_FLAG_FULL);

    // Redo movement costs....
    ({ sX, sY } = ConvertGridNoToXY(13830));

    RecompileLocalMovementCostsFromRadius(13830, 5);
  }

  function DeidrannaTimerCallback(): void {
    HandleDeidrannaDeath(gpKillerSoldier, gsGridNo, gbLevel);
  }

  export function BeginHandleDeidrannaDeath(
    pKillerSoldier: SOLDIERTYPE,
    sGridNo: INT16,
    bLevel: INT8,
  ): void {
    gpKillerSoldier = pKillerSoldier;
    gsGridNo = sGridNo;
    gbLevel = bLevel;

    // Lock the UI.....
    gTacticalStatus.uiFlags |= ENGAGED_IN_CONV;
    // Increment refrence count...
    giNPCReferenceCount = 1;

    gTacticalStatus.uiFlags |= IN_DEIDRANNA_ENDGAME;

    SetCustomizableTimerCallbackAndDelay(2000, DeidrannaTimerCallback, false);
  }

  function HandleDeidrannaDeath(
    pKillerSoldier: SOLDIERTYPE | null,
    sGridNo: INT16,
    bLevel: INT8,
  ): void {
    let pTeamSoldier: SOLDIERTYPE;
    let cnt: INT32;
    let sDistVisible: INT16 = 0;
    let ubKillerSoldierID: UINT8 = NOBODY;

    // Start victory music here...
    SetMusicMode(Enum328.MUSIC_TACTICAL_VICTORY);

    if (pKillerSoldier) {
      TacticalCharacterDialogue(
        pKillerSoldier,
        Enum202.QUOTE_KILLING_DEIDRANNA,
      );
      ubKillerSoldierID = pKillerSoldier.ubID;
    }

    // STEP 1 ) START ALL QUOTES GOING!
    // OK - loop through all witnesses and see if they want to say something abou this...
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

    // run through list
    for (
      pTeamSoldier = MercPtrs[cnt];
      cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
      cnt++, pTeamSoldier = MercPtrs[cnt]
    ) {
      if (cnt != ubKillerSoldierID) {
        if (
          OK_INSECTOR_MERC(pTeamSoldier) &&
          !(pTeamSoldier.uiStatusFlags & SOLDIER_GASSED) &&
          !AM_AN_EPC(pTeamSoldier)
        ) {
          if (QuoteExp_WitnessDeidrannaDeath[pTeamSoldier.ubProfile]) {
            // Can we see location?
            sDistVisible = DistanceVisible(
              pTeamSoldier,
              Enum245.DIRECTION_IRRELEVANT,
              Enum245.DIRECTION_IRRELEVANT,
              sGridNo,
              bLevel,
            );

            if (
              SoldierTo3DLocationLineOfSightTest(
                pTeamSoldier,
                sGridNo,
                bLevel,
                3,
                sDistVisible,
                true,
              )
            ) {
              TacticalCharacterDialogue(
                pTeamSoldier,
                Enum202.QUOTE_KILLING_DEIDRANNA,
              );
            }
          }
        }
      }
    }

    // Set fact that she is dead!
    SetFactTrue(Enum170.FACT_QUEEN_DEAD);

    ExecuteStrategicAIAction(Enum173.STRATEGIC_AI_ACTION_QUEEN_DEAD, 0, 0);

    // AFTER LAST ONE IS DONE - PUT SPECIAL EVENT ON QUEUE TO BEGIN FADE< ETC
    SpecialCharacterDialogueEvent(
      DIALOGUE_SPECIAL_EVENT_MULTIPURPOSE,
      MULTIPURPOSE_SPECIAL_EVENT_DONE_KILLING_DEIDRANNA,
      0,
      0,
      0,
      0,
    );
  }

  function DoneFadeInKilledQueen(): void {
    let pNPCSoldier: SOLDIERTYPE | null;

    // Locate gridno.....

    // Run NPC script
    pNPCSoldier = FindSoldierByProfileID(136, false);
    if (!pNPCSoldier) {
      return;
    }

    // Converse!
    // InitiateConversation( pNPCSoldier, pSoldier, 0, 1 );
    TriggerNPCRecordImmediately(pNPCSoldier.ubProfile, 6);
  }

  function DoneFadeOutKilledQueen(): void {
    let cnt: INT32;
    let pSoldier: SOLDIERTYPE;
    let pTeamSoldier: SOLDIERTYPE;

    // For one, loop through our current squad and move them over
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

    // look for all mercs on the same team,
    for (
      pSoldier = MercPtrs[cnt];
      cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
      cnt++, pSoldier = MercPtrs[cnt]
    ) {
      // Are we in this sector, On the current squad?
      if (
        pSoldier.bActive &&
        pSoldier.bLife >= OKLIFE &&
        pSoldier.bInSector &&
        pSoldier.bAssignment == CurrentSquad()
      ) {
        gfTacticalTraversal = true;
        SetGroupSectorValue(3, MAP_ROW_P, 0, pSoldier.ubGroupID);

        // Set next sectore
        pSoldier.sSectorX = 3;
        pSoldier.sSectorY = MAP_ROW_P;
        pSoldier.bSectorZ = 0;

        // Set gridno
        pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
        pSoldier.usStrategicInsertionData = 5687;
        // Set direction to face....
        pSoldier.ubInsertionDirection = 100 + Enum245.NORTHWEST;
      }
    }

    // Kill all enemies in world.....
    cnt = gTacticalStatus.Team[ENEMY_TEAM].bFirstID;

    // look for all mercs on the same team,
    for (
      pTeamSoldier = MercPtrs[cnt];
      cnt <= gTacticalStatus.Team[ENEMY_TEAM].bLastID;
      cnt++, pTeamSoldier = MercPtrs[cnt]
    ) {
      // Are we active and in sector.....
      if (pTeamSoldier.bActive) {
        // For sure for flag thet they are dead is not set
        // Check for any more badguys
        // ON THE STRAGETY LAYER KILL BAD GUYS!
        if (!pTeamSoldier.bNeutral && pTeamSoldier.bSide != gbPlayerNum) {
          ProcessQueenCmdImplicationsOfDeath(pSoldier);
        }
      }
    }

    // 'End' battle
    ExitCombatMode();
    gTacticalStatus.fLastBattleWon = true;
    // Set enemy presence to false
    gTacticalStatus.fEnemyInSector = false;

    SetMusicMode(Enum328.MUSIC_TACTICAL_VICTORY);

    HandleMoraleEvent(null, Enum234.MORALE_QUEEN_BATTLE_WON, 3, MAP_ROW_P, 0);
    HandleGlobalLoyaltyEvent(
      Enum190.GLOBAL_LOYALTY_QUEEN_BATTLE_WON,
      3,
      MAP_ROW_P,
      0,
    );

    SetMusicMode(Enum328.MUSIC_TACTICAL_VICTORY);

    SetThisSectorAsPlayerControlled(
      gWorldSectorX,
      gWorldSectorY,
      gbWorldSectorZ,
      true,
    );

    // ATE: Force change of level set z to 1
    gbWorldSectorZ = 1;

    // Clear out dudes.......
    SectorInfo[Enum123.SEC_P3].ubNumAdmins = 0;
    SectorInfo[Enum123.SEC_P3].ubNumTroops = 0;
    SectorInfo[Enum123.SEC_P3].ubNumElites = 0;
    SectorInfo[Enum123.SEC_P3].ubAdminsInBattle = 0;
    SectorInfo[Enum123.SEC_P3].ubTroopsInBattle = 0;
    SectorInfo[Enum123.SEC_P3].ubElitesInBattle = 0;

    // ATE: GEt rid of elliot in P3...
    gMercProfiles[Enum268.ELLIOT].sSectorX = 1;

    ChangeNpcToDifferentSector(Enum268.DEREK, 3, MAP_ROW_P, 0);
    ChangeNpcToDifferentSector(Enum268.OLIVER, 3, MAP_ROW_P, 0);

    // OK, insertion data found, enter sector!
    SetCurrentWorldSector(3, MAP_ROW_P, 0);

    // OK, once down here, adjust the above map with crate info....
    gfTacticalTraversal = false;
    gpTacticalTraversalGroup = null;
    gpTacticalTraversalChosenSoldier = null;

    gFadeInDoneCallback = DoneFadeInKilledQueen;

    FadeInGameScreen();
  }

  // Called after all player quotes are done....
  export function HandleDoneLastKilledQueenQuote(): void {
    gFadeOutDoneCallback = DoneFadeOutKilledQueen;

    FadeOutGameScreen();
  }

  export function EndQueenDeathEndgameBeginEndCimenatic(): void {
    let cnt: INT32;
    let pSoldier: SOLDIERTYPE;

    // Start end cimimatic....
    gTacticalStatus.uiFlags |= IN_ENDGAME_SEQUENCE;

    // first thing is to loop through team and say end quote...
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

    // look for all mercs on the same team,
    for (
      pSoldier = MercPtrs[cnt];
      cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
      cnt++, pSoldier = MercPtrs[cnt]
    ) {
      // Are we in this sector, On the current squad?
      if (
        pSoldier.bActive &&
        pSoldier.bLife >= OKLIFE &&
        !AM_AN_EPC(pSoldier)
      ) {
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_END_GAME_COMMENT);
      }
    }

    // Add queue event to proceed w/ smacker cimimatic
    SpecialCharacterDialogueEvent(
      DIALOGUE_SPECIAL_EVENT_MULTIPURPOSE,
      MULTIPURPOSE_SPECIAL_EVENT_TEAM_MEMBERS_DONE_TALKING,
      0,
      0,
      0,
      0,
    );
  }

  export function EndQueenDeathEndgame(): void {
    // Unset flags...
    gTacticalStatus.uiFlags &= ~ENGAGED_IN_CONV;
    // Increment refrence count...
    giNPCReferenceCount = 0;

    gTacticalStatus.uiFlags &= ~IN_DEIDRANNA_ENDGAME;
  }

  function DoneFadeOutEndCinematic(): void {
    // DAVE PUT SMAKER STUFF HERE!!!!!!!!!!!!
    // :)
    gTacticalStatus.uiFlags &= ~IN_ENDGAME_SEQUENCE;

    // For now, just quit the freaken game...
    //	InternalLeaveTacticalScreen( MAINMENU_SCREEN );

    InternalLeaveTacticalScreen(Enum26.INTRO_SCREEN);
    //	guiCurrentScreen = INTRO_SCREEN;

    SetIntroType(Enum21.INTRO_ENDING);
  }

  // OK, end death UI - fade to smaker....
  export function HandleDoneLastEndGameQuote(): void {
    EndQueenDeathEndgame();

    gFadeOutDoneCallback = DoneFadeOutEndCinematic;

    FadeOutGameScreen();
  }

  function QueenBitchTimerCallback(): void {
    HandleQueenBitchDeath(gpKillerSoldier, gsGridNo, gbLevel);
  }

  export function BeginHandleQueenBitchDeath(
    pKillerSoldier: SOLDIERTYPE,
    sGridNo: INT16,
    bLevel: INT8,
  ): void {
    let pTeamSoldier: SOLDIERTYPE;
    let cnt: INT32;

    gpKillerSoldier = pKillerSoldier;
    gsGridNo = sGridNo;
    gbLevel = bLevel;

    // Lock the UI.....
    gTacticalStatus.uiFlags |= ENGAGED_IN_CONV;
    // Increment refrence count...
    giNPCReferenceCount = 1;

    // gTacticalStatus.uiFlags |= IN_DEIDRANNA_ENDGAME;

    SetCustomizableTimerCallbackAndDelay(3000, QueenBitchTimerCallback, false);

    // Kill all enemies in creature team.....
    cnt = gTacticalStatus.Team[CREATURE_TEAM].bFirstID;

    // look for all mercs on the same team,
    for (
      pTeamSoldier = MercPtrs[cnt];
      cnt <= gTacticalStatus.Team[CREATURE_TEAM].bLastID;
      cnt++, pTeamSoldier = MercPtrs[cnt]
    ) {
      // Are we active and ALIVE and in sector.....
      if (pTeamSoldier.bActive && pTeamSoldier.bLife > 0) {
        // For sure for flag thet they are dead is not set
        // Check for any more badguys
        // ON THE STRAGETY LAYER KILL BAD GUYS!

        // HELLO!  THESE ARE CREATURES!  THEY CAN'T BE NEUTRAL!
        // if ( !pTeamSoldier->bNeutral && (pTeamSoldier->bSide != gbPlayerNum ) )
        {
          gTacticalStatus.ubAttackBusyCount++;
          EVENT_SoldierGotHit(
            pTeamSoldier,
            0,
            10000,
            0,
            pTeamSoldier.bDirection,
            320,
            NOBODY,
            FIRE_WEAPON_NO_SPECIAL,
            pTeamSoldier.bAimShotLocation,
            0,
            NOWHERE,
          );
        }
      }
    }
  }

  function HandleQueenBitchDeath(
    pKillerSoldier: SOLDIERTYPE | null,
    sGridNo: INT16,
    bLevel: INT8,
  ): void {
    let pTeamSoldier: SOLDIERTYPE;
    let cnt: INT32;
    let sDistVisible: INT16 = 0;
    let ubKillerSoldierID: UINT8 = NOBODY;

    // Start victory music here...
    SetMusicMode(Enum328.MUSIC_TACTICAL_VICTORY);

    if (pKillerSoldier) {
      TacticalCharacterDialogue(pKillerSoldier, Enum202.QUOTE_KILLING_QUEEN);
      ubKillerSoldierID = pKillerSoldier.ubID;
    }

    // STEP 1 ) START ALL QUOTES GOING!
    // OK - loop through all witnesses and see if they want to say something abou this...
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

    // run through list
    for (
      pTeamSoldier = MercPtrs[cnt];
      cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
      cnt++, pTeamSoldier = MercPtrs[cnt]
    ) {
      if (cnt != ubKillerSoldierID) {
        if (
          OK_INSECTOR_MERC(pTeamSoldier) &&
          !(pTeamSoldier.uiStatusFlags & SOLDIER_GASSED) &&
          !AM_AN_EPC(pTeamSoldier)
        ) {
          if (QuoteExp_WitnessQueenBugDeath[pTeamSoldier.ubProfile]) {
            // Can we see location?
            sDistVisible = DistanceVisible(
              pTeamSoldier,
              Enum245.DIRECTION_IRRELEVANT,
              Enum245.DIRECTION_IRRELEVANT,
              sGridNo,
              bLevel,
            );

            if (
              SoldierTo3DLocationLineOfSightTest(
                pTeamSoldier,
                sGridNo,
                bLevel,
                3,
                sDistVisible,
                true,
              )
            ) {
              TacticalCharacterDialogue(
                pTeamSoldier,
                Enum202.QUOTE_KILLING_QUEEN,
              );
            }
          }
        }
      }
    }

    // Set fact that she is dead!
    if (CheckFact(Enum170.FACT_QUEEN_DEAD, 0)) {
      EndQueenDeathEndgameBeginEndCimenatic();
    } else {
      // Unset flags...
      gTacticalStatus.uiFlags &= ~ENGAGED_IN_CONV;
      // Increment refrence count...
      giNPCReferenceCount = 0;
    }
  }
}
