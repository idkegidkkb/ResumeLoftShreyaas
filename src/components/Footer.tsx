
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6Z" />
                </svg>
              </div>
              <span className="font-heading font-bold">ResumeForge</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Create professional resumes in minutes with our easy-to-use builder.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/features" className="hover:text-foreground">Features</Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-foreground">Templates</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-foreground">About</Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground">Careers</Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-foreground">Help Center</Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground">Privacy Policy</Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ResumeForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
