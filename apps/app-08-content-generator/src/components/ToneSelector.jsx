export default function ToneSelector({ value, onChange }) {
  const tones = [
    { id: 'professional', label: 'Professional', emoji: '👔' },
    { id: 'casual', label: 'Casual', emoji: '😊' },
    { id: 'friendly', label: 'Friendly', emoji: '🤝' },
    { id: 'formal', label: 'Formal', emoji: '🎩' },
    { id: 'enthusiastic', label: 'Enthusiastic', emoji: '🎉' },
    { id: 'informative', label: 'Informative', emoji: '📚' },
  ]

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-3">Tone & Style</label>
      <div className="grid grid-cols-3 gap-2">
        {tones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onChange(tone.id)}
            className={`px-3 py-2 rounded-lg border transition-all text-sm ${
              value === tone.id
                ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="mr-1">{tone.emoji}</span>
            {tone.label}
          </button>
        ))}
      </div>
    </div>
  )
}
