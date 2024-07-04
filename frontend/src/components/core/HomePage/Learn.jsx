import HighlightText from "./HighlightText";
import Progress from "../../../assets/Images/Know_your_progress.png";
import Compare from "../../../assets/Images/Compare_with_others.svg";
import Plan from "../../../assets/Images/Plan_your_lessons.svg";
import Button from "./Button";

const Learn = () => {
  return (
    <div className="text-4xl font-semibold text-center">
      Your swiss knife for
      <HighlightText text={"learning any language"} />
      <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
        Using spin making learning multiple languages easy. with 20+ languages
        realistic voice-over, progress tracking, custom schedule and more.
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0">
        <img src={Progress} alt="" className="object-contain  lg:-mr-32 " />
        <img
          src={Compare}
          alt=""
          className="object-contain lg:-mb-10 lg:-mt-0 -mt-12"
        />
        <img
          src={Plan}
          alt=""
          className="object-contain  lg:-ml-36 lg:-mt-5 -mt-16"
        />
      </div>
      <div className="w-fit mx-auto lg:mb-20 mb-8 ">
        <Button text={"Learn More"} link={"/signup"} active={true} />
      </div>
    </div>
  );
};

export default Learn;
