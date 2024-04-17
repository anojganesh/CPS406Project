import "./styles/member.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Member = (props) => {
  const [latefee, setLatefee] = useState(0);
  const [tableStr, setTableStr] = useState("");
  const [tableStr2, setTableStr2] = useState("");
  const location = useLocation();
  const { username, fullname } = location.state || {};
  const { _username, _fullname } = props;

  useEffect(() => {
    const fetchDataAndBuildTable = async () => {
      try {
        console.log("called 1 time");
        const response = await fetch("/getpayments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullname: fullname }),
        });
        const data = await response.json();
        console.log("response received");

        if (data.payments && data.payments.length > 0) {
          let latefee = data.payments[0].latefee;
          setLatefee(latefee);

          let tempTableStr = "";

          data.payments.forEach((payment) => {
            let name = payment.fullname;
            let amount = payment.amount;
            let date = payment.date;
            let title = "";
            if (amount != 0) {
              if (amount != 0) {
                if (amount == 10) {
                  title = " - Session Payment";
                } else if (amount == 40) {
                  title = " - Monthly payment";
                }
                tempTableStr += `
                  <tr>
                    <td>${name}${title}</td>
                    <td>${date}</td>
                    <td>$${amount}</td>
                  </tr>
                `;
              }
            }
          });

          setTableStr(tempTableStr);
        } else {
          console.log("No payments data received");
        }
        const response2 = await fetch("/getattendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullname: fullname }),
        });
        const data2 = await response2.json();
        console.log("attendance response received");
        console.log(data2);
        if (data2 && data2.payments && data2.payments.length > 0) {
          let name2 = data2.payments[0].fullname;
          let tempTableStr2 = "";

          data2.payments.forEach((payment) => {
            tempTableStr2 += `
              <tr>
                <td>${name2}</td>
                <td>${payment.date}</td>
              </tr>
            `;
          });

          setTableStr2(tempTableStr2);
        } else {
          console.log("No attendance data received");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDataAndBuildTable();
  }, [fullname]);

  return (
    <div className="mainContainer">
      <div>
        <div className="dashboard">
          <div className="left-side">
            <div className="left-item" id="leftItem1">
              <h1>Welcome, {fullname}</h1>
              <h2>Club Member</h2>
              <h3>User ID: {username}</h3>
              <h3>Your Bill: $10/Session</h3>
              <h3>
                Late Fees ($20 per unpaid bill):{" "}
                <span style={{ color: latefee > 0 ? "red" : "black" }}>
                  ${latefee}
                </span>
              </h3>
              <span className="warning">
                *Failure to pay late fees will result in an indefinite
                suspension from all club activities.
              </span>
            </div>
            <div className="left-item2" id="leftItem2">
              <h2>Payment History</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                {tableStr && (
                  <tbody dangerouslySetInnerHTML={{ __html: tableStr }}></tbody>
                )}
              </table>
            </div>
          </div>
          <div className="right-side">
            <div className="right-item" id="rightItem">
              <h2>Attendance History</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody dangerouslySetInnerHTML={{ __html: tableStr2 }}></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Member;
