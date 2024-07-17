import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import HeroSection from "../components/core/HomePage/HeroSection";
import HighlightText from "../components/core/HomePage/HighlightText";
import VideoSection from "../components/core/HomePage/VideoSection";
import ExploreCourses from "../components/core/HomePage/ExploreCourses";
import ExploreCoursesCta from "../components/core/HomePage/ExploreCoursesCta";
import { FaArrowRight } from "react-icons/fa6";
import OurValues from "../components/core/HomePage/OurValues";
import Timeline from "../components/core/HomePage/Timeline";
import Learn from "../components/core/HomePage/Learn";
import Instructor from "../components/core/HomePage/Instructor";
import Reviews from "../components/core/HomePage/Reviews";
import Footer from "../components/common/Footer";

const Home = () => {
  return (
    <div>
      <div className="relative mx-auto flex flex-col gap-8 w-11/12 items-center text-white justify-between max-w-maxContent">
        <HeroSection />
        <VideoSection />
        <CodeBlocks
          position={"lg:flex-row"}
          heading={
            <div className="text-4xl font-semibold">
              Unlock your <HighlightText text={"coding potential"} /> with our
              online couses.
            </div>
          }
          subHeading="Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
          btnValue={[
            {
              text: "Try it Yourself",
              active: true,
              link: "/home",
              icon: FaArrowRight,
            },
            {
              text: "Learn More",
              active: false,
              link: "/home",
            },
          ]}
          codeBlock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
          backgroundGradient={<div className="codeblock1 absolute"></div>}
          codeColor={"text-yellow-25"}
        />
        <CodeBlocks
          position={"lg:flex-row-reverse"}
          heading={
            <div className=" text-4xl font-semibold ">
              Start <HighlightText text={"coding in seconds"} />
            </div>
          }
          subHeading={
            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
          }
          btnValue={[
            {
              text: "Continue Lesson",
              active: true,
              link: "/home",
              icon: FaArrowRight,
            },
            {
              text: "Learn More",
              active: false,
              link: "/home",
            },
          ]}
          codeBlock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
          backgroundGradient={<div className="codeblock2 absolute"></div>}
          codeColor={"text-white"}
        />
        <ExploreCourses />
      </div>

      <div className="bg-pure-greys-5 text-richblack-700">
        <ExploreCoursesCta />
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
          <OurValues />
          <Timeline />
          <Learn />
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <Instructor />
        <Reviews />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
