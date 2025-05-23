# Sui zkLogin 集成设置指南

本项目已集成 Sui zkLogin 功能，允许用户通过 Google 账号登录并获得对应的 Sui 钱包地址。

## 功能特性

- ✅ Google OAuth 2.0 集成
- ✅ 零知识证明身份验证
- ✅ 自动生成 Sui 钱包地址
- ✅ 会话管理
- ✅ 响应式 UI 设计

## 快速开始

### 1. 配置 Google OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID：
   - 应用类型：Web 应用
   - 授权重定向 URI：`http://localhost:3000/auth/callback`
   - 授权 JavaScript 来源：`http://localhost:3000`

### 2. 环境变量配置

创建 `.env.local` 文件并添加以下配置：

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback

# Sui Network Configuration (可选，默认为 mainnet)
NEXT_PUBLIC_SUI_NETWORK=mainnet
```

### 3. 安装依赖

项目已包含所需依赖：
- `@mysten/sui` - Sui SDK（包含 zkLogin 功能）
- `jwt-decode` - JWT 解码库

如需重新安装：
```bash
pnpm install
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:3000/zklogin-demo` 体验 zkLogin 功能。

## 使用方法

### 基本用法

1. 访问 zkLogin 演示页面
2. 点击 "Continue with Google" 按钮
3. 完成 Google 账号授权
4. 查看生成的 Sui 钱包地址

### 在代码中使用

```tsx
import { useZkLogin } from '@/contexts/ZkLoginContext';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import UserProfile from '@/components/auth/UserProfile';

function MyComponent() {
  const { isAuthenticated, session } = useZkLogin();

  return (
    <div>
      {!isAuthenticated ? (
        <GoogleLoginButton />
      ) : (
        <UserProfile />
      )}
    </div>
  );
}
```

## 技术实现

### 核心组件

1. **zkLogin 工具函数** (`src/utils/zkLogin.ts`)
   - 生成临时密钥对
   - 处理 Google OAuth 流程
   - 计算 Sui 地址

2. **React 上下文** (`src/contexts/ZkLoginContext.tsx`)
   - 全局状态管理
   - 会话持久化

3. **UI 组件**
   - `GoogleLoginButton` - 登录按钮
   - `UserProfile` - 用户信息展示
   - `AuthCallback` - OAuth 回调处理

### 工作流程

1. **初始化**：生成临时密钥对和 nonce
2. **OAuth 授权**：重定向到 Google 进行身份验证
3. **回调处理**：接收 JWT token 并验证
4. **地址生成**：使用 `jwtToAddress` 计算 Sui 地址
5. **会话管理**：存储用户信息和状态

## 安全考虑

- 临时密钥对仅存储在 sessionStorage 中
- JWT token 用于地址计算后可以丢弃
- 用户盐值基于 Google sub 字段生成
- 支持会话过期和自动清理

## 故障排除

### 常见问题

1. **"Google Client ID not configured"**
   - 检查 `.env.local` 文件中的 `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

2. **"No ID token found in callback"**
   - 确认 Google OAuth 配置中的重定向 URI 正确
   - 检查授权范围包含 `openid`

3. **地址生成失败**
   - 确认网络连接正常
   - 检查 Sui 网络状态

### 调试模式

在浏览器开发者工具中查看：
- Console 日志
- Network 请求
- Local/Session Storage 内容

## 生产部署

### 环境变量更新

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_production_client_id
NEXT_PUBLIC_REDIRECT_URI=https://yourdomain.com/auth/callback
NEXT_PUBLIC_SUI_NETWORK=mainnet
```

### Google OAuth 配置

更新 Google Cloud Console 中的：
- 授权重定向 URI
- 授权 JavaScript 来源

## 相关链接

- [Sui zkLogin 文档](https://docs.sui.io/concepts/cryptography/zklogin)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Sui SDK 文档](https://sdk.mystenlabs.com/typescript) 