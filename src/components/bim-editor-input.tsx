/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { RichText } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Icon, chevronDown, chevronUp, close, create } from "@wordpress/icons";

import { BimSpacer } from ".";
import "./bim-editor-input.scss";

interface BaseInputFieldConfig<F extends string, I, V> {
  fieldName: F;
  label?: string;
  getValue: (item: I) => V;
  newValue: (item: I, value: V) => I;
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
  onItemChange: (item: Item) => void;
}) => {
  switch (config.fieldName) {
    case "input": {
      const onChange = (value: string) => {
        const newItem = config.newValue(item, value);
        onItemChange(newItem);
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
        const newItem = config.newValue(item, value);
        onItemChange(newItem);
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
  onItemChange: (item: Item) => void;
}) => {
  return (
    <div className="bim-editor-input-group">
      {fieldsConfig.map((config, i) => {
        return (
          <div className="bim-editor-input-row" key={i}>
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

  const changeItem = (i: number) => (item: Item) => {
    const newItems = [...items.slice(0, i), item, ...items.slice(i + 1)];
    setItems({ items: newItems });
  };

  const onMoveUp = (i: number) => () => {
    const newItems = [...items];
    [newItems[i - 1], newItems[i]] = [newItems[i], newItems[i - 1]];

    setItems({ items: newItems });
  };

  const onMoveDown = (i: number) => () => {
    const newItems = [...items];
    [newItems[i + 1], newItems[i]] = [newItems[i], newItems[i + 1]];

    setItems({ items: newItems });
  };

  const onRemove = (i: number) => () => {
    const newItems = [...items.slice(0, i), ...items.slice(i + 1)];
    setItems({ items: newItems });
  };

  return (
    <div className="bim-editor-input-list">
      {items.map((item, i) => {
        return (
          <div className="bim-editor-input-list-item" key={i}>
            <BimEditorInputGroup
              item={item}
              fieldsConfig={fieldsConfig}
              onItemChange={changeItem(i)}
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
