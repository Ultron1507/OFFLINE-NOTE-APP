import Dexie from 'dexie'

export const db = new Dexie('noteflow-offline-db')

db.version(1).stores({
  notes: 'id, updatedAt, createdAt, favorite, trashed',
})

export async function getAllNotes() {
  return db.notes.orderBy('updatedAt').reverse().toArray()
}

export async function saveNote(note) {
  await db.notes.put(note)
  return note
}

export async function saveNotes(notes) {
  await db.notes.bulkPut(notes)
  return notes
}
