import * as React from "react"
import Svg, { SvgProps, Defs, Path, Mask, Rect, Use, G } from "react-native-svg";

export default function Logo(props: SvgProps) {
  return (
  <Svg
    width={172}
    height={142}
    fill="none"
    {...props}
  >
    <Defs>
      <Path
        id="a"
        d="M77.502 131.905c0-5.575 4.566-10.095 10.198-10.095 5.632 0 10.197 4.52 10.197 10.095C97.897 137.48 93.332 142 87.7 142c-5.632 0-10.198-4.52-10.198-10.095Z"
      />
    </Defs>
    <Mask id="c" width="717.8%" height="823.1%" x="-308.9%" y="-361.6%">
      <Rect
        width="717.8%"
        height="823.1%"
        x="-308.9%"
        y="-361.6%"
        fill="#fff"
      />
      <Use fill="#000" href="#a" />
    </Mask>
    <G filter="url(#b)" mask="url(#c)">
      <Use
        xlinkHref="#a"
        fill="#000"
        stroke="#000"
        strokeOpacity={0}
        strokeWidth={0}
        clipPath="url(#a1001z)"
      />
    </G>
    <Use xlinkHref="#a" fill="#FFF" clipPath="url(#a1001z)" />
    <Defs>
      <Path
        id="d"
        d="M36.032 77.73c0-4.646 3.804-8.412 8.498-8.412 4.693 0 8.498 3.766 8.498 8.412 0 4.646-3.805 8.412-8.498 8.412-4.694 0-8.498-3.766-8.498-8.412Z"
      />
    </Defs>
    <Mask id="f" width="841.3%" height="967.8%" x="-370.7%" y="-433.9%">
      <Rect
        width="841.3%"
        height="967.8%"
        x="-370.7%"
        y="-433.9%"
        fill="#fff"
      />
      <Use fill="#000" href="#d" />
    </Mask>
    <G filter="url(#e)" mask="url(#f)">
      <Use
        xlinkHref="#d"
        fill="#000"
        stroke="#000"
        strokeOpacity={0}
        strokeWidth={0}
        clipPath="url(#a1009z)"
      />
    </G>
    <Use xlinkHref="#d" fill="#FFF" clipPath="url(#a1009z)" />
    <Defs>
      <Path
        id="g"
        d="M140.727 37.014c0-3.717 3.044-6.73 6.799-6.73 3.754 0 6.798 3.013 6.798 6.73 0 3.717-3.044 6.73-6.798 6.73-3.755 0-6.799-3.013-6.799-6.73Z"
      />
    </Defs>
    <Mask id="i" width="1026.7%" height="1184.7%" x="-463.3%" y="-542.4%">
      <Rect
        width="1026.7%"
        height="1184.7%"
        x="-463.3%"
        y="-542.4%"
        fill="#fff"
      />
      <Use fill="#000" href="#g" />
    </Mask>
    <G filter="url(#h)" mask="url(#i)">
      <Use
        xlinkHref="#g"
        fill="#000"
        stroke="#000"
        strokeOpacity={0}
        strokeWidth={0}
        clipPath="url(#a1017z)"
      />
    </G>
    <Use xlinkHref="#g" fill="#FFF" clipPath="url(#a1017z)" />
    <Defs>
      <Path
        id="j"
        d="M0 8.412c0-2.787 2.283-5.047 5.099-5.047 2.816 0 5.099 2.26 5.099 5.047 0 2.788-2.283 5.048-5.099 5.048C2.283 13.46 0 11.2 0 8.412Z"
      />
    </Defs>
    <Mask id="l" width="1335.6%" height="1546.3%" x="-617.8%" y="-723.1%">
      <Rect
        width="1335.6%"
        height="1546.3%"
        x="-617.8%"
        y="-723.1%"
        fill="#fff"
      />
      <Use fill="#000" href="#j" />
    </Mask>
    <G filter="url(#k)" mask="url(#l)">
      <Use
        xlinkHref="#j"
        fill="#000"
        stroke="#000"
        strokeOpacity={0}
        strokeWidth={0}
        clipPath="url(#a1025z)"
      />
    </G>
    <Use xlinkHref="#j" fill="#FFF" clipPath="url(#a1025z)" />
    <Defs>
      <Path
        id="m"
        d="M53.028 8.412c0-2.787 2.282-5.047 5.098-5.047s5.099 2.26 5.099 5.047c0 2.788-2.283 5.048-5.099 5.048-2.816 0-5.098-2.26-5.098-5.048Z"
      />
    </Defs>
    <Mask id="o" width="1335.6%" height="1546.3%" x="-617.8%" y="-723.1%">
      <Rect
        width="1335.6%"
        height="1546.3%"
        x="-617.8%"
        y="-723.1%"
        fill="#fff"
      />
      <Use fill="#000" href="#m" />
    </Mask>
    <G filter="url(#n)" mask="url(#o)">
      <Use
        xlinkHref="#m"
        fill="#000"
        stroke="#000"
        strokeOpacity={0}
        strokeWidth={0}
        clipPath="url(#a1033z)"
      />
    </G>
    <Use xlinkHref="#m" fill="#FFF" clipPath="url(#a1033z)" />
    <Defs>
      <Path
        id="p"
        d="M117.613 8.412c0-2.787 2.282-5.047 5.098-5.047s5.099 2.26 5.099 5.047c0 2.788-2.283 5.048-5.099 5.048-2.816 0-5.098-2.26-5.098-5.048Z"
      />
    </Defs>
    <Mask id="r" width="1335.6%" height="1546.3%" x="-617.8%" y="-723.1%">
      <Rect
        width="1335.6%"
        height="1546.3%"
        x="-617.8%"
        y="-723.1%"
        fill="#fff"
      />
      <Use fill="#000" href="#p" />
    </Mask>
    <G filter="url(#q)" mask="url(#r)">
      <Use
        xlinkHref="#p"
        fill="#000"
        stroke="#000"
        strokeOpacity={0}
        strokeWidth={0}
        clipPath="url(#a1041z)"
      />
    </G>
    <Use xlinkHref="#p" fill="#FFF" clipPath="url(#a1041z)" />
    <Defs>
      <Path
        id="s"
        d="M172 5.047c0 2.788-2.283 5.048-5.099 5.048-2.816 0-5.099-2.26-5.099-5.048 0-2.787 2.283-5.047 5.099-5.047C169.717 0 172 2.26 172 5.047Z"
      />
    </Defs>
    <Mask id="u" width="1335.6%" height="1546.3%" x="-617.8%" y="-723.1%">
      <Rect
        width="1335.6%"
        height="1546.3%"
        x="-617.8%"
        y="-723.1%"
        fill="#fff"
      />
      <Use fill="#000" href="#s" />
    </Mask>
    <G filter="url(#t)" mask="url(#u)">
      <Use
        xlinkHref="#s"
        fill="#000"
        stroke="#000"
        strokeOpacity={0}
        strokeWidth={0}
        clipPath="url(#a1049z)"
      />
    </G>
    <Use xlinkHref="#s" fill="#FFF" clipPath="url(#a1049z)" />
    <Defs>
      <Path
        id="v"
        d="M15.636 37.014c0-3.717 3.044-6.73 6.799-6.73 3.754 0 6.798 3.013 6.798 6.73 0 3.717-3.044 6.73-6.798 6.73-3.755 0-6.799-3.013-6.799-6.73Z"
      />
    </Defs>
    <Mask id="x" width="1026.7%" height="1184.7%" x="-463.3%" y="-542.4%">
      <Rect
        width="1026.7%"
        height="1184.7%"
        x="-463.3%"
        y="-542.4%"
        fill="#fff"
      />
      <Use fill="#000" href="#v" />
    </Mask>
    <G filter="url(#w)" mask="url(#x)">
      <Use
        xlinkHref="#v"
        fill="#000"
        stroke="#000"
        strokeOpacity={0}
        strokeWidth={0}
        clipPath="url(#a1057z)"
      />
    </G>
    <Use xlinkHref="#v" fill="#FFF" clipPath="url(#a1057z)" />
    <Defs>
      <Path
        id="y"
        d="M78.862 91.19c0-4.646 3.804-8.413 8.498-8.413 4.693 0 8.498 3.767 8.498 8.413 0 4.646-3.805 8.412-8.498 8.412-4.694 0-8.498-3.766-8.498-8.412Z"
      />
    </Defs>
    <Mask id="A" width="841.3%" height="967.8%" x="-370.7%" y="-433.9%">
      <Rect
        width="841.3%"
        height="967.8%"
        x="-370.7%"
        y="-433.9%"
        fill="#fff"
      />
      <Use fill="#000" href="#y" />
    </Mask>
    <G filter="url(#z)" mask="url(#A)">
      <Use
        xlinkHref="#y"
        fill="#000"
        stroke="#000"
        strokeOpacity={0}
        strokeWidth={0}
        clipPath="url(#a1065z)"
      />
    </G>
    <Use xlinkHref="#y" fill="#FFF" clipPath="url(#a1065z)" />
    <Defs>
      <Path
        id="B"
        d="M6.119 11.104C20.259 32.64 37.618 62.027 44.53 74.028m0 0 36.608 49.867c2.822 3.842 8.67 3.66 11.241-.352l54.807-85.519L166.561 6.73M44.53 74.028l42.49 16.825M56.427 6.73 87.02 90.853m0 0L123.731 6.73"
      />
    </Defs>
    <Mask id="D" width="197.3%" height="246.2%" x="-49.1%" y="-73.7%">
      <Rect width="197.3%" height="246.2%" x="-49.1%" y="-73.7%" fill="#fff" />
      <Use fill="#000" fillOpacity={0} href="#B" />
    </Mask>
    <G filter="url(#C)" mask="url(#D)">
      <Use
        xlinkHref="#B"
        fill="#000"
        fillOpacity={0}
        stroke="#000"
        strokeMiterlimit={10}
        strokeWidth={3}
        clipPath="url(#a1073z)"
      />
    </G>
    <Use
      xlinkHref="#B"
      fill="transparent"
      stroke="#FFF"
      strokeMiterlimit={10}
      strokeWidth={3}
      clipPath="url(#a1073z)"
    />
  </Svg>
  );
}
