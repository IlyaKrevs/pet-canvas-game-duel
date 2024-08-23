import React, { useEffect, useRef, useState } from 'react'
import styles from './MainBoard.module.css'
import { BulletColor, IBullet, IHeroCircle } from '../../types/types'

import { drawCircle, clearBoard } from '../../myFn/drawFn'
import { objectCollision, createBullet } from '../../myFn/helpers'
import { CustomRangeInput } from '../../Components/CustomRangeInput/CustomRangeInput'
import { ColorMenu } from '../../Components/ColorMenu/ColorMenu'


type GameStatus = 'wait' | 'inProgress' | 'pause' | 'finish'

const heroesInit: IHeroCircle[] = [
    {
        color: 'red',
        pos: {
            x: 20,
            y: 150
        },
        radius: 20,
        speedY: 2,
        attackSpeed: 1000,
        bulletColor: 'red'
    }, {
        color: 'blue',
        pos: {
            x: 580,
            y: 150
        },
        radius: 20,
        speedY: -2,
        attackSpeed: 1000,
        bulletColor: 'blue'
    }
]

type Points = {
    red: number;
    blue: number;
}

type MouseCoord = { x: number, y: number }

export const MainBoard: React.FC = () => {

    const mouseCoordRef = useRef<MouseCoord>({ x: 0, y: 0 })
    const menuCoordsRef = useRef<MouseCoord>({ x: 0, y: 0 })
    const [gameStatus, setGameStatus] = useState<GameStatus>('wait')
    const [showMenu, setShowMenu] = useState<boolean>(false)


    const chosenPlayer = useRef<'red' | 'blue' | null>(null)

    // need for upd attack-speed / bullet-color etc ( w/o renders for update pos hero/bullet )
    const [intentionalUpdRefs, setIntentionalUpdRefs] = useState<boolean>(false)
    //

    const [Points, setPoints] = useState<Points>({
        red: 0,
        blue: 0
    })



    const canvasRef = useRef<HTMLCanvasElement>(null)

    const heroesRef = useRef<IHeroCircle[]>(heroesInit)
    const bulletsRef = useRef<IBullet[]>([])

    useEffect(() => {
        let animationID: number = 0;

        const animation = () => {
            const canvas = canvasRef.current
            if (canvas !== null) {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    clearBoard(canvas)

                    heroesRef.current.forEach(hero => {
                        hero.pos.y += hero.speedY

                        // border collision
                        if ((hero.pos.y + hero.radius) > canvas.height || (hero.pos.y - hero.radius) < 0) {
                            hero.speedY = hero.speedY * (-1)
                        }
                        // mouse collision
                        if (objectCollision({
                            x: hero.pos.x,
                            y: hero.pos.y,
                            radius: hero.radius
                        }, {
                            x: mouseCoordRef.current.x,
                            y: mouseCoordRef.current.y,
                            radius: 10
                        })) {
                            hero.speedY = hero.speedY * (-1)
                        }



                        // check hits
                        bulletsRef.current = bulletsRef.current.filter(bullet => {
                            // bullet outside of canvas
                            if ((bullet.pos.x + bullet.radius) > canvas.width || (bullet.pos.x - bullet.radius) < 0) {
                                return false
                            }

                            if (objectCollision({
                                x: hero.pos.x,
                                y: hero.pos.y,
                                radius: hero.radius
                            }, {
                                x: bullet.pos.x,
                                y: bullet.pos.y,
                                radius: bullet.radius
                            })) {
                                // make damage
                                setPoints(prev => {
                                    return { ...prev, [hero.color]: prev[hero.color] + 1 }
                                })
                                // delete bullet
                                return false
                            } else {
                                return true
                            }
                        })

                        drawCircle(ctx, hero)
                    })

                    bulletsRef.current.forEach(bullet => {
                        bullet.pos.x += bullet.speedX
                        drawCircle(ctx, bullet)
                    })
                }
            }
            animationID = requestAnimationFrame(animation)
        }
        animation()

        if (gameStatus === 'pause' || gameStatus === 'finish') {
            cancelAnimationFrame(animationID)
        }

        return () => cancelAnimationFrame(animationID)
    }, [gameStatus])




    useEffect(() => {
        // make bullets
        let idArray: NodeJS.Timeout[] = [];

        heroesRef.current.forEach(hero => {
            const id = setInterval(() => {
                bulletsRef.current.push(createBullet(hero))
            }, hero.attackSpeed);
            idArray.push(id)
        })

        return () => {
            idArray.forEach(clearInterval)
        }
    }, [intentionalUpdRefs])



    const catchMouseCoord = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (canvasRef.current) {
            const canvasRect = canvasRef.current.getBoundingClientRect()
            if (canvasRect) {
                const mouseX = e.clientX - canvasRect.left
                const mouseY = e.clientY - canvasRect.top
                mouseCoordRef.current = { x: mouseX, y: mouseY }
            }
        }
    }


    function handleOpenMenu(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        heroesRef.current.forEach(hero => {
            if (objectCollision(
                {
                    x: hero.pos.x,
                    y: hero.pos.y,
                    radius: hero.radius
                },
                {
                    x: mouseCoordRef.current.x,
                    y: mouseCoordRef.current.y,
                    radius: 10
                })
            ) {
                chosenPlayer.current = hero.color
                setShowMenu(true)
                setGameStatus('pause')
                menuCoordsRef.current = { x: e.clientX, y: e.clientY }
            }
        })
    }

    function handleCloseMenu() {
        chosenPlayer.current = null
        setShowMenu(false)
        setGameStatus('inProgress')
    }

    function handleChangeBulletColor(value: BulletColor) {
        heroesRef.current.forEach(hero => {
            if (hero.color === chosenPlayer.current) {
                hero.bulletColor = value
                setIntentionalUpdRefs(prev => !prev)
            }
        })
        setGameStatus('inProgress')
    }


    return (
        <div className={styles.mainContainer}
            onMouseMove={catchMouseCoord}
            onClick={handleCloseMenu}
        >

            <div className={styles.titleContainer}>
                <div>Player red hp: {Points.red}</div>
                <div>Player blue hp: {Points.blue}</div>
            </div>

            <canvas ref={canvasRef}
                height={300}
                width={600}
                className={styles.canvasStyles}
                onClick={(e) => {
                    e.stopPropagation()
                    handleOpenMenu(e)
                }}
            ></canvas>





            <div className={styles.controlsContainer}>

                {/* red player  */}
                <div className={styles.controlsItem}>
                    {/*  move speed */}
                    <CustomRangeInput
                        currentValue={heroesRef.current[0].speedY}
                        min={1}
                        max={10}
                        setResult={(value) => {
                            heroesRef.current[0].speedY = value
                        }}
                    />
                    {/* attack speed */}
                    <CustomRangeInput
                        currentValue={heroesRef.current[0].attackSpeed}
                        min={100}
                        max={10000}
                        setResult={(value) => {
                            heroesRef.current[0].attackSpeed = value
                            setIntentionalUpdRefs(prev => !prev)
                        }}
                    />

                </div>

                {/* blue player  */}
                <div className={styles.controlsItem}>
                    {/*  move speed */}
                    <CustomRangeInput
                        currentValue={heroesRef.current[1].speedY}
                        min={1}
                        max={10}
                        setResult={(value) => {
                            heroesRef.current[1].speedY = value
                        }}
                    />
                    {/* attack speed */}
                    <CustomRangeInput
                        currentValue={heroesRef.current[1].attackSpeed}
                        min={100}
                        max={10000}
                        setResult={(value) => {
                            heroesRef.current[1].attackSpeed = value
                            setIntentionalUpdRefs(prev => !prev)
                        }}
                    />

                </div>


            </div>

            {showMenu &&
                <ColorMenu
                    menuPos={menuCoordsRef.current}
                    closeMenu={handleCloseMenu}
                    setColor={handleChangeBulletColor}
                />}
        </div>
    )
}
