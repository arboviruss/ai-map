// components/TifLayer.tsx
'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import GeoRasterLayer from 'georaster-layer-for-leaflet'
import parseGeoraster from 'georaster'

type Props = {
  url: string
}

export default function TifLayer({ url }: Props) {
  const map = useMap()

  useEffect(() => {
    const loadRaster = async () => {
      try {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        const georaster = await parseGeoraster(arrayBuffer)

        const layer = new GeoRasterLayer({
          georaster,
          opacity: 0.7,
          resolution: 256, // lower = more detail but heavier
        })

        layer.addTo(map)
        map.fitBounds(layer.getBounds())
      } catch (error) {
        console.error('Error loading GeoTIFF:', error)
      }
    }

    loadRaster()
  }, [url, map])

  return null
}
