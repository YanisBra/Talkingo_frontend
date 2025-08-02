import { useState } from "react";

export default function GroupCodeDisplay({ groupCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-4 text-sm text-gray-600">
      Group code:{" "}
      <span
        onClick={handleCopy}
        className="ml-1 px-2 py-1 bg-white/60 hover:bg-white/90 rounded cursor-pointer text-pink-600 font-mono transition"
        title="Click to copy"
      >
        {groupCode}
      </span>
      {copied && (
        <span className="text-green-600 text-sm ml-2 transition-opacity duration-300">
          Code copied!
        </span>
      )}
    </div>
  );
}