namespace ja2 {
  const SAI_VERSION = 29;

  /*
STRATEGIC AI -- UNDERLYING PHILOSOPHY
The most fundamental part of the strategic AI which takes from reality and gives to gameplay is the manner
the queen attempts to take her towns back.  Finances and owning mines are the most important way
to win the game.  As the player takes more mines over, the queen will focus more on quality and defense.  In
the beginning of the game, she will focus more on offense than mid-game or end-game.

REALITY
The queen owns the entire country, and the player starts the game with a small lump of cash, enough to hire
some mercenaries for about a week.  In that week, the queen may not notice what is going on, and the player
would believably take over one of the towns before she could feasibly react.  As soon as her military was
aware of the situation, she would likely proceed to send 300-400 troops to annihilate the opposition, and the
game would be over relatively quickly.  If the player was a prodigy, and managed to hold the town against such
a major assault, he would probably lose in the long run being forced into a defensive position and running out
of money quickly while the queen could continue to pump out the troops.  On the other hand, if the player
somehow managed to take over most of the mines, he would be able to casually walk over the queen eventually
just from the sheer income allowing him to purchase several of the best mercs.  That would have the effect of
making the game impossibly difficult in the beginning of the game, and a joke at the end (this is very much
like Master Of Orion II on the more difficult settings )

GAMEPLAY
Because we want the game to be like a normal game and make it fun, we need to make the game easy in the
beginning and harder at the end.  In order to accomplish this, I feel that pure income shouldn't be the factor
for the queen, because she would likely crucify a would-be leader in his early days.  So, in the beginning of
the game, the forces would already be situated with the majority of forces being the administrators in the towns,
and army troops and elites in the more important sectors.  Restricting the queen's offensive
abilities using a distance penalty would mean that the furthest sectors from the queen's palace would be
much easier to defend because she would only be allowed to send x number of troops.  As you get closer to the
queen, she would be allowed to send larger forces to attack those towns in question.  Also, to further
increase the games difficulty as the campaign progresses in the player's favor, we could also increase the
quality of the queen's troops based purely on the peek progress percentage.  This is calculated using a formula
that determines how well the player is doing by combining loyalty of towns owned, income generated, etc.  So,
in the beginning of the game, the quality is at the worst, but once you capture your first mines/towns, it
permanently  increase the queen's quality rating, effectively bumping up the stakes.  By the time you capture
four or five mines, the queen is going to focus more (but not completely) on quality defense as she prepares
for your final onslaught.  This quality rating will augment the experience level, equipment rating, and/or
attribute ratings of the queen's troops.  I would maintain a table of these enhancements based on the current
quality rating hooking into the difficulty all along.

//EXPLANATION OF THE WEIGHT SYSTEM:
The strategic AI has two types of groups:  garrisons and patrol groups.  Each of these groups contain
information of it's needs, mainly desired population.  If the current population is greater than the
desired population, and the group will get a negative weight assigned to it, which means that it is willing
to give up troops to areas that need them more.  On the other hand, if a group has less than the desired population,
then the weight will be positive, meaning they are requesting reinforcements.

The weight generated will range between -100 and +100.  The calculated weight is modified by the priority
of the group.  If the priority of the group is high, they
*/

  // Modifies the number of troops the queen has at the beginning of the game on top
  // of all of the garrison and patrol groups.  Additionally, there are a total of
  // 16 sectors that are LEVEL 1, 2, or 3 garrison groups.  The lower the level, the more
  // troops stay in that sector, and the rest will also be used as a secondary pool when
  // the primary pool runs dry.  So basically, this number is only part of the equation.
  const EASY_QUEENS_POOL_OF_TROOPS = 150;
  const NORMAL_QUEENS_POOL_OF_TROOPS = 200;
  const HARD_QUEENS_POOL_OF_TROOPS = 400;

  // Modifies the starting values as well as the desired values for all of the garrisons.
  const EASY_INITIAL_GARRISON_PERCENTAGES = 70;
  const NORMAL_INITIAL_GARRISON_PERCENTAGES = 100;
  const HARD_INITIAL_GARRISON_PERCENTAGES = 125;

  const EASY_MIN_ENEMY_GROUP_SIZE = 3;
  const NORMAL_MIN_ENEMY_GROUP_SIZE = 4;
  const HARD_MIN_ENEMY_GROUP_SIZE = 6;

  // Sets the starting alert chances.  Everytime an enemy arrives in a new sector, or the player,
  // this is the chance the enemy will detect the player in adjacent sectors.  This chance is associated
  // with each side checked.  Stationary groups do this check periodically.
  const EASY_ENEMY_STARTING_ALERT_LEVEL = 5;
  const NORMAL_ENEMY_STARTING_ALERT_LEVEL = 20;
  const HARD_ENEMY_STARTING_ALERT_LEVEL = 60;

  // When an enemy spots and chases a player group, the alertness value decrements by this value.  The
  // higher the value, the less of a chance the enemy will spot and attack subsequent groups.  This
  // minimizes the aggressiveness of the enemy.  Ranges from 1-100 (but recommend 20-60).
  const EASY_ENEMY_STARTING_ALERT_DECAY = 75;
  const NORMAL_ENEMY_STARTING_ALERT_DECAY = 50;
  const HARD_ENEMY_STARTING_ALERT_DECAY = 25;
  // The base time that the queen can think about reinforcements for refilling lost patrol groups,
  // town garrisons, etc. She only is allowed one action per 'turn'.
  const EASY_TIME_EVALUATE_IN_MINUTES = 480;
  const NORMAL_TIME_EVALUATE_IN_MINUTES = 360;
  const HARD_TIME_EVALUATE_IN_MINUTES = 180;
  // The variance added on.
  const EASY_TIME_EVALUATE_VARIANCE = 240;
  const NORMAL_TIME_EVALUATE_VARIANCE = 180;
  const HARD_TIME_EVALUATE_VARIANCE = 120;

  // When a player takes control of a sector, don't allow any enemy reinforcements to enter the sector for a
  // limited amount of time.  This essentially dumbs down the AI, making it less aggressive.
  const EASY_GRACE_PERIOD_IN_HOURS = 144; // 6 days
  const NORMAL_GRACE_PERIOD_IN_HOURS = 96; // 4 days
  const HARD_GRACE_PERIOD_IN_HOURS = 48; // 2 days

  // Defines how many days must pass before the queen is willing to refill a defeated patrol group.
  const EASY_PATROL_GRACE_PERIOD_IN_DAYS = 16;
  const NORMAL_PATROL_GRACE_PERIOD_IN_DAYS = 12;
  const HARD_PATROL_GRACE_PERIOD_IN_DAYS = 8;

  // Certain conditions can cause the queen to go into a "full alert" mode.  This means that temporarily, the queen's
  // forces will automatically succeed adjacent checks until x number of enemy initiated battles occur.  The same variable
  // is what is used to determine the free checks.
  const EASY_NUM_AWARE_BATTLES = 1;
  const NORMAL_NUM_AWARE_BATTLES = 2;
  const HARD_NUM_AWARE_BATTLES = 3;

  export let gfAutoAIAware: boolean = false;

  // Saved vars
  let gbPadding2: INT8[] /* [3] */ = [0, 0, 0]; // NOT USED
  let gfExtraElites: boolean = false; // Set when queen compositions are augmented with bonus elites.
  let giGarrisonArraySize: INT32 = 0;
  let giPatrolArraySize: INT32 = 0;
  let giForcePercentage: INT32 = 0; // Modifies the starting group sizes relative by percentage
  let giArmyAlertness: INT32 = 0; // The chance the group will spot an adjacent player/militia
  let giArmyAlertnessDecay: INT32 = 0; // How much the spotting chance decreases when spot check succeeds
  export let gubNumAwareBattles: UINT8 = 0; // When non-zero, this means the queen is very aware and searching for players.  Every time
  // there is an enemy initiated battle, this counter decrements until zero.  Until that point,
  // all adjacent sector checks automatically succeed.
  let gfQueenAIAwake: boolean = false; // This flag turns on/off the strategic decisions.  If it's off, no reinforcements
  // or assaults will happen.
  //@@@Alex, this flag is ONLY set by the first meanwhile scene which calls an action.  If this
  // action isn't called, the AI will never turn on.  It is completely dependant on this action.  It can
  // be toggled at will in the AIViewer for testing purposes.
  let giReinforcementPool: INT32 = 0; // How many troops the queen has in reserve in noman's land.  These guys are spawned as needed in P3.
  let giReinforcementPoints: INT32 = 0; // the entire army's capacity to provide reinforcements.
  let giRequestPoints: INT32 = 0; // the entire army's need for reinforcements.
  let gubSAIVersion: UINT8 = SAI_VERSION; // Used for adding new features to be saved.
  let gubQueenPriorityPhase: UINT8 = 0; // Defines how far into defence the queen is -- abstractly related to defcon index ranging from 0-10.
  // 10 is the most defensive
  // Used for authorizing the use of the first battle meanwhile scene AFTER the battle is complete.  This is the case used when
  // the player attacks a town, and is set once militia are sent to investigate.
  export let gfFirstBattleMeanwhileScenePending: boolean = false;

  // After the first battle meanwhile scene is finished, this flag is set, and the queen orders patrol groups to immediately fortify all towns.
  let gfMassFortificationOrdered: boolean = false;

  let gubMinEnemyGroupSize: UINT8 = 0;
  let gubHoursGracePeriod: UINT8 = 0;
  let gusPlayerBattleVictories: UINT16 = 0;
  export let gfUseAlternateQueenPosition: boolean = false;

  // padding for generic globals
  const SAI_PADDING_BYTES = 97;
  let gbPadding: INT8[] /* [SAI_PADDING_BYTES] */ = createArray(
    SAI_PADDING_BYTES,
    0,
  );
  // patrol group info plus padding
  const SAVED_PATROL_GROUPS = 50;
  let gPatrolGroup: PATROL_GROUP[] /* Pointer<PATROL_GROUP> */ = <
    PATROL_GROUP[]
  >(<unknown>null);
  // army composition info plus padding
  const SAVED_ARMY_COMPOSITIONS = 60;
  let gArmyComp: ARMY_COMPOSITION[] /* [NUM_ARMY_COMPOSITIONS] */ =
    createArrayFrom(Enum174.NUM_ARMY_COMPOSITIONS, createArmyComposition);
  // garrison info plus padding
  const SAVED_GARRISON_GROUPS = 100;
  export let gGarrisonGroup: GARRISON_GROUP[] /* Pointer<GARRISON_GROUP> */ = <
    GARRISON_GROUP[]
  >(<unknown>null);

  // This refers to the number of force points that are *saved* for the AI to use.  This is basically an array of each
  // group.  When the queen wants to send forces to attack a town that is defended, the initial number of forces that
  // she would send would be considered too weak.  So, instead, she will send that force to the sector's adjacent sector,
  // and stage, while
  let gubGarrisonReinforcementsDenied: UINT8[] = <UINT8[]>(<unknown>null);
  let gubPatrolReinforcementsDenied: UINT8[] = <UINT8[]>(<unknown>null);

  // Unsaved vars
  let gfDisplayStrategicAILogs: boolean = false;

  // The army composition defines attributes for the various garrisons.  The priority reflects how important the sector is
  // to the queen, the elite/troop percentages refer to the desired composition of the group.  The admin percentage has recently been
  // changed to reflect the starting percentage of the garrison that are administrators.  Note that elite% + troop% = 100, and the admin% is
  // not related in this effect.  If the admin% is non-zero, then that garrison is assigned only x% of the force as admins, with NO troops or elites.
  // All reinforcements use the composition of the troop/elite for refilling.
  //@@@Alex, the send reinforcement composition isn't complete.  Either sends all troops or troops based off of the composition of the source garrison.
  //  It is my intention to add this.

  // If you change the MAX_STRATEGIC_TEAM_SIZE, then all the garrison sizes (start, desired) will have to be changed accordingly.

