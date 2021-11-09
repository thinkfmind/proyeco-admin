import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

const PasswordInput = ({ placeholder, error, eventHandler, hide, setHide, value }) => {
  return (
    <div className="w-full pl-4">
      <div className="mt-1 relative rounded-full shadow-sm">
        <input
          type={`${hide ? "password" : "text"}`}
          name="password"
          id="name"
          value={value}
          className={`block w-full font-objetive-medium pt-4 pb-3 pl-6 pr-10 focus:outline-none sm:text-sm rounded-full ${
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 text-gray-900 placeholder-gray-800 focus:ring-gray-300 focus:border-gray-300"
          }`}
          placeholder={placeholder}
          aria-invalid="true"
          onChange={(e) => eventHandler(e.target.value)}
        />

        <div className="absolute z-50 inset-y-0 right-0 pr-5 flex items-center">
          {hide ? (
            <EyeIcon
              className={`h-5 w-5 cursor-pointer ${
                error ? "text-red-500" : "text-gray-500"
              }`}
              onClick={() => {
                setHide(false);
              }}
              aria-hidden="true"
            />
          ) : (
            <EyeOffIcon
              className={`h-5 w-5 cursor-pointer ${
                error ? "text-red-500" : "text-gray-500"
              }`}
              onClick={() => {
                setHide(true);
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
      {/* {error ? (
        <p
          className="mt-3 font-objetive-medium pl-4 text-sm text-red-600"
          id="email-error"
        >
          {error}
        </p>
      ) : (
        ""
      )} */}
    </div>
  );
};

export default PasswordInput;
