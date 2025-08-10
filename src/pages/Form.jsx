import { motion } from 'framer-motion';
import CareerForm from "../components/CareerForm";

const Form = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            Discover Your Career Path
          </h1>
          <p className="text-lg text-gray-600">
            Answer a few questions to get personalized career recommendations
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <CareerForm />
        </div>
      </div>
    </motion.div>
  );
};

export default Form;