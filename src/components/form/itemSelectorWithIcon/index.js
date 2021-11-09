import { LocationMarkerIcon } from "@heroicons/react/outline";
const ItemSelectorWithIcon = ({
  id,
  data,
  eventHandler,
  text,
  value,
  disabled,
}) => {
  return (
    <div className="relative ">
      <div className="absolute flex items-center content-center h-full left-5">
        <LocationMarkerIcon className="w-5 h-5 mr-2 text-gray-700" />
      </div>
      <select
        disabled={disabled ? disabled : false}
        id={id}
        name={id}
        value={value}
        className="block w-full pt-4 pb-3 pr-10 mt-1 text-base border-gray-300 rounded-full pl-11 font-objetive-medium focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        onChange={(e) => {
          eventHandler(e.target.value);
        }}
      >
        <option value="" disabled="disabled">
          {text}
        </option>
        {data
          ? data.map((item, index) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              );
            })
          : null}
      </select>
    </div>
  );
};

export default ItemSelectorWithIcon;
