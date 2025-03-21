import DataTable from "react-data-table-component";
import React, { useEffect, useRef, useState } from "react";
import { getInternationalWinners, getInternationalSendReward } from "../api/adminControl";
import { encryptData, decryptData } from "./utils/securedata";
import { ToastContainer, toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function International() {

  const [userData, setUserData] = useState([]);
  const [, setGetDocumentdata] = useState([]);

  const getUsers = async () => {
    try {
      const res = await getInternationalWinners();
      if (res.status == true) {
        const de = decryptData(res.data);
        setUserData(de);
      } else {
        setUserData([]);
      }
    } catch (error) {
      setUserData([]);
      console.log(error)
    }
  }

  useEffect(() => {
    getUsers()
  }, []);

  useEffect(() => {
    if (userData.length > 0) {
      setGetDocumentdata(userData);
    } else {
      setGetDocumentdata([]);
    }
  }, [userData])

  const handleSubmit = async (data) => {
    try {
      if (data) {
        const obj = {
          type: data.type,
          clientId: data.clientId,
          amount: data.amount
        }
        const en = encryptData(obj);
        const res = await getInternationalSendReward(en);
        if (res.status == true) {
          toast.success("Success.");
          await getUsers();
        } else {
          toast.error("Failed.");
        }
      } else {
        toast.error("Failed.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed.");
    }
  }


  const columns = [
    {
      name: "userId",
      selector: (row) => row.userId,
      sortable: true,
    },
    {
      name: "email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.Amount,
      sortable: true,
    },
    {
      name: "paypalId",
      selector: (row) => row.paypalId,
      sortable: true,
    },
    {
      // name: ,
      selector: (row) => row.Submit,
      sortable: true,
      width: "150px",
    },
  ];

  const data = userData.length > 0
    ? userData.map((data, index) => ({
      id: index + 1,
      userId: <div>{data.clientId}</div>,
      name: <div>{data.name}</div>,
      email: <div>{data.email}</div>,
      Amount: <div>{data.amount}Doller</div>,
      paypalId: <div>12345</div>,
      Submit: (
        <div>
          <button className="dashboard-btn-1" onClick={() => {
            handleSubmit(data)
          }}>Submit</button>
        </div>
      ),
    }))
    : [];

  const downloadPDF = () => {
    try {

      if (userData.length > 0) {
        const doc = new jsPDF();
        const headers = [["ID", "Name", "Email", "Amount (Doller)"]];

        const rows = userData.map(item => [item.clientId, item.name, item.email, `${item.amount} Doller`]);
        autoTable(doc, {
          startY: 25, 
          head: headers,
          body: rows,
          styles: { fontSize: 12, halign: "center" },
          headStyles: { fillColor: [22, 160, 133] },
          alternateRowStyles: { fillColor: [240, 240, 240] } 
      });

        doc.save("International_user_data.pdf");
      } else {
        toast.warn("users not found.");
      }
    } catch (error) {
      console.log(error);
      toast.error("PDF convert failed.");
    }
  };

  return (
    <div className="App">
      {/* <Navbar /> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-10">
            <div className="Route3-active-class">
              <div className="variable-domestic-dashboard">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h2>International</h2>
                      </div>
                      <div>
                        <button className="dashboard-btn-2" onClick={() => {
                          downloadPDF()
                        }}>
                          Download PDF
                        </button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="dashboard-table text-dark">
                          <DataTable
                            columns={columns}
                            data={data}
                            theme="solarized"
                            defaultSortAsc={true}
                            // pagination
                            highlightOnHover
                            dense
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default International;
