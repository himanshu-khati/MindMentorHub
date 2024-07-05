import { useState } from "react";
import HighlightText from "./HighlightText";
import { TAB_NAME, HOME_PAGE_EXPLORE } from "../../../utils/constants";
import CourseCard from "./CourseCard";

const ExploreCourses = () => {
  const [currentTab, setCurrentTab] = useState(TAB_NAME[0]);
  const [courses, setCourses] = useState(HOME_PAGE_EXPLORE[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HOME_PAGE_EXPLORE[0].courses[0].heading
  );
  const handleTabChange = (tabName) => {
    setCurrentTab(tabName);
    const result = HOME_PAGE_EXPLORE.filter((course) => course.tag === tabName);
    if (result.length > 0) {
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading);
    } else {
      setCourses([]);
      setCurrentCard("");
    }
  };

  return (
    <div>
      <div>
        <div className="text-4xl font-semibold my-10 text-center">
          Unlock the
          <HighlightText text={"Power of Code"} />
          <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
            {" "}
            Learn to Build Anything You Can Imagine
          </p>
        </div>
      </div>
      {/* tabs */}
      <div className="hidden  lg:flex gap-5 my-5 w-full mx-auto  bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] ">
        {TAB_NAME.map((tabName) => {
          return (
            <div
              key={tabName}
              className={` text-[16px] flex flex-    items-center gap-2 ${
                currentTab === tabName
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
              onClick={() => handleTabChange(tabName)}
            >
              {tabName}
            </div>
          );
        })}
      </div>
      <div className="hidden lg:block lg:h-[200px]"></div>
      {/* Card Group */}
      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((courseData) => {
          console.log("heading->", courseData.heading);
          return (
            <CourseCard
              key={courseData.heading}
              cardData={courseData}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExploreCourses;
