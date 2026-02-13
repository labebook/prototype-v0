import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <p className="text-gray-600">© 2025 Plyow. All rights reserved.</p>
          </div>

          <div className="flex space-x-6">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
