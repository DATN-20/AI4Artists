import NavigationSideBar from "@/components/sidebar/NavigationSideBar"

const Profile = () => {
  return (
    <div className="flex gap-4 py-4 lg:grid lg:grid-cols-10">
      <div className="hidden lg:col-span-2 lg:block">
        <NavigationSideBar />
      </div>
      <div className="h-full w-full lg:col-span-8 lg:mx-8">
         
      </div>
    </div>
  )
}

export default Profile
