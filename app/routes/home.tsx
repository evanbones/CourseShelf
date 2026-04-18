import { Form, useLoaderData, useActionData, Link } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { prisma } from "../db.server";
import { validateCourseInput } from "../utils/validation";

export async function loader() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { materials: true } } }
  });
  return { courses };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  
  if (intent === "create-course") {
    const title = formData.get("title") as string;
    const department = formData.get("department") as string;
    const term = formData.get("term") as string;

    const error = validateCourseInput(title, department, term);
    if (error) return { error };

    await prisma.course.create({ data: { title, department, term } });
    return { success: true };
  }

  if (intent === "delete-course") {
    const courseId = formData.get("courseId") as string;
    await prisma.course.delete({ where: { id: courseId } });
    return { success: true };
  }
  
  return null;
}

export default function Index() {
  const { courses } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">CourseShelf Dashboard</h1>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Course</h2>
          {actionData?.error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{actionData.error}</div>
          )}
          <Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="intent" value="create-course" />
            <div className="flex gap-4">
              <input
                type="text"
                name="title"
                placeholder="Course Title"
                required
                className="flex-2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white placeholder-gray-500"
              />
              <select name="department" className="flex-1 px-4 py-2 border rounded-md text-gray-900 bg-white" required>
                <option value="">Select Dept...</option>
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
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex justify-center items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Course
            </button>
          </Form>
        </div>

        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-blue-300 transition-colors flex justify-between items-center">
              <Link to={`/courses/${course.id}`} className="flex-1 block">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
                  <p className="text-gray-600">{course.department} - Term {course.term}</p>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {course._count.materials} Materials
                </div>
              </Link>
              <Form method="post" onSubmit={(e) => !confirm("Delete this course and all its materials?") && e.preventDefault()}>
                <input type="hidden" name="intent" value="delete-course" />
                <input type="hidden" name="courseId" value={course.id} />
                <button type="submit" className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors cursor-pointer" aria-label="Delete Course">
                  <Trash2 className="w-5 h-5" />
                </button>
              </Form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}