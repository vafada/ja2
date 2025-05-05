namespace ja2 {
  // debug variable for total memory currently allocated
  export let guiMemTotal: UINT32 = 0;

  export function InitializeMemoryManager() {
    guiMemTotal = 0;
  }
}
