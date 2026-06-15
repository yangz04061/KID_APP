# 群晖 NAS 部署说明

## 1. 是否可以部署

可以。这一个项目是纯前端静态网站，最适合部署到群晖 NAS 的方式是：

- 使用群晖 `Container Manager`。
- 通过 Docker 构建镜像。
- 用 Nginx 对外提供网页访问。

当前仓库已经补好了以下部署文件：

- `Dockerfile`
- `nginx.conf`
- `compose.yaml`

## 2. 推荐部署方式

推荐使用 `Container Manager` 的“项目 / Project”方式部署 `compose.yaml`。

这样做的好处：

- 后续更新方便。
- 不需要在 NAS 上手工安装 Node.js。
- Nginx 容器启动后即可直接提供访问。

## 3. 部署前提

请先确认你的群晖满足以下条件：

1. 已安装 `Container Manager`。
2. NAS 可以访问外网拉取 Docker 镜像。
3. 你能把当前项目目录上传到 NAS，例如放到 `docker/kid-app` 目录。

## 4. 部署步骤

### 方案 A：用群晖 Project 直接部署

1. 把整个项目目录上传到群晖，例如：
   - `/volume1/docker/kid-app`
2. 打开群晖 `Container Manager`。
3. 进入 `项目 / Project`。
4. 新建项目，项目来源选择“从 docker-compose 文件创建”。
5. 选择项目目录中的 `compose.yaml`。
6. 启动项目。

默认会把 NAS 的 `8080` 端口映射到容器的 `80` 端口。

部署完成后，局域网中可以通过以下地址访问：

- `http://你的群晖IP:8080`

例如：

- `http://192.168.1.20:8080`

### 方案 B：先本地构建镜像，再导入群晖

如果你不想让 NAS 自己构建，也可以先在电脑上构建镜像：

```powershell
docker build -t kid-app:latest .
```

然后导出镜像：

```powershell
docker save -o kid-app.tar kid-app:latest
```

再把 `kid-app.tar` 上传到群晖并导入到 `Container Manager` 中。

## 5. 端口说明

当前 `compose.yaml` 里使用的是：

- NAS 端口：`8080`
- 容器端口：`80`

如果群晖上 `8080` 已被占用，可以改成其他端口，例如：

```yaml
ports:
  - "8090:80"
```

然后通过：

- `http://你的群晖IP:8090`

访问。

## 6. 更新应用

后续你修改了前端代码后，更新方式如下：

1. 把最新项目文件同步到群晖项目目录。
2. 在 `Container Manager` 中重新构建并重启项目。

如果你使用的是项目方式，通常可以在项目界面里执行重新部署。

## 7. 手机访问方式

部署到群晖后，手机访问会比现在本机开发模式更稳定。

只要手机和群晖在同一局域网，浏览器中输入：

- `http://群晖IP:8080`

即可访问。

如果你还希望在外网访问，可以继续做：

- 反向代理。
- HTTPS 证书。
- DDNS 或自定义域名。

## 8. 后续可选优化

如果你准备长期给家里人使用，下一步建议做：

1. 在群晖反向代理里绑定一个更好记的域名。
2. 开启 HTTPS。
3. 把应用封装为手机桌面快捷方式。
4. 后续再考虑做 PWA 离线缓存。