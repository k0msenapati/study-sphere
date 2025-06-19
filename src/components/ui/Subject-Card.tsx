// components/SubjectCard.tsx
type Note = {
  id: string
  title: string
  description: string
}

type SubjectCardProps = {
  subject: string
  notes: Note[]
}

export default function SubjectCard({ subject, notes }: SubjectCardProps) {
  return (
    <div className="linear-card bg-white dark:bg-black border rounded-lg p-4 shadow-sm space-y-2">
      <h2 className="text-lg font-semibold">{subject}</h2>
      <div className="space-y-1">
        {notes.map(note => (
          <div key={note.id} className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex flex-col">
              <p className="font-medium">{note.title}</p>
              <p className="text-sm text-muted-foreground truncate w-56">{note.description}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-black text-white px-2 py-1 rounded">👁️</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
