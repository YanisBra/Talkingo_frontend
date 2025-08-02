import { Link } from 'react-router-dom';

export default function Footer() {
  return (
<footer className="text-center text-sm py-4 mt-auto">
      © 2025 Talkingo · <Link to="/legal" className="text-pink-500 hover:underline">Legal notice</Link>
    </footer>
  );
}