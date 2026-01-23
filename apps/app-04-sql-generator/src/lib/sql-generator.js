/**
 * AI-Powered SQL Query Generator
 * Converts natural language to SQL using MiniMax AI
 */

const SQL_SYSTEM_PROMPT = `You are an expert SQL developer. Generate accurate, optimized SQL queries based on natural language requests.

Rules:
1. Use parameterized queries to prevent SQL injection
2. Include proper JOIN conditions
3. Use appropriate indexes and optimize for performance
4. Handle NULL values safely
5. Use standard SQL syntax (PostgreSQL compatible)

Response format (JSON only):
{
  "query": "SELECT * FROM users WHERE id = $1",
  "parameters": [1],
  "explanation": "This query retrieves all columns from the users table where the id matches the parameter",
  "warning": "Any caveats or performance considerations (or null)"
}`;

export async function generateSQL(question, schema) {
  const schemaDescription = formatSchemaForAI(schema);

  const prompt = `${SQL_SYSTEM_PROMPT}

Convert this natural language request to SQL:
"${question}"

Database Schema:
${schemaDescription}

Generate SQL following the rules above. Return ONLY valid JSON with fields: query, parameters, explanation, warning`;

  try {
    const response = await fetch("/api/sql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: prompt,
        schema: schemaDescription,
        database: "postgresql",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const content = data.sql || "";

    try {
      const jsonMatch =
        content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) ||
        content.match(/(\{[\s\S]*?\})/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      return JSON.parse(jsonStr);
    } catch (parseError) {
      return {
        query:
          content
            .split("\n")
            .find(
              (line) =>
                line.includes("SELECT") ||
                line.includes("INSERT") ||
                line.includes("UPDATE") ||
                line.includes("DELETE"),
            ) || "-- No SQL found",
        parameters: [],
        explanation: content.substring(0, 200),
        warning: null,
      };
    }
  } catch (error) {
    console.error("SQL generation error:", error);
    return {
      query: "-- Failed to generate SQL",
      parameters: [],
      explanation: error.message || "An error occurred during generation",
      warning: "Generation failed",
    };
  }
}

function formatSchemaForAI(schema) {
  if (!schema?.tables || schema.tables.length === 0) {
    return "No tables defined";
  }

  return schema.tables
    .map((table) => {
      const columns = table.columns
        .map((col) => {
          const parts = [col.name, col.type];
          if (col.primaryKey) parts.push("PRIMARY KEY");
          if (col.unique) parts.push("UNIQUE");
          if (col.notNull) parts.push("NOT NULL");
          return `  ${parts.join(" ")}`;
        })
        .join("\n");

      return `Table: ${table.name}\n${columns}`;
    })
    .join("\n\n");
}
