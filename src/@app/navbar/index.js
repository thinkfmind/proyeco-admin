import {
  SearchIcon,
  MenuAlt3Icon,
  MenuIcon,
  ExclamationIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import { logout } from "../../redux/ducks/user";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
import ProfileImage from "../../assets/img/profile.png";
import Admin from "./components/admin";
import Organization from "./components/organization";
import Gerente from "./components/gerente";

const Navbar = ({ title, subtitle, searchValue = "", handleClickSearch }) => {
  const userSelector = useSelector((store) => store.user);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const path = location.pathname;

  const openMenu = () => setIsOpen(!isOpen);

  const onLogout = () => {
    dispatch(logout(history));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (history.location.pathname === "/search") {
        handleClickSearch(e.currentTarget.value);
      } else {
        localStorage.setItem("search", e.currentTarget.value);
        history.push("/search");
      }
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="flex items-center justify-between h-full px-20 pt-8 pb-3 vp-desktop">
        <div className="w-44 font-objetive-bold">
          <h1>{title}</h1>
          <h2 className="text-sm font-objetive-regular">{subtitle}</h2>
        </div>
        <div className="relative rounded-full shadow-sm w-72">
          <input
            type="text"
            name="account_number"
            id="account_number"
            className="block w-full pt-4 pb-3 pr-6 text-sm border-gray-300 rounded-full focus:ring-gray-400 focus:border-gray-300 pl-14 font-objetive-regular"
            placeholder="Buscar equipos"
            onKeyPress={handleKeyPress}
            defaultValue={searchValue}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </div>
        </div>
        <div className="flex">
          {userSelector.user.role === "Admin" ? (
            <Link to="/equipment">
              <button
                type="button"
                className="inline-flex items-center px-8 py-4 text-sm font-medium text-white border border-transparent rounded-full shadow-sm bg-app-btn-dark focus:outline-none"
              >
                <span className="pt-1 font-objetive-bold">Equipos</span>
              </button>
            </Link>
          ) : null}

          {userSelector.user.role === "Empresa" ? (
            <Link to="/equipment/activity/empresa/create">
              <button
                type="button"
                className="inline-flex items-center px-8 py-4 text-sm font-medium text-white border border-transparent rounded-full shadow-sm bg-app-btn-dark focus:outline-none"
              >
                <span className="pt-1 font-objetive-bold">Cargar reportes</span>
              </button>
            </Link>
          ) : null}

          <Link to="/alerts/create">
            {path === "/alerts/create" ? (
              <button
                type="button"
                className="inline-flex items-center px-8 py-4 ml-2 text-sm font-medium text-white bg-gray-100 border border-red-600 rounded-full shadow-sm focus:outline-none"
              >
                <ExclamationIcon
                  className="w-5 h-5 mr-2 text-red-600"
                  aria-hidden="true"
                />
                <span className="pt-1 text-red-600 font-objetive-bold">
                  Generar alerta
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center px-8 py-4 ml-2 text-sm font-medium text-white border border-transparent rounded-full shadow-sm bg-app-btn-gradient focus:outline-none"
              >
                <ExclamationIcon
                  className="w-5 h-5 mr-2 text-white"
                  aria-hidden="true"
                />
                <span className="pt-1 font-objetive-bold">Generar alerta</span>
              </button>
            )}
          </Link>
        </div>

        <div className="inline-flex items-center">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img src={ProfileImage} className="w-10 h-10" alt="profile" />
          </div>
          <div className="ml-5 mr-10">
            <span className="font-objetive-regular">Bienvenido,</span>
            <div className="-mt-6">
              <b className="font-objetive-medium">{userSelector.user.name}</b>
            </div>
          </div>
          <button onClick={openMenu}>
            {isOpen ? (
              <MenuIcon className="w-8 h-8 text-gray-900" aria-hidden="true" />
            ) : (
              <MenuAlt3Icon
                className="w-8 h-8 text-gray-900"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>
      {userSelector.user.role === "Admin" ? (
        <Admin isOpen={isOpen} path={path} onLogout={onLogout} />
      ) : null}
      {userSelector.user.role === "Empresa" ? (
        <Organization isOpen={isOpen} path={path} onLogout={onLogout} />
      ) : null}
      {userSelector.user.role === "Gerente" ? (
        <Gerente isOpen={isOpen} path={path} onLogout={onLogout} />
      ) : null}

      <div
        className={`w-full bg-gray-100 nav-b-rounded absolute ${
          path === "/home" ? "h-20" : "h-8"
        }`}
      />
    </div>
  );
};

export default Navbar;
