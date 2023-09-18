import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";

import { Attachment, store as coreDataStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import "./bim-editor-image-upload.scss";

const instructions = <p>вам нужно разрешение на загрузку изображений</p>;
const ALLOWED_MEDIA_TYPES = ["image"];

interface BimImage {
  id: number;
}

export const BimEditorImageUpload = ({
  imageId,
  onChange,
}: {
  imageId?: number;
  onChange: (image: number) => void;
}) => {
  const imageUrl = useSelect(
    (select) => {
      return imageId == null
        ? ""
        : select(coreDataStore).getEntityRecord<Attachment>(
            "postType",
            "attachment",
            imageId
          )?.source_url;
    },
    [imageId]
  );

  const onUpdateImage = (image: BimImage) => {
    onChange(image.id);
  };

  return (
    <MediaUploadCheck fallback={instructions}>
      <MediaUpload
        title="изображение"
        onSelect={onUpdateImage}
        allowedTypes={ALLOWED_MEDIA_TYPES}
        value={imageId}
        render={({ open }) => (
          <Button className="bim-image-upload-btn" onClick={open}>
            <img src={imageUrl} className="bim-image-upload-btn-img" />
          </Button>
        )}
      />
    </MediaUploadCheck>
  );
};
