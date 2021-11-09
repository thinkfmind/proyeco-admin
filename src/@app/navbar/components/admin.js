import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { NavbarOpen, MenuItemAnimation } from "../../../helpers/vartiants";

const Admin = ({ isOpen, path, onLogout }) => {
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
          variants={MenuItemAnimation(0.3)}
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
          variants={MenuItemAnimation(0.25)}
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
          variants={MenuItemAnimation(0.2)}
        >
          <Link
            to="/equipment/list"
            className={`${
              path === "/equipment/list"
                ? "font-objetive-bold "
                : "font-objetive-medium "
            }`}
          >
            Listado de equipos
          </Link>
        </motion.div>
        <motion.div
          initial="hidden"
          animate={`${isOpen ? "visible" : "hidden"}`}
          variants={MenuItemAnimation(0.15)}
        >
          <Link
            to="/users"
            className={`${
              path === "/users"
                ? "font-objetive-bold "
                : "font-objetive-medium "
            }`}
          >
            Administrar usuarios
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={`${isOpen ? "visible" : "hidden"}`}
          variants={MenuItemAnimation(0.1)}
        >
          <Link
            to="/trash"
            className={`${
              path === "/trash"
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
export default Admin;
