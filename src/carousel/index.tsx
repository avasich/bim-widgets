import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { BlockConfiguration, registerBlockType } from "@wordpress/blocks";
import { Attachment, store as coreDataStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";

import {
  BimEditorInputGroup,
  BimEditorList,
  InputFieldConfig,
} from "../components";
import json from "./block.json";
import "./editor.scss";

import { Panel, PanelBody } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import { v1 as uuidV1 } from "uuid";

interface CarouselItem {
  imageId?: number;
  text: string;
  url: string;
}

interface ItemWithMeta extends CarouselItem {
  _key: string;
}

interface ImageSettings {
  width: number;
  height: number;
  borderRadius: number;
}

interface CarouselSettings {
  rows: number;
  gaps: number;
  maxCols: number;
}

interface Attributes {
  items: CarouselItem[];
  imageSettings: ImageSettings;
  carouselSettings: CarouselSettings;
}

const assignMeta = (item: CarouselItem): ItemWithMeta => ({
  ...item,
  _key: uuidV1(),
});

const stripMeta = (itemWithKey: ItemWithMeta): CarouselItem => {
  const { _key, ...item } = itemWithKey;
  return item;
};

// Register the block
registerBlockType(json as BlockConfiguration<Attributes>, {
  edit: ({ attributes, setAttributes }) => {
    const { items, imageSettings, carouselSettings } = attributes;
    const [itemsWithMeta, setItemsWithMeta] = useState(() => {
      return items.map(assignMeta);
    });

    // items settings
    const config: InputFieldConfig<ItemWithMeta>[] = [
      {
        fieldName: "Image",
        label: "фото",
        getValue: (item) => item.imageId,
        newValue: (item, value) => ({ ...item, imageId: value }),
      },
      {
        fieldName: "RichText",
        label: "имя",
        getValue: (item) => item.text,
        newValue: (item, value) => ({ ...item, text: value }),
      },
    ];

    const setItems = ({ items }: { items: ItemWithMeta[] }) => {
      setItemsWithMeta(items);
      setAttributes({ items: items.map(stripMeta) });
    };

    const createItem = () => assignMeta({ text: "", url: "" });

    // image settings
    const imageSettingsConfig: InputFieldConfig<ImageSettings>[] = [
      {
        fieldName: "InputNumber",
        label: "ширина (px)",
        placeholder: 0,
        getValue: (settings) => settings.width,
        newValue: (settings, value) => ({ ...settings, width: value }),
      },
      {
        fieldName: "InputNumber",
        label: "высота (px)",
        placeholder: 0,
        getValue: (settings) => settings.height,
        newValue: (settings, value) => ({ ...settings, height: value }),
      },
      {
        fieldName: "InputNumber",
        label: "радиус углов (%)",
        placeholder: 0,
        getValue: (settings) => settings.borderRadius,
        newValue: (settings, value) => ({ ...settings, borderRadius: value }),
      },
    ];

    const onImageSettingsChange = (settings: ImageSettings) => {
      setAttributes({ imageSettings: settings });
    };

    // carousel settings
    const carouselSettingsConfig: InputFieldConfig<CarouselSettings>[] = [
      {
        fieldName: "InputNumber",
        label: "число строк",
        placeholder: 2,
        getValue: (settings) => settings.rows,
        newValue: (settings, value) => ({ ...settings, rows: value }),
      },
      {
        fieldName: "InputNumber",
        label: "максимальное число колонок",
        placeholder: 4,
        getValue: (settings) => settings.maxCols,
        newValue: (settings, value) => ({ ...settings, maxCols: value }),
      },
      {
        fieldName: "InputNumber",
        label: "зазор (px)",
        placeholder: 30,
        getValue: (settings) => settings.gaps,
        newValue: (settings, value) => ({ ...settings, gaps: value }),
      },
    ];

    const onCarouselSettingsChange = (settings: CarouselSettings) => {
      setAttributes({ carouselSettings: settings });
    };

    const blockProps = useBlockProps();

    useEffect(() => {
      const blockStyle = document.getElementById(blockProps.id)?.style;
      if (blockStyle != null) {
        blockStyle.setProperty(
          "--bim-carousel-image-width",
          `${imageSettings.width}px`
        );
        blockStyle.setProperty(
          "--bim-carousel-image-height",
          `${imageSettings.height}px`
        );
        blockStyle.setProperty(
          "--bim-carousel-image-border-radius",
          `${imageSettings.borderRadius}%`
        );
      }
    }, [imageSettings]);

    return (
      <div {...blockProps}>
        <InspectorControls>
          <Panel header="настройки">
            <PanelBody title="параметры изображения">
              <BimEditorInputGroup
                className="bim-editor-carousel-inspector"
                fieldsConfig={imageSettingsConfig}
                item={imageSettings}
                onItemChange={onImageSettingsChange}
              />
            </PanelBody>
            <PanelBody title="параметры карусели">
              <BimEditorInputGroup
                className="bim-editor-carousel-inspector"
                fieldsConfig={carouselSettingsConfig}
                item={carouselSettings}
                onItemChange={onCarouselSettingsChange}
              />
            </PanelBody>
          </Panel>
        </InspectorControls>
        <BimEditorList
          listItemClassName="bim-editor-carousel-item"
          items={itemsWithMeta}
          fieldsConfig={config}
          setItems={setItems}
          createDefaultItem={createItem}
          getItemKey={(item) => item._key}
          renderPreview={ItemPreview}
        />
      </div>
    );
  },

  save: () => null,
});

const ItemPreview = ({ imageId, text }: ItemWithMeta) => {
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

  return (
    <div className="bim-carousel-slide">
      <div className="bim-carousel-image-wrapper">
        <img src={imageUrl} />
      </div>
      <div
        className="bim-carousel-text"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
    </div>
  );
};
