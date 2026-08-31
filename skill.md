# Project Skill Guide (new)

## 1) Purpose
This project is a minimal TypeScript + Express learning API with DI, MySQL persistence, and Kafka event publishing.

Main flow:
app -> bootstrap -> route -> controller -> service -> repository/publisher

## 2) Core Rules
- Read this file before answering project questions.
- Keep controllers thin; business logic belongs in services/usecases.
- Use DI tokens from src/di/injection-tokens.ts.
- Put environment-dependent behavior in AppConfig (src/di/dependency-registry.ts).
- Use a unified API response envelope for business endpoints.

## 3) Runtime Architecture
- app.ts
  - Loads reflect-metadata.
  - Loads DI registrations from src/di/dependency-registry.ts.
  - Calls bootstrap().
- Bootstrap.ts
  - Builds Express app via createApp().
  - Registers JSON middleware.
  - Mounts routers at /api.
  - Exposes GET /health with DB/Kafka dependency status.
  - Startup fail-fast:
    - DB: getMySqlPool() when DB_ENABLED=true
    - Kafka: EventPublisher.connect() when KAFKA_ENABLED=true

## 4) Project Structure
- src/controllers: HTTP orchestration
- src/routes: endpoint wiring
- src/services: business logic
- src/usecases: pure business helpers
- src/repositories: persistence implementations
- src/publishers: event publisher implementations
- src/interfaces: ports/contracts
- src/di: tokens + dependency registry
- src/db: mysql pool + init.sql
- src/dtos + src/mappers: request/response mapping
- docker: Dockerfile + compose
- jest: Jest config + setup
- tests: unit/api/mapper tests

## 5) DI Map
In src/di/dependency-registry.ts:
- AppConfig -> useValue
- GreetingRepository ->
  - MySqlGreetingRepository when DB_ENABLED=true
  - NoopGreetingRepository otherwise
- ProfileRepository ->
  - MySqlProfileRepository when DB_ENABLED=true
  - NoopProfileRepository otherwise
- EventPublisher ->
  - KafkaEventPublisher when KAFKA_ENABLED=true
  - NoopEventPublisher otherwise
- HelloService -> useClass
- GreetingService -> useClass
- CalculateService -> useClass
- ProfileService -> useClass

Important runtime behavior:
- When DB_ENABLED=false, profile data is stored only in memory (NoopProfileRepository Map) and is lost on process/container restart.

## 6) API Contract
- GET /health
  - 200 when enabled dependencies are up
  - 503 when DB or Kafka is down
  - response contains:
    - status: ok | degraded
    - timestamp
    - dependencies.database: { enabled, status, error? }
    - dependencies.kafka: { enabled, status, error? }
- Business endpoint response envelope:
  - success/error shape:
    - resultCode: number
    - resultMessage: string
    - resultData?: object

- GET /api/hello?name=Tom
  - 200 -> { resultCode: 200, resultMessage: "success", resultData: { message } }

- GET /api/greeting?name=Tom
  - 200 -> { resultCode: 200, resultMessage: "success", resultData: { message } }

- GET /api/greeting/:name
  - 200 -> envelope with resultData.message
  - 400 -> { resultCode: 400, resultMessage: "Name is required" }
  - 404 -> { resultCode: 404, resultMessage: "Greeting not found" }

- POST /api/calculate
  - body:
    - currentValue: number
    - changeBy: number
    - operation: increase | decrease
  - success 200 response envelope:
    - resultData.operation
    - resultData.originalValue
    - resultData.changeBy
    - resultData.changedValue
  - invalid payload -> 400 with resultMessage: currentValue, changeBy and operation are required

- POST /api/profiles
  - creates profile with address and preferences
  - 200 -> envelope with resultData profile object

- GET /api/profiles/:id
  - 200 -> envelope with resultData profile object
  - 404 -> { resultCode: 404, resultMessage: "Profile not found" }

- POST /api/profiles/update
  - id is in request body (not in route params)
  - body minimum:
    - id: number
    - one or more mutable fields
  - 200 -> envelope with updated profile in resultData
  - 400 -> invalid id/payload
  - 404 -> profile not found
  - 409 -> inactive profile cannot be updated

## 7) Data + Messaging
- DB tables:
  - greetings(id, name, message, created_at)
  - profiles(id, first_name, last_name, email, phone, date_of_birth, status, version, created_at, updated_at)
  - profile_addresses(profile_id, line1, line2, city, state, postal_code, country, updated_at)
  - profile_preferences(profile_id, allow_marketing, updated_at)
  - profile_audit_logs(id, profile_id, action, changed_fields, created_at)
- DB bootstrap SQL: src/db/init.sql
- Kafka topic: greeting.created (configurable by KAFKA_TOPIC_GREETING_CREATED)
- Event payload:
  - eventType: greeting.created
  - name
  - message
  - createdAt
