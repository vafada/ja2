namespace ja2 {
  // Each screen in the game comes with a Status flag (what was the last thing the screen was doing), an Initialization
  // function (which loads up the screen if necessary), a Handler function which is called while the screen is showing and
  // a shutdown function which is called when the screen is getting ready to make another screen active.

  export interface Screens {
    InitializeScreen: () => boolean;
    HandleScreen: () => UINT32;
    ShutdownScreen: () => boolean;
  }

  export function createScreensFrom(
    InitializeScreen: () => boolean,
    HandleScreen: () => UINT32,
    ShutdownScreen: () => boolean,
  ): Screens {
    return {
      InitializeScreen,
      HandleScreen,
      ShutdownScreen,
    };
  }

  // These defines are used as flags for each screen state. The only legal transition of states is
  // SCR_INACTIVE -> SCR_INITIALIZING -> SCR_ACTIVE -> SCR_SHUTTING_DOWN -> SCR_INACTIVE ... Anything else
  // will cause the system to yak.

  const SCR_INACTIVE = 0x00;
  const SCR_INITIALIZING = 0x01;
  const SCR_ACTIVE = 0x02;
  const SCR_SHUTTING_DOWN = 0x04;

  // This extern is made available to make sure that external modules will have access to the screen information

  // We must include all the following .H files which have prototypes for all the initialization, handler and shutdown
  // functions for all the screens. There should be as many includes as there are screens.
}
