namespace ja2 {
  /*
   * Smell & Blood system
   *
   * Smell and blood trails decay as time passes.
   *
   *             Decay Rate        Maximum Strength    Decay Time: Min Max (for biggest volume)
   *
   * Smell       1 per turn              31                         31  31
   * Blood    1 every 1-3 turns           7                          7  21
   *
   * Smell has a much finer resolution so that creatures which track by smell
   * can do so effectively.
   */

  /*
   * Time for some crazy-ass macros!
   * The smell byte is spit as follows:
   * O \
   * O  \
   * O   \ Smell
   * O   / Strength (only on ground)
   * O  /
   * O /
   * O >   Type of blood on roof
   * O >   Type of smell/blood on ground
   *
   * The blood byte is split as follows:
   * O \
   * O  > Blood quantity on roof
   * O /
   * O \
   * O  > Blood quantity on ground
   * O /
   * O \  Blood decay
   * O /  time (roof and ground decay together)
   */

  /*
   * In these defines,
   * s indicates the smell byte, b indicates the blood byte
   */

  // LUT for which graphic to use based on strength
  //															 0  1,  2,  3,  4,  5,  6, 7
  let ubBloodGraphicLUT: UINT8[] /* [] */ = [3, 3, 2, 2, 1, 1, 0, 0];

  const SMELL_STRENGTH_MAX = 63;
  const BLOOD_STRENGTH_MAX = 7;
  const BLOOD_DELAY_MAX = 3;

  const SMELL_TYPE_BITS = (s: number) => s & 0x03;

  const BLOOD_ROOF_TYPE = (s: number) => s & 0x02;
  const BLOOD_FLOOR_TYPE = (s: number) => s & 0x01;

  const BLOOD_ROOF_STRENGTH = (b: number) => b & 0xe0;
  const BLOOD_FLOOR_STRENGTH = (b: number) => (b & 0x1c) >> 2;
  const BLOOD_DELAY_TIME = (b: number) => b & 0x03;
  const NO_BLOOD_STRENGTH = (b: number) => (b & 0xfc) == 0;

  const DECAY_SMELL_STRENGTH = (s: number) => {
    let ubStrength: UINT8 = SMELL_STRENGTH(s);
    ubStrength--;
    ubStrength = ubStrength << SMELL_TYPE_NUM_BITS;
    return SMELL_TYPE_BITS(s) | ubStrength;
  };

  // s = smell byte
  // ns = new strength
  // ntf = new type on floor
  // Note that the first part of the macro is designed to
  // preserve the type value for the blood on the roof
  const SET_SMELL = (s: number, ns: number, ntf: number) => {
    return BLOOD_ROOF_TYPE(s) | SMELL_TYPE(ntf) | (ns << SMELL_TYPE_NUM_BITS);
  };

  const DECAY_BLOOD_DELAY_TIME = (b: number) => {
    return b - 1;
  };

  const SET_BLOOD_FLOOR_STRENGTH = (b: number, nb: number) => {
    return (nb << 2) | (b & 0xe3);
  };

  const SET_BLOOD_ROOF_STRENGTH = (b: number, nb: number) => {
    return (BLOOD_FLOOR_STRENGTH(nb) << 5) | (b & 0x1f);
  };

  const DECAY_BLOOD_FLOOR_STRENGTH = (b: number) => {
    let ubFloorStrength: UINT8;
    ubFloorStrength = BLOOD_FLOOR_STRENGTH(b);
    ubFloorStrength--;
    return SET_BLOOD_FLOOR_STRENGTH(b, ubFloorStrength);
  };

  const DECAY_BLOOD_ROOF_STRENGTH = (b: number) => {
    let ubRoofStrength: UINT8;
    ubRoofStrength = BLOOD_ROOF_STRENGTH(b);
    ubRoofStrength--;
    return SET_BLOOD_FLOOR_STRENGTH(b, ubRoofStrength);
  };

