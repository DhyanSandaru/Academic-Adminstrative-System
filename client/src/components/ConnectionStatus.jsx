import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react"; // optional icons if using lucide-react

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="h-11">
      {isOnline ? (
        <Wifi  className="text-gray-600 hover:bg-green-200 h-full w-full p-2 rounded-full"/>
      ) : (
        <WifiOff className="text-gray-600 hover:bg-red-200 h-full w-full p-2 rounded-full"/>
      )}
    </div>
  );
}
