import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateDeptPanel from "../components/CreateDeptPanel";
import { useDeptStore } from "../store/deptStore";
import { useNavigate } from "react-router-dom";

const OrgDashboard = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const [deptPanel, setDeptPanel] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDeptDetails, setEditDeptDetails] = useState({
    id: null,
    name: null,
  });
  const { deptList, getAllDepts, deleteDept, editDept } = useDeptStore();
  useEffect(() => {
    async function getDepts() {
      try {
        await getAllDepts({ orgId: orgId });
      } catch (err) {
        throw err;
      }
    }
    getDepts();
  }, [orgId]);

  const handleDelete = async (id) => {
    try {
      await deleteDept({ deptId: id });
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = async (id, name) => {
    try {
      await editDept({ deptId: id, name: name });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <p> {`This is an org dashboard of id: ${orgId}`} </p>
      <button onClick={() => setDeptPanel(!deptPanel)}>Create a dept</button>
      {deptPanel ? (
        <CreateDeptPanel orgId={orgId} panelStatus={setDeptPanel} />
      ) : null}

      {deptList ? (
        deptList.map((element) => {
          return (
            <p key={element._id}>
              {editMode && editDeptDetails.id == element._id ? (
                <input
                  type="text"
                  value={editDeptDetails.name}
                  onChange={(e) => {
                    setEditDeptDetails((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      handleEdit(editDeptDetails.id, editDeptDetails.name);
                      setEditMode(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <a> {element.name}</a>
              )}

              <button
                onClick={(e) => {
                  handleDelete(element._id);
                }}
              >
                Delete department
              </button>
              <button
                onClick={() => {
                  setEditMode(true);
                  setEditDeptDetails({ id: element._id, name: element.name });
                }}
              >
                Edit dept name
              </button>
            </p>
          );
        })
      ) : (
        <p>No depts found</p>
      )}
    </React.Fragment>
  );
};

export default OrgDashboard;
