namespace ja2 {
  export let gubLastLoadingScreenID: UINT8 = Enum22.LOADINGSCREEN_NOTHING;

  // returns the UINT8 ID for the specified sector.
  export function GetLoadScreenID(
    sSectorX: INT16,
    sSectorY: INT16,
    bSectorZ: INT8,
  ): UINT8 {
    let pSector: SECTORINFO;
    let ubSectorID: UINT8;
    let fNight: boolean = false;

    ubSectorID = SECTOR(sSectorX, sSectorY);
    if (NightTime()) {
      // before 5AM or after 9PM
      fNight = true;
    }
    switch (bSectorZ) {
      case 0:
        switch (ubSectorID) {
          case Enum123.SEC_A2:
          case Enum123.SEC_B2:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTCHITZENA;
            return Enum22.LOADINGSCREEN_DAYCHITZENA;
          case Enum123.SEC_A9:
            if (!DidGameJustStart()) {
              if (fNight) return Enum22.LOADINGSCREEN_NIGHTOMERTA;
              return Enum22.LOADINGSCREEN_DAYOMERTA;
            }
            return Enum22.LOADINGSCREEN_HELI;
          case Enum123.SEC_A10:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTOMERTA;
            return Enum22.LOADINGSCREEN_DAYOMERTA;
          case Enum123.SEC_P3:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTPALACE;
            return Enum22.LOADINGSCREEN_DAYPALACE;
          case Enum123.SEC_H13:
          case Enum123.SEC_H14: // military installations
          case Enum123.SEC_I13:
          case Enum123.SEC_N7:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTMILITARY;
            return Enum22.LOADINGSCREEN_DAYMILITARY;
          case Enum123.SEC_K4:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTLAB;
            return Enum22.LOADINGSCREEN_DAYLAB;
          case Enum123.SEC_J9:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTPRISON;
            return Enum22.LOADINGSCREEN_DAYPRISON;
          case Enum123.SEC_D2:
          case Enum123.SEC_D15:
          case Enum123.SEC_I8:
          case Enum123.SEC_N4:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTSAM;
            return Enum22.LOADINGSCREEN_DAYSAM;
          case Enum123.SEC_F8:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTHOSPITAL;
            return Enum22.LOADINGSCREEN_DAYHOSPITAL;
          case Enum123.SEC_B13:
          case Enum123.SEC_N3:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTAIRPORT;
            return Enum22.LOADINGSCREEN_DAYAIRPORT;
          case Enum123.SEC_L11:
          case Enum123.SEC_L12:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTBALIME;
            return Enum22.LOADINGSCREEN_DAYBALIME;
          case Enum123.SEC_H3:
          case Enum123.SEC_H8:
          case Enum123.SEC_D4:
            if (fNight) return Enum22.LOADINGSCREEN_NIGHTMINE;
            return Enum22.LOADINGSCREEN_DAYMINE;
        }
        pSector = SectorInfo[ubSectorID];
        switch (pSector.ubTraversability[4]) {
          case Enum127.TOWN:
            if (fNight) {
              if (Random(2)) {
                return Enum22.LOADINGSCREEN_NIGHTTOWN2;
              }
              return Enum22.LOADINGSCREEN_NIGHTTOWN1;
            }
            if (Random(2)) {
              return Enum22.LOADINGSCREEN_DAYTOWN2;
            }
            return Enum22.LOADINGSCREEN_DAYTOWN1;
          case Enum127.SAND:
          case Enum127.SAND_ROAD:
            if (fNight) {
              return Enum22.LOADINGSCREEN_NIGHTDESERT;
            }
            return Enum22.LOADINGSCREEN_DAYDESERT;
          case Enum127.FARMLAND:
          case Enum127.FARMLAND_ROAD:
          case Enum127.ROAD:
            if (fNight) {
              return Enum22.LOADINGSCREEN_NIGHTGENERIC;
            }
            return Enum22.LOADINGSCREEN_DAYGENERIC;
          case Enum127.PLAINS:
          case Enum127.SPARSE:
          case Enum127.HILLS:
          case Enum127.PLAINS_ROAD:
          case Enum127.SPARSE_ROAD:
          case Enum127.HILLS_ROAD:
            if (fNight) {
              return Enum22.LOADINGSCREEN_NIGHTWILD;
            }
            return Enum22.LOADINGSCREEN_DAYWILD;
          case Enum127.DENSE:
          case Enum127.SWAMP:
          case Enum127.SWAMP_ROAD:
          case Enum127.DENSE_ROAD:
            if (fNight) {
              return Enum22.LOADINGSCREEN_NIGHTFOREST;
            }
            return Enum22.LOADINGSCREEN_DAYFOREST;
          case Enum127.TROPICS:
          case Enum127.TROPICS_ROAD:
          case Enum127.WATER:
          case Enum127.NS_RIVER:
          case Enum127.EW_RIVER:
          case Enum127.COASTAL:
          case Enum127.COASTAL_ROAD:
            if (fNight) {
              return Enum22.LOADINGSCREEN_NIGHTTROPICAL;
            }
            return Enum22.LOADINGSCREEN_DAYTROPICAL;
          default:
            Assert(0);
            if (fNight) {
              return Enum22.LOADINGSCREEN_NIGHTGENERIC;
            }
            return Enum22.LOADINGSCREEN_DAYGENERIC;
        }
        break;
      case 1:
        switch (ubSectorID) {
          case Enum123.SEC_A10: // Miguel's basement
          case Enum123.SEC_I13: // Alma prison dungeon
          case Enum123.SEC_J9: // Tixa prison dungeon
          case Enum123.SEC_K4: // Orta weapons plant
          case Enum123.SEC_O3: // Meduna
          case Enum123.SEC_P3: // Meduna
            return Enum22.LOADINGSCREEN_BASEMENT;
          default: // rest are mines
            return Enum22.LOADINGSCREEN_MINE;
        }
        break;
      case 2:
      case 3:
        // all level 2 and 3 maps are caves!
        return Enum22.LOADINGSCREEN_CAVE;
      default:
        // shouldn't ever happen
        Assert(false);

        if (fNight) {
          return Enum22.LOADINGSCREEN_NIGHTGENERIC;
        }
        return Enum22.LOADINGSCREEN_DAYGENERIC;
    }
  }

