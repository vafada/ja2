namespace ja2 {
  // DEFINES
  export const UIEVENT_SINGLEEVENT = 0x00000002;
  export const UIEVENT_SNAPMOUSE = 0x00000008;

  export const NO_GUY_SELECTION = 0;
  export const SELECTED_GUY_SELECTION = 1;
  export const NONSELECTED_GUY_SELECTION = 2;
  export const ENEMY_GUY_SELECTION = 3;

  export const MOUSE_MOVING_IN_TILE = 0x00000001;
  export const MOUSE_MOVING = 0x00000002;
  export const MOUSE_MOVING_NEW_TILE = 0x00000004;
  export const MOUSE_STATIONARY = 0x00000008;

  export const MOVEUI_TARGET_INTTILES = 1;
  export const MOVEUI_TARGET_ITEMS = 2;
  export const MOVEUI_TARGET_MERCS = 3;
  export const MOVEUI_TARGET_MERCSFORAID = 5;
  export const MOVEUI_TARGET_WIREFENCE = 6;
  export const MOVEUI_TARGET_BOMB = 7;
  export const MOVEUI_TARGET_STEAL = 8;
  export const MOVEUI_TARGET_REPAIR = 9;
  export const MOVEUI_TARGET_JAR = 10;
  export const MOVEUI_TARGET_CAN = 11;
  export const MOVEUI_TARGET_REFUEL = 12;

  const MOVEUI_RETURN_ON_TARGET_MERC = 1;

  export const enum Enum206 {
    DONT_CHANGEMODE,
    IDLE_MODE,
    MOVE_MODE,
    ACTION_MODE,
    MENU_MODE,
    POPUP_MODE,
    CONFIRM_MOVE_MODE,
    ADJUST_STANCE_MODE,
    CONFIRM_ACTION_MODE,
    HANDCURSOR_MODE,
    GETTINGITEM_MODE,
    ENEMYS_TURN_MODE,
    LOOKCURSOR_MODE,
    TALKINGMENU_MODE,
    TALKCURSOR_MODE,
    LOCKUI_MODE,
    OPENDOOR_MENU_MODE,
    LOCKOURTURN_UI_MODE,
    EXITSECTORMENU_MODE,
    RUBBERBAND_MODE,
    JUMPOVER_MODE,
  }

  export type UI_MODE = Enum206;

  type UI_HANDLEFNC = (a: UI_EVENT) => UINT32;

  export interface UI_EVENT {
    uiFlags: UINT32;
    ChangeToUIMode: UI_MODE;
    HandleEvent: UI_HANDLEFNC;
    fFirstTime: boolean;
    fDoneMenu: boolean;
    uiMenuPreviousMode: UINT32;
    uiParams: any[] /* UINT32[3] */;
  }

  export function createUIEventFrom(
    uiFlags: UINT32,
    ChangeToUIMode: UI_MODE,
    HandleEvent: UI_HANDLEFNC,
    fFirstTime: boolean,
    fDoneMenu: boolean,
    uiMenuPreviousMode: UINT32,
    uiParams: UINT32[],
  ): UI_EVENT {
    return {
      uiFlags,
      ChangeToUIMode,
      HandleEvent,
      fFirstTime,
      fDoneMenu,
      uiMenuPreviousMode,
      uiParams,
    };
  }

  // EVENT ENUMERATION
  export const enum Enum207 {
    I_DO_NOTHING,
    I_EXIT,
    I_NEW_MERC,
    I_NEW_BADMERC,
    I_SELECT_MERC,
    I_ENTER_EDIT_MODE,
    I_ENTER_PALEDIT_MODE,
    I_ENDTURN,
    I_TESTHIT,
    I_CHANGELEVEL,
    I_ON_TERRAIN,
    I_CHANGE_TO_IDLE,
    I_LOADLEVEL,
    I_SOLDIERDEBUG,
    I_LOSDEBUG,
    I_LEVELNODEDEBUG,
    I_GOTODEMOMODE,
    I_LOADFIRSTLEVEL,
    I_LOADSECONDLEVEL,
    I_LOADTHIRDLEVEL,
    I_LOADFOURTHLEVEL,
    I_LOADFIFTHLEVEL,

    ET_ON_TERRAIN,
    ET_ENDENEMYS_TURN,

    M_ON_TERRAIN,
    M_CHANGE_TO_ACTION,
    M_CHANGE_TO_HANDMODE,
    M_CYCLE_MOVEMENT,
    M_CYCLE_MOVE_ALL,
    M_CHANGE_TO_ADJPOS_MODE,

    POPUP_DOMESSAGE,

    A_ON_TERRAIN,
    A_CHANGE_TO_MOVE,
    A_CHANGE_TO_CONFIM_ACTION,
    A_END_ACTION,
    U_MOVEMENT_MENU,
    U_POSITION_MENU,

    C_WAIT_FOR_CONFIRM,
    C_MOVE_MERC,
    C_ON_TERRAIN,

    PADJ_ADJUST_STANCE,

    CA_ON_TERRAIN,
    CA_MERC_SHOOT,
    CA_END_CONFIRM_ACTION,

    HC_ON_TERRAIN,

    G_GETTINGITEM,

    LC_ON_TERRAIN,
    LC_CHANGE_TO_LOOK,
    LC_LOOK,

    TA_TALKINGMENU,

    T_ON_TERRAIN,
    T_CHANGE_TO_TALKING,

    LU_ON_TERRAIN,
    LU_BEGINUILOCK,
    LU_ENDUILOCK,

    OP_OPENDOORMENU,

    LA_ON_TERRAIN,
    LA_BEGINUIOURTURNLOCK,
    LA_ENDUIOUTURNLOCK,

    EX_EXITSECTORMENU,

    RB_ON_TERRAIN,

    JP_ON_TERRAIN,
    JP_JUMP,

    NUM_UI_EVENTS,
  }

  export type UIKEYBOARD_HOOK = (pInputEvent: InputAtom) => boolean;

  export let gfUISelectiveTargetFound: boolean;
  export let gusUISelectiveTargetID: UINT16;
  export let guiUISelectiveTargetFlags: UINT32;

  export let gfUIFullTargetFound: boolean;
  export let gusUIFullTargetID: UINT16;
  export let guiUIFullTargetFlags: UINT32;

  export let gfUIBodyHitLocation: boolean;
}
