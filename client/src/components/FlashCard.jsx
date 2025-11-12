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
}) {
  const colors = themeStyles[theme] || themeStyles.blue;
  return (
    <div className="rounded-xl bg-white h-auto w-full shadow-sm">
      <h2 className="text-black text-md bg-gray-100 text-left w-full py-3 pl-2">
        {title}
      </h2>

      <div className="flex flex-col bg-white">
        <div className="flex flex-row items-center my-3 ml-5">
          <Icon className={`bg-${theme}-100 text-${theme}-700 p-2 rounded-4xl w-12 h-12 my-3`} />
          <h2 className="text-black text-4xl">{value}</h2>
          {changedNo && percentage && (
            <p className="text-green-700 ml-auto self-start">{`${percentage}%`}</p>
          )}
        </div>

        {changedNo && percentage && (
          <p className="text-gray-500 text-sm text-left ml-5">{`${changedNo} from last month`}</p>
        )}
      </div>
    </div>
  );
}
