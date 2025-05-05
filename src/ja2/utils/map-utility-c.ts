namespace ja2 {
  const fs: typeof import("fs") = require("fs");
  const path: typeof import("path") = require("path");

  const MINIMAP_X_SIZE = 88;
  const MINIMAP_Y_SIZE = 44;

  const WINDOW_SIZE = 2;

  let gdXStep: FLOAT;
  let gdYStep: FLOAT;
  let giMiniMap: INT32;
  let gi8BitMiniMap: INT32;
  let ghvSurface: SGPVSurface;

  // Utililty file for sub-sampling/creating our radar screen maps
  // Loops though our maps directory and reads all .map files, subsamples an area, color
  // quantizes it into an 8-bit image ans writes it to an sti file in radarmaps.

  export function MapUtilScreenInit(): boolean {
    return true;
  }

  /* static */ let MapUtilScreenHandle__fNewMap: boolean = true;
  /* static */ let MapUtilScreenHandle__sFileNum: INT16 = 0;
  /* static */ let MapUtilScreenHandle__FListNode: FDLG_LIST | null;
  /* static */ let MapUtilScreenHandle__sFiles: INT16 = 0;
  /* static */ let MapUtilScreenHandle__sCurFile: INT16 = 0;
  /* static */ let MapUtilScreenHandle__FileList: FDLG_LIST | null = null;
  /* static */ let MapUtilScreenHandle__p24BitDest: Uint8ClampedArray;
  export function MapUtilScreenHandle(): UINT32 {
    let InputEvent: InputAtom = createInputAtom();
    let FileInfo: GETFILESTRUCT = createGetFileStruct();
    let zFilename: string /* INT8[260] */;
    let zFilename2: string /* INT8[260] */;
    let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
    let usWidth: UINT16;
    let usHeight: UINT16;
    let ubBitDepth: UINT8;
    let uiDestPitchBYTES: UINT32 = 0;
    let uiSrcPitchBYTES: UINT32 = 0;
    let pDestBuf: Uint8ClampedArray;
    let pSrcBuf: Uint8ClampedArray;
    let pDataPtr: Uint8ClampedArray;

    let uiRGBColor: UINT32;

    let bR: UINT32;
    let bG: UINT32;
    let bB: UINT32;
    let bAvR: UINT32;
    let bAvG: UINT32;
    let bAvB: UINT32;
    let s16BPPSrc: INT16;
    let sDest16BPPColor: INT16;
    let cnt: INT32;

    let sX1: INT16;
    let sX2: INT16;
    let sY1: INT16;
    let sY2: INT16;
    let sTop: INT16;
    let sBottom: INT16;
    let sLeft: INT16;
    let sRight: INT16;

    let dX: FLOAT;
    let dY: FLOAT;
    let dStartX: FLOAT;
    let dStartY: FLOAT;
    let iX: INT32;
    let iY: INT32;
    let iSubX1: INT32;
    let iSubY1: INT32;
    let iSubX2: INT32;
    let iSubY2: INT32;
    let iWindowX: INT32;
    let iWindowY: INT32;
    let iCount: INT32;
    let pPalette: SGPPaletteEntry[] /* [256] */ = createArrayFrom(
      256,
      createSGPPaletteEntry,
    );

    sDest16BPPColor = -1;
    bAvR = bAvG = bAvB = 0;

    // Zero out area!
    ColorFillVideoSurfaceArea(
      FRAME_BUFFER,
      0,
      0,
      640,
      480,
      Get16BPPColor(FROMRGB(0, 0, 0)),
    );

    if (MapUtilScreenHandle__fNewMap) {
      MapUtilScreenHandle__fNewMap = false;

      // Create render buffer
      ({ usWidth, usHeight, ubBitDepth } = GetCurrentVideoSettings());
      vs_desc.fCreateFlags =
        VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
      vs_desc.usWidth = 88;
      vs_desc.usHeight = 44;
      vs_desc.ubBitDepth = ubBitDepth;

      if ((giMiniMap = AddVideoSurface(vs_desc)) === -1) {
        return Enum26.ERROR_SCREEN;
      }

      // USING BRET's STUFF FOR LOOPING FILES/CREATING LIST, hence AddToFDlgList.....
      for (const fileName of fs.readdirSync("MAPS")) {
        if (!fileName.toLowerCase().endsWith(".dat")) {
          continue;
        }
        FileInfo.zFileName = path.join("MAPS", fileName);

        MapUtilScreenHandle__FileList = AddToFDlgList(
          MapUtilScreenHandle__FileList,
          FileInfo,
        );
        MapUtilScreenHandle__sFiles++;
      }

      MapUtilScreenHandle__FListNode = MapUtilScreenHandle__FileList;

      // Allocate 24 bit Surface
      MapUtilScreenHandle__p24BitDest = new Uint8ClampedArray(
        MINIMAP_X_SIZE * MINIMAP_Y_SIZE * 3,
      );

      // Allocate 8-bit surface
      vs_desc.fCreateFlags =
        VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
      vs_desc.usWidth = 88;
      vs_desc.usHeight = 44;
      vs_desc.ubBitDepth = 8;

      if ((gi8BitMiniMap = AddVideoSurface(vs_desc)) === -1) {
        return Enum26.ERROR_SCREEN;
      }
      ghvSurface = GetVideoSurface(gi8BitMiniMap);
    }

    // OK, we are here, now loop through files
    if (
      MapUtilScreenHandle__sCurFile == MapUtilScreenHandle__sFiles ||
      MapUtilScreenHandle__FListNode == null
    ) {
      gfProgramIsRunning = false;
      return Enum26.MAPUTILITY_SCREEN;
    }

    zFilename = sprintf(
      "%s",
      MapUtilScreenHandle__FListNode.FileInfo.zFileName,
    );

    // OK, load maps and do overhead shrinkage of them...
    if (!LoadWorld(zFilename)) {
      return Enum26.ERROR_SCREEN;
    }

    // Render small map
    InitNewOverheadDB(giCurrentTilesetID);

    gfOverheadMapDirty = true;

    RenderOverheadMap(0, Math.trunc(WORLD_COLS / 2), 0, 0, 640, 320, true);

    TrashOverheadMap();

    // OK, NOW PROCESS OVERHEAD MAP ( SHOUIDL BE ON THE FRAMEBUFFER )
    gdXStep = 640 / 88;
    gdYStep = 320 / 44;
    dStartX = dStartY = 0;

    // Adjust if we are using a restricted map...
    if (gMapInformation.ubRestrictedScrollID != 0) {
      ({
        sX1,
        sY1,
        sX2,
        sY2: sTop,
      } = CalculateRestrictedMapCoords(Enum245.NORTH, 640, 320));
      ({
        sX1,
        sY1: sBottom,
        sX2,
        sY2,
      } = CalculateRestrictedMapCoords(Enum245.SOUTH, 640, 320));
      ({
        sX1,
        sY1,
        sX2: sLeft,
        sY2,
      } = CalculateRestrictedMapCoords(Enum245.WEST, 640, 320));
      ({
        sX1: sRight,
        sY1,
        sX2,
        sY2,
      } = CalculateRestrictedMapCoords(Enum245.EAST, 640, 320));

      gdXStep = (sRight - sLeft) / 88;
      gdYStep = (sBottom - sTop) / 44;

      dStartX = sLeft;
      dStartY = sTop;
    }

    // LOCK BUFFERS

    dX = dStartX;
    dY = dStartY;

    pDestBuf = LockVideoSurface(
      giMiniMap,
      createPointer(
        () => uiDestPitchBYTES,
        (v) => (uiDestPitchBYTES = v),
      ),
    );
    pSrcBuf = LockVideoSurface(
      FRAME_BUFFER,
      createPointer(
        () => uiSrcPitchBYTES,
        (v) => (uiSrcPitchBYTES = v),
      ),
    );

    for (iX = 0; iX < 88; iX++) {
      dY = dStartY;

      for (iY = 0; iY < 44; iY++) {
        // OK, AVERAGE PIXELS
        iSubX1 = Math.trunc(dX - WINDOW_SIZE);

        iSubX2 = Math.trunc(dX + WINDOW_SIZE);

        iSubY1 = Math.trunc(dY - WINDOW_SIZE);

        iSubY2 = Math.trunc(dY + WINDOW_SIZE);

        iCount = 0;
        bR = bG = bB = 0;

        for (iWindowX = iSubX1; iWindowX < iSubX2; iWindowX++) {
          for (iWindowY = iSubY1; iWindowY < iSubY2; iWindowY++) {
            if (
              iWindowX >= 0 &&
              iWindowX < 640 &&
              iWindowY >= 0 &&
              iWindowY < 320
            ) {
              s16BPPSrc =
                pSrcBuf[iWindowY * Math.trunc(uiSrcPitchBYTES / 2) + iWindowX];

              uiRGBColor = GetRGBColor(s16BPPSrc);

              bR += SGPGetRValue(uiRGBColor);
              bG += SGPGetGValue(uiRGBColor);
              bB += SGPGetBValue(uiRGBColor);

              // Average!
              iCount++;
            }
          }
        }

        if (iCount > 0) {
          bAvR = Math.trunc(bR / iCount);
          bAvG = Math.trunc(bG / iCount);
          bAvB = Math.trunc(bB / iCount);

          sDest16BPPColor = Get16BPPColor(FROMRGB(bAvR, bAvG, bAvB));
        }

        // Write into dest!
        pDestBuf[iY * Math.trunc(uiDestPitchBYTES / 2) + iX] = sDest16BPPColor;

        const idx = (iY * Math.trunc(uiDestPitchBYTES / 2) + iX) * 3;
        MapUtilScreenHandle__p24BitDest[idx] = bAvR;
        MapUtilScreenHandle__p24BitDest[idx + 1] = bAvG;
        MapUtilScreenHandle__p24BitDest[idx + 2] = bAvB;

        // Increment
        dY += gdYStep;
      }

      // Increment
      dX += gdXStep;
    }

    UnLockVideoSurface(giMiniMap);
    UnLockVideoSurface(FRAME_BUFFER);

    // RENDER!
    BltVideoSurface(
      FRAME_BUFFER,
      giMiniMap,
      0,
      20,
      360,
      VS_BLT_FAST | VS_BLT_USECOLORKEY,
      null,
    );

    // QUantize!
    pDataPtr = LockVideoSurface(
      gi8BitMiniMap,
      createPointer(
        () => uiSrcPitchBYTES,
        (v) => (uiSrcPitchBYTES = v),
      ),
    );
    pDestBuf = LockVideoSurface(
      FRAME_BUFFER,
      createPointer(
        () => uiDestPitchBYTES,
        (v) => (uiDestPitchBYTES = v),
      ),
    );
    QuantizeImage(
      pDataPtr,
      MapUtilScreenHandle__p24BitDest,
      MINIMAP_X_SIZE,
      MINIMAP_Y_SIZE,
      pPalette,
    );
    SetVideoSurfacePalette(ghvSurface, pPalette);
    // Blit!
    Blt8BPPDataTo16BPPBuffer(
      pDestBuf,
      uiDestPitchBYTES,
      ghvSurface,
      pDataPtr,
      300,
      360,
    );

    // Write palette!
    {
      let cnt: INT32;
      let sX: INT32 = 0;
      let sY: INT32 = 420;
      let usLineColor: UINT16;

      SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

      for (cnt = 0; cnt < 256; cnt++) {
        usLineColor = Get16BPPColor(
          FROMRGB(
            pPalette[cnt].peRed,
            pPalette[cnt].peGreen,
            pPalette[cnt].peBlue,
          ),
        );
        RectangleDraw(true, sX, sY, sX, sY + 10, usLineColor, pDestBuf);
        sX++;
        RectangleDraw(true, sX, sY, sX, sY + 10, usLineColor, pDestBuf);
        sX++;
      }
    }

    UnLockVideoSurface(FRAME_BUFFER);

    // Remove extension
    for (cnt = zFilename.length - 1; cnt >= 0; cnt--) {
      if (zFilename[cnt] == ".") {
        zFilename = zFilename.substring(0, cnt);
      }
    }

    zFilename2 = sprintf("RADARMAPS\\%s.STI", zFilename);
    WriteSTIFile(
      Buffer.from(pDataPtr.buffer, pDataPtr.byteOffset, pDataPtr.byteLength),
      pPalette,
      MINIMAP_X_SIZE,
      MINIMAP_Y_SIZE,
      zFilename2,
      CONVERT_ETRLE_COMPRESS,
      0,
    );

    UnLockVideoSurface(gi8BitMiniMap);

    SetFont(TINYFONT1());
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_DKGRAY);
    mprintf(10, 340, "Writing radar image %s", zFilename2);

    mprintf(10, 350, "Using tileset %s", gTilesets[giCurrentTilesetID].zName);

    InvalidateScreen();

    while (DequeueEvent(InputEvent) == true) {
      if (InputEvent.usEvent == KEY_DOWN && InputEvent.usParam == ESC) {
        // Exit the program
        gfProgramIsRunning = false;
      }
    }

    // Set next
    MapUtilScreenHandle__FListNode = MapUtilScreenHandle__FListNode.pNext;
    MapUtilScreenHandle__sCurFile++;

    return Enum26.MAPUTILITY_SCREEN;
  }

  export function MapUtilScreenShutdown(): boolean {
    return true;
  }
}
