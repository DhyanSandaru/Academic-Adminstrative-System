export default function SearchBar(){
    return(
        <div className="flex flex-row gap-0 bg-white h-15 rounded-full overflow-hidden w-[70vw]">
            <div className="flex bg-[#121c3e] flex-1/7 items-center justify-center">
                <p>All Students</p>
            </div>
            <input type="text" placeholder="Search.." name="search" className="flex-5/7 "/>
            <button className="m-2 flex-0.5/7"><img src="/images/search.png" alt="search_icon" className="w-7"/></button>
        </div>
    )
}