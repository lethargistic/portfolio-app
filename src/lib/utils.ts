export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export enum SeparatorShape {
    Star,
    ThreeStars,
    Pebble,
    Circles,
    Ok,
    None
}