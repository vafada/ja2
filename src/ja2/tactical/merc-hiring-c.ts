namespace ja2 {
  const MIN_FLIGHT_PREP_TIME = 6;

  // ATE: Globals that dictate where the mercs will land once being hired
  // Default to Omerta
  // Saved in general saved game structure
  export let gsMercArriveSectorX: INT16 = 9;
  export let gsMercArriveSectorY: INT16 = 1;

  export function HireMerc(pHireMerc: MERC_HIRE_STRUCT): INT8 {
    let pSoldier: SOLDIERTYPE;
    let iNewIndex: UINT8 = 0;
    let ubCount: UINT8 = 0;
    let ubCurrentSoldier: UINT8 = pHireMerc.ubProfileID;
    let pMerc: MERCPROFILESTRUCT;
    let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    let fReturn: boolean = false;
    pMerc = gMercProfiles[ubCurrentSoldier];

    // If we are to disregard the ststus of the merc
    // If the merc is away, Dont hire him, or if the merc is only slightly annoyed at the player
    if (
      pMerc.bMercStatus != 0 &&
      pMerc.bMercStatus != MERC_ANNOYED_BUT_CAN_STILL_CONTACT &&
      pMerc.bMercStatus != MERC_HIRED_BUT_NOT_ARRIVED_YET
    )
      return MERC_HIRE_FAILED;

    if (NumberOfMercsOnPlayerTeam() >= 18) return MERC_HIRE_OVER_20_MERCS_HIRED;

    // ATE: if we are to use landing zone, update to latest value
    // they will be updated again just before arrival...
    if (pHireMerc.fUseLandingZoneForArrival) {
      pHireMerc.sSectorX = gsMercArriveSectorX;
      pHireMerc.sSectorY = gsMercArriveSectorY;
      pHireMerc.bSectorZ = 0;
    }

    // BUILD STRUCTURES
    MercCreateStruct.ubProfile = ubCurrentSoldier;
    MercCreateStruct.fPlayerMerc = true;
    MercCreateStruct.sSectorX = pHireMerc.sSectorX;
    MercCreateStruct.sSectorY = pHireMerc.sSectorY;
    MercCreateStruct.bSectorZ = pHireMerc.bSectorZ;
    MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
    MercCreateStruct.fCopyProfileItemsOver = pHireMerc.fCopyProfileItemsOver;

    if (
      !TacticalCreateSoldier(
        MercCreateStruct,
        createPointer(
          () => iNewIndex,
          (v) => (iNewIndex = v),
        ),
      )
    ) {
      DebugMsg(
        TOPIC_JA2,
        DBG_LEVEL_3,
        "TacticalCreateSoldier in HireMerc():  Failed to Add Merc",
      );
      return MERC_HIRE_FAILED;
    }

    if (DidGameJustStart()) {
      // OK, CHECK FOR FIRST GUY, GIVE HIM SPECIAL ITEM!
      if (iNewIndex == 0) {
        // OK, give this item to our merc!
        let Object: OBJECTTYPE = createObjectType();

        // make an objecttype
        Object.usItem = Enum225.LETTER;
        Object.ubNumberOfObjects = 1;
        Object.bStatus[0] = 100;
        // Give it
        fReturn = AutoPlaceObject(MercPtrs[iNewIndex], Object, false);
        Assert(fReturn);
      }

      // Set insertion for first time in chopper

      // ATE: Insert for demo , not using the heli sequence....
      pHireMerc.ubInsertionCode = Enum175.INSERTION_CODE_CHOPPER;
    }

    // record how long the merc will be gone for
    pMerc.bMercStatus = pHireMerc.iTotalContractLength;

    pSoldier = Menptr[iNewIndex];

    // Copy over insertion data....
    pSoldier.ubStrategicInsertionCode = pHireMerc.ubInsertionCode;
    pSoldier.usStrategicInsertionData = pHireMerc.usInsertionData;
    // ATE: Copy over value for using alnding zone to soldier type
    pSoldier.fUseLandingZoneForArrival = pHireMerc.fUseLandingZoneForArrival;

    // Set assignment
    // ATE: If first time, make ON_DUTY, otherwise GUARD
    if (pSoldier.bAssignment != Enum117.IN_TRANSIT) {
      SetTimeOfAssignmentChangeForMerc(pSoldier);
    }
    ChangeSoldiersAssignment(pSoldier, Enum117.IN_TRANSIT);

    // set the contract length
    pSoldier.iTotalContractLength = pHireMerc.iTotalContractLength;

    // reset the insurance values
    pSoldier.iStartOfInsuranceContract = 0;
    pSoldier.iTotalLengthOfInsuranceContract = 0;

    // Init the contract charge
    //	pSoldier->iTotalContractCharge = 0;

    // store arrival time in soldier structure so map screen can display it
    pSoldier.uiTimeSoldierWillArrive = pHireMerc.uiTimeTillMercArrives;

    // Set the type of merc

    if (DidGameJustStart()) {
      // Set time of initial merc arrival in minutes
      pHireMerc.uiTimeTillMercArrives = Math.trunc(
        (STARTING_TIME + FIRST_ARRIVAL_DELAY) / NUM_SEC_IN_MIN,
      );

      // ATE: Insert for demo , not using the heli sequence....
      // Set insertion for first time in chopper
      pHireMerc.ubInsertionCode = Enum175.INSERTION_CODE_CHOPPER;

      // set when the merc's contract is finished
      pSoldier.iEndofContractTime =
        GetMidnightOfFutureDayInMinutes(pSoldier.iTotalContractLength) +
        GetHourWhenContractDone(pSoldier) * 60;
    } else {
      // set when the merc's contract is finished ( + 1 cause it takes a day for the merc to arrive )
      pSoldier.iEndofContractTime =
        GetMidnightOfFutureDayInMinutes(1 + pSoldier.iTotalContractLength) +
        GetHourWhenContractDone(pSoldier) * 60;
    }

    // Set the time and ID of the last hired merc will arrive
    LaptopSaveInfo.sLastHiredMerc.iIdOfMerc = pHireMerc.ubProfileID;
    LaptopSaveInfo.sLastHiredMerc.uiArrivalTime =
      pHireMerc.uiTimeTillMercArrives;

    // if we are trying to hire a merc that should arrive later, put the merc in the queue
    if (pHireMerc.uiTimeTillMercArrives != 0) {
      AddStrategicEvent(
        Enum132.EVENT_DELAYED_HIRING_OF_MERC,
        pHireMerc.uiTimeTillMercArrives,
        pSoldier.ubID,
      );

      // specify that the merc is hired but hasnt arrived yet
      pMerc.bMercStatus = MERC_HIRED_BUT_NOT_ARRIVED_YET;
    }

    // if the merc is an AIM merc
    if (ubCurrentSoldier < 40) {
      pSoldier.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__AIM_MERC;
      // determine how much the contract is, and remember what type of contract he got
      if (pHireMerc.iTotalContractLength == 1) {
        // pSoldier->iTotalContractCharge = gMercProfiles[ pSoldier->ubProfile ].sSalary;
        pSoldier.bTypeOfLastContract = Enum161.CONTRACT_EXTEND_1_DAY;
        pSoldier.iTimeCanSignElsewhere = GetWorldTotalMin();
      } else if (pHireMerc.iTotalContractLength == 7) {
        // pSoldier->iTotalContractCharge = gMercProfiles[ pSoldier->ubProfile ].uiWeeklySalary;
        pSoldier.bTypeOfLastContract = Enum161.CONTRACT_EXTEND_1_WEEK;
        pSoldier.iTimeCanSignElsewhere = GetWorldTotalMin();
      } else if (pHireMerc.iTotalContractLength == 14) {
        // pSoldier->iTotalContractCharge = gMercProfiles[ pSoldier->ubProfile ].uiBiWeeklySalary;
        pSoldier.bTypeOfLastContract = Enum161.CONTRACT_EXTEND_2_WEEK;
        // These luck fellows need to stay the whole duration!
        pSoldier.iTimeCanSignElsewhere = pSoldier.iEndofContractTime;
      }

      // remember the medical deposit we PAID.  The one in his profile can increase when he levels!
      pSoldier.usMedicalDeposit =
        gMercProfiles[pSoldier.ubProfile].sMedicalDepositAmount;
    }
    // if the merc is from M.E.R.C.
    else if (ubCurrentSoldier >= 40 && ubCurrentSoldier <= 50) {
      pSoldier.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__MERC;
      // pSoldier->iTotalContractCharge = -1;

      gMercProfiles[pSoldier.ubProfile].iMercMercContractLength = 1;

      // Set starting conditions for the merc
      pSoldier.iStartContractTime = GetWorldDay();

      AddHistoryToPlayersLog(
        Enum83.HISTORY_HIRED_MERC_FROM_MERC,
        ubCurrentSoldier,
        GetWorldTotalMin(),
        -1,
        -1,
      );
    }
    // If the merc is from IMP, (ie a player character)
    else if (ubCurrentSoldier >= 51 && ubCurrentSoldier < 57) {
      pSoldier.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__PLAYER_CHARACTER;
      // pSoldier->iTotalContractCharge = -1;
    }
    // else its a NPC merc
    else {
      pSoldier.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__NPC;
      // pSoldier->iTotalContractCharge = -1;
    }

    // remove the merc from the Personnel screens departed list ( if they have never been hired before, its ok to call it )
    RemoveNewlyHiredMercFromPersonnelDepartedList(pSoldier.ubProfile);

    gfAtLeastOneMercWasHired = true;
    return MERC_HIRE_OK;
  }

  export function MercArrivesCallback(ubSoldierID: UINT8): void {
    let pMerc: MERCPROFILESTRUCT;
    let pSoldier: SOLDIERTYPE;
    let uiTimeOfPost: UINT32;

    if (
      !DidGameJustStart() &&
      gsMercArriveSectorX == 9 &&
      gsMercArriveSectorY == 1
    ) {
      // Mercs arriving in A9.  This sector has been deemed as the always safe sector.
      // Seeing we don't support entry into a hostile sector (except for the beginning),
      // we will nuke any enemies in this sector first.
      if (gWorldSectorX != 9 || gWorldSectorY != 1 || gbWorldSectorZ) {
        EliminateAllEnemies(gsMercArriveSectorX, gsMercArriveSectorY);
      }
    }

    // This will update ANY soldiers currently schedules to arrive too
    CheckForValidArrivalSector();

    // stop time compression until player restarts it
    StopTimeCompression();

    pSoldier = Menptr[ubSoldierID];

    pMerc = gMercProfiles[pSoldier.ubProfile];

    // add the guy to a squad
    AddCharacterToAnySquad(pSoldier);

    // ATE: Make sure we use global.....
    if (pSoldier.fUseLandingZoneForArrival) {
      pSoldier.sSectorX = gsMercArriveSectorX;
      pSoldier.sSectorY = gsMercArriveSectorY;
      pSoldier.bSectorZ = 0;
    }

    // Add merc to sector ( if it's the current one )
    if (
      gWorldSectorX == pSoldier.sSectorX &&
      gWorldSectorY == pSoldier.sSectorY &&
      pSoldier.bSectorZ == gbWorldSectorZ
    ) {
      // OK, If this sector is currently loaded, and guy does not have CHOPPER insertion code....
      // ( which means we are at beginning of game if so )
      // Setup chopper....
      if (
        pSoldier.ubStrategicInsertionCode != Enum175.INSERTION_CODE_CHOPPER &&
        pSoldier.sSectorX == 9 &&
        pSoldier.sSectorY == 1
      ) {
        gfTacticalDoHeliRun = true;

        // OK, If we are in mapscreen, get out...
        if (guiCurrentScreen == Enum26.MAP_SCREEN) {
          // ATE: Make sure the current one is selected!
          ChangeSelectedMapSector(gWorldSectorX, gWorldSectorY, 0);

          RequestTriggerExitFromMapscreen(Enum144.MAP_EXIT_TO_TACTICAL);
        }

        pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_CHOPPER;
      }

      UpdateMercInSector(
        pSoldier,
        pSoldier.sSectorX,
        pSoldier.sSectorY,
        pSoldier.bSectorZ,
      );
    } else {
      // OK, otherwise, set them in north area, so once we load again, they are here.
      pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_NORTH;
    }

    if (pSoldier.ubStrategicInsertionCode != Enum175.INSERTION_CODE_CHOPPER) {
      ScreenMsg(
        FONT_MCOLOR_WHITE,
        MSG_INTERFACE,
        TacticalStr[Enum335.MERC_HAS_ARRIVED_STR],
        pSoldier.name,
      );

      // ATE: He's going to say something, now that they've arrived...
      if (
        gTacticalStatus.bMercArrivingQuoteBeingUsed == false &&
        !gfFirstHeliRun
      ) {
        gTacticalStatus.bMercArrivingQuoteBeingUsed = true;

        // Setup the highlight sector value (note this isn't for mines but using same system)
        gsSectorLocatorX = pSoldier.sSectorX;
        gsSectorLocatorY = pSoldier.sSectorY;

        TacticalCharacterDialogueWithSpecialEvent(
          pSoldier,
          0,
          DIALOGUE_SPECIAL_EVENT_MINESECTOREVENT,
          2,
          0,
        );
        TacticalCharacterDialogue(
          pSoldier,
          Enum202.QUOTE_MERC_REACHED_DESTINATION,
        );
        TacticalCharacterDialogueWithSpecialEvent(
          pSoldier,
          0,
          DIALOGUE_SPECIAL_EVENT_MINESECTOREVENT,
          3,
          0,
        );
        TacticalCharacterDialogueWithSpecialEventEx(
          pSoldier,
          0,
          DIALOGUE_SPECIAL_EVENT_UNSET_ARRIVES_FLAG,
          0,
          0,
          0,
        );
      }
    }

    // record how long the merc will be gone for
    pMerc.bMercStatus = pSoldier.iTotalContractLength;

    // remember when excatly he ARRIVED in Arulco, in case he gets fired early
    pSoldier.uiTimeOfLastContractUpdate = GetWorldTotalMin();

    // set when the merc's contract is finished
    pSoldier.iEndofContractTime =
      GetMidnightOfFutureDayInMinutes(pSoldier.iTotalContractLength) +
      GetHourWhenContractDone(pSoldier) * 60;

    // Do initial check for bad items
    if (pSoldier.bTeam == gbPlayerNum) {
      // ATE: Try to see if our equipment sucks!
      if (SoldierHasWorseEquipmentThanUsedTo(pSoldier)) {
        // Randomly anytime between 9:00, and 10:00
        uiTimeOfPost = 540 + Random(660);

        if (GetWorldMinutesInDay() < uiTimeOfPost) {
          AddSameDayStrategicEvent(
            Enum132.EVENT_MERC_COMPLAIN_EQUIPMENT,
            uiTimeOfPost,
            pSoldier.ubProfile,
          );
        }
      }
    }

    HandleMercArrivesQuotes(pSoldier);

    fTeamPanelDirty = true;

    // if the currently selected sector has no one in it, select this one instead
    if (!CanGoToTacticalInSector(sSelMapX, sSelMapY, iCurrentMapSectorZ)) {
      ChangeSelectedMapSector(pSoldier.sSectorX, pSoldier.sSectorY, 0);
    }

    return;
  }

  export function IsMercHireable(ubMercID: UINT8): boolean {
    // If the merc has an .EDT file, is not away on assignment, and isnt already hired (but not arrived yet), he is not DEAD and he isnt returning home
    if (
      gMercProfiles[ubMercID].bMercStatus == MERC_HAS_NO_TEXT_FILE ||
      gMercProfiles[ubMercID].bMercStatus > 0 ||
      gMercProfiles[ubMercID].bMercStatus == MERC_HIRED_BUT_NOT_ARRIVED_YET ||
      gMercProfiles[ubMercID].bMercStatus == MERC_IS_DEAD ||
      gMercProfiles[ubMercID].uiDayBecomesAvailable > 0 ||
      gMercProfiles[ubMercID].bMercStatus == MERC_WORKING_ELSEWHERE ||
      gMercProfiles[ubMercID].bMercStatus == MERC_FIRED_AS_A_POW ||
      gMercProfiles[ubMercID].bMercStatus == MERC_RETURNING_HOME
    )
      return false;
    else return true;
  }

  export function IsMercDead(ubMercID: UINT8): boolean {
    if (gMercProfiles[ubMercID].bMercStatus == MERC_IS_DEAD) return true;
    else return false;
  }

  export function IsTheSoldierAliveAndConcious(pSoldier: SOLDIERTYPE): boolean {
    if (pSoldier.bLife >= CONSCIOUSNESS) return true;
    else return false;
  }

  export function NumberOfMercsOnPlayerTeam(): UINT8 {
    let cnt: INT8;
    let pSoldier: SOLDIERTYPE;
    let bLastTeamID: INT16;
    let ubCount: UINT8 = 0;

    // Set locator to first merc
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;

    for (
      pSoldier = MercPtrs[cnt];
      cnt <= bLastTeamID;
      cnt++, pSoldier = MercPtrs[cnt]
    ) {
      // if the is active, and is not a vehicle
      if (pSoldier.bActive && !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
        ubCount++;
      }
    }

    return ubCount;
  }

  export function HandleMercArrivesQuotes(pSoldier: SOLDIERTYPE): void {
    let cnt: INT8;
    let bHated: INT8;
    let bLastTeamID: INT8;
    let pTeamSoldier: SOLDIERTYPE;

    // If we are approaching with helicopter, don't say any ( yet )
    if (pSoldier.ubStrategicInsertionCode != Enum175.INSERTION_CODE_CHOPPER) {
      // Player-generated characters issue a comment about arriving in Omerta.
      if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__PLAYER_CHARACTER) {
        if (gubQuest[Enum169.QUEST_DELIVER_LETTER] == QUESTINPROGRESS) {
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_PC_DROPPED_OMERTA);
        }
      }

      // Check to see if anyone hates this merc and will now complain
      cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;
      // loop though all the mercs
      for (
        pTeamSoldier = MercPtrs[cnt];
        cnt <= bLastTeamID;
        cnt++, pTeamSoldier = MercPtrs[cnt]
      ) {
        if (pTeamSoldier.bActive) {
          if (pTeamSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
            bHated = WhichHated(pTeamSoldier.ubProfile, pSoldier.ubProfile);
            if (bHated != -1) {
              // hates the merc who has arrived and is going to gripe about it!
              switch (bHated) {
                case 0:
                  TacticalCharacterDialogue(
                    pTeamSoldier,
                    Enum202.QUOTE_HATED_1_ARRIVES,
                  );
                  break;
                case 1:
                  TacticalCharacterDialogue(
                    pTeamSoldier,
                    Enum202.QUOTE_HATED_2_ARRIVES,
                  );
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
    }
  }

  export function GetMercArrivalTimeOfDay(): UINT32 {
    let uiCurrHour: UINT32;
    let uiMinHour: UINT32;

    // Pick a time...

    // First get the current time of day.....
    uiCurrHour = GetWorldHour();

    // Subtract the min time for any arrival....
    uiMinHour = uiCurrHour + MIN_FLIGHT_PREP_TIME;

    // OK, first check if we need to advance a whole day's time...
    // See if we have missed the last flight for the day...
    if (uiCurrHour > 13) {
      // ( > 1:00 pm - too bad )
      // 7:30 flight....
      return GetMidnightOfFutureDayInMinutes(1) + MERC_ARRIVE_TIME_SLOT_1;
    }

    // Well, now we can handle flights all in one day....
    // Find next possible flight
    if (uiMinHour <= 7) {
      return GetWorldDayInMinutes() + MERC_ARRIVE_TIME_SLOT_1; // 7:30 am
    } else if (uiMinHour <= 13) {
      return GetWorldDayInMinutes() + MERC_ARRIVE_TIME_SLOT_2; // 1:30 pm
    } else {
      return GetWorldDayInMinutes() + MERC_ARRIVE_TIME_SLOT_3; // 7:30 pm
    }
  }

  export function UpdateAnyInTransitMercsWithGlobalArrivalSector(): void {
    let cnt: INT32;
    let pSoldier: SOLDIERTYPE;

    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

    // look for all mercs on the same team,
    for (
      pSoldier = MercPtrs[cnt];
      cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID;
      cnt++, pSoldier = MercPtrs[cnt]
    ) {
      if (pSoldier.bActive) {
        if (pSoldier.bAssignment == Enum117.IN_TRANSIT) {
          if (pSoldier.fUseLandingZoneForArrival) {
            pSoldier.sSectorX = gsMercArriveSectorX;
            pSoldier.sSectorY = gsMercArriveSectorY;
            pSoldier.bSectorZ = 0;
          }
        }
      }
    }
  }

  function StrategicPythSpacesAway(sOrigin: INT16, sDest: INT16): INT16 {
    let sRows: INT16;
    let sCols: INT16;
    let sResult: INT16;

    sRows = Math.abs(
      Math.trunc(sOrigin / MAP_WORLD_X) - Math.trunc(sDest / MAP_WORLD_X),
    );
    sCols = Math.abs((sOrigin % MAP_WORLD_X) - (sDest % MAP_WORLD_X));

    // apply Pythagoras's theorem for right-handed triangle:
    // dist^2 = rows^2 + cols^2, so use the square root to get the distance
    sResult = Math.sqrt(sRows * sRows + sCols * sCols);

    return sResult;
  }

  // ATE: This function will check if the current arrival sector
  // is valid
  // if there are enemies present, it's invalid
  // if so, search around for nearest non-occupied sector.
  function CheckForValidArrivalSector(): void {
    let sTop: INT16;
    let sBottom: INT16;
    let sLeft: INT16;
    let sRight: INT16;
    let cnt1: INT16;
    let cnt2: INT16;
    let sGoodX: INT16 = <INT16>(<unknown>undefined);
    let sGoodY: INT16 = <INT16>(<unknown>undefined);
    let ubRadius: UINT8 = 4;
    let leftmost: INT32;
    let sSectorGridNo: INT16;
    let sSectorGridNo2: INT16;
    let uiRange: INT32;
    let uiLowestRange: INT32 = 999999;
    let fFound: boolean = false;
    let sString: string /* CHAR16[1024] */;
    let zShortTownIDString1: string /* CHAR16[50] */;
    let zShortTownIDString2: string /* CHAR16[50] */;

    sSectorGridNo = gsMercArriveSectorX + MAP_WORLD_X * gsMercArriveSectorY;

    // Check if valid...
    if (!StrategicMap[sSectorGridNo].fEnemyControlled) {
      return;
    }

    zShortTownIDString1 = GetShortSectorString(
      gsMercArriveSectorX,
      gsMercArriveSectorY,
    );

    // If here - we need to do a search!
    sTop = ubRadius;
    sBottom = -ubRadius;
    sLeft = -ubRadius;
    sRight = ubRadius;

    for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
      leftmost =
        Math.trunc((sSectorGridNo + MAP_WORLD_X * cnt1) / MAP_WORLD_X) *
        MAP_WORLD_X;

      for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
        sSectorGridNo2 = sSectorGridNo + MAP_WORLD_X * cnt1 + cnt2;

        if (
          sSectorGridNo2 >= 1 &&
          sSectorGridNo2 < (MAP_WORLD_X - 1) * (MAP_WORLD_X - 1) &&
          sSectorGridNo2 >= leftmost &&
          sSectorGridNo2 < leftmost + MAP_WORLD_X
        ) {
          if (
            !StrategicMap[sSectorGridNo2].fEnemyControlled &&
            !StrategicMap[sSectorGridNo2].fEnemyAirControlled
          ) {
            uiRange = StrategicPythSpacesAway(sSectorGridNo2, sSectorGridNo);

            if (uiRange < uiLowestRange) {
              sGoodY = cnt1;
              sGoodX = cnt2;
              uiLowestRange = uiRange;
              fFound = true;
            }
          }
        }
      }
    }

    if (fFound) {
      gsMercArriveSectorX = gsMercArriveSectorX + sGoodX;
      gsMercArriveSectorY = gsMercArriveSectorY + sGoodY;

      UpdateAnyInTransitMercsWithGlobalArrivalSector();

      zShortTownIDString2 = GetShortSectorString(
        gsMercArriveSectorX,
        gsMercArriveSectorY,
      );

      sString = swprintf(
        "Arrival of new recruits is being rerouted to sector %s, as scheduled drop-off point of sector %s is enemy occupied.",
        zShortTownIDString2,
        zShortTownIDString1,
      );

      DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
    }
  }
}
