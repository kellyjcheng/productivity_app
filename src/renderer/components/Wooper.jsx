import { useState, useEffect } from 'react'
import wooperGif from '../../assets/wooper/wooper.gif'
import '../styles/Wooper.css'

const SPRITE_SIZE = 48

export default function Wooper({ windowWidth, windowHeight }) {
  const maxX = windowWidth - SPRITE_SIZE
  const maxY = windowHeight - SPRITE_SIZE

  const [pos, setPos] = useState({
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY)
  })
  const [facingLeft, setFacingLeft] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPos(prev => {
        const newX = Math.floor(Math.random() * maxX)
        const newY = Math.floor(Math.random() * maxY)
        setFacingLeft(newX < prev.x)
        return { x: newX, y: newY }
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [maxX, maxY])

  return (
    <img
      src={wooperGif}
      alt="Wooper"
      className="wooper-sprite"
      style={{
        left: pos.x,
        top: pos.y,
        transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
        transition: 'left 1.8s ease-in-out, top 1.8s ease-in-out'
      }}
    />
  )
}
