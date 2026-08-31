# Contact-Profile GET Test Skill

## Overview
Jest + ts-jest unit-test guide for contact-profile GET endpoints. Tests are pure unit tests: no real database, network, or file-system access. Mock every external dependency and test one Clean Architecture layer at a time.

```text
Controller -> Usecase -> Port -> Repository -> Query -> Database
```

This guide combines the current contact-profile patterns with the quality requirements from `unit_test.md` and `unit_test_sr.md`. Repository convention overrides the generic prompt: use `test/contact-profile/<use-case>/<ClassName>.test.ts`, not `tests/` or `.spec.ts`.

---

## 1. Required Layers Per Route

Maintain one test file for each production layer owned by a route:

| Layer | Test file | Required behavior |
| --- | --- | --- |
| Query | `GetXxxQuery.test.ts` | Query/SQL DTO structure, parameter binding, optional filters |
| Mapper | `GetXxxMapper.test.ts` | Full mapping, null/undefined/default values, date/type conversion |
| Repository | `GetXxxRepo.test.ts` or `GetXxxRepository.test.ts` | Query delegation, wrapper callback, return/error propagation |
| Usecase | `GetXxxUsecase.test.ts` | Business branches, port/mapper orchestration, error handling |
| Controller | `GetXxxController.test.ts` | Request validation, usecase call, response/error behavior |

Do not create a duplicate mapper test when a route uses a shared mapper owned by another domain. Test that mapper at its owner and mock it from the consuming usecase test.

---

## 2. Controller File Structure & Imports

```typescript
/// <reference types="jest" />
import 'reflect-metadata';
import { GetXxxController } from '../../../src/adapters/inbound/http/controllers/contact-profile/GetXxxController';
import { AbstractMethod } from '../../../src/utils/functions/AbstractMethod';
import { ErrorHandler } from '../../../src/utils/functions/ErrorHandler';
import { ValidateParams } from '../../../src/utils/functions/ValidateParams';
import { GetXxxUsecase } from '../../../src/domain/{domain}/usecases/GetXxxUsecase';
import { ResponseHelper } from '../../../src/utils/functions/ResponseHelper';
import { CustomRequest, CustomResponse } from '../../../src/utils/types/HandleExpressType';
```

**Key Requirements:**
- ✅ `/// <reference types="jest" />` - TypeScript reference for Jest IDE support
- ✅ `import 'reflect-metadata'` - Required for tsyringe DI framework
- ✅ Import all 5 dependencies that are mocked

---

## 3. Controller Module-Level Jest Mocks

```typescript
jest.mock('../../../src/utils/functions/AbstractMethod');
jest.mock('../../../src/utils/functions/ErrorHandler');
jest.mock('../../../src/utils/functions/ValidateParams');
jest.mock('../../../src/domain/{domain}/usecases/GetXxxUsecase');
jest.mock('../../../src/utils/functions/ResponseHelper');
```

**Why 5 dependencies?**
- `AbstractMethod` - Express method wrapper for error handling
- `ErrorHandler` - Error creation and handling
- `ValidateParams` - Request header & parameter validation
- `GetXxxUsecase` - Business logic (domain-specific)
- `ResponseHelper` - HTTP response formatting

---

## 4. Test Suite Setup

```typescript
describe('GetXxxController', () => {
    let controller: GetXxxController;
    let mockAbstractMethod: jest.Mocked<AbstractMethod>;
    let mockErrorHandler: jest.Mocked<ErrorHandler>;
    let mockValidation: jest.Mocked<ValidateParams>;
    let mockUsecase: jest.Mocked<GetXxxUsecase>;
    let mockResponseHelper: jest.Mocked<ResponseHelper>;
    let mockReq: Partial<CustomRequest>;
    let mockRes: Partial<CustomResponse>;
```

