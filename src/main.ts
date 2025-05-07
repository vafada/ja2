namespace ja2 {
  export const JA2_DATA_DIR = process.env.JA2_DATA_DIR || process.cwd();

  document.addEventListener("DOMContentLoaded", () => {
    const ja2Container = <HTMLElement>document.getElementById("ja2");
    if (ja2Container) {
      WinMain(<HTMLElement>document.getElementById("ja2"));
    } else {
      ViewerMain(<HTMLElement>document.getElementById("viewer"));
    }
  });
}
