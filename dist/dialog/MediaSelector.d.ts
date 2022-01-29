import React from 'react';
export interface MediaSelectorProps {
    onSelect: (url: string) => void;
}
declare const MediaSelector: React.FC<MediaSelectorProps>;
export default MediaSelector;