**Type Safety Pattern:**
- Use `jest.Mocked<T>` or `jest.Mocked<Pick<T, 'methodName'>>` for dependencies.
- Use `Partial<CustomRequest>` / `Partial<CustomResponse>` when only part of an Express object is needed.
- At a DI or ORM boundary, one `as unknown as T` cast is acceptable; do not use `as any` to hide a type error.
- Enables IDE autocomplete for mock methods
- Provides compile-time error detection

---

## 5. beforeEach Setup & Initialization

```typescript
beforeEach(() => {
    jest.clearAllMocks();  // ← CRITICAL: Prevent cross-test state pollution

    mockAbstractMethod = {
        controllerMethod: jest.fn((name, fn) => fn)
    } as unknown as jest.Mocked<AbstractMethod>;

    mockErrorHandler = {
        missingInvalid: jest.fn(),
        addErrorHandler: jest.fn()
    } as unknown as jest.Mocked<ErrorHandler>;

    mockValidation = {
        isValidHeader: jest.fn()
    } as unknown as jest.Mocked<ValidateParams>;

    mockUsecase = {
        execute: jest.fn()
    } as unknown as jest.Mocked<GetXxxUsecase>;

    mockResponseHelper = {
        sendResponse: jest.fn()
    } as unknown as jest.Mocked<ResponseHelper>;

    mockReq = {
        headers: {
            'x-tid': 'test-tid',
            'x-session-id': 'test-session'
        },
        query: {
            // ← Vary by controller: contactId, mobileNo, privateCode, etc.
            contactId: 'C001'
        }
    };

    mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };

    controller = new GetXxxController(
        // ← IMPORTANT: Parameter order must match actual controller's @inject() decorators
        mockAbstractMethod,
        mockErrorHandler,
        mockValidation,
        mockUsecase,
        mockResponseHelper
    );
});
```

**Critical Points:**
1. **`jest.clearAllMocks()`** - Must be first line to prevent test isolation issues
2. **Constructor parameter order** - Each controller has unique order; verify against source
3. **Mock request headers** - Required: x-tid, x-session-id for header validation
4. **Query params** - Populate based on controller's expected parameters
5. **AAA comments** - Every test uses `// Arrange`, `// Act`, and `// Assert`.

---

## 6. Six Standard Controller Test Cases

### Test Case 1: Success Path
```typescript
it('should successfully get XXX with valid input', async () => {
    const mockResult = {
        xxx: {
            contactId: 'C001',
            // ← Controller-specific fields
        }
    };

    mockValidation.isValidHeader = jest.fn().mockReturnValue({ success: true });
    mockUsecase.execute = jest.fn().mockResolvedValue(mockResult);
    mockResponseHelper.sendResponse = jest.fn().mockResolvedValue(undefined);

    await controller.getXxx(mockReq as CustomRequest, mockRes as CustomResponse);

    expect(mockValidation.isValidHeader).toHaveBeenCalled();
    expect(mockUsecase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ contactId: 'C001' }),
        mockRes  // ← May be: mockRes or (mockReq, mockRes) depending on controller
    );
    expect(mockResponseHelper.sendResponse).toHaveBeenCalled();
});
```

### Test Case 2: Header Validation Failure
```typescript
it('should throw error when header validation fails', async () => {
    mockValidation.isValidHeader = jest.fn().mockReturnValue({
        success: false,
        error: 'Invalid header'
    });
    const validationError = new Error('Header validation failed');
    mockErrorHandler.missingInvalid = jest.fn(
        (..._args: Parameters<ErrorHandler['missingInvalid']>): void => {
            throw validationError;
        }
    );

    await expect(
        controller.getXxx(mockReq as CustomRequest, mockRes as CustomResponse)
    ).rejects.toThrow();

    expect(mockValidation.isValidHeader).toHaveBeenCalled();
    expect(mockErrorHandler.missingInvalid).toHaveBeenCalled();
});
```

