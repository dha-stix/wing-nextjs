## Getting Started

- Clone the repository

- Ensure you have the latest version of Wing installed on your computer.
  ```bash
  npm install -g winglang@latest
  ```
  
- Run `npm install` within the `frontend` and `backend` folders to install the project dependencies
  ```bash
  npm install
  ```
  
- Run `wing secrets` in your backend terminal and paste your OpenAI API Key into the field.
  
- Build the `Next.js` app by running `npm run build`.
  ```bash
  cd frontend
  npm run build
  ```
- Finally, start the Wing server. It automatically starts the Next.js server.
    ```bash
    cd backend
    wing it
    ```

  You can access the Next.js app by visiting `http://localhost:3001` within your browser.
