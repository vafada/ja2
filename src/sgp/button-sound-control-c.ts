namespace ja2 {
  export function SpecifyButtonSoundScheme(
    iButtonID: INT32,
    bSoundScheme: INT8,
  ): void {
    ButtonList[iButtonID].ubSoundSchemeID = bSoundScheme;
    if (bSoundScheme == Enum27.BUTTON_SOUND_SCHEME_GENERIC) {
      switch (guiCurrentScreen) {
        case ScreenIds.MAINMENU_SCREEN:
        case ScreenIds.OPTIONS_SCREEN:
        case ScreenIds.LOADSAVE_SCREEN:
        case ScreenIds.SAVE_LOAD_SCREEN:
        case ScreenIds.INIT_SCREEN:
          ButtonList[iButtonID].ubSoundSchemeID =
            Enum27.BUTTON_SOUND_SCHEME_BIGSWITCH3;
          break;

        case ScreenIds.LAPTOP_SCREEN:
          ButtonList[iButtonID].ubSoundSchemeID =
            Enum27.BUTTON_SOUND_SCHEME_COMPUTERBEEP2;
          break;

        case ScreenIds.AUTORESOLVE_SCREEN:
        case ScreenIds.MAP_SCREEN:
        case ScreenIds.GAME_SCREEN:
        case ScreenIds.SHOPKEEPER_SCREEN:
          ButtonList[iButtonID].ubSoundSchemeID =
            Enum27.BUTTON_SOUND_SCHEME_SMALLSWITCH2;
          break;

        case ScreenIds.GAME_INIT_OPTIONS_SCREEN:
          ButtonList[iButtonID].ubSoundSchemeID =
            Enum27.BUTTON_SOUND_SCHEME_VERYSMALLSWITCH2;
          break;

        // Anything not handled gets NO sound.
        // SHOPKEEPER_SCREEN,
        // GAME_SCREEN,
        // MSG_BOX_SCREEN,

        // ERROR_SCREEN,
        // ANIEDIT_SCREEN,
        // PALEDIT_SCREEN,
        // DEBUG_SCREEN,
        // SEX_SCREEN,
      }
      if (bSoundScheme == Enum27.BUTTON_SOUND_SCHEME_GENERIC)
        bSoundScheme = Enum27.BUTTON_SOUND_SCHEME_NONE;
    }
  }

  export function PlayButtonSound(iButtonID: INT32, iSoundType: INT32): void {
    if (ButtonList[iButtonID] == null) {
      return;
    }

    switch (ButtonList[iButtonID].ubSoundSchemeID) {
      case Enum27.BUTTON_SOUND_SCHEME_NONE:
      case Enum27.BUTTON_SOUND_SCHEME_GENERIC:
        break;

      case Enum27.BUTTON_SOUND_SCHEME_VERYSMALLSWITCH1:
        switch (iSoundType) {
          case BUTTON_SOUND_CLICKED_ON:
            PlayJA2Sample(Enum330.VSM_SWITCH1_IN, RATE_11025, 15, 1, MIDDLEPAN);
            break;
          case BUTTON_SOUND_CLICKED_OFF:
            PlayJA2Sample(
              Enum330.VSM_SWITCH1_OUT,
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
          case BUTTON_SOUND_DISABLED_CLICK:
            PlayJA2SampleFromFile(
              "Sounds\\Disabled Button.wav",
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
        }
        break;
      case Enum27.BUTTON_SOUND_SCHEME_VERYSMALLSWITCH2:
        switch (iSoundType) {
          case BUTTON_SOUND_CLICKED_ON:
            PlayJA2Sample(Enum330.VSM_SWITCH2_IN, RATE_11025, 15, 1, MIDDLEPAN);
            break;
          case BUTTON_SOUND_CLICKED_OFF:
            PlayJA2Sample(
              Enum330.VSM_SWITCH2_OUT,
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
          case BUTTON_SOUND_DISABLED_CLICK:
            PlayJA2SampleFromFile(
              "Sounds\\Disabled Button.wav",
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
        }
        break;
      case Enum27.BUTTON_SOUND_SCHEME_SMALLSWITCH1:
        switch (iSoundType) {
          case BUTTON_SOUND_CLICKED_ON:
            PlayJA2Sample(Enum330.SM_SWITCH1_IN, RATE_11025, 15, 1, MIDDLEPAN);
            break;
          case BUTTON_SOUND_CLICKED_OFF:
            PlayJA2Sample(Enum330.SM_SWITCH1_OUT, RATE_11025, 15, 1, MIDDLEPAN);
            break;
          case BUTTON_SOUND_DISABLED_CLICK:
            PlayJA2SampleFromFile(
              "Sounds\\Disabled Button.wav",
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
        }
        break;
      case Enum27.BUTTON_SOUND_SCHEME_SMALLSWITCH2:
        switch (iSoundType) {
          case BUTTON_SOUND_CLICKED_ON:
            PlayJA2Sample(Enum330.SM_SWITCH2_IN, RATE_11025, 15, 1, MIDDLEPAN);
            break;
          case BUTTON_SOUND_CLICKED_OFF:
            PlayJA2Sample(Enum330.SM_SWITCH2_OUT, RATE_11025, 15, 1, MIDDLEPAN);
            break;
          case BUTTON_SOUND_DISABLED_CLICK:
            PlayJA2SampleFromFile(
              "Sounds\\Disabled Button.wav",
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
        }
        break;
      case Enum27.BUTTON_SOUND_SCHEME_SMALLSWITCH3:
        switch (iSoundType) {
          case BUTTON_SOUND_CLICKED_ON:
            PlayJA2Sample(Enum330.SM_SWITCH3_IN, RATE_11025, 15, 1, MIDDLEPAN);
            break;
          case BUTTON_SOUND_CLICKED_OFF:
            PlayJA2Sample(Enum330.SM_SWITCH3_OUT, RATE_11025, 15, 1, MIDDLEPAN);
            break;
          case BUTTON_SOUND_DISABLED_CLICK:
            PlayJA2SampleFromFile(
              "Sounds\\Disabled Button.wav",
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
        }
        break;
      case Enum27.BUTTON_SOUND_SCHEME_BIGSWITCH3:
        switch (iSoundType) {
          case BUTTON_SOUND_CLICKED_ON:
            PlayJA2Sample(Enum330.BIG_SWITCH3_IN, RATE_11025, 15, 1, MIDDLEPAN);
            break;
          case BUTTON_SOUND_CLICKED_OFF:
            PlayJA2Sample(
              Enum330.BIG_SWITCH3_OUT,
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
          case BUTTON_SOUND_DISABLED_CLICK:
            PlayJA2SampleFromFile(
              "Sounds\\Disabled Button.wav",
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
        }
        break;
      case Enum27.BUTTON_SOUND_SCHEME_COMPUTERBEEP2:
        switch (iSoundType) {
          case BUTTON_SOUND_CLICKED_ON:
            PlayJA2Sample(
              Enum330.COMPUTER_BEEP2_IN,
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
          case BUTTON_SOUND_CLICKED_OFF:
            PlayJA2Sample(
              Enum330.COMPUTER_BEEP2_OUT,
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
          case BUTTON_SOUND_DISABLED_CLICK:
            PlayJA2SampleFromFile(
              "Sounds\\Disabled Button.wav",
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
        }
        break;
      case Enum27.BUTTON_SOUND_SCHEME_COMPUTERSWITCH1:
        switch (iSoundType) {
          case BUTTON_SOUND_CLICKED_ON:
            PlayJA2Sample(
              Enum330.COMPUTER_SWITCH1_IN,
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
          case BUTTON_SOUND_CLICKED_OFF:
            PlayJA2Sample(
              Enum330.COMPUTER_SWITCH1_OUT,
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
          case BUTTON_SOUND_DISABLED_CLICK:
            PlayJA2SampleFromFile(
              "Sounds\\Disabled Button.wav",
              RATE_11025,
              15,
              1,
              MIDDLEPAN,
            );
            break;
        }
        break;
    }
  }
}
