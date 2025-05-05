namespace ja2 {
  const STEPS_FOR_BULLET_MOVE_TRAILS = 10;
  const STEPS_FOR_BULLET_MOVE_SMALL_TRAILS = 5;
  const STEPS_FOR_BULLET_MOVE_FIRE_TRAILS = 5;

  const ALWAYS_CONSIDER_HIT =
    STRUCTURE_WALLSTUFF | STRUCTURE_CAVEWALL | STRUCTURE_FENCE;

  let gusLOSStartGridNo: UINT16 = 0;
  let gusLOSEndGridNo: UINT16 = 0;
  let gusLOSStartSoldier: UINT16 = NOBODY;
  let gusLOSEndSoldier: UINT16 = NOBODY;

  /* static */ let gqStandardWallHeight: FIXEDPT =
    INT32_TO_FIXEDPT(WALL_HEIGHT_UNITS);
  /* static */ let gqStandardWindowBottomHeight: FIXEDPT = INT32_TO_FIXEDPT(
    WINDOW_BOTTOM_HEIGHT_UNITS,
  );
  /* static */ let gqStandardWindowTopHeight: FIXEDPT = INT32_TO_FIXEDPT(
    WINDOW_TOP_HEIGHT_UNITS,
  );

  /* static */ let ddShotgunSpread: DOUBLE[][][] /* [3][BUCKSHOT_SHOTS][2] */ =
    [
      [
        // spread of about 2 degrees in all directions
        // Horiz,	 Vert
        [0.0, 0.0],
        [-0.012, 0.0],
        [+0.012, 0.0],
        [0.0, -0.012],
        [0.0, +0.012],
        [-0.008, -0.008],
        [-0.008, +0.008],
        [+0.008, -0.008],
        [+0.008, +0.008],
      ],
      [
        // duckbill flattens the spread and makes it wider horizontally (5 degrees)
        // Horiz,	 Vert
        [0.0, 0.0],
        [-0.008, 0.0],
        [+0.008, 0.0],
        [-0.016, 0.0],
        [+0.016, 0.0],
        [-0.024, 0.0],
        [+0.024, 0.0],
        [-0.032, 0.0],
        [+0.032, 0.0],
      ],
      [
        // flamethrower more spread out
        // Horiz,	 Vert
        [0.0, 0.0],
        [-0.12, 0.0],
        [+0.12, 0.0],
        [0.0, -0.12],
        [0.0, +0.12],
        [-0.08, -0.08],
        [-0.08, +0.08],
        [+0.08, -0.08],
        [+0.08, +0.08],
      ],
    ];

  /* static */ let gubTreeSightReduction: UINT8[] /* [ANIM_STAND + 1] */ = [
    0,
    8, // prone
    0,
    7, // crouched
    0,
    0,
    6, // standing
  ];

  const MAX_DIST_FOR_LESS_THAN_MAX_CHANCE_TO_HIT_STRUCTURE = 25;

  const MAX_CHANCE_OF_HITTING_STRUCTURE = 90;

  /* static */ let guiStructureHitChance: UINT32[] /* [MAX_DIST_FOR_LESS_THAN_MAX_CHANCE_TO_HIT_STRUCTURE + 1] */ =
    [
      0, // 0 tiles
      0,
      0,
      2,
      4,
      7, // 5 tiles
      10,
      14,
      18,
      23,
      28, // 10 tiles
      34,
      40,
      47,
      54,
      60, // 15 tiles
      66,
      71,
      74,
      76,
      78, // 20 tiles
      80,
      82,
      84,
      86,
      88, // 25 tiles
    ];

  const PERCENT_BULLET_SLOWED_BY_RANGE = 25;

  const MIN_DIST_FOR_HIT_FRIENDS = 30;
  const MIN_DIST_FOR_HIT_FRIENDS_UNAIMED = 15;
  const MIN_CHANCE_TO_ACCIDENTALLY_HIT_SOMEONE = 3;

  const RADIANS_IN_CIRCLE = 6.283;
  const DEGREES_22_5 = (RADIANS_IN_CIRCLE * 22.5) / 360;
  const DEGREES_45 = (RADIANS_IN_CIRCLE * 45) / 360;
  // note: these values are in RADIANS!!
  // equal to 15 degrees
  const MAX_AIMING_SCREWUP = (RADIANS_IN_CIRCLE * 15) / 360;
  // min aiming screwup is X degrees, gets divided by distance in tiles
  const MIN_AIMING_SCREWUP = (RADIANS_IN_CIRCLE * 22) / 360;
  //#define MAX_AIMING_SCREWUP 0.2618
  // equal to 10 degrees
  //#define MAX_AIMING_SCREWUP_VERTIC 0.1745

  const SMELL_REDUCTION_FOR_NEARBY_OBSTACLE = 80;

  const STANDING_CUBES = 3;

  // MoveBullet and ChanceToGetThrough use this array to maintain which
  // of which structures in a tile might be hit by a bullet.

  const MAX_LOCAL_STRUCTURES = 20;

  let gpLocalStructure: STRUCTURE[] /* Pointer<STRUCTURE>[MAX_LOCAL_STRUCTURES] */ =
    createArray(MAX_LOCAL_STRUCTURES, <STRUCTURE>(<unknown>null));
  let guiLocalStructureCTH: UINT32[] /* [MAX_LOCAL_STRUCTURES] */ = createArray(
    MAX_LOCAL_STRUCTURES,
    0,
  );
  let gubLocalStructureNumTimesHit: UINT8[] /* [MAX_LOCAL_STRUCTURES] */ =
    createArray(MAX_LOCAL_STRUCTURES, 0);

  function FloatToFixed(dN: FLOAT): FIXEDPT {
    let qN: FIXEDPT;
    // verify that dN is within the range storable by FIXEDPT?

    // first get the whole part
    qN = Math.trunc(dN * FIXEDPT_FRACTIONAL_RESOLUTION);

    // qN = INT32_TO_FIXEDPT( (INT32)dN );
    // now add the fractional part
    // qN += (INT32)(((dN - (INT32) dN)) * FIXEDPT_FRACTIONAL_RESOLUTION);

    return qN;
  }

  function FixedToFloat(qN: FIXEDPT): FLOAT {
    return qN / FIXEDPT_FRACTIONAL_RESOLUTION;
  }

  //
  // fixed-point arithmetic stuff ends here
  //

  function Distance3D(dDeltaX: FLOAT, dDeltaY: FLOAT, dDeltaZ: FLOAT): FLOAT {
    return Math.sqrt(dDeltaX * dDeltaX + dDeltaY * dDeltaY + dDeltaZ * dDeltaZ);
  }

  function Distance2D(dDeltaX: FLOAT, dDeltaY: FLOAT): FLOAT {
    return Math.sqrt(dDeltaX * dDeltaX + dDeltaY * dDeltaY);
  }

  //#define DEBUGLOS

  const DebugLOS = (a: string) => {};

  const enum Enum228 {
    LOC_OTHER,
    LOC_0_4,
    LOC_3_4,
    LOC_4_0,
    LOC_4_3,
    LOC_4_4,
  }

  function ResolveHitOnWall(
    pStructure: STRUCTURE,
    iGridNo: INT32,
    bLOSIndexX: INT8,
    bLOSIndexY: INT8,
    ddHorizAngle: DOUBLE,
  ): boolean {
    let fNorthSouth: boolean;
    let fEastWest: boolean;
    let fTopLeft: boolean;
    let fTopRight: boolean;
    let bLocation: INT8 = Enum228.LOC_OTHER;

    switch (bLOSIndexX) {
      case 0:
        if (bLOSIndexY == 4) {
          bLocation = Enum228.LOC_0_4;
        }
        break;
      case 3:
        if (bLOSIndexY == 4) {
          bLocation = Enum228.LOC_3_4;
        }
        break;
      case 4:
        switch (bLOSIndexY) {
          case 0:
            bLocation = Enum228.LOC_4_0;
            break;
          case 3:
            bLocation = Enum228.LOC_4_3;
            break;
          case 4:
            bLocation = Enum228.LOC_4_4;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

    if (bLocation == Enum228.LOC_OTHER) {
      // these spots always block
      return true;
    }

    // use cartesian angles for god's sakes -CJC
    ddHorizAngle = -ddHorizAngle;

    fNorthSouth =
      (ddHorizAngle < 0 && ddHorizAngle > (-Math.PI * 1) / 2) ||
      (ddHorizAngle > (Math.PI * 1) / 2 && ddHorizAngle < Math.PI);
    fEastWest =
      (ddHorizAngle > 0 && ddHorizAngle < (Math.PI * 1) / 2) ||
      (ddHorizAngle < (-Math.PI * 1) / 2 && ddHorizAngle > -Math.PI);

    fTopLeft =
      pStructure.ubWallOrientation == Enum314.INSIDE_TOP_LEFT ||
      pStructure.ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT;
    fTopRight =
      pStructure.ubWallOrientation == Enum314.INSIDE_TOP_RIGHT ||
      pStructure.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT;

    if (fNorthSouth) {
      // Check N-S at west corner:		4,4 4,3   0,4
      if (bLocation == Enum228.LOC_4_3 || bLocation == Enum228.LOC_4_4) {
        // if wall orientation is top-right, then check S of this location
        // if wall orientation is top-left, then check E of this location
        // if no wall of same orientation there, let bullet through
        if (fTopRight) {
          if (
            !WallOrClosedDoorExistsOfTopRightOrientation(
              iGridNo + DirectionInc(Enum245.SOUTH),
            ) &&
            !WallOrClosedDoorExistsOfTopLeftOrientation(iGridNo) &&
            !OpenRightOrientedDoorWithDoorOnRightOfEdgeExists(
              iGridNo + DirectionInc(Enum245.SOUTH),
            )
          ) {
            return false;
          }
        }
      } else if (bLocation == Enum228.LOC_0_4) {
        if (fTopLeft) {
          if (
            !WallOrClosedDoorExistsOfTopLeftOrientation(
              iGridNo + DirectionInc(Enum245.WEST),
            ) &&
            !WallOrClosedDoorExistsOfTopRightOrientation(
              iGridNo + DirectionInc(Enum245.SOUTHWEST),
            ) &&
            !OpenLeftOrientedDoorWithDoorOnLeftOfEdgeExists(
              iGridNo + DirectionInc(Enum245.WEST),
            )
          ) {
            return false;
          }
        }
      }

      // Check N-S at east corner:		4,4 3,4   4,0
      if (bLocation == Enum228.LOC_4_4 || bLocation == Enum228.LOC_3_4) {
        if (fTopLeft) {
          if (
            !WallOrClosedDoorExistsOfTopLeftOrientation(
              iGridNo + DirectionInc(Enum245.EAST),
            ) &&
            !WallOrClosedDoorExistsOfTopRightOrientation(iGridNo) &&
            !OpenLeftOrientedDoorWithDoorOnLeftOfEdgeExists(
              iGridNo + DirectionInc(Enum245.EAST),
            )
          ) {
            return false;
          }
        }
      } else if (bLocation == Enum228.LOC_4_0) {
        // if door is normal and OPEN and outside type then we let N-S pass
        if (
          pStructure.fFlags & STRUCTURE_DOOR &&
          pStructure.fFlags & STRUCTURE_OPEN
        ) {
          if (
            pStructure.ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT ||
            pStructure.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT
          ) {
            return false;
          }
        } else if (fTopRight) {
          if (
            !WallOrClosedDoorExistsOfTopLeftOrientation(
              iGridNo + DirectionInc(Enum245.NORTHEAST),
            ) &&
            !WallOrClosedDoorExistsOfTopRightOrientation(
              iGridNo + DirectionInc(Enum245.NORTH),
            ) &&
            !OpenLeftOrientedDoorWithDoorOnLeftOfEdgeExists(
              iGridNo + DirectionInc(Enum245.NORTHEAST),
            )
          ) {
            return false;
          }
        }
      }
    }

    if (fEastWest) {
      // Check E-W at north corner:   4,4   4,0		0,4
      if (bLocation == Enum228.LOC_4_4) {
        if (pStructure.ubWallOrientation == Enum314.NO_ORIENTATION) {
          // very top north corner of building, and going (screenwise) west or east
          return false;
        }
      } else if (bLocation == Enum228.LOC_4_0) {
        // maybe looking E-W at (screenwise) north corner of building
        // if wall orientation is top-right, then check N of this location
        // if no wall of same orientation there, let bullet through
        if (fTopRight) {
          if (
            !WallOrClosedDoorExistsOfTopRightOrientation(
              iGridNo + DirectionInc(Enum245.NORTH),
            ) &&
            !WallOrClosedDoorExistsOfTopLeftOrientation(
              iGridNo + DirectionInc(Enum245.NORTH),
            )
          ) {
            return false;
          }
        }
      } else if (bLocation == Enum228.LOC_0_4) {
        // if normal door and OPEN and inside type then we let E-W pass
        if (
          pStructure.fFlags & STRUCTURE_DOOR &&
          pStructure.fFlags & STRUCTURE_OPEN
        ) {
          if (
            pStructure.ubWallOrientation == Enum314.INSIDE_TOP_LEFT ||
            pStructure.ubWallOrientation == Enum314.INSIDE_TOP_RIGHT
          ) {
            return false;
          }
        }

        // if wall orientation is top-left, then check W of this location
        // if no wall of same orientation there, let bullet through
        if (fTopLeft) {
          if (
            !WallOrClosedDoorExistsOfTopLeftOrientation(
              iGridNo + DirectionInc(Enum245.WEST),
            ) &&
            !WallOrClosedDoorExistsOfTopRightOrientation(
              iGridNo + DirectionInc(Enum245.WEST),
            )
          ) {
            return false;
          }
        }
      }

      // Check E-W at south corner:   4,4 3,4 4,3
      if (
        bLocation == Enum228.LOC_3_4 ||
        bLocation == Enum228.LOC_4_4 ||
        bLocation == Enum228.LOC_4_3
      ) {
        if (
          (bLocation == Enum228.LOC_3_4 && fTopLeft) ||
          (bLocation == Enum228.LOC_4_3 && fTopRight) ||
          bLocation == Enum228.LOC_4_4
        ) {
          if (
            !WallOrClosedDoorExistsOfTopLeftOrientation(
              iGridNo + DirectionInc(Enum245.EAST),
            ) &&
            !WallOrClosedDoorExistsOfTopRightOrientation(
              iGridNo + DirectionInc(Enum245.SOUTH),
            ) &&
            !OpenLeftOrientedDoorWithDoorOnLeftOfEdgeExists(
              iGridNo + DirectionInc(Enum245.EAST),
            ) &&
            !OpenRightOrientedDoorWithDoorOnRightOfEdgeExists(
              iGridNo + DirectionInc(Enum245.SOUTH),
            )
          ) {
            return false;
          }
        }
      }
    }

    /*

  */

    // currently handled:
    // E-W at north corner:  (4,4), (0,4), (4,0)
    // N-S at east corner: (4,4)
    // N-S at west corner: (4,4)

    // could add:
    // N-S at east corner: (3, 4), (4, 0)
    // N-S at west corner: (0, 4), (4, 3)
    // E-W at south corner: (4, 4), (3, 4), (4, 3) (completely new)

    /*

          // possibly shooting at corner in which case we should let it pass
          if ( bLOSIndexX == 0)
          {
                  if ( bLOSIndexY == (PROFILE_Y_SIZE - 1))
                  {
                          // maybe looking E-W at (screenwise) north corner of building, or through open door
                          if ( ( ddHorizAngle > (0) && ddHorizAngle < (PI * 1 / 2) ) || ( ddHorizAngle < (-PI * 1 / 2) && ddHorizAngle > ( -PI ) ) )
                          {
                                  // if door is normal and OPEN and inside type then we let E-W pass
                                  if ( (pStructure->fFlags & STRUCTURE_DOOR) && (pStructure->fFlags & STRUCTURE_OPEN) )
                                  {
                                          if ( pStructure->ubWallOrientation == INSIDE_TOP_LEFT || pStructure->ubWallOrientation == INSIDE_TOP_RIGHT )
                                          {
                                                  fResolveHit = FALSE;
                                          }
                                  }

                                  // if wall orientation is top-left, then check W of this location
                                  // if no wall of same orientation there, let bullet through
                                  if ( pStructure->ubWallOrientation == INSIDE_TOP_LEFT || pStructure->ubWallOrientation == OUTSIDE_TOP_LEFT )
                                  {
                                          if (!WallOrClosedDoorExistsOfTopLeftOrientation( (INT16) (iGridNo + DirectionInc( WEST )) ) &&
                                                          !WallOrClosedDoorExistsOfTopRightOrientation( (INT16) (iGridNo + DirectionInc( WEST )) ) )
                                          {
                                                  fResolveHit = FALSE;
                                          }
                                  }
                          }
                          else if ( ( ddHorizAngle < (0) && ddHorizAngle > ( -PI * 1 / 2) ) || ( ddHorizAngle > ( PI * 1 / 2 ) && ddHorizAngle < (PI) ) )
                          {
                                  // maybe looking N-S at (screenwise) west corner of building

                                  // if wall orientation is top-left, then check W of this location
                                  // if no wall of same orientation there, let bullet through
                                  if ( pStructure->ubWallOrientation == INSIDE_TOP_LEFT || pStructure->ubWallOrientation == OUTSIDE_TOP_LEFT )
                                  {
                                          if ( !WallOrClosedDoorExistsOfTopLeftOrientation( (INT16) (iGridNo + DirectionInc( WEST )) ) &&
                                                           !WallOrClosedDoorExistsOfTopRightOrientation( (INT16) (iGridNo + DirectionInc( SOUTHWEST ) ) ) &&
                                                           !OpenLeftOrientedDoorWithDoorOnLeftOfEdgeExists( (INT16) (iGridNo + DirectionInc( WEST )) ) )
                                          {
                                                  fResolveHit = FALSE;
                                          }
                                  }

                          }

                  }
          }
          else if (bLOSIndexX == (PROFILE_X_SIZE - 1))
          {
                  if (bLOSIndexY == 0)
                  {
                          // maybe looking E-W at (screenwise) north corner of building
                          if ( ( ddHorizAngle > (0) && ddHorizAngle < (PI * 1 / 2) ) || ( ddHorizAngle < (-PI * 1 / 2) && ddHorizAngle > ( -PI ) ) )
                          {
                                  // if wall orientation is top-right, then check N of this location
                                  // if no wall of same orientation there, let bullet through
                                  if ( pStructure->ubWallOrientation == INSIDE_TOP_RIGHT || pStructure->ubWallOrientation == OUTSIDE_TOP_RIGHT )
                                  {
                                          if (!WallOrClosedDoorExistsOfTopRightOrientation( (INT16) (iGridNo + DirectionInc( NORTH )) ) &&
                                                          !WallOrClosedDoorExistsOfTopLeftOrientation( (INT16) (iGridNo + DirectionInc( NORTH )) ) )
                                          {
                                                  fResolveHit = FALSE;
                                          }
                                  }
                          }
                          else
                          {
                                  // if door is normal and OPEN and outside type then we let N-S pass
                                  if ( (pStructure->fFlags & STRUCTURE_DOOR) && (pStructure->fFlags & STRUCTURE_OPEN) )
                                  {
                                          if ( pStructure->ubWallOrientation == OUTSIDE_TOP_LEFT || pStructure->ubWallOrientation == OUTSIDE_TOP_RIGHT )
                                          {
                                                  fResolveHit = FALSE;
                                          }
                                  }
                          }
                  }
                  else if ( bLOSIndexY == (PROFILE_Y_SIZE - 1) || bLOSIndexY == (PROFILE_Y_SIZE - 2) )
                  {
                          // maybe (SCREENWISE) west or east corner of building and looking N
                          if ( ( ddHorizAngle < (0) && ddHorizAngle > ( -PI * 1 / 2) ) || ( ddHorizAngle > ( PI * 1 / 2 ) && ddHorizAngle < (PI) ) )
                          {
                                  // if wall orientation is top-right, then check S of this location
                                  // if wall orientation is top-left, then check E of this location
                                  // if no wall of same orientation there, let bullet through
                                  if ( pStructure->ubWallOrientation == INSIDE_TOP_LEFT || pStructure->ubWallOrientation == OUTSIDE_TOP_LEFT )
                                  {
                                          if ( !WallOrClosedDoorExistsOfTopLeftOrientation( (INT16) (iGridNo + DirectionInc( EAST )) ) &&
                                                           !WallOrClosedDoorExistsOfTopRightOrientation( (INT16) (iGridNo) ) &&
                                                           !OpenLeftOrientedDoorWithDoorOnLeftOfEdgeExists( (INT16) (iGridNo + DirectionInc( EAST )) ) )
                                          {
                                                  fResolveHit = FALSE;
                                          }
                                  }
                                  else if ( pStructure->ubWallOrientation == INSIDE_TOP_RIGHT || pStructure->ubWallOrientation == OUTSIDE_TOP_RIGHT )
                                  {
                                          if (!WallOrClosedDoorExistsOfTopRightOrientation( (INT16) (iGridNo + DirectionInc( SOUTH )) ) &&
                                                          !WallOrClosedDoorExistsOfTopLeftOrientation( (INT16) (iGridNo) ) &&
                                                          !OpenRightOrientedDoorWithDoorOnRightOfEdgeExists( (INT16) (iGridNo + DirectionInc( SOUTH )) ) )
                                          {
                                                  fResolveHit = FALSE;
                                          }

                                  }
                          }
                          // the following only at 4,4
                          else if ( bLOSIndexY == (PROFILE_Y_SIZE - 1) )
                          {
                                  if ( pStructure->ubWallOrientation == NO_ORIENTATION)
                                  {
                                          // very top north corner of building, and going (screenwise) west or east
                                          fResolveHit = FALSE;
                                  }
                          }
                  }
          }
          */

    return true;
  }

  /*
   *
   * The line of sight code is now used to simulate smelling through the air (for monsters);
   * It obeys the following rules:
   * - ignores trees and vegetation
   * - ignores people
   * - should always start off with head height for both source and target, so that lying down makes no difference
   * - stop at closed windows
   * - stop for other obstacles
   *
   * Just for reference, normal sight obeys the following rules:
   * - trees & vegetation reduce the maximum sighting distance
   * - ignores people
   * - starts at height relative to stance
   * - ignores windows
   * - stops at other obstacles
   *
   */
  function LineOfSightTest(
    dStartX: FLOAT,
    dStartY: FLOAT,
    dStartZ: FLOAT,
    dEndX: FLOAT,
    dEndY: FLOAT,
    dEndZ: FLOAT,
    ubTileSightLimit: UINT8,
    ubTreeSightReduction: UINT8,
    bAware: boolean /* INT8 */,
    bCamouflage: INT8,
    fSmell: boolean,
    psWindowGridNo: Pointer<INT16> | null,
  ): INT32 {
    // Parameters...
    // the X,Y,Z triplets should be obvious
    // TileSightLimit is the max # of tiles of distance visible
    // TreeSightReduction is the reduction in 10ths of tiles in max visibility for each LOS cube (5th of a tile) of
    // vegetation hit
    // Aware is whether the looker is aware of the target
    // Smell is whether this is a sight or a smell test

    // Now returns not a boolean but the adjusted (by cover) distance to the target, or 0 for unseen

    let qCurrX: FIXEDPT;
    let qCurrY: FIXEDPT;
    let qCurrZ: FIXEDPT;

    let iGridNo: INT32;
    let iCurrTileX: INT32;
    let iCurrTileY: INT32;

    let bLOSIndexX: INT8;
    let bLOSIndexY: INT8;
    let bOldLOSIndexX: INT8;
    let bOldLOSIndexY: INT8;
    let iOldCubesZ: INT32;

    let iCurrCubesZ: INT32;

    let qLandHeight: FIXEDPT;
    let iCurrAboveLevelZ: INT32;
    let iCurrCubesAboveLevelZ: INT32;
    let iStartCubesAboveLevelZ: INT32;
    let iEndCubesAboveLevelZ: INT32;
    let iStartCubesZ: INT32;
    let iEndCubesZ: INT32;

    let sDesiredLevel: INT16;

    let iOldTileX: INT32;
    let iOldTileY: INT32;

    let dDeltaX: FLOAT;
    let dDeltaY: FLOAT;
    let dDeltaZ: FLOAT;

    let qIncrX: FIXEDPT;
    let qIncrY: FIXEDPT;
    let qIncrZ: FIXEDPT;

    let dDistance: FLOAT;

    let iDistance: INT32;
    let iSightLimit: INT32 = ubTileSightLimit * CELL_X_SIZE;
    let iAdjSightLimit: INT32 = iSightLimit;

    let iLoop: INT32;

    let pMapElement: MAP_ELEMENT;
    let pStructure: STRUCTURE | null;
    let pRoofStructure: STRUCTURE | null = null;

    let fCheckForRoof: boolean;
    let qLastZ: FIXEDPT;

    let qDistToTravelX: FIXEDPT;
    let qDistToTravelY: FIXEDPT;
    let iStepsToTravelX: INT32;
    let iStepsToTravelY: INT32;
    let iStepsToTravel: INT32;
    let fResolveHit: boolean;
    let ddHorizAngle: DOUBLE;
    let iStructureHeight: INT32;

    let qWallHeight: FIXEDPT;
    let fOpaque: boolean;
    let bSmoke: INT8 = 0;

    if (gTacticalStatus.uiFlags & DISALLOW_SIGHT) {
      return 0;
    }

    if (iSightLimit == 0) {
      // blind!
      return 0;
    }

    if (!bAware && !fSmell) {
      // trees are x3 as good at reducing sight if looker is unaware
      // and increase that up to double for camouflage!
      ubTreeSightReduction = Math.trunc(
        (ubTreeSightReduction * 3 * (100 + bCamouflage)) / 100,
      );
    }
    // verify start and end to make sure we'll always be inside the map

    // hack end location to the centre of the tile, because there was a problem
    // seeing a presumably off-centre merc...

    dStartX = (dStartX / 10) * 10 + 5;
    dStartY = (dStartY / 10) * 10 + 5;

    dEndX = (dEndX / 10) * 10 + 5;
    dEndY = (dEndY / 10) * 10 + 5;

    dDeltaX = dEndX - dStartX;
    dDeltaY = dEndY - dStartY;
    dDeltaZ = dEndZ - dStartZ;

    dDistance = Distance3D(
      dDeltaX,
      dDeltaY,
      CONVERT_HEIGHTUNITS_TO_DISTANCE(dDeltaZ),
    );
    iDistance = Math.trunc(dDistance);

    if (iDistance == 0) {
      return 0;
    }

    if (dDistance != iDistance) {
      // add 1 step to account for fraction
      iDistance += 1;
    }

    if (iDistance > iSightLimit) {
      // out of visual range
      return 0;
    }

    ddHorizAngle = Math.atan2(dDeltaY, dDeltaX);

    qIncrX = FloatToFixed(dDeltaX / iDistance);
    qIncrY = FloatToFixed(dDeltaY / iDistance);
    qIncrZ = FloatToFixed(dDeltaZ / iDistance);

    fCheckForRoof = false;

    // figure out starting and ending cubes
    iGridNo = GETWORLDINDEXFROMWORLDCOORDS(dStartX, dStartY);
    qCurrZ = FloatToFixed(dStartZ);
    qLandHeight = INT32_TO_FIXEDPT(
      CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[iGridNo].sHeight),
    );
    iCurrAboveLevelZ = FIXEDPT_TO_INT32(qCurrZ - qLandHeight);

    iStartCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(iCurrAboveLevelZ);
    iStartCubesAboveLevelZ = iStartCubesZ;
    if (iStartCubesAboveLevelZ >= STRUCTURE_ON_GROUND_MAX) {
      iStartCubesAboveLevelZ -= STRUCTURE_ON_ROOF;
    }

    // check to see if we need to check for roofs based on the starting gridno
    qWallHeight = gqStandardWallHeight + qLandHeight;
    if (qCurrZ < qWallHeight) {
      // possibly going up through a roof on this level
      qCurrZ = FloatToFixed(dEndZ);

      if (qCurrZ > qWallHeight) {
        fCheckForRoof = true;
      }
    } // >
    else {
      // possibly going down through a roof on this level
      qCurrZ = FloatToFixed(dEndZ);

      if (qCurrZ < qWallHeight) {
        fCheckForRoof = true;
      }
    }

    iGridNo = GETWORLDINDEXFROMWORLDCOORDS(dEndX, dEndY);
    qCurrZ = FloatToFixed(dEndZ);
    qLandHeight = INT32_TO_FIXEDPT(
      CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[iGridNo].sHeight),
    );
    iCurrAboveLevelZ = FIXEDPT_TO_INT32(qCurrZ - qLandHeight);
    iEndCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(iCurrAboveLevelZ);
    iEndCubesAboveLevelZ = iEndCubesZ;
    if (iEndCubesAboveLevelZ >= STRUCTURE_ON_GROUND_MAX) {
      iEndCubesAboveLevelZ -= STRUCTURE_ON_ROOF;
    }

    // check to see if we need to check for roofs based on the starting gridno
    qWallHeight = gqStandardWallHeight + qLandHeight;

    if (qCurrZ < qWallHeight) {
      // possibly going down through a roof on this level
      qCurrZ = FloatToFixed(dStartZ);

      if (qCurrZ > qWallHeight) {
        fCheckForRoof = true;
      }
    } // >
    else {
      // possibly going up through a roof on this level
      qCurrZ = FloatToFixed(dStartZ);

      if (qCurrZ < qWallHeight) {
        fCheckForRoof = true;
      }
    }

    // apply increments for first move

    // first move will be 1 step
    // plus a fractional part equal to half of the difference between the delta and
    // the increment times the distance

    qCurrX =
      FloatToFixed(dStartX) +
      qIncrX +
      Math.trunc((FloatToFixed(dDeltaX) - qIncrX * iDistance) / 2);
    qCurrY =
      FloatToFixed(dStartY) +
      qIncrY +
      Math.trunc((FloatToFixed(dDeltaY) - qIncrY * iDistance) / 2);
    qCurrZ =
      FloatToFixed(dStartZ) +
      qIncrZ +
      Math.trunc((FloatToFixed(dDeltaZ) - qIncrZ * iDistance) / 2);

    iCurrTileX = FIXEDPT_TO_TILE_NUM(qCurrX);
    iCurrTileY = FIXEDPT_TO_TILE_NUM(qCurrY);
    bLOSIndexX = FIXEDPT_TO_LOS_INDEX(qCurrX);
    bLOSIndexY = FIXEDPT_TO_LOS_INDEX(qCurrY);
    iCurrCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(FIXEDPT_TO_INT32(qCurrZ));

    iLoop = 1;

    do {
      // check a particular tile

      // retrieve values from world for this particular tile
      iGridNo = iCurrTileX + iCurrTileY * WORLD_COLS;
      pMapElement = gpWorldLevelData[iGridNo];
      qLandHeight = INT32_TO_FIXEDPT(
        CONVERT_PIXELS_TO_HEIGHTUNITS(pMapElement.sHeight),
      );
      qWallHeight = gqStandardWallHeight + qLandHeight;

      if (fCheckForRoof) {
        pRoofStructure = FindStructure(iGridNo, STRUCTURE_ROOF);

        if (pRoofStructure) {
          qLastZ = qCurrZ - qIncrZ;

          // if just on going to next tile we cross boundary, then roof stops sight here!
          if (
            (qLastZ > qWallHeight && qCurrZ <= qWallHeight) ||
            (qLastZ < qWallHeight && qCurrZ >= qWallHeight)
          ) {
            // hit a roof
            return 0;
          }
        }
      }

      // record old tile location for loop purposes
      iOldTileX = iCurrTileX;
      iOldTileY = iCurrTileY;
      do {
        // check a particular location within the tile

        // check for collision with the ground
        iCurrAboveLevelZ = FIXEDPT_TO_INT32(qCurrZ - qLandHeight);
        if (iCurrAboveLevelZ < 0) {
          // ground is in the way!
          return 0;
        }
        // check for the existence of structures
        pStructure = pMapElement.pStructureHead;
        if (pStructure == null) {
          // no structures in this tile, AND THAT INCLUDES ROOFS! :-)

          // new system; figure out how many steps until we cross the next edge
          // and then fast forward that many steps.

          iOldTileX = iCurrTileX;
          iOldTileY = iCurrTileY;
          iOldCubesZ = iCurrCubesZ;

          if (qIncrX > 0) {
            qDistToTravelX =
              INT32_TO_FIXEDPT(CELL_X_SIZE) -
              (qCurrX % INT32_TO_FIXEDPT(CELL_X_SIZE));
            iStepsToTravelX = Math.trunc(qDistToTravelX / qIncrX);
          } else if (qIncrX < 0) {
            qDistToTravelX = qCurrX % INT32_TO_FIXEDPT(CELL_X_SIZE);
            iStepsToTravelX = Math.trunc(qDistToTravelX / -qIncrX);
          } else {
            // make sure we don't consider X a limit :-)
            iStepsToTravelX = 1000000;
          }

          if (qIncrY > 0) {
            qDistToTravelY =
              INT32_TO_FIXEDPT(CELL_Y_SIZE) -
              (qCurrY % INT32_TO_FIXEDPT(CELL_Y_SIZE));
            iStepsToTravelY = Math.trunc(qDistToTravelY / qIncrY);
          } else if (qIncrY < 0) {
            qDistToTravelY = qCurrY % INT32_TO_FIXEDPT(CELL_Y_SIZE);
            iStepsToTravelY = Math.trunc(qDistToTravelY / -qIncrY);
          } else {
            // make sure we don't consider Y a limit :-)
            iStepsToTravelY = 1000000;
          }

          iStepsToTravel = Math.min(iStepsToTravelX, iStepsToTravelY) + 1;

          /*
                                        if (qIncrX > 0)
                                        {
                                                qDistToTravelX = INT32_TO_FIXEDPT( CELL_X_SIZE ) - (qCurrX % INT32_TO_FIXEDPT( CELL_X_SIZE ));
                                                iStepsToTravelX = qDistToTravelX / qIncrX;
                                        }
                                        else if (qIncrX < 0)
                                        {
                                                qDistToTravelX = qCurrX % INT32_TO_FIXEDPT( CELL_X_SIZE );
                                                iStepsToTravelX = qDistToTravelX / (-qIncrX);
                                        }
                                        else
                                        {
                                                // make sure we don't consider X a limit :-)
                                                iStepsToTravelX = 1000000;
                                        }

                                        if (qIncrY > 0)
                                        {
                                                qDistToTravelY = INT32_TO_FIXEDPT( CELL_Y_SIZE ) - (qCurrY % INT32_TO_FIXEDPT( CELL_Y_SIZE ));
                                                iStepsToTravelY = qDistToTravelY / qIncrY;
                                        }
                                        else if (qIncrY < 0)
                                        {
                                                qDistToTravelY = qCurrY % INT32_TO_FIXEDPT( CELL_Y_SIZE );
                                                iStepsToTravelY = qDistToTravelY / (-qIncrY);
                                        }
                                        else
                                        {
                                                // make sure we don't consider Y a limit :-)
                                                iStepsToTravelY = 1000000;
                                        }

                                        // add 1 to the # of steps to travel to go INTO the next tile
                                        iStepsToTravel = __min( iStepsToTravelX, iStepsToTravelY ) + 1;
                                        //iStepsToTravel = 1;
                                        */

          qCurrX += qIncrX * iStepsToTravel;
          qCurrY += qIncrY * iStepsToTravel;
          qCurrZ += qIncrZ * iStepsToTravel;
          iLoop += iStepsToTravel;

          // check for ground collision
          if (qCurrZ < qLandHeight && iLoop < iDistance) {
            // ground is in the way!
            return 0;
          }

          // figure out the new tile location
          iCurrTileX = FIXEDPT_TO_TILE_NUM(qCurrX);
          iCurrTileY = FIXEDPT_TO_TILE_NUM(qCurrY);
          iCurrCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(FIXEDPT_TO_INT32(qCurrZ));
          bLOSIndexX = FIXEDPT_TO_LOS_INDEX(qCurrX);
          bLOSIndexY = FIXEDPT_TO_LOS_INDEX(qCurrY);
        } else {
          // there are structures in this tile

          iCurrCubesAboveLevelZ =
            CONVERT_HEIGHTUNITS_TO_INDEX(iCurrAboveLevelZ);
          // figure out the LOS cube level of the current point

          if (iCurrCubesAboveLevelZ < STRUCTURE_ON_ROOF_MAX) {
            if (iCurrCubesAboveLevelZ < STRUCTURE_ON_GROUND_MAX) {
              // check objects on the ground
              sDesiredLevel = STRUCTURE_ON_GROUND;
            } else {
              // check objects on roofs
              sDesiredLevel = STRUCTURE_ON_ROOF;
              iCurrCubesAboveLevelZ -= STRUCTURE_ON_ROOF;
            }
            // check structures for collision
            while (pStructure != null) {
              // transparent structures should be skipped
              // normal roof structures should be skipped here because their only bits are roof lips
              // and those should act as transparent
              fOpaque = (pStructure.fFlags & STRUCTURE_TRANSPARENT) == 0;
              if (pStructure.fFlags & STRUCTURE_ROOF) {
                // roof lip; allow sighting if person on roof is near
                if (
                  iLoop < 2 * CELL_X_SIZE ||
                  iDistance - iLoop < 2 * CELL_X_SIZE
                ) {
                  if (
                    iLoop <= CELL_X_SIZE + 1 ||
                    iDistance - iLoop <= CELL_X_SIZE + 1
                  ) {
                    // right near edge, allow sighting at 3 tiles from roof edge if prone
                    // less if standing, and we can tell that with iStartCubesZ and iEndCubesZ
                    if (iStartCubesZ < iEndCubesZ) {
                      // looking up, so reduce for the target stance-height according to iEndCubesZ
                      if (
                        iDistance >=
                        (3 - iEndCubesAboveLevelZ) * CELL_X_SIZE
                      ) {
                        fOpaque = false;
                      }
                    } else {
                      if (
                        iDistance >=
                        (3 - iStartCubesAboveLevelZ) * CELL_X_SIZE
                      ) {
                        fOpaque = false;
                      }
                    }
                  } else {
                    if (iDistance >= 12 * CELL_X_SIZE) {
                      fOpaque = false;
                    }
                  }
                }
              }

              if (fOpaque) {
                if (pStructure.sCubeOffset == sDesiredLevel) {
                  if (
                    ((<PROFILE>pStructure.pShape)[bLOSIndexX][bLOSIndexY] &
                      AtHeight[iCurrCubesAboveLevelZ]) >
                    0
                  ) {
                    if (fSmell) {
                      if (pStructure.fFlags & STRUCTURE_TREE) {
                        // smell not stopped by vegetation
                      } else if (
                        pStructure.fFlags & STRUCTURE_WALLNWINDOW &&
                        pStructure.fFlags & STRUCTURE_OPEN
                      ) {
                        // open window, smell not stopped
                      } else {
                        if (pStructure.fFlags & STRUCTURE_WALLSTUFF) {
                          // possibly at corner in which case we should let it pass
                          fResolveHit = ResolveHitOnWall(
                            pStructure,
                            iGridNo,
                            bLOSIndexX,
                            bLOSIndexY,
                            ddHorizAngle,
                          );
                        } else {
                          fResolveHit = true;
                        }
                        if (fResolveHit) {
                          // CJC, May 30:  smell reduced by obstacles but not stopped
                          // if obstacle within 10 tiles
                          iAdjSightLimit -= SMELL_REDUCTION_FOR_NEARBY_OBSTACLE;
                          if (iLoop > 100 || iDistance > iAdjSightLimit) {
                            // out of visual range
                            return 0;
                          }

                          /*
                        // smell-line stopped by obstacle!
                        #ifdef LOS_DEBUG
                                gLOSTestResults.iStoppedX = FIXEDPT_TO_INT32( qCurrX );
                                gLOSTestResults.iStoppedY = FIXEDPT_TO_INT32( qCurrY );
                                gLOSTestResults.iStoppedZ = FIXEDPT_TO_INT32( qCurrZ );
                                gLOSTestResults.iCurrCubesZ = iCurrCubesAboveLevelZ;
                        #endif
                        return( 0 );
                        */
                        }
                      }
                    } else {
                      if (pStructure.fFlags & STRUCTURE_TREE) {
                        // don't count trees close to the person
                        if (iLoop > CLOSE_TO_FIRER) {
                          if (iLoop > 100) {
                            // at longer range increase the value of tree cover
                            iAdjSightLimit -= Math.trunc(
                              (ubTreeSightReduction * iLoop) / 100,
                            );
                          } else {
                            // use standard value
                            iAdjSightLimit -= ubTreeSightReduction;
                          }
                          if (iDistance > iAdjSightLimit) {
                            // out of visual range
                            return 0;
                          }
                        }
                      } else if (
                        pStructure.fFlags & STRUCTURE_WALLNWINDOW &&
                        !(pStructure.fFlags & STRUCTURE_SPECIAL) &&
                        qCurrZ >= gqStandardWindowBottomHeight + qLandHeight &&
                        qCurrZ <= gqStandardWindowTopHeight + qLandHeight
                      ) {
                        // do nothing; windows are transparent (except ones marked as special)
                        if (psWindowGridNo != null) {
                          // we're supposed to note the location of this window!
                          // but if a location has already been set then there are two windows, in which case
                          // we abort
                          if (psWindowGridNo.value == NOWHERE) {
                            psWindowGridNo.value = iGridNo;
                            return iLoop;
                          } else {
                            //*psWindowGridNo = NOWHERE;
                            // return( iLoop );
                          }
                        }
                      } else {
                        if (pStructure.fFlags & STRUCTURE_WALLSTUFF) {
                          // possibly shooting at corner in which case we should let it pass
                          fResolveHit = ResolveHitOnWall(
                            pStructure,
                            iGridNo,
                            bLOSIndexX,
                            bLOSIndexY,
                            ddHorizAngle,
                          );
                        } else {
                          if (iCurrCubesAboveLevelZ < STANDING_CUBES - 1) {
                            if (
                              iLoop <= CLOSE_TO_FIRER &&
                              iCurrCubesAboveLevelZ <= iStartCubesAboveLevelZ
                            ) {
                              // if we are in the same vertical cube as the start,
                              // and this is the height of the structure, then allow sight to go through
                              // NB cubes are 0 based, heights 1 based
                              iStructureHeight = StructureHeight(pStructure);
                              fResolveHit =
                                iCurrCubesAboveLevelZ != iStructureHeight - 1;
                            } else if (
                              iLoop >= iDistance - CLOSE_TO_FIRER &&
                              iCurrCubesAboveLevelZ <= iEndCubesZ &&
                              bAware
                            ) {
                              // if we are in the same vertical cube as our destination,
                              // and this is the height of the structure, and we are aware
                              // then allow sight to go through
                              // NB cubes are 0 based, heights 1 based
                              iStructureHeight = StructureHeight(pStructure);
                              fResolveHit =
                                iCurrCubesAboveLevelZ != iStructureHeight - 1;
                            } else {
                              fResolveHit = true;
                            }
                          } else {
                            fResolveHit = true;
                          }
                        }
                        if (fResolveHit) {
                          // hit the obstacle!
                          return 0;
                        }
                      }
                    }
                  }
                }
              }
              pStructure = pStructure.pNext;
            }
          }
          // got past all structures; go to next location within
          // tile, horizontally or vertically
          bOldLOSIndexX = bLOSIndexX;
          bOldLOSIndexY = bLOSIndexY;
          iOldCubesZ = iCurrCubesZ;
          do {
            qCurrX += qIncrX;
            qCurrY += qIncrY;
            if (pRoofStructure) {
              qLastZ = qCurrZ;
              qCurrZ += qIncrZ;
              if (
                (qLastZ > qWallHeight && qCurrZ <= qWallHeight) ||
                (qLastZ < qWallHeight && qCurrZ >= qWallHeight)
              ) {
                // hit a roof
                return 0;
              }
            } else {
              qCurrZ += qIncrZ;
            }

            iLoop++;
            bLOSIndexX = FIXEDPT_TO_LOS_INDEX(qCurrX);
            bLOSIndexY = FIXEDPT_TO_LOS_INDEX(qCurrY);
            iCurrCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(
              FIXEDPT_TO_INT32(qCurrZ),
            );
            // shouldn't need to check whether we are not at maximum range because
            // that will be caught below and this loop shouldn't go for more than a
            // couple of iterations.
          } while (
            bLOSIndexX == bOldLOSIndexX &&
            bLOSIndexY == bOldLOSIndexY &&
            iCurrCubesZ == iOldCubesZ
          );
          iCurrTileX = FIXEDPT_TO_TILE_NUM(qCurrX);
          iCurrTileY = FIXEDPT_TO_TILE_NUM(qCurrY);
        }
      } while (
        iCurrTileX == iOldTileX &&
        iCurrTileY == iOldTileY &&
        iLoop < iDistance
      );

      // leaving a tile, check to see if it had gas in it
      if (
        pMapElement.ubExtFlags[0] &
        (MAPELEMENT_EXT_SMOKE |
          MAPELEMENT_EXT_TEARGAS |
          MAPELEMENT_EXT_MUSTARDGAS)
      ) {
        if (pMapElement.ubExtFlags[0] & MAPELEMENT_EXT_SMOKE && !fSmell) {
          bSmoke++;

          // we can only see 3 tiles in smoke
          // (2 if we're IN smoke)

          if (bSmoke >= 3) {
            iAdjSightLimit = 0;
          }
          // unpopular
          /*
        else
        {
                // losing 1/3rd results in chances to hit which are WAY too low when firing from out of
                // two tiles of smoke... changing this to a 1/6 penalty

                iAdjSightLimit -= iSightLimit / 6;
        }
        */
        } else {
          // reduce by 2 tiles per tile of tear gas or mustard gas
          iAdjSightLimit -= 2 * CELL_X_SIZE;
        }

        if (iAdjSightLimit <= 0) {
          // can't see, period!
          return 0;
        }
      }
    } while (iLoop < iDistance);
    // unless the distance is integral, after the loop there will be a
    // fractional amount of distance remaining which is unchecked
    // but we shouldn't(?) need to check it because the target is there!
    // this somewhat complicated formula does the following:
    // it starts with the distance to the target
    // it adds the difference between the original and adjusted sight limit, = the amount of cover
    // it then scales the value based on the difference between the original sight limit and the
    //   very maximum possible in best lighting conditions
    return Math.trunc(
      ((iDistance + (iSightLimit - iAdjSightLimit)) *
        (MaxDistanceVisible() * CELL_X_SIZE)) /
        iSightLimit,
    );
  }

  export function CalculateSoldierZPos(
    pSoldier: SOLDIERTYPE,
    ubPosType: UINT8,
    pdZPos: Pointer<FLOAT>,
  ): boolean {
    let ubHeight: UINT8;

    if (pSoldier.ubBodyType == Enum194.CROW) {
      // Crow always as prone...
      ubHeight = ANIM_PRONE;
    } else if (pSoldier.bOverTerrainType == Enum315.DEEP_WATER) {
      // treat as prone
      ubHeight = ANIM_PRONE;
    } else if (
      pSoldier.bOverTerrainType == Enum315.LOW_WATER ||
      pSoldier.bOverTerrainType == Enum315.MED_WATER
    ) {
      // treat as crouched
      ubHeight = ANIM_CROUCH;
    } else {
      if (
        CREATURE_OR_BLOODCAT(pSoldier) ||
        pSoldier.ubBodyType == Enum194.COW
      ) {
        // this if statement is to avoid the 'creature weak spot' target
        // spot for creatures
        if (
          ubPosType == Enum230.HEAD_TARGET_POS ||
          ubPosType == Enum230.LEGS_TARGET_POS
        ) {
          // override!
          ubPosType = Enum230.TORSO_TARGET_POS;
        }
      } else if (TANK(pSoldier)) {
        // high up!
        ubPosType = Enum230.HEAD_TARGET_POS;
      }

      ubHeight = gAnimControl[pSoldier.usAnimState].ubEndHeight;
    }

    switch (ubPosType) {
      case Enum230.LOS_POS:
        switch (ubHeight) {
          case ANIM_STAND:
            pdZPos.value = STANDING_LOS_POS;
            break;
          case ANIM_CROUCH:
            pdZPos.value = CROUCHED_LOS_POS;
            break;
          case ANIM_PRONE:
            pdZPos.value = PRONE_LOS_POS;
            break;
          default:
            return false;
        }
        break;
      case Enum230.FIRING_POS:
        switch (ubHeight) {
          case ANIM_STAND:
            pdZPos.value = STANDING_FIRING_POS;
            break;
          case ANIM_CROUCH:
            pdZPos.value = CROUCHED_FIRING_POS;
            break;
          case ANIM_PRONE:
            pdZPos.value = PRONE_FIRING_POS;
            break;
          default:
            return false;
        }
        break;
      case Enum230.TARGET_POS:
        switch (ubHeight) {
          case ANIM_STAND:
            pdZPos.value = STANDING_TARGET_POS;
            break;
          case ANIM_CROUCH:
            pdZPos.value = CROUCHED_TARGET_POS;
            break;
          case ANIM_PRONE:
            pdZPos.value = PRONE_TARGET_POS;
            break;
          default:
            return false;
        }
        break;
      case Enum230.HEAD_TARGET_POS:
        switch (ubHeight) {
          case ANIM_STAND:
            pdZPos.value = STANDING_HEAD_TARGET_POS;
            break;
          case ANIM_CROUCH:
            pdZPos.value = CROUCHED_HEAD_TARGET_POS;
            break;
          case ANIM_PRONE:
            pdZPos.value = PRONE_HEAD_TARGET_POS;
            break;
          default:
            return false;
        }
        break;
      case Enum230.TORSO_TARGET_POS:
        switch (ubHeight) {
          case ANIM_STAND:
            pdZPos.value = STANDING_TORSO_TARGET_POS;
            break;
          case ANIM_CROUCH:
            pdZPos.value = CROUCHED_TORSO_TARGET_POS;
            break;
          case ANIM_PRONE:
            pdZPos.value = PRONE_TORSO_TARGET_POS;
            break;
          default:
            return false;
        }
        break;
      case Enum230.LEGS_TARGET_POS:
        switch (ubHeight) {
          case ANIM_STAND:
            pdZPos.value = STANDING_LEGS_TARGET_POS;
            break;
          case ANIM_CROUCH:
            pdZPos.value = CROUCHED_LEGS_TARGET_POS;
            break;
          case ANIM_PRONE:
            pdZPos.value = PRONE_LEGS_TARGET_POS;
            break;
          default:
            return false;
        }
        break;
      case Enum230.HEIGHT:
        switch (ubHeight) {
          case ANIM_STAND:
            pdZPos.value = STANDING_HEIGHT;
            break;
          case ANIM_CROUCH:
            pdZPos.value = CROUCHED_HEIGHT;
            break;
          case ANIM_PRONE:
            pdZPos.value = PRONE_HEIGHT;
            break;
          default:
            return false;
        }
        break;
    }
    if (
      pSoldier.ubBodyType == Enum194.HATKIDCIV ||
      pSoldier.ubBodyType == Enum194.KIDCIV
    ) {
      // reduce value for kids who are 2/3 the height of regular people
      pdZPos.value = (pdZPos.value * 2) / 3;
    } else if (
      pSoldier.ubBodyType == Enum194.ROBOTNOWEAPON ||
      pSoldier.ubBodyType == Enum194.LARVAE_MONSTER ||
      pSoldier.ubBodyType == Enum194.INFANT_MONSTER ||
      pSoldier.ubBodyType == Enum194.BLOODCAT
    ) {
      // robot is 1/3 the height of regular people
      pdZPos.value = pdZPos.value / 3;
    } else if (TANK(pSoldier)) {
      pdZPos.value = (pdZPos.value * 4) / 3;
    }

    if (pSoldier.bLevel > 0) {
      // on a roof
      pdZPos.value += WALL_HEIGHT_UNITS;
    }

    // IF this is a plane, strafe!
    // ATE: Don;t panic - this is temp - to be changed to a status flag....
    if (pSoldier.ubID == MAX_NUM_SOLDIERS) {
      pdZPos.value = WALL_HEIGHT_UNITS * 2 - 1;
    }

    pdZPos.value += CONVERT_PIXELS_TO_HEIGHTUNITS(
      gpWorldLevelData[pSoldier.sGridNo].sHeight,
    );
    return true;
  }

  export function SoldierToSoldierLineOfSightTest(
    pStartSoldier: SOLDIERTYPE | null,
    pEndSoldier: SOLDIERTYPE | null,
    ubTileSightLimit: UINT8,
    bAware: boolean,
  ): INT32 {
    let dStartZPos: FLOAT = 0;
    let dEndZPos: FLOAT = 0;
    let fOk: boolean;
    let fSmell: boolean;
    let bEffectiveCamo: INT8;
    let ubTreeReduction: UINT8;

    // TO ADD: if target is camouflaged and in cover, reduce sight distance by 30%
    // TO ADD: if in tear gas, reduce sight limit to 2 tiles
    if (!pStartSoldier) {
      return 0;
    }
    if (!pEndSoldier) {
      return 0;
    }
    fOk = CalculateSoldierZPos(
      pStartSoldier,
      Enum230.LOS_POS,
      createPointer(
        () => dStartZPos,
        (v) => (dStartZPos = v),
      ),
    );
    if (!fOk) {
      return 0;
    }

    if (gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_N) {
      // in the bloodcat arena sector, skip sight between army & bloodcats
      if (
        pStartSoldier.bTeam == ENEMY_TEAM &&
        pEndSoldier.bTeam == CREATURE_TEAM
      ) {
        return 0;
      }
      if (
        pStartSoldier.bTeam == CREATURE_TEAM &&
        pEndSoldier.bTeam == ENEMY_TEAM
      ) {
        return 0;
      }
    }

    if (pStartSoldier.uiStatusFlags & SOLDIER_MONSTER) {
      // monsters use smell instead of sight!
      dEndZPos = STANDING_LOS_POS; // should avoid low rocks etc
      if (pEndSoldier.bLevel > 0) {
        // on a roof
        dEndZPos += WALL_HEIGHT_UNITS;
      }
      dEndZPos += CONVERT_PIXELS_TO_HEIGHTUNITS(
        gpWorldLevelData[pEndSoldier.sGridNo].sHeight,
      );
      fSmell = true;
    } else {
      fOk = CalculateSoldierZPos(
        pEndSoldier,
        Enum230.LOS_POS,
        createPointer(
          () => dEndZPos,
          (v) => (dEndZPos = v),
        ),
      );
      if (!fOk) {
        return 0;
      }
      fSmell = false;
    }

    if (TANK(pStartSoldier)) {
      let sDistance: INT16;

      sDistance = PythSpacesAway(pStartSoldier.sGridNo, pEndSoldier.sGridNo);

      if (sDistance <= 8) {
        // blind spot?
        if (dEndZPos <= PRONE_LOS_POS) {
          return 0;
        } else if (sDistance <= 4 && dEndZPos <= CROUCHED_LOS_POS) {
          return 0;
        }
      }
    }

    if (pEndSoldier.bCamo && !bAware) {
      let iTemp: INT32;

      // reduce effects of camo of 5% per tile moved last turn
      if (pEndSoldier.ubBodyType == Enum194.BLOODCAT) {
        bEffectiveCamo = 100 - pEndSoldier.bTilesMoved * 5;
      } else {
        bEffectiveCamo = Math.trunc(
          (pEndSoldier.bCamo * (100 - pEndSoldier.bTilesMoved * 5)) / 100,
        );
      }
      bEffectiveCamo = Math.max(bEffectiveCamo, 0);

      if (gAnimControl[pEndSoldier.usAnimState].ubEndHeight < ANIM_STAND) {
        // reduce visibility by up to a third for camouflage!
        switch (pEndSoldier.bOverTerrainType) {
          case Enum315.FLAT_GROUND:
          case Enum315.LOW_GRASS:
          case Enum315.HIGH_GRASS:
            iTemp = ubTileSightLimit;
            iTemp -= Math.trunc((iTemp * Math.trunc(bEffectiveCamo / 3)) / 100);
            ubTileSightLimit = iTemp;
            break;
          default:
            break;
        }
      }
    } else {
      bEffectiveCamo = 0;
    }

    if (TANK(pEndSoldier)) {
      ubTreeReduction = 0;
    } else {
      ubTreeReduction =
        gubTreeSightReduction[
          gAnimControl[pEndSoldier.usAnimState].ubEndHeight
        ];
    }

    return LineOfSightTest(
      CenterX(pStartSoldier.sGridNo),
      CenterY(pStartSoldier.sGridNo),
      dStartZPos,
      CenterX(pEndSoldier.sGridNo),
      CenterY(pEndSoldier.sGridNo),
      dEndZPos,
      ubTileSightLimit,
      ubTreeReduction,
      bAware,
      bEffectiveCamo,
      fSmell,
      null,
    );
  }

  export function SoldierToLocationWindowTest(
    pStartSoldier: SOLDIERTYPE | null,
    sEndGridNo: INT16,
  ): INT16 {
    // figure out if there is a SINGLE window between the looker and target
    let dStartZPos: FLOAT;
    let dEndZPos: FLOAT;
    let sXPos: INT16;
    let sYPos: INT16;
    let sWindowGridNo: INT16 = NOWHERE;
    let iRet: INT32;

    if (!pStartSoldier) {
      return 0;
    }
    dStartZPos = FixedToFloat(
      Math.trunc(
        (gqStandardWindowTopHeight + gqStandardWindowBottomHeight) / 2,
      ),
    );
    if (pStartSoldier.bLevel > 0) {
      // on a roof
      dStartZPos += WALL_HEIGHT_UNITS;
    }
    dStartZPos += CONVERT_PIXELS_TO_HEIGHTUNITS(
      gpWorldLevelData[pStartSoldier.sGridNo].sHeight,
    );
    dEndZPos = dStartZPos;

    ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sEndGridNo));
    sXPos = sXPos * CELL_X_SIZE + Math.trunc(CELL_X_SIZE / 2);
    sYPos = sYPos * CELL_Y_SIZE + Math.trunc(CELL_Y_SIZE / 2);

    // We don't want to consider distance limits here so pass in tile sight limit of 255
    // and consider trees as little as possible
    iRet = LineOfSightTest(
      CenterX(pStartSoldier.sGridNo),
      CenterY(pStartSoldier.sGridNo),
      dStartZPos,
      sXPos,
      sYPos,
      dEndZPos,
      255,
      0,
      true,
      0,
      false,
      createPointer(
        () => sWindowGridNo,
        (v) => (sWindowGridNo = v),
      ),
    );

    return sWindowGridNo;
  }

  export function SoldierTo3DLocationLineOfSightTest(
    pStartSoldier: SOLDIERTYPE | null,
    sGridNo: INT16,
    bLevel: INT8,
    bCubeLevel: INT8,
    ubTileSightLimit: UINT8,
    bAware: boolean,
  ): INT32 {
    let dStartZPos: FLOAT = 0;
    let dEndZPos: FLOAT;
    let sXPos: INT16;
    let sYPos: INT16;
    let ubTargetID: UINT8;
    let pTarget: SOLDIERTYPE;
    let fOk: boolean;

    if (!pStartSoldier) {
      return 0;
    }

    fOk = CalculateSoldierZPos(
      pStartSoldier,
      Enum230.LOS_POS,
      createPointer(
        () => dStartZPos,
        (v) => (dStartZPos = v),
      ),
    );
    if (!fOk) {
      return 0;
    }

    if (bCubeLevel > 0) {
      dEndZPos =
        (bCubeLevel + bLevel * PROFILE_Z_SIZE - 0.5) * HEIGHT_UNITS_PER_INDEX;
      dEndZPos += CONVERT_PIXELS_TO_HEIGHTUNITS(
        gpWorldLevelData[sGridNo].sHeight,
      );
    } else {
      ubTargetID = WhoIsThere2(sGridNo, bLevel);
      if (ubTargetID != NOBODY) {
        pTarget = MercPtrs[ubTargetID];
        // there's a merc there; do a soldier-to-soldier test
        return SoldierToSoldierLineOfSightTest(
          pStartSoldier,
          pTarget,
          ubTileSightLimit,
          bAware,
        );
      }
      // else... assume standing height
      dEndZPos = STANDING_LOS_POS + bLevel * HEIGHT_UNITS;
      // add in ground height
      dEndZPos += CONVERT_PIXELS_TO_HEIGHTUNITS(
        gpWorldLevelData[sGridNo].sHeight,
      );
    }

    ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sGridNo));
    sXPos = sXPos * CELL_X_SIZE + Math.trunc(CELL_X_SIZE / 2);
    sYPos = sYPos * CELL_Y_SIZE + Math.trunc(CELL_Y_SIZE / 2);

    return LineOfSightTest(
      CenterX(pStartSoldier.sGridNo),
      CenterY(pStartSoldier.sGridNo),
      dStartZPos,
      sXPos,
      sYPos,
      dEndZPos,
      ubTileSightLimit,
      gubTreeSightReduction[ANIM_STAND],
      bAware,
      0,
      false,
      null,
    );
  }

  export function SoldierToBodyPartLineOfSightTest(
    pStartSoldier: SOLDIERTYPE | null,
    sGridNo: INT16,
    bLevel: INT8,
    ubAimLocation: UINT8,
    ubTileSightLimit: UINT8,
    bAware: boolean /* INT8 */,
  ): INT32 {
    let pEndSoldier: SOLDIERTYPE;
    let ubTargetID: UINT8;
    let dStartZPos: FLOAT = 0;
    let dEndZPos: FLOAT = 0;
    let sXPos: INT16;
    let sYPos: INT16;
    let fOk: boolean;
    let ubPosType: UINT8;

    // CJC August 13, 2002: for this routine to work there MUST be a target at the location specified
    ubTargetID = WhoIsThere2(sGridNo, bLevel);
    if (ubTargetID == NOBODY) {
      return 0;
    }
    pEndSoldier = MercPtrs[ubTargetID];

    if (!pStartSoldier) {
      return 0;
    }

    fOk = CalculateSoldierZPos(
      pStartSoldier,
      Enum230.LOS_POS,
      createPointer(
        () => dStartZPos,
        (v) => (dStartZPos = v),
      ),
    );
    if (!fOk) {
      return 0;
    }

    switch (ubAimLocation) {
      case AIM_SHOT_HEAD:
        ubPosType = Enum230.HEAD_TARGET_POS;
        break;
      case AIM_SHOT_TORSO:
        ubPosType = Enum230.TORSO_TARGET_POS;
        break;
      case AIM_SHOT_LEGS:
        ubPosType = Enum230.LEGS_TARGET_POS;
        break;
      default:
        ubPosType = Enum230.TARGET_POS;
        break;
    }

    fOk = CalculateSoldierZPos(
      pEndSoldier,
      ubPosType,
      createPointer(
        () => dEndZPos,
        (v) => (dEndZPos = v),
      ),
    );
    if (!fOk) {
      return 0;
    }

    ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sGridNo));
    sXPos = sXPos * CELL_X_SIZE + Math.trunc(CELL_X_SIZE / 2);
    sYPos = sYPos * CELL_Y_SIZE + Math.trunc(CELL_Y_SIZE / 2);

    return LineOfSightTest(
      CenterX(pStartSoldier.sGridNo),
      CenterY(pStartSoldier.sGridNo),
      dStartZPos,
      sXPos,
      sYPos,
      dEndZPos,
      ubTileSightLimit,
      gubTreeSightReduction[ANIM_STAND],
      bAware,
      0,
      false,
      null,
    );
  }

  export function SoldierToVirtualSoldierLineOfSightTest(
    pStartSoldier: SOLDIERTYPE | null,
    sGridNo: INT16,
    bLevel: INT8,
    bStance: INT8,
    ubTileSightLimit: UINT8,
    bAware: boolean /* INT8 */,
  ): INT32 {
    let dStartZPos: FLOAT = 0;
    let dEndZPos: FLOAT;
    let sXPos: INT16;
    let sYPos: INT16;
    let fOk: boolean;

    if (!pStartSoldier) {
      return 0;
    }

    fOk = CalculateSoldierZPos(
      pStartSoldier,
      Enum230.LOS_POS,
      createPointer(
        () => dStartZPos,
        (v) => (dStartZPos = v),
      ),
    );
    if (!fOk) {
      return 0;
    }

    // manually calculate destination Z position.
    switch (bStance) {
      case ANIM_STAND:
        dEndZPos = STANDING_LOS_POS;
        break;
      case ANIM_CROUCH:
        dEndZPos = CROUCHED_LOS_POS;
        break;
      case ANIM_PRONE:
        dEndZPos = PRONE_LOS_POS;
        break;
      default:
        return 0;
    }
    dEndZPos += CONVERT_PIXELS_TO_HEIGHTUNITS(
      gpWorldLevelData[sGridNo].sHeight,
    );
    if (bLevel > 0) {
      // on a roof
      dEndZPos += WALL_HEIGHT_UNITS;
    }

    ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sGridNo));
    sXPos = sXPos * CELL_X_SIZE + Math.trunc(CELL_X_SIZE / 2);
    sYPos = sYPos * CELL_Y_SIZE + Math.trunc(CELL_Y_SIZE / 2);

    return LineOfSightTest(
      CenterX(pStartSoldier.sGridNo),
      CenterY(pStartSoldier.sGridNo),
      dStartZPos,
      sXPos,
      sYPos,
      dEndZPos,
      ubTileSightLimit,
      gubTreeSightReduction[ANIM_STAND],
      bAware,
      0,
      false,
      null,
    );
  }

  export function SoldierToLocationLineOfSightTest(
    pStartSoldier: SOLDIERTYPE | null,
    sGridNo: INT16,
    ubTileSightLimit: UINT8,
    bAware: boolean /* INT8 */,
  ): INT32 {
    return SoldierTo3DLocationLineOfSightTest(
      pStartSoldier,
      sGridNo,
      0,
      0,
      ubTileSightLimit,
      bAware,
    );
  }

  export function LocationToLocationLineOfSightTest(
    sStartGridNo: INT16,
    bStartLevel: INT8,
    sEndGridNo: INT16,
    bEndLevel: INT8,
    ubTileSightLimit: UINT8,
    bAware: boolean /* INT8 */,
  ): INT32 {
    let dStartZPos: FLOAT;
    let dEndZPos: FLOAT;
    let sStartXPos: INT16;
    let sStartYPos: INT16;
    let sEndXPos: INT16;
    let sEndYPos: INT16;
    let ubStartID: UINT8;

    ubStartID = WhoIsThere2(sStartGridNo, bStartLevel);
    if (ubStartID != NOBODY) {
      return SoldierTo3DLocationLineOfSightTest(
        MercPtrs[ubStartID],
        sEndGridNo,
        bEndLevel,
        0,
        ubTileSightLimit,
        bAware,
      );
    }

    // else... assume standing heights
    dStartZPos = STANDING_LOS_POS + bStartLevel * HEIGHT_UNITS;
    // add in ground height
    dStartZPos += CONVERT_PIXELS_TO_HEIGHTUNITS(
      gpWorldLevelData[sStartGridNo].sHeight,
    );

    ({ sX: sStartXPos, sY: sStartYPos } = ConvertGridNoToXY(sStartGridNo));
    sStartXPos = sStartXPos * CELL_X_SIZE + Math.trunc(CELL_X_SIZE / 2);
    sStartYPos = sStartYPos * CELL_Y_SIZE + Math.trunc(CELL_Y_SIZE / 2);

    dEndZPos = STANDING_LOS_POS + bEndLevel * HEIGHT_UNITS;
    // add in ground height
    dEndZPos += CONVERT_PIXELS_TO_HEIGHTUNITS(
      gpWorldLevelData[sEndGridNo].sHeight,
    );

    ({ sX: sEndXPos, sY: sEndYPos } = ConvertGridNoToXY(sEndGridNo));
    sEndXPos = sEndXPos * CELL_X_SIZE + Math.trunc(CELL_X_SIZE / 2);
    sEndYPos = sEndYPos * CELL_Y_SIZE + Math.trunc(CELL_Y_SIZE / 2);

    return LineOfSightTest(
      sStartXPos,
      sStartYPos,
      dStartZPos,
      sEndXPos,
      sEndYPos,
      dEndZPos,
      ubTileSightLimit,
      gubTreeSightReduction[ANIM_STAND],
      bAware,
      0,
      false,
      null,
    );
  }

  /*
INT32 BulletImpactReducedByRange( INT32 iImpact, INT32 iDistanceTravelled, INT32 iRange )
{
        // for now, don't reduce, because did weird stuff to AI!
        return( iImpact );

        // only start reducing impact at distances greater than one range
        //return( __max( 1, iImpact * ( 100 - ( PERCENT_BULLET_SLOWED_BY_RANGE * iDistanceTravelled ) / iRange ) / 100 ) );

}
*/

  function BulletHitMerc(
    pBullet: BULLET,
    pStructure: STRUCTURE,
    fIntended: boolean,
  ): boolean {
    let iImpact: INT32;
    let iDamage: INT32;
    let SWeaponHit: EV_S_WEAPONHIT = createEvSWeaponHit();
    let sRange: INT16;
    let pFirer: SOLDIERTYPE = pBullet.pFirer;
    let dZPosRelToMerc: FLOAT;
    let ubHitLocation: UINT8 = AIM_SHOT_RANDOM;
    let ubAttackDirection: UINT8;
    let ubAmmoType: UINT8;
    let uiChanceThrough: UINT32;
    let ubSpecial: UINT8 = FIRE_WEAPON_NO_SPECIAL;
    let ubSpecial__Pointer = createPointer(
      () => ubSpecial,
      (v) => (ubSpecial = v),
    );
    let sHitBy: INT16;
    let fStopped: boolean = true;
    let bSlot: INT8;
    let bHeadSlot: INT8 = NO_SLOT;
    let Object: OBJECTTYPE = createObjectType();
    let pTarget: SOLDIERTYPE;
    let sNewGridNo: INT16;
    let fCanSpewBlood: boolean = false;
    let bSpewBloodLevel: INT8;

    // structure IDs for mercs match their merc IDs
    pTarget = MercPtrs[pStructure.usStructureID];

    if (pBullet.usFlags & BULLET_FLAG_KNIFE) {
      // Place knife on guy....

      // See if they have room ( and make sure it's not in hand pos?
      bSlot = FindEmptySlotWithin(
        pTarget,
        Enum261.BIGPOCK1POS,
        Enum261.SMALLPOCK8POS,
      );
      if (bSlot == NO_SLOT) {
        // Add item
        CreateItem(Enum225.THROWING_KNIFE, pBullet.ubItemStatus, Object);

        AddItemToPool(pTarget.sGridNo, Object, -1, pTarget.bLevel, 0, 0);

        // Make team look for items
        NotifySoldiersToLookforItems();
      } else {
        CreateItem(
          Enum225.BLOODY_THROWING_KNIFE,
          pBullet.ubItemStatus,
          pTarget.inv[bSlot],
        );
      }

      ubAmmoType = Enum286.AMMO_KNIFE;
    } else {
      ubAmmoType = pFirer.inv[pFirer.ubAttackingHand].ubGunAmmoType;
    }

    // at least partly compensate for "near miss" increases for this guy, after all, the bullet
    // actually hit him!
    // take this out for now at least... no longer certain that he was awarded a suppression pt
    // when the bullet got near him
    // pTarget->ubSuppressionPoints--;

    if (
      pTarget.uiStatusFlags & SOLDIER_VEHICLE ||
      pTarget.ubBodyType == Enum194.COW ||
      pTarget.ubBodyType == Enum194.CROW ||
      pTarget.ubBodyType == Enum194.BLOODCAT
    ) {
      // ubHitLocation = pStructure->ubVehicleHitLocation;
      ubHitLocation = AIM_SHOT_TORSO;
    } else {
      // Determine where the person was hit...

      if (CREATURE_OR_BLOODCAT(pTarget)) {
        ubHitLocation = AIM_SHOT_TORSO;

        // adult monster types have a weak spot
        if (
          pTarget.ubBodyType >= Enum194.ADULTFEMALEMONSTER &&
          pTarget.ubBodyType <= Enum194.YAM_MONSTER
        ) {
          ubAttackDirection = GetDirectionToGridNoFromGridNo(
            pBullet.pFirer.sGridNo,
            pTarget.sGridNo,
          );
          if (
            ubAttackDirection == pTarget.bDirection ||
            ubAttackDirection == gOneCCDirection[pTarget.bDirection] ||
            ubAttackDirection == gOneCDirection[pTarget.bDirection]
          ) {
            // may hit weak spot!
            if (0) {
              // check fact
              uiChanceThrough = 30;
            } else {
              uiChanceThrough = 1;
            }

            if (PreRandom(100) < uiChanceThrough) {
              ubHitLocation = AIM_SHOT_GLAND;
            }
          }
        }
      }

      if (ubHitLocation == AIM_SHOT_RANDOM) {
        // i.e. if not set yet
        if (pTarget.bOverTerrainType == Enum315.DEEP_WATER) {
          // automatic head hit!
          ubHitLocation = AIM_SHOT_HEAD;
        } else {
          switch (gAnimControl[pTarget.usAnimState].ubEndHeight) {
            case ANIM_STAND:
              dZPosRelToMerc =
                FixedToFloat(pBullet.qCurrZ) -
                CONVERT_PIXELS_TO_HEIGHTUNITS(
                  gpWorldLevelData[pBullet.sGridNo].sHeight,
                );
              if (dZPosRelToMerc > HEIGHT_UNITS) {
                dZPosRelToMerc -= HEIGHT_UNITS;
              }
              if (dZPosRelToMerc > STANDING_HEAD_BOTTOM_POS) {
                ubHitLocation = AIM_SHOT_HEAD;
              } else if (dZPosRelToMerc < STANDING_TORSO_BOTTOM_POS) {
                ubHitLocation = AIM_SHOT_LEGS;
              } else {
                ubHitLocation = AIM_SHOT_TORSO;
              }
              break;
            case ANIM_CROUCH:
              dZPosRelToMerc =
                FixedToFloat(pBullet.qCurrZ) -
                CONVERT_PIXELS_TO_HEIGHTUNITS(
                  gpWorldLevelData[pBullet.sGridNo].sHeight,
                );
              if (dZPosRelToMerc > HEIGHT_UNITS) {
                dZPosRelToMerc -= HEIGHT_UNITS;
              }
              if (dZPosRelToMerc > CROUCHED_HEAD_BOTTOM_POS) {
                ubHitLocation = AIM_SHOT_HEAD;
              } else if (dZPosRelToMerc < CROUCHED_TORSO_BOTTOM_POS) {
                // prevent targets in water from being hit in legs
                ubHitLocation = AIM_SHOT_LEGS;
              } else {
                ubHitLocation = AIM_SHOT_TORSO;
              }
              break;
            case ANIM_PRONE:
              ubHitLocation = AIM_SHOT_TORSO;
              break;
          }
        }
      }

      if (
        ubAmmoType == Enum286.AMMO_MONSTER &&
        ubHitLocation == AIM_SHOT_HEAD &&
        !(pTarget.uiStatusFlags & SOLDIER_MONSTER)
      ) {
        let ubOppositeDirection: UINT8;

        ubAttackDirection = GetDirectionToGridNoFromGridNo(
          pBullet.pFirer.sGridNo,
          pTarget.sGridNo,
        );
        ubOppositeDirection = gOppositeDirection[ubAttackDirection];

        if (
          !(
            ubOppositeDirection == pTarget.bDirection ||
            ubAttackDirection == gOneCCDirection[pTarget.bDirection] ||
            ubAttackDirection == gOneCDirection[pTarget.bDirection]
          )
        ) {
          // lucky bastard was facing away!
        } else if (
          (pTarget.inv[Enum261.HEAD1POS].usItem == Enum225.NIGHTGOGGLES ||
            pTarget.inv[Enum261.HEAD1POS].usItem == Enum225.SUNGOGGLES ||
            pTarget.inv[Enum261.HEAD1POS].usItem == Enum225.GASMASK) &&
          PreRandom(100) < pTarget.inv[Enum261.HEAD1POS].bStatus[0]
        ) {
          // lucky bastard was wearing protective stuff
          bHeadSlot = Enum261.HEAD1POS;
        } else if (
          (pTarget.inv[Enum261.HEAD2POS].usItem == Enum225.NIGHTGOGGLES ||
            pTarget.inv[Enum261.HEAD2POS].usItem == Enum225.SUNGOGGLES ||
            pTarget.inv[Enum261.HEAD2POS].usItem == Enum225.GASMASK) &&
          PreRandom(100) < pTarget.inv[Enum261.HEAD2POS].bStatus[0]
        ) {
          // lucky bastard was wearing protective stuff
          bHeadSlot = Enum261.HEAD2POS;
        } else {
          // splat!!
          ubSpecial = FIRE_WEAPON_BLINDED_BY_SPIT_SPECIAL;
        }
      }
    }

    // Determine damage, checking guy's armour, etc
    sRange = GetRangeInCellCoordsFromGridNoDiff(
      pFirer.sGridNo,
      pTarget.sGridNo,
    );
    if (
      gTacticalStatus.uiFlags & GODMODE &&
      !(pFirer.uiStatusFlags & SOLDIER_PC)
    ) {
      // in god mode, and firer is computer controlled
      iImpact = 0;
      iDamage = 0;
    } else if (fIntended) {
      if (pFirer.bOppList[pTarget.ubID] == SEEN_CURRENTLY) {
        sHitBy = pBullet.sHitBy;
      } else {
        // hard to aim at something far away being reported by someone else!
        sHitBy = Math.trunc(pBullet.sHitBy / 2);
      }
      // hit the intended target which was in our LOS
      // reduce due to range
      iImpact = pBullet.iImpact; // BulletImpactReducedByRange( pBullet->iImpact, pBullet->iLoop, pBullet->iRange );
      iImpact -= pBullet.iImpactReduction;
      if (iImpact < 0) {
        // shouldn't happen but
        iImpact = 0;
      }
      iDamage = BulletImpact(
        pFirer,
        pTarget,
        ubHitLocation,
        iImpact,
        sHitBy,
        ubSpecial__Pointer,
      );
      // handle hit here...
      if (pFirer.bTeam == 0) {
        gMercProfiles[pFirer.ubProfile].usShotsHit++;
      }

      // intentionally shot
      pTarget.fIntendedTarget = true;

      if (
        pBullet.usFlags & BULLET_FLAG_BUCKSHOT &&
        pTarget.ubID == pFirer.ubTargetID
      ) {
        pTarget.bNumPelletsHitBy++;
      }
    } else {
      // if an accidental target was hit, don't give a bonus for good aim!
      sHitBy = 0;
      iImpact = pBullet.iImpact;
      // iImpact = BulletImpactReducedByRange( pBullet->iImpact, pBullet->iLoop, pBullet->iRange );
      iImpact -= pBullet.iImpactReduction;
      if (iImpact < 0) {
        // shouldn't happen but
        iImpact = 0;
      }
      iDamage = BulletImpact(
        pFirer,
        pTarget,
        ubHitLocation,
        iImpact,
        sHitBy,
        ubSpecial__Pointer,
      );

      // accidentally shot
      pTarget.fIntendedTarget = false;
    }

    if (ubAmmoType == Enum286.AMMO_MONSTER) {
      if (bHeadSlot != NO_SLOT) {
        pTarget.inv[bHeadSlot].bStatus[0] -=
          Math.trunc(iImpact / 2) + Random(Math.trunc(iImpact / 2));
        if (pTarget.inv[bHeadSlot].bStatus[0] <= USABLE) {
          if (pTarget.inv[bHeadSlot].bStatus[0] <= 0) {
            DeleteObj(pTarget.inv[bHeadSlot]);
            DirtyMercPanelInterface(pTarget, DIRTYLEVEL2);
          }
          // say curse?
        }
      }
    } else if (ubHitLocation == AIM_SHOT_HEAD) {
      // bullet to the head may damage any head item
      bHeadSlot = Enum261.HEAD1POS + Random(2);
      if (pTarget.inv[bHeadSlot].usItem != NOTHING) {
        pTarget.inv[bHeadSlot].bStatus[0] -= Random(Math.trunc(iImpact / 2));
        if (pTarget.inv[bHeadSlot].bStatus[0] < 0) {
          // just break it...
          pTarget.inv[bHeadSlot].bStatus[0] = 1;
        }
      }
    }

    // check to see if the guy is a friendly?..if so, up the number of times wounded
    if (pTarget.bTeam == gbPlayerNum) {
      gMercProfiles[pTarget.ubProfile].usTimesWounded++;
    }

    // check to see if someone was accidentally hit when no target was specified by the player
    if (
      pFirer.bTeam == gbPlayerNum &&
      pFirer.ubTargetID == NOBODY &&
      pTarget.bNeutral
    ) {
      if (
        pTarget.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP ||
        pTarget.ubCivilianGroup == Enum246.HICKS_CIV_GROUP
      ) {
        // hicks and kingpin are touchy!
        pFirer.ubTargetID = pTarget.ubID;
      } else if (Random(100) < 60) {
        // get touchy
        pFirer.ubTargetID = pTarget.ubID;
      }
    }

    // Send event for getting hit
    SWeaponHit.usSoldierID = pTarget.ubID;
    SWeaponHit.uiUniqueId = pTarget.uiUniqueSoldierIdValue;
    SWeaponHit.usWeaponIndex = pFirer.usAttackingWeapon;
    SWeaponHit.sDamage = iDamage;
    // breath loss is based on original impact of bullet
    SWeaponHit.sBreathLoss = Math.trunc(
      (iImpact *
        BP_GET_WOUNDED *
        (pTarget.bBreathMax * 100 - pTarget.sBreathRed)) /
        10000,
    );
    SWeaponHit.usDirection = GetDirectionFromGridNo(pFirer.sGridNo, pTarget);
    SWeaponHit.sXPos = pTarget.dXPos;
    SWeaponHit.sYPos = pTarget.dYPos;
    SWeaponHit.sZPos = 20;
    SWeaponHit.sRange = sRange;
    SWeaponHit.ubAttackerID = pFirer.ubID;
    SWeaponHit.fHit = true;
    SWeaponHit.ubLocation = ubHitLocation;

    if (pFirer.bDoBurst && ubSpecial == FIRE_WEAPON_NO_SPECIAL) {
      // the animation required by the bullet hit (head explosion etc) overrides the
      // hit-by-a-burst animation
      ubSpecial = FIRE_WEAPON_BURST_SPECIAL;
    }
    SWeaponHit.ubSpecial = ubSpecial;

    // now check to see if the bullet goes THROUGH this person! (not vehicles)
    if (
      !(pTarget.uiStatusFlags & SOLDIER_VEHICLE) &&
      (ubAmmoType == Enum286.AMMO_REGULAR ||
        ubAmmoType == Enum286.AMMO_AP ||
        ubAmmoType == Enum286.AMMO_SUPER_AP) &&
      !EXPLOSIVE_GUN(pFirer.usAttackingWeapon)
    ) {
      // if we do more damage than expected, then the bullet will be more likely
      // to be lodged in the body

      // if we do less than expected, then the bullet has been slowed and less
      // likely to continue

      // higher chance for bigger guns, because they'll go through the back armour

      // reduce impact to match damage, if damage wasn't more than the impact
      // due to good aim, etc.
      if (iDamage < iImpact) {
        iImpact = iDamage;
      }
      uiChanceThrough = Math.max(0, iImpact - 20);
      if (PreRandom(100) < uiChanceThrough) {
        // bullet MAY go through
        // adjust for bullet going through person
        iImpact -= CalcBodyImpactReduction(ubAmmoType, ubHitLocation);
        // adjust for other side of armour!
        iImpact -= TotalArmourProtection(
          pFirer,
          pTarget,
          ubHitLocation,
          iImpact,
          ubAmmoType,
        );
        if (iImpact > 0) {
          pBullet.iImpact = iImpact;
          // bullet was NOT stopped
          fStopped = false;
        }
      }
    }

    if (fStopped) {
      RemoveBullet(pBullet.iBullet);
    } else {
      // ATE: I'm in enemy territory again, evil CC's world :)
      // This looks like the place I should add code to spew blood on the ground
      // The algorithm I'm going to use is given the current gridno of bullet,
      // get a new gridno based on direction it was moving.  Check to see if we're not
      // going through walls, etc by testing for a path, unless on the roof, in which case it would always
      // be legal, but the bLevel May change...
      sNewGridNo = NewGridNo(
        pBullet.sGridNo,
        DirectionInc(gOppositeDirection[SWeaponHit.usDirection]),
      );

      bSpewBloodLevel = MercPtrs[SWeaponHit.usSoldierID].bLevel;
      fCanSpewBlood = true;

      // If on anything other than bLevel of 0, we can pretty much freely spew blood
      if (bSpewBloodLevel == 0) {
        if (
          gubWorldMovementCosts[sNewGridNo][
            gOppositeDirection[SWeaponHit.usDirection]
          ][0] >= TRAVELCOST_BLOCKED
        ) {
          fCanSpewBlood = false;
        }
      } else {
        // If a roof does not exist here, make level = 0
        if (!IsRoofPresentAtGridno(sNewGridNo)) {
          bSpewBloodLevel = 0;
        }
      }

      if (fCanSpewBlood) {
        // Drop blood dude!
        InternalDropBlood(sNewGridNo, bSpewBloodLevel, 0, MAXBLOODQUANTITY, 1);
      }
    }

    if (
      gTacticalStatus.ubCurrentTeam != OUR_TEAM &&
      pTarget.bTeam == gbPlayerNum
    ) {
      // someone has been hit so no close-call quotes
      gTacticalStatus.fSomeoneHit = true;
    }

    // handle hit!
    WeaponHit(
      SWeaponHit.usSoldierID,
      SWeaponHit.usWeaponIndex,
      SWeaponHit.sDamage,
      SWeaponHit.sBreathLoss,
      SWeaponHit.usDirection,
      SWeaponHit.sXPos,
      SWeaponHit.sYPos,
      SWeaponHit.sZPos,
      SWeaponHit.sRange,
      SWeaponHit.ubAttackerID,
      SWeaponHit.fHit,
      SWeaponHit.ubSpecial,
      SWeaponHit.ubLocation,
    );
    return fStopped;
  }

  function BulletHitStructure(
    pBullet: BULLET,
    usStructureID: UINT16,
    iImpact: INT32,
    pFirer: SOLDIERTYPE,
    qCurrX: FIXEDPT,
    qCurrY: FIXEDPT,
    qCurrZ: FIXEDPT,
    fStopped: boolean,
  ): void {
    let SStructureHit: EV_S_STRUCTUREHIT = createEvSStructureHit();

    SStructureHit.sXPos = FIXEDPT_TO_INT32(qCurrX + FloatToFixed(0.5)); // + 0.5);
    SStructureHit.sYPos = FIXEDPT_TO_INT32(qCurrY + FloatToFixed(0.5)); // (dCurrY + 0.5);
    SStructureHit.sZPos = CONVERT_HEIGHTUNITS_TO_PIXELS(
      FIXEDPT_TO_INT32(qCurrZ + FloatToFixed(0.5)),
    ); // dCurrZ + 0.5) );
    SStructureHit.usWeaponIndex = pFirer.usAttackingWeapon;
    SStructureHit.bWeaponStatus = pBullet.ubItemStatus;
    SStructureHit.ubAttackerID = pFirer.ubID;
    SStructureHit.usStructureID = usStructureID;
    SStructureHit.iImpact = iImpact;
    SStructureHit.iBullet = pBullet.iBullet;

    StructureHit(
      SStructureHit.iBullet,
      SStructureHit.usWeaponIndex,
      SStructureHit.bWeaponStatus,
      SStructureHit.ubAttackerID,
      SStructureHit.sXPos,
      SStructureHit.sYPos,
      SStructureHit.sZPos,
      SStructureHit.usStructureID,
      SStructureHit.iImpact,
      fStopped,
    );
  }

  function BulletHitWindow(
    pBullet: BULLET,
    sGridNo: INT16,
    usStructureID: UINT16,
    fBlowWindowSouth: boolean,
  ): void {
    WindowHit(sGridNo, usStructureID, fBlowWindowSouth, false);
  }

  function BulletMissed(pBullet: BULLET, pFirer: SOLDIERTYPE): void {
    ShotMiss(pFirer.ubID, pBullet.iBullet);
  }

  function ChanceOfBulletHittingStructure(
    iDistance: INT32,
    iDistanceToTarget: INT32,
    sHitBy: INT16,
  ): UINT32 {
    let iCloseToCoverPenalty: INT32;

    if (
      Math.trunc(iDistance / CELL_X_SIZE) >
      MAX_DIST_FOR_LESS_THAN_MAX_CHANCE_TO_HIT_STRUCTURE
    ) {
      return MAX_CHANCE_OF_HITTING_STRUCTURE;
    } else {
      iCloseToCoverPenalty =
        Math.trunc(iDistance / 5) - (iDistanceToTarget - iDistance);
      if (iCloseToCoverPenalty < 0) {
        iCloseToCoverPenalty = 0;
      }
      if (sHitBy < 0) {
        // add 20% to distance so that misses hit nearer obstacles a bit more
        iDistance += Math.trunc(iDistance / 5);
      }
      if (
        Math.trunc((iDistance + iCloseToCoverPenalty) / CELL_X_SIZE) >
        MAX_DIST_FOR_LESS_THAN_MAX_CHANCE_TO_HIT_STRUCTURE
      ) {
        return MAX_CHANCE_OF_HITTING_STRUCTURE;
      } else {
        return guiStructureHitChance[
          Math.trunc((iDistance + iCloseToCoverPenalty) / CELL_X_SIZE)
        ];
      }
    }
  }

  function StructureResistanceIncreasedByRange(
    iImpactReduction: INT32,
    iGunRange: INT32,
    iDistance: INT32,
  ): INT32 {
    return Math.trunc(
      (iImpactReduction *
        (100 +
          Math.trunc(
            (PERCENT_BULLET_SLOWED_BY_RANGE * (iDistance - iGunRange)) /
              iGunRange,
          ))) /
        100,
    );
    /*
  if ( iDistance > iGunRange )
  {
          return( iImpactReduction * ( 100 + PERCENT_BULLET_SLOWED_BY_RANGE * (iDistance - iGunRange) / iGunRange ) / 100 );
  }
  else
  {
          return( iImpactReduction );
  }
  */
  }

  function HandleBulletStructureInteraction(
    pBullet: BULLET,
    pStructure: STRUCTURE,
    pfHit: Pointer<boolean>,
  ): INT32 {
    let pDoor: DOOR | null;
    let sLockDamage: INT16;

    // returns remaining impact amount

    let iCurrImpact: INT32;
    let iImpactReduction: INT32;

    pfHit.value = false;

    if (
      pBullet.usFlags & BULLET_FLAG_KNIFE ||
      pBullet.usFlags & BULLET_FLAG_MISSILE ||
      pBullet.usFlags & BULLET_FLAG_TANK_CANNON ||
      pBullet.usFlags & BULLET_FLAG_FLAME
    ) {
      // stops!
      pfHit.value = true;
      return 0;
    } else if (pBullet.usFlags & BULLET_FLAG_SMALL_MISSILE) {
      // stops if using HE ammo
      if (
        pBullet.pFirer.inv[pBullet.pFirer.ubAttackingHand].ubGunAmmoType ==
        Enum286.AMMO_HE
      ) {
        pfHit.value = true;
        return 0;
      }
    }

    // ATE: Alrighty, check for shooting door locks...
    // First check this is a type of struct that can handle locks...
    if (
      pStructure.fFlags & (STRUCTURE_DOOR | STRUCTURE_OPENABLE) &&
      PythSpacesAway(pBullet.sTargetGridNo, pStructure.sGridNo) <= 2
    ) {
      // lookup lock table to see if we have a lock,
      // and then remove lock if enough damage done....
      pDoor = FindDoorInfoAtGridNo(pBullet.sGridNo);

      // Does it have a lock?
      if (
        pDoor &&
        LockTable[pDoor.ubLockID].ubPickDifficulty < 50 &&
        LockTable[pDoor.ubLockID].ubSmashDifficulty < 70
      ) {
        // Yup.....

        // Chance that it hit the lock....
        if (PreRandom(2) == 0) {
          // Adjust damage-- CC adjust this based on gun type, etc.....
          // sLockDamage = (INT16)( 35 + Random( 35 ) );
          sLockDamage = pBullet.iImpact - pBullet.iImpactReduction;
          sLockDamage += PreRandom(sLockDamage);

          ScreenMsg(
            FONT_MCOLOR_LTYELLOW,
            MSG_INTERFACE,
            TacticalStr[Enum335.LOCK_HAS_BEEN_HIT],
          );

          pDoor.bLockDamage += sLockDamage;

          // Check if it has been shot!
          if (pDoor.bLockDamage > LockTable[pDoor.ubLockID].ubSmashDifficulty) {
            // Display message!
            ScreenMsg(
              FONT_MCOLOR_LTYELLOW,
              MSG_INTERFACE,
              TacticalStr[Enum335.LOCK_HAS_BEEN_DESTROYED],
            );

            // succeeded! door can never be locked again, so remove from door list...
            RemoveDoorInfoFromTable(pDoor.sGridNo);

            // MARKSMANSHIP GAIN (marksPts): Opened/Damaged a door
            StatChange(pBullet.pFirer, MARKAMT, 10, FROM_SUCCESS);
          }
        }
      }
    }

    // okay, this seems pretty weird, so here's the comment to explain it:
    // iImpactReduction is the reduction in impact due to the structure
    // pBullet->iImpactReduction is the accumulated reduction in impact
    //   for all bullets encountered thus far
    // iCurrImpact is the original impact value of the bullet reduced due to
    //   range.  To avoid problems involving multiple multiplication
    //   ( (1 - X) * (1 - Y) != (1 - X - Y) ! ), this is calculated from
    //	 scratch at each collision with an obstacle
    //   reduction due to range is 25% per "max range"
    if (PreRandom(100) < pStructure.pDBStructureRef.pDBStructure.ubDensity) {
      iCurrImpact = pBullet.iImpact;
      // iCurrImpact = BulletImpactReducedByRange( pBullet->iImpact, pBullet->iLoop, pBullet->iRange );
      iImpactReduction =
        gubMaterialArmour[pStructure.pDBStructureRef.pDBStructure.ubArmour];
      iImpactReduction = StructureResistanceIncreasedByRange(
        iImpactReduction,
        pBullet.iRange,
        pBullet.iLoop,
      );

      switch (
        pBullet.pFirer.inv[pBullet.pFirer.ubAttackingHand].ubGunAmmoType
      ) {
        case Enum286.AMMO_HP:
          iImpactReduction = AMMO_STRUCTURE_ADJUSTMENT_HP(iImpactReduction);
          break;
        case Enum286.AMMO_AP:
        case Enum286.AMMO_HEAT:
          iImpactReduction = AMMO_STRUCTURE_ADJUSTMENT_AP(iImpactReduction);
          break;
        case Enum286.AMMO_SUPER_AP:
          iImpactReduction = AMMO_STRUCTURE_ADJUSTMENT_SAP(iImpactReduction);
          break;
        default:
          break;
      }

      pBullet.iImpactReduction += iImpactReduction;

      // really weak stuff like grass should never *stop* a bullet, maybe slow it though
      if (
        pStructure.pDBStructureRef.pDBStructure.ubArmour ==
        Enum309.MATERIAL_LIGHT_VEGETATION
      ) {
        // just return a +ve value to indicate the bullet wasn't stopped
        pfHit.value = false;
        return 1;
      }

      pfHit.value = true;
      return iCurrImpact - pBullet.iImpactReduction;
    } else {
      // just return a +ve value to indicate the bullet wasn't stopped
      pfHit.value = false;
      return 1;
    }
  }

  function CTGTHandleBulletStructureInteraction(
    pBullet: BULLET,
    pStructure: STRUCTURE,
  ): INT32 {
    // returns reduction in impact for summing in CTGT

    let iCurrImpact: INT32;
    let iImpactReduction: INT32;

    if (
      pBullet.usFlags & BULLET_FLAG_KNIFE ||
      pBullet.usFlags & BULLET_FLAG_MISSILE ||
      pBullet.usFlags & BULLET_FLAG_FLAME ||
      pBullet.usFlags & BULLET_FLAG_TANK_CANNON
    ) {
      // knife/rocket stops when it hits anything, and people block completely
      return pBullet.iImpact;
    } else if (pBullet.usFlags & BULLET_FLAG_SMALL_MISSILE) {
      // stops if using HE ammo
      if (
        pBullet.pFirer.inv[pBullet.pFirer.ubAttackingHand].ubGunAmmoType ==
        Enum286.AMMO_HE
      ) {
        return pBullet.iImpact;
      }
    } else if (pStructure.fFlags & STRUCTURE_PERSON) {
      if (
        pStructure.usStructureID != pBullet.ubFirerID &&
        pStructure.usStructureID != pBullet.ubTargetID
      ) {
      }
    }

    // okay, this seems pretty weird, so here's the comment to explain it:
    // iImpactReduction is the reduction in impact due to the structure
    // pBullet->iImpactReduction is the accumulated reduction in impact
    //   for all bullets encountered thus far
    // iCurrImpact is the original impact value of the bullet reduced due to
    //   range.  To avoid problems involving multiple multiplication
    //   ( (1 - X) * (1 - Y) != (1 - X - Y) ! ), this is calculated from
    //	 scratch at each collision with an obstacle
    //   reduction due to range is 25% per "max range"
    // iCurrImpact = BulletImpactReducedByRange( pBullet->iImpact, pBullet->iLoop, pBullet->iRange );
    iCurrImpact = pBullet.iImpact;
    // multiply impact reduction by 100 to retain fractions for a bit...
    iImpactReduction = Math.trunc(
      (gubMaterialArmour[pStructure.pDBStructureRef.pDBStructure.ubArmour] *
        pStructure.pDBStructureRef.pDBStructure.ubDensity) /
        100,
    );
    iImpactReduction = StructureResistanceIncreasedByRange(
      iImpactReduction,
      pBullet.iRange,
      pBullet.iLoop,
    );
    switch (pBullet.pFirer.inv[pBullet.pFirer.ubAttackingHand].ubGunAmmoType) {
      case Enum286.AMMO_HP:
        iImpactReduction = AMMO_STRUCTURE_ADJUSTMENT_HP(iImpactReduction);
        break;
      case Enum286.AMMO_AP:
        iImpactReduction = AMMO_STRUCTURE_ADJUSTMENT_AP(iImpactReduction);
        break;
      case Enum286.AMMO_SUPER_AP:
        iImpactReduction = AMMO_STRUCTURE_ADJUSTMENT_SAP(iImpactReduction);
        break;
      default:
        break;
    }
    return iImpactReduction;
  }

  function CalcChanceToGetThrough(pBullet: BULLET): UINT8 {
    let qLandHeight: FIXEDPT;
    let iCurrAboveLevelZ: INT32;
    let iCurrCubesAboveLevelZ: INT32;
    let sDesiredLevel: INT16;

    let iOldTileX: INT32;
    let iOldTileY: INT32;
    let iOldCubesZ: INT32;

    let pMapElement: MAP_ELEMENT;
    let pStructure: STRUCTURE | null;
    let pRoofStructure: STRUCTURE | null = null;

    let qLastZ: FIXEDPT;

    let fIntended: boolean;
    let bOldLOSIndexX: INT8;
    let bOldLOSIndexY: INT8;

    let iChanceToGetThrough: INT32 = 100;

    let qDistToTravelX: FIXEDPT;
    let qDistToTravelY: FIXEDPT;
    let iStepsToTravelX: INT32;
    let iStepsToTravelY: INT32;
    let iStepsToTravel: INT32;
    let iNumLocalStructures: INT32;
    let iStructureLoop: INT32;
    let uiChanceOfHit: UINT32;
    let iGridNo: INT32;
    let iTotalStructureImpact: INT32;
    let fResolveHit: boolean;

    let qWallHeight: FIXEDPT;
    let qWindowBottomHeight: FIXEDPT;
    let qWindowTopHeight: FIXEDPT;

    DebugLOS("Starting CalcChanceToGetThrough");

    do {
      // check a particular tile
      // retrieve values from world for this particular tile
      iGridNo = pBullet.iCurrTileX + pBullet.iCurrTileY * WORLD_COLS;
      DebugLOS(FormatString("CTGT now at %ld", iGridNo));
      pMapElement = gpWorldLevelData[iGridNo];
      qLandHeight = INT32_TO_FIXEDPT(
        CONVERT_PIXELS_TO_HEIGHTUNITS(pMapElement.sHeight),
      );
      qWallHeight = gqStandardWallHeight + qLandHeight;
      qWindowBottomHeight = gqStandardWindowBottomHeight + qLandHeight;
      qWindowTopHeight = gqStandardWindowTopHeight + qLandHeight;

      // Assemble list of structures we might hit!
      iNumLocalStructures = 0;
      pStructure = pMapElement.pStructureHead;
      // calculate chance of hitting each structure
      uiChanceOfHit = ChanceOfBulletHittingStructure(
        pBullet.iLoop,
        pBullet.iDistanceLimit,
        0,
      );

      // reset roof structure pointer each tile
      pRoofStructure = null;

      if (iGridNo == pBullet.sTargetGridNo) {
        fIntended = true;
        // if in the same tile as our destination, we WANT to hit the structure!
        uiChanceOfHit = 100;
      } else {
        fIntended = false;
      }

      iCurrAboveLevelZ = FIXEDPT_TO_INT32(pBullet.qCurrZ - qLandHeight);
      if (iCurrAboveLevelZ < 0) {
        // ground is in the way!
        return 0;
      }
      iCurrCubesAboveLevelZ = CONVERT_HEIGHTUNITS_TO_INDEX(iCurrAboveLevelZ);

      while (pStructure) {
        if (pStructure.fFlags & ALWAYS_CONSIDER_HIT) {
          // ALWAYS add walls
          gpLocalStructure[iNumLocalStructures] = pStructure;
          // fence is special
          //(iCurrCubesAboveLevelZ <= iStartCubesAboveLevelZ)
          if (pStructure.fFlags & STRUCTURE_ANYFENCE) {
            if (pStructure.pDBStructureRef.pDBStructure.ubDensity < 100) {
              guiLocalStructureCTH[iNumLocalStructures] = uiChanceOfHit;
            } else if (
              pBullet.iLoop <= CLOSE_TO_FIRER &&
              iCurrCubesAboveLevelZ <= pBullet.bStartCubesAboveLevelZ &&
              pBullet.bEndCubesAboveLevelZ >= iCurrCubesAboveLevelZ &&
              iCurrCubesAboveLevelZ == StructureHeight(pStructure) - 1
            ) {
              guiLocalStructureCTH[iNumLocalStructures] = uiChanceOfHit;
            } else if (
              pBullet.iDistanceLimit - pBullet.iLoop <= CLOSE_TO_FIRER &&
              iCurrCubesAboveLevelZ <= pBullet.bEndCubesAboveLevelZ &&
              iCurrCubesAboveLevelZ == StructureHeight(pStructure) - 1
            ) {
              guiLocalStructureCTH[iNumLocalStructures] = uiChanceOfHit;
            } else {
              guiLocalStructureCTH[iNumLocalStructures] = 100;
            }
          } else {
            guiLocalStructureCTH[iNumLocalStructures] = 100;
          }
          gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
          iNumLocalStructures++;
        } else if (pStructure.fFlags & STRUCTURE_ROOF) {
          // only consider roofs if the flag is set; don't add them to the array since they
          // are a special case
          if (pBullet.fCheckForRoof) {
            pRoofStructure = pStructure;

            if (pRoofStructure) {
              qLastZ = pBullet.qCurrZ - pBullet.qIncrZ;

              // if just on going to next tile we cross boundary, then roof stops bullet here!
              if (
                (qLastZ > qWallHeight && pBullet.qCurrZ <= qWallHeight) ||
                (qLastZ < qWallHeight && pBullet.qCurrZ >= qWallHeight)
              ) {
                // hit a roof
                return 0;
              }
            }
          }
        } else if (pStructure.fFlags & STRUCTURE_PERSON) {
          if (
            pStructure.usStructureID != pBullet.ubFirerID &&
            pStructure.usStructureID != pBullet.ubTargetID
          ) {
            // ignore intended target since we will get closure upon reaching the center
            // of the destination tile

            // ignore intervening target if not visible; PCs are always visible so AI will never skip them on that
            // basis
            if (
              !fIntended &&
              MercPtrs[pStructure.usStructureID].bVisible == 1
            ) {
              // in actually moving the bullet, we consider only count friends as targets if the bullet is unaimed
              // (buckshot), if they are the intended target, or beyond the range of automatic friendly fire hits
              // OR a 1 in 30 chance occurs
              if (
                gAnimControl[MercPtrs[pStructure.usStructureID].usAnimState]
                  .ubEndHeight == ANIM_STAND &&
                ((pBullet.fAimed && pBullet.iLoop > MIN_DIST_FOR_HIT_FRIENDS) ||
                  (!pBullet.fAimed &&
                    pBullet.iLoop > MIN_DIST_FOR_HIT_FRIENDS_UNAIMED))
              ) {
                // could hit this person!
                gpLocalStructure[iNumLocalStructures] = pStructure;
                // CJC commented this out because of tank trying to shoot through another tank
                // guiLocalStructureCTH[iNumLocalStructures] = uiChanceOfHit;
                guiLocalStructureCTH[iNumLocalStructures] = 100;
                gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
                iNumLocalStructures++;
              } else {
                // minimal chance of hitting this person
                gpLocalStructure[iNumLocalStructures] = pStructure;
                guiLocalStructureCTH[iNumLocalStructures] =
                  MIN_CHANCE_TO_ACCIDENTALLY_HIT_SOMEONE;
                gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
                iNumLocalStructures++;
              }
            }
          }
        } else if (pStructure.fFlags & STRUCTURE_CORPSE) {
          if (
            iGridNo == pBullet.sTargetGridNo ||
            pStructure.pDBStructureRef.pDBStructure.ubNumberOfTiles >= 10
          ) {
            // could hit this corpse!
            // but we should ignore the corpse if there is someone standing there
            if (FindStructure(iGridNo, STRUCTURE_PERSON) == null) {
              gpLocalStructure[iNumLocalStructures] = pStructure;
              iNumLocalStructures++;
            }
          }
        } else {
          if (pBullet.iLoop > CLOSE_TO_FIRER && !fIntended) {
            // could hit it

            gpLocalStructure[iNumLocalStructures] = pStructure;
            guiLocalStructureCTH[iNumLocalStructures] = uiChanceOfHit;
            gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
            iNumLocalStructures++;
          }
        }
        pStructure = pStructure.pNext;
      }

      // record old tile location for loop purposes
      iOldTileX = pBullet.iCurrTileX;
      iOldTileY = pBullet.iCurrTileY;

      do {
        // check a particular location within the tile

        // check for collision with the ground
        iCurrAboveLevelZ = FIXEDPT_TO_INT32(pBullet.qCurrZ - qLandHeight);
        if (iCurrAboveLevelZ < 0) {
          // ground is in the way!
          return 0;
        }
        // check for the existence of structures
        pStructure = pMapElement.pStructureHead;
        if (pStructure == null) {
          // no structures in this tile, and THAT INCLUDES ROOFS AND PEOPLE! :-)
          // new system; figure out how many steps until we cross the next edge
          // and then fast forward that many steps.

          iOldTileX = pBullet.iCurrTileX;
          iOldTileY = pBullet.iCurrTileY;
          iOldCubesZ = pBullet.iCurrCubesZ;

          if (pBullet.qIncrX > 0) {
            qDistToTravelX =
              INT32_TO_FIXEDPT(CELL_X_SIZE) -
              (pBullet.qCurrX % INT32_TO_FIXEDPT(CELL_X_SIZE));
            iStepsToTravelX = Math.trunc(qDistToTravelX / pBullet.qIncrX);
          } else if (pBullet.qIncrX < 0) {
            qDistToTravelX = pBullet.qCurrX % INT32_TO_FIXEDPT(CELL_X_SIZE);
            iStepsToTravelX = Math.trunc(qDistToTravelX / -pBullet.qIncrX);
          } else {
            // make sure we don't consider X a limit :-)
            iStepsToTravelX = 1000000;
          }

          if (pBullet.qIncrY > 0) {
            qDistToTravelY =
              INT32_TO_FIXEDPT(CELL_Y_SIZE) -
              (pBullet.qCurrY % INT32_TO_FIXEDPT(CELL_Y_SIZE));
            iStepsToTravelY = Math.trunc(qDistToTravelY / pBullet.qIncrY);
          } else if (pBullet.qIncrY < 0) {
            qDistToTravelY = pBullet.qCurrY % INT32_TO_FIXEDPT(CELL_Y_SIZE);
            iStepsToTravelY = Math.trunc(qDistToTravelY / -pBullet.qIncrY);
          } else {
            // make sure we don't consider Y a limit :-)
            iStepsToTravelY = 1000000;
          }

          // add 1 to the # of steps to travel to go INTO the next tile
          iStepsToTravel = Math.min(iStepsToTravelX, iStepsToTravelY) + 1;

          pBullet.qCurrX += pBullet.qIncrX * iStepsToTravel;
          pBullet.qCurrY += pBullet.qIncrY * iStepsToTravel;
          pBullet.qCurrZ += pBullet.qIncrZ * iStepsToTravel;
          pBullet.iLoop += iStepsToTravel;

          // check for ground collision
          if (
            pBullet.qCurrZ < qLandHeight &&
            pBullet.iLoop < pBullet.iDistanceLimit
          ) {
            // ground is in the way!
            return 0;
          }

          // figure out the new tile location
          pBullet.iCurrTileX = FIXEDPT_TO_TILE_NUM(pBullet.qCurrX);
          pBullet.iCurrTileY = FIXEDPT_TO_TILE_NUM(pBullet.qCurrY);
          pBullet.iCurrCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(
            FIXEDPT_TO_INT32(pBullet.qCurrZ),
          );
          pBullet.bLOSIndexX = FIXEDPT_TO_LOS_INDEX(pBullet.qCurrX);
          pBullet.bLOSIndexY = FIXEDPT_TO_LOS_INDEX(pBullet.qCurrY);

          DebugLOS(
            FormatString(
              "  CTGT at %ld %ld after traversing empty tile",
              pBullet.bLOSIndexX,
              pBullet.bLOSIndexY,
            ),
          );
        } else {
          // there are structures in this tile

          iCurrCubesAboveLevelZ =
            CONVERT_HEIGHTUNITS_TO_INDEX(iCurrAboveLevelZ);

          // figure out the LOS cube level of the current point
          if (iCurrCubesAboveLevelZ < STRUCTURE_ON_ROOF_MAX) {
            if (iCurrCubesAboveLevelZ < STRUCTURE_ON_GROUND_MAX) {
              // check objects on the ground
              sDesiredLevel = STRUCTURE_ON_GROUND;
            } else {
              // check objects on roofs
              sDesiredLevel = STRUCTURE_ON_ROOF;
              iCurrCubesAboveLevelZ -= STRUCTURE_ON_ROOF;
            }
            // check structures for collision
            for (
              iStructureLoop = 0;
              iStructureLoop < iNumLocalStructures;
              iStructureLoop++
            ) {
              pStructure = gpLocalStructure[iStructureLoop];
              if (pStructure && pStructure.sCubeOffset == sDesiredLevel) {
                if (
                  ((<PROFILE>pStructure.pShape)[pBullet.bLOSIndexX][
                    pBullet.bLOSIndexY
                  ] &
                    AtHeight[iCurrCubesAboveLevelZ]) >
                  0
                ) {
                  if (pStructure.fFlags & STRUCTURE_PERSON) {
                    // hit someone?
                    if (fIntended) {
                      // gotcha! ... return chance to get through
                      iChanceToGetThrough = Math.trunc(
                        (iChanceToGetThrough *
                          (pBullet.iImpact - pBullet.iImpactReduction)) /
                          pBullet.iImpact,
                      );
                      return iChanceToGetThrough;
                    } else {
                      gubLocalStructureNumTimesHit[iStructureLoop]++;
                    }
                  } else if (
                    pStructure.fFlags & STRUCTURE_WALLNWINDOW &&
                    pBullet.qCurrZ >= qWindowBottomHeight &&
                    pBullet.qCurrZ <= qWindowTopHeight
                  ) {
                    fResolveHit = ResolveHitOnWall(
                      pStructure,
                      iGridNo,
                      pBullet.bLOSIndexX,
                      pBullet.bLOSIndexY,
                      pBullet.ddHorizAngle,
                    );

                    if (fResolveHit) {
                      // the bullet would keep on going!  unless we're considering a knife...
                      if (pBullet.usFlags & BULLET_FLAG_KNIFE) {
                        gubLocalStructureNumTimesHit[iStructureLoop]++;
                      }
                    }
                  } else if (
                    pBullet.iLoop > CLOSE_TO_FIRER ||
                    pStructure.fFlags & ALWAYS_CONSIDER_HIT
                  ) {
                    if (pStructure.fFlags & STRUCTURE_WALLSTUFF) {
                      // possibly shooting at corner in which case we should let it pass
                      fResolveHit = ResolveHitOnWall(
                        pStructure,
                        iGridNo,
                        pBullet.bLOSIndexX,
                        pBullet.bLOSIndexY,
                        pBullet.ddHorizAngle,
                      );
                    } else {
                      fResolveHit = true;
                    }
                    if (fResolveHit) {
                      gubLocalStructureNumTimesHit[iStructureLoop]++;
                    }
                  }
                }
              }
            }
          }

          // got past everything; go to next LOS location within
          // tile, horizontally or vertically
          bOldLOSIndexX = pBullet.bLOSIndexX;
          bOldLOSIndexY = pBullet.bLOSIndexY;
          iOldCubesZ = pBullet.iCurrCubesZ;
          do {
            pBullet.qCurrX += pBullet.qIncrX;
            pBullet.qCurrY += pBullet.qIncrY;
            if (pRoofStructure) {
              qLastZ = pBullet.qCurrZ;
              pBullet.qCurrZ += pBullet.qIncrZ;
              if (
                (qLastZ > qWallHeight && pBullet.qCurrZ < qWallHeight) ||
                (qLastZ < qWallHeight && pBullet.qCurrZ > qWallHeight)
              ) {
                // hit roof!
                // pBullet->iImpactReduction += CTGTHandleBulletStructureInteraction( pBullet, pRoofStructure );
                // if (pBullet->iImpactReduction >= pBullet->iImpact)
                {
                  return 0;
                }
              }
            } else {
              pBullet.qCurrZ += pBullet.qIncrZ;
            }
            pBullet.iLoop++;
            pBullet.bLOSIndexX = CONVERT_WITHINTILE_TO_INDEX(
              FIXEDPT_TO_INT32(pBullet.qCurrX) % CELL_X_SIZE,
            );
            pBullet.bLOSIndexY = CONVERT_WITHINTILE_TO_INDEX(
              FIXEDPT_TO_INT32(pBullet.qCurrY) % CELL_Y_SIZE,
            );
            pBullet.iCurrCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(
              FIXEDPT_TO_INT32(pBullet.qCurrZ),
            );
          } while (
            pBullet.bLOSIndexX == bOldLOSIndexX &&
            pBullet.bLOSIndexY == bOldLOSIndexY &&
            pBullet.iCurrCubesZ == iOldCubesZ
          );

          DebugLOS(
            FormatString(
              "  CTGT at %ld %ld %ld after moving in nonempty tile from %ld %ld %ld",
              pBullet.bLOSIndexX,
              pBullet.bLOSIndexY,
              pBullet.iCurrCubesZ,
              bOldLOSIndexX,
              bOldLOSIndexY,
              iOldCubesZ,
            ),
          );
          pBullet.iCurrTileX = Math.trunc(
            FIXEDPT_TO_INT32(pBullet.qCurrX) / CELL_X_SIZE,
          );
          pBullet.iCurrTileY = Math.trunc(
            FIXEDPT_TO_INT32(pBullet.qCurrY) / CELL_Y_SIZE,
          );
        }
      } while (
        pBullet.iLoop < pBullet.iDistanceLimit &&
        pBullet.iCurrTileX == iOldTileX &&
        pBullet.iCurrTileY == iOldTileY
      );

      if (
        pBullet.iCurrTileX < 0 ||
        pBullet.iCurrTileX >= WORLD_COLS ||
        pBullet.iCurrTileY < 0 ||
        pBullet.iCurrTileY >= WORLD_ROWS
      ) {
        return 0;
      }

      pBullet.sGridNo = MAPROWCOLTOPOS(pBullet.iCurrTileY, pBullet.iCurrTileX);

      if (pBullet.iLoop > pBullet.iRange * 2) {
        // beyond max effective range, bullet starts to drop!
        // since we're doing an increment based on distance, not time, the
        // decrement is scaled down depending on how fast the bullet is (effective range)
        pBullet.qIncrZ -= Math.trunc(
          INT32_TO_FIXEDPT(100) / (pBullet.iRange * 2),
        );
      }

      // end of the tile...
      if (iNumLocalStructures > 0) {
        for (
          iStructureLoop = 0;
          iStructureLoop < iNumLocalStructures;
          iStructureLoop++
        ) {
          // Calculate the total impact based on the number of points in the structure that were hit
          if (gubLocalStructureNumTimesHit[iStructureLoop] > 0) {
            iTotalStructureImpact =
              CTGTHandleBulletStructureInteraction(
                pBullet,
                gpLocalStructure[iStructureLoop],
              ) * gubLocalStructureNumTimesHit[iStructureLoop];

            // reduce the impact reduction of a structure tile to that of the bullet, since it can't do MORE than stop it.
            iTotalStructureImpact = Math.min(
              iTotalStructureImpact,
              pBullet.iImpact,
            );

            // add to "impact reduction" based on strength of structure weighted by probability of hitting it
            pBullet.iImpactReduction += Math.trunc(
              (iTotalStructureImpact * guiLocalStructureCTH[iStructureLoop]) /
                100,
            );
          }
        }
        if (pBullet.iImpactReduction >= pBullet.iImpact) {
          return 0;
        }
      }
    } while (pBullet.iLoop < pBullet.iDistanceLimit);
    // unless the distance is integral, after the loop there will be a
    // fractional amount of distance remaining which is unchecked
    // but we shouldn't(?) need to check it because the target is there!

    // try simple chance to get through, ignoring range effects
    iChanceToGetThrough = Math.trunc(
      (iChanceToGetThrough * (pBullet.iImpact - pBullet.iImpactReduction)) /
        pBullet.iImpact,
    );

    if (iChanceToGetThrough < 0) {
      iChanceToGetThrough = 0;
    }
    return iChanceToGetThrough;
  }

  function SoldierToSoldierChanceToGetThrough(
    pStartSoldier: SOLDIERTYPE | null,
    pEndSoldier: SOLDIERTYPE | null,
  ): UINT8 {
    let dEndZPos: FLOAT = 0;
    let fOk: boolean;

    if (pStartSoldier == pEndSoldier) {
      return 0;
    }
    if (!pStartSoldier) {
      return 0;
    }
    if (!pEndSoldier) {
      return 0;
    }
    fOk = CalculateSoldierZPos(
      pEndSoldier,
      Enum230.TARGET_POS,
      createPointer(
        () => dEndZPos,
        (v) => (dEndZPos = v),
      ),
    );
    if (!fOk) {
      return 0;
    }

    // set startsoldier's target ID ... need an ID stored in case this
    // is the AI calculating cover to a location where he might not be any more
    pStartSoldier.ubCTGTTargetID = pEndSoldier.ubID;
    return ChanceToGetThrough(
      pStartSoldier,
      CenterX(pEndSoldier.sGridNo),
      CenterY(pEndSoldier.sGridNo),
      dEndZPos,
    );
  }

  export function SoldierToSoldierBodyPartChanceToGetThrough(
    pStartSoldier: SOLDIERTYPE | null,
    pEndSoldier: SOLDIERTYPE | null,
    ubAimLocation: UINT8,
  ): UINT8 {
    // does like StS-CTGT but with a particular body part in mind
    let dEndZPos: FLOAT = 0;
    let fOk: boolean;
    let ubPosType: UINT8;

    if (pStartSoldier == pEndSoldier) {
      return 0;
    }
    if (!pStartSoldier) {
      return 0;
    }
    if (!pEndSoldier) {
      return 0;
    }
    switch (ubAimLocation) {
      case AIM_SHOT_HEAD:
        ubPosType = Enum230.HEAD_TARGET_POS;
        break;
      case AIM_SHOT_TORSO:
        ubPosType = Enum230.TORSO_TARGET_POS;
        break;
      case AIM_SHOT_LEGS:
        ubPosType = Enum230.LEGS_TARGET_POS;
        break;
      default:
        ubPosType = Enum230.TARGET_POS;
        break;
    }

    fOk = CalculateSoldierZPos(
      pEndSoldier,
      ubPosType,
      createPointer(
        () => dEndZPos,
        (v) => (dEndZPos = v),
      ),
    );
    if (!fOk) {
      return 0;
    }

    // set startsoldier's target ID ... need an ID stored in case this
    // is the AI calculating cover to a location where he might not be any more
    pStartSoldier.ubCTGTTargetID = pEndSoldier.ubID;
    return ChanceToGetThrough(
      pStartSoldier,
      CenterX(pEndSoldier.sGridNo),
      CenterY(pEndSoldier.sGridNo),
      dEndZPos,
    );
  }

  export function SoldierToLocationChanceToGetThrough(
    pStartSoldier: SOLDIERTYPE | null,
    sGridNo: INT16,
    bLevel: INT8,
    bCubeLevel: INT8,
    ubTargetID: UINT8,
  ): UINT8 {
    let dEndZPos: FLOAT;
    let sXPos: INT16;
    let sYPos: INT16;
    let bStructHeight: INT8;
    let pEndSoldier: SOLDIERTYPE | null;

    if (!pStartSoldier) {
      return 0;
    }

    if (pStartSoldier.sGridNo == sGridNo) {
      return 0;
    }

    pEndSoldier = SimpleFindSoldier(sGridNo, bLevel);
    if (pEndSoldier != null) {
      return SoldierToSoldierChanceToGetThrough(pStartSoldier, pEndSoldier);
    } else {
      if (bCubeLevel) {
        // fire at the centre of the cube specified
        dEndZPos =
          (bCubeLevel + bLevel * PROFILE_Z_SIZE - 0.5) * HEIGHT_UNITS_PER_INDEX;
      } else {
        bStructHeight = GetStructureTargetHeight(sGridNo, bLevel == 1);
        if (bStructHeight > 0) {
          // fire at the centre of the cube of the tallest structure
          dEndZPos =
            (bStructHeight + bLevel * PROFILE_Z_SIZE - 0.5) *
            HEIGHT_UNITS_PER_INDEX;
        } else {
          // fire at 1 unit above the level of the ground
          dEndZPos = bLevel * PROFILE_Z_SIZE * HEIGHT_UNITS_PER_INDEX + 1;
        }
      }

      dEndZPos += CONVERT_PIXELS_TO_HEIGHTUNITS(
        gpWorldLevelData[sGridNo].sHeight,
      );
      ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sGridNo));
      sXPos = sXPos * CELL_X_SIZE + Math.trunc(CELL_X_SIZE / 2);
      sYPos = sYPos * CELL_Y_SIZE + Math.trunc(CELL_Y_SIZE / 2);

      // set startsoldier's target ID ... need an ID stored in case this
      // is the AI calculating cover to a location where he might not be any more
      pStartSoldier.ubCTGTTargetID = ubTargetID;
      return ChanceToGetThrough(pStartSoldier, sXPos, sYPos, dEndZPos);
    }
  }

  export function AISoldierToSoldierChanceToGetThrough(
    pStartSoldier: SOLDIERTYPE | null,
    pEndSoldier: SOLDIERTYPE | null,
  ): UINT8 {
    // Like a standard CTGT algorithm BUT fakes the start soldier at standing height
    let dEndZPos: FLOAT = 0;
    let fOk: boolean;
    let ubChance: UINT8;
    let usTrueState: UINT16;

    if (pStartSoldier == pEndSoldier) {
      return 0;
    }
    if (!pStartSoldier) {
      return 0;
    }
    if (!pEndSoldier) {
      return 0;
    }
    fOk = CalculateSoldierZPos(
      pEndSoldier,
      Enum230.TARGET_POS,
      createPointer(
        () => dEndZPos,
        (v) => (dEndZPos = v),
      ),
    );
    if (!fOk) {
      return 0;
    }
    usTrueState = pStartSoldier.usAnimState;
    pStartSoldier.usAnimState = Enum193.STANDING;

    // set startsoldier's target ID ... need an ID stored in case this
    // is the AI calculating cover to a location where he might not be any more
    pStartSoldier.ubCTGTTargetID = NOBODY;

    ubChance = ChanceToGetThrough(
      pStartSoldier,
      CenterX(pEndSoldier.sGridNo),
      CenterY(pEndSoldier.sGridNo),
      dEndZPos,
    );
    pStartSoldier.usAnimState = usTrueState;
    return ubChance;
  }

  export function AISoldierToLocationChanceToGetThrough(
    pStartSoldier: SOLDIERTYPE | null,
    sGridNo: INT16,
    bLevel: INT8,
    bCubeLevel: INT8,
  ): UINT8 {
    let dEndZPos: FLOAT;
    let sXPos: INT16;
    let sYPos: INT16;
    let bStructHeight: INT8;
    let pEndSoldier: SOLDIERTYPE | null;

    let usTrueState: UINT16;
    let ubChance: UINT8;

    if (!pStartSoldier) {
      return 0;
    }

    if (pStartSoldier.sGridNo == sGridNo) {
      return 0;
    }

    pEndSoldier = SimpleFindSoldier(sGridNo, bLevel);
    if (pEndSoldier != null) {
      return AISoldierToSoldierChanceToGetThrough(pStartSoldier, pEndSoldier);
    } else {
      if (bCubeLevel) {
        // fire at the centre of the cube specified
        dEndZPos =
          (bCubeLevel + bLevel * PROFILE_Z_SIZE - 0.5) * HEIGHT_UNITS_PER_INDEX;
      } else {
        bStructHeight = GetStructureTargetHeight(sGridNo, bLevel == 1);
        if (bStructHeight > 0) {
          // fire at the centre of the cube of the tallest structure
          dEndZPos =
            (bStructHeight + bLevel * PROFILE_Z_SIZE - 0.5) *
            HEIGHT_UNITS_PER_INDEX;
        } else {
          // fire at 1 unit above the level of the ground
          dEndZPos = bLevel * PROFILE_Z_SIZE * HEIGHT_UNITS_PER_INDEX + 1;
        }
      }

      dEndZPos += CONVERT_PIXELS_TO_HEIGHTUNITS(
        gpWorldLevelData[sGridNo].sHeight,
      );
      ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sGridNo));
      sXPos = sXPos * CELL_X_SIZE + Math.trunc(CELL_X_SIZE / 2);
      sYPos = sYPos * CELL_Y_SIZE + Math.trunc(CELL_Y_SIZE / 2);

      // set startsoldier's target ID ... need an ID stored in case this
      // is the AI calculating cover to a location where he might not be any more
      pStartSoldier.ubCTGTTargetID = NOBODY;

      usTrueState = pStartSoldier.usAnimState;
      pStartSoldier.usAnimState = Enum193.STANDING;

      ubChance = ChanceToGetThrough(pStartSoldier, sXPos, sYPos, dEndZPos);

      pStartSoldier.usAnimState = usTrueState;

      return ubChance;
    }
  }

  function CalculateFiringIncrements(
    ddHorizAngle: DOUBLE,
    ddVerticAngle: DOUBLE,
    dd2DDistance: DOUBLE,
    pBullet: BULLET,
    pddNewHorizAngle: Pointer<DOUBLE>,
    pddNewVerticAngle: Pointer<DOUBLE>,
  ): void {
    let iMissedBy: INT32 = -pBullet.sHitBy;
    let ddVerticPercentOfMiss: DOUBLE;
    let ddAbsVerticAngle: DOUBLE;
    let ddScrewupAdjustmentLimit: DOUBLE;
    let uiChanceOfMissAbove: UINT32;
    let ddMinimumMiss: DOUBLE;
    let ddMaximumMiss: DOUBLE;
    let ddAmountOfMiss: DOUBLE;

    if (iMissedBy > 0) {
      ddVerticPercentOfMiss = PreRandom(50);

      ddAbsVerticAngle = ddVerticAngle;
      if (ddAbsVerticAngle < 0) {
        ddAbsVerticAngle *= -1.0;
      }

      // chance of shooting over target is 60 for horizontal shots, up to 80% for shots at 22.5 degrees,
      // and then down again to 50% for shots at 45+%.
      if (ddAbsVerticAngle < DEGREES_22_5) {
        uiChanceOfMissAbove = Math.trunc(
          60 + (20 * ddAbsVerticAngle) / DEGREES_22_5,
        );
      } else if (ddAbsVerticAngle < DEGREES_45) {
        uiChanceOfMissAbove = Math.trunc(
          80 - (30.0 * (ddAbsVerticAngle - DEGREES_22_5)) / DEGREES_22_5,
        );
      } else {
        uiChanceOfMissAbove = 50;
      }
      // figure out change in horizontal and vertical angle due to shooter screwup
      // the more the screwup, the greater the angle;
      // for the look of things, the further away, reduce the angle a bit.
      ddScrewupAdjustmentLimit = dd2DDistance / CELL_X_SIZE / 200;
      if (ddScrewupAdjustmentLimit > MAX_AIMING_SCREWUP / 2) {
        ddScrewupAdjustmentLimit = MAX_AIMING_SCREWUP / 2;
      }
      ddMaximumMiss = MAX_AIMING_SCREWUP - ddScrewupAdjustmentLimit;

      // Want to make sure that not too many misses actually hit the target after all
      // to miss a target at 1 tile is about 30 degrees off, at 5 tiles, 6 degrees off
      // at 15 tiles, 2 degrees off.  Thus 30 degrees divided by the # of tiles distance.
      ddMinimumMiss = MIN_AIMING_SCREWUP / (dd2DDistance / CELL_X_SIZE);

      if (ddMinimumMiss > ddMaximumMiss) {
        ddMinimumMiss = ddMaximumMiss;
      }

      ddAmountOfMiss =
        ((ddMaximumMiss - ddMinimumMiss) * iMissedBy) / 100.0 + ddMinimumMiss;

      // miss to the left or right
      if (PreRandom(2)) {
        ddHorizAngle +=
          (ddAmountOfMiss * (100.0 - ddVerticPercentOfMiss)) / 100.0;
      } else {
        ddHorizAngle -=
          (ddAmountOfMiss * (100.0 - ddVerticPercentOfMiss)) / 100.0;
      }

      // miss up or down
      if (PreRandom(100) < uiChanceOfMissAbove) {
        ddVerticAngle += (ddAmountOfMiss * ddVerticPercentOfMiss) / 100.0;
      } else {
        ddVerticAngle -= (ddAmountOfMiss * ddVerticPercentOfMiss) / 100.0;
      }
    }

    pddNewHorizAngle.value = ddHorizAngle;
    pddNewVerticAngle.value = ddVerticAngle;

    pBullet.qIncrX = FloatToFixed(Math.cos(ddHorizAngle));
    pBullet.qIncrY = FloatToFixed(Math.sin(ddHorizAngle));

    // this is the same as multiplying the X and Y increments by the projection of the line in
    // 3-space onto the horizontal plane, without reducing the X/Y increments and thus slowing
    // the LOS code
    pBullet.qIncrZ = FloatToFixed(
      (Math.sin(ddVerticAngle) / Math.sin(Math.PI / 2 - ddVerticAngle)) * 2.56,
    );
  }

  function FireBullet(
    pFirer: SOLDIERTYPE,
    pBullet: BULLET,
    fFake: boolean,
  ): INT8 {
    pBullet.iCurrTileX = Math.trunc(
      FIXEDPT_TO_INT32(pBullet.qCurrX) / CELL_X_SIZE,
    );
    pBullet.iCurrTileY = Math.trunc(
      FIXEDPT_TO_INT32(pBullet.qCurrY) / CELL_Y_SIZE,
    );
    pBullet.bLOSIndexX = CONVERT_WITHINTILE_TO_INDEX(
      FIXEDPT_TO_INT32(pBullet.qCurrX) % CELL_X_SIZE,
    );
    pBullet.bLOSIndexY = CONVERT_WITHINTILE_TO_INDEX(
      FIXEDPT_TO_INT32(pBullet.qCurrY) % CELL_Y_SIZE,
    );
    pBullet.iCurrCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(
      FIXEDPT_TO_INT32(pBullet.qCurrZ),
    );
    pBullet.iLoop = 1;
    pBullet.pFirer = pFirer;
    pBullet.iImpactReduction = 0;
    pBullet.sGridNo = MAPROWCOLTOPOS(pBullet.iCurrTileY, pBullet.iCurrTileX);
    if (fFake) {
      pBullet.ubTargetID = pFirer.ubCTGTTargetID;
      return CalcChanceToGetThrough(pBullet);
    } else {
      pBullet.ubTargetID = pFirer.ubTargetID;
      // if ( gGameSettings.fOptions[ TOPTION_HIDE_BULLETS ] )
      //{
      //	pBullet->uiLastUpdate = 0;
      //	pBullet->ubTilesPerUpdate	= 4;
      //}
      // else
      //{
      pBullet.uiLastUpdate = 0;
      pBullet.ubTilesPerUpdate = 1;
      //}

      // increment shots fired if shooter has a merc profile
      if (pFirer.ubProfile != NO_PROFILE && pFirer.bTeam == 0) {
        // another shot fired
        gMercProfiles[pFirer.ubProfile].usShotsFired++;
      }

      if (Item[pFirer.usAttackingWeapon].usItemClass == IC_THROWING_KNIFE) {
        pBullet.usClockTicksPerUpdate = 30;
      } else {
        pBullet.usClockTicksPerUpdate = Math.trunc(
          Weapon[pFirer.usAttackingWeapon].ubBulletSpeed / 10,
        );
      }

      HandleBulletSpecialFlags(pBullet.iBullet);

      MoveBullet(pBullet.iBullet);

      return 1;
    }
  }

  /*
DOUBLE CalculateVerticalAngle( SOLDIERTYPE * pFirer, SOLDIERTYPE * pTarget )
{
        DOUBLE dStartZ, dEndZ;

        CalculateSoldierZPos( pFirer, FIRING_POS, &dStartZ );
        CalculateSoldierZPos( pTarget, TARGET_POS, &dEndZ );

        dDeltaX = (FLOAT) CenterX( pTarget->sGridNo ) - (FLOAT) CenterX( pFirer->sGridNo );
        dDeltaY = (FLOAT) CenterY( pTarget->sGridNo ) - (FLOAT) CenterY( pFirer->sGridNo );
        dDeltaZ = dEndZ - dStartZ;

        d2DDistance = Distance2D( dDeltaX, dDeltaY );

        ddOrigHorizAngle = atan2( dDeltaY, dDeltaX );
}
*/

  export function FireBulletGivenTarget(
    pFirer: SOLDIERTYPE,
    dEndX: FLOAT,
    dEndY: FLOAT,
    dEndZ: FLOAT,
    usHandItem: UINT16,
    sHitBy: INT16,
    fBuckshot: boolean,
    fFake: boolean,
  ): INT8 {
    // fFake indicates that we should set things up for a call to ChanceToGetThrough
    let dStartZ: FLOAT = 0;

    let d2DDistance: FLOAT;
    let dDeltaX: FLOAT;
    let dDeltaY: FLOAT;
    let dDeltaZ: FLOAT;

    let dStartX: FLOAT;
    let dStartY: FLOAT;

    let ddOrigHorizAngle: DOUBLE;
    let ddOrigVerticAngle: DOUBLE;
    let ddHorizAngle: DOUBLE;
    let ddVerticAngle: DOUBLE;
    let ddAdjustedHorizAngle: DOUBLE = 0;
    let ddAdjustedHorizAngle__Pointer = createPointer(
      () => ddAdjustedHorizAngle,
      (v) => (ddAdjustedHorizAngle = v),
    );
    let ddAdjustedVerticAngle: DOUBLE = 0;
    let ddAdjustedVerticAngle__Pointer = createPointer(
      () => ddAdjustedVerticAngle,
      (v) => (ddAdjustedVerticAngle = v),
    );
    let ddDummyHorizAngle: DOUBLE = 0;
    let ddDummyHorizAngle__Pointer = createPointer(
      () => ddDummyHorizAngle,
      (v) => (ddDummyHorizAngle = v),
    );
    let ddDummyVerticAngle: DOUBLE = 0;
    let ddDummyVerticAngle__Pointer = createPointer(
      () => ddDummyVerticAngle,
      (v) => (ddDummyVerticAngle = v),
    );

    let pBullet: BULLET;
    let iBullet: INT32;

    let iDistance: INT32;

    let ubLoop: UINT8;
    let ubShots: UINT8;
    let ubImpact: UINT8;
    let bCTGT: INT8;
    let ubSpreadIndex: UINT8 = 0;
    let usBulletFlags: UINT16 = 0;

    CalculateSoldierZPos(
      pFirer,
      Enum230.FIRING_POS,
      createPointer(
        () => dStartZ,
        (v) => (dStartZ = v),
      ),
    );

    dStartX = CenterX(pFirer.sGridNo);
    dStartY = CenterY(pFirer.sGridNo);

    dDeltaX = dEndX - dStartX;
    dDeltaY = dEndY - dStartY;
    dDeltaZ = dEndZ - dStartZ;

    d2DDistance = Distance2D(dDeltaX, dDeltaY);
    iDistance = d2DDistance;

    if (d2DDistance != iDistance) {
      iDistance += 1;
      d2DDistance = iDistance;
    }

    ddOrigHorizAngle = Math.atan2(dDeltaY, dDeltaX);
    ddOrigVerticAngle = Math.atan2(dDeltaZ, d2DDistance * 2.56);

    ubShots = 1;

    // Check if we have spit as a weapon!
    if (Weapon[usHandItem].ubCalibre == Enum285.AMMOMONST) {
      usBulletFlags |= BULLET_FLAG_CREATURE_SPIT;
    } else if (Item[usHandItem].usItemClass == IC_THROWING_KNIFE) {
      usBulletFlags |= BULLET_FLAG_KNIFE;
    } else if (usHandItem == Enum225.ROCKET_LAUNCHER) {
      usBulletFlags |= BULLET_FLAG_MISSILE;
    } else if (usHandItem == Enum225.TANK_CANNON) {
      usBulletFlags |= BULLET_FLAG_TANK_CANNON;
    } else if (
      usHandItem == Enum225.ROCKET_RIFLE ||
      usHandItem == Enum225.AUTO_ROCKET_RIFLE
    ) {
      usBulletFlags |= BULLET_FLAG_SMALL_MISSILE;
    } else if (usHandItem == Enum225.FLAMETHROWER) {
      usBulletFlags |= BULLET_FLAG_FLAME;
      ubSpreadIndex = 2;
    }

    ubImpact = Weapon[usHandItem].ubImpact;
    //	if (!fFake)
    {
      if (fBuckshot) {
        // shotgun pellets fire 9 bullets doing 1/4 damage each
        if (!fFake) {
          ubShots = BUCKSHOT_SHOTS;
          // but you can't really aim the damn things very well!
          if (sHitBy > 0) {
            sHitBy = Math.trunc(sHitBy / 2);
          }
          if (
            FindAttachment(
              pFirer.inv[pFirer.ubAttackingHand],
              Enum225.DUCKBILL,
            ) != NO_SLOT
          ) {
            ubSpreadIndex = 1;
          }
          if (pFirer.ubTargetID != NOBODY) {
            MercPtrs[pFirer.ubTargetID].bNumPelletsHitBy = 0;
          }
          usBulletFlags |= BULLET_FLAG_BUCKSHOT;
        }
        ubImpact = AMMO_DAMAGE_ADJUSTMENT_BUCKSHOT(ubImpact);
      }
    }

    // GET BULLET
    for (ubLoop = 0; ubLoop < ubShots; ubLoop++) {
      iBullet = CreateBullet(pFirer.ubID, fFake, usBulletFlags);
      if (iBullet == -1) {
        DebugMsg(
          TOPIC_JA2,
          DBG_LEVEL_3,
          FormatString("Failed to create bullet"),
        );

        return 0;
      }
      pBullet = GetBulletPtr(iBullet);
      pBullet.sHitBy = sHitBy;

      if (dStartZ < WALL_HEIGHT_UNITS) {
        if (dEndZ > WALL_HEIGHT_UNITS) {
          pBullet.fCheckForRoof = true;
        } else {
          pBullet.fCheckForRoof = false;
        }
      } // dStartZ >= WALL_HEIGHT_UNITS; presumably >
      else {
        if (dEndZ < WALL_HEIGHT_UNITS) {
          pBullet.fCheckForRoof = true;
        } else {
          pBullet.fCheckForRoof = false;
        }
      }

      if (ubLoop == 0) {
        ddHorizAngle = ddOrigHorizAngle;
        ddVerticAngle = ddOrigVerticAngle;

        // first bullet, roll to hit...
        if (sHitBy >= 0) {
          // calculate by hand (well, without angles) to match LOS
          pBullet.qIncrX = FloatToFixed(dDeltaX / iDistance);
          pBullet.qIncrY = FloatToFixed(dDeltaY / iDistance);
          pBullet.qIncrZ = FloatToFixed(dDeltaZ / iDistance);
          ddAdjustedHorizAngle = ddHorizAngle;
          ddAdjustedVerticAngle = ddVerticAngle;
        } else {
          CalculateFiringIncrements(
            ddHorizAngle,
            ddVerticAngle,
            d2DDistance,
            pBullet,
            ddAdjustedHorizAngle__Pointer,
            ddAdjustedVerticAngle__Pointer,
          );
        }
      } else {
        // temporarily set bullet's sHitBy value to 0 to get unadjusted angles
        pBullet.sHitBy = 0;

        ddHorizAngle =
          ddAdjustedHorizAngle + ddShotgunSpread[ubSpreadIndex][ubLoop][0];
        ddVerticAngle =
          ddAdjustedVerticAngle + ddShotgunSpread[ubSpreadIndex][ubLoop][1];

        CalculateFiringIncrements(
          ddHorizAngle,
          ddVerticAngle,
          d2DDistance,
          pBullet,
          ddDummyHorizAngle__Pointer,
          ddDummyVerticAngle__Pointer,
        );
        pBullet.sHitBy = sHitBy;
      }

      pBullet.ddHorizAngle = ddHorizAngle;

      if (ubLoop == 0 && pFirer.bDoBurst < 2) {
        pBullet.fAimed = true;
      } else {
        // buckshot pellets after the first can hit friendlies even at close range
        pBullet.fAimed = false;
      }

      if (pBullet.usFlags & BULLET_FLAG_KNIFE) {
        pBullet.ubItemStatus = pFirer.inv[pFirer.ubAttackingHand].bStatus[0];
      }

      // apply increments for first move

      pBullet.qCurrX = FloatToFixed(dStartX) + pBullet.qIncrX;
      pBullet.qCurrY = FloatToFixed(dStartY) + pBullet.qIncrY;
      pBullet.qCurrZ = FloatToFixed(dStartZ) + pBullet.qIncrZ;

      // NB we can only apply correction for leftovers if the bullet is going to hit
      // because otherwise the increments are not right for the calculations!
      if (pBullet.sHitBy >= 0) {
        pBullet.qCurrX += Math.trunc(
          (FloatToFixed(dDeltaX) - pBullet.qIncrX * iDistance) / 2,
        );
        pBullet.qCurrY += Math.trunc(
          (FloatToFixed(dDeltaY) - pBullet.qIncrY * iDistance) / 2,
        );
        pBullet.qCurrZ += Math.trunc(
          (FloatToFixed(dDeltaZ) - pBullet.qIncrZ * iDistance) / 2,
        );
      }

      pBullet.iImpact = ubImpact;

      pBullet.iRange = GunRange(pFirer.inv[pFirer.ubAttackingHand]);
      pBullet.sTargetGridNo =
        Math.trunc(Math.trunc(dEndX) / CELL_X_SIZE) +
        Math.trunc(Math.trunc(dEndY) / CELL_Y_SIZE) * WORLD_COLS;

      pBullet.bStartCubesAboveLevelZ = CONVERT_HEIGHTUNITS_TO_INDEX(
        dStartZ -
          CONVERT_PIXELS_TO_HEIGHTUNITS(
            gpWorldLevelData[pFirer.sGridNo].sHeight,
          ),
      );
      pBullet.bEndCubesAboveLevelZ = CONVERT_HEIGHTUNITS_TO_INDEX(
        dEndZ -
          CONVERT_PIXELS_TO_HEIGHTUNITS(
            gpWorldLevelData[pBullet.sTargetGridNo].sHeight,
          ),
      );

      // this distance limit only applies in a "hard" sense to fake bullets for chance-to-get-through,
      // but is used for determining structure hits by the regular code
      pBullet.iDistanceLimit = iDistance;
      if (fFake) {
        bCTGT = FireBullet(pFirer, pBullet, true);
        RemoveBullet(iBullet);
        return bCTGT;
      } else {
        if (ubLoop + 1 > pFirer.bBulletsLeft) {
          // this is an error!!
          ubLoop = ubLoop;
        }
        FireBullet(pFirer, pBullet, false);
      }
    }

    return 1;
  }

  function ChanceToGetThrough(
    pFirer: SOLDIERTYPE,
    dEndX: FLOAT,
    dEndY: FLOAT,
    dEndZ: FLOAT,
  ): INT8 {
    if (
      Item[pFirer.usAttackingWeapon].usItemClass == IC_GUN ||
      Item[pFirer.usAttackingWeapon].usItemClass == IC_THROWING_KNIFE
    ) {
      let fBuckShot: boolean = false;

      // if shotgun, shotgun would have to be in main hand
      if (pFirer.inv[Enum261.HANDPOS].usItem == pFirer.usAttackingWeapon) {
        if (
          pFirer.inv[Enum261.HANDPOS].ubGunAmmoType == Enum286.AMMO_BUCKSHOT
        ) {
          fBuckShot = true;
        }
      }

      return FireBulletGivenTarget(
        pFirer,
        dEndX,
        dEndY,
        dEndZ,
        pFirer.usAttackingWeapon,
        0,
        fBuckShot,
        true,
      );
    } else {
      // fake it
      return FireBulletGivenTarget(
        pFirer,
        dEndX,
        dEndY,
        dEndZ,
        Enum225.GLOCK_17,
        0,
        false,
        true,
      );
    }
  }

  export function MoveBullet(iBullet: INT32): void {
    let pBullet: BULLET;

    let qLandHeight: FIXEDPT;
    let iCurrAboveLevelZ: INT32;
    let iCurrCubesAboveLevelZ: INT32;
    let sDesiredLevel: INT16;

    let iOldTileX: INT32;
    let iOldTileY: INT32;
    let iOldCubesZ: INT32;

    let pMapElement: MAP_ELEMENT;
    let pStructure: STRUCTURE | null;
    let pRoofStructure: STRUCTURE | null = null;

    let qLastZ: FIXEDPT;

    let pTarget: SOLDIERTYPE | null;
    let ubTargetID: UINT8;
    let fIntended: boolean;
    let fStopped: boolean;
    let bOldLOSIndexX: INT8;
    let bOldLOSIndexY: INT8;

    let uiTileInc: UINT32 = 0;
    let uiTime: UINT32;

    let bDir: INT8;
    let iGridNo: INT32;
    let iAdjGridNo: INT32;

    let iRemainingImpact: INT32;

    let qDistToTravelX: FIXEDPT;
    let qDistToTravelY: FIXEDPT;
    let iStepsToTravelX: INT32;
    let iStepsToTravelY: INT32;
    let iStepsToTravel: INT32;

    let iNumLocalStructures: INT32;
    let iStructureLoop: INT32;
    let uiChanceOfHit: UINT32;

    let fResolveHit: boolean;

    let i: INT32;
    let fGoingOver: boolean = false;
    let fHitStructure: boolean = false;
    let fHitStructure__Pointer = createPointer(
      () => fHitStructure,
      (v) => (fHitStructure = v),
    );

    let qWallHeight: FIXEDPT;
    let qWindowBottomHeight: FIXEDPT;
    let qWindowTopHeight: FIXEDPT;

    pBullet = GetBulletPtr(iBullet);

    // CHECK MIN TIME ELAPSED
    uiTime = GetJA2Clock();

    if (uiTime - pBullet.uiLastUpdate < pBullet.usClockTicksPerUpdate) {
      return;
    }

    pBullet.uiLastUpdate = uiTime;

    do {
      // check a particular tile
      // retrieve values from world for this particular tile
      iGridNo = pBullet.iCurrTileX + pBullet.iCurrTileY * WORLD_COLS;
      if (
        !GridNoOnVisibleWorldTile(iGridNo) ||
        (pBullet.iCurrCubesZ > PROFILE_Z_SIZE * 2 &&
          FIXEDPT_TO_INT32(pBullet.qIncrZ) > 0)
      ) {
        // bullet outside of world!
        // NB remove bullet only flags a bullet for deletion; we still have access to the
        // information in the structure
        RemoveBullet(pBullet.iBullet);
        BulletMissed(pBullet, pBullet.pFirer);
        return;
      }

      pMapElement = gpWorldLevelData[iGridNo];
      qLandHeight = INT32_TO_FIXEDPT(
        CONVERT_PIXELS_TO_HEIGHTUNITS(pMapElement.sHeight),
      );
      qWallHeight = gqStandardWallHeight + qLandHeight;
      qWindowBottomHeight = gqStandardWindowBottomHeight + qLandHeight;
      qWindowTopHeight = gqStandardWindowTopHeight + qLandHeight;

      // calculate which level bullet is on for suppression and close call purposes
      // figure out the LOS cube level of the current point
      iCurrCubesAboveLevelZ = CONVERT_HEIGHTUNITS_TO_INDEX(
        FIXEDPT_TO_INT32(pBullet.qCurrZ - qLandHeight),
      );
      // figure out the level
      if (iCurrCubesAboveLevelZ < STRUCTURE_ON_GROUND_MAX) {
        // check objects on the ground
        sDesiredLevel = 0;
      } else {
        // check objects on roofs
        sDesiredLevel = 1;
      }

      // assemble list of structures we might hit!
      iNumLocalStructures = 0;
      pStructure = pMapElement.pStructureHead;
      // calculate chance of hitting each structure
      uiChanceOfHit = ChanceOfBulletHittingStructure(
        pBullet.iLoop,
        pBullet.iDistanceLimit,
        pBullet.sHitBy,
      );
      if (iGridNo == pBullet.sTargetGridNo) {
        fIntended = true;
        // if in the same tile as our destination, we WANT to hit the structure!
        if (fIntended) {
          uiChanceOfHit = 100;
        }
      } else {
        fIntended = false;
      }

      while (pStructure) {
        if (pStructure.fFlags & ALWAYS_CONSIDER_HIT) {
          // ALWAYS add walls
          // fence is special
          if (pStructure.fFlags & STRUCTURE_ANYFENCE) {
            // If the density of the fence is less than 100%, or this is the top of the fence, then roll the dice
            // NB cubes are 0 based, heights 1 based
            if (pStructure.pDBStructureRef.pDBStructure.ubDensity < 100) {
              // requires roll
              if (PreRandom(100) < uiChanceOfHit) {
                gpLocalStructure[iNumLocalStructures] = pStructure;
                gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
                iNumLocalStructures++;
              }
            } else if (
              pBullet.iLoop <= CLOSE_TO_FIRER &&
              iCurrCubesAboveLevelZ <= pBullet.bStartCubesAboveLevelZ &&
              pBullet.bEndCubesAboveLevelZ >= iCurrCubesAboveLevelZ &&
              iCurrCubesAboveLevelZ == StructureHeight(pStructure) - 1
            ) {
              // near firer and at top of structure and at same level as bullet's start
              // requires roll
              if (PreRandom(100) < uiChanceOfHit) {
                gpLocalStructure[iNumLocalStructures] = pStructure;
                gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
                iNumLocalStructures++;
              }
            } else if (
              pBullet.iDistanceLimit - pBullet.iLoop <= CLOSE_TO_FIRER &&
              iCurrCubesAboveLevelZ <= pBullet.bEndCubesAboveLevelZ &&
              iCurrCubesAboveLevelZ == StructureHeight(pStructure) - 1
            ) {
              // near target and at top of structure and at same level as bullet's end
              // requires roll
              if (PreRandom(100) < uiChanceOfHit) {
                gpLocalStructure[iNumLocalStructures] = pStructure;
                gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
                iNumLocalStructures++;
              }
            } else {
              // always add
              gpLocalStructure[iNumLocalStructures] = pStructure;
              gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
              iNumLocalStructures++;
            }

            /*
          if ( !( (pStructure->pDBStructureRef->pDBStructure->ubDensity < 100 || iCurrCubesAboveLevelZ == (StructureHeight( pStructure ) - 1) )	) && (PreRandom( 100 ) >= uiChanceOfHit) )
          {
                  gpLocalStructure[iNumLocalStructures] = pStructure;
                  gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
                  iNumLocalStructures++;
          }
          */
          } else {
            gpLocalStructure[iNumLocalStructures] = pStructure;
            gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
            iNumLocalStructures++;
          }
        } else if (pStructure.fFlags & STRUCTURE_ROOF) {
          // only consider roofs if the flag is set; don't add them to the array since they
          // are a special case
          if (pBullet.fCheckForRoof) {
            pRoofStructure = pStructure;

            qLastZ = pBullet.qCurrZ - pBullet.qIncrZ;

            // if just on going to next tile we cross boundary, then roof stops bullet here!
            if (
              (qLastZ > qWallHeight && pBullet.qCurrZ <= qWallHeight) ||
              (qLastZ < qWallHeight && pBullet.qCurrZ >= qWallHeight)
            ) {
              // hit a roof
              StopBullet(pBullet.iBullet);
              BulletHitStructure(
                pBullet,
                0,
                0,
                pBullet.pFirer,
                pBullet.qCurrX,
                pBullet.qCurrY,
                pBullet.qCurrZ,
                true,
              );
              return;
            }
          }
        } else if (pStructure.fFlags & STRUCTURE_PERSON) {
          if (MercPtrs[pStructure.usStructureID] != pBullet.pFirer) {
            // in actually moving the bullet, we consider only count friends as targets if the bullet is unaimed
            // (buckshot), if they are the intended target, or beyond the range of automatic friendly fire hits
            // OR a 1 in 30 chance occurs

            // ignore *intervening* target if not visible; PCs are always visible so AI will never skip them on that
            // basis
            if (fIntended) {
              // could hit this person!
              gpLocalStructure[iNumLocalStructures] = pStructure;
              iNumLocalStructures++;
            } else if (pBullet.pFirer.uiStatusFlags & SOLDIER_MONSTER) {
              // monsters firing will always accidentally hit people but never accidentally hit each other.
              if (
                !(
                  MercPtrs[pStructure.usStructureID].uiStatusFlags &
                  SOLDIER_MONSTER
                )
              ) {
                gpLocalStructure[iNumLocalStructures] = pStructure;
                iNumLocalStructures++;
              }
            } else if (
              MercPtrs[pStructure.usStructureID].bVisible == 1 &&
              gAnimControl[MercPtrs[pStructure.usStructureID].usAnimState]
                .ubEndHeight == ANIM_STAND &&
              ((pBullet.fAimed && pBullet.iLoop > MIN_DIST_FOR_HIT_FRIENDS) ||
                (!pBullet.fAimed &&
                  pBullet.iLoop > MIN_DIST_FOR_HIT_FRIENDS_UNAIMED) ||
                PreRandom(100) < MIN_CHANCE_TO_ACCIDENTALLY_HIT_SOMEONE)
            ) {
              // could hit this person!
              gpLocalStructure[iNumLocalStructures] = pStructure;
              iNumLocalStructures++;
            }

            // this might be a close call
            if (
              MercPtrs[pStructure.usStructureID].bTeam == gbPlayerNum &&
              pBullet.pFirer.bTeam != gbPlayerNum &&
              sDesiredLevel == MercPtrs[pStructure.usStructureID].bLevel
            ) {
              MercPtrs[pStructure.usStructureID].fCloseCall = true;
            }

            if (IS_MERC_BODY_TYPE(MercPtrs[pStructure.usStructureID])) {
              // apply suppression, regardless of friendly or enemy
              // except if friendly, not within a few tiles of shooter
              if (
                MercPtrs[pStructure.usStructureID].bSide !=
                  pBullet.pFirer.bSide ||
                pBullet.iLoop > MIN_DIST_FOR_HIT_FRIENDS
              ) {
                // buckshot has only a 1 in 2 chance of applying a suppression point
                if (!(pBullet.usFlags & BULLET_FLAG_BUCKSHOT) || Random(2)) {
                  // bullet goes whizzing by this guy!
                  switch (
                    gAnimControl[MercPtrs[pStructure.usStructureID].usAnimState]
                      .ubEndHeight
                  ) {
                    case ANIM_PRONE:
                      // two 1/4 chances of avoiding suppression pt - one below
                      if (PreRandom(4) == 0) {
                        break;
                      }
                    // else fall through
                    case ANIM_CROUCH:
                      // 1/4 chance of avoiding suppression pt
                      if (PreRandom(4) == 0) {
                        break;
                      }
                    // else fall through
                    default:
                      MercPtrs[pStructure.usStructureID].ubSuppressionPoints++;
                      MercPtrs[pStructure.usStructureID].ubSuppressorID =
                        pBullet.pFirer.ubID;
                      break;
                  }
                }
              }
            }
          }
        } else if (pStructure.fFlags & STRUCTURE_CORPSE) {
          if (
            iGridNo == pBullet.sTargetGridNo ||
            pStructure.pDBStructureRef.pDBStructure.ubNumberOfTiles >= 10
          ) {
            // could hit this corpse!
            // but ignore if someone is here
            if (FindStructure(iGridNo, STRUCTURE_PERSON) == null) {
              gpLocalStructure[iNumLocalStructures] = pStructure;
              iNumLocalStructures++;
            }
          }
        } else {
          if (pBullet.iLoop > CLOSE_TO_FIRER || fIntended) {
            // calculate chance of hitting structure
            if (PreRandom(100) < uiChanceOfHit) {
              // could hit it
              gpLocalStructure[iNumLocalStructures] = pStructure;
              gubLocalStructureNumTimesHit[iNumLocalStructures] = 0;
              iNumLocalStructures++;
            }
          }
        }
        pStructure = pStructure.pNext;
      }

      // check to see if any soldiers are nearby; those soldiers
      // have their near-miss value incremented
      if (pMapElement.ubAdjacentSoldierCnt > 0) {
        // cube level now calculated above!
        // figure out the LOS cube level of the current point
        // iCurrCubesAboveLevelZ = CONVERT_HEIGHTUNITS_TO_INDEX( FIXEDPT_TO_INT32( pBullet->qCurrZ - qLandHeight) );
        // figure out what level to affect...
        if (iCurrCubesAboveLevelZ < STRUCTURE_ON_ROOF_MAX) {
          /*
        if (iCurrCubesAboveLevelZ < STRUCTURE_ON_GROUND_MAX)
        {
                // check objects on the ground
                sDesiredLevel = 0;
        }
        else
        {
                // check objects on roofs
                sDesiredLevel = 1;
        }
        */

          for (bDir = 0; bDir < Enum245.NUM_WORLD_DIRECTIONS; bDir++) {
            iAdjGridNo = iGridNo + DirIncrementer[bDir];

            if (
              gubWorldMovementCosts[iAdjGridNo][sDesiredLevel][bDir] <
              TRAVELCOST_BLOCKED
            ) {
              ubTargetID = WhoIsThere2(iAdjGridNo, sDesiredLevel);
              if (ubTargetID != NOBODY) {
                pTarget = MercPtrs[ubTargetID];
                if (
                  IS_MERC_BODY_TYPE(pTarget) &&
                  pBullet.pFirer.bSide != pTarget.bSide
                ) {
                  if (!(pBullet.usFlags & BULLET_FLAG_BUCKSHOT) || Random(2)) {
                    // bullet goes whizzing by this guy!
                    switch (gAnimControl[pTarget.usAnimState].ubEndHeight) {
                      case ANIM_PRONE:
                        // two 1/4 chances of avoiding suppression pt - one below
                        if (PreRandom(4) == 0) {
                          break;
                        }
                      // else fall through
                      case ANIM_CROUCH:
                        // 1/4 chance of avoiding suppression pt
                        if (PreRandom(4) == 0) {
                          break;
                        }
                      // else fall through
                      default:
                        pTarget.ubSuppressionPoints++;
                        pTarget.ubSuppressorID = pBullet.pFirer.ubID;
                        break;
                    }
                  }

                  /*
                                                                                // this could be a close call
                                                                                if ( pTarget->bTeam == gbPlayerNum && pBullet->pFirer->bTeam != gbPlayerNum )
                                                                                {
                                                                                        pTarget->fCloseCall = TRUE;
                                                                                }
                                                                                */
                }
              }
            }
          }
        }
      }

      // record old tile location for loop purposes
      iOldTileX = pBullet.iCurrTileX;
      iOldTileY = pBullet.iCurrTileY;

      do {
        // check a particular location within the tile

        // check for collision with the ground
        iCurrAboveLevelZ = FIXEDPT_TO_INT32(pBullet.qCurrZ - qLandHeight);
        if (iCurrAboveLevelZ < 0) {
          // ground is in the way!
          StopBullet(pBullet.iBullet);
          BulletHitStructure(
            pBullet,
            INVALID_STRUCTURE_ID,
            0,
            pBullet.pFirer,
            pBullet.qCurrX,
            pBullet.qCurrY,
            pBullet.qCurrZ,
            true,
          );
          return;
        }
        // check for the existence of structures
        if (iNumLocalStructures == 0 && !pRoofStructure) {
          // no structures in this tile, AND THAT INCLUDES ROOFS! :-)
          // new system; figure out how many steps until we cross the next edge
          // and then fast forward that many steps.

          iOldTileX = pBullet.iCurrTileX;
          iOldTileY = pBullet.iCurrTileY;
          iOldCubesZ = pBullet.iCurrCubesZ;

          if (pBullet.qIncrX > 0) {
            qDistToTravelX =
              INT32_TO_FIXEDPT(CELL_X_SIZE) -
              (pBullet.qCurrX % INT32_TO_FIXEDPT(CELL_X_SIZE));
            iStepsToTravelX = Math.trunc(qDistToTravelX / pBullet.qIncrX);
          } else if (pBullet.qIncrX < 0) {
            qDistToTravelX = pBullet.qCurrX % INT32_TO_FIXEDPT(CELL_X_SIZE);
            iStepsToTravelX = Math.trunc(qDistToTravelX / -pBullet.qIncrX);
          } else {
            // make sure we don't consider X a limit :-)
            iStepsToTravelX = 1000000;
          }

          if (pBullet.qIncrY > 0) {
            qDistToTravelY =
              INT32_TO_FIXEDPT(CELL_Y_SIZE) -
              (pBullet.qCurrY % INT32_TO_FIXEDPT(CELL_Y_SIZE));
            iStepsToTravelY = Math.trunc(qDistToTravelY / pBullet.qIncrY);
          } else if (pBullet.qIncrY < 0) {
            qDistToTravelY = pBullet.qCurrY % INT32_TO_FIXEDPT(CELL_Y_SIZE);
            iStepsToTravelY = Math.trunc(qDistToTravelY / -pBullet.qIncrY);
          } else {
            // make sure we don't consider Y a limit :-)
            iStepsToTravelY = 1000000;
          }

          // add 1 to the # of steps to travel to go INTO the next tile
          iStepsToTravel = Math.min(iStepsToTravelX, iStepsToTravelY) + 1;

          // special coding (compared with other versions above) to deal with
          // bullets hitting the ground
          if (pBullet.qCurrZ + pBullet.qIncrZ * iStepsToTravel < qLandHeight) {
            iStepsToTravel = Math.min(
              iStepsToTravel,
              Math.abs(
                Math.trunc((pBullet.qCurrZ - qLandHeight) / pBullet.qIncrZ),
              ),
            );
            pBullet.qCurrX += pBullet.qIncrX * iStepsToTravel;
            pBullet.qCurrY += pBullet.qIncrY * iStepsToTravel;
            pBullet.qCurrZ += pBullet.qIncrZ * iStepsToTravel;

            StopBullet(pBullet.iBullet);
            BulletHitStructure(
              pBullet,
              INVALID_STRUCTURE_ID,
              0,
              pBullet.pFirer,
              pBullet.qCurrX,
              pBullet.qCurrY,
              pBullet.qCurrZ,
              true,
            );
            return;
          }

          if (
            pBullet.usFlags &
            (BULLET_FLAG_MISSILE |
              BULLET_FLAG_SMALL_MISSILE |
              BULLET_FLAG_TANK_CANNON |
              BULLET_FLAG_FLAME |
              BULLET_FLAG_CREATURE_SPIT)
          ) {
            let bStepsPerMove: INT8 = STEPS_FOR_BULLET_MOVE_TRAILS;

            if (pBullet.usFlags & BULLET_FLAG_SMALL_MISSILE) {
              bStepsPerMove = STEPS_FOR_BULLET_MOVE_SMALL_TRAILS;
            } else if (pBullet.usFlags & BULLET_FLAG_FLAME) {
              bStepsPerMove = STEPS_FOR_BULLET_MOVE_FIRE_TRAILS;
            }

            for (i = 0; i < iStepsToTravel; i++) {
              if ((pBullet.iLoop + i) % bStepsPerMove == 0) {
                fGoingOver = true;
                break;
              }
            }

            if (fGoingOver) {
              let qCurrX: FIXEDPT;
              let qCurrY: FIXEDPT;
              let qCurrZ: FIXEDPT;

              qCurrX = pBullet.qCurrX + pBullet.qIncrX * i;
              qCurrY = pBullet.qCurrY + pBullet.qIncrY * i;
              qCurrZ = pBullet.qCurrZ + pBullet.qIncrZ * i;

              AddMissileTrail(pBullet, qCurrX, qCurrY, qCurrZ);
            }
          }

          pBullet.qCurrX += pBullet.qIncrX * iStepsToTravel;
          pBullet.qCurrY += pBullet.qIncrY * iStepsToTravel;
          pBullet.qCurrZ += pBullet.qIncrZ * iStepsToTravel;
          pBullet.iLoop += iStepsToTravel;

          // figure out the new tile location
          pBullet.iCurrTileX = FIXEDPT_TO_TILE_NUM(pBullet.qCurrX);
          pBullet.iCurrTileY = FIXEDPT_TO_TILE_NUM(pBullet.qCurrY);
          pBullet.iCurrCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(
            FIXEDPT_TO_INT32(pBullet.qCurrZ),
          );
          pBullet.bLOSIndexX = FIXEDPT_TO_LOS_INDEX(pBullet.qCurrX);
          pBullet.bLOSIndexY = FIXEDPT_TO_LOS_INDEX(pBullet.qCurrY);
        } else {
          // there are structures in this tile
          iCurrCubesAboveLevelZ =
            CONVERT_HEIGHTUNITS_TO_INDEX(iCurrAboveLevelZ);
          // figure out the LOS cube level of the current point

          if (iCurrCubesAboveLevelZ < STRUCTURE_ON_ROOF_MAX) {
            if (iCurrCubesAboveLevelZ < STRUCTURE_ON_GROUND_MAX) {
              // check objects on the ground
              sDesiredLevel = STRUCTURE_ON_GROUND;
            } else {
              // check objects on roofs
              sDesiredLevel = STRUCTURE_ON_ROOF;
              iCurrCubesAboveLevelZ -= STRUCTURE_ON_ROOF;
            }
            // check structures for collision
            for (
              iStructureLoop = 0;
              iStructureLoop < iNumLocalStructures;
              iStructureLoop++
            ) {
              pStructure = gpLocalStructure[iStructureLoop];
              if (pStructure && pStructure.sCubeOffset == sDesiredLevel) {
                if (
                  ((<PROFILE>pStructure.pShape)[pBullet.bLOSIndexX][
                    pBullet.bLOSIndexY
                  ] &
                    AtHeight[iCurrCubesAboveLevelZ]) >
                  0
                ) {
                  if (pStructure.fFlags & STRUCTURE_PERSON) {
                    // hit someone!
                    fStopped = BulletHitMerc(pBullet, pStructure, fIntended);
                    if (fStopped) {
                      // remove bullet function now called from within BulletHitMerc, so just quit
                      return;
                    } else {
                      // set pointer to null so that we don't consider hitting this person again
                      gpLocalStructure[iStructureLoop] = <STRUCTURE>(
                        (<unknown>null)
                      );
                    }
                  } else if (
                    pStructure.fFlags & STRUCTURE_WALLNWINDOW &&
                    pBullet.qCurrZ >= qWindowBottomHeight &&
                    pBullet.qCurrZ <= qWindowTopHeight
                  ) {
                    fResolveHit = ResolveHitOnWall(
                      pStructure,
                      iGridNo,
                      pBullet.bLOSIndexX,
                      pBullet.bLOSIndexY,
                      pBullet.ddHorizAngle,
                    );

                    if (fResolveHit) {
                      if (pBullet.usFlags & BULLET_FLAG_KNIFE) {
                        // knives do get stopped by windows!

                        iRemainingImpact = HandleBulletStructureInteraction(
                          pBullet,
                          pStructure,
                          fHitStructure__Pointer,
                        );
                        if (iRemainingImpact <= 0) {
                          // check angle of knife and place on ground appropriately
                          let Object: OBJECTTYPE = createObjectType();
                          let iKnifeGridNo: INT32;

                          CreateItem(
                            Enum225.THROWING_KNIFE,
                            pBullet.ubItemStatus,
                            Object,
                          );

                          // by default knife at same tile as window
                          iKnifeGridNo = iGridNo;

                          if (
                            pStructure.ubWallOrientation ==
                              Enum314.INSIDE_TOP_RIGHT ||
                            pStructure.ubWallOrientation ==
                              Enum314.OUTSIDE_TOP_RIGHT
                          ) {
                            if (pBullet.qIncrX > 0) {
                              // heading east so place knife on west, in same tile
                            } else {
                              // place to east of window
                              iKnifeGridNo += 1;
                            }
                          } else {
                            if (pBullet.qIncrY > 0) {
                              // heading south so place wall to north, in same tile of window
                            } else {
                              iKnifeGridNo += WORLD_ROWS;
                            }
                          }

                          if (sDesiredLevel == STRUCTURE_ON_GROUND) {
                            AddItemToPool(iKnifeGridNo, Object, -1, 0, 0, 0);
                          } else {
                            AddItemToPool(iKnifeGridNo, Object, -1, 0, 1, 0);
                          }

                          // Make team look for items
                          NotifySoldiersToLookforItems();

                          // bullet must end here!
                          StopBullet(pBullet.iBullet);
                          BulletHitStructure(
                            pBullet,
                            pStructure.usStructureID,
                            1,
                            pBullet.pFirer,
                            pBullet.qCurrX,
                            pBullet.qCurrY,
                            pBullet.qCurrZ,
                            true,
                          );
                          return;
                        }
                      } else {
                        if (
                          pStructure.ubWallOrientation ==
                            Enum314.INSIDE_TOP_RIGHT ||
                          pStructure.ubWallOrientation ==
                            Enum314.OUTSIDE_TOP_RIGHT
                        ) {
                          if (pBullet.qIncrX > 0) {
                            BulletHitWindow(
                              pBullet,
                              pBullet.iCurrTileX +
                                pBullet.iCurrTileY * WORLD_COLS,
                              pStructure.usStructureID,
                              true,
                            );
                            LocateBullet(pBullet.iBullet);
                            // have to remove this window from future hit considerations so the deleted structure data can't be referenced!
                            gpLocalStructure[iStructureLoop] = <STRUCTURE>(
                              (<unknown>null)
                            );
                          } else {
                            BulletHitWindow(
                              pBullet,
                              pBullet.iCurrTileX +
                                pBullet.iCurrTileY * WORLD_COLS,
                              pStructure.usStructureID,
                              false,
                            );
                            LocateBullet(pBullet.iBullet);
                            gpLocalStructure[iStructureLoop] = <STRUCTURE>(
                              (<unknown>null)
                            );
                          }
                        } else {
                          if (pBullet.qIncrY > 0) {
                            BulletHitWindow(
                              pBullet,
                              pBullet.iCurrTileX +
                                pBullet.iCurrTileY * WORLD_COLS,
                              pStructure.usStructureID,
                              true,
                            );
                            LocateBullet(pBullet.iBullet);
                            gpLocalStructure[iStructureLoop] = <STRUCTURE>(
                              (<unknown>null)
                            );
                          } else {
                            BulletHitWindow(
                              pBullet,
                              pBullet.iCurrTileX +
                                pBullet.iCurrTileY * WORLD_COLS,
                              pStructure.usStructureID,
                              false,
                            );
                            LocateBullet(pBullet.iBullet);
                            gpLocalStructure[iStructureLoop] = <STRUCTURE>(
                              (<unknown>null)
                            );
                          }
                        }
                        // but the bullet keeps on going!!!
                      }
                    }
                  } else if (
                    pBullet.iLoop > CLOSE_TO_FIRER ||
                    pStructure.fFlags & ALWAYS_CONSIDER_HIT ||
                    pBullet.iLoop > CLOSE_TO_FIRER ||
                    fIntended
                  ) {
                    if (pStructure.fFlags & STRUCTURE_WALLSTUFF) {
                      // possibly shooting at corner in which case we should let it pass
                      fResolveHit = ResolveHitOnWall(
                        pStructure,
                        iGridNo,
                        pBullet.bLOSIndexX,
                        pBullet.bLOSIndexY,
                        pBullet.ddHorizAngle,
                      );
                    } else {
                      fResolveHit = true;
                    }

                    if (fResolveHit) {
                      iRemainingImpact = HandleBulletStructureInteraction(
                        pBullet,
                        pStructure,
                        fHitStructure__Pointer,
                      );
                      if (fHitStructure) {
                        // ATE: NOT if we are a special bullet like a LAW trail...
                        if (
                          pStructure.fFlags & STRUCTURE_CORPSE &&
                          !(
                            pBullet.usFlags &
                            (BULLET_FLAG_MISSILE |
                              BULLET_FLAG_SMALL_MISSILE |
                              BULLET_FLAG_TANK_CANNON |
                              BULLET_FLAG_FLAME |
                              BULLET_FLAG_CREATURE_SPIT)
                          )
                        ) {
                          // ATE: In enemy territory here... ;)
                          // Now that we have hit a corpse, make the bugger twich!
                          RemoveBullet(pBullet.iBullet);

                          CorpseHit(pBullet.sGridNo, pStructure.usStructureID);
                          DebugMsg(
                            TOPIC_JA2,
                            DBG_LEVEL_3,
                            FormatString(
                              "@@@@@@@ Reducing attacker busy count..., CORPSE HIT",
                            ),
                          );

                          FreeUpAttacker(pBullet.pFirer.ubID);
                          return;
                        } else if (iRemainingImpact <= 0) {
                          StopBullet(pBullet.iBullet);
                          BulletHitStructure(
                            pBullet,
                            pStructure.usStructureID,
                            1,
                            pBullet.pFirer,
                            pBullet.qCurrX,
                            pBullet.qCurrY,
                            pBullet.qCurrZ,
                            true,
                          );
                          return;
                        } else if (
                          fHitStructure &&
                          gubLocalStructureNumTimesHit[iStructureLoop] == 0
                        ) {
                          // play animation to indicate structure being hit
                          BulletHitStructure(
                            pBullet,
                            pStructure.usStructureID,
                            1,
                            pBullet.pFirer,
                            pBullet.qCurrX,
                            pBullet.qCurrY,
                            pBullet.qCurrZ,
                            false,
                          );
                          gubLocalStructureNumTimesHit[iStructureLoop] = 1;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          // got past everything; go to next LOS location within
          // tile, horizontally or vertically
          bOldLOSIndexX = pBullet.bLOSIndexX;
          bOldLOSIndexY = pBullet.bLOSIndexY;
          iOldCubesZ = pBullet.iCurrCubesZ;
          do {
            pBullet.qCurrX += pBullet.qIncrX;
            pBullet.qCurrY += pBullet.qIncrY;
            if (pRoofStructure) {
              qLastZ = pBullet.qCurrZ;
              pBullet.qCurrZ += pBullet.qIncrZ;
              if (
                (qLastZ > qWallHeight && pBullet.qCurrZ <= qWallHeight) ||
                (qLastZ < qWallHeight && pBullet.qCurrZ >= qWallHeight)
              ) {
                // generate roof-hitting event
                // always stop with roofs

                if (
                  1 /*HandleBulletStructureInteraction( pBullet, pRoofStructure, &fHitStructure ) <= 0 */
                ) {
                  StopBullet(pBullet.iBullet);
                  BulletHitStructure(
                    pBullet,
                    0,
                    0,
                    pBullet.pFirer,
                    pBullet.qCurrX,
                    pBullet.qCurrY,
                    pBullet.qCurrZ,
                    true,
                  );
                  return;
                }
                /*
              else
              {
                      // ATE: Found this: Should we be calling this because if we do, it will
                      // delete a bullet that was not supposed to be deleted....
                      //BulletHitStructure( pBullet, 0, 0, pBullet->pFirer, pBullet->qCurrX, pBullet->qCurrY, pBullet->qCurrZ );
              }
              */
              }
            } else {
              pBullet.qCurrZ += pBullet.qIncrZ;
            }
            pBullet.bLOSIndexX = FIXEDPT_TO_LOS_INDEX(pBullet.qCurrX);
            pBullet.bLOSIndexY = FIXEDPT_TO_LOS_INDEX(pBullet.qCurrY);
            pBullet.iCurrCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(
              FIXEDPT_TO_INT32(pBullet.qCurrZ),
            );
            pBullet.iLoop++;

            if (
              pBullet.usFlags &
              (BULLET_FLAG_MISSILE |
                BULLET_FLAG_SMALL_MISSILE |
                BULLET_FLAG_TANK_CANNON |
                BULLET_FLAG_FLAME |
                BULLET_FLAG_CREATURE_SPIT)
            ) {
              let bStepsPerMove: INT8 = STEPS_FOR_BULLET_MOVE_TRAILS;

              if (pBullet.usFlags & BULLET_FLAG_SMALL_MISSILE) {
                bStepsPerMove = STEPS_FOR_BULLET_MOVE_SMALL_TRAILS;
              } else if (pBullet.usFlags & BULLET_FLAG_FLAME) {
                bStepsPerMove = STEPS_FOR_BULLET_MOVE_FIRE_TRAILS;
              }

              if (pBullet.iLoop % bStepsPerMove == 0) {
                // add smoke trail
                AddMissileTrail(
                  pBullet,
                  pBullet.qCurrX,
                  pBullet.qCurrY,
                  pBullet.qCurrZ,
                );
              }
            }
          } while (
            pBullet.bLOSIndexX == bOldLOSIndexX &&
            pBullet.bLOSIndexY == bOldLOSIndexY &&
            pBullet.iCurrCubesZ == iOldCubesZ
          );
          pBullet.iCurrTileX = Math.trunc(
            FIXEDPT_TO_INT32(pBullet.qCurrX) / CELL_X_SIZE,
          );
          pBullet.iCurrTileY = Math.trunc(
            FIXEDPT_TO_INT32(pBullet.qCurrY) / CELL_Y_SIZE,
          );
        }
      } while (
        pBullet.iCurrTileX == iOldTileX &&
        pBullet.iCurrTileY == iOldTileY
      );

      if (
        !GridNoOnVisibleWorldTile(
          pBullet.iCurrTileX + pBullet.iCurrTileY * WORLD_COLS,
        ) ||
        (pBullet.iCurrCubesZ > PROFILE_Z_SIZE * 2 &&
          FIXEDPT_TO_INT32(pBullet.qIncrZ) > 0)
      ) {
        // bullet outside of world!
        RemoveBullet(pBullet.iBullet);
        BulletMissed(pBullet, pBullet.pFirer);
        return;
      }

      pBullet.sGridNo = MAPROWCOLTOPOS(pBullet.iCurrTileY, pBullet.iCurrTileX);
      uiTileInc++;

      if (pBullet.iLoop > pBullet.iRange * 2) {
        // beyond max effective range, bullet starts to drop!
        // since we're doing an increment based on distance, not time, the
        // decrement is scaled down depending on how fast the bullet is (effective range)
        pBullet.qIncrZ -= Math.trunc(
          INT32_TO_FIXEDPT(100) / (pBullet.iRange * 2),
        );
      } else if (
        pBullet.usFlags & BULLET_FLAG_FLAME &&
        pBullet.iLoop > pBullet.iRange
      ) {
        pBullet.qIncrZ -= Math.trunc(
          INT32_TO_FIXEDPT(100) / (pBullet.iRange * 2),
        );
      }

      // check to see if bullet is close to target
      if (
        pBullet.pFirer.ubTargetID != NOBODY &&
        !(pBullet.pFirer.uiStatusFlags & SOLDIER_ATTACK_NOTICED) &&
        PythSpacesAway(pBullet.sGridNo, pBullet.sTargetGridNo) <= 3
      ) {
        pBullet.pFirer.uiStatusFlags |= SOLDIER_ATTACK_NOTICED;
      }
    } while (uiTileInc < pBullet.ubTilesPerUpdate);
    // unless the distance is integral, after the loop there will be a
    // fractional amount of distance remaining which is unchecked
    // but we shouldn't(?) need to check it because the target is there!
  }

  export function CheckForCollision(
    dX: FLOAT,
    dY: FLOAT,
    dZ: FLOAT,
    dDeltaX: FLOAT,
    dDeltaY: FLOAT,
    dDeltaZ: FLOAT,
    pusStructureID: Pointer<INT16>,
    pdNormalX: Pointer<FLOAT>,
    pdNormalY: Pointer<FLOAT>,
    pdNormalZ: Pointer<FLOAT>,
  ): INT32 {
    let iLandHeight: INT32;
    let iCurrAboveLevelZ: INT32;
    let iCurrCubesAboveLevelZ: INT32;
    let sDesiredLevel: INT16;

    let pMapElement: MAP_ELEMENT;
    let pStructure: STRUCTURE | null;
    let pTempStructure: STRUCTURE | null;

    let fRoofPresent: boolean = false;

    let pTarget: SOLDIERTYPE | null;
    let dTargetX: FLOAT;
    let dTargetY: FLOAT;
    let dTargetZMin: FLOAT;
    let dTargetZMax: FLOAT = 0;
    let fIntended: boolean;

    let uiTileInc: UINT32 = 0;

    // INT8						iImpactReduction;

    let sX: INT16;
    let sY: INT16;
    let sZ: INT16;

    let dOldZUnits: FLOAT;
    let dZUnits: FLOAT;

    let bLOSIndexX: INT8;
    let bLOSIndexY: INT8;
    let iCurrCubesZ: INT32;

    sX = Math.trunc(dX / CELL_X_SIZE);
    sY = Math.trunc(dY / CELL_Y_SIZE);
    sZ = dZ;

    // Check if gridno is in bounds....
    if (!GridNoOnVisibleWorldTile(sX + sY * WORLD_COLS)) {
      //	return( COLLISION_NONE );
    }

    if (sX < 0 || sX > WORLD_COLS || sY < 0 || sY > WORLD_COLS) {
      //		return( COLLISION_NONE );
    }

    // check a particular tile
    // retrieve values from world for this particular tile
    pMapElement = gpWorldLevelData[sX + sY * WORLD_COLS];
    iLandHeight = CONVERT_PIXELS_TO_HEIGHTUNITS(pMapElement.sHeight);

    // Calculate old height and new hieght in pixels
    dOldZUnits = dZ - dDeltaZ;
    dZUnits = dZ;

    // if (pBullet->fCheckForRoof)
    //{
    //	if (pMapElement->pRoofHead != NULL)
    //	{
    //		fRoofPresent = TRUE;
    //	}
    //	else
    //	{
    //		fRoofPresent = FALSE;
    //	}
    //}

    // if (pMapElement->pMercHead != NULL && pBullet->iLoop != 1)
    if (pMapElement.pMercHead != null) {
      // a merc! that isn't us :-)
      pTarget = pMapElement.pMercHead.pSoldier;
      dTargetX = pTarget.dXPos;
      dTargetY = pTarget.dYPos;
      dTargetZMin = 0.0;
      CalculateSoldierZPos(
        pTarget,
        Enum230.HEIGHT,
        createPointer(
          () => dTargetZMax,
          (v) => (dTargetZMax = v),
        ),
      );
      if (pTarget.bLevel > 0) {
        // on roof
        dTargetZMin += WALL_HEIGHT_UNITS;
      }
      if (sX + sY * WORLD_COLS == pTarget.sGridNo) {
        fIntended = true;
      } else {
        fIntended = false;
      }
    } else {
      pTarget = null;
    }

    // record old tile location for loop purposes

    // check for collision with the ground
    iCurrAboveLevelZ = dZ - iLandHeight;
    if (iCurrAboveLevelZ < 0) {
      // ground is in the way!
      if (
        pMapElement.ubTerrainID == Enum315.DEEP_WATER ||
        pMapElement.ubTerrainID == Enum315.LOW_WATER ||
        pMapElement.ubTerrainID == Enum315.MED_WATER
      ) {
        return Enum229.COLLISION_WATER;
      } else {
        return Enum229.COLLISION_GROUND;
      }
    }
    // check for the existence of structures
    pStructure = pMapElement.pStructureHead;
    if (pStructure == null) {
      // no structures in this tile

      // we can go as far as we like vertically (so long as we don't hit
      // the ground), but want to stop when we get to the next tile or
      // the end of the LOS path

      // move 1 unit along the bullet path
      // if (fRoofPresent)
      //{
      //	dLastZ = pBullet->dCurrZ;
      //	(pBullet->dCurrZ) += pBullet->dIncrZ;
      //	if ( (dLastZ > WALL_HEIGHT && pBullet->dCurrZ < WALL_HEIGHT) || (dLastZ < WALL_HEIGHT && pBullet->dCurrZ > WALL_HEIGHT))
      //	{
      //		// generate roof-hitting event
      //		BulletHitStructure( pBullet->pFirer, pBullet->dCurrX, pBullet->dCurrY, pBullet->dCurrZ );
      //		RemoveBullet( pBullet->iBullet );
      //		return;
      //	}
      //}
      // else
      //{
      //	(pBullet->dCurrZ) += pBullet->dIncrZ;
      //}

      // check for ground collision
      if (dZ < iLandHeight) {
        // ground is in the way!
        if (
          pMapElement.ubTerrainID == Enum315.DEEP_WATER ||
          pMapElement.ubTerrainID == Enum315.LOW_WATER ||
          pMapElement.ubTerrainID == Enum315.MED_WATER
        ) {
          return Enum229.COLLISION_WATER;
        } else {
          return Enum229.COLLISION_GROUND;
        }
      }

      if (gfCaves || gfBasement) {
        if (dOldZUnits > HEIGHT_UNITS && dZUnits < HEIGHT_UNITS) {
          return Enum229.COLLISION_ROOF;
        }
        if (dOldZUnits < HEIGHT_UNITS && dZUnits > HEIGHT_UNITS) {
          return Enum229.COLLISION_INTERIOR_ROOF;
        }
      }

      // check to see if we hit someone
      // if (pTarget && Distance2D( dX - dTargetX, dY - dTargetY ) < HIT_DISTANCE )
      //{
      // well, we're in the right area; it's possible that
      // we're firing over or under them though
      //	if ( dZ < dTargetZMax && dZ > dTargetZMin)
      //	{
      //		return( COLLISION_MERC );
      //	}
      //}
    } else {
      // there are structures in this tile
      iCurrCubesAboveLevelZ = CONVERT_HEIGHTUNITS_TO_INDEX(iCurrAboveLevelZ);
      // figure out the LOS cube level of the current point

      // CALCULAT LOS INDEX
      bLOSIndexX = CONVERT_WITHINTILE_TO_INDEX(dX % CELL_X_SIZE);
      bLOSIndexY = CONVERT_WITHINTILE_TO_INDEX(dY % CELL_Y_SIZE);
      iCurrCubesZ = CONVERT_HEIGHTUNITS_TO_INDEX(dZ);

      if (iCurrCubesAboveLevelZ < STRUCTURE_ON_ROOF_MAX) {
        if (iCurrCubesAboveLevelZ < STRUCTURE_ON_GROUND_MAX) {
          // check objects on the ground
          sDesiredLevel = STRUCTURE_ON_GROUND;
        } else {
          // check objects on roofs
          sDesiredLevel = STRUCTURE_ON_ROOF;
          iCurrCubesAboveLevelZ -= STRUCTURE_ON_ROOF;
        }

        // check structures for collision
        while (pStructure != null) {
          if (pStructure.fFlags & STRUCTURE_ROOF || gfCaves || gfBasement) {
            if (dOldZUnits > HEIGHT_UNITS && dZUnits < HEIGHT_UNITS) {
              return Enum229.COLLISION_ROOF;
            }
            if (dOldZUnits < HEIGHT_UNITS && dZUnits > HEIGHT_UNITS) {
              return Enum229.COLLISION_INTERIOR_ROOF;
            }
          }

          if (pStructure.sCubeOffset == sDesiredLevel) {
            if (
              ((<PROFILE>pStructure.pShape)[bLOSIndexX][bLOSIndexY] &
                AtHeight[iCurrCubesAboveLevelZ]) >
              0
            ) {
              pusStructureID.value = pStructure.usStructureID;

              if (
                pStructure.fFlags & STRUCTURE_WALLNWINDOW &&
                dZ >= WINDOW_BOTTOM_HEIGHT_UNITS &&
                dZ <= WINDOW_TOP_HEIGHT_UNITS
              ) {
                if (
                  pStructure.ubWallOrientation == Enum314.INSIDE_TOP_RIGHT ||
                  pStructure.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT
                ) {
                  if (dDeltaX > 0) {
                    return Enum229.COLLISION_WINDOW_SOUTHWEST;
                  } else {
                    return Enum229.COLLISION_WINDOW_NORTHWEST;
                  }
                } else {
                  if (dDeltaY > 0) {
                    return Enum229.COLLISION_WINDOW_SOUTHEAST;
                  } else {
                    return Enum229.COLLISION_WINDOW_NORTHEAST;
                  }
                }
              }

              if (pStructure.fFlags & STRUCTURE_WALLSTUFF) {
                // if ( !CalculateLOSNormal( pStructure, bLOSIndexX, bLOSIndexY, (INT8)iCurrCubesAboveLevelZ, dDeltaX, dDeltaY, dDeltaZ, pdNormalX, pdNormalY, pdNormalZ ) )
                //{
                //	return( COLLISION_NONE );
                //}
                pdNormalX.value = 0;
                pdNormalY.value = 0;
                pdNormalZ.value = 0;

                if (
                  pStructure.ubWallOrientation == Enum314.INSIDE_TOP_RIGHT ||
                  pStructure.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT
                ) {
                  if (dDeltaX > 0) {
                    pdNormalX.value = -1;
                    return Enum229.COLLISION_WALL_SOUTHEAST;
                  } else {
                    pdNormalX.value = 1;
                    return Enum229.COLLISION_WALL_NORTHEAST;
                  }
                } else {
                  if (dDeltaY > 0) {
                    pdNormalY.value = -1;
                    return Enum229.COLLISION_WALL_SOUTHWEST;
                  } else {
                    pdNormalY.value = 1;
                    return Enum229.COLLISION_WALL_NORTHWEST;
                  }
                }
              } else {
                // Determine if we are on top of this struct
                // If we are a tree, not dense enough to stay!
                if (
                  !(pStructure.fFlags & STRUCTURE_TREE) &&
                  !(pStructure.fFlags & STRUCTURE_CORPSE)
                ) {
                  if (iCurrCubesAboveLevelZ < PROFILE_Z_SIZE - 1) {
                    if (
                      !(
                        (<PROFILE>pStructure.pShape)[bLOSIndexX][bLOSIndexY] &
                        AtHeight[iCurrCubesAboveLevelZ + 1]
                      )
                    ) {
                      if (pStructure.fFlags & STRUCTURE_ROOF) {
                        return Enum229.COLLISION_ROOF;
                      } else {
                        return Enum229.COLLISION_STRUCTURE_Z;
                      }
                    }
                  } else {
                    // Search next level ( if we are ground )
                    if (sDesiredLevel == STRUCTURE_ON_GROUND) {
                      pTempStructure = pMapElement.pStructureHead;

                      // LOOK at ALL structs on roof
                      while (pTempStructure != null) {
                        if (pTempStructure.sCubeOffset == STRUCTURE_ON_ROOF) {
                          if (
                            !(
                              (<PROFILE>pTempStructure.pShape)[bLOSIndexX][
                                bLOSIndexY
                              ] & AtHeight[0]
                            )
                          ) {
                            return Enum229.COLLISION_STRUCTURE_Z;
                          }
                        }

                        pTempStructure = pTempStructure.pNext;
                      }
                    } else {
                      // We are very high!
                      return Enum229.COLLISION_STRUCTURE_Z;
                    }
                  }
                }

                // Check armour rating.....
                // ATE; not if small vegitation....
                if (
                  pStructure.pDBStructureRef.pDBStructure.ubArmour !=
                  Enum309.MATERIAL_LIGHT_VEGETATION
                ) {
                  if (!(pStructure.fFlags & STRUCTURE_CORPSE)) {
                    return Enum229.COLLISION_STRUCTURE;
                  }
                }
              }
            }
          }
          pStructure = pStructure.pNext;
        }
      }

      // check to see if we hit someone
      // if (pTarget && Distance2D( dX - dTargetX, dY - dTargetY ) < HIT_DISTANCE )
      //{
      // well, we're in the right area; it's possible that
      // we're firing over or under them though
      //	if ( dZ < dTargetZMax && dZ > dTargetZMin)
      //		{
      //			return( COLLISION_MERC );
      //		}
      //	}
    }

    return Enum229.COLLISION_NONE;
  }

  let gsLOSDirLUT: INT16[][] /* [3][3] */ = [
    [315, 0, 45],
    [270, 0, 90],
    [225, 180, 135],
  ];

  function CalculateLOSNormal(
    pStructure: STRUCTURE,
    bLOSX: INT8,
    bLOSY: INT8,
    bLOSZ: INT8,
    dDeltaX: FLOAT,
    dDeltaY: FLOAT,
    dDeltaZ: FLOAT,
    pdNormalX: Pointer<FLOAT>,
    pdNormalY: Pointer<FLOAT>,
    pdNormalZ: Pointer<FLOAT>,
  ): boolean {
    let cntx: INT32;
    let cnty: INT32;
    let bX: INT8;
    let bY: INT8;
    let tX: INT8;
    let tY: INT8;
    let bNumNormals: INT8 = 0;
    let fParimeter: boolean;

    let vZ: vector_3 = createVector3();
    let vTemp2: vector_3 = createVector3();
    let vNormal: vector_3 = createVector3();
    let vAveNormal: vector_3 = createVector3();
    let vTemp: vector_3 = createVector3();
    let vIncident: vector_3 = createVector3();

    vZ.x = 0;
    vZ.y = 0;
    vZ.z = 2;

    vIncident.x = -1 * dDeltaX;
    vIncident.y = dDeltaY;
    vIncident.z = 0;
    // Nomralize
    vIncident = VGetNormal(vIncident);

    vAveNormal.x = 0;
    vAveNormal.y = 0;
    vAveNormal.z = 0;

    // OK, center on xy and goforit!
    for (cntx = 0; cntx < 3; cntx++) {
      bX = bLOSX + (cntx - 1);

      // Check for boundry conditions, use same as one before boundary
      if (bX < 0 || bX > 4) {
        continue;
      }

      for (cnty = 0; cnty < 3; cnty++) {
        bY = bLOSY + (cnty - 1);

        if (bY < 0 || bY > 4) {
          continue;
        }

        if (((<PROFILE>pStructure.pShape)[bX][bY] & AtHeight[bLOSZ]) > 0) {
          fParimeter = false;
          // THIS MUST BE THE POLYGONAL SURFACE, CHECK!
          do {
            tX = bX - 1;
            tY = bY;
            if (tX >= 0) {
              if (
                ((<PROFILE>pStructure.pShape)[tX][tY] & AtHeight[bLOSZ]) <=
                0
              ) {
                fParimeter = true;
                break;
              }
            }

            tX = bX + 1;
            tY = bY;
            if (tX <= 4) {
              if (
                ((<PROFILE>pStructure.pShape)[tX][tY] & AtHeight[bLOSZ]) >
                0
              ) {
              } else {
                fParimeter = true;
                break;
              }
            }

            tX = bX;
            tY = bY - 1;
            if (tX >= 0) {
              if (
                ((<PROFILE>pStructure.pShape)[tX][tY] & AtHeight[bLOSZ]) >
                0
              ) {
              } else {
                fParimeter = true;
                break;
              }
            }

            tX = bX;
            tY = bY + 1;
            if (tX >= 4) {
              if (
                ((<PROFILE>pStructure.pShape)[tX][tY] & AtHeight[bLOSZ]) >
                0
              ) {
              } else {
                fParimeter = true;
                break;
              }
            }
          } while (false);

          // OK, now add angles, but not the center!
          if (cntx == 1 && cnty == 1) {
          } // if ( fParimeter )
          else {
            // OK< Calcluate normal using cross-product
            // 1) Calculate Vector2
            vTemp2.x = bX - bLOSX;
            vTemp2.y = bY - bLOSY;
            vTemp2.z = 1;

            // Skip ones ||l to incident vector
            // if ( vTemp2.x == vIncident.x && vTemp2.y == vIncident.y )
            //{
            //	continue;
            //}

            // 2) Calculate Normal from cross product
            vNormal = VCrossProduct(vTemp2, vZ);

            if (VGetLength(vNormal) > 0) {
              // Nomralize
              vNormal = VGetNormal(vNormal);

              // CHECK ANGLE BRTWEEN INCIDENNCE AND NORMAL
              // if ( VDotProduct( &vNormal, &vIncident ) > 0 )
              {
                bNumNormals++;

                // Average normal!
                vTemp = VAdd(vNormal, vAveNormal);
                vAveNormal = VSetEqual(vTemp);
                vAveNormal = VDivScalar(vAveNormal, bNumNormals);
                // Nomralize
                vAveNormal = VGetNormal(vAveNormal);
              }
            }
          }
        }
      }
    }

    pdNormalX.value = 0;
    pdNormalY.value = 0;
    pdNormalZ.value = 0;

    if (bLOSZ < 4) {
      if (
        ((<PROFILE>pStructure.pShape)[bLOSX][bLOSY] & AtHeight[bLOSZ + 1]) >
        0
      ) {
        //*pdNormalZ = -1;
      }
    }

    // Average angle
    if (VGetLength(vAveNormal) > 0) {
      pdNormalX.value = vAveNormal.x;
      pdNormalY.value = vAveNormal.y;

      // OK done, now determine direction
      if (dDeltaX > 0) {
        pdNormalX.value *= -1;
      }

      if (dDeltaY < 0) {
        pdNormalY.value *= -1;
      }

      return true;
    } else {
      return false;
    }
  }
}
