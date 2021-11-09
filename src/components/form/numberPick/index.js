const NumberPick = ({ eventHandler, value }) => {
  return (
    <div>
      <div className="mt-1 relative rounded-full shadow-sm">
        <input
          value={value}
          type="number"
          min={0}
          name="name"
          id="name"
          className="block w-full font-objetive-medium pt-4 pb-3 pl-6 pr-6 focus:outline-none sm:text-sm rounded-full border-gray-300 text-gray-900 placeholder-gray-800 focus:ring-gray-300 focus:border-gray-300"
          aria-invalid="true"
          onChange={(e) => {
            eventHandler(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default NumberPick;
