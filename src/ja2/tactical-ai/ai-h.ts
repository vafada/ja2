namespace ja2 {
  export const AI_PATHCOST_RADIUS = 9;

  // AI actions

  export const enum Enum288 {
    CALL_NONE = 0,
    CALL_1_PREY,
    CALL_MULTIPLE_PREY,
    CALL_ATTACKED,
    CALL_CRIPPLED,
    NUM_CREATURE_CALLS,
  }

  export const DONTFORCE = 0;
  export const FORCE = 1;

  // ANY NEW ACTIONS ADDED - UPDATE OVERHEAD.C ARRAY WITH ACTION'S STRING VALUE
  export const FIRST_MOVEMENT_ACTION = Enum289.AI_ACTION_RANDOM_PATROL;
  export const LAST_MOVEMENT_ACTION = Enum289.AI_ACTION_MOVE_TO_CLIMB;
  export const enum Enum289 {
    AI_ACTION_NONE = 0, // maintain current position & facing

    // actions that involve a move to another tile
    AI_ACTION_RANDOM_PATROL, // move towards a random destination
    AI_ACTION_SEEK_FRIEND, // move towards friend in trouble
    AI_ACTION_SEEK_OPPONENT, // move towards a reported opponent
    AI_ACTION_TAKE_COVER, // run for nearest cover from threat
    AI_ACTION_GET_CLOSER, // move closer to a strategic location

    AI_ACTION_POINT_PATROL, // move towards next patrol point
    AI_ACTION_LEAVE_WATER_GAS, // seek nearest spot of ungassed land
    AI_ACTION_SEEK_NOISE, // seek most important noise heard
    AI_ACTION_ESCORTED_MOVE, // go where told to by escortPlayer
    AI_ACTION_RUN_AWAY, // run away from nearby opponent(s)

    AI_ACTION_KNIFE_MOVE, // preparing to stab an opponent
    AI_ACTION_APPROACH_MERC, // move up to a merc in order to talk with them; RT
    AI_ACTION_TRACK, // track a scent
    AI_ACTION_EAT, // monster eats corpse
    AI_ACTION_PICKUP_ITEM, // grab things lying on the ground

    AI_ACTION_SCHEDULE_MOVE, // move according to schedule
    AI_ACTION_WALK, // walk somewhere (NPC stuff etc)
    AI_ACTION_RUN, // run somewhere (NPC stuff etc)
    AI_ACTION_MOVE_TO_CLIMB, // move to edge of roof/building
    // miscellaneous movement actions
    AI_ACTION_CHANGE_FACING, // turn to face a different direction

    AI_ACTION_CHANGE_STANCE, // stand, crouch, or go prone
    // actions related to items and attacks
    AI_ACTION_YELLOW_ALERT, // tell friends opponent(s) heard
    AI_ACTION_RED_ALERT, // tell friends opponent(s) seen
    AI_ACTION_CREATURE_CALL, // creature communication
    AI_ACTION_PULL_TRIGGER, // go off to activate a panic trigger

    AI_ACTION_USE_DETONATOR, // grab detonator and set off bomb(s)
    AI_ACTION_FIRE_GUN, // shoot at nearby opponent
    AI_ACTION_TOSS_PROJECTILE, // throw grenade at/near opponent(s)
    AI_ACTION_KNIFE_STAB, // during the actual knifing attack
    AI_ACTION_THROW_KNIFE, // throw a knife

    AI_ACTION_GIVE_AID, // help injured/dying friend
    AI_ACTION_WAIT, // RT: don't do anything for a certain length of time
    AI_ACTION_PENDING_ACTION, // RT: wait for pending action (pickup, door open, etc) to finish
    AI_ACTION_DROP_ITEM, // duh
    AI_ACTION_COWER, // for civilians:  cower in fear and stay there!

    AI_ACTION_STOP_COWERING, // stop cowering
    AI_ACTION_OPEN_OR_CLOSE_DOOR, // schedule-provoked; open or close door
    AI_ACTION_UNLOCK_DOOR, // schedule-provoked; unlock door (don't open)
    AI_ACTION_LOCK_DOOR, // schedule-provoked; lock door (close if necessary)
    AI_ACTION_LOWER_GUN, // lower gun prior to throwing knife

    AI_ACTION_ABSOLUTELY_NONE, // like "none" but can't be converted to a wait by realtime
    AI_ACTION_CLIMB_ROOF, // climb up or down roof
    AI_ACTION_END_TURN, // end turn (after final stance change)
    AI_ACTION_END_COWER_AND_MOVE, // sort of dummy value, special for civilians who are to go somewhere at end of battle
    AI_ACTION_TRAVERSE_DOWN, // move down a level
    AI_ACTION_OFFER_SURRENDER, // offer surrender to the player
  }

  export const enum Enum290 {
    QUOTE_ACTION_ID_CHECKFORDEST = 1,
    QUOTE_ACTION_ID_TURNTOWARDSPLAYER,
    QUOTE_ACTION_ID_DRAWGUN,
    QUOTE_ACTION_ID_LOWERGUN,
    QUOTE_ACTION_ID_TRAVERSE_EAST,
    QUOTE_ACTION_ID_TRAVERSE_SOUTH,
    QUOTE_ACTION_ID_TRAVERSE_WEST,
    QUOTE_ACTION_ID_TRAVERSE_NORTH,
  }

  export const RTP_COMBAT_AGGRESSIVE = 1;
  export const RTP_COMBAT_CONSERVE = 2;
  export const RTP_COMBAT_REFRAIN = 3;

  // NB THESE THREE FLAGS SHOULD BE REMOVED FROM CODE
  export const AI_RTP_OPTION_CAN_RETREAT = 0x01;
  export const AI_RTP_OPTION_CAN_SEEK_COVER = 0x02;
  const AI_RTP_OPTION_CAN_HELP = 0x04;

  export const AI_CAUTIOUS = 0x08;
  export const AI_HANDLE_EVERY_FRAME = 0x10;
  export const AI_ASLEEP = 0x20;
  export const AI_LOCK_DOOR_INCLUDES_CLOSE = 0x40;
  export const AI_CHECK_SCHEDULE = 0x80;

  export const NOT_NEW_SITUATION = 0;
  export const WAS_NEW_SITUATION = 1;
  export const IS_NEW_SITUATION = 2;

  const DIFF_ENEMY_EQUIP_MOD = 0;
  export const DIFF_ENEMY_TO_HIT_MOD = 1;
  const DIFF_ENEMY_INTERRUPT_MOD = 2;
  export const DIFF_RADIO_RED_ALERT = 3;
  export const DIFF_MAX_COVER_RANGE = 4;
  const MAX_DIFF_PARMS = 5; // how many different difficulty variables?

  // Kris:  Added these as I need specific searches on certain sides.
  export const enum Enum291 {
    NORTH_EDGEPOINT_SEARCH,
    EAST_EDGEPOINT_SEARCH,
    SOUTH_EDGEPOINT_SEARCH,
    WEST_EDGEPOINT_SEARCH,
  }
}
