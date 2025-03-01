const LoadingSpinner = () => {
    return (
      <div className="flex justify-center items-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Searching for information...</span>
      </div>
    );
  };
  
  export default LoadingSpinner;