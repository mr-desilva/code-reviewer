---
applyTo: '**/*.ts'
---
Coding standards, domain knowledge, and preferences that AI should follow.

# Angular TypeScript Code Review Instructions

> **Scope**: `**/*spec.ts`
> **Note**: Do **not** edit the code. Only review and mark results using ✅ (pass) or ❌ (fail).
### 📌 Review Output Guidelines

- ❌ Do **not** provide additional positive commentary or verbose explanations (e.g., "clean pattern", "appropriate use of operators").
- ✅ Focus **only on the checklist items** provided below.
- ⚠️ If a rule is passed, just mark it with a ✅ and move on — **no need to explain why it passed**.
- ❗ Only explain if a rule is **violated**, and keep the explanation **brief and directly related to the rule**.

- Add the end of the output display number of success, fails and warnings


---

## 🔍 Custom Code PR Review Checklist

### 1. **Avoid Getters/Setters**
- ❌ Never use `get` or `set` accessors.
- ✅ Use plain methods instead of getters or setters.

---

### 2. **Avoid `event.stopPropagation`**
- ❌ Do not use `event.stopPropagation()` anywhere in the code.

---

### 3. ✅ **Performance Optimization Guideline**

When using `if` or `else if` conditions with multiple boolean expressions, always evaluate **variables before method or function calls**.

This helps optimize performance through short-circuit evaluation, as variable checks are cheaper than function calls.

#### ✅ Preferred:
```ts
if (isEnabled && isValidState()) {
    // logic here
}
```

#### ❌ Avoid:
```ts
if (isValidState() && isEnabled) {
    // logic here
}
```

By placing the variable check first, unnecessary function calls are avoided when the condition short-circuits.

---

### 4. ✅ **RxJS Subscription Best Practice**

Always ensure `takeUntil` is the **last operator** in an RxJS `pipe()` chain.
Placing it earlier can lead to incorrect or missed unsubscriptions.

- 🔎 Review all usages of `takeUntil`.
- ❗ If `takeUntil` is **not the last operator**, list those lines explicitly.

#### ✅ Correct Usage:
```ts
this.someService.getData()
  .pipe(
    map(data => data.value),
    takeUntil(this.destroy$)
  )
  .subscribe(result => {
    // handle result
  });
```

#### ❌ Incorrect Usage:
```ts
this.someService.getData()
  .pipe(
    takeUntil(this.destroy$),
    map(data => data.value)
  )
  .subscribe(result => {
    // handle result
  });
```

### 🔄 `takeUntil` Handling in Wrapped/Helper Methods

If a `subscribe()` is made on a method (e.g., `this.methodName().subscribe()`), and that method internally returns an observable that already includes `takeUntil`, it is **not required** to add `takeUntil` again at the point of subscription.

- ✅ In such cases, **do not flag a warning**.
- 🔍 You may need to inspect the returned observable method to confirm `takeUntil` is applied inside it.

Additionally, if a method builds an observable pipeline using `pipe(...)` but there is **no visible subscription** to it, show a ⚠️ **warning** to ensure it is safely handled:

- ⚠️ **Warning**: If such a method is later subscribed in the component class, it **must** include `takeUntil` in its pipe.
- ✅ Alternatively, it should be used in the **template** with the `| async` pipe.

---

#### ✅ Correct Example (takeUntil used inside method and subscribed safely):
```ts
ngOnInit(): void {
  this.smartEditorValueChange$().subscribe(); // Safe if takeUntil is inside the method
}

private smartEditorValueChange$(): Observable<string> {
  return this.someCondition$.pipe(
    switchMap(() => this.someSource$),
    takeUntil(this.destroy$)
  );
}
```

---

#### ❌ Incorrect Example (method returns observable without takeUntil):
```ts
ngOnInit(): void {
  this.wrappedObservable().subscribe(); // Warning: takeUntil missing inside wrappedObservable
}

private wrappedObservable(): Observable<string> {
  return this.someCondition$.pipe(
    switchMap(() => this.someSource$)
  );
}
```

---

#### ⚠️ Warning Example (method defined but not subscribed yet):
```ts
private wrappedObservable(): Observable<string> {
  return this.someCondition$.pipe(
    switchMap(() => this.someSource$)
  );
}
// ⚠️ Warning: This method returns an observable but is not subscribed anywhere.
// → If subscribed in component, make sure to include takeUntil.
// → If used in template, prefer the async pipe.
```

```

