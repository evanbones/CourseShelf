export function validateTermFormat(term: string): boolean {
  const termRegex = /^\d+[WS][12]$/; // a number follwed by W or S, then 1 or 2
  return termRegex.test(term);
}

export function validateDepartment(dept: string): boolean {
  const validDepts = ["CS", "MATH", "PHYSICS", "ENGLISH", "HISTORY"];
  return validDepts.includes(dept);
}

export function validateCourseInput(title: string, dept: string, term: string) {
  if (!title || title.trim() === "") return "Course title is required.";
  if (!validateDepartment(dept)) return "Invalid department selected.";
  if (!validateTermFormat(term)) return "Invalid term format. Use format like 2026W1 or 1999S2.";
  return null;
}