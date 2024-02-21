// template to make the selector more clean (and add the feature that when the screen becomes smaller the dashboard and the actions are put in the same card)

import useState from 'react';

const PoolInfo = (params) => {
  const [showPoolData, setShowPoolData] = useState(true);
  const [activeTab, setActiveTab] = useState('poolData');

  const handleToggle = (data) => {
    setShowPoolData(true);
    setActiveTab(data);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'poolData':
        return (
          <div>
            {/* Your content for Pool Data */}
          </div>
        );
      case 'userData':
        return (
          <div>
            {/* Your content for User Data */}
          </div>
        );
      case 'dashboard':
        return (
          <div>
            {/* Your content for Dashboard */}
          </div>
        );
      case 'actions':
        return (
          <div>
            {/* Your content for Actions */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-start mt-4">
        {/* Toggle buttons for smaller screens */}
        <button
          className={`${
            showPoolData && activeTab === 'poolData'
              ? 'bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out'
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-100 hover:border-gray-200 transition duration-300 ease-in-out'
          } text-black font-medium rounded-l-lg py-2 px-auto flex justify-center shadow-sm w-28`}
          onClick={() => handleToggle('poolData')}
        >
          Pool data
        </button>
        <button
          className={`${
            showPoolData && activeTab === 'userData'
              ? 'bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out'
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-100 hover:border-gray-200 transition duration-300 ease-in-out'
          } text-black font-medium rounded-r-lg py-2 px-auto flex justify-center shadow-sm w-28`}
          onClick={() => handleToggle('userData')}
        >
          Your data
        </button>

        {/* Additional buttons for smaller screens */}
        <button
          className={`${
            !showPoolData && activeTab === 'dashboard'
              ? 'bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out'
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-100 hover:border-gray-200 transition duration-300 ease-in-out'
          } text-black font-medium rounded-r-lg py-2 px-auto flex justify-center shadow-sm w-28`}
          onClick={() => handleToggle('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`${
            !showPoolData && activeTab === 'actions'
              ? 'bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out'
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-100 hover:border-gray-200 transition duration-300 ease-in-out'
          } text-black font-medium rounded-r-lg py-2 px-auto flex justify-center shadow-sm w-28`}
          onClick={() => handleToggle('actions')}
        >
          Actions
        </button>
      </div>

      {/* Render content based on activeTab */}
      <div className="mt-6">
        {showPoolData && renderContent()}
      </div>
    </div>
  );
};
