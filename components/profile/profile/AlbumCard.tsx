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
    <>
      <Card
        className="relative flex min-h-[300px] cursor-pointer justify-center"
        onClick={handleClick}
      >
        <DialogTrigger asChild>
          <div
            className={`relative grid h-full w-full gap-1 ${
              albumData.images && albumData.images.length === 0
                ? "grid-cols-1 grid-rows-1"
                : "grid-cols-2 grid-rows-2"
            }`}
          >
            {albumData.images &&
              albumData.images.length > 0 &&
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
                ))}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <p className="text-center text-white">
                Album: {albumData.album.name}
              </p>
            </div>
            {albumData.images && albumData.images.length === 0 && (
              <div className="mt-20 flex max-h-full max-w-full justify-center">
                No images available
              </div>
            )}
          </div>
        </DialogTrigger>
      </Card>
      <DialogContent className="lg:min-w-[950px]">
        {authStates.totalAlbum && selectedAlbum !== -1 && (
          <PopupCarousel
            generateImgData={
              (authStates.totalAlbum as AlbumWithImages[])[selectedAlbum]
                ?.images
            }
            width={width}
            height={height}
            setSelectedAlbum={setSelectedAlbum}
            selectedAlbum={selectedAlbum}
          />
        )}
      </DialogContent>
    </>
  )
}

export default AlbumCard