  const SET_BLOOD_DELAY_TIME = (b: number) => {
    return BLOOD_DELAY_TIME(Random(BLOOD_DELAY_MAX) + 1) | (b & 0xfc);
  };

  const SET_BLOOD_FLOOR_TYPE = (s: number, ntg: number) => {
    return BLOOD_FLOOR_TYPE(ntg) | (s & 0xfe);
  };

  const SET_BLOOD_ROOF_TYPE = (s: number, ntr: number) => {
    return BLOOD_ROOF_TYPE(ntr) | (s & 0xfd);
  };

  export function RemoveBlood(sGridNo: INT16, bLevel: INT8): void {
    gpWorldLevelData[sGridNo].ubBloodInfo = 0;

    gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_REEVALUATEBLOOD;

    UpdateBloodGraphics(sGridNo, bLevel);
  }

  export function DecaySmells(): void {
    let uiLoop: UINT32;
    let pMapElement: MAP_ELEMENT;

    // return;

    for (
      uiLoop = 0, pMapElement = gpWorldLevelData[uiLoop];
      uiLoop < WORLD_MAX;
      uiLoop++, pMapElement = gpWorldLevelData[uiLoop]
    ) {
      if (pMapElement.ubSmellInfo) {
        // decay smell strength!
        pMapElement.ubSmellInfo = DECAY_SMELL_STRENGTH(pMapElement.ubSmellInfo);
        // if the strength left is 0, wipe the whole byte to clear the type
        if (SMELL_STRENGTH(pMapElement.ubSmellInfo) == 0) {
          pMapElement.ubSmellInfo = 0;
        }
      }
    }
  }

  function DecayBlood(): void {
    let uiLoop: UINT32;
    let pMapElement: MAP_ELEMENT;

    for (
      uiLoop = 0, pMapElement = gpWorldLevelData[uiLoop];
      uiLoop < WORLD_MAX;
      uiLoop++, pMapElement = gpWorldLevelData[uiLoop]
    ) {
      if (pMapElement.ubBloodInfo) {
        // delay blood timer!
        pMapElement.ubBloodInfo = DECAY_BLOOD_DELAY_TIME(
          pMapElement.ubBloodInfo,
        );
        if (BLOOD_DELAY_TIME(pMapElement.ubBloodInfo) == 0) {
          // Set re-evaluate flag
          pMapElement.uiFlags |= MAPELEMENT_REEVALUATEBLOOD;

          // reduce the floor blood strength if it is above zero
          if (BLOOD_FLOOR_STRENGTH(pMapElement.ubBloodInfo) > 0) {
            pMapElement.ubBloodInfo = DECAY_BLOOD_FLOOR_STRENGTH(
              pMapElement.ubBloodInfo,
            );
            if (BLOOD_FLOOR_STRENGTH(pMapElement.ubBloodInfo) == 0) {
              // delete the blood graphic on the floor!
              // then
              if (NO_BLOOD_STRENGTH(pMapElement.ubBloodInfo)) {
                // wipe the whole byte to zero
                pMapElement.ubBloodInfo = 0;
              }
            }
          }
          // reduce the roof blood strength if it is above zero
          if (BLOOD_ROOF_STRENGTH(pMapElement.ubBloodInfo) > 0) {
            pMapElement.ubBloodInfo = DECAY_BLOOD_ROOF_STRENGTH(
              pMapElement.ubBloodInfo,
            );
            if (BLOOD_ROOF_STRENGTH(pMapElement.ubBloodInfo) == 0) {
              // delete the blood graphic on the roof!
              if (NO_BLOOD_STRENGTH(pMapElement.ubBloodInfo)) {
                // wipe the whole byte to zero
                pMapElement.ubBloodInfo = 0;
              }
            }
          }

          // if any blood remaining, reset time
          if (pMapElement.ubBloodInfo) {
            pMapElement.ubBloodInfo = SET_BLOOD_DELAY_TIME(
              pMapElement.ubBloodInfo,
            );
          }
        }
        // end of blood handling
      }

      // now go on to the next gridno
    }
  }

