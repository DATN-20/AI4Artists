import { useSelector } from 'react-redux';
import { selectAuth } from '@/features/authSlice';
import { Facebook, Home, Instagram, Twitter } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { CiViewList } from "react-icons/ci"
import { IoImages, IoArrowBackOutline } from "react-icons/io5"
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileHeaderProps {
  userData: {
    firstName: string;
    lastName: string;
    aliasName: string;
    profileImageUrl: string;
    socials: { social_name: string; social_link: string }[];
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData }) => {
  const authStates = useSelector(selectAuth);

  return (
    <div className="relative mb-4 flex flex-col">
      <div className="h-[164px] rounded-2xl bg-gray-500 bg-[url('https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg')]"></div>
      <div className="absolute bottom-0 left-3 h-[128px] w-[128px] rounded-full">
        <img
          className="h-full w-full rounded-full"
          src="https://4kwallpapers.com/images/wallpapers/viper-valorant-agent-2732x2732-9539.jpg"
          alt=""
        />
      </div>
      <div className="ml-[140px] flex items-center justify-between px-2 pt-2">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">
            {userData?.firstName + ' ' + userData?.lastName}
          </h1>
          <p className="text-lg font-light">{userData?.aliasName}</p>
        </div>
        {/* Social Links */}
        <div className="flex flex-col justify-end">
          <div className="mb-5 flex">
            {userData?.socials.map((item, index) => (
              <a
                key={index}
                href={item.social_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Render Social Icon */}
                {item.social_name === 'facebook' && <Facebook size={24} className="ml-4 cursor-pointer" />}
                {item.social_name === 'instagram' && <Instagram size={24} className="ml-4 cursor-pointer" />}
              </a>
            ))}
          </div>
          <TabsList className="flex justify-end gap-2 bg-inherit">
                        <TabsTrigger value="introduction" className="px-0 py-0">
                          <IoImages size={24} />
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="ml-3 px-0 py-0">
                          <CiViewList size={26} />
                        </TabsTrigger>
                      </TabsList>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
