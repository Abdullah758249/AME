"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from "lucide-react";
import { MediaPicker } from "./MediaPicker";

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [imagePickOpen, setImagePickOpen] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "اكتب المحتوى هنا..." }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[220px] max-w-none px-4 py-3 focus:outline-none text-zinc-100",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== (current === "<p></p>" ? "" : current)) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  const insertImage = useCallback(
    (url: string) => {
      if (!editor || !url) return;
      editor.chain().focus().setImage({ src: url, alt: "" }).run();
      setImagePickOpen(false);
      setPendingImageUrl("");
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-400">{label}</label>
      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
        <div className="flex flex-wrap gap-1 border-b border-zinc-700 bg-zinc-900/80 p-2">
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="عريض"
          >
            <Bold className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="مائل"
          >
            <Italic className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="تحته خط"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="عنوان"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="قائمة"
          >
            <List className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="قائمة مرقمة"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="يمين"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="وسط"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="يسار"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => {
              const url = window.prompt("رابط:");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            active={editor.isActive("link")}
            title="رابط"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => setImagePickOpen(true)}
            active={false}
            title="إدراج صورة في المحتوى"
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarBtn>
        </div>
        <EditorContent editor={editor} />
      </div>
      <p className="text-xs text-zinc-500">
        ضع الصور داخل النص عبر زر الصورة — موضعها يتبع مكان المؤشر. لا تلصق مسار ملف من جهازك.
      </p>

      {imagePickOpen && (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
          <p className="mb-2 text-sm font-medium">إدراج صورة في المحتوى</p>
          <MediaPicker
            label=""
            value={pendingImageUrl}
            onChange={(url) => {
              setPendingImageUrl(url);
              insertImage(url);
            }}
            mode="image"
          />
          <button
            type="button"
            className="mt-2 text-sm text-zinc-400"
            onClick={() => setImagePickOpen(false)}
          >
            إلغاء
          </button>
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded p-2 hover:bg-zinc-700 ${active ? "bg-sky-900 text-sky-300" : "text-zinc-300"}`}
    >
      {children}
    </button>
  );
}