  export function DecayBloodAndSmells(uiTime: UINT32): void {
    let uiCheckTime: UINT32;

    if (!gfWorldLoaded) {
      return;
    }

    // period between checks, in game seconds
    switch (giTimeCompressMode) {
      // in time compression, let this happen every 5 REAL seconds
      case Enum130.TIME_COMPRESS_5MINS: // rate of 300 seconds per real second
        uiCheckTime = 5 * 300;
        break;
      case Enum130.TIME_COMPRESS_30MINS: // rate of 1800 seconds per real second
        uiCheckTime = 5 * 1800;
        break;
      case Enum130.TIME_COMPRESS_60MINS: // rate of 3600 seconds per real second
      case Enum130.TIME_SUPER_COMPRESS: // should not be used but just in frigging case...
        uiCheckTime = 5 * 3600;
        break;
      default: // not compressing
        uiCheckTime = 100;
        break;
    }

    // ok so "uiDecayBloodLastUpdate" is a bit of a misnomer now
    if (uiTime - gTacticalStatus.uiDecayBloodLastUpdate > uiCheckTime) {
      gTacticalStatus.uiDecayBloodLastUpdate = uiTime;
      DecayBlood();
      DecaySmells();
    }
  }

  export function DropSmell(pSoldier: SOLDIERTYPE): void {
    let pMapElement: MAP_ELEMENT;
    let ubOldSmell: UINT8;
    let ubOldStrength: UINT8;
    let ubSmell: UINT8;
    let ubStrength: UINT8;

    /*
     *  Here we are creating a new smell on the ground.  If there is blood in
     *  the tile, it overrides dropping smells of any type
     */

    if (pSoldier.bLevel == 0) {
      pMapElement = gpWorldLevelData[pSoldier.sGridNo];
      if (pMapElement.ubBloodInfo) {
        // blood here, don't drop any smell
        return;
      }

      if (pSoldier.bNormalSmell > pSoldier.bMonsterSmell) {
        ubStrength = pSoldier.bNormalSmell - pSoldier.bMonsterSmell;
        ubSmell = HUMAN;
      } else {
        ubStrength = pSoldier.bMonsterSmell - pSoldier.bNormalSmell;
        if (ubStrength == 0) {
          // don't drop any smell
          return;
        }
        ubSmell = CREATURE_ON_FLOOR;
      }

      if (pMapElement.ubSmellInfo) {
        // smell already exists here; check to see if it's the same or not

        ubOldSmell = SMELL_TYPE(pMapElement.ubSmellInfo);
        ubOldStrength = SMELL_STRENGTH(pMapElement.ubSmellInfo);
        if (ubOldSmell == ubSmell) {
          // same smell; increase the strength to the bigger of the two strengths,
          // plus 1/5 of the smaller
          ubStrength =
            Math.max(ubStrength, ubOldStrength) +
            Math.trunc(Math.min(ubStrength, ubOldStrength) / 5);
          ubStrength = Math.max(ubStrength, SMELL_STRENGTH_MAX);
        } else {
          // different smell; we muddy the smell by reducing the smell strength
          if (ubOldStrength > ubStrength) {
            ubOldStrength -= Math.trunc(ubStrength / 3);
            pMapElement.ubSmellInfo = SET_SMELL(
              pMapElement.ubSmellInfo,
              ubOldStrength,
              ubOldSmell,
            );
          } else {
            ubStrength -= Math.trunc(ubOldStrength / 3);
            if (ubStrength > 0) {
              pMapElement.ubSmellInfo = SET_SMELL(
                pMapElement.ubSmellInfo,
                ubStrength,
                ubSmell,
              );
            } else {
              // smell reduced to 0 - wipe all info on it!
              pMapElement.ubSmellInfo = 0;
            }
          }
        }
      } else {
        // the simple case, dropping a smell in a location where there is none
        pMapElement.ubSmellInfo = SET_SMELL(
          pMapElement.ubSmellInfo,
          ubStrength,
          ubSmell,
        );
      }
    }
    // otherwise skip dropping smell
  }

