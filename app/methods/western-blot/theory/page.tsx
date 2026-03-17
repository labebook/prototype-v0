export default function WesternBlotTheoryPage() {
  return (
    <>
      {/* Main Illustration - Western Blot Transfer Process */}
      <div className="w-full">
        <div className="bg-[#E8F4F8] rounded-lg p-8">
          <div className="flex items-start justify-center gap-16">
            {/* Protein bands section */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 italic">Protein bands</h3>
              <div className="relative">
                {/* Gel diagram */}
                <div className="w-32 h-48 bg-white border border-gray-300 rounded relative">
                  {/* Marker labels */}
                  <div className="absolute -left-8 top-8 text-sm text-gray-600">60</div>
                  <div className="absolute -left-8 top-16 text-sm text-gray-600">46</div>
                  
                  {/* Dashed lines representing protein bands */}
                  <div className="absolute top-8 left-2 right-2 border-t-2 border-dashed border-gray-400"></div>
                  <div className="absolute top-16 left-2 right-2 border-t-2 border-dashed border-gray-400"></div>
                </div>
                
                {/* Arrow pointing down */}
                <div className="flex justify-center mt-2">
                  <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L12 36M12 36L6 30M12 36L18 30" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Transfer sandwich section */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 italic">Transfer sandwich</h3>
              <div className="relative">
                {/* Stacked layers representing transfer sandwich */}
                <div className="space-y-1">
                  {/* Top layer - filter paper */}
                  <div className="w-48 h-6 bg-white border border-gray-300 rounded transform rotate-[-5deg] translate-x-2"></div>
                  
                  {/* Membrane with colored bands */}
                  <div className="w-48 h-8 bg-white border border-gray-300 rounded transform rotate-[-5deg] translate-x-1 relative">
                    <div className="absolute top-2 left-4 flex gap-1">
                      <div className="w-2 h-3 bg-cyan-400"></div>
                      <div className="w-2 h-3 bg-cyan-300"></div>
                      <div className="w-2 h-3 bg-red-400"></div>
                      <div className="w-2 h-3 bg-cyan-400"></div>
                    </div>
                  </div>
                  
                  {/* Gel layer */}
                  <div className="w-48 h-6 bg-yellow-100 border border-yellow-300 rounded transform rotate-[-5deg]"></div>
                  
                  {/* Bottom filter paper */}
                  <div className="w-48 h-6 bg-yellow-50 border border-gray-300 rounded transform rotate-[-5deg] -translate-x-1"></div>
                  
                  {/* Base layer */}
                  <div className="w-48 h-6 bg-white border border-gray-300 rounded transform rotate-[-5deg] -translate-x-2"></div>
                </div>
                
                {/* Arrow pointing down */}
                <div className="flex justify-center mt-4">
                  <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L12 36M12 36L6 30M12 36L18 30" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
