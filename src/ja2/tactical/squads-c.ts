namespace ja2 {
  interface SAVE_SQUAD_INFO_STRUCT {
    uiID: INT16; // The soldiers ID
    sPadding: INT16[] /* [5] */;
  }

  function createSaveSquadInfoStruct(): SAVE_SQUAD_INFO_STRUCT {
    return {
      uiID: 0,
      sPadding: createArray(5, 0),
    };
  }

  const SAVE_SQUAD_INFO_STRUCT_SIZE = 12;

  function readSaveSquadInfoStruct(
    o: SAVE_SQUAD_INFO_STRUCT,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    o.uiID = buffer.readInt16LE(offset);
    offset += 2;
    offset = readIntArray(o.sPadding, buffer, offset, 2);
    return offset;
  }

  function writeSaveSquadInfoStruct(
    o: SAVE_SQUAD_INFO_STRUCT,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    offset = buffer.writeInt16LE(o.uiID, offset);
    offset = writeIntArray(o.sPadding, buffer, offset, 2);
    return offset;
  }

  // squad array
  export let Squad: SOLDIERTYPE[][] /* Pointer<SOLDIERTYPE>[NUMBER_OF_SQUADS][NUMBER_OF_SOLDIERS_PER_SQUAD] */ =
    createArrayFrom(Enum275.NUMBER_OF_SQUADS, () =>
      createArray(NUMBER_OF_SOLDIERS_PER_SQUAD, <SOLDIERTYPE>(<unknown>null)),
    );

  // list of dead guys for squads...in id values -> -1 means no one home
  export let sDeadMercs: INT16[][] /* [NUMBER_OF_SQUADS][NUMBER_OF_SOLDIERS_PER_SQUAD] */ =
    createArrayFrom(Enum275.NUMBER_OF_SQUADS, () =>
      createArray(NUMBER_OF_SOLDIERS_PER_SQUAD, 0),
    );

  // the movement group ids
  export let SquadMovementGroups: INT8[] /* [NUMBER_OF_SQUADS] */ = createArray(
    Enum275.NUMBER_OF_SQUADS,
    0,
  );

  let fExitingVehicleToSquad: boolean = false;

  export let iCurrentTacticalSquad: INT32 = Enum275.FIRST_SQUAD;

  export function InitSquads(): void {
    // init the squad lists to NULL ptrs.
    let iCounterB: INT32 = 0;
    let iCounter: INT32 = 0;
    let pGroup: GROUP;

    // null each list of ptrs.
    for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
      for (
        iCounterB = 0;
        iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD;
        iCounterB++
      ) {
        // squad, soldier
        Squad[iCounter][iCounterB] = <SOLDIERTYPE>(<unknown>null);
      }

      // create mvt groups
      SquadMovementGroups[iCounter] = CreateNewPlayerGroupDepartingFromSector(
        1,
        1,
      );

      // Set persistent....
      pGroup = GetGroup(SquadMovementGroups[iCounter]);
      pGroup.fPersistant = true;
    }

    for (let i = 0; i < Enum275.NUMBER_OF_SQUADS; i++) {
      sDeadMercs[i].fill(-1);
    }

    return;
  }

  export function IsThisSquadFull(bSquadValue: INT8): boolean {
    let iCounter: INT32 = 0;

    // run through entries in the squad list, make sure there is a free entry
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      // check this slot
      if (Squad[bSquadValue][iCounter] == null) {
        // a free slot found - not full
        return false;
      }
    }

    // no free slots - it's full
    return true;
  }

  export function GetFirstEmptySquad(): INT8 {
    let ubCounter: UINT8 = 0;

    for (ubCounter = 0; ubCounter < Enum275.NUMBER_OF_SQUADS; ubCounter++) {
      if (SquadIsEmpty(ubCounter) == true) {
        // empty squad, return value
        return ubCounter;
      }
    }

    // not found - none are completely empty (shouldn't ever happen!)
    Assert(false);
    return -1;
  }

  export function AddCharacterToSquad(
    pCharacter: SOLDIERTYPE,
    bSquadValue: INT8,
  ): boolean {
    let bCounter: INT8 = 0;
    let sX: INT16;
    let sY: INT16;
    let bZ: INT8;
    //	BOOLEAN fBetweenSectors = FALSE;
    let pGroup: GROUP | null;
    let fNewSquad: boolean;

    // add character to squad...return success or failure
    // run through list of people in squad, find first free slo

    if (fExitingVehicleToSquad) {
      return false;
    }

    // ATE: If any vehicle exists in this squad AND we're not set to
    // a driver or or passenger, when return false
    if (DoesVehicleExistInSquad(bSquadValue)) {
      // We're not allowing anybody to go on a vehicle if they are not passengers!
      // NB: We obviously need to make sure that REAL passengers have their
      // flags set before adding them to a squad!
      if (
        !(
          pCharacter.uiStatusFlags &
          (SOLDIER_PASSENGER | SOLDIER_DRIVER | SOLDIER_VEHICLE)
        )
      ) {
        return false;
      }
    }

    // if squad is on the move, can't add someone
    if (IsThisSquadOnTheMove(bSquadValue) == true) {
      // nope, go away now
      return false;
    }

    for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
      // check if on current squad and current slot?
      if (Squad[bSquadValue][bCounter] == pCharacter) {
        // 'successful of sorts, if there, then he's 'added'
        return true;
      }

      // free slot, add here
      if (Squad[bSquadValue][bCounter] == null) {
        // check if squad empty, if not check sector x,y,z are the same as this guys
        if (SquadIsEmpty(bSquadValue) == false) {
          ({ sX, sY, bZ } = GetLocationOfSquad(bSquadValue));

          // if not same, return false
          if (
            pCharacter.sSectorX != sX ||
            pCharacter.sSectorY != sY ||
            pCharacter.bSectorZ != bZ
          ) {
            return false;
          }
          // remove them
          RemoveCharacterFromSquads(pCharacter);

          //				fBetweenSectors =  Squad[ bSquadValue ][ 0 ]->fBetweenSectors;
        } else {
          // remove them
          RemoveCharacterFromSquads(pCharacter);
        }

        /*
                              if( fBetweenSectors == TRUE )
                              {
                                      pCharacter->fBetweenSectors = TRUE;
                              }
      */

        // copy path of squad to this char
        CopyPathOfSquadToCharacter(pCharacter, bSquadValue);

        // check if old mvt group
        if (pCharacter.ubGroupID != 0) {
          // in valid group, remove from that group
          RemovePlayerFromGroup(pCharacter.ubGroupID, pCharacter);

          // character not on a reserved group
          if (
            pCharacter.bAssignment >= Enum117.ON_DUTY &&
            pCharacter.bAssignment != Enum117.VEHICLE
          ) {
            // get the group from the character
            pGroup = GetGroup(pCharacter.ubGroupID);

            // if valid group, delete it
            if (pGroup) {
              RemoveGroupFromList(pGroup);
            }
          }
        }

        if (
          pCharacter.bAssignment == Enum117.VEHICLE &&
          pCharacter.iVehicleId == iHelicopterVehicleId &&
          pCharacter.iVehicleId != -1
        ) {
          // if creating a new squad from guys exiting the chopper
          fNewSquad = SquadIsEmpty(bSquadValue);

          RemoveSoldierFromHelicopter(pCharacter);

          AddPlayerToGroup(SquadMovementGroups[bSquadValue], pCharacter);
          SetGroupSectorValue(
            pCharacter.sSectorX,
            pCharacter.sSectorY,
            pCharacter.bSectorZ,
            SquadMovementGroups[bSquadValue],
          );
          pCharacter.ubGroupID = SquadMovementGroups[bSquadValue];

          // if we've just started a new squad
          if (fNewSquad) {
            // set mvt group for
            let pGroup: GROUP;

            // grab group
            pGroup = GetGroup(
              pVehicleList[iHelicopterVehicleId].ubMovementGroup,
            );
            Assert(pGroup);

            if (pGroup) {
              // set where it is and where it's going, then make it arrive there.  Don't check for battle
              PlaceGroupInSector(
                SquadMovementGroups[bSquadValue],
                pGroup.ubPrevX,
                pGroup.ubPrevY,
                pGroup.ubSectorX,
                pGroup.ubSectorY,
                pGroup.ubSectorZ,
                false,
              );
            }
          }
        } else if (
          pCharacter.bAssignment == Enum117.VEHICLE &&
          pCharacter.iVehicleId != -1
        ) {
          fExitingVehicleToSquad = true;
          // remove from vehicle
          TakeSoldierOutOfVehicle(pCharacter);
          fExitingVehicleToSquad = false;

          AddPlayerToGroup(SquadMovementGroups[bSquadValue], pCharacter);
          SetGroupSectorValue(
            pCharacter.sSectorX,
            pCharacter.sSectorY,
            pCharacter.bSectorZ,
            SquadMovementGroups[bSquadValue],
          );
          pCharacter.ubGroupID = SquadMovementGroups[bSquadValue];
        } else {
          AddPlayerToGroup(SquadMovementGroups[bSquadValue], pCharacter);
          SetGroupSectorValue(
            pCharacter.sSectorX,
            pCharacter.sSectorY,
            pCharacter.bSectorZ,
            SquadMovementGroups[bSquadValue],
          );
          pCharacter.ubGroupID = SquadMovementGroups[bSquadValue];
        }

        // assign here
        Squad[bSquadValue][bCounter] = pCharacter;

        if (pCharacter.bAssignment != bSquadValue) {
          // check to see if we should wake them up
          if (pCharacter.fMercAsleep) {
            // try to wake him up
            SetMercAwake(pCharacter, false, false);
          }
          SetTimeOfAssignmentChangeForMerc(pCharacter);
        }

        // set squad value
        ChangeSoldiersAssignment(pCharacter, bSquadValue);
        if (pCharacter.bOldAssignment < Enum117.ON_DUTY) {
          pCharacter.bOldAssignment = bSquadValue;
        }

        // if current tactical sqaud...upadte panel
        if (NumberOfPeopleInSquad(iCurrentTacticalSquad) == 0) {
          SetCurrentSquad(bSquadValue, true);
        }

        if (bSquadValue == iCurrentTacticalSquad) {
          CheckForAndAddMercToTeamPanel(Squad[iCurrentTacticalSquad][bCounter]);
        }

        if (pCharacter.ubID == gusSelectedSoldier) {
          SetCurrentSquad(bSquadValue, true);
        }

        return true;
      }
    }

    return false;
  }

  // find the first slot we can fit the guy in
  export function AddCharacterToAnySquad(pCharacter: SOLDIERTYPE): boolean {
    // add character to any squad, if character is assigned to a squad, returns TRUE
    let bCounter: INT8 = 0;
    let bFirstEmptySquad: INT8 = -1;

    // remove them from current squad
    RemoveCharacterFromSquads(pCharacter);

    // first look for a compatible NON-EMPTY squad (don't start new squad if we don't have to)
    for (bCounter = 0; bCounter < Enum275.NUMBER_OF_SQUADS; bCounter++) {
      if (SquadIsEmpty(bCounter) == false) {
        if (AddCharacterToSquad(pCharacter, bCounter) == true) {
          return true;
        }
      } else {
        if (bFirstEmptySquad == -1) {
          bFirstEmptySquad = bCounter;
        }
      }
    }

    // no non-empty compatible squads were found

    // try the first empty one (and there better be one)
    if (bFirstEmptySquad != -1) {
      if (AddCharacterToSquad(pCharacter, bFirstEmptySquad) == true) {
        return true;
      }
    }

    // should never happen!
    Assert(false);
    return false;
  }

  // find the first slot we can fit the guy in
  export function AddCharacterToUniqueSquad(pCharacter: SOLDIERTYPE): INT8 {
    // add character to any squad, if character is assigned to a squad, returns TRUE
    let bCounter: INT8 = 0;

    // check if character on a squad

    // remove them
    RemoveCharacterFromSquads(pCharacter);

    for (bCounter = 0; bCounter < Enum275.NUMBER_OF_SQUADS; bCounter++) {
      if (SquadIsEmpty(bCounter) == true) {
        if (AddCharacterToSquad(pCharacter, bCounter) == true) {
          return bCounter;
        }
      }
    }

    return -1;
  }

  export function SquadIsEmpty(bSquadValue: INT8): boolean {
    // run through this squad's slots and find if they ALL are empty
    let iCounter: INT32 = 0;

    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      if (Squad[bSquadValue][iCounter] != null) {
        return false;
      }
    }

    return true;
  }

  // find and remove characters from any squad
  export function RemoveCharacterFromSquads(pCharacter: SOLDIERTYPE): boolean {
    let iCounterA: INT32 = 0;
    let iCounter: INT32 = 0;
    let ubGroupId: UINT8 = 0;
    // find character and remove.. check characters in all squads

    // squad?
    for (iCounterA = 0; iCounterA < Enum275.NUMBER_OF_SQUADS; iCounterA++) {
      // slot?
      for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
        // check if on current squad and current slot?
        if (Squad[iCounterA][iCounter] == pCharacter) {
          // found and nulled
          Squad[iCounterA][iCounter] = <SOLDIERTYPE>(<unknown>null);

          // Release memory for his personal path, BUT DON'T CLEAR HIS GROUP'S PATH/WAYPOINTS (pass in groupID -1).
          // Just because one guy leaves a group is no reason to cancel movement for the rest of the group.
          pCharacter.pMercPath = <PathSt>(
            ClearStrategicPathList(pCharacter.pMercPath, -1)
          );

          // remove character from mvt group
          RemovePlayerFromGroup(SquadMovementGroups[iCounterA], pCharacter);

          // reset player mvt group id value
          pCharacter.ubGroupID = 0;

          if (
            pCharacter.fBetweenSectors &&
            pCharacter.uiStatusFlags & SOLDIER_VEHICLE
          ) {
            ubGroupId = CreateNewPlayerGroupDepartingFromSector(
              pCharacter.sSectorX,
              pCharacter.sSectorY,
            );

            // assign to a group
            AddPlayerToGroup(ubGroupId, pCharacter);
          }

          RebuildSquad(iCounterA);

          if (pCharacter.bLife == 0) {
            AddDeadCharacterToSquadDeadGuys(pCharacter, iCounterA);
          }

          // if we are not loading a saved game
          if (
            !(gTacticalStatus.uiFlags & LOADING_SAVED_GAME) &&
            guiCurrentScreen == Enum26.GAME_SCREEN
          ) {
            UpdateCurrentlySelectedMerc(pCharacter, iCounterA);
          }

          return true;
        }
      }
    }

    // not found
    return false;
  }

  function RemoveCharacterFromASquad(
    pCharacter: SOLDIERTYPE,
    bSquadValue: INT8,
  ): boolean {
    let iCounter: INT32 = 0;
    let iCounterA: INT32 = 0;

    // remove character from particular squad..return if successful
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      // check if on current squad and current slot?
      if (Squad[bSquadValue][iCounter] == pCharacter) {
        UpdateCurrentlySelectedMerc(pCharacter, bSquadValue);

        // found and nulled
        Squad[bSquadValue][iCounter] = <SOLDIERTYPE>(<unknown>null);

        // remove character from mvt group
        RemovePlayerFromGroup(SquadMovementGroups[bSquadValue], pCharacter);

        if (pCharacter.bLife == 0) {
          AddDeadCharacterToSquadDeadGuys(pCharacter, iCounterA);
        }

        RebuildSquad(bSquadValue);

        // found
        return true;
      }
    }

    // not found
    return false;
  }

  function IsCharacterInSquad(
    pCharacter: SOLDIERTYPE,
    bSquadValue: INT8,
  ): boolean {
    let iCounter: INT32 = 0;
    // find character in particular squad..return if successful
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      // check if on current squad and current slot?
      if (Squad[bSquadValue][iCounter] == pCharacter) {
        // found
        return true;
      }
    }

    // not found
    return false;
  }

  function SlotCharacterIsInSquad(
    pCharacter: SOLDIERTYPE,
    bSquadValue: INT8,
  ): INT8 {
    let bCounter: INT8 = 0;

    // find character in particular squad..return slot if successful, else -1
    for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
      // check if on current squad and current slot?
      if (Squad[bSquadValue][bCounter] == pCharacter) {
        // found
        return bCounter;
      }
    }

    // not found
    return -1;
  }

  export function SquadCharacterIsIn(pCharacter: SOLDIERTYPE): INT8 {
    // returns which squad character is in, -1 if none found
    let iCounterA: INT8 = 0;
    let iCounter: INT8 = 0;

    // squad?
    for (iCounterA = 0; iCounterA < Enum275.NUMBER_OF_SQUADS; iCounterA++) {
      // slot?
      for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
        // check if on current squad and current slot?
        if (Squad[iCounterA][iCounter] == pCharacter) {
          // return value
          return iCounterA;
        }
      }
    }

    // return failure
    return -1;
  }

  export function NumberOfPeopleInSquad(bSquadValue: INT8): INT8 {
    let bCounter: INT8 = 0;
    let bSquadCount: INT8 = 0;

    if (bSquadValue == NO_CURRENT_SQUAD) {
      return 0;
    }

    // find number of characters in particular squad.
    for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
      // valid slot?
      if (Squad[bSquadValue][bCounter] != null) {
        // yep
        bSquadCount++;
      }
    }

    // return number found
    return bSquadCount;
  }

  export function NumberOfNonEPCsInSquad(bSquadValue: INT8): INT8 {
    let bCounter: INT8 = 0;
    let bSquadCount: INT8 = 0;

    if (bSquadValue == NO_CURRENT_SQUAD) {
      return 0;
    }

    // find number of characters in particular squad.
    for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
      // valid slot?
      if (
        Squad[bSquadValue][bCounter] != null &&
        !AM_AN_EPC(Squad[bSquadValue][bCounter])
      ) {
        // yep
        bSquadCount++;
      }
    }

    // return number found
    return bSquadCount;
  }

  export function IsRobotControllerInSquad(bSquadValue: INT8): boolean {
    let bCounter: INT8 = 0;

    if (bSquadValue == NO_CURRENT_SQUAD) {
      return false;
    }

    // find number of characters in particular squad.
    for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
      // valid slot?
      if (
        Squad[bSquadValue][bCounter] != null &&
        ControllingRobot(Squad[bSquadValue][bCounter])
      ) {
        // yep
        return true;
      }
    }

    // return number found
    return false;
  }

  export function SectorSquadIsIn(
    bSquadValue: INT8,
  ): { sMapX: INT16; sMapY: INT16; sMapZ: INT16 } | null {
    // returns if there is anyone on the squad and what sector ( strategic ) they are in
    let bCounter: INT8 = 0;

    Assert(bSquadValue < Enum117.ON_DUTY);

    for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
      // if valid soldier, get current sector and return
      if (Squad[bSquadValue][bCounter] != null) {
        return {
          sMapX: Squad[bSquadValue][bCounter].sSectorX,
          sMapY: Squad[bSquadValue][bCounter].sSectorY,
          sMapZ: Squad[bSquadValue][bCounter].bSectorZ,
        };
      }
    }

    // return there is no squad
    return null;
  }

  function CopyPathOfSquadToCharacter(
    pCharacter: SOLDIERTYPE,
    bSquadValue: INT8,
  ): boolean {
    // copy path from squad to character
    let bCounter: INT8 = 0;

    for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
      if (
        Squad[bSquadValue][bCounter] != pCharacter &&
        Squad[bSquadValue][bCounter] != null
      ) {
        // valid character, copy paths
        pCharacter.pMercPath = CopyPaths(
          Squad[bSquadValue][bCounter].pMercPath,
          pCharacter.pMercPath,
        );

        // return success
        return true;
      }
    }

    // return failure
    return false;
  }

  export function CopyPathOfCharacterToSquad(
    pCharacter: SOLDIERTYPE,
    bSquadValue: INT8,
  ): boolean {
    // copy path of this character to members of squad
    let fSuccess: boolean = false;
    let bCounter: INT8 = 0;

    // anyone else on squad?
    if (NumberOfPeopleInSquad(bSquadValue) < 2) {
      // nope

      // return failure
      return false;
    }

    // copy each person on squad, skip this character
    for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
      if (
        Squad[bSquadValue][bCounter] != pCharacter &&
        Squad[bSquadValue][bCounter] != null
      ) {
        // valid character, copy paths

        // first empty path
        Squad[bSquadValue][bCounter].pMercPath = <PathSt>(
          ClearStrategicPathList(Squad[bSquadValue][bCounter].pMercPath, -1)
        );

        // then copy
        Squad[bSquadValue][bCounter].pMercPath = CopyPaths(
          pCharacter.pMercPath,
          Squad[bSquadValue][bCounter].pMercPath,
        );

        // successful at least once
        fSuccess = true;
      }
    }

    // return success?
    return fSuccess;
  }

  export function CurrentSquad(): INT32 {
    // returns which squad is current squad

    return iCurrentTacticalSquad;
  }

  export function SetCurrentSquad(
    iCurrentSquad: INT32,
    fForce: boolean,
  ): boolean {
    // set the current tactical squad
    let iCounter: INT32 = 0;

    // ARM: can't call SetCurrentSquad() in mapscreen, it calls SelectSoldier(), that will initialize interface panels!!!
    // ATE: Adjusted conditions a bit ( sometimes were not getting selected )
    if (
      guiCurrentScreen == Enum26.LAPTOP_SCREEN ||
      guiCurrentScreen == Enum26.MAP_SCREEN
    ) {
      return false;
    }

    // ATE; Added to allow us to have NO current squad
    if (iCurrentSquad == NO_CURRENT_SQUAD) {
      // set current squad and return success
      iCurrentTacticalSquad = iCurrentSquad;

      // cleat list
      RemoveAllPlayersFromSlot();

      // set all auto faces inactive
      SetAllAutoFacesInactive();

      return false;
    }

    // check if valid value passed
    if (iCurrentSquad >= Enum275.NUMBER_OF_SQUADS || iCurrentSquad < 0) {
      // no
      return false;
    }

    // check if squad is current
    if (iCurrentSquad == iCurrentTacticalSquad && !fForce) {
      return true;
    }

    // set current squad and return success
    iCurrentTacticalSquad = iCurrentSquad;

    // cleat list
    RemoveAllPlayersFromSlot();

    // set all auto faces inactive
    SetAllAutoFacesInactive();

    if (iCurrentTacticalSquad != NO_CURRENT_SQUAD) {
      for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
        if (Squad[iCurrentTacticalSquad][iCounter] != null) {
          // squad set, now add soldiers in
          CheckForAndAddMercToTeamPanel(Squad[iCurrentTacticalSquad][iCounter]);
        }
      }
    }

    // check if the currently selected guy is on this squad, if not, get the first one on the new squad
    if (gusSelectedSoldier != NO_SOLDIER) {
      if (Menptr[gusSelectedSoldier].bAssignment != iCurrentTacticalSquad) {
        // ATE: Changed this to FALSE for ackoledgement sounds.. sounds bad if just starting/entering sector..
        SelectSoldier(Squad[iCurrentTacticalSquad][0].ubID, false, true);
      }
    } else {
      // ATE: Changed this to FALSE for ackoledgement sounds.. sounds bad if just starting/entering sector..
      SelectSoldier(Squad[iCurrentTacticalSquad][0].ubID, false, true);
    }

    return true;
  }

  export function RebuildCurrentSquad(): void {
    // rebuilds current squad to reset faces in tactical
    let iCounter: INT32 = 0;
    let iCount: INT32 = 0;
    let pDeadSoldier: SOLDIERTYPE | null = null;

    // check if valid value passed
    if (
      iCurrentTacticalSquad >= Enum275.NUMBER_OF_SQUADS ||
      iCurrentTacticalSquad < 0
    ) {
      // no
      return;
    }

    // set default squad..just inc ase we no longer have a valid squad
    SetDefaultSquadOnSectorEntry(true);

    // cleat list
    RemoveAllPlayersFromSlot();

    // set all auto faces inactive
    SetAllAutoFacesInactive();

    gfPausedTacticalRenderInterfaceFlags = DIRTYLEVEL2;

    if (iCurrentTacticalSquad != NO_CURRENT_SQUAD) {
      for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
        if (Squad[iCurrentTacticalSquad][iCounter] != null) {
          // squad set, now add soldiers in
          CheckForAndAddMercToTeamPanel(Squad[iCurrentTacticalSquad][iCounter]);
        }
      }

      for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
        if (sDeadMercs[iCurrentTacticalSquad][iCounter] != -1) {
          pDeadSoldier = FindSoldierByProfileID(
            sDeadMercs[iCurrentTacticalSquad][iCounter],
            true,
          );

          if (pDeadSoldier) {
            // squad set, now add soldiers in
            CheckForAndAddMercToTeamPanel(pDeadSoldier);
          }
        }
      }
    }
  }

  export function ExamineCurrentSquadLights(): void {
    // rebuilds current squad to reset faces in tactical
    let iCounter: INT32 = 0;
    let ubLoop: UINT8;

    // OK, we should add lights for any guy currently bInSector who is not bad OKLIFE...
    ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    for (; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++) {
      if (MercPtrs[ubLoop].bInSector && MercPtrs[ubLoop].bLife >= OKLIFE) {
        PositionSoldierLight(MercPtrs[ubLoop]);
      }
    }

    // check if valid value passed
    // if( ( iCurrentTacticalSquad >= NUMBER_OF_SQUADS ) || ( iCurrentTacticalSquad < 0 ) )
    //{
    // no
    //	return;
    //}

    // for( iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++ )
    //{
    //	if(  Squad[ iCurrentTacticalSquad ][ iCounter ] != NULL )
    //	{
    //		PositionSoldierLight( Squad[ iCurrentTacticalSquad ][ iCounter ] );
    //	}
    //}
  }

  function GetSoldiersInSquad(
    iCurrentSquad: INT32,
    pSoldierArray: SOLDIERTYPE[] /* [] */,
  ): boolean {
    let iCounter: INT32 = 0;
    // will get the soldiertype pts for every merc in this squad

    // check if valid value passed
    if (iCurrentSquad >= Enum275.NUMBER_OF_SQUADS || iCurrentSquad < 0) {
      // no
      return false;
    }

    // copy pts values over
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      pSoldierArray[iCounter] = Squad[iCurrentSquad][iCounter];
    }

    return true;
  }

  export function IsSquadOnCurrentTacticalMap(iCurrentSquad: INT32): boolean {
    let iCounter: INT32 = 0;
    // check to see if this squad is on the current map

    // check if valid value passed
    if (iCurrentSquad >= Enum275.NUMBER_OF_SQUADS || iCurrentSquad < 0) {
      // no
      return false;
    }

    // go through memebrs of squad...if anyone on this map, return true
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      if (Squad[iCurrentSquad][iCounter] != null) {
        // ATE; Added more checks here for being in sector ( fBetweenSectors and SectorZ )
        if (
          Squad[iCurrentSquad][iCounter].sSectorX == gWorldSectorX &&
          Squad[iCurrentSquad][iCounter].sSectorY == gWorldSectorY &&
          Squad[iCurrentSquad][iCounter].bSectorZ == gbWorldSectorZ &&
          Squad[iCurrentSquad][iCounter].fBetweenSectors != true
        ) {
          return true;
        }
      }
    }

    return false;
  }

  export function SetDefaultSquadOnSectorEntry(fForce: boolean): void {
    let iCounter: INT32 = 0;
    // check if selected squad is in current sector, if so, do nothing, if not...first first case that they are

    if (IsSquadOnCurrentTacticalMap(iCurrentTacticalSquad) == true) {
      // is in sector, leave
      return;
    }

    // otherwise...

    // find first squad availiable
    for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
      if (IsSquadOnCurrentTacticalMap(iCounter) == true) {
        // squad in sector...set as current
        SetCurrentSquad(iCounter, fForce);

        return;
      }
    }

    // If here, set to no current squad
    SetCurrentSquad(NO_CURRENT_SQUAD, false);

    return;
  }

  export function GetLastSquadActive(): INT32 {
    // find id of last squad in the list with active mercs in it
    let iCounter: INT32 = 0;
    let iCounterB: INT32 = 0;
    let iLastSquad: INT32 = 0;

    for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
      for (
        iCounterB = 0;
        iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD;
        iCounterB++
      ) {
        if (Squad[iCounter][iCounterB] != null) {
          iLastSquad = iCounter;
        }
      }
    }

    return iLastSquad;
  }

  function SetSquadPositionBetweenSectors(
    ubNextX: UINT8,
    ubNextY: UINT8,
    ubPrevX: UINT8,
    ubPrevY: UINT8,
    uiTraverseTime: UINT32,
    uiArriveTime: UINT32,
    ubSquadValue: UINT8,
  ): void {
    // set mvt group position for squad for

    if (SquadMovementGroups[ubSquadValue] == 0) {
      return;
    }
    SetGroupPosition(
      ubNextX,
      ubNextY,
      ubPrevX,
      ubPrevY,
      uiTraverseTime,
      uiArriveTime,
      SquadMovementGroups[ubSquadValue],
    );

    return;
  }

  export function SaveSquadInfoToSavedGameFile(hFile: HWFILE): boolean {
    let sSquadSaveStruct: SAVE_SQUAD_INFO_STRUCT[][] /* [NUMBER_OF_SQUADS][NUMBER_OF_SOLDIERS_PER_SQUAD] */ =
      createArrayFrom(Enum275.NUMBER_OF_SQUADS, () =>
        createArrayFrom(
          NUMBER_OF_SOLDIERS_PER_SQUAD,
          createSaveSquadInfoStruct,
        ),
      );
    let uiNumBytesWritten: UINT32 = 0;
    let uiSaveSize: UINT32 = 0;
    // Reset the current squad info
    let iCounterB: INT32 = 0;
    let iCounter: INT32 = 0;
    let buffer: Buffer;

    for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
      for (
        iCounterB = 0;
        iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD;
        iCounterB++
      ) {
        if (Squad[iCounter][iCounterB])
          sSquadSaveStruct[iCounter][iCounterB].uiID =
            Squad[iCounter][iCounterB].ubID;
        else sSquadSaveStruct[iCounter][iCounterB].uiID = -1;
      }
    }

    // Save the squad info to the Saved Game File
    uiSaveSize =
      SAVE_SQUAD_INFO_STRUCT_SIZE *
      Enum275.NUMBER_OF_SQUADS *
      NUMBER_OF_SOLDIERS_PER_SQUAD;

    buffer = Buffer.allocUnsafe(uiSaveSize);
    for (let i = 0, offset = 0; i < sSquadSaveStruct.length; i++) {
      offset = writeObjectArray(
        sSquadSaveStruct[i],
        buffer,
        offset,
        writeSaveSquadInfoStruct,
      );
    }

    uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
    if (uiNumBytesWritten != uiSaveSize) {
      return false;
    }

    // Save all the squad movement id's
    buffer = Buffer.allocUnsafe(Enum275.NUMBER_OF_SQUADS);
    writeIntArray(SquadMovementGroups, buffer, 0, 1);

    uiNumBytesWritten = FileWrite(hFile, buffer, Enum275.NUMBER_OF_SQUADS);
    if (uiNumBytesWritten != Enum275.NUMBER_OF_SQUADS) {
      return false;
    }

    return true;
  }

  export function LoadSquadInfoFromSavedGameFile(hFile: HWFILE): boolean {
    let sSquadSaveStruct: SAVE_SQUAD_INFO_STRUCT[][] /* [NUMBER_OF_SQUADS][NUMBER_OF_SOLDIERS_PER_SQUAD] */ =
      createArrayFrom(Enum275.NUMBER_OF_SQUADS, () =>
        createArrayFrom(
          NUMBER_OF_SOLDIERS_PER_SQUAD,
          createSaveSquadInfoStruct,
        ),
      );
    let uiNumBytesRead: UINT32 = 0;
    let uiSaveSize: UINT32 = 0;
    let buffer: Buffer;

    // Reset the current squad info
    let iCounterB: INT32 = 0;
    let iCounter: INT32 = 0;

    // null each list of ptrs.
    for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
      for (
        iCounterB = 0;
        iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD;
        iCounterB++
      ) {
        // squad, soldier
        Squad[iCounter][iCounterB] = <SOLDIERTYPE>(<unknown>null);
      }
    }

    // Load in the squad info
    uiSaveSize =
      SAVE_SQUAD_INFO_STRUCT_SIZE *
      Enum275.NUMBER_OF_SQUADS *
      NUMBER_OF_SOLDIERS_PER_SQUAD;

    buffer = Buffer.allocUnsafe(uiSaveSize);
    uiNumBytesRead = FileRead(hFile, buffer, uiSaveSize);
    if (uiNumBytesRead != uiSaveSize) {
      return false;
    }

    for (let i = 0, offset = 0; i < sSquadSaveStruct.length; i++) {
      offset = readObjectArray(
        sSquadSaveStruct[i],
        buffer,
        offset,
        readSaveSquadInfoStruct,
      );
    }

    // Loop through the array loaded in
    for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
      for (
        iCounterB = 0;
        iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD;
        iCounterB++
      ) {
        if (sSquadSaveStruct[iCounter][iCounterB].uiID != -1)
          Squad[iCounter][iCounterB] =
            Menptr[sSquadSaveStruct[iCounter][iCounterB].uiID];
        else Squad[iCounter][iCounterB] = <SOLDIERTYPE>(<unknown>null);
      }
    }

    // Load in the Squad movement id's
    buffer = Buffer.allocUnsafe(Enum275.NUMBER_OF_SQUADS);
    uiNumBytesRead = FileRead(hFile, buffer, Enum275.NUMBER_OF_SQUADS);
    if (uiNumBytesRead != Enum275.NUMBER_OF_SQUADS) {
      return false;
    }

    readIntArray(SquadMovementGroups, buffer, 0, 1);

    return true;
  }

  export function GetLocationOfSquad(bSquadValue: INT8): {
    sX: INT16;
    sY: INT16;
    bZ: INT8;
  } {
    let sX: INT16 = <INT16>(<unknown>undefined);
    let sY: INT16 = <INT16>(<unknown>undefined);
    let bZ: INT8 = <INT16>(<unknown>undefined);

    // run through list of guys, once valid merc found, get his sector x and y and z
    let iCounter: INT32 = 0;

    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      if (Squad[bSquadValue][iCounter]) {
        // valid guy
        sX = Squad[bSquadValue][iCounter].sSectorX;
        sY = Squad[bSquadValue][iCounter].sSectorY;
        bZ = Squad[bSquadValue][iCounter].bSectorZ;
      }
    }

    return { sX, sY, bZ };
  }

  export function IsThisSquadOnTheMove(bSquadValue: INT8): boolean {
    let iCounter: INT32 = 0;

    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      if (Squad[bSquadValue][iCounter]) {
        return Squad[bSquadValue][iCounter].fBetweenSectors;
      }
    }

    return false;
  }

  // rebuild this squad after someone has been removed, to 'squeeze' together any empty spots
  function RebuildSquad(bSquadValue: INT8): void {
    let iCounter: INT32 = 0;
    let iCounterB: INT32 = 0;

    for (
      iCounterB = 0;
      iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD - 1;
      iCounterB++
    ) {
      for (
        iCounter = 0;
        iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD - 1;
        iCounter++
      ) {
        if (Squad[bSquadValue][iCounter] == null) {
          if (Squad[bSquadValue][iCounter + 1] != null) {
            Squad[bSquadValue][iCounter] = Squad[bSquadValue][iCounter + 1];
            Squad[bSquadValue][iCounter + 1] = <SOLDIERTYPE>(<unknown>null);
          }
        }
      }
    }

    return;
  }

  function UpdateCurrentlySelectedMerc(
    pSoldier: SOLDIERTYPE,
    bSquadValue: INT8,
  ): void {
    let ubID: UINT8;

    // if this squad is the current one and and the psoldier is the currently selected soldier, get rid of 'em
    if (bSquadValue != iCurrentTacticalSquad) {
      return;
    }

    // Are we the selected guy?
    if (gusSelectedSoldier == pSoldier.ubID) {
      ubID = FindNextActiveAndAliveMerc(pSoldier, false, false);

      if (ubID != NOBODY && ubID != gusSelectedSoldier) {
        SelectSoldier(ubID, false, false);
      } else {
        gusSelectedSoldier = NOBODY;

        // ATE: Make sure we are in TEAM panel at this point!
        SetCurrentInterfacePanel(Enum215.TEAM_PANEL);
      }
    }

    return;
  }

  function IsSquadInSector(pSoldier: SOLDIERTYPE, ubSquad: UINT8): boolean {
    if (pSoldier == null) {
      return false;
    }

    if (pSoldier.fBetweenSectors == true) {
      return false;
    }

    if (pSoldier.bAssignment == Enum117.IN_TRANSIT) {
      return false;
    }

    if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
      return false;
    }

    if (SquadIsEmpty(ubSquad) == true) {
      return true;
    }

    if (
      pSoldier.sSectorX != Squad[ubSquad][0].sSectorX ||
      pSoldier.sSectorY != Squad[ubSquad][0].sSectorY ||
      pSoldier.bSectorZ != Squad[ubSquad][0].bSectorZ
    ) {
      return false;
    }

    if (Squad[ubSquad][0].fBetweenSectors == true) {
      return false;
    }

    return true;
  }

  function IsAnyMercOnSquadAsleep(ubSquadValue: UINT8): boolean {
    let iCounter: INT32 = 0;

    if (SquadIsEmpty(ubSquadValue) == true) {
      return false;
    }

    for (
      iCounter = 0;
      iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD - 1;
      iCounter++
    ) {
      if (Squad[ubSquadValue][iCounter] != null) {
        if (Squad[ubSquadValue][iCounter].fMercAsleep) {
          return true;
        }
      }
    }

    return false;
  }

  function AddDeadCharacterToSquadDeadGuys(
    pSoldier: SOLDIERTYPE,
    iSquadValue: INT32,
  ): boolean {
    let iCounter: INT32 = 0;
    let pTempSoldier: SOLDIERTYPE | null = null;

    // is dead guy in any squad
    if (IsDeadGuyOnAnySquad(pSoldier) == true) {
      return true;
    }

    // first find out if the guy is in the list
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      // valid soldier?
      if (sDeadMercs[iSquadValue][iCounter] != -1) {
        pTempSoldier = FindSoldierByProfileID(
          sDeadMercs[iSquadValue][iCounter],
          true,
        );

        if (pSoldier == pTempSoldier) {
          return true;
        }
      }
    }

    // now insert the guy
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      // valid soldier?
      if (sDeadMercs[iSquadValue][iCounter] != -1) {
        // yep
        pTempSoldier = FindSoldierByProfileID(
          sDeadMercs[iSquadValue][iCounter],
          true,
        );

        // valid soldier?
        if (pTempSoldier == null) {
          // nope
          sDeadMercs[iSquadValue][iCounter] = pSoldier.ubProfile;
          return true;
        }
      } else {
        // nope
        sDeadMercs[iSquadValue][iCounter] = pSoldier.ubProfile;
        return true;
      }
    }

    // no go
    return false;
  }

  function IsDeadGuyOnAnySquad(pSoldier: SOLDIERTYPE): boolean {
    let iCounterA: INT32 = 0;
    let iCounter: INT32 = 0;

    // squad?
    for (iCounterA = 0; iCounterA < Enum275.NUMBER_OF_SQUADS; iCounterA++) {
      // slot?
      for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
        if (sDeadMercs[iCounterA][iCounter] == pSoldier.ubProfile) {
          return true;
        }
      }
    }

    return false;
  }

  export function SoldierIsDeadAndWasOnSquad(
    pSoldier: SOLDIERTYPE,
    bSquadValue: INT8,
  ): boolean {
    let iCounter: INT32 = 0;

    if (bSquadValue == NO_CURRENT_SQUAD) {
      return false;
    }

    // check if guy is on squad
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      if (pSoldier.ubProfile == sDeadMercs[bSquadValue][iCounter]) {
        return true;
      }
    }

    return false;
  }

  export function ResetDeadSquadMemberList(iSquadValue: INT32): boolean {
    sDeadMercs[iSquadValue].fill(-1);

    return true;
  }

  // this passed  soldier on the current squad int he tactical map
  export function IsMercOnCurrentSquad(pSoldier: SOLDIERTYPE): boolean {
    let iCounter: INT32 = 0;

    // valid soldier?
    if (pSoldier == null) {
      // no
      return false;
    }

    // active grunt?
    if (pSoldier.bActive == false) {
      // no
      return false;
    }

    // current squad valid?
    if (iCurrentTacticalSquad >= Enum275.NUMBER_OF_SQUADS) {
      // no
      return false;
    }

    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      if (Squad[iCurrentTacticalSquad][iCounter] == pSoldier) {
        // found him
        return true;
      }
    }

    return false;
  }

  export function NumberOfPlayerControllableMercsInSquad(
    bSquadValue: INT8,
  ): INT8 {
    let pSoldier: SOLDIERTYPE;
    let bCounter: INT8 = 0;
    let bSquadCount: INT8 = 0;

    if (bSquadValue == NO_CURRENT_SQUAD) {
      return 0;
    }

    // find number of characters in particular squad.
    for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
      // valid slot?
      if (Squad[bSquadValue][bCounter] != null) {
        // yep
        pSoldier = Squad[bSquadValue][bCounter];

        // Kris:  This breaks the CLIENT of this function, tactical traversal.  Do NOT check for EPCS or ROBOT here.
        // if ( !AM_AN_EPC( pSoldier ) && !AM_A_ROBOT( pSoldier ) &&
        if (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
          bSquadCount++;
        }
      }
    }

    // return number found
    return bSquadCount;
  }

  export function DoesVehicleExistInSquad(bSquadValue: INT8): boolean {
    let pSoldier: SOLDIERTYPE;
    let bCounter: INT8 = 0;
    let bSquadCount: INT8 = 0;

    if (bSquadValue == NO_CURRENT_SQUAD) {
      return false;
    }

    // find number of characters in particular squad.
    for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
      // valid slot?
      if (Squad[bSquadValue][bCounter] != null) {
        // yep
        pSoldier = Squad[bSquadValue][bCounter];

        // If we are an EPC or ROBOT, don't allow this
        if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
          return true;
        }
      }
    }

    return false;
  }

  export function CheckSquadMovementGroups(): void {
    let iSquad: INT32;
    let pGroup: GROUP;

    for (iSquad = 0; iSquad < Enum275.NUMBER_OF_SQUADS; iSquad++) {
      pGroup = GetGroup(SquadMovementGroups[iSquad]);
      if (pGroup == null) {
        // recreate group
        SquadMovementGroups[iSquad] = CreateNewPlayerGroupDepartingFromSector(
          1,
          1,
        );

        // Set persistent....
        pGroup = GetGroup(SquadMovementGroups[iSquad]);
        Assert(pGroup);
        pGroup.fPersistant = true;
      }
    }
  }
}
