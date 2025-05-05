namespace ja2 {
  // the delay for a group about to arrive
  const ABOUT_TO_ARRIVE_DELAY = 5;

  export let gpGroupList: GROUP | null;

  let gpPendingSimultaneousGroup: GROUP = <GROUP>(<unknown>null);

  export let gfDelayAutoResolveStart: boolean = false;

  let gfRandomizingPatrolGroup: boolean = false;

  export let gubNumGroupsArrivedSimultaneously: UINT8 = 0;

  // Doesn't require text localization.  This is for debug strings only.
  let gszTerrain: string[] /* UINT8[NUM_TRAVTERRAIN_TYPES][15] */ = [
    "TOWN",
    "ROAD",
    "PLAINS",
    "SAND",
    "SPARSE",
    "DENSE",
    "SWAMP",
    "WATER",
    "HILLS",
    "GROUNDBARRIER",
    "NS_RIVER",
    "EW_RIVER",
    "EDGEOFWORLD",
  ];

  export let gfUndergroundTacticalTraversal: boolean = false;

  // remembers which player group is the Continue/Stop prompt about?  No need to save as long as you can't save while prompt ON
  let gpGroupPrompting: GROUP = <GROUP>(<unknown>null);

  let uniqueIDMask: UINT32[] /* [8] */ = [0, 0, 0, 0, 0, 0, 0, 0];

  // Internal function manipulation prototypes

  let gpInitPrebattleGroup: GROUP | null = null;

  // waiting for input from user
  let gfWaitingForInput: boolean = false;

  // Player grouping functions
  //.........................
  // Creates a new player group, returning the unique ID of that group.  This is the first
  // step before adding waypoints and members to the player group.
  export function CreateNewPlayerGroupDepartingFromSector(
    ubSectorX: UINT8,
    ubSectorY: UINT8,
  ): UINT8 {
    let pNew: GROUP;
    AssertMsg(
      ubSectorX >= 1 && ubSectorX <= 16,
      FormatString(
        "CreateNewPlayerGroup with out of range sectorX value of %d",
        ubSectorX,
      ),
    );
    AssertMsg(
      ubSectorY >= 1 && ubSectorY <= 16,
      FormatString(
        "CreateNewPlayerGroup with out of range sectorY value of %d",
        ubSectorY,
      ),
    );
    pNew = createGroup();
    AssertMsg(pNew, "MemAlloc failure during CreateNewPlayerGroup.");
    pNew.pPlayerList = null;
    pNew.pWaypoints = null;
    pNew.ubSectorX = pNew.ubNextX = ubSectorX;
    pNew.ubSectorY = pNew.ubNextY = ubSectorY;
    pNew.ubOriginalSector = SECTOR(ubSectorX, ubSectorY);
    pNew.fPlayer = true;
    pNew.ubMoveType = Enum185.ONE_WAY;
    pNew.ubNextWaypointID = 0;
    pNew.ubFatigueLevel = 100;
    pNew.ubRestAtFatigueLevel = 0;
    pNew.ubTransportationMask = FOOT;
    pNew.fVehicle = false;
    pNew.ubCreatedSectorID = pNew.ubOriginalSector;
    pNew.ubSectorIDOfLastReassignment = 255;

    return AddGroupToList(pNew);
  }

  export function CreateNewVehicleGroupDepartingFromSector(
    ubSectorX: UINT8,
    ubSectorY: UINT8,
    uiUNISEDVehicleId: UINT32,
  ): UINT8 {
    let pNew: GROUP;
    AssertMsg(
      ubSectorX >= 1 && ubSectorX <= 16,
      FormatString(
        "CreateNewVehicleGroup with out of range sectorX value of %d",
        ubSectorX,
      ),
    );
    AssertMsg(
      ubSectorY >= 1 && ubSectorY <= 16,
      FormatString(
        "CreateNewVehicleGroup with out of range sectorY value of %d",
        ubSectorY,
      ),
    );
    pNew = createGroup();
    AssertMsg(pNew, "MemAlloc failure during CreateNewVehicleGroup.");
    pNew.pWaypoints = null;
    pNew.ubSectorX = pNew.ubNextX = ubSectorX;
    pNew.ubSectorY = pNew.ubNextY = ubSectorY;
    pNew.ubOriginalSector = SECTOR(ubSectorX, ubSectorY);
    pNew.ubMoveType = Enum185.ONE_WAY;
    pNew.ubNextWaypointID = 0;
    pNew.ubFatigueLevel = 100;
    pNew.ubRestAtFatigueLevel = 0;
    pNew.fVehicle = true;
    pNew.fPlayer = true;
    pNew.pPlayerList = null;
    pNew.ubCreatedSectorID = pNew.ubOriginalSector;
    pNew.ubSectorIDOfLastReassignment = 255;

    // get the type
    pNew.ubTransportationMask = CAR;

    return AddGroupToList(pNew);
  }

  // Allows you to add players to the group.
  export function AddPlayerToGroup(
    ubGroupID: UINT8,
    pSoldier: SOLDIERTYPE,
  ): boolean {
    let pGroup: GROUP;
    let pPlayer: PLAYERGROUP;
    let curr: PLAYERGROUP;
    pGroup = GetGroup(ubGroupID);
    Assert(pGroup);
    pPlayer = createPlayerGroup();
    Assert(pPlayer);
    AssertMsg(
      pGroup.fPlayer,
      "Attempting AddPlayerToGroup() on an ENEMY group!",
    );
    pPlayer.pSoldier = pSoldier;
    pPlayer.ubProfileID = pSoldier.ubProfile;
    pPlayer.ubID = pSoldier.ubID;
    pPlayer.bFlags = 0;
    pPlayer.next = null;

    if (!pGroup.pPlayerList) {
      pGroup.pPlayerList = pPlayer;
      pGroup.ubGroupSize = 1;
      pGroup.ubPrevX = (pSoldier.ubPrevSectorID % 16) + 1;
      pGroup.ubPrevY = Math.trunc(pSoldier.ubPrevSectorID / 16) + 1;
      pGroup.ubSectorX = pSoldier.sSectorX;
      pGroup.ubSectorY = pSoldier.sSectorY;
      pGroup.ubSectorZ = pSoldier.bSectorZ;

      // set group id
      pSoldier.ubGroupID = ubGroupID;

      return true;
    } else {
      curr = pGroup.pPlayerList;
      pSoldier.ubNumTraversalsAllowedToMerge =
        curr.pSoldier.ubNumTraversalsAllowedToMerge;
      pSoldier.ubDesiredSquadAssignment =
        curr.pSoldier.ubDesiredSquadAssignment;
      while (curr.next) {
        if (curr.ubProfileID == pSoldier.ubProfile)
          AssertMsg(
            0,
            FormatString(
              "Attempting to add an already existing merc to group (ubProfile=%d).",
              pSoldier.ubProfile,
            ),
          );
        curr = curr.next;
      }
      curr.next = pPlayer;

      // set group id
      pSoldier.ubGroupID = ubGroupID;

      pGroup.ubGroupSize++;
      return true;
    }
  }

  // remove all grunts from player mvt grp
  function RemoveAllPlayersFromGroup(ubGroupId: UINT8): boolean {
    let pGroup: GROUP;

    // grab group id
    pGroup = GetGroup(ubGroupId);

    // init errors checks
    AssertMsg(
      pGroup,
      FormatString(
        "Attempting to RemovePlayerFromGroup( %d ) from non-existant group",
        ubGroupId,
      ),
    );

    return RemoveAllPlayersFromPGroup(pGroup);
  }

  function RemoveAllPlayersFromPGroup(pGroup: GROUP): boolean {
    let curr: PLAYERGROUP | null;

    AssertMsg(
      pGroup.fPlayer,
      "Attempting RemovePlayerFromGroup() on an ENEMY group!",
    );

    curr = pGroup.pPlayerList;
    while (curr) {
      pGroup.pPlayerList = (<PLAYERGROUP>pGroup.pPlayerList).next;

      curr.pSoldier.ubPrevSectorID = SECTOR(pGroup.ubPrevX, pGroup.ubPrevY);
      curr.pSoldier.ubGroupID = 0;

      curr = null;

      curr = pGroup.pPlayerList;
    }
    pGroup.ubGroupSize = 0;

    if (!pGroup.fPersistant) {
      // remove the empty group
      RemovePGroup(pGroup);
    } else {
      CancelEmptyPersistentGroupMovement(pGroup);
    }

    return true;
  }

  function RemovePlayerFromPGroup(
    pGroup: GROUP,
    pSoldier: SOLDIERTYPE,
  ): boolean {
    let prev: PLAYERGROUP | null;
    let curr: PLAYERGROUP | null;
    AssertMsg(
      pGroup.fPlayer,
      "Attempting RemovePlayerFromGroup() on an ENEMY group!",
    );

    curr = pGroup.pPlayerList;

    if (!curr) {
      return false;
    }

    if (curr.pSoldier == pSoldier) {
      // possibly the only node
      pGroup.pPlayerList = (<PLAYERGROUP>pGroup.pPlayerList).next;

      // delete the node
      curr = null;

      // process info for soldier
      pGroup.ubGroupSize--;
      pSoldier.ubPrevSectorID = SECTOR(pGroup.ubPrevX, pGroup.ubPrevY);
      pSoldier.ubGroupID = 0;

      // if there's nobody left in the group
      if (pGroup.ubGroupSize == 0) {
        if (!pGroup.fPersistant) {
          // remove the empty group
          RemovePGroup(pGroup);
        } else {
          CancelEmptyPersistentGroupMovement(pGroup);
        }
      }

      return true;
    }
    prev = null;

    while (curr) {
      // definately more than one node

      if (curr.pSoldier == pSoldier) {
        // detach and delete the node
        if (prev) {
          prev.next = curr.next;
        }
        curr = null;

        // process info for soldier
        pSoldier.ubGroupID = 0;
        pGroup.ubGroupSize--;
        pSoldier.ubPrevSectorID = SECTOR(pGroup.ubPrevX, pGroup.ubPrevY);

        return true;
      }

      prev = curr;
      curr = curr.next;
    }

    // !curr
    return false;
  }

  export function RemovePlayerFromGroup(
    ubGroupID: UINT8,
    pSoldier: SOLDIERTYPE,
  ): boolean {
    let pGroup: GROUP;
    pGroup = GetGroup(ubGroupID);

    // KM : August 6, 1999 Patch fix
    //     Because the release build has no assertions, it was still possible for the group to be null,
    //     causing a crash.  Instead of crashing, it'll simply return false.
    if (!pGroup) {
      return false;
    }
    // end

    AssertMsg(
      pGroup,
      FormatString(
        "Attempting to RemovePlayerFromGroup( %d, %d ) from non-existant group",
        ubGroupID,
        pSoldier.ubProfile,
      ),
    );

    return RemovePlayerFromPGroup(pGroup, pSoldier);
  }

  export function GroupReversingDirectionsBetweenSectors(
    pGroup: GROUP,
    ubSectorX: UINT8,
    ubSectorY: UINT8,
    fBuildingWaypoints: boolean,
  ): boolean {
    // if we're not between sectors, or we are but we're continuing in the same direction as before
    if (
      !GroupBetweenSectorsAndSectorXYIsInDifferentDirection(
        pGroup,
        ubSectorX,
        ubSectorY,
      )
    ) {
      // then there's no need to reverse directions
      return false;
    }

    // The new direction is reversed, so we have to go back to the sector we just left.

    // Search for the arrival event, and kill it!
    DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pGroup.ubGroupID);

    // Adjust the information in the group to reflect the new movement.
    pGroup.ubPrevX = pGroup.ubNextX;
    pGroup.ubPrevY = pGroup.ubNextY;
    pGroup.ubNextX = pGroup.ubSectorX;
    pGroup.ubNextY = pGroup.ubSectorY;
    pGroup.ubSectorX = pGroup.ubPrevX;
    pGroup.ubSectorY = pGroup.ubPrevY;

    if (pGroup.fPlayer) {
      // ARM: because we've changed the group's ubSectoryX and ubSectorY, we must now also go and change the sSectorX and
      // sSectorY of all the soldiers in this group so that they stay in synch.  Otherwise pathing and movement problems
      // will result since the group is in one place while the merc is in another...
      SetLocationOfAllPlayerSoldiersInGroup(
        pGroup,
        pGroup.ubSectorX,
        pGroup.ubSectorY,
        0,
      );
    }

    // IMPORTANT: The traverse time doesn't change just because we reverse directions!  It takes the same time no matter
    // which direction you're going in!  This becomes critical in case the player reverse directions again before moving!

    // The time it takes to arrive there will be exactly the amount of time we have been moving away from it.
    SetGroupArrivalTime(
      pGroup,
      pGroup.uiTraverseTime - pGroup.uiArrivalTime + GetWorldTotalMin() * 2,
    );

    // if they're not already there
    if (pGroup.uiArrivalTime > GetWorldTotalMin()) {
      // Post the replacement event to move back to the previous sector!
      AddStrategicEvent(
        Enum132.EVENT_GROUP_ARRIVAL,
        pGroup.uiArrivalTime,
        pGroup.ubGroupID,
      );

      if (pGroup.fPlayer) {
        if (pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY > GetWorldTotalMin()) {
          // Post the about to arrive event
          AddStrategicEvent(
            Enum132.EVENT_GROUP_ABOUT_TO_ARRIVE,
            pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY,
            pGroup.ubGroupID,
          );
        }
      }
    } else {
      // IMPORTANT: this can't be called during RebuildWayPointsForGroupPath(), since it will clear the mercpath
      // prematurely by assuming the mercs are now at their final destination when only the first waypoint is in place!!!
      // To handle this situation, RebuildWayPointsForGroupPath() will issue it's own call after it's ready for it.
      if (!fBuildingWaypoints) {
        // never really left.  Must set check for battle TRUE in order for HandleNonCombatGroupArrival() to run!
        GroupArrivedAtSector(pGroup.ubGroupID, true, true);
      }
    }

    return true;
  }

  export function GroupBetweenSectorsAndSectorXYIsInDifferentDirection(
    pGroup: GROUP,
    ubSectorX: UINT8,
    ubSectorY: UINT8,
  ): boolean {
    let currDX: INT32;
    let currDY: INT32;
    let newDX: INT32;
    let newDY: INT32;
    let ubNumUnalignedAxes: UINT8 = 0;

    if (!pGroup.fBetweenSectors) return false;

    // Determine the direction the group is currently traveling in
    currDX = pGroup.ubNextX - pGroup.ubSectorX;
    currDY = pGroup.ubNextY - pGroup.ubSectorY;

    // Determine the direction the group would need to travel in to reach the given sector
    newDX = ubSectorX - pGroup.ubSectorX;
    newDY = ubSectorY - pGroup.ubSectorY;

    // clip the new dx/dy values to +/- 1
    if (newDX) {
      ubNumUnalignedAxes++;
      newDX = Math.trunc(newDX / Math.abs(newDX));
    }
    if (newDY) {
      ubNumUnalignedAxes++;
      newDY = Math.trunc(newDY / Math.abs(newDY));
    }

    // error checking
    if (ubNumUnalignedAxes > 1) {
      AssertMsg(
        false,
        FormatString(
          "Checking a diagonal move for direction change, groupID %d. AM-0",
          pGroup.ubGroupID,
        ),
      );
      return false;
    }

    // Compare the dx/dy's.  If they're exactly the same, group is travelling in the same direction as before, so we're not
    // changing directions.
    // Note that 90-degree orthogonal changes are considered changing direction, as well as the full 180-degree reversal.
    // That's because the party must return to the previous sector in each of those cases, too.
    if (currDX == newDX && currDY == newDY) return false;

    // yes, we're between sectors, and we'd be changing direction to go to the given sector
    return true;
  }

  // Appends a waypoint to the end of the list.  Waypoint MUST be on the
  // same horizontal or vertical level as the last waypoint added.
  export function AddWaypointToPGroup(
    pGroup: GROUP | null,
    ubSectorX: UINT8,
    ubSectorY: UINT8,
  ): boolean {
    // Same, but overloaded
    let pWay: WAYPOINT | null;
    let ubNumAlignedAxes: UINT8 = 0;
    let fReversingDirection: boolean = false;

    AssertMsg(
      ubSectorX >= 1 && ubSectorX <= 16,
      FormatString(
        "AddWaypointToPGroup with out of range sectorX value of %d",
        ubSectorX,
      ),
    );
    AssertMsg(
      ubSectorY >= 1 && ubSectorY <= 16,
      FormatString(
        "AddWaypointToPGroup with out of range sectorY value of %d",
        ubSectorY,
      ),
    );

    if (!pGroup) return false;

    // At this point, we have the group, and a valid coordinate.  Now we must
    // determine that this waypoint will be aligned exclusively to either the x or y axis of
    // the last waypoint in the list.
    pWay = pGroup.pWaypoints;
    if (!pWay) {
      if (
        GroupReversingDirectionsBetweenSectors(
          pGroup,
          ubSectorX,
          ubSectorY,
          true,
        )
      ) {
        if (pGroup.fPlayer) {
          // because we reversed, we must add the new current sector back at the head of everyone's mercpath
          AddSectorToFrontOfMercPathForAllSoldiersInGroup(
            pGroup,
            pGroup.ubSectorX,
            pGroup.ubSectorY,
          );
        }

        // Very special case that requiring specific coding.  Check out the comments
        // at the above function for more information.
        fReversingDirection = true;
        // ARM:  Kris - new rulez.  Must still fall through and add a waypoint anyway!!!
      } else {
        // No waypoints, so compare against the current location.
        if (pGroup.ubSectorX == ubSectorX) {
          ubNumAlignedAxes++;
        }
        if (pGroup.ubSectorY == ubSectorY) {
          ubNumAlignedAxes++;
        }
      }
    } else {
      // we do have a waypoint list, so go to the last entry
      while (pWay.next) {
        pWay = pWay.next;
      }
      // now, we are pointing to the last waypoint in the list
      if (pWay.x == ubSectorX) {
        ubNumAlignedAxes++;
      }
      if (pWay.y == ubSectorY) {
        ubNumAlignedAxes++;
      }
    }

    if (!fReversingDirection) {
      if (ubNumAlignedAxes == 0) {
        AssertMsg(
          false,
          FormatString(
            "Invalid DIAGONAL waypoint being added for groupID %d. AM-0",
            pGroup.ubGroupID,
          ),
        );
        return false;
      }

      if (ubNumAlignedAxes >= 2) {
        AssertMsg(
          false,
          FormatString(
            "Invalid IDENTICAL waypoint being added for groupID %d. AM-0",
            pGroup.ubGroupID,
          ),
        );
        return false;
      }

      // has to be different in exactly 1 axis to be a valid new waypoint
      Assert(ubNumAlignedAxes == 1);
    }

    if (!pWay) {
      // We are adding the first waypoint.
      pGroup.pWaypoints = createWaypoint();
      pWay = pGroup.pWaypoints;
    } else {
      // Add the waypoint to the end of the list
      pWay.next = createWaypoint();
      pWay = pWay.next;
    }

    AssertMsg(pWay, "Failed to allocate memory for waypoint.");

    // Fill in the information for the new waypoint.
    pWay.x = ubSectorX;
    pWay.y = ubSectorY;
    pWay.next = null;

    // IMPORTANT:
    // The first waypoint added actually initiates the group's movement to the next sector.
    if (pWay == pGroup.pWaypoints) {
      // don't do this if we have reversed directions!!!  In that case, the required work has already been done back there
      if (!fReversingDirection) {
        // We need to calculate the next sector the group is moving to and post an event for it.
        InitiateGroupMovementToNextSector(pGroup);
      }
    }

    if (pGroup.fPlayer) {
      let curr: PLAYERGROUP | null;
      // Also, nuke any previous "tactical traversal" information.
      curr = pGroup.pPlayerList;
      while (curr) {
        curr.pSoldier.ubStrategicInsertionCode = 0;
        curr = curr.next;
      }
    }

    return true;
  }

  function AddWaypointToGroup(
    ubGroupID: UINT8,
    ubSectorX: UINT8,
    ubSectorY: UINT8,
  ): boolean {
    let pGroup: GROUP;
    pGroup = GetGroup(ubGroupID);
    return AddWaypointToPGroup(pGroup, ubSectorX, ubSectorY);
  }

  // NOTE: This does NOT expect a strategic sector ID
  function AddWaypointIDToGroup(ubGroupID: UINT8, ubSectorID: UINT8): boolean {
    let pGroup: GROUP;
    pGroup = GetGroup(ubGroupID);
    return AddWaypointIDToPGroup(pGroup, ubSectorID);
  }

  // NOTE: This does NOT expect a strategic sector ID
  export function AddWaypointIDToPGroup(
    pGroup: GROUP,
    ubSectorID: UINT8,
  ): boolean {
    let ubSectorX: UINT8;
    let ubSectorY: UINT8;
    ubSectorX = SECTORX(ubSectorID);
    ubSectorY = SECTORY(ubSectorID);
    return AddWaypointToPGroup(pGroup, ubSectorX, ubSectorY);
  }

  function AddWaypointStrategicIDToGroup(
    ubGroupID: UINT8,
    uiSectorID: UINT32,
  ): boolean {
    let pGroup: GROUP;
    pGroup = GetGroup(ubGroupID);
    return AddWaypointStrategicIDToPGroup(pGroup, uiSectorID);
  }

  export function AddWaypointStrategicIDToPGroup(
    pGroup: GROUP,
    uiSectorID: UINT32,
  ): boolean {
    let ubSectorX: UINT8;
    let ubSectorY: UINT8;
    ubSectorX = GET_X_FROM_STRATEGIC_INDEX(uiSectorID);
    ubSectorY = GET_Y_FROM_STRATEGIC_INDEX(uiSectorID);
    return AddWaypointToPGroup(pGroup, ubSectorX, ubSectorY);
  }

  // Enemy grouping functions -- private use by the strategic AI.
  //............................................................
  export function CreateNewEnemyGroupDepartingFromSector(
    uiSector: UINT32,
    ubNumAdmins: UINT8,
    ubNumTroops: UINT8,
    ubNumElites: UINT8,
  ): GROUP {
    let pNew: GROUP;
    AssertMsg(
      uiSector >= 0 && uiSector <= 255,
      FormatString(
        "CreateNewEnemyGroup with out of range value of %d",
        uiSector,
      ),
    );
    pNew = createGroup();
    AssertMsg(pNew, "MemAlloc failure during CreateNewEnemyGroup.");
    pNew.pEnemyGroup = createEnemyGroup();
    AssertMsg(
      pNew.pEnemyGroup,
      "MemAlloc failure during enemy group creation.",
    );
    pNew.pWaypoints = null;
    pNew.ubSectorX = SECTORX(uiSector);
    pNew.ubSectorY = SECTORY(uiSector);
    pNew.ubOriginalSector = uiSector;
    pNew.fPlayer = false;
    pNew.ubMoveType = Enum185.CIRCULAR;
    pNew.ubNextWaypointID = 0;
    pNew.ubFatigueLevel = 100;
    pNew.ubRestAtFatigueLevel = 0;
    pNew.pEnemyGroup.ubNumAdmins = ubNumAdmins;
    pNew.pEnemyGroup.ubNumTroops = ubNumTroops;
    pNew.pEnemyGroup.ubNumElites = ubNumElites;
    pNew.ubGroupSize = ubNumTroops + ubNumElites;
    pNew.ubTransportationMask = FOOT;
    pNew.fVehicle = false;
    pNew.ubCreatedSectorID = pNew.ubOriginalSector;
    pNew.ubSectorIDOfLastReassignment = 255;

    if (AddGroupToList(pNew)) return pNew;
    return <GROUP>(<unknown>null);
  }

  // INTERNAL LIST MANIPULATION FUNCTIONS

  // When adding any new group to the list, this is what must be done:
  // 1)  Find the first unused ID (unique)
  // 2)  Assign that ID to the new group
  // 3)  Insert the group at the end of the list.
  function AddGroupToList(pGroup: GROUP): UINT8 {
    let curr: GROUP | null;
    let bit: UINT32;
    let index: UINT32;
    let mask: UINT32;
    let ID: UINT8 = 0;
    // First, find a unique ID
    while (++ID) {
      index = Math.trunc(ID / 32);
      bit = ID % 32;
      mask = (1 << bit) >>> 0;
      if (!(uniqueIDMask[index] & mask)) {
        // found a free ID
        pGroup.ubGroupID = ID;
        uniqueIDMask[index] += mask;
        // add group to list now.
        curr = gpGroupList;
        if (curr) {
          // point to the last item in list.
          while (curr.next) curr = curr.next;
          curr.next = pGroup;
        } // new list
        else gpGroupList = pGroup;
        pGroup.next = null;
        return ID;
      }
    }
    return 0;
  }

  function RemoveGroupIdFromList(ubId: UINT8): void {
    let pGroup: GROUP;

    if (ubId == 0) {
      // no group, leave
      return;
    }

    // get group
    pGroup = GetGroup(ubId);

    // is there in fact a group?
    Assert(pGroup);

    // now remove this group
    RemoveGroupFromList(pGroup);
  }
  // Destroys the waypoint list, detaches group from list, then deallocated the memory for the group
  export function RemoveGroupFromList(pGroup: GROUP): void {
    let curr: GROUP | null;
    let temp: GROUP;
    curr = gpGroupList;
    if (!curr) return;
    if (curr == pGroup) {
      // Removing head
      gpGroupList = curr.next;
    } else
      while (curr.next) {
        // traverse the list
        if (curr.next == pGroup) {
          // the next node is the one we want to remove
          temp = curr;
          // curr now points to the nod we want to remove
          curr = curr.next;
          // detach the node from the list
          temp.next = curr.next;
          break;
        }
        curr = curr.next;
      }

    if (curr == pGroup) {
      // we found the group, so now remove it.
      let bit: UINT32;
      let index: UINT32;
      let mask: UINT32;

      // clear the unique group ID
      index = Math.trunc(pGroup.ubGroupID / 32);
      bit = pGroup.ubGroupID % 32;
      mask = (1 << bit) >>> 0;

      if (!(uniqueIDMask[index] & mask)) {
        mask = mask;
      }

      uniqueIDMask[index] -= mask;

      curr = null;
    }
  }

  export function GetGroup(ubGroupID: UINT8): GROUP {
    let curr: GROUP | null;
    curr = gpGroupList;
    while (curr) {
      if (curr.ubGroupID == ubGroupID) return curr;
      curr = curr.next;
    }
    return <GROUP>(<unknown>null);
  }

  function HandleImportantPBIQuote(
    pSoldier: SOLDIERTYPE,
    pInitiatingBattleGroup: GROUP,
  ): void {
    // wake merc up for THIS quote
    if (pSoldier.fMercAsleep) {
      TacticalCharacterDialogueWithSpecialEvent(
        pSoldier,
        Enum202.QUOTE_ENEMY_PRESENCE,
        DIALOGUE_SPECIAL_EVENT_SLEEP,
        0,
        0,
      );
      TacticalCharacterDialogueWithSpecialEvent(
        pSoldier,
        Enum202.QUOTE_ENEMY_PRESENCE,
        DIALOGUE_SPECIAL_EVENT_BEGINPREBATTLEINTERFACE,
        pInitiatingBattleGroup,
        0,
      );
      TacticalCharacterDialogueWithSpecialEvent(
        pSoldier,
        Enum202.QUOTE_ENEMY_PRESENCE,
        DIALOGUE_SPECIAL_EVENT_SLEEP,
        1,
        0,
      );
    } else {
      TacticalCharacterDialogueWithSpecialEvent(
        pSoldier,
        Enum202.QUOTE_ENEMY_PRESENCE,
        DIALOGUE_SPECIAL_EVENT_BEGINPREBATTLEINTERFACE,
        pInitiatingBattleGroup,
        0,
      );
    }
  }

  // If this is called, we are setting the game up to bring up the prebattle interface.  Before doing so,
  // one of the involved mercs will pipe up.  When he is finished, we automatically go into the mapscreen,
  // regardless of the mode we are in.
  function PrepareForPreBattleInterface(
    pPlayerDialogGroup: GROUP,
    pInitiatingBattleGroup: GROUP,
  ): void {
    // ATE; Changed alogrithm here...
    // We first loop through the group and save ubID's ov valid guys to talk....
    // ( Can't if sleeping, unconscious, and EPC, etc....
    let ubMercsInGroup: UINT8[] /* [20] */ = createArray(20, 0);
    let ubNumMercs: UINT8 = 0;
    let ubChosenMerc: UINT8;
    let pSoldier: SOLDIERTYPE;
    let pPlayer: PLAYERGROUP | null;

    if (fDisableMapInterfaceDueToBattle) {
      AssertMsg(
        0,
        "fDisableMapInterfaceDueToBattle is set before attempting to bring up PBI.  Please send PRIOR save if possible and details on anything that just happened before this battle.",
      );
      return;
    }

    // Pipe up with quote...
    AssertMsg(
      pPlayerDialogGroup,
      "Didn't get a player dialog group for prebattle interface.",
    );

    pPlayer = pPlayerDialogGroup.pPlayerList;
    AssertMsg(
      pPlayer,
      FormatString(
        "Player group %d doesn't have *any* players in it!  (Finding dialog group)",
        pPlayerDialogGroup.ubGroupID,
      ),
    );

    while (pPlayer != null) {
      pSoldier = pPlayer.pSoldier;

      if (
        pSoldier.bLife >= OKLIFE &&
        !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE) &&
        !AM_A_ROBOT(pSoldier) &&
        !AM_AN_EPC(pSoldier)
      ) {
        ubMercsInGroup[ubNumMercs] = pSoldier.ubID;
        ubNumMercs++;
      }

      pPlayer = pPlayer.next;
    }

    // Set music
    SetMusicMode(Enum328.MUSIC_TACTICAL_ENEMYPRESENT);

    if (
      (gfTacticalTraversal &&
        pInitiatingBattleGroup == gpTacticalTraversalGroup) ||
      (pInitiatingBattleGroup &&
        !pInitiatingBattleGroup.fPlayer &&
        pInitiatingBattleGroup.ubSectorX == gWorldSectorX &&
        pInitiatingBattleGroup.ubSectorY == gWorldSectorY &&
        !gbWorldSectorZ)
    ) {
      // At least say quote....
      if (ubNumMercs > 0) {
        if (pPlayerDialogGroup.uiFlags & GROUPFLAG_JUST_RETREATED_FROM_BATTLE) {
          gfCantRetreatInPBI = true;
        }

        ubChosenMerc = Random(ubNumMercs);

        pSoldier = MercPtrs[ubMercsInGroup[ubChosenMerc]];
        gpTacticalTraversalChosenSoldier = pSoldier;

        if (!gfTacticalTraversal) {
          HandleImportantPBIQuote(pSoldier, pInitiatingBattleGroup);
        }

        InterruptTime();
        PauseGame();
        LockPauseState(11);

        if (!gfTacticalTraversal) fDisableMapInterfaceDueToBattle = true;
      }
      return;
    }

    // Randomly pick a valid merc from the list we have created!
    if (ubNumMercs > 0) {
      if (pPlayerDialogGroup.uiFlags & GROUPFLAG_JUST_RETREATED_FROM_BATTLE) {
        gfCantRetreatInPBI = true;
      }

      ubChosenMerc = Random(ubNumMercs);

      pSoldier = MercPtrs[ubMercsInGroup[ubChosenMerc]];

      HandleImportantPBIQuote(pSoldier, pInitiatingBattleGroup);
      InterruptTime();
      PauseGame();
      LockPauseState(12);

      // disable exit from mapscreen and what not until face done talking
      fDisableMapInterfaceDueToBattle = true;
    } else {
      // ATE: What if we have unconscious guys, etc....
      // We MUST start combat, but donot play quote...
      InitPreBattleInterface(pInitiatingBattleGroup, true);
    }
  }

  function CheckConditionsForBattle(pGroup: GROUP): boolean {
    let curr: GROUP | null;
    let pPlayerDialogGroup: GROUP | null = null;
    let pPlayer: PLAYERGROUP | null;
    let pSoldier: SOLDIERTYPE;
    let fBattlePending: boolean = false;
    let fPossibleQueuedBattle: boolean = false;
    let fAliveMerc: boolean = false;
    let fMilitiaPresent: boolean = false;
    let fCombatAbleMerc: boolean = false;
    let fBloodCatAmbush: boolean = false;

    if (gfWorldLoaded) {
      // look for people arriving in the currently loaded sector.  This handles reinforcements.
      curr = FindMovementGroupInSector(gWorldSectorX, gWorldSectorY, true);
      if (
        !gbWorldSectorZ &&
        PlayerMercsInSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ) &&
        pGroup.ubSectorX == gWorldSectorX &&
        pGroup.ubSectorY == gWorldSectorY &&
        curr
      ) {
        // Reinforcements have arrived!
        if (gTacticalStatus.fEnemyInSector) {
          HandleArrivalOfReinforcements(pGroup);
          return true;
        }
      }
    }

    if (!DidGameJustStart()) {
      gubEnemyEncounterCode = Enum164.NO_ENCOUNTER_CODE;
    }

    HandleOtherGroupsArrivingSimultaneously(
      pGroup.ubSectorX,
      pGroup.ubSectorY,
      pGroup.ubSectorZ,
    );

    curr = gpGroupList;
    while (curr) {
      if (curr.fPlayer && curr.ubGroupSize) {
        if (!curr.fBetweenSectors) {
          if (
            curr.ubSectorX == pGroup.ubSectorX &&
            curr.ubSectorY == pGroup.ubSectorY &&
            !curr.ubSectorZ
          ) {
            if (
              !GroupHasInTransitDeadOrPOWMercs(curr) &&
              (!IsGroupTheHelicopterGroup(curr) || !fHelicopterIsAirBorne) &&
              (!curr.fVehicle || NumberMercsInVehicleGroup(curr))
            ) {
              // Now, a player group is in this sector.  Determine if the group contains any mercs that can fight.
              // Vehicles, EPCs and the robot doesn't count.  Mercs below OKLIFE do.
              pPlayer = curr.pPlayerList;
              while (pPlayer) {
                pSoldier = pPlayer.pSoldier;
                if (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
                  if (
                    !AM_A_ROBOT(pSoldier) &&
                    !AM_AN_EPC(pSoldier) &&
                    pSoldier.bLife >= OKLIFE
                  ) {
                    fCombatAbleMerc = true;
                  }
                  if (pSoldier.bLife > 0) {
                    fAliveMerc = true;
                  }
                }
                pPlayer = pPlayer.next;
              }
              if (!pPlayerDialogGroup && fCombatAbleMerc) {
                pPlayerDialogGroup = curr;
              }
              if (fCombatAbleMerc) {
                break;
              }
            }
          }
        }
      }
      curr = curr.next;
    }

    if (pGroup.fPlayer) {
      pPlayerDialogGroup = pGroup;

      if (NumEnemiesInSector(pGroup.ubSectorX, pGroup.ubSectorY)) {
        fBattlePending = true;
      }

      if (
        pGroup.uiFlags & GROUPFLAG_HIGH_POTENTIAL_FOR_AMBUSH &&
        fBattlePending
      ) {
        // This group has just arrived in a new sector from an adjacent sector that he retreated from
        // If this battle is an encounter type battle, then there is a 90% chance that the battle will
        // become an ambush scenario.
        gfHighPotentialForAmbush = true;
      }

      // If there are bloodcats in this sector, then it internally checks and handles it
      if (TestForBloodcatAmbush(pGroup)) {
        fBloodCatAmbush = true;
        fBattlePending = true;
      }

      if (
        fBattlePending &&
        (!fBloodCatAmbush ||
          gubEnemyEncounterCode == Enum164.ENTERING_BLOODCAT_LAIR_CODE)
      ) {
        if (PossibleToCoordinateSimultaneousGroupArrivals(pGroup)) {
          return false;
        }
      }
    } else {
      if (CountAllMilitiaInSector(pGroup.ubSectorX, pGroup.ubSectorY)) {
        fMilitiaPresent = true;
        fBattlePending = true;
      }
      if (fAliveMerc) {
        fBattlePending = true;
      }
    }

    if (!fAliveMerc && !fMilitiaPresent) {
      // empty vehicle, everyone dead, don't care.  Enemies don't care.
      return false;
    }

    if (fBattlePending) {
      // A battle is pending, but the player's could be all unconcious or dead.
      // Go through every group until we find at least one concious merc.  The looping will determine
      // if there are any live mercs and/or concious ones.  If there are no concious mercs, but alive ones,
      // then we will go straight to autoresolve, where the enemy will likely annihilate them or capture them.
      // If there are no alive mercs, then there is nothing anybody can do.  The enemy will completely ignore
      // this, and continue on.

      if (gubNumGroupsArrivedSimultaneously) {
        // Because this is a battle case, clear all the group flags
        curr = gpGroupList;
        while (curr && gubNumGroupsArrivedSimultaneously) {
          if (curr.uiFlags & GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY) {
            curr.uiFlags &= ~GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY;
            gubNumGroupsArrivedSimultaneously--;
          }
          curr = curr.next;
        }
      }

      gpInitPrebattleGroup = pGroup;

      if (
        gubEnemyEncounterCode == Enum164.BLOODCAT_AMBUSH_CODE ||
        gubEnemyEncounterCode == Enum164.ENTERING_BLOODCAT_LAIR_CODE
      ) {
        NotifyPlayerOfBloodcatBattle(pGroup.ubSectorX, pGroup.ubSectorY);
        return true;
      }

      if (!fCombatAbleMerc) {
        // Prepare for instant autoresolve.
        gfDelayAutoResolveStart = true;
        gfUsePersistantPBI = true;
        if (fMilitiaPresent) {
          NotifyPlayerOfInvasionByEnemyForces(
            pGroup.ubSectorX,
            pGroup.ubSectorY,
            0,
            TriggerPrebattleInterface,
          );
        } else {
          let str: string /* UINT16[256] */;
          let pSectorStr: string /* UINT16[128] */;
          pSectorStr = GetSectorIDString(
            pGroup.ubSectorX,
            pGroup.ubSectorY,
            pGroup.ubSectorZ,
            true,
          );
          str = swprintf(
            gpStrategicString[
              Enum365.STR_DIALOG_ENEMIES_ATTACK_UNCONCIOUSMERCS
            ],
            pSectorStr,
          );
          DoScreenIndependantMessageBox(
            str,
            MSG_BOX_FLAG_OK,
            TriggerPrebattleInterface,
          );
        }
      }

      if (pPlayerDialogGroup) {
        PrepareForPreBattleInterface(pPlayerDialogGroup, pGroup);
      }
      return true;
    }
    return false;
  }

  function TriggerPrebattleInterface(ubResult: UINT8): void {
    StopTimeCompression();
    SpecialCharacterDialogueEvent(
      DIALOGUE_SPECIAL_EVENT_TRIGGERPREBATTLEINTERFACE,
      gpInitPrebattleGroup,
      0,
      0,
      0,
      0,
    );
    gpInitPrebattleGroup = null;
  }

  function DeployGroupToSector(pGroup: GROUP): void {
    Assert(pGroup);
    if (pGroup.fPlayer) {
      // Update the sector positions of the players...
      return;
    }
    // Assuming enemy code from here on...
  }

  // This will get called after a battle is auto-resolved or automatically after arriving
  // at the next sector during a move and the area is clear.
  export function CalculateNextMoveIntention(pGroup: GROUP): void {
    let i: INT32;
    let wp: WAYPOINT | null;

    Assert(pGroup);

    // TEMP:  Ignore resting...

    // Should be surely an enemy group that has just made a new decision to go elsewhere!
    if (pGroup.fBetweenSectors) {
      return;
    }

    if (!pGroup.pWaypoints) {
      return;
    }

    // If the waypoints have been cancelled, then stop moving.
    /*
  if( pGroup->fWaypointsCancelled )
  {
          DeployGroupToSector( pGroup );
          return;
  }
  */

    // Determine if we are at a waypoint.
    i = pGroup.ubNextWaypointID;
    wp = pGroup.pWaypoints;
    while (i--) {
      // Traverse through the waypoint list to the next waypoint ID
      Assert(wp);
      wp = <WAYPOINT>wp.next;
    }
    Assert(wp);

    // We have the next waypoint, now check if we are actually there.
    if (pGroup.ubSectorX == wp.x && pGroup.ubSectorY == wp.y) {
      // We have reached the next waypoint, so now determine what the next waypoint is.
      switch (pGroup.ubMoveType) {
        case Enum185.ONE_WAY:
          if (!wp.next) {
            // No more waypoints, so we've reached the destination.
            DeployGroupToSector(pGroup);
            return;
          }
          // Advance destination to next waypoint ID
          pGroup.ubNextWaypointID++;
          break;
        case Enum185.CIRCULAR:
          wp = wp.next;
          if (!wp) {
            // reached the end of the patrol route.  Set to the first waypoint in list, indefinately.
            // NOTE:  If the last waypoint isn't exclusively aligned to the x or y axis of the first
            //			 waypoint, there will be an assertion failure inside the waypoint movement code.
            pGroup.ubNextWaypointID = 0;
          } else pGroup.ubNextWaypointID++;
          break;
        case Enum185.ENDTOEND_FORWARDS:
          wp = wp.next;
          if (!wp) {
            AssertMsg(
              pGroup.ubNextWaypointID,
              "EndToEnd patrol group needs more than one waypoint!",
            );
            pGroup.ubNextWaypointID--;
            pGroup.ubMoveType = Enum185.ENDTOEND_BACKWARDS;
          } else pGroup.ubNextWaypointID++;
          break;
        case Enum185.ENDTOEND_BACKWARDS:
          if (!pGroup.ubNextWaypointID) {
            pGroup.ubNextWaypointID++;
            pGroup.ubMoveType = Enum185.ENDTOEND_FORWARDS;
          } else pGroup.ubNextWaypointID--;
          break;
      }
    }
    InitiateGroupMovementToNextSector(pGroup);
  }

  export function AttemptToMergeSeparatedGroups(
    pGroup: GROUP,
    fDecrementTraversals: boolean,
  ): boolean {
    let curr: GROUP | null = null;
    let pSoldier: SOLDIERTYPE | null = null;
    let pCharacter: SOLDIERTYPE | null = null;
    let pPlayer: PLAYERGROUP | null = null;
    let fSuccess: boolean = false;
    return false;
  }

  function AwardExperienceForTravelling(pGroup: GROUP): void {
    // based on how long movement took, mercs gain a bit of life experience for travelling
    let pPlayerGroup: PLAYERGROUP | null;
    let pSoldier: SOLDIERTYPE | null;
    let uiPoints: UINT32;
    let uiCarriedPercent: UINT32;

    if (!pGroup || !pGroup.fPlayer) {
      return;
    }

    pPlayerGroup = pGroup.pPlayerList;
    while (pPlayerGroup) {
      pSoldier = pPlayerGroup.pSoldier;
      if (
        pSoldier &&
        !AM_A_ROBOT(pSoldier) &&
        !AM_AN_EPC(pSoldier) &&
        !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)
      ) {
        if (pSoldier.bLifeMax < 100) {
          // award exp...
          // amount was originally based on getting 100-bLifeMax points for 12 hours of travel (720)
          // but changed to flat rate since StatChange makes roll vs 100-lifemax as well!
          uiPoints = Math.trunc(
            pGroup.uiTraverseTime / (Math.trunc(450 / 100) - pSoldier.bLifeMax),
          );
          if (uiPoints > 0) {
            StatChange(pSoldier, HEALTHAMT, uiPoints, 0);
          }
        }

        if (pSoldier.bStrength < 100) {
          uiCarriedPercent = CalculateCarriedWeight(pSoldier);
          if (uiCarriedPercent > 50) {
            uiPoints = Math.trunc(
              pGroup.uiTraverseTime /
                Math.trunc(450 / (100 - pSoldier.bStrength)),
            );
            StatChange(
              pSoldier,
              STRAMT,
              Math.trunc((uiPoints * (uiCarriedPercent - 50)) / 100),
              0,
            );
          }
        }
      }
      pPlayerGroup = pPlayerGroup.next;
    }
  }

  function AddCorpsesToBloodcatLair(sSectorX: INT16, sSectorY: INT16): void {
    let Corpse: ROTTING_CORPSE_DEFINITION = createRottingCorpseDefinition();
    let sXPos: INT16;
    let sYPos: INT16;

    // Setup some values!
    Corpse.ubBodyType = Enum194.REGMALE;
    Corpse.sHeightAdjustment = 0;
    Corpse.bVisible = 1;

    Corpse.HeadPal = SET_PALETTEREP_ID("BROWNHEAD");
    Corpse.VestPal = SET_PALETTEREP_ID("YELLOWVEST");
    Corpse.SkinPal = SET_PALETTEREP_ID("PINKSKIN");
    Corpse.PantsPal = SET_PALETTEREP_ID("GREENPANTS");

    Corpse.bDirection = Random(8);

    // Set time of death
    // Make sure they will be rotting!
    Corpse.uiTimeOfDeath =
      GetWorldTotalMin() - Math.trunc((2 * NUM_SEC_IN_DAY) / 60);
    // Set type
    Corpse.ubType = Enum249.SMERC_JFK;
    Corpse.usFlags = ROTTING_CORPSE_FIND_SWEETSPOT_FROM_GRIDNO;

    // 1st gridno
    Corpse.sGridNo = 14319;
    ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(Corpse.sGridNo));
    Corpse.dXPos = CenterX(sXPos);
    Corpse.dYPos = CenterY(sYPos);

    // Add the rotting corpse info to the sectors unloaded rotting corpse file
    AddRottingCorpseToUnloadedSectorsRottingCorpseFile(
      sSectorX,
      sSectorY,
      0,
      Corpse,
    );

    // 2nd gridno
    Corpse.sGridNo = 9835;
    ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(Corpse.sGridNo));
    Corpse.dXPos = CenterX(sXPos);
    Corpse.dYPos = CenterY(sYPos);

    // Add the rotting corpse info to the sectors unloaded rotting corpse file
    AddRottingCorpseToUnloadedSectorsRottingCorpseFile(
      sSectorX,
      sSectorY,
      0,
      Corpse,
    );

    // 3rd gridno
    Corpse.sGridNo = 11262;
    ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(Corpse.sGridNo));
    Corpse.dXPos = CenterX(sXPos);
    Corpse.dYPos = CenterY(sYPos);

    // Add the rotting corpse info to the sectors unloaded rotting corpse file
    AddRottingCorpseToUnloadedSectorsRottingCorpseFile(
      sSectorX,
      sSectorY,
      0,
      Corpse,
    );
  }

  // ARRIVALCALLBACK
  //...............
  // This is called whenever any group arrives in the next sector (player or enemy)
  // This function will first check to see if a battle should start, or if they
  // aren't at the final destination, they will move to the next sector.
  export function GroupArrivedAtSector(
    ubGroupID: UINT8,
    fCheckForBattle: boolean,
    fNeverLeft: boolean,
  ): void {
    let pGroup: GROUP | null;
    let iVehId: INT32 = -1;
    let curr: PLAYERGROUP | null;
    let ubInsertionDirection: UINT8;
    let ubStrategicInsertionCode: UINT8;
    let pSoldier: SOLDIERTYPE;
    let fExceptionQueue: boolean = false;
    let fFirstTimeInSector: boolean = false;
    let fGroupDestroyed: boolean = false;
    let fVehicleStranded: boolean = false;

    // reset
    gfWaitingForInput = false;

    // grab the group and see if valid
    pGroup = GetGroup(ubGroupID);

    if (pGroup == null) {
      return;
    }

    if (pGroup.fPlayer) {
      // Set the fact we have visited the  sector
      curr = pGroup.pPlayerList;
      if (curr) {
        if (curr.pSoldier.bAssignment < Enum117.ON_DUTY) {
          ResetDeadSquadMemberList(curr.pSoldier.bAssignment);
        }
      }

      while (curr) {
        curr.pSoldier.uiStatusFlags &= ~SOLDIER_SHOULD_BE_TACTICALLY_VALID;
        curr = curr.next;
      }

      if (pGroup.fVehicle) {
        if ((iVehId = GivenMvtGroupIdFindVehicleId(ubGroupID)) != -1) {
          if (iVehId != iHelicopterVehicleId) {
            if (pGroup.pPlayerList == null) {
              // nobody here, better just get out now
              // with vehicles, arriving empty is probably ok, since passengers might have been killed but vehicle lived.
              return;
            }
          }
        }
      } else {
        if (pGroup.pPlayerList == null) {
          // nobody here, better just get out now
          AssertMsg(
            0,
            FormatString(
              "Player group %d arrived in sector empty.  KM 0",
              ubGroupID,
            ),
          );
          return;
        }
      }
    }
    // Check for exception cases which
    if (gTacticalStatus.bBoxingState != Enum247.NOT_BOXING) {
      if (
        !pGroup.fPlayer &&
        pGroup.ubNextX == 5 &&
        pGroup.ubNextY == 4 &&
        pGroup.ubSectorZ == 0
      ) {
        fExceptionQueue = true;
      }
    }
    // First check if the group arriving is going to queue another battle.
    // NOTE:  We can't have more than one battle ongoing at a time.
    if (
      fExceptionQueue ||
      (fCheckForBattle &&
        gTacticalStatus.fEnemyInSector &&
        FindMovementGroupInSector(gWorldSectorX, gWorldSectorY, true) &&
        (pGroup.ubNextX != gWorldSectorX ||
          pGroup.ubNextY != gWorldSectorY ||
          gbWorldSectorZ > 0)) ||
      AreInMeanwhile() ||
      // KM : Aug 11, 1999 -- Patch fix:  Added additional checks to prevent a 2nd battle in the case
      //     where the player is involved in a potential battle with bloodcats/civilians
      (fCheckForBattle && HostileCiviliansPresent()) ||
      (fCheckForBattle && HostileBloodcatsPresent())
    ) {
      // QUEUE BATTLE!
      // Delay arrival by a random value ranging from 3-5 minutes, so it doesn't get the player
      // too suspicious after it happens to him a few times, which, by the way, is a rare occurrence.
      if (AreInMeanwhile()) {
        pGroup.uiArrivalTime++; // tack on only 1 minute if we are in a meanwhile scene.  This effectively
        // prevents any battle from occurring while inside a meanwhile scene.
      } else {
        pGroup.uiArrivalTime += Random(3) + 3;
      }

      if (
        !AddStrategicEvent(
          Enum132.EVENT_GROUP_ARRIVAL,
          pGroup.uiArrivalTime,
          pGroup.ubGroupID,
        )
      )
        AssertMsg(0, "Failed to add movement event.");

      if (pGroup.fPlayer) {
        if (pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY > GetWorldTotalMin()) {
          AddStrategicEvent(
            Enum132.EVENT_GROUP_ABOUT_TO_ARRIVE,
            pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY,
            pGroup.ubGroupID,
          );
        }
      }

      return;
    }

    // Update the position of the group
    pGroup.ubPrevX = pGroup.ubSectorX;
    pGroup.ubPrevY = pGroup.ubSectorY;
    pGroup.ubSectorX = pGroup.ubNextX;
    pGroup.ubSectorY = pGroup.ubNextY;
    pGroup.ubNextX = 0;
    pGroup.ubNextY = 0;

    if (pGroup.fPlayer) {
      if (pGroup.ubSectorZ == 0) {
        SectorInfo[
          SECTOR(pGroup.ubSectorX, pGroup.ubSectorY)
        ].bLastKnownEnemies = NumEnemiesInSector(
          pGroup.ubSectorX,
          pGroup.ubSectorY,
        );
      }

      // award life 'experience' for travelling, based on travel time!
      if (!pGroup.fVehicle) {
        // gotta be walking to get tougher
        AwardExperienceForTravelling(pGroup);
      } else if (!IsGroupTheHelicopterGroup(pGroup)) {
        let pSoldier: SOLDIERTYPE;
        let iVehicleID: INT32;
        iVehicleID = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID);
        AssertMsg(
          iVehicleID != -1,
          "GroupArrival for vehicle group.  Invalid iVehicleID. ",
        );

        pSoldier = GetSoldierStructureForVehicle(iVehicleID);
        AssertMsg(
          pSoldier,
          "GroupArrival for vehicle group.  Invalid soldier pointer.",
        );

        SpendVehicleFuel(pSoldier, pGroup.uiTraverseTime * 6);

        if (!VehicleFuelRemaining(pSoldier)) {
          ReportVehicleOutOfGas(iVehicleID, pGroup.ubSectorX, pGroup.ubSectorY);
          // Nuke the group's path, so they don't continue moving.
          ClearMercPathsAndWaypointsForAllInGroup(pGroup);
        }
      }
    }

    pGroup.uiTraverseTime = 0;
    SetGroupArrivalTime(pGroup, 0);
    pGroup.fBetweenSectors = false;

    fMapPanelDirty = true;
    fMapScreenBottomDirty = true;

    // if a player group
    if (pGroup.fPlayer) {
      // if this is the last sector along player group's movement path (no more waypoints)
      if (GroupAtFinalDestination(pGroup)) {
        // clear their strategic movement (mercpaths and waypoints)
        ClearMercPathsAndWaypointsForAllInGroup(pGroup);
      }

      // if on surface
      if (pGroup.ubSectorZ == 0) {
        // check for discovering secret locations
        let bTownId: INT8 = GetTownIdForSector(
          pGroup.ubSectorX,
          pGroup.ubSectorY,
        );

        if (bTownId == Enum135.TIXA) SetTixaAsFound();
        else if (bTownId == Enum135.ORTA) SetOrtaAsFound();
        else if (IsThisSectorASAMSector(pGroup.ubSectorX, pGroup.ubSectorY, 0))
          SetSAMSiteAsFound(
            GetSAMIdFromSector(pGroup.ubSectorX, pGroup.ubSectorY, 0),
          );
      }

      if (pGroup.ubSectorX < pGroup.ubPrevX) {
        ubInsertionDirection = Enum245.SOUTHWEST;
        ubStrategicInsertionCode = Enum175.INSERTION_CODE_EAST;
      } else if (pGroup.ubSectorX > pGroup.ubPrevX) {
        ubInsertionDirection = Enum245.NORTHEAST;
        ubStrategicInsertionCode = Enum175.INSERTION_CODE_WEST;
      } else if (pGroup.ubSectorY < pGroup.ubPrevY) {
        ubInsertionDirection = Enum245.NORTHWEST;
        ubStrategicInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      } else if (pGroup.ubSectorY > pGroup.ubPrevY) {
        ubInsertionDirection = Enum245.SOUTHEAST;
        ubStrategicInsertionCode = Enum175.INSERTION_CODE_NORTH;
      } else {
        Assert(0);
        return;
      }

      if (pGroup.fVehicle == false) {
        // non-vehicle player group

        curr = pGroup.pPlayerList;
        while (curr) {
          curr.pSoldier.fBetweenSectors = false;
          curr.pSoldier.sSectorX = pGroup.ubSectorX;
          curr.pSoldier.sSectorY = pGroup.ubSectorY;
          curr.pSoldier.bSectorZ = pGroup.ubSectorZ;
          curr.pSoldier.ubPrevSectorID = SECTOR(pGroup.ubPrevX, pGroup.ubPrevY);
          curr.pSoldier.ubInsertionDirection = ubInsertionDirection;

          // don't override if a tactical traversal
          if (
            curr.pSoldier.ubStrategicInsertionCode !=
              Enum175.INSERTION_CODE_PRIMARY_EDGEINDEX &&
            curr.pSoldier.ubStrategicInsertionCode !=
              Enum175.INSERTION_CODE_SECONDARY_EDGEINDEX
          ) {
            curr.pSoldier.ubStrategicInsertionCode = ubStrategicInsertionCode;
          }

          if (curr.pSoldier.pMercPath) {
            // remove head from their mapscreen path list
            curr.pSoldier.pMercPath = <PathSt>(
              RemoveHeadFromStrategicPath(curr.pSoldier.pMercPath)
            );
          }

          // ATE: Alrighty, check if this sector is currently loaded, if so,
          // add them to the tactical engine!
          if (
            pGroup.ubSectorX == gWorldSectorX &&
            pGroup.ubSectorY == gWorldSectorY &&
            pGroup.ubSectorZ == gbWorldSectorZ
          ) {
            UpdateMercInSector(
              curr.pSoldier,
              gWorldSectorX,
              gWorldSectorY,
              gbWorldSectorZ,
            );
          }
          curr = curr.next;
        }

        // if there's anybody in the group
        if (pGroup.pPlayerList) {
          // don't print any messages when arriving underground (there's no delay involved) or if we never left (cancel)
          if (
            GroupAtFinalDestination(pGroup) &&
            pGroup.ubSectorZ == 0 &&
            !fNeverLeft
          ) {
            // if assigned to a squad
            if (pGroup.pPlayerList.pSoldier.bAssignment < Enum117.ON_DUTY) {
              // squad
              ScreenMsg(
                FONT_MCOLOR_DKRED,
                MSG_INTERFACE,
                pMessageStrings[Enum333.MSG_ARRIVE],
                pAssignmentStrings[pGroup.pPlayerList.pSoldier.bAssignment],
                pMapVertIndex[pGroup.pPlayerList.pSoldier.sSectorY],
                pMapHortIndex[pGroup.pPlayerList.pSoldier.sSectorX],
              );
            } else {
              // a loner
              ScreenMsg(
                FONT_MCOLOR_DKRED,
                MSG_INTERFACE,
                pMessageStrings[Enum333.MSG_ARRIVE],
                pGroup.pPlayerList.pSoldier.name,
                pMapVertIndex[pGroup.pPlayerList.pSoldier.sSectorY],
                pMapHortIndex[pGroup.pPlayerList.pSoldier.sSectorX],
              );
            }
          }
        }
      } // vehicle player group
      else {
        iVehId = GivenMvtGroupIdFindVehicleId(ubGroupID);
        Assert(iVehId != -1);

        if (pVehicleList[iVehId].pMercPath) {
          // remove head from vehicle's mapscreen path list
          pVehicleList[iVehId].pMercPath = RemoveHeadFromStrategicPath(
            pVehicleList[iVehId].pMercPath,
          );
        }

        // update vehicle position
        SetVehicleSectorValues(iVehId, pGroup.ubSectorX, pGroup.ubSectorY);
        pVehicleList[iVehId].fBetweenSectors = false;

        // update passengers position
        UpdatePositionOfMercsInVehicle(iVehId);

        if (iVehId != iHelicopterVehicleId) {
          pSoldier = GetSoldierStructureForVehicle(iVehId);
          Assert(pSoldier);

          pSoldier.fBetweenSectors = false;
          pSoldier.sSectorX = pGroup.ubSectorX;
          pSoldier.sSectorY = pGroup.ubSectorY;
          pSoldier.bSectorZ = pGroup.ubSectorZ;
          pSoldier.ubInsertionDirection = ubInsertionDirection;

          // ATE: Removed, may 21 - sufficient to use insertion direction...
          // pSoldier->bDesiredDirection = ubInsertionDirection;

          pSoldier.ubStrategicInsertionCode = ubStrategicInsertionCode;

          // if this sector is currently loaded
          if (
            pGroup.ubSectorX == gWorldSectorX &&
            pGroup.ubSectorY == gWorldSectorY &&
            pGroup.ubSectorZ == gbWorldSectorZ
          ) {
            // add vehicle to the tactical engine!
            UpdateMercInSector(
              pSoldier,
              gWorldSectorX,
              gWorldSectorY,
              gbWorldSectorZ,
            );
          }

          // set directions of insertion
          curr = pGroup.pPlayerList;
          while (curr) {
            curr.pSoldier.fBetweenSectors = false;
            curr.pSoldier.sSectorX = pGroup.ubSectorX;
            curr.pSoldier.sSectorY = pGroup.ubSectorY;
            curr.pSoldier.bSectorZ = pGroup.ubSectorZ;
            curr.pSoldier.ubInsertionDirection = ubInsertionDirection;

            // ATE: Removed, may 21 - sufficient to use insertion direction...
            // curr->pSoldier->bDesiredDirection = ubInsertionDirection;

            curr.pSoldier.ubStrategicInsertionCode = ubStrategicInsertionCode;

            // if this sector is currently loaded
            if (
              pGroup.ubSectorX == gWorldSectorX &&
              pGroup.ubSectorY == gWorldSectorY &&
              pGroup.ubSectorZ == gbWorldSectorZ
            ) {
              // add passenger to the tactical engine!
              UpdateMercInSector(
                curr.pSoldier,
                gWorldSectorX,
                gWorldSectorY,
                gbWorldSectorZ,
              );
            }

            curr = curr.next;
          }
        } else {
          if (
            HandleHeliEnteringSector(
              pVehicleList[iVehId].sSectorX,
              pVehicleList[iVehId].sSectorY,
            ) == true
          ) {
            // helicopter destroyed
            fGroupDestroyed = true;
          }
        }

        if (!fGroupDestroyed) {
          // don't print any messages when arriving underground, there's no delay involved
          if (
            GroupAtFinalDestination(pGroup) &&
            pGroup.ubSectorZ == 0 &&
            !fNeverLeft
          ) {
            ScreenMsg(
              FONT_MCOLOR_DKRED,
              MSG_INTERFACE,
              pMessageStrings[Enum333.MSG_ARRIVE],
              pVehicleStrings[pVehicleList[iVehId].ubVehicleType],
              pMapVertIndex[pGroup.ubSectorY],
              pMapHortIndex[pGroup.ubSectorX],
            );
          }
        }
      }

      if (!fGroupDestroyed) {
        // check if sector had been visited previously
        fFirstTimeInSector = !GetSectorFlagStatus(
          pGroup.ubSectorX,
          pGroup.ubSectorY,
          pGroup.ubSectorZ,
          SF_ALREADY_VISITED,
        );

        // on foot, or in a vehicle other than the chopper
        if (!pGroup.fVehicle || !IsGroupTheHelicopterGroup(pGroup)) {
          // ATE: Add a few corpse to the bloodcat lair...
          if (
            SECTOR(pGroup.ubSectorX, pGroup.ubSectorY) == Enum123.SEC_I16 &&
            fFirstTimeInSector
          ) {
            AddCorpsesToBloodcatLair(pGroup.ubSectorX, pGroup.ubSectorY);
          }

          // mark the sector as visited already
          SetSectorFlag(
            pGroup.ubSectorX,
            pGroup.ubSectorY,
            pGroup.ubSectorZ,
            SF_ALREADY_VISITED,
          );
        }
      }

      // update character info
      fTeamPanelDirty = true;
      fCharacterInfoPanelDirty = true;
    }

    if (!fGroupDestroyed) {
      // Determine if a battle should start.
      // if a battle does start, or get's delayed, then we will keep the group in memory including
      // all waypoints, until after the battle is resolved.  At that point, we will continue the processing.
      if (
        fCheckForBattle &&
        !CheckConditionsForBattle(pGroup) &&
        !gfWaitingForInput
      ) {
        let next: GROUP | null;
        HandleNonCombatGroupArrival(pGroup, true, fNeverLeft);

        if (gubNumGroupsArrivedSimultaneously) {
          pGroup = gpGroupList;
          while (gubNumGroupsArrivedSimultaneously && pGroup) {
            next = pGroup.next;
            if (pGroup.uiFlags & GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY) {
              gubNumGroupsArrivedSimultaneously--;
              HandleNonCombatGroupArrival(pGroup, false, false);
            }
            pGroup = next;
          }
        }
      } else {
        // Handle cases for pre battle conditions
        pGroup.uiFlags = 0;
        if (gubNumAwareBattles) {
          // When the AI is looking for the players, and a battle is initiated, then
          // decrement the value, otherwise the queen will continue searching to infinity.
          gubNumAwareBattles--;
        }
      }
    }
    gfWaitingForInput = false;
  }

  function HandleNonCombatGroupArrival(
    pGroup: GROUP,
    fMainGroup: boolean,
    fNeverLeft: boolean,
  ): void {
    // if any mercs are actually in the group

    if (StrategicAILookForAdjacentGroups(pGroup)) {
      // The routine actually just deleted the enemy group (player's don't get deleted), so we are done!
      return;
    }

    if (pGroup.fPlayer) {
      // The group will always exist after the AI was processed.

      // Determine if the group should rest, change routes, or continue moving.
      // if on foot, or in a vehicle other than the helicopter
      if (!pGroup.fVehicle || !IsGroupTheHelicopterGroup(pGroup)) {
        // take control of sector
        SetThisSectorAsPlayerControlled(
          pGroup.ubSectorX,
          pGroup.ubSectorY,
          pGroup.ubSectorZ,
          false,
        );
      }

      // if this is the last sector along their movement path (no more waypoints)
      if (GroupAtFinalDestination(pGroup)) {
        // if currently selected sector has nobody in it
        if (PlayerMercsInSector(sSelMapX, sSelMapY, iCurrentMapSectorZ) == 0) {
          // make this sector strategically selected
          ChangeSelectedMapSector(
            pGroup.ubSectorX,
            pGroup.ubSectorY,
            pGroup.ubSectorZ,
          );
        }

        // if on foot or in a vehicle other than the helicopter (Skyrider speaks for heli movement)
        if (!pGroup.fVehicle || !IsGroupTheHelicopterGroup(pGroup)) {
          StopTimeCompression();

          // if traversing tactically, or we never left (just canceling), don't do this
          if (!gfTacticalTraversal && !fNeverLeft) {
            RandomMercInGroupSaysQuote(
              pGroup,
              Enum202.QUOTE_MERC_REACHED_DESTINATION,
            );
          }
        }
      }
      // look for NPCs to stop for, anyone is too tired to keep going, if all OK rebuild waypoints & continue movement
      // NOTE: Only the main group (first group arriving) will stop for NPCs, it's just too much hassle to stop them all
      PlayerGroupArrivedSafelyInSector(pGroup, fMainGroup);
    } else {
      if (!pGroup.fDebugGroup) {
        CalculateNextMoveIntention(pGroup);
      } else {
        RemovePGroup(pGroup);
      }
    }
    // Clear the non-persistant flags.
    pGroup.uiFlags = 0;
  }

  // Because a battle is about to start, we need to go through the event list and look for other
  // groups that may arrive at the same time -- enemies or players, and blindly add them to the sector
  // without checking for battle conditions, as it has already determined that a new battle is about to
  // start.
  function HandleOtherGroupsArrivingSimultaneously(
    ubSectorX: UINT8,
    ubSectorY: UINT8,
    ubSectorZ: UINT8,
  ): void {
    let pEvent: STRATEGICEVENT | null;
    let uiCurrTimeStamp: UINT32;
    let pGroup: GROUP;
    uiCurrTimeStamp = GetWorldTotalSeconds();
    pEvent = gpEventList;
    gubNumGroupsArrivedSimultaneously = 0;
    while (pEvent && pEvent.uiTimeStamp <= uiCurrTimeStamp) {
      if (
        pEvent.ubCallbackID == Enum132.EVENT_GROUP_ARRIVAL &&
        !(pEvent.ubFlags & SEF_DELETION_PENDING)
      ) {
        pGroup = GetGroup(pEvent.uiParam);
        Assert(pGroup);
        if (
          pGroup.ubNextX == ubSectorX &&
          pGroup.ubNextY == ubSectorY &&
          pGroup.ubSectorZ == ubSectorZ
        ) {
          if (pGroup.fBetweenSectors) {
            GroupArrivedAtSector(pEvent.uiParam, false, false);
            pGroup.uiFlags |= GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY;
            gubNumGroupsArrivedSimultaneously++;
            DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pGroup.ubGroupID);
            pEvent = gpEventList;
            continue;
          }
        }
      }
      pEvent = pEvent.next;
    }
  }

  // The user has just approved to plan a simultaneous arrival.  So we will syncronize all of the involved
  // groups so that they arrive at the same time (which is the time the final group would arrive).
  function PrepareGroupsForSimultaneousArrival(): void {
    let pGroup: GROUP | null;
    let uiLatestArrivalTime: UINT32 = 0;
    let pSoldier: SOLDIERTYPE;
    let iVehId: INT32 = 0;

    pGroup = gpGroupList;
    while (pGroup) {
      // For all of the groups that haven't arrived yet, determine which one is going to take the longest.
      if (
        pGroup != gpPendingSimultaneousGroup &&
        pGroup.fPlayer &&
        pGroup.fBetweenSectors &&
        pGroup.ubNextX == gpPendingSimultaneousGroup.ubSectorX &&
        pGroup.ubNextY == gpPendingSimultaneousGroup.ubSectorY &&
        !IsGroupTheHelicopterGroup(pGroup)
      ) {
        uiLatestArrivalTime = Math.max(
          pGroup.uiArrivalTime,
          uiLatestArrivalTime,
        );
        pGroup.uiFlags |=
          GROUPFLAG_SIMULTANEOUSARRIVAL_APPROVED | GROUPFLAG_MARKER;
      }
      pGroup = pGroup.next;
    }
    // Now, go through the list again, and reset their arrival event to the latest arrival time.
    pGroup = gpGroupList;
    while (pGroup) {
      if (pGroup.uiFlags & GROUPFLAG_MARKER) {
        DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pGroup.ubGroupID);

        // NOTE: This can cause the arrival time to be > GetWorldTotalMin() + TraverseTime, so keep that in mind
        // if you have any code that uses these 3 values to figure out how far along its route a group is!
        SetGroupArrivalTime(pGroup, uiLatestArrivalTime);
        AddStrategicEvent(
          Enum132.EVENT_GROUP_ARRIVAL,
          pGroup.uiArrivalTime,
          pGroup.ubGroupID,
        );

        if (pGroup.fPlayer) {
          if (
            pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY >
            GetWorldTotalMin()
          ) {
            AddStrategicEvent(
              Enum132.EVENT_GROUP_ABOUT_TO_ARRIVE,
              pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY,
              pGroup.ubGroupID,
            );
          }
        }

        DelayEnemyGroupsIfPathsCross(pGroup);

        pGroup.uiFlags &= ~GROUPFLAG_MARKER;
      }
      pGroup = pGroup.next;
    }
    // We still have the first group that has arrived.  Because they are set up to be in the destination
    // sector, we will "warp" them back to the last sector, and also setup a new arrival time for them.
    pGroup = <GROUP>gpPendingSimultaneousGroup;
    pGroup.ubNextX = pGroup.ubSectorX;
    pGroup.ubNextY = pGroup.ubSectorY;
    pGroup.ubSectorX = pGroup.ubPrevX;
    pGroup.ubSectorY = pGroup.ubPrevY;
    SetGroupArrivalTime(pGroup, uiLatestArrivalTime);
    pGroup.fBetweenSectors = true;

    if (pGroup.fVehicle) {
      if ((iVehId = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID)) != -1) {
        pVehicleList[iVehId].fBetweenSectors = true;

        // set up vehicle soldier
        pSoldier = GetSoldierStructureForVehicle(iVehId);

        if (pSoldier) {
          pSoldier.fBetweenSectors = true;
        }
      }
    }

    AddStrategicEvent(
      Enum132.EVENT_GROUP_ARRIVAL,
      pGroup.uiArrivalTime,
      pGroup.ubGroupID,
    );

    if (pGroup.fPlayer) {
      if (pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY > GetWorldTotalMin()) {
        AddStrategicEvent(
          Enum132.EVENT_GROUP_ABOUT_TO_ARRIVE,
          pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY,
          pGroup.ubGroupID,
        );
      }
    }
    DelayEnemyGroupsIfPathsCross(pGroup);
  }

  // See if there are other groups OTW.  If so, and if we haven't asked the user yet to plan
  // a simultaneous attack, do so now, and readjust the groups accordingly.  If it is possible
  // to do so, then we will set up the gui, and postpone the prebattle interface.
  function PossibleToCoordinateSimultaneousGroupArrivals(
    pFirstGroup: GROUP,
  ): boolean {
    let pGroup: GROUP | null;
    let ubNumNearbyGroups: UINT8 = 0;

    // If the user has already been asked, then don't ask the question again!
    if (
      pFirstGroup.uiFlags &
        (GROUPFLAG_SIMULTANEOUSARRIVAL_APPROVED |
          GROUPFLAG_SIMULTANEOUSARRIVAL_CHECKED) ||
      IsGroupTheHelicopterGroup(pFirstGroup)
    ) {
      return false;
    }

    // We can't coordinate simultaneous attacks on a sector without any stationary forces!  Otherwise, it
    // is possible that they will be gone when you finally arrive.
    // if( !NumStationaryEnemiesInSector( pFirstGroup->ubSectorX, pFirstGroup->ubSectorY ) )
    //	return FALSE;

    // Count the number of groups that are scheduled to arrive in the same sector and are currently
    // adjacent to the sector in question.
    pGroup = gpGroupList;
    while (pGroup) {
      if (
        pGroup != pFirstGroup &&
        pGroup.fPlayer &&
        pGroup.fBetweenSectors &&
        pGroup.ubNextX == pFirstGroup.ubSectorX &&
        pGroup.ubNextY == pFirstGroup.ubSectorY &&
        !(pGroup.uiFlags & GROUPFLAG_SIMULTANEOUSARRIVAL_CHECKED) &&
        !IsGroupTheHelicopterGroup(pGroup)
      ) {
        pGroup.uiFlags |= GROUPFLAG_SIMULTANEOUSARRIVAL_CHECKED;
        ubNumNearbyGroups++;
      }
      pGroup = pGroup.next;
    }

    if (ubNumNearbyGroups) {
      // postpone the battle until the user answers the dialog.
      let str: string /* UINT16[255] */;
      let pStr: string /* Pointer<UINT16> */;
      let pEnemyType: string /* Pointer<UINT16> */;
      InterruptTime();
      PauseGame();
      LockPauseState(13);
      gpPendingSimultaneousGroup = pFirstGroup;
      // Build the string
      if (ubNumNearbyGroups == 1) {
        pStr = gpStrategicString[Enum365.STR_DETECTED_SINGULAR];
      } else {
        pStr = gpStrategicString[Enum365.STR_DETECTED_PLURAL];
      }
      if (gubEnemyEncounterCode == Enum164.ENTERING_BLOODCAT_LAIR_CODE) {
        pEnemyType = gpStrategicString[Enum365.STR_PB_BLOODCATS];
      } else {
        pEnemyType = gpStrategicString[Enum365.STR_PB_ENEMIES];
      }
      // header, sector, singular/plural str, confirmation string.
      // Ex:  Enemies have been detected in sector J9 and another squad is
      //     about to arrive.  Do you wish to coordinate a simultaneous arrival?
      str = swprintf(
        pStr,
        pEnemyType,
        String.fromCharCode(
          "A".charCodeAt(0) + gpPendingSimultaneousGroup.ubSectorY - 1,
        ),
        gpPendingSimultaneousGroup.ubSectorX,
      ); // Sector location
      str += "  ";
      str += gpStrategicString[Enum365.STR_COORDINATE];
      // Setup the dialog

      // Kris August 03, 1999 Bug fix:  Changed 1st line to 2nd line to fix game breaking if this dialog came up while in tactical.
      //                               It would kick you to mapscreen, where things would break...
      // DoMapMessageBox( MSG_BOX_BASIC_STYLE, str, MAP_SCREEN, MSG_BOX_FLAG_YESNO, PlanSimultaneousGroupArrivalCallback );
      DoMapMessageBox(
        Enum24.MSG_BOX_BASIC_STYLE,
        str,
        guiCurrentScreen,
        MSG_BOX_FLAG_YESNO,
        PlanSimultaneousGroupArrivalCallback,
      );

      gfWaitingForInput = true;
      return true;
    }
    return false;
  }

  function PlanSimultaneousGroupArrivalCallback(bMessageValue: UINT8): void {
    if (bMessageValue == MSG_BOX_RETURN_YES) {
      PrepareGroupsForSimultaneousArrival();
    } else {
      PrepareForPreBattleInterface(
        gpPendingSimultaneousGroup,
        gpPendingSimultaneousGroup,
      );
    }
    UnLockPauseState();
    UnPauseGame();
  }

  function DelayEnemyGroupsIfPathsCross(pPlayerGroup: GROUP): void {
    let pGroup: GROUP | null;
    pGroup = gpGroupList;
    while (pGroup) {
      if (!pGroup.fPlayer) {
        // then check to see if this group will arrive in next sector before the player group.
        if (pGroup.uiArrivalTime < pPlayerGroup.uiArrivalTime) {
          // check to see if enemy group will cross paths with player group.
          if (
            pGroup.ubNextX == pPlayerGroup.ubSectorX &&
            pGroup.ubNextY == pPlayerGroup.ubSectorY &&
            pGroup.ubSectorX == pPlayerGroup.ubNextX &&
            pGroup.ubSectorY == pPlayerGroup.ubNextY
          ) {
            // Okay, the enemy group will cross paths with the player, so find and delete the arrival event
            // and repost it in the future (like a minute or so after the player arrives)
            DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pGroup.ubGroupID);

            // NOTE: This can cause the arrival time to be > GetWorldTotalMin() + TraverseTime, so keep that in mind
            // if you have any code that uses these 3 values to figure out how far along its route a group is!
            SetGroupArrivalTime(
              pGroup,
              pPlayerGroup.uiArrivalTime + 1 + Random(10),
            );
            if (
              !AddStrategicEvent(
                Enum132.EVENT_GROUP_ARRIVAL,
                pGroup.uiArrivalTime,
                pGroup.ubGroupID,
              )
            )
              AssertMsg(0, "Failed to add movement event.");
          }
        }
      }
      pGroup = pGroup.next;
    }
  }

  function InitiateGroupMovementToNextSector(pGroup: GROUP): void {
    let dx: INT32;
    let dy: INT32;
    let i: INT32;
    let ubDirection: UINT8;
    let ubSector: UINT8;
    let wp: WAYPOINT;
    let iVehId: INT32 = -1;
    let pSoldier: SOLDIERTYPE;
    let uiSleepMinutes: UINT32 = 0;

    Assert(pGroup);
    i = pGroup.ubNextWaypointID;
    wp = <WAYPOINT>pGroup.pWaypoints;
    while (i--) {
      // Traverse through the waypoint list to the next waypoint ID
      Assert(wp);
      wp = <WAYPOINT>wp.next;
    }
    Assert(wp);
    // We now have the correct waypoint.
    // Analyse the group and determine which direction it will move from the current sector.
    dx = wp.x - pGroup.ubSectorX;
    dy = wp.y - pGroup.ubSectorY;
    if (dx && dy) {
      // Can't move diagonally!
      AssertMsg(
        0,
        FormatString(
          "Attempting to move to waypoint in a diagonal direction from sector %d,%d to sector %d,%d",
          pGroup.ubSectorX,
          pGroup.ubSectorY,
          wp.x,
          wp.y,
        ),
      );
    }
    if (!dx && !dy)
      // Can't move to position currently at!
      AssertMsg(
        0,
        FormatString(
          "Attempting to move to waypoint %d, %d that you are already at!",
          wp.x,
          wp.y,
        ),
      );
    // Clip dx/dy value so that the move is for only one sector.
    if (dx >= 1) {
      ubDirection = Enum186.EAST_STRATEGIC_MOVE;
      dx = 1;
    } else if (dy >= 1) {
      ubDirection = Enum186.SOUTH_STRATEGIC_MOVE;
      dy = 1;
    } else if (dx <= -1) {
      ubDirection = Enum186.WEST_STRATEGIC_MOVE;
      dx = -1;
    } else if (dy <= -1) {
      ubDirection = Enum186.NORTH_STRATEGIC_MOVE;
      dy = -1;
    } else {
      Assert(0);
      return;
    }
    // All conditions for moving to the next waypoint are now good.
    pGroup.ubNextX = dx + pGroup.ubSectorX;
    pGroup.ubNextY = dy + pGroup.ubSectorY;
    // Calc time to get to next waypoint...
    ubSector = SECTOR(pGroup.ubSectorX, pGroup.ubSectorY);
    if (!pGroup.ubSectorZ) {
      let fCalcRegularTime: boolean = true;
      if (!pGroup.fPlayer) {
        // Determine if the enemy group is "sleeping".  If so, then simply delay their arrival time by the amount of time
        // they are going to be sleeping for.
        if (GetWorldHour() >= 21 || GetWorldHour() <= 4) {
          // It is definitely night time.
          if (Chance(67)) {
            // 2 in 3 chance of going to sleep.
            pGroup.uiTraverseTime = GetSectorMvtTimeForGroup(
              ubSector,
              ubDirection,
              pGroup,
            );
            uiSleepMinutes = 360 + Random(121); // 6-8 hours sleep
            fCalcRegularTime = false;
          }
        }
      }
      if (fCalcRegularTime) {
        pGroup.uiTraverseTime = GetSectorMvtTimeForGroup(
          ubSector,
          ubDirection,
          pGroup,
        );
      }
    } else {
      pGroup.uiTraverseTime = 1;
    }

    if (pGroup.uiTraverseTime == 0xffffffff) {
      AssertMsg(
        0,
        FormatString(
          "Group %d (%s) attempting illegal move from %s%d to %s%d (%s).",
          pGroup.ubGroupID,
          pGroup.fPlayer ? "Player" : "AI",
          String.fromCharCode(pGroup.ubSectorY + "A".charCodeAt(0)),
          pGroup.ubSectorX,
          String.fromCharCode(pGroup.ubNextY + "A".charCodeAt(0)),
          pGroup.ubNextX,
          gszTerrain[SectorInfo[ubSector].ubTraversability[ubDirection]],
        ),
      );
    }

    // add sleep, if any
    pGroup.uiTraverseTime += uiSleepMinutes;

    if (gfTacticalTraversal && gpTacticalTraversalGroup == pGroup) {
      if (gfUndergroundTacticalTraversal) {
        // underground movement between sectors takes 1 minute.
        pGroup.uiTraverseTime = 1;
      } else {
        // strategic movement between town sectors takes 5 minutes.
        pGroup.uiTraverseTime = 5;
      }
    }

    // if group isn't already between sectors
    if (!pGroup.fBetweenSectors) {
      // put group between sectors
      pGroup.fBetweenSectors = true;
      // and set it's arrival time
      SetGroupArrivalTime(pGroup, GetWorldTotalMin() + pGroup.uiTraverseTime);
    }
    // NOTE: if the group is already between sectors, DON'T MESS WITH ITS ARRIVAL TIME!  THAT'S NOT OUR JOB HERE!!!

    // special override for AI patrol initialization only
    if (gfRandomizingPatrolGroup) {
      // We're initializing the patrol group, so randomize the enemy groups to have extremely quick and varying
      // arrival times so that their initial positions aren't easily determined.
      pGroup.uiTraverseTime = 1 + Random(pGroup.uiTraverseTime - 1);
      SetGroupArrivalTime(pGroup, GetWorldTotalMin() + pGroup.uiTraverseTime);
    }

    if (pGroup.fVehicle == true) {
      // vehicle, set fact it is between sectors too
      if ((iVehId = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID)) != -1) {
        pVehicleList[iVehId].fBetweenSectors = true;
        pSoldier = GetSoldierStructureForVehicle(iVehId);

        if (pSoldier) {
          pSoldier.fBetweenSectors = true;

          // OK, Remove the guy from tactical engine!
          RemoveSoldierFromTacticalSector(pSoldier, true);
        }
      }
    }

    // Post the event!
    if (
      !AddStrategicEvent(
        Enum132.EVENT_GROUP_ARRIVAL,
        pGroup.uiArrivalTime,
        pGroup.ubGroupID,
      )
    )
      AssertMsg(0, "Failed to add movement event.");

    // For the case of player groups, we need to update the information of the soldiers.
    if (pGroup.fPlayer) {
      let curr: PLAYERGROUP | null;

      if (pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY > GetWorldTotalMin()) {
        AddStrategicEvent(
          Enum132.EVENT_GROUP_ABOUT_TO_ARRIVE,
          pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY,
          pGroup.ubGroupID,
        );
      }

      curr = pGroup.pPlayerList;
      while (curr) {
        curr.pSoldier.fBetweenSectors = true;

        // OK, Remove the guy from tactical engine!
        RemoveSoldierFromTacticalSector(curr.pSoldier, true);

        curr = curr.next;
      }
      CheckAndHandleUnloadingOfCurrentWorld();

      // If an enemy group will be crossing paths with the player group, delay the enemy group's arrival time so that
      // the player will always encounter that group.
      if (!pGroup.ubSectorZ) {
        DelayEnemyGroupsIfPathsCross(pGroup);
      }
    }
  }

  export function RemoveGroupWaypoints(ubGroupID: UINT8): void {
    let pGroup: GROUP;
    pGroup = GetGroup(ubGroupID);
    Assert(pGroup);
    RemovePGroupWaypoints(pGroup);
  }

  export function RemovePGroupWaypoints(pGroup: GROUP): void {
    let wp: WAYPOINT;
    // if there aren't any waypoints to delete, then return.  This also avoids setting
    // the fWaypointsCancelled flag.
    if (!pGroup.pWaypoints) return;
    // remove all of the waypoints.
    while (pGroup.pWaypoints) {
      wp = pGroup.pWaypoints;
      pGroup.pWaypoints = pGroup.pWaypoints.next;
    }
    pGroup.ubNextWaypointID = 0;
    pGroup.pWaypoints = null;

    // By setting this flag, it acknowledges the possibility that the group is currently between sectors,
    // and will continue moving until it reaches the next sector.  If the user decides to change directions,
    // during this process, the arrival event must be modified to send the group back.
    // pGroup->fWaypointsCancelled = TRUE;
  }

  // set groups waypoints as cancelled
  function SetWayPointsAsCanceled(ubGroupID: UINT8): void {
    let pGroup: GROUP;
    pGroup = GetGroup(ubGroupID);
    Assert(pGroup);

    // pGroup -> fWaypointsCancelled = TRUE;

    return;
  }

  // set this groups previous sector values
  function SetGroupPrevSectors(ubGroupID: UINT8, ubX: UINT8, ubY: UINT8): void {
    let pGroup: GROUP;
    pGroup = GetGroup(ubGroupID);
    Assert(pGroup);

    // since we have a group, set prev sector's x and y
    pGroup.ubPrevX = ubX;
    pGroup.ubPrevY = ubY;
  }

  export function RemoveGroup(ubGroupID: UINT8): void {
    let pGroup: GROUP;
    pGroup = GetGroup(ubGroupID);

    if (ubGroupID == 51) {
      let i: number = 0;
    }

    Assert(pGroup);
    RemovePGroup(pGroup);
  }

  let gfRemovingAllGroups: boolean = false;

  export function RemovePGroup(pGroup: GROUP): void {
    let bit: UINT32;
    let index: UINT32;
    let mask: UINT32;

    if (pGroup.fPersistant && !gfRemovingAllGroups) {
      CancelEmptyPersistentGroupMovement(pGroup);
      return;
      DoScreenIndependantMessageBox(
        "Strategic Info Warning:  Attempting to delete a persistant group.",
        MSG_BOX_FLAG_OK,
        null,
      );
    }
    // if removing head, then advance head first.
    if (pGroup == gpGroupList) gpGroupList = gpGroupList.next;
    else {
      // detach this node from the list.
      let curr: GROUP;
      curr = <GROUP>gpGroupList;
      while (curr.next && curr.next != pGroup) curr = curr.next;
      AssertMsg(
        curr.next == pGroup,
        "Trying to remove a strategic group that isn't in the list!",
      );
      curr.next = pGroup.next;
    }

    // Remove the waypoints.
    RemovePGroupWaypoints(pGroup);

    // Remove the arrival event if applicable.
    DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pGroup.ubGroupID);

    // Determine what type of group we have (because it requires different methods)
    if (pGroup.fPlayer) {
      // Remove player group
      let pPlayer: PLAYERGROUP | null;
      while (pGroup.pPlayerList) {
        pPlayer = pGroup.pPlayerList;
        pGroup.pPlayerList = pGroup.pPlayerList.next;
      }
    } else {
      RemoveGroupFromStrategicAILists(pGroup.ubGroupID);
    }

    // clear the unique group ID
    index = Math.trunc(pGroup.ubGroupID / 32);
    bit = pGroup.ubGroupID % 32;
    mask = (1 << bit) >>> 0;

    if (!(uniqueIDMask[index] & mask)) {
      mask = mask;
    }

    uniqueIDMask[index] -= mask;
  }

  export function RemoveAllGroups(): void {
    gfRemovingAllGroups = true;
    while (gpGroupList) {
      RemovePGroup(gpGroupList);
    }
    gfRemovingAllGroups = false;
  }

  export function SetGroupSectorValue(
    sSectorX: INT16,
    sSectorY: INT16,
    sSectorZ: INT16,
    ubGroupID: UINT8,
  ): void {
    let pGroup: GROUP;
    let pPlayer: PLAYERGROUP | null;

    // get the group
    pGroup = GetGroup(ubGroupID);

    // make sure it is valid
    Assert(pGroup);

    // Remove waypoints
    RemovePGroupWaypoints(pGroup);

    // set sector x and y to passed values
    pGroup.ubSectorX = pGroup.ubNextX = sSectorX;
    pGroup.ubSectorY = pGroup.ubNextY = sSectorY;
    pGroup.ubSectorZ = sSectorZ;
    pGroup.fBetweenSectors = false;

    // set next sectors same as current
    pGroup.ubOriginalSector = SECTOR(pGroup.ubSectorX, pGroup.ubSectorY);
    DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pGroup.ubGroupID);

    // set all of the mercs in the group so that they are in the new sector too.
    pPlayer = pGroup.pPlayerList;
    while (pPlayer) {
      pPlayer.pSoldier.sSectorX = sSectorX;
      pPlayer.pSoldier.sSectorY = sSectorY;
      pPlayer.pSoldier.bSectorZ = sSectorZ;
      pPlayer.pSoldier.fBetweenSectors = false;
      pPlayer.pSoldier.uiStatusFlags &= ~SOLDIER_SHOULD_BE_TACTICALLY_VALID;
      pPlayer = pPlayer.next;
    }

    CheckAndHandleUnloadingOfCurrentWorld();
  }

  export function SetEnemyGroupSector(pGroup: GROUP, ubSectorID: UINT8): void {
    // make sure it is valid
    Assert(pGroup);
    DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pGroup.ubGroupID);

    // Remove waypoints
    if (!gfRandomizingPatrolGroup) {
      RemovePGroupWaypoints(pGroup);
    }

    // set sector x and y to passed values
    pGroup.ubSectorX = pGroup.ubNextX = SECTORX(ubSectorID);
    pGroup.ubSectorY = pGroup.ubNextY = SECTORY(ubSectorID);
    pGroup.ubSectorZ = 0;
    pGroup.fBetweenSectors = false;
    // pGroup->fWaypointsCancelled = FALSE;
  }

  function SetGroupNextSectorValue(
    sSectorX: INT16,
    sSectorY: INT16,
    ubGroupID: UINT8,
  ): void {
    let pGroup: GROUP;

    // get the group
    pGroup = GetGroup(ubGroupID);

    // make sure it is valid
    Assert(pGroup);

    // Remove waypoints
    RemovePGroupWaypoints(pGroup);

    // set sector x and y to passed values
    pGroup.ubNextX = sSectorX;
    pGroup.ubNextY = sSectorY;
    pGroup.fBetweenSectors = false;

    // set next sectors same as current
    pGroup.ubOriginalSector = SECTOR(pGroup.ubSectorX, pGroup.ubSectorY);
  }

  // get eta of the group with this id
  export function CalculateTravelTimeOfGroupId(ubId: UINT8): INT32 {
    let pGroup: GROUP;

    // get the group
    pGroup = GetGroup(ubId);

    if (pGroup == null) {
      return 0;
    }

    return CalculateTravelTimeOfGroup(pGroup);
  }

  function CalculateTravelTimeOfGroup(pGroup: GROUP): INT32 {
    let iDelta: INT32;
    let uiEtaTime: UINT32 = 0;
    let pNode: WAYPOINT | null = null;
    let pCurrent: WAYPOINT = createWaypoint();
    let pDest: WAYPOINT = createWaypoint();
    let ubCurrentSector: INT8 = 0;

    // check if valid group
    if (pGroup == null) {
      // return current time
      return uiEtaTime;
    }

    // set up next node
    pNode = pGroup.pWaypoints;

    // now get the delta in current sector and next sector
    iDelta =
      SECTOR(pGroup.ubSectorX, pGroup.ubSectorY) -
      SECTOR(pGroup.ubNextX, pGroup.ubNextY);

    if (iDelta == 0) {
      // not going anywhere...return current time
      return uiEtaTime;
    }

    // if already on the road
    if (pGroup.fBetweenSectors) {
      // to get travel time to the first sector, use the arrival time, this way it accounts for delays due to simul. arrival
      if (pGroup.uiArrivalTime >= GetWorldTotalMin()) {
        uiEtaTime += pGroup.uiArrivalTime - GetWorldTotalMin();
      }

      // first waypoint is NEXT sector
      pCurrent.x = pGroup.ubNextX;
      pCurrent.y = pGroup.ubNextY;
    } else {
      // first waypoint is CURRENT sector
      pCurrent.x = pGroup.ubSectorX;
      pCurrent.y = pGroup.ubSectorY;
    }

    while (pNode) {
      pDest.x = pNode.x;
      pDest.y = pNode.y;

      // update eta time by the path between these 2 waypts
      uiEtaTime += FindTravelTimeBetweenWaypoints(pCurrent, pDest, pGroup);

      pCurrent.x = pNode.x;
      pCurrent.y = pNode.y;

      // next waypt
      pNode = pNode.next;
    }

    return uiEtaTime;
  }

  export function FindTravelTimeBetweenWaypoints(
    pSource: WAYPOINT,
    pDest: WAYPOINT,
    pGroup: GROUP,
  ): INT32 {
    let ubStart: UINT8 = 0;
    let ubEnd: UINT8 = 0;
    let iDelta: INT32 = 0;
    let iCurrentCostInTime: INT32 = 0;
    let ubCurrentSector: UINT8 = 0;
    let ubDirection: UINT8;
    let iThisCostInTime: INT32;

    // find travel time between waypoints
    if (!pSource || !pDest) {
      // no change
      return iCurrentCostInTime;
    }

    // get start and end setor values
    ubStart = SECTOR(pSource.x, pSource.y);
    ubEnd = SECTOR(pDest.x, pDest.y);

    // are we in fact moving?
    if (ubStart == ubEnd) {
      // no
      return iCurrentCostInTime;
    }

    iDelta = ubEnd - ubStart;

    // which direction are we moving?
    if (iDelta > 0) {
      if (iDelta % (SOUTH_MOVE - 2) == 0) {
        iDelta = SOUTH_MOVE - 2;
        ubDirection = Enum186.SOUTH_STRATEGIC_MOVE;
      } else {
        iDelta = EAST_MOVE;
        ubDirection = Enum186.EAST_STRATEGIC_MOVE;
      }
    } else {
      if (iDelta % (NORTH_MOVE + 2) == 0) {
        iDelta = NORTH_MOVE + 2;
        ubDirection = Enum186.NORTH_STRATEGIC_MOVE;
      } else {
        iDelta = WEST_MOVE;
        ubDirection = Enum186.WEST_STRATEGIC_MOVE;
      }
    }

    for (
      ubCurrentSector = ubStart;
      ubCurrentSector != ubEnd;
      ubCurrentSector += iDelta
    ) {
      // find diff between current and next
      iThisCostInTime = GetSectorMvtTimeForGroup(
        ubCurrentSector,
        ubDirection,
        pGroup,
      );

      if (iThisCostInTime == 0xffffffff) {
        AssertMsg(
          0,
          FormatString(
            "Group %d (%s) attempting illegal move from sector %d, dir %d (%s).",
            pGroup.ubGroupID,
            pGroup.fPlayer ? "Player" : "AI",
            ubCurrentSector,
            ubDirection,
            gszTerrain[
              SectorInfo[ubCurrentSector].ubTraversability[ubDirection]
            ],
          ),
        );
      }

      // accumulate it
      iCurrentCostInTime += iThisCostInTime;
    }

    return iCurrentCostInTime;
  }

  const FOOT_TRAVEL_TIME = 89;
  const CAR_TRAVEL_TIME = 30;
  const TRUCK_TRAVEL_TIME = 32;
  const TRACKED_TRAVEL_TIME = 46;
  const AIR_TRAVEL_TIME = 10;

  // CHANGES:  ubDirection contains the strategic move value, not the delta value.
  export function GetSectorMvtTimeForGroup(
    ubSector: UINT8,
    ubDirection: UINT8,
    pGroup: GROUP,
  ): INT32 {
    let iTraverseTime: INT32;
    let iBestTraverseTime: INT32 = 1000000;
    let iEncumbrance: INT32;
    let iHighestEncumbrance: INT32 = 0;
    let pSoldier: SOLDIERTYPE;
    let curr: PLAYERGROUP | null;
    let fFoot: boolean;
    let fCar: boolean;
    let fTruck: boolean;
    let fTracked: boolean;
    let fAir: boolean;
    let ubTraverseType: UINT8;
    let ubTraverseMod: UINT8;

    // THIS FUNCTION WAS WRITTEN TO HANDLE MOVEMENT TYPES WHERE MORE THAN ONE TRANSPORTAION TYPE IS AVAILABLE.

    // Determine the group's method(s) of tranportation.  If more than one,
    // we will always use the highest time.
    fFoot = Boolean(pGroup.ubTransportationMask & FOOT);
    fCar = Boolean(pGroup.ubTransportationMask & CAR);
    fTruck = Boolean(pGroup.ubTransportationMask & TRUCK);
    fTracked = Boolean(pGroup.ubTransportationMask & TRACKED);
    fAir = Boolean(pGroup.ubTransportationMask & AIR);

    ubTraverseType = SectorInfo[ubSector].ubTraversability[ubDirection];

    if (ubTraverseType == Enum127.EDGEOFWORLD) return 0xffffffff; // can't travel here!

    // ARM: Made air-only travel take its normal time per sector even through towns.  Because Skyrider charges by the sector,
    // not by flying time, it's annoying when his default route detours through a town to save time, but costs extra money.
    // This isn't exactly unrealistic, since the chopper shouldn't be faster flying over a town anyway...  Not that other
    // kinds of travel should be either - but the towns represents a kind of warping of our space-time scale as it is...
    if (ubTraverseType == Enum127.TOWN && pGroup.ubTransportationMask != AIR)
      return 5; // very fast, and vehicle types don't matter.

    if (fFoot) {
      switch (ubTraverseType) {
        case Enum127.ROAD:
          ubTraverseMod = 100;
          break;
        case Enum127.PLAINS:
          ubTraverseMod = 85;
          break;
        case Enum127.SAND:
          ubTraverseMod = 50;
          break;
        case Enum127.SPARSE:
          ubTraverseMod = 70;
          break;
        case Enum127.DENSE:
          ubTraverseMod = 60;
          break;
        case Enum127.SWAMP:
          ubTraverseMod = 35;
          break;
        case Enum127.WATER:
          ubTraverseMod = 25;
          break;
        case Enum127.HILLS:
          ubTraverseMod = 50;
          break;
        case Enum127.GROUNDBARRIER:
          ubTraverseMod = 0;
          break;
        case Enum127.NS_RIVER:
          ubTraverseMod = 25;
          break;
        case Enum127.EW_RIVER:
          ubTraverseMod = 25;
          break;
        default:
          Assert(0);
          return 0xffffffff;
      }
      if (ubTraverseMod == 0) return 0xffffffff; // Group can't traverse here.
      iTraverseTime = Math.trunc((FOOT_TRAVEL_TIME * 100) / ubTraverseMod);
      if (iTraverseTime < iBestTraverseTime) iBestTraverseTime = iTraverseTime;

      if (pGroup.fPlayer) {
        curr = pGroup.pPlayerList;
        while (curr) {
          pSoldier = curr.pSoldier;
          if (pSoldier.bAssignment != Enum117.VEHICLE) {
            // Soldier is on foot and travelling.  Factor encumbrance into movement rate.
            iEncumbrance = CalculateCarriedWeight(pSoldier);
            if (iEncumbrance > iHighestEncumbrance) {
              iHighestEncumbrance = iEncumbrance;
            }
          }
          curr = curr.next;
        }
        if (iHighestEncumbrance > 100) {
          iBestTraverseTime = Math.trunc(
            (iBestTraverseTime * iHighestEncumbrance) / 100,
          );
        }
      }
    }
    if (fCar) {
      switch (ubTraverseType) {
        case Enum127.ROAD:
          ubTraverseMod = 100;
          break;
        default:
          ubTraverseMod = 0;
          break;
      }
      if (ubTraverseMod == 0) return 0xffffffff; // Group can't traverse here.
      iTraverseTime = Math.trunc((CAR_TRAVEL_TIME * 100) / ubTraverseMod);
      if (iTraverseTime < iBestTraverseTime) iBestTraverseTime = iTraverseTime;
    }
    if (fTruck) {
      switch (ubTraverseType) {
        case Enum127.ROAD:
          ubTraverseMod = 100;
          break;
        case Enum127.PLAINS:
          ubTraverseMod = 75;
          break;
        case Enum127.SPARSE:
          ubTraverseMod = 60;
          break;
        case Enum127.HILLS:
          ubTraverseMod = 50;
          break;
        default:
          ubTraverseMod = 0;
          break;
      }
      if (ubTraverseMod == 0) return 0xffffffff; // Group can't traverse here.
      iTraverseTime = Math.trunc((TRUCK_TRAVEL_TIME * 100) / ubTraverseMod);
      if (iTraverseTime < iBestTraverseTime) iBestTraverseTime = iTraverseTime;
    }
    if (fTracked) {
      switch (ubTraverseType) {
        case Enum127.ROAD:
          ubTraverseMod = 100;
          break;
        case Enum127.PLAINS:
          ubTraverseMod = 100;
          break;
        case Enum127.SAND:
          ubTraverseMod = 70;
          break;
        case Enum127.SPARSE:
          ubTraverseMod = 60;
          break;
        case Enum127.HILLS:
          ubTraverseMod = 60;
          break;
        case Enum127.NS_RIVER:
          ubTraverseMod = 20;
          break;
        case Enum127.EW_RIVER:
          ubTraverseMod = 20;
          break;
        case Enum127.WATER:
          ubTraverseMod = 10;
          break;
        default:
          ubTraverseMod = 0;
          break;
      }
      if (ubTraverseMod == 0) return 0xffffffff; // Group can't traverse here.
      iTraverseTime = Math.trunc((TRACKED_TRAVEL_TIME * 100) / ubTraverseMod);
      if (iTraverseTime < iBestTraverseTime) iBestTraverseTime = iTraverseTime;
    }
    if (fAir) {
      iTraverseTime = AIR_TRAVEL_TIME;
      if (iTraverseTime < iBestTraverseTime) iBestTraverseTime = iTraverseTime;
    }
    return iBestTraverseTime;
  }

  // Counts the number of live mercs in any given sector.
  export function PlayerMercsInSector(
    ubSectorX: UINT8,
    ubSectorY: UINT8,
    ubSectorZ: UINT8,
  ): UINT8 {
    let pGroup: GROUP | null;
    let pPlayer: PLAYERGROUP | null;
    let ubNumMercs: UINT8 = 0;
    pGroup = gpGroupList;
    while (pGroup) {
      if (pGroup.fPlayer && !pGroup.fBetweenSectors) {
        if (
          pGroup.ubSectorX == ubSectorX &&
          pGroup.ubSectorY == ubSectorY &&
          pGroup.ubSectorZ == ubSectorZ
        ) {
          // we have a group, make sure that it isn't a group containing only dead members.
          pPlayer = pGroup.pPlayerList;
          while (pPlayer) {
            // robots count as mercs here, because they can fight, but vehicles don't
            if (
              pPlayer.pSoldier.bLife &&
              !(pPlayer.pSoldier.uiStatusFlags & SOLDIER_VEHICLE)
            ) {
              ubNumMercs++;
            }
            pPlayer = pPlayer.next;
          }
        }
      }
      pGroup = pGroup.next;
    }
    return ubNumMercs;
  }

  export function PlayerGroupsInSector(
    ubSectorX: UINT8,
    ubSectorY: UINT8,
    ubSectorZ: UINT8,
  ): UINT8 {
    let pGroup: GROUP | null;
    let pPlayer: PLAYERGROUP | null;
    let ubNumGroups: UINT8 = 0;
    pGroup = gpGroupList;
    while (pGroup) {
      if (pGroup.fPlayer && !pGroup.fBetweenSectors) {
        if (
          pGroup.ubSectorX == ubSectorX &&
          pGroup.ubSectorY == ubSectorY &&
          pGroup.ubSectorZ == ubSectorZ
        ) {
          // we have a group, make sure that it isn't a group containing only dead members.
          pPlayer = pGroup.pPlayerList;
          while (pPlayer) {
            if (pPlayer.pSoldier.bLife) {
              ubNumGroups++;
              break;
            }
            pPlayer = pPlayer.next;
          }
        }
      }
      pGroup = pGroup.next;
    }
    return ubNumGroups;
  }

  // is the player group with this id in motion?
  export function PlayerIDGroupInMotion(ubID: UINT8): boolean {
    let pGroup: GROUP;

    // get the group
    pGroup = GetGroup(ubID);

    // make sure it is valid

    // no group
    if (pGroup == null) {
      return false;
    }

    return PlayerGroupInMotion(pGroup);
  }

  // is the player group in motion?
  function PlayerGroupInMotion(pGroup: GROUP): boolean {
    return pGroup.fBetweenSectors;
  }

  // get travel time for this group
  export function GetTravelTimeForGroup(
    ubSector: UINT8,
    ubDirection: UINT8,
    ubGroup: UINT8,
  ): INT32 {
    let pGroup: GROUP;

    // get the group
    pGroup = GetGroup(ubGroup);

    // make sure it is valid
    Assert(pGroup);

    return GetSectorMvtTimeForGroup(ubSector, ubDirection, pGroup);
  }

  export function GetTravelTimeForFootTeam(
    ubSector: UINT8,
    ubDirection: UINT8,
  ): INT32 {
    let Group: GROUP = createGroup();

    // group going on foot
    Group.ubTransportationMask = FOOT;

    return GetSectorMvtTimeForGroup(ubSector, ubDirection, Group);
  }

  // Add this group to the current battle fray!
  // NOTE:  For enemies, only MAX_STRATEGIC_TEAM_SIZE at a time can be in a battle, so
  // if it ever gets past that, god help the player, but we'll have to insert them
  // as those slots free up.
  export function HandleArrivalOfReinforcements(pGroup: GROUP): void {
    let pSoldier: SOLDIERTYPE;
    let pSector: SECTORINFO;
    let iNumEnemiesInSector: INT32;
    let cnt: INT32;

    if (pGroup.fPlayer) {
      // We don't have to worry about filling up the player slots, because it is impossible
      // to have more player's in the game then the number of slots available for the player.
      let pPlayer: PLAYERGROUP | null;
      let ubStrategicInsertionCode: UINT8;
      // First, determine which entrypoint to use, based on the travel direction of the group.
      if (pGroup.ubSectorX < pGroup.ubPrevX)
        ubStrategicInsertionCode = Enum175.INSERTION_CODE_EAST;
      else if (pGroup.ubSectorX > pGroup.ubPrevX)
        ubStrategicInsertionCode = Enum175.INSERTION_CODE_WEST;
      else if (pGroup.ubSectorY < pGroup.ubPrevY)
        ubStrategicInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      else if (pGroup.ubSectorY > pGroup.ubPrevY)
        ubStrategicInsertionCode = Enum175.INSERTION_CODE_NORTH;
      else {
        Assert(0);
        return;
      }
      pPlayer = pGroup.pPlayerList;

      cnt = 0;

      while (pPlayer) {
        pSoldier = pPlayer.pSoldier;
        Assert(pSoldier);
        pSoldier.ubStrategicInsertionCode = ubStrategicInsertionCode;
        UpdateMercInSector(pSoldier, pGroup.ubSectorX, pGroup.ubSectorY, 0);
        pPlayer = pPlayer.next;

        // DO arrives quote....
        if (cnt == 0) {
          TacticalCharacterDialogue(
            pSoldier,
            Enum202.QUOTE_MERC_REACHED_DESTINATION,
          );
        }
        cnt++;
      }
      ScreenMsg(
        FONT_YELLOW,
        MSG_INTERFACE,
        Message[Enum334.STR_PLAYER_REINFORCEMENTS],
      );
    } else {
      gfPendingEnemies = true;
      ResetMortarsOnTeamCount();
      AddPossiblePendingEnemiesToBattle();
    }
    // Update the known number of enemies in the sector.
    pSector = SectorInfo[SECTOR(pGroup.ubSectorX, pGroup.ubSectorY)];
    iNumEnemiesInSector = NumEnemiesInSector(
      pGroup.ubSectorX,
      pGroup.ubSectorY,
    );
    if (iNumEnemiesInSector) {
      if (pSector.bLastKnownEnemies >= 0) {
        pSector.bLastKnownEnemies = iNumEnemiesInSector;
      }
      // if we don't know how many enemies there are, then we can't update this value.
    } else {
      pSector.bLastKnownEnemies = 0;
    }
  }

  export function PlayersBetweenTheseSectors(
    sSource: INT16,
    sDest: INT16,
    iCountEnter: Pointer<INT32>,
    iCountExit: Pointer<INT32>,
    fAboutToArriveEnter: Pointer<boolean>,
  ): boolean {
    let curr: GROUP | null = gpGroupList;
    let sBattleSector: INT16 = -1;
    let fMayRetreatFromBattle: boolean = false;
    let fRetreatingFromBattle: boolean = false;
    let fHandleRetreats: boolean = false;
    let fHelicopterGroup: boolean = false;
    let ubMercsInGroup: UINT8 = 0;

    iCountEnter.value = 0;
    iCountExit.value = 0;
    fAboutToArriveEnter.value = false;

    if (gpBattleGroup) {
      // Assert( gfPreBattleInterfaceActive );
      sBattleSector = SECTOR(gpBattleGroup.ubSectorX, gpBattleGroup.ubSectorY);
    }

    // debug only
    if (gfDisplayPotentialRetreatPaths == true) {
      // Assert( gfPreBattleInterfaceActive );
    }

    // get number of characters entering/existing between these two sectors.  Special conditions during
    // pre-battle interface to return where this function is used to show potential retreating directions instead!

    //	check all groups
    while (curr) {
      // if player group
      if (curr.fPlayer == true) {
        fHelicopterGroup = IsGroupTheHelicopterGroup(curr);

        // if this group is aboard the helicopter and we're showing the airspace layer, don't count any mercs aboard the
        // chopper, because the chopper icon itself serves the function of showing the location/size of this group
        if (!fHelicopterGroup || !fShowAircraftFlag) {
          // if only showing retreat paths, ignore groups not in the battle sector
          // if NOT showing retreat paths, ignore groups not between sectors
          if (
            (gfDisplayPotentialRetreatPaths == true &&
              sBattleSector == sSource) ||
            (gfDisplayPotentialRetreatPaths == false &&
              curr.fBetweenSectors == true)
          ) {
            fMayRetreatFromBattle = false;
            fRetreatingFromBattle = false;

            if (
              sBattleSector == sSource &&
              SECTOR(curr.ubSectorX, curr.ubSectorY) == sSource &&
              SECTOR(curr.ubPrevX, curr.ubPrevY) == sDest
            ) {
              fMayRetreatFromBattle = true;
            }

            if (
              sBattleSector == sDest &&
              SECTOR(curr.ubSectorX, curr.ubSectorY) == sDest &&
              SECTOR(curr.ubPrevX, curr.ubPrevY) == sSource
            ) {
              fRetreatingFromBattle = true;
            }

            ubMercsInGroup = curr.ubGroupSize;

            if (
              (SECTOR(curr.ubSectorX, curr.ubSectorY) == sSource &&
                SECTOR(curr.ubNextX, curr.ubNextY) == sDest) ||
              fMayRetreatFromBattle == true
            ) {
              // if it's a valid vehicle, but not the helicopter (which can fly empty)
              if (
                curr.fVehicle &&
                !fHelicopterGroup &&
                GivenMvtGroupIdFindVehicleId(curr.ubGroupID) != -1
              ) {
                // make sure empty vehicles (besides helicopter) aren't in motion!
                Assert(ubMercsInGroup > 0);
                // subtract 1, we don't wanna count the vehicle itself for purposes of showing a number on the map
                ubMercsInGroup--;
              }

              iCountEnter.value += ubMercsInGroup;

              if (
                curr.uiArrivalTime - GetWorldTotalMin() <=
                  ABOUT_TO_ARRIVE_DELAY ||
                fMayRetreatFromBattle == true
              ) {
                fAboutToArriveEnter.value = true;
              }
            } else if (
              (SECTOR(curr.ubSectorX, curr.ubSectorY) == sDest &&
                SECTOR(curr.ubNextX, curr.ubNextY) == sSource) ||
              fRetreatingFromBattle == true
            ) {
              // if it's a valid vehicle, but not the helicopter (which can fly empty)
              if (
                curr.fVehicle &&
                !fHelicopterGroup &&
                GivenMvtGroupIdFindVehicleId(curr.ubGroupID) != -1
              ) {
                // make sure empty vehicles (besides helicopter) aren't in motion!
                Assert(ubMercsInGroup > 0);
                // subtract 1, we don't wanna count the vehicle itself for purposes of showing a number on the map
                ubMercsInGroup--;
              }

              iCountExit.value += ubMercsInGroup;
            }
          }
        }
      }

      // next group
      curr = curr.next;
    }

    // if there was actually anyone leaving this sector and entering next
    if (iCountEnter.value > 0) {
      return true;
    } else {
      return false;
    }
  }

  export function MoveAllGroupsInCurrentSectorToSector(
    ubSectorX: UINT8,
    ubSectorY: UINT8,
    ubSectorZ: UINT8,
  ): void {
    let pGroup: GROUP | null;
    let pPlayer: PLAYERGROUP | null;
    pGroup = gpGroupList;
    while (pGroup) {
      if (
        pGroup.fPlayer &&
        pGroup.ubSectorX == gWorldSectorX &&
        pGroup.ubSectorY == gWorldSectorY &&
        pGroup.ubSectorZ == gbWorldSectorZ &&
        !pGroup.fBetweenSectors
      ) {
        // This player group is in the currently loaded sector...
        pGroup.ubSectorX = ubSectorX;
        pGroup.ubSectorY = ubSectorY;
        pGroup.ubSectorZ = ubSectorZ;
        pPlayer = pGroup.pPlayerList;
        while (pPlayer) {
          pPlayer.pSoldier.sSectorX = ubSectorX;
          pPlayer.pSoldier.sSectorY = ubSectorY;
          pPlayer.pSoldier.bSectorZ = ubSectorZ;
          pPlayer.pSoldier.fBetweenSectors = false;
          pPlayer = pPlayer.next;
        }
      }
      pGroup = pGroup.next;
    }
    CheckAndHandleUnloadingOfCurrentWorld();
  }

  export function GetGroupPosition(
    ubNextX: Pointer<UINT8>,
    ubNextY: Pointer<UINT8>,
    ubPrevX: Pointer<UINT8>,
    ubPrevY: Pointer<UINT8>,
    uiTraverseTime: Pointer<UINT32>,
    uiArriveTime: Pointer<UINT32>,
    ubGroupId: UINT8,
  ): void {
    let pGroup: GROUP;

    // get the group
    pGroup = GetGroup(ubGroupId);

    // make sure it is valid

    // no group
    if (pGroup == null) {
      ubNextX.value = 0;
      ubNextY.value = 0;
      ubPrevX.value = 0;
      ubPrevY.value = 0;
      uiTraverseTime.value = 0;
      uiArriveTime.value = 0;
      return;
    }

    // valid group, grab values
    ubNextX.value = pGroup.ubNextX;
    ubNextY.value = pGroup.ubNextY;
    ubPrevX.value = pGroup.ubPrevX;
    ubPrevY.value = pGroup.ubPrevY;
    uiTraverseTime.value = pGroup.uiTraverseTime;
    uiArriveTime.value = pGroup.uiArrivalTime;

    return;
  }

  // this is only for grunts who were in mvt groups between sectors and are set to a new squad...NOTHING ELSE!!!!!
  export function SetGroupPosition(
    ubNextX: UINT8,
    ubNextY: UINT8,
    ubPrevX: UINT8,
    ubPrevY: UINT8,
    uiTraverseTime: UINT32,
    uiArriveTime: UINT32,
    ubGroupId: UINT8,
  ): void {
    let pGroup: GROUP;
    let pPlayer: PLAYERGROUP | null;

    // get the group
    pGroup = GetGroup(ubGroupId);

    // no group
    if (pGroup == null) {
      return;
    }

    // valid group, grab values
    pGroup.ubNextX = ubNextX;
    pGroup.ubNextY = ubNextY;
    pGroup.ubPrevX = ubPrevX;
    pGroup.ubPrevY = ubPrevY;
    pGroup.uiTraverseTime = uiTraverseTime;
    SetGroupArrivalTime(pGroup, uiArriveTime);
    pGroup.fBetweenSectors = true;

    AddWaypointToPGroup(pGroup, pGroup.ubNextX, pGroup.ubNextY);
    // now, if player group set all grunts in the group to be between secotrs
    if (pGroup.fPlayer == true) {
      pPlayer = pGroup.pPlayerList;
      while (pPlayer) {
        pPlayer.pSoldier.fBetweenSectors = true;
        pPlayer = pPlayer.next;
      }
    }

    return;
  }

  export function SaveStrategicMovementGroupsToSaveGameFile(
    hFile: HWFILE,
  ): boolean {
    let pGroup: GROUP | null = null;
    let uiNumberOfGroups: UINT32 = 0;
    let uiNumBytesWritten: UINT32 = 0;
    let buffer: Buffer;

    pGroup = gpGroupList;

    // Count the number of active groups
    while (pGroup) {
      uiNumberOfGroups++;
      pGroup = pGroup.next;
    }

    // Save the number of movement groups to the saved game file
    buffer = Buffer.allocUnsafe(4);
    buffer.writeUInt32LE(uiNumberOfGroups, 0);

    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) {
      // Error Writing size of L.L. to disk
      return false;
    }

    pGroup = gpGroupList;

    // Loop through the linked lists and add each node
    buffer = Buffer.allocUnsafe(GROUP_SIZE);
    while (pGroup) {
      // Save each node in the LL
      writeGroup(pGroup, buffer);

      uiNumBytesWritten = FileWrite(hFile, buffer, GROUP_SIZE);
      if (uiNumBytesWritten != GROUP_SIZE) {
        // Error Writing group node to disk
        return false;
      }

      //
      // Save the linked list, for the current type of group
      //

      // If its a player group
      if (pGroup.fPlayer) {
        // if there is a player list, add it
        if (pGroup.ubGroupSize) {
          // Save the player group list
          SavePlayerGroupList(hFile, pGroup);
        }
      } // else its an enemy group
      else {
        // Make sure the pointer is valid
        Assert(pGroup.pEnemyGroup);

        //
        SaveEnemyGroupStruct(hFile, pGroup);
      }

      // Save the waypoint list for the group, if they have one
      SaveWayPointList(hFile, pGroup);

      pGroup = pGroup.next;
    }

    // Save the unique id mask
    buffer = Buffer.allocUnsafe(4 * 8);
    writeUIntArray(uniqueIDMask, buffer, 0, 4);

    uiNumBytesWritten = FileWrite(hFile, buffer, 4 * 8);
    if (uiNumBytesWritten != 4 * 8) {
      // Error Writing size of L.L. to disk
      return false;
    }

    return true;
  }

  export function LoadStrategicMovementGroupsFromSavedGameFile(
    hFile: HWFILE,
  ): boolean {
    let pGroup: GROUP | null;
    let pTemp: GROUP;
    let uiNumberOfGroups: UINT32 = 0;
    // UINT32	uiNumBytesWritten=0;
    let uiNumBytesRead: UINT32 = 0;
    let cnt: UINT32;
    let bit: UINT32;
    let index: UINT32;
    let mask: UINT32;
    let ubNumPlayerGroupsEmpty: UINT8 = 0;
    let ubNumEnemyGroupsEmpty: UINT8 = 0;
    let ubNumPlayerGroupsFull: UINT8 = 0;
    let ubNumEnemyGroupsFull: UINT8 = 0;
    let buffer: Buffer;

    // delete the existing group list
    while (gpGroupList) RemoveGroupFromList(gpGroupList);

    // load the number of nodes in the list
    buffer = Buffer.allocUnsafe(4);
    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) {
      // Error Writing size of L.L. to disk
      return false;
    }

    uiNumberOfGroups = buffer.readUInt32LE(0);

    pGroup = gpGroupList;

    // loop through all the nodes and add them to the LL
    buffer = Buffer.allocUnsafe(GROUP_SIZE);
    for (cnt = 0; cnt < uiNumberOfGroups; cnt++) {
      // allocate memory for the node
      pTemp = createGroup();

      // Read in the node
      uiNumBytesRead = FileRead(hFile, buffer, GROUP_SIZE);
      if (uiNumBytesRead != GROUP_SIZE) {
        // Error Writing size of L.L. to disk
        return false;
      }

      readGroup(pTemp, buffer);

      //
      // Add either the pointer or the linked list.
      //

      if (pTemp.fPlayer) {
        // if there is a player list, add it
        if (pTemp.ubGroupSize) {
          // Save the player group list
          LoadPlayerGroupList(hFile, pTemp);
        }
      } // else its an enemy group
      else {
        LoadEnemyGroupStructFromSavedGame(hFile, pTemp);
      }

      // Save the waypoint list for the group, if they have one
      LoadWayPointList(hFile, pTemp);

      pTemp.next = null;

      // add the node to the list

      // if its the firs node
      if (cnt == 0) {
        gpGroupList = pTemp;
        pGroup = gpGroupList;
      } else {
        (<GROUP>pGroup).next = pTemp;
        pGroup = pTemp;
      }
    }

    // Load the unique id mask
    buffer = Buffer.allocUnsafe(4 * 8);
    uiNumBytesRead = FileRead(hFile, buffer, 4 * 8);

    readUIntArray(uniqueIDMask, buffer, 0, 4);

    //@@@ TEMP!
    // Rebuild the uniqueIDMask as a very old bug broke the uniqueID assignments in extremely rare cases.
    uniqueIDMask.fill(0);
    pGroup = gpGroupList;
    while (pGroup) {
      if (pGroup.fPlayer) {
        if (pGroup.ubGroupSize) {
          ubNumPlayerGroupsFull++;
        } else {
          ubNumPlayerGroupsEmpty++;
        }
      } else {
        if (pGroup.ubGroupSize) {
          ubNumEnemyGroupsFull++;
        } else {
          ubNumEnemyGroupsEmpty++;
        }
      }
      if (ubNumPlayerGroupsEmpty || ubNumEnemyGroupsEmpty) {
        // report error?
      }
      index = Math.trunc(pGroup.ubGroupID / 32);
      bit = pGroup.ubGroupID % 32;
      mask = (1 << bit) >>> 0;
      uniqueIDMask[index] += mask;
      pGroup = pGroup.next;
    }

    if (uiNumBytesRead != 4 * 8) {
      return false;
    }

    return true;
  }

  // Saves the Player's group list to the saved game file
  function SavePlayerGroupList(hFile: HWFILE, pGroup: GROUP): boolean {
    let uiNumberOfNodesInList: UINT32 = 0;
    let pTemp: PLAYERGROUP | null = null;
    let uiNumBytesWritten: UINT32 = 0;
    let uiProfileID: UINT32;
    let buffer: Buffer;

    pTemp = pGroup.pPlayerList;

    while (pTemp) {
      uiNumberOfNodesInList++;
      pTemp = pTemp.next;
    }

    buffer = Buffer.allocUnsafe(4);

    // Save the number of nodes in the list
    buffer.writeUInt32LE(uiNumberOfNodesInList, 0);

    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) {
      // Error Writing size of L.L. to disk
      return false;
    }

    pTemp = pGroup.pPlayerList;

    // Loop trhough and save only the players profile id
    while (pTemp) {
      // Save the ubProfile ID for this node
      uiProfileID = pTemp.ubProfileID;
      buffer.writeUInt32LE(uiProfileID, 0);

      uiNumBytesWritten = FileWrite(hFile, buffer, 4);
      if (uiNumBytesWritten != 4) {
        // Error Writing size of L.L. to disk
        return false;
      }

      pTemp = pTemp.next;
    }

    return true;
  }

  function LoadPlayerGroupList(hFile: HWFILE, pGroup: GROUP): boolean {
    let uiNumberOfNodesInList: UINT32 = 0;
    let pTemp: PLAYERGROUP;
    let pHead: PLAYERGROUP | null = null;
    let uiNumberOfNodes: UINT32 = 0;
    let uiProfileID: UINT32 = 0;
    let uiNumBytesRead: UINT32;
    let cnt: UINT32 = 0;
    let sTempID: INT16;
    let pTempGroup: GROUP = pGroup;
    let buffer: Buffer;

    //	pTemp = pGroup;

    //	pHead = *pGroup->pPlayerList;

    buffer = Buffer.allocUnsafe(4);

    // Load the number of nodes in the player list
    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) {
      // Error Writing size of L.L. to disk
      return false;
    }

    uiNumberOfNodes = buffer.readUInt32LE(0);

    // loop through all the nodes and set them up
    for (cnt = 0; cnt < uiNumberOfNodes; cnt++) {
      // allcate space for the current node
      pTemp = createPlayerGroup();

      // Load the ubProfile ID for this node
      uiNumBytesRead = FileRead(hFile, buffer, 4);
      if (uiNumBytesRead != 4) {
        // Error Writing size of L.L. to disk
        return false;
      }

      uiProfileID = buffer.readUInt32LE(0);

      // Set up the current node
      pTemp.ubProfileID = uiProfileID;
      sTempID = GetSoldierIDFromMercID(pTemp.ubProfileID);

      // Should never happen
      // Assert( sTempID != -1 );
      pTemp.ubID = sTempID;

      pTemp.pSoldier = Menptr[pTemp.ubID];

      pTemp.next = null;

      // if its the first time through
      if (cnt == 0) {
        pTempGroup.pPlayerList = pTemp;
        pHead = pTemp;
      } else {
        (<PLAYERGROUP>pHead).next = pTemp;

        // move to the next node
        pHead = pTemp;
      }
    }

    return true;
  }

  // Saves the enemy group struct to the saved game struct
  function SaveEnemyGroupStruct(hFile: HWFILE, pGroup: GROUP): boolean {
    let uiNumBytesWritten: UINT32 = 0;
    let buffer: Buffer;

    // Save the enemy struct info to the saved game file
    buffer = Buffer.allocUnsafe(ENEMY_GROUP_SIZE);
    writeEnemyGroup(<ENEMYGROUP>pGroup.pEnemyGroup, buffer);

    uiNumBytesWritten = FileWrite(hFile, buffer, ENEMY_GROUP_SIZE);
    if (uiNumBytesWritten != ENEMY_GROUP_SIZE) {
      // Error Writing size of L.L. to disk
      return false;
    }

    return true;
  }

  // Loads the enemy group struct from the saved game file
  function LoadEnemyGroupStructFromSavedGame(
    hFile: HWFILE,
    pGroup: GROUP,
  ): boolean {
    let uiNumBytesRead: UINT32 = 0;
    let pEnemyGroup: ENEMYGROUP;
    let buffer: Buffer;

    // Alllocate memory for the enemy struct
    pEnemyGroup = createEnemyGroup();

    // Load the enemy struct
    buffer = Buffer.allocUnsafe(ENEMY_GROUP_SIZE);

    uiNumBytesRead = FileRead(hFile, buffer, ENEMY_GROUP_SIZE);
    if (uiNumBytesRead != ENEMY_GROUP_SIZE) {
      // Error Writing size of L.L. to disk
      return false;
    }

    readEnemyGroup(pEnemyGroup, buffer);

    // Assign the struct to the group list
    pGroup.pEnemyGroup = pEnemyGroup;

    return true;
  }

  function CheckMembersOfMvtGroupAndComplainAboutBleeding(
    pSoldier: SOLDIERTYPE,
  ): void {
    // run through members of group
    let ubGroupId: UINT8 = pSoldier.ubGroupID;
    let pGroup: GROUP;
    let pPlayer: PLAYERGROUP | null;
    let pCurrentSoldier: SOLDIERTYPE;

    pGroup = GetGroup(ubGroupId);

    // valid group?
    if (pGroup == null) {
      return;
    }

    // player controlled group?
    if (pGroup.fPlayer == false) {
      return;
    }

    // make sure there are members in the group..if so, then run through and make each bleeder compain
    pPlayer = pGroup.pPlayerList;

    // is there a player list?
    if (pPlayer == null) {
      return;
    }

    BeginLoggingForBleedMeToos(true);

    while (pPlayer) {
      pCurrentSoldier = pPlayer.pSoldier;

      if (pCurrentSoldier.bBleeding > 0) {
        // complain about bleeding
        TacticalCharacterDialogue(
          pCurrentSoldier,
          Enum202.QUOTE_STARTING_TO_BLEED,
        );
      }
      pPlayer = pPlayer.next;
    }

    BeginLoggingForBleedMeToos(false);
  }

  function SaveWayPointList(hFile: HWFILE, pGroup: GROUP): boolean {
    let cnt: UINT32 = 0;
    let uiNumberOfWayPoints: UINT32 = 0;
    let uiNumBytesWritten: UINT32 = 0;
    let pWayPoints: WAYPOINT | null = pGroup.pWaypoints;
    let buffer: Buffer;

    // loop trhough and count all the node in the waypoint list
    while (pWayPoints != null) {
      uiNumberOfWayPoints++;
      pWayPoints = pWayPoints.next;
    }

    // Save the number of waypoints
    buffer = Buffer.allocUnsafe(4);
    buffer.writeUInt32LE(uiNumberOfWayPoints, 0);

    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) {
      // Error Writing size of L.L. to disk
      return false;
    }

    if (uiNumberOfWayPoints) {
      buffer = Buffer.allocUnsafe(WAYPOINT_SIZE);

      pWayPoints = pGroup.pWaypoints;
      for (cnt = 0; cnt < uiNumberOfWayPoints; cnt++) {
        // Save the waypoint node
        writeWaypoint(<WAYPOINT>pWayPoints, buffer);
        uiNumBytesWritten = FileWrite(hFile, buffer, WAYPOINT_SIZE);
        if (uiNumBytesWritten != WAYPOINT_SIZE) {
          // Error Writing size of L.L. to disk
          return false;
        }

        // Advance to the next waypoint
        pWayPoints = (<WAYPOINT>pWayPoints).next;
      }
    }

    return true;
  }

  function LoadWayPointList(hFile: HWFILE, pGroup: GROUP): boolean {
    let cnt: UINT32 = 0;
    let uiNumberOfWayPoints: UINT32 = 0;
    let uiNumBytesRead: UINT32 = 0;
    let pWayPoints: WAYPOINT | null = pGroup.pWaypoints;
    let pTemp: WAYPOINT;
    let buffer: Buffer;

    // Load the number of waypoints
    buffer = Buffer.allocUnsafe(4);
    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) {
      // Error Writing size of L.L. to disk
      return false;
    }

    uiNumberOfWayPoints = buffer.readUInt32LE(0);

    if (uiNumberOfWayPoints) {
      buffer = Buffer.allocUnsafe(WAYPOINT_SIZE);

      pWayPoints = pGroup.pWaypoints;
      for (cnt = 0; cnt < uiNumberOfWayPoints; cnt++) {
        // Allocate memory for the node
        pTemp = createWaypoint();

        // Load the waypoint node
        uiNumBytesRead = FileRead(hFile, buffer, WAYPOINT_SIZE);
        if (uiNumBytesRead != WAYPOINT_SIZE) {
          // Error Writing size of L.L. to disk
          return false;
        }

        readWaypoint(pTemp, buffer);

        pTemp.next = null;

        // if its the first node
        if (!pWayPoints) {
          pGroup.pWaypoints = pTemp;
          pWayPoints = pTemp;
        } else {
          pWayPoints.next = pTemp;

          // Advance to the next waypoint
          pWayPoints = pWayPoints.next;
        }
      }
    } else pGroup.pWaypoints = null;

    return true;
  }

  export function CalculateGroupRetreatSector(pGroup: GROUP): void {
    let pSector: SECTORINFO;
    let uiSectorID: UINT32;

    uiSectorID = SECTOR(pGroup.ubSectorX, pGroup.ubSectorY);
    pSector = SectorInfo[uiSectorID];

    if (
      pSector.ubTraversability[Enum186.NORTH_STRATEGIC_MOVE] !=
        Enum127.GROUNDBARRIER &&
      pSector.ubTraversability[Enum186.NORTH_STRATEGIC_MOVE] !=
        Enum127.EDGEOFWORLD
    ) {
      pGroup.ubPrevX = pGroup.ubSectorX;
      pGroup.ubPrevY = pGroup.ubSectorY - 1;
    } else if (
      pSector.ubTraversability[Enum186.EAST_STRATEGIC_MOVE] !=
        Enum127.GROUNDBARRIER &&
      pSector.ubTraversability[Enum186.EAST_STRATEGIC_MOVE] !=
        Enum127.EDGEOFWORLD
    ) {
      pGroup.ubPrevX = pGroup.ubSectorX + 1;
      pGroup.ubPrevY = pGroup.ubSectorY;
    } else if (
      pSector.ubTraversability[Enum186.WEST_STRATEGIC_MOVE] !=
        Enum127.GROUNDBARRIER &&
      pSector.ubTraversability[Enum186.WEST_STRATEGIC_MOVE] !=
        Enum127.EDGEOFWORLD
    ) {
      pGroup.ubPrevX = pGroup.ubSectorX - 1;
      pGroup.ubPrevY = pGroup.ubSectorY;
    } else if (
      pSector.ubTraversability[Enum186.SOUTH_STRATEGIC_MOVE] !=
        Enum127.GROUNDBARRIER &&
      pSector.ubTraversability[Enum186.SOUTH_STRATEGIC_MOVE] !=
        Enum127.EDGEOFWORLD
    ) {
      pGroup.ubPrevX = pGroup.ubSectorX;
      pGroup.ubPrevY = pGroup.ubSectorY + 1;
    } else {
      AssertMsg(
        0,
        FormatString(
          "Player group cannot retreat from sector %s%d ",
          String.fromCharCode(pGroup.ubSectorY + "A".charCodeAt(0) - 1),
          pGroup.ubSectorX,
        ),
      );
      return;
    }
    if (pGroup.fPlayer) {
      // update the previous sector for the mercs
      let pPlayer: PLAYERGROUP | null;
      pPlayer = pGroup.pPlayerList;
      while (pPlayer) {
        pPlayer.pSoldier.ubPrevSectorID = SECTOR(
          pGroup.ubPrevX,
          pGroup.ubPrevY,
        );
        pPlayer = pPlayer.next;
      }
    }
  }

  // Called when all checks have been made for the group (if possible to retreat, etc.)  This function
  // blindly determines where to move the group.
  export function RetreatGroupToPreviousSector(pGroup: GROUP): void {
    let ubSector: UINT8;
    let ubDirection: UINT8 = 255;
    let iVehId: INT32;
    let dx: INT32;
    let dy: INT32;
    Assert(pGroup);
    AssertMsg(
      !pGroup.fBetweenSectors,
      "Can't retreat a group when between sectors!",
    );

    if (pGroup.ubPrevX != 16 || pGroup.ubPrevY != 16) {
      // Group has a previous sector
      pGroup.ubNextX = pGroup.ubPrevX;
      pGroup.ubNextY = pGroup.ubPrevY;

      // Determine the correct direction.
      dx = pGroup.ubNextX - pGroup.ubSectorX;
      dy = pGroup.ubNextY - pGroup.ubSectorY;
      if (dy == -1 && !dx) ubDirection = Enum186.NORTH_STRATEGIC_MOVE;
      else if (dx == 1 && !dy) ubDirection = Enum186.EAST_STRATEGIC_MOVE;
      else if (dy == 1 && !dx) ubDirection = Enum186.SOUTH_STRATEGIC_MOVE;
      else if (dx == -1 && !dy) ubDirection = Enum186.WEST_STRATEGIC_MOVE;
      else {
        AssertMsg(
          0,
          FormatString(
            "Player group attempting illegal retreat from %s%d to %s%d.",
            String.fromCharCode(pGroup.ubSectorY + "A".charCodeAt(0) - 1),
            pGroup.ubSectorX,
            String.fromCharCode(pGroup.ubNextY + "A".charCodeAt(0) - 1),
            pGroup.ubNextX,
          ),
        );
      }
    } else {
      // Group doesn't have a previous sector.  Create one, then recurse
      CalculateGroupRetreatSector(pGroup);
      RetreatGroupToPreviousSector(pGroup);
    }

    // Calc time to get to next waypoint...
    ubSector = SECTOR(pGroup.ubSectorX, pGroup.ubSectorY);
    pGroup.uiTraverseTime = GetSectorMvtTimeForGroup(
      ubSector,
      ubDirection,
      pGroup,
    );
    if (pGroup.uiTraverseTime == 0xffffffff) {
      AssertMsg(
        0,
        FormatString(
          "Group %d (%s) attempting illegal move from %s%d to %s%d (%s).",
          pGroup.ubGroupID,
          pGroup.fPlayer ? "Player" : "AI",
          String.fromCharCode(pGroup.ubSectorY + "A".charCodeAt(0)),
          pGroup.ubSectorX,
          String.fromCharCode(pGroup.ubNextY + "A".charCodeAt(0)),
          pGroup.ubNextX,
          gszTerrain[SectorInfo[ubSector].ubTraversability[ubDirection]],
        ),
      );
    }

    if (!pGroup.uiTraverseTime) {
      // Because we are in the strategic layer, don't make the arrival instantaneous (towns).
      pGroup.uiTraverseTime = 5;
    }

    SetGroupArrivalTime(pGroup, GetWorldTotalMin() + pGroup.uiTraverseTime);
    pGroup.fBetweenSectors = true;
    pGroup.uiFlags |= GROUPFLAG_JUST_RETREATED_FROM_BATTLE;

    if (pGroup.fVehicle == true) {
      // vehicle, set fact it is between sectors too
      if ((iVehId = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID)) != -1) {
        pVehicleList[iVehId].fBetweenSectors = true;
      }
    }

    // Post the event!
    if (
      !AddStrategicEvent(
        Enum132.EVENT_GROUP_ARRIVAL,
        pGroup.uiArrivalTime,
        pGroup.ubGroupID,
      )
    )
      AssertMsg(0, "Failed to add movement event.");

    // For the case of player groups, we need to update the information of the soldiers.
    if (pGroup.fPlayer) {
      let curr: PLAYERGROUP | null;
      curr = pGroup.pPlayerList;

      if (pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY > GetWorldTotalMin()) {
        AddStrategicEvent(
          Enum132.EVENT_GROUP_ABOUT_TO_ARRIVE,
          pGroup.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY,
          pGroup.ubGroupID,
        );
      }

      while (curr) {
        curr.pSoldier.fBetweenSectors = true;

        // OK, Remove the guy from tactical engine!
        RemoveSoldierFromTacticalSector(curr.pSoldier, true);

        curr = curr.next;
      }
    }
  }

  export function FindMovementGroupInSector(
    ubSectorX: UINT8,
    ubSectorY: UINT8,
    fPlayer: boolean,
  ): GROUP | null {
    let pGroup: GROUP | null;
    pGroup = gpGroupList;
    while (pGroup) {
      if (pGroup.fPlayer) {
        // NOTE: These checks must always match the INVOLVED group checks in PBI!!!
        if (
          fPlayer &&
          pGroup.ubGroupSize &&
          !pGroup.fBetweenSectors &&
          pGroup.ubSectorX == ubSectorX &&
          pGroup.ubSectorY == ubSectorY &&
          !pGroup.ubSectorZ &&
          !GroupHasInTransitDeadOrPOWMercs(pGroup) &&
          (!IsGroupTheHelicopterGroup(pGroup) || !fHelicopterIsAirBorne)
        ) {
          return pGroup;
        }
      } else if (
        !fPlayer &&
        pGroup.ubSectorX == ubSectorX &&
        pGroup.ubSectorY == ubSectorY &&
        !pGroup.ubSectorZ
      )
        return pGroup;

      pGroup = pGroup.next;
    }
    return null;
  }

  export function GroupAtFinalDestination(pGroup: GROUP): boolean {
    let wp: WAYPOINT | null;

    if (pGroup.ubMoveType != Enum185.ONE_WAY) return false; // Group will continue to patrol, hence never stops.

    // Determine if we are at the final waypoint.
    wp = GetFinalWaypoint(pGroup);

    if (!wp) {
      // no waypoints, so the group is at it's destination.  This happens when
      // an enemy group is created in the destination sector (which is legal for
      // staging groups which always stop adjacent to their real sector destination)
      return true;
    }

    // if we're there
    if (pGroup.ubSectorX == wp.x && pGroup.ubSectorY == wp.y) {
      return true;
    }

    return false;
  }

  export function GetFinalWaypoint(pGroup: GROUP): WAYPOINT | null {
    let wp: WAYPOINT | null;

    Assert(pGroup);

    // Make sure they're on a one way route, otherwise this request is illegal
    Assert(pGroup.ubMoveType == Enum185.ONE_WAY);

    wp = pGroup.pWaypoints;
    if (wp) {
      while (wp.next) {
        wp = wp.next;
      }
    }

    return wp;
  }

  // The sector supplied resets ALL enemy groups in the sector specified.  See comments in
  // ResetMovementForEnemyGroup() for more details on what the resetting does.
  export function ResetMovementForEnemyGroupsInLocation(
    ubSectorX: UINT8,
    ubSectorY: UINT8,
  ): void {
    let pGroup: GROUP | null;
    let next: GROUP | null;
    let sSectorX: INT16;
    let sSectorY: INT16;
    let sSectorZ: INT16;

    ({ sSectorX, sSectorY, sSectorZ } = GetCurrentBattleSectorXYZ());
    pGroup = gpGroupList;
    while (pGroup) {
      next = pGroup.next;
      if (!pGroup.fPlayer) {
        if (pGroup.ubSectorX == sSectorX && pGroup.ubSectorY == sSectorY) {
          ResetMovementForEnemyGroup(pGroup);
        }
      }
      pGroup = next;
    }
  }

  // This function is used to reset the location of the enemy group if they are
  // currently between sectors.  If they were 50% of the way from sector A10 to A11,
  // then after this function is called, then that group would be 0% of the way from
  // sector A10 to A11.  In no way does this function effect the strategic path for
  // the group.
  function ResetMovementForEnemyGroup(pGroup: GROUP): void {
    // Validate that the group is an enemy group and that it is moving.
    if (pGroup.fPlayer) {
      return;
    }
    if (!pGroup.fBetweenSectors || !pGroup.ubNextX || !pGroup.ubNextY) {
      // Reset the group's assignment by moving it to the group's original sector as it's pending group.
      RepollSAIGroup(pGroup);
      return;
    }

    // Cancel the event that is posted.
    DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pGroup.ubGroupID);

    // Calculate the new arrival time (all data pertaining to movement should be valid)
    if (pGroup.uiTraverseTime > 400) {
      // The group was likely sleeping which makes for extremely long arrival times.  Shorten it
      // arbitrarily.  Doesn't really matter if this isn't accurate.
      pGroup.uiTraverseTime = 90;
    }
    SetGroupArrivalTime(pGroup, GetWorldTotalMin() + pGroup.uiTraverseTime);

    // Add a new event
    AddStrategicEvent(
      Enum132.EVENT_GROUP_ARRIVAL,
      pGroup.uiArrivalTime,
      pGroup.ubGroupID,
    );
  }

  export function UpdatePersistantGroupsFromOldSave(
    uiSavedGameVersion: UINT32,
  ): void {
    let pGroup: GROUP | null = null;
    let fDone: boolean = false;
    let cnt: INT32;
    let fDoChange: boolean = false;

    // ATE: If saved game is < 61, we need to do something better!
    if (uiSavedGameVersion < 61) {
      for (cnt = 0; cnt < 55; cnt++) {
        // create mvt groups
        pGroup = GetGroup(cnt);

        if (pGroup != null && pGroup.fPlayer) {
          pGroup.fPersistant = true;
        }
      }

      fDoChange = true;
    } else if (uiSavedGameVersion < 63) {
      for (cnt = 0; cnt < Enum275.NUMBER_OF_SQUADS; cnt++) {
        // create mvt groups
        pGroup = GetGroup(SquadMovementGroups[cnt]);

        if (pGroup != null) {
          pGroup.fPersistant = true;
        }
      }

      for (cnt = 0; cnt < MAX_VEHICLES; cnt++) {
        pGroup = GetGroup(gubVehicleMovementGroups[cnt]);

        if (pGroup != null) {
          pGroup.fPersistant = true;
        }
      }

      fDoChange = true;
    }

    if (fDoChange) {
      // Remove all empty groups
      fDone = false;
      while (!fDone) {
        pGroup = gpGroupList;
        while (pGroup) {
          if (!pGroup.ubGroupSize && !pGroup.fPersistant) {
            RemovePGroup(pGroup);
            break;
          }
          pGroup = pGroup.next;
          if (!pGroup) {
            fDone = true;
          }
        }
      }
    }
  }

  // Determines if any particular group WILL be moving through a given sector given it's current
  // position in the route and the pGroup->ubMoveType must be ONE_WAY.  If the group is currently
  // IN the sector, or just left the sector, it will return FALSE.
  export function GroupWillMoveThroughSector(
    pGroup: GROUP,
    ubSectorX: UINT8,
    ubSectorY: UINT8,
  ): boolean {
    let wp: WAYPOINT | null;
    let i: INT32;
    let dx: INT32;
    let dy: INT32;
    let ubOrigX: UINT8;
    let ubOrigY: UINT8;

    Assert(pGroup);
    AssertMsg(
      pGroup.ubMoveType == Enum185.ONE_WAY,
      FormatString(
        "GroupWillMoveThroughSector() -- Attempting to test group with an invalid move type.  ubGroupID: %d, ubMoveType: %d, sector: %s%d -- KM:0",
        pGroup.ubGroupID,
        pGroup.ubMoveType,
        String.fromCharCode(pGroup.ubSectorY + "A".charCodeAt(0) - 1),
        pGroup.ubSectorX,
      ),
    );

    // Preserve the original sector values, as we will be temporarily modifying the group's ubSectorX/Y values
    // as we traverse the waypoints.
    ubOrigX = pGroup.ubSectorX;
    ubOrigY = pGroup.ubSectorY;

    i = pGroup.ubNextWaypointID;
    wp = pGroup.pWaypoints;

    if (!wp) {
      // This is a floating group!?
      return false;
    }
    while (i--) {
      // Traverse through the waypoint list to the next waypoint ID
      Assert(wp);
      wp = (<WAYPOINT>wp).next;
    }
    Assert(wp);

    while (wp) {
      while (pGroup.ubSectorX != wp.x || pGroup.ubSectorY != wp.y) {
        // We now have the correct waypoint.
        // Analyse the group and determine which direction it will move from the current sector.
        dx = wp.x - pGroup.ubSectorX;
        dy = wp.y - pGroup.ubSectorY;
        if (dx && dy) {
          // Can't move diagonally!
          AssertMsg(
            0,
            FormatString(
              "GroupWillMoveThroughSector() -- Attempting to process waypoint in a diagonal direction from sector %s%d to sector %s%d for group at sector %s%d -- KM:0",
              String.fromCharCode(pGroup.ubSectorY + "A".charCodeAt(0)),
              pGroup.ubSectorX,
              String.fromCharCode(wp.y + "A".charCodeAt(0) - 1),
              wp.x,
              String.fromCharCode(ubOrigY + "A".charCodeAt(0) - 1),
              ubOrigX,
            ),
          );
          pGroup.ubSectorX = ubOrigX;
          pGroup.ubSectorY = ubOrigY;
          return true;
        }
        if (!dx && !dy) {
          // Can't move to position currently at!
          AssertMsg(
            0,
            FormatString(
              "GroupWillMoveThroughSector() -- Attempting to process same waypoint at %s%d for group at %s%d -- KM:0",
              String.fromCharCode(wp.y + "A".charCodeAt(0) - 1),
              wp.x,
              String.fromCharCode(ubOrigY + "A".charCodeAt(0) - 1),
              ubOrigX,
            ),
          );
          pGroup.ubSectorX = ubOrigX;
          pGroup.ubSectorY = ubOrigY;
          return true;
        }
        // Clip dx/dy value so that the move is for only one sector.
        if (dx >= 1) {
          dx = 1;
        } else if (dy >= 1) {
          dy = 1;
        } else if (dx <= -1) {
          dx = -1;
        } else if (dy <= -1) {
          dy = -1;
        } else {
          Assert(0);
          pGroup.ubSectorX = ubOrigX;
          pGroup.ubSectorY = ubOrigY;
          return true;
        }
        // Advance the sector value
        pGroup.ubSectorX = dx + pGroup.ubSectorX;
        pGroup.ubSectorY = dy + pGroup.ubSectorY;
        // Check to see if it the sector we are checking to see if this group will be moving through.
        if (pGroup.ubSectorX == ubSectorX && pGroup.ubSectorY == ubSectorY) {
          pGroup.ubSectorX = ubOrigX;
          pGroup.ubSectorY = ubOrigY;
          return true;
        }
      }
      // Advance to the next waypoint.
      wp = wp.next;
    }
    pGroup.ubSectorX = ubOrigX;
    pGroup.ubSectorY = ubOrigY;
    return false;
  }

  function CalculateFuelCostBetweenSectors(
    ubSectorID1: UINT8,
    ubSectorID2: UINT8,
  ): INT16 {
    return 0;
  }

  export function VehicleHasFuel(pSoldier: SOLDIERTYPE): boolean {
    Assert(pSoldier.uiStatusFlags & SOLDIER_VEHICLE);
    if (pSoldier.sBreathRed) {
      return true;
    }
    return false;
  }

  function VehicleFuelRemaining(pSoldier: SOLDIERTYPE): INT16 {
    Assert(pSoldier.uiStatusFlags & SOLDIER_VEHICLE);
    return pSoldier.sBreathRed;
  }

  function SpendVehicleFuel(pSoldier: SOLDIERTYPE, sFuelSpent: INT16): boolean {
    Assert(pSoldier.uiStatusFlags & SOLDIER_VEHICLE);
    pSoldier.sBreathRed -= sFuelSpent;
    pSoldier.sBreathRed = Math.max(0, pSoldier.sBreathRed);
    pSoldier.bBreath = Math.trunc((pSoldier.sBreathRed + 99) / 100);
    return false;
  }

  export function AddFuelToVehicle(
    pSoldier: SOLDIERTYPE,
    pVehicle: SOLDIERTYPE,
  ): void {
    let pItem: OBJECTTYPE;
    let sFuelNeeded: INT16;
    let sFuelAvailable: INT16;
    let sFuelAdded: INT16;
    pItem = pSoldier.inv[Enum261.HANDPOS];
    if (pItem.usItem != Enum225.GAS_CAN) {
      return;
    }
    // Soldier has gas can, so now add gas to vehicle while removing gas from the gas can.
    // A gas can with 100 status translate to 50% of a fillup.
    if (pVehicle.sBreathRed == 10000) {
      // Message for vehicle full?
      return;
    }
    if (pItem.bStatus) {
      // Fill 'er up.
      sFuelNeeded = 10000 - pVehicle.sBreathRed;
      sFuelAvailable = pItem.bStatus[0] * 50;
      sFuelAdded = Math.min(sFuelNeeded, sFuelAvailable);
      // Add to vehicle
      pVehicle.sBreathRed += sFuelAdded;
      pVehicle.bBreath = Math.trunc(pVehicle.sBreathRed / 100);
      // Subtract from item
      pItem.bStatus[0] = pItem.bStatus[0] - Math.trunc(sFuelAdded / 50);
      if (!pItem.bStatus[0]) {
        // Gas can is empty, so toast the item.
        DeleteObj(pItem);
      }
    }
  }

  function ReportVehicleOutOfGas(
    iVehicleID: INT32,
    ubSectorX: UINT8,
    ubSectorY: UINT8,
  ): void {
    let str: string /* UINT16[255] */;
    // Report that the vehicle that just arrived is out of gas.
    str = swprintf(
      gzLateLocalizedString[5],
      pVehicleStrings[pVehicleList[iVehicleID].ubVehicleType],
      String.fromCharCode(ubSectorY + "A".charCodeAt(0) - 1),
      ubSectorX,
    );
    DoScreenIndependantMessageBox(str, MSG_BOX_FLAG_OK, null);
  }

  function SetLocationOfAllPlayerSoldiersInGroup(
    pGroup: GROUP,
    sSectorX: INT16,
    sSectorY: INT16,
    bSectorZ: INT8,
  ): void {
    let pPlayer: PLAYERGROUP | null = null;
    let pSoldier: SOLDIERTYPE;

    pPlayer = pGroup.pPlayerList;
    while (pPlayer) {
      pSoldier = pPlayer.pSoldier;

      if (pSoldier != null) {
        pSoldier.sSectorX = sSectorX;
        pSoldier.sSectorY = sSectorY;
        pSoldier.bSectorZ = bSectorZ;
      }

      pPlayer = pPlayer.next;
    }

    // if it's a vehicle
    if (pGroup.fVehicle) {
      let iVehicleId: INT32 = -1;
      let pVehicle: VEHICLETYPE;

      iVehicleId = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID);
      Assert(iVehicleId != -1);

      pVehicle = pVehicleList[iVehicleId];

      pVehicle.sSectorX = sSectorX;
      pVehicle.sSectorY = sSectorY;
      pVehicle.sSectorZ = bSectorZ;

      // if it ain't the chopper
      if (iVehicleId != iHelicopterVehicleId) {
        pSoldier = GetSoldierStructureForVehicle(iVehicleId);
        Assert(pSoldier);

        // these are apparently unnecessary, since vehicles are part of the pPlayerList in a vehicle group.  Oh well.
        pSoldier.sSectorX = sSectorX;
        pSoldier.sSectorY = sSectorY;
        pSoldier.bSectorZ = bSectorZ;
      }
    }
  }

  export function RandomizePatrolGroupLocation(pGroup: GROUP): void {
    // Make sure this is an enemy patrol group
    let wp: WAYPOINT | null;
    let ubMaxWaypointID: UINT8 = 0;
    let ubTotalWaypoints: UINT8;
    let ubChosen: UINT8;
    let ubSectorID: UINT8;

    // return; //disabled for now

    Assert(!pGroup.fPlayer);
    Assert(pGroup.ubMoveType == Enum185.ENDTOEND_FORWARDS);
    Assert((<ENEMYGROUP>pGroup.pEnemyGroup).ubIntention == Enum184.PATROL);

    // Search for the event, and kill it (if it exists)!
    DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pGroup.ubGroupID);

    // count the group's waypoints
    wp = pGroup.pWaypoints;
    while (wp) {
      if (wp.next) {
        ubMaxWaypointID++;
      }
      wp = wp.next;
    }
    // double it (they go back and forth) -- it's using zero based indices, so you have to add one to get the number of actual
    // waypoints in one direction.
    ubTotalWaypoints = ubMaxWaypointID * 2;

    // pick the waypoint they start at
    ubChosen = Random(ubTotalWaypoints);

    if (ubChosen >= ubMaxWaypointID) {
      // They chose a waypoint going in the reverse direction, so translate it
      // to an actual waypointID and switch directions.
      pGroup.ubMoveType = Enum185.ENDTOEND_BACKWARDS;
      pGroup.ubNextWaypointID = ubChosen - ubMaxWaypointID;
      ubChosen = pGroup.ubNextWaypointID + 1;
    } else {
      pGroup.ubMoveType = Enum185.ENDTOEND_FORWARDS;
      pGroup.ubNextWaypointID = ubChosen + 1;
    }

    // Traverse through the waypoint list again, to extract the location they are at.
    wp = pGroup.pWaypoints;
    while (wp && ubChosen) {
      ubChosen--;
      wp = wp.next;
    }

    // logic error if this fails.  We should have a null value for ubChosen
    Assert(!ubChosen);
    Assert(wp);

    // Move the group to the location of this chosen waypoint.
    ubSectorID = SECTOR((<WAYPOINT>wp).x, (<WAYPOINT>wp).y);

    // Set up this global var to randomize the arrival time of the group from
    // 1 minute to actual traverse time between the sectors.
    gfRandomizingPatrolGroup = true;

    SetEnemyGroupSector(pGroup, ubSectorID);
    InitiateGroupMovementToNextSector(pGroup);

    // Immediately turn off the flag once finished.
    gfRandomizingPatrolGroup = false;
  }

  // Whenever a player group arrives in a sector, and if bloodcats exist in the sector,
  // roll the dice to see if this will become an ambush random encounter.
  function TestForBloodcatAmbush(pGroup: GROUP): boolean {
    let pSector: SECTORINFO;
    let iHoursElapsed: INT32;
    let ubSectorID: UINT8;
    let ubChance: UINT8;
    let bDifficultyMaxCats: INT8;
    let bProgressMaxCats: INT8;
    let bNumMercMaxCats: INT8;
    let fAlreadyAmbushed: boolean = false;

    if (pGroup.ubSectorZ) {
      // no ambushes underground (no bloodcats either)
      return false;
    }

    ubSectorID = SECTOR(pGroup.ubSectorX, pGroup.ubSectorY);
    pSector = SectorInfo[ubSectorID];

    ubChance = 5 * gGameOptions.ubDifficultyLevel;

    iHoursElapsed = Math.trunc(
      (GetWorldTotalMin() - pSector.uiTimeCurrentSectorWasLastLoaded) / 60,
    );
    if (ubSectorID == Enum123.SEC_N5 || ubSectorID == Enum123.SEC_I16) {
      // These are special maps -- we use all placements.
      if (pSector.bBloodCats == -1) {
        pSector.bBloodCats = pSector.bBloodCatPlacements;
      } else if (
        pSector.bBloodCats > 0 &&
        pSector.bBloodCats < pSector.bBloodCatPlacements
      ) {
        // Slowly have them recuperate if we haven't been here for a long time.  The population will
        // come back up to the maximum if left long enough.
        let iBloodCatDiff: INT32;
        iBloodCatDiff = pSector.bBloodCatPlacements - pSector.bBloodCats;
        pSector.bBloodCats += Math.min(
          Math.trunc(iHoursElapsed / 18),
          iBloodCatDiff,
        );
      }
      // Once 0, the bloodcats will never recupe.
    } else if (pSector.bBloodCats == -1) {
      // If we haven't been ambushed by bloodcats yet...
      if (gfAutoAmbush || PreChance(ubChance)) {
        // randomly choose from 5-8, 7-10, 9-12 bloodcats based on easy, normal, and hard, respectively
        bDifficultyMaxCats = Random(4) + gGameOptions.ubDifficultyLevel * 2 + 3;

        // maximum of 3 bloodcats or 1 for every 6%, 5%, 4% progress based on easy, normal, and hard, respectively
        bProgressMaxCats = Math.max(
          Math.trunc(
            CurrentPlayerProgressPercentage() /
              (7 - gGameOptions.ubDifficultyLevel),
          ),
          3,
        );

        // make sure bloodcats don't outnumber mercs by a factor greater than 2
        bNumMercMaxCats =
          PlayerMercsInSector(
            pGroup.ubSectorX,
            pGroup.ubSectorY,
            pGroup.ubSectorZ,
          ) * 2;

        // choose the lowest number of cats calculated by difficulty and progress.
        pSector.bBloodCats = Math.min(bDifficultyMaxCats, bProgressMaxCats);

        if (gGameOptions.ubDifficultyLevel != Enum9.DIF_LEVEL_HARD) {
          // if not hard difficulty, ensure cats never outnumber mercs by a factor of 2 (min 3 bloodcats)
          pSector.bBloodCats = Math.min(pSector.bBloodCats, bNumMercMaxCats);
          pSector.bBloodCats = Math.max(pSector.bBloodCats, 3);
        }

        // ensure that there aren't more bloodcats than placements
        pSector.bBloodCats = Math.min(
          pSector.bBloodCats,
          pSector.bBloodCatPlacements,
        );
      }
    } else if (ubSectorID != Enum123.SEC_I16) {
      if (!gfAutoAmbush && PreChance(95)) {
        // already ambushed here.  But 5% chance of getting ambushed again!
        fAlreadyAmbushed = true;
      }
    }

    if (
      !fAlreadyAmbushed &&
      ubSectorID != Enum123.SEC_N5 &&
      pSector.bBloodCats > 0 &&
      !pGroup.fVehicle &&
      !NumEnemiesInSector(pGroup.ubSectorX, pGroup.ubSectorY)
    ) {
      if (
        ubSectorID != Enum123.SEC_I16 ||
        !gubFact[Enum170.FACT_PLAYER_KNOWS_ABOUT_BLOODCAT_LAIR]
      ) {
        gubEnemyEncounterCode = Enum164.BLOODCAT_AMBUSH_CODE;
      } else {
        gubEnemyEncounterCode = Enum164.ENTERING_BLOODCAT_LAIR_CODE;
      }
      return true;
    } else {
      gubEnemyEncounterCode = Enum164.NO_ENCOUNTER_CODE;
      return false;
    }
  }

  function NotifyPlayerOfBloodcatBattle(
    ubSectorX: UINT8,
    ubSectorY: UINT8,
  ): void {
    let str: string /* UINT16[256] */ = <string>(<unknown>undefined);
    let zTempString: string /* UINT16[128] */;
    if (gubEnemyEncounterCode == Enum164.BLOODCAT_AMBUSH_CODE) {
      zTempString = GetSectorIDString(ubSectorX, ubSectorY, 0, true);
      str = swprintf(pMapErrorString[12], zTempString);
    } else if (gubEnemyEncounterCode == Enum164.ENTERING_BLOODCAT_LAIR_CODE) {
      str = pMapErrorString[13];
    }

    if (guiCurrentScreen == Enum26.MAP_SCREEN) {
      // Force render mapscreen (need to update the position of the group before the dialog appears.
      fMapPanelDirty = true;
      MapScreenHandle();
      InvalidateScreen();
      RefreshScreen();
    }

    gfUsePersistantPBI = true;
    DoScreenIndependantMessageBox(
      str,
      MSG_BOX_FLAG_OK,
      TriggerPrebattleInterface,
    );
  }

  export function PlaceGroupInSector(
    ubGroupID: UINT8,
    sPrevX: INT16,
    sPrevY: INT16,
    sNextX: INT16,
    sNextY: INT16,
    bZ: INT8,
    fCheckForBattle: boolean,
  ): void {
    ClearMercPathsAndWaypointsForAllInGroup(GetGroup(ubGroupID));

    // change where they are and where they're going
    SetGroupPrevSectors(ubGroupID, sPrevX, sPrevY);
    SetGroupSectorValue(sPrevX, sPrevY, bZ, ubGroupID);
    SetGroupNextSectorValue(sNextX, sNextY, ubGroupID);

    // call arrive event
    GroupArrivedAtSector(ubGroupID, fCheckForBattle, false);
  }

  // ARM: centralized it so we can do a comprehensive Assert on it.  Causing problems with helicopter group!
  export function SetGroupArrivalTime(
    pGroup: GROUP,
    uiArrivalTime: UINT32,
  ): void {
    // PLEASE CENTRALIZE ALL CHANGES TO THE ARRIVAL TIMES OF GROUPS THROUGH HERE, ESPECIALLY THE HELICOPTER GROUP!!!

    // if this group is the helicopter group, we have to make sure that its arrival time is never greater than the sum
    // of the current time and its traverse time, 'cause those 3 values are used to plot its map position!  Because of this
    // the chopper groups must NEVER be delayed for any reason - it gets excluded from simultaneous arrival logic

    // Also note that non-chopper groups can currently be delayed such that this assetion would fail - enemy groups by
    // DelayEnemyGroupsIfPathsCross(), and player groups via PrepareGroupsForSimultaneousArrival().  So we skip the assert.

    if (IsGroupTheHelicopterGroup(pGroup)) {
      // make sure it's valid (NOTE: the correct traverse time must be set first!)
      if (uiArrivalTime > GetWorldTotalMin() + pGroup.uiTraverseTime) {
        AssertMsg(
          false,
          FormatString(
            "SetGroupArrivalTime: Setting invalid arrival time %d for group %d, WorldTime = %d, TraverseTime = %d",
            uiArrivalTime,
            pGroup.ubGroupID,
            GetWorldTotalMin(),
            pGroup.uiTraverseTime,
          ),
        );

        // fix it if assertions are disabled
        uiArrivalTime = GetWorldTotalMin() + pGroup.uiTraverseTime;
      }
    }

    pGroup.uiArrivalTime = uiArrivalTime;
  }

  // non-persistent groups should be simply removed instead!
  function CancelEmptyPersistentGroupMovement(pGroup: GROUP): void {
    Assert(pGroup);
    Assert(pGroup.ubGroupSize == 0);
    Assert(pGroup.fPersistant);

    // don't do this for vehicle groups - the chopper can keep flying empty,
    // while other vehicles still exist and teleport to nearest sector instead
    if (pGroup.fVehicle) {
      return;
    }

    // prevent it from arriving empty
    DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pGroup.ubGroupID);

    // release memory for its waypoints
    RemoveGroupWaypoints(pGroup.ubGroupID);

    pGroup.uiTraverseTime = 0;
    SetGroupArrivalTime(pGroup, 0);
    pGroup.fBetweenSectors = false;

    pGroup.ubPrevX = 0;
    pGroup.ubPrevY = 0;
    pGroup.ubSectorX = 0;
    pGroup.ubSectorY = 0;
    pGroup.ubNextX = 0;
    pGroup.ubNextY = 0;
  }

  // look for NPCs to stop for, anyone is too tired to keep going, if all OK rebuild waypoints & continue movement
  export function PlayerGroupArrivedSafelyInSector(
    pGroup: GROUP,
    fCheckForNPCs: boolean,
  ): void {
    let fPlayerPrompted: boolean = false;

    Assert(pGroup);
    Assert(pGroup.fPlayer);

    // if we haven't already checked for NPCs, and the group isn't empty
    if (
      fCheckForNPCs &&
      HandlePlayerGroupEnteringSectorToCheckForNPCsOfNote(pGroup) == true
    ) {
      // wait for player to answer/confirm prompt before doing anything else
      fPlayerPrompted = true;
    }

    // if we're not prompting the player
    if (!fPlayerPrompted) {
      // and we're not at the end of our road
      if (!GroupAtFinalDestination(pGroup)) {
        if (AnyMercInGroupCantContinueMoving(pGroup)) {
          // stop: clear their strategic movement (mercpaths and waypoints)
          ClearMercPathsAndWaypointsForAllInGroup(pGroup);

          // NOTE: Of course, it would be better if they continued onwards once everyone was ready to go again, in which
          // case we'd want to preserve the plotted path, but since the player can mess with the squads, etc.
          // in the mean-time, that just seemed to risky to try to support.  They could get into a fight and be too
          // injured to move, etc.  Basically, we'd have run a complete CanCharacterMoveInStrategic(0 check on all of them.
          // It's a wish list task for AM...

          // stop time so player can react if group was already on the move and suddenly halts
          StopTimeCompression();
        } else {
          // continue onwards: rebuild way points, initiate movement
          RebuildWayPointsForGroupPath(
            GetGroupMercPathPtr(pGroup),
            pGroup.ubGroupID,
          );
        }
      }
    }
  }

  function HandlePlayerGroupEnteringSectorToCheckForNPCsOfNote(
    pGroup: GROUP,
  ): boolean {
    let sSectorX: INT16 = 0;
    let sSectorY: INT16 = 0;
    let bSectorZ: INT8 = 0;
    let sString: string /* CHAR16[128] */;
    let wSectorName: string /* CHAR16[128] */;
    let sStrategicSector: INT16;

    Assert(pGroup);
    Assert(pGroup.fPlayer);

    // nobody in the group (perfectly legal with the chopper)
    if (pGroup.pPlayerList == null) {
      return false;
    }

    // chopper doesn't stop for NPCs
    if (IsGroupTheHelicopterGroup(pGroup)) {
      return false;
    }

    // if we're already in the middle of a prompt (possible with simultaneously group arrivals!), don't try to prompt again
    if (gpGroupPrompting != null) {
      return false;
    }

    // get the sector values
    sSectorX = pGroup.ubSectorX;
    sSectorY = pGroup.ubSectorY;
    bSectorZ = pGroup.ubSectorZ;

    // don't do this for underground sectors
    if (bSectorZ != 0) {
      return false;
    }

    // get the strategic sector value
    sStrategicSector = sSectorX + MAP_WORLD_X * sSectorY;

    // skip towns/pseudo-towns (anything that shows up on the map as being special)
    if (StrategicMap[sStrategicSector].bNameId != Enum135.BLANK_SECTOR) {
      return false;
    }

    // skip SAM-sites
    if (IsThisSectorASAMSector(sSectorX, sSectorY, bSectorZ)) {
      return false;
    }

    // check for profiled NPCs in sector
    if (
      WildernessSectorWithAllProfiledNPCsNotSpokenWith(
        sSectorX,
        sSectorY,
        bSectorZ,
      ) == false
    ) {
      return false;
    }

    // store the group ptr for use by the callback function
    gpGroupPrompting = pGroup;

    // build string for squad
    wSectorName = GetSectorIDString(sSectorX, sSectorY, bSectorZ, false);
    sString = swprintf(
      pLandMarkInSectorString[0],
      pGroup.pPlayerList.pSoldier.bAssignment + 1,
      wSectorName,
    );

    if (GroupAtFinalDestination(pGroup)) {
      // do an OK message box
      DoScreenIndependantMessageBox(
        sString,
        MSG_BOX_FLAG_OK,
        HandlePlayerGroupEnteringSectorToCheckForNPCsOfNoteCallback,
      );
    } else {
      // do a CONTINUE/STOP message box
      DoScreenIndependantMessageBox(
        sString,
        MSG_BOX_FLAG_CONTINUESTOP,
        HandlePlayerGroupEnteringSectorToCheckForNPCsOfNoteCallback,
      );
    }

    // wait, we're prompting the player
    return true;
  }

  function WildernessSectorWithAllProfiledNPCsNotSpokenWith(
    sSectorX: INT16,
    sSectorY: INT16,
    bSectorZ: INT8,
  ): boolean {
    let ubProfile: UINT8;
    let pProfile: MERCPROFILESTRUCT;
    let fFoundSomebody: boolean = false;

    for (ubProfile = FIRST_RPC; ubProfile < NUM_PROFILES; ubProfile++) {
      pProfile = gMercProfiles[ubProfile];

      // skip stiffs
      if (pProfile.bMercStatus == MERC_IS_DEAD || pProfile.bLife <= 0) {
        continue;
      }

      // skip vehicles
      if (
        ubProfile >= Enum268.PROF_HUMMER &&
        ubProfile <= Enum268.PROF_HELICOPTER
      ) {
        continue;
      }

      // in this sector?
      if (
        pProfile.sSectorX == sSectorX &&
        pProfile.sSectorY == sSectorY &&
        pProfile.bSectorZ == bSectorZ
      ) {
        // if we haven't talked to him yet, and he's not currently recruired/escorted by player (!)
        if (
          pProfile.ubLastDateSpokenTo == 0 &&
          !(
            pProfile.ubMiscFlags &
            (PROFILE_MISC_FLAG_RECRUITED | PROFILE_MISC_FLAG_EPCACTIVE)
          )
        ) {
          // then this is a guy we need to stop for...
          fFoundSomebody = true;
        } else {
          // already spoke to this guy, don't prompt about this sector again, regardless of status of other NPCs here
          // (although Hamous wanders around, he never shares the same wilderness sector as other important NPCs)
          return false;
        }
      }
    }

    return fFoundSomebody;
  }

  function HandlePlayerGroupEnteringSectorToCheckForNPCsOfNoteCallback(
    ubExitValue: UINT8,
  ): void {
    Assert(gpGroupPrompting);

    if (ubExitValue == MSG_BOX_RETURN_YES || ubExitValue == MSG_BOX_RETURN_OK) {
      // NPCs now checked, continue moving if appropriate
      PlayerGroupArrivedSafelyInSector(gpGroupPrompting, false);
    } else if (ubExitValue == MSG_BOX_RETURN_NO) {
      // stop here

      // clear their strategic movement (mercpaths and waypoints)
      ClearMercPathsAndWaypointsForAllInGroup(gpGroupPrompting);

      //		// if currently selected sector has nobody in it
      //		if ( PlayerMercsInSector( ( UINT8 ) sSelMapX, ( UINT8 ) sSelMapY, ( UINT8 ) iCurrentMapSectorZ ) == 0 )
      // New: ALWAYS make this sector strategically selected, even if there were mercs in the previously selected one
      {
        ChangeSelectedMapSector(
          gpGroupPrompting.ubSectorX,
          gpGroupPrompting.ubSectorY,
          gpGroupPrompting.ubSectorZ,
        );
      }

      StopTimeCompression();
    }

    gpGroupPrompting = <GROUP>(<unknown>null);

    fMapPanelDirty = true;
    fMapScreenBottomDirty = true;

    return;
  }

  export function DoesPlayerExistInPGroup(
    ubGroupID: UINT8,
    pSoldier: SOLDIERTYPE,
  ): boolean {
    let pGroup: GROUP;
    let curr: PLAYERGROUP | null;

    pGroup = GetGroup(ubGroupID);
    Assert(pGroup);

    curr = pGroup.pPlayerList;

    if (!curr) {
      return false;
    }

    while (curr) {
      // definately more than one node

      if (curr.pSoldier == pSoldier) {
        return true;
      }

      curr = curr.next;
    }

    // !curr
    return false;
  }

  export function GroupHasInTransitDeadOrPOWMercs(pGroup: GROUP): boolean {
    let pPlayer: PLAYERGROUP | null;

    pPlayer = pGroup.pPlayerList;
    while (pPlayer) {
      if (pPlayer.pSoldier) {
        if (
          pPlayer.pSoldier.bAssignment == Enum117.IN_TRANSIT ||
          pPlayer.pSoldier.bAssignment == Enum117.ASSIGNMENT_POW ||
          pPlayer.pSoldier.bAssignment == Enum117.ASSIGNMENT_DEAD
        ) {
          // yup!
          return true;
        }
      }

      pPlayer = pPlayer.next;
    }

    // nope
    return false;
  }

  function NumberMercsInVehicleGroup(pGroup: GROUP): UINT8 {
    let iVehicleID: INT32;
    iVehicleID = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID);
    Assert(iVehicleID != -1);
    if (iVehicleID != -1) {
      return GetNumberInVehicle(iVehicleID);
    }
    return 0;
  }
}
