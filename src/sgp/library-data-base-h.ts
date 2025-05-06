namespace ja2 {
  export const FILENAME_SIZE = 256;

  export const NUM_FILES_TO_ADD_AT_A_TIME = 20;
  export const INITIAL_NUM_HANDLES = 20;

  export const REAL_FILE_LIBRARY_ID = 1022;

  const DB_BITS_FOR_FILE_ID = 22;

  export const DB_EXTRACT_LIBRARY = (exp: number) =>
    exp >>> DB_BITS_FOR_FILE_ID;
  export const DB_EXTRACT_FILE_ID = (exp: number) => exp & 0x3fffff;

  export const DB_ADD_LIBRARY_ID = (exp: number) => exp << DB_BITS_FOR_FILE_ID;

  export interface LibraryInitHeader {
    sLibraryName: string /* CHAR8[FILENAME_SIZE] */; // The name of the library file on the disk
    fOnCDrom: boolean; // A flag specifying if its a cdrom library ( not implemented yet )
    fInitOnStart: boolean; // Flag specifying if the library is to Initialized at the begining of the game
  }

  export function createLibraryInitHeaderFrom(
    sLibraryName: string,
    fOnCDrom: boolean,
    fInitOnStart: boolean,
  ): LibraryInitHeader {
    return {
      sLibraryName,
      fOnCDrom,
      fInitOnStart,
    };
  }

  export interface RealFileOpenStruct {
    uiFileID: UINT32; // id of the file ( they start at 1 )
    hRealFileHandle: HANDLE; // if the file is a Real File, this its handle
  }

  export function createRealFileOpenStruct(): RealFileOpenStruct {
    return {
      uiFileID: 0,
      hRealFileHandle: 0,
    };
  }

  export interface FileHeaderStruct {
    pFileName: string /* STR */;
    uiFileLength: UINT32;
    uiFileOffset: UINT32;
  }

  export function createFileHeaderStruct(): FileHeaderStruct {
    return {
      pFileName: "",
      uiFileLength: 0,
      uiFileOffset: 0,
    };
  }

  export interface FileOpenStruct {
    uiFileID: UINT32; // id of the file ( they start at 1 )
    uiFilePosInFile: UINT32; // current position in the file
    uiActualPositionInLibrary: UINT32; // Current File pointer position in actuall library
    pFileHeader: FileHeaderStruct /* Pointer<FileHeaderStruct> */;
  }

  export function createFileOpenStruct(): FileOpenStruct {
    return {
      uiFileID: 0,
      uiFilePosInFile: 0,
      uiActualPositionInLibrary: 0,
      pFileHeader: <FileHeaderStruct>(<unknown>null),
    };
  }

  export interface LibraryHeaderStruct {
    sLibraryPath: string;
    hLibraryHandle: HANDLE;
    usNumberOfEntries: UINT16;
    fLibraryOpen: boolean;
    uiIdOfOtherFileAlreadyOpenedLibrary: UINT32; // this variable is set when a file is opened from the library and reset when the file is close.  No 2 files can have access to the library at 1 time.
    iNumFilesOpen: INT32;
    iSizeOfOpenFileArray: INT32;
    pFileHeader: FileHeaderStruct[] /* Pointer<FileHeaderStruct> */;
    pOpenFiles: FileOpenStruct[] /* Pointer<FileOpenStruct> */;
  }

  export function createLibraryHeaderStruct(): LibraryHeaderStruct {
    return {
      sLibraryPath: "",
      hLibraryHandle: 0,
      usNumberOfEntries: 0,
      fLibraryOpen: false,
      uiIdOfOtherFileAlreadyOpenedLibrary: 0,
      iNumFilesOpen: 0,
      iSizeOfOpenFileArray: 0,
      pFileHeader: <FileHeaderStruct[]>(<unknown>null),
      pOpenFiles: <FileOpenStruct[]>(<unknown>null),
    };
  }

  export interface RealFileHeaderStruct {
    iNumFilesOpen: INT32;
    iSizeOfOpenFileArray: INT32;
    pRealFilesOpen: RealFileOpenStruct[] /* Pointer<RealFileOpenStruct> */;
  }

  export interface DatabaseManagerHeaderStruct {
    sManagerName: string /* STR */;
    pLibraries: LibraryHeaderStruct[] /* Pointer<LibraryHeaderStruct> */;
    usNumberOfLibraries: UINT16;
    fInitialized: boolean;
    RealFiles: RealFileHeaderStruct;
  }

  //*************************************************************************
  //
  //  NOTE!  The following structs are also used by the datalib98 utility
  //
  //*************************************************************************

  export const FILE_OK = 0;

  export interface LIBHEADER {
    sLibName: string /* CHAR8[FILENAME_SIZE] */;
    sPathToLibrary: string /* CHAR8[FILENAME_SIZE] */;
    iEntries: INT32;
    iUsed: INT32;
    iSort: UINT16;
    iVersion: UINT16;
    fContainsSubDirectories: boolean;
    iReserved: INT32;
  }

  export function createLibHeader(): LIBHEADER {
    return {
      sLibName: "",
      sPathToLibrary: "",
      iEntries: 0,
      iUsed: 0,
      iSort: 0,
      iVersion: 0,
      fContainsSubDirectories: false,
      iReserved: 0,
    };
  }

  export const LIBHEADER_SIZE = 532;

  export function readLibHeader(
    fileHeader: LIBHEADER,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    fileHeader.sLibName = readStringNL(
      buffer,
      "ascii",
      offset,
      offset + FILENAME_SIZE,
    );
    offset += FILENAME_SIZE;
    fileHeader.sPathToLibrary = readStringNL(
      buffer,
      "ascii",
      offset,
      offset + FILENAME_SIZE,
    );
    offset += FILENAME_SIZE;
    fileHeader.iEntries = buffer.readInt32LE(offset);
    offset += 4;
    fileHeader.iUsed = buffer.readInt32LE(offset);
    offset += 4;
    fileHeader.iSort = buffer.readUInt16LE(offset);
    offset += 2;
    fileHeader.iVersion = buffer.readUInt16LE(offset);
    offset += 2;
    fileHeader.fContainsSubDirectories = Boolean(buffer.readUInt8(offset++));
    offset += 3; // padding
    fileHeader.iReserved = buffer.readInt32LE(offset);
    offset += 4;

    return offset;
  }

  export interface DIRENTRY {
    sFileName: string /* CHAR8[FILENAME_SIZE] */;
    uiOffset: UINT32;
    uiLength: UINT32;
    ubState: UINT8;
    ubReserved: UINT8;
    sFileTime: FILETIME;
    usReserved2: UINT16;
  }

  export function createDirEntry(): DIRENTRY {
    return {
      sFileName: "",
      uiOffset: 0,
      uiLength: 0,
      ubState: 0,
      ubReserved: 0,
      sFileTime: createFileTime(),
      usReserved2: 0,
    };
  }

  export const DIRENTRY_SIZE = 280;

  export function readDirEntry(
    entry: DIRENTRY,
    buffer: Buffer,
    offset: number = 0,
  ): number {
    entry.sFileName = readStringNL(
      buffer,
      "ascii",
      offset,
      offset + FILENAME_SIZE,
    );
    offset += FILENAME_SIZE;
    entry.uiOffset = buffer.readUInt32LE(offset);
    offset += 4;
    entry.uiLength = buffer.readUInt32LE(offset);
    offset += 4;
    entry.ubState = buffer.readUInt8(offset++);
    entry.ubReserved = buffer.readUInt8(offset++);
    offset += 2; // padding
    entry.sFileTime.dwLowDateTime = buffer.readUInt32LE(offset);
    offset += 4;
    entry.sFileTime.dwHighDateTime = buffer.readUInt32LE(offset);
    offset += 4;
    entry.usReserved2 = buffer.readUInt16LE(offset);
    offset += 2;
    offset += 2; // padding

    return offset;
  }

  // Function Prototypes
}
