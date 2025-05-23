namespace ja2 {
  export const UICURSOR_FREEFLOWING = 0x00000002;
  export const UICURSOR_SNAPPING = 0x00000004;
  export const UICURSOR_SHOWTILE = 0x00000008;
  const UICURSOR_FLASHING = 0x00000020;
  export const UICURSOR_CENTERAPS = 0x00000040;
  export const UICURSOR_SHOWTILEAPDEPENDENT = 0x00000080;
  export const UICURSOR_DONTSHOW2NDLEVEL = 0x00000100;

  export const enum Enum210 {
    NO_UICURSOR,
    NORMAL_FREEUICURSOR,
    NORMAL_SNAPUICURSOR,
    MOVE_RUN_UICURSOR,
    MOVE_WALK_UICURSOR,
    MOVE_SWAT_UICURSOR,
    MOVE_PRONE_UICURSOR,
    MOVE_VEHICLE_UICURSOR,

    CONFIRM_MOVE_RUN_UICURSOR,
    CONFIRM_MOVE_WALK_UICURSOR,
    CONFIRM_MOVE_SWAT_UICURSOR,
    CONFIRM_MOVE_PRONE_UICURSOR,
    CONFIRM_MOVE_VEHICLE_UICURSOR,

    ALL_MOVE_RUN_UICURSOR,
    ALL_MOVE_WALK_UICURSOR,
    ALL_MOVE_SWAT_UICURSOR,
    ALL_MOVE_PRONE_UICURSOR,
    ALL_MOVE_VEHICLE_UICURSOR,

    MOVE_REALTIME_UICURSOR,
    MOVE_RUN_REALTIME_UICURSOR,

    CONFIRM_MOVE_REALTIME_UICURSOR,
    ALL_MOVE_REALTIME_UICURSOR,

    ON_OWNED_MERC_UICURSOR,
    ON_OWNED_SELMERC_UICURSOR,

    ACTION_SHOOT_UICURSOR,
    ACTION_NOCHANCE_SHOOT_UICURSOR,
    ACTION_NOCHANCE_BURST_UICURSOR,

    ACTION_FLASH_TOSS_UICURSOR,
    ACTION_TOSS_UICURSOR,
    ACTION_RED_TOSS_UICURSOR,

    ACTION_FLASH_SHOOT_UICURSOR,
    ACTION_FLASH_BURST_UICURSOR,
    ACTION_TARGETAIM1_UICURSOR,
    ACTION_TARGETAIM2_UICURSOR,
    ACTION_TARGETAIM3_UICURSOR,
    ACTION_TARGETAIM4_UICURSOR,
    ACTION_TARGETAIM5_UICURSOR,
    ACTION_TARGETAIM6_UICURSOR,
    ACTION_TARGETAIM7_UICURSOR,
    ACTION_TARGETAIM8_UICURSOR,
    ACTION_TARGETAIM9_UICURSOR,
    ACTION_TARGETAIMCANT1_UICURSOR,
    ACTION_TARGETAIMCANT2_UICURSOR,
    ACTION_TARGETAIMCANT3_UICURSOR,
    ACTION_TARGETAIMCANT4_UICURSOR,
    ACTION_TARGETAIMCANT5_UICURSOR,
    ACTION_TARGETRED_UICURSOR,
    ACTION_TARGETBURST_UICURSOR,
    ACTION_TARGETREDBURST_UICURSOR,
    ACTION_TARGETCONFIRMBURST_UICURSOR,
    ACTION_TARGETAIMFULL_UICURSOR,
    ACTION_TARGETAIMYELLOW1_UICURSOR,
    ACTION_TARGETAIMYELLOW2_UICURSOR,
    ACTION_TARGETAIMYELLOW3_UICURSOR,
    ACTION_TARGETAIMYELLOW4_UICURSOR,

    ACTION_TARGET_RELOADING,
    ACTION_PUNCH_GRAY,
    ACTION_PUNCH_RED,
    ACTION_PUNCH_RED_AIM1_UICURSOR,
    ACTION_PUNCH_RED_AIM2_UICURSOR,
    ACTION_PUNCH_YELLOW_AIM1_UICURSOR,
    ACTION_PUNCH_YELLOW_AIM2_UICURSOR,
    ACTION_PUNCH_NOGO_AIM1_UICURSOR,
    ACTION_PUNCH_NOGO_AIM2_UICURSOR,
    ACTION_FIRSTAID_GRAY,
    ACTION_FIRSTAID_RED,
    ACTION_OPEN,
    CANNOT_MOVE_UICURSOR,
    NORMALHANDCURSOR_UICURSOR,
    OKHANDCURSOR_UICURSOR,

    KNIFE_REG_UICURSOR,
    KNIFE_HIT_UICURSOR,
    KNIFE_HIT_AIM1_UICURSOR,
    KNIFE_HIT_AIM2_UICURSOR,
    KNIFE_YELLOW_AIM1_UICURSOR,
    KNIFE_YELLOW_AIM2_UICURSOR,
    KNIFE_NOGO_AIM1_UICURSOR,
    KNIFE_NOGO_AIM2_UICURSOR,

    LOOK_UICURSOR,

    TALK_NA_UICURSOR,
    TALK_A_UICURSOR,
    TALK_OUT_RANGE_NA_UICURSOR,
    TALK_OUT_RANGE_A_UICURSOR,

    EXIT_NORTH_UICURSOR,
    EXIT_SOUTH_UICURSOR,
    EXIT_EAST_UICURSOR,
    EXIT_WEST_UICURSOR,
    EXIT_GRID_UICURSOR,
    NOEXIT_NORTH_UICURSOR,
    NOEXIT_SOUTH_UICURSOR,
    NOEXIT_EAST_UICURSOR,
    NOEXIT_WEST_UICURSOR,
    NOEXIT_GRID_UICURSOR,
    CONFIRM_EXIT_NORTH_UICURSOR,
    CONFIRM_EXIT_SOUTH_UICURSOR,
    CONFIRM_EXIT_EAST_UICURSOR,
    CONFIRM_EXIT_WEST_UICURSOR,
    CONFIRM_EXIT_GRID_UICURSOR,

    GOOD_WIRECUTTER_UICURSOR,
    BAD_WIRECUTTER_UICURSOR,

    GOOD_REPAIR_UICURSOR,
    BAD_REPAIR_UICURSOR,

    GOOD_RELOAD_UICURSOR,
    BAD_RELOAD_UICURSOR,

    GOOD_JAR_UICURSOR,
    BAD_JAR_UICURSOR,

    GOOD_THROW_UICURSOR,
    BAD_THROW_UICURSOR,
    RED_THROW_UICURSOR,
    FLASH_THROW_UICURSOR,
    ACTION_THROWAIM1_UICURSOR,
    ACTION_THROWAIM2_UICURSOR,
    ACTION_THROWAIM3_UICURSOR,
    ACTION_THROWAIM4_UICURSOR,
    ACTION_THROWAIM5_UICURSOR,
    ACTION_THROWAIM6_UICURSOR,
    ACTION_THROWAIM7_UICURSOR,
    ACTION_THROWAIM8_UICURSOR,
    ACTION_THROWAIM9_UICURSOR,
    ACTION_THROWAIMCANT1_UICURSOR,
    ACTION_THROWAIMCANT2_UICURSOR,
    ACTION_THROWAIMCANT3_UICURSOR,
    ACTION_THROWAIMCANT4_UICURSOR,
    ACTION_THROWAIMCANT5_UICURSOR,
    ACTION_THROWAIMFULL_UICURSOR,
    ACTION_THROWAIMYELLOW1_UICURSOR,
    ACTION_THROWAIMYELLOW2_UICURSOR,
    ACTION_THROWAIMYELLOW3_UICURSOR,
    ACTION_THROWAIMYELLOW4_UICURSOR,

    THROW_ITEM_GOOD_UICURSOR,
    THROW_ITEM_BAD_UICURSOR,
    THROW_ITEM_RED_UICURSOR,
    THROW_ITEM_FLASH_UICURSOR,

    PLACE_BOMB_GREY_UICURSOR,
    PLACE_BOMB_RED_UICURSOR,
    PLACE_REMOTE_GREY_UICURSOR,
    PLACE_REMOTE_RED_UICURSOR,
    PLACE_TINCAN_GREY_UICURSOR,
    PLACE_TINCAN_RED_UICURSOR,

    ENTER_VEHICLE_UICURSOR,

    INVALID_ACTION_UICURSOR,

    FLOATING_X_UICURSOR,

    EXCHANGE_PLACES_UICURSOR,
    JUMP_OVER_UICURSOR,

    REFUEL_GREY_UICURSOR,
    REFUEL_RED_UICURSOR,

    NUM_UI_CURSORS,
  }

  export interface UICursor {
    uiCursorID: UINT32;
    uiFlags: UINT32;
    usFreeCursorName: UINT16;
    usAdditionalData: UINT16;
  }

  export function createUICursorFrom(
    uiCursorID: UINT32,
    uiFlags: UINT32,
    usFreeCursorName: UINT16,
    usAdditionalData: UINT16,
  ): UICursor {
    return {
      uiCursorID,
      uiFlags,
      usFreeCursorName,
      usAdditionalData,
    };
  }
}
