namespace ja2 {
  // effects whether or not time of day effects the lighting.  Underground
  // maps have an ambient light level that is saved in the map, and doesn't change.
  export let gfBasement: boolean = false;
  export let gfCaves: boolean = false;

  const ENV_TOD_FLAGS_DAY = 0x00000001;
  const ENV_TOD_FLAGS_DAWN = 0x00000002;
  const ENV_TOD_FLAGS_DUSK = 0x00000004;
  const ENV_TOD_FLAGS_NIGHT = 0x00000008;

  /*
#define		DAWNLIGHT_START											( 5 * 60 )
#define		DAWN_START													( 6 * 60 )
#define   DAY_START														( 8 * 60 )
#define		TWILLIGHT_START											( 19 * 60 )
#define		DUSK_START													( 20 * 60 )
#define   NIGHT_START													( 22 * 60 )
*/
  const DAWN_START = 6 * 60 + 47; // 6:47AM
  const DAY_START = 7 * 60 + 5; // 7:05AM
  const DUSK_START = 20 * 60 + 57; // 8:57PM
  const NIGHT_START = 21 * 60 + 15; // 9:15PM

  const DAWN_TO_DAY = DAY_START - DAWN_START;
  const DAY_TO_DUSK = DUSK_START - DAY_START;
  const DUSK_TO_NIGHT = NIGHT_START - DUSK_START;
  const NIGHT_TO_DAWN = 24 * 60 - NIGHT_START + DAWN_START;

  export let guiEnvWeather: UINT32 = 0;
  export let guiRainLoop: UINT32 = NO_SAMPLE;

  // frame cues for lightning
  let ubLightningTable: UINT8[][][] /* [3][10][2] */ = [
    [
      [0, 15],
      [1, 0],
      [2, 0],
      [3, 6],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
    ],

    [
      [0, 15],
      [1, 0],
      [2, 0],
      [3, 6],
      [4, 0],
      [5, 15],
      [6, 0],
      [7, 6],
      [8, 0],
      [9, 0],
    ],

    [
      [0, 15],
      [1, 0],
      [2, 15],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
    ],
  ];

  // CJC: I don't think these are used anywhere!
  let guiTODFlags: UINT8[] /* [ENV_NUM_TIMES] */ = [
    ENV_TOD_FLAGS_NIGHT, // 00
    ENV_TOD_FLAGS_NIGHT, // 01
    ENV_TOD_FLAGS_NIGHT, // 02
    ENV_TOD_FLAGS_NIGHT, // 03
    ENV_TOD_FLAGS_NIGHT, // 04
    ENV_TOD_FLAGS_DAWN, // 05
    ENV_TOD_FLAGS_DAWN, // 06
    ENV_TOD_FLAGS_DAWN, // 07
    ENV_TOD_FLAGS_DAY, // 08
    ENV_TOD_FLAGS_DAY, // 09
    ENV_TOD_FLAGS_DAY, // 10
    ENV_TOD_FLAGS_DAY, // 11
    ENV_TOD_FLAGS_DAY, // 12
    ENV_TOD_FLAGS_DAY, // 13
    ENV_TOD_FLAGS_DAY, // 14
    ENV_TOD_FLAGS_DAY, // 15
    ENV_TOD_FLAGS_DAY, // 16
    ENV_TOD_FLAGS_DAY, // 17
    ENV_TOD_FLAGS_DAY, // 18
    ENV_TOD_FLAGS_DUSK, // 19
    ENV_TOD_FLAGS_DUSK, // 20
    ENV_TOD_FLAGS_DUSK, // 21
    ENV_TOD_FLAGS_NIGHT, // 22
    ENV_TOD_FLAGS_NIGHT, // 23
  ];

  const enum Enum302 {
    COOL,
    WARM,
    HOT,
  }

  const enum Enum303 {
    TEMPERATURE_DESERT_COOL,
    TEMPERATURE_DESERT_WARM,
    TEMPERATURE_DESERT_HOT,
    TEMPERATURE_GLOBAL_COOL,
    TEMPERATURE_GLOBAL_WARM,
    TEMPERATURE_GLOBAL_HOT,
  }

