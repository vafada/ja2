namespace ja2 {
  const ENV_TIME_00 = 0;
  const ENV_TIME_01 = 1;
  const ENV_TIME_02 = 2;
  const ENV_TIME_03 = 3;
  const ENV_TIME_04 = 4;
  const ENV_TIME_05 = 5;
  const ENV_TIME_06 = 6;
  const ENV_TIME_07 = 7;
  const ENV_TIME_08 = 8;
  const ENV_TIME_09 = 9;
  const ENV_TIME_10 = 10;
  const ENV_TIME_11 = 11;
  const ENV_TIME_12 = 12;
  const ENV_TIME_13 = 13;
  const ENV_TIME_14 = 14;
  const ENV_TIME_15 = 15;
  const ENV_TIME_16 = 16;
  const ENV_TIME_17 = 17;
  const ENV_TIME_18 = 18;
  const ENV_TIME_19 = 19;
  const ENV_TIME_20 = 20;
  const ENV_TIME_21 = 21;
  const ENV_TIME_22 = 22;
  const ENV_TIME_23 = 23;

  const ENV_NUM_TIMES = 24;

  // Make sure you use 24 for end time hours and 0 for start time hours if
  // midnight is the hour you wish to use.
  export const NIGHT_TIME_LIGHT_START_HOUR = 21;
  export const NIGHT_TIME_LIGHT_END_HOUR = 7;
  export const PRIME_TIME_LIGHT_START_HOUR = 21;
  export const PRIME_TIME_LIGHT_END_HOUR = 24;

  const WEATHER_FORECAST_SUNNY = 0x00000001;
  const WEATHER_FORECAST_OVERCAST = 0x00000002;
  const WEATHER_FORECAST_PARTLYSUNNY = 0x00000004;
  const WEATHER_FORECAST_DRIZZLE = 0x00000008;
  export const WEATHER_FORECAST_SHOWERS = 0x00000010;
  export const WEATHER_FORECAST_THUNDERSHOWERS = 0x00000020;

  // higher is darker, remember
  export const NORMAL_LIGHTLEVEL_NIGHT = 12;
  export const NORMAL_LIGHTLEVEL_DAY = 3;
}
