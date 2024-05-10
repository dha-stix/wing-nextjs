"use client"
import { useState } from "react";
interface WingEnv {
  api_url: string;
  // Add other properties if needed
}
  declare global {
    interface Window {
      wingEnv: WingEnv;
    }
  }

export default function Home() {
  const [sitemapURL, setSitemapURL] = useState<string>("")
  const [question, setQuestion] = useState<string>("")
  const [websiteData, setWebsiteData] = useState<string | null>(null)
  const [disable, setDisable] = useState<boolean>(false)
  const [response, setResponse] = useState<string | null>(null)

    // Helper function to extract text nodes from an XML document
  function extractTextContents(xmlDoc: Document): string[] {
    let texts: string[] = [];
    const walker = document.createTreeWalker(xmlDoc, NodeFilter.SHOW_TEXT, null);
    
    let node: Node | null;
    while (node = walker.nextNode()) {
        const text = node.nodeValue?.trim();
        if (text) {
            texts.push(text);
        }
    }
    return texts;
  }
  
  const handleFetchSitemap =  async (e: React.FormEvent) => {
    e.preventDefault()
    try { 
      const response = await fetch(sitemapURL);
      if (!response.ok) {
        throw new Error(`Sitemap not found Status: ${response.status}`);
      }
      const text = await response.text();
      const xmlDoc = new DOMParser().parseFromString(text, "text/xml");
      const data = extractTextContents(xmlDoc);
      const stringData = data.join(" ");
      setWebsiteData(stringData)
      setSitemapURL("")
    } catch (err) {
      console.error(err);
    }
    
  }


  const handleUserQuery = async (e: React.FormEvent) => { 
    e.preventDefault()
    setDisable(true)
    try {
      const request = await fetch(`${window.wingEnv.api_url}/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, websiteData }),
    });
      const response = await request.text();
      console.log({ response })
      setResponse(response)
      setDisable(false)
    }catch (err) {
      console.error(err);
      setDisable(false)
    }
    
  }

  return (
    <main className="w-full px-8 py-8">
      <h2 className="font-bold text-2xl mb-8">Q&A Web Bot</h2>
      {!websiteData && (
         <form onSubmit={handleFetchSitemap} className="mb-8">
        <label className="block mb-2">Sitemap URL</label>
        <input
          type="url"
          className="w-full mb-4 p-4 rounded-md border border-gray-300"
          placeholder="http://localhost:3001/api"
          required
            value={sitemapURL}

          onChange={e => setSitemapURL(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-8 text-lg py-3 rounded"
        >
          Submit
        </button>
      </form>

      )}
     
      {websiteData && (
        <form onSubmit={handleUserQuery} className="mb-8">
        <label className="block mb-2">Ask any question based on the website sitemap</label>
        <input
          type="text"
          className="w-full mb-4 p-4 rounded-md border border-gray-300"
          placeholder="What is Winglang? OR Why should I use Winglang? OR How does Winglang work?"
          required
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <button
            type="submit"
            disabled={disable}
          className="bg-blue-500 text-white px-8 text-lg py-3 rounded"
        >
          {disable ? "Loading..." : "Ask Question"}
        </button>
      </form>
      )}
      <div className="bg-gray-100 w-full p-8 rounded-sm shadow-md">
        <p className="text-gray-600">{response}</p>
      </div>
        

    </main>
  );
}
