import React, { useEffect } from "react"
import { DashboardImage } from "@/types/dashboard"
import ImageDetail from "./ImageDetail"

const MansoryGrid = ({
  data
}: {
  data: DashboardImage[]
}) => {
  if (!data) {
    return <div>No images found.</div>
  }

  const numberOfColumns = 5
  const imageColumns: DashboardImage[][] = Array.from({ length: numberOfColumns }, () => [])

  data.forEach((item, index) => {
    const columnIndex = index % numberOfColumns
    imageColumns[columnIndex].push(item)
  })

  const renderColumn = (images: DashboardImage[]) => {
    return images.map((item, index) => (
      <ImageDetail image={item} index={index} />
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

export default MansoryGrid
