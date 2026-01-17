import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateDeptPanel from "../components/CreateDeptPanel";
import { useDeptStore } from "../store/deptStore";

const OrgDashboard = () => {
  const { orgId } = useParams();
  const [deptPanel, setDeptPanel] = useState(false);
  const { deptList, getAllDepts } = useDeptStore();
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

  return (
    <React.Fragment>
      <p> {`This is an org dashboard of id: ${orgId}`} </p>
      <button onClick={() => setDeptPanel(!deptPanel)}>Create a dept</button>
      {deptPanel ? (
        <CreateDeptPanel orgId={orgId} panelStatus={setDeptPanel} />
      ) : null}

      {deptList ? (
        deptList.map((element) => {
          console.log(element._id);
          return (
            <p
              onClick={() => navigate(`/orgDashboard/${element._id}`)}
              key={element._id}
            >
              {element.name}
              <button onClick={(e) => {}}>Delete org</button>
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
