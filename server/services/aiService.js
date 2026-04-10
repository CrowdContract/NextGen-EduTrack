import Groq from "groq-sdk";

let _groq = null;
const getGroq = () => {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_TOKEN });
  return _groq;
};

const MODEL = "llama-3.3-70b-versatile";

const chat = async (messages) => {
  const res = await getGroq().chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });
  return res.choices[0].message.content;
};

// ── Summarize a project ──────────────────────────────────────────────────────
export const summarizeProject = async ({ title, description }) => {
  return chat([
    {
      role: "system",
      content:
        "You are an academic project assistant. Summarize the given FYP project in 3-4 concise bullet points covering: objective, approach, and expected outcome. Be clear and professional.",
    },
    {
      role: "user",
      content: `Project Title: ${title}\n\nDescription: ${description}`,
    },
  ]);
};

// ── Generate feedback for a teacher ─────────────────────────────────────────
export const generateFeedback = async ({ title, description, type }) => {
  const tone =
    type === "positive"
      ? "encouraging and positive"
      : type === "negative"
      ? "constructive and critical"
      : "balanced and general";

  return chat([
    {
      role: "system",
      content: `You are an experienced FYP supervisor. Generate ${tone} feedback for the student's project. Structure it as:
**Strengths:** (2-3 points)
**Weaknesses:** (2-3 points)  
**Suggestions:** (2-3 actionable improvements)
Keep it concise and academic.`,
    },
    {
      role: "user",
      content: `Project Title: ${title}\n\nDescription: ${description}`,
    },
  ]);
};

// ── Code Generator ───────────────────────────────────────────────────────────
export const generateCode = async ({ prompt, language }) => {
  return chat([
    {
      role: "system",
      content: `You are an expert software engineer. Generate clean, well-commented ${language || "code"} based on the user's description.
Format your response as:
1. A brief explanation of the approach (2-3 sentences)
2. The complete code in a code block
3. Usage example (if applicable)
Keep the code production-ready and follow best practices.`,
    },
    {
      role: "user",
      content: prompt,
    },
  ]);
};
export const explainCode = async ({ code, language }) => {
  return chat([
    {
      role: "system",
      content: `You are an expert software engineer and educator. Analyze the provided code and explain:
1. **What it does** (2-3 sentences)
2. **Time Complexity** (Big O)
3. **Space Complexity** (Big O)
4. **Potential Issues** (bugs, edge cases)
5. **Improvements** (2-3 suggestions)
Be concise and clear. Format with markdown.`,
    },
    {
      role: "user",
      content: `Language: ${language || "auto-detect"}\n\n\`\`\`\n${code}\n\`\`\``,
    },
  ]);
};

// ── AI Grading ───────────────────────────────────────────────────────────────
export const gradeProject = async ({ title, description, fileTexts }) => {
  let content = `Project Title: ${title}\nDescription: ${description}`;
  if (fileTexts?.length) {
    content += "\n\nUploaded Files Content:\n" +
      fileTexts.map((f, i) => `--- ${f.name} ---\n${f.text.slice(0, 2000)}`).join("\n\n");
  }

  return chat([
    {
      role: "system",
      content: `You are an experienced FYP examiner. Grade this student project and return a JSON object ONLY (no extra text) with this exact structure:
{
  "score": <number 0-100>,
  "grade": "<A/B/C/D/F>",
  "completeness": <0-10>,
  "clarity": <0-10>,
  "originality": <0-10>,
  "technical_depth": <0-10>,
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "remarks": "..."
}`,
    },
    { role: "user", content },
  ]);
};

// ── Smart Search ─────────────────────────────────────────────────────────────
export const smartSearch = async ({ query, projects }) => {
  const projectList = projects
    .map((p, i) => `${i + 1}. ID: ${p._id} | Title: "${p.title}" | Status: ${p.status} | Description: "${p.description?.slice(0, 100)}"`)
    .join("\n");

  return chat([
    {
      role: "system",
      content: `You are a smart search engine for NextGen EduTrack, a university FYP management platform. Given a natural language query and a list of projects, return a JSON array of matching project IDs ordered by relevance. Return ONLY a JSON array like: ["id1", "id2"]. If nothing matches, return [].`,
    },
    {
      role: "user",
      content: `Query: "${query}"\n\nProjects:\n${projectList}`,
    },
  ]);
};
export const chatWithAssistant = async ({ messages, projectContext, fileTexts }) => {
  let systemPrompt = "You are a helpful AI assistant for NextGen EduTrack, a university FYP management platform. Help students and teachers with project-related questions.";

  if (projectContext) {
    systemPrompt = `You are an AI assistant helping a student with their Final Year Project.

Project Title: "${projectContext.title}"
Project Description: "${projectContext.description}"`;

    if (fileTexts && fileTexts.length > 0) {
      const combined = fileTexts
        .map((f, i) => `--- File ${i + 1}: ${f.name} ---\n${f.text.slice(0, 3000)}`)
        .join("\n\n");
      systemPrompt += `\n\nThe student has uploaded the following project files. Use this content to answer questions accurately:\n\n${combined}`;
    }

    systemPrompt += "\n\nAnswer questions helpfully and concisely. Focus on academic guidance based on the project and files above.";
  }

  return chat([
    { role: "system", content: systemPrompt },
    ...messages,
  ]);
};
