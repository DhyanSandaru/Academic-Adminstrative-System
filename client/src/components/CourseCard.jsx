import { BookOpen, User, ArrowRight } from 'lucide-react';

export default function CourseCard({
  name,
  courseId,
  lecturer,
  courseBanner,
  onClick
}) {
  const bannerSrc = courseBanner || null;

  return (
    <div
      className="group bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Course Banner */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-600">
        {bannerSrc ? (
          <img
            src={bannerSrc}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={60} className="text-white opacity-80" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Course ID Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
          <span className="text-xs font-bold text-purple-600">{courseId}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Course Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
          {name}
        </h3>

        {/* Lecturer Info */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">Lecturer</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{lecturer || 'Not Assigned'}</p>
          </div>
        </div>

        {/* View Details Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
            View Details
          </span>
          <ArrowRight
            size={18}
            className="text-purple-600 group-hover:translate-x-1 transition-transform duration-200"
          />
        </div>
      </div>
    </div>
  );
}