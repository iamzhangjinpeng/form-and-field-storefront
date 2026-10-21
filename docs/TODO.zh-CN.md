# 项目待办

截至 2026-10-21。GitHub Pages 站点已上线，Supabase Edge Functions 支付接入代码已加入。待办是配置 Supabase 部署凭据并完成一次 Stripe 测试付款，以及素材来源的可选对齐。

## 完成产品文档中的真实支付验收

- [ ] 在 GitHub 仓库 **Settings → Secrets and variables → Actions → Variables** 添加 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`。
- [ ] 在 GitHub 仓库 **Settings → Secrets and variables → Actions → Secrets** 添加 `SUPABASE_ACCESS_TOKEN`，让部署工作流可自动发布 Supabase Edge Functions。
- [ ] 在 Supabase Edge Function Secrets 确认 `STRIPE_SECRET_KEY`（仅测试密钥）和 `SITE_URL=https://iamzhangjinpeng.github.io/form-and-field-storefront` 已配置。
- [ ] 重新运行 GitHub Actions，确认 checkout/session 两个 Edge Functions 部署成功，随后 Pages 构建识别 Supabase Variables 并切换到 Stripe 测试模式。
- [ ] 使用测试卡 `4242 4242 4242 4242` 完成一次托管支付，确认服务端验证成功后显示订单成功页；再验证取消返回结账页且购物车保留。

## 可选的素材对齐

- [ ] 若交付要求商品图全部来自 Unsplash/Pexels，将当前 AI 生成的商品主图替换为获准使用的图库素材，并在 [图片来源记录](image-provenance.md) 中登记来源与许可信息。当前生活方式照片及现有来源已记录。
