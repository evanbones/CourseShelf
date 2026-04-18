import { Form, useLoaderData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { BookOpen, Link as LinkIcon, Plus } from "lucide-react";
import { prisma } from "../db.server";

export async function loader() {
  const courses = await prisma.course.findMany({
    include: { materials: true },
    orderBy: { createdAt: "desc" },
  });
  return { courses }; 
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create-course") {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    await prisma.course.create({ data: { title, description } });
  }

  if (intent === "add-material") {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const courseId = formData.get("courseId") as string;
    await prisma.material.create({ data: { title, url, courseId } });
  }

  return { success: true }; 
}

export default function Index() {
  const { courses } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">CourseShelf</h1>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Course</h2>
          <Form method="post" className="flex gap-4 items-start">
            <input type="hidden" name="intent" value="create-course" />
            <div className="flex-1 space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Course Title"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                name="description"
                placeholder="Brief Description"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 h-10.5"
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </Form>
        </div>

        <div className="grid gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> Materials
                </h4>
                <ul className="space-y-2 mb-4">
                  {course.materials.map((mat) => (
                    <li key={mat.id}>
                      <a href={mat.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        {mat.title}
                      </a>
                    </li>
                  ))}
                  {course.materials.length === 0 && (
                    <li className="text-sm text-gray-500">No materials yet.</li>
                  )}
                </ul>

                <Form method="post" className="flex gap-2 mt-4">
                  <input type="hidden" name="intent" value="add-material" />
                  <input type="hidden" name="courseId" value={course.id} />
                  <input
                    type="text"
                    name="title"
                    placeholder="Material Title"
                    required
                    className="flex-1 px-3 py-1 text-sm border rounded-md"
                  />
                  <input
                    type="url"
                    name="url"
                    placeholder="https://..."
                    required
                    className="flex-1 px-3 py-1 text-sm border rounded-md"
                  />
                  <button type="submit" className="bg-gray-800 text-white px-4 py-1 rounded-md text-sm hover:bg-gray-900">
                    Add
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}