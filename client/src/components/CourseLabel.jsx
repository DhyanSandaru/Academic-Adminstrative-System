export default function CourseLabel(props) {
    return (
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg shadow-md">
            <span className="text-gray-700 font-medium">{props.module}</span>
        </div>
    )
}