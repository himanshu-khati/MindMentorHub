import HeroVideo from "../../../assets/Images/banner.mp4";
const VideoSection = () => {
  return (
    <div className="shadow-[10px_-5px_50px_-5px] shadow-blue-200 mx-auto shadow-[10px_-5px_50px_-5px mx-3 my-7 ">
      <video
        muted
        autoPlay
        loop
        className="shadow-[20px_20px_rgba(255,255,255)]"
      >
        <source src={HeroVideo} />
      </video>
    </div>
  );
};

export default VideoSection;
