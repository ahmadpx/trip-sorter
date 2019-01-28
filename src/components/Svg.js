import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Component = styled.svg`
  user-select: none;
  pointer-events: none;
  flex: none;
  width: ${props => props.size};
  height: ${props => props.size};
`;

function SvgIcon({ color, titleAccess, viewBox, children, size, ...props }) {
  return (
    <Component
      focusable="false"
      color={color}
      fill="currentcolor"
      aria-hidden={titleAccess ? "false" : true}
      role={titleAccess ? "img" : "presentation"}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      size={size}
      width={size}
      height={size}
      {...props}
    >
      {children}
      {titleAccess ? <title>{titleAccess}</title> : null}
    </Component>
  );
}

SvgIcon.propTypes = {
  /**
   * from the theme colors
   */
  color: PropTypes.string.isRequired,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   */
  viewBox: PropTypes.string,
  /**
   * set width and height of svg
   */
  size: PropTypes.number
};

SvgIcon.defaultProps = {
  color: "inherit",
  viewBox: "0 0 24 24",
  size: 24
};

export default SvgIcon;
