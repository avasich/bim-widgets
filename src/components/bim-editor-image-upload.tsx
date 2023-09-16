import apiFetch from "@wordpress/api-fetch";
import {
  MediaUpload,
  MediaUploadCheck,
  useBlockProps,
} from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import { WP_REST_API_Attachment } from "wp-types";

import "./bim-editor-image-upload.scss";

const instructions = <p>вам нужно разрешение на загрузку изображений</p>;
const ALLOWED_MEDIA_TYPES = ["image"];

type Image = { id: number } & { [k: string]: any };

interface Attributes {
  imageId: number;
}

const BimEditorImageUpload = ({
  imageId,
  onChange,
  className,
}: {
  imageId: number;
  onChange: (newId: number) => void;
  className?: string;
}) => {
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
    onChange(image.id);
    setImageUrl(image.url);
  };

  const classes = `bim-image-upload-btn ${className ?? ""}`;

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
              <Button className={classes} onClick={open}>
                <img src={imageUrl} className="bim-image-upload-btn-img" />
              </Button>
            </>
          )}
        />
      </MediaUploadCheck>
    </div>
  );
};