**Error Handler Pattern:**
```typescript
mockErrorHandler.missingInvalid = jest.fn(
    (..._args: Parameters<ErrorHandler['missingInvalid']>): void => {
        throw validationError;
    }
);
```
`missingInvalid()` and `dataNotFound()` are typed as `void` because production code throws inside them. Do not use `mockReturnValue(new Error(...))`.

### Test Case 3: Missing Required Parameter
```typescript
it('should throw error when {paramName} is missing', async () => {
    mockReq.query = { contactId: 'C001' };  // ← Other params but missing one
    mockValidation.isValidHeader = jest.fn().mockReturnValue({ success: true });
    const validationError = new Error('Validation failed');
    mockErrorHandler.missingInvalid = jest.fn(
        (..._args: Parameters<ErrorHandler['missingInvalid']>): void => {
            throw validationError;
        }
    );

    await expect(
        controller.getXxx(mockReq as CustomRequest, mockRes as CustomResponse)
    ).rejects.toThrow();

    expect(mockErrorHandler.missingInvalid).toHaveBeenCalled();
});
```

### Test Case 4: Empty String Parameter
```typescript
it('should throw error when {paramName} is empty string', async () => {
    mockReq.query = { contactId: '' };  // ← Empty value
    mockValidation.isValidHeader = jest.fn().mockReturnValue({ success: true });
    const validationError = new Error('Validation failed');
    mockErrorHandler.missingInvalid = jest.fn(
        (..._args: Parameters<ErrorHandler['missingInvalid']>): void => {
            throw validationError;
        }
    );

    await expect(
        controller.getXxx(mockReq as CustomRequest, mockRes as CustomResponse)
    ).rejects.toThrow();

    expect(mockErrorHandler.missingInvalid).toHaveBeenCalled();
});
```

### Test Case 5: Usecase Execution Error
```typescript
it('should handle usecase execution error', async () => {
    const mockError = new Error('Usecase error');
    mockValidation.isValidHeader = jest.fn().mockReturnValue({ success: true });
    mockUsecase.execute = jest.fn().mockRejectedValue(mockError);
    mockErrorHandler.addErrorHandler = jest.fn(
        (error) => error as unknown as Record<string, string>
    );

    await expect(
        controller.getXxx(mockReq as CustomRequest, mockRes as CustomResponse)
    ).rejects.toThrow('Usecase error');

    expect(mockErrorHandler.addErrorHandler).toHaveBeenCalled();
});
```

### Test Case 6: Alternative Valid Data
```typescript
it('should successfully process with alternative {paramName}', async () => {
    const mockResult = {
        xxx: {
            contactId: 'C002',  // ← Different value
            specialFlag: false,  // ← Alternative result variant
            specialType: 'REGULAR'
        }
    };

    mockReq.query = { contactId: 'C002' };  // ← Different input
    mockValidation.isValidHeader = jest.fn().mockReturnValue({ success: true });
    mockUsecase.execute = jest.fn().mockResolvedValue(mockResult);
    mockResponseHelper.sendResponse = jest.fn().mockResolvedValue(undefined);

    await controller.getXxx(mockReq as CustomRequest, mockRes as CustomResponse);

    expect(mockUsecase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ contactId: 'C002' }),
        mockRes
    );
});
```

---

## 7. Important Variations by Controller

### Constructor Parameter Order
Each controller has different constructor order - MUST verify against source:

```typescript
// GetContactChannelController
new GetContactChannelController(
    mockAbstractMethod,
    mockErrorHandler,
    mockValidation,
    mockUsecase,
    mockResponseHelper
);

// GetIdCardController (different order!)
new GetIdCardController(
    mockAbstractMethod,
    mockValidation,
    mockErrorHandler,
    mockResponseHelper,
    mockUsecase
);

// GetPersonalityController (unique order!)
new GetPersonalityController(
    mockAbstractMethod,
    mockUsecase,
    mockErrorHandler,
    mockResponseHelper,
    mockValidation
);
```

