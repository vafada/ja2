namespace ja2 {
  // THESE 3 DIFFICULTY FACTORS MUST ALWAYS ADD UP TO 100% EXACTLY!!!
  const DIFF_FACTOR_PLAYER_PROGRESS = 50;
  const DIFF_FACTOR_PALACE_DISTANCE = 30;
  const DIFF_FACTOR_GAME_DIFFICULTY = 20;

  // additional difficulty modifiers
  const DIFF_MODIFIER_SOME_PROGRESS = +5;
  const DIFF_MODIFIER_NO_INCOME = -5;
  const DIFF_MODIFIER_DRASSEN_MILITIA = +10;

  const PALACE_SECTOR_X = 3;
  const PALACE_SECTOR_Y = 16;

  const MAX_PALACE_DISTANCE = 20;

  export let gfProfiledEnemyAdded: boolean = false;

  export let guiCurrentUniqueSoldierId: UINT32 = 1;

  // CJC note: trust me, it's easiest just to put this here; this is the only
  // place it should need to be used
  let gubItemDroppableFlag: UINT8[] /* [NUM_INV_SLOTS] */ = [
    0x01, 0x02, 0x04, 0, 0, 0x08, 0, 0x10, 0x20, 0x40, 0x80, 0, 0, 0, 0, 0, 0,
    0, 0,
  ];

  export function RandomizeNewSoldierStats(
    pCreateStruct: SOLDIERCREATE_STRUCT,
  ): void {
    pCreateStruct.bLifeMax = Random(50) + 50;
    pCreateStruct.bLife = pCreateStruct.bLifeMax;
    pCreateStruct.bAgility = Random(50) + 50;
    pCreateStruct.bDexterity = Random(50) + 50;
    pCreateStruct.bExpLevel = 1 + Random(4);

    // Randomize skills (for now)
    pCreateStruct.bMarksmanship = Random(50) + 50;
    pCreateStruct.bMedical = Random(50) + 50;
    pCreateStruct.bMechanical = Random(50) + 50;
    pCreateStruct.bExplosive = Random(50) + 50;
    pCreateStruct.bLeadership = Random(50) + 50;
    pCreateStruct.bStrength = Random(50) + 50;
    pCreateStruct.bWisdom = Random(50) + 50;
    pCreateStruct.bAttitude = Random(Enum242.MAXATTITUDES);
    pCreateStruct.bOrders = Enum241.FARPATROL;
    pCreateStruct.bMorale = 50;
    pCreateStruct.bAIMorale = Enum244.MORALE_FEARLESS;
  }

  export function TacticalCreateSoldier(
    pCreateStruct: SOLDIERCREATE_STRUCT,
    pubID: Pointer<UINT8>,
  ): SOLDIERTYPE | null {
    let Soldier: SOLDIERTYPE = createSoldierType();
    let cnt: INT32;
    let pTeamSoldier: SOLDIERTYPE;
    let fGuyAvail: boolean = false;
    let bLastTeamID: UINT8;
    let ubVehicleID: UINT8 = 0;

    pubID.value = NOBODY;

    // Kris:
    // Huge no no!  See the header file for description of static detailed placements.
    // If this expression ever evaluates to true, then it will expose serious problems.
    // Simply returning won't help.
    if (pCreateStruct.fStatic) {
      Assert(0);
    }

    // Some values initialized here but could be changed before going to the common one
    InitSoldierStruct(Soldier);

    Soldier.uiUniqueSoldierIdValue = guiCurrentUniqueSoldierId;

    guiCurrentUniqueSoldierId++;

    // OK, CHECK IF WE HAVE A VALID PROFILE ID!
    if (pCreateStruct.ubProfile != NO_PROFILE) {
      // We have a merc created by profile, do this!
      TacticalCopySoldierFromProfile(Soldier, pCreateStruct);
    } else {
      TacticalCopySoldierFromCreateStruct(Soldier, pCreateStruct);
    }

    // If we are NOT creating an existing soldier ( ie, this is not from a save game ), create soldier normally
    if (!pCreateStruct.fUseExistingSoldier) {
      // We want to determine what team to place these guys in...

      // First off, force player team if they are a player guy! ( do some other stuff for only our guys!
      if (pCreateStruct.fPlayerMerc) {
        Soldier.uiStatusFlags |= SOLDIER_PC;
        Soldier.bTeam = gbPlayerNum;
        Soldier.bVisible = 1;
      } else if (pCreateStruct.fPlayerPlan) {
        Soldier.uiStatusFlags |= SOLDIER_PC;
        Soldier.bVisible = 1;
      } else {
        Soldier.uiStatusFlags |= SOLDIER_ENEMY;
      }

      // Check for auto team
      if (pCreateStruct.bTeam == SOLDIER_CREATE_AUTO_TEAM) {
        // Auto determine!
        // OK, if this is our guy, set team as ours!
        if (pCreateStruct.fPlayerMerc) {
          Soldier.bTeam = OUR_TEAM;
          Soldier.bNormalSmell = NORMAL_HUMAN_SMELL_STRENGTH;
        } else if (pCreateStruct.fPlayerPlan) {
          Soldier.bTeam = PLAYER_PLAN;
        } else {
          // LOOK AT BODY TYPE!
          switch (pCreateStruct.bBodyType) {
            case Enum194.REGMALE:
            case Enum194.BIGMALE:
            case Enum194.STOCKYMALE:
            case Enum194.REGFEMALE:
              Soldier.bTeam = ENEMY_TEAM;
              break;

            case Enum194.ADULTFEMALEMONSTER:
            case Enum194.AM_MONSTER:
            case Enum194.YAF_MONSTER:
            case Enum194.YAM_MONSTER:
            case Enum194.LARVAE_MONSTER:
            case Enum194.INFANT_MONSTER:
            case Enum194.QUEENMONSTER:
              Soldier.bTeam = CREATURE_TEAM;
              break;

            case Enum194.FATCIV:
            case Enum194.MANCIV:
            case Enum194.MINICIV:
            case Enum194.DRESSCIV:
            case Enum194.HATKIDCIV:
            case Enum194.KIDCIV:
            case Enum194.COW:
            case Enum194.CROW:
            case Enum194.ROBOTNOWEAPON:
              Soldier.bTeam = CIV_TEAM;
              break;
          }
        }
      } else {
        Soldier.bTeam = pCreateStruct.bTeam;
        // if WE_SEE_WHAT_MILITIA_SEES
        if (Soldier.bTeam == MILITIA_TEAM) {
          Soldier.bVisible = 1;
        }
      }

      // Copy the items over for thew soldier, only if we have a valid profile id!
      if (pCreateStruct.ubProfile != NO_PROFILE)
        CopyProfileItems(Soldier, pCreateStruct);

      // Given team, get an ID for this guy!

      if (guiCurrentScreen != Enum26.AUTORESOLVE_SCREEN) {
        cnt = gTacticalStatus.Team[Soldier.bTeam].bFirstID;

        // ATE: If we are a vehicle, and a player, start at a different slot ( 2 - max )
        if (
          Soldier.ubBodyType == Enum194.HUMVEE ||
          Soldier.ubBodyType == Enum194.ELDORADO ||
          Soldier.ubBodyType == Enum194.ICECREAMTRUCK ||
          Soldier.ubBodyType == Enum194.JEEP
        ) {
          if (Soldier.bTeam == gbPlayerNum) {
            cnt = gTacticalStatus.Team[Soldier.bTeam].bLastID - 1;
          }
        }

        bLastTeamID = gTacticalStatus.Team[Soldier.bTeam].bLastID;

        // look for all mercs on the same team,
        for (
          pTeamSoldier = MercPtrs[cnt];
          cnt <= bLastTeamID;
          cnt++, pTeamSoldier = MercPtrs[cnt]
        ) {
          if (!pTeamSoldier.bActive) {
            fGuyAvail = true;
            break;
          }
        }

        // Check if there was space!
        if (!fGuyAvail) {
          // No space, so can't create the soldier.
          return null;
        }

        // OK, set ID
        Soldier.ubID = cnt;
        pubID.value = Soldier.ubID;
      }

      // LOAD MERC's FACE!
      if (pCreateStruct.ubProfile != NO_PROFILE && Soldier.bTeam == OUR_TEAM) {
        Soldier.iFaceIndex = InitSoldierFace(Soldier);
      }

      Soldier.bActionPoints = CalcActionPoints(Soldier);
      Soldier.bInitialActionPoints = Soldier.bActionPoints;
      Soldier.bSide = gTacticalStatus.Team[Soldier.bTeam].bSide;
      Soldier.bActive = true;
      Soldier.sSectorX = pCreateStruct.sSectorX;
      Soldier.sSectorY = pCreateStruct.sSectorY;
      Soldier.bSectorZ = pCreateStruct.bSectorZ;
      Soldier.ubInsertionDirection = pCreateStruct.bDirection;
      Soldier.bDesiredDirection = pCreateStruct.bDirection;
      Soldier.bDominantDir = pCreateStruct.bDirection;
      Soldier.bDirection = pCreateStruct.bDirection;

      Soldier.sInsertionGridNo = pCreateStruct.sInsertionGridNo;
      Soldier.bOldLife = Soldier.bLifeMax;

      // If a civvy, set neutral
      if (Soldier.bTeam == CIV_TEAM) {
        if (Soldier.ubProfile == Enum268.WARDEN) {
          Soldier.bNeutral = false;
        } else if (Soldier.ubCivilianGroup != Enum246.NON_CIV_GROUP) {
          if (
            gTacticalStatus.fCivGroupHostile[Soldier.ubCivilianGroup] ==
            CIV_GROUP_HOSTILE
          ) {
            Soldier.bNeutral = false;
          } else {
            Soldier.bNeutral = true;
          }
        } else {
          Soldier.bNeutral = true;
        }

        // Weaken stats based on the bodytype of the civilian.
        if (Soldier.ubProfile == NO_PROFILE) {
          switch (Soldier.ubBodyType) {
            case Enum194.REGMALE:
            case Enum194.BIGMALE:
            case Enum194.STOCKYMALE:
            case Enum194.REGFEMALE:
              // no adjustments necessary for these "healthy" bodytypes.
              break;
            case Enum194.FATCIV:
              // fat, so slower
              Soldier.bAgility = 30 + Random(26); // 30 - 55
              break;
            case Enum194.MANCIV:
              Soldier.bLife = Soldier.bLifeMax = 35 + Random(26); // 35 - 60
              break;
            case Enum194.MINICIV:
            case Enum194.DRESSCIV:
              Soldier.bLife = Soldier.bLifeMax = 30 + Random(16); // 30 - 45
              break;
            case Enum194.HATKIDCIV:
            case Enum194.KIDCIV:
              Soldier.bLife = Soldier.bLifeMax = 20 + Random(16); // 20 - 35
              break;
            case Enum194.CRIPPLECIV:
              Soldier.bLife = Soldier.bLifeMax = 20 + Random(26); // 20 - 45
              Soldier.bAgility = 30 + Random(16); // 30 - 45
              break;
          }
        }
      } else if (Soldier.bTeam == CREATURE_TEAM) {
        // bloodcats are neutral to start out
        if (Soldier.ubBodyType == Enum194.BLOODCAT) {
          Soldier.bNeutral = true;
        } // otherwise (creatures) false
      }

      // OK, If not given a profile num, set a randomized defualt battle sound set
      // and then adjust it according to body type!
      if (Soldier.ubProfile == NO_PROFILE) {
        Soldier.ubBattleSoundID = Random(3);
      }

      // ATE: TEMP : No enemy women mercs (unless elite)!
      if (
        Soldier.ubProfile == NO_PROFILE &&
        Soldier.bTeam == ENEMY_TEAM &&
        Soldier.ubBodyType == Enum194.REGFEMALE &&
        Soldier.ubSoldierClass != Enum262.SOLDIER_CLASS_ELITE
      ) {
        Soldier.ubBodyType = Enum194.REGMALE + Random(3);
      }

      // ATE
      // Set some values for variation in anims...
      if (Soldier.ubBodyType == Enum194.BIGMALE) {
        Soldier.uiAnimSubFlags |= SUB_ANIM_BIGGUYTHREATENSTANCE;
      }

      // For inventory, look for any face class items that may be located in the big pockets and if found, move
      // that item to a face slot and clear the pocket!
      if (Soldier.bTeam != OUR_TEAM) {
        let i: INT32;
        let fSecondFaceItem: boolean = false;
        for (i = Enum261.BIGPOCK1POS; i <= Enum261.BIGPOCK4POS; i++) {
          if (Item[Soldier.inv[i].usItem].usItemClass & IC_FACE) {
            if (!fSecondFaceItem) {
              // Don't check for compatibility...  automatically assume there are no head positions filled.
              fSecondFaceItem = true;
              copyObjectType(Soldier.inv[Enum261.HEAD1POS], Soldier.inv[i]);
              resetObjectType(Soldier.inv[i]);
            } else {
              // if there is a second item, compare it to the first one we already added.
              if (
                CompatibleFaceItem(
                  Soldier.inv[Enum261.HEAD1POS].usItem,
                  Soldier.inv[i].usItem,
                )
              ) {
                copyObjectType(Soldier.inv[Enum261.HEAD2POS], Soldier.inv[i]);
                resetObjectType(Soldier.inv[i]);
                break;
              }
            }
          }
        }

        if (guiCurrentScreen != Enum26.AUTORESOLVE_SCREEN) {
          // also, if an army guy has camouflage, roll to determine whether they start camouflaged
          if (Soldier.bTeam == ENEMY_TEAM) {
            i = FindObj(Soldier, Enum225.CAMOUFLAGEKIT);

            if (i != NO_SLOT && Random(5) < SoldierDifficultyLevel(Soldier)) {
              // start camouflaged
              Soldier.bCamo = 100;
            }
          }
        }
      }

      // Set some flags, actions based on what body type we are
      // NOTE:  BE VERY CAREFUL WHAT YOU DO IN THIS SECTION!
      //  It is very possible to override editor settings, especially orders and attitude.
      //  In those cases, you can check for !gfEditMode (not in editor).
      switch (Soldier.ubBodyType) {
        case Enum194.HATKIDCIV:
        case Enum194.KIDCIV:
          Soldier.ubBattleSoundID = Random(2);
          break;

        case Enum194.REGFEMALE:
        case Enum194.MINICIV:
        case Enum194.DRESSCIV:
          Soldier.ubBattleSoundID = 7 + Random(2);
          Soldier.bNormalSmell = NORMAL_HUMAN_SMELL_STRENGTH;
          break;

        case Enum194.BLOODCAT:
          AssignCreatureInventory(Soldier);
          Soldier.bNormalSmell = NORMAL_HUMAN_SMELL_STRENGTH;
          Soldier.uiStatusFlags |= SOLDIER_ANIMAL;
          break;

        case Enum194.ADULTFEMALEMONSTER:
        case Enum194.AM_MONSTER:
        case Enum194.YAF_MONSTER:
        case Enum194.YAM_MONSTER:
        case Enum194.LARVAE_MONSTER:
        case Enum194.INFANT_MONSTER:
        case Enum194.QUEENMONSTER:
          AssignCreatureInventory(Soldier);
          Soldier.ubCaller = NOBODY;
          if (!gfEditMode) {
            Soldier.bOrders = Enum241.FARPATROL;
            Soldier.bAttitude = Enum242.AGGRESSIVE;
          }
          Soldier.uiStatusFlags |= SOLDIER_MONSTER;
          Soldier.bMonsterSmell = NORMAL_CREATURE_SMELL_STRENGTH;
          break;

        case Enum194.COW:
          Soldier.uiStatusFlags |= SOLDIER_ANIMAL;
          Soldier.bNormalSmell = COW_SMELL_STRENGTH;
          break;
        case Enum194.CROW:
          Soldier.uiStatusFlags |= SOLDIER_ANIMAL;
          break;

        case Enum194.ROBOTNOWEAPON:
          Soldier.uiStatusFlags |= SOLDIER_ROBOT;
          break;

        case Enum194.HUMVEE:
        case Enum194.ELDORADO:
        case Enum194.ICECREAMTRUCK:
        case Enum194.JEEP:
        case Enum194.TANK_NW:
        case Enum194.TANK_NE:
          Soldier.uiStatusFlags |= SOLDIER_VEHICLE;

          switch (Soldier.ubBodyType) {
            case Enum194.HUMVEE:
              ubVehicleID = Enum279.HUMMER;
              Soldier.bNeutral = true;
              break;

            case Enum194.ELDORADO:
              ubVehicleID = Enum279.ELDORADO_CAR;
              Soldier.bNeutral = true;
              break;

            case Enum194.ICECREAMTRUCK:
              ubVehicleID = Enum279.ICE_CREAM_TRUCK;
              Soldier.bNeutral = true;
              break;

            case Enum194.JEEP:
              ubVehicleID = Enum279.JEEP_CAR;
              break;

            case Enum194.TANK_NW:
            case Enum194.TANK_NE:
              ubVehicleID = Enum279.TANK_CAR;
              break;
          }

          if (pCreateStruct.fUseGivenVehicle) {
            Soldier.bVehicleID = pCreateStruct.bUseGivenVehicleID;
          } else {
            // Add vehicle to list....
            Soldier.bVehicleID = AddVehicleToList(
              Soldier.sSectorX,
              Soldier.sSectorY,
              Soldier.bSectorZ,
              ubVehicleID,
            );
          }
          SetVehicleValuesIntoSoldierType(Soldier);
          break;

        default:
          Soldier.bNormalSmell = NORMAL_HUMAN_SMELL_STRENGTH;
          break;
      }

      if (guiCurrentScreen != Enum26.AUTORESOLVE_SCREEN) {
        // Copy into merc struct
        copySoldierType(MercPtrs[Soldier.ubID], Soldier);
        // Alrighty then, we are set to create the merc, stuff after here can fail!
        if (
          CreateSoldierCommon(
            Soldier.ubBodyType,
            MercPtrs[Soldier.ubID],
            Soldier.ubID,
            Enum193.STANDING,
          ) == false
        ) {
          return null;
        }
      }
    } else {
      // Copy the data from the existing soldier struct to the new soldier struct
      if (
        !CopySavedSoldierInfoToNewSoldier(
          Soldier,
          <SOLDIERTYPE>pCreateStruct.pExistingSoldier,
        )
      )
        return null;

      // Reset the face index
      Soldier.iFaceIndex = -1;
      Soldier.iFaceIndex = InitSoldierFace(Soldier);

      // ATE: Reset soldier's light value to -1....
      Soldier.iLight = -1;

      if (
        Soldier.ubBodyType == Enum194.HUMVEE ||
        Soldier.ubBodyType == Enum194.ICECREAMTRUCK
      ) {
        Soldier.bNeutral = true;
      }

      // Copy into merc struct
      copySoldierType(MercPtrs[Soldier.ubID], Soldier);

      // Alrighty then, we are set to create the merc, stuff after here can fail!
      if (
        CreateSoldierCommon(
          Soldier.ubBodyType,
          MercPtrs[Soldier.ubID],
          Soldier.ubID,
          Menptr[Soldier.ubID].usAnimState,
        ) == false
      ) {
        return null;
      }

      pubID.value = Soldier.ubID;

      // The soldiers animation frame gets reset, set
      //		Menptr[ Soldier.ubID ].usAniCode = pCreateStruct->pExistingSoldier->usAniCode;
      //		Menptr[ Soldier.ubID ].usAnimState = Soldier.usAnimState;
      //		Menptr[ Soldier.ubID ].usAniFrame = Soldier.usAniFrame;
    }

    if (guiCurrentScreen != Enum26.AUTORESOLVE_SCREEN) {
      if (
        pCreateStruct.fOnRoof &&
        FlatRoofAboveGridNo(pCreateStruct.sInsertionGridNo)
      ) {
        SetSoldierHeight(MercPtrs[Soldier.ubID], 58.0);
      }

      // if we are loading DONT add men to team, because the number is restored in gTacticalStatus
      if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
        // Increment men in sector number!
        AddManToTeam(Soldier.bTeam);
      }

      return MercPtrs[Soldier.ubID];
    } else {
      // We are creating a dynamically allocated soldier for autoresolve.
      let pSoldier: SOLDIERTYPE;
      let ubSectorID: UINT8;
      ubSectorID = GetAutoResolveSectorID();
      pSoldier = createSoldierType();
      if (!pSoldier) return null;
      copySoldierType(pSoldier, Soldier);
      pSoldier.ubID = 255;
      pSoldier.sSectorX = SECTORX(ubSectorID);
      pSoldier.sSectorY = SECTORY(ubSectorID);
      pSoldier.bSectorZ = 0;
      pubID.value = 255;
      return pSoldier;
    }
  }

  function TacticalCopySoldierFromProfile(
    pSoldier: SOLDIERTYPE,
    pCreateStruct: SOLDIERCREATE_STRUCT,
  ): boolean {
    let ubProfileIndex: UINT8;
    let pProfile: MERCPROFILESTRUCT;

    ubProfileIndex = pCreateStruct.ubProfile;
    pProfile = gMercProfiles[ubProfileIndex];

    pSoldier.HeadPal = SET_PALETTEREP_ID(pProfile.HAIR);
    pSoldier.VestPal = SET_PALETTEREP_ID(pProfile.VEST);
    pSoldier.SkinPal = SET_PALETTEREP_ID(pProfile.SKIN);
    pSoldier.PantsPal = SET_PALETTEREP_ID(pProfile.PANTS);

    // Set profile index!
    pSoldier.ubProfile = ubProfileIndex;
    pSoldier.ubScheduleID = pCreateStruct.ubScheduleID;
    pSoldier.bHasKeys = Number(pCreateStruct.fHasKeys);

    pSoldier.name = pProfile.zNickname;

    pSoldier.bLife = pProfile.bLife;
    pSoldier.bLifeMax = pProfile.bLifeMax;
    pSoldier.bAgility = pProfile.bAgility;
    pSoldier.bLeadership = pProfile.bLeadership;
    pSoldier.bDexterity = pProfile.bDexterity;
    pSoldier.bStrength = pProfile.bStrength;
    pSoldier.bWisdom = pProfile.bWisdom;
    pSoldier.bExpLevel = pProfile.bExpLevel;
    pSoldier.bMarksmanship = pProfile.bMarksmanship;
    pSoldier.bMedical = pProfile.bMedical;
    pSoldier.bMechanical = pProfile.bMechanical;
    pSoldier.bExplosive = pProfile.bExplosive;
    pSoldier.bScientific = pProfile.bScientific;

    pSoldier.bVocalVolume = MIDVOLUME;
    pSoldier.uiAnimSubFlags = pProfile.uiBodyTypeSubFlags;
    pSoldier.ubBodyType = pProfile.ubBodyType;
    pSoldier.ubCivilianGroup = pProfile.ubCivilianGroup;
    // OK set initial duty
    //  pSoldier->bAssignment=ON_DUTY;

    pSoldier.bOldAssignment = NO_ASSIGNMENT;
    pSoldier.ubSkillTrait1 = pProfile.bSkillTrait;
    pSoldier.ubSkillTrait2 = pProfile.bSkillTrait2;

    pSoldier.bOrders = pCreateStruct.bOrders;
    pSoldier.bAttitude = pCreateStruct.bAttitude;
    pSoldier.bDirection = pCreateStruct.bDirection;
    pSoldier.bPatrolCnt = pCreateStruct.bPatrolCnt;
    copyArray(pSoldier.usPatrolGrid, pCreateStruct.sPatrolGrid);

    if (HAS_SKILL_TRAIT(pSoldier, Enum269.CAMOUFLAGED)) {
      // set camouflaged to 100 automatically
      pSoldier.bCamo = 100;
    }
    return true;
  }

  const enum Enum266 {
    PINKSKIN,
    TANSKIN,
    DARKSKIN,
    BLACKSKIN,
    NUMSKINS,
  }
  const enum Enum267 {
    WHITEHEAD,
    BLACKHEAD, // black skin (only this line )
    BROWNHEAD, // dark skin (this line plus all above)
    BLONDEHEAD,
    REDHEAD, // pink/tan skin (this line plus all above )
    NUMHEADS,
  }

  function ChooseHairColor(pSoldier: SOLDIERTYPE, skin: INT32): INT32 {
    let iRandom: INT32;
    let hair: INT32 = 0;
    iRandom = Random(100);
    switch (skin) {
      case Enum266.PINKSKIN:
      case Enum266.TANSKIN:
        if (iRandom < 12) {
          hair = Enum267.REDHEAD;
        } else if (iRandom < 34) {
          hair = Enum267.BLONDEHEAD;
        } else if (iRandom < 60) {
          hair = Enum267.BROWNHEAD;
        } else if (iRandom < 92) {
          hair = Enum267.BLACKHEAD;
        } else {
          hair = Enum267.WHITEHEAD;
          if (
            pSoldier.ubBodyType == Enum194.REGFEMALE ||
            pSoldier.ubBodyType == Enum194.MINICIV ||
            pSoldier.ubBodyType == Enum194.DRESSCIV ||
            pSoldier.ubBodyType == Enum194.HATKIDCIV ||
            pSoldier.ubBodyType == Enum194.KIDCIV
          ) {
            hair = Random(Enum267.NUMHEADS - 1) + 1;
          }
        }
        hair = Random(Enum267.NUMHEADS);
        break;
      case Enum266.DARKSKIN:
        if (iRandom < 35) {
          hair = Enum267.BROWNHEAD;
        } else if (iRandom < 84) {
          hair = Enum267.BLACKHEAD;
        } else {
          hair = Enum267.WHITEHEAD;
          if (
            pSoldier.ubBodyType == Enum194.REGFEMALE ||
            pSoldier.ubBodyType == Enum194.MINICIV ||
            pSoldier.ubBodyType == Enum194.DRESSCIV ||
            pSoldier.ubBodyType == Enum194.HATKIDCIV ||
            pSoldier.ubBodyType == Enum194.KIDCIV
          ) {
            hair = Random(2) + 1;
          }
        }
        break;
      case Enum266.BLACKSKIN:
        if (iRandom < 84) {
          hair = Enum267.BLACKHEAD;
        } else {
          hair = Enum267.WHITEHEAD;
          if (
            pSoldier.ubBodyType == Enum194.REGFEMALE ||
            pSoldier.ubBodyType == Enum194.MINICIV ||
            pSoldier.ubBodyType == Enum194.DRESSCIV ||
            pSoldier.ubBodyType == Enum194.HATKIDCIV ||
            pSoldier.ubBodyType == Enum194.KIDCIV
          ) {
            hair = Enum267.BLACKHEAD;
          }
        }
        break;
      default:
        AssertMsg(0, "Skin type not accounted for.");
        break;
    }
    if (pSoldier.ubBodyType == Enum194.CRIPPLECIV) {
      if (Chance(50)) {
        hair = Enum267.WHITEHEAD;
      }
    }
    return hair;
  }

  function GeneratePaletteForSoldier(
    pSoldier: SOLDIERTYPE,
    ubSoldierClass: UINT8,
  ): void {
    let skin: INT32;
    let hair: INT32;
    let fMercClothingScheme: boolean;
    hair = -1;

    // choose random skin tone which will limit the choice of hair colors.
    skin = Random(Enum266.NUMSKINS);
    switch (skin) {
      case Enum266.PINKSKIN:
        pSoldier.SkinPal = SET_PALETTEREP_ID("PINKSKIN");
        break;
      case Enum266.TANSKIN:
        pSoldier.SkinPal = SET_PALETTEREP_ID("TANSKIN");
        break;
      case Enum266.DARKSKIN:
        pSoldier.SkinPal = SET_PALETTEREP_ID("DARKSKIN");
        break;
      case Enum266.BLACKSKIN:
        pSoldier.SkinPal = SET_PALETTEREP_ID("BLACKSKIN");
        break;
      default:
        AssertMsg(0, "Skin type not accounted for.");
        break;
    }

    // Choose hair color which uses the skin color to limit choices
    hair = ChooseHairColor(pSoldier, skin);
    switch (hair) {
      case Enum267.BROWNHEAD:
        pSoldier.HeadPal = SET_PALETTEREP_ID("BROWNHEAD");
        break;
      case Enum267.BLACKHEAD:
        pSoldier.HeadPal = SET_PALETTEREP_ID("BLACKHEAD");
        break;
      case Enum267.WHITEHEAD:
        pSoldier.HeadPal = SET_PALETTEREP_ID("WHITEHEAD");
        break;
      case Enum267.BLONDEHEAD:
        pSoldier.HeadPal = SET_PALETTEREP_ID("BLONDHEAD");
        break;
      case Enum267.REDHEAD:
        pSoldier.HeadPal = SET_PALETTEREP_ID("REDHEAD");
        break;
      default:
        AssertMsg(0, "Hair type not accounted for.");
        break;
    }

    // OK, After skin, hair we could have a forced color scheme.. use here if so
    switch (ubSoldierClass) {
      case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
        pSoldier.VestPal = SET_PALETTEREP_ID("YELLOWVEST");
        pSoldier.PantsPal = SET_PALETTEREP_ID("GREENPANTS");
        pSoldier.ubSoldierClass = ubSoldierClass;
        return;
      case Enum262.SOLDIER_CLASS_ELITE:
        pSoldier.VestPal = SET_PALETTEREP_ID("BLACKSHIRT");
        pSoldier.PantsPal = SET_PALETTEREP_ID("BLACKPANTS");
        pSoldier.ubSoldierClass = ubSoldierClass;
        return;
      case Enum262.SOLDIER_CLASS_ARMY:
        pSoldier.VestPal = SET_PALETTEREP_ID("REDVEST");
        pSoldier.PantsPal = SET_PALETTEREP_ID("GREENPANTS");
        pSoldier.ubSoldierClass = ubSoldierClass;
        return;
      case Enum262.SOLDIER_CLASS_GREEN_MILITIA:
        pSoldier.VestPal = SET_PALETTEREP_ID("GREENVEST");
        pSoldier.PantsPal = SET_PALETTEREP_ID("BEIGEPANTS");
        pSoldier.ubSoldierClass = ubSoldierClass;
        return;
      case Enum262.SOLDIER_CLASS_REG_MILITIA:
        pSoldier.VestPal = SET_PALETTEREP_ID("JEANVEST");
        pSoldier.PantsPal = SET_PALETTEREP_ID("BEIGEPANTS");
        pSoldier.ubSoldierClass = ubSoldierClass;
        return;
      case Enum262.SOLDIER_CLASS_ELITE_MILITIA:
        pSoldier.VestPal = SET_PALETTEREP_ID("BLUEVEST");
        pSoldier.PantsPal = SET_PALETTEREP_ID("BEIGEPANTS");
        pSoldier.ubSoldierClass = ubSoldierClass;
        return;
      case Enum262.SOLDIER_CLASS_MINER:
        pSoldier.VestPal = SET_PALETTEREP_ID("greyVEST");
        pSoldier.PantsPal = SET_PALETTEREP_ID("BEIGEPANTS");
        pSoldier.ubSoldierClass = ubSoldierClass;
        return;
    }

    // there are 2 clothing schemes, 1 for mercs and 1 for civilians.  The
    // merc clothing scheme is much larger and general and is an exclusive superset
    // of the civilian clothing scheme which means the civilians will choose the
    // merc clothing scheme often ( actually 60% of the time ).
    if (!pSoldier.PantsPal[0] || !pSoldier.VestPal[0]) {
      fMercClothingScheme = true;
      if (pSoldier.bTeam == CIV_TEAM && Random(100) < 40) {
        // 40% chance of using cheezy civilian colors
        fMercClothingScheme = false;
      }
      if (!fMercClothingScheme) {
        // CHEEZY CIVILIAN COLORS
        if (Random(100) < 30) {
          // 30% chance that the civilian will choose a gaudy yellow shirt with pants.
          pSoldier.VestPal = SET_PALETTEREP_ID("GYELLOWSHIRT");
          switch (Random(3)) {
            case 0:
              pSoldier.PantsPal = SET_PALETTEREP_ID("TANPANTS");
              break;
            case 1:
              pSoldier.PantsPal = SET_PALETTEREP_ID("BEIGEPANTS");
              break;
            case 2:
              pSoldier.PantsPal = SET_PALETTEREP_ID("GREENPANTS");
              break;
          }
        } else {
          // 70% chance that the civilian will choose jeans with a shirt.
          pSoldier.PantsPal = SET_PALETTEREP_ID("JEANPANTS");
          switch (Random(7)) {
            case 0:
              pSoldier.VestPal = SET_PALETTEREP_ID("WHITEVEST");
              break;
            case 1:
              pSoldier.VestPal = SET_PALETTEREP_ID("BLACKSHIRT");
              break;
            case 2:
              pSoldier.VestPal = SET_PALETTEREP_ID("PURPLESHIRT");
              break;
            case 3:
              pSoldier.VestPal = SET_PALETTEREP_ID("BLUEVEST");
              break;
            case 4:
              pSoldier.VestPal = SET_PALETTEREP_ID("BROWNVEST");
              break;
            case 5:
              pSoldier.VestPal = SET_PALETTEREP_ID("JEANVEST");
              break;
            case 6:
              pSoldier.VestPal = SET_PALETTEREP_ID("REDVEST");
              break;
          }
        }
        return;
      }
      // MERC COLORS
      switch (Random(3)) {
        case 0:
          pSoldier.PantsPal = SET_PALETTEREP_ID("GREENPANTS");
          switch (Random(4)) {
            case 0:
              pSoldier.VestPal = SET_PALETTEREP_ID("YELLOWVEST");
              break;
            case 1:
              pSoldier.VestPal = SET_PALETTEREP_ID("WHITEVEST");
              break;
            case 2:
              pSoldier.VestPal = SET_PALETTEREP_ID("BROWNVEST");
              break;
            case 3:
              pSoldier.VestPal = SET_PALETTEREP_ID("GREENVEST");
              break;
          }
          break;
        case 1:
          pSoldier.PantsPal = SET_PALETTEREP_ID("TANPANTS");
          switch (Random(8)) {
            case 0:
              pSoldier.VestPal = SET_PALETTEREP_ID("YELLOWVEST");
              break;
            case 1:
              pSoldier.VestPal = SET_PALETTEREP_ID("WHITEVEST");
              break;
            case 2:
              pSoldier.VestPal = SET_PALETTEREP_ID("BLACKSHIRT");
              break;
            case 3:
              pSoldier.VestPal = SET_PALETTEREP_ID("BLUEVEST");
              break;
            case 4:
              pSoldier.VestPal = SET_PALETTEREP_ID("BROWNVEST");
              break;
            case 5:
              pSoldier.VestPal = SET_PALETTEREP_ID("GREENVEST");
              break;
            case 6:
              pSoldier.VestPal = SET_PALETTEREP_ID("JEANVEST");
              break;
            case 7:
              pSoldier.VestPal = SET_PALETTEREP_ID("REDVEST");
              break;
          }
          break;
        case 2:
          pSoldier.PantsPal = SET_PALETTEREP_ID("BLUEPANTS");
          switch (Random(4)) {
            case 0:
              pSoldier.VestPal = SET_PALETTEREP_ID("YELLOWVEST");
              break;
            case 1:
              pSoldier.VestPal = SET_PALETTEREP_ID("WHITEVEST");
              break;
            case 2:
              pSoldier.VestPal = SET_PALETTEREP_ID("REDVEST");
              break;
            case 3:
              pSoldier.VestPal = SET_PALETTEREP_ID("BLACKSHIRT");
              break;
          }
          break;
      }
    }
  }

  function TacticalCopySoldierFromCreateStruct(
    pSoldier: SOLDIERTYPE,
    pCreateStruct: SOLDIERCREATE_STRUCT,
  ): boolean {
    pSoldier.ubProfile = NO_PROFILE;

    // Randomize attributes
    pSoldier.bLife = pCreateStruct.bLife;
    pSoldier.bLifeMax = pCreateStruct.bLifeMax;
    pSoldier.bAgility = pCreateStruct.bAgility;
    pSoldier.bDexterity = pCreateStruct.bDexterity;
    pSoldier.bExpLevel = pCreateStruct.bExpLevel;

    pSoldier.bMarksmanship = pCreateStruct.bMarksmanship;
    pSoldier.bMedical = pCreateStruct.bMedical;
    pSoldier.bMechanical = pCreateStruct.bMechanical;
    pSoldier.bExplosive = pCreateStruct.bExplosive;
    pSoldier.bLeadership = pCreateStruct.bLeadership;
    pSoldier.bStrength = pCreateStruct.bStrength;
    pSoldier.bWisdom = pCreateStruct.bWisdom;

    pSoldier.bAttitude = pCreateStruct.bAttitude;
    pSoldier.bOrders = pCreateStruct.bOrders;
    pSoldier.bMorale = pCreateStruct.bMorale;
    pSoldier.bAIMorale = pCreateStruct.bAIMorale;
    pSoldier.bVocalVolume = MIDVOLUME;
    pSoldier.ubBodyType = pCreateStruct.bBodyType;
    pSoldier.ubCivilianGroup = pCreateStruct.ubCivilianGroup;

    pSoldier.ubScheduleID = pCreateStruct.ubScheduleID;
    pSoldier.bHasKeys = Number(pCreateStruct.fHasKeys);
    pSoldier.ubSoldierClass = pCreateStruct.ubSoldierClass;

    if (pCreateStruct.fVisible) {
      pSoldier.HeadPal = pCreateStruct.HeadPal;
      pSoldier.PantsPal = pCreateStruct.PantsPal;
      pSoldier.VestPal = pCreateStruct.VestPal;
      pSoldier.SkinPal = pCreateStruct.SkinPal;
    }

    // KM:  March 25, 1999
    // Assign nightops traits to enemies/militia
    if (
      pSoldier.ubSoldierClass == Enum262.SOLDIER_CLASS_ELITE ||
      pSoldier.ubSoldierClass == Enum262.SOLDIER_CLASS_ELITE_MILITIA
    ) {
      let iChance: INT32;
      let ubProgress: UINT8;

      ubProgress = HighestPlayerProgressPercentage();

      if (ubProgress < 60) {
        // ramp chance from 40 to 80% over the course of 60% progress
        // 60 * 2/3 = 40, and 40+40 = 80
        iChance = 40 + Math.trunc((ubProgress * 2) / 3);
      } else {
        iChance = 80;
      }

      if (Chance(iChance)) {
        pSoldier.ubSkillTrait1 = Enum269.NIGHTOPS;
        if (ubProgress >= 40 && Chance(30)) {
          pSoldier.ubSkillTrait2 = Enum269.NIGHTOPS;
        }
      }
    } else if (
      pSoldier.ubSoldierClass == Enum262.SOLDIER_CLASS_ARMY ||
      pSoldier.ubSoldierClass == Enum262.SOLDIER_CLASS_REG_MILITIA
    ) {
      let iChance: INT32;
      let ubProgress: UINT8;

      ubProgress = HighestPlayerProgressPercentage();

      if (ubProgress < 60) {
        // ramp chance from 0 to 40% over the course of 60% progress
        // 60 * 2/3 = 40
        iChance = Math.trunc((ubProgress * 2) / 3);
      } else {
        iChance = 40;
      }

      if (Chance(iChance)) {
        pSoldier.ubSkillTrait1 = Enum269.NIGHTOPS;
        if (ubProgress >= 50 && Chance(20)) {
          pSoldier.ubSkillTrait2 = Enum269.NIGHTOPS;
        }
      }
    }

    // KM:  November 10, 1997
    // Adding patrol points
    // CAUTION:  CONVERTING SIGNED TO UNSIGNED though the values should never be negative.
    pSoldier.bPatrolCnt = pCreateStruct.bPatrolCnt;
    copyArray(pSoldier.usPatrolGrid, pCreateStruct.sPatrolGrid);

    // Kris:  November 10, 1997
    // Expanded the default names based on team.
    switch (pCreateStruct.bTeam) {
      case ENEMY_TEAM:
        pSoldier.name = TacticalStr[Enum335.ENEMY_TEAM_MERC_NAME];
        break;
      case MILITIA_TEAM:
        pSoldier.name = TacticalStr[Enum335.MILITIA_TEAM_MERC_NAME];
        break;
      case CIV_TEAM:
        if (pSoldier.ubSoldierClass == Enum262.SOLDIER_CLASS_MINER) {
          pSoldier.name = TacticalStr[Enum335.CIV_TEAM_MINER_NAME];
        } else {
          pSoldier.name = TacticalStr[Enum335.CIV_TEAM_MERC_NAME];
        }
        break;
      case CREATURE_TEAM:
        if (pSoldier.ubBodyType == Enum194.BLOODCAT) {
          pSoldier.name = gzLateLocalizedString[36];
        } else {
          pSoldier.name = TacticalStr[Enum335.CREATURE_TEAM_MERC_NAME];
          break;
        }
        break;
    }

    // Generate colors for soldier based on the body type.
    GeneratePaletteForSoldier(pSoldier, pCreateStruct.ubSoldierClass);

    // Copy item info over
    for (let i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      copyObjectType(pSoldier.inv[i], pCreateStruct.Inv[i]);
    }

    return true;
  }

  function InitSoldierStruct(pSoldier: SOLDIERTYPE): void {
    // Set default values
    pSoldier.bVisible = -1;
    pSoldier.iFaceIndex = -1;

    // Set morale default
    pSoldier.bMorale = DEFAULT_MORALE;

    pSoldier.ubAttackerID = NOBODY;
    pSoldier.ubPreviousAttackerID = NOBODY;
    pSoldier.ubNextToPreviousAttackerID = NOBODY;

    // Set AI Delay!
    pSoldier.uiAIDelay = 100;

    pSoldier.iLight = -1;
    pSoldier.iFaceIndex = -1;

    // Set update time to new speed
    pSoldier.ubDesiredHeight = NO_DESIRED_HEIGHT;
    pSoldier.bViewRange = NORMAL_VIEW_RANGE;
    pSoldier.bInSector = false;
    pSoldier.sGridNo = NO_MAP_POS;
    pSoldier.iMuzFlash = -1;
    pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
    pSoldier.usPendingAnimation2 = NO_PENDING_ANIMATION;
    pSoldier.ubPendingStanceChange = NO_PENDING_STANCE;
    pSoldier.ubPendingDirection = NO_PENDING_DIRECTION;
    pSoldier.ubPendingAction = NO_PENDING_ACTION;
    pSoldier.bLastRenderVisibleValue = -1;
    pSoldier.bBreath = 99;
    pSoldier.bBreathMax = 100;
    pSoldier.bActive = true;
    pSoldier.fShowLocator = false;
    pSoldier.sLastTarget = NOWHERE;
    pSoldier.sAbsoluteFinalDestination = NOWHERE;
    pSoldier.sZLevelOverride = -1;
    pSoldier.ubServicePartner = NOBODY;
    pSoldier.ubAttackingHand = Enum261.HANDPOS;
    pSoldier.usAnimState = Enum193.STANDING;
    pSoldier.bInterruptDuelPts = NO_INTERRUPT;
    pSoldier.bMoved = false;
    pSoldier.ubRobotRemoteHolderID = NOBODY;
    pSoldier.sNoiseGridno = NOWHERE;
    pSoldier.ubPrevSectorID = 255;
    pSoldier.bNextPatrolPnt = 1;
    pSoldier.bCurrentCivQuote = -1;
    pSoldier.bCurrentCivQuoteDelta = 0;
    pSoldier.uiBattleSoundID = NO_SAMPLE;
    pSoldier.ubXRayedBy = NOBODY;
    pSoldier.uiXRayActivatedTime = 0;
    pSoldier.bBulletsLeft = 0;
    pSoldier.bVehicleUnderRepairID = -1;
  }

  export function InternalTacticalRemoveSoldier(
    usSoldierIndex: UINT16,
    fRemoveVehicle: boolean,
  ): boolean {
    let pSoldier: SOLDIERTYPE;

    // Check range of index given
    if (usSoldierIndex < 0 || usSoldierIndex > TOTAL_SOLDIERS - 1) {
      // Set debug message

      return false;
    }

    // ATE: If this guy is our global selected dude, take selection off...
    if (gfUIFullTargetFound && gusUIFullTargetID == usSoldierIndex) {
      gfUIFullTargetFound = false;
    }
    // This one is for a single-gridno guy.....
    if (gfUISelectiveTargetFound && gusUISelectiveTargetID == usSoldierIndex) {
      gfUISelectiveTargetFound = false;
    }

    pSoldier = MercPtrs[usSoldierIndex];

    return TacticalRemoveSoldierPointer(pSoldier, fRemoveVehicle);
  }

  export function TacticalRemoveSoldierPointer(
    pSoldier: SOLDIERTYPE,
    fRemoveVehicle: boolean,
  ): boolean {
    if (!pSoldier.bActive) return false;

    if (pSoldier.ubScheduleID) {
      DeleteSchedule(pSoldier.ubScheduleID);
    }

    if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE && fRemoveVehicle) {
      // remove this vehicle from the list
      RemoveVehicleFromList(pSoldier.bVehicleID);
    }

    // Handle crow leave....
    if (pSoldier.ubBodyType == Enum194.CROW) {
      HandleCrowLeave(pSoldier);
    }

    if (guiCurrentScreen != Enum26.AUTORESOLVE_SCREEN) {
      // remove character from squad list.. if they are on one
      RemoveCharacterFromSquads(pSoldier);

      // remove the soldier from the interface panel
      RemovePlayerFromTeamSlotGivenMercID(pSoldier.ubID);

      // Check if a guy exists here
      // Does another soldier exist here?
      if (pSoldier.bActive) {
        RemoveSoldierFromGridNo(pSoldier);

        // Delete shadow of crow....
        if (pSoldier.pAniTile != null) {
          DeleteAniTile(pSoldier.pAniTile);
          pSoldier.pAniTile = <ANITILE>(<unknown>null);
        }

        if (!(pSoldier.uiStatusFlags & SOLDIER_OFF_MAP)) {
          // Decrement men in sector number!
          RemoveManFromTeam(pSoldier.bTeam);
        } // people specified off-map have already been removed from their team count

        pSoldier.bActive = false;

        // Delete!
        DeleteSoldier(pSoldier);
      }
    } else {
      if (gfPersistantPBI) {
        DeleteSoldier(pSoldier);
      }
    }

    return true;
  }

  export function TacticalRemoveSoldier(usSoldierIndex: UINT16): boolean {
    return InternalTacticalRemoveSoldier(usSoldierIndex, true);
  }

  // returns a soldier difficulty modifier from 0 to 100 based on player's progress, distance from the Palace, mining income, and
  // playing difficulty level.  Used for generating soldier stats, equipment, and AI skill level.
  export function CalcDifficultyModifier(ubSoldierClass: UINT8): INT8 {
    let bDiffModifier: INT8 = 0;
    let ubProgress: UINT8;
    let ubProgressModifier: UINT8;

    if (gfEditMode) {
      // return an average rating for editor purposes
      return 50;
    }

    // THESE 3 DIFFICULTY FACTORS MUST ALWAYS ADD UP TO 100% EXACTLY!!!
    Assert(
      DIFF_FACTOR_PLAYER_PROGRESS +
        DIFF_FACTOR_PALACE_DISTANCE +
        DIFF_FACTOR_GAME_DIFFICULTY ==
        100,
    );

    // adjust for game difficulty level
    switch (gGameOptions.ubDifficultyLevel) {
      case Enum9.DIF_LEVEL_EASY:
        // very strong militia, very weak enemies/cratures/bloodcats
        if (SOLDIER_CLASS_MILITIA(ubSoldierClass)) {
          // +20
          bDiffModifier += DIFF_FACTOR_GAME_DIFFICULTY;
        }
        break;

      case Enum9.DIF_LEVEL_MEDIUM:
        // equally strong militia, enemies, creatures, bloodcats (+10)
        bDiffModifier += Math.trunc(DIFF_FACTOR_GAME_DIFFICULTY / 2);
        break;

      case Enum9.DIF_LEVEL_HARD:
        // equally stronger militia/enemies/creatures/bloodcats (+20)
        bDiffModifier += DIFF_FACTOR_GAME_DIFFICULTY;
        break;
    }

    // the progress returned ranges from 0 to 100
    ubProgress = HighestPlayerProgressPercentage();

    // bump it a bit once we've accomplished something (killed some enemies or taken an important sector)
    if (ubProgress > 0) {
      // +5
      bDiffModifier += DIFF_MODIFIER_SOME_PROGRESS;
    }

    // drop it down a bit if we still don't have any mine income
    if (PredictIncomeFromPlayerMines() == 0) {
      // -5
      bDiffModifier += DIFF_MODIFIER_NO_INCOME;
    }

    // adjust for progress level (0 to +50)
    ubProgressModifier = Math.trunc(
      (ubProgress * DIFF_FACTOR_PLAYER_PROGRESS) / 100,
    );
    bDiffModifier += ubProgressModifier;

    // adjust for map location
    bDiffModifier += GetLocationModifier(ubSoldierClass);

    // should be no way to go over 100, although it's possible to go below 0 when just starting on easy
    // Assert( bDiffModifier <= 100 );

    // limit the range of the combined factors to between 0 and 100
    bDiffModifier = Math.max(0, bDiffModifier);
    bDiffModifier = Math.min(100, bDiffModifier);

    // DON'T change this function without carefully considering the impact on GenerateRandomEquipment(),
    // CreateDetailedPlacementGivenBasicPlacementInfo(), and SoldierDifficultyLevel().

    return bDiffModifier;
  }

  // When the editor modifies the soldier's relative attribute level,
  // this function is called to update that information.
  // Used to generate a detailed placement from a basic placement.  This assumes that the detailed placement
  // doesn't exist, meaning there are no static attributes.  This is called when you wish to convert a basic
  // placement into a detailed placement just before creating a soldier.
  export function CreateDetailedPlacementGivenBasicPlacementInfo(
    pp: SOLDIERCREATE_STRUCT,
    bp: BASIC_SOLDIERCREATE_STRUCT,
  ): void {
    let bBaseAttribute: INT8;
    let ubSoldierClass: UINT8;
    let ubDiffFactor: UINT8;
    let bExpLevelModifier: INT8;
    let bStatsModifier: INT8;
    let ubStatsLevel: UINT8;

    if (!pp || !bp) return;
    pp.fStatic = false;
    pp.ubProfile = NO_PROFILE;
    pp.sInsertionGridNo = bp.usStartingGridNo;
    pp.fPlayerMerc = false;
    pp.fPlayerPlan = false;
    pp.fCopyProfileItemsOver = false;
    pp.bTeam = bp.bTeam;
    pp.ubSoldierClass = bp.ubSoldierClass;
    pp.ubCivilianGroup = bp.ubCivilianGroup;
    pp.ubScheduleID = 0;
    pp.sSectorX = gWorldSectorX;
    pp.sSectorY = gWorldSectorY;
    pp.bSectorZ = gbWorldSectorZ;
    pp.fHasKeys = bp.fHasKeys;

    // Choose a body type randomly if none specified.
    if (bp.bBodyType < 0) {
      switch (bp.bTeam) {
        case OUR_TEAM:
        case ENEMY_TEAM:
        case MILITIA_TEAM:
          switch (Random(4)) {
            case 0:
              pp.bBodyType = Enum194.REGMALE;
              break;
            case 1:
              pp.bBodyType = Enum194.BIGMALE;
              break;
            case 2:
              pp.bBodyType = Enum194.STOCKYMALE;
              break;
            case 3:
              pp.bBodyType = Enum194.REGFEMALE;
              break;
          }
          break;
        case CIV_TEAM:
          if (pp.ubSoldierClass == Enum262.SOLDIER_CLASS_MINER) {
            switch (Random(3)) {
              // only strong and fit men can be miners.
              case 0:
                pp.bBodyType = Enum194.REGMALE;
                break;
              case 1:
                pp.bBodyType = Enum194.BIGMALE;
                break;
              case 2:
                pp.bBodyType = Enum194.MANCIV;
                break;
            }
          } else {
            let iRandom: INT32;
            iRandom = Random(100);
            if (iRandom < 8) {
              // 8% chance FATCIV
              pp.bBodyType = Enum194.FATCIV;
            } else if (iRandom < 38) {
              // 30% chance MANCIV
              pp.bBodyType = Enum194.MANCIV;
            } else if (iRandom < 57) {
              // 19% chance MINICIV
              pp.bBodyType = Enum194.MINICIV;
            } else if (iRandom < 76) {
              // 19% chance DRESSCIV
              pp.bBodyType = Enum194.DRESSCIV;
            } else if (iRandom < 88) {
              // 12% chance HATKIDCIV
              pp.bBodyType = Enum194.HATKIDCIV;
            } else {
              // 12% chance KIDCIV
              pp.bBodyType = Enum194.KIDCIV;
            }
          }
          break;
      }
    } else {
      pp.bBodyType = bp.bBodyType;
    }

    // Pass over mandatory information specified from the basic placement
    pp.bOrders = bp.bOrders;
    pp.bAttitude = bp.bAttitude;
    pp.bDirection = bp.bDirection;

    // determine this soldier's soldier class
    if (bp.bTeam == CREATURE_TEAM) {
      ubSoldierClass = Enum262.SOLDIER_CLASS_CREATURE;
    } else {
      ubSoldierClass = bp.ubSoldierClass;
    }

    ubDiffFactor = CalcDifficultyModifier(ubSoldierClass);

    // experience level is modified by game difficulty, player's progress, & proximity to Queen's Palace, etc.
    // This formula gives the following results:
    //	DIFFICULTY FACTOR			EXP. LEVEL  MODIFIER		LEVEL OF AVG REGULAR TROOP
    //			   0 to 19									-2													2
    //			  20 to 39									-1													3
    //			  41 to 59									-0													4
    //				60 to 79									+1													5
    //				80 to 99									+2													6
    //				  100											+3													7		(can happen in P3 Meduna itself on HARD only!)
    bExpLevelModifier = Math.trunc(ubDiffFactor / 20) - 2;

    // if in the upper half of this difficulty rating (10-19, 30-39, 50-59, 70-79, and 90-99)
    if (ubDiffFactor % 20 >= 10) {
      // increase stats only by one level's worth
      bStatsModifier = +1;
    } else {
      // normal stats for this level
      bStatsModifier = 0;
    }

    // Adjust level and statistics for Linda's prespecified relative attribute level
    switch (bp.bRelativeAttributeLevel) {
      // NOTE: bStatsModifier already includes the bExpLevelModifier since it's based on the level itself!
      case 0:
        bExpLevelModifier += -1;
        bStatsModifier += -1;
        break;
      case 1:
        bExpLevelModifier += -1;
        bStatsModifier += 0;
        break;
      case 2:
        bExpLevelModifier += 0;
        bStatsModifier += 0;
        break;
      case 3:
        bExpLevelModifier += +1;
        bStatsModifier += 0;
        break;
      case 4:
        bExpLevelModifier += +1;
        bStatsModifier += +1;
        break;

      default:
        AssertMsg(
          false,
          FormatString(
            "Invalid bRelativeAttributeLevel = %d",
            bp.bRelativeAttributeLevel,
          ),
        );
        break;
    }

    // Set the experience level based on the soldier class and exp level modifier or relative attribute level
    switch (ubSoldierClass) {
      case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
        pp.bExpLevel = 2 + bExpLevelModifier;
        break;
      case Enum262.SOLDIER_CLASS_ARMY:
        pp.bExpLevel = 4 + bExpLevelModifier;
        break;
      case Enum262.SOLDIER_CLASS_ELITE:
        pp.bExpLevel = 6 + bExpLevelModifier;
        break;
      case Enum262.SOLDIER_CLASS_GREEN_MILITIA:
        pp.bExpLevel = 2 + bExpLevelModifier;
        break;
      case Enum262.SOLDIER_CLASS_REG_MILITIA:
        pp.bExpLevel = 4 + bExpLevelModifier;
        break;
      case Enum262.SOLDIER_CLASS_ELITE_MILITIA:
        pp.bExpLevel = 6 + bExpLevelModifier;
        break;
      case Enum262.SOLDIER_CLASS_MINER:
        pp.bExpLevel = bp.bRelativeAttributeLevel; // avg 2 (1-4)
        break;

      case Enum262.SOLDIER_CLASS_CREATURE:
        switch (bp.bBodyType) {
          case Enum194.LARVAE_MONSTER:
            pp.bExpLevel = 1 + bExpLevelModifier;
            break;
          case Enum194.INFANT_MONSTER:
            pp.bExpLevel = 2 + bExpLevelModifier;
            break;
          case Enum194.YAF_MONSTER:
          case Enum194.YAM_MONSTER:
            pp.bExpLevel = 3 + Random(2) + bExpLevelModifier; // 3-4
            break;
          case Enum194.ADULTFEMALEMONSTER:
          case Enum194.AM_MONSTER:
            pp.bExpLevel = 5 + Random(2) + bExpLevelModifier; // 5-6
            break;
          case Enum194.QUEENMONSTER:
            pp.bExpLevel = 7 + bExpLevelModifier;
            break;

          case Enum194.BLOODCAT:
            pp.bExpLevel = 5 + bExpLevelModifier;
            if (SECTOR(gWorldSectorX, gWorldSectorY) == Enum123.SEC_I16) {
              pp.bExpLevel += gGameOptions.ubDifficultyLevel;
            }
            break;
        }
        break;

      default:
        pp.bExpLevel = bp.bRelativeAttributeLevel; // avg 2 (1-4)
        ubSoldierClass = Enum262.SOLDIER_CLASS_NONE;
        break;
    }

    pp.bExpLevel = Math.max(1, pp.bExpLevel); // minimum exp. level of 1
    pp.bExpLevel = Math.min(9, pp.bExpLevel); // maximum exp. level of 9

    ubStatsLevel = pp.bExpLevel + bStatsModifier;
    ubStatsLevel = Math.max(0, ubStatsLevel); // minimum stats level of 0
    ubStatsLevel = Math.min(9, ubStatsLevel); // maximum stats level of 9

    // Set the minimum base attribute
    bBaseAttribute = 49 + 4 * ubStatsLevel;

    // Roll soldier's statistics and skills
    // Stat range is currently 49-99, bell-curved around a range of 16 values dependent on the stats level
    pp.bLifeMax = bBaseAttribute + Random(9) + Random(8);
    pp.bLife = pp.bLifeMax;
    pp.bAgility = bBaseAttribute + Random(9) + Random(8);
    pp.bDexterity = bBaseAttribute + Random(9) + Random(8);

    pp.bMarksmanship = bBaseAttribute + Random(9) + Random(8);
    pp.bMedical = bBaseAttribute + Random(9) + Random(8);
    pp.bMechanical = bBaseAttribute + Random(9) + Random(8);
    pp.bExplosive = bBaseAttribute + Random(9) + Random(8);
    pp.bLeadership = bBaseAttribute + Random(9) + Random(8);
    pp.bStrength = bBaseAttribute + Random(9) + Random(8);
    pp.bWisdom = bBaseAttribute + Random(9) + Random(8);
    pp.bMorale = bBaseAttribute + Random(9) + Random(8);

    // CJC: now calculate the REAL experience level if in the really upper end
    pp.bExpLevel = ReduceHighExpLevels(pp.bExpLevel);

    pp.fVisible = false;

    pp.fOnRoof = bp.fOnRoof;

    pp.ubSoldierClass = ubSoldierClass;

    // Transfer over the patrol points.
    pp.bPatrolCnt = bp.bPatrolCnt;
    copyArray(pp.sPatrolGrid, bp.sPatrolGrid);

    // If it is a detailed placement, don't do this yet, as detailed placements may have their
    // own equipment.
    if (
      !bp.fDetailedPlacement &&
      ubSoldierClass != Enum262.SOLDIER_CLASS_NONE &&
      ubSoldierClass != Enum262.SOLDIER_CLASS_CREATURE &&
      ubSoldierClass != Enum262.SOLDIER_CLASS_MINER
    )
      GenerateRandomEquipment(pp, ubSoldierClass, bp.bRelativeEquipmentLevel);
  }

  // Used exclusively by the editor when the user wishes to change a basic placement into a detailed placement.
  // Because the intention is to make some of the attributes static, all of the information that can be generated
  // are defaulted to -1.  When an attribute is made to be static, that value in replaced by the new static value.
  // This information is NOT compatible with TacticalCreateSoldier.  Before doing so, you must first convert the
  // static detailed placement to a regular detailed placement.
  export function CreateStaticDetailedPlacementGivenBasicPlacementInfo(
    spp: SOLDIERCREATE_STRUCT,
    bp: BASIC_SOLDIERCREATE_STRUCT,
  ): void {
    let i: INT32;
    if (!spp || !bp) return;
    resetSoldierCreateStruct(spp);
    spp.fStatic = true;
    spp.ubProfile = NO_PROFILE;
    spp.sInsertionGridNo = bp.usStartingGridNo;
    spp.fPlayerMerc = false;
    spp.fPlayerPlan = false;
    spp.fCopyProfileItemsOver = false;
    spp.bTeam = bp.bTeam;
    spp.ubSoldierClass = bp.ubSoldierClass;
    spp.ubCivilianGroup = bp.ubCivilianGroup;
    spp.ubScheduleID = 0;
    spp.sSectorX = gWorldSectorX;
    spp.sSectorY = gWorldSectorY;
    spp.bSectorZ = gbWorldSectorZ;
    spp.fHasKeys = bp.fHasKeys;

    // Pass over mandatory information specified from the basic placement
    spp.bOrders = bp.bOrders;
    spp.bAttitude = bp.bAttitude;
    spp.bDirection = bp.bDirection;

    // Only creatures have mandatory body types specified.
    if (spp.bTeam == CREATURE_TEAM) spp.bBodyType = bp.bBodyType;
    else spp.bBodyType = -1;

    // Set up all possible static values.
    // By setting them all to -1, that signifies that the attribute isn't static.
    // The static placement needs to be later *regenerated* in order to create a valid soldier.
    spp.bExpLevel = -1;
    spp.bLifeMax = -1;
    spp.bLife = -1;
    spp.bAgility = -1;
    spp.bDexterity = -1;
    spp.bMarksmanship = -1;
    spp.bMedical = -1;
    spp.bMechanical = -1;
    spp.bExplosive = -1;
    spp.bLeadership = -1;
    spp.bStrength = -1;
    spp.bWisdom = -1;
    spp.bMorale = -1;

    spp.fVisible = false;

    spp.fOnRoof = bp.fOnRoof;

    // Transfer over the patrol points.
    spp.bPatrolCnt = bp.bPatrolCnt;
    copyArray(spp.sPatrolGrid, bp.sPatrolGrid);

    // Starts with nothing
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      resetObjectType(spp.Inv[i]);
      spp.Inv[i].usItem = NOTHING;
      spp.Inv[i].fFlags |= OBJECT_UNDROPPABLE;
    }
  }

  // When you are ready to generate a soldier with a static detailed placement slot, this function will generate
  // the proper detailed placement slot given the static detailed placement and it's accompanying basic placement.
  // For the purposes of merc editing, the static detailed placement is preserved.
  export function CreateDetailedPlacementGivenStaticDetailedPlacementAndBasicPlacementInfo(
    pp: SOLDIERCREATE_STRUCT,
    spp: SOLDIERCREATE_STRUCT,
    bp: BASIC_SOLDIERCREATE_STRUCT,
  ): void {
    let i: INT32;

    resetSoldierCreateStruct(pp);
    pp.fOnRoof = spp.fOnRoof = bp.fOnRoof;
    pp.fStatic = false;
    pp.ubSoldierClass = bp.ubSoldierClass;
    // Generate the new placement
    pp.ubProfile = spp.ubProfile;
    if (pp.ubProfile != NO_PROFILE) {
      // Copy over team
      pp.bTeam = bp.bTeam;

      pp.bDirection = bp.bDirection;
      pp.sInsertionGridNo = bp.usStartingGridNo;

      // ATE: Copy over sector coordinates from profile to create struct
      pp.sSectorX = gMercProfiles[pp.ubProfile].sSectorX;
      pp.sSectorY = gMercProfiles[pp.ubProfile].sSectorY;
      pp.bSectorZ = gMercProfiles[pp.ubProfile].bSectorZ;

      pp.ubScheduleID = spp.ubScheduleID;

      pp.bOrders = bp.bOrders;
      pp.bAttitude = bp.bAttitude;
      pp.bDirection = bp.bDirection;
      pp.bPatrolCnt = bp.bPatrolCnt;
      copyArray(pp.sPatrolGrid, bp.sPatrolGrid);
      pp.fHasKeys = bp.fHasKeys;
      pp.ubCivilianGroup = bp.ubCivilianGroup;

      return; // done
    }
    CreateDetailedPlacementGivenBasicPlacementInfo(pp, bp);
    pp.ubScheduleID = spp.ubScheduleID;
    // Replace any of the new placement's attributes with static attributes.
    if (spp.bExpLevel != -1) pp.bExpLevel = spp.bExpLevel;
    if (spp.bLife != -1) pp.bLife = spp.bLife;
    if (spp.bLifeMax != -1) pp.bLifeMax = spp.bLifeMax;
    if (spp.bMarksmanship != -1) pp.bMarksmanship = spp.bMarksmanship;
    if (spp.bStrength != -1) pp.bStrength = spp.bStrength;
    if (spp.bAgility != -1) pp.bAgility = spp.bAgility;
    if (spp.bDexterity != -1) pp.bDexterity = spp.bDexterity;
    if (spp.bWisdom != -1) pp.bWisdom = spp.bWisdom;
    if (spp.bLeadership != -1) pp.bLeadership = spp.bLeadership;
    if (spp.bExplosive != -1) pp.bExplosive = spp.bExplosive;
    if (spp.bMedical != -1) pp.bMedical = spp.bMedical;
    if (spp.bMechanical != -1) pp.bMechanical = spp.bMechanical;
    if (spp.bMorale != -1) pp.bMorale = spp.bMorale;

    pp.fVisible = spp.fVisible;
    if (spp.fVisible) {
      pp.HeadPal = spp.HeadPal;
      pp.PantsPal = spp.PantsPal;
      pp.VestPal = spp.VestPal;
      pp.SkinPal = spp.SkinPal;
    }

    // This isn't perfect, however, it blindly brings over the items from the static
    // detailed placement.  Due to the order of things, other items would
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      // copy over static items and empty slots that are droppable (signifies a forced empty slot)
      if (spp.Inv[i].fFlags & OBJECT_NO_OVERWRITE) {
        copyObjectType(pp.Inv[i], spp.Inv[i]);
        // memcpy( pp->Inv, spp->Inv, sizeof( OBJECTTYPE ) * NUM_INV_SLOTS );
        // return;
      }
    }
    if (!gGameOptions.fGunNut) {
      ReplaceExtendedGuns(pp, bp.ubSoldierClass);
    }
    if (
      bp.ubSoldierClass != Enum262.SOLDIER_CLASS_NONE &&
      bp.ubSoldierClass != Enum262.SOLDIER_CLASS_CREATURE &&
      bp.ubSoldierClass != Enum262.SOLDIER_CLASS_MINER
    ) {
      GenerateRandomEquipment(
        pp,
        bp.ubSoldierClass,
        bp.bRelativeEquipmentLevel,
      );
    }
  }

  // Used to update a existing soldier's attributes with the new static detailed placement info.  This is used
  // by the editor upon exiting the editor into the game, to update the existing soldiers with new information.
  // This gives flexibility of testing mercs.  Upon entering the editor again, this call will reset all the
  // mercs to their original states.
  export function UpdateSoldierWithStaticDetailedInformation(
    s: SOLDIERTYPE,
    spp: SOLDIERCREATE_STRUCT,
  ): void {
    // First, check to see if the soldier has a profile.  If so, then it'll extract the information
    // and update the soldier with the profile information instead.  This has complete override
    // authority.
    if (spp.ubProfile != NO_PROFILE) {
      TacticalCopySoldierFromProfile(s, spp);
      UpdateStaticDetailedPlacementWithProfileInformation(spp, spp.ubProfile);
      SetSoldierAnimationSurface(s, s.usAnimState);
      CreateSoldierPalettes(s);
      return;
    }

    switch (spp.ubSoldierClass) {
      // If the soldier is an administrator, then
      case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
      case Enum262.SOLDIER_CLASS_ARMY:
      case Enum262.SOLDIER_CLASS_ELITE:
        GeneratePaletteForSoldier(s, spp.ubSoldierClass);
        break;
    }

    if (spp.bExpLevel != -1) {
      // We have a static experience level, so generate all of the soldier's attributes.
      let bBaseAttribute: INT8;
      s.bExpLevel = spp.bExpLevel;
      // Set the minimum base attribute
      bBaseAttribute = 49 + 4 * s.bExpLevel;

      // Roll enemy's combat statistics, taking bExpLevel into account.
      // Stat range is currently 40-99, slightly bell-curved around the bExpLevel
      s.bLifeMax = bBaseAttribute + Random(9) + Random(8);
      s.bLife = s.bLifeMax;
      s.bAgility = bBaseAttribute + Random(9) + Random(8);
      s.bDexterity = bBaseAttribute + Random(9) + Random(8);
      s.bMarksmanship = bBaseAttribute + Random(9) + Random(8);
      s.bMedical = bBaseAttribute + Random(9) + Random(8);
      s.bMechanical = bBaseAttribute + Random(9) + Random(8);
      s.bExplosive = bBaseAttribute + Random(9) + Random(8);
      s.bLeadership = bBaseAttribute + Random(9) + Random(8);
      s.bStrength = bBaseAttribute + Random(9) + Random(8);
      s.bWisdom = bBaseAttribute + Random(9) + Random(8);
      s.bMorale = bBaseAttribute + Random(9) + Random(8);
    }
    // Replace any soldier attributes with any static values in the detailed placement.
    if (spp.bLife != -1) s.bLife = spp.bLife;
    if (spp.bLifeMax != -1) s.bLifeMax = spp.bLifeMax;
    if (spp.bMarksmanship != -1) s.bMarksmanship = spp.bMarksmanship;
    if (spp.bStrength != -1) s.bStrength = spp.bStrength;
    if (spp.bAgility != -1) s.bAgility = spp.bAgility;
    if (spp.bDexterity != -1) s.bDexterity = spp.bDexterity;
    if (spp.bWisdom != -1) s.bWisdom = spp.bWisdom;
    if (spp.bLeadership != -1) s.bLeadership = spp.bLeadership;
    if (spp.bExplosive != -1) s.bExplosive = spp.bExplosive;
    if (spp.bMedical != -1) s.bMedical = spp.bMedical;
    if (spp.bMechanical != -1) s.bMechanical = spp.bMechanical;
    if (spp.bMorale != -1) s.bMorale = spp.bMorale;

    // life can't exceed the life max.
    if (s.bLife > s.bLifeMax) s.bLife = s.bLifeMax;

    s.ubScheduleID = spp.ubScheduleID;

    // Copy over the current inventory list.
    for (let i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      copyObjectType(s.inv[i], spp.Inv[i]);
    }
  }

  // In the case of setting a profile ID in order to extract a soldier from the profile array, we
  // also want to copy that information to the static detailed placement, for editor viewing purposes.
  function UpdateStaticDetailedPlacementWithProfileInformation(
    spp: SOLDIERCREATE_STRUCT,
    ubProfile: UINT8,
  ): void {
    let cnt: UINT32;
    let pProfile: MERCPROFILESTRUCT;

    spp.ubProfile = ubProfile;

    pProfile = gMercProfiles[ubProfile];

    spp.HeadPal = SET_PALETTEREP_ID(pProfile.HAIR);
    spp.VestPal = SET_PALETTEREP_ID(pProfile.VEST);
    spp.SkinPal = SET_PALETTEREP_ID(pProfile.SKIN);
    spp.PantsPal = SET_PALETTEREP_ID(pProfile.PANTS);

    spp.name = pProfile.zNickname;

    spp.bLife = pProfile.bLife;
    spp.bLifeMax = pProfile.bLifeMax;
    spp.bAgility = pProfile.bAgility;
    spp.bLeadership = pProfile.bLeadership;
    spp.bDexterity = pProfile.bDexterity;
    spp.bStrength = pProfile.bStrength;
    spp.bWisdom = pProfile.bWisdom;
    spp.bExpLevel = pProfile.bExpLevel;
    spp.bMarksmanship = pProfile.bMarksmanship;
    spp.bMedical = pProfile.bMedical;
    spp.bMechanical = pProfile.bMechanical;
    spp.bExplosive = pProfile.bExplosive;

    spp.bBodyType = pProfile.ubBodyType;

    // Copy over inv if we want to
    for (cnt = 0; cnt < Enum261.NUM_INV_SLOTS; cnt++) {
      CreateItems(
        pProfile.inv[cnt],
        pProfile.bInvStatus[cnt],
        pProfile.bInvNumber[cnt],
        spp.Inv[cnt],
      );
    }
  }

  // When the editor modifies the soldier's relative attribute level,
  // this function is called to update that information.
  export function ModifySoldierAttributesWithNewRelativeLevel(
    s: SOLDIERTYPE,
    bRelativeAttributeLevel: INT8,
  ): void {
    let bBaseAttribute: INT8;
    // Set the experience level based on the relative attribute level
    // NOTE OF WARNING: THIS CURRENTLY IGNORES THE ENEMY CLASS (ADMIN/REG/ELITE) FOR CALCULATING LEVEL & ATTRIBUTES

    // Rel level 0: Lvl 1, 1: Lvl 2-3, 2: Lvl 4-5, 3: Lvl 6-7, 4: Lvl 8-9
    s.bExpLevel = 2 * bRelativeAttributeLevel + Random(2);

    s.bExpLevel = Math.max(1, s.bExpLevel); // minimum level of 1
    s.bExpLevel = Math.min(9, s.bExpLevel); // maximum level of 9

    // Set the minimum base attribute
    bBaseAttribute = 49 + 4 * s.bExpLevel;

    // Roll enemy's combat statistics, taking bExpLevel into account.
    // Stat range is currently 40-99, slightly bell-curved around the bExpLevel
    s.bLifeMax = bBaseAttribute + Random(9) + Random(8);
    s.bLife = s.bLifeMax;
    s.bAgility = bBaseAttribute + Random(9) + Random(8);
    s.bDexterity = bBaseAttribute + Random(9) + Random(8);
    s.bMarksmanship = bBaseAttribute + Random(9) + Random(8);
    s.bMedical = bBaseAttribute + Random(9) + Random(8);
    s.bMechanical = bBaseAttribute + Random(9) + Random(8);
    s.bExplosive = bBaseAttribute + Random(9) + Random(8);
    s.bLeadership = bBaseAttribute + Random(9) + Random(8);
    s.bStrength = bBaseAttribute + Random(9) + Random(8);
    s.bWisdom = bBaseAttribute + Random(9) + Random(8);
    s.bMorale = bBaseAttribute + Random(9) + Random(8);
  }

  export function ForceSoldierProfileID(
    pSoldier: SOLDIERTYPE,
    ubProfileID: UINT8,
  ): void {
    let CreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();

    CreateStruct.ubProfile = ubProfileID;

    TacticalCopySoldierFromProfile(pSoldier, CreateStruct);

    // Delete face and re-create
    DeleteSoldierFace(pSoldier);

    // Init face
    pSoldier.iFaceIndex = InitSoldierFace(pSoldier);

    // Update animation, palettes
    SetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

    // Re-Create palettes
    CreateSoldierPalettes(pSoldier);
  }

  const CENTRAL_GRIDNO = 13202;
  const CENTRAL_RADIUS = 30;

  function ReserveTacticalSoldierForAutoresolve(
    ubSoldierClass: UINT8,
  ): SOLDIERTYPE | null {
    let i: INT32;
    let iStart: INT32;
    let iEnd: INT32;
    let pSoldier: SOLDIERTYPE;
    // This code looks for a soldier of specified type that currently exists in tactical and
    // returns the pointer to that soldier.  This is used when copying the exact status of
    // all remaining enemy troops (or creatures) to finish the battle in autoresolve.  To
    // signify that the troop has already been reserved, we simply set their gridno to NOWHERE.
    if (ubSoldierClass != Enum262.SOLDIER_CLASS_CREATURE) {
      // use the enemy team
      iStart = gTacticalStatus.Team[ENEMY_TEAM].bFirstID;
      iEnd = gTacticalStatus.Team[ENEMY_TEAM].bLastID;
    } else {
      // use the creature team
      iStart = gTacticalStatus.Team[CREATURE_TEAM].bFirstID;
      iEnd = gTacticalStatus.Team[CREATURE_TEAM].bLastID;
    }
    for (i = iStart; i <= iEnd; i++) {
      if (
        MercPtrs[i].bActive &&
        MercPtrs[i].bInSector &&
        MercPtrs[i].bLife &&
        MercPtrs[i].sGridNo != NOWHERE
      ) {
        if (MercPtrs[i].ubSoldierClass == ubSoldierClass) {
          // reserve this soldier
          MercPtrs[i].sGridNo = NOWHERE;

          // Allocate and copy the soldier
          pSoldier = createSoldierType();
          copySoldierType(pSoldier, MercPtrs[i]);

          // Assign a bogus ID, then return it
          pSoldier.ubID = 255;
          return pSoldier;
        }
      }
    }
    return null;
  }

  // USED BY STRATEGIC AI and AUTORESOLVE
  export function TacticalCreateAdministrator(): SOLDIERTYPE | null {
    let bp: BASIC_SOLDIERCREATE_STRUCT = createBasicSoldierCreateStruct();
    let pp: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    let ubID: UINT8 = 0;
    let pSoldier: SOLDIERTYPE | null;

    if (guiCurrentScreen == Enum26.AUTORESOLVE_SCREEN && !gfPersistantPBI) {
      return ReserveTacticalSoldierForAutoresolve(
        Enum262.SOLDIER_CLASS_ADMINISTRATOR,
      );
    }

    bp.bRelativeAttributeLevel = RandomizeRelativeLevel(
      bp.bRelativeAttributeLevel,
      Enum262.SOLDIER_CLASS_ADMINISTRATOR,
    );
    bp.bRelativeEquipmentLevel = RandomizeRelativeLevel(
      bp.bRelativeEquipmentLevel,
      Enum262.SOLDIER_CLASS_ADMINISTRATOR,
    );
    bp.bTeam = ENEMY_TEAM;
    bp.bOrders = Enum241.SEEKENEMY;
    bp.bAttitude = Random(Enum242.MAXATTITUDES);
    bp.bBodyType = -1;
    bp.ubSoldierClass = Enum262.SOLDIER_CLASS_ADMINISTRATOR;
    CreateDetailedPlacementGivenBasicPlacementInfo(pp, bp);
    pSoldier = TacticalCreateSoldier(
      pp,
      createPointer(
        () => ubID,
        (v) => (ubID = v),
      ),
    );
    if (pSoldier) {
      // send soldier to centre of map, roughly
      pSoldier.sNoiseGridno =
        CENTRAL_GRIDNO +
        (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) +
        (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) * WORLD_COLS;
      pSoldier.ubNoiseVolume = MAX_MISC_NOISE_DURATION;
    }
    return pSoldier;
  }

  // USED BY STRATEGIC AI and AUTORESOLVE
  export function TacticalCreateArmyTroop(): SOLDIERTYPE | null {
    let bp: BASIC_SOLDIERCREATE_STRUCT = createBasicSoldierCreateStruct();
    let pp: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    let ubID: UINT8 = 0;
    let pSoldier: SOLDIERTYPE | null;

    if (guiCurrentScreen == Enum26.AUTORESOLVE_SCREEN && !gfPersistantPBI) {
      return ReserveTacticalSoldierForAutoresolve(Enum262.SOLDIER_CLASS_ARMY);
    }

    bp.bRelativeAttributeLevel = RandomizeRelativeLevel(
      bp.bRelativeAttributeLevel,
      Enum262.SOLDIER_CLASS_ARMY,
    );
    bp.bRelativeEquipmentLevel = RandomizeRelativeLevel(
      bp.bRelativeEquipmentLevel,
      Enum262.SOLDIER_CLASS_ARMY,
    );
    bp.bTeam = ENEMY_TEAM;
    bp.bOrders = Enum241.SEEKENEMY;
    bp.bAttitude = Random(Enum242.MAXATTITUDES);
    bp.bBodyType = -1;
    bp.ubSoldierClass = Enum262.SOLDIER_CLASS_ARMY;
    CreateDetailedPlacementGivenBasicPlacementInfo(pp, bp);
    pSoldier = TacticalCreateSoldier(
      pp,
      createPointer(
        () => ubID,
        (v) => (ubID = v),
      ),
    );
    if (pSoldier) {
      // send soldier to centre of map, roughly
      pSoldier.sNoiseGridno =
        CENTRAL_GRIDNO +
        (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) +
        (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) * WORLD_COLS;
      pSoldier.ubNoiseVolume = MAX_MISC_NOISE_DURATION;
    }
    return pSoldier;
  }

  // USED BY STRATEGIC AI and AUTORESOLVE
  export function TacticalCreateEliteEnemy(): SOLDIERTYPE | null {
    let bp: BASIC_SOLDIERCREATE_STRUCT = createBasicSoldierCreateStruct();
    let pp: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    let ubID: UINT8 = 0;
    let pSoldier: SOLDIERTYPE | null;

    if (guiCurrentScreen == Enum26.AUTORESOLVE_SCREEN && !gfPersistantPBI) {
      return ReserveTacticalSoldierForAutoresolve(Enum262.SOLDIER_CLASS_ELITE);
    }

    bp.bRelativeAttributeLevel = RandomizeRelativeLevel(
      bp.bRelativeAttributeLevel,
      Enum262.SOLDIER_CLASS_ELITE,
    );
    bp.bRelativeEquipmentLevel = RandomizeRelativeLevel(
      bp.bRelativeEquipmentLevel,
      Enum262.SOLDIER_CLASS_ELITE,
    );
    bp.bTeam = ENEMY_TEAM;
    bp.bOrders = Enum241.SEEKENEMY;
    bp.bAttitude = Random(Enum242.MAXATTITUDES);
    bp.bBodyType = -1;
    bp.ubSoldierClass = Enum262.SOLDIER_CLASS_ELITE;
    CreateDetailedPlacementGivenBasicPlacementInfo(pp, bp);

    // SPECIAL!  Certain events in the game can cause profiled NPCs to become enemies.  The two cases are
    // adding Mike and Iggy.  We will only add one NPC in any given combat and the conditions for setting
    // the associated facts are done elsewhere.  There is also another place where NPCs can get added, which
    // is in AddPlacementToWorld() used for inserting defensive enemies.
    // NOTE:  We don't want to add Mike or Iggy if this is being called from autoresolve!
    OkayToUpgradeEliteToSpecialProfiledEnemy(pp);

    pSoldier = TacticalCreateSoldier(
      pp,
      createPointer(
        () => ubID,
        (v) => (ubID = v),
      ),
    );
    if (pSoldier) {
      // send soldier to centre of map, roughly
      pSoldier.sNoiseGridno =
        CENTRAL_GRIDNO +
        (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) +
        (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) * WORLD_COLS;
      pSoldier.ubNoiseVolume = MAX_MISC_NOISE_DURATION;
    }
    return pSoldier;
  }

  export function TacticalCreateMilitia(
    ubMilitiaClass: UINT8,
  ): SOLDIERTYPE | null {
    let bp: BASIC_SOLDIERCREATE_STRUCT = createBasicSoldierCreateStruct();
    let pp: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    let ubID: UINT8 = 0;

    bp.bRelativeAttributeLevel = RandomizeRelativeLevel(
      bp.bRelativeAttributeLevel,
      ubMilitiaClass,
    );
    bp.bRelativeEquipmentLevel = RandomizeRelativeLevel(
      bp.bRelativeEquipmentLevel,
      ubMilitiaClass,
    );
    bp.bTeam = MILITIA_TEAM;
    bp.ubSoldierClass = ubMilitiaClass;
    bp.bOrders = Enum241.STATIONARY;
    bp.bAttitude = Random(Enum242.MAXATTITUDES);
    // bp.bAttitude = AGGRESSIVE;
    bp.bBodyType = -1;
    CreateDetailedPlacementGivenBasicPlacementInfo(pp, bp);
    return TacticalCreateSoldier(
      pp,
      createPointer(
        () => ubID,
        (v) => (ubID = v),
      ),
    );
  }

  export function TacticalCreateCreature(
    bCreatureBodyType: INT8,
  ): SOLDIERTYPE | null {
    let bp: BASIC_SOLDIERCREATE_STRUCT = createBasicSoldierCreateStruct();
    let pp: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    let ubID: UINT8 = 0;

    if (guiCurrentScreen == Enum26.AUTORESOLVE_SCREEN && !gfPersistantPBI) {
      return ReserveTacticalSoldierForAutoresolve(
        Enum262.SOLDIER_CLASS_CREATURE,
      );
    }

    bp.bRelativeAttributeLevel = RandomizeRelativeLevel(
      bp.bRelativeAttributeLevel,
      Enum262.SOLDIER_CLASS_CREATURE,
    );
    bp.bRelativeEquipmentLevel = RandomizeRelativeLevel(
      bp.bRelativeEquipmentLevel,
      Enum262.SOLDIER_CLASS_CREATURE,
    );
    bp.bTeam = CREATURE_TEAM;
    bp.ubSoldierClass = Enum262.SOLDIER_CLASS_CREATURE;
    bp.bOrders = Enum241.SEEKENEMY;
    bp.bAttitude = Enum242.AGGRESSIVE;
    bp.bBodyType = bCreatureBodyType;
    CreateDetailedPlacementGivenBasicPlacementInfo(pp, bp);
    return TacticalCreateSoldier(
      pp,
      createPointer(
        () => ubID,
        (v) => (ubID = v),
      ),
    );
  }

  export function RandomizeRelativeLevel(
    bRelLevel: INT8,
    ubSoldierClass: UINT8,
  ): INT8 {
    let ubLocationModifier: UINT8;
    let bRollModifier: INT8;
    let bRoll: INT8;
    let bAdjustedRoll: INT8;

    // We now adjust the relative level by location on the map, so enemies in NE corner will be generally very crappy (lots
    // of bad and poor, with avg about best), while enemies in the SW will have lots of great and good, with avg about as
    // lousy as it gets.  Militia are generally unmodified by distance, and never get bad or great at all.

    // this returns 0 to DIFF_FACTOR_PALACE_DISTANCE (0 to +30)
    ubLocationModifier = GetLocationModifier(ubSoldierClass);

    // convert to 0 to 10 (divide by 3), the subtract 5 to get a range of -5 to +5
    bRollModifier =
      Math.trunc(
        ubLocationModifier / Math.trunc(DIFF_FACTOR_PALACE_DISTANCE / 10),
      ) - 5;

    // roll a number from 0 to 9
    bRoll = Random(10);

    // adjust by the modifier (giving -5 to +14)
    bAdjustedRoll = bRoll + bRollModifier;

    if (SOLDIER_CLASS_MILITIA(ubSoldierClass)) {
      // Militia never get to roll bad/great results at all (to avoid great equipment drops from them if killed)
      bAdjustedRoll = Math.max(1, bAdjustedRoll);
      bAdjustedRoll = Math.min(8, bAdjustedRoll);
      if (IsAutoResolveActive()) {
        // Artificially strengthen militia strength for sake of gameplay
        bAdjustedRoll++;
      }
    } else {
      // max-min this to a range of 0-9
      bAdjustedRoll = Math.max(0, bAdjustedRoll);
      bAdjustedRoll = Math.min(9, bAdjustedRoll);
      if (IsAutoResolveActive()) {
        // Artificially weaken enemy/creature strength for sake of gameplay
        if (bAdjustedRoll > 0) {
          bAdjustedRoll--;
        }
      }
    }

    switch (bAdjustedRoll) {
      case 0:
        // bad
        bRelLevel = 0;
        break;
      case 1:
      case 2:
        // poor
        bRelLevel = 1;
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        // average
        bRelLevel = 2;
        break;
      case 7:
      case 8:
        // good
        bRelLevel = 3;
        break;
      case 9:
        // great
        bRelLevel = 4;
        break;

      default:
        Assert(false);
        bRelLevel = 2;
        break;
    }

    /*
          if( IsAutoResolveActive() )
          { //Artificially strengthen militia strength for sake of gameplay
                  if ( SOLDIER_CLASS_MILITIA( ubSoldierClass ) )
                  {
                          *pbRelLevel = 4;
                  }
                  else
                  {
                          *pbRelLevel = 0;
                  }
          }
  */

    return bRelLevel;
  }

  // This function shouldn't be called outside of tactical
  export function QuickCreateProfileMerc(
    bTeam: INT8,
    ubProfileID: UINT8,
  ): void {
    // Create guy # X
    let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    let sWorldX: INT16 = 0;
    let sWorldY: INT16 = 0;
    let sSectorX: INT16;
    let sSectorY: INT16;
    let sGridX: INT16 = 0;
    let sGridY: INT16 = 0;
    let ubID: UINT8 = 0;
    let usMapPos: UINT16;

    if (
      GetMouseXY(
        createPointer(
          () => sGridX,
          (v) => (sGridX = v),
        ),
        createPointer(
          () => sGridY,
          (v) => (sGridY = v),
        ),
      )
    ) {
      usMapPos = MAPROWCOLTOPOS(sGridY, sGridX);
      // Get Grid Coordinates of mouse
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
        )
      ) {
        ({ sSectorX, sSectorY } = GetCurrentWorldSector());

        MercCreateStruct.bTeam = bTeam;
        MercCreateStruct.ubProfile = ubProfileID;
        MercCreateStruct.sSectorX = sSectorX;
        MercCreateStruct.sSectorY = sSectorY;
        MercCreateStruct.bSectorZ = gbWorldSectorZ;
        MercCreateStruct.sInsertionGridNo = usMapPos;

        RandomizeNewSoldierStats(MercCreateStruct);

        if (
          TacticalCreateSoldier(
            MercCreateStruct,
            createPointer(
              () => ubID,
              (v) => (ubID = v),
            ),
          )
        ) {
          AddSoldierToSector(ubID);

          // So we can see them!
          AllTeamsLookForAll(NO_INTERRUPTS);
        }
      }
    }
  }

  function CopyProfileItems(
    pSoldier: SOLDIERTYPE,
    pCreateStruct: SOLDIERCREATE_STRUCT,
  ): void {
    let cnt: UINT32;
    let cnt2: UINT32;
    let pProfile: MERCPROFILESTRUCT;
    let Obj: OBJECTTYPE = createObjectType();
    let uiMoneyLeft: UINT32;
    let uiMoneyLimitInSlot: UINT32;
    let bSlot: INT8;

    pProfile = gMercProfiles[pCreateStruct.ubProfile];

    // Copy over inv if we want to
    if (pCreateStruct.fCopyProfileItemsOver || pSoldier.bTeam != OUR_TEAM) {
      if (pCreateStruct.fPlayerMerc) {
        // do some special coding to put stuff in the profile in better-looking
        // spots
        pSoldier.inv.forEach(resetObjectType);
        for (cnt = 0; cnt < Enum261.NUM_INV_SLOTS; cnt++) {
          if (pProfile.inv[cnt] != NOTHING) {
            CreateItems(
              pProfile.inv[cnt],
              pProfile.bInvStatus[cnt],
              pProfile.bInvNumber[cnt],
              Obj,
            );
            if (Item[Obj.usItem].fFlags & ITEM_ATTACHMENT) {
              // try to find the appropriate item to attach to!
              for (cnt2 = 0; cnt2 < Enum261.NUM_INV_SLOTS; cnt2++) {
                if (
                  pSoldier.inv[cnt2].usItem != NOTHING &&
                  ValidAttachment(Obj.usItem, pSoldier.inv[cnt2].usItem)
                ) {
                  AttachObject(null, pSoldier.inv[cnt2], Obj);
                  break;
                }
              }
              if (cnt2 == Enum261.NUM_INV_SLOTS) {
                // oh well, couldn't find anything to attach to!
                AutoPlaceObject(pSoldier, Obj, false);
              }
            } else {
              AutoPlaceObject(pSoldier, Obj, false);
            }
          }
        }
        pProfile.usOptionalGearCost = 0;
      } else {
        for (cnt = 0; cnt < Enum261.NUM_INV_SLOTS; cnt++) {
          if (pProfile.inv[cnt] != NOTHING) {
            if (Item[pProfile.inv[cnt]].usItemClass == IC_KEY) {
              // since keys depend on 2 values, they pretty much have to be hardcoded.
              // and if a case isn't handled here it's better to not give any key than
              // to provide one which doesn't work and would confuse everything.
              switch (pCreateStruct.ubProfile) {
                case Enum268.BREWSTER:
                  if (
                    pProfile.inv[cnt] >= Enum225.KEY_1 &&
                    pProfile.inv[cnt] <= Enum225.KEY_32
                  ) {
                    CreateKeyObject(
                      pSoldier.inv[cnt],
                      pProfile.bInvNumber[cnt],
                      19,
                    );
                  } else {
                    resetObjectType(pSoldier.inv[cnt]);
                  }
                  break;
                case Enum268.SKIPPER:
                  if (
                    pProfile.inv[cnt] >= Enum225.KEY_1 &&
                    pProfile.inv[cnt] <= Enum225.KEY_32
                  ) {
                    CreateKeyObject(
                      pSoldier.inv[cnt],
                      pProfile.bInvNumber[cnt],
                      11,
                    );
                  } else {
                    resetObjectType(pSoldier.inv[cnt]);
                  }
                  break;
                case Enum268.DOREEN:
                  if (
                    pProfile.inv[cnt] >= Enum225.KEY_1 &&
                    pProfile.inv[cnt] <= Enum225.KEY_32
                  ) {
                    CreateKeyObject(
                      pSoldier.inv[cnt],
                      pProfile.bInvNumber[cnt],
                      32,
                    );
                  } else {
                    resetObjectType(pSoldier.inv[cnt]);
                  }
                  break;
                default:
                  resetObjectType(pSoldier.inv[cnt]);
                  break;
              }
            } else {
              CreateItems(
                pProfile.inv[cnt],
                pProfile.bInvStatus[cnt],
                pProfile.bInvNumber[cnt],
                pSoldier.inv[cnt],
              );
            }
            if (
              pProfile.inv[cnt] == Enum225.ROCKET_RIFLE ||
              pProfile.inv[cnt] == Enum225.AUTO_ROCKET_RIFLE
            ) {
              pSoldier.inv[cnt].ubImprintID = pSoldier.ubProfile;
            }
            if (gubItemDroppableFlag[cnt]) {
              if (pProfile.ubInvUndroppable & gubItemDroppableFlag[cnt]) {
                pSoldier.inv[cnt].fFlags |= OBJECT_UNDROPPABLE;
              }
            }
          } else {
            resetObjectType(pSoldier.inv[cnt]);
          }
        }
        if (pProfile.uiMoney > 0) {
          uiMoneyLeft = pProfile.uiMoney;
          bSlot = FindEmptySlotWithin(
            pSoldier,
            Enum261.BIGPOCK1POS,
            Enum261.SMALLPOCK8POS,
          );

          // add in increments of
          while (bSlot != NO_SLOT) {
            uiMoneyLimitInSlot = MAX_MONEY_PER_SLOT;
            if (bSlot >= Enum261.SMALLPOCK1POS) {
              uiMoneyLimitInSlot = Math.trunc(uiMoneyLimitInSlot / 2);
            }

            CreateItem(Enum225.MONEY, 100, pSoldier.inv[bSlot]);
            if (uiMoneyLeft > uiMoneyLimitInSlot) {
              // fill pocket with money
              pSoldier.inv[bSlot].uiMoneyAmount = uiMoneyLimitInSlot;
              uiMoneyLeft -= uiMoneyLimitInSlot;
            } else {
              pSoldier.inv[bSlot].uiMoneyAmount = uiMoneyLeft;
              // done!
              break;
            }

            bSlot = FindEmptySlotWithin(
              pSoldier,
              Enum261.BIGPOCK1POS,
              Enum261.SMALLPOCK8POS,
            );
          }
        }
      }
    }
  }

  // SPECIAL!  Certain events in the game can cause profiled NPCs to become enemies.  The two cases are
  // adding Mike and Iggy.  We will only add one NPC in any given combat and the conditions for setting
  // the associated facts are done elsewhere.  The function will set the profile for the SOLDIERCREATE_STRUCT
  // and the rest will be handled automatically so long the ubProfile field doesn't get changed.
  // NOTE:  We don't want to add Mike or Iggy if this is being called from autoresolve!
  export function OkayToUpgradeEliteToSpecialProfiledEnemy(
    pp: SOLDIERCREATE_STRUCT,
  ): void {
    if (
      !gfProfiledEnemyAdded &&
      gubEnemyEncounterCode != Enum164.ENEMY_ENCOUNTER_CODE &&
      gubEnemyEncounterCode != Enum164.ENEMY_INVASION_CODE
    ) {
      if (gubFact[Enum170.FACT_MIKE_AVAILABLE_TO_ARMY] == 1 && !pp.fOnRoof) {
        gubFact[Enum170.FACT_MIKE_AVAILABLE_TO_ARMY] = 2; // so it fails all subsequent checks
        pp.ubProfile = Enum268.MIKE;
        gfProfiledEnemyAdded = true;
      } else if (
        gubFact[Enum170.FACT_IGGY_AVAILABLE_TO_ARMY] == 1 &&
        !pp.fOnRoof
      ) {
        gubFact[Enum170.FACT_IGGY_AVAILABLE_TO_ARMY] = 2; // so it fails all subsequent checks
        pp.ubProfile = Enum268.IGGY;
        gfProfiledEnemyAdded = true;
      }
    }
  }

  export function TrashAllSoldiers(): void {
    let cnt: INT32;
    let pSoldier: SOLDIERTYPE;

    cnt = 0;

    for (
      pSoldier = MercPtrs[cnt];
      cnt < MAX_NUM_SOLDIERS;
      cnt++, pSoldier = MercPtrs[cnt]
    ) {
      if (pSoldier.bActive) {
        // Delete from world
        TacticalRemoveSoldier(cnt);
      }
    }
  }

  function GetLocationModifier(ubSoldierClass: UINT8): UINT8 {
    let ubLocationModifier: UINT8;
    let ubPalaceDistance: UINT8;
    let sSectorX: INT16;
    let sSectorY: INT16;
    let sSectorZ: INT16;
    let bTownId: INT8;
    let fSuccess: boolean;

    // where is all this taking place?
    ({ sSectorX, sSectorY, sSectorZ } = GetCurrentBattleSectorXYZ());

    // ignore sSectorZ - treat any underground enemies as if they were on the surface!
    bTownId = GetTownIdForSector(sSectorX, sSectorY);

    switch (bTownId) {
      case Enum135.ORTA:
      case Enum135.TIXA:
        // enemy troops in these special places are stronger than geography would indicate
        ubPalaceDistance = 4;
        break;

      case Enum135.ALMA:
        // enemy troops in these special places are stronger than geography would indicate
        ubPalaceDistance = 10;
        break;

      default:
        // how far is this sector from the palace ?
        // the distance returned is in sectors, and the possible range is about 0-20
        ubPalaceDistance = GetPythDistanceFromPalace(sSectorX, sSectorY);
        if (ubPalaceDistance > MAX_PALACE_DISTANCE) {
          ubPalaceDistance = MAX_PALACE_DISTANCE;
        }
    }

    // adjust for distance from Queen's palace (P3) (0 to +30)
    ubLocationModifier = Math.trunc(
      ((MAX_PALACE_DISTANCE - ubPalaceDistance) * DIFF_FACTOR_PALACE_DISTANCE) /
        MAX_PALACE_DISTANCE,
    );

    return ubLocationModifier;
  }

  // grab the distance from the palace
  function GetPythDistanceFromPalace(sSectorX: INT16, sSectorY: INT16): UINT8 {
    let ubDistance: UINT8 = 0;
    let sRows: INT16 = 0;
    let sCols: INT16 = 0;
    let fValue: FLOAT = 0.0;

    // grab number of rows and cols
    sRows = Math.abs(sSectorX - PALACE_SECTOR_X);
    sCols = Math.abs(sSectorY - PALACE_SECTOR_Y);

    // apply Pythagoras's theorem for right-handed triangle:
    // dist^2 = rows^2 + cols^2, so use the square root to get the distance
    fValue = Math.sqrt(sRows * sRows + sCols * sCols);

    if (fValue % 1.0 >= 0.5) {
      ubDistance = Math.trunc(1 + fValue);
    } else {
      ubDistance = Math.trunc(fValue);
    }

    return ubDistance;
  }

  function ReduceHighExpLevels(bExpLevel: INT8): INT8 {
    let ubRoll: UINT8;
    // important: must reset these to 0 by default for logic to work!
    let ubChanceLvl8: UINT8 = 0;
    let ubChanceLvl7: UINT8 = 0;
    let ubChanceLvl6: UINT8 = 0;
    let ubChanceLvl5: UINT8 = 0;

    // this function reduces the experience levels of very high level enemies to something that player can compete with
    // for interrupts.  It doesn't affect attributes and skills, those are rolled prior to this reduction!

    // adjust for game difficulty level
    switch (gGameOptions.ubDifficultyLevel) {
      case Enum9.DIF_LEVEL_EASY:
        // max level: 6
        switch (bExpLevel) {
          case 6:
            ubChanceLvl6 = 25;
            ubChanceLvl5 = 100;
            break;
          case 7:
            ubChanceLvl6 = 50;
            ubChanceLvl5 = 100;
            break;
          case 8:
            ubChanceLvl6 = 75;
            ubChanceLvl5 = 100;
            break;
          case 9:
            ubChanceLvl6 = 100;
            break;
        }
        break;

      case Enum9.DIF_LEVEL_MEDIUM:
        // max level: 7
        switch (bExpLevel) {
          case 7:
            ubChanceLvl7 = 25;
            ubChanceLvl6 = 100;
            break;
          case 8:
            ubChanceLvl7 = 50;
            ubChanceLvl6 = 100;
            break;
          case 9:
            ubChanceLvl7 = 75;
            ubChanceLvl6 = 100;
            break;
        }
        break;

      case Enum9.DIF_LEVEL_HARD:
        // max level: 8
        switch (bExpLevel) {
          case 8:
            ubChanceLvl8 = 25;
            ubChanceLvl7 = 100;
            break;
          case 9:
            ubChanceLvl8 = 50;
            ubChanceLvl7 = 100;
            break;
        }
        break;
    }

    ubRoll = Random(100);

    if (ubRoll < ubChanceLvl8) bExpLevel = 8;
    else if (ubRoll < ubChanceLvl7) bExpLevel = 7;
    else if (ubRoll < ubChanceLvl6) bExpLevel = 6;
    else if (ubRoll < ubChanceLvl5) bExpLevel = 5;
    // else leave it alone

    return bExpLevel;
  }
}
