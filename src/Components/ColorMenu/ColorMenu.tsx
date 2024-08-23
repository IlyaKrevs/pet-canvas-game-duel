import React from 'react'
import styles from './ColorMenu.module.css'
import { BulletColor } from '../../types/types'

interface IColorMenu {
    menuPos: { x: number, y: number },
    closeMenu: () => void,
    setColor: (value: BulletColor) => void
}



export const ColorMenu: React.FC<IColorMenu> = ({ menuPos, closeMenu, setColor }) => {

    const colours: BulletColor[] = ['red', 'blue', 'green', 'yellow']

    return (
        <>
            <div className={styles.mainContainer}
                style={{
                    top: menuPos.y,
                    left: menuPos.x
                }}
            >
                {colours.map((item, index) => {
                    return (
                        <div key={index}
                            className={styles.simpleItem}
                            style={{ backgroundColor: item }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setColor(item)
                                closeMenu()
                            }}

                        >
                        </div>
                    )
                })}

            </div>
        </>
    )
}
