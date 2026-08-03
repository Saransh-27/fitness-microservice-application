# 🏋️‍♂️ Enterprise AI-Powered Fitness Microservices Platform

[![Java](https://img.shields.io/badge/Java-21-orange.svg?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.0-6DB33F.svg?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-OAuth2_Resource_Server-6DB33F.svg?style=for-the-badge&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![Spring Cloud Gateway](https://img.shields.io/badge/Spring_Cloud-API_Gateway-6DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-cloud-gateway)
[![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-2025.1.2-6DB33F.svg?style=for-the-badge&logo=spring)](https://spring.io/projects/spring-cloud)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Keycloak](https://img.shields.io/badge/Keycloak-OAuth2%20%2F%20OIDC-4D90FE.svg?style=for-the-badge&logo=keycloak)](https://www.keycloak.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-AMQP-FF6600.svg?style=for-the-badge&logo=rabbitmq)](https://www.rabbitmq.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_%26_Groq-8E75B5.svg?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## 📌 Project Overview

An end-to-end, enterprise-grade **Cloud-Native Fitness Tracking & AI Health Insights Ecosystem** built with Java 21, Spring Boot microservices, RabbitMQ event streaming, Keycloak OAuth2 security, and an interactive React SPA frontend.

The platform enables users to manage physical profiles, track workouts in real time, and receive **automated AI-driven health feedback** (powered by Google Gemini API and Groq LLMs) triggered asynchronously upon completing physical activities.

<<<<<<< HEAD
---

## 🎥 Video Demonstration


https://github.com/user-attachments/assets/1d9ce160-d7b5-4cc3-8a7a-3359ba3b4549




=======
## 🎥 Video Demonstration


>>>>>>> c1060e8 (Adding things)

---

## 🚀 Key Technical Highlights

* **Distributed Event-Driven Architecture**: Decoupled activity logging and AI recommendation pipeline using **RabbitMQ** message queues (`fitness.exchange` ➔ `activity.queue`) with automatic consumer retry policies.
* **AI-Powered Health Intelligence**: Integrated **Google Gemini API** & **Groq LLM** to analyze user workout metrics, performance historical logs, and automatically generate contextual recovery & nutrition plans.
* **Enterprise Security (OAuth2 / OIDC)**: Zero-Trust authorization model using **Keycloak** with Proof Key for Code Exchange (PKCE) on the frontend and centralized JWT Resource Server validation at the API Gateway.
* **Polyglot Persistence Strategy**: 
  * **PostgreSQL** for relational, ACID-compliant user profile domain models.
  * **MongoDB Cloud Atlas** for schema-agnostic, high-throughput fitness logs and AI analysis documents.
* **Spring Cloud Infrastructure**: Integrated **Netflix Eureka** for dynamic service registration/discovery and **Spring Cloud Config Server** for localized/remote environment management.
* **State-of-the-Art Frontend**: React 19 SPA optimized with **Vite 8**, **Tailwind CSS v4**, **Radix UI** primitives, **Framer Motion** transitions, **Recharts** dashboard analytics, and **Zustand** reactive state management.

---

## 🧩 Microservices Matrix

| Microservice | Technology | Port | Core Responsibilities |
| :--- | :--- | :--- | :--- |
| **`eureka`** | Spring Cloud Eureka | `8761` | Dynamic Service Registry & Discovery Node |
| **`config-server`** | Spring Cloud Config | `8888` | Centralized Configuration Management |
| **`api-gateway`** | Spring Cloud Gateway | `8083` | Reactive WebFlux Routing, CORS & OAuth2 JWT Security |
| **`user-microservice`** | Spring Boot, JPA, PostgreSQL | `8080` | User Management, Physical Metrics & Target Goal Tracking |
| **`fitness-activity-microservice`** | Spring Boot, MongoDB, AMQP | `8081` | Activity Logging, Calories Computation & Event Publishing |
| **`ai-service`** | Spring Boot, MongoDB, Gemini/Groq | `8082` | Event Listener, LLM Prompt Processing & Advice Generation |
| **`fitness-frontend`** | React 19, Vite, Tailwind v4 | `3000` / `5173` | Interactive Dashboard, Analytics Charts & Keycloak PKCE Login |

---

## 🛠️ Technology Stack

### **Backend & Cloud Architecture**
* **Language & Runtime**: Java 21 LTS
* **Framework**: Spring Boot 4.1.0, Spring Cloud 2025.1.2
* **Service Discovery**: Spring Cloud Netflix Eureka
* **API Gateway**: Spring Cloud Gateway (Reactive WebFlux)
* **Configuration**: Spring Cloud Config Server
* **Messaging & Async**: RabbitMQ AMQP Protocol
* **Databases**: PostgreSQL (Relational), MongoDB Atlas (Document Store)
* **ORM & Data Access**: Spring Data JPA, Spring Data MongoDB, Hibernate
* **AI Integration**: Google Gemini Flash API, Groq LLM (WebClient HTTP)
* **Utilities**: Lombok, ModelMapper

### **Frontend App**
* **Framework**: React 19, Vite 8, TypeScript 6
* **Styling**: Tailwind CSS v4, Lucide Icons
* **UI Components**: Radix UI (Dialog, Dropdown, Tabs, Popover, Select, Tooltip)
* **State Management**: Zustand
* **Form & Validation**: React Hook Form, Zod Schema Validation
* **Charts & Animation**: Recharts, Framer Motion
* **HTTP Client**: Axios with Interceptors

### **Security & Identity**
* **Authentication**: Keycloak (OpenID Connect / OAuth2)
* **Authorization**: JWT Bearer Tokens with Spring Security Resource Server

---

## ⚡ Quick Start Guide (Local Setup)

### **1. Prerequisites**
Ensure you have the following installed on your system:
* **JDK 21** or later
* **Node.js** (v18+) & **npm**
* **PostgreSQL** (running on port `5432`)
* **RabbitMQ** (running on port `5672`)
* **Keycloak Server** (running on port `8181` with realm `fitness-oauth2`)

---

### **2. Environment Configuration**
Configure root level parameters in `.env` or set environment variables:

```env
POSTGRESQL_URI=jdbc:postgresql://localhost:5432/fitness_user_db
POSTGRESQL_USERNAME=postgres
POSTGRESQL_PASSWORD=your_password

MONGO_URI=your_mongodb_activity_uri
MONGO_URI2=your_mongodb_ai_uri

RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672

GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

FRONTEND_URL=http://localhost:3000
VITE_API_GATEWAY_URL=http://localhost:8083
VITE_KEYCLOAK_URL=http://localhost:8181
VITE_KEYCLOAK_REALM=fitness-oauth2
VITE_KEYCLOAK_CLIENT_ID=oauth2-pkce-client
```

---

### **3. Start Services (Execution Order)**

Launch microservices in the following sequential order:

1. **Service Registry (Eureka)**
   ```bash
   cd eureka
   ./mvnw spring-boot:run
   ```
2. **Config Server**
   ```bash
   cd config-server
   ./mvnw spring-boot:run
   ```
3. **Core Microservices** (Terminal window for each)
   ```bash
   cd user-microservice && ./mvnw spring-boot:run
   cd fitness-activity-microservice && ./mvnw spring-boot:run
   cd ai-service && ./mvnw spring-boot:run
   ```
4. **API Gateway**
   ```bash
   cd api-gateway
   ./mvnw spring-boot:run
   ```
5. **Frontend Application**
   ```bash
   cd fitness-frontend
   npm install
   npm run dev
   ```

Access the frontend dashboard at `http://localhost:3000` or `http://localhost:5173`.

---

## 📈 System Event Flow

```
[User Log Activity] ➔ [Activity Microservice] ➔ [Save MongoDB]
                                 │
                        (Publish AMQP Event)
                                 ▼
                     [RabbitMQ Exchange / Queue]
                                 │
                        (Consume AMQP Event)
                                 ▼
                         [AI Microservice] ➔ [Gemini / Groq LLM API]
                                 │
                        (Store Recommendation)
                                 ▼
                     [MongoDB AI Recommendations DB] ➔ [React Dashboard]
```

---

## 🤝 Contact & Author

**Saransh Dhiman**  
* GitHub: [@Saransh-27](https://github.com/Saransh-27)  
* Project Repo: [Saransh-27/fitness-microservice-application](https://github.com/Saransh-27/fitness-microservice-application)  
