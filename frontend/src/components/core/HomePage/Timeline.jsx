import { TIMELINE } from "../../../utils/constants";
import TimelineImage from "../../../assets/Images/TimelineImage.png";
const Timeline = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-20 mb-20 items-center">
      <div className="lg:w-[45%]  flex flex-col gap-14 lg:gap-3">
        {/* timeline item */}
        {TIMELINE.map((timeLineData, index) => {
          return (
            <div key={timeLineData.Heading} className="flex flex-col lg:gap-3">
              <div className="flex gap-6">
                <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">
                  <img src={timeLineData.Logo} alt="" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">
                    {timeLineData.Heading}
                  </h2>
                  <p className="text-base">{timeLineData.Description}</p>
                </div>
              </div>
              <div
                className={`h-14 border-dotted border-r border-richblack-100 bg-richblack-400/0 w-6 hidden  lg:${
                  index === TIMELINE.length - 1 ? "hidden" : "block"
                } `}
              ></div>
            </div>
          );
        })}
      </div>
      <div className="relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]">
        <div className=" absolute lg:left-2/4 lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10">
          <div className="flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14">
            <h1 className="text-3xl font-bold w-[75px]">10</h1>
            <h1 className="text-caribbeangreen-300 text-sm w-[75px]">
              Years experiences
            </h1>
          </div>
          <div className="flex gap-5 items-center lg:px-14 px-7">
            <h1 className="text-3xl font-bold w-[75px]">250</h1>
            <h1 className="text-caribbeangreen-300 text-sm w-[75px]">
              types of courses
            </h1>
          </div>
        </div>
        <img
          src={TimelineImage}
          alt=""
          className="shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit"
        />
      </div>
    </div>
  );
};

export default Timeline;
