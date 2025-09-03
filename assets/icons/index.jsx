import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
//import Home from './home'
import { theme } from '../../constants/theme'

import {
  MailIcon,
  LockPasswordIcon,
  UserIcon,
  SearchIcon,
  HeartIcon,
  PlusIcon,
  LocationIcon,
  CallIcon,
  CameraIcon,
  EditIcon,
  ArrowLeftIcon,
  ThreeDotsCircleIcon,
  ThreeDotsHorizontalIcon,
  CommentIcon,
  ShareIcon,
  SendIcon,
  DeleteIcon,
  LogoutIcon,
  ImageIcon,
  VideoIcon,
  Home01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

const Mail = (props) => <HugeiconsIcon icon={MailIcon} {...props} />;
const Lock = (props) => <HugeiconsIcon icon={LockPasswordIcon} {...props} />;
const User = (props) => <HugeiconsIcon icon={UserIcon} {...props} />;
const Search = (props) => <HugeiconsIcon icon={SearchIcon} {...props} />;
const Heart = (props) => <HugeiconsIcon icon={HeartIcon} {...props} />;
const Plus = (props) => <HugeiconsIcon icon={PlusIcon} {...props} />;
const Location = (props) => <HugeiconsIcon icon={LocationIcon} {...props} />;
const Call = (props) => <HugeiconsIcon icon={CallIcon} {...props} />;
const Camera = (props) => <HugeiconsIcon icon={CameraIcon} {...props} />;
const Edit = (props) => <HugeiconsIcon icon={EditIcon} {...props} />;
const ArrowLeft = (props) => <HugeiconsIcon icon={ArrowLeftIcon} {...props} />;
const ThreeDotsCircle = (props) => <HugeiconsIcon icon={ThreeDotsCircleIcon} {...props} />;
const ThreeDotsHorizontal = (props) => <HugeiconsIcon icon={ThreeDotsHorizontalIcon} {...props} />;
const Comment = (props) => <HugeiconsIcon icon={CommentIcon} {...props} />;
const Share = (props) => <HugeiconsIcon icon={ShareIcon} {...props} />;
const Send = (props) => <HugeiconsIcon icon={SendIcon} {...props} />;
const Delete = (props) => <HugeiconsIcon icon={DeleteIcon} {...props} />;
const Logout = (props) => <HugeiconsIcon icon={LogoutIcon} {...props} />;
const Image = (props) => <HugeiconsIcon icon={ImageIcon} {...props} />;
const Video = (props) => <HugeiconsIcon icon={VideoIcon} {...props} />;
const Home = (props) => <HugeiconsIcon icon={Home01Icon} {...props} />;

const icons = {
    home: Home,
    mail: Mail,
    lock: Lock,
    user: User,
    search: Search,
    heart: Heart,
    plus: Plus,
    search: Search,
    location: Location,
    call: Call,
    camera: Camera,
    edit: Edit,
    arrowLeft: ArrowLeft,
    threeDotsCircle: ThreeDotsCircle,
    threeDotsHorizontal: ThreeDotsHorizontal,
    comment: Comment,
    share: Share,
    send: Send,
    delete: Delete,
    logout: Logout,
    image: Image,
    video: Video,
}
const Icon = ({ name, size = 24, strokeWidth = 1.9, color = theme.colors.textLight, ...props }) => {
  const IconComponent = icons[name];
  if (!IconComponent) return null;

  return (
    <IconComponent
      height={size}
      width={size}
      strokeWidth={strokeWidth}
      color={color}
      {...props}
    />
  );
};

export default Icon;

