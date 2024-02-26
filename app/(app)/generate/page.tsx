export default function Generate() {
  return (
    <div className="grid grid-cols-10 gap-4 p-4">
      <div className="col-span-2">component Left side bar here</div>
      <div className="col-span-8 ml-4 h-full w-full">
        component Main content here
      </div>
    </div>
  )
}
