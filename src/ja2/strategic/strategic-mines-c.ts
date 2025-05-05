namespace ja2 {
  // this .c file will handle the strategic level of mines and income from them

  const REMOVAL_RATE_INCREMENT = 250; // the smallest increment by which removal rate change during depletion (use round #s)

  const LOW_MINE_LOYALTY_THRESHOLD = 50; // below this the head miner considers his town's population disloyal

  // Mine production is being processed 4x daily: 9am ,noon, 3pm, and 6pm.
  // This is loosely based on a 6am-6pm working day of 4 "shifts".
  const MINE_PRODUCTION_NUMBER_OF_PERIODS = 4; // how many times a day mine production is processed
  const MINE_PRODUCTION_START_TIME = 9 * 60; // hour of first daily mine production event (in minutes)
  const MINE_PRODUCTION_PERIOD = 3 * 60; // time seperating daily mine production events (in minutes)

  // PRIVATE PROTOTYPES

  // DATA TABLES

  // this table holds mine values that change during the course of the game and must be saved
  export let gMineStatus: MINE_STATUS_TYPE[] /* [MAX_NUMBER_OF_MINES] */ =
    createArrayFrom(Enum179.MAX_NUMBER_OF_MINES, createMineStatusType);

  // this table holds mine values that never change and don't need to be saved
  export let gMineLocation: MINE_LOCATION_TYPE[] /* [MAX_NUMBER_OF_MINES] */ = [
    createMineLocationTypeFrom(4, 4, Enum135.SAN_MONA),
    createMineLocationTypeFrom(13, 4, Enum135.DRASSEN),
    createMineLocationTypeFrom(14, 9, Enum135.ALMA),
    createMineLocationTypeFrom(8, 8, Enum135.CAMBRIA),
    createMineLocationTypeFrom(2, 2, Enum135.CHITZENA),
    createMineLocationTypeFrom(3, 8, Enum135.GRUMM),
  ];

  // the are not being randomized at all at this time
  let gubMineTypes: UINT8[] /* [] */ = [
    Enum181.GOLD_MINE, // SAN MONA
    Enum181.SILVER_MINE, // DRASSEN
    Enum181.SILVER_MINE, // ALMA
    Enum181.SILVER_MINE, // CAMBRIA
    Enum181.SILVER_MINE, // CHITZENA
    Enum181.GOLD_MINE, // GRUMM
  ];

  // These values also determine the most likely ratios of mine sizes after random production increases are done
  let guiMinimumMineProduction: UINT32[] /* [] */ = [
    0, // SAN MONA
    1000, // DRASSEN
    1500, // ALMA
    1500, // CAMBRIA
    500, // CHITZENA
    2000, // GRUMM
  ];

  let gHeadMinerData: HEAD_MINER_TYPE[] /* [NUM_HEAD_MINERS] */ = [
    //	Profile #		running out		creatures!		all dead!		creatures again!		external face graphic
    createHeadMinerTypeFrom(
      Enum268.FRED,
      [17, 18, 27, 26],
      Enum203.MINER_FRED_EXTERNAL_FACE,
    ),
    createHeadMinerTypeFrom(
      Enum268.MATT,
      [-1, 18, 32, 31],
      Enum203.MINER_MATT_EXTERNAL_FACE,
    ),
    createHeadMinerTypeFrom(
      Enum268.OSWALD,
      [14, 15, 24, 23],
      Enum203.MINER_OSWALD_EXTERNAL_FACE,
    ),
    createHeadMinerTypeFrom(
      Enum268.CALVIN,
      [14, 15, 24, 23],
      Enum203.MINER_CALVIN_EXTERNAL_FACE,
    ),
    createHeadMinerTypeFrom(
      Enum268.CARL,
      [14, 15, 24, 23],
      Enum203.MINER_CARL_EXTERNAL_FACE,
    ),
  ];

  /* gradual monster infestation concept was ditched, now simply IN PRODUCTION or SHUT DOWN

// percentage of workers working depends on level of mine infestation
UINT8 gubMonsterMineInfestation[]={
        100,
        99,
        95,
        70,
        30,
        1,
        0,
};
*/

  export function InitializeMines(): void {
    let ubMineIndex: UINT8;
    let pMineStatus: MINE_STATUS_TYPE;
    let ubMineProductionIncreases: UINT8;
    let ubDepletedMineIndex: UINT8;
    let ubMinDaysBeforeDepletion: UINT8 = 20;

    // set up initial mine status
    for (
      ubMineIndex = 0;
      ubMineIndex < Enum179.MAX_NUMBER_OF_MINES;
      ubMineIndex++
    ) {
      pMineStatus = gMineStatus[ubMineIndex];

      resetMineStatusType(pMineStatus);

      pMineStatus.ubMineType = gubMineTypes[ubMineIndex];
      pMineStatus.uiMaxRemovalRate = guiMinimumMineProduction[ubMineIndex];
      pMineStatus.fEmpty = pMineStatus.uiMaxRemovalRate == 0 ? true : false;
      pMineStatus.fRunningOut = false;
      pMineStatus.fWarnedOfRunningOut = false;
      //		pMineStatus->bMonsters = MINES_NO_MONSTERS;
      pMineStatus.fShutDown = false;
      pMineStatus.fPrevInvadedByMonsters = false;
      pMineStatus.fSpokeToHeadMiner = false;
      pMineStatus.fMineHasProducedForPlayer = false;
      pMineStatus.fQueenRetookProducingMine = false;
      pMineStatus.fShutDownIsPermanent = false;
    }

    // randomize the exact size each mine.  The total production is always the same and depends on the game difficulty,
    // but some mines will produce more in one game than another, while others produce less

    // adjust for game difficulty
    switch (gGameOptions.ubDifficultyLevel) {
      case Enum9.DIF_LEVEL_EASY:
      case Enum9.DIF_LEVEL_MEDIUM:
        ubMineProductionIncreases = 25;
        break;
      case Enum9.DIF_LEVEL_HARD:
        ubMineProductionIncreases = 20;
        break;
      default:
        Assert(0);
        return;
    }

    while (ubMineProductionIncreases > 0) {
      // pick a producing mine at random and increase its production
      do {
        ubMineIndex = Random(Enum179.MAX_NUMBER_OF_MINES);
      } while (gMineStatus[ubMineIndex].fEmpty);

      // increase mine production by 20% of the base (minimum) rate
      gMineStatus[ubMineIndex].uiMaxRemovalRate += Math.trunc(
        guiMinimumMineProduction[ubMineIndex] / 5,
      );

      ubMineProductionIncreases--;
    }

    // choose which mine will run out of production.  This will never be the Alma mine or an empty mine (San Mona)...
    do {
      ubDepletedMineIndex = Random(Enum179.MAX_NUMBER_OF_MINES);
      // Alma mine can't run out for quest-related reasons (see Ian)
    } while (
      gMineStatus[ubDepletedMineIndex].fEmpty ||
      ubDepletedMineIndex == Enum179.MINE_ALMA
    );

    for (
      ubMineIndex = 0;
      ubMineIndex < Enum179.MAX_NUMBER_OF_MINES;
      ubMineIndex++
    ) {
      pMineStatus = gMineStatus[ubMineIndex];

      if (ubMineIndex == ubDepletedMineIndex) {
        if (ubDepletedMineIndex == Enum179.MINE_DRASSEN) {
          ubMinDaysBeforeDepletion = 20;
        } else {
          ubMinDaysBeforeDepletion = 10;
        }

        // the mine that runs out has only enough ore for this many days of full production
        pMineStatus.uiRemainingOreSupply =
          ubMinDaysBeforeDepletion *
          (MINE_PRODUCTION_NUMBER_OF_PERIODS * pMineStatus.uiMaxRemovalRate);

        // ore starts running out when reserves drop to less than 25% of the initial supply
        pMineStatus.uiOreRunningOutPoint = Math.trunc(
          pMineStatus.uiRemainingOreSupply / 4,
        );
      } else if (!pMineStatus.fEmpty) {
        // never runs out...
        pMineStatus.uiRemainingOreSupply = 999999999; // essentially unlimited
        pMineStatus.uiOreRunningOutPoint = 0;
      } else {
        // already empty
        pMineStatus.uiRemainingOreSupply = 0;
        pMineStatus.uiOreRunningOutPoint = 0;
      }
    }
  }

  export function HourlyMinesUpdate(): void {
    let ubMineIndex: UINT8;
    let pMineStatus: MINE_STATUS_TYPE;
    let ubQuoteType: UINT8;

    // check every non-empty mine
    for (
      ubMineIndex = 0;
      ubMineIndex < Enum179.MAX_NUMBER_OF_MINES;
      ubMineIndex++
    ) {
      pMineStatus = gMineStatus[ubMineIndex];

      if (pMineStatus.fEmpty) {
        // nobody is working that mine, so who cares
        continue;
      }

      // check if the mine has any monster creatures in it
      if (MineClearOfMonsters(ubMineIndex)) {
        // if it's shutdown, but not permanently
        if (IsMineShutDown(ubMineIndex) && !pMineStatus.fShutDownIsPermanent) {
          // if we control production in it
          if (PlayerControlsMine(ubMineIndex)) {
            IssueHeadMinerQuote(
              ubMineIndex,
              Enum183.HEAD_MINER_STRATEGIC_QUOTE_CREATURES_GONE,
            );
          }

          // Force the creatures to avoid the mine for a period of time.  This gives the
          // player a chance to rest and decide how to deal with the problem.
          ForceCreaturesToAvoidMineTemporarily(ubMineIndex);

          // put mine back in service
          RestartMineProduction(ubMineIndex);
        }
      } // mine is monster infested
      else {
        // 'Der be monsters crawling around in there, lad!!!

        // if it's still producing
        if (!IsMineShutDown(ubMineIndex)) {
          // gotta put a stop to that!

          // if we control production in it
          if (PlayerControlsMine(ubMineIndex)) {
            // 2 different quotes, depends whether or not it's the first time this has happened
            if (pMineStatus.fPrevInvadedByMonsters) {
              ubQuoteType = Enum183.HEAD_MINER_STRATEGIC_QUOTE_CREATURES_AGAIN;
            } else {
              ubQuoteType = Enum183.HEAD_MINER_STRATEGIC_QUOTE_CREATURES_ATTACK;
              pMineStatus.fPrevInvadedByMonsters = true;

              if (gubQuest[Enum169.QUEST_CREATURES] == QUESTNOTSTARTED) {
                // start it now!
                StartQuest(
                  Enum169.QUEST_CREATURES,
                  gMineLocation[ubMineIndex].sSectorX,
                  gMineLocation[ubMineIndex].sSectorY,
                );
              }
            }

            // tell player the good news...
            IssueHeadMinerQuote(ubMineIndex, ubQuoteType);
          }

          // and immediately halt all work at the mine (whether it's ours or the queen's).  This is a temporary shutdown
          ShutOffMineProduction(ubMineIndex);
        }
      }
    }
  }

  export function GetTotalLeftInMine(bMineIndex: INT8): INT32 {
    // returns the value of the mine

    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    return gMineStatus[bMineIndex].uiRemainingOreSupply;
  }

  export function GetMaxPeriodicRemovalFromMine(bMineIndex: INT8): UINT32 {
    // returns max amount that can be mined in a time period

    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    // if mine is shut down
    if (gMineStatus[bMineIndex].fShutDown) {
      return 0;
    }

    return gMineStatus[bMineIndex].uiMaxRemovalRate;
  }

  export function GetMaxDailyRemovalFromMine(bMineIndex: INT8): UINT32 {
    let uiAmtExtracted: UINT32;

    // returns max amount that can be mined in one day

    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    // if mine is shut down
    if (gMineStatus[bMineIndex].fShutDown) {
      return 0;
    }

    uiAmtExtracted =
      MINE_PRODUCTION_NUMBER_OF_PERIODS *
      gMineStatus[bMineIndex].uiMaxRemovalRate;

    // check if we will take more than there is
    if (uiAmtExtracted > gMineStatus[bMineIndex].uiRemainingOreSupply) {
      // yes, reduce to value of mine
      uiAmtExtracted = gMineStatus[bMineIndex].uiRemainingOreSupply;
    }

    return uiAmtExtracted;
  }

  export function GetTownAssociatedWithMine(bMineIndex: INT8): INT8 {
    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    return gMineLocation[bMineIndex].bAssociatedTown;
  }

  function GetMineAssociatedWithThisTown(bTownId: INT8): INT8 {
    let bCounter: INT8 = 0;

    // run through list of mines
    for (bCounter = 0; bCounter < Enum179.MAX_NUMBER_OF_MINES; bCounter++) {
      if (gMineLocation[bCounter].bAssociatedTown == bTownId) {
        // town found, return the fact
        return gMineLocation[bCounter].bAssociatedTown;
      }
    }

    // return that no town found..a 0
    return 0;
  }

  function ExtractOreFromMine(bMineIndex: INT8, uiAmount: UINT32): UINT32 {
    // will remove the ore from the mine and return the amount that was removed
    let uiAmountExtracted: UINT32 = 0;
    let uiOreRunningOutPoint: UINT32 = 0;
    let sSectorX: INT16;
    let sSectorY: INT16;

    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    // if mine is shut down
    if (gMineStatus[bMineIndex].fShutDown) {
      return 0;
    }

    // if not capable of extracting anything, bail now
    if (uiAmount == 0) {
      return 0;
    }

    // will this exhaust the ore in this mine?
    if (uiAmount >= gMineStatus[bMineIndex].uiRemainingOreSupply) {
      // exhaust remaining ore
      uiAmountExtracted = gMineStatus[bMineIndex].uiRemainingOreSupply;
      gMineStatus[bMineIndex].uiRemainingOreSupply = 0;
      gMineStatus[bMineIndex].uiMaxRemovalRate = 0;
      gMineStatus[bMineIndex].fEmpty = true;
      gMineStatus[bMineIndex].fRunningOut = false;

      // tell the strategic AI about this, that mine's and town's value is greatly reduced
      ({ sSectorX, sSectorY } = GetMineSector(bMineIndex));
      StrategicHandleMineThatRanOut(SECTOR(sSectorX, sSectorY));

      AddHistoryToPlayersLog(
        Enum83.HISTORY_MINE_RAN_OUT,
        gMineLocation[bMineIndex].bAssociatedTown,
        GetWorldTotalMin(),
        gMineLocation[bMineIndex].sSectorX,
        gMineLocation[bMineIndex].sSectorY,
      );
    } // still some left after this extraction
    else {
      // set amount used, and decrement ore remaining in mine
      uiAmountExtracted = uiAmount;
      gMineStatus[bMineIndex].uiRemainingOreSupply -= uiAmount;

      // one of the mines (randomly chosen) will start running out eventually, check if we're there yet
      if (
        gMineStatus[bMineIndex].uiRemainingOreSupply <
        gMineStatus[bMineIndex].uiOreRunningOutPoint
      ) {
        gMineStatus[bMineIndex].fRunningOut = true;

        // round all fractions UP to the next REMOVAL_RATE_INCREMENT
        gMineStatus[bMineIndex].uiMaxRemovalRate = Math.trunc(
          (gMineStatus[bMineIndex].uiRemainingOreSupply /
            10 /
            REMOVAL_RATE_INCREMENT +
            0.9999) *
            REMOVAL_RATE_INCREMENT,
        );

        // if we control it
        if (PlayerControlsMine(bMineIndex)) {
          // and haven't yet been warned that it's running out
          if (!gMineStatus[bMineIndex].fWarnedOfRunningOut) {
            // that mine's head miner tells player that the mine is running out
            IssueHeadMinerQuote(
              bMineIndex,
              Enum183.HEAD_MINER_STRATEGIC_QUOTE_RUNNING_OUT,
            );
            gMineStatus[bMineIndex].fWarnedOfRunningOut = true;
            AddHistoryToPlayersLog(
              Enum83.HISTORY_MINE_RUNNING_OUT,
              gMineLocation[bMineIndex].bAssociatedTown,
              GetWorldTotalMin(),
              gMineLocation[bMineIndex].sSectorX,
              gMineLocation[bMineIndex].sSectorY,
            );
          }
        }
      }
    }

    return uiAmountExtracted;
  }

  function GetAvailableWorkForceForMineForPlayer(bMineIndex: INT8): INT32 {
    // look for available workforce in the town associated with the mine
    let iWorkForceSize: INT32 = 0;
    let bTownId: INT8 = 0;

    // return the loyalty of the town associated with the mine

    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    // if mine is shut down
    if (gMineStatus[bMineIndex].fShutDown) {
      return 0;
    }

    // until the player contacts the head miner, production in mine ceases if in player's control
    if (!gMineStatus[bMineIndex].fSpokeToHeadMiner) {
      return 0;
    }

    bTownId = gMineLocation[bMineIndex].bAssociatedTown;

    Assert(GetTownSectorSize(bTownId) != 0);

    // get workforce size (is 0-100 based on local town's loyalty)
    iWorkForceSize = gTownLoyalty[bTownId].ubRating;

    /*
          // adjust for monster infestation
          iWorkForceSize *= gubMonsterMineInfestation[ gMineStatus[ bMineIndex ].bMonsters ];
          iWorkForceSize /= 100;
  */

    // now adjust for town size.. the number of sectors you control
    iWorkForceSize *= GetTownSectorsUnderControl(bTownId);
    iWorkForceSize = Math.trunc(iWorkForceSize / GetTownSectorSize(bTownId));

    return iWorkForceSize;
  }

  function GetAvailableWorkForceForMineForEnemy(bMineIndex: INT8): INT32 {
    // look for available workforce in the town associated with the mine
    let iWorkForceSize: INT32 = 0;
    let bTownId: INT8 = 0;

    // return the loyalty of the town associated with the mine

    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    // if mine is shut down
    if (gMineStatus[bMineIndex].fShutDown) {
      return 0;
    }

    bTownId = gMineLocation[bMineIndex].bAssociatedTown;

    if (GetTownSectorSize(bTownId) == 0) {
      return 0;
    }

    // get workforce size (is 0-100 based on REVERSE of local town's loyalty)
    iWorkForceSize = 100 - gTownLoyalty[bTownId].ubRating;

    /*
          // adjust for monster infestation
          iWorkForceSize *= gubMonsterMineInfestation[ gMineStatus[ bMineIndex ].bMonsters ];
          iWorkForceSize /= 100;
  */

    // now adjust for town size.. the number of sectors you control
    iWorkForceSize *=
      GetTownSectorSize(bTownId) - GetTownSectorsUnderControl(bTownId);
    iWorkForceSize = Math.trunc(iWorkForceSize / GetTownSectorSize(bTownId));

    return iWorkForceSize;
  }

  function GetCurrentWorkRateOfMineForPlayer(bMineIndex: INT8): INT32 {
    let iWorkRate: INT32 = 0;

    // multiply maximum possible removal rate by the percentage of workforce currently working
    iWorkRate = Math.trunc(
      (gMineStatus[bMineIndex].uiMaxRemovalRate *
        GetAvailableWorkForceForMineForPlayer(bMineIndex)) /
        100,
    );

    return iWorkRate;
  }

  function GetCurrentWorkRateOfMineForEnemy(bMineIndex: INT8): INT32 {
    let iWorkRate: INT32 = 0;

    // multiply maximum possible removal rate by the percentage of workforce currently working
    iWorkRate = Math.trunc(
      (gMineStatus[bMineIndex].uiMaxRemovalRate *
        GetAvailableWorkForceForMineForEnemy(bMineIndex)) /
        100,
    );

    return iWorkRate;
  }

  function MineAMine(bMineIndex: INT8): INT32 {
    // will extract ore based on available workforce, and increment players income based on amount
    let bMineType: INT8 = 0;
    let iAmtExtracted: INT32 = 0;

    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    // is mine is empty
    if (gMineStatus[bMineIndex].fEmpty) {
      return 0;
    }

    // if mine is shut down
    if (gMineStatus[bMineIndex].fShutDown) {
      return 0;
    }

    // who controls the PRODUCTION in the mine ?  (Queen receives production unless player has spoken to the head miner)
    if (PlayerControlsMine(bMineIndex)) {
      // player controlled
      iAmtExtracted = ExtractOreFromMine(
        bMineIndex,
        GetCurrentWorkRateOfMineForPlayer(bMineIndex),
      );

      // SHOW ME THE MONEY!!!!
      if (iAmtExtracted > 0) {
        // debug message
        //			ScreenMsg( MSG_FONT_RED, MSG_DEBUG, L"%s - Mine income from %s = $%d", WORLDTIMESTR, pTownNames[ GetTownAssociatedWithMine( bMineIndex ) ], iAmtExtracted );

        // check type of mine
        bMineType = gMineStatus[bMineIndex].ubMineType;

        // if this is the first time this mine has produced income for the player in the game
        if (!gMineStatus[bMineIndex].fMineHasProducedForPlayer) {
          // remember that we've earned income from this mine during the game
          gMineStatus[bMineIndex].fMineHasProducedForPlayer = true;
          // and when we started to do so...
          gMineStatus[bMineIndex].uiTimePlayerProductionStarted =
            GetWorldTotalMin();
        }
      }
    } // queen controlled
    else {
      // we didn't want mines to run out without player ever even going to them, so now the queen doesn't reduce the
      // amount remaining until the mine has produced for the player first (so she'd have to capture it).
      if (gMineStatus[bMineIndex].fMineHasProducedForPlayer) {
        // don't actually give her money, just take production away
        iAmtExtracted = ExtractOreFromMine(
          bMineIndex,
          GetCurrentWorkRateOfMineForEnemy(bMineIndex),
        );
      }
    }

    return iAmtExtracted;
  }

  export function PostEventsForMineProduction(): void {
    let ubShift: UINT8;

    for (ubShift = 0; ubShift < MINE_PRODUCTION_NUMBER_OF_PERIODS; ubShift++) {
      AddStrategicEvent(
        Enum132.EVENT_HANDLE_MINE_INCOME,
        GetWorldDayInMinutes() +
          MINE_PRODUCTION_START_TIME +
          ubShift * MINE_PRODUCTION_PERIOD,
        0,
      );
    }
  }

  export function HandleIncomeFromMines(): void {
    let iIncome: INT32 = 0;
    let bCounter: INT8 = 0;

    // mine each mine, check if we own it and such
    for (bCounter = 0; bCounter < Enum179.MAX_NUMBER_OF_MINES; bCounter++) {
      // mine this mine
      iIncome += MineAMine(bCounter);
    }
    if (iIncome) {
      AddTransactionToPlayersBook(
        Enum80.DEPOSIT_FROM_SILVER_MINE,
        0,
        GetWorldTotalMin(),
        iIncome,
      );
    }
  }

  export function PredictDailyIncomeFromAMine(bMineIndex: INT8): UINT32 {
    // predict income from this mine, estimate assumes mining situation will not change during next 4 income periods
    // (miner loyalty, % town controlled, monster infestation level, and current max removal rate may all in fact change)
    let uiAmtExtracted: UINT32 = 0;

    if (PlayerControlsMine(bMineIndex)) {
      // get daily income for this mine (regardless of what time of day it currently is)
      uiAmtExtracted =
        MINE_PRODUCTION_NUMBER_OF_PERIODS *
        GetCurrentWorkRateOfMineForPlayer(bMineIndex);

      // check if we will take more than there is
      if (uiAmtExtracted > gMineStatus[bMineIndex].uiRemainingOreSupply) {
        // yes reduce to value of mine
        uiAmtExtracted = gMineStatus[bMineIndex].uiRemainingOreSupply;
      }
    }

    return uiAmtExtracted;
  }

  export function PredictIncomeFromPlayerMines(): INT32 {
    let iTotal: INT32 = 0;
    let bCounter: INT8 = 0;

    for (bCounter = 0; bCounter < Enum179.MAX_NUMBER_OF_MINES; bCounter++) {
      // add up the total
      iTotal += PredictDailyIncomeFromAMine(bCounter);
    }

    return iTotal;
  }

  export function CalcMaxPlayerIncomeFromMines(): INT32 {
    let iTotal: INT32 = 0;
    let bCounter: INT8 = 0;

    // calculate how much player could make daily if he owned all mines with 100% control and 100% loyalty
    for (bCounter = 0; bCounter < Enum179.MAX_NUMBER_OF_MINES; bCounter++) {
      // add up the total
      iTotal +=
        MINE_PRODUCTION_NUMBER_OF_PERIODS *
        gMineStatus[bCounter].uiMaxRemovalRate;
    }

    return iTotal;
  }

  // get index of this mine, return -1 if no mine found
  export function GetMineIndexForSector(sX: INT16, sY: INT16): INT8 {
    let ubMineIndex: UINT8 = 0;

    for (
      ubMineIndex = 0;
      ubMineIndex < Enum179.MAX_NUMBER_OF_MINES;
      ubMineIndex++
    ) {
      if (
        gMineLocation[ubMineIndex].sSectorX == sX &&
        gMineLocation[ubMineIndex].sSectorY == sY
      ) {
        // yep mine here
        return ubMineIndex;
      }
    }

    return -1;
  }

  export function GetMineSector(ubMineIndex: UINT8): {
    sSectorX: INT16;
    sSectorY: INT16;
  } {
    let sSectorX: INT16;
    let sSectorY: INT16;

    Assert(ubMineIndex >= 0 && ubMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    sSectorX = gMineLocation[ubMineIndex].sSectorX;
    sSectorY = gMineLocation[ubMineIndex].sSectorY;

    return { sSectorX, sSectorY };
  }

  // get the index of the mine associated with this town
  function GetMineIndexForTown(bTownId: INT8): INT8 {
    let ubMineIndex: UINT8 = 0;

    // given town id, send sector value of mine, a 0 means no mine for this town
    for (
      ubMineIndex = 0;
      ubMineIndex < Enum179.MAX_NUMBER_OF_MINES;
      ubMineIndex++
    ) {
      if (gMineLocation[ubMineIndex].bAssociatedTown == bTownId) {
        return ubMineIndex;
      }
    }

    return -1;
  }

  // get the sector value for the mine associated with this town
  export function GetMineSectorForTown(bTownId: INT8): INT16 {
    let ubMineIndex: INT8;
    let sMineSector: INT16 = -1;

    // given town id, send sector value of mine, a 0 means no mine for this town
    for (
      ubMineIndex = 0;
      ubMineIndex < Enum179.MAX_NUMBER_OF_MINES;
      ubMineIndex++
    ) {
      if (gMineLocation[ubMineIndex].bAssociatedTown == bTownId) {
        sMineSector =
          gMineLocation[ubMineIndex].sSectorX +
          gMineLocation[ubMineIndex].sSectorY * MAP_WORLD_X;
        break;
      }
    }

    // -1 returned if the town doesn't have a mine
    return sMineSector;
  }

  export function IsThereAMineInThisSector(sX: INT16, sY: INT16): boolean {
    let ubMineIndex: UINT8;

    // run through the list...if a mine here, great
    for (
      ubMineIndex = 0;
      ubMineIndex < Enum179.MAX_NUMBER_OF_MINES;
      ubMineIndex++
    ) {
      if (
        gMineLocation[ubMineIndex].sSectorX == sX &&
        gMineLocation[ubMineIndex].sSectorY == sY
      ) {
        return true;
      }
    }
    return false;
  }

  export function PlayerControlsMine(bMineIndex: INT8): boolean {
    // a value of TRUE is from the enemy's point of view
    if (
      StrategicMap[
        gMineLocation[bMineIndex].sSectorX +
          MAP_WORLD_X * gMineLocation[bMineIndex].sSectorY
      ].fEnemyControlled == true
    )
      return false;
    else {
      // player only controls the actual mine after he has made arrangements to do so with the head miner there
      if (gMineStatus[bMineIndex].fSpokeToHeadMiner) {
        return true;
      } else {
        return false;
      }
    }
  }

  export function SaveMineStatusToSaveGameFile(hFile: HWFILE): boolean {
    let uiNumBytesWritten: UINT32;
    let buffer: Buffer;

    // Save the MineStatus
    buffer = Buffer.allocUnsafe(
      MINE_STATUS_TYPE_SIZE * Enum179.MAX_NUMBER_OF_MINES,
    );
    for (let i = 0; i < Enum179.MAX_NUMBER_OF_MINES; i++) {
      writeMineStatusType(gMineStatus[i], buffer, i * MINE_STATUS_TYPE_SIZE);
    }

    uiNumBytesWritten = FileWrite(
      hFile,
      buffer,
      MINE_STATUS_TYPE_SIZE * Enum179.MAX_NUMBER_OF_MINES,
    );
    if (
      uiNumBytesWritten !=
      MINE_STATUS_TYPE_SIZE * Enum179.MAX_NUMBER_OF_MINES
    ) {
      return false;
    }

    return true;
  }

  export function LoadMineStatusFromSavedGameFile(hFile: HWFILE): boolean {
    let uiNumBytesRead: UINT32;
    let buffer: Buffer;

    // Load the MineStatus
    buffer = Buffer.allocUnsafe(
      MINE_STATUS_TYPE_SIZE * Enum179.MAX_NUMBER_OF_MINES,
    );
    uiNumBytesRead = FileRead(
      hFile,
      buffer,
      MINE_STATUS_TYPE_SIZE * Enum179.MAX_NUMBER_OF_MINES,
    );
    if (uiNumBytesRead != MINE_STATUS_TYPE_SIZE * Enum179.MAX_NUMBER_OF_MINES) {
      return false;
    }

    for (let i = 0; i < Enum179.MAX_NUMBER_OF_MINES; i++) {
      readMineStatusType(gMineStatus[i], buffer, i * MINE_STATUS_TYPE_SIZE);
    }

    return true;
  }

  export function ShutOffMineProduction(bMineIndex: INT8): void {
    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    if (!gMineStatus[bMineIndex].fShutDown) {
      gMineStatus[bMineIndex].fShutDown = true;
      AddHistoryToPlayersLog(
        Enum83.HISTORY_MINE_SHUTDOWN,
        gMineLocation[bMineIndex].bAssociatedTown,
        GetWorldTotalMin(),
        gMineLocation[bMineIndex].sSectorX,
        gMineLocation[bMineIndex].sSectorY,
      );
    }
  }

  export function RestartMineProduction(bMineIndex: INT8): void {
    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    if (!gMineStatus[bMineIndex].fShutDownIsPermanent) {
      if (gMineStatus[bMineIndex].fShutDown) {
        gMineStatus[bMineIndex].fShutDown = false;
        AddHistoryToPlayersLog(
          Enum83.HISTORY_MINE_REOPENED,
          gMineLocation[bMineIndex].bAssociatedTown,
          GetWorldTotalMin(),
          gMineLocation[bMineIndex].sSectorX,
          gMineLocation[bMineIndex].sSectorY,
        );
      }
    }
  }

  function MineShutdownIsPermanent(bMineIndex: INT8): void {
    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    gMineStatus[bMineIndex].fShutDownIsPermanent = true;
  }

  export function IsMineShutDown(bMineIndex: INT8): boolean {
    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    return gMineStatus[bMineIndex].fShutDown;
  }

  function GetHeadMinerIndexForMine(bMineIndex: INT8): UINT8 {
    let ubMinerIndex: UINT8 = 0;
    let usProfileId: UINT16 = 0;

    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    // loop through all head miners, checking which town they're associated with, looking for one that matches this mine
    for (
      ubMinerIndex = 0;
      ubMinerIndex < Enum180.NUM_HEAD_MINERS;
      ubMinerIndex++
    ) {
      usProfileId = gHeadMinerData[ubMinerIndex].usProfileId;

      if (
        gMercProfiles[usProfileId].bTown ==
        gMineLocation[bMineIndex].bAssociatedTown
      ) {
        return ubMinerIndex;
      }
    }

    // not found - yack!
    Assert(false);
    return 0;
  }

  function GetHeadMinerProfileIdForMine(bMineIndex: INT8): UINT16 {
    return gHeadMinerData[GetHeadMinerIndexForMine(bMineIndex)].usProfileId;
  }

  function IssueHeadMinerQuote(bMineIndex: INT8, ubQuoteType: UINT8): void {
    let ubHeadMinerIndex: UINT8 = 0;
    let usHeadMinerProfileId: UINT16 = 0;
    let bQuoteNum: INT8 = 0;
    let ubFaceIndex: UINT8 = 0;
    let fForceMapscreen: boolean = false;
    let sXPos: INT16;
    let sYPos: INT16;

    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);
    Assert(ubQuoteType < Enum183.NUM_HEAD_MINER_STRATEGIC_QUOTES);
    Assert(CheckFact(Enum170.FACT_MINERS_PLACED, 0));

    ubHeadMinerIndex = GetHeadMinerIndexForMine(bMineIndex);
    usHeadMinerProfileId = gHeadMinerData[ubHeadMinerIndex].usProfileId;

    // make sure the miner ain't dead
    if (gMercProfiles[usHeadMinerProfileId].bLife < OKLIFE) {
      // debug message
      ScreenMsg(
        MSG_FONT_RED,
        MSG_DEBUG,
        "Head Miner #%s can't talk (quote #%d)",
        gMercProfiles[usHeadMinerProfileId].zNickname,
        ubQuoteType,
      );
      return;
    }

    bQuoteNum = gHeadMinerData[ubHeadMinerIndex].bQuoteNum[ubQuoteType];
    Assert(bQuoteNum != -1);

    ubFaceIndex =
      uiExternalStaticNPCFaces[gHeadMinerData[ubHeadMinerIndex].ubExternalFace];

    // transition to mapscreen is not necessary for "creatures gone" quote - player is IN that mine, so he'll know
    if (ubQuoteType != Enum183.HEAD_MINER_STRATEGIC_QUOTE_CREATURES_GONE) {
      fForceMapscreen = true;
    }

    // decide where the miner's face and text box should be positioned in order to not obscure the mine he's in as it flashes
    switch (bMineIndex) {
      case Enum179.MINE_GRUMM:
        (sXPos = DEFAULT_EXTERN_PANEL_X_POS),
          (sYPos = DEFAULT_EXTERN_PANEL_Y_POS);
        break;
      case Enum179.MINE_CAMBRIA:
        (sXPos = DEFAULT_EXTERN_PANEL_X_POS),
          (sYPos = DEFAULT_EXTERN_PANEL_Y_POS);
        break;
      case Enum179.MINE_ALMA:
        (sXPos = DEFAULT_EXTERN_PANEL_X_POS),
          (sYPos = DEFAULT_EXTERN_PANEL_Y_POS);
        break;
      case Enum179.MINE_DRASSEN:
        (sXPos = DEFAULT_EXTERN_PANEL_X_POS), (sYPos = 135);
        break;
      case Enum179.MINE_CHITZENA:
        (sXPos = DEFAULT_EXTERN_PANEL_X_POS), (sYPos = 117);
        break;

      // there's no head miner in San Mona, this is an error!
      case Enum179.MINE_SAN_MONA:
      default:
        Assert(false);
        (sXPos = DEFAULT_EXTERN_PANEL_X_POS),
          (sYPos = DEFAULT_EXTERN_PANEL_Y_POS);
        break;
    }

    SetExternMapscreenSpeechPanelXY(sXPos, sYPos);

    // cause this quote to come up for this profile id and an indicator to flash over the mine sector
    HandleMinerEvent(
      gHeadMinerData[ubHeadMinerIndex].ubExternalFace,
      gMineLocation[bMineIndex].sSectorX,
      gMineLocation[bMineIndex].sSectorY,
      bQuoteNum,
      fForceMapscreen,
    );

    // stop time compression with any miner quote - these are important events.
    StopTimeCompression();
  }

  export function GetHeadMinersMineIndex(ubMinerProfileId: UINT8): UINT8 {
    let ubMineIndex: UINT8;

    // find which mine this guy represents
    for (
      ubMineIndex = 0;
      ubMineIndex < Enum179.MAX_NUMBER_OF_MINES;
      ubMineIndex++
    ) {
      if (
        gMineLocation[ubMineIndex].bAssociatedTown ==
        gMercProfiles[ubMinerProfileId].bTown
      ) {
        return ubMineIndex;
      }
    }

    // not found!  Illegal profile id receieved or something is very wrong
    Assert(false);
    return 0;
  }

  export function PlayerSpokeToHeadMiner(ubMinerProfileId: UINT8): void {
    let ubMineIndex: UINT8;

    ubMineIndex = GetHeadMinersMineIndex(ubMinerProfileId);

    // if this is our first time set a history fact
    if (gMineStatus[ubMineIndex].fSpokeToHeadMiner == false) {
      AddHistoryToPlayersLog(
        Enum83.HISTORY_TALKED_TO_MINER,
        gMineLocation[ubMineIndex].bAssociatedTown,
        GetWorldTotalMin(),
        gMineLocation[ubMineIndex].sSectorX,
        gMineLocation[ubMineIndex].sSectorY,
      );
      gMineStatus[ubMineIndex].fSpokeToHeadMiner = true;
    }
  }

  export function IsHisMineRunningOut(ubMinerProfileId: UINT8): boolean {
    let ubMineIndex: UINT8;

    ubMineIndex = GetHeadMinersMineIndex(ubMinerProfileId);
    return gMineStatus[ubMineIndex].fRunningOut;
  }

  export function IsHisMineEmpty(ubMinerProfileId: UINT8): boolean {
    let ubMineIndex: UINT8;

    ubMineIndex = GetHeadMinersMineIndex(ubMinerProfileId);
    return gMineStatus[ubMineIndex].fEmpty;
  }

  export function IsHisMineDisloyal(ubMinerProfileId: UINT8): boolean {
    let ubMineIndex: UINT8;

    ubMineIndex = GetHeadMinersMineIndex(ubMinerProfileId);

    if (
      gTownLoyalty[gMineLocation[ubMineIndex].bAssociatedTown].ubRating <
      LOW_MINE_LOYALTY_THRESHOLD
    ) {
      // pretty disloyal
      return true;
    } else {
      // pretty loyal
      return false;
    }
  }

  export function IsHisMineInfested(ubMinerProfileId: UINT8): boolean {
    let ubMineIndex: UINT8;

    ubMineIndex = GetHeadMinersMineIndex(ubMinerProfileId);
    return !MineClearOfMonsters(ubMineIndex);
  }

  export function IsHisMineLostAndRegained(ubMinerProfileId: UINT8): boolean {
    let ubMineIndex: UINT8;

    ubMineIndex = GetHeadMinersMineIndex(ubMinerProfileId);

    if (
      PlayerControlsMine(ubMineIndex) &&
      gMineStatus[ubMineIndex].fQueenRetookProducingMine
    ) {
      return true;
    } else {
      return false;
    }
  }

  export function ResetQueenRetookMine(ubMinerProfileId: UINT8): void {
    let ubMineIndex: UINT8;

    ubMineIndex = GetHeadMinersMineIndex(ubMinerProfileId);

    gMineStatus[ubMineIndex].fQueenRetookProducingMine = false;
  }

  export function IsHisMineAtMaxProduction(ubMinerProfileId: UINT8): boolean {
    let ubMineIndex: UINT8;

    ubMineIndex = GetHeadMinersMineIndex(ubMinerProfileId);

    if (GetAvailableWorkForceForMineForPlayer(ubMineIndex) == 100) {
      // loyalty is 100% and control is 100%
      return true;
    } else {
      // something not quite perfect yet
      return false;
    }
  }

  export function QueenHasRegainedMineSector(bMineIndex: INT8): void {
    Assert(bMineIndex >= 0 && bMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    if (gMineStatus[bMineIndex].fMineHasProducedForPlayer) {
      gMineStatus[bMineIndex].fQueenRetookProducingMine = true;
    }
  }

  export function HasAnyMineBeenAttackedByMonsters(): boolean {
    let ubMineIndex: UINT8;

    // find which mine this guy represents
    for (
      ubMineIndex = 0;
      ubMineIndex < Enum179.MAX_NUMBER_OF_MINES;
      ubMineIndex++
    ) {
      if (
        !MineClearOfMonsters(ubMineIndex) ||
        gMineStatus[ubMineIndex].fPrevInvadedByMonsters
      ) {
        return true;
      }
    }

    return false;
  }

  export function PlayerAttackedHeadMiner(ubMinerProfileId: UINT8): void {
    let ubMineIndex: UINT8;
    let bTownId: INT8;

    // get the index of his mine
    ubMineIndex = GetHeadMinersMineIndex(ubMinerProfileId);

    // if it's the first time he's been attacked
    if (gMineStatus[ubMineIndex].fAttackedHeadMiner == false) {
      // shut off production at his mine (Permanently!)
      ShutOffMineProduction(ubMineIndex);
      MineShutdownIsPermanent(ubMineIndex);

      // get the index of his town
      bTownId = GetTownAssociatedWithMine(ubMineIndex);
      // penalize associated town's loyalty
      DecrementTownLoyalty(bTownId, LOYALTY_PENALTY_HEAD_MINER_ATTACKED);

      // don't allow this more than once
      gMineStatus[ubMineIndex].fAttackedHeadMiner = true;
    }
  }

  export function HasHisMineBeenProducingForPlayerForSomeTime(
    ubMinerProfileId: UINT8,
  ): boolean {
    let ubMineIndex: UINT8;

    ubMineIndex = GetHeadMinersMineIndex(ubMinerProfileId);

    if (
      gMineStatus[ubMineIndex].fMineHasProducedForPlayer &&
      GetWorldTotalMin() -
        gMineStatus[ubMineIndex].uiTimePlayerProductionStarted >=
        24 * 60
    ) {
      return true;
    }

    return false;
  }

  // gte the id of the mine for this sector x,y,z...-1 is invalid
  export function GetIdOfMineForSector(
    sSectorX: INT16,
    sSectorY: INT16,
    bSectorZ: INT8,
  ): INT8 {
    let bMineIndex: INT8 = -1;
    let sSectorValue: INT16;

    // are we even on the right level?
    if (bSectorZ < 0 && bSectorZ > 2) {
      // nope
      return -1;
    }

    // now get the sectorvalue
    sSectorValue = SECTOR(sSectorX, sSectorY);

    // support surface
    if (bSectorZ == 0) {
      bMineIndex = GetMineIndexForSector(sSectorX, sSectorY);
    }
    // handle for first level
    else if (bSectorZ == 1) {
      switch (sSectorValue) {
        // grumm
        case Enum123.SEC_H3:
        case Enum123.SEC_I3:
          bMineIndex = Enum179.MINE_GRUMM;
          break;
        // cambria
        case Enum123.SEC_H8:
        case Enum123.SEC_H9:
          bMineIndex = Enum179.MINE_CAMBRIA;
          break;
        // alma
        case Enum123.SEC_I14:
        case Enum123.SEC_J14:
          bMineIndex = Enum179.MINE_ALMA;
          break;
        // drassen
        case Enum123.SEC_D13:
        case Enum123.SEC_E13:
          bMineIndex = Enum179.MINE_DRASSEN;
          break;
        // chitzena
        case Enum123.SEC_B2:
          bMineIndex = Enum179.MINE_CHITZENA;
          break;
        // san mona
        case Enum123.SEC_D4:
        case Enum123.SEC_D5:
          bMineIndex = Enum179.MINE_SAN_MONA;
          break;
      }
    } else {
      // level 2
      switch (sSectorValue) {
        case Enum123.SEC_I3:
        case Enum123.SEC_H3:
        case Enum123.SEC_H4:
          bMineIndex = Enum179.MINE_GRUMM;
          break;
      }
    }

    return bMineIndex;
  }

  // use this for miner (civilian) quotes when *underground* in a mine
  function PlayerForgotToTakeOverMine(ubMineIndex: UINT8): boolean {
    let pMineStatus: MINE_STATUS_TYPE;

    Assert(ubMineIndex >= 0 && ubMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    pMineStatus = gMineStatus[ubMineIndex];

    // mine surface sector is player controlled
    // mine not empty
    // player hasn't spoken to the head miner, but hasn't attacked him either
    // miner is alive
    if (
      StrategicMap[
        gMineLocation[ubMineIndex].sSectorX +
          MAP_WORLD_X * gMineLocation[ubMineIndex].sSectorY
      ].fEnemyControlled == false &&
      !pMineStatus.fEmpty &&
      !pMineStatus.fSpokeToHeadMiner &&
      !pMineStatus.fAttackedHeadMiner &&
      gMercProfiles[GetHeadMinerProfileIdForMine(ubMineIndex)].bLife > 0
    ) {
      return true;
    }

    return false;
  }

  // use this to determine whether or not to place miners into a underground mine level
  export function AreThereMinersInsideThisMine(ubMineIndex: UINT8): boolean {
    let pMineStatus: MINE_STATUS_TYPE;

    Assert(ubMineIndex >= 0 && ubMineIndex < Enum179.MAX_NUMBER_OF_MINES);

    pMineStatus = gMineStatus[ubMineIndex];

    // mine not empty
    // mine clear of any monsters
    // the "shutdown permanently" flag is only used for the player never receiving the income - miners will keep mining
    if (!pMineStatus.fEmpty && MineClearOfMonsters(ubMineIndex)) {
      return true;
    }

    return false;
  }

  // returns whether or not we've spoken to the head miner of a particular mine
  export function SpokenToHeadMiner(ubMineIndex: UINT8): boolean {
    return gMineStatus[ubMineIndex].fSpokeToHeadMiner;
  }
}
