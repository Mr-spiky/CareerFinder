import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiTrendingUp, FiAward, FiUserCheck } from "react-icons/fi";

const Home = () => {
  // Mock career data for the cards
  const trendingCareers = [
    { id: 1, title: "Data Scientist", growth: "35%", avgSalary: "$120,000" },
    { id: 2, title: "UX Designer", growth: "28%", avgSalary: "$95,000" },
    { id: 3, title: "AI Specialist", growth: "42%", avgSalary: "$145,000" },
    { id: 4, title: "Cybersecurity", growth: "31%", avgSalary: "$110,000" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Your <span className="text-indigo-600">Dream Career</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Find the perfect career path based on your skills, interests, and market demand
            </p>

            <div className="max-w-xl mx-auto relative">
              <input
                type="text"
                placeholder="Search careers (e.g. 'Software Engineer')"
                className="w-full px-6 py-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="absolute right-2 top-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition">
                <FiSearch className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/form"  // Changed from "/result"
                className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium shadow-lg hover:bg-indigo-700 transition transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 bg-white text-indigo-600 rounded-full font-medium shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
              >
                How It Works
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating animated elements */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-16 h-16 bg-indigo-200 rounded-full opacity-20"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 right-10 w-24 h-24 bg-purple-200 rounded-full opacity-20"
        />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose CareerFinder?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with career expertise to guide your future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-indigo-50 p-8 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FiTrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Market Trends</h3>
              <p className="text-gray-600">
                Get real-time data on growing careers and industries to future-proof your choices.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-purple-50 p-8 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FiAward className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Matches</h3>
              <p className="text-gray-600">
                Our algorithm matches your unique skills and interests with ideal career paths.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FiUserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Success Roadmap</h3>
              <p className="text-gray-600">
                Step-by-step guidance on education and skills needed for your dream career.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Careers Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Hot Careers Right Now</h2>
            <p className="mt-4 text-lg text-gray-600">
              These in-demand careers are growing fast with excellent salaries
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingCareers.map((career) => (
              <motion.div
                key={career.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{career.title}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    +{career.growth}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">Average Salary: {career.avgSalary}</p>
                <button className="text-indigo-600 font-medium hover:text-indigo-800 transition">
                  Explore Path →
                </button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/form"  // Changed from "/result"
              className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-full font-medium shadow-lg hover:bg-indigo-700 transition"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Future?</h2>
          <p className="text-xl mb-10 opacity-90">
            Take our 5-minute assessment and discover careers perfectly matched to your potential
          </p>
          {/*  Final CTA Section */}
          <Link
            to="/form"  // Changed from "/result"
            className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition transform hover:scale-105"
          >
            Start Free Assessment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;