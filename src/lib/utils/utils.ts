export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const isEmptyObj = (obj: Object) => {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
}

export const isEmptyArr = (arr: any[]) => {
    return arr.length === 0;
}

export enum SeparatorShape {
    Star = "Star",
    ThreeStars = "ThreeStars",
    Pebble = "Pebble",
    Circles = "Circles",
    Ok = "Ok",
    Tilde = "Tilde",
    None = "None"
}

export enum Editable {
    About = "about",
    Linktree = "linktree",
    Web = "web",
    Other = "other",
    Art = "art"
}

const isValidDataNumber = (val: any) => {
    if (typeof val === 'boolean' || val === null || val === '') return false;
    return Number.isFinite(Number(val));
}

export const convertSimpleDataTypesImplicitly = (value: any) => {
    if (value === 'null') {
        return null;
    }
    if (value === 'undefined') {
        return undefined;
    }

    if (value === 'true' || value === 'false') {
        return value === 'true'
    }

    if (isValidDataNumber(value)) {
        return Number(value);
    }

    return value;
}