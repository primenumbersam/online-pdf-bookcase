# GitHub Deployment Guide for online-pdf-bookcase

`online-pdf-bookcase` 프로젝트를 GitHub에 수동으로 설정하고 배포하는 단계별 가이드입니다.

## 1. GitHub Repository 생성 (CLI)

GitHub CLI(`gh`)가 설치되어 있다고 가정하거나, 웹사이트에서 직접 생성 후 연결하는 방법을 안내합니다.

### GitHub CLI (`gh`) 사용 시
터미널에서 아래 명령어를 순서대로 실행하세요.

```bash
# 1. 로그인 (이미 되어있다면 생략)
gh auth login

# 2. 현재 디렉토리에서 레포지토리 생성 (public으로 생성 권장)
# -y: 모든 프롬프트에 yes
# --public: 공개 저장소
gh repo create online-pdf-bookcase --public --source=. --remote=origin
```

### 웹사이트에서 생성 시
1. GitHub 웹사이트 우측 상단 `+` > `New repository`
2. Repository name: `online-pdf-bookcase`
3. `Public` 선택 (Private은 Pages 사용 시 유료일 수 있음)
4. `Create repository` 클릭
5. 터미널에서 다음 명령어 실행 (YOUR_USERNAME을 본인 아이디로 변경):

```bash
git remote add origin https://github.com/YOUR_USERNAME/online-pdf-bookcase.git
```

## 2. 코드 푸시 (Push)

로컬의 코드를 GitHub에 업로드합니다.

```bash
# 1. git 초기화 (이미 되어있다면 생략)
git init

# 2. 모든 파일 스테이징
git add .

# 3. 커밋
git commit -m "initial commit: online-pdf-bookcase setup"

# 4. 메인 브랜치 설정 및 푸시
git branch -M main
git push -u origin main
```

## 3. GitHub 설정 (필수!)

**이 단계가 없으면 자동 배포가 작동하지 않습니다.**

### A. GitHub Actions 권한 설정 (쓰기 권한 부여)
Actions 봇이 변환된 이미지를 다시 커밋(Push)할 수 있도록 권한을 줘야 합니다.

1. GitHub 레포지토리 페이지로 이동
2. **Settings** (상단 탭) > **Actions** (좌측 메뉴) > **General** 클릭
3. 스크롤을 내려 **Workflow permissions** 섹션 찾기
4. **Read and write permissions** 선택
5. **Save** 버튼 클릭

### B. GitHub Pages 활성화
Actions가 아무리 잘 돌아도 Pages가 꺼져있으면 사이트가 안 보입니다.

1. **Settings** (상단 탭) > **Pages** (좌측 메뉴)
2. **Build and deployment** 섹션의 **Source**를 `Deploy from a branch`로 선택 (기본값)
3. **Branch**를 [main]으로 선택
4. **Save** 버튼 클릭

## 4. 테스트 (자동화 확인)

이제 설정이 끝났습니다. 잘 작동하는지 확인해봅시다.

1. 로컬 `pdf-source/` 폴더에 새로운 PDF 파일을 하나 넣습니다.
2. 변경 사항을 푸시합니다.

```bash
git add pdf-source/
git commit -m "feat: add test pdf"
git push
```
**Troubleshoot**

```bash
git pull origin main --rebase
git push origin main
```

3. GitHub 레포지토리의 **Actions** 탭으로 이동합니다.
4. `Update PDF Library` 워크플로우가 노란색(진행 중)으로 뜨는지 확인합니다.
5. 초록색 체크(성공)가 뜨면, 잠시 후(약 1~2분) **Settings > Pages** 상단에 뜬 URL(`https://YOUR_ID.github.io/online-pdf-bookcase/`)로 접속해봅니다.