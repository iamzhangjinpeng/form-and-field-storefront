# 交付说明

FORM & FIELD 是面向海外客户展示的英文家居电商作品，采用 Next.js App Router、TypeScript、Tailwind CSS 与 Stripe 服务端接口。

## 本地启动

```sh
npm ci
cp .env.example .env.local
npm run dev
```

访问 http://localhost:3006 。不配置密钥即可体验完整演示购买流程。购物车保存在当前浏览器，不需要注册或数据库。

## 支付的两种模式

- **演示模式**：不填 Stripe 密钥时启用。不会收集卡号、扣款、发送邮件或发货。成功页明确标注 Demo。
- **Stripe 测试模式**：在本地或 Vercel 设置 `STRIPE_SECRET_KEY` 为自己的测试密钥，并设置 `SITE_URL` 为网站地址。结算跳转 Stripe 托管页，使用 `4242 4242 4242 4242`、未来日期及任意三位 CVC。返回后由服务端查询订单确认支付结果。

不支持真实收款；不要配置正式环境密钥。密钥不要放到聊天、公开仓库或任何 `NEXT_PUBLIC_` 变量中。

## 给客户展示

在线演示：[FORM & FIELD](https://iamzhangjinpeng.github.io/form-and-field-storefront/)；源码：[GitHub 仓库](https://github.com/iamzhangjinpeng/form-and-field-storefront)。推荐演示路径：首页 → 商品列表 → 商品详情 → 选颜色/规格 → 加购 → 购物车改数量 → 填写虚构收货信息 → 演示确认。

在线版本使用 GitHub Pages + Supabase Edge Functions，已完成 Stripe 沙盒测试付款和成功页服务端验证。源码中的 Next.js API routes 也支持本地或 Vercel 服务端模式。部署步骤见英文 README，剩余验收项见 [项目待办](TODO.zh-CN.md)。

本项目不含后台、真实库存物流、账号系统或生产订单数据库。GitHub Actions 已部署 Supabase `checkout` 与 `session` Edge Functions；Stripe 测试密钥和站点地址保存在 Supabase Function Secrets 中。浏览器已使用 Stripe 测试卡完成托管付款，成功页确认了 Checkout Session。此支付仅为沙盒测试，不会真实扣款或履约。