  const DESERT_WARM_START = 8 * 60;
  const DESERT_HOT_START = 9 * 60;
  const DESERT_HOT_END = 17 * 60;
  const DESERT_WARM_END = 19 * 60;

  const GLOBAL_WARM_START = 9 * 60;
  const GLOBAL_HOT_START = 12 * 60;
  const GLOBAL_HOT_END = 14 * 60;
  const GLOBAL_WARM_END = 17 * 60;

  const HOT_DAY_LIGHTLEVEL = 2;

  let fTimeOfDayControls: boolean = true;
  export let guiEnvTime: UINT32 = 0;
  export let guiEnvDay: UINT32 = 0;
  export let gubEnvLightValue: UINT8 = 0;
  export let gfDoLighting: boolean = false;

  export let gubDesertTemperature: UINT8 = 0;
  export let gubGlobalTemperature: UINT8 = 0;

  // polled by the game to handle time/atmosphere changes from gamescreen
  export function EnvironmentController(fCheckForLights: boolean): void {
    let uiOldWorldHour: UINT32;
    let ubLightAdjustFromWeather: UINT8 = 0;

    // do none of this stuff in the basement or caves
    if (gfBasement || gfCaves) {
      guiEnvWeather &= ~WEATHER_FORECAST_THUNDERSHOWERS;
      guiEnvWeather &= ~WEATHER_FORECAST_SHOWERS;

      if (guiRainLoop != NO_SAMPLE) {
        SoundStop(guiRainLoop);
        guiRainLoop = NO_SAMPLE;
      }
      return;
    }

    if (fTimeOfDayControls) {
      uiOldWorldHour = GetWorldHour();

      // If hour is different
      if (uiOldWorldHour != guiEnvTime) {
        // Hour change....

        guiEnvTime = uiOldWorldHour;
      }

      // ExecuteStrategicEventsUntilTimeStamp( (UINT16)GetWorldTotalMin( ) );

      // Polled weather stuff...
      // ONly do indooors
      if (!gfBasement && !gfCaves) {
      }

      if (gfDoLighting && fCheckForLights) {
        // Adjust light level based on weather...
        ubLightAdjustFromWeather = GetTimeOfDayAmbientLightLevel();

        // ONly do indooors
        if (!gfBasement && !gfCaves) {
        }

        LightSetBaseLevel(ubLightAdjustFromWeather);

        // Update Merc Lights since the above function modifies it.
        HandlePlayerTogglingLightEffects(false);

        // Make teams look for all
        // AllTeamsLookForAll( FALSE );

        // Set global light value
        SetRenderFlags(RENDER_FLAG_FULL);
        gfDoLighting = false;
      }
    }
  }

