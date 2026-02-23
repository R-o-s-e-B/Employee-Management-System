import React from "react";

const SideNavBar = ({ onTabSelect }) => {
  const tabs = [
    "Departments",
    "Accounts",
    "Expenses",
    "Sales",
    "Products",
    "Settings",
  ];

  return (
    <React.Fragment>
      <div className="w-[16%] h-full flex flex-col bg-white p-4 text-black shadow-xl">
        <div className="py-6 border-b-2">
          <p>Logo and name</p>
        </div>
        <div className="flex flex-col">
          {tabs.map((tab, index) => (
            <div
              className="py-4 border-b-1 cursor-pointer"
              onClick={() => onTabSelect(tab)}
            >
              <p>{tab}</p>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default SideNavBar;
