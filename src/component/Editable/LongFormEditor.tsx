import React from 'react';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { EditorComponentProps } from ".";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

interface LongFormEditorProps extends EditorComponentProps {}

const LongFormEditor: React.FC<LongFormEditorProps> = ({onUpdateField, path, value}) => {
  const blocks = htmlToDraft(value);
  const state = ContentState.createFromBlockArray(
    blocks.contentBlocks,
    blocks.entityMap
  );
  const editorState = EditorState.createWithContent(state)  

  return (
    <>
      <div className="RFC__Editable__Dialog__RichEditor">
        <Editor 
                defaultEditorState={editorState}
                onEditorStateChange={(e: any) => {
                  onUpdateField(path, draftToHtml(convertToRaw(e.getCurrentContent())))
                }}/>
      </div>
    </>
  ) 
}

export default LongFormEditor;