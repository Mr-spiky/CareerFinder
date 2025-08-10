import { useState, useEffect } from 'react';
import TeamCard from '../components/TeamCrad';
import ContactForm from '../components/ContactForm';
import { motion } from 'framer-motion';

const About = () => {
  const [teamLoading, setTeamLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('story');

  useEffect(() => {
    const timer = setTimeout(() => setTeamLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            About CareerFinder
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Revolutionizing career guidance with AI and real-time data
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          {['story', 'team', 'contact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-16">
          {activeTab === 'story' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 gap-12"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    CareerFinder was born from a simple idea: career guidance should be personalized, data-driven, and accessible to everyone.
                  </p>
                  <p>
                    Our team of AI specialists, career coaches, and developers came together in 2023 to build a platform that goes beyond traditional career tests.
                  </p>
                  <p>
                    Using RedisAI's powerful real-time processing, we analyze your unique skills and interests against the latest job market trends to recommend careers with the highest potential for success and satisfaction.
                  </p>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                  <p className="text-gray-600">
                    Empower individuals to discover careers that align with their passions and market opportunities
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-2xl font-bold mb-6">Meet The Team</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teamLoading ? (
                  <>
                    <TeamCard loading />
                    <TeamCard loading />
                    <TeamCard loading />
                  </>
                ) : (
                  <>
                    <TeamCard 
                      name="Alex Johnson" 
                      role="AI Engineer" 
                      bio="Developed the career prediction algorithms using RedisAI"
                      socials={{ github: "https://github.com", linkedin: "https://linkedin.com" }}
                    />
                    <TeamCard 
                      name="Sam Lee" 
                      role="UX Designer" 
                      bio="Created the intuitive interface and user flows"
                      socials={{ linkedin: "https://linkedin.com", twitter: "https://twitter.com" }}
                    />
                    <TeamCard 
                      name="Taylor Smith" 
                      role="Data Scientist" 
                      bio="Curated career datasets and model training"
                      socials={{ github: "https://github.com", email: "taylor@example.com" }}
                    />
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
              <ContactForm />
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-2">Or reach us directly at:</p>
                <a href="mailto:mrspiky1125@gmail.com" className="text-indigo-600 font-medium hover:text-indigo-800">
                  hello@careerfinder.com
                </a>
              </div>
            </motion.div>
          )}
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Technology</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Redis AI",
                description: "Real-time career predictions with machine learning",
                icon: "🧠",
                color: "bg-purple-100 text-purple-800"
              },
              {
                title: "React + Vite",
                description: "Blazing fast frontend experience",
                icon: "⚡",
                color: "bg-blue-100 text-blue-800"
              },
              {
                title: "Tailwind CSS",
                description: "Beautiful, responsive designs",
                icon: "🎨",
                color: "bg-green-100 text-green-800"
              }
            ].map((tech, i) => (
              <div key={i} className={`p-6 rounded-xl ${tech.color} flex items-start space-x-4`}>
                <span className="text-3xl">{tech.icon}</span>
                <div>
                  <h3 className="text-lg font-bold">{tech.title}</h3>
                  <p>{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;