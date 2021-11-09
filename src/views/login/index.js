import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { login } from "../../redux/ducks/user";
import Logo from "../../assets/img/logo.png";

const Login = () => {
  const dispatch = useDispatch();
  const userSelector = useSelector((store) => store.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const history = useHistory();

  const onLogin = () => {
    if (username.length === 0) {
      toast.error("Verifique los datos ingresados!");
      setUsernameError(true);
      if (!password) {
        setPasswordError(true);
      }
    } else {
      if (password.length === 0) {
        toast.error("Verifique los datos ingresados!");
        setPasswordError(true);
        setUsernameError(false);
      } else {
        const toastLoading = toast.loading("Cargando...");
        dispatch(login({ username, password }, history)).then((res) => {
          if (res.message === "success") {
            toast.dismiss(toastLoading);
          } else {
            toast.dismiss(toastLoading);
            toast.error("Datos invalidos!");
          }
        });
      }
    }
  };

  if (userSelector.authenticated) {
    return <Redirect to="/home" />;
  } else {
    return (
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <div className="login-bg">
          <div className="flex items-center justify-center content-center w-full h-full vp-desktop">
            <div className="flex max-w-4xl mx-auto">
              <div className="login-bg-container rounded-l-3xl flex flex-auto flex-col justify-center px-16">
                <h1 className="text-white title-login font-objetive-bold">
                  Bienvenido/a
                </h1>
                <p className="text-white text-lg font-objetive-medium mt-8">
                  Ingresa con tus datos de <br />
                  acceso para empezar a utilizar <br />
                  tu sistema de monitoreo.
                </p>
              </div>
              <div className="flex flex-col h540 content-center items-center justify-center  bg-white px-12 w-3/5 rounded-r-3xl">
                <div className="mb-8">
                  <img src={Logo} alt="Logo" className=" m-auto" />
                </div>
         
                <div className="space-y-6 w-full">
                  <div>
                    <div className="mt-1">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        placeholder="Usuario"
                        autoComplete="usuario"
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setUsernameError(false);
                        }}
                        required
                        className={`appearance-none  font-objetive-regular  block w-full px-6 pt-4 pb-3 border  rounded-full shadow-sm  focus:outline-none focus:ring-app-violet-300 focus:border-app-violet-300 ${
                          usernameError
                            ? "border-red-300 text-red-900 placeholder-red-300 bg-red-100"
                            : " border-gray-300 text-app-blue-600 placeholder-gray-500 bg-gray-200"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mt-1">
                      <input
                        placeholder="Contraseña"
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError(false);
                        }}
                        id="password"
                        value={password}
                        name="password"
                        type="password"
                        autoComplete="password"
                        required
                        className={`appearance-none  font-objetive-regular  block w-full px-6 pt-4 pb-3 border  rounded-full shadow-sm  focus:outline-none focus:ring-app-violet-300 focus:border-app-violet-300 ${
                          passwordError
                            ? "border-red-300 text-red-900 placeholder-red-300 bg-red-100"
                            : " border-gray-300 text-app-blue-600 placeholder-gray-500 bg-gray-200"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
              
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={onLogin}
                      type="submit"
                      className="flex justify-center pb-3 pt-4 px-16 border border-transparent rounded-full shadow-sm text-sm font-objetive-medium text-white bg-app-violet-300 hover:bg-red-500  focus:outline-none"
                    >
                      Ingresar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Login;
