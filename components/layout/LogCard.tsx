import React from "react"

const LogCard = ({
  title,
  content,
  createdAt,
}: {
  title: string
  content: string
  createdAt: string
}) => {
  return (
    <div className="border-b p-4">
      <h4 className="font-bold">{title}</h4>
      <p>{content}</p>
      <span className="text-xs text-gray-500">
        {new Date(createdAt).toLocaleString()}
      </span>
    </div>
  )
}

export default LogCard
