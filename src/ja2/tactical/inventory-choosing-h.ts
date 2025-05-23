namespace ja2 {
  export const MORTAR_GRENADE_CLASS = 100;

  export interface ARMY_GUN_CHOICE_TYPE {
    ubChoices: UINT8; // how many valid choices there are in this category
    bItemNo: INT8[] /* [5] */; // room for up to 5 choices of gun in each category
  }

  export function createArmyGunChoiceTypeFrom(
    ubChoices: UINT8,
    bItemNo: INT8[],
  ): ARMY_GUN_CHOICE_TYPE {
    return {
      ubChoices,
      bItemNo,
    };
  }

  export const enum Enum223 {
    // administrator ratings (1-5)
    BAD_ADMINISTRATOR_EQUIPMENT_RATING = 1,
    POOR_ADMINISTRATOR_EQUIPMENT_RATING,
    AVERAGE_ADMINISTRATOR_EQUIPMENT_RATING,
    GOOD_ADMINISTRATOR_EQUIPMENT_RATING,
    GREAT_ADMINISTRATOR_EQUIPMENT_RATING,
    // army ratings (3-7)
    BAD_ARMY_EQUIPMENT_RATING = AVERAGE_ADMINISTRATOR_EQUIPMENT_RATING,
    POOR_ARMY_EQUIPMENT_RATING,
    AVERAGE_ARMY_EQUIPMENT_RATING,
    GOOD_ARMY_EQUIPMENT_RATING,
    GREAT_ARMY_EQUIPMENT_RATING,
    // elite ratings (5-9)
    BAD_ELITE_EQUIPMENT_RATING = AVERAGE_ARMY_EQUIPMENT_RATING,
    POOR_ELITE_EQUIPMENT_RATING,
    AVERAGE_ELITE_EQUIPMENT_RATING,
    GOOD_ELITE_EQUIPMENT_RATING,
    GREAT_ELITE_EQUIPMENT_RATING,

    // militia ratings (1-5)
    BAD_MILITIA_EQUIPMENT_RATING = BAD_ADMINISTRATOR_EQUIPMENT_RATING,
    POOR_MILITIA_EQUIPMENT_RATING,
    AVERAGE_MILITIA_EQUIPMENT_RATING,
    GOOD_MILITIA_EQUIPMENT_RATING,
    GREAT_MILITIA_EQUIPMENT_RATING,
  }

  export const MIN_EQUIPMENT_CLASS = 1;
  export const MAX_EQUIPMENT_CLASS = 11;
}
