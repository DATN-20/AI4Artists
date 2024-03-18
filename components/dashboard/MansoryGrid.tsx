import React, { useEffect } from "react"
import { useGetAllDashboardImageQuery } from "@/services/dashboard/dashboardApi"
import Loading from "../Loading"
import { DashboardImage } from "@/types/dashboard"

const MasonryGrid = ({ type }: { type: string }) => {
  const { data, error, isLoading } = useGetAllDashboardImageQuery({
    type: type,
    page: 1,
    limit: 100,
  })

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch images:", error)
    }
  }, [error, data])

  if (isLoading) {
    return <Loading />
  }

  if (!data) {
    return <div>No images found.</div>
  }

  // Distributing images in a round-robin fashion
  const numberOfColumns = 5
  const imageColumns = Array.from({ length: numberOfColumns }, () => [])

  data.data.forEach((item, index) => {
    const columnIndex = index % numberOfColumns
    imageColumns[columnIndex].push(item)
  })

  const renderColumn = (images: DashboardImage[]) => {
    return images.map((item, index) => (
      <img
        key={index} // Add a key here for React to handle re-renders efficiently
        className="h-auto w-full rounded-lg"
        src={item.image.url}
        alt={item.image.prompt}
      />
    ))
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
      {imageColumns.map((column, index) => (
        <div className="flex flex-col gap-4" key={index}>
          {renderColumn(column)}
        </div>
      ))}
    </div>
  )
}

export default MasonryGrid
