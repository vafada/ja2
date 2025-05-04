namespace ja2 {

export const DEFAULT_SHADOW = 2;
export const MILITARY_SHADOW = 67;
export const NO_SHADOW = 0;

// these are bogus! No palette is set yet!
// font foreground color symbols
export const FONT_FCOLOR_WHITE = 208;
const FONT_FCOLOR_RED = 162;
export const FONT_FCOLOR_NICERED = 164;
const FONT_FCOLOR_BLUE = 203;
const FONT_FCOLOR_GREEN = 184;
const FONT_FCOLOR_YELLOW = 144;
const FONT_FCOLOR_BROWN = 184;
const FONT_FCOLOR_ORANGE = 76;
const FONT_FCOLOR_PURPLE = 160;

// font background color symbols
const FONT_BCOLOR_WHITE = 208;
const FONT_BCOLOR_RED = 162;
const FONT_BCOLOR_BLUE = 203;
const FONT_BCOLOR_GREEN = 184;
const FONT_BCOLOR_YELLOW = 144;
const FONT_BCOLOR_BROWN = 80;
const FONT_BCOLOR_ORANGE = 76;
const FONT_BCOLOR_PURPLE = 160;

// typedefs

export interface FontTranslationTable {
  usNumberOfSymbols: UINT16;
  DynamicArrayOf16BitValues: Uint16Array /* Pointer<UINT16> */;
}

export function createFontTranslationTable(): FontTranslationTable {
  return {
    usNumberOfSymbols: 0,
    DynamicArrayOf16BitValues: <Uint16Array><unknown>null,
  };
}

// functions


// extern FontBase *LoadFontFile(UINT8 *pFileName);
// extern UINT8    *GetFontPalette(UINT8 *pFileName);
// extern UINT16    GetMaxFontWidth(FontBase *pBase);
// extern void      UnloadFont(FontBase *pBase);
// extern BOOLEAN   SetFontPalette(FontBase *pFont, UINT16 siDepthPix, SGPPaletteEntry *pNewPalette);
// make sure the pFontString is terminated by 0
// extern BOOLEAN   PrintFontString(UINT16 *pFontString, UINT8 *pDestBuffer, UINT16 siDestWidth, UINT16 siDestPixelDepth, UINT16 siDestPitch, UINT16 siDestHeight, UINT16 siX, UINT16 siY, UINT16 siTotalWidth, UINT16 siTotalHeight, BOOLEAN MultiLine, FontBase *pFontBase);
// extern BOOLEAN   SetFont16BitData(FontBase *pFontBase, UINT16 *pData16);

}
