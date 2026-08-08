import { expect} from "@playwright/test";



export const stringFormat = (str, ...args) =>
   str.replace(/{(\d+)}/g, (match, index) => args[index].toString() || "");