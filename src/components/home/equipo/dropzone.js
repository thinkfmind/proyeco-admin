import { CameraIcon, TrashIcon } from "@heroicons/react/outline";
import { s3BucketUrl } from '../../../config'

const Dropzone = ({
  getRootProps,
  acceptedFiles,
  getInputProps,
  img,
  deleteImg,
}) => {
  const files = acceptedFiles.map((file) => (
    <div key={file.path}>{file.path}</div>
  ));

  return (
    <div className="w-full pr-4">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="flex items-center mr-10 cursor-pointer">
          {img ? (
            <div className="mr-6 bg-gray-100 rounded-xl w-20 h-20">
              <img
                src={img}
                alt="Imagen"
                className="object-cover w-20 h-20 rounded-xl"
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
            <h4 className="text-sm text-gray-700 font-objetive-regular w-52 overflow-hidden">
              {files.length > 0
                ? files
                : img
                ? img.replace(
                    `${s3BucketUrl}/equipos/`,
                    ""
                  )
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
  );
};

export default Dropzone;
