import Button from "./Button";
import { FaArrowRight } from "react-icons/fa6";
const ExploreCourses = () => {
  return (
    <div className="homepage_bg h-80">
      <div className="w-11/12 max-w-maxContent flex flex-col justify-between items-center gap-5 mx-auto">
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

export default ExploreCourses;
