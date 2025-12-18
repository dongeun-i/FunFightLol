/**
 * Riot API 테스트 스크립트
 * 
 * 사용법:
 * 1. .env.local 파일에 RIOT_API_KEY를 설정
 * 2. npm run test-api 실행
 */

// .env.local 파일 로드
import * as dotenv from 'dotenv';
import * as path from 'path';
import chalk from 'chalk';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// 환경 변수 디버깅
console.log(chalk.gray('==============================================='));
console.log(chalk.cyan.bold('환경 변수 로드 확인'));
console.log(chalk.gray('==============================================='));
console.log(`${chalk.yellow('API Key')}: ${process.env.RIOT_API_KEY ? chalk.green('설정됨 (' + process.env.RIOT_API_KEY.substring(0, 15) + '...)') : chalk.red('설정되지 않음')}`);
console.log(`${chalk.yellow('Region')}: ${chalk.green(process.env.RIOT_API_REGION || 'kr')}`);
console.log(chalk.gray('===============================================\n'));

// 환경 변수 확인
if (!process.env.RIOT_API_KEY) {
  console.error(chalk.red('==============================================='));
  console.error(chalk.red.bold('RIOT_API_KEY 환경 변수가 설정되지 않았습니다.'));
  console.error(chalk.red('==============================================='));
  console.error(chalk.yellow('.env.local 파일을 생성하고 API 키를 설정하세요.\n'));
  console.error(chalk.gray('예시:'));
  console.error(chalk.gray('RIOT_API_KEY=your_api_key_here'));
  console.error(chalk.gray('RIOT_API_REGION=kr'));
  console.error(chalk.red('===============================================\n'));
  process.exit(1);
}

import { searchSummoner } from '../lib/api/summoner-service';

async function testAPI() {
  console.log(chalk.gray('\n==============================================='));
  console.log(chalk.cyan.bold('Riot API 연동 테스트 시작'));
  console.log(chalk.gray('===============================================\n'));

  // 테스트할 Riot ID 입력
  const testRiotId = '은동이는죽었다#KR1';
  console.log(`${chalk.yellow('테스트 계정')}: ${chalk.white(testRiotId)}\n`);

  try {
    console.log(chalk.blue('소환사 정보 조회 중...\n'));
    const result = await searchSummoner(testRiotId);
    
    console.log(chalk.green('==============================================='));
    console.log(chalk.green.bold('소환사 정보 조회 성공'));
    console.log(chalk.green('==============================================='));
    console.log(`${chalk.cyan('PUUID         ')}: ${chalk.white(result.summoner.puuid)}`);
    console.log(`${chalk.cyan('소환사명      ')}: ${chalk.white(result.summoner.name)}`);
    console.log(`${chalk.cyan('레벨          ')}: ${chalk.yellow(result.summonerLevel)}`);
    console.log(`${chalk.cyan('프로필 아이콘 ')}: ${chalk.yellow(result.profileIconId)}`);
    console.log(chalk.green('===============================================\n'));
    
    console.log(chalk.green.bold('✓ API 연동 테스트 완료!'));
    console.log(chalk.gray('다른 소환사를 테스트하려면 testRiotId 변수를 수정하세요.\n'));
  } catch (error: any) {
    console.log(chalk.red('\n==============================================='));
    console.error(chalk.red.bold('API 연동 테스트 실패'));
    console.error(chalk.red('==============================================='));
    
    if (error.response) {
      // Riot API 응답 에러
      console.error(`${chalk.yellow('상태 코드   ')}: ${chalk.red(error.response.status)}`);
      console.error(`${chalk.yellow('에러 메시지 ')}: ${chalk.red(error.response.data?.status?.message || '알 수 없는 에러')}`);
      console.error(chalk.gray('-----------------------------------------------'));
      
      if (error.response.status === 401) {
        console.error(chalk.red('API 키가 유효하지 않습니다.'));
        console.error(chalk.yellow('.env.local 파일을 확인하세요.'));
      } else if (error.response.status === 403) {
        console.error(chalk.red('API 키가 만료되었거나 권한이 없습니다.'));
      } else if (error.response.status === 404) {
        console.error(chalk.red('소환사를 찾을 수 없습니다.'));
        console.error(chalk.yellow('Riot ID를 확인하세요.'));
      } else if (error.response.status === 429) {
        console.error(chalk.red('API 요청 한도를 초과했습니다.'));
        console.error(chalk.yellow('잠시 후 다시 시도하세요.'));
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없음
      console.error(chalk.red('네트워크 에러: 응답을 받지 못했습니다.'));
      console.error(chalk.yellow('API 서버가 다운되었거나 네트워크 연결을 확인하세요.'));
    } else {
      // 요청 설정 중 에러
      console.error(`${chalk.red('에러')}: ${chalk.red(error.message)}`);
    }
    
    console.error(chalk.red('===============================================\n'));
    process.exit(1);
  }
}

// 스크립트 실행
testAPI();
