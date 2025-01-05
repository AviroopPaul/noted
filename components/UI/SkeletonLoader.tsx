import React from "react";

export const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      {/* Folder skeletons */}
      {[1, 2].map((i) => (
        <div key={`folder-${i}`} className="border-b border-base-300">
          <div className="flex items-center px-4 py-2">
            <div className="w-4 h-4 bg-base-300 rounded mr-2"></div>
            <div className="w-4 h-4 bg-base-300 rounded mr-2"></div>
            <div className="h-4 bg-base-300 rounded w-24"></div>
          </div>
          {/* Nested page skeletons */}
          {[1, 2].map((j) => (
            <div key={`folder-${i}-page-${j}`} className="ml-8 px-4 py-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-base-300 rounded mr-2"></div>
                <div className="h-4 bg-base-300 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Root level page skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={`page-${i}`} className="px-4 py-2 border-b border-base-300">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-base-300 rounded mr-2"></div>
            <div className="h-4 bg-base-300 rounded w-32"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
