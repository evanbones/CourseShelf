import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { ArrowLeft } from "lucide-react";
import { prisma } from "../db.server";

import { AddMaterialForm } from "../components/AddMaterialForm";
import { MaterialListItem } from "../components/MaterialListItem";

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

        <AddMaterialForm />

        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 mb-2">Materials</h2>
          {course.materials.length === 0 && (
            <p className="text-stone-400 font-medium text-lg py-8 text-center border-2 border-dashed border-stone-200 rounded-4xl">
              No materials added yet.
            </p>
          )}
          
          <div className="space-y-4">
            {course.materials.map(mat => (
              <MaterialListItem key={mat.id} material={mat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}