namespace ja2 {

export let GameScreens: Screens[] /* [MAX_SCREENS] */ = [
  createScreensFrom(EditScreenInit, EditScreenHandle, EditScreenShutdown), // 0
  createScreensFrom(SavingScreenInitialize, SavingScreenHandle, SavingScreenShutdown), // 1, Title Screen
  createScreensFrom(LoadingScreenInitialize, LoadingScreenHandle, LoadingScreenShutdown), // 2, Title Screen
  createScreensFrom(ErrorScreenInitialize, ErrorScreenHandle, ErrorScreenShutdown), // 3, Title Screen
  createScreensFrom(InitScreenInitialize, InitScreenHandle, InitScreenShutdown), // 4, Title Screen
  createScreensFrom(MainGameScreenInit, MainGameScreenHandle, MainGameScreenShutdown), //5
  createScreensFrom(AniEditScreenInit, AniEditScreenHandle, AniEditScreenShutdown), //6
  createScreensFrom(PalEditScreenInit, PalEditScreenHandle, PalEditScreenShutdown), // 7
  createScreensFrom(DebugScreenInit, DebugScreenHandle, DebugScreenShutdown),
  createScreensFrom(MapScreenInit, MapScreenHandle, MapScreenShutdown),
  createScreensFrom(LaptopScreenInit, LaptopScreenHandle, LaptopScreenShutdown),
  createScreensFrom(LoadSaveScreenInit, LoadSaveScreenHandle, LoadSaveScreenShutdown),
  createScreensFrom(MapUtilScreenInit, MapUtilScreenHandle, MapUtilScreenShutdown),
  createScreensFrom(FadeScreenInit, FadeScreenHandle, FadeScreenShutdown),
  createScreensFrom(MessageBoxScreenInit, MessageBoxScreenHandle, MessageBoxScreenShutdown),
  createScreensFrom(MainMenuScreenInit, MainMenuScreenHandle, MainMenuScreenShutdown), // 15
  createScreensFrom(AutoResolveScreenInit, AutoResolveScreenHandle, AutoResolveScreenShutdown),
  createScreensFrom(SaveLoadScreenInit, SaveLoadScreenHandle, SaveLoadScreenShutdown),
  createScreensFrom(OptionsScreenInit, OptionsScreenHandle, OptionsScreenShutdown),
  createScreensFrom(ShopKeeperScreenInit, ShopKeeperScreenHandle, ShopKeeperScreenShutdown),
  createScreensFrom(SexScreenInit, SexScreenHandle, SexScreenShutdown), // 20
  createScreensFrom(GameInitOptionsScreenInit, GameInitOptionsScreenHandle, GameInitOptionsScreenShutdown),
  createScreensFrom(DemoExitScreenInit, DemoExitScreenHandle, DemoExitScreenShutdown),
  createScreensFrom(IntroScreenInit, IntroScreenHandle, IntroScreenShutdown),
  createScreensFrom(CreditScreenInit, CreditScreenHandle, CreditScreenShutdown),

  createScreensFrom(QuestDebugScreenInit, QuestDebugScreenHandle, QuestDebugScreenShutdown),
];

}
