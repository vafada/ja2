namespace ja2 {
  const ROOF_LOCATION_CHANCE = 8;

  export let gubBuildingInfo: UINT8[] /* [WORLD_MAX] */ = createArray(
    WORLD_MAX,
    0,
  );
  let gBuildings: BUILDING[] /* [MAX_BUILDINGS] */ = createArrayFrom(
    MAX_BUILDINGS,
    createBuilding,
  );
  let gubNumberOfBuildings: UINT8;

  function CreateNewBuilding(pubBuilding: Pointer<UINT8>): BUILDING | null {
    if (gubNumberOfBuildings + 1 >= MAX_BUILDINGS) {
      return null;
    }
    // increment # of buildings
    gubNumberOfBuildings++;
    // clear entry
    gBuildings[gubNumberOfBuildings].ubNumClimbSpots = 0;
    pubBuilding.value = gubNumberOfBuildings;
    // return pointer (have to subtract 1 since we just added 1
    return gBuildings[gubNumberOfBuildings];
  }

  function GenerateBuilding(sDesiredSpot: INT16): BUILDING | null {
    let uiLoop: UINT32;
    let sTempGridNo: INT16;
    let sNextTempGridNo: INT16;
    let sVeryTemporaryGridNo: INT16;
    let sStartGridNo: INT16;
    let sCurrGridNo: INT16;
    let sPrevGridNo: INT16 = NOWHERE;
    let sRightGridNo: INT16;
    let bDirection: INT8;
    let bTempDirection: INT8;
    let fFoundDir: boolean;
    let fFoundWall: boolean;
    let uiChanceIn: UINT32 = ROOF_LOCATION_CHANCE; // chance of a location being considered
    let sWallGridNo: INT16;
    let bDesiredOrientation: INT8;
    let bSkipSpots: INT8 = 0;
    let FakeSoldier: SOLDIERTYPE = createSoldierType();
    let pBuilding: BUILDING | null;
    let ubBuildingID: UINT8 = 0;

    pBuilding = CreateNewBuilding(
      createPointer(
        () => ubBuildingID,
        (v) => (ubBuildingID = v),
      ),
    );
    if (!pBuilding) {
      return null;
    }

    // set up fake soldier for location testing
    FakeSoldier.sGridNo = sDesiredSpot;
    FakeSoldier.bLevel = 1;
    FakeSoldier.bTeam = 1;

    // Set reachable
    RoofReachableTest(sDesiredSpot, ubBuildingID);

    // From sGridNo, search until we find a spot that isn't part of the building
    bDirection = Enum245.NORTHWEST;
    sTempGridNo = sDesiredSpot;
    // using diagonal directions to hopefully prevent picking a
    // spot that
    while (gpWorldLevelData[sTempGridNo].uiFlags & MAPELEMENT_REACHABLE) {
      sNextTempGridNo = NewGridNo(sTempGridNo, DirectionInc(bDirection));
      if (sTempGridNo == sNextTempGridNo) {
        // hit edge of map!??!
        return null;
      } else {
        sTempGridNo = sNextTempGridNo;
      }
    }

    // we've got our spot
    sStartGridNo = sTempGridNo;

    sCurrGridNo = sStartGridNo;
    sVeryTemporaryGridNo = NewGridNo(sCurrGridNo, DirectionInc(Enum245.EAST));
    if (gpWorldLevelData[sVeryTemporaryGridNo].uiFlags & MAPELEMENT_REACHABLE) {
      // go north first
      bDirection = Enum245.NORTH;
    } else {
      // go that way (east)
      bDirection = Enum245.EAST;
    }

    gpWorldLevelData[sStartGridNo].ubExtFlags[0] |=
      MAPELEMENT_EXT_ROOFCODE_VISITED;

    while (1) {
      // if point to (2 clockwise) is not part of building and is not visited,
      // or is starting point, turn!
      sRightGridNo = NewGridNo(
        sCurrGridNo,
        DirectionInc(gTwoCDirection[bDirection]),
      );
      sTempGridNo = sRightGridNo;
      if (
        ((!(gpWorldLevelData[sTempGridNo].uiFlags & MAPELEMENT_REACHABLE) &&
          !(
            gpWorldLevelData[sTempGridNo].ubExtFlags[0] &
            MAPELEMENT_EXT_ROOFCODE_VISITED
          )) ||
          sTempGridNo == sStartGridNo) &&
        sCurrGridNo != sStartGridNo
      ) {
        bDirection = gTwoCDirection[bDirection];
        // try in that direction
        continue;
      }

      // if spot ahead is part of building, turn
      sTempGridNo = NewGridNo(sCurrGridNo, DirectionInc(bDirection));
      if (gpWorldLevelData[sTempGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // first search for a spot that is neither part of the building or visited

        // we KNOW that the spot in the original direction is blocked, so only loop 3 times
        bTempDirection = gTwoCDirection[bDirection];
        fFoundDir = false;
        for (uiLoop = 0; uiLoop < 3; uiLoop++) {
          sTempGridNo = NewGridNo(sCurrGridNo, DirectionInc(bTempDirection));
          if (
            !(gpWorldLevelData[sTempGridNo].uiFlags & MAPELEMENT_REACHABLE) &&
            !(
              gpWorldLevelData[sTempGridNo].ubExtFlags[0] &
              MAPELEMENT_EXT_ROOFCODE_VISITED
            )
          ) {
            // this is the way to go!
            fFoundDir = true;
            break;
          }
          bTempDirection = gTwoCDirection[bTempDirection];
        }
        if (!fFoundDir) {
          // now search for a spot that is just not part of the building
          bTempDirection = gTwoCDirection[bDirection];
          fFoundDir = false;
          for (uiLoop = 0; uiLoop < 3; uiLoop++) {
            sTempGridNo = NewGridNo(sCurrGridNo, DirectionInc(bTempDirection));
            if (
              !(gpWorldLevelData[sTempGridNo].uiFlags & MAPELEMENT_REACHABLE)
            ) {
              // this is the way to go!
              fFoundDir = true;
              break;
            }
            bTempDirection = gTwoCDirection[bTempDirection];
          }
          if (!fFoundDir) {
            // WTF is going on?
            return null;
          }
        }
        bDirection = bTempDirection;
        // try in that direction
        continue;
      }

      // move ahead
      sPrevGridNo = sCurrGridNo;
      sCurrGridNo = sTempGridNo;
      sRightGridNo = NewGridNo(
        sCurrGridNo,
        DirectionInc(gTwoCDirection[bDirection]),
      );

      if (sCurrGridNo == sStartGridNo) {
        // done
        break;
      }

      if (
        !(
          gpWorldLevelData[sCurrGridNo].ubExtFlags[0] &
          MAPELEMENT_EXT_ROOFCODE_VISITED
        )
      ) {
        gpWorldLevelData[sCurrGridNo].ubExtFlags[0] |=
          MAPELEMENT_EXT_ROOFCODE_VISITED;

        // consider this location as possible climb gridno
        // there must be a regular wall adjacent to this for us to consider it a
        // climb gridno

        // if the direction is east or north, the wall would be in our gridno;
        // if south or west, the wall would be in the gridno two clockwise
        fFoundWall = false;

        switch (bDirection) {
          case Enum245.NORTH:
            sWallGridNo = sCurrGridNo;
            bDesiredOrientation = Enum314.OUTSIDE_TOP_RIGHT;
            break;
          case Enum245.EAST:
            sWallGridNo = sCurrGridNo;
            bDesiredOrientation = Enum314.OUTSIDE_TOP_LEFT;
            break;
          case Enum245.SOUTH:
            sWallGridNo =
              sCurrGridNo + DirectionInc(gTwoCDirection[bDirection]);
            bDesiredOrientation = Enum314.OUTSIDE_TOP_RIGHT;
            break;
          case Enum245.WEST:
            sWallGridNo =
              sCurrGridNo + DirectionInc(gTwoCDirection[bDirection]);
            bDesiredOrientation = Enum314.OUTSIDE_TOP_LEFT;
            break;
          default:
            // what the heck?
            return null;
        }

        if (bDesiredOrientation == Enum314.OUTSIDE_TOP_LEFT) {
          if (WallExistsOfTopLeftOrientation(sWallGridNo)) {
            fFoundWall = true;
          }
        } else {
          if (WallExistsOfTopRightOrientation(sWallGridNo)) {
            fFoundWall = true;
          }
        }

        if (fFoundWall) {
          if (bSkipSpots > 0) {
            bSkipSpots--;
          } else if (Random(uiChanceIn) == 0) {
            // don't consider people as obstacles
            if (NewOKDestination(FakeSoldier, sCurrGridNo, false, 0)) {
              pBuilding.sUpClimbSpots[pBuilding.ubNumClimbSpots] = sCurrGridNo;
              pBuilding.sDownClimbSpots[pBuilding.ubNumClimbSpots] =
                sRightGridNo;
              pBuilding.ubNumClimbSpots++;

              if (pBuilding.ubNumClimbSpots == MAX_CLIMBSPOTS_PER_BUILDING) {
                // gotta stop!
                return pBuilding;
              }

              // if location is added as a spot, reset uiChanceIn
              uiChanceIn = ROOF_LOCATION_CHANCE;
              // skip the next spot
              bSkipSpots = 1;
            } else {
              // if location is not added, 100% chance of handling next location
              // and the next until we can add one
              uiChanceIn = 1;
            }
          } else {
            // didn't pick this location, so increase chance that next location
            // will be considered
            if (uiChanceIn > 2) {
              uiChanceIn--;
            }
          }
        } else {
          // can't select this spot
          if (sPrevGridNo != NOWHERE && pBuilding.ubNumClimbSpots > 0) {
            if (
              pBuilding.sDownClimbSpots[pBuilding.ubNumClimbSpots - 1] ==
              sCurrGridNo
            ) {
              // unselect previous spot
              pBuilding.ubNumClimbSpots--;
              // overwrote a selected spot so go into automatic selection for later
              uiChanceIn = 1;
            }
          }

          // skip the next gridno
          bSkipSpots = 1;
        }
      }
    }

    // at end could prune # of locations if there are too many

    /*
  #ifdef ROOF_DEBUG
          SetRenderFlags( RENDER_FLAG_FULL );
          RenderWorld();
          RenderCoverDebug( );
          InvalidateScreen( );
          EndFrameBufferRender();
          RefreshScreen( NULL );
  #endif
  */

    return pBuilding;
  }

  export function FindBuilding(sGridNo: INT16): BUILDING | null {
    let ubBuildingID: UINT8;
    // UINT8					ubRoomNo;

    if (sGridNo <= 0 || sGridNo > WORLD_MAX) {
      return null;
    }

    // id 0 indicates no building
    ubBuildingID = gubBuildingInfo[sGridNo];
    if (ubBuildingID == NO_BUILDING) {
      return null;
      /*
    // need extra checks to see if is valid spot...
    // must have valid room information and be a flat-roofed
    // building
    if ( InARoom( sGridNo, &ubRoomNo ) && (FindStructure( sGridNo, STRUCTURE_NORMAL_ROOF ) != NULL) )
    {
            return( GenerateBuilding( sGridNo ) );
    }
    else
    {
            return( NULL );
    }
    */
    } else if (ubBuildingID > gubNumberOfBuildings) {
      // huh?
      return null;
    }

    return gBuildings[ubBuildingID];
  }

  function InBuilding(sGridNo: INT16): boolean {
    if (FindBuilding(sGridNo) == null) {
      return false;
    }
    return true;
  }

  function GenerateBuildings(): void {
    let uiLoop: UINT32;

    // init building structures and variables
    gubBuildingInfo.fill(0);
    gBuildings.forEach(resetBuilding);
    gubNumberOfBuildings = 0;

    if (gbWorldSectorZ > 0 || gfEditMode) {
      return;
    }

    // reset ALL reachable flags
    // do once before we start building generation for
    // whole map
    for (uiLoop = 0; uiLoop < WORLD_MAX; uiLoop++) {
      gpWorldLevelData[uiLoop].uiFlags &= ~MAPELEMENT_REACHABLE;
      gpWorldLevelData[uiLoop].ubExtFlags[0] &=
        ~MAPELEMENT_EXT_ROOFCODE_VISITED;
    }

    // search through world
    // for each location in a room try to find building info

    for (uiLoop = 0; uiLoop < WORLD_MAX; uiLoop++) {
      if (
        gubWorldRoomInfo[uiLoop] != NO_ROOM &&
        gubBuildingInfo[uiLoop] == NO_BUILDING &&
        FindStructure(uiLoop, STRUCTURE_NORMAL_ROOF) != null
      ) {
        GenerateBuilding(uiLoop);
      }
    }
  }

  export function FindClosestClimbPoint(
    sStartGridNo: INT16,
    sDesiredGridNo: INT16,
    fClimbUp: boolean,
  ): INT16 {
    let pBuilding: BUILDING | null;
    let ubNumClimbSpots: UINT8;
    let psClimbSpots: INT16[];
    let ubLoop: UINT8;
    let sDistance: INT16;
    let sClosestDistance: INT16 = 1000;
    let sClosestSpot: INT16 = NOWHERE;

    pBuilding = FindBuilding(sDesiredGridNo);
    if (!pBuilding) {
      return NOWHERE;
    }

    ubNumClimbSpots = pBuilding.ubNumClimbSpots;

    if (fClimbUp) {
      psClimbSpots = pBuilding.sUpClimbSpots;
    } else {
      psClimbSpots = pBuilding.sDownClimbSpots;
    }

    for (ubLoop = 0; ubLoop < ubNumClimbSpots; ubLoop++) {
      if (
        WhoIsThere2(pBuilding.sUpClimbSpots[ubLoop], 0) == NOBODY &&
        WhoIsThere2(pBuilding.sDownClimbSpots[ubLoop], 1) == NOBODY
      ) {
        sDistance = PythSpacesAway(sStartGridNo, psClimbSpots[ubLoop]);
        if (sDistance < sClosestDistance) {
          sClosestDistance = sDistance;
          sClosestSpot = psClimbSpots[ubLoop];
        }
      }
    }

    return sClosestSpot;
  }

  export function SameBuilding(sGridNo1: INT16, sGridNo2: INT16): boolean {
    if (gubBuildingInfo[sGridNo1] == NO_BUILDING) {
      return false;
    }
    if (gubBuildingInfo[sGridNo2] == NO_BUILDING) {
      return false;
    }
    return gubBuildingInfo[sGridNo1] == gubBuildingInfo[sGridNo2];
  }
}
