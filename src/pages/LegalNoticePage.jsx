import Navbar from "@/components/Navbar";

export default function LegalNoticePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Legal notice</h1>

        <h2 className="text-lg font-semibold mt-6">Project and Ownership</h2>
        <p className="text-sm mb-2">
          This website, Talkingo, is published by the Talkingo development team as part of a student project.
        </p>

        <h2 className="text-lg font-semibold mt-6">Purpose of the application</h2>
        <p className="text-sm mb-2">
          Talkingo is a non-commercial educational application designed to help users learn survival vocabulary in foreign languages, especially for travel contexts.
        </p>

        <h2 className="text-lg font-semibold mt-6">Data usage and privacy</h2>
        <p className="text-sm mb-2">
          No personal data is shared or used for commercial purposes. All stored data is strictly used for the functionality of the application (authentication, learning progress, etc.).
        </p>

        <h2 className="text-lg font-semibold mt-6">User rights</h2>
        <p className="text-sm mb-2">
            In accordance with the EU General Data Protection Regulation (GDPR), users have the right to access, modify or delete their data. For any inquiries, please contact us at 
          <a href="mailto:contact@talkingo.com" className="text-blue-600 underline"> contact@talkingo.com</a>.
        </p>

        <h2 className="text-lg font-semibold mt-6">Cookies and tracking</h2>
        <p className="text-sm mb-2">
          This site does not use cookies or third-party tracking services.
        </p>

        <h2 className="text-lg font-semibold mt-6">Accessibility</h2>
        <p className="text-sm mb-2">
          For accessibility concerns, Talkingo follows the general principles of the RGAA and aims to provide an inclusive user experience.
        </p>
      </main>
    </div>
  );
}