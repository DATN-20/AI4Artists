"use client"

import Image from "next/image"
import InputPrompt from "../../components/landing-page/InputPrompt"

export default function Home() {
  return (
    <div className="mt-6 flex flex-grow flex-col items-center gap-14 px-4 lg:px-6">
      <div className="absolute left-0 top-0 -z-10 h-full w-full">
        <Image src="/linear-gradient.png" alt="gradient" fill={true} />
        <Image src="/star.png" alt="star" fill style={{ objectFit: "cover" }} />
      </div>
      <div className="flex flex-col justify-center gap-4 text-center text-white">
        <h1 className="text-5xl font-bold">Create your own AI Art Gallery</h1>
        <h3 className="text-3xl font-semibold text-[#E0E0E1]">
          Making stunning AI generated art and manage your own gallery
        </h3>
      </div>
      <InputPrompt />
      {/* TODO : Introduction here */}
      <div className="flex w-full flex-grow lg:w-[auto]">
        <div className="relative z-20 w-full flex-grow  rounded-2xl border-l-2 border-r-2 border-t-2 border-white bg-black lg:w-[1024px]"></div>
      </div>
    </div>
  )
}
