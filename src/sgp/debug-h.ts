namespace ja2 {
  export function Assert(condition: any): asserts condition {
    AssertMsg(condition, "Should be unreachable");
  }

  export function AssertMsg(condition: any, msg: string): asserts condition {
    if (!condition) {
      throw new Error(msg);
    }
  }

  //*******************************************************************************************
  // Release Mode
  //*******************************************************************************************

  export const UnRegisterDebugTopic = (a: number, b: string) => {};

  export const FastDebugMsg = (a: string) => {
    console.log(a);
  };

  export const DbgMessage = (a: number, dbgLevel: number, c: string) => {
    if (dbgLevel >= DBG_LEVEL_2) {
      console.log(a, c);
    }
  };

  export const DebugMsg = (a: number, b: number, c: string) => {
    console.log(a, b, c);
  };

  //*******************************************************************************************
}
