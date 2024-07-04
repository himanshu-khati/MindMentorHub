import Button from "./Button";
import HighlightText from "./HighlightText";

const OurValues = () => {
  return (
    <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
      <div className="mb-10 mt--24 flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0 ">
        <div className="text-4xl font-semibold lg:w-[45%] ">
          Get the skills you need for a{" "}
          <HighlightText text={"job that is in demand."} />
        </div>
        <div className="flex flex-col items-start gap-10 lg:w-[40%]">
          <div className="text-base">
            The modern StudyNotion is the dictates its own terms. Today, to be a
            competitive specialist requires more than professional skills.
          </div>
          <Button text={"Learn More"} active={true} link={"/signup"} />
        </div>
      </div>
    </div>
  );
};

export default OurValues;
