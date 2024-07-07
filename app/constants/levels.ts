import { Level as LevelEnum } from "../enums/ILevel";
import { Level } from "../models/ILevel";

export const levels: Level[] = [
    {
        level: LevelEnum.Level1,
        fee: 0,
    },
    {
        level: LevelEnum.Level2,
        fee: 5000,
    },
    {
        level: LevelEnum.Level3,
        fee: 15000,
    },
    {
        level: LevelEnum.Level4,
        fee: 30000,
    },
    {
        level: LevelEnum.Level5,
        fee: 60000,
    },
    {
        level: LevelEnum.Level6,
        fee: 100000,
    },
    {
        level: LevelEnum.Level7,
        fee: 200000,
    },
    {
        level: LevelEnum.Level8,
        fee: 500000,
    },
    {
        level: LevelEnum.Level9,
        fee: 1000000,
    },
    {
        level: LevelEnum.Level10,
        fee: 1500000,
    },
    // {
    //     level: LevelEnum.Level10,
    //     fee: 2000000,
    // },
]