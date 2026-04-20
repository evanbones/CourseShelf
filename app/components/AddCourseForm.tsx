import { Form } from "react-router";
import { Plus } from "lucide-react";

interface AddCourseFormProps {
  error?: string;
}

export function AddCourseForm({ error }: AddCourseFormProps) {
  return (
    <section className="bg-white p-8 rounded-4xl shadow-sm border border-stone-100">
      <h2 className="text-2xl font-bold mb-6 tracking-tight text-stone-900">Add a new course</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-2xl font-medium border border-red-100">
          {error}
        </div>
      )}
      
      <Form method="post" className="flex flex-col gap-6">
        <input type="hidden" name="intent" value="create-course" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            required
            className="px-5 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all placeholder-stone-400 font-medium text-lg"
          />
          <select 
            name="department" 
            required
            defaultValue=""
            className="px-5 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all font-medium text-lg text-stone-700 appearance-none cursor-pointer" 
          >
            <option value="" disabled>Department</option>
            <option value="CS">Computer Science</option>
            <option value="MATH">Mathematics</option>
            <option value="PHYSICS">Physics</option>
            <option value="ENGLISH">English</option>
            <option value="HISTORY">History</option>
          </select>
          <input
            type="text"
            name="term"
            placeholder="Term (e.g., 2026S1)"
            required
            className="px-5 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all placeholder-stone-400 font-medium text-lg"
          />
        </div>
        
        <button
          type="submit"
          className="self-start bg-stone-900 text-white px-8 py-4 rounded-full hover:bg-stone-800 transition-transform hover:-translate-y-0.5 active:translate-y-0 font-semibold text-lg flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-5 h-5" /> Create Course
        </button>
      </Form>
    </section>
  );
}