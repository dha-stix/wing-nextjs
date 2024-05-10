// pages/api/xml.ts

import { NextRequest } from "next/server";
export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(req: NextRequest) {
  // Define the XML content
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
 
<channel>
  <title>Winglang Documentation</title>
  <link>https://winglang.io/docs</link>
  <description>A programming language for the Cloud</description>
</channel>


<article>
    <title>What is Winglang?</title>
    <introduction>This article explains the basics of Winglang and why you should use it.</introduction>
    <sections>
        <section>
            <heading>Why Winglang?</heading>
            <paragraph>A programming language for the cloud, Wing combines infrastructure and runtime code in one language, enabling developers to stay in their creative flow, and to deliver better software, faster and more securely.</paragraph>
        </section>
        <section>
            <heading>Infrastructure and code in one language</heading>
            <paragraph>A unified programming model that combines both infrastructure and application code into a single programming language. It compiles to IaC and JavaScript, creates infrastructure resources as first-class citizens, and creates automatic IAM policies and other cloud mechanics.
    </paragraph>
        </section>
        <section>
            <heading>Winglang acts as a Local simulator</heading>
            <paragraph>Stay in your creative flow with minimal context switching and immediate feedback. Run your cloud application in your local environment. Visualize, interact, and debug locally. Write unit tests for complete cloud architectures.</paragraph>
        </section>
        <section>
            <heading>Apply DevOps at the right level with Winglang</heading>
            <paragraph> Use any cloud service and compile to multiple cloud providers and provisioning engines, with full control over how your infrastructure is configured and deployed. Cloud-agnostic SDK for maximum portability. Customizable infrastructure through plugins. Supports any provider in the Terraform ecosystem.</paragraph>
        </section>
    </sections>
    <conclusion>
       Winglang is easy to learn and interoperates with existing stacks and tools. Its syntax is inspired by modern application development languages like TypeScript, JavaScript, Swift, and more. It is a statically-typed and simple language with powerful IDE tooling and interoperates with npm modules, CDK constructs, and Terraform providers.
    </conclusion>
</article>

 
</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}
