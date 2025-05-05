namespace ja2 {
  let gbTmpDebugString: string[] = createArray(8, "");
  let gubStringIndex: UINT8 = 0;

  // This is NOT a _DEBUG only function! It is also needed in
  // release mode builds. -- DB
  export function FormatString(string: string, ...args: any[]): string {
    let usIndex: UINT8;

    // Record string index. This index is used since we live in a multitasking environment.
    // It is still not bulletproof, but it's better than a single string
    usIndex = gubStringIndex++;
    if (gubStringIndex == 8) {
      // reset string pointer
      gubStringIndex = 0;
    }

    gbTmpDebugString[usIndex] = sprintf(string, ...args);

    return gbTmpDebugString[usIndex];
  }
}
