namespace ja2 {
  // TEMP SELECT STUFF
  export const NO_SELECT = 0;
  const FULL_SELECT = 1;
  const SELECT_WIDTH = 2;
  const SELECT_HEIGHT = 3;

  // RENDERING FLAGS
  export const RENDER_FLAG_FULL = 0x00000001;
  export const RENDER_FLAG_SHADOWS = 0x00000002;
  export const RENDER_FLAG_MARKED = 0x00000004;
  export const RENDER_FLAG_SAVEOFF = 0x00000008;
  export const RENDER_FLAG_NOZ = 0x00000010;
  export const RENDER_FLAG_ROOMIDS = 0x00000020;
  export const RENDER_FLAG_CHECKZ = 0x00000040;
  const RENDER_FLAG_ONLYLAND = 0x00000080;
  const RENDER_FLAG_ONLYSTRUCT = 0x00000100;
  const RENDER_FLAG_FOVDEBUG = 0x00000200;

  export const SCROLL_UP = 0x00000001;
  export const SCROLL_DOWN = 0x00000002;
  export const SCROLL_RIGHT = 0x00000004;
  export const SCROLL_LEFT = 0x00000008;
  export const SCROLL_UPLEFT = 0x00000020;
  export const SCROLL_UPRIGHT = 0x00000040;
  export const SCROLL_DOWNLEFT = 0x00000080;
  export const SCROLL_DOWNRIGHT = 0x00000200;

  export const Z_SUBLAYERS = 8;
  export const LAND_Z_LEVEL = 0;
  export const OBJECT_Z_LEVEL = 1;
  export const SHADOW_Z_LEVEL = 2;
  export const MERC_Z_LEVEL = 3;
  export const STRUCT_Z_LEVEL = 4;
  export const ROOF_Z_LEVEL = 5;
  export const ONROOF_Z_LEVEL = 6;
  const FOG_Z_LEVEL = 7;
  export const TOPMOST_Z_LEVEL = 32767;

  // highest bit value is rendered first!
  export const TILES_STATIC_LAND = 0x00040000;
  export const TILES_STATIC_OBJECTS = 0x00020000;
  export const TILES_STATIC_SHADOWS = 0x00008000;
  export const TILES_STATIC_STRUCTURES = 0x00004000;
  export const TILES_STATIC_ROOF = 0x00002000;
  export const TILES_STATIC_ONROOF = 0x00001000;
  export const TILES_STATIC_TOPMOST = 0x00000800;

  // highest bit value is rendered first!
  export const TILES_ALL_DYNAMICS = 0x00000fff;
  export const TILES_DYNAMIC_CHECKFOR_INT_TILE = 0x00000400;
  export const TILES_DYNAMIC_LAND = 0x00000200;
  export const TILES_DYNAMIC_OBJECTS = 0x00000100;
  export const TILES_DYNAMIC_SHADOWS = 0x00000080;
  export const TILES_DYNAMIC_STRUCT_MERCS = 0x00000040;
  export const TILES_DYNAMIC_MERCS = 0x00000020;
  export const TILES_DYNAMIC_STRUCTURES = 0x00000010;
  export const TILES_DYNAMIC_ROOF = 0x00000008;
  export const TILES_DYNAMIC_HIGHMERCS = 0x00000004;
  export const TILES_DYNAMIC_ONROOF = 0x00000002;
  export const TILES_DYNAMIC_TOPMOST = 0x00000001;

  // Distance around mercs to pixelate walls
  const REVEAL_WALLS_RADIUS = 3;
}
