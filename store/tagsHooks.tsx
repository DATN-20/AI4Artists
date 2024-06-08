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
  openStyleDrawer: boolean
  setOpenStyleDrawer: Dispatch<SetStateAction<boolean>>
}

export const TagsContext = createContext<TagsContextType>({
  tags: [],
  setTags: () => {},
  isTagChosens: [],
  setTagChosens: () => {},
  initTagChosen: () => {},
  generateTags: "",
  setGenerateTags: () => {},
  openStyleDrawer: false,
  setOpenStyleDrawer: () => {},
})

export const TagsContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tags, setTags] = useState<string[]>([])
  const [isTagChosens, setTagChosens] = useState<boolean[]>([])
  const [generateTags, setGenerateTags] = useState("")
  const [openStyleDrawer, setOpenStyleDrawer] = useState(false)

  const initTagChosen = () => {
    const arr = new Array(tags.length).fill(true)
    setTagChosens(arr)
  }

  return (
    <TagsContext.Provider
      value={{
        tags,
        setTags,
        isTagChosens,
        setTagChosens,
        initTagChosen,
        generateTags,
        setGenerateTags,
        openStyleDrawer,
        setOpenStyleDrawer,
      }}
    >
      {children}
    </TagsContext.Provider>
  )
}
