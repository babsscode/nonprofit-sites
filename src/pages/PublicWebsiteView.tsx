import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { websiteService } from '../supabaseClient';
import WebsiteTemplate from './WebsiteTemplate';
import type { Website } from '../types.ts';

const PublicWebsiteView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook 1: useEffect for loading website data
  useEffect(() => {
    if (slug) {
      loadPublicWebsite(slug);
    } else {
      setError('No website slug provided');
      setLoading(false);
    }
  }, [slug]);

  // Hook 2: useEffect for setting document title - always called
  useEffect(() => {
    if (website?.site_data?.orgName) {
      document.title = `${website.site_data.orgName} - Nonprofit Website`;
    } else {
      document.title = 'Nonprofit Website Builder';
    }
    
    // Cleanup: Reset title when component unmounts
    return () => {
      document.title = 'Nonprofit Website Builder';
    };
  }, [website]);

  const loadPublicWebsite = async (websiteSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const website = await websiteService.getPublishedWebsiteBySlug(websiteSlug);
      
      if (!website) {
        setError('Website not found');
        return;
      }

      if (!website.is_published) {
        setError('Website is not published');
        return;
      }

      setWebsite(website);
    } catch (error) {
      console.error('Error loading public website:', error);
      setError('Failed to load website');
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading website...</p>
        </div>
      </div>
    );
  }

  // Render error state (404-like page)
  if (error || !website) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Website Not Found</h2>
            <p className="text-gray-500 mb-8">
              {error || 'The website you\'re looking for doesn\'t exist or hasn\'t been published yet.'}
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-400">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render the website template
  return (
    <div className="min-h-screen bg-white">
      <WebsiteTemplate siteData={website.site_data} />
    </div>
  );
};

export default PublicWebsiteView;