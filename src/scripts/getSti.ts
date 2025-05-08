import fs from "fs";

const FILENAME_SIZE = 256;

function readStringNL(
  buffer: Buffer,
  encoding: "ascii" | "utf16le",
  start: number,
  end: number,
): string {
  const s = buffer.toString(encoding, start, end);
  const pos = s.indexOf("\0");
  return pos !== -1 ? s.substring(0, pos) : s;
}

const fd = fs.openSync("/Users/mark/ja2/Data/Data.slf", "r");

let buffer = Buffer.allocUnsafe(532);

fs.readSync(fd, buffer, 0, 532, 0);

let fileHeader = {
  sLibName: "",
  sPathToLibrary: "",
  iEntries: 0,
  iUsed: 0,
  iSort: 0,
  iVersion: 0,
  fContainsSubDirectories: false,
  iReserved: 0,
};

let offset = 0;

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

console.log("fileHeader = ", JSON.stringify(fileHeader, null, 2));

const { size } = fs.fstatSync(fd);

const DIRENTRY_SIZE = 280;

let fileHeadersOffset = size - fileHeader.iEntries * DIRENTRY_SIZE;

// loop through all the entries
const entries = [];
buffer = Buffer.allocUnsafe(DIRENTRY_SIZE);
for (let uiLoop = 0; uiLoop < fileHeader.iEntries; uiLoop++) {
  // read in the file header
  fs.readSync(fd, buffer, 0, DIRENTRY_SIZE, fileHeadersOffset);

  const entry = {
    sFileName: "",
    uiOffset: 0,
    uiLength: 0,
    ubState: 0,
    ubReserved: 0,
    sFileTime: {
      dwLowDateTime: 0,
      dwHighDateTime: 0,
    },
    usReserved2: 0,
  };

  {
    let offset = 0;
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
  }

  // console.log("entry = ", JSON.stringify(entry, null, 2));

  entries.push(entry);
  fileHeadersOffset = fileHeadersOffset + DIRENTRY_SIZE;
}

for (const entry of entries) {
  console.log("entry = ", entry.sFileName);
}
