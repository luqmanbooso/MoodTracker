import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const ResourcesHub = ({ moods = [], customMoodCategories = [] }) => {
  const { theme, darkMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');

  // Create theme-aware styles
  const styles = {
    primaryText: darkMode ? 'text-emerald-500' : 'text-orange-500',
    secondaryText: darkMode ? 'text-gray-300' : 'text-gray-700',
    headingText: darkMode ? 'text-white' : 'text-gray-800',
    cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
    cardBorder: darkMode ? 'border-gray-700' : 'border-gray-200',
    linkColor: darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-orange-500 hover:text-orange-600',
    buttonPrimary: darkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600',
  };

  const categories = [
    { id: 'all', name: 'All Resources', icon: 'grid' },
    { id: 'articles', name: 'Articles', icon: 'document-text' },
    { id: 'videos', name: 'Videos', icon: 'film' },
    { id: 'meditation', name: 'Meditation', icon: 'sparkles' },
    { id: 'exercises', name: 'Exercises', icon: 'academic-cap' }
  ];

  const resources = [
    {
      id: 1,
      title: "Understanding Your Emotions",
      description: "Learn how to identify and process different emotional states for better mental wellbeing.",
      category: "articles",
      imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      link: "#",
      tags: ["emotions", "self-awareness"],
      featured: true
    },
    {
      id: 2,
      title: "5-Minute Mindfulness Meditation",
      description: "A quick guided meditation practice to center yourself during stressful moments.",
      category: "meditation",
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      link: "#",
      tags: ["meditation", "stress-relief"],
      duration: "5 min"
    },
    {
      id: 3,
      title: "Building Resilience Through Adversity",
      description: "Video workshop on developing emotional strength during challenging times.",
      category: "videos",
      imageUrl: "https://images.unsplash.com/photo-1551847600-c8eeb4aeb58a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      link: "#",
      tags: ["resilience", "growth"],
      duration: "15 min"
    },
    {
      id: 4,
      title: "Gratitude Journaling Exercise",
      description: "Daily exercise to cultivate thankfulness and improve your mood.",
      category: "exercises",
      imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      link: "#",
      tags: ["gratitude", "journaling"]
    },
    {
      id: 5,
      title: "The Science of Happiness",
      description: "Research-backed approaches to increasing your happiness baseline.",
      category: "articles",
      imageUrl: "https://images.unsplash.com/photo-1484069560501-87d72b0c3669?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      link: "#",
      tags: ["happiness", "science"]
    },
    {
      id: 6,
      title: "Deep Sleep Meditation",
      description: "Guided meditation to help you fall asleep faster and improve sleep quality.",
      category: "meditation",
      imageUrl: "https://images.unsplash.com/photo-1487300001871-12053913095d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      link: "#",
      tags: ["sleep", "relaxation"],
      duration: "20 min"
    }
  ];

  // Icons for categories
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'grid':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case 'document-text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'film':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
          </svg>
        );
      case 'sparkles':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
        );
      case 'academic-cap':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Filter resources based on active category
  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);
  
  const featuredResource = resources.find(r => r.featured);

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className={`mb-6 p-6 rounded-xl bg-gradient-to-r from-${theme.primaryColor}-600 via-${theme.primaryColor}-500 to-${theme.primaryColor}-700 text-white shadow-xl`}>
        <h1 className="text-3xl font-bold mb-2">Wellness Resources</h1>
        <p className="opacity-90">Discover tools and content to support your mental wellbeing journey.</p>
      </div>
      
      {/* Category Navigation */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <button 
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-${theme.primaryColor}-100 text-${theme.primaryColor}-800 dark:bg-${theme.primaryColor}-900/30 dark:text-${theme.primaryColor}-200 shadow-sm font-medium`
                : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {getIcon(category.icon)}
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Featured Resource */}
      {featuredResource && activeCategory === 'all' && (
        <div className={`mb-6 ${styles.cardBg} rounded-xl shadow-lg overflow-hidden border ${styles.cardBorder}`}>
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={featuredResource.imageUrl} 
                alt={featuredResource.title} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex items-center text-sm mb-2">
                <span className={`bg-${theme.primaryColor}-100 text-${theme.primaryColor}-800 dark:bg-${theme.primaryColor}-900/20 dark:text-${theme.primaryColor}-300 px-2 py-1 rounded-full text-xs font-medium`}>
                  Featured
                </span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-gray-600 dark:text-gray-400 capitalize">{featuredResource.category}</span>
              </div>
              <h2 className={`text-xl font-bold ${styles.headingText} mb-2`}>{featuredResource.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{featuredResource.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredResource.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              <a 
                href={featuredResource.link}
                className={`inline-block px-4 py-2 ${styles.buttonPrimary} text-white rounded-lg transition-all font-medium`}
              >
                Read More
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <div 
            key={resource.id}
            className={`${styles.cardBg} rounded-xl shadow-lg overflow-hidden border ${styles.cardBorder} hover:shadow-xl transition-all transform hover:-translate-y-1 card-hover-effect`}
          >
            <img 
              src={resource.imageUrl} 
              alt={resource.title} 
              className="h-48 w-full object-cover"
            />
            <div className="p-5">
              <div className="flex items-center text-sm mb-2">
                <span className={`bg-${theme.primaryColor}-100 text-${theme.primaryColor}-800 dark:bg-${theme.primaryColor}-900/20 dark:text-${theme.primaryColor}-300 px-2 py-1 rounded-full text-xs font-medium capitalize`}>
                  {resource.category}
                </span>
                {resource.duration && (
                  <>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {resource.duration}
                    </span>
                  </>
                )}
              </div>
              <h3 className={`text-lg font-bold ${styles.headingText} mb-2`}>{resource.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{resource.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              <a 
                href={resource.link}
                className={`inline-block px-3 py-1 ${styles.linkColor} rounded-lg transition-all text-sm font-medium`}
              >
                View Resource
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesHub;