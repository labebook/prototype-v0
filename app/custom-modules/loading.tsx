import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"

export default function CustomModulesLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="h-9 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-6 w-96 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border-b border-gray-100">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
