# JavaScript의 Object

일반적으로 OOP 개념을 다룬 언어들은 class의 구현을 통한 인스턴스에 접근할 수 있는 pointer value에 reference의 개념을 더해 object를 구현했다.
그러나 JS의 경우 class라는 개념이 없었다. 그러나 JS도 object라는 타입이 있고 키워드도 있다.
같은 개념을 다르게 사용하는 방식을 인지하기 위해서 먼저 JS의 object 초기화 과정을 상세하게 파악할 필요가 있다.

## JavaScript Object Allocation
다음 코드를 보면 절대 하면 안되는 행위를 담아 둔 코드라고 생각하나, 한 번 정도 봐두면 좋을 코드라고 생각한다.
@[code]("code/object_ex.js")

코드 윗 부분은 이전에 간단하게 다뤘던 const object이다. const의 경우 id에 연결되는 값 변경이 잠금이 되는거지, heap에 있는 데이터 영역은 잠금되지 않는다. id object에 접근하면 할당 에러가 발생한다.
여기서 신기한건 Object를 선언했고 해당 변수에 함수를 넣었는데도 정작 constant 에러만 발생한 점을 볼 수 있다. var로 하나 만들고 이것저것 넣어보면 참조값이 다 들어간다.
참조값 들어가는 건 둘째치고 참조하여 바라보고 있는 타입과 다른 행위를 해도 일단 실행이 된다.
여기서 알 수 있는 사실은 동작으로서의 타입만 존재하고, 저장 상태에 대한 타입은 아예 없다는 것이다.  
- ()라는 예약어로 함수 포인터 호출까지 하나 정작 가보니 함수 형태의 데이터가 아니어서 에러를 뱉어낸다.  
- []라는 예약어로 Array형태로 읽어들이려고 하나 정작 가보니 배열 형태의 데이터가 아니어서 에러를 뱉어낸다.  
동작으로서의 에러가 잡힌다면 그나마 디버깅이 가능하다.

다만 여기서 문제는 Property에 접근하는 케이스이다. class로 만들었을 경우 [] 호출이 가능하다.
class라는 예약어로 instance를 만들어 줬고, 거기에 []와 이상한 property를 호출했더니 에러가 아닌 undefined가 출력된다.
Array에 이상한 property를 호출했더니 undefined가 출력된다.
이 부분에 대한 확실한 답을 내리기 위해선 Prototype에 대해 알아야 한다. 
간단하게 말하자면 객체 원형이라고 볼 수 있다. java의 object와 동작은 다르지만 구조적으로 비견된다.
즉 object라는 키워드 및 JS에서 사용하는 모든 Reference vairable은 Prototype과 연관되어 있는 것이다.

다음 코드를 보자.
@[code]("code/object_property.js")
마지막만 간단하게 설명하자면 class에 array를 넣은건 괜찮으나 class 내부의 array에 뜬금없이 property를 집어 넣었다.
이 정도면 사실 일반적으로 사용하는 property라고 할 수도 없다. 개인적으로 pair item을 집어 넣었다고 표현하고 싶다.
이는 prototype을 참조하는 instance로 만든 것으로 추후에 확실하게 정리하도록 하겠다.

정리하자면 object type의 할당이라는 것은 prototype을 연결하는 것이다.