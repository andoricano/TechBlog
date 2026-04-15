t = int(input())
for i in range(t):
    n = int(input())
    s = [list(map(int, input().split(" "))) for _ in range(2)]
    m = [[0] * (n + 1) for _ in range(2)]

    m[0][0] = s[0][0]
    m[1][0] = s[1][0]

    if n == 1:
        print(max(m[0][0], m[1][0]))
        continue

    m[0][1] = m[1][0] + s[0][1]
    m[1][1] = m[0][0] + s[1][1]

    # 점화식 축약
    for i in range(2, n):
        m[0][i] = max(m[1][i - 1], m[1][i - 2]) + s[0][i]
        m[1][i] = max(m[0][i - 1], m[0][i - 2]) + s[1][i]

    print(max(max(m[0]), max(m[1])))
