import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"

export default function ModuleDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6">
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-9 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
              <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
