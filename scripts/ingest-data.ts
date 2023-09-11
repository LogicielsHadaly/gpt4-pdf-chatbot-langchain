// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { PineconeStore } from 'langchain/vectorstores/pinecone';
// import { pinecone } from '@/utils/pinecone-client';
// import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
// import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
// import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

/* Name of directory to retrieve your files from 
   Make sure to add your PDF files inside the 'docs' folder
*/
const filePath = 'docs';

// export const run = async () => {
//   try {
//     /*load raw docs from the all files in the directory */
//     const directoryLoader = new DirectoryLoader(filePath, {
//       '.pdf': (path) => new PDFLoader(path),
//     });

//     // const loader = new PDFLoader(filePath);
//     const rawDocs = await directoryLoader.load();

//     /* Split text into chunks */
//     const textSplitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//       chunkOverlap: 200,
//     });

//     const docs = await textSplitter.splitDocuments(rawDocs);
//     console.log('split docs', docs);

//     console.log('creating vector store...');
//     /*create and store the embeddings in the vectorStore*/
//     const embeddings = new OpenAIEmbeddings();
//     const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

//     //embed the PDF documents
//     await PineconeStore.fromDocuments(docs, embeddings, {
//       pineconeIndex: index,
//       // namespace: PINECONE_NAME_SPACE,
//       textKey: 'text',
//     });
//   } catch (error) {
//     console.log('error', error);
//     throw new Error('Failed to ingest your data');
//   }
// };

// (async () => {
//   await run();
//   console.log('ingestion complete');
// })();


import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME } from '@/config/pinecone';

export const runWithStringInput = async (inputString) => {
  try {
    // Assume the string input is our "raw document"
    const rawDocs = [{ text: inputString, id: 'stringInput' }];  // Assuming the structure is { text, id }

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); 

    //embed the string data
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

// Example usage
(async () => {
    const inputText =  `
    From its creation at the end of 2008, the immediate and ongoing areas of focus for the Bank have been the 
    restructuring of its loan portfolio, expansion of its sources of funding and the need to rebuild trust with its
    customers, Icelandic society as a whole and international financial institutions and investors. In addition, the
    Bank inherited certain significant risks in terms of loan and funding concentrations and currency mismatches
    which it has sought to reduce whilst focusing on maintaining high levels of liquidity and capital.
    3.8 Market position and competition
    The Bank currently faces competition from the two other large commercial banks in Iceland as well as a few 
    smaller financial institutions. In recent years the banks have been focusing on restructuring their loan portfolios 
    and improving their asset and liability matching, which entails that competition in the market has been 
    somewhat limited. As Iceland's economy recovers and demands for new lending and other banking products 
    increases, the Bank expects to face increased competition from both the other large Icelandic banks and smaller 
    specialised institutions. 
    The Bank expects to compete on the basis of a number of factors, including transaction execution, its products 
    and services, its ability to innovate, reputation and price.
    `;

    await runWithStringInput(inputText);
    console.log('ingestion complete');
})();
