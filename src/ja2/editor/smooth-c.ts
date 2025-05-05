namespace ja2 {
  let gbSmoothStruct: INT16[] /* [] */ = [
    3, 2, 12, 27, 12, 0, 5, 2, 15, 30, 39, 0, 7, 2, 17, 32, 41, 0, 11, 2, 14,
    29, 14, 0, 8, 2, 13, 28, 38, 0, 15, 1, 19, 0, 43, 0, 26, 1, 20, 0, 44, 0,
    12, 2, 18, 33, 42, 0, 23, 1, 21, 0, 45, 0, 18, 2, 16, 31, 40, 0, 21, 1, 22,
    0, 46, 0, 14, 2, 11, 26, 11, 0, 19, 1, 23, 0, 47, 0, 16, 2, 24, 34, 48, 0,
    10, 2, 25, 35, 49, 0, -1,
  ];

  // This is a list of smoothed out water/shoreline textures
  // Coding is as such:
  // 1st - the corresponding bitvalue for the surrounding water tiles
  // 2nd - the number of variations to randomize terrain
  // 3rd - the first variation
  // 4th - the second variation

  // FIRST			ENTRY			MAJIC NUMBER CALCULATED
  // 2nd				ENTRY			# OF VARIATIONS
  // 3rd, 4rth  ENTRY			TILE NUMBERS ( entry 1, entry 2 )
  let gbSmoothWaterStruct: INT16[] /* [] */ = [
    1020, 1, 11, 0, 1000, 1, 12, 0, 510, 2, 13, 43, 190, 1, 14, 0, 894, 1, 15,
    0, 622, 1, 16, 0, 1014, 2, 17, 41, 944, 1, 18, 24, 872, 1, 19, 0, 992, 1,
    20, 0, 62, 1, 21, 0, 190, 2, 22, 14, 620, 1, 23, 0, 944, 1, 24, 18, 878, 2,
    25, 32, 434, 1, 28, 0, 110, 1, 29, 0, 1010, 1, 30, 0, 876, 2, 31, 32, 878,
    2, 32, 31, 1004, 2, 32, 31, 1006, 2, 33, 34, 1008, 2, 34, 33, 1016, 2, 33,
    34, 126, 2, 35, 36, 254, 2, 35, 26, 638, 2, 36, 26, 438, 2, 38, 27, 446, 2,
    37, 38, 950, 2, 37, 27, 864, 1, 39, 0, 1040, 1, 40, 0, 1014, 2, 41, 17, 432,
    1, 42, 0, 510, 1, 43, 13, 54, 1, 44, 0, 108, 1, 45, 0, -1,
  ];

  export function SmoothTerrain(
    gridno: number,
    origType: number,
    fForceSmooth: boolean,
  ): UINT16 {
    let temp: number = 0;
    let type: number = 0;
    let FullTile: boolean /* number */ = false;
    let usOldIndex: UINT16;
    let usTempIndex: UINT16;
    let cnt: UINT32;
    let fFound: boolean;
    let uiTempIndex: UINT32;
    let usTileIndex: UINT16;
    let land: UINT16 = 0;
    let uiTopType: UINT32;
    let fSameTile: boolean;

    let pSmoothStruct: INT16[] /* Pointer<INT16> */;
    // Check to see if the orginal texture was water, is so, smooth square/hex with
    // SmoothWaterTerrain rather than the proceeding method
    if (origType == Enum313.REGWATERTEXTURE) {
      return SmoothWaterTerrain(gridno, origType, true);
    }
    pSmoothStruct = gbSmoothStruct;

    // Get land index value for given level and adjust according to type
    if ((usTileIndex = TypeExistsInLandLayer(gridno, origType)) !== -1) {
      usOldIndex = GetTypeSubIndexFromTileIndex(origType, usTileIndex);
    } else {
      return NO_TILE;
    }

    // Check if we're dealing with a 'full' tile ( first ten )
    // If so, do not smooth
    // Onlt do if we are not forcing the smooth
    if (!fForceSmooth) {
      if (usOldIndex >= 1 && usOldIndex <= 10) {
        return NO_TILE;
      }
    }

    // is land height one tile above not the same type?
    if (gridno - WORLD_COLS >= 0) {
      if (
        (usTempIndex = TypeExistsInLandLayer(gridno - WORLD_COLS, origType)) ===
        -1
      ) {
        // no it's not
        temp += 3;
      }
    }
    // is land height one tile to the right not the same type?
    // (make sure there IS a tile to the right, i.e. check for border)
    if ((gridno + 1) % WORLD_COLS != 0) {
      if ((usTempIndex = TypeExistsInLandLayer(gridno + 1, origType)) === -1) {
        // no it's not
        temp += 5;
      }
    }

    // is land height one tile down not the same type?
    if (gridno + WORLD_COLS < WORLD_COLS * WORLD_ROWS) {
      if (
        (usTempIndex = TypeExistsInLandLayer(gridno + WORLD_COLS, origType)) ===
        -1
      ) {
        // no it's not
        temp += 7;
      }
    }

    // is land height one tile to left not the same type?
    if (gridno % WORLD_COLS != 0) {
      if ((usTempIndex = TypeExistsInLandLayer(gridno - 1, origType)) === -1) {
        // no it's not
        temp += 11;
      }
    }

    // Now, at this point the height (of "temp") will tell us
    // which texture piece to use

    // Loop through smooth struct
    cnt = 0;
    fFound = false;

    uiTopType = GetLandHeadType(gridno);

    while (pSmoothStruct[cnt] != -1) {
      if (pSmoothStruct[cnt] == temp) {
        fSameTile = false;
        // If water is it's top type
        do {
          // CHeck if it's the same tile
          if (pSmoothStruct[cnt + 2] == usOldIndex) {
            fSameTile = true;
          }
          if (pSmoothStruct[cnt + 3]) {
            if (pSmoothStruct[cnt + 3] == usOldIndex) {
              fSameTile = true;
            }
          }
          if (fSameTile) {
            return NO_TILE;
          }
          uiTempIndex = Math.floor(Math.random() * pSmoothStruct[cnt + 1]);
          land = pSmoothStruct[cnt + 2 + uiTempIndex];
          fFound = true;
        } while (false);
        break;
      }
      cnt += 6;
    }
    if (!fFound) {
      // Check for existance of same tile
      if (usOldIndex >= 1 && usOldIndex <= 10) {
        return NO_TILE;
      }
      // this is a "full" tile, so randomize between the
      // five available tiles
      land = Math.floor(Math.random() * 10) + 1;
      FullTile = true;
    }
    usTileIndex = GetTileIndexFromTypeSubIndex(origType, land);
    return usTileIndex;
  }

  function SmoothExitGridRadius(sMapIndex: INT16, ubRadius: UINT8): void {
    let pShadow: LEVELNODE | null;
    let x: INT16;
    let y: INT16;
    let centerX: INT16;
    let centerY: INT16;

    ({ sX: centerX, sY: centerY } = ConvertGridNoToXY(sMapIndex));

    for (y = centerY - ubRadius; y <= centerY + ubRadius; y++) {
      for (x = centerX - ubRadius; x <= centerX + ubRadius; x++) {
        sMapIndex = y * WORLD_COLS + x;
        if (GridNoOnVisibleWorldTile(sMapIndex)) {
          if ((pShadow = GetExitGridLevelNode(sMapIndex)) !== null) {
            let usIndex: UINT16 = 0;
            SmoothExitGrid(
              sMapIndex,
              createPointer(
                () => usIndex,
                (v) => (usIndex = v),
              ),
              true,
            );
            if (usIndex != NO_TILE && usIndex != pShadow.usIndex) {
              AddToUndoList(sMapIndex);
              pShadow.usIndex = usIndex;
            }
          }
        }
      }
    }
  }

  function SmoothExitGrid(
    gridno: number,
    piNewTile: Pointer<UINT16>,
    fForceSmooth: boolean,
  ): void {
    let temp: number = 0;
    let type: number = 0;
    let FullTile: boolean /* number */ = false;
    let usOldIndex: UINT16;
    let usTempIndex: UINT16;
    let cnt: UINT32;
    let fFound: boolean;
    let uiTempIndex: UINT32;
    let usTileIndex: UINT16;
    let usExitGridIndex: UINT16 = 0;
    let fSameTile: boolean;

    let pSmoothStruct: INT16[];

    pSmoothStruct = gbSmoothStruct;

    // Get Object index value for given level and adjust according to type
    if (
      (usTileIndex = TypeExistsInShadowLayer(gridno, Enum313.EXITTEXTURE)) !==
      -1
    ) {
      usOldIndex = GetTypeSubIndexFromTileIndex(
        Enum313.EXITTEXTURE,
        usTileIndex,
      );
    } else {
      piNewTile.value = NO_TILE;
      return;
    }

    // Check if we're dealing with a 'full' tile ( first ten )
    // If so, do not smooth
    // Onlt do if we are not forcing the smooth
    if (!fForceSmooth) {
      if (usOldIndex >= 1 && usOldIndex <= 10) {
        piNewTile.value = NO_TILE;
        return;
      }
    }

    // is Object height one tile above not the same type?
    if (gridno - WORLD_COLS >= 0) {
      if (
        (usTempIndex = TypeExistsInShadowLayer(
          gridno - WORLD_COLS,
          Enum313.EXITTEXTURE,
        )) === -1
      ) {
        // no it's not
        temp += 3;
      }
    }
    // is Object height one tile to the right not the same type?
    // (make sure there IS a tile to the right, i.e. check for border)
    if ((gridno + 1) % WORLD_COLS != 0) {
      if (
        (usTempIndex = TypeExistsInShadowLayer(
          gridno + 1,
          Enum313.EXITTEXTURE,
        )) === -1
      ) {
        // no it's not
        temp += 5;
      }
    }

    // is Object height one tile down not the same type?
    if (gridno + WORLD_COLS < WORLD_COLS * WORLD_ROWS) {
      if (
        (usTempIndex = TypeExistsInShadowLayer(
          gridno + WORLD_COLS,
          Enum313.EXITTEXTURE,
        )) === -1
      ) {
        // no it's not
        temp += 7;
      }
    }

    // is Object height one tile to left not the same type?
    if (gridno % WORLD_COLS != 0) {
      if (
        (usTempIndex = TypeExistsInShadowLayer(
          gridno - 1,
          Enum313.EXITTEXTURE,
        )) === -1
      ) {
        // no it's not
        temp += 11;
      }
    }

    // Now, at this point the height (of "temp") will tell us
    // which texture piece to use

    // Loop through smooth struct
    cnt = 0;
    fFound = false;

    while (pSmoothStruct[cnt] != -1) {
      if (pSmoothStruct[cnt] == temp) {
        fSameTile = false;
        // If water is it's top type
        do {
          // CHeck if it's the same tile
          if (pSmoothStruct[cnt + 2] == usOldIndex) {
            fSameTile = true;
          }
          if (pSmoothStruct[cnt + 3]) {
            if (pSmoothStruct[cnt + 3] == usOldIndex) {
              fSameTile = true;
            }
          }
          if (fSameTile) {
            piNewTile.value = NO_TILE;
            return;
          }
          uiTempIndex = Math.floor(Math.random() * pSmoothStruct[cnt + 1]);
          usExitGridIndex = pSmoothStruct[cnt + 2 + uiTempIndex];
          fFound = true;
        } while (false);
        break;
      }
      cnt += 6;
    }
    if (!fFound) {
      // Check for existance of same tile
      if (usOldIndex >= 1 && usOldIndex <= 10) {
        piNewTile.value = NO_TILE;
        return;
      }
      // this is a "full" tile, so randomize between the
      // five available tiles
      usExitGridIndex = Math.floor(Math.random() * 10) + 1;
      FullTile = true;
    }
    usTileIndex = GetTileIndexFromTypeSubIndex(
      Enum313.EXITTEXTURE,
      usExitGridIndex,
    );
    piNewTile.value = usTileIndex;
  }

  function SmoothTerrainWorld(uiCheckType: UINT32): void {
    let cnt: number;
    let usIndex: UINT16;
    let NewTile: UINT16;
    // Smooth out entire world surrounding tiles
    for (cnt = 0; cnt < WORLD_MAX; cnt++) {
      if ((usIndex = TypeExistsInLandLayer(cnt, uiCheckType)) !== -1) {
        NewTile = SmoothTerrain(cnt, uiCheckType, true);

        if (NewTile != NO_TILE) {
          // Change tile
          SetLandIndex(cnt, NewTile, uiCheckType, false);
        }
      }
    }
  }

  export function SmoothAllTerrainWorld(): void {
    let cnt: number;
    let usIndex: UINT16;
    let NewTile: UINT16;
    let uiCheckType: UINT32;
    // Smooth out entire world surrounding tiles
    for (cnt = 0; cnt < WORLD_MAX; cnt++) {
      for (
        uiCheckType = Enum313.FIRSTTEXTURE;
        uiCheckType <= Enum313.SEVENTHTEXTURE;
        uiCheckType++
      ) {
        if ((usIndex = TypeExistsInLandLayer(cnt, uiCheckType)) !== -1) {
          NewTile = SmoothTerrain(cnt, uiCheckType, true);

          if (NewTile != NO_TILE) {
            // Change tile
            SetLandIndex(cnt, NewTile, uiCheckType, false);
          }
        }
      }
    }
  }

  export function SmoothTerrainRadius(
    iMapIndex: UINT32,
    uiCheckType: UINT32,
    ubRadius: UINT8,
    fForceSmooth: boolean,
  ): void {
    let sTop: INT16;
    let sBottom: INT16;
    let sLeft: INT16;
    let sRight: INT16;
    let cnt1: INT16;
    let cnt2: INT16;
    let iNewIndex: INT32;
    let NewTile: UINT16;
    let usIndex: UINT16;
    let leftmost: INT32;
    // Don't bother to smooth floors, they don't need them
    if (uiCheckType >= Enum313.FIRSTFLOOR && uiCheckType <= LASTFLOOR) return;
    // Determine start end end indicies and num rows
    sTop = ubRadius;
    sBottom = -ubRadius;
    sLeft = -ubRadius;
    sRight = ubRadius;
    for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
      leftmost =
        Math.trunc((iMapIndex + WORLD_COLS * cnt1) / WORLD_COLS) * WORLD_COLS;
      for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
        iNewIndex = iMapIndex + WORLD_COLS * cnt1 + cnt2;
        if (
          iNewIndex >= 0 &&
          iNewIndex < WORLD_MAX &&
          iNewIndex >= leftmost &&
          iNewIndex < leftmost + WORLD_COLS
        ) {
          if (
            (usIndex = TypeExistsInLandLayer(iNewIndex, uiCheckType)) !== -1
          ) {
            NewTile = SmoothTerrain(iNewIndex, uiCheckType, fForceSmooth);

            if (NewTile != NO_TILE) {
              // Change tile
              AddToUndoList(iNewIndex);
              SetLandIndex(iNewIndex, NewTile, uiCheckType, false);
            }
          }
        }
      }
    }
  }

  export function SmoothAllTerrainTypeRadius(
    iMapIndex: UINT32,
    ubRadius: UINT8,
    fForceSmooth: boolean,
  ): void {
    let sTop: INT16;
    let sBottom: INT16;
    let sLeft: INT16;
    let sRight: INT16;
    let cnt1: INT16;
    let cnt2: INT16;
    let cnt3: INT16;
    let iNewIndex: INT32;
    let NewTile: UINT16;
    let usIndex: UINT16;
    let leftmost: INT32;
    // Determine start end end indicies and num rows
    sTop = ubRadius;
    sBottom = -ubRadius;
    sLeft = -ubRadius;
    sRight = ubRadius;
    for (cnt3 = Enum313.FIRSTTEXTURE; cnt3 <= Enum313.SEVENTHTEXTURE; cnt3++) {
      for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
        leftmost =
          Math.trunc((iMapIndex + WORLD_COLS * cnt1) / WORLD_COLS) * WORLD_COLS;
        for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
          iNewIndex = iMapIndex + WORLD_COLS * cnt1 + cnt2;
          if (
            iNewIndex >= 0 &&
            iNewIndex < WORLD_MAX &&
            iNewIndex >= leftmost &&
            iNewIndex < leftmost + WORLD_COLS
          ) {
            if ((usIndex = TypeExistsInLandLayer(iNewIndex, cnt3)) !== -1) {
              NewTile = SmoothTerrain(iNewIndex, cnt3, fForceSmooth);
              if (NewTile != NO_TILE) {
                // Change tile
                SetLandIndex(iNewIndex, NewTile, cnt3, false);
              }
            }
          }
        }
      }
    }
  }

  function SmoothWaterTerrain(
    gridno: number,
    origType: number,
    fForceSmooth: boolean,
  ): UINT16 {
    // This procedure will calculate the approriate smooth texture for a water texture
    // based on the surrounding water textures. This is done via masking bits within
    // a temp variable, then searching for the right texture and inserting it
    let temp: number = 0;
    let type: number = 0;
    let FullTile: boolean /* number */ = false;
    let usOldIndex: UINT16;
    let usTempIndex: UINT16;
    let cnt: UINT32;
    let fFound: boolean;
    let uiTempIndex: UINT32;
    let usTileIndex: UINT16;
    let land: UINT16 = 0;
    let uiTopType: UINT32;
    let fSameTile: boolean;
    let pSmoothStruct: INT16[];

    pSmoothStruct = gbSmoothWaterStruct;
    // Get land index value for given level and adjust according to type
    if ((usTileIndex = TypeExistsInLandLayer(gridno, origType)) !== -1) {
      usOldIndex = GetTypeSubIndexFromTileIndex(origType, usTileIndex);
    } else {
      return NO_TILE;
    }
    // Check if we're dealing with a 'full' tile ( first ten )
    // If so, do not smooth
    // Onlt do if we are not forcing the smooth
    if (!fForceSmooth) {
      if (usOldIndex >= 1 && usOldIndex <= 10) {
        return NO_TILE;
      }
    }
    // Mask approriate bits in temp for the lookup in the SmoothWaterStruct list
    if (gridno - WORLD_COLS >= 0) {
      if (
        (usTempIndex = TypeRangeExistsInLandLayer(
          gridno - WORLD_COLS,
          origType,
          origType,
        )) !== -1
      ) {
        // no it's not
        temp |= 4;
      }
    }
    // is land height one tile to the right not the same type?
    // (make sure there IS a tile to the right, i.e. check for border)
    if ((gridno + 1) % WORLD_COLS != 0) {
      if (
        (usTempIndex = TypeRangeExistsInLandLayer(
          gridno + 1,
          origType,
          origType,
        )) !== -1
      ) {
        // no it's not
        temp |= 64;
      }
    }
    // is land height one tile down not the same type?
    if (gridno + WORLD_COLS < WORLD_COLS * WORLD_ROWS) {
      if (
        (usTempIndex = TypeRangeExistsInLandLayer(
          gridno + WORLD_COLS,
          origType,
          origType,
        )) !== -1
      ) {
        // no it's not
        temp |= 256;
      }
    }
    // is land height one tile to left not the same type?
    if (gridno % WORLD_COLS != 0) {
      if (
        (usTempIndex = TypeRangeExistsInLandLayer(
          gridno - 1,
          origType,
          origType,
        )) !== -1
      ) {
        // no it's not
        temp |= 16;
      }
    }
    if ((gridno + 1) % WORLD_COLS != 0) {
      if (gridno - WORLD_COLS >= 0) {
        if (
          (usTempIndex = TypeRangeExistsInLandLayer(
            gridno - WORLD_COLS + 1,
            origType,
            origType,
          )) !== -1
        ) {
          // no it's not
          temp |= 8;
        }
      }
    }
    if (gridno % WORLD_COLS != 0) {
      if (gridno - WORLD_COLS >= 0) {
        if (
          (usTempIndex = TypeRangeExistsInLandLayer(
            gridno - WORLD_COLS - 1,
            origType,
            origType,
          )) !== -1
        ) {
          // no it's not
          temp |= 2;
        }
      }
    }
    if ((gridno + 1) % WORLD_COLS != 0) {
      if (gridno + WORLD_COLS < WORLD_COLS * WORLD_ROWS) {
        if (
          (usTempIndex = TypeRangeExistsInLandLayer(
            gridno + WORLD_COLS + 1,
            origType,
            origType,
          )) !== -1
        ) {
          // no it's not
          temp |= 512;
        }
      }
    }
    if (gridno % WORLD_COLS != 0) {
      if (gridno + WORLD_COLS < WORLD_COLS * WORLD_ROWS) {
        if (
          (usTempIndex = TypeRangeExistsInLandLayer(
            gridno + WORLD_COLS - 1,
            origType,
            origType,
          )) !== -1
        ) {
          // no it's not
          temp |= 128;
        }
      }
    }
    if (
      (usTempIndex = TypeRangeExistsInLandLayer(gridno, origType, origType)) !==
      -1
    ) {
      // no it's not
      temp |= 32;
    }
    // Loop through smooth struct
    cnt = 0;
    fFound = false;
    uiTopType = GetLandHeadType(gridno);
    // Speed up of this while loop  using double/quick search will result
    // in an incorrect solution due to multiple instances of bitvalues in the list of
    // smoothed water textures
    while (pSmoothStruct[cnt] != -1) {
      if (pSmoothStruct[cnt] == temp) {
        fSameTile = false;
        do {
          // CHeck if it's the same tile
          if (pSmoothStruct[cnt + 2] == usOldIndex) {
            fSameTile = true;
          }
          if (pSmoothStruct[cnt + 3]) {
            if (pSmoothStruct[cnt + 3] == usOldIndex) {
              fSameTile = true;
            }
          }
          if (fSameTile) {
            return NO_TILE;
          }
          uiTempIndex = Math.floor(Math.random() * pSmoothStruct[cnt + 1]);
          land = pSmoothStruct[cnt + 2 + uiTempIndex];
          fFound = true;
        } while (false);
        break;
      }
      cnt += 4;
    }
    if (!fFound) {
      // Check for existance of same tile
      if (usOldIndex >= 1 && usOldIndex <= 10) {
        return NO_TILE;
      }
      land = Math.floor(Math.random() * 10) + 1;
      FullTile = true;
    }
    usTileIndex = GetTileIndexFromTypeSubIndex(origType, land);
    return usTileIndex;
  }
}
