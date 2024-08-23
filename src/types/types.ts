export interface IHeroCircle {
    color: 'red' | 'blue',
    pos: {
        x: number,
        y: number
    },
    radius: number,
    speedY: number,
    attackSpeed: number,
    bulletColor: BulletColor,

}

export interface IBullet {
    color: BulletColor,
    pos: {
        x: number,
        y: number,
    },
    radius: number,
    speedX: number
}

export interface IHeroValue {
    bulletColor: BulletColor,
    attackSpeed: number,
    speedY: number,
    hp: number
}

export type BulletColor = 'red' | 'blue' | 'green' | 'yellow'

