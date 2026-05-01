import logoLight from "../assets/logo-hero-light.svg";
import logoDark from "../assets/logo-hero-dark.svg";

function Logo({ className }: { className?: string }) {
    return (
        <div className={className}>
            <img src={logoLight} className="block dark:hidden w-full h-auto" alt="WEWSHG Logo" />
            <img src={logoDark} className="hidden dark:block w-full h-auto" alt="WEWSHG Logo" />
        </div>
    );
}

export default Logo;
