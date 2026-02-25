import React, { useEffect, useState } from "react";
import { useItemStore } from "../store/itemStore";
import ItemAddModal from "./modals/ItemAddModal";

const ItemsList = ({ orgId }) => {
  const { getItems, items, loading, deleteItem } = useItemStore();
  const [showItemsModal, setShowItemsModal] = useState(false);

  const getAllItems = async () => {
    try {
      await getItems(orgId);
    } catch (err) {
      console.log("Error fetching items: ", err);
    }
  };

  useEffect(() => {
    if (orgId) getAllItems();
  }, [orgId]);

  const deleteItemById = async (itemId) => {
    try {
      await deleteItem(itemId, orgId);
    } catch (err) {
      console.log("Error deleting item: ", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Items</h2>
        <button
          type="button"
          onClick={() => setShowItemsModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Add Item
        </button>
      </div>

      {showItemsModal && (
        <ItemAddModal
          orgId={orgId}
          onClose={() => setShowItemsModal(false)}
          onSuccess={() => getAllItems()}
        />
      )}

      {loading && (
        <p className="text-gray-500 text-sm py-4">Loading items...</p>
      )}

      {!loading && items && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-row flex-wrap justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-lg font-semibold text-gray-500">
                    {item.name?.charAt(0)?.toUpperCase() ?? "I"}
                  </span>
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <p className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Unit: {item.unit ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => deleteItemById(item._id)}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (!items || items.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No items found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Add your first item to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
