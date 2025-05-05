namespace ja2 {
  const CAN_CALL = (s: SOLDIERTYPE) =>
    s.ubBodyType != Enum194.BLOODCAT &&
    s.ubBodyType != Enum194.LARVAE_MONSTER &&
    s.ubBodyType != Enum194.INFANT_MONSTER;
  const CAN_LISTEN_TO_CALL = (s: SOLDIERTYPE) =>
    s.ubBodyType != Enum194.BLOODCAT && s.ubBodyType != Enum194.LARVAE_MONSTER;

  const enum Enum294 {
    CALLER_FEMALE = 0,
    CALLER_MALE,
    CALLER_INFANT,
    CALLER_QUEEN,
    NUM_CREATURE_CALLERS,
  }

  const enum Enum295 {
    CREATURE_MOBILE = 0,
    CREATURE_CRAWLER,
    CREATURE_IMMOBILE,
  }

  const FRENZY_THRESHOLD = 8;
  const MAX_EAT_DIST = 5;

  let gbCallPriority: INT8[][] /* [NUM_CREATURE_CALLS][NUM_CREATURE_CALLERS] */ =
    [
      [0, 0, 0], // CALL_NONE
      [3, 5, 12], // CALL_1_PREY
      [5, 9, 12], // CALL_MULTIPLE_PREY
      [4, 7, 12], // CALL_ATTACKED
      [6, 9, 12], // CALL_CRIPPLED
    ];

  let gbHuntCallPriority: INT8[] /* [NUM_CREATURE_CALLS] */ = [
    4, // CALL_1_PREY
    5, // CALL_MULTIPLE_PREY
    7, // CALL_ATTACKED
    8, // CALL_CRIPPLED
  ];

  const PRIORITY_DECR_DISTANCE = 30;

  const CALL_1_OPPONENT = Enum288.CALL_1_PREY;
  const CALL_MULTIPLE_OPPONENT = Enum288.CALL_MULTIPLE_PREY;

  export function CreatureCall(pCaller: SOLDIERTYPE): void {
    let ubCallerType: UINT8 = 0;
    let ubReceiver: UINT8;
    let bFullPriority: INT8;
    let bPriority: INT8;
    let pReceiver: SOLDIERTYPE;
    let usDistToCaller: UINT16;
    // communicate call to all creatures on map through ultrasonics

    gTacticalStatus.Team[pCaller.bTeam].bAwareOfOpposition = true;
    // bAction should be AI_ACTION_CREATURE_CALL (new)
    // usActionData is call enum #
    switch (pCaller.ubBodyType) {
      case Enum194.ADULTFEMALEMONSTER:
      case Enum194.YAF_MONSTER:
        ubCallerType = Enum294.CALLER_FEMALE;
        break;
      case Enum194.QUEENMONSTER:
        ubCallerType = Enum294.CALLER_QUEEN;
        break;
      // need to add male
      case Enum194.AM_MONSTER:
      case Enum194.YAM_MONSTER:
        ubCallerType = Enum294.CALLER_MALE;
        break;
      default:
        ubCallerType = Enum294.CALLER_FEMALE;
        break;
    }
    if (pCaller.bHunting) {
      // which should only be set for females outside of the hive
      bFullPriority = gbHuntCallPriority[pCaller.usActionData];
    } else {
      bFullPriority = gbCallPriority[pCaller.usActionData][ubCallerType];
    }

    // OK, do animation based on body type...
    switch (pCaller.ubBodyType) {
      case Enum194.ADULTFEMALEMONSTER:
      case Enum194.YAF_MONSTER:
      case Enum194.AM_MONSTER:
      case Enum194.YAM_MONSTER:
        EVENT_InitNewSoldierAnim(pCaller, Enum193.MONSTER_UP, 0, false);
        break;

      case Enum194.QUEENMONSTER:
        EVENT_InitNewSoldierAnim(pCaller, Enum193.QUEEN_CALL, 0, false);
        break;
    }

    for (
      ubReceiver = gTacticalStatus.Team[pCaller.bTeam].bFirstID;
      ubReceiver <= gTacticalStatus.Team[pCaller.bTeam].bLastID;
      ubReceiver++
    ) {
      pReceiver = MercPtrs[ubReceiver];
      if (
        pReceiver.bActive &&
        pReceiver.bInSector &&
        pReceiver.bLife >= OKLIFE &&
        pReceiver != pCaller &&
        pReceiver.bAlertStatus < Enum243.STATUS_BLACK
      ) {
        if (
          pReceiver.ubBodyType != Enum194.LARVAE_MONSTER &&
          pReceiver.ubBodyType != Enum194.INFANT_MONSTER &&
          pReceiver.ubBodyType != Enum194.QUEENMONSTER
        ) {
          usDistToCaller = PythSpacesAway(pReceiver.sGridNo, pCaller.sGridNo);
          bPriority =
            bFullPriority - Math.trunc(usDistToCaller / PRIORITY_DECR_DISTANCE);
          if (bPriority > pReceiver.bCallPriority) {
            pReceiver.bCallPriority = bPriority;
            pReceiver.bAlertStatus = Enum243.STATUS_RED; // our status can't be more than red to begin with
            pReceiver.ubCaller = pCaller.ubID;
            pReceiver.sCallerGridNo = pCaller.sGridNo;
            pReceiver.bCallActedUpon = false;
            CancelAIAction(pReceiver, FORCE);
            if (
              bPriority > FRENZY_THRESHOLD &&
              (pReceiver.ubBodyType == Enum194.ADULTFEMALEMONSTER ||
                pReceiver.ubBodyType == Enum194.YAF_MONSTER)
            ) {
              // go berzerk!
              pReceiver.bFrenzied = true;
            }
          }
        }
      }
    }
  }

  function CreatureDecideActionGreen(pSoldier: SOLDIERTYPE): INT8 {
    let iChance: INT32;
    let iSneaky: INT32 = 10;
    // INT8		bInWater;
    let bInGas: boolean /* INT8 */;

    // bInWater = MercInWater(pSoldier);

    // NB creatures would ignore smoke completely :-)

    if (
      pSoldier.bMobility == Enum295.CREATURE_CRAWLER &&
      pSoldier.bActionPoints < pSoldier.bInitialActionPoints
    ) {
      return Enum289.AI_ACTION_NONE;
    }

    bInGas = InGas(pSoldier, pSoldier.sGridNo);

    if (pSoldier.bMobility == Enum295.CREATURE_MOBILE) {
      if (TrackScent(pSoldier)) {
        return Enum289.AI_ACTION_TRACK;
      }

      ////////////////////////////////////////////////////////////////////////////
      // POINT PATROL: move towards next point unless getting a bit winded
      ////////////////////////////////////////////////////////////////////////////

      // this takes priority over water/gas checks, so that point patrol WILL work
      // from island to island, and through gas covered areas, too
      if (pSoldier.bOrders == Enum241.POINTPATROL && pSoldier.bBreath >= 50) {
        if (PointPatrolAI(pSoldier)) {
          if (!gfTurnBasedAI) {
            // pause at the end of the walk!
            pSoldier.bNextAction = Enum289.AI_ACTION_WAIT;
            pSoldier.usNextActionData = REALTIME_CREATURE_AI_DELAY();
          }

          return Enum289.AI_ACTION_POINT_PATROL;
        }
      }

      if (pSoldier.bOrders == Enum241.RNDPTPATROL && pSoldier.bBreath >= 50) {
        if (RandomPointPatrolAI(pSoldier)) {
          if (!gfTurnBasedAI) {
            // pause at the end of the walk!
            pSoldier.bNextAction = Enum289.AI_ACTION_WAIT;
            pSoldier.usNextActionData = REALTIME_CREATURE_AI_DELAY();
          }

          return Enum289.AI_ACTION_POINT_PATROL;
        }
      }

      ////////////////////////////////////////////////////////////////////////////
      // WHEN LEFT IN WATER OR GAS, GO TO NEAREST REACHABLE SPOT OF UNGASSED LAND
      ////////////////////////////////////////////////////////////////////////////

      if (/*bInWater || */ bInGas) {
        pSoldier.usActionData = FindNearestUngassedLand(pSoldier);

        if (pSoldier.usActionData != NOWHERE) {
          return Enum289.AI_ACTION_LEAVE_WATER_GAS;
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////
    // REST IF RUNNING OUT OF BREATH
    ////////////////////////////////////////////////////////////////////////

    // if our breath is running a bit low, and we're not in the way or in water
    if (pSoldier.bBreath < 75 /*&& !bInWater*/) {
      // take a breather for gods sake!
      pSoldier.usActionData = NOWHERE;
      return Enum289.AI_ACTION_NONE;
    }

    ////////////////////////////////////////////////////////////////////////////
    // RANDOM PATROL:  determine % chance to start a new patrol route
    ////////////////////////////////////////////////////////////////////////////

    if (pSoldier.bMobility != Enum295.CREATURE_IMMOBILE) {
      iChance = 25;

      // set base chance according to orders
      switch (pSoldier.bOrders) {
        case Enum241.STATIONARY:
          iChance += -20;
          break;
        case Enum241.ONGUARD:
          iChance += -15;
          break;
        case Enum241.ONCALL:
          break;
        case Enum241.CLOSEPATROL:
          iChance += +15;
          break;
        case Enum241.RNDPTPATROL:
        case Enum241.POINTPATROL:
          iChance = 0;
          break;
        case Enum241.FARPATROL:
          iChance += +25;
          break;
        case Enum241.SEEKENEMY:
          iChance += -10;
          break;
      }

      // modify chance of patrol (and whether it's a sneaky one) by attitude
      switch (pSoldier.bAttitude) {
        case Enum242.DEFENSIVE:
          iChance += -10;
          break;
        case Enum242.BRAVESOLO:
          iChance += 5;
          break;
        case Enum242.BRAVEAID:
          break;
        case Enum242.CUNNINGSOLO:
          iChance += 5;
          iSneaky += 10;
          break;
        case Enum242.CUNNINGAID:
          iSneaky += 5;
          break;
        case Enum242.AGGRESSIVE:
          iChance += 10;
          iSneaky += -5;
          break;
      }

      // reduce chance for any injury, less likely to wander around when hurt
      iChance -= pSoldier.bLifeMax - pSoldier.bLife;

      // reduce chance if breath is down, less likely to wander around when tired
      iChance -= 100 - pSoldier.bBreath;

      // if we're in water with land miles (> 25 tiles) away,
      // OR if we roll under the chance calculated
      if (/*bInWater ||*/ PreRandom(100) < iChance) {
        pSoldier.usActionData = RandDestWithinRange(pSoldier);

        if (pSoldier.usActionData != NOWHERE) {
          if (!gfTurnBasedAI) {
            // pause at the end of the walk!
            pSoldier.bNextAction = Enum289.AI_ACTION_WAIT;
            pSoldier.usNextActionData = REALTIME_CREATURE_AI_DELAY();
            if (pSoldier.bMobility == Enum295.CREATURE_CRAWLER) {
              pSoldier.usNextActionData *= 2;
            }
          }

          return Enum289.AI_ACTION_RANDOM_PATROL;
        }
      }

      /*
    if (pSoldier->bMobility == CREATURE_MOBILE)
    {
            ////////////////////////////////////////////////////////////////////////////
            // SEEK FRIEND: determine %chance for man to pay a friendly visit
            ////////////////////////////////////////////////////////////////////////////
            iChance = 25;

            // set base chance and maximum seeking distance according to orders
            switch (pSoldier->bOrders)
            {
                    case STATIONARY:     iChance += -20; break;
                    case ONGUARD:        iChance += -15; break;
                    case ONCALL:                         break;
                    case CLOSEPATROL:    iChance += +10; break;
                    case RNDPTPATROL:
                    case POINTPATROL:    iChance  = -10; break;
                    case FARPATROL:      iChance += +20; break;
                    case SEEKENEMY:      iChance += -10; break;
            }

            // modify for attitude
            switch (pSoldier->bAttitude)
            {
                    case DEFENSIVE:                       break;
                    case BRAVESOLO:      iChance /= 2;    break;  // loners
                    case BRAVEAID:       iChance += 10;   break;  // friendly
                    case CUNNINGSOLO:    iChance /= 2;    break;  // loners
                    case CUNNINGAID:     iChance += 10;   break;  // friendly
                    case AGGRESSIVE:                      break;
            }

            // reduce chance for any injury, less likely to wander around when hurt
            iChance -= (pSoldier->bLifeMax - pSoldier->bLife);

            // reduce chance if breath is down
            iChance -= (100 - pSoldier->bBreath);         // very likely to wait when exhausted

            if ((INT16) PreRandom(100) < iChance)
            {
                    if (RandomFriendWithin(pSoldier))
                    {
    #ifdef DEBUGDECISIONS
                     sprintf(tempstr,"%s - SEEK FRIEND at grid %d",pSoldier->name,pSoldier->usActionData);
                     AIPopMessage(tempstr);
    #endif

                            if (!gfTurnBasedAI)
                            {
                                    // pause at the end of the walk!
                                    pSoldier->bNextAction = AI_ACTION_WAIT;
                                    pSoldier->usNextActionData = (UINT16) REALTIME_CREATURE_AI_DELAY;
                            }

                            return(AI_ACTION_SEEK_FRIEND);
                    }
            }
    }
    */

      ////////////////////////////////////////////////////////////////////////////
      // LOOK AROUND: determine %chance for man to turn in place
      ////////////////////////////////////////////////////////////////////////////

      // avoid 2 consecutive random turns in a row
      if (
        pSoldier.bLastAction != Enum289.AI_ACTION_CHANGE_FACING &&
        GetAPsToLook(pSoldier) <= pSoldier.bActionPoints
      ) {
        iChance = 25;

        // set base chance according to orders
        if (pSoldier.bOrders == Enum241.STATIONARY) iChance += 25;

        if (pSoldier.bOrders == Enum241.ONGUARD) iChance += 20;

        if (pSoldier.bAttitude == Enum242.DEFENSIVE) iChance += 25;

        if (PreRandom(100) < iChance) {
          // roll random directions (stored in actionData) until different from current
          do {
            // if man has a LEGAL dominant facing, and isn't facing it, he will turn
            // back towards that facing 50% of the time here (normally just enemies)
            if (
              pSoldier.bDominantDir >= 0 &&
              pSoldier.bDominantDir <= 8 &&
              pSoldier.bDirection != pSoldier.bDominantDir &&
              PreRandom(2)
            ) {
              pSoldier.usActionData = pSoldier.bDominantDir;
            } else {
              pSoldier.usActionData = PreRandom(8);
            }
          } while (pSoldier.usActionData == pSoldier.bDirection);

          if (ValidCreatureTurn(pSoldier, pSoldier.usActionData)) {
            // InternalIsValidStance( pSoldier, (INT8) pSoldier->usActionData, ANIM_STAND ) )
            if (!gfTurnBasedAI) {
              // pause at the end of the turn!
              pSoldier.bNextAction = Enum289.AI_ACTION_WAIT;
              pSoldier.usNextActionData = REALTIME_CREATURE_AI_DELAY();
            }

            return Enum289.AI_ACTION_CHANGE_FACING;
          }
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // NONE:
    ////////////////////////////////////////////////////////////////////////////

    // by default, if everything else fails, just stands in place without turning
    pSoldier.usActionData = NOWHERE;

    return Enum289.AI_ACTION_NONE;
  }

  function CreatureDecideActionYellow(pSoldier: SOLDIERTYPE): INT8 {
    // monster AI - heard something
    let ubNoiseDir: UINT8;
    let sNoiseGridNo: INT16;
    let iNoiseValue: INT32 = 0;
    let iChance: INT32;
    let iSneaky: INT32;
    let fClimb: boolean = false;
    let fReachable: boolean = false;
    //	INT16 sClosestFriend;

    if (
      pSoldier.bMobility == Enum295.CREATURE_CRAWLER &&
      pSoldier.bActionPoints < pSoldier.bInitialActionPoints
    ) {
      return Enum289.AI_ACTION_NONE;
    }

    // determine the most important noise heard, and its relative value
    sNoiseGridNo = MostImportantNoiseHeard(
      pSoldier,
      createPointer(
        () => iNoiseValue,
        (v) => (iNoiseValue = v),
      ),
      createPointer(
        () => fClimb,
        (v) => (fClimb = v),
      ),
      createPointer(
        () => fReachable,
        (v) => (fReachable = v),
      ),
    );
    // NumMessage("iNoiseValue = ",iNoiseValue);

    if (sNoiseGridNo == NOWHERE) {
      // then we have no business being under YELLOW status any more!

      return Enum289.AI_ACTION_NONE;
    }

    ////////////////////////////////////////////////////////////////////////////
    // LOOK AROUND TOWARD NOISE: determine %chance for man to turn towards noise
    ////////////////////////////////////////////////////////////////////////////

    if (pSoldier.bMobility != Enum295.CREATURE_IMMOBILE) {
      // determine direction from this soldier in which the noise lies
      ubNoiseDir = atan8(
        CenterX(pSoldier.sGridNo),
        CenterY(pSoldier.sGridNo),
        CenterX(sNoiseGridNo),
        CenterY(sNoiseGridNo),
      );

      // if soldier is not already facing in that direction,
      // and the noise source is close enough that it could possibly be seen
      if (
        GetAPsToLook(pSoldier) <= pSoldier.bActionPoints &&
        pSoldier.bDirection != ubNoiseDir &&
        PythSpacesAway(pSoldier.sGridNo, sNoiseGridNo) <= STRAIGHT
      ) {
        // set base chance according to orders
        if (
          pSoldier.bOrders == Enum241.STATIONARY ||
          pSoldier.bOrders == Enum241.ONGUARD
        )
          iChance = 60; // all other orders
        else iChance = 35;

        if (pSoldier.bAttitude == Enum242.DEFENSIVE) iChance += 15;

        if (PreRandom(100) < iChance) {
          pSoldier.usActionData = ubNoiseDir;
          // if ( InternalIsValidStance( pSoldier, (INT8) pSoldier->usActionData, ANIM_STAND ) )
          if (ValidCreatureTurn(pSoldier, pSoldier.usActionData)) {
            return Enum289.AI_ACTION_CHANGE_FACING;
          }
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////
    // REST IF RUNNING OUT OF BREATH
    ////////////////////////////////////////////////////////////////////////

    // if our breath is running a bit low, and we're not in water
    if (pSoldier.bBreath < 25 /*&& !MercInWater(pSoldier) */) {
      // take a breather for gods sake!
      pSoldier.usActionData = NOWHERE;
      return Enum289.AI_ACTION_NONE;
    }

    if (pSoldier.bMobility != Enum295.CREATURE_IMMOBILE && fReachable) {
      ////////////////////////////////////////////////////////////////////////////
      // SEEK NOISE
      ////////////////////////////////////////////////////////////////////////////

      // remember that noise value is negative, and closer to 0 => more important!
      iChance = 75 + iNoiseValue;
      iSneaky = 30;

      // set base chance according to orders
      switch (pSoldier.bOrders) {
        case Enum241.STATIONARY:
          iChance += -20;
          break;
        case Enum241.ONGUARD:
          iChance += -15;
          break;
        case Enum241.ONCALL:
          break;
        case Enum241.CLOSEPATROL:
          iChance += -10;
          break;
        case Enum241.RNDPTPATROL:
        case Enum241.POINTPATROL:
          break;
        case Enum241.FARPATROL:
          iChance += 10;
          break;
        case Enum241.SEEKENEMY:
          iChance += 25;
          break;
      }

      // modify chance of patrol (and whether it's a sneaky one) by attitude
      switch (pSoldier.bAttitude) {
        case Enum242.DEFENSIVE:
          iChance += -10;
          iSneaky += 15;
          break;
        case Enum242.BRAVESOLO:
          iChance += 10;
          break;
        case Enum242.BRAVEAID:
          iChance += 5;
          break;
        case Enum242.CUNNINGSOLO:
          iChance += 5;
          iSneaky += 30;
          break;
        case Enum242.CUNNINGAID:
          iSneaky += 30;
          break;
        case Enum242.AGGRESSIVE:
          iChance += 20;
          iSneaky += -10;
          break;
      }

      // reduce chance if breath is down, less likely to wander around when tired
      iChance -= 100 - pSoldier.bBreath;

      if (PreRandom(100) < iChance) {
        pSoldier.usActionData = GoAsFarAsPossibleTowards(
          pSoldier,
          sNoiseGridNo,
          Enum289.AI_ACTION_SEEK_NOISE,
        );

        if (pSoldier.usActionData != NOWHERE) {
          return Enum289.AI_ACTION_SEEK_NOISE;
        }
      }
      // Okay, we're not following up on the noise... but let's follow any
      // scent trails available
      if (TrackScent(pSoldier)) {
        return Enum289.AI_ACTION_TRACK;
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // DO NOTHING: Not enough points left to move, so save them for next turn
    ////////////////////////////////////////////////////////////////////////////

    // by default, if everything else fails, just stands in place without turning
    pSoldier.usActionData = NOWHERE;
    return Enum289.AI_ACTION_NONE;
  }

  function CreatureDecideActionRed(
    pSoldier: SOLDIERTYPE,
    ubUnconsciousOK: UINT8,
  ): INT8 {
    // monster AI - hostile mammals somewhere around!
    let iChance: INT16;
    let sClosestOpponent: INT16;
    let sClosestDisturbance: INT16;
    let sDistVisible: INT16;
    let ubCanMove: boolean /* UINT8 */;
    let ubOpponentDir: UINT8;
    // INT8 bInWater;
    let bInGas: boolean /* INT8 */;
    let bSeekPts: INT8 = 0;
    let bHelpPts: INT8 = 0;
    let bHidePts: INT8 = 0;
    let sAdjustedGridNo: INT16;
    let fChangeLevel: boolean = false;

    // if we have absolutely no action points, we can't do a thing under RED!
    if (!pSoldier.bActionPoints) {
      pSoldier.usActionData = NOWHERE;
      return Enum289.AI_ACTION_NONE;
    }

    if (
      pSoldier.bMobility == Enum295.CREATURE_CRAWLER &&
      pSoldier.bActionPoints < pSoldier.bInitialActionPoints
    ) {
      return Enum289.AI_ACTION_NONE;
    }

    // can this guy move to any of the neighbouring squares ? (sets TRUE/FALSE)
    ubCanMove =
      pSoldier.bMobility != Enum295.CREATURE_IMMOBILE &&
      pSoldier.bActionPoints >= MinPtsToMove(pSoldier);

    // determine if we happen to be in water (in which case we're in BIG trouble!)
    // bInWater = MercInWater(pSoldier);

    // check if standing in tear gas without a gas mask on
    bInGas = InGas(pSoldier, pSoldier.sGridNo);

    ////////////////////////////////////////////////////////////////////////////
    // WHEN IN GAS, GO TO NEAREST REACHABLE SPOT OF UNGASSED LAND
    ////////////////////////////////////////////////////////////////////////////

    if (bInGas && ubCanMove) {
      pSoldier.usActionData = FindNearestUngassedLand(pSoldier);

      if (pSoldier.usActionData != NOWHERE) {
        return Enum289.AI_ACTION_LEAVE_WATER_GAS;
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // CALL FOR AID IF HURT
    ////////////////////////////////////////////////////////////////////////////
    if (CAN_CALL(pSoldier)) {
      if (
        pSoldier.bActionPoints >= AP_RADIO &&
        gTacticalStatus.Team[pSoldier.bTeam].bMenInSector > 1
      ) {
        if (pSoldier.bLife < pSoldier.bOldLife) {
          // got injured, maybe call
          if (
            pSoldier.bOldLife == pSoldier.bLifeMax &&
            pSoldier.bOldLife - pSoldier.bLife > 10
          ) {
            // hurt for first time!
            pSoldier.usActionData = Enum288.CALL_CRIPPLED;
            pSoldier.bOldLife = pSoldier.bLife; // don't want to call more than once
            return Enum289.AI_ACTION_CREATURE_CALL;
          } else if (Math.trunc(pSoldier.bLifeMax / pSoldier.bLife) > 2) {
            // crippled, 1/3 or less health!
            pSoldier.usActionData = Enum288.CALL_ATTACKED;
            pSoldier.bOldLife = pSoldier.bLife; // don't want to call more than once
            return Enum289.AI_ACTION_CREATURE_CALL;
          }
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////
    // CROUCH & REST IF RUNNING OUT OF BREATH
    ////////////////////////////////////////////////////////////////////////

    // if our breath is running a bit low, and we're not in water or under fire
    if (pSoldier.bBreath < 25 /*&& !bInWater*/ && !pSoldier.bUnderFire) {
      pSoldier.usActionData = NOWHERE;
      return Enum289.AI_ACTION_NONE;
    }

    ////////////////////////////////////////////////////////////////////////////
    // CALL IN SIGHTING: determine %chance to call others and report contact
    ////////////////////////////////////////////////////////////////////////////

    // if we're a computer merc, and we have the action points remaining to RADIO
    // (we never want NPCs to choose to radio if they would have to wait a turn)
    if (
      CAN_CALL(pSoldier) &&
      !gTacticalStatus.Team[pSoldier.bTeam].bAwareOfOpposition
    ) {
      if (
        pSoldier.bActionPoints >= AP_RADIO &&
        gTacticalStatus.Team[pSoldier.bTeam].bMenInSector > 1
      ) {
        // if there hasn't been a general sighting call sent yet

        // might want to check the specifics of who we see
        iChance = 20;

        if (iChance) {
          if (PreRandom(100) < iChance) {
            pSoldier.usActionData = Enum288.CALL_1_PREY;
            return Enum289.AI_ACTION_CREATURE_CALL;
          }
        }
      }
    }

    if (pSoldier.bMobility != Enum295.CREATURE_IMMOBILE) {
      if (FindAIUsableObjClass(pSoldier, IC_WEAPON) == ITEM_NOT_FOUND) {
        // probably a baby bug... run away! run away!
        // look for best place to RUN AWAY to (farthest from the closest threat)
        pSoldier.usActionData = FindSpotMaxDistFromOpponents(pSoldier);

        if (pSoldier.usActionData != NOWHERE) {
          return Enum289.AI_ACTION_RUN_AWAY;
        } else {
          return Enum289.AI_ACTION_NONE;
        }
      }

      // Respond to call if any
      if (CAN_LISTEN_TO_CALL(pSoldier) && pSoldier.ubCaller != NOBODY) {
        if (
          PythSpacesAway(pSoldier.sGridNo, pSoldier.sCallerGridNo) <=
          STOPSHORTDIST
        ) {
          // call completed... hmm, nothing found
          pSoldier.ubCaller = NOBODY;
        } else {
          pSoldier.usActionData = InternalGoAsFarAsPossibleTowards(
            pSoldier,
            pSoldier.sCallerGridNo,
            -1,
            Enum289.AI_ACTION_SEEK_FRIEND,
            FLAG_STOPSHORT,
          );

          if (pSoldier.usActionData != NOWHERE) {
            return Enum289.AI_ACTION_SEEK_FRIEND;
          }
        }
      }

      // get the location of the closest reachable opponent
      sClosestDisturbance = ClosestReachableDisturbance(
        pSoldier,
        ubUnconsciousOK,
        createPointer(
          () => fChangeLevel,
          (v) => (fChangeLevel = v),
        ),
      );
      // if there is an opponent reachable
      if (sClosestDisturbance != NOWHERE) {
        //////////////////////////////////////////////////////////////////////
        // SEEK CLOSEST DISTURBANCE: GO DIRECTLY TOWARDS CLOSEST KNOWN OPPONENT
        //////////////////////////////////////////////////////////////////////

        // try to move towards him
        pSoldier.usActionData = GoAsFarAsPossibleTowards(
          pSoldier,
          sClosestDisturbance,
          Enum289.AI_ACTION_SEEK_OPPONENT,
        );

        // if it's possible
        if (pSoldier.usActionData != NOWHERE) {
          return Enum289.AI_ACTION_SEEK_OPPONENT;
        }
      }

      ////////////////////////////////////////////////////////////////////////////
      // TAKE A BITE, PERHAPS
      ////////////////////////////////////////////////////////////////////////////
      if (pSoldier.bHunting) {
        pSoldier.usActionData = FindNearestRottingCorpse(pSoldier);
        // need smell/visibility check?
        if (
          PythSpacesAway(pSoldier.sGridNo, pSoldier.usActionData) < MAX_EAT_DIST
        ) {
          let sGridNo: INT16;

          sGridNo = FindAdjacentGridEx(
            pSoldier,
            pSoldier.usActionData,
            createPointer(
              () => ubOpponentDir,
              (v) => (ubOpponentDir = v),
            ),
            createPointer(
              () => sAdjustedGridNo,
              (v) => (sAdjustedGridNo = v),
            ),
            false,
            false,
          );

          if (sGridNo != -1) {
            pSoldier.usActionData = sGridNo;
            return Enum289.AI_ACTION_APPROACH_MERC;
          }
        }
      }

      ////////////////////////////////////////////////////////////////////////////
      // TRACK A SCENT, IF ONE IS PRESENT
      ////////////////////////////////////////////////////////////////////////////
      if (TrackScent(pSoldier)) {
        return Enum289.AI_ACTION_TRACK;
      }

      ////////////////////////////////////////////////////////////////////////////
      // LOOK AROUND TOWARD CLOSEST KNOWN OPPONENT, IF KNOWN
      ////////////////////////////////////////////////////////////////////////////
      if (GetAPsToLook(pSoldier) <= pSoldier.bActionPoints) {
        // determine the location of the known closest opponent
        // (don't care if he's conscious, don't care if he's reachable at all)
        sClosestOpponent = ClosestKnownOpponent(pSoldier, null, null);

        if (sClosestOpponent != NOWHERE) {
          // determine direction from this soldier to the closest opponent
          ubOpponentDir = atan8(
            CenterX(pSoldier.sGridNo),
            CenterY(pSoldier.sGridNo),
            CenterX(sClosestOpponent),
            CenterY(sClosestOpponent),
          );

          // if soldier is not already facing in that direction,
          // and the opponent is close enough that he could possibly be seen
          // note, have to change this to use the level returned from ClosestKnownOpponent
          sDistVisible = DistanceVisible(
            pSoldier,
            Enum245.DIRECTION_IRRELEVANT,
            Enum245.DIRECTION_IRRELEVANT,
            sClosestOpponent,
            0,
          );

          if (
            pSoldier.bDirection != ubOpponentDir &&
            PythSpacesAway(pSoldier.sGridNo, sClosestOpponent) <= sDistVisible
          ) {
            // set base chance according to orders
            if (
              pSoldier.bOrders == Enum241.STATIONARY ||
              pSoldier.bOrders == Enum241.ONGUARD
            )
              iChance = 50; // all other orders
            else iChance = 25;

            if (pSoldier.bAttitude == Enum242.DEFENSIVE) iChance += 25;

            // if ( (INT16)PreRandom(100) < iChance && InternalIsValidStance( pSoldier, ubOpponentDir, ANIM_STAND ) )
            if (
              PreRandom(100) < iChance &&
              ValidCreatureTurn(pSoldier, ubOpponentDir)
            ) {
              pSoldier.usActionData = ubOpponentDir;

              return Enum289.AI_ACTION_CHANGE_FACING;
            }
          }
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // LEAVE THE SECTOR
    ////////////////////////////////////////////////////////////////////////////

    // NOT IMPLEMENTED

    ////////////////////////////////////////////////////////////////////////////
    // DO NOTHING: Not enough points left to move, so save them for next turn
    ////////////////////////////////////////////////////////////////////////////

    pSoldier.usActionData = NOWHERE;

    return Enum289.AI_ACTION_NONE;
  }

  function CreatureDecideActionBlack(pSoldier: SOLDIERTYPE): INT8 {
    // monster AI - hostile mammals in sense range
    let sClosestOpponent: INT16;
    let sBestCover: INT16 = NOWHERE;
    let sClosestDisturbance: INT16;
    let ubMinAPCost: UINT8;
    let ubCanMove: boolean /* UINT8 */;
    let bInGas: boolean /* UINT8 */;
    let bDirection: INT8;
    let ubBestAttackAction: UINT8;
    let bCanAttack: INT8;
    let bSpitIn: INT8;
    let bWeaponIn: INT8;
    let uiChance: UINT32;
    let BestShot: ATTACKTYPE = createAttackType();
    let BestStab: ATTACKTYPE = createAttackType();
    let BestAttack: ATTACKTYPE = createAttackType();
    let CurrStab: ATTACKTYPE = createAttackType();
    let fRunAway: boolean = false;
    let fChangeLevel: boolean;

    // if we have absolutely no action points, we can't do a thing under BLACK!
    if (!pSoldier.bActionPoints) {
      pSoldier.usActionData = NOWHERE;
      return Enum289.AI_ACTION_NONE;
    }

    if (
      pSoldier.bMobility == Enum295.CREATURE_CRAWLER &&
      pSoldier.bActionPoints < pSoldier.bInitialActionPoints
    ) {
      return Enum289.AI_ACTION_NONE;
    }

    ////////////////////////////////////////////////////////////////////////////
    // CALL FOR AID IF HURT OR IF OTHERS ARE UNAWARE
    ////////////////////////////////////////////////////////////////////////////

    if (CAN_CALL(pSoldier)) {
      if (
        pSoldier.bActionPoints >= AP_RADIO &&
        gTacticalStatus.Team[pSoldier.bTeam].bMenInSector > 1
      ) {
        if (pSoldier.bLife < pSoldier.bOldLife) {
          // got injured, maybe call
          /*
        // don't call when crippled and have target... save breath for attacking!
        if ((pSoldier->bOldLife == pSoldier->bLifeMax) && (pSoldier->bOldLife - pSoldier->bLife > 10))
        {
                // hurt for first time!
                pSoldier->usActionData = CALL_CRIPPLED;
                pSoldier->bOldLife = pSoldier->bLife;  // don't want to call more than once
                return(AI_ACTION_CREATURE_CALL);
        }
        else
        */
          if (Math.trunc(pSoldier.bLifeMax / pSoldier.bLife) > 2) {
            // crippled, 1/3 or less health!
            pSoldier.usActionData = Enum288.CALL_ATTACKED;
            pSoldier.bOldLife = pSoldier.bLife; // don't want to call more than once
            return Enum289.AI_ACTION_CREATURE_CALL;
          }
        } else {
          if (!gTacticalStatus.Team[pSoldier.bTeam].bAwareOfOpposition) {
            if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
              uiChance = 100;
            } else {
              uiChance = 20 * pSoldier.bOppCnt;
            }
            if (Random(100) < uiChance) {
              // alert! alert!
              if (pSoldier.bOppCnt > 1) {
                pSoldier.usActionData = Enum288.CALL_MULTIPLE_PREY;
              } else {
                pSoldier.usActionData = Enum288.CALL_1_PREY;
              }
              return Enum289.AI_ACTION_CREATURE_CALL;
            }
          }
        }
      }
    }

    // can this guy move to any of the neighbouring squares ? (sets TRUE/FALSE)
    ubCanMove =
      pSoldier.bMobility != Enum295.CREATURE_IMMOBILE &&
      pSoldier.bActionPoints >= MinPtsToMove(pSoldier);

    // determine if we happen to be in water (in which case we're in BIG trouble!)
    // bInWater = MercInWater(pSoldier);

    // check if standing in tear gas without a gas mask on
    bInGas = InGas(pSoldier, pSoldier.sGridNo);

    ////////////////////////////////////////////////////////////////////////////
    // IF GASSED, OR REALLY TIRED (ON THE VERGE OF COLLAPSING), TRY TO RUN AWAY
    ////////////////////////////////////////////////////////////////////////////

    // if we're desperately short on breath (it's OK if we're in water, though!)
    if (bInGas || pSoldier.bBreath < 5) {
      // if soldier has enough APs left to move at least 1 square's worth
      if (ubCanMove) {
        // look for best place to RUN AWAY to (farthest from the closest threat)
        pSoldier.usActionData = FindSpotMaxDistFromOpponents(pSoldier);

        if (pSoldier.usActionData != NOWHERE) {
          return Enum289.AI_ACTION_RUN_AWAY;
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // STUCK IN WATER OR GAS, NO COVER, GO TO NEAREST SPOT OF UNGASSED LAND
    ////////////////////////////////////////////////////////////////////////////

    // if soldier in water/gas has enough APs left to move at least 1 square
    if (/*bInWater ||*/ bInGas && ubCanMove) {
      pSoldier.usActionData = FindNearestUngassedLand(pSoldier);

      if (pSoldier.usActionData != NOWHERE) {
        return Enum289.AI_ACTION_LEAVE_WATER_GAS;
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // SOLDIER CAN ATTACK IF NOT IN WATER/GAS AND NOT DOING SOMETHING TOO FUNKY
    ////////////////////////////////////////////////////////////////////////////

    // NPCs in water/tear gas without masks are not permitted to shoot/stab/throw
    if (pSoldier.bActionPoints < 2 /*|| bInWater*/ || bInGas) {
      bCanAttack = 0;
    } else {
      bCanAttack = CanNPCAttack(pSoldier);
      if (bCanAttack != 1) {
        if (bCanAttack == NOSHOOT_NOAMMO) {
          pSoldier.inv[Enum261.HANDPOS].fFlags |= OBJECT_AI_UNUSABLE;

          // try to find a bladed weapon
          if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
            bWeaponIn = FindObjClass(pSoldier, IC_TENTACLES);
          } else {
            bWeaponIn = FindObjClass(pSoldier, IC_BLADE);
          }

          if (bWeaponIn != NO_SLOT) {
            RearrangePocket(pSoldier, Enum261.HANDPOS, bWeaponIn, FOREVER);
            bCanAttack = 1;
          } else {
            // infants who exhaust their spit should flee!
            fRunAway = true;
            bCanAttack = 0;
          }
        } else {
          bCanAttack = 0;
        }
      }
    }

    BestShot.ubPossible = false; // by default, assume Shooting isn't possible
    BestStab.ubPossible = false; // by default, assume Stabbing isn't possible

    BestAttack.ubChanceToReallyHit = 0;

    bSpitIn = NO_SLOT;

    // if we are able attack
    if (bCanAttack) {
      //////////////////////////////////////////////////////////////////////////
      // FIRE A GUN AT AN OPPONENT
      //////////////////////////////////////////////////////////////////////////

      pSoldier.bAimShotLocation = AIM_SHOT_RANDOM;

      bWeaponIn = FindObjClass(pSoldier, IC_GUN);

      if (bWeaponIn != NO_SLOT) {
        if (
          Item[pSoldier.inv[bWeaponIn].usItem].usItemClass == IC_GUN &&
          pSoldier.inv[bWeaponIn].bGunStatus >= USABLE
        ) {
          if (pSoldier.inv[bWeaponIn].ubGunShotsLeft > 0) {
            bSpitIn = bWeaponIn;
            // if it's in another pocket, swap it into his hand temporarily
            if (bWeaponIn != Enum261.HANDPOS) {
              RearrangePocket(
                pSoldier,
                Enum261.HANDPOS,
                bWeaponIn,
                TEMPORARILY,
              );
            }

            // now it better be a gun, or the guy can't shoot (but has other attack(s))

            // get the minimum cost to attack the same target with this gun
            ubMinAPCost = MinAPsToAttack(
              pSoldier,
              pSoldier.sLastTarget,
              DONTADDTURNCOST,
            );

            // if we have enough action points to shoot with this gun
            if (pSoldier.bActionPoints >= ubMinAPCost) {
              // look around for a worthy target (which sets BestShot.ubPossible)
              CalcBestShot(pSoldier, BestShot);

              if (BestShot.ubPossible) {
                BestShot.bWeaponIn = bWeaponIn;

                // if the selected opponent is not a threat (unconscious & !serviced)
                // (usually, this means all the guys we see our unconscious, but, on
                //  rare occasions, we may not be able to shoot a healthy guy, too)
                if (
                  Menptr[BestShot.ubOpponent].bLife < OKLIFE &&
                  !Menptr[BestShot.ubOpponent].bService
                ) {
                  // if our attitude is NOT aggressive
                  if (pSoldier.bAttitude != Enum242.AGGRESSIVE) {
                    // get the location of the closest CONSCIOUS reachable opponent
                    sClosestDisturbance = ClosestReachableDisturbance(
                      pSoldier,
                      0,
                      createPointer(
                        () => fChangeLevel,
                        (v) => (fChangeLevel = v),
                      ),
                    );

                    // if we found one
                    if (sClosestDisturbance != NOWHERE) {
                      // don't bother checking GRENADES/KNIVES, he can't have conscious targets
                      // then make decision as if at alert status RED, but make sure
                      // we don't try to SEEK OPPONENT the unconscious guy!
                      return DecideActionRed(pSoldier, 0);
                    }
                    // else kill the guy, he could be the last opponent alive in this sector
                  }
                  // else aggressive guys will ALWAYS finish off unconscious opponents
                }

                // now we KNOW FOR SURE that we will do something (shoot, at least)
                NPCDoesAct(pSoldier);
              }
            }
            // if it was in his holster, swap it back into his holster for now
            if (bWeaponIn != Enum261.HANDPOS) {
              RearrangePocket(
                pSoldier,
                Enum261.HANDPOS,
                bWeaponIn,
                TEMPORARILY,
              );
            }
          } else {
            // out of ammo! reload if possible!
          }
        }
      }

      //////////////////////////////////////////////////////////////////////////
      // GO STAB AN OPPONENT WITH A KNIFE
      //////////////////////////////////////////////////////////////////////////

      // if soldier has a knife in his hand
      if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
        bWeaponIn = FindObjClass(pSoldier, IC_TENTACLES);
      } else if (pSoldier.ubBodyType == Enum194.BLOODCAT) {
        // 1 in 3 attack with teeth, otherwise with claws
        if (PreRandom(3)) {
          bWeaponIn = FindObj(pSoldier, Enum225.BLOODCAT_CLAW_ATTACK);
        } else {
          bWeaponIn = FindObj(pSoldier, Enum225.BLOODCAT_BITE);
        }
      } else {
        if (bSpitIn != NO_SLOT && Random(4)) {
          // spitters only consider a blade attack 1 time in 4
          bWeaponIn = NO_SLOT;
        } else {
          bWeaponIn = FindObjClass(pSoldier, IC_BLADE);
        }
      }

      BestStab.iAttackValue = 0;

      // if the soldier does have a usable knife somewhere

      // spitters don't always consider using their claws
      if (bWeaponIn != NO_SLOT) {
        // if it's in his holster, swap it into his hand temporarily
        if (bWeaponIn != Enum261.HANDPOS) {
          RearrangePocket(pSoldier, Enum261.HANDPOS, bWeaponIn, TEMPORARILY);
        }

        // get the minimum cost to attack with this knife
        ubMinAPCost = MinAPsToAttack(
          pSoldier,
          pSoldier.sLastTarget,
          DONTADDTURNCOST,
        );

        // sprintf(tempstr,"%s - ubMinAPCost = %d",pSoldier->name,ubMinAPCost);
        // PopMessage(tempstr);

        // if we can afford the minimum AP cost to stab with this knife weapon
        if (pSoldier.bActionPoints >= ubMinAPCost) {
          // then look around for a worthy target (which sets BestStab.ubPossible)

          if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
            CalcTentacleAttack(pSoldier, CurrStab);
          } else {
            CalcBestStab(pSoldier, CurrStab, true);
          }

          if (CurrStab.ubPossible) {
            // now we KNOW FOR SURE that we will do something (stab, at least)
            NPCDoesAct(pSoldier);
          }

          // if it was in his holster, swap it back into his holster for now
          if (bWeaponIn != Enum261.HANDPOS) {
            RearrangePocket(pSoldier, Enum261.HANDPOS, bWeaponIn, TEMPORARILY);
          }

          if (CurrStab.iAttackValue > BestStab.iAttackValue) {
            CurrStab.bWeaponIn = bWeaponIn;
            copyAttackType(BestStab, CurrStab);
          }
        }
      }

      //////////////////////////////////////////////////////////////////////////
      // CHOOSE THE BEST TYPE OF ATTACK OUT OF THOSE FOUND TO BE POSSIBLE
      //////////////////////////////////////////////////////////////////////////
      if (BestShot.ubPossible) {
        BestAttack.iAttackValue = BestShot.iAttackValue;
        ubBestAttackAction = Enum289.AI_ACTION_FIRE_GUN;
      } else {
        BestAttack.iAttackValue = 0;
        ubBestAttackAction = Enum289.AI_ACTION_NONE;
      }
      if (
        BestStab.ubPossible &&
        BestStab.iAttackValue > Math.trunc((BestAttack.iAttackValue * 12) / 10)
      ) {
        BestAttack.iAttackValue = BestStab.iAttackValue;
        ubBestAttackAction = Enum289.AI_ACTION_KNIFE_MOVE;
      }

      // if attack is still desirable (meaning it's also preferred to taking cover)
      if (ubBestAttackAction != Enum289.AI_ACTION_NONE) {
        // copy the information on the best action selected into BestAttack struct
        switch (ubBestAttackAction) {
          case Enum289.AI_ACTION_FIRE_GUN:
            copyAttackType(BestAttack, BestShot);
            break;

          case Enum289.AI_ACTION_KNIFE_MOVE:
            copyAttackType(BestAttack, BestStab);
            break;
        }

        // if necessary, swap the weapon into the hand position
        if (BestAttack.bWeaponIn != Enum261.HANDPOS) {
          // IS THIS NOT BEING SET RIGHT?????
          RearrangePocket(
            pSoldier,
            Enum261.HANDPOS,
            BestAttack.bWeaponIn,
            FOREVER,
          );
        }

        //////////////////////////////////////////////////////////////////////////
        // GO AHEAD & ATTACK!
        //////////////////////////////////////////////////////////////////////////

        pSoldier.usActionData = BestAttack.sTarget;
        pSoldier.bAimTime = BestAttack.ubAimTime;

        if (
          ubBestAttackAction == Enum289.AI_ACTION_FIRE_GUN &&
          BestAttack.ubChanceToReallyHit > 50
        ) {
          pSoldier.bAimShotLocation = AIM_SHOT_HEAD;
        } else {
          pSoldier.bAimShotLocation = AIM_SHOT_RANDOM;
        }

        return ubBestAttackAction;
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // CLOSE ON THE CLOSEST KNOWN OPPONENT or TURN TO FACE HIM
    ////////////////////////////////////////////////////////////////////////////

    if (!fRunAway) {
      if (GetAPsToLook(pSoldier) <= pSoldier.bActionPoints) {
        // determine the location of the known closest opponent
        // (don't care if he's conscious, don't care if he's reachable at all)
        sClosestOpponent = ClosestKnownOpponent(pSoldier, null, null);
        // if we have a closest reachable opponent
        if (sClosestOpponent != NOWHERE) {
          if (
            ubCanMove &&
            PythSpacesAway(pSoldier.sGridNo, sClosestOpponent) > 2
          ) {
            if (bSpitIn != NO_SLOT) {
              pSoldier.usActionData = AdvanceToFiringRange(
                pSoldier,
                sClosestOpponent,
              );
              if (pSoldier.usActionData == NOWHERE) {
                pSoldier.usActionData = GoAsFarAsPossibleTowards(
                  pSoldier,
                  sClosestOpponent,
                  Enum289.AI_ACTION_SEEK_OPPONENT,
                );
              }
            } else {
              pSoldier.usActionData = GoAsFarAsPossibleTowards(
                pSoldier,
                sClosestOpponent,
                Enum289.AI_ACTION_SEEK_OPPONENT,
              );
            }
          } else {
            pSoldier.usActionData = NOWHERE;
          }

          if (pSoldier.usActionData != NOWHERE) {
            // charge!
            return Enum289.AI_ACTION_SEEK_OPPONENT;
          } else if (GetAPsToLook(pSoldier) <= pSoldier.bActionPoints) {
            // turn to face enemy
            bDirection = atan8(
              CenterX(pSoldier.sGridNo),
              CenterY(pSoldier.sGridNo),
              CenterX(sClosestOpponent),
              CenterY(sClosestOpponent),
            );

            // if we're not facing towards him
            if (
              pSoldier.bDirection != bDirection &&
              ValidCreatureTurn(pSoldier, bDirection)
            ) {
              pSoldier.usActionData = bDirection;

              return Enum289.AI_ACTION_CHANGE_FACING;
            }
          }
        }
      }
    } else {
      // run away!
      if (ubCanMove) {
        // look for best place to RUN AWAY to (farthest from the closest threat)
        // pSoldier->usActionData = RunAway( pSoldier );
        pSoldier.usActionData = FindSpotMaxDistFromOpponents(pSoldier);

        if (pSoldier.usActionData != NOWHERE) {
          return Enum289.AI_ACTION_RUN_AWAY;
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // DO NOTHING: Not enough points left to move, so save them for next turn
    ////////////////////////////////////////////////////////////////////////////

    // by default, if everything else fails, just stand in place and wait
    pSoldier.usActionData = NOWHERE;
    return Enum289.AI_ACTION_NONE;
  }

  export function CreatureDecideAction(pSoldier: SOLDIERTYPE): INT8 {
    let bAction: INT8 = Enum289.AI_ACTION_NONE;

    switch (pSoldier.bAlertStatus) {
      case Enum243.STATUS_GREEN:
        bAction = CreatureDecideActionGreen(pSoldier);
        break;

      case Enum243.STATUS_YELLOW:
        bAction = CreatureDecideActionYellow(pSoldier);
        break;

      case Enum243.STATUS_RED:
        bAction = CreatureDecideActionRed(pSoldier, 1);
        break;

      case Enum243.STATUS_BLACK:
        bAction = CreatureDecideActionBlack(pSoldier);
        break;
    }

    return bAction;
  }

  export function CreatureDecideAlertStatus(pSoldier: SOLDIERTYPE): void {
    let bOldStatus: INT8;
    let iDummy: INT32;
    let iDummy__Pointer = createPointer(
      () => iDummy,
      (v) => (iDummy = v),
    );
    let fClimbDummy: boolean;
    let fClimbDummy__Pointer = createPointer(
      () => fClimbDummy,
      (v) => (fClimbDummy = v),
    );
    let fReachableDummy: boolean;
    let fReachableDummy__Pointer = createPointer(
      () => fReachableDummy,
      (v) => (fReachableDummy = v),
    );

    // THE FOUR (4) POSSIBLE ALERT STATUSES ARE:
    // GREEN - No one sensed, no suspicious noise heard, go about doing regular stuff
    // YELLOW - Suspicious noise was heard personally
    // RED - Either saw OPPONENTS in person, or definite contact had been called
    // BLACK - Currently has one or more OPPONENTS in sight

    // set mobility
    switch (pSoldier.ubBodyType) {
      case Enum194.ADULTFEMALEMONSTER:
      case Enum194.YAF_MONSTER:
      case Enum194.AM_MONSTER:
      case Enum194.YAM_MONSTER:
      case Enum194.INFANT_MONSTER:
        pSoldier.bMobility = Enum295.CREATURE_MOBILE;
        break;
      case Enum194.QUEENMONSTER:
        pSoldier.bMobility = Enum295.CREATURE_IMMOBILE;
        break;
      case Enum194.LARVAE_MONSTER:
        pSoldier.bMobility = Enum295.CREATURE_CRAWLER;
        break;
    }

    if (pSoldier.ubBodyType == Enum194.LARVAE_MONSTER) {
      // larvae never do anything much!
      pSoldier.bAlertStatus = Enum243.STATUS_GREEN;
      return;
    }

    // save the man's previous status
    bOldStatus = pSoldier.bAlertStatus;

    // determine the current alert status for this category of man
    if (pSoldier.bOppCnt > 0) {
      // opponent(s) in sight
      // must search through list of people to see if any of them have
      // attacked us, or do some check to see if we have been attacked
      switch (bOldStatus) {
        case Enum243.STATUS_GREEN:
        case Enum243.STATUS_YELLOW:
          pSoldier.bAlertStatus = Enum243.STATUS_BLACK;
          break;
        case Enum243.STATUS_RED:
        case Enum243.STATUS_BLACK:
          pSoldier.bAlertStatus = Enum243.STATUS_BLACK;
      }
    } // no opponents are in sight
    else {
      switch (bOldStatus) {
        case Enum243.STATUS_BLACK:
          // then drop back to RED status
          pSoldier.bAlertStatus = Enum243.STATUS_RED;
          break;

        case Enum243.STATUS_RED:
          // RED can never go back down below RED, only up to BLACK
          break;

        case Enum243.STATUS_YELLOW:
          // if all enemies have been RED alerted, or we're under fire
          if (
            gTacticalStatus.Team[pSoldier.bTeam].bAwareOfOpposition ||
            pSoldier.bUnderFire
          ) {
            pSoldier.bAlertStatus = Enum243.STATUS_RED;
          } else {
            // if we are NOT aware of any uninvestigated noises right now
            // and we are not currently in the middle of an action
            // (could still be on his way heading to investigate a noise!)
            if (
              MostImportantNoiseHeard(
                pSoldier,
                iDummy__Pointer,
                fClimbDummy__Pointer,
                fReachableDummy__Pointer,
              ) == NOWHERE &&
              !pSoldier.bActionInProgress
            ) {
              // then drop back to GREEN status
              pSoldier.bAlertStatus = Enum243.STATUS_GREEN;
            }
          }
          break;

        case Enum243.STATUS_GREEN:
          // if all enemies have been RED alerted, or we're under fire
          if (
            gTacticalStatus.Team[pSoldier.bTeam].bAwareOfOpposition ||
            pSoldier.bUnderFire
          ) {
            pSoldier.bAlertStatus = Enum243.STATUS_RED;
          } else {
            // if we ARE aware of any uninvestigated noises right now
            if (
              MostImportantNoiseHeard(
                pSoldier,
                iDummy__Pointer,
                fClimbDummy__Pointer,
                fReachableDummy__Pointer,
              ) != NOWHERE
            ) {
              // then move up to YELLOW status
              pSoldier.bAlertStatus = Enum243.STATUS_YELLOW;
            }
          }
          break;
      }
      // otherwise, RED stays RED, YELLOW stays YELLOW, GREEN stays GREEN
    }

    // if the creatures alert status has changed in any way
    if (pSoldier.bAlertStatus != bOldStatus) {
      // HERE ARE TRYING TO AVOID NPCs SHUFFLING BACK & FORTH BETWEEN RED & BLACK
      // if either status is < RED (ie. anything but RED->BLACK && BLACK->RED)
      if (
        bOldStatus < Enum243.STATUS_RED ||
        pSoldier.bAlertStatus < Enum243.STATUS_RED
      ) {
        // force a NEW action decision on next pass through HandleManAI()
        SetNewSituation(pSoldier);
      }

      // if this guy JUST discovered that there were opponents here for sure...
      if (
        bOldStatus < Enum243.STATUS_RED &&
        pSoldier.bAlertStatus >= Enum243.STATUS_RED
      ) {
        // might want to make custom to let them go anywhere
        CheckForChangingOrders(pSoldier);
      }
    } // status didn't change
    else {
      // if a guy on status GREEN or YELLOW is running low on breath
      if (
        (pSoldier.bAlertStatus == Enum243.STATUS_GREEN &&
          pSoldier.bBreath < 75) ||
        (pSoldier.bAlertStatus == Enum243.STATUS_YELLOW &&
          pSoldier.bBreath < 50)
      ) {
        // as long as he's not in water (standing on a bridge is OK)
        if (!MercInWater(pSoldier)) {
          // force a NEW decision so that he can get some rest
          SetNewSituation(pSoldier);

          // current action will be canceled. if noise is no longer important
          if (
            pSoldier.bAlertStatus == Enum243.STATUS_YELLOW &&
            MostImportantNoiseHeard(
              pSoldier,
              iDummy__Pointer,
              fClimbDummy__Pointer,
              fReachableDummy__Pointer,
            ) == NOWHERE
          ) {
            // then drop back to GREEN status
            pSoldier.bAlertStatus = Enum243.STATUS_GREEN;
            CheckForChangingOrders(pSoldier);
          }
        }
      }
    }
  }

  function CrowDecideActionRed(pSoldier: SOLDIERTYPE): INT8 {
    // OK, Fly away!
    // HandleCrowFlyAway( pSoldier );
    if (!gfTurnBasedAI) {
      pSoldier.usActionData = 30000;
      return Enum289.AI_ACTION_WAIT;
    } else {
      return Enum289.AI_ACTION_NONE;
    }
  }

  function CrowDecideActionGreen(pSoldier: SOLDIERTYPE): INT8 {
    let sCorpseGridNo: INT16;
    let ubDirection: UINT8 = 0;
    let sFacingDir: INT16;

    // Look for a corse!
    sCorpseGridNo = FindNearestRottingCorpse(pSoldier);

    if (sCorpseGridNo != NOWHERE) {
      // Are we close, if so , peck!
      if (SpacesAway(pSoldier.sGridNo, sCorpseGridNo) < 2) {
        // Change facing
        sFacingDir = GetDirectionFromGridNo(sCorpseGridNo, pSoldier);

        if (sFacingDir != pSoldier.bDirection) {
          pSoldier.usActionData = sFacingDir;
          return Enum289.AI_ACTION_CHANGE_FACING;
        } else if (!gfTurnBasedAI) {
          pSoldier.usActionData = 30000;
          return Enum289.AI_ACTION_WAIT;
        } else {
          return Enum289.AI_ACTION_NONE;
        }
      } else {
        // Walk to nearest one!
        pSoldier.usActionData = FindGridNoFromSweetSpot(
          pSoldier,
          sCorpseGridNo,
          4,
          createPointer(
            () => ubDirection,
            (v) => (ubDirection = v),
          ),
        );
        if (pSoldier.usActionData != NOWHERE) {
          return Enum289.AI_ACTION_GET_CLOSER;
        }
      }
    }

    return Enum289.AI_ACTION_NONE;
  }

  export function CrowDecideAction(pSoldier: SOLDIERTYPE): INT8 {
    if (pSoldier.usAnimState == Enum193.CROW_FLY) {
      return Enum289.AI_ACTION_NONE;
    }

    switch (pSoldier.bAlertStatus) {
      case Enum243.STATUS_GREEN:
      case Enum243.STATUS_YELLOW:
        return CrowDecideActionGreen(pSoldier);

      case Enum243.STATUS_RED:
      case Enum243.STATUS_BLACK:
        return CrowDecideActionRed(pSoldier);

      default:
        Assert(false);
        return Enum289.AI_ACTION_NONE;
    }
  }
}
