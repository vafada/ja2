namespace ja2 {
  const path: typeof import("path") = require("path");

  /*

******************************************************************************************************
**                                  IMPORTANT TRANSLATION NOTES                                     **
******************************************************************************************************

GENERAL INSTRUCTIONS
- Always be aware that foreign strings should be of equal or shorter length than the English equivalent.
        I know that this is difficult to do on many occasions due to the nature of foreign languages when
        compared to English.  By doing so, this will greatly reduce the amount of work on both sides.  In
        most cases (but not all), JA2 interfaces were designed with just enough space to fit the English word.
        The general rule is if the string is very short (less than 10 characters), then it's short because of
        interface limitations.  On the other hand, full sentences commonly have little limitations for length.
        Strings in between are a little dicey.
- Never translate a string to appear on multiple lines.  All strings L"This is a really long string...",
        must fit on a single line no matter how long the string is.  All strings start with L" and end with ",
- Never remove any extra spaces in strings.  In addition, all strings containing multiple sentences only
        have one space after a period, which is different than standard typing convention.  Never modify sections
        of strings contain combinations of % characters.  These are special format characters and are always
        used in conjunction with other characters.  For example, %s means string, and is commonly used for names,
        locations, items, etc.  %d is used for numbers.  %c%d is a character and a number (such as A9).
        %% is how a single % character is built.  There are countless types, but strings containing these
        special characters are usually commented to explain what they mean.  If it isn't commented, then
        if you can't figure out the context, then feel free to ask SirTech.
- Comments are always started with // Anything following these two characters on the same line are
        considered to be comments.  Do not translate comments.  Comments are always applied to the following
        string(s) on the next line(s), unless the comment is on the same line as a string.
- All new comments made by SirTech will use "//@@@ comment" (without the quotes) notation.  By searching
        for @@@ everytime you recieve a new version, it will simplify your task and identify special instructions.
  Commonly, these types of comments will be used to ask you to abbreviate a string.  Please leave the
        comments intact, and SirTech will remove them once the translation for that particular area is resolved.
- If you have a problem or question with translating certain strings, please use "//!!! comment"
        (without the quotes).  The syntax is important, and should be identical to the comments used with @@@
        symbols.  SirTech will search for !!! to look for your problems and questions.  This is a more
        efficient method than detailing questions in email, so try to do this whenever possible.



FAST HELP TEXT -- Explains how the syntax of fast help text works.
**************

1) BOLDED LETTERS
        The popup help text system supports special characters to specify the hot key(s) for a button.
        Anytime you see a '|' symbol within the help text string, that means the following key is assigned
        to activate the action which is usually a button.

        EX:  L"|Map Screen"

        This means the 'M' is the hotkey.  In the game, when somebody hits the 'M' key, it activates that
        button.  When translating the text to another language, it is best to attempt to choose a word that
        uses 'M'.  If you can't always find a match, then the best thing to do is append the 'M' at the end
        of the string in this format:

        EX:  L"Ecran De Carte (|M)"  (this is the French translation)

        Other examples are used multiple times, like the Esc key  or "|E|s|c" or Space -> (|S|p|a|c|e)

2) NEWLINE
  Any place you see a \n within the string, you are looking at another string that is part of the fast help
        text system.  \n notation doesn't need to be precisely placed within that string, but whereever you wish
        to start a new line.

        EX:  L"Clears all the mercs' positions,\nand allows you to re-enter them manually."

        Would appear as:

                                Clears all the mercs' positions,
                                and allows you to re-enter them manually.

        NOTE:  It is important that you don't pad the characters adjacent to the \n with spaces.  If we did this
               in the above example, we would see

        WRONG WAY -- spaces before and after the \n
        EX:  L"Clears all the mercs' positions, \n and allows you to re-enter them manually."

        Would appear as: (the second line is moved in a character)

                                Clears all the mercs' positions,
                                 and allows you to re-enter them manually.


@@@ NOTATION
************

        Throughout the text files, you'll find an assortment of comments.  Comments are used to describe the
        text to make translation easier, but comments don't need to be translated.  A good thing is to search for
        "@@@" after receiving new version of the text file, and address the special notes in this manner.

!!! NOTATION
************

        As described above, the "!!!" notation should be used by you to ask questions and address problems as
        SirTech uses the "@@@" notation.

*/

  export let ItemNames: string[] /* UINT16[MAXITEMS][80] */ = [""];

  export let ShortItemNames: string[] /* UINT16[MAXITEMS][80] */ = [""];

  // Different weapon calibres
  // CAWS is Close Assault Weapon System and should probably be left as it is
  // NATO is the North Atlantic Treaty Organization
  // WP is Warsaw Pact
  // cal is an abbreviation for calibre
  export let AmmoCaliber: string[] /* UINT16[][20] */ = [
    "0",
    ".38 cal",
    "9mm",
    ".45 cal",
    ".357 cal",
    "12 gauge",
    "CAWS",
    "5.45mm",
    "5.56mm",
    "7.62mm NATO",
    "7.62mm WP",
    "4.7mm",
    "5.7mm",
    "Monster",
    "Rocket",
    "", // dart
    "", // flame
  ];

  // This BobbyRayAmmoCaliber is virtually the same as AmmoCaliber however the bobby version doesnt have as much room for the words.
  //
  // Different weapon calibres
  // CAWS is Close Assault Weapon System and should probably be left as it is
  // NATO is the North Atlantic Treaty Organization
  // WP is Warsaw Pact
  // cal is an abbreviation for calibre
  export let BobbyRayAmmoCaliber: string[] /* UINT16[][20] */ = [
    "0",
    ".38 cal",
    "9mm",
    ".45 cal",
    ".357 cal",
    "12 gauge",
    "CAWS",
    "5.45mm",
    "5.56mm",
    "7.62mm N.",
    "7.62mm WP",
    "4.7mm",
    "5.7mm",
    "Monster",
    "Rocket",
    "", // dart
  ];

  export let WeaponType: string[] /* UINT16[][30] */ = [
    "Other",
    "Pistol",
    "Machine pistol",
    "Submachine gun",
    "Rifle",
    "Sniper rifle",
    "Assault rifle",
    "Light machine gun",
    "Shotgun",
  ];

  export let TeamTurnString: string[] /* UINT16[][STRING_LENGTH] */ = [
    "Player's Turn", // player's turn
    "Opponents' Turn",
    "Creatures' Turn",
    "Militia's Turn",
    "Civilians' Turn",
    // planning turn
  ];

  export let Message: string[] /* UINT16[][STRING_LENGTH] */ = [
    "",

    // In the following 8 strings, the %s is the merc's name, and the %d (if any) is a number.

    "%s is hit in the head and loses a point of wisdom!",
    "%s is hit in the shoulder and loses a point of dexterity!",
    "%s is hit in the chest and loses a point of strength!",
    "%s is hit in the legs and loses a point of agility!",
    "%s is hit in the head and loses %d points of wisdom!",
    "%s is hit in the shoulder and loses %d points of dexterity!",
    "%s is hit in the chest and loses %d points of strength!",
    "%s is hit in the legs and loses %d points of agility!",
    "Interrupt!",

    // The first %s is a merc's name, the second is a string from pNoiseVolStr,
    // the third is a string from pNoiseTypeStr, and the last is a string from pDirectionStr

    "", // OBSOLETE
    "Your reinforcements have arrived!",

    // In the following four lines, all %s's are merc names

    "%s reloads.",
    "%s doesn't have enough Action Points!",
    "%s is applying first aid. (Press any key to cancel.)",
    "%s and %s are applying first aid. (Press any key to cancel.)",
    // the following 17 strings are used to create lists of gun advantages and disadvantages
    // (separated by commas)
    "reliable",
    "unreliable",
    "easy to repair",
    "hard to repair",
    "high damage",
    "low damage",
    "quick firing",
    "slow firing",
    "long range",
    "short range",
    "light",
    "heavy",
    "small",
    "fast burst fire",
    "no burst fire",
    "large magazine",
    "small magazine",

    // In the following two lines, all %s's are merc names

    "%s's camouflage has worn off.",
    "%s's camouflage has washed off.",

    // The first %s is a merc name and the second %s is an item name

    "Second weapon is out of ammo!",
    "%s has stolen the %s.",

    // The %s is a merc name

    "%s's weapon can't burst fire.",

    "You've already got one of those attached.",
    "Merge items?",

    // Both %s's are item names

    "You can't attach a %s to a %s.",

    "None",
    "Eject ammo",
    "Attachments",

    // You cannot use "item(s)" and your "other item" at the same time.
    // Ex:  You cannot use sun goggles and you gas mask at the same time.
    "You cannot use %s and your %s at the same time.",

    "The item you have in your cursor can be attached to certain items by placing it in one of the four attachment slots.",
    "The item you have in your cursor can be attached to certain items by placing it in one of the four attachment slots. (However in this case, the item is not compatible.)",
    "The sector isn't cleared of enemies!",
    "You still need to give %s %s",
    "%s is hit in the head!",
    "Abandon the fight?",
    "This attachment will be permanent.  Go ahead with it?",
    "%s feels more energetic!",
    "%s slipped on some marbles!",
    "%s failed to grab the %s!",
    "%s has repaired the %s",
    "Interrupt for ",
    "Surrender?",
    "This person refuses your aid.",
    "I DON'T think so!",
    "To travel in Skyrider's chopper, you'll have to ASSIGN mercs to VEHICLE/HELICOPTER first.",
    "%s only had enough time to reload ONE gun",
    "Bloodcats' turn",
  ];

  // the names of the towns in the game

  export let pTownNames: string[] /* STR16[] */ = [
    "",
    "Omerta",
    "Drassen",
    "Alma",
    "Grumm",
    "Tixa",
    "Cambria",
    "San Mona",
    "Estoni",
    "Orta",
    "Balime",
    "Meduna",
    "Chitzena",
  ];

  // the types of time compression. For example: is the timer paused? at normal speed, 5 minutes per second, etc.
  // min is an abbreviation for minutes

  export let sTimeStrings: string[] /* STR16[] */ = [
    "Paused",
    "Normal",
    "5 min",
    "30 min",
    "60 min",
    "6 hrs",
  ];

  // Assignment Strings: what assignment does the merc  have right now? For example, are they on a squad, training,
  // administering medical aid (doctor) or training a town. All are abbreviated. 8 letters is the longest it can be.

  export let pAssignmentStrings: string[] /* STR16[] */ = [
    "Squad 1",
    "Squad 2",
    "Squad 3",
    "Squad 4",
    "Squad 5",
    "Squad 6",
    "Squad 7",
    "Squad 8",
    "Squad 9",
    "Squad 10",
    "Squad 11",
    "Squad 12",
    "Squad 13",
    "Squad 14",
    "Squad 15",
    "Squad 16",
    "Squad 17",
    "Squad 18",
    "Squad 19",
    "Squad 20",
    "On Duty", // on active duty
    "Doctor", // administering medical aid
    "Patient", // getting medical aid
    "Vehicle", // in a vehicle
    "In Trans", // in transit - abbreviated form
    "Repair", // repairing
    "Practice", // training themselves
    "Militia", // training a town to revolt
    "Trainer", // training a teammate
    "Student", // being trained by someone else
    "Dead", // dead
    "Incap.", // abbreviation for incapacitated
    "POW", // Prisoner of war - captured
    "Hospital", // patient in a hospital
    "Empty", // Vehicle is empty
  ];

  export let pMilitiaString: string[] /* STR16[] */ = [
    "Militia", // the title of the militia box
    "Unassigned", // the number of unassigned militia troops
    "You can't redistribute militia while there are hostilities in the area!",
  ];

  export let pMilitiaButtonString: string[] /* STR16[] */ = [
    "Auto", // auto place the militia troops for the player
    "Done", // done placing militia troops
  ];

  export let pConditionStrings: string[] /* STR16[] */ = [
    "Excellent", // the state of a soldier .. excellent health
    "Good", // good health
    "Fair", // fair health
    "Wounded", // wounded health
    "Fatigued", // tired
    "Bleeding", // bleeding to death
    "Unconscious", // knocked out
    "Dying", // near death
    "Dead", // dead
  ];

  export let pEpcMenuStrings: string[] /* STR16[] */ = [
    "On Duty", // set merc on active duty
    "Patient", // set as a patient to receive medical aid
    "Vehicle", // tell merc to enter vehicle
    "Unescort", // let the escorted character go off on their own
    "Cancel", // close this menu
  ];

  // look at pAssignmentString above for comments

  export let pPersonnelAssignmentStrings: string[] /* STR16[] */ = [
    "Squad 1",
    "Squad 2",
    "Squad 3",
    "Squad 4",
    "Squad 5",
    "Squad 6",
    "Squad 7",
    "Squad 8",
    "Squad 9",
    "Squad 10",
    "Squad 11",
    "Squad 12",
    "Squad 13",
    "Squad 14",
    "Squad 15",
    "Squad 16",
    "Squad 17",
    "Squad 18",
    "Squad 19",
    "Squad 20",
    "On Duty",
    "Doctor",
    "Patient",
    "Vehicle",
    "In Transit",
    "Repair",
    "Practice",
    "Training Militia",
    "Trainer",
    "Student",
    "Dead",
    "Incap.",
    "POW",
    "Hospital",
    "Empty", // Vehicle is empty
  ];

  // refer to above for comments

  export let pLongAssignmentStrings: string[] /* STR16[] */ = [
    "Squad 1",
    "Squad 2",
    "Squad 3",
    "Squad 4",
    "Squad 5",
    "Squad 6",
    "Squad 7",
    "Squad 8",
    "Squad 9",
    "Squad 10",
    "Squad 11",
    "Squad 12",
    "Squad 13",
    "Squad 14",
    "Squad 15",
    "Squad 16",
    "Squad 17",
    "Squad 18",
    "Squad 19",
    "Squad 20",
    "On Duty",
    "Doctor",
    "Patient",
    "Vehicle",
    "In Transit",
    "Repair",
    "Practice",
    "Train Militia",
    "Train Teammate",
    "Student",
    "Dead",
    "Incap.",
    "POW",
    "Hospital", // patient in a hospital
    "Empty", // Vehicle is empty
  ];

  // the contract options

  export let pContractStrings: string[] /* STR16[] */ = [
    "Contract Options:",
    "", // a blank line, required
    "Offer One Day", // offer merc a one day contract extension
    "Offer One Week", // 1 week
    "Offer Two Weeks", // 2 week
    "Dismiss", // end merc's contract
    "Cancel", // stop showing this menu
  ];

  export let pPOWStrings: string[] /* STR16[] */ = [
    "POW", // an acronym for Prisoner of War
    "??",
  ];

  export let pLongAttributeStrings: string[] /* STR16[] */ = [
    "STRENGTH",
    "DEXTERITY",
    "AGILITY",
    "WISDOM",
    "MARKSMANSHIP",
    "MEDICAL",
    "MECHANICAL",
    "LEADERSHIP",
    "EXPLOSIVES",
    "LEVEL",
  ];

  export let pInvPanelTitleStrings: string[] /* STR16[] */ = [
    "Armor", // the armor rating of the merc
    "Weight", // the weight the merc is carrying
    "Camo", // the merc's camouflage rating
  ];

  export let pShortAttributeStrings: string[] /* STR16[] */ = [
    "Agi", // the abbreviated version of : agility
    "Dex", // dexterity
    "Str", // strength
    "Ldr", // leadership
    "Wis", // wisdom
    "Lvl", // experience level
    "Mrk", // marksmanship skill
    "Exp", // explosive skill
    "Mec", // mechanical skill
    "Med", // medical skill
  ];

  export let pUpperLeftMapScreenStrings: string[] /* STR16[] */ = [
    "Assignment", // the mercs current assignment
    "Contract", // the contract info about the merc
    "Health", // the health level of the current merc
    "Morale", // the morale of the current merc
    "Cond.", // the condition of the current vehicle
    "Fuel", // the fuel level of the current vehicle
  ];

  export let pTrainingStrings: string[] /* STR16[] */ = [
    "Practice", // tell merc to train self
    "Militia", // tell merc to train town
    "Trainer", // tell merc to act as trainer
    "Student", // tell merc to be train by other
  ];

  export let pGuardMenuStrings: string[] /* STR16[] */ = [
    "Fire Rate:", // the allowable rate of fire for a merc who is guarding
    " Aggressive Fire", // the merc can be aggressive in their choice of fire rates
    " Conserve Ammo", // conserve ammo
    " Refrain From Firing", // fire only when the merc needs to
    "Other Options:", // other options available to merc
    " Can Retreat", // merc can retreat
    " Can Seek Cover", // merc is allowed to seek cover
    " Can Assist Teammates", // merc can assist teammates
    "Done", // done with this menu
    "Cancel", // cancel this menu
  ];

  // This string has the same comments as above, however the * denotes the option has been selected by the player

  export let pOtherGuardMenuStrings: string[] /* STR16[] */ = [
    "Fire Rate:",
    " *Aggressive Fire*",
    " *Conserve Ammo*",
    " *Refrain From Firing*",
    "Other Options:",
    " *Can Retreat*",
    " *Can Seek Cover*",
    " *Can Assist Teammates*",
    "Done",
    "Cancel",
  ];

  export let pAssignMenuStrings: string[] /* STR16[] */ = [
    "On Duty", // merc is on active duty
    "Doctor", // the merc is acting as a doctor
    "Patient", // the merc is receiving medical attention
    "Vehicle", // the merc is in a vehicle
    "Repair", // the merc is repairing items
    "Train", // the merc is training
    "Cancel", // cancel this menu
  ];

  export let pRemoveMercStrings: string[] /* STR16[] */ = [
    "Remove Merc", // remove dead merc from current team
    "Cancel",
  ];

  export let pAttributeMenuStrings: string[] /* STR16[] */ = [
    "Strength",
    "Dexterity",
    "Agility",
    "Health",
    "Marksmanship",
    "Medical",
    "Mechanical",
    "Leadership",
    "Explosives",
    "Cancel",
  ];

  export let pTrainingMenuStrings: string[] /* STR16[] */ = [
    "Practice", // train yourself
    "Militia", // train the town
    "Trainer", // train your teammates
    "Student", // be trained by an instructor
    "Cancel", // cancel this menu
  ];

  export let pSquadMenuStrings: string[] /* STR16[] */ = [
    "Squad  1",
    "Squad  2",
    "Squad  3",
    "Squad  4",
    "Squad  5",
    "Squad  6",
    "Squad  7",
    "Squad  8",
    "Squad  9",
    "Squad 10",
    "Squad 11",
    "Squad 12",
    "Squad 13",
    "Squad 14",
    "Squad 15",
    "Squad 16",
    "Squad 17",
    "Squad 18",
    "Squad 19",
    "Squad 20",
    "Cancel",
  ];

  export let pPersonnelTitle: string[] /* STR16[] */ = [
    "Personnel", // the title for the personnel screen/program application
  ];

  export let pPersonnelScreenStrings: string[] /* STR16[] */ = [
    "Health: ", // health of merc
    "Agility: ",
    "Dexterity: ",
    "Strength: ",
    "Leadership: ",
    "Wisdom: ",
    "Exp. Lvl: ", // experience level
    "Marksmanship: ",
    "Mechanical: ",
    "Explosives: ",
    "Medical: ",
    "Med. Deposit: ", // amount of medical deposit put down on the merc
    "Remaining Contract: ", // cost of current contract
    "Kills: ", // number of kills by merc
    "Assists: ", // number of assists on kills by merc
    "Daily Cost:", // daily cost of merc
    "Tot. Cost to Date:", // total cost of merc
    "Contract:", // cost of current contract
    "Tot. Service to Date:", // total service rendered by merc
    "Salary Owing:", // amount left on MERC merc to be paid
    "Hit Percentage:", // percentage of shots that hit target
    "Battles:", // number of battles fought
    "Times Wounded:", // number of times merc has been wounded
    "Skills:",
    "No Skills",
  ];

  // These string correspond to enums used in by the SkillTrait enums in SoldierProfileType.h
  export let gzMercSkillText: string[] /* STR16[] */ = [
    "No Skill",
    "Lock picking",
    "Hand to hand",
    "Electronics",
    "Night ops",
    "Throwing",
    "Teaching",
    "Heavy Weapons",
    "Auto Weapons",
    "Stealthy",
    "Ambidextrous",
    "Thief",
    "Martial Arts",
    "Knifing",
    "On Roof Bonus to hit",
    "Camouflaged",
    "(Expert)",
  ];

  // This is pop up help text for the options that are available to the merc

  export let pTacticalPopupButtonStrings: string[] /* STR16[] */ = [
    "|Stand/Walk",
    "|Crouch/Crouched Move",
    "Stand/|Run",
    "|Prone/Crawl",
    "|Look",
    "Action",
    "Talk",
    "Examine (|C|t|r|l)",

    // Pop up door menu
    "Open Manually",
    "Examine for Traps",
    "Lockpick",
    "Force Open",
    "Untrap",
    "Lock",
    "Unlock",
    "Use Door Explosive",
    "Use Crowbar",
    "Cancel (|E|s|c)",
    "Close",
  ];

  // Door Traps. When we examine a door, it could have a particular trap on it. These are the traps.

  export let pDoorTrapStrings: string[] /* STR16[] */ = [
    "no trap",
    "an explosion trap",
    "an electric trap",
    "a siren trap",
    "a silent alarm trap",
  ];

  // Contract Extension. These are used for the contract extension with AIM mercenaries.

  export let pContractExtendStrings: string[] /* STR16[] */ = [
    "day",
    "week",
    "two weeks",
  ];

  // On the map screen, there are four columns. This text is popup help text that identifies the individual columns.

  export let pMapScreenMouseRegionHelpText: string[] /* STR16[] */ = [
    "Select Character",
    "Assign Merc",
    "Plot Travel Route",
    "Merc |Contract",
    "Remove Merc",
    "Sleep",
  ];

  // volumes of noises

  export let pNoiseVolStr: string[] /* STR16[] */ = [
    "FAINT",
    "DEFINITE",
    "LOUD",
    "VERY LOUD",
  ];

  // types of noises

  // OBSOLETE
  export let pNoiseTypeStr: string[] /* STR16[] */ = [
    "UNKNOWN",
    "sound of MOVEMENT",
    "CREAKING",
    "SPLASHING",
    "IMPACT",
    "GUNSHOT",
    "EXPLOSION",
    "SCREAM",
    "IMPACT",
    "IMPACT",
    "SHATTERING",
    "SMASH",
  ];

  // Directions that are used to report noises

  export let pDirectionStr: string[] /* STR16[] */ = [
    "the NORTHEAST",
    "the EAST",
    "the SOUTHEAST",
    "the SOUTH",
    "the SOUTHWEST",
    "the WEST",
    "the NORTHWEST",
    "the NORTH",
  ];

  // These are the different terrain types.

  export let pLandTypeStrings: string[] /* STR16[] */ = [
    "Urban",
    "Road",
    "Plains",
    "Desert",
    "Woods",
    "Forest",
    "Swamp",
    "Water",
    "Hills",
    "Impassable",
    "River", // river from north to south
    "River", // river from east to west
    "Foreign Country",
    // NONE of the following are used for directional travel, just for the sector description.
    "Tropical",
    "Farmland",
    "Plains, road",
    "Woods, road",
    "Farm, road",
    "Tropical, road",
    "Forest, road",
    "Coastline",
    "Mountain, road",
    "Coastal, road",
    "Desert, road",
    "Swamp, road",
    "Woods, SAM site",
    "Desert, SAM site",
    "Tropical, SAM site",
    "Meduna, SAM site",

    // These are descriptions for special sectors
    "Cambria Hospital",
    "Drassen Airport",
    "Meduna Airport",
    "SAM site",
    "Rebel Hideout", // The rebel base underground in sector A10
    "Tixa Dungeon", // The basement of the Tixa Prison (J9)
    "Creature Lair", // Any mine sector with creatures in it
    "Orta Basement", // The basement of Orta (K4)
    "Tunnel", // The tunnel access from the maze garden in Meduna
    // leading to the secret shelter underneath the palace
    "Shelter", // The shelter underneath the queen's palace
    "", // Unused
  ];

  export let gpStrategicString: string[] /* STR16[] */ = [
    "", // Unused
    "%s have been detected in sector %s%d and another squad is about to arrive.", // STR_DETECTED_SINGULAR
    "%s have been detected in sector %s%d and other squads are about to arrive.", // STR_DETECTED_PLURAL
    "Do you want to coordinate a simultaneous arrival?", // STR_COORDINATE

    // Dialog strings for enemies.

    "The enemy offers you the chance to surrender.", // STR_ENEMY_SURRENDER_OFFER
    "The enemy has captured your remaining unconscious mercs.", // STR_ENEMY_CAPTURED

    // The text that goes on the autoresolve buttons

    "Retreat", // The retreat button				//STR_AR_RETREAT_BUTTON
    "Done", // The done button				//STR_AR_DONE_BUTTON

    // The headers are for the autoresolve type (MUST BE UPPERCASE)

    "DEFENDING", // STR_AR_DEFEND_HEADER
    "ATTACKING", // STR_AR_ATTACK_HEADER
    "ENCOUNTER", // STR_AR_ENCOUNTER_HEADER
    "Sector", // The Sector A9 part of the header		//STR_AR_SECTOR_HEADER

    // The battle ending conditions

    "VICTORY!", // STR_AR_OVER_VICTORY
    "DEFEAT!", // STR_AR_OVER_DEFEAT
    "SURRENDERED!", // STR_AR_OVER_SURRENDERED
    "CAPTURED!", // STR_AR_OVER_CAPTURED
    "RETREATED!", // STR_AR_OVER_RETREATED

    // These are the labels for the different types of enemies we fight in autoresolve.

    "Militia", // STR_AR_MILITIA_NAME,
    "Elite", // STR_AR_ELITE_NAME,
    "Troop", // STR_AR_TROOP_NAME,
    "Admin", // STR_AR_ADMINISTRATOR_NAME,
    "Creature", // STR_AR_CREATURE_NAME,

    // Label for the length of time the battle took

    "Time Elapsed", // STR_AR_TIME_ELAPSED,

    // Labels for status of merc if retreating.  (UPPERCASE)

    "RETREATED", // STR_AR_MERC_RETREATED,
    "RETREATING", // STR_AR_MERC_RETREATING,
    "RETREAT", // STR_AR_MERC_RETREAT,

    // PRE BATTLE INTERFACE STRINGS
    // Goes on the three buttons in the prebattle interface.  The Auto resolve button represents
    // a system that automatically resolves the combat for the player without having to do anything.
    // These strings must be short (two lines -- 6-8 chars per line)

    "Auto Resolve", // STR_PB_AUTORESOLVE_BTN,
    "Go To Sector", // STR_PB_GOTOSECTOR_BTN,
    "Retreat Mercs", // STR_PB_RETREATMERCS_BTN,

    // The different headers(titles) for the prebattle interface.
    "ENEMY ENCOUNTER", // STR_PB_ENEMYENCOUNTER_HEADER,
    "ENEMY INVASION", // STR_PB_ENEMYINVASION_HEADER, // 30
    "ENEMY AMBUSH", // STR_PB_ENEMYAMBUSH_HEADER
    "ENTERING ENEMY SECTOR", // STR_PB_ENTERINGENEMYSECTOR_HEADER
    "CREATURE ATTACK", // STR_PB_CREATUREATTACK_HEADER
    "BLOODCAT AMBUSH", // STR_PB_BLOODCATAMBUSH_HEADER
    "ENTERING BLOODCAT LAIR", // STR_PB_ENTERINGBLOODCATLAIR_HEADER

    // Various single words for direct translation.  The Civilians represent the civilian
    // militia occupying the sector being attacked.  Limited to 9-10 chars

    "Location",
    "Enemies",
    "Mercs",
    "Militia",
    "Creatures",
    "Bloodcats",
    "Sector",
    "None", // If there are no uninvolved mercs in this fight.
    "N/A", // Acronym of Not Applicable
    "d", // One letter abbreviation of day
    "h", // One letter abbreviation of hour

    // TACTICAL PLACEMENT USER INTERFACE STRINGS
    // The four buttons

    "Clear",
    "Spread",
    "Group",
    "Done",

    // The help text for the four buttons.  Use \n to denote new line (just like enter).

    "|Clears all the mercs' positions, \nand allows you to re-enter them manually.",
    "Randomly |spreads your mercs out \neach time it's pressed.",
    "Allows you to select where you wish to |group your mercs.",
    "Click this button when you're finished \nchoosing your mercs' positions. (|E|n|t|e|r)",
    "You must place all of your mercs \nbefore you start the battle.",

    // Various strings (translate word for word)

    "Sector",
    "Choose entry positions",

    // Strings used for various popup message boxes.  Can be as long as desired.

    "Doesn't look so good there. It's inaccessible. Try a different location.",
    "Place your mercs in the highlighted section of the map.",

    // This message is for mercs arriving in sectors.  Ex:  Red has arrived in sector A9.
    // Don't uppercase first character, or add spaces on either end.

    "has arrived in sector",

    // These entries are for button popup help text for the prebattle interface.  All popup help
    // text supports the use of \n to denote new line.  Do not use spaces before or after the \n.
    "|Automatically resolves combat for you\nwithout loading map.",
    "Can't use auto resolve feature when\nthe player is attacking.",
    "|Enter the sector to engage the enemy.",
    "|Retreat group to their previous sector.", // singular version
    "|Retreat all groups to their previous sectors.", // multiple groups with same previous sector

    // various popup messages for battle conditions.

    //%c%d is the sector -- ex:  A9
    "Enemies attack your militia in sector %s%d.",
    //%c%d is the sector -- ex:  A9
    "Creatures attack your militia in sector %s%d.",
    // 1st %d refers to the number of civilians eaten by monsters,  %c%d is the sector -- ex:  A9
    // Note:  the minimum number of civilians eaten will be two.
    "Creatures attack and kill %d civilians in sector %s.",
    //%s is the sector location -- ex:  A9: Omerta
    "Enemies attack your mercs in sector %s.  None of your mercs are able to fight!",
    //%s is the sector location -- ex:  A9: Omerta
    "Creatures attack your mercs in sector %s.  None of your mercs are able to fight!",
  ];

  export let gpGameClockString: string[] /* STR16[] */ = [
    // This is the day represented in the game clock.  Must be very short, 4 characters max.
    "Day",
  ];

  // When the merc finds a key, they can get a description of it which
  // tells them where and when they found it.
  export let sKeyDescriptionStrings: string[] /* STR16[2] */ = [
    "Sector Found:",
    "Day Found:",
  ];

  // The headers used to describe various weapon statistics.

  export let gWeaponStatsDesc: string[] /* INT16[][14] */ = [
    "Weight (%s):",
    "Status:",
    "Amount:", // Number of bullets left in a magazine
    "Rng:", // Range
    "Dam:", // Damage
    "AP:", // abbreviation for Action Points
    "",
    "=",
    "=",
  ];

  // The headers used for the merc's money.

  export let gMoneyStatsDesc: string[] /* INT16[][13] */ = [
    "Amount",
    "Remaining:", // this is the overall balance
    "Amount",
    "To Split:", // the amount he wants to separate from the overall balance to get two piles of money

    "Current",
    "Balance",
    "Amount to",
    "Withdraw",
  ];

  // The health of various creatures, enemies, characters in the game. The numbers following each are for comment
  // only, but represent the precentage of points remaining.

  export let zHealthStr: string[] /* UINT16[][13] */ = [
    "DYING", //	>= 0
    "CRITICAL", //	>= 15
    "POOR", //	>= 30
    "WOUNDED", //	>= 45
    "HEALTHY", //	>= 60
    "STRONG", // 	>= 75
    "EXCELLENT", // 	>= 90
  ];

  export let gzMoneyAmounts: string[] /* STR16[6] */ = [
    "$1000",
    "$100",
    "$10",
    "Done",
    "Separate",
    "Withdraw",
  ];

  // short words meaning "Advantages" for "Pros" and "Disadvantages" for "Cons."
  export let gzProsLabel: string /* INT16[10] */ = "Pros:";

  export let gzConsLabel: string /* INT16[10] */ = "Cons:";

  // Conversation options a player has when encountering an NPC
  export let zTalkMenuStrings: string[] /* UINT16[6][SMALL_STRING_LENGTH] */ = [
    "Come Again?", // meaning "Repeat yourself"
    "Friendly", // approach in a friendly
    "Direct", // approach directly - let's get down to business
    "Threaten", // approach threateningly - talk now, or I'll blow your face off
    "Give",
    "Recruit",
  ];

  // Some NPCs buy, sell or repair items. These different options are available for those NPCs as well.
  export let zDealerStrings: string[] /* UINT16[4][SMALL_STRING_LENGTH] */ = [
    "Buy/Sell",
    "Buy",
    "Sell",
    "Repair",
  ];

  export let zDialogActions: string[] /* UINT16[1][SMALL_STRING_LENGTH] */ = [
    "Done",
  ];

  // These are vehicles in the game.

  export let pVehicleStrings: string[] /* STR16[] */ = [
    "Eldorado",
    "Hummer", // a hummer jeep/truck -- military vehicle
    "Icecream Truck",
    "Jeep",
    "Tank",
    "Helicopter",
  ];

  export let pShortVehicleStrings: string[] /* STR16[] */ = [
    "Eldor.",
    "Hummer", // the HMVV
    "Truck",
    "Jeep",
    "Tank",
    "Heli", // the helicopter
  ];

  export let zVehicleName: string[] /* STR16[] */ = [
    "Eldorado",
    "Hummer", // a military jeep. This is a brand name.
    "Truck", // Ice cream truck
    "Jeep",
    "Tank",
    "Heli", // an abbreviation for Helicopter
  ];

  // These are messages Used in the Tactical Screen

  export let TacticalStr: string[] /* UINT16[][MED_STRING_LENGTH] */ = [
    "Air Raid",
    "Apply first aid automatically?",

    // CAMFIELD NUKE THIS and add quote #66.

    "%s notices that items are missing from the shipment.",

    // The %s is a string from pDoorTrapStrings

    "The lock has %s.",
    "There's no lock.",
    "Success!",
    "Failure.",
    "Success!",
    "Failure.",
    "The lock isn't trapped.",
    "Success!",
    // The %s is a merc name
    "%s doesn't have the right key.",
    "The lock is untrapped.",
    "The lock isn't trapped.",
    "Locked.",
    "DOOR",
    "TRAPPED",
    "LOCKED",
    "UNLOCKED",
    "SMASHED",
    "There's a switch here.  Activate it?",
    "Disarm trap?",
    "Prev...",
    "Next...",
    "More...",

    // In the next 2 strings, %s is an item name

    "The %s has been placed on the ground.",
    "The %s has been given to %s.",

    // In the next 2 strings, %s is a name

    "%s has been paid in full.",
    "%s is still owed %d.",
    "Choose detonation frequency:", // in this case, frequency refers to a radio signal
    "How many turns 'til she blows:", // how much time, in turns, until the bomb blows
    "Set remote detonator frequency:", // in this case, frequency refers to a radio signal
    "Disarm boobytrap?",
    "Remove blue flag?",
    "Put blue flag here?",
    "Ending Turn",

    // In the next string, %s is a name. Stance refers to way they are standing.

    "You sure you want to attack %s ?",
    "Ah, vehicles can't change stance.",
    "The robot can't change its stance.",

    // In the next 3 strings, %s is a name

    "%s can't change to that stance here.",
    "%s can't have first aid done here.",
    "%s doesn't need first aid.",
    "Can't move there.",
    "Your team's full. No room for a recruit.", // there's no room for a recruit on the player's team

    // In the next string, %s is a name

    "%s has been recruited.",

    // Here %s is a name and %d is a number

    "%s is owed $%d.",

    // In the next string, %s is a name

    "Escort %s?",

    // In the next string, the first %s is a name and the second %s is an amount of money (including $ sign)

    "Hire %s for %s per day?",

    // This line is used repeatedly to ask player if they wish to participate in a boxing match.

    "You want to fight?",

    // In the next string, the first %s is an item name and the
    // second %s is an amount of money (including $ sign)

    "Buy %s for %s?",

    // In the next string, %s is a name

    "%s is being escorted on squad %d.",

    // These messages are displayed during play to alert the player to a particular situation

    "JAMMED", // weapon is jammed.
    "Robot needs %s caliber ammo.", // Robot is out of ammo
    "Throw there? Not gonna happen.", // Merc can't throw to the destination he selected

    // These are different buttons that the player can turn on and off.

    "Stealth Mode (|Z)",
    "|Map Screen",
    "|Done (End Turn)",
    "Talk",
    "Mute",
    "Stance Up (|P|g|U|p)",
    "Cursor Level (|T|a|b)",
    "Climb / Jump",
    "Stance Down (|P|g|D|n)",
    "Examine (|C|t|r|l)",
    "Previous Merc",
    "Next Merc (|S|p|a|c|e)",
    "|Options",
    "|Burst Mode",
    "|Look/Turn",
    "Health: %d/%d\nEnergy: %d/%d\nMorale: %s",
    "Heh?", // this means "what?"
    "Cont", // an abbrieviation for "Continued"
    "Mute off for %s.",
    "Mute on for %s.",
    "Health: %d/%d\nFuel: %d/%d",
    "Exit Vehicle",
    "Change Squad ( |S|h|i|f|t |S|p|a|c|e )",
    "Drive",
    "N/A", // this is an acronym for "Not Applicable."
    "Use ( Hand To Hand )",
    "Use ( Firearm )",
    "Use ( Blade )",
    "Use ( Explosive )",
    "Use ( Medkit )",
    "(Catch)",
    "(Reload)",
    "(Give)",
    "%s has been set off.",
    "%s has arrived.",
    "%s ran out of Action Points.",
    "%s isn't available.",
    "%s is all bandaged.",
    "%s is out of bandages.",
    "Enemy in sector!",
    "No enemies in sight.",
    "Not enough Action Points.",
    "Nobody's using the remote.",
    "Burst fire emptied the clip!",
    "SOLDIER",
    "CREPITUS",
    "MILITIA",
    "CIVILIAN",
    "Exiting Sector",
    "OK",
    "Cancel",
    "Selected Merc",
    "All Mercs in Squad",
    "Go to Sector",
    "Go to Map",
    "You can't leave the sector from this side.",
    "%s is too far away.",
    "Removing Treetops",
    "Showing Treetops",
    "CROW", // Crow, as in the large black bird
    "NECK",
    "HEAD",
    "TORSO",
    "LEGS",
    "Tell the Queen what she wants to know?",
    "Fingerprint ID aquired",
    "Invalid fingerprint ID. Weapon non-functional",
    "Target aquired",
    "Path Blocked",
    "Deposit/Withdraw Money", // Help text over the $ button on the Single Merc Panel
    "No one needs first aid.",
    "Jam.", // Short form of JAMMED, for small inv slots
    "Can't get there.", // used ( now ) for when we click on a cliff
    "Path is blocked. Do you want to switch places with this person?",
    "The person refuses to move.",
    // In the following message, '%s' would be replaced with a quantity of money (e.g. $200)
    "Do you agree to pay %s?",
    "Accept free medical treatment?",
    "Agree to marry Daryl?",
    "Key Ring Panel",
    "You cannot do that with an EPC.",
    "Spare Krott?",
    "Out of effective weapon range.",
    "Miner",
    "Vehicle can only travel between sectors",
    "Can't autobandage right now",
    "Path Blocked for %s",
    "Your mercs, who were captured by Deidranna's army are imprisoned here!",
    "Lock hit",
    "Lock destroyed",
    "Somebody else is trying to use this door.",
    "Health: %d/%d\nFuel: %d/%d",
    "%s cannot see %s.", // Cannot see person trying to talk to
  ];

  // Varying helptext explains (for the "Go to Sector/Map" checkbox) what will happen given different circumstances in the "exiting sector" interface.
  export let pExitingSectorHelpText: string[] /* STR16[] */ = [
    // Helptext for the "Go to Sector" checkbox button, that explains what will happen when the box is checked.
    "If checked, the adjacent sector will be immediately loaded.",
    "If checked, you will be placed automatically in the map screen\nas it will take time for your mercs to travel.",

    // If you attempt to leave a sector when you have multiple squads in a hostile sector.
    "This sector is enemy occupied and you can't leave mercs here.\nYou must deal with this situation before loading any other sectors.",

    // Because you only have one squad in the sector, and the "move all" option is checked, the "go to sector" option is locked to on.
    // The helptext explains why it is locked.
    "By moving your remaining mercs out of this sector,\nthe adjacent sector will immediately be loaded.",
    "By moving your remaining mercs out of this sector,\nyou will be placed automatically in the map screen\nas it will take time for your mercs to travel.",

    // If an EPC is the selected merc, it won't allow the merc to leave alone as the merc is being escorted.  The "single" button is disabled.
    "%s needs to be escorted by your mercs and cannot leave this sector alone.",

    // If only one conscious merc is left and is selected, and there are EPCs in the squad, the merc will be prohibited from leaving alone.
    // There are several strings depending on the gender of the merc and how many EPCs are in the squad.
    // DO NOT USE THE NEWLINE HERE AS IT IS USED FOR BOTH HELPTEXT AND SCREEN MESSAGES!
    "%s cannot leave this sector alone as he is escorting %s.", // male singular
    "%s cannot leave this sector alone as she is escorting %s.", // female singular
    "%s cannot leave this sector alone as he is escorting multiple characters.", // male plural
    "%s cannot leave this sector alone as she is escorting multiple characters.", // female plural

    // If one or more of your mercs in the selected squad aren't in range of the traversal area, then the  "move all" option is disabled,
    // and this helptext explains why.
    "All of your mercs must be in the vicinity\nin order to allow the squad to traverse.",

    "", // UNUSED

    // Standard helptext for single movement.  Explains what will happen (splitting the squad)
    "If checked, %s will travel alone, and\nautomatically get reassigned to a unique squad.",

    // Standard helptext for all movement.  Explains what will happen (moving the squad)
    "If checked, your currently selected\nsquad will travel, leaving this sector.",

    // This strings is used BEFORE the "exiting sector" interface is created.  If you have an EPC selected and you attempt to tactically
    // traverse the EPC while the escorting mercs aren't near enough (or dead, dying, or unconscious), this message will appear and the
    //"exiting sector" interface will not appear.  This is just like the situation where
    // This string is special, as it is not used as helptext.  Do not use the special newline character (\n) for this string.
    "%s is being escorted by your mercs and cannot leave this sector alone. Your other mercs must be nearby before you can leave.",
  ];

  export let pRepairStrings: string[] /* STR16[] */ = [
    "Items", // tell merc to repair items in inventory
    "SAM Site", // tell merc to repair SAM site - SAM is an acronym for Surface to Air Missile
    "Cancel", // cancel this menu
    "Robot", // repair the robot
  ];

  // NOTE: combine prestatbuildstring with statgain to get a line like the example below.
  // "John has gained 3 points of marksmanship skill."

  export let sPreStatBuildString: string[] /* STR16[] */ = [
    "lost", // the merc has lost a statistic
    "gained", // the merc has gained a statistic
    "point of", // singular
    "points of", // plural
    "level of", // singular
    "levels of", // plural
  ];

  export let sStatGainStrings: string[] /* STR16[] */ = [
    "health.",
    "agility.",
    "dexterity.",
    "wisdom.",
    "medical skill.",
    "explosives skill.",
    "mechanical skill.",
    "marksmanship skill.",
    "experience.",
    "strength.",
    "leadership.",
  ];

  export let pHelicopterEtaStrings: string[] /* STR16[] */ = [
    "Total Distance:  ", // total distance for helicopter to travel
    " Safe:  ", // distance to travel to destination
    " Unsafe:", // distance to return from destination to airport
    "Total Cost: ", // total cost of trip by helicopter
    "ETA:  ", // ETA is an acronym for "estimated time of arrival"
    "Helicopter is low on fuel and must land in hostile territory!", // warning that the sector the helicopter is going to use for refueling is under enemy control ->
    "Passengers: ",
    "Select Skyrider or the Arrivals Drop-off?",
    "Skyrider",
    "Arrivals",
  ];

  export let sMapLevelString: string[] /* STR16[] */ = [
    "Sublevel:", // what level below the ground is the player viewing in mapscreen
  ];

  export let gsLoyalString: string[] /* STR16[] */ = [
    "Loyal", // the loyalty rating of a town ie : Loyal 53%
  ];

  // error message for when player is trying to give a merc a travel order while he's underground.

  export let gsUndergroundString: string[] /* STR16[] */ = [
    "can't get travel orders underground.",
  ];

  export let gsTimeStrings: string[] /* STR16[] */ = [
    "h", // hours abbreviation
    "m", // minutes abbreviation
    "s", // seconds abbreviation
    "d", // days abbreviation
  ];

  // text for the various facilities in the sector

  export let sFacilitiesStrings: string[] /* STR16[] */ = [
    "None",
    "Hospital",
    "Industry",
    "Prison",
    "Military",
    "Airport",
    "Shooting Range", // a field for soldiers to practise their shooting skills
  ];

  // text for inventory pop up button

  export let pMapPopUpInventoryText: string[] /* STR16[] */ = [
    "Inventory",
    "Exit",
  ];

  // town strings

  export let pwTownInfoStrings: string[] /* STR16[] */ = [
    "Size", // 0 // size of the town in sectors
    "", // blank line, required
    "Control", // how much of town is controlled
    "None", // none of this town
    "Associated Mine", // mine associated with this town
    "Loyalty", // 5 // the loyalty level of this town
    "Trained", // the forces in the town trained by the player
    "",
    "Main Facilities", // main facilities in this town
    "Level", // the training level of civilians in this town
    "Civilian Training", // 10 // state of civilian training in town
    "Militia", // the state of the trained civilians in the town
  ];

  // Mine strings

  export let pwMineStrings: string[] /* STR16[] */ = [
    "Mine", // 0
    "Silver",
    "Gold",
    "Daily Production",
    "Possible Production",
    "Abandoned", // 5
    "Shut Down",
    "Running Out",
    "Producing",
    "Status",
    "Production Rate",
    "Ore Type", // 10
    "Town Control",
    "Town Loyalty",
    //	L"Working Miners",
  ];

  // blank sector strings

  export let pwMiscSectorStrings: string[] /* STR16[] */ = [
    "Enemy Forces",
    "Sector",
    "# of Items",
    "Unknown",
    "Controlled",
    "Yes",
    "No",
  ];

  // error strings for inventory

  export let pMapInventoryErrorString: string[] /* STR16[] */ = [
    "%s isn't close enough.", // Merc is in sector with item but not close enough
    "Can't select that merc.", // MARK CARTER
    "%s isn't in the sector to take that item.",
    "During combat, you'll have to pick up items manually.",
    "During combat, you'll have to drop items manually.",
    "%s isn't in the sector to drop that item.",
  ];

  export let pMapInventoryStrings: string[] /* STR16[] */ = [
    "Location", // sector these items are in
    "Total Items", // total number of items in sector
  ];

  // help text for the user

  export let pMapScreenFastHelpTextList: string[] /* STR16[] */ = [
    "To change a merc's assignment to such things as another squad, doctor or repair, click within the 'Assign' column",
    "To give a merc a destination in another sector, click within the 'Dest' column",
    "Once a merc has been given a movement order, time compression allows them to get going.",
    "Left click selects the sector. Left click again to give a merc movement orders, or Right click to get sector summary information.",
    "Press 'h' at any time in this screen to get this help dialogue up.",
    "Test Text",
    "Test Text",
    "Test Text",
    "Test Text",
    "There isn't much you can do on this screen until you arrive in Arulco. When you've finalized your team, click on the Time Compression button at the lower right. This will advance time until your team arrives in Arulco.",
  ];

  // movement menu text

  export let pMovementMenuStrings: string[] /* STR16[] */ = [
    "Move Mercs In Sector", // title for movement box
    "Plot Travel Route", // done with movement menu, start plotting movement
    "Cancel", // cancel this menu
    "Other", // title for group of mercs not on squads nor in vehicles
  ];

  export let pUpdateMercStrings: string[] /* STR16[] */ = [
    "Oops:", // an error has occured
    "Mercs Contract Expired:", // this pop up came up due to a merc contract ending
    "Mercs Completed Assignment:", // this pop up....due to more than one merc finishing assignments
    "Mercs Back on the Job:", // this pop up ....due to more than one merc waking up and returing to work
    "Mercs Catching Some Z's:", // this pop up ....due to more than one merc being tired and going to sleep
    "Contracts Expiring Soon:", // this pop up came up due to a merc contract ending
  ];

  // map screen map border buttons help text

  export let pMapScreenBorderButtonHelpText: string[] /* STR16[] */ = [
    "Show To|wns",
    "Show |Mines",
    "Show |Teams & Enemies",
    "Show |Airspace",
    "Show |Items",
    "Show Militia & Enemies (|Z)",
  ];

  export let pMapScreenBottomFastHelp: string[] /* STR16[] */ = [
    "|Laptop",
    "Tactical (|E|s|c)",
    "|Options",
    "Time Compress (|+)", // time compress more
    "Time Compress (|-)", // time compress less
    "Previous Message (|U|p)\nPrevious Page (|P|g|U|p)", // previous message in scrollable list
    "Next Message (|D|o|w|n)\nNext Page (|P|g|D|n)", // next message in the scrollable list
    "Start/Stop Time (|S|p|a|c|e)", // start/stop time compression
  ];

  export let pMapScreenBottomText: string[] /* STR16[] */ = [
    "Current Balance", // current balance in player bank account
  ];

  export let pMercDeadString: string[] /* STR16[] */ = ["%s is dead."];

  export let pDayStrings: string[] /* STR16[] */ = ["Day"];

  // the list of email sender names

  export let pSenderNameList: string[] /* STR16[] */ = [
    "Enrico",
    "Psych Pro Inc",
    "Help Desk",
    "Psych Pro Inc",
    "Speck",
    "R.I.S.", // 5
    "Barry",
    "Blood",
    "Lynx",
    "Grizzly",
    "Vicki", // 10
    "Trevor",
    "Grunty",
    "Ivan",
    "Steroid",
    "Igor", // 15
    "Shadow",
    "Red",
    "Reaper",
    "Fidel",
    "Fox", // 20
    "Sidney",
    "Gus",
    "Buns",
    "Ice",
    "Spider", // 25
    "Cliff",
    "Bull",
    "Hitman",
    "Buzz",
    "Raider", // 30
    "Raven",
    "Static",
    "Len",
    "Danny",
    "Magic",
    "Stephen",
    "Scully",
    "Malice",
    "Dr.Q",
    "Nails",
    "Thor",
    "Scope",
    "Wolf",
    "MD",
    "Meltdown",
    //----------
    "M.I.S. Insurance",
    "Bobby Rays",
    "Kingpin",
    "John Kulba",
    "A.I.M.",
  ];

  // next/prev strings

  export let pTraverseStrings: string[] /* STR16[] */ = ["Previous", "Next"];

  // new mail notify string

  export let pNewMailStrings: string[] /* STR16[] */ = ["You have new mail..."];

  // confirm player's intent to delete messages

  export let pDeleteMailStrings: string[] /* STR16[] */ = [
    "Delete mail?",
    "Delete UNREAD mail?",
  ];

  // the sort header strings

  export let pEmailHeaders: string[] /* STR16[] */ = [
    "From:",
    "Subject:",
    "Day:",
  ];

  // email titlebar text

  export let pEmailTitleText: string[] /* STR16[] */ = ["Mail Box"];

  // the financial screen strings
  export let pFinanceTitle: string[] /* STR16[] */ = [
    "Bookkeeper Plus", // the name we made up for the financial program in the game
  ];

  export let pFinanceSummary: string[] /* STR16[] */ = [
    "Credit:", // credit (subtract from) to player's account
    "Debit:", // debit (add to) to player's account
    "Yesterday's Actual Income:",
    "Yesterday's Other Deposits:",
    "Yesterday's Debits:",
    "Balance At Day's End:",
    "Today's Actual Income:",
    "Today's Other Deposits:",
    "Today's Debits:",
    "Current Balance:",
    "Forecasted Income:",
    "Projected Balance:", // projected balance for player for tommorow
  ];

  // headers to each list in financial screen

  export let pFinanceHeaders: string[] /* STR16[] */ = [
    "Day", // the day column
    "Credit", // the credits column (to ADD money to your account)
    "Debit", // the debits column (to SUBTRACT money from your account)
    "Transaction", // transaction type - see TransactionText below
    "Balance", // balance at this point in time
    "Page", // page number
    "Day(s)", // the day(s) of transactions this page displays
  ];

  export let pTransactionText: string[] /* STR16[] */ = [
    "Accrued Interest", // interest the player has accumulated so far
    "Anonymous Deposit",
    "Transaction Fee",
    "Hired", // Merc was hired
    "Bobby Ray Purchase", // Bobby Ray is the name of an arms dealer
    "Settled Accounts at M.E.R.C.",
    "Medical Deposit for %s", // medical deposit for merc
    "IMP Profile Analysis", // IMP is the acronym for International Mercenary Profiling
    "Purchased Insurance for %s",
    "Reduced Insurance for %s",
    "Extended Insurance for %s", // johnny contract extended
    "Canceled Insurance for %s",
    "Insurance Claim for %s", // insurance claim for merc
    "a day", // merc's contract extended for a day
    "1 week", // merc's contract extended for a week
    "2 weeks", // ... for 2 weeks
    "Mine income",
    "", // String nuked
    "Purchased Flowers",
    "Full Medical Refund for %s",
    "Partial Medical Refund for %s",
    "No Medical Refund for %s",
    "Payment to %s", // %s is the name of the npc being paid
    "Transfer Funds to %s", // transfer funds to a merc
    "Transfer Funds from %s", // transfer funds from a merc
    "Equip militia in %s", // initial cost to equip a town's militia
    "Purchased items from %s.", // is used for the Shop keeper interface.  The dealers name will be appended to the end of the string.
    "%s deposited money.",
  ];

  export let pTransactionAlternateText: string[] /* STR16[] */ = [
    "Insurance for", // insurance for a merc
    "Ext. %s's contract by one day.", // entend mercs contract by a day
    "Ext. %s contract by 1 week.",
    "Ext. %s contract by 2 weeks.",
  ];

  // helicopter pilot payment

  export let pSkyriderText: string[] /* STR16[] */ = [
    "Skyrider was paid $%d", // skyrider was paid an amount of money
    "Skyrider is still owed $%d", // skyrider is still owed an amount of money
    "Skyrider has finished refueling", // skyrider has finished refueling
    "", // unused
    "", // unused
    "Skyrider is ready to fly once more.", // Skyrider was grounded but has been freed
    "Skyrider has no passengers.  If it is your intention to transport mercs in this sector, assign them to Vehicle/Helicopter first.",
  ];

  // strings for different levels of merc morale

  export let pMoralStrings: string[] /* STR16[] */ = [
    "Great",
    "Good",
    "Stable",
    "Poor",
    "Panic",
    "Bad",
  ];

  // Mercs equipment has now arrived and is now available in Omerta or Drassen.

  export let pLeftEquipmentString: string[] /* STR16[] */ = [
    "%s's equipment is now available in Omerta (A9).",
    "%s's equipment is now available in Drassen (B13).",
  ];

  // Status that appears on the Map Screen

  export let pMapScreenStatusStrings: string[] /* STR16[] */ = [
    "Health",
    "Energy",
    "Morale",
    "Condition", // the condition of the current vehicle (its "health")
    "Fuel", // the fuel level of the current vehicle (its "energy")
  ];

  export let pMapScreenPrevNextCharButtonHelpText: string[] /* STR16[] */ = [
    "Previous Merc (|L|e|f|t)", // previous merc in the list
    "Next Merc (|R|i|g|h|t)", // next merc in the list
  ];

  export let pEtaString: string[] /* STR16[] */ = [
    "ETA:", // eta is an acronym for Estimated Time of Arrival
  ];

  export let pTrashItemText: string[] /* STR16[] */ = [
    "You'll never see it again. You sure?", // do you want to continue and lose the item forever
    "This item looks REALLY important. Are you REALLY REALLY sure you want to trash it?", // does the user REALLY want to trash this item
  ];

  export let pMapErrorString: string[] /* STR16[] */ = [
    "Squad can't move with a sleeping merc on it.",

    // 1-5
    "Move the squad above ground first.",
    "Movement orders? It's a hostile sector!",
    "Mercs must be assigned to a squad or vehicle in order to travel.",
    "You don't have any team members yet.", // you have no members, can't do anything
    "Merc can't comply.", // merc can't comply with your order
    // 6-10
    "needs an escort to move. Place him on a squad with one.", // merc can't move unescorted .. for a male
    "needs an escort to move. Place her on a squad with one.", // for a female
    "Merc hasn't yet arrived in Arulco!",
    "Looks like there's some contract negotiations to settle first.",
    "",
    // 11-15
    "Movement orders? There's a battle going on!",
    "You have been ambushed by bloodcats in sector %s!",
    "You have just entered what appears to be a bloodcat lair in sector I16!",
    "",
    "The SAM site in %s has been taken over.",
    // 16-20
    "The mine in %s has been taken over. Your daily income has been reduced to %s per day.",
    "The enemy has taken over sector %s uncontested.",
    "At least one of your mercs could not be put on this assignment.",
    "%s could not join %s as it is already full",
    "%s could not join %s as it is too far away.",
    // 21-25
    "The mine in %s has been captured by Deidranna's forces!",
    "Deidranna's forces have just invaded the SAM site in %s",
    "Deidranna's forces have just invaded %s",
    "Deidranna's forces have just been spotted in %s.",
    "Deidranna's forces have just taken over %s.",
    // 26-30
    "At least one of your mercs could not be put asleep.",
    "At least one of your mercs could not be woken up.",
    "Militia will not appear until they have finished training.",
    "%s cannot be given movement orders at this time.",
    "Militia that are not within town boundaries cannot be moved to another sector.",
    // 31-35
    "You can't have militia in %s.",
    "A vehicle can't move while empty!",
    "%s is too injured to travel!",
    "You must leave the museum first!",
    "%s is dead!",
    // 36-40
    "%s can't switch to %s because it's moving",
    "%s can't enter the vehicle that way",
    "%s can't join %s",
    "You can't compress time until you hire some new mercs!",
    "This vehicle can only travel along roads!",
    // 41-45
    "You can't reassign mercs who are on the move",
    "Vehicle is out of gas!",
    "%s is too tired to travel.",
    "Nobody aboard is able to drive the vehicle.",
    "One or more members of this squad can't move right now.",
    // 46-50
    "One or more of the OTHER mercs can't move right now.",
    "Vehicle is too damaged!",
    "Note that only two mercs may train militia in each sector.",
    "The robot can't move without its controller. Place them together in the same squad.",
  ];

  // help text used during strategic route plotting
  export let pMapPlotStrings: string[] /* STR16[] */ = [
    "Click again on the destination to confirm your final route, or click on another sector to place more waypoints.",
    "Travel route confirmed.",
    "Destination unchanged.",
    "Travel route canceled.",
    "Travel route shortened.",
  ];

  // help text used when moving the merc arrival sector
  export let pBullseyeStrings: string[] /* STR16[] */ = [
    "Click on the sector where you would like the mercs to arrive instead.",
    "OK.  Arriving mercs will be dropped off in %s",
    "Mercs can't be flown there, the airspace isn't secured!",
    "Canceled.  Arrival sector unchanged",
    "Airspace over %s is no longer secure!  Arrival sector was moved to %s.",
  ];

  // help text for mouse regions

  export let pMiscMapScreenMouseRegionHelpText: string[] /* STR16[] */ = [
    "Enter Inventory (|E|n|t|e|r)",
    "Throw Item Away",
    "Exit Inventory (|E|n|t|e|r)",
  ];

  // male version of where equipment is left
  export let pMercHeLeaveString: string[] /* STR16[] */ = [
    "Have %s leave his equipment where he is now (%s) or later on in Drassen (B13) upon catching flight out of Arulco?",
    "Have %s leave his equipment where he is now (%s) or later on in Omerta (A9) upon catching flight out of Arulco?",
    "is about to leave and will drop off his equipment in Omerta (A9).",
    "is about to leave and will drop off his equipment in Drassen (B13).",
    "%s is about to leave and will drop off his equipment in %s.",
  ];

  // female version
  export let pMercSheLeaveString: string[] /* STR16[] */ = [
    "Have %s leave her equipment where she is now (%s) or later on in Drassen (B13) upon catching flight out of Arulco?",
    "Have %s leave her equipment where she is now (%s) or later on in Omerta (A9) upon catching flight out of Arulco?",
    "is about to leave and will drop off her equipment in Omerta (A9).",
    "is about to leave and will drop off her equipment in Drassen (B13).",
    "%s is about to leave and will drop off her equipment in %s.",
  ];

  export let pMercContractOverStrings: string[] /* STR16[] */ = [
    "'s contract ended, so he's gone home.", // merc's contract is over and has departed
    "'s contract ended, so she's gone home.", // merc's contract is over and has departed
    "'s contract was terminated, so he left.", // merc's contract has been terminated
    "'s contract was terminated, so she left.", // merc's contract has been terminated
    "You owe M.E.R.C. too much cash, so %s took off.", // Your M.E.R.C. account is invalid so merc left
  ];

  // Text used on IMP Web Pages

  export let pImpPopUpStrings: string[] /* STR16[] */ = [
    "Invalid Authorization Code",
    "You Are About To Restart The Entire Profiling Process. Are You Certain?",
    "Please Enter A Valid Full Name and Gender",
    "Preliminary analysis of your financial status shows that you cannot afford a profile analysis.",
    "Not A Valid Option At This Time.",
    "To complete an accurate profile, you must have room for at least one team member.",
    "Profile Already Completed.",
  ];

  // button labels used on the IMP site

  export let pImpButtonText: string[] /* STR16[] */ = [
    "About Us", // about the IMP site
    "BEGIN", // begin profiling
    "Personality", // personality section
    "Attributes", // personal stats/attributes section
    "Portrait", // the personal portrait selection
    "Voice %d", // the voice selection
    "Done", // done profiling
    "Start Over", // start over profiling
    "Yes, I choose the highlighted answer.",
    "Yes",
    "No",
    "Finished", // finished answering questions
    "Prev", // previous question..abbreviated form
    "Next", // next question
    "YES, I AM.", // yes, I am certain
    "NO, I WANT TO START OVER.", // no, I want to start over the profiling process
    "YES, I DO.",
    "NO",
    "Back", // back one page
    "Cancel", // cancel selection
    "Yes, I am certain.",
    "No, let me have another look.",
    "Registry", // the IMP site registry..when name and gender is selected
    "Analyzing", // analyzing your profile results
    "OK",
    "Voice",
  ];

  export let pExtraIMPStrings: string[] /* STR16[] */ = [
    "To Commence Actual Profiling, Select Personality.",
    "Now That You Have Completed Personality, Select Your Attributes.",
    "With Attributes Now Allocated, You Can Proceed to Portrait Selection.",
    "To Complete The Process, Select The Voice Sample That Best Fits You.",
  ];

  export let pFilesTitle: string[] /* STR16[] */ = ["File Viewer"];

  export let pFilesSenderList: string[] /* STR16[] */ = [
    "Recon Report", // the recon report sent to the player. Recon is an abbreviation for reconissance
    "Intercept #1", // first intercept file .. Intercept is the title of the organization sending the file...similar in function to INTERPOL/CIA/KGB..refer to fist record in files.txt for the translated title
    "Intercept #2", // second intercept file
    "Intercept #3", // third intercept file
    "Intercept #4", // fourth intercept file
    "Intercept #5", // fifth intercept file
    "Intercept #6", // sixth intercept file
  ];

  // Text having to do with the History Log

  export let pHistoryTitle: string[] /* STR16[] */ = ["History Log"];

  export let pHistoryHeaders: string[] /* STR16[] */ = [
    "Day", // the day the history event occurred
    "Page", // the current page in the history report we are in
    "Day", // the days the history report occurs over
    "Location", // location (in sector) the event occurred
    "Event", // the event label
  ];

  // various history events
  // THESE STRINGS ARE "HISTORY LOG" STRINGS AND THEIR LENGTH IS VERY LIMITED.
  // PLEASE BE MINDFUL OF THE LENGTH OF THESE STRINGS. ONE WAY TO "TEST" THIS
  // IS TO TURN "CHEAT MODE" ON AND USE CONTROL-R IN THE TACTICAL SCREEN, THEN
  // GO INTO THE LAPTOP/HISTORY LOG AND CHECK OUT THE STRINGS. CONTROL-R INSERTS
  // MANY (NOT ALL) OF THE STRINGS IN THE FOLLOWING LIST INTO THE GAME.
  export let pHistoryStrings: string[] /* STR16[] */ = [
    "", // leave this line blank
    // 1-5
    "%s was hired from A.I.M.", // merc was hired from the aim site
    "%s was hired from M.E.R.C.", // merc was hired from the aim site
    "%s died.", // merc was killed
    "Settled Accounts at M.E.R.C.", // paid outstanding bills at MERC
    "Accepted Assignment From Enrico Chivaldori",
    // 6-10
    "IMP Profile Generated",
    "Purchased Insurance Contract for %s.", // insurance contract purchased
    "Canceled Insurance Contract for %s.", // insurance contract canceled
    "Insurance Claim Payout for %s.", // insurance claim payout for merc
    "Extended %s's contract by a day.", // Extented "mercs name"'s for a day
    // 11-15
    "Extended %s's contract by 1 week.", // Extented "mercs name"'s for a week
    "Extended %s's contract by 2 weeks.", // Extented "mercs name"'s 2 weeks
    "%s was dismissed.", // "merc's name" was dismissed.
    "%s quit.", // "merc's name" quit.
    "quest started.", // a particular quest started
    // 16-20
    "quest completed.",
    "Talked to head miner of %s", // talked to head miner of town
    "Liberated %s",
    "Cheat Used",
    "Food should be in Omerta by tomorrow",
    // 21-25
    "%s left team to become Daryl Hick's wife",
    "%s's contract expired.",
    "%s was recruited.",
    "Enrico complained about lack of progress",
    "Battle won",
    // 26-30
    "%s mine started running out of ore",
    "%s mine ran out of ore",
    "%s mine was shut down",
    "%s mine was reopened",
    "Found out about a prison called Tixa.",
    // 31-35
    "Heard about a secret weapons plant called Orta.",
    "Scientist in Orta donated a slew of rocket rifles.",
    "Queen Deidranna has a use for dead bodies.",
    "Frank talked about fighting matches in San Mona.",
    "A patient thinks he saw something in the mines.",
    // 36-40
    "Met someone named Devin - he sells explosives.",
    "Ran into the famous ex-AIM merc Mike!",
    "Met Tony - he deals in arms.",
    "Got a rocket rifle from Sergeant Krott.",
    "Gave Kyle the deed to Angel's leather shop.",
    // 41-45
    "Madlab offered to build a robot.",
    "Gabby can make stealth concoction for bugs.",
    "Keith is out of business.",
    "Howard provided cyanide to Queen Deidranna.",
    "Met Keith - all purpose dealer in Cambria.",
    // 46-50
    "Met Howard - deals pharmaceuticals in Balime",
    "Met Perko - runs a small repair business.",
    "Met Sam of Balime - runs a hardware shop.",
    "Franz deals in electronics and other goods.",
    "Arnold runs a repair shop in Grumm.",
    // 51-55
    "Fredo repairs electronics in Grumm.",
    "Received donation from rich guy in Balime.",
    "Met a junkyard dealer named Jake.",
    "Some bum gave us an electronic keycard.",
    "Bribed Walter to unlock the door to the basement.",
    // 56-60
    "If Dave has gas, he'll provide free fillups.",
    "Greased Pablo's palms.",
    "Kingpin keeps money in San Mona mine.",
    "%s won Extreme Fighting match",
    "%s lost Extreme Fighting match",
    // 61-65
    "%s was disqualified in Extreme Fighting",
    "Found a lot of money stashed in the abandoned mine.",
    "Encountered assassin sent by Kingpin.",
    "Lost control of sector", // ENEMY_INVASION_CODE
    "Defended sector",
    // 66-70
    "Lost battle", // ENEMY_ENCOUNTER_CODE
    "Fatal ambush", // ENEMY_AMBUSH_CODE
    "Wiped out enemy ambush",
    "Unsuccessful attack", // ENTERING_ENEMY_SECTOR_CODE
    "Successful attack!",
    // 71-75
    "Creatures attacked", // CREATURE_ATTACK_CODE
    "Killed by bloodcats", // BLOODCAT_AMBUSH_CODE
    "Slaughtered bloodcats",
    "%s was killed",
    "Gave Carmen a terrorist's head",
    "Slay left",
    "Killed %s",
  ];

  export let pHistoryLocations: string[] /* STR16[] */ = [
    "N/A", // N/A is an acronym for Not Applicable
  ];

  // icon text strings that appear on the laptop

  export let pLaptopIcons: string[] /* STR16[] */ = [
    "E-mail",
    "Web",
    "Financial",
    "Personnel",
    "History",
    "Files",
    "Shut Down",
    "sir-FER 4.0", // our play on the company name (Sirtech) and web surFER
  ];

  // bookmarks for different websites
  // IMPORTANT make sure you move down the Cancel string as bookmarks are being added

  export let pBookMarkStrings: string[] /* STR16[] */ = [
    "A.I.M.",
    "Bobby Ray's",
    "I.M.P",
    "M.E.R.C.",
    "Mortuary",
    "Florist",
    "Insurance",
    "Cancel",
  ];

  export let pBookmarkTitle: string[] /* STR16[] */ = [
    "Bookmarks",
    "Right click to access this menu in the future.",
  ];

  // When loading or download a web page

  export let pDownloadString: string[] /* STR16[] */ = [
    "Downloading",
    "Reloading",
  ];

  // This is the text used on the bank machines, here called ATMs for Automatic Teller Machine

  export let gsAtmSideButtonText: string[] /* STR16[] */ = [
    "OK",
    "Take", // take money from merc
    "Give", // give money to merc
    "Cancel", // cancel transaction
    "Clear", // clear amount being displayed on the screen
  ];

  export let gsAtmStartButtonText: string[] /* STR16[] */ = [
    "Transfer $", // transfer money to merc -- short form
    "Stats", // view stats of the merc
    "Inventory", // view the inventory of the merc
    "Employment",
  ];

  export let sATMText: string[] /* STR16[] */ = [
    "Transfer Funds?", // transfer funds to merc?
    "Ok?", // are we certain?
    "Enter Amount", // enter the amount you want to transfer to merc
    "Select Type", // select the type of transfer to merc
    "Insufficient Funds", // not enough money to transfer to merc
    "Amount must be a multiple of $10", // transfer amount must be a multiple of $10
  ];

  // Web error messages. Please use foreign language equivilant for these messages.
  // DNS is the acronym for Domain Name Server
  // URL is the acronym for Uniform Resource Locator

  export let pErrorStrings: string[] /* STR16[] */ = [
    "Error",
    "Server does not have DNS entry.",
    "Check URL address and try again.",
    "OK",
    "Intermittent Connection to Host. Expect longer transfer times.",
  ];

  export let pPersonnelString: string[] /* STR16[] */ = [
    "Mercs:", // mercs we have
  ];

  export let pWebTitle: string[] /* STR16[] */ = [
    "sir-FER 4.0", // our name for the version of the browser, play on company name
  ];

  // The titles for the web program title bar, for each page loaded

  export let pWebPagesTitles: string[] /* STR16[] */ = [
    "A.I.M.",
    "A.I.M. Members",
    "A.I.M. Mug Shots", // a mug shot is another name for a portrait
    "A.I.M. Sort",
    "A.I.M.",
    "A.I.M. Alumni",
    "A.I.M. Policies",
    "A.I.M. History",
    "A.I.M. Links",
    "M.E.R.C.",
    "M.E.R.C. Accounts",
    "M.E.R.C. Registration",
    "M.E.R.C. Index",
    "Bobby Ray's",
    "Bobby Ray's - Guns",
    "Bobby Ray's - Ammo",
    "Bobby Ray's - Armor",
    "Bobby Ray's - Misc", // misc is an abbreviation for miscellaneous
    "Bobby Ray's - Used",
    "Bobby Ray's - Mail Order",
    "I.M.P.",
    "I.M.P.",
    "United Floral Service",
    "United Floral Service - Gallery",
    "United Floral Service - Order Form",
    "United Floral Service - Card Gallery",
    "Malleus, Incus & Stapes Insurance Brokers",
    "Information",
    "Contract",
    "Comments",
    "McGillicutty's Mortuary",
    "",
    "URL not found.",
    "Bobby Ray's - Recent Shipments",
    "",
    "",
  ];

  export let pShowBookmarkString: string[] /* STR16[] */ = [
    "Sir-Help",
    "Click Web Again for Bookmarks.",
  ];

  export let pLaptopTitles: string[] /* STR16[] */ = [
    "Mail Box",
    "File Viewer",
    "Personnel",
    "Bookkeeper Plus",
    "History Log",
  ];

  export let pPersonnelDepartedStateStrings: string[] /* STR16[] */ = [
    // reasons why a merc has left.
    "Killed in Action",
    "Dismissed",
    "Other",
    "Married",
    "Contract Expired",
    "Quit",
  ];
  // personnel strings appearing in the Personnel Manager on the laptop

  export let pPersonelTeamStrings: string[] /* STR16[] */ = [
    "Current Team",
    "Departures",
    "Daily Cost:",
    "Highest Cost:",
    "Lowest Cost:",
    "Killed in Action:",
    "Dismissed:",
    "Other:",
  ];

  export let pPersonnelCurrentTeamStatsStrings: string[] /* STR16[] */ = [
    "Lowest",
    "Average",
    "Highest",
  ];

  export let pPersonnelTeamStatsStrings: string[] /* STR16[] */ = [
    "HLTH",
    "AGI",
    "DEX",
    "STR",
    "LDR",
    "WIS",
    "LVL",
    "MRKM",
    "MECH",
    "EXPL",
    "MED",
  ];

  // horizontal and vertical indices on the map screen

  export let pMapVertIndex: string[] /* STR16[] */ = [
    "X",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
  ];

  export let pMapHortIndex: string[] /* STR16[] */ = [
    "X",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
  ];

  export let pMapDepthIndex: string[] /* STR16[] */ = ["", "-1", "-2", "-3"];

  // text that appears on the contract button

  export let pContractButtonString: string[] /* STR16[] */ = ["Contract"];

  // text that appears on the update panel buttons

  export let pUpdatePanelButtons: string[] /* STR16[] */ = ["Continue", "Stop"];

  // Text which appears when everyone on your team is incapacitated and incapable of battle

  export let LargeTacticalStr: string[] /* UINT16[][LARGE_STRING_LENGTH] */ = [
    "You have been defeated in this sector!",
    "The enemy, having no mercy for the team's soul, devours each and every one of you!",
    "Your unconscious team members have been captured!",
    "Your team members have been taken prisoner by the enemy.",
  ];

  // Insurance Contract.c
  // The text on the buttons at the bottom of the screen.

  export let InsContractText: string[] /* STR16[] */ = [
    "Previous",
    "Next",
    "Accept",
    "Clear",
  ];

  // Insurance Info
  // Text on the buttons on the bottom of the screen

  export let InsInfoText: string[] /* STR16[] */ = ["Previous", "Next"];

  // For use at the M.E.R.C. web site. Text relating to the player's account with MERC

  export let MercAccountText: string[] /* STR16[] */ = [
    // Text on the buttons on the bottom of the screen
    "Authorize",
    "Home",
    "Account #:",
    "Merc",
    "Days",
    "Rate", // 5
    "Charge",
    "Total:",
    "Are you sure you want to authorize the payment of %s?", // the %s is a string that contains the dollar amount ( ex. "$150" )
  ];

  // For use at the M.E.R.C. web site. Text relating a MERC mercenary

  export let MercInfo: string[] /* STR16[] */ = [
    "Health",
    "Agility",
    "Dexterity",
    "Strength",
    "Leadership",
    "Wisdom",
    "Experience Lvl",
    "Marksmanship",
    "Mechanical",
    "Explosive",
    "Medical",

    "Previous",
    "Hire",
    "Next",
    "Additional Info",
    "Home",
    "Hired",
    "Salary:",
    "Per Day",
    "Deceased",

    "Looks like you're trying to hire too many mercs. Your limit is 18.",
    "Unavailable",
  ];

  // For use at the M.E.R.C. web site. Text relating to opening an account with MERC

  export let MercNoAccountText: string[] /* STR16[] */ = [
    // Text on the buttons at the bottom of the screen
    "Open Account",
    "Cancel",
    "You have no account.  Would you like to open one?",
  ];

  // For use at the M.E.R.C. web site. MERC Homepage

  export let MercHomePageText: string[] /* STR16[] */ = [
    // Description of various parts on the MERC page
    "Speck T. Kline, founder and owner",
    "To open an account press here",
    "To view account press here",
    "To view files press here",
    // The version number on the video conferencing system that pops up when Speck is talking
    "Speck Com v3.2",
  ];

  // For use at MiGillicutty's Web Page.

  export let sFuneralString: string[] /* STR16[] */ = [
    "McGillicutty's Mortuary: Helping families grieve since 1983.",
    'Funeral Director and former A.I.M. mercenary Murray "Pops" McGillicutty is a highly skilled and experienced mortician.',
    "Having been intimately involved in death and bereavement throughout his life, Pops knows how difficult it can be.",
    "McGillicutty's Mortuary offers a wide range of bereavement services, from a shoulder to cry on to post-mortem reconstruction for badly disfigured remains.",
    "Let McGillicutty's Mortuary help you and your loved one rest in peace.",

    // Text for the various links available at the bottom of the page
    "SEND FLOWERS",
    "CASKET & URN COLLECTION",
    "CREMATION SERVICES",
    "PRE- FUNERAL PLANNING SERVICES",
    "FUNERAL ETIQUETTE",

    // The text that comes up when you click on any of the links ( except for send flowers ).
    "Regretably, the remainder of this site has not been completed due to a death in the family. Pending reading of the will and disbursement of assets, the site will be completed as soon as possible.",
    "Our sympathies do, however, go out to you at this trying time.  Please come again.",
  ];

  // Text for the florist Home page

  export let sFloristText: string[] /* STR16[] */ = [
    // Text on the button on the bottom of the page

    "Gallery",

    // Address of United Florist

    '"We air-drop anywhere"',
    "1-555-SCENT-ME",
    "333 NoseGay Dr, Seedy City, CA USA 90210",
    "http://www.scent-me.com",

    // detail of the florist page

    "We're fast and efficient!",
    "Next day delivery to most areas worldwide, guaranteed.  Some restrictions apply.",
    "Lowest prices in the world, guaranteed!",
    "Show us a lower advertised price for any arrangements, and receive a dozen roses, absolutely free.",
    "Flying Flora, Fauna & Flowers Since 1981.",
    "Our decorated ex-bomber aviators will air-drop your bouquet within a ten mile radius of the requested location.  Anytime - Everytime!",
    "Let us satisfy your floral fantasy.",
    "Let Bruce, our world-renowned floral designer, hand-pick the freshest, highest quality flowers from our very own greenhouse.",
    "And remember, if we don't have it, we can grow it - Fast!",
  ];

  // Florist OrderForm

  export let sOrderFormText: string[] /* STR16[] */ = [
    // Text on the buttons

    "Back",
    "Send",
    "Clear",
    "Gallery",

    "Name of Bouquet:",
    "Price:", // 5
    "Order Number:",
    "Delivery Date",
    "next day",
    "gets there when it gets there",
    "Delivery Location", // 10
    "Additional Services",
    "Crushed Bouquet($10)",
    "Black Roses($20)",
    "Wilted Bouquet($10)",
    "Fruit Cake (if available)($10)", // 15
    "Personal Sentiments:",
    "Due to the size of gift cards, your message can be no longer than 75 characters.",
    "...or select from one of our",

    "STANDARDIZED CARDS",
    "Billing Information", // 20

    // The text that goes beside the area where the user can enter their name

    "Name:",
  ];

  // Florist Gallery.c

  export let sFloristGalleryText: string[] /* STR16[] */ = [
    // text on the buttons

    "Prev", // abbreviation for previous
    "Next", // abbreviation for next

    "Click on the selection you want to order.",
    "Please Note: there is an additional $10 fee for all wilted or crushed bouquets.",

    // text on the button

    "Home",
  ];

  // Florist Cards

  export let sFloristCards: string[] /* STR16[] */ = [
    "Click on your selection",
    "Back",
  ];

  // Text for Bobby Ray's Mail Order Site

  export let BobbyROrderFormText: string[] /* STR16[] */ = [
    "Order Form", // Title of the page
    "Qty", // The number of items ordered
    "Weight (%s)", // The weight of the item
    "Item Name", // The name of the item
    "Unit Price", // the item's weight
    "Total", // 5	// The total price of all of items of the same type
    "Sub-Total", // The sub total of all the item totals added
    "S&H (See Delivery Loc.)", // S&H is an acronym for Shipping and Handling
    "Grand Total", // The grand total of all item totals + the shipping and handling
    "Delivery Location",
    "Shipping Speed", // 10	// See below
    "Cost (per %s.)", // The cost to ship the items
    "Overnight Express", // Gets deliverd the next day
    "2 Business Days", // Gets delivered in 2 days
    "Standard Service", // Gets delivered in 3 days
    "Clear Order", // 15			// Clears the order page
    "Accept Order", // Accept the order
    "Back", // text on the button that returns to the previous page
    "Home", // Text on the button that returns to the home page
    "* Denotes Used Items", // Disclaimer stating that the item is used
    "You can't afford to pay for this.", // 20	// A popup message that to warn of not enough money
    "<NONE>", // Gets displayed when there is no valid city selected
    "Are you sure you want to send this order to %s?", // A popup that asks if the city selected is the correct one
    "Package Weight**", // Displays the weight of the package
    "** Min. Wt.", // Disclaimer states that there is a minimum weight for the package
    "Shipments",
  ];

  // This text is used when on the various Bobby Ray Web site pages that sell items

  export let BobbyRText: string[] /* STR16[] */ = [
    "To Order", // Title
    // instructions on how to order
    "Click on the item(s). For more than one, keep on clicking. Right click for less. Once you've selected all you'd like to buy, go on to the order form.",

    // Text on the buttons to go the various links

    "Previous Items", //
    "Guns", // 3
    "Ammo", // 4
    "Armor", // 5
    "Misc.", // 6	//misc is an abbreviation for miscellaneous
    "Used", // 7
    "More Items",
    "ORDER FORM",
    "Home", // 10

    // The following 2 lines are used on the Ammunition page.
    // They are used for help text to display how many items the player's merc has
    // that can use this type of ammo

    "Your team has", // 11
    "weapon(s) that use this type of ammo", // 12

    // The following lines provide information on the items

    "Weight:", // Weight of all the items of the same type
    "Cal:", // the caliber of the gun
    "Mag:", // number of rounds of ammo the Magazine can hold
    "Rng:", // The range of the gun
    "Dam:", // Damage of the weapon
    "ROF:", // Weapon's Rate Of Fire, acronym ROF
    "Cost:", // Cost of the item
    "In stock:", // The number of items still in the store's inventory
    "Qty on Order:", // The number of items on order
    "Damaged", // If the item is damaged
    "Weight:", // the Weight of the item
    "SubTotal:", // The total cost of all items on order
    "* %% Functional", // if the item is damaged, displays the percent function of the item

    // Popup that tells the player that they can only order 10 items at a time

    "Darn!  This here on-line order form will only accept 10 items per order.  If you're looking to order more stuff (and we hope you are), kindly make a separate order and accept our apologies.",

    // A popup that tells the user that they are trying to order more items then the store has in stock

    "Sorry. We don't have any more of that in stock right now. Please try again later.",

    // A popup that tells the user that the store is temporarily sold out

    "Sorry, but we are currently out of stock on all items of that type.",
  ];

  // Text for Bobby Ray's Home Page

  export let BobbyRaysFrontText: string[] /* STR16[] */ = [
    // Details on the web site

    "This is the place to be for the newest and hottest in weaponry and military supplies",
    "We can find the perfect solution for all your explosives needs",
    "Used and refitted items",

    // Text for the various links to the sub pages

    "Miscellaneous",
    "GUNS",
    "AMMUNITION", // 5
    "ARMOR",

    // Details on the web site

    "If we don't sell it, you can't get it!",
    "Under Construction",
  ];

  // Text for the AIM page.
  // This is the text used when the user selects the way to sort the aim mercanaries on the AIM mug shot page

  export let AimSortText: string[] /* STR16[] */ = [
    "A.I.M. Members", // Title
    // Title for the way to sort
    "Sort By:",

    // sort by...

    "Price",
    "Experience",
    "Marksmanship",
    "Medical",
    "Explosives",
    "Mechanical",

    // Text of the links to other AIM pages

    "View the mercenary mug shot index",
    "Review the individual mercenary's file",
    "Browse the A.I.M. Alumni Gallery",

    // text to display how the entries will be sorted

    "Ascending",
    "Descending",
  ];

  // Aim Policies.c
  // The page in which the AIM policies and regulations are displayed

  export let AimPolicyText: string[] /* STR16[] */ = [
    // The text on the buttons at the bottom of the page

    "Previous Page",
    "AIM HomePage",
    "Policy Index",
    "Next Page",
    "Disagree",
    "Agree",
  ];

  // Aim Member.c
  // The page in which the players hires AIM mercenaries

  // Instructions to the user to either start video conferencing with the merc, or to go the mug shot index

  export let AimMemberText: string[] /* STR16[] */ = [
    "Left Click",
    "to Contact Merc.",
    "Right Click",
    "for Mug Shot Index.",
  ];

  // Aim Member.c
  // The page in which the players hires AIM mercenaries

  export let CharacterInfo: string[] /* STR16[] */ = [
    // The various attributes of the merc

    "Health",
    "Agility",
    "Dexterity",
    "Strength",
    "Leadership",
    "Wisdom",
    "Experience Lvl",
    "Marksmanship",
    "Mechanical",
    "Explosive",
    "Medical", // 10

    // the contract expenses' area

    "Fee",
    "Contract",
    "one day",
    "one week",
    "two weeks",

    // text for the buttons that either go to the previous merc,
    // start talking to the merc, or go to the next merc

    "Previous",
    "Contact",
    "Next",

    "Additional Info", // Title for the additional info for the merc's bio
    "Active Members", // 20		// Title of the page
    "Optional Gear:", // Displays the optional gear cost
    "MEDICAL deposit required", // If the merc required a medical deposit, this is displayed
  ];

  // Aim Member.c
  // The page in which the player's hires AIM mercenaries

  // The following text is used with the video conference popup

  export let VideoConfercingText: string[] /* STR16[] */ = [
    "Contract Charge:", // Title beside the cost of hiring the merc

    // Text on the buttons to select the length of time the merc can be hired

    "One Day",
    "One Week",
    "Two Weeks",

    // Text on the buttons to determine if you want the merc to come with the equipment

    "No Equipment",
    "Buy Equipment",

    // Text on the Buttons

    "TRANSFER FUNDS", // to actually hire the merc
    "CANCEL", // go back to the previous menu
    "HIRE", // go to menu in which you can hire the merc
    "HANG UP", // stops talking with the merc
    "OK",
    "LEAVE MESSAGE", // if the merc is not there, you can leave a message

    // Text on the top of the video conference popup

    "Video Conferencing with",
    "Connecting. . .",

    "with medical", // Displays if you are hiring the merc with the medical deposit
  ];

  // Aim Member.c
  // The page in which the player hires AIM mercenaries

  // The text that pops up when you select the TRANSFER FUNDS button

  export let AimPopUpText: string[] /* STR16[] */ = [
    "ELECTRONIC FUNDS TRANSFER SUCCESSFUL", // You hired the merc
    "UNABLE TO PROCESS TRANSFER", // Player doesn't have enough money, message 1
    "INSUFFICIENT FUNDS", // Player doesn't have enough money, message 2

    // if the merc is not available, one of the following is displayed over the merc's face

    "On Assignment",
    "Please Leave Message",
    "Deceased",

    // If you try to hire more mercs than game can support

    "You have a full team of 18 mercs already.",

    "Pre-recorded message",
    "Message recorded",
  ];

  // AIM Link.c

  export let AimLinkText: string[] /* STR16[] */ = [
    "A.I.M. Links", // The title of the AIM links page
  ];

  // Aim History

  // This page displays the history of AIM

  export let AimHistoryText: string[] /* STR16[] */ = [
    "A.I.M. History", // Title

    // Text on the buttons at the bottom of the page

    "Previous Page",
    "Home",
    "A.I.M. Alumni",
    "Next Page",
  ];

  // Aim Mug Shot Index

  // The page in which all the AIM members' portraits are displayed in the order selected by the AIM sort page.

  export let AimFiText: string[] /* STR16[] */ = [
    // displays the way in which the mercs were sorted

    "Price",
    "Experience",
    "Marksmanship",
    "Medical",
    "Explosives",
    "Mechanical",

    // The title of the page, the above text gets added at the end of this text

    "A.I.M. Members Sorted Ascending By %s",
    "A.I.M. Members Sorted Descending By %s",

    // Instructions to the players on what to do

    "Left Click",
    "To Select Merc", // 10
    "Right Click",
    "For Sorting Options",

    // Gets displayed on top of the merc's portrait if they are...

    "Away",
    "Deceased", // 14
    "On Assign",
  ];

  // AimArchives.
  // The page that displays information about the older AIM alumni merc... mercs who are no longer with AIM

  export let AimAlumniText: string[] /* STR16[] */ = [
    // Text of the buttons

    "PAGE 1",
    "PAGE 2",
    "PAGE 3",

    "A.I.M. Alumni", // Title of the page

    "DONE", // Stops displaying information on selected merc
  ];

  // AIM Home Page

  export let AimScreenText: string[] /* STR16[] */ = [
    // AIM disclaimers

    "A.I.M. and the A.I.M. logo are registered trademarks in most countries.",
    "So don't even think of trying to copy us.",
    "Copyright 1998-1999 A.I.M., Ltd.  All rights reserved.",

    // Text for an advertisement that gets displayed on the AIM page

    "United Floral Service",
    '"We air-drop anywhere"', // 10
    "Do it right",
    "... the first time",
    "Guns and stuff, if we dont have it, you dont need it.",
  ];

  // Aim Home Page

  export let AimBottomMenuText: string[] /* STR16[] */ = [
    // Text for the links at the bottom of all AIM pages
    "Home",
    "Members",
    "Alumni",
    "Policies",
    "History",
    "Links",
  ];

  // ShopKeeper Interface
  // The shopkeeper interface is displayed when the merc wants to interact with
  // the various store clerks scattered through out the game.

  export let SKI_Text: string[] /* STR16[] */ = [
    "MERCHANDISE IN STOCK", // Header for the merchandise available
    "PAGE", // The current store inventory page being displayed
    "TOTAL COST", // The total cost of the the items in the Dealer inventory area
    "TOTAL VALUE", // The total value of items player wishes to sell
    "EVALUATE", // Button text for dealer to evaluate items the player wants to sell
    "TRANSACTION", // Button text which completes the deal. Makes the transaction.
    "DONE", // Text for the button which will leave the shopkeeper interface.
    "REPAIR COST", // The amount the dealer will charge to repair the merc's goods
    "1 HOUR", // SINGULAR! The text underneath the inventory slot when an item is given to the dealer to be repaired
    "%d HOURS", // PLURAL!   The text underneath the inventory slot when an item is given to the dealer to be repaired
    "REPAIRED", // Text appearing over an item that has just been repaired by a NPC repairman dealer
    "There is not enough room in your offer area.", // Message box that tells the user there is no more room to put there stuff
    "%d MINUTES", // The text underneath the inventory slot when an item is given to the dealer to be repaired
    "Drop Item To Ground.",
  ];

  // ShopKeeper Interface
  // for the bank machine panels. Referenced here is the acronym ATM, which means Automatic Teller Machine

  export let SkiAtmText: string[] /* STR16[] */ = [
    // Text on buttons on the banking machine, displayed at the bottom of the page
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "OK", // Transfer the money
    "Take", // Take money from the player
    "Give", // Give money to the player
    "Cancel", // Cancel the transfer
    "Clear", // Clear the money display
  ];

  // Shopkeeper Interface
  export let gzSkiAtmText: string[] /* STR16[] */ = [
    // Text on the bank machine panel that....
    "Select Type", // tells the user to select either to give or take from the merc
    "Enter Amount", // Enter the amount to transfer
    "Transfer Funds To Merc", // Giving money to the merc
    "Transfer Funds From Merc", // Taking money from the merc
    "Insufficient Funds", // Not enough money to transfer
    "Balance", // Display the amount of money the player currently has
  ];

  export let SkiMessageBoxText: string[] /* STR16[] */ = [
    "Do you want to deduct %s from your main account to cover the difference?",
    "Not enough funds.  You're short %s",
    "Do you want to deduct %s from your main account to cover the cost?",
    "Ask the dealer to start the transaction",
    "Ask the dealer to repair the selected items",
    "End conversation",
    "Current Balance",
  ];

  // OptionScreen.c

  export let zOptionsText: string[] /* STR16[] */ = [
    // button Text
    "Save Game",
    "Load Game",
    "Quit",
    "Done",

    // Text above the slider bars
    "Effects",
    "Speech",
    "Music",

    // Confirmation pop when the user selects..
    "Quit game and return to the main menu?",

    "You need either the Speech option, or the Subtitle option to be enabled.",
  ];

  // SaveLoadScreen
  export let zSaveLoadText: string[] /* STR16[] */ = [
    "Save Game",
    "Load Game",
    "Cancel",
    "Save Selected",
    "Load Selected",

    "Saved the game successfully",
    "ERROR saving the game!",
    "Loaded the game successfully",
    "ERROR loading the game!",

    "The game version in the saved game file is different then the current version.  It is most likely safe to continue.  Continue?",
    "The saved game files may be invalidated.  Do you want them all deleted?",

    // Translators, the next two strings are for the same thing.  The first one is for beta version releases and the second one
    // is used for the final version.  Please don't modify the "#ifdef JA2BETAVERSION" or the "#else" or the "#endif" as they are
    // used by the compiler and will cause program errors if modified/removed.  It's okay to translate the strings though.
    "Attempting to load an older version save.  Automatically update and load the save?",

    // Translators, the next two strings are for the same thing.  The first one is for beta version releases and the second one
    // is used for the final version.  Please don't modify the "#ifdef JA2BETAVERSION" or the "#else" or the "#endif" as they are
    // used by the compiler and will cause program errors if modified/removed.  It's okay to translate the strings though.
    "Attempting to load an older version save.  Automatically update and load the save?",

    "Are you sure you want to overwrite the saved game in slot #%d?",
    "Do you want to load the game from slot #",

    // The first %d is a number that contains the amount of free space on the users hard drive,
    // the second is the recommended amount of free space.
    "You are running low on disk space.  You only have %d Megs free and Jagged should have at least %d Megs free.",

    "Saving...", // When saving a game, a message box with this string appears on the screen

    "Normal Guns",
    "Tons of Guns",
    "Realistic style",
    "Sci Fi style",

    "Difficulty",
  ];

  // MapScreen
  export let zMarksMapScreenText: string[] /* STR16[] */ = [
    "Map Level",
    "You have no militia.  You need to train town residents in order to have a town militia.",
    "Daily Income",
    "Merc has life insurance",
    "%s isn't tired.",
    "%s is on the move and can't sleep",
    "%s is too tired, try a little later.",
    "%s is driving.",
    "Squad can't move with a sleeping merc on it.",

    // stuff for contracts
    "While you can pay for the contract, you don't have the bucks to cover this merc's life insurance premium.",
    "%s insurance premium will cost %s for %d extra day(s). Do you want to pay?",
    "Sector Inventory",
    "Merc has a medical deposit.",

    // other items
    "Medics", // people acting a field medics and bandaging wounded mercs
    "Patients", // people who are being bandaged by a medic
    "Done", // Continue on with the game after autobandage is complete
    "Stop", // Stop autobandaging of patients by medics now
    "Sorry. This option has been disabled in this demo.", // informs player this option/button has been disabled in the demo
    "%s doesn't have a repair kit.",
    "%s doesn't have a medical kit.",
    "There aren't enough people willing to be trained right now.",
    "%s is full of militia.",
    "Merc has a finite contract.",
    "Merc's contract is not insured",
  ];

  export let pLandMarkInSectorString: string[] /* STR16[] */ = [
    "Squad %d has noticed someone in sector %s",
  ];

  // confirm the player wants to pay X dollars to build a militia force in town
  export let pMilitiaConfirmStrings: string[] /* STR16[] */ = [
    "Training a squad of town militia will cost $", // telling player how much it will cost
    "Approve expenditure?", // asking player if they wish to pay the amount requested
    "You can't afford it.", // telling the player they can't afford to train this town
    "Continue training militia in %s (%s %d)?", // continue training this town?
    "Cost $", // the cost in dollars to train militia
    "( Y/N )", // abbreviated yes/no
    "", // unused
    "Training town militia in %d sectors will cost $ %d. %s", // cost to train sveral sectors at once
    "You cannot afford the $%d to train town militia here.",
    "%s needs a loyalty of %d percent for you to be able to continue training militia.",
    "You cannot train the militia in %s any further.",
  ];

  // Strings used in the popup box when withdrawing, or depositing money from the $ sign at the bottom of the single merc panel
  export let gzMoneyWithdrawMessageText: string[] /* STR16[] */ = [
    "You can only withdraw up to $20,000 at a time.",
    "Are you sure you want to deposit the %s into your account?",
  ];

  export let gzCopyrightText: string[] /* STR16[] */ = [
    "Copyright (C) 1999 Sir-tech Canada Ltd.  All rights reserved.",
  ];

  // option Text
  export let zOptionsToggleText: string[] /* STR16[] */ = [
    "Speech",
    "Mute Confirmations",
    "SubTitles",
    "Pause Text Dialogue",
    "Animate Smoke",
    "Blood n Gore",
    "Never Move My Mouse!",
    "Old Selection Method",
    "Show Movement Path",
    "Show Misses",
    "Real Time Confirmation",
    "Display sleep/wake notifications",
    "Use Metric System",
    "Merc Lights during Movement",
    "Snap Cursor to Mercs",
    "Snap Cursor to Doors",
    "Make Items Glow",
    "Show Tree Tops",
    "Show Wireframes",
    "Show 3D Cursor",
  ];

  // This is the help text associated with the above toggles.
  export let zOptionsScreenHelpText: string[] /* STR16[] */ = [
    // speech
    "Keep this option ON if you want to hear character dialogue.",

    // Mute Confirmation
    "Turns characters' verbal confirmations on or off.",

    // Subtitles
    "Controls whether on-screen text is displayed for dialogue.",

    // Key to advance speech
    "If Subtitles are ON, turn this on also to be able to take your time reading NPC dialogue.",

    // Toggle smoke animation
    "Turn off this option if animating smoke slows down your game's framerate.",

    // Blood n Gore
    "Turn this option OFF if blood offends you.",

    // Never move my mouse
    "Turn this option OFF to have your mouse automatically move over pop-up confirmation boxes when they appear.",

    // Old selection method
    "Turn this ON for character selection to work as in previous JAGGED ALLIANCE games (which is the opposite of how it works otherwise).",

    // Show movement path
    "Turn this ON to display movement paths in Real-time (or leave it off and use the SHIFT key when you do want them displayed).",

    // show misses
    'Turn ON to have the game show you where your bullets ended up when you "miss".',

    // Real Time Confirmation
    'When ON, an additional "safety" click will be required for movement in Real-time.',

    // Sleep/Wake notification
    'When ON, you will be notified when mercs on "assignment" go to sleep and resume work.',

    // Use the metric system
    "When ON, uses the metric system for measurements; otherwise it uses the Imperial system.",

    // Merc Lighted movement
    "When ON, the merc will light the ground while walking.  Turn OFF for faster frame rate.",

    // Smart cursor
    "When ON, moving the cursor near your mercs will automatically highlight them.",

    // snap cursor to the door
    "When ON, moving the cursor near a door will automatically position the cursor over the door.",

    // glow items
    "When ON, |Items continuously glow",

    // toggle tree tops
    "When ON, shows the |Tree tops.",

    // toggle wireframe
    "When ON, displays |Wireframes for obscured walls.",

    "When ON, the movement cursor is shown in 3D. ( |Home )",
  ];

  export let gzGIOScreenText: string[] /* STR16[] */ = [
    "INITIAL GAME SETTINGS",
    "Game Style",
    "Realistic",
    "Sci Fi",
    "Gun Options",
    "Tons of Guns",
    "Normal",
    "Difficulty Level",
    "Novice",
    "Experienced",
    "Expert",
    "Ok",
    "Cancel",
    "Extra Difficulty",
    "Save Anytime",
    "Iron Man",
    "Disabled for Demo",
  ];

  export let pDeliveryLocationStrings: string[] /* STR16[] */ = [
    "Austin", // Austin, Texas, USA
    "Baghdad", // Baghdad, Iraq (Suddam Hussein's home)
    "Drassen", // The main place in JA2 that you can receive items.  The other towns are dummy names...
    "Hong Kong", // Hong Kong, Hong Kong
    "Beirut", // Beirut, Lebanon	(Middle East)
    "London", // London, England
    "Los Angeles", // Los Angeles, California, USA (SW corner of USA)
    "Meduna", // Meduna -- the other airport in JA2 that you can receive items.
    "Metavira", // The island of Metavira was the fictional location used by JA1
    "Miami", // Miami, Florida, USA (SE corner of USA)
    "Moscow", // Moscow, USSR
    "New York", // New York, New York, USA
    "Ottawa", // Ottawa, Ontario, Canada -- where JA2 was made!
    "Paris", // Paris, France
    "Tripoli", // Tripoli, Libya (eastern Mediterranean)
    "Tokyo", // Tokyo, Japan
    "Vancouver", // Vancouver, British Columbia, Canada (west coast near US border)
  ];

  export let pSkillAtZeroWarning: string[] /* STR16[] */ = [
    // This string is used in the IMP character generation.  It is possible to select 0 ability
    // in a skill meaning you can't use it.  This text is confirmation to the player.
    "Are you sure? A value of zero means NO ability in this skill.",
  ];

  export let pIMPBeginScreenStrings: string[] /* STR16[] */ = [
    "( 8 Characters Max )",
  ];

  export let pIMPFinishButtonText: string[] /* STR16[1] */ = ["Analyzing"];

  export let pIMPFinishStrings: string[] /* STR16[] */ = [
    "Thank You, %s", //%s is the name of the merc
  ];

  // the strings for imp voices screen
  export let pIMPVoicesStrings: string[] /* STR16[] */ = ["Voice"];

  export let pDepartedMercPortraitStrings: string[] /* STR16[] */ = [
    "Killed in Action",
    "Dismissed",
    "Other",
  ];

  // title for program
  export let pPersTitleText: string[] /* STR16[] */ = ["Personnel Manager"];

  // paused game strings
  export let pPausedGameText: string[] /* STR16[] */ = [
    "Game Paused",
    "Resume Game (|P|a|u|s|e)",
    "Pause Game (|P|a|u|s|e)",
  ];

  export let pMessageStrings: string[] /* STR16[] */ = [
    "Exit Game?",
    "OK",
    "YES",
    "NO",
    "CANCEL",
    "REHIRE",
    "LIE",
    "No description", // Save slots that don't have a description.
    "Game Saved.",
    "Game Saved.",
    "QuickSave", // The name of the quicksave file (filename, text reference)
    "SaveGame", // The name of the normal savegame file, such as SaveGame01, SaveGame02, etc.
    "sav", // The 3 character dos extension (represents sav)
    path.join("..", "SavedGames"), // The name of the directory where games are saved.
    "Day",
    "Mercs",
    "Empty Slot", // An empty save game slot
    "Demo", // Demo of JA2
    "Debug", // State of development of a project (JA2) that is a debug build
    "Release", // Release build for JA2
    "rpm", // Abbreviation for Rounds per minute -- the potential # of bullets fired in a minute.
    "min", // Abbreviation for minute.
    "m", // One character abbreviation for meter (metric distance measurement unit).
    "rnds", // Abbreviation for rounds (# of bullets)
    "kg", // Abbreviation for kilogram (metric weight measurement unit)
    "lb", // Abbreviation for pounds (Imperial weight measurement unit)
    "Home", // Home as in homepage on the internet.
    "USD", // Abbreviation to US dollars
    "n/a", // Lowercase acronym for not applicable.
    "Meanwhile", // Meanwhile
    "%s has arrived in sector %s%s", // Name/Squad has arrived in sector A9.  Order must not change without notifying
    // SirTech
    "Version",
    "Empty Quick Save Slot",
    "This slot is reserved for Quick Saves made from the tactical and map screens using ALT+S.",
    "Opened",
    "Closed",
    "You are running low on disk space.  You only have %sMB free and Jagged Alliance 2 requires %sMB.",
    "Hired %s from AIM",
    "%s has caught %s.", //'Merc name' has caught 'item' -- let SirTech know if name comes after item.
    "%s has taken the drug.", //'Merc name' has taken the drug
    "%s has no medical skill", //'Merc name' has no medical skill.

    // CDRom errors (such as ejecting CD while attempting to read the CD)
    "The integrity of the game has been compromised.",
    "ERROR: Ejected CD-ROM",

    // When firing heavier weapons in close quarters, you may not have enough room to do so.
    "There is no room to fire from here.",

    // Can't change stance due to objects in the way...
    "Cannot change stance at this time.",

    // Simple text indications that appear in the game, when the merc can do one of these things.
    "Drop",
    "Throw",
    "Pass",

    "%s passed to %s.", //"Item" passed to "merc".  Please try to keep the item %s before the merc %s, otherwise,
    // must notify SirTech.
    "No room to pass %s to %s.", // pass "item" to "merc".  Same instructions as above.

    // A list of attachments appear after the items.  Ex:  Kevlar vest ( Ceramic Plate 'Attached )'
    " Attached )",

    // Cheat modes
    "Cheat level ONE reached",
    "Cheat level TWO reached",

    // Toggling various stealth modes
    "Squad on stealth mode.",
    "Squad off stealth mode.",
    "%s on stealth mode.",
    "%s off stealth mode.",

    // Wireframes are shown through buildings to reveal doors and windows that can't otherwise be seen in
    // an isometric engine.  You can toggle this mode freely in the game.
    "Extra Wireframes On",
    "Extra Wireframes Off",

    // These are used in the cheat modes for changing levels in the game.  Going from a basement level to
    // an upper level, etc.
    "Can't go up from this level...",
    "There are no lower levels...",
    "Entering basement level %d...",
    "Leaving basement...",

    "'s", // used in the shop keeper inteface to mark the ownership of the item eg Red's gun
    "Follow mode OFF.",
    "Follow mode ON.",
    "3D Cursor OFF.",
    "3D Cursor ON.",
    "Squad %d active.",
    "You cannot afford to pay for %s's daily salary of %s", // first %s is the mercs name, the seconds is a string containing the salary
    "Skip",
    "%s cannot leave alone.",
    "A save has been created called, SaveGame99.sav.  If needed, rename it to SaveGame01 - SaveGame10 and then you will have access to it in the Load screen.",
    "%s drank some %s",
    "A package has arrived in Drassen.",
    "%s should arrive at the designated drop-off point (sector %s) on day %d, at approximately %s.", // first %s is mercs name, next is the sector location and name where they will be arriving in, lastely is the day an the time of arrival
    "History log updated.",
  ];

  export let ItemPickupHelpPopup: string[] /* UINT16[][40] */ = [
    "OK",
    "Scroll Up",
    "Select All",
    "Scroll Down",
    "Cancel",
  ];

  export let pDoctorWarningString: string[] /* STR16[] */ = [
    "%s isn't close enough to be healed.",
    "Your medics were unable to completely bandage everyone.",
  ];

  export let pMilitiaButtonsHelpText: string[] /* STR16[] */ = [
    "Pick up(Right Click)/drop(Left Click) Green Troops", // button help text informing player they can pick up or drop militia with this button
    "Pick up(Right Click)/drop(Left Click) Regular Troops",
    "Pick up(Right Click)/drop(Left Click) Veteran Troops",
    "Distribute available militia equally among all sectors",
  ];

  export let pMapScreenJustStartedHelpText: string[] /* STR16[] */ = [
    "Go to AIM and hire some mercs ( *Hint* it's in the Laptop )", // to inform the player to hired some mercs to get things going
    "When you're ready to travel to Arulco, click on the Time Compression button at the bottom right of the screen.", // to inform the player to hit time compression to get the game underway
  ];

  export let pAntiHackerString: string[] /* STR16[] */ = [
    "Error. Missing or corrupted file(s). Game will exit now.",
  ];

  export let gzLaptopHelpText: string[] /* STR16[] */ = [
    // Buttons:
    "View email",
    "Browse various web sites",
    "View files and email attachments",
    "Read log of events",
    "View team info",
    "View financial summary and history",
    "Close laptop",

    // Bottom task bar icons (if they exist):
    "You have new mail",
    "You have new file(s)",

    // Bookmarks:
    "Association of International Mercenaries",
    "Bobby Ray's online weapon mail order",
    "Institute of Mercenary Profiling",
    "More Economic Recruiting Center",
    "McGillicutty's Mortuary",
    "United Floral Service",
    "Insurance Brokers for A.I.M. contracts",
  ];

  export let gzHelpScreenText: string[] /* STR16[] */ = ["Exit help screen"];

  export let gzNonPersistantPBIText: string[] /* STR16[] */ = [
    "There is a battle in progress. You can only retreat from the tactical screen.",
    "|Enter sector to continue the current battle in progress.",
    "|Automatically resolves the current battle.",
    "You can't automatically resolve a battle when you are the attacker.",
    "You can't automatically resolve a battle while you are being ambushed.",
    "You can't automatically resolve a battle while you are fighting creatures in the mines.",
    "You can't automatically resolve a battle while there are hostile civilians.",
    "You can't automatically resolve a battle while there are bloodcats.",
    "BATTLE IN PROGRESS",
    "You cannot retreat at this time.",
  ];

  export let gzMiscString: string[] /* STR16[] */ = [
    "Your militia continue to battle without the aid of your mercs...",
    "The vehicle does not need anymore fuel right now.",
    "The fuel tank is %d%% full.",
    "Deidranna's army has regained complete control over %s.",
    "You have lost a refueling site.",
  ];

  export let gzIntroScreen: string[] /* STR16[] */ = [
    "Cannot find intro video",
  ];

  // These strings are combined with a merc name, a volume string (from pNoiseVolStr),
  // and a direction (either "above", "below", or a string from pDirectionStr) to
  // report a noise.
  // e.g. "Sidney hears a loud sound of MOVEMENT coming from the SOUTH."
  export let pNewNoiseStr: string[] /* STR16[] */ = [
    "%s hears a %s sound coming from %s.",
    "%s hears a %s sound of MOVEMENT coming from %s.",
    "%s hears a %s CREAKING coming from %s.",
    "%s hears a %s SPLASHING coming from %s.",
    "%s hears a %s IMPACT coming from %s.",
    "%s hears a %s EXPLOSION to %s.",
    "%s hears a %s SCREAM to %s.",
    "%s hears a %s IMPACT to %s.",
    "%s hears a %s IMPACT to %s.",
    "%s hears a %s SHATTERING coming from %s.",
    "%s hears a %s SMASH coming from %s.",
  ];

  export let wMapScreenSortButtonHelpText: string[] /* STR16[] */ = [
    "Sort by Name (|F|1)",
    "Sort by Assignment (|F|2)",
    "Sort by Sleep Status (|F|3)",
    "Sort by Location (|F|4)",
    "Sort by Destination (|F|5)",
    "Sort by Departure Time (|F|6)",
  ];

  export let BrokenLinkText: string[] /* STR16[] */ = [
    "Error 404",
    "Site not found.",
  ];

  export let gzBobbyRShipmentText: string[] /* STR16[] */ = [
    "Recent Shipments",
    "Order #",
    "Number Of Items",
    "Ordered On",
  ];

  export let gzCreditNames: string[] /* STR16[] */ = [
    "Chris Camfield",
    "Shaun Lyng",
    "Kris Märnes",
    "Ian Currie",
    "Linda Currie",
    'Eric "WTF" Cheng',
    "Lynn Holowka",
    'Norman "NRG" Olsen',
    "George Brooks",
    "Andrew Stacey",
    "Scot Loving",
    'Andrew "Big Cheese" Emmons',
    'Dave "The Feral" French',
    "Alex Meduna",
    'Joey "Joeker" Whelan',
  ];

  export let gzCreditNameTitle: string[] /* STR16[] */ = [
    "Game Internals Programmer", // Chris Camfield
    "Co-designer/Writer", // Shaun Lyng
    "Strategic Systems & Editor Programmer", // Kris \"The Cow Rape Man\" Marnes
    "Producer/Co-designer", // Ian Currie
    "Co-designer/Map Designer", // Linda Currie
    "Artist", // Eric \"WTF\" Cheng
    "Beta Coordinator, Support", // Lynn Holowka
    "Artist Extraordinaire", // Norman \"NRG\" Olsen
    "Sound Guru", // George Brooks
    "Screen Designer/Artist", // Andrew Stacey
    "Lead Artist/Animator", // Scot Loving
    "Lead Programmer", // Andrew \"Big Cheese Doddle\" Emmons
    "Programmer", // Dave French
    "Strategic Systems & Game Balance Programmer", // Alex Meduna
    "Portraits Artist", // Joey \"Joeker\" Whelan",
  ];

  export let gzCreditNameFunny: string[] /* STR16[] */ = [
    "", // Chris Camfield
    "(still learning punctuation)", // Shaun Lyng
    "(\"It's done. I'm just fixing it\")", // Kris \"The Cow Rape Man\" Marnes
    "(getting much too old for this)", // Ian Currie
    "(and working on Wizardry 8)", // Linda Currie
    "(forced at gunpoint to also do QA)", // Eric \"WTF\" Cheng
    "(Left us for the CFSA - go figure...)", // Lynn Holowka
    "", // Norman \"NRG\" Olsen
    "", // George Brooks
    "(Dead Head and jazz lover)", // Andrew Stacey
    "(his real name is Robert)", // Scot Loving
    "(the only responsible person)", // Andrew \"Big Cheese Doddle\" Emmons
    "(can now get back to motocrossing)", // Dave French
    "(stolen from Wizardry 8)", // Alex Meduna
    "(did items and loading screens too!)", // Joey \"Joeker\" Whelan",
  ];

  export let sRepairsDoneString: string[] /* STR16[] */ = [
    "%s finished repairing own items",
    "%s finished repairing everyone's guns & armor",
    "%s finished repairing everyone's equipped items",
    "%s finished repairing everyone's carried items",
  ];

  export let zGioDifConfirmText: string[] /* STR16[] */ = [
    "You have chosen NOVICE mode. This setting is appropriate for those new to Jagged Alliance, those new to strategy games in general, or those wishing shorter battles in the game. Your choice will affect things throughout the entire course of the game, so choose wisely. Are you sure you want to play in Novice mode?",
    "You have chosen EXPERIENCED mode. This setting is suitable for those already familiar with Jagged Alliance or similar games. Your choice will affect things throughout the entire course of the game, so choose wisely. Are you sure you want to play in Experienced mode?",
    "You have chosen EXPERT mode. We warned you. Don't blame us if you get shipped back in a body bag. Your choice will affect things throughout the entire course of the game, so choose wisely. Are you sure you want to play in Expert mode?",
  ];

  export let gzLateLocalizedString: string[] /* STR16[] */ = [
    "%s loadscreen data file not found...",

    // 1-5
    "The robot cannot leave this sector when nobody is using the controller.",

    // This message comes up if you have pending bombs waiting to explode in tactical.
    "You can't compress time right now.  Wait for the fireworks!",

    //'Name' refuses to move.
    "%s refuses to move.",

    //%s a merc name
    "%s does not have enough energy to change stance.",

    // A message that pops up when a vehicle runs out of gas.
    "The %s has run out of gas and is now stranded in %s%d.",

    // 6-10

    // the following two strings are combined with the pNewNoise[] strings above to report noises
    // heard above or below the merc
    "above",
    "below",

    // The following strings are used in autoresolve for autobandaging related feedback.
    "None of your mercs have any medical ability.",
    "There are no medical supplies to perform bandaging.",
    "There weren't enough medical supplies to bandage everybody.",
    "None of your mercs need bandaging.",
    "Bandages mercs automatically.",
    "All your mercs are bandaged.",

    // 14
    "Arulco",

    "(roof)",

    "Health: %d/%d",

    // In autoresolve if there were 5 mercs fighting 8 enemies the text would be "5 vs. 8"
    //"vs." is the abbreviation of versus.
    "%d vs. %d",

    "The %s is full!", //(ex "The ice cream truck is full")

    "%s does not need immediate first aid or bandaging but rather more serious medical attention and/or rest.",

    // 20
    // Happens when you get shot in the legs, and you fall down.
    "%s is hit in the leg and collapses!",
    // Name can't speak right now.
    "%s can't speak right now.",

    // 22-24 plural versions
    "%d green militia have been promoted to veteran militia.",
    "%d green militia have been promoted to regular militia.",
    "%d regular militia have been promoted to veteran militia.",

    // 25
    "Switch",

    // 26
    // Name has gone psycho -- when the game forces the player into burstmode (certain unstable characters)
    "%s goes psycho!",

    // 27-28
    // Messages why a player can't time compress.
    "It is currently unsafe to compress time because you have mercs in sector %s.",
    "It is currently unsafe to compress time when mercs are in the creature infested mines.",

    // 29-31 singular versions
    "1 green militia has been promoted to a veteran militia.",
    "1 green militia has been promoted to a regular militia.",
    "1 regular militia has been promoted to a veteran militia.",

    // 32-34
    "%s doesn't say anything.",
    "Travel to surface?",
    "(Squad %d)",

    // 35
    // Ex: "Red has repaired Scope's MP5K".  Careful to maintain the proper order (Red before Scope, Scope before MP5K)
    "%s has repaired %s's %s",

    // 36
    "BLOODCAT",

    // 37-38 "Name trips and falls"
    "%s trips and falls",
    "This item can't be picked up from here.",

    // 39
    "None of your remaining mercs are able to fight.  The militia will fight the creatures on their own.",

    // 40-43
    //%s is the name of merc.
    "%s ran out of medical kits!",
    "%s lacks the necessary skill to doctor anyone!",
    "%s ran out of tool kits!",
    "%s lacks the necessary skill to repair anything!",

    // 44-45
    "Repair Time",
    "%s cannot see this person.",

    // 46-48
    "%s's gun barrel extender falls off!",
    "No more than %d militia trainers are permitted per sector.",
    "Are you sure?",

    // 49-50
    "Time Compression",
    "The vehicle's gas tank is now full.",

    // 51-52 Fast help text in mapscreen.
    "Continue Time Compression (|S|p|a|c|e)",
    "Stop Time Compression (|E|s|c)",

    // 53-54 "Magic has unjammed the Glock 18" or "Magic has unjammed Raven's H&K G11"
    "%s has unjammed the %s",
    "%s has unjammed %s's %s",

    // 55
    "Can't compress time while viewing sector inventory.",

    "The Jagged Alliance 2 PLAY DISK was not found. Program will now exit.",

    "Items successfully combined.",

    // 58
    // Displayed with the version information when cheats are enabled.
    "Current/Max Progress: %d%%/%d%%",

    "Escort John and Mary?",

    // 60
    "Switch Activated.",

    "%s's ceramic plates have been smashed!",
  ];
}
