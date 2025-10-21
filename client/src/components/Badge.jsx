export default function Badge(props) {
        if(props.status === "Paid") {
            return(
                <div className="bg-green-500 rounded-2xl p-1 w-fit text-center">
                    <span className="text-white text-sm">{props.status}</span>
                </div>
            )
        } else {
            return(
                <div className="bg-red-500 rounded-2xl px-3 py-1 w-fit text-center">
                    <span className="text-white text-sm">{props.status}</span>
                </div>
            )
        }
      

}