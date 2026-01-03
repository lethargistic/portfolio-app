export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export enum SeparatorShape {
    Star,
    ThreeStars,
    Rectangle,
    Circle
}