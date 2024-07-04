import { FaArrowRight } from "react-icons/fa6";
import InstructorImage from "../../../assets/Images/Instructor.png";
import Button from "./Button";
import HighlightText from "./HighlightText";
const Instructor = () => {
  return (
    <div className="w-11/12 flex max-w-maxContent  gap-20 items-center  mx-auto my-10 ">
      {/* image */}
      <div className="lg:w-[50%]">
        <img
          src={InstructorImage}
          alt=""
          className="shadow-white shadow-[-20px_-20px_0_0]"
        />
      </div>
      {/* text */}
      <div className="lg:w-[50%] flex gap-8 flex-col">
        <h1 className="lg:w-[50%] text-4xl font-semibold">
          Become an
          <HighlightText text="Instructor" />
        </h1>
        <p className="font-medium text-base text-justify w-[90%] text-richblack-300">
          Instructors from around the world teach millions of students on
          MindMentor. We provide the tools and skills to teach what you love.
        </p>
        <div className="w-fit">
          <Button
            text={"Start Teaching Today"}
            active={true}
            icon={FaArrowRight}
          />
        </div>
      </div>
    </div>
  );
};

export default Instructor;
