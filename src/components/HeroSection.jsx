const HeroSection = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <h2 className="text-4xl font-bold mb-4 text-blue-700">
        Find Your Ideal Career
      </h2>
      <p className="text-gray-600 max-w-xl mb-6">
        Discover career paths based on your interests and skills. Let AI guide you toward a fulfilling future.
      </p>
      <a href="/result" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
        Get Career Suggestions
      </a>
    </div>
  );
};

export default HeroSection;
