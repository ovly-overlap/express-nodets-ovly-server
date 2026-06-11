import winston from "winston";

// TODO : pino로 변경

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    process.env.NODE_ENV === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

// 1. 로그를 어떤 형식(Format)으로 찍을지 설정
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // 시간 표시 형식
  winston.format.printf(({ timestamp, level, message, stack }) => {
    // 에러가 터져서 stack(몇번째 줄 에러인지) 정보가 있으면 같이 출력하고, 없으면 메시지만 출력
    return stack
      ? `[${timestamp}] [${level}]: ${message}\n${stack}`
      : `[${timestamp}] [${level}]: ${message}`;
  })
);

// 2. 윈스턴 로거 인스턴스 생성
const logger = winston.createLogger({
  // 개발 단계에서는 debug까지 다 보고, 실서비스에서는 info 이상만 기록하는 게 보통입니다.
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: logFormat,
  transports: [
    // ① 콘솔창에 로그 찍기 설정
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }), // debug는 파랗게, error는 빨갛게 색깔 넣기!
        logFormat
      ),
    }),

    // ② (선택) 서비스 환경일 때 치명적인 에러만 따로 파일로 보관하고 싶다면 켜세요!
    // new winston.transports.File({
    //   filename: 'logs/error.log',
    //   level: 'error'
    // })
  ],
});

// 3. 아까 에러 핸들러에서 낱개로 편하게 부를 수 있게 각각 export 해줍니다.
export const info = (message: string) => logger.info(message);
export const warn = (message: string) => logger.warn(message);
export const debug = (message: string) => logger.debug(message);

// 아까 에러 핸들러가 목말라했던 바로 그 'error' 함수!
export const error = (err: unknown) => {
  if (err instanceof Error) {
    // 에러 객체 통째로 넘겨서 메세지와 stack trace를 다 찍히게 합니다.
    logger.error(err.message, { stack: err.stack });
  } else {
    logger.error(String(err));
  }
};

// 원본 로거를 통째로 쓰고 싶을 때를 위해 default로도 내보내 줍니다.
export default logger;
