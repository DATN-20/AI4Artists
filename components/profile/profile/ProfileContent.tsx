import MansoryGrid from "../../dashboard/MansoryGrid"

const ProfileContent = ({ imagesData }: { imagesData: any }) => {
  return (
    <div className="flex p-2">
      <MansoryGrid data={imagesData} />
    </div>
  )
}

export default ProfileContent
