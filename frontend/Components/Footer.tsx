export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">

        <p className="text-sm text-gray-500">
          © 2026 Reilio Health. All rights reserved.
        </p>

        <div className="flex gap-6 mt-4 md:mt-0 text-sm">
          <a href="#" className="text-gray-600 hover:text-blue-600">
            Privacy Policy
          </a>

          <a href="#" className="text-gray-600 hover:text-blue-600">
            Terms
          </a>

          <a href="#" className="text-gray-600 hover:text-blue-600">
            Contact
          </a>
        </div>

      </div>
    </footer>
  );
}