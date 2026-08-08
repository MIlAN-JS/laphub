import { useNavigate, Link } from "react-router-dom";
import { FiShoppingBag, FiTag } from "react-icons/fi";
import Logo from "../../../../components/Navbar/Logo";
import LanguageSelector from "../../../../components/Navbar/LanguageSelector";
import ecomLaptop from "../../../../assets/ecom-laptop.jpg";

const ACCOUNT_TYPES = [
  {
    key: "buyer",
    path: "/register/buyer",
    icon: FiShoppingBag,
    title: "Buyer",
    description: "Browse and buy laptops from verified sellers worldwide",
  },
  {
    key: "seller",
    path: "/register/seller",
    icon: FiTag,
    title: "Supplier",
    description: "Sell your laptops to thousands of business buyers",
  },
];

export default function RegisterComponent() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full  flex flex-col ">
      <header className="flex items-center gap-6  py-8 sm:px-6 ">
        <Logo />
        <LanguageSelector />
      </header>

      <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-8 px-4 pb-8 sm:px-6 max-w-10xl w-full mx-auto ">
        {/* Left image panel — hidden on small screens */}
        <div className="hidden lg:block lg:w-1/2 relative rounded-2xl overflow-hidden">
          <img
            src={ecomLaptop}
            alt="LapHub marketplace"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />

          <div className="relative z-10 flex flex-col justify-end h-full p-10 text-white">
            <h1 className="text-3xl font-bold leading-tight mb-3">
              Buy and sell laptops on the marketplace built for hardware
              people.
            </h1>
            <ul className="space-y-2 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                Browse thousands of listings from verified sellers
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                Compare real-time prices on every deal
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                List your own laptops in minutes
              </li>
            </ul>
          </div>
        </div>

        {/* Right selection panel */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-ink mb-1">
              Which account would you like to create?
            </h2>
            <p className="text-sm text-neutral mb-6">
              Choose how you want to use LapHub.
            </p>

            <div className="space-y-4">
              {ACCOUNT_TYPES.map(({ key, path, icon: Icon, title, description }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => navigate(path)}
                  className="w-full flex items-center gap-4 text-left border border-neutral/40 bg-white hover:border-accent hover:ring-2 hover:ring-accent/20 rounded-xl p-5 transition"
                >
                  <span className="w-4 h-4 rounded-full border-2 border-neutral/50 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-ink">
                      {title}
                    </h3>
                    <p className="text-sm text-neutral mt-0.5">
                      {description}
                    </p>
                  </div>
                  <span className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </span>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-neutral mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-olive hover:text-accent transition"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
