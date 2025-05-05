namespace ja2 {
  //#define LOS_DEBUG

  // fixed-point arithmetic definitions start here

  export type FIXEDPT = INT32;
  // rem 1 signed bit at the top
  const FIXEDPT_WHOLE_BITS = 11;
  const FIXEDPT_FRACTIONAL_BITS = 20;
  export const FIXEDPT_FRACTIONAL_RESOLUTION = 1048576;

  export const INT32_TO_FIXEDPT = (n: number) => n << FIXEDPT_FRACTIONAL_BITS;
  export const FIXEDPT_TO_INT32 = (n: number) =>
    Math.trunc(n / FIXEDPT_FRACTIONAL_RESOLUTION);

  export const FIXEDPT_TO_TILE_NUM = (n: number) =>
    Math.trunc(FIXEDPT_TO_INT32(n) / CELL_X_SIZE);
  export const FIXEDPT_TO_LOS_INDEX = (n: number) =>
    CONVERT_WITHINTILE_TO_INDEX(FIXEDPT_TO_INT32(n) % CELL_X_SIZE);

  // fixed-point arithmetic definitions end here

  export const OK_CHANCE_TO_GET_THROUGH = 10;

  export const enum Enum229 {
    COLLISION_NONE,
    COLLISION_GROUND,
    COLLISION_MERC,
    COLLISION_WINDOW_SOUTHEAST,
    COLLISION_WINDOW_SOUTHWEST,
    COLLISION_WINDOW_NORTHEAST,
    COLLISION_WINDOW_NORTHWEST,
    COLLISION_WINDOW_NORTH,
    COLLISION_WALL_SOUTHEAST,
    COLLISION_WALL_SOUTHWEST,
    COLLISION_WALL_NORTHEAST,
    COLLISION_WALL_NORTHWEST,
    COLLISION_STRUCTURE,
    COLLISION_ROOF,
    COLLISION_INTERIOR_ROOF,
    COLLISION_STRUCTURE_Z,
    COLLISION_WATER,
  }

  export const HEIGHT_UNITS = 256;
  export const HEIGHT_UNITS_PER_INDEX = HEIGHT_UNITS / PROFILE_Z_SIZE;
  const MAX_STRUCTURE_HEIGHT = 50;
  // 5.12 == HEIGHT_UNITS / MAX_STRUCTURE_HEIGHT
  export const CONVERT_PIXELS_TO_HEIGHTUNITS = (n: number) =>
    Math.trunc((n * HEIGHT_UNITS) / MAX_STRUCTURE_HEIGHT);
  const CONVERT_PIXELS_TO_INDEX = (n: number) =>
    Math.trunc(
      (n * HEIGHT_UNITS) / MAX_STRUCTURE_HEIGHT / HEIGHT_UNITS_PER_INDEX,
    );
  export const CONVERT_HEIGHTUNITS_TO_INDEX = (n: number) =>
    Math.trunc(n / HEIGHT_UNITS_PER_INDEX);
  export const CONVERT_HEIGHTUNITS_TO_DISTANCE = (n: number) =>
    n / (HEIGHT_UNITS / CELL_X_SIZE);
  export const CONVERT_HEIGHTUNITS_TO_PIXELS = (n: number) =>
    Math.trunc((n * MAX_STRUCTURE_HEIGHT) / HEIGHT_UNITS);
  export const CONVERT_WITHINTILE_TO_INDEX = (n: number) => n >> 1;
  const CONVERT_INDEX_TO_WITHINTILE = (n: number) => n << 1;
  export const CONVERT_INDEX_TO_PIXELS = (n: number) =>
    Math.trunc(
      (n * MAX_STRUCTURE_HEIGHT * HEIGHT_UNITS_PER_INDEX) / HEIGHT_UNITS,
    );

  const TREE_SIGHT_REDUCTION = 6;
  const NORMAL_TREES = 10;

  export const enum Enum230 {
    LOS_POS,
    FIRING_POS,
    TARGET_POS,
    HEAD_TARGET_POS,
    TORSO_TARGET_POS,
    LEGS_TARGET_POS,
    HEIGHT,
  }

  // 191 is 6' (structures of height 3)
  // 127 is 4' (structures of height 2)
  //  63 is 2' (structures of height 1)

  export const STANDING_HEIGHT = 191.0;
  export const STANDING_LOS_POS = 175.0;
  export const STANDING_FIRING_POS = 175.0;
  export const STANDING_HEAD_TARGET_POS = 175.0;
  export const STANDING_HEAD_BOTTOM_POS = 159.0;
  export const STANDING_TORSO_TARGET_POS = 127.0;
  export const STANDING_TORSO_BOTTOM_POS = 95.0;
  export const STANDING_LEGS_TARGET_POS = 47.0;
  export const STANDING_TARGET_POS = STANDING_HEAD_TARGET_POS;

  export const CROUCHED_HEIGHT = 130.0;
  export const CROUCHED_LOS_POS = 111.0;
  export const CROUCHED_FIRING_POS = 111.0;

  export const CROUCHED_HEAD_TARGET_POS = 111.0;
  export const CROUCHED_HEAD_BOTTOM_POS = 95.0;
  export const CROUCHED_TORSO_TARGET_POS = 71.0;
  export const CROUCHED_TORSO_BOTTOM_POS = 47.0;
  export const CROUCHED_LEGS_TARGET_POS = 31.0;
  export const CROUCHED_TARGET_POS = CROUCHED_HEAD_TARGET_POS;

  export const PRONE_HEIGHT = 63.0;
  export const PRONE_LOS_POS = 31.0;
  export const PRONE_FIRING_POS = 31.0;
  export const PRONE_TORSO_TARGET_POS = 31.0;
  export const PRONE_HEAD_TARGET_POS = 31.0;
  export const PRONE_LEGS_TARGET_POS = 31.0;
  export const PRONE_TARGET_POS = PRONE_HEAD_TARGET_POS;

  export const WALL_HEIGHT_UNITS = HEIGHT_UNITS;
  export const WINDOW_BOTTOM_HEIGHT_UNITS = 87;
  export const WINDOW_TOP_HEIGHT_UNITS = 220;

  export const CLOSE_TO_FIRER = 25;
  const VERY_CLOSE_TO_FIRER = 21;

  // BOOLEAN FireBullet2( SOLDIERTYPE * pFirer, FLOAT dEndX, FLOAT dEndY, FLOAT dEndZ, INT16 sHitBy );
}
