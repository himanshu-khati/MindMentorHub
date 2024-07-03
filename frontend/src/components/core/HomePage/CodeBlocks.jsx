import Button from "./Button";
import { TypeAnimation } from "react-type-animation";
import PropTypes from "prop-types";
import { CODEBLOCKS_LINE } from "../../../utils/constants";
const CodeBlocks = ({
  position,
  heading,
  subHeading,
  btnValue,
  codeBlock,
  codeColor,
  backgroundGradient,
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>
      {/* section1 */}
      <div className="w-[50%] flex flex-col gap-8">
        {heading}
        <div className="text-richblack-300 font-bold">{subHeading}</div>
        <div className="flex gap-7">
          {btnValue.map((button) => (
            <Button
              key={button.text}
              text={button.text}
              active={button.active}
              link={button.link}
              icon={button.icon}
            />
          ))}
        </div>
      </div>

      {/* section 2 */}
      <div className="h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]">
        {backgroundGradient}
        <div className="text-center flex flex-col   w-[10%] select-none text-richblack-400 font-inter font-bold">
          {CODEBLOCKS_LINE.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {/* code */}
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}
        >
          <TypeAnimation
            sequence={[codeBlock, 1000, ""]}
            cursor={true}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;

CodeBlocks.propTypes = {
  position: PropTypes.string.isRequired,
  heading: PropTypes.elementType.isRequired,
  subHeading: PropTypes.string.isRequired,
  btnValue: PropTypes.array.isRequired,
  codeBlock: PropTypes.string.isRequired,
  codeColor: PropTypes.string.isRequired,
  backgroundGradient: PropTypes.string.isRequired,
};
