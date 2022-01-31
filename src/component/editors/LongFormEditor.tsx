import React from 'react';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { EditorComponentProps } from '../../interface/EditorComponentProps';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

interface LongFormEditorProps extends EditorComponentProps<string> {}

const LongFormEditor: React.FC<LongFormEditorProps> = ({onUpdate, value}) => {
  const blocks = htmlToDraft(value);
  const state = ContentState.createFromBlockArray(
    blocks.contentBlocks,
    blocks.entityMap
  );
  const editorState = EditorState.createWithContent(state)  

  return (
    <>
      <div className="RFCMS__Editable__Dialog__RichEditor">
        <Editor 
                defaultEditorState={editorState}
                onEditorStateChange={(e: any) => {
                  onUpdate(draftToHtml(convertToRaw(e.getCurrentContent())))
                }}/>
      </div>
    </>
  ) 
}

export default LongFormEditor;