  export function BuildDayLightLevels(): void {
    let uiLoop: UINT32;
    let uiHour: UINT32;

    /*
  // Dawn; light 12
  AddEveryDayStrategicEvent( EVENT_CHANGELIGHTVAL, DAWNLIGHT_START, NORMAL_LIGHTLEVEL_NIGHT - 1 );

  // loop from light 12 down to light 4
  for (uiLoop = 1; uiLoop < 8; uiLoop++)
  {
          AddEveryDayStrategicEvent( EVENT_CHANGELIGHTVAL, DAWN_START + 15 * uiLoop,	NORMAL_LIGHTLEVEL_NIGHT - 1 - uiLoop );
  }
  */

    // Transition from night to day
    for (uiLoop = 0; uiLoop < 9; uiLoop++) {
      AddEveryDayStrategicEvent(
        Enum132.EVENT_CHANGELIGHTVAL,
        DAWN_START + 2 * uiLoop,
        NORMAL_LIGHTLEVEL_NIGHT - 1 - uiLoop,
      );
    }

    // Add events for hot times
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TEMPERATURE_UPDATE,
      DESERT_WARM_START,
      Enum303.TEMPERATURE_DESERT_WARM,
    );
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TEMPERATURE_UPDATE,
      DESERT_HOT_START,
      Enum303.TEMPERATURE_DESERT_HOT,
    );
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TEMPERATURE_UPDATE,
      DESERT_HOT_END,
      Enum303.TEMPERATURE_DESERT_WARM,
    );
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TEMPERATURE_UPDATE,
      DESERT_WARM_END,
      Enum303.TEMPERATURE_DESERT_COOL,
    );

    AddEveryDayStrategicEvent(
      Enum132.EVENT_TEMPERATURE_UPDATE,
      GLOBAL_WARM_START,
      Enum303.TEMPERATURE_GLOBAL_WARM,
    );
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TEMPERATURE_UPDATE,
      GLOBAL_HOT_START,
      Enum303.TEMPERATURE_GLOBAL_HOT,
    );
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TEMPERATURE_UPDATE,
      GLOBAL_HOT_END,
      Enum303.TEMPERATURE_GLOBAL_WARM,
    );
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TEMPERATURE_UPDATE,
      GLOBAL_WARM_END,
      Enum303.TEMPERATURE_GLOBAL_COOL,
    );

    /*
          // Twilight; light 5
          AddEveryDayStrategicEvent( EVENT_CHANGELIGHTVAL, TWILLIGHT_START, NORMAL_LIGHTLEVEL_DAY + 1 );

          // Dusk; loop from light 5 up to 12
          for (uiLoop = 1; uiLoop < 8; uiLoop++)
          {
                  AddEveryDayStrategicEvent( EVENT_CHANGELIGHTVAL, DUSK_START + 15 * uiLoop, NORMAL_LIGHTLEVEL_DAY + 1 + uiLoop );
          }
  */

    // Transition from day to night
    for (uiLoop = 0; uiLoop < 9; uiLoop++) {
      AddEveryDayStrategicEvent(
        Enum132.EVENT_CHANGELIGHTVAL,
        DUSK_START + 2 * uiLoop,
        NORMAL_LIGHTLEVEL_DAY + 1 + uiLoop,
      );
    }

    // Set up the scheduling for turning lights on and off based on the various types.
    uiHour =
      <number>NIGHT_TIME_LIGHT_START_HOUR == 24
        ? 0
        : NIGHT_TIME_LIGHT_START_HOUR;
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TURN_ON_NIGHT_LIGHTS,
      uiHour * 60,
      0,
    );
    uiHour =
      <number>NIGHT_TIME_LIGHT_END_HOUR == 24 ? 0 : NIGHT_TIME_LIGHT_END_HOUR;
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TURN_OFF_NIGHT_LIGHTS,
      uiHour * 60,
      0,
    );
    uiHour =
      <number>PRIME_TIME_LIGHT_START_HOUR == 24
        ? 0
        : PRIME_TIME_LIGHT_START_HOUR;
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TURN_ON_PRIME_LIGHTS,
      uiHour * 60,
      0,
    );
    uiHour =
      <number>PRIME_TIME_LIGHT_END_HOUR == 24 ? 0 : PRIME_TIME_LIGHT_END_HOUR;
    AddEveryDayStrategicEvent(
      Enum132.EVENT_TURN_OFF_PRIME_LIGHTS,
      uiHour * 60,
      0,
    );
  }

  export function BuildDayAmbientSounds(): void {
    let cnt: INT32;

    // Add events!
    for (cnt = 0; cnt < gsNumAmbData; cnt++) {
      switch (gAmbData[cnt].ubTimeCatagory) {
        case AMB_TOD_DAWN:
          AddSameDayRangedStrategicEvent(
            Enum132.EVENT_AMBIENT,
            DAWN_START,
            DAWN_TO_DAY,
            cnt,
          );
          break;
        case AMB_TOD_DAY:
          AddSameDayRangedStrategicEvent(
            Enum132.EVENT_AMBIENT,
            DAY_START,
            DAY_TO_DUSK,
            cnt,
          );
          break;
        case AMB_TOD_DUSK:
          AddSameDayRangedStrategicEvent(
            Enum132.EVENT_AMBIENT,
            DUSK_START,
            DUSK_TO_NIGHT,
            cnt,
          );
          break;
        case AMB_TOD_NIGHT:
          AddSameDayRangedStrategicEvent(
            Enum132.EVENT_AMBIENT,
            NIGHT_START,
            NIGHT_TO_DAWN,
            cnt,
          );
          break;
      }
    }

    guiRainLoop = NO_SAMPLE;
  }

  export function ForecastDayEvents(): void {
    let uiOldDay: UINT32;
    let uiStartTime: UINT32;
    let uiEndTime: UINT32;
    let ubStormIntensity: UINT8;
    //	UINT32 cnt;

    // Get current day and see if different
    if ((uiOldDay = GetWorldDay()) != guiEnvDay) {
      // It's a new day, forecast weather
      guiEnvDay = uiOldDay;

      // Set light level changes
      // BuildDayLightLevels();

      // Build ambient sound queues
      BuildDayAmbientSounds();

      // Build weather....

      // ATE: Don't forecast if start of game...
      if (guiEnvDay > 1) {
        // Should it rain...?
        if (Random(100) < 20) {
          // Add rain!
          // Between 6:00 and 10:00
          uiStartTime = 360 + Random(1080);
          // Between 5 - 15 miniutes
          uiEndTime = uiStartTime + (5 + Random(10));

          ubStormIntensity = 0;

          // Randomze for a storm!
          if (Random(10) < 5) {
            ubStormIntensity = 1;
          }

          // ATE: Disable RAIN!
          //			AddSameDayRangedStrategicEvent( EVENT_RAINSTORM, uiStartTime, uiEndTime - uiStartTime, ubStormIntensity );

          // AddSameDayStrategicEvent( EVENT_BEGINRAINSTORM, uiStartTime, ubStormIntensity );
          // AddSameDayStrategicEvent( EVENT_ENDRAINSTORM,		uiEndTime, 0 );
        }
      }
    }
  }

  function EnvEnableTOD(): void {
    fTimeOfDayControls = true;
  }

  function EnvDisableTOD(): void {
    fTimeOfDayControls = false;
  }

  function EnvDoLightning(): void {
    /* static */ let uiCount: UINT32 = 0;
    /* static */ let uiIndex: UINT32 = 0;
    /* static */ let uiStrike: UINT32 = 0;
    /* static */ let uiFrameNext: UINT32 = 1000;
    /* static */ let ubLevel: UINT8 = 0;
    /* static */ let ubLastLevel: UINT8 = 0;

    if (gfPauseDueToPlayerGamePause) {
      return;
    }

    uiCount++;
    if (uiCount >= uiFrameNext + 10) {
      uiCount = 0;
      uiIndex = 0;
      ubLevel = 0;
      ubLastLevel = 0;

      uiStrike = Random(3);
      uiFrameNext = 1000 + Random(1000);
    } else if (uiCount >= uiFrameNext) {
      if (uiCount == uiFrameNext) {
        // EnvStopCrickets();
        PlayJA2Ambient(Enum331.LIGHTNING_1 + Random(2), HIGHVOLUME, 1);
      }

      while (uiCount > ubLightningTable[uiStrike][uiIndex][0] + uiFrameNext)
        uiIndex++;

      ubLastLevel = ubLevel;
      ubLevel = ubLightningTable[uiStrike][uiIndex][1];

      // ATE: Don't modify if scrolling!
      if (gfScrollPending || gfScrollInertia) {
      } else {
        if (ubLastLevel != ubLevel) {
          if (ubLevel > ubLastLevel) {
            LightAddBaseLevel(0, ubLevel - ubLastLevel);
            if (ubLevel > 0) RenderSetShadows(true);
          } else {
            LightSubtractBaseLevel(0, ubLastLevel - ubLevel);
            if (ubLevel > 0) RenderSetShadows(true);
          }
          SetRenderFlags(RENDER_FLAG_FULL);
        }
      }
    }
  }

  export function GetTimeOfDayAmbientLightLevel(): UINT8 {
    if (
      SectorTemperature(
        GetWorldMinutesInDay(),
        gWorldSectorX,
        gWorldSectorY,
        gbWorldSectorZ,
      ) == Enum302.HOT
    ) {
      return HOT_DAY_LIGHTLEVEL;
    } else {
      return gubEnvLightValue;
    }
  }

  function EnvBeginRainStorm(ubIntensity: UINT8): void {
    if (!gfBasement && !gfCaves) {
      gfDoLighting = true;

      if (ubIntensity == 1) {
        // Turn on rain storms
        guiEnvWeather |= WEATHER_FORECAST_THUNDERSHOWERS;
      } else {
        guiEnvWeather |= WEATHER_FORECAST_SHOWERS;
      }
    }
  }

  function EnvEndRainStorm(): void {
    gfDoLighting = true;

    guiEnvWeather &= ~WEATHER_FORECAST_THUNDERSHOWERS;
    guiEnvWeather &= ~WEATHER_FORECAST_SHOWERS;
  }

  export function TurnOnNightLights(): void {
    let i: INT32;
    for (i = 0; i < MAX_LIGHT_SPRITES; i++) {
      if (
        LightSprites[i].uiFlags & LIGHT_SPR_ACTIVE &&
        LightSprites[i].uiFlags & LIGHT_NIGHTTIME &&
        !(LightSprites[i].uiFlags & (LIGHT_SPR_ON | MERC_LIGHT))
      ) {
        LightSpritePower(i, true);
      }
    }
  }

  export function TurnOffNightLights(): void {
    let i: INT32;
    for (i = 0; i < MAX_LIGHT_SPRITES; i++) {
      if (
        LightSprites[i].uiFlags & LIGHT_SPR_ACTIVE &&
        LightSprites[i].uiFlags & LIGHT_NIGHTTIME &&
        LightSprites[i].uiFlags & LIGHT_SPR_ON &&
        !(LightSprites[i].uiFlags & MERC_LIGHT)
      ) {
        LightSpritePower(i, false);
      }
    }
  }

  export function TurnOnPrimeLights(): void {
    let i: INT32;
    for (i = 0; i < MAX_LIGHT_SPRITES; i++) {
      if (
        LightSprites[i].uiFlags & LIGHT_SPR_ACTIVE &&
        LightSprites[i].uiFlags & LIGHT_PRIMETIME &&
        !(LightSprites[i].uiFlags & (LIGHT_SPR_ON | MERC_LIGHT))
      ) {
        LightSpritePower(i, true);
      }
    }
  }

  export function TurnOffPrimeLights(): void {
    let i: INT32;
    for (i = 0; i < MAX_LIGHT_SPRITES; i++) {
      if (
        LightSprites[i].uiFlags & LIGHT_SPR_ACTIVE &&
        LightSprites[i].uiFlags & LIGHT_PRIMETIME &&
        LightSprites[i].uiFlags & LIGHT_SPR_ON &&
        !(LightSprites[i].uiFlags & MERC_LIGHT)
      ) {
        LightSpritePower(i, false);
      }
    }
  }

  export function UpdateTemperature(ubTemperatureCode: UINT8): void {
    switch (ubTemperatureCode) {
      case Enum303.TEMPERATURE_DESERT_COOL:
        gubDesertTemperature = 0;
        break;
      case Enum303.TEMPERATURE_DESERT_WARM:
        gubDesertTemperature = 1;
        break;
      case Enum303.TEMPERATURE_DESERT_HOT:
        gubDesertTemperature = 2;
        break;
      case Enum303.TEMPERATURE_GLOBAL_COOL:
        gubGlobalTemperature = 0;
        break;
      case Enum303.TEMPERATURE_GLOBAL_WARM:
        gubGlobalTemperature = 1;
        break;
      case Enum303.TEMPERATURE_GLOBAL_HOT:
        gubGlobalTemperature = 2;
        break;
    }
    gfDoLighting = true;
  }

  export function SectorTemperature(
    uiTime: UINT32,
    sSectorX: INT16,
    sSectorY: INT16,
    bSectorZ: INT8,
  ): INT8 {
    if (bSectorZ > 0) {
      // cool underground
      return 0;
    } else if (IsSectorDesert(sSectorX, sSectorY)) {
      // is desert
      return gubDesertTemperature;
    } else {
      return gubGlobalTemperature;
    }
  }
}
