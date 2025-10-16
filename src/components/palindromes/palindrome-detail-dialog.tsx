"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { LicensePlate } from "@/components/license-plate"
import { Badge } from "@/components/ui/badge"
import type { PalindromeWithDetails } from "@/lib/db/schema"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PalindromeDetailDialogProps {
  palindrome: PalindromeWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PalindromeDetailDialog({ palindrome, open, onOpenChange }: PalindromeDetailDialogProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Reset zoom and pan when dialog opens or palindrome changes
  useEffect(() => {
    if (open) {
      setZoom(1)
      setPan({ x: 0, y: 0 })
    }
  }, [open, palindrome?.id])
  
  // Keyboard shortcuts for zoom
  useEffect(() => {
    if (!open) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        handleZoomIn()
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        handleZoomOut()
      } else if (e.key === '0') {
        e.preventDefault()
        handleResetZoom()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, zoom])
  
  if (!palindrome) return null

  const found = !!palindrome.userProfile
  
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleResetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-[98vw] h-[98vh] max-h-[98vh] p-0 overflow-hidden bg-black/95">
        <DialogTitle className="sr-only">
          Palindrome {palindrome.id} - {found ? 'Found' : 'Not Found'}
        </DialogTitle>
        <div className="relative w-full h-full flex flex-col">
          {/* Top overlay with license plate, status, and close button */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-start justify-between p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
            <div className="pointer-events-auto">
              <LicensePlate
                value={palindrome.id}
                size="sm"
                compact
              />
            </div>
            <div className="flex items-center gap-2 pointer-events-auto">
              {found ? (
                <Badge variant="default" className="bg-green-500/90 text-white dark:bg-green-600/90 shadow-lg backdrop-blur-sm">
                  Found
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-amber-500/90 text-white dark:bg-amber-600/90 shadow-lg backdrop-blur-sm">
                  Not Found
                </Badge>
              )}
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm h-8 w-8"
                title="Close (ESC)"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
              title="Zoom out (- key)"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetZoom}
              className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm min-w-[60px]"
              title="Reset zoom (0 key)"
            >
              {Math.round(zoom * 100)}%
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
              title="Zoom in (+ key)"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-4 left-4 z-10 text-xs text-white/60 backdrop-blur-sm bg-black/40 px-3 py-2 rounded hidden sm:block">
            Use +/- to zoom, drag to pan, ESC to close
          </div>

          {/* Image container with zoom and pan */}
          <div 
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={(e) => {
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
                if (e.deltaY < 0) {
                  handleZoomIn()
                } else {
                  handleZoomOut()
                }
              }
            }}
          >
            {palindrome.picture ? (
              <div 
                className="relative transition-transform duration-200 ease-out select-none"
                style={{ 
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                  transformOrigin: 'center center'
                }}
              >
                <Image
                  src={palindrome.picture}
                  alt={`Palindrome ${palindrome.id}`}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-[98vh] w-auto h-auto object-contain pointer-events-none"
                  unoptimized
                  priority
                  draggable={false}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="text-4xl mb-4">📷</div>
                  <p className="text-lg">No image available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
