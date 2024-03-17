import React, { useEffect } from "react"
import { useGetAllDashboardImageQuery } from "@/services/dashboard/dashboardApi"
import Loading from "../Loading"
import { DashboardImage } from "@/types/dashboard"
const MasonryGrid = () => {
  const { data, error, isLoading } = useGetAllDashboardImageQuery({
    type: "RANDOM",
    page: 1,
    limit: 10,
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

  const renderColumn = (images: DashboardImage[]) => {
    return images.map((item, index) => (
      <div key={item.image.id}>
        <img
          className="h-auto w-full rounded-lg"
          src={item.image.url}
          alt={item.image.prompt}
        />
      </div>
    ))
  }

  const chunkSize = Math.ceil(data.data.length / 5)
  const imageColumns = Array.from({ length: 5 }, (_, i) =>
    data.data.slice(i * chunkSize, i * chunkSize + chunkSize),
  )

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
      {imageColumns.map((column, index) => (
        <div className="grid gap-4" key={index}>
          {renderColumn(column)}
        </div>
      ))}
    </div>
  )
}

export default MasonryGrid
