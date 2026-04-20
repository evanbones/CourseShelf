import { Form } from "react-router";
import { TextInput } from "./ui/TextInput";
import { SelectInput } from "./ui/SelectInput";

export function AddMaterialForm() {
  return (
    <div className="bg-white p-8 rounded-4xl shadow-sm border border-stone-100 mb-12">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Add Material</h2>
      <Form method="post" className="space-y-4">
        <input type="hidden" name="intent" value="add-material" />
        <div className="flex flex-col md:flex-row gap-4">
          <TextInput 
            type="text" 
            name="title" 
            placeholder="Material Title" 
            required 
            className="flex-2" 
          />
          <SelectInput name="type" required defaultValue="">
            <option value="" disabled>Select Type...</option>
            <option value="Lecture Notes">Lecture Notes</option>
            <option value="Assignment">Assignment</option>
            <option value="Syllabus">Syllabus</option>
            <option value="Other">Other</option>
          </SelectInput>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <TextInput 
            type="text" 
            name="description" 
            placeholder="Short Description (Optional)" 
            className="flex-1" 
          />
          <TextInput 
            type="url" 
            name="url" 
            placeholder="Link (e.g. https://drive...)" 
            required 
            className="flex-1" 
          />
        </div>
        <div className="pt-2">
          <button type="submit" className="bg-stone-900 text-white px-8 py-4 rounded-full hover:bg-stone-800 font-semibold text-lg cursor-pointer shadow-md">
            Add Material
          </button>
        </div>
      </Form>
    </div>
  );
}