import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollAnimation } from "../../../helpers/vartiants";
import Rail from "../../../assets/img/rail.svg";
import Escalator from "../../../assets/img/escalator.svg";
import Station from "../../../assets/img/station.svg";

const HorizontalList = (props) => {
  const [scrollOnViewport, setScrollOnViewport] = useState(false);
  const [hide, setHide] = useState(false);
  const scrolx = useRef(null);

  const scrolls = (e) => {
    // if (e.x) {
    //   setScrollOnViewport(!scrollOnViewport);
    // }
  };

  const getScroll = () => {
    if (scrolx.current.osInstance().scroll().position.x > 15) {
      setHide(true);
    } else {
      setHide(false);
    }
  };

  return (
    <div className="relative pr-20 vp-desktop pl-44">
      <motion.div
        initial="hidden"
        animate={`${!hide ? "visible" : "hidden"}`}
        variants={ScrollAnimation}
        className={`absolute z-10 cursor-pointer flex ${
          props.theme === "violet"
            ? "bg-app-purple-200 text-app-purple-300"
            : ""
        } ${
          props.theme === "yellow" ? "bg-app-yellow-5  text-app-yellow-4" : ""
        } ${props.theme === "red" ? "bg-app-red-2  text-app-yellow-4" : ""} ${
          props.theme === "green" ? "bg-app-green-3  text-app-yellow-4" : ""
        } pt-4 pb-3 font-objetive-regular px-10 left-28 top-8 rounded-full justify-center items-center`}
      >
        {props.theme === "violet" ? "Todas" : ""}
        {props.theme === "yellow" ? (
          <>
            Líneas
            <img src={Rail} alt="Rail" className="w-6 h-6 ml-3"></img>
          </>
        ) : (
          ""
        )}
        {props.theme === "red" ? (
          <>
            Estaciones
            <img src={Station} alt="Station" className="w-6 h-6 ml-3"></img>
          </>
        ) : (
          ""
        )}
        {props.theme === "green" ? (
          <>
            Equipos
            <img src={Escalator} alt="Escalator" className="w-6 h-6 ml-2"></img>
          </>
        ) : (
          ""
        )}
      </motion.div>

      <OverlayScrollbarsComponent
        className={`overlay-scrollbar mt-4 ${
          props.theme === "violet" ? "bg-app-purple-100" : ""
        } ${props.theme === "yellow" ? "bg-app-yellow-4" : ""}
        ${props.theme === "red" ? "bg-app-red-1" : ""} 
        ${props.theme === "green" ? "bg-app-green-1" : ""} rounded-3xl pt-9 ${
          scrollOnViewport
            ? `pb-16 ${props.theme === "violet" ? "pl-20" : ""} ${
                props.theme === "yellow" ? "pl-32" : ""
              } ${props.theme === "red" ? "pl-44" : ""} ${
                props.theme === "green" ? "pl-32" : ""
              }`
            : `pb-9 ${props.theme === "violet" ? "pl-20" : ""} ${
                props.theme === "yellow" ? "pl-32" : ""
              } ${props.theme === "red" ? "pl-44" : ""} ${
                props.theme === "green" ? "pl-32" : ""
              }`
        }`}
        ref={scrolx}
        options={{
          callbacks: {
            onOverflowChanged: scrolls,
            onScroll: () => {
              getScroll();
            },
          },
        }}
      >
        <div className="flex whitespace-nowrap">
          {props.children}
          <div className="p-1" />
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
};

export default HorizontalList;
