import { Form, useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { prisma } from "../db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: { materials: { orderBy: { createdAt: "desc" } } },
  });
  if (!course) throw new Response("Not Found", { status: 404 });
  return { course };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add-material") {
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    
    await prisma.material.create({
      data: { title, type, description, url, courseId: params.courseId! }
    });
  }

  if (intent === "delete-material") {
    const materialId = formData.get("materialId") as string;
    await prisma.material.delete({ where: { id: materialId } });
  }

  return { success: true };
}

export default function CourseView() {
  const { course } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600">{course.department} - {course.term}</p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Material</h2>
          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="add-material" />
            <div className="flex gap-4">
              <input type="text" name="title" placeholder="Material Title" required className="flex-1 px-3 py-2 border rounded-md text-gray-900 bg-white placeholder-gray-500" />
              <select name="type" required className="flex-1 px-3 py-2 border rounded-md text-gray-900 bg-white">
                <option value="">Select Type...</option>
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Assignment">Assignment</option>
                <option value="Syllabus">Syllabus</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-4">
              <input type="text" name="description" placeholder="Short Description (Optional)" className="flex-1 px-3 py-2 border rounded-md text-gray-900 bg-white placeholder-gray-500" />
              <input type="url" name="url" placeholder="Link (e.g. https://drive.google.com/...)" required className="flex-1 px-3 py-2 border rounded-md text-gray-900 bg-white placeholder-gray-500" />
            </div>
            <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 cursor-pointer">
              Add Material
            </button>
          </Form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Materials</h2>
          {course.materials.length === 0 && <p className="text-gray-500">No materials added yet.</p>}
          {course.materials.map(mat => (
            <div key={mat.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start">
              <div>
                <a href={mat.url} target="_blank" rel="noreferrer" className="text-lg font-semibold text-blue-600 hover:underline">
                  {mat.title}
                </a>
                <span className="ml-3 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">{mat.type}</span>
                {mat.description && <p className="text-gray-600 text-sm mt-1">{mat.description}</p>}
              </div>
              <Form method="post" onSubmit={(e) => !confirm("Delete material?") && e.preventDefault()}>
                <input type="hidden" name="intent" value="delete-material" />
                <input type="hidden" name="materialId" value={mat.id} />
                <button type="submit" className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors cursor-pointer">
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