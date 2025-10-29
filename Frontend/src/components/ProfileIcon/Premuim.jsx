import React from 'react';
import { Link } from 'react-router-dom';

const Premium = () => {
  return (
    <div className=" bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4 m-3! p-3!">
      <div className="p-3!">
        {/* Hero Section */}
        <section className="text-center mb-2!">
          <h1 className="text-5xl! md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-5!">
            Unlock Your Potential with Premium
          </h1>
          <p className="text-xl text-gray-600 mb-3! ">
            Elevate your career and supercharge your learning journey. Join thousands of professionals who are already thriving with our Premium membership. Choose the perfect plan for your goals and start today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4! ">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 p-2!">
              View Pricing Plans
            </button>
            <button className="border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-full text-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 p-2!">
                <Link to='/feeds'>Explore Free Trial
                </Link>
                
            </button>
          </div>
        </section>

        {/* Pricing Tiers Section */}
        <section className="m-5!">
          <h2 className="text-3xl! font-bold text-gray-900 text-center mb-5!">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl p-3! shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Basic</h3>
              <p className="text-4xl font-bold text-purple-600 mb-6 text-center">$0<span className="text-xl text-gray-500">/month</span></p>
              <ul className="space-y-4 mb-8 text-gray-700">
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Access to core courses</li>
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Basic networking</li>
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Community forums</li>
                <li className="flex items-center line-through text-gray-400"><span className="text-red-500 mr-2">✗</span> Premium jobs</li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-800 py-3 mt-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors p-2!">
                Current Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl p-3! shadow-xl border-2 border-purple-600 relative">
              <div className="absolute top-0 right-0 bg-purple-600 text-white p-2! rounded-tr-xl! text-sm font-semibold">Most Popular</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Premium</h3>
              <p className="text-4xl font-bold text-purple-600 mb-6 text-center">$9.99<span className="text-xl text-gray-500">/month</span></p>
              <ul className="space-y-4 mb-8 text-gray-700">
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Unlimited premium courses & certifications</li>
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Exclusive job opportunities</li>
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Freelance project marketplace</li>
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Priority networking & mentorship</li>
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> 24/7 premium support</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2! rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
                Upgrade to Premium
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-3! shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Enterprise</h3>
              <p className="text-4xl font-bold text-purple-600 mb-6 text-center">$29.99<span className="text-xl text-gray-500">/month</span></p>
              <ul className="space-y-4 mb-8 text-gray-700">
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Everything in Premium</li>
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Team collaboration tools</li>
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Custom learning paths</li>
                <li className="flex items-center"><span className="text-green-500 m-2!">✓</span> Dedicated account manager</li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-800 p-2! rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid md:grid-cols-3 gap-8 m-5!">
          <div className="bg-white rounded-2xl p-3! shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 m-2! text-center">Unlimited Access</h3>
            <p className="text-gray-600 text-center">
              Dive into unlimited premium courses, certifications, and resources designed to boost your skills and credentials.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3! shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 m-2! text-center">Exclusive Job Opportunities</h3>
            <p className="text-gray-600 text-center">
              Get access to premium job calls, recruiter connections, and high-impact opportunities that fast-track your career.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3! shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 m-2! text-center">Priority Networking & Support</h3>
            <p className="text-gray-600 text-center">
              Enjoy priority access to networking events, expert mentorship, and 24/7 premium support to guide your success.
            </p>
          </div>
        </section>

        {/* Premium Jobs Section */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-3! mb-10!">
          <h2 className="text-3xl! font-bold text-gray-900 text-center mb-8!">Premium Job Opportunities</h2>
          <p className="text-gray-600 text-center! mb-12!">
            Access handpicked job listings from top companies. Premium members get early access, personalized recommendations, and direct application support.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-3! shadow-md">
              <h4 className="font-semibold text-gray-900 m-2!">Senior Software Engineer</h4>
              <p className="text-sm text-gray-600 m-2!">Tech Corp • Remote</p>
              <p className="text-sm text-gray-500 m-2!">$120K - $150K</p>
              <button className="w-full bg-green-600 text-white p-2! rounded-lg hover:bg-green-700 transition-colors">Apply Now</button>
            </div>
            <div className="bg-white rounded-xl p-3! shadow-md">
              <h4 className="font-semibold text-gray-900 m-2!">Data Scientist</h4>
              <p className="text-sm text-gray-600 m-2!">Analytics Inc • New York</p>
              <p className="text-sm text-gray-500 m-2!">$110K - $140K</p>
              <button className="w-full bg-green-600 text-white p-2! rounded-lg hover:bg-green-700 transition-colors">Apply Now</button>
            </div>
            <div className="bg-white rounded-xl p-3! shadow-md">
              <h4 className="font-semibold text-gray-900 m-2!">Product Manager</h4>
              <p className="text-sm text-gray-600 m-2!">Innovate Ltd • San Francisco</p>
              <p className="text-sm text-gray-500 m-2!">$130K - $160K</p>
              <button className="w-full bg-green-600 text-white p-2! rounded-lg hover:bg-green-700 transition-colors">Apply Now</button>
            </div>
          </div>
        </section>

        {/* Freelancing Works Section */}
        <section className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Freelance & Gig Opportunities</h2>
          <p className="text-gray-600 text-center! mb-2!">
            Tap into our premium freelance marketplace. Connect with clients, bid on projects, and build your portfolio with high-paying gigs.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-10!">
            <div className="bg-white rounded-xl p-3! shadow-md">
              <h4 className="font-semibold text-gray-900 m-2!">UI/UX Design Project</h4>
              <p className="text-sm text-gray-600 m-2!">Startup • 2-4 weeks</p>
              <p className="text-sm text-gray-500 m-2!">$2,500 - $4,000</p>
              <button className="w-full bg-orange-600 text-white p-2! rounded-lg hover:bg-orange-700 transition-colors">Bid Now</button>
            </div>
            <div className="bg-white rounded-xl p-3! shadow-md">
              <h4 className="font-semibold text-gray-900 m-2!">Content Writing Gig</h4>
              <p className="text-sm text-gray-600 m-2!">Marketing Agency • Ongoing</p>
              <p className="text-sm text-gray-500 m-2!">$1,000 - $2,500/month</p>
              <button className="w-full bg-orange-600 text-white p-2! rounded-lg hover:bg-orange-700 transition-colors">Bid Now</button>
            </div>
            <div className="bg-white rounded-xl p-3! shadow-md">
              <h4 className="font-semibold text-gray-900 m-2!">Web Development Task</h4>
              <p className="text-sm text-gray-600 m-2!">E-commerce • 1 week</p>
              <p className="text-sm text-gray-500 m-2!">$1,500 - $3,000</p>
              <button className="w-full bg-orange-600 text-white p-2! rounded-lg hover:bg-orange-700 transition-colors  ">Bid Now</button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid lg:grid-cols-2 gap-12 mb-16! p-3!">
          <div >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Premium Courses & Learning Paths</h2>
            <p className="text-gray-600 m-6!">
              Gain expertise with our curated premium courses in high-demand fields like AI, Data Science, Leadership, and more. Earn certifications that stand out on your resume.
            </p>
            <ul className="space-y-4 m-10!">
              <li className="flex items-start space-x-3 m-1!">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 m-1!" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className=' m-1!'>Over 500+ premium courses with interactive projects</span>
              </li>
              <li className="flex items-start space-x-3 m-1!">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 m-1!" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className=' m-1!'>Personalized learning paths tailored to your career goals</span>
              </li>
              <li className="flex items-start space-x-3 m-1!">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 m-1!" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className=' m-1!'>Certificates recognized by top employers worldwide</span>
              </li>
              <li className="flex items-start space-x-3 m-1!">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 m-1! " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className=' m-1!'>Live webinars and Q&A sessions with industry experts</span>
              </li>
            </ul>
          </div>


          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Advanced Career Tools</h2>
            <div className='mr-10!'>
  <p className="text-gray-600 mb-8 m-6!">
              From resume builders to interview simulators, our premium tools help you prepare and succeed in every step of your career journey.
            </p>
            <ul className="space-y-4 m-10!">
              <li className="flex items-start space-x-3 m-1!">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0  m-1!" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className=' m-1!'>AI-powered resume optimization and ATS compatibility</span>
              </li>
              <li className="flex items-start space-x-3  m-1!">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0  m-1!" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className=' m-1!'>Mock interview practice with feedback</span>
              </li>
              <li className="flex items-start space-x-3 m-1!">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0  m-1!" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className=' m-1!'>Salary negotiation guides and market insights</span>
              </li>
              <li className="flex items-start space-x-3  m-1!">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0  m-1!" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className=' m-1!'>Portfolio builder for freelancers and creatives</span>
              </li>
            </ul>
              
            </div>
          
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16 p-3!">
          <h2 className="text-3xl font-bold text-gray-900 text-center m-3!">What Our Premium Members Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-3! shadow-lg">
              <p className="text-gray-600 italic text-center! m-3!">"Premium opened doors to exclusive jobs I never knew existed. Landed my dream role in just 2 months!"</p>
              <div className="flex items-center">
                <img className="w-10 h-10 rounded-full m-2!" src="/default-avatar.png" alt="User" />
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3! shadow-lg">
              <p className="text-gray-600 italic m-3!">"The freelance gigs and courses transformed my side hustle into a full-time business. Highly recommend!"</p>
              <div className="flex items-center">
                <img className="w-10 h-10 rounded-full  m-2!" src="/default-avatar.png" alt="User" />
                <div>
                  <p className="font-semibold text-gray-900">Mike Chen</p>
                  <p className="text-sm text-gray-500">Freelance Designer</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-2!  shadow-lg">
              <p className="text-gray-600 italic p-3!">"Mentorship and priority support made all the difference in my career pivot. Worth every penny."</p>
              <div className="flex items-center m-2!">
                <img className="w-10 h-10 rounded-full mr-4" src="/default-avatar.png" alt="User" />
                <div>
                  <p className="font-semibold text-gray-900">Emily Rodriguez</p>
                  <p className="text-sm text-gray-500">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-white rounded-2xl p-10! m-3! shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4!">Ready to Transform Your Career?</h2>
          <p className="text-gray-600 mb-8 text-center! mb-6!">
            Join Premium today and start enjoying exclusive benefits that accelerate your professional growth. Your success story begins here. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white  rounded-md! text-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 p-2!">
              Get Started - Free 7-Day Trial
            </button>
            <button className="border-2 border-purple-600 text-purple-600 p-2! rounded-lg! text-xl font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 ">
              Learn More
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Premium;