namespace ja2 {
  const FULL_NAME_CURSOR_Y = LAPTOP_SCREEN_WEB_UL_Y + 138;
  const NICK_NAME_CURSOR_Y = LAPTOP_SCREEN_WEB_UL_Y + 195;
  const MALE_BOX_X = 2 + 192 + LAPTOP_SCREEN_UL_X;
  const MALE_BOX_Y = 254 + LAPTOP_SCREEN_WEB_UL_Y;
  const MALE_BOX_WIDTH = 24 - 2;
  const MALE_BOX_HEIGHT = 24 - 2;
  const FEMALE_BOX_X = 2 + 302 + LAPTOP_SCREEN_UL_X;
  const MAX_FULL_NAME = 29;
  const MAX_NICK_NAME = 8;
  const FULL_NAME_REGION_WIDTH = 230;
  const NICK_NAME_REGION_WIDTH = 100;

  // genders
  const enum Enum86 {
    IMP_FEMALE = 0,
    IMP_MALE,
  }

  // TextEnterMode .. whether user is entering full name or nick name, or gender selection
  const enum Enum87 {
    FULL_NAME_MODE,
    NICK_NAME_MODE,
    MALE_GENDER_SELECT,
    FEMALE_GENDER_SELECT,
  }

  // beginning character stats
  let pFullNameString: string /* CHAR16[128] */;
  let pNickNameString: string /* CHAR16[128] */;

  // positions in name strings
  let uiFullNameCharacterPosition: UINT32 = 0;
  let uiNickNameCharacterPosition: UINT32 = 0;

  // non gender
  let bGenderFlag: INT8 = -1;

  // IMP begin page buttons
  let giIMPBeginScreenButton: INT32[] /* [1] */ = createArray(1, 0);
  let giIMPBeginScreenButtonImage: INT32[] /* [1] */ = createArray(1, 0);

  // current mode of entering text we are in, ie FULL or Nick name?
  let ubTextEnterMode: UINT8 = 0;

  // cursor position
  let uiNickNameCursorPosition: UINT32 = 196 + LAPTOP_SCREEN_UL_X;
  let uiFullNameCursorPosition: UINT32 = 196 + LAPTOP_SCREEN_UL_X;

  // whther a new char has been entered ( to force redraw)
  let fNewCharInString: boolean = false;

  // mouse regions
  let gIMPBeginScreenMouseRegions: MOUSE_REGION[] /* [4] */ = createArrayFrom(
    4,
    createMouseRegion,
  );

  export function EnterIMPBeginScreen(): void {
    // reset all variables

    pFullNameString = "";
    pNickNameString = "";

    // if we are not restarting...then copy over name, set cursor and array positions
    if (iCurrentProfileMode != 0) {
      pFullNameString = pFullName;
      pNickNameString = pNickName;
      uiFullNameCharacterPosition = pFullNameString.length;
      uiNickNameCharacterPosition = pNickNameString.length;
      uiFullNameCursorPosition =
        196 +
        LAPTOP_SCREEN_UL_X +
        StringPixLength(pFullNameString, FONT14ARIAL());
      uiNickNameCursorPosition =
        196 +
        LAPTOP_SCREEN_UL_X +
        StringPixLength(pNickNameString, FONT14ARIAL());

      // set gender too
      bGenderFlag = Number(fCharacterIsMale);
    } else {
      uiNickNameCursorPosition = 196 + LAPTOP_SCREEN_UL_X;
      uiFullNameCursorPosition = 196 + LAPTOP_SCREEN_UL_X;
      uiFullNameCharacterPosition = 0;
      uiNickNameCharacterPosition = 0;
      bGenderFlag = -1;
    }

    ubTextEnterMode = 0;

    // draw name if any
    fNewCharInString = true;

    // render the screen on entry
    RenderIMPBeginScreen();

    if (fFinishedCharGeneration) {
      ubTextEnterMode = 5;
    } else {
      fFirstIMPAttribTime = true;
    }

    // create mouse regions
    CreateIMPBeginScreenMouseRegions();

    // create buttons needed for begin screen
    CreateIMPBeginScreenButtons();

    return;
  }

  export function RenderIMPBeginScreen(): void {
    // the background
    RenderProfileBackGround();

    // fourth button image 3X
    RenderButton4Image(64, 118);
    RenderButton4Image(64, 178);
    RenderButton4Image(64, 238);

    // the begin screen indents
    RenderBeginIndent(105, 58);

    // full name indent
    RenderNameIndent(194, 132);

    // nick name
    RenderNickNameIndent(194, 192);

    // gender indents
    RenderGenderIndent(192, 252);
    RenderGenderIndent(302, 252);

    // render warning string
    Print8CharacterOnlyString();

    // display player name
    DisplayPlayerFullNameString();
    DisplayPlayerNickNameString();
    RenderMaleGenderIcon();
    RenderFemaleGenderIcon();

    // the gender itself
    RenderGender();

    return;
  }

