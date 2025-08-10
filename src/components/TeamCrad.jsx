import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const TeamCard = ({ name, role, bio, avatar = null, socials = {}, loading = false }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (avatar) {
      const img = new Image();
      img.src = avatar;
      img.onload = () => setIsImageLoaded(true);
    }
  }, [avatar]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0 relative">
          {avatar ? (
            <>
              {!isImageLoaded && (
                <div className="absolute inset-0 h-16 w-16 rounded-full bg-gray-200 animate-pulse"></div>
              )}
              <img 
                src={avatar} 
                alt={name} 
                className={`h-16 w-16 rounded-full object-cover ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
              />
            </>
          ) : (
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {name.charAt(0)}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <p className="text-indigo-600 font-medium">{role}</p>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">{bio}</p>
      
      <div className="flex space-x-3">
        {socials.github && (
          <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition">
            <FiGithub className="h-5 w-5" />
          </a>
        )}
        {socials.linkedin && (
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition">
            <FiLinkedin className="h-5 w-5" />
          </a>
        )}
        {socials.twitter && (
          <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition">
            <FiTwitter className="h-5 w-5" />
          </a>
        )}
        {socials.email && (
          <a href={`mailto:${socials.email}`} className="text-gray-500 hover:text-indigo-600 transition">
            <FiMail className="h-5 w-5" />
          </a>
        )}
      </div>
    </motion.div>
  );
};
export default TeamCard;