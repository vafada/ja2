namespace ja2 {
  export let gOpenDoorList: INT16[] /* [20] */ = [
    Enum312.FIRSTDOOR1,
    Enum312.SECONDDOOR1,
    Enum312.THIRDDOOR1,
    Enum312.FOURTHDOOR1,
    Enum312.FIRSTDOOR6,
    Enum312.SECONDDOOR6,
    Enum312.THIRDDOOR6,
    Enum312.FOURTHDOOR6,
    Enum312.FIRSTDOOR11,
    Enum312.SECONDDOOR11,
    Enum312.THIRDDOOR11,
    Enum312.FOURTHDOOR11,
    Enum312.FIRSTDOOR16,
    Enum312.SECONDDOOR16,
    Enum312.THIRDDOOR16,
    Enum312.FOURTHDOOR16,
    -1,
  ];

  let gOpenDoorShadowList: INT16[] /* [20] */ = [
    Enum312.FIRSTDOORSH1,
    Enum312.SECONDDOORSH1,
    Enum312.THIRDDOORSH1,
    Enum312.FOURTHDOORSH1,
    Enum312.FIRSTDOORSH6,
    Enum312.SECONDDOORSH6,
    Enum312.THIRDDOORSH6,
    Enum312.FOURTHDOORSH6,
    Enum312.FIRSTDOORSH11,
    Enum312.SECONDDOORSH11,
    Enum312.THIRDDOORSH11,
    Enum312.FOURTHDOORSH11,
    Enum312.FIRSTDOORSH16,
    Enum312.SECONDDOORSH16,
    Enum312.THIRDDOORSH16,
    Enum312.FOURTHDOORSH16,
    -1,
  ];

  export let gClosedDoorList: INT16[] /* [20] */ = [
    Enum312.FIRSTDOOR5,
    Enum312.SECONDDOOR5,
    Enum312.THIRDDOOR5,
    Enum312.FOURTHDOOR5,
    Enum312.FIRSTDOOR10,
    Enum312.SECONDDOOR10,
    Enum312.THIRDDOOR10,
    Enum312.FOURTHDOOR10,
    Enum312.FIRSTDOOR15,
    Enum312.SECONDDOOR15,
    Enum312.THIRDDOOR15,
    Enum312.FOURTHDOOR15,
    Enum312.FIRSTDOOR20,
    Enum312.SECONDDOOR20,
    Enum312.THIRDDOOR20,
    Enum312.FOURTHDOOR20,
    -1,
  ];

  let gClosedDoorShadowList: INT16[] /* [20] */ = [
    Enum312.FIRSTDOORSH5,
    Enum312.SECONDDOORSH5,
    Enum312.THIRDDOORSH5,
    Enum312.FOURTHDOORSH5,
    Enum312.FIRSTDOORSH10,
    Enum312.SECONDDOORSH10,
    Enum312.THIRDDOORSH10,
    Enum312.FOURTHDOORSH10,
    Enum312.FIRSTDOORSH15,
    Enum312.SECONDDOORSH15,
    Enum312.THIRDDOORSH15,
    Enum312.FOURTHDOORSH15,
    Enum312.FIRSTDOORSH20,
    Enum312.SECONDDOORSH20,
    Enum312.THIRDDOORSH20,
    Enum312.FOURTHDOORSH20,
    -1,
  ];

  // REVERSE BUDDIES FROM SHADOW BACK TO STRUCT
  let gReverseShadowBuddys: INT16[] /* [] */ = [
    Enum313.FIRSTCLIFFSHADOW,
    Enum312.FIRSTCLIFFSHADOW1,
    Enum312.FIRSTCLIFF1,

    Enum313.FIRSTSHADOW,
    Enum312.FIRSTSHADOW1,
    Enum312.FIRSTOSTRUCT1,
    Enum313.SECONDSHADOW,
    Enum312.SECONDSHADOW1,
    Enum312.SECONDOSTRUCT1,
    Enum313.THIRDSHADOW,
    Enum312.THIRDSHADOW1,
    Enum312.THIRDOSTRUCT1,
    Enum313.FOURTHSHADOW,
    Enum312.FOURTHSHADOW1,
    Enum312.FOURTHOSTRUCT1,
    Enum313.FIFTHSHADOW,
    Enum312.FIFTHSHADOW1,
    Enum312.FIFTHOSTRUCT1,
    Enum313.SIXTHSHADOW,
    Enum312.SIXTHSHADOW1,
    Enum312.SIXTHOSTRUCT1,
    Enum313.SEVENTHSHADOW,
    Enum312.SEVENTHSHADOW1,
    Enum312.SEVENTHOSTRUCT1,
    Enum313.EIGHTSHADOW,
    Enum312.EIGHTSHADOW1,
    Enum312.EIGHTOSTRUCT1,

    Enum313.FIRSTFULLSHADOW,
    Enum312.FIRSTFULLSHADOW1,
    Enum312.FIRSTFULLSTRUCT1,
    Enum313.SECONDFULLSHADOW,
    Enum312.SECONDFULLSHADOW1,
    Enum312.SECONDFULLSTRUCT1,
    Enum313.THIRDFULLSHADOW,
    Enum312.THIRDFULLSHADOW1,
    Enum312.THIRDFULLSTRUCT1,
    Enum313.FOURTHFULLSHADOW,
    Enum312.FOURTHFULLSHADOW1,
    Enum312.FOURTHFULLSTRUCT1,

    Enum313.FIRSTDOORSHADOW,
    Enum312.FIRSTDOORSH1,
    Enum312.FIRSTDOOR1,
    Enum313.SECONDDOORSHADOW,
    Enum312.SECONDDOORSH1,
    Enum312.SECONDDOOR1,
    Enum313.THIRDDOORSHADOW,
    Enum312.THIRDDOORSH1,
    Enum312.THIRDDOOR1,
    Enum313.FOURTHDOORSHADOW,
    Enum312.FOURTHDOORSH1,
    Enum312.FOURTHDOOR1,

    // FENCE
    Enum313.FENCESHADOW,
    Enum312.FENCESHADOW1,
    Enum312.FENCESTRUCT1,

    // VEHICLES
    Enum313.FIRSTVEHICLESHADOW,
    Enum312.FIRSTVEHICLESHADOW1,
    Enum312.FIRSTVEHICLE1,
    Enum313.SECONDVEHICLESHADOW,
    Enum312.SECONDVEHICLESHADOW1,
    Enum312.SECONDVEHICLE1,

    // DebrisSTRUCT
    Enum313.FIRSTDEBRISSTRUCTSHADOW,
    Enum312.FIRSTDEBRISSTRUCTSHADOW1,
    Enum312.FIRSTDEBRISSTRUCT1,
    Enum313.SECONDDEBRISSTRUCTSHADOW,
    Enum312.SECONDDEBRISSTRUCTSHADOW1,
    Enum312.SECONDDEBRISSTRUCT1,

    Enum313.NINTHOSTRUCTSHADOW,
    Enum312.NINTHOSTRUCTSHADOW1,
    Enum312.NINTHOSTRUCT1,
    Enum313.TENTHOSTRUCTSHADOW,
    Enum312.TENTHOSTRUCTSHADOW1,
    Enum312.TENTHOSTRUCT1,

    Enum313.FIRSTLARGEEXPDEBRISSHADOW,
    Enum312.FIRSTLARGEEXPDEBRISSHADOW1,
    Enum312.FIRSTLARGEEXPDEBRIS1,
    Enum313.SECONDLARGEEXPDEBRISSHADOW,
    Enum312.SECONDLARGEEXPDEBRISSHADOW1,
    Enum312.SECONDLARGEEXPDEBRIS1,

    -1,
  ];

  // SHADOW BUDDIES FROM STRUCT FORWARD TO SHADOW
  let gForwardShadowBuddys: INT16[] /* [] */ = [
    Enum313.FIRSTCLIFF,
    Enum312.FIRSTCLIFF1,
    Enum312.FIRSTCLIFFSHADOW1,

    Enum313.FIRSTOSTRUCT,
    Enum312.FIRSTOSTRUCT1,
    Enum312.FIRSTSHADOW1,
    Enum313.SECONDOSTRUCT,
    Enum312.SECONDOSTRUCT1,
    Enum312.SECONDSHADOW1,
    Enum313.THIRDOSTRUCT,
    Enum312.THIRDOSTRUCT1,
    Enum312.THIRDSHADOW1,
    Enum313.FOURTHOSTRUCT,
    Enum312.FOURTHOSTRUCT1,
    Enum312.FOURTHSHADOW1,
    Enum313.FIFTHOSTRUCT,
    Enum312.FIFTHOSTRUCT1,
    Enum312.FIFTHSHADOW1,
    Enum313.SIXTHOSTRUCT,
    Enum312.SIXTHOSTRUCT1,
    Enum312.SIXTHSHADOW1,
    Enum313.SEVENTHOSTRUCT,
    Enum312.SEVENTHOSTRUCT1,
    Enum312.SEVENTHSHADOW1,
    Enum313.EIGHTOSTRUCT,
    Enum312.EIGHTOSTRUCT1,
    Enum312.EIGHTSHADOW1,

    Enum313.FIRSTFULLSTRUCT,
    Enum312.FIRSTFULLSTRUCT1,
    Enum312.FIRSTFULLSHADOW1,
    Enum313.SECONDFULLSTRUCT,
    Enum312.SECONDFULLSTRUCT1,
    Enum312.SECONDFULLSHADOW1,
    Enum313.THIRDFULLSTRUCT,
    Enum312.THIRDFULLSTRUCT1,
    Enum312.THIRDFULLSHADOW1,
    Enum313.FOURTHFULLSTRUCT,
    Enum312.FOURTHFULLSTRUCT1,
    Enum312.FOURTHFULLSHADOW1,

    Enum313.FIRSTDOOR,
    Enum312.FIRSTDOOR1,
    Enum312.FIRSTDOORSH1,
    Enum313.SECONDDOOR,
    Enum312.SECONDDOOR1,
    Enum312.SECONDDOORSH1,
    Enum313.THIRDDOOR,
    Enum312.THIRDDOOR1,
    Enum312.THIRDDOORSH1,
    Enum313.FOURTHDOOR,
    Enum312.FOURTHDOOR1,
    Enum312.FOURTHDOORSH1,

    // FENCE
    Enum313.FENCESTRUCT,
    Enum312.FENCESTRUCT1,
    Enum312.FENCESHADOW1,

    // VEHICLE
    Enum313.FIRSTVEHICLE,
    Enum312.FIRSTVEHICLE1,
    Enum312.FIRSTVEHICLESHADOW1,
    Enum313.SECONDVEHICLE,
    Enum312.SECONDVEHICLE1,
    Enum312.SECONDVEHICLESHADOW1,

    Enum313.FIRSTDEBRISSTRUCT,
    Enum312.FIRSTDEBRISSTRUCT1,
    Enum312.FIRSTDEBRISSTRUCTSHADOW1,
    Enum313.SECONDDEBRISSTRUCT,
    Enum312.SECONDDEBRISSTRUCT1,
    Enum312.SECONDDEBRISSTRUCTSHADOW1,

    Enum313.NINTHOSTRUCT,
    Enum312.NINTHOSTRUCT1,
    Enum312.NINTHOSTRUCTSHADOW1,
    Enum313.TENTHOSTRUCT,
    Enum312.TENTHOSTRUCT1,
    Enum312.TENTHOSTRUCTSHADOW1,

    Enum313.FIRSTLARGEEXPDEBRIS,
    Enum312.FIRSTLARGEEXPDEBRIS1,
    Enum312.FIRSTLARGEEXPDEBRISSHADOW1,
    Enum313.SECONDLARGEEXPDEBRIS,
    Enum312.SECONDLARGEEXPDEBRIS1,
    Enum312.SECONDLARGEEXPDEBRISSHADOW1,

    -1,
  ];

  // Global variable used to initialize tile database with full tile spec
  let gFullBaseTileValues: UINT8[] /* [] */ = [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // First Texture
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // Second Texture
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // Third Texture
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // Forth Texture
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // Fifth Texture
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // Sixth Texture
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // Seventh Texture
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // Water1 Texture
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // Water2 Texture
  ];

  export let gTileSurfaceName: string[] /* STR[NUMBEROFTILETYPES] */ = [
    "TEXTURE1",
    "TEXTURE2",
    "TEXTURE3",
    "TEXTURE4",
    "TEXTURE5",
    "TEXTURE6",
    "TEXTURE7",
    "WATER1",
    "DEEP WATER",
    "FIRSTCLIFFHANG",
    "FIRSTCLIFF",
    "FIRSTCLIFFSHADOW",
    "OSTRUCT1",
    "OSTRUCT2",
    "OSTRUCT3",
    "OSTRUCT4",
    "OSTRUCT5",
    "OSTRUCT6",
    "OSTRUCT7",
    "OSTRUCT8",
    "OFSTRUCT1",
    "OFSTRUCT2",
    "PLACEHOLDER1",
    "PLACEHOLDER2",

    "SHADOW1",
    "SHADOW2",
    "SHADOW3",
    "SHADOW4",
    "SHADOW5",
    "SHADOW6",
    "SHADOW7",
    "SHADOW8",
    "FSHADOW1",
    "FSHADOW2",
    "PLACEHOLDER3",
    "PLACEHOLDER4",

    "WALL1",
    "WALL2",
    "WALL3",
    "WALL4",
    "DOOR1",
    "DOOR2",
    "DOOR3",
    "DOOR4",
    "DOORSH1",
    "DOORSH2",
    "DOORSH3",
    "DOORSH4",
    "SLANTFLATPEICE",
    "ANOTHERDEBRIS",
    "ROADPIECES",
    "WINDOW4",
    "DECORATIONS1",
    "DECORATIONS2",
    "DECORATIONS3",
    "DECORATIONS4",
    "WALLDECAL1",
    "WALLDECAL2",
    "WALLDECAL3",
    "WALLDECAL4",
    "FLOOR1",
    "FLOOR2",
    "FLOOR3",
    "FLOOR4",
    "ROOF1",
    "ROOF2",
    "ROOF3",
    "ROOF4",
    "SROOF1",
    "SROOF2",
    "ONROOF1",
    "ONROOF2",
    "MOCKF1",

    "ISTRUCT1",
    "ISTRUCT2",
    "ISTRUCT3",
    "ISTRUCT4",

    "FIRSTCISTRCUT",

    "FIRSTROAD",

    "ROCKS",
    "WOOD",
    "WEEDS",
    "GRASS",
    "SAND",
    "MISC",

    "ANIOSTRUCT",
    "FENCESTRUCT",
    "FENCESHADOW",

    "FIRSTVEHICLE",
    "SECONDVEHICLE",
    "FIRSTVEHICLESHADOW",
    "SECONDVEHICLESHADOW",
    "MISC2",
    "FIRSTDEBRISSTRUCT",
    "SECONDDEBRISSTRUCT",
    "FIRSTDEBRISSTRUCTSHADOW",
    "SECONDDEBRISSTRUCTSHADOW",
    "NINTHOSTRUCT",
    "TENTHOSTRUCT",
    "NINTHOSTRUCTSHADOW",
    "TENTHOSTRUCTSHADOW",

    "FIRSTEXPLODEDEBRIS",
    "SECONDEXPLODEDEBRIS",
    "FIRSTLARGEEXPLODEDEBRIS",
    "SECONDLARGEEXPLODEDEBRIS",
    "FIRSTLARGEEXPLODEDEBRISSHADOW",
    "SECONDLARGEEXPLODEDEBRISSHADOW",

    "FIFTHISTRUCT",
    "SIXTHISTRUCT",
    "SEVENTHISTRUCT",
    "EIGHTISTRUCT",

    "FIRSTHIGHROOF",
    "SECONDHIGHROOF",

    "WALLDECAL5",
    "WALLDECAL6",
    "WALLDECAL7",
    "WALLDECAL8",

    "HUMANBLOOD",
    "CREATUREBLOOD",
    "FIRSTSWITCHES",

    // ABSOLUTELY NO STUFF PAST HERE!
    // CAN BE SAVED IN THE MAP DIRECTLY!
    "REVEALEDSLANTROOF",
    "1stREVEALEDHIGHROOF",
    "2ndREVEALEDHIGHROOF",

    "GUNS",
    "ITEMS",
    "ITEMS2",

    "GLASSSHATTER",
    "ITEMS3",
    "BODYBLOW",

    "EXITTEXTURE",
    "FOOTPRINTS",
    "POINTERS",
    "POINTERS2",
    "POINTERS3",

    "GOODRUN",
    "GOODWALK",
    "GOODSWAT",
    "GOODSCOOT",
    "CONFIRMMOVE",
    "VEHICLEMOVE",
    "ACTIONTWO",
    "BADMARKER",
    "GRING",
    "ROTATINGKEY",
    "SELRING",
    "SPECIAL",
    "BULLET",
    "MISS1",
    "MISS2",
    "MISS3",
    "WIREFRAME",
  ];

  export let gNumTilesPerType: UINT16[] /* [NUMBEROFTILETYPES] */ = [
    Enum312.FIRSTTEXTURE35 - Enum312.FIRSTTEXTURE1 + 1,
    Enum312.SECONDTEXTURE35 - Enum312.SECONDTEXTURE1 + 1,
    Enum312.THIRDTEXTURE35 - Enum312.THIRDTEXTURE1 + 1,
    Enum312.FOURTHTEXTURE35 - Enum312.FOURTHTEXTURE1 + 1,
    Enum312.FIFTHTEXTURE35 - Enum312.FIFTHTEXTURE1 + 1,
    Enum312.SIXTHTEXTURE37 - Enum312.SIXTHTEXTURE1 + 1,
    Enum312.SEVENTHTEXTURE49 - Enum312.SEVENTHTEXTURE1 + 1,
    Enum312.REGWATERTEXTURE50 - Enum312.REGWATERTEXTURE1 + 1,
    Enum312.DEEPWATERTEXTURE37 - Enum312.DEEPWATERTEXTURE1 + 1,
    Enum312.FIRSTCLIFFHANG17 - Enum312.FIRSTCLIFFHANG1 + 1,
    Enum312.FIRSTCLIFF17 - Enum312.FIRSTCLIFF1 + 1,
    Enum312.FIRSTCLIFFSHADOW17 - Enum312.FIRSTCLIFFSHADOW1 + 1, // Med hill

    Enum312.FIRSTOSTRUCT12 - Enum312.FIRSTOSTRUCT1 + 1,
    Enum312.SECONDOSTRUCT12 - Enum312.SECONDOSTRUCT1 + 1,
    Enum312.THIRDOSTRUCT12 - Enum312.THIRDOSTRUCT1 + 1,
    Enum312.FOURTHOSTRUCT12 - Enum312.FOURTHOSTRUCT1 + 1, // Fourth OSTRUCT
    Enum312.FIFTHOSTRUCT12 - Enum312.FIFTHOSTRUCT1 + 1, // Fifth OSTRUCT
    Enum312.SIXTHOSTRUCT12 - Enum312.SIXTHOSTRUCT1 + 1, // Sixth OSTRUCT
    Enum312.SEVENTHOSTRUCT12 - Enum312.SEVENTHOSTRUCT1 + 1, // Seventh OSTRUCT
    Enum312.EIGHTOSTRUCT12 - Enum312.EIGHTOSTRUCT1 + 1, // Eigth OSTRUCT
    Enum312.FIRSTFULLSTRUCT12 - Enum312.FIRSTFULLSTRUCT1 + 1,
    Enum312.SECONDFULLSTRUCT12 - Enum312.SECONDFULLSTRUCT1 + 1,
    Enum312.THIRDFULLSTRUCT2 - Enum312.THIRDFULLSTRUCT1 + 1,
    Enum312.FOURTHFULLSTRUCT2 - Enum312.FOURTHFULLSTRUCT1 + 1,

    Enum312.FIRSTSHADOW12 - Enum312.FIRSTSHADOW1 + 1,
    Enum312.SECONDSHADOW12 - Enum312.SECONDSHADOW1 + 1,
    Enum312.THIRDSHADOW12 - Enum312.THIRDSHADOW1 + 1,
    Enum312.FOURTHSHADOW12 - Enum312.FOURTHSHADOW1 + 1,
    Enum312.FIFTHSHADOW12 - Enum312.FIFTHSHADOW1 + 1,
    Enum312.SIXTHSHADOW12 - Enum312.SIXTHSHADOW1 + 1,
    Enum312.SEVENTHSHADOW12 - Enum312.SEVENTHSHADOW1 + 1,
    Enum312.EIGHTSHADOW12 - Enum312.EIGHTSHADOW1 + 1,
    Enum312.FIRSTFULLSHADOW12 - Enum312.FIRSTFULLSHADOW1 + 1,
    Enum312.SECONDFULLSHADOW12 - Enum312.SECONDFULLSHADOW1 + 1,
    Enum312.THIRDFULLSHADOW2 - Enum312.THIRDFULLSHADOW1 + 1,
    Enum312.FOURTHFULLSHADOW2 - Enum312.FOURTHFULLSHADOW1 + 1,

    Enum312.FIRSTWALL65 - Enum312.FIRSTWALL1 + 1,
    Enum312.SECONDWALL65 - Enum312.SECONDWALL1 + 1,
    Enum312.THIRDWALL65 - Enum312.THIRDWALL1 + 1,
    Enum312.FOURTHWALL65 - Enum312.FOURTHWALL1 + 1,

    Enum312.FIRSTDOOR20 - Enum312.FIRSTDOOR1 + 1,
    Enum312.SECONDDOOR20 - Enum312.SECONDDOOR1 + 1,
    Enum312.THIRDDOOR20 - Enum312.THIRDDOOR1 + 1,
    Enum312.FOURTHDOOR20 - Enum312.FOURTHDOOR1 + 1,

    Enum312.FIRSTDOORSH20 - Enum312.FIRSTDOORSH1 + 1,
    Enum312.SECONDDOORSH20 - Enum312.SECONDDOORSH1 + 1,
    Enum312.THIRDDOORSH20 - Enum312.THIRDDOORSH1 + 1,
    Enum312.FOURTHDOORSH20 - Enum312.FOURTHDOORSH1 + 1,

    Enum312.SLANTROOFCEILING2 - Enum312.SLANTROOFCEILING1 + 1,
    Enum312.ANOTHERDEBRIS10 - Enum312.ANOTHERDEBRIS1 + 1,
    Enum312.ROADPIECES400 - Enum312.ROADPIECES001 + 1,
    Enum312.FOURTHWINDOW2 - Enum312.FOURTHWINDOW1 + 1,

    Enum312.FIRSTDECORATIONS10 - Enum312.FIRSTDECORATIONS1 + 1,
    Enum312.SECONDDECORATIONS10 - Enum312.SECONDDECORATIONS1 + 1,
    Enum312.THIRDDECORATIONS10 - Enum312.THIRDDECORATIONS1 + 1,
    Enum312.FOURTHDECORATIONS10 - Enum312.FOURTHDECORATIONS1 + 1,

    Enum312.FIRSTWALLDECAL10 - Enum312.FIRSTWALLDECAL1 + 1,
    Enum312.SECONDWALLDECAL10 - Enum312.SECONDWALLDECAL1 + 1,
    Enum312.THIRDWALLDECAL10 - Enum312.THIRDWALLDECAL1 + 1,
    Enum312.FOURTHWALLDECAL10 - Enum312.FOURTHWALLDECAL1 + 1,

    Enum312.FIRSTFLOOR8 - Enum312.FIRSTFLOOR1 + 1,
    Enum312.SECONDFLOOR8 - Enum312.SECONDFLOOR1 + 1,
    Enum312.THIRDFLOOR8 - Enum312.THIRDFLOOR1 + 1,
    Enum312.FOURTHFLOOR8 - Enum312.FOURTHFLOOR1 + 1,

    Enum312.FIRSTROOF14 - Enum312.FIRSTROOF1 + 1,
    Enum312.SECONDROOF14 - Enum312.SECONDROOF1 + 1,
    Enum312.THIRDROOF14 - Enum312.THIRDROOF1 + 1,
    Enum312.FOURTHROOF14 - Enum312.FOURTHROOF1 + 1,
    Enum312.FIRSTSLANTROOF20 - Enum312.FIRSTSLANTROOF1 + 1,
    Enum312.SECONDSLANTROOF20 - Enum312.SECONDSLANTROOF1 + 1,

    Enum312.FIRSTONROOF12 - Enum312.FIRSTONROOF1 + 1,
    Enum312.SECONDONROOF12 - Enum312.SECONDONROOF1 + 1,

    1,

    Enum312.FIRSTISTRUCT24 - Enum312.FIRSTISTRUCT1 + 1,
    Enum312.SECONDISTRUCT24 - Enum312.SECONDISTRUCT1 + 1,
    Enum312.THIRDISTRUCT24 - Enum312.THIRDISTRUCT1 + 1,
    Enum312.FOURTHISTRUCT24 - Enum312.FOURTHISTRUCT1 + 1,
    Enum312.FIRSTCISTRUCT24 - Enum312.FIRSTCISTRUCT1 + 1,

    Enum312.FIRSTROAD35 - Enum312.FIRSTROAD1 + 1,

    Enum312.DEBRISROCKS10 - Enum312.DEBRISROCKS1 + 1,
    Enum312.DEBRISWOOD10 - Enum312.DEBRISWOOD1 + 1,
    Enum312.DEBRISWEEDS10 - Enum312.DEBRISWEEDS1 + 1,
    Enum312.DEBRISGRASS10 - Enum312.DEBRISGRASS1 + 1,
    Enum312.DEBRISSAND10 - Enum312.DEBRISSAND1 + 1,
    Enum312.DEBRISMISC10 - Enum312.DEBRISMISC1 + 1,

    Enum312.ANIOSTRUCT20 - Enum312.ANIOSTRUCT1 + 1,
    Enum312.FENCESTRUCT23 - Enum312.FENCESTRUCT1 + 1,
    Enum312.FENCESHADOW23 - Enum312.FENCESHADOW1 + 1,
    Enum312.FIRSTVEHICLE12 - Enum312.FIRSTVEHICLE1 + 1,
    Enum312.SECONDVEHICLE12 - Enum312.SECONDVEHICLE1 + 1,
    Enum312.FIRSTVEHICLESHADOW12 - Enum312.FIRSTVEHICLESHADOW1 + 1,
    Enum312.SECONDVEHICLESHADOW12 - Enum312.SECONDVEHICLESHADOW1 + 1,
    Enum312.DEBRIS2MISC10 - Enum312.DEBRIS2MISC1 + 1,

    Enum312.FIRSTDEBRISSTRUCT10 - Enum312.FIRSTDEBRISSTRUCT1 + 1,
    Enum312.SECONDDEBRISSTRUCT10 - Enum312.SECONDDEBRISSTRUCT1 + 1,
    Enum312.FIRSTDEBRISSTRUCTSHADOW10 - Enum312.FIRSTDEBRISSTRUCTSHADOW1 + 1,
    Enum312.SECONDDEBRISSTRUCTSHADOW10 - Enum312.SECONDDEBRISSTRUCTSHADOW1 + 1,

    Enum312.NINTHOSTRUCT12 - Enum312.NINTHOSTRUCT1 + 1,
    Enum312.TENTHOSTRUCT12 - Enum312.TENTHOSTRUCT1 + 1,
    Enum312.NINTHOSTRUCTSHADOW12 - Enum312.NINTHOSTRUCTSHADOW1 + 1,
    Enum312.TENTHOSTRUCTSHADOW12 - Enum312.TENTHOSTRUCTSHADOW1 + 1,

    Enum312.FIRSTEXPLDEBRIS40 - Enum312.FIRSTEXPLDEBRIS1 + 1,
    Enum312.SECONDEXPLDEBRIS40 - Enum312.SECONDEXPLDEBRIS1 + 1,
    Enum312.FIRSTLARGEEXPDEBRIS10 - Enum312.FIRSTLARGEEXPDEBRIS1 + 1,
    Enum312.SECONDLARGEEXPDEBRIS10 - Enum312.SECONDLARGEEXPDEBRIS1 + 1,
    Enum312.FIRSTLARGEEXPDEBRISSHADOW10 -
      Enum312.FIRSTLARGEEXPDEBRISSHADOW1 +
      1,
    Enum312.SECONDLARGEEXPDEBRISSHADOW10 -
      Enum312.SECONDLARGEEXPDEBRISSHADOW1 +
      1,

    Enum312.FIFTHISTRUCT24 - Enum312.FIFTHISTRUCT1 + 1,
    Enum312.SIXTHISTRUCT24 - Enum312.SIXTHISTRUCT1 + 1,
    Enum312.SEVENTHISTRUCT24 - Enum312.SEVENTHISTRUCT1 + 1,
    Enum312.EIGHTISTRUCT24 - Enum312.EIGHTISTRUCT1 + 1,

    Enum312.FIRSTHIGHROOF15 - Enum312.FIRSTHIGHROOF1 + 1,
    Enum312.SECONDHIGHROOF15 - Enum312.SECONDHIGHROOF1 + 1,

    Enum312.FIFTHWALLDECAL10 - Enum312.FIFTHWALLDECAL1 + 1,
    Enum312.SIXTHWALLDECAL10 - Enum312.SIXTHWALLDECAL1 + 1,
    Enum312.SEVENTHWALLDECAL10 - Enum312.SEVENTHWALLDECAL1 + 1,
    Enum312.EIGTHWALLDECAL10 - Enum312.EIGTHWALLDECAL1 + 1,

    Enum312.HUMANBLOOD16 - Enum312.HUMANBLOOD1 + 1,
    Enum312.CREATUREBLOOD16 - Enum312.CREATUREBLOOD1 + 1,
    Enum312.FIRSTSWITCHES21 - Enum312.FIRSTSWITCHES1 + 1,

    // NO SAVED STUFF AFTER HERE!
    Enum312.REVEALEDSLANTROOFS8 - Enum312.REVEALEDSLANTROOFS1 + 1,
    Enum312.FIRSTREVEALEDHIGHROOFS11 - Enum312.FIRSTREVEALEDHIGHROOFS1 + 1,
    Enum312.SECONDREVEALEDHIGHROOFS11 - Enum312.SECONDREVEALEDHIGHROOFS1 + 1,

    Enum312.GUN60 - Enum312.GUN1 + 1,
    Enum312.P1ITEM149 - Enum312.P1ITEM1 + 1,
    Enum312.P2ITEM45 - Enum312.P2ITEM1 + 1,

    Enum312.WINDOWSHATTER20 - Enum312.WINDOWSHATTER1 + 1,
    Enum312.P3ITEM16 - Enum312.P3ITEM1 + 1,
    Enum312.BODYEXPLOSION15 - Enum312.BODYEXPLOSION1 + 1,

    Enum312.EXITTEXTURE35 - Enum312.EXITTEXTURE1 + 1,
    Enum312.FOOTPRINTS80 - Enum312.FOOTPRINTS1 + 1,

    Enum312.FIRSTPOINTERS24 - Enum312.FIRSTPOINTERS1 + 1,
    Enum312.SECONDPOINTERS8 - Enum312.SECONDPOINTERS1 + 1,
    Enum312.THIRDPOINTERS3 - Enum312.THIRDPOINTERS1 + 1,

    Enum312.GOODRUN11 - Enum312.GOODRUN1 + 1,
    Enum312.GOODWALK11 - Enum312.GOODWALK1 + 1,
    Enum312.GOODSWAT11 - Enum312.GOODSWAT1 + 1,
    Enum312.GOODPRONE11 - Enum312.GOODPRONE1 + 1,
    Enum312.CONFIRMMOVE11 - Enum312.CONFIRMMOVE1 + 1,
    Enum312.VEHICLEMOVE10 - Enum312.VEHICLEMOVE1 + 1,
    Enum312.ACTIONTWO11 - Enum312.ACTIONTWO1 + 1,
    Enum312.BADMARKER11 - Enum312.BADMARKER1 + 1,
    Enum312.GOODRING10 - Enum312.GOODRING1 + 1,
    Enum312.ROTATINGKEY8 - Enum312.ROTATINGKEY1 + 1,
    Enum312.SELRING10 - Enum312.SELRING1 + 1,
    Enum312.SPECIALTILE_COVER_5 - Enum312.SPECIALTILE_MAPEXIT + 1,
    Enum312.BULLETTILE2 - Enum312.BULLETTILE1 + 1,

    Enum312.FIRSTMISS5 - Enum312.FIRSTMISS1 + 1,
    Enum312.SECONDMISS5 - Enum312.SECONDMISS1 + 1,
    Enum312.THIRDMISS14 - Enum312.THIRDMISS1 + 1,
    Enum312.WIREFRAMES15 - Enum312.WIREFRAMES1 + 1,
  ];

  export let gTileTypeLogicalHeight: UINT8[] /* [NUMBEROFTILETYPES] */ = [
    2, // First texture
    2, // Second texture
    2, // Third texture
    2, // Forth texture
    2, // Fifth texture
    2, // Sixth texture
    2, // Seventh texture
    10, // First water
    10, // Second water
  ];

  export function SetSpecificDatabaseValues(
    usType: UINT16,
    uiDatabaseElem: UINT16,
    TileElement: TILE_ELEMENT,
    fUseRaisedObjectType: boolean,
  ): void {
    let ubLoop: UINT8;
    let sIndexDiff: INT16;
    let cnt: UINT32;

    // SETUP BUDDYS FOR SHADOWS
    cnt = 0;
    while (gReverseShadowBuddys[cnt] != -1) {
      // IF WE ARE A SHADOW TYPE
      if (usType == gReverseShadowBuddys[cnt]) {
        TileElement.sBuddyNum =
          gReverseShadowBuddys[cnt + 2] +
          (uiDatabaseElem - gReverseShadowBuddys[cnt + 1]);

        // Check flags and made the same, take from buddy's
        TileElement.uiFlags |= gTileDatabase[TileElement.sBuddyNum].uiFlags;
      }

      cnt += 3;
    }

    // SETUP BUDDYS THAT GO FROM STRUCT TO SHADOW
    cnt = 0;
    while (gForwardShadowBuddys[cnt] != -1) {
      // IF WE ARE A SHADOW TYPE
      if (usType == gForwardShadowBuddys[cnt]) {
        TileElement.sBuddyNum =
          gForwardShadowBuddys[cnt + 2] +
          (uiDatabaseElem - gForwardShadowBuddys[cnt + 1]);
        // Set flag indicating such
        TileElement.uiFlags |= HAS_SHADOW_BUDDY;
      }
      cnt += 3;
    }

    if (
      uiDatabaseElem >= Enum312.FIRSTDOOR1 &&
      uiDatabaseElem <= Enum312.FOURTHDOORSH20
    ) {
      // Door anims
      // Open
      cnt = 0;
      while (gOpenDoorList[cnt] != -1) {
        // IF WE ARE A SHADOW TYPE
        if (uiDatabaseElem == gOpenDoorList[cnt]) {
          // Allocate Animated tile data
          AllocateAnimTileData(TileElement, 5);
          Assert(TileElement.pAnimData);

          TileElement.pAnimData.bCurrentFrame = 0;
          for (
            ubLoop = 0;
            ubLoop < TileElement.pAnimData.ubNumFrames;
            ubLoop++
          ) {
            TileElement.pAnimData.pusFrames[ubLoop] = uiDatabaseElem + ubLoop;
          }
        }
        cnt++;
      }
      // Open Shadow
      cnt = 0;
      while (gOpenDoorShadowList[cnt] != -1) {
        // IF WE ARE A SHADOW TYPE
        if (uiDatabaseElem == gOpenDoorShadowList[cnt]) {
          // Allocate Animated tile data
          AllocateAnimTileData(TileElement, 5);
          Assert(TileElement.pAnimData);

          TileElement.pAnimData.bCurrentFrame = 0;
          for (
            ubLoop = 0;
            ubLoop < TileElement.pAnimData.ubNumFrames;
            ubLoop++
          ) {
            TileElement.pAnimData.pusFrames[ubLoop] = uiDatabaseElem + ubLoop;
          }
        }
        cnt++;
      }

      // Closed
      cnt = 0;
      while (gClosedDoorList[cnt] != -1) {
        // IF WE ARE A SHADOW TYPE
        if (uiDatabaseElem == gClosedDoorList[cnt]) {
          // Allocate Animated tile data
          AllocateAnimTileData(TileElement, 5);
          Assert(TileElement.pAnimData);

          TileElement.pAnimData.bCurrentFrame = 0;
          for (
            ubLoop = 0;
            ubLoop < TileElement.pAnimData.ubNumFrames;
            ubLoop++
          ) {
            TileElement.pAnimData.pusFrames[ubLoop] = uiDatabaseElem - ubLoop;
          }
        }
        cnt++;
      }
      // Open Shadow
      cnt = 0;
      while (gClosedDoorShadowList[cnt] != -1) {
        // IF WE ARE A SHADOW TYPE
        if (uiDatabaseElem == gClosedDoorShadowList[cnt]) {
          // Allocate Animated tile data
          AllocateAnimTileData(TileElement, 5);
          Assert(TileElement.pAnimData);

          TileElement.pAnimData.bCurrentFrame = 0;
          for (
            ubLoop = 0;
            ubLoop < TileElement.pAnimData.ubNumFrames;
            ubLoop++
          ) {
            TileElement.pAnimData.pusFrames[ubLoop] = uiDatabaseElem - ubLoop;
          }
        }
        cnt++;
      }
    }

    if (uiDatabaseElem == Enum312.FIRSTMISS1) {
      // Allocate Animated tile data
      AllocateAnimTileData(TileElement, 5);
      Assert(TileElement.pAnimData);

      TileElement.pAnimData.bCurrentFrame = 0;
      for (ubLoop = 0; ubLoop < TileElement.pAnimData.ubNumFrames; ubLoop++) {
        TileElement.pAnimData.pusFrames[ubLoop] = uiDatabaseElem + ubLoop;
      }
    }

    if (
      uiDatabaseElem >= Enum312.FIRSTMISS1 &&
      uiDatabaseElem <= Enum312.FIRSTMISS5
    ) {
      TileElement.uiFlags |= DYNAMIC_TILE;
    }

    if (
      uiDatabaseElem == Enum312.WINDOWSHATTER1 ||
      uiDatabaseElem == Enum312.WINDOWSHATTER6 ||
      uiDatabaseElem == Enum312.WINDOWSHATTER11 ||
      uiDatabaseElem == Enum312.WINDOWSHATTER16
    ) {
      // Allocate Animated tile data
      AllocateAnimTileData(TileElement, 5);
      Assert(TileElement.pAnimData);

      TileElement.pAnimData.bCurrentFrame = 0;
      for (ubLoop = 0; ubLoop < TileElement.pAnimData.ubNumFrames; ubLoop++) {
        TileElement.pAnimData.pusFrames[ubLoop] = uiDatabaseElem + ubLoop;
      }
    }

    if (
      uiDatabaseElem >= Enum312.WINDOWSHATTER1 &&
      uiDatabaseElem <= Enum312.WINDOWSHATTER20
    ) {
      TileElement.uiFlags |= DYNAMIC_TILE;
    }

    //	if ( usType == FIRSTEXPLOSION )
    //	{
    //		TileElement->uiFlags |= DYNAMIC_TILE;
    //	}

    if (usType == Enum313.BODYEXPLOSION) {
      TileElement.uiFlags |= DYNAMIC_TILE;
    }

    if (usType == Enum313.FIRSTROAD) {
      TileElement.uiFlags |= ROAD_TILE;
    }

    // SET FLAGS FOR OBJECTS PEICES WHICH USE PROPER Z
    if (fUseRaisedObjectType) {
      TileElement.uiFlags |= OBJECTLAYER_USEZHEIGHT;
    }

    // OFFSET SLANTED ROOFS TO HEIGHT OF WALLS
    if (
      uiDatabaseElem >= Enum312.FIRSTROOF1 &&
      uiDatabaseElem <= Enum312.SECONDSLANTROOF20
    ) {
      // TileElement->sOffsetHeight = WALL_HEIGHT;
    }

    // Set flag for full 3d tiles, as well as the dynamic flag for the folliage
    if (
      uiDatabaseElem >= Enum312.FIRSTFULLSTRUCT1 &&
      uiDatabaseElem <= Enum312.SECONDFULLSTRUCT12
    ) {
      // TileElement->uiFlags |= FULL3D_TILE;
      sIndexDiff = uiDatabaseElem - gTileTypeStartIndex[usType];

      // Every second set as dynamic
      if (sIndexDiff % 3 == 1) {
        TileElement.uiFlags |= DYNAMIC_TILE;
      }

      // Set every first as full tile
      if (sIndexDiff % 3 == 0) {
        TileElement.uiFlags |= FULL3D_TILE;
      }
    }

    // Ignore height for cliffs ie: if we rasie the land, do not offset the cliff
    if (
      uiDatabaseElem >= Enum312.FIRSTCLIFFHANG1 &&
      uiDatabaseElem <= Enum312.FIRSTCLIFFSHADOW17
    ) {
      if (usType == Enum313.FIRSTCLIFFHANG) {
        TileElement.uiFlags |= CLIFFHANG_TILE;
      }
      TileElement.uiFlags |= IGNORE_WORLD_HEIGHT;
    }

    if (
      uiDatabaseElem >= Enum312.FIRSTWALL1 &&
      uiDatabaseElem <= Enum312.FOURTHWALL65
    ) {
      TileElement.uiFlags |= WALL_TILE;
    }

    // Set a-frames heigher!
    if (
      uiDatabaseElem >= Enum312.FIRSTWALL1 &&
      uiDatabaseElem <= Enum312.FOURTHWALL47
    ) {
      // Set these ones higher ( for roof pieces )
      if (
        uiDatabaseElem >= gTileTypeStartIndex[usType] + WALL_AFRAME_START &&
        uiDatabaseElem <= gTileTypeStartIndex[usType] + WALL_AFRAME_END
      ) {
        // TileElement->sOffsetHeight = WALL_HEIGHT;
        TileElement.uiFlags |= AFRAME_TILE;
      }
    }

    // Set UI Elements to be dynamic
    if (
      uiDatabaseElem >= Enum312.FOOTPRINTS1 &&
      uiDatabaseElem <= Enum312.THIRDPOINTERS2
    ) {
      TileElement.uiFlags |= DYNAMIC_TILE;
      TileElement.uiFlags |= OBJECTLAYER_USEZHEIGHT;
    }

    // Set UI Elements to use object z level
    if (usType >= Enum313.FOOTPRINTS && usType <= LASTUIELEM) {
      TileElement.uiFlags |= OBJECTLAYER_USEZHEIGHT;
    }

    // Set UI Elements to use object z level
    if (usType >= Enum313.HUMANBLOOD && usType <= Enum313.CREATUREBLOOD) {
      TileElement.uiFlags |= OBJECTLAYER_USEZHEIGHT;
    }

    // Set UI Elements to use object z level
    if (usType >= Enum313.GUNS && usType <= Enum313.P2ITEMS) {
      TileElement.uiFlags |= OBJECTLAYER_USEZHEIGHT;
    }
    if (usType == Enum313.P3ITEMS) {
      TileElement.uiFlags |= OBJECTLAYER_USEZHEIGHT;
    }

    if (
      usType >= Enum313.FIRSTEXPLDEBRIS &&
      usType <= Enum313.SECONDEXPLDEBRIS
    ) {
      TileElement.uiFlags |= OBJECTLAYER_USEZHEIGHT;
    }

    if (
      uiDatabaseElem >= Enum312.FIRSTDOOR1 &&
      uiDatabaseElem <= Enum312.FOURTHDOORSH20
    ) {
      // TileElement->uiFlags |= DYNAMIC_TILE;
    }

    // Set UI Elements to be dynamic
    if (uiDatabaseElem == Enum312.MOCKFLOOR1) {
      TileElement.uiFlags |= DYNAMIC_TILE;
    }

    if (usType == Enum313.BULLETTILE) {
      TileElement.uiFlags |= DYNAMIC_TILE;
    }

    if (usType == Enum313.WIREFRAMES) {
      // TileElement->uiFlags |= DYNAMIC_TILE;
    }

    // Set full tile flag for floors
    if (
      uiDatabaseElem >= Enum312.FIRSTFLOOR1 &&
      uiDatabaseElem <= Enum312.FOURTHFLOOR8
    ) {
      TileElement.ubFullTile = 1;
    }

    if (
      uiDatabaseElem >= Enum312.FIRSTTEXTURE1 &&
      uiDatabaseElem <= Enum312.DEEPWATERTEXTURE10
    ) {
      // Set tile 'fullness' attribute
      TileElement.ubFullTile = gFullBaseTileValues[uiDatabaseElem];
    }

    if (usType >= Enum313.FIRSTONROOF && usType <= Enum313.SECONDONROOF) {
      // Set height!
      // TileElement->sOffsetHeight = WALL_HEIGHT;
    }

    if (
      (uiDatabaseElem >= Enum312.REGWATERTEXTURE18 &&
        uiDatabaseElem <= Enum312.REGWATERTEXTURE50) ||
      uiDatabaseElem == Enum313.REGWATERTEXTURE ||
      uiDatabaseElem == Enum312.REGWATERTEXTURE12 ||
      uiDatabaseElem == Enum312.REGWATERTEXTURE14 ||
      uiDatabaseElem == Enum312.REGWATERTEXTURE16
    ) {
      TileElement.ubTerrainID = Enum315.FLAT_GROUND;
    }

    if (
      (usType >= Enum313.FIRSTROOF && usType <= Enum313.SECONDSLANTROOF) ||
      usType == Enum313.FIRSTHIGHROOF ||
      usType == Enum313.SECONDHIGHROOF
    ) {
      TileElement.uiFlags |= ROOF_TILE;
    }
  }
}
