/**
 * Autonomous Research Agent
 * Breaks down complex topics, performs parallel research, and synthesizes reports
 */

export class ResearchAgent {
  constructor(options = {}) {
    this.maxDepth = options.maxDepth || 3;
    this.maxSubqueries = options.maxSubqueries || 5;
    this.onProgress = options.onProgress || (() => {});
  }

  async research(topic, options = {}) {
    const { depth = 2, parallel = true } = options;

    this.onProgress({
      stage: "decomposing",
      message: "Breaking down research topic...",
    });

    // Step 1: Decompose topic into sub-questions
    const subquestions = await this.decomposeTopic(topic, depth);

    this.onProgress({
      stage: "researching",
      message: `Researching ${subquestions.length} sub-topics...`,
      subquestions,
    });

    // Step 2: Research each sub-question
    let findings = [];
    if (parallel) {
      const results = await Promise.all(
        subquestions.map((q, idx) => {
          this.onProgress({
            stage: "researching",
            message: `Researching: ${q}`,
            progress: idx / subquestions.length,
          });
          return this.researchSubquestion(q);
        }),
      );
      findings = results.flat();
    } else {
      for (let i = 0; i < subquestions.length; i++) {
        this.onProgress({
          stage: "researching",
          message: `Researching: ${subquestions[i]}`,
          progress: i / subquestions.length,
        });
        const result = await this.researchSubquestion(subquestions[i]);
        findings.push(...result);
      }
    }

    this.onProgress({
      stage: "synthesizing",
      message: "Synthesizing final report...",
    });

    // Step 3: Synthesize findings into report
    const report = await this.synthesizeReport(topic, subquestions, findings);

    this.onProgress({ stage: "complete", message: "Research complete!" });

    return {
      topic,
      subquestions,
      findings,
      report,
      timestamp: new Date().toISOString(),
    };
  }

  async decomposeTopic(topic, depth) {
    const response = await fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `Break down the topic "${topic}" into ${this.maxSubqueries} specific research sub-questions. Return only the questions as a JSON array.`,
        depth: "quick",
      }),
    });

    if (!response.ok) {
      throw new Error(`Research API failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse AI response for sub-questions
    const findingsText = data.findings;
    const questions = [];
    const lines = findingsText.split("\n");

    for (const line of lines) {
      const match =
        line.match(/^\d+\.\s*(.+\?)/) || line.match(/^[-*]\s*(.+\?)/);
      if (match && questions.length < this.maxSubqueries) {
        questions.push(match[1].trim());
      }
    }

    // Fallback if parsing fails
    if (questions.length === 0) {
      return [
        `What are the fundamental concepts of ${topic}?`,
        `What are the current trends in ${topic}?`,
        `What are the challenges facing ${topic}?`,
      ].slice(0, this.maxSubqueries);
    }

    return questions.slice(0, this.maxSubqueries);
  }

  async researchSubquestion(question) {
    const response = await fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `Research the following question and provide detailed findings with sources:\n\n${question}`,
        depth: "deep",
      }),
    });

    if (!response.ok) {
      throw new Error(`Research API failed: ${response.statusText}`);
    }

    const data = await response.json();

    return [
      {
        finding: data.findings,
        source: `AI Research (${data.model})`,
        confidence: 0.85,
        details: data.findings,
      },
    ];
  }

  async synthesizeReport(topic, subquestions, findings) {
    const findingsText = findings
      .map(
        (f, i) =>
          `${i + 1}. ${f.finding} (Source: ${f.source}, Confidence: ${f.confidence})`,
      )
      .join("\n\n");

    const response = await fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `Synthesize a comprehensive research report on "${topic}" based on the following research findings:\n\n${findingsText}\n\nProvide: Executive Summary, Key Findings by Theme, Conclusions, and Future Research Directions.`,
        depth: "deep",
      }),
    });

    if (!response.ok) {
      throw new Error(`Research API failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      summary: data.findings.substring(0, 500),
      findings: [
        {
          theme: "AI-Generated Research",
          points: data.findings
            .split("\n")
            .filter((line) => line.trim().length > 20)
            .slice(0, 5),
        },
      ],
      conclusions: data.findings
        .split("\n")
        .filter(
          (line) => line.includes("conclusion") || line.includes("finding"),
        )
        .slice(0, 3),
      future_research: [
        "Further analysis recommended",
        "Deeper investigation needed",
      ],
      metadata: {
        total_findings: findings.length,
        avg_confidence:
          findings.reduce((sum, f) => sum + f.confidence, 0) / findings.length,
        research_depth: subquestions.length,
      },
    };
  }
}

export const researchAgent = new ResearchAgent();
