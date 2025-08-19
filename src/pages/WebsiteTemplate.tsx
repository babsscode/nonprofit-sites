import React, { useState } from 'react';
import { Users, Target, Heart, DollarSign, Mail, MapPin, Phone, Clock, Facebook, Twitter, Instagram, Linkedin, Menu, X } from 'lucide-react';
import type { SiteData } from '../types.ts';

const colorThemes = {
  blue: { primary: 'bg-blue-600', secondary: 'bg-blue-100', accent: 'text-blue-600', border: 'border-blue-200' },
  green: { primary: 'bg-green-600', secondary: 'bg-green-100', accent: 'text-green-600', border: 'border-green-200' },
  purple: { primary: 'bg-purple-600', secondary: 'bg-purple-100', accent: 'text-purple-600', border: 'border-purple-200' },
  red: { primary: 'bg-red-600', secondary: 'bg-red-100', accent: 'text-red-600', border: 'border-red-200' },
  orange: { primary: 'bg-orange-600', secondary: 'bg-orange-100', accent: 'text-orange-600', border: 'border-orange-200' }
} as const;

const fontFamilies = {
  inter: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono'
} as const;

type AccentColor = keyof typeof colorThemes;
type FontFamily = keyof typeof fontFamilies;

interface WebsiteTemplateProps {
  siteData: SiteData;
}

