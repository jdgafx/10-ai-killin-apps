// Cloudflare Worker for RAG Knowledge Base with Embeddings
interface Env {
  ANTHROPIC_API_KEY: string;
  OPENROUTER_API_KEY: string;
}

interface Document {
  id: string;
  content: string;
  metadata?: Record<string, any>;
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const body = await request.json() as {
      query: string;
      documents?: Document[];
      topK?: number;
      includeSource?: boolean;
    };
    console.log('RAG request:', body);

    const topK = body.topK || 3;

    // Step 1: Retrieve relevant documents (simplified - in production use vector DB)
    let relevantDocs: Document[] = [];
    
    if (body.documents && body.documents.length > 0) {
      // Use Claude to find most relevant documents
      const retrievalPrompt = `Given this query: "${body.query}"
      
Find the ${topK} most relevant documents and return ONLY their IDs as a JSON array.

Documents:
${body.documents.map((doc, i) => `[${doc.id}] ${doc.content.substring(0, 200)}...`).join('\n\n')}

Output format: ["id1", "id2", "id3"]`;

      const retrievalResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 256,
          messages: [{ role: 'user', content: retrievalPrompt }],
        }),
      });

      const retrievalData = await retrievalResponse.json() as any;
      
      try {
        const relevantIds = JSON.parse(retrievalData.content[0].text);
        relevantDocs = body.documents.filter(doc => relevantIds.includes(doc.id));
      } catch {
        relevantDocs = body.documents.slice(0, topK);
      }
    }

    // Step 2: Generate answer using retrieved context
    const context = relevantDocs.map(doc => doc.content).join('\n\n---\n\n');
    
    const answerPrompt = `Answer the following question using ONLY the provided context. If the answer is not in the context, say so.

Context:
${context}

Question: ${body.query}

Provide a clear, accurate answer with citations to the source documents when applicable.`;

    const answerResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: answerPrompt }],
      }),
    });

    const answerData = await answerResponse.json() as any;

    return new Response(
      JSON.stringify({
        answer: answerData.content[0].text,
        sources: body.includeSource !== false ? relevantDocs.map(doc => ({
          id: doc.id,
          snippet: doc.content.substring(0, 200) + '...',
          metadata: doc.metadata,
        })) : undefined,
        usage: answerData.usage,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('RAG error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
