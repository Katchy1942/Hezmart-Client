// components/common/DataTableFilters.js
import { FiSearch, FiPlus } from "react-icons/fi";
import Button from "./Button";
import { Link } from "react-router-dom";

const DataTableFilters = ({
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  filters = [],
  totalItems = 0,
  addButtonLink,
  addButtonText,
  searchPlaceholder = "Search...",
  className = "",
  extraButtons = null
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <form onSubmit={onSearchSubmit} className="relative lg:col-span-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </form>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap gap-4 items-center lg:col-span-2">
          {filters.map((filter, index) => (
            <div key={index} className="flex-1 min-w-[150px]">
              {filter.type === 'select' ? (
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  value={filter.value}
                  onChange={filter.onChange}
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : filter.type === 'input' ? (
                <input
                  type={filter.inputType || 'text'}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  value={filter.value}
                  onChange={filter.onChange}
                  placeholder={filter.placeholder}
                />
              ) : filter.type === 'date-range' ? (
                <div className="hidden gap-2">
                  <input
                    type="date"
                    value={filter.startDate || ''}
                    onChange={filter.onStartDateChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={filter.endDate || ''}
                    onChange={filter.onEndDateChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    placeholder="End date"
                  />
                  {filter.onApply && (
                    <button
                      type="button"
                      onClick={filter.onApply}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  )}
                  {filter.onClear && (
                    <button
                      type="button"
                      onClick={filter.onClear}
                      className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-400"
                    >
                      Clear
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Results, Extra Buttons and Add Button */}
        <div className="flex items-center justify-end gap-4 lg:col-span-1">
          <span className="text-sm text-gray-600 hidden md:block">
            {totalItems} items
          </span>
          
          {/* Extra Buttons */}
          {extraButtons && (
            <div className="flex gap-2">
              {extraButtons}
            </div>
          )}
          
          {/* Add Button */}
          {addButtonLink && (
            <Link to={addButtonLink} className="w-full md:w-auto">
              <Button className="flex items-center gap-2 w-full px-3">
                <FiPlus /> {addButtonText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableFilters;