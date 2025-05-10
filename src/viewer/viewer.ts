namespace ja2 {
  const fs: typeof import("fs") = require("fs");
  export function ViewerMain(divContainer: HTMLElement): number {
    const canvas = document.createElement("canvas");
    canvas.width = SCREEN_WIDTH + 100;
    canvas.height = SCREEN_HEIGHT + 100;
    divContainer.appendChild(canvas);
    const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
    /*
    // Set line width
    ctx.lineWidth = 10;

    // Wall
    ctx.strokeRect(75, 140, 150, 110);

    // Door
    ctx.fillRect(130, 190, 40, 60);

    // Roof
    ctx.beginPath();
    ctx.moveTo(50, 140);
    ctx.lineTo(150, 60);
    ctx.lineTo(250, 140);
    ctx.closePath();
    ctx.stroke();

     */

    //----

    const FILENAME_SIZE = 256;

    class SplitUINT32 {
      public usLower: number;
      public usHigher: number;

      constructor() {
        this.usLower = 0;
        this.usHigher = 0;
      }

      get uiValue() {
        return (this.usHigher << 16) | this.usLower;
      }

      set uiValue(value) {
        this.usLower = value & 0xffff;
        this.usHigher = value >> 16;
      }
    }
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

    function readUIntArray(
      arr: number[],
      buffer: Buffer,
      offset: number,
      byteLength: number,
    ): number {
      const arrayLength = arr.length;
      for (let i = 0; i < arrayLength; i++) {
        arr[i] = buffer.readUIntLE(offset, byteLength);
        offset += byteLength;
      }
      return offset;
    }

    const STCI_RGB = 0x0004;
    const STCI_INDEXED = 0x0008;

    function readSTCIHeader(o: any, buffer: Buffer): number {
      let offset: number = 0;
      o.cID = buffer.toString("ascii", offset, offset + 4);
      offset += 4;
      o.uiOriginalSize = buffer.readUInt32LE(offset);
      offset += 4;
      o.uiStoredSize = buffer.readUInt32LE(offset);
      offset += 4;
      o.uiTransparentValue = buffer.readUInt32LE(offset);
      offset += 4;
      o.fFlags = buffer.readUInt32LE(offset);
      offset += 4;
      o.usHeight = buffer.readUInt16LE(offset);
      offset += 2;
      o.usWidth = buffer.readUInt16LE(offset);
      offset += 2;

      if (o.fFlags & STCI_RGB) {
        o.RGB.uiRedMask = buffer.readUInt32LE(offset);
        offset += 4;
        o.RGB.uiGreenMask = buffer.readUInt32LE(offset);
        offset += 4;
        o.RGB.uiBlueMask = buffer.readUInt32LE(offset);
        offset += 4;
        o.RGB.uiAlphaMask = buffer.readUInt32LE(offset);
        offset += 4;
        o.RGB.ubRedDepth = buffer.readUInt8(offset++);
        o.RGB.ubGreenDepth = buffer.readUInt8(offset++);
        o.RGB.ubBlueDepth = buffer.readUInt8(offset++);
        o.RGB.ubAlphaDepth = buffer.readUInt8(offset++);
      } else if (o.fFlags & STCI_INDEXED) {
        o.Indexed.uiNumberOfColours = buffer.readUInt32LE(offset);
        offset += 4;
        o.Indexed.usNumberOfSubImages = buffer.readUInt16LE(offset);
        offset += 2;
        o.Indexed.ubRedDepth = buffer.readUInt8(offset++);
        o.Indexed.ubGreenDepth = buffer.readUInt8(offset++);
        o.Indexed.ubBlueDepth = buffer.readUInt8(offset++);
        offset = readUIntArray(o.Indexed.cIndexedUnused, buffer, offset, 1);
      }

      o.ubDepth = buffer.readUInt8(offset++);
      offset += 3; // padding
      o.uiAppDataSize = buffer.readUInt32LE(offset);
      offset += 4;

      return offset;
    }

    const fd = fs.openSync("/Users/mark/ja2/Data/Loadscreens.slf", "r");

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

    // console.log("fileHeader = ", JSON.stringify(fileHeader, null, 2));

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

    /*for (const entry of entries) {
      console.log("entry = ", entry.sFileName);
    }*/

    const jaLogo = entries.find((e) => e.sFileName === "SPLASH.STI");

    if (jaLogo == null) {
      console.log("jaLogo is null");
      process.exit(1);
    }

    console.log(jaLogo);

    const stciHeader = {
      cID: "",
      uiOriginalSize: 0,
      uiStoredSize: 0,
      uiTransparentValue: 0,
      fFlags: 0,
      usHeight: 0,
      usWidth: 0,
      RGB: {
        uiRedMask: 0,
        uiGreenMask: 0,
        uiBlueMask: 0,
        uiAlphaMask: 0,
        ubRedDepth: 0,
        ubGreenDepth: 0,
        ubBlueDepth: 0,
        ubAlphaDepth: 0,
      },
      Indexed: {
        uiNumberOfColours: 0,
        usNumberOfSubImages: 0,
        ubRedDepth: 0,
        ubGreenDepth: 0,
        ubBlueDepth: 0,
        cIndexedUnused: Array(11).fill(0),
      },
      ubDepth: 0,
      uiAppDataSize: 0,
      cUnused: Array(15).fill(0),
    };

    const STCI_HEADER_SIZE = 64;

    buffer = Buffer.allocUnsafe(STCI_HEADER_SIZE);

    fs.readSync(fd, buffer, 0, STCI_HEADER_SIZE, jaLogo.uiOffset);

    const headerOffset = readSTCIHeader(stciHeader, buffer);

    console.log(stciHeader);

    // Create memory for image structure
    const hImage = {
      usWidth: 0,
      usHeight: 0,
      ubBitDepth: 0,
      fFlags: 0,
      //ImageFile,
      //iFileLoader,
      pPalette: <any[]>(<unknown>null),
      pui16BPPPalette: <Uint16Array>(<unknown>null),
      pAppData: <Buffer>(<unknown>null),
      uiAppDataSize: 0,
      pImageData: <Buffer>(<unknown>null),
      pCompressedImageData: <Buffer>(<unknown>null),
      p8BPPData: <Uint8Array>(<unknown>null),
      p16BPPData: <Uint16Array>(<unknown>null),
      pPixData8: <Uint8Array>(<unknown>null),
      uiSizePixData: 0,
      pETRLEObject: <any[]>(<unknown>null),
      usNumberOfObjects: 0,
    };

    const imageBitmapBuffer = Buffer.allocUnsafe(stciHeader.uiStoredSize);

    console.log("stciHeader.uiStoredSize = ", stciHeader.uiStoredSize);

    fs.readSync(
      fd,
      imageBitmapBuffer,
      0,
      stciHeader.uiStoredSize,
      jaLogo.uiOffset,
    );

    hImage.pImageData = imageBitmapBuffer;
    hImage.pCompressedImageData = imageBitmapBuffer;
    hImage.p8BPPData = imageBitmapBuffer;
    hImage.p16BPPData = new Uint16Array(
      imageBitmapBuffer.buffer,
      imageBitmapBuffer.byteOffset,
      imageBitmapBuffer.byteLength / 2,
    );
    hImage.pPixData8 = imageBitmapBuffer;

    console.log("buffer.byteOffset = ", imageBitmapBuffer.byteOffset);
    console.log("buffer.byteLength/2 = ", imageBitmapBuffer.byteLength / 2);

    const IMAGE_BITMAPDATA = 0x0008;

    hImage.fFlags |= IMAGE_BITMAPDATA;

    const gusRedMask = 0x7c00;
    const gusGreenMask = 0x03e0;
    const gusBlueMask = 0x1f;

    if (stciHeader.ubDepth == 16) {
      // ASSUMPTION: file data is 565 R,G,B

      if (
        gusRedMask != stciHeader.RGB.uiRedMask ||
        gusGreenMask != stciHeader.RGB.uiGreenMask ||
        gusBlueMask != stciHeader.RGB.uiBlueMask
      ) {
        // hardware is 555
        ConvertRGBDistribution565To555(
          hImage.p16BPPData,
          stciHeader.usWidth * stciHeader.usHeight,
        );
      }
    } else {
      console.log("image is not 16-bit depth");
      process.exit(1);
    }

    function ConvertRGBDistribution565To555(
      p16BPPData: Uint16Array,
      uiNumberOfPixels: number,
    ): void {
      let Pixel = new SplitUINT32();

      console.log("uiNumberOfPixels = ", uiNumberOfPixels);

      let logPixel = true;

      for (let uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
        let pPixel = p16BPPData[uiLoop];

        // If the pixel is completely black, don't bother converting it -- DB
        if (pPixel != 0) {
          if (logPixel) {
            console.log("pPixel = ", pPixel);
            console.log("pPixel in binary =   ", pPixel.toString(2));
          }
          // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
          // right shift the blue value (at the bottom) into the LOWER word to protect it
          Pixel.usHigher = pPixel;
          Pixel.uiValue >>= 5;

          if (logPixel) {
            console.log("pPixel.usHigher = ", Pixel.usHigher.toString(2));
            console.log("pPixel.usLower =   ", Pixel.usLower.toString(2));
          }

          // get rid of the least significant bit of green
          Pixel.usHigher >>= 1;
          // now shift back into the upper word
          Pixel.uiValue <<= 5;
          // and copy back
          p16BPPData[uiLoop] = Pixel.usHigher | 0;
          if (logPixel) {
            console.log(
              "p16BPPData[uiLoop] = ",
              p16BPPData[uiLoop].toString(2),
            );
          }
        }

        logPixel = false;
      }
    }

    //---
    /*
    for (let x = 0; x < 100; x++) {
      console.log("hImage.p16BPPData = ", hImage.p16BPPData[x]);
    }
*/
    const imageData = ctx.createImageData(
      stciHeader.usWidth,
      stciHeader.usHeight,
    );

    // Iterate through every pixel
    let x = 0;
    for (let i = 0; i < hImage.p16BPPData.length; i++) {
      // Modify pixel data
      const pixel = hImage.p16BPPData[i];
      /*
      imageData.data[x++] = (pixel >>> 10) & 0x1f; // R value
      imageData.data[x++] = (pixel >>> 5) & 0x1f; // G value
      imageData.data[x++] = pixel & 0x1f; // B value
      imageData.data[x++] = 255; // A value

       */
      imageData.data[x++] = (pixel & 0x7c00) >>> 10; // R value
      imageData.data[x++] = (pixel & 0x03e0) >>> 5; // G value
      imageData.data[x++] = pixel & 0x1f; // B value
      imageData.data[x++] = 255; // A value
    }

    // Draw image data to the canvas
    ctx.putImageData(imageData, 20, 20);
    return 0;
  }
}
