import { Search } from "@/components/search-home"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ScientificMethodManager() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4">
        <section className="py-16 text-center">
          <h1 className="text-3xl font-semibold mb-4">Scientific Method Manager</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Search, organize, and build pipelines
            <br />
            with scientific methods from our comprehensive library.
          </p>
        </section>

        <section className="mb-16">
          <Search />
        </section>
      </main>

      <Footer />
    </div>
  )
}
