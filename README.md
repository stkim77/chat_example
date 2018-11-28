- 프로젝트 개발 환경

  - Server : back-end 개발을 위하여 node.js + socket.io 를 사용하였으며, unit test를 위하여 mocha 를 사용하였습니다.
  - client : font-end 개발을 위하여 react + redux 를 사용하였으며, UI test를 위하여 storybook 을 사용하였습니다.

- 프로젝트 실행 환경

  먼저 프로젝트 실행을 위해서는 다음 항목이 설치되어야 합니다.

  1. node.js : https://nodejs.org/ko/
  2. yarn    : https://yarnpkg.com/en/

  위 항목들 설치후 아래 github 주소에서 소스를 다운 받습니다. (zip 파일을 직접 받아도 되며, git 도구를 이용하여 clone을 하여도 됩니다.)

  - https://github.com/stkim77/chat_example

  소스를 보면 다음과 같이 2개의 폴더가 있는 것을 확인 할 수 있습니다.

  - chat_server
  - chat_client

  이제 터미널을 열어서 chat_server, chat_client 디렉토리로 이동을 합니다.
  해당 위치에 package.json 파일이 있는 것을 확인 후, 다음과 같이 yarn 명령어를 실행 합니다.

  1. yarn install
  2. yarn start

  (chat_server를 먼저 실행 후, chat_client를 실행해야 합니다.)

  chat_client 에서 'yarn start' 명령을 실행하면 기본 브라우져에서 [http://localhost:3000/] 사이트가 실행 됩니다.

  * 주의사항 : 서버가 4001 포트, 클라이언트가 3000 포트를 사용하고 있으니 해당 포트를 사용하는 어플리케이션이 있는 경우 중지 후 실행해야 합니다.

- 세부 구현 사항 [서버]

  서버의 경우 websocket을 통하여 정해진 message를 받아서 처리하는 방식으로 구현을 하였으며,
  아래와 같은 message를 정의하여 구현하였습니다.

  - enter user (username을 입력하여 채팅서비스를 시작)
    - response : room list [to : request socket] (입장한 사용자에게 현재 서버에서 제공하는 채팅방의 리스트를 전달)
  - join room (사용자가 특정 채팅방에 들어가는 기능)
    - response : announce about join msg [to : broadcast in room] (채팅방에 있는 사용자들에게 들어오는 사용자가 있다는 공지를 전달)
  - leave room (사용자가 특정 채팅방에서 나가는 기능)
    - response : announce leave join msg [to : broadcast in room] (채팅방에 있는 사용자들에게 나가는 사용자가 있다는 공지를 전달)
  - message (채팅 메세지를 전달하는 기능)
    - response : send message [to : broadcast in room] (채팅방에 있는 사용자들에게 채팅 메세지를 전달)
  - image (채팅 이미지를 전달하는 기능)
    - response : send image [to : broadcast in room] (채팅방에 있는 사용자들에게 채팅 이미지를 전달)
  - request userlist (초대 가능한 사용자 목록을 요청하는 기능 - 채팅서비스를 시작하였으나 같은 방에 있지 않은 사용자)
    - response : user list [to : request socket] (요청한 사용자에게 초대 가능자 목록을 전달)
  - invite user (특정 사용자를 채팅방 초대하는 기능)
    - response : send invite event [to : inviting socket] (특정 사용자에게 초대 메세지를 전달)
  - accept invite (초대된 채팅방에 들어가는 기능)
    - response : announce leave join msg [to : broadcast in room] (나가는 채팅방에 있는 사용자들에게 공지 전달)
    - response : announce about join msg [to : broadcast in room] (들어가는 채팅방에 있는 사용자들에게 공지 전달)

  해당 기능들의 경우 message를 요청한 사용자가 실제 username을 입력하고 입장한 사람인지 체크를 하여,
  입장한 사람이 아닌 경우에는 예외처리를 하도록 하였습니다.

- 세부 구현 사항 [클라이언트]

  클라이언트의 경우 총 3개의 화면(채팅 서비스 로그인 화면, 채팅방 리스트 화면, 채팅방 화면)으로 구성 하였으며,
  서버 통신으로 받게 되는 정보들은 redux를 이용하여 저장을 하고 각 컴포넌트에서 읽어오는 형태로 구현 하였습니다.

  서버에서 예외처리 message를 받으면 '채팅 서비스 로그인 화면'으로 이동하도록 구현 하였습니다.

  추가로 다음과 같은 제약 조건을 구현하였습니다.

  1. username의 경우 최대 10자 까지 사용 가능
  2. 채팅 메세지는 최대 200자까지 전송 가능
  3. 채팅 이미지는 최대 2M 크기의 이미지까지 전송 가능
  4. 닉네임 입력에 대한 세션은 해당 페이지를 리프레시 하지 않는 상태에서만 유지

  클라이언트에서 사용하는 url 주소는 다음 3가지 입니다.

  (그 외의 주소를 입력하면 'NoMatch' 화면이 실행되도록 하였습니다.)

  - http://localhost:3000/
  - http://localhost:3000/signin
  - http://localhost:3000/main

- Unit Test 실행

  unit test 실행을 위해서는 터미널에서 다음 명령어를 실행하여 mocha를 global로 설치해야 합니다.

  - yarn global add mocha

  그 다음에 터미널을 2개 실행하여 chat_server 디렉토리로 이동하여 다음 명령어를 각 터미널에 순서대로 실행하면 됩니다.

  1. yarn start
  2. yarn test

  Unit Test의 경우 앞에서 설명한 서버의 message 정의 구현 별로 test case 작성하여 간단한 결과 확인만 하였습니다.

  (서버 유닛 테스트를 실행하는 경우에는 chat_client는 실행하지 않은 상태로 진행해야 합니다.)

- UI Test 실행

  storybook 관련 모듈은 위의 chat_client 에서 'yarn install' 명령어로 같이 설치가 됩니다.
  따라서 chat_client 디렉토리에서 다음 명령어를 실행 후 [http://localhost:9001/] 에 접속하여 관련 화면을 확인 할 수 있습니다.

  - yarn storybook

  UI Test의 경우 해당 UI 컴포넌트의 기본 레이아웃 개발을 위하여 사용하였습니다.

  redux를 사용하였기 때문에, 데이터가 없어서 보이지 않는 경우는 src/reducer/index.js 파일에서 default 값을 테스트 용으로 변경하여 확인하면서 작업하였습니다.
