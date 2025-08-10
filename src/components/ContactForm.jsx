import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    // Replace with actual submission logic
    console.log(data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Message sent successfully!');
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">Get In Touch</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          {...register("name", { required: "Name is required" })}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500' : 'focus:ring-indigo-500'}`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          type="email"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'focus:ring-indigo-500'}`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
        <textarea
          rows={4}
          {...register("message", { required: "Message is required" })}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.message ? 'border-red-500' : 'focus:ring-indigo-500'}`}
        ></textarea>
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </motion.form>
  );
};

export default ContactForm;