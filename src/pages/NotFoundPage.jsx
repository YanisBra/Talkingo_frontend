import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-200 to-purple-200 text-gray-800 flex flex-col justify-center items-center px-6">
      <h1 className="text-7xl font-black mb-4 tracking-tight">404</h1>
      <p className="text-xl mb-6 text-center ">
        Oops... Either you're lost, or you've just invented a new language
        <br />
        Unfortunately, Talkingo doesn't speak it (yet).
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-white/40 hover:bg-white/60 text-black font-medium rounded-lg shadow-md backdrop-blur-md transition cursor-pointer"
      >
        Return to Dashboard
      </button>
    </div>
  );
}
