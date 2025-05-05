namespace ja2 {
  export function EffectiveStrength(pSoldier: SOLDIERTYPE): INT8 {
    let bBandaged: INT8;
    let iEffStrength: INT32;

    // Effective strength is:
    // 1/2 full strength
    // plus 1/2 strength scaled according to how hurt we are
    bBandaged = pSoldier.bLifeMax - pSoldier.bLife - pSoldier.bBleeding;
    iEffStrength = Math.trunc(pSoldier.bStrength / 2);
    iEffStrength +=
      Math.trunc(pSoldier.bStrength / 2) *
      Math.trunc(
        (pSoldier.bLife + Math.trunc(bBandaged / 2)) / pSoldier.bLifeMax,
      );

    // ATE: Make sure at least 2...
    iEffStrength = Math.max(iEffStrength, 2);

    return iEffStrength;
  }

  export function EffectiveWisdom(pSoldier: SOLDIERTYPE): INT8 {
    let iEffWisdom: INT32;

    iEffWisdom = pSoldier.bWisdom;

    iEffWisdom = EffectStatForBeingDrunk(pSoldier, iEffWisdom);

    return iEffWisdom;
  }

  export function EffectiveAgility(pSoldier: SOLDIERTYPE): INT8 {
    let iEffAgility: INT32;

    iEffAgility = pSoldier.bAgility;

    iEffAgility = EffectStatForBeingDrunk(pSoldier, iEffAgility);

    if (pSoldier.sWeightCarriedAtTurnStart > 100) {
      iEffAgility = Math.trunc(
        (iEffAgility * 100) / pSoldier.sWeightCarriedAtTurnStart,
      );
    }

    return iEffAgility;
  }

  export function EffectiveMechanical(pSoldier: SOLDIERTYPE): INT8 {
    let iEffMechanical: INT32;

    iEffMechanical = pSoldier.bMechanical;

    iEffMechanical = EffectStatForBeingDrunk(pSoldier, iEffMechanical);

    return iEffMechanical;
  }

  export function EffectiveExplosive(pSoldier: SOLDIERTYPE): INT8 {
    let iEffExplosive: INT32;

    iEffExplosive = pSoldier.bExplosive;

    iEffExplosive = EffectStatForBeingDrunk(pSoldier, iEffExplosive);

    return iEffExplosive;
  }

  export function EffectiveMedical(pSoldier: SOLDIERTYPE): INT8 {
    let iEffMedical: INT32;

    iEffMedical = pSoldier.bMedical;

    iEffMedical = EffectStatForBeingDrunk(pSoldier, iEffMedical);

    return iEffMedical;
  }

  export function EffectiveLeadership(pSoldier: SOLDIERTYPE): INT8 {
    let iEffLeadership: INT32;
    let bDrunkLevel: INT8;

    iEffLeadership = pSoldier.bLeadership;

    // if we are drunk, effect leader ship in a +ve way...
    bDrunkLevel = GetDrunkLevel(pSoldier);

    if (bDrunkLevel == FEELING_GOOD) {
      iEffLeadership = Math.trunc((iEffLeadership * 120) / 100);
    }

    return iEffLeadership;
  }

  export function EffectiveExpLevel(pSoldier: SOLDIERTYPE): INT8 {
    let iEffExpLevel: INT32;
    let bDrunkLevel: INT8;
    let iExpModifier: INT32[] /* [] */ = [
      0, // SOBER
      0, // Feeling good
      -1, // Borderline
      -2, // Drunk
      0, // Hung
    ];

    iEffExpLevel = pSoldier.bExpLevel;

    bDrunkLevel = GetDrunkLevel(pSoldier);

    iEffExpLevel = iEffExpLevel + iExpModifier[bDrunkLevel];

    if (pSoldier.ubProfile != NO_PROFILE) {
      if (
        gMercProfiles[pSoldier.ubProfile].bPersonalityTrait ==
          Enum270.CLAUSTROPHOBIC &&
        pSoldier.bActive &&
        pSoldier.bInSector &&
        gbWorldSectorZ > 0
      ) {
        // claustrophobic!
        iEffExpLevel--;
      }
    }

    if (iEffExpLevel < 1) {
      // can't go below 1
      return 1;
    } else {
      return iEffExpLevel;
    }
  }

  export function EffectiveMarksmanship(pSoldier: SOLDIERTYPE): INT8 {
    let iEffMarksmanship: INT32;

    iEffMarksmanship = pSoldier.bMarksmanship;

    iEffMarksmanship = EffectStatForBeingDrunk(pSoldier, iEffMarksmanship);

    return iEffMarksmanship;
  }

  export function EffectiveDexterity(pSoldier: SOLDIERTYPE): INT8 {
    let iEffDexterity: INT32;

    iEffDexterity = pSoldier.bDexterity;

    iEffDexterity = EffectStatForBeingDrunk(pSoldier, iEffDexterity);

    return iEffDexterity;
  }

  function GetPenaltyForFatigue(pSoldier: SOLDIERTYPE): UINT8 {
    let ubPercentPenalty: UINT8;

    if (pSoldier.bBreathMax >= 85) ubPercentPenalty = 0;
    else if (pSoldier.bBreathMax >= 70) ubPercentPenalty = 10;
    else if (pSoldier.bBreathMax >= 50) ubPercentPenalty = 25;
    else if (pSoldier.bBreathMax >= 30) ubPercentPenalty = 50;
    else if (pSoldier.bBreathMax >= 15) ubPercentPenalty = 75;
    else if (pSoldier.bBreathMax > 0) ubPercentPenalty = 90;
    else ubPercentPenalty = 100;

    return ubPercentPenalty;
  }

  export function ReducePointsForFatigue(
    pSoldier: SOLDIERTYPE,
    usPoints: UINT16,
  ): UINT16 {
    usPoints -= Math.trunc((usPoints * GetPenaltyForFatigue(pSoldier)) / 100);
    return usPoints;
  }

  export function GetSkillCheckPenaltyForFatigue(
    pSoldier: SOLDIERTYPE,
    iSkill: INT32,
  ): INT32 {
    // use only half the full effect of fatigue for skill checks
    return Math.trunc((iSkill * GetPenaltyForFatigue(pSoldier)) / 100 / 2);
  }

  export function SkillCheck(
    pSoldier: SOLDIERTYPE,
    bReason: INT8,
    bChanceMod: INT8,
  ): INT32 {
    let iSkill: INT32;
    let iChance: INT32;
    let iReportChance: INT32;
    let iRoll: INT32;
    let iMadeItBy: INT32;
    let bSlot: INT8;
    let iLoop: INT32;
    let pTeamSoldier: SOLDIERTYPE;
    let bBuddyIndex: INT8;
    let fForceDamnSound: boolean = false;

    iReportChance = -1;

    switch (bReason) {
      case Enum255.LOCKPICKING_CHECK:
      case Enum255.ELECTRONIC_LOCKPICKING_CHECK:
        fForceDamnSound = true;

        iSkill = EffectiveMechanical(pSoldier);
        if (iSkill == 0) {
          break;
        }
        // adjust skill based on wisdom (knowledge)
        iSkill = Math.trunc((iSkill * (EffectiveWisdom(pSoldier) + 100)) / 200);
        // and dexterity (clumsy?)
        iSkill = Math.trunc(
          (iSkill * (EffectiveDexterity(pSoldier) + 100)) / 200,
        );
        // factor in experience
        iSkill = iSkill + EffectiveExpLevel(pSoldier) * 3;
        if (HAS_SKILL_TRAIT(pSoldier, Enum269.LOCKPICKING)) {
          // if we specialize in picking locks...
          iSkill +=
            gbSkillTraitBonus[Enum269.LOCKPICKING] *
            NUM_SKILL_TRAITS(pSoldier, Enum269.LOCKPICKING);
        }
        if (
          bReason == Enum255.ELECTRONIC_LOCKPICKING_CHECK &&
          !HAS_SKILL_TRAIT(pSoldier, Enum269.ELECTRONICS)
        ) {
          // if we are unfamiliar with electronics...
          iSkill = Math.trunc(iSkill / 2);
        }
        // adjust chance based on status of kit
        bSlot = FindObj(pSoldier, Enum225.LOCKSMITHKIT);
        if (bSlot == NO_SLOT) {
          // this should never happen, but might as well check...
          iSkill = 0;
        }
        iSkill = Math.trunc((iSkill * pSoldier.inv[bSlot].bStatus[0]) / 100);
        break;
      case Enum255.ATTACHING_DETONATOR_CHECK:
      case Enum255.ATTACHING_REMOTE_DETONATOR_CHECK:
        iSkill = EffectiveExplosive(pSoldier);
        if (iSkill == 0) {
          break;
        }
        iSkill = Math.trunc((iSkill * 3 + EffectiveDexterity(pSoldier)) / 4);
        if (
          bReason == Enum255.ATTACHING_REMOTE_DETONATOR_CHECK &&
          !HAS_SKILL_TRAIT(pSoldier, Enum269.ELECTRONICS)
        ) {
          iSkill = Math.trunc(iSkill / 2);
        }
        break;
      case Enum255.PLANTING_BOMB_CHECK:
      case Enum255.PLANTING_REMOTE_BOMB_CHECK:
        iSkill = EffectiveExplosive(pSoldier) * 7;
        iSkill += EffectiveWisdom(pSoldier) * 2;
        iSkill += EffectiveExpLevel(pSoldier) * 10;
        iSkill = Math.trunc(iSkill / 10); // bring the value down to a percentage

        if (
          bReason == Enum255.PLANTING_REMOTE_BOMB_CHECK &&
          !HAS_SKILL_TRAIT(pSoldier, Enum269.ELECTRONICS)
        ) {
          // deduct only a bit...
          iSkill = Math.trunc((iSkill * 3) / 4);
        }

        // Ok, this is really damn easy, so skew the values...
        // e.g. if calculated skill is 84, skewed up to 96
        // 51 to 84
        // 22 stays as is
        iSkill = Math.trunc(
          (iSkill + Math.trunc(100 * (iSkill / 25))) /
            Math.trunc(iSkill / 25 + 1),
        );
        break;

      case Enum255.DISARM_TRAP_CHECK:
        fForceDamnSound = true;

        iSkill = EffectiveExplosive(pSoldier) * 7;
        if (iSkill == 0) {
          break;
        }
        iSkill += EffectiveDexterity(pSoldier) * 2;
        iSkill += EffectiveExpLevel(pSoldier) * 10;
        iSkill = Math.trunc(iSkill / 10); // bring the value down to a percentage
        // penalty based on poor wisdom
        iSkill -= Math.trunc((100 - EffectiveWisdom(pSoldier)) / 5);
        break;

      case Enum255.DISARM_ELECTRONIC_TRAP_CHECK:
        fForceDamnSound = true;

        iSkill =
          Math.max(
            EffectiveMechanical(pSoldier),
            EffectiveExplosive(pSoldier),
          ) * 7;
        if (iSkill == 0) {
          break;
        }
        iSkill += EffectiveDexterity(pSoldier) * 2;
        iSkill += EffectiveExpLevel(pSoldier) * 10;
        iSkill = Math.trunc(iSkill / 10); // bring the value down to a percentage
        // penalty based on poor wisdom
        iSkill -= Math.trunc((100 - EffectiveWisdom(pSoldier)) / 5);

        if (!HAS_SKILL_TRAIT(pSoldier, Enum269.ELECTRONICS)) {
          iSkill = Math.trunc((iSkill * 3) / 4);
        }
        break;

      case Enum255.OPEN_WITH_CROWBAR:
        // Add for crowbar...
        iSkill = EffectiveStrength(pSoldier) + 20;
        fForceDamnSound = true;
        break;

      case Enum255.SMASH_DOOR_CHECK:
        iSkill = EffectiveStrength(pSoldier);
        break;
      case Enum255.UNJAM_GUN_CHECK:
        iSkill = 30 + Math.trunc(EffectiveMechanical(pSoldier) / 2);
        break;
      case Enum255.NOTICE_DART_CHECK:
        // only a max of ~20% chance
        iSkill =
          Math.trunc(EffectiveWisdom(pSoldier) / 10) +
          EffectiveExpLevel(pSoldier);
        break;
      case Enum255.LIE_TO_QUEEN_CHECK:
        // competitive check vs the queen's wisdom and leadership... poor guy!
        iSkill =
          50 *
          Math.trunc(
            (EffectiveWisdom(pSoldier) + EffectiveLeadership(pSoldier)) /
              (gMercProfiles[Enum268.QUEEN].bWisdom +
                gMercProfiles[Enum268.QUEEN].bLeadership),
          );
        break;
      case Enum255.ATTACHING_SPECIAL_ITEM_CHECK:
      case Enum255.ATTACHING_SPECIAL_ELECTRONIC_ITEM_CHECK:
        iSkill = EffectiveMechanical(pSoldier);
        if (iSkill == 0) {
          break;
        }
        // adjust skill based on wisdom (knowledge)
        iSkill = Math.trunc((iSkill * (EffectiveWisdom(pSoldier) + 100)) / 200);
        // and dexterity (clumsy?)
        iSkill = Math.trunc(
          (iSkill * (EffectiveDexterity(pSoldier) + 100)) / 200,
        );
        // factor in experience
        iSkill = iSkill + EffectiveExpLevel(pSoldier) * 3;
        if (
          bReason == Enum255.ATTACHING_SPECIAL_ELECTRONIC_ITEM_CHECK &&
          !HAS_SKILL_TRAIT(pSoldier, Enum269.ELECTRONICS)
        ) {
          // if we are unfamiliar with electronics...
          iSkill = Math.trunc(iSkill / 2);
        }
        break;
      default:
        iSkill = 0;
        break;
    }

    iSkill -= GetSkillCheckPenaltyForFatigue(pSoldier, iSkill);

    iChance = iSkill + bChanceMod;

    switch (bReason) {
      case Enum255.LOCKPICKING_CHECK:
      case Enum255.ELECTRONIC_LOCKPICKING_CHECK:
      case Enum255.DISARM_TRAP_CHECK:
      case Enum255.DISARM_ELECTRONIC_TRAP_CHECK:
      case Enum255.OPEN_WITH_CROWBAR:
      case Enum255.SMASH_DOOR_CHECK:
      case Enum255.ATTACHING_SPECIAL_ITEM_CHECK:
      case Enum255.ATTACHING_SPECIAL_ELECTRONIC_ITEM_CHECK:
        // for lockpicking and smashing locks, if the chance isn't reasonable
        // we set it to 0 so they can never get through the door if they aren't
        // good enough
        if (iChance < 30) {
          iChance = 0;
          break;
        }
      // else fall through
      default:
        iChance += GetMoraleModifier(pSoldier);
        break;
    }

    if (iChance > 99) {
      iChance = 99;
    } else if (iChance < 0) {
      iChance = 0;
    }

    iRoll = PreRandom(100);
    iMadeItBy = iChance - iRoll;
    if (iMadeItBy < 0) {
      if (
        pSoldier.bLastSkillCheck == bReason &&
        pSoldier.sGridNo == pSoldier.sSkillCheckGridNo
      ) {
        pSoldier.ubSkillCheckAttempts++;
        if (pSoldier.ubSkillCheckAttempts > 2) {
          if (iChance == 0) {
            // do we realize that we just can't do this?
            if (
              100 - (pSoldier.ubSkillCheckAttempts - 2) * 20 <
              EffectiveWisdom(pSoldier)
            ) {
              // say "I can't do this" quote
              TacticalCharacterDialogue(
                pSoldier,
                Enum202.QUOTE_DEFINITE_CANT_DO,
              );
              return iMadeItBy;
            }
          }
        }
      } else {
        pSoldier.bLastSkillCheck = bReason;
        pSoldier.ubSkillCheckAttempts = 1;
        pSoldier.sSkillCheckGridNo = pSoldier.sGridNo;
      }

      if (fForceDamnSound || Random(100) < 40) {
        switch (bReason) {
          case Enum255.UNJAM_GUN_CHECK:
          case Enum255.NOTICE_DART_CHECK:
          case Enum255.LIE_TO_QUEEN_CHECK:
            // silent check
            break;
          default:
            DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
            break;
        }
      }
    } else {
      // A buddy might make a positive comment based on our success;
      // Increase the chance for people with higher skill and for more difficult tasks
      iChance = 15 + Math.trunc(iSkill / 20) + Math.trunc(-bChanceMod / 20);
      if (iRoll < iChance) {
        // If a buddy of this merc is standing around nearby, they'll make a positive comment.
        iLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
        for (
          pTeamSoldier = MercPtrs[iLoop];
          iLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID;
          iLoop++, pTeamSoldier = MercPtrs[iLoop]
        ) {
          if (OK_INSECTOR_MERC(pTeamSoldier)) {
            bBuddyIndex = WhichBuddy(
              pTeamSoldier.ubProfile,
              pSoldier.ubProfile,
            );
            if (
              bBuddyIndex >= 0 &&
              SpacesAway(pSoldier.sGridNo, pTeamSoldier.sGridNo) < 15
            ) {
              switch (bBuddyIndex) {
                case 0:
                  // buddy #1 did something good!
                  TacticalCharacterDialogue(
                    pTeamSoldier,
                    Enum202.QUOTE_BUDDY_1_GOOD,
                  );
                  break;
                case 1:
                  // buddy #2 did something good!
                  TacticalCharacterDialogue(
                    pTeamSoldier,
                    Enum202.QUOTE_BUDDY_2_GOOD,
                  );
                  break;
                case 2:
                  // learn to like buddy did something good!
                  TacticalCharacterDialogue(
                    pTeamSoldier,
                    Enum202.QUOTE_LEARNED_TO_LIKE_WITNESSED,
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
    return iMadeItBy;
  }

  export function CalcTrapDetectLevel(
    pSoldier: SOLDIERTYPE,
    fExamining: boolean,
  ): INT8 {
    // return the level of trap which the guy is able to detect

    let bDetectLevel: INT8;

    // formula: 1 pt for every exp_level
    //     plus 1 pt for every 40 explosives
    //     less 1 pt for every 20 wisdom MISSING

    bDetectLevel = EffectiveExpLevel(pSoldier);
    bDetectLevel += Math.trunc(EffectiveExplosive(pSoldier) / 40);
    bDetectLevel -= Math.trunc((100 - EffectiveWisdom(pSoldier)) / 20);

    // if the examining flag is true, this isn't just a casual glance
    // and the merc should have a higher chance
    if (fExamining) {
      bDetectLevel += PreRandom(Math.trunc(bDetectLevel / 3) + 2);
    }

    // if substantially bleeding, or still in serious shock, randomly lower value
    if (pSoldier.bBleeding > 20 || pSoldier.bShock > 1) {
      bDetectLevel -= PreRandom(3);
    }

    if (bDetectLevel < 1) {
      bDetectLevel = 1;
    }

    return bDetectLevel;
  }
}
