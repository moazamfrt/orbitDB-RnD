import React, { useState } from "react";
import {
  initIPFS,
  initOrbitDB,
  getAllDatabases,
  getDB,
  createDatabase,
  addDatabase,
} from "../database";

function Main() {
  const [alldb, setalldb] = useState([]);
  const [selectedDB, setSelectedDB] = useState(null);
  const [dbaddress, setdbaddress] = useState("");
  const [addRemoteDB, setAddRemoteDB] = useState("");
  const [data, setData] = useState([]);
  const [createDBName, setCreateDBName] = useState("");

  React.useEffect(() => {
    initIPFS().then(async (ipfs) => {
      initOrbitDB(ipfs).then(async (databases) => {
        const programs = await getAllDatabases();
        setalldb(programs);
        console.log(alldb, "all dbs");
      });
    });
  }, [alldb]);

  const allDBData = async () => {
    const programs = await getAllDatabases();
    setalldb(programs);
    console.log(alldb, "all dbs");
  };
  const getSpecificDB = async () => {
    const db = await getDB(dbaddress);
    setSelectedDB(db);
    console.log(db, "===========");
  };

  const createDB = async () => {
    await createDatabase(createDBName, "docstore", "public").then(() => {
      console.log("DataBase Created");
    });
  };
  const addEntry = async () => {
    await selectedDB.put({ _id: "key", value: "value" }).then(() => {
      console.log("Entered successfully");
    });
  };
  const getData = async () => {
    const queryData = selectedDB
      .query((e) => e !== null, { fullOp: true })
      .reverse();
    console.log(queryData, "kkkkkkkkkkk");
    setData(queryData);
  };

  // add RemoteDb section
  const addDB = (address) => {
    console.log("Add database...");
    addDatabase(address).then(async (hash) => {
      console.log("Added", address);
      const db = await getDB(address);
      setSelectedDB(db);
    });
  };

  return (
    <div style={{ align: "center", justify: "center" }}>
      <>
        <ul>
          {alldb.map((data) => {
            return (
              <>
                <li>{data.payload.value.name}</li>
                <li>{data.payload.value.type}</li>
                <li>{data.payload.value.address}</li>
                <br />
              </>
            );
          })}
        </ul>
        <br />
        <button onClick={getSpecificDB}>Get Selected Db</button>
        <input
          onChange={(e) => setdbaddress(e.target.value)}
          value={dbaddress}
        />
        <br />
        <button onClick={createDB}>Create DB</button>
        <input
          onChange={(e) => setCreateDBName(e.target.value)}
          value={createDBName}
        />
        <br />
        <button onClick={allDBData}>get All DB</button>
        <br />
        <button onClick={addEntry}>Add Data</button>
        <button onClick={getData}>Query get Data</button>

        <ul>
          {data.map((data) => {
            return (
              <>
                <li>{JSON.stringify(data.payload.value, null, 2)}</li>

                <br />
              </>
            );
          })}
        </ul>
      </>
      <div
        style={{
          border: "1px solid black",
          minHeight: "100px",
          minWidth: "100%",
        }}
      >
        Remote DB Section
        <br />
        <br />
        <br />
        <button onClick={addDB}>Add DB</button>
        <input
          onChange={(e) => setAddRemoteDB(e.target.value)}
          value={addRemoteDB}
        />
      </div>
    </div>
  );
}

export default Main;
