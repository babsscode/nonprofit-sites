import { ArrowRight, Clock, Zap, Heart, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Launch in Minutes",
      description: "Fill out one simple form and watch your professional website come to life instantly"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Zero Technical Skills",
      description: "No coding, no design experience, no tech experience. Just your mission and we do the rest"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Built for Nonprofits",
      description: "Donation buttons, volunteer forms, event calendars - everything your cause needs"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Professional Results",
      description: "Beautiful, mobile-responsive websites that make your organization look established"
    }
  ];

  {/**const testimonials = [
    {
      name: "Sarah Chen",
      role: "Director, Local Food Bank",
      quote: "We went from having no website to a stunning professional site in under 10 minutes. Our donations increased by 40% in the first month!"
    },
    {
      name: "Marcus Johnson",
      role: "Founder, Youth Mentorship Program",
      quote: "I'm not tech-savvy at all, but this made me look like a web design expert. The volunteer sign-ups started rolling in immediately."
    },
    {
      name: "Elena Rodriguez",
      role: "Community Outreach Coordinator",
      quote: "Finally, a solution that understands what nonprofits actually need. The built-in donation system is a game-changer."
    }
  ]; */}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-800/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
          
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Professional Websites for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 block">
                Nonprofits in Minutes
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Stop letting technology hold your mission back. Create a stunning, professional website 
              by simply filling out a form. No coding, no complexity, no compromises.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button onClick={() => navigate('/login')} className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Building Now
                <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/example')} className="text-blue-900 font-semibold px-8 py-4 hover:text-blue-500 transition-colors duration-300">
                See An Example →
              </button>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-blue-100">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-br from-blue-50 to-white">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Hope Community Center</h3>
                    <p className="text-gray-600 mb-6">Empowering families, building stronger communities</p>
                    <div className="flex justify-center gap-4">
                      <div className="bg-blue-600 text-white px-6 py-2 rounded-lg">Donate Now</div>
                      <div className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg">Volunteer</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transform rotate-12 shadow-lg">
                Made in 5 minutes!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From Mission to Website in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              No technical experience required. Seriously.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Fill Out One Form",
                description: "Tell us about your organization, mission, and what you need. Takes about 5 minutes.",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "2", 
                title: "We Build It Instantly",
                description: "Our smart system creates a professional website tailored to your nonprofit's needs.",
                color: "from-blue-600 to-blue-700"
              },
              {
                step: "3",
                title: "Launch & Grow",
                description: "Your website goes live immediately. Start accepting donations and volunteers today.",
                color: "from-blue-700 to-blue-800"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 h-full">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} text-white rounded-lg flex items-center justify-center text-xl font-bold mb-6`}>
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Your Nonprofit Needs
            </h2>
            <p className="text-xl text-gray-600">
              Built by people who understand the unique challenges of nonprofit work
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          {/**          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              { icon: <Users className="w-8 h-8" />, title: "Donation Integration", desc: "Secure payment processing built-in" },
              { icon: <Heart className="w-8 h-8" />, title: "Volunteer Management", desc: "Sign-up forms and scheduling tools" },
              { icon: <Globe className="w-8 h-8" />, title: "Mobile Responsive", desc: "Perfect on phones, tablets, and desktops" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-600 mb-4 flex justify-center">{item.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Testimonials <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Nonprofit Leaders
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of organizations already making a bigger impact online
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-100">
                <div className="flex text-blue-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-blue-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Amplify Your Impact?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Stop letting technology hold your mission back. Create your professional website today.
          </p>
          <button onClick={() => navigate('/login')} className="group bg-white text-blue-800 px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
          </button>
          
        </div>
      </div>

      {/* Footer <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">NonprofitBuilder</h3>
              <p className="text-gray-400 mb-4">
                Empowering nonprofits with professional websites that drive their mission forward.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Nonprofit Sites.</p>
          </div>
        </div>
      </div>*/}
      
    </div>
  );
}