  export function InternalDropBlood(
    sGridNo: INT16,
    bLevel: INT8,
    ubType: UINT8,
    ubStrength: UINT8,
    bVisible: INT8,
  ): void {
    let pMapElement: MAP_ELEMENT;
    let ubOldStrength: UINT8 = 0;
    let ubNewStrength: UINT8 = 0;

    /*
     * Dropping some blood;
     * We can check the type of blood by consulting the type in the smell byte
     */

    // If we are in water...
    if (
      GetTerrainType(sGridNo) == Enum315.DEEP_WATER ||
      GetTerrainType(sGridNo) == Enum315.LOW_WATER ||
      GetTerrainType(sGridNo) == Enum315.MED_WATER
    ) {
      return;
    }

    // ATE: Send warning if dropping blood nowhere....
    if (sGridNo == NOWHERE) {
      return;
    }

    // ensure max strength is okay
    ubStrength = Math.min(ubStrength, BLOOD_STRENGTH_MAX);

    pMapElement = gpWorldLevelData[sGridNo];
    if (bLevel == 0) {
      // dropping blood on ground
      ubOldStrength = BLOOD_FLOOR_STRENGTH(pMapElement.ubBloodInfo);
      if (ubOldStrength > 0) {
        // blood already there... we'll leave the decay time as it is
        if (BLOOD_FLOOR_TYPE(pMapElement.ubBloodInfo) == ubType) {
          // combine blood strengths!
          ubNewStrength = Math.min(
            ubOldStrength + ubStrength,
            BLOOD_STRENGTH_MAX,
          );

          pMapElement.ubBloodInfo = SET_BLOOD_FLOOR_STRENGTH(
            pMapElement.ubBloodInfo,
            ubNewStrength,
          );
        } else {
          // replace the existing blood if more is being dropped than exists
          if (ubStrength > ubOldStrength) {
            // replace!
            pMapElement.ubBloodInfo = SET_BLOOD_FLOOR_STRENGTH(
              pMapElement.ubBloodInfo,
              ubStrength,
            );
          }
          // else we don't drop anything at all
        }
      } else {
        // no blood on the ground yet, so drop this amount!
        // set decay time
        pMapElement.ubBloodInfo = SET_BLOOD_DELAY_TIME(pMapElement.ubBloodInfo);
        pMapElement.ubBloodInfo = SET_BLOOD_FLOOR_STRENGTH(
          pMapElement.ubBloodInfo,
          ubStrength,
        );
        // NB blood floor type stored in smell byte!
        pMapElement.ubSmellInfo = SET_BLOOD_FLOOR_TYPE(
          pMapElement.ubSmellInfo,
          ubType,
        );
      }
    } else {
      // dropping blood on roof
      ubOldStrength = BLOOD_ROOF_STRENGTH(pMapElement.ubBloodInfo);
      if (ubOldStrength > 0) {
        // blood already there... we'll leave the decay time as it is
        if (BLOOD_ROOF_TYPE(pMapElement.ubSmellInfo) == ubType) {
          // combine blood strengths!
          ubNewStrength = Math.max(ubOldStrength, ubStrength) + 1;
          // make sure the strength is legal
          ubNewStrength = Math.max(ubNewStrength, BLOOD_STRENGTH_MAX);
          pMapElement.ubBloodInfo = SET_BLOOD_ROOF_STRENGTH(
            pMapElement.ubBloodInfo,
            ubNewStrength,
          );
        } else {
          // replace the existing blood if more is being dropped than exists
          if (ubStrength > ubOldStrength) {
            // replace!
            pMapElement.ubBloodInfo = SET_BLOOD_ROOF_STRENGTH(
              pMapElement.ubBloodInfo,
              ubStrength,
            );
          }
          // else we don't drop anything at all
        }
      } else {
        // no blood on the roof yet, so drop this amount!
        // set decay time
        pMapElement.ubBloodInfo = SET_BLOOD_DELAY_TIME(pMapElement.ubBloodInfo);
        pMapElement.ubBloodInfo = SET_BLOOD_ROOF_STRENGTH(
          pMapElement.ubBloodInfo,
          ubNewStrength,
        );
        pMapElement.ubSmellInfo = SET_BLOOD_ROOF_TYPE(
          pMapElement.ubSmellInfo,
          ubType,
        );
      }
    }

    // Turn on flag...
    pMapElement.uiFlags |= MAPELEMENT_REEVALUATEBLOOD;

    if (bVisible != -1) {
      UpdateBloodGraphics(sGridNo, bLevel);
    }
  }

