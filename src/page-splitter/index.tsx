import { useBlockProps } from "@wordpress/block-editor";
import { BlockConfiguration, registerBlockType } from "@wordpress/blocks";

import json from "./block.json";

// Register the block
registerBlockType(json as BlockConfiguration, {
  edit: () => (
    <div {...useBlockProps()}>
      <div style={{ margin: "auto", textAlign: "center" }}>
        -----------------РАЗРЫВ СТРАНИЦЫ-----------------
      </div>
    </div>
  ),

  save: () => <div hidden>!break-page-here!</div>,
});