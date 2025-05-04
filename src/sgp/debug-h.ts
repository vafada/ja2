namespace ja2 {

export function Assert(condition: any): asserts condition {
  AssertMsg(condition, 'Should be unreachable');
}

export function AssertMsg(condition: any, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

//*******************************************************************************************
// Release Mode
//*******************************************************************************************

export const RegisterDebugTopic = (a: number, b: string) => {};
export const UnRegisterDebugTopic = (a: number, b: string) => {};


export const FastDebugMsg = (a: string) => {
  console.log(a);
};

export const DbgMessage = (a: number, b: number, c: string) => {};

export const DebugMsg = (a: number, b: number, c: string) => {
  console.log(a, b, c);
};

//*******************************************************************************************

}
