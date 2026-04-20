import { Form } from "react-router";
import { Trash2, ExternalLink, FileText } from "lucide-react";

export interface MaterialData {
  id: string;
  title: string;
  type: string;
  description: string | null;
  url: string;
}

export function MaterialListItem({ material }: { material: MaterialData }) {
  return (
    <div className="group bg-white p-6 rounded-2xl border border-stone-100 hover:border-stone-300 hover:shadow-sm transition-all flex gap-4 items-start">
      <div className="bg-stone-50 p-4 rounded-xl text-stone-400 group-hover:text-stone-900 transition-colors mt-1">
        <FileText className="w-6 h-6" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <a href={material.url} target="_blank" rel="noreferrer" className="text-xl font-bold text-stone-900 hover:text-stone-600 transition-colors flex items-center gap-2">
            {material.title}
            <ExternalLink className="w-4 h-4 text-stone-400" />
          </a>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="px-2.5 py-1 bg-stone-100 text-xs font-bold text-stone-600 rounded-md tracking-wide uppercase">
            {material.type}
          </span>
          {material.description && (
            <p className="text-stone-500 font-medium">{material.description}</p>
          )}
        </div>
      </div>

      <Form method="post" onSubmit={(e) => !confirm("Delete material?") && e.preventDefault()}>
        <input type="hidden" name="intent" value="delete-material" />
        <input type="hidden" name="materialId" value={material.id} />
        <button type="submit" className="text-stone-300 hover:text-red-500 hover:bg-red-50 p-3 rounded-full transition-colors cursor-pointer mt-1">
          <Trash2 className="w-5 h-5" />
        </button>
      </Form>
    </div>
  );
}