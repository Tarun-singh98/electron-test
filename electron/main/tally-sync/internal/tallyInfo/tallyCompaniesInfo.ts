const { parseString } = require("xml2js");
// import {parseString} from "xml2js"

export const fetchCompanyInfo = async (port: any) => {
  try {
    // Construct the XML payload
    const xmlPayload = `<ENVELOPE>
        <HEADER>
            <TALLYREQUEST>Export Data</TALLYREQUEST>
        </HEADER>
        <BODY>
            <EXPORTDATA>
                <REQUESTDESC>
                    <REPORTNAME>ODBC Report</REPORTNAME>
                    <SQLREQUEST TYPE='General' METHOD='SQLExecute'> SELECT $NAME, $StartingFrom,$BASICCOMPANYFORMALNAME,$GUID, $COMPANYNUMBER, $REMOTEFULLLISTNAME , $STATENAME, $PINCODE,$COUNTRYNAME, $PHONENUMBER,$MOBILENO,$EMAIL,$GSTREGISTRATIONNUMBER,$ISGSTON,$ISSECURITYON,$DESTINATION,$UserAccountIds FROM Company order by $Name </SQLREQUEST>
                    <STATICVARIABLES>
                        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                    </STATICVARIABLES>
                </REQUESTDESC>
                <REQUESTDATA></REQUESTDATA>
            </EXPORTDATA>
        </BODY>
    </ENVELOPE>`;
    // Send the request to Tally
    const response = await fetch(`http://localhost:${port}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": xmlPayload.length.toString(),
      },
      body: xmlPayload,
    });

    // Handle the response from Tally
    const data = await response.text();

    const arr: any = [];

    parseString(data, (err: any, result: any) => {
      if (err) {
        console.error("Error parsing response XML:", err);
        return;
      }
      arr.push(result);
    });

    const resultDesc =
      arr[0].ENVELOPE.BODY[0].EXPORTDATARESPONSE[0].RESULTDESC[0].ROWDESC[0]
        .COL;

    const result: any = [];
    const resultData: any =
      arr[0].ENVELOPE.BODY[0].EXPORTDATARESPONSE[0].RESULTDATA[0].ROW;

    for (let i = 0; i < resultData.length; i++) {
      const results = resultData[i].COL;

      result.push(results);
    }

    const transformedData = result.map((dataArray: any) => {
      const obj: any = {};
      resultDesc.forEach((desc: any, index: any) => {
        const key = desc.NAME[0].replace("$", "");
        const value = dataArray[index];
        obj[key] = value;
      });
      return obj;
    });

    return {
      status: true,
      info: transformedData,
    };
  } catch (error: any) {
    console.log("ERROR in fetchCompanyInfo function :", error.message)
    if (error.message === 'fetch failed') {
      return {
        status: false,
        info: [],
        code: 400,
        msg: 'Tally is not running'
      }
    } else {
      return {
        code: 400,
        msg: 'Somthing went wrong, Please restart the application.'
      }
    }
  }
};

export const fetchTallyAppInfo = async (port: any) => {
  // console.log(port, "from fetch tally app info")
  if (!port) {
    return {
      code: 400,
      msg: "port is undefined."
    }
  }
  try {
    // Construct the XML payload
    const xmlPayload = `<ENVELOPE Action="">
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>EXPORT</TALLYREQUEST>
        <TYPE>DATA</TYPE>
        <ID>LicenseInfo</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="LicenseInfo">
                        <FORMS>LicenseInfo</FORMS>
                    </REPORT>
                    <FORM ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="LicenseInfo">
                        <TOPPARTS>LicenseInfo</TOPPARTS>
                        <XMLTAG>LicenseInfo</XMLTAG>
                    </FORM>
                    <PART ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="LicenseInfo">
                        <TOPLINES>LicenseInfo</TOPLINES>
                        <SCROLLED>Vertical</SCROLLED>
                    </PART>
                    <LINE ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="LicenseInfo">
                        <FIELDS>SERIALNUMBER</FIELDS>
                        <FIELDS>REMOTESERIALNUMBER</FIELDS>
                        <FIELDS>ACCOUNTID</FIELDS>
                        <FIELDS>ADMINMAILID</FIELDS>
                        <FIELDS>ISADMIN</FIELDS>
                        <FIELDS>ISEDUCATIONALMODE</FIELDS>
                        <FIELDS>ISSILVER</FIELDS>
                        <FIELDS>ISGOLD</FIELDS>
                        <FIELDS>PLANNAME</FIELDS>
                        <FIELDS>ISINDIAN</FIELDS>
                        <FIELDS>ISREMOTEACCESSMODE</FIELDS>
                        <FIELDS>ISLICCLIENTMODE</FIELDS>
                        <FIELDS>APPLICATIONPATH</FIELDS>
                        <FIELDS>DATAPATH</FIELDS>
                        <FIELDS>USERLEVEL</FIELDS>
                        <FIELDS>USERNAME</FIELDS>
                        <FIELDS>TALLYVERSION</FIELDS>
                    </LINE>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="SERIALNUMBER">
                        <SET>$$LicenseInfo:SerialNumber</SET>
                        <XMLTAG>SERIALNUMBER</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="REMOTESERIALNUMBER">
                        <SET>$$LicenseInfo:RemoteSerialNumber</SET>
                        <XMLTAG>REMOTESERIALNUMBER</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="ACCOUNTID">
                        <SET>$$LicenseInfo:AccountID</SET>
                        <XMLTAG>ACCOUNTID</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="ADMINMAILID">
                        <SET>$$LicenseInfo:AdminEmailID</SET>
                        <XMLTAG>ADMINMAILID</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="ISADMIN">
                        <SET>$$LicenseInfo:IsAdmin</SET>
                        <XMLTAG>ISADMIN</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="ISEDUCATIONALMODE">
                        <SET>$$LicenseInfo:IsEducationalMode</SET>
                        <XMLTAG>ISEDUCATIONALMODE</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="ISSILVER">
                        <SET>$$LicenseInfo:IsAdmin</SET>
                        <XMLTAG>ISSILVER</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="ISGOLD">
                        <SET>$$LicenseInfo:IsAdmin</SET>
                        <XMLTAG>ISGOLD</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="PLANNAME">
                        <SET>If $$LicenseInfo:IsEducationalMode Then "Educational Version" ELSE  If $$LicenseInfo:IsSilver Then "Silver" ELSE  If $$LicenseInfo:IsGold Then "Gold" else ""</SET>
                        <XMLTAG>PLANNAME</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="ISINDIAN">
                        <SET>$$LicenseInfo:IsAdmin</SET>
                        <XMLTAG>ISINDIAN</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="ISREMOTEACCESSMODE">
                        <SET>$$LicenseInfo:IsRemoteAccessMode</SET>
                        <XMLTAG>ISREMOTEACCESSMODE</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="ISLICCLIENTMODE">
                        <SET>$$LicenseInfo:IsLicClientMode</SET>
                        <XMLTAG>ISLICCLIENTMODE</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="APPLICATIONPATH">
                        <SET>$$SysInfo:ApplicationPath</SET>
                        <XMLTAG>APPLICATIONPATH</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="DATAPATH">
                        <SET>##SVCurrentPath</SET>
                        <XMLTAG>DATAPATH</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="USERLEVEL">
                        <SET>$$cmpuserlevel</SET>
                        <XMLTAG>USERLEVEL</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="USERNAME">
                        <SET>$$cmpusername</SET>
                        <XMLTAG>USERNAME</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="TALLYVERSION">
                        <SET>if @@CapProductDetails contains "Tally.ERP 9" then $$SPrintf:@@CapProductDetails:@@VersionGetProductSeries:@@VersionReleaseString:@@VersionBuildString:@@ProductBitnessStr:($$String:@@MajorReleaseeFormula):($$String:@@MinorReleaseFormula):"0":@@CapBuildNumberFormula else $$SPrintf:@@CapProductDetails:@@VersionReleaseString:@@VersionBuildString:@@ProductBitnessStr:($$String:@@MajorReleaseeFormula):($$String:@@MinorReleaseFormula):"0":@@CapBuildNumberFormula</SET>
                        <XMLTAG>TALLYVERSION</XMLTAG>
                    </FIELD>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
    // Send the request to Tally
    const response = await fetch(`http://localhost:${port}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": xmlPayload.length.toString(),
      },
      body: xmlPayload,
    });

    // Handle the response from Tally
    const data = await response.text();

    const arr: any = [];

    parseString(data, (err: any, result: any) => {
      if (err) {
        console.error("Error parsing response XML:", err);
        return;
      }
      arr.push(result);
    });
    if (Object.keys(arr[0].LICENSEINFO).length === 0 || arr[0].LICENSEINFO === undefined) {
      throw new Error('No data found in response XML in fetchTallyAppInfo. Tally is not running.');
    }

    const tallyData: any = {};
    tallyData.licenseNumber = arr[0].LICENSEINFO.SERIALNUMBER[0];
    tallyData.adminMailId = arr[0].LICENSEINFO.ADMINMAILID[0];
    tallyData.isEducationalMode = arr[0].LICENSEINFO.ISEDUCATIONALMODE[0]
    tallyData.planName = arr[0].LICENSEINFO.PLANNAME[0];
    tallyData.applicationPath = arr[0].LICENSEINFO.APPLICATIONPATH[0];
    tallyData.dataPath = arr[0].LICENSEINFO.DATAPATH[0];
    tallyData.userLevel = arr[0].LICENSEINFO.USERLEVEL[0];
    tallyData.tallyversion = arr[0].LICENSEINFO.TALLYVERSION[0];

    return {
      status: true,
      info: tallyData,
    }
  } catch (error: any) {
    console.log("ERROR in fetchTallyAppInfo funtion :", error.message)
    if (error.message === 'fetch failed') {
      return {
        code: 400,
        msg: 'Tally is not running'
      }
    } else {
      return {
        code: 400,
        msg: 'Somthing went wrong, Please restart the application.'
      }
    }
  }
};

module.exports = { fetchCompanyInfo, fetchTallyAppInfo };
