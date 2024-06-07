import { main, cloud, inflight, lift } from "@wingcloud/framework";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import React from "@winglibs/react";

main((root, test) => {
	const api = new cloud.Api(root, "api", { cors: true });
	const secret = new cloud.Secret(root, "OpenAPISecret", {
		name: "open-ai-key",
	});

	api.post(
		"/api",
		lift({ secret })
			.grant({ secret: ["value"] })
			.inflight(async (ctx, request) => {
				const apiKey = await ctx.secret.value();

				const {question, pageURL} = JSON.parse(request.body!);

				const chatModel = new ChatOpenAI({
					apiKey,
					model: "gpt-3.5-turbo-1106",
				});

				const splitter = new RecursiveCharacterTextSplitter({
					chunkSize: 200,
					chunkOverlap: 20,
				});

				const loader = new CheerioWebBaseLoader(pageURL);
				const docs = await loader.load();

				const splitDocs = await splitter.splitDocuments(docs);

				const embeddings = new OpenAIEmbeddings({
					apiKey,
				});
				const vectorStore = await MemoryVectorStore.fromDocuments(
					splitDocs,
					embeddings
				);

				const retriever = vectorStore.asRetriever({
					k: 1,
				});

				const prompt = ChatPromptTemplate.fromTemplate(`
				Answer this question.
				Context: {context}
				Question: {input}	
				`);

				const chain = await createStuffDocumentsChain({
					//@ts-ignore
					llm: chatModel,
					//@ts-ignore
					prompt: prompt,
				});

				const retrievalChain = await createRetrievalChain({
					combineDocsChain: chain,
					retriever,
				});

				const response = await retrievalChain.invoke({
					input: `${question}`,
				});

				if (response) {
					return {
						status: 200,
						body: response.answer,
					};
				}

				return undefined;
			})
	);

	const react = new React.App(root, "react", { projectPath: "../frontend" });
	react.addEnvironment("api_url", api.url);
});