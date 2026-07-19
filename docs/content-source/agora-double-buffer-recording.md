# Agora 더블 버퍼링 기반 음성 녹음

간단한 설명: Agora 음성 버퍼 녹음 기능 최적화

## 업무 동기

[Agora](https://www.agora.io/kr/)는 실시간 음성, 영상, 메시지 등 다양한 통신 기능을 제공하는 플랫폼입니다.
[Moii](https://www.moii.net/)는 Agora를 활용해 음성 채팅 서비스를 제공하고 있습니다.

사용자 간 대화 기능을 지원하면서 두 가지 주요 요구사항이 발생했습니다.
첫 번째는 사용자의 음성 입력 여부에 따라 아바타가 립싱크하는 기능이고,
두 번째는 Agora를 통해 공유되는 음성을 실시간으로 녹음하는 기능이었습니다.

첫 번째 기능은 제공되는 API를 통해 간단히 구현할 수 있었지만,
두 번째 기능은 API 사용 시 심각한 성능 저하가 발생하는 문제가 있었습니다.

실시간 유저 간 소통에 지장이 없으면서 동시에 음성 녹음이 원활히 이루어져야 했기 때문에,
API 기반의 최적화 작업을 진행하게 되었습니다.

## 업무 전개

먼저, [개발자 문서](https://api-ref.agora.io/en/voice-sdk/unity/4.x/API/rtc_api_overview.html)를 통해 관련된 API를 파악했습니다.

파악된 API를 통해 최적화를 어떻게 진행해야 할 것인지 개요를 잡았습니다.

문서로 표시되지 않는 부분이 있어, Agora 기술 지원팀 Slack 채널을 통해 문의를 진행했습니다.

이후 스펙을 확정하고, 더블 버퍼링 기반의 버퍼 전달 기능을 구현해야 하는 것을 목표로 제작에 들어갔습니다.

## 워크 다이어그램

https://www.figma.com/board/MIQEXKahtL5xCwCPBNBKu0/Agora-%EB%8D%94%EB%B8%94-%EB%B2%84%ED%8D%BC%EB%A7%81-%EA%B8%B0%EB%B0%98-%EC%9D%8C%EC%84%B1-%EC%A0%84%EB%8B%AC%EB%8F%84?node-id=0-1&t=ggyMhXSC8bkSmqkR-1

## 시연 영상

https://www.youtube.com/embed/t_vcZU3ZO-0

## 업무 성과

프레임(렌더링)을 유지하면서 실시간으로 음성을 다중 사용자에게 전송함과 동시에
음성을 녹음하고 아바타의 립싱크를 수행할 수 있게 되었습니다.

Thread의 특성을 이해하고 Multi Thread를 활용하는 능력이 크게 향상되었습니다.

Unity MainThread의 제한된 연산 자원을 이해하고, 거기에 맞는 최적화 전략을 수립할 수 있게 되었습니다.
