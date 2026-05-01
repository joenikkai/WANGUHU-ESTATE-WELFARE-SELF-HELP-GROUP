import searchIcon from "../assets/search-finder-magnifying-glass-svgrepo-com.svg"

function Search() {
    return (
        <div
            className="text-sm bg-[#FFFFFF] dark:bg-[#1A2433] p-0 flex flex-row rounded-full overflow-hidden border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm focus-within:shadow-md transition-shadow">
            <input  
                className="focus:outline-none focus:ring-0 grow pl-12 border-0 font-bold text-xl font-['Outfit'] text-[#1E2933] dark:text-[#E2E8F0] placeholder:text-[#5A6B7A] dark:placeholder:text-[#94A3B8]" 
                type="search" 
                name="search" 
                id="search" 
                placeholder="Search assets, records..."
            />
            <button className="h-16 w-16 p-2 shrink flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <img src={searchIcon} className="w-8 h-8 dark:invert opacity-70" alt="search icon" />
            </button>
        </div>
    );
}

export default Search;