import './index.css';
import {Link} from 'react-router-dom'
const Updates = () => {
    const versionHistory = [
        {
            version: "2.1.0",
            date: "April 15, 2024",
            features: [
                "Redesigned user dashboard with improved navigation",
                "Added dark mode support",
                "Performance optimizations for faster loading"
            ],
            highlight: true
        },
        {
            version: "2.0.0",
            date: "February 28, 2024",
            features: [
                "Complete UI overhaul with modern design",
                "New notification system",
                "Enhanced security features"
            ]
        },
        {
            version: "1.5.3",
            date: "December 10, 2023",
            features: [
                "Bug fixes for mobile responsiveness",
                "Improved form validation",
                "Minor UI tweaks"
            ]
        },
        {
            version: "1.5.0",
            date: "October 5, 2023",
            features: [
                "Added multi-language support",
                "New reporting dashboard",
                "Integration with third-party APIs"
            ]
        }
    ];

    return (
        <div className="flex flex-col justify-center p-3 m-3">
            <button className='bg-blue-50 p-2 m-2 ' ><Link to='/myProfile'><span className='text-2xl no-underline!'>back</span></Link></button>
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-light text-gray-800 mb-2">Application Updates</h1>
                <p className="text-lg text-gray-600 mb-6">Stay informed about the latest improvements and features</p>
                <div className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg shadow-blue-200">
                    Current Version: 2.1.0
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-red-200">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200"></div>
                
                {versionHistory.map((update, index) => (
                    <div 
                        key={index} 
                        className={`relative mb-10 pl-8 ${update.highlight ? 'bg-blue-50 p-6 rounded-lg - ml-10' : ''}`}
                    >
                        {/* Version marker */}
                        <div className="absolute -left-12 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-medium text-sm shadow-md">
                            {update.version}
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-800">Version {update.version}</h3>
                            <p className="text-sm text-gray-500">{update.date}</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                {update.features.map((feature, fIndex) => (
                                    <li key={fIndex}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-16 border-t border-gray-200 pt-8">
                <p className="text-gray-600 mb-4">Want to know more about our development process?</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
                    Contact Our Team
                </button>
            </div>
        </div>
    );
};

export default Updates;