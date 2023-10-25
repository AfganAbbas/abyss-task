import "./tree.css";
import { TreeItem } from "../../types/category";
import { useEffect, useState } from "react";
import PlusLogo from "../../assets/icons/plus.svg";
import CrossLogo from "../../assets/icons/cross.svg";
import DoneLogo from "../../assets/icons/done.svg";
import PenLogo from "../../assets/icons/pen.svg";
import FoldLogo from "../../assets/icons/fold.svg";

function keyGenerate(parentKey: string, childKey: string, separator = "-") {
  return parentKey + separator + childKey;
}

const TreeNode: React.FC<{
  node: TreeItem;
  handleChildAdd: (targetKey: string, newChildContent: string) => void;
  handleChildEdit: (targetKey: string, newContent: string) => void;
  handleChildDelete: (targetKey: string) => void;
  handleLastNodeSet: (node: TreeItem) => void;
}> = ({
  node,
  handleChildAdd,
  handleChildEdit,
  handleChildDelete,
  handleLastNodeSet,
}) => {
  const { label, children } = node;
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newLabel, setNewLabel] = useState<string>("");
  const [showChildren, setShowChildren] = useState(true);

  const handleSubmit = () => {
    if (newLabel !== "") {
      setEditMode(false);
      handleChildEdit(node.key, newLabel);
    } else {
      handleChildDelete(node.key);
    }
  };
  const childAdd = () => {
    setShowChildren(true);
    handleLastNodeSet(node);
    handleChildAdd(node.key, "");
  };
  const handleCancel = () => {
    if (node.label !== "") {
      setEditMode(false);
    } else {
      handleChildDelete(node.key);
    }
  };

  const handleExpand = () => {
    setShowChildren(!showChildren);
  };
  useEffect(() => {
    if (label.length === 0) {
      setEditMode(true);
    }
  }, [label]);

  return (
    <li>
      <div className="item-wraper">
        <div className="options">
          {children.length !== 0 && (
            <button className="options__item" onClick={handleExpand}>
              <img
                src={FoldLogo}
                alt="fold"
                style={!showChildren ? { transform: "rotate(180deg)" } : {}}
              />
            </button>
          )}
        </div>
        {editMode ? (
          <input
            value={newLabel}
            placeholder="Enter label"
            onChange={(e) => {
              setNewLabel(e.target.value);
            }}
          />
        ) : (
          <div className="label">{label}</div>
        )}

        <div className="options">
          {node.root ? (
            <>
              <button className="options__item" onClick={childAdd}>
                <img src={PlusLogo} alt="plus" />
              </button>
            </>
          ) : (
            <>
              {!editMode ? (
                <>
                  <button className="options__item" onClick={childAdd}>
                    <img src={PlusLogo} alt="plus" />
                  </button>
                  <button
                    className="options__item neutral"
                    onClick={() => setEditMode(true)}
                  >
                    <img src={PenLogo} alt="pen" />
                  </button>
                  <button
                    className="options__item negative"
                    onClick={() => handleChildDelete(node.key)}
                  >
                    <img src={CrossLogo} alt="cross" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="options__item positive"
                    onClick={handleSubmit}
                  >
                    <img src={DoneLogo} alt="done" />
                  </button>
                  <button
                    className="options__item negative"
                    onClick={() => handleCancel()}
                  >
                    <img src={CrossLogo} alt="cross" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <>
        {children.length !== 0 && showChildren && (
          <ul>
            <Tree
              treeData={children}
              handleChildAdd={handleChildAdd}
              handleChildEdit={handleChildEdit}
              handleChildDelete={handleChildDelete}
              handleLastNodeSet={handleLastNodeSet}
            />
          </ul>
        )}
      </>
    </li>
  );
};

const Tree: React.FC<{
  treeData: TreeItem[];
  handleChildAdd: (targetKey: string, newChildContent: string) => void;
  handleChildEdit: (targetKey: string, newContent: string) => void;
  handleChildDelete: (targetKey: string) => void;
  handleLastNodeSet: (node: TreeItem) => void;
}> = ({
  treeData,
  handleChildAdd,
  handleChildEdit,
  handleChildDelete,
  handleLastNodeSet,
}) => {
  return (
    treeData.length !== 0 && (
      <>
        {treeData.map((node: TreeItem) => (
          <TreeNode
            node={node}
            key={node.key}
            handleChildAdd={handleChildAdd}
            handleChildEdit={handleChildEdit}
            handleChildDelete={handleChildDelete}
            handleLastNodeSet={handleLastNodeSet}
          />
        ))}
      </>
    )
  );
};

const MainTree = () => {
  const testTreeData: TreeItem[] = [
    {
      key: "0",
      label: "Category",
      root: true,
      children: [],
    },
  ];
  const [tree, setTree] = useState<TreeItem[]>(testTreeData);

  const handleLastNodeSet = (node: TreeItem) => {
    if (node.children.length !== 0) {
      const lastItem: TreeItem = node.children[node.children.length - 1];
      if (lastItem.label == "") {
        deleteChildNode(lastItem.key);
      }
    }
  };

  const addChildToNode = (
    targetKey: string,
    newChildContent: string = "hello"
  ) => {
    setTree((prevTreeData) => {
      const updatedTreeData = JSON.parse(JSON.stringify(prevTreeData));

      const addNodeToTree = (
        tree: TreeItem[],
        targetKey: string,
        newChildContent: string
      ) => {
        for (const node1 of tree) {
          if (node1.key === targetKey) {
            const newItem: TreeItem = {
              pid: node1.key,
              label: newChildContent,
              key: keyGenerate(node1.key, String(node1.children.length + 1)),
              children: [],
            };
            node1.children.push(newItem);
            return;
          } else {
            if (node1.children.length > 0) {
              addNodeToTree(node1.children, targetKey, newChildContent);
            }
          }
        }
      };

      addNodeToTree(updatedTreeData, targetKey, newChildContent);
      return updatedTreeData;
    });
  };
  const editChildNode = (targetKey: string, newContent: string) => {
    setTree((prevTreeData) => {
      const updatedTreeData = JSON.parse(JSON.stringify(prevTreeData));

      const editNodeInTree = (
        tree: TreeItem[],
        targetKey: string,
        newContent: string
      ) => {
        for (const node of tree) {
          if (node.key === targetKey) {
            node.label = newContent;
            return;
          } else {
            if (node.children.length > 0) {
              editNodeInTree(node.children, targetKey, newContent);
            }
          }
        }
      };

      editNodeInTree(updatedTreeData, targetKey, newContent);

      return updatedTreeData;
    });
  };
  const deleteChildNode = (targetKey: string) => {
    setTree((prevTreeData) => {
      const updatedTreeData = JSON.parse(JSON.stringify(prevTreeData));

      const deleteNodeInTree = (tree: TreeItem[], targetKey: string) => {
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].key === targetKey) {
            tree.splice(i, 1);
            return;
          } else if (tree[i].children.length > 0) {
            deleteNodeInTree(tree[i].children, targetKey);
          }
        }
      };

      deleteNodeInTree(updatedTreeData, targetKey);

      return updatedTreeData;
    });
  };

  return (
    <ul className="tree">
      <Tree
        treeData={tree}
        handleChildAdd={addChildToNode}
        handleChildEdit={editChildNode}
        handleChildDelete={deleteChildNode}
        handleLastNodeSet={handleLastNodeSet}
      />
    </ul>
  );
};

export default MainTree;