### usecase.execute() Arguments
Different usecases expect different argument orders:

```typescript
// Standard pattern
expect(mockUsecase.execute).toHaveBeenCalledWith(
    expect.objectContaining({ contactId: 'C001' }),
    mockRes
);

// GetIdCardController - response FIRST!
expect(mockUsecase.execute).toHaveBeenCalledWith(
    mockRes,
    expect.objectContaining({ mobileNo: '0812345678' })
);

// GetContactChannelController - 3 arguments!
expect(mockUsecase.execute).toHaveBeenCalledWith(
    expect.objectContaining({ contactId: 'C001' }),
    mockReq,
    mockRes
);
```

---

## 8. Query, Mapper, Repository, and Usecase Patterns

### Query Layer

Mock TypeORM fluent methods and return the same full query-builder mock:

```typescript
let mockQueryBuilder: jest.Mocked<SelectQueryBuilder<V_Asset>>;

mockQueryBuilder = {
    select: jest.fn(),
    addSelect: jest.fn(),
    leftJoin: jest.fn(),
    andWhere: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn()
} as unknown as jest.Mocked<SelectQueryBuilder<V_Asset>>;

mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
mockQueryBuilder.addSelect.mockReturnValue(mockQueryBuilder);
mockQueryBuilder.leftJoin.mockReturnValue(mockQueryBuilder);
mockQueryBuilder.andWhere.mockReturnValue(mockQueryBuilder);
mockQueryBuilder.orderBy.mockReturnValue(mockQueryBuilder);
mockQueryBuilder.limit.mockReturnValue(mockQueryBuilder);
```

Assert entity/alias, selected fields, joins, parameterized `andWhere` values, ordering, limits, and every optional-filter branch. For raw SQL DTOs, assert database name, selected aliases, tables/joins, bind variable, and `bindParam` values for more than one input.

### Mapper Layer

Test a full DTO-to-model result with `toEqual`, then add null/undefined/empty cases. Assert date formatting and type conversion where the mapper owns them. Do not make a mapper test for a shared mapper owned by another domain.

### Repository Layer: Generic `repositoriesMethod<T>`

`AbstractMethod.repositoriesMethod` is generic. An untyped `jest.fn()` changes its return from `Promise<T>` to `Promise<unknown>` and creates diagnostics. Inject a generic wrapper that calls the real callback:

```typescript
import { Response } from 'express';
import { DbPropertyModel } from '../../../src/utils/types/DatabasePropertiesType';
import { CustomResponse } from '../../../src/utils/types/HandleExpressType';

let repositoriesMethodCallCount: number;
let mockAbstractMethod: Pick<AbstractMethod, 'repositoriesMethod'>;

mockAbstractMethod = {
    repositoriesMethod: <T>(
        repositoryCallback: (property: unknown, response: Response) => Promise<T>
    ) => async (
        _commandName: string,
        _dbProperty: DbPropertyModel,
        property: unknown,
        response: CustomResponse
    ): Promise<T> => {
        repositoriesMethodCallCount += 1;
        return repositoryCallback(property, response);
    }
};
```

For every public repository method, test query creation, wrapper invocation, database executor/query-builder invocation, return value, and rejected database path.

### Usecase Layer: Throwing ErrorHandler Methods

`dataNotFound()` and `missingInvalid()` throw despite their `void` return type:

```typescript
const notFoundError = new Error('Record not found');

mockErrorHandler.dataNotFound = jest.fn(
    (..._args: Parameters<ErrorHandler['dataNotFound']>): void => {
        throw notFoundError;
    }
);
```

`addErrorHandler()` returns `Record<string, string>`. When a usecase throws that returned value, preserve an `Error` test fixture with a compatible cast:

```typescript
mockErrorHandler.addErrorHandler = jest.fn(
    (error) => error as unknown as Record<string, string>
);
```

