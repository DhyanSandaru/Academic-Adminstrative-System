import { X } from "lucide-react";

const themeStyles = {
  blue: "bg-blue-100 text-blue-700",
  red: "bg-red-100 text-red-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  yellow: "bg-yellow-100 text-yellow-700",
};

export default function FlashCard({
  icon: Icon, 
  title, 
  value, 
  theme = "blue", 
  onRemove,
  changedNo,
  percentage 
})
  {
    const colors= themeStyles[theme] || themeStyles.blue;
    return(
      <div className="rounded-2xl shadow-md bg-white pl-6 pr-0 flex flex-row items-center justify-between gap-3 h-28">
        <Icon className={`bg-${theme}-100 text-${theme}-700 p-2 rounded-4xl w-12 h-12 my-3`} />
        <div className="flex flex-col items-start my-3">
          <p className="text-gray-500 text-sm font-light">{title}</p>
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-black font-semibold text-xl">{value}</h2>
            {changedNo && percentage && (
              <p className="text-green-700">{`${percentage}%`}</p>
            )}    
          </div>
          <br/>
          {changedNo && percentage && (
              <p className="text-gray-500 text-xs">{`${changedNo} from last month`}</p>
            )}    
          
        </div>
        <button 
          onClick={onRemove}
          className="hover:bg-red-400 text-white self-stretch flex items-center justify-center px-3 rounded-r-2xl"
        >
          <X className="text-black w-4" />
        </button>
      </div>
    )
  }


