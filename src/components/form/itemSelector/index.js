const ItemSelector = ({ eventHandler, data, value, text, disabled }) => {
  return (
    <select
      id="selector"
      name="selector"
      className="block w-full pl-6 pr-10 pt-4 pb-3 text-base font-objetive-medium border-gray-300 focus:outline-none focus:ring-gray-300 focus:border-gray-300 sm:text-sm rounded-full"
      onChange={(e) => eventHandler(e.target.value)}
      value={value}
      disabled={disabled ? true : false}
    >
      <option value="" disabled="disabled">
        {text}
      </option>
      {data.map((item) => {
        return (
          <option value={item.id} key={item.id}>
            {item.name}
          </option>
        );
      })}
    </select>
  );
};

export default ItemSelector;
