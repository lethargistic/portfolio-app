export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export enum SeparatorShape {
    Star= "Star",
    ThreeStars = "ThreeStars",
    Pebble = "Pebble",
    Circles = "Circles",
    Ok = "Ok",
    Tilde = "Tilde",
    None = "None"
}