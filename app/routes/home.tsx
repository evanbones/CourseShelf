import { useLoaderData, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { BookOpen } from "lucide-react";
import { prisma } from "../db.server";
import { validateCourseInput } from "../utils/validation";

import { AddCourseForm } from "../components/AddCourseForm";
import { CourseCard } from "../components/CourseCard";

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

export default function Home() {
  const { courses } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-12 text-stone-900 font-sans selection:bg-stone-200">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <header className="flex items-center gap-4">
          <div className="bg-stone-900 p-3 rounded-2xl shadow-sm">
            <BookOpen className="w-8 h-8 text-stone-50" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-stone-900">CourseShelf</h1>
            <p className="text-stone-500 font-medium mt-1 text-lg">Manage your curriculum</p>
          </div>
        </header>

        <AddCourseForm error={actionData?.error} />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          
          {courses.length === 0 && (
            <div className="col-span-full py-12 text-center text-stone-400 font-medium text-lg border-2 border-dashed border-stone-200 rounded-4xl">
              No courses created yet. Let's get started above!
            </div>
          )}
        </section>

      </div>
    </div>
  );
}