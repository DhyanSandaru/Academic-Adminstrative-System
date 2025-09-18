export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="flex flex-row gap-0 bg-white h-15 rounded-full overflow-hidden w-[50vw] border-1 border-black mb-7">
      <input
        type="text"
        placeholder="Search..."
        name="search"
        value={value}
        onChange={onChange}
        className="flex-5/7 text-center outline-none"
      />
      <button
        type="button"
        onClick={onSearch}
        className="m-2 flex-0.5/7"
      >
        <img src="/images/search.png" alt="search_icon" className="w-7" />
      </button>
    </div>
  );
}