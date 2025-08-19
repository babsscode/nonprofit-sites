import React, { useState, useEffect, type JSX } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Users, Heart, DollarSign, Mail, ExternalLink, Save, Eye, Loader, AlertCircle, CheckCircle, Edit3, Globe, Check, Trash2 } from 'lucide-react';
import { websiteService, authService } from './../supabaseClient';
import WebsiteTemplate from './WebsiteTemplate';
import type { SiteData, Website, User } from '../types.ts';

const colorThemes = {
  blue: { primary: 'bg-blue-600', secondary: 'bg-blue-100', accent: 'text-blue-600', border: 'border-blue-200' },
  green: { primary: 'bg-green-600', secondary: 'bg-green-100', accent: 'text-green-600', border: 'border-green-200' },
  purple: { primary: 'bg-purple-600', secondary: 'bg-purple-100', accent: 'text-purple-600', border: 'border-purple-200' },
  red: { primary: 'bg-red-600', secondary: 'bg-red-100', accent: 'text-red-600', border: 'border-red-200' },
  orange: { primary: 'bg-orange-600', secondary: 'bg-orange-100', accent: 'text-orange-600', border: 'border-orange-200' }
} as const;

type AccentColor = keyof typeof colorThemes;

// Reserved slugs that cannot be used
const RESERVED_SLUGS = [
  'home', 'dashboard', 'build', 'login', 'signup', 'register', 'auth',
  'admin', 'api', 'www', 'mail', 'email', 'support', 'help', 'docs',
  'blog', 'news', 'about', 'contact', 'terms', 'privacy', 'legal',
  'app', 'mobile', 'web', 'site', 'website', 'domain', 'server',
  'root', 'public', 'private', 'secure', 'ssl', 'http', 'https',
  'ftp', 'sftp', 'ssh', 'telnet', 'smtp', 'pop', 'imap',
  'settings', 'config', 'configuration', 'setup', 'install',
  'assets', 'static', 'images', 'img', 'css', 'js', 'fonts',
  'uploads', 'downloads', 'files', 'media', 'content',
  'test', 'testing', 'dev', 'development', 'staging', 'production',
  'preview', 'demo', 'sample', 'template'
];

const WebsiteBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { websiteId } = useParams<{ websiteId: string }>();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get('projectName');
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingWebsite, setLoadingWebsite] = useState(false);
  const [currentMode, setCurrentMode] = useState<'builder' | 'preview'>('builder');
  const [currentWebsite, setCurrentWebsite] = useState<Website | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | ''>('');
  const [slugError, setSlugError] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempOrgName, setTempOrgName] = useState('');

  const [siteData, setSiteData] = useState<SiteData>({
    orgName: projectName || '',
    slug: projectName ? projectName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') : '',
    logo: null,
    logoPreview: '',
    tagline: '',
    accentColor: 'blue',
    fontFamily: 'inter',
    heroImage: null,
    heroImagePreview: '',
    missionStatement: '',
    whatWeDo: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' }
    ],
    ctaText: '',
    aboutMission: '',
    leadership: [
      { photo: null, photoPreview: '', name: '', title: '', bio: '' },
      { photo: null, photoPreview: '', name: '', title: '', bio: '' }
    ],
    partners: '',
    sponsers: null,
    sponsersPreview: '',
    programs: [
      { title: '', description: '', impact: '' },
      { title: '', description: '', impact: '' }
    ],
    volunteerText: '',
    googleFormEmbed: '',
    donateText: '',
    paymentInfo: '',
    venmoLink: '',
    paypalLink: '',
    address: '',
    email: '',
    phone: '',
    officeHours: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });

  useEffect(() => {
    checkAuthAndLoadWebsite();
  }, [websiteId]);

  const checkAuthAndLoadWebsite = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser && websiteId) {
        await loadWebsite(websiteId, currentUser.id);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWebsite = async (id: string, userId: string): Promise<void> => {
    setLoadingWebsite(true);
    try {
      const website = await websiteService.getWebsiteById(id, userId);
      if (website) {
        setCurrentWebsite(website);
        setSiteData(website.site_data);
        setTempOrgName(website.site_data.orgName);
      }
    } catch (error) {
      console.error('Error loading website:', error);
      // If website not found, redirect to dashboard
      navigate('/dashboard');
    } finally {
      setLoadingWebsite(false);
    }
  };

  const validateSlug = (slug: string): string => {
    if (!slug.trim()) {
      return 'URL slug is required';
    }
    
    if (slug.length < 3) {
      return 'URL slug must be at least 3 characters long';
    }
    
    if (slug.length > 50) {
      return 'URL slug must be less than 50 characters';
    }
    
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return 'URL slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (slug.startsWith('-') || slug.endsWith('-')) {
      return 'URL slug cannot start or end with a hyphen';
    }
    
    if (slug.includes('--')) {
      return 'URL slug cannot contain consecutive hyphens';
    }
    
    if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
      return 'This URL slug is cannot be used. Please choose a different one.';
    }
    
    return '';
  };

  const addTeamMember = () => {
    setSiteData(prev => ({
      ...prev,
      leadership: [
        ...prev.leadership,
        { photo: null, photoPreview: '', name: '', title: '', bio: '' },
      ]
    }));
  };

  const removeTeamMember = (index: number) => {
  setSiteData(prev => {
    const updatedLeadership = prev.leadership.filter((_, i) => i !== index);
    return { ...prev, leadership: updatedLeadership };
  });
};

