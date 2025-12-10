import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MigrationResponse } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    migratedCode: {
      type: Type.STRING,
      description: "The complete migrated Vue 3 TypeScript code using <script setup>.",
    },
    explanation: {
      type: Type.STRING,
      description: "A detailed explanation of the changes made, using Markdown formatting (bolding key concepts).",
    },
  },
  required: ["migratedCode", "explanation"],
};

export const migrateVueCode = async (sourceCode: string): Promise<MigrationResponse> => {
  const prompt = `
    You are an expert Vue.js developer specializing in legacy migrations.
    
    TASK:
    Migrate the following Vue 2 Options API (JavaScript) code to Vue 3 Composition API (TypeScript).
    
    REQUIREMENTS:
    1. Use \`<script setup lang="ts">\`.
    2. Convert \`data\` to \`ref\` or \`reactive\`.
    3. Convert \`computed\` properties to \`computed(() => ...)\`.
    4. Convert \`methods\` to plain functions.
    5. Convert Lifecycle hooks (e.g., \`mounted\` -> \`onMounted\`).
    6. Convert \`watch\` to \`watch\` or \`watchEffect\`.
    7. Convert Props and Emits using \`defineProps\` and \`defineEmits\` with TypeScript interfaces.
    8. Maintain all original logic and functionality.
    9. Ensure the code is clean, readable, and idiomatic Vue 3.
    
    EXPLANATION FORMAT:
    Provide a clear, bulleted list of changes. **Bold** the specific Vue 3 APIs or TypeScript features used (e.g., **defineProps**, **ref**, **computed**).
    
    SOURCE CODE:
    ${sourceCode}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Best for coding tasks
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2, // Low temperature for precise code generation
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(responseText) as MigrationResponse;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};
