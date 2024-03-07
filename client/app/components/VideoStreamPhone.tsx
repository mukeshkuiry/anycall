import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import ReactPlayer from "react-player";

type Props = {
  myStream: MediaStream | null;
  remoteStream: MediaStream | null;
};

const VideoStreamPhone = ({ myStream, remoteStream }: Props) => {
  const handleNewCall = () => {
    window.location.reload();
  };
  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-col justify-between items-center relative bg-black">
      <div className="h-full ">
        {remoteStream ? (
          <ReactPlayer
            playing
            url={remoteStream}
            width="100%"
            controls
            height="calc(100% - 8rem)"
            className="rounded-t-lg"
          />
        ) : (
          <div className="w-screen h-full flex justify-center items-center text-white">
            <h1 className="text-xl text-yellow-500 text-center">
              Waiting for any stranger to join...
            </h1>
          </div>
        )}
      </div>
      <div className="w-full bg-gray-900 py-4 px-6 rounded-b-lg flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
            {myStream && (
              <ReactPlayer
                playing
                url={myStream}
                width="100%"
                height="100%"
                className="rounded-full"
                style={{
                  transform: "rotateY(180deg)",
                }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg cursor-pointer"
            onClick={handleNewCall}
          >
            <FontAwesomeIcon icon={faPhone} size="lg" />
            <span className="ml-2">New Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoStreamPhone;
