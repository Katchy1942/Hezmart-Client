import { Link } from "react-router-dom"
import { FaUsers, FaWrench, FaChartBar, FaChartLine } from 'react-icons/fa';

const SellOnHezmart = () => {

    const features = [
        {
            title: "Vast Network",
            description: `Selling on Hezmart opens the door to a vast 
            network of eager customers, transforming how you reach your market.`,
            icon: <FaUsers className="w-4 h-4 text-blue-600" />,
            bgColor: "bg-blue-50"
        },
        {
            title: "Intuitive Tools",
            description: `Our platform is designed with seller convenience at its core 
            offering tools that streamline listing and fulfillment.`,
            icon: <FaWrench className="w-4 h-4 text-emerald-600" />,
            bgColor: "bg-emerald-50"
        },
        {
            title: "Powerful Analytics",
            description: `Beyond just ease of use, we provide powerful analytics to help
             you understand your performance and sales trends.`,
            icon: <FaChartBar className="w-4 h-4 text-purple-600" />,
            bgColor: "bg-purple-50"
        },
        {
            title: "Scalability",
            description: `As your business grows, Hezmart adapts to support 
            your expanding needs, making success simpler and faster.`,
            icon: <FaChartLine className="w-4 h-4 text-orange-600" />,
            bgColor: "bg-orange-50"
        }
    ];

    const steps = [
        {
            id: 0,
            heading: 'Register',
            content: 'Visit Hezmart\'s website and fill out ' +
                'the seller registration form with your ' +
                'personal and business details. Provide ' +
                'necessary documents like ID and business ' +
                'verification if required.'
        },
        {
            id: 1,
            heading: 'Wait for Approval',
            content: 'Submit your application and wait for ' +
                'Hezmart\'s team to review it. Approval ' +
                'timelines may vary depending on the ' +
                'verification process.'
        },
        {
            id: 2,
            heading: 'Study Rules and Regulations',
            content: 'Familiarize yourself with Hezmart\'s policies, ' +
                'including pricing, shipping, and customer ' +
                'service guidelines, to ensure smooth operations.'
        },
        {
            id: 3,
            heading: 'Login and Start Selling',
            content: 'Once approved, log in to your ' +
                'seller dashboard, list your products, and ' +
                'begin managing your sales through the ' +
                'platform.'
        },
    ]

    return (
        <div className="max-w-6xl mx-auto px-4 lg:px-8 pb-20">
            <div
                className="flex items-center gap-2 py-6
                text-sm text-gray-500 font-medium"
            >
                <Link
                    to='/'
                    className="hover:text-primary-dark transition-colors"
                >
                    Home
                </Link>
                <span>/</span>
                <span className="text-gray-800">
                    Sell on Hezmart
                </span>
            </div>

            <div className="mb-12">
                <div className="relative z-10">
                    <h1
                        className="text-2xl lg:text-4xl
                        font-extrabold text-gray-900 tracking-tight
                        leading-tight text-center font-['poppins']"
                    >
                        Why Sell On Hezmart?
                    </h1>
                    <p className="mt-2 text-sm text-center text-gray-600 max-w-2xl mx-auto">
                        Everything you need to grow your business, built into one powerful platform.
                    </p>
                </div>
            </div>

            <div className="w-full mb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300
                                border border-gray-100 flex flex-col items-start"
                            >
                                <div className={`${feature.bgColor} p-3 rounded-full mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold font-['poppins'] text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span
                        className="text-primary-light font-semibold
                        tracking-wider uppercase text-sm"
                    >
                        Process
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-['poppins'] font-bold mt-2">
                        How to Start
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="bg-white rounded-2xl p-8
                            shadow-md border border-gray-100 hover:shadow-xl
                            transition-shadow duration-300"
                        >
                            <div
                                className="w-12 h-12 rounded-full
                                bg-primary-light text-white flex
                                items-center justify-center text-xl font-bold
                                mb-4 shadow-sm"
                            >
                                {step.id + 1}
                            </div>
                            <h3
                                className="text-xl font-bold
                                text-gray-800 mb-3 font-['poppins']"
                            >
                                {step.heading}
                            </h3>
                            <p
                                className="text-gray-600 leading-relaxed
                                text-sm"
                            >
                                {step.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        to="/vendor-register"
                        className="inline-flex w-full sm:w-[25%] items-center justify-center
                        bg-primary-light text-white font-semibold py-3
                        shadow-lg text-lg group px-6 rounded-full"
                    >
                        Continue
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SellOnHezmart