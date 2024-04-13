// AlbumCard.tsx

import React from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { AlbumWithImages } from "@/types/profile"
import { useSelector } from "react-redux"
import { selectAuth } from "@/features/authSlice"
import PopupCarousel from "@/components/profile/profile/PopupCarousel"
import { DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface AlbumCardProps {
  albumData: AlbumWithImages
  width: number | undefined
  height: number | undefined
  setSelectedAlbum: (albumId: number) => void
  selectedAlbum: number
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  albumData,
  width,
  height,
  setSelectedAlbum,
  selectedAlbum,
}) => {
  const authStates = useSelector(selectAuth)
  const handleClick = () => {
    setSelectedAlbum(albumData.album.id - 1)
  }
  return (
    <Card
      className="relative flex cursor-pointer justify-center"
      onClick={handleClick}
    >
      <DialogTrigger asChild>
        <div className="relative grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
          {albumData.images && albumData.images.length > 0 ? (
            albumData.images
              .slice(0, 4)
              .map((image: any, imageIndex: number) => (
                <div key={imageIndex} className="relative h-40">
                  <Image
                    src={image.image.url}
                    alt={`Image ${imageIndex + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              ))
          ) : (
            <p>No images available</p>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <p className="text-center text-white">
              Album: {albumData.album.name}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="lg:min-w-[950px]">
        {authStates.totalAlbum && selectedAlbum !== -1 && (
          <PopupCarousel
            generateImgData={
              (authStates.totalAlbum as AlbumWithImages[])[selectedAlbum]
                ?.images
            }
            width={width}
            height={height}
          />
        )}
      </DialogContent>
    </Card>
  )
}

export default AlbumCard
