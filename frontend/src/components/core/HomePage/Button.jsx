import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const Button = ({ text, active, link, icon: Icon }) => {
  return (
    <Link to={link}>
      <div
        className={`text-center flex items-center gap-2 text-[13px] sm:text-[16px] px-6 py-3 rounded-md font-bold   ${
          active ? "bg-yellow-50 text-black " : "bg-richblack-800"
        } hover:shadow-none hover:scale-95 transition-all duration-200 `}
      >
        {text}
        {Icon && <Icon />}
      </div>
    </Link>
  );
};
Button.propTypes = {
  text: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  link: PropTypes.string,
  icon: PropTypes.elementType,
};
export default Button;