- Kafka logs:
  - [Kafka] Publishing greeting.created ...
  - [Kafka] Published greeting.created ... partitions=<partition>@<offset>

## 8) Environment Variables
- GREETING_STYLE=formal|casual
- DB_ENABLED=true|false
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- KAFKA_ENABLED=true|false
- KAFKA_BROKERS
- KAFKA_CLIENT_ID
- KAFKA_TOPIC_GREETING_CREATED

Test defaults (jest/jest.setup.ts):
- DB_ENABLED=false
- KAFKA_ENABLED=false

Response status constants:
- source: src/constants/response-status.ts
- current shared codes:
  - OK = 200
  - BAD_REQUEST = 400
  - NOT_FOUND = 404
  - CONFLICT = 409
  - INTERNAL_SERVER_ERROR = 500

## 9) Runbook
From repository root:

Local dev:
- npm run dev
- npm run dev:once
- npm run build
- npm run start

Tests:
- npm test
- npm run test:watch

Docker (app + mysql + redpanda):
- npm run docker:up
- npm run docker:ps
- npm run docker:logs
- npm run docker:down
- npm run docker:rebuild
- npm run docker:restart:app

Recommended when env/config changed:
- npm run docker:rebuild
- or: docker compose -f docker/docker-compose.yml up --build -d --force-recreate

Kafka verify:
- curl.exe "http://localhost:3000/api/greeting?name=Tom"
- npm run docker:kafka:topics
- npm run docker:kafka:consume

Calculate verify:
- curl.exe -X POST "http://localhost:3000/api/calculate" -H "Content-Type: application/json" -d "{\"currentValue\":100,\"changeBy\":15,\"operation\":\"decrease\"}"

Profile verify:
- create:
  - curl.exe -X POST "http://localhost:3000/api/profiles" -H "Content-Type: application/json" -d "{\"firstName\":\"Alice\",\"lastName\":\"Johnson\",\"email\":\"alice@example.com\",\"phone\":\"0800000000\",\"dateOfBirth\":\"1990-01-20\",\"status\":\"active\",\"address\":{\"line1\":\"123 Main St\",\"city\":\"Bangkok\",\"state\":\"Bangkok\",\"postalCode\":\"10100\",\"country\":\"Thailand\"},\"preferences\":{\"allowMarketing\":true}}"
- update (id in body):
  - curl.exe -X POST "http://localhost:3000/api/profiles/update" -H "Content-Type: application/json" -d "{\"id\":1,\"phone\":\"0899999999\"}"

## 10) Docker/Compose Notes
- Compose file: docker/docker-compose.yml
- Ports:
  - app: 3000
  - mysql: 3306
  - redpanda: 9092
- app depends on healthy mysql and redpanda.
- For Docker Desktop compatibility, app uses:
  - KAFKA_BROKERS=host.docker.internal:9092
- Redpanda advertise address in compose must match host.docker.internal:9092 for external clients.
- mysql init.sql runs only on first initialization of the MySQL data volume.
- if schema changes are added later and volume already exists, apply SQL manually or recreate volume.

## 11) Troubleshooting
- Wrong compose path:
  - Use docker compose -f docker/docker-compose.yml ...
- Port already allocated:
  - docker ps
  - stop conflicting container
  - docker compose -f docker/docker-compose.yml down
  - docker compose -f docker/docker-compose.yml up --build -d
- Health degraded:
  - curl.exe -i "http://localhost:3000/health"
  - inspect dependencies.database / dependencies.kafka
- Kafka message not visible:
  - consume with live tail or --offset start
  - verify topic exists: rpk topic list
- Calculate API returns 404:
  - use POST /api/calculate (not /api/greeting/calculate)
  - rebuild/restart app container: npm run docker:up
- Profile tables exist but no profile rows:
  - check DB mode in app container: docker compose -f docker/docker-compose.yml exec app printenv DB_ENABLED
  - if false, profile data is in-memory only and not persisted to MySQL
  - set DB_ENABLED=true and recreate app container

## 12) Change Checklist
Before finishing changes:
1. npm run build
2. npm test
3. curl /health returns expected status
4. For Kafka changes, verify one message is consumable from greeting.created

## 13) On-Call Quick Commands (Copy Block)
Copy this block and run line by line from repository root:

```powershell
npm run docker:up
npm run docker:ps
curl.exe -i "http://localhost:3000/health"
curl.exe "http://localhost:3000/api/greeting?name=OnCall"
curl.exe -X POST "http://localhost:3000/api/calculate" -H "Content-Type: application/json" -d "{\"currentValue\":100,\"changeBy\":15,\"operation\":\"increase\"}"
npm run docker:rebuild
npm run docker:logs
npm run docker:kafka:topics
npm run docker:kafka:consume
npm run docker:restart:app
npm run docker:down
```
