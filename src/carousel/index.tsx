import {
  MediaUpload,
  MediaUploadCheck,
  useBlockProps,
} from "@wordpress/block-editor";
import { BlockConfiguration, registerBlockType } from "@wordpress/blocks";
import { Button } from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { WP_REST_API_Attachment } from "wp-types";

import json from "./block.json";
import "./editor.scss";

const instructions = <p>вам нужно разрешение на загрузку изображений</p>;
const ALLOWED_MEDIA_TYPES = ["image"];

type Image = { id: number } & { [k: string]: any };

interface Attributes {
  imageId: number;
}

// Register the block
registerBlockType(json as BlockConfiguration<Attributes>, {
  edit: ({ attributes, setAttributes }) => {
    const { imageId } = attributes;

    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
      if (imageId == null) {
        return;
      }

      const fetch = async () => {
        const imageData: WP_REST_API_Attachment = await apiFetch({
          path: `/wp/v2/media/${imageId}`,
        });
        setImageUrl(imageData.source_url);
      };

      fetch();
    }, []);

    const onUpdateImage = async (image: Image) => {
      setAttributes({
        imageId: image.id,
      });
      setImageUrl(image.url);
    };

    return (
      <div {...useBlockProps()}>
        <MediaUploadCheck fallback={instructions}>
          <MediaUpload
            title="изображение"
            onSelect={onUpdateImage}
            allowedTypes={ALLOWED_MEDIA_TYPES}
            value={imageId}
            render={({ open }) => (
              <>
                <Button
                  style={styles.button}
                  className="bim-image-upload-btn"
                  onClick={open}
                >
                  <img src={imageUrl} className="bim-image-upload-btn-img" />
                </Button>
              </>
            )}
          />
        </MediaUploadCheck>
      </div>
    );
  },

  save: () => <div hidden>!break-page-here!</div>,
});

interface StylesConfig {
  [key: string]: React.CSSProperties;
}

const styles: StylesConfig = {
  button: {},
};
