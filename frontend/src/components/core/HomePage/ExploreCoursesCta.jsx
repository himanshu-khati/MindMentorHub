import Button from "./Button";
import { FaArrowRight } from "react-icons/fa6";
const ExploreCoursesCta = () => {
  return (
    <div className="homepage_bg lg:h-80 h-36 ">
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
        <div className="lg:h-36"></div>
        <div className="flex gap-7 text-white lg:mt-8">
          <Button
            text={"Explore Full Catalog"}
            active={true}
            link={"/signup"}
            icon={FaArrowRight}
          />
          <Button text={"Learn More"} active={false} link={"/signup"} />
        </div>
      </div>
    </div>
  );
};

export default ExploreCoursesCta;
