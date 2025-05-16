// src/pages/Gestora/Dashboard.js
import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './Dashboard.css';
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";


function Dashboard() {
  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
            <h1>Dashboard Power BI</h1>
        </div>

        <div className="powerbi-container">
          <PowerBIEmbed
        embedConfig={{
          type: "report",
          id: "c9050244-8b45-4745-adf7-8e9440bb0c14",
          embedUrl: "https://app.powerbi.com/reportEmbed?reportId=02fbddf6-8b58-40ee-917d-de82bedc742a&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d", // tu embedUrl real
          accessToken: "H4sIAAAAAAAEACWURw6sCAJD7_K3jESmYKRekHMoMuzIOWdac_epVu8tS36y_fcfK3n6Kcn__PfPNXB-pGrX29CwCsQjOU2NET2aaK5wEM_Wvdw7XAQEUHvcOrx3fu4LGEbe2VIsfMjRtocvIvlZiBHz7DR4puoVF8Eklo9n1x_Y7TN4XIeJJC416Zvb7pkG4pC0WiVhRwCzSnfG9P04G7d7mX8hhVl2_NiVK-qFuSAJoZHQMqVGn9SGTEaqrQG_4eBWyYLIUrs1UjC_ZHKB4oxveS1wD8UEa8dtWGVGyG5uPAKwzFBkXTxz0k37oDDAI7XCpLgWM5kEkU8sFnBrC_beWtqRz604UJkxyInOVh1-0lBMHARIF2pPeXkuZjbvzd03atKUcnEqB_agybvjdTYFVfJ-Uyq4UZ9fnDL8-TqNqsioLiWeY-zlqZw1MoOZoVfxdmja5UyrYx87RsRv4OBsAfuKQZHQcAjwTlRDNt48zkwCkwmOvaEJJzhRM3Odjfp9VwxPtrFccTfnvWOvva25kOMG8yhuOb7fo4x9Y-KOru3FEdeXgExv32jSG0cBRxTvKP8RHWQk1RbRB778s8bwBzBFbKkJdSABrak4CmwG9QHOSMZqYcqmoNblARDswQyYkg7fRct7VwzjBLC-m-ewVtagAyR2EeR3q_o21OWXOQ85YyWYHDVdB9lGI_9aMB65dqVK3tFuEi33t--SbKxE5dcV3RQxlMMWgS1H5k1p-MjngnyfLRuysunhwkQQIzAa7Vng4HTCPnJzF21966AdOzqOtMBw1zuFE_YDLhsiFUn06lRmhbsjyxCRU2bmfeToToq2ExRnuDBxYzHcxgLyQSnvfHH9WoAkooT2pYjy2mtPJM_ohpBMKMHldhydN-Sg7Uk4dXhJ_POfP-z6zPukFs9vTl_-7UMaI5d6A30ylsR8xUOJVydW6ON0BGzCYtDoZUGpZBJKqE4lQf1vWfGOv-IAeMLdh36qhcx6_IP25sTE1rzIwOSEZcbMHs2kj-QPjygwHg0OV0Y7HVuwJzOqHtgDa8BtDtO5b-1F7_jVZy-HR1HRmhv7lYFReLAldHFl32J28BNCbfzuzahmFrEmtYEFad4JigXBl_QupgFO3XbUZjEPeru4Sp2hsBqGypvJ7-IBMn9pUfPFhWU3Lm3Znns9y-H09kKZVGkyBvOCkWX6HQJFWcI4f2QU3UM0kaD5hKxJzWd9ohTaFXdghokmo2WD9IEeS-OXch8AJX2BqqaH7x_2-uuvfzA_c12ssv-jbIqBgZeoko0WCDMswE9LRPyrcppqTPZjLX4yFaVpHjuc80XdgMFLiRfLdK5WJpQEY2_E4TR9AO-sp5kBHqA0JSOTWD_M7SjhlP3SlitRqbud-Rayxmf6iGndIkC5GK9v3LaZDyKzVlCcE_zO5ZuRtbrMjfSvVDHeiJTuD9cHePjY2yn-4qDo8-HaDo0oM0jTPdWijWUnFZD54riMcVBZp6gIqcqJl7b6OQeMIxObRDtODjAB9lL8UeVQSM4d9buhCL2hJ9Kj8ALkmyRzcBeK15dDsdga1NlaUDNgDzFyV2wgy_KL7U5JLeEk2aOV1NjxmVZa2QXSd5ptkqyqGOUlQrzoUwhSGcLSjYgSzlaHTXG5p92wragHOStDLFvVD_P__g822rRLQgYAAA==.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJleHAiOjE3NDczMjQ1NDUsImFsbG93QWNjZXNzT3ZlclB1YmxpY0ludGVybmV0Ijp0cnVlfQ==",
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: true,
                visible: true,
              },
            },
            background: models.BackgroundType.Transparent,
          },
        }}
        eventHandlers={new Map([
          ["loaded", () => console.log("Report loaded")],
          ["rendered", () => console.log("Report rendered")],
          ["error", (event) => console.error(event.detail)],
        ])}
        cssClassName={"reportClass"}
        getEmbeddedComponent={(embeddedReport) => {
          window.report = embeddedReport;
        }}
      />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
