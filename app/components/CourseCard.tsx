import { Form, Link } from "react-router";
import { Trash2, ArrowRight } from "lucide-react";

export interface CourseCardData {
  id: string;
  title: string;
  department: string;
  term: string;
  _count: {
    materials: number;
  };
}

export function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <div className="group bg-white p-8 rounded-4xl shadow-sm border border-stone-100 hover:shadow-md hover:border-stone-200 transition-all flex flex-col justify-between min-h-64 relative overflow-hidden">
      <Link to={`/courses/${course.id}`} className="absolute inset-0 z-10"></Link>
      
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide">
            {course.department}
          </span>
          <Form method="post" className="z-20" onSubmit={(e) => !confirm("Delete this course and all its materials?") && e.preventDefault()}>
            <input type="hidden" name="intent" value="delete-course" />
            <input type="hidden" name="courseId" value={course.id} />
            <button type="submit" className="text-stone-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer" aria-label="Delete Course">
              <Trash2 className="w-5 h-5" />
            </button>
          </Form>
        </div>
        
        <h3 className="text-3xl font-bold tracking-tight text-stone-900 mt-4 group-hover:text-stone-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-stone-500 font-medium mt-1 text-lg">Term {course.term}</p>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-50 z-20">
        <span className="text-stone-500 font-medium">
          {course._count.materials} {course._count.materials === 1 ? 'Material' : 'Materials'}
        </span>
        <ArrowRight className="w-6 h-6 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}