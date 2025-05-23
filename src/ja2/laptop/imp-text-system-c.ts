namespace ja2 {
  const IMP_SEEK_AMOUNT = 5 * 80 * 2;

  const IMP_LEFT_IDENT_TEXT_X = 116;
  const IMP_RIGHT_IDENT_TEXT_X = 509;
  const IMP_IDENT_WIDTH = 96;

  let fInitialized: boolean = false;

  let iIMPTextRecordLengths: INT32[] /* [300] */ = createArray(300, 0);

  // the length of persona questions
  let iIMPQuestionLengths: INT32[] /* [25] */ = [
    7, 5, 5, 6, 5, 6, 5, 5, 5, 5, 6, 9, 5, 5, 5, 5, 5, 5, 5, 5, 7, 10, 6, 5, 5,
  ];

  const QTN_FIRST_COLUMN_X = 80;
  const QTN_SECOND_COLUMN_X = 320;

  function LoadAndDisplayIMPText(
    sStartX: INT16,
    sStartY: INT16,
    sLineLength: INT16,
    sIMPTextRecordNumber: INT16,
    uiFont: UINT32,
    ubColor: UINT8,
    fShadow: boolean,
    uiFlags: UINT32,
  ): void {
    // this procedure will load and display to the screen starting at postion X, Y relative to the start of the laptop screen
    // it will access record sIMPTextRecordNumber and go until all records following it but before the next IMP record are displayed in font uiFont
    let sString: string /* CHAR16[1024] */;
    let iCounter: INT32 = 0;
    let fNotDonePrintingFlag: boolean = true;
    let iRecordPosition: INT32 = 0;

    if (fShadow == false) {
      // don't want shadow, remove it
      SetFontShadow(NO_SHADOW);
    }

    // load the string
    sString = LoadEncryptedDataFromFile(
      "BINARYDATA\\IMPText.EDT",
      sIMPTextRecordNumber * IMP_SEEK_AMOUNT,
      IMP_SEEK_AMOUNT,
    );

    if (uiFlags == 0) {
      uiFlags = LEFT_JUSTIFIED;
    }

    DisplayWrappedString(
      sStartX,
      sStartY,
      sLineLength,
      2,
      uiFont,
      ubColor,
      sString,
      FONT_BLACK,
      false,
      uiFlags,
    );

    // reset shadow
    SetFontShadow(DEFAULT_SHADOW);
  }

  function InitializeImpRecordLengthList(): void {
    // this procedure will setup the IMP records length list with the appropriate values

    return;
  }

  export function PrintImpText(): void {
    let sWidth: INT16 = LAPTOP_SCREEN_LR_X - LAPTOP_SCREEN_UL_X + 1;

    // looks at current page and prints text needed
    switch (iCurrentImpPage) {
      case Enum71.IMP_HOME_PAGE:
        // the imp homepage
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_DELTA_Y + 43,
          sWidth,
          Enum88.IMP_HOME_1,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_DELTA_Y + 60,
          sWidth,
          Enum88.IMP_HOME_2,
          FONT10ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_DELTA_Y + 208,
          sWidth,
          Enum88.IMP_HOME_3,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          IMP_LEFT_IDENT_TEXT_X,
          LAPTOP_SCREEN_WEB_DELTA_Y + 99,
          IMP_IDENT_WIDTH,
          Enum88.IMP_HOME_7,
          FONT10ARIAL(),
          142,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          IMP_RIGHT_IDENT_TEXT_X,
          LAPTOP_SCREEN_WEB_DELTA_Y + 99,
          IMP_IDENT_WIDTH,
          Enum88.IMP_HOME_8,
          FONT10ARIAL(),
          142,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          258,
          LAPTOP_SCREEN_WEB_DELTA_Y + 362,
          640,
          Enum88.IMP_HOME_5,
          FONT14ARIAL(),
          FONT_BLACK,
          false,
          0,
        );
        LoadAndDisplayIMPText(
          IMP_LEFT_IDENT_TEXT_X,
          LAPTOP_SCREEN_WEB_DELTA_Y + 188,
          IMP_IDENT_WIDTH,
          Enum88.IMP_HOME_9,
          FONT10ARIAL(),
          142,
          true,
          RIGHT_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          IMP_RIGHT_IDENT_TEXT_X,
          LAPTOP_SCREEN_WEB_DELTA_Y + 188,
          IMP_IDENT_WIDTH,
          Enum88.IMP_HOME_10,
          FONT10ARIAL(),
          142,
          true,
          RIGHT_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_DELTA_Y + 402,
          sWidth,
          Enum88.IMP_HOME_6,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );

        break;
      case Enum71.IMP_ABOUT_US:
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 17,
          LAPTOP_SCREEN_WEB_UL_Y + 137,
          640,
          Enum88.IMP_ABOUT_US_1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 25,
          LAPTOP_SCREEN_WEB_UL_Y + 154,
          337 - 124,
          Enum88.IMP_ABOUT_US_2,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 25,
          LAPTOP_SCREEN_WEB_UL_Y + 235,
          337 - 124,
          Enum88.IMP_ABOUT_US_3,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 17,
          LAPTOP_SCREEN_WEB_UL_Y + 260,
          640,
          Enum88.IMP_ABOUT_US_10,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 25,
          LAPTOP_SCREEN_WEB_UL_Y + 280,
          337 - 124,
          Enum88.IMP_ABOUT_US_4,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 267,
          LAPTOP_SCREEN_WEB_UL_Y + 137,
          640,
          Enum88.IMP_ABOUT_US_11,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 275,
          LAPTOP_SCREEN_WEB_UL_Y + 154,
          337 - 129,
          Enum88.IMP_ABOUT_US_5,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 267,
          LAPTOP_SCREEN_WEB_UL_Y + 227,
          640,
          Enum88.IMP_ABOUT_US_8,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 275,
          LAPTOP_SCREEN_WEB_UL_Y + 247,
          337 - 129,
          Enum88.IMP_ABOUT_US_6,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 267,
          LAPTOP_SCREEN_WEB_UL_Y + 277,
          640,
          Enum88.IMP_ABOUT_US_9,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 275,
          LAPTOP_SCREEN_WEB_UL_Y + 297,
          337 - 129,
          Enum88.IMP_ABOUT_US_7,
          FONT10ARIAL(),
          142,
          true,
          0,
        );

        break;
      case Enum71.IMP_MAIN_PAGE:
        // title
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 19,
          sWidth,
          Enum88.IMP_MAIN_1,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );

        // set up for IMP text for title box area
        switch (iCurrentProfileMode) {
          case 0:
            LoadAndDisplayIMPText(
              LAPTOP_SCREEN_UL_X + 173,
              LAPTOP_SCREEN_WEB_UL_Y + 91,
              329 - 173,
              Enum88.IMP_MAIN_2,
              FONT10ARIAL(),
              142,
              true,
              0,
            );
            break;
          case 1:
            IanDisplayWrappedString(
              LAPTOP_SCREEN_UL_X + 173,
              LAPTOP_SCREEN_WEB_UL_Y + 91,
              329 - 173,
              2,
              FONT10ARIAL(),
              142,
              pExtraIMPStrings[0],
              0,
              false,
              0,
            );
            break;
          case 2:
            IanDisplayWrappedString(
              LAPTOP_SCREEN_UL_X + 173,
              LAPTOP_SCREEN_WEB_UL_Y + 91,
              329 - 173,
              2,
              FONT10ARIAL(),
              142,
              pExtraIMPStrings[1],
              0,
              false,
              0,
            );
            break;
          case 3:
            IanDisplayWrappedString(
              LAPTOP_SCREEN_UL_X + 173,
              LAPTOP_SCREEN_WEB_UL_Y + 91,
              329 - 173,
              2,
              FONT10ARIAL(),
              142,
              pExtraIMPStrings[2],
              0,
              false,
              0,
            );
            break;
          case 4:
            IanDisplayWrappedString(
              LAPTOP_SCREEN_UL_X + 173,
              LAPTOP_SCREEN_WEB_UL_Y + 91,
              329 - 173,
              2,
              FONT10ARIAL(),
              142,
              pExtraIMPStrings[3],
              0,
              false,
              0,
            );
            break;
        }

        break;
      case Enum71.IMP_BEGIN:
        // title
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 7,
          sWidth,
          Enum88.IMP_BEGIN_1,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 105,
          LAPTOP_SCREEN_WEB_UL_Y + 67,
          390 - 105,
          Enum88.IMP_BEGIN_2,
          FONT10ARIAL(),
          142,
          true,
          CENTER_JUSTIFIED,
        );

        // fullname
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 81,
          LAPTOP_SCREEN_WEB_UL_Y + 139,
          640,
          Enum88.IMP_BEGIN_3,
          FONT14ARIAL(),
          FONT_BLACK,
          false,
          0,
        );

        // nick name
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 81,
          LAPTOP_SCREEN_WEB_UL_Y + 199,
          640,
          Enum88.IMP_BEGIN_4,
          FONT14ARIAL(),
          FONT_BLACK,
          false,
          0,
        );

        // gender
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 81,
          LAPTOP_SCREEN_WEB_UL_Y + 259,
          640,
          Enum88.IMP_BEGIN_6,
          FONT14ARIAL(),
          FONT_BLACK,
          false,
          0,
        );

        // male
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 240,
          LAPTOP_SCREEN_WEB_UL_Y + 259,
          640,
          Enum88.IMP_BEGIN_10,
          FONT14ARIAL(),
          FONT_BLACK,
          false,
          0,
        );

        // female
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 360,
          LAPTOP_SCREEN_WEB_UL_Y + 259,
          640,
          Enum88.IMP_BEGIN_11,
          FONT14ARIAL(),
          FONT_BLACK,
          false,
          0,
        );

        break;
      case Enum71.IMP_PERSONALITY:
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 130,
          LAPTOP_SCREEN_WEB_UL_Y + 60,
          456 - 200,
          Enum88.IMP_PERS_1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 130,
          LAPTOP_SCREEN_WEB_UL_Y + 130,
          456 - 200,
          Enum88.IMP_PERS_2,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 7,
          sWidth,
          Enum88.IMP_PERS_6,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );

        break;
      case Enum71.IMP_PERSONALITY_QUIZ:
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 5,
          sWidth,
          Enum88.IMP_PERS_6,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 293,
          LAPTOP_SCREEN_WEB_UL_Y + 370,
          456 - 200,
          Enum88.IMP_PERS_11,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 363,
          LAPTOP_SCREEN_WEB_UL_Y + 370,
          456 - 200,
          Enum88.IMP_PERS_12,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          0,
        );

        // print the question and suitable answers
        PrintIMPPersonalityQuizQuestionAndAnsers();

        break;
      case Enum71.IMP_PERSONALITY_FINISH:
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 7,
          sWidth,
          Enum88.IMP_PERS_6,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        switch (bPersonalityEndState) {
          case 0:
            LoadAndDisplayIMPText(
              LAPTOP_SCREEN_UL_X + 125,
              LAPTOP_SCREEN_WEB_UL_Y + 100,
              356 - 100,
              Enum88.IMP_PERS_F1,
              FONT14ARIAL(),
              FONT_WHITE,
              true,
              CENTER_JUSTIFIED,
            );
            break;
          case 1:
            LoadAndDisplayIMPText(
              LAPTOP_SCREEN_UL_X + 125,
              LAPTOP_SCREEN_WEB_UL_Y + 100,
              356 - 100,
              Enum88.IMP_PERS_F4,
              FONT14ARIAL(),
              FONT_WHITE,
              true,
              CENTER_JUSTIFIED,
            );
            break;
          case 2:
            LoadAndDisplayIMPText(
              LAPTOP_SCREEN_UL_X + 125,
              LAPTOP_SCREEN_WEB_UL_Y + 100,
              356 - 100,
              Enum88.IMP_PERS_F5,
              FONT14ARIAL(),
              FONT_WHITE,
              true,
              CENTER_JUSTIFIED,
            );
            break;
        }
        break;
      case Enum71.IMP_ATTRIBUTE_ENTRANCE:
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 7,
          sWidth,
          Enum88.IMP_ATTRIB_1 - 1,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 110,
          LAPTOP_SCREEN_WEB_UL_Y + 50,
          300,
          Enum88.IMP_ATTRIB_5,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 110,
          LAPTOP_SCREEN_WEB_UL_Y + 130,
          300,
          Enum88.IMP_ATTRIB_6,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 110,
          LAPTOP_SCREEN_WEB_UL_Y + 200,
          300,
          Enum88.IMP_ATTRIB_7,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );

        break;
      case Enum71.IMP_ATTRIBUTE_PAGE:
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 7,
          sWidth,
          Enum88.IMP_ATTRIB_1 - 1,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );

        // don't blit bonus if reviewing
        if (fReviewStats != true) {
          LoadAndDisplayIMPText(
            LAPTOP_SCREEN_UL_X + 355,
            LAPTOP_SCREEN_WEB_UL_Y + 51,
            640,
            Enum88.IMP_ATTRIB_SA_2 - 1,
            FONT12ARIAL(),
            FONT_WHITE,
            true,
            0,
          );
          LoadAndDisplayIMPText(
            LAPTOP_SCREEN_UL_X + 56,
            LAPTOP_SCREEN_WEB_UL_Y + 33,
            240,
            Enum88.IMP_ATTRIB_SA_15,
            FONT10ARIAL(),
            FONT_WHITE,
            true,
            0,
          );
        } else {
          LoadAndDisplayIMPText(
            LAPTOP_SCREEN_UL_X + 56,
            LAPTOP_SCREEN_WEB_UL_Y + 33,
            240,
            Enum88.IMP_ATTRIB_SA_18,
            FONT10ARIAL(),
            FONT_WHITE,
            true,
            0,
          );
        }
        // stats
        // health
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 60,
          LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + 0 * SKILL_SLIDE_HEIGHT,
          100,
          Enum88.IMP_ATTRIB_SA_6 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          RIGHT_JUSTIFIED,
        );
        // dex
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 60,
          LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + 1 * SKILL_SLIDE_HEIGHT,
          100,
          Enum88.IMP_ATTRIB_SA_8 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          RIGHT_JUSTIFIED,
        );
        // agili
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 60,
          LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + 2 * SKILL_SLIDE_HEIGHT,
          100,
          Enum88.IMP_ATTRIB_SA_7 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          RIGHT_JUSTIFIED,
        );
        // str
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 60,
          LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + 3 * SKILL_SLIDE_HEIGHT,
          100,
          Enum88.IMP_ATTRIB_SA_9 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          RIGHT_JUSTIFIED,
        );
        // wisdom
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 60,
          LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + 4 * SKILL_SLIDE_HEIGHT,
          100,
          Enum88.IMP_ATTRIB_SA_11 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          RIGHT_JUSTIFIED,
        );
        // lead
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 60,
          LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + 5 * SKILL_SLIDE_HEIGHT,
          100,
          Enum88.IMP_ATTRIB_SA_10 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          RIGHT_JUSTIFIED,
        );
        // marks
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 60,
          LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + 6 * SKILL_SLIDE_HEIGHT,
          100,
          Enum88.IMP_ATTRIB_SA_12 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          RIGHT_JUSTIFIED,
        );
        // med
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 60,
          LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + 7 * SKILL_SLIDE_HEIGHT,
          100,
          Enum88.IMP_ATTRIB_SA_14 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          RIGHT_JUSTIFIED,
        );
        // expl
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 60,
          LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + 8 * SKILL_SLIDE_HEIGHT,
          100,
          Enum88.IMP_ATTRIB_SA_15 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          RIGHT_JUSTIFIED,
        );
        // mech
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 60,
          LAPTOP_SCREEN_WEB_UL_Y + SKILL_SLIDE_START_Y + 9 * SKILL_SLIDE_HEIGHT,
          100,
          Enum88.IMP_ATTRIB_SA_13 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          RIGHT_JUSTIFIED,
        );

        // should we display zero warning or nowmal ' come on herc..' text

        break;
      case Enum71.IMP_ATTRIBUTE_FINISH:
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 7,
          sWidth,
          Enum88.IMP_ATTRIB_1 - 1,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );

        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 125,
          LAPTOP_SCREEN_WEB_UL_Y + 100,
          356 - 100,
          Enum88.IMP_AF_2 - 1,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );

        break;
      case Enum71.IMP_PORTRAIT:
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 7,
          sWidth,
          Enum88.IMP_POR_1 - 1,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 135,
          LAPTOP_SCREEN_WEB_UL_Y + 68,
          240,
          Enum88.IMP_POR_2 - 1,
          FONT10ARIAL(),
          142,
          true,
          0,
        );

        break;
      case Enum71.IMP_VOICE:
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 7,
          sWidth,
          Enum88.IMP_VOC_1 - 1,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 135,
          LAPTOP_SCREEN_WEB_UL_Y + 70,
          240,
          Enum88.IMP_VOC_2 - 1,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        break;
      case Enum71.IMP_FINISH:
        // LoadAndDisplayIMPText( LAPTOP_SCREEN_UL_X + 160, LAPTOP_SCREEN_WEB_UL_Y + 7, ( 640  ), IMP_FIN_1 - 1, FONT14ARIAL, FONT_WHITE, TRUE, 0);
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 150,
          LAPTOP_SCREEN_WEB_UL_Y + 55,
          200,
          Enum88.IMP_FIN_2 - 1,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          0,
        );
        break;
      case Enum71.IMP_CONFIRM:
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X,
          LAPTOP_SCREEN_WEB_UL_Y + 7,
          sWidth,
          Enum88.IMP_CON_1,
          FONT14ARIAL(),
          FONT_WHITE,
          true,
          CENTER_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 160,
          LAPTOP_SCREEN_WEB_UL_Y + 60,
          200,
          Enum88.IMP_CON_2,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 160,
          LAPTOP_SCREEN_WEB_UL_Y + 145,
          200,
          Enum88.IMP_CON_3,
          FONT12ARIAL(),
          FONT_WHITE,
          true,
          0,
        );

        break;
    }
  }

  function PrintImpTextPostButtonRender(): void {
    // prints any text after IMP buttons have been rendered
    switch (iCurrentImpPage) {
      case Enum71.IMP_HOME_PAGE:
        // about us button
        break;
    }
  }

  export function PrintIMPPersonalityQuizQuestionAndAnsers(): void {
    let iCounter: INT32 = 0;
    let iOffset: INT32 = 0;

    if (giCurrentPersonalityQuizQuestion < 0) {
      return;
    }

    // how far into text is the question?
    for (
      iCounter = 0;
      iCounter < giCurrentPersonalityQuizQuestion;
      iCounter++
    ) {
      // incrment until question is found
      iOffset += iIMPQuestionLengths[iCounter];
    }

    // handle any female specifc questions
    if (fCharacterIsMale == false) {
      iOffset = OffSetQuestionForFemaleSpecificQuestions(iOffset);
    }

    // how many answers are there?
    switch (iIMPQuestionLengths[giCurrentPersonalityQuizQuestion]) {
      case 5:
        // 4 answers, write down the side, extra wide columns

        // question is at IMP_QUESTION_1 + iOffset
        // and there are 4 answers afterwards
        BltAnswerIndents(4);
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 20,
          LAPTOP_SCREEN_WEB_UL_Y + 30,
          460,
          Enum88.IMP_QUESTION_1 + iOffset,
          FONT10ARIAL(),
          FONT_WHITE,
          true,
          LEFT_JUSTIFIED,
        );

        // answers
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 100,
          390,
          Enum88.IMP_QUESTION_1 + iOffset + 1,
          FONT10ARIAL(),
          142,
          true,
          LEFT_JUSTIFIED,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 150,
          390,
          Enum88.IMP_QUESTION_1 + iOffset + 2,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 200,
          390,
          Enum88.IMP_QUESTION_1 + iOffset + 3,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 250,
          390,
          Enum88.IMP_QUESTION_1 + iOffset + 4,
          FONT10ARIAL(),
          142,
          true,
          0,
        );

        iOffset = 0;
        break;
      case 6:
        // question is at IMP_QUESTION_1 + iOffset
        // and there are 5 answers afterwards
        BltAnswerIndents(5);
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 20,
          LAPTOP_SCREEN_WEB_UL_Y + 30,
          460,
          Enum88.IMP_QUESTION_1 + iOffset,
          FONT10ARIAL(),
          FONT_WHITE,
          true,
          LEFT_JUSTIFIED,
        );

        // answers
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 100,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 1,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 150,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 2,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 200,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 3,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 250,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 4,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_SECOND_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 100,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 5,
          FONT10ARIAL(),
          142,
          true,
          0,
        );

        break;
      case 7:
        // question is at IMP_QUESTION_1 + iOffset
        // and there are 5 answers afterwards
        BltAnswerIndents(6);
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 20,
          LAPTOP_SCREEN_WEB_UL_Y + 30,
          460,
          Enum88.IMP_QUESTION_1 + iOffset,
          FONT10ARIAL(),
          FONT_WHITE,
          true,
          LEFT_JUSTIFIED,
        );

        // answers
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 100,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 1,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 150,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 2,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 200,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 3,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 250,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 4,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_SECOND_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 100,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 5,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_SECOND_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 150,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 6,
          FONT10ARIAL(),
          142,
          true,
          0,
        );

        break;
      case 9:
        // question is at IMP_QUESTION_1 + iOffset
        // and there are 8 answers afterwards
        BltAnswerIndents(8);

        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + 20,
          LAPTOP_SCREEN_WEB_UL_Y + 30,
          460,
          Enum88.IMP_QUESTION_1 + iOffset,
          FONT10ARIAL(),
          FONT_WHITE,
          true,
          LEFT_JUSTIFIED,
        );

        // answers
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 100,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 1,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 150,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 2,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 200,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 3,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_FIRST_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 250,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 4,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_SECOND_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 100,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 5,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_SECOND_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 150,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 6,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_SECOND_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 200,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 7,
          FONT10ARIAL(),
          142,
          true,
          0,
        );
        LoadAndDisplayIMPText(
          LAPTOP_SCREEN_UL_X + QTN_SECOND_COLUMN_X,
          LAPTOP_SCREEN_WEB_UL_Y + 250,
          160,
          Enum88.IMP_QUESTION_1 + iOffset + 8,
          FONT10ARIAL(),
          142,
          true,
          0,
        );

        break;
    }

    return;
  }

  function OffSetQuestionForFemaleSpecificQuestions(
    iCurrentOffset: INT32,
  ): INT32 {
    let iExtraOffSet: INT32 = 0;
    let fOffSet: boolean = true;
    let iCounter: INT32 = 0;

    // find the extra
    switch (giCurrentPersonalityQuizQuestion) {
      case 0:
        iExtraOffSet = 0;
        break;
      case 3:
        iExtraOffSet = iIMPQuestionLengths[0];
        break;
      case 8:
        iExtraOffSet = iIMPQuestionLengths[0] + iIMPQuestionLengths[3];
        break;
      case 9:
        iExtraOffSet =
          iIMPQuestionLengths[0] +
          iIMPQuestionLengths[3] +
          iIMPQuestionLengths[8];
        break;
      case 13:
        iExtraOffSet =
          iIMPQuestionLengths[0] +
          iIMPQuestionLengths[3] +
          iIMPQuestionLengths[8] +
          iIMPQuestionLengths[9];
        break;
      default:
        fOffSet = false;
        break;
    }

    if (fOffSet) {
      iCurrentOffset = Enum88.IMP_CON_3 - (Enum88.IMP_QUESTION_1 - 3);

      iCurrentOffset += iExtraOffSet;
    }

    return iCurrentOffset;
  }
}
