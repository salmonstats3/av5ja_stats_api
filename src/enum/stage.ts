// const StageId = {
//     Unknown: -999,
//     Shakeup: 1,
//     Shakespiral: 2,
//     Shakeship: 6,
//     Shakedent: 7,
//     Shakehighway: 8,
//     Carousel: 100,
//     Upland: 102,
//     Temple: 103,
// } as const

// export type StageId = typeof StageId[keyof typeof StageId]

export enum StageId {
    Unknown = -999,
    Shakeup = 1,
    Shakespiral = 2,
    Shakeship = 6,
    Shakedent = 7,
    Shakehighway = 8,
    Carousel = 100,
    Upland = 102,
    Temple = 103,
}