  export function ExitIMPBeginScreen(): void {
    // remove buttons
    RemoveIMPBeginScreenButtons();

    // remove mouse regions
    DestroyIMPBeginScreenMouseRegions();

    pFullName = pFullNameString;

    // is nick name too long?..shorten
    if (pNickNameString.length > 8) {
      // null out char 9
      pNickNameString = pNickNameString.substring(0, 8);
    }

    pNickName = pNickNameString;

    // set gender
    fCharacterIsMale = Boolean(bGenderFlag);

    return;
  }

  export function HandleIMPBeginScreen(): void {
    GetPlayerKeyBoardInputForIMPBeginScreen();

    // has a new char been added to activation string

    // render the cursor
    switch (ubTextEnterMode) {
      case Enum87.FULL_NAME_MODE:
        DisplayFullNameStringCursor();
        break;
      case Enum87.NICK_NAME_MODE:
        DisplayNickNameStringCursor();
        break;
      case Enum87.MALE_GENDER_SELECT:
        DisplayMaleGlowCursor();
        break;
      case Enum87.FEMALE_GENDER_SELECT:
        DisplayFemaleGlowCursor();
        break;
    }

    if (fNewCharInString) {
      // display strings
      DisplayPlayerFullNameString();
      DisplayPlayerNickNameString();
      RenderMaleGenderIcon();
      RenderFemaleGenderIcon();

      // the gender itself
      RenderGender();
    }

    return;
  }

  function CreateIMPBeginScreenButtons(): void {
    // this procedure will create the buttons needed for the IMP BeginScreen

    // ths done button
    giIMPBeginScreenButtonImage[0] = LoadButtonImage(
      "LAPTOP\\button_2.sti",
      -1,
      0,
      -1,
      1,
      -1,
    );
    /*	giIMPBeginScreenButton[0] = QuickCreateButton( giIMPBeginScreenButtonImage[0], LAPTOP_SCREEN_UL_X +  ( 134 ), LAPTOP_SCREEN_WEB_UL_Y + ( 314 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPBeginScreenDoneCallback);
    */

    giIMPBeginScreenButton[0] = CreateIconAndTextButton(
      giIMPBeginScreenButtonImage[0],
      pImpButtonText[6],
      FONT12ARIAL(),
      FONT_WHITE,
      DEFAULT_SHADOW,
      FONT_WHITE,
      DEFAULT_SHADOW,
      TEXT_CJUSTIFIED,
      LAPTOP_SCREEN_UL_X + 134,
      LAPTOP_SCREEN_WEB_UL_Y + 314,
      BUTTON_TOGGLE,
      MSYS_PRIORITY_HIGH,
      BtnGenericMouseMoveButtonCallback,
      BtnIMPBeginScreenDoneCallback,
    );

    SetButtonCursor(giIMPBeginScreenButton[0], Enum317.CURSOR_WWW);
    return;
  }

  function RemoveIMPBeginScreenButtons(): void {
    // this procedure will destroy the already created buttosn for the IMP BeginScreen

    // the done button
    RemoveButton(giIMPBeginScreenButton[0]);
    UnloadButtonImage(giIMPBeginScreenButtonImage[0]);

    return;
  }