  let gOrigArmyComp: ARMY_COMPOSITION[] /* [NUM_ARMY_COMPOSITIONS] */ = [
    // COMPOSITION					PRIORITY	ELITE%	TROOP%	ADMIN 	DESIRED#	START#		PADDING
    //																							START%
    createArmyCompositionFrom(
      Enum174.QUEEN_DEFENCE,
      100,
      100,
      0,
      0,
      32,
      32,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.MEDUNA_DEFENCE,
      95,
      55,
      45,
      0,
      16,
      20,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.MEDUNA_SAMSITE,
      96,
      65,
      35,
      0,
      20,
      20,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.LEVEL1_DEFENCE,
      40,
      20,
      80,
      0,
      12,
      20,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.LEVEL2_DEFENCE,
      30,
      10,
      90,
      0,
      10,
      20,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.LEVEL3_DEFENCE,
      20,
      5,
      95,
      0,
      8,
      20,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.ORTA_DEFENCE,
      90,
      50,
      50,
      0,
      18,
      19,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.EAST_GRUMM_DEFENCE,
      80,
      20,
      80,
      0,
      15,
      15,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.WEST_GRUMM_DEFENCE,
      70,
      0,
      100,
      40,
      15,
      15,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.GRUMM_MINE,
      85,
      25,
      75,
      45,
      15,
      15,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.OMERTA_WELCOME_WAGON,
      0,
      0,
      100,
      0,
      0,
      3,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.BALIME_DEFENCE,
      60,
      45,
      55,
      20,
      10,
      4,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.TIXA_PRISON,
      80,
      10,
      90,
      15,
      15,
      15,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.TIXA_SAMSITE,
      85,
      10,
      90,
      0,
      12,
      12,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.ALMA_DEFENCE,
      74,
      15,
      85,
      0,
      11,
      20,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.ALMA_MINE,
      80,
      20,
      80,
      45,
      15,
      20,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.CAMBRIA_DEFENCE,
      50,
      0,
      100,
      30,
      10,
      6,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.CAMBRIA_MINE,
      60,
      15,
      90,
      40,
      11,
      6,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.CHITZENA_DEFENCE,
      30,
      0,
      100,
      75,
      12,
      10,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.CHITZENA_MINE,
      40,
      0,
      100,
      75,
      10,
      10,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.CHITZENA_SAMSITE,
      75,
      10,
      90,
      0,
      9,
      9,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.DRASSEN_AIRPORT,
      30,
      0,
      100,
      85,
      12,
      10,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.DRASSEN_DEFENCE,
      20,
      0,
      100,
      80,
      10,
      8,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.DRASSEN_MINE,
      35,
      0,
      100,
      75,
      11,
      9,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.DRASSEN_SAMSITE,
      50,
      0,
      100,
      0,
      10,
      10,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.ROADBLOCK,
      20,
      2,
      98,
      0,
      8,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createArmyCompositionFrom(
      Enum174.SANMONA_SMALL,
      0,
      0,
      0,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
  ];

  // Patrol definitions
  // NOTE:	  A point containing 0 is actually the same as SEC_A1, but because nobody is using SEC_A1 in any
  //				of the patrol groups, I am coding 0 to be ignored.
  // NOTE:		Must have at least two points.
  let gOrigPatrolGroup: PATROL_GROUP[] /* [] */ = [
    // SIZE	PRIORITY	POINT1		POINT2		POINT3		POINT4		MOD 		GROUPID	WEIGHT	PENDING
    //																												DAY100									GROUP ID
    createPatrolGroupFrom(
      8,
      40,
      [Enum123.SEC_B1, Enum123.SEC_C1, Enum123.SEC_C3, Enum123.SEC_A3],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      6,
      35,
      [Enum123.SEC_B4, Enum123.SEC_B7, Enum123.SEC_C7, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      6,
      25,
      [Enum123.SEC_A8, Enum123.SEC_B8, Enum123.SEC_B9, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      6,
      30,
      [Enum123.SEC_B10, Enum123.SEC_B12, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      7,
      45,
      [Enum123.SEC_A11, Enum123.SEC_A14, Enum123.SEC_D14, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 5
    createPatrolGroupFrom(
      6,
      50,
      [Enum123.SEC_C8, Enum123.SEC_C9, Enum123.SEC_D9, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      12,
      55,
      [Enum123.SEC_D3, Enum123.SEC_G3, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      10,
      50,
      [Enum123.SEC_D6, Enum123.SEC_D7, Enum123.SEC_F7, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      10,
      55,
      [Enum123.SEC_E8, Enum123.SEC_E11, Enum123.SEC_F11, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      10,
      60,
      [Enum123.SEC_E12, Enum123.SEC_E15, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 10
    createPatrolGroupFrom(
      12,
      60,
      [Enum123.SEC_G4, Enum123.SEC_G7, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      12,
      65,
      [Enum123.SEC_G10, Enum123.SEC_G12, Enum123.SEC_F12, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      12,
      65,
      [Enum123.SEC_G13, Enum123.SEC_G15, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      10,
      65,
      [Enum123.SEC_H15, Enum123.SEC_J15, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      14,
      65,
      [Enum123.SEC_H12, Enum123.SEC_J12, Enum123.SEC_J13, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 15
    createPatrolGroupFrom(
      13,
      70,
      [Enum123.SEC_H9, Enum123.SEC_I9, Enum123.SEC_I10, Enum123.SEC_J10],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      11,
      70,
      [Enum123.SEC_K11, Enum123.SEC_K14, Enum123.SEC_J14, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      12,
      75,
      [Enum123.SEC_J2, Enum123.SEC_K2, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      12,
      80,
      [Enum123.SEC_I3, Enum123.SEC_J3, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      12,
      80,
      [Enum123.SEC_J6, Enum123.SEC_K6, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 20
    createPatrolGroupFrom(
      13,
      85,
      [Enum123.SEC_K7, Enum123.SEC_K10, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      12,
      90,
      [Enum123.SEC_L10, Enum123.SEC_M10, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      12,
      90,
      [Enum123.SEC_N9, Enum123.SEC_N10, 0, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      12,
      80,
      [Enum123.SEC_L7, Enum123.SEC_L8, Enum123.SEC_M8, Enum123.SEC_M9],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      14,
      80,
      [Enum123.SEC_H4, Enum123.SEC_H5, Enum123.SEC_I5, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 25
    createPatrolGroupFrom(
      7,
      40,
      [Enum123.SEC_D4, Enum123.SEC_E4, Enum123.SEC_E5, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      7,
      50,
      [Enum123.SEC_C10, Enum123.SEC_C11, Enum123.SEC_D11, Enum123.SEC_D12],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      8,
      40,
      [Enum123.SEC_A15, Enum123.SEC_C15, Enum123.SEC_C16, 0],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createPatrolGroupFrom(
      12,
      30,
      [Enum123.SEC_L13, Enum123.SEC_M13, Enum123.SEC_M14, Enum123.SEC_L14],
      -1,
      0,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 29
  ];
  const PATROL_GROUPS = 29;

  let gOrigGarrisonGroup: GARRISON_GROUP[] /* [] */ = [
    // SECTOR	MILITARY								WEIGHT	UNUSED
    //				COMPOSITION											GROUP ID
    createGarrisonGroupFrom(
      Enum123.SEC_P3,
      Enum174.QUEEN_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_O3,
      Enum174.MEDUNA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_O4,
      Enum174.MEDUNA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_N3,
      Enum174.MEDUNA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_N4,
      Enum174.MEDUNA_SAMSITE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 5
    createGarrisonGroupFrom(
      Enum123.SEC_N5,
      Enum174.MEDUNA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_M3,
      Enum174.LEVEL1_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_M4,
      Enum174.LEVEL1_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_M5,
      Enum174.LEVEL1_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_N6,
      Enum174.LEVEL1_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 10
    createGarrisonGroupFrom(
      Enum123.SEC_M2,
      Enum174.LEVEL2_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_L3,
      Enum174.LEVEL2_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_L4,
      Enum174.LEVEL2_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_L5,
      Enum174.LEVEL2_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_M6,
      Enum174.LEVEL2_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 15
    createGarrisonGroupFrom(
      Enum123.SEC_N7,
      Enum174.LEVEL1_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_L2,
      Enum174.LEVEL3_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_K3,
      Enum174.LEVEL3_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_K5,
      Enum174.LEVEL3_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_L6,
      Enum174.LEVEL3_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 20
    createGarrisonGroupFrom(
      Enum123.SEC_M7,
      Enum174.LEVEL3_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_N8,
      Enum174.LEVEL3_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_K4,
      Enum174.ORTA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_G1,
      Enum174.WEST_GRUMM_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_G2,
      Enum174.EAST_GRUMM_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 25
    createGarrisonGroupFrom(
      Enum123.SEC_H1,
      Enum174.WEST_GRUMM_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_H2,
      Enum174.EAST_GRUMM_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_H3,
      Enum174.GRUMM_MINE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_A9,
      Enum174.OMERTA_WELCOME_WAGON,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_L11,
      Enum174.BALIME_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 30
    createGarrisonGroupFrom(
      Enum123.SEC_L12,
      Enum174.BALIME_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_J9,
      Enum174.TIXA_PRISON,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_I8,
      Enum174.TIXA_SAMSITE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_H13,
      Enum174.ALMA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_H14,
      Enum174.ALMA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 35
    createGarrisonGroupFrom(
      Enum123.SEC_I13,
      Enum174.ALMA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_I14,
      Enum174.ALMA_MINE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_F8,
      Enum174.CAMBRIA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_F9,
      Enum174.CAMBRIA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_G8,
      Enum174.CAMBRIA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 40
    createGarrisonGroupFrom(
      Enum123.SEC_G9,
      Enum174.CAMBRIA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_H8,
      Enum174.CAMBRIA_MINE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_A2,
      Enum174.CHITZENA_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_B2,
      Enum174.CHITZENA_MINE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_D2,
      Enum174.CHITZENA_SAMSITE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 45
    createGarrisonGroupFrom(
      Enum123.SEC_B13,
      Enum174.DRASSEN_AIRPORT,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_C13,
      Enum174.DRASSEN_DEFENCE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_D13,
      Enum174.DRASSEN_MINE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_D15,
      Enum174.DRASSEN_SAMSITE,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_G12,
      Enum174.ROADBLOCK,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 50
    createGarrisonGroupFrom(
      Enum123.SEC_M10,
      Enum174.ROADBLOCK,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_G6,
      Enum174.ROADBLOCK,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_C9,
      Enum174.ROADBLOCK,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_K10,
      Enum174.ROADBLOCK,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_G7,
      Enum174.ROADBLOCK,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 55
    createGarrisonGroupFrom(
      Enum123.SEC_G3,
      Enum174.ROADBLOCK,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    createGarrisonGroupFrom(
      Enum123.SEC_C5,
      Enum174.SANMONA_SMALL,
      0,
      0,
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ),
    // 57
  ];

  const SAIReportError = (a: string) => {}; // define it out

  const enum Enum172 {
    DIRECT,
    EVASIVE,
    STAGE,
  }

  // returns the number of reinforcements permitted to be sent.  Will increased if the denied counter is non-zero.
  function GarrisonReinforcementsRequested(iGarrisonID: INT32): {
    iReinforcementsRequested: INT32;
    ubExtraReinforcements: UINT8;
  } {
    let ubExtraReinforcements: UINT8;

    let iReinforcementsRequested: INT32;
    let iExistingForces: INT32;
    let pSector: SECTORINFO;

    pSector = SectorInfo[gGarrisonGroup[iGarrisonID].ubSectorID];
    iExistingForces =
      pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
    iReinforcementsRequested =
      gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition].bDesiredPopulation -
      iExistingForces;

    // Record how many of the reinforcements are additionally provided due to being denied in the past.  This will grow
    // until it is finally excepted or an absolute max is made.
    ubExtraReinforcements = Math.trunc(
      gubGarrisonReinforcementsDenied[iGarrisonID] /
        (6 - gGameOptions.ubDifficultyLevel),
    );
    // Make sure the number of extra reinforcements don't bump the force size past the max of MAX_STRATEGIC_TEAM_SIZE.
    ubExtraReinforcements = Math.min(
      ubExtraReinforcements,
      Math.min(
        ubExtraReinforcements,
        MAX_STRATEGIC_TEAM_SIZE - iReinforcementsRequested,
      ),
    );

    iReinforcementsRequested = Math.min(
      MAX_STRATEGIC_TEAM_SIZE,
      iReinforcementsRequested,
    );

    if (
      iReinforcementsRequested + ubExtraReinforcements + iExistingForces >
      MAX_STRATEGIC_TEAM_SIZE
    ) {
      iExistingForces = iExistingForces;
    }

    return { iReinforcementsRequested, ubExtraReinforcements };
  }

  function PatrolReinforcementsRequested(iPatrolID: INT32): INT32 {
    let pGroup: GROUP | null;
    pGroup = GetGroup(gPatrolGroup[iPatrolID].ubGroupID);
    if (!pGroup) {
      return gPatrolGroup[iPatrolID].bSize;
    } else {
      return gPatrolGroup[iPatrolID].bSize - pGroup.ubGroupSize;
    }
  }

  function ReinforcementsAvailable(iGarrisonID: INT32): INT32 {
    let pSector: SECTORINFO;
    let iReinforcementsAvailable: INT32;

    pSector = SectorInfo[gGarrisonGroup[iGarrisonID].ubSectorID];
    iReinforcementsAvailable =
      pSector.ubNumTroops + pSector.ubNumElites + pSector.ubNumAdmins;
    iReinforcementsAvailable -=
      gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition].bDesiredPopulation;

    switch (gGarrisonGroup[iGarrisonID].ubComposition) {
      case Enum174.LEVEL1_DEFENCE:
      case Enum174.LEVEL2_DEFENCE:
      case Enum174.LEVEL3_DEFENCE:
      case Enum174.ALMA_DEFENCE:
      case Enum174.ALMA_MINE:
        // Legal spawning locations
        break;
      default:
        // No other sector permitted to send surplus troops
        return 0;
    }

    return iReinforcementsAvailable;
  }

  //
  function PlayerForceTooStrong(
    ubSectorID: UINT8,
    usOffensePoints: UINT16,
    pusDefencePoints: Pointer<UINT16>,
  ): boolean {
    let pSector: SECTORINFO;
    let ubSectorX: UINT8;
    let ubSectorY: UINT8;

    ubSectorX = SECTORX(ubSectorID);
    ubSectorY = SECTORY(ubSectorID);
    pSector = SectorInfo[ubSectorID];

    pusDefencePoints.value =
      pSector.ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] * 1 +
      pSector.ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] * 2 +
      pSector.ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA] * 3 +
      PlayerMercsInSector(ubSectorX, ubSectorY, 0) * 5;
    if (pusDefencePoints.value > usOffensePoints) {
      return true;
    }
    return false;
  }

  function RequestAttackOnSector(
    ubSectorID: UINT8,
    usDefencePoints: UINT16,
  ): void {
    let i: INT32;
    for (i = 0; i < giGarrisonArraySize; i++) {
      if (
        gGarrisonGroup[i].ubSectorID == ubSectorID &&
        !gGarrisonGroup[i].ubPendingGroupID
      ) {
        SendReinforcementsForGarrison(i, usDefencePoints, null);
        return;
      }
    }
  }

  function AdjacentSectorIsImportantAndUndefended(ubSectorID: UINT8): boolean {
    let pSector: SECTORINFO;
    switch (ubSectorID) {
      case Enum123.SEC_A9:
      case Enum123.SEC_A10: // Omerta
      case Enum123.SEC_C5:
      case Enum123.SEC_C6:
      case Enum123.SEC_D5: // San Mona
      case Enum123.SEC_I6: // Estoni
        // These sectors aren't important.
        return false;
    }
    pSector = SectorInfo[ubSectorID];
    if (pSector.ubNumTroops || pSector.ubNumElites || pSector.ubNumAdmins) {
      return false;
    }
    if (pSector.ubTraversability[4] == Enum127.TOWN) {
      if (!PlayerSectorDefended(ubSectorID)) {
        return true;
      }
    }
    return false;
  }

  function ValidatePendingGroups(): void {}

  function ValidateWeights(iID: INT32): void {}

  function ValidateGroup(pGroup: GROUP): void {
    if (
      !pGroup.ubSectorX ||
      !pGroup.ubSectorY ||
      pGroup.ubSectorX > 16 ||
      pGroup.ubSectorY > 16
    ) {
      if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
        ClearPreviousAIGroupAssignment(pGroup);
        RemovePGroup(pGroup);
        return;
      }
    }
    if (!pGroup.ubNextX || !pGroup.ubNextY) {
      if (
        !pGroup.fPlayer &&
        (<ENEMYGROUP>pGroup.pEnemyGroup).ubIntention != Enum184.STAGING &&
        (<ENEMYGROUP>pGroup.pEnemyGroup).ubIntention != Enum184.REINFORCEMENTS
      ) {
        if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
          ClearPreviousAIGroupAssignment(pGroup);
          ReassignAIGroup(
            createPointer(
              () => pGroup,
              (v) => (pGroup = v),
            ),
          );
          return;
        }
      }
    }
  }

  function ValidateLargeGroup(pGroup: GROUP): void {}

  export function InitStrategicAI(): void {
    let i: INT32;
    let cnt: INT32;
    let iRandom: INT32;
    let iEliteChance: INT32;
    let iTroopChance: INT32;
    let iAdminChance: INT32;
    let iWeight: INT32;
    let iStartPop: INT32;
    let iDesiredPop: INT32;
    let iPriority: INT32;
    let pSector: SECTORINFO;
    let pGroup: GROUP | null;
    let ubNumTroops: UINT8;
    // Initialize the basic variables.

    gbPadding2[0] = 0;
    gbPadding2[1] = 0;
    gbPadding2[2] = 0;
    gfExtraElites = false;
    giGarrisonArraySize = 0;
    giPatrolArraySize = 0;
    giForcePercentage = 0;
    giArmyAlertness = 0;
    giArmyAlertnessDecay = 0;
    gubNumAwareBattles = 0;
    gfQueenAIAwake = false;
    giReinforcementPool = 0;
    giReinforcementPoints = 0;
    giRequestPoints = 0;
    gubSAIVersion = SAI_VERSION;
    gubQueenPriorityPhase = 0;
    gfFirstBattleMeanwhileScenePending = false;
    gfMassFortificationOrdered = false;
    gubMinEnemyGroupSize = 0;
    gubHoursGracePeriod = 0;
    gusPlayerBattleVictories = 0;
    gfUseAlternateQueenPosition = false;

    switch (gGameOptions.ubDifficultyLevel) {
      case Enum9.DIF_LEVEL_EASY:
        giReinforcementPool = EASY_QUEENS_POOL_OF_TROOPS;
        giForcePercentage = EASY_INITIAL_GARRISON_PERCENTAGES;
        giArmyAlertness = EASY_ENEMY_STARTING_ALERT_LEVEL;
        giArmyAlertnessDecay = EASY_ENEMY_STARTING_ALERT_DECAY;
        gubMinEnemyGroupSize = EASY_MIN_ENEMY_GROUP_SIZE;
        gubHoursGracePeriod = EASY_GRACE_PERIOD_IN_HOURS;
        // 475 is 7:55am in minutes since midnight, the time the game starts on day 1
        AddStrategicEvent(
          Enum132.EVENT_EVALUATE_QUEEN_SITUATION,
          475 +
            EASY_TIME_EVALUATE_IN_MINUTES +
            Random(EASY_TIME_EVALUATE_VARIANCE),
          0,
        );
        break;
      case Enum9.DIF_LEVEL_MEDIUM:
        giReinforcementPool = NORMAL_QUEENS_POOL_OF_TROOPS;
        giForcePercentage = NORMAL_INITIAL_GARRISON_PERCENTAGES;
        giArmyAlertness = NORMAL_ENEMY_STARTING_ALERT_LEVEL;
        giArmyAlertnessDecay = NORMAL_ENEMY_STARTING_ALERT_DECAY;
        gubMinEnemyGroupSize = NORMAL_MIN_ENEMY_GROUP_SIZE;
        gubHoursGracePeriod = NORMAL_GRACE_PERIOD_IN_HOURS;
        AddStrategicEvent(
          Enum132.EVENT_EVALUATE_QUEEN_SITUATION,
          475 +
            NORMAL_TIME_EVALUATE_IN_MINUTES +
            Random(NORMAL_TIME_EVALUATE_VARIANCE),
          0,
        );
        break;
      case Enum9.DIF_LEVEL_HARD:
        giReinforcementPool = HARD_QUEENS_POOL_OF_TROOPS;
        giForcePercentage = HARD_INITIAL_GARRISON_PERCENTAGES;
        giArmyAlertness = HARD_ENEMY_STARTING_ALERT_LEVEL;
        giArmyAlertnessDecay = HARD_ENEMY_STARTING_ALERT_DECAY;
        gubMinEnemyGroupSize = HARD_MIN_ENEMY_GROUP_SIZE;
        gubHoursGracePeriod = HARD_GRACE_PERIOD_IN_HOURS;
        AddStrategicEvent(
          Enum132.EVENT_EVALUATE_QUEEN_SITUATION,
          475 +
            HARD_TIME_EVALUATE_IN_MINUTES +
            Random(HARD_TIME_EVALUATE_VARIANCE),
          0,
        );
        break;
    }

    // Initialize the sectorinfo structure so all sectors don't point to a garrisonID.
    for (i = 0; i <= 255; i++) {
      SectorInfo[i].ubGarrisonID = NO_GARRISON;
    }

    // copy over the original army composition as it does get modified during the campaign.  This
    // bulletproofs starting the game over again.
    copyObjectArray(gArmyComp, gOrigArmyComp, copyArmyComposition);

    // Eliminate more perimeter defenses on the easier levels.
    switch (gGameOptions.ubDifficultyLevel) {
      case Enum9.DIF_LEVEL_EASY:
        gArmyComp[Enum174.LEVEL2_DEFENCE].bDesiredPopulation = 0;
        gArmyComp[Enum174.LEVEL2_DEFENCE].bStartPopulation = 0;
        gArmyComp[Enum174.LEVEL3_DEFENCE].bDesiredPopulation = 0;
        gArmyComp[Enum174.LEVEL3_DEFENCE].bStartPopulation = 0;
        break;
      case Enum9.DIF_LEVEL_MEDIUM:
        gArmyComp[Enum174.LEVEL3_DEFENCE].bDesiredPopulation = 0;
        gArmyComp[Enum174.LEVEL3_DEFENCE].bStartPopulation = 0;
        break;
    }
    // initialize the patrol group definitions
    giPatrolArraySize = gOrigPatrolGroup.length;
    if (!gPatrolGroup) {
      // Allocate it (otherwise, we just overwrite it because the size never changes)
      gPatrolGroup = createArrayFrom(giPatrolArraySize, createPatrolGroup);
      Assert(gPatrolGroup);
    }
    copyObjectArray(gPatrolGroup, gOrigPatrolGroup, copyPatrolGroup);

    gubPatrolReinforcementsDenied = createArray(giPatrolArraySize, 0);

    // initialize the garrison group definitions
    giGarrisonArraySize = gOrigGarrisonGroup.length;
    if (!gGarrisonGroup) {
      gGarrisonGroup = createArrayFrom(
        giGarrisonArraySize,
        createGarrisonGroup,
      );
      Assert(gGarrisonGroup);
    }
    copyObjectArray(gGarrisonGroup, gOrigGarrisonGroup, copyGarrisonGroup);

    gubGarrisonReinforcementsDenied = createArray(giGarrisonArraySize, 0);

    // Modify initial force sizes?
    if (giForcePercentage != 100) {
      // The initial force sizes are being modified, so go through each of the army compositions
      // and adjust them accordingly.
      for (i = 0; i < Enum174.NUM_ARMY_COMPOSITIONS; i++) {
        if (i != Enum174.QUEEN_DEFENCE) {
          gArmyComp[i].bDesiredPopulation = Math.min(
            MAX_STRATEGIC_TEAM_SIZE,
            Math.trunc(
              (gArmyComp[i].bDesiredPopulation * giForcePercentage) / 100,
            ),
          );
          if (gArmyComp[i].bStartPopulation != MAX_STRATEGIC_TEAM_SIZE) {
            // if the value is MAX_STRATEGIC_TEAM_SIZE, then that means the particular sector is a spawning location.
            // Don't modify the value if it is MAX_STRATEGIC_TEAM_SIZE.  Everything else is game.
            gArmyComp[i].bStartPopulation = Math.min(
              MAX_STRATEGIC_TEAM_SIZE,
              Math.trunc(
                (gArmyComp[i].bStartPopulation * giForcePercentage) / 100,
              ),
            );
          }
        } else {
          gArmyComp[i].bDesiredPopulation = Math.min(
            32,
            Math.trunc(
              (gArmyComp[i].bDesiredPopulation * giForcePercentage) / 100,
            ),
          );
          gArmyComp[i].bStartPopulation = gArmyComp[i].bDesiredPopulation;
        }
      }
      for (i = 0; i < giPatrolArraySize; i++) {
        // force modified range within 1-MAX_STRATEGIC_TEAM_SIZE.
        gPatrolGroup[i].bSize = Math.max(
          gubMinEnemyGroupSize,
          Math.min(
            MAX_STRATEGIC_TEAM_SIZE,
            Math.trunc((gPatrolGroup[i].bSize * giForcePercentage) / 100),
          ),
        );
      }
    }

    // Now, initialize the garrisons based on the initial sizes (all variances are plus or minus 1).
    for (i = 0; i < giGarrisonArraySize; i++) {
      pSector = SectorInfo[gGarrisonGroup[i].ubSectorID];
      pSector.ubGarrisonID = i;
      iStartPop = gArmyComp[gGarrisonGroup[i].ubComposition].bStartPopulation;
      iDesiredPop =
        gArmyComp[gGarrisonGroup[i].ubComposition].bDesiredPopulation;
      iPriority = gArmyComp[gGarrisonGroup[i].ubComposition].bPriority;
      iEliteChance =
        gArmyComp[gGarrisonGroup[i].ubComposition].bElitePercentage;
      iTroopChance =
        gArmyComp[gGarrisonGroup[i].ubComposition].bTroopPercentage +
        iEliteChance;
      iAdminChance =
        gArmyComp[gGarrisonGroup[i].ubComposition].bAdminPercentage;

      switch (gGarrisonGroup[i].ubComposition) {
        case Enum174.ROADBLOCK:
          pSector.uiFlags |= SF_ENEMY_AMBUSH_LOCATION;
          if (Chance(20))
            iStartPop =
              gArmyComp[gGarrisonGroup[i].ubComposition].bDesiredPopulation;
          else iStartPop = 0;
          break;
        case Enum174.SANMONA_SMALL:
          iStartPop = 0; // not appropriate until Kingpin is killed.
          break;
      }

      if (iStartPop) {
        if (gGarrisonGroup[i].ubSectorID != Enum123.SEC_P3) {
          // if population is less than maximum
          if (iStartPop != MAX_STRATEGIC_TEAM_SIZE) {
            // then vary it a bit (+/- 25%)
            iStartPop = Math.trunc(
              (iStartPop * (100 + (Random(51) - 25))) / 100,
            );
          }

          iStartPop = Math.max(
            gubMinEnemyGroupSize,
            Math.min(MAX_STRATEGIC_TEAM_SIZE, iStartPop),
          );
        }
        cnt = iStartPop;

        if (iAdminChance) {
          pSector.ubNumAdmins = Math.trunc((iAdminChance * iStartPop) / 100);
        } else
          while (cnt--) {
            // for each person, randomly determine the types of each soldier.
            {
              iRandom = Random(100);
              if (iRandom < iEliteChance) {
                pSector.ubNumElites++;
              } else if (iRandom < iTroopChance) {
                pSector.ubNumTroops++;
              }
            }
          }
        switch (gGarrisonGroup[i].ubComposition) {
          case Enum174.CAMBRIA_DEFENCE:
          case Enum174.CAMBRIA_MINE:
          case Enum174.ALMA_MINE:
          case Enum174.GRUMM_MINE:
            // Fill up extra start slots with troops
            pSector.ubNumTroops = iStartPop -= pSector.ubNumAdmins;
            break;
          case Enum174.DRASSEN_AIRPORT:
          case Enum174.DRASSEN_DEFENCE:
          case Enum174.DRASSEN_MINE:
            pSector.ubNumAdmins = Math.max(5, pSector.ubNumAdmins);
            break;
          case Enum174.TIXA_PRISON:
            pSector.ubNumAdmins = Math.max(8, pSector.ubNumAdmins);
            break;
        }
      }
      if (iAdminChance && pSector.ubNumAdmins < gubMinEnemyGroupSize) {
        pSector.ubNumAdmins = gubMinEnemyGroupSize;
      }
      // Calculate weight (range is -20 to +20 before multiplier).
      // The multiplier of 3 brings it to a range of -96 to +96 which is
      // close enough to a plus/minus 100%.  The resultant percentage is then
      // converted based on the priority.
      iWeight = (iDesiredPop - iStartPop) * 3;
      if (iWeight > 0) {
        // modify it by it's priority.
        // generates a value between 2 and 100
        iWeight = Math.trunc((iWeight * iPriority) / 96);
        iWeight = Math.max(iWeight, 2);
        giRequestPoints += iWeight;
      } else if (iWeight < 0) {
        // modify it by it's reverse priority
        // generates a value between -2 and -100
        iWeight = Math.trunc((iWeight * (100 - iPriority)) / 96);
        iWeight = Math.min(iWeight, -2);
        giReinforcementPoints -= iWeight;
      }
      gGarrisonGroup[i].bWeight = iWeight;

      // Now post an event which allows them to check adjacent sectors periodically.
      // Spread them out so that they process at different times.
      AddPeriodStrategicEventWithOffset(
        Enum132.EVENT_CHECK_ENEMY_CONTROLLED_SECTOR,
        140 - 20 * gGameOptions.ubDifficultyLevel + Random(4),
        475 + i,
        gGarrisonGroup[i].ubSectorID,
      );
    }
    // Now, initialize each of the patrol groups
    for (i = 0; i < giPatrolArraySize; i++) {
      // IGNORE COMMENT, FEATURE REMOVED!
      // Some of the patrol groups aren't there at the beginning of the game.  This is
      // based on the difficulty settings in the above patrol table.
      // if( gPatrolGroup[ i ].ubUNUSEDStartIfDifficulty <= gGameOptions.ubDifficultyLevel )
      {
        // Add this patrol group now.
        ubNumTroops = gPatrolGroup[i].bSize + Random(3) - 1;
        ubNumTroops = Math.max(
          gubMinEnemyGroupSize,
          Math.min(MAX_STRATEGIC_TEAM_SIZE, ubNumTroops),
        );
        // ubNumTroops = (UINT8)max( gubMinEnemyGroupSize, min( MAX_STRATEGIC_TEAM_SIZE, gPatrolGroup[ i ].bSize + Random( 3 ) - 1 ) );
        // Note on adding patrol groups...
        // The patrol group can't actually start on the first waypoint, so we set it to the second way
        // point for initialization, and then add the waypoints from 0 up
        pGroup = CreateNewEnemyGroupDepartingFromSector(
          gPatrolGroup[i].ubSectorID[1],
          0,
          ubNumTroops,
          0,
        );
        Assert(pGroup);
        Assert(pGroup.pEnemyGroup);

        if (i == 3 || i == 4) {
          // Special case:  Two patrol groups are administrator groups -- rest are troops
          pGroup.pEnemyGroup.ubNumAdmins = pGroup.pEnemyGroup.ubNumTroops;
          pGroup.pEnemyGroup.ubNumTroops = 0;
        }
        gPatrolGroup[i].ubGroupID = pGroup.ubGroupID;
        pGroup.pEnemyGroup.ubIntention = Enum184.PATROL;
        pGroup.ubMoveType = Enum185.ENDTOEND_FORWARDS;
        AddWaypointIDToPGroup(pGroup, gPatrolGroup[i].ubSectorID[0]);
        AddWaypointIDToPGroup(pGroup, gPatrolGroup[i].ubSectorID[1]);
        if (gPatrolGroup[i].ubSectorID[2]) {
          // Add optional waypoints if included.
          AddWaypointIDToPGroup(pGroup, gPatrolGroup[i].ubSectorID[2]);
          if (gPatrolGroup[i].ubSectorID[3])
            AddWaypointIDToPGroup(pGroup, gPatrolGroup[i].ubSectorID[3]);
        }
        RandomizePatrolGroupLocation(pGroup);
        ValidateGroup(pGroup);
      }
      // else
      //{ //we aren't creating this patrol group at the beginning of the game, so we
      // need to set up the weighting values to prioritize it's reinforcement request so that
      // it gets filled up later in the game.
      //	iWeight = gPatrolGroup[ i ].bSize * 3 * gPatrolGroup[ i ].bPriority / 96;
      //	gPatrolGroup[ i ].bWeight = (INT8)iWeight;
      //	giRequestPoints += iWeight;
      //}
    }

    // Setup the flags for the four sam sites.
    SectorInfo[Enum123.SEC_D2].uiFlags |= SF_SAM_SITE;
    SectorInfo[Enum123.SEC_D15].uiFlags |= SF_SAM_SITE;
    SectorInfo[Enum123.SEC_I8].uiFlags |= SF_SAM_SITE;
    SectorInfo[Enum123.SEC_N4].uiFlags |= SF_SAM_SITE;

    // final thing to do is choose 1 cache map out of 5 possible maps.  Simply select the sector randomly,
    // set up the flags to use the alternate map, then place 8-12 regular troops there (no ai though).
    // changing MAX_STRATEGIC_TEAM_SIZE may require changes to to the defending force here.
    switch (Random(5)) {
      case 0:
        pSector = SectorInfo[Enum123.SEC_E11];
        break;
      case 1:
        pSector = SectorInfo[Enum123.SEC_H5];
        break;
      case 2:
        pSector = SectorInfo[Enum123.SEC_H10];
        break;
      case 3:
        pSector = SectorInfo[Enum123.SEC_J12];
        break;
      case 4:
        pSector = SectorInfo[Enum123.SEC_M9];
        break;
      default:
        throw new Error("Should be unreachable");
    }
    pSector.uiFlags |= SF_USE_ALTERNATE_MAP;
    pSector.ubNumTroops = 6 + gGameOptions.ubDifficultyLevel * 2;

    ValidateWeights(1);
  }

  export function KillStrategicAI(): void {
    if (gPatrolGroup) {
      gPatrolGroup = <PATROL_GROUP[]>(<unknown>null);
    }
    if (gGarrisonGroup) {
      gGarrisonGroup = <GARRISON_GROUP[]>(<unknown>null);
    }
    if (gubPatrolReinforcementsDenied) {
      gubPatrolReinforcementsDenied = <UINT8[]>(<unknown>null);
    }
    if (gubGarrisonReinforcementsDenied) {
      gubGarrisonReinforcementsDenied = <UINT8[]>(<unknown>null);
    }
    DeleteAllStrategicEventsOfType(Enum132.EVENT_EVALUATE_QUEEN_SITUATION);
  }

  export function OkayForEnemyToMoveThroughSector(ubSectorID: UINT8): boolean {
    let pSector: SECTORINFO;
    pSector = SectorInfo[ubSectorID];
    if (
      pSector.uiTimeLastPlayerLiberated &&
      pSector.uiTimeLastPlayerLiberated + gubHoursGracePeriod * 3600 >
        GetWorldTotalSeconds()
    ) {
      return false;
    }
    return true;
  }

  function EnemyPermittedToAttackSector(
    pGroup: Pointer<GROUP> | null,
    ubSectorID: UINT8,
  ): boolean {
    let pSector: SECTORINFO;
    let fPermittedToAttack: boolean = true;

    pSector = SectorInfo[ubSectorID];
    fPermittedToAttack = OkayForEnemyToMoveThroughSector(ubSectorID);
    if (pGroup && pGroup.value && pSector.ubGarrisonID != NO_GARRISON) {
      if (gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID) {
        let pPendingGroup: GROUP;
        pPendingGroup = GetGroup(
          gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID,
        );
        if (pPendingGroup == pGroup.value) {
          if (fPermittedToAttack) {
            if (GroupAtFinalDestination(pGroup.value)) {
              // High priority reinforcements have arrived.  This overrides most other situations.
              return true;
            }
          } else {
            // Reassign the group
            ReassignAIGroup(pGroup);
          }
        }
      }
    }
    if (!fPermittedToAttack) {
      return false;
    }
    // If Hill-billies are alive, then enemy won't attack the sector.
    switch (ubSectorID) {
      case Enum123.SEC_F10:
        // Hill-billy farm -- not until hill billies are dead.
        if (CheckFact(273, 0)) return false;
        break;
      case Enum123.SEC_A9:
      case Enum123.SEC_A10:
        // Omerta -- not until Day 2 at 7:45AM.
        if (GetWorldTotalMin() < 3345) return false;
        break;
      case Enum123.SEC_B13:
      case Enum123.SEC_C13:
      case Enum123.SEC_D13:
        // Drassen -- not until Day 3 at 6:30AM.
        if (GetWorldTotalMin() < 4710) return false;
        break;
      case Enum123.SEC_C5:
      case Enum123.SEC_C6:
      case Enum123.SEC_D5:
        // San Mona -- not until Kingpin is dead.
        if (CheckFact(Enum170.FACT_KINGPIN_DEAD, 0) == false) return false;
      case Enum123.SEC_G1:
        if (
          PlayerSectorDefended(Enum123.SEC_G2) &&
          (PlayerSectorDefended(Enum123.SEC_H1) ||
            PlayerSectorDefended(Enum123.SEC_H2))
        ) {
          return false;
        }
        break;
      case Enum123.SEC_H2:
        if (
          PlayerSectorDefended(Enum123.SEC_H2) &&
          (PlayerSectorDefended(Enum123.SEC_G1) ||
            PlayerSectorDefended(Enum123.SEC_G2))
        ) {
          return false;
        }
        break;
    }
    return true;
  }

  function HandlePlayerGroupNoticedByPatrolGroup(
    pPlayerGroup: GROUP,
    pEnemyGroup: GROUP,
  ): boolean {
    let usDefencePoints: UINT16 = 0;
    let usOffensePoints: UINT16;
    let ubSectorID: UINT8;

    ubSectorID = SECTOR(pPlayerGroup.ubSectorX, pPlayerGroup.ubSectorY);
    usOffensePoints =
      (<ENEMYGROUP>pEnemyGroup.pEnemyGroup).ubNumAdmins * 2 +
      (<ENEMYGROUP>pEnemyGroup.pEnemyGroup).ubNumTroops * 4 +
      (<ENEMYGROUP>pEnemyGroup.pEnemyGroup).ubNumElites * 6;
    if (
      PlayerForceTooStrong(
        ubSectorID,
        usOffensePoints,
        createPointer(
          () => usDefencePoints,
          (v) => (usDefencePoints = v),
        ),
      )
    ) {
      RequestAttackOnSector(ubSectorID, usDefencePoints);
      return false;
    }
    // For now, automatically attack.
    if (pPlayerGroup.ubNextX) {
      MoveSAIGroupToSector(
        createPointer(
          () => pEnemyGroup,
          (v) => (pEnemyGroup = v),
        ),
        SECTOR(pPlayerGroup.ubNextX, pPlayerGroup.ubNextY),
        Enum172.DIRECT,
        Enum184.PURSUIT,
      );
    } else {
      MoveSAIGroupToSector(
        createPointer(
          () => pEnemyGroup,
          (v) => (pEnemyGroup = v),
        ),
        SECTOR(pPlayerGroup.ubSectorX, pPlayerGroup.ubSectorY),
        Enum172.DIRECT,
        Enum184.PURSUIT,
      );
    }
    return true;
  }

  function HandlePlayerGroupNoticedByGarrison(
    pPlayerGroup: GROUP,
    ubSectorID: UINT8,
  ): void {
    let pSector: SECTORINFO;
    let pGroup: GROUP;
    let iReinforcementsApproved: INT32;
    let usOffensePoints: UINT16;
    let usDefencePoints: UINT16 = 0;
    let ubEnemies: UINT8;
    pSector = SectorInfo[ubSectorID];
    // First check to see if the player is at his final destination.
    if (!GroupAtFinalDestination(pPlayerGroup)) {
      return;
    }
    usOffensePoints =
      pSector.ubNumAdmins * 2 +
      pSector.ubNumTroops * 4 +
      pSector.ubNumElites * 6;
    if (
      PlayerForceTooStrong(
        ubSectorID,
        usOffensePoints,
        createPointer(
          () => usDefencePoints,
          (v) => (usDefencePoints = v),
        ),
      )
    ) {
      RequestAttackOnSector(ubSectorID, usDefencePoints);
      return;
    }

    if (pSector.ubGarrisonID != NO_GARRISON) {
      // Decide whether or not they will attack them with some of the troops.
      ubEnemies =
        pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
      iReinforcementsApproved = Math.trunc(
        ubEnemies -
          gArmyComp[gGarrisonGroup[pSector.ubGarrisonID].ubComposition]
            .bDesiredPopulation /
            2,
      );
      if (
        iReinforcementsApproved * 2 > pPlayerGroup.ubGroupSize * 3 &&
        iReinforcementsApproved > gubMinEnemyGroupSize
      ) {
        // Then enemy's available outnumber the player by at least 3:2, so attack them.
        pGroup = CreateNewEnemyGroupDepartingFromSector(
          ubSectorID,
          0,
          iReinforcementsApproved,
          0,
        );

        ConvertGroupTroopsToComposition(
          pGroup,
          gGarrisonGroup[pSector.ubGarrisonID].ubComposition,
        );

        MoveSAIGroupToSector(
          createPointer(
            () => pGroup,
            (v) => (pGroup = v),
          ),
          SECTOR(pPlayerGroup.ubSectorX, pPlayerGroup.ubSectorY),
          Enum172.DIRECT,
          Enum184.REINFORCEMENTS,
        );

        RemoveSoldiersFromGarrisonBasedOnComposition(
          pSector.ubGarrisonID,
          pGroup.ubGroupSize,
        );

        if (
          pSector.ubNumTroops + pSector.ubNumElites + pSector.ubNumAdmins >
          MAX_STRATEGIC_TEAM_SIZE
        ) {
        }
      }
    }
  }

  function HandleMilitiaNoticedByPatrolGroup(
    ubSectorID: UINT8,
    pEnemyGroup: GROUP,
  ): boolean {
    // For now, automatically attack.
    let usOffensePoints: UINT16;
    let usDefencePoints: UINT16 = 0;
    let ubSectorX: UINT8 = (ubSectorID % 16) + 1;
    let ubSectorY: UINT8 = Math.trunc(ubSectorID / 16) + 1;
    usOffensePoints =
      (<ENEMYGROUP>pEnemyGroup.pEnemyGroup).ubNumAdmins * 2 +
      (<ENEMYGROUP>pEnemyGroup.pEnemyGroup).ubNumTroops * 4 +
      (<ENEMYGROUP>pEnemyGroup.pEnemyGroup).ubNumElites * 6;
    if (
      PlayerForceTooStrong(
        ubSectorID,
        usOffensePoints,
        createPointer(
          () => usDefencePoints,
          (v) => (usDefencePoints = v),
        ),
      )
    ) {
      RequestAttackOnSector(ubSectorID, usDefencePoints);
      return false;
    }

    MoveSAIGroupToSector(
      createPointer(
        () => pEnemyGroup,
        (v) => (pEnemyGroup = v),
      ),
      SECTOR(ubSectorX, ubSectorY),
      Enum172.DIRECT,
      Enum184.REINFORCEMENTS,
    );

    return false;
  }

  function AttemptToNoticeEmptySectorSucceeds(): boolean {
    if (gubNumAwareBattles || gfAutoAIAware) {
      // The queen is in high-alert and is searching for players.  All adjacent checks will automatically succeed.
      return true;
    }
    if (DayTime()) {
      // Day time chances are normal
      if (Chance(giArmyAlertness)) {
        giArmyAlertness -= giArmyAlertnessDecay;
        // Minimum alertness should always be at least 0.
        giArmyAlertness = Math.max(0, giArmyAlertness);
        return true;
      }
      giArmyAlertness++;
      return false;
    }
    // Night time chances are one third of normal.
    if (Chance(Math.trunc(giArmyAlertness / 3))) {
      giArmyAlertness -= giArmyAlertnessDecay;
      // Minimum alertness should always be at least 0.
      giArmyAlertness = Math.max(0, giArmyAlertness);
      return true;
    }
    if (Chance(33)) {
      giArmyAlertness++;
    }
    return false;
  }

  // Calling the function assumes that a player group is found to be adjacent to an enemy group.
  // This uses the alertness rating to emulate the chance that the group will notice.  If it does
  // notice, then the alertness drops accordingly to simulate a period of time where the enemy would
  // not notice as much.  If it fails, the alertness gradually increases until it succeeds.
  function AttemptToNoticeAdjacentGroupSucceeds(): boolean {
    if (gubNumAwareBattles || gfAutoAIAware) {
      // The queen is in high-alert and is searching for players.  All adjacent checks will automatically succeed.
      return true;
    }
    if (DayTime()) {
      // Day time chances are normal
      if (Chance(giArmyAlertness)) {
        giArmyAlertness -= giArmyAlertnessDecay;
        // Minimum alertness should always be at least 0.
        giArmyAlertness = Math.max(0, giArmyAlertness);
        return true;
      }
      giArmyAlertness++;
      return false;
    }
    // Night time chances are one third of normal.
    if (Chance(Math.trunc(giArmyAlertness / 3))) {
      giArmyAlertness -= giArmyAlertnessDecay;
      // Minimum alertness should always be at least 0.
      giArmyAlertness = Math.max(0, giArmyAlertness);
      return true;
    }
    if (Chance(33)) {
      giArmyAlertness++;
    }
    return false;
  }

  function HandleEmptySectorNoticedByPatrolGroup(
    pGroup: GROUP,
    ubEmptySectorID: UINT8,
  ): boolean {
    let ubGarrisonID: UINT8;
    let ubSectorX: UINT8 = (ubEmptySectorID % 16) + 1;
    let ubSectorY: UINT8 = Math.trunc(ubEmptySectorID / 16) + 1;

    ubGarrisonID = SectorInfo[ubEmptySectorID].ubGarrisonID;
    if (ubGarrisonID != NO_GARRISON) {
      if (gGarrisonGroup[ubGarrisonID].ubPendingGroupID) {
        return false;
      }
    } else {
      return false;
    }

    // Clear the patrol group's previous orders.
    ClearPreviousAIGroupAssignment(pGroup);

    gGarrisonGroup[ubGarrisonID].ubPendingGroupID = pGroup.ubGroupID;
    MoveSAIGroupToSector(
      createPointer(
        () => pGroup,
        (v) => (pGroup = v),
      ),
      SECTOR(ubSectorX, ubSectorY),
      Enum172.DIRECT,
      Enum184.REINFORCEMENTS,
    );

    return true;
  }

  function HandleEmptySectorNoticedByGarrison(
    ubGarrisonSectorID: UINT8,
    ubEmptySectorID: UINT8,
  ): void {
    let pSector: SECTORINFO;
    let pGroup: GROUP;
    let ubAvailableTroops: UINT8;
    let ubSrcGarrisonID: UINT8 = 255;
    let ubDstGarrisonID: UINT8 = 255;

    // Make sure that the destination sector doesn't already have a pending group.
    pSector = SectorInfo[ubEmptySectorID];

    ubSrcGarrisonID = SectorInfo[ubGarrisonSectorID].ubGarrisonID;
    ubDstGarrisonID = SectorInfo[ubEmptySectorID].ubGarrisonID;

    if (ubSrcGarrisonID == NO_GARRISON || ubDstGarrisonID == NO_GARRISON) {
      // Bad logic
      return;
    }

    if (gGarrisonGroup[ubDstGarrisonID].ubPendingGroupID) {
      // A group is already on-route, so don't send anybody from here.
      return;
    }

    // An opportunity has arisen, where the enemy has noticed an important sector that is undefended.
    pSector = SectorInfo[ubGarrisonSectorID];
    ubAvailableTroops =
      pSector.ubNumTroops + pSector.ubNumElites + pSector.ubNumAdmins;

    if (ubAvailableTroops >= gubMinEnemyGroupSize * 2) {
      // split group into two groups, and move one of the groups to the next sector.
      pGroup = CreateNewEnemyGroupDepartingFromSector(
        ubGarrisonSectorID,
        0,
        Math.trunc(ubAvailableTroops / 2),
        0,
      );
      ConvertGroupTroopsToComposition(
        pGroup,
        gGarrisonGroup[ubDstGarrisonID].ubComposition,
      );
      RemoveSoldiersFromGarrisonBasedOnComposition(
        ubSrcGarrisonID,
        pGroup.ubGroupSize,
      );
      gGarrisonGroup[ubDstGarrisonID].ubPendingGroupID = pGroup.ubGroupID;
      MoveSAIGroupToSector(
        createPointer(
          () => pGroup,
          (v) => (pGroup = v),
        ),
        ubEmptySectorID,
        Enum172.DIRECT,
        Enum184.REINFORCEMENTS,
      );
    }
  }

  function ReinforcementsApproved(
    iGarrisonID: INT32,
    pusDefencePoints: Pointer<UINT16>,
  ): boolean {
    let pSector: SECTORINFO;
    let usOffensePoints: UINT16;
    let ubSectorX: UINT8;
    let ubSectorY: UINT8;

    pSector = SectorInfo[gGarrisonGroup[iGarrisonID].ubSectorID];
    ubSectorX = SECTORX(gGarrisonGroup[iGarrisonID].ubSectorID);
    ubSectorY = SECTORY(gGarrisonGroup[iGarrisonID].ubSectorID);

    pusDefencePoints.value =
      pSector.ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] * 1 +
      pSector.ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] * 2 +
      pSector.ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA] * 3 +
      PlayerMercsInSector(ubSectorX, ubSectorY, 0) * 4;
    usOffensePoints =
      gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition].bAdminPercentage *
        2 +
      gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition].bTroopPercentage *
        3 +
      gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition].bElitePercentage *
        4 +
      gubGarrisonReinforcementsDenied[iGarrisonID];
    usOffensePoints = Math.trunc(
      (usOffensePoints *
        gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition]
          .bDesiredPopulation) /
        100,
    );

    if (usOffensePoints > pusDefencePoints.value) {
      return true;
    }
    // Before returning false, determine if reinforcements have been denied repeatedly.  If so, then
    // we might send an augmented force to take it back.
    if (
      gubGarrisonReinforcementsDenied[iGarrisonID] + usOffensePoints >
      pusDefencePoints.value
    ) {
      return true;
    }
    // Reinforcements will have to wait.  For now, increase the reinforcements denied.  The amount increase is 20 percent
    // of the garrison's priority.
    gubGarrisonReinforcementsDenied[iGarrisonID] += Math.trunc(
      gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition].bPriority / 2,
    );

    return false;
  }

  // if the group has arrived in a sector, and doesn't have any particular orders, then
  // send him back where they came from.
  // RETURNS TRUE if the group is deleted or told to move somewhere else.
  // This is important as the calling function will need
  // to abort processing of the group for obvious reasons.
  function EvaluateGroupSituation(pGroup: GROUP): boolean {
    let pSector: SECTORINFO;
    let pPatrolGroup: GROUP;
    let i: INT32;

    ValidateWeights(2);

    if (!gfQueenAIAwake) {
      return false;
    }
    Assert(!pGroup.fPlayer);
    Assert(pGroup.pEnemyGroup);
    if (pGroup.pEnemyGroup.ubIntention == Enum184.PURSUIT) {
      // Lost the player group that he was going to attack.  Return to original position.
      ReassignAIGroup(
        createPointer(
          () => pGroup,
          (v) => (pGroup = v),
        ),
      );
      return true;
    } else if (pGroup.pEnemyGroup.ubIntention == Enum184.REINFORCEMENTS) {
      // The group has arrived at the location where he is supposed to reinforce.
      // Step 1 -- Check for matching garrison location
      for (i = 0; i < giGarrisonArraySize; i++) {
        if (
          gGarrisonGroup[i].ubSectorID ==
            SECTOR(pGroup.ubSectorX, pGroup.ubSectorY) &&
          gGarrisonGroup[i].ubPendingGroupID == pGroup.ubGroupID
        ) {
          pSector = SectorInfo[SECTOR(pGroup.ubSectorX, pGroup.ubSectorY)];

          if (gGarrisonGroup[i].ubSectorID != Enum123.SEC_P3) {
            EliminateSurplusTroopsForGarrison(pGroup, pSector);
            pSector.ubNumAdmins =
              pSector.ubNumAdmins + pGroup.pEnemyGroup.ubNumAdmins;
            pSector.ubNumTroops =
              pSector.ubNumTroops + pGroup.pEnemyGroup.ubNumTroops;
            pSector.ubNumElites =
              pSector.ubNumElites + pGroup.pEnemyGroup.ubNumElites;

            if (IsThisSectorASAMSector(pGroup.ubSectorX, pGroup.ubSectorY, 0)) {
              StrategicMap[
                pGroup.ubSectorX + pGroup.ubSectorY * MAP_WORLD_X
              ].bSAMCondition = 100;
              UpdateSAMDoneRepair(pGroup.ubSectorX, pGroup.ubSectorY, 0);
            }
          } else {
            // The group was sent back to the queen's palace (probably because they couldn't be reassigned
            // anywhere else, but it is possible that the queen's sector is requesting the reinforcements.  In
            // any case, if the queen's sector is less than full strength, fill it up first, then
            // simply add the rest to the global pool.
            if (pSector.ubNumElites < MAX_STRATEGIC_TEAM_SIZE) {
              if (
                pSector.ubNumElites + pGroup.ubGroupSize >=
                MAX_STRATEGIC_TEAM_SIZE
              ) {
                // Fill up the queen's guards, then apply the rest to the reinforcement pool
                giReinforcementPool +=
                  MAX_STRATEGIC_TEAM_SIZE - pSector.ubNumElites;
                pSector.ubNumElites = MAX_STRATEGIC_TEAM_SIZE;
              } else {
                // Add all the troops to the queen's guard.
                pSector.ubNumElites += pGroup.ubGroupSize;
              }
            } else {
              // Add all the troops to the reinforcement pool as the queen's guard is at full strength.
              giReinforcementPool += pGroup.ubGroupSize;
            }
          }

          SetThisSectorAsEnemyControlled(
            pGroup.ubSectorX,
            pGroup.ubSectorY,
            0,
            true,
          );
          RemovePGroup(pGroup);
          RecalculateGarrisonWeight(i);

          return true;
        }
      }
      // Step 2 -- Check for Patrol groups matching waypoint index.
      for (i = 0; i < giPatrolArraySize; i++) {
        if (
          gPatrolGroup[i].ubSectorID[1] ==
            SECTOR(pGroup.ubSectorX, pGroup.ubSectorY) &&
          gPatrolGroup[i].ubPendingGroupID == pGroup.ubGroupID
        ) {
          gPatrolGroup[i].ubPendingGroupID = 0;
          if (
            gPatrolGroup[i].ubGroupID &&
            gPatrolGroup[i].ubGroupID != pGroup.ubGroupID
          ) {
            // cheat, and warp our reinforcements to them!
            pPatrolGroup = GetGroup(gPatrolGroup[i].ubGroupID);
            Assert(pPatrolGroup.pEnemyGroup);
            pPatrolGroup.pEnemyGroup.ubNumTroops +=
              pGroup.pEnemyGroup.ubNumTroops;
            pPatrolGroup.pEnemyGroup.ubNumElites +=
              pGroup.pEnemyGroup.ubNumElites;
            pPatrolGroup.pEnemyGroup.ubNumAdmins +=
              pGroup.pEnemyGroup.ubNumAdmins;
            pPatrolGroup.ubGroupSize +=
              pGroup.pEnemyGroup.ubNumTroops +
              pGroup.pEnemyGroup.ubNumElites +
              pGroup.pEnemyGroup.ubNumAdmins;
            if (pPatrolGroup.ubGroupSize > MAX_STRATEGIC_TEAM_SIZE) {
              let ubCut: UINT8;
              // truncate the group size.
              ubCut = pPatrolGroup.ubGroupSize - MAX_STRATEGIC_TEAM_SIZE;
              while (ubCut--) {
                if (pGroup.pEnemyGroup.ubNumAdmins) {
                  pGroup.pEnemyGroup.ubNumAdmins--;
                  pPatrolGroup.pEnemyGroup.ubNumAdmins--;
                } else if (pGroup.pEnemyGroup.ubNumTroops) {
                  pGroup.pEnemyGroup.ubNumTroops--;
                  pPatrolGroup.pEnemyGroup.ubNumTroops--;
                } else if (pGroup.pEnemyGroup.ubNumElites) {
                  pGroup.pEnemyGroup.ubNumElites--;
                  pPatrolGroup.pEnemyGroup.ubNumElites--;
                }
              }
              pPatrolGroup.ubGroupSize = MAX_STRATEGIC_TEAM_SIZE;
              Assert(
                pPatrolGroup.pEnemyGroup.ubNumAdmins +
                  pPatrolGroup.pEnemyGroup.ubNumTroops +
                  pPatrolGroup.pEnemyGroup.ubNumElites ==
                  MAX_STRATEGIC_TEAM_SIZE,
              );
            }
            RemovePGroup(pGroup);
            RecalculatePatrolWeight(i);
            ValidateLargeGroup(pPatrolGroup);
          } else {
            // the reinforcements have become the new patrol group (even if same group)
            gPatrolGroup[i].ubGroupID = pGroup.ubGroupID;
            pGroup.pEnemyGroup.ubIntention = Enum184.PATROL;
            pGroup.ubMoveType = Enum185.ENDTOEND_FORWARDS;
            RemovePGroupWaypoints(pGroup);
            AddWaypointIDToPGroup(pGroup, gPatrolGroup[i].ubSectorID[0]);
            AddWaypointIDToPGroup(pGroup, gPatrolGroup[i].ubSectorID[1]);
            if (gPatrolGroup[i].ubSectorID[2]) {
              // Add optional waypoints if included.
              AddWaypointIDToPGroup(pGroup, gPatrolGroup[i].ubSectorID[2]);
              if (gPatrolGroup[i].ubSectorID[3])
                AddWaypointIDToPGroup(pGroup, gPatrolGroup[i].ubSectorID[3]);
            }

            // Otherwise, the engine assumes they are being deployed.
            // pGroup->fWaypointsCancelled = FALSE;

            RecalculatePatrolWeight(i);
          }
          return true;
        }
      }
    } else {
      // This is a floating group at his final destination...
      if (
        pGroup.pEnemyGroup.ubIntention != Enum184.STAGING &&
        pGroup.pEnemyGroup.ubIntention != Enum184.REINFORCEMENTS
      ) {
        ReassignAIGroup(
          createPointer(
            () => pGroup,
            (v) => (pGroup = v),
          ),
        );
        return true;
      }
    }
    ValidateWeights(3);
    return false;
  }

  // returns TRUE if the group was deleted.
  export function StrategicAILookForAdjacentGroups(pGroup: GROUP): boolean {
    let pSector: SECTORINFO;
    let pEnemyGroup: GROUP | null;
    let pEnemyGroup__Pointer = createPointer(
      () => <GROUP>pEnemyGroup,
      (v) => (pEnemyGroup = v),
    );
    let pPlayerGroup: GROUP | null;
    let ubNumEnemies: UINT8;
    let ubSectorID: UINT8;
    if (!gfQueenAIAwake) {
      // The queen isn't aware the player's presence yet, so she is oblivious to any situations.

      if (!pGroup.fPlayer) {
        // Exception case!
        // In the beginning of the game, a group is sent to A9 after the first battle.  If you leave A9, when they arrive,
        // they will stay there indefinately because the AI isn't awake.  What we do, is if this is a group in A9, then
        // send them home.
        if (GroupAtFinalDestination(pGroup)) {
          // Wake up the queen now, if she hasn't woken up already.
          WakeUpQueen();
          if (
            (pGroup.ubSectorX == 9 && pGroup.ubSectorY == 1) ||
            (pGroup.ubSectorX == 3 && pGroup.ubSectorY == 16)
          ) {
            SendGroupToPool(
              createPointer(
                () => pGroup,
                (v) => (pGroup = v),
              ),
            );
            if (!pGroup) {
              // Group was transferred to the pool
              return true;
            }
          }
        }
      }

      if (!gfQueenAIAwake) {
        return false;
      }
    }
    if (!pGroup.fPlayer) {
      // The enemy group has arrived at a new sector and now controls it.
      // Look in each of the four directions, and the alertness rating will
      // determine the chance to detect any players that may exist in that sector.
      pEnemyGroup = pGroup;
      if (GroupAtFinalDestination(pEnemyGroup)) {
        return EvaluateGroupSituation(pEnemyGroup);
      }
      ubSectorID = SECTOR(pEnemyGroup.ubSectorX, pEnemyGroup.ubSectorY);
      if (
        pEnemyGroup &&
        pEnemyGroup.ubSectorY > 1 &&
        EnemyPermittedToAttackSector(pEnemyGroup__Pointer, ubSectorID - 16)
      ) {
        pPlayerGroup = FindMovementGroupInSector(
          pEnemyGroup.ubSectorX,
          pEnemyGroup.ubSectorY - 1,
          true,
        );
        if (pPlayerGroup && AttemptToNoticeAdjacentGroupSucceeds()) {
          return HandlePlayerGroupNoticedByPatrolGroup(
            pPlayerGroup,
            pEnemyGroup,
          );
        } else if (
          CountAllMilitiaInSector(
            pEnemyGroup.ubSectorX,
            pEnemyGroup.ubSectorY - 1,
          ) &&
          AttemptToNoticeAdjacentGroupSucceeds()
        ) {
          return HandleMilitiaNoticedByPatrolGroup(
            SECTOR(pEnemyGroup.ubSectorX, pEnemyGroup.ubSectorY - 1),
            pEnemyGroup,
          );
        } else if (
          AdjacentSectorIsImportantAndUndefended(ubSectorID - 16) &&
          AttemptToNoticeEmptySectorSucceeds()
        ) {
          return HandleEmptySectorNoticedByPatrolGroup(
            pEnemyGroup,
            ubSectorID - 16,
          );
        }
      }
      if (
        pEnemyGroup &&
        pEnemyGroup.ubSectorX > 1 &&
        EnemyPermittedToAttackSector(pEnemyGroup__Pointer, ubSectorID - 1)
      ) {
        pPlayerGroup = FindMovementGroupInSector(
          pEnemyGroup.ubSectorX - 1,
          pEnemyGroup.ubSectorY,
          true,
        );
        if (pPlayerGroup && AttemptToNoticeAdjacentGroupSucceeds()) {
          return HandlePlayerGroupNoticedByPatrolGroup(
            pPlayerGroup,
            pEnemyGroup,
          );
        } else if (
          CountAllMilitiaInSector(
            pEnemyGroup.ubSectorX - 1,
            pEnemyGroup.ubSectorY,
          ) &&
          AttemptToNoticeAdjacentGroupSucceeds()
        ) {
          return HandleMilitiaNoticedByPatrolGroup(
            SECTOR(pEnemyGroup.ubSectorX - 1, pEnemyGroup.ubSectorY),
            pEnemyGroup,
          );
        } else if (
          AdjacentSectorIsImportantAndUndefended(ubSectorID - 1) &&
          AttemptToNoticeEmptySectorSucceeds()
        ) {
          return HandleEmptySectorNoticedByPatrolGroup(
            pEnemyGroup,
            ubSectorID - 1,
          );
        }
      }
      if (
        pEnemyGroup &&
        pEnemyGroup.ubSectorY < 16 &&
        EnemyPermittedToAttackSector(pEnemyGroup__Pointer, ubSectorID + 16)
      ) {
        pPlayerGroup = FindMovementGroupInSector(
          pEnemyGroup.ubSectorX,
          pEnemyGroup.ubSectorY + 1,
          true,
        );
        if (pPlayerGroup && AttemptToNoticeAdjacentGroupSucceeds()) {
          return HandlePlayerGroupNoticedByPatrolGroup(
            pPlayerGroup,
            pEnemyGroup,
          );
        } else if (
          CountAllMilitiaInSector(
            pEnemyGroup.ubSectorX,
            pEnemyGroup.ubSectorY + 1,
          ) &&
          AttemptToNoticeAdjacentGroupSucceeds()
        ) {
          return HandleMilitiaNoticedByPatrolGroup(
            SECTOR(pEnemyGroup.ubSectorX, pEnemyGroup.ubSectorY + 1),
            pEnemyGroup,
          );
        } else if (
          AdjacentSectorIsImportantAndUndefended(ubSectorID + 16) &&
          AttemptToNoticeEmptySectorSucceeds()
        ) {
          return HandleEmptySectorNoticedByPatrolGroup(
            pEnemyGroup,
            ubSectorID + 16,
          );
        }
      }
      if (
        pEnemyGroup &&
        pEnemyGroup.ubSectorX < 16 &&
        EnemyPermittedToAttackSector(pEnemyGroup__Pointer, ubSectorID + 1)
      ) {
        pPlayerGroup = FindMovementGroupInSector(
          pEnemyGroup.ubSectorX + 1,
          pEnemyGroup.ubSectorY,
          true,
        );
        if (pPlayerGroup && AttemptToNoticeAdjacentGroupSucceeds()) {
          return HandlePlayerGroupNoticedByPatrolGroup(
            pPlayerGroup,
            pEnemyGroup,
          );
        } else if (
          CountAllMilitiaInSector(
            pEnemyGroup.ubSectorX + 1,
            pEnemyGroup.ubSectorY,
          ) &&
          AttemptToNoticeAdjacentGroupSucceeds()
        ) {
          return HandleMilitiaNoticedByPatrolGroup(
            SECTOR(pEnemyGroup.ubSectorX + 1, pEnemyGroup.ubSectorY),
            pEnemyGroup,
          );
        } else if (
          AdjacentSectorIsImportantAndUndefended(ubSectorID + 1) &&
          AttemptToNoticeEmptySectorSucceeds()
        ) {
          return HandleEmptySectorNoticedByPatrolGroup(
            pEnemyGroup,
            ubSectorID + 1,
          );
        }
      }
      if (!pEnemyGroup) {
        // group deleted.
        return true;
      }
    } else {
      // The player group has arrived at a new sector and now controls it.
      // Look in each of the four directions, and the enemy alertness rating will
      // determine if the enemy notices that the player is here.
      // Additionally, there are also stationary enemy groups that may also notice the
      // player's new presence.
      // NOTE:  Always returns false because it is the player group that we are handling.  We
      //       don't mess with the player group here!
      pPlayerGroup = pGroup;
      if (pPlayerGroup.ubSectorZ) return false;
      if (
        !EnemyPermittedToAttackSector(
          null,
          SECTOR(pPlayerGroup.ubSectorX, pPlayerGroup.ubSectorY),
        )
      )
        return false;
      if (pPlayerGroup.ubSectorY > 1) {
        pEnemyGroup = FindMovementGroupInSector(
          pPlayerGroup.ubSectorX,
          pPlayerGroup.ubSectorY - 1,
          false,
        );
        if (pEnemyGroup && AttemptToNoticeAdjacentGroupSucceeds()) {
          HandlePlayerGroupNoticedByPatrolGroup(pPlayerGroup, pEnemyGroup);
          return false;
        }
        pSector =
          SectorInfo[
            SECTOR(pPlayerGroup.ubSectorX, pPlayerGroup.ubSectorY - 1)
          ];
        ubNumEnemies =
          pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
        if (
          ubNumEnemies &&
          pSector.ubGarrisonID != NO_GARRISON &&
          AttemptToNoticeAdjacentGroupSucceeds()
        ) {
          HandlePlayerGroupNoticedByGarrison(
            pPlayerGroup,
            SECTOR(pPlayerGroup.ubSectorX, pPlayerGroup.ubSectorY - 1),
          );
          return false;
        }
      }
      if (pPlayerGroup.ubSectorX < 16) {
        pEnemyGroup = FindMovementGroupInSector(
          pPlayerGroup.ubSectorX + 1,
          pPlayerGroup.ubSectorY,
          false,
        );
        if (pEnemyGroup && AttemptToNoticeAdjacentGroupSucceeds()) {
          HandlePlayerGroupNoticedByPatrolGroup(pPlayerGroup, pEnemyGroup);
          return false;
        }
        pSector =
          SectorInfo[
            SECTOR(pPlayerGroup.ubSectorX - 1, pPlayerGroup.ubSectorY)
          ];
        ubNumEnemies =
          pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
        if (
          ubNumEnemies &&
          pSector.ubGarrisonID != NO_GARRISON &&
          AttemptToNoticeAdjacentGroupSucceeds()
        ) {
          HandlePlayerGroupNoticedByGarrison(
            pPlayerGroup,
            SECTOR(pPlayerGroup.ubSectorX - 1, pPlayerGroup.ubSectorY),
          );
          return false;
        }
      }
      if (pPlayerGroup.ubSectorY < 16) {
        pEnemyGroup = FindMovementGroupInSector(
          pPlayerGroup.ubSectorX,
          pPlayerGroup.ubSectorY + 1,
          false,
        );
        if (pEnemyGroup && AttemptToNoticeAdjacentGroupSucceeds()) {
          HandlePlayerGroupNoticedByPatrolGroup(pPlayerGroup, pEnemyGroup);
          return false;
        }
        pSector =
          SectorInfo[
            SECTOR(pPlayerGroup.ubSectorX, pPlayerGroup.ubSectorY + 1)
          ];
        ubNumEnemies =
          pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
        if (
          ubNumEnemies &&
          pSector.ubGarrisonID != NO_GARRISON &&
          AttemptToNoticeAdjacentGroupSucceeds()
        ) {
          HandlePlayerGroupNoticedByGarrison(
            pPlayerGroup,
            SECTOR(pPlayerGroup.ubSectorX, pPlayerGroup.ubSectorY + 1),
          );
          return false;
        }
      }
      if (pPlayerGroup.ubSectorX > 1) {
        pEnemyGroup = FindMovementGroupInSector(
          pPlayerGroup.ubSectorX - 1,
          pPlayerGroup.ubSectorY,
          false,
        );
        if (pEnemyGroup && AttemptToNoticeAdjacentGroupSucceeds()) {
          HandlePlayerGroupNoticedByPatrolGroup(pPlayerGroup, pEnemyGroup);
          return false;
        }
        pSector =
          SectorInfo[
            SECTOR(pPlayerGroup.ubSectorX + 1, pPlayerGroup.ubSectorY)
          ];
        ubNumEnemies =
          pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
        if (
          ubNumEnemies &&
          pSector.ubGarrisonID != NO_GARRISON &&
          AttemptToNoticeAdjacentGroupSucceeds()
        ) {
          HandlePlayerGroupNoticedByGarrison(
            pPlayerGroup,
            SECTOR(pPlayerGroup.ubSectorX + 1, pPlayerGroup.ubSectorY),
          );
          return false;
        }
      }
    }
    return false;
  }

  // This is called periodically for each enemy occupied sector containing garrisons.
  export function CheckEnemyControlledSector(ubSectorID: UINT8): void {
    let pSector: SECTORINFO;
    let ubSectorX: UINT8;
    let ubSectorY: UINT8;
    if (!gfQueenAIAwake) {
      return;
    }
    // First, determine if the sector is still owned by the enemy.
    pSector = SectorInfo[ubSectorID];
    if (pSector.ubGarrisonID != NO_GARRISON) {
      if (gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID) {
        // Look for a staging group.
        let pGroup: GROUP | null;
        pGroup = GetGroup(
          gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID,
        );
        if (pGroup) {
          // We have a staging group
          if (GroupAtFinalDestination(pGroup)) {
            Assert(pGroup.pEnemyGroup);
            if (pGroup.pEnemyGroup.ubPendingReinforcements) {
              if (pGroup.pEnemyGroup.ubPendingReinforcements > 4) {
                let ubNum: UINT8 = 3 + Random(3);
                pGroup.pEnemyGroup.ubNumTroops += ubNum;
                pGroup.ubGroupSize += ubNum;
                pGroup.pEnemyGroup.ubPendingReinforcements -= ubNum;
                RecalculateGroupWeight(pGroup);
                ValidateLargeGroup(pGroup);
              } else {
                pGroup.pEnemyGroup.ubNumTroops +=
                  pGroup.pEnemyGroup.ubPendingReinforcements;
                pGroup.ubGroupSize +=
                  pGroup.pEnemyGroup.ubPendingReinforcements;
                pGroup.pEnemyGroup.ubPendingReinforcements = 0;
                ValidateLargeGroup(pGroup);
              }
              // RequestHighPriorityStagingGroupReinforcements( pGroup );
            } else if (
              SECTOR(pGroup.ubSectorX, pGroup.ubSectorY) !=
              gGarrisonGroup[pSector.ubGarrisonID].ubSectorID
            ) {
              MoveSAIGroupToSector(
                createPointer(
                  () => <GROUP>pGroup,
                  (v) => (pGroup = v),
                ),
                gGarrisonGroup[pSector.ubGarrisonID].ubSectorID,
                Enum172.DIRECT,
                pGroup.pEnemyGroup.ubIntention,
              );
            }
          }
          // else the group is on route to stage hopefully...
        }
      }
    }
    if (pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites) {
      // The sector is still controlled, so look around to see if there are any players nearby.
      ubSectorX = SECTORX(ubSectorID);
      ubSectorY = SECTORY(ubSectorID);
      if (
        ubSectorY > 1 &&
        EnemyPermittedToAttackSector(null, ubSectorID - 16)
      ) {
        /*
      pPlayerGroup = FindMovementGroupInSector( ubSectorX, (UINT8)(ubSectorY-1), TRUE );
      if( pPlayerGroup && AttemptToNoticeAdjacentGroupSucceeds() )
      {
              HandlePlayerGroupNoticedByGarrison( pPlayerGroup, ubSectorID );
              return;
      }
      else
      */
        if (
          AdjacentSectorIsImportantAndUndefended(ubSectorID - 16) &&
          AttemptToNoticeEmptySectorSucceeds()
        ) {
          HandleEmptySectorNoticedByGarrison(ubSectorID, ubSectorID - 16);
          return;
        }
      }
      if (
        ubSectorX < 16 &&
        EnemyPermittedToAttackSector(null, ubSectorID + 1)
      ) {
        /*
      pPlayerGroup = FindMovementGroupInSector( (UINT8)(ubSectorX+1), ubSectorY, TRUE );
      if( pPlayerGroup && AttemptToNoticeAdjacentGroupSucceeds() )
      {
              HandlePlayerGroupNoticedByGarrison( pPlayerGroup, ubSectorID );
              return;
      }
      else
      */
        if (
          AdjacentSectorIsImportantAndUndefended(ubSectorID + 1) &&
          AttemptToNoticeEmptySectorSucceeds()
        ) {
          HandleEmptySectorNoticedByGarrison(ubSectorID, ubSectorID + 1);
          return;
        }
      }
      if (
        ubSectorY < 16 &&
        EnemyPermittedToAttackSector(null, ubSectorID + 16)
      ) {
        /*
      pPlayerGroup = FindMovementGroupInSector( ubSectorX, (UINT8)(ubSectorY+1), TRUE );
      if( pPlayerGroup && AttemptToNoticeAdjacentGroupSucceeds() )
      {
              HandlePlayerGroupNoticedByGarrison( pPlayerGroup, ubSectorID );
              return;
      }
      else
      */
        if (
          AdjacentSectorIsImportantAndUndefended(ubSectorID + 16) &&
          AttemptToNoticeEmptySectorSucceeds()
        ) {
          HandleEmptySectorNoticedByGarrison(ubSectorID, ubSectorID + 16);
          return;
        }
      }
      if (ubSectorX > 1 && EnemyPermittedToAttackSector(null, ubSectorID - 1)) {
        /*
      pPlayerGroup = FindMovementGroupInSector( (UINT8)(ubSectorX-1), ubSectorY, TRUE );
      if( pPlayerGroup && AttemptToNoticeAdjacentGroupSucceeds() )
      {
              HandlePlayerGroupNoticedByGarrison( pPlayerGroup, ubSectorID );
              return;
      }
      else
      */
        if (
          AdjacentSectorIsImportantAndUndefended(ubSectorID - 1) &&
          AttemptToNoticeEmptySectorSucceeds()
        ) {
          HandleEmptySectorNoticedByGarrison(ubSectorID, ubSectorID - 1);
          return;
        }
      }
    }
  }

  export function RemoveGroupFromStrategicAILists(ubGroupID: UINT8): void {
    let i: INT32;
    for (i = 0; i < giPatrolArraySize; i++) {
      if (gPatrolGroup[i].ubGroupID == ubGroupID) {
        // Patrol group was destroyed.
        gPatrolGroup[i].ubGroupID = 0;
        RecalculatePatrolWeight(i);
        return;
      }
      if (gPatrolGroup[i].ubPendingGroupID == ubGroupID) {
        // Group never arrived to reinforce.
        gPatrolGroup[i].ubPendingGroupID = 0;
        return;
      }
    }
    for (i = 0; i < giGarrisonArraySize; i++) {
      if (gGarrisonGroup[i].ubPendingGroupID == ubGroupID) {
        // Group never arrived to reinforce.
        gGarrisonGroup[i].ubPendingGroupID = 0;
        return;
      }
    }
  }

  function RecalculatePatrolWeight(iPatrolID: INT32): void {
    let pGroup: GROUP;
    let iWeight: INT32;
    let iPrevWeight: INT32;
    let iNeedPopulation: INT32;

    ValidateWeights(4);

    // First, remove the previous weight from the applicable field.
    iPrevWeight = gPatrolGroup[iPatrolID].bWeight;
    if (iPrevWeight > 0) giRequestPoints -= iPrevWeight;

    if (gPatrolGroup[iPatrolID].ubGroupID) {
      pGroup = GetGroup(gPatrolGroup[iPatrolID].ubGroupID);
      iNeedPopulation = gPatrolGroup[iPatrolID].bSize - pGroup.ubGroupSize;
      if (iNeedPopulation < 0) {
        gPatrolGroup[iPatrolID].bWeight = 0;
        ValidateWeights(27);
        return;
      }
    } else {
      iNeedPopulation = gPatrolGroup[iPatrolID].bSize;
    }
    iWeight = Math.trunc(
      (iNeedPopulation * 3 * gPatrolGroup[iPatrolID].bPriority) / 96,
    );
    iWeight = Math.min(2, iWeight);
    gPatrolGroup[iPatrolID].bWeight = iWeight;
    giRequestPoints += iWeight;

    ValidateWeights(5);
  }

  function RecalculateGarrisonWeight(iGarrisonID: INT32): void {
    let pSector: SECTORINFO;
    let iWeight: INT32;
    let iPrevWeight: INT32;
    let iDesiredPop: INT32;
    let iCurrentPop: INT32;
    let iPriority: INT32;

    ValidateWeights(6);

    pSector = SectorInfo[gGarrisonGroup[iGarrisonID].ubSectorID];
    iDesiredPop =
      gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition].bDesiredPopulation;
    iCurrentPop =
      pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
    iPriority = gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition].bPriority;

    // First, remove the previous weight from the applicable field.
    iPrevWeight = gGarrisonGroup[iGarrisonID].bWeight;
    if (iPrevWeight > 0) giRequestPoints -= iPrevWeight;
    else if (iPrevWeight < 0) giReinforcementPoints += iPrevWeight;

    // Calculate weight (range is -20 to +20 before multiplier).
    // The multiplier of 3 brings it to a range of -96 to +96 which is
    // close enough to a plus/minus 100%.  The resultant percentage is then
    // converted based on the priority.
    iWeight = (iDesiredPop - iCurrentPop) * 3;
    if (iWeight > 0) {
      // modify it by it's priority.
      // generates a value between 2 and 100
      iWeight = Math.trunc((iWeight * iPriority) / 96);
      iWeight = Math.max(iWeight, 2);
      giRequestPoints += iWeight;
    } else if (iWeight < 0) {
      // modify it by it's reverse priority
      // generates a value between -2 and -100
      iWeight = Math.trunc((iWeight * (100 - iPriority)) / 96);
      iWeight = Math.min(iWeight, -2);
      giReinforcementPoints -= iWeight;
    }

    gGarrisonGroup[iGarrisonID].bWeight = iWeight;

    ValidateWeights(7);
  }

  export function RecalculateSectorWeight(ubSectorID: UINT8): void {
    let i: INT32;
    for (i = 0; i < giGarrisonArraySize; i++) {
      if (gGarrisonGroup[i].ubSectorID == ubSectorID) {
        RecalculateGarrisonWeight(i);
        return;
      }
    }
  }

  export function RecalculateGroupWeight(pGroup: GROUP): void {
    let i: INT32;
    for (i = 0; i < giPatrolArraySize; i++) {
      if (gPatrolGroup[i].ubGroupID == pGroup.ubGroupID) {
        if (!pGroup.ubGroupSize) {
          TagSAIGroupWithGracePeriod(pGroup);
          gPatrolGroup[i].ubGroupID = 0;
        }
        RecalculatePatrolWeight(i);
        return;
      }
    }
  }

  function ChooseSuitableGarrisonToProvideReinforcements(
    iDstGarrisonID: INT32,
    iReinforcementsRequested: INT32,
  ): INT32 {
    let iSrcGarrisonID: INT32;
    let iBestGarrisonID: INT32 = NO_GARRISON;
    let iReinforcementsAvailable: INT32;
    let i: INT32;
    let iRandom: INT32;
    let iWeight: INT32;
    let bBestWeight: INT8;
    let ubSectorID: UINT8;

    // Check to see if we could send reinforcements from Alma.  Only Drassen/Cambria get preferred
    // service from Alma, due to it's proximity and Alma's purpose as a forward military base.
    ubSectorID = gGarrisonGroup[iDstGarrisonID].ubSectorID;
    switch (ubSectorID) {
      case Enum123.SEC_B13:
      case Enum123.SEC_C13:
      case Enum123.SEC_D13:
      case Enum123.SEC_D15: // Drassen + nearby SAM site
      case Enum123.SEC_F8:
      case Enum123.SEC_F9:
      case Enum123.SEC_G8:
      case Enum123.SEC_G9:
      case Enum123.SEC_H8: // Cambria
        // reinforcements will be primarily sent from Alma whenever possible.

        // find which the first sector that contains Alma soldiers.
        for (i = 0; i < giGarrisonArraySize; i++) {
          if (gGarrisonGroup[i].ubComposition == Enum174.ALMA_DEFENCE) break;
        }
        iSrcGarrisonID = i;
        // which of these 4 Alma garrisons have the most reinforcements available?  It is
        // possible that none of these garrisons can provide any reinforcements.
        bBestWeight = 0;
        for (i = iSrcGarrisonID; i < iSrcGarrisonID + 4; i++) {
          RecalculateGarrisonWeight(i);
          if (
            bBestWeight > gGarrisonGroup[i].bWeight &&
            GarrisonCanProvideMinimumReinforcements(i)
          ) {
            bBestWeight = gGarrisonGroup[i].bWeight;
            iBestGarrisonID = i;
          }
        }
        // If we can provide reinforcements from Alma, then make sure that it can provide at least 67% of
        // the requested reinforcements.
        if (bBestWeight < 0) {
          iReinforcementsAvailable = ReinforcementsAvailable(iBestGarrisonID);
          if (iReinforcementsAvailable * 100 >= iReinforcementsRequested * 67) {
            // This is the approved group to provide the reinforcements.
            return iBestGarrisonID;
          }
        }
        break;
    }

    // The Alma case either wasn't applicable or failed to have the right reinforcements.  Do a general weighted search.
    iRandom = Random(giReinforcementPoints);
    for (
      iSrcGarrisonID = 0;
      iSrcGarrisonID < giGarrisonArraySize;
      iSrcGarrisonID++
    ) {
      // go through the garrisons
      RecalculateGarrisonWeight(iSrcGarrisonID);
      iWeight = -gGarrisonGroup[iSrcGarrisonID].bWeight;
      if (iWeight > 0) {
        // if group is able to provide reinforcements.
        if (
          iRandom < iWeight &&
          GarrisonCanProvideMinimumReinforcements(iSrcGarrisonID)
        ) {
          iReinforcementsAvailable = ReinforcementsAvailable(iSrcGarrisonID);
          if (iReinforcementsAvailable * 100 >= iReinforcementsRequested * 67) {
            // This is the approved group to provide the reinforcements.
            return iSrcGarrisonID;
          }
        }
        iRandom -= iWeight;
      }
    }

    // So far we have failed on all accounts.  Now, simply process all the garrisons, and return the first garrison that can
    // provide the reinforcements.
    for (
      iSrcGarrisonID = 0;
      iSrcGarrisonID < giGarrisonArraySize;
      iSrcGarrisonID++
    ) {
      // go through the garrisons
      RecalculateGarrisonWeight(iSrcGarrisonID);
      iWeight = -gGarrisonGroup[iSrcGarrisonID].bWeight;
      if (
        iWeight > 0 &&
        GarrisonCanProvideMinimumReinforcements(iSrcGarrisonID)
      ) {
        // if group is able to provide reinforcements.
        iReinforcementsAvailable = ReinforcementsAvailable(iSrcGarrisonID);
        if (iReinforcementsAvailable * 100 >= iReinforcementsRequested * 67) {
          // This is the approved group to provide the reinforcements.
          return iSrcGarrisonID;
        }
      }
    }

    // Well, if we get this far, the queen must be low on troops.  Send whatever we can.
    iRandom = Random(giReinforcementPoints);
    for (
      iSrcGarrisonID = 0;
      iSrcGarrisonID < giGarrisonArraySize;
      iSrcGarrisonID++
    ) {
      // go through the garrisons
      RecalculateGarrisonWeight(iSrcGarrisonID);
      iWeight = -gGarrisonGroup[iSrcGarrisonID].bWeight;
      if (
        iWeight > 0 &&
        GarrisonCanProvideMinimumReinforcements(iSrcGarrisonID)
      ) {
        // if group is able to provide reinforcements.
        if (iRandom < iWeight) {
          iReinforcementsAvailable = ReinforcementsAvailable(iSrcGarrisonID);
          return iSrcGarrisonID;
        }
        iRandom -= iWeight;
      }
    }

    // Failed completely.
    return -1;
  }

  function SendReinforcementsForGarrison(
    iDstGarrisonID: INT32,
    usDefencePoints: UINT16,
    pOptionalGroup: Pointer<GROUP> | null,
  ): void {
    let pSector: SECTORINFO | null;
    let iChance: INT32;
    let iRandom: INT32;
    let iSrcGarrisonID: INT32;
    let iMaxReinforcementsAllowed: INT32;
    let iReinforcementsAvailable: INT32;
    let iReinforcementsRequested: INT32;
    let iReinforcementsApproved: INT32;
    let pGroup: GROUP;
    let ubSrcSectorX: UINT8;
    let ubSrcSectorY: UINT8;
    let ubDstSectorX: UINT8;
    let ubDstSectorY: UINT8;
    let ubNumExtraReinforcements: UINT8;
    let ubGroupSize: UINT8;
    let fLimitMaxTroopsAllowable: boolean = false;

    ValidateWeights(8);

    if (
      gGarrisonGroup[iDstGarrisonID].ubSectorID == Enum123.SEC_B13 ||
      gGarrisonGroup[iDstGarrisonID].ubSectorID == Enum123.SEC_C13 ||
      gGarrisonGroup[iDstGarrisonID].ubSectorID == Enum123.SEC_D13
    ) {
      pSector = null;
    }
    pSector = SectorInfo[gGarrisonGroup[iDstGarrisonID].ubSectorID];
    // Determine how many units the garrison needs.
    ({
      iReinforcementsRequested,
      ubExtraReinforcements: ubNumExtraReinforcements,
    } = GarrisonReinforcementsRequested(iDstGarrisonID));

    // The maximum number of reinforcements can't be offsetted past a certain point based on the
    // priority of the garrison.
    iMaxReinforcementsAllowed = // from 1 to 3 times the desired size of the normal force.
      gArmyComp[gGarrisonGroup[iDstGarrisonID].ubComposition]
        .bDesiredPopulation +
      Math.trunc(
        (gArmyComp[gGarrisonGroup[iDstGarrisonID].ubComposition]
          .bDesiredPopulation *
          gArmyComp[gGarrisonGroup[iDstGarrisonID].ubComposition].bPriority) /
          50,
      );

    if (
      iReinforcementsRequested + ubNumExtraReinforcements >
      iMaxReinforcementsAllowed
    ) {
      // adjust the extra reinforcements so that it doesn't exceed the maximum allowed.
      fLimitMaxTroopsAllowable = true;
      ubNumExtraReinforcements =
        iMaxReinforcementsAllowed - iReinforcementsRequested;
    }

    iReinforcementsRequested += ubNumExtraReinforcements;

    if (iReinforcementsRequested <= 0) {
      ValidateWeights(9);
      return;
    }

    ubDstSectorX = SECTORX(gGarrisonGroup[iDstGarrisonID].ubSectorID);
    ubDstSectorY = SECTORY(gGarrisonGroup[iDstGarrisonID].ubSectorID);

    if (pOptionalGroup && pOptionalGroup.value) {
      // This group will provide the reinforcements
      pGroup = pOptionalGroup.value;

      gGarrisonGroup[iDstGarrisonID].ubPendingGroupID = pGroup.ubGroupID;
      ConvertGroupTroopsToComposition(
        pGroup,
        gGarrisonGroup[iDstGarrisonID].ubComposition,
      );
      MoveSAIGroupToSector(
        pOptionalGroup,
        gGarrisonGroup[iDstGarrisonID].ubSectorID,
        Enum172.STAGE,
        Enum184.REINFORCEMENTS,
      );

      ValidateWeights(10);

      return;
    }

    function QueenPool() {
      // KM : Sep 9, 1999
      // If the player owns sector P3, any troops that spawned there were causing serious problems, seeing battle checks
      // were not performed!
      if (!StrategicMap[CALCULATE_STRATEGIC_INDEX(3, 16)].fEnemyControlled) {
        // Queen can no longer send reinforcements from the palace if she doesn't control it!
        return;
      }

      if (!giReinforcementPool) {
        ValidateWeights(11);
        return;
      }
      iReinforcementsApproved = Math.min(
        iReinforcementsRequested,
        giReinforcementPool,
      );

      if (iReinforcementsApproved * 3 < usDefencePoints) {
        // The enemy force that would be sent would likely be decimated by the player forces.
        gubGarrisonReinforcementsDenied[iDstGarrisonID] += Math.trunc(
          gArmyComp[gGarrisonGroup[iDstGarrisonID].ubComposition].bPriority / 2,
        );
        ValidateWeights(12);
        return;
      } else {
        // The force is strong enough to be able to take the sector.
        gubGarrisonReinforcementsDenied[iDstGarrisonID] = 0;
      }

      // The chance she will send them is related with the strength difference between the
      // player's force and the queen's.
      if (
        ubNumExtraReinforcements &&
        fLimitMaxTroopsAllowable &&
        iReinforcementsApproved == iMaxReinforcementsAllowed
      ) {
        iChance = Math.trunc(
          ((iReinforcementsApproved + ubNumExtraReinforcements) * 100) /
            usDefencePoints,
        );
        if (!Chance(iChance)) {
          ValidateWeights(13);
          return;
        }
      }

      pGroup = CreateNewEnemyGroupDepartingFromSector(
        Enum123.SEC_P3,
        0,
        iReinforcementsApproved,
        0,
      );
      ConvertGroupTroopsToComposition(
        pGroup,
        gGarrisonGroup[iDstGarrisonID].ubComposition,
      );
      pGroup.ubOriginalSector = SECTOR(ubDstSectorX, ubDstSectorY);
      giReinforcementPool -= iReinforcementsApproved;
      pGroup.ubMoveType = Enum185.ONE_WAY;
      gGarrisonGroup[iDstGarrisonID].ubPendingGroupID = pGroup.ubGroupID;

      ubGroupSize =
        (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumTroops +
        (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumElites +
        (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumAdmins;

      if (ubNumExtraReinforcements) {
        MoveSAIGroupToSector(
          createPointer(
            () => pGroup,
            (v) => (pGroup = v),
          ),
          gGarrisonGroup[iDstGarrisonID].ubSectorID,
          Enum172.STAGE,
          Enum184.STAGING,
        );
      } else {
        MoveSAIGroupToSector(
          createPointer(
            () => pGroup,
            (v) => (pGroup = v),
          ),
          gGarrisonGroup[iDstGarrisonID].ubSectorID,
          Enum172.STAGE,
          Enum184.REINFORCEMENTS,
        );
      }
      ValidateWeights(14);
    }

    iRandom = Random(giReinforcementPoints + giReinforcementPool);
    if (iRandom < giReinforcementPool) {
      // use the pool and send the requested amount from SECTOR P3 (queen's palace)
      QueenPool();
      return;
    } else {
      iSrcGarrisonID = ChooseSuitableGarrisonToProvideReinforcements(
        iDstGarrisonID,
        iReinforcementsRequested,
      );
      if (iSrcGarrisonID == -1) {
        ValidateWeights(15);
        QueenPool();
        return;
      }

      ubSrcSectorX = (gGarrisonGroup[iSrcGarrisonID].ubSectorID % 16) + 1;
      ubSrcSectorY =
        Math.trunc(gGarrisonGroup[iSrcGarrisonID].ubSectorID / 16) + 1;
      if (
        ubSrcSectorX != gWorldSectorX ||
        ubSrcSectorY != gWorldSectorY ||
        gbWorldSectorZ > 0
      ) {
        // The reinforcements aren't coming from the currently loaded sector!
        iReinforcementsAvailable = ReinforcementsAvailable(iSrcGarrisonID);
        if (iReinforcementsAvailable <= 0) {
          SAIReportError(
            "Attempting to send reinforcements from a garrison that doesn't have any! -- KM:0 (with prior saved game and strategic decisions.txt)",
          );
          return;
        }
        // Send the lowest of the two:  number requested or number available

        iReinforcementsApproved = Math.min(
          iReinforcementsRequested,
          iReinforcementsAvailable,
        );
        if (
          iReinforcementsApproved >
          iMaxReinforcementsAllowed - ubNumExtraReinforcements
        ) {
          // The force isn't strong enough, but the queen isn't willing to apply extra resources
          iReinforcementsApproved =
            iMaxReinforcementsAllowed - ubNumExtraReinforcements;
        } else if (
          (iReinforcementsApproved + ubNumExtraReinforcements) * 3 <
          usDefencePoints
        ) {
          // The enemy force that would be sent would likely be decimated by the player forces.
          gubGarrisonReinforcementsDenied[iDstGarrisonID] += Math.trunc(
            gArmyComp[gGarrisonGroup[iDstGarrisonID].ubComposition].bPriority /
              2,
          );
          ValidateWeights(17);
          return;
        } else {
          // The force is strong enough to be able to take the sector.
          gubGarrisonReinforcementsDenied[iDstGarrisonID] = 0;
        }

        // The chance she will send them is related with the strength difference between the
        // player's force and the queen's.
        if (
          iReinforcementsApproved + ubNumExtraReinforcements ==
            iMaxReinforcementsAllowed &&
          usDefencePoints
        ) {
          iChance = Math.trunc(
            ((iReinforcementsApproved + ubNumExtraReinforcements) * 100) /
              usDefencePoints,
          );
          if (!Chance(iChance)) {
            ValidateWeights(18);
            return;
          }
        }

        pGroup = CreateNewEnemyGroupDepartingFromSector(
          gGarrisonGroup[iSrcGarrisonID].ubSectorID,
          0,
          iReinforcementsApproved,
          0,
        );
        ConvertGroupTroopsToComposition(
          pGroup,
          gGarrisonGroup[iDstGarrisonID].ubComposition,
        );
        RemoveSoldiersFromGarrisonBasedOnComposition(
          iSrcGarrisonID,
          pGroup.ubGroupSize,
        );
        pGroup.ubOriginalSector = SECTOR(ubDstSectorX, ubDstSectorY);
        pGroup.ubMoveType = Enum185.ONE_WAY;
        gGarrisonGroup[iDstGarrisonID].ubPendingGroupID = pGroup.ubGroupID;
        ubGroupSize =
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumTroops +
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumElites +
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumAdmins;

        if (ubNumExtraReinforcements) {
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubPendingReinforcements =
            ubNumExtraReinforcements;

          MoveSAIGroupToSector(
            createPointer(
              () => pGroup,
              (v) => (pGroup = v),
            ),
            gGarrisonGroup[iDstGarrisonID].ubSectorID,
            Enum172.STAGE,
            Enum184.STAGING,
          );
        } else {
          MoveSAIGroupToSector(
            createPointer(
              () => pGroup,
              (v) => (pGroup = v),
            ),
            gGarrisonGroup[iDstGarrisonID].ubSectorID,
            Enum172.STAGE,
            Enum184.REINFORCEMENTS,
          );
        }

        ValidateWeights(19);
        return;
      }
    }
    ValidateWeights(20);
  }

  function SendReinforcementsForPatrol(
    iPatrolID: INT32,
    pOptionalGroup: Pointer<GROUP> | null,
  ): void {
    let pGroup: GROUP;
    let iRandom: INT32;
    let iSrcGarrisonID: INT32;
    let iWeight: INT32;
    let iReinforcementsAvailable: INT32;
    let iReinforcementsRequested: INT32;
    let iReinforcementsApproved: INT32;
    let ubSrcSectorX: UINT8;
    let ubSrcSectorY: UINT8;
    let ubDstSectorX: UINT8;
    let ubDstSectorY: UINT8;

    ValidateWeights(21);

    // Determine how many units the patrol group needs.
    iReinforcementsRequested = PatrolReinforcementsRequested(iPatrolID);

    if (iReinforcementsRequested <= 0) return;

    ubDstSectorX = (gPatrolGroup[iPatrolID].ubSectorID[1] % 16) + 1;
    ubDstSectorY = Math.trunc(gPatrolGroup[iPatrolID].ubSectorID[1] / 16) + 1;

    if (pOptionalGroup && pOptionalGroup.value) {
      // This group will provide the reinforcements
      pGroup = pOptionalGroup.value;

      gPatrolGroup[iPatrolID].ubPendingGroupID = pGroup.ubGroupID;

      MoveSAIGroupToSector(
        pOptionalGroup,
        gPatrolGroup[iPatrolID].ubSectorID[1],
        Enum172.EVASIVE,
        Enum184.REINFORCEMENTS,
      );

      ValidateWeights(22);
      return;
    }
    iRandom = Random(giReinforcementPoints + giReinforcementPool);
    if (iRandom < giReinforcementPool) {
      // use the pool and send the requested amount from SECTOR P3 (queen's palace)
      iReinforcementsApproved = Math.min(
        iReinforcementsRequested,
        giReinforcementPool,
      );
      if (!iReinforcementsApproved) {
        iReinforcementsApproved = iReinforcementsApproved;
      }
      pGroup = CreateNewEnemyGroupDepartingFromSector(
        Enum123.SEC_P3,
        0,
        iReinforcementsApproved,
        0,
      );
      pGroup.ubOriginalSector = SECTOR(ubDstSectorX, ubDstSectorY);
      giReinforcementPool -= iReinforcementsApproved;

      gPatrolGroup[iPatrolID].ubPendingGroupID = pGroup.ubGroupID;

      MoveSAIGroupToSector(
        createPointer(
          () => pGroup,
          (v) => (pGroup = v),
        ),
        gPatrolGroup[iPatrolID].ubSectorID[1],
        Enum172.EVASIVE,
        Enum184.REINFORCEMENTS,
      );

      ValidateWeights(23);
      return;
    } else {
      iRandom -= giReinforcementPool;
      for (
        iSrcGarrisonID = 0;
        iSrcGarrisonID < giGarrisonArraySize;
        iSrcGarrisonID++
      ) {
        // go through the garrisons
        RecalculateGarrisonWeight(iSrcGarrisonID);
        iWeight = -gGarrisonGroup[iSrcGarrisonID].bWeight;
        if (iWeight > 0) {
          // if group is able to provide reinforcements.
          if (iRandom < iWeight) {
            // This is the group that gets the reinforcements!
            ubSrcSectorX = SECTORX(gGarrisonGroup[iSrcGarrisonID].ubSectorID);
            ubSrcSectorY = SECTORY(gGarrisonGroup[iSrcGarrisonID].ubSectorID);
            if (
              ubSrcSectorX != gWorldSectorX ||
              ubSrcSectorY != gWorldSectorY ||
              gbWorldSectorZ > 0
            ) {
              // The reinforcements aren't coming from the currently loaded sector!
              iReinforcementsAvailable =
                ReinforcementsAvailable(iSrcGarrisonID);
              // Send the lowest of the two:  number requested or number available
              iReinforcementsApproved = Math.min(
                iReinforcementsRequested,
                iReinforcementsAvailable,
              );
              pGroup = CreateNewEnemyGroupDepartingFromSector(
                gGarrisonGroup[iSrcGarrisonID].ubSectorID,
                0,
                iReinforcementsApproved,
                0,
              );
              pGroup.ubOriginalSector = SECTOR(ubDstSectorX, ubDstSectorY);
              gPatrolGroup[iPatrolID].ubPendingGroupID = pGroup.ubGroupID;

              RemoveSoldiersFromGarrisonBasedOnComposition(
                iSrcGarrisonID,
                pGroup.ubGroupSize,
              );

              MoveSAIGroupToSector(
                createPointer(
                  () => pGroup,
                  (v) => (pGroup = v),
                ),
                gPatrolGroup[iPatrolID].ubSectorID[1],
                Enum172.EVASIVE,
                Enum184.REINFORCEMENTS,
              );

              ValidateWeights(24);

              return;
            }
          }
          iRandom -= iWeight;
        }
      }
    }
    ValidateWeights(25);
  }

  // Periodically does a general poll and check on each of the groups and garrisons, determines
  // reinforcements, new patrol groups, planned assaults, etc.
  export function EvaluateQueenSituation(): void {
    let i: INT32;
    let iRandom: INT32;
    let iWeight: INT32;
    let uiOffset: UINT32;
    let usDefencePoints: UINT16 = 0;
    let usDefencePoints__Pointer = createPointer(
      () => usDefencePoints,
      (v) => (usDefencePoints = v),
    );
    let iOrigRequestPoints: INT32;
    let iSumOfAllWeights: INT32 = 0;

    ValidateWeights(26);

    // figure out how long it shall be before we call this again

    // The more work to do there is (request points the queen's army is asking for), the more often she will make decisions
    // This can increase the decision intervals by up to 500 extra minutes (> 8 hrs)
    uiOffset = Math.max(100 - giRequestPoints, 0);
    uiOffset = uiOffset + Random(uiOffset * 4);
    switch (gGameOptions.ubDifficultyLevel) {
      case Enum9.DIF_LEVEL_EASY:
        uiOffset +=
          EASY_TIME_EVALUATE_IN_MINUTES + Random(EASY_TIME_EVALUATE_VARIANCE);
        break;
      case Enum9.DIF_LEVEL_MEDIUM:
        uiOffset +=
          NORMAL_TIME_EVALUATE_IN_MINUTES +
          Random(NORMAL_TIME_EVALUATE_VARIANCE);
        break;
      case Enum9.DIF_LEVEL_HARD:
        uiOffset +=
          HARD_TIME_EVALUATE_IN_MINUTES + Random(HARD_TIME_EVALUATE_VARIANCE);
        break;
    }

    if (!giReinforcementPool) {
      // Queen has run out of reinforcements.  Simulate recruiting and training new troops
      uiOffset *= 10;
      giReinforcementPool += 30;
      AddStrategicEvent(
        Enum132.EVENT_EVALUATE_QUEEN_SITUATION,
        GetWorldTotalMin() + uiOffset,
        0,
      );
      return;
    }

    // Re-post the event
    AddStrategicEvent(
      Enum132.EVENT_EVALUATE_QUEEN_SITUATION,
      GetWorldTotalMin() + uiOffset,
      0,
    );

    // if the queen hasn't been alerted to player's presence yet
    if (!gfQueenAIAwake) {
      // no decisions can be made yet.
      return;
    }

    // Adjust queen's disposition based on player's progress
    EvolveQueenPriorityPhase(false);

    // Gradually promote any remaining admins into troops
    UpgradeAdminsToTroops();

    if (
      giRequestPoints <= 0 ||
      (giReinforcementPoints <= 0 && giReinforcementPool <= 0)
    ) {
      // we either have no reinforcements or request for reinforcements.
      return;
    }

    // now randomly choose who gets the reinforcements.
    // giRequestPoints is the combined sum of all the individual weights of all garrisons and patrols requesting reinforcements
    iRandom = Random(giRequestPoints);

    iOrigRequestPoints = giRequestPoints; // debug only!

    // go through garrisons first
    for (i = 0; i < giGarrisonArraySize; i++) {
      RecalculateGarrisonWeight(i);
      iWeight = gGarrisonGroup[i].bWeight;
      if (iWeight > 0) {
        // if group is requesting reinforcements.

        iSumOfAllWeights += iWeight; // debug only!

        if (
          iRandom < iWeight &&
          !gGarrisonGroup[i].ubPendingGroupID &&
          EnemyPermittedToAttackSector(null, gGarrisonGroup[i].ubSectorID) &&
          GarrisonRequestingMinimumReinforcements(i)
        ) {
          // This is the group that gets the reinforcements!
          if (ReinforcementsApproved(i, usDefencePoints__Pointer)) {
            SendReinforcementsForGarrison(i, usDefencePoints, null);
          } else {
          }
          return;
        }
        iRandom -= iWeight;
      }
    }

    // go through the patrol groups
    for (i = 0; i < giPatrolArraySize; i++) {
      RecalculatePatrolWeight(i);
      iWeight = gPatrolGroup[i].bWeight;
      if (iWeight > 0) {
        iSumOfAllWeights += iWeight; // debug only!

        if (
          iRandom < iWeight &&
          !gPatrolGroup[i].ubPendingGroupID &&
          PatrolRequestingMinimumReinforcements(i)
        ) {
          // This is the group that gets the reinforcements!
          SendReinforcementsForPatrol(i, null);
          return;
        }
        iRandom -= iWeight;
      }
    }

    ValidateWeights(27);
  }

  export function SaveStrategicAI(hFile: HWFILE): boolean {
    let gTempGarrisonGroup: GARRISON_GROUP = createGarrisonGroup();
    let gTempPatrolGroup: PATROL_GROUP = createPatrolGroup();
    let gTempArmyComp: ARMY_COMPOSITION = createArmyComposition();
    let uiNumBytesWritten: UINT32;
    let i: INT32;
    let buffer: Buffer;

    buffer = Buffer.allocUnsafe(4);

    writeIntArray(gbPadding2, buffer, 0, 1);
    uiNumBytesWritten = FileWrite(hFile, buffer, 3);
    if (uiNumBytesWritten != 3) return false;

    buffer.writeUInt8(Number(gfExtraElites), 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 1);
    if (uiNumBytesWritten != 1) return false;

    buffer.writeInt32LE(giGarrisonArraySize, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) return false;

    buffer.writeInt32LE(giPatrolArraySize, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) return false;

    buffer.writeInt32LE(giReinforcementPool, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) return false;

    buffer.writeInt32LE(giForcePercentage, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) return false;

    buffer.writeInt32LE(giArmyAlertness, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) return false;

    buffer.writeInt32LE(giArmyAlertnessDecay, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) return false;

    buffer.writeUInt8(Number(gfQueenAIAwake), 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 1);
    if (uiNumBytesWritten != 1) return false;

    buffer.writeInt32LE(giReinforcementPoints, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) return false;

    buffer.writeInt32LE(giRequestPoints, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) return false;

    buffer.writeUInt8(gubNumAwareBattles, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 1);
    if (uiNumBytesWritten != 1) return false;

    buffer.writeUInt8(gubSAIVersion, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 1);
    if (uiNumBytesWritten != 1) return false;

    buffer.writeUInt8(gubQueenPriorityPhase, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 1);
    if (uiNumBytesWritten != 1) return false;

    buffer.writeUInt8(Number(gfFirstBattleMeanwhileScenePending), 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 1);
    if (uiNumBytesWritten != 1) return false;

    buffer.writeUInt8(Number(gfMassFortificationOrdered), 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 1);
    if (uiNumBytesWritten != 1) return false;

    buffer.writeUInt8(gubMinEnemyGroupSize, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 1);
    if (uiNumBytesWritten != 1) return false;

    buffer.writeUInt8(gubHoursGracePeriod, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 1);
    if (uiNumBytesWritten != 1) return false;

    buffer.writeUInt16LE(gusPlayerBattleVictories, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 2);
    if (uiNumBytesWritten != 2) return false;

    buffer.writeUInt8(Number(gfUseAlternateQueenPosition), 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 1);
    if (uiNumBytesWritten != 1) return false;

    buffer = Buffer.allocUnsafe(SAI_PADDING_BYTES);
    writeIntArray(gbPadding, buffer, 0, 1);
    uiNumBytesWritten = FileWrite(hFile, buffer, SAI_PADDING_BYTES);
    if (uiNumBytesWritten != SAI_PADDING_BYTES) return false;

    // Save the army composition (which does get modified)
    buffer = Buffer.allocUnsafe(
      Enum174.NUM_ARMY_COMPOSITIONS * ARMY_COMPOSITION_SIZE,
    );
    writeObjectArray(gArmyComp, buffer, 0, writeArmyComposition);
    uiNumBytesWritten = FileWrite(
      hFile,
      buffer,
      Enum174.NUM_ARMY_COMPOSITIONS * ARMY_COMPOSITION_SIZE,
    );
    if (
      uiNumBytesWritten !=
      Enum174.NUM_ARMY_COMPOSITIONS * ARMY_COMPOSITION_SIZE
    )
      return false;

    i = SAVED_ARMY_COMPOSITIONS - Enum174.NUM_ARMY_COMPOSITIONS;
    buffer = Buffer.allocUnsafe(ARMY_COMPOSITION_SIZE);
    writeArmyComposition(gTempArmyComp, buffer, 0);
    while (i--) {
      uiNumBytesWritten = FileWrite(hFile, buffer, ARMY_COMPOSITION_SIZE);
      if (uiNumBytesWritten != ARMY_COMPOSITION_SIZE) return false;
    }

    // Save the patrol group definitions
    buffer = Buffer.allocUnsafe(giPatrolArraySize * PATROL_GROUP_SIZE);
    writeObjectArray(gPatrolGroup, buffer, 0, writePatrolGroup);
    uiNumBytesWritten = FileWrite(
      hFile,
      buffer,
      giPatrolArraySize * PATROL_GROUP_SIZE,
    );
    if (uiNumBytesWritten != giPatrolArraySize * PATROL_GROUP_SIZE)
      return false;

    i = SAVED_PATROL_GROUPS - giPatrolArraySize;
    buffer = Buffer.allocUnsafe(PATROL_GROUP_SIZE);
    writePatrolGroup(gTempPatrolGroup, buffer, 0);
    while (i--) {
      uiNumBytesWritten = FileWrite(hFile, buffer, PATROL_GROUP_SIZE);
      if (uiNumBytesWritten != PATROL_GROUP_SIZE) return false;
    }

    // Save the garrison information!
    buffer = Buffer.allocUnsafe(giGarrisonArraySize * GARRISON_GROUP_SIZE);
    writeObjectArray(gGarrisonGroup, buffer, 0, writeGarrisonGroup);
    uiNumBytesWritten = FileWrite(
      hFile,
      buffer,
      giGarrisonArraySize * GARRISON_GROUP_SIZE,
    );
    if (uiNumBytesWritten != giGarrisonArraySize * GARRISON_GROUP_SIZE)
      return false;

    i = SAVED_GARRISON_GROUPS - giGarrisonArraySize;
    buffer = Buffer.allocUnsafe(GARRISON_GROUP_SIZE);
    writeGarrisonGroup(gTempGarrisonGroup, buffer, 0);
    while (i--) {
      uiNumBytesWritten = FileWrite(hFile, buffer, GARRISON_GROUP_SIZE);
      if (uiNumBytesWritten != GARRISON_GROUP_SIZE) return false;
    }

    buffer = Buffer.allocUnsafe(giPatrolArraySize);
    writeIntArray(gubPatrolReinforcementsDenied, buffer, 0, 1);
    uiNumBytesWritten = FileWrite(hFile, buffer, giPatrolArraySize);
    if (uiNumBytesWritten != giPatrolArraySize) {
      return false;
    }

    buffer = Buffer.allocUnsafe(giGarrisonArraySize);
    writeIntArray(gubGarrisonReinforcementsDenied, buffer, 0, 1);
    uiNumBytesWritten = FileWrite(hFile, buffer, giGarrisonArraySize);
    if (uiNumBytesWritten != giGarrisonArraySize) {
      return false;
    }

    return true;
  }

  export function LoadStrategicAI(hFile: HWFILE): boolean {
    let pGroup: GROUP | null;
    let next: GROUP | null;
    let gTempGarrisonGroup: GARRISON_GROUP = createGarrisonGroup();
    let gTempPatrolGroup: PATROL_GROUP = createPatrolGroup();
    let gTempArmyComp: ARMY_COMPOSITION = createArmyComposition();
    let uiNumBytesRead: UINT32;
    let i: INT32;
    let ubSAIVersion: UINT8;
    let buffer: Buffer;

    buffer = Buffer.allocUnsafe(4);

    uiNumBytesRead = FileRead(hFile, buffer, 3);
    if (uiNumBytesRead != 3) return false;
    readIntArray(gbPadding2, buffer, 0, 1);

    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) return false;
    gfExtraElites = Boolean(buffer.readUInt8(0));

    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) return false;
    giGarrisonArraySize = buffer.readInt32LE(0);

    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) return false;
    giPatrolArraySize = buffer.readInt32LE(0);

    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) return false;
    giReinforcementPool = buffer.readInt32LE(0);

    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) return false;
    giForcePercentage = buffer.readInt32LE(0);

    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) return false;
    giArmyAlertness = buffer.readInt32LE(0);

    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) return false;
    giArmyAlertnessDecay = buffer.readInt32LE(0);

    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) return false;
    gfQueenAIAwake = Boolean(buffer.readUInt8(0));

    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) return false;
    giReinforcementPoints = buffer.readInt32LE(0);

    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) return false;
    giRequestPoints = buffer.readInt32LE(0);

    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) return false;
    gubNumAwareBattles = buffer.readUInt8(0);

    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) return false;
    ubSAIVersion = buffer.readUInt8(0);

    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) return false;
    gubQueenPriorityPhase = buffer.readUInt8(0);

    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) return false;
    gfFirstBattleMeanwhileScenePending = Boolean(buffer.readUInt8(0));

    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) return false;
    gfMassFortificationOrdered = Boolean(buffer.readUInt8(0));

    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) return false;
    gubMinEnemyGroupSize = buffer.readUInt8(0);

    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) return false;
    gubHoursGracePeriod = buffer.readUInt8(0);

    uiNumBytesRead = FileRead(hFile, buffer, 2);
    if (uiNumBytesRead != 2) return false;
    gusPlayerBattleVictories = buffer.readUInt16LE(0);

    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) return false;
    gfUseAlternateQueenPosition = Boolean(buffer.readUInt8(0));

    buffer = Buffer.allocUnsafe(SAI_PADDING_BYTES);
    writeIntArray(gbPadding, buffer, 0, 1);
    uiNumBytesRead = FileRead(hFile, buffer, SAI_PADDING_BYTES);
    if (uiNumBytesRead != SAI_PADDING_BYTES) return false;

    // Restore the army composition
    buffer = Buffer.allocUnsafe(
      Enum174.NUM_ARMY_COMPOSITIONS * ARMY_COMPOSITION_SIZE,
    );
    uiNumBytesRead = FileRead(
      hFile,
      buffer,
      Enum174.NUM_ARMY_COMPOSITIONS * ARMY_COMPOSITION_SIZE,
    );
    if (uiNumBytesRead != Enum174.NUM_ARMY_COMPOSITIONS * ARMY_COMPOSITION_SIZE)
      return false;
    readObjectArray(gArmyComp, buffer, 0, readArmyComposition);

    i = SAVED_ARMY_COMPOSITIONS - Enum174.NUM_ARMY_COMPOSITIONS;
    buffer = Buffer.allocUnsafe(ARMY_COMPOSITION_SIZE);
    while (i--) {
      uiNumBytesRead = FileRead(hFile, buffer, ARMY_COMPOSITION_SIZE);
      if (uiNumBytesRead != ARMY_COMPOSITION_SIZE) return false;
      readArmyComposition(gTempArmyComp, buffer, 0);
    }

    // Restore the patrol group definitions
    gPatrolGroup = createArrayFrom(giPatrolArraySize, createPatrolGroup);
    buffer = Buffer.allocUnsafe(giPatrolArraySize * PATROL_GROUP_SIZE);
    uiNumBytesRead = FileRead(
      hFile,
      buffer,
      giPatrolArraySize * PATROL_GROUP_SIZE,
    );
    if (uiNumBytesRead != giPatrolArraySize * PATROL_GROUP_SIZE) return false;
    readObjectArray(gPatrolGroup, buffer, 0, readPatrolGroup);

    i = SAVED_PATROL_GROUPS - giPatrolArraySize;
    buffer = Buffer.allocUnsafe(PATROL_GROUP_SIZE);
    while (i--) {
      uiNumBytesRead = FileRead(hFile, buffer, PATROL_GROUP_SIZE);
      if (uiNumBytesRead != PATROL_GROUP_SIZE) return false;
      readPatrolGroup(gTempPatrolGroup, buffer, 0);
    }

    gubSAIVersion = SAI_VERSION;

    // Load the garrison information!
    gGarrisonGroup = createArrayFrom(giGarrisonArraySize, createGarrisonGroup);
    buffer = Buffer.allocUnsafe(giGarrisonArraySize * GARRISON_GROUP_SIZE);
    uiNumBytesRead = FileRead(
      hFile,
      buffer,
      giGarrisonArraySize * GARRISON_GROUP_SIZE,
    );
    if (uiNumBytesRead != giGarrisonArraySize * GARRISON_GROUP_SIZE) {
      return false;
    }
    readObjectArray(gGarrisonGroup, buffer, 0, readGarrisonGroup);

    i = SAVED_GARRISON_GROUPS - giGarrisonArraySize;
    buffer = Buffer.allocUnsafe(GARRISON_GROUP_SIZE);
    while (i--) {
      uiNumBytesRead = FileRead(hFile, buffer, GARRISON_GROUP_SIZE);
      if (uiNumBytesRead != GARRISON_GROUP_SIZE) {
        return false;
      }
      readGarrisonGroup(gTempGarrisonGroup, buffer, 0);
    }

    // Load the list of reinforcement patrol points.
    gubPatrolReinforcementsDenied = createArray(giPatrolArraySize, 0);
    buffer = Buffer.allocUnsafe(giPatrolArraySize);
    uiNumBytesRead = FileRead(hFile, buffer, giPatrolArraySize);
    if (uiNumBytesRead != giPatrolArraySize) {
      return false;
    }
    readUIntArray(gubPatrolReinforcementsDenied, buffer, 0, 1);

    // Load the list of reinforcement garrison points.
    gubGarrisonReinforcementsDenied = createArray(giGarrisonArraySize, 0);
    buffer = Buffer.allocUnsafe(giGarrisonArraySize);
    uiNumBytesRead = FileRead(hFile, buffer, giGarrisonArraySize);
    if (uiNumBytesRead != giGarrisonArraySize) {
      return false;
    }
    readUIntArray(gubGarrisonReinforcementsDenied, buffer, 0, 1);

    if (ubSAIVersion < 6) {
      // Reinitialize the costs since they have changed.

      // Recreate the compositions
      copyObjectArray(gArmyComp, gOrigArmyComp, copyArmyComposition);
      EvolveQueenPriorityPhase(true);

      // Recreate the patrol desired sizes
      for (i = 0; i < giPatrolArraySize; i++) {
        gPatrolGroup[i].bSize = gOrigPatrolGroup[i].bSize;
      }
    }
    if (ubSAIVersion < 7) {
      BuildUndergroundSectorInfoList();
    }
    if (ubSAIVersion < 8) {
      ReinitializeUnvisitedGarrisons();
    }
    if (ubSAIVersion < 10) {
      for (i = 0; i < giPatrolArraySize; i++) {
        if (gPatrolGroup[i].bSize >= 16) {
          gPatrolGroup[i].bSize = 10;
        }
      }
      pGroup = gpGroupList;
      while (pGroup) {
        if (!pGroup.fPlayer && pGroup.ubGroupSize >= 16) {
          // accident in patrol groups being too large
          let ubGetRidOfXTroops: UINT8 = pGroup.ubGroupSize - 10;
          if (
            gbWorldSectorZ ||
            pGroup.ubSectorX != gWorldSectorX ||
            pGroup.ubSectorY != gWorldSectorY
          ) {
            // don't modify groups in the currently loaded sector.
            if (
              (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumTroops >= ubGetRidOfXTroops
            ) {
              (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumTroops -= ubGetRidOfXTroops;
              pGroup.ubGroupSize -= ubGetRidOfXTroops;
            }
          }
        }
        pGroup = pGroup.next;
      }
    }
    if (ubSAIVersion < 13) {
      for (i = 0; i < 255; i++) {
        SectorInfo[i].bBloodCatPlacements = 0;
        SectorInfo[i].bBloodCats = -1;
      }
      InitBloodCatSectors();
      // This info is used to clean up the two new codes inserted into the
      // middle of the enumeration for battle codes.
      if (gubEnemyEncounterCode > Enum164.CREATURE_ATTACK_CODE) {
        gubEnemyEncounterCode += 2;
      }
      if (gubExplicitEnemyEncounterCode > Enum164.CREATURE_ATTACK_CODE) {
        gubExplicitEnemyEncounterCode += 2;
      }
    }
    if (ubSAIVersion < 14) {
      let pSector: UNDERGROUND_SECTORINFO;
      pSector = <UNDERGROUND_SECTORINFO>FindUnderGroundSector(4, 11, 1);
      if (pSector.ubNumTroops + pSector.ubNumElites > 20) {
        pSector.ubNumTroops -= 2;
      }
      pSector = <UNDERGROUND_SECTORINFO>FindUnderGroundSector(3, 15, 1);
      if (pSector.ubNumTroops + pSector.ubNumElites > 20) {
        pSector.ubNumTroops -= 2;
      }
    }
    if (ubSAIVersion < 16) {
      let pSector: UNDERGROUND_SECTORINFO | null;
      pSector = FindUnderGroundSector(3, 15, 1);
      if (pSector) {
        pSector.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR;
      }
      pSector = FindUnderGroundSector(3, 16, 1);
      if (pSector) {
        pSector.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;
      }
    }
    if (ubSAIVersion < 17) {
      // Patch all groups that have this flag set
      gubNumGroupsArrivedSimultaneously = 0;
      {
        pGroup = gpGroupList;
        while (pGroup) {
          if (pGroup.uiFlags & GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY) {
            pGroup.uiFlags &= ~GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY;
          }
          pGroup = pGroup.next;
        }
      }
    }
    if (ubSAIVersion < 18) {
      // adjust down the number of bloodcats based on difficulty in the two special bloodcat levels
      switch (gGameOptions.ubDifficultyLevel) {
        case Enum9.DIF_LEVEL_EASY: // 50%
          SectorInfo[Enum123.SEC_I16].bBloodCatPlacements = 14;
          SectorInfo[Enum123.SEC_N5].bBloodCatPlacements = 13;
          SectorInfo[Enum123.SEC_I16].bBloodCats = 14;
          SectorInfo[Enum123.SEC_N5].bBloodCats = 13;
          break;
        case Enum9.DIF_LEVEL_MEDIUM: // 75%
          SectorInfo[Enum123.SEC_I16].bBloodCatPlacements = 19;
          SectorInfo[Enum123.SEC_N5].bBloodCatPlacements = 18;
          SectorInfo[Enum123.SEC_I16].bBloodCats = 19;
          SectorInfo[Enum123.SEC_N5].bBloodCats = 18;
        case Enum9.DIF_LEVEL_HARD: // 100%
          SectorInfo[Enum123.SEC_I16].bBloodCatPlacements = 26;
          SectorInfo[Enum123.SEC_N5].bBloodCatPlacements = 25;
          SectorInfo[Enum123.SEC_I16].bBloodCats = 26;
          SectorInfo[Enum123.SEC_N5].bBloodCats = 25;
          break;
      }
    }
    if (ubSAIVersion < 19) {
      // Clear the garrison in C5
      gArmyComp[
        gGarrisonGroup[SectorInfo[Enum123.SEC_C5].ubGarrisonID].ubComposition
      ].bPriority = 0;
      gArmyComp[
        gGarrisonGroup[SectorInfo[Enum123.SEC_C5].ubGarrisonID].ubComposition
      ].bDesiredPopulation = 0;
    }
    if (ubSAIVersion < 20) {
      gArmyComp[Enum174.QUEEN_DEFENCE].bDesiredPopulation = 32;
      SectorInfo[Enum123.SEC_P3].ubNumElites = 32;
    }
    if (ubSAIVersion < 21) {
      pGroup = gpGroupList;
      while (pGroup) {
        pGroup.uiFlags = 0;
        pGroup = pGroup.next;
      }
    }
    if (ubSAIVersion < 22) {
      // adjust down the number of bloodcats based on difficulty in the two special bloodcat levels
      switch (gGameOptions.ubDifficultyLevel) {
        case Enum9.DIF_LEVEL_EASY: // 50%
          SectorInfo[Enum123.SEC_N5].bBloodCatPlacements = 8;
          SectorInfo[Enum123.SEC_N5].bBloodCats = 10;
          break;
        case Enum9.DIF_LEVEL_MEDIUM: // 75%
          SectorInfo[Enum123.SEC_N5].bBloodCatPlacements = 8;
          SectorInfo[Enum123.SEC_N5].bBloodCats = 10;
        case Enum9.DIF_LEVEL_HARD: // 100%
          SectorInfo[Enum123.SEC_N5].bBloodCatPlacements = 8;
          SectorInfo[Enum123.SEC_N5].bBloodCats = 10;
          break;
      }
    }
    if (ubSAIVersion < 23) {
      if (gWorldSectorX != 3 || gWorldSectorY != 16 || !gbWorldSectorZ) {
        SectorInfo[Enum123.SEC_P3].ubNumElites = 32;
      }
    }
    if (ubSAIVersion < 24) {
      // If the queen has escaped to the basement, do not use the profile insertion info
      // when we finally go down there, otherwise she will end up in the wrong spot, possibly inside
      // the walls.
      if (
        !gubFact[Enum170.FACT_QUEEN_DEAD] &&
        gMercProfiles[Enum268.QUEEN].bSectorZ == 1
      )
        if (gbWorldSectorZ != 1 || gWorldSectorX != 16 || gWorldSectorY != 3) {
          // We aren't in the basement sector
          gMercProfiles[Enum268.QUEEN].fUseProfileInsertionInfo = false;
        } else {
          // We are in the basement sector, relocate queen to proper position.
          let i: INT32;
          for (
            i = gTacticalStatus.Team[CIV_TEAM].bFirstID;
            i <= gTacticalStatus.Team[CIV_TEAM].bLastID;
            i++
          ) {
            if (MercPtrs[i].ubProfile == Enum268.QUEEN) {
              // Found queen, relocate her to 16866
              BumpAnyExistingMerc(16866);
              TeleportSoldier(MercPtrs[i], 16866, true);
              break;
            }
          }
        }
    }
    if (ubSAIVersion < 25) {
      if (gubFact[Enum170.FACT_SKYRIDER_CLOSE_TO_CHOPPER]) {
        gMercProfiles[Enum268.SKYRIDER].fUseProfileInsertionInfo = false;
      }
    }

    // KM : July 21, 1999 patch fix
    if (ubSAIVersion < 26) {
      let i: INT32;
      for (i = 0; i < 255; i++) {
        if (
          SectorInfo[i].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] +
            SectorInfo[i].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] +
            SectorInfo[i].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA] >
          20
        ) {
          SectorInfo[i].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] = 0;
          SectorInfo[i].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] = 20;
          SectorInfo[i].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA] = 0;
        }
      }
    }

    // KM : August 4, 1999 patch fix
    //     This addresses the problem of not having any soldiers in sector N7 when playing the game under easy difficulty.
    //		 If captured and interrogated, the player would find no soldiers defending the sector.  This changes the composition
    //     so that it will always be there, and adds the soldiers accordingly if the sector isn't loaded when the update is made.
    if (ubSAIVersion < 27) {
      if (gGameOptions.ubDifficultyLevel == Enum9.DIF_LEVEL_EASY) {
        if (gWorldSectorX != 7 || gWorldSectorY != 14 || gbWorldSectorZ) {
          let cnt: INT32;
          let iRandom: INT32;
          let iEliteChance: INT32;
          let iTroopChance: INT32;
          let iAdminChance: INT32;
          let iStartPop: INT32;
          let iDesiredPop: INT32;
          let iPriority: INT32;
          let pSector: SECTORINFO;

          // Change the garrison composition to LEVEL1_DEFENCE from LEVEL2_DEFENCE
          pSector = SectorInfo[Enum123.SEC_N7];
          gGarrisonGroup[pSector.ubGarrisonID].ubComposition =
            Enum174.LEVEL1_DEFENCE;

          iStartPop =
            gArmyComp[gGarrisonGroup[pSector.ubGarrisonID].ubComposition]
              .bStartPopulation;
          iDesiredPop =
            gArmyComp[gGarrisonGroup[pSector.ubGarrisonID].ubComposition]
              .bDesiredPopulation;
          iPriority =
            gArmyComp[gGarrisonGroup[pSector.ubGarrisonID].ubComposition]
              .bPriority;
          iEliteChance =
            gArmyComp[gGarrisonGroup[pSector.ubGarrisonID].ubComposition]
              .bElitePercentage;
          iTroopChance =
            gArmyComp[gGarrisonGroup[pSector.ubGarrisonID].ubComposition]
              .bTroopPercentage + iEliteChance;
          iAdminChance =
            gArmyComp[gGarrisonGroup[pSector.ubGarrisonID].ubComposition]
              .bAdminPercentage;

          if (iStartPop) {
            // if population is less than maximum
            if (iStartPop != MAX_STRATEGIC_TEAM_SIZE) {
              // then vary it a bit (+/- 25%)
              iStartPop = Math.trunc(
                (iStartPop * (100 + (Random(51) - 25))) / 100,
              );
            }

            iStartPop = Math.max(
              gubMinEnemyGroupSize,
              Math.min(MAX_STRATEGIC_TEAM_SIZE, iStartPop),
            );
            cnt = iStartPop;

            if (iAdminChance) {
              pSector.ubNumAdmins = Math.trunc(
                (iAdminChance * iStartPop) / 100,
              );
            } else
              while (cnt--) {
                // for each person, randomly determine the types of each soldier.
                {
                  iRandom = Random(100);
                  if (iRandom < iEliteChance) {
                    pSector.ubNumElites++;
                  } else if (iRandom < iTroopChance) {
                    pSector.ubNumTroops++;
                  }
                }
              }
          }
        }
      }
    }

    if (ubSAIVersion < 28) {
      let pNext: GROUP | null;
      if (!StrategicMap[CALCULATE_STRATEGIC_INDEX(3, 16)].fEnemyControlled) {
        // Eliminate all enemy groups in this sector, because the player owns the sector, and it is not
        // possible for them to spawn there!
        pGroup = gpGroupList;
        while (pGroup) {
          pNext = pGroup.next;
          if (!pGroup.fPlayer) {
            if (
              pGroup.ubSectorX == 3 &&
              pGroup.ubSectorY == 16 &&
              !pGroup.ubPrevX &&
              !pGroup.ubPrevY
            ) {
              ClearPreviousAIGroupAssignment(pGroup);
              RemovePGroup(pGroup);
            }
          }
          pGroup = pNext;
        }
      }
    }
    if (ubSAIVersion < 29) {
      InitStrategicMovementCosts();
    }

    // KM : Aug 11, 1999 -- Patch fix:  Blindly update the airspace control.  There is a bug somewhere
    //		 that is failing to keep this information up to date, and I failed to find it.  At least this
    //		 will patch saves.
    UpdateAirspaceControl();

    EvolveQueenPriorityPhase(true);

    // Count and correct the floating groups
    pGroup = gpGroupList;
    while (pGroup) {
      next = pGroup.next; // store the next node as pGroup could be deleted!
      if (!pGroup.fPlayer) {
        if (!pGroup.fBetweenSectors) {
          if (
            pGroup.ubSectorX != gWorldSectorX ||
            pGroup.ubSectorY != gWorldSectorY ||
            gbWorldSectorZ
          ) {
            RepollSAIGroup(pGroup);
            ValidateGroup(pGroup);
          }
        }
      }
      pGroup = next; // advance the node
    }

    // Update the version number to the most current.
    gubSAIVersion = SAI_VERSION;

    ValidateWeights(28);
    ValidatePendingGroups();

    return true;
  }

  function EvolveQueenPriorityPhase(fForceChange: boolean): void {
    let i: INT32;
    let index: INT32;
    let num: INT32;
    let iFactor: INT32;
    let iChange: INT32;
    let iNew: INT32;
    let iNumSoldiers: INT32;
    let iNumPromotions: INT32;
    let pSector: SECTORINFO;
    let ubOwned: UINT8[] /* [NUM_ARMY_COMPOSITIONS] */ = createArray(
      Enum174.NUM_ARMY_COMPOSITIONS,
      0,
    );
    let ubTotal: UINT8[] /* [NUM_ARMY_COMPOSITIONS] */ = createArray(
      Enum174.NUM_ARMY_COMPOSITIONS,
      0,
    );
    let ubNewPhase: UINT8;
    ubNewPhase = Math.trunc(CurrentPlayerProgressPercentage() / 10);

    if (!fForceChange && ubNewPhase == gubQueenPriorityPhase) {
      return;
    }

    if (gubQueenPriorityPhase > ubNewPhase) {
    } else if (gubQueenPriorityPhase < ubNewPhase) {
    } else {
    }

    gubQueenPriorityPhase = ubNewPhase;

    // The phase value refers to the deviation percentage she will apply to original garrison values.
    // All sector values are evaluated to see how many of those sectors are enemy controlled.  If they
    // are controlled by her, the desired number will be increased as well as the priority.  On the other
    // hand, if she doesn't own those sectors, the values will be decreased instead.  All values are based off of
    // the originals.
    ubOwned.fill(0);
    ubTotal.fill(0);

    // Record the values required to calculate the percentage of each composition type that the queen controls.
    for (i = 0; i < giGarrisonArraySize; i++) {
      index = gGarrisonGroup[i].ubComposition;
      if (
        StrategicMap[
          SECTOR_INFO_TO_STRATEGIC_INDEX(gGarrisonGroup[i].ubSectorID)
        ].fEnemyControlled
      ) {
        ubOwned[index]++;
      }
      ubTotal[index]++;
    }

    // Go through the *majority* of compositions and modify the priority/desired values.
    for (i = 0; i < Enum174.NUM_ARMY_COMPOSITIONS; i++) {
      switch (i) {
        case Enum174.QUEEN_DEFENCE:
        case Enum174.MEDUNA_DEFENCE:
        case Enum174.MEDUNA_SAMSITE:
        case Enum174.LEVEL1_DEFENCE:
        case Enum174.LEVEL2_DEFENCE:
        case Enum174.LEVEL3_DEFENCE:
        case Enum174.OMERTA_WELCOME_WAGON:
        case Enum174.ROADBLOCK:
          // case SANMONA_SMALL:
          // don't consider these compositions
          continue;
      }
      // If the queen owns them ALL, then she gets the maximum defensive bonus.  If she owns NONE,
      // then she gets a maximum defensive penalty.  Everything else lies in the middle.  The legal
      // range is +-50.
      if (ubTotal[i]) {
        iFactor = Math.trunc((ubOwned[i] * 100) / ubTotal[i]) - 50;
      } else {
        iFactor = -50;
      }
      iFactor = Math.trunc((iFactor * gubQueenPriorityPhase) / 10);

      // modify priority by + or - 25% of original
      if (gArmyComp[i].bPriority) {
        num = gOrigArmyComp[i].bPriority + Math.trunc(iFactor / 2);
        num = Math.min(Math.max(0, num), 100);
        gArmyComp[i].bPriority = num;
      }

      // modify desired population by + or - 50% of original population
      num = Math.trunc(
        (gOrigArmyComp[i].bDesiredPopulation * (100 + iFactor)) / 100,
      );
      num = Math.min(Math.max(6, num), MAX_STRATEGIC_TEAM_SIZE);
      gArmyComp[i].bDesiredPopulation = num;

      // if gfExtraElites is set, then augment the composition sizes
      if (gfExtraElites && iFactor >= 15 && gArmyComp[i].bElitePercentage) {
        iChange = gGameOptions.ubDifficultyLevel * 5;

        // increase elite % (max 100)
        iNew = gArmyComp[i].bElitePercentage + iChange;
        iNew = Math.min(100, iNew);
        gArmyComp[i].bElitePercentage = iNew;

        // decrease troop % (min 0)
        iNew = gArmyComp[i].bTroopPercentage - iChange;
        iNew = Math.max(0, iNew);
        gArmyComp[i].bTroopPercentage = iNew;
      }
    }
    if (gfExtraElites) {
      // Turn off the flag so that this doesn't happen everytime this function is called!
      gfExtraElites = false;

      for (i = 0; i < giGarrisonArraySize; i++) {
        // if we are dealing with extra elites, then augment elite compositions (but only if they exist in the sector).
        // If the queen still owns the town by more than 65% (iFactor >= 15), then upgrade troops to elites in those sectors.
        index = gGarrisonGroup[i].ubComposition;
        switch (index) {
          case Enum174.QUEEN_DEFENCE:
          case Enum174.MEDUNA_DEFENCE:
          case Enum174.MEDUNA_SAMSITE:
          case Enum174.LEVEL1_DEFENCE:
          case Enum174.LEVEL2_DEFENCE:
          case Enum174.LEVEL3_DEFENCE:
          case Enum174.OMERTA_WELCOME_WAGON:
          case Enum174.ROADBLOCK:
            // case SANMONA_SMALL:
            // don't consider these compositions
            continue;
        }
        pSector = SectorInfo[gGarrisonGroup[i].ubSectorID];
        if (ubTotal[index]) {
          iFactor = Math.trunc((ubOwned[index] * 100) / ubTotal[index]) - 50;
        } else {
          iFactor = -50;
        }
        if (iFactor >= 15) {
          // Make the actual elites in sector match the new garrison percentage
          if (
            !gfWorldLoaded ||
            gbWorldSectorZ ||
            gWorldSectorX != SECTORX(gGarrisonGroup[i].ubSectorID) ||
            gWorldSectorY != SECTORY(gGarrisonGroup[i].ubSectorID)
          ) {
            // Also make sure the sector isn't currently loaded!
            iNumSoldiers =
              pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
            iNumPromotions =
              Math.trunc(
                (gArmyComp[index].bElitePercentage * iNumSoldiers) / 100,
              ) - pSector.ubNumElites;

            if (iNumPromotions > 0) {
              while (iNumPromotions--) {
                if (pSector.ubNumAdmins) {
                  pSector.ubNumAdmins--;
                } else if (pSector.ubNumTroops) {
                  pSector.ubNumTroops--;
                } else {
                  Assert(0);
                }
                pSector.ubNumElites++;
              }
              Assert(
                iNumSoldiers ==
                  pSector.ubNumAdmins +
                    pSector.ubNumTroops +
                    pSector.ubNumElites,
              );
            }
          }
        }
      }
    }
    // Recalculate all of the weights.
    for (i = 0; i < giGarrisonArraySize; i++) {
      RecalculateGarrisonWeight(i);
    }
  }

  export function ExecuteStrategicAIAction(
    usActionCode: UINT16,
    sSectorX: INT16,
    sSectorY: INT16,
  ): void {
    let pGroup: GROUP;
    let pPendingGroup: GROUP | null = null;
    let pSector: SECTORINFO;
    let ubSectorID: UINT8;
    let ubNumSoldiers: UINT8;
    switch (usActionCode) {
      case Enum173.STRATEGIC_AI_ACTION_WAKE_QUEEN:
        WakeUpQueen();
        break;

      case Enum173.STRATEGIC_AI_ACTION_QUEEN_DEAD:
        gfQueenAIAwake = false;
        break;

      case Enum173.STRATEGIC_AI_ACTION_KINGPIN_DEAD:
        // Immediate send a small garrison to C5 (to discourage access to Tony the dealer)
        /*
      for( i = 0; i < giGarrisonArraySize; i++ )
      {
              if( gGarrisonGroup[ i ].ubComposition == SANMONA_SMALL )
              {
                      //Setup the composition so from now on the queen will consider this an important sector
                      //to hold.
                      gArmyComp[ gGarrisonGroup[ i ].ubComposition ].bPriority = 65;
                      gArmyComp[ gGarrisonGroup[ i ].ubComposition ].bTroopPercentage = 100;
                      gArmyComp[ gGarrisonGroup[ i ].ubComposition ].bDesiredPopulation = 5;
                      RequestHighPriorityGarrisonReinforcements( i, (UINT8)(2 + Random( 4 )) ); //send 2-5 soldiers now.
                      break;
              }
      }
      */
        break;
      case Enum213.NPC_ACTION_SEND_SOLDIERS_TO_DRASSEN:
        // Send 6, 9, or 12 troops (based on difficulty) one of the Drassen sectors.  If nobody is there when they arrive,
        // those troops will get reassigned.

        if (Chance(50)) {
          ubSectorID = Enum123.SEC_D13;
        } else if (Chance(60)) {
          ubSectorID = Enum123.SEC_B13;
        } else {
          ubSectorID = Enum123.SEC_C13;
        }
        ubNumSoldiers = 3 + gGameOptions.ubDifficultyLevel * 3;
        pGroup = CreateNewEnemyGroupDepartingFromSector(
          Enum123.SEC_P3,
          0,
          ubNumSoldiers,
          0,
        );
        Assert(pGroup.pEnemyGroup);

        if (
          !gGarrisonGroup[SectorInfo[ubSectorID].ubGarrisonID].ubPendingGroupID
        ) {
          pGroup.pEnemyGroup.ubIntention = Enum172.STAGE;
          gGarrisonGroup[SectorInfo[ubSectorID].ubGarrisonID].ubPendingGroupID =
            pGroup.ubGroupID;
        } else {
          // this should never happen (but if it did, then this is the best way to deal with it).
          pGroup.pEnemyGroup.ubIntention = Enum184.PURSUIT;
        }
        giReinforcementPool -= ubNumSoldiers;
        giReinforcementPool = Math.max(giReinforcementPool, 0);

        MoveSAIGroupToSector(
          createPointer(
            () => pGroup,
            (v) => (pGroup = v),
          ),
          ubSectorID,
          Enum172.EVASIVE,
          pGroup.pEnemyGroup.ubIntention,
        );

        break;
      case Enum213.NPC_ACTION_SEND_SOLDIERS_TO_BATTLE_LOCATION:
        // Send 4, 8, or 12 troops (based on difficulty) to the location of the first battle.  If nobody is there when they arrive,
        // those troops will get reassigned.
        ubSectorID = STRATEGIC_INDEX_TO_SECTOR_INFO(
          sWorldSectorLocationOfFirstBattle,
        );
        pSector = SectorInfo[ubSectorID];
        ubNumSoldiers = gGameOptions.ubDifficultyLevel * 4;
        pGroup = CreateNewEnemyGroupDepartingFromSector(
          Enum123.SEC_P3,
          0,
          ubNumSoldiers,
          0,
        );
        giReinforcementPool -= ubNumSoldiers;
        giReinforcementPool = Math.max(giReinforcementPool, 0);

        // Determine if the battle location actually has a garrison assignment.  If so, and the following
        // checks succeed, the enemies will be sent to attack and reinforce that sector.  Otherwise, the
        // enemies will simply check it out, then leave.
        if (pSector.ubGarrisonID != NO_GARRISON) {
          // sector has a garrison
          if (!NumEnemiesInSector(SECTORX(ubSectorID), SECTORY(ubSectorID))) {
            // no enemies are here
            if (
              gArmyComp[
                Number(!gGarrisonGroup[pSector.ubGarrisonID].ubComposition)
              ].bPriority
            ) {
              // the garrison is important
              if (!gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID) {
                // the garrison doesn't have reinforcements already on route.
                gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID =
                  pGroup.ubGroupID;
                MoveSAIGroupToSector(
                  createPointer(
                    () => pGroup,
                    (v) => (pGroup = v),
                  ),
                  ubSectorID,
                  Enum172.STAGE,
                  Enum184.REINFORCEMENTS,
                );
                break;
              }
            }
          }
        } else {
          MoveSAIGroupToSector(
            createPointer(
              () => pGroup,
              (v) => (pGroup = v),
            ),
            ubSectorID,
            Enum172.EVASIVE,
            Enum184.PURSUIT,
          );
        }

        break;
      case Enum213.NPC_ACTION_SEND_SOLDIERS_TO_OMERTA:
        ubNumSoldiers = gGameOptions.ubDifficultyLevel * 6; // 6, 12, or 18 based on difficulty.
        pGroup = CreateNewEnemyGroupDepartingFromSector(
          Enum123.SEC_P3,
          0,
          ubNumSoldiers,
          Math.trunc(ubNumSoldiers / 7),
        ); // add 1 elite to normal, and 2 for hard
        ubNumSoldiers = ubNumSoldiers + Math.trunc(ubNumSoldiers / 7);
        giReinforcementPool -= ubNumSoldiers;
        giReinforcementPool = Math.max(giReinforcementPool, 0);
        if (
          PlayerMercsInSector(9, 1, 1) &&
          !PlayerMercsInSector(10, 1, 1) &&
          !PlayerMercsInSector(10, 1, 2)
        ) {
          // send to A9 (if mercs in A9, but not in A10 or A10 basement)
          ubSectorID = Enum123.SEC_A9;
        } else {
          // send to A10
          ubSectorID = Enum123.SEC_A10;
        }

        MoveSAIGroupToSector(
          createPointer(
            () => pGroup,
            (v) => (pGroup = v),
          ),
          ubSectorID,
          Enum172.EVASIVE,
          Enum184.PURSUIT,
        );

        ValidateGroup(pGroup);
        break;
      case Enum213.NPC_ACTION_SEND_TROOPS_TO_SAM:
        ubSectorID = SECTOR(sSectorX, sSectorY);
        ubNumSoldiers =
          3 +
          gGameOptions.ubDifficultyLevel +
          Math.trunc(HighestPlayerProgressPercentage() / 15);
        giReinforcementPool -= ubNumSoldiers;
        giReinforcementPool = Math.max(giReinforcementPool, 0);
        pGroup = CreateNewEnemyGroupDepartingFromSector(
          Enum123.SEC_P3,
          0,
          0,
          ubNumSoldiers,
        );
        MoveSAIGroupToSector(
          createPointer(
            () => pGroup,
            (v) => (pGroup = v),
          ),
          ubSectorID,
          Enum172.STAGE,
          Enum184.REINFORCEMENTS,
        );

        if (
          gGarrisonGroup[SectorInfo[ubSectorID].ubGarrisonID].ubPendingGroupID
        ) {
          // Clear the pending group's assignment.
          pPendingGroup = GetGroup(
            gGarrisonGroup[SectorInfo[ubSectorID].ubGarrisonID]
              .ubPendingGroupID,
          );
          Assert(pPendingGroup);
          ClearPreviousAIGroupAssignment(pPendingGroup);
        }
        // Assign the elite squad to attack the SAM site
        (<ENEMYGROUP>pGroup.pEnemyGroup).ubIntention = Enum184.REINFORCEMENTS;
        gGarrisonGroup[SectorInfo[ubSectorID].ubGarrisonID].ubPendingGroupID =
          pGroup.ubGroupID;

        if (pPendingGroup) {
          // Reassign the pending group
          ReassignAIGroup(
            createPointer(
              () => <GROUP>pPendingGroup,
              (v) => (pPendingGroup = v),
            ),
          );
        }

        break;
      case Enum213.NPC_ACTION_ADD_MORE_ELITES:
        gfExtraElites = true;
        EvolveQueenPriorityPhase(true);
        break;
      case Enum213.NPC_ACTION_GIVE_KNOWLEDGE_OF_ALL_MERCS:
        // temporarily make the queen's forces more aware (high alert)
        switch (gGameOptions.ubDifficultyLevel) {
          case Enum9.DIF_LEVEL_EASY:
            gubNumAwareBattles = EASY_NUM_AWARE_BATTLES;
            break;
          case Enum9.DIF_LEVEL_MEDIUM:
            gubNumAwareBattles = NORMAL_NUM_AWARE_BATTLES;
            break;
          case Enum9.DIF_LEVEL_HARD:
            gubNumAwareBattles = HARD_NUM_AWARE_BATTLES;
            break;
        }
        break;
      default:
        ScreenMsg(
          FONT_RED,
          MSG_DEBUG,
          "QueenAI failed to handle action code %d.",
          usActionCode,
        );
        break;
    }
  }

  export function InvestigateSector(ubSectorID: UINT8): void {
    /*
          INT32 i;
          SECTORINFO *pSector;
          INT16 sSectorX, sSectorY;
          UINT8 ubAdmins[4], ubTroops[4], ubElites[4], ubNumToSend, ubTotal;

          //@@@ Disabled!  Also commented out the posting of the event
          return;

          sSectorX = (INT16)SECTORX( ubSectorID );
          sSectorY = (INT16)SECTORY( ubSectorID );

          if( guiCurrentScreen != GAME_SCREEN )
          { //If we aren't in tactical, then don't do this.  It is strictly added flavour and would be irritating if
                  //you got the prebattle interface in mapscreen while compressing time (right after clearing it...)
                  return;
          }

          if( sSectorX != gWorldSectorX || sSectorY != gWorldSectorY || gbWorldSectorZ )
          { //The sector isn't loaded, so don't bother...
                  return;
          }

          //Now, we will investigate this sector if there are forces in adjacent towns.  For each
          //sector that applies, we will add 1-2 soldiers.

          ubTotal = 0;
          for( i = 0; i < 4; i++ )
          {
                  ubAdmins[i] = ubTroops[i] = ubElites[i] = 0;
                  switch( i )
                  {
                          case 0: //NORTH
                                  if( sSectorY == 1 )
                                          continue;
                                  pSector = &SectorInfo[ ubSectorID - 16 ];
                                  break;
                          case 1: //EAST
                                  if( sSectorX == 16 )
                                          continue;
                                  pSector = &SectorInfo[ ubSectorID + 1 ];
                                  break;
                          case 2: //SOUTH
                                  if( sSectorY == 16 )
                                          continue;
                                  pSector = &SectorInfo[ ubSectorID + 16 ];
                                  break;
                          case 3: //WEST
                                  if( sSectorX == 1 )
                                          continue;
                                  pSector = &SectorInfo[ ubSectorID - 1 ];
                                  break;
                  }
                  if( pSector->ubNumAdmins + pSector->ubNumTroops + pSector->ubNumElites > 4 )
                  {
                          ubNumToSend = (UINT8)(Random( 2 ) + 1);
                          while( ubNumToSend )
                          {
                                  if( pSector->ubNumAdmins )
                                  {
                                          pSector->ubNumAdmins--;
                                          ubNumToSend--;
                                          ubAdmins[i]++;
                                          ubTotal++;
                                  }
                                  else if( pSector->ubNumTroops )
                                  {
                                          pSector->ubNumTroops--;
                                          ubNumToSend--;
                                          ubTroops[i]++;
                                          ubTotal++;
                                  }
                                  else if( pSector->ubNumElites )
                                  {
                                          pSector->ubNumTroops--;
                                          ubNumToSend--;
                                          ubTroops[i]++;
                                          ubTotal++;
                                  }
                                  else
                                  {
                                          break; //???
                                  }
                          }
                  }
          }
          if( !ubTotal )
          { //Nobody is available to investigate
                  return;
          }
          //Now we have decided who to send, so send them.
          for( i = 0; i < 4; i++ )
          {
                  if( ubAdmins[i] + ubTroops[i] + ubElites[i] )
                  {
                          switch( i )
                          {
                                  case 0: //NORTH
                                          AddEnemiesToBattle( NULL, INSERTION_CODE_NORTH, ubAdmins[i], ubTroops[i], ubElites[i], TRUE );
                                          break;
                                  case 1: //EAST
                                          AddEnemiesToBattle( NULL, INSERTION_CODE_EAST, ubAdmins[i], ubTroops[i], ubElites[i], TRUE );
                                          break;
                                  case 2: //SOUTH
                                          AddEnemiesToBattle( NULL, INSERTION_CODE_SOUTH, ubAdmins[i], ubTroops[i], ubElites[i], TRUE );
                                          break;
                                  case 3: //WEST
                                          AddEnemiesToBattle( NULL, INSERTION_CODE_WEST, ubAdmins[i], ubTroops[i], ubElites[i], TRUE );
                                          break;
                          }
                  }
          }
          if( !gfQueenAIAwake )
          {
                  gfFirstBattleMeanwhileScenePending = TRUE;
          }
  */
  }

  export function StrategicHandleQueenLosingControlOfSector(
    sSectorX: INT16,
    sSectorY: INT16,
    sSectorZ: INT16,
  ): void {
    let pSector: SECTORINFO;
    let ubSectorID: UINT8;
    if (sSectorZ) {
      // The queen doesn't care about anything happening under the ground.
      return;
    }

    if (StrategicMap[sSectorX + sSectorY * MAP_WORLD_X].fEnemyControlled) {
      // If the sector doesn't belong to the player, then we shouldn't be calling this function!
      SAIReportError(
        "StrategicHandleQueenLosingControlOfSector() was called for a sector that is internally considered to be enemy controlled.",
      );
      return;
    }

    ubSectorID = SECTOR(sSectorX, sSectorY);
    pSector = SectorInfo[ubSectorID];

    // Keep track of victories and wake up the queen after x number of battles.
    gusPlayerBattleVictories++;
    if (gusPlayerBattleVictories == 5 - gGameOptions.ubDifficultyLevel) {
      // 4 victories for easy, 3 for normal, 2 for hard
      WakeUpQueen();
    }

    if (pSector.ubGarrisonID == NO_GARRISON) {
      // Queen doesn't care if the sector lost wasn't a garrison sector.
      return;
    } else {
      // check to see if there are any pending reinforcements.  If so, then cancel their orders and have them
      // reassigned, so the player doesn't get pestered.  This is a feature that *dumbs* down the AI, and is done
      // for the sake of gameplay.  We don't want the game to be tedious.
      if (!pSector.uiTimeLastPlayerLiberated) {
        pSector.uiTimeLastPlayerLiberated = GetWorldTotalSeconds();
      } else {
        // convert hours to seconds and subtract up to half of it randomly "seconds - (hours*3600 / 2)"
        pSector.uiTimeLastPlayerLiberated =
          GetWorldTotalSeconds() - Random(gubHoursGracePeriod * 1800);
      }
      if (gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID) {
        let pGroup: GROUP;
        pGroup = GetGroup(
          gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID,
        );
        if (pGroup) {
          ReassignAIGroup(
            createPointer(
              () => pGroup,
              (v) => (pGroup = v),
            ),
          );
        }
        gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID = 0;
      }
    }

    // If there are any enemy groups that will be moving through this sector due, they will have to repath which
    // will cause them to avoid the sector.  Returns the number of redirected groups.
    RedirectEnemyGroupsMovingThroughSector(sSectorX, sSectorY);

    // For the purposes of a town being lost, we shall check to see if the queen wishes to investigate quickly after
    // losing.  This is done in town sectors when the character first takes it.
    switch (ubSectorID) {
      case Enum123.SEC_B13:
      case Enum123.SEC_C13:
      case Enum123.SEC_D13:
        // Drassen
        SectorInfo[Enum123.SEC_B13].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_C13].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_D13].ubInvestigativeState++;
        break;
      case Enum123.SEC_A2:
      case Enum123.SEC_B2:
        // Chitzena
        SectorInfo[Enum123.SEC_A2].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_B2].ubInvestigativeState++;
        break;
      case Enum123.SEC_G1:
      case Enum123.SEC_G2:
      case Enum123.SEC_H1:
      case Enum123.SEC_H2:
      case Enum123.SEC_H3:
        // Grumm
        SectorInfo[Enum123.SEC_G1].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_G2].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_H1].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_H2].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_H3].ubInvestigativeState++;
        break;
      case Enum123.SEC_F8:
      case Enum123.SEC_F9:
      case Enum123.SEC_G8:
      case Enum123.SEC_G9:
      case Enum123.SEC_H8:
        // Cambria
        SectorInfo[Enum123.SEC_F8].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_F9].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_G8].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_G9].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_H8].ubInvestigativeState++;
        break;
      case Enum123.SEC_H13:
      case Enum123.SEC_H14:
      case Enum123.SEC_I13:
      case Enum123.SEC_I14:
        // Alma
        SectorInfo[Enum123.SEC_H13].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_H14].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_I13].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_I14].ubInvestigativeState++;
        break;
      case Enum123.SEC_L11:
      case Enum123.SEC_L12:
        // Balime
        SectorInfo[Enum123.SEC_L11].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_L12].ubInvestigativeState++;
        break;
      case Enum123.SEC_N3:
      case Enum123.SEC_N4:
      case Enum123.SEC_N5:
      case Enum123.SEC_O3:
      case Enum123.SEC_O4:
      case Enum123.SEC_P3:
        // Meduna
        SectorInfo[Enum123.SEC_N3].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_N4].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_N5].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_O3].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_O4].ubInvestigativeState++;
        SectorInfo[Enum123.SEC_P3].ubInvestigativeState++;
        break;
      default:
        return;
    }

    if (pSector.ubInvestigativeState >= 4) {
      // This is the 4th time the player has conquered this sector.  We won't pester the player with probing attacks here anymore.
      return;
    }
    if (sSectorX != gWorldSectorX || sSectorY != gWorldSectorY) {
      // The sector isn't loaded, so don't probe attack it.  Otherwise, autoresolve would get them smoked!
      return;
    }
    //@@@ disabled
    // AddStrategicEventUsingSeconds( EVENT_INVESTIGATE_SECTOR, GetWorldTotalSeconds() + 45 * pSector->ubInvestigativeState + Random( 60 ), SECTOR( sSectorX, sSectorY ) );
  }

  function RequestHighPriorityStagingGroupReinforcements(pGroup: GROUP): void {
    //	GROUP *pClosestGroup;
    if (!(<ENEMYGROUP>pGroup.pEnemyGroup).ubPendingReinforcements) {
      return;
    }
    // pClosestGroup = SearchForClosestGroup( pGroup );
  }

  function SectorDistance(ubSectorID1: UINT8, ubSectorID2: UINT8): UINT8 {
    let ubSectorX1: UINT8;
    let ubSectorX2: UINT8;
    let ubSectorY1: UINT8;
    let ubSectorY2: UINT8;
    let ubDist: UINT8;
    ubSectorX1 = SECTORX(ubSectorID1);
    ubSectorX2 = SECTORX(ubSectorID2);
    ubSectorY1 = SECTORY(ubSectorID1);
    ubSectorY2 = SECTORY(ubSectorID2);

    ubDist =
      Math.abs(ubSectorX1 - ubSectorX2) + Math.abs(ubSectorY1 - ubSectorY2);

    return ubDist;
  }

  function RequestHighPriorityGarrisonReinforcements(
    iGarrisonID: INT32,
    ubSoldiersRequested: UINT8,
  ): void {
    let i: INT32;
    let iBestIndex: INT32;
    let pGroup: GROUP;
    let ubBestDist: UINT8;
    let ubDist: UINT8;
    let ubDstSectorX: UINT8;
    let ubDstSectorY: UINT8;
    // AssertMsg( giPatrolArraySize == PATROL_GROUPS && giGarrisonArraySize == GARRISON_GROUPS, "Strategic AI -- Patrol and/or garrison group definition mismatch." );
    ubBestDist = 255;
    iBestIndex = -1;
    for (i = 0; i < giPatrolArraySize; i++) {
      if (gPatrolGroup[i].ubGroupID) {
        pGroup = GetGroup(gPatrolGroup[i].ubGroupID);
        if (pGroup && pGroup.ubGroupSize >= ubSoldiersRequested) {
          ubDist = SectorDistance(
            SECTOR(pGroup.ubSectorX, pGroup.ubSectorY),
            gGarrisonGroup[iGarrisonID].ubSectorID,
          );
          if (ubDist < ubBestDist) {
            ubBestDist = ubDist;
            iBestIndex = i;
          }
        }
      }
    }
    ubDstSectorX = SECTORX(gGarrisonGroup[iGarrisonID].ubSectorID);
    ubDstSectorY = SECTORY(gGarrisonGroup[iGarrisonID].ubSectorID);
    if (iBestIndex != -1) {
      // Send the group to the garrison
      pGroup = GetGroup(gPatrolGroup[iBestIndex].ubGroupID);
      Assert(pGroup.pEnemyGroup);
      if (
        pGroup.ubGroupSize > ubSoldiersRequested &&
        pGroup.ubGroupSize - ubSoldiersRequested >= gubMinEnemyGroupSize
      ) {
        // Split the group, and send to location
        let pNewGroup: GROUP;
        pNewGroup = CreateNewEnemyGroupDepartingFromSector(
          SECTOR(pGroup.ubSectorX, pGroup.ubSectorY),
          0,
          0,
          0,
        );
        Assert(pNewGroup.pEnemyGroup);
        // Transfer the troops from group to new group
        if (pGroup.pEnemyGroup.ubNumTroops >= ubSoldiersRequested) {
          // All of them are troops, so do it in one shot.
          pGroup.pEnemyGroup.ubNumTroops -= ubSoldiersRequested;
          pGroup.ubGroupSize -= ubSoldiersRequested;
          pNewGroup.pEnemyGroup.ubNumTroops = ubSoldiersRequested;
          pNewGroup.ubGroupSize += ubSoldiersRequested;
          ValidateLargeGroup(pGroup);
          ValidateLargeGroup(pNewGroup);
        } else
          while (ubSoldiersRequested) {
            // There aren't enough troops, so transfer other types when we run out of troops, prioritizing admins, then elites.
            if (pGroup.pEnemyGroup.ubNumTroops) {
              pGroup.pEnemyGroup.ubNumTroops--;
              pGroup.ubGroupSize--;
              pNewGroup.pEnemyGroup.ubNumTroops++;
              pNewGroup.ubGroupSize++;
              ubSoldiersRequested--;
              ValidateLargeGroup(pGroup);
              ValidateLargeGroup(pNewGroup);
            } else if (pGroup.pEnemyGroup.ubNumAdmins) {
              pGroup.pEnemyGroup.ubNumAdmins--;
              pGroup.ubGroupSize--;
              pNewGroup.pEnemyGroup.ubNumAdmins++;
              pNewGroup.ubGroupSize++;
              ubSoldiersRequested--;
              ValidateLargeGroup(pGroup);
              ValidateLargeGroup(pNewGroup);
            } else if (pGroup.pEnemyGroup.ubNumElites) {
              pGroup.pEnemyGroup.ubNumElites--;
              pGroup.ubGroupSize--;
              pNewGroup.pEnemyGroup.ubNumElites++;
              pNewGroup.ubGroupSize++;
              ubSoldiersRequested--;
              ValidateLargeGroup(pGroup);
              ValidateLargeGroup(pNewGroup);
            } else {
              AssertMsg(0, "Strategic AI group transfer error.  KM : 0");
              return;
            }
          }
        pNewGroup.ubOriginalSector = SECTOR(ubDstSectorX, ubDstSectorY);
        gGarrisonGroup[iGarrisonID].ubPendingGroupID = pNewGroup.ubGroupID;
        RecalculatePatrolWeight(iBestIndex);

        MoveSAIGroupToSector(
          createPointer(
            () => pNewGroup,
            (v) => (pNewGroup = v),
          ),
          gGarrisonGroup[iGarrisonID].ubSectorID,
          Enum172.EVASIVE,
          Enum184.REINFORCEMENTS,
        );
      } else {
        // Send the whole group and kill it's patrol assignment.
        gPatrolGroup[iBestIndex].ubGroupID = 0;
        gGarrisonGroup[iGarrisonID].ubPendingGroupID = pGroup.ubGroupID;
        pGroup.ubOriginalSector = SECTOR(ubDstSectorX, ubDstSectorY);
        RecalculatePatrolWeight(iBestIndex);
        // The ONLY case where the group is told to move somewhere else when they could be BETWEEN sectors.  The movegroup functions
        // don't work if this is the case.  Teleporting them to their previous sector is the best and easiest way to deal with this.
        SetEnemyGroupSector(pGroup, SECTOR(pGroup.ubSectorX, pGroup.ubSectorY));

        MoveSAIGroupToSector(
          createPointer(
            () => pGroup,
            (v) => (pGroup = v),
          ),
          gGarrisonGroup[iGarrisonID].ubSectorID,
          Enum172.EVASIVE,
          Enum184.REINFORCEMENTS,
        );
        ValidateGroup(pGroup);
      }
    } else {
      // There are no groups that have enough troops.  Send a new force from the palace instead.
      pGroup = CreateNewEnemyGroupDepartingFromSector(
        Enum123.SEC_P3,
        0,
        ubSoldiersRequested,
        0,
      );
      Assert(pGroup.pEnemyGroup);
      pGroup.ubMoveType = Enum185.ONE_WAY;
      pGroup.pEnemyGroup.ubIntention = Enum184.REINFORCEMENTS;
      gGarrisonGroup[iGarrisonID].ubPendingGroupID = pGroup.ubGroupID;
      pGroup.ubOriginalSector = SECTOR(ubDstSectorX, ubDstSectorY);
      giReinforcementPool -= ubSoldiersRequested;

      MoveSAIGroupToSector(
        createPointer(
          () => pGroup,
          (v) => (pGroup = v),
        ),
        gGarrisonGroup[iGarrisonID].ubSectorID,
        Enum172.EVASIVE,
        Enum184.REINFORCEMENTS,
      );
      ValidateGroup(pGroup);
    }
  }

  function WakeUpQueen(): void {
    gfQueenAIAwake = true;
    if (!gfMassFortificationOrdered) {
      gfMassFortificationOrdered = true;
      MassFortifyTowns();
    }
  }

  function MassFortifyTowns(): void {
    let i: INT32;
    let pSector: SECTORINFO;
    let pGroup: GROUP;
    let ubNumTroops: UINT8;
    let ubDesiredTroops: UINT8;
    for (i = 0; i < giGarrisonArraySize; i++) {
      pSector = SectorInfo[gGarrisonGroup[i].ubSectorID];
      ubNumTroops =
        pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
      ubDesiredTroops =
        gArmyComp[gGarrisonGroup[i].ubComposition].bDesiredPopulation;
      if (ubNumTroops < ubDesiredTroops) {
        if (
          !gGarrisonGroup[i].ubPendingGroupID &&
          gGarrisonGroup[i].ubComposition != Enum174.ROADBLOCK &&
          EnemyPermittedToAttackSector(null, gGarrisonGroup[i].ubSectorID)
        ) {
          RequestHighPriorityGarrisonReinforcements(
            i,
            ubDesiredTroops - ubNumTroops,
          );
        }
      }
    }
    // Convert the garrison sitting in Omerta (if alive), and reassign them
    pSector = SectorInfo[Enum123.SEC_A9];
    if (pSector.ubNumTroops) {
      pGroup = CreateNewEnemyGroupDepartingFromSector(
        Enum123.SEC_A9,
        0,
        pSector.ubNumTroops,
        0,
      );
      Assert(pGroup);
      Assert(pGroup.pEnemyGroup);
      pSector.ubNumTroops = 0;
      pGroup.pEnemyGroup.ubIntention = Enum184.PATROL;
      pGroup.ubMoveType = Enum185.ONE_WAY;
      ReassignAIGroup(
        createPointer(
          () => pGroup,
          (v) => (pGroup = v),
        ),
      );
      ValidateGroup(pGroup);
      RecalculateSectorWeight(Enum123.SEC_A9);
    }
  }

  function RenderAIViewerGarrisonInfo(
    x: INT32,
    y: INT32,
    pSector: SECTORINFO,
  ): void {
    if (pSector.ubGarrisonID != NO_GARRISON) {
      let iDesired: INT32;
      let iSurplus: INT32;
      iDesired =
        gArmyComp[gGarrisonGroup[pSector.ubGarrisonID].ubComposition]
          .bDesiredPopulation;
      iSurplus =
        pSector.ubNumTroops +
        pSector.ubNumAdmins +
        pSector.ubNumElites -
        iDesired;
      SetFontForeground(FONT_WHITE);
      if (iSurplus >= 0) {
        mprintf(x, y, "%d desired, %d surplus troops", iDesired, iSurplus);
      } else {
        mprintf(
          x,
          y,
          "%d desired, %d reinforcements requested",
          iDesired,
          -iSurplus,
        );
      }
      if (gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID) {
        let pGroup: GROUP;
        pGroup = GetGroup(
          gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID,
        );
        mprintf(
          x,
          y + 10,
          "%d reinforcements on route from group %d in %s%d",
          pGroup.ubGroupSize,
          pGroup.ubGroupID,
          String.fromCharCode(pGroup.ubSectorY + "A".charCodeAt(0) - 1),
          pGroup.ubSectorX,
        );
      } else {
        mprintf(x, y + 10, "No pending reinforcements for this sector.");
      }
    } else {
      SetFontForeground(FONT_GRAY2);
      mprintf(x, y, "No garrison information for this sector.");
    }
  }

  export function StrategicHandleMineThatRanOut(ubSectorID: UINT8): void {
    switch (ubSectorID) {
      case Enum123.SEC_B2:
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_A2].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_A2].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_B2].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_B2].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        break;
      case Enum123.SEC_D13:
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_B13].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_B13].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_C13].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_C13].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_D13].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_D13].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        break;
      case Enum123.SEC_H8:
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_F8].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_F8].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_F9].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_F9].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_G8].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_G8].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_G9].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_G9].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_H8].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_H8].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        break;
      case Enum123.SEC_I14:
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_H13].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_H13].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_H14].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_H14].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_I13].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_I13].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        gArmyComp[
          gGarrisonGroup[SectorInfo[Enum123.SEC_I14].ubGarrisonID].ubComposition
        ].bPriority = Math.trunc(
          gArmyComp[
            gGarrisonGroup[SectorInfo[Enum123.SEC_I14].ubGarrisonID]
              .ubComposition
          ].bPriority / 4,
        );
        break;
    }
  }

  function GarrisonCanProvideMinimumReinforcements(
    iGarrisonID: INT32,
  ): boolean {
    let iAvailable: INT32;
    let iDesired: INT32;
    let pSector: SECTORINFO;
    let ubSectorX: UINT8;
    let ubSectorY: UINT8;

    pSector = SectorInfo[gGarrisonGroup[iGarrisonID].ubSectorID];

    iAvailable =
      pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
    iDesired =
      gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition].bDesiredPopulation;

    if (iAvailable - iDesired >= gubMinEnemyGroupSize) {
      // Do a more expensive check first to determine if there is a player presence here (combat in progress)
      // If so, do not provide reinforcements from here.
      ubSectorX = SECTORX(gGarrisonGroup[iGarrisonID].ubSectorID);
      ubSectorY = SECTORY(gGarrisonGroup[iGarrisonID].ubSectorID);
      if (
        PlayerMercsInSector(ubSectorX, ubSectorY, 0) ||
        CountAllMilitiaInSector(ubSectorX, ubSectorY)
      ) {
        return false;
      }
      return true;
    }
    return false;
  }

  function GarrisonRequestingMinimumReinforcements(
    iGarrisonID: INT32,
  ): boolean {
    let iAvailable: INT32;
    let iDesired: INT32;
    let pSector: SECTORINFO;

    if (gGarrisonGroup[iGarrisonID].ubPendingGroupID) {
      return false;
    }

    pSector = SectorInfo[gGarrisonGroup[iGarrisonID].ubSectorID];
    iAvailable =
      pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites;
    iDesired =
      gArmyComp[gGarrisonGroup[iGarrisonID].ubComposition].bDesiredPopulation;

    if (iDesired - iAvailable >= gubMinEnemyGroupSize) {
      return true;
    }
    return false;
  }

  function PatrolRequestingMinimumReinforcements(iPatrolID: INT32): boolean {
    let pGroup: GROUP | null;

    if (gPatrolGroup[iPatrolID].ubPendingGroupID) {
      return false;
    }
    if (!PermittedToFillPatrolGroup(iPatrolID)) {
      // if the group was defeated, it won't be considered for reinforcements again for several days
      return false;
    }
    pGroup = GetGroup(gPatrolGroup[iPatrolID].ubGroupID);
    if (pGroup) {
      if (
        gPatrolGroup[iPatrolID].bSize - pGroup.ubGroupSize >=
        gubMinEnemyGroupSize
      ) {
        return true;
      }
    }
    return false;
  }

  function EliminateSurplusTroopsForGarrison(
    pGroup: GROUP,
    pSector: SECTORINFO,
  ): void {
    let iTotal: INT32;

    Assert(pGroup.pEnemyGroup);
    iTotal =
      pGroup.pEnemyGroup.ubNumTroops +
      pGroup.pEnemyGroup.ubNumElites +
      pGroup.pEnemyGroup.ubNumAdmins +
      pSector.ubNumTroops +
      pSector.ubNumElites +
      pSector.ubNumAdmins;
    if (iTotal <= MAX_STRATEGIC_TEAM_SIZE) {
      return;
    }
    iTotal -= MAX_STRATEGIC_TEAM_SIZE;
    while (iTotal) {
      if (pGroup.pEnemyGroup.ubNumAdmins) {
        if (pGroup.pEnemyGroup.ubNumAdmins < iTotal) {
          iTotal -= pGroup.pEnemyGroup.ubNumAdmins;
          pGroup.pEnemyGroup.ubNumAdmins = 0;
        } else {
          pGroup.pEnemyGroup.ubNumAdmins -= iTotal;
          iTotal = 0;
        }
      } else if (pSector.ubNumAdmins) {
        if (pSector.ubNumAdmins < iTotal) {
          iTotal -= pSector.ubNumAdmins;
          pSector.ubNumAdmins = 0;
        } else {
          pSector.ubNumAdmins -= iTotal;
          iTotal = 0;
        }
      } else if (pGroup.pEnemyGroup.ubNumTroops) {
        if (pGroup.pEnemyGroup.ubNumTroops < iTotal) {
          iTotal -= pGroup.pEnemyGroup.ubNumTroops;
          pGroup.pEnemyGroup.ubNumTroops = 0;
        } else {
          pGroup.pEnemyGroup.ubNumTroops -= iTotal;
          iTotal = 0;
        }
      } else if (pSector.ubNumTroops) {
        if (pSector.ubNumTroops < iTotal) {
          iTotal -= pSector.ubNumTroops;
          pSector.ubNumTroops = 0;
        } else {
          pSector.ubNumTroops -= iTotal;
          iTotal = 0;
        }
      } else if (pGroup.pEnemyGroup.ubNumElites) {
        if (pGroup.pEnemyGroup.ubNumElites < iTotal) {
          iTotal -= pGroup.pEnemyGroup.ubNumElites;
          pGroup.pEnemyGroup.ubNumElites = 0;
        } else {
          pGroup.pEnemyGroup.ubNumElites -= iTotal;
          iTotal = 0;
        }
      } else if (pSector.ubNumElites) {
        if (pSector.ubNumElites < iTotal) {
          iTotal -= pSector.ubNumElites;
          pSector.ubNumElites = 0;
        } else {
          pSector.ubNumElites -= iTotal;
          iTotal = 0;
        }
      }
    }
  }

  // once Queen is awake, she'll gradually begin replacing admins with regular troops.  This is mainly to keep player from
  // fighting many more admins once they are no longer any challenge for him.  Eventually all admins will vanish off map.
  function UpgradeAdminsToTroops(): void {
    let i: INT32;
    let pSector: SECTORINFO;
    let bPriority: INT8;
    let ubAdminsToCheck: UINT8;
    let pGroup: GROUP | null;
    let sPatrolIndex: INT16;

    // on normal, AI evaluates approximately every 10 hrs.  There are about 130 administrators seeded on the map.
    // Some of these will be killed by the player.

    // check all garrisons for administrators
    for (i = 0; i < giGarrisonArraySize; i++) {
      // skip sector if it's currently loaded, we'll never upgrade guys in those
      if (
        SECTOR(gWorldSectorX, gWorldSectorY) == gGarrisonGroup[i].ubSectorID
      ) {
        continue;
      }

      pSector = SectorInfo[gGarrisonGroup[i].ubSectorID];

      // if there are any admins currently in this garrison
      if (pSector.ubNumAdmins > 0) {
        bPriority = gArmyComp[gGarrisonGroup[i].ubComposition].bPriority;

        // highest priority sectors are upgraded first. Each 1% of progress lower the
        // priority threshold required to start triggering upgrades by 10%.
        if (100 - 10 * HighestPlayerProgressPercentage() < bPriority) {
          ubAdminsToCheck = pSector.ubNumAdmins;

          while (ubAdminsToCheck > 0) {
            // chance to upgrade at each check is random, and also dependant on the garrison's priority
            if (Chance(bPriority)) {
              pSector.ubNumAdmins--;
              pSector.ubNumTroops++;
            }

            ubAdminsToCheck--;
          }
        }
      }
    }

    // check all moving enemy groups for administrators
    pGroup = gpGroupList;
    while (pGroup) {
      if (pGroup.ubGroupSize && !pGroup.fPlayer && !pGroup.fVehicle) {
        Assert(pGroup.pEnemyGroup);

        // skip sector if it's currently loaded, we'll never upgrade guys in those
        if (
          pGroup.ubSectorX == gWorldSectorX &&
          pGroup.ubSectorY == gWorldSectorY
        ) {
          pGroup = pGroup.next;
          continue;
        }

        // if there are any admins currently in this group
        if (pGroup.pEnemyGroup.ubNumAdmins > 0) {
          // if it's a patrol group
          if (pGroup.pEnemyGroup.ubIntention == Enum184.PATROL) {
            sPatrolIndex = FindPatrolGroupIndexForGroupID(pGroup.ubGroupID);
            Assert(sPatrolIndex != -1);

            // use that patrol's priority
            bPriority = gPatrolGroup[sPatrolIndex].bPriority;
          } // not a patrol group
          else {
            // use a default priority
            bPriority = 50;
          }

          // highest priority groups are upgraded first. Each 1% of progress lower the
          // priority threshold required to start triggering upgrades by 10%.
          if (100 - 10 * HighestPlayerProgressPercentage() < bPriority) {
            ubAdminsToCheck = pGroup.pEnemyGroup.ubNumAdmins;

            while (ubAdminsToCheck > 0) {
              // chance to upgrade at each check is random, and also dependant on the group's priority
              if (Chance(bPriority)) {
                pGroup.pEnemyGroup.ubNumAdmins--;
                pGroup.pEnemyGroup.ubNumTroops++;
              }

              ubAdminsToCheck--;
            }
          }
        }
      }

      pGroup = pGroup.next;
    }
  }

  function FindPatrolGroupIndexForGroupID(ubGroupID: UINT8): INT16 {
    let sPatrolIndex: INT16;

    for (sPatrolIndex = 0; sPatrolIndex < giPatrolArraySize; sPatrolIndex++) {
      if (gPatrolGroup[sPatrolIndex].ubGroupID == ubGroupID) {
        // found it
        return sPatrolIndex;
      }
    }

    // not there!
    return -1;
  }

  function FindPatrolGroupIndexForGroupIDPending(ubGroupID: UINT8): INT16 {
    let sPatrolIndex: INT16;

    for (sPatrolIndex = 0; sPatrolIndex < giPatrolArraySize; sPatrolIndex++) {
      if (gPatrolGroup[sPatrolIndex].ubPendingGroupID == ubGroupID) {
        // found it
        return sPatrolIndex;
      }
    }

    // not there!
    return -1;
  }

  function FindGarrisonIndexForGroupIDPending(ubGroupID: UINT8): INT16 {
    let sGarrisonIndex: INT16;

    for (
      sGarrisonIndex = 0;
      sGarrisonIndex < giGarrisonArraySize;
      sGarrisonIndex++
    ) {
      if (gGarrisonGroup[sGarrisonIndex].ubPendingGroupID == ubGroupID) {
        // found it
        return sGarrisonIndex;
      }
    }

    // not there!
    return -1;
  }

  function TransferGroupToPool(pGroup: Pointer<GROUP>): void {
    giReinforcementPool += pGroup.value.ubGroupSize;
    RemovePGroup(pGroup.value);
    pGroup.value = <GROUP>(<unknown>null);
  }

  // NOTE:  Make sure you call SetEnemyGroupSector() first if the group is between sectors!!  See example in ReassignAIGroup()...
  function SendGroupToPool(pGroup: Pointer<GROUP>): void {
    if (pGroup.value.ubSectorX == 3 && pGroup.value.ubSectorY == 16) {
      TransferGroupToPool(pGroup);
    } else {
      pGroup.value.ubSectorIDOfLastReassignment = SECTOR(
        pGroup.value.ubSectorX,
        pGroup.value.ubSectorY,
      );
      MoveSAIGroupToSector(
        pGroup,
        Enum123.SEC_P3,
        Enum172.EVASIVE,
        Enum184.REINFORCEMENTS,
      );
    }
  }

  function ReassignAIGroup(pGroup: Pointer<GROUP>): void {
    let i: INT32;
    let iRandom: INT32;
    let iWeight: INT32;
    let usDefencePoints: UINT16 = 0;
    let usDefencePoints__Pointer = createPointer(
      () => usDefencePoints,
      (v) => (usDefencePoints = v),
    );
    let iReloopLastIndex: INT32 = -1;
    let ubSectorID: UINT8;

    ubSectorID = SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY);

    pGroup.value.ubSectorIDOfLastReassignment = ubSectorID;

    ClearPreviousAIGroupAssignment(pGroup.value);

    // First thing to do, is teleport the group to be AT the sector he is currently moving from.  Otherwise, the
    // strategic pathing can break if the group is between sectors upon reassignment.
    SetEnemyGroupSector(pGroup.value, ubSectorID);

    if (giRequestPoints <= 0) {
      // we have no request for reinforcements, so send the group to Meduna for reassignment in the pool.
      SendGroupToPool(pGroup);
      return;
    }

    // now randomly choose who gets the reinforcements.
    // giRequestPoints is the combined sum of all the individual weights of all garrisons and patrols requesting reinforcements
    iRandom = Random(giRequestPoints);

    // go through garrisons first and begin considering where the random value dictates.  If that garrison doesn't require
    // reinforcements, it'll continue on considering all subsequent garrisons till the end of the array.  If it fails at that
    // point, it'll restart the loop at zero, and consider all garrisons to the index that was first considered by the random value.
    for (i = 0; i < giGarrisonArraySize; i++) {
      RecalculateGarrisonWeight(i);
      iWeight = gGarrisonGroup[i].bWeight;
      if (iWeight > 0) {
        // if group is requesting reinforcements.
        if (iRandom < iWeight) {
          if (
            !gGarrisonGroup[i].ubPendingGroupID &&
            EnemyPermittedToAttackSector(null, gGarrisonGroup[i].ubSectorID) &&
            GarrisonRequestingMinimumReinforcements(i)
          ) {
            // This is the group that gets the reinforcements!
            if (ReinforcementsApproved(i, usDefencePoints__Pointer)) {
              SendReinforcementsForGarrison(i, usDefencePoints, pGroup);
              return;
            }
          }
          if (iReloopLastIndex == -1) {
            // go to the next garrison and clear the iRandom value so it attempts to use all subsequent groups.
            iReloopLastIndex = i - 1;
            iRandom = 0;
          }
        }
        // Decrease the iRandom value until it hits 0.  When that happens, all garrisons will get considered until
        // we either have a match or process all of the garrisons.
        iRandom -= iWeight;
      }
    }
    if (iReloopLastIndex >= 0) {
      // Process the loop again to the point where the original random slot started considering, and consider
      // all of the garrisons.  If this fails, all patrol groups will be considered next.
      for (i = 0; i <= iReloopLastIndex; i++) {
        RecalculateGarrisonWeight(i);
        iWeight = gGarrisonGroup[i].bWeight;
        if (iWeight > 0) {
          // if group is requesting reinforcements.
          if (
            !gGarrisonGroup[i].ubPendingGroupID &&
            EnemyPermittedToAttackSector(null, gGarrisonGroup[i].ubSectorID) &&
            GarrisonRequestingMinimumReinforcements(i)
          ) {
            // This is the group that gets the reinforcements!
            if (ReinforcementsApproved(i, usDefencePoints__Pointer)) {
              SendReinforcementsForGarrison(i, usDefencePoints, pGroup);
              return;
            }
          }
        }
      }
    }
    if (iReloopLastIndex == -1) {
      // go through the patrol groups
      for (i = 0; i < giPatrolArraySize; i++) {
        RecalculatePatrolWeight(i);
        iWeight = gPatrolGroup[i].bWeight;
        if (iWeight > 0) {
          if (iRandom < iWeight) {
            if (
              !gPatrolGroup[i].ubPendingGroupID &&
              PatrolRequestingMinimumReinforcements(i)
            ) {
              // This is the group that gets the reinforcements!
              SendReinforcementsForPatrol(i, pGroup);
              return;
            }
          }
          if (iReloopLastIndex == -1) {
            iReloopLastIndex = i - 1;
            iRandom = 0;
          }
          iRandom -= iWeight;
        }
      }
    } else {
      iReloopLastIndex = giPatrolArraySize - 1;
    }

    for (i = 0; i <= iReloopLastIndex; i++) {
      RecalculatePatrolWeight(i);
      iWeight = gPatrolGroup[i].bWeight;
      if (iWeight > 0) {
        if (
          !gPatrolGroup[i].ubPendingGroupID &&
          PatrolRequestingMinimumReinforcements(i)
        ) {
          // This is the group that gets the reinforcements!
          SendReinforcementsForPatrol(i, pGroup);
          return;
        }
      }
    }
    TransferGroupToPool(pGroup);
  }

  // When an enemy AI group is eliminated by the player, apply a grace period in which the
  // group isn't allowed to be filled for several days.
  function TagSAIGroupWithGracePeriod(pGroup: GROUP | null): void {
    let iPatrolID: INT32;
    if (pGroup) {
      iPatrolID = FindPatrolGroupIndexForGroupID(pGroup.ubGroupID);
      if (iPatrolID != -1) {
        switch (gGameOptions.ubDifficultyLevel) {
          case Enum9.DIF_LEVEL_EASY:
            gPatrolGroup[iPatrolID].bFillPermittedAfterDayMod100 =
              (GetWorldDay() + EASY_PATROL_GRACE_PERIOD_IN_DAYS) % 100;
            break;
          case Enum9.DIF_LEVEL_MEDIUM:
            gPatrolGroup[iPatrolID].bFillPermittedAfterDayMod100 =
              (GetWorldDay() + NORMAL_PATROL_GRACE_PERIOD_IN_DAYS) % 100;
            break;
          case Enum9.DIF_LEVEL_HARD:
            gPatrolGroup[iPatrolID].bFillPermittedAfterDayMod100 =
              (GetWorldDay() + HARD_PATROL_GRACE_PERIOD_IN_DAYS) % 100;
            break;
        }
      }
    }
  }

  function PermittedToFillPatrolGroup(iPatrolID: INT32): boolean {
    let iDay: INT32;
    let iDayAllowed: INT32;
    iDay = GetWorldDay();
    iDayAllowed =
      gPatrolGroup[iPatrolID].bFillPermittedAfterDayMod100 +
      Math.trunc(iDay / 100) * 100;
    return iDay >= iDayAllowed;
  }

  export function RepollSAIGroup(pGroup: GROUP): void {
    let i: INT32;
    Assert(!pGroup.fPlayer);
    if (GroupAtFinalDestination(pGroup)) {
      EvaluateGroupSituation(pGroup);
      return;
    }
    for (i = 0; i < giPatrolArraySize; i++) {
      if (gPatrolGroup[i].ubGroupID == pGroup.ubGroupID) {
        RecalculatePatrolWeight(i); // in case there are any dead enemies
        CalculateNextMoveIntention(pGroup);
        return;
      }
    }
    for (i = 0; i < giGarrisonArraySize; i++) {
      // KM : August 6, 1999 Patch fix
      //     Ack, wasn't checking for the matching group to garrison
      if (gGarrisonGroup[i].ubPendingGroupID == pGroup.ubGroupID) {
        // end
        RecalculateGarrisonWeight(i); // in case there are any dead enemies
        CalculateNextMoveIntention(pGroup);
        return;
      }
    }
  }

  export function ClearPreviousAIGroupAssignment(pGroup: GROUP): void {
    let i: INT32;
    for (i = 0; i < giPatrolArraySize; i++) {
      if (gPatrolGroup[i].ubGroupID == pGroup.ubGroupID) {
        gPatrolGroup[i].ubGroupID = 0;
        RecalculatePatrolWeight(i);
        return;
      }
      if (gPatrolGroup[i].ubPendingGroupID == pGroup.ubGroupID) {
        gPatrolGroup[i].ubPendingGroupID = 0;
        return;
      }
    }
    // Also check if this group was a garrison's pending group
    for (i = 0; i < giGarrisonArraySize; i++) {
      if (gGarrisonGroup[i].ubPendingGroupID == pGroup.ubGroupID) {
        gGarrisonGroup[i].ubPendingGroupID = 0;
        return;
      }
    }
  }

  function CalcNumTroopsBasedOnComposition(
    ubTotal: UINT8,
    iCompositionID: INT32,
  ): { ubNumTroops: UINT8; ubNumElites: UINT8 } {
    let ubNumTroops: UINT8;
    let ubNumElites: UINT8;

    ubNumTroops = Math.trunc(
      (gArmyComp[iCompositionID].bTroopPercentage * ubTotal) / 100,
    );
    ubNumElites = Math.trunc(
      (gArmyComp[iCompositionID].bElitePercentage * ubTotal) / 100,
    );

    // Due to low roundoff, it is highly possible that we will be short one soldier.
    while (ubNumTroops + ubNumElites < ubTotal) {
      if (Chance(gArmyComp[iCompositionID].bTroopPercentage)) {
        ubNumTroops++;
      } else {
        ubNumElites++;
      }
    }
    Assert(ubNumTroops + ubNumElites == ubTotal);

    return { ubNumTroops, ubNumElites };
  }

  function ConvertGroupTroopsToComposition(
    pGroup: GROUP,
    iCompositionID: INT32,
  ): void {
    Assert(pGroup);
    Assert(pGroup.pEnemyGroup);
    Assert(!pGroup.fPlayer);
    ({
      ubNumTroops: pGroup.pEnemyGroup.ubNumTroops,
      ubNumElites: pGroup.pEnemyGroup.ubNumElites,
    } = CalcNumTroopsBasedOnComposition(pGroup.ubGroupSize, iCompositionID));
    pGroup.pEnemyGroup.ubNumAdmins = 0;
    pGroup.ubGroupSize =
      pGroup.pEnemyGroup.ubNumTroops + pGroup.pEnemyGroup.ubNumElites;
    ValidateLargeGroup(pGroup);
  }

  function RemoveSoldiersFromGarrisonBasedOnComposition(
    iGarrisonID: INT32,
    ubSize: UINT8,
  ): void {
    let pSector: SECTORINFO;
    let iCompositionID: INT32;
    let ubNumTroops: UINT8;
    let ubNumElites: UINT8;

    // debug stuff
    let ubOrigSectorAdmins: UINT8;
    let ubOrigSectorTroops: UINT8;
    let ubOrigSectorElites: UINT8;
    let ubOrigNumElites: UINT8;
    let ubOrigNumTroops: UINT8;
    let ubOrigSize: UINT8;

    iCompositionID = gGarrisonGroup[iGarrisonID].ubComposition;

    ({ ubNumTroops, ubNumElites } = CalcNumTroopsBasedOnComposition(
      ubSize,
      iCompositionID,
    ));
    pSector = SectorInfo[gGarrisonGroup[iGarrisonID].ubSectorID];
    // if there are administrators in this sector, remove them first.

    ubOrigNumElites = ubNumElites;
    ubOrigNumTroops = ubNumTroops;
    ubOrigSectorAdmins = pSector.ubNumAdmins;
    ubOrigSectorTroops = pSector.ubNumTroops;
    ubOrigSectorElites = pSector.ubNumElites;
    ubOrigSize = ubSize;

    while (ubSize && pSector.ubNumAdmins) {
      pSector.ubNumAdmins--;
      ubSize--;
      if (ubNumTroops) {
        ubNumTroops--;
      } else {
        ubNumElites--;
      }
    }
    // No administrators are left.

    // Eliminate the troops
    while (ubNumTroops) {
      if (pSector.ubNumTroops) {
        pSector.ubNumTroops--;
      } else if (pSector.ubNumElites) {
        pSector.ubNumElites--;
      } else {
        Assert(false);
      }
      ubNumTroops--;
    }

    // Eliminate the elites
    while (ubNumElites) {
      if (pSector.ubNumElites) {
        pSector.ubNumElites--;
      } else if (pSector.ubNumTroops) {
        pSector.ubNumTroops--;
      } else {
        Assert(false);
      }
      ubNumElites--;
    }

    RecalculateGarrisonWeight(iGarrisonID);
  }

  function MoveSAIGroupToSector(
    pGroup: Pointer<GROUP>,
    ubSectorID: UINT8,
    uiMoveCode: UINT32,
    ubIntention: UINT8,
  ): void {
    let ubDstSectorX: UINT8;
    let ubDstSectorY: UINT8;

    ubDstSectorX = SECTORX(ubSectorID);
    ubDstSectorY = SECTORY(ubSectorID);

    if (pGroup.value.fBetweenSectors) {
      SetEnemyGroupSector(
        pGroup.value,
        SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY),
      );
    }

    (<ENEMYGROUP>pGroup.value.pEnemyGroup).ubIntention = ubIntention;
    pGroup.value.ubMoveType = Enum185.ONE_WAY;

    if (ubIntention == Enum184.PURSUIT) {
      // Make sure that the group isn't moving into a garrison sector.  These sectors should be using ASSAULT intentions!
      if (SectorInfo[ubSectorID].ubGarrisonID != NO_GARRISON) {
        // Good place for a breakpoint.
        pGroup = pGroup;
      }
    }

    if (
      pGroup.value.ubSectorX == ubDstSectorX &&
      pGroup.value.ubSectorY == ubDstSectorY
    ) {
      // The destination sector is the current location.  Instead of causing code logic problems,
      // simply process them as if they just arrived.
      if (EvaluateGroupSituation(pGroup.value)) {
        // The group was deleted.
        pGroup.value = <GROUP>(<unknown>null);
        return;
      }
    }

    switch (uiMoveCode) {
      case Enum172.STAGE:
        MoveGroupFromSectorToSectorButAvoidPlayerInfluencedSectorsAndStopOneSectorBeforeEnd(
          pGroup.value.ubGroupID,
          pGroup.value.ubSectorX,
          pGroup.value.ubSectorY,
          ubDstSectorX,
          ubDstSectorY,
        );
        break;
      case Enum172.EVASIVE:
        MoveGroupFromSectorToSectorButAvoidPlayerInfluencedSectors(
          pGroup.value.ubGroupID,
          pGroup.value.ubSectorX,
          pGroup.value.ubSectorY,
          ubDstSectorX,
          ubDstSectorY,
        );
        break;
      case Enum172.DIRECT:
      default:
        MoveGroupFromSectorToSector(
          pGroup.value.ubGroupID,
          pGroup.value.ubSectorX,
          pGroup.value.ubSectorY,
          ubDstSectorX,
          ubDstSectorY,
        );
        break;
    }
    // Make sure that the group is moving.  If this fails, then the pathing may have failed for some reason.
    ValidateGroup(pGroup.value);
  }

  // If there are any enemy groups that will be moving through this sector due, they will have to repath which
  // will cause them to avoid the sector.  Returns the number of redirected groups.
  function RedirectEnemyGroupsMovingThroughSector(
    ubSectorX: UINT8,
    ubSectorY: UINT8,
  ): UINT8 {
    let pGroup: GROUP | null;
    let ubNumGroupsRedirected: UINT8 = 0;
    let pWaypoint: WAYPOINT | null;
    let ubDestSectorID: UINT8;
    pGroup = gpGroupList;
    while (pGroup) {
      if (!pGroup.fPlayer && pGroup.ubMoveType == Enum185.ONE_WAY) {
        // check the waypoint list
        if (GroupWillMoveThroughSector(pGroup, ubSectorX, ubSectorY)) {
          // extract the group's destination.
          pWaypoint = GetFinalWaypoint(pGroup);
          Assert(pWaypoint);
          ubDestSectorID = SECTOR(pWaypoint.x, pWaypoint.y);
          SetEnemyGroupSector(
            pGroup,
            SECTOR(pGroup.ubSectorX, pGroup.ubSectorY),
          );
          MoveSAIGroupToSector(
            createPointer(
              () => <GROUP>pGroup,
              (v) => (pGroup = v),
            ),
            ubDestSectorID,
            Enum172.EVASIVE,
            (<ENEMYGROUP>pGroup.pEnemyGroup).ubIntention,
          );
          ubNumGroupsRedirected++;
        }
      }
      pGroup = pGroup.next;
    }
    if (ubNumGroupsRedirected) {
      ScreenMsg(
        FONT_LTBLUE,
        MSG_BETAVERSION,
        "Test message for new feature:  %d enemy groups were redirected away from moving through sector %s%d.  Please don't report unless this number is greater than 5.",
        ubNumGroupsRedirected,
        String.fromCharCode(ubSectorY + "A".charCodeAt(0) - 1),
        ubSectorX,
      );
    }
    return ubNumGroupsRedirected;
  }

  // when the SAI compositions change, it is necessary to call this function upon version load,
  // to reflect the changes of the compositions to the sector that haven't been visited yet.
  function ReinitializeUnvisitedGarrisons(): void {
    let pSector: SECTORINFO;
    let pArmyComp: ARMY_COMPOSITION;
    let pGroup: GROUP | null;
    let i: INT32;
    let cnt: INT32;
    let iEliteChance: INT32;
    let iAdminChance: INT32;

    // Recreate the compositions
    copyObjectArray(gArmyComp, gOrigArmyComp, copyArmyComposition);
    EvolveQueenPriorityPhase(true);

    // Go through each unvisited sector and recreate the garrison forces based on
    // the desired population.
    for (i = 0; i < giGarrisonArraySize; i++) {
      if (
        gGarrisonGroup[i].ubComposition >= Enum174.LEVEL1_DEFENCE &&
        gGarrisonGroup[i].ubComposition <= Enum174.LEVEL3_DEFENCE
      ) {
        // These 3 compositions make up the perimeter around Meduna.  The existance of these are based on the
        // difficulty level, and we don't want to reset these anyways, due to the fact that many of the reinforcements
        // come from these sectors, and it could potentially add upwards of 150 extra troops which would seriously
        // unbalance the difficulty.
        continue;
      }
      pSector = SectorInfo[gGarrisonGroup[i].ubSectorID];
      pArmyComp = gArmyComp[gGarrisonGroup[i].ubComposition];
      if (!(pSector.uiFlags & SF_ALREADY_VISITED)) {
        pSector.ubNumAdmins = 0;
        pSector.ubNumTroops = 0;
        pSector.ubNumElites = 0;
        if (gfQueenAIAwake) {
          cnt = pArmyComp.bDesiredPopulation;
        } else {
          cnt = pArmyComp.bStartPopulation;
        }

        if (gGarrisonGroup[i].ubPendingGroupID) {
          // if the garrison has reinforcements on route, then subtract the number of
          // reinforcements from the value we reset the size of the garrison.  This is to
          // prevent overfilling the group.
          pGroup = GetGroup(gGarrisonGroup[i].ubPendingGroupID);
          if (pGroup) {
            cnt -= pGroup.ubGroupSize;
            cnt = Math.max(cnt, 0);
          }
        }

        iEliteChance = pArmyComp.bElitePercentage;
        iAdminChance = pArmyComp.bAdminPercentage;
        if (iAdminChance && !gfQueenAIAwake && cnt) {
          pSector.ubNumAdmins = Math.trunc((iAdminChance * cnt) / 100);
        } else
          while (cnt--) {
            // for each person, randomly determine the types of each soldier.
            if (Chance(iEliteChance)) {
              pSector.ubNumElites++;
            } else {
              pSector.ubNumTroops++;
            }
          }
      }
    }
  }

  function FindPendingGroupForGarrisonSector(ubSectorID: UINT8): GROUP | null {
    let pGroup: GROUP;
    let pSector: SECTORINFO;
    pSector = SectorInfo[ubSectorID];
    if (pSector.ubGarrisonID != NO_GARRISON) {
      if (gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID) {
        pGroup = GetGroup(
          gGarrisonGroup[pSector.ubGarrisonID].ubPendingGroupID,
        );
        Assert(pGroup);
        return pGroup;
      }
    }
    return null;
  }
}
