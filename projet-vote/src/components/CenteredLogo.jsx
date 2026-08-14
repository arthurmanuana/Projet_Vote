import { useEffect, useState } from 'react'

// Le PNG du logo a des marges transparentes inegales qui decentrent
// le blason a l'oeil. Ce composant les rogne cote navigateur :
// apres ca, le contenu visible est VRAIMENT centre.
export default function CenteredLogo({ src, alt, className }) {
  const [cropped, setCropped] = useState(null)

  useEffect(() => {
    let alive = true
    const img = new Image()

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const { data } = ctx.getImageData(0, 0, img.width, img.height)

        // On cherche le cadre du contenu visible (pixels non transparents)
        let minX = img.width
        let minY = img.height
        let maxX = 0
        let maxY = 0
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            if (data[(y * img.width + x) * 4 + 3] > 10) {
              if (x < minX) minX = x
              if (y < minY) minY = y
              if (x > maxX) maxX = x
              if (y > maxY) maxY = y
            }
          }
        }

        if (maxX <= minX || maxY <= minY) {
          if (alive) setCropped(src)
          return
        }

        const w = maxX - minX + 1
        const h = maxY - minY + 1
        const out = document.createElement('canvas')
        out.width = w
        out.height = h
        out.getContext('2d').drawImage(canvas, minX, minY, w, h, 0, 0, w, h)
        if (alive) setCropped(out.toDataURL())
      } catch (error) {
        // Si jamais le rognage echoue, on affiche le logo tel quel.
        console.error('Rognage du logo impossible :', error)
        if (alive) setCropped(src)
      }
    }

    img.onerror = () => {
      if (alive) setCropped(src)
    }

    img.src = src
    return () => {
      alive = false
    }
  }, [src])

  return <img src={cropped || src} alt={alt} className={className} />
}