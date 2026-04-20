import { Form, useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { ArrowLeft, Trash2, ExternalLink, FileText } from "lucide-react";
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
    <div className="min-h-screen bg-stone-50 p-6 md:p-12 text-stone-900 font-sans selection:bg-stone-200">
      <div className="max-w-4xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-semibold mb-10 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-stone-200 text-stone-800 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
              {course.department}
            </span>
            <span className="text-stone-500 font-medium">Term {course.term}</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-stone-900">{course.title}</h1>
        </header>

        <div className="bg-white p-8 rounded-4xl shadow-sm border border-stone-100 mb-12">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Add Material</h2>
          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="add-material" />
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" name="title" placeholder="Material Title" required className="flex-2 px-5 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all placeholder-stone-400 font-medium text-lg" />
              <select name="type" required className="flex-1 px-5 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all font-medium text-lg text-stone-700 appearance-none cursor-pointer">
                <option value="" disabled selected>Select Type...</option>
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Assignment">Assignment</option>
                <option value="Syllabus">Syllabus</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" name="description" placeholder="Short Description (Optional)" className="flex-1 px-5 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all placeholder-stone-400 font-medium text-lg" />
              <input type="url" name="url" placeholder="Link (e.g. https://drive...)" required className="flex-1 px-5 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all placeholder-stone-400 font-medium text-lg" />
            </div>
            <div className="pt-2">
              <button type="submit" className="bg-stone-900 text-white px-8 py-4 rounded-full hover:bg-stone-800 font-semibold text-lg cursor-pointer shadow-md">
                Add Material
              </button>
            </div>
          </Form>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 mb-2">Materials</h2>
          {course.materials.length === 0 && (
            <p className="text-stone-400 font-medium text-lg py-8 text-center border-2 border-dashed border-stone-200 rounded-4xl">
              No materials added yet.
            </p>
          )}
          
          <div className="space-y-4">
            {course.materials.map(mat => (
              <div key={mat.id} className="group bg-white p-6 rounded-2xl border border-stone-100 hover:border-stone-300 hover:shadow-sm transition-all flex gap-4 items-start">
                <div className="bg-stone-50 p-4 rounded-xl text-stone-400 group-hover:text-stone-900 transition-colors mt-1">
                  <FileText className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <a href={mat.url} target="_blank" rel="noreferrer" className="text-xl font-bold text-stone-900 hover:text-stone-600 transition-colors flex items-center gap-2">
                      {mat.title}
                      <ExternalLink className="w-4 h-4 text-stone-400" />
                    </a>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2.5 py-1 bg-stone-100 text-xs font-bold text-stone-600 rounded-md tracking-wide uppercase">
                      {mat.type}
                    </span>
                    {mat.description && (
                      <p className="text-stone-500 font-medium">{mat.description}</p>
                    )}
                  </div>
                </div>

                <Form method="post" onSubmit={(e) => !confirm("Delete material?") && e.preventDefault()}>
                  <input type="hidden" name="intent" value="delete-material" />
                  <input type="hidden" name="materialId" value={mat.id} />
                  <button type="submit" className="text-stone-300 hover:text-red-500 hover:bg-red-50 p-3 rounded-full transition-colors cursor-pointer mt-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </Form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}