import React from "react";
import { useItemStore } from "../store/itemStore";
import { useState } from "react";
import { useEffect } from "react";
import ItemAddModal from "./modals/ItemAddModal";

const ItemsList = ({ orgId }) => {
  const { getItems, createItems, items } = useItemStore();
  const [showItemsModal, setShowItemsModal] = useState(false);

  const getAllItems = async (orgId) => {
    try {
      await getItems(orgId);
    } catch (err) {
      console.log("Error adding item: ", err);
    }
  };

  useEffect(() => {
    getAllItems(orgId);
  }, [orgId]);

  return (
    <React.Fragment>
      <h1>Items</h1>
      <button onClick={() => setShowItemsModal(true)}>Add Item</button>
      <div className="flex flex-col">
        {items?.map((item) => (
          <div className="text-black" key={item._id}>
            <p>Item name: {item.name}</p>
            <p>Unit: {item.unit}</p>
          </div>
        ))}

        {showItemsModal ? (
          <ItemAddModal
            orgId={orgId}
            onClose={() => setShowItemsModal(false)}
            onSuccess={() => getAllItems(orgId)}
          />
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default ItemsList;