const WebsiteTemplate: React.FC<WebsiteTemplateProps> = ({ siteData }) => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const theme = colorThemes[siteData.accentColor as AccentColor];
  const font = fontFamilies[siteData.fontFamily as FontFamily];

  const menuItems = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About' },
    { key: 'get-involved', label: 'Get Involved' },
    { key: 'donate', label: 'Donate' },
    { key: 'contact', label: 'Contact' }
  ];

  const handlePageChange = (page: string): void => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  // Website Components
  const Navigation: React.FC = () => (
    <nav className={`${theme.primary} text-white shadow-lg relative`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {siteData.logoPreview && (
              <img 
                src={siteData.logoPreview} 
                alt="Logo" 
                className="h-6 w-6 sm:h-8 sm:w-8 rounded flex-shrink-0" 
              />
            )}
            <span className="text-lg sm:text-xl font-bold truncate">
              {siteData.orgName || 'Your Organization'}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-4 xl:space-x-6">
            {menuItems.map(item => (
              <button
                key={item.key}
                onClick={() => handlePageChange(item.key)}
                className={`hover:text-gray-200 transition-colors px-2 py-1 text-sm xl:text-base ${
                  currentPage === item.key ? 'border-b-2 border-white pb-1' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50">
            <div className="py-2">
              {menuItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => handlePageChange(item.key)}
                  className={`block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors ${
                    currentPage === item.key ? `${theme.secondary} ${theme.accent}` : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  const FooterShort: React.FC = () => (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4">{siteData.orgName || 'Your Organization'}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {siteData.missionStatement || 'Making a difference in our community through dedicated service and support.'}
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              {siteData.facebook && (
                <Facebook className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              )}
              {siteData.twitter && (
                <Twitter className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              )}
              {siteData.instagram && (
                <Instagram className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              )}
              {siteData.linkedin && (
                <Linkedin className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              )}
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-300 text-sm break-words">
              {siteData.email || 'info@yourorg.org'}
            </p>
            <p className="text-gray-300 text-sm">
              {siteData.phone || ''}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-xs sm:text-sm">
          {/**501(c)(3)  */}
          <p>© 2025 {siteData.orgName || 'Your Organization'}. All rights reserved. | Powered by <a className='underline' href={`/`}>Nonprofit Sites</a></p>
        </div>
      </div>
    </footer>
  );

  const HomePage: React.FC = () => (
    <div className={font}>
      {/* Hero Section */}
      <section className={`${theme.secondary} py-12 sm:py-16 lg:py-20`}>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          {siteData.heroImagePreview && (
            <img 
              src={siteData.heroImagePreview} 
              alt="Hero" 
              className="mx-auto mb-6 sm:mb-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md lg:max-w-2xl h-48 sm:h-64 object-cover" 
            />
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-800 leading-tight">
            {siteData.tagline || 'Making a Difference Together'}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            {siteData.missionStatement || 'Our mission is to create positive change in our community through dedicated service, support, and advocacy for those who need it most.'}
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">What We Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {siteData.whatWeDo.map((item, index) => (
              <div key={index} className={`${theme.border} border rounded-lg p-6 text-center hover:shadow-lg transition-shadow`}>
                <div className={`${theme.primary} w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                  {index === 0 && <Target className="h-6 w-6 sm:h-8 sm:w-8" />}
                  {index === 1 && <Users className="h-6 w-6 sm:h-8 sm:w-8" />}
                  {index === 2 && <Heart className="h-6 w-6 sm:h-8 sm:w-8" />}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">{item.title || `Service ${index + 1}`}</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
                  {item.description || 'Description of our important work and impact in the community.'}
                </p>
               {/** <button 
                  onClick={() => handlePageChange('programs')}
                  className={`${theme.accent} hover:underline inline-flex items-center text-sm sm:text-base`}
                > 
                 Learn More <ExternalLink className="ml-1 h-4 w-4" />
                </button>
                 */}
                  
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`${theme.primary} py-12 sm:py-16 text-white`}>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            {siteData.ctaText || 'Join us in our mission to create positive change in our community.'}
          </p>
          <button 
            onClick={() => handlePageChange('get-involved')}
            className="bg-white text-gray-800 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Get Involved
          </button>
        </div>
      </section>
    </div>
  );

  const AboutPage: React.FC = () => (
    <div className={`${font} py-8 sm:py-12`}>
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">About Us</h1>
        
        {/* Mission */}
        <section className="mb-8 sm:mb-12">
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${theme.accent}`}>Our Mission</h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {siteData.aboutMission || 'We are dedicated to making a positive impact in our community through innovative programs, dedicated volunteers, and strategic partnerships that address the most pressing needs of those we serve.'}
          </p>
        </section>

{/* Leadership - Only shows if there are leadership members */}
        {siteData.leadership && siteData.leadership.length > 0 && (
          <section className="mb-8 sm:mb-12">
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${theme.accent}`}>Leadership Team</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {siteData.leadership.map((member, index) => (
                    <div key={index} className={`${theme.border} border flex flex-col items-center rounded-lg p-4 sm:p-6`}>
                      {member.photoPreview && (
                        <img 
                          src={member.photoPreview} 
                          alt="Logo" 
                          className="h-28 w-28 sm:h-40 sm:w-40 rounded mb-2 flex-shrink-0" 
                        />
                      )}
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{member.name || `Leader ${index + 1}`}</h3>
                  <p className={`${theme.accent} font-medium mb-3 text-sm sm:text-base`}>
                    {member.title || 'Board Member'}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-center">
                    {member.bio || 'Dedicated to our mission and bringing years of experience to our organization.'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Partners - Only shows if partners content exists */}
        {((siteData.partners && siteData.partners.trim()) || siteData.sponsersPreview) && (
          <section>
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${theme.accent}`}>Partners & Sponsors</h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {siteData.partners || 'We are grateful for the support of our community partners and sponsors who make our work possible. Together, we are stronger and can achieve greater impact.'}
            </p>
            {siteData.sponsersPreview && (
              <img 
                src={siteData.sponsersPreview} 
                alt="Sponsers" 
                className="mx-auto my-6 sm:mb-8 w-full max-w-xs sm:max-w-md lg:max-w-2xl h-auto border rounded-md object-cover" 
              />
            )}
          </section>
        )}
      </div>
    </div>
  );

  {/**const ProgramsPage: React.FC = () => (
    <div className={`${font} py-8 sm:py-12`}>
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">Our Programs</h1>
        <div className="space-y-6 sm:space-y-8">
          {siteData.programs.map((program, index) => (
            <div key={index} className={`${theme.border} border rounded-lg p-6 sm:p-8`}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">{program.title || `Program ${index + 1}`}</h2>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
                {program.description || 'This program addresses critical community needs through innovative approaches and dedicated service.'}
              </p>
              <div className={`${theme.secondary} p-4 rounded-lg`}>
                <h3 className={`font-semibold mb-2 ${theme.accent} text-sm sm:text-base`}>Impact</h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {program.impact || 'Making measurable difference in the lives of those we serve and strengthening our community.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ); */}

  const GetInvolvedPage: React.FC = () => (
    <div className={`${font} py-8 sm:py-12`}>
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">Get Involved</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${theme.accent}`}>Join Our Mission</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
              {siteData.volunteerText || 'We believe everyone has something valuable to contribute. Whether you have a few hours a week or want to take on a larger role, there\'s a place for you in our organization.'}
            </p>
            <div className={`${theme.secondary} p-4 sm:p-6 rounded-lg`}>
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Ways to Help</h3>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li>• Volunteer at events and programs</li>
                <li>• Share your professional skills</li>
                <li>• Spread awareness in your network</li>
                <li>• Donate to support our mission</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${theme.accent}`}>Sign Up to Volunteer</h2>
            {siteData.googleFormEmbed ? (
              <div className="w-full h-64 sm:h-96 border rounded-lg overflow-hidden">
                <iframe 
                  src={siteData.googleFormEmbed} 
                  className="w-full h-full"
                  title="Volunteer Sign Up Form"
                />
              </div>
            ) : (
              <div className={`${theme.border} border-2 border-dashed rounded-lg p-6 sm:p-8 text-center`}>
                <p className="text-gray-500 mb-4 text-sm sm:text-base">Google Form will be embedded here</p>
                <p className="text-xs sm:text-sm text-gray-400">Add your Google Form embed code in the setup</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const DonatePage: React.FC = () => (
    <div className={`${font} py-8 sm:py-12`}>
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800 text-center">Support Our Mission</h1>
        
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed px-4">
            {siteData.donateText || 'Your generous contribution helps us continue our vital work in the community. Every donation, no matter the size, makes a meaningful difference in the lives of those we serve.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className={`${theme.border} border rounded-lg p-6 sm:p-8 text-center`}>
            <DollarSign className={`h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 ${theme.accent}`} />
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Quick Donate</h2>
            <div className="space-y-4">
              {siteData.venmoLink && (
                <a href={siteData.venmoLink} target="_blank" rel="noopener noreferrer" 
                   className={`${theme.primary} text-white px-6 py-3 rounded-lg block hover:opacity-90 transition-opacity text-sm sm:text-base`}>
                  Donate via Venmo
                </a>
              )}
              {siteData.paypalLink && (
                <a href={siteData.paypalLink} target="_blank" rel="noopener noreferrer"
                   className={`${theme.primary} text-white px-6 py-3 rounded-lg block hover:opacity-90 transition-opacity text-sm sm:text-base`}>
                  Donate via PayPal
                </a>
              )}
              {!siteData.venmoLink && !siteData.paypalLink && (
                <div className={`${theme.border} border-2 border-dashed rounded-lg p-6`}>
                  <p className="text-gray-500 text-sm sm:text-base">Payment links will appear here</p>
                </div>
              )}
            </div>
          </div>

          <div className={`${theme.secondary} rounded-lg p-6 sm:p-8`}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Other Ways to Give</h2>
            <div className="space-y-4 text-gray-700 text-sm sm:text-base">
              {siteData.paymentInfo ? (
                <p className="leading-relaxed">{siteData.paymentInfo}</p>
              ) : (
                <>
                  <p>• Mail a check to our office address</p>
                  <p>• Set up recurring monthly donations</p>
                  <p>• Consider planned giving options</p>
                  <p>• Donate goods or services</p>
                </>
              )}
            </div>
            <div className="mt-6 text-xs sm:text-sm text-gray-600">
              <p>We are a 501(c)(3) organization. Your donation is tax-deductible to the full extent allowed by law.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage: React.FC = () => (
<div className={`${font} py-8 sm:py-12`}>
  <div className="container mx-auto px-4 sm:px-6">
    <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">Contact Us</h1>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
      <div>
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${theme.accent}`}>Get In Touch</h2>
        <div className="space-y-6">
          {/* Email - Always shows */}
          <div className="flex items-start space-x-4">
            <Mail className={`h-5 w-5 sm:h-6 sm:w-6 mt-1 ${theme.accent} flex-shrink-0`} />
            <div>
              <h3 className="font-semibold mb-1 text-sm sm:text-base">Email</h3>
              <p className="text-gray-600 text-sm sm:text-base break-all">
                {siteData.email || 'info@yourorganization.org'}
              </p>
            </div>
          </div>
          
          {/* Address - Only shows if provided */}
          {siteData.address && siteData.address.trim() && (
            <div className="flex items-start space-x-4">
              <MapPin className={`h-5 w-5 sm:h-6 sm:w-6 mt-1 ${theme.accent} flex-shrink-0`} />
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Address</h3>
                <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line">
                  {siteData.address}
                </p>
              </div>
            </div>
          )}
          
          {/* Phone - Only shows if provided */}
          {siteData.phone && siteData.phone.trim() && (
            <div className="flex items-start space-x-4">
              <Phone className={`h-5 w-5 sm:h-6 sm:w-6 mt-1 ${theme.accent} flex-shrink-0`} />
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Phone</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {siteData.phone}
                </p>
              </div>
            </div>
          )}
          
          {/* Office Hours - Only shows if provided */}
          {siteData.officeHours && siteData.officeHours.trim() && (
            <div className="flex items-start space-x-4">
              <Clock className={`h-5 w-5 sm:h-6 sm:w-6 mt-1 ${theme.accent} flex-shrink-0`} />
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Office Hours</h3>
                <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line">
                  {siteData.officeHours}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
          
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${theme.accent}`}>Find Us</h2>
            <div className={`${theme.border} border-2 border-dashed rounded-lg h-48 sm:h-72`}>
              {siteData.address && siteData.address.trim() !== "" ? (
                <iframe
                  title="Google Map"
                  className="w-full h-full rounded-lg"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(siteData.address)}&output=embed`}
                ></iframe>
              ) : (
                <div className="text-center text-gray-500 p-4 flex flex-col items-center justify-center h-full">
                  <MapPin className="h-8 w-8 sm:h-12 sm:w-12 mb-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderPage = (): React.ReactElement => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'get-involved':
        return <GetInvolvedPage />;
      case 'donate':
        return <DonatePage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <FooterShort />
    </div>
  );
};


export default WebsiteTemplate;