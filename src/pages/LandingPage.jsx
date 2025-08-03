import { useNavigate } from "react-router-dom";
import Navbar from "@/layouts/Navbar";
import BlackButton from "../components/BlackButton";
import WhiteButton from "../components/WhiteButton";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section>
        <div className="max-w-6xl mx-auto px-6 pt-16 text-center flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold tracking-tight">
            Learn the essentials, travel with confidence.
          </h1>
          <p className="text-xl text-gray-700 mb-8 mt-8">
            Talkingo helps you master essential phrases before your trip – for
            free, with ease.
          </p>
          <div className="flex gap-4 mb-6">
            <BlackButton
              onClick={() => navigate("/register")}
              paddingX={4}
              paddingY={2}
              label="Get Started"
            />
            <WhiteButton
              onClick={() => navigate("/login")}
              paddingX={4}
              paddingY={2}
              label="Log in to continue"
            />
          </div>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Why Talkingo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:scale-[1.01] transition">
              <h3 className="text-xl font-semibold mb-2">
                Thematic Learning
              </h3>
              <p>
                Choose from real-world categories such as airport, restaurant,
                shopping and more. Each theme is designed for practical travel
                use.
              </p>
            </div>
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:scale-[1.01] transition">
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p>
                Visualize your learning stats, track known phrases, and monitor
                your improvement across all themes and languages.
              </p>
            </div>
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:scale-[1.01] transition">
              <h3 className="text-xl font-semibold mb-2">Collaborative Groups</h3>
              <p>
                Create or join travel groups to stay motivated, share progress,
                and reach common language goals together.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
