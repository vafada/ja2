namespace ja2 {
  const MAX_UICOMPOSITES = 4;

  export const INTERFACE_START_Y = 360;
  export const INV_INTERFACE_START_Y = 340;

  export const INTERFACE_START_X = 0;

  // FLASH PORTRAIT CODES
  export const FLASH_PORTRAIT_STOP = 0;
  export const FLASH_PORTRAIT_START = 1;
  export const FLASH_PORTRAIT_WAITING = 2;
  export const FLASH_PORTRAIT_DELAY = 150;

  // FLASH PORTRAIT PALETTE IDS
  export const FLASH_PORTRAIT_NOSHADE = 0;
  export const FLASH_PORTRAIT_STARTSHADE = 1;
  export const FLASH_PORTRAIT_ENDSHADE = 2;
  export const FLASH_PORTRAIT_DARKSHADE = 3;
  export const FLASH_PORTRAIT_GRAYSHADE = 4;
  export const FLASH_PORTRAIT_LITESHADE = 5;

  // GLOBAL DEFINES FOR SOME UI FLAGS
  export const ARROWS_HIDE_UP = 0x00000002;
  export const ARROWS_HIDE_DOWN = 0x00000004;
  export const ARROWS_SHOW_UP_BESIDE = 0x00000008;
  export const ARROWS_SHOW_DOWN_BESIDE = 0x00000020;
  export const ARROWS_SHOW_UP_ABOVE_Y = 0x00000040;
  export const ARROWS_SHOW_DOWN_BELOW_Y = 0x00000080;
  export const ARROWS_SHOW_DOWN_BELOW_G = 0x00000200;
  export const ARROWS_SHOW_DOWN_BELOW_YG = 0x00000400;
  export const ARROWS_SHOW_DOWN_BELOW_GG = 0x00000800;
  export const ARROWS_SHOW_UP_ABOVE_G = 0x00002000;
  export const ARROWS_SHOW_UP_ABOVE_YG = 0x00004000;
  export const ARROWS_SHOW_UP_ABOVE_GG = 0x00008000;
  export const ARROWS_SHOW_UP_ABOVE_YY = 0x00020000;
  export const ARROWS_SHOW_DOWN_BELOW_YY = 0x00040000;
  export const ARROWS_SHOW_UP_ABOVE_CLIMB = 0x00080000;
  export const ARROWS_SHOW_UP_ABOVE_CLIMB2 = 0x00400000;
  export const ARROWS_SHOW_UP_ABOVE_CLIMB3 = 0x00800000;
  export const ARROWS_SHOW_DOWN_CLIMB = 0x02000000;

  export const ROOF_LEVEL_HEIGHT = 50;

  export const LOCATEANDSELECT_MERC = 1;
  export const LOCATE_MERC_ONCE = 2;

  // Interface level enums
  export const enum Enum214 {
    I_GROUND_LEVEL,
    I_ROOF_LEVEL,
    I_NUMLEVELS,
  }

  const DRAW_RED_BAR = 1;
  const DRAW_BLUE_BAR = 2;
  const DRAW_ERASE_BAR = 3;

  export const MOVEMENT_MENU_LOOK = 1;
  export const MOVEMENT_MENU_ACTIONC = 2;
  export const MOVEMENT_MENU_HAND = 3;
  export const MOVEMENT_MENU_TALK = 4;
  export const MOVEMENT_MENU_RUN = 5;
  export const MOVEMENT_MENU_WALK = 6;
  export const MOVEMENT_MENU_SWAT = 7;
  export const MOVEMENT_MENU_PRONE = 8;

  export const DIRTYLEVEL0 = 0;
  export const DIRTYLEVEL1 = 1;
  export const DIRTYLEVEL2 = 2;

  export const enum Enum215 {
    SM_PANEL,
    TEAM_PANEL,
    NUM_UI_PANELS,
  }

  export const enum Enum216 {
    NO_MESSAGE,
    COMPUTER_TURN_MESSAGE,
    COMPUTER_INTERRUPT_MESSAGE,
    PLAYER_INTERRUPT_MESSAGE,
    MILITIA_INTERRUPT_MESSAGE,
    AIR_RAID_TURN_MESSAGE,
    PLAYER_TURN_MESSAGE,
  }

  export let guiPORTRAITICONS: UINT32;
}
