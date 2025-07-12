# CDN 测试

## 测试文件列表

- [cdn-cors-fix-test.spec.ts](./cdn-cors-fix-test.spec.ts)
- [cdn-fallback-test.spec.ts](./cdn-fallback-test.spec.ts)
- [cdn-basic-test.spec.ts](./cdn-basic-test.spec.ts)
- [simple-cdn-test.spec.ts](./simple-cdn-test.spec.ts)

## 运行测试

```bash
# 运行此分类下的所有测试
npx playwright test tests/categories/cdn/

# 运行特定测试文件
npx playwright test tests/categories/cdn/cdn-cors-fix-test.spec.ts
```
