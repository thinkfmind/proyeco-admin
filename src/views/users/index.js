import { useEffect, useState, useCallback } from "react";
import Navbar from "../../@app/navbar";
import { ChevronLeftIcon, TrashIcon } from "@heroicons/react/outline";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import TextInput from "../../components/form/textInput";
import PasswordInput from "../../components/form/passwordInput";
import ItemSelector from "../../components/form/itemSelector";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Table from "../../components/users/table";
import { useDropzone } from "react-dropzone";
import { logout } from "../../redux/ducks/user";
import { CameraIcon } from "@heroicons/react/outline";
import Swal from "sweetalert2";
import Alert from "../../components/alert";
import { backendUrl, s3BucketUrl } from "../../config";

const Users = () => {
  const userSelector = useSelector((store) => store.user);
  const [data, setData] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [hide, setHide] = useState(true);
  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [editable, setEditable] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [img, setImg] = useState("");
  const [file, setFile] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFile([...file, ...acceptedFiles]);
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/jpeg, image/png",
  });

  const dispatch = useDispatch();
  const history = useHistory();

  const files = file.map((file) => <div key={file.path}>{file.path}</div>);

  const [userId, setUserId] = useState("");
  const handleEdit = (id, name, role, username, image) => {
    setEditable(true);
    setUserId(id);
    setName(name);
    setRole(role);
    setUsername(username);
    setImg(image);
  };

  const onChangeName = (value) => {
    setName(value);
    setNameError(false);
  };

  const onChangeUsername = (value) => {
    setUsername(value);
    setUsernameError(false);
  };

  const onChangeRole = (value) => {
    setRole(value);
  };

  const onChangePassword = (value) => {
    setPassword(value);
    setPasswordError(false);
  };

  const onSetHide = (value) => {
    setHide(value);
  };

  const successAlertHandler = () => {
    setSuccessAlert(true);
    setTimeout(() => {
      setSuccessAlert(false);
    }, 1500);
  };

  const alert = (id, tag) => {
    Swal.fire({
      title: "¿Eliminar de forma permanente?",
      showCancelButton: true,
      html: "Se eliminaran todos los datos asociados",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        container: "sw-container",
        title: "sw-title text-lg font-objetive-bold",
        confirmButton: "sw-confirm font-objetive-bold",
        cancelButton: "sw-cancel font-objetive-bold",
        htmlContainer: "sw-html font-objetive-medium",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(id, tag);
      }
    });
  };

  const deleteItem = async (id) => {
    const toastLoading = toast.loading("Eliminando...");
    try {
      await axios({
        method: "DELETE",
        url: `${backendUrl}/user/${id}`,
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      toast.dismiss(toastLoading);
      toast.success("Eliminado con éxito!");
      consult();
    } catch {
      toast.dismiss(toastLoading);
      toast.error("Error al eliminar!");
    }
  };

  const onSubmit = async () => {
    const toastLoading = toast.loading("Cargando...");
    let errName = false;
    let errUser = false;
    let errPass = false;

    if (name.length < 1) {
      setNameError(true);
      errName = true;
    }
    if (username.length < 1) {
      setUsernameError(true);
      errUser = true;
    }
    if (password.length < 8 && !editable) {
      setPasswordError(true);
      errPass = true;
    }

    if (password.length > 0 && editable) {
      if (password.length < 8) {
        setPasswordError(true);
        errPass = true;
      }
    }

    if (editable) {
      if (!errName && !errUser && !errPass) {
        try {
          const formData = new FormData();
          formData.append("name", name);
          formData.append("username", username);
          formData.append("password", password);
          formData.append("role", role);
          formData.append("image", file[0]);
          await axios({
            method: "PUT",
            url: `${backendUrl}/user/${userId}`,
            data: formData,
            headers: {
              Authorization: `Bearer ${userSelector.user.jwtToken}`,
              "Content-Type":
                "multipart/form-data boundary=" +
                Math.random().toString().substr(2),
            },
          });
          setName("");
          setPassword("");
          setUsername("");
          setUserId("");
          setRole("");
          setEditable(false);
          toast.dismiss(toastLoading);
          successAlertHandler();
          await consult();
        } catch {
          toast.dismiss(toastLoading);
          toast.error("Error al editar!");
        }
      } else {
        toast.dismiss(toastLoading);
        toast.error("Verifique que los datos sean correctos!");
      }
    } else {
      if (!errName && !errUser && !errPass) {
        try {
          const formData = new FormData();
          formData.append("name", name);
          formData.append("username", username);
          formData.append("password", password);
          formData.append("role", role);
          formData.append("image", file[0]);
          await axios({
            method: "POST",
            url: `${backendUrl}/user/register`,
            data: formData,
            headers: {
              Authorization: `Bearer ${userSelector.user.jwtToken}`,
              "Content-Type":
                "multipart/form-data boundary=" +
                Math.random().toString().substr(2),
            },
          });
          setName("");
          setPassword("");
          setUsername("");
          toast.dismiss(toastLoading);
          successAlertHandler();
          await consult();
        } catch {
          toast.dismiss(toastLoading);
          toast.error("Nombre de usuario duplicado!");
        }
      } else {
        toast.dismiss(toastLoading);
        toast.error("Verifique que los datos sean correctos!");
      }
    }
  };

  const deleteImg = () => {
    setImg("");
    if (files.length > 0) {
      setFile([]);
    }
  };

  const consult = async () => {
    const toastLoading = toast.loading("Cargando...");
    try {
      const res = await axios.get(`${backendUrl}/user/`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      setData(res.data);
      toast.dismiss(toastLoading);
    } catch (error) {
      toast.dismiss(toastLoading);
      toast.error("Error al conectarse al servidor!");
      if (error.response.status === 401) {
        dispatch(logout(history));
      }
    }
  };

  useEffect(() => {
    consult();
  }, []);

  const roleData = [
    { id: "Admin", name: "Administrador" },
    { id: "Empresa", name: "Empresa de mantenimiento" },
    { id: "Gerente", name: "Gerente" },
  ];

  if (userSelector.user.role !== "Admin") {
    return <Redirect to="/home" />;
  } else {
    return (
      <>
        {successAlert ? <Alert text="Usuario guardado" /> : null}
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar title="Administrar Usuarios" />
        <div className="relative justify-center px-20 vp-desktop">
          <div className="flex mt-14">
            <Link to="/home">
              <ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-700" />
            </Link>
            <Link className="font-objetive-medium" to="/home">
              Volver
            </Link>
          </div>
          <div className="w-full px-10 pt-10 pb-24 mt-6 bg-gray-100 rounded-3xl">
            <h1 className="mb-6 text-lg font-objetive-bold">
              {editable ? "Editar usuario" : "Cargar nuevo usuario"}
            </h1>
            <TextInput
              placeholder="Nombre"
              eventHandler={onChangeName}
              error={nameError}
              value={name}
            />

            <div className="flex mt-8">
              <div className="w-full pr-4">
                <TextInput
                  placeholder="Usuario"
                  eventHandler={onChangeUsername}
                  error={usernameError}
                  value={username}
                />
              </div>
              <div className="w-full pl-4">
                <PasswordInput
                  placeholder="Contraseña"
                  eventHandler={onChangePassword}
                  error={passwordError}
                  hide={hide}
                  setHide={onSetHide}
                  value={password}
                />
                <div className="pl-8 mt-4 text-sm text-left font-objetive-regular">
                  Debe tener al menos 8 caracteres
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="w-full pr-4">
                <div className="font-objetive-medium">Imagen de empresa</div>
                <div className="mb-4 font-objetive-regular">
                  Formatos aceptados JPEG, JPG, PNG en 72 dpi.
                </div>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <div className="flex items-center mr-10 cursor-pointer">
                    {img ? (
                      <div className="mr-6 bg-gray-100 rounded-xl">
                        <img
                          src={img}
                          alt="Imagen"
                          className="object-contain w-20 h-20 rounded-xl"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-20 h-20 mr-6 align-middle bg-gray-300 rounded-xl">
                        <CameraIcon className="z-10 w-10 h-10 text-gray-700" />
                      </div>
                    )}

                    <div>
                      <h3 className="underline font-objetive-bold text-app-violet-300">
                        Seleccionar imágen
                      </h3>
                      <h4 className="text-sm text-gray-700 font-objetive-regular w-52">
                        {files.length > 0
                          ? files
                          : img
                          ? img.replace(`${s3BucketUrl}/empresas/`, "")
                          : "No se selecciono imagen"}
                      </h4>
                    </div>
                  </div>
                </div>
                {files.length > 0 || img ? (
                  <div
                    onClick={deleteImg}
                    className="flex items-center justify-center w-20 h-5 mt-2 bg-red-600 cursor-pointer rounded-xl"
                  >
                    <TrashIcon className="w-4 h-4 text-white" />
                  </div>
                ) : null}
              </div>

              <div className="w-full pl-10 mt-8">
                <div className="pl-4 mb-4 font-objetive-medium">
                  Tipo de usuario
                </div>
                <ItemSelector
                  eventHandler={onChangeRole}
                  data={roleData}
                  value={role}
                  text="Tipo"
                  error={roleError}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onSubmit}
              className="absolute inline-flex items-center px-4 pt-4 pb-3 text-base text-white border border-transparent rounded-full shadow-sm bottom--20 right-32 font-objetive-medium bg-app-purple-btn hover:bg-red-500 focus:outline-none "
            >
              {editable ? "Editar usuario" : "Guardar usuario"}
            </button>
          </div>
        </div>
        <Table data={data} handleEdit={handleEdit} alert={alert} />
      </>
    );
  }
};

export default Users;