  export function DropBlood(
    pSoldier: SOLDIERTYPE,
    ubStrength: UINT8,
    bVisible: INT8,
  ): void {
    let ubType: UINT8;
    let ubOldStrength: UINT8 = 0;
    let ubNewStrength: UINT8 = 0;

    /*
     * Dropping some blood;
     * We can check the type of blood by consulting the type in the smell byte
     */

    // figure out the type of blood that we're dropping
    if (pSoldier.uiStatusFlags & SOLDIER_MONSTER) {
      if (pSoldier.bLevel == 0) {
        ubType = CREATURE_ON_FLOOR;
      } else {
        ubType = CREATURE_ON_ROOF;
      }
    } else {
      ubType = 0;
    }

    InternalDropBlood(
      pSoldier.sGridNo,
      pSoldier.bLevel,
      ubType,
      ubStrength,
      bVisible,
    );
  }

  export function UpdateBloodGraphics(sGridNo: INT16, bLevel: INT8): void {
    let pMapElement: MAP_ELEMENT;
    let bValue: INT8;
    let usIndex: UINT16;
    let usNewIndex: UINT16;

    // OK, based on level, type, display graphics for blood
    pMapElement = gpWorldLevelData[sGridNo];

    // CHECK FOR BLOOD OPTION
    if (!gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
      return;
    }

    if (pMapElement.uiFlags & MAPELEMENT_REEVALUATEBLOOD) {
      // Turn off flag!
      pMapElement.uiFlags &= ~MAPELEMENT_REEVALUATEBLOOD;

      // Ground
      if (bLevel == 0) {
        bValue = BLOOD_FLOOR_STRENGTH(pMapElement.ubBloodInfo);

        // OK, remove tile graphic if one exists....
        if (
          (usIndex = TypeRangeExistsInObjectLayer(
            sGridNo,
            Enum313.HUMANBLOOD,
            Enum313.CREATUREBLOOD,
          )) !== -1
        ) {
          // This has been removed and it is handled by the ubBloodInfo level when restoring a saved game.
          // Set a flag indicating that the following changes are to go the the maps temp file
          // ApplyMapChangesToMapTempFile( TRUE );

          // Remove
          RemoveObject(sGridNo, usIndex);

          // ApplyMapChangesToMapTempFile( FALSE );
        }

        // OK, pick new one. based on strength and randomness

        if (bValue > 0) {
          usIndex = Random(4) * 4 + ubBloodGraphicLUT[bValue];

          if (BLOOD_FLOOR_TYPE(pMapElement.ubSmellInfo) == 0) {
            usNewIndex = GetTileIndexFromTypeSubIndex(
              Enum313.HUMANBLOOD,
              usIndex + 1,
            );
          } else {
            usNewIndex = GetTileIndexFromTypeSubIndex(
              Enum313.CREATUREBLOOD,
              usIndex + 1,
            );
          }

          // This has been removed and it is handled by the ubBloodInfo level when restoring a saved game.
          // Set a flag indicating that the following changes are to go the the maps temp file
          // ApplyMapChangesToMapTempFile( TRUE );

          // Add!
          AddObjectToHead(sGridNo, usNewIndex);

          // ApplyMapChangesToMapTempFile( FALSE );

          // Update rendering!
          pMapElement.uiFlags |= MAPELEMENT_REDRAW;
          SetRenderFlags(RENDER_FLAG_MARKED);
        }
      }
      // Roof
      else {
      }
    }
  }
}
