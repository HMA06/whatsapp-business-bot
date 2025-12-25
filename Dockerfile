# استخدام نسخة Debian لأنها تدعم تشغيل المتصفحات بشكل أفضل
FROM node:20

# تنصيب المتصفح (Chromium) والمكتبات اللازمة للـ Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk-bridge2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# إخبار المكتبة بمكان وجود المتصفح في السيرفر
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

# استخدام start:prod لضمان تشغيل NestJS بشكل صحيح
CMD ["npm", "run", "start:prod"]