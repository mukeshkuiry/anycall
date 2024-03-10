import { BiUser } from "react-icons/bi";
import { FiPhoneOutgoing } from "react-icons/fi";

/* eslint-disable @next/next/no-img-element */
type Props = {
  type: "stranger" | "user" | "waiting";
  size: "small" | "large";
};

const Avatar = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div
        className={`rounded-full flex justify-center items-center text-gray-500 ${
          props.size === "small"
            ? "border-2 w-16 h-16 text-3xl"
            : "border-4 w-32 h-32 text-6xl"
        } border-gray-500`}
      >
        {props.type === "waiting" ? <FiPhoneOutgoing /> : <BiUser />}
      </div>

      <p
        className={` text-gray-500
      ${props.size === "small" ? "text-xl" : "text-3xl"}
      
      `}
      >
        {props.type === "stranger"
          ? "Stranger"
          : props.type === "user"
          ? "You"
          : "Waiting for user to join..."}
      </p>
    </div>
  );
};

export default Avatar;
