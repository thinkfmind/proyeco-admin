import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { NavbarOpen, MenuItemAnimation } from "../../../helpers/vartiants";

const Organization = ({ isOpen, path, onLogout }) => {
  return (
    <motion.div
      initial="hidden"
      animate={`${isOpen ? "visible" : "hidden"}`}
      variants={NavbarOpen}
    >
      <div className="flex items-center content-center justify-between h-full px-20 vp-desktop">
        <motion.div
          initial="hidden"
          animate={`${isOpen ? "visible" : "hidden"}`}
          variants={MenuItemAnimation(0.25)}
        >
          <Link
            to="/home"
            className={`${
              path === "/home" ? "font-objetive-bold " : "font-objetive-medium "
            }`}
          >
            Sistema de monitoreo y control
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={`${isOpen ? "visible" : "hidden"}`}
          variants={MenuItemAnimation(0.2)}
        >
          <Link
            to="/equipmentalt"
            className={`${
              path === "/equipmentalt"
                ? "font-objetive-bold "
                : "font-objetive-medium "
            }`}
          >
            Equipos y disponibilidad
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={`${isOpen ? "visible" : "hidden"}`}
          variants={MenuItemAnimation(0.15)}
        >
          <Link
            to="/alerts"
            className={`${
              path === "/alerts"
                ? "font-objetive-bold "
                : "font-objetive-medium "
            }`}
          >
            Historial de alertas
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={`${isOpen ? "visible" : "hidden"}`}
          variants={MenuItemAnimation(0.1)}
        >
          <Link
            to="/etrash"
            className={`${
              path === "/etrash"
                ? "font-objetive-bold "
                : "font-objetive-medium "
            }`}
          >
            Papelera
          </Link>
        </motion.div>
        <motion.div
          initial="hidden"
          animate={`${isOpen ? "visible" : "hidden"}`}
          variants={MenuItemAnimation(0.05)}
        >
          <button
            onClick={onLogout}
            className="text-red-500 font-objetive-medium"
          >
            Salir
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default Organization;