Usecase tests cover mapped success, exact mapper output, empty/not-found, rejected port, every meaningful business branch, and input non-mutation.

---

## 9. Best Practices

✅ **DO:**
- Use `jest.Mocked<T>` for type safety
- Call `jest.clearAllMocks()` in beforeEach
- Use AAA comments and behavioral test names
- Cover success, error, and null/empty/boundary cases for every public method
- Verify constructor parameter order against source controller
- Check usecase.execute() actual signature
- Mock database, ORM, service, config, and environment boundaries
- Use `expect.objectContaining({ key: value })` for partial object matching
- Keep tests deterministic; do not use real dependencies, snapshots, arbitrary waits, or `console.log`

❌ **DON'T:**
- Use `as any` to suppress errors
- Skip `jest.clearAllMocks()` (causes test pollution)
- Return `Error` through `dataNotFound()` or `missingInvalid()`; both methods are typed as `void` and throw
- Mock generic `repositoriesMethod<T>` with an untyped `jest.fn()`
- Assume constructor parameter order without checking source
- Assume all usecases have same execute() signature

---

## 10. Coverage Goals

- **Per changed production file:** aim for at least $80\%$ Statements, Branches, Functions, and Lines.
- **Branch coverage:** add explicit optional-filter, empty, validation, dependency-error, and alternate business-flow tests.
- **Controllers:** six standard cases are a baseline, not a cap. Add tests for every source branch.
- **Final check:** all affected suites pass; report any coverage below $80\%$ with its uncovered reason.

---

## 11. File Naming & Organization

```
test/
├── contact-profile/
│   ├── get-contact-channel/
│   │   ├── GetContactChannelQuery.test.ts
│   │   ├── GetContactChannelRepo.test.ts
│   │   ├── GetContactChannelUsecase.test.ts
│   │   └── GetContactChannelController.test.ts
│   ├── get-contact-profile/
│   │   ├── GetContactProfileQuery.test.ts
│   │   ├── GetContactProfileMapper.test.ts
│   │   ├── GetContactProfileRepo.test.ts
│   │   ├── GetContactProfileUsecase.test.ts
│   │   └── GetContactProfileController.test.ts
│   ├── get-id-card/
│   │   ├── GetIdCardQuery.test.ts
│   │   ├── GetIdCardRepository.test.ts
│   │   ├── GetIdCardUsecase.test.ts
│   │   └── GetIdCardController.test.ts
│   └── get-xxx/
│       └── GetXxx{Query|Mapper|Repo|Usecase|Controller}.test.ts
```

**Naming Convention:** `Get{Action}{Layer}.test.ts` matches the source class. Use `Repo` or `Repository` consistently with the route's existing files.

---

## 12. Reference Examples

See current working examples:

- [GetContactChannelController.test.ts](../test/contact-profile/get-contact-channel/GetContactChannelController.test.ts) for six controller behaviors
- [GetContactChannelRepo.test.ts](../test/contact-profile/get-contact-channel/GetContactChannelRepo.test.ts) for a generic repository wrapper mock
- [GetIdCardQuery.test.ts](../test/contact-profile/get-id-card/GetIdCardQuery.test.ts) for a fluent TypeORM query-builder mock
- [GetContactProfileUsecase.test.ts](../test/contact-profile/get-contact-profile/GetContactProfileUsecase.test.ts) for a typed throwing ErrorHandler mock

---

## Running Tests

```bash
# All contact-profile tests
npm run test:contact-profile

# Specific controller test
npm run test:contact-profile -- test/contact-profile/get-xxx/GetXxxController.test.ts

# With coverage
npm run test:contact-profile -- --coverage

# Run in band (sequential, not parallel)
npm run test:contact-profile -- --runInBand

# Fresh TypeScript compilation without Jest cache
npx jest test/contact-profile --config jest/contact-profile.js --runInBand --no-cache
```
