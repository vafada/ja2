namespace ja2 {

export let guiSplashFrameFade: UINT32 = 10;
export let guiSplashStartTime: UINT32 = 0;

// Simply create videosurface, load image, and draw it to the screen.
export function InitJA2SplashScreen(): void {
  InitializeJA2Clock();
  // InitializeJA2TimerID();
  // Get Executable Directory
  // Adjust Current Dir
  if (!SetFileManCurrentDirectory(JA2_DATA_DIR)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Could not find data directory, shutting down");
    return;
  }

  // Initialize the file database
  InitializeFileDatabase();


  ClearMainMenu();

  InvalidateScreen();
  RefreshScreen();

  guiSplashStartTime = GetJA2Clock();
}

}
