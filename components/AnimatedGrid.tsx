"use client"

import React, { useEffect, useRef, useCallback } from 'react'

interface MovingGridProps {
	gridSize?: number
	lineWidth?: number
	lineColor?: string
	speed?: number
}

const MovingGrid: React.FC<MovingGridProps> = ({
	gridSize = 200,
	lineWidth = 3,
	lineColor = '#242424',
	speed = 0.5,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const animationFrameRef = useRef<number>(0)

	const drawGrid = useCallback((
		ctx: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement,
		offset: number
	) => {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.strokeStyle = lineColor
		ctx.lineWidth = lineWidth

		const diagonalOffset = offset % (gridSize * Math.sqrt(2))

		for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
			for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
				// Draw forward slash
				ctx.beginPath()
				ctx.moveTo(x + diagonalOffset, y - diagonalOffset)
				ctx.lineTo(x + gridSize + diagonalOffset, y + gridSize - diagonalOffset)
				ctx.stroke()

				// Draw back slash
				ctx.beginPath()
				ctx.moveTo(x + gridSize + diagonalOffset, y - diagonalOffset)
				ctx.lineTo(x + diagonalOffset, y + gridSize - diagonalOffset)
				ctx.stroke()
			}
		}
	}, [gridSize, lineWidth, lineColor])

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		let offset = 0

		const handleResize = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
			drawGrid(ctx, canvas, offset)
		}

		const animate = () => {
			offset += speed
			drawGrid(ctx, canvas, offset)
			animationFrameRef.current = requestAnimationFrame(animate)
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		animate()

		return () => {
			window.removeEventListener('resize', handleResize)
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [drawGrid, speed])

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 bg-black"
			style={{ width: '100vw', height: '100vh' }}
		/>
	)
}

export default MovingGrid
