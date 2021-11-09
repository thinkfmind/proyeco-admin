import { ExclamationCircleIcon } from "@heroicons/react/solid";
const TextInput = ({
  placeholder,
  error,
  eventHandler,
  data,
  value,
  disabled,
  not,
  id,
}) => {
  return (
    <div>
      <div className="mt-1 relative rounded-full shadow-sm">
        <input
          disabled={disabled ? disabled : false}
          type="text"
          list={id}
          autoComplete="nope"
          defaultValue={value ? value : ""}
          className={`block w-full font-objetive-medium pt-4 pb-3 pl-6 pr-10 focus:outline-none sm:text-sm rounded-full ${
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
              : disabled
              ? "border-gray-300 text-gray-500 placeholder-gray-800 focus:ring-gray-300 focus:border-gray-300"
              : "border-gray-300 text-gray-900 placeholder-gray-800 focus:ring-gray-300 focus:border-gray-300"
          }`}
          placeholder={placeholder}
          aria-invalid="true"
          onChange={(e) => {
            eventHandler(e.target.value);
          }}
        />

        <datalist id={id} className="bg-red-600">
          {data.length > 0 ? (
            data.map((user) => {
              return (
                <option key={user.id} value={user.identificacion}>
                  {" "}
                  {user.name}{" "}
                </option>
              );
            })
          ) : (
            <option key={Math.floor(Math.random() * 10000)} value={not} />
          )}
        </datalist>

        {error ? (
          <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        ) : (
          ""
        )}
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

export default TextInput;
