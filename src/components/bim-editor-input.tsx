/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { RichText } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Icon, chevronDown, chevronUp, close, create } from "@wordpress/icons";

import { BimSpacer } from ".";
import "./editor.scss";

interface BaseInputFieldConfig<F extends string, I, V> {
  fieldName: F;
  label?: string;
  getValue: (item: I) => V;
  setValue: (item: I, value: V) => void;
}

interface InputInputField<Item>
  extends BaseInputFieldConfig<"input", Item, string> {
  placeholder?: string;
}

interface RichTextInputField<Item>
  extends BaseInputFieldConfig<"RichText", Item, string> {
  placeholder?: string;
}

interface ImageInputField<Item>
  extends BaseInputFieldConfig<"Image", Item, number> {}

export type InputFieldConfig<Item> =
  | InputInputField<Item>
  | RichTextInputField<Item>
  | ImageInputField<Item>;

export const BimEditorInputField = <Item,>({
  item,
  config,
  onItemChange,
}: {
  item: Item;
  config: InputFieldConfig<Item>;
  onItemChange?: (item: Item) => void;
}) => {
  switch (config.fieldName) {
    case "input": {
      const onChange = (value: string) => {
        config.setValue(item, value);
        onItemChange?.(item);
      };
      return (
        <input
          className="bim-editor-input"
          value={config.getValue(item)}
          placeholder={config.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }
    case "RichText": {
      const onChange = (value: string) => {
        config.setValue(item, value);
        onItemChange?.(item);
      };
      return (
        <RichText
          className="bim-editor-input"
          value={config.getValue(item)}
          placeholder={config.placeholder}
          onChange={onChange}
        />
      );
    }
    case "Image": {
      return <div>image loader will be here</div>;
    }
  }
};

export const BimEditorInputGroup = <Item,>({
  fieldsConfig,
  item,
  onItemChange,
}: {
  fieldsConfig: InputFieldConfig<Item>[];
  item: Item;
  onItemChange?: (item: Item) => void;
}) => {
  return (
    <div className="bim-editor-input-group">
      {fieldsConfig.map((config) => {
        return (
          <div className="bim-editor-input-row">
            <span className="bim-editor-input-label">{config.label}</span>
            <BimEditorInputField
              item={item}
              config={config}
              onItemChange={onItemChange}
            />
          </div>
        );
      })}
    </div>
  );
};

export const BimListItemControls = ({
  onMoveUp,
  onMoveDown,
  onRemove,
  moveUpDisabled = false,
  moveDownDisabled = false,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  moveUpDisabled: boolean;
  moveDownDisabled: boolean;
}) => (
  <div className="bim-editor-btn-column">
    <Button
      className="bim-editor-round-btn"
      onClick={onMoveUp}
      disabled={moveUpDisabled}
    >
      <Icon icon={chevronUp} size={24} />
    </Button>
    <Button
      className="bim-editor-round-btn"
      onClick={onMoveDown}
      disabled={moveDownDisabled}
    >
      <Icon icon={chevronDown} size={24} />
    </Button>
    <BimSpacer height="100%" />
    <Button
      className="bim-editor-round-btn bim-editor-round-btn-remove"
      onClick={onRemove}
    >
      <Icon icon={close} size={24} />
    </Button>
  </div>
);

export const BimEditorList = <Item,>({
  items,
  fieldsConfig,
  setItems,
  createDefaultItem,
}: {
  items: Item[];
  fieldsConfig: InputFieldConfig<Item>[];
  setItems: ({ items }: { items: Item[] }) => void;
  createDefaultItem: () => Item;
}) => {
  const onAddItem = () => {
    setItems({
      items: [...items, createDefaultItem()],
    });
  };

  const updateItems = () => setItems({ items: [...items] });

  const onMoveUp = (i: number) => () => {
    [items[i - 1], items[i]] = [items[i], items[i - 1]];

    setItems({ items: [...items] });
  };

  const onMoveDown = (i: number) => () => {
    [items[i + 1], items[i]] = [items[i], items[i + 1]];

    setItems({ items: [...items] });
  };

  const onRemove = (i: number) => () => {
    items.splice(i, 1);
    setItems({ items: [...items] });
  };

  return (
    <div className="bim-editor-input-list">
      {items.map((item, i) => {
        return (
          <div className="bim-editor-input-list-item" key={i}>
            <BimEditorInputGroup
              item={item}
              fieldsConfig={fieldsConfig}
              onItemChange={updateItems}
            />
            <BimListItemControls
              onMoveUp={onMoveUp(i)}
              onMoveDown={onMoveDown(i)}
              onRemove={onRemove(i)}
              moveUpDisabled={i === 0}
              moveDownDisabled={i === items.length - 1}
            />
          </div>
        );
      })}
      <div className="bim-editor-add-btn-container">
        <Button className="bim-editor-round-btn" onClick={onAddItem}>
          <Icon icon={create} size={24} />
        </Button>
      </div>
    </div>
  );
};
