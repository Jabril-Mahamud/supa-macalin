// app/api/history/route.ts
import { NextResponse } from 'next/server';
import sql from 'mssql';
import { BlobServiceClient } from '@azure/storage-blob';

const sqlConfig = {
  user: process.env.AZURE_SQL_USER!,
  password: process.env.AZURE_SQL_PASSWORD!,
  database: process.env.AZURE_SQL_DATABASE!,
  server: process.env.AZURE_SQL_SERVER!,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

const BLOB_STORAGE_CONNECTION_STRING = process.env.BLOB_STORAGE_CONNECTION_STRING!;
const BLOB_CONTAINER_NAME = process.env.BLOB_CONTAINER_NAME!;

export const runtime = 'edge';

const blobServiceClient = BlobServiceClient.fromConnectionString(BLOB_STORAGE_CONNECTION_STRING);

export async function GET() {
  try {
    // Connect to Azure SQL
    const pool = await sql.connect(sqlConfig);

    // Query the history table
    const result = await pool.request().query('SELECT * FROM History');

    // Ensure we close the SQL connection after querying
    pool.close();

    // Access Blob Storage container for audio files
    const blobContainerClient = blobServiceClient.getContainerClient(BLOB_CONTAINER_NAME);

    // Process and retrieve SAS URLs for each audio file
    const historyEntries = await Promise.all(
      result.recordset.map(async (message: any) => {
        const blobClient = blobContainerClient.getBlobClient(message.audioFileName);
        const sasUrl = await generateSasUrl(blobClient);

        return {
          id: message.id,
          text: message.text,
          date: message.date,
          audioUrl: sasUrl,
        };
      })
    );

    return NextResponse.json(historyEntries);
  } catch (error) {
    console.error('Error retrieving history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate a SAS URL for blob access
async function generateSasUrl(blobClient: any) {
  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + 30); // SAS expires in 30 minutes

  const sasUrl = await blobClient.generateSasUrl({
    permissions: 'r', // read-only permissions
    expiresOn,
  });

  return sasUrl;
}
