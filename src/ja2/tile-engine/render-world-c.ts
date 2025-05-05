namespace ja2 {
  let fLandLayerDirty: boolean = true;

  export let gpZBuffer: Uint8ClampedArray = <Uint8ClampedArray>(<unknown>null);
  let gfTagAnimatedTiles: boolean = true;

  let gsCurrentGlowFrame: INT16 = 0;
  let gsCurrentItemGlowFrame: INT16 = 0;

  // VIEWPORT OFFSET VALUES
  // NOTE:
  // THESE VALUES MUST BE MULTIPLES OF TILE SIZES!
  const VIEWPORT_XOFFSET_S = WORLD_TILE_X * 1;
  const VIEWPORT_YOFFSET_S = WORLD_TILE_Y * 2;
  const LARGER_VIEWPORT_XOFFSET_S = VIEWPORT_XOFFSET_S * 3;
  const LARGER_VIEWPORT_YOFFSET_S = VIEWPORT_YOFFSET_S * 5;

  const TILES_TYPE_BITMASK = 0x00040000;

  const TILES_TYPE_MASK = 0x07ffffff;

  const TILES_DIRTY = 0x80000000;
  const TILES_DYNAMIC = 0x40000000;
  const TILES_NOZWRITE = 0x20000000;
  const TILES_MARKED = 0x10000000;
  const TILES_NOZ = 0x04000000;
  const TILES_DOALL = 0x02000000;
  const TILES_OBSCURED = 0x01000000;

  //#define TILES_MERC								0x00000400
  //#define TILES_Z_BLITTER						0x00000200
  //#define TILES_Z_WRITE							0x00000100
  //#define TILES_SHADOW							0x00000080
  //#define TILES_BACKWARDS						0x00000040

  const MAX_RENDERED_ITEMS = 3;

  // RENDERER FLAGS FOR DIFFERENT RENDER LEVELS
  const enum Enum306 {
    RENDER_STATIC_LAND,
    RENDER_STATIC_OBJECTS,
    RENDER_STATIC_SHADOWS,
    RENDER_STATIC_STRUCTS,
    RENDER_STATIC_ROOF,
    RENDER_STATIC_ONROOF,
    RENDER_STATIC_TOPMOST,
    RENDER_DYNAMIC_LAND,
    RENDER_DYNAMIC_OBJECTS,
    RENDER_DYNAMIC_SHADOWS,
    RENDER_DYNAMIC_STRUCT_MERCS,
    RENDER_DYNAMIC_MERCS,
    RENDER_DYNAMIC_STRUCTS,
    RENDER_DYNAMIC_ROOF,
    RENDER_DYNAMIC_HIGHMERCS,
    RENDER_DYNAMIC_ONROOF,
    RENDER_DYNAMIC_TOPMOST,
    NUM_RENDER_FX_TYPES,
  }

  const SCROLL_INTERTIA_STEP1 = 6;
  const SCROLL_INTERTIA_STEP2 = 8;

  //#define SHORT_ROUND( x ) ( (INT16)( ( x * 1000 ) / 1000 ) )
  const SHORT_ROUND = (x: number) => x;

  const NUM_ITEM_CYCLE_COLORS = 60;

  let us16BPPItemCycleWhiteColors: UINT16[] /* [NUM_ITEM_CYCLE_COLORS] */ =
    createArray(NUM_ITEM_CYCLE_COLORS, 0);
  let us16BPPItemCycleRedColors: UINT16[] /* [NUM_ITEM_CYCLE_COLORS] */ =
    createArray(NUM_ITEM_CYCLE_COLORS, 0);
  let us16BPPItemCycleYellowColors: UINT16[] /* [NUM_ITEM_CYCLE_COLORS] */ =
    createArray(NUM_ITEM_CYCLE_COLORS, 0);

  let gsLobOutline: INT16;
  let gsThrowOutline: INT16;
  let gsGiveOutline: INT16;
  let gusNormalItemOutlineColor: INT16;
  let gusYellowItemOutlineColor: INT16;

  export let gsRenderHeight: INT16 = 0;
  export let gfRenderFullThisFrame: boolean = false;

  // UINT8		gubIntTileCheckFlags	 = INTILE_CHECK_FULL;
  let gubIntTileCheckFlags: UINT8 = INTILE_CHECK_SELECTIVE;

  let ubRGBItemCycleWhiteColors: UINT8[] /* [] */ = [
    25, 25, 25, 50, 50, 50, 75, 75, 75, 100, 100, 100, 125, 125, 125, 150, 150,
    150, 175, 175, 175, 200, 200, 200, 225, 225, 225, 250, 250, 250,

    250, 250, 250, 225, 225, 225, 200, 200, 200, 175, 175, 175, 150, 150, 150,
    125, 125, 125, 100, 100, 100, 75, 75, 75, 50, 50, 50, 25, 25, 25,

    25, 25, 25, 50, 50, 50, 75, 75, 75, 100, 100, 100, 125, 125, 125, 150, 150,
    150, 175, 175, 175, 200, 200, 200, 225, 225, 225, 250, 250, 250,

    250, 250, 250, 225, 225, 225, 200, 200, 200, 175, 175, 175, 150, 150, 150,
    125, 125, 125, 100, 100, 100, 75, 75, 75, 50, 50, 50, 25, 25, 25,

    25, 25, 25, 50, 50, 50, 75, 75, 75, 100, 100, 100, 125, 125, 125, 150, 150,
    150, 175, 175, 175, 200, 200, 200, 225, 225, 225, 250, 250, 250,

    250, 250, 250, 225, 225, 225, 200, 200, 200, 175, 175, 175, 150, 150, 150,
    125, 125, 125, 100, 100, 100, 75, 75, 75, 50, 50, 50, 25, 25, 25,
  ];

  let ubRGBItemCycleRedColors: UINT8[] /* [] */ = [
    25, 0, 0, 50, 0, 0, 75, 0, 0, 100, 0, 0, 125, 0, 0, 150, 0, 0, 175, 0, 0,
    200, 0, 0, 225, 0, 0, 250, 0, 0,

    250, 0, 0, 225, 0, 0, 200, 0, 0, 175, 0, 0, 150, 0, 0, 125, 0, 0, 100, 0, 0,
    75, 0, 0, 50, 0, 0, 25, 0, 0,

    25, 0, 0, 50, 0, 0, 75, 0, 0, 100, 0, 0, 125, 0, 0, 150, 0, 0, 175, 0, 0,
    200, 0, 0, 225, 0, 0, 250, 0, 0,

    250, 0, 0, 225, 0, 0, 200, 0, 0, 175, 0, 0, 150, 0, 0, 125, 0, 0, 100, 0, 0,
    75, 0, 0, 50, 0, 0, 25, 0, 0,

    25, 0, 0, 50, 0, 0, 75, 0, 0, 100, 0, 0, 125, 0, 0, 150, 0, 0, 175, 0, 0,
    200, 0, 0, 225, 0, 0, 250, 0, 0,

    250, 0, 0, 225, 0, 0, 200, 0, 0, 175, 0, 0, 150, 0, 0, 125, 0, 0, 100, 0, 0,
    75, 0, 0, 50, 0, 0, 25, 0, 0,
  ];

  let ubRGBItemCycleYellowColors: UINT8[] /* [] */ = [
    25, 25, 0, 50, 50, 0, 75, 75, 0, 100, 100, 0, 125, 125, 0, 150, 150, 0, 175,
    175, 0, 200, 200, 0, 225, 225, 0, 250, 250, 0,

    250, 250, 0, 225, 225, 0, 200, 200, 0, 175, 175, 0, 150, 150, 0, 125, 125,
    0, 100, 100, 0, 75, 75, 0, 50, 50, 0, 25, 25, 0,

    25, 25, 0, 50, 50, 0, 75, 75, 0, 100, 100, 0, 125, 125, 0, 150, 150, 0, 175,
    175, 0, 200, 200, 0, 225, 225, 0, 250, 250, 0,

    250, 250, 0, 225, 225, 0, 200, 200, 0, 175, 175, 0, 150, 150, 0, 125, 125,
    0, 100, 100, 0, 75, 75, 0, 50, 50, 0, 25, 25, 0,

    25, 25, 0, 50, 50, 0, 75, 75, 0, 100, 100, 0, 125, 125, 0, 150, 150, 0, 175,
    175, 0, 200, 200, 0, 225, 225, 0, 250, 250, 0,

    250, 250, 0, 225, 225, 0, 200, 200, 0, 175, 175, 0, 150, 150, 0, 125, 125,
    0, 100, 100, 0, 75, 75, 0, 50, 50, 0, 25, 25, 0,
  ];

  const NUMSPEEDS = 5;

  let gubNewScrollXSpeeds: UINT8[][] /* [2][NUMSPEEDS] */ = [
    [40, 80, 100, 180, 200], // Non-video mode scroll
    [20, 40, 80, 80, 80], // Video mode scroll
  ];

  let gubNewScrollYSpeeds: UINT8[][] /* [2][NUMSPEEDS] */ = [
    [40, 80, 100, 180, 200], // Non-video mode scroll
    [10, 20, 60, 80, 80], // Video mode scroll
  ];

  // These speeds are only an indication of how long to do each subtile step until moving on to another
  let gubNewScrollIDSpeeds: UINT8[] /* [] */ = [10, 10, 20, 20, 20];

  let gubScrollSpeedStartID: UINT8 = 2;
  let gubScrollSpeedEndID: UINT8 = 4;

  export let gubCurScrollSpeedID: UINT8 = 1;

  export let gfDoVideoScroll: UINT8 /* boolean */ = 1;
  let gfDoSubtileScroll: boolean = false;

  export let gfScrollPending: boolean = false;

  let uiLayerUsedFlags: UINT32 = 0xffffffff;
  let uiAdditiveLayerUsedFlags: UINT32 = 0xffffffff;

  // Array of shade values to use.....
  const NUM_GLOW_FRAMES = 30;

  let gsGlowFrames: INT16[] /* [] */ = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    2, 4, 6, 8, 9, 8, 6, 4, 2, 0,
  ];

  // This has to be the same # of frames as NUM_GLOW_FRAMES
  let gsFastGlowFrames: INT16[] /* [] */ = [
    0, 0, 6, 7, 8, 9, 8, 7, 6, 5,

    0, 0, 6, 7, 8, 9, 8, 7, 6, 5,

    0, 0, 6, 7, 8, 9, 8, 7, 6, 5,
  ];

  // The glow frame pointer can be adjusted to use a faster/ slower glow
  let gpGlowFramePointer: INT16[] = gsGlowFrames;

  let gScrollDirectionFlags: UINT32[] /* [NUM_WORLD_DIRECTIONS] */ = [
    SCROLL_UP | SCROLL_RIGHT,
    SCROLL_RIGHT,
    SCROLL_DOWN | SCROLL_RIGHT,
    SCROLL_DOWN,
    SCROLL_DOWN | SCROLL_LEFT,
    SCROLL_LEFT,
    SCROLL_UP | SCROLL_LEFT,
    SCROLL_UP,
  ];

  export let SCROLL_X_STEP: INT16 = WORLD_TILE_X;
  export let SCROLL_Y_STEP: INT16 = WORLD_TILE_Y * 2;

  export let gsVIEWPORT_START_X: INT16 = 0;
  export let gsVIEWPORT_START_Y: INT16 = 0;
  export let gsVIEWPORT_END_Y: INT16 = 360;
  export let gsVIEWPORT_WINDOW_END_Y: INT16 = 360;
  export let gsVIEWPORT_WINDOW_START_Y: INT16 = 0;
  export let gsVIEWPORT_END_X: INT16 = 640;

  export let gsTopLeftWorldX: INT16;
  export let gsTopLeftWorldY: INT16;
  let gsTopRightWorldX: INT16;
  let gsTopRightWorldY: INT16;
  let gsBottomLeftWorldX: INT16;
  let gsBottomLeftWorldY: INT16;
  export let gsBottomRightWorldX: INT16;
  export let gsBottomRightWorldY: INT16;
  export let gfIgnoreScrolling: boolean = false;

  export let gfIgnoreScrollDueToCenterAdjust: boolean = false;

  // GLOBAL SCROLLING PARAMS
  let gTopLeftWorldLimitX: INT16;
  let gTopLeftWorldLimitY: INT16;
  let gTopRightWorldLimitX: INT16;
  let gTopRightWorldLimitY: INT16;
  let gBottomLeftWorldLimitX: INT16;
  let gBottomLeftWorldLimitY: INT16;
  let gBottomRightWorldLimitX: INT16;
  let gBottomRightWorldLimitY: INT16;
  export let gCenterWorldX: INT16;
  export let gCenterWorldY: INT16;
  export let gsTLX: INT16;
  export let gsTLY: INT16;
  export let gsTRX: INT16;
  export let gsTRY: INT16;
  let gsBLX: INT16;
  export let gsBLY: INT16;
  export let gsBRX: INT16;
  export let gsBRY: INT16;
  export let gsCX: INT16;
  export let gsCY: INT16;
  export let gdScaleX: DOUBLE;
  export let gdScaleY: DOUBLE;

  const FASTMAPROWCOLTOPOS = (r: number, c: number) => r * WORLD_COLS + c;

  export let gfScrollInertia: UINT8 /* boolean */ = 0;

  // GLOBALS FOR CALCULATING STARTING PARAMETERS
  let gsStartPointX_W: INT16;
  let gsStartPointY_W: INT16;
  let gsStartPointX_S: INT16;
  let gsStartPointY_S: INT16;
  let gsStartPointX_M: INT16;
  let gsStartPointY_M: INT16;
  let gsEndXS: INT16;
  let gsEndYS: INT16;
  // LARGER OFFSET VERSION FOR GIVEN LAYERS
  let gsLStartPointX_W: INT16;
  let gsLStartPointY_W: INT16;
  let gsLStartPointX_S: INT16;
  let gsLStartPointY_S: INT16;
  let gsLStartPointX_M: INT16;
  let gsLStartPointY_M: INT16;
  let gsLEndXS: INT16;
  let gsLEndYS: INT16;

  export let gfRenderScroll: boolean = false;
  export let gfScrollStart: boolean = false;
  export let gsScrollXIncrement: INT16;
  export let gsScrollYIncrement: INT16;
  export let guiScrollDirection: INT32;

  // Rendering flags (full, partial, etc.)
  export let gRenderFlags: UINT32 = 0;

  let gClippingRect: SGPRect = createSGPRectFrom(0, 0, 640, 360);
  let gOldClipRect: SGPRect = createSGPRect();
  export let gsRenderCenterX: INT16;
  export let gsRenderCenterY: INT16;
  export let gsRenderWorldOffsetX: INT16 = -1;
  export let gsRenderWorldOffsetY: INT16 = -1;
  export let gSelectRegion: SGPRect = createSGPRect();
  let fSelectMode: UINT32 = NO_SELECT;
  export let gSelectAnchor: SGPPoint = createSGPPoint();

  interface RenderFXType {
    fDynamic: boolean;
    fZWrite: boolean;
    fZBlitter: boolean;
    fShadowBlitter: boolean;
    fLinkedListDirection: boolean;
    fMerc: boolean;
    fCheckForRedundency: boolean;
    fMultiZBlitter: boolean;
    fConvertTo16: boolean;
    fObscured: boolean;
  }

  function createRenderFXType(): RenderFXType {
    return {
      fDynamic: false,
      fZWrite: false,
      fZBlitter: false,
      fShadowBlitter: false,
      fLinkedListDirection: false,
      fMerc: false,
      fCheckForRedundency: false,
      fMultiZBlitter: false,
      fConvertTo16: false,
      fObscured: false,
    };
  }

  function createRenderFXTypeFrom(
    fDynamic: boolean,
    fZWrite: boolean,
    fZBlitter: boolean,
    fShadowBlitter: boolean,
    fLinkedListDirection: boolean,
    fMerc: boolean,
    fCheckForRedundency: boolean,
    fMultiZBlitter: boolean,
    fConvertTo16: boolean,
    fObscured: boolean,
  ): RenderFXType {
    return {
      fDynamic,
      fZWrite,
      fZBlitter,
      fShadowBlitter,
      fLinkedListDirection,
      fMerc,
      fCheckForRedundency,
      fMultiZBlitter,
      fConvertTo16,
      fObscured,
    };
  }

  let RenderFX: RenderFXType[] /* [] */ = [
    createRenderFXTypeFrom(
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
    ), // STATIC LAND
    createRenderFXTypeFrom(
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
    ), // STATIC OBJECTS
    createRenderFXTypeFrom(
      false,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ), // STATIC SHADOWS
    createRenderFXTypeFrom(
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
    ), // STATIC STRUCTS
    createRenderFXTypeFrom(
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ), // STATIC ROOF
    createRenderFXTypeFrom(
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
    ), // STATIC ONROOF
    createRenderFXTypeFrom(
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ), // STATIC TOPMOST
    createRenderFXTypeFrom(
      true,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
    ), // DYNAMIC LAND
    createRenderFXTypeFrom(
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
    ), // DYNAMIC OBJECT
    createRenderFXTypeFrom(
      true,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ), // DYNAMIC SHADOW
    createRenderFXTypeFrom(
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
    ), // DYNAMIC STRUCT MERCS
    createRenderFXTypeFrom(
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
    ), // DYNAMIC MERCS
    createRenderFXTypeFrom(
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ), // DYNAMIC STRUCT
    createRenderFXTypeFrom(
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ), // DYNAMIC ROOF
    createRenderFXTypeFrom(
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
    ), // DYNAMIC HIGHMERCS
    createRenderFXTypeFrom(
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ), // DYNAMIC ONROOF
    createRenderFXTypeFrom(
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ), // DYNAMIC TOPMOST
  ];

  let RenderFXStartIndex: UINT8[] /* [] */ = [
    LAND_START_INDEX, // STATIC LAND
    OBJECT_START_INDEX, // STATIC OBJECTS
    SHADOW_START_INDEX, // STATIC SHADOWS
    STRUCT_START_INDEX, // STATIC STRUCTS
    ROOF_START_INDEX, // STATIC ROOF
    ONROOF_START_INDEX, // STATIC ONROOF
    TOPMOST_START_INDEX, // STATIC TOPMOST
    LAND_START_INDEX, // DYNAMIC LAND
    OBJECT_START_INDEX, // DYNAMIC OBJECT
    SHADOW_START_INDEX, // DYNAMIC SHADOW
    MERC_START_INDEX, // DYNAMIC STRUCT MERCS
    MERC_START_INDEX, // DYNAMIC MERCS
    STRUCT_START_INDEX, // DYNAMIC STRUCT
    ROOF_START_INDEX, // DYNAMIC ROOF
    MERC_START_INDEX, // DYNAMIC HIGHMERCS
    ONROOF_START_INDEX, // DYNAMIC ONROOF
    TOPMOST_START_INDEX, // DYNAMIC TOPMOST
  ];

  // INT16 gsCoordArray[ 500 ][ 500 ][ 4 ];
  // INT16 gsCoordArrayX;
  // INT16 gsCoordArrayY;

  // void SetRenderGlobals( INT16 sStartPointX_M, INT16 sStartPointY_M, INT16 sStartPointX_S, INT16 sStartPointY_S, INT16 sEndXS, INT16 sEndYS );
  // void TempRenderTiles(UINT32 uiFlags, INT16 sStartPointX_M, INT16 sStartPointY_M, INT16 sStartPointX_S, INT16 sStartPointY_S, INT16 sEndXS, INT16 sEndYS );
  // void TempRenderTiles(UINT32 uiFlags, INT16 sStartPointX_M, INT16 sStartPointY_M, INT16 sStartPointX_S, INT16 sStartPointY_S, INT16 sEndXS, INT16 sEndYS, UINT8 ubNumLevels, UINT32 *puiLevels );

  function RevealWalls(sX: INT16, sY: INT16, sRadius: INT16): boolean {
    let pStruct: LEVELNODE | null;
    let sCountX: INT16;
    let sCountY: INT16;
    let uiTile: UINT32;
    let fRerender: boolean = false;
    let TileElem: TILE_ELEMENT;

    for (sCountY = sY - sRadius; sCountY < sY + sRadius + 2; sCountY++)
      for (sCountX = sX - sRadius; sCountX < sX + sRadius + 2; sCountX++) {
        uiTile = FASTMAPROWCOLTOPOS(sCountY, sCountX);
        pStruct = gpWorldLevelData[uiTile].pStructHead;

        while (pStruct != null) {
          TileElem = gTileDatabase[pStruct.usIndex];
          switch (TileElem.usWallOrientation) {
            case Enum314.NO_ORIENTATION:
              break;

            case Enum314.INSIDE_TOP_RIGHT:
            case Enum314.OUTSIDE_TOP_RIGHT:
              if (sCountX >= sX) {
                pStruct.uiFlags |= LEVELNODE_REVEAL;
                fRerender = true;
              }
              break;

            case Enum314.INSIDE_TOP_LEFT:
            case Enum314.OUTSIDE_TOP_LEFT:
              if (sCountY >= sY) {
                pStruct.uiFlags |= LEVELNODE_REVEAL;
                fRerender = true;
              }
              break;
          }
          pStruct = pStruct.pNext;
        }
      }

    /*
          if(fRerender)
                  SetRenderFlags(RENDER_FLAG_FULL);
  */

    return true;
  }

  function ConcealWalls(sX: INT16, sY: INT16, sRadius: INT16): boolean {
    let pStruct: LEVELNODE | null;
    let sCountX: INT16;
    let sCountY: INT16;
    let uiTile: UINT32;
    let fRerender: boolean = false;
    let TileElem: TILE_ELEMENT;

    for (sCountY = sY - sRadius; sCountY < sY + sRadius + 2; sCountY++)
      for (sCountX = sX - sRadius; sCountX < sX + sRadius + 2; sCountX++) {
        uiTile = FASTMAPROWCOLTOPOS(sCountY, sCountX);
        pStruct = gpWorldLevelData[uiTile].pStructHead;

        while (pStruct != null) {
          TileElem = gTileDatabase[pStruct.usIndex];
          switch (TileElem.usWallOrientation) {
            case Enum314.NO_ORIENTATION:
              break;

            case Enum314.INSIDE_TOP_RIGHT:
            case Enum314.OUTSIDE_TOP_RIGHT:
              if (sCountX >= sX) {
                pStruct.uiFlags &= ~LEVELNODE_REVEAL;
                fRerender = true;
              }
              break;

            case Enum314.INSIDE_TOP_LEFT:
            case Enum314.OUTSIDE_TOP_LEFT:
              if (sCountY >= sY) {
                pStruct.uiFlags &= ~LEVELNODE_REVEAL;
                fRerender = true;
              }
              break;
          }
          pStruct = pStruct.pNext;
        }
      }

    /*
          if(fRerender)
                  SetRenderFlags(RENDER_FLAG_FULL);
  */

    return true;
  }

  function ConcealAllWalls(): void {
    let pStruct: LEVELNODE | null;
    let uiCount: UINT32;

    for (uiCount = 0; uiCount < WORLD_MAX; uiCount++) {
      pStruct = gpWorldLevelData[uiCount].pStructHead;
      while (pStruct != null) {
        pStruct.uiFlags &= ~LEVELNODE_REVEAL;
        pStruct = pStruct.pNext;
      }
    }
  }

  function ResetLayerOptimizing(): void {
    uiLayerUsedFlags = 0xffffffff;
    uiAdditiveLayerUsedFlags = 0;
  }

  export function ResetSpecificLayerOptimizing(uiRowFlag: UINT32): void {
    uiLayerUsedFlags |= uiRowFlag;
  }

  function SumAddiviveLayerOptimization(): void {
    uiLayerUsedFlags = uiAdditiveLayerUsedFlags;
  }

  export function SetRenderFlags(uiFlags: UINT32): void {
    gRenderFlags |= uiFlags;
  }

  export function ClearRenderFlags(uiFlags: UINT32): void {
    gRenderFlags &= ~uiFlags;
  }

  function GetRenderFlags(): UINT32 {
    return gRenderFlags;
  }

  export function RenderSetShadows(fShadows: boolean): void {
    if (fShadows) gRenderFlags |= RENDER_FLAG_SHADOWS;
    else gRenderFlags &= ~RENDER_FLAG_SHADOWS;
  }

  /* static */ let RenderTiles__ubLevelNodeStartIndex: UINT8[] /* [NUM_RENDER_FX_TYPES] */ =
    createArray(Enum306.NUM_RENDER_FX_TYPES, 0);
  /* static */ let RenderTiles__iTileMapPos: INT32[] /* [500] */ = createArray(
    500,
    0,
  );
  /* static */ let RenderTiles__RenderFXList: RenderFXType[] /* [NUM_RENDER_FX_TYPES] */ =
    createArrayFrom(Enum306.NUM_RENDER_FX_TYPES, createRenderFXType);
  function RenderTiles(
    uiFlags: UINT32,
    iStartPointX_M: INT32,
    iStartPointY_M: INT32,
    iStartPointX_S: INT32,
    iStartPointY_S: INT32,
    iEndXS: INT32,
    iEndYS: INT32,
    ubNumLevels: UINT8,
    puiLevels: UINT32[],
    psLevelIDs: UINT16[],
  ): void {
    //#if 0

    let pNode: LEVELNODE | null; //, *pLand, *pStruct; //*pObject, *pTopmost, *pMerc;
    let pSoldier: SOLDIERTYPE | null;
    let pSelSoldier: SOLDIERTYPE | null;
    let hVObject: SGPVObject = <SGPVObject>(<unknown>undefined);
    let pTrav: ETRLEObject;
    let TileElem: TILE_ELEMENT = <TILE_ELEMENT>(<unknown>undefined);
    let uiDestPitchBYTES: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray = <Uint8ClampedArray>(<unknown>null);
    let usAnimSurface: UINT16;
    let bXOddFlag: boolean /* INT8 */ = false;
    let iAnchorPosX_M: INT32;
    let iAnchorPosY_M: INT32;
    let iAnchorPosX_S: INT32;
    let iAnchorPosY_S: INT32;
    let iTempPosX_M: INT32;
    let iTempPosY_M: INT32;
    let iTempPosX_S: INT32;
    let iTempPosY_S: INT32;
    let dOffsetX: FLOAT;
    let dOffsetY: FLOAT;
    let dTempX_S: FLOAT;
    let dTempY_S: FLOAT;
    let uiTileIndex: UINT32;
    let usImageIndex: UINT16;
    let pShadeTable: Uint16Array;
    let uiBrushWidth: UINT32;
    let uiBrushHeight: UINT32;
    let uiDirtyFlags: UINT32;
    let sTileHeight: INT16;
    let sXPos: INT16;
    let sYPos: INT16;
    let sZLevel: INT16;
    let sMouseX_M: INT16;
    let sMouseY_M: INT16;
    let fShadowBlitter: boolean = false;
    let fZBlitter: boolean = false;
    let fZWrite: boolean = false;
    let fLinkedListDirection: boolean = true;
    let fRenderTile: boolean = true;
    let fMerc: boolean = false;
    let fCheckForRedundency: boolean = false;
    let uiRowFlags: UINT32;
    let fDynamic: boolean = true;
    let fEndRenderRow: boolean = false;
    let fEndRenderCol: boolean = false;
    let fPixelate: boolean = false;
    let fMultiZBlitter: boolean = false;
    let fWallTile: boolean = false;
    let fMultiTransShadowZBlitter: boolean = false;
    let sMultiTransShadowZBlitterIndex: INT16 = -1;
    let fTranslucencyType: boolean = false;
    let sX: INT16;
    let sY: INT16;
    let fTileInvisible: boolean = false;
    let fConvertTo16: boolean = false;
    let fBlit16: boolean = false;
    let cnt: UINT32;
    let bItemOutline: boolean;
    let usOutlineColor: UINT16 = 0;

    let uiMapPosIndex: UINT32;
    let bBlitClipVal: UINT8;
    let bItemCount: INT8;
    let bVisibleItemCount: INT8;
    // UINT16			us16BPPIndex;
    let RenderingFX: RenderFXType;
    let fCheckForMouseDetections: boolean = false;
    let fSaveZ: boolean;
    let sWorldY: INT16;
    let sZOffsetX: INT16 = -1;
    let sZOffsetY: INT16 = -1;
    let fIntensityBlitter: boolean;
    let gsForceSoldierZLevel: INT16;
    let pCorpse: ROTTING_CORPSE = <ROTTING_CORPSE>(<unknown>null);
    let fUseTileElem: boolean;
    let uiLevelNodeFlags: UINT32;
    let uiTileElemFlags: UINT32 = 0;
    let bGlowShadeOffset: INT8;
    let fObscured: boolean;
    let fObscuredBlitter: boolean;
    let sModifiedTileHeight: INT16;
    let fDoRow: boolean;
    let pShades: Uint16Array[];
    let pShadeStart: number;

    let uiSaveBufferPitchBYTES: UINT32 = 0;
    let pSaveBuf: Uint8ClampedArray;
    let pItemPool: ITEM_POOL = <ITEM_POOL>(<unknown>null);
    let fHiddenTile: boolean = false;
    let uiAniTileFlags: UINT32 = 0;

    // Init some variables
    usImageIndex = 0;
    sZLevel = 0;
    uiDirtyFlags = 0;
    pShadeTable = <Uint16Array>(<unknown>null);

    // Begin Render Loop
    iAnchorPosX_M = iStartPointX_M;
    iAnchorPosY_M = iStartPointY_M;
    iAnchorPosX_S = iStartPointX_S;
    iAnchorPosY_S = iStartPointY_S;

    if (!(uiFlags & TILES_DIRTY))
      pDestBuf = LockVideoSurface(
        FRAME_BUFFER,
        createPointer(
          () => uiDestPitchBYTES,
          (v) => (uiDestPitchBYTES = v),
        ),
      );

    if (uiFlags & TILES_DYNAMIC_CHECKFOR_INT_TILE) {
      if (ShouldCheckForMouseDetections()) {
        BeginCurInteractiveTileCheck(gubIntTileCheckFlags);
        fCheckForMouseDetections = true;

        // If we are in edit mode, don't do this...
        if (gfEditMode) {
          fCheckForMouseDetections = false;
        }
      }
    }

    // if((uiFlags&TILES_TYPE_MASK)==TILES_STATIC_LAND)

    if (gTacticalStatus.uiFlags & TRANSLUCENCY_TYPE) fTranslucencyType = true;

    for (cnt = 0; cnt < ubNumLevels; cnt++) {
      RenderTiles__ubLevelNodeStartIndex[cnt] =
        RenderFXStartIndex[psLevelIDs[cnt]];
      RenderTiles__RenderFXList[cnt] = RenderFX[psLevelIDs[cnt]];
    }

    do {
      iTempPosX_M = iAnchorPosX_M;
      iTempPosY_M = iAnchorPosY_M;
      iTempPosX_S = iAnchorPosX_S;
      iTempPosY_S = iAnchorPosY_S;

      uiMapPosIndex = 0;

      // Build tile index list
      do {
        RenderTiles__iTileMapPos[uiMapPosIndex] = FASTMAPROWCOLTOPOS(
          iTempPosY_M,
          iTempPosX_M,
        );

        iTempPosX_S += 40;
        iTempPosX_M++;
        iTempPosY_M--;

        uiMapPosIndex++;
      } while (iTempPosX_S < iEndXS);

      for (cnt = 0; cnt < ubNumLevels; cnt++) {
        uiRowFlags = puiLevels[cnt];
        fDoRow = true;

        if (
          uiRowFlags & TILES_ALL_DYNAMICS &&
          !(uiLayerUsedFlags & uiRowFlags) &&
          !(uiFlags & TILES_DYNAMIC_CHECKFOR_INT_TILE)
        ) {
          fDoRow = false;
        }

        if (fDoRow) {
          iTempPosX_M = iAnchorPosX_M;
          iTempPosY_M = iAnchorPosY_M;
          iTempPosX_S = iAnchorPosX_S;
          iTempPosY_S = iAnchorPosY_S;

          fEndRenderRow = false;
          uiMapPosIndex = 0;

          if (bXOddFlag) iTempPosX_S += 20;

          do {
            uiTileIndex = RenderTiles__iTileMapPos[uiMapPosIndex] >>> 0;
            uiMapPosIndex++;

            // if ( 0 )
            if (uiTileIndex < GRIDSIZE) {
              // OK, we're sreaching through this loop anyway, might as well check for mouse position
              // over objects...
              // Experimental!
              if (uiFlags & TILES_DYNAMIC_CHECKFOR_INT_TILE) {
                if (
                  fCheckForMouseDetections &&
                  gpWorldLevelData[uiTileIndex].pStructHead != null
                ) {
                  LogMouseOverInteractiveTile(uiTileIndex);
                }
              }

              if (
                uiFlags & TILES_MARKED &&
                !(gpWorldLevelData[uiTileIndex].uiFlags & MAPELEMENT_REDRAW)
              ) {
                pNode = null;
              } else {
                // pNode = gpWorldLevelData[ uiTileIndex ].pLevelNodes[ RenderFXStartIndex[ psLevelIDs[ cnt ] ] ];
                // pNode = gpWorldLevelData[ uiTileIndex ].pLevelNodes[ 0 ];
                // pNode=NULL;
                pNode =
                  gpWorldLevelData[uiTileIndex].pLevelNodes[
                    RenderTiles__ubLevelNodeStartIndex[cnt]
                  ];
              }

              bItemCount = 0;
              bVisibleItemCount = 0;
              pItemPool = <ITEM_POOL>(<unknown>null);

              while (pNode != null) {
                RenderingFX = RenderTiles__RenderFXList[cnt];

                fObscured = RenderingFX.fObscured;
                fDynamic = RenderingFX.fDynamic;

                fMerc = RenderingFX.fMerc;
                fZWrite = RenderingFX.fZWrite;
                fZBlitter = RenderingFX.fZBlitter;
                fShadowBlitter = RenderingFX.fShadowBlitter;
                fLinkedListDirection = RenderingFX.fLinkedListDirection;
                fCheckForRedundency = RenderingFX.fCheckForRedundency;
                fMultiZBlitter = RenderingFX.fMultiZBlitter;
                fConvertTo16 = RenderingFX.fConvertTo16;
                fIntensityBlitter = false;
                fSaveZ = false;
                fWallTile = false;
                gsForceSoldierZLevel = 0;
                pSoldier = null;
                fUseTileElem = false;
                fMultiTransShadowZBlitter = false;
                fObscuredBlitter = false;
                fTranslucencyType = true;
                uiAniTileFlags = 0;

                uiLevelNodeFlags = pNode.uiFlags;

                if (fCheckForRedundency) {
                  if (
                    gpWorldLevelData[uiTileIndex].uiFlags & MAPELEMENT_REDUNDENT
                  ) {
                    // IF WE DONOT WANT TO RE-EVALUATE FIRST
                    if (
                      !(
                        gpWorldLevelData[uiTileIndex].uiFlags &
                        MAPELEMENT_REEVALUATE_REDUNDENCY
                      ) &&
                      !(gTacticalStatus.uiFlags & NOHIDE_REDUNDENCY)
                    ) {
                      pNode = null;
                      break;
                    }
                  }
                }

                // Force z-buffer blitting for marked tiles ( even ground!)
                if (uiFlags & TILES_MARKED) {
                  fZBlitter = true;
                }

                // Looking up height every time here is alot better than doing it above!
                sTileHeight = gpWorldLevelData[uiTileIndex].sHeight;

                sModifiedTileHeight = (Math.trunc(sTileHeight / 80) - 1) * 80;

                if (sModifiedTileHeight < 0) {
                  sModifiedTileHeight = 0;
                }

                fRenderTile = true;
                if (uiLevelNodeFlags & LEVELNODE_REVEAL) {
                  if (!fDynamic) fRenderTile = false;
                  else fPixelate = true;
                } else fPixelate = false;

                // non-type specific setup
                sXPos = iTempPosX_S;
                sYPos = iTempPosY_S;

                // setup for any tile type except mercs
                if (!fMerc) {
                  if (
                    !(
                      uiLevelNodeFlags &
                      (LEVELNODE_ROTTINGCORPSE | LEVELNODE_CACHEDANITILE)
                    )
                  ) {
                    if (uiLevelNodeFlags & LEVELNODE_REVEALTREES) {
                      TileElem = gTileDatabase[pNode.usIndex + 2];
                    } else {
                      TileElem = gTileDatabase[pNode.usIndex];
                    }

                    // HANDLE INDEPENDANT-PER-TILE ANIMATIONS ( IE: DOORS, EXPLODING THINGS, ETC )
                    if (fDynamic) {
                      if (uiLevelNodeFlags & LEVELNODE_ANIMATION) {
                        if (pNode.sCurrentFrame != -1) {
                          Assert(TileElem.pAnimData != null);
                          TileElem =
                            gTileDatabase[
                              TileElem.pAnimData.pusFrames[pNode.sCurrentFrame]
                            ];
                        }
                      }
                    }
                  }

                  // Check for best translucency
                  if (uiLevelNodeFlags & LEVELNODE_USEBESTTRANSTYPE) {
                    fTranslucencyType = false;
                  }

                  if (
                    uiLevelNodeFlags &
                    (LEVELNODE_ROTTINGCORPSE | LEVELNODE_CACHEDANITILE)
                  ) {
                    if (fDynamic) {
                      if (
                        !(uiLevelNodeFlags & LEVELNODE_DYNAMIC) &&
                        !(uiLevelNodeFlags & LEVELNODE_LASTDYNAMIC)
                      )
                        fRenderTile = false;
                    } else if (uiLevelNodeFlags & LEVELNODE_DYNAMIC)
                      fRenderTile = false;
                  } else {
                    // Set Tile elem flags here!
                    uiTileElemFlags = TileElem.uiFlags;
                    // Set valid tile elem!
                    fUseTileElem = true;

                    if (fDynamic || fPixelate) {
                      if (!fPixelate) {
                        if (
                          !(uiTileElemFlags & ANIMATED_TILE) &&
                          !(uiTileElemFlags & DYNAMIC_TILE) &&
                          !(uiLevelNodeFlags & LEVELNODE_DYNAMIC) &&
                          !(uiLevelNodeFlags & LEVELNODE_LASTDYNAMIC)
                        )
                          fRenderTile = false;
                        else if (
                          !(uiTileElemFlags & DYNAMIC_TILE) &&
                          !(uiLevelNodeFlags & LEVELNODE_DYNAMIC) &&
                          !(uiLevelNodeFlags & LEVELNODE_LASTDYNAMIC)
                        ) {
                          //	else if((TileElem->uiFlags&ANIMATED_TILE) )
                          Assert(TileElem.pAnimData != null);
                          TileElem =
                            gTileDatabase[
                              TileElem.pAnimData.pusFrames[
                                TileElem.pAnimData.bCurrentFrame
                              ]
                            ];
                          uiTileElemFlags = TileElem.uiFlags;
                        }
                      }
                    } else if (
                      uiTileElemFlags & ANIMATED_TILE ||
                      uiTileElemFlags & DYNAMIC_TILE ||
                      uiLevelNodeFlags & LEVELNODE_DYNAMIC
                    ) {
                      if (
                        !(uiFlags & TILES_OBSCURED) ||
                        uiTileElemFlags & ANIMATED_TILE
                      ) {
                        fRenderTile = false;
                      }
                    }
                  }

                  // OK, ATE, CHECK FOR AN OBSCURED TILE AND MAKE SURE IF LEVELNODE IS SET
                  // WE DON'T RENDER UNLESS WE HAVE THE RENDER FLAG SET!
                  if (fObscured) {
                    if (uiFlags & TILES_OBSCURED) {
                      if (uiLevelNodeFlags & LEVELNODE_SHOW_THROUGH) {
                        fObscuredBlitter = true;

                        // ATE: Check if this is a levelnode, and what frame we are on
                        // turn off......
                        // if ( ( uiLevelNodeFlags & LEVELNODE_ITEM ) && gsCurrentItemGlowFrame < 25 )
                        //{
                        //	fRenderTile = FALSE;
                        //}
                      } else {
                        // Don;t render if we are not on this render loop!
                        fRenderTile = false;
                      }
                    } else {
                      if (uiLevelNodeFlags & LEVELNODE_SHOW_THROUGH) {
                        fRenderTile = false;

                        // ATE: Check if this is a levelnode, and what frame we are on
                        // turn off......
                        // if ( ( uiLevelNodeFlags & LEVELNODE_ITEM ) && gsCurrentItemGlowFrame < 25 )
                        //{
                        //	fRenderTile = TRUE;
                        //}
                      }
                    }
                  }

                  // If flag says to do dynamic as well, render!
                  if (uiFlags & TILES_DOALL) {
                    fRenderTile = true;
                  }

                  // If we are on the struct layer, check for if it's hidden!
                  if (
                    uiRowFlags &
                    (TILES_STATIC_STRUCTURES |
                      TILES_DYNAMIC_STRUCTURES |
                      TILES_STATIC_SHADOWS |
                      TILES_DYNAMIC_SHADOWS)
                  ) {
                    if (fUseTileElem) {
                    }
                  }

                  if (fRenderTile) {
                    // Set flag to set layer as used
                    if (fDynamic || fPixelate) {
                      uiAdditiveLayerUsedFlags |= uiRowFlags;
                    }

                    if (uiLevelNodeFlags & LEVELNODE_DYNAMICZ) {
                      fSaveZ = true;
                      fZWrite = true;
                    }

                    if (uiLevelNodeFlags & LEVELNODE_CACHEDANITILE) {
                      hVObject = (<TILE_IMAGERY>(
                        gpTileCache[pNode.pAniTile.sCachedTileID].pImagery
                      )).vo;
                      usImageIndex = pNode.pAniTile.sCurrentFrame;
                      uiAniTileFlags = pNode.pAniTile.uiFlags;

                      // Position corpse based on it's float position
                      if (uiLevelNodeFlags & LEVELNODE_ROTTINGCORPSE) {
                        pCorpse = gRottingCorpse[pNode.pAniTile.uiUserData];

                        pShadeTable = pCorpse.pShades[pNode.ubShadeLevel];

                        // pShadeTable = pCorpse->p16BPPPalette;

                        dOffsetX = pCorpse.def.dXPos - gsRenderCenterX;
                        dOffsetY = pCorpse.def.dYPos - gsRenderCenterY;

                        // OK, if this is a corpse.... stop if not visible
                        if (
                          pCorpse.def.bVisible != 1 &&
                          !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)
                        ) {
                          // CONTINUE, DONOT RENDER
                          if (!fLinkedListDirection) pNode = pNode.pPrevNode;
                          else pNode = pNode.pNext;

                          continue;
                        }
                      } else {
                        dOffsetX = pNode.pAniTile.sRelativeX - gsRenderCenterX;
                        dOffsetY = pNode.pAniTile.sRelativeY - gsRenderCenterY;
                      }

                      // Calculate guy's position
                      ({ dScreenX: dTempX_S, dScreenY: dTempY_S } =
                        FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

                      sXPos =
                        Math.trunc(
                          (gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2,
                        ) + Math.trunc(dTempX_S);
                      sYPos =
                        Math.trunc(
                          (gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2,
                        ) +
                        Math.trunc(dTempY_S) -
                        sTileHeight;

                      // Adjust for offset position on screen
                      sXPos -= gsRenderWorldOffsetX;
                      sYPos -= gsRenderWorldOffsetY;
                    } else {
                      hVObject = TileElem.hTileSurface;
                      usImageIndex = TileElem.usRegionIndex;

                      // ADJUST FOR WORLD MAPELEM HIEGHT
                      sYPos -= TileElem.sOffsetHeight;

                      if (TileElem.uiFlags & IGNORE_WORLD_HEIGHT) {
                        sYPos = sYPos - sModifiedTileHeight;
                        // sYPos -= sTileHeight;
                      }

                      if (
                        !(uiLevelNodeFlags & LEVELNODE_IGNOREHEIGHT) &&
                        !(TileElem.uiFlags & IGNORE_WORLD_HEIGHT)
                      )
                        sYPos -= sTileHeight;

                      if (!(uiFlags & TILES_DIRTY)) {
                        hVObject.pShadeCurrent =
                          hVObject.pShades[pNode.ubShadeLevel];
                        hVObject.pShade8 = ubColorTables[pNode.ubShadeLevel];
                      }
                    }

                    // ADJUST FOR RELATIVE OFFSETS
                    if (uiLevelNodeFlags & LEVELNODE_USERELPOS) {
                      sXPos += pNode.sRelativeX;
                      sYPos += pNode.sRelativeY;
                    }

                    if (uiLevelNodeFlags & LEVELNODE_USEZ) {
                      sYPos -= pNode.sRelativeZ;
                    }

                    // ADJUST FOR ABSOLUTE POSITIONING
                    if (uiLevelNodeFlags & LEVELNODE_USEABSOLUTEPOS) {
                      dOffsetX = pNode.sRelativeX - gsRenderCenterX;
                      dOffsetY = pNode.sRelativeY - gsRenderCenterY;

                      // OK, DONT'T ASK... CONVERSION TO PROPER Y NEEDS THIS...
                      dOffsetX -= CELL_Y_SIZE;

                      ({ dScreenX: dTempX_S, dScreenY: dTempY_S } =
                        FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

                      sXPos =
                        Math.trunc(
                          (gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2,
                        ) + Math.trunc(SHORT_ROUND(dTempX_S));
                      sYPos =
                        Math.trunc(
                          (gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2,
                        ) + Math.trunc(SHORT_ROUND(dTempY_S));

                      // Adjust for offset position on screen
                      sXPos -= gsRenderWorldOffsetX;
                      sYPos -= gsRenderWorldOffsetY;

                      sYPos -= pNode.sRelativeZ;
                    }
                  }

                  // COUNT # OF ITEMS AT THIS LOCATION
                  if (uiLevelNodeFlags & LEVELNODE_ITEM) {
                    // OK set item pool for this location....
                    if (bItemCount == 0) {
                      pItemPool = pNode.pItemPool;
                    } else {
                      pItemPool = <ITEM_POOL>pItemPool.pNext;
                    }

                    if (bItemCount < MAX_RENDERED_ITEMS) {
                      bItemCount++;

                      if (
                        gWorldItems[pItemPool.iItemIndex].bVisible == VISIBLE
                      ) {
                        bVisibleItemCount++;
                      }
                    }

                    // LIMIT RENDERING OF ITEMS TO ABOUT 7, DO NOT RENDER HIDDEN ITEMS TOO!
                    if (
                      bVisibleItemCount == MAX_RENDERED_ITEMS ||
                      gWorldItems[pItemPool.iItemIndex].bVisible != VISIBLE ||
                      pItemPool.usFlags & WORLD_ITEM_DONTRENDER
                    ) {
                      if (!(gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)) {
                        // CONTINUE, DONOT RENDER
                        if (!fLinkedListDirection) pNode = pNode.pPrevNode;
                        else pNode = pNode.pNext;
                        continue;
                      }
                    }

                    if (pItemPool.bRenderZHeightAboveLevel > 0) {
                      sYPos -= pItemPool.bRenderZHeightAboveLevel;
                    }
                  }

                  // If render tile is false...
                  if (!fRenderTile) {
                    if (!fLinkedListDirection) pNode = pNode.pPrevNode;
                    else pNode = pNode.pNext;

                    continue;
                  }
                }

                // specific code for node types on a per-tile basis
                switch (uiRowFlags) {
                  case TILES_STATIC_LAND:
                    sZLevel = LandZLevel(iTempPosX_M, iTempPosY_M);
                    break;

                  case TILES_STATIC_OBJECTS:
                    // ATE: Modified to use constant z level, as these are same level as land items
                    sZLevel = ObjectZLevel(
                      TileElem,
                      uiTileElemFlags,
                      iTempPosX_M,
                      iTempPosY_M,
                    );
                    break;

                  case TILES_STATIC_STRUCTURES:
                    sZLevel = StructZLevel(
                      uiLevelNodeFlags,
                      pCorpse,
                      pNode,
                      uiAniTileFlags,
                      iTempPosX_M,
                      iTempPosY_M,
                    );

                    if (fUseTileElem && TileElem.uiFlags & MULTI_Z_TILE) {
                      fMultiZBlitter = true;
                    }

                    // ATE: if we are a wall, set flag
                    if (fUseTileElem && TileElem.uiFlags & WALL_TILE) {
                      fWallTile = true;
                    }

                    break;

                  case TILES_STATIC_ROOF:
                    sZLevel = RoofZLevel(iTempPosX_M, iTempPosY_M);

                    // Automatically adjust height!
                    sYPos -= WALL_HEIGHT;

                    // ATE: Added for shadows on roofs
                    if (fUseTileElem && TileElem.uiFlags & ROOFSHADOW_TILE) {
                      fShadowBlitter = true;
                    }
                    break;
                  case TILES_STATIC_ONROOF:
                    sZLevel = OnRoofZLevel(
                      uiLevelNodeFlags,
                      iTempPosX_M,
                      iTempPosY_M,
                    );
                    // Automatically adjust height!
                    sYPos -= WALL_HEIGHT;
                    break;

                  case TILES_STATIC_TOPMOST:
                    sZLevel = TopmostZLevel(iTempPosX_M, iTempPosY_M);
                    break;

                  case TILES_STATIC_SHADOWS:
                    sZLevel = ShadowZLevel(iTempPosX_M, iTempPosY_M);

                    if (uiLevelNodeFlags & LEVELNODE_EXITGRID) {
                      fIntensityBlitter = true;
                      fShadowBlitter = false;
                    }
                    break;

                  case TILES_DYNAMIC_LAND:
                    sZLevel = LandZLevel(iTempPosX_M, iTempPosY_M);
                    uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                    break;
                  case TILES_DYNAMIC_SHADOWS:
                    sZLevel = ShadowZLevel(iTempPosX_M, iTempPosY_M);
                    // sZLevel=SHADOW_Z_LEVEL;
                    uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                    break;
                  case TILES_DYNAMIC_OBJECTS:
                    sZLevel = ObjectZLevel(
                      TileElem,
                      uiTileElemFlags,
                      iTempPosX_M,
                      iTempPosY_M,
                    );
                    uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                    break;

                  case TILES_DYNAMIC_STRUCTURES:
                    sZLevel = StructZLevel(
                      uiLevelNodeFlags,
                      pCorpse,
                      pNode,
                      uiAniTileFlags,
                      iTempPosX_M,
                      iTempPosY_M,
                    );
                    uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                    break;
                  case TILES_DYNAMIC_ROOF:
                    sYPos -= WALL_HEIGHT;

                    sZLevel = RoofZLevel(iTempPosX_M, iTempPosY_M);
                    uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                    // For now, adjust to hieght of a wall ( 50 temp, make define )
                    // if ( TileElem->fType > FOOTPRINTS )
                    //{
                    //	sYPos -= 58;
                    //}
                    break;

                  case TILES_DYNAMIC_ONROOF:
                    sZLevel = OnRoofZLevel(
                      uiLevelNodeFlags,
                      iTempPosX_M,
                      iTempPosY_M,
                    );
                    uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                    // Automatically adjust height!
                    sYPos -= WALL_HEIGHT;
                    break;

                  case TILES_DYNAMIC_TOPMOST:
                    sZLevel = TopmostZLevel(iTempPosX_M, iTempPosY_M);
                    uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                    break;

                  case TILES_DYNAMIC_MERCS:
                  case TILES_DYNAMIC_HIGHMERCS:
                  case TILES_DYNAMIC_STRUCT_MERCS:
                    // Set flag to set layer as used
                    uiAdditiveLayerUsedFlags |= uiRowFlags;

                    pSoldier = pNode.pSoldier;

                    if (uiRowFlags == TILES_DYNAMIC_MERCS) {
                      // If we are multi-tiled, ignore here
                      if (pSoldier.uiStatusFlags & SOLDIER_MULTITILE_Z) {
                        pNode = pNode.pNext;
                        continue;
                      }

                      // If we are at a higher level, no not do anything unless we are at the highmerc stage
                      if (pSoldier.bLevel > 0) {
                        pNode = pNode.pNext;
                        continue;
                      }
                    }

                    if (uiRowFlags == TILES_DYNAMIC_HIGHMERCS) {
                      // If we are multi-tiled, ignore here
                      if (pSoldier.uiStatusFlags & SOLDIER_MULTITILE_Z) {
                        pNode = pNode.pNext;
                        continue;
                      }

                      // If we are at a lower level, no not do anything unless we are at the highmerc stage
                      if (pSoldier.bLevel == 0) {
                        pNode = pNode.pNext;
                        continue;
                      }
                    }

                    if (uiRowFlags == TILES_DYNAMIC_STRUCT_MERCS) {
                      // If we are not multi-tiled, ignore here
                      if (!(pSoldier.uiStatusFlags & SOLDIER_MULTITILE_Z)) {
                        // If we are at a low level, no not do anything unless we are at the merc stage
                        if (pSoldier.bLevel == 0) {
                          pNode = pNode.pNext;
                          continue;
                        }
                      }

                      if (pSoldier.uiStatusFlags & SOLDIER_MULTITILE_Z) {
                        fSaveZ = true;
                        fMultiTransShadowZBlitter = true;
                        fZBlitter = true;

                        // ATE: Use one direction for queen!
                        if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
                          sMultiTransShadowZBlitterIndex = 0;
                        } else {
                          sMultiTransShadowZBlitterIndex =
                            gOneCDirection[pSoldier.bDirection];
                        }
                      }
                    }

                    // IF we are not active, or are a placeholder for multi-tile animations do nothing
                    // if ( !pSoldier->bActive  )
                    if (
                      !pSoldier.bActive ||
                      uiLevelNodeFlags & LEVELNODE_MERCPLACEHOLDER
                    ) {
                      pNode = pNode.pNext;
                      continue;
                    }

                    // Skip if we cannot see the guy!
                    if (
                      pSoldier.bLastRenderVisibleValue == -1 &&
                      !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)
                    ) {
                      pNode = pNode.pNext;
                      continue;
                    }

                    // Get animation surface....
                    usAnimSurface = GetSoldierAnimationSurface(
                      pSoldier,
                      pSoldier.usAnimState,
                    );

                    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
                      pNode = pNode.pNext;
                      continue;
                    }

                    // Shade guy always lighter than sceane default!
                    {
                      let ubShadeLevel: UINT8;

                      ubShadeLevel = pNode.ubShadeLevel & 0x0f;
                      ubShadeLevel = Math.max(
                        ubShadeLevel - 2,
                        DEFAULT_SHADE_LEVEL,
                      );
                      ubShadeLevel |= pNode.ubShadeLevel & 0x30;

                      if (pSoldier.fBeginFade) {
                        pShadeTable = pSoldier.pCurrentShade =
                          pSoldier.pShades[pSoldier.ubFadeLevel];
                      } else {
                        pShadeTable = pSoldier.pCurrentShade =
                          pSoldier.pShades[ubShadeLevel];
                      }
                    }

                    // Position guy based on guy's position
                    dOffsetX = pSoldier.dXPos - gsRenderCenterX;
                    dOffsetY = pSoldier.dYPos - gsRenderCenterY;

                    // Calculate guy's position
                    ({ dScreenX: dTempX_S, dScreenY: dTempY_S } =
                      FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

                    sXPos =
                      Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) +
                      Math.trunc(dTempX_S);
                    sYPos =
                      Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) +
                      Math.trunc(dTempY_S) -
                      sTileHeight;

                    // Adjust for offset position on screen
                    sXPos -= gsRenderWorldOffsetX;
                    sYPos -= gsRenderWorldOffsetY;

                    // Adjust for soldier height
                    sYPos -= pSoldier.sHeightAdjustment;

                    // Handle shade stuff....
                    if (!pSoldier.fBeginFade) {
                      // Special effect - draw ghost if is seen by a guy in player's team but not current guy
                      // ATE: Todo: setup flag for 'bad-guy' - can releive some checks in renderer
                      if (!pSoldier.bNeutral && pSoldier.bSide != gbPlayerNum) {
                        if (gusSelectedSoldier != NOBODY) {
                          pSelSoldier = MercPtrs[gusSelectedSoldier];
                        } else {
                          pSelSoldier = null;
                        }

                        bGlowShadeOffset = 0;

                        if (gTacticalStatus.ubCurrentTeam == gbPlayerNum) {
                          // Shade differently depending on visiblity
                          if (pSoldier.bLastRenderVisibleValue == 0) {
                            bGlowShadeOffset = 10;
                          }

                          if (pSelSoldier != null) {
                            if (
                              pSelSoldier.bOppList[pSoldier.ubID] !=
                              SEEN_CURRENTLY
                            ) {
                              if (
                                pSoldier.usAnimState !=
                                  Enum193.CHARIOTS_OF_FIRE &&
                                pSoldier.usAnimState != Enum193.BODYEXPLODING
                              ) {
                                bGlowShadeOffset = 10;
                              }
                            }
                          }
                        }

                        if (pSoldier.bLevel == 0) {
                          pShades = pSoldier.pGlowShades;
                          pShadeStart = 0;
                        } else {
                          pShades = pSoldier.pShades;
                          pShadeStart = 20;
                        }

                        // Set shade
                        // If a bad guy is highlighted
                        if (
                          gfUIHandleSelectionAboveGuy == true &&
                          MercPtrs[gsSelectedGuy].bSide != gbPlayerNum
                        ) {
                          if (gsSelectedGuy == pSoldier.ubID) {
                            pShadeTable =
                              pShades[
                                pShadeStart +
                                  gsGlowFrames[gsCurrentGlowFrame] +
                                  bGlowShadeOffset
                              ];
                            gsForceSoldierZLevel = TOPMOST_Z_LEVEL;
                          } else {
                            // Are we dealing with a not-so visible merc?
                            if (bGlowShadeOffset == 10) {
                              pShadeTable = pSoldier.pEffectShades[0];
                            }
                          }
                        } else {
                          // OK,not highlighted, but maybe we are in enemy's turn and they have the baton

                          // AI's turn?
                          if (gTacticalStatus.ubCurrentTeam != OUR_TEAM) {
                            // Does he have baton?
                            if (
                              pSoldier.uiStatusFlags & SOLDIER_UNDERAICONTROL
                            ) {
                              pShadeTable =
                                pShades[
                                  pShadeStart +
                                    gpGlowFramePointer[gsCurrentGlowFrame] +
                                    bGlowShadeOffset
                                ];

                              if (gpGlowFramePointer[gsCurrentGlowFrame] >= 7) {
                                gsForceSoldierZLevel = TOPMOST_Z_LEVEL;
                              }
                            }
                          } else {
                            pShadeTable =
                              pShades[
                                pShadeStart +
                                  gpGlowFramePointer[gsCurrentGlowFrame] +
                                  bGlowShadeOffset
                              ];

                            if (gpGlowFramePointer[gsCurrentGlowFrame] >= 7) {
                              gsForceSoldierZLevel = TOPMOST_Z_LEVEL;
                            }
                          }
                        }

                        // if ( gusSelectedSoldier != NOBODY )
                        //{
                        //	pSelSoldier = MercPtrs[ gusSelectedSoldier ];

                        // Shade differently depending on visiblity
                        //	if ( pSoldier->bVisible == 0 || ( pSelSoldier->bOppList[ pSoldier->ubID ] == 0  ) )
                        //	{
                        // Shade gray
                        //		pShadeTable = pSoldier->pGlowShades[ gpGlowFramePointer[ gsCurrentGlowFrame ] + 10 ];
                        //	}
                        //}
                      }
                    }

                    // Calculate Z level
                    sZLevel = SoldierZLevel(
                      pSoldier,
                      pNode,
                      iTempPosX_M,
                      iTempPosY_M,
                      gsForceSoldierZLevel,
                    );

                    if (!(uiFlags & TILES_DIRTY)) {
                      if (pSoldier.fForceShade) {
                        pShadeTable = pSoldier.pForcedShade;
                      }
                    }

                    // check if we are a merc duplicate, if so, only do minimal stuff!
                    if (pSoldier.ubID >= MAX_NUM_SOLDIERS) {
                      // Shade gray
                      pShadeTable = pSoldier.pEffectShades[1];
                    }

                    hVObject = gAnimSurfaceDatabase[usAnimSurface].hVideoObject;

                    if (hVObject == null) {
                      pNode = pNode.pNext;
                      continue;
                    }

                    // ATE: If we are in a gridno that we should not use obscure blitter, set!
                    if (
                      !(
                        gpWorldLevelData[uiTileIndex].ubExtFlags[0] &
                        MAPELEMENT_EXT_NOBURN_STRUCT
                      )
                    ) {
                      fObscuredBlitter = true;
                    } else {
                      // ATE: Artificially increase z=level...
                      sZLevel += 2;
                    }

                    usImageIndex = pSoldier.usAniFrame;

                    uiDirtyFlags =
                      BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED | BGND_FLAG_MERC;
                    break;
                }

                // Adjust for interface level
                sYPos += gsRenderHeight;

                // OK, check for LEVELNODE HIDDEN...
                fHiddenTile = false;

                if (uiLevelNodeFlags & LEVELNODE_HIDDEN) {
                  fHiddenTile = true;

                  if (TileElem != null) {
                    // If we are a roof and have SHOW_ALL_ROOFS on, turn off hidden tile check!
                    if (
                      TileElem.uiFlags & ROOF_TILE &&
                      gTacticalStatus.uiFlags & SHOW_ALL_ROOFS
                    ) {
                      // Turn off
                      fHiddenTile = false;
                    }
                  }
                }

                if (fRenderTile && !fHiddenTile) {
                  fTileInvisible = false;

                  if (uiLevelNodeFlags & LEVELNODE_ROTTINGCORPSE) {
                    // Set fmerc flag!
                    fMerc = true;
                    fZWrite = true;

                    // if ( hVObject->ppZStripInfo != NULL )
                    {
                      sMultiTransShadowZBlitterIndex = GetCorpseStructIndex(
                        pCorpse.def,
                        true,
                      );
                      fMultiTransShadowZBlitter = true;
                    }
                  }

                  if (
                    uiLevelNodeFlags & LEVELNODE_LASTDYNAMIC &&
                    !(uiFlags & TILES_DIRTY)
                  ) {
                    // Remove flags!
                    pNode.uiFlags &= ~LEVELNODE_LASTDYNAMIC;
                    fZWrite = true;
                  }

                  if (uiLevelNodeFlags & LEVELNODE_NOWRITEZ) {
                    fZWrite = false;
                  }

                  if (uiFlags & TILES_NOZWRITE) fZWrite = false;

                  if (uiFlags & TILES_NOZ) {
                    fZBlitter = false;
                  }

                  if (uiLevelNodeFlags & LEVELNODE_WIREFRAME) {
                    if (
                      !gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_WIREFRAME]
                    ) {
                      fTileInvisible = true;
                    }
                  }

                  // RENDER
                  if (fTileInvisible) {
                  } else if (
                    uiLevelNodeFlags & LEVELNODE_DISPLAY_AP &&
                    !(uiFlags & TILES_DIRTY)
                  ) {
                    pTrav = hVObject.pETRLEObject[usImageIndex];
                    sXPos += pTrav.sOffsetX;
                    sYPos += pTrav.sOffsetY;

                    if (gfUIDisplayActionPointsInvalid) {
                      SetFontBackground(FONT_MCOLOR_BLACK);
                      SetFontForeground(FONT_MCOLOR_WHITE);
                    } else {
                      SetFontBackground(FONT_MCOLOR_BLACK);
                      SetFontForeground(FONT_MCOLOR_WHITE);
                    }

                    if (gfUIDisplayActionPointsBlack) {
                      SetFontBackground(FONT_MCOLOR_BLACK);
                      SetFontForeground(FONT_MCOLOR_BLACK);
                    }

                    SetFont(TINYFONT1());
                    SetFontDestBuffer(
                      guiSAVEBUFFER,
                      0,
                      gsVIEWPORT_WINDOW_START_Y,
                      640,
                      gsVIEWPORT_WINDOW_END_Y,
                      false,
                    );
                    ({ sX, sY } = VarFindFontCenterCoordinates(
                      sXPos,
                      sYPos,
                      1,
                      1,
                      TINYFONT1(),
                      "%d",
                      pNode.uiAPCost,
                    ));
                    mprintf_buffer(
                      pDestBuf,
                      uiDestPitchBYTES,
                      TINYFONT1(),
                      sX,
                      sY,
                      "%d",
                      pNode.uiAPCost,
                    );
                    SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
                  } else if (
                    uiLevelNodeFlags & LEVELNODE_ERASEZ &&
                    !(uiFlags & TILES_DIRTY)
                  ) {
                    Zero8BPPDataTo16BPPBufferTransparent(
                      pDestBuf,
                      uiDestPitchBYTES,
                      hVObject,
                      sXPos,
                      sYPos,
                      usImageIndex,
                    );
                    // Zero8BPPDataTo16BPPBufferTransparent( (UINT16*)gpZBuffer, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex );
                  } else if (
                    uiLevelNodeFlags & LEVELNODE_ITEM &&
                    !(uiFlags & TILES_DIRTY)
                  ) {
                    let fZBlit: boolean = false;

                    if (
                      uiRowFlags == TILES_STATIC_ONROOF ||
                      uiRowFlags == TILES_DYNAMIC_ONROOF
                    ) {
                      usOutlineColor = gusYellowItemOutlineColor;
                      bItemOutline = true;
                      fZBlit = true;
                    } else {
                      usOutlineColor = gusNormalItemOutlineColor;
                      bItemOutline = true;
                      fZBlit = true;
                    }

                    if (gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS]) {
                      if (
                        uiRowFlags == TILES_STATIC_ONROOF ||
                        uiRowFlags == TILES_DYNAMIC_ONROOF
                      ) {
                        usOutlineColor =
                          us16BPPItemCycleYellowColors[gsCurrentItemGlowFrame];
                        bItemOutline = true;
                      } else {
                        if (gTacticalStatus.uiFlags & RED_ITEM_GLOW_ON) {
                          usOutlineColor =
                            us16BPPItemCycleRedColors[gsCurrentItemGlowFrame];
                          bItemOutline = true;
                        } else {
                          usOutlineColor =
                            us16BPPItemCycleWhiteColors[gsCurrentItemGlowFrame];
                          bItemOutline = true;
                        }
                      }
                    }

                    // else
                    //{
                    //	usOutlineColor = us16BPPItemCycleWhiteColors[ pItemPool->bFlashColor ];
                    //	bItemOutline = TRUE;
                    //}

                    bBlitClipVal = BltIsClippedOrOffScreen(
                      hVObject,
                      sXPos,
                      sYPos,
                      usImageIndex,
                      gClippingRect,
                    );

                    if (bBlitClipVal == 0) {
                      if (fZBlit) {
                        if (fObscuredBlitter) {
                          Blt8BPPDataTo16BPPBufferOutlineZPixelateObscured(
                            pDestBuf,
                            uiDestPitchBYTES,
                            gpZBuffer,
                            sZLevel,
                            hVObject,
                            sXPos,
                            sYPos,
                            usImageIndex,
                            usOutlineColor,
                            bItemOutline,
                          );
                        } else {
                          Blt8BPPDataTo16BPPBufferOutlineZ(
                            pDestBuf,
                            uiDestPitchBYTES,
                            gpZBuffer,
                            sZLevel,
                            hVObject,
                            sXPos,
                            sYPos,
                            usImageIndex,
                            usOutlineColor,
                            bItemOutline,
                          );
                        }
                      } else {
                        Blt8BPPDataTo16BPPBufferOutline(
                          pDestBuf,
                          uiDestPitchBYTES,
                          hVObject,
                          sXPos,
                          sYPos,
                          usImageIndex,
                          usOutlineColor,
                          bItemOutline,
                        );
                      }
                    } else if (bBlitClipVal == 1) {
                      if (fZBlit) {
                        if (fObscuredBlitter) {
                          Blt8BPPDataTo16BPPBufferOutlineZPixelateObscuredClip(
                            pDestBuf,
                            uiDestPitchBYTES,
                            gpZBuffer,
                            sZLevel,
                            hVObject,
                            sXPos,
                            sYPos,
                            usImageIndex,
                            usOutlineColor,
                            bItemOutline,
                            gClippingRect,
                          );
                        } else {
                          Blt8BPPDataTo16BPPBufferOutlineZClip(
                            pDestBuf,
                            uiDestPitchBYTES,
                            gpZBuffer,
                            sZLevel,
                            hVObject,
                            sXPos,
                            sYPos,
                            usImageIndex,
                            usOutlineColor,
                            bItemOutline,
                            gClippingRect,
                          );
                        }
                      } else {
                        Blt8BPPDataTo16BPPBufferOutlineClip(
                          pDestBuf,
                          uiDestPitchBYTES,
                          hVObject,
                          sXPos,
                          sYPos,
                          usImageIndex,
                          usOutlineColor,
                          bItemOutline,
                          gClippingRect,
                        );
                      }
                    }
                  }
                  // ATE: Check here for a lot of conditions!
                  else if (
                    uiLevelNodeFlags & LEVELNODE_PHYSICSOBJECT &&
                    !(uiFlags & TILES_DIRTY)
                  ) {
                    bItemOutline = true;

                    if (uiLevelNodeFlags & LEVELNODE_PHYSICSOBJECT) {
                      bItemOutline = false;
                    }

                    bBlitClipVal = BltIsClippedOrOffScreen(
                      hVObject,
                      sXPos,
                      sYPos,
                      usImageIndex,
                      gClippingRect,
                    );

                    if (fShadowBlitter) {
                      if (bBlitClipVal == 0) {
                        Blt8BPPDataTo16BPPBufferShadowZNB(
                          pDestBuf,
                          uiDestPitchBYTES,
                          gpZBuffer,
                          sZLevel,
                          hVObject,
                          sXPos,
                          sYPos,
                          usImageIndex,
                        );
                      } else {
                        Blt8BPPDataTo16BPPBufferShadowZNBClip(
                          pDestBuf,
                          uiDestPitchBYTES,
                          gpZBuffer,
                          sZLevel,
                          hVObject,
                          sXPos,
                          sYPos,
                          usImageIndex,
                          gClippingRect,
                        );
                      }
                    } else {
                      if (bBlitClipVal == 0) {
                        Blt8BPPDataTo16BPPBufferOutlineZNB(
                          pDestBuf,
                          uiDestPitchBYTES,
                          gpZBuffer,
                          sZLevel,
                          hVObject,
                          sXPos,
                          sYPos,
                          usImageIndex,
                          usOutlineColor,
                          bItemOutline,
                        );
                      } else if (bBlitClipVal == 1) {
                        Blt8BPPDataTo16BPPBufferOutlineClip(
                          pDestBuf,
                          uiDestPitchBYTES,
                          hVObject,
                          sXPos,
                          sYPos,
                          usImageIndex,
                          usOutlineColor,
                          bItemOutline,
                          gClippingRect,
                        );
                      }
                    }
                  } else if (uiFlags & TILES_DIRTY) {
                    if (!(uiLevelNodeFlags & LEVELNODE_LASTDYNAMIC)) {
                      pTrav = hVObject.pETRLEObject[usImageIndex];
                      uiBrushHeight = pTrav.usHeight;
                      uiBrushWidth = pTrav.usWidth;
                      sXPos += pTrav.sOffsetX;
                      sYPos += pTrav.sOffsetY;

                      RegisterBackgroundRect(
                        uiDirtyFlags,
                        null,
                        sXPos,
                        sYPos,
                        sXPos + uiBrushWidth,
                        Math.min(
                          sYPos + uiBrushHeight,
                          gsVIEWPORT_WINDOW_END_Y,
                        ),
                      );

                      if (fSaveZ) {
                        RegisterBackgroundRect(
                          uiDirtyFlags | BGND_FLAG_SAVE_Z,
                          null,
                          sXPos,
                          sYPos,
                          sXPos + uiBrushWidth,
                          Math.min(
                            sYPos + uiBrushHeight,
                            gsVIEWPORT_WINDOW_END_Y,
                          ),
                        );
                      }
                    }
                  } else {
                    if (true) {
                      if (fMultiTransShadowZBlitter) {
                        if (fZBlitter) {
                          if (fObscuredBlitter) {
                            Blt8BPPDataTo16BPPBufferTransZTransShadowIncObscureClip(
                              pDestBuf,
                              uiDestPitchBYTES,
                              gpZBuffer,
                              sZLevel,
                              hVObject,
                              sXPos,
                              sYPos,
                              usImageIndex,
                              gClippingRect,
                              sMultiTransShadowZBlitterIndex,
                              pShadeTable,
                            );
                          } else {
                            Blt8BPPDataTo16BPPBufferTransZTransShadowIncClip(
                              pDestBuf,
                              uiDestPitchBYTES,
                              gpZBuffer,
                              sZLevel,
                              hVObject,
                              sXPos,
                              sYPos,
                              usImageIndex,
                              gClippingRect,
                              sMultiTransShadowZBlitterIndex,
                              pShadeTable,
                            );
                          }
                        } else {
                          // Blt8BPPDataTo16BPPBufferTransparentClip((UINT16*)pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect );
                        }
                      } else if (fMultiZBlitter) {
                        if (fZBlitter) {
                          if (fObscuredBlitter) {
                            Blt8BPPDataTo16BPPBufferTransZIncObscureClip(
                              pDestBuf,
                              uiDestPitchBYTES,
                              gpZBuffer,
                              sZLevel,
                              hVObject,
                              sXPos,
                              sYPos,
                              usImageIndex,
                              gClippingRect,
                            );
                          } else {
                            if (fWallTile) {
                              Blt8BPPDataTo16BPPBufferTransZIncClipZSameZBurnsThrough(
                                pDestBuf,
                                uiDestPitchBYTES,
                                gpZBuffer,
                                sZLevel,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                                gClippingRect,
                              );
                            } else {
                              Blt8BPPDataTo16BPPBufferTransZIncClip(
                                pDestBuf,
                                uiDestPitchBYTES,
                                gpZBuffer,
                                sZLevel,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                                gClippingRect,
                              );
                            }
                          }
                        } else {
                          Blt8BPPDataTo16BPPBufferTransparentClip(
                            pDestBuf,
                            uiDestPitchBYTES,
                            hVObject,
                            sXPos,
                            sYPos,
                            usImageIndex,
                            gClippingRect,
                          );
                        }
                      } else {
                        bBlitClipVal = BltIsClippedOrOffScreen(
                          hVObject,
                          sXPos,
                          sYPos,
                          usImageIndex,
                          gClippingRect,
                        );

                        if (bBlitClipVal == 1) {
                          if (fPixelate) {
                            if (fTranslucencyType) {
                              // if(fZWrite)
                              //	Blt8BPPDataTo16BPPBufferTransZClipTranslucent((UINT16*)pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                              // else
                              Blt8BPPDataTo16BPPBufferTransZNBClipTranslucent(
                                pDestBuf,
                                uiDestPitchBYTES,
                                gpZBuffer,
                                sZLevel,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                                gClippingRect,
                              );
                            } else {
                              // if(fZWrite)
                              //	Blt8BPPDataTo16BPPBufferTransZClipPixelate((UINT16*)pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                              // else
                              Blt8BPPDataTo16BPPBufferTransZNBClipPixelate(
                                pDestBuf,
                                uiDestPitchBYTES,
                                gpZBuffer,
                                sZLevel,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                                gClippingRect,
                              );
                            }
                          } else if (fMerc) {
                            if (fZBlitter) {
                              if (fZWrite) {
                                Blt8BPPDataTo16BPPBufferTransShadowZClip(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                  gClippingRect,
                                  pShadeTable,
                                );
                              } else {
                                if (fObscuredBlitter) {
                                  Blt8BPPDataTo16BPPBufferTransShadowZNBObscuredClip(
                                    pDestBuf,
                                    uiDestPitchBYTES,
                                    gpZBuffer,
                                    sZLevel,
                                    hVObject,
                                    sXPos,
                                    sYPos,
                                    usImageIndex,
                                    gClippingRect,
                                    pShadeTable,
                                  );
                                } else {
                                  Blt8BPPDataTo16BPPBufferTransShadowZNBClip(
                                    pDestBuf,
                                    uiDestPitchBYTES,
                                    gpZBuffer,
                                    sZLevel,
                                    hVObject,
                                    sXPos,
                                    sYPos,
                                    usImageIndex,
                                    gClippingRect,
                                    pShadeTable,
                                  );
                                }
                              }

                              if (
                                uiLevelNodeFlags &
                                LEVELNODE_UPDATESAVEBUFFERONCE
                              ) {
                                pSaveBuf = LockVideoSurface(
                                  guiSAVEBUFFER,
                                  createPointer(
                                    () => uiSaveBufferPitchBYTES,
                                    (v) => (uiSaveBufferPitchBYTES = v),
                                  ),
                                );

                                // BLIT HERE
                                Blt8BPPDataTo16BPPBufferTransShadowClip(
                                  pSaveBuf,
                                  uiSaveBufferPitchBYTES,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                  gClippingRect,
                                  pShadeTable,
                                );

                                UnLockVideoSurface(guiSAVEBUFFER);

                                // Turn it off!
                                pNode.uiFlags &=
                                  ~LEVELNODE_UPDATESAVEBUFFERONCE;
                              }
                            } else {
                              Blt8BPPDataTo16BPPBufferTransShadowClip(
                                pDestBuf,
                                uiDestPitchBYTES,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                                gClippingRect,
                                pShadeTable,
                              );
                            }
                          } else if (fShadowBlitter) {
                            if (fZBlitter) {
                              if (fZWrite)
                                Blt8BPPDataTo16BPPBufferShadowZClip(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                  gClippingRect,
                                );
                              else
                                Blt8BPPDataTo16BPPBufferShadowZClip(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                  gClippingRect,
                                );
                            } else {
                              Blt8BPPDataTo16BPPBufferShadowClip(
                                pDestBuf,
                                uiDestPitchBYTES,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                                gClippingRect,
                              );
                            }
                          } else if (fIntensityBlitter) {
                            if (fZBlitter) {
                              if (fZWrite)
                                Blt8BPPDataTo16BPPBufferIntensityZClip(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                  gClippingRect,
                                );
                              else
                                Blt8BPPDataTo16BPPBufferIntensityZClip(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                  gClippingRect,
                                );
                            } else {
                              Blt8BPPDataTo16BPPBufferIntensityClip(
                                pDestBuf,
                                uiDestPitchBYTES,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                                gClippingRect,
                              );
                            }
                          } else if (fZBlitter) {
                            if (fZWrite) {
                              if (fObscuredBlitter) {
                                Blt8BPPDataTo16BPPBufferTransZClipPixelateObscured(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                  gClippingRect,
                                );
                              } else {
                                Blt8BPPDataTo16BPPBufferTransZClip(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                  gClippingRect,
                                );
                              }
                            } else {
                              Blt8BPPDataTo16BPPBufferTransZNBClip(
                                pDestBuf,
                                uiDestPitchBYTES,
                                gpZBuffer,
                                sZLevel,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                                gClippingRect,
                              );
                            }

                            if (
                              uiLevelNodeFlags & LEVELNODE_UPDATESAVEBUFFERONCE
                            ) {
                              pSaveBuf = LockVideoSurface(
                                guiSAVEBUFFER,
                                createPointer(
                                  () => uiSaveBufferPitchBYTES,
                                  (v) => (uiSaveBufferPitchBYTES = v),
                                ),
                              );

                              // BLIT HERE
                              Blt8BPPDataTo16BPPBufferTransZClip(
                                pSaveBuf,
                                uiSaveBufferPitchBYTES,
                                gpZBuffer,
                                sZLevel,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                                gClippingRect,
                              );

                              UnLockVideoSurface(guiSAVEBUFFER);

                              // Turn it off!
                              pNode.uiFlags &= ~LEVELNODE_UPDATESAVEBUFFERONCE;
                            }
                          } else
                            Blt8BPPDataTo16BPPBufferTransparentClip(
                              pDestBuf,
                              uiDestPitchBYTES,
                              hVObject,
                              sXPos,
                              sYPos,
                              usImageIndex,
                              gClippingRect,
                            );
                        } else if (bBlitClipVal == 0) {
                          if (fPixelate) {
                            if (fTranslucencyType) {
                              if (fZWrite)
                                Blt8BPPDataTo16BPPBufferTransZTranslucent(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                );
                              else
                                Blt8BPPDataTo16BPPBufferTransZNBTranslucent(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                );
                            } else {
                              if (fZWrite)
                                Blt8BPPDataTo16BPPBufferTransZPixelate(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                );
                              else
                                Blt8BPPDataTo16BPPBufferTransZNBPixelate(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                );
                            }
                          } else if (fMerc) {
                            if (fZBlitter) {
                              if (fZWrite) {
                                Blt8BPPDataTo16BPPBufferTransShadowZ(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                  pShadeTable,
                                );
                              } else {
                                if (fObscuredBlitter) {
                                  Blt8BPPDataTo16BPPBufferTransShadowZNBObscured(
                                    pDestBuf,
                                    uiDestPitchBYTES,
                                    gpZBuffer,
                                    sZLevel,
                                    hVObject,
                                    sXPos,
                                    sYPos,
                                    usImageIndex,
                                    pShadeTable,
                                  );
                                } else {
                                  Blt8BPPDataTo16BPPBufferTransShadowZNB(
                                    pDestBuf,
                                    uiDestPitchBYTES,
                                    gpZBuffer,
                                    sZLevel,
                                    hVObject,
                                    sXPos,
                                    sYPos,
                                    usImageIndex,
                                    pShadeTable,
                                  );
                                }
                              }

                              if (
                                uiLevelNodeFlags &
                                LEVELNODE_UPDATESAVEBUFFERONCE
                              ) {
                                pSaveBuf = LockVideoSurface(
                                  guiSAVEBUFFER,
                                  createPointer(
                                    () => uiSaveBufferPitchBYTES,
                                    (v) => (uiSaveBufferPitchBYTES = v),
                                  ),
                                );

                                // BLIT HERE
                                Blt8BPPDataTo16BPPBufferTransShadow(
                                  pSaveBuf,
                                  uiSaveBufferPitchBYTES,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                  pShadeTable,
                                );

                                UnLockVideoSurface(guiSAVEBUFFER);

                                // Turn it off!
                                pNode.uiFlags &=
                                  ~LEVELNODE_UPDATESAVEBUFFERONCE;
                              }
                            } else {
                              Blt8BPPDataTo16BPPBufferTransShadow(
                                pDestBuf,
                                uiDestPitchBYTES,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                                pShadeTable,
                              );
                            }
                          } else if (fShadowBlitter) {
                            if (fZBlitter) {
                              if (fZWrite)
                                Blt8BPPDataTo16BPPBufferShadowZ(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                );
                              else
                                Blt8BPPDataTo16BPPBufferShadowZNB(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                );
                            } else {
                              Blt8BPPDataTo16BPPBufferShadow(
                                pDestBuf,
                                uiDestPitchBYTES,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                              );
                            }
                          } else if (fIntensityBlitter) {
                            if (fZBlitter) {
                              if (fZWrite)
                                Blt8BPPDataTo16BPPBufferIntensityZ(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                );
                              else
                                Blt8BPPDataTo16BPPBufferIntensityZNB(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                );
                            } else {
                              Blt8BPPDataTo16BPPBufferIntensity(
                                pDestBuf,
                                uiDestPitchBYTES,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                              );
                            }
                          } else if (fZBlitter) {
                            if (fZWrite) {
                              // TEST
                              // Blt8BPPDataTo16BPPBufferTransZPixelate( (UINT16*)pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);

                              if (fObscuredBlitter) {
                                Blt8BPPDataTo16BPPBufferTransZPixelateObscured(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                );
                              } else {
                                Blt8BPPDataTo16BPPBufferTransZ(
                                  pDestBuf,
                                  uiDestPitchBYTES,
                                  gpZBuffer,
                                  sZLevel,
                                  hVObject,
                                  sXPos,
                                  sYPos,
                                  usImageIndex,
                                );
                              }
                            } else
                              Blt8BPPDataTo16BPPBufferTransZNB(
                                pDestBuf,
                                uiDestPitchBYTES,
                                gpZBuffer,
                                sZLevel,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                              );

                            if (
                              uiLevelNodeFlags & LEVELNODE_UPDATESAVEBUFFERONCE
                            ) {
                              pSaveBuf = LockVideoSurface(
                                guiSAVEBUFFER,
                                createPointer(
                                  () => uiSaveBufferPitchBYTES,
                                  (v) => (uiSaveBufferPitchBYTES = v),
                                ),
                              );

                              // BLIT HERE
                              Blt8BPPDataTo16BPPBufferTransZ(
                                pSaveBuf,
                                uiSaveBufferPitchBYTES,
                                gpZBuffer,
                                sZLevel,
                                hVObject,
                                sXPos,
                                sYPos,
                                usImageIndex,
                              );

                              UnLockVideoSurface(guiSAVEBUFFER);

                              // Turn it off!
                              pNode.uiFlags &= ~LEVELNODE_UPDATESAVEBUFFERONCE;
                            }
                          } else
                            Blt8BPPDataTo16BPPBufferTransparent(
                              pDestBuf,
                              uiDestPitchBYTES,
                              hVObject,
                              sXPos,
                              sYPos,
                              usImageIndex,
                            );
                        }
                      }
                    } // 8bpp section
                    else {
                      throw new Error("Should be unreachable");
                    }
                  }

                  // RENDR APS ONTOP OF PLANNED MERC GUY
                  if (fRenderTile && !(uiFlags & TILES_DIRTY)) {
                    if (fMerc) {
                      if (
                        pSoldier != null &&
                        pSoldier.ubID >= MAX_NUM_SOLDIERS
                      ) {
                        SetFont(TINYFONT1());
                        SetFontDestBuffer(
                          guiSAVEBUFFER,
                          0,
                          gsVIEWPORT_WINDOW_START_Y,
                          640,
                          gsVIEWPORT_WINDOW_END_Y,
                          false,
                        );
                        ({ sX, sY } = VarFindFontCenterCoordinates(
                          sXPos,
                          sYPos,
                          1,
                          1,
                          TINYFONT1(),
                          "%d",
                          pSoldier.ubPlannedUIAPCost,
                        ));
                        mprintf_buffer(
                          pDestBuf,
                          uiDestPitchBYTES,
                          TINYFONT1(),
                          sX,
                          sY,
                          "%d",
                          pSoldier.ubPlannedUIAPCost,
                        );
                        SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
                      }
                    }
                  }
                }

                if (!fLinkedListDirection) pNode = pNode.pPrevNode;
                else pNode = pNode.pNext;

                // pNode = NULL;
              }
            } else {
              if (gfEditMode) {
                // ATE: Used here in the editor to denote then an area is not in the world

                // Kris:  Fixed a couple things here...
                //  First, there was a problem with the FRAME_BUFFER already being locked which caused failures,
                //	and eventual crashes, so if it reaches this code, the buffer needs to be unlocked first, as
                //  it gets locked and unlocked internally within ColorFillVideoSurfaceArea().  I'm surprised
                //	this problem didn't surface a long time ago.  Anyway, it seems that scrolling to the bottom
                //	right hand corner of the map, would cause the end of the world to be drawn.  Now, this would
                //	only crash on my computer and not Emmons, so this should work.  Also, I changed the color
                //	from fluorescent green to black, which is easier on the eyes, and prevent the drawing of the
                //	end of the world if it would be drawn on the editor's taskbar.
                if (iTempPosY_S < 360) {
                  if (!(uiFlags & TILES_DIRTY))
                    UnLockVideoSurface(FRAME_BUFFER);
                  ColorFillVideoSurfaceArea(
                    FRAME_BUFFER,
                    iTempPosX_S,
                    iTempPosY_S,
                    iTempPosX_S + 40,
                    Math.min(iTempPosY_S + 20, 360),
                    Get16BPPColor(FROMRGB(0, 0, 0)),
                  );
                  if (!(uiFlags & TILES_DIRTY))
                    pDestBuf = LockVideoSurface(
                      FRAME_BUFFER,
                      createPointer(
                        () => uiDestPitchBYTES,
                        (v) => (uiDestPitchBYTES = v),
                      ),
                    );
                }
              }
            }

            iTempPosX_S += 40;
            iTempPosX_M++;
            iTempPosY_M--;

            if (iTempPosX_S >= iEndXS) {
              fEndRenderRow = true;
            }
          } while (!fEndRenderRow);
        }
      }
      //	} while( FALSE );

      if (bXOddFlag) {
        iAnchorPosY_M++;
      } else {
        iAnchorPosX_M++;
      }

      bXOddFlag = !bXOddFlag;
      iAnchorPosY_S += 10;

      if (iAnchorPosY_S >= iEndYS) {
        fEndRenderCol = true;
      }
    } while (!fEndRenderCol);

    if (!(uiFlags & TILES_DIRTY)) UnLockVideoSurface(FRAME_BUFFER);

    if (uiFlags & TILES_DYNAMIC_CHECKFOR_INT_TILE) {
      EndCurInteractiveTileCheck();
    }
  }

  function DeleteFromWorld(
    usTileIndex: UINT16,
    uiRenderTiles: UINT32,
    usIndex: UINT16,
  ): void {
    switch (uiRenderTiles) {
      case TILES_DYNAMIC_LAND:
      case TILES_STATIC_LAND:
        RemoveLand(usTileIndex, usIndex);
        break;
      case TILES_DYNAMIC_OBJECTS:
      case TILES_STATIC_OBJECTS:
        RemoveObject(usTileIndex, usIndex);
        break;
      case TILES_STATIC_STRUCTURES:
      case TILES_DYNAMIC_STRUCTURES:
        RemoveStruct(usTileIndex, usIndex);
        break;
      case TILES_DYNAMIC_ROOF:
      case TILES_STATIC_ROOF:
        RemoveRoof(usTileIndex, usIndex);
        break;
      case TILES_STATIC_ONROOF:
        RemoveOnRoof(usTileIndex, usIndex);
        break;

      case TILES_DYNAMIC_TOPMOST:
      case TILES_STATIC_TOPMOST:
        RemoveTopmost(usTileIndex, usIndex);
        break;
    }
  }

  // memcpy's the background to the new scroll position, and renders the missing strip
  // via the RenderStaticWorldRect. Dynamic stuff will be updated on the next frame
  // by the normal render cycle
  function ScrollBackground(
    uiDirection: UINT32,
    sScrollXIncrement: INT16,
    sScrollYIncrement: INT16,
  ): void {
    // RestoreBackgroundRects();

    if (!gfDoVideoScroll) {
      // Clear z-buffer
      gpZBuffer.fill(LAND_Z_LEVEL, 1280 * gsVIEWPORT_END_Y * 2);

      RenderStaticWorldRect(
        gsVIEWPORT_START_X,
        gsVIEWPORT_START_Y,
        gsVIEWPORT_END_X,
        gsVIEWPORT_END_Y,
        false,
      );

      FreeBackgroundRectType(BGND_FLAG_ANIMATED);
    } else {
      if (gfRenderScroll == false) {
        guiScrollDirection = uiDirection;
        gfScrollStart = true;
        gsScrollXIncrement = 0;
        gsScrollYIncrement = 0;
      } else {
        guiScrollDirection |= uiDirection;
        gfScrollStart = false;
      }

      gfRenderScroll = true;
      gsScrollXIncrement += sScrollXIncrement;
      gsScrollYIncrement += sScrollYIncrement;
    }
  }

  // Render routine takes center X, Y and Z coordinate and gets world
  // Coordinates for the window from that using the following functions
  // For coordinate transformations

  export function RenderWorld(): void {
    let TileElem: TILE_ELEMENT;
    let pAnimData: TILE_ANIMATION_DATA | null;
    let cnt: UINT32 = 0;

    gfRenderFullThisFrame = false;

    // If we are testing renderer, set background to pink!
    if (gTacticalStatus.uiFlags & DEBUGCLIFFS) {
      ColorFillVideoSurfaceArea(
        FRAME_BUFFER,
        0,
        gsVIEWPORT_WINDOW_START_Y,
        640,
        gsVIEWPORT_WINDOW_END_Y,
        Get16BPPColor(FROMRGB(0, 255, 0)),
      );
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    if (gTacticalStatus.uiFlags & SHOW_Z_BUFFER) {
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    //	SetRenderFlags(RENDER_FLAG_FULL);

    // FOR NOW< HERE, UPDATE ANIMATED TILES
    if (COUNTERDONE(Enum386.ANIMATETILES)) {
      RESETCOUNTER(Enum386.ANIMATETILES);

      while (cnt < gusNumAnimatedTiles) {
        TileElem = gTileDatabase[gusAnimatedTiles[cnt]];

        pAnimData = TileElem.pAnimData;

        Assert(pAnimData != null);

        pAnimData.bCurrentFrame++;

        if (pAnimData.bCurrentFrame >= pAnimData.ubNumFrames)
          pAnimData.bCurrentFrame = 0;
        cnt++;
      }
    }

    // HERE, UPDATE GLOW INDEX
    if (COUNTERDONE(Enum386.GLOW_ENEMYS)) {
      RESETCOUNTER(Enum386.GLOW_ENEMYS);

      gsCurrentGlowFrame++;

      if (gsCurrentGlowFrame == NUM_GLOW_FRAMES) {
        gsCurrentGlowFrame = 0;
      }

      gsCurrentItemGlowFrame++;

      if (gsCurrentItemGlowFrame == NUM_ITEM_CYCLE_COLORS) {
        gsCurrentItemGlowFrame = 0;
      }
    }

    // RenderStaticWorldRect( gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y );
    // AddBaseDirtyRect(gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y );
    // return;

    //#if 0

    if (gRenderFlags & RENDER_FLAG_FULL) {
      gfRenderFullThisFrame = true;

      gfTopMessageDirty = true;

      // Dirty the interface...
      fInterfacePanelDirty = DIRTYLEVEL2;

      // Apply scrolling sets some world variables
      ApplyScrolling(gsRenderCenterX, gsRenderCenterY, true, false);
      ResetLayerOptimizing();

      if (gRenderFlags & RENDER_FLAG_NOZ) {
        RenderStaticWorldRect(
          gsVIEWPORT_START_X,
          gsVIEWPORT_START_Y,
          gsVIEWPORT_END_X,
          gsVIEWPORT_END_Y,
          false,
        );
      } else {
        RenderStaticWorld();
      }

      if (!(gRenderFlags & RENDER_FLAG_SAVEOFF)) UpdateSaveBuffer();
    } else if (gRenderFlags & RENDER_FLAG_MARKED) {
      ResetLayerOptimizing();
      RenderMarkedWorld();
      if (!(gRenderFlags & RENDER_FLAG_SAVEOFF)) UpdateSaveBuffer();
    }

    if (
      gfScrollInertia == 0 ||
      gRenderFlags & RENDER_FLAG_NOZ ||
      gRenderFlags & RENDER_FLAG_FULL ||
      gRenderFlags & RENDER_FLAG_MARKED
    ) {
      RenderDynamicWorld();
    }

    if (gfScrollInertia) {
      EmptyBackgroundRects();
    }

    if (gRenderFlags & RENDER_FLAG_ROOMIDS) {
      RenderRoomInfo(
        gsStartPointX_M,
        gsStartPointY_M,
        gsStartPointX_S,
        gsStartPointY_S,
        gsEndXS,
        gsEndYS,
      );
    }

    //#endif

    // RenderStaticWorldRect( gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y );
    // AddBaseDirtyRect(gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y );

    if (gRenderFlags & RENDER_FLAG_MARKED) ClearMarkedTiles();

    if (
      gRenderFlags & RENDER_FLAG_CHECKZ &&
      !(gTacticalStatus.uiFlags & NOHIDE_REDUNDENCY)
    ) {
      ExamineZBufferRect(
        gsVIEWPORT_START_X,
        gsVIEWPORT_WINDOW_START_Y,
        gsVIEWPORT_END_X,
        gsVIEWPORT_WINDOW_END_Y,
      );
    }

    gRenderFlags &= ~(
      RENDER_FLAG_FULL |
      RENDER_FLAG_MARKED |
      RENDER_FLAG_ROOMIDS |
      RENDER_FLAG_CHECKZ
    );

    if (gTacticalStatus.uiFlags & SHOW_Z_BUFFER) {
      // COPY Z BUFFER TO FRAME BUFFER
      let uiDestPitchBYTES: UINT32 = 0;
      let pDestBuf: Uint8ClampedArray;
      let cnt: UINT32;
      let zVal: INT16;

      pDestBuf = LockVideoSurface(
        guiRENDERBUFFER,
        createPointer(
          () => uiDestPitchBYTES,
          (v) => (uiDestPitchBYTES = v),
        ),
      );

      for (cnt = 0; cnt < 640 * 480; cnt++) {
        // Get Z value
        zVal = gpZBuffer[cnt];
        pDestBuf[cnt] = zVal;
      }

      UnLockVideoSurface(guiRENDERBUFFER);
    }
  }

  // Start with a center X,Y,Z world coordinate and render direction
  // Determine WorldIntersectionPoint and the starting block from these
  // Then render away!
  export function RenderStaticWorldRect(
    sLeft: INT16,
    sTop: INT16,
    sRight: INT16,
    sBottom: INT16,
    fDynamicsToo: boolean,
  ): void {
    let uiLevelFlags: UINT32[] /* [10] */ = createArray(10, 0);
    let sLevelIDs: UINT16[] /* [10] */ = createArray(10, 0);

    // Calculate render starting parameters
    CalcRenderParameters(sLeft, sTop, sRight, sBottom);

    // Reset layer optimizations
    ResetLayerOptimizing();

    // STATICS
    uiLevelFlags[0] = TILES_STATIC_LAND;
    // uiLevelFlags[1] = TILES_STATIC_OBJECTS;
    sLevelIDs[0] = Enum306.RENDER_STATIC_LAND;
    // sLevelIDs[1]		= RENDER_STATIC_OBJECTS;
    RenderTiles(
      0,
      gsLStartPointX_M,
      gsLStartPointY_M,
      gsLStartPointX_S,
      gsLStartPointY_S,
      gsLEndXS,
      gsLEndYS,
      1,
      uiLevelFlags,
      sLevelIDs,
    );

    //#if 0

    uiLevelFlags[0] = TILES_STATIC_OBJECTS;
    sLevelIDs[0] = Enum306.RENDER_STATIC_OBJECTS;
    RenderTiles(
      0,
      gsLStartPointX_M,
      gsLStartPointY_M,
      gsLStartPointX_S,
      gsLStartPointY_S,
      gsLEndXS,
      gsLEndYS,
      1,
      uiLevelFlags,
      sLevelIDs,
    );

    if (gRenderFlags & RENDER_FLAG_SHADOWS) {
      uiLevelFlags[0] = TILES_STATIC_SHADOWS;
      sLevelIDs[0] = Enum306.RENDER_STATIC_SHADOWS;
      RenderTiles(
        0,
        gsLStartPointX_M,
        gsLStartPointY_M,
        gsLStartPointX_S,
        gsLStartPointY_S,
        gsLEndXS,
        gsLEndYS,
        1,
        uiLevelFlags,
        sLevelIDs,
      );
    }

    uiLevelFlags[0] = TILES_STATIC_STRUCTURES;
    uiLevelFlags[1] = TILES_STATIC_ROOF;
    uiLevelFlags[2] = TILES_STATIC_ONROOF;
    uiLevelFlags[3] = TILES_STATIC_TOPMOST;

    sLevelIDs[0] = Enum306.RENDER_STATIC_STRUCTS;
    sLevelIDs[1] = Enum306.RENDER_STATIC_ROOF;
    sLevelIDs[2] = Enum306.RENDER_STATIC_ONROOF;
    sLevelIDs[3] = Enum306.RENDER_STATIC_TOPMOST;

    RenderTiles(
      0,
      gsLStartPointX_M,
      gsLStartPointY_M,
      gsLStartPointX_S,
      gsLStartPointY_S,
      gsLEndXS,
      gsLEndYS,
      4,
      uiLevelFlags,
      sLevelIDs,
    );

    // ATE: Do obsucred layer!
    uiLevelFlags[0] = TILES_STATIC_STRUCTURES;
    sLevelIDs[0] = Enum306.RENDER_STATIC_STRUCTS;
    uiLevelFlags[1] = TILES_STATIC_ONROOF;
    sLevelIDs[1] = Enum306.RENDER_STATIC_ONROOF;
    RenderTiles(
      TILES_OBSCURED,
      gsLStartPointX_M,
      gsLStartPointY_M,
      gsLStartPointX_S,
      gsLStartPointY_S,
      gsLEndXS,
      gsLEndYS,
      2,
      uiLevelFlags,
      sLevelIDs,
    );

    // uiLevelFlags[0] = TILES_DYNAMIC_MERCS;
    // uiLevelFlags[1] = TILES_DYNAMIC_HIGHMERCS;

    // sLevelIDs[0]    = RENDER_DYNAMIC_MERCS;
    // sLevelIDs[1]		= RENDER_DYNAMIC_HIGHMERCS;
    // RenderTiles( 0, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 1, uiLevelFlags, sLevelIDs );

    if (fDynamicsToo) {
      // DYNAMICS
      uiLevelFlags[0] = TILES_DYNAMIC_LAND;
      uiLevelFlags[1] = TILES_DYNAMIC_OBJECTS;
      uiLevelFlags[2] = TILES_DYNAMIC_SHADOWS;
      uiLevelFlags[3] = TILES_DYNAMIC_STRUCT_MERCS;
      uiLevelFlags[4] = TILES_DYNAMIC_MERCS;
      uiLevelFlags[5] = TILES_DYNAMIC_STRUCTURES;
      uiLevelFlags[6] = TILES_DYNAMIC_ROOF;
      uiLevelFlags[7] = TILES_DYNAMIC_HIGHMERCS;
      uiLevelFlags[8] = TILES_DYNAMIC_ONROOF;

      sLevelIDs[0] = Enum306.RENDER_DYNAMIC_LAND;
      sLevelIDs[1] = Enum306.RENDER_DYNAMIC_OBJECTS;
      sLevelIDs[2] = Enum306.RENDER_DYNAMIC_SHADOWS;
      sLevelIDs[3] = Enum306.RENDER_DYNAMIC_STRUCT_MERCS;
      sLevelIDs[4] = Enum306.RENDER_DYNAMIC_MERCS;
      sLevelIDs[5] = Enum306.RENDER_DYNAMIC_STRUCTS;
      sLevelIDs[6] = Enum306.RENDER_DYNAMIC_ROOF;
      sLevelIDs[7] = Enum306.RENDER_DYNAMIC_HIGHMERCS;
      sLevelIDs[8] = Enum306.RENDER_DYNAMIC_ONROOF;
      RenderTiles(
        0,
        gsLStartPointX_M,
        gsLStartPointY_M,
        gsLStartPointX_S,
        gsLStartPointY_S,
        gsLEndXS,
        gsLEndYS,
        9,
        uiLevelFlags,
        sLevelIDs,
      );

      SumAddiviveLayerOptimization();
    }

    ResetRenderParameters();

    if (!gfDoVideoScroll) {
      // AddBaseDirtyRect(gsVIEWPORT_START_X, gsVIEWPORT_WINDOW_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y );
      AddBaseDirtyRect(sLeft, sTop, sRight, sBottom);
    }

    //#endif
  }

  function RenderStaticWorld(): void {
    let uiLevelFlags: UINT32[] /* [9] */ = createArray(9, 0);
    let sLevelIDs: UINT16[] /* [9] */ = createArray(9, 0);

    // Calculate render starting parameters
    CalcRenderParameters(
      gsVIEWPORT_START_X,
      gsVIEWPORT_START_Y,
      gsVIEWPORT_END_X,
      gsVIEWPORT_END_Y,
    );

    // Clear z-buffer
    gpZBuffer.fill(LAND_Z_LEVEL, 0, Math.trunc(1280 * gsVIEWPORT_END_Y * 2));

    FreeBackgroundRectType(BGND_FLAG_ANIMATED);
    InvalidateBackgroundRects();

    uiLevelFlags[0] = TILES_STATIC_LAND;
    // uiLevelFlags[1] = TILES_STATIC_OBJECTS;
    sLevelIDs[0] = Enum306.RENDER_STATIC_LAND;
    // sLevelIDs[1]		= RENDER_STATIC_OBJECTS;
    RenderTiles(
      0,
      gsLStartPointX_M,
      gsLStartPointY_M,
      gsLStartPointX_S,
      gsLStartPointY_S,
      gsLEndXS,
      gsLEndYS,
      1,
      uiLevelFlags,
      sLevelIDs,
    );

    uiLevelFlags[0] = TILES_STATIC_OBJECTS;
    sLevelIDs[0] = Enum306.RENDER_STATIC_OBJECTS;
    RenderTiles(
      0,
      gsLStartPointX_M,
      gsLStartPointY_M,
      gsLStartPointX_S,
      gsLStartPointY_S,
      gsLEndXS,
      gsLEndYS,
      1,
      uiLevelFlags,
      sLevelIDs,
    );

    if (gRenderFlags & RENDER_FLAG_SHADOWS) {
      uiLevelFlags[0] = TILES_STATIC_SHADOWS;
      sLevelIDs[0] = Enum306.RENDER_STATIC_SHADOWS;
      RenderTiles(
        0,
        gsLStartPointX_M,
        gsLStartPointY_M,
        gsLStartPointX_S,
        gsLStartPointY_S,
        gsLEndXS,
        gsLEndYS,
        1,
        uiLevelFlags,
        sLevelIDs,
      );
    }

    uiLevelFlags[0] = TILES_STATIC_STRUCTURES;
    uiLevelFlags[1] = TILES_STATIC_ROOF;
    uiLevelFlags[2] = TILES_STATIC_ONROOF;
    uiLevelFlags[3] = TILES_STATIC_TOPMOST;

    sLevelIDs[0] = Enum306.RENDER_STATIC_STRUCTS;
    sLevelIDs[1] = Enum306.RENDER_STATIC_ROOF;
    sLevelIDs[2] = Enum306.RENDER_STATIC_ONROOF;
    sLevelIDs[3] = Enum306.RENDER_STATIC_TOPMOST;

    RenderTiles(
      0,
      gsLStartPointX_M,
      gsLStartPointY_M,
      gsLStartPointX_S,
      gsLStartPointY_S,
      gsLEndXS,
      gsLEndYS,
      4,
      uiLevelFlags,
      sLevelIDs,
    );

    // ATE: Do obsucred layer!
    uiLevelFlags[0] = TILES_STATIC_STRUCTURES;
    sLevelIDs[0] = Enum306.RENDER_STATIC_STRUCTS;
    uiLevelFlags[1] = TILES_STATIC_ONROOF;
    sLevelIDs[1] = Enum306.RENDER_STATIC_ONROOF;
    RenderTiles(
      TILES_OBSCURED,
      gsLStartPointX_M,
      gsLStartPointY_M,
      gsLStartPointX_S,
      gsLStartPointY_S,
      gsLEndXS,
      gsLEndYS,
      2,
      uiLevelFlags,
      sLevelIDs,
    );

    AddBaseDirtyRect(
      gsVIEWPORT_START_X,
      gsVIEWPORT_WINDOW_START_Y,
      gsVIEWPORT_END_X,
      gsVIEWPORT_WINDOW_END_Y,
    );

    ResetRenderParameters();
  }

  function RenderMarkedWorld(): void {
    let uiLevelFlags: UINT32[] /* [4] */ = createArray(4, 0);
    let sLevelIDs: UINT16[] /* [4] */ = createArray(4, 0);

    CalcRenderParameters(
      gsVIEWPORT_START_X,
      gsVIEWPORT_START_Y,
      gsVIEWPORT_END_X,
      gsVIEWPORT_END_Y,
    );

    RestoreBackgroundRects();
    FreeBackgroundRectType(BGND_FLAG_ANIMATED);
    InvalidateBackgroundRects();

    ResetLayerOptimizing();

    uiLevelFlags[0] = TILES_STATIC_LAND;
    uiLevelFlags[1] = TILES_STATIC_OBJECTS;
    sLevelIDs[0] = Enum306.RENDER_STATIC_LAND;
    sLevelIDs[1] = Enum306.RENDER_STATIC_OBJECTS;
    RenderTiles(
      TILES_MARKED,
      gsStartPointX_M,
      gsStartPointY_M,
      gsStartPointX_S,
      gsStartPointY_S,
      gsEndXS,
      gsEndYS,
      2,
      uiLevelFlags,
      sLevelIDs,
    );

    if (gRenderFlags & RENDER_FLAG_SHADOWS) {
      uiLevelFlags[0] = TILES_STATIC_SHADOWS;
      sLevelIDs[0] = Enum306.RENDER_STATIC_SHADOWS;
      RenderTiles(
        TILES_MARKED,
        gsStartPointX_M,
        gsStartPointY_M,
        gsStartPointX_S,
        gsStartPointY_S,
        gsEndXS,
        gsEndYS,
        1,
        uiLevelFlags,
        sLevelIDs,
      );
    }

    uiLevelFlags[0] = TILES_STATIC_STRUCTURES;
    sLevelIDs[0] = Enum306.RENDER_STATIC_STRUCTS;
    RenderTiles(
      TILES_MARKED,
      gsStartPointX_M,
      gsStartPointY_M,
      gsStartPointX_S,
      gsStartPointY_S,
      gsEndXS,
      gsEndYS,
      1,
      uiLevelFlags,
      sLevelIDs,
    );

    uiLevelFlags[0] = TILES_STATIC_ROOF;
    sLevelIDs[0] = Enum306.RENDER_STATIC_ROOF;
    RenderTiles(
      TILES_MARKED,
      gsStartPointX_M,
      gsStartPointY_M,
      gsStartPointX_S,
      gsStartPointY_S,
      gsEndXS,
      gsEndYS,
      1,
      uiLevelFlags,
      sLevelIDs,
    );

    uiLevelFlags[0] = TILES_STATIC_ONROOF;
    sLevelIDs[0] = Enum306.RENDER_STATIC_ONROOF;
    RenderTiles(
      TILES_MARKED,
      gsStartPointX_M,
      gsStartPointY_M,
      gsStartPointX_S,
      gsStartPointY_S,
      gsEndXS,
      gsEndYS,
      1,
      uiLevelFlags,
      sLevelIDs,
    );

    uiLevelFlags[0] = TILES_STATIC_TOPMOST;
    sLevelIDs[0] = Enum306.RENDER_STATIC_TOPMOST;
    RenderTiles(
      TILES_MARKED,
      gsStartPointX_M,
      gsStartPointY_M,
      gsStartPointX_S,
      gsStartPointY_S,
      gsEndXS,
      gsEndYS,
      1,
      uiLevelFlags,
      sLevelIDs,
    );

    AddBaseDirtyRect(
      gsVIEWPORT_START_X,
      gsVIEWPORT_WINDOW_START_Y,
      gsVIEWPORT_END_X,
      gsVIEWPORT_WINDOW_END_Y,
    );

    ResetRenderParameters();
  }

  function RenderDynamicWorld(): void {
    let ubNumLevels: UINT8;
    let uiLevelFlags: UINT32[] /* [10] */ = createArray(10, 0);
    let sLevelIDs: UINT16[] /* [10] */ = createArray(10, 0);

    CalcRenderParameters(
      gsVIEWPORT_START_X,
      gsVIEWPORT_START_Y,
      gsVIEWPORT_END_X,
      gsVIEWPORT_END_Y,
    );

    RestoreBackgroundRects();

    if (!gfTagAnimatedTiles) {
      uiLevelFlags[0] = TILES_DYNAMIC_OBJECTS;
      uiLevelFlags[1] = TILES_DYNAMIC_SHADOWS;
      uiLevelFlags[2] = TILES_DYNAMIC_STRUCT_MERCS;
      uiLevelFlags[3] = TILES_DYNAMIC_MERCS;
      uiLevelFlags[4] = TILES_DYNAMIC_STRUCTURES;
      uiLevelFlags[5] = TILES_DYNAMIC_HIGHMERCS;
      uiLevelFlags[6] = TILES_DYNAMIC_ROOF;
      uiLevelFlags[7] = TILES_DYNAMIC_ONROOF;
      uiLevelFlags[8] = TILES_DYNAMIC_TOPMOST;

      sLevelIDs[0] = Enum306.RENDER_DYNAMIC_OBJECTS;
      sLevelIDs[1] = Enum306.RENDER_DYNAMIC_SHADOWS;
      sLevelIDs[2] = Enum306.RENDER_DYNAMIC_STRUCT_MERCS;
      sLevelIDs[3] = Enum306.RENDER_DYNAMIC_MERCS;
      sLevelIDs[4] = Enum306.RENDER_DYNAMIC_STRUCTS;
      sLevelIDs[5] = Enum306.RENDER_DYNAMIC_MERCS;
      sLevelIDs[6] = Enum306.RENDER_DYNAMIC_ROOF;
      sLevelIDs[7] = Enum306.RENDER_DYNAMIC_ONROOF;
      sLevelIDs[8] = Enum306.RENDER_DYNAMIC_TOPMOST;

      ubNumLevels = 9;
    } else {
      gfTagAnimatedTiles = false;
      // uiLevelFlags[0] = TILES_DYNAMIC_LAND;
      uiLevelFlags[0] = TILES_DYNAMIC_OBJECTS;
      uiLevelFlags[1] = TILES_DYNAMIC_SHADOWS;
      uiLevelFlags[2] = TILES_DYNAMIC_STRUCT_MERCS;
      uiLevelFlags[3] = TILES_DYNAMIC_MERCS;
      uiLevelFlags[4] = TILES_DYNAMIC_STRUCTURES;
      uiLevelFlags[5] = TILES_DYNAMIC_HIGHMERCS;
      uiLevelFlags[6] = TILES_DYNAMIC_ROOF;
      uiLevelFlags[7] = TILES_DYNAMIC_ONROOF;
      uiLevelFlags[8] = TILES_DYNAMIC_TOPMOST;

      // sLevelIDs[0]		= RENDER_DYNAMIC_LAND;
      sLevelIDs[0] = Enum306.RENDER_DYNAMIC_OBJECTS;
      sLevelIDs[1] = Enum306.RENDER_DYNAMIC_SHADOWS;
      sLevelIDs[2] = Enum306.RENDER_DYNAMIC_STRUCT_MERCS;
      sLevelIDs[3] = Enum306.RENDER_DYNAMIC_MERCS;
      sLevelIDs[4] = Enum306.RENDER_DYNAMIC_STRUCTS;
      sLevelIDs[5] = Enum306.RENDER_DYNAMIC_MERCS;
      sLevelIDs[6] = Enum306.RENDER_DYNAMIC_ROOF;
      sLevelIDs[7] = Enum306.RENDER_DYNAMIC_ONROOF;
      sLevelIDs[8] = Enum306.RENDER_DYNAMIC_TOPMOST;

      ubNumLevels = 9;
    }

    RenderTiles(
      TILES_DIRTY,
      gsStartPointX_M,
      gsStartPointY_M,
      gsStartPointX_S,
      gsStartPointY_S,
      gsEndXS,
      gsEndYS,
      ubNumLevels,
      uiLevelFlags,
      sLevelIDs,
    );

    if (!gfEditMode && !gfAniEditMode) {
      RenderTacticalInterface();
    }

    SaveBackgroundRects();

    // uiLevelFlags[0] = TILES_DYNAMIC_LAND;
    uiLevelFlags[0] = TILES_DYNAMIC_OBJECTS;
    uiLevelFlags[1] = TILES_DYNAMIC_SHADOWS;
    uiLevelFlags[2] = TILES_DYNAMIC_STRUCT_MERCS;
    uiLevelFlags[3] = TILES_DYNAMIC_MERCS;
    uiLevelFlags[4] = TILES_DYNAMIC_STRUCTURES;

    // sLevelIDs[0]    = RENDER_DYNAMIC_LAND;
    sLevelIDs[0] = Enum306.RENDER_DYNAMIC_OBJECTS;
    sLevelIDs[1] = Enum306.RENDER_DYNAMIC_SHADOWS;
    sLevelIDs[2] = Enum306.RENDER_DYNAMIC_STRUCT_MERCS;
    sLevelIDs[3] = Enum306.RENDER_DYNAMIC_MERCS;
    sLevelIDs[4] = Enum306.RENDER_DYNAMIC_STRUCTS;

    RenderTiles(
      0,
      gsStartPointX_M,
      gsStartPointY_M,
      gsStartPointX_S,
      gsStartPointY_S,
      gsEndXS,
      gsEndYS,
      5,
      uiLevelFlags,
      sLevelIDs,
    );

    uiLevelFlags[0] = TILES_DYNAMIC_ROOF;
    uiLevelFlags[1] = TILES_DYNAMIC_HIGHMERCS;
    uiLevelFlags[2] = TILES_DYNAMIC_ONROOF;

    sLevelIDs[0] = Enum306.RENDER_DYNAMIC_ROOF;
    sLevelIDs[1] = Enum306.RENDER_DYNAMIC_HIGHMERCS;
    sLevelIDs[2] = Enum306.RENDER_DYNAMIC_ONROOF;

    RenderTiles(
      0,
      gsStartPointX_M,
      gsStartPointY_M,
      gsStartPointX_S,
      gsStartPointY_S,
      gsEndXS,
      gsEndYS,
      3,
      uiLevelFlags,
      sLevelIDs,
    );

    uiLevelFlags[0] = TILES_DYNAMIC_TOPMOST;
    sLevelIDs[0] = Enum306.RENDER_DYNAMIC_TOPMOST;

    // ATE: check here for mouse over structs.....
    RenderTiles(
      TILES_DYNAMIC_CHECKFOR_INT_TILE,
      gsStartPointX_M,
      gsStartPointY_M,
      gsStartPointX_S,
      gsStartPointY_S,
      gsEndXS,
      gsEndYS,
      1,
      uiLevelFlags,
      sLevelIDs,
    );

    SumAddiviveLayerOptimization();

    ResetRenderParameters();
  }

  function HandleScrollDirections(
    ScrollFlags: UINT32,
    sScrollXStep: INT16,
    sScrollYStep: INT16,
    psTempRenderCenterX: Pointer<INT16>,
    psTempRenderCenterY: Pointer<INT16>,
    fCheckOnly: boolean,
  ): boolean {
    let fAGoodMove: boolean = false;
    let fMovedPos: boolean = false;
    let sTempX_W: INT16;
    let sTempY_W: INT16;
    let fUpOK: boolean;
    let fLeftOK: boolean;
    let fDownOK: boolean;
    let fRightOK: boolean;
    let sTempRenderCenterX: INT16;
    let sTempRenderCenterY: INT16;

    sTempRenderCenterX = sTempRenderCenterY = 0;

    // This checking sequence just validates the values!
    if (ScrollFlags & SCROLL_LEFT) {
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        -sScrollXStep,
        0,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;

      fMovedPos = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );
      if (fMovedPos) {
        fAGoodMove = true;
      }

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_LEFT, sScrollXStep, sScrollYStep);
      }
    }

    if (ScrollFlags & SCROLL_RIGHT) {
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        sScrollXStep,
        0,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fMovedPos = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );
      if (fMovedPos) {
        fAGoodMove = true;
      }

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_RIGHT, sScrollXStep, sScrollYStep);
      }
    }

    if (ScrollFlags & SCROLL_UP) {
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        0,
        -sScrollYStep,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fMovedPos = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );
      if (fMovedPos) {
        fAGoodMove = true;
      }

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_UP, sScrollXStep, sScrollYStep);
      }
    }

    if (ScrollFlags & SCROLL_DOWN) {
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        0,
        sScrollYStep,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fMovedPos = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );
      if (fMovedPos) {
        fAGoodMove = true;
      }

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_DOWN, sScrollXStep, sScrollYStep);
      }
    }

    if (ScrollFlags & SCROLL_UPLEFT) {
      // Check up
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        0,
        -sScrollYStep,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fUpOK = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );

      // Check left
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        -sScrollXStep,
        0,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fLeftOK = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );

      if (fLeftOK && fUpOK) {
        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          -sScrollXStep,
          -sScrollYStep,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;
        fAGoodMove = true;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_UPLEFT, sScrollXStep, sScrollYStep);
        }
      } else if (fUpOK) {
        fAGoodMove = true;

        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          0,
          -sScrollYStep,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_UP, sScrollXStep, sScrollYStep);
        }
      } else if (fLeftOK) {
        fAGoodMove = true;

        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          -sScrollXStep,
          0,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_LEFT, sScrollXStep, sScrollYStep);
        }
      }
    }

    if (ScrollFlags & SCROLL_UPRIGHT) {
      // Check up
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        0,
        -sScrollYStep,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fUpOK = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );

      // Check right
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        sScrollXStep,
        0,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fRightOK = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );

      if (fUpOK && fRightOK) {
        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          sScrollXStep,
          -sScrollYStep,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;
        fAGoodMove = true;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_UPRIGHT, sScrollXStep, sScrollYStep);
        }
      } else if (fUpOK) {
        fAGoodMove = true;

        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          0,
          -sScrollYStep,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_UP, sScrollXStep, sScrollYStep);
        }
      } else if (fRightOK) {
        fAGoodMove = true;

        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          sScrollXStep,
          0,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_RIGHT, sScrollXStep, sScrollYStep);
        }
      }
    }

    if (ScrollFlags & SCROLL_DOWNLEFT) {
      // Check down......
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        0,
        sScrollYStep,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fDownOK = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );

      // Check left.....
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        -sScrollXStep,
        0,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fLeftOK = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );

      if (fLeftOK && fDownOK) {
        fAGoodMove = true;
        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          -sScrollXStep,
          sScrollYStep,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_DOWNLEFT, sScrollXStep, sScrollYStep);
        }
      } else if (fLeftOK) {
        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          -sScrollXStep,
          0,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;
        fAGoodMove = true;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_LEFT, sScrollXStep, sScrollYStep);
        }
      } else if (fDownOK) {
        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          0,
          sScrollYStep,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;
        fAGoodMove = true;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_DOWN, sScrollXStep, sScrollYStep);
        }
      }
    }

    if (ScrollFlags & SCROLL_DOWNRIGHT) {
      // Check right
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        sScrollXStep,
        0,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fRightOK = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );

      // Check down
      ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
        0,
        sScrollYStep,
      ));
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fDownOK = ApplyScrolling(
        sTempRenderCenterX,
        sTempRenderCenterY,
        false,
        fCheckOnly,
      );

      if (fDownOK && fRightOK) {
        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          sScrollXStep,
          sScrollYStep,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;
        fAGoodMove = true;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_DOWNRIGHT, sScrollXStep, sScrollYStep);
        }
      } else if (fDownOK) {
        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          0,
          sScrollYStep,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;
        fAGoodMove = true;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_DOWN, sScrollXStep, sScrollYStep);
        }
      } else if (fRightOK) {
        ({ sCellX: sTempX_W, sCellY: sTempY_W } = FromScreenToCellCoordinates(
          sScrollXStep,
          0,
        ));
        sTempRenderCenterX = gsRenderCenterX + sTempX_W;
        sTempRenderCenterY = gsRenderCenterY + sTempY_W;
        fAGoodMove = true;

        if (!fCheckOnly) {
          ScrollBackground(SCROLL_RIGHT, sScrollXStep, sScrollYStep);
        }
      }
    }

    psTempRenderCenterX.value = sTempRenderCenterX;
    psTempRenderCenterY.value = sTempRenderCenterY;

    return fAGoodMove;
  }

  /* static */ let ScrollWorld__ubOldScrollSpeed: UINT8 = 0;
  /* static */ let ScrollWorld__fFirstTimeInSlideToMode: boolean = true;
  export function ScrollWorld(): void {
    let ScrollFlags: UINT32 = 0;
    let ScrollFlags__Pointer = createPointer(
      () => ScrollFlags,
      (v) => (ScrollFlags = v),
    );
    let fDoScroll: boolean = false;
    let fMovedPos: boolean = false;
    let fAGoodMove: boolean = false;
    let sTempRenderCenterX: INT16 = 0;
    let sTempRenderCenterX__Pointer = createPointer(
      () => sTempRenderCenterX,
      (v) => (sTempRenderCenterX = v),
    );
    let sTempRenderCenterY: INT16 = 0;
    let sTempRenderCenterY__Pointer = createPointer(
      () => sTempRenderCenterY,
      (v) => (sTempRenderCenterY = v),
    );
    let bDirection: INT8 = 0;
    let bDirection__Pointer = createPointer(
      () => bDirection,
      (v) => (bDirection = v),
    );
    let sScrollXStep: INT16 = -1;
    let sScrollYStep: INT16 = -1;
    let fIgnoreInput: boolean = false;

    if (gfIgnoreScrollDueToCenterAdjust) {
      //	gfIgnoreScrollDueToCenterAdjust = FALSE;
      return;
    }

    if (gfIgnoreScrolling == true) {
      return;
    }

    if (Number(gfIgnoreScrolling) == 2) {
      fIgnoreInput = true;
    }

    if (gCurrentUIMode == Enum206.LOCKUI_MODE) {
      fIgnoreInput = true;
    }

    // If in editor, ignore scrolling if any of the shift keys pressed with arrow keys
    if (gfEditMode && (_KeyDown(CTRL) || _KeyDown(ALT))) return;

    // Ignore if ALT DONW
    if (_KeyDown(ALT)) return;

    do {
      if (Number(gfIgnoreScrolling) != 3) {
        // Check for sliding
        if (gTacticalStatus.sSlideTarget != NOWHERE) {
          // Ignore all input...
          // Check if we have reached out dest!
          if (ScrollWorld__fFirstTimeInSlideToMode) {
            ScrollWorld__ubOldScrollSpeed = gubCurScrollSpeedID;
            ScrollWorld__fFirstTimeInSlideToMode = false;
          }

          // Make faster!
          // gubCurScrollSpeedID = 2;

          ScrollFlags = 0;
          fDoScroll = false;
          //
          if (
            SoldierLocationRelativeToScreen(
              gTacticalStatus.sSlideTarget,
              gTacticalStatus.sSlideReason,
              bDirection__Pointer,
              ScrollFlags__Pointer,
            ) &&
            GridNoOnVisibleWorldTile(gTacticalStatus.sSlideTarget)
          ) {
            ScrollFlags = gScrollDirectionFlags[bDirection];
            fDoScroll = true;
            fIgnoreInput = true;
          } else {
            // We've stopped!
            gTacticalStatus.sSlideTarget = NOWHERE;
          }
        } else {
          // Restore old scroll speed
          if (!ScrollWorld__fFirstTimeInSlideToMode) {
            gubCurScrollSpeedID = ScrollWorld__ubOldScrollSpeed;
          }
          ScrollWorld__fFirstTimeInSlideToMode = true;
        }
      }

      if (!fIgnoreInput) {
        // Check keys
        if (_KeyDown(UPARROW)) {
          fDoScroll = true;
          ScrollFlags |= SCROLL_UP;
        }

        if (_KeyDown(DNARROW)) {
          fDoScroll = true;
          ScrollFlags |= SCROLL_DOWN;
        }

        if (_KeyDown(RIGHTARROW)) {
          fDoScroll = true;
          ScrollFlags |= SCROLL_RIGHT;
        }

        if (_KeyDown(LEFTARROW)) {
          fDoScroll = true;
          ScrollFlags |= SCROLL_LEFT;
        }

        // Do mouse - PUT INTO A TIMER!
        // Put a counter on starting from mouse, if we have not started already!
        if (!gfScrollInertia && gfScrollPending == false) {
          if (!COUNTERDONE(Enum386.STARTSCROLL)) {
            break;
          }
          RESETCOUNTER(Enum386.STARTSCROLL);
        }

        if (gusMouseYPos == 0) {
          fDoScroll = true;
          ScrollFlags |= SCROLL_UP;
        }

        if (gusMouseYPos >= 479) {
          fDoScroll = true;
          ScrollFlags |= SCROLL_DOWN;
        }

        if (gusMouseXPos >= 639) {
          fDoScroll = true;
          ScrollFlags |= SCROLL_RIGHT;
        }

        if (gusMouseXPos == 0) {
          fDoScroll = true;
          ScrollFlags |= SCROLL_LEFT;
        }
      }
    } while (false);

    if (fDoScroll) {
      if (gfDoSubtileScroll) {
        if (gfScrollInertia > gubNewScrollIDSpeeds[gubCurScrollSpeedID]) {
          gubCurScrollSpeedID++;

          if (gubCurScrollSpeedID > gubScrollSpeedEndID) {
            gubCurScrollSpeedID = gubScrollSpeedEndID;
          }
        }
      }

      // if ( !gfDoVideoScroll )
      //{
      //	gubCurScrollSpeedID = 4;
      //}

      // Adjust speed based on whether shift is down
      if (_KeyDown(SHIFT)) {
        sScrollXStep = gubNewScrollXSpeeds[gfDoVideoScroll][3];
        sScrollYStep = gubNewScrollYSpeeds[gfDoVideoScroll][3];
      } else {
        sScrollXStep =
          gubNewScrollXSpeeds[gfDoVideoScroll][gubCurScrollSpeedID];
        sScrollYStep =
          gubNewScrollYSpeeds[gfDoVideoScroll][gubCurScrollSpeedID];
      }

      // Set diagonal flags!
      if (ScrollFlags & SCROLL_LEFT && ScrollFlags & SCROLL_UP) {
        ScrollFlags = SCROLL_UPLEFT;
      }
      if (ScrollFlags & SCROLL_RIGHT && ScrollFlags & SCROLL_UP) {
        ScrollFlags = SCROLL_UPRIGHT;
      }
      if (ScrollFlags & SCROLL_LEFT && ScrollFlags & SCROLL_DOWN) {
        ScrollFlags = SCROLL_DOWNLEFT;
      }
      if (ScrollFlags & SCROLL_RIGHT && ScrollFlags & SCROLL_DOWN) {
        ScrollFlags = SCROLL_DOWNRIGHT;
      }

      fAGoodMove = HandleScrollDirections(
        ScrollFlags,
        sScrollXStep,
        sScrollYStep,
        sTempRenderCenterX__Pointer,
        sTempRenderCenterY__Pointer,
        true,
      );
    }

    // Has this been an OK scroll?
    if (fAGoodMove) {
      if (COUNTERDONE(Enum386.NEXTSCROLL)) {
        RESETCOUNTER(Enum386.NEXTSCROLL);

        // Are we starting a new scroll?
        if (gfScrollInertia == 0 && gfScrollPending == false) {
          // We are starting to scroll - setup scroll pending
          gfScrollPending = true;

          // Remove any interface stuff
          ClearInterface();

          // Return so that next frame things will be erased!
          return;
        }

        // If here, set scroll pending to false
        gfScrollPending = false;

        // INcrement scroll intertia
        gfScrollInertia++;

        // Now we actually begin our scrolling
        HandleScrollDirections(
          ScrollFlags,
          sScrollXStep,
          sScrollYStep,
          sTempRenderCenterX__Pointer,
          sTempRenderCenterY__Pointer,
          false,
        );
      }
    } else {
      // ATE: Also if scroll pending never got to scroll....
      if (gfScrollPending == true) {
        // Do a complete rebuild!
        gfScrollPending = false;

        // Restore Interface!
        RestoreInterface();

        // Delete Topmost blitters saved areas
        DeleteVideoOverlaysArea();
      }

      // Check if we have just stopped scrolling!
      if (gfScrollInertia != 0) {
        SetRenderFlags(RENDER_FLAG_FULL | RENDER_FLAG_CHECKZ);

        // Restore Interface!
        RestoreInterface();

        // Delete Topmost blitters saved areas
        DeleteVideoOverlaysArea();
      }

      gfScrollInertia = 0;
      gfScrollPending = false;

      if (gfDoSubtileScroll) {
        gubCurScrollSpeedID = gubScrollSpeedStartID;
      }
    }
  }

  export function InitRenderParams(ubRestrictionID: UINT8): void {
    let gsTilesX: INT16;
    let gsTilesY: INT16;
    let cnt: UINT32;
    let cnt2: UINT32;
    let dWorldX: DOUBLE;
    let dWorldY: DOUBLE;

    switch (ubRestrictionID) {
      case 0: // Default!
        gTopLeftWorldLimitX = CELL_X_SIZE;
        gTopLeftWorldLimitY = Math.trunc(WORLD_ROWS / 2) * CELL_X_SIZE;

        gTopRightWorldLimitX = Math.trunc(WORLD_COLS / 2) * CELL_Y_SIZE;
        gTopRightWorldLimitY = CELL_X_SIZE;

        gBottomLeftWorldLimitX = Math.trunc(WORLD_COLS / 2) * CELL_Y_SIZE;
        gBottomLeftWorldLimitY = WORLD_ROWS * CELL_Y_SIZE;

        gBottomRightWorldLimitX = WORLD_COLS * CELL_Y_SIZE;
        gBottomRightWorldLimitY = Math.trunc(WORLD_ROWS / 2) * CELL_X_SIZE;
        break;

      case 1: // BAEMENT LEVEL 1
        gTopLeftWorldLimitX = Math.trunc((3 * WORLD_ROWS) / 10) * CELL_X_SIZE;
        gTopLeftWorldLimitY = Math.trunc(WORLD_ROWS / 2) * CELL_X_SIZE;

        gTopRightWorldLimitX = Math.trunc(WORLD_ROWS / 2) * CELL_X_SIZE;
        gTopRightWorldLimitY = Math.trunc((3 * WORLD_COLS) / 10) * CELL_X_SIZE;

        gBottomLeftWorldLimitX = Math.trunc(WORLD_ROWS / 2) * CELL_X_SIZE;
        gBottomLeftWorldLimitY =
          Math.trunc((7 * WORLD_COLS) / 10) * CELL_X_SIZE;

        gBottomRightWorldLimitX =
          Math.trunc((7 * WORLD_ROWS) / 10) * CELL_X_SIZE;
        gBottomRightWorldLimitY = Math.trunc(WORLD_ROWS / 2) * CELL_X_SIZE;
        break;
    }

    gCenterWorldX = Math.trunc(WORLD_ROWS / 2) * CELL_X_SIZE;
    gCenterWorldY = Math.trunc(WORLD_COLS / 2) * CELL_Y_SIZE;

    // Convert Bounding box into screen coords
    ({ sScreenX: gsTLX, sScreenY: gsTLY } = FromCellToScreenCoordinates(
      gTopLeftWorldLimitX,
      gTopLeftWorldLimitY,
    ));
    ({ sScreenX: gsTRX, sScreenY: gsTRY } = FromCellToScreenCoordinates(
      gTopRightWorldLimitX,
      gTopRightWorldLimitY,
    ));
    ({ sScreenX: gsBLX, sScreenY: gsBLY } = FromCellToScreenCoordinates(
      gBottomLeftWorldLimitX,
      gBottomLeftWorldLimitY,
    ));
    ({ sScreenX: gsBRX, sScreenY: gsBRY } = FromCellToScreenCoordinates(
      gBottomRightWorldLimitX,
      gBottomRightWorldLimitY,
    ));
    ({ sScreenX: gsCX, sScreenY: gsCY } = FromCellToScreenCoordinates(
      gCenterWorldX,
      gCenterWorldY,
    ));

    // Adjust for interface height tabbing!
    gsTLY += ROOF_LEVEL_HEIGHT;
    gsTRY += ROOF_LEVEL_HEIGHT;
    gsCY += Math.trunc(ROOF_LEVEL_HEIGHT / 2);

    // Take these spaning distances and determine # tiles spaning
    gsTilesX = Math.trunc((gsTRX - gsTLX) / WORLD_TILE_X);
    gsTilesY = Math.trunc((gsBRY - gsTRY) / WORLD_TILE_Y);

    DebugMsg(
      TOPIC_JA2,
      DBG_LEVEL_0,
      FormatString(
        "World Screen Width %d Height %d",
        gsTRX - gsTLX,
        gsBRY - gsTRY,
      ),
    );

    // Determine scale factors
    // First scale world screen coords for VIEWPORT ratio
    dWorldX = gsTRX - gsTLX;
    dWorldY = gsBRY - gsTRY;

    gdScaleX = RADAR_WINDOW_WIDTH / dWorldX;
    gdScaleY = RADAR_WINDOW_HEIGHT / dWorldY;

    for (cnt = 0, cnt2 = 0; cnt2 < NUM_ITEM_CYCLE_COLORS; cnt += 3, cnt2++) {
      us16BPPItemCycleWhiteColors[cnt2] = Get16BPPColor(
        FROMRGB(
          ubRGBItemCycleWhiteColors[cnt],
          ubRGBItemCycleWhiteColors[cnt + 1],
          ubRGBItemCycleWhiteColors[cnt + 2],
        ),
      );
      us16BPPItemCycleRedColors[cnt2] = Get16BPPColor(
        FROMRGB(
          ubRGBItemCycleRedColors[cnt],
          ubRGBItemCycleRedColors[cnt + 1],
          ubRGBItemCycleRedColors[cnt + 2],
        ),
      );
      us16BPPItemCycleYellowColors[cnt2] = Get16BPPColor(
        FROMRGB(
          ubRGBItemCycleYellowColors[cnt],
          ubRGBItemCycleYellowColors[cnt + 1],
          ubRGBItemCycleYellowColors[cnt + 2],
        ),
      );
    }

    gsLobOutline = Get16BPPColor(FROMRGB(10, 200, 10));
    gsThrowOutline = Get16BPPColor(FROMRGB(253, 212, 10));
    gsGiveOutline = Get16BPPColor(FROMRGB(253, 0, 0));

    gusNormalItemOutlineColor = Get16BPPColor(FROMRGB(255, 255, 255));
    gusYellowItemOutlineColor = Get16BPPColor(FROMRGB(255, 255, 0));

    // NOW GET DISTANCE SPANNING WORLD LIMITS IN WORLD COORDS
    // FromScreenToCellCoordinates( ( gTopRightWorldLimitX - gTopLeftWorldLimitX ), ( gTopRightWorldLimitY - gTopLeftWorldLimitY ), &gsWorldSpanX, &gsWorldSpanY );

    // CALCULATE 16BPP COLORS FOR ITEMS
  }

  // Appy? HEahehahehahehae.....
  function ApplyScrolling(
    sTempRenderCenterX: INT16,
    sTempRenderCenterY: INT16,
    fForceAdjust: boolean,
    fCheckOnly: boolean,
  ): boolean {
    let fScrollGood: boolean = false;
    let fOutLeft: boolean = false;
    let fOutRight: boolean = false;
    let fOutTop: boolean = false;
    let fOutBottom: boolean = false;

    let dOpp: DOUBLE;
    let dAdj: DOUBLE;
    let dAngle: DOUBLE;

    let sTopLeftWorldX: INT16;
    let sTopLeftWorldY: INT16;
    let sTopRightWorldX: INT16;
    let sTopRightWorldY: INT16;
    let sBottomLeftWorldX: INT16;
    let sBottomLeftWorldY: INT16;
    let sBottomRightWorldX: INT16;
    let sBottomRightWorldY: INT16;

    let sTempPosX_W: INT16;
    let sTempPosY_W: INT16;

    // For debug text for all 4 angles
    let at1: DOUBLE;
    let at2: DOUBLE;
    let at3: DOUBLE;
    let at4: DOUBLE;

    let sX_S: INT16;
    let sY_S: INT16;
    let sScreenCenterX: INT16;
    let sScreenCenterY: INT16;
    let sDistToCenterY: INT16;
    let sDistToCenterX: INT16;
    let sNewScreenX: INT16;
    let sNewScreenY: INT16;
    let sMult: INT16;

    // Makesure it's a multiple of 5
    sMult = Math.trunc(sTempRenderCenterX / CELL_X_SIZE);
    sTempRenderCenterX = sMult * CELL_X_SIZE + Math.trunc(CELL_X_SIZE / 2);

    // Makesure it's a multiple of 5
    sMult = Math.trunc(sTempRenderCenterY / CELL_X_SIZE);
    sTempRenderCenterY = sMult * CELL_Y_SIZE + Math.trunc(CELL_Y_SIZE / 2);

    // Find the diustance from render center to true world center
    sDistToCenterX = sTempRenderCenterX - gCenterWorldX;
    sDistToCenterY = sTempRenderCenterY - gCenterWorldY;

    // From render center in world coords, convert to render center in "screen" coords
    ({ sScreenX: sScreenCenterX, sScreenY: sScreenCenterY } =
      FromCellToScreenCoordinates(sDistToCenterX, sDistToCenterY));

    // Subtract screen center
    sScreenCenterX += gsCX;
    sScreenCenterY += gsCY;

    // Adjust for offset position on screen
    sScreenCenterX -= 0;
    sScreenCenterY -= 10;

    // Get corners in screen coords
    // TOP LEFT
    sX_S = Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
    sY_S = Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

    sTopLeftWorldX = sScreenCenterX - sX_S;
    sTopLeftWorldY = sScreenCenterY - sY_S;

    sTopRightWorldX = sScreenCenterX + sX_S;
    sTopRightWorldY = sScreenCenterY - sY_S;

    sBottomLeftWorldX = sScreenCenterX - sX_S;
    sBottomLeftWorldY = sScreenCenterY + sY_S;

    sBottomRightWorldX = sScreenCenterX + sX_S;
    sBottomRightWorldY = sScreenCenterY + sY_S;

    // Get angles
    // TOP LEFT CORNER FIRST
    dOpp = sTopLeftWorldY - gsTLY;
    dAdj = sTopLeftWorldX - gsTLX;

    dAngle = Math.atan2(dAdj, dOpp);
    at1 = (dAngle * 180) / Math.PI;

    if (dAngle < 0) {
      fOutLeft = true;
    } else if (dAngle > Math.PI / 2) {
      fOutTop = true;
    }

    // TOP RIGHT CORNER
    dOpp = sTopRightWorldY - gsTRY;
    dAdj = gsTRX - sTopRightWorldX;

    dAngle = Math.atan2(dAdj, dOpp);
    at2 = (dAngle * 180) / Math.PI;

    if (dAngle < 0) {
      fOutRight = true;
    } else if (dAngle > Math.PI / 2) {
      fOutTop = true;
    }

    // BOTTOM LEFT CORNER
    dOpp = gsBLY - sBottomLeftWorldY;
    dAdj = sBottomLeftWorldX - gsBLX;

    dAngle = Math.atan2(dAdj, dOpp);
    at3 = (dAngle * 180) / Math.PI;

    if (dAngle < 0) {
      fOutLeft = true;
    } else if (dAngle > Math.PI / 2) {
      fOutBottom = true;
    }

    // BOTTOM RIGHT CORNER
    dOpp = gsBRY - sBottomRightWorldY;
    dAdj = gsBRX - sBottomRightWorldX;

    dAngle = Math.atan2(dAdj, dOpp);
    at4 = (dAngle * 180) / Math.PI;

    if (dAngle < 0) {
      fOutRight = true;
    } else if (dAngle > Math.PI / 2) {
      fOutBottom = true;
    }

    gDebugStr = sprintf("Angles: %d %d %d %d", at1, at2, at3, at4);

    if (!fOutRight && !fOutLeft && !fOutTop && !fOutBottom) {
      fScrollGood = true;
    }

    // If in editor, anything goes
    if (gfEditMode && _KeyDown(SHIFT)) {
      fScrollGood = true;
    }

    // Reset some UI flags
    gfUIShowExitEast = false;
    gfUIShowExitWest = false;
    gfUIShowExitNorth = false;
    gfUIShowExitSouth = false;

    if (!fScrollGood) {
      // Force adjustment, if true
      if (fForceAdjust) {
        if (fOutTop) {
          // Adjust screen coordinates on the Y!
          ({ sNewScreenX, sNewScreenY } = CorrectRenderCenter(
            sScreenCenterX,
            gsTLY + sY_S,
          ));
          ({ sCellX: sTempPosX_W, sCellY: sTempPosY_W } =
            FromScreenToCellCoordinates(sNewScreenX, sNewScreenY));

          sTempRenderCenterX = sTempPosX_W;
          sTempRenderCenterY = sTempPosY_W;
          fScrollGood = true;
        }

        if (fOutBottom) {
          // OK, Ajust this since we get rounding errors in our two different calculations.
          ({ sNewScreenX, sNewScreenY } = CorrectRenderCenter(
            sScreenCenterX,
            gsBLY - sY_S - 50,
          ));
          ({ sCellX: sTempPosX_W, sCellY: sTempPosY_W } =
            FromScreenToCellCoordinates(sNewScreenX, sNewScreenY));

          sTempRenderCenterX = sTempPosX_W;
          sTempRenderCenterY = sTempPosY_W;
          fScrollGood = true;
        }

        if (fOutLeft) {
          ({ sNewScreenX, sNewScreenY } = CorrectRenderCenter(
            gsTLX + sX_S,
            sScreenCenterY,
          ));
          ({ sCellX: sTempPosX_W, sCellY: sTempPosY_W } =
            FromScreenToCellCoordinates(sNewScreenX, sNewScreenY));

          sTempRenderCenterX = sTempPosX_W;
          sTempRenderCenterY = sTempPosY_W;
          fScrollGood = true;
        }

        if (fOutRight) {
          ({ sNewScreenX, sNewScreenY } = CorrectRenderCenter(
            gsTRX - sX_S,
            sScreenCenterY,
          ));
          ({ sCellX: sTempPosX_W, sCellY: sTempPosY_W } =
            FromScreenToCellCoordinates(sNewScreenX, sNewScreenY));

          sTempRenderCenterX = sTempPosX_W;
          sTempRenderCenterY = sTempPosY_W;
          fScrollGood = true;
        }
      } else {
        if (fOutRight) {
          // Check where our cursor is!
          if (gusMouseXPos >= 639) {
            gfUIShowExitEast = true;
          }
        }

        if (fOutLeft) {
          // Check where our cursor is!
          if (gusMouseXPos == 0) {
            gfUIShowExitWest = true;
          }
        }

        if (fOutTop) {
          // Check where our cursor is!
          if (gusMouseYPos == 0) {
            gfUIShowExitNorth = true;
          }
        }

        if (fOutBottom) {
          // Check where our cursor is!
          if (gusMouseYPos >= 479) {
            gfUIShowExitSouth = true;
          }
        }
      }
    }

    if (fScrollGood) {
      if (!fCheckOnly) {
        gDebugStr = sprintf("Center: %d %d ", gsRenderCenterX, gsRenderCenterY);

        // Makesure it's a multiple of 5
        sMult = Math.trunc(sTempRenderCenterX / CELL_X_SIZE);
        gsRenderCenterX = sMult * CELL_X_SIZE + Math.trunc(CELL_X_SIZE / 2);

        // Makesure it's a multiple of 5
        sMult = Math.trunc(sTempRenderCenterY / CELL_X_SIZE);
        gsRenderCenterY = sMult * CELL_Y_SIZE + Math.trunc(CELL_Y_SIZE / 2);

        // gsRenderCenterX = sTempRenderCenterX;
        // gsRenderCenterY = sTempRenderCenterY;

        gsTopLeftWorldX = sTopLeftWorldX - gsTLX;
        gsTopLeftWorldY = sTopLeftWorldY - gsTLY;

        gsTopRightWorldX = sTopRightWorldX - gsTLX;
        gsTopRightWorldY = sTopRightWorldY - gsTLY;

        gsBottomLeftWorldX = sBottomLeftWorldX - gsTLX;
        gsBottomLeftWorldY = sBottomLeftWorldY - gsTLY;

        gsBottomRightWorldX = sBottomRightWorldX - gsTLX;
        gsBottomRightWorldY = sBottomRightWorldY - gsTLY;

        SetPositionSndsVolumeAndPanning();
      }

      return true;
    }

    return false;
  }

  function ClearMarkedTiles(): void {
    let uiCount: UINT32;

    for (uiCount = 0; uiCount < WORLD_MAX; uiCount++)
      gpWorldLevelData[uiCount].uiFlags &= ~MAPELEMENT_REDRAW;
  }

  // @@ATECLIP TO WORLD!
  function InvalidateWorldRedundencyRadius(
    sX: INT16,
    sY: INT16,
    sRadius: INT16,
  ): void {
    let sCountX: INT16;
    let sCountY: INT16;
    let uiTile: UINT32;

    SetRenderFlags(RENDER_FLAG_CHECKZ);

    for (sCountY = sY - sRadius; sCountY < sY + sRadius + 2; sCountY++) {
      for (sCountX = sX - sRadius; sCountX < sX + sRadius + 2; sCountX++) {
        uiTile = FASTMAPROWCOLTOPOS(sCountY, sCountX);

        gpWorldLevelData[uiTile].uiFlags |= MAPELEMENT_REEVALUATE_REDUNDENCY;
      }
    }
  }

  export function InvalidateWorldRedundency(): void {
    let uiCount: UINT32;

    SetRenderFlags(RENDER_FLAG_CHECKZ);

    for (uiCount = 0; uiCount < WORLD_MAX; uiCount++)
      gpWorldLevelData[uiCount].uiFlags |= MAPELEMENT_REEVALUATE_REDUNDENCY;
  }

  const Z_STRIP_DELTA_Y = Z_SUBLAYERS * 10;

  /**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZIncClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
  function Blt8BPPDataTo16BPPBufferTransZIncClip(
    pBuffer: Uint8ClampedArray,
    uiDestPitchBYTES: UINT32,
    pZBuffer: Uint8ClampedArray,
    usZValue: UINT16,
    hSrcVObject: SGPVObject,
    iX: INT32,
    iY: INT32,
    usIndex: UINT16,
    clipregion: SGPRect | null,
  ): boolean {
    let p16BPPPalette: Uint16Array;
    let uiOffset: UINT32;
    let usHeight: UINT32;
    let usWidth: UINT32;
    let Unblitted: UINT32;
    let SrcPtr: number;
    let DestPtr: number;
    let ZPtr: number;
    let LineSkip: UINT32;
    let pTrav: ETRLEObject;
    let iTempX: INT32;
    let iTempY: INT32;
    let LeftSkip: INT32;
    let RightSkip: INT32;
    let TopSkip: INT32;
    let BottomSkip: INT32;
    let BlitLength: INT32;
    let BlitHeight: INT32;
    let LSCount: INT32;
    let ClipX1: INT32;
    let ClipY1: INT32;
    let ClipX2: INT32;
    let ClipY2: INT32;
    let usZLevel: UINT16;
    let usZStartLevel: UINT16;
    let usZColsToGo: UINT16;
    let usZStartIndex: UINT16;
    let usCount: UINT16;
    let usZIndex: UINT16;
    let usZStartCols: UINT16;
    let pZArray: Int8Array;
    let pZInfo: ZStripInfo;

    // Assertions
    Assert(hSrcVObject != null);
    Assert(pBuffer != null);

    // Get Offsets from Index into structure
    pTrav = hSrcVObject.pETRLEObject[usIndex];
    usHeight = pTrav.usHeight;
    usWidth = pTrav.usWidth;
    uiOffset = pTrav.uiDataOffset;

    // Add to start position of dest buffer
    iTempX = iX + pTrav.sOffsetX;
    iTempY = iY + pTrav.sOffsetY;

    if (clipregion == null) {
      ClipX1 = ClippingRect.iLeft;
      ClipY1 = ClippingRect.iTop;
      ClipX2 = ClippingRect.iRight;
      ClipY2 = ClippingRect.iBottom;
    } else {
      ClipX1 = clipregion.iLeft;
      ClipY1 = clipregion.iTop;
      ClipX2 = clipregion.iRight;
      ClipY2 = clipregion.iBottom;
    }

    // Calculate rows hanging off each side of the screen
    LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
    RightSkip = Math.min(Math.max(ClipX2, iTempX + usWidth) - ClipX2, usWidth);
    TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
    BottomSkip = Math.min(
      Math.max(ClipY2, iTempY + usHeight) - ClipY2,
      usHeight,
    );

    // calculate the remaining rows and columns to blit
    BlitLength = usWidth - LeftSkip - RightSkip;
    BlitHeight = usHeight - TopSkip - BottomSkip;

    // check if whole thing is clipped
    if (LeftSkip >= usWidth || RightSkip >= usWidth) return true;

    // check if whole thing is clipped
    if (TopSkip >= usHeight || BottomSkip >= usHeight) return true;

    SrcPtr = uiOffset;
    DestPtr = uiDestPitchBYTES * (iTempY + TopSkip) + (iTempX + LeftSkip) * 4;
    ZPtr = uiDestPitchBYTES * (iTempY + TopSkip) + (iTempX + LeftSkip) * 4;
    p16BPPPalette = hSrcVObject.pShadeCurrent;
    LineSkip = uiDestPitchBYTES - BlitLength * 4;

    if (hSrcVObject.ppZStripInfo == null) {
      DebugMsg(
        TOPIC_VIDEOOBJECT,
        DBG_LEVEL_0,
        FormatString("Missing Z-Strip info on multi-Z object"),
      );
      return false;
    }
    // setup for the z-column blitting stuff
    pZInfo = hSrcVObject.ppZStripInfo[usIndex];
    if (pZInfo == null) {
      DebugMsg(
        TOPIC_VIDEOOBJECT,
        DBG_LEVEL_0,
        FormatString("Missing Z-Strip info on multi-Z object"),
      );
      return false;
    }

    usZStartLevel = usZValue + pZInfo.bInitialZChange * Z_STRIP_DELTA_Y;
    // set to odd number of pixels for first column

    if (LeftSkip > pZInfo.ubFirstZStripWidth) {
      usZStartCols = LeftSkip - pZInfo.ubFirstZStripWidth;
      usZStartCols = 20 - (usZStartCols % 20);
    } else if (LeftSkip < pZInfo.ubFirstZStripWidth)
      usZStartCols = pZInfo.ubFirstZStripWidth - LeftSkip;
    else usZStartCols = 20;

    usZColsToGo = usZStartCols;

    pZArray = pZInfo.pbZChange;

    if (LeftSkip >= pZInfo.ubFirstZStripWidth) {
      // Index into array after doing left clipping
      usZStartIndex =
        1 + Math.trunc((LeftSkip - pZInfo.ubFirstZStripWidth) / 20);

      // calculates the Z-value after left-side clipping
      if (usZStartIndex) {
        for (usCount = 0; usCount < usZStartIndex; usCount++) {
          switch (pZArray[usCount]) {
            case -1:
              usZStartLevel -= Z_STRIP_DELTA_Y;
              break;
            case 0: // no change
              break;
            case 1:
              usZStartLevel += Z_STRIP_DELTA_Y;
              break;
          }
        }
      }
    } else usZStartIndex = 0;

    usZLevel = usZStartLevel;
    usZIndex = usZStartIndex;

    let pPixData = hSrcVObject.pPixData;
    let remainingSkip: number;
    let remainingBlitLength: number;
    let byte: number;
    let runLength: number;
    let isTransparent: boolean;
    let rgb: number;

    while (TopSkip) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        TopSkip--;
      }
    }

    remainingSkip = LeftSkip;
    remainingBlitLength = BlitLength;

    while (BlitHeight) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        BlitHeight--;
        DestPtr += LineSkip;
        ZPtr += LineSkip;
        usZLevel = usZStartLevel;
        usZIndex = usZStartIndex;
        usZColsToGo = usZStartCols;
        remainingSkip = LeftSkip;
        remainingBlitLength = BlitLength;
        continue;
      }

      runLength = byte & 0x7f;
      isTransparent = Boolean(byte & 0x80);

      if (remainingSkip) {
        if (remainingSkip > runLength) {
          if (!isTransparent) {
            SrcPtr += runLength;
          }
          remainingSkip -= runLength;
          continue;
        }

        if (!isTransparent) {
          SrcPtr += remainingSkip;
        }
        runLength -= remainingSkip;
        remainingSkip = 0;
      }

      if (runLength > remainingBlitLength) {
        runLength = remainingBlitLength;
      }

      remainingBlitLength -= runLength;

      if (isTransparent) {
        while (runLength--) {
          DestPtr += 4;
          ZPtr += 4;
          if (--usZColsToGo === 0) {
            if (pZArray[usZIndex] < 0) {
              usZLevel -= Z_STRIP_DELTA_Y;
            } else if (pZArray[usZIndex] > 0) {
              usZLevel += Z_STRIP_DELTA_Y;
            }

            usZIndex++;
            usZColsToGo = 20;
          }
        }
      } else {
        while (runLength--) {
          byte = pPixData[SrcPtr++];

          if (getZValue(pZBuffer, ZPtr) < usZLevel) {
            rgb = GetRGBColor(p16BPPPalette[byte]);
            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xff;

            setZValue(pZBuffer, ZPtr, usZLevel);
          } else {
            DestPtr += 4;
          }

          ZPtr += 4;

          if (--usZColsToGo === 0) {
            if (pZArray[usZIndex] < 0) {
              usZLevel -= Z_STRIP_DELTA_Y;
            } else if (pZArray[usZIndex] > 0) {
              usZLevel += Z_STRIP_DELTA_Y;
            }

            usZIndex++;
            usZColsToGo = 20;
          }
        }
      }
    }

    return true;
  }

  /**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZIncClipSaveZBurnsThrough

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
  function Blt8BPPDataTo16BPPBufferTransZIncClipZSameZBurnsThrough(
    pBuffer: Uint8ClampedArray,
    uiDestPitchBYTES: UINT32,
    pZBuffer: Uint8ClampedArray,
    usZValue: UINT16,
    hSrcVObject: SGPVObject,
    iX: INT32,
    iY: INT32,
    usIndex: UINT16,
    clipregion: SGPRect | null,
  ): boolean {
    let p16BPPPalette: Uint16Array;
    let uiOffset: UINT32;
    let usHeight: UINT32;
    let usWidth: UINT32;
    let Unblitted: UINT32;
    let SrcPtr: number;
    let DestPtr: number;
    let ZPtr: number;
    let LineSkip: UINT32;
    let pTrav: ETRLEObject;
    let iTempX: INT32;
    let iTempY: INT32;
    let LeftSkip: INT32;
    let RightSkip: INT32;
    let TopSkip: INT32;
    let BottomSkip: INT32;
    let BlitLength: INT32;
    let BlitHeight: INT32;
    let LSCount: INT32;
    let ClipX1: INT32;
    let ClipY1: INT32;
    let ClipX2: INT32;
    let ClipY2: INT32;
    let usZLevel: UINT16;
    let usZStartLevel: UINT16;
    let usZColsToGo: UINT16;
    let usZStartIndex: UINT16;
    let usCount: UINT16;
    let usZIndex: UINT16;
    let usZStartCols: UINT16;
    let pZArray: Int8Array;
    let pZInfo: ZStripInfo;

    // Assertions
    Assert(hSrcVObject != null);
    Assert(pBuffer != null);

    // Get Offsets from Index into structure
    pTrav = hSrcVObject.pETRLEObject[usIndex];
    usHeight = pTrav.usHeight;
    usWidth = pTrav.usWidth;
    uiOffset = pTrav.uiDataOffset;

    // Add to start position of dest buffer
    iTempX = iX + pTrav.sOffsetX;
    iTempY = iY + pTrav.sOffsetY;

    if (clipregion == null) {
      ClipX1 = ClippingRect.iLeft;
      ClipY1 = ClippingRect.iTop;
      ClipX2 = ClippingRect.iRight;
      ClipY2 = ClippingRect.iBottom;
    } else {
      ClipX1 = clipregion.iLeft;
      ClipY1 = clipregion.iTop;
      ClipX2 = clipregion.iRight;
      ClipY2 = clipregion.iBottom;
    }

    // Calculate rows hanging off each side of the screen
    LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
    RightSkip = Math.min(Math.max(ClipX2, iTempX + usWidth) - ClipX2, usWidth);
    TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
    BottomSkip = Math.min(
      Math.max(ClipY2, iTempY + usHeight) - ClipY2,
      usHeight,
    );

    // calculate the remaining rows and columns to blit
    BlitLength = usWidth - LeftSkip - RightSkip;
    BlitHeight = usHeight - TopSkip - BottomSkip;

    // check if whole thing is clipped
    if (LeftSkip >= usWidth || RightSkip >= usWidth) return true;

    // check if whole thing is clipped
    if (TopSkip >= usHeight || BottomSkip >= usHeight) return true;

    SrcPtr = uiOffset;
    DestPtr = uiDestPitchBYTES * (iTempY + TopSkip) + (iTempX + LeftSkip) * 4;
    ZPtr = uiDestPitchBYTES * (iTempY + TopSkip) + (iTempX + LeftSkip) * 4;
    p16BPPPalette = hSrcVObject.pShadeCurrent;
    LineSkip = uiDestPitchBYTES - BlitLength * 4;

    if (hSrcVObject.ppZStripInfo == null) {
      DebugMsg(
        TOPIC_VIDEOOBJECT,
        DBG_LEVEL_0,
        FormatString("Missing Z-Strip info on multi-Z object"),
      );
      return false;
    }
    // setup for the z-column blitting stuff
    pZInfo = hSrcVObject.ppZStripInfo[usIndex];
    if (pZInfo == null) {
      DebugMsg(
        TOPIC_VIDEOOBJECT,
        DBG_LEVEL_0,
        FormatString("Missing Z-Strip info on multi-Z object"),
      );
      return false;
    }

    usZStartLevel = usZValue + pZInfo.bInitialZChange * Z_STRIP_DELTA_Y;
    // set to odd number of pixels for first column

    if (LeftSkip > pZInfo.ubFirstZStripWidth) {
      usZStartCols = LeftSkip - pZInfo.ubFirstZStripWidth;
      usZStartCols = 20 - (usZStartCols % 20);
    } else if (LeftSkip < pZInfo.ubFirstZStripWidth)
      usZStartCols = pZInfo.ubFirstZStripWidth - LeftSkip;
    else usZStartCols = 20;

    usZColsToGo = usZStartCols;

    pZArray = pZInfo.pbZChange;

    if (LeftSkip >= pZInfo.ubFirstZStripWidth) {
      // Index into array after doing left clipping
      usZStartIndex =
        1 + Math.trunc((LeftSkip - pZInfo.ubFirstZStripWidth) / 20);

      // calculates the Z-value after left-side clipping
      if (usZStartIndex) {
        for (usCount = 0; usCount < usZStartIndex; usCount++) {
          switch (pZArray[usCount]) {
            case -1:
              usZStartLevel -= Z_STRIP_DELTA_Y;
              break;
            case 0: // no change
              break;
            case 1:
              usZStartLevel += Z_STRIP_DELTA_Y;
              break;
          }
        }
      }
    } else usZStartIndex = 0;

    usZLevel = usZStartLevel;
    usZIndex = usZStartIndex;

    let pPixData = hSrcVObject.pPixData;
    let remainingSkip: number;
    let remainingBlitLength: number;
    let byte: number;
    let runLength: number;
    let isTransparent: boolean;
    let rgb: number;

    while (TopSkip) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        TopSkip--;
      }
    }

    remainingSkip = LeftSkip;
    remainingBlitLength = BlitLength;

    while (BlitHeight) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        BlitHeight--;
        DestPtr += LineSkip;
        ZPtr += LineSkip;
        usZLevel = usZStartLevel;
        usZIndex = usZStartIndex;
        usZColsToGo = usZStartCols;
        remainingSkip = LeftSkip;
        remainingBlitLength = BlitLength;
        continue;
      }

      runLength = byte & 0x7f;
      isTransparent = Boolean(byte & 0x80);

      if (remainingSkip) {
        if (remainingSkip > runLength) {
          if (!isTransparent) {
            SrcPtr += runLength;
          }
          remainingSkip -= runLength;
          continue;
        }

        if (!isTransparent) {
          SrcPtr += remainingSkip;
        }
        runLength -= remainingSkip;
        remainingSkip = 0;
      }

      if (runLength > remainingBlitLength) {
        runLength = remainingBlitLength;
      }

      remainingBlitLength -= runLength;

      if (isTransparent) {
        while (runLength--) {
          DestPtr += 4;
          ZPtr += 4;
          if (--usZColsToGo === 0) {
            if (pZArray[usZIndex] < 0) {
              usZLevel -= Z_STRIP_DELTA_Y;
            } else if (pZArray[usZIndex] > 0) {
              usZLevel += Z_STRIP_DELTA_Y;
            }

            usZIndex++;
            usZColsToGo = 20;
          }
        }
      } else {
        while (runLength--) {
          byte = pPixData[SrcPtr++];

          if (getZValue(pZBuffer, ZPtr) <= usZLevel) {
            rgb = GetRGBColor(p16BPPPalette[byte]);
            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xff;

            setZValue(pZBuffer, ZPtr, usZLevel);
          } else {
            DestPtr += 4;
          }

          ZPtr += 4;

          if (--usZColsToGo === 0) {
            if (pZArray[usZIndex] < 0) {
              usZLevel -= Z_STRIP_DELTA_Y;
            } else if (pZArray[usZIndex] > 0) {
              usZLevel += Z_STRIP_DELTA_Y;
            }

            usZIndex++;
            usZColsToGo = 20;
          }
        }
      }
    }

    return true;
  }

  /**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZIncObscureClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

        //ATE: This blitter makes the values that are =< z value pixellate rather than not
        // render at all

**********************************************************************************************/
  function Blt8BPPDataTo16BPPBufferTransZIncObscureClip(
    pBuffer: Uint8ClampedArray,
    uiDestPitchBYTES: UINT32,
    pZBuffer: Uint8ClampedArray,
    usZValue: UINT16,
    hSrcVObject: SGPVObject,
    iX: INT32,
    iY: INT32,
    usIndex: UINT16,
    clipregion: SGPRect | null,
  ): boolean {
    let p16BPPPalette: Uint16Array;
    let uiOffset: UINT32;
    let uiLineFlag: UINT32;
    let usHeight: UINT32;
    let usWidth: UINT32;
    let Unblitted: UINT32;
    let SrcPtr: number;
    let DestPtr: number;
    let ZPtr: number;
    let LineSkip: UINT32;
    let pTrav: ETRLEObject;
    let iTempX: INT32;
    let iTempY: INT32;
    let LeftSkip: INT32;
    let RightSkip: INT32;
    let TopSkip: INT32;
    let BottomSkip: INT32;
    let BlitLength: INT32;
    let BlitHeight: INT32;
    let LSCount: INT32;
    let ClipX1: INT32;
    let ClipY1: INT32;
    let ClipX2: INT32;
    let ClipY2: INT32;
    let usZLevel: UINT16;
    let usZStartLevel: UINT16;
    let usZColsToGo: UINT16;
    let usZStartIndex: UINT16;
    let usCount: UINT16;
    let usZIndex: UINT16;
    let usZStartCols: UINT16;
    let pZArray: Int8Array;
    let pZInfo: ZStripInfo;

    // Assertions
    Assert(hSrcVObject != null);
    Assert(pBuffer != null);

    // Get Offsets from Index into structure
    pTrav = hSrcVObject.pETRLEObject[usIndex];
    usHeight = pTrav.usHeight;
    usWidth = pTrav.usWidth;
    uiOffset = pTrav.uiDataOffset;

    // Add to start position of dest buffer
    iTempX = iX + pTrav.sOffsetX;
    iTempY = iY + pTrav.sOffsetY;

    if (clipregion == null) {
      ClipX1 = ClippingRect.iLeft;
      ClipY1 = ClippingRect.iTop;
      ClipX2 = ClippingRect.iRight;
      ClipY2 = ClippingRect.iBottom;
    } else {
      ClipX1 = clipregion.iLeft;
      ClipY1 = clipregion.iTop;
      ClipX2 = clipregion.iRight;
      ClipY2 = clipregion.iBottom;
    }

    // Calculate rows hanging off each side of the screen
    LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
    RightSkip = Math.min(Math.max(ClipX2, iTempX + usWidth) - ClipX2, usWidth);
    TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
    BottomSkip = Math.min(
      Math.max(ClipY2, iTempY + usHeight) - ClipY2,
      usHeight,
    );

    uiLineFlag = iTempY & 1;

    // calculate the remaining rows and columns to blit
    BlitLength = usWidth - LeftSkip - RightSkip;
    BlitHeight = usHeight - TopSkip - BottomSkip;

    // check if whole thing is clipped
    if (LeftSkip >= usWidth || RightSkip >= usWidth) return true;

    // check if whole thing is clipped
    if (TopSkip >= usHeight || BottomSkip >= usHeight) return true;

    SrcPtr = uiOffset;
    DestPtr = uiDestPitchBYTES * (iTempY + TopSkip) + (iTempX + LeftSkip) * 4;
    ZPtr = uiDestPitchBYTES * (iTempY + TopSkip) + (iTempX + LeftSkip) * 4;
    p16BPPPalette = hSrcVObject.pShadeCurrent;
    LineSkip = uiDestPitchBYTES - BlitLength * 4;

    if (hSrcVObject.ppZStripInfo == null) {
      DebugMsg(
        TOPIC_VIDEOOBJECT,
        DBG_LEVEL_0,
        FormatString("Missing Z-Strip info on multi-Z object"),
      );
      return false;
    }
    // setup for the z-column blitting stuff
    pZInfo = hSrcVObject.ppZStripInfo[usIndex];
    if (pZInfo == null) {
      DebugMsg(
        TOPIC_VIDEOOBJECT,
        DBG_LEVEL_0,
        FormatString("Missing Z-Strip info on multi-Z object"),
      );
      return false;
    }

    usZStartLevel = usZValue + pZInfo.bInitialZChange * Z_STRIP_DELTA_Y;
    // set to odd number of pixels for first column

    if (LeftSkip > pZInfo.ubFirstZStripWidth) {
      usZStartCols = LeftSkip - pZInfo.ubFirstZStripWidth;
      usZStartCols = 20 - (usZStartCols % 20);
    } else if (LeftSkip < pZInfo.ubFirstZStripWidth)
      usZStartCols = pZInfo.ubFirstZStripWidth - LeftSkip;
    else usZStartCols = 20;

    usZColsToGo = usZStartCols;

    pZArray = pZInfo.pbZChange;

    if (LeftSkip >= pZInfo.ubFirstZStripWidth) {
      // Index into array after doing left clipping
      usZStartIndex =
        1 + Math.trunc((LeftSkip - pZInfo.ubFirstZStripWidth) / 20);

      // calculates the Z-value after left-side clipping
      if (usZStartIndex) {
        for (usCount = 0; usCount < usZStartIndex; usCount++) {
          switch (pZArray[usCount]) {
            case -1:
              usZStartLevel -= Z_STRIP_DELTA_Y;
              break;
            case 0: // no change
              break;
            case 1:
              usZStartLevel += Z_STRIP_DELTA_Y;
              break;
          }
        }
      }
    } else usZStartIndex = 0;

    usZLevel = usZStartLevel;
    usZIndex = usZStartIndex;

    let pPixData = hSrcVObject.pPixData;
    let remainingSkip: number;
    let remainingBlitLength: number;
    let byte: number;
    let runLength: number;
    let isTransparent: boolean;
    let rgb: number;

    while (TopSkip) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        TopSkip--;
        uiLineFlag ^= 1;
      }
    }

    remainingSkip = LeftSkip;
    remainingBlitLength = BlitLength;

    while (BlitHeight) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        uiLineFlag ^= 1;
        BlitHeight--;
        DestPtr += LineSkip;
        ZPtr += LineSkip;
        usZLevel = usZStartLevel;
        usZIndex = usZStartIndex;
        usZColsToGo = usZStartCols;
        remainingSkip = LeftSkip;
        remainingBlitLength = BlitLength;
        continue;
      }

      runLength = byte & 0x7f;
      isTransparent = Boolean(byte & 0x80);

      if (remainingSkip) {
        if (remainingSkip > runLength) {
          if (!isTransparent) {
            SrcPtr += runLength;
          }
          remainingSkip -= runLength;
          continue;
        }

        if (!isTransparent) {
          SrcPtr += remainingSkip;
        }
        runLength -= remainingSkip;
        remainingSkip = 0;
      }

      if (runLength > remainingBlitLength) {
        runLength = remainingBlitLength;
      }

      remainingBlitLength -= runLength;

      if (isTransparent) {
        while (runLength--) {
          DestPtr += 4;
          ZPtr += 4;
          if (--usZColsToGo === 0) {
            if (pZArray[usZIndex] < 0) {
              usZLevel -= Z_STRIP_DELTA_Y;
            } else if (pZArray[usZIndex] > 0) {
              usZLevel += Z_STRIP_DELTA_Y;
            }

            usZIndex++;
            usZColsToGo = 20;
          }
        }
      } else {
        while (runLength--) {
          byte = pPixData[SrcPtr++];

          if (getZValue(pZBuffer, ZPtr) < usZLevel) {
            rgb = GetRGBColor(p16BPPPalette[byte]);
            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xff;

            setZValue(pZBuffer, ZPtr, usZLevel);
          } else {
            if (uiLineFlag & 1) {
              if (DestPtr & 4) {
                rgb = GetRGBColor(p16BPPPalette[byte]);
                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xff;

                setZValue(pZBuffer, ZPtr, usZLevel);
              } else {
                DestPtr += 4;
              }
            } else {
              if (DestPtr & 4) {
                DestPtr += 4;
              } else {
                rgb = GetRGBColor(p16BPPPalette[byte]);
                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xff;

                setZValue(pZBuffer, ZPtr, usZLevel);
              }
            }
          }

          ZPtr += 4;

          if (--usZColsToGo === 0) {
            if (pZArray[usZIndex] < 0) {
              usZLevel -= Z_STRIP_DELTA_Y;
            } else if (pZArray[usZIndex] > 0) {
              usZLevel += Z_STRIP_DELTA_Y;
            }

            usZIndex++;
            usZColsToGo = 20;
          }
        }
      }
    }

    return true;
  }

  // Blitter Specs
  // 1 ) 8 to 16 bpp
  // 2 ) strip z-blitter
  // 3 ) clipped
  // 4 ) trans shadow - if value is 254, makes a shadow
  //
  function Blt8BPPDataTo16BPPBufferTransZTransShadowIncObscureClip(
    pBuffer: Uint8ClampedArray,
    uiDestPitchBYTES: UINT32,
    pZBuffer: Uint8ClampedArray,
    usZValue: UINT16,
    hSrcVObject: SGPVObject,
    iX: INT32,
    iY: INT32,
    usIndex: UINT16,
    clipregion: SGPRect | null,
    sZIndex: INT16,
    p16BPPPalette: Uint16Array,
  ): boolean {
    let uiOffset: UINT32;
    let uiLineFlag: UINT32;
    let usHeight: UINT32;
    let usWidth: UINT32;
    let Unblitted: UINT32;
    let SrcPtr: number;
    let DestPtr: number;
    let ZPtr: number;
    let LineSkip: UINT32;
    let pTrav: ETRLEObject;
    let iTempX: INT32;
    let iTempY: INT32;
    let LeftSkip: INT32;
    let RightSkip: INT32;
    let TopSkip: INT32;
    let BottomSkip: INT32;
    let BlitLength: INT32;
    let BlitHeight: INT32;
    let LSCount: INT32;
    let ClipX1: INT32;
    let ClipY1: INT32;
    let ClipX2: INT32;
    let ClipY2: INT32;
    let usZLevel: UINT16;
    let usZStartLevel: UINT16;
    let usZColsToGo: UINT16;
    let usZStartIndex: UINT16;
    let usCount: UINT16;
    let usZIndex: UINT16;
    let usZStartCols: UINT16;
    let pZArray: Int8Array;
    let pZInfo: ZStripInfo;

    // Assertions
    Assert(hSrcVObject != null);
    Assert(pBuffer != null);

    // Get Offsets from Index into structure
    pTrav = hSrcVObject.pETRLEObject[usIndex];
    usHeight = pTrav.usHeight;
    usWidth = pTrav.usWidth;
    uiOffset = pTrav.uiDataOffset;

    // Add to start position of dest buffer
    iTempX = iX + pTrav.sOffsetX;
    iTempY = iY + pTrav.sOffsetY;

    if (clipregion == null) {
      ClipX1 = ClippingRect.iLeft;
      ClipY1 = ClippingRect.iTop;
      ClipX2 = ClippingRect.iRight;
      ClipY2 = ClippingRect.iBottom;
    } else {
      ClipX1 = clipregion.iLeft;
      ClipY1 = clipregion.iTop;
      ClipX2 = clipregion.iRight;
      ClipY2 = clipregion.iBottom;
    }

    // Calculate rows hanging off each side of the screen
    LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
    RightSkip = Math.min(Math.max(ClipX2, iTempX + usWidth) - ClipX2, usWidth);
    TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
    BottomSkip = Math.min(
      Math.max(ClipY2, iTempY + usHeight) - ClipY2,
      usHeight,
    );

    uiLineFlag = iTempY & 1;

    // calculate the remaining rows and columns to blit
    BlitLength = usWidth - LeftSkip - RightSkip;
    BlitHeight = usHeight - TopSkip - BottomSkip;

    // check if whole thing is clipped
    if (LeftSkip >= usWidth || RightSkip >= usWidth) return true;

    // check if whole thing is clipped
    if (TopSkip >= usHeight || BottomSkip >= usHeight) return true;

    SrcPtr = uiOffset;
    DestPtr = uiDestPitchBYTES * (iTempY + TopSkip) + (iTempX + LeftSkip) * 4;
    ZPtr = uiDestPitchBYTES * (iTempY + TopSkip) + (iTempX + LeftSkip) * 4;
    LineSkip = uiDestPitchBYTES - BlitLength * 4;

    if (hSrcVObject.ppZStripInfo == null) {
      DebugMsg(
        TOPIC_VIDEOOBJECT,
        DBG_LEVEL_0,
        FormatString("Missing Z-Strip info on multi-Z object"),
      );
      return false;
    }
    // setup for the z-column blitting stuff
    pZInfo = hSrcVObject.ppZStripInfo[sZIndex];
    if (pZInfo == null) {
      DebugMsg(
        TOPIC_VIDEOOBJECT,
        DBG_LEVEL_0,
        FormatString("Missing Z-Strip info on multi-Z object"),
      );
      return false;
    }

    usZStartLevel = usZValue + pZInfo.bInitialZChange * Z_SUBLAYERS * 10;

    if (LeftSkip > pZInfo.ubFirstZStripWidth) {
      usZStartCols = LeftSkip - pZInfo.ubFirstZStripWidth;
      usZStartCols = 20 - (usZStartCols % 20);
    } else if (LeftSkip < pZInfo.ubFirstZStripWidth)
      usZStartCols = pZInfo.ubFirstZStripWidth - LeftSkip;
    else usZStartCols = 20;

    // set to odd number of pixels for first column
    usZColsToGo = usZStartCols;

    pZArray = pZInfo.pbZChange;

    if (LeftSkip >= usZColsToGo) {
      // Index into array after doing left clipping
      usZStartIndex =
        1 + Math.trunc((LeftSkip - pZInfo.ubFirstZStripWidth) / 20);

      // calculates the Z-value after left-side clipping
      if (usZStartIndex) {
        for (usCount = 0; usCount < usZStartIndex; usCount++) {
          switch (pZArray[usCount]) {
            case -1:
              usZStartLevel -= Z_SUBLAYERS;
              break;
            case 0: // no change
              break;
            case 1:
              usZStartLevel += Z_SUBLAYERS;
              break;
          }
        }
      }
    } else usZStartIndex = 0;

    usZLevel = usZStartLevel;
    usZIndex = usZStartIndex;

    let pPixData = hSrcVObject.pPixData;
    let remainingSkip: number;
    let remainingBlitLength: number;
    let byte: number;
    let runLength: number;
    let isTransparent: boolean;
    let color: number;
    let rgb: number;

    while (TopSkip) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        TopSkip--;
      }
    }

    remainingSkip = LeftSkip;
    remainingBlitLength = BlitLength;

    while (BlitHeight) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        BlitHeight--;
        DestPtr += LineSkip;
        ZPtr += LineSkip;
        uiLineFlag ^= 1;
        usZLevel = usZStartLevel;
        usZIndex = usZStartIndex;
        usZColsToGo = usZStartCols;
        remainingSkip = LeftSkip;
        remainingBlitLength = BlitLength;
        continue;
      }

      runLength = byte & 0x7f;
      isTransparent = Boolean(byte & 0x80);

      if (remainingSkip) {
        if (remainingSkip > runLength) {
          if (!isTransparent) {
            SrcPtr += runLength;
          }
          remainingSkip -= runLength;
          continue;
        }

        if (!isTransparent) {
          SrcPtr += remainingSkip;
        }
        runLength -= remainingSkip;
        remainingSkip = 0;
      }

      if (runLength > remainingBlitLength) {
        runLength = remainingBlitLength;
      }

      remainingBlitLength -= runLength;

      if (isTransparent) {
        while (runLength--) {
          DestPtr += 4;
          ZPtr += 4;
          if (--usZColsToGo === 0) {
            if (pZArray[usZIndex] < 0) {
              usZLevel -= Z_SUBLAYERS;
            } else if (pZArray[usZIndex] > 0) {
              usZLevel += Z_SUBLAYERS;
            }

            usZIndex++;
            usZColsToGo = 20;
          }
        }
      } else {
        while (runLength--) {
          byte = pPixData[SrcPtr++];

          if (getZValue(pZBuffer, ZPtr) < usZLevel) {
            if (byte === 254) {
              color = Get16BPPColor(
                FROMRGB(
                  pBuffer[DestPtr],
                  pBuffer[DestPtr + 1],
                  pBuffer[DestPtr + 2],
                ),
              );
              rgb = GetRGBColor(ShadeTable[color]);
            } else {
              rgb = GetRGBColor(p16BPPPalette[byte]);
            }

            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xff;

            setZValue(pZBuffer, ZPtr, usZLevel);
          } else {
            if (uiLineFlag & 1) {
              if (DestPtr & 4) {
                if (byte === 254) {
                  color = Get16BPPColor(
                    FROMRGB(
                      pBuffer[DestPtr],
                      pBuffer[DestPtr + 1],
                      pBuffer[DestPtr + 2],
                    ),
                  );
                  rgb = GetRGBColor(ShadeTable[color]);
                } else {
                  rgb = GetRGBColor(p16BPPPalette[byte]);
                }

                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xff;

                setZValue(pZBuffer, ZPtr, usZLevel);
              } else {
                DestPtr += 4;
              }
            } else {
              if (DestPtr & 4) {
                DestPtr += 4;
              } else {
                if (byte === 254) {
                  color = Get16BPPColor(
                    FROMRGB(
                      pBuffer[DestPtr],
                      pBuffer[DestPtr + 1],
                      pBuffer[DestPtr + 2],
                    ),
                  );
                  rgb = GetRGBColor(ShadeTable[color]);
                } else {
                  rgb = GetRGBColor(p16BPPPalette[byte]);
                }

                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xff;

                setZValue(pZBuffer, ZPtr, usZLevel);
              }
            }
          }

          ZPtr += 4;

          if (--usZColsToGo === 0) {
            if (pZArray[usZIndex] < 0) {
              usZLevel -= Z_SUBLAYERS;
            } else if (pZArray[usZIndex] > 0) {
              usZLevel += Z_SUBLAYERS;
            }

            usZIndex++;
            usZColsToGo = 20;
          }
        }
      }
    }

    return true;
  }

  function CorrectRenderCenter(
    sRenderX: INT16,
    sRenderY: INT16,
  ): { sNewScreenX: INT16; sNewScreenY: INT16 } {
    let sNewScreenX: INT16;
    let sNewScreenY: INT16;

    let sScreenX: INT16;
    let sScreenY: INT16;
    let sNumXSteps: INT16;
    let sNumYSteps: INT16;

    // Use radar scale values to get screen values, then convert ot map values, rounding to nearest middle tile
    sScreenX = sRenderX;
    sScreenY = sRenderY;

    // Adjust for offsets!
    sScreenX += 0;
    sScreenY += 10;

    // Adjust to viewport start!
    sScreenX -= Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
    sScreenY -= Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

    // Make sure these coordinates are multiples of scroll steps
    sNumXSteps = Math.trunc(
      sScreenX / gubNewScrollXSpeeds[gfDoVideoScroll][gubCurScrollSpeedID],
    );
    sNumYSteps = Math.trunc(
      sScreenY / gubNewScrollYSpeeds[gfDoVideoScroll][gubCurScrollSpeedID],
    );

    sScreenX =
      sNumXSteps * gubNewScrollXSpeeds[gfDoVideoScroll][gubCurScrollSpeedID];
    sScreenY =
      sNumYSteps * gubNewScrollYSpeeds[gfDoVideoScroll][gubCurScrollSpeedID];

    // Adjust back
    sScreenX += Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
    sScreenY += Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

    sNewScreenX = sScreenX;
    sNewScreenY = sScreenY;

    return { sNewScreenX, sNewScreenY };
  }

  // Blitter Specs
  // 1 ) 8 to 16 bpp
  // 2 ) strip z-blitter
  // 3 ) clipped
  // 4 ) trans shadow - if value is 254, makes a shadow
  //
  function Blt8BPPDataTo16BPPBufferTransZTransShadowIncClip(
    pBuffer: Uint8ClampedArray,
    uiDestPitchBYTES: UINT32,
    pZBuffer: Uint8ClampedArray,
    usZValue: UINT16,
    hSrcVObject: SGPVObject,
    iX: INT32,
    iY: INT32,
    usIndex: UINT16,
    clipregion: SGPRect | null,
    sZIndex: INT16,
    p16BPPPalette: Uint16Array,
  ): boolean {
    let uiOffset: UINT32;
    let usHeight: UINT32;
    let usWidth: UINT32;
    let Unblitted: UINT32;
    let SrcPtr: number;
    let DestPtr: number;
    let ZPtr: number;
    let LineSkip: UINT32;
    let pTrav: ETRLEObject;
    let iTempX: INT32;
    let iTempY: INT32;
    let LeftSkip: INT32;
    let RightSkip: INT32;
    let TopSkip: INT32;
    let BottomSkip: INT32;
    let BlitLength: INT32;
    let BlitHeight: INT32;
    let LSCount: INT32;
    let ClipX1: INT32;
    let ClipY1: INT32;
    let ClipX2: INT32;
    let ClipY2: INT32;
    let usZLevel: UINT16;
    let usZStartLevel: UINT16;
    let usZColsToGo: UINT16;
    let usZStartIndex: UINT16;
    let usCount: UINT16;
    let usZIndex: UINT16;
    let usZStartCols: UINT16;
    let pZArray: Int8Array;
    let pZInfo: ZStripInfo;

    // Assertions
    Assert(hSrcVObject != null);
    Assert(pBuffer != null);

    // Get Offsets from Index into structure
    pTrav = hSrcVObject.pETRLEObject[usIndex];
    usHeight = pTrav.usHeight;
    usWidth = pTrav.usWidth;
    uiOffset = pTrav.uiDataOffset;

    // Add to start position of dest buffer
    iTempX = iX + pTrav.sOffsetX;
    iTempY = iY + pTrav.sOffsetY;

    if (clipregion == null) {
      ClipX1 = ClippingRect.iLeft;
      ClipY1 = ClippingRect.iTop;
      ClipX2 = ClippingRect.iRight;
      ClipY2 = ClippingRect.iBottom;
    } else {
      ClipX1 = clipregion.iLeft;
      ClipY1 = clipregion.iTop;
      ClipX2 = clipregion.iRight;
      ClipY2 = clipregion.iBottom;
    }

    // Calculate rows hanging off each side of the screen
    LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
    RightSkip = Math.min(Math.max(ClipX2, iTempX + usWidth) - ClipX2, usWidth);
    TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
    BottomSkip = Math.min(
      Math.max(ClipY2, iTempY + usHeight) - ClipY2,
      usHeight,
    );

    // calculate the remaining rows and columns to blit
    BlitLength = usWidth - LeftSkip - RightSkip;
    BlitHeight = usHeight - TopSkip - BottomSkip;

    // check if whole thing is clipped
    if (LeftSkip >= usWidth || RightSkip >= usWidth) return true;

    // check if whole thing is clipped
    if (TopSkip >= usHeight || BottomSkip >= usHeight) return true;

    SrcPtr = uiOffset;
    DestPtr = uiDestPitchBYTES * (iTempY + TopSkip) + (iTempX + LeftSkip) * 4;
    ZPtr = uiDestPitchBYTES * (iTempY + TopSkip) + (iTempX + LeftSkip) * 4;
    LineSkip = uiDestPitchBYTES - BlitLength * 4;

    if (hSrcVObject.ppZStripInfo == null) {
      DebugMsg(
        TOPIC_VIDEOOBJECT,
        DBG_LEVEL_0,
        FormatString("Missing Z-Strip info on multi-Z object"),
      );
      return false;
    }
    // setup for the z-column blitting stuff
    pZInfo = hSrcVObject.ppZStripInfo[sZIndex];
    if (pZInfo == null) {
      DebugMsg(
        TOPIC_VIDEOOBJECT,
        DBG_LEVEL_0,
        FormatString("Missing Z-Strip info on multi-Z object"),
      );
      return false;
    }

    usZStartLevel = usZValue + pZInfo.bInitialZChange * Z_SUBLAYERS * 10;

    if (LeftSkip > pZInfo.ubFirstZStripWidth) {
      usZStartCols = LeftSkip - pZInfo.ubFirstZStripWidth;
      usZStartCols = 20 - (usZStartCols % 20);
    } else if (LeftSkip < pZInfo.ubFirstZStripWidth)
      usZStartCols = pZInfo.ubFirstZStripWidth - LeftSkip;
    else usZStartCols = 20;

    // set to odd number of pixels for first column
    usZColsToGo = usZStartCols;

    pZArray = pZInfo.pbZChange;

    if (LeftSkip >= usZColsToGo) {
      // Index into array after doing left clipping
      usZStartIndex =
        1 + Math.trunc((LeftSkip - pZInfo.ubFirstZStripWidth) / 20);

      // calculates the Z-value after left-side clipping
      if (usZStartIndex) {
        for (usCount = 0; usCount < usZStartIndex; usCount++) {
          switch (pZArray[usCount]) {
            case -1:
              usZStartLevel -= Z_SUBLAYERS;
              break;
            case 0: // no change
              break;
            case 1:
              usZStartLevel += Z_SUBLAYERS;
              break;
          }
        }
      }
    } else usZStartIndex = 0;

    usZLevel = usZStartLevel;
    usZIndex = usZStartIndex;

    let pPixData = hSrcVObject.pPixData;
    let remainingSkip: number;
    let remainingBlitLength: number;
    let byte: number;
    let runLength: number;
    let isTransparent: boolean;
    let color: number;
    let rgb: number;

    while (TopSkip) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        TopSkip--;
      }
    }

    remainingSkip = LeftSkip;
    remainingBlitLength = BlitLength;

    while (BlitHeight) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        BlitHeight--;
        DestPtr += LineSkip;
        ZPtr += LineSkip;
        usZLevel = usZStartLevel;
        usZIndex = usZStartIndex;
        usZColsToGo = usZStartCols;
        remainingSkip = LeftSkip;
        remainingBlitLength = BlitLength;
        continue;
      }

      runLength = byte & 0x7f;
      isTransparent = Boolean(byte & 0x80);

      if (remainingSkip) {
        if (remainingSkip > runLength) {
          if (!isTransparent) {
            SrcPtr += runLength;
          }
          remainingSkip -= runLength;
          continue;
        }

        if (!isTransparent) {
          SrcPtr += remainingSkip;
        }
        runLength -= remainingSkip;
        remainingSkip = 0;
      }

      if (runLength > remainingBlitLength) {
        runLength = remainingBlitLength;
      }

      remainingBlitLength -= runLength;

      if (isTransparent) {
        while (runLength--) {
          DestPtr += 4;
          ZPtr += 4;
          if (--usZColsToGo === 0) {
            if (pZArray[usZIndex] < 0) {
              usZLevel -= Z_SUBLAYERS;
            } else if (pZArray[usZIndex] > 0) {
              usZLevel += Z_SUBLAYERS;
            }

            usZIndex++;
            usZColsToGo = 20;
          }
        }
      } else {
        while (runLength--) {
          byte = pPixData[SrcPtr++];

          if (getZValue(pZBuffer, ZPtr) <= usZLevel) {
            if (byte === 254) {
              color = Get16BPPColor(
                FROMRGB(
                  pBuffer[DestPtr],
                  pBuffer[DestPtr + 1],
                  pBuffer[DestPtr + 2],
                ),
              );
              rgb = GetRGBColor(ShadeTable[color]);
            } else {
              rgb = GetRGBColor(p16BPPPalette[byte]);
            }

            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xff;

            setZValue(pZBuffer, ZPtr, usZLevel);
          } else {
            DestPtr += 4;
          }

          ZPtr += 4;

          if (--usZColsToGo === 0) {
            if (pZArray[usZIndex] < 0) {
              usZLevel -= Z_SUBLAYERS;
            } else if (pZArray[usZIndex] > 0) {
              usZLevel += Z_SUBLAYERS;
            }

            usZIndex++;
            usZColsToGo = 20;
          }
        }
      }
    }

    return true;
  }

  function RenderRoomInfo(
    sStartPointX_M: INT16,
    sStartPointY_M: INT16,
    sStartPointX_S: INT16,
    sStartPointY_S: INT16,
    sEndXS: INT16,
    sEndYS: INT16,
  ): void {
    let bXOddFlag: boolean /* INT8 */ = false;
    let sAnchorPosX_M: INT16;
    let sAnchorPosY_M: INT16;
    let sAnchorPosX_S: INT16;
    let sAnchorPosY_S: INT16;
    let sTempPosX_M: INT16;
    let sTempPosY_M: INT16;
    let sTempPosX_S: INT16;
    let sTempPosY_S: INT16;
    let fEndRenderRow: boolean = false;
    let fEndRenderCol: boolean = false;
    let usTileIndex: UINT16;
    let sX: INT16;
    let sY: INT16;
    let uiDestPitchBYTES: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray;

    // Begin Render Loop
    sAnchorPosX_M = sStartPointX_M;
    sAnchorPosY_M = sStartPointY_M;
    sAnchorPosX_S = sStartPointX_S;
    sAnchorPosY_S = sStartPointY_S;

    pDestBuf = LockVideoSurface(
      FRAME_BUFFER,
      createPointer(
        () => uiDestPitchBYTES,
        (v) => (uiDestPitchBYTES = v),
      ),
    );

    do {
      fEndRenderRow = false;
      sTempPosX_M = sAnchorPosX_M;
      sTempPosY_M = sAnchorPosY_M;
      sTempPosX_S = sAnchorPosX_S;
      sTempPosY_S = sAnchorPosY_S;

      if (bXOddFlag) sTempPosX_S += 20;

      do {
        usTileIndex = FASTMAPROWCOLTOPOS(sTempPosY_M, sTempPosX_M);

        if (usTileIndex < GRIDSIZE) {
          sX = sTempPosX_S + Math.trunc(WORLD_TILE_X / 2) - 5;
          sY = sTempPosY_S + Math.trunc(WORLD_TILE_Y / 2) - 5;

          // THIS ROOM STUFF IS ONLY DONE IN THE EDITOR...
          // ADJUST BY SHEIGHT
          sY -= gpWorldLevelData[usTileIndex].sHeight;
          // sY += gsRenderHeight;

          if (gubWorldRoomInfo[usTileIndex] != NO_ROOM) {
            SetFont(SMALLCOMPFONT());
            SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, gsVIEWPORT_END_Y, false);
            switch (gubWorldRoomInfo[usTileIndex] % 5) {
              case 0:
                SetFontForeground(FONT_GRAY3);
                break;
              case 1:
                SetFontForeground(FONT_YELLOW);
                break;
              case 2:
                SetFontForeground(FONT_LTRED);
                break;
              case 3:
                SetFontForeground(FONT_LTBLUE);
                break;
              case 4:
                SetFontForeground(FONT_LTGREEN);
                break;
            }
            mprintf_buffer(
              pDestBuf,
              uiDestPitchBYTES,
              TINYFONT1(),
              sX,
              sY,
              "%d",
              gubWorldRoomInfo[usTileIndex],
            );
            SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
          }
        }

        sTempPosX_S += 40;
        sTempPosX_M++;
        sTempPosY_M--;

        if (sTempPosX_S >= sEndXS) {
          fEndRenderRow = true;
        }
      } while (!fEndRenderRow);

      if (bXOddFlag) {
        sAnchorPosY_M++;
      } else {
        sAnchorPosX_M++;
      }

      bXOddFlag = !bXOddFlag;
      sAnchorPosY_S += 10;

      if (sAnchorPosY_S >= sEndYS) {
        fEndRenderCol = true;
      }
    } while (!fEndRenderCol);

    UnLockVideoSurface(FRAME_BUFFER);
  }

  function ExamineZBufferRect(
    sLeft: INT16,
    sTop: INT16,
    sRight: INT16,
    sBottom: INT16,
  ): void {
    CalcRenderParameters(sLeft, sTop, sRight, sBottom);

    ExamineZBufferForHiddenTiles(
      gsStartPointX_M,
      gsStartPointY_M,
      gsStartPointX_S,
      gsStartPointY_S,
      gsEndXS,
      gsEndYS,
    );
  }

  function ExamineZBufferForHiddenTiles(
    sStartPointX_M: INT16,
    sStartPointY_M: INT16,
    sStartPointX_S: INT16,
    sStartPointY_S: INT16,
    sEndXS: INT16,
    sEndYS: INT16,
  ): void {
    let bXOddFlag: boolean /* INT8 */ = false;
    let sAnchorPosX_M: INT16;
    let sAnchorPosY_M: INT16;
    let sAnchorPosX_S: INT16;
    let sAnchorPosY_S: INT16;
    let sTempPosX_M: INT16;
    let sTempPosY_M: INT16;
    let sTempPosX_S: INT16;
    let sTempPosY_S: INT16;
    let fEndRenderRow: boolean = false;
    let fEndRenderCol: boolean = false;
    let usTileIndex: UINT16;
    let sX: INT16;
    let sY: INT16;
    let sWorldX: INT16;
    let sZLevel: INT16;
    let uiDestPitchBYTES: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray;
    let TileElem: TILE_ELEMENT;
    let bBlitClipVal: INT8;
    let pObject: LEVELNODE | null;

    // Begin Render Loop
    sAnchorPosX_M = sStartPointX_M;
    sAnchorPosY_M = sStartPointY_M;
    sAnchorPosX_S = sStartPointX_S;
    sAnchorPosY_S = sStartPointY_S;

    pDestBuf = LockVideoSurface(
      FRAME_BUFFER,
      createPointer(
        () => uiDestPitchBYTES,
        (v) => (uiDestPitchBYTES = v),
      ),
    );

    // Get VObject for firt land peice!
    TileElem = gTileDatabase[Enum312.FIRSTTEXTURE1];

    do {
      fEndRenderRow = false;
      sTempPosX_M = sAnchorPosX_M;
      sTempPosY_M = sAnchorPosY_M;
      sTempPosX_S = sAnchorPosX_S;
      sTempPosY_S = sAnchorPosY_S;

      if (bXOddFlag) sTempPosX_S += 20;

      do {
        usTileIndex = FASTMAPROWCOLTOPOS(sTempPosY_M, sTempPosX_M);

        if (usTileIndex < GRIDSIZE) {
          // ATE: Don;t let any vehicle sit here....
          if (FindStructure(usTileIndex, STRUCTURE_MOBILE)) {
            // Continue...
          } else {
            sX = sTempPosX_S;
            sY = sTempPosY_S - gpWorldLevelData[usTileIndex].sHeight;

            // Adjust for interface level
            sY += gsRenderHeight;

            // Caluluate zvalue
            // Look for anything less than struct layer!
            ({ sScreenX: sWorldX, sScreenY: sZLevel } =
              GetWorldXYAbsoluteScreenXY(sTempPosX_M, sTempPosY_M));

            sZLevel += gsRenderHeight;

            sZLevel = sZLevel * Z_SUBLAYERS + STRUCT_Z_LEVEL;

            if (
              gpWorldLevelData[usTileIndex].uiFlags &
              MAPELEMENT_REEVALUATE_REDUNDENCY
            ) {
              bBlitClipVal = BltIsClippedOrOffScreen(
                TileElem.hTileSurface,
                sX,
                sY,
                TileElem.usRegionIndex,
                gClippingRect,
              );

              if (bBlitClipVal == 0) {
                // Set flag to not evaluate again!
                gpWorldLevelData[usTileIndex].uiFlags &=
                  ~MAPELEMENT_REEVALUATE_REDUNDENCY;

                // OK, first do some rules with exceptions
                // Don't let this happen for roads!
                pObject = gpWorldLevelData[usTileIndex].pObjectHead;

                if (
                  IsTileRedundent(
                    gpZBuffer,
                    sZLevel,
                    TileElem.hTileSurface,
                    sX,
                    sY,
                    TileElem.usRegionIndex,
                  )
                ) {
                  // Mark in the world!
                  gpWorldLevelData[usTileIndex].uiFlags |= MAPELEMENT_REDUNDENT;
                } else {
                  // Un Mark in the world!
                  gpWorldLevelData[usTileIndex].uiFlags &=
                    ~MAPELEMENT_REDUNDENT;
                }
              }
            }
          }
        }

        sTempPosX_S += 40;
        sTempPosX_M++;
        sTempPosY_M--;

        if (sTempPosX_S >= sEndXS) {
          fEndRenderRow = true;
        }
      } while (!fEndRenderRow);

      if (bXOddFlag) {
        sAnchorPosY_M++;
      } else {
        sAnchorPosX_M++;
      }

      bXOddFlag = !bXOddFlag;
      sAnchorPosY_S += 10;

      if (sAnchorPosY_S >= sEndYS) {
        fEndRenderCol = true;
      }
    } while (!fEndRenderCol);

    UnLockVideoSurface(FRAME_BUFFER);
  }

  function CalcRenderParameters(
    sLeft: INT16,
    sTop: INT16,
    sRight: INT16,
    sBottom: INT16,
  ): void {
    let sTempPosX_W: INT16;
    let sTempPosY_W: INT16;
    let sRenderCenterX_W: INT16;
    let sRenderCenterY_W: INT16;
    let sOffsetX_W: INT16;
    let sOffsetY_W: INT16;
    let sOffsetX_S: INT16;
    let sOffsetY_S: INT16;

    copySGPRect(gOldClipRect, gClippingRect);

    // Set new clipped rect
    gClippingRect.iLeft = Math.max(gsVIEWPORT_START_X, sLeft);
    gClippingRect.iRight = Math.min(gsVIEWPORT_END_X, sRight);
    gClippingRect.iTop = Math.max(gsVIEWPORT_WINDOW_START_Y, sTop);
    gClippingRect.iBottom = Math.min(gsVIEWPORT_WINDOW_END_Y, sBottom);

    gsEndXS = sRight + VIEWPORT_XOFFSET_S;
    gsEndYS = sBottom + VIEWPORT_YOFFSET_S;

    sRenderCenterX_W = gsRenderCenterX;
    sRenderCenterY_W = gsRenderCenterY;

    // STEP THREE - determine starting point in world coords
    // a) Determine where in screen coords to start rendering
    gsStartPointX_S =
      Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) -
      (sLeft - VIEWPORT_XOFFSET_S);
    gsStartPointY_S =
      Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) -
      (sTop - VIEWPORT_YOFFSET_S);

    // b) Convert these distances into world distances
    ({ sCellX: sTempPosX_W, sCellY: sTempPosY_W } = FromScreenToCellCoordinates(
      gsStartPointX_S,
      gsStartPointY_S,
    ));

    // c) World start point is Render center minus this distance
    gsStartPointX_W = sRenderCenterX_W - sTempPosX_W;
    gsStartPointY_W = sRenderCenterY_W - sTempPosY_W;

    // NOTE: Increase X map value by 1 tile to offset where on screen we are...
    if (gsStartPointX_W > 0) gsStartPointX_W += CELL_X_SIZE;

    // d) screen start point is screen distances minus screen center
    gsStartPointX_S = sLeft - VIEWPORT_XOFFSET_S;
    gsStartPointY_S = sTop - VIEWPORT_YOFFSET_S;

    // STEP FOUR - Determine Start block
    // a) Find start block
    gsStartPointX_M = Math.trunc(gsStartPointX_W / CELL_X_SIZE);
    gsStartPointY_M = Math.trunc(gsStartPointY_W / CELL_Y_SIZE);

    // STEP 5 - Determine Deltas for center and find screen values
    // Make sure these coordinates are multiples of scroll steps
    sOffsetX_W =
      Math.abs(gsStartPointX_W) - Math.abs(gsStartPointX_M * CELL_X_SIZE);
    sOffsetY_W =
      Math.abs(gsStartPointY_W) - Math.abs(gsStartPointY_M * CELL_Y_SIZE);

    ({ sScreenX: sOffsetX_S, sScreenY: sOffsetY_S } =
      FromCellToScreenCoordinates(sOffsetX_W, sOffsetY_W));

    if (gsStartPointY_W < 0) {
      gsStartPointY_S += 0; //(sOffsetY_S/2);
    } else {
      gsStartPointY_S -= sOffsetY_S;
    }
    gsStartPointX_S -= sOffsetX_S;

    // Set globals for render offset
    if (gsRenderWorldOffsetX == -1) {
      gsRenderWorldOffsetX = sOffsetX_S;
    }

    if (gsRenderWorldOffsetY == -1) {
      gsRenderWorldOffsetY = sOffsetY_S;
    }

    /////////////////////////////////////////
    // ATE: CALCULATE LARGER OFFSET VALUES
    gsLEndXS = sRight + LARGER_VIEWPORT_XOFFSET_S;
    gsLEndYS = sBottom + LARGER_VIEWPORT_YOFFSET_S;

    // STEP THREE - determine starting point in world coords
    // a) Determine where in screen coords to start rendering
    gsLStartPointX_S =
      Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) -
      (sLeft - LARGER_VIEWPORT_XOFFSET_S);
    gsLStartPointY_S =
      Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) -
      (sTop - LARGER_VIEWPORT_YOFFSET_S);

    // b) Convert these distances into world distances
    ({ sCellX: sTempPosX_W, sCellY: sTempPosY_W } = FromScreenToCellCoordinates(
      gsLStartPointX_S,
      gsLStartPointY_S,
    ));

    // c) World start point is Render center minus this distance
    gsLStartPointX_W = sRenderCenterX_W - sTempPosX_W;
    gsLStartPointY_W = sRenderCenterY_W - sTempPosY_W;

    // NOTE: Increase X map value by 1 tile to offset where on screen we are...
    if (gsLStartPointX_W > 0) gsLStartPointX_W += CELL_X_SIZE;

    // d) screen start point is screen distances minus screen center
    gsLStartPointX_S = sLeft - LARGER_VIEWPORT_XOFFSET_S;
    gsLStartPointY_S = sTop - LARGER_VIEWPORT_YOFFSET_S;

    // STEP FOUR - Determine Start block
    // a) Find start block
    gsLStartPointX_M = Math.trunc(gsLStartPointX_W / CELL_X_SIZE);
    gsLStartPointY_M = Math.trunc(gsLStartPointY_W / CELL_Y_SIZE);

    // Adjust starting screen coordinates
    gsLStartPointX_S -= sOffsetX_S;

    if (gsLStartPointY_W < 0) {
      gsLStartPointY_S += 0;
      gsLStartPointX_S -= 20;
    } else {
      gsLStartPointY_S -= sOffsetY_S;
    }
  }

  function ResetRenderParameters(): void {
    // Restore clipping rect
    copySGPRect(gClippingRect, gOldClipRect);
  }

  function Zero8BPPDataTo16BPPBufferTransparent(
    pBuffer: Uint8ClampedArray,
    uiDestPitchBYTES: UINT32,
    hSrcVObject: SGPVObject,
    iX: INT32,
    iY: INT32,
    usIndex: UINT16,
  ): boolean {
    let uiOffset: UINT32;
    let usHeight: UINT32;
    let usWidth: UINT32;
    let SrcPtr: number;
    let DestPtr: number;
    let LineSkip: UINT32;
    let pTrav: ETRLEObject;
    let iTempX: INT32;
    let iTempY: INT32;

    // Assertions
    Assert(hSrcVObject != null);
    Assert(pBuffer != null);

    // Get Offsets from Index into structure
    pTrav = hSrcVObject.pETRLEObject[usIndex];
    usHeight = pTrav.usHeight;
    usWidth = pTrav.usWidth;
    uiOffset = pTrav.uiDataOffset;

    // Add to start position of dest buffer
    iTempX = iX + pTrav.sOffsetX;
    iTempY = iY + pTrav.sOffsetY;

    // Validations
    if (iTempX < 0) {
      return false;
    }
    if (iTempY < 0) {
      return false;
    }

    SrcPtr = uiOffset;
    DestPtr = uiDestPitchBYTES * iTempY + iTempX * 4;
    LineSkip = uiDestPitchBYTES - usWidth * 4;

    asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    xor eax, eax
    xor ebx, ebx
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    clc
    rcr cl, 1
    jnc BlitNTL2

    mov [edi], ax

    inc esi
    add edi, 2

    BlitNTL2:
    clc
    rcr cl, 1
    jnc BlitNTL3

    mov [edi], ax

    mov [edi+2], ax

    add esi, 2
    add edi, 4

    BlitNTL3:

    or cl, cl
    jz BlitDispatch

    xor ebx, ebx

    BlitNTL4:

    mov [edi], ax

    mov [edi+2], ax

    mov [edi+4], ax

    mov [edi+6], ax

    add esi, 4
    add edi, 8
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

    return true;
  }

  function IsTileRedundent(
    pZBuffer: Uint8ClampedArray,
    usZValue: UINT16,
    hSrcVObject: SGPVObject,
    iX: INT32,
    iY: INT32,
    usIndex: UINT16,
  ): boolean {
    let p16BPPPalette: Uint16Array;
    let uiOffset: UINT32;
    let usHeight: UINT32;
    let usWidth: UINT32;
    let SrcPtr: number;
    let ZPtr: number;
    let LineSkip: UINT32;
    let pTrav: ETRLEObject;
    let iTempX: INT32;
    let iTempY: INT32;
    let fHidden: boolean = true;

    // Assertions
    Assert(hSrcVObject != null);

    // Get Offsets from Index into structure
    pTrav = hSrcVObject.pETRLEObject[usIndex];
    usHeight = pTrav.usHeight;
    usWidth = pTrav.usWidth;
    uiOffset = pTrav.uiDataOffset;

    // Add to start position of dest buffer
    iTempX = iX + pTrav.sOffsetX;
    iTempY = iY + pTrav.sOffsetY;

    // Validations
    if (iTempX < 0) {
      return false;
    }
    if (iTempY < 0) {
      return false;
    }

    SrcPtr = uiOffset;
    ZPtr = 1280 * iTempY * 2 + iTempX * 4;
    p16BPPPalette = hSrcVObject.pShadeCurrent;
    LineSkip = 1280 * 2 - usWidth * 4;

    let pPixData = hSrcVObject.pPixData;
    let byte: number;
    let runLength: number;

    outer: while (usHeight) {
      byte = pPixData[SrcPtr++];
      if (byte === 0x00) {
        usHeight--;
        ZPtr += LineSkip;
        continue;
      }

      runLength = byte & 0x7f;

      if (byte & 0x80) {
        ZPtr += runLength * 4;
      } else {
        while (runLength--) {
          byte = pPixData[SrcPtr++];

          if (getZValue(pZBuffer, ZPtr) < usZValue) {
            fHidden = false;
            break outer;
          }

          ZPtr += 4;
        }
      }
    }

    return fHidden;
  }

  export function SetMercGlowFast(): void {
    // gpGlowFramePointer	= gsFastGlowFrames;
  }

  export function SetMercGlowNormal(): void {
    gpGlowFramePointer = gsGlowFrames;
  }

  export function SetRenderCenter(sNewX: INT16, sNewY: INT16): void {
    if (gfIgnoreScrolling == true) {
      return;
    }

    // Apply these new coordinates to the renderer!
    ApplyScrolling(sNewX, sNewY, true, false);

    // Set flag to ignore scrolling this frame
    gfIgnoreScrollDueToCenterAdjust = true;

    // Set full render flag!
    // DIRTY THE WORLD!
    SetRenderFlags(RENDER_FLAG_FULL);

    gfPlotNewMovement = true;

    if (gfScrollPending == true) {
      // Do a complete rebuild!
      gfScrollPending = false;

      // Restore Interface!
      RestoreInterface();

      // Delete Topmost blitters saved areas
      DeleteVideoOverlaysArea();
    }

    gfScrollInertia = 0;
  }
}
