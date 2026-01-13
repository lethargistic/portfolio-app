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