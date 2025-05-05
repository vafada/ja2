namespace ja2 {
  // GLOBALS FOR CHEAT MODE......
  // FIXME: Language-specific code
  // #ifdef GERMAN
  // #define STARTING_CHEAT_LEVEL 0
  // #else
  export const STARTING_CHEAT_LEVEL = 0;
  // #endif

  // FIXME: Language-specific code
  // #ifdef GERMAN
  //
  // // ATE: remove cheats unless we're doing a debug build
  // //#ifdef JA2TESTVERSION
  // #define INFORMATION_CHEAT_LEVEL() (gubCheatLevel >= 5)
  // #define CHEATER_CHEAT_LEVEL() (gubCheatLevel >= 6)
  // #define DEBUG_CHEAT_LEVEL() (gubCheatLevel >= 7)
  // //#else
  // //	#define						INFORMATION_CHEAT_LEVEL( )			( FALSE )
  // //	#define						CHEATER_CHEAT_LEVEL( )					( FALSE )
  // //	#define						DEBUG_CHEAT_LEVEL( )					  ( FALSE )
  // //#endif
  //
  // #define RESET_CHEAT_LEVEL() (gubCheatLevel = 0)
  //
  // #else

  // ATE: remove cheats unless we're doing a debug build
  //#ifdef JA2TESTVERSION
  export const INFORMATION_CHEAT_LEVEL = () => gubCheatLevel >= 3;
  export const CHEATER_CHEAT_LEVEL = () => gubCheatLevel >= 5;
  export const DEBUG_CHEAT_LEVEL = () => gubCheatLevel >= 6;
  //#else
  //	#define						INFORMATION_CHEAT_LEVEL( )			( FALSE )
  //	#define						CHEATER_CHEAT_LEVEL( )					( FALSE )
  //	#define						DEBUG_CHEAT_LEVEL( )					  ( FALSE )
  //#endif

  export const RESET_CHEAT_LEVEL = () => (gubCheatLevel = 0);
  // #endif
}
