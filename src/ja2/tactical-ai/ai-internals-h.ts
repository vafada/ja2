namespace ja2 {
  // THIS IS AN ITEM #  - AND FOR NOW JUST COMPLETELY FAKE...

  export const MAX_TOSS_SEARCH_DIST = 1; // must throw within this of opponent
  const NPC_TOSS_SAFETY_MARGIN = 4; // all friends must be this far away

  export const ACTING_ON_SCHEDULE = (p: SOLDIERTYPE) =>
    p.fAIFlags & AI_CHECK_SCHEDULE;

  // the AI should try to have this many APs before climbing a roof, if possible
  const AI_AP_CLIMBROOF = 15;

  export const TEMPORARILY = 0;
  export const FOREVER = 1;

  export const IGNORE_PATH = 0;
  export const ENSURE_PATH = 1;
  export const ENSURE_PATH_COST = 2;

  // Kris:  November 10, 1997
  // Please don't change this value from 10.  It will invalidate all of the maps and soldiers.
  export const MAXPATROLGRIDS = 10;

  export const NOWATER = 0;
  export const WATEROK = 1;

  export const DONTADDTURNCOST = 0;
  export const ADDTURNCOST = 1;

  export const enum Enum292 {
    URGENCY_LOW = 0,
    URGENCY_MED,
    URGENCY_HIGH,
    NUM_URGENCY_STATES,
  }

  export const MAX_ROAMING_RANGE = WORLD_COLS;

  export const PTR_CIV_OR_MILITIA = (pSoldier: SOLDIERTYPE) =>
    PTR_CIVILIAN(pSoldier) || pSoldier.bTeam == MILITIA_TEAM;

  export const REALTIME_AI_DELAY = () => 10000 + Random(1000);
  export const REALTIME_CIV_AI_DELAY = () =>
    1000 *
      (gTacticalStatus.Team[MILITIA_TEAM].bMenInSector +
        gTacticalStatus.Team[CIV_TEAM].bMenInSector) +
    5000 +
    2000 * Random(3);
  export const REALTIME_CREATURE_AI_DELAY = () => 10000 + 1000 * Random(3);

  //#define PLAYINGMODE             0
  //#define CAMPAIGNLENGTH          1
  //#define LASTUSABLESLOT          2
  //#define RANDOMMERCS             3
  //#define AVAILABLEMERCS          4
  //#define HIRINGKNOWLEDGE         5
  //#define EQUIPMENTLEVEL          6
  //#define ENEMYTEAMSIZE           7
  const ENEMYDIFFICULTY = 8; // this is being used in this module
  //#define FOG_OF_WAR              9
  //#define TURNLENGTH              10
  //#define INCREASEDAP             11
  //#define BLOODSTAINS             12
  //#define STARTINGBALANCE         13
  const MAXGAMEOPTIONS = 14;

  const NOSHOOT_WAITABIT = -1;
  export const NOSHOOT_WATER = -2;
  export const NOSHOOT_MYSELF = -3;
  const NOSHOOT_HURT = -4;
  export const NOSHOOT_NOAMMO = -5;
  export const NOSHOOT_NOLOAD = -6;
  export const NOSHOOT_NOWEAPON = -7;

  export const PERCENT_TO_IGNORE_THREAT = 50; // any less, use threat value
  const ACTION_TIMEOUT_CYCLES = 50; // # failed cycles through AI
  export const MAX_THREAT_RANGE = 400; // 30 tiles worth
  export const MIN_PERCENT_BETTER = 5; // 5% improvement in cover is good

  const TOSSES_PER_10TURNS = 18; // max # of grenades tossable in 10 turns
  const SHELLS_PER_10TURNS = 13; // max # of shells   firable  in 10 turns

  export const SEE_THRU_COVER_THRESHOLD = 5; // min chance to get through

  export interface THREATTYPE {
    pOpponent: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */;
    sGridNo: INT16;
    iValue: INT32;
    iAPs: INT32;
    iCertainty: INT32;
    iOrigRange: INT32;
  }

  export function createThreatType(): THREATTYPE {
    return {
      pOpponent: <SOLDIERTYPE>(<unknown>null),
      sGridNo: 0,
      iValue: 0,
      iAPs: 0,
      iCertainty: 0,
      iOrigRange: 0,
    };
  }

  // define for bAimTime for bursting
  export const BURSTING = 5;

  export interface ATTACKTYPE {
    ubPossible: boolean /* UINT8 */; // is this attack form possible?  T/F
    ubOpponent: UINT8; // which soldier is the victim?
    ubAimTime: UINT8; // how many extra APs to spend on aiming
    ubChanceToReallyHit: UINT8; // chance to hit * chance to get through cover
    iAttackValue: INT32; // relative worthiness of this type of attack
    sTarget: INT16; // target gridno of this attack
    bTargetLevel: INT8; // target level of this attack
    ubAPCost: UINT8; // how many APs the attack will use up
    bWeaponIn: INT8; // the inv slot of the weapon in question
  }

  export function createAttackType(): ATTACKTYPE {
    return {
      ubPossible: false,
      ubOpponent: 0,
      ubAimTime: 0,
      ubChanceToReallyHit: 0,
      iAttackValue: 0,
      sTarget: 0,
      bTargetLevel: 0,
      ubAPCost: 0,
      bWeaponIn: 0,
    };
  }

  export function resetAttackType(o: ATTACKTYPE) {
    o.ubPossible = false;
    o.ubOpponent = 0;
    o.ubAimTime = 0;
    o.ubChanceToReallyHit = 0;
    o.iAttackValue = 0;
    o.sTarget = 0;
    o.bTargetLevel = 0;
    o.ubAPCost = 0;
    o.bWeaponIn = 0;
  }

  export function copyAttackType(destination: ATTACKTYPE, source: ATTACKTYPE) {
    destination.ubPossible = source.ubPossible;
    destination.ubOpponent = source.ubOpponent;
    destination.ubAimTime = source.ubAimTime;
    destination.ubChanceToReallyHit = source.ubChanceToReallyHit;
    destination.iAttackValue = source.iAttackValue;
    destination.sTarget = source.sTarget;
    destination.bTargetLevel = source.bTargetLevel;
    destination.ubAPCost = source.ubAPCost;
    destination.bWeaponIn = source.bWeaponIn;
  }

  export const enum Enum293 {
    SEARCH_GENERAL_ITEMS,
    SEARCH_AMMO,
    SEARCH_WEAPONS,
  }

  // go as far as possible flags
  export const FLAG_CAUTIOUS = 0x01;
  export const FLAG_STOPSHORT = 0x02;

  export const STOPSHORTDIST = 5;
}
