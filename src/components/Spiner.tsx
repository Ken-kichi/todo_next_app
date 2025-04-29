const Spiner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      <p className="text-gray-500 text-lg">Leading...</p>
    </div>
  );
};

export default Spiner;

