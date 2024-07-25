import { ACTOR, WORKOBJECT } from "./elementTypes";

export function getNameFromType(type) {
  // polyfill for test
  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      if (typeof start !== "number") {
        start = 0;
      }

      if (start + search.length > this.length) {
        return false;
      }

      return this.indexOf(search, start) !== -1;
    };
  }

  if (type.includes(ACTOR)) {
    return type.replace(ACTOR, "");
  }
  if (type.includes(WORKOBJECT)) {
    return type.replace(WORKOBJECT, "");
  }
}
