import { useBlockProps } from "@wordpress/block-editor";
import { BlockConfiguration, registerBlockType } from "@wordpress/blocks";
import { BimEditorList, InputFieldConfig } from "../components";

import json from "./block.json";

interface Card {
  title: string;
  subtitle: string;
  url: string;
}

interface Attributes {
  cards: Card[];
  maxColumns: number;
}

registerBlockType(json as BlockConfiguration<Attributes>, {
  edit: ({ attributes, setAttributes }) => {
    const { cards } = attributes;
    const createCard = () => ({ title: "", subtitle: "", url: "" });
    const setItems = ({ items }: { items: Card[] }) => {
      setAttributes({ cards: items });
    };
    const config: InputFieldConfig<Card>[] = [
      {
        fieldName: "input",
        label: "заголовок",
        placeholder: "FAQ",
        getValue: (item) => item.title,
        setValue: (item, value) => (item.title = value),
      },
      {
        fieldName: "RichText",
        label: "подпись",
        placeholder: "какой-то текст",
        getValue: (item) => item.subtitle,
        setValue: (item, value) => (item.subtitle = value),
      },
      {
        fieldName: "input",
        label: "ссылка",
        placeholder: "https://standard.ds.do",
        getValue: (item) => item.url,
        setValue: (item, value) => (item.url = value),
      },
    ];
    return (
      <div {...useBlockProps()}>
        <BimEditorList
          items={cards}
          createDefaultItem={createCard}
          fieldsConfig={config}
          setItems={setItems}
        />
      </div>
    );
  },
  save: () => null,
});
