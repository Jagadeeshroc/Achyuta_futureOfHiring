// src/components/MyNetwork/Pagination.jsx
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1 || !Number.isInteger(totalPages) || totalPages < 0) return null;
  
  return (
    <div className="flex justify-center items-center space-x-2 mt-5!">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2! rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-900! disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <FaAngleLeft />
      </button>
      
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-2! py-1 !m-1!  rounded-lg font-medium transition-all duration-200 ${
            currentPage === index + 1
              ? "bg-lime-400 text-white shadow-lg"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {index + 1}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2! rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-lime-400! disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default Pagination;