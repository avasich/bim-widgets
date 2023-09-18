/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { RichText } from "@wordpress/block-editor";
import { Button, TextControl } from "@wordpress/components";
import { Icon, chevronDown, chevronUp, close, create } from "@wordpress/icons";

import { BimEditorImageUpload, BimSpacer } from ".";
import "./bim-editor-input.scss";

interface BaseInputFieldConfig<F extends string, I, V> {
  fieldName: F;
  label?: string;
  getValue: (item: I) => V;
  newValue: (item: I, value: V) => I;
}

interface InputTextInputField<Item>
  extends BaseInputFieldConfig<"InputText", Item, string> {
  placeholder?: string;
}

interface InputNumberField<Item>
  extends BaseInputFieldConfig<"InputNumber", Item, number> {
  placeholder?: number;
}

interface RichTextInputField<Item>
  extends BaseInputFieldConfig<"RichText", Item, string> {
  placeholder?: string;
}

interface ImageInputField<Item>
  extends BaseInputFieldConfig<"Image", Item, number | undefined> {}

export type InputFieldConfig<Item> =
  | InputTextInputField<Item>
  | RichTextInputField<Item>
  | ImageInputField<Item>
  | InputNumberField<Item>;

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
    case "InputText": {
      const onChange = (value: string) => {
        const newItem = config.newValue(item, value);
        onItemChange(newItem);
      };
      return (
        <TextControl // return (
          //   <div className="bim-editor-input-list-item" key={getItemKey(item, i)}>
          //     <div className="bim-editor-input-preview">
          //       {renderPreview && renderPreview(item)}
          //     </div>
          //     <BimEditorInputGroup
          //       item={item}
          //       fieldsConfig={fieldsConfig}
          //       onItemChange={changeItem(i)}
          //       className={listItemClassName}
          //     />
          //     <BimListItemControls
          //       onMoveUp={onMoveUp(i)}
          //       onMoveDown={onMoveDown(i)}
          //       onRemove={onRemove(i)}
          //       moveUpDisabled={i === 0}
          //       moveDownDisabled={i === items.length - 1}
          //     />
          //   </div>
          // );
          className="bim-editor-input"
          type="text"
          value={config.getValue(item)}
          placeholder={config.placeholder}
          onChange={onChange}
        />
      );
    }
    case "InputNumber": {
      const onChange = (value: string) => {
        const newItem = config.newValue(item, Number(value));
        onItemChange(newItem);
      };
      const placeholder = (config.placeholder ?? 0).toString();
      return (
        <TextControl
          className="bim-editor-input"
          type="number"
          value={config.getValue(item)}
          placeholder={placeholder}
          onChange={onChange}
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
      const onChange = (value: number) => {
        const newItem = config.newValue(item, value);
        onItemChange(newItem);
      };
      return (
        <BimEditorImageUpload
          imageId={config.getValue(item)}
          onChange={onChange}
        />
      );
    }
  }
};

export const BimEditorInputGroup = <Item,>({
  fieldsConfig,
  item,
  onItemChange,
  className = "",
}: {
  fieldsConfig: InputFieldConfig<Item>[];
  item: Item;
  onItemChange: (item: Item) => void;
  className?: string;
}) => {
  return (
    <div className={`bim-editor-input-group ${className}`}>
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

export type RenderPreview<Item> = (item: Item) => React.JSX.Element;

const BimEditorListItem = <Item,>({
  item,
  fieldsConfig,
  changeItem,
  listItemClassName = "",
  renderPreview,
  onMoveUp,
  onMoveDown,
  onRemove,
  moveUpDisabled,
  moveDownDisabled,
}: {
  item: Item;
  fieldsConfig: InputFieldConfig<Item>[];
  changeItem: (item: Item) => void;
  listItemClassName: string;
  renderPreview?: RenderPreview<Item>;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  moveUpDisabled: boolean;
  moveDownDisabled: boolean;
}) => {
  return (
    <div className="bim-editor-input-list-item">
      <div className="bim-editor-input-preview">
        {renderPreview && renderPreview(item)}
      </div>
      <BimEditorInputGroup
        item={item}
        fieldsConfig={fieldsConfig}
        onItemChange={changeItem}
        className={listItemClassName}
      />
      <BimListItemControls
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onRemove={onRemove}
        moveUpDisabled={moveUpDisabled}
        moveDownDisabled={moveDownDisabled}
      />
    </div>
  );
};

export const BimEditorList = <Item,>({
  items,
  fieldsConfig,
  setItems,
  createDefaultItem,
  getItemKey = (_, index) => index,
  listItemClassName = "",
  renderPreview,
}: {
  items: Item[];
  fieldsConfig: InputFieldConfig<Item>[];
  setItems: ({ items }: { items: Item[] }) => void;
  createDefaultItem: () => Item;
  getItemKey?: (item: Item, index: number) => string | number;
  listItemClassName?: string;
  renderPreview?: RenderPreview<Item>;
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
          <BimEditorListItem
            key={getItemKey(item, i)}
            item={item}
            changeItem={changeItem(i)}
            fieldsConfig={fieldsConfig}
            listItemClassName={listItemClassName}
            onMoveUp={onMoveUp(i)}
            onMoveDown={onMoveDown(i)}
            onRemove={onRemove(i)}
            moveUpDisabled={i === 0}
            moveDownDisabled={i === items.length - 1}
            renderPreview={renderPreview}
          />
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
