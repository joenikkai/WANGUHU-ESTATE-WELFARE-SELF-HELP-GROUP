
import searchIcon from "../assets/search-finder-magnifying-glass-svgrepo-com.svg"

function Search() {
    return (
        <div
            className="text-sm bg-[#cce0f4] dark:bg-[#1e2d3e] p-0 flex flex-row rounded-full overflow-hidden border-[#E2E8F0] dark:border-[#2D3A4A]">
            <input  className=" focus:outline-none focus:ring-0 grow pl-12 border-0 font-bold text-2xl font-serif" type="search" name="search" id="search" />
            <button className="h-16 w-16 p-2 shrink"><img src={searchIcon} className="w-14 h-14" alt="search icon" /></button>
        </div>
    );
}

export default Search;