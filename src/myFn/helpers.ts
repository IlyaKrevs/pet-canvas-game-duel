import { IBullet, IHeroCircle } from "../types/types";

export function createBullet(hero: IHeroCircle): IBullet {
    let direction = 1
    if (hero.color === 'blue') {
        direction = -1
    }
    return {
        radius: 3,
        color: hero.bulletColor,
        speedX: 1 * direction,
        pos: {
            x: hero.pos.x + ((hero.radius + 3) * direction),
            y: hero.pos.y
        }
    }
}


type ObjectInCollision = {
    x: number,
    y: number,
    radius: number
}

export function objectCollision(first: ObjectInCollision, second: ObjectInCollision): boolean {
    let onX = (first.x - second.x) ** 2
    let onY = (first.y - second.y) ** 2
    let sumRadius = first.radius + second.radius

    if (Math.sqrt(onX + onY) < sumRadius) {
        return true
    }
    return false
}

