import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Globe, ExternalLink, Eye, User, LogOut, Loader, Calendar, Menu, X, EyeOff } from 'lucide-react';
import { websiteService, authService } from './../supabaseClient';
import type { Website } from '../types.ts';

interface User {
  id: string;
  email?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkAuthAndLoadData = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        await loadWebsites(currentUser.id);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWebsites = async (userId: string): Promise<void> => {
    try {
      const userWebsites = await websiteService.getUserWebsites(userId);
      setWebsites(userWebsites);
    } catch (error) {
      console.error('Error loading websites:', error);
    }
  };

  const handleCreateProject = async (): Promise<void> => {
    if (!projectName.trim()) {
      setCreateError('Please enter a project name');
      return;
    }

    setIsCreating(true);
    setCreateError('');

    try {
      // Generate slug from project name
      const slug = projectName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      
      // Check if slug is unique
      const isUnique = await websiteService.isSlugUnique(slug);
      if (!isUnique) {
        setCreateError('A website with this name already exists. Please choose a different name.');
        setIsCreating(false);
        return;
      }

      setShowCreateModal(false);
      setProjectName('');
      
      // Navigate to builder with project name as query parameter
      navigate(`/builder?projectName=${encodeURIComponent(projectName)}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setCreateError('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditWebsite = (website: Website): void => {
    // Navigate to builder with website ID
    navigate(`/builder/${website.id}`);
  };

  const handleDelete = async (websiteId: string): Promise<void> => {
    if (!user) return;
    
    if (confirm('Are you sure you want to delete this website? This action cannot be undone.')) {
      try {
        await websiteService.deleteWebsite(websiteId, user.id);
        setWebsites(websites.filter(w => w.id !== websiteId));
      } catch (error) {
        console.error('Error deleting website:', error);
        alert('Failed to delete website. Please try again.');
      }
    }
  };

  const handleTogglePublish = async (website: Website): Promise<void> => {
    if (!user) return;

    try {
      if (website.is_published) {
        await websiteService.unpublishWebsite(website.id, user.id);
      } else {
        await websiteService.publishWebsite(website.id, user.id);
      }
      await loadWebsites(user.id);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status. Please try again.');
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const closeModal = (): void => {
    setShowCreateModal(false);
    setProjectName('');
    setCreateError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-blue-500 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-2xl font-black bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-2">
              NONPROFIT SITES
            </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                <span className="text-sm truncate max-w-48">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Websites</h2>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              {websites.length === 0 
                ? 'Create your first nonprofit website to get started' 
                : `Manage your ${websites.length} website${websites.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-linear-to-r from-blue-500 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:scale-104 transition-colors flex items-center shadow-md text-sm sm:text-base shrink-0 justify-center sm:justify-start"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="hidden sm:inline">Create New Website</span>
            <span className="sm:hidden">Create Website</span>
          </button>
        </div>

        {/* Website Grid */}
        {websites.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 mx-2 sm:mx-0">
            <Globe className="h-16 sm:h-20 w-16 sm:w-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 px-4">No websites yet</h3>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4 text-sm sm:text-base">
              Get started by creating your first nonprofit website. Our easy-to-use builder will help you create a professional site in minutes.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Create Your First Website
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {websites.map((website) => (
              <div key={website.id} className="bg-white rounded-xl shadow-md hover:shadow-lg border border-blue-500 hover:scale-103 transition-all duration-200 overflow-hidden">
                {/* Website Info */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate pr-2">{website.org_name}</h3>
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">/{website.slug}</p>
                    </div>
                    <div className="ml-2 shrink-0">
                      {website.is_published ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                          Published
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2 h-8 sm:h-10">
                    {website.site_data.missionStatement || website.site_data.tagline || 'No description added yet'}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="h-3 w-3 mr-1 shrink-0" />
                    <span className="truncate">Updated {new Date(website.updated_at).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handleEditWebsite(website)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
                        title="Edit Website"
                        aria-label="Edit Website"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button>
                      {website.is_published ? (
                         <Eye className="h-4 w-4 text-green-600 hover:text-green-800 hover:bg-green-50" onClick={() => handleTogglePublish(website)}/>
                      ) : (
                        <EyeOff  className="h-4 w-4 text-amber-600 hover:text-amber-800 hover:bg-amber-50" onClick={() => handleTogglePublish(website)}/>
                      )}
                      </button>
                      <button
                        onClick={() => handleDelete(website.id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                        title="Delete Website"
                        aria-label="Delete Website"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {website.is_published && (
                      <a
                        href={`/${website.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
                        title="View Live Site"
                        aria-label="View Live Site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-4 sm:p-6 max-h-screen overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Create New Website</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Give your nonprofit website project a name to get started.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    setCreateError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && projectName.trim() && !isCreating) {
                      handleCreateProject();
                    }
                  }}
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="e.g., Hope Foundation, Community Center"
                  autoFocus
                />
                {createError && (
                  <p className="mt-2 text-sm text-red-600">{createError}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="order-2 sm:order-1 px-4 py-2 sm:py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base touch-manipulation"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={isCreating || !projectName.trim()}
                className="order-1 sm:order-2 px-6 py-2 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base touch-manipulation"
              >
                {isCreating ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Website'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;