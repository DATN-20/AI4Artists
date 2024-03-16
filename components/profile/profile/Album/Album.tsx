import Image from "next/image"
import { Card } from "../../../ui/card"

const AlbumCard = ({ data }: { data: any }) => {
  return (
    <Card className="flex gap-4 rounded-xl p-2">
      <Image
        src={data.imageUrl}
        width={100}
        height={100}
        alt={data.altText || "Album Image Alt"}
        className="rounded-xl"
      />
      <div className="flex flex-col">
        <h1 className="text-xl font-bold">{data.title}</h1>
        <span className="flex flex-wrap gap-1 font-semibold text-secondary-700 text-sm">
          {data.tags.map((tag: any, index: any) => (
            <h3 key={index}>{tag}</h3>
          ))}
        </span>
      </div>
    </Card>
  )
}

export default AlbumCard
