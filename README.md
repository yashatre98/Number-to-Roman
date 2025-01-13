# Express Roman Numeral Conversion API

---



## Table of Contents

1. [Project Overview](#project-overview)  
2. [API Endpoints](#api-endpoints)  
   - [Roman Numeral Conversion Endpoint](#roman-numeral-conversion-endpoint)  
   - [Metrics Logging Endpoint](#metrics-logging-endpoint)  
3. [Roman Numerals Specification Used in This Project](#roman-numerals-specification-used-in-this-project)  
   - [Symbols and Values](#symbols-and-values)  
   - [Rules Implemented](#rules-implemented)  
   - [Algorithm Implementation](#algorithm-implementation)  
   - [Example Conversion](#example-conversion)  
   - [Complexity Analysis](#complexity-analysis)  
4. [Build and Run Instructions](#build-and-run-instructions)  
   - [Prerequisites](#prerequisites)  
   - [Steps](#steps)  
5. [Engineering and Testing Methodology](#engineering-and-testing-methodology)  
   - [Engineering Approach](#engineering-approach)  
   - [Testing Approach](#testing-approach)  
6. [Packaging Layout](#packaging-layout)  
7. [Dependency Attribution](#dependency-attribution)  
   - [Dependencies](#dependencies)  
   - [DevDependencies](#devdependencies)  

---

## Project Overview

This project is a **RESTful Express API** for **Roman numeral conversion**.  
- It provides a **GET endpoint** to convert **numeric inputs (1–3999)** to **Roman numerals**.  
- It integrates **logging** using **Winston** and collects **performance metrics** using **Prometheus-compatible middleware**.  
- The API supports **CORS** for cross-origin requests and processes both **JSON** and **URL-encoded payloads**.

---

## API Endpoints

### Roman Numeral Conversion Endpoint

**URL**:  
```
GET /romannumeral?query={integer}
```
**Description**:  
Converts a given **integer (1–3999)** into its **Roman numeral representation**.

**Examples**:  
- **Valid Request**:  
    ```
    GET /romannumeral?query=123
    Response: { "input": "123", "output": "CXXIII" }
    ```
- **Invalid Input (Non-Numeric)**:
    ```
    GET /romannumeral?query=abc
    Response: 400 Bad Request - "Invalid input. Please provide a valid number."
    ```
- **Input Out of Range**:
    ```
    GET /romannumeral?query=4000
    Response: 400 Bad Request - "Number out of range. Enter a number between 1 and 3999."
    ```
### **Metrics Logging Endpoint**

**URL**:  
```
POST /react-metrics
```
**Description**:  
Logs **performance metrics** sent by the React frontend to the server logs.

**Example Payload**:
```json
{
  "name": "CLS",
  "value": 0.05,
  "id": "vital-1"
}
Response: 200 OK - "Metrics received"
```
---
## Roman Numerals Specification Used in This Project

### Symbols and Values  
The algorithm uses **seven Roman numeral symbols**:  
[**Roman Numerals - Wikipedia**](https://en.wikipedia.org/wiki/Roman_numerals)
| Symbol | Value  |
|--------|--------|
| **I**  | 1      |
| **V**  | 5      |
| **X**  | 10     |
| **L**  | 50     |
| **C**  | 100    |
| **D**  | 500    |
| **M**  | 1000   |

---

### Rules Implemented

1. **Addition Rule**:  
   - Symbols are **added** when placed in **descending order**.  
   - Example: **VI = 5 + 1 = 6**.  

2. **Subtraction Rule**:  
   - Subtractive notation is handled using **specific pairs** (e.g., **IV = 4**, **IX = 9**).  
   - The function predefines these cases in the **lookup table**:  
     - **IV (4)**, **IX (9)**, **XL (40)**, **XC (90)**, **CD (400)**, **CM (900)**.  
   - These pairs are prioritized before larger values to handle **subtraction first**.  

3. **Descending Order Processing**:  
   - The lookup table is **sorted in descending order** by value.  
   - The function iterates through the table, **subtracting values** and **appending numerals** until the input is reduced to zero.  

4. **Repetition Limit**:  
   - Symbols **I, X, C, and M** can be repeated **up to 3 times**.  
   - Symbols **V, L, and D** **cannot be repeated**.  
   - This rule is inherently enforced by the **lookup table**, as it avoids direct repetitions by including combined pairs (e.g., **IV** instead of **IIII**).  

5. **Input Validation**:  
   - The API accepts only **positive integers**.  
   - Inputs like **zero**, **negative numbers**, and **non-numeric values** are **handled at the frontend** to prevent invalid API calls.  

---

### Algorithm Implementation
- **Mapping Table**:  
  - Predefined lookup table stores values and corresponding numerals, including **subtractive pairs** like **IV** and **IX**.  

- **Iteration Logic**:  
  - Starts with the **largest value** and checks if it fits into the input number.  
  - Repeatedly **subtracts the value** and **appends the numeral** until the number is fully converted.  

- **Output**:  
  - Returns the **Roman numeral string** (e.g., **10 → X**).  
  - Displays **error messages** for invalid inputs at the frontend level.  

---

### Example Conversion:

| Input | Process                               | Output   |
|-------|---------------------------------------|----------|
| **58**  | 50 → L, 5 → V, 3 → III                | **LVIII** |
| **1994**| 1000 → M, 900 → CM, 90 → XC, 4 → IV   | **MCMXCIV** |
| **9**   | 9 → IX                                | **IX**    |
| **4**   | 4 → IV                                | **IV**    |

---

### Complexity Analysis:

- **Time Complexity**:  
  **O(n)** - The algorithm iterates based on the value of the input, reducing it step-by-step, which makes it proportional to the input size.  

- **Space Complexity**:  
  **O(1)** - The mapping table is **fixed-size**, and only a **result string** is dynamically updated.  

---
## **Build and Run Instructions**

### **Prerequisites**
- **Node.js** (version 18 or later)  
- **npm** (bundled with Node.js)  

### **Steps**
1. **Clone the Repository**:  
   ```bash
   git clone https://github.com/yashatre98/Number-to-Roman.git
   cd Number-to-Roman
2. **Install Dependencies**  
   ```bash
   npm install
3. **Run the local server**  
   ```bash
   npm start
4. **Access the API**:
    ```
    GET http://localhost:3000/romannumeral?query=123
    Postman or curl preferred to test.
5. **Testing Instructions**
    ```bash
    npm test 
    this should show the coverage too
---
## Engineering and Testing Methodology

### **Engineering Approach**

- **Modular Routes**:  
  - Separate routes for **conversion** and **metrics logging** to ensure modularity and maintainability.

- **Logging**:  
  - Uses **Winston** for structured logging of **errors** and **requests** to track server activity and debug issues effectively.

- **Metrics Collection**:  
  - Integrates **Prometheus-compatible middleware** to monitor and log **performance metrics** such as **CLS**, **LCP**, **FCP**, and **TTFB** sent from the React frontend.

- **Input Validation**:  
  - Validates all inputs to ensure only **positive integers (1–3999)** are processed, rejecting invalid, negative, or out-of-range values.

### **Testing Approach**

The application is thoroughly tested using unit and integration tests to ensure correctness, robustness, and maintainability. The following test files cover all critical functionalities:

---

#### **Test Files and Purpose**

1. **`app.test.js`**
   - **Purpose**: Tests the Express application’s middleware, routing, and error handling setup.
   - **Test Cases**:
     - Ensures CORS headers are properly applied.
     - Verifies static files are served correctly from the `/public` directory.
     - Confirms routes are mounted correctly.
     - Tests error handling for:
       - 404 errors (non-existent routes).
       - General server errors (500).

2. **`errorHandler.test.js`**
   - **Purpose**: Verifies centralized error handling functionality.
   - **Test Cases**:
     - Validates that 404 errors are logged and responded to correctly.
     - Ensures 500 errors are logged with appropriate details.
     - Confirms the response format for both HTML and JSON-based client requests.

3. **`indexRouter.test.js`**
   - **Purpose**: Tests the centralized routing logic for the application.
   - **Test Cases**:
     - Verifies all individual routers (root, metrics, roman) are mounted correctly.
     - Ensures invalid paths handled by `indexRouter` result in a 404 error.

4. **`metricsRouter.test.js`**
   - **Purpose**: Tests the functionality of the metrics endpoints.
   - **Test Cases**:
     - Verifies Prometheus metrics are served correctly from `/metrics`.
     - Ensures valid metrics data can be posted to `/react-metrics`.
     - Validates that logging is triggered for incoming metrics data.

5. **`roman.test.js`**
   - **Purpose**: Ensures the Roman numeral conversion API (`/romannumeral`) works as expected.
   - **Test Cases**:
     - **Valid Inputs**:
       - Confirms numeric inputs return the correct Roman numeral output.
     - **Invalid Inputs**:
       - Tests non-numeric values, missing parameters, and numbers outside the range of 1–3999.
     - **Boundary Cases**:
       - Validates handling for the minimum (1) and maximum (3999) allowable values.

6. **`root.test.js`**
   - **Purpose**: Tests the root endpoint (`/`) functionality.
   - **Test Cases**:
     - Verifies the welcome page is served correctly with proper HTML content.
     - Confirms links to other endpoints (e.g., `/romannumeral`, `/metrics`) are correctly rendered.



- **Frameworks**:  
  - **Jest** - JavaScript testing framework for unit tests.  
  - **Supertest**: Library for testing HTTP endpoints in Node.js applications.

## Packaging Layout
    ```
    Number-to-Roman/
    ├── routes/
    │   ├── roman.js            # Roman numeral conversion route  
    │   ├── metrics.js          # Metrics logging route  
    ├── tests/
    │   ├── roman.test.js       # Unit tests  
    ├── logs/                   # Log files  
    ├── public/                 # Static assets  
    ├── app.js                  # Express app setup  
    ├── logger.js               # Winston logger configuration  
    ├── package.json            # Project metadata  
    |... some config files
    
## Dependency Attribution

- ### **Dependencies**

| Dependency                   | Version       | Purpose                                                                |
|------------------------------|---------------|------------------------------------------------------------------------|
| **cookie-parser**            | ~1.4.4        | Middleware for parsing cookies.                                        |
| **cors**                      | ^2.8.5        | Middleware for handling Cross-Origin Resource Sharing (CORS).          |
| **debug**                     | ~2.6.9        | Debugging utility for logging application-level events.                |
| **express**                   | ~4.16.1       | Web framework for building RESTful APIs.                               |
| **express-prom-bundle**       | ^8.0.0        | Middleware for Prometheus-compatible metrics collection and monitoring.|
| **http-errors**               | ~1.6.3        | Creates HTTP errors for better error handling.                         |
| **morgan**                    | ~1.9.1        | HTTP request logger middleware for debugging requests.                  |
| **prom-client**               | ^15.1.3       | Prometheus client for collecting performance metrics.                   |
| **pug**                       | 2.0.0-beta11  | Template engine for rendering views.                                    |
| **winston**                   | ^3.17.0       | Logging library for structured logs and debugging.                      |

- ### **DevDependencies**

| Dependency                   | Version       | Purpose                                                                |
|------------------------------|---------------|------------------------------------------------------------------------|
| **jest**                      | ^29.7.0       | JavaScript testing framework for unit testing.                         |
| **supertest**                 | ^7.0.0        | HTTP assertions for testing API endpoints.                             |