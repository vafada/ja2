namespace ja2 {
  // Defines for Anim inst reading, taken from orig Jagged
  const ANIMFILENAME = "BINARYDATA\\ja2bin.dat";

  const EMPTY_INDEX = 999;

  const NUM_INJURED_SUBS = 1;

  interface ANIMSUBTYPE {
    usAnimState: UINT16;
    usAnimationSurfaces: UINT16[] /* [4] */;
  }

  function createAnimationSubTypeFrom(
    usAnimState: UINT16,
    usAnimationSurfaces: UINT16[],
  ): ANIMSUBTYPE {
    return {
      usAnimState,
      usAnimationSurfaces,
    };
  }

  // Block for anim file
  export let gusAnimInst: UINT16[][] /* [MAX_ANIMATIONS][MAX_FRAMES_PER_ANIM] */ =
    createArrayFrom(MAX_ANIMATIONS, () => createArray(MAX_FRAMES_PER_ANIM, 0));

  // OK, this array contains definitions for random animations based on bodytype, total # allowed, and what is in their hand....
  export let gRandomAnimDefs: RANDOM_ANI_DEF[][] /* [TOTALBODYTYPES][MAX_RANDOM_ANIMS_PER_BODYTYPE] */ =
    createArrayFrom(Enum194.TOTALBODYTYPES, () =>
      createArrayFrom(
        MAX_RANDOM_ANIMS_PER_BODYTYPE,
        createRandomAnimationDefinition,
      ),
    );

  export let gAnimControl: ANIMCONTROLTYPE[] /* [NUMANIMATIONSTATES] */ = [
    // NAME								//AP		//SPEED	  // MOVE	// FLAGS						// HEIGHT

    // WALKING
    createAnimationControlTypeFrom(
      "WALKING",
      20,
      0,
      1.6,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_RAISE_WEAPON |
        ANIM_VARIABLE_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Breathing
    createAnimationControlTypeFrom(
      "STANDING",
      0,
      0,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_RAISE_WEAPON |
        ANIM_VARIABLE_EFFORT |
        ANIM_BREATH,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // KNEEL DOWN
    createAnimationControlTypeFrom(
      "KNEEL DOWN",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOMOVE_MARKER |
        ANIM_STANCECHANGEANIM |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_CROUCH,
      -1,
    ),

    // CROUCHING
    createAnimationControlTypeFrom(
      "CROUCHED",
      0,
      0,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_RAISE_WEAPON |
        ANIM_NO_EFFORT |
        ANIM_BREATH,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // KNEEL UP
    createAnimationControlTypeFrom(
      "KNEEL UP",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOMOVE_MARKER |
        ANIM_STANCECHANGEANIM |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_CROUCH,
      ANIM_STAND,
      -1,
    ),

    // SWAT
    createAnimationControlTypeFrom(
      "SWAT",
      0,
      0,
      2.2,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // RUN
    createAnimationControlTypeFrom(
      "RUN",
      0,
      0,
      2.6,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_RAISE_WEAPON |
        ANIM_MODERATE_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // PRONE DOWN
    createAnimationControlTypeFrom(
      "PRONE DOWN",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_NOMOVE_MARKER |
        ANIM_STANCECHANGEANIM |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_CROUCH,
      ANIM_PRONE,
      -1,
    ),

    // CRAWL
    createAnimationControlTypeFrom(
      "CRAWL",
      0,
      0,
      0.8,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_RAISE_WEAPON |
        ANIM_MODERATE_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // PRONE UP
    createAnimationControlTypeFrom(
      "PRONE UP",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_NOMOVE_MARKER |
        ANIM_STANCECHANGEANIM |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_PRONE,
      ANIM_CROUCH,
      -1,
    ),

    // PRONE BREATHING
    createAnimationControlTypeFrom(
      "PRONE",
      0,
      0,
      0,
      ANIM_STATIONARY |
        ANIM_FASTTURN |
        ANIM_RAISE_WEAPON |
        ANIM_NO_EFFORT |
        ANIM_BREATH,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // READY_RIFLE_STAND
    createAnimationControlTypeFrom(
      "READY AIM (R) STAND",
      0,
      0,
      0,
      ANIM_OK_CHARGE_AP_FOR_TURN |
        ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_RAISE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // AIM_RIFLE_STAND
    createAnimationControlTypeFrom(
      "AIM (R) STAND",
      0,
      250,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FIREREADY |
        ANIM_FASTTURN |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // SHOOT_RIFLE_STAND
    createAnimationControlTypeFrom(
      "SHOOT (R) STAND",
      0,
      100,
      0,
      ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_FIRE |
        ANIM_RT_NONINTERRUPT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // END_RIFLE_STAND
    createAnimationControlTypeFrom(
      "END RIFLE STAND",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_NOCHANGE_PENDINGCOUNT |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // FROM CROUCH TO SWAT
    createAnimationControlTypeFrom(
      "CROUCH TO SWAT",
      0,
      40,
      1.3,
      ANIM_MOVING | ANIM_TURNING | ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // FROM SWAT TO CROUCH
    createAnimationControlTypeFrom(
      "SWAT TO CROUCH",
      0,
      40,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // FLYBACK HIT ANIMATION
    createAnimationControlTypeFrom(
      "FLYBACK HIT",
      0,
      80,
      1.6,
      ANIM_SPECIALMOVE |
        ANIM_HITSTART |
        ANIM_HITFINISH |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // READY_RIFLE_PRONE
    createAnimationControlTypeFrom(
      "READY (R) PRONE",
      0,
      150,
      0,
      ANIM_OK_CHARGE_AP_FOR_TURN |
        ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // AIM_RIFLE_PRONE
    createAnimationControlTypeFrom(
      "AIM (R) PRONE",
      0,
      250,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FIREREADY |
        ANIM_FASTTURN |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // SHOOT_RIFLE_PRONE
    createAnimationControlTypeFrom(
      "SHOOT (R) PRONE",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_FIRE |
        ANIM_RT_NONINTERRUPT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // END_RIFLE_PRONE
    createAnimationControlTypeFrom(
      "END (R) AIM PRONE",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_NOCHANGE_PENDINGCOUNT |
        ANIM_MIN_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // DEATH TWITCH ONE
    createAnimationControlTypeFrom(
      "DEATH TWITCH ONE",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // GENERIC_HIT STANDING
    createAnimationControlTypeFrom(
      "GENERIC HIT STAND",
      0,
      130,
      0,
      ANIM_STATIONARY |
        ANIM_HITSTART |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // FLYBACK HIT ANIMATION W/ BLOOD
    createAnimationControlTypeFrom(
      "FLYBACK HIT w/B",
      0,
      80,
      1.6,
      ANIM_SPECIALMOVE |
        ANIM_HITSTART |
        ANIM_HITFINISH |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FLYBACK HIT DEATH
    createAnimationControlTypeFrom(
      "FLYBACK HIT DEATH",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // READY_RIFLE_CROUCH
    createAnimationControlTypeFrom(
      "READY (R) CROUCH",
      0,
      150,
      0,
      ANIM_OK_CHARGE_AP_FOR_TURN |
        ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // AIM_RIFLE_CROUCH
    createAnimationControlTypeFrom(
      "AIM (R) CROUCH",
      0,
      250,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FIREREADY |
        ANIM_FASTTURN |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // SHOOT_RIFLE_CROUCH
    createAnimationControlTypeFrom(
      "SHOOT (R) CROUCH",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_FIRE |
        ANIM_RT_NONINTERRUPT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // END_RIFLE_CROUCH
    createAnimationControlTypeFrom(
      "END (R) CROUCH",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_NOCHANGE_PENDINGCOUNT |
        ANIM_MIN_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // FALLBACK HIT STANDING
    createAnimationControlTypeFrom(
      "FALLBACK HIT STAND",
      0,
      130,
      1.6,
      ANIM_SPECIALMOVE |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // ROLLOVER
    createAnimationControlTypeFrom(
      "ROOLOVER",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // CLIMBROOF
    createAnimationControlTypeFrom(
      "CLIMBROOF",
      0,
      30,
      0,
      ANIM_NONINTERRUPT |
        ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_NOSHOW_MARKER |
        ANIM_MODERATE_EFFORT |
        ANIM_LOWER_WEAPON,
      ANIM_STAND,
      ANIM_CROUCH,
      -1,
    ),

    // FALL
    createAnimationControlTypeFrom(
      "FALL",
      0,
      60,
      0,
      ANIM_NONINTERRUPT |
        ANIM_STATIONARY |
        ANIM_HITFINISH |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // GETUP FROM ROLLOVER
    createAnimationControlTypeFrom(
      "GETUP FROM ROLLOVER",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_STAND,
      -1,
    ),

    // CLIMBDOWNROOF
    createAnimationControlTypeFrom(
      "CLIMBDOWNROOF",
      0,
      30,
      0,
      ANIM_NONINTERRUPT |
        ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_NOSHOW_MARKER |
        ANIM_MODERATE_EFFORT |
        ANIM_LOWER_WEAPON,
      ANIM_CROUCH,
      ANIM_STAND,
      -1,
    ),

    // FALL FORWARD
    createAnimationControlTypeFrom(
      "FALL FORWARD ROOF",
      0,
      60,
      0,
      ANIM_NONINTERRUPT |
        ANIM_STATIONARY |
        ANIM_HITFINISH |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // GENERIC HIT DEATHTWICH NO BLOOD
    createAnimationControlTypeFrom(
      "BELLY DEATHHIT NB",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // GENERIC HIT DEATHTWICH BLOOD
    createAnimationControlTypeFrom(
      "BELLY DEATHHIT B",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FALLBACK HIT DEATHTWICH NO BLOOD
    createAnimationControlTypeFrom(
      "FALLBACK DEATHHIT NB",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FALLBACK HIT DEATHTWICH BLOOD
    createAnimationControlTypeFrom(
      "FALLBACK DEATHHIT B",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // GENERIC HIT DEATH
    createAnimationControlTypeFrom(
      "BELLY HIT DEATH",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FALLBACK HIT DEATH
    createAnimationControlTypeFrom(
      "FALLBACK HIT DEATH",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // GENERIC HIT CROUCHED
    createAnimationControlTypeFrom(
      "GENERIC HIT CROUCH",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // STAND BURST
    createAnimationControlTypeFrom(
      "STAND BURST SHOOT",
      0,
      100,
      0,
      ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_FIRE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // STANDING BURST HIT
    createAnimationControlTypeFrom(
      "STAND BUTST HIT",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // FALL FORWARD FROM HIT STAND
    createAnimationControlTypeFrom(
      "FALL FROM STAND",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // FALL FORWARD FROM HIT CROUCH
    createAnimationControlTypeFrom(
      "FALL FROM CROUCH",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_CROUCH,
      ANIM_PRONE,
      -1,
    ),

    // END FALL FORWARD FROM HIT CROUCH
    createAnimationControlTypeFrom(
      "END FALL F CROUCH",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // GENERIC HIT PRONE
    createAnimationControlTypeFrom(
      "GENERIC HIT PRONE",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // PRONE HIT DEATH
    createAnimationControlTypeFrom(
      "PRONE HIT DEATH",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // PRONE LAY FROM HIT
    createAnimationControlTypeFrom(
      "PRONE LAY FROM HIT",
      0,
      160,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // PRONE HIT DEATHTWICH NO BLOOD
    createAnimationControlTypeFrom(
      "PRONE DEATHHIT NB",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // PRONE HIT DEATHTWICH BLOOD
    createAnimationControlTypeFrom(
      "PRONE DEATHHIT B",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FEMALE MONSTER BREATHING
    createAnimationControlTypeFrom(
      "FEMADMON BREATHING",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // FEMALE MONSTER BREATHING
    createAnimationControlTypeFrom(
      "FEMADMON WALKING",
      0,
      30,
      2.5,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // FEMALE MONSTER ATTACK
    createAnimationControlTypeFrom(
      "FEMADMON ATTACK",
      0,
      70,
      2.5,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FLYBACK HIT DEATH STOP",
      0,
      120,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "BELLY HIT DEATH STOP",
      0,
      120,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FALLBACK HIT DEATH STOP",
      0,
      120,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "PRONE HIT DEATH STOP",
      0,
      120,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FLYBACK HIT STOP",
      0,
      70,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FALLBACK HIT STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FALLOFF STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FALLOFF FORWARD HIT STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FALLFORWARD HIT STOP",
      0,
      650,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "PRONE_LAYFROMHIT STOP",
      0,
      70,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "HOP FENCE",
      0,
      50,
      0,
      ANIM_NOCHANGE_PENDINGCOUNT |
        ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_NOSHOW_MARKER |
        ANIM_MODERATE_EFFORT |
        ANIM_LOWER_WEAPON |
        ANIM_NONINTERRUPT,
      ANIM_STAND,
      ANIM_CROUCH,
      -1,
    ),

    // GENERIC HIT CROUCHED
    createAnimationControlTypeFrom(
      "FEMMONS HIT",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // FALL FORWARD FROM HIT STAND
    createAnimationControlTypeFrom(
      "FEMMONS DIE",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // FALL FORWARD FROM HIT STAND
    createAnimationControlTypeFrom(
      "FEMMONS DIE STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // Breathing
    createAnimationControlTypeFrom(
      "PUNCH BREATH",
      0,
      150,
      0,
      ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Punch
    createAnimationControlTypeFrom(
      "PUNCH",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NORESTART,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Breathing
    createAnimationControlTypeFrom(
      "NOTHING_STAND",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // JFK HIT DEATH
    createAnimationControlTypeFrom(
      "JFK HIT DEATH",
      0,
      160,
      0,
      ANIM_STATIONARY |
        ANIM_NONINTERRUPT |
        ANIM_HITSTART |
        ANIM_HITFINISH |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "JFK HIT DEATH STOP",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_HITSTOP |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "JFK DEATHHIT B",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // STAND BURST
    createAnimationControlTypeFrom(
      "STAND BURST SPREAD",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // FALLOFF DEATH
    createAnimationControlTypeFrom(
      "FALLOFF DEATH",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FALLOFF DEATH STOP
    createAnimationControlTypeFrom(
      "FALLOFF DEATH STOP",
      0,
      120,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FALLOFF TWITCHB
    createAnimationControlTypeFrom(
      "FALLOFF TWITCH BLOOD",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FALLOFF TWITCH NB
    createAnimationControlTypeFrom(
      "FALLOFF TWITCH NOBLOOD",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FALLOFF FORWARD DEATH
    createAnimationControlTypeFrom(
      "FALLOFF FORWARD DEATH",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FALLOFF FORWARD DEATH STOP
    createAnimationControlTypeFrom(
      "FALLOFF FORWARD DEATH STOP",
      0,
      120,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FALLOFF FORWARD TWITCHB
    createAnimationControlTypeFrom(
      "FALLOFF FORWARD TWITCH BLOOD",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FALLOFF TWITCH NB
    createAnimationControlTypeFrom(
      "FALLOFF FORWARD TWITCH NOBLOOD",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_HITWHENDOWN |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // OPEN DOOR
    createAnimationControlTypeFrom(
      "OPEN DOOR",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // OPEN STRUCT
    createAnimationControlTypeFrom(
      "OPEN STRUCT",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // OPEN STRUCT
    createAnimationControlTypeFrom(
      "PICKUP ITEM",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // DROP ITEM
    createAnimationControlTypeFrom(
      "DROP ITEM",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // SLICE
    createAnimationControlTypeFrom(
      "SLICE",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // STAB
    createAnimationControlTypeFrom(
      "STAB",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CROUCH STAB
    createAnimationControlTypeFrom(
      "CROUCH STAB",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // START GIVING AID
    createAnimationControlTypeFrom(
      "START AID",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // GIVING AID
    createAnimationControlTypeFrom(
      "GIVING AID",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // END GIVING AID
    createAnimationControlTypeFrom(
      "END AID",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_RAISE_WEAPON |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_PENDINGCOUNT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // DODGE ONE
    createAnimationControlTypeFrom(
      "DODGE ONE",
      0,
      40,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // FATCIV_ASSSCRATCH
    createAnimationControlTypeFrom(
      "FATCIV ASS SCRATCH",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // READY_RIFLE_STAND
    createAnimationControlTypeFrom(
      "READY AIM (DW) STAND",
      0,
      150,
      0,
      ANIM_OK_CHARGE_AP_FOR_TURN |
        ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // AIM_RIFLE_STAND
    createAnimationControlTypeFrom(
      "AIM (DW) STAND",
      0,
      250,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FIREREADY |
        ANIM_FASTTURN |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // SHOOT_RIFLE_STAND
    createAnimationControlTypeFrom(
      "SHOOT (DW) STAND",
      0,
      150,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_LIGHT_EFFORT | ANIM_FIRE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // END_RIFLE_STAND
    createAnimationControlTypeFrom(
      "END DUAL STAND",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOCHANGE_PENDINGCOUNT |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // RAISE RIFLE
    createAnimationControlTypeFrom(
      "RAISE RIFLE",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_NOMOVE_MARKER |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // LOWER RIFLE
    createAnimationControlTypeFrom(
      "LOWER RIFLE",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_NOMOVE_MARKER |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // BOD BLOW
    createAnimationControlTypeFrom(
      "BOD BLOW",
      0,
      200,
      0,
      ANIM_STATIONARY |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NONINTERRUPT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // THROW ITEM
    createAnimationControlTypeFrom(
      "THROW ITEM",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_NOMOVE_MARKER |
        ANIM_NONINTERRUPT |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // LOB ITEM
    createAnimationControlTypeFrom(
      "LOB ITEM",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_NOMOVE_MARKER |
        ANIM_NONINTERRUPT |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // QUEEN MONSTER STATIONARY
    createAnimationControlTypeFrom(
      "MONSTER_STATIONARY",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_NOMOVE_MARKER | ANIM_NO_EFFORT | ANIM_BREATH,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CROUCHED BURST
    createAnimationControlTypeFrom(
      "CROUCHED BURST SHOOT",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_LIGHT_EFFORT | ANIM_FIRE,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // PRONE BURST
    createAnimationControlTypeFrom(
      "PRONE BURST SHOOT",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_LIGHT_EFFORT | ANIM_FIRE,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),
    // 180
    createAnimationControlTypeFrom(
      "NOT USED 1",
      20,
      20,
      0.9,
      ANIM_MOVING | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // BIG GUY FLEX
    createAnimationControlTypeFrom(
      "BIG GUY FLEX",
      0,
      150,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_MERCIDLE | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // BIG GUY STRECH
    createAnimationControlTypeFrom(
      "BIG GUY STRECH",
      0,
      110,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_MERCIDLE | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // BIG GUY SOEDUST
    createAnimationControlTypeFrom(
      "BIG GUY SHOE DUST",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // BIG GUY HEADTURN
    createAnimationControlTypeFrom(
      "BIG GUY HEAD TURN",
      0,
      180,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // MINI GIRL STOCKING
    createAnimationControlTypeFrom(
      "MINI GIRL STOCKING",
      0,
      120,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // GIVE ITEM
    createAnimationControlTypeFrom(
      "GIVE ITEM",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CLIMB MOUNTIAIN
    createAnimationControlTypeFrom(
      "CLIMB MOUNTAIN",
      0,
      50,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NOSHOW_MARKER |
        ANIM_MODERATE_EFFORT,
      ANIM_STAND,
      ANIM_CROUCH,
      -1,
    ),

    createAnimationControlTypeFrom(
      "COW EATING",
      0,
      200,
      0.0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // COW HIT
    createAnimationControlTypeFrom(
      "COW HIT",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // COW DIE
    createAnimationControlTypeFrom(
      "COW DIE",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // COW DIE STOP
    createAnimationControlTypeFrom(
      "COW DIE STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // WATER HIT
    createAnimationControlTypeFrom(
      "WATER HIT",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // WATER DIE
    createAnimationControlTypeFrom(
      "WATER DIE",
      0,
      160,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // WATER DIE STOP
    createAnimationControlTypeFrom(
      "WATER DIE STOP",
      0,
      340,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "CROW WALK",
      0,
      80,
      1.6,
      ANIM_MOVING | ANIM_TURNING | ANIM_NORESTART | ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "CROW TAKEOFF",
      0,
      80,
      1.6,
      ANIM_MOVING | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "CROW LAND",
      0,
      80,
      1.6,
      ANIM_MOVING | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "CROW FLY",
      0,
      20,
      0.5,
      ANIM_SPECIALMOVE |
        ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "CROW EAT",
      0,
      80,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NORESTART | ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "HELIDROP",
      0,
      60,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_CROUCH,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FEM CLEAN",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FEM KICKSN",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FEM LOOK",
      0,
      180,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "FEM WIPE",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "REG SQUISH",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "REG PULL",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "REG SPIT",
      0,
      130,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "KID YOYO",
      0,
      140,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "KID ARMPIT",
      0,
      70,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "ADULT MONSTER CLOSE ATTACK",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "ADULT MONSTER SPIT ATTACK",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "ADULT MONSTER BEGIN EATING",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "ADULT MONSTER EATING",
      0,
      70,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NORESTART | ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "ADULT MONSTER END EATING",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // RUN
    createAnimationControlTypeFrom(
      "BLOODCAT RUN",
      0,
      50,
      5.4,
      ANIM_MOVING | ANIM_TURNING | ANIM_NORESTART | ANIM_MODERATE_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    //
    createAnimationControlTypeFrom(
      "BLOODCAT BEGIN READY",
      0,
      70,
      0,
      ANIM_OK_CHARGE_AP_FOR_TURN |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "BLOODCAT READY",
      0,
      130,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "BLOODCAT END READY",
      0,
      70,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CAT HIT
    createAnimationControlTypeFrom(
      "BLOODCAT HIT",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CAT DIE
    createAnimationControlTypeFrom(
      "BLOODCAT DIE",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // CAT DIE STOP
    createAnimationControlTypeFrom(
      "BLOODCAT DIE STOP",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "BLOODCAT SWIPE",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "NINJA GOTO BREATH",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "NINJA BREATH",
      0,
      0,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_LIGHT_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "NINJA LOWKICK",
      0,
      50,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NORESTART,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "NINJA PUNCH",
      0,
      50,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NORESTART,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "NINJA SPIN KICK",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_MODERATE_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NORESTART,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // END OPEN DOOR
    createAnimationControlTypeFrom(
      "END OPEN DOOR",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // END OPEN LOCKED DOOR
    createAnimationControlTypeFrom(
      "END OPEN LOCKED DOOR",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // KICK DOOR
    createAnimationControlTypeFrom(
      "KICK DOOR",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // KICK DOOR
    createAnimationControlTypeFrom(
      "CLOSE DOOR",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // HIT STANDING RIFLE
    createAnimationControlTypeFrom(
      "HIT STAND RIFLE",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_HITSTART |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // DEEP WATER TREAD
    createAnimationControlTypeFrom(
      "DEEP WATER TREAD",
      0,
      200,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MODERATE_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // DEEP WATER SWIM
    createAnimationControlTypeFrom(
      "DEEP WATER SWIM",
      0,
      160,
      1.3,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MODERATE_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // DEEP WATER HIT
    createAnimationControlTypeFrom(
      "DEEP WATER HIT",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // DEEP WATER DIE
    createAnimationControlTypeFrom(
      "DEEP WATER DIE",
      0,
      210,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // DEEP WATER DIE STOPPING
    createAnimationControlTypeFrom(
      "DEEP WATER DIE STOPPING",
      0,
      340,
      0,
      ANIM_STATIONARY |
        ANIM_NONINTERRUPT |
        ANIM_HITSTOP |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // DEEP WATER DIE STOP
    createAnimationControlTypeFrom(
      "DEEP WATER DIE STOP",
      0,
      340,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // WATER TRANSITION
    createAnimationControlTypeFrom(
      "LOW TO DEEP WATER",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_NOCHANGE_WEAPON | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // WATER TRANSITION
    createAnimationControlTypeFrom(
      "DEEP TO LOW WATER",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_NOCHANGE_WEAPON | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // GOTO SLEEP
    createAnimationControlTypeFrom(
      "GOTO SLEEP",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_LOWER_WEAPON | ANIM_NONINTERRUPT | ANIM_NO_EFFORT,
      ANIM_CROUCH,
      ANIM_PRONE,
      -1,
    ),

    // SLEEP
    createAnimationControlTypeFrom(
      "SLEEPING",
      0,
      2000,
      0,
      ANIM_STATIONARY |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT |
        ANIM_UPDATEMOVEMENTMODE,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // WAKEUP
    createAnimationControlTypeFrom(
      "WAKEUP",
      0,
      100,
      0,
      ANIM_STATIONARY | ANIM_RAISE_WEAPON | ANIM_NO_EFFORT,
      ANIM_PRONE,
      ANIM_CROUCH,
      -1,
    ),

    // SHOOT_RIFLE_STAND LOW
    createAnimationControlTypeFrom(
      "SHOOT (R) STAND LOW",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_FIRE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // SHOOT_RIFLE_STAND LOW
    createAnimationControlTypeFrom(
      "BURST SHOOT (R) STAND LOW",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_FIRE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // LARVAE Breathing
    createAnimationControlTypeFrom(
      "LARVAE BREATH",
      0,
      250,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // GENERIC HIT CROUCHED
    createAnimationControlTypeFrom(
      "LARVAE HIT",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // FALL FORWARD FROM HIT STAND
    createAnimationControlTypeFrom(
      "LARVAE DIE",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // FALL FORWARD FROM HIT STAND
    createAnimationControlTypeFrom(
      "LARVAE DIE STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // FEMALE MONSTER BREATHING
    createAnimationControlTypeFrom(
      "LARVAE WALKING",
      0,
      110,
      0.5,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // GENERIC HIT CROUCHED
    createAnimationControlTypeFrom(
      "INFANT HIT",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // FALL FORWARD FROM HIT STAND
    createAnimationControlTypeFrom(
      "INFANT DIE",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // FALL FORWARD FROM HIT STAND
    createAnimationControlTypeFrom(
      "INFANT DIE STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "INFANT MONSTER SPIT ATTACK",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "INFANT MONSTER BEGIN EATING",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "INFANT MONSTER EATING",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "INFANT MONSTER END EATING",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "ADULT	MONSTER UP",
      0,
      130,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "ADULT	MONSTER JUMP",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // UNJAM STANDING
    createAnimationControlTypeFrom(
      "UNJAM STANDING",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // UNJAM CROUCH
    createAnimationControlTypeFrom(
      "UNJAM CROUCH",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // UNJAM PRONE
    createAnimationControlTypeFrom(
      "UNJAM PRONE",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // UNJAM STAND DWEL
    createAnimationControlTypeFrom(
      "UNJAM STAND DWEL",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // UNJAM STAND LOW
    createAnimationControlTypeFrom(
      "UNJAM STAND LOW",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // READY_RIFLE_CROUCH
    createAnimationControlTypeFrom(
      "READY AIM (DW) CROUCH",
      0,
      150,
      0,
      ANIM_OK_CHARGE_AP_FOR_TURN |
        ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // AIM_RIFLE_CROUCH
    createAnimationControlTypeFrom(
      "AIM (DW) CROUCH",
      0,
      250,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FIREREADY |
        ANIM_FASTTURN |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // SHOOT_RIFLE_CROUCH
    createAnimationControlTypeFrom(
      "SHOOT (DW) CROUCH",
      0,
      150,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_LIGHT_EFFORT | ANIM_FIRE,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // END_RIFLE_STAND
    createAnimationControlTypeFrom(
      "END DUAL CROUCH",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOCHANGE_PENDINGCOUNT |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // UNJAM CROUCH DWEL
    createAnimationControlTypeFrom(
      "UNJAM CROUCH DWEL",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // GET ADJACENT ITEM
    createAnimationControlTypeFrom(
      "GET ADJACENT ITEM",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CUTTING FENCE
    createAnimationControlTypeFrom(
      "CUTTING FENCE",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    createAnimationControlTypeFrom(
      "CRIPPLE BEG",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CRIPPLE HIT
    createAnimationControlTypeFrom(
      "CRIPPLE HIT",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CRIPPLE DIE
    createAnimationControlTypeFrom(
      "CRIPPLE DIE",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // CRIPPLE DIE STOP
    createAnimationControlTypeFrom(
      "CRIPPLE DIE STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // CRIPPLE FLYBACK DIE
    createAnimationControlTypeFrom(
      "CRIPPLE FLYBACK DIE",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // CRIPPLE FLYBACK DIE STOP
    createAnimationControlTypeFrom(
      "CRIPPLE FLYBACK DIE STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // CRIPPLE KICK
    createAnimationControlTypeFrom(
      "CRIPPLE KICK",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_NOMOVE_MARKER |
        ANIM_MIN_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // INJURED TRANSITION
    createAnimationControlTypeFrom(
      "INJURED TRANSITION",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_NOMOVE_MARKER |
        ANIM_MIN_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // THROW KNIFE
    createAnimationControlTypeFrom(
      "THROW KNIFE",
      0,
      50,
      0,
      ANIM_STATIONARY |
        ANIM_NOMOVE_MARKER |
        ANIM_NONINTERRUPT |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Breathing
    createAnimationControlTypeFrom(
      "KNIFE BREATH",
      0,
      150,
      0,
      ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Breathing
    createAnimationControlTypeFrom(
      "KNIFE GOTO BREATH",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NONINTERRUPT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Breathing
    createAnimationControlTypeFrom(
      "KNIFE END BREATH",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NONINTERRUPT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // ROBOT HIT
    createAnimationControlTypeFrom(
      "ROBOT HIT",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NONINTERRUPT |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // ROBOT DIE
    createAnimationControlTypeFrom(
      "ROBOT DIE",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // ROBOT DIE STOP
    createAnimationControlTypeFrom(
      "ROBOT DIE STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // Catch Standing
    createAnimationControlTypeFrom(
      "Catch Standing",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_LOWER_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Catch Crouched
    createAnimationControlTypeFrom(
      "Catch Crouched",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_LOWER_WEAPON,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // PLANT BOMB
    createAnimationControlTypeFrom(
      "PLANT BOMB",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Use remote
    createAnimationControlTypeFrom(
      "Use Remote",
      0,
      80,
      0,
      ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NONINTERRUPT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // COWER
    createAnimationControlTypeFrom(
      "START Cower",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NONINTERRUPT |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_STAND,
      ANIM_CROUCH,
      -1,
    ),

    // COWER
    createAnimationControlTypeFrom(
      "Cowering",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // END COWER
    createAnimationControlTypeFrom(
      "End Cower",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_CROUCH,
      ANIM_STAND,
      -1,
    ),

    // STEAL ITEM
    createAnimationControlTypeFrom(
      "STEAL ITEM",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // LAUNCH ROCKET
    createAnimationControlTypeFrom(
      "LAUNCH ROCKET",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CIV ALT DIE
    createAnimationControlTypeFrom(
      "CIV ALT DIE",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // SHOOT MORTAR
    createAnimationControlTypeFrom(
      "SHOOT MORTAR",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // CROW DIE
    createAnimationControlTypeFrom(
      "CROW_DIE",
      0,
      130,
      0,
      ANIM_STATIONARY |
        ANIM_NONINTERRUPT |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NOCHANGE_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // SIDE STEPPING
    createAnimationControlTypeFrom(
      "SIDE STEPPING",
      0,
      50,
      0.4,
      ANIM_MOVING | ANIM_NORESTART | ANIM_RAISE_WEAPON | ANIM_VARIABLE_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // WALK BACKWARDS
    createAnimationControlTypeFrom(
      "WALK BACKWARDS",
      0,
      110,
      1.4,
      ANIM_MOVING |
        ANIM_NORESTART |
        ANIM_RAISE_WEAPON |
        ANIM_VARIABLE_EFFORT |
        ANIM_TURNING,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // OPEN STRUCT
    createAnimationControlTypeFrom(
      "BEGIN OPEN STRUCT",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // END STRUCT
    createAnimationControlTypeFrom(
      "END OPEN STRUCT",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // END OPEN LOCKED
    createAnimationControlTypeFrom(
      "END OPEN LOCKED STRUCT",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Punch LOw
    createAnimationControlTypeFrom(
      "LOW PUNCH",
      0,
      70,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // SHOOT_PISTOL_STAND LOW
    createAnimationControlTypeFrom(
      "SHOOT (P) STAND LOW",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_FIRE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // DECAPITATE
    createAnimationControlTypeFrom(
      "DECAPITATE",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NONINTERRUPT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    createAnimationControlTypeFrom(
      "BLOODCAT BITE",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "BIGMERC S NECK",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CROUCH TRANSITION
    createAnimationControlTypeFrom(
      "BIGMERC CROUCH TRANS INTO",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOMOVE_MARKER |
        ANIM_STANCECHANGEANIM |
        ANIM_RAISE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_CROUCH,
      -1,
    ),

    // CROUCH TRANSITION
    createAnimationControlTypeFrom(
      "BIGMERC CROUCH TRANS OUTOF",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOMOVE_MARKER |
        ANIM_STANCECHANGEANIM |
        ANIM_RAISE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_CROUCH,
      ANIM_STAND,
      -1,
    ),

    // GOTO PATIENT
    createAnimationControlTypeFrom(
      "GOTO PATIENT",
      0,
      1000,
      0,
      ANIM_STATIONARY | ANIM_FASTTURN | ANIM_NOCHANGE_WEAPON | ANIM_NO_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // BEING PATIENT
    createAnimationControlTypeFrom(
      "BEING PATIENT",
      0,
      1000,
      0,
      ANIM_STATIONARY |
        ANIM_FASTTURN |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT |
        ANIM_UPDATEMOVEMENTMODE,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // GOTO DOCTOR
    createAnimationControlTypeFrom(
      "GOTO DOCTOR",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // BEING DOCTOR
    createAnimationControlTypeFrom(
      "BEING DOCTOR",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_UPDATEMOVEMENTMODE,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // ENDING DOCTOR
    createAnimationControlTypeFrom(
      "END DOCTOR",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_RAISE_WEAPON |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_PENDINGCOUNT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // GOTO REPAIRMAN
    createAnimationControlTypeFrom(
      "GOTO REPAIRMAN",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // BEING REPAIRMAN
    createAnimationControlTypeFrom(
      "BEING REPAIRMAN",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_UPDATEMOVEMENTMODE,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // ENDING REPAIRMAN
    createAnimationControlTypeFrom(
      "END REPAIRMAN",
      0,
      90,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_RAISE_WEAPON |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_PENDINGCOUNT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // FALL INTO PIT
    createAnimationControlTypeFrom(
      "FALL INTO PIT",
      0,
      60,
      0,
      ANIM_STATIONARY |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // ROBOT WALK
    createAnimationControlTypeFrom(
      "ROBOT WALKING",
      0,
      80,
      1.5,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // ROBOT SHOOT
    createAnimationControlTypeFrom(
      "ROBOT SHOOT",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_FIRE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // QUEEN HIT
    createAnimationControlTypeFrom(
      "QUEEN HIT",
      0,
      200,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITSTART |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // QUEEN DIE
    createAnimationControlTypeFrom(
      "QUEEN DIE",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_PRONE,
      -1,
    ),

    // QUEEN DIE STOP
    createAnimationControlTypeFrom(
      "QUEEN DIE STOP",
      0,
      350,
      0,
      ANIM_STATIONARY | ANIM_HITSTOP | ANIM_NO_EFFORT | ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "QUEEN INTO READY",
      0,
      130,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "QUEEN READY",
      0,
      130,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "QUEEN END READY",
      0,
      130,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "QUEEN CALL",
      0,
      130,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "QUEEN MONSTER SPIT ATTACK",
      0,
      130,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "QUEEN MONSTER SWIPE ATTACK",
      0,
      130,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // RELOAD ROBOT
    createAnimationControlTypeFrom(
      "RELOAD ROBOT",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // End Catch Standing
    createAnimationControlTypeFrom(
      "Catch Standing",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NONINTERRUPT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // End Catch Crouched
    createAnimationControlTypeFrom(
      "Catch Crouched",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_FIREREADY |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NONINTERRUPT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    createAnimationControlTypeFrom(
      "RADIO",
      0,
      130,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    createAnimationControlTypeFrom(
      "CROUCH RADIO",
      0,
      130,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_NORESTART | ANIM_NO_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // TANK SHOOT
    createAnimationControlTypeFrom(
      "TANK SHOOT",
      0,
      200,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOCHANGE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_FIRE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // TANK SHOOT
    createAnimationControlTypeFrom(
      "TANK BURST",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOCHANGE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_FIRE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Queen Slap
    createAnimationControlTypeFrom(
      "QUEEN SLAP",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Slap hit
    createAnimationControlTypeFrom(
      "SLAP HIT",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // GET BLOOD
    createAnimationControlTypeFrom(
      "GET BLOOD",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // VEHICLE DIE
    createAnimationControlTypeFrom(
      "VEHICLE DIE",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Queen Frustrated Slap
    createAnimationControlTypeFrom(
      "QUEEN FRUSTRATED SLAP",
      0,
      120,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // SOLDIER BRUN
    createAnimationControlTypeFrom(
      "FIRE FIRE",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // AI TRIGGER
    createAnimationControlTypeFrom(
      "AI TRIGGER",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // MONSTER MELT
    createAnimationControlTypeFrom(
      "MONSTERMELT",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NONINTERRUPT |
        ANIM_HITFINISH |
        ANIM_NOMOVE_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    createAnimationControlTypeFrom(
      "MERC INJURED IDLE ANIM",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // INJURED TRANSITION
    createAnimationControlTypeFrom(
      "END INJURED WALK",
      0,
      80,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOMOVE_MARKER |
        ANIM_MIN_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // PASS OBJECT
    createAnimationControlTypeFrom(
      "PASS OBJECT",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // ADJACENT DROP OBJECT
    createAnimationControlTypeFrom(
      "ADJACENT DROP OBJECT",
      0,
      110,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // READY_RIFLE_PRONE
    createAnimationControlTypeFrom(
      "READY AIM (DW) PRONE",
      0,
      150,
      0,
      ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_LIGHT_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // AIM_RIFLE_PRONE
    createAnimationControlTypeFrom(
      "AIM (DW) PRONE",
      0,
      250,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FIREREADY |
        ANIM_FASTTURN |
        ANIM_LIGHT_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // SHOOT_RIFLE_PRONE
    createAnimationControlTypeFrom(
      "SHOOT (DW) PRONE",
      0,
      150,
      0,
      ANIM_STATIONARY | ANIM_TURNING | ANIM_LIGHT_EFFORT | ANIM_FIRE,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // END_RIFLE_PRONE
    createAnimationControlTypeFrom(
      "END DUAL PRONE",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NOCHANGE_PENDINGCOUNT |
        ANIM_LIGHT_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // UNJAM PRONE DWEL
    createAnimationControlTypeFrom(
      "UNJAM PRONE DWEL",
      0,
      150,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NOCHANGE_WEAPON |
        ANIM_MIN_EFFORT,
      ANIM_PRONE,
      ANIM_PRONE,
      -1,
    ),

    // PICK LOCK
    createAnimationControlTypeFrom(
      "PICK LOCK",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // OPEN DOOR CROUCHED
    createAnimationControlTypeFrom(
      "OPEN DOOR CROUCHED",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // BEGIN OPENSTRUCT CROUCHED
    createAnimationControlTypeFrom(
      "BEGIN OPEN STRUCT CROUCHED",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // CLOSE DOOR CROUCHED
    createAnimationControlTypeFrom(
      "CLOSE DOOR CROUCHED",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // OPEN STRUCT CROUCHED
    createAnimationControlTypeFrom(
      "OPEN STRUCT CROUCHED",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // END OPEN DOOR CROUCHED
    createAnimationControlTypeFrom(
      "END OPEN DOOR CROUCHED",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // END OPENSTRUCT CROUCHED
    createAnimationControlTypeFrom(
      "END OPENSTRUCT CROUCHED",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // END OPEN LOCKED DOOR CROUCHED
    createAnimationControlTypeFrom(
      "END OPNE LOCKED DOOR CR",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // END OPEN STRUCT LOCKED CR
    createAnimationControlTypeFrom(
      "END OPEN STRUCT LOCKED CR",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    createAnimationControlTypeFrom(
      "DRUNK IDLE",
      0,
      170,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_MERCIDLE |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NO_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CROWBAR
    createAnimationControlTypeFrom(
      "CROWBAR",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_NORESTART,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // COWER HIT ANIMATION
    createAnimationControlTypeFrom(
      "COWER HIT",
      0,
      80,
      1.6,
      ANIM_HITSTART |
        ANIM_HITFINISH |
        ANIM_NONINTERRUPT |
        ANIM_NOSHOW_MARKER |
        ANIM_NO_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_IGNORE_AUTOSTANCE,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // BLOODCAT WALK BACKWARDS
    createAnimationControlTypeFrom(
      "BLOODCAT WALKING BACKWARDS",
      0,
      30,
      1.2,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CREATURE WALK BACKWARDS
    createAnimationControlTypeFrom(
      "MONSTER WALKING BACKWARDS",
      0,
      30,
      2.5,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // KID SKIPPING
    createAnimationControlTypeFrom(
      "KID SKIPPING",
      0,
      70,
      2.0,
      ANIM_MOVING |
        ANIM_TURNING |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // STAND BURST
    createAnimationControlTypeFrom(
      "STAND BURST SHOOT",
      0,
      100,
      0,
      ANIM_NORESTART |
        ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_RAISE_WEAPON |
        ANIM_LIGHT_EFFORT |
        ANIM_NOCHANGE_WEAPON |
        ANIM_FIRE,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // Attach string
    createAnimationControlTypeFrom(
      "Attach String",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // SWAT BACKWARDS
    createAnimationControlTypeFrom(
      "SWAT BACKWARDS",
      0,
      110,
      1.4,
      ANIM_MOVING | ANIM_NORESTART | ANIM_LIGHT_EFFORT | ANIM_TURNING,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // JUMP OVER BLOCKING PERSON
    createAnimationControlTypeFrom(
      "JUMP OVER",
      0,
      110,
      3.6,
      ANIM_SPECIALMOVE |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_MODERATE_EFFORT |
        ANIM_TURNING,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // REFUEL VEHICLE
    createAnimationControlTypeFrom(
      "REFUEL VEHICLE",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),

    // Robot camera not moving
    createAnimationControlTypeFrom(
      "ROBOT CAMERA",
      0,
      0,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_RAISE_WEAPON |
        ANIM_VARIABLE_EFFORT |
        ANIM_BREATH,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CRIPPLE OPEN DOOR
    createAnimationControlTypeFrom(
      "CRIPPLE OPEN DOOR",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LIGHT_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CRIPPLE CLOSE DOOR
    createAnimationControlTypeFrom(
      "CRIPPLE CLOSE DOOR",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CRIPPLE END OPEN DOOR
    createAnimationControlTypeFrom(
      "END OPEN DOOR",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CRIPPLE END OPEN LOCKED DOOR
    createAnimationControlTypeFrom(
      "END OPEN LOCKED DOOR",
      0,
      100,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_NONINTERRUPT |
        ANIM_MIN_EFFORT,
      ANIM_STAND,
      ANIM_STAND,
      -1,
    ),

    // CROUCH PICK LOCK
    createAnimationControlTypeFrom(
      "CROUCH PICK LOCK",
      0,
      70,
      0,
      ANIM_STATIONARY |
        ANIM_TURNING |
        ANIM_FASTTURN |
        ANIM_NORESTART |
        ANIM_LOWER_WEAPON |
        ANIM_LIGHT_EFFORT,
      ANIM_CROUCH,
      ANIM_CROUCH,
      -1,
    ),
  ];

  export let gubAnimWalkSpeeds: ANI_SPEED_DEF[] /* [TOTALBODYTYPES] */ = [
    createAnimationSpeedDefinitionFrom(-5, 1.6), // REGMALE
    createAnimationSpeedDefinitionFrom(-10, 1.6), // BIGMALE
    createAnimationSpeedDefinitionFrom(-5, 1.6), // STOCKYMALE
    createAnimationSpeedDefinitionFrom(-15, 1.6), // REGFEMALE
    createAnimationSpeedDefinitionFrom(0, 1.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 1.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 1.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 1.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 1.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 2.2), // INFANT
    createAnimationSpeedDefinitionFrom(0, 1.6), // QUEEN MONSTER
    createAnimationSpeedDefinitionFrom(40, 1.3), // FATCIV
    createAnimationSpeedDefinitionFrom(10, 1.3), // MANCIV
    createAnimationSpeedDefinitionFrom(-10, 1.3), // MINICIV
    createAnimationSpeedDefinitionFrom(-10, 1.3), // DRESSCIV
    createAnimationSpeedDefinitionFrom(-20, 1.6), // HAT KID
    createAnimationSpeedDefinitionFrom(-20, 1.6), // NOHAT KID
    createAnimationSpeedDefinitionFrom(-20, 1.6), // CRIPPLE
    createAnimationSpeedDefinitionFrom(60, 0.9), // COW
    createAnimationSpeedDefinitionFrom(20, 1.6), // CROW
    createAnimationSpeedDefinitionFrom(0, 1.2), // BLOOD CAT
    createAnimationSpeedDefinitionFrom(20, 1.1), // ROBOT1
    createAnimationSpeedDefinitionFrom(-10, 4.0), // HUMVEE

    createAnimationSpeedDefinitionFrom(-10, 4.0), // TANK_NW
    createAnimationSpeedDefinitionFrom(-10, 4.0), // TANK_NE
    createAnimationSpeedDefinitionFrom(-10, 4.0), // ELDORADO
    createAnimationSpeedDefinitionFrom(-10, 4.0), // ICECREAMTRUCK
    createAnimationSpeedDefinitionFrom(-10, 4.0), // JEEP
  ];

  export let gubMaxActionPoints: UINT8[] /* [TOTALBODYTYPES] */ = [
    AP_MAXIMUM, // REGMALE
    AP_MAXIMUM, // BIGMALE
    AP_MAXIMUM, // STOCKYMALE
    AP_MAXIMUM, // REGFEMALE
    AP_MONSTER_MAXIMUM, // ADULTMONSTER
    AP_MONSTER_MAXIMUM, // ADULTMONSTER
    AP_MONSTER_MAXIMUM, // ADULTMONSTER
    AP_MONSTER_MAXIMUM, // ADULTMONSTER
    AP_MONSTER_MAXIMUM, // ADULTMONSTER
    AP_MONSTER_MAXIMUM, // INFANT
    AP_MONSTER_MAXIMUM, // QUEEN MONSTER
    AP_MAXIMUM, // FATCIV
    AP_MAXIMUM, // MANCIV
    AP_MAXIMUM, // MINICIV
    AP_MAXIMUM, // DRESSCIV
    AP_MAXIMUM, // HAT KID
    AP_MAXIMUM, // NOHAT KID
    AP_MAXIMUM, // CRIPPLE
    AP_MAXIMUM, // COW
    AP_MAXIMUM, // CROW
    AP_MAXIMUM, // BLOOD CAT
    AP_MAXIMUM, // ROBOT1
    AP_VEHICLE_MAXIMUM, // HUMVEE
    AP_VEHICLE_MAXIMUM, // TANK1
    AP_VEHICLE_MAXIMUM, // TANK2
    AP_VEHICLE_MAXIMUM, // ELDORADO
    AP_VEHICLE_MAXIMUM, // ICECREAMTRUCK
    AP_VEHICLE_MAXIMUM, // JEEP
  ];

  export let gubAnimRunSpeeds: ANI_SPEED_DEF[] /* [TOTALBODYTYPES] */ = [
    createAnimationSpeedDefinitionFrom(0, 2.6), // REGMALE
    createAnimationSpeedDefinitionFrom(5, 2.6), // BIGMALE
    createAnimationSpeedDefinitionFrom(0, 2.6), // STOCKYMALE
    createAnimationSpeedDefinitionFrom(-10, 2.6), // REGFEMALE
    createAnimationSpeedDefinitionFrom(0, 2.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 2.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 2.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 2.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 2.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 2.6), // ADULTMONSTER
    createAnimationSpeedDefinitionFrom(0, 2.8), // INFANT
    createAnimationSpeedDefinitionFrom(10, 2.3), // FATCIV
    createAnimationSpeedDefinitionFrom(-10, 2.3), // MANCIV
    createAnimationSpeedDefinitionFrom(-20, 2.3), // MINICIV
    createAnimationSpeedDefinitionFrom(-30, 2.3), // DRESSCIV
    createAnimationSpeedDefinitionFrom(-40, 2.6), // HAT KID
    createAnimationSpeedDefinitionFrom(-40, 2.6), // NOHAT KID
    createAnimationSpeedDefinitionFrom(-20, 2.3), // CRIPPLE
    createAnimationSpeedDefinitionFrom(30, 2.0), // COW
  ];

  // Really only the first mercs are using any of these values....
  export let gubAnimSwatSpeeds: ANI_SPEED_DEF[] /* [TOTALBODYTYPES] */ = [
    createAnimationSpeedDefinitionFrom(0, 2.2), // REGMALE
    createAnimationSpeedDefinitionFrom(20, 2.2), // BIGMALE
    createAnimationSpeedDefinitionFrom(0, 2.2), // STOCKYMALE
    createAnimationSpeedDefinitionFrom(-10, 2.2), // REGFEMALE
  ];

  // Really only the first mercs are using any of these values....
  export let gubAnimCrawlSpeeds: ANI_SPEED_DEF[] /* [TOTALBODYTYPES] */ = [
    createAnimationSpeedDefinitionFrom(0, 0.8), // REGMALE
    createAnimationSpeedDefinitionFrom(20, 0.8), // BIGMALE
    createAnimationSpeedDefinitionFrom(0, 0.8), // STOCKYMALE
    createAnimationSpeedDefinitionFrom(-10, 0.8), // REGFEMALE
  ];

  let gusNothingBreath: UINT16[] /* [] */ = [
    Enum195.RGMNOTHING_STD,
    Enum195.BGMNOTHING_STD,
    Enum195.RGMNOTHING_STD,
    Enum195.RGFNOTHING_STD,
  ];

  let gubAnimSurfaceIndex: UINT16[][] /* [TOTALBODYTYPES][NUMANIMATIONSTATES] */ =
    createArrayFrom(Enum194.TOTALBODYTYPES, () =>
      createArray(Enum193.NUMANIMATIONSTATES, 0),
    );
  let gubAnimSurfaceMidWaterSubIndex: UINT16[][][] /* [TOTALBODYTYPES][NUMANIMATIONSTATES][2] */ =
    createArrayFrom(Enum194.TOTALBODYTYPES, () =>
      createArrayFrom(Enum193.NUMANIMATIONSTATES, () => createArray(2, 0)),
    );
  let gubAnimSurfaceItemSubIndex: UINT16[][] /* [TOTALBODYTYPES][NUMANIMATIONSTATES] */ =
    createArrayFrom(Enum194.TOTALBODYTYPES, () =>
      createArray(Enum193.NUMANIMATIONSTATES, 0),
    );
  export let gubAnimSurfaceCorpseID: UINT16[][] /* [TOTALBODYTYPES][NUMANIMATIONSTATES] */ =
    createArrayFrom(Enum194.TOTALBODYTYPES, () =>
      createArray(Enum193.NUMANIMATIONSTATES, 0),
    );

  let gRifleInjuredSub: ANIMSUBTYPE[] /* [] */ = [
    createAnimationSubTypeFrom(Enum193.WALKING, [
      Enum195.RGMHURTWALKINGR,
      Enum195.BGMHURTWALKINGR,
      Enum195.RGMHURTWALKINGR,
      Enum195.RGFHURTWALKINGR,
    ]),
  ];

  let gNothingInjuredSub: ANIMSUBTYPE[] /* [] */ = [
    createAnimationSubTypeFrom(Enum193.WALKING, [
      Enum195.RGMHURTWALKINGN,
      Enum195.BGMHURTWALKINGN,
      Enum195.RGMHURTWALKINGN,
      Enum195.RGFHURTWALKINGN,
    ]),
  ];

  let gDoubleHandledSub: ANIMSUBTYPE = createAnimationSubTypeFrom(
    Enum193.STANDING,
    [
      Enum195.RGMDBLBREATH,
      Enum195.BGMDBLBREATH,
      Enum195.RGMDBLBREATH,
      Enum195.RGFDBLBREATH,
    ],
  );

  export function InitAnimationSurfacesPerBodytype(): void {
    let cnt1: INT32;
    let cnt2: INT32;

    // Should be set to a non-init values
    for (cnt1 = 0; cnt1 < Enum194.TOTALBODYTYPES; cnt1++) {
      for (cnt2 = 0; cnt2 < Enum193.NUMANIMATIONSTATES; cnt2++) {
        gubAnimSurfaceIndex[cnt1][cnt2] = INVALID_ANIMATION;
        gubAnimSurfaceItemSubIndex[cnt1][cnt2] = INVALID_ANIMATION;
        gubAnimSurfaceMidWaterSubIndex[cnt1][cnt2][0] = INVALID_ANIMATION;
        gubAnimSurfaceMidWaterSubIndex[cnt1][cnt2][1] = INVALID_ANIMATION;
        gubAnimSurfaceCorpseID[cnt1][cnt2] = Enum249.NO_CORPSE;
      }
    }

    for (let i = 0; i < gRandomAnimDefs.length; i++) {
      gRandomAnimDefs[i].forEach(resetRandomAnimationDefinition);
    }

    // REGULAR MALE GUY
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.WALKING] =
      Enum195.RGMBASICWALKING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.STANDING] =
      Enum195.RGMSTANDING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.KNEEL_DOWN] =
      Enum195.RGMCROUCHING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CROUCHING] =
      Enum195.RGMCROUCHING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.KNEEL_UP] =
      Enum195.RGMCROUCHING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SWATTING] =
      Enum195.RGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.RUNNING] = Enum195.RGMRUNNING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_DOWN] = Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CRAWLING] = Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_UP] = Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE] = Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.READY_RIFLE_STAND] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.AIM_RIFLE_STAND] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SHOOT_RIFLE_STAND] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_RIFLE_STAND] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.START_SWAT] =
      Enum195.RGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_SWAT] =
      Enum195.RGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FLYBACK_HIT] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.READY_RIFLE_PRONE] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.AIM_RIFLE_PRONE] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SHOOT_RIFLE_PRONE] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_RIFLE_PRONE] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLBACK_DEATHTWICH] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GENERIC_HIT_STAND] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FLYBACK_HIT_BLOOD_STAND] =
      Enum195.RGMHITHARDBLOOD;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FLYBACK_HIT_DEATH] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.READY_RIFLE_CROUCH] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.AIM_RIFLE_CROUCH] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SHOOT_RIFLE_CROUCH] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_RIFLE_CROUCH] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLBACK_HIT_STAND] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.ROLLOVER] =
      Enum195.RGMROLLOVER;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CLIMBUPROOF] =
      Enum195.RGMCLIMBROOF;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF] = Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GETUP_FROM_ROLLOVER] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CLIMBDOWNROOF] =
      Enum195.RGMCLIMBROOF;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLFORWARD_ROOF] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GENERIC_HIT_DEATHTWITCHB] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLBACK_HIT_DEATHTWITCHNB] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLBACK_HIT_DEATHTWITCHB] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLBACK_HIT_DEATH] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GENERIC_HIT_CROUCH] =
      Enum195.RGMHITCROUCH;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.STANDING_BURST] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.STANDING_BURST_HIT] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLFORWARD_FROMHIT_CROUCH] =
      Enum195.RGMHITCROUCH;
    gubAnimSurfaceIndex[Enum194.REGMALE][
      Enum193.ENDFALLFORWARD_FROMHIT_CROUCH
    ] = Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GENERIC_HIT_PRONE] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_HIT_DEATH] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_LAY_FROMHIT] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_HIT_DEATHTWITCHNB] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_HIT_DEATHTWITCHB] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FLYBACK_HITDEATH_STOP] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLFORWARD_HITDEATH_STOP] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLBACK_HITDEATH_STOP] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_HITDEATH_STOP] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FLYBACKHIT_STOP] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLBACKHIT_STOP] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF_STOP] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF_FORWARD_STOP] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.STAND_FALLFORWARD_STOP] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_LAYFROMHIT_STOP] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.HOPFENCE] =
      Enum195.RGMHOPFENCE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PUNCH_BREATH] =
      Enum195.RGMPUNCH;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PUNCH] = Enum195.RGMPUNCH;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.NOTHING_STAND] =
      Enum195.RGMNOTHING_STD;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.JFK_HITDEATH] =
      Enum195.RGMDIE_JFK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.JFK_HITDEATH_STOP] =
      Enum195.RGMDIE_JFK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.JFK_HITDEATH_TWITCHB] =
      Enum195.RGMDIE_JFK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FIRE_STAND_BURST_SPREAD] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF_DEATH] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF_DEATH_STOP] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF_TWITCHB] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF_TWITCHNB] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF_FORWARD_DEATH] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF_FORWARD_DEATH_STOP] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF_FORWARD_TWITCHB] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALLOFF_FORWARD_TWITCHNB] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.OPEN_DOOR] = Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.OPEN_STRUCT] = Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PICKUP_ITEM] =
      Enum195.RGMPICKUP;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DROP_ITEM] = Enum195.RGMPICKUP;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SLICE] = Enum195.RGMSLICE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.STAB] = Enum195.RGMSTAB;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CROUCH_STAB] =
      Enum195.RGMCSTAB;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.START_AID] = Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GIVING_AID] = Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_AID] = Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DODGE_ONE] = Enum195.RGMDODGE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.READY_DUAL_STAND] =
      Enum195.RGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.AIM_DUAL_STAND] =
      Enum195.RGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SHOOT_DUAL_STAND] =
      Enum195.RGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_DUAL_STAND] =
      Enum195.RGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.RAISE_RIFLE] =
      Enum195.RGMRAISE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.LOWER_RIFLE] =
      Enum195.RGMRAISE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.BODYEXPLODING] =
      Enum195.BODYEXPLODE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.THROW_ITEM] = Enum195.RGMTHROW;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.LOB_ITEM] = Enum195.RGMLOB;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CROUCHED_BURST] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_BURST] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GIVE_ITEM] = Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CLIMB_CLIFF] =
      Enum195.RGMMCLIMB;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CLIMB_CLIFF] =
      Enum195.RGMMCLIMB;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.WATER_HIT] =
      Enum195.RGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.WATER_DIE] =
      Enum195.RGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.WATER_DIE_STOP] =
      Enum195.RGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.HELIDROP] =
      Enum195.RGMHELIDROP;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FEM_LOOK] = Enum195.RGM_LOOK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.REG_SQUISH] =
      Enum195.RGM_SQUISH;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.REG_PULL] = Enum195.RGM_PULL;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.REG_SPIT] = Enum195.RGM_SPIT;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.NINJA_GOTOBREATH] =
      Enum195.RGMLOWKICK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.NINJA_BREATH] =
      Enum195.RGMLOWKICK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.NINJA_LOWKICK] =
      Enum195.RGMLOWKICK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.NINJA_PUNCH] =
      Enum195.RGMNPUNCH;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.NINJA_SPINKICK] =
      Enum195.RGMSPINKICK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_OPEN_DOOR] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_OPEN_LOCKED_DOOR] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.KICK_DOOR] =
      Enum195.RGMKICKDOOR;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CLOSE_DOOR] = Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.RIFLE_STAND_HIT] =
      Enum195.RGMRHIT;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DEEP_WATER_TRED] =
      Enum195.RGMDEEPWATER_TRED;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DEEP_WATER_SWIM] =
      Enum195.RGMDEEPWATER_SWIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DEEP_WATER_HIT] =
      Enum195.RGMDEEPWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DEEP_WATER_DIE] =
      Enum195.RGMDEEPWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DEEP_WATER_DIE_STOPPING] =
      Enum195.RGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DEEP_WATER_DIE_STOP] =
      Enum195.RGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.LOW_TO_DEEP_WATER] =
      Enum195.RGMWATER_TRANS;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DEEP_TO_LOW_WATER] =
      Enum195.RGMWATER_TRANS;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GOTO_SLEEP] = Enum195.RGMSLEEP;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SLEEPING] = Enum195.RGMSLEEP;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.WKAEUP_FROM_SLEEP] =
      Enum195.RGMSLEEP;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FIRE_LOW_STAND] =
      Enum195.RGMSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FIRE_BURST_LOW_STAND] =
      Enum195.RGMSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.STANDING_SHOOT_UNJAM] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CROUCH_SHOOT_UNJAM] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_SHOOT_UNJAM] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.STANDING_SHOOT_DWEL_UNJAM] =
      Enum195.RGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.STANDING_SHOOT_LOW_UNJAM] =
      Enum195.RGMSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.READY_DUAL_CROUCH] =
      Enum195.RGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.AIM_DUAL_CROUCH] =
      Enum195.RGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SHOOT_DUAL_CROUCH] =
      Enum195.RGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_DUAL_CROUCH] =
      Enum195.RGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CROUCH_SHOOT_DWEL_UNJAM] =
      Enum195.RGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.ADJACENT_GET_ITEM] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CUTTING_FENCE] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FROM_INJURED_TRANSITION] =
      Enum195.RGMHURTTRANS;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.THROW_KNIFE] =
      Enum195.RGMTHROWKNIFE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.KNIFE_BREATH] =
      Enum195.RGMBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.KNIFE_GOTOBREATH] =
      Enum195.RGMBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.KNIFE_ENDBREATH] =
      Enum195.RGMBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CATCH_STANDING] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CATCH_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PLANT_BOMB] =
      Enum195.RGMPICKUP;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.USE_REMOTE] = Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.START_COWER] =
      Enum195.RGMCOWER;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.COWERING] = Enum195.RGMCOWER;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_COWER] = Enum195.RGMCOWER;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.STEAL_ITEM] = Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SHOOT_ROCKET] =
      Enum195.RGMROCKET;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SHOOT_MORTAR] =
      Enum195.RGMMORTAR;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SIDE_STEP] =
      Enum195.RGMSIDESTEP;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.WALK_BACKWARDS] =
      Enum195.RGMBASICWALKING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.BEGIN_OPENSTRUCT] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_OPENSTRUCT] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_OPENSTRUCT_LOCKED] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PUNCH_LOW] =
      Enum195.RGMPUNCHLOW;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PISTOL_SHOOT_LOW] =
      Enum195.RGMPISTOLSHOOTLOW;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DECAPITATE] = Enum195.RGMCSTAB;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GOTO_PATIENT] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.BEING_PATIENT] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GOTO_DOCTOR] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.BEING_DOCTOR] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_DOCTOR] = Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.GOTO_REPAIRMAN] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.BEING_REPAIRMAN] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_REPAIRMAN] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.FALL_INTO_PIT] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.RELOAD_ROBOT] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_CATCH] = Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_CROUCH_CATCH] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.AI_RADIO] = Enum195.RGMRADIO;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.AI_CR_RADIO] =
      Enum195.RGMCRRADIO;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SLAP_HIT] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.TAKE_BLOOD_FROM_CORPSE] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CHARIOTS_OF_FIRE] =
      Enum195.RGMBURN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.AI_PULL_SWITCH] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.MERC_HURT_IDLE_ANIM] =
      Enum195.RGMHURTSTANDINGR;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_HURT_WALKING] =
      Enum195.RGMHURTSTANDINGR;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PASS_OBJECT] = Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DROP_ADJACENT_OBJECT] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.READY_DUAL_PRONE] =
      Enum195.RGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.AIM_DUAL_PRONE] =
      Enum195.RGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SHOOT_DUAL_PRONE] =
      Enum195.RGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_DUAL_PRONE] =
      Enum195.RGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PRONE_SHOOT_DWEL_UNJAM] =
      Enum195.RGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.PICK_LOCK] = Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.OPEN_DOOR_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.BEGIN_OPENSTRUCT_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CLOSE_DOOR_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.OPEN_STRUCT_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_OPEN_DOOR_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.END_OPENSTRUCT_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][
      Enum193.END_OPEN_LOCKED_DOOR_CROUCHED
    ] = Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][
      Enum193.END_OPENSTRUCT_LOCKED_CROUCHED
    ] = Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.DRUNK_IDLE] = Enum195.RGMDRUNK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CROWBAR_ATTACK] =
      Enum195.RGMCROWBAR;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.CRIPPLE_KICKOUT] =
      Enum195.CRIPCIVKICK;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.ATTACH_CAN_TO_STRING] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.SWAT_BACKWARDS] =
      Enum195.RGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.JUMP_OVER_BLOCKING_PERSON] =
      Enum195.RGMJUMPOVER;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.REFUEL_VEHICLE] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.REGMALE][Enum193.LOCKPICK_CROUCHED] =
      Enum195.RGMMEDIC;

    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.STANDING][0] =
      Enum195.RGMWATER_R_STD;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.WALKING][0] =
      Enum195.RGMWATER_R_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.RUNNING][0] =
      Enum195.RGMWATER_R_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.READY_RIFLE_STAND
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.AIM_RIFLE_STAND
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.SHOOT_RIFLE_STAND
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.END_RIFLE_STAND
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.STANDING_BURST][0] =
      Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.STANDING][1] =
      Enum195.RGMWATER_N_STD;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.WALKING][1] =
      Enum195.RGMWATER_N_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.RUNNING][1] =
      Enum195.RGMWATER_N_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.READY_RIFLE_STAND
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.AIM_RIFLE_STAND
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.SHOOT_RIFLE_STAND
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.END_RIFLE_STAND
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.STANDING_BURST][1] =
      Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.READY_DUAL_STAND
    ][1] = Enum195.RGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.AIM_DUAL_STAND][1] =
      Enum195.RGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.SHOOT_DUAL_STAND
    ][1] = Enum195.RGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.END_DUAL_STAND][1] =
      Enum195.RGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.STANDING_SHOOT_UNJAM
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][
      Enum193.STANDING_SHOOT_UNJAM
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.THROW_ITEM][0] =
      Enum195.RGMWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.THROW_ITEM][1] =
      Enum195.RGMWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.LOB_ITEM][0] =
      Enum195.RGMWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGMALE][Enum193.LOB_ITEM][1] =
      Enum195.RGMWATERTHROW;

    // Setup some random stuff
    gRandomAnimDefs[Enum194.REGMALE][0].ubHandRestriction =
      RANDOM_ANIM_RIFLEINHAND;
    gRandomAnimDefs[Enum194.REGMALE][0].sAnimID = Enum193.REG_SPIT;
    gRandomAnimDefs[Enum194.REGMALE][0].ubStartRoll = 0;
    gRandomAnimDefs[Enum194.REGMALE][0].ubEndRoll = 3;
    gRandomAnimDefs[Enum194.REGMALE][0].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.REGMALE][0].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.REGMALE][1].ubHandRestriction =
      RANDOM_ANIM_NOTHINGINHAND;
    gRandomAnimDefs[Enum194.REGMALE][1].sAnimID = Enum193.REG_SQUISH;
    gRandomAnimDefs[Enum194.REGMALE][1].ubStartRoll = 10;
    gRandomAnimDefs[Enum194.REGMALE][1].ubEndRoll = 13;
    gRandomAnimDefs[Enum194.REGMALE][1].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.REGMALE][1].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.REGMALE][2].ubHandRestriction =
      RANDOM_ANIM_RIFLEINHAND;
    gRandomAnimDefs[Enum194.REGMALE][2].sAnimID = Enum193.FEM_LOOK;
    gRandomAnimDefs[Enum194.REGMALE][2].ubStartRoll = 20;
    gRandomAnimDefs[Enum194.REGMALE][2].ubEndRoll = 23;
    gRandomAnimDefs[Enum194.REGMALE][2].ubFlags = 0;
    gRandomAnimDefs[Enum194.REGMALE][2].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.REGMALE][3].ubHandRestriction =
      RANDOM_ANIM_NOTHINGINHAND;
    gRandomAnimDefs[Enum194.REGMALE][3].sAnimID = Enum193.REG_PULL;
    gRandomAnimDefs[Enum194.REGMALE][3].ubStartRoll = 30;
    gRandomAnimDefs[Enum194.REGMALE][3].ubEndRoll = 33;
    gRandomAnimDefs[Enum194.REGMALE][3].ubFlags = 0;
    gRandomAnimDefs[Enum194.REGMALE][3].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.REGMALE][4].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.REGMALE][4].sAnimID = Enum193.MERC_HURT_IDLE_ANIM;
    gRandomAnimDefs[Enum194.REGMALE][4].ubStartRoll = 40;
    gRandomAnimDefs[Enum194.REGMALE][4].ubEndRoll = 100;
    gRandomAnimDefs[Enum194.REGMALE][4].ubFlags = RANDOM_ANIM_INJURED;
    gRandomAnimDefs[Enum194.REGMALE][4].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.REGMALE][5].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.REGMALE][5].sAnimID = Enum193.DRUNK_IDLE;
    gRandomAnimDefs[Enum194.REGMALE][5].ubStartRoll = 40;
    gRandomAnimDefs[Enum194.REGMALE][5].ubEndRoll = 100;
    gRandomAnimDefs[Enum194.REGMALE][5].ubFlags = RANDOM_ANIM_DRUNK;
    gRandomAnimDefs[Enum194.REGMALE][5].ubAnimHeight = ANIM_STAND;

    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.STANDING] =
      Enum195.RGMPISTOLBREATH;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.WALKING] =
      Enum195.RGMNOTHING_WALK;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.RUNNING] =
      Enum195.RGMNOTHING_RUN;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.SWATTING] =
      Enum195.RGMNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.START_SWAT] =
      Enum195.RGMNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.END_SWAT] =
      Enum195.RGMNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.KNEEL_DOWN] =
      Enum195.RGMNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.CROUCHING] =
      Enum195.RGMNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.KNEEL_UP] =
      Enum195.RGMNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.READY_RIFLE_STAND] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.AIM_RIFLE_STAND] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.SHOOT_RIFLE_STAND] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.END_RIFLE_STAND] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.STANDING_BURST] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ] = Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.READY_RIFLE_CROUCH] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.AIM_RIFLE_CROUCH] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.SHOOT_RIFLE_CROUCH] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.END_RIFLE_CROUCH] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.PRONE_DOWN] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.CRAWLING] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.PRONE_UP] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.PRONE] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.READY_RIFLE_PRONE] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.AIM_RIFLE_PRONE] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.SHOOT_RIFLE_PRONE] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.END_RIFLE_PRONE] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.GETUP_FROM_ROLLOVER] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.STANDING_SHOOT_UNJAM] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.CROUCH_SHOOT_UNJAM] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.PRONE_SHOOT_UNJAM] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.FIRE_BURST_LOW_STAND] =
      Enum195.RGMPISTOLSHOOTLOW;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.FIRE_LOW_STAND] =
      Enum195.RGMPISTOLSHOOTLOW;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.CROUCHED_BURST] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.PRONE_BURST] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.MERC_HURT_IDLE_ANIM] =
      Enum195.RGMHURTSTANDINGN;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.END_HURT_WALKING] =
      Enum195.RGMHURTSTANDINGN;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.WALK_BACKWARDS] =
      Enum195.RGMNOTHING_WALK;
    gubAnimSurfaceItemSubIndex[Enum194.REGMALE][Enum193.DRUNK_IDLE] =
      Enum195.RGMPISTOLDRUNK;

    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum249.SMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FALLBACK_HIT_DEATH] =
      Enum249.SMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.PRONE_HIT_DEATH] =
      Enum249.SMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.WATER_DIE] =
      Enum249.SMERC_WTR;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FLYBACK_HIT_DEATH] =
      Enum249.SMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.JFK_HITDEATH] =
      Enum249.SMERC_JFK;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FALLOFF_DEATH] =
      Enum249.SMERC_FALL;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FALLOFF_FORWARD_DEATH] =
      Enum249.SMERC_FALLF;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FLYBACK_HIT] =
      Enum249.SMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum249.SMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum249.SMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][
      Enum193.ENDFALLFORWARD_FROMHIT_CROUCH
    ] = Enum249.SMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FALLBACK_HIT_STAND] =
      Enum249.SMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][
      Enum193.FALLBACK_HIT_DEATHTWITCHNB
    ] = Enum249.SMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.PRONE_HIT_DEATHTWITCHNB] =
      Enum249.SMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.PRONE_LAY_FROMHIT] =
      Enum249.SMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FALLOFF] =
      Enum249.SMERC_FALLF;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FALLFORWARD_ROOF] =
      Enum249.SMERC_FALL;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FLYBACKHIT_STOP] =
      Enum249.SMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.STAND_FALLFORWARD_STOP] =
      Enum249.SMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FALLBACKHIT_STOP] =
      Enum249.SMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.PRONE_LAYFROMHIT_STOP] =
      Enum249.SMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.CHARIOTS_OF_FIRE] =
      Enum249.BURNT_DEAD;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.BODYEXPLODING] =
      Enum249.EXPLODE_DEAD;

    // BIG MALE GUY
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.WALKING] = Enum195.BGMWALKING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.STANDING] =
      Enum195.BGMSTANDING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.KNEEL_DOWN] =
      Enum195.BGMCROUCHING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CROUCHING] =
      Enum195.BGMCROUCHING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.KNEEL_UP] =
      Enum195.BGMCROUCHING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SWATTING] =
      Enum195.BGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.RUNNING] = Enum195.BGMRUNNING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_DOWN] = Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CRAWLING] = Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_UP] = Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE] = Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.READY_RIFLE_STAND] =
      Enum195.BGMSTANDAIM2;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.AIM_RIFLE_STAND] =
      Enum195.BGMSTANDAIM2;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SHOOT_RIFLE_STAND] =
      Enum195.BGMSTANDAIM2;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_RIFLE_STAND] =
      Enum195.BGMSTANDAIM2;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.START_SWAT] =
      Enum195.BGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_SWAT] =
      Enum195.BGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FLYBACK_HIT] =
      Enum195.BGMHITHARD;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.READY_RIFLE_PRONE] =
      Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.AIM_RIFLE_PRONE] =
      Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SHOOT_RIFLE_PRONE] =
      Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_RIFLE_PRONE] =
      Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLBACK_DEATHTWICH] =
      Enum195.BGMHITHARD;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GENERIC_HIT_STAND] =
      Enum195.BGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FLYBACK_HIT_BLOOD_STAND] =
      Enum195.BGMHITHARDBLOOD;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FLYBACK_HIT_DEATH] =
      Enum195.BGMHITHARD;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.READY_RIFLE_CROUCH] =
      Enum195.BGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.AIM_RIFLE_CROUCH] =
      Enum195.BGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SHOOT_RIFLE_CROUCH] =
      Enum195.BGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_RIFLE_CROUCH] =
      Enum195.BGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLBACK_HIT_STAND] =
      Enum195.BGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.ROLLOVER] =
      Enum195.BGMROLLOVER;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CLIMBUPROOF] =
      Enum195.BGMCLIMBROOF;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF] = Enum195.BGMFALL;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GETUP_FROM_ROLLOVER] =
      Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CLIMBDOWNROOF] =
      Enum195.BGMCLIMBROOF;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLFORWARD_ROOF] =
      Enum195.BGMFALLF;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum195.BGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GENERIC_HIT_DEATHTWITCHB] =
      Enum195.BGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLBACK_HIT_DEATHTWITCHNB] =
      Enum195.BGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLBACK_HIT_DEATHTWITCHB] =
      Enum195.BGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum195.BGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLBACK_HIT_DEATH] =
      Enum195.BGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GENERIC_HIT_CROUCH] =
      Enum195.BGMHITCROUCH;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.STANDING_BURST] =
      Enum195.BGMSTANDAIM2;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.STANDING_BURST_HIT] =
      Enum195.BGMHITHARD;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum195.BGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.BGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.BGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLFORWARD_FROMHIT_CROUCH] =
      Enum195.BGMHITCROUCH;
    gubAnimSurfaceIndex[Enum194.BIGMALE][
      Enum193.ENDFALLFORWARD_FROMHIT_CROUCH
    ] = Enum195.BGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GENERIC_HIT_PRONE] =
      Enum195.BGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_HIT_DEATH] =
      Enum195.BGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_LAY_FROMHIT] =
      Enum195.BGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_HIT_DEATHTWITCHNB] =
      Enum195.BGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_HIT_DEATHTWITCHB] =
      Enum195.BGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FLYBACK_HITDEATH_STOP] =
      Enum195.BGMHITHARD;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLFORWARD_HITDEATH_STOP] =
      Enum195.BGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLBACK_HITDEATH_STOP] =
      Enum195.BGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_HITDEATH_STOP] =
      Enum195.BGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FLYBACKHIT_STOP] =
      Enum195.BGMHITHARD;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLBACKHIT_STOP] =
      Enum195.BGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF_STOP] =
      Enum195.BGMFALL;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF_FORWARD_STOP] =
      Enum195.BGMFALLF;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.STAND_FALLFORWARD_STOP] =
      Enum195.BGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_LAYFROMHIT_STOP] =
      Enum195.BGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.HOPFENCE] =
      Enum195.BGMHOPFENCE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PUNCH_BREATH] =
      Enum195.BGMPUNCH;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PUNCH] = Enum195.BGMPUNCH;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.NOTHING_STAND] =
      Enum195.BGMNOTHING_STD;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.JFK_HITDEATH] =
      Enum195.BGMDIE_JFK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.JFK_HITDEATH_STOP] =
      Enum195.BGMDIE_JFK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.JFK_HITDEATH_TWITCHB] =
      Enum195.BGMDIE_JFK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FIRE_STAND_BURST_SPREAD] =
      Enum195.BGMSTANDAIM2;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF_DEATH] =
      Enum195.BGMFALL;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF_DEATH_STOP] =
      Enum195.BGMFALL;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF_TWITCHB] =
      Enum195.BGMFALL;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF_TWITCHNB] =
      Enum195.BGMFALL;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF_FORWARD_DEATH] =
      Enum195.BGMFALLF;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF_FORWARD_DEATH_STOP] =
      Enum195.BGMFALLF;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF_FORWARD_TWITCHB] =
      Enum195.BGMFALLF;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALLOFF_FORWARD_TWITCHNB] =
      Enum195.BGMFALLF;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.OPEN_STRUCT] = Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.OPEN_DOOR] = Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PICKUP_ITEM] =
      Enum195.BGMPICKUP;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DROP_ITEM] = Enum195.BGMPICKUP;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SLICE] = Enum195.BGMSLICE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.STAB] = Enum195.BGMSTAB;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CROUCH_STAB] =
      Enum195.BGMCSTAB;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.START_AID] = Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GIVING_AID] = Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_AID] = Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DODGE_ONE] = Enum195.BGMDODGE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.READY_DUAL_STAND] =
      Enum195.BGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.AIM_DUAL_STAND] =
      Enum195.BGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SHOOT_DUAL_STAND] =
      Enum195.BGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_DUAL_STAND] =
      Enum195.BGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.RAISE_RIFLE] =
      Enum195.BGMRAISE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.LOWER_RIFLE] =
      Enum195.BGMRAISE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.THROW_ITEM] = Enum195.BGMTHROW;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.LOB_ITEM] = Enum195.BGMLOB;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BODYEXPLODING] =
      Enum195.BODYEXPLODE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CROUCHED_BURST] =
      Enum195.BGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_BURST] =
      Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BIGBUY_FLEX] = Enum195.BGMFLEX;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BIGBUY_STRECH] =
      Enum195.BGMSTRECH;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BIGBUY_SHOEDUST] =
      Enum195.BGMSHOEDUST;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BIGBUY_HEADTURN] =
      Enum195.BGMHEADTURN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GIVE_ITEM] = Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.WATER_HIT] =
      Enum195.BGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.WATER_DIE] =
      Enum195.BGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.WATER_DIE_STOP] =
      Enum195.BGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.HELIDROP] =
      Enum195.BGMHELIDROP;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_OPEN_DOOR] =
      Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_OPEN_LOCKED_DOOR] =
      Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.KICK_DOOR] =
      Enum195.BGMKICKDOOR;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CLOSE_DOOR] = Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.RIFLE_STAND_HIT] =
      Enum195.BGMRHIT;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DEEP_WATER_TRED] =
      Enum195.BGMDEEPWATER_TRED;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DEEP_WATER_SWIM] =
      Enum195.BGMDEEPWATER_SWIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DEEP_WATER_HIT] =
      Enum195.BGMDEEPWATER_DIE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DEEP_WATER_DIE] =
      Enum195.BGMDEEPWATER_DIE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DEEP_WATER_DIE_STOPPING] =
      Enum195.BGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DEEP_WATER_DIE_STOP] =
      Enum195.BGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.LOW_TO_DEEP_WATER] =
      Enum195.BGMWATER_TRANS;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DEEP_TO_LOW_WATER] =
      Enum195.BGMWATER_TRANS;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GOTO_SLEEP] = Enum195.BGMSLEEP;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SLEEPING] = Enum195.BGMSLEEP;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.WKAEUP_FROM_SLEEP] =
      Enum195.BGMSLEEP;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FIRE_LOW_STAND] =
      Enum195.BGMSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FIRE_BURST_LOW_STAND] =
      Enum195.BGMSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.STANDING_SHOOT_UNJAM] =
      Enum195.BGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CROUCH_SHOOT_UNJAM] =
      Enum195.BGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_SHOOT_UNJAM] =
      Enum195.BGMPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.STANDING_SHOOT_DWEL_UNJAM] =
      Enum195.BGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.STANDING_SHOOT_LOW_UNJAM] =
      Enum195.BGMSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.READY_DUAL_CROUCH] =
      Enum195.BGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.AIM_DUAL_CROUCH] =
      Enum195.BGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SHOOT_DUAL_CROUCH] =
      Enum195.BGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_DUAL_CROUCH] =
      Enum195.BGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CROUCH_SHOOT_DWEL_UNJAM] =
      Enum195.BGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.ADJACENT_GET_ITEM] =
      Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CUTTING_FENCE] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FROM_INJURED_TRANSITION] =
      Enum195.BGMHURTTRANS;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.THROW_KNIFE] =
      Enum195.BGMTHROWKNIFE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.KNIFE_BREATH] =
      Enum195.BGMBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.KNIFE_GOTOBREATH] =
      Enum195.BGMBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.KNIFE_ENDBREATH] =
      Enum195.BGMBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CATCH_STANDING] =
      Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CATCH_CROUCHED] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PLANT_BOMB] =
      Enum195.BGMPICKUP;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.USE_REMOTE] = Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.START_COWER] =
      Enum195.BGMCOWER;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.COWERING] = Enum195.BGMCOWER;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_COWER] = Enum195.BGMCOWER;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.STEAL_ITEM] = Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SHOOT_ROCKET] =
      Enum195.BGMROCKET;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SHOOT_MORTAR] =
      Enum195.BGMMORTAR;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SIDE_STEP] =
      Enum195.BGMSIDESTEP;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.WALK_BACKWARDS] =
      Enum195.BGMWALKING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BEGIN_OPENSTRUCT] =
      Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_OPENSTRUCT] =
      Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_OPENSTRUCT_LOCKED] =
      Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PUNCH_LOW] =
      Enum195.BGMPUNCHLOW;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PISTOL_SHOOT_LOW] =
      Enum195.BGMPISTOLSHOOTLOW;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DECAPITATE] = Enum195.BGMCSTAB;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BIGMERC_IDLE_NECK] =
      Enum195.BGMIDLENECK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BIGMERC_CROUCH_TRANS_INTO] =
      Enum195.BGMCROUCHTRANS;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BIGMERC_CROUCH_TRANS_OUTOF] =
      Enum195.BGMCROUCHTRANS;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GOTO_PATIENT] =
      Enum195.BGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BEING_PATIENT] =
      Enum195.BGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GOTO_DOCTOR] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BEING_DOCTOR] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_DOCTOR] = Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.GOTO_REPAIRMAN] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BEING_REPAIRMAN] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_REPAIRMAN] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.FALL_INTO_PIT] =
      Enum195.BGMFALL;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.RELOAD_ROBOT] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_CATCH] = Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_CROUCH_CATCH] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.AI_RADIO] = Enum195.BGMRADIO;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.AI_CR_RADIO] =
      Enum195.BGMCRRADIO;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.TAKE_BLOOD_FROM_CORPSE] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CHARIOTS_OF_FIRE] =
      Enum195.RGMBURN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.AI_PULL_SWITCH] =
      Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.MERC_HURT_IDLE_ANIM] =
      Enum195.BGMHURTSTANDINGR;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_HURT_WALKING] =
      Enum195.BGMHURTSTANDINGR;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PASS_OBJECT] = Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DROP_ADJACENT_OBJECT] =
      Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.READY_DUAL_PRONE] =
      Enum195.BGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.AIM_DUAL_PRONE] =
      Enum195.BGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SHOOT_DUAL_PRONE] =
      Enum195.BGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_DUAL_PRONE] =
      Enum195.BGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PRONE_SHOOT_DWEL_UNJAM] =
      Enum195.BGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.PICK_LOCK] = Enum195.BGMOPEN;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.OPEN_DOOR_CROUCHED] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.BEGIN_OPENSTRUCT_CROUCHED] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CLOSE_DOOR_CROUCHED] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.OPEN_STRUCT_CROUCHED] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_OPEN_DOOR_CROUCHED] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.END_OPENSTRUCT_CROUCHED] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][
      Enum193.END_OPEN_LOCKED_DOOR_CROUCHED
    ] = Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][
      Enum193.END_OPENSTRUCT_LOCKED_CROUCHED
    ] = Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.DRUNK_IDLE] = Enum195.BGMDRUNK;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.CROWBAR_ATTACK] =
      Enum195.BGMCROWBAR;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.ATTACH_CAN_TO_STRING] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.SWAT_BACKWARDS] =
      Enum195.BGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.JUMP_OVER_BLOCKING_PERSON] =
      Enum195.BGMJUMPOVER;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.REFUEL_VEHICLE] =
      Enum195.BGMMEDIC;
    gubAnimSurfaceIndex[Enum194.BIGMALE][Enum193.LOCKPICK_CROUCHED] =
      Enum195.BGMMEDIC;

    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.STANDING] =
      Enum195.BGMPISTOLBREATH;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.WALKING] =
      Enum195.BGMNOTHING_WALK;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.RUNNING] =
      Enum195.BGMNOTHING_RUN;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.SWATTING] =
      Enum195.BGMNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.START_SWAT] =
      Enum195.BGMNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.END_SWAT] =
      Enum195.BGMNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.KNEEL_DOWN] =
      Enum195.BGMNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.CROUCHING] =
      Enum195.BGMNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.KNEEL_UP] =
      Enum195.BGMNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.READY_RIFLE_STAND] =
      Enum195.BGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.AIM_RIFLE_STAND] =
      Enum195.BGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.SHOOT_RIFLE_STAND] =
      Enum195.BGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.END_RIFLE_STAND] =
      Enum195.BGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.STANDING_BURST] =
      Enum195.BGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ] = Enum195.BGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.READY_RIFLE_CROUCH] =
      Enum195.BGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.AIM_RIFLE_CROUCH] =
      Enum195.BGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.SHOOT_RIFLE_CROUCH] =
      Enum195.BGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.END_RIFLE_CROUCH] =
      Enum195.BGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.PRONE_DOWN] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.CRAWLING] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.PRONE_UP] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.PRONE] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.READY_RIFLE_PRONE] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.AIM_RIFLE_PRONE] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.SHOOT_RIFLE_PRONE] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.END_RIFLE_PRONE] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.GETUP_FROM_ROLLOVER] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.STANDING_SHOOT_UNJAM] =
      Enum195.BGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.CROUCH_SHOOT_UNJAM] =
      Enum195.BGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.PRONE_SHOOT_UNJAM] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.FIRE_BURST_LOW_STAND] =
      Enum195.BGMPISTOLSHOOTLOW;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.FIRE_LOW_STAND] =
      Enum195.BGMPISTOLSHOOTLOW;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.CROUCHED_BURST] =
      Enum195.BGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.PRONE_BURST] =
      Enum195.BGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.MERC_HURT_IDLE_ANIM] =
      Enum195.BGMHURTSTANDINGN;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.END_HURT_WALKING] =
      Enum195.BGMHURTSTANDINGN;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.WALK_BACKWARDS] =
      Enum195.BGMNOTHING_WALK;
    gubAnimSurfaceItemSubIndex[Enum194.BIGMALE][Enum193.DRUNK_IDLE] =
      Enum195.BGMPISTOLDRUNK;

    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.STANDING][0] =
      Enum195.BGMWATER_R_STD;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.WALKING][0] =
      Enum195.BGMWATER_R_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.RUNNING][0] =
      Enum195.BGMWATER_R_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.READY_RIFLE_STAND
    ][0] = Enum195.BGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.AIM_RIFLE_STAND
    ][0] = Enum195.BGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.SHOOT_RIFLE_STAND
    ][0] = Enum195.BGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.END_RIFLE_STAND
    ][0] = Enum195.BGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.STANDING_BURST][0] =
      Enum195.BGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ][0] = Enum195.BGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.STANDING][1] =
      Enum195.BGMWATER_N_STD;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.WALKING][1] =
      Enum195.BGMWATER_N_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.RUNNING][1] =
      Enum195.BGMWATER_N_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.READY_RIFLE_STAND
    ][1] = Enum195.BGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.AIM_RIFLE_STAND
    ][1] = Enum195.BGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.SHOOT_RIFLE_STAND
    ][1] = Enum195.BGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.END_RIFLE_STAND
    ][1] = Enum195.BGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.STANDING_BURST][1] =
      Enum195.BGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ][1] = Enum195.BGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.READY_DUAL_STAND
    ][1] = Enum195.BGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.AIM_DUAL_STAND][1] =
      Enum195.BGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.SHOOT_DUAL_STAND
    ][1] = Enum195.BGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.END_DUAL_STAND][1] =
      Enum195.BGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.STANDING_SHOOT_UNJAM
    ][0] = Enum195.BGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][
      Enum193.STANDING_SHOOT_UNJAM
    ][1] = Enum195.BGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.THROW_ITEM][0] =
      Enum195.BGMWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.THROW_ITEM][1] =
      Enum195.BGMWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.LOB_ITEM][0] =
      Enum195.BGMWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.BIGMALE][Enum193.LOB_ITEM][1] =
      Enum195.BGMWATERTHROW;

    // Setup some random stuff
    gRandomAnimDefs[Enum194.BIGMALE][0].ubHandRestriction =
      RANDOM_ANIM_NOTHINGINHAND;
    gRandomAnimDefs[Enum194.BIGMALE][0].sAnimID = Enum193.BIGBUY_FLEX;
    gRandomAnimDefs[Enum194.BIGMALE][0].ubStartRoll = 0;
    gRandomAnimDefs[Enum194.BIGMALE][0].ubEndRoll = 3;
    gRandomAnimDefs[Enum194.BIGMALE][0].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.BIGMALE][0].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.BIGMALE][1].ubHandRestriction =
      RANDOM_ANIM_NOTHINGINHAND;
    gRandomAnimDefs[Enum194.BIGMALE][1].sAnimID = Enum193.BIGBUY_STRECH;
    gRandomAnimDefs[Enum194.BIGMALE][1].ubStartRoll = 10;
    gRandomAnimDefs[Enum194.BIGMALE][1].ubEndRoll = 13;
    gRandomAnimDefs[Enum194.BIGMALE][1].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.BIGMALE][1].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.BIGMALE][2].ubHandRestriction =
      RANDOM_ANIM_RIFLEINHAND;
    gRandomAnimDefs[Enum194.BIGMALE][2].sAnimID = Enum193.BIGBUY_SHOEDUST;
    gRandomAnimDefs[Enum194.BIGMALE][2].ubStartRoll = 20;
    gRandomAnimDefs[Enum194.BIGMALE][2].ubEndRoll = 23;
    gRandomAnimDefs[Enum194.BIGMALE][2].ubFlags =
      RANDOM_ANIM_CASUAL | RANDOM_ANIM_FIRSTBIGMERC;
    gRandomAnimDefs[Enum194.BIGMALE][2].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.BIGMALE][3].ubHandRestriction =
      RANDOM_ANIM_RIFLEINHAND;
    gRandomAnimDefs[Enum194.BIGMALE][3].sAnimID = Enum193.BIGBUY_HEADTURN;
    gRandomAnimDefs[Enum194.BIGMALE][3].ubStartRoll = 30;
    gRandomAnimDefs[Enum194.BIGMALE][3].ubEndRoll = 33;
    gRandomAnimDefs[Enum194.BIGMALE][3].ubFlags = RANDOM_ANIM_FIRSTBIGMERC;
    gRandomAnimDefs[Enum194.BIGMALE][3].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.BIGMALE][4].ubHandRestriction =
      RANDOM_ANIM_RIFLEINHAND;
    gRandomAnimDefs[Enum194.BIGMALE][4].sAnimID = Enum193.BIGMERC_IDLE_NECK;
    gRandomAnimDefs[Enum194.BIGMALE][4].ubStartRoll = 30;
    gRandomAnimDefs[Enum194.BIGMALE][4].ubEndRoll = 36;
    gRandomAnimDefs[Enum194.BIGMALE][4].ubFlags = RANDOM_ANIM_SECONDBIGMERC;
    gRandomAnimDefs[Enum194.BIGMALE][4].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.BIGMALE][5].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.BIGMALE][5].sAnimID = Enum193.MERC_HURT_IDLE_ANIM;
    gRandomAnimDefs[Enum194.BIGMALE][5].ubStartRoll = 40;
    gRandomAnimDefs[Enum194.BIGMALE][5].ubEndRoll = 100;
    gRandomAnimDefs[Enum194.BIGMALE][5].ubFlags = RANDOM_ANIM_INJURED;
    gRandomAnimDefs[Enum194.BIGMALE][5].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.BIGMALE][6].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.BIGMALE][6].sAnimID = Enum193.DRUNK_IDLE;
    gRandomAnimDefs[Enum194.BIGMALE][6].ubStartRoll = 40;
    gRandomAnimDefs[Enum194.BIGMALE][6].ubEndRoll = 100;
    gRandomAnimDefs[Enum194.BIGMALE][6].ubFlags = RANDOM_ANIM_DRUNK;
    gRandomAnimDefs[Enum194.BIGMALE][6].ubAnimHeight = ANIM_STAND;

    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum249.MMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.FALLBACK_HIT_DEATH] =
      Enum249.MMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.PRONE_HIT_DEATH] =
      Enum249.MMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.WATER_DIE] =
      Enum249.MMERC_WTR;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.FLYBACK_HIT_DEATH] =
      Enum249.MMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.JFK_HITDEATH] =
      Enum249.MMERC_JFK;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.FALLOFF_DEATH] =
      Enum249.MMERC_FALL;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.FALLOFF_FORWARD_DEATH] =
      Enum249.MMERC_FALLF;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.FLYBACK_HIT] =
      Enum249.MMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum249.MMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum249.MMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][
      Enum193.ENDFALLFORWARD_FROMHIT_CROUCH
    ] = Enum249.MMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.FALLBACK_HIT_STAND] =
      Enum249.MMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][
      Enum193.FALLBACK_HIT_DEATHTWITCHNB
    ] = Enum249.MMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.PRONE_HIT_DEATHTWITCHNB] =
      Enum249.MMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.PRONE_LAY_FROMHIT] =
      Enum249.MMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FALLOFF] =
      Enum249.MMERC_FALLF;
    gubAnimSurfaceCorpseID[Enum194.REGMALE][Enum193.FALLFORWARD_ROOF] =
      Enum249.MMERC_FALL;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.FLYBACKHIT_STOP] =
      Enum249.MMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.STAND_FALLFORWARD_STOP] =
      Enum249.MMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.FALLBACKHIT_STOP] =
      Enum249.MMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.PRONE_LAYFROMHIT_STOP] =
      Enum249.MMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.CHARIOTS_OF_FIRE] =
      Enum249.BURNT_DEAD;
    gubAnimSurfaceCorpseID[Enum194.BIGMALE][Enum193.BODYEXPLODING] =
      Enum249.EXPLODE_DEAD;

    // STOCKY MALE GUY
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.WALKING] =
      Enum195.RGMBASICWALKING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.STANDING] =
      Enum195.RGMSTANDING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.KNEEL_DOWN] =
      Enum195.RGMCROUCHING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CROUCHING] =
      Enum195.RGMCROUCHING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.KNEEL_UP] =
      Enum195.RGMCROUCHING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SWATTING] =
      Enum195.RGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.RUNNING] =
      Enum195.RGMRUNNING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_DOWN] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CRAWLING] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_UP] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE] = Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.READY_RIFLE_STAND] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.AIM_RIFLE_STAND] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SHOOT_RIFLE_STAND] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_RIFLE_STAND] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.START_SWAT] =
      Enum195.RGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_SWAT] =
      Enum195.RGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FLYBACK_HIT] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.READY_RIFLE_PRONE] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.AIM_RIFLE_PRONE] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SHOOT_RIFLE_PRONE] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_RIFLE_PRONE] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLBACK_DEATHTWICH] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GENERIC_HIT_STAND] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FLYBACK_HIT_BLOOD_STAND] =
      Enum195.RGMHITHARDBLOOD;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FLYBACK_HIT_DEATH] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.READY_RIFLE_CROUCH] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.AIM_RIFLE_CROUCH] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SHOOT_RIFLE_CROUCH] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_RIFLE_CROUCH] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLBACK_HIT_STAND] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.ROLLOVER] =
      Enum195.RGMROLLOVER;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CLIMBUPROOF] =
      Enum195.RGMCLIMBROOF;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLOFF] = Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GETUP_FROM_ROLLOVER] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CLIMBDOWNROOF] =
      Enum195.RGMCLIMBROOF;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLFORWARD_ROOF] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GENERIC_HIT_DEATHTWITCHB] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][
      Enum193.FALLBACK_HIT_DEATHTWITCHNB
    ] = Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLBACK_HIT_DEATHTWITCHB] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLBACK_HIT_DEATH] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GENERIC_HIT_CROUCH] =
      Enum195.RGMHITCROUCH;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.STANDING_BURST] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.STANDING_BURST_HIT] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][
      Enum193.FALLFORWARD_FROMHIT_CROUCH
    ] = Enum195.RGMHITCROUCH;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][
      Enum193.ENDFALLFORWARD_FROMHIT_CROUCH
    ] = Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GENERIC_HIT_PRONE] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_HIT_DEATH] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_LAY_FROMHIT] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_HIT_DEATHTWITCHNB] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_HIT_DEATHTWITCHB] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FLYBACK_HITDEATH_STOP] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLFORWARD_HITDEATH_STOP] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLBACK_HITDEATH_STOP] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_HITDEATH_STOP] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FLYBACKHIT_STOP] =
      Enum195.RGMHITHARD;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLBACKHIT_STOP] =
      Enum195.RGMHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLOFF_STOP] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLOFF_FORWARD_STOP] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.STAND_FALLFORWARD_STOP] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_LAYFROMHIT_STOP] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.HOPFENCE] =
      Enum195.RGMHOPFENCE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PUNCH_BREATH] =
      Enum195.RGMPUNCH;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PUNCH] = Enum195.RGMPUNCH;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.NOTHING_STAND] =
      Enum195.RGMNOTHING_STD;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.JFK_HITDEATH] =
      Enum195.RGMDIE_JFK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.JFK_HITDEATH_STOP] =
      Enum195.RGMDIE_JFK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.JFK_HITDEATH_TWITCHB] =
      Enum195.RGMDIE_JFK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FIRE_STAND_BURST_SPREAD] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLOFF_DEATH] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLOFF_DEATH_STOP] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLOFF_TWITCHB] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLOFF_TWITCHNB] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLOFF_FORWARD_DEATH] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][
      Enum193.FALLOFF_FORWARD_DEATH_STOP
    ] = Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLOFF_FORWARD_TWITCHB] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALLOFF_FORWARD_TWITCHNB] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.OPEN_DOOR] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.OPEN_STRUCT] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PICKUP_ITEM] =
      Enum195.RGMPICKUP;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DROP_ITEM] =
      Enum195.RGMPICKUP;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SLICE] = Enum195.RGMSLICE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.STAB] = Enum195.RGMSTAB;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CROUCH_STAB] =
      Enum195.RGMCSTAB;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.START_AID] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GIVING_AID] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_AID] = Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DODGE_ONE] =
      Enum195.RGMDODGE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.READY_DUAL_STAND] =
      Enum195.RGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.AIM_DUAL_STAND] =
      Enum195.RGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SHOOT_DUAL_STAND] =
      Enum195.RGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_DUAL_STAND] =
      Enum195.RGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.RAISE_RIFLE] =
      Enum195.RGMRAISE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.LOWER_RIFLE] =
      Enum195.RGMRAISE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.BODYEXPLODING] =
      Enum195.BODYEXPLODE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.THROW_ITEM] =
      Enum195.RGMTHROW;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.LOB_ITEM] = Enum195.RGMLOB;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CROUCHED_BURST] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_BURST] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GIVE_ITEM] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.WATER_HIT] =
      Enum195.RGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.WATER_DIE] =
      Enum195.RGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.WATER_DIE_STOP] =
      Enum195.RGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.HELIDROP] =
      Enum195.RGMHELIDROP;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FEM_LOOK] =
      Enum195.RGM_LOOK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.REG_SQUISH] =
      Enum195.RGM_SQUISH;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.REG_PULL] =
      Enum195.RGM_PULL;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.REG_SPIT] =
      Enum195.RGM_SPIT;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.NINJA_GOTOBREATH] =
      Enum195.RGMLOWKICK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.NINJA_BREATH] =
      Enum195.RGMLOWKICK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.NINJA_LOWKICK] =
      Enum195.RGMLOWKICK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.NINJA_PUNCH] =
      Enum195.RGMNPUNCH;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.NINJA_SPINKICK] =
      Enum195.RGMSPINKICK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_OPEN_DOOR] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_OPEN_LOCKED_DOOR] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.KICK_DOOR] =
      Enum195.RGMKICKDOOR;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CLOSE_DOOR] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.RIFLE_STAND_HIT] =
      Enum195.RGMRHIT;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DEEP_WATER_TRED] =
      Enum195.RGMDEEPWATER_TRED;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DEEP_WATER_SWIM] =
      Enum195.RGMDEEPWATER_SWIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DEEP_WATER_HIT] =
      Enum195.RGMDEEPWATER_DIE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DEEP_WATER_DIE] =
      Enum195.RGMDEEPWATER_DIE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DEEP_WATER_DIE_STOPPING] =
      Enum195.RGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DEEP_WATER_DIE_STOP] =
      Enum195.RGMWATER_DIE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.LOW_TO_DEEP_WATER] =
      Enum195.RGMWATER_TRANS;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DEEP_TO_LOW_WATER] =
      Enum195.RGMWATER_TRANS;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GOTO_SLEEP] =
      Enum195.RGMSLEEP;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SLEEPING] =
      Enum195.RGMSLEEP;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.WKAEUP_FROM_SLEEP] =
      Enum195.RGMSLEEP;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FIRE_LOW_STAND] =
      Enum195.RGMSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FIRE_BURST_LOW_STAND] =
      Enum195.RGMSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.STANDING_SHOOT_UNJAM] =
      Enum195.RGMSTANDAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CROUCH_SHOOT_UNJAM] =
      Enum195.RGMCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_SHOOT_UNJAM] =
      Enum195.RGMPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.STANDING_SHOOT_DWEL_UNJAM] =
      Enum195.RGMSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.STANDING_SHOOT_LOW_UNJAM] =
      Enum195.RGMSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.READY_DUAL_CROUCH] =
      Enum195.RGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.AIM_DUAL_CROUCH] =
      Enum195.RGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SHOOT_DUAL_CROUCH] =
      Enum195.RGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_DUAL_CROUCH] =
      Enum195.RGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CROUCH_SHOOT_DWEL_UNJAM] =
      Enum195.RGMCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.ADJACENT_GET_ITEM] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CUTTING_FENCE] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FROM_INJURED_TRANSITION] =
      Enum195.RGMHURTTRANS;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.THROW_KNIFE] =
      Enum195.RGMTHROWKNIFE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.KNIFE_BREATH] =
      Enum195.RGMBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.KNIFE_GOTOBREATH] =
      Enum195.RGMBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.KNIFE_ENDBREATH] =
      Enum195.RGMBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CATCH_STANDING] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CATCH_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PLANT_BOMB] =
      Enum195.RGMPICKUP;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.USE_REMOTE] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.START_COWER] =
      Enum195.RGMCOWER;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.COWERING] =
      Enum195.RGMCOWER;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_COWER] =
      Enum195.RGMCOWER;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.STEAL_ITEM] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SHOOT_ROCKET] =
      Enum195.RGMROCKET;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SHOOT_MORTAR] =
      Enum195.RGMMORTAR;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SIDE_STEP] =
      Enum195.RGMSIDESTEP;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.WALK_BACKWARDS] =
      Enum195.RGMBASICWALKING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.BEGIN_OPENSTRUCT] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_OPENSTRUCT] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_OPENSTRUCT_LOCKED] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PUNCH_LOW] =
      Enum195.RGMPUNCHLOW;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PISTOL_SHOOT_LOW] =
      Enum195.RGMPISTOLSHOOTLOW;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DECAPITATE] =
      Enum195.RGMCSTAB;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GOTO_PATIENT] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.BEING_PATIENT] =
      Enum195.RGMHITPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GOTO_DOCTOR] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.BEING_DOCTOR] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_DOCTOR] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.GOTO_REPAIRMAN] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.BEING_REPAIRMAN] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_REPAIRMAN] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.FALL_INTO_PIT] =
      Enum195.RGMFALL;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.RELOAD_ROBOT] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_CATCH] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_CROUCH_CATCH] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.AI_RADIO] =
      Enum195.RGMRADIO;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.AI_CR_RADIO] =
      Enum195.RGMCRRADIO;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SLAP_HIT] =
      Enum195.RGMHITSTAND;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.TAKE_BLOOD_FROM_CORPSE] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CHARIOTS_OF_FIRE] =
      Enum195.RGMBURN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.AI_PULL_SWITCH] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.MERC_HURT_IDLE_ANIM] =
      Enum195.RGMHURTSTANDINGR;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_HURT_WALKING] =
      Enum195.RGMHURTSTANDINGR;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PASS_OBJECT] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DROP_ADJACENT_OBJECT] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.READY_DUAL_PRONE] =
      Enum195.RGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.AIM_DUAL_PRONE] =
      Enum195.RGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SHOOT_DUAL_PRONE] =
      Enum195.RGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_DUAL_PRONE] =
      Enum195.RGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PRONE_SHOOT_DWEL_UNJAM] =
      Enum195.RGMDWPRONE;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.PICK_LOCK] =
      Enum195.RGMOPEN;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.OPEN_DOOR_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.BEGIN_OPENSTRUCT_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CLOSE_DOOR_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.OPEN_STRUCT_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_OPEN_DOOR_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.END_OPENSTRUCT_CROUCHED] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][
      Enum193.END_OPEN_LOCKED_DOOR_CROUCHED
    ] = Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][
      Enum193.END_OPENSTRUCT_LOCKED_CROUCHED
    ] = Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.DRUNK_IDLE] =
      Enum195.RGMDRUNK;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.CROWBAR_ATTACK] =
      Enum195.RGMCROWBAR;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.ATTACH_CAN_TO_STRING] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.SWAT_BACKWARDS] =
      Enum195.RGMSNEAKING;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.JUMP_OVER_BLOCKING_PERSON] =
      Enum195.RGMJUMPOVER;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.REFUEL_VEHICLE] =
      Enum195.RGMMEDIC;
    gubAnimSurfaceIndex[Enum194.STOCKYMALE][Enum193.LOCKPICK_CROUCHED] =
      Enum195.RGMMEDIC;

    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.STANDING] =
      Enum195.RGMPISTOLBREATH;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.WALKING] =
      Enum195.RGMNOTHING_WALK;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.RUNNING] =
      Enum195.RGMNOTHING_RUN;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.SWATTING] =
      Enum195.RGMNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.START_SWAT] =
      Enum195.RGMNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.END_SWAT] =
      Enum195.RGMNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.KNEEL_DOWN] =
      Enum195.RGMNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.CROUCHING] =
      Enum195.RGMNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.KNEEL_UP] =
      Enum195.RGMNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.READY_RIFLE_STAND] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.AIM_RIFLE_STAND] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.SHOOT_RIFLE_STAND] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.END_RIFLE_STAND] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.STANDING_BURST] =
      Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ] = Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.READY_RIFLE_CROUCH] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.AIM_RIFLE_CROUCH] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.SHOOT_RIFLE_CROUCH] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.END_RIFLE_CROUCH] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.PRONE_DOWN] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.CRAWLING] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.PRONE_UP] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.PRONE] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.READY_RIFLE_PRONE] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.AIM_RIFLE_PRONE] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.SHOOT_RIFLE_PRONE] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.END_RIFLE_PRONE] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][
      Enum193.GETUP_FROM_ROLLOVER
    ] = Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][
      Enum193.STANDING_SHOOT_UNJAM
    ] = Enum195.RGMHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.CROUCH_SHOOT_UNJAM] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.PRONE_SHOOT_UNJAM] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][
      Enum193.FIRE_BURST_LOW_STAND
    ] = Enum195.RGMPISTOLSHOOTLOW;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.FIRE_LOW_STAND] =
      Enum195.RGMPISTOLSHOOTLOW;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.CROUCHED_BURST] =
      Enum195.RGMHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.PRONE_BURST] =
      Enum195.RGMHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][
      Enum193.MERC_HURT_IDLE_ANIM
    ] = Enum195.RGMHURTSTANDINGN;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.END_HURT_WALKING] =
      Enum195.RGMHURTSTANDINGN;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.WALK_BACKWARDS] =
      Enum195.RGMNOTHING_WALK;
    gubAnimSurfaceItemSubIndex[Enum194.STOCKYMALE][Enum193.DRUNK_IDLE] =
      Enum195.RGMPISTOLDRUNK;

    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][Enum193.STANDING][0] =
      Enum195.RGMWATER_R_STD;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][Enum193.WALKING][0] =
      Enum195.RGMWATER_R_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][Enum193.RUNNING][0] =
      Enum195.RGMWATER_R_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.READY_RIFLE_STAND
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.AIM_RIFLE_STAND
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.SHOOT_RIFLE_STAND
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.END_RIFLE_STAND
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.STANDING_BURST
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][Enum193.STANDING][1] =
      Enum195.RGMWATER_N_STD;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][Enum193.WALKING][1] =
      Enum195.RGMWATER_N_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][Enum193.RUNNING][1] =
      Enum195.RGMWATER_N_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.READY_RIFLE_STAND
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.AIM_RIFLE_STAND
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.SHOOT_RIFLE_STAND
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.END_RIFLE_STAND
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.STANDING_BURST
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.READY_DUAL_STAND
    ][1] = Enum195.RGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.AIM_DUAL_STAND
    ][1] = Enum195.RGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.SHOOT_DUAL_STAND
    ][1] = Enum195.RGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.END_DUAL_STAND
    ][1] = Enum195.RGMWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.STANDING_SHOOT_UNJAM
    ][0] = Enum195.RGMWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][
      Enum193.STANDING_SHOOT_UNJAM
    ][1] = Enum195.RGMWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][Enum193.THROW_ITEM][0] =
      Enum195.RGMWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][Enum193.THROW_ITEM][1] =
      Enum195.RGMWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][Enum193.LOB_ITEM][0] =
      Enum195.RGMWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.STOCKYMALE][Enum193.LOB_ITEM][1] =
      Enum195.RGMWATERTHROW;

    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum249.SMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.FALLBACK_HIT_DEATH] =
      Enum249.SMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.PRONE_HIT_DEATH] =
      Enum249.SMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.WATER_DIE] =
      Enum249.SMERC_WTR;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.FLYBACK_HIT_DEATH] =
      Enum249.SMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.JFK_HITDEATH] =
      Enum249.SMERC_JFK;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.FALLOFF_DEATH] =
      Enum249.SMERC_FALL;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.FALLOFF_FORWARD_DEATH] =
      Enum249.SMERC_FALLF;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.FLYBACK_HIT] =
      Enum249.SMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][
      Enum193.GENERIC_HIT_DEATHTWITCHNB
    ] = Enum249.SMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][
      Enum193.FALLFORWARD_FROMHIT_STAND
    ] = Enum249.SMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][
      Enum193.ENDFALLFORWARD_FROMHIT_CROUCH
    ] = Enum249.SMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.FALLBACK_HIT_STAND] =
      Enum249.SMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][
      Enum193.FALLBACK_HIT_DEATHTWITCHNB
    ] = Enum249.SMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][
      Enum193.PRONE_HIT_DEATHTWITCHNB
    ] = Enum249.SMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.PRONE_LAY_FROMHIT] =
      Enum249.SMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.FALLOFF] =
      Enum249.SMERC_FALLF;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.FALLFORWARD_ROOF] =
      Enum249.SMERC_FALL;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.FLYBACKHIT_STOP] =
      Enum249.SMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.STAND_FALLFORWARD_STOP] =
      Enum249.SMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.FALLBACKHIT_STOP] =
      Enum249.SMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.PRONE_LAYFROMHIT_STOP] =
      Enum249.SMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.CHARIOTS_OF_FIRE] =
      Enum249.BURNT_DEAD;
    gubAnimSurfaceCorpseID[Enum194.STOCKYMALE][Enum193.BODYEXPLODING] =
      Enum249.EXPLODE_DEAD;

    // Setup some random stuff
    gRandomAnimDefs[Enum194.STOCKYMALE][0].ubHandRestriction =
      RANDOM_ANIM_RIFLEINHAND;
    gRandomAnimDefs[Enum194.STOCKYMALE][0].sAnimID = Enum193.REG_SPIT;
    gRandomAnimDefs[Enum194.STOCKYMALE][0].ubStartRoll = 0;
    gRandomAnimDefs[Enum194.STOCKYMALE][0].ubEndRoll = 3;
    gRandomAnimDefs[Enum194.STOCKYMALE][0].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.STOCKYMALE][0].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.STOCKYMALE][1].ubHandRestriction =
      RANDOM_ANIM_NOTHINGINHAND;
    gRandomAnimDefs[Enum194.STOCKYMALE][1].sAnimID = Enum193.REG_SQUISH;
    gRandomAnimDefs[Enum194.STOCKYMALE][1].ubStartRoll = 10;
    gRandomAnimDefs[Enum194.STOCKYMALE][1].ubEndRoll = 13;
    gRandomAnimDefs[Enum194.STOCKYMALE][1].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.STOCKYMALE][1].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.STOCKYMALE][2].ubHandRestriction =
      RANDOM_ANIM_RIFLEINHAND;
    gRandomAnimDefs[Enum194.STOCKYMALE][2].sAnimID = Enum193.FEM_LOOK;
    gRandomAnimDefs[Enum194.STOCKYMALE][2].ubStartRoll = 20;
    gRandomAnimDefs[Enum194.STOCKYMALE][2].ubEndRoll = 23;
    gRandomAnimDefs[Enum194.STOCKYMALE][2].ubFlags = 0;
    gRandomAnimDefs[Enum194.STOCKYMALE][2].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.STOCKYMALE][3].ubHandRestriction =
      RANDOM_ANIM_NOTHINGINHAND;
    gRandomAnimDefs[Enum194.STOCKYMALE][3].sAnimID = Enum193.REG_PULL;
    gRandomAnimDefs[Enum194.STOCKYMALE][3].ubStartRoll = 30;
    gRandomAnimDefs[Enum194.STOCKYMALE][3].ubEndRoll = 33;
    gRandomAnimDefs[Enum194.STOCKYMALE][3].ubFlags = 0;
    gRandomAnimDefs[Enum194.STOCKYMALE][3].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.STOCKYMALE][4].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.STOCKYMALE][4].sAnimID =
      Enum193.MERC_HURT_IDLE_ANIM;
    gRandomAnimDefs[Enum194.STOCKYMALE][4].ubStartRoll = 40;
    gRandomAnimDefs[Enum194.STOCKYMALE][4].ubEndRoll = 100;
    gRandomAnimDefs[Enum194.STOCKYMALE][4].ubFlags = RANDOM_ANIM_INJURED;
    gRandomAnimDefs[Enum194.STOCKYMALE][4].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.STOCKYMALE][5].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.STOCKYMALE][5].sAnimID = Enum193.DRUNK_IDLE;
    gRandomAnimDefs[Enum194.STOCKYMALE][5].ubStartRoll = 40;
    gRandomAnimDefs[Enum194.STOCKYMALE][5].ubEndRoll = 100;
    gRandomAnimDefs[Enum194.STOCKYMALE][5].ubFlags = RANDOM_ANIM_DRUNK;
    gRandomAnimDefs[Enum194.STOCKYMALE][5].ubAnimHeight = ANIM_STAND;

    // REG FEMALE GUY
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.WALKING] =
      Enum195.RGFWALKING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.STANDING] =
      Enum195.RGFSTANDING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.KNEEL_DOWN] =
      Enum195.RGFCROUCHING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CROUCHING] =
      Enum195.RGFCROUCHING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.KNEEL_UP] =
      Enum195.RGFCROUCHING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SWATTING] =
      Enum195.RGFSNEAKING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.RUNNING] =
      Enum195.RGFRUNNING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_DOWN] =
      Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CRAWLING] = Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_UP] = Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE] = Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.READY_RIFLE_STAND] =
      Enum195.RGFSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.AIM_RIFLE_STAND] =
      Enum195.RGFSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SHOOT_RIFLE_STAND] =
      Enum195.RGFSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_RIFLE_STAND] =
      Enum195.RGFSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.START_SWAT] =
      Enum195.RGFSNEAKING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_SWAT] =
      Enum195.RGFSNEAKING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FLYBACK_HIT] =
      Enum195.RGFHITHARD;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.READY_RIFLE_PRONE] =
      Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.AIM_RIFLE_PRONE] =
      Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SHOOT_RIFLE_PRONE] =
      Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_RIFLE_PRONE] =
      Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLBACK_DEATHTWICH] =
      Enum195.RGFHITHARD;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GENERIC_HIT_STAND] =
      Enum195.RGFHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FLYBACK_HIT_BLOOD_STAND] =
      Enum195.RGFHITHARDBLOOD;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FLYBACK_HIT_DEATH] =
      Enum195.RGFHITHARD;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.READY_RIFLE_CROUCH] =
      Enum195.RGFCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.AIM_RIFLE_CROUCH] =
      Enum195.RGFCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SHOOT_RIFLE_CROUCH] =
      Enum195.RGFCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_RIFLE_CROUCH] =
      Enum195.RGFCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLBACK_HIT_STAND] =
      Enum195.RGFHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.ROLLOVER] =
      Enum195.RGFROLLOVER;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CLIMBUPROOF] =
      Enum195.RGFCLIMBROOF;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLOFF] = Enum195.RGFFALL;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GETUP_FROM_ROLLOVER] =
      Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CLIMBDOWNROOF] =
      Enum195.RGFCLIMBROOF;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLFORWARD_ROOF] =
      Enum195.RGFFALLF;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum195.RGFHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GENERIC_HIT_DEATHTWITCHB] =
      Enum195.RGFHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLBACK_HIT_DEATHTWITCHNB] =
      Enum195.RGFHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLBACK_HIT_DEATHTWITCHB] =
      Enum195.RGFHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum195.RGFHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLBACK_HIT_DEATH] =
      Enum195.RGFHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GENERIC_HIT_CROUCH] =
      Enum195.RGFHITCROUCH;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.STANDING_BURST] =
      Enum195.RGFSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.STANDING_BURST_HIT] =
      Enum195.RGFHITHARD;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum195.RGFHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.RGFHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.RGFHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLFORWARD_FROMHIT_CROUCH] =
      Enum195.RGFHITCROUCH;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][
      Enum193.ENDFALLFORWARD_FROMHIT_CROUCH
    ] = Enum195.RGFHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GENERIC_HIT_PRONE] =
      Enum195.RGFHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_HIT_DEATH] =
      Enum195.RGFHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_LAY_FROMHIT] =
      Enum195.RGFHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_HIT_DEATHTWITCHNB] =
      Enum195.RGFHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_HIT_DEATHTWITCHB] =
      Enum195.RGFHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FLYBACK_HITDEATH_STOP] =
      Enum195.RGFHITHARD;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLFORWARD_HITDEATH_STOP] =
      Enum195.RGFHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLBACK_HITDEATH_STOP] =
      Enum195.RGFHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_HITDEATH_STOP] =
      Enum195.RGFHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FLYBACKHIT_STOP] =
      Enum195.RGFHITHARD;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLBACKHIT_STOP] =
      Enum195.RGFHITFALLBACK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLOFF_STOP] =
      Enum195.RGFFALL;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLOFF_FORWARD_STOP] =
      Enum195.RGFFALLF;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.STAND_FALLFORWARD_STOP] =
      Enum195.RGFHITSTAND;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_LAYFROMHIT_STOP] =
      Enum195.RGFHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.HOPFENCE] =
      Enum195.RGFHOPFENCE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PUNCH_BREATH] =
      Enum195.RGFPUNCH;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PUNCH] = Enum195.RGFPUNCH;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.NOTHING_STAND] =
      Enum195.RGFNOTHING_STD;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.JFK_HITDEATH] =
      Enum195.RGFDIE_JFK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.JFK_HITDEATH_STOP] =
      Enum195.RGFDIE_JFK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.JFK_HITDEATH_TWITCHB] =
      Enum195.RGFDIE_JFK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FIRE_STAND_BURST_SPREAD] =
      Enum195.RGFSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLOFF_DEATH] =
      Enum195.RGFFALL;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLOFF_FORWARD_DEATH] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLOFF_FORWARD_DEATH_STOP] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLOFF_FORWARD_TWITCHB] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALLOFF_FORWARD_TWITCHNB] =
      Enum195.RGMFALLF;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.OPEN_DOOR] = Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.OPEN_STRUCT] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PICKUP_ITEM] =
      Enum195.RGFPICKUP;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DROP_ITEM] =
      Enum195.RGFPICKUP;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SLICE] = Enum195.RGFSLICE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.STAB] = Enum195.RGFSTAB;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CROUCH_STAB] =
      Enum195.RGFCSTAB;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.START_AID] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GIVING_AID] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_AID] = Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DODGE_ONE] =
      Enum195.RGFDODGE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.READY_DUAL_STAND] =
      Enum195.RGFSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.AIM_DUAL_STAND] =
      Enum195.RGFSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SHOOT_DUAL_STAND] =
      Enum195.RGFSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_DUAL_STAND] =
      Enum195.RGFSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.RAISE_RIFLE] =
      Enum195.RGFRAISE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.LOWER_RIFLE] =
      Enum195.RGFRAISE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.BODYEXPLODING] =
      Enum195.BODYEXPLODE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.THROW_ITEM] =
      Enum195.RGFTHROW;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.LOB_ITEM] = Enum195.RGFLOB;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CROUCHED_BURST] =
      Enum195.RGFCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_BURST] =
      Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GIVE_ITEM] = Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.WATER_HIT] =
      Enum195.RGFWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.WATER_DIE] =
      Enum195.RGFWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.WATER_DIE_STOP] =
      Enum195.RGFWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.HELIDROP] =
      Enum195.RGFHELIDROP;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FEM_CLEAN] =
      Enum195.RGFCLEAN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FEM_KICKSN] =
      Enum195.RGFKICKSN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FEM_LOOK] = Enum195.RGFALOOK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FEM_WIPE] = Enum195.RGFWIPE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_OPEN_DOOR] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_OPEN_LOCKED_DOOR] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.KICK_DOOR] =
      Enum195.RGFKICKDOOR;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CLOSE_DOOR] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.RIFLE_STAND_HIT] =
      Enum195.RGFRHIT;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DEEP_WATER_TRED] =
      Enum195.RGFDEEPWATER_TRED;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DEEP_WATER_SWIM] =
      Enum195.RGFDEEPWATER_SWIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DEEP_WATER_HIT] =
      Enum195.RGFDEEPWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DEEP_WATER_DIE] =
      Enum195.RGFDEEPWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DEEP_WATER_DIE_STOPPING] =
      Enum195.RGFWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DEEP_WATER_DIE_STOP] =
      Enum195.RGFWATER_DIE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.LOW_TO_DEEP_WATER] =
      Enum195.RGFWATER_TRANS;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DEEP_TO_LOW_WATER] =
      Enum195.RGFWATER_TRANS;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GOTO_SLEEP] =
      Enum195.RGFSLEEP;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SLEEPING] = Enum195.RGFSLEEP;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.WKAEUP_FROM_SLEEP] =
      Enum195.RGFSLEEP;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FIRE_LOW_STAND] =
      Enum195.RGFSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FIRE_BURST_LOW_STAND] =
      Enum195.RGFSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.STANDING_SHOOT_UNJAM] =
      Enum195.RGFSTANDAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CROUCH_SHOOT_UNJAM] =
      Enum195.RGFCROUCHAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_SHOOT_UNJAM] =
      Enum195.RGFPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.STANDING_SHOOT_DWEL_UNJAM] =
      Enum195.RGFSTANDDWALAIM;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.STANDING_SHOOT_LOW_UNJAM] =
      Enum195.RGFSHOOT_LOW;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.READY_DUAL_CROUCH] =
      Enum195.RGFCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.AIM_DUAL_CROUCH] =
      Enum195.RGFCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SHOOT_DUAL_CROUCH] =
      Enum195.RGFCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_DUAL_CROUCH] =
      Enum195.RGFCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CROUCH_SHOOT_DWEL_UNJAM] =
      Enum195.RGFCDBLSHOT;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.ADJACENT_GET_ITEM] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CUTTING_FENCE] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FROM_INJURED_TRANSITION] =
      Enum195.RGFHURTTRANS;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.THROW_KNIFE] =
      Enum195.RGFTHROWKNIFE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.KNIFE_BREATH] =
      Enum195.RGFBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.KNIFE_GOTOBREATH] =
      Enum195.RGFBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.KNIFE_ENDBREATH] =
      Enum195.RGFBREATHKNIFE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CATCH_STANDING] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CATCH_CROUCHED] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PLANT_BOMB] =
      Enum195.RGFPICKUP;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.USE_REMOTE] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.START_COWER] =
      Enum195.RGFCOWER;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.COWERING] = Enum195.RGFCOWER;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_COWER] =
      Enum195.RGFCOWER;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.STEAL_ITEM] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SHOOT_ROCKET] =
      Enum195.RGFROCKET;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SHOOT_MORTAR] =
      Enum195.RGFMORTAR;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SIDE_STEP] =
      Enum195.RGFSIDESTEP;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.WALK_BACKWARDS] =
      Enum195.RGFWALKING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.BEGIN_OPENSTRUCT] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_OPENSTRUCT] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_OPENSTRUCT_LOCKED] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PUNCH_LOW] =
      Enum195.RGFPUNCHLOW;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PISTOL_SHOOT_LOW] =
      Enum195.RGFPISTOLSHOOTLOW;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DECAPITATE] =
      Enum195.RGFCSTAB;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GOTO_PATIENT] =
      Enum195.RGFHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.BEING_PATIENT] =
      Enum195.RGFHITPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GOTO_DOCTOR] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.BEING_DOCTOR] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_DOCTOR] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.GOTO_REPAIRMAN] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.BEING_REPAIRMAN] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_REPAIRMAN] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.FALL_INTO_PIT] =
      Enum195.RGFFALL;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.RELOAD_ROBOT] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_CATCH] = Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_CROUCH_CATCH] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.AI_RADIO] = Enum195.RGFRADIO;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.AI_CR_RADIO] =
      Enum195.RGFCRRADIO;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.QUEEN_SLAP] =
      Enum195.RGFSLAP;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.TAKE_BLOOD_FROM_CORPSE] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.QUEEN_FRUSTRATED_SLAP] =
      Enum195.RGFSLAP;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CHARIOTS_OF_FIRE] =
      Enum195.RGMBURN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.AI_PULL_SWITCH] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.MERC_HURT_IDLE_ANIM] =
      Enum195.RGFHURTSTANDINGR;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_HURT_WALKING] =
      Enum195.RGFHURTSTANDINGR;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PASS_OBJECT] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DROP_ADJACENT_OBJECT] =
      Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.READY_DUAL_PRONE] =
      Enum195.RGFDWPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.AIM_DUAL_PRONE] =
      Enum195.RGFDWPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SHOOT_DUAL_PRONE] =
      Enum195.RGFDWPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_DUAL_PRONE] =
      Enum195.RGFDWPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PRONE_SHOOT_DWEL_UNJAM] =
      Enum195.RGFDWPRONE;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.PICK_LOCK] = Enum195.RGFOPEN;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.OPEN_DOOR_CROUCHED] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.BEGIN_OPENSTRUCT_CROUCHED] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CLOSE_DOOR_CROUCHED] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.OPEN_STRUCT_CROUCHED] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_OPEN_DOOR_CROUCHED] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.END_OPENSTRUCT_CROUCHED] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][
      Enum193.END_OPEN_LOCKED_DOOR_CROUCHED
    ] = Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][
      Enum193.END_OPENSTRUCT_LOCKED_CROUCHED
    ] = Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.DRUNK_IDLE] =
      Enum195.RGFDRUNK;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.CROWBAR_ATTACK] =
      Enum195.RGFCROWBAR;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.ATTACH_CAN_TO_STRING] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.SWAT_BACKWARDS] =
      Enum195.RGFSNEAKING;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.JUMP_OVER_BLOCKING_PERSON] =
      Enum195.RGFJUMPOVER;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.REFUEL_VEHICLE] =
      Enum195.RGFMEDIC;
    gubAnimSurfaceIndex[Enum194.REGFEMALE][Enum193.LOCKPICK_CROUCHED] =
      Enum195.RGFMEDIC;

    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.STANDING] =
      Enum195.RGFPISTOLBREATH;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.WALKING] =
      Enum195.RGFNOTHING_WALK;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.RUNNING] =
      Enum195.RGFNOTHING_RUN;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.SWATTING] =
      Enum195.RGFNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.START_SWAT] =
      Enum195.RGFNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.END_SWAT] =
      Enum195.RGFNOTHING_SWAT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.KNEEL_DOWN] =
      Enum195.RGFNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.CROUCHING] =
      Enum195.RGFNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.KNEEL_UP] =
      Enum195.RGFNOTHING_CROUCH;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.READY_RIFLE_STAND] =
      Enum195.RGFHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.AIM_RIFLE_STAND] =
      Enum195.RGFHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.SHOOT_RIFLE_STAND] =
      Enum195.RGFHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.END_RIFLE_STAND] =
      Enum195.RGFHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.STANDING_BURST] =
      Enum195.RGFHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ] = Enum195.RGFHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.READY_RIFLE_CROUCH] =
      Enum195.RGFHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.AIM_RIFLE_CROUCH] =
      Enum195.RGFHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.SHOOT_RIFLE_CROUCH] =
      Enum195.RGFHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.END_RIFLE_CROUCH] =
      Enum195.RGFHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.PRONE_DOWN] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.CRAWLING] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.PRONE_UP] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.PRONE] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.READY_RIFLE_PRONE] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.AIM_RIFLE_PRONE] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.SHOOT_RIFLE_PRONE] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.END_RIFLE_PRONE] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.GETUP_FROM_ROLLOVER] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][
      Enum193.STANDING_SHOOT_UNJAM
    ] = Enum195.RGFHANDGUN_S_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.CROUCH_SHOOT_UNJAM] =
      Enum195.RGFHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.PRONE_SHOOT_UNJAM] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][
      Enum193.FIRE_BURST_LOW_STAND
    ] = Enum195.RGFPISTOLSHOOTLOW;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.FIRE_LOW_STAND] =
      Enum195.RGFPISTOLSHOOTLOW;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.CROUCHED_BURST] =
      Enum195.RGFHANDGUN_C_SHOT;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.PRONE_BURST] =
      Enum195.RGFHANDGUN_PRONE;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.MERC_HURT_IDLE_ANIM] =
      Enum195.RGFHURTSTANDINGN;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.END_HURT_WALKING] =
      Enum195.RGFHURTSTANDINGN;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.WALK_BACKWARDS] =
      Enum195.RGFNOTHING_WALK;
    gubAnimSurfaceItemSubIndex[Enum194.REGFEMALE][Enum193.DRUNK_IDLE] =
      Enum195.RGMPISTOLDRUNK;

    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][Enum193.STANDING][0] =
      Enum195.RGFWATER_R_STD;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][Enum193.WALKING][0] =
      Enum195.RGFWATER_R_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][Enum193.RUNNING][0] =
      Enum195.RGFWATER_R_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.READY_RIFLE_STAND
    ][0] = Enum195.RGFWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.AIM_RIFLE_STAND
    ][0] = Enum195.RGFWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.SHOOT_RIFLE_STAND
    ][0] = Enum195.RGFWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.END_RIFLE_STAND
    ][0] = Enum195.RGFWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.STANDING_BURST
    ][0] = Enum195.RGFWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ][0] = Enum195.RGFWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][Enum193.STANDING][1] =
      Enum195.RGFWATER_N_STD;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][Enum193.WALKING][1] =
      Enum195.RGFWATER_N_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][Enum193.RUNNING][1] =
      Enum195.RGFWATER_N_WALK;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.READY_RIFLE_STAND
    ][1] = Enum195.RGFWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.AIM_RIFLE_STAND
    ][1] = Enum195.RGFWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.SHOOT_RIFLE_STAND
    ][1] = Enum195.RGFWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.END_RIFLE_STAND
    ][1] = Enum195.RGFWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.STANDING_BURST
    ][1] = Enum195.RGFWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.FIRE_STAND_BURST_SPREAD
    ][1] = Enum195.RGFWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.READY_DUAL_STAND
    ][1] = Enum195.RGFWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.AIM_DUAL_STAND
    ][1] = Enum195.RGFWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.SHOOT_DUAL_STAND
    ][1] = Enum195.RGFWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.END_DUAL_STAND
    ][1] = Enum195.RGFWATER_DBLSHT;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.STANDING_SHOOT_UNJAM
    ][0] = Enum195.RGFWATER_R_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][
      Enum193.STANDING_SHOOT_UNJAM
    ][1] = Enum195.RGFWATER_N_AIM;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][Enum193.THROW_ITEM][0] =
      Enum195.RGFWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][Enum193.THROW_ITEM][1] =
      Enum195.RGFWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][Enum193.LOB_ITEM][0] =
      Enum195.RGFWATERTHROW;
    gubAnimSurfaceMidWaterSubIndex[Enum194.REGFEMALE][Enum193.LOB_ITEM][1] =
      Enum195.RGFWATERTHROW;

    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.GENERIC_HIT_DEATH] =
      Enum249.FMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.FALLBACK_HIT_DEATH] =
      Enum249.FMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.PRONE_HIT_DEATH] =
      Enum249.FMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.WATER_DIE] =
      Enum249.FMERC_WTR;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.FLYBACK_HIT_DEATH] =
      Enum249.FMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.JFK_HITDEATH] =
      Enum249.FMERC_JFK;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.FALLOFF_DEATH] =
      Enum249.FMERC_FALL;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.FALLOFF_FORWARD_DEATH] =
      Enum249.FMERC_FALLF;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.FLYBACK_HIT] =
      Enum249.FMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][
      Enum193.GENERIC_HIT_DEATHTWITCHNB
    ] = Enum249.FMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][
      Enum193.FALLFORWARD_FROMHIT_STAND
    ] = Enum249.FMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][
      Enum193.ENDFALLFORWARD_FROMHIT_CROUCH
    ] = Enum249.FMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.FALLBACK_HIT_STAND] =
      Enum249.FMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][
      Enum193.FALLBACK_HIT_DEATHTWITCHNB
    ] = Enum249.FMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.PRONE_HIT_DEATHTWITCHNB] =
      Enum249.FMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.PRONE_LAY_FROMHIT] =
      Enum249.FMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.FALLOFF] =
      Enum249.FMERC_FALLF;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.FALLFORWARD_ROOF] =
      Enum249.FMERC_FALL;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.FLYBACKHIT_STOP] =
      Enum249.FMERC_DHD;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.STAND_FALLFORWARD_STOP] =
      Enum249.FMERC_FWD;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.FALLBACKHIT_STOP] =
      Enum249.FMERC_BCK;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.PRONE_LAYFROMHIT_STOP] =
      Enum249.FMERC_PRN;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.CHARIOTS_OF_FIRE] =
      Enum249.BURNT_DEAD;
    gubAnimSurfaceCorpseID[Enum194.REGFEMALE][Enum193.BODYEXPLODING] =
      Enum249.EXPLODE_DEAD;

    // Setup some random stuff
    gRandomAnimDefs[Enum194.REGFEMALE][0].ubHandRestriction =
      RANDOM_ANIM_RIFLEINHAND;
    gRandomAnimDefs[Enum194.REGFEMALE][0].sAnimID = Enum193.FEM_CLEAN;
    gRandomAnimDefs[Enum194.REGFEMALE][0].ubStartRoll = 0;
    gRandomAnimDefs[Enum194.REGFEMALE][0].ubEndRoll = 3;
    gRandomAnimDefs[Enum194.REGFEMALE][0].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.REGFEMALE][0].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.REGFEMALE][1].ubHandRestriction =
      RANDOM_ANIM_NOTHINGINHAND;
    gRandomAnimDefs[Enum194.REGFEMALE][1].sAnimID = Enum193.FEM_KICKSN;
    gRandomAnimDefs[Enum194.REGFEMALE][1].ubStartRoll = 10;
    gRandomAnimDefs[Enum194.REGFEMALE][1].ubEndRoll = 13;
    gRandomAnimDefs[Enum194.REGFEMALE][1].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.REGFEMALE][1].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.REGFEMALE][2].ubHandRestriction =
      RANDOM_ANIM_RIFLEINHAND;
    gRandomAnimDefs[Enum194.REGFEMALE][2].sAnimID = Enum193.FEM_LOOK;
    gRandomAnimDefs[Enum194.REGFEMALE][2].ubStartRoll = 20;
    gRandomAnimDefs[Enum194.REGFEMALE][2].ubEndRoll = 23;
    gRandomAnimDefs[Enum194.REGFEMALE][2].ubFlags = 0;
    gRandomAnimDefs[Enum194.REGFEMALE][2].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.REGFEMALE][3].ubHandRestriction =
      RANDOM_ANIM_NOTHINGINHAND;
    gRandomAnimDefs[Enum194.REGFEMALE][3].sAnimID = Enum193.FEM_WIPE;
    gRandomAnimDefs[Enum194.REGFEMALE][3].ubStartRoll = 30;
    gRandomAnimDefs[Enum194.REGFEMALE][3].ubEndRoll = 33;
    gRandomAnimDefs[Enum194.REGFEMALE][3].ubFlags = 0;
    gRandomAnimDefs[Enum194.REGFEMALE][3].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.REGFEMALE][4].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.REGFEMALE][4].sAnimID = Enum193.MERC_HURT_IDLE_ANIM;
    gRandomAnimDefs[Enum194.REGFEMALE][4].ubStartRoll = 40;
    gRandomAnimDefs[Enum194.REGFEMALE][4].ubEndRoll = 100;
    gRandomAnimDefs[Enum194.REGFEMALE][4].ubFlags = RANDOM_ANIM_INJURED;
    gRandomAnimDefs[Enum194.REGFEMALE][4].ubAnimHeight = ANIM_STAND;

    ////////////////////////////////////////////////////
    // MONSTERS

    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][Enum193.STANDING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][Enum193.RUNNING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][Enum193.WALKING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.ADULTMONSTER_BREATHING
    ] = Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.ADULTMONSTER_WALKING
    ] = Enum195.AFMONSTERWALKING;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.ADULTMONSTER_ATTACKING
    ] = Enum195.AFMONSTERATTACK;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][Enum193.ADULTMONSTER_HIT] =
      Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.ADULTMONSTER_DYING
    ] = Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.ADULTMONSTER_DYING_STOP
    ] = Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.MONSTER_CLOSE_ATTACK
    ] = Enum195.AFMONSTERCLOSEATTACK;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.MONSTER_SPIT_ATTACK
    ] = Enum195.AFMONSTERSPITATTACK;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.MONSTER_BEGIN_EATTING_FLESH
    ] = Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.MONSTER_EATTING_FLESH
    ] = Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.MONSTER_END_EATTING_FLESH
    ] = Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][Enum193.MONSTER_UP] =
      Enum195.AFMUP;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][Enum193.MONSTER_JUMP] =
      Enum195.AFMJUMP;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][Enum193.MONSTER_MELT] =
      Enum195.AFMMELT;
    gubAnimSurfaceIndex[Enum194.ADULTFEMALEMONSTER][
      Enum193.MONSTER_WALK_BACKWARDS
    ] = Enum195.AFMONSTERWALKING;

    gubAnimSurfaceCorpseID[Enum194.ADULTFEMALEMONSTER][Enum193.MONSTER_MELT] =
      Enum249.ADULTMONSTER_DEAD;

    // Adult male
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.STANDING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.RUNNING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.WALKING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.ADULTMONSTER_BREATHING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.ADULTMONSTER_WALKING] =
      Enum195.AFMONSTERWALKING;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.ADULTMONSTER_ATTACKING] =
      Enum195.AFMONSTERATTACK;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.ADULTMONSTER_HIT] =
      Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.ADULTMONSTER_DYING] =
      Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.ADULTMONSTER_DYING_STOP] =
      Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.MONSTER_CLOSE_ATTACK] =
      Enum195.AFMONSTERCLOSEATTACK;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.MONSTER_SPIT_ATTACK] =
      Enum195.AFMONSTERSPITATTACK;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][
      Enum193.MONSTER_BEGIN_EATTING_FLESH
    ] = Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.MONSTER_EATTING_FLESH] =
      Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.MONSTER_END_EATTING_FLESH] =
      Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.MONSTER_UP] = Enum195.AFMUP;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.MONSTER_JUMP] =
      Enum195.AFMJUMP;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.MONSTER_MELT] =
      Enum195.AFMMELT;
    gubAnimSurfaceIndex[Enum194.AM_MONSTER][Enum193.MONSTER_WALK_BACKWARDS] =
      Enum195.AFMONSTERWALKING;

    gubAnimSurfaceCorpseID[Enum194.AM_MONSTER][Enum193.MONSTER_MELT] =
      Enum249.ADULTMONSTER_DEAD;

    // Young adult female
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.STANDING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.RUNNING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.WALKING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.ADULTMONSTER_BREATHING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.ADULTMONSTER_WALKING] =
      Enum195.AFMONSTERWALKING;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.ADULTMONSTER_ATTACKING] =
      Enum195.AFMONSTERATTACK;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.ADULTMONSTER_HIT] =
      Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.ADULTMONSTER_DYING] =
      Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.ADULTMONSTER_DYING_STOP] =
      Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.MONSTER_CLOSE_ATTACK] =
      Enum195.AFMONSTERCLOSEATTACK;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.MONSTER_SPIT_ATTACK] =
      Enum195.AFMONSTERSPITATTACK;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][
      Enum193.MONSTER_BEGIN_EATTING_FLESH
    ] = Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.MONSTER_EATTING_FLESH] =
      Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][
      Enum193.MONSTER_END_EATTING_FLESH
    ] = Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.MONSTER_UP] =
      Enum195.AFMUP;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.MONSTER_JUMP] =
      Enum195.AFMJUMP;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.MONSTER_MELT] =
      Enum195.AFMMELT;
    gubAnimSurfaceIndex[Enum194.YAF_MONSTER][Enum193.MONSTER_WALK_BACKWARDS] =
      Enum195.AFMONSTERWALKING;

    gubAnimSurfaceCorpseID[Enum194.YAF_MONSTER][Enum193.MONSTER_MELT] =
      Enum249.ADULTMONSTER_DEAD;

    // Young adult male
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.STANDING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.RUNNING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.WALKING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.ADULTMONSTER_BREATHING] =
      Enum195.AFMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.ADULTMONSTER_WALKING] =
      Enum195.AFMONSTERWALKING;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.ADULTMONSTER_ATTACKING] =
      Enum195.AFMONSTERATTACK;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.ADULTMONSTER_HIT] =
      Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.ADULTMONSTER_DYING] =
      Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.ADULTMONSTER_DYING_STOP] =
      Enum195.AFMONSTERDIE;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.MONSTER_CLOSE_ATTACK] =
      Enum195.AFMONSTERCLOSEATTACK;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.MONSTER_SPIT_ATTACK] =
      Enum195.AFMONSTERSPITATTACK;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][
      Enum193.MONSTER_BEGIN_EATTING_FLESH
    ] = Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.MONSTER_EATTING_FLESH] =
      Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][
      Enum193.MONSTER_END_EATTING_FLESH
    ] = Enum195.AFMONSTEREATING;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.MONSTER_UP] =
      Enum195.AFMUP;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.MONSTER_JUMP] =
      Enum195.AFMJUMP;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.MONSTER_MELT] =
      Enum195.AFMMELT;
    gubAnimSurfaceIndex[Enum194.YAM_MONSTER][Enum193.MONSTER_WALK_BACKWARDS] =
      Enum195.AFMONSTERWALKING;

    gubAnimSurfaceCorpseID[Enum194.YAM_MONSTER][Enum193.MONSTER_MELT] =
      Enum249.ADULTMONSTER_DEAD;

    gubAnimSurfaceIndex[Enum194.LARVAE_MONSTER][Enum193.LARVAE_BREATH] =
      Enum195.LVBREATH;
    gubAnimSurfaceIndex[Enum194.LARVAE_MONSTER][Enum193.LARVAE_HIT] =
      Enum195.LVDIE;
    gubAnimSurfaceIndex[Enum194.LARVAE_MONSTER][Enum193.LARVAE_DIE] =
      Enum195.LVDIE;
    gubAnimSurfaceIndex[Enum194.LARVAE_MONSTER][Enum193.LARVAE_DIE_STOP] =
      Enum195.LVDIE;
    gubAnimSurfaceIndex[Enum194.LARVAE_MONSTER][Enum193.LARVAE_WALK] =
      Enum195.LVWALK;

    gubAnimSurfaceCorpseID[Enum194.LARVAE_MONSTER][Enum193.LARVAE_DIE] =
      Enum249.LARVAEMONSTER_DEAD;

    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][Enum193.STANDING] =
      Enum195.IBREATH;
    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][Enum193.RUNNING] =
      Enum195.IWALK;
    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][Enum193.WALKING] =
      Enum195.IWALK;
    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][Enum193.INFANT_HIT] =
      Enum195.IDIE;
    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][Enum193.INFANT_DIE] =
      Enum195.IDIE;
    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][Enum193.INFANT_DIE_STOP] =
      Enum195.IDIE;
    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][Enum193.INFANT_ATTACK] =
      Enum195.IATTACK;
    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][
      Enum193.INFANT_BEGIN_EATTING_FLESH
    ] = Enum195.IEAT;
    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][Enum193.INFANT_EATTING_FLESH] =
      Enum195.IEAT;
    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][
      Enum193.INFANT_END_EATTING_FLESH
    ] = Enum195.IEAT;
    gubAnimSurfaceIndex[Enum194.INFANT_MONSTER][Enum193.WALK_BACKWARDS] =
      Enum195.IWALK;

    gubAnimSurfaceCorpseID[Enum194.INFANT_MONSTER][Enum193.INFANT_DIE] =
      Enum249.INFANTMONSTER_DEAD;

    gubAnimSurfaceIndex[Enum194.QUEENMONSTER][Enum193.QUEEN_MONSTER_BREATHING] =
      Enum195.QUEENMONSTERSTANDING;
    gubAnimSurfaceIndex[Enum194.QUEENMONSTER][Enum193.QUEEN_HIT] =
      Enum195.QUEENMONSTERDEATH;
    gubAnimSurfaceIndex[Enum194.QUEENMONSTER][Enum193.QUEEN_DIE] =
      Enum195.QUEENMONSTERDEATH;
    gubAnimSurfaceIndex[Enum194.QUEENMONSTER][Enum193.QUEEN_DIE_STOP] =
      Enum195.QUEENMONSTERDEATH;
    gubAnimSurfaceIndex[Enum194.QUEENMONSTER][Enum193.QUEEN_INTO_READY] =
      Enum195.QUEENMONSTERREADY;
    gubAnimSurfaceIndex[Enum194.QUEENMONSTER][Enum193.QUEEN_READY] =
      Enum195.QUEENMONSTERREADY;
    gubAnimSurfaceIndex[Enum194.QUEENMONSTER][Enum193.QUEEN_CALL] =
      Enum195.QUEENMONSTERREADY;
    gubAnimSurfaceIndex[Enum194.QUEENMONSTER][Enum193.QUEEN_END_READY] =
      Enum195.QUEENMONSTERREADY;
    gubAnimSurfaceIndex[Enum194.QUEENMONSTER][Enum193.QUEEN_SPIT] =
      Enum195.QUEENMONSTERSPIT_SW;
    gubAnimSurfaceIndex[Enum194.QUEENMONSTER][Enum193.QUEEN_SWIPE] =
      Enum195.QUEENMONSTERSWIPE;

    gubAnimSurfaceCorpseID[Enum194.QUEENMONSTER][Enum193.QUEEN_DIE] =
      Enum249.QUEEN_MONSTER_DEAD;

    //////
    // FAT GUY
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.STANDING] =
      Enum195.FATMANSTANDING;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.WALKING] =
      Enum195.FATMANWALKING;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.RUNNING] =
      Enum195.FATMANRUNNING;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.GENERIC_HIT_STAND] =
      Enum195.FATMANDIE;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum195.FATMANDIE;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.GENERIC_HIT_DEATHTWITCHB] =
      Enum195.FATMANDIE;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.FATMANDIE;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.FALLFORWARD_HITDEATH_STOP] =
      Enum195.FATMANDIE;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.STAND_FALLFORWARD_STOP] =
      Enum195.FATMANDIE;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.GENERIC_HIT_DEATH] =
      Enum195.FATMANDIE;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.FATCIV_ASS_SCRATCH] =
      Enum195.FATMANASS;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.OPEN_DOOR] = Enum195.FATMANACT;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.OPEN_STRUCT] =
      Enum195.FATMANACT;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.GIVE_ITEM] = Enum195.FATMANACT;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.END_OPEN_DOOR] =
      Enum195.FATMANACT;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.END_OPEN_LOCKED_DOOR] =
      Enum195.FATMANACT;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.CLOSE_DOOR] = Enum195.FATMANACT;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.ADJACENT_GET_ITEM] =
      Enum195.FATMANACT;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.START_COWER] =
      Enum195.FATMANCOWER;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.COWERING] = Enum195.FATMANCOWER;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.END_COWER] =
      Enum195.FATMANCOWER;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.CIV_DIE2] = Enum195.FATMANDIE2;
    gubAnimSurfaceIndex[Enum194.FATCIV][Enum193.CIV_COWER_HIT] =
      Enum195.FATMANCOWERHIT;

    gubAnimSurfaceCorpseID[Enum194.FATCIV][Enum193.GENERIC_HIT_DEATH] =
      Enum249.FT_DEAD1;
    gubAnimSurfaceCorpseID[Enum194.FATCIV][Enum193.CIV_DIE2] = Enum249.FT_DEAD2;

    gRandomAnimDefs[Enum194.FATCIV][0].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.FATCIV][0].sAnimID = Enum193.FATCIV_ASS_SCRATCH;
    gRandomAnimDefs[Enum194.FATCIV][0].ubStartRoll = 0;
    gRandomAnimDefs[Enum194.FATCIV][0].ubEndRoll = 10;
    gRandomAnimDefs[Enum194.FATCIV][0].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.FATCIV][0].ubAnimHeight = ANIM_STAND;

    // Common civ
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.STANDING] =
      Enum195.MANCIVSTANDING;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.WALKING] =
      Enum195.MANCIVWALKING;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.RUNNING] =
      Enum195.MANCIVRUNNING;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.GENERIC_HIT_STAND] =
      Enum195.MANCIVDIE;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum195.MANCIVDIE;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.GENERIC_HIT_DEATHTWITCHB] =
      Enum195.MANCIVDIE;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.MANCIVDIE;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.FALLFORWARD_HITDEATH_STOP] =
      Enum195.MANCIVDIE;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.STAND_FALLFORWARD_STOP] =
      Enum195.MANCIVDIE;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.GENERIC_HIT_DEATH] =
      Enum195.MANCIVDIE;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.OPEN_DOOR] = Enum195.MANCIVACT;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.OPEN_STRUCT] =
      Enum195.MANCIVACT;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.GIVE_ITEM] = Enum195.MANCIVACT;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.END_OPEN_DOOR] =
      Enum195.MANCIVACT;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.END_OPEN_LOCKED_DOOR] =
      Enum195.MANCIVACT;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.CLOSE_DOOR] = Enum195.MANCIVACT;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.ADJACENT_GET_ITEM] =
      Enum195.MANCIVACT;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.START_COWER] =
      Enum195.MANCIVCOWER;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.COWERING] = Enum195.MANCIVCOWER;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.END_COWER] =
      Enum195.MANCIVCOWER;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.CIV_DIE2] = Enum195.MANCIVDIE2;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.SLAP_HIT] =
      Enum195.MANCIVSMACKED;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.PUNCH] = Enum195.MANCIVPUNCH;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.PUNCH_BREATH] =
      Enum195.MANCIVPUNCH;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.BEGIN_OPENSTRUCT] =
      Enum195.MANCIVACT;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.END_OPENSTRUCT] =
      Enum195.MANCIVACT;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.END_OPENSTRUCT_LOCKED] =
      Enum195.MANCIVACT;
    gubAnimSurfaceIndex[Enum194.MANCIV][Enum193.CIV_COWER_HIT] =
      Enum195.MANCIVCOWERHIT;

    gubAnimSurfaceCorpseID[Enum194.MANCIV][Enum193.GENERIC_HIT_DEATH] =
      Enum249.M_DEAD1;
    gubAnimSurfaceCorpseID[Enum194.MANCIV][Enum193.CIV_DIE2] = Enum249.M_DEAD2;

    // mini skirt civ
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.STANDING] =
      Enum195.MINICIVSTANDING;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.WALKING] =
      Enum195.MINICIVWALKING;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.RUNNING] =
      Enum195.MINICIVRUNNING;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.GENERIC_HIT_STAND] =
      Enum195.MINICIVDIE;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum195.MINICIVDIE;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.GENERIC_HIT_DEATHTWITCHB] =
      Enum195.MINICIVDIE;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.MINICIVDIE;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.FALLFORWARD_HITDEATH_STOP] =
      Enum195.MINICIVDIE;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.STAND_FALLFORWARD_STOP] =
      Enum195.MINICIVDIE;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.GENERIC_HIT_DEATH] =
      Enum195.MINICIVDIE;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.MINIGIRL_STOCKING] =
      Enum195.MINISTOCKING;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.OPEN_DOOR] = Enum195.MINIACT;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.OPEN_STRUCT] = Enum195.MINIACT;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.GIVE_ITEM] = Enum195.MINIACT;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.END_OPEN_DOOR] =
      Enum195.MINIACT;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.END_OPEN_LOCKED_DOOR] =
      Enum195.MINIACT;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.CLOSE_DOOR] = Enum195.MINIACT;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.ADJACENT_GET_ITEM] =
      Enum195.MINIACT;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.START_COWER] =
      Enum195.MINICOWER;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.COWERING] = Enum195.MINICOWER;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.END_COWER] = Enum195.MINICOWER;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.CIV_DIE2] = Enum195.MINIDIE2;
    gubAnimSurfaceIndex[Enum194.MINICIV][Enum193.CIV_COWER_HIT] =
      Enum195.MINICOWERHIT;

    gubAnimSurfaceCorpseID[Enum194.MINICIV][Enum193.GENERIC_HIT_DEATH] =
      Enum249.S_DEAD1;
    gubAnimSurfaceCorpseID[Enum194.MINICIV][Enum193.CIV_DIE2] = Enum249.S_DEAD2;

    gRandomAnimDefs[Enum194.MINICIV][0].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.MINICIV][0].sAnimID = Enum193.MINIGIRL_STOCKING;
    gRandomAnimDefs[Enum194.MINICIV][0].ubStartRoll = 0;
    gRandomAnimDefs[Enum194.MINICIV][0].ubEndRoll = 10;
    gRandomAnimDefs[Enum194.MINICIV][0].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.MINICIV][0].ubAnimHeight = ANIM_STAND;

    // dress skirt civ
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.STANDING] =
      Enum195.DRESSCIVSTANDING;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.WALKING] =
      Enum195.DRESSCIVWALKING;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.RUNNING] =
      Enum195.DRESSCIVRUNNING;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.GENERIC_HIT_STAND] =
      Enum195.DRESSCIVDIE;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum195.DRESSCIVDIE;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.GENERIC_HIT_DEATHTWITCHB] =
      Enum195.DRESSCIVDIE;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.DRESSCIVDIE;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.FALLFORWARD_HITDEATH_STOP] =
      Enum195.DRESSCIVDIE;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.STAND_FALLFORWARD_STOP] =
      Enum195.DRESSCIVDIE;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.GENERIC_HIT_DEATH] =
      Enum195.DRESSCIVDIE;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.OPEN_DOOR] =
      Enum195.DRESSCIVACT;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.OPEN_STRUCT] =
      Enum195.DRESSCIVACT;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.GIVE_ITEM] =
      Enum195.DRESSCIVACT;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.END_OPEN_DOOR] =
      Enum195.DRESSCIVACT;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.END_OPEN_LOCKED_DOOR] =
      Enum195.DRESSCIVACT;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.CLOSE_DOOR] =
      Enum195.DRESSCIVACT;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.ADJACENT_GET_ITEM] =
      Enum195.DRESSCIVACT;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.START_COWER] =
      Enum195.DRESSCIVCOWER;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.COWERING] =
      Enum195.DRESSCIVCOWER;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.END_COWER] =
      Enum195.DRESSCIVCOWER;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.CIV_DIE2] =
      Enum195.DRESSCIVDIE2;
    gubAnimSurfaceIndex[Enum194.DRESSCIV][Enum193.CIV_COWER_HIT] =
      Enum195.DRESSCIVCOWERHIT;

    gubAnimSurfaceCorpseID[Enum194.DRESSCIV][Enum193.GENERIC_HIT_DEATH] =
      Enum249.W_DEAD1;
    gubAnimSurfaceCorpseID[Enum194.DRESSCIV][Enum193.CIV_DIE2] =
      Enum249.W_DEAD2;

    // HATKID civ
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.STANDING] =
      Enum195.HATKIDCIVSTANDING;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.WALKING] =
      Enum195.HATKIDCIVWALKING;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.RUNNING] =
      Enum195.HATKIDCIVRUNNING;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.GENERIC_HIT_STAND] =
      Enum195.HATKIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum195.HATKIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.GENERIC_HIT_DEATHTWITCHB] =
      Enum195.HATKIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.HATKIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.FALLFORWARD_HITDEATH_STOP] =
      Enum195.HATKIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.STAND_FALLFORWARD_STOP] =
      Enum195.HATKIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.GENERIC_HIT_DEATH] =
      Enum195.HATKIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.JFK_HITDEATH] =
      Enum195.HATKIDCIVJFK;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.JFK_HITDEATH_STOP] =
      Enum195.HATKIDCIVJFK;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.JFK_HITDEATH_TWITCHB] =
      Enum195.HATKIDCIVJFK;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.HATKID_YOYO] =
      Enum195.HATKIDCIVYOYO;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.OPEN_DOOR] =
      Enum195.HATKIDCIVACT;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.OPEN_STRUCT] =
      Enum195.HATKIDCIVACT;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.GIVE_ITEM] =
      Enum195.HATKIDCIVACT;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.END_OPEN_DOOR] =
      Enum195.HATKIDCIVACT;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.END_OPEN_LOCKED_DOOR] =
      Enum195.HATKIDCIVACT;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.CLOSE_DOOR] =
      Enum195.HATKIDCIVACT;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.ADJACENT_GET_ITEM] =
      Enum195.HATKIDCIVACT;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.START_COWER] =
      Enum195.HATKIDCIVCOWER;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.COWERING] =
      Enum195.HATKIDCIVCOWER;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.END_COWER] =
      Enum195.HATKIDCIVCOWER;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.CIV_DIE2] =
      Enum195.HATKIDCIVDIE2;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.CIV_COWER_HIT] =
      Enum195.HATKIDCIVCOWERHIT;
    gubAnimSurfaceIndex[Enum194.HATKIDCIV][Enum193.KID_SKIPPING] =
      Enum195.HATKIDCIVSKIP;

    gubAnimSurfaceCorpseID[Enum194.HATKIDCIV][Enum193.GENERIC_HIT_DEATH] =
      Enum249.H_DEAD1;
    gubAnimSurfaceCorpseID[Enum194.HATKIDCIV][Enum193.CIV_DIE2] =
      Enum249.H_DEAD2;

    gRandomAnimDefs[Enum194.HATKIDCIV][0].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.HATKIDCIV][0].sAnimID = Enum193.HATKID_YOYO;
    gRandomAnimDefs[Enum194.HATKIDCIV][0].ubStartRoll = 0;
    gRandomAnimDefs[Enum194.HATKIDCIV][0].ubEndRoll = 10;
    gRandomAnimDefs[Enum194.HATKIDCIV][0].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.HATKIDCIV][0].ubAnimHeight = ANIM_STAND;

    // KID civ
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.STANDING] =
      Enum195.KIDCIVSTANDING;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.WALKING] =
      Enum195.KIDCIVWALKING;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.RUNNING] =
      Enum195.KIDCIVRUNNING;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.GENERIC_HIT_STAND] =
      Enum195.KIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.GENERIC_HIT_DEATHTWITCHNB] =
      Enum195.KIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.GENERIC_HIT_DEATHTWITCHB] =
      Enum195.KIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.FALLFORWARD_FROMHIT_STAND] =
      Enum195.KIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.FALLFORWARD_HITDEATH_STOP] =
      Enum195.KIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.STAND_FALLFORWARD_STOP] =
      Enum195.KIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.GENERIC_HIT_DEATH] =
      Enum195.KIDCIVDIE;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.JFK_HITDEATH] =
      Enum195.KIDCIVJFK;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.JFK_HITDEATH_STOP] =
      Enum195.KIDCIVJFK;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.JFK_HITDEATH_TWITCHB] =
      Enum195.KIDCIVJFK;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.KID_ARMPIT] =
      Enum195.KIDCIVARMPIT;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.OPEN_DOOR] = Enum195.KIDCIVACT;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.OPEN_STRUCT] =
      Enum195.KIDCIVACT;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.GIVE_ITEM] = Enum195.KIDCIVACT;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.END_OPEN_DOOR] =
      Enum195.KIDCIVACT;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.END_OPEN_LOCKED_DOOR] =
      Enum195.KIDCIVACT;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.CLOSE_DOOR] = Enum195.KIDCIVACT;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.ADJACENT_GET_ITEM] =
      Enum195.KIDCIVACT;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.START_COWER] =
      Enum195.KIDCIVCOWER;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.COWERING] = Enum195.KIDCIVCOWER;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.END_COWER] =
      Enum195.KIDCIVCOWER;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.CIV_DIE2] = Enum195.KIDCIVDIE2;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.CIV_COWER_HIT] =
      Enum195.KIDCIVCOWERHIT;
    gubAnimSurfaceIndex[Enum194.KIDCIV][Enum193.KID_SKIPPING] =
      Enum195.KIDCIVSKIP;

    gubAnimSurfaceCorpseID[Enum194.KIDCIV][Enum193.GENERIC_HIT_DEATH] =
      Enum249.K_DEAD1;
    gubAnimSurfaceCorpseID[Enum194.KIDCIV][Enum193.CIV_DIE2] = Enum249.K_DEAD2;

    gRandomAnimDefs[Enum194.KIDCIV][0].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.KIDCIV][0].sAnimID = Enum193.KID_ARMPIT;
    gRandomAnimDefs[Enum194.KIDCIV][0].ubStartRoll = 0;
    gRandomAnimDefs[Enum194.KIDCIV][0].ubEndRoll = 10;
    gRandomAnimDefs[Enum194.KIDCIV][0].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.KIDCIV][0].ubAnimHeight = ANIM_STAND;

    // CRIPPLE
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.STANDING] =
      Enum195.CRIPCIVSTANDING;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.WALKING] =
      Enum195.CRIPCIVWALKING;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.RUNNING] =
      Enum195.CRIPCIVRUNNING;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.CRIPPLE_BEG] =
      Enum195.CRIPCIVBEG;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.CRIPPLE_HIT] =
      Enum195.CRIPCIVDIE;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.CRIPPLE_DIE] =
      Enum195.CRIPCIVDIE;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.CRIPPLE_DIE_STOP] =
      Enum195.CRIPCIVDIE;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.CRIPPLE_DIE_FLYBACK] =
      Enum195.CRIPCIVDIE2;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.CRIPPLE_DIE_FLYBACK_STOP] =
      Enum195.CRIPCIVDIE2;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.CRIPPLE_KICKOUT] =
      Enum195.CRIPCIVKICK;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.CRIPPLE_OPEN_DOOR] =
      Enum195.CRIPCIVBEG;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.CRIPPLE_CLOSE_DOOR] =
      Enum195.CRIPCIVBEG;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][Enum193.CRIPPLE_END_OPEN_DOOR] =
      Enum195.CRIPCIVBEG;
    gubAnimSurfaceIndex[Enum194.CRIPPLECIV][
      Enum193.CRIPPLE_END_OPEN_LOCKED_DOOR
    ] = Enum195.CRIPCIVBEG;

    gubAnimSurfaceCorpseID[Enum194.CRIPPLECIV][Enum193.CRIPPLE_DIE] =
      Enum249.SMERC_BCK;

    gRandomAnimDefs[Enum194.CRIPPLECIV][0].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.CRIPPLECIV][0].sAnimID = Enum193.CRIPPLE_BEG;
    gRandomAnimDefs[Enum194.CRIPPLECIV][0].ubStartRoll = 30;
    gRandomAnimDefs[Enum194.CRIPPLECIV][0].ubEndRoll = 70;
    gRandomAnimDefs[Enum194.CRIPPLECIV][0].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.CRIPPLECIV][0].ubAnimHeight = ANIM_STAND;

    // COW
    gubAnimSurfaceIndex[Enum194.COW][Enum193.STANDING] = Enum195.COWSTANDING;
    gubAnimSurfaceIndex[Enum194.COW][Enum193.WALKING] = Enum195.COWWALKING;
    gubAnimSurfaceIndex[Enum194.COW][Enum193.COW_EATING] = Enum195.COWEAT;
    gubAnimSurfaceIndex[Enum194.COW][Enum193.COW_HIT] = Enum195.COWDIE;
    gubAnimSurfaceIndex[Enum194.COW][Enum193.COW_DYING] = Enum195.COWDIE;
    gubAnimSurfaceIndex[Enum194.COW][Enum193.COW_DYING_STOP] = Enum195.COWDIE;

    gubAnimSurfaceCorpseID[Enum194.COW][Enum193.COW_DYING] = Enum249.COW_DEAD;

    gRandomAnimDefs[Enum194.COW][0].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.COW][0].sAnimID = Enum193.COW_EATING;
    gRandomAnimDefs[Enum194.COW][0].ubStartRoll = 30;
    gRandomAnimDefs[Enum194.COW][0].ubEndRoll = 100;
    gRandomAnimDefs[Enum194.COW][0].ubFlags = RANDOM_ANIM_CASUAL;
    gRandomAnimDefs[Enum194.COW][0].ubAnimHeight = ANIM_STAND;

    gRandomAnimDefs[Enum194.COW][1].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.COW][1].sAnimID = RANDOM_ANIM_SOUND;
    gRandomAnimDefs[Enum194.COW][1].ubStartRoll = 0;
    gRandomAnimDefs[Enum194.COW][1].ubEndRoll = 1;
    gRandomAnimDefs[Enum194.COW][1].ubAnimHeight = ANIM_STAND;
    gRandomAnimDefs[Enum194.COW][1].zSoundFile = "SOUNDS\\COWMOO1.WAV";

    gRandomAnimDefs[Enum194.COW][2].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.COW][2].sAnimID = RANDOM_ANIM_SOUND;
    gRandomAnimDefs[Enum194.COW][2].ubStartRoll = 2;
    gRandomAnimDefs[Enum194.COW][2].ubEndRoll = 3;
    gRandomAnimDefs[Enum194.COW][2].ubAnimHeight = ANIM_STAND;
    gRandomAnimDefs[Enum194.COW][2].zSoundFile = "SOUNDS\\COWMOO2.WAV";

    gRandomAnimDefs[Enum194.COW][3].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.COW][3].sAnimID = RANDOM_ANIM_SOUND;
    gRandomAnimDefs[Enum194.COW][3].ubStartRoll = 4;
    gRandomAnimDefs[Enum194.COW][3].ubEndRoll = 5;
    gRandomAnimDefs[Enum194.COW][3].ubAnimHeight = ANIM_STAND;
    gRandomAnimDefs[Enum194.COW][3].zSoundFile = "SOUNDS\\COWMOO3.WAV";

    gubAnimSurfaceIndex[Enum194.CROW][Enum193.STANDING] = Enum195.CROWWALKING;
    gubAnimSurfaceIndex[Enum194.CROW][Enum193.WALKING] = Enum195.CROWWALKING;
    gubAnimSurfaceIndex[Enum194.CROW][Enum193.CROW_WALK] = Enum195.CROWWALKING;
    gubAnimSurfaceIndex[Enum194.CROW][Enum193.CROW_FLY] = Enum195.CROWFLYING;
    gubAnimSurfaceIndex[Enum194.CROW][Enum193.CROW_EAT] = Enum195.CROWEATING;
    gubAnimSurfaceIndex[Enum194.CROW][Enum193.CROW_TAKEOFF] =
      Enum195.CROWFLYING;
    gubAnimSurfaceIndex[Enum194.CROW][Enum193.CROW_LAND] = Enum195.CROWFLYING;
    gubAnimSurfaceIndex[Enum194.CROW][Enum193.CROW_DIE] = Enum195.CROWDYING;

    gRandomAnimDefs[Enum194.CROW][0].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.CROW][0].sAnimID = RANDOM_ANIM_SOUND;
    gRandomAnimDefs[Enum194.CROW][0].ubStartRoll = 0;
    gRandomAnimDefs[Enum194.CROW][0].ubEndRoll = 50;
    gRandomAnimDefs[Enum194.CROW][0].ubAnimHeight = ANIM_STAND;
    gRandomAnimDefs[Enum194.CROW][0].zSoundFile = "SOUNDS\\CROW3.WAV";

    gRandomAnimDefs[Enum194.CROW][1].ubHandRestriction =
      RANDOM_ANIM_IRRELEVENTINHAND;
    gRandomAnimDefs[Enum194.CROW][1].sAnimID = RANDOM_ANIM_SOUND;
    gRandomAnimDefs[Enum194.CROW][1].ubStartRoll = 51;
    gRandomAnimDefs[Enum194.CROW][1].ubEndRoll = 70;
    gRandomAnimDefs[Enum194.CROW][1].ubAnimHeight = ANIM_STAND;
    gRandomAnimDefs[Enum194.CROW][1].zSoundFile = "SOUNDS\\CROW2.WAV";

    // BLOOD CAT
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.STANDING] = Enum195.CATBREATH;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.WALKING] = Enum195.CATWALK;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.BLOODCAT_RUN] =
      Enum195.CATRUN;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.BLOODCAT_STARTREADY] =
      Enum195.CATREADY;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.BLOODCAT_READY] =
      Enum195.CATREADY;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.BLOODCAT_ENDREADY] =
      Enum195.CATREADY;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.BLOODCAT_HIT] =
      Enum195.CATHIT;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.BLOODCAT_DYING] =
      Enum195.CATDIE;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.BLOODCAT_DYING_STOP] =
      Enum195.CATDIE;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.BLOODCAT_SWIPE] =
      Enum195.CATSWIPE;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.BLOODCAT_BITE_ANIM] =
      Enum195.CATBITE;
    gubAnimSurfaceIndex[Enum194.BLOODCAT][Enum193.BLOODCAT_WALK_BACKWARDS] =
      Enum195.CATWALK;

    gubAnimSurfaceCorpseID[Enum194.BLOODCAT][Enum193.BLOODCAT_DYING] =
      Enum249.BLOODCAT_DEAD;

    // ROBOT
    gubAnimSurfaceIndex[Enum194.ROBOTNOWEAPON][Enum193.STANDING] =
      Enum195.ROBOTNWBREATH;
    gubAnimSurfaceIndex[Enum194.ROBOTNOWEAPON][Enum193.WALKING] =
      Enum195.ROBOTNWBREATH;
    gubAnimSurfaceIndex[Enum194.ROBOTNOWEAPON][Enum193.ROBOTNW_HIT] =
      Enum195.ROBOTNWHIT;
    gubAnimSurfaceIndex[Enum194.ROBOTNOWEAPON][Enum193.ROBOTNW_DIE] =
      Enum195.ROBOTNWDIE;
    gubAnimSurfaceIndex[Enum194.ROBOTNOWEAPON][Enum193.ROBOTNW_DIE_STOP] =
      Enum195.ROBOTNWDIE;
    gubAnimSurfaceIndex[Enum194.ROBOTNOWEAPON][Enum193.ROBOT_WALK] =
      Enum195.ROBOTNWWALK;
    gubAnimSurfaceIndex[Enum194.ROBOTNOWEAPON][Enum193.ROBOT_SHOOT] =
      Enum195.ROBOTNWSHOOT;
    gubAnimSurfaceIndex[Enum194.ROBOTNOWEAPON][Enum193.ROBOT_BURST_SHOOT] =
      Enum195.ROBOTNWSHOOT;
    gubAnimSurfaceIndex[Enum194.ROBOTNOWEAPON][
      Enum193.ROBOT_CAMERA_NOT_MOVING
    ] = Enum195.ROBOTNWBREATH;
    gubAnimSurfaceCorpseID[Enum194.ROBOTNOWEAPON][Enum193.ROBOTNW_DIE] =
      Enum249.ROBOT_DEAD;

    // HUMVEE
    gubAnimSurfaceIndex[Enum194.HUMVEE][Enum193.STANDING] =
      Enum195.HUMVEE_BASIC;
    gubAnimSurfaceIndex[Enum194.HUMVEE][Enum193.WALKING] = Enum195.HUMVEE_BASIC;
    gubAnimSurfaceIndex[Enum194.HUMVEE][Enum193.VEHICLE_DIE] =
      Enum195.HUMVEE_DIE;
    gubAnimSurfaceCorpseID[Enum194.HUMVEE][Enum193.STANDING] =
      Enum249.HUMMER_DEAD;

    // TANK
    gubAnimSurfaceIndex[Enum194.TANK_NW][Enum193.STANDING] =
      Enum195.TANKNW_READY;
    gubAnimSurfaceIndex[Enum194.TANK_NW][Enum193.WALKING] =
      Enum195.TANKNW_READY;
    gubAnimSurfaceIndex[Enum194.TANK_NW][Enum193.TANK_SHOOT] =
      Enum195.TANKNW_SHOOT;
    gubAnimSurfaceIndex[Enum194.TANK_NW][Enum193.TANK_BURST] =
      Enum195.TANKNW_SHOOT;
    gubAnimSurfaceIndex[Enum194.TANK_NW][Enum193.VEHICLE_DIE] =
      Enum195.TANKNW_DIE;
    gubAnimSurfaceCorpseID[Enum194.TANK_NW][Enum193.STANDING] =
      Enum249.TANK1_DEAD;

    // TANK
    gubAnimSurfaceIndex[Enum194.TANK_NE][Enum193.STANDING] =
      Enum195.TANKNE_READY;
    gubAnimSurfaceIndex[Enum194.TANK_NE][Enum193.WALKING] =
      Enum195.TANKNE_READY;
    gubAnimSurfaceIndex[Enum194.TANK_NE][Enum193.TANK_SHOOT] =
      Enum195.TANKNE_SHOOT;
    gubAnimSurfaceIndex[Enum194.TANK_NE][Enum193.TANK_BURST] =
      Enum195.TANKNE_SHOOT;
    gubAnimSurfaceIndex[Enum194.TANK_NE][Enum193.VEHICLE_DIE] =
      Enum195.TANKNE_DIE;
    gubAnimSurfaceCorpseID[Enum194.TANK_NE][Enum193.STANDING] =
      Enum249.TANK2_DEAD;

    // ELDORADO
    gubAnimSurfaceIndex[Enum194.ELDORADO][Enum193.STANDING] =
      Enum195.HUMVEE_BASIC;
    gubAnimSurfaceIndex[Enum194.ELDORADO][Enum193.WALKING] =
      Enum195.HUMVEE_BASIC;
    gubAnimSurfaceIndex[Enum194.ELDORADO][Enum193.VEHICLE_DIE] =
      Enum195.HUMVEE_DIE;

    // ICECREAMTRUCK
    gubAnimSurfaceIndex[Enum194.ICECREAMTRUCK][Enum193.STANDING] =
      Enum195.ICECREAMTRUCK_BASIC;
    gubAnimSurfaceIndex[Enum194.ICECREAMTRUCK][Enum193.WALKING] =
      Enum195.ICECREAMTRUCK_BASIC;
    gubAnimSurfaceIndex[Enum194.ICECREAMTRUCK][Enum193.VEHICLE_DIE] =
      Enum195.HUMVEE_DIE;
    gubAnimSurfaceCorpseID[Enum194.ICECREAMTRUCK][Enum193.STANDING] =
      Enum249.ICECREAM_DEAD;

    // JEEP
    gubAnimSurfaceIndex[Enum194.JEEP][Enum193.STANDING] = Enum195.HUMVEE_BASIC;
    gubAnimSurfaceIndex[Enum194.JEEP][Enum193.WALKING] = Enum195.HUMVEE_BASIC;
    gubAnimSurfaceIndex[Enum194.JEEP][Enum193.VEHICLE_DIE] = Enum195.HUMVEE_DIE;
  }

  export function LoadAnimationStateInstructions(): boolean {
    let hFile: HWFILE;
    let uiBytesRead: UINT32;
    let buffer: Buffer;

    // Open ani file
    hFile = FileOpen(ANIMFILENAME, FILE_ACCESS_READ, false);

    if (!hFile) {
      return false;
    }

    // Read in block
    buffer = Buffer.allocUnsafe(MAX_ANIMATIONS * MAX_FRAMES_PER_ANIM * 2);
    if ((uiBytesRead = FileRead(hFile, buffer, buffer.length)) === -1) {
      return false;
    }

    for (let i = 0, offset = 0; i < MAX_ANIMATIONS; i++) {
      offset = readUIntArray(gusAnimInst[i], buffer, offset, 2);
    }

    FileClose(hFile);

    return true;
  }

  export function IsAnimationValidForBodyType(
    pSoldier: SOLDIERTYPE,
    usNewState: UINT16,
  ): boolean {
    let usAnimSurface: UINT16;

    // From animation control, get surface

    // First Save value
    usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usNewState);

    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
      return false;
    }

    return true;
  }

  export function SubstituteBodyTypeAnimation(
    pSoldier: SOLDIERTYPE,
    usTestState: UINT16,
    pusSubState: Pointer<UINT16>,
  ): boolean {
    let fSubFound: boolean = false;

    pusSubState.value = usTestState;

    if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
      switch (usTestState) {
        case Enum193.STANDING:
        case Enum193.WALKING:
        case Enum193.RUNNING:
          pusSubState.value = Enum193.QUEEN_MONSTER_BREATHING;
          fSubFound = true;
          break;
      }
    }

    if (pSoldier.ubBodyType == Enum194.LARVAE_MONSTER) {
      switch (usTestState) {
        case Enum193.STANDING:
          pusSubState.value = Enum193.LARVAE_BREATH;
          fSubFound = true;
          break;

        case Enum193.WALKING:
        case Enum193.RUNNING:
          pusSubState.value = Enum193.LARVAE_WALK;
          fSubFound = true;
          break;
      }
    }

    if (pSoldier.ubBodyType == Enum194.CROW) {
      switch (usTestState) {
        case Enum193.WALKING:
          pusSubState.value = Enum193.CROW_WALK;
          fSubFound = true;
          break;

        case Enum193.STANDING:
          pusSubState.value = Enum193.CROW_EAT;
          fSubFound = true;
          break;
      }
    }

    if (pSoldier.ubBodyType == Enum194.BLOODCAT) {
      switch (usTestState) {
        case Enum193.RUNNING:
          pusSubState.value = Enum193.BLOODCAT_RUN;
          fSubFound = true;
          break;
      }
    }

    if (
      pSoldier.ubBodyType == Enum194.ADULTFEMALEMONSTER ||
      pSoldier.ubBodyType == Enum194.AM_MONSTER ||
      pSoldier.ubBodyType == Enum194.YAF_MONSTER ||
      pSoldier.ubBodyType == Enum194.YAM_MONSTER
    ) {
      switch (usTestState) {
        case Enum193.WALKING:
          pusSubState.value = Enum193.ADULTMONSTER_WALKING;
          fSubFound = true;
          break;

        case Enum193.RUNNING:
          pusSubState.value = Enum193.ADULTMONSTER_WALKING;
          fSubFound = true;
          break;
      }
    }

    if (pSoldier.ubBodyType == Enum194.ROBOTNOWEAPON) {
      switch (usTestState) {
        case Enum193.STANDING:
          // OK, if they are on the CIV_TEAM, sub for no camera moving
          if (pSoldier.bTeam == CIV_TEAM) {
            pusSubState.value = Enum193.ROBOT_CAMERA_NOT_MOVING;
            fSubFound = true;
          }
          break;

        case Enum193.WALKING:
          pusSubState.value = Enum193.ROBOT_WALK;
          fSubFound = true;
          break;

        case Enum193.RUNNING:
          pusSubState.value = Enum193.ROBOT_WALK;
          fSubFound = true;
          break;
      }
    }

    if (IS_CIV_BODY_TYPE(pSoldier)) {
      switch (usTestState) {
        case Enum193.KNEEL_UP:
          pusSubState.value = Enum193.END_COWER;
          fSubFound = true;
          break;
        case Enum193.KNEEL_DOWN:
          pusSubState.value = Enum193.START_COWER;
          fSubFound = true;
          break;

        case Enum193.WKAEUP_FROM_SLEEP:
        case Enum193.GOTO_SLEEP:
        case Enum193.SLEEPING:
          pusSubState.value = Enum193.STANDING;
          fSubFound = true;
          break;
      }
    }

    return fSubFound;
  }

  export function GetBodyTypePaletteSubstitutionCode(
    pSoldier: SOLDIERTYPE | null,
    ubBodyType: UINT8,
    zColFilename: Pointer<string> /* Pointer<CHAR8> */,
  ): INT8 {
    switch (ubBodyType) {
      case Enum194.REGMALE:
      case Enum194.BIGMALE:
      case Enum194.STOCKYMALE:
      case Enum194.REGFEMALE:
        if (pSoldier != null) {
          // Are we on fire?
          if (
            pSoldier.usAnimState == Enum193.CHARIOTS_OF_FIRE ||
            pSoldier.usAnimState == Enum193.BODYEXPLODING
          ) {
            return 0;
          }

          // Check for cammo...
          if (pSoldier.bCamo != 0) {
            zColFilename.value = "ANIMS\\camo.COL";
            return 1;
          }
        }
        return -1;

      case Enum194.YAF_MONSTER:
        zColFilename.value = "ANIMS\\MONSTERS\\fm_brite.COL";
        return 1;

      case Enum194.YAM_MONSTER:
        zColFilename.value = "ANIMS\\MONSTERS\\mn_brite.COL";
        return 1;

      case Enum194.ADULTFEMALEMONSTER:
        zColFilename.value = "ANIMS\\MONSTERS\\femmon.COL";
        return 1;

      case Enum194.AM_MONSTER:
        zColFilename.value = "ANIMS\\MONSTERS\\monster.COL";
        return 1;

      case Enum194.QUEENMONSTER:
      case Enum194.COW:
      case Enum194.CROW:
      case Enum194.BLOODCAT:
      case Enum194.HUMVEE:
      case Enum194.ELDORADO:
      case Enum194.ICECREAMTRUCK:
      case Enum194.JEEP:
      case Enum194.ROBOTNOWEAPON:
      case Enum194.TANK_NW:
      case Enum194.TANK_NE:
        return 0;
    }

    return -1;
  }

  export function SetSoldierAnimationSurface(
    pSoldier: SOLDIERTYPE,
    usAnimState: UINT16,
  ): boolean {
    let usAnimSurface: UINT16;

    // Delete any structure info!
    if (pSoldier.pLevelNode != null) {
      DeleteStructureFromWorld(pSoldier.pLevelNode.pStructureData);
      pSoldier.pLevelNode.pStructureData = null;
    }

    usAnimSurface = LoadSoldierAnimationSurface(pSoldier, usAnimState);

    // Add structure info!
    if (
      pSoldier.pLevelNode != null &&
      !(pSoldier.uiStatusFlags & SOLDIER_PAUSEANIMOVE)
    ) {
      AddMercStructureInfoFromAnimSurface(
        pSoldier.sGridNo,
        pSoldier,
        usAnimSurface,
        usAnimState,
      );
    }

    // Set
    pSoldier.usAnimSurface = usAnimSurface;

    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
      return false;
    }

    return true;
  }

  export function LoadSoldierAnimationSurface(
    pSoldier: SOLDIERTYPE,
    usAnimState: UINT16,
  ): UINT16 {
    let usAnimSurface: UINT16;

    usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);

    if (usAnimSurface != INVALID_ANIMATION_SURFACE) {
      // Ensure that it's been loaded!
      if (
        GetCachedAnimationSurface(
          pSoldier.ubID,
          pSoldier.AnimCache,
          usAnimSurface,
          pSoldier.usAnimState,
        ) == false
      ) {
        usAnimSurface = INVALID_ANIMATION_SURFACE;
      }
    }

    return usAnimSurface;
  }

  let gusQueenMonsterSpitAnimPerDir: UINT16[] /* [] */ = [
    Enum195.QUEENMONSTERSPIT_NE, // NORTH
    Enum195.QUEENMONSTERSPIT_E,
    Enum195.QUEENMONSTERSPIT_SE, // EAST
    Enum195.QUEENMONSTERSPIT_S,
    Enum195.QUEENMONSTERSPIT_SW, // SOUTH
    Enum195.QUEENMONSTERSPIT_SW,
    Enum195.QUEENMONSTERSPIT_SW, // WEST
    Enum195.QUEENMONSTERSPIT_NE,
  ];

  export function DetermineSoldierAnimationSurface(
    pSoldier: SOLDIERTYPE,
    usAnimState: UINT16,
  ): UINT16 {
    let usAnimSurface: UINT16;
    let usAltAnimSurface: UINT16;
    let ubBodyType: UINT8;
    let usItem: UINT16;
    let ubWaterHandIndex: UINT8 = 1;
    let cnt: INT32;
    let fAdjustedForItem: boolean = false;
    let usNewAnimState: UINT16 = 0;

    ubBodyType = pSoldier.ubBodyType;

    if (
      SubstituteBodyTypeAnimation(
        pSoldier,
        usAnimState,
        createPointer(
          () => usNewAnimState,
          (v) => (usNewAnimState = v),
        ),
      )
    ) {
      usAnimState = usNewAnimState;
    }

    usAnimSurface = gubAnimSurfaceIndex[pSoldier.ubBodyType][usAnimState];

    // CHECK IF WE CAN DO THIS ANIMATION, IE WE HAVE IT AVAILIBLE
    if (usAnimSurface == INVALID_ANIMATION) {
      // WE SHOULD NOT BE USING THIS ANIMATION
      ScreenMsg(
        FONT_MCOLOR_RED,
        MSG_BETAVERSION,
        "Invalid Animation File for Body %d, animation %s.",
        pSoldier.ubBodyType,
        gAnimControl[usAnimState].zAnimStr,
      );
      // Set index to FOUND_INVALID_ANIMATION
      gubAnimSurfaceIndex[pSoldier.ubBodyType][usAnimState] =
        FOUND_INVALID_ANIMATION;
      return INVALID_ANIMATION_SURFACE;
    }
    if (usAnimSurface == FOUND_INVALID_ANIMATION) {
      return INVALID_ANIMATION_SURFACE;
    }

    // OK - DO SOME MAGIC HERE TO SWITCH BODY TYPES IF WE WANT!

    // If we are a queen, pick the 'real' anim surface....
    if (usAnimSurface == Enum195.QUEENMONSTERSPIT_SW) {
      let bDir: INT8;

      // Assume a target gridno is here.... get direction...
      // ATE: use +2 in gridno because here head is far from body
      bDir = GetDirectionToGridNoFromGridNo(
        pSoldier.sGridNo + 2,
        pSoldier.sTargetGridNo,
      );

      return gusQueenMonsterSpitAnimPerDir[bDir];
    }

    // IF we are not a merc, return
    if (pSoldier.ubBodyType > Enum194.REGFEMALE) {
      return usAnimSurface;
    }

    // SWITCH TO DIFFERENT AIM ANIMATION FOR BIG GUY!
    if (usAnimSurface == Enum195.BGMSTANDAIM2) {
      if (pSoldier.uiAnimSubFlags & SUB_ANIM_BIGGUYSHOOT2) {
        usAnimSurface = Enum195.BGMSTANDAIM;
      }
    }

    // SWITCH TO DIFFERENT STAND ANIMATION FOR BIG GUY!
    if (usAnimSurface == Enum195.BGMSTANDING) {
      if (pSoldier.uiAnimSubFlags & SUB_ANIM_BIGGUYTHREATENSTANCE) {
        usAnimSurface = Enum195.BGMTHREATENSTAND;
      }
    }

    if (usAnimSurface == Enum195.BGMWALKING) {
      if (pSoldier.uiAnimSubFlags & SUB_ANIM_BIGGUYTHREATENSTANCE) {
        usAnimSurface = Enum195.BGMWALK2;
      }
    }

    if (usAnimSurface == Enum195.BGMRUNNING) {
      if (pSoldier.uiAnimSubFlags & SUB_ANIM_BIGGUYTHREATENSTANCE) {
        usAnimSurface = Enum195.BGMRUN2;
      }
    }

    if (usAnimSurface == Enum195.BGMRAISE) {
      if (pSoldier.uiAnimSubFlags & SUB_ANIM_BIGGUYTHREATENSTANCE) {
        usAnimSurface = Enum195.BGMRAISE2;
      }
    }

    // ADJUST ANIMATION SURFACE BASED ON TERRAIN

    // CHECK FOR WATER
    if (MercInWater(pSoldier)) {
      // ADJUST BASED ON ITEM IN HAND....
      usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

      // Default it to the 1 ( ie: no rifle )
      if (usItem != NOTHING) {
        if (
          (Item[usItem].usItemClass == IC_GUN ||
            Item[usItem].usItemClass == IC_LAUNCHER) &&
          usItem != Enum225.ROCKET_LAUNCHER
        ) {
          if (Item[usItem].fFlags & ITEM_TWO_HANDED) {
            ubWaterHandIndex = 0;
          }
        }
      }

      // CHANGE BASED ON HIEGHT OF WATER
      usAltAnimSurface =
        gubAnimSurfaceMidWaterSubIndex[pSoldier.ubBodyType][usAnimState][
          ubWaterHandIndex
        ];

      if (usAltAnimSurface != INVALID_ANIMATION) {
        usAnimSurface = usAltAnimSurface;
      }
    } else {
      // ADJUST BASED ON ITEM IN HAND....
      usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

      if (
        (!(Item[usItem].usItemClass == IC_GUN) &&
          !(Item[usItem].usItemClass == IC_LAUNCHER)) ||
        usItem == Enum225.ROCKET_LAUNCHER
      ) {
        if (usAnimState == Enum193.STANDING) {
          usAnimSurface = gusNothingBreath[pSoldier.ubBodyType];
          fAdjustedForItem = true;
        } else {
          usAltAnimSurface =
            gubAnimSurfaceItemSubIndex[pSoldier.ubBodyType][usAnimState];

          if (usAltAnimSurface != INVALID_ANIMATION) {
            usAnimSurface = usAltAnimSurface;
            fAdjustedForItem = true;
          }
        }
      } else {
        // CHECK FOR HANDGUN
        if (
          (Item[usItem].usItemClass == IC_GUN ||
            Item[usItem].usItemClass == IC_LAUNCHER) &&
          usItem != Enum225.ROCKET_LAUNCHER
        ) {
          if (!(Item[usItem].fFlags & ITEM_TWO_HANDED)) {
            usAltAnimSurface =
              gubAnimSurfaceItemSubIndex[pSoldier.ubBodyType][usAnimState];
            if (usAltAnimSurface != INVALID_ANIMATION) {
              usAnimSurface = usAltAnimSurface;
              fAdjustedForItem = true;
            }

            // Look for good two pistols sub anim.....
            if (gDoubleHandledSub.usAnimState == usAnimState) {
              // Do we carry two pistols...
              if (
                Item[pSoldier.inv[Enum261.SECONDHANDPOS].usItem].usItemClass ==
                IC_GUN
              ) {
                usAnimSurface =
                  gDoubleHandledSub.usAnimationSurfaces[pSoldier.ubBodyType];
                fAdjustedForItem = true;
              }
            }
          }
        } else {
          usAltAnimSurface =
            gubAnimSurfaceItemSubIndex[pSoldier.ubBodyType][usAnimState];

          if (usAltAnimSurface != INVALID_ANIMATION) {
            usAnimSurface = usAltAnimSurface;
            fAdjustedForItem = true;
          }
        }
      }

      // Based on if we have adjusted for item or not... check for injured status...
      if (fAdjustedForItem) {
        // If life below thresthold for being injured
        if (pSoldier.bLife < INJURED_CHANGE_THREASHOLD) {
          // ADJUST FOR INJURED....
          for (cnt = 0; cnt < NUM_INJURED_SUBS; cnt++) {
            if (gNothingInjuredSub[cnt].usAnimState == usAnimState) {
              usAnimSurface =
                gNothingInjuredSub[cnt].usAnimationSurfaces[
                  pSoldier.ubBodyType
                ];
            }
          }
        }
      } else {
        // If life below thresthold for being injured
        if (pSoldier.bLife < INJURED_CHANGE_THREASHOLD) {
          // ADJUST FOR INJURED....
          for (cnt = 0; cnt < NUM_INJURED_SUBS; cnt++) {
            if (gRifleInjuredSub[cnt].usAnimState == usAnimState) {
              usAnimSurface =
                gRifleInjuredSub[cnt].usAnimationSurfaces[pSoldier.ubBodyType];
            }
          }
        }
      }
    }
    return usAnimSurface;
  }

  export function GetSoldierAnimationSurface(
    pSoldier: SOLDIERTYPE,
    usAnimState: UINT16,
  ): UINT16 {
    let usAnimSurface: UINT16;

    usAnimSurface = pSoldier.usAnimSurface;

    if (usAnimSurface != INVALID_ANIMATION_SURFACE) {
      // Ensure that it's loaded!
      if (gAnimSurfaceDatabase[usAnimSurface].hVideoObject == null) {
        ScreenMsg(
          FONT_MCOLOR_RED,
          MSG_BETAVERSION,
          "IAnimation Surface for Body %d, animation %s, surface %d not loaded.",
          pSoldier.ubBodyType,
          gAnimControl[usAnimState].zAnimStr,
          usAnimSurface,
        );
        AnimDebugMsg(FormatString("Surface Database: PROBLEMS!!!!!!"));
        usAnimSurface = INVALID_ANIMATION_SURFACE;
      }
    }

    return usAnimSurface;
  }
}
