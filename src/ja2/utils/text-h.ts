namespace ja2 {
  const STRING_LENGTH = 255;

  export const enum Enum332 {
    ANTIHACKERSTR_EXITGAME,
  }

  export const enum Enum333 {
    MSG_EXITGAME,
    MSG_OK,
    MSG_YES,
    MSG_NO,
    MSG_CANCEL,
    MSG_REHIRE,
    MSG_LIE,
    MSG_NODESC,
    MSG_SAVESUCCESS,
    MSG_SAVESLOTSUCCESS,
    MSG_QUICKSAVE_NAME,
    MSG_SAVE_NAME,
    MSG_SAVEEXTENSION,
    MSG_SAVEDIRECTORY,
    MSG_DAY,
    MSG_MERCS,
    MSG_EMPTYSLOT,
    MSG_DEMOWORD,
    MSG_DEBUGWORD,
    MSG_RELEASEWORD,
    MSG_RPM,
    MSG_MINUTE_ABBREVIATION,
    MSG_METER_ABBREVIATION,
    MSG_ROUNDS_ABBREVIATION,
    MSG_KILOGRAM_ABBREVIATION,
    MSG_POUND_ABBREVIATION,
    MSG_HOMEPAGE,
    MSG_USDOLLAR_ABBREVIATION,
    MSG_LOWERCASE_NA,
    MSG_MEANWHILE,
    MSG_ARRIVE,
    MSG_VERSION,
    MSG_EMPTY_QUICK_SAVE_SLOT,
    MSG_QUICK_SAVE_RESERVED_FOR_TACTICAL,
    MSG_OPENED,
    MSG_CLOSED,
    MSG_LOWDISKSPACE_WARNING,
    MSG_HIRED_MERC,
    MSG_MERC_CAUGHT_ITEM,
    MSG_MERC_TOOK_DRUG,
    MSG_MERC_HAS_NO_MEDSKILL,
    MSG_INTEGRITY_WARNING,
    MSG_CDROM_SAVE,
    MSG_CANT_FIRE_HERE,
    MSG_CANT_CHANGE_STANCE,
    MSG_DROP,
    MSG_THROW,
    MSG_PASS,
    MSG_ITEM_PASSED_TO_MERC,
    MSG_NO_ROOM_TO_PASS_ITEM,
    MSG_END_ATTACHMENT_LIST,
    MSG_CHEAT_LEVEL_ONE,
    MSG_CHEAT_LEVEL_TWO,
    MSG_SQUAD_ON_STEALTHMODE,
    MSG_SQUAD_OFF_STEALTHMODE,
    MSG_MERC_ON_STEALTHMODE,
    MSG_MERC_OFF_STEALTHMODE,
    MSG_WIREFRAMES_ADDED,
    MSG_WIREFRAMES_REMOVED,
    MSG_CANT_GO_UP,
    MSG_CANT_GO_DOWN,
    MSG_ENTERING_LEVEL,
    MSG_LEAVING_BASEMENT,
    MSG_DASH_S, // the old 's
    MSG_TACKING_MODE_OFF,
    MSG_TACKING_MODE_ON,
    MSG_3DCURSOR_OFF,
    MSG_3DCURSOR_ON,
    MSG_SQUAD_ACTIVE,
    MSG_CANT_AFFORD_TO_PAY_NPC_DAILY_SALARY_MSG,
    MSG_SKIP,
    MSG_EPC_CANT_TRAVERSE,
    MSG_CDROM_SAVE_GAME,
    MSG_DRANK_SOME,
    MSG_PACKAGE_ARRIVES,
    MSG_JUST_HIRED_MERC_ARRIVAL_LOCATION_POPUP,
    MSG_HISTORY_UPDATED,
  }

  export const enum Enum334 {
    STR_EMPTY,
    STR_LOSES_1_WISDOM,
    STR_LOSES_1_DEX,
    STR_LOSES_1_STRENGTH,
    STR_LOSES_1_AGIL,
    STR_LOSES_WISDOM,
    STR_LOSES_DEX,
    STR_LOSES_STRENGTH,
    STR_LOSES_AGIL,
    STR_INTERRUPT,
    STR_HEARS_NOISE_FROM,
    STR_PLAYER_REINFORCEMENTS,
    STR_PLAYER_RELOADS,
    STR_PLAYER_NOT_ENOUGH_APS,
    STR_IS_APPLYING_FIRST_AID,
    STR_ARE_APPLYING_FIRST_AID,
    STR_RELIABLE,
    STR_UNRELIABLE,
    STR_EASY_TO_REPAIR,
    STR_HARD_TO_REPAIR,
    STR_HIGH_DAMAGE,
    STR_LOW_DAMAGE,
    STR_QUICK_FIRING,
    STR_SLOW_FIRING,
    STR_LONG_RANGE,
    STR_SHORT_RANGE,
    STR_LIGHT,
    STR_HEAVY,
    STR_SMALL,
    STR_FAST_BURST,
    STR_NO_BURST,
    STR_LARGE_AMMO_CAPACITY,
    STR_SMALL_AMMO_CAPACITY,
    STR_CAMMO_WORN_OFF,
    STR_CAMMO_WASHED_OFF,
    STR_2ND_CLIP_DEPLETED,
    STR_STOLE_SOMETHING,
    STR_NOT_BURST_CAPABLE,
    STR_ATTACHMENT_ALREADY,
    STR_MERGE_ITEMS,
    STR_CANT_ATTACH,
    STR_NONE,
    STR_EJECT_AMMO,
    STR_ATTACHMENTS,
    STR_CANT_USE_TWO_ITEMS,
    STR_ATTACHMENT_HELP,
    STR_ATTACHMENT_INVALID_HELP,
    STR_SECTOR_NOT_CLEARED,
    STR_NEED_TO_GIVE_MONEY,
    STR_HEAD_HIT,
    STR_ABANDON_FIGHT,
    STR_PERMANENT_ATTACHMENT,
    STR_ENERGY_BOOST,
    STR_SLIPPED_MARBLES,
    STR_FAILED_TO_STEAL_SOMETHING,
    STR_REPAIRED,
    STR_INTERRUPT_FOR,
    STR_SURRENDER,
    STR_REFUSE_FIRSTAID,
    STR_REFUSE_FIRSTAID_FOR_CREATURE,
    STR_HOW_TO_USE_SKYRIDDER,
    STR_RELOAD_ONLY_ONE_GUN,
    STR_BLOODCATS_TURN,
  }

  const LARGE_STRING_LENGTH = 200;
  const MED_STRING_LENGTH = 80;
  const SMALL_STRING_LENGTH = 20;

  export const enum Enum335 {
    AIR_RAID_TURN_STR,
    BEGIN_AUTOBANDAGE_PROMPT_STR,
    NOTICING_MISSING_ITEMS_FROM_SHIPMENT_STR,
    DOOR_LOCK_DESCRIPTION_STR,
    DOOR_THERE_IS_NO_LOCK_STR,
    DOOR_LOCK_DESTROYED_STR,
    DOOR_LOCK_NOT_DESTROYED_STR,
    DOOR_LOCK_HAS_BEEN_PICKED_STR,
    DOOR_LOCK_HAS_NOT_BEEN_PICKED_STR,
    DOOR_LOCK_UNTRAPPED_STR,
    DOOR_LOCK_HAS_BEEN_UNLOCKED_STR,
    DOOR_NOT_PROPER_KEY_STR,
    DOOR_LOCK_HAS_BEEN_UNTRAPPED_STR,
    DOOR_LOCK_IS_NOT_TRAPPED_STR,
    DOOR_LOCK_HAS_BEEN_LOCKED_STR,
    DOOR_DOOR_MOUSE_DESCRIPTION,
    DOOR_TRAPPED_MOUSE_DESCRIPTION,
    DOOR_LOCKED_MOUSE_DESCRIPTION,
    DOOR_UNLOCKED_MOUSE_DESCRIPTION,
    DOOR_BROKEN_MOUSE_DESCRIPTION,
    ACTIVATE_SWITCH_PROMPT,
    DISARM_TRAP_PROMPT,
    ITEMPOOL_POPUP_PREV_STR,
    ITEMPOOL_POPUP_NEXT_STR,
    ITEMPOOL_POPUP_MORE_STR,
    ITEM_HAS_BEEN_PLACED_ON_GROUND_STR,
    ITEM_HAS_BEEN_GIVEN_TO_STR,
    GUY_HAS_BEEN_PAID_IN_FULL_STR,
    GUY_STILL_OWED_STR,
    CHOOSE_BOMB_FREQUENCY_STR,
    CHOOSE_TIMER_STR,
    CHOOSE_REMOTE_FREQUENCY_STR,
    DISARM_BOOBYTRAP_PROMPT,
    REMOVE_BLUE_FLAG_PROMPT,
    PLACE_BLUE_FLAG_PROMPT,
    ENDING_TURN,
    ATTACK_OWN_GUY_PROMPT,
    VEHICLES_NO_STANCE_CHANGE_STR,
    ROBOT_NO_STANCE_CHANGE_STR,
    CANNOT_STANCE_CHANGE_STR,
    CANNOT_DO_FIRST_AID_STR,
    CANNOT_NO_NEED_FIRST_AID_STR,
    CANT_MOVE_THERE_STR,
    CANNOT_RECRUIT_TEAM_FULL,
    HAS_BEEN_RECRUITED_STR,
    BALANCE_OWED_STR,
    ESCORT_PROMPT,
    HIRE_PROMPT,
    BOXING_PROMPT,
    BUY_VEST_PROMPT,
    NOW_BING_ESCORTED_STR,
    JAMMED_ITEM_STR,
    ROBOT_NEEDS_GIVEN_CALIBER_STR,
    CANNOT_THROW_TO_DEST_STR,
    TOGGLE_STEALTH_MODE_POPUPTEXT,
    MAPSCREEN_POPUPTEXT,
    END_TURN_POPUPTEXT,
    TALK_CURSOR_POPUPTEXT,
    TOGGLE_MUTE_POPUPTEXT,
    CHANGE_STANCE_UP_POPUPTEXT,
    CURSOR_LEVEL_POPUPTEXT,
    JUMPCLIMB_POPUPTEXT,
    CHANGE_STANCE_DOWN_POPUPTEXT,
    EXAMINE_CURSOR_POPUPTEXT,
    PREV_MERC_POPUPTEXT,
    NEXT_MERC_POPUPTEXT,
    CHANGE_OPTIONS_POPUPTEXT,
    TOGGLE_BURSTMODE_POPUPTEXT,
    LOOK_CURSOR_POPUPTEXT,
    MERC_VITAL_STATS_POPUPTEXT,
    CANNOT_DO_INV_STUFF_STR,
    CONTINUE_OVER_FACE_STR,
    MUTE_OFF_STR,
    MUTE_ON_STR,
    DRIVER_POPUPTEXT,
    EXIT_VEHICLE_POPUPTEXT,
    CHANGE_SQUAD_POPUPTEXT,
    DRIVE_POPUPTEXT,
    NOT_APPLICABLE_POPUPTEXT,
    USE_HANDTOHAND_POPUPTEXT,
    USE_FIREARM_POPUPTEXT,
    USE_BLADE_POPUPTEXT,
    USE_EXPLOSIVE_POPUPTEXT,
    USE_MEDKIT_POPUPTEXT,
    CATCH_STR,
    RELOAD_STR,
    GIVE_STR,
    LOCK_TRAP_HAS_GONE_OFF_STR,
    MERC_HAS_ARRIVED_STR,
    GUY_HAS_RUN_OUT_OF_APS_STR,
    MERC_IS_UNAVAILABLE_STR,
    MERC_IS_ALL_BANDAGED_STR,
    MERC_IS_OUT_OF_BANDAGES_STR,
    ENEMY_IN_SECTOR_STR,
    NO_ENEMIES_IN_SIGHT_STR,
    NOT_ENOUGH_APS_STR,
    NOBODY_USING_REMOTE_STR,
    BURST_FIRE_DEPLETED_CLIP_STR,
    ENEMY_TEAM_MERC_NAME,
    CREATURE_TEAM_MERC_NAME,
    MILITIA_TEAM_MERC_NAME,
    CIV_TEAM_MERC_NAME,

    // The text for the 'exiting sector' gui
    EXIT_GUI_TITLE_STR,
    OK_BUTTON_TEXT_STR,
    CANCEL_BUTTON_TEXT_STR,
    EXIT_GUI_SELECTED_MERC_STR,
    EXIT_GUI_ALL_MERCS_IN_SQUAD_STR,
    EXIT_GUI_GOTO_SECTOR_STR,
    EXIT_GUI_GOTO_MAP_STR,
    CANNOT_LEAVE_SECTOR_FROM_SIDE_STR,
    MERC_IS_TOO_FAR_AWAY_STR,
    REMOVING_TREETOPS_STR,
    SHOWING_TREETOPS_STR,
    CROW_HIT_LOCATION_STR,
    NECK_HIT_LOCATION_STR,
    HEAD_HIT_LOCATION_STR,
    TORSO_HIT_LOCATION_STR,
    LEGS_HIT_LOCATION_STR,
    YESNOLIE_STR,
    GUN_GOT_FINGERPRINT,
    GUN_NOGOOD_FINGERPRINT,
    GUN_GOT_TARGET,
    NO_PATH,
    MONEY_BUTTON_HELP_TEXT,
    AUTOBANDAGE_NOT_NEEDED,
    SHORT_JAMMED_GUN,
    CANT_GET_THERE,
    EXCHANGE_PLACES_REQUESTER,
    REFUSE_EXCHANGE_PLACES,
    PAY_MONEY_PROMPT,
    FREE_MEDICAL_PROMPT,
    MARRY_DARYL_PROMPT,
    KEYRING_HELP_TEXT,
    EPC_CANNOT_DO_THAT,
    SPARE_KROTT_PROMPT,
    OUT_OF_RANGE_STRING,
    CIV_TEAM_MINER_NAME,
    VEHICLE_CANT_MOVE_IN_TACTICAL,
    CANT_AUTOBANDAGE_PROMPT,
    NO_PATH_FOR_MERC,
    POW_MERCS_ARE_HERE,
    LOCK_HAS_BEEN_HIT,
    LOCK_HAS_BEEN_DESTROYED,
    DOOR_IS_BUSY,
    VEHICLE_VITAL_STATS_POPUPTEXT,
    NO_LOS_TO_TALK_TARGET,
  }

  export const enum Enum336 {
    EXIT_GUI_LOAD_ADJACENT_SECTOR_HELPTEXT,
    EXIT_GUI_GOTO_MAPSCREEN_HELPTEXT,
    EXIT_GUI_CANT_LEAVE_HOSTILE_SECTOR_HELPTEXT,
    EXIT_GUI_MUST_LOAD_ADJACENT_SECTOR_HELPTEXT,
    EXIT_GUI_MUST_GOTO_MAPSCREEN_HELPTEXT,
    EXIT_GUI_ESCORTED_CHARACTERS_MUST_BE_ESCORTED_HELPTEXT,
    EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_MALE_SINGULAR,
    EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_FEMALE_SINGULAR,
    EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_MALE_PLURAL,
    EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_FEMALE_PLURAL,
    EXIT_GUI_ALL_MERCS_MUST_BE_TOGETHER_TO_ALLOW_HELPTEXT,
    EXIT_GUI_EPC_NOT_ALLOWED_TO_LEAVE_ALONE_HELPTEXT,
    EXIT_GUI_SINGLE_TRAVERSAL_WILL_SEPARATE_SQUADS_HELPTEXT,
    EXIT_GUI_ALL_TRAVERSAL_WILL_MOVE_CURRENT_SQUAD_HELPTEXT,
    EXIT_GUI_ESCORTED_CHARACTERS_CANT_LEAVE_SECTOR_ALONE_STR,
  }

  export const enum Enum337 {
    LARGESTR_NOONE_LEFT_CAPABLE_OF_BATTLE_STR,
    LARGESTR_NOONE_LEFT_CAPABLE_OF_BATTLE_AGAINST_CREATURES_STR,
    LARGESTR_HAVE_BEEN_CAPTURED,
  }

  // Insurance Contract.c
  export const enum Enum338 {
    INS_CONTRACT_PREVIOUS,
    INS_CONTRACT_NEXT,
    INS_CONTRACT_ACCEPT,
    INS_CONTRACT_CLEAR,
  }

  // Insurance Info
  export const enum Enum339 {
    INS_INFO_PREVIOUS,
    INS_INFO_NEXT,
  }

  // Merc Account.c
  export const enum Enum340 {
    MERC_ACCOUNT_AUTHORIZE,
    MERC_ACCOUNT_HOME,
    MERC_ACCOUNT_ACCOUNT,
    MERC_ACCOUNT_MERC,
    MERC_ACCOUNT_DAYS,
    MERC_ACCOUNT_RATE,
    MERC_ACCOUNT_CHARGE,
    MERC_ACCOUNT_TOTAL,
    MERC_ACCOUNT_AUTHORIZE_CONFIRMATION,
    MERC_ACCOUNT_NOT_ENOUGH_MONEY,
  }

  // MercFile.c
  export const enum Enum341 {
    MERC_FILES_HEALTH,
    MERC_FILES_AGILITY,
    MERC_FILES_DEXTERITY,
    MERC_FILES_STRENGTH,
    MERC_FILES_LEADERSHIP,
    MERC_FILES_WISDOM,
    MERC_FILES_EXPLEVEL,
    MERC_FILES_MARKSMANSHIP,
    MERC_FILES_MECHANICAL,
    MERC_FILES_EXPLOSIVE,
    MERC_FILES_MEDICAL,

    MERC_FILES_PREVIOUS,
    MERC_FILES_HIRE,
    MERC_FILES_NEXT,
    MERC_FILES_ADDITIONAL_INFO,
    MERC_FILES_HOME,
    MERC_FILES_ALREADY_HIRED, // 5
    MERC_FILES_SALARY,
    MERC_FILES_PER_DAY,
    MERC_FILES_MERC_IS_DEAD,

    MERC_FILES_HIRE_TO_MANY_PEOPLE_WARNING,

    MERC_FILES_MERC_UNAVAILABLE,
  }

  // MercNoAccount.c
  export const enum Enum342 {
    MERC_NO_ACC_OPEN_ACCOUNT,
    MERC_NO_ACC_CANCEL,
    MERC_NO_ACC_NO_ACCOUNT_OPEN_ONE,
  }

  // Merc HomePage
  export const enum Enum343 {
    MERC_SPECK_OWNER,
    MERC_OPEN_ACCOUNT,
    MERC_VIEW_ACCOUNT,
    MERC_VIEW_FILES,
    MERC_SPECK_COM,
  }

  // Funerl.c
  export const enum Enum344 {
    FUNERAL_INTRO_1,
    FUNERAL_INTRO_2,
    FUNERAL_INTRO_3,
    FUNERAL_INTRO_4,
    FUNERAL_INTRO_5,
    FUNERAL_SEND_FLOWERS, // 5
    FUNERAL_CASKET_URN,
    FUNERAL_CREMATION,
    FUNERAL_PRE_FUNERAL,
    FUNERAL_FUNERAL_ETTIQUETTE,
    FUNERAL_OUR_CONDOLENCES, // 10
    FUNERAL_OUR_SYMPATHIES,
  }

  // Florist.c
  export const enum Enum345 {
    FLORIST_GALLERY,
    FLORIST_DROP_ANYWHERE,
    FLORIST_PHONE_NUMBER,
    FLORIST_STREET_ADDRESS,
    FLORIST_WWW_ADDRESS,
    FLORIST_ADVERTISEMENT_1,
    FLORIST_ADVERTISEMENT_2,
    FLORIST_ADVERTISEMENT_3,
    FLORIST_ADVERTISEMENT_4,
    FLORIST_ADVERTISEMENT_5,
    FLORIST_ADVERTISEMENT_6,
    FLORIST_ADVERTISEMENT_7,
    FLORIST_ADVERTISEMENT_8,
  }

  // Florist Order Form
  export const enum Enum346 {
    FLORIST_ORDER_BACK,
    FLORIST_ORDER_SEND,
    FLORIST_ORDER_CLEAR,
    FLORIST_ORDER_GALLERY,
    FLORIST_ORDER_NAME_BOUQUET,
    FLORIST_ORDER_PRICE, // 5
    FLORIST_ORDER_ORDER_NUMBER,
    FLORIST_ORDER_DELIVERY_DATE,
    FLORIST_ORDER_NEXT_DAY,
    FLORIST_ORDER_GETS_THERE,
    FLORIST_ORDER_DELIVERY_LOCATION, // 10
    FLORIST_ORDER_ADDITIONAL_CHARGES,
    FLORIST_ORDER_CRUSHED,
    FLORIST_ORDER_BLACK_ROSES,
    FLORIST_ORDER_WILTED,
    FLORIST_ORDER_FRUIT_CAKE, // 15
    FLORIST_ORDER_PERSONAL_SENTIMENTS,
    FLORIST_ORDER_CARD_LENGTH,
    FLORIST_ORDER_SELECT_FROM_OURS,
    FLORIST_ORDER_STANDARDIZED_CARDS,
    FLORIST_ORDER_BILLING_INFO, // 20
    FLORIST_ORDER_NAME,
  }

  // Florist Gallery.c
  export const enum Enum347 {
    FLORIST_GALLERY_PREV,
    FLORIST_GALLERY_NEXT,
    FLORIST_GALLERY_CLICK_TO_ORDER,
    FLORIST_GALLERY_ADDIFTIONAL_FEE,
    FLORIST_GALLERY_HOME,
  }

  // Florist Cards
  export const enum Enum348 {
    FLORIST_CARDS_CLICK_SELECTION,
    FLORIST_CARDS_BACK,
  }

  // Bobbyr Mail Order.c
  export const enum Enum349 {
    BOBBYR_ORDER_FORM,
    BOBBYR_QTY,
    BOBBYR_WEIGHT,
    BOBBYR_NAME,
    BOBBYR_UNIT_PRICE,
    BOBBYR_TOTAL,
    BOBBYR_SUB_TOTAL,
    BOBBYR_S_H,
    BOBBYR_GRAND_TOTAL,
    BOBBYR_SHIPPING_LOCATION,
    BOBBYR_SHIPPING_SPEED,
    BOBBYR_COST,
    BOBBYR_OVERNIGHT_EXPRESS,
    BOBBYR_BUSINESS_DAYS,
    BOBBYR_STANDARD_SERVICE,
    BOBBYR_CLEAR_ORDER,
    BOBBYR_ACCEPT_ORDER,
    BOBBYR_BACK,
    BOBBYR_HOME,
    BOBBYR_USED_TEXT,
    BOBBYR_CANT_AFFORD_PURCHASE,
    BOBBYR_SELECT_DEST,
    BOBBYR_CONFIRM_DEST,
    BOBBYR_PACKAGE_WEIGHT,
    BOBBYR_MINIMUM_WEIGHT,
    BOBBYR_GOTOSHIPMENT_PAGE,
  }

  // BobbyRGuns.c
  export const enum Enum350 {
    BOBBYR_GUNS_TO_ORDER,
    BOBBYR_GUNS_CLICK_ON_ITEMS,
    BOBBYR_GUNS_PREVIOUS_ITEMS,
    BOBBYR_GUNS_GUNS,
    BOBBYR_GUNS_AMMO,
    BOBBYR_GUNS_ARMOR, // 5
    BOBBYR_GUNS_MISC,
    BOBBYR_GUNS_USED,
    BOBBYR_GUNS_MORE_ITEMS,
    BOBBYR_GUNS_ORDER_FORM,
    BOBBYR_GUNS_HOME, // 10
    BOBBYR_GUNS_NUM_GUNS_THAT_USE_AMMO_1,
    BOBBYR_GUNS_NUM_GUNS_THAT_USE_AMMO_2,

    BOBBYR_GUNS_WGHT,
    BOBBYR_GUNS_CALIBRE,
    BOBBYR_GUNS_MAGAZINE,
    BOBBYR_GUNS_RANGE,
    BOBBYR_GUNS_DAMAGE,
    BOBBYR_GUNS_ROF, // 5
    BOBBYR_GUNS_COST,
    BOBBYR_GUNS_IN_STOCK,
    BOBBYR_GUNS_QTY_ON_ORDER,
    BOBBYR_GUNS_DAMAGED,
    BOBBYR_GUNS_WEIGHT, // 10
    BOBBYR_GUNS_SUB_TOTAL,
    BOBBYR_GUNS_PERCENT_FUNCTIONAL,

    BOBBYR_MORE_THEN_10_PURCHASES,
    BOBBYR_MORE_NO_MORE_IN_STOCK,
    BOBBYR_NO_MORE_STOCK,
  }

  // BobbyR.c
  export const enum Enum351 {
    BOBBYR_ADVERTISMENT_1,
    BOBBYR_ADVERTISMENT_2,
    BOBBYR_USED,
    BOBBYR_MISC,
    BOBBYR_GUNS,
    BOBBYR_AMMO,
    BOBBYR_ARMOR,
    BOBBYR_ADVERTISMENT_3,
    BOBBYR_UNDER_CONSTRUCTION,
  }

  // Aim Sort.c
  export const enum Enum352 {
    AIM_AIMMEMBERS,
    SORT_BY,
    PRICE,
    EXPERIENCE,
    AIMMARKSMANSHIP,
    AIMMEDICAL,
    EXPLOSIVES,
    AIMMECHANICAL,
    MUGSHOT_INDEX,
    MERCENARY_FILES,
    ALUMNI_GALLERY,
    ASCENDING,
    DESCENDING,
  }

  // Aim Policies.c
  export const enum Enum353 {
    AIM_POLICIES_PREVIOUS,
    AIM_POLICIES_HOMEPAGE,
    AIM_POLICIES_POLICY,
    AIM_POLICIES_NEXT_PAGE,
    AIM_POLICIES_DISAGREE,
    AIM_POLICIES_AGREE,
  }

  // Aim Member.c
  const enum Enum354 {
    AIM_MEMBER_CLICK_INSTRUCTIONS,
  }

  // Aim Member.c
  export const enum Enum355 {
    AIM_MEMBER_HEALTH,
    AIM_MEMBER_AGILITY,
    AIM_MEMBER_DEXTERITY,
    AIM_MEMBER_STRENGTH,
    AIM_MEMBER_LEADERSHIP,
    AIM_MEMBER_WISDOM, // 5
    AIM_MEMBER_EXP_LEVEL,
    AIM_MEMBER_MARKSMANSHIP,
    AIM_MEMBER_MECHANICAL,
    AIM_MEMBER_EXPLOSIVE,
    AIM_MEMBER_MEDICAL, // 10
    AIM_MEMBER_FEE,
    AIM_MEMBER_CONTRACT,
    AIM_MEMBER_1_DAY,
    AIM_MEMBER_1_WEEK,
    AIM_MEMBER_2_WEEKS, // 15
    AIM_MEMBER_PREVIOUS,
    AIM_MEMBER_CONTACT,
    AIM_MEMBER_NEXT,
    AIM_MEMBER_ADDTNL_INFO,
    AIM_MEMBER_ACTIVE_MEMBERS, // 20
    AIM_MEMBER_OPTIONAL_GEAR,
    AIM_MEMBER_MEDICAL_DEPOSIT_REQ,
  }

  // Aim Member.c
  export const enum Enum356 {
    AIM_MEMBER_CONTRACT_CHARGE,
    AIM_MEMBER_ONE_DAY,
    AIM_MEMBER_ONE_WEEK,
    AIM_MEMBER_TWO_WEEKS,
    AIM_MEMBER_NO_EQUIPMENT,
    AIM_MEMBER_BUY_EQUIPMENT, // 5
    AIM_MEMBER_TRANSFER_FUNDS,
    AIM_MEMBER_CANCEL,
    AIM_MEMBER_HIRE,
    AIM_MEMBER_HANG_UP,
    AIM_MEMBER_OK, // 10
    AIM_MEMBER_LEAVE_MESSAGE,
    AIM_MEMBER_VIDEO_CONF_WITH,
    AIM_MEMBER_CONNECTING,
    AIM_MEMBER_WITH_MEDICAL, // 14
  }

  // Aim Member.c
  export const enum Enum357 {
    AIM_MEMBER_FUNDS_TRANSFER_SUCCESFUL,
    AIM_MEMBER_FUNDS_TRANSFER_FAILED,
    AIM_MEMBER_NOT_ENOUGH_FUNDS,

    AIM_MEMBER_ON_ASSIGNMENT,
    AIM_MEMBER_LEAVE_MSG,
    AIM_MEMBER_DEAD,

    AIM_MEMBER_ALREADY_HAVE_20_MERCS,

    AIM_MEMBER_PRERECORDED_MESSAGE,
    AIM_MEMBER_MESSAGE_RECORDED,
  }

  // AIM Link.c
  export const enum Enum358 {
    AIM_LINK_TITLE,
  }

  // Aim History
  export const enum Enum359 {
    AIM_HISTORY_TITLE,
    AIM_HISTORY_PREVIOUS,
    AIM_HISTORY_HOME,
    AIM_HISTORY_AIM_ALUMNI,
    AIM_HISTORY_NEXT,
  }

  // Aim Facial Index
  export const enum Enum360 {
    AIM_FI_PRICE,
    AIM_FI_EXP,
    AIM_FI_MARKSMANSHIP,
    AIM_FI_MEDICAL,
    AIM_FI_EXPLOSIVES,
    AIM_FI_MECHANICAL,
    AIM_FI_AIM_MEMBERS_SORTED_ASCENDING,
    AIM_FI_AIM_MEMBERS_SORTED_DESCENDING,
    AIM_FI_LEFT_CLICK,
    AIM_FI_TO_SELECT,
    AIM_FI_RIGHT_CLICK,
    AIM_FI_TO_ENTER_SORT_PAGE,
    AIM_FI_AWAY,
    AIM_FI_DEAD,
  }

  // AimArchives.
  export const enum Enum361 {
    AIM_ALUMNI_PAGE_1,
    AIM_ALUMNI_PAGE_2,
    AIM_ALUMNI_PAGE_3,
    AIM_ALUMNI_ALUMNI,
    AIM_ALUMNI_DONE,
  }

  // Aim Home Page
  export const enum Enum362 {
    //	AIM_INFO_1,
    //	AIM_INFO_2,
    //	AIM_POLICIES,
    //	AIM_HISTORY,
    //	AIM_LINKS,		//5
    AIM_INFO_3,
    AIM_INFO_4,
    AIM_INFO_5,
    AIM_INFO_6,
    AIM_INFO_7, // 9
    AIM_BOBBYR_ADD1,
    AIM_BOBBYR_ADD2,
    AIM_BOBBYR_ADD3,
  }

  // Aim Home Page
  export const enum Enum363 {
    AIM_HOME,
    AIM_MEMBERS,
    AIM_ALUMNI,
    AIM_POLICIES,
    AIM_HISTORY,
    AIM_LINKS,
  }

  // MapScreen
  const enum Enum364 {
    MAP_SCREEN_MAP_LEVEL,
    MAP_SCREEN_NO_MILITIA_TEXT,
  }

  // Weapon Name and Description size
  export const ITEMSTRINGFILENAME = "BINARYDATA\\ITEMDESC.EDT";
  export const SIZE_ITEM_NAME = 160;
  export const SIZE_SHORT_ITEM_NAME = 160;
  export const SIZE_ITEM_INFO = 480;
  const SIZE_ITEM_PROS = 160;
  const SIZE_ITEM_CONS = 160;

  export const enum Enum365 {
    // Coordinating simultaneous arrival dialog strings
    STR_DETECTED_SIMULTANEOUS_ARRIVAL,
    STR_DETECTED_SINGULAR,
    STR_DETECTED_PLURAL,
    STR_COORDINATE,
    // AutoResove Enemy capturing strings
    STR_ENEMY_SURRENDER_OFFER,
    STR_ENEMY_CAPTURED,
    // AutoResolve Text buttons
    STR_AR_RETREAT_BUTTON,
    STR_AR_DONE_BUTTON,
    // AutoResolve header text
    STR_AR_DEFEND_HEADER,
    STR_AR_ATTACK_HEADER,
    STR_AR_ENCOUNTER_HEADER,
    STR_AR_SECTOR_HEADER,
    // String for AutoResolve battle over conditions
    STR_AR_OVER_VICTORY,
    STR_AR_OVER_DEFEAT,
    STR_AR_OVER_SURRENDERED,
    STR_AR_OVER_CAPTURED,
    STR_AR_OVER_RETREATED,
    STR_AR_MILITIA_NAME,
    STR_AR_ELITE_NAME,
    STR_AR_TROOP_NAME,
    STR_AR_ADMINISTRATOR_NAME,
    STR_AR_CREATURE_NAME,
    STR_AR_TIME_ELAPSED,
    STR_AR_MERC_RETREATED,
    STR_AR_MERC_RETREATING,
    STR_AR_MERC_RETREAT,
    // Strings for prebattle interface
    STR_PB_AUTORESOLVE_BTN,
    STR_PB_GOTOSECTOR_BTN,
    STR_PB_RETREATMERCS_BTN,
    STR_PB_ENEMYENCOUNTER_HEADER,
    STR_PB_ENEMYINVASION_HEADER,
    STR_PB_ENEMYAMBUSH_HEADER,
    STR_PB_ENTERINGENEMYSECTOR_HEADER,
    STR_PB_CREATUREATTACK_HEADER,
    STR_PB_BLOODCATAMBUSH_HEADER,
    STR_PB_ENTERINGBLOODCATLAIR_HEADER,
    STR_PB_LOCATION,
    STR_PB_ENEMIES,
    STR_PB_MERCS,
    STR_PB_MILITIA,
    STR_PB_CREATURES,
    STR_PB_BLOODCATS,
    STR_PB_SECTOR,
    STR_PB_NONE,
    STR_PB_NOTAPPLICABLE_ABBREVIATION,
    STR_PB_DAYS_ABBREVIATION,
    STR_PB_HOURS_ABBREVIATION,
    // Strings for the tactical placement gui
    // The four buttons and it's help text.
    STR_TP_CLEAR,
    STR_TP_SPREAD,
    STR_TP_GROUP,
    STR_TP_DONE,
    STR_TP_CLEARHELP,
    STR_TP_SPREADHELP,
    STR_TP_GROUPHELP,
    STR_TP_DONEHELP,
    STR_TP_DISABLED_DONEHELP,
    // various strings.
    STR_TP_SECTOR,
    STR_TP_CHOOSEENTRYPOSITIONS,
    STR_TP_INACCESSIBLE_MESSAGE,
    STR_TP_INVALID_MESSAGE,
    STR_TP_NAME_HASARRIVEDINSECTOR_XX,
    STR_PB_AUTORESOLVE_FASTHELP,
    STR_PB_DISABLED_AUTORESOLVE_FASTHELP,
    STR_PB_GOTOSECTOR_FASTHELP,
    STR_BP_RETREATSINGLE_FASTHELP,
    STR_BP_RETREATPLURAL_FASTHELP,

    // various popup messages for battle,
    STR_DIALOG_ENEMIES_ATTACK_MILITIA,
    STR_DIALOG_CREATURES_ATTACK_MILITIA,
    STR_DIALOG_CREATURES_KILL_CIVILIANS,
    STR_DIALOG_ENEMIES_ATTACK_UNCONCIOUSMERCS,
    STR_DIALOG_CREATURES_ATTACK_UNCONCIOUSMERCS,
  }

  export const enum Enum366 {
    STR_GAMECLOCK_DAY_NAME,
  }

  // enums for the Shopkeeper Interface
  export const enum Enum367 {
    SKI_TEXT_MERCHADISE_IN_STOCK,
    SKI_TEXT_PAGE,
    SKI_TEXT_TOTAL_COST,
    SKI_TEXT_TOTAL_VALUE,
    SKI_TEXT_EVALUATE,
    SKI_TEXT_TRANSACTION,
    SKI_TEXT_DONE,
    SKI_TEXT_REPAIR_COST,
    SKI_TEXT_ONE_HOUR,
    SKI_TEXT_PLURAL_HOURS,
    SKI_TEXT_REPAIRED,
    SKI_TEXT_NO_MORE_ROOM_IN_PLAYER_OFFER_AREA,
    SKI_TEXT_MINUTES,
    SKI_TEXT_DROP_ITEM_TO_GROUND,
  }

  // ShopKeeper Interface
  export const enum Enum368 {
    SKI_ATM_0,
    SKI_ATM_1,
    SKI_ATM_2,
    SKI_ATM_3,
    SKI_ATM_4,
    SKI_ATM_5,
    SKI_ATM_6,
    SKI_ATM_7,
    SKI_ATM_8,
    SKI_ATM_9,
    SKI_ATM_OK,
    SKI_ATM_TAKE,
    SKI_ATM_GIVE,
    SKI_ATM_CANCEL,
    SKI_ATM_CLEAR,

    NUM_SKI_ATM_BUTTONS,
  }

  // ShopKeeper Interface
  export const enum Enum369 {
    SKI_ATM_MODE_TEXT_SELECT_MODE,
    SKI_ATM_MODE_TEXT_ENTER_AMOUNT,
    SKI_ATM_MODE_TEXT_SELECT_TO_MERC,
    SKI_ATM_MODE_TEXT_SELECT_FROM_MERC,
    SKI_ATM_MODE_TEXT_SELECT_INUSUFFICIENT_FUNDS,
    SKI_ATM_MODE_TEXT_BALANCE,
  }

  // ShopKeeperInterface Message Box defines
  export const enum Enum370 {
    SKI_QUESTION_TO_DEDUCT_MONEY_FROM_PLAYERS_ACCOUNT_TO_COVER_DIFFERENCE,
    SKI_SHORT_FUNDS_TEXT,
    SKI_QUESTION_TO_DEDUCT_MONEY_FROM_PLAYERS_ACCOUNT_TO_COVER_COST,

    SKI_TRANSACTION_BUTTON_HELP_TEXT,
    SKI_REPAIR_TRANSACTION_BUTTON_HELP_TEXT,
    SKI_DONE_BUTTON_HELP_TEXT,

    SKI_PLAYERS_CURRENT_BALANCE,
  }

  // enums for the above text
  export const enum Enum371 {
    SLG_SAVE_GAME,
    SLG_LOAD_GAME,
    SLG_CANCEL,
    SLG_SAVE_SELECTED,
    SLG_LOAD_SELECTED,
    SLG_SAVE_GAME_OK, // 5
    SLG_SAVE_GAME_ERROR,
    SLG_LOAD_GAME_OK,
    SLG_LOAD_GAME_ERROR,
    SLG_GAME_VERSION_DIF,
    SLG_DELETE_ALL_SAVE_GAMES, // 10
    SLG_SAVED_GAME_VERSION_DIF,
    SLG_BOTH_GAME_AND_SAVED_GAME_DIF,
    SLG_CONFIRM_SAVE,
    SLG_CONFIRM_LOAD,
    SLG_NOT_ENOUGH_HARD_DRIVE_SPACE, // 15
    SLG_SAVING_GAME_MESSAGE,
    SLG_NORMAL_GUNS,
    SLG_ADDITIONAL_GUNS,
    SLG_REALISTIC,
    SLG_SCIFI, // 20

    SLG_DIFF,
  }

  // OptionScreen.h
  // defines used for the zOptionsText
  export const enum Enum372 {
    OPT_SAVE_GAME,
    OPT_LOAD_GAME,
    OPT_MAIN_MENU,
    OPT_DONE,
    OPT_SOUND_FX,
    OPT_SPEECH,
    OPT_MUSIC,
    OPT_RETURN_TO_MAIN,
    OPT_NEED_AT_LEAST_SPEECH_OR_SUBTITLE_OPTION_ON,
  }

  // used with the gMoneyStatsDesc[]
  export const enum Enum373 {
    MONEY_DESC_AMOUNT,
    MONEY_DESC_REMAINING,
    MONEY_DESC_AMOUNT_2_SPLIT,
    MONEY_DESC_TO_SPLIT,

    MONEY_DESC_PLAYERS,
    MONEY_DESC_BALANCE,
    MONEY_DESC_AMOUNT_2_WITHDRAW,
    MONEY_DESC_TO_WITHDRAW,
  }

  // used with gzMoneyWithdrawMessageText
  export const enum Enum374 {
    MONEY_TEXT_WITHDRAW_MORE_THEN_MAXIMUM,
    CONFIRMATION_TO_DEPOSIT_MONEY_TO_ACCOUNT,
  }

  // Game init option screen
  export const enum Enum375 {
    GIO_INITIAL_GAME_SETTINGS,

    GIO_GAME_STYLE_TEXT,
    GIO_REALISTIC_TEXT,
    GIO_SCI_FI_TEXT,

    GIO_GUN_OPTIONS_TEXT,
    GIO_GUN_NUT_TEXT,
    GIO_REDUCED_GUNS_TEXT,

    GIO_DIF_LEVEL_TEXT,
    GIO_EASY_TEXT,
    GIO_MEDIUM_TEXT,
    GIO_HARD_TEXT,

    GIO_OK_TEXT,
    GIO_CANCEL_TEXT,

    GIO_GAME_SAVE_STYLE_TEXT,
    GIO_SAVE_ANYWHERE_TEXT,
    GIO_IRON_MAN_TEXT,
    GIO_DISABLED_FOR_THE_DEMO_TEXT,
  }

  export const enum Enum376 {
    LAPTOP_BN_HLP_TXT_VIEW_EMAIL,
    LAPTOP_BN_HLP_TXT_BROWSE_VARIOUS_WEB_SITES,
    LAPTOP_BN_HLP_TXT_VIEW_FILES_AND_EMAIL_ATTACHMENTS,
    LAPTOP_BN_HLP_TXT_READ_LOG_OF_EVENTS,
    LAPTOP_BN_HLP_TXT_VIEW_TEAM_INFO,
    LAPTOP_BN_HLP_TXT_VIEW_FINANCIAL_SUMMARY_AND_HISTORY,
    LAPTOP_BN_HLP_TXT_CLOSE_LAPTOP,

    LAPTOP_BN_HLP_TXT_YOU_HAVE_NEW_MAIL,
    LAPTOP_BN_HLP_TXT_YOU_HAVE_NEW_FILE,

    BOOKMARK_TEXT_ASSOCIATION_OF_INTERNATION_MERCENARIES,
    BOOKMARK_TEXT_BOBBY_RAY_ONLINE_WEAPON_MAIL_ORDER,
    BOOKMARK_TEXT_INSTITUTE_OF_MERCENARY_PROFILING,
    BOOKMARK_TEXT_MORE_ECONOMIC_RECRUITING_CENTER,
    BOOKMARK_TEXT_MCGILLICUTTY_MORTUARY,
    BOOKMARK_TEXT_UNITED_FLORAL_SERVICE,
    BOOKMARK_TEXT_INSURANCE_BROKERS_FOR_AIM_CONTRACTS,
  }

  // enums for the help screen
  export const enum Enum377 {
    HLP_SCRN_TXT__EXIT_SCREEN,
  }

  // enums used for the mapscreen inventory messages
  const enum Enum378 {
    MAPINV_MERC_ISNT_CLOSE_ENOUGH,
    MAPINV_CANT_SELECT_MERC,
    MAPINV_NOT_IN_SECTOR_TO_TAKE,
    MAPINV_CANT_PICKUP_IN_COMBAT,
    MAPINV_CANT_DROP_IN_COMBAT,
    MAPINV_NOT_IN_SECTOR_TO_DROP,
  }

  // the laptop broken link site
  export const enum Enum379 {
    BROKEN_LINK_TXT_ERROR_404,
    BROKEN_LINK_TXT_SITE_NOT_FOUND,
  }

  // Bobby rays page for recent shipments
  export const enum Enum380 {
    BOBBYR_SHIPMENT__TITLE,
    BOBBYR_SHIPMENT__ORDER_NUM,
    BOBBYR_SHIPMENT__NUM_ITEMS,
    BOBBYR_SHIPMENT__ORDERED_ON,
  }

  export const enum Enum381 {
    GIO_CFS_NOVICE,
    GIO_CFS_EXPERIENCED,
    GIO_CFS_EXPERT,
  }

  export const enum Enum382 {
    CRDT_CAMFIELD,
    CRDT_SHAWN,
    CRDT_KRIS,
    CRDT_IAN,
    CRDT_LINDA,
    CRDT_ERIC,
    CRDT_LYNN,
    CRDT_NORM,
    CRDT_GEORGE,
    CRDT_STACEY,
    CRDT_SCOTT,
    CRDT_EMMONS,
    CRDT_DAVE,
    CRDT_ALEX,
    CRDT_JOEY,

    NUM_PEOPLE_IN_CREDITS,
  }
}
