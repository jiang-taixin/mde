import { isNumber } from "radash";
export function isVoid(val: any): boolean {
    return isNil(val) || val === "" || (isNumber(val) && isNaN(val));
}

export function isUndefined(val: any): boolean {
    return typeof val === "undefined";
}

export function isNull(val: any): boolean {
    return val === null;
}

export function isNil(val: any): boolean {
    return isUndefined(val) || isNull(val);
}

export function isElement(val: any): boolean {
    return typeof HTMLElement === "object"
        ? val instanceof HTMLElement
        : val &&
        typeof val === "object" &&
        val.nodeType === 1 &&
        typeof val.nodeName === "string";
}
