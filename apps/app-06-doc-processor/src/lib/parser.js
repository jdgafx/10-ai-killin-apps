/**
 * Document Parser
 * Extracts text from PDF and text files
 */

export async function extractTextFromPDF(file) {
  try {
    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist')
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      fullText += pageText + '\n\n'
    }

    return fullText.trim()
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract text from PDF: ' + error.message)
  }
}

export async function extractTextFromFile(file) {
  try {
    const text = await file.text()
    return text.trim()
  } catch (error) {
    console.error('Text file extraction error:', error)
    throw new Error('Failed to read text file: ' + error.message)
  }
}

export function getFileInfo(file) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  }
}

export function validateFile(file, maxSizeMB = 10) {
  const validTypes = ['application/pdf', 'text/plain']
  const maxSize = maxSizeMB * 1024 * 1024

  if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
    throw new Error('Invalid file type. Please upload PDF or TXT files.')
  }

  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${maxSizeMB}MB.`)
  }

  return true
}

export function truncateText(text, maxLength = 10000) {
  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength) + '...[truncated]'
}

export function countWords(text) {
  return text.trim().split(/\s+/).length
}

export function countSentences(text) {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
}

export function getTextStats(text) {
  return {
    characters: text.length,
    words: countWords(text),
    sentences: countSentences(text),
    paragraphs: text.split(/\n\n+/).filter(p => p.trim().length > 0).length
  }
}
