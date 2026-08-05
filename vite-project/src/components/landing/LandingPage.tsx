import { ArrowRight, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import TextType from './TextType';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
             

              {/* Headline */}
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Take Control of your <br />{' '}
                <TextType
                  text={["Money.", "capital.", "Funds."]}
                  as="span"
                  typingSpeed={180}
                  pauseDuration={4000}
                  deletingSpeed={150}
                  showCursor={true}
                  cursorCharacter="."
                  className="text-transparent bg-clip-text text-yellow-700"
                  cursorClassName="text-yellow-700"
                />
                {' '}
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 leading-relaxed">
                Manage your money securely with modern digital banking. 
                Experience seamless transactions, real-time insights, and banking that works for you.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/add-account"
                  className="group bg-black text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Open Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/accounts"
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 hover:border-blue-300"
                >
                  Explore Features
                </Link>

               
              </div>

              
            </div>

            {/* Right Content - Banking Illustration */}
            <div className="relative animate-fade-in-up-delayed">
              {/* Floating Cards */}
              <div className="relative w-full h-[600px] flex items-center justify-center">
                
                {/* Main Card */}
                <div className="absolute z-10 w-80 h-48 bg-blue-700 rounded-3xl shadow-2xl p-6 text-white animate-float">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-blue-100 text-sm">Total Balance</p>
                      <h3 className="text-3xl font-bold mt-1">₹24,582.50</h3>
                    </div>
                    {/* <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Zap size={24} />
                    </div> */}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-blue-100">**** **** **** 4829</p>
                      <p className="text-xs text-blue-200 mt-1">Exp: 12/29</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-100">Cardholder</p>
                      <p className="text-sm font-semibold">Vijay singh shekhawat</p>
                    </div>
                  </div>
                </div>

                {/* Floating Transaction Card */}
                <div className="absolute top-10 right-0 w-64 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Loan Approved</p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                    <p className="text-sm font-bold text-blue-700">₹2,450</p>
                  </div>
                  <div className="h-20 bg-blue-200 rounded-xl flex items-end justify-around p-2">
                    <div className="w-3 h-8 bg-green-400 rounded-full"></div>
                    <div className="w-3 h-12 bg-blue-400 rounded-full"></div>
                    <div className="w-3 h-10 bg-purple-400 rounded-full"></div>
                    <div className="w-3 h-16 bg-green-500 rounded-full"></div>
                    <div className="w-3 h-14 bg-blue-500 rounded-full"></div>
                    <div className="w-3 h-18 bg-purple-500 rounded-full"></div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="absolute bottom-20 left-0 w-56 bg-white rounded-2xl shadow-xl p-4 animate-float-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Shield size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Secured</p>
                      <p className="text-xs text-gray-500">256-bit Encryption</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1">
                    <div className="flex-1 h-1 bg-blue-700 rounded-full"></div>
                    <div className="flex-1 h-1 bg-blue-700 rounded-full"></div>
                    <div className="flex-1 h-1 bg-blue-700 rounded-full"></div>
                    <div className="flex-1 h-1 bg-blue-400 rounded-full"></div>
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-1 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-16 ">
            <p className="text-l text-gray-600">
              NextGen is perfect Bank for modern culture
            </p>
          </div>
          <div className="text-right mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Banking Built Around <br />You. Smart , Secure And <br /> Effortless
            </h2>
            <p className="text-l text-gray-600">
              Safe , Simple and Smart Digital Banking - at all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-yellow-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <img src="https://cdn-icons-png.flaticon.com/128/4519/4519107.png" alt="" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Business Banking</h3>
              <p className="text-gray-600">
                Send and receive money instantly with zero fees. Your transactions are processed in real-time.
              </p>
            </div>

            <div className="bg-purple-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <img src="https://cdn-icons-png.flaticon.com/128/12299/12299094.png" alt="" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Bank-Level Security</h3>
              <p className="text-gray-600">
                Your data is protected with 256-bit encryption and multi-factor authentication.
              </p>
            </div>

            <div className="relative bg-white rounded-2xl p-8 shadow-lg overflow-hidden">

  <img
    src="https://cdn.pixabay.com/photo/2018/10/11/16/33/saving-3740194_1280.jpg"
    alt=""
    className="absolute inset-0 w-full h-full object-cover opacity-40"
  />

  <div className="relative z-10">
    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
      <img
        src="https://cdn-icons-png.flaticon.com/128/12866/12866542.png"
        alt=""
        className="w-10 h-10"
      />
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-3">
      Personal Saving Account
    </h3>

    <p className="text-gray-600">
      Easy To Open. No minimum balance required.
    </p>
  </div>

</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-700 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to transform your banking experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied customers who have already made the switch.
            </p>
            <Link
              to="/add-account"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started Today
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
