export default function Badge(props) {
        if(props.status === "Paid") {
            return(
                <div className="bg-green-500 rounded-2xl p-1 w-20">
                    <span>{props.status}</span>
                </div>
            )
        } else if(props.status === "Unpaid") {
            return(
                <div className="bg-red-500 rounded-2xl p-1 w-20">
                    <span>{props.status}</span>
                </div>
            )
        }
      

}