const handlePhotoImageUpload = (
  index: number,
  file: File | null
): void => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;

      setSiteData(prev => {
        const updatedTeam = [...prev.leadership];
        updatedTeam[index] = {
          ...updatedTeam[index],
          photo: file,
          photoPreview: result
        };
        return { ...prev, leadership: updatedTeam };
      });
    };
    reader.readAsDataURL(file);
  } else {
    setSiteData(prev => {
      const updatedTeam = [...prev.leadership];
      updatedTeam[index] = {
        ...updatedTeam[index],
        photo: null,
        photoPreview: ''
      };
      return { ...prev, leadership: updatedTeam };
    });
  }
};

const removeImage = (imageType: 'logo' | 'heroImage' | 'sponsers'): void => {
  setSiteData(prev => ({
    ...prev,
    [imageType]: null,
    [`${imageType}Preview`]: ''
  }));
};

const removeTeamMemberPhoto = (index: number): void => {
  setSiteData(prev => {
    const updatedTeam = [...prev.leadership];
    updatedTeam[index] = {
      ...updatedTeam[index],
      photo: null,
      photoPreview: ''
    };
    return { ...prev, leadership: updatedTeam };
  });
};



  const handleSave = async (showStatus: boolean = true): Promise<boolean> => {
    if (!user) return false;
    
    setIsSaving(true);
    if (showStatus) setSaveStatus('saving');
    setSlugError('');

    try {
      // Validate slug
      const slugValidationError = validateSlug(siteData.slug);
      if (slugValidationError) {
        setSlugError(slugValidationError);
        if (showStatus) setSaveStatus('error');
        return false;
      }

      // Check slug uniqueness
      const isUnique = await websiteService.isSlugUnique(siteData.slug, currentWebsite?.id);
      if (!isUnique) {
        setSlugError('This URL slug is already taken. Please choose a different one.');
        if (showStatus) setSaveStatus('error');
        return false;
      }

      const savedWebsite = await websiteService.saveWebsite(siteData, user.id, currentWebsite?.id);
      setCurrentWebsite(savedWebsite);
      
      if (showStatus) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving website:', error);
      if (showStatus) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 3000);
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const canPublish = (): boolean => {
    return Boolean(
      siteData.orgName && 
      siteData.slug && 
      !slugError && 
      validateSlug(siteData.slug) === ''
    );
  };

  const handlePublish = async (): Promise<void> => {
    if (!user || !currentWebsite || !canPublish()) return;
    
    setIsPublishing(true);
    
    try {
      // First save the current state
      const saveSuccess = await handleSave(false);
      if (!saveSuccess) {
        setIsPublishing(false);
        return;
      }

      // Then publish the website
      const publishedWebsite = await websiteService.publishWebsite(currentWebsite.id, user.id);
      setCurrentWebsite(publishedWebsite);
      
      // Show success message or navigate
      console.log('Website published successfully!');
      
    } catch (error) {
      console.error('Error publishing website:', error);
      // Show error message
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = async (): Promise<void> => {
    // Auto-save before showing preview
    await handleSave(false);
    setCurrentMode('preview');
  };

  const handleNext = async (): Promise<void> => {
    // Auto-save before proceeding to next step
    setSaveStatus('saving');
    const saveSuccess = await handleSave(false);
    
    if (saveSuccess && canProceed()) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 1000);
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const handleEditName = (): void => {
    setIsEditingName(true);
    setTempOrgName(siteData.orgName);
  };

  const handleSaveName = (): void => {
    updateField('orgName', tempOrgName);
    setIsEditingName(false);
  };

  const handleCancelEditName = (): void => {
    setTempOrgName(siteData.orgName);
    setIsEditingName(false);
  };

  const updateField = (field: keyof SiteData, value: string | File | null): void => {
    setSiteData(prev => ({ ...prev, [field]: value }));
    
    // Clear and validate slug when user updates slug
    if (field === 'slug') {
      const cleanSlug = typeof value === 'string' ? value.toLowerCase().replace(/[^a-z0-9-]/g, '') : '';
      setSiteData(prev => ({ ...prev, slug: cleanSlug }));
      
      const validationError = validateSlug(cleanSlug);
      setSlugError(validationError);
    }
  };

  const handleImageUpload = (field: 'logo' | 'heroImage' | 'sponsers', file: File | null): void => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        setSiteData(prev => ({
          ...prev,
          [field]: file,
          [`${field}Preview`]: result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setSiteData(prev => ({
        ...prev,
        [field]: null,
        [`${field}Preview`]: ''
      }));
    }
  };

  const updateArrayItem = (
    field: 'whatWeDo' | 'leadership' | 'programs', 
    index: number, 
    subfield: string, 
    value: string
  ): void => {
    setSiteData(prev => {
      const newArray = [...prev[field]] as any[];
      newArray[index] = { ...newArray[index], [subfield]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const steps = [
    {
      title: "Basic Info",
      shortTitle: "Info",
      description: "Tell us about your organization and choose your style",
      icon: Home
    },
    {
      title: "Home Page", 
      shortTitle: "Home",
      description: "Create your main page content",
      icon: Heart
    },
    {
      title: "About",
      shortTitle: "About",
      description: "Share your story and team", 
      icon: Users
    },
    {
      title: "Get Involved",
      shortTitle: "Volunteer",
      description: "Help people join your cause",
      icon: Heart
    },
    {
      title: "Donations",
      shortTitle: "Donate",
      description: "Set up donation options",
      icon: DollarSign
    },
    {
      title: "Contact",
      shortTitle: "Contact",
      description: "How people can reach you",
      icon: Mail
    }
  ];

  const canProceed = (): boolean => {
    if (currentStep === 0) {
      return Boolean(siteData.orgName && siteData.slug && !slugError && validateSlug(siteData.slug) === '');
    }
    return true;
  };

  if (loading || loadingWebsite) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">
            {loadingWebsite ? 'Loading website...' : 'Loading website builder...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base">Please log in to access the website builder.</p>
        </div>
      </div>
    );
  }

  if (currentMode === 'preview') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-2 sm:space-x-6 min-w-0 flex-1">
              <button
                onClick={() => setCurrentMode('builder')}
                className="flex items-center text-gray-500 hover:text-gray-800 transition-colors font-medium text-md sm:text-base"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                <span className="hidden sm:inline">Back to Editor</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>

            {/* Center Section */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center text-gray-700 font-medium text-md md:text-lg ">
                <span>Website Preview</span>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 flex-1 justify-end">
              {!canPublish() && (
                <div className="text-xs sm:text-sm text-red-600 flex items-center hidden lg:flex">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="hidden xl:inline">Complete required fields to publish</span>
                  <span className="xl:hidden">Missing fields</span>
                </div>
              )}
              {currentWebsite?.is_published ? (
                <a 
                  href={`/${siteData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 bg-blue-50 rounded-lg transition-colors touch-manipulation"
                  title="View Live Site"
                  aria-label="View Live Site"
                >
                  <ExternalLink className="h-4 w-4 lg:h-5 lg:w-5" />
                </a>
              ) : (
                <div className='p-2'>
                  <ExternalLink className="h-4 w-4 text-gray-300" />
                </div>
              )}
              <button
                onClick={handlePublish}
                disabled={isPublishing || !canPublish()}
                className="bg-green-600 text-white px-3 py-2 sm:px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors font-medium text-sm sm:text-base"
              >
                {isPublishing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Publishing...</span>
                    <span className="sm:hidden">Publishing</span>
                  </>
                ) : (
                  <>
                    <span className="hidden lg:inline">
                      {currentWebsite?.is_published ? 'Update Published Site' : 'Publish Website'}
                    </span>
                    <span className="lg:hidden">
                      {currentWebsite?.is_published ? 'Update' : 'Publish'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
        <div className="bg-white">
          <WebsiteTemplate siteData={siteData} />
        </div>
      </div>
    );
  }

  // Builder Mode
  const renderCurrentStep = (): JSX.Element => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Organization Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name *</label>
                  <input
                    type="text"
                    value={siteData.orgName}
                    onChange={(e) => updateField('orgName', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Organization Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website URL Slug *</label>
                  <div className="flex flex-col sm:flex-row">
                    <span className="text-gray-500 px-3 py-3 bg-gray-100 border border-b-0 sm:border-b sm:border-r-0 rounded-t-lg sm:rounded-l-lg sm:rounded-t-lg text-sm">
                      https://nonprofitsites.web.app/
                    </span>
                    <input
                      type="text"
                      value={siteData.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                      className={`flex-1 p-3 border rounded-b-lg sm:rounded-r-lg sm:rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        slugError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                      placeholder="your-org-name"
                    />
                  </div>
                  {slugError && (
                    <div className="mt-2 flex items-start text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{slugError}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens allowed. Must be at least 3 characters.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Logo Upload</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('logo', e.target.files?.[0] || null)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    {siteData.logoPreview && (
                      <div className="mt-2 flex items-center space-x-3">
                        <img 
                          src={siteData.logoPreview} 
                          alt="Logo preview" 
                          className="h-16 w-16 object-cover rounded border shadow-sm"
                        />
                        <button
                          onClick={() => removeImage('logo')}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove logo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tagline *</label>
                  <input
                    type="text"
                    value={siteData.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Making a Difference Together"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Theme & Style</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4">Accent Color</label>
                  <div className="grid grid-cols-5 gap-2 sm:gap-4">
                    {(Object.keys(colorThemes) as AccentColor[]).map(color => (
                      <button
                        key={color}
                        onClick={() => updateField('accentColor', color)}
                        className={`
                          w-12 h-12 sm:w-16 sm:h-16 rounded-lg border-2 transition-all ${colorThemes[color].primary} ${
                          siteData.accentColor === color ? 'border-gray-800 scale-110 shadow-lg' : 'border-gray-300 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2 capitalize">Selected: {siteData.accentColor}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Font Family</label>
                  <select
                    value={siteData.fontFamily}
                    onChange={(e) => updateField('fontFamily', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="inter">Inter (Modern Sans-serif)</option>
                    <option value="serif">Times (Classic Serif)</option>
                    <option value="mono">Monospace (Technical)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Main Image Upload</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('heroImage', e.target.files?.[0] || null)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {siteData.heroImagePreview && (
                  <div className="mt-2 flex items-center space-x-3">
                    <img 
                      src={siteData.heroImagePreview} 
                      alt="Hero image preview" 
                      className="h-32 w-auto object-cover rounded border shadow-sm"
                    />
                    <button
                      onClick={() => removeImage('heroImage')}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove hero image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mission Statement *</label>
              <textarea
                value={siteData.missionStatement}
                onChange={(e) => updateField('missionStatement', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                placeholder="Our mission is to..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-4">What We Do (3 Cards) *</label>
              {siteData.whatWeDo.map((item, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg border">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateArrayItem('whatWeDo', index, 'title', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Service ${index + 1} Title`}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateArrayItem('whatWeDo', index, 'description', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Call to Action Text</label>
              <input
                type="text"
                value={siteData.ctaText}
                onChange={(e) => updateField('ctaText', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Join us in our mission to create positive change in our community."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">About Our Mission *</label>
              <textarea
                value={siteData.aboutMission}
                onChange={(e) => updateField('aboutMission', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                placeholder="We are dedicated to making a positive impact..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-4">Leadership Team</label>
              {siteData.leadership.map((member, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border mb-4 space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">Team Member {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove team member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateArrayItem('leadership', index, 'name', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={member.title}
                        onChange={(e) => updateArrayItem('leadership', index, 'title', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Title"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
                      <textarea
                        value={member.bio}
                        onChange={(e) => updateArrayItem('leadership', index, 'bio', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Bio"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoImageUpload(index, e.target.files?.[0] || null)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    {member.photoPreview && (
                      <div className="mt-2 flex items-center space-x-3">
                        <img 
                          src={member.photoPreview} 
                          alt="Photo Preview"
                          className="w-24 h-24 object-cover border shadow-sm rounded" 
                        />
                        <button
                          onClick={() => removeTeamMemberPhoto(index)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove photo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Team Member
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sponsers Message</label>
              <textarea
                value={siteData.partners}
                onChange={(e) => updateField('partners', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                placeholder="We are grateful for the support of..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Sponsers Image</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('sponsers', e.target.files?.[0] || null)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {siteData.sponsersPreview && (
                  <div className="mt-2 flex items-center space-x-3">
                    <img 
                      src={siteData.sponsersPreview} 
                      alt="Sponsers preview" 
                      className="h-16 w-auto object-cover rounded border shadow-sm"
                    />
                    <button
                      onClick={() => removeImage('sponsers')}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove sponsers image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

{/**      case 3:
        return (
          <div className="space-y-6">
            {siteData.programs.map((program, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium mb-4 text-gray-800">Program {index + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Program Title</label>
                    <input
                      type="text"
                      value={program.title}
                      onChange={(e) => updateArrayItem('programs', index, 'title', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Program Title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={program.description}
                      onChange={(e) => updateArrayItem('programs', index, 'description', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                      placeholder="Program Description"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Impact Statement</label>
                    <textarea
                      value={program.impact}
                      onChange={(e) => updateArrayItem('programs', index, 'impact', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-16 resize-none"
                      placeholder="Impact Statement"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ); */}

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Volunteer Text</label>
              <textarea
                value={siteData.volunteerText}
                onChange={(e) => updateField('volunteerText', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                placeholder="We believe everyone has something valuable to contribute..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Google Form URL</label>
              <input
                type="url"
                value={siteData.googleFormEmbed}
                onChange={(e) => updateField('googleFormEmbed', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://docs.google.com/forms/d/e/..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Donation Message</label>
              <textarea
                value={siteData.donateText}
                onChange={(e) => updateField('donateText', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                placeholder="Your generous contribution helps us continue..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Venmo Link</label>
                <input
                  type="url"
                  value={siteData.venmoLink}
                  onChange={(e) => updateField('venmoLink', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://venmo.com/your-org"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">PayPal Link</label>
                <input
                  type="url"
                  value={siteData.paypalLink}
                  onChange={(e) => updateField('paypalLink', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://paypal.me/your-org"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Additional Payment Information</label>
              <textarea
                value={siteData.paymentInfo}
                onChange={(e) => updateField('paymentInfo', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                placeholder="Mail checks to our office address, set up recurring donations..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={siteData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="info@yourorg.org"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={siteData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea
                value={siteData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                placeholder="123 Main Street&#10;Your City, State 12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Office Hours</label>
              <textarea
                value={siteData.officeHours}
                onChange={(e) => updateField('officeHours', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                placeholder="Monday - Friday: 9:00 AM - 5:00 PM&#10;Weekends: By appointment"
              />
            </div>
            <div>
              <h3 className="font-medium mb-4 text-gray-800">Social Media Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Facebook URL</label>
                  <input
                    type="url"
                    value={siteData.facebook}
                    onChange={(e) => updateField('facebook', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://facebook.com/yourorg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Twitter URL</label>
                  <input
                    type="url"
                    value={siteData.twitter}
                    onChange={(e) => updateField('twitter', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://twitter.com/yourorg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={siteData.instagram}
                    onChange={(e) => updateField('instagram', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://instagram.com/yourorg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={siteData.linkedin}
                    onChange={(e) => updateField('linkedin', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/company/yourorg"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Mobile-Responsive Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 sm:mb-8 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-3">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {currentWebsite ? 'Edit Your Website' : 'Create Your Nonprofit Website'}
                </h1>
              </div>
              
              {currentWebsite && (
                <div className="mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 font-medium flex-shrink-0">Editing:</span>
                    {isEditingName ? (
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <input
                          type="text"
                          value={tempOrgName}
                          onChange={(e) => setTempOrgName(e.target.value)}
                          className="text-lg font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveName();
                            if (e.key === 'Escape') handleCancelEditName();
                          }}
                          autoFocus
                        />
                        <button
                          onClick={handleSaveName}
                          className="text-green-600 hover:text-green-800 p-1 flex-shrink-0"
                          title="Save"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEditName}
                          className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
                          title="Cancel"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <span className="text-lg font-semibold text-blue-600 truncate">
                          {siteData.orgName || 'Untitled Website'}
                        </span>
                        <button
                          onClick={handleEditName}
                          className="text-gray-400 hover:text-blue-600 p-1 flex-shrink-0"
                          title="Edit name"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <span className="font-mono break-all">{siteData.slug || 'your-site'}</span>
                    </div>
                    {currentWebsite?.is_published && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                        <Check className="h-3 w-3 mr-1" />
                        Published
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm sm:text-base"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Dashboard
              </button>
              
              {saveStatus && (
                <div className={`text-sm px-3 py-2 rounded-lg flex items-center justify-center font-medium ${
                  saveStatus === 'saved' ? 'bg-green-100 text-green-800' :
                  saveStatus === 'saving' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {saveStatus === 'saved' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : saveStatus === 'saving' ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Save failed
                    </>
                  )}
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors font-medium flex-1 sm:flex-none text-sm sm:text-base"
                >
                  {isSaving ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save
                </button>

                <button
                  onClick={handlePreview}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center transition-colors font-medium flex-1 sm:flex-none text-sm sm:text-base"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Responsive Progress Bar */}
        <div className="mb-6 sm:mb-8">
          {/* Desktop Progress */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const canNavigate = index === 0 || (siteData.orgName && siteData.slug && !slugError && validateSlug(siteData.slug) === '');
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <button
                      onClick={() => canNavigate ? setCurrentStep(index) : null}
                      disabled={!canNavigate}
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all relative
                        ${isActive ? 'bg-blue-600 text-white shadow-lg' : 
                          isCompleted ? 'bg-green-500 text-white' : 
                          'bg-gray-200 text-gray-400'}
                        ${canNavigate ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                        ${canNavigate && !isActive && !isCompleted ? 'hover:bg-gray-300' : ''}
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <StepIcon className="h-6 w-6" />
                      )}
                    </button>
                    <div className="text-center max-w-20">
                      <div className={`text-xs font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const canNavigate = index === 0 || (siteData.orgName && siteData.slug && !slugError && validateSlug(siteData.slug) === '');
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => canNavigate ? setCurrentStep(index) : null}
                      disabled={!canNavigate}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 transition-all relative
                        ${isActive ? 'bg-blue-600 text-white shadow-lg' : 
                          isCompleted ? 'bg-green-500 text-white' : 
                          'bg-gray-200 text-gray-400'}
                        ${canNavigate ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                        ${canNavigate && !isActive && !isCompleted ? 'hover:bg-gray-300' : ''}
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <StepIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                    <div className="text-center">
                      <div className={`text-xs font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className="hidden sm:inline">{step.shortTitle}</span>
                        <span className="sm:hidden">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">{steps[currentStep].title}</h2>
            <p className="text-gray-600 text-sm sm:text-base">{steps[currentStep].description}</p>
          </div>
          
          {renderCurrentStep()}
        </div>

        {/* Mobile-Responsive Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto ${
              currentStep === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>

          <div className="hidden sm:inline text-sm text-gray-500 font-medium">
            {currentStep + 1} of {steps.length}
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handlePreview}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors w-full sm:w-auto"
            >
              Preview Website
              <ExternalLink className="h-5 w-5 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto ${
                !canProceed()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          )}

          <div className="sm:hidden text-sm text-gray-500 font-medium">
            {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Validation Message */}
        {!canProceed() && currentStep === 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex flex-col sm:flex-row">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Required fields missing</p>
                <p className="text-red-600 text-sm mt-1">
                  Please fill in the Organization Name and URL Slug{slugError && ', and fix the slug error'} to continue.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteBuilder;
