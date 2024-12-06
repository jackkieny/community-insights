import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { IconTrash } from '@tabler/icons-react';

interface PostFormContentProps {
  content: string;
  setContent: (value: string) => void;
}

export function Content({ content, setContent }: PostFormContentProps) {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder: 'Write something...' }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })


  return (
    <RichTextEditor editor={editor} mih={200}>
      <RichTextEditor.Toolbar>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control 
            title="Clear form"
            aria-label="Clear form"
            onClick={() => editor?.commands.setContent('')}
          ><IconTrash stroke={1.5} size="1rem"/>
          </RichTextEditor.Control>
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
