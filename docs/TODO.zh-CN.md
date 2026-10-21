# 项目待办

截至 2026-10-21。GitHub Pages 站点已上线，Supabase Edge Functions 已部署。公开结账已显示 Stripe test mode，取消后返回和重新发起结账均已在浏览器验证。

## 建议补充的验收

- [x] 确认公开结账页显示 Stripe · test mode，并成功创建 Stripe 沙盒 Checkout。
- [x] 在 Stripe 托管页点击返回商店；确认回到 `/checkout/?cancelled=true`、显示未付款提示、购物袋保留 1 件商品，并可再次点“Continue to test payment”重新打开 Stripe Checkout。测试期间未提交付款。

## 可选的作品集优化

- [ ] 若严格按产品文档要求商品图全部来自 Unsplash/Pexels，将当前 AI 生成的商品主图替换为获准使用的图库素材，并在 [图片来源记录](image-provenance.md) 中登记来源与许可信息。现有商品图来源和 AI 生成记录均已披露。
- [ ] 视 Upwork 展示需要，可再部署一个 Vercel 版本，展示 Next.js 服务端部署；当前免费的 GitHub Pages + Supabase Edge Functions 已完成 Stripe 测试支付演示。

## 明确不在本 Demo 范围内

真实收款、订单数据库、Stripe Webhook/自动履约、税费计算、库存物流、账号系统和后台管理不属于当前作品集验收范围。若将项目改成真实商店再另行规划。Vercel 部署和素材替换暂不作为当前必做项。
