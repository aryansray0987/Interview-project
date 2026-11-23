# PrepForge - AI-Powered Interview Preparation Platform

PrepForge is a comprehensive, full-stack web application designed to help job seekers prepare for interviews. By analyzing a candidate's resume, self-description, and target job description, PrepForge uses cutting-edge Generative AI to create highly personalized interview strategies, identify skill gaps, provide tailored questions, and even generate ATS-optimized PDF resumes.

---

## 🛠️ Technology Stack

### Frontend
* **Core:** React.js (via Vite for lightning-fast HMR and building)
* **Routing:** React Router v7
* **Styling:** Vanilla SCSS (Sass) with a robust CSS Custom Properties (Variables) system for dynamic Light/Dark mode theming.
* **HTTP Client:** Axios (configured to send credentials/cookies securely).
* **State Management:** React Context API (`AuthContext`, `ThemeContext`, `InterviewContext`) and custom hooks.

### Backend
* **Core:** Node.js runtime with Express.js framework (using modern ES Modules).
* **Database:** MongoDB (via Mongoose ODM) for robust schema validation and relational modeling.
* **Authentication:** JSON Web Tokens (JWT) for stateless authentication. Handles short-lived Access Tokens and long-lived Refresh Tokens stored in HTTP-only cookies.
* **Password Hashing:** `bcryptjs`.
* **File Uploading:** `multer` (in-memory buffer storage).
* **PDF Parsing:** `pdf-parse` (v2.4.5) for robust, class-based text extraction from PDF buffers.
* **PDF Generation:** `puppeteer` (headless Chrome) for converting AI-generated HTML into beautiful, downloadable A4 PDFs.
* **AI Integration:** `@google/genai` (Google's official Generative AI SDK) and `zod` for enforcing strict JSON schemas.

---

## 🧠 AI Model Architecture

The core intelligence of PrepForge is powered by Google's **Gemini 2.5 Flash** (`gemini-2.5-flash`). This model was chosen for its high speed, massive context window, and exceptional capability at adhering to strict JSON structures.

### Structured Output Enforcement
Instead of relying on fragile prompt engineering to get JSON from the AI, the backend uses **Zod** (`zod-to-json-schema`). We define an exact schema representing the report (Match Score, Technical Questions, Behavioral Questions, Skill Gaps, and a Day-by-Day Preparation Plan). 

This schema is passed directly into the Gemini model configuration via `responseSchema`, guaranteeing the model responds with a 100% predictable, parseable JSON object every single time.

---

## 🌊 Data Flow & Architecture

### 1. Authentication Flow
* **Registration/Login:** The user submits their credentials. `bcryptjs` hashes the password before saving it to MongoDB.
* **Token Generation:** The backend issues an `accessToken` (returned in the JSON payload) and a `refreshToken` (set securely in a cookie).
* **Session Management:** The frontend attaches the access token via Axios interceptors. If a token expires, the backend can refresh it using the cookie. On logout, the token is added to a MongoDB `Blacklist` collection to invalidate it before its natural expiration.

### 2. Strategy Generation Flow (The Core Feature)
* **Input:** The user pastes a Job Description and either types a Self-Description or uploads a PDF Resume.
* **Transmission:** The frontend packages this into a `multipart/form-data` request and posts it to `/api/interview`.
* **Parsing:** 
  * The backend's `multer` middleware intercepts the request and holds the file in a memory buffer.
  * If a resume was uploaded, the buffer is converted to a `Uint8Array`.
  * The modern `PDFParse` class is instantiated, the array is loaded asynchronously, and `.getText()` is called to extract the raw string from the document.
* **AI Processing:** The extracted resume text, job description, and self-description are injected into a prompt. Gemini 2.5 Flash processes the context and returns the strictly-typed JSON interview strategy.
* **Database Storage:** The backend saves the AI's JSON output alongside the user's original inputs into the `InterviewReport` MongoDB collection.
* **Rendering:** The frontend receives the JSON and dynamically renders the strategy dashboard, highlighting skill gaps and mapping out the preparation timeline.

### 3. Dynamic ATS-Resume Generation Flow
* **Request:** The user clicks the "Download ATS Resume" button on their interview strategy page.
* **AI Processing (HTML):** The backend takes the saved context (Resume + Job Description) and prompts Gemini 2.5 Flash to generate a brand new, highly-tailored, ATS-friendly resume. The model is specifically instructed to output the result as a raw HTML string containing inline CSS for professional styling.
* **PDF Conversion:** The backend spins up a headless Chromium instance using `Puppeteer`. It injects the AI-generated HTML into a blank page, waits for the network to idle, and then prints the page to an A4-sized PDF buffer.
* **Delivery:** The backend sends the raw binary buffer back to the frontend with a `Content-Disposition: attachment` header. The frontend creates a local `Blob` URL and automatically triggers a file download for the user.

---

## 🗄️ Database Schemas

PrepForge uses three primary MongoDB collections:

1. **User Collection:**
   * Stores `username`, `email`, and the hashed `password`.
   * Also stores the user's active `refreshToken`.

2. **InterviewReport Collection:**
   * A massive document that acts as the source of truth for a generated strategy.
   * **Inputs:** Stores the `user` (ObjectId reference), raw `resume` text, `selfDescription`, and `jobDescription`.
   * **AI Outputs:** Stores the `matchScore` (Number), `title` (String), `technicalQuestions` (Array of Question/Intention/Answer objects), `behavioralQuestions` (Array), `skillGaps` (Array of Skill/Severity objects), and `preparationPlan` (Array of Day/Focus/Tasks objects).

3. **BlacklistedToken Collection:**
   * Stores expired or logged-out JWT tokens to prevent replay attacks or unauthorized access after a user has explicitly signed out.
