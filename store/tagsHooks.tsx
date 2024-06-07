import {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useState,
} from "react"

export type TagsContextType = {
  tags: string[]
  setTags: Dispatch<SetStateAction<string[]>>
  isTagChosens: boolean[]
  setTagChosens: Dispatch<SetStateAction<boolean[]>>
  initTagChosen: () => void
  generateTags: string
  setGenerateTags: Dispatch<SetStateAction<string>>
}

export const TagsContext = createContext<TagsContextType>({
  tags: [],
  setTags: () => {},
  isTagChosens: [],
  setTagChosens: () => {},
  initTagChosen: () => {},
  generateTags: "",
  setGenerateTags: () => {},
})

export const TagsContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tags, setTags] = useState<string[]>([])
  const [isTagChosens, setTagChosens] = useState<boolean[]>([])
  const [generateTags, setGenerateTags] = useState("")

  const initTagChosen = () => {
    const arr = new Array(tags.length).fill(true)
    setTagChosens(arr)
  }

  return (
    <TagsContext.Provider
      value={{ tags, setTags, isTagChosens, setTagChosens, initTagChosen, generateTags, setGenerateTags }}
    >
      {children}
    </TagsContext.Provider>
  )
}
