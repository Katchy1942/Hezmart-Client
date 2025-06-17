import React from 'react'

import { CiSearch } from "react-icons/ci";



function SearchBar({width}) {

  return (
    <div className={` w-full flex`}>
      <form
        
        className="flex items-center justify-center space-x-2 w-full"
      >
        <div className="relative w-full  lg:w-1/2">
          <input
            type="text"
            placeholder="Search products, brands and categories"
            className="w-full px-4 py-2 pl-10 rounded-lg bg-white text-[#667085] border border-gray-400 
            focus:outline-0 focus:border-primary-light"
          />
          <CiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]"
            size={20}
          />
          
        </div>
        <button
          type="submit"
          className=" text-white hidden lg:block px-4 py-2 rounded-lg bg-primary-light"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar