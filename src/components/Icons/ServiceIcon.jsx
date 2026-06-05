import React from "react";
import {
  SparklesIcon,
  BeakerIcon,
  FaceSmileIcon,
  Cog6ToothIcon,
  StarIcon,
  UsersIcon,
  TrophyIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  HandRaisedIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const ServiceIcon = ({ name, size = 24, className = "" }) => {
  const sizeMap = {
    16: "w-4 h-4",
    20: "w-5 h-5",
    24: "w-6 h-6",
    32: "w-8 h-8",
    40: "w-10 h-10",
    48: "w-12 h-12",
  };

  const sizeClass = sizeMap[size] || `w-${size} h-${size}`;
  const finalClass = `${sizeClass} ${className}`;

  const icons = {
    tooth: <Cog6ToothIcon className={finalClass} />,
    cog: <Cog6ToothIcon className={finalClass} />,
    sparkles: <SparklesIcon className={finalClass} />,
    beaker: <BeakerIcon className={finalClass} />,
    faceSmile: <FaceSmileIcon className={finalClass} />,
    robot: <Cog6ToothIcon className={finalClass} />,
    clock: <ClockIcon className={finalClass} />,
    calendar: <CalendarIcon className={finalClass} />,
    checkCircle: <CheckCircleIcon className={finalClass} />,
    xCircle: <XCircleIcon className={finalClass} />,
    users: <UsersIcon className={finalClass} />,
    trophy: <TrophyIcon className={finalClass} />,
    star: <StarIcon className={finalClass} />,
    chatBubble: <ChatBubbleBottomCenterTextIcon className={finalClass} />,
    heart: <HeartIcon className={finalClass} />,
    handRaised: <HandRaisedIcon className={finalClass} />,
    magnifyingGlass: <MagnifyingGlassIcon className={finalClass} />,
  };

  return icons[name] || <SparklesIcon className={finalClass} />;
};

export default ServiceIcon;
