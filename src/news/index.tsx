import { useBlockProps } from "@wordpress/block-editor";
import { BlockConfiguration, registerBlockType } from "@wordpress/blocks";
import {
  BimEditorList,
  BimEditorInputGroup,
  InputFieldConfig,
} from "../components";

import json from "./block.json";

interface NewsItem {
  title: string;
  subtitle: string;
  url: string;
}

interface Attributes {
  news: NewsItem[];
  title: string;
}

registerBlockType(json as BlockConfiguration<Attributes>, {
  edit: ({ attributes, setAttributes }) => {
    const { news, title } = attributes;
    const createNewsItem = () => ({ title: "", subtitle: "", url: "" });
    const setItems = ({ items }: { items: NewsItem[] }) => {
      setAttributes({ news: items });
    };

    const config: InputFieldConfig<NewsItem>[] = [
      {
        fieldName: "input",
        label: "заголовок",
        placeholder: "Новая Статья",
        getValue: (item) => item.title,
        setValue: (item, value) => (item.title = value),
      },
      {
        fieldName: "RichText",
        label: "подпись",
        placeholder: "Вышла новая крутая статья",
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

    const titleConfig: InputFieldConfig<string>[] = [
      {
        fieldName: "input",
        placeholder: "ПОСЛЕДНИЕ ОБНОВЛЕНИЯ",
        label: "Заголовок",
        getValue: (title) => title,
        setValue: (_, newTitle) => setAttributes({ title: newTitle }),
      },
    ];

    return (
      <div {...useBlockProps()}>
        <div className="bim-editor-input-list">
          <BimEditorInputGroup item={title} fieldsConfig={titleConfig} />
          <BimEditorList
            items={news}
            createDefaultItem={createNewsItem}
            fieldsConfig={config}
            setItems={setItems}
          />
        </div>
      </div>
    );
  },
  save: () => null,
});
