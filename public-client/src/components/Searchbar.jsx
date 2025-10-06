import { Loader2, Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSearch, loading }) {
  return (
    <div className="flex flex-row  bg-white h-12 rounded-xl overflow-hidden border-1 border-gray-300 items-center">
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
        {loading ? (
          <Loader2 className='animate-spin text-gray-600'/>
        ) : (
          <Search className='text-gray-600'/>
        )}
      </button>
    </div>
  );
}