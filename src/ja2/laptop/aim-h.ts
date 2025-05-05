namespace ja2 {
  //
  // AIM defines
  //

  export const AIMHISTORYFILE = "BINARYDATA\\AimHist.edt";
  export const AIM_HISTORY_LINE_SIZE = 400 * 2;

  export const MAX_NUMBER_MERCS = 40;

  export const NUM_AIM_SCREENS = 6;

  export const IMAGE_OFFSET_X = LAPTOP_SCREEN_UL_X; // 111
  export const IMAGE_OFFSET_Y = LAPTOP_SCREEN_WEB_UL_Y; // 24

  export const AIM_LOGO_TEXT_X = 175;
  export const AIM_LOGO_TEXT_Y = 77 + LAPTOP_SCREEN_WEB_DELTA_Y + 4;
  export const AIM_LOGO_TEXT_WIDTH = 360;

  // Aim Symbol 203, 51
  const AIM_SYMBOL_SIZE_X = 203;
  export const AIM_SYMBOL_SIZE_Y = 51;

  // 262, 28
  export const AIM_SYMBOL_X = IMAGE_OFFSET_X + 149;
  export const AIM_SYMBOL_Y = IMAGE_OFFSET_Y + 3;
  export const AIM_SYMBOL_WIDTH = 203;
  export const AIM_SYMBOL_HEIGHT = 51;

  // RustBackGround
  export const RUSTBACKGROUND_SIZE_X = 125;
  export const RUSTBACKGROUND_SIZE_Y = 100;

  export const RUSTBACKGROUND_1_X = IMAGE_OFFSET_X;
  export const RUSTBACKGROUND_1_Y = IMAGE_OFFSET_Y;

  // Bottom Buttons
  export const NUM_AIM_BOTTOMBUTTONS = 6;
  export const BOTTOM_BUTTON_START_WIDTH = 75;
  export const BOTTOM_BUTTON_START_HEIGHT = 18;
  export const BOTTOM_BUTTON_START_X = LAPTOP_SCREEN_UL_X + 25;
  export const BOTTOM_BUTTON_START_Y =
    LAPTOP_SCREEN_WEB_LR_Y - BOTTOM_BUTTON_START_HEIGHT - 3;
  export const BOTTOM_BUTTON_AMOUNT = NUM_AIM_SCREENS;
  const BOTTOM_BUTTON_GAP = 0;
  const BOTTOM_BUTTON_TEXT_Y = BOTTOM_BUTTON_START_Y + 6;
  export const BOTTOM_BUTTON_END_X =
    BOTTOM_BUTTON_START_X + BOTTOM_BUTTON_START_WIDTH * 6;
  export const BOTTOM_BUTTON_END_Y =
    BOTTOM_BUTTON_START_Y + BOTTOM_BUTTON_START_HEIGHT;

  const AIM_FONT10ROMAN = () => FONT10ROMAN();
  const AIM_FONT12ROMAN = () => FONT12ROMAN();
  const AIM_FONT14SANSERIF = () => FONT14SANSERIF();
  export const AIM_LOGO_FONT = () => FONT10ARIAL();
  export const AIM_COPYRIGHT_FONT = () => FONT10ARIAL();
  export const AIM_WARNING_FONT = () => FONT12ARIAL();
  export const AIM_FONT12ARIAL = () => FONT12ARIAL();
  export const AIM_FONT_MCOLOR_WHITE = FONT_MCOLOR_WHITE;
  const AIM_FONT_MCOLOR_DKRED = FONT_MCOLOR_RED;
  export const AIM_GREEN = 157;
  export const AIM_MAINTITLE_COLOR = AIM_GREEN;
  export const AIM_MAINTITLE_FONT = () => FONT14ARIAL();
  export const AIM_BUTTON_ON_COLOR = FONT_MCOLOR_DKWHITE;
  export const AIM_BUTTON_OFF_COLOR = 138;
  const AIM_BUTTON_DISABLED_COLOR = 141;
  export const AIM_CONTENTBUTTON_WIDTH = 205;
  export const AIM_CONTENTBUTTON_HEIGHT = 19;
  export const AIM_FONT_GOLD = 170;

  export const enum Enum63 {
    AIM_SLOGAN,
    AIM_WARNING_1,
    AIM_WARNING_2,
    AIM_COPYRIGHT_1,
    AIM_COPYRIGHT_2,
    AIM_COPYRIGHT_3,
  }
}
