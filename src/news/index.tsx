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
    const setTitle = (title: string) => {
      setAttributes({ title: title });
    };

    const config: InputFieldConfig<NewsItem>[] = [
      {
        fieldName: "InputText",
        label: "заголовок",
        placeholder: "Новая Статья",
        getValue: (item) => item.title,
        newValue: (item, value) => ({ ...item, title: value }),
      },
      {
        fieldName: "RichText",
        label: "подпись",
        placeholder: "Вышла новая крутая статья",
        getValue: (item) => item.subtitle,
        newValue: (item, value) => ({ ...item, subtitle: value }),
      },
      {
        fieldName: "InputText",
        label: "ссылка",
        placeholder: "https://standard.ds.do",
        getValue: (item) => item.url,
        newValue: (item, value) => ({ ...item, url: value }),
      },
    ];

    const titleConfig: InputFieldConfig<string>[] = [
      {
        fieldName: "InputText",
        placeholder: "ПОСЛЕДНИЕ ОБНОВЛЕНИЯ",
        label: "Заголовок",
        getValue: (title) => title,
        newValue: (_, value) => value,
      },
    ];

    return (
      <div {...useBlockProps()}>
        <div className="bim-editor-input-list">
          <BimEditorInputGroup
            item={title}
            fieldsConfig={titleConfig}
            onItemChange={setTitle}
          />
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
