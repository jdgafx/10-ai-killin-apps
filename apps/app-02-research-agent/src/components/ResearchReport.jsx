import { FileText, CheckCircle, Clock } from 'lucide-react'

export default function ResearchReport({ report, isLoading }) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center text-gray-400 py-12">
        <FileText className="w-16 h-16 mx-auto mb-4" />
        <p>No report generated yet</p>
        <p className="text-sm mt-2">Enter a research topic to begin</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Executive Summary
        </h3>
        <p className="text-gray-700">{report.summary}</p>
      </div>

      {/* Key Findings */}
      {report.findings && report.findings.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-3">Key Findings</h3>
          <div className="space-y-4">
            {report.findings.map((finding, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-700 mb-2">{finding.theme}</h4>
                <ul className="space-y-1">
                  {finding.points.map((point, pidx) => (
                    <li key={pidx} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conclusions */}
      {report.conclusions && report.conclusions.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-3">Conclusions</h3>
          <ul className="space-y-2 bg-green-50 border border-green-200 rounded-lg p-4">
            {report.conclusions.map((conclusion, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{conclusion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Future Research */}
      {report.future_research && report.future_research.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-3">Areas for Further Research</h3>
          <ul className="space-y-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            {report.future_research.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metadata */}
      {report.metadata && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-600 mb-2">Research Metadata</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Total Findings</div>
              <div className="font-semibold">{report.metadata.total_findings}</div>
            </div>
            <div>
              <div className="text-gray-500">Avg Confidence</div>
              <div className="font-semibold">{(report.metadata.avg_confidence * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-gray-500">Research Depth</div>
              <div className="font-semibold">{report.metadata.research_depth} topics</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
