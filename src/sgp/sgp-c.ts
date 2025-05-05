namespace ja2 {
  // Prototype Declarations

  export let ghInstance: HTMLElement;

  // Global Variable Declarations

  export let gfProgramIsRunning: boolean;
  export let gfDontUseDDBlits: boolean = false;

  export let gzCommandLine: string /* CHAR8[100] */; // Command line given

  function InitializeStandardGamingPlatform(hInstance: HTMLElement): boolean {
    let pFontTable: FontTranslationTable;

    // Initialize the Memory Manager
    InitializeMemoryManager();

    // Initialize the Input Manager
    InitializeInputManager();

    if (InitializeVideoManager(hInstance) == false) {
      return false;
    }

    // Initialize Video Object Manager
    InitializeVideoObjectManager();

    // Initialize Video Surface Manager
    if (!InitializeVideoSurfaceManager()) {
      FastDebugMsg("FAILED : Initializing Video Surface Manager");
      return false;
    }

    InitJA2SplashScreen();

    // Make sure we start up our local clock (in milliseconds)
    // We don't need to check for a return value here since so far its always TRUE
    InitializeClockManager(); // must initialize after VideoManager, 'cause it uses ghWindow

    // Create font translation table (store in temp structure)
    pFontTable = CreateEnglishTransTable();

    // Initialize Font Manager
    // Init the manager and copy the TransTable stuff into it.
    if (!InitializeFontManager(8, pFontTable)) {
      return false;
    }

    // Initialize the Sound Manager (DirectSound)
    if (InitializeSoundManager() == false) {
      return false;
    }

    // Initialize random number generator
    InitializeRandom(); // no Shutdown

    // Initialize the Game
    if (InitializeGame() == false) {
      return false;
    }

    return true;
  }

  export function WinMain(hInstance: HTMLElement): number {
    ghInstance = hInstance;

    ShowCursor(false);

    // Inititialize the SGP
    if (InitializeStandardGamingPlatform(hInstance) == false) {
      // We failed to initialize the SGP
      return 0;
    }

    SetIntroType(Enum21.INTRO_SPLASH);

    gfProgramIsRunning = true;

    FastDebugMsg("Running Game");

    // At this point the SGP is set up, which means all I/O, Memory, tools, etc... are available. All we need to do is
    // attend to the gaming mechanics themselves
    requestAnimationFrame(render);

    function render() {
      GameLoop();

      gfSGPInputReceived = false;

      requestAnimationFrame(render);
    }

    // This is the normal exit point
    FastDebugMsg("Exiting Game");

    // SGPExit() will be called next through the atexit() mechanism...  This way we correctly process both normal exits and
    // emergency aborts (such as those caused by a failed assertion).

    // return wParam of the last message received
    return 0;
  }
}
