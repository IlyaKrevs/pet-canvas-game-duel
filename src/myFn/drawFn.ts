import { IBullet, IHeroCircle } from "../types/types";

export function drawCircle(ctx: CanvasRenderingContext2D, circle: IHeroCircle | IBullet): void {
    ctx.beginPath()
    ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, Math.PI * 2)
    ctx.fillStyle = circle.color
    ctx.fill()
    ctx.closePath()
}

export function clearBoard(canvas: HTMLCanvasElement): void {
    canvas.
        getContext('2d')?.
        clearRect(0, 0, canvas.width, canvas.height)
}

