export default function InputPrompt() {
  return (
    <div className="flex w-full max-w-4xl items-center justify-center rounded-full bg-white px-4 py-3">
      <input
        type="text"
        placeholder="Enter your name"
        className="flex-grow bg-transparent text-black placeholder-white outline-none"
      />
      <button
        type="button"
        className="ml-4 flex items-center justify-center rounded-full bg-gradient-linear from-sky-300 to-primary-700 to-60% px-4 py-3 font-bold text-black hover:bg-purple-700"
      >
        <span className="mr-2">✨</span>
        Generate
      </button>
    </div>
  )
}
