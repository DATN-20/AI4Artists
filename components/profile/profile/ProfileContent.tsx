import AlbumCard from "./Album/Album"
import { albumData, cardData } from "./MockCardData"
import PostCard from "./Post/Post"

const ProfileContent = () => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-4">
        {cardData.map((data) => (
          <PostCard data={data} />
        ))}
      </div>
      <div className="flex w-[540px] flex-col gap-4">
        {albumData.map((data) => (
          <AlbumCard key={data.id} data={data} />
        ))}
      </div>
    </div>
  )
}

export default ProfileContent
