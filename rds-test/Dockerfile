# 使用 AWS 提供的 Lambda Node.js 基础镜像
FROM public.ecr.aws/lambda/nodejs:18

# 设置工作目录
WORKDIR ${LAMBDA_TASK_ROOT}

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有源代码
COPY . .

# 设置 Lambda 处理函数
CMD [ "index.handler" ] 