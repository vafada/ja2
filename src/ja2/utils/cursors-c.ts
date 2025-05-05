namespace ja2 {
  const NUM_MOUSE_LEVELS = 2;

  let gsMouseGlobalYOffsets: INT16[] /* [NUM_MOUSE_LEVELS] */ = [0, 50];

  let CursorFileDatabase: CursorFileData[] /* [] */ = [
    createCursorFileDataFrom("CURSORS\\cursor.sti", false, 0, 0, 0),
    createCursorFileDataFrom(
      "CURSORS\\cur_targ.sti",
      false,
      0,
      ANIMATED_CURSOR,
      7,
    ),
    createCursorFileDataFrom(
      "CURSORS\\cur_tagr.sti",
      false,
      0,
      ANIMATED_CURSOR,
      7,
    ),
    createCursorFileDataFrom(
      "CURSORS\\targblak.sti",
      false,
      0,
      ANIMATED_CURSOR,
      7,
    ),
    createCursorFileDataFrom(
      "CURSORS\\cur_bst.sti",
      false,
      0,
      ANIMATED_CURSOR,
      7,
    ),
    createCursorFileDataFrom(
      "CURSORS\\cur_rbst.sti",
      false,
      0,
      ANIMATED_CURSOR,
      7,
    ),
    createCursorFileDataFrom(
      "CURSORS\\burstblk.sti",
      false,
      0,
      ANIMATED_CURSOR,
      7,
    ),
    createCursorFileDataFrom("CURSORS\\cur_tr.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_trw.sti", false, 0, 0, 0),
    createCursorFileDataFrom(
      "CURSORS\\cur_tb.sti",
      false,
      0,
      ANIMATED_CURSOR,
      7,
    ),

    createCursorFileDataFrom(
      "CURSORS\\punch.sti",
      false,
      0,
      ANIMATED_CURSOR,
      6,
    ),
    createCursorFileDataFrom(
      "CURSORS\\punchr.sti",
      false,
      0,
      ANIMATED_CURSOR,
      6,
    ),
    createCursorFileDataFrom(
      "CURSORS\\cur_run.sti",
      false,
      0,
      ANIMATED_CURSOR,
      10,
    ),
    createCursorFileDataFrom(
      "CURSORS\\cur_walk.sti",
      false,
      0,
      ANIMATED_CURSOR,
      10,
    ),
    createCursorFileDataFrom(
      "CURSORS\\cur_swat.sti",
      false,
      0,
      ANIMATED_CURSOR,
      10,
    ),
    createCursorFileDataFrom(
      "CURSORS\\cur_pron.sti",
      false,
      0,
      ANIMATED_CURSOR,
      10,
    ),
    createCursorFileDataFrom("CURSORS\\grabsr.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\grabs.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\stab.sti", false, 0, ANIMATED_CURSOR, 6),
    createCursorFileDataFrom(
      "CURSORS\\stabr.sti",
      false,
      0,
      ANIMATED_CURSOR,
      6,
    ),

    createCursorFileDataFrom(
      "CURSORS\\cross1.sti",
      false,
      0,
      ANIMATED_CURSOR,
      6,
    ),
    createCursorFileDataFrom(
      "CURSORS\\cross2.sti",
      false,
      0,
      ANIMATED_CURSOR,
      6,
    ),
    createCursorFileDataFrom("LAPTOP\\FingerCursor.sti", false, 0, 0, 0),
    createCursorFileDataFrom("LAPTOP\\LapTopCursor.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\ibeam.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_look.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_talk.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_talkb.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_talkr.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_exit.sti", false, 0, 0, 0),

    createCursorFileDataFrom("CURSORS\\VehicleCursor.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\WalkingCursor.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\que.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\chopper.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\check.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_try.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\wirecut.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\wirecutr.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\bullet_g.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\bullet_d.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\ibeamWhite.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\throwg.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\throwb.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\throwr.sti", false, 0, 0, 0),
    createCursorFileDataFrom(
      "",
      false,
      0,
      USE_EXTERN_VO_CURSOR | USE_OUTLINE_BLITTER,
      0,
    ),
    createCursorFileDataFrom("CURSORS\\bombg.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\bombr.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\remoteg.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\remoter.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\steering.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_car.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_wait.sti", false, 0, 0, 0),

    // Tactical GUI cursors
    createCursorFileDataFrom("CURSORS\\singlecursor.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\groupcursor.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\singledcursor.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\groupdcursor.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\repair.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\repairr.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\jar_cur.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\jar_cur_red.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_x.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\can_01.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\can_02.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\cur_swit.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\bullseye.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\deadleap.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\can_01.sti", false, 0, 0, 0),
    createCursorFileDataFrom("CURSORS\\can_02.sti", false, 0, 0, 0),
  ];

  function RaiseMouseToLevel(bLevel: INT8): void {
    gsGlobalCursorYOffset = gsMouseGlobalYOffsets[bLevel];
  }

  let CursorDatabase: CursorData[] /* [] */ = [
    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_MISC, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      0,
      0,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODE,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    // TARGET ( NORMAL W/ RINGS )
    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          5,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      3,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          3,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          7,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          8,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          4,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    // TARGET WITH WHITE RINGS
    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          3,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          4,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    // TARGET RED CURSOR
    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    // TARGET BLACK CURSOR
    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_BLACKTARGET,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    // TARGET DARK BLACK CURSOR
    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    // TARGET RED CURSOR

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TARGMODEBURSTRED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TARGMODEBURSTBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          3,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
      ],
      5,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TARGMODEBURST,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_TARGMODEBURSTRED, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TARGMODEBURSTBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_PUNCHGRAY,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_PUNCHRED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_PUNCHRED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_PUNCHRED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_PUNCHRED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_PUNCHRED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_PUNCHRED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_PUNCHRED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(Enum318.C_RUN1, 0, 0, CENTER_SUBCURSOR, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      20,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(Enum318.C_WALK1, 0, 0, CENTER_SUBCURSOR, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      20,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(Enum318.C_SWAT1, 0, 0, CENTER_SUBCURSOR, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      10,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(Enum318.C_PRONE1, 0, 0, CENTER_SUBCURSOR, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      10,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          0,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_GRAB1,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          0,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_GRAB2,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_KNIFE1,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_KNIFE2,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_KNIFE2,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_KNIFE2,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_KNIFE2,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_KNIFE2,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_KNIFE2,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_KNIFE2,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_CROSS1, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_CROSS2, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),
    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_WWW, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      0,
      0,
      0,
      0,
      0,
      0,
    ),
    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_LAPTOPSCREEN, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      0,
      0,
      0,
      0,
      0,
      0,
    ),
    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_IBEAM, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(Enum318.C_LOOK, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TALK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_BLACKTALK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_REDTALK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    // Exit arrows
    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      TOP_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 1, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      BOTTOM_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 2, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      RIGHT_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 3, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      LEFT_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 4, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      TOP_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 5, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      BOTTOM_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 6, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      RIGHT_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 7, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      LEFT_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 8, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      TOP_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 9, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      BOTTOM_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 10, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      RIGHT_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 11, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      LEFT_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_STRATVEH,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_STRATFOOT,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_INVALIDACTION,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),
    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_CHOPPER,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODE,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      3,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_FLASH,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TARGMODEBURST,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TARGMODEBURSTBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_FLASH,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TALK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_BLACKTALK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      3,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_FLASH,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_REDTALK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_BLACKTALK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      3,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_FLASH,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_CHECKMARK, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          5,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODERED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          3,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 12, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 13, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_EXITARROWS, 14, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_WIRECUTR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_WIRECUT,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_RELOAD,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      3,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_FLASH,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ACTIONMODEBLACK,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_RELOADR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      3,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_FLASH,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_IBEAM_WHITE, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWG,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWG,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      3,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_FLASH,
      0,
    ),

    // THROW CURSORS W/ RINGS
    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          5,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      3,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          3,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          7,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          8,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          4,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    // TARGET WITH WHITE RINGS
    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          3,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TWRINGS,
          4,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    // YELLOW RINGS
    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          5,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          1,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          2,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_YELLOWRINGS,
          3,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_SUB_CONDITIONALLY,
      0,
    ),

    // ITEM THROW ONES...
    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ITEMTHROW,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWG,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          0,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      3,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ITEMTHROW,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      3,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ITEMTHROW,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWG,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_THROWB,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      4,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_FLASH2,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_ITEMTHROW,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      CURSOR_TO_FLASH2,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_BOMB_GREY,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_BOMB_RED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_REMOTE_GREY,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_REMOTE_RED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_ENTERV,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_MOVEV,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_WAIT,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      DELAY_START_CURSOR,
      0,
    ),

    // Tactical Placement GUI cursors
    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_PLACEMERC, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      BOTTOM_CURSOR,
      0,
      0,
      0,
      0,
    ),
    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_PLACEGROUP, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      BOTTOM_CURSOR,
      0,
      0,
      0,
      0,
    ),
    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_DPLACEMERC, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      BOTTOM_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(Enum318.C_DPLACEGROUP, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      BOTTOM_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_REPAIR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_REPAIRR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_JAR,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_JARRED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_CAN,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_CANRED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_X,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_WAIT,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_EXCHANGE,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_BULLSEYE,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      1,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_JUMPOVER,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_FUEL,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),

    createCursorDataFrom(
      [
        createCursorImageFrom(
          Enum318.C_TRINGS,
          6,
          0,
          HIDE_SUBCURSOR,
          HIDE_SUBCURSOR,
        ),
        createCursorImageFrom(
          Enum318.C_FUEL_RED,
          0,
          0,
          CENTER_SUBCURSOR,
          CENTER_SUBCURSOR,
        ),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
        createCursorImageFrom(0, 0, 0, 0, 0),
      ],
      2,
      CENTER_CURSOR,
      CENTER_CURSOR,
      0,
      0,
      0,
      0,
    ),
  ];

  export function InitCursors(): void {
    InitCursorDatabase(
      CursorFileDatabase,
      CursorDatabase,
      Enum318.NUM_CURSOR_FILES,
    );

    SetMouseBltHook(BltJA2CursorData);
  }

  export function HandleAnimatedCursors(): void {
    if (COUNTERDONE(Enum386.CURSORCOUNTER)) {
      RESETCOUNTER(Enum386.CURSORCOUNTER);

      if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
        UpdateAnimatedCursorFrames(gViewportRegion.Cursor);
        SetCurrentCursorFromDatabase(gViewportRegion.Cursor);
      }

      if (gDisableRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
        UpdateAnimatedCursorFrames(gDisableRegion.Cursor);
        SetCurrentCursorFromDatabase(gDisableRegion.Cursor);
      }

      if (gUserTurnRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
        UpdateAnimatedCursorFrames(gUserTurnRegion.Cursor);
        SetCurrentCursorFromDatabase(gUserTurnRegion.Cursor);
      }
    }

    if (COUNTERDONE(Enum386.CURSORFLASHUPDATE)) {
      RESETCOUNTER(Enum386.CURSORFLASHUPDATE);

      if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
        UpdateFlashingCursorFrames(gViewportRegion.Cursor);
        SetCurrentCursorFromDatabase(gViewportRegion.Cursor);
      }
    }
  }

  function BltJA2CursorData(): void {
    if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
      DrawMouseText();
    }
  }

  /* static */ let DrawMouseText__fShow: boolean = false;
  /* static */ let DrawMouseText__fHoldInvalid: boolean = true;
  function DrawMouseText(): void {
    let pStr: string /* INT16[512] */;
    let sX: INT16;
    let sY: INT16;

    // EnterMutex(MOUSE_BUFFER_MUTEX, __LINE__, __FILE__);

    if (gfUIBodyHitLocation) {
      // Set dest for gprintf to be different
      SetFontDestBuffer(MOUSE_BUFFER, 0, 0, 64, 64, false);

      ({ sX, sY } = FindFontCenterCoordinates(
        0,
        0,
        gsCurMouseWidth,
        gsCurMouseHeight,
        gzLocation,
        TINYFONT1(),
      ));
      SetFont(TINYFONT1());

      SetFontBackground(FONT_MCOLOR_BLACK);
      SetFontForeground(FONT_MCOLOR_WHITE);

      mprintf(sX, sY + 12, gzLocation);
      // reset
      SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
    }

    if (gfUIIntTileLocation) {
      // Set dest for gprintf to be different
      SetFontDestBuffer(MOUSE_BUFFER, 0, 0, 64, 64, false);

      ({ sX, sY } = FindFontCenterCoordinates(
        0,
        0,
        gsCurMouseWidth,
        gsCurMouseHeight,
        gzIntTileLocation,
        TINYFONT1(),
      ));
      SetFont(TINYFONT1());

      SetFontBackground(FONT_MCOLOR_BLACK);
      SetFontForeground(FONT_MCOLOR_WHITE);

      mprintf(sX, sY + 6, gzIntTileLocation);
      // reset
      SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
    }

    if (gfUIIntTileLocation2) {
      // Set dest for gprintf to be different
      SetFontDestBuffer(MOUSE_BUFFER, 0, 0, 64, 64, false);

      ({ sX, sY } = FindFontCenterCoordinates(
        0,
        0,
        gsCurMouseWidth,
        gsCurMouseHeight,
        gzIntTileLocation2,
        TINYFONT1(),
      ));
      SetFont(TINYFONT1());

      SetFontBackground(FONT_MCOLOR_BLACK);
      SetFontForeground(FONT_MCOLOR_WHITE);

      mprintf(sX, sY - 2, gzIntTileLocation2);
      // reset
      SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
    }

    // if ( ( ( gTacticalStatus.uiFlags & TURNBASED ) && ( gTacticalStatus.uiFlags & INCOMBAT ) ) )
    {
      if (gfUIDisplayActionPoints) {
        if (gfUIDisplayActionPointsInvalid) {
          if (!DrawMouseText__fHoldInvalid) {
            if (COUNTERDONE(Enum386.INVALID_AP_HOLD)) {
              RESETCOUNTER(Enum386.INVALID_AP_HOLD);
              RESETCOUNTER(Enum386.CURSORFLASH);

              DrawMouseText__fShow = !DrawMouseText__fShow;
              DrawMouseText__fHoldInvalid = !DrawMouseText__fHoldInvalid;
            }
          } else {
            if (COUNTERDONE(Enum386.CURSORFLASH)) {
              RESETCOUNTER(Enum386.CURSORFLASH);
              RESETCOUNTER(Enum386.INVALID_AP_HOLD);

              DrawMouseText__fShow = !DrawMouseText__fShow;
              DrawMouseText__fHoldInvalid = !DrawMouseText__fHoldInvalid;
            }
          }
        } else {
          DrawMouseText__fShow = true;
          DrawMouseText__fHoldInvalid = false;
        }

        // Set dest for gprintf to be different
        SetFontDestBuffer(MOUSE_BUFFER, 0, 0, 64, 64, false);

        pStr = swprintf("%d", gsCurrentActionPoints);

        if (gfUIDisplayActionPointsCenter) {
          ({ sX, sY } = FindFontCenterCoordinates(
            0,
            0,
            gsCurMouseWidth,
            gsCurMouseHeight,
            pStr,
            TINYFONT1(),
          ));
        } else {
          ({ sX, sY } = FindFontCenterCoordinates(
            gUIDisplayActionPointsOffX,
            gUIDisplayActionPointsOffY,
            1,
            1,
            pStr,
            TINYFONT1(),
          ));
        }

        SetFont(TINYFONT1());

        if (DrawMouseText__fShow) {
          if (gfUIDisplayActionPointsInvalid) {
            SetFontBackground(FONT_MCOLOR_BLACK);
            SetFontForeground(141);
            // SetFontShadow( NO_SHADOW );
            SetFontShadow(DEFAULT_SHADOW);
          } else {
            SetFontBackground(FONT_MCOLOR_BLACK);
            SetFontForeground(FONT_MCOLOR_WHITE);
            SetFontShadow(DEFAULT_SHADOW);
          }
        } else {
          gfUIDisplayActionPointsBlack = true;
        }

        if (gfUIDisplayActionPointsBlack) {
          SetFontForeground(FONT_MCOLOR_WHITE);
          SetFontShadow(DEFAULT_SHADOW);
        }

        mprintf(sX, sY, "%d", gsCurrentActionPoints);
        // mprintf( sX, sY, L"%d %d", sX, sY );

        // LeaveMutex(MOUSE_BUFFER_MUTEX, __LINE__, __FILE__);

        SetFontShadow(DEFAULT_SHADOW);

        // reset
        SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
      }
    }
  }

  export function UpdateAnimatedCursorFrames(uiCursorIndex: UINT32): void {
    let pCurData: CursorData;
    let pCurImage: CursorImage;
    let cnt: UINT32;

    if (uiCursorIndex != VIDEO_NO_CURSOR) {
      pCurData = CursorDatabase[uiCursorIndex];

      for (cnt = 0; cnt < pCurData.usNumComposites; cnt++) {
        pCurImage = pCurData.Composites[cnt];

        if (
          CursorFileDatabase[pCurImage.uiFileIndex].ubFlags & ANIMATED_CURSOR
        ) {
          pCurImage.uiCurrentFrame++;

          if (
            pCurImage.uiCurrentFrame ==
            CursorFileDatabase[pCurImage.uiFileIndex].ubNumberOfFrames
          ) {
            pCurImage.uiCurrentFrame = 0;
          }
        }
      }
    }
  }

  function UpdateFlashingCursorFrames(uiCursorIndex: UINT32): void {
    let pCurData: CursorData;

    if (uiCursorIndex != VIDEO_NO_CURSOR) {
      pCurData = CursorDatabase[uiCursorIndex];

      if (pCurData.bFlags & (CURSOR_TO_FLASH | CURSOR_TO_FLASH2)) {
        pCurData.bFlashIndex = Number(!pCurData.bFlashIndex);

        // Should we play a sound?
        if (pCurData.bFlags & CURSOR_TO_PLAY_SOUND) {
          if (pCurData.bFlashIndex) {
            PlayJA2Sample(
              Enum330.TARGET_OUT_OF_RANGE,
              RATE_11025,
              MIDVOLUME,
              1,
              MIDDLEPAN,
            );
          }
        }
      }
    }
  }

  export function SetCursorSpecialFrame(
    uiCursor: UINT32,
    ubFrame: UINT8,
  ): void {
    CursorDatabase[uiCursor].bFlashIndex = ubFrame;
  }

  export function SetCursorFlags(uiCursor: UINT32, ubFlags: UINT8): void {
    CursorDatabase[uiCursor].bFlags |= ubFlags;
  }

  export function RemoveCursorFlags(uiCursor: UINT32, ubFlags: UINT8): void {
    CursorDatabase[uiCursor].bFlags &= ~ubFlags;
  }
}
