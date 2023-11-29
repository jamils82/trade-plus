
export class CommonUtils {
  public static isMobile(): boolean {
    if (window.outerWidth < 768) {
      return true;
    }
    // else if (window.outerWidth < 990 && window.matchMedia("(orientation: landscape)").matches) {
    // return true;
    // }
    else {
    return false;
  }
  }
}