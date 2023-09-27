


## 开发代码

1, 导入时间
```
import { formatTime } from '@/utils';
import { parseTime } from '@/utils/ruoyi';

//导入
formatTime,
parseTime,

// 使用
<span>{{ formatTime(scope.row.loginTime) }}</span>

//table使用
<template slot-scope="scope">
  {{ formatTime(scope.row.loginTime) }}
</template>
```


## 项目运行命令

```bash
git clone https://gitee.com/y_project/RuoYi-Vue

npm install
npm install --registry=https://registry.npmmirror.com
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
