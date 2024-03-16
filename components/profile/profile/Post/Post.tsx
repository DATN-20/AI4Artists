import { Card } from "../../../ui/card"
import Image from "next/image"

const PostCard = ({ data }: { data: any }) => {
  return (
    <Card key={data.id} className="flex-1 rounded-xl p-4">
      <div className="flex gap-4">
        <Image
          src={data.imageUrl}
          width={200}
          height={200}
          alt={"Card Image Alt"}
          className="rounded-xl"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{data.title}</h1>
          <span className="flex gap-2 font-semibold text-secondary-700">
            {data.tags.map((tag: any, index: any) => (
              <h3 key={index}>{tag}</h3>
            ))}
          </span>
          <h1 className="mt-2 text-xl font-bold">Prompt</h1>
          <p>{data.prompt}</p>
          <p className="flex justify-end font-semibold text-secondary-700">
            View More
          </p>
        </div>
      </div>
    </Card>
  )
}

export default PostCard
