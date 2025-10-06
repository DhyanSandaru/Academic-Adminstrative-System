import axios from "axios";
import { Sparkles, X } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

export default function RemoteReg(){
    const [newCode,setNewCode] = useState("")
    const [showCodePopup,setShowCodePopup] = useState(false)

    const fetchNewCode = async () => {
        try{
            const response = await axios.get("http://localhost:8000/api/new-code")
            setNewCode(response.data.code);
        }
        catch(err){
             if (err.response) {
                // server responded with a status != 2xx
                console.error("Server error:", err.response.status, err.response.data);
            } else if (err.request) {
                // request made but no response received
                console.error("No response received", err.request);
            } else {
                // anything else
                console.error("Error:", err.message);
            }
        }
    }

    useEffect(() => {
    if (showCodePopup) {
        fetchNewCode();
    }
    }, [showCodePopup]);


    return(
        <div className="rounded-xl w-full p-10 flex flex-col gap-5">
            <div className="flex flex-row gap-8 items-center w-full bg-white p-8 rounded-xl">
                <p className="text-black text-lg">Generate a new code</p>
                <button
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
                onClick={() => setShowCodePopup(true)}
                >
                <Sparkles />
                <span className="font-semibold text-md">Generate</span>
                </button>

            </div>

            <div className="rounded-xl bg-white p-8">
                <h2 className="text-black border-b-2 border-gray-300">Current Requests</h2>

            </div>
            {showCodePopup && (
                <div className="fixed inset-0 z-50  backdrop-blur-md flex justify-center items-center">
                    <div className="bg-white w-[90%] max-w-md rounded-lg shadow-xl flex flex-col justify-center items-center p-6 relative">
                        <button
                        onClick={() => setShowCodePopup(false)}
                        className="absolute top-3 right-3 hover:bg-gray-200 rounded-full p-1"
                        >
                        <X className="text-black w-5 h-5" />
                        </button>

                        <p className="text-black my-3 text-lg font-semibold">New code generated!</p>

                        <div className="bg-blue-500 rounded-lg px-6 py-3 w-full text-center">
                        <p className="text-white text-lg font-semibold tracking-wider">{newCode}</p>
                        </div>

                        <p className="text-black my-3 text-sm text-center px-4">
                        This code can be used to access the registration portal.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}