  // sets up the loadscreen with specified ID, and draws it to the FRAME_BUFFER,
  // and refreshing the screen with it.
  export function DisplayLoadScreenWithID(ubLoadScreenID: UINT8): void {
    let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
    let hVSurface: SGPVSurface;
    let uiLoadScreen: UINT32;

    vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;

    switch (ubLoadScreenID) {
      case Enum22.LOADINGSCREEN_NOTHING:
        vs_desc.ImageFile = "LOADSCREENS\\LS_Heli.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYGENERIC:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayGeneric.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYTOWN1:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayTown1.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYTOWN2:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayTown2.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYWILD:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayWild.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYTROPICAL:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayTropical.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYFOREST:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayForest.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYDESERT:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayDesert.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYPALACE:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayPalace.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTGENERIC:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightGeneric.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTWILD:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightWild.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTTOWN1:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightTown1.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTTOWN2:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightTown2.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTFOREST:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightForest.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTTROPICAL:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightTropical.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTDESERT:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightDesert.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTPALACE:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightPalace.sti";
        break;
      case Enum22.LOADINGSCREEN_HELI:
        vs_desc.ImageFile = "LOADSCREENS\\LS_Heli.sti";
        break;
      case Enum22.LOADINGSCREEN_BASEMENT:
        vs_desc.ImageFile = "LOADSCREENS\\LS_Basement.sti";
        break;
      case Enum22.LOADINGSCREEN_MINE:
        vs_desc.ImageFile = "LOADSCREENS\\LS_Mine.sti";
        break;
      case Enum22.LOADINGSCREEN_CAVE:
        vs_desc.ImageFile = "LOADSCREENS\\LS_Cave.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYPINE:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayPine.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTPINE:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightPine.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYMILITARY:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayMilitary.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTMILITARY:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightMilitary.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYSAM:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DaySAM.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTSAM:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightSAM.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYPRISON:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayPrison.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTPRISON:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightPrison.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYHOSPITAL:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayHospital.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTHOSPITAL:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightHospital.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYAIRPORT:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayAirport.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTAIRPORT:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightAirport.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYLAB:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayLab.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTLAB:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightLab.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYOMERTA:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayOmerta.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTOMERTA:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightOmerta.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYCHITZENA:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayChitzena.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTCHITZENA:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightChitzena.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYMINE:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayMine.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTMINE:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightMine.sti";
        break;
      case Enum22.LOADINGSCREEN_DAYBALIME:
        vs_desc.ImageFile = "LOADSCREENS\\LS_DayBalime.sti";
        break;
      case Enum22.LOADINGSCREEN_NIGHTBALIME:
        vs_desc.ImageFile = "LOADSCREENS\\LS_NightBalime.sti";
        break;
      default:
        vs_desc.ImageFile = "LOADSCREENS\\LS_Heli.sti";
        break;
    }

    if (gfSchedulesHosed) {
      SetFont(FONT10ARIAL());
      SetFontForeground(FONT_YELLOW);
      SetFontShadow(FONT_NEARBLACK);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, 0);
      mprintf(
        5,
        5,
        "Error loading save, attempting to patch save to version 1.02...",
        vs_desc.ImageFile,
      );
    } else if ((uiLoadScreen = AddVideoSurface(vs_desc)) !== -1) {
      // Blit the background image
      hVSurface = GetVideoSurface(uiLoadScreen);
      BltVideoSurfaceToVideoSurface(
        <SGPVSurface>ghFrameBuffer,
        hVSurface,
        0,
        0,
        0,
        0,
        null,
      );
      DeleteVideoSurfaceFromIndex(uiLoadScreen);
    } else {
      // Failed to load the file, so use a black screen and print out message.
      SetFont(FONT10ARIAL());
      SetFontForeground(FONT_YELLOW);
      SetFontShadow(FONT_NEARBLACK);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, 0);
      mprintf(5, 5, "%s loadscreen data file not found...", vs_desc.ImageFile);
    }

    gubLastLoadingScreenID = ubLoadScreenID;
    InvalidateScreen();
    ExecuteBaseDirtyRectQueue();
    EndFrameBufferRender();
    RefreshScreen();
  }
}
