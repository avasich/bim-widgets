import {
  MediaUpload,
  MediaUploadCheck,
  useBlockProps,
} from "@wordpress/block-editor";
import { BlockConfiguration, registerBlockType } from "@wordpress/blocks";
import { Button, PanelBody } from "@wordpress/components";
import { addFilter } from "@wordpress/hooks";

import {MediaUpload as MU} from "@wordpress/media-utils"

import json from "./block.json";

const instructions = <p>вам нужно разрешение на загрузку изображений</p>;
const ALLOWED_MEDIA_TYPES = ["image"];

const replaceMediaUpload = () => MediaUpload;

addFilter(
  "editor.MediaUpload",
  "core/edit-post/components/media-upload/replace-media-upload",
  replaceMediaUpload
);

type Image = { id: number } & { [k: string]: any };

interface Attributes {
  imageId: number;
}

// Register the block
registerBlockType(json as BlockConfiguration<Attributes>, {
  edit: ({ attributes, setAttributes }) => {
    const { imageId } = attributes;
    const onUpdateImage = (image: Image) => {
      console.log(image);
      setAttributes({
        imageId: image.id,
      });
    };

    return (
      <div {...useBlockProps()}>
        <div
          style={{ width: "100px", height: "100px", backgroundColor: "red" }}
        ></div>
        <PanelBody title="карусель" initialOpen={true}>
          <MediaUploadCheck fallback={instructions}>
            <MediaUpload
              title="изображение"
              onSelect={onUpdateImage}
              allowedTypes={ALLOWED_MEDIA_TYPES}
              value={imageId}
              render={({ open }) => (
                <Button
                  className={"editor-post-featured-image__toggle"}
                  onClick={open}
                >
                  загрузить изображение
                </Button>
              )}
            />
          </MediaUploadCheck>
        </PanelBody>
      </div>
    );
  },

  save: () => <div hidden>!break-page-here!</div>,
});
