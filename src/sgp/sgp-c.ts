namespace ja2 {

// Prototype Declarations

export let ghInstance: HTMLElement;

// Global Variable Declarations

let gfApplicationActive: boolean;
export let gfProgramIsRunning: boolean;
let gfGameInitialized: boolean = false;
export let gfDontUseDDBlits: boolean = false;

// There were TWO of them??!?! -- DB
// CHAR8		gzCommandLine[ 100 ];
export let gzCommandLine: string /* CHAR8[100] */; // Command line given

let gzErrorMsg: string /* CHAR8[2048] */ = "";
let gfIgnoreMessages: boolean = false;

// GLOBAL VARIBLE, SET TO DEFAULT BUT CAN BE CHANGED BY THE GAME IF INIT FILE READ
export let gbPixelDepth: UINT8 = PIXEL_DEPTH;

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

  gfGameInitialized = true;

  return true;
}

function ShutdownStandardGamingPlatform(): void {
  //
  // Shut down the different components of the SGP
  //

  // TEST
  SoundServiceStreams();

  if (gfGameInitialized) {
    ShutdownGame();
  }

  ShutdownButtonSystem();
  MSYS_Shutdown();

  ShutdownSoundManager();

  DestroyEnglishTransTable(); // has to go before ShutdownFontManager()
  ShutdownFontManager();

  ShutdownClockManager(); // must shutdown before VideoManager, 'cause it uses ghWindow

  ShutdownVideoSurfaceManager();
  ShutdownVideoObjectManager();
  ShutdownVideoManager();

  ShutdownInputManager();
  ShutdownFileManager();

  ShutdownMemoryManager(); // must go last (except for Debug), for MemDebugCounter to work right...

  //
  // Make sure we unregister the last remaining debug topic before shutting
  // down the debugging layer
  UnRegisterDebugTopic(TOPIC_SGP, "Standard Gaming Platform");

  ShutdownDebugManager();
}

export function WinMain(hInstance: HTMLElement): number {
  ghInstance = hInstance;

  ShowCursor(false);

  // Inititialize the SGP
  if (InitializeStandardGamingPlatform(hInstance) == false) {
    // We failed to initialize the SGP
    return 0;
  }

// FIXME: Language-specific code
// #ifdef ENGLISH
  SetIntroType(Enum21.INTRO_SPLASH);
// #endif

  gfApplicationActive = true;
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
