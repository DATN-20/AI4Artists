import React, { useState } from "react"
import { ModalLogin, ModalRegister } from "@/components/layout"
import { Dialog, DialogTrigger } from "../ui/dialog"

export default function InputPrompt() {
  const [inputValue, setInputValue] = useState("")
  const [showLoginModal, setShowLoginModal] = useState(true)

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value)
  }

  const handleGenerateClick = () => {
    localStorage.setItem("prompt", inputValue)
  }

  const toggleModal = () => {
    setShowLoginModal(!showLoginModal)
  }

  return (
    <Dialog>
      <div className="flex w-full max-w-4xl items-center justify-center rounded-full bg-white px-4 py-3">
        <input
          type="text"
          placeholder="Enter your prompt here..."
          className="flex-grow bg-transparent text-black placeholder-black outline-none ml-2"
          value={inputValue}
          onChange={handleInputChange}
        />
        <DialogTrigger asChild>
          <button
            type="button"
            className="ml-4 flex items-center justify-center rounded-full bg-gradient-default px-4 py-3 font-bold text-gray-800 "
            onClick={handleGenerateClick}
          >
            <span className="mr-2">✨</span>
            Generate
          </button>
        </DialogTrigger>
      </div>
      {showLoginModal ? (
        <ModalLogin onClose={toggleModal} />
      ) : (
        <ModalRegister onClose={toggleModal} />
      )}
    </Dialog>
  )
}
