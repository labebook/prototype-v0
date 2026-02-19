import { Search } from "@/components/search-home"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"

export default function ScientificMethodManager() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          <section className="text-center mb-12">
            <h1 className="text-3xl font-semibold mb-4">Scientific Method Manager</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search, organize, and build pipelines
              <br />
              with scientific methods from our comprehensive library.
            </p>
          </section>

          <section className="w-full max-w-3xl">
            <Search />
          </section>
        </main>
      </div>

      <Footer />
    </div>
  )
}
