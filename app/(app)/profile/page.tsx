"use client"
import { IoArrowBackOutline, IoTrashOutline } from "react-icons/io5"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileCarousel from "@/components/profile/profile/ProfileCarousel"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { useSelector } from "react-redux"
import { selectGenerate } from "@/features/generateSlice"
import Image from "next/image"
import ProfileContent from "@/components/profile/profile/ProfileContent"
import {
  useAddNewAlbumMutation,
  useDeleteAlbumMutation,
  useGetProfileAlbumMutation,
  useGetProfileMutation,
  useGetTotalImageMutation,
} from "@/services/profile/profileApi"
import {
  selectAuth,
  setTotalAlbum,
  setTotalImage,
  setUserData,
} from "@/features/authSlice"
import Loading from "@/components/Loading"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { AlbumWithImages } from "@/types/profile"
import PopupCarousel from "@/components/profile/profile/PopupCarousel"
import ProfileHeader from "@/components/profile/profile/ProfileHeader"
import AlbumCard from "@/components/profile/profile/Album/AlbumCard"
import { Button } from "@/components/ui/button"
import { IoAddCircleOutline } from "react-icons/io5"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import NavigationSideBarCard from "@/components/sidebar/card/NavigationSideBarCard"

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Email must be at least 1 characters.",
  }),
})
const Profile = () => {
  const dispatch = useAppDispatch()
  const generateStates = useSelector(selectGenerate)
  const authStates = useSelector(selectAuth)
  const [selectedAlbum, setSelectedAlbum] = useState(-1)
  const [getUser, { data: userData }] = useGetProfileMutation()
  const [getAlbum, { data: albumData }] = useGetProfileAlbumMutation()
  const [getTotalImage, { data: imagesData }] = useGetTotalImageMutation()
  const [addNewAlbum] = useAddNewAlbumMutation()
  const [deleteAlbum] = useDeleteAlbumMutation()

  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: "",
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name } = values

    if (name) {
      const result = await addNewAlbum(name)
      const fetchAlbumData = async () => {
        await getAlbum(undefined)
      }
      toast.success("Add new album successfully!")

      fetchAlbumData()
    } else {
      toast.error("Please enter album name!")
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      await getUser(undefined)
    }
    fetchUserData()
    const fetchAlbumData = async () => {
      await getAlbum(undefined)
    }
    fetchAlbumData()
    const fetchUserImages = async () => {
      await getTotalImage(undefined)
    }
    fetchUserImages()
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (userData) {
      dispatch(setUserData({ userData: userData }))
    }
  }, [userData])

  useEffect(() => {
    if (albumData) {
      dispatch(setTotalAlbum({ totalAlbum: albumData }))
    }
  }, [albumData])

  useEffect(() => {
    if (imagesData) {
      dispatch(setTotalImage({ totalImage: imagesData }))
    }
  }, [imagesData])
  const handleDeleteAlbum = async () => {
    if (!selectedAlbumId) {
      return
    }

    const albumId = Array.isArray(selectedAlbumId)
      ? selectedAlbumId
      : [selectedAlbumId]

    const result = await deleteAlbum({
      albumId: albumId,
    })
    const fetchAlbumData = async () => {
      await getAlbum(undefined)
    }

    toast.success("Delete album successfully")
    setSelectedAlbumId(null)
    fetchAlbumData()
  }
  useEffect(() => {
    if (selectedAlbum !== -1) {
      const albumTabTrigger = document.querySelector(
        '.tabs-trigger[value="album"]',
      )
      if (albumTabTrigger) {
        albumTabTrigger.dispatchEvent(
          new MouseEvent("click", { bubbles: true }),
        )
      } else {
        console.error("Album tab trigger not found!")
      }
    }
  }, [selectedAlbum])

  const [generateImgData, setGenerateImgData] = useState<string[] | null>(null)
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Dialog>
          <div className="flex gap-4 py-4 ">
            <div className="hidden lg:block lg:min-w-[300px]">
              <div className="no-scrollbar fixed left-0 top-0 flex h-screen min-h-screen w-[300px] flex-col gap-4 overflow-y-scroll p-4 ">
                <NavigationSideBarCard />
              </div>
            </div>
            <div className="mr-8 h-full flex-1">
              <Tabs
                defaultValue="introduction"
                onValueChange={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              >
                <ProfileHeader userData={userData} />
                <TabsContent value="introduction">
                  <div className="mt-8">
                    <span className="bg-gradient-default bg-clip-text text-4xl font-black text-transparent">
                      Your Images
                    </span>
                  </div>

                  <div className="mt-3 flex flex-col rounded-xl">
                    {imagesData && (
                      <ProfileCarousel
                        generateImgData={imagesData}
                        width={512}
                        height={512}
                        album={authStates.totalAlbum}
                      />
                    )}
                  </div>

                  <TabsList className="mb-5 mt-8 bg-transparent px-0">
                    <TabsTrigger value="album" className="px-0">
                      <span className="bg-gradient-default bg-clip-text text-4xl font-black text-transparent">
                        Your Album
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-3 grid grid-cols-1 gap-4 p-1 md:grid-cols-3">
                    {authStates.totalAlbum?.map((album: any, index: number) => (
                      <AlbumCard
                        key={index}
                        albumData={album}
                        width={512}
                        height={512}
                        setSelectedAlbum={setSelectedAlbum}
                        selectedAlbum={selectedAlbum}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="profile">
                  <ProfileContent imagesData={imagesData} />
                </TabsContent>
                <TabsContent value="album">
                  <div className="min-h-96 rounded-lg">
                    <div className="mb-5 mt-8 flex justify-between">
                      <div className="flex">
                        <TabsList className=" h-full bg-transparent">
                          <TabsTrigger
                            value="introduction"
                            className="text-white"
                          >
                            <h1 className=" text-2xl font-bold">
                              <IoArrowBackOutline />
                            </h1>
                          </TabsTrigger>
                        </TabsList>
                        <div className=" flex items-center justify-center text-3xl font-bold">
                          Albums
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button type="button" variant="default">
                            <IoAddCircleOutline className="mr-2" size={24} />
                            Add album
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                              <AlertDialogHeader className="mb-5">
                                <AlertDialogTitle>
                                  Add New Album
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Please enter the name of album.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Album name:</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="name"
                                        placeholder="Name"
                                        {...field}
                                        className="w-full border-slate-400"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <AlertDialogFooter className="mt-5">
                                <AlertDialogCancel>Close</AlertDialogCancel>
                                <AlertDialogAction>
                                  <Button type="submit">Save</Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </form>
                          </Form>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    {authStates.totalAlbum?.map((item: any, index: number) => (
                      <div key={index} className="mb-10 rounded-xl bg-card">
                        <div className="flex justify-between">
                          <div className="my-5 ml-5 text-2xl font-semibold">
                            {item.album.name}
                          </div>
                          <div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <IoTrashOutline
                                  className="mr-5 mt-5 cursor-pointer"
                                  size={24}
                                  onClick={() => {
                                    setSelectedAlbumId(item.album.id)
                                  }}
                                />
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader className="mb-5">
                                  <AlertDialogTitle>
                                    Are you sure to delete this album?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>

                                <AlertDialogFooter className="mt-5">
                                  <AlertDialogAction>
                                    <Button
                                      type="submit"
                                      onClick={() => handleDeleteAlbum()}
                                    >
                                      Save
                                    </Button>
                                  </AlertDialogAction>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        <div className="grid h-full grid-cols-1 items-center justify-center gap-2 pl-5 pr-5 md:grid-cols-4">
                          {item.images && item.images.length > 0 ? (
                            <>
                              {item.images
                                .slice(0, 3)
                                .map((image: any, imageIndex: number) => (
                                  <div className="relative" key={imageIndex}>
                                    <div className="flex justify-center bg-card">
                                      <Image
                                        src={image.image.url}
                                        alt={`Image ${imageIndex + 1}`}
                                        width={512}
                                        height={512}
                                        className="max-h-full rounded-md"
                                      />
                                    </div>
                                  </div>
                                ))}
                              <div className="relative">
                                {item.images.length > 4 && (
                                  <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-75 text-white">
                                    <DialogTrigger asChild>
                                      <p className="text-lg">See all</p>
                                    </DialogTrigger>
                                  </div>
                                )}
                                {item.images[3] && (
                                  <Image
                                    src={item.images[3].image.url}
                                    alt=""
                                    width={512}
                                    height={512}
                                    className="max-h-full rounded-md"
                                  />
                                )}
                              </div>
                            </>
                          ) : (
                            <p>No images available</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <DialogContent className=" lg:min-w-[950px]">
                      {authStates.totalAlbum && selectedAlbum !== -1 && (
                        <PopupCarousel
                          generateImgData={
                            (authStates.totalAlbum as AlbumWithImages[])[
                              selectedAlbum
                            ]?.images
                          }
                          width={512}
                          height={512}
                          setSelectedAlbum={setSelectedAlbum}
                          selectedAlbum={selectedAlbum}
                        />
                      )}
                    </DialogContent>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}

export default Profile
