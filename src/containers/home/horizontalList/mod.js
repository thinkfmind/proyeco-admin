import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollAnimation } from "../../../helpers/vartiants";

const HorizontalList = (props) => {
  const [scrollOnViewport, setScrollOnViewport] = useState(false);
  const [hide, setHide] = useState(false);
  const scrolx = useRef(null);

  const scrolls = (e) => {
    if (e.x) {
      setScrollOnViewport(!scrollOnViewport);
    }
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
        onClick={() => {
          if (props.role !== "Empresa") {
            props.handler(false);
          }
        }}
        initial="hidden"
        animate={`${!hide ? "visible" : "hidden"}`}
        variants={ScrollAnimation}
        className={`absolute z-10 cursor-pointer flex  pt-4 pb-3 font-objetive-regular px-10 left-28 top-8 rounded-full justify-center items-center ${
           props.select !== 'ALL'
            ? "bg-app-purple-200 text-app-purple-300"
            : "bg-app-purple-300 text-app-purple-200"
        }`}
      >
        Todas
      </motion.div>

      <OverlayScrollbarsComponent
        className={`overlay-scrollbar mt-4 bg-app-purple-100 rounded-3xl pt-9 ${
          scrollOnViewport ? "pb-16 pl-20" : "pb-9 pl-20"
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
