import { Note } from "@/lib/notes/types"

export const exportToPDF = (note: Note): void => {
  const printWindow = window.open('', '_blank')
  
  if (!printWindow) {
    alert('Please allow popups to export PDF')
    return
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${note.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 {
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        .content {
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.8;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <h1>${note.title}</h1>
      <div class="content">${note.content}</div>
    </body>
    </html>
  `
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}