import React, { useEffect, useRef } from 'react'

function AudioWaveform({ isActive }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    let phase = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.beginPath()
      ctx.strokeStyle = '#667eea'
      ctx.lineWidth = 3

      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin((x + phase) * 0.05) * 20
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
      phase += 5
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '0.5rem',
      border: '1px solid #e5e7eb'
    }}>
      <canvas
        ref={canvasRef}
        width={700}
        height={60}
        style={{
          width: '100%',
          height: '60px',
          display: 'block'
        }}
      />
      <div style={{
        textAlign: 'center',
        marginTop: '0.5rem',
        fontSize: '0.875rem',
        color: '#6b7280',
        fontWeight: '500'
      }}>
        {isActive ? 'Listening...' : 'Ready'}
      </div>
    </div>
  )
}

export default AudioWaveform
