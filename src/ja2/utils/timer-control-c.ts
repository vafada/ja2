namespace ja2 {
  let giClockTimer: INT32 = -1;
  export let giTimerDiag: INT32 = 0;

  export let guiBaseJA2Clock: UINT32 = 0;
  let guiBaseJA2NoPauseClock: UINT32 = 0;

  let gfPauseClock: boolean = false;

  export let giTimerIntervals: INT32[] /* [NUMTIMERS] */ = [
    5, // Tactical Overhead
    20, // NEXTSCROLL
    200, // Start Scroll
    200, // Animate tiles
    1000, // FPS Counter
    80, // PATH FIND COUNTER
    150, // CURSOR TIMER
    250, // RIGHT CLICK FOR MENU
    300, // LEFT
    30, // SLIDING TEXT
    200, // TARGET REFINE TIMER
    150, // CURSOR/AP FLASH
    60, // FADE MERCS OUT
    160, // PANEL SLIDE
    1000, // CLOCK UPDATE DELAY
    20, // PHYSICS UPDATE
    100, // FADE ENEMYS
    20, // STRATEGIC OVERHEAD
    40,
    500, // NON GUN TARGET REFINE TIMER
    250, // IMPROVED CURSOR FLASH
    500, // 2nd CURSOR FLASH
    400, // RADARMAP BLINK AND OVERHEAD MAP BLINK SHOUDL BE THE SAME
    400,
    10, // Music Overhead
    100, // Rubber band start delay
  ];

  // TIMER COUNTERS
  export let giTimerCounters: INT32[] /* [NUMTIMERS] */ = createArray(
    Enum386.NUMTIMERS,
    0,
  );

  export let giTimerAirRaidQuote: INT32 = 0;
  export let giTimerAirRaidDiveStarted: INT32 = 0;
  export let giTimerAirRaidUpdate: INT32 = 0;
  let giTimerCustomizable: INT32 = 0;
  export let giTimerTeamTurnUpdate: INT32 = 0;

  export let gpCustomizableTimerCallback: CUSTOMIZABLE_TIMER_CALLBACK | null =
    null;

  // Clock Callback event ID
  let gTimerID: number;

  // GLOBALS FOR CALLBACK
  let gCNT: UINT32;
  let gPSOLDIER: SOLDIERTYPE;

  // GLobal for displaying time diff ( DIAG )
  let guiClockDiff: UINT32 = 0;
  let guiClockStart: UINT32 = 0;

  /* static */ let TimeProc__fInFunction: boolean = false;
  function TimeProc(
    uID: UINT32,
    uMsg: UINT32,
    dwUser: number,
    dw1: number,
    dw2: number,
  ): void {
    // SOLDIERTYPE		*pSoldier;

    if (!TimeProc__fInFunction) {
      TimeProc__fInFunction = true;

      guiBaseJA2NoPauseClock += BASETIMESLICE;

      if (!gfPauseClock) {
        guiBaseJA2Clock += BASETIMESLICE;

        for (gCNT = 0; gCNT < Enum386.NUMTIMERS; gCNT++) {
          UPDATECOUNTER(gCNT);
        }

        // Update some specialized countdown timers...
        giTimerAirRaidQuote = UPDATETIMECOUNTER(giTimerAirRaidQuote);
        giTimerAirRaidDiveStarted = UPDATETIMECOUNTER(
          giTimerAirRaidDiveStarted,
        );
        giTimerAirRaidUpdate = UPDATETIMECOUNTER(giTimerAirRaidUpdate);
        giTimerTeamTurnUpdate = UPDATETIMECOUNTER(giTimerTeamTurnUpdate);

        if (gpCustomizableTimerCallback) {
          giTimerCustomizable = UPDATETIMECOUNTER(giTimerCustomizable);
        }

        // If mapscreen...
        if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
          // IN Mapscreen, loop through player's team.....
          for (
            gCNT = gTacticalStatus.Team[gbPlayerNum].bFirstID;
            gCNT <= gTacticalStatus.Team[gbPlayerNum].bLastID;
            gCNT++
          ) {
            gPSOLDIER = MercPtrs[gCNT];
            gPSOLDIER.PortraitFlashCounter = UPDATETIMECOUNTER(
              gPSOLDIER.PortraitFlashCounter,
            );
            gPSOLDIER.PanelAnimateCounter = UPDATETIMECOUNTER(
              gPSOLDIER.PanelAnimateCounter,
            );
          }
        } else {
          // Set update flags for soldiers
          ////////////////////////////
          for (gCNT = 0; gCNT < guiNumMercSlots; gCNT++) {
            gPSOLDIER = MercSlots[gCNT];

            if (gPSOLDIER != null) {
              gPSOLDIER.UpdateCounter = UPDATETIMECOUNTER(
                gPSOLDIER.UpdateCounter,
              );
              gPSOLDIER.DamageCounter = UPDATETIMECOUNTER(
                gPSOLDIER.DamageCounter,
              );
              gPSOLDIER.ReloadCounter = UPDATETIMECOUNTER(
                gPSOLDIER.ReloadCounter,
              );
              gPSOLDIER.FlashSelCounter = UPDATETIMECOUNTER(
                gPSOLDIER.FlashSelCounter,
              );
              gPSOLDIER.BlinkSelCounter = UPDATETIMECOUNTER(
                gPSOLDIER.BlinkSelCounter,
              );
              gPSOLDIER.PortraitFlashCounter = UPDATETIMECOUNTER(
                gPSOLDIER.PortraitFlashCounter,
              );
              gPSOLDIER.AICounter = UPDATETIMECOUNTER(gPSOLDIER.AICounter);
              gPSOLDIER.FadeCounter = UPDATETIMECOUNTER(gPSOLDIER.FadeCounter);
              gPSOLDIER.NextTileCounter = UPDATETIMECOUNTER(
                gPSOLDIER.NextTileCounter,
              );
              gPSOLDIER.PanelAnimateCounter = UPDATETIMECOUNTER(
                gPSOLDIER.PanelAnimateCounter,
              );
            }
          }
        }
      }

      TimeProc__fInFunction = false;
    }
  }

  export function InitializeJA2Clock(): boolean {
    let cnt: INT32;

    // Init timer delays
    for (cnt = 0; cnt < Enum386.NUMTIMERS; cnt++) {
      giTimerCounters[cnt] = giTimerIntervals[cnt];
    }

    // Set timer at lowest resolution. Could use middle of lowest/highest, we'll see how this performs first
    gTimerID = setInterval(TimeProc, BASETIMESLICE);

    if (!gTimerID) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Could not create timer callback");
    }

    return true;
  }

  export function ShutdownJA2Clock(): void {
    // Make sure we kill the timer

    clearInterval(gTimerID);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // TIMER CALLBACK S
  //////////////////////////////////////////////////////////////////////////////////////////////
  function FlashItem(
    uiID: UINT32,
    uiMsg: UINT32,
    uiUser: number,
    uiDw1: number,
    uiDw2: number,
  ): void {}

  export function PauseTime(fPaused: boolean): void {
    gfPauseClock = fPaused;
  }

  export function SetCustomizableTimerCallbackAndDelay(
    iDelay: INT32,
    pCallback: CUSTOMIZABLE_TIMER_CALLBACK,
    fReplace: boolean,
  ): void {
    if (gpCustomizableTimerCallback) {
      if (!fReplace) {
        // replace callback but call the current callback first
        gpCustomizableTimerCallback();
      }
    }

    giTimerCustomizable = RESETTIMECOUNTER(iDelay);
    gpCustomizableTimerCallback = pCallback;
  }

  export function CheckCustomizableTimer(): void {
    if (gpCustomizableTimerCallback) {
      if (TIMECOUNTERDONE(giTimerCustomizable, 0)) {
        // set the callback to a temp variable so we can reset the global variable
        // before calling the callback, so that if the callback sets up another
        // instance of the timer, we don't reset it afterwards
        let pTempCallback: CUSTOMIZABLE_TIMER_CALLBACK;

        pTempCallback = gpCustomizableTimerCallback;
        gpCustomizableTimerCallback = null;
        pTempCallback();
      }
    }
  }

  export function ResetJA2ClockGlobalTimers(): void {
    let uiCurrentTime: UINT32 = GetJA2Clock();

    guiCompressionStringBaseTime = uiCurrentTime;
    giFlashHighlightedItemBaseTime = uiCurrentTime;
    giCompatibleItemBaseTime = uiCurrentTime;
    giAnimateRouteBaseTime = uiCurrentTime;
    giPotHeliPathBaseTime = uiCurrentTime;
    giClickHeliIconBaseTime = uiCurrentTime;
    giExitToTactBaseTime = uiCurrentTime;
    guiSectorLocatorBaseTime = uiCurrentTime;

    giCommonGlowBaseTime = uiCurrentTime;
    giFlashAssignBaseTime = uiCurrentTime;
    giFlashContractBaseTime = uiCurrentTime;
    guiFlashCursorBaseTime = uiCurrentTime;
    giPotCharPathBaseTime = uiCurrentTime;
  }
}
