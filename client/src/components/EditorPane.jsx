import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  RotateCcw,
  Sparkles,
  Star,
  Tags,
  Trash2,
  Wand2,
} from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { useNoteStore } from '../store/useNoteStore.js'
import { createSummary, formatUpdatedAt, stripHtml, suggestTags } from '../utils/notes.js'
import { EmptyState } from './EmptyState.jsx'

export function EditorPane() {
  const notes = useNoteStore((state) => state.notes)
  const selectedId = useNoteStore((state) => state.selectedId)
  const updateNote = useNoteStore((state) => state.updateNote)
  const toggleFavorite = useNoteStore((state) => state.toggleFavorite)
  const moveToTrash = useNoteStore((state) => state.moveToTrash)
  const restoreNote = useNoteStore((state) => state.restoreNote)
  const notify = useNoteStore((state) => state.notify)
  const currentNote = useMemo(() => notes.find((note) => note.id === selectedId), [notes, selectedId])
  const noteId = currentNote?.id
  const noteContent = currentNote?.content
  const currentId = useRef(selectedId)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write naturally. Your note is saved locally as you type.',
      }),
    ],
    content: currentNote?.content ?? '',
    editorProps: {
      attributes: {
        class: 'editor-surface',
        'aria-label': 'Note body',
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      if (!currentId.current) return
      updateNote(currentId.current, {
        content: activeEditor.getHTML(),
        text: activeEditor.getText(),
      })
    },
  })

  useEffect(() => {
    currentId.current = selectedId
  }, [selectedId])

  useEffect(() => {
    if (!editor || !noteId) return
    if (editor.getHTML() !== noteContent) {
      editor.commands.setContent(noteContent || '<p></p>', false)
    }
  }, [editor, noteContent, noteId])

  if (!currentNote) {
    return (
      <main className="editor-pane empty-editor">
        <EmptyState
          icon={Sparkles}
          title="Choose a note"
          message="Select a note from the list or create a fresh page for your next thought."
        />
      </main>
    )
  }

  const runAiAction = (action) => {
    const text = stripHtml(currentNote.content)

    if (action === 'title') {
      const title = createSummary(text).split(' ').slice(0, 7).join(' ') || 'Untitled note'
      updateNote(currentNote.id, { title })
      notify('Smart title generated')
    }

    if (action === 'summary') {
      const summary = createSummary(text)
      editor?.chain().focus().insertContent(`<blockquote>${summary}</blockquote>`).run()
      notify('Summary added to note')
    }

    if (action === 'tags') {
      const tags = [...new Set([...currentNote.tags, ...suggestTags(currentNote.title, text)])]
      updateNote(currentNote.id, { tags })
      notify(tags.length ? 'Tags suggested' : 'Write a little more for tags')
    }

    if (action === 'improve') {
      editor
        ?.chain()
        .focus()
        .insertContent('<p><strong>Revision note:</strong> Tighten the opening, prefer active verbs, and keep one idea per paragraph.</p>')
        .run()
      notify('Writing suggestions added')
    }
  }

  const toolbarItems = [
    { label: 'Bold', icon: Bold, action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
    { label: 'Italic', icon: Italic, action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
    { label: 'Heading', icon: Heading2, action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
    { label: 'Bullet list', icon: List, action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
    { label: 'Numbered list', icon: ListOrdered, action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList') },
  ]

  return (
    <main className="editor-pane">
      <header className="editor-header">
        <div>
          <p className="eyebrow">{currentNote.trashed ? 'In trash' : 'Editing note'}</p>
          <p className="last-saved">Saved locally {formatUpdatedAt(currentNote.updatedAt)}</p>
        </div>
        <div className="header-actions">
          {currentNote.trashed ? (
            <button className="secondary-button" onClick={() => restoreNote(currentNote.id)}>
              <RotateCcw size={17} aria-hidden="true" />
              Restore
            </button>
          ) : (
            <>
              <button
                className={currentNote.favorite ? 'icon-button active' : 'icon-button'}
                onClick={() => toggleFavorite(currentNote.id)}
                aria-label="Toggle favorite"
              >
                <Star size={18} aria-hidden="true" />
              </button>
              <button className="icon-button danger" onClick={() => moveToTrash(currentNote.id)} aria-label="Move to trash">
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </header>

      <div className="editor-scroll">
        <input
          className="title-input"
          value={currentNote.title}
          onChange={(event) => updateNote(currentNote.id, { title: event.target.value })}
          placeholder="Untitled note"
          aria-label="Note title"
        />

        <div className="ai-bar" aria-label="AI writing actions">
          <button onClick={() => runAiAction('title')}>
            <Sparkles size={16} aria-hidden="true" />
            Smart Title
          </button>
          <button onClick={() => runAiAction('summary')}>
            <Wand2 size={16} aria-hidden="true" />
            Summarize
          </button>
          <button onClick={() => runAiAction('tags')}>
            <Tags size={16} aria-hidden="true" />
            Suggest Tags
          </button>
          <button onClick={() => runAiAction('improve')}>
            <Sparkles size={16} aria-hidden="true" />
            Improve Writing
          </button>
        </div>

        <div className="format-toolbar" aria-label="Formatting toolbar">
          {toolbarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className={item.active ? 'icon-button active' : 'icon-button'}
                onClick={item.action}
                aria-label={item.label}
                title={item.label}
                type="button"
              >
                <Icon size={17} aria-hidden="true" />
              </button>
            )
          })}
        </div>

        <EditorContent editor={editor} />
      </div>
    </main>
  )
}
