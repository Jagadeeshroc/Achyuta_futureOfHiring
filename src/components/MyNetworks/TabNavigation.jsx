import { FaUserFriends, FaUserCheck, FaClock, FaUserPlus } from "react-icons/fa";

const TabNavigation = ({ activeTab, setActiveTab, counts = {} }) => {
  const {
    connections = 0,
    recommended = 0,
    requests = 0,
    sent = 0,
  } = counts;

  const tabs = [
    { id: "connections", label: "Connections", count: connections, icon: FaUserFriends },
    { id: "recommended", label: "Recommended", count: recommended, icon: FaUserCheck },
    { id: "requests", label: "Requests", count: requests, icon: FaClock },
    { id: "sent", label: "Sent", count: sent, icon: FaUserPlus },
  ];

  return (
    <div className="w-full  rounded-lg! sm:px-4 md:px-6 p-2! m-2!">
      <div
        className="
          flex flex-wrap md:flex-nowrap 
          justify-center md:justify-between 
          gap-2 sm:gap-3 md:gap-4 
          bg-gray-100 rounded-2xl! p-1 sm:p-2 md:p-3 shadow-sm m-2
        "
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center justify-center
                flex-1 min-w-[45%] sm:min-w-[40%] md:min-w-0 p-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3
                rounded-xl! transition-all duration-300 ease-in-out
                text-sm sm:text-base md:text-lg font-medium
                ${isActive 
                  ? "bg-white text-blue-600 shadow-lg scale-105" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"}
              `}
            >
              <Icon className="text-base sm:text-lg md:text-xl m-1!" />
              <span className="ml-1 sm:ml-2">{tab.label}</span>
              <span
                className={`
                  ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold
                  ${isActive ? "bg-blue-100 text-blue-700 m-2!" : "bg-gray-200 text-red-700 m-1"}
                `}
              >
                {tab.count}
              </span>

              {/* Active underline animation */}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-blue-600 rounded-full animate-[slideIn_0.3s_ease]"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
