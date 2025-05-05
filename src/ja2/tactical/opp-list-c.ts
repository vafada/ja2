namespace ja2 {
  //#define TESTOPPLIST

  // for ManSeesMan()
  const MANLOOKSFORMAN = 0;
  const HEARNOISE = 1;
  const NOTICEUNSEENATTACKER = 2;

  // for ManLooksForMan()
  const MANLOOKSFOROTHERTEAMS = 0;
  const OTHERTEAMSLOOKFORMAN = 1;
  const VERIFYANDDECAYOPPLIST = 2;
  const HANDLESTEPPEDLOOKAT = 3;
  const LOOKANDLISTEN = 4;
  const UPDATEPUBLIC = 5;
  const CALLER_UNKNOWN = 6;

  // this variable is a flag used in HandleSight to determine whether (while in non-combat RT)
  // someone has just been seen, EITHER THE MOVER OR SOMEONE THE MOVER SEES
  let gfPlayerTeamSawCreatures: UINT8 /* boolean */ = 0;
  export let gfPlayerTeamSawJoey: boolean = false;
  export let gfMikeShouldSayHi: UINT8 /* boolean */ = 0;

  let gubBestToMakeSighting: UINT8[] /* [BEST_SIGHTING_ARRAY_SIZE] */ =
    createArray(BEST_SIGHTING_ARRAY_SIZE, 0);
  export let gubBestToMakeSightingSize: UINT8 = 0;
  // BOOLEAN		gfHumanSawSomeoneInRealtime;

  let gfDelayResolvingBestSightingDueToDoor: boolean = false;

  const SHOULD_BECOME_HOSTILE_SIZE = 32;

  let gubShouldBecomeHostileOrSayQuote: UINT8[] /* [SHOULD_BECOME_HOSTILE_SIZE] */ =
    createArray(SHOULD_BECOME_HOSTILE_SIZE, 0);
  let gubNumShouldBecomeHostileOrSayQuote: UINT8;

  // NB this ID is set for someone opening a door
  export let gubInterruptProvoker: UINT8 = NOBODY;

  export let gbPublicOpplist: INT8[][] /* [MAXTEAMS][TOTAL_SOLDIERS] */ =
    createArrayFrom(MAXTEAMS, () => createArray(TOTAL_SOLDIERS, 0));
  export let gbSeenOpponents: INT8[][] /* [TOTAL_SOLDIERS][TOTAL_SOLDIERS] */ =
    createArrayFrom(TOTAL_SOLDIERS, () => createArray(TOTAL_SOLDIERS, 0));
  export let gsLastKnownOppLoc: INT16[][] /* [TOTAL_SOLDIERS][TOTAL_SOLDIERS] */ =
    createArrayFrom(TOTAL_SOLDIERS, () => createArray(TOTAL_SOLDIERS, 0)); // merc vs. merc
  export let gbLastKnownOppLevel: INT8[][] /* [TOTAL_SOLDIERS][TOTAL_SOLDIERS] */ =
    createArrayFrom(TOTAL_SOLDIERS, () => createArray(TOTAL_SOLDIERS, 0));
  export let gsPublicLastKnownOppLoc: INT16[][] /* [MAXTEAMS][TOTAL_SOLDIERS] */ =
    createArrayFrom(MAXTEAMS, () => createArray(TOTAL_SOLDIERS, 0)); // team vs. merc
  export let gbPublicLastKnownOppLevel: INT8[][] /* [MAXTEAMS][TOTAL_SOLDIERS] */ =
    createArrayFrom(MAXTEAMS, () => createArray(TOTAL_SOLDIERS, 0));
  export let gubPublicNoiseVolume: UINT8[] /* [MAXTEAMS] */ = createArray(
    MAXTEAMS,
    0,
  );
  export let gsPublicNoiseGridno: INT16[] /* [MAXTEAMS] */ = createArray(
    MAXTEAMS,
    0,
  );
  export let gbPublicNoiseLevel: INT8[] /* [MAXTEAMS] */ = createArray(
    MAXTEAMS,
    0,
  );

  export let gubKnowledgeValue: UINT8[][] /* [10][10] */ = [
    //   P E R S O N A L   O P P L I S T  //
    // -4   -3   -2   -1   0   1   2   3   4   5   //
    [0, 1, 2, 3, 0, 5, 4, 3, 2, 1], // -4
    [0, 0, 1, 2, 0, 4, 3, 2, 1, 0], // -3    O
    [0, 0, 0, 1, 0, 3, 2, 1, 0, 0], // -2  P P
    [0, 0, 0, 0, 0, 2, 1, 0, 0, 0], // -1  U P
    [0, 1, 2, 3, 0, 5, 4, 3, 2, 1], //  0  B L
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //  1  L I
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], //  2  I S
    [0, 0, 0, 1, 0, 2, 1, 0, 0, 0], //  3  C T
    [0, 0, 1, 2, 0, 3, 2, 1, 0, 0], //  4
    [0, 1, 2, 3, 0, 4, 3, 2, 1, 0], //  5

    /*
     //   P E R S O N A L   O P P L I S T  //
     // -3   -2   -1   0   1   2   3   4   //
     {   0,   1,   2,  0,  4,  3,  2,  1   }, // -3    O
     {   0,   0,   1,  0,  3,  2,  1,  0   }, // -2  P P
     {   0,   0,   0,  0,  2,  1,  0,  0   }, // -1  U P
     {   1,   2,   3,  0,  5,  4,  3,  2   }, //  0  B L
     {   0,   0,   0,  0,  0,  0,  0,  0   }, //  1  L I
     {   0,   0,   0,  0,  1,  0,  0,  0   }, //  2  I S
     {   0,   0,   1,  0,  2,  1,  0,  0   }, //  3  C T
     {   0,   1,   2,  0,  3,  2,  1,  0   }  //  4
           */
  ];

  const MAX_WATCHED_LOC_POINTS = 4;
  const WATCHED_LOC_RADIUS = 1;

  export let gsWatchedLoc: INT16[][] /* [TOTAL_SOLDIERS][NUM_WATCHED_LOCS] */ =
    createArrayFrom(TOTAL_SOLDIERS, () => createArray(NUM_WATCHED_LOCS, 0));
  export let gbWatchedLocLevel: INT8[][] /* [TOTAL_SOLDIERS][NUM_WATCHED_LOCS] */ =
    createArrayFrom(TOTAL_SOLDIERS, () => createArray(NUM_WATCHED_LOCS, 0));
  export let gubWatchedLocPoints: UINT8[][] /* [TOTAL_SOLDIERS][NUM_WATCHED_LOCS] */ =
    createArrayFrom(TOTAL_SOLDIERS, () => createArray(NUM_WATCHED_LOCS, 0));
  export let gfWatchedLocReset: boolean[][] /* [TOTAL_SOLDIERS][NUM_WATCHED_LOCS] */ =
    createArrayFrom(TOTAL_SOLDIERS, () => createArray(NUM_WATCHED_LOCS, false));
  let gfWatchedLocHasBeenIncremented: boolean[][] /* [TOTAL_SOLDIERS][NUM_WATCHED_LOCS] */ =
    createArrayFrom(TOTAL_SOLDIERS, () => createArray(NUM_WATCHED_LOCS, false));

  let gbLookDistance: INT8[][] /* [8][8] */ = [
    //  LOOKER DIR       LOOKEE DIR

    //                   NORTH    | NORTHEAST  |   EAST   |  SOUTHEAST  |   SOUTH  |  SOUTHWEST  |   WEST    |  NORTHWEST

    /* NORTH      */ [
      STRAIGHT,
      ANGLE,
      SIDE,
      SBEHIND,
      BEHIND,
      SBEHIND,
      SIDE,
      ANGLE,
    ],

    /* NORTHEAST  */ [
      ANGLE,
      STRAIGHT,
      ANGLE,
      SIDE,
      SBEHIND,
      BEHIND,
      SBEHIND,
      SIDE,
    ],

    /* EAST       */ [
      SIDE,
      ANGLE,
      STRAIGHT,
      ANGLE,
      SIDE,
      SBEHIND,
      BEHIND,
      SBEHIND,
    ],

    /* SOUTHEAST  */ [
      SBEHIND,
      SIDE,
      ANGLE,
      STRAIGHT,
      ANGLE,
      SIDE,
      SBEHIND,
      BEHIND,
    ],

    /* SOUTH      */ [
      BEHIND,
      SBEHIND,
      SIDE,
      ANGLE,
      STRAIGHT,
      ANGLE,
      SIDE,
      SBEHIND,
    ],

    /* SOUTHWEST  */ [
      SBEHIND,
      BEHIND,
      SBEHIND,
      SIDE,
      ANGLE,
      STRAIGHT,
      ANGLE,
      SIDE,
    ],

    /* WEST       */ [
      SIDE,
      SBEHIND,
      BEHIND,
      SBEHIND,
      SIDE,
      ANGLE,
      STRAIGHT,
      ANGLE,
    ],

    /* NORTHWEST  */ [
      ANGLE,
      SIDE,
      SBEHIND,
      BEHIND,
      SBEHIND,
      SIDE,
      ANGLE,
      STRAIGHT,
    ],
  ];

  let gbSmellStrength: INT8[] /* [3] */ = [
    NORMAL_HUMAN_SMELL_STRENGTH, // normal
    NORMAL_HUMAN_SMELL_STRENGTH + 2, // slob
    NORMAL_HUMAN_SMELL_STRENGTH - 1, // snob
  ];

  export let gsWhoThrewRock: UINT16 = NOBODY;

  const NIGHTSIGHTGOGGLES_BONUS = 2;
  const UVGOGGLES_BONUS = 4;

  // % values of sighting distance at various light levels

  export let gbLightSighting: INT8[][] /* [1][16] */ = [
    // human
    [
      80, // brightest
      86,
      93,
      100, // normal daylight, 3
      94,
      88,
      82,
      76,
      70, // mid-dawn, 8
      64,
      58,
      51,
      43, // normal nighttime, 12 (11 tiles)
      30,
      17,
      9,
    ],
  ];
  /*
{
{ // human
         80, // brightest
         86,
         93,
        100, // normal daylight, 3
         93,
         86,
         79,
         72,
         65, // mid-dawn, 8
         58,
         53,
         43, // normal nighttime, 11  (11 tiles)
         35,
         26,
         17,
          9
}
};
*/

  export let gubSightFlags: UINT8 = 0;

  const DECAY_OPPLIST_VALUE = (value: number) => {
    if (value >= SEEN_THIS_TURN) {
      value++;
      if (value > OLDEST_SEEN_VALUE) {
        value = NOT_HEARD_OR_SEEN;
      }
    } else {
      if (value <= HEARD_THIS_TURN) {
        value--;
        if (value < OLDEST_HEARD_VALUE) {
          value = NOT_HEARD_OR_SEEN;
        }
      }
    }
    return value;
  };

  export function AdjustMaxSightRangeForEnvEffects(
    pSoldier: SOLDIERTYPE,
    bLightLevel: INT8,
    sDistVisible: INT16,
  ): INT16 {
    let sNewDist: INT16 = 0;

    sNewDist = Math.trunc(
      (sDistVisible * gbLightSighting[0][bLightLevel]) / 100,
    );

    // Adjust it based on weather...
    if (
      guiEnvWeather &
      (WEATHER_FORECAST_SHOWERS | WEATHER_FORECAST_THUNDERSHOWERS)
    ) {
      sNewDist = Math.trunc((sNewDist * 70) / 100);
    }

    return sNewDist;
  }

  function SwapBestSightingPositions(bPos1: INT8, bPos2: INT8): void {
    let ubTemp: UINT8;

    ubTemp = gubBestToMakeSighting[bPos1];
    gubBestToMakeSighting[bPos1] = gubBestToMakeSighting[bPos2];
    gubBestToMakeSighting[bPos2] = ubTemp;
  }

  function ReevaluateBestSightingPosition(
    pSoldier: SOLDIERTYPE,
    bInterruptDuelPts: INT8,
  ): void {
    let ubLoop: UINT8;
    let ubLoop2: UINT8;
    let fFound: boolean = false;
    let fPointsGotLower: boolean = false;

    if (bInterruptDuelPts == NO_INTERRUPT) {
      return;
    }

    if (!(pSoldier.uiStatusFlags & SOLDIER_MONSTER)) {
      // gfHumanSawSomeoneInRealtime = TRUE;
    }

    if (
      pSoldier.bInterruptDuelPts != NO_INTERRUPT &&
      bInterruptDuelPts < pSoldier.bInterruptDuelPts
    ) {
      fPointsGotLower = true;
    }

    if (fPointsGotLower) {
      // loop to end of array less 1 entry since we can't swap the last entry out of the array
      for (ubLoop = 0; ubLoop < gubBestToMakeSightingSize - 1; ubLoop++) {
        if (pSoldier.ubID == gubBestToMakeSighting[ubLoop]) {
          fFound = true;
          break;
        }
      }

      // this guy has fewer interrupt pts vs another enemy!  reduce position unless in last place
      if (fFound) {
        // set new points
        DebugMsg(
          TOPIC_JA2,
          DBG_LEVEL_3,
          FormatString(
            "RBSP: reducing points for %d to %d",
            pSoldier.ubID,
            bInterruptDuelPts,
          ),
        );
        pSoldier.bInterruptDuelPts = bInterruptDuelPts;

        // must percolate him down
        for (
          ubLoop2 = ubLoop + 1;
          ubLoop2 < gubBestToMakeSightingSize;
          ubLoop2++
        ) {
          if (
            gubBestToMakeSighting[ubLoop2] != NOBODY &&
            MercPtrs[gubBestToMakeSighting[ubLoop2 - 1]].bInterruptDuelPts <
              MercPtrs[gubBestToMakeSighting[ubLoop2]].bInterruptDuelPts
          ) {
            SwapBestSightingPositions(ubLoop2 - 1, ubLoop2);
          } else {
            break;
          }
        }
      } else if (
        pSoldier.ubID == gubBestToMakeSighting[gubBestToMakeSightingSize - 1]
      ) {
        // in list but can't be bumped down... set his new points
        DebugMsg(
          TOPIC_JA2,
          DBG_LEVEL_3,
          FormatString(
            "RBSP: reduced points for last individual %d to %d",
            pSoldier.ubID,
            bInterruptDuelPts,
          ),
        );
        pSoldier.bInterruptDuelPts = bInterruptDuelPts;
      }
    } else {
      // loop through whole array
      for (ubLoop = 0; ubLoop < gubBestToMakeSightingSize; ubLoop++) {
        if (pSoldier.ubID == gubBestToMakeSighting[ubLoop]) {
          fFound = true;
          break;
        }
      }

      if (!fFound) {
        for (ubLoop = 0; ubLoop < gubBestToMakeSightingSize; ubLoop++) {
          if (
            gubBestToMakeSighting[ubLoop] == NOBODY ||
            bInterruptDuelPts >
              MercPtrs[gubBestToMakeSighting[ubLoop]].bInterruptDuelPts
          ) {
            if (
              gubBestToMakeSighting[gubBestToMakeSightingSize - 1] != NOBODY
            ) {
              MercPtrs[
                gubBestToMakeSighting[gubBestToMakeSightingSize - 1]
              ].bInterruptDuelPts = NO_INTERRUPT;
              DebugMsg(
                TOPIC_JA2,
                DBG_LEVEL_3,
                FormatString(
                  "RBSP: resetting points for %d to zilch",
                  pSoldier.ubID,
                ),
              );
            }

            // set new points
            DebugMsg(
              TOPIC_JA2,
              DBG_LEVEL_3,
              FormatString(
                "RBSP: setting points for %d to %d",
                pSoldier.ubID,
                bInterruptDuelPts,
              ),
            );
            pSoldier.bInterruptDuelPts = bInterruptDuelPts;

            // insert here!
            for (
              ubLoop2 = gubBestToMakeSightingSize - 1;
              ubLoop2 > ubLoop;
              ubLoop2--
            ) {
              gubBestToMakeSighting[ubLoop2] =
                gubBestToMakeSighting[ubLoop2 - 1];
            }
            gubBestToMakeSighting[ubLoop] = pSoldier.ubID;
            break;
          }
        }
      }
      // else points didn't get lower, so do nothing (because we want to leave each merc with as low int points as possible)
    }

    for (ubLoop = 0; ubLoop < BEST_SIGHTING_ARRAY_SIZE; ubLoop++) {
      if (gubBestToMakeSighting[ubLoop] != NOBODY) {
        DebugMsg(
          TOPIC_JA2,
          DBG_LEVEL_3,
          FormatString(
            "RBSP entry %d: %d (%d pts)",
            ubLoop,
            gubBestToMakeSighting[ubLoop],
            MercPtrs[gubBestToMakeSighting[ubLoop]].bInterruptDuelPts,
          ),
        );
      }
    }
  }

  function HandleBestSightingPositionInRealtime(): void {
    // This function is called for handling interrupts when opening a door in non-combat or
    // just sighting in non-combat, deciding who gets the first turn

    let ubLoop: UINT8;

    if (gfDelayResolvingBestSightingDueToDoor) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "HBSPIR: skipping due to door flag");
      return;
    }

    if (gubBestToMakeSighting[0] != NOBODY) {
      DebugMsg(
        TOPIC_JA2,
        DBG_LEVEL_3,
        "HBSPIR called and there is someone in the list",
      );

      // if (gfHumanSawSomeoneInRealtime)
      {
        if (gubBestToMakeSighting[1] == NOBODY) {
          // award turn
          EnterCombatMode(MercPtrs[gubBestToMakeSighting[0]].bTeam);
        } else {
          // if 1st and 2nd on same team, or 1st and 3rd on same team, or there IS no 3rd, award turn to 1st
          if (
            MercPtrs[gubBestToMakeSighting[0]].bTeam ==
              MercPtrs[gubBestToMakeSighting[1]].bTeam ||
            gubBestToMakeSighting[2] == NOBODY ||
            MercPtrs[gubBestToMakeSighting[0]].bTeam ==
              MercPtrs[gubBestToMakeSighting[2]].bTeam
          ) {
            EnterCombatMode(MercPtrs[gubBestToMakeSighting[0]].bTeam);
          } // give turn to 2nd best but interrupt to 1st
          else {
            DebugMsg(
              TOPIC_JA2,
              DBG_LEVEL_3,
              "Entering combat mode: turn for 2nd best, int for best",
            );

            EnterCombatMode(MercPtrs[gubBestToMakeSighting[1]].bTeam);
            // 2nd guy loses control
            AddToIntList(gubBestToMakeSighting[1], false, true);
            // 1st guy gains control
            AddToIntList(gubBestToMakeSighting[0], true, true);
            // done
            DoneAddingToIntList(
              MercPtrs[gubBestToMakeSighting[0]],
              true,
              SIGHTINTERRUPT,
            );
          }
        }
      }

      for (ubLoop = 0; ubLoop < BEST_SIGHTING_ARRAY_SIZE; ubLoop++) {
        if (gubBestToMakeSighting[ubLoop] != NOBODY) {
          MercPtrs[gubBestToMakeSighting[ubLoop]].bInterruptDuelPts =
            NO_INTERRUPT;
          DebugMsg(
            TOPIC_JA2,
            DBG_LEVEL_3,
            FormatString(
              "RBSP: done, resetting points for %d to zilch",
              MercPtrs[gubBestToMakeSighting[ubLoop]].ubID,
            ),
          );
        }
      }

      for (ubLoop = 0; ubLoop < guiNumMercSlots; ubLoop++) {
        if (MercSlots[ubLoop]) {
          AssertMsg(
            MercSlots[ubLoop].bInterruptDuelPts == NO_INTERRUPT,
            FormatString(
              "%s (%d) still has interrupt pts!",
              MercSlots[ubLoop].name,
              MercSlots[ubLoop].ubID,
            ),
          );
        }
      }
    }
  }

  function HandleBestSightingPositionInTurnbased(): void {
    // This function is called for handling interrupts when opening a door in turnbased

    let ubLoop: UINT8;
    let ubLoop2: UINT8;
    let fOk: boolean = false;

    if (gubBestToMakeSighting[0] != NOBODY) {
      if (
        MercPtrs[gubBestToMakeSighting[0]].bTeam !=
        gTacticalStatus.ubCurrentTeam
      ) {
        // interrupt!
        for (ubLoop = 0; ubLoop < gubBestToMakeSightingSize; ubLoop++) {
          if (gubBestToMakeSighting[ubLoop] == NOBODY) {
            if (gubInterruptProvoker == NOBODY) {
              // do nothing (for now) - abort!
              return;
            } else {
              // use this guy as the "interrupted" fellow
              gubBestToMakeSighting[ubLoop] = gubInterruptProvoker;
              fOk = true;
              break;
            }
          } else if (
            MercPtrs[gubBestToMakeSighting[ubLoop]].bTeam ==
            gTacticalStatus.ubCurrentTeam
          ) {
            fOk = true;
            break;
          }
        }

        if (fOk) {
          // this is the guy who gets "interrupted"; all else before him interrupted him
          AddToIntList(gubBestToMakeSighting[ubLoop], false, true);
          for (ubLoop2 = 0; ubLoop2 < ubLoop; ubLoop2++) {
            AddToIntList(gubBestToMakeSighting[ubLoop2], true, true);
          }
          // done
          DoneAddingToIntList(
            MercPtrs[gubBestToMakeSighting[ubLoop]],
            true,
            SIGHTINTERRUPT,
          );
        }
      }
      for (ubLoop = 0; ubLoop < BEST_SIGHTING_ARRAY_SIZE; ubLoop++) {
        if (gubBestToMakeSighting[ubLoop] != NOBODY) {
          MercPtrs[gubBestToMakeSighting[ubLoop]].bInterruptDuelPts =
            NO_INTERRUPT;
          DebugMsg(
            TOPIC_JA2,
            DBG_LEVEL_3,
            FormatString(
              "RBSP (TB): done, resetting points for %d to zilch",
              MercPtrs[gubBestToMakeSighting[ubLoop]].ubID,
            ),
          );
        }
      }

      for (ubLoop = 0; ubLoop < guiNumMercSlots; ubLoop++) {
        if (MercSlots[ubLoop]) {
          AssertMsg(
            MercSlots[ubLoop].bInterruptDuelPts == NO_INTERRUPT,
            FormatString(
              "%s (%d) still has interrupt pts!",
              MercSlots[ubLoop].name,
              MercSlots[ubLoop].ubID,
            ),
          );
        }
      }
    }
  }

  function InitSightArrays(): void {
    let uiLoop: UINT32;

    for (uiLoop = 0; uiLoop < BEST_SIGHTING_ARRAY_SIZE; uiLoop++) {
      gubBestToMakeSighting[uiLoop] = NOBODY;
    }
    // gfHumanSawSomeoneInRealtime = FALSE;
  }

  export function AddToShouldBecomeHostileOrSayQuoteList(ubID: UINT8): void {
    let ubLoop: UINT8;

    Assert(gubNumShouldBecomeHostileOrSayQuote < SHOULD_BECOME_HOSTILE_SIZE);

    if (MercPtrs[ubID].bLife < OKLIFE) {
      return;
    }

    // make sure not already in list
    for (ubLoop = 0; ubLoop < gubNumShouldBecomeHostileOrSayQuote; ubLoop++) {
      if (gubShouldBecomeHostileOrSayQuote[ubLoop] == ubID) {
        return;
      }
    }

    gubShouldBecomeHostileOrSayQuote[gubNumShouldBecomeHostileOrSayQuote] =
      ubID;
    gubNumShouldBecomeHostileOrSayQuote++;
  }

  function SelectSpeakerFromHostileOrSayQuoteList(): UINT8 {
    let ubProfileList: UINT8[] /* [SHOULD_BECOME_HOSTILE_SIZE] */ = createArray(
      SHOULD_BECOME_HOSTILE_SIZE,
      0,
    ); // NB list of merc IDs, not profiles!
    let ubLoop: UINT8;
    let ubNumProfiles: UINT8 = 0;
    let pSoldier: SOLDIERTYPE;

    for (ubLoop = 0; ubLoop < gubNumShouldBecomeHostileOrSayQuote; ubLoop++) {
      pSoldier = MercPtrs[gubShouldBecomeHostileOrSayQuote[ubLoop]];
      if (pSoldier.ubProfile != NO_PROFILE) {
        // make sure person can say quote!!!!
        gMercProfiles[pSoldier.ubProfile].ubMiscFlags2 |=
          PROFILE_MISC_FLAG2_NEEDS_TO_SAY_HOSTILE_QUOTE;

        if (
          NPCHasUnusedHostileRecord(
            pSoldier.ubProfile,
            Enum296.APPROACH_DECLARATION_OF_HOSTILITY,
          )
        ) {
          ubProfileList[ubNumProfiles] =
            gubShouldBecomeHostileOrSayQuote[ubLoop];
          ubNumProfiles++;
        } else {
          // turn flag off again
          gMercProfiles[pSoldier.ubProfile].ubMiscFlags2 &=
            ~PROFILE_MISC_FLAG2_NEEDS_TO_SAY_HOSTILE_QUOTE;
        }
      }
    }

    if (ubNumProfiles == 0) {
      return NOBODY;
    } else {
      return ubProfileList[Random(ubNumProfiles)];
    }
  }

  export function CheckHostileOrSayQuoteList(): void {
    if (
      gubNumShouldBecomeHostileOrSayQuote == 0 ||
      !DialogueQueueIsEmpty() ||
      gfInTalkPanel ||
      gfWaitingForTriggerTimer
    ) {
      return;
    } else {
      let ubSpeaker: UINT8;
      let ubLoop: UINT8;
      let pSoldier: SOLDIERTYPE;

      ubSpeaker = SelectSpeakerFromHostileOrSayQuoteList();
      if (ubSpeaker == NOBODY) {
        // make sure everyone on this list is hostile
        for (
          ubLoop = 0;
          ubLoop < gubNumShouldBecomeHostileOrSayQuote;
          ubLoop++
        ) {
          pSoldier = MercPtrs[gubShouldBecomeHostileOrSayQuote[ubLoop]];
          if (pSoldier.bNeutral) {
            MakeCivHostile(pSoldier, 2);
            // make civ group, if any, hostile
            if (
              pSoldier.bTeam == CIV_TEAM &&
              pSoldier.ubCivilianGroup != Enum246.NON_CIV_GROUP &&
              gTacticalStatus.fCivGroupHostile[pSoldier.ubCivilianGroup] ==
                CIV_GROUP_WILL_BECOME_HOSTILE
            ) {
              gTacticalStatus.fCivGroupHostile[pSoldier.ubCivilianGroup] =
                CIV_GROUP_HOSTILE;
            }
          }
        }

        // unpause all AI
        UnPauseAI();
        // reset the list
        gubShouldBecomeHostileOrSayQuote.fill(NOBODY);
        gubNumShouldBecomeHostileOrSayQuote = 0;
        // and return/go into combat
        if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
          EnterCombatMode(CIV_TEAM);
        }
      } else {
        // pause all AI
        PauseAIUntilManuallyUnpaused();
        // stop everyone?

        // We want to make this guy visible to the player.
        if (MercPtrs[ubSpeaker].bVisible != 1) {
          gbPublicOpplist[gbPlayerNum][ubSpeaker] = HEARD_THIS_TURN;
          HandleSight(MercPtrs[ubSpeaker], SIGHT_LOOK | SIGHT_RADIO);
        }
        // trigger hater
        TriggerNPCWithIHateYouQuote(MercPtrs[ubSpeaker].ubProfile);
      }
    }
  }

  export function HandleSight(
    pSoldier: SOLDIERTYPE,
    ubSightFlags: UINT8,
  ): void {
    let uiLoop: UINT32;
    let pThem: SOLDIERTYPE;
    let bTempNewSituation: INT8;

    if (
      !pSoldier.bActive ||
      !pSoldier.bInSector ||
      pSoldier.uiStatusFlags & SOLDIER_DEAD
    ) {
      // I DON'T THINK SO!
      return;
    }

    gubSightFlags = ubSightFlags;

    if (
      gubBestToMakeSightingSize !=
      BEST_SIGHTING_ARRAY_SIZE_ALL_TEAMS_LOOK_FOR_ALL
    ) {
      // if this is not being called as a result of all teams look for all, reset array size
      if (gTacticalStatus.uiFlags & INCOMBAT) {
        // NB the incombat size is 0
        gubBestToMakeSightingSize = BEST_SIGHTING_ARRAY_SIZE_INCOMBAT;
      } else {
        gubBestToMakeSightingSize = BEST_SIGHTING_ARRAY_SIZE_NONCOMBAT;
      }

      InitSightArrays();
    }

    for (uiLoop = 0; uiLoop < NUM_WATCHED_LOCS; uiLoop++) {
      gfWatchedLocHasBeenIncremented[pSoldier.ubID][uiLoop] = false;
    }

    gfPlayerTeamSawCreatures = 0;

    // store new situation value
    bTempNewSituation = pSoldier.bNewSituation;
    pSoldier.bNewSituation = 0;

    // if we've been told to make this soldier look (& others look back at him)
    if (ubSightFlags & SIGHT_LOOK) {
      // if this soldier's under our control and well enough to look
      if (pSoldier.bLife >= OKLIFE) {
        /*
#ifdef RECORDOPPLIST
fprintf(OpplistFile,"ManLooksForOtherTeams (HandleSight/Look) for %d\n",pSoldier->guynum);
#endif
     */
        // he looks for all other soldiers not on his own team
        ManLooksForOtherTeams(pSoldier);

        // if "Show only enemies seen" option is ON and it's this guy looking
        // if (pSoldier->ubID == ShowOnlySeenPerson)
        // NewShowOnlySeenPerson(pSoldier);                  // update the string
      }

      /*
#ifdef RECORDOPPLIST
fprintf(OpplistFile,"OtherTeamsLookForMan (HandleSight/Look) for %d\n",ptr->guynum);
#endif
    */

      // all soldiers under our control but not on ptr's team look for him
      OtherTeamsLookForMan(pSoldier);
    } // end of SIGHT_LOOK

    // if we've been told that interrupts are possible as a result of sighting
    if (
      gTacticalStatus.uiFlags & TURNBASED &&
      gTacticalStatus.uiFlags & INCOMBAT &&
      ubSightFlags & SIGHT_INTERRUPT
    ) {
      ResolveInterruptsVs(pSoldier, SIGHTINTERRUPT);
    }

    if (gubBestToMakeSightingSize == BEST_SIGHTING_ARRAY_SIZE_NONCOMBAT) {
      HandleBestSightingPositionInRealtime();
    }

    if (pSoldier.bNewSituation && !(pSoldier.uiStatusFlags & SOLDIER_PC)) {
      HaultSoldierFromSighting(pSoldier, true);
    }
    pSoldier.bNewSituation = Math.max(
      pSoldier.bNewSituation,
      bTempNewSituation,
    );

    // if we've been told to radio the results
    if (ubSightFlags & SIGHT_RADIO) {
      if (pSoldier.uiStatusFlags & SOLDIER_PC) {
        // update our team's public knowledge
        RadioSightings(pSoldier, EVERYBODY, pSoldier.bTeam);

        RadioSightings(pSoldier, EVERYBODY, MILITIA_TEAM);

        // if it's our local player's merc
        if (PTR_OURTEAM(pSoldier))
          // revealing roofs and looking for items handled here, too
          RevealRoofsAndItems(pSoldier, true, true, pSoldier.bLevel, false);
      }
      // unless in easy mode allow alerted enemies to radio
      else if (gGameOptions.ubDifficultyLevel >= Enum9.DIF_LEVEL_MEDIUM) {
        // don't allow admins to radio
        if (
          pSoldier.bTeam == ENEMY_TEAM &&
          gTacticalStatus.Team[ENEMY_TEAM].bAwareOfOpposition &&
          pSoldier.ubSoldierClass != Enum262.SOLDIER_CLASS_ADMINISTRATOR
        ) {
          RadioSightings(pSoldier, EVERYBODY, pSoldier.bTeam);
        }
      }

      pSoldier.bNewOppCnt = 0;
      pSoldier.bNeedToLook = false;

      // if this soldier's NOT on our team (MAY be under our control, though!)
      if (!PTR_OURTEAM(pSoldier)) OurTeamRadiosRandomlyAbout(pSoldier.ubID); // radio about him only

      // all non-humans under our control would now radio, if they were allowed
      // to radio automatically (but they're not).  So just nuke new opp cnt
      // NEW: under LOCALOPPLIST, humans on other teams now also radio in here
      for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
        pThem = MercSlots[uiLoop];

        if (pThem != null && pThem.bLife >= OKLIFE) {
          // if this merc is on the same team as the target soldier
          if (pThem.bTeam == pSoldier.bTeam) continue; // he doesn't look (he ALWAYS knows about him)

          // other human team's merc report sightings to their teams now
          if (pThem.uiStatusFlags & SOLDIER_PC) {
            // exclude our own team, we've already done them, randomly
            if (pThem.bTeam != gbPlayerNum)
              RadioSightings(pThem, pSoldier.ubID, pThem.bTeam);
          }
          // unless in easy mode allow alerted enemies to radio
          else if (gGameOptions.ubDifficultyLevel >= Enum9.DIF_LEVEL_MEDIUM) {
            // don't allow admins to radio
            if (
              pThem.bTeam == ENEMY_TEAM &&
              gTacticalStatus.Team[ENEMY_TEAM].bAwareOfOpposition &&
              pThem.ubSoldierClass != Enum262.SOLDIER_CLASS_ADMINISTRATOR
            ) {
              RadioSightings(pThem, EVERYBODY, pThem.bTeam);
            }
          }

          pThem.bNewOppCnt = 0;
          pThem.bNeedToLook = false;
        }
      }
    }

    // CJC August 13 2002: at the end of handling sight, reset sight flags to allow interrupts in case an audio cue should
    // cause someone to see an enemy
    gubSightFlags |= SIGHT_INTERRUPT;
  }

  function OurTeamRadiosRandomlyAbout(ubAbout: UINT8): void {
    let iLoop: INT32;
    let radioCnt: INT8 = 0;
    let radioMan: INT8[] /* [20] */ = createArray(20, 0);
    let pSoldier: SOLDIERTYPE;

    // All mercs on our local team check if they should radio about him
    iLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;

    // make a list of all of our team's mercs
    for (
      pSoldier = MercPtrs[iLoop];
      iLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID;
      iLoop++, pSoldier = MercPtrs[iLoop]
    ) {
      // if this merc is active, in this sector, and well enough to look
      if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife >= OKLIFE)
        // put him on our list, and increment the counter
        radioMan[radioCnt++] = iLoop;
    }

    // now RANDOMLY handle each of the mercs on our list, until none remain
    // (this is all being done ONLY so that the mercs in the earliest merc
    //  slots do not arbitrarily get the bulk of the sighting speech quote
    //  action, while the later ones almost never pipe up, and is NOT
    //  strictly necessary, but a nice improvement over original JA)
    while (radioCnt) {
      // pick a merc from one of the remaining slots at random
      iLoop = Random(radioCnt);

      // handle radioing for that merc
      RadioSightings(
        MercPtrs[radioMan[iLoop]],
        ubAbout,
        MercPtrs[radioMan[iLoop]].bTeam,
      );
      Menptr[radioMan[iLoop]].bNewOppCnt = 0;

      // unless it WAS the last used slot that we happened to pick
      if (iLoop != radioCnt - 1)
        // move the contents of the last slot into the one just handled
        radioMan[iLoop] = radioMan[radioCnt - 1];

      radioCnt--;
    }
  }

  function TeamNoLongerSeesMan(
    ubTeam: UINT8,
    pOpponent: SOLDIERTYPE,
    ubExcludeID: UINT8,
    bIteration: INT8,
  ): INT16 {
    let bLoop: UINT16;
    let pMate: SOLDIERTYPE;

    bLoop = gTacticalStatus.Team[ubTeam].bFirstID;

    // look for all mercs on the same team, check opplists for this soldier
    for (
      pMate = MercPtrs[bLoop];
      bLoop <= gTacticalStatus.Team[ubTeam].bLastID;
      bLoop++, pMate = MercPtrs[bLoop]
    ) {
      // if this "teammate" is me, myself, or I (whom we want to exclude)
      if (bLoop == ubExcludeID) continue; // skip to next teammate, I KNOW I don't see him...

      // if this merc is not on the same team
      if (pMate.bTeam != ubTeam) continue; // skip him, he's no teammate at all!

      // if this merc is not active, at base, on assignment, dead, unconscious
      if (!pMate.bActive || !pMate.bInSector || pMate.bLife < OKLIFE) continue; // next merc

      // if this teammate currently sees this opponent
      if (pMate.bOppList[pOpponent.ubID] == SEEN_CURRENTLY) return 0; // that's all I need to know, get out of here
    }

    if (bIteration == 0) {
      if (
        ubTeam == gbPlayerNum &&
        gTacticalStatus.Team[MILITIA_TEAM].bTeamActive
      ) {
        // check militia team as well
        return TeamNoLongerSeesMan(MILITIA_TEAM, pOpponent, ubExcludeID, 1);
      } else if (
        ubTeam == MILITIA_TEAM &&
        gTacticalStatus.Team[gbPlayerNum].bTeamActive
      ) {
        // check player team as well
        return TeamNoLongerSeesMan(gbPlayerNum, pOpponent, ubExcludeID, 1);
      }
    }

    // none of my friends is currently seeing the guy, so return success
    return 1;
  }

  function DistanceSmellable(
    pSoldier: SOLDIERTYPE,
    pSubject: SOLDIERTYPE,
  ): INT16 {
    let sDistVisible: INT16 = STRAIGHT; // as a base

    // if (gTacticalStatus.uiFlags & TURNBASED)
    //{
    sDistVisible *= 2;
    //}
    // else
    //{

    //	sDistVisible += 3;
    //}

    if (pSubject) {
      if (pSubject.uiStatusFlags & SOLDIER_MONSTER) {
        // trying to smell a friend; change nothing
      } else {
        // smelling a human or animal; if they are coated with monster smell, distance shrinks
        sDistVisible = Math.trunc(
          (sDistVisible * (pSubject.bNormalSmell - pSubject.bMonsterSmell)) /
            NORMAL_HUMAN_SMELL_STRENGTH,
        );
        if (sDistVisible < 0) {
          sDistVisible = 0;
        }
      }
    }
    return sDistVisible;
  }

  export function MaxDistanceVisible(): INT16 {
    return STRAIGHT * 2;
  }

  export function DistanceVisible(
    pSoldier: SOLDIERTYPE,
    bFacingDir: INT8,
    bSubjectDir: INT8,
    sSubjectGridNo: INT16,
    bLevel: INT8,
  ): INT16 {
    let sDistVisible: INT16;
    let bLightLevel: INT8;
    let pSubject: SOLDIERTYPE | null;

    pSubject = SimpleFindSoldier(sSubjectGridNo, bLevel);

    if (pSoldier.uiStatusFlags & SOLDIER_MONSTER) {
      if (!pSubject) {
        return 0;
      }
      return DistanceSmellable(pSoldier, pSubject);
    }

    if (pSoldier.bBlindedCounter > 0) {
      // we're bliiiiiiiiind!!!
      return 0;
    }

    if (bFacingDir == Enum245.DIRECTION_IRRELEVANT && TANK(pSoldier)) {
      // always calculate direction for tanks so we have something to work with
      bFacingDir = pSoldier.bDesiredDirection;
      bSubjectDir = GetDirectionToGridNoFromGridNo(
        pSoldier.sGridNo,
        sSubjectGridNo,
      );
      // bSubjectDir = atan8(pSoldier->sX,pSoldier->sY,pOpponent->sX,pOpponent->sY);
    }

    if (
      !TANK(pSoldier) &&
      (bFacingDir == Enum245.DIRECTION_IRRELEVANT ||
        pSoldier.uiStatusFlags & SOLDIER_ROBOT ||
        (pSubject && pSubject.fMuzzleFlash))
    ) {
      sDistVisible = MaxDistanceVisible();
    } else {
      if (pSoldier.sGridNo == sSubjectGridNo) {
        // looking up or down or two people accidentally in same tile... don't want it to be 0!
        sDistVisible = MaxDistanceVisible();
      } else {
        sDistVisible = gbLookDistance[bFacingDir][bSubjectDir];

        if (
          sDistVisible == ANGLE &&
          (pSoldier.bTeam == OUR_TEAM ||
            pSoldier.bAlertStatus >= Enum243.STATUS_RED)
        ) {
          sDistVisible = STRAIGHT;
        }

        sDistVisible *= 2;

        if (pSoldier.usAnimState == Enum193.RUNNING) {
          if (gbLookDistance[bFacingDir][bSubjectDir] != STRAIGHT) {
            // reduce sight when we're not looking in that direction...
            // (20%?)
            sDistVisible = Math.trunc((sDistVisible * 8) / 10);
          }
        }
      }
    }

    if (pSoldier.bLevel != bLevel) {
      // add two tiles distance to visibility to/from roofs
      sDistVisible += 2;
    }

    // now reduce based on light level; SHADE_MIN is the define for the
    // highest number the light can be
    bLightLevel = LightTrueLevel(sSubjectGridNo, bLevel);

    if (
      pSubject &&
      !(pSubject.fMuzzleFlash && bLightLevel > NORMAL_LIGHTLEVEL_DAY)
    ) {
      // ATE: Made function to adjust light distence...
      sDistVisible = AdjustMaxSightRangeForEnvEffects(
        pSoldier,
        bLightLevel,
        sDistVisible,
      );
    }

    // if we wanted to simulate desert-blindness, we'd bump up the light level
    // under certain conditions (daytime in the desert, for instance)
    if (bLightLevel < NORMAL_LIGHTLEVEL_DAY) {
      // greater than normal daylight level; check for sun goggles
      if (
        pSoldier.inv[Enum261.HEAD1POS].usItem == Enum225.SUNGOGGLES ||
        pSoldier.inv[Enum261.HEAD2POS].usItem == Enum225.SUNGOGGLES
      ) {
        // increase sighting distance by up to 2 tiles
        sDistVisible++;
        if (bLightLevel < NORMAL_LIGHTLEVEL_DAY - 1) {
          sDistVisible++;
        }
      }
    } else if (bLightLevel > NORMAL_LIGHTLEVEL_DAY + 5) {
      if (
        pSoldier.inv[Enum261.HEAD1POS].usItem == Enum225.NIGHTGOGGLES ||
        pSoldier.inv[Enum261.HEAD2POS].usItem == Enum225.NIGHTGOGGLES ||
        pSoldier.inv[Enum261.HEAD1POS].usItem == Enum225.UVGOGGLES ||
        pSoldier.inv[Enum261.HEAD2POS].usItem == Enum225.UVGOGGLES ||
        pSoldier.ubBodyType == Enum194.BLOODCAT ||
        AM_A_ROBOT(pSoldier)
      ) {
        if (
          pSoldier.inv[Enum261.HEAD1POS].usItem == Enum225.NIGHTGOGGLES ||
          pSoldier.inv[Enum261.HEAD2POS].usItem == Enum225.NIGHTGOGGLES ||
          AM_A_ROBOT(pSoldier)
        ) {
          if (bLightLevel > NORMAL_LIGHTLEVEL_NIGHT) {
            // when it gets really dark, light-intensification goggles become less effective
            if (bLightLevel < NORMAL_LIGHTLEVEL_NIGHT + 3) {
              sDistVisible += Math.trunc(NIGHTSIGHTGOGGLES_BONUS / 2);
            }
            // else no help at all!
          } else {
            sDistVisible += NIGHTSIGHTGOGGLES_BONUS;
          }
        }
        // UV goggles only function above ground... ditto for bloodcats
        else if (gbWorldSectorZ == 0) {
          sDistVisible += UVGOGGLES_BONUS;
        }
      }

      // give one step better vision for people with nightops
      if (HAS_SKILL_TRAIT(pSoldier, Enum269.NIGHTOPS)) {
        sDistVisible += 1 * NUM_SKILL_TRAITS(pSoldier, Enum269.NIGHTOPS);
      }
    }

    // let tanks see and be seen further (at night)
    if ((TANK(pSoldier) && sDistVisible > 0) || (pSubject && TANK(pSubject))) {
      sDistVisible = Math.max(sDistVisible + 5, MaxDistanceVisible());
    }

    if (
      gpWorldLevelData[pSoldier.sGridNo].ubExtFlags[bLevel] &
      (MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)
    ) {
      if (
        pSoldier.inv[Enum261.HEAD1POS].usItem != Enum225.GASMASK &&
        pSoldier.inv[Enum261.HEAD2POS].usItem != Enum225.GASMASK
      ) {
        // in gas without a gas mask; reduce max distance visible to 2 tiles at most
        sDistVisible = Math.min(sDistVisible, 2);
      }
    }

    return sDistVisible;
  }

  export function EndMuzzleFlash(pSoldier: SOLDIERTYPE): void {
    let uiLoop: UINT32;
    let pOtherSoldier: SOLDIERTYPE;

    pSoldier.fMuzzleFlash = false;

    if (pSoldier.bTeam != gbPlayerNum && pSoldier.bTeam != MILITIA_TEAM) {
      pSoldier.bVisible = 0; // indeterminate state
    }

    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      pOtherSoldier = MercSlots[uiLoop];

      if (pOtherSoldier != null) {
        if (pOtherSoldier.bOppList[pSoldier.ubID] == SEEN_CURRENTLY) {
          if (pOtherSoldier.sGridNo != NOWHERE) {
            if (
              PythSpacesAway(pOtherSoldier.sGridNo, pSoldier.sGridNo) >
              DistanceVisible(
                pOtherSoldier,
                Enum245.DIRECTION_IRRELEVANT,
                Enum245.DIRECTION_IRRELEVANT,
                pSoldier.sGridNo,
                pSoldier.bLevel,
              )
            ) {
              // if this guy can no longer see us, change to seen this turn
              HandleManNoLongerSeen(
                pOtherSoldier,
                pSoldier,
                createElementPointer(pOtherSoldier.bOppList, pSoldier.ubID),
                createElementPointer(
                  gbPublicOpplist[pOtherSoldier.bTeam],
                  pSoldier.ubID,
                ),
              );
            }
            // else this person is still seen, if the looker is on our side or the militia the person should stay visible
            else if (
              pOtherSoldier.bTeam == gbPlayerNum ||
              pOtherSoldier.bTeam == MILITIA_TEAM
            ) {
              pSoldier.bVisible = 1; // yes, still seen
            }
          }
        }
      }
    }
    DecideTrueVisibility(pSoldier, 0);
  }

  export function TurnOffEveryonesMuzzleFlashes(): void {
    let uiLoop: UINT32;
    let pSoldier: SOLDIERTYPE;

    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      pSoldier = MercSlots[uiLoop];

      if (pSoldier != null && pSoldier.fMuzzleFlash) {
        EndMuzzleFlash(pSoldier);
      }
    }
  }

  export function TurnOffTeamsMuzzleFlashes(ubTeam: UINT8): void {
    let ubLoop: UINT8;
    let pSoldier: SOLDIERTYPE;

    for (
      ubLoop = gTacticalStatus.Team[ubTeam].bFirstID;
      ubLoop <= gTacticalStatus.Team[ubTeam].bLastID;
      ubLoop++
    ) {
      pSoldier = MercPtrs[ubLoop];

      if (pSoldier.fMuzzleFlash) {
        EndMuzzleFlash(pSoldier);
      }
    }
  }

  function DecideHearing(pSoldier: SOLDIERTYPE): INT8 {
    // calculate the hearing value for the merc...

    let bSlot: INT8;
    let bHearing: INT8;

    if (TANK(pSoldier)) {
      return -5;
    } else if (pSoldier.uiStatusFlags & SOLDIER_MONSTER) {
      return -10;
    }

    bHearing = 0;

    if (pSoldier.bExpLevel > 3) {
      bHearing++;
    }

    if (HAS_SKILL_TRAIT(pSoldier, Enum269.NIGHTOPS)) {
      // sharper hearing generally
      bHearing += 1 * NUM_SKILL_TRAITS(pSoldier, Enum269.NIGHTOPS);
    }

    bSlot = FindObj(pSoldier, Enum225.EXTENDEDEAR);
    if (bSlot == Enum261.HEAD1POS || bSlot == Enum261.HEAD2POS) {
      // at 81-100% adds +5, at 61-80% adds +4, at 41-60% adds +3, etc.
      bHearing += Math.trunc(pSoldier.inv[bSlot].bStatus[0] / 20) + 1;
    }

    // adjust for dark conditions
    switch (ubAmbientLightLevel) {
      case 8:
      case 9:
        bHearing += 1;
        break;
      case 10:
        bHearing += 2;
        break;
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        bHearing += 3;
        if (HAS_SKILL_TRAIT(pSoldier, Enum269.NIGHTOPS)) {
          // yet another bonus for nighttime
          bHearing += 1 * NUM_SKILL_TRAITS(pSoldier, Enum269.NIGHTOPS);
        }
        break;
      default:
        break;
    }

    return bHearing;
  }

  export function InitOpplistForDoorOpening(): void {
    // this is called before generating a noise for opening a door so that
    // the results of hearing the noise are lumped in with the results from AllTeamsLookForAll
    gubBestToMakeSightingSize = BEST_SIGHTING_ARRAY_SIZE_ALL_TEAMS_LOOK_FOR_ALL;
    gfDelayResolvingBestSightingDueToDoor = true; // will be turned off in allteamslookforall
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "HBSPIR: setting door flag on");
    // must init sight arrays here
    InitSightArrays();
  }

  export function AllTeamsLookForAll(ubAllowInterrupts: boolean): void {
    let uiLoop: UINT32;
    let pSoldier: SOLDIERTYPE;

    if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
      return;
    }

    if (ubAllowInterrupts || !(gTacticalStatus.uiFlags & INCOMBAT)) {
      gubBestToMakeSightingSize =
        BEST_SIGHTING_ARRAY_SIZE_ALL_TEAMS_LOOK_FOR_ALL;
      if (gfDelayResolvingBestSightingDueToDoor) {
        // turn off flag now, and skip init of sight arrays
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "HBSPIR: turning door flag off");
        gfDelayResolvingBestSightingDueToDoor = false;
      } else {
        InitSightArrays();
      }
    }

    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      pSoldier = MercSlots[uiLoop];

      if (pSoldier != null && pSoldier.bLife >= OKLIFE) {
        HandleSight(pSoldier, SIGHT_LOOK); // no radio or interrupts yet
      }
    }

    // the player team now radios about all sightings
    for (
      uiLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      uiLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID;
      uiLoop++
    ) {
      HandleSight(MercPtrs[uiLoop], SIGHT_RADIO); // looking was done above
    }

    if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
      // decide who should get first turn
      HandleBestSightingPositionInRealtime();
      // this could have made us switch to combat mode
      if (gTacticalStatus.uiFlags & INCOMBAT) {
        gubBestToMakeSightingSize = BEST_SIGHTING_ARRAY_SIZE_INCOMBAT;
      } else {
        gubBestToMakeSightingSize = BEST_SIGHTING_ARRAY_SIZE_NONCOMBAT;
      }
    } else if (ubAllowInterrupts) {
      HandleBestSightingPositionInTurnbased();
      // reset sighting size to 0
      gubBestToMakeSightingSize = BEST_SIGHTING_ARRAY_SIZE_INCOMBAT;
    }

    /*

  // do this here as well as in overhead so the looks/interrupts are combined!

  // if a door was recently opened/closed (doesn't matter if we could see it)
  // this is done here so we can first handle everyone looking through the
  // door, and deal with the resulting opplist changes, interrupts, etc.
  if (Status.doorCreakedGridno != NOWHERE)
   {
    // opening/closing a door makes a bit of noise (constant volume)
    MakeNoise(Status.doorCreakedGuynum,Status.doorCreakedGridno,TTypeList[Grid[Status.doorCreakedGridno].land],DOOR_NOISE_VOLUME,NOISE_CREAKING,EXPECTED_NOSEND);

    Status.doorCreakedGridno = NOWHERE;
    Status.doorCreakedGuynum = NOBODY;
   }


  // all soldiers now radio their findings (NO interrupts permitted this early!)
  // NEW: our entire team must radio first, so that they radio about EVERYBODY
  // rather radioing about individuals one a a time (repeats see 1 enemy quote)
  for (cnt = Status.team[Net.pnum].guystart,ptr = MercPtrs[cnt]; cnt < Status.team[Net.pnum].guyend; cnt++,ptr++)
   {
    if (ptr->active && ptr->in_sector && (ptr->life >= OKLIFE))
      HandleSight(ptr,SIGHT_RADIO);      // looking was done above
   }

  for (cnt = 0,ptr = Menptr; cnt < MAXMERCS; cnt++,ptr++)
   {
    if (ptr->active && ptr->in_sector && (ptr->life >= OKLIFE) && !PTR_OURTEAM)
      HandleSight(ptr,SIGHT_RADIO);      // looking was done above
   }


  // if interrupts were allowed
  if (allowInterrupts)
    // resolve interrupts against the selected character (others disallowed)
    HandleSight(MercPtrs[Status.allLookCharacter],SIGHT_INTERRUPT);


  // revert to normal interrupt operation
  InterruptOnlyGuynum = NOBODY;
  InterruptsAllowed = TRUE;
  */

    // reset interrupt only guynum which may have been used
    gubInterruptProvoker = NOBODY;
  }

  function ManLooksForOtherTeams(pSoldier: SOLDIERTYPE): void {
    let uiLoop: UINT32;
    let pOpponent: SOLDIERTYPE;

    // one soldier (pSoldier) looks for every soldier on another team (pOpponent)

    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      pOpponent = MercSlots[uiLoop];

      // if this soldier is around and alive
      if (pOpponent && pOpponent.bLife) {
        // and if he's on another team...
        if (pSoldier.bTeam != pOpponent.bTeam) {
          // use both sides actual x,y co-ordinates (neither side's moving)
          // if he sees this opponent...
          ManLooksForMan(pSoldier, pOpponent, MANLOOKSFOROTHERTEAMS);

          // OK, We now want to , if in non-combat, set visiblity to 0 if not visible still....
          // This allows us to walk away from buddy and have them disappear instantly
          if (
            gTacticalStatus.uiFlags & TURNBASED &&
            !(gTacticalStatus.uiFlags & INCOMBAT)
          ) {
            if (pOpponent.bVisible == 0) {
              pOpponent.bVisible = -1;
            }
          }
        }
      }
    }
  }

  function HandleManNoLongerSeen(
    pSoldier: SOLDIERTYPE,
    pOpponent: SOLDIERTYPE,
    pPersOL: Pointer<INT8>,
    pbPublOL: Pointer<INT8>,
  ): void {
    // if neither side is neutral AND
    // if this soldier is an opponent (fights for different side)
    if (
      !CONSIDERED_NEUTRAL(pOpponent, pSoldier) &&
      !CONSIDERED_NEUTRAL(pSoldier, pOpponent) &&
      pSoldier.bSide != pOpponent.bSide
    ) {
      RemoveOneOpponent(pSoldier);
    }

    // change personal opplist to indicate "seen this turn"
    // don't use UpdatePersonal() here, because we're changing to a *lower*
    // opplist value (which UpdatePersonal ignores) and we're not updating
    // the lastKnown gridno at all, we're keeping it at its previous value
    /*
#ifdef RECORDOPPLIST
fprintf(OpplistFile,"ManLooksForMan: changing personalOpplist to %d for guynum %d, opp %d\n",SEEN_THIS_TURN,ptr->guynum,oppPtr->guynum);
#endif
  */

    pPersOL.value = SEEN_THIS_TURN;

    if (
      pSoldier.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP &&
      pOpponent.bTeam == gbPlayerNum
    ) {
      let ubRoom: UINT8;

      if (
        (ubRoom = InARoom(pOpponent.sGridNo)) !== -1 &&
        IN_BROTHEL(ubRoom) &&
        IN_BROTHEL_GUARD_ROOM(ubRoom)
      ) {
        // unauthorized!
        // make guard run to block guard room
        CancelAIAction(pSoldier, 1);
        pSoldier.AICounter = RESETTIMECOUNTER(0);
        pSoldier.bNextAction = Enum289.AI_ACTION_RUN;
        pSoldier.usNextActionData = 13250;
      }
    }

    // if opponent was seen publicly last time
    if (pbPublOL.value == SEEN_CURRENTLY) {
      // check if I was the only one who was seeing this guy (exlude ourselves)
      // THIS MUST HAPPEN EVEN FOR ENEMIES, TO MAKE THEIR PUBLIC opplist DECAY!
      if (TeamNoLongerSeesMan(pSoldier.bTeam, pOpponent, pSoldier.ubID, 0)) {
        // don't use UpdatePublic() here, because we're changing to a *lower*
        // opplist value (which UpdatePublic ignores) and we're not updating
        // the lastKnown gridno at all, we're keeping it at its previous value
        pbPublOL.value = SEEN_THIS_TURN;

        // ATE: Set visiblity to 0
        if (
          (pSoldier.bTeam == gbPlayerNum || pSoldier.bTeam == MILITIA_TEAM) &&
          !(pOpponent.bTeam == gbPlayerNum || pOpponent.bTeam == MILITIA_TEAM)
        ) {
          pOpponent.bVisible = 0;
        }
      }
    }

    // if we had only seen the guy for an instant and now lost sight of him
    if (gbSeenOpponents[pSoldier.ubID][pOpponent.ubID] == -1)
      // we can't leave it -1, because InterruptDuel() uses the special -1
      // value to know if we're only JUST seen the guy and screw up otherwise
      // it's enough to know we have seen him before
      gbSeenOpponents[pSoldier.ubID][pOpponent.ubID] = 1;
  }

  function ManLooksForMan(
    pSoldier: SOLDIERTYPE,
    pOpponent: SOLDIERTYPE,
    ubCaller: UINT8,
  ): boolean {
    let bDir: INT8;
    let bAware: boolean /* INT8 */ = false;
    let bSuccess: boolean /* INT8 */ = false;
    let sDistVisible: INT16;
    let sDistAway: INT16;
    let pPersOL: Pointer<INT8>;
    let pbPublOL: Pointer<INT8>;

    /*
  if (ptr->guynum >= NOBODY)
   {
 #ifdef BETAVERSION
    NumMessage("ManLooksForMan: ERROR - ptr->guynum = ",ptr->guynum);
 #endif
    return(success);
   }

  if (oppPtr->guynum >= NOBODY)
   {
 #ifdef BETAVERSION
    NumMessage("ManLooksForMan: ERROR - oppPtr->guynum = ",oppPtr->guynum);
 #endif
    return(success);
   }

 */

    // if we're somehow looking while inactive, at base, dead or dying
    if (!pSoldier.bActive || !pSoldier.bInSector || pSoldier.bLife < OKLIFE) {
      /*
    #ifdef BETAVERSION
       sprintf(tempstr,"ManLooksForMan: ERROR - %s is looking while inactive/at base/dead/dying.  Caller %s",
                            ExtMen[ptr->guynum].name,LastCaller2Text[caller]);

    #ifdef RECORDNET
       fprintf(NetDebugFile,"\n\t%s\n\n",tempstr);
    #endif

       PopMessage(tempstr);
    #endif
    */

      return false;
    }

    // if we're somehow looking for a guy who is inactive, at base, or already dead
    if (
      !pOpponent.bActive ||
      !pOpponent.bInSector ||
      pOpponent.bLife <= 0 ||
      pOpponent.sGridNo == NOWHERE
    ) {
      /*
    #ifdef BETAVERSION
       sprintf(tempstr,"ManLooksForMan: ERROR - %s looks for %s, who is inactive/at base/dead.  Caller %s",
            ExtMen[ptr->guynum].name,ExtMen[oppPtr->guynum].name,LastCaller2Text[caller]);

    #ifdef RECORDNET
       fprintf(NetDebugFile,"\n\t%s\n\n",tempstr);
    #endif

       PopMessage(tempstr);
    #endif
    */

      return false;
    }

    // if he's looking for a guy who is on the same team
    if (pSoldier.bTeam == pOpponent.bTeam) {
      /*
    #ifdef BETAVERSION
       sprintf(tempstr,"ManLooksFormMan: ERROR - on SAME TEAM.  ptr->guynum = %d, oppPtr->guynum = %d",
                                            ptr->guynum,oppPtr->guynum);
    #ifdef RECORDNET
       fprintf(NetDebugFile,"\n\t%s\n\n",tempstr);
    #endif

       PopMessage(tempstr);
    #endif
    */

      return false;
    }

    if (pSoldier.bLife < OKLIFE || pSoldier.fMercAsleep == true) {
      return false;
    }

    // NEED TO CHANGE THIS
    /*
  // don't allow unconscious persons to look, but COLLAPSED, etc. is OK
  if (ptr->anitype[ptr->anim] == UNCONSCIOUS)
    return(success);
 */

    if (
      pSoldier.ubBodyType == Enum194.LARVAE_MONSTER ||
      (pSoldier.uiStatusFlags & SOLDIER_VEHICLE && pSoldier.bTeam == OUR_TEAM)
    ) {
      // don't do sight for these
      return false;
    }

    /*
  if (ptrProjected)
   {
    // use looker's PROJECTED x,y co-ordinates (those of his next gridno)
    fromX = ptr->destx;
    fromY = ptr->desty;
    fromGridno = ExtMen[ptr->guynum].nextGridno;
   }
  else
   {
    // use looker's ACTUAL x,y co-ordinates (those of gridno he's in now)
    fromX = ptr->x;
    fromY = ptr->y;
    fromGridno = ptr->sGridNo;
   }


  if (oppPtrProjected)
   {
    // use target's PROJECTED x,y co-ordinates (those of his next gridno)
    toX = oppPtr->destx;
    toY = oppPtr->desty;
    toGridno = ExtMen[oppPtr->guynum].nextGridno;
   }
  else
   {
    // use target's ACTUAL x,y co-ordinates (those of gridno he's in now)
    toX = oppPtr->x;
    toY = oppPtr->y;
    toGridno = oppPtr->gridno;
   }
 */

    pPersOL = createElementPointer(pSoldier.bOppList, pOpponent.ubID);
    pbPublOL = createElementPointer(
      gbPublicOpplist[pSoldier.bTeam],
      pOpponent.ubID,
    );

    // if soldier is known about (SEEN or HEARD within last few turns)
    if (pPersOL.value || pbPublOL.value) {
      bAware = true;

      // then we look for him full viewing distance in EVERY direction
      sDistVisible = DistanceVisible(
        pSoldier,
        Enum245.DIRECTION_IRRELEVANT,
        0,
        pOpponent.sGridNo,
        pOpponent.bLevel,
      );

      // if (pSoldier->ubID == 0)
      // sprintf(gDebugStr,"ALREADY KNOW: ME %d him %d val %d",pSoldier->ubID,pOpponent->ubID,pSoldier->bOppList[pOpponent->ubID]);
    } // soldier is not currently known about
    else {
      // distance we "see" then depends on the direction he is located from us
      bDir = atan8(pSoldier.sX, pSoldier.sY, pOpponent.sX, pOpponent.sY);
      // BIG NOTE: must use desdir instead of direction, since in a projected
      // situation, the direction may still be changing if it's one of the first
      // few animation steps when this guy's turn to do his stepped look comes up
      sDistVisible = DistanceVisible(
        pSoldier,
        pSoldier.bDesiredDirection,
        bDir,
        pOpponent.sGridNo,
        pOpponent.bLevel,
      );

      // if (pSoldier->ubID == 0)
      // sprintf(gDebugStr,"dist visible %d: my dir %d to him %d",sDistVisible,pSoldier->bDesiredDirection,bDir);
    }

    // calculate how many spaces away soldier is (using Pythagoras' theorem)
    sDistAway = PythSpacesAway(pSoldier.sGridNo, pOpponent.sGridNo);

    // if we see close enough to see the soldier
    if (sDistAway <= sDistVisible) {
      // and we can trace a line of sight to his x,y coordinates
      // must use the REAL opplist value here since we may or may not know of him
      if (
        SoldierToSoldierLineOfSightTest(
          pSoldier,
          pOpponent,
          sDistVisible,
          bAware,
        )
      ) {
        ManSeesMan(
          pSoldier,
          pOpponent,
          pOpponent.sGridNo,
          pOpponent.bLevel,
          MANLOOKSFORMAN,
          ubCaller,
        );
        bSuccess = true;
      }

      /*
       // if we're looking for a local merc, and changed doors were in the way
       if (PTR_OURTEAM && (NextFreeDoorIndex > 0))
         // make or fail, if we passed through any "changed" doors along the way,
         // reveal their true status (change the structure to its real value)
         // (do this even if we don't have LOS, to close doors that *BREAK* LOS)
         RevealDoorsAlongLOS();
    */
    }

    /*
  #ifdef RECORDOPPLIST
   fprintf(OpplistFile,"MLFM: %s by %2d(g%4d,x%3d,y%3d,%s) at %2d(g%4d,x%3d,y%3d,%s), aware %d, dA=%d,dV=%d, desDir=%d, %s\n",
                  (success) ? "SCS" : "FLR",
                  ptr->guynum,fromGridno,fromX,fromY,(ptrProjected)?"PROJ":"REG.",
                  oppPtr->guynum,toGridno,toX,toY,(oppPtrProjected)?"PROJ":"REG.",
                  aware,distAway,distVisible,ptr->desdir,
                  LastCaller2Text[caller]);
  #endif
  */

    // if soldier seen personally LAST time could not be seen THIS time
    if (!bSuccess && pPersOL.value == SEEN_CURRENTLY) {
      HandleManNoLongerSeen(pSoldier, pOpponent, pPersOL, pbPublOL);
    } else {
      if (!bSuccess) {
        // we didn't see the opponent, but since we didn't last time, we should be
        // if (*pbPublOL)
        // pOpponent->bVisible = TRUE;
      }
    }

    return bSuccess;
  }

  function ManSeesMan(
    pSoldier: SOLDIERTYPE,
    pOpponent: SOLDIERTYPE,
    sOppGridno: INT16,
    bOppLevel: INT8,
    ubCaller: UINT8,
    ubCaller2: UINT8,
  ): void {
    let bDoLocate: boolean /* INT8 */ = false;
    let fNewOpponent: boolean = false;
    let fNotAddedToList: boolean = true;
    let bOldOppList: INT8 = pSoldier.bOppList[pOpponent.ubID];

    if (pSoldier.ubID >= NOBODY) {
      /*
#ifdef BETAVERSION
NumMessage("ManSeesMan: ERROR - ptr->guynum = ",ptr->guynum);
#endif
    */
      return;
    }

    if (pOpponent.ubID >= NOBODY) {
      /*
#ifdef BETAVERSION
NumMessage("ManSeesMan: ERROR - oppPtr->guynum = ",oppPtr->guynum);
#endif
    */
      return;
    }

    // if we're somehow looking while inactive, at base, dying or already dead
    if (!pSoldier.bActive || !pSoldier.bInSector || pSoldier.bLife < OKLIFE) {
      /*
#ifdef BETAVERSION
sprintf(tempstr,"ManSeesMan: ERROR - %s is SEEING ManSeesMan while inactive/at base/dead/dying",ExtMen[ptr->guynum].name);
PopMessage(tempstr);
#endif
   */
      return;
    }

    // if we're somehow seeing a guy who is inactive, at base, or already dead
    if (!pOpponent.bActive || !pOpponent.bInSector || pOpponent.bLife <= 0) {
      /*
#ifdef BETAVERSION
sprintf(tempstr,"ManSeesMan: ERROR - %s sees %s, ManSeesMan, who is inactive/at base/dead",ExtMen[ptr->guynum].name,ExtMen[oppPtr->guynum].name);
PopMessage(tempstr);
#endif
    */
      return;
    }

    // if we're somehow seeing a guy who is on the same team
    if (pSoldier.bTeam == pOpponent.bTeam) {
      /*
#ifdef BETAVERSION
sprintf(tempstr,"ManSeesMan: ERROR - on SAME TEAM.  ptr->guynum = %d, oppPtr->guynum = %d",
                                   ptr->guynum,oppPtr->guynum);
PopMessage(tempstr);
#endif
    */
      return;
    }

    // if we're seeing a guy we didn't see on our last chance to look for him
    if (pSoldier.bOppList[pOpponent.ubID] != SEEN_CURRENTLY) {
      if (pOpponent.bTeam == gbPlayerNum) {
        if (pSoldier.ubProfile != NO_PROFILE) {
          if (pSoldier.bTeam == CIV_TEAM) {
            // if this person doing the sighting is a member of a civ group that hates us but
            // this fact hasn't been revealed, change the side of these people now. This will
            // make them non-neutral so AddOneOpponent will be called, and the guy will say his
            // "I hate you" quote
            if (pSoldier.bNeutral) {
              if (
                pSoldier.ubCivilianGroup != Enum246.NON_CIV_GROUP &&
                gTacticalStatus.fCivGroupHostile[pSoldier.ubCivilianGroup] >=
                  CIV_GROUP_WILL_BECOME_HOSTILE
              ) {
                AddToShouldBecomeHostileOrSayQuoteList(pSoldier.ubID);
                fNotAddedToList = false;
              }
            } else if (
              NPCHasUnusedRecordWithGivenApproach(
                pSoldier.ubProfile,
                Enum296.APPROACH_DECLARATION_OF_HOSTILITY,
              )
            ) {
              // only add if have something to say
              AddToShouldBecomeHostileOrSayQuoteList(pSoldier.ubID);
              fNotAddedToList = false;
            }

            if (fNotAddedToList) {
              switch (pSoldier.ubProfile) {
                case Enum268.CARMEN:
                  if (pOpponent.ubProfile == Enum268.SLAY) {
                    // 64
                    // Carmen goes to war (against Slay)
                    if (pSoldier.bNeutral) {
                      // SetSoldierNonNeutral( pSoldier );
                      pSoldier.bAttitude = Enum242.ATTACKSLAYONLY;
                      TriggerNPCRecord(pSoldier.ubProfile, 28);
                    }
                    /*
                  if ( ! gTacticalStatus.uiFlags & INCOMBAT )
                  {
                          EnterCombatMode( pSoldier->bTeam );
                  }
                  */
                  }
                  break;
                case Enum268.ELDIN:
                  if (pSoldier.bNeutral) {
                    let ubRoom: UINT8 = 0;
                    // if player is in behind the ropes of the museum display
                    // or if alarm has gone off (status red)
                    ubRoom = InARoom(pOpponent.sGridNo);

                    if (
                      (CheckFact(Enum170.FACT_MUSEUM_OPEN, 0) == false &&
                        ubRoom >= 22 &&
                        ubRoom <= 41) ||
                      CheckFact(Enum170.FACT_MUSEUM_ALARM_WENT_OFF, 0) ||
                      ubRoom == 39 ||
                      ubRoom == 40 ||
                      FindObj(pOpponent, Enum225.CHALICE) != NO_SLOT
                    ) {
                      SetFactTrue(Enum170.FACT_MUSEUM_ALARM_WENT_OFF);
                      AddToShouldBecomeHostileOrSayQuoteList(pSoldier.ubID);
                    }
                  }
                  break;
                case Enum268.JIM:
                case Enum268.JACK:
                case Enum268.OLAF:
                case Enum268.RAY:
                case Enum268.OLGA:
                case Enum268.TYRONE:
                  // change orders, reset action!
                  if (pSoldier.bOrders != Enum241.SEEKENEMY) {
                    pSoldier.bOrders = Enum241.SEEKENEMY;
                    if (pSoldier.bOppCnt == 0) {
                      // didn't see anyone before!
                      CancelAIAction(pSoldier, 1);
                      SetNewSituation(pSoldier);
                    }
                  }
                  break;
                case Enum268.ANGEL:
                  if (pOpponent.ubProfile == Enum268.MARIA) {
                    if (
                      CheckFact(
                        Enum170.FACT_MARIA_ESCORTED_AT_LEATHER_SHOP,
                        Enum268.MARIA,
                      ) == true
                    ) {
                      // she was rescued! yay!
                      TriggerNPCRecord(Enum268.ANGEL, 12);
                    }
                  } else if (
                    CheckFact(Enum170.FACT_ANGEL_LEFT_DEED, Enum268.ANGEL) ==
                      true &&
                    CheckFact(
                      Enum170.FACT_ANGEL_MENTIONED_DEED,
                      Enum268.ANGEL,
                    ) == false
                  ) {
                    CancelAIAction(pSoldier, 1);
                    pSoldier.sAbsoluteFinalDestination = NOWHERE;
                    EVENT_StopMerc(
                      pSoldier,
                      pSoldier.sGridNo,
                      pSoldier.bDirection,
                    );
                    TriggerNPCRecord(Enum268.ANGEL, 20);
                    // trigger Angel to walk off afterwards
                    // TriggerNPCRecord( ANGEL, 24 );
                  }
                  break;
                // case QUEEN:
                case Enum268.JOE:
                case Enum268.ELLIOT:
                  if (
                    !(
                      gMercProfiles[pSoldier.ubProfile].ubMiscFlags2 &
                      PROFILE_MISC_FLAG2_SAID_FIRSTSEEN_QUOTE
                    )
                  ) {
                    if (!AreInMeanwhile()) {
                      TriggerNPCRecord(pSoldier.ubProfile, 4);
                      gMercProfiles[pSoldier.ubProfile].ubMiscFlags2 |=
                        PROFILE_MISC_FLAG2_SAID_FIRSTSEEN_QUOTE;
                    }
                  }
                  break;
                default:
                  break;
              }
            }
          } else {
            switch (pSoldier.ubProfile) {
              /*
            case MIKE:
                    if ( gfPlayerTeamSawMike && !( gMercProfiles[ pSoldier->ubProfile ].ubMiscFlags2 & PROFILE_MISC_FLAG2_SAID_FIRSTSEEN_QUOTE ) )
                    {
                            InitiateConversation( pSoldier, pOpponent, NPC_INITIAL_QUOTE, 0 );
                            gMercProfiles[ pSoldier->ubProfile ].ubMiscFlags2 |= PROFILE_MISC_FLAG2_SAID_FIRSTSEEN_QUOTE;
                    }
                    break;
                    */
              case Enum268.IGGY:
                if (
                  !(
                    gMercProfiles[pSoldier.ubProfile].ubMiscFlags2 &
                    PROFILE_MISC_FLAG2_SAID_FIRSTSEEN_QUOTE
                  )
                ) {
                  TriggerNPCRecord(pSoldier.ubProfile, 9);
                  gMercProfiles[pSoldier.ubProfile].ubMiscFlags2 |=
                    PROFILE_MISC_FLAG2_SAID_FIRSTSEEN_QUOTE;
                  gbPublicOpplist[gbPlayerNum][pSoldier.ubID] = HEARD_THIS_TURN;
                }
                break;
            }
          }
        } else {
          if (pSoldier.bTeam == CIV_TEAM) {
            if (
              pSoldier.ubCivilianGroup != Enum246.NON_CIV_GROUP &&
              gTacticalStatus.fCivGroupHostile[pSoldier.ubCivilianGroup] >=
                CIV_GROUP_WILL_BECOME_HOSTILE &&
              pSoldier.bNeutral
            ) {
              AddToShouldBecomeHostileOrSayQuoteList(pSoldier.ubID);
            } else if (pSoldier.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP) {
              // generic kingpin goon...

              // check to see if we are looking at Maria or unauthorized personnel in the brothel
              if (pOpponent.ubProfile == Enum268.MARIA) {
                MakeCivHostile(pSoldier, 2);
                if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
                  EnterCombatMode(pSoldier.bTeam);
                }
                SetFactTrue(Enum170.FACT_MARIA_ESCAPE_NOTICED);
              } else {
                let ubRoom: UINT8;

                // JA2 Gold: only go hostile if see player IN guard room
                // if ( InARoom( pOpponent->sGridNo, &ubRoom ) && IN_BROTHEL( ubRoom ) && ( gMercProfiles[ MADAME ].bNPCData == 0 || IN_BROTHEL_GUARD_ROOM( ubRoom ) ) )
                if (
                  (ubRoom = InARoom(pOpponent.sGridNo)) !== -1 &&
                  IN_BROTHEL_GUARD_ROOM(ubRoom)
                ) {
                  // unauthorized!
                  MakeCivHostile(pSoldier, 2);
                  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
                    EnterCombatMode(pSoldier.bTeam);
                  }
                }
              }
            } else if (
              pSoldier.ubCivilianGroup == Enum246.HICKS_CIV_GROUP &&
              CheckFact(Enum170.FACT_HICKS_MARRIED_PLAYER_MERC, 0) == false
            ) {
              let uiTime: UINT32;
              let sX: INT16;
              let sY: INT16;

              // if before 6:05 or after 22:00, make hostile and enter combat
              uiTime = GetWorldMinutesInDay();
              if (uiTime < 365 || uiTime > 1320) {
                // get off our farm!
                MakeCivHostile(pSoldier, 2);
                if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
                  EnterCombatMode(pSoldier.bTeam);

                  LocateSoldier(pSoldier.ubID, 1);
                  ({ sScreenX: sX, sScreenY: sY } =
                    GetSoldierScreenPos(pSoldier));
                  // begin quote
                  BeginCivQuote(
                    pSoldier,
                    Enum201.CIV_QUOTE_HICKS_SEE_US_AT_NIGHT,
                    0,
                    sX,
                    sY,
                  );
                }
              }
            }
          }
        }
      } else if (pSoldier.bTeam == gbPlayerNum) {
        if (
          pOpponent.ubProfile == Enum268.MIKE &&
          pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC &&
          !(pSoldier.usQuoteSaidExtFlags & SOLDIER_QUOTE_SAID_EXT_MIKE)
        ) {
          if (gfMikeShouldSayHi == 0) {
            gfMikeShouldSayHi = 1;
          }
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_AIM_SEEN_MIKE);
          pSoldier.usQuoteSaidExtFlags |= SOLDIER_QUOTE_SAID_EXT_MIKE;
        } else if (
          pOpponent.ubProfile == Enum268.JOEY &&
          gfPlayerTeamSawJoey == false
        ) {
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_SPOTTED_JOEY);
          gfPlayerTeamSawJoey = true;
        }
      }

      // as soon as a bloodcat sees someone, it becomes hostile
      // this is safe to do here because we haven't made this new person someone we've seen yet
      // (so we are assured we won't count 'em twice for oppcnt purposes)
      if (pSoldier.ubBodyType == Enum194.BLOODCAT) {
        if (pSoldier.bNeutral) {
          MakeBloodcatsHostile();
          /*
  SetSoldierNonNeutral( pSoldier );
  RecalculateOppCntsDueToNoLongerNeutral( pSoldier );
  if ( ( gTacticalStatus.uiFlags & INCOMBAT ) )
  {
          CheckForPotentialAddToBattleIncrement( pSoldier );
  }
        */

          PlayJA2Sample(
            Enum330.BLOODCAT_ROAR,
            RATE_11025,
            HIGHVOLUME,
            1,
            MIDDLEPAN,
          );
        } else {
          if (pSoldier.bOppCnt == 0) {
            if (Random(2) == 0) {
              PlayJA2Sample(
                Enum330.BLOODCAT_ROAR,
                RATE_11025,
                HIGHVOLUME,
                1,
                MIDDLEPAN,
              );
            }
          }
        }
      } else if (
        pOpponent.ubBodyType == Enum194.BLOODCAT &&
        pOpponent.bNeutral
      ) {
        MakeBloodcatsHostile();
        /*
      SetSoldierNonNeutral( pOpponent );
      RecalculateOppCntsDueToNoLongerNeutral( pOpponent );
      if ( ( gTacticalStatus.uiFlags & INCOMBAT ) )
      {
              CheckForPotentialAddToBattleIncrement( pOpponent );
      }
      */
      }

      // if both of us are not neutral, AND
      // if this man is actually a true opponent (we're not on the same side)
      if (
        !CONSIDERED_NEUTRAL(pOpponent, pSoldier) &&
        !CONSIDERED_NEUTRAL(pSoldier, pOpponent) &&
        pSoldier.bSide != pOpponent.bSide
      ) {
        AddOneOpponent(pSoldier);

        // if we also haven't seen him earlier this turn
        if (pSoldier.bOppList[pOpponent.ubID] != SEEN_THIS_TURN) {
          fNewOpponent = true;
          pSoldier.bNewOppCnt++; // increment looker's NEW opponent count
          // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, L"Soldier %d sees soldier %d!", pSoldier->ubID, pOpponent->ubID );

          // ExtMen[ptr->guynum].lastCaller = caller;
          // ExtMen[ptr->guynum].lastCaller2 = caller2;

          IncrementWatchedLoc(
            pSoldier.ubID,
            pOpponent.sGridNo,
            pOpponent.bLevel,
          );

          if (pSoldier.bTeam == OUR_TEAM && pOpponent.bTeam == ENEMY_TEAM) {
            if (CheckFact(Enum170.FACT_FIRST_BATTLE_FOUGHT, 0) == false) {
              SetFactTrue(Enum170.FACT_FIRST_BATTLE_BEING_FOUGHT);
            }
          }
        } else {
          SetWatchedLocAsUsed(
            pSoldier.ubID,
            pOpponent.sGridNo,
            pOpponent.bLevel,
          );
        }

        // we already know the soldier isn't SEEN_CURRENTLY,
        // now check if he is really "NEW" ie. not expected to be there

        // if the looker hasn't seen this opponent at all earlier this turn, OR
        // if the opponent is not where the looker last thought him to be
        if (
          pSoldier.bOppList[pOpponent.ubID] != SEEN_THIS_TURN ||
          gsLastKnownOppLoc[pSoldier.ubID][pOpponent.ubID] != sOppGridno
        ) {
          SetNewSituation(pSoldier); // force the looker to re-evaluate
        } else {
          // if we in a non-combat movement decision, presumably this is not
          // something we were quite expecting, so make a new decision.  For
          // other (combat) movement decisions, we took his position into account
          // when we made it, so don't make us think again & slow things down.
          switch (pSoldier.bAction) {
            case Enum289.AI_ACTION_RANDOM_PATROL:
            case Enum289.AI_ACTION_SEEK_OPPONENT:
            case Enum289.AI_ACTION_SEEK_FRIEND:
            case Enum289.AI_ACTION_POINT_PATROL:
            case Enum289.AI_ACTION_LEAVE_WATER_GAS:
            case Enum289.AI_ACTION_SEEK_NOISE:
              SetNewSituation(pSoldier); // force the looker to re-evaluate
              break;
          }
        }
      }
    }
    // bOldOppValue = pSoldier->bOppList[ pOpponent->ubID ];
    // remember that the soldier is currently seen and his new location
    UpdatePersonal(
      pSoldier,
      pOpponent.ubID,
      SEEN_CURRENTLY,
      sOppGridno,
      bOppLevel,
    );

    if (
      ubCaller2 == MANLOOKSFOROTHERTEAMS ||
      ubCaller2 == OTHERTEAMSLOOKFORMAN ||
      ubCaller2 == CALLER_UNKNOWN
    ) {
      // unknown->hearing
      if (
        gubBestToMakeSightingSize != BEST_SIGHTING_ARRAY_SIZE_INCOMBAT &&
        gTacticalStatus.bBoxingState == Enum247.NOT_BOXING
      ) {
        if (fNewOpponent) {
          if (gTacticalStatus.uiFlags & INCOMBAT) {
            // presumably a door opening... we do require standard interrupt conditions
            if (
              StandardInterruptConditionsMet(
                pSoldier,
                pOpponent.ubID,
                bOldOppList,
              )
            ) {
              ReevaluateBestSightingPosition(
                pSoldier,
                CalcInterruptDuelPts(pSoldier, pOpponent.ubID, true),
              );
            }
          }
          // require the enemy not to be dying if we are the sighter; in other words,
          // always add for AI guys, and always add for people with life >= OKLIFE
          else if (
            !(pSoldier.bTeam == gbPlayerNum && pOpponent.bLife < OKLIFE)
          ) {
            ReevaluateBestSightingPosition(
              pSoldier,
              CalcInterruptDuelPts(pSoldier, pOpponent.ubID, true),
            );
          }
        }
      }
    }

    // if this man has never seen this opponent before in this sector
    if (gbSeenOpponents[pSoldier.ubID][pOpponent.ubID] == 0)
      // remember that he is just seeing him now for the first time (-1)
      gbSeenOpponents[pSoldier.ubID][pOpponent.ubID] = -1;
    else
      // man is seeing an opponent AGAIN whom he has seen at least once before
      gbSeenOpponents[pSoldier.ubID][pOpponent.ubID] = 1;

    // if looker is on local team, and the enemy was invisible or "maybe"
    // visible just prior to this
    if (
      (PTR_OURTEAM(pSoldier) || pSoldier.bTeam == MILITIA_TEAM) &&
      pOpponent.bVisible <= 0
    ) {
      // if opponent was truly invisible, not just turned off temporarily (FALSE)
      if (pOpponent.bVisible == -1) {
        // then locate to him and set his locator flag
        bDoLocate = true;
      }

      // make opponent visible (to us)
      // must do this BEFORE the locate since it checks for visibility
      pOpponent.bVisible = 1;

      // ATE: Cancel any fading going on!
      // ATE: Added for fade in.....
      if (pOpponent.fBeginFade == 1 || pOpponent.fBeginFade == 2) {
        pOpponent.fBeginFade = 0;

        if (
          pOpponent.bLevel > 0 &&
          gpWorldLevelData[pOpponent.sGridNo].pRoofHead != null
        ) {
          pOpponent.ubFadeLevel = (<LEVELNODE>(
            gpWorldLevelData[pOpponent.sGridNo].pRoofHead
          )).ubShadeLevel;
        } else {
          pOpponent.ubFadeLevel = (<LEVELNODE>(
            gpWorldLevelData[pOpponent.sGridNo].pLandHead
          )).ubShadeLevel;
        }

        // Set levelnode shade level....
        if (pOpponent.pLevelNode) {
          pOpponent.pLevelNode.ubShadeLevel = pOpponent.ubFadeLevel;
        }
      }

      // update variable for STATUS screen
      // pOpponent->bLastKnownLife = pOpponent->life;

      if (bDoLocate) {
        // Change his anim speed!
        SetSoldierAniSpeed(pOpponent);

        // if show enemies is ON, then we must have already revealed these roofs
        // and we're also following his movements, so don't bother sliding
        if (!gbShowEnemies) {
          // DoSoldierRoofs(pOpponent);
          // slide to the newly seen opponent, and if appropriate, start his locator
          // SlideToMe = oppPtr->guynum;
        }

        // LastOpponentLocatedTo = oppPtr->guynum;

        /*
#ifdef RECORDNET
fprintf(NetDebugFile,"\tManSeesMan - LOCATE\n");
#endif
      */

        if (
          gTacticalStatus.uiFlags & TURNBASED &&
          (gTacticalStatus.uiFlags & INCOMBAT || gTacticalStatus.fVirginSector)
        ) {
          if (!pOpponent.bNeutral && pSoldier.bSide != pOpponent.bSide) {
            SlideTo(0, pOpponent.ubID, pSoldier.ubID, SETLOCATOR);
          }
        }
      }
    } else if (!PTR_OURTEAM(pSoldier)) {
      // ATE: Check stance, change to threatending
      ReevaluateEnemyStance(pSoldier, pSoldier.usAnimState);
    }
  }

  function DecideTrueVisibility(pSoldier: SOLDIERTYPE, ubLocate: UINT8): void {
    // if his visibility is still in the special "limbo" state (FALSE)
    if (pSoldier.bVisible == 0) {
      // then none of our team's merc turned him visible,
      // therefore he now becomes truly invisible
      pSoldier.bVisible = -1;

      // Don;t adjust anim speed here, it's done once fade is over!
    }

    // If soldier is not visible, make sure his red "locator" is turned off
    // if ((pSoldier->bVisible < 0) && !gbShowEnemies)
    //	pSoldier->bLocator = FALSE;

    if (ubLocate) {
      // if he remains visible (or ShowEnemies ON)
      if (pSoldier.bVisible >= 0 || gbShowEnemies) {
        /*
#ifdef RECORDNET
fprintf(NetDebugFile,"\tDecideTrueVisibility - LOCATE\n");
#endif
*/

        if (PTR_OURTEAM(pSoldier)) {
          // if (ConfigOptions[FOLLOWMODE] && Status.stopSlidingAt == NOBODY)
          //  LocateMember(ptr->guynum,DONTSETLOCATOR);
        } else if (
          gTacticalStatus.uiFlags & TURNBASED &&
          gTacticalStatus.uiFlags & INCOMBAT
        )
          // not our team - if we're NOT allied then locate...
          // if (pSoldier->side != gTacticalStatus.Team[gbPlayerNum].side && ConfigOptions[FOLLOWMODE])
          // if (Status.stopSlidingAt == NOBODY)
          // LocateSoldier(pSoldier->ubID,DONTSETLOCATOR);
          SlideTo(0, pSoldier.ubID, NOBODY, DONTSETLOCATOR);

        // follow his movement on our screen as he moves around...
        // LocateMember(ptr->guynum,DONTSETLOCATOR);
      }
    }
  }

  function OtherTeamsLookForMan(pOpponent: SOLDIERTYPE): void {
    let uiLoop: UINT32;
    let bOldOppList: INT8;
    let pSoldier: SOLDIERTYPE;

    // NumMessage("OtherTeamsLookForMan, guy#",oppPtr->guynum);

    // if the guy we're looking for is NOT on our team AND is currently visible
    if (
      pOpponent.bTeam != gbPlayerNum &&
      pOpponent.bTeam != MILITIA_TEAM &&
      pOpponent.bVisible >= 0 &&
      pOpponent.bVisible < 2 &&
      pOpponent.bLife
    ) {
      // assume he's no longer visible, until one of our mercs sees him again
      pOpponent.bVisible = 0;
    }

    // all soldiers not on oppPtr's team now look for him
    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      pSoldier = MercSlots[uiLoop];

      // if this merc is active, in this sector, and well enough to look
      if (
        pSoldier != null &&
        pSoldier.bLife >= OKLIFE &&
        pSoldier.ubBodyType != Enum194.LARVAE_MONSTER
      ) {
        // if this merc is on the same team as the target soldier
        if (pSoldier.bTeam == pOpponent.bTeam) {
          continue; // he doesn't look (he ALWAYS knows about him)
        }

        bOldOppList = pSoldier.bOppList[pOpponent.ubID];

        // this merc looks for the soldier in question
        // use both sides actual x,y co-ordinates (neither side's moving)
        if (ManLooksForMan(pSoldier, pOpponent, OTHERTEAMSLOOKFORMAN)) {
          // if a new opponent is seen (which must be oppPtr himself)
          // if ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) && pSoldier->bNewOppCnt)
          // Calc interrupt points in non-combat because we might get an interrupt or be interrupted
          // on our first turn

          // if doing regular in-combat sighting (not on opening doors!)
          if (gubBestToMakeSightingSize == BEST_SIGHTING_ARRAY_SIZE_INCOMBAT) {
            if (
              gTacticalStatus.uiFlags & TURNBASED &&
              gTacticalStatus.uiFlags & INCOMBAT &&
              pSoldier.bNewOppCnt
            ) {
              // as long as viewer meets minimum interrupt conditions
              if (
                gubSightFlags & SIGHT_INTERRUPT &&
                StandardInterruptConditionsMet(
                  pSoldier,
                  pOpponent.ubID,
                  bOldOppList,
                )
              ) {
                // calculate the interrupt duel points
                pSoldier.bInterruptDuelPts = CalcInterruptDuelPts(
                  pSoldier,
                  pOpponent.ubID,
                  true,
                );
                DebugMsg(
                  TOPIC_JA2,
                  DBG_LEVEL_3,
                  FormatString(
                    "Calculating int duel pts in OtherTeamsLookForMan, %d has %d points",
                    pSoldier.ubID,
                    pSoldier.bInterruptDuelPts,
                  ),
                );
              } else {
                pSoldier.bInterruptDuelPts = NO_INTERRUPT;
              }
            }
          }
        }

        // if "Show only enemies seen" option is ON and it's this guy looking
        // if (ptr->guynum == ShowOnlySeenPerson)
        // NewShowOnlySeenPerson(ptr);                  // update the string
      }
    }

    // if he's not on our team
    if (pOpponent.bTeam != gbPlayerNum) {
      // don't do a locate here, it's already done by Man Sees Man for new opps.
      DecideTrueVisibility(pOpponent, NOLOCATE);
    }
  }

  function AddOneOpponent(pSoldier: SOLDIERTYPE): void {
    let bOldOppCnt: INT8 = pSoldier.bOppCnt;

    pSoldier.bOppCnt++;

    if (!bOldOppCnt) {
      // if we hadn't known about opponents being here for sure prior to this
      if (pSoldier.ubBodyType == Enum194.LARVAE_MONSTER) {
        // never become aware of you!
        return;
      }

      if (pSoldier.bAlertStatus < Enum243.STATUS_RED) {
        CheckForChangingOrders(pSoldier);
      }

      pSoldier.bAlertStatus = Enum243.STATUS_BLACK; // force black AI status right away

      if (pSoldier.uiStatusFlags & SOLDIER_MONSTER) {
        pSoldier.ubCaller = NOBODY;
        pSoldier.bCallPriority = 0;
      }
    }

    if (pSoldier.bTeam == gbPlayerNum) {
      // adding an opponent for player; reset # of turns that we haven't seen an enemy
      gTacticalStatus.bConsNumTurnsNotSeen = 0;
    }
  }

  function RemoveOneOpponent(pSoldier: SOLDIERTYPE): void {
    pSoldier.bOppCnt--;

    if (pSoldier.bOppCnt < 0) {
      DebugMsg(
        TOPIC_JA2,
        DBG_LEVEL_3,
        FormatString(
          "Oppcnt for %d (%s) tried to go below 0",
          pSoldier.ubID,
          pSoldier.name,
        ),
      );
      pSoldier.bOppCnt = 0;
    }

    // if no opponents remain in sight, drop status to RED (but NOT newSit.!)
    if (!pSoldier.bOppCnt) pSoldier.bAlertStatus = Enum243.STATUS_RED;
  }

  export function RemoveManAsTarget(pSoldier: SOLDIERTYPE): void {
    let pOpponent: SOLDIERTYPE;
    let ubTarget: UINT8;
    let ubLoop: UINT8;

    ubTarget = pSoldier.ubID;

    // clean up the public opponent lists and locations
    for (ubLoop = 0; ubLoop < MAXTEAMS; ubLoop++)
      // never causes any additional looks
      UpdatePublic(ubLoop, ubTarget, NOT_HEARD_OR_SEEN, NOWHERE, 0);

    /*


  IAN COMMENTED THIS OUT MAY 1997 - DO WE NEED THIS?

   // make sure this guy is no longer a possible target for anyone
   for (cnt = 0, pOpponent = Menptr; cnt < MAXMERCS; cnt++,pOpponent++)
    {
     if (pOpponent->bOppNum == ubTarget)
         pOpponent->bOppNum = NOBODY;
    }

          */

    // clean up all opponent's opplists
    for (ubLoop = 0; ubLoop < guiNumMercSlots; ubLoop++) {
      pOpponent = MercSlots[ubLoop];

      // if the target is active, a true opponent and currently seen by this merc
      if (pOpponent) {
        // check to see if OPPONENT considers US neutral
        if (
          pOpponent.bOppList[ubTarget] == SEEN_CURRENTLY &&
          !pOpponent.bNeutral &&
          !CONSIDERED_NEUTRAL(pOpponent, pSoldier) &&
          pSoldier.bSide != pOpponent.bSide
        ) {
          RemoveOneOpponent(pOpponent);
        }
        UpdatePersonal(pOpponent, ubTarget, NOT_HEARD_OR_SEEN, NOWHERE, 0);
        gbSeenOpponents[ubLoop][ubTarget] = 0;
      }
    }

    /*

   for (ubLoop = 0,pOpponent = Menptr; ubLoop < MAXMERCS; ubLoop++,pOpponent++)
    {
     // if the target is a true opponent and currently seen by this merc
     if (!pSoldier->bNeutral && !pSoldier->bNeutral &&
         (pOpponent->bOppList[ubTarget] == SEEN_CURRENTLY)

                           )
                           ///*** UNTIL ANDREW GETS THE SIDE PARAMETERS WORKING
         // && (pSoldier->side != pOpponent->side))
      {
       RemoveOneOpponent(pOpponent);
      }

     UpdatePersonal(pOpponent,ubTarget,NOT_HEARD_OR_SEEN,NOWHERE,0);

     gbSeenOpponents[ubLoop][ubTarget] = FALSE;
    }
  */

    ResetLastKnownLocs(pSoldier);

    if (gTacticalStatus.Team[pSoldier.bTeam].ubLastMercToRadio == ubTarget)
      gTacticalStatus.Team[pSoldier.bTeam].ubLastMercToRadio = NOBODY;
  }

  function UpdatePublic(
    ubTeam: UINT8,
    ubID: UINT8,
    bNewOpplist: INT8,
    sGridno: INT16,
    bLevel: INT8,
  ): void {
    let cnt: INT32;
    let pbPublOL: INT8;
    let ubTeamMustLookAgain: boolean /* UINT8 */ = false;
    let ubMadeDifference: boolean /* UINT8 */ = false;
    let pSoldier: SOLDIERTYPE;

    pbPublOL = gbPublicOpplist[ubTeam][ubID];

    // if new opplist is more up-to-date, or we are just wiping it for some reason
    if (
      bNewOpplist == NOT_HEARD_OR_SEEN ||
      gubKnowledgeValue[pbPublOL - OLDEST_HEARD_VALUE][
        bNewOpplist - OLDEST_HEARD_VALUE
      ] > 0
    ) {
      // if this team is becoming aware of a soldier it wasn't previously aware of
      if (bNewOpplist != NOT_HEARD_OR_SEEN && pbPublOL == NOT_HEARD_OR_SEEN)
        ubTeamMustLookAgain = true;

      // change the public opplist *BEFORE* anyone looks again or we'll recurse!
      pbPublOL = bNewOpplist;
      gbPublicOpplist[ubTeam][ubID] = pbPublOL;
    }

    // always update the gridno, no matter what
    gsPublicLastKnownOppLoc[ubTeam][ubID] = sGridno;
    gbPublicLastKnownOppLevel[ubTeam][ubID] = bLevel;

    // if team has been told about a guy the team was completely unaware of
    if (ubTeamMustLookAgain) {
      // then everyone on team who's not aware of guynum must look for him
      cnt = gTacticalStatus.Team[ubTeam].bFirstID;

      for (
        pSoldier = MercPtrs[cnt];
        cnt <= gTacticalStatus.Team[ubTeam].bLastID;
        cnt++, pSoldier = MercPtrs[cnt]
      ) {
        // if this soldier is active, in this sector, and well enough to look
        if (
          pSoldier.bActive &&
          pSoldier.bInSector &&
          pSoldier.bLife >= OKLIFE &&
          !(pSoldier.uiStatusFlags & SOLDIER_GASSED)
        ) {
          // if soldier isn't aware of guynum, give him another chance to see
          if (pSoldier.bOppList[ubID] == NOT_HEARD_OR_SEEN) {
            if (ManLooksForMan(pSoldier, MercPtrs[ubID], UPDATEPUBLIC))
              // then he actually saw guynum because of our new public knowledge
              ubMadeDifference = true;

            // whether successful or not, whack newOppCnt.  Since this is a
            // delayed reaction to a radio call, there's no chance of interrupt!
            pSoldier.bNewOppCnt = 0;

            // if "Show only enemies seen" option is ON and it's this guy looking
            // if (pSoldier->ubID == ShowOnlySeenPerson)
            // NewShowOnlySeenPerson(pSoldier);                  // update the string
          }
        }
      }
    }
  }

  function UpdatePersonal(
    pSoldier: SOLDIERTYPE,
    ubID: UINT8,
    bNewOpplist: INT8,
    sGridno: INT16,
    bLevel: INT8,
  ): void {
    /*
#ifdef RECORDOPPLIST
fprintf(OpplistFile,"UpdatePersonal - for %d about %d to %d (was %d) at g%d\n",
          ptr->guynum,guynum,newOpplist,ptr->opplist[guynum],gridno);
#endif

  */

    // if new opplist is more up-to-date, or we are just wiping it for some reason
    if (
      gubKnowledgeValue[pSoldier.bOppList[ubID] - OLDEST_HEARD_VALUE][
        bNewOpplist - OLDEST_HEARD_VALUE
      ] > 0 ||
      bNewOpplist == NOT_HEARD_OR_SEEN
    ) {
      pSoldier.bOppList[ubID] = bNewOpplist;
    }

    // always update the gridno, no matter what
    gsLastKnownOppLoc[pSoldier.ubID][ubID] = sGridno;
    gbLastKnownOppLevel[pSoldier.ubID][ubID] = bLevel;
  }

  function OurMaxPublicOpplist(): INT8 {
    let uiLoop: UINT32;
    let bHighestOpplist: INT8 = 0;
    let ubOppValue: UINT8;
    let ubHighestValue: UINT8 = 0;
    let pSoldier: SOLDIERTYPE;

    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      pSoldier = MercSlots[uiLoop];

      // if this merc is inactive, at base, on assignment, or dead
      if (!pSoldier || !pSoldier.bLife) continue; // next merc

      // if this man is NEUTRAL / on our side, he's not an opponent
      if (
        pSoldier.bNeutral ||
        gTacticalStatus.Team[gbPlayerNum].bSide == Menptr[pSoldier.ubID].bSide
      )
        continue; // next merc

      // opponent, check our public opplist value for him
      ubOppValue =
        gubKnowledgeValue[0 - OLDEST_HEARD_VALUE][
          gbPublicOpplist[gbPlayerNum][pSoldier.ubID] - OLDEST_HEARD_VALUE
        ];

      if (ubOppValue > ubHighestValue) {
        ubHighestValue = ubOppValue;
        bHighestOpplist = gbPublicOpplist[gbPlayerNum][pSoldier.ubID];
      }
    }

    return bHighestOpplist;
  }

  /*
BOOLEAN VisibleAnywhere(SOLDIERTYPE *pSoldier)
{
 INT8 team,cnt;
 SOLDIERTYPE *pOpponent;


 // this takes care of any mercs on our own team
 if (pSoldier->bVisible >= 0)
   return(TRUE);

 // if playing alone, "anywhere" is just over here!
 //if (!Net.multiType || Net.activePlayers < 2)
   //return(FALSE);


 for (bTeam = 0; bTeam < MAXTEAMS; bTeam++)
  {
   // skip our team (local visible flag will do for them)
   if (bTeam == gbPlayerNum)
     continue;

   // skip any inactive teams
   if (!gTacticalStatus.team[bTeam].teamActive)
     continue;

   // skip non-human teams (they don't communicate for their machines!)
   if (!gTacticalStatus.Team[bTeam].human)
     continue;

   // so we're left with another human player's team of mercs...

   // check if soldier is currently visible to any human mercs on other teams
   for (cnt = Status.team[team].guystart,oppPtr = Menptr + cnt; cnt < Status.team[team].guyend; cnt++,oppPtr++)
    {
     // if this merc is inactive, or in no condition to care
     if (!oppPtr->active || !oppPtr->in_sector || oppPtr->deadAndRemoved || (oppPtr->life < OKLIFE))
       continue;          // skip him!

     if (oppPtr->opplist[ptr->guynum] == SEEN_CURRENTLY)
       return(TRUE);
    }
  }


 // nobody anywhere sees him
 return(FALSE);
}

*/

  function ResetLastKnownLocs(pSoldier: SOLDIERTYPE): void {
    let uiLoop: UINT32;

    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      if (MercSlots[uiLoop]) {
        gsLastKnownOppLoc[pSoldier.ubID][MercSlots[uiLoop].ubID] = NOWHERE;

        // IAN added this June 14/97
        gsPublicLastKnownOppLoc[pSoldier.bTeam][MercSlots[uiLoop].ubID] =
          NOWHERE;
      }
    }
  }

  /*
// INITIALIZATION STUFF
-------------------------
// Upon loading a scenario, call these:
InitOpponentKnowledgeSystem();

// loop through all soldiers and for each soldier call
InitSoldierOpplist(pSoldier);

// call this once
AllTeamsLookForAll(NO_INTERRUPTS);	// no interrupts permitted this early


// for each additional soldier created, call
InitSoldierOpplist(pSoldier);
HandleSight(pSoldier,SIGHT_LOOK);



MOVEMENT STUFF
-----------------
// whenever new tile is reached, call
HandleSight(pSoldier,SIGHT_LOOK);

*/

  export function InitOpponentKnowledgeSystem(): void {
    let iTeam: INT32;
    let cnt: INT32;
    let cnt2: INT32;

    for (let i = 0; i < TOTAL_SOLDIERS; i++) {
      gbSeenOpponents[i].fill(0);
    }

    for (let i = 0; i < MAXTEAMS; i++) {
      gbPublicOpplist[i].fill(NOT_HEARD_OR_SEEN);
    }

    for (iTeam = 0; iTeam < MAXTEAMS; iTeam++) {
      gubPublicNoiseVolume[iTeam] = 0;
      gsPublicNoiseGridno[iTeam] = NOWHERE;
      gbPublicNoiseLevel[iTeam] = 0;
      for (cnt = 0; cnt < MAX_NUM_SOLDIERS; cnt++) {
        gsPublicLastKnownOppLoc[iTeam][cnt] = NOWHERE;
      }
    }

    // initialize public last known locations for all teams
    for (cnt = 0; cnt < MAX_NUM_SOLDIERS; cnt++) {
      for (cnt2 = 0; cnt2 < NUM_WATCHED_LOCS; cnt2++) {
        gsWatchedLoc[cnt][cnt2] = NOWHERE;
        gubWatchedLocPoints[cnt][cnt2] = 0;
        gfWatchedLocReset[cnt][cnt2] = false;
      }
    }

    for (cnt = 0; cnt < SHOULD_BECOME_HOSTILE_SIZE; cnt++) {
      gubShouldBecomeHostileOrSayQuote[cnt] = NOBODY;
    }

    gubNumShouldBecomeHostileOrSayQuote = 0;
  }

  export function InitSoldierOppList(pSoldier: SOLDIERTYPE): void {
    pSoldier.bOppList.fill(NOT_HEARD_OR_SEEN);
    pSoldier.bOppCnt = 0;
    ResetLastKnownLocs(pSoldier);
    gbSeenOpponents[pSoldier.ubID].fill(0);
  }

  export function BetweenTurnsVisibilityAdjustments(): void {
    let cnt: INT32;
    let pSoldier: SOLDIERTYPE;

    // make all soldiers on other teams that are no longer seen not visible
    for (
      cnt = 0, pSoldier = Menptr[cnt];
      cnt < MAXMERCS;
      cnt++, pSoldier = Menptr[cnt]
    ) {
      if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife) {
        if (!PTR_OURTEAM(pSoldier) && pSoldier.bTeam != MILITIA_TEAM) {
          // check if anyone on our team currently sees him (exclude NOBODY)
          if (TeamNoLongerSeesMan(gbPlayerNum, pSoldier, NOBODY, 0)) {
            // then our team has lost sight of him
            pSoldier.bVisible = -1; // make him fully invisible

            // Allow fade to adjust anim speed
          }
        }
      }
    }
  }

  function SaySeenQuote(
    pSoldier: SOLDIERTYPE,
    fSeenCreature: UINT8 /* boolean */,
    fVirginSector: boolean,
    fSeenJoey: boolean,
  ): void {
    let pTeamSoldier: SOLDIERTYPE;
    let ubNumEnemies: UINT8 = 0;
    let ubNumAllies: UINT8 = 0;
    let cnt: UINT32;

    if (AreInMeanwhile()) {
      return;
    }

    // Check out for our under large fire quote
    if (!(pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_IN_SHIT)) {
      // Get total enemies.
      // Loop through all mercs in sector and count # of enemies
      for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
        pTeamSoldier = MercSlots[cnt];

        if (pTeamSoldier != null) {
          if (OK_ENEMY_MERC(pTeamSoldier)) {
            ubNumEnemies++;
          }
        }
      }

      // OK, after this, check our guys
      for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
        pTeamSoldier = MercSlots[cnt];

        if (pTeamSoldier != null) {
          if (!OK_ENEMY_MERC(pTeamSoldier)) {
            if (pTeamSoldier.bOppCnt >= Math.trunc(ubNumEnemies / 2)) {
              ubNumAllies++;
            }
          }
        }
      }

      // now check!
      if (pSoldier.bOppCnt - ubNumAllies > 2) {
        // Say quote!
        TacticalCharacterDialogue(
          pSoldier,
          Enum202.QUOTE_IN_TROUBLE_SLASH_IN_BATTLE,
        );

        pSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_IN_SHIT;

        return;
      }
    }

    if (fSeenCreature == 1) {
      // Is this our first time seeing them?
      if (
        gMercProfiles[pSoldier.ubProfile].ubMiscFlags &
        PROFILE_MISC_FLAG_HAVESEENCREATURE
      ) {
        // Are there multiplaes and we have not said this quote during this battle?
        if (
          !(pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_MULTIPLE_CREATURES)
        ) {
          // Check for multiples!
          ubNumEnemies = 0;

          // Get total enemies.
          // Loop through all mercs in sector and count # of enemies
          for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
            pTeamSoldier = MercSlots[cnt];

            if (pTeamSoldier != null) {
              if (OK_ENEMY_MERC(pTeamSoldier)) {
                if (
                  pTeamSoldier.uiStatusFlags & SOLDIER_MONSTER &&
                  pSoldier.bOppList[pTeamSoldier.ubID] == SEEN_CURRENTLY
                ) {
                  ubNumEnemies++;
                }
              }
            }
          }

          if (ubNumEnemies > 2) {
            // Yes, set flag
            pSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_MULTIPLE_CREATURES;

            // Say quote
            TacticalCharacterDialogue(
              pSoldier,
              Enum202.QUOTE_ATTACKED_BY_MULTIPLE_CREATURES,
            );
          } else {
            TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_SEE_CREATURE);
          }
        } else {
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_SEE_CREATURE);
        }
      } else {
        // Yes, set flag
        gMercProfiles[pSoldier.ubProfile].ubMiscFlags |=
          PROFILE_MISC_FLAG_HAVESEENCREATURE;

        TacticalCharacterDialogue(
          pSoldier,
          Enum202.QUOTE_FIRSTTIME_GAME_SEE_CREATURE,
        );
      }
    }
    // 2 is for bloodcat...
    else if (fSeenCreature == 2) {
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_SPOTTED_BLOODCAT);
    } else {
      if (fVirginSector) {
        // First time we've seen a guy this sector
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_SEE_ENEMY_VARIATION);
      } else {
        // FIXME: Language-specific code
        // #ifdef ENGLISH
        if (Random(100) < 30) {
          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_ENEMY);
        } else {
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_SEE_ENEMY);
        }
        // #else
        //       TacticalCharacterDialogue(pSoldier, QUOTE_SEE_ENEMY);
        // #endif
      }
    }
  }

  function OurTeamSeesSomeone(
    pSoldier: SOLDIERTYPE,
    bNumReRevealed: INT8,
    bNumNewEnemies: INT8,
  ): void {
    if (gTacticalStatus.fVirginSector) {
      // If we are in NPC dialogue now... stop!
      DeleteTalkingMenu();

      // Say quote!
      SaySeenQuote(
        pSoldier,
        gfPlayerTeamSawCreatures,
        true,
        gfPlayerTeamSawJoey,
      );

      HaultSoldierFromSighting(pSoldier, true);

      // Set virgin sector to false....
      gTacticalStatus.fVirginSector = false;
    } else {
      // if this merc is selected and he's actually moving
      // if ((pSoldier->ubID == gusSelectedSoldier) && !pSoldier->bStopped)
      // ATE: Change this to if the guy is ours....
      // How will this feel?
      if (pSoldier.bTeam == gbPlayerNum) {
        // STOP IF WE WERE MOVING....
        /// Speek up!
        if (bNumReRevealed > 0 && bNumNewEnemies == 0) {
          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
        } else {
          SaySeenQuote(
            pSoldier,
            gfPlayerTeamSawCreatures,
            false,
            gfPlayerTeamSawJoey,
          );
        }

        HaultSoldierFromSighting(pSoldier, true);

        if (gTacticalStatus.fEnemySightingOnTheirTurn) {
          // Locate to our guy, then slide to enemy
          LocateSoldier(pSoldier.ubID, SETLOCATOR);

          // Now slide to other guy....
          SlideTo(
            NOWHERE,
            gTacticalStatus.ubEnemySightingOnTheirTurnEnemyID,
            NOBODY,
            SETLOCATOR,
          );
        }

        // Unset User's turn UI
        UnSetUIBusy(pSoldier.ubID);
      }
    }

    // OK, check what music mode we are in, change to battle if we're in battle
    // If we are in combat....
    if (gTacticalStatus.uiFlags & INCOMBAT) {
      // If we are NOT in any music mode...
      if (gubMusicMode == Enum328.MUSIC_NONE) {
        SetMusicMode(Enum328.MUSIC_TACTICAL_BATTLE);
      }
    }
  }

  export function RadioSightings(
    pSoldier: SOLDIERTYPE,
    ubAbout: UINT8,
    ubTeamToRadioTo: UINT8,
  ): void {
    let pOpponent: SOLDIERTYPE;
    let iLoop: INT32;
    let start: UINT8;
    let end: UINT8;
    let revealedEnemies: UINT8 = 0;
    let unknownEnemies: UINT8 = 0;
    let stillUnseen: boolean /* UINT8 */ = true;
    let scrollToGuynum: UINT8 = NOBODY;
    let sightedHatedOpponent: boolean /* UINT8 */ = false;
    // UINT8 	oppIsCivilian;
    let pPersOL: INT8;
    let pbPublOL: INT8; //,dayQuote;
    let fContactSeen: boolean;
    let fSawCreatureForFirstTime: boolean = false;

    gTacticalStatus.Team[pSoldier.bTeam].ubLastMercToRadio = pSoldier.ubID;

    // who are we radioing about?
    if (ubAbout == EVERYBODY) {
      start = 0;
      end = MAXMERCS;
    } else {
      start = ubAbout;
      end = ubAbout + 1;
    }

    // hang a pointer to the start of our this guy's personal opplist
    pPersOL = pSoldier.bOppList[start];

    // hang a pointer to the start of this guy's opponents in the public opplist
    pbPublOL = gbPublicOpplist[ubTeamToRadioTo][start];

    pOpponent = MercPtrs[start];

    // loop through every one of this guy's opponents
    for (iLoop = start; iLoop < end; iLoop++) {
      pOpponent = MercPtrs[iLoop];
      pPersOL = pSoldier.bOppList[iLoop];
      pbPublOL = gbPublicOpplist[ubTeamToRadioTo][iLoop];
      fContactSeen = false;

      // make sure this merc is active, here & still alive (unconscious OK)
      if (!pOpponent.bActive || !pOpponent.bInSector || !pOpponent.bLife) {
        continue; // skip to the next merc
      }

      // if these two mercs are on the same SIDE, then they're NOT opponents
      // NEW: Apr. 21 '96: must allow ALL non-humans to get radioed about
      if (
        pSoldier.bSide == pOpponent.bSide &&
        pOpponent.uiStatusFlags & SOLDIER_PC
      ) {
        continue; // skip to the next merc
      }

      // determine whether we think we're still unseen or if "our cover's blown"
      // if we know about this opponent's location for any reason
      if (pOpponent.bVisible >= 0 || gbShowEnemies) {
        // and he can see us, then gotta figure we KNOW that he can see us
        if (pOpponent.bOppList[pSoldier.ubID] == SEEN_CURRENTLY)
          stillUnseen = false;
      }

      // if we personally don't know a thing about this opponent
      if (pPersOL == NOT_HEARD_OR_SEEN) {
        continue; // skip to the next opponent
      }

      // if personal knowledge is NOT more up to date and NOT the same as public
      if (
        !gubKnowledgeValue[pbPublOL - OLDEST_HEARD_VALUE][
          pPersOL - OLDEST_HEARD_VALUE
        ] &&
        pbPublOL != pPersOL
      ) {
        continue; // skip to the next opponent
      }

      // if it's our merc, and he currently sees this opponent
      if (
        PTR_OURTEAM(pSoldier) &&
        pPersOL == SEEN_CURRENTLY &&
        !(pOpponent.bSide == pSoldier.bSide || pOpponent.bNeutral)
      ) {
        // used by QueueDayMessage() to scroll to one of the new enemies
        // scroll to the last guy seen, unless we see a hated guy, then use him!
        if (!sightedHatedOpponent) scrollToGuynum = pOpponent.ubID;

        // don't care whether and how many new enemies are seen if everyone visible
        // and he's healthy enough to be a threat (so is worth talking about)

        // do the following if we're radioing to our own team; if radioing to militia
        // then alert them instead
        if (ubTeamToRadioTo != MILITIA_TEAM) {
          if (!gbShowEnemies && pOpponent.bLife >= OKLIFE) {
            // if this enemy has not been publicly seen or heard recently
            if (pbPublOL == NOT_HEARD_OR_SEEN) {
              // chalk up another "unknown" enemy
              unknownEnemies++;

              fContactSeen = true;
              // if this enemy is hated by the merc doing the sighting
              // if (MercHated(Proptr[ptr->characternum].p_bias,oppPtr->characternum))
              // sightedHatedOpponent = TRUE;

              // now the important part: does this enemy see him/her back?
              if (pOpponent.bOppList[pSoldier.ubID] != SEEN_CURRENTLY) {
                // EXPERIENCE GAIN (10): Discovered a new enemy without being seen
                StatChange(pSoldier, EXPERAMT, 10, FROM_SUCCESS);
              }
            } else {
              // if he has publicly not been seen now, or anytime during this turn
              if (pbPublOL != SEEN_CURRENTLY && pbPublOL != SEEN_THIS_TURN) {
                // chalk up another "revealed" enemy
                revealedEnemies++;
                fContactSeen = true;
              } else {
                if (MercPtrs[0].bLife < 10) {
                  let i: number = 0;
                }
              }
            }

            if (fContactSeen) {
              if (pSoldier.bTeam == gbPlayerNum) {
                if (gTacticalStatus.ubCurrentTeam != gbPlayerNum) {
                  // Save some stuff!
                  if (gTacticalStatus.fEnemySightingOnTheirTurn) {
                    // this has already come up so turn OFF the pause-all-anims flag for the previous
                    // person and set it for this next person
                    MercPtrs[
                      gTacticalStatus.ubEnemySightingOnTheirTurnEnemyID
                    ].fPauseAllAnimation = false;
                  } else {
                    gTacticalStatus.fEnemySightingOnTheirTurn = true;
                  }
                  gTacticalStatus.ubEnemySightingOnTheirTurnEnemyID =
                    pOpponent.ubID;
                  gTacticalStatus.ubEnemySightingOnTheirTurnPlayerID =
                    pSoldier.ubID;
                  gTacticalStatus.uiTimeSinceDemoOn = GetJA2Clock();

                  pOpponent.fPauseAllAnimation = true;
                }
              }

              if (pOpponent.uiStatusFlags & SOLDIER_MONSTER) {
                gfPlayerTeamSawCreatures = 1;
              }

              // ATE: Added for bloodcat...
              if (pOpponent.ubBodyType == Enum194.BLOODCAT) {
                // 2 is for bloodcat
                gfPlayerTeamSawCreatures = 2;
              }
            }

            if (pOpponent.uiStatusFlags & SOLDIER_MONSTER) {
              if (
                !(
                  gMercProfiles[pSoldier.ubProfile].ubMiscFlags &
                  PROFILE_MISC_FLAG_HAVESEENCREATURE
                )
              ) {
                fSawCreatureForFirstTime = true;
              }
            }
          }
        } else {
          // radioing to militia that we saw someone! alert them!
          if (
            gTacticalStatus.Team[MILITIA_TEAM].bTeamActive &&
            !gTacticalStatus.Team[MILITIA_TEAM].bAwareOfOpposition
          ) {
            HandleInitialRedAlert(MILITIA_TEAM, false);
          }
        }
      } // end of our team's merc sees new opponent

      // IF WE'RE HERE, OUR PERSONAL INFORMATION IS AT LEAST AS UP-TO-DATE
      // AS THE PUBLIC KNOWLEDGE, SO WE WILL REPLACE THE PUBLIC KNOWLEDGE

      UpdatePublic(
        ubTeamToRadioTo,
        pOpponent.ubID,
        pPersOL,
        gsLastKnownOppLoc[pSoldier.ubID][pOpponent.ubID],
        gbLastKnownOppLevel[pSoldier.ubID][pOpponent.ubID],
      );
    }

    // if soldier heard a misc noise more important that his team's public one
    if (pSoldier.ubNoiseVolume > gubPublicNoiseVolume[ubTeamToRadioTo]) {
      // replace the soldier's team's public noise with his
      gsPublicNoiseGridno[ubTeamToRadioTo] = pSoldier.sNoiseGridno;
      gbPublicNoiseLevel[ubTeamToRadioTo] = pSoldier.bNoiseLevel;
      gubPublicNoiseVolume[ubTeamToRadioTo] = pSoldier.ubNoiseVolume;
    }

    // if this soldier is on the local team
    if (PTR_OURTEAM(pSoldier)) {
      // don't trigger sighting quotes or stop merc's movement if everyone visible
      // if (!(gTacticalStatus.uiFlags & SHOW_ALL_MERCS))
      {
        // if we've revealed any enemies, or seen any previously unknown enemies
        if (revealedEnemies || unknownEnemies) {
          // First check for a virgin map and set to false if we see our first guy....
          // Only if this guy is an ememy!

          OurTeamSeesSomeone(pSoldier, revealedEnemies, unknownEnemies);
        } else if (fSawCreatureForFirstTime) {
          gMercProfiles[pSoldier.ubProfile].ubMiscFlags |=
            PROFILE_MISC_FLAG_HAVESEENCREATURE;
          TacticalCharacterDialogue(
            pSoldier,
            Enum202.QUOTE_FIRSTTIME_GAME_SEE_CREATURE,
          );
        }
      }
    }
  }

  const COLOR1 = (FONT_MCOLOR_BLACK << 8) | FONT_MCOLOR_LTGREEN;
  const COLOR2 = (FONT_MCOLOR_BLACK << 8) | FONT_MCOLOR_LTGRAY2;

  const LINE_HEIGHT = 15;

  export function DebugSoldierPage1(): void {
    let pSoldier: SOLDIERTYPE;
    let usSoldierIndex: UINT16 = 0;
    let uiMercFlags: UINT32 = 0;
    let usMapPos: UINT16 = 0;
    let ubLine: UINT8 = 0;

    if (
      FindSoldierFromMouse(
        createPointer(
          () => usSoldierIndex,
          (v) => (usSoldierIndex = v),
        ),
        createPointer(
          () => uiMercFlags,
          (v) => (uiMercFlags = v),
        ),
      )
    ) {
      // Get Soldier
      pSoldier = <SOLDIERTYPE>GetSoldier(usSoldierIndex);

      SetFont(LARGEFONT1());
      gprintf(0, 0, "DEBUG SOLDIER PAGE ONE, GRIDNO %d", pSoldier.sGridNo);
      SetFont(LARGEFONT1());

      ubLine = 2;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "ID:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.ubID);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "TEAM:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bTeam);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "SIDE:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bSide);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "STATUS FLAGS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%x", pSoldier.uiStatusFlags);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "HUMAN:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%d",
        gTacticalStatus.Team[pSoldier.bTeam].bHuman,
      );
      ubLine++;
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "APs:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bActionPoints);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Breath:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bBreath);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Life:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bLife);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "LifeMax:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bLifeMax);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Bleeding:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bBleeding);

      ubLine = 2;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Agility:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        350,
        LINE_HEIGHT * ubLine,
        "%d ( %d )",
        pSoldier.bAgility,
        EffectiveAgility(pSoldier),
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Dexterity:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        350,
        LINE_HEIGHT * ubLine,
        "%d( %d )",
        pSoldier.bDexterity,
        EffectiveDexterity(pSoldier),
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Strength:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(350, LINE_HEIGHT * ubLine, "%d", pSoldier.bStrength);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Wisdom:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        350,
        LINE_HEIGHT * ubLine,
        "%d ( %d )",
        pSoldier.bWisdom,
        EffectiveWisdom(pSoldier),
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Exp Lvl:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        350,
        LINE_HEIGHT * ubLine,
        "%d ( %d )",
        pSoldier.bExpLevel,
        EffectiveExpLevel(pSoldier),
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Mrksmnship:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        350,
        LINE_HEIGHT * ubLine,
        "%d ( %d )",
        pSoldier.bMarksmanship,
        EffectiveMarksmanship(pSoldier),
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Mechanical:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(350, LINE_HEIGHT * ubLine, "%d", pSoldier.bMechanical);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Explosive:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(350, LINE_HEIGHT * ubLine, "%d", pSoldier.bExplosive);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Medical:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(350, LINE_HEIGHT * ubLine, "%d", pSoldier.bMedical);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Drug Effects:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(400, LINE_HEIGHT * ubLine, "%d", pSoldier.bDrugEffect[0]);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Drug Side Effects:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(400, LINE_HEIGHT * ubLine, "%d", pSoldier.bDrugSideEffect[0]);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Booze Effects:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(400, LINE_HEIGHT * ubLine, "%d", pSoldier.bDrugEffect[1]);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "Hangover Side Effects:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(400, LINE_HEIGHT * ubLine, "%d", pSoldier.bDrugSideEffect[1]);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(200, LINE_HEIGHT * ubLine, "AI has Keys:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(400, LINE_HEIGHT * ubLine, "%d", pSoldier.bHasKeys);
      ubLine++;
    } else if (
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      SetFont(LARGEFONT1());
      gprintf(0, 0, "DEBUG LAND PAGE ONE");
      SetFont(LARGEFONT1());

      ubLine++;
      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Num dirty rects:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(200, LINE_HEIGHT * ubLine, "%d", guiNumBackSaves);
      ubLine++;
    }
  }

  export function DebugSoldierPage2(): void {
    let pSoldier: SOLDIERTYPE;
    let usSoldierIndex: UINT16 = 0;
    let uiMercFlags: UINT32 = 0;
    let usMapPos: UINT16 = 0;
    let TileElem: TILE_ELEMENT = createTileElement();
    let pNode: LEVELNODE | null;
    let ubLine: UINT8;

    if (
      FindSoldierFromMouse(
        createPointer(
          () => usSoldierIndex,
          (v) => (usSoldierIndex = v),
        ),
        createPointer(
          () => uiMercFlags,
          (v) => (uiMercFlags = v),
        ),
      )
    ) {
      // Get Soldier
      pSoldier = <SOLDIERTYPE>GetSoldier(usSoldierIndex);

      SetFont(LARGEFONT1());
      gprintf(0, 0, "DEBUG SOLDIER PAGE TWO, GRIDNO %d", pSoldier.sGridNo);
      SetFont(LARGEFONT1());

      ubLine = 2;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "ID:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.ubID);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Body Type:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.ubBodyType);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Opp Cnt:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bOppCnt);
      ubLine++;

      if (pSoldier.bTeam == OUR_TEAM || pSoldier.bTeam == MILITIA_TEAM) {
        // look at 8 to 15 opplist entries
        SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
        gprintf(0, LINE_HEIGHT * ubLine, "Opplist B:");
        SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%d %d %d %d %d %d %d %d",
          pSoldier.bOppList[20],
          pSoldier.bOppList[21],
          pSoldier.bOppList[22],
          pSoldier.bOppList[23],
          pSoldier.bOppList[24],
          pSoldier.bOppList[25],
          pSoldier.bOppList[26],
          pSoldier.bOppList[27],
        );
        ubLine++;
      } // team 1 - enemies so look at first 8 (0-7) opplist entries
      else {
        SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
        gprintf(0, LINE_HEIGHT * ubLine, "OppList A:");
        SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%d %d %d %d %d %d %d %d",
          pSoldier.bOppList[0],
          pSoldier.bOppList[1],
          pSoldier.bOppList[2],
          pSoldier.bOppList[3],
          pSoldier.bOppList[4],
          pSoldier.bOppList[5],
          pSoldier.bOppList[6],
          pSoldier.bOppList[7],
        );
        ubLine++;
      }

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Visible:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bVisible);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Direction:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%s",
        gzDirectionStr[pSoldier.bDirection],
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "DesDirection:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%s",
        gzDirectionStr[pSoldier.bDesiredDirection],
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "GridNo:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.sGridNo);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Dest:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.sFinalDestination);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Path Size:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.usPathDataSize);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Path Index:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.usPathIndex);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "First 3 Steps:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%d %d %d",
        pSoldier.usPathingData[0],
        pSoldier.usPathingData[1],
        pSoldier.usPathingData[2],
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Next 3 Steps:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%d %d %d",
        pSoldier.usPathingData[pSoldier.usPathIndex],
        pSoldier.usPathingData[pSoldier.usPathIndex + 1],
        pSoldier.usPathingData[pSoldier.usPathIndex + 2],
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "FlashInd:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.fFlashLocator);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "ShowInd:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.fShowLocator);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Main hand:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%s",
        ShortItemNames[pSoldier.inv[Enum261.HANDPOS].usItem],
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Second hand:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%s",
        ShortItemNames[pSoldier.inv[Enum261.SECONDHANDPOS].usItem],
      );
      ubLine++;

      if (
        GetMouseMapPos(
          createPointer(
            () => usMapPos,
            (v) => (usMapPos = v),
          ),
        )
      ) {
        SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
        gprintf(0, LINE_HEIGHT * ubLine, "CurrGridNo:");
        SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
        gprintf(150, LINE_HEIGHT * ubLine, "%d", usMapPos);
        ubLine++;
      }
    } else if (
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      SetFont(LARGEFONT1());
      gprintf(0, 0, "DEBUG LAND PAGE TWO");
      SetFont(LARGEFONT1());

      ubLine = 1;

      SetFontColors(COLOR1);
      mprintf(0, LINE_HEIGHT * ubLine, "Land Raised:");
      SetFontColors(COLOR2);
      mprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%d",
        gpWorldLevelData[usMapPos].sHeight,
      );
      ubLine++;

      SetFontColors(COLOR1);
      mprintf(0, LINE_HEIGHT * ubLine, "Land Node:");
      SetFontColors(COLOR2);
      mprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%x",
        gpWorldLevelData[usMapPos].pLandHead,
      );
      ubLine++;

      if (gpWorldLevelData[usMapPos].pLandHead != null) {
        SetFontColors(COLOR1);
        mprintf(0, LINE_HEIGHT * ubLine, "Land Node:");
        SetFontColors(COLOR2);
        mprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%d",
          (<LEVELNODE>gpWorldLevelData[usMapPos].pLandHead).usIndex,
        );
        ubLine++;

        TileElem =
          gTileDatabase[
            (<LEVELNODE>gpWorldLevelData[usMapPos].pLandHead).usIndex
          ];

        // Check for full tile
        SetFontColors(COLOR1);
        mprintf(0, LINE_HEIGHT * ubLine, "Full Land:");
        SetFontColors(COLOR2);
        mprintf(150, LINE_HEIGHT * ubLine, "%d", TileElem.ubFullTile);
        ubLine++;
      }

      SetFontColors(COLOR1);
      mprintf(0, LINE_HEIGHT * ubLine, "Land St Node:");
      SetFontColors(COLOR2);
      mprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%x",
        gpWorldLevelData[usMapPos].pLandStart,
      );
      ubLine++;

      SetFontColors(COLOR1);
      mprintf(0, LINE_HEIGHT * ubLine, "GRIDNO:");
      SetFontColors(COLOR2);
      mprintf(150, LINE_HEIGHT * ubLine, "%d", usMapPos);
      ubLine++;

      if (gpWorldLevelData[usMapPos].uiFlags & MAPELEMENT_MOVEMENT_RESERVED) {
        SetFontColors(COLOR2);
        mprintf(
          0,
          LINE_HEIGHT * ubLine,
          "Merc: %d",
          gpWorldLevelData[usMapPos].ubReservedSoldierID,
        );
        SetFontColors(COLOR2);
        mprintf(150, LINE_HEIGHT * ubLine, "RESERVED MOVEMENT FLAG ON:");
        ubLine++;
      }

      pNode = GetCurInteractiveTile();

      if (pNode != null) {
        SetFontColors(COLOR2);
        mprintf(0, LINE_HEIGHT * ubLine, "Tile: %d", pNode.usIndex);
        SetFontColors(COLOR2);
        mprintf(150, LINE_HEIGHT * ubLine, "ON INT TILE");
        ubLine++;
      }

      if (gpWorldLevelData[usMapPos].uiFlags & MAPELEMENT_REVEALED) {
        SetFontColors(COLOR2);
        // mprintf( 0, LINE_HEIGHT * 9, L"Merc: %d",  gpWorldLevelData[ usMapPos ].ubReservedSoldierID );
        SetFontColors(COLOR2);
        mprintf(150, LINE_HEIGHT * ubLine, "REVEALED");
        ubLine++;
      }

      if (gpWorldLevelData[usMapPos].uiFlags & MAPELEMENT_RAISE_LAND_START) {
        SetFontColors(COLOR2);
        // mprintf( 0, LINE_HEIGHT * 9, L"Merc: %d",  gpWorldLevelData[ usMapPos ].ubReservedSoldierID );
        SetFontColors(COLOR2);
        mprintf(150, LINE_HEIGHT * ubLine, "Land Raise Start");
        ubLine++;
      }

      if (gpWorldLevelData[usMapPos].uiFlags & MAPELEMENT_RAISE_LAND_END) {
        SetFontColors(COLOR2);
        // mprintf( 0, LINE_HEIGHT * 9, L"Merc: %d",  gpWorldLevelData[ usMapPos ].ubReservedSoldierID );
        SetFontColors(COLOR2);
        mprintf(150, LINE_HEIGHT * ubLine, "Raise Land End");
        ubLine++;
      }

      if (gubWorldRoomInfo[usMapPos] != NO_ROOM) {
        SetFontColors(COLOR2);
        mprintf(0, LINE_HEIGHT * ubLine, "Room Number");
        SetFontColors(COLOR2);
        mprintf(150, LINE_HEIGHT * ubLine, "%d", gubWorldRoomInfo[usMapPos]);
        ubLine++;
      }

      if (
        gpWorldLevelData[usMapPos].ubExtFlags[0] & MAPELEMENT_EXT_NOBURN_STRUCT
      ) {
        SetFontColors(COLOR2);
        mprintf(0, LINE_HEIGHT * ubLine, "Don't Use Burn Through For Soldier");
        ubLine++;
      }
    }
  }

  export function DebugSoldierPage3(): void {
    let pSoldier: SOLDIERTYPE;
    let usSoldierIndex: UINT16 = 0;
    let uiMercFlags: UINT32 = 0;
    let usMapPos: UINT16 = 0;
    let ubLine: UINT8;

    if (
      FindSoldierFromMouse(
        createPointer(
          () => usSoldierIndex,
          (v) => (usSoldierIndex = v),
        ),
        createPointer(
          () => uiMercFlags,
          (v) => (uiMercFlags = v),
        ),
      )
    ) {
      // Get Soldier
      pSoldier = <SOLDIERTYPE>GetSoldier(usSoldierIndex);

      SetFont(LARGEFONT1());
      gprintf(0, 0, "DEBUG SOLDIER PAGE THREE, GRIDNO %d", pSoldier.sGridNo);
      SetFont(LARGEFONT1());

      ubLine = 2;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "ID:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.ubID);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Action:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%s", gzActionStr[pSoldier.bAction]);
      if (pSoldier.uiStatusFlags & SOLDIER_ENEMY) {
        gprintf(
          350,
          LINE_HEIGHT * ubLine,
          "Alert %s",
          gzAlertStr[pSoldier.bAlertStatus],
        );
      }
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Action Data:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.usActionData);

      if (pSoldier.uiStatusFlags & SOLDIER_ENEMY) {
        gprintf(350, LINE_HEIGHT * ubLine, "AIMorale %d", pSoldier.bAIMorale);
      } else {
        gprintf(350, LINE_HEIGHT * ubLine, "Morale %d", pSoldier.bMorale);
      }
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Delayed Movement:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.fDelayedMovement);
      if (gubWatchedLocPoints[pSoldier.ubID][0] > 0) {
        gprintf(
          350,
          LINE_HEIGHT * ubLine,
          "Watch %d/%d for %d pts",
          gsWatchedLoc[pSoldier.ubID][0],
          gbWatchedLocLevel[pSoldier.ubID][0],
          gubWatchedLocPoints[pSoldier.ubID][0],
        );
      }

      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "ActionInProg:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bActionInProgress);
      ubLine++;
      if (gubWatchedLocPoints[pSoldier.ubID][1] > 0) {
        gprintf(
          350,
          LINE_HEIGHT * ubLine,
          "Watch %d/%d for %d pts",
          gsWatchedLoc[pSoldier.ubID][1],
          gbWatchedLocLevel[pSoldier.ubID][1],
          gubWatchedLocPoints[pSoldier.ubID][1],
        );
      }

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Last Action:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%s",
        gzActionStr[pSoldier.bLastAction],
      );
      ubLine++;

      if (gubWatchedLocPoints[pSoldier.ubID][2] > 0) {
        gprintf(
          350,
          LINE_HEIGHT * ubLine,
          "Watch %d/%d for %d pts",
          gsWatchedLoc[pSoldier.ubID][2],
          gbWatchedLocLevel[pSoldier.ubID][2],
          gubWatchedLocPoints[pSoldier.ubID][2],
        );
      }

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Animation:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%s",
        gAnimControl[pSoldier.usAnimState].zAnimStr,
      );
      ubLine++;

      /*
                    if ( gubWatchedLocPoints[ pSoldier->ubID ][ 3 ] > 0 )
                    {
                            gprintf( 350, LINE_HEIGHT * ubLine, L"Watch %d/%d for %d pts",
                                    gsWatchedLoc[ pSoldier->ubID ][ 3 ],
                                    gbWatchedLocLevel[ pSoldier->ubID ][ 3 ],
                                    gubWatchedLocPoints[ pSoldier->ubID ][ 3 ]
                                    );
                    }
    */

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Getting Hit:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.fGettingHit);

      if (pSoldier.ubCivilianGroup != 0) {
        gprintf(
          350,
          LINE_HEIGHT * ubLine,
          "Civ group %d",
          pSoldier.ubCivilianGroup,
        );
      }
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Suppress pts:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.ubSuppressionPoints);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Attacker ID:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.ubAttackerID);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "EndAINotCalled:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.fTurnInProgress);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "PrevAnimation:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%s",
        gAnimControl[pSoldier.usOldAniState].zAnimStr,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "PrevAniCode:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%d",
        gusAnimInst[pSoldier.usOldAniState][pSoldier.sOldAniCode],
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "GridNo:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.sGridNo);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "AniCode:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(
        150,
        LINE_HEIGHT * ubLine,
        "%d",
        gusAnimInst[pSoldier.usAnimState][pSoldier.usAniCode],
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "No APS To fin Move:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.fNoAPToFinishMove);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Reload Delay:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.sReloadDelay);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Reloading:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.fReloading);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Bullets out:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bBulletsLeft);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Anim non-int:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.fInNonintAnim);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "RT Anim non-int:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.fRTInNonintAnim);
      ubLine++;

      // OPIONION OF SELECTED MERC
      if (
        gusSelectedSoldier != NOBODY &&
        MercPtrs[gusSelectedSoldier].ubProfile < FIRST_NPC &&
        pSoldier.ubProfile != NO_PROFILE
      ) {
        SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
        gprintf(0, LINE_HEIGHT * ubLine, "NPC Opinion:");
        SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%d",
          gMercProfiles[pSoldier.ubProfile].bMercOpinion[
            MercPtrs[gusSelectedSoldier].ubProfile
          ],
        );
        ubLine++;
      }
    } else if (
      GetMouseMapPos(
        createPointer(
          () => usMapPos,
          (v) => (usMapPos = v),
        ),
      )
    ) {
      let pDoorStatus: DOOR_STATUS | null;
      let pStructure: STRUCTURE | null;

      SetFont(LARGEFONT1());
      gprintf(0, 0, "DEBUG LAND PAGE THREE");
      SetFont(LARGEFONT1());

      // OK, display door information here.....
      pDoorStatus = GetDoorStatus(usMapPos);

      ubLine = 1;

      if (pDoorStatus == null) {
        SetFontColors(COLOR1);
        mprintf(0, LINE_HEIGHT * ubLine, "No Door Status");
        ubLine++;
        ubLine++;
        ubLine++;
      } else {
        SetFontColors(COLOR1);
        mprintf(0, LINE_HEIGHT * ubLine, "Door Status Found:");
        SetFontColors(COLOR2);
        mprintf(150, LINE_HEIGHT * ubLine, " %d", usMapPos);
        ubLine++;

        SetFontColors(COLOR1);
        mprintf(0, LINE_HEIGHT * ubLine, "Actual Status:");
        SetFontColors(COLOR2);

        if (pDoorStatus.ubFlags & DOOR_OPEN) {
          mprintf(200, LINE_HEIGHT * ubLine, "OPEN");
        } else {
          mprintf(200, LINE_HEIGHT * ubLine, "CLOSED");
        }
        ubLine++;

        SetFontColors(COLOR1);
        mprintf(0, LINE_HEIGHT * ubLine, "Perceived Status:");
        SetFontColors(COLOR2);

        if (pDoorStatus.ubFlags & DOOR_PERCEIVED_NOTSET) {
          mprintf(200, LINE_HEIGHT * ubLine, "NOT SET");
        } else {
          if (pDoorStatus.ubFlags & DOOR_PERCEIVED_OPEN) {
            mprintf(200, LINE_HEIGHT * ubLine, "OPEN");
          } else {
            mprintf(200, LINE_HEIGHT * ubLine, "CLOSED");
          }
        }
        ubLine++;
      }

      // Find struct data and se what it says......
      pStructure = FindStructure(usMapPos, STRUCTURE_ANYDOOR);

      if (pStructure == null) {
        SetFontColors(COLOR1);
        mprintf(0, LINE_HEIGHT * ubLine, "No Door Struct Data");
        ubLine++;
      } else {
        SetFontColors(COLOR1);
        mprintf(0, LINE_HEIGHT * ubLine, "State:");
        SetFontColors(COLOR2);
        if (!(pStructure.fFlags & STRUCTURE_OPEN)) {
          mprintf(200, LINE_HEIGHT * ubLine, "CLOSED");
        } else {
          mprintf(200, LINE_HEIGHT * ubLine, "OPEN");
        }
        ubLine++;
      }
    }
  }

  function AppendAttachmentCode(
    usItem: UINT16,
    str: string /* Pointer<UINT16> */,
  ): string {
    switch (usItem) {
      case Enum225.SILENCER:
        str += " Sil";
        break;
      case Enum225.SNIPERSCOPE:
        str += " Scp";
        break;
      case Enum225.BIPOD:
        str += " Bip";
        break;
      case Enum225.LASERSCOPE:
        str += " Las";
        break;
    }
    return str;
  }

  function WriteQuantityAndAttachments(pObject: OBJECTTYPE, yp: INT32): void {
    let szAttach: string /* UINT16[30] */ = "";
    let fAttachments: boolean;
    // 100%  Qty: 2  Attach:
    // 100%  Qty: 2
    // 100%  Attach:
    // 100%
    if (!pObject.usItem) return;
    // Build attachment string
    fAttachments = false;
    if (
      pObject.usAttachItem[0] ||
      pObject.usAttachItem[1] ||
      pObject.usAttachItem[2] ||
      pObject.usAttachItem[3]
    ) {
      fAttachments = true;
      szAttach = "(";
      szAttach = AppendAttachmentCode(pObject.usAttachItem[0], szAttach);
      szAttach = AppendAttachmentCode(pObject.usAttachItem[1], szAttach);
      szAttach = AppendAttachmentCode(pObject.usAttachItem[2], szAttach);
      szAttach = AppendAttachmentCode(pObject.usAttachItem[3], szAttach);
      szAttach += " )";
    }

    if (Item[pObject.usItem].usItemClass == IC_AMMO) {
      // ammo
      if (pObject.ubNumberOfObjects > 1) {
        let str: string /* UINT16[50] */;
        let temp: string /* UINT16[5] */;
        let i: UINT8;
        str = swprintf(
          "Clips:  %d  (%d",
          pObject.ubNumberOfObjects,
          pObject.bStatus[0],
        );
        for (i = 1; i < pObject.ubNumberOfObjects; i++) {
          temp = swprintf(", %d", pObject.bStatus[0]);
          str += temp;
        }
        str += ")";
        gprintf(320, yp, str);
      } else gprintf(320, yp, "%d rounds", pObject.bStatus[0]);
      return;
    }
    if (pObject.ubNumberOfObjects > 1 && fAttachments) {
      // everything
      gprintf(
        320,
        yp,
        "%d%%  Qty:  %d  %s",
        pObject.bStatus[0],
        pObject.ubNumberOfObjects,
        szAttach,
      );
    } else if (pObject.ubNumberOfObjects > 1) {
      // condition and quantity
      gprintf(
        320,
        yp,
        "%d%%  Qty:  %d  ",
        pObject.bStatus[0],
        pObject.ubNumberOfObjects,
      );
    } else if (fAttachments) {
      // condition and attachments
      gprintf(320, yp, "%d%%  %s", pObject.bStatus[0], szAttach);
    } else {
      // condition
      gprintf(320, yp, "%d%%", pObject.bStatus[0]);
    }
  }

  export function DebugSoldierPage4(): void {
    let pSoldier: SOLDIERTYPE;
    let uiMercFlags: UINT32 = 0;
    let szOrders: string /* UINT16[20] */;
    let szAttitude: string /* UINT16[20] */;
    let usSoldierIndex: UINT16 = 0;
    let ubLine: UINT8;

    if (
      FindSoldierFromMouse(
        createPointer(
          () => usSoldierIndex,
          (v) => (usSoldierIndex = v),
        ),
        createPointer(
          () => uiMercFlags,
          (v) => (uiMercFlags = v),
        ),
      )
    ) {
      // Get Soldier
      pSoldier = <SOLDIERTYPE>GetSoldier(usSoldierIndex);

      SetFont(LARGEFONT1());
      gprintf(0, 0, "DEBUG SOLDIER PAGE FOUR, GRIDNO %d", pSoldier.sGridNo);
      SetFont(LARGEFONT1());
      ubLine = 2;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "Exp. Level:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.bExpLevel);
      switch (pSoldier.ubSoldierClass) {
        case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
          gprintf(320, LINE_HEIGHT * ubLine, "(Administrator)");
          break;
        case Enum262.SOLDIER_CLASS_ELITE:
          gprintf(320, LINE_HEIGHT * ubLine, "(Army Elite)");
          break;
        case Enum262.SOLDIER_CLASS_ARMY:
          gprintf(320, LINE_HEIGHT * ubLine, "(Army Troop)");
          break;
        case Enum262.SOLDIER_CLASS_CREATURE:
          gprintf(320, LINE_HEIGHT * ubLine, "(Creature)");
          break;
        case Enum262.SOLDIER_CLASS_GREEN_MILITIA:
          gprintf(320, LINE_HEIGHT * ubLine, "(Green Militia)");
          break;
        case Enum262.SOLDIER_CLASS_REG_MILITIA:
          gprintf(320, LINE_HEIGHT * ubLine, "(Reg Militia)");
          break;
        case Enum262.SOLDIER_CLASS_ELITE_MILITIA:
          gprintf(320, LINE_HEIGHT * ubLine, "(Elite Militia)");
          break;
        case Enum262.SOLDIER_CLASS_MINER:
          gprintf(320, LINE_HEIGHT * ubLine, "(Miner)");
          break;
        default:
          break; // don't care (don't write anything)
      }
      ubLine++;

      if (pSoldier.bTeam != OUR_TEAM) {
        let pNode: SOLDIERINITNODE | null;
        switch (pSoldier.bOrders) {
          case Enum241.STATIONARY:
            szOrders = "STATIONARY";
            break;
          case Enum241.ONGUARD:
            szOrders = "ON GUARD";
            break;
          case Enum241.ONCALL:
            szOrders = "ON CALL";
            break;
          case Enum241.SEEKENEMY:
            szOrders = "SEEK ENEMY";
            break;
          case Enum241.CLOSEPATROL:
            szOrders = "CLOSE PATROL";
            break;
          case Enum241.FARPATROL:
            szOrders = "FAR PATROL";
            break;
          case Enum241.POINTPATROL:
            szOrders = "POINT PATROL";
            break;
          case Enum241.RNDPTPATROL:
            szOrders = "RND PT PATROL";
            break;
          default:
            szOrders = "UNKNOWN";
            break;
        }
        switch (pSoldier.bAttitude) {
          case Enum242.DEFENSIVE:
            szAttitude = "DEFENSIVE";
            break;
          case Enum242.BRAVESOLO:
            szAttitude = "BRAVE SOLO";
            break;
          case Enum242.BRAVEAID:
            szAttitude = "BRAVE AID";
            break;
          case Enum242.AGGRESSIVE:
            szAttitude = "AGGRESSIVE";
            break;
          case Enum242.CUNNINGSOLO:
            szAttitude = "CUNNING SOLO";
            break;
          case Enum242.CUNNINGAID:
            szAttitude = "CUNNING AID";
            break;
          default:
            szAttitude = "UNKNOWN";
            break;
        }
        pNode = gSoldierInitHead;
        while (pNode) {
          if (pNode.pSoldier == pSoldier) break;
          pNode = pNode.next;
        }
        SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
        if (pNode) {
          gprintf(
            0,
            LINE_HEIGHT * ubLine,
            "%s, %s, REL EQUIP: %d, REL ATTR: %d",
            szOrders,
            szAttitude,
            pNode.pBasicPlacement.bRelativeEquipmentLevel,
            pNode.pBasicPlacement.bRelativeAttributeLevel,
          );
        } else {
          gprintf(0, LINE_HEIGHT * ubLine, "%s, %s", szOrders, szAttitude);
        }
        ubLine++;
      }

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "ID:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      gprintf(150, LINE_HEIGHT * ubLine, "%d", pSoldier.ubID);
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "HELMETPOS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.HELMETPOS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.HELMETPOS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.HELMETPOS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "VESTPOS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.VESTPOS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.VESTPOS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.VESTPOS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "LEGPOS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.LEGPOS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.LEGPOS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.LEGPOS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "HEAD1POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.HEAD1POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.HEAD1POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.HEAD1POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "HEAD2POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.HEAD2POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.HEAD2POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.HEAD2POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "HANDPOS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.HANDPOS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.HANDPOS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.HANDPOS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "SECONDHANDPOS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.SECONDHANDPOS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.SECONDHANDPOS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.SECONDHANDPOS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "BIGPOCK1POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.BIGPOCK1POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.BIGPOCK1POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.BIGPOCK1POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "BIGPOCK2POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.BIGPOCK2POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.BIGPOCK2POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.BIGPOCK2POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "BIGPOCK3POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.BIGPOCK3POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.BIGPOCK3POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.BIGPOCK3POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "BIGPOCK4POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.BIGPOCK4POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.BIGPOCK4POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.BIGPOCK4POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "SMALLPOCK1POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.SMALLPOCK1POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.SMALLPOCK1POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.SMALLPOCK1POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "SMALLPOCK2POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.SMALLPOCK2POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.SMALLPOCK2POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.SMALLPOCK2POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "SMALLPOCK3POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.SMALLPOCK3POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.SMALLPOCK3POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.SMALLPOCK3POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "SMALLPOCK4POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.SMALLPOCK4POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.SMALLPOCK4POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.SMALLPOCK4POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "SMALLPOCK5POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.SMALLPOCK5POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.SMALLPOCK5POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.SMALLPOCK5POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "SMALLPOCK6POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.SMALLPOCK6POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.SMALLPOCK6POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.SMALLPOCK6POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "SMALLPOCK7POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.SMALLPOCK7POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.SMALLPOCK7POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.SMALLPOCK7POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;

      SetFontShade(LARGEFONT1(), FONT_SHADE_GREEN);
      gprintf(0, LINE_HEIGHT * ubLine, "SMALLPOCK8POS:");
      SetFontShade(LARGEFONT1(), FONT_SHADE_NEUTRAL);
      if (pSoldier.inv[Enum261.SMALLPOCK8POS].usItem)
        gprintf(
          150,
          LINE_HEIGHT * ubLine,
          "%s",
          ShortItemNames[pSoldier.inv[Enum261.SMALLPOCK8POS].usItem],
        );
      WriteQuantityAndAttachments(
        pSoldier.inv[Enum261.SMALLPOCK8POS],
        LINE_HEIGHT * ubLine,
      );
      ubLine++;
    } else {
      SetFont(LARGEFONT1());
      gprintf(0, 0, "DEBUG LAND PAGE FOUR");
      SetFont(LARGEFONT1());
    }
  }

  //
  // Noise stuff
  //

  const MAX_MOVEMENT_NOISE = 9;

  export function MovementNoise(pSoldier: SOLDIERTYPE): UINT8 {
    let iStealthSkill: INT32;
    let iRoll: INT32;
    let ubMaxVolume: UINT8;
    let ubVolume: UINT8;
    let ubBandaged: UINT8;
    let ubEffLife: UINT8;
    let bInWater: boolean /* INT8 */ = false;

    if (pSoldier.bTeam == ENEMY_TEAM) {
      return MAX_MOVEMENT_NOISE - PreRandom(2);
    }

    iStealthSkill =
      20 +
      4 * EffectiveExpLevel(pSoldier) +
      Math.trunc((EffectiveDexterity(pSoldier) * 4) / 10); // 24-100

    // big bonus for those "extra stealthy" mercs
    if (pSoldier.ubBodyType == Enum194.BLOODCAT) {
      iStealthSkill += 50;
    } else if (HAS_SKILL_TRAIT(pSoldier, Enum269.STEALTHY)) {
      iStealthSkill += 25 * NUM_SKILL_TRAITS(pSoldier, Enum269.STEALTHY);
    }

    // NumMessage("Base Stealth = ",stealthSkill);

    ubBandaged = pSoldier.bLifeMax - pSoldier.bLife - pSoldier.bBleeding;
    ubEffLife = pSoldier.bLife + Math.trunc(ubBandaged / 2);

    // IF "SNEAKER'S" "EFFECTIVE LIFE" IS AT LESS THAN 50
    if (ubEffLife < 50) {
      // reduce effective stealth skill by up to 50% for low life
      iStealthSkill -= Math.trunc((iStealthSkill * (50 - ubEffLife)) / 100);
    }

    // if breath is below 50%
    if (pSoldier.bBreath < 50) {
      // reduce effective stealth skill by up to 50%
      iStealthSkill -= Math.trunc(
        (iStealthSkill * (50 - pSoldier.bBreath)) / 100,
      );
    }

    // if sneaker is moving through water
    if (Water(pSoldier.sGridNo)) {
      iStealthSkill -= 10; // 10% penalty
    } else if (DeepWater(pSoldier.sGridNo)) {
      iStealthSkill -= 20; // 20% penalty
    }

    if (pSoldier.bDrugEffect[DRUG_TYPE_ADRENALINE]) {
      // minus 3 percent per bonus AP from adrenaline
      iStealthSkill -= 3 * pSoldier.bDrugEffect[DRUG_TYPE_ADRENALINE];
    }

    /*
          // if sneaker is too eager and impatient to "do it right"
          if ((pSoldier->bTrait == OVER_ENTHUS) || (pSoldier->bAttitude == AGGRESSIVE))
          {
                  ubStealthSkill -= 10;	// 10% penalty
          }
  */
    // NumMessage("Modified Stealth = ",stealthSkill);

    iStealthSkill = Math.max(iStealthSkill, 0);

    if (!pSoldier.bStealthMode) {
      // REGULAR movement
      ubMaxVolume = MAX_MOVEMENT_NOISE - Math.trunc(iStealthSkill / 16); // 9 - (0 to 6) => 3 to 9

      if (bInWater) {
        ubMaxVolume++; // in water, can be even louder
      }
      switch (pSoldier.usAnimState) {
        case Enum193.CRAWLING:
          ubMaxVolume -= 2;
          break;
        case Enum193.SWATTING:
          ubMaxVolume -= 1;
          break;
        case Enum193.RUNNING:
          ubMaxVolume += 3;
          break;
      }

      if (ubMaxVolume < 2) {
        ubVolume = ubMaxVolume;
      } else {
        ubVolume = 1 + PreRandom(ubMaxVolume); // actual volume is 1 to max volume
      }
    } // in STEALTH mode
    else {
      iRoll = PreRandom(100); // roll them bones!

      if (iRoll >= iStealthSkill) {
        // v1.13 modification: give a second chance!
        iRoll = PreRandom(100);
      }

      if (iRoll < iStealthSkill) {
        ubVolume = 0; // made it, stayed quiet moving through this tile
      } // OOPS!
      else {
        ubVolume = 1 + Math.trunc((iRoll - iStealthSkill + 1) / 16); // volume is 1 - 7 ...
        switch (pSoldier.usAnimState) {
          case Enum193.CRAWLING:
            ubVolume -= 2;
            break;
          case Enum193.SWATTING:
            ubVolume -= 1;
            break;
          case Enum193.RUNNING:
            ubVolume += 3;
            break;
        }
        if (ubVolume < 1) {
          ubVolume = 0;
        }

        // randomize at which movement step the sneaking failure will happen
        //			Status.stepsTilNoise = Random(MAXMOVESTEPS);	// 0 - 6
      }
    }

    // NumMessage("Volume = ",volume);

    // save noise volume where stepped HandleSteppedLook can back get at it later
    //	Status.moveNoiseVolume = ubVolume;
    return ubVolume;
  }

  export function DoorOpeningNoise(pSoldier: SOLDIERTYPE): UINT8 {
    let sGridNo: INT16;
    let pDoorStatus: DOOR_STATUS | null;
    let ubDoorNoise: UINT8;

    // door being opened gridno is always the pending-action-data2 value
    sGridNo = pSoldier.sPendingActionData2;
    pDoorStatus = GetDoorStatus(sGridNo);

    if (pDoorStatus && pDoorStatus.ubFlags & DOOR_HAS_TIN_CAN) {
      // double noise possible!
      ubDoorNoise = DOOR_NOISE_VOLUME * 3;
    } else {
      ubDoorNoise = DOOR_NOISE_VOLUME;
    }
    if (MovementNoise(pSoldier)) {
      // failed any stealth checks
      return ubDoorNoise;
    } else {
      // succeeded in being stealthy!
      return 0;
    }
  }

  export function MakeNoise(
    ubNoiseMaker: UINT8,
    sGridNo: INT16,
    bLevel: INT8,
    ubTerrType: UINT8,
    ubVolume: UINT8,
    ubNoiseType: UINT8,
  ): void {
    let SNoise: EV_S_NOISE = createEvSNoise();

    SNoise.ubNoiseMaker = ubNoiseMaker;
    SNoise.sGridNo = sGridNo;
    SNoise.bLevel = bLevel;
    SNoise.ubTerrType = ubTerrType;
    SNoise.ubVolume = ubVolume;
    SNoise.ubNoiseType = ubNoiseType;

    if (gTacticalStatus.ubAttackBusyCount) {
      // delay these events until the attack is over!
      AddGameEvent(Enum319.S_NOISE, DEMAND_EVENT_DELAY, SNoise);
    } else {
      // AddGameEvent( S_NOISE, 0, &SNoise );

      // now call directly
      OurNoise(
        SNoise.ubNoiseMaker,
        SNoise.sGridNo,
        SNoise.bLevel,
        SNoise.ubTerrType,
        SNoise.ubVolume,
        SNoise.ubNoiseType,
      );
    }

    /*
          INT8 bWeControlNoise = FALSE;

          if (ubNoiseMode == UNEXPECTED)
          {
                  bWeControlNoise = TRUE;
          }
          else	// EXPECTED noise
          {
                  if (ubNoiseMaker < NOBODY)
                  {
                          if (Menptr[ubNoiseMaker].controller == Net.pnum)
                          {
                                  bWeControlNoise = TRUE;
                          }
                  }
                  else
                  {
                          // expected noise by NOBODY is sent by LEADER, received by others
                          if (Net.pnum == LEADER)
                          {
                                  bWeControlNoise = TRUE;
                          }
                  }
          }

          if (bWeControlNoise)
          {
                  OurNoise(ubNoiseMaker,sGridNo,ubTerrType,ubVolume,ubNoiseType,ubNoiseMode);
          }
          else
          {
                  // can't be UNEXPECTED, check if it's a SEND or NO_SEND
                  if (ubNoiseMode == EXPECTED_NOSEND)
                  {
                          // no NET_NOISE message is required, trigger TheirNoise() right here
                          TheirNoise(ubNoiseMaker,sGridNo,ubTerrType,ubVolume,ubNoiseType,ubNoiseMode);
                  }
                  else
                  {

                          // EXPECTED_SEND, TheirNoise() will be triggered by the arrival of the
                          // NET_NOISE message, not by us.  Wait here until that's all done...

                          // wait for the NET_NOISE to arrive (it will set noiseReceived flag)
                          //stopAction = TRUE;		// prevent real-time events from passing us by
                          MarkTime(&LoopTime);
                          while (Status.noiseReceived != ubNoiseType)
                          {
                                  LoopTimePast = Elapsed(&LoopTime);
                                  if (LoopTimePast > 50 && LoopTimePast < 2000)
                                  {
                                          KeepInterfaceGoing(19); // xxx yyy zzz experimental Aug 16/96 9:15 pm
                                  }
                                  else
                                  {
                                          KeyHitReport("MakeNoise: Waiting for NET_NOISE, need ubNoiseType ",ubNoiseType);
                                  }
                                  CheckForNetIncoming();
                          };
                          //stopAction = FALSE;	// re-enable real-time events

                          // turn off the oppChk flag again
                          Status.noiseReceived = -1;

                  }
          }
  */
  }

  export function OurNoise(
    ubNoiseMaker: UINT8,
    sGridNo: INT16,
    bLevel: INT8,
    ubTerrType: UINT8,
    ubVolume: UINT8,
    ubNoiseType: UINT8,
  ): void {
    let bSendNoise: boolean /* INT8 */ = false;
    let pSoldier: SOLDIERTYPE;

    // see if anyone actually hears this noise, sees ubNoiseMaker, etc.
    ProcessNoise(
      ubNoiseMaker,
      sGridNo,
      bLevel,
      ubTerrType,
      ubVolume,
      ubNoiseType,
    );

    if (
      gTacticalStatus.uiFlags & TURNBASED &&
      gTacticalStatus.uiFlags & INCOMBAT &&
      ubNoiseMaker < NOBODY &&
      !gfDelayResolvingBestSightingDueToDoor
    ) {
      pSoldier = MercPtrs[ubNoiseMaker];

      // interrupts are possible, resolve them now (we're in control here)
      // (you can't interrupt NOBODY, even if you hear the noise)

      ResolveInterruptsVs(pSoldier, NOISEINTERRUPT);
    }
  }

  function TheirNoise(
    ubNoiseMaker: UINT8,
    sGridNo: INT16,
    bLevel: INT8,
    ubTerrType: UINT8,
    ubVolume: UINT8,
    ubNoiseType: UINT8,
  ): void {
    //	SOLDIERTYPE *pSoldier;

    // see if anyone actually hears this noise, sees noiseMaker, etc.
    ProcessNoise(
      ubNoiseMaker,
      sGridNo,
      bLevel,
      ubTerrType,
      ubVolume,
      ubNoiseType,
    );

    // if noiseMaker is SOMEBODY
    if (ubNoiseMaker < NOBODY) {
      /*
    pSoldier = MercPtrs[ubNoiseMaker];

    //stopAction = TRUE;		// prevent real-time events from passing us by
    MarkTime(&LoopTime);
    do
    {
            LoopTimePast = Elapsed(&LoopTime);
            if (LoopTimePast > 50 && LoopTimePast < 2000)
            {
                    KeepInterfaceGoing(20); // xxx yyy zzz experimental Aug 16/96 9:15 pm
            }
            else
            {
                    // the gridno is added to end of the string by KeyHitReport itself...
                    sprintf(tempstr,"TheirNoise: Waiting for NOISE_INT_DONE for guynum %d, ubNoiseType %d(%s), sGridNo ",
                            pSoldier->guynum,ubNoiseType,NoiseTypeStr[ubNoiseType]);
                    KeyHitReport(tempstr,sGridNo);
            }

            CheckForNetIncoming();
    } while ((ExtMen[pSoldier->guynum].noiseRcvdGridno[ubNoiseType] != sGridNo) && pSoldier->in_sector);
    //stopAction = FALSE;	// re-enable real-time events

    // reset the gridno flag for next time
    ExtMen[pSoldier->guynum].noiseRcvdGridno[ubNoiseType] = NOWHERE;
    */
    }
    // else if noiseMaker's NOBODY, no opplist changes or interrupts are possible
  }

  function ProcessNoise(
    ubNoiseMaker: UINT8,
    sGridNo: INT16,
    bLevel: INT8,
    ubTerrType: UINT8,
    ubBaseVolume: UINT8,
    ubNoiseType: UINT8,
  ): void {
    let pSoldier: SOLDIERTYPE;
    let bLoop: UINT8;
    let bTeam: UINT8;
    let ubLoudestEffVolume: UINT8;
    let ubEffVolume: UINT8;
    //	UINT8 ubPlayVolume;
    let bCheckTerrain: boolean /* INT8 */ = false;
    let ubSourceTerrType: UINT8;
    let ubSource: UINT8;
    let bTellPlayer: boolean /* INT8 */ = false;
    let bHeard: boolean /* INT8 */;
    let bSeen: boolean /* INT8 */;
    let ubHeardLoudestBy: UINT8;
    let ubNoiseDir: UINT8 = <UINT8>(<unknown>undefined);
    let ubLoudestNoiseDir: UINT8 = <UINT8>(<unknown>undefined);

    // if the base volume itself was negligible
    if (!ubBaseVolume) return;

    // EXPLOSIONs are special, because they COULD be caused by a merc who is
    // no longer alive (but he placed the bomb or flaky grenade in the past).
    // Later noiseMaker gets whacked to NOBODY anyway, so that's OK.  So a
    // dead noiseMaker is only used here to decide WHICH soldiers HearNoise().

    // if noise is made by a person, AND it's not noise from an explosion
    if (ubNoiseMaker < NOBODY && ubNoiseType != Enum236.NOISE_EXPLOSION) {
      // inactive/not in sector/dead soldiers, shouldn't be making noise!
      if (
        !Menptr[ubNoiseMaker].bActive ||
        !Menptr[ubNoiseMaker].bInSector ||
        Menptr[ubNoiseMaker].uiStatusFlags & SOLDIER_DEAD
      ) {
        return;
      }

      // if he's out of life, and this isn't just his "dying scream" which is OK
      if (!Menptr[ubNoiseMaker].bLife && ubNoiseType != Enum236.NOISE_SCREAM) {
        return;
      }
    }

    // DETERMINE THE TERRAIN TYPE OF THE GRIDNO WHERE NOISE IS COMING FROM

    ubSourceTerrType = gpWorldLevelData[sGridNo].ubTerrainID;
    /*
          // start with the terrain type passed in to us
          ubSourceTerrType = ubTerrType;

          // if this isn't enough to get a valid terrain type
          if ((ubSourceTerrType < GROUNDTYPE) || (ubSourceTerrType > OCEANTYPE))
          {
                  // use the source gridno of the noise itself
                  ubSourceTerrType = TTypeList[Terrain(sGridNo)];
          }
          */

    // if we have now somehow obtained a valid terrain type
    if (
      ubSourceTerrType >= Enum315.FLAT_GROUND ||
      ubSourceTerrType <= Enum315.DEEP_WATER
    ) {
      // NumMessage("Source Terrain Type = ",ubSourceTerrType);
      bCheckTerrain = true;
    }
    // else give up trying to get terrain type, just assume sound isn't muffled

    // DETERMINE THE *PERCEIVED* SOURCE OF THE NOISE
    switch (ubNoiseType) {
      // for noise generated by an OBJECT shot/thrown/dropped by the noiseMaker
      case Enum236.NOISE_ROCK_IMPACT:
        gsWhoThrewRock = ubNoiseMaker;
      // fall through here!!!
      case Enum236.NOISE_BULLET_IMPACT:
      case Enum236.NOISE_GRENADE_IMPACT:
      case Enum236.NOISE_EXPLOSION:
        // the source of the noise is not at all obvious, so hide it from
        // the listener and maintain noiseMaker's cover by making source NOBODY
        ubSource = NOBODY;
        break;

      default:
        // normal situation: the noiseMaker is obviously the source of the noise
        ubSource = ubNoiseMaker;
        break;
    }

    // LOOP THROUGH EACH TEAM
    for (bTeam = 0; bTeam < MAXTEAMS; bTeam++) {
      // skip any inactive teams
      if (!gTacticalStatus.Team[bTeam].bTeamActive) {
        continue;
      }

      // if a the noise maker is a person, not just NOBODY
      if (ubNoiseMaker < NOBODY) {
        // if this team is the same TEAM as the noise maker's
        // (for now, assume we will report noises by unknown source on same SIDE)
        // OR, if the noise maker is currently in sight to this HUMAN team

        // CJC: changed to if the side is the same side as the noise maker's!
        // CJC: changed back!

        if (bTeam == Menptr[ubNoiseMaker].bTeam) {
          continue;
        }

        if (gTacticalStatus.Team[bTeam].bHuman) {
          if (gbPublicOpplist[bTeam][ubNoiseMaker] == SEEN_CURRENTLY) {
            continue;
          }
        }
      }

      // if this is our team
      if (true) {
        // if (bTeam == Net.pnum)
        // tell player about noise if enemies are present
        bTellPlayer =
          gTacticalStatus.fEnemyInSector &&
          (!(gTacticalStatus.uiFlags & INCOMBAT) ||
            Boolean(gTacticalStatus.ubCurrentTeam));

        switch (ubNoiseType) {
          case Enum236.NOISE_GUNFIRE:
          case Enum236.NOISE_BULLET_IMPACT:
          case Enum236.NOISE_ROCK_IMPACT:
          case Enum236.NOISE_GRENADE_IMPACT:
            // It's noise caused by a projectile.  If the projectile was seen by
            // the local player while in flight (PublicBullet), then don't bother
            // giving him a message about the noise it made, he's obviously aware.
            if (1 /*PublicBullet*/) {
              bTellPlayer = false;
            }

            break;

          case Enum236.NOISE_EXPLOSION:
            // if center of explosion is in visual range of team, don't report
            // noise, because the player is already watching the thing go BOOM!
            if (TeamMemberNear(bTeam, sGridNo, STRAIGHT)) {
              bTellPlayer = false;
            }
            break;

          case Enum236.NOISE_SILENT_ALARM:
            bTellPlayer = false;
            break;
        }

        // if noise was made by a person
        if (ubNoiseMaker < NOBODY) {
          // if noisemaker has been *PUBLICLY* SEEN OR HEARD during THIS TURN
          if (
            gbPublicOpplist[bTeam][ubNoiseMaker] == SEEN_CURRENTLY || // seen now
            gbPublicOpplist[bTeam][ubNoiseMaker] == SEEN_THIS_TURN || // seen this turn
            gbPublicOpplist[bTeam][ubNoiseMaker] == HEARD_THIS_TURN
          ) {
            // heard this turn
            // then don't bother reporting any noise made by him to the player
            bTellPlayer = false;
          }
          /*
        else if ( (Menptr[ubNoiseMaker].bVisible == TRUE) && (bTeam == gbPlayerNum) )
        {
                ScreenMsg( MSG_FONT_YELLOW, MSG_TESTVERSION, L"Handling noise from person not currently seen in player's public opplist" );
        }
        */

          if (MercPtrs[ubNoiseMaker].bLife == 0) {
            // this guy is dead (just dying) so don't report to player
            bTellPlayer = false;
          }
        }
      }

      // refresh flags for this new team
      bHeard = false;
      bSeen = false;
      ubLoudestEffVolume = 0;
      ubHeardLoudestBy = NOBODY;

      // All mercs on this team check if they are eligible to hear this noise
      for (
        bLoop = gTacticalStatus.Team[bTeam].bFirstID, pSoldier = Menptr[bLoop];
        bLoop <= gTacticalStatus.Team[bTeam].bLastID;
        bLoop++, pSoldier = Menptr[bLoop]
      ) {
        // if this "listener" is inactive, or in no condition to care
        if (
          !pSoldier.bActive ||
          !pSoldier.bInSector ||
          pSoldier.uiStatusFlags & SOLDIER_DEAD ||
          pSoldier.bLife < OKLIFE ||
          pSoldier.ubBodyType == Enum194.LARVAE_MONSTER
        ) {
          continue; // skip him!
        }

        if (
          pSoldier.uiStatusFlags & SOLDIER_VEHICLE &&
          pSoldier.bTeam == OUR_TEAM
        ) {
          continue; // skip
        }

        if (
          bTeam == gbPlayerNum &&
          pSoldier.bAssignment == Enum117.ASSIGNMENT_POW
        ) {
          // POWs should not be processed for noise
          continue;
        }

        // if a the noise maker is a person, not just NOBODY
        if (ubNoiseMaker < NOBODY) {
          // if this listener can see this noise maker
          if (pSoldier.bOppList[ubNoiseMaker] == SEEN_CURRENTLY) {
            // civilians care about gunshots even if they come from someone they can see
            if (!(pSoldier.bNeutral && ubNoiseType == Enum236.NOISE_GUNFIRE)) {
              continue; // then who cares whether he can also hear the guy?
            }
          }

          // screen out allied militia from hearing us
          switch (MercPtrs[ubNoiseMaker].bTeam) {
            case OUR_TEAM:
              // if the listener is militia and still on our side, ignore noise from us
              if (pSoldier.bTeam == MILITIA_TEAM && pSoldier.bSide == 0) {
                continue;
              }
              break;
            case ENEMY_TEAM:
              switch (pSoldier.ubProfile) {
                case Enum268.WARDEN:
                case Enum268.GENERAL:
                case Enum268.SERGEANT:
                case Enum268.CONRAD:
                  // ignore soldier team
                  continue;
                default:
                  break;
              }
              break;
            case MILITIA_TEAM:
              // if the noisemaker is militia and still on our side, ignore noise if we're listening
              if (
                pSoldier.bTeam == OUR_TEAM &&
                MercPtrs[ubNoiseMaker].bSide == 0
              ) {
                continue;
              }
              break;
          }

          if (gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_N) {
            // in the bloodcat arena sector, skip noises between army & bloodcats
            if (
              pSoldier.bTeam == ENEMY_TEAM &&
              MercPtrs[ubNoiseMaker].bTeam == CREATURE_TEAM
            ) {
              continue;
            }
            if (
              pSoldier.bTeam == CREATURE_TEAM &&
              MercPtrs[ubNoiseMaker].bTeam == ENEMY_TEAM
            ) {
              continue;
            }
          }
        } else {
          // screen out allied militia from hearing us
          if (
            ubNoiseMaker == NOBODY &&
            pSoldier.bTeam == MILITIA_TEAM &&
            pSoldier.bSide == 0
          ) {
            continue;
          }
        }

        if (
          pSoldier.bTeam == CIV_TEAM &&
          (ubNoiseType == Enum236.NOISE_GUNFIRE ||
            ubNoiseType == Enum236.NOISE_EXPLOSION)
        ) {
          pSoldier.ubMiscSoldierFlags |= SOLDIER_MISC_HEARD_GUNSHOT;
        }

        // Can the listener hear noise of that volume given his circumstances?
        ubEffVolume = CalcEffVolume(
          pSoldier,
          sGridNo,
          bLevel,
          ubNoiseType,
          ubBaseVolume,
          bCheckTerrain,
          pSoldier.bOverTerrainType,
          ubSourceTerrType,
        );

        if (ubEffVolume > 0) {
          // ALL RIGHT!  Passed all the tests, this listener hears this noise!!!
          bSeen = HearNoise(
            pSoldier,
            ubSource,
            sGridNo,
            bLevel,
            ubEffVolume,
            ubNoiseType,
            bSeen,
          );

          bHeard = true;

          ubNoiseDir = atan8(
            CenterX(pSoldier.sGridNo),
            CenterY(pSoldier.sGridNo),
            CenterX(sGridNo),
            CenterY(sGridNo),
          );

          // check the 'noise heard & reported' bit for that soldier & direction
          if (
            ubNoiseType != Enum236.NOISE_MOVEMENT ||
            bTeam != OUR_TEAM ||
            pSoldier.bInterruptDuelPts != NO_INTERRUPT ||
            !(pSoldier.ubMovementNoiseHeard & (1 << ubNoiseDir))
          ) {
            if (ubEffVolume > ubLoudestEffVolume) {
              ubLoudestEffVolume = ubEffVolume;
              ubHeardLoudestBy = pSoldier.ubID;
              ubLoudestNoiseDir = ubNoiseDir;
            }
          }
        } else {
          // NameMessage(pSoldier," can't hear this noise",2500);
          ubEffVolume = 0;
        }
      }

      // if the noise was heard at all
      if (bHeard) {
        // and we're doing our team
        if (bTeam == OUR_TEAM) {
          /*
      if (team == Net.pnum)
      */
          // if we are to tell the player about this type of noise
          if (bTellPlayer && ubHeardLoudestBy != NOBODY) {
            // the merc that heard it the LOUDEST is the one to comment
            // should add level to this function call
            TellPlayerAboutNoise(
              MercPtrs[ubHeardLoudestBy],
              ubNoiseMaker,
              sGridNo,
              bLevel,
              ubLoudestEffVolume,
              ubNoiseType,
              ubLoudestNoiseDir,
            );

            if (ubNoiseType == Enum236.NOISE_MOVEMENT) {
              MercPtrs[ubHeardLoudestBy].ubMovementNoiseHeard |=
                1 << ubNoiseDir;
            }
          }
          // if ( !(pSoldier->ubMovementNoiseHeard & (1 << ubNoiseDir) ) )
        }
      }

      // if the listening team is human-controlled AND
      // the noise's source is another soldier
      // (computer-controlled teams don't radio or automatically report NOISE)
      if (gTacticalStatus.Team[bTeam].bHuman && ubSource < NOBODY) {
        // if ubNoiseMaker was seen by at least one member of this team
        if (bSeen) {
          // if this human team is OURS
          if (1 /* bTeam == Net.pnum */) {
            // this team is now allowed to report sightings and set Public flags
            OurTeamRadiosRandomlyAbout(ubSource);
          } // noise was heard by another human-controlled team (not ours)
          else {
            // mark noise maker as being seen currently
            // UpdatePublic(bTeam,ubSource,SEEN_CURRENTLY,sGridNo,NOUPDATE,ACTUAL);
            UpdatePublic(bTeam, ubSource, SEEN_CURRENTLY, sGridNo, bLevel);
          }
        } // not seen
        else {
          if (bHeard) {
            // mark noise maker as having been PUBLICLY heard THIS TURN
            // UpdatePublic(team,ubSource,HEARD_THIS_TURN,sGridNo,NOUPDATE,ACTUAL);
            UpdatePublic(bTeam, ubSource, HEARD_THIS_TURN, sGridNo, bLevel);
          }
        }
      }
    }

    gsWhoThrewRock = NOBODY;
  }

  function CalcEffVolume(
    pSoldier: SOLDIERTYPE,
    sGridNo: INT16,
    bLevel: INT8,
    ubNoiseType: UINT8,
    ubBaseVolume: UINT8,
    bCheckTerrain: boolean /* UINT8 */,
    ubTerrType1: UINT8,
    ubTerrType2: UINT8,
  ): UINT8 {
    let iEffVolume: INT32;
    let iDistance: INT32;

    if (
      pSoldier.inv[Enum261.HEAD1POS].usItem == Enum225.WALKMAN ||
      pSoldier.inv[Enum261.HEAD2POS].usItem == Enum225.WALKMAN
    ) {
      return 0;
    }

    if (gTacticalStatus.uiFlags & INCOMBAT) {
      // ATE: Funny things happen to ABC stuff if bNewSituation set....
      if (gTacticalStatus.ubCurrentTeam == pSoldier.bTeam) {
        return 0;
      }
    }

    // sprintf(tempstr,"CalcEffVolume BY %s for gridno %d, baseVolume = %d",pSoldier->name,gridno,baseVolume);
    // PopMessage(tempstr);

    // adjust default noise volume by listener's hearing capability
    iEffVolume = ubBaseVolume + DecideHearing(pSoldier);

    // effective volume reduced by listener's number of opponents in sight
    iEffVolume -= pSoldier.bOppCnt;

    // calculate the distance (in adjusted pixels) between the source of the
    // noise (gridno) and the location of the would-be listener (pSoldier->gridno)
    iDistance = PythSpacesAway(pSoldier.sGridNo, sGridNo);
    /*
  distance = AdjPixelsAway(pSoldier->x,pSoldier->y,CenterX(sGridNo),CenterY(sGridNo));

         distance /= 15;      // divide by 15 to convert from adj. pixels to tiles
         */
    // NumMessage("Distance = ",distance);

    // effective volume fades over distance beyond 1 tile away
    iEffVolume -= iDistance - 1;

    /*
  if (pSoldier->bTeam == CIV_TEAM && pSoldier->ubBodyType != CROW )
  {
          if (pSoldier->ubCivilianGroup == 0 && pSoldier->ubProfile == NO_PROFILE)
          {
                  // nameless civs reduce effective volume by 2 for gunshots etc
                  // (double the reduction due to distance)
                  // so that they don't cower from attacks that are really far away
                  switch (ubNoiseType)
                  {
                          case NOISE_GUNFIRE:
                          case NOISE_BULLET_IMPACT:
                          case NOISE_GRENADE_IMPACT:
                          case NOISE_EXPLOSION:
                                  iEffVolume -= iDistance;
                                  break;
                          default:
                                  break;
                  }
          }
          else if (pSoldier->bNeutral)
          {
                  // NPCs and people in groups ignore attack noises unless they are no longer neutral
                  switch (ubNoiseType)
                  {
                          case NOISE_GUNFIRE:
                          case NOISE_BULLET_IMPACT:
                          case NOISE_GRENADE_IMPACT:
                          case NOISE_EXPLOSION:
                                  iEffVolume = 0;
                                  break;
                          default:
                                  break;
                  }
          }
  }
  */

    if (pSoldier.usAnimState == Enum193.RUNNING) {
      iEffVolume -= 5;
    }

    if (pSoldier.bAssignment == Enum193.SLEEPING) {
      // decrease effective volume since we're asleep!
      iEffVolume -= 5;
    }

    // check for floor/roof difference
    if (bLevel > pSoldier.bLevel) {
      // sound is amplified by roof
      iEffVolume += 5;
    } else if (bLevel < pSoldier.bLevel) {
      // sound is muffled
      iEffVolume -= 5;
    }

    // if we still have a chance of hearing this, and the terrain types are known
    if (iEffVolume > 0) {
      if (bCheckTerrain) {
        // if, between noise and listener, one is outside and one is inside

        // NOTE: This is a pretty dumb way of doing things, since it won't detect
        // the presence of walls between 2 spots both inside or both outside, but
        // given our current system it's the best that we can do

        if (
          (ubTerrType1 == Enum315.FLAT_FLOOR &&
            ubTerrType2 != Enum315.FLAT_FLOOR) ||
          (ubTerrType1 != Enum315.FLAT_FLOOR &&
            ubTerrType2 == Enum315.FLAT_FLOOR)
        ) {
          // PopMessage("Sound is muffled by wall(s)");

          // sound is muffled, reduce the effective volume of the noise
          iEffVolume -= 5;
        }
      }
    }

    // NumMessage("effVolume = ",ubEffVolume);
    if (iEffVolume > 0) {
      return iEffVolume;
    } else {
      return 0;
    }
  }

  function HearNoise(
    pSoldier: SOLDIERTYPE,
    ubNoiseMaker: UINT8,
    sGridNo: UINT16,
    bLevel: INT8,
    ubVolume: UINT8,
    ubNoiseType: UINT8,
    ubSeen: boolean,
  ): boolean {
    let sNoiseX: INT16;
    let sNoiseY: INT16;
    let bHadToTurn: boolean /* INT8 */ = false;
    let bSourceSeen: boolean /* INT8 */ = false;
    let bOldOpplist: INT8;
    let sDistVisible: INT16;
    let bDirection: INT8;
    let fMuzzleFlash: boolean = false;

    //	DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String( "%d hears noise from %d (%d/%d) volume %d", pSoldier->ubID, ubNoiseMaker, sGridNo, bLevel, ubVolume ) );

    if (pSoldier.ubBodyType == Enum194.CROW) {
      CrowsFlyAway(pSoldier.bTeam);
      return ubSeen;
    }

    // "Turn head" towards the source of the noise and try to see what's there

    // don't use DistanceVisible here, but use maximum visibility distance
    // in as straight line instead.  Represents guy "turning just his head"

    // CJC 97/10: CHANGE!  Since STRAIGHT can not reliably be used as a
    // max sighting distance (varies based on realtime/turnbased), call
    // the function with the new DIRECTION_IRRELEVANT define

    // is he close enough to see that gridno if he turns his head?

    // ignore muzzle flashes when turning head to see noise
    if (
      ubNoiseType == Enum236.NOISE_GUNFIRE &&
      ubNoiseMaker != NOBODY &&
      MercPtrs[ubNoiseMaker].fMuzzleFlash
    ) {
      sNoiseX = CenterX(sGridNo);
      sNoiseY = CenterY(sGridNo);
      bDirection = atan8(pSoldier.sX, pSoldier.sY, sNoiseX, sNoiseY);
      if (
        pSoldier.bDirection != bDirection &&
        pSoldier.bDirection != gOneCDirection[bDirection] &&
        pSoldier.bDirection != gOneCCDirection[bDirection]
      ) {
        // temporarily turn off muzzle flash so DistanceVisible can be calculated without it
        MercPtrs[ubNoiseMaker].fMuzzleFlash = false;
        fMuzzleFlash = true;
      }
    }

    sDistVisible = DistanceVisible(
      pSoldier,
      Enum245.DIRECTION_IRRELEVANT,
      Enum245.DIRECTION_IRRELEVANT,
      sGridNo,
      bLevel,
    );

    if (fMuzzleFlash) {
      // turn flash on again
      MercPtrs[ubNoiseMaker].fMuzzleFlash = true;
    }

    if (PythSpacesAway(pSoldier.sGridNo, sGridNo) <= sDistVisible) {
      // just use the XXadjustedXX center of the gridno
      sNoiseX = CenterX(sGridNo);
      sNoiseY = CenterY(sGridNo);

      if (
        pSoldier.bDirection != atan8(pSoldier.sX, pSoldier.sY, sNoiseX, sNoiseY)
      ) {
        bHadToTurn = true;
      } else {
        bHadToTurn = false;
      }

      // and we can trace a line of sight to his x,y coordinates?
      // (taking into account we are definitely aware of this guy now)

      // skip LOS check if we had to turn and we're a tank.  sorry Mr Tank, no looking out of the sides for you!
      if (!(bHadToTurn && TANK(pSoldier))) {
        if (
          SoldierTo3DLocationLineOfSightTest(
            pSoldier,
            sGridNo,
            bLevel,
            0,
            sDistVisible,
            true,
          )
        ) {
          // he can actually see the spot where the noise came from!
          bSourceSeen = true;

          // if this sounds like a door opening/closing (could also be a crate)
          if (ubNoiseType == Enum236.NOISE_CREAKING) {
            // then look around and update ALL doors that have secretly changed
            // LookForDoors(pSoldier,AWARE);
          }
        }
      }
    }

    // if noise is made by a person
    if (ubNoiseMaker < NOBODY) {
      bOldOpplist = pSoldier.bOppList[ubNoiseMaker];

      // WE ALREADY KNOW THAT HE'S ON ANOTHER TEAM, AND HE'S NOT BEING SEEN
      // ProcessNoise() ALREADY DID THAT WORK FOR US

      if (bSourceSeen) {
        ManSeesMan(
          pSoldier,
          MercPtrs[ubNoiseMaker],
          Menptr[ubNoiseMaker].sGridNo,
          Menptr[ubNoiseMaker].bLevel,
          HEARNOISE,
          CALLER_UNKNOWN,
        );

        // if it's an AI soldier, he is not allowed to automatically radio any
        // noise heard, but manSeesMan has set his newOppCnt, so clear it here
        if (!(pSoldier.uiStatusFlags & SOLDIER_PC)) {
          pSoldier.bNewOppCnt = 0;
        }

        ubSeen = true;
        // RadioSightings() must only be called later on by ProcessNoise() itself
        // because we want the soldier who heard noise the LOUDEST to report it

        if (pSoldier.bNeutral) {
          // could be a civilian watching us shoot at an enemy
          if (
            (ubNoiseType == Enum236.NOISE_GUNFIRE ||
              ubNoiseType == Enum236.NOISE_BULLET_IMPACT) &&
            ubVolume >= 3
          ) {
            // if status is only GREEN or YELLOW
            if (pSoldier.bAlertStatus < Enum243.STATUS_RED) {
              // then this soldier goes to status RED, has proof of enemy presence
              pSoldier.bAlertStatus = Enum243.STATUS_RED;
              CheckForChangingOrders(pSoldier);
            }
          }
        }
      } // noise maker still can't be seen
      else {
        SetNewSituation(pSoldier); // re-evaluate situation

        // if noise type was unmistakably that of gunfire
        if (
          (ubNoiseType == Enum236.NOISE_GUNFIRE ||
            ubNoiseType == Enum236.NOISE_BULLET_IMPACT) &&
          ubVolume >= 3
        ) {
          // if status is only GREEN or YELLOW
          if (pSoldier.bAlertStatus < Enum243.STATUS_RED) {
            // then this soldier goes to status RED, has proof of enemy presence
            pSoldier.bAlertStatus = Enum243.STATUS_RED;
            CheckForChangingOrders(pSoldier);
          }
        }

        // remember that the soldier has been heard and his new location
        UpdatePersonal(
          pSoldier,
          ubNoiseMaker,
          HEARD_THIS_TURN,
          sGridNo,
          bLevel,
        );

        // Public info is not set unless EVERYONE on the team fails to see the
        // ubnoisemaker, leaving the 'seen' flag FALSE.  See ProcessNoise().

        // CJC: set the noise gridno for the soldier, if appropriate - this is what is looked at by the AI!
        if (ubVolume >= pSoldier.ubNoiseVolume) {
          // yes it is, so remember this noise INSTEAD (old noise is forgotten)
          pSoldier.sNoiseGridno = sGridNo;
          pSoldier.bNoiseLevel = bLevel;

          // no matter how loud noise was, don't remember it for than 12 turns!
          if (ubVolume < MAX_MISC_NOISE_DURATION) {
            pSoldier.ubNoiseVolume = ubVolume;
          } else {
            pSoldier.ubNoiseVolume = MAX_MISC_NOISE_DURATION;
          }

          SetNewSituation(pSoldier); // force a fresh AI decision to be made
        }
      }

      if (pSoldier.fAIFlags & AI_ASLEEP) {
        switch (ubNoiseType) {
          case Enum236.NOISE_BULLET_IMPACT:
          case Enum236.NOISE_GUNFIRE:
          case Enum236.NOISE_EXPLOSION:
          case Enum236.NOISE_SCREAM:
          case Enum236.NOISE_WINDOW_SMASHING:
          case Enum236.NOISE_DOOR_SMASHING:
            // WAKE UP!
            pSoldier.fAIFlags &= ~AI_ASLEEP;
            break;
          default:
            break;
        }
      }

      // FIRST REQUIRE MUTUAL HOSTILES!
      if (
        !CONSIDERED_NEUTRAL(MercPtrs[ubNoiseMaker], pSoldier) &&
        !CONSIDERED_NEUTRAL(pSoldier, MercPtrs[ubNoiseMaker]) &&
        pSoldier.bSide != MercPtrs[ubNoiseMaker].bSide
      ) {
        // regardless of whether the noisemaker (who's not NOBODY) was seen or not,
        // as long as listener meets minimum interrupt conditions
        if (gfDelayResolvingBestSightingDueToDoor) {
          if (
            bSourceSeen &&
            (!(
              gTacticalStatus.uiFlags & TURNBASED &&
              gTacticalStatus.uiFlags & INCOMBAT
            ) ||
              (gubSightFlags & SIGHTINTERRUPT &&
                StandardInterruptConditionsMet(
                  pSoldier,
                  ubNoiseMaker,
                  bOldOpplist,
                )))
          ) {
            // we should be adding this to the array for the AllTeamLookForAll to handle
            // since this is a door opening noise, add a bonus equal to half the door volume
            let ubPoints: UINT8;

            ubPoints = CalcInterruptDuelPts(pSoldier, ubNoiseMaker, true);
            if (ubPoints != NO_INTERRUPT) {
              // require the enemy not to be dying if we are the sighter; in other words,
              // always add for AI guys, and always add for people with life >= OKLIFE
              if (
                pSoldier.bTeam != gbPlayerNum ||
                MercPtrs[ubNoiseMaker].bLife >= OKLIFE
              ) {
                ReevaluateBestSightingPosition(
                  pSoldier,
                  ubPoints + Math.trunc(ubVolume / 2),
                );
              }
            }
          }
        } else {
          if (
            gTacticalStatus.uiFlags & TURNBASED &&
            gTacticalStatus.uiFlags & INCOMBAT
          ) {
            if (
              StandardInterruptConditionsMet(
                pSoldier,
                ubNoiseMaker,
                bOldOpplist,
              )
            ) {
              // he gets a chance to interrupt the noisemaker
              pSoldier.bInterruptDuelPts = CalcInterruptDuelPts(
                pSoldier,
                ubNoiseMaker,
                true,
              );
              DebugMsg(
                TOPIC_JA2,
                DBG_LEVEL_3,
                FormatString(
                  "Calculating int duel pts in noise code, %d has %d points",
                  pSoldier.ubID,
                  pSoldier.bInterruptDuelPts,
                ),
              );
            } else {
              pSoldier.bInterruptDuelPts = NO_INTERRUPT;
            }
          } else if (bSourceSeen) {
            // seen source, in realtime, so check for sighting stuff
            HandleBestSightingPositionInRealtime();
          }
        }
      }
    } // noise made by NOBODY
    else {
      // if noise type was unmistakably that of an explosion (seen or not) or alarm
      if (!(pSoldier.uiStatusFlags & SOLDIER_PC)) {
        if (
          (ubNoiseType == Enum236.NOISE_EXPLOSION ||
            ubNoiseType == Enum236.NOISE_SILENT_ALARM) &&
          ubVolume >= 3
        ) {
          if (ubNoiseType == Enum236.NOISE_SILENT_ALARM) {
            WearGasMaskIfAvailable(pSoldier);
          }
          // if status is only GREEN or YELLOW
          if (pSoldier.bAlertStatus < Enum243.STATUS_RED) {
            // then this soldier goes to status RED, has proof of enemy presence
            pSoldier.bAlertStatus = Enum243.STATUS_RED;
            CheckForChangingOrders(pSoldier);
          }
        }
      }
      // if the source of the noise can't be seen,
      // OR if it's a rock and the listener had to turn so that by the time he
      // looked all his saw was a bunch of rocks lying still
      if (
        !bSourceSeen ||
        (ubNoiseType == Enum236.NOISE_ROCK_IMPACT && bHadToTurn) ||
        ubNoiseType == Enum236.NOISE_SILENT_ALARM
      ) {
        // check if the effective volume of this new noise is greater than or at
        // least equal to the volume of the currently noticed noise stored
        if (ubVolume >= pSoldier.ubNoiseVolume) {
          // yes it is, so remember this noise INSTEAD (old noise is forgotten)
          pSoldier.sNoiseGridno = sGridNo;
          pSoldier.bNoiseLevel = bLevel;

          // no matter how loud noise was, don't remember it for than 12 turns!
          if (ubVolume < MAX_MISC_NOISE_DURATION) {
            pSoldier.ubNoiseVolume = ubVolume;
          } else {
            pSoldier.ubNoiseVolume = MAX_MISC_NOISE_DURATION;
          }

          SetNewSituation(pSoldier); // force a fresh AI decision to be made
        }
      }
      // if listener sees the source of the noise, AND it's either a grenade,
      //  or it's a rock that he watched land (didn't need to turn)
      else {
        SetNewSituation(pSoldier); // re-evaluate situation

        // if status is only GREEN or YELLOW
        if (pSoldier.bAlertStatus < Enum243.STATUS_RED) {
          // then this soldier goes to status RED, has proof of enemy presence
          pSoldier.bAlertStatus = Enum243.STATUS_RED;
          CheckForChangingOrders(pSoldier);
        }
      }

      if (gubBestToMakeSightingSize == BEST_SIGHTING_ARRAY_SIZE_INCOMBAT) {
        // if the noise heard was the fall of a rock
        if (
          gTacticalStatus.uiFlags & TURNBASED &&
          gTacticalStatus.uiFlags & INCOMBAT &&
          ubNoiseType == Enum236.NOISE_ROCK_IMPACT
        ) {
          // give every ELIGIBLE listener an automatic interrupt, since it's
          // reasonable to assume the guy throwing wants to wait for their reaction!
          if (StandardInterruptConditionsMet(pSoldier, NOBODY, 0)) {
            pSoldier.bInterruptDuelPts = AUTOMATIC_INTERRUPT; // force automatic interrupt
            DebugMsg(
              TOPIC_JA2,
              DBG_LEVEL_3,
              FormatString(
                "Calculating int duel pts in noise code, %d has %d points",
                pSoldier.ubID,
                pSoldier.bInterruptDuelPts,
              ),
            );
          } else {
            pSoldier.bInterruptDuelPts = NO_INTERRUPT;
          }
        }
      }
    }

    return ubSeen;
  }

  function TellPlayerAboutNoise(
    pSoldier: SOLDIERTYPE,
    ubNoiseMaker: UINT8,
    sGridNo: INT16,
    bLevel: INT8,
    ubVolume: UINT8,
    ubNoiseType: UINT8,
    ubNoiseDir: UINT8,
  ): void {
    let ubVolumeIndex: UINT8;

    // CJC: tweaked the noise categories upwards a bit because our movement noises can be louder now.
    if (ubVolume < 4) {
      ubVolumeIndex = 0; // 1-3: faint noise
    } else if (ubVolume < 8) {
      // 4-7: definite noise
      ubVolumeIndex = 1;
    } else if (ubVolume < 12) {
      // 8-11: loud noise
      ubVolumeIndex = 2;
    } // 12+: very loud noise
    else {
      ubVolumeIndex = 3;
    }

    // display a message about a noise...
    // e.g. Sidney hears a loud splash from/to? the north.

    if (
      ubNoiseMaker != NOBODY &&
      pSoldier.bTeam == gbPlayerNum &&
      pSoldier.bTeam == Menptr[ubNoiseMaker].bTeam
    ) {
    }

    if (
      bLevel == pSoldier.bLevel ||
      ubNoiseType == Enum236.NOISE_EXPLOSION ||
      ubNoiseType == Enum236.NOISE_SCREAM ||
      ubNoiseType == Enum236.NOISE_ROCK_IMPACT ||
      ubNoiseType == Enum236.NOISE_GRENADE_IMPACT
    ) {
      ScreenMsg(
        MSG_FONT_YELLOW,
        MSG_INTERFACE,
        pNewNoiseStr[ubNoiseType],
        pSoldier.name,
        pNoiseVolStr[ubVolumeIndex],
        pDirectionStr[ubNoiseDir],
      );
    } else if (bLevel > pSoldier.bLevel) {
      // from above!
      ScreenMsg(
        MSG_FONT_YELLOW,
        MSG_INTERFACE,
        pNewNoiseStr[ubNoiseType],
        pSoldier.name,
        pNoiseVolStr[ubVolumeIndex],
        gzLateLocalizedString[6],
      );
    } else {
      // from below!
      ScreenMsg(
        MSG_FONT_YELLOW,
        MSG_INTERFACE,
        pNewNoiseStr[ubNoiseType],
        pSoldier.name,
        pNoiseVolStr[ubVolumeIndex],
        gzLateLocalizedString[7],
      );
    }

    // if the quote was faint, say something
    if (ubVolumeIndex == 0) {
      if (
        !AreInMeanwhile() &&
        !(gTacticalStatus.uiFlags & ENGAGED_IN_CONV) &&
        pSoldier.ubTurnsUntilCanSayHeardNoise == 0
      ) {
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_HEARD_SOMETHING);
        if (gTacticalStatus.uiFlags & INCOMBAT) {
          pSoldier.ubTurnsUntilCanSayHeardNoise = 2;
        } else {
          pSoldier.ubTurnsUntilCanSayHeardNoise = 5;
        }
      }
    }

    // flag soldier as having reported noise in a particular direction
  }

  export function VerifyAndDecayOpplist(pSoldier: SOLDIERTYPE): void {
    let uiLoop: UINT32;
    let pPersOL: INT8; // pointer into soldier's opponent list
    let pOpponent: SOLDIERTYPE;

    // reduce all seen/known opponent's turn counters by 1 (towards 0)
    // 1) verify accuracy of the opplist by testing sight vs known opponents
    // 2) increment opplist value if opponent is known but not currenly seen
    // 3) forget about known opponents who haven't been noticed in some time

    // if soldier is unconscious, make sure his opplist is wiped out & bail out
    if (pSoldier.bLife < OKLIFE) {
      pSoldier.bOppList.fill(NOT_HEARD_OR_SEEN);
      pSoldier.bOppCnt = 0;
      return;
    }

    // if any new opponents were seen earlier and not yet radioed
    if (pSoldier.bNewOppCnt) {
      if (pSoldier.uiStatusFlags & SOLDIER_PC) {
        RadioSightings(pSoldier, EVERYBODY, pSoldier.bTeam);
      }

      pSoldier.bNewOppCnt = 0;
    }

    // man looks for each of his opponents WHO ARE ALREADY KNOWN TO HIM
    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      pOpponent = MercSlots[uiLoop];

      // if this merc is active, here, and alive
      if (pOpponent != null && pOpponent.bLife) {
        // if this merc is on the same team, he's no opponent, so skip him
        if (pSoldier.bTeam == pOpponent.bTeam) {
          continue;
        }

        pPersOL = pSoldier.bOppList[pOpponent.ubID];

        // if this opponent is "known" in any way (seen or heard recently)
        if (pPersOL != NOT_HEARD_OR_SEEN) {
          // use both sides actual x,y co-ordinates (neither side's moving)
          ManLooksForMan(pSoldier, pOpponent, VERIFYANDDECAYOPPLIST);

          // decay opplist value if necessary
          pPersOL = DECAY_OPPLIST_VALUE(pPersOL);
          pSoldier.bOppList[pOpponent.ubID] = pPersOL;
          /*
// if opponent was SEEN recently but is NOT visible right now
if (*pPersOL >= SEEN_THIS_TURN)
{
(*pPersOL)++;          // increment #turns it's been since last seen

// if it's now been longer than the maximum we care to remember
if (*pPersOL > SEEN_2_TURNS_AGO)
*pPersOL = 0;        // forget that we knew this guy
}
else
{
// if opponent was merely HEARD recently, not actually seen
if (*pPersOL <= HEARD_THIS_TURN)
{
(*pPersOL)--;        // increment #turns it's been since last heard

// if it's now been longer than the maximum we care to remember
if (*pPersOL < HEARD_2_TURNS_AGO)
*pPersOL = 0;      // forget that we knew this guy
         }
               }
       */
        }
      }
    }

    // if any new opponents were seen
    if (pSoldier.bNewOppCnt) {
      // turns out this is NOT an error!  If this guy was gassed last time he
      // looked, his sight limit was 2 tiles, and now he may no longer be gassed
      // and thus he sees opponents much further away for the first time!
      // - Always happens if you STUNGRENADE an opponent by surprise...

      if (pSoldier.uiStatusFlags & SOLDIER_PC)
        RadioSightings(pSoldier, EVERYBODY, pSoldier.bTeam);

      pSoldier.bNewOppCnt = 0;
    }
  }

  export function DecayIndividualOpplist(pSoldier: SOLDIERTYPE): void {
    let uiLoop: UINT32;
    let pPersOL: INT8; // pointer into soldier's opponent list
    let pOpponent: SOLDIERTYPE;

    // reduce all currently seen opponent's turn counters by 1 (towards 0)

    // if soldier is unconscious, make sure his opplist is wiped out & bail out
    if (pSoldier.bLife < OKLIFE) {
      // must make sure that public opplist is kept to match...
      for (uiLoop = 0; uiLoop < TOTAL_SOLDIERS; uiLoop++) {
        if (pSoldier.bOppList[uiLoop] == SEEN_CURRENTLY) {
          HandleManNoLongerSeen(
            pSoldier,
            MercPtrs[uiLoop],
            createElementPointer(pSoldier.bOppList, uiLoop),
            createElementPointer(gbPublicOpplist[pSoldier.bTeam], uiLoop),
          );
        }
      }
      // void HandleManNoLongerSeen( SOLDIERTYPE * pSoldier, SOLDIERTYPE * pOpponent, INT8 * pPersOL, INT8 * pbPublOL )

      pSoldier.bOppList.fill(NOT_HEARD_OR_SEEN);
      pSoldier.bOppCnt = 0;
      return;
    }

    // man looks for each of his opponents WHO IS CURRENTLY SEEN
    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      pOpponent = MercSlots[uiLoop];

      // if this merc is active, here, and alive
      if (pOpponent != null && pOpponent.bLife) {
        // if this merc is on the same team, he's no opponent, so skip him
        if (pSoldier.bTeam == pOpponent.bTeam) {
          continue;
        }

        pPersOL = pSoldier.bOppList[pOpponent.ubID];

        // if this opponent is seen currently
        if (pPersOL == SEEN_CURRENTLY) {
          // they are NOT visible now!
          pPersOL++;
          pSoldier.bOppList[pOpponent.ubID] = pPersOL;
          if (
            !CONSIDERED_NEUTRAL(pOpponent, pSoldier) &&
            !CONSIDERED_NEUTRAL(pSoldier, pOpponent) &&
            pSoldier.bSide != pOpponent.bSide
          ) {
            RemoveOneOpponent(pSoldier);
          }
        }
      }
    }
  }

  export function VerifyPublicOpplistDueToDeath(pSoldier: SOLDIERTYPE): void {
    let uiLoop: UINT32;
    let uiTeamMateLoop: UINT32;
    let pPersOL: INT8;
    let pMatePersOL: INT8; // pointers into soldier's opponent list
    let pOpponent: SOLDIERTYPE;
    let pTeamMate: SOLDIERTYPE;
    let bOpponentStillSeen: boolean;

    // OK, someone died. Anyone that the deceased ALONE saw has to decay
    // immediately in the Public Opplist.

    // If deceased didn't see ANYONE, don't bother
    if (pSoldier.bOppCnt == 0) {
      return;
    }

    // Deceased looks for each of his opponents who is "seen currently"
    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      // first, initialize flag since this will be a "new" opponent
      bOpponentStillSeen = false;

      // grab a pointer to the "opponent"
      pOpponent = MercSlots[uiLoop];

      // if this opponent is active, here, and alive
      if (pOpponent != null && pOpponent.bLife) {
        // if this opponent is on the same team, he's no opponent, so skip him
        if (pSoldier.bTeam == pOpponent.bTeam) {
          continue;
        }

        // point to what the deceased's personal opplist value is
        pPersOL = pSoldier.bOppList[pOpponent.ubID];

        // if this opponent was CURRENTLY SEEN by the deceased (before his
        // untimely demise)
        if (pPersOL == SEEN_CURRENTLY) {
          // then we need to know if any teammates ALSO see this opponent, so loop through
          // trying to find ONE witness to the death...
          for (
            uiTeamMateLoop = 0;
            uiTeamMateLoop < guiNumMercSlots;
            uiTeamMateLoop++
          ) {
            // grab a pointer to the potential teammate
            pTeamMate = MercSlots[uiTeamMateLoop];

            // if this teammate is active, here, and alive
            if (pTeamMate != null && pTeamMate.bLife) {
              // if this opponent is NOT on the same team, then skip him
              if (pTeamMate.bTeam != pSoldier.bTeam) {
                continue;
              }

              // point to what the teammate's personal opplist value is
              pMatePersOL = pTeamMate.bOppList[pOpponent.ubID];

              // test to see if this value is "seen currently"
              if (pMatePersOL == SEEN_CURRENTLY) {
                // this opponent HAS been verified!
                bOpponentStillSeen = true;

                // we can stop looking for other witnesses now
                break;
              }
            }
          }
        }

        // if no witnesses for this opponent, then decay the Public Opplist
        if (!bOpponentStillSeen) {
          gbPublicOpplist[pSoldier.bTeam][pOpponent.ubID] = DECAY_OPPLIST_VALUE(
            gbPublicOpplist[pSoldier.bTeam][pOpponent.ubID],
          );
        }
      }
    }
  }

  export function DecayPublicOpplist(bTeam: INT8): void {
    let uiLoop: UINT32;
    let bNoPubliclyKnownOpponents: boolean /* INT8 */ = true;
    let pSoldier: SOLDIERTYPE;
    let pbPublOL: INT8;

    // NumMessage("Decay for team #",team);

    // decay the team's public noise volume, forget public noise gridno if <= 0
    // used to be -1 per turn but that's not fast enough!
    if (gubPublicNoiseVolume[bTeam] > 0) {
      if (gTacticalStatus.uiFlags & INCOMBAT) {
        gubPublicNoiseVolume[bTeam] = Math.trunc(
          (gubPublicNoiseVolume[bTeam] * 7) / 10,
        );
      } else {
        gubPublicNoiseVolume[bTeam] = Math.trunc(
          gubPublicNoiseVolume[bTeam] / 2,
        );
      }

      if (gubPublicNoiseVolume[bTeam] <= 0) {
        gsPublicNoiseGridno[bTeam] = NOWHERE;
      }
    }

    // decay the team's Public Opplist
    for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
      pSoldier = MercSlots[uiLoop];

      // for every active, living soldier on ANOTHER team
      if (pSoldier && pSoldier.bLife && pSoldier.bTeam != bTeam) {
        // hang a pointer to the byte holding team's public opplist for this merc
        pbPublOL = gbPublicOpplist[bTeam][pSoldier.ubID];

        if (pbPublOL == NOT_HEARD_OR_SEEN) {
          continue;
        }

        // well, that make this a "publicly known opponent", so nuke that flag
        bNoPubliclyKnownOpponents = false;

        // if this person has been SEEN recently, but is not currently visible
        if (pbPublOL >= SEEN_THIS_TURN) {
          pbPublOL++; // increment how long it's been
          gbPublicOpplist[bTeam][pSoldier.ubID] = pbPublOL;
        } else {
          // if this person has been only HEARD recently
          if (pbPublOL <= HEARD_THIS_TURN) {
            pbPublOL--; // increment how long it's been
            gbPublicOpplist[bTeam][pSoldier.ubID] = pbPublOL;
          }
        }

        // if it's been longer than the maximum we care to remember
        if (pbPublOL > OLDEST_SEEN_VALUE || pbPublOL < OLDEST_HEARD_VALUE) {
          // forget about him,
          // and also forget where he was last seen (it's been too long)
          // this is mainly so POINT_PATROL guys don't SEEK_OPPONENTs forever
          UpdatePublic(bTeam, pSoldier.ubID, NOT_HEARD_OR_SEEN, NOWHERE, 0);
        }
      }
    }

    // if all opponents are publicly unknown (NOT_HEARD_OR_SEEN)
    if (bNoPubliclyKnownOpponents) {
      // forget about the last radio alert (ie. throw away who made the call)
      // this is mainly so POINT_PATROL guys don't SEEK_FRIEND forever after
      gTacticalStatus.Team[bTeam].ubLastMercToRadio = NOBODY;
    }

    // decay watched locs as well
    DecayWatchedLocs(bTeam);
  }

  // bit of a misnomer; this is now decay all opplists
  export function NonCombatDecayPublicOpplist(uiTime: UINT32): void {
    let cnt: UINT32;

    if (
      uiTime - gTacticalStatus.uiTimeSinceLastOpplistDecay >=
      TIME_BETWEEN_RT_OPPLIST_DECAYS
    ) {
      // decay!
      for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
        if (MercSlots[cnt]) {
          VerifyAndDecayOpplist(MercSlots[cnt]);
        }
      }

      for (cnt = 0; cnt < MAXTEAMS; cnt++) {
        if (gTacticalStatus.Team[cnt].bMenInSector > 0) {
          // decay team's public opplist
          DecayPublicOpplist(cnt);
        }
      }
      // update time
      gTacticalStatus.uiTimeSinceLastOpplistDecay = uiTime;
    }
  }

  export function RecalculateOppCntsDueToNoLongerNeutral(
    pSoldier: SOLDIERTYPE,
  ): void {
    let uiLoop: UINT32;
    let pOpponent: SOLDIERTYPE;

    pSoldier.bOppCnt = 0;

    if (!pSoldier.bNeutral) {
      for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
        pOpponent = MercSlots[uiLoop];

        // for every active, living soldier on ANOTHER team
        if (
          pOpponent &&
          pOpponent.bLife &&
          !pOpponent.bNeutral &&
          pOpponent.bTeam != pSoldier.bTeam &&
          !CONSIDERED_NEUTRAL(pOpponent, pSoldier) &&
          !CONSIDERED_NEUTRAL(pSoldier, pOpponent) &&
          pSoldier.bSide != pOpponent.bSide
        ) {
          if (pSoldier.bOppList[pOpponent.ubID] == SEEN_CURRENTLY) {
            AddOneOpponent(pSoldier);
          }
          if (pOpponent.bOppList[pSoldier.ubID] == SEEN_CURRENTLY) {
            // have to add to opponent's oppcount as well since we just became non-neutral
            AddOneOpponent(pOpponent);
          }
        }
      }
    }
  }

  export function RecalculateOppCntsDueToBecomingNeutral(
    pSoldier: SOLDIERTYPE,
  ): void {
    let uiLoop: UINT32;
    let pOpponent: SOLDIERTYPE;

    if (pSoldier.bNeutral) {
      pSoldier.bOppCnt = 0;

      for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
        pOpponent = MercSlots[uiLoop];

        // for every active, living soldier on ANOTHER team
        if (
          pOpponent &&
          pOpponent.bLife &&
          !pOpponent.bNeutral &&
          pOpponent.bTeam != pSoldier.bTeam &&
          !CONSIDERED_NEUTRAL(pSoldier, pOpponent) &&
          pSoldier.bSide != pOpponent.bSide
        ) {
          if (pOpponent.bOppList[pSoldier.ubID] == SEEN_CURRENTLY) {
            // have to rem from opponent's oppcount as well since we just became neutral
            RemoveOneOpponent(pOpponent);
          }
        }
      }
    }
  }

  export function NoticeUnseenAttacker(
    pAttacker: SOLDIERTYPE,
    pDefender: SOLDIERTYPE,
    bReason: INT8,
  ): void {
    let bOldOppList: INT8;
    let ubTileSightLimit: UINT8;
    let fSeesAttacker: boolean = false;
    let bDirection: INT8;
    let fMuzzleFlash: boolean = false;

    if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
      return;
    }

    if (pAttacker.usAttackingWeapon == Enum225.DART_GUN) {
      // rarely noticed
      if (SkillCheck(pDefender, Enum255.NOTICE_DART_CHECK, 0) < 0) {
        return;
      }
    }

    // do we need to do checks for life/breath here?

    if (
      pDefender.ubBodyType == Enum194.LARVAE_MONSTER ||
      (pDefender.uiStatusFlags & SOLDIER_VEHICLE && pDefender.bTeam == OUR_TEAM)
    ) {
      return;
    }

    bOldOppList = pDefender.bOppList[pAttacker.ubID];
    if (
      PythSpacesAway(pAttacker.sGridNo, pDefender.sGridNo) <=
      MaxDistanceVisible()
    ) {
      // check LOS, considering we are now aware of the attacker
      // ignore muzzle flashes when must turning head
      if (pAttacker.fMuzzleFlash) {
        bDirection = atan8(
          pDefender.sX,
          pDefender.sY,
          pAttacker.sX,
          pAttacker.sY,
        );
        if (
          pDefender.bDirection != bDirection &&
          pDefender.bDirection != gOneCDirection[bDirection] &&
          pDefender.bDirection != gOneCCDirection[bDirection]
        ) {
          // temporarily turn off muzzle flash so DistanceVisible can be calculated without it
          pAttacker.fMuzzleFlash = false;
          fMuzzleFlash = true;
        }
      }

      ubTileSightLimit = DistanceVisible(
        pDefender,
        Enum245.DIRECTION_IRRELEVANT,
        0,
        pAttacker.sGridNo,
        pAttacker.bLevel,
      );
      if (
        SoldierToSoldierLineOfSightTest(
          pDefender,
          pAttacker,
          ubTileSightLimit,
          true,
        ) != 0
      ) {
        fSeesAttacker = true;
      }
      if (fMuzzleFlash) {
        pAttacker.fMuzzleFlash = true;
      }
    }

    if (fSeesAttacker) {
      ManSeesMan(
        pDefender,
        pAttacker,
        pAttacker.sGridNo,
        pAttacker.bLevel,
        NOTICEUNSEENATTACKER,
        CALLER_UNKNOWN,
      );

      // newOppCnt not needed here (no radioing), must get reset right away
      // CJC: Huh? well, leave it in for now
      pDefender.bNewOppCnt = 0;

      if (pDefender.bTeam == gbPlayerNum) {
        // EXPERIENCE GAIN (5): Victim notices/sees a previously UNSEEN attacker
        StatChange(pDefender, EXPERAMT, 5, FROM_SUCCESS);

        // mark attacker as being SEEN right now
        RadioSightings(pDefender, pAttacker.ubID, pDefender.bTeam);
      }
      // NOTE: ENEMIES DON'T REPORT A SIGHTING PUBLICLY UNTIL THEY RADIO IT IN!
      else {
        // go to threatening stance
        ReevaluateEnemyStance(pDefender, pDefender.usAnimState);
      }
    } // victim NOTICED the attack, but CAN'T SEE the actual attacker
    else {
      SetNewSituation(pDefender); // re-evaluate situation

      // if victim's alert status is only GREEN or YELLOW
      if (pDefender.bAlertStatus < Enum243.STATUS_RED) {
        // then this soldier goes to status RED, has proof of enemy presence
        pDefender.bAlertStatus = Enum243.STATUS_RED;
        CheckForChangingOrders(pDefender);
      }

      UpdatePersonal(
        pDefender,
        pAttacker.ubID,
        HEARD_THIS_TURN,
        pAttacker.sGridNo,
        pAttacker.bLevel,
      );

      // if the victim is a human-controlled soldier, instantly report publicly
      if (pDefender.uiStatusFlags & SOLDIER_PC) {
        // mark attacker as having been PUBLICLY heard THIS TURN & remember where
        UpdatePublic(
          pDefender.bTeam,
          pAttacker.ubID,
          HEARD_THIS_TURN,
          pAttacker.sGridNo,
          pAttacker.bLevel,
        );
      }
    }

    if (
      StandardInterruptConditionsMet(pDefender, pAttacker.ubID, bOldOppList)
    ) {
      DebugMsg(
        TOPIC_JA2,
        DBG_LEVEL_3,
        FormatString(
          "INTERRUPT: NoticeUnseenAttacker, standard conditions are met; defender %d, attacker %d",
          pDefender.ubID,
          pAttacker.ubID,
        ),
      );

      // calculate the interrupt duel points
      DebugMsg(
        TOPIC_JA2,
        DBG_LEVEL_3,
        "Calculating int duel pts for defender in NUA",
      );
      pDefender.bInterruptDuelPts = CalcInterruptDuelPts(
        pDefender,
        pAttacker.ubID,
        false,
      );
    } else {
      pDefender.bInterruptDuelPts = NO_INTERRUPT;
    }

    // say quote

    if (pDefender.bInterruptDuelPts != NO_INTERRUPT) {
      // check for possible interrupt and handle control change if it happens
      // this code is basically ResolveInterruptsVs for 1 man only...

      // calculate active soldier's dueling pts for the upcoming interrupt duel
      DebugMsg(
        TOPIC_JA2,
        DBG_LEVEL_3,
        "Calculating int duel pts for attacker in NUA",
      );
      pAttacker.bInterruptDuelPts = CalcInterruptDuelPts(
        pAttacker,
        pDefender.ubID,
        false,
      );
      if (InterruptDuel(pDefender, pAttacker)) {
        DebugMsg(
          TOPIC_JA2,
          DBG_LEVEL_3,
          FormatString(
            "INTERRUPT: NoticeUnseenAttacker, defender pts %d, attacker pts %d, defender gets interrupt",
            pDefender.bInterruptDuelPts,
            pAttacker.bInterruptDuelPts,
          ),
        );
        AddToIntList(pAttacker.ubID, false, true);
        AddToIntList(pDefender.ubID, true, true);
        DoneAddingToIntList(pDefender, true, SIGHTINTERRUPT);
      }
      // either way, clear out both sides' duelPts fields to prepare next duel
      pDefender.bInterruptDuelPts = NO_INTERRUPT;
      pAttacker.bInterruptDuelPts = NO_INTERRUPT;
    }
  }

  export function CheckForAlertWhenEnemyDies(pDyingSoldier: SOLDIERTYPE): void {
    let ubID: UINT8;
    let pSoldier: SOLDIERTYPE;
    let bDir: INT8;
    let sDistAway: INT16;
    let sDistVisible: INT16;

    for (
      ubID = gTacticalStatus.Team[pDyingSoldier.bTeam].bFirstID;
      ubID <= gTacticalStatus.Team[pDyingSoldier.bTeam].bLastID;
      ubID++
    ) {
      pSoldier = MercPtrs[ubID];

      if (
        pSoldier.bActive &&
        pSoldier.bInSector &&
        pSoldier != pDyingSoldier &&
        pSoldier.bLife >= OKLIFE &&
        pSoldier.bAlertStatus < Enum243.STATUS_RED
      ) {
        // this guy might have seen the man die

        // distance we "see" then depends on the direction he is located from us
        bDir = atan8(
          pSoldier.sX,
          pSoldier.sY,
          pDyingSoldier.sX,
          pDyingSoldier.sY,
        );
        sDistVisible = DistanceVisible(
          pSoldier,
          pSoldier.bDesiredDirection,
          bDir,
          pDyingSoldier.sGridNo,
          pDyingSoldier.bLevel,
        );
        sDistAway = PythSpacesAway(pSoldier.sGridNo, pDyingSoldier.sGridNo);

        // if we see close enough to see the soldier
        if (sDistAway <= sDistVisible) {
          // and we can trace a line of sight to his x,y coordinates
          // assume enemies are always aware of their buddies...
          if (
            SoldierTo3DLocationLineOfSightTest(
              pSoldier,
              pDyingSoldier.sGridNo,
              pDyingSoldier.bLevel,
              0,
              sDistVisible,
              true,
            )
          ) {
            pSoldier.bAlertStatus = Enum243.STATUS_RED;
            CheckForChangingOrders(pSoldier);
          }
        }
      }
    }
  }

  function ArmyKnowsOfPlayersPresence(): boolean {
    let ubID: UINT8;
    let pSoldier: SOLDIERTYPE;

    // if anyone is still left...
    if (
      gTacticalStatus.Team[ENEMY_TEAM].bTeamActive &&
      gTacticalStatus.Team[ENEMY_TEAM].bMenInSector > 0
    ) {
      for (
        ubID = gTacticalStatus.Team[ENEMY_TEAM].bFirstID;
        ubID <= gTacticalStatus.Team[ENEMY_TEAM].bLastID;
        ubID++
      ) {
        pSoldier = MercPtrs[ubID];

        if (
          pSoldier.bActive &&
          pSoldier.bInSector &&
          pSoldier.bLife >= OKLIFE &&
          pSoldier.bAlertStatus >= Enum243.STATUS_RED
        ) {
          return true;
        }
      }
    }
    return false;
  }

  export function MercSeesCreature(pSoldier: SOLDIERTYPE): boolean {
    let fSeesCreature: boolean = false;
    let ubID: UINT8;

    if (pSoldier.bOppCnt > 0) {
      for (
        ubID = gTacticalStatus.Team[CREATURE_TEAM].bFirstID;
        ubID <= gTacticalStatus.Team[CREATURE_TEAM].bLastID;
        ubID++
      ) {
        if (
          pSoldier.bOppList[ubID] == SEEN_CURRENTLY &&
          MercPtrs[ubID].uiStatusFlags & SOLDIER_MONSTER
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function FindUnusedWatchedLoc(ubID: UINT8): INT8 {
    let bLoop: INT8;

    for (bLoop = 0; bLoop < NUM_WATCHED_LOCS; bLoop++) {
      if (gsWatchedLoc[ubID][bLoop] == NOWHERE) {
        return bLoop;
      }
    }
    return -1;
  }

  function FindWatchedLocWithLessThanXPointsLeft(
    ubID: UINT8,
    ubPointLimit: UINT8,
  ): INT8 {
    let bLoop: INT8;

    for (bLoop = 0; bLoop < NUM_WATCHED_LOCS; bLoop++) {
      if (
        gsWatchedLoc[ubID][bLoop] != NOWHERE &&
        gubWatchedLocPoints[ubID][bLoop] <= ubPointLimit
      ) {
        return bLoop;
      }
    }
    return -1;
  }

  function FindWatchedLoc(ubID: UINT8, sGridNo: INT16, bLevel: INT8): INT8 {
    let bLoop: INT8;

    for (bLoop = 0; bLoop < NUM_WATCHED_LOCS; bLoop++) {
      if (
        gsWatchedLoc[ubID][bLoop] != NOWHERE &&
        gbWatchedLocLevel[ubID][bLoop] == bLevel
      ) {
        if (
          SpacesAway(gsWatchedLoc[ubID][bLoop], sGridNo) <= WATCHED_LOC_RADIUS
        ) {
          return bLoop;
        }
      }
    }
    return -1;
  }

  export function GetWatchedLocPoints(
    ubID: UINT8,
    sGridNo: INT16,
    bLevel: INT8,
  ): INT8 {
    let bLoc: INT8;

    bLoc = FindWatchedLoc(ubID, sGridNo, bLevel);
    if (bLoc != -1) {
      // one loc point is worth nothing, so return number minus 1

      // experiment with 1 loc point being worth 1 point
      return gubWatchedLocPoints[ubID][bLoc];
    }

    return 0;
  }

  export function GetHighestVisibleWatchedLoc(ubID: UINT8): INT8 {
    let bLoop: INT8;
    let bHighestLoc: INT8 = -1;
    let bHighestPoints: INT8 = 0;
    let sDistVisible: INT16;

    for (bLoop = 0; bLoop < NUM_WATCHED_LOCS; bLoop++) {
      if (
        gsWatchedLoc[ubID][bLoop] != NOWHERE &&
        gubWatchedLocPoints[ubID][bLoop] > bHighestPoints
      ) {
        sDistVisible = DistanceVisible(
          MercPtrs[ubID],
          Enum245.DIRECTION_IRRELEVANT,
          Enum245.DIRECTION_IRRELEVANT,
          gsWatchedLoc[ubID][bLoop],
          gbWatchedLocLevel[ubID][bLoop],
        );
        // look at standing height
        if (
          SoldierTo3DLocationLineOfSightTest(
            MercPtrs[ubID],
            gsWatchedLoc[ubID][bLoop],
            gbWatchedLocLevel[ubID][bLoop],
            3,
            sDistVisible,
            true,
          )
        ) {
          bHighestLoc = bLoop;
          bHighestPoints = gubWatchedLocPoints[ubID][bLoop];
        }
      }
    }
    return bHighestLoc;
  }

  export function GetHighestWatchedLocPoints(ubID: UINT8): INT8 {
    let bLoop: INT8;
    let bHighestPoints: INT8 = 0;

    for (bLoop = 0; bLoop < NUM_WATCHED_LOCS; bLoop++) {
      if (
        gsWatchedLoc[ubID][bLoop] != NOWHERE &&
        gubWatchedLocPoints[ubID][bLoop] > bHighestPoints
      ) {
        bHighestPoints = gubWatchedLocPoints[ubID][bLoop];
      }
    }
    return bHighestPoints;
  }

  function CommunicateWatchedLoc(
    ubID: UINT8,
    sGridNo: INT16,
    bLevel: INT8,
    ubPoints: UINT8,
  ): void {
    let ubLoop: UINT8;
    let bTeam: INT8;
    let bLoopPoint: INT8;
    let bPoint: INT8;

    bTeam = MercPtrs[ubID].bTeam;

    for (
      ubLoop = gTacticalStatus.Team[bTeam].bFirstID;
      ubLoop < gTacticalStatus.Team[bTeam].bLastID;
      ubLoop++
    ) {
      if (
        ubLoop == ubID ||
        MercPtrs[ubLoop].bActive == false ||
        MercPtrs[ubLoop].bInSector == false ||
        MercPtrs[ubLoop].bLife < OKLIFE
      ) {
        continue;
      }
      bLoopPoint = FindWatchedLoc(ubLoop, sGridNo, bLevel);
      if (bLoopPoint == -1) {
        // add this as a watched point
        bPoint = FindUnusedWatchedLoc(ubLoop);
        if (bPoint == -1) {
          // if we have a point with only 1 point left, replace it
          bPoint = FindWatchedLocWithLessThanXPointsLeft(ubLoop, ubPoints);
        }
        if (bPoint != -1) {
          gsWatchedLoc[ubLoop][bPoint] = sGridNo;
          gbWatchedLocLevel[ubLoop][bPoint] = bLevel;
          gubWatchedLocPoints[ubLoop][bPoint] = ubPoints;
          gfWatchedLocReset[ubLoop][bPoint] = false;
          gfWatchedLocHasBeenIncremented[ubLoop][bPoint] = true;
        }
        // else no points available!
      } else {
        // increment to max
        gubWatchedLocPoints[ubLoop][bLoopPoint] = Math.max(
          gubWatchedLocPoints[ubLoop][bLoopPoint],
          ubPoints,
        );

        gfWatchedLocReset[ubLoop][bLoopPoint] = false;
        gfWatchedLocHasBeenIncremented[ubLoop][bLoopPoint] = true;
      }
    }
  }

  function IncrementWatchedLoc(
    ubID: UINT8,
    sGridNo: INT16,
    bLevel: INT8,
  ): void {
    let bPoint: INT8;

    bPoint = FindWatchedLoc(ubID, sGridNo, bLevel);
    if (bPoint == -1) {
      // try adding point
      bPoint = FindUnusedWatchedLoc(ubID);
      if (bPoint == -1) {
        // if we have a point with only 1 point left, replace it
        bPoint = FindWatchedLocWithLessThanXPointsLeft(ubID, 1);
      }

      if (bPoint != -1) {
        gsWatchedLoc[ubID][bPoint] = sGridNo;
        gbWatchedLocLevel[ubID][bPoint] = bLevel;
        gubWatchedLocPoints[ubID][bPoint] = 1;
        gfWatchedLocReset[ubID][bPoint] = false;
        gfWatchedLocHasBeenIncremented[ubID][bPoint] = true;

        CommunicateWatchedLoc(ubID, sGridNo, bLevel, 1);
      }
      // otherwise abort; no points available
    } else {
      if (
        !gfWatchedLocHasBeenIncremented[ubID][bPoint] &&
        gubWatchedLocPoints[ubID][bPoint] < MAX_WATCHED_LOC_POINTS
      ) {
        gubWatchedLocPoints[ubID][bPoint]++;
        CommunicateWatchedLoc(
          ubID,
          sGridNo,
          bLevel,
          gubWatchedLocPoints[ubID][bPoint],
        );
      }
      gfWatchedLocReset[ubID][bPoint] = false;
      gfWatchedLocHasBeenIncremented[ubID][bPoint] = true;
    }
  }

  function SetWatchedLocAsUsed(
    ubID: UINT8,
    sGridNo: INT16,
    bLevel: INT8,
  ): void {
    let bPoint: INT8;

    bPoint = FindWatchedLoc(ubID, sGridNo, bLevel);
    if (bPoint != -1) {
      gfWatchedLocReset[ubID][bPoint] = false;
    }
  }

  function WatchedLocLocationIsEmpty(
    sGridNo: INT16,
    bLevel: INT8,
    bTeam: INT8,
  ): boolean {
    // look to see if there is anyone near the watched loc who is not on this team
    let ubID: UINT8;
    let sTempGridNo: INT16;
    let sX: INT16;
    let sY: INT16;

    for (sY = -WATCHED_LOC_RADIUS; sY <= WATCHED_LOC_RADIUS; sY++) {
      for (sX = -WATCHED_LOC_RADIUS; sX <= WATCHED_LOC_RADIUS; sX++) {
        sTempGridNo = sGridNo + sX + sY * WORLD_ROWS;
        if (sTempGridNo < 0 || sTempGridNo >= WORLD_MAX) {
          continue;
        }
        ubID = WhoIsThere2(sTempGridNo, bLevel);
        if (ubID != NOBODY && MercPtrs[ubID].bTeam != bTeam) {
          return false;
        }
      }
    }
    return true;
  }

  function DecayWatchedLocs(bTeam: INT8): void {
    let cnt: UINT8;
    let cnt2: UINT8;

    // loop through all soldiers
    for (
      cnt = gTacticalStatus.Team[bTeam].bFirstID;
      cnt <= gTacticalStatus.Team[bTeam].bLastID;
      cnt++
    ) {
      // for each watched location
      for (cnt2 = 0; cnt2 < NUM_WATCHED_LOCS; cnt2++) {
        if (
          gsWatchedLoc[cnt][cnt2] != NOWHERE &&
          WatchedLocLocationIsEmpty(
            gsWatchedLoc[cnt][cnt2],
            gbWatchedLocLevel[cnt][cnt2],
            bTeam,
          )
        ) {
          // if the reset flag is still set, then we should decay this point
          if (gfWatchedLocReset[cnt][cnt2]) {
            // turn flag off again
            gfWatchedLocReset[cnt][cnt2] = false;

            // halve points
            gubWatchedLocPoints[cnt][cnt2] = Math.trunc(
              gubWatchedLocPoints[cnt][cnt2] / 2,
            );
            // if points have reached 0, then reset the location
            if (gubWatchedLocPoints[cnt][cnt2] == 0) {
              gsWatchedLoc[cnt][cnt2] = NOWHERE;
            }
          } else {
            // flag was false so set to true (will be reset if new people seen there next turn)
            gfWatchedLocReset[cnt][cnt2] = true;
          }
        }
      }
    }
  }

  function MakeBloodcatsHostile(): void {
    let iLoop: INT32;
    let pSoldier: SOLDIERTYPE;

    iLoop = gTacticalStatus.Team[CREATURE_TEAM].bFirstID;

    for (
      pSoldier = MercPtrs[iLoop];
      iLoop <= gTacticalStatus.Team[CREATURE_TEAM].bLastID;
      iLoop++, pSoldier = MercPtrs[iLoop]
    ) {
      if (
        pSoldier.ubBodyType == Enum194.BLOODCAT &&
        pSoldier.bActive &&
        pSoldier.bInSector &&
        pSoldier.bLife > 0
      ) {
        SetSoldierNonNeutral(pSoldier);
        RecalculateOppCntsDueToNoLongerNeutral(pSoldier);
        if (gTacticalStatus.uiFlags & INCOMBAT) {
          CheckForPotentialAddToBattleIncrement(pSoldier);
        }
      }
    }
  }
}
