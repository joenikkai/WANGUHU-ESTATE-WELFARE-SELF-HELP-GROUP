
const resources = [
    ["My Dashboard","my-dashboard"],
    ["Products","products"],
    ["Services","services"],
    ["Help Desk","help-desk"],
    ["About Us","about-us",]
];

function Navbar() {
    return (
        <>
            <nav
                className="w-max h-max p-0 m-6 rounded-md bg-white text-[#1E2933] border border-[#E2E8F0] dark:bg-slate-800 dark:text-slate-200 dark:border-[#2D3A4A] overflow-hidden shadow-sm shadow-blue-800"
                style={{ display: "grid", gridTemplateColumns: `repeat(${resources.length+1}, minmax(0, 1fr))` }}
            >{resources.map((label, idx) => (
                <a href={ '/'+label[1]} className=" text-center h-max hover:bg-blue-100 dark:hover:bg-blue-950 transition-all duration-400 px-2 py-1 shadow-md hover:shadow-lg " key={idx}>{label[0]}</a>
            ))}
                <a href="/sign-up" className=" bg-orange-400 dark:bg-amber-700 text-center h-max hover:bg-orange-100 dark:hover:bg-orange-950 transition-all duration-400 px-2 py-1 shadow-md hover:shadow-lg " >Sign Up</a>
            </nav>
        </>
    );
}

export default Navbar;
