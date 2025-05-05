namespace ja2 {
  // enums for the various arms dealers
  export const enum Enum197 {
    ARMS_DEALER_TONY,
    ARMS_DEALER_FRANZ,
    ARMS_DEALER_KEITH,
    ARMS_DEALER_JAKE,
    ARMS_DEALER_GABBY,

    ARMS_DEALER_DEVIN,
    ARMS_DEALER_HOWARD,
    ARMS_DEALER_SAM,
    ARMS_DEALER_FRANK,

    ARMS_DEALER_BAR_BRO_1,
    ARMS_DEALER_BAR_BRO_2,
    ARMS_DEALER_BAR_BRO_3,
    ARMS_DEALER_BAR_BRO_4,

    ARMS_DEALER_MICKY,

    ARMS_DEALER_ARNIE,
    ARMS_DEALER_FREDO,
    ARMS_DEALER_PERKO,

    // added only in GameVersion 54
    ARMS_DEALER_ELGIN,

    // added only in GameVersion 55
    ARMS_DEALER_MANNY,

    NUM_ARMS_DEALERS,
  }

  // the enums for the different kinds of arms dealers
  export const enum Enum198 {
    ARMS_DEALER_BUYS_SELLS,
    ARMS_DEALER_SELLS_ONLY,
    ARMS_DEALER_BUYS_ONLY,
    ARMS_DEALER_REPAIRS,
  }

  // The following defines indicate what items can be sold by the arms dealer
  export const ARMS_DEALER_HANDGUNCLASS = 0x00000001;
  export const ARMS_DEALER_SMGCLASS = 0x00000002;
  export const ARMS_DEALER_RIFLECLASS = 0x00000004;
  export const ARMS_DEALER_MGCLASS = 0x00000008;
  export const ARMS_DEALER_SHOTGUNCLASS = 0x00000010;

  export const ARMS_DEALER_KNIFECLASS = 0x00000020;

  export const ARMS_DEALER_BLADE = 0x00000040;
  export const ARMS_DEALER_LAUNCHER = 0x00000080;

  export const ARMS_DEALER_ARMOUR = 0x00000100;
  export const ARMS_DEALER_MEDKIT = 0x00000200;
  export const ARMS_DEALER_MISC = 0x00000400;
  export const ARMS_DEALER_AMMO = 0x00000800;

  export const ARMS_DEALER_GRENADE = 0x00001000;
  export const ARMS_DEALER_BOMB = 0x00002000;
  export const ARMS_DEALER_EXPLOSV = 0x00004000;

  export const ARMS_DEALER_KIT = 0x00008000;

  export const ARMS_DEALER_FACE = 0x00010000;
  //#define		ARMS_DEALER_THROWN						0x00020000
  //#define		ARMS_DEALER_KEY								0x00040000

  //#define		ARMS_DEALER_VIDEO_CAMERA			0x00020000

  export const ARMS_DEALER_DETONATORS = 0x00040000;

  export const ARMS_DEALER_ATTACHMENTS = 0x00080000;

  export const ARMS_DEALER_ALCOHOL = 0x00100000;
  export const ARMS_DEALER_ELECTRONICS = 0x00200000;
  export const ARMS_DEALER_HARDWARE = 0x00400000 | ARMS_DEALER_KIT;

  export const ARMS_DEALER_MEDICAL = 0x00800000 | ARMS_DEALER_MEDKIT;

  //#define		ARMS_DEALER_EMPTY_JAR					0x01000000
  const ARMS_DEALER_CREATURE_PARTS = 0x02000000;
  export const ARMS_DEALER_ROCKET_RIFLE = 0x04000000;

  export const ARMS_DEALER_ONLY_USED_ITEMS = 0x08000000;
  export const ARMS_DEALER_GIVES_CHANGE = 0x10000000; // The arms dealer will give the required change when doing a transaction
  export const ARMS_DEALER_ACCEPTS_GIFTS = 0x20000000; // The arms dealer is the kind of person who will accept gifts
  export const ARMS_DEALER_SOME_USED_ITEMS = 0x40000000; // The arms dealer can have used items in his inventory
  export const ARMS_DEALER_HAS_NO_INVENTORY = 0x80000000; // The arms dealer does not carry any inventory

  const ARMS_DEALER_ALL_GUNS =
    ARMS_DEALER_HANDGUNCLASS |
    ARMS_DEALER_SMGCLASS |
    ARMS_DEALER_RIFLECLASS |
    ARMS_DEALER_MGCLASS |
    ARMS_DEALER_SHOTGUNCLASS;

  export const ARMS_DEALER_BIG_GUNS =
    ARMS_DEALER_SMGCLASS |
    ARMS_DEALER_RIFLECLASS |
    ARMS_DEALER_MGCLASS |
    ARMS_DEALER_SHOTGUNCLASS;

  const ARMS_DEALER_ALL_WEAPONS =
    ARMS_DEALER_ALL_GUNS |
    ARMS_DEALER_BLADE |
    ARMS_DEALER_LAUNCHER |
    ARMS_DEALER_KNIFECLASS;

  //
  // Specific Dealer Flags
  // NOTE: Each dealer has 8 flags, but different dealers can and SHOULD share the same flag #s!
  //

  // Alex Fredo
  export const ARMS_DEALER_FLAG__FREDO_HAS_SAID_ROCKET_RIFLE_QUOTE = 0x00000001; // Alex Fredo has already repaired the Rocket Rifle
  // Franz Hinkle
  export const ARMS_DEALER_FLAG__FRANZ_HAS_SOLD_VIDEO_CAMERA_TO_PLAYER = 0x00000001; // Franz Hinkle has sold the video camera to the player

  // THIS STRUCTURE HAS UNCHANGING INFO THAT DOESN'T GET SAVED/RESTORED/RESET
  export interface ARMS_DEALER_INFO {
    /* union { */
    /*   struct { */
    dBuyModifier: FLOAT; // The price modifier used when this dealer is BUYING something.
    dSellModifier: FLOAT; // The price modifier used when this dealer is SELLING something.
    /*   } */
    /*   struct { */
    dRepairSpeed: FLOAT; // Modifier to the speed at which a repairman repairs things
    dRepairCost: FLOAT; // Modifier to the price a repairman charges for repairs
    /*   } */
    /* } */
    ubShopKeeperID: UINT8; // Merc Id for the dealer
    ubTypeOfArmsDealer: UINT8; // Whether he buys/sells, sells, buys, or repairs
    iInitialCash: INT32; // How much cash dealer starts with (we now reset to this amount once / day)
    uiFlags: UINT32; // various flags which control the dealer's operations
  }

  export function createArmsDealerInfoFrom(
    dBuyModifier_dRepairSpeed: FLOAT,
    dSellModifier_dRepairCost: FLOAT,
    ubShopKeeperID: UINT8,
    ubTypeOfArmsDealer: UINT8,
    iInitialCash: INT32,
    uiFlags: UINT32,
  ) {
    return {
      dBuyModifier: dBuyModifier_dRepairSpeed,
      dSellModifier: dSellModifier_dRepairCost,
      dRepairSpeed: dBuyModifier_dRepairSpeed,
      dRepairCost: dSellModifier_dRepairCost,
      ubShopKeeperID,
      ubTypeOfArmsDealer,
      iInitialCash,
      uiFlags,
    };
  }

  // THIS STRUCTURE GETS SAVED/RESTORED/RESET
  export interface ARMS_DEALER_STATUS {
    uiArmsDealersCash: UINT32; // How much money the arms dealer currently has

    ubSpecificDealerFlags: UINT8; // Misc state flags for specific dealers
    fOutOfBusiness: boolean; // Set when a dealer has been killed, etc.
    fRepairDelayBeenUsed: boolean; // Set when a repairman has missed his repair time estimate & given his excuse for it
    fUnusedKnowsPlayer: boolean; // Set if the shopkeeper has met with the player before [UNUSED]

    uiTimePlayerLastInSKI: UINT32; // game time (in total world minutes) when player last talked to this dealer in SKI

    ubPadding: UINT8[] /* [8] */;
  }

  export function createArmsDealerStatus(): ARMS_DEALER_STATUS {
    return {
      uiArmsDealersCash: 0,
      ubSpecificDealerFlags: 0,
      fOutOfBusiness: false,
      fRepairDelayBeenUsed: false,
      fUnusedKnowsPlayer: false,
      uiTimePlayerLastInSKI: 0,
      ubPadding: createArray(8, 0),
    };
  }

  export function resetArmsDealerStatus(o: ARMS_DEALER_STATUS) {
    o.uiArmsDealersCash = 0;
    o.ubSpecificDealerFlags = 0;
    o.fOutOfBusiness = false;
    o.fRepairDelayBeenUsed = false;
    o.fUnusedKnowsPlayer = false;
    o.uiTimePlayerLastInSKI = 0;
    o.ubPadding.fill(0);
  }

  export const ARMS_DEALER_STATUS_SIZE = 20;

  export function readArmsDealerStatus(
    o: ARMS_DEALER_STATUS,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    o.uiArmsDealersCash = buffer.readUInt32LE(offset);
    offset += 4;
    o.ubSpecificDealerFlags = buffer.readUInt8(offset++);
    o.fOutOfBusiness = Boolean(buffer.readUInt8(offset++));
    o.fRepairDelayBeenUsed = Boolean(buffer.readUInt8(offset++));
    o.fUnusedKnowsPlayer = Boolean(buffer.readUInt8(offset++));
    o.uiTimePlayerLastInSKI = buffer.readUInt32LE(offset);
    offset += 4;
    offset = readUIntArray(o.ubPadding, buffer, offset, 1);
    return offset;
  }

  export function writeArmsDealerStatus(
    o: ARMS_DEALER_STATUS,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    offset = buffer.writeUInt32LE(o.uiArmsDealersCash, offset);
    offset = buffer.writeUInt8(o.ubSpecificDealerFlags, offset);
    offset = buffer.writeUInt8(Number(o.fOutOfBusiness), offset);
    offset = buffer.writeUInt8(Number(o.fRepairDelayBeenUsed), offset);
    offset = buffer.writeUInt8(Number(o.fUnusedKnowsPlayer), offset);
    offset = buffer.writeUInt32LE(o.uiTimePlayerLastInSKI, offset);
    offset = writeUIntArray(o.ubPadding, buffer, offset, 1);
    return offset;
  }

  export interface SPECIAL_ITEM_INFO {
    usAttachment: UINT16[] /* [MAX_ATTACHMENTS] */; // item index of any attachments on the item

    bItemCondition: INT8; // if 0, no item is stored
    // from 1 to 100 indicates an item with that status
    // -1 to -100 means the item is in for repairs, flip sign for the actual status
    ubImprintID: UINT8; // imprint ID for imprinted items (during repair!)

    bAttachmentStatus: INT8[] /* [MAX_ATTACHMENTS] */; // status of any attachments on the item

    ubPadding: UINT8[] /* [2] */; // filler
  }

  export function createSpecialItemInfo(): SPECIAL_ITEM_INFO {
    return {
      usAttachment: createArray(MAX_ATTACHMENTS, 0),
      bItemCondition: 0,
      ubImprintID: 0,
      bAttachmentStatus: createArray(MAX_ATTACHMENTS, 0),
      ubPadding: createArray(2, 0),
    };
  }

  export function resetSpecialItemInfo(o: SPECIAL_ITEM_INFO) {
    o.usAttachment.fill(0);
    o.bItemCondition = 0;
    o.ubImprintID = 0;
    o.bAttachmentStatus.fill(0);
    o.ubPadding.fill(0);
  }

  export function copySpecialItemInfo(
    destination: SPECIAL_ITEM_INFO,
    source: SPECIAL_ITEM_INFO,
  ) {
    copyArray(destination.usAttachment, source.usAttachment);
    destination.bItemCondition = source.bItemCondition;
    destination.ubImprintID = source.ubImprintID;
    copyArray(destination.bAttachmentStatus, source.bAttachmentStatus);
    copyArray(destination.ubPadding, source.ubPadding);
  }

  export const SPECIAL_ITEM_INFO_SIZE = 16;

  export function readSpecialItemInfo(
    o: SPECIAL_ITEM_INFO,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    offset = readUIntArray(o.usAttachment, buffer, offset, 2);
    o.bItemCondition = buffer.readInt8(offset++);
    o.ubImprintID = buffer.readUInt8(offset++);
    offset = readIntArray(o.bAttachmentStatus, buffer, offset, 1);
    offset = readUIntArray(o.ubPadding, buffer, offset, 1);
    return offset;
  }

  export function writeSpecialItemInfo(
    o: SPECIAL_ITEM_INFO,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    offset = writeUIntArray(o.usAttachment, buffer, offset, 2);
    offset = buffer.writeInt8(o.bItemCondition, offset);
    offset = buffer.writeUInt8(o.ubImprintID, offset);
    offset = writeIntArray(o.bAttachmentStatus, buffer, offset, 1);
    offset = writeUIntArray(o.ubPadding, buffer, offset, 1);
    return offset;
  }

  export interface DEALER_SPECIAL_ITEM {
    Info: SPECIAL_ITEM_INFO;

    uiRepairDoneTime: UINT32; // If the item is in for repairs, this holds the time when it will be repaired (in min)

    fActive: boolean; // TRUE means an item is stored here (empty elements may not always be freed immediately)

    ubOwnerProfileId: UINT8; // stores which merc previously owned an item being repaired

    ubPadding: UINT8[] /* [6] */; // filler
  }

  export function createDealerSpecialItem(): DEALER_SPECIAL_ITEM {
    return {
      Info: createSpecialItemInfo(),
      uiRepairDoneTime: 0,
      fActive: false,
      ubOwnerProfileId: 0,
      ubPadding: createArray(6, 0),
    };
  }

  export function resetDealerSpecialItem(o: DEALER_SPECIAL_ITEM) {
    resetSpecialItemInfo(o.Info);
    o.uiRepairDoneTime = 0;
    o.fActive = false;
    o.ubOwnerProfileId = 0;
    o.ubPadding.fill(0);
  }

  export const DEALER_SPECIAL_ITEM_SIZE = 28;

  export function readDealerSpecialItem(
    o: DEALER_SPECIAL_ITEM,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    offset = readSpecialItemInfo(o.Info, buffer, offset);
    o.uiRepairDoneTime = buffer.readUInt32LE(offset);
    offset += 4;
    o.fActive = Boolean(buffer.readUInt8(offset++));
    o.ubOwnerProfileId = buffer.readUInt8(offset++);
    offset = readUIntArray(o.ubPadding, buffer, offset, 1);
    return offset;
  }

  export function writeDealerSpecialItem(
    o: DEALER_SPECIAL_ITEM,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    offset = writeSpecialItemInfo(o.Info, buffer, offset);
    offset = buffer.writeUInt32LE(o.uiRepairDoneTime, offset);
    offset = buffer.writeUInt8(Number(o.fActive), offset);
    offset = buffer.writeUInt8(o.ubOwnerProfileId, offset);
    offset = writeUIntArray(o.ubPadding, buffer, offset, 1);
    return offset;
  }

  export interface DEALER_ITEM_HEADER {
    ubTotalItems: UINT8; // sum of all the items (all perfect ones + all special ones)
    ubPerfectItems: UINT8; // non-special (perfect) items held by dealer
    ubStrayAmmo: UINT8; // partially-depleted ammo mags are stored here as #bullets, and can be converted to full packs

    ubElementsAlloced: UINT8; // number of DEALER_SPECIAL_ITEM array elements alloced for the special item array
    SpecialItem: DEALER_SPECIAL_ITEM[] /* Pointer<DEALER_SPECIAL_ITEM> */; // dynamic array of special items with this same item index

    uiOrderArrivalTime: UINT32; // Day the items ordered will arrive on.  It's UINT32 in case we change this to minutes.
    ubQtyOnOrder: UINT8; // The number of items currently on order
    fPreviouslyEligible: boolean; // whether or not dealer has been eligible to sell this item in days prior to today

    ubPadding: UINT8[] /* [2] */; // filler
  }

  export function createDealerItemHeader(): DEALER_ITEM_HEADER {
    return {
      ubTotalItems: 0,
      ubPerfectItems: 0,
      ubStrayAmmo: 0,
      ubElementsAlloced: 0,
      SpecialItem: <DEALER_SPECIAL_ITEM[]>(<unknown>null),
      uiOrderArrivalTime: 0,
      ubQtyOnOrder: 0,
      fPreviouslyEligible: false,
      ubPadding: createArray(2, 0),
    };
  }

  export function resetDealerItemHeader(o: DEALER_ITEM_HEADER) {
    o.ubTotalItems = 0;
    o.ubPerfectItems = 0;
    o.ubStrayAmmo = 0;
    o.ubElementsAlloced = 0;
    o.SpecialItem = <DEALER_SPECIAL_ITEM[]>(<unknown>null);
    o.uiOrderArrivalTime = 0;
    o.ubQtyOnOrder = 0;
    o.fPreviouslyEligible = false;
    o.ubPadding.fill(0);
  }

  export const DEALER_ITEM_HEADER_SIZE = 16;

  export function readDealerItemHeader(
    o: DEALER_ITEM_HEADER,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    o.ubTotalItems = buffer.readUInt8(offset++);
    o.ubPerfectItems = buffer.readUInt8(offset++);
    o.ubStrayAmmo = buffer.readUInt8(offset++);
    o.ubElementsAlloced = buffer.readUInt8(offset++);
    o.SpecialItem = <DEALER_SPECIAL_ITEM[]>(<unknown>null);
    offset += 4; // pointer
    o.uiOrderArrivalTime = buffer.readUInt32LE(offset);
    offset += 4;
    o.ubQtyOnOrder = buffer.readUInt8(offset++);
    o.fPreviouslyEligible = Boolean(buffer.readUInt8(offset++));
    offset = readUIntArray(o.ubPadding, buffer, offset, 1);
    return offset;
  }

  export function writeDealerItemHeader(
    o: DEALER_ITEM_HEADER,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    offset = buffer.writeUInt8(o.ubTotalItems, offset);
    offset = buffer.writeUInt8(o.ubPerfectItems, offset);
    offset = buffer.writeUInt8(o.ubStrayAmmo, offset);
    offset = buffer.writeUInt8(o.ubElementsAlloced, offset);
    offset = writePadding(buffer, offset, 4); // o.SpecialItem (pointer)
    offset = buffer.writeUInt32LE(o.uiOrderArrivalTime, offset);
    offset = buffer.writeUInt8(o.ubQtyOnOrder, offset);
    offset = buffer.writeUInt8(Number(o.fPreviouslyEligible), offset);
    offset = writeUIntArray(o.ubPadding, buffer, offset, 1);
    return offset;
  }
}
