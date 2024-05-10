import { main, cloud, inflight, lift } from "@wingcloud/framework";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import React from "@winglibs/react";

main((root, test) => {
	let api = new cloud.Api(root, "api", { cors: true });

	api.post(
		"/api",
		inflight(async (ctx, request) => {
			const data = JSON.parse(request.body!);
			const apiKey = "<YOUR_OPENAI_API_KEY>"

			const chatModel = new ChatOpenAI({ apiKey });

			const prompt = ChatPromptTemplate.fromMessages([
				[
					"system",
					"You are a webscraper that retrieves information about websites. Ask me anything about a website and I will try to answer it.",
				],
				["user", "{input}"],
			]);
			const chain = prompt.pipe(chatModel);

			const response = await chain.invoke({
				input: `${data.question} using this website information: ${data.websiteData}`,
			});

			if (response?.content) {
				return {
					status: 200,
					body: response.content,
				};
			}

			return undefined;
		})
	);

	api.get(
		"/test",
		inflight(async () => {
			return {
				status: 200,
				body: "Hello world",
			};
		})
	);

	const react = new React.App(root, "react", { projectPath: "../frontend" });
	react.addEnvironment("api_url", api.url);
});