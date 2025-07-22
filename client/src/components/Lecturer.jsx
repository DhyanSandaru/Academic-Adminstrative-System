import Badge from "./Badge"
export default function Student(props) {
    return (
       <div className="w-60 flex flex-col items-center justify-center">
            {/* Student Card */}
            <div className="relative bg-[#ffffff] rounded-3xl px-5 pt-4 pb-8 shadow-lg">
    
                {/* Blue corner accents */}
                <div className="absolute top-0 left-0 w-12 h-12 bg-[#253d90] rounded-tl-3xl rounded-br-3xl"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-[#253d90] rounded-br-3xl rounded-tl-3xl"></div>

                <div className="flex flex-col items-center text-center space-y-2">
                    {/* Profile Image */}
                    <div className="w-24 h-24 rounded-full border-4 border-[#ffc20e] overflow-hidden">
                        <img
                        src="\images\boy-icon.png"
                        alt="Joeylene Rivera"
                        className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Name */}
                    <h2 className="text-2xl font-bold text-[#000000]">Joeylene Rivera</h2>

                    {/* Student Details */}
                    <div className="space-y-2 text-[#000000]">
                        <p className="text-lg font-medium">Student ID: S8591</p>
                        <div>
                            <p className="font-medium">Enrolled Courses:</p>
                            <p className="text-gray-700">Chemistry, Mathematics, Physics</p>
                        </div>
                    </div>
                    <Badge status="Paid"/>
                </div>
            </div>
        </div>

    )
}