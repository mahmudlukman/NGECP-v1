const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center">
    <h1 className="text-6xl font-bold text-gray-700">404</h1>
    <p className="text-xl text-gray-500 mt-2">Page not found</p>
    <a
      href="/"
      className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dull transition"
    >
      Go Home
    </a>
  </div>
);

export default NotFound;
