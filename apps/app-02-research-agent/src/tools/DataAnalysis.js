/**
 * Data Analysis Tool
 * Analyzes research findings and extracts insights
 */

export class DataAnalysis {
  analyzeFindings(findings) {
    if (!findings || findings.length === 0) {
      return {
        total: 0,
        avgConfidence: 0,
        highConfidence: [],
        themes: [],
      }
    }

    const total = findings.length
    const avgConfidence = findings.reduce((sum, f) => sum + f.confidence, 0) / total
    const highConfidence = findings.filter(f => f.confidence >= 0.8)
    
    // Extract themes from sources
    const sourceMap = new Map()
    findings.forEach(f => {
      const count = sourceMap.get(f.source) || 0
      sourceMap.set(f.source, count + 1)
    })
    
    const themes = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      count,
      percentage: (count / total * 100).toFixed(1),
    }))

    return {
      total,
      avgConfidence: avgConfidence.toFixed(2),
      highConfidence: highConfidence.length,
      themes,
      confidenceDistribution: this.calculateDistribution(findings),
    }
  }

  calculateDistribution(findings) {
    const bins = [0, 0.2, 0.4, 0.6, 0.8, 1.0]
    const distribution = bins.slice(1).map((max, i) => {
      const min = bins[i]
      const count = findings.filter(f => f.confidence >= min && f.confidence < max).length
      return {
        range: `${(min * 100).toFixed(0)}-${(max * 100).toFixed(0)}%`,
        count,
      }
    })
    
    return distribution
  }

  extractKeyInsights(report) {
    if (!report) return []

    const insights = []
    
    if (report.summary) {
      insights.push({
        type: 'summary',
        content: report.summary,
        importance: 'high',
      })
    }

    if (report.findings) {
      report.findings.forEach(finding => {
        insights.push({
          type: 'theme',
          theme: finding.theme,
          points: finding.points.length,
          importance: 'medium',
        })
      })
    }

    if (report.conclusions) {
      insights.push({
        type: 'conclusions',
        count: report.conclusions.length,
        importance: 'high',
      })
    }

    return insights
  }
}

export const dataAnalysis = new DataAnalysis()
