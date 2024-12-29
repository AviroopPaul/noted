import { NodeViewWrapper } from "@tiptap/react";
import { Node } from "@tiptap/pm/model";

interface ImageComponentProps {
  node: Node;
  selected: boolean;
}

const ImageComponent = ({ node, selected }: ImageComponentProps) => {
  return (
    <NodeViewWrapper className="image-wrapper">
      <img
        src={node.attrs.src}
        className={`editor-image ${selected ? "selected" : ""}`}
        alt={node.attrs.alt || ""}
      />
    </NodeViewWrapper>
  );
};

export default ImageComponent;
