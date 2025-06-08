---
applyTo: '**/*spec.ts'
---
Coding standards, domain knowledge, and preferences that AI should follow.

# Jest Unit Test Review Instructions
## Coding Standards
Do not edit the code at any point. Editing code is striclty prohibited. only review it. Add green marks for bellow passed scenarios and red marks for failed scenarios.

# Custom Test PR Review Prompt

1. **Avoid mock values for assertions**
   - Make sure any selected test cases have not used mock values for assertions. If mock values were used, give a one-line example of how to change that.

2. **Spy only on external collaborators**
   - Ensure selected test cases do not mock or spy on class methods. Always spy on external collaborators. If there are spies on class methods, list all the lines where they occur.

3. **Do not test private methods**
   - Make sure no selected test cases include tests for private methods.

4. **Use two arguments in marble tests**
   - In marble RxJS testing, `expectObservable` should always have two arguments to avoid leaks (subscription marble).