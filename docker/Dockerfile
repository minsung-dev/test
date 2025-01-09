# Node.js를 베이스 이미지로 사용합니다.
FROM node:18

# 필요한 빌드 도구 설치
# 마지막 rm 명령어는 이미지 경량화를 위한 패키지 캐시 삭제
RUN apt-get update && \
    apt-get install -y python3 make gcc g++ && \
    rm -rf /var/lib/apt/lists/*

# 컨테이너 내에서 사용할 작업 디렉토리 설정
WORKDIR /app

# docker-compose 파일에서 지정한 인수 가져오기
# 디버깅에 필요한 nodemon 패키지의 설치 여부
ARG INSTALL_NODEMON

# 의존성 설치를 위한 파일을 컨테이너 내부로 복사한 뒤 npm install
# 회사 내부 라이브러리 설치를 위한 .npmrc 파일도 필요함 (없을 경우 주석처리)
#COPY .npmrc ./
COPY package.json ./
RUN npm install --verbose

WORKDIR /app/public
COPY public/package.json ./
RUN yarn install

# 프로젝트 소스코드를 컨테이너로 복사
# .dockerignore 파일에 지정된 파일과 폴더는 복사하지 않음
WORKDIR /app
COPY . .

# INSTALL_NODEMON 인수에 따라 nodemon을 설치하는 스크립트 실행
RUN if [ "$INSTALL_NODEMON" = "true" ]; then npm install -g nodemon; fi

# 애플리케이션 포트 노출
# bin/www(또는 .env)에서 지정한 PORT와 일치해야 함
# 특이사항이 없다면 3000번을 사용함
EXPOSE 3000

# Node.js 디버거 포트 노출
# 해당 포트는 실행 환경변수를 통해 전달됨
EXPOSE $DEBUG_PORT

# 애플리케이션 실행 명령어
# docker-compose에서 선언
# CMD npm start