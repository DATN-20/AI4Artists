"use client"

import { Flex } from "antd"
import Image from "next/image"
import InputPrompt from "../../components/landing-page/InputPrompt"
// import { useSelector, useDispatch } from "react-redux"
// import { decrement, increment } from "../store/slice"
// import type { RootState } from "../store/store"

export default function Home() {
  // const count = useSelector((state: RootState) => state.counter.value)
  // const dispatch = useDispatch()
  return (
    // <div>
    //   <div>
    //     <button
    //       aria-label="Increment value"
    //       onClick={() => dispatch(increment())}
    //     >
    //       Increment
    //     </button>
    //     <span>{count}</span>
    //     <button
    //       aria-label="Decrement value"
    //       onClick={() => dispatch(decrement())}
    //     >
    //       Decrement
    //     </button>
    //   </div>
    // </div>
    <div className="flex flex-grow flex-col items-center gap-14  ">
      <div className="absolute left-0 top-0 -z-10 h-full w-full">
        <Image src="/linear-gradient.png" alt="gradient" fill={true} />
        <Image src="/star.png" alt="star" fill={true} objectFit="cover" />
      </div>
      <div className="flex flex-col justify-center gap-4 text-center text-white">
        <h1 className="text-5xl font-bold">Create your own AI Art Gallery</h1>
        <h3 className="text-3xl font-semibold text-[#E0E0E1]">
          Making stunning AI generated art and manage your own gallery
        </h3>
      </div>
      <InputPrompt />
      {/* TODO : Introduction here */}
      <div className="relative z-20 w-[1024px] flex-grow justify-end rounded-tl-2xl rounded-tr-2xl border-l-2 border-r-2 border-t-2 border-white bg-black"></div>
    </div>
  )
}
