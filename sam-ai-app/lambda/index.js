const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");
const client = new BedrockRuntimeClient({ region: "us-east-1" }); // Change to your region if different

exports.handler = async (event) => {
    const jobDescription = event.queryStringParameters?.jd || "Software Engineer";

    const messages = [{
        role: "user",
        content: [{ text: `Generate 5 professional interview questions for: ${jobDescription}` }]
    }];

    const command = new ConverseCommand({
        modelId: "amazon.nova-lite-v1:0", 
        messages: messages,
        inferenceConfig: { maxTokens: 500, temperature: 0.7 }
    });

    try {
        const response = await client.send(command);
        const aiMessage = response.output.message.content[0].text;

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify({ ai_response: aiMessage }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
