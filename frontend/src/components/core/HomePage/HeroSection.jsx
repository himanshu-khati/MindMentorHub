import HighlightText from "./HighlightText";
import Button from "./Button";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
const HeroSection = () => {
  return (
    <>
      <Link to={"/signup"}>
        <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-none transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
          <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
            <p>Become an Instructor</p>
            <FaArrowRight />
          </div>
        </div>
      </Link>
      <div className="text-center text-4xl font-semibold">
        Empower Your Future with
        <HighlightText text={"Coding Skills"} />
      </div>
      <div className="w-9/11 text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
      </div>
      <div className="mt-8 flex gap-7">
        <Button text={"Learn More"} link={"/signup"} active={true} />
        <Button text={"Book a Demo"} link={"/login"} active={false} />
      </div>
    </>
  );
};

export default HeroSection;
