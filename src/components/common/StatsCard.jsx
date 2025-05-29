const StatsCard = ({ title, value, secondaryValue, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
           <p className="text-2xl font-bold mt-1 text-black">{value}</p>
        </div>
        {icon && <div className="text-primary-light">{icon}</div>}
      </div>
      {secondaryValue && (
        <p className="text-green-500 text-sm mt-2">{secondaryValue}</p>
      )}
    </div>
  );
};

export default StatsCard;