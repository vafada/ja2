namespace ja2 {
  // INDIVIDUAL CURSORS

  export const enum Enum317 {
    CURSOR_NORMAL,
    CURSOR_TARGET,
    CURSOR_TARGETON1,
    CURSOR_TARGETON2,
    CURSOR_TARGETON3,
    CURSOR_TARGETON4,
    CURSOR_TARGETON5,
    CURSOR_TARGETON6,
    CURSOR_TARGETON7,
    CURSOR_TARGETON8,
    CURSOR_TARGETON9,
    CURSOR_TARGETW1,
    CURSOR_TARGETW2,
    CURSOR_TARGETW3,
    CURSOR_TARGETW4,
    CURSOR_TARGETW5,
    CURSOR_TARGETRED,
    CURSOR_TARGETBLACK,
    CURSOR_TARGETDKBLACK,
    CURSOR_TARGETBURSTCONFIRM,
    CURSOR_TARGETBURST,
    CURSOR_TARGETBURSTRED,
    CURSOR_TARGETBURSTDKBLACK,
    CURSOR_PUNCHGRAY,
    CURSOR_PUNCHRED,
    CURSOR_PUNCHRED_ON1,
    CURSOR_PUNCHRED_ON2,
    CURSOR_PUNCHYELLOW_ON1,
    CURSOR_PUNCHYELLOW_ON2,
    CURSOR_PUNCHNOGO_ON1,
    CURSOR_PUNCHNOGO_ON2,
    CURSOR_RUN1,
    CURSOR_WALK1,
    CURSOR_SWAT1,
    CURSOR_PRONE1,
    CURSOR_HANDGRAB,
    CURSOR_NORMGRAB,
    CURSOR_KNIFE_REG,
    CURSOR_KNIFE_HIT,
    CURSOR_KNIFE_HIT_ON1,
    CURSOR_KNIFE_HIT_ON2,
    CURSOR_KNIFE_YELLOW_ON1,
    CURSOR_KNIFE_YELLOW_ON2,
    CURSOR_KNIFE_NOGO_ON1,
    CURSOR_KNIFE_NOGO_ON2,
    CURSOR_CROSS_REG,
    CURSOR_CROSS_ACTIVE,
    CURSOR_WWW,
    CURSOR_LAPTOP_SCREEN,
    CURSOR_IBEAM,
    CURSOR_LOOK,
    CURSOR_TALK,
    CURSOR_BLACKTALK,
    CURSOR_REDTALK,
    CURSOR_EXIT_NORTH,
    CURSOR_EXIT_SOUTH,
    CURSOR_EXIT_EAST,
    CURSOR_EXIT_WEST,
    CURSOR_NOEXIT_NORTH,
    CURSOR_NOEXIT_SOUTH,
    CURSOR_NOEXIT_EAST,
    CURSOR_NOEXIT_WEST,
    CURSOR_CONEXIT_NORTH,
    CURSOR_CONEXIT_SOUTH,
    CURSOR_CONEXIT_EAST,
    CURSOR_CONEXIT_WEST,
    CURSOR_STRATEGIC_VEHICLE,
    CURSOR_STRATEGIC_FOOT,
    CURSOR_INVALID_ACTION,
    CURSOR_CHOPPER,
    CURSOR_FLASH_TARGET,
    CURSOR_FLASH_TARGETBURST,
    CURSOR_FLASH_TALK,
    CURSOR_FLASH_REDTALK,
    CURSOR_CHECKMARK,
    CURSOR_TARGETWR1,
    CURSOR_TARGETYELLOW1,
    CURSOR_TARGETYELLOW2,
    CURSOR_TARGETYELLOW3,
    CURSOR_TARGETYELLOW4,
    CURSOR_EXIT_GRID,
    CURSOR_NOEXIT_GRID,
    CURSOR_CONEXIT_GRID,
    CURSOR_GOOD_WIRECUT,
    CURSOR_BAD_WIRECUT,
    CURSOR_GOOD_RELOAD,
    CURSOR_BAD_RELOAD,
    CUROSR_IBEAM_WHITE,
    CURSOR_GOOD_THROW,
    CURSOR_BAD_THROW,
    CURSOR_RED_THROW,
    CURSOR_FLASH_THROW,

    CURSOR_THROWKON1,
    CURSOR_THROWKON2,
    CURSOR_THROWKON3,
    CURSOR_THROWKON4,
    CURSOR_THROWKON5,
    CURSOR_THROWKON6,
    CURSOR_THROWKON7,
    CURSOR_THROWKON8,
    CURSOR_THROWKON9,
    CURSOR_THROWKW1,
    CURSOR_THROWKW2,
    CURSOR_THROWKW3,
    CURSOR_THROWKW4,
    CURSOR_THROWKW5,
    CURSOR_THROWKWR1,
    CURSOR_THROWKYELLOW1,
    CURSOR_THROWKYELLOW2,
    CURSOR_THROWKYELLOW3,
    CURSOR_THROWKYELLOW4,

    CURSOR_ITEM_GOOD_THROW,
    CURSOR_ITEM_BAD_THROW,
    CURSOR_ITEM_RED_THROW,
    CURSOR_ITEM_FLASH_THROW,
    CURSOR_ITEM_GIVE,

    CURSOR_BOMB_GRAY,
    CURSOR_BOMB_RED,
    CURSOR_REMOTE_GRAY,
    CURSOR_REMOTE_RED,

    CURSOR_ENTERV,
    CURSOR_DRIVEV,
    CURSOR_WAIT,

    CURSOR_PLACEMERC,
    CURSOR_PLACEGROUP,
    CURSOR_DPLACEMERC,
    CURSOR_DPLACEGROUP,
    CURSOR_REPAIR,
    CURSOR_REPAIRRED,

    CURSOR_JAR,
    CURSOR_JARRED,

    CURSOR_CAN,
    CURSOR_CANRED,

    CURSOR_X,
    CURSOR_WAIT_NODELAY,
    CURSOR_EXCHANGE_PLACES,

    CURSOR_STRATEGIC_BULLSEYE,
    CURSOR_JUMP_OVER,
    CURSOR_FUEL,
    CURSOR_FUEL_RED,
  }

  export const enum Enum318 {
    C_MISC,
    C_ACTIONMODE,
    C_ACTIONMODERED,
    C_ACTIONMODEBLACK,
    C_TARGMODEBURST,
    C_TARGMODEBURSTRED,
    C_TARGMODEBURSTBLACK,
    C_TRINGS,
    C_TWRINGS,
    C_BLACKTARGET,
    C_PUNCHGRAY,
    C_PUNCHRED,
    C_RUN1,
    C_WALK1,
    C_SWAT1,
    C_PRONE1,
    C_GRAB1,
    C_GRAB2,
    C_KNIFE1,
    C_KNIFE2,
    C_CROSS1,
    C_CROSS2,
    C_WWW,
    C_LAPTOPSCREEN,
    C_IBEAM,
    C_LOOK,
    C_TALK,
    C_BLACKTALK,
    C_REDTALK,
    C_EXITARROWS,
    C_STRATVEH,
    C_STRATFOOT,
    C_INVALIDACTION,
    C_CHOPPER,
    C_CHECKMARK,
    C_YELLOWRINGS,
    C_WIRECUT,
    C_WIRECUTR,
    C_RELOAD,
    C_RELOADR,
    C_IBEAM_WHITE,
    C_THROWG,
    C_THROWB,
    C_THROWR,
    C_ITEMTHROW,
    C_BOMB_GREY,
    C_BOMB_RED,
    C_REMOTE_GREY,
    C_REMOTE_RED,
    C_ENTERV,
    C_MOVEV,
    C_WAIT,
    C_PLACEMERC,
    C_PLACEGROUP,
    C_DPLACEMERC,
    C_DPLACEGROUP,
    C_REPAIR,
    C_REPAIRR,
    C_JAR,
    C_JARRED,
    C_X,
    C_CAN,
    C_CANRED,
    C_EXCHANGE,
    C_BULLSEYE,
    C_JUMPOVER,
    C_FUEL,
    C_FUEL_RED,

    NUM_CURSOR_FILES,
  }

  const MOUSE_LEVEL_GROUND = 0;
  const MOUSE_LEVEL_ROOF = 1;
}