  function BtnIMPBeginScreenDoneCallback(btn: GUI_BUTTON, reason: INT32): void {
    // easter egg check
    let fEggOnYouFace: boolean = false;

    // btn callback for IMP Begin Screen done button
    if (!(btn.uiFlags & BUTTON_ENABLED)) return;

    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.uiFlags |= BUTTON_CLICKED_ON;
    } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      if (btn.uiFlags & BUTTON_CLICKED_ON) {
        btn.uiFlags &= ~BUTTON_CLICKED_ON;

        if (fFinishedCharGeneration) {
          // simply reviewing name and gender, exit to finish page
          iCurrentImpPage = Enum71.IMP_FINISH;
          fButtonPendingFlag = true;
          return;
        } else {
          if (CheckCharacterInputForEgg()) {
            fEggOnYouFace = true;
          }
        }

        // back to mainpage

        // check to see if a name has been selected, if not, do not allow player to proceed with more char generation
        if (
          pFullNameString != "" &&
          pFullNameString[0] != " " &&
          bGenderFlag != -1
        ) {
          // valid full name, check to see if nick name
          if (pNickNameString == "" || pNickNameString[0] == " ") {
            // no nick name
            // copy first name to nick name
            CopyFirstNameIntoNickName();
          }
          // ok, now set back to main page, and set the fact we have completed part 1
          if (iCurrentProfileMode < 1 && bGenderFlag != -1) {
            iCurrentProfileMode = 1;
          } else if (bGenderFlag == -1) {
            iCurrentProfileMode = 0;
          }

          // no easter egg?...then proceed along
          if (fEggOnYouFace == false) {
            iCurrentImpPage = Enum71.IMP_MAIN_PAGE;
            fButtonPendingFlag = true;
          }
        } else {
          // invalid name, reset current mode
          DoLapTopMessageBox(
            Enum24.MSG_BOX_IMP_STYLE,
            pImpPopUpStrings[2],
            Enum26.LAPTOP_SCREEN,
            MSG_BOX_FLAG_OK,
            null,
          );
          iCurrentProfileMode = 0;
        }
      }
    }
  }

  function GetPlayerKeyBoardInputForIMPBeginScreen(): void {
    let InputEvent: InputAtom = createInputAtom();
    let MousePos: POINT = createPoint();

    // get the current curosr position, might just need it.
    GetCursorPos(MousePos);

    // handle input events
    while (DequeueEvent(InputEvent)) {
      /*
           // HOOK INTO MOUSE HOOKS
switch(InputEvent.usEvent)
           {

        case LEFT_BUTTON_DOWN:
                     MouseSystemHook(LEFT_BUTTON_DOWN, (INT16)MousePos.x, (INT16)MousePos.y,_LeftButtonDown, _RightButtonDown);
              break;
              case LEFT_BUTTON_UP:
                      MouseSystemHook(LEFT_BUTTON_UP, (INT16)MousePos.x, (INT16)MousePos.y ,_LeftButtonDown, _RightButtonDown);
              break;
              case RIGHT_BUTTON_DOWN:
                    MouseSystemHook(RIGHT_BUTTON_DOWN, (INT16)MousePos.x, (INT16)MousePos.y,_LeftButtonDown, _RightButtonDown);
              break;
              case RIGHT_BUTTON_UP:
                      MouseSystemHook(RIGHT_BUTTON_UP, (INT16)MousePos.x, (INT16)MousePos.y,_LeftButtonDown, _RightButtonDown);
              break;
           }
           */
      if (
        !HandleTextInput(InputEvent) &&
        (InputEvent.usEvent == KEY_DOWN || InputEvent.usEvent == KEY_REPEAT)
      ) {
        switch (InputEvent.usParam) {
          case ENTER:
            // check to see if gender was highlighted..if so, select it
            if (Enum87.FEMALE_GENDER_SELECT == ubTextEnterMode) {
              bGenderFlag = Enum86.IMP_FEMALE;
            } else if (Enum87.MALE_GENDER_SELECT == ubTextEnterMode) {
              bGenderFlag = Enum86.IMP_MALE;
            }

            // increment to next selection box
            IncrementTextEnterMode();
            fNewCharInString = true;
            break;
          case SPACE:
            // handle space bar
            if (Enum87.FEMALE_GENDER_SELECT == ubTextEnterMode) {
              bGenderFlag = Enum86.IMP_FEMALE;
              DecrementTextEnterMode();
            } else if (Enum87.MALE_GENDER_SELECT == ubTextEnterMode) {
              bGenderFlag = Enum86.IMP_MALE;
              IncrementTextEnterMode();
            } else {
              HandleBeginScreenTextEvent(InputEvent.usParam);
            }
            fNewCharInString = true;
            break;
          case ESC:
            LeaveLapTopScreen();
            break;
          case TAB:
            // tab hit, increment to next selection box
            IncrementTextEnterMode();
            fNewCharInString = true;
            break;
          case 265:
            // tab and shift
            DecrementTextEnterMode();
            fNewCharInString = true;
            break;
          default:
            HandleBeginScreenTextEvent(InputEvent.usParam);
            break;
        }
      }
    }
    return;
  }

  function HandleBeginScreenTextEvent(uiKey: UINT32): void {
    // this function checks to see if a letter or a backspace was pressed, if so, either put char to screen
    // or delete it

    switch (uiKey) {
      case BACKSPACE:
        switch (ubTextEnterMode) {
          case Enum87.FULL_NAME_MODE:
            if (uiFullNameCharacterPosition >= 0) {
              // decrement StringPosition
              if (uiFullNameCharacterPosition > 0) {
                uiFullNameCharacterPosition -= 1;
              }

              // null out char
              pFullNameString = pFullNameString.substring(
                0,
                uiFullNameCharacterPosition,
              );

              // move cursor back by sizeof char
              uiFullNameCursorPosition =
                196 +
                LAPTOP_SCREEN_UL_X +
                StringPixLength(pFullNameString, FONT14ARIAL());

              // string has been altered, redisplay
              fNewCharInString = true;
            }
            break;
          case Enum87.NICK_NAME_MODE:
            if (uiNickNameCharacterPosition >= 0) {
              // decrement StringPosition
              if (uiNickNameCharacterPosition > 0)
                uiNickNameCharacterPosition -= 1;

              // null out char
              pNickNameString = pNickNameString.substring(
                0,
                uiNickNameCharacterPosition,
              );

              // move cursor back by sizeof char
              uiNickNameCursorPosition =
                196 +
                LAPTOP_SCREEN_UL_X +
                StringPixLength(pNickNameString, FONT14ARIAL());

              // string has been altered, redisplay
              fNewCharInString = true;
            }

            break;
        }
        break;

      default:
        if (
          (uiKey >= "A".charCodeAt(0) && uiKey <= "Z".charCodeAt(0)) ||
          (uiKey >= "a".charCodeAt(0) && uiKey <= "z".charCodeAt(0)) ||
          (uiKey >= "0".charCodeAt(0) && uiKey <= "9".charCodeAt(0)) ||
          uiKey == "_".charCodeAt(0) ||
          uiKey == ".".charCodeAt(0) ||
          uiKey == " ".charCodeAt(0)
        ) {
          // if the current string position is at max or great, do nothing
          switch (ubTextEnterMode) {
            case Enum87.FULL_NAME_MODE:
              if (uiFullNameCharacterPosition >= MAX_FULL_NAME) {
                break;
              } else {
                if (uiFullNameCharacterPosition < 1) {
                  uiFullNameCharacterPosition = 0;
                }
                // make sure we haven't moved too far
                if (
                  uiFullNameCursorPosition +
                    StringPixLength(String.fromCharCode(uiKey), FONT14ARIAL()) >
                  FULL_NAME_REGION_WIDTH + 196 + LAPTOP_SCREEN_UL_X
                ) {
                  // do nothing for now, when pop up is in place, display
                  break;
                }
                // valid char, capture and convert to CHAR16
                pFullNameString += String.fromCharCode(uiKey);

                // move cursor position ahead
                uiFullNameCursorPosition =
                  196 +
                  LAPTOP_SCREEN_UL_X +
                  StringPixLength(pFullNameString, FONT14ARIAL());

                // increment string position
                uiFullNameCharacterPosition += 1;

                // string has been altered, redisplay
                fNewCharInString = true;
              }
              break;
            case Enum87.NICK_NAME_MODE:
              if (uiNickNameCharacterPosition >= MAX_NICK_NAME) {
                break;
              } else {
                if (uiNickNameCharacterPosition == -1) {
                  uiNickNameCharacterPosition = 0;
                }

                // make sure we haven't moved too far
                if (
                  uiNickNameCursorPosition +
                    StringPixLength(String.fromCharCode(uiKey), FONT14ARIAL()) >
                  NICK_NAME_REGION_WIDTH + 196 + LAPTOP_SCREEN_UL_X
                ) {
                  // do nothing for now, when pop up is in place, display
                  break;
                }

                // valid char, capture and convert to CHAR16
                pNickNameString += String.fromCharCode(uiKey);

                // move cursor position ahead
                uiNickNameCursorPosition =
                  196 +
                  LAPTOP_SCREEN_UL_X +
                  StringPixLength(pNickNameString, FONT14ARIAL());

                // increment string position
                uiNickNameCharacterPosition += 1;

                // string has been altered, redisplay
                fNewCharInString = true;
              }

              break;
          }
        }
        break;
    }
    return;
  }

  /* static */ let DisplayFullNameStringCursor__uiBaseTime: UINT32 = 0;
  /* static */ let DisplayFullNameStringCursor__iCurrentState: UINT32 = 0;
  /* static */ let DisplayFullNameStringCursor__fIncrement: boolean = true;
  function DisplayFullNameStringCursor(): void {
    // this procdure will draw the activation string cursor on the screen at position cursorx cursory
    let uiDestPitchBYTES: UINT32 = 0;
    let uiDeltaTime: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray;

    if (DisplayFullNameStringCursor__uiBaseTime == 0) {
      DisplayFullNameStringCursor__uiBaseTime = GetJA2Clock();
    }

    // get difference
    uiDeltaTime = GetJA2Clock() - DisplayFullNameStringCursor__uiBaseTime;

    // if difference is long enough, rotate colors
    if (uiDeltaTime > MIN_GLOW_DELTA) {
      if (DisplayFullNameStringCursor__iCurrentState == 10) {
        // start rotating downward
        DisplayFullNameStringCursor__fIncrement = false;
      }
      if (DisplayFullNameStringCursor__iCurrentState == 0) {
        // rotate colors upward
        DisplayFullNameStringCursor__fIncrement = true;
      }
      // if increment upward, increment iCurrentState
      if (DisplayFullNameStringCursor__fIncrement) {
        DisplayFullNameStringCursor__iCurrentState++;
      } else {
        // else downwards
        DisplayFullNameStringCursor__iCurrentState--;
      }
      // reset basetime to current clock
      DisplayFullNameStringCursor__uiBaseTime = GetJA2Clock();
    }

    pDestBuf = LockVideoSurface(
      FRAME_BUFFER,
      createPointer(
        () => uiDestPitchBYTES,
        (v) => (uiDestPitchBYTES = v),
      ),
    );
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

    // draw line in current state
    LineDraw(
      true,
      uiFullNameCursorPosition,
      FULL_NAME_CURSOR_Y - 3,
      uiFullNameCursorPosition,
      FULL_NAME_CURSOR_Y + CURSOR_HEIGHT() - 2,
      Get16BPPColor(
        FROMRGB(
          GlowColorsList[DisplayFullNameStringCursor__iCurrentState][0],
          GlowColorsList[DisplayFullNameStringCursor__iCurrentState][1],
          GlowColorsList[DisplayFullNameStringCursor__iCurrentState][2],
        ),
      ),
      pDestBuf,
    );

    InvalidateRegion(
      uiFullNameCursorPosition,
      FULL_NAME_CURSOR_Y - 3,
      uiFullNameCursorPosition + 1,
      FULL_NAME_CURSOR_Y + CURSOR_HEIGHT() + 1 - 2,
    );

    // unlock frame buffer
    UnLockVideoSurface(FRAME_BUFFER);
    return;
  }

  /* static */ let DisplayNickNameStringCursor__uiBaseTime: UINT32 = 0;
  /* static */ let DisplayNickNameStringCursor__iCurrentState: UINT32 = 0;
  /* static */ let DisplayNickNameStringCursor__fIncrement: boolean = true;
  function DisplayNickNameStringCursor(): void {
    // this procdure will draw the activation string cursor on the screen at position cursorx cursory
    let uiDestPitchBYTES: UINT32 = 0;
    let uiDeltaTime: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray;

    if (DisplayNickNameStringCursor__uiBaseTime == 0) {
      DisplayNickNameStringCursor__uiBaseTime = GetJA2Clock();
    }

    // get difference
    uiDeltaTime = GetJA2Clock() - DisplayNickNameStringCursor__uiBaseTime;

    // if difference is long enough, rotate colors
    if (uiDeltaTime > MIN_GLOW_DELTA) {
      if (DisplayNickNameStringCursor__iCurrentState == 10) {
        // start rotating downward
        DisplayNickNameStringCursor__fIncrement = false;
      }
      if (DisplayNickNameStringCursor__iCurrentState == 0) {
        // rotate colors upward
        DisplayNickNameStringCursor__fIncrement = true;
      }
      // if increment upward, increment iCurrentState
      if (DisplayNickNameStringCursor__fIncrement) {
        DisplayNickNameStringCursor__iCurrentState++;
      } else {
        // else downwards
        DisplayNickNameStringCursor__iCurrentState--;
      }
      // reset basetime to current clock
      DisplayNickNameStringCursor__uiBaseTime = GetJA2Clock();
    }

    pDestBuf = LockVideoSurface(
      FRAME_BUFFER,
      createPointer(
        () => uiDestPitchBYTES,
        (v) => (uiDestPitchBYTES = v),
      ),
    );
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

    // draw line in current state
    LineDraw(
      true,
      uiNickNameCursorPosition,
      NICK_NAME_CURSOR_Y,
      uiNickNameCursorPosition,
      NICK_NAME_CURSOR_Y + CURSOR_HEIGHT(),
      Get16BPPColor(
        FROMRGB(
          GlowColorsList[DisplayNickNameStringCursor__iCurrentState][0],
          GlowColorsList[DisplayNickNameStringCursor__iCurrentState][1],
          GlowColorsList[DisplayNickNameStringCursor__iCurrentState][2],
        ),
      ),
      pDestBuf,
    );

    InvalidateRegion(
      uiNickNameCursorPosition,
      NICK_NAME_CURSOR_Y,
      uiNickNameCursorPosition + 1,
      NICK_NAME_CURSOR_Y + CURSOR_HEIGHT() + 1,
    );

    // unlock frame buffer
    UnLockVideoSurface(FRAME_BUFFER);
    return;
  }

  function DisplayPlayerFullNameString(): void {
    // this function will grab the string that the player will enter for activation
    let iCounter: INT32 = 0;

    // player gone too far, move back
    if (uiFullNameCharacterPosition > MAX_FULL_NAME) {
      uiFullNameCharacterPosition = MAX_FULL_NAME;
    }

    // restore background
    RenderNameIndent(194, 132);

    // setup the font stuff
    SetFont(FONT14ARIAL());
    SetFontForeground(184);
    SetFontBackground(FONT_BLACK);

    // reset shadow
    SetFontShadow(DEFAULT_SHADOW);
    mprintf(LAPTOP_SCREEN_UL_X + 196, FULL_NAME_CURSOR_Y + 1, pFullNameString);

    fNewCharInString = false;
    fReDrawScreenFlag = true;
    return;
  }

  function DisplayPlayerNickNameString(): void {
    // this function will grab the string that the player will enter for activation
    let iCounter: INT32 = 0;

    // player gone too far, move back
    if (uiNickNameCharacterPosition > MAX_NICK_NAME) {
      uiNickNameCharacterPosition = MAX_NICK_NAME;
    }

    // restore background
    RenderNickNameIndent(194, 192);

    // setup the font stuff
    SetFont(FONT14ARIAL());
    SetFontForeground(184);
    SetFontBackground(FONT_BLACK);

    // reset shadow
    SetFontShadow(DEFAULT_SHADOW);
    mprintf(LAPTOP_SCREEN_UL_X + 196, NICK_NAME_CURSOR_Y + 4, pNickNameString);

    fNewCharInString = false;
    fReDrawScreenFlag = true;
    return;
  }

  /* static */ let DisplayMaleGlowCursor__uiBaseTime: UINT32 = 0;
  /* static */ let DisplayMaleGlowCursor__iCurrentState: UINT32 = 0;
  /* static */ let DisplayMaleGlowCursor__fIncrement: boolean = true;
  function DisplayMaleGlowCursor(): void {
    // this procdure will draw the activation string cursor on the screen at position cursorx cursory
    let uiDestPitchBYTES: UINT32 = 0;
    let uiDeltaTime: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray;

    if (DisplayMaleGlowCursor__uiBaseTime == 0) {
      DisplayMaleGlowCursor__uiBaseTime = GetJA2Clock();
    }

    // get difference
    uiDeltaTime = GetJA2Clock() - DisplayMaleGlowCursor__uiBaseTime;

    // if difference is long enough, rotate colors
    if (uiDeltaTime > MIN_GLOW_DELTA) {
      if (DisplayMaleGlowCursor__iCurrentState == 10) {
        // start rotating downward
        DisplayMaleGlowCursor__fIncrement = false;
      }
      if (DisplayMaleGlowCursor__iCurrentState == 0) {
        // rotate colors upward
        DisplayMaleGlowCursor__fIncrement = true;
      }
      // if increment upward, increment iCurrentState
      if (DisplayMaleGlowCursor__fIncrement) {
        DisplayMaleGlowCursor__iCurrentState++;
      } else {
        // else downwards
        DisplayMaleGlowCursor__iCurrentState--;
      }
      // reset basetime to current clock
      DisplayMaleGlowCursor__uiBaseTime = GetJA2Clock();
    }

    pDestBuf = LockVideoSurface(
      FRAME_BUFFER,
      createPointer(
        () => uiDestPitchBYTES,
        (v) => (uiDestPitchBYTES = v),
      ),
    );
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

    // draw rectangle
    RectangleDraw(
      true,
      MALE_BOX_X,
      MALE_BOX_Y,
      MALE_BOX_X + MALE_BOX_WIDTH,
      MALE_BOX_Y + MALE_BOX_HEIGHT,
      Get16BPPColor(
        FROMRGB(
          GlowColorsList[DisplayMaleGlowCursor__iCurrentState][0],
          GlowColorsList[DisplayMaleGlowCursor__iCurrentState][1],
          GlowColorsList[DisplayMaleGlowCursor__iCurrentState][2],
        ),
      ),
      pDestBuf,
    );

    InvalidateRegion(
      MALE_BOX_X,
      MALE_BOX_Y,
      MALE_BOX_X + MALE_BOX_WIDTH + 1,
      MALE_BOX_Y + MALE_BOX_HEIGHT + 1,
    );

    // unlock frame buffer
    UnLockVideoSurface(FRAME_BUFFER);
    return;
  }

  /* static */ let DisplayFemaleGlowCursor__uiBaseTime: UINT32 = 0;
  /* static */ let DisplayFemaleGlowCursor__iCurrentState: UINT32 = 0;
  /* static */ let DisplayFemaleGlowCursor__fIncrement: boolean = true;
  function DisplayFemaleGlowCursor(): void {
    // this procdure will draw the activation string cursor on the screen at position cursorx cursory
    let uiDestPitchBYTES: UINT32 = 0;
    let uiDeltaTime: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray;

    if (DisplayFemaleGlowCursor__uiBaseTime == 0) {
      DisplayFemaleGlowCursor__uiBaseTime = GetJA2Clock();
    }

    // get difference
    uiDeltaTime = GetJA2Clock() - DisplayFemaleGlowCursor__uiBaseTime;

    // if difference is long enough, rotate colors
    if (uiDeltaTime > MIN_GLOW_DELTA) {
      if (DisplayFemaleGlowCursor__iCurrentState == 10) {
        // start rotating downward
        DisplayFemaleGlowCursor__fIncrement = false;
      }
      if (DisplayFemaleGlowCursor__iCurrentState == 0) {
        // rotate colors upward
        DisplayFemaleGlowCursor__fIncrement = true;
      }
      // if increment upward, increment iCurrentState
      if (DisplayFemaleGlowCursor__fIncrement) {
        DisplayFemaleGlowCursor__iCurrentState++;
      } else {
        // else downwards
        DisplayFemaleGlowCursor__iCurrentState--;
      }
      // reset basetime to current clock
      DisplayFemaleGlowCursor__uiBaseTime = GetJA2Clock();
    }

    pDestBuf = LockVideoSurface(
      FRAME_BUFFER,
      createPointer(
        () => uiDestPitchBYTES,
        (v) => (uiDestPitchBYTES = v),
      ),
    );
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

    // draw rectangle
    RectangleDraw(
      true,
      FEMALE_BOX_X,
      MALE_BOX_Y,
      FEMALE_BOX_X + MALE_BOX_WIDTH,
      MALE_BOX_Y + MALE_BOX_HEIGHT,
      Get16BPPColor(
        FROMRGB(
          GlowColorsList[DisplayFemaleGlowCursor__iCurrentState][0],
          GlowColorsList[DisplayFemaleGlowCursor__iCurrentState][1],
          GlowColorsList[DisplayFemaleGlowCursor__iCurrentState][2],
        ),
      ),
      pDestBuf,
    );

    InvalidateRegion(
      FEMALE_BOX_X,
      MALE_BOX_Y,
      FEMALE_BOX_X + MALE_BOX_WIDTH + 1,
      MALE_BOX_Y + MALE_BOX_HEIGHT + 1,
    );

    // unlock frame buffer
    UnLockVideoSurface(FRAME_BUFFER);
    return;
  }

  function CopyFirstNameIntoNickName(): void {
    // this procedure will copy the characters first name in to the nickname for the character
    let iCounter: UINT32 = 0;
    pNickNameString = "";
    while (
      pFullNameString[iCounter] != " " &&
      iCounter < 20 &&
      pFullNameString.length < iCounter
    ) {
      // copy charcters into nick name
      pNickNameString += pFullNameString[iCounter];
      iCounter++;
    }

    return;
  }

  function IncrementTextEnterMode(): void {
    // this function will incrment which text enter mode we are in, FULLname, NICKname, IMP_MALE or IMP_FEMALE

    // if at IMP_FEMALE gender selection, reset to full name
    if (Enum87.FEMALE_GENDER_SELECT == ubTextEnterMode) {
      ubTextEnterMode = Enum87.FULL_NAME_MODE;
    } else {
      // otherwise, next selection
      ubTextEnterMode++;
    }
  }

  function DecrementTextEnterMode(): void {
    // this function will incrment which text enter mode we are in, FULLname, NICKname, IMP_MALE or IMP_FEMALE

    // if at IMP_FEMALE gender selection, reset to full name
    if (Enum87.FULL_NAME_MODE == ubTextEnterMode) {
      ubTextEnterMode = Enum87.FEMALE_GENDER_SELECT;
    } else {
      // otherwise, next selection
      ubTextEnterMode--;
    }
  }

  function RenderMaleGenderIcon(): void {
    // this function displays a filled box in the IMP_MALE gender box if IMP_MALE has been selected

    // re render indent
    RenderGenderIndent(192, 252);

    // IMP_MALE selected draw box
    if (bGenderFlag == Enum86.IMP_MALE) {
    }
  }

  function RenderFemaleGenderIcon(): void {
    // this function displays a filled box in the IMP_MALE gender box if IMP_MALE has been selected

    // re render indent
    RenderGenderIndent(302, 252);

    // IMP_FEMALE selected draw box
    if (bGenderFlag == Enum86.IMP_FEMALE) {
    }
  }

  // mouse regions

  function CreateIMPBeginScreenMouseRegions(): void {
    // this function creates the IMP mouse regions

    // are we only reviewing text?.. if so, do not create regions
    if (ubTextEnterMode == 5) return;

    // full name region
    MSYS_DefineRegion(
      gIMPBeginScreenMouseRegions[0],
      LAPTOP_SCREEN_UL_X + 196,
      LAPTOP_SCREEN_WEB_UL_Y + 135,
      LAPTOP_SCREEN_UL_X + 196 + FULL_NAME_REGION_WIDTH,
      LAPTOP_SCREEN_WEB_UL_Y + 135 + 24,
      MSYS_PRIORITY_HIGH,
      Enum317.CURSOR_WWW,
      MSYS_NO_CALLBACK,
      SelectFullNameRegionCallBack,
    );

    // nick name region
    MSYS_DefineRegion(
      gIMPBeginScreenMouseRegions[1],
      LAPTOP_SCREEN_UL_X + 196,
      LAPTOP_SCREEN_WEB_UL_Y + 195,
      LAPTOP_SCREEN_UL_X + 196 + NICK_NAME_REGION_WIDTH,
      LAPTOP_SCREEN_WEB_UL_Y + 195 + 24,
      MSYS_PRIORITY_HIGH,
      Enum317.CURSOR_WWW,
      MSYS_NO_CALLBACK,
      SelectNickNameRegionCallBack,
    );

    // IMP_MALE gender area
    MSYS_DefineRegion(
      gIMPBeginScreenMouseRegions[2],
      MALE_BOX_X,
      MALE_BOX_Y,
      MALE_BOX_X + MALE_BOX_WIDTH,
      MALE_BOX_Y + MALE_BOX_HEIGHT,
      MSYS_PRIORITY_HIGH,
      Enum317.CURSOR_WWW,
      MvtOnMaleRegionCallBack,
      SelectMaleRegionCallBack,
    );

    // IMP_FEMALE gender region
    MSYS_DefineRegion(
      gIMPBeginScreenMouseRegions[3],
      FEMALE_BOX_X,
      MALE_BOX_Y,
      FEMALE_BOX_X + MALE_BOX_WIDTH,
      MALE_BOX_Y + MALE_BOX_HEIGHT,
      MSYS_PRIORITY_HIGH,
      Enum317.CURSOR_WWW,
      MvtOnFemaleRegionCallBack,
      SelectFemaleRegionCallBack,
    );

    // add regions
    MSYS_AddRegion(gIMPBeginScreenMouseRegions[0]);
    MSYS_AddRegion(gIMPBeginScreenMouseRegions[1]);
    MSYS_AddRegion(gIMPBeginScreenMouseRegions[2]);
    MSYS_AddRegion(gIMPBeginScreenMouseRegions[3]);

    return;
  }

  function DestroyIMPBeginScreenMouseRegions(): void {
    // this function destroys the IMP mouse regions

    // are we only reviewing text?.. if so, do not remove regions
    if (ubTextEnterMode == 5) return;

    // remove regions
    MSYS_RemoveRegion(gIMPBeginScreenMouseRegions[0]);
    MSYS_RemoveRegion(gIMPBeginScreenMouseRegions[1]);
    MSYS_RemoveRegion(gIMPBeginScreenMouseRegions[2]);
    MSYS_RemoveRegion(gIMPBeginScreenMouseRegions[3]);

    return;
  }

  function SelectFullNameRegionCallBack(
    pRegion: MOUSE_REGION,
    iReason: INT32,
  ): void {
    if (iReason & MSYS_CALLBACK_REASON_INIT) {
    } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      // set current mode to full name type in mode
      ubTextEnterMode = Enum87.FULL_NAME_MODE;
      fNewCharInString = true;
    } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    }
  }

  function SelectNickNameRegionCallBack(
    pRegion: MOUSE_REGION,
    iReason: INT32,
  ): void {
    if (iReason & MSYS_CALLBACK_REASON_INIT) {
    } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      // set mode to nick name type in
      ubTextEnterMode = Enum87.NICK_NAME_MODE;
      fNewCharInString = true;
    } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    }
  }

  function SelectMaleRegionCallBack(
    pRegion: MOUSE_REGION,
    iReason: INT32,
  ): void {
    if (iReason & MSYS_CALLBACK_REASON_INIT) {
    } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      // set mode to nick name type in
      bGenderFlag = Enum86.IMP_MALE;
      fNewCharInString = true;
    } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    }
  }

  function SelectFemaleRegionCallBack(
    pRegion: MOUSE_REGION,
    iReason: INT32,
  ): void {
    if (iReason & MSYS_CALLBACK_REASON_INIT) {
    } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      // set mode to nick name type in
      bGenderFlag = Enum86.IMP_FEMALE;
      fNewCharInString = true;
    } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    }
  }

  function MvtOnFemaleRegionCallBack(
    pRegion: MOUSE_REGION,
    iReason: INT32,
  ): void {
    if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      // fNewCharInString = TRUE;
    } else if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
      ubTextEnterMode = Enum87.FEMALE_GENDER_SELECT;
      fNewCharInString = true;
    }
  }

  function MvtOnMaleRegionCallBack(
    pRegion: MOUSE_REGION,
    iReason: INT32,
  ): void {
    if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      // fNewCharInString = TRUE;
    } else if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
      ubTextEnterMode = Enum87.MALE_GENDER_SELECT;
      fNewCharInString = true;
    }
  }

  function RenderGender(): void {
    // this procedure will render the gender of the character int he appropriate box

    // check to see if gender has been in fact set
    if (bGenderFlag == -1) {
      // nope, leave
      return;
    }

    SetFontBackground(FONT_BLACK);
    SetFontForeground(184);
    if (bGenderFlag == Enum86.IMP_MALE) {
      // IMP_MALE, render x in IMP_MALE box
      mprintf(MALE_BOX_X + 9, MALE_BOX_Y + 6, "X");
    } else {
      // IMP_FEMALE, render x in IMP_FEMALE box
      mprintf(FEMALE_BOX_X + 9, MALE_BOX_Y + 6, "X");
    }
  }

  function Print8CharacterOnlyString(): void {
    SetFontBackground(FONT_BLACK);
    SetFontForeground(FONT_BLACK);
    SetFont(FONT12ARIAL());
    SetFontShadow(NO_SHADOW);

    mprintf(430, LAPTOP_SCREEN_WEB_DELTA_Y + 228, pIMPBeginScreenStrings[0]);

    // reset shadow
    SetFontShadow(DEFAULT_SHADOW);
  }

  function CheckCharacterInputForEgg(): boolean {
    let HireMercStruct: MERC_HIRE_STRUCT = createMercHireStruct();

    return false;
    if (pFullNameString == "Test Female" && pNickNameString == "Test") {
      pFullNameString = "Test Female";
      pNickNameString = "Test";
      bGenderFlag = Enum86.IMP_FEMALE;
      iHealth = 55;
      iAgility = 55;
      iStrength = 55;
      iDexterity = 55;
      iWisdom = 55;
      iLeadership = 55;

      iMarksmanship = 55;
      iMechanical = 55;
      iExplosives = 55;
      iMedical = 55;

      iSkillA = 0;
      iSkillB = 0;

      iPersonality = Enum270.NO_PERSONALITYTRAIT;
      iAttitude = Enum271.ATT_LONER;
      iCurrentImpPage = Enum71.IMP_FINISH;
      LaptopSaveInfo.iVoiceId = 1;
      iPortraitNumber = 5;
      return true;
    }
    return false;
  }
}
