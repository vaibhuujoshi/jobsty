
# Jobsty

**Jobsty** is a job discovery and data extraction tool that searches the web for job opportunities, extracts structured information from job listing pages, and presents the results through a web interface.

It uses Tavily for web search and URL discovery, custom extraction logic for collecting job information, and Gemini AI with Tavily research to generate additional company intelligence and job insights.

> **Extraction Level: Medium**

This README documentation outlines the features, data extraction choices, setup instructions, and design decisions for the implemented data extraction tool.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Data Extraction Approach](#data-extraction-approach)
- [Extraction Level](#extraction-level)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Design Decisions](#design-decisions)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)

---

## Overview

Jobsty automates the process of discovering and collecting job listing information from publicly accessible web pages.

Instead of manually visiting multiple job platforms, users can enter a search query such as:

- React Developer jobs in India
- Backend Developer jobs in Bangalore
- Full Stack Developer internships

The application discovers relevant listing URLs, extracts available job information, and displays the results in a centralized interface.

Users can also save interesting opportunities and enrich individual listings with additional company research and AI-generated job insights.

The application consists of two main parts:

- **Backend:** Handles URL discovery, page fetching, data extraction, normalization, and AI enrichment.
- **Frontend:** Provides the interface for searching, viewing, saving, and enriching job listings.

---

## Features

### 1. Job Discovery

- Search for job opportunities using natural-language queries.
- Uses Tavily Search API to discover potentially relevant job listing URLs.
- Filters and processes discovered URLs before extraction.
- Avoids depending on individual job-board APIs.

### 2. Job Data Extraction

Extracts structured information from supported job listing pages, including:

- Job title
- Company name
- Company website
- Job location
- Employment type
- Job description
- Date posted
- Application URL
- Original listing URL

The extraction process combines structured metadata and site-specific extraction logic.

### 3. Data Normalization

- Converts extracted information into a consistent job data structure.
- Handles missing fields using nullable values.
- Normalizes job information from different listing sources into a common format.
- Supports JSON and CSV output from the extraction pipeline.

### 4. AI-Powered Job Enrichment

Users can enrich individual job listings on demand.

The enrichment pipeline uses:

- Tavily Search API for company research.
- Google Gemini for structured information extraction and analysis.

Enrichment provides:

**Company Intelligence**
- Company overview
- Industry
- Website
- Headquarters
- Public contact information
- Social media profiles

**Job Insights**
- Technology stack
- Required skills
- Experience requirements
- Key responsibilities

**Research Sources**
- Links to sources used during company research.

Enrichment is triggered manually for a selected job rather than automatically for every discovered listing.

### 5. Saved Jobs

- Bookmark interesting job opportunities.
- View saved jobs separately.
- Remove saved jobs.
- Persist saved jobs using browser local storage.

### 6. Job Discovery Interface

- Search and view discovered jobs.
- Browse job listings in a scrollable results panel.
- View selected job details in a separate panel.
- Navigate between discovered and saved jobs.
- View AI-generated company and job insights.

---

## Data Extraction Approach

Jobsty follows a multi-stage extraction pipeline.

### 1. URL Discovery

Tavily Search API is used to discover publicly accessible job listing URLs based on the user's search query.

The application uses Tavily strictly for URL discovery and does not depend on job-board-specific APIs.

### 2. URL Filtering

Discovered URLs are filtered to remove irrelevant or unsupported pages.

The filtering process considers URL patterns and supported job listing sources.

### 3. Page Fetching

The backend fetches the HTML content of discovered pages using HTTP requests.

A request scheduler controls fetching concurrency and per-host request frequency to reduce excessive requests to individual websites.

### 4. Data Extraction

The application uses two primary extraction approaches:

**JSON-LD Extraction**

The extractor looks for structured `JobPosting` data embedded in pages using JSON-LD.

When available, this structured metadata provides information such as job title, hiring organization, location, employment type, description, and posting date.

**Site-Specific Extraction**

For supported websites, custom extraction logic is used to identify job listing pages and extract relevant job information.

This provides an alternative when structured JSON-LD data is unavailable or incomplete.

### 5. Normalization

Extracted data is converted into a common `NormalizedJob` structure.

This ensures that information from different websites follows a consistent format.

### 6. Output

The normalized results can be returned through the API and exported as JSON or CSV through the extraction pipeline.

---

## Extraction Level

**Selected Level: Medium**

The application implements a medium-level extraction approach.

| Level | Description | Implementation |
|---|---|---|
| Basic | Extracts information from a single page or simple HTML structure. | Not the primary approach |
| Medium | Discovers listing URLs, fetches pages, and extracts structured job information using metadata and custom selectors. | Implemented |
| Advanced | Deep crawling, browser automation, JavaScript-rendered content extraction, and complex anti-bot handling. | Not implemented |

### Why Medium-Level Extraction?

The objective is to build a practical job data extraction tool without introducing the complexity of a full-scale web crawler.

The current implementation focuses on:

- Discovering relevant job listing pages.
- Extracting structured information from supported sources.
- Handling multiple pages efficiently.
- Normalizing extracted information.
- Providing useful results through an API and frontend.

The application does not attempt to crawl entire job platforms or bypass authentication and anti-bot protections.

---

## Technology Stack

### Backend

| Technology | Purpose |
|---|---|
| Bun | Runtime and package management |
| TypeScript | Type safety |
| Express.js | REST API |
| Tavily Search API | Job URL discovery and company research |
| Cheerio | HTML parsing |
| JSON-LD | Structured job data extraction |
| P-Queue | Request scheduling and concurrency control |
| Google Gemini | AI-powered job enrichment |

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development and build tooling |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Router | Client-side routing |
| Lucide React | Icons |
| Local Storage | Saved jobs persistence |

---

## Project Structure

The project is organized into separate backend and frontend applications.

```text
Jobsty/
│
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── app.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── discovery/
│   │   │
│   │   ├── fetcher/
│   │   │
│   │   ├── extractors/
│   │   │
│   │   ├── normalizers/
│   │   │
│   │   ├── enrichment/
│   │   │
│   │   ├── pipeline/
│   │   │
│   │   └── writers/
│   │
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## How It Works

### Job Extraction Pipeline

```text
User Search Query
       |
       v
Tavily Search API
       |
       v
Discover Job URLs
       |
       v
Filter Relevant URLs
       |
       v
Fetch Listing Pages
       |
       v
Extract Job Information
       |
       +-------------------+
       |                   |
       v                   v
    JSON-LD          Site-Specific
    Extraction       Extraction
       |                   |
       +---------+---------+
                 |
                 v
          Normalize Data
                 |
                 v
          Return Job Results
                 |
                 v
             Frontend
```

### AI Enrichment Pipeline

```text
User Selects a Job
        |
        v
Clicks Enrich
        |
        v
Express Enrichment API
        |
        v
Tavily Company Research
        |
        v
Combine Job + Research Data
        |
        v
Google Gemini
        |
        v
Structured JSON Response
        |
        v
Display Company Intelligence
and Job Insights
```

---

## API Endpoints

The backend exposes the following REST endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks backend availability |
| POST | `/api/scrape` | Discovers and extracts job listings |
| POST | `/api/enrich` | Generates company intelligence and job insights |

### 1. Health Check

```http
GET /api/health
```

Checks whether the backend server is running.

### 2. Scrape Jobs

```http
POST /api/scrape
Content-Type: application/json
```

Request:

```json
{
  "query": "React Developer jobs in India"
}
```

Returns discovered and extracted job information along with extraction statistics and errors.

### 3. Enrich Job

```http
POST /api/enrich
Content-Type: application/json
```

Request:

```json
{
  "title": "Full Stack Developer",
  "company": "Example Technology",
  "companyWebsite": null,
  "location": "Bengaluru, India",
  "description": "Looking for a developer with React, Node.js and MongoDB experience."
}
```

Returns structured company information, job insights, and research sources.

---

## Setup Instructions

### Prerequisites

Make sure the following are installed:

- [Bun](https://bun.sh/)
- Node.js (if required by your development environment)
- Tavily API key
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/vaibhuujoshi/jobsty.git
cd Jobsty
```

### 2. Setup Backend

```bash
cd backend
bun install
```

Create a `.env` file inside the backend directory:

```env
PORT=3000

TAVILY_API_KEY=your_tavily_api_key

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model
```

Start the backend development server using the development script configured in `backend/package.json`:

```bash
bun run dev
```

The backend should be available at:

```text
http://localhost:3000
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
bun install
```

Start the frontend development server:

```bash
bun run dev
```

The frontend should be available at the URL displayed by Vite, typically:

```text
http://localhost:5173
```

---

## Environment Variables

The backend requires the following environment variables:

| Variable | Description |
|---|---|
| `PORT` | Port on which the Express server runs |
| `TAVILY_API_KEY` | API key for Tavily Search |
| `GEMINI_API_KEY` | API key for Google Gemini |
| `GEMINI_MODEL` | Gemini model identifier used for enrichment |

Never expose API keys in frontend environment variables or commit `.env` files to version control.

---

## Design Decisions

### 1. Tavily for URL Discovery

A general-purpose web search provider was selected to discover job listing URLs instead of integrating directly with individual job-board APIs.

This keeps the discovery layer relatively independent of specific job platforms.

### 2. Medium-Level Extraction

The extraction system combines JSON-LD metadata and site-specific extraction logic.

This provides a balance between implementation complexity and extraction usefulness without requiring a browser automation framework or full-scale crawling infrastructure.

### 3. Request Scheduling

A request scheduler is used to control concurrency and request frequency.

The current configuration limits simultaneous requests and applies per-host scheduling to avoid sending excessive requests to a single domain.

### 4. Separation of Responsibilities

The backend is divided into separate modules for discovery, fetching, extraction, normalization, and enrichment.

This makes individual stages easier to maintain, test, and extend.

### 5. On-Demand AI Enrichment

AI enrichment is triggered only when a user requests it.

This avoids unnecessary AI API calls for every discovered job and gives users control over which opportunities receive additional research.

### 6. Structured AI Output

Gemini uses a structured JSON response schema to keep enrichment output predictable and suitable for frontend rendering.

Missing company information is represented using `null` rather than intentionally inventing unavailable details.

### 7. Separate Frontend and Backend

The frontend communicates with the backend through REST APIs.

This keeps scraping logic and external API credentials on the server while allowing the user interface to evolve independently.

---

## Limitations

The current implementation has the following limitations:

- Extraction quality depends on the structure and accessibility of individual job listing pages.
- Site-specific extraction supports only selected job platforms.
- Pages requiring JavaScript rendering may not expose all relevant information to the current HTML extraction pipeline.
- Some websites may block automated requests or apply rate limits.
- Job information may be incomplete when listing pages do not contain structured metadata.
- AI-generated company information can be inaccurate and should be checked against its research sources.
- The application does not guarantee that discovered jobs are still active or accepting applications.
- The extraction pipeline does not perform deep crawling across entire websites.

---

## Future Improvements

Potential improvements include:

- Expand support for additional job listing websites.
- Improve extraction fallback strategies for incomplete JSON-LD.
- Add stronger URL validation and request security protections.
- Introduce persistent caching for discovered and enriched jobs.
- Improve duplicate job detection.
- Add more detailed extraction quality reporting.
- Add background processing for larger extraction workloads.
- Introduce browser automation for selected JavaScript-rendered pages.
- Add tests for individual extraction strategies.
- Improve source attribution for individual AI-generated company fields.

---

## Disclaimer

Jobsty is an independent data extraction project intended for learning, research, and job discovery.

It collects information from publicly accessible web pages. Users should respect the terms of service, robots policies, copyright requirements, and applicable laws of the websites they access.

The application does not guarantee the accuracy, availability, or completeness of extracted job information.
