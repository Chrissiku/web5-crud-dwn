// Intro https://dev.to/chrissiku/a-practical-guide-to-crud-operations-on-decentralized-web-nodes-aka-dwns-5ca1
// Configuring the Workspace https://dev.to/chrissiku/setting-up-the-workspace-for-decentralized-web-nodes-in-javascript-4j84
// Connect to Web5 and on a DWN https://dev.to/chrissiku/connect-to-web5-and-on-a-dwn-in-web5-36mp
// Create records on a DWN https://dev.to/chrissiku/create-records-on-a-dwn-44il
// Query and Read records on a DWN https://dev.to/chrissiku/query-and-read-records-on-a-dwn-1pma
// Update, and delete records on a DWN https://dev.to/chrissiku/update-and-delete-records-on-a-dwn-24n7

import { Web5 } from "@web5/api";

const { web5, did } = await Web5.connect({
  didCreateOptions: {
    dwnEndpoints: ["https://dwn.gcda.xyz"], // Community DWN instance on Google Cloud
  },
  registration: {
    onSuccess: () => {
      console.log("\n\nConnected successfully");
    },
    onFailure: (error) => {
      console.error("Connection failed:", error);
    },
  },
});

console.log("\nConnected did:", did);

// Image file
const imageFile = new File(["test image content"], "web5.png", {
  type: "image/png",
});
const mockImage = {
  currentTarget: {
    files: [imageFile], // Simulate a file input
  },
};

// txt file
const txtFile = new File(["dummy content"], "web5.txt", {
  type: "text/plain",
});

const mockTxt = {
  currentTarget: {
    files: [txtFile], // Mimic the file input's files array
  },
};

// Create Mixed record

const createMixedRecord = async (file, image, text) => {
  const { status, record } = await web5.dwn.records.create({
    data: {
      image,
      file,
      text,
    },
    message: {
      schema: "https://test.org/schema/mixed-data",
      dataFormat: "application/json",
    },
  });

  return record;
};

createMixedRecord(mockImage, mockTxt, "Mixed data");

// Query records
const response = await web5.dwn.records.query({
  form: did,
  message: {
    filter: {
      schema: "https://test.org/schema/mixed-data",
      dataFormat: "application/json",
    },
  },
});

response.records.forEach(async (record) => {
  const result = await record.data.json();
  const allRecords = { recordId: record.id, data: result };
  console.log(allRecords);
});

// read record
const { record: singleRecord } = await web5.dwn.records.read({
  message: {
    filter: {
      recordId: "bafyreig4vibz5lg4otmftd56qzqisgga7cqw5yeob336z7nn2x3hyv55ha",
    },
  },
});

console.log(await singleRecord.data.json());

// update a record

const { status } = await singleRecord.update({
  data: {
    file: mockTxt,
    image: mockImage,
    text: "Updated mixed data",
  },
});

console.log(await singleRecord.data.json());

// delete Record
const { status: deleteStatus } = await singleRecord.